const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');
const { execSync } = require('child_process');
const glob = require('glob');
const { rollup } = require('rollup');
const ts = require('rollup-plugin-typescript2');
const postcss = require('rollup-plugin-postcss');
const autoprefixer = require('autoprefixer');

const { PWD } = process.env;
const rootPackagePath = PWD;
const rootPackageJson = require(path.resolve(rootPackagePath, 'package.json'));
const {
  name: rootPackageName,
  dependencies,
  peerDependencies,
  quadratsConfig = {},
} = rootPackageJson;

const externals = [
  ...Object.keys({
    ...dependencies,
    ...peerDependencies,
  }),
  rootPackageName,
]

const rootPackageDistPath = path.resolve(rootPackagePath, 'dist');
const rootPath = path.resolve(rootPackagePath, '..', '..');
const nodeModulesPath = path.resolve(rootPath, 'node_modules');
const tsPluginCachePath = path.resolve(nodeModulesPath, '.cache', 'rts2');

const ROOT_SYMBOL = '__ROOT__';
const DEPS_SET_RECORD = {};
const TRIGGERS_SET_RECORD = {};

function getPackagesInfos() {
  return new Promise((resolve, reject) => {
    glob('**/package.json', (_, files)=> {
      resolve(
        files.reduce((acc, file) => {
          const packageJsonPath = path.resolve(rootPackagePath, file);
          const packageJson = require(packageJsonPath);
          const dirs = file
            .replace(/package\.json|\/package\.json/, '')
            .split('/')
            .filter(Boolean);

          const name = [rootPackageName, ...dirs].join('/');

          if (packageJson.name !== name) {
            reject(`Package name '${name}' should equal '${packageJson.name}'`);
          }

          const packageSymbol = dirs.join('/') || ROOT_SYMBOL;

          acc[packageSymbol] = {
            packageJson,
            dirs,
          };

          return acc;
        }, {})
      );
    });
  });
}

function isExternal(id) {
  return externals.some(ext => id.startsWith(ext));
}

async function rollupBuild({ output, ...options }) {
  const bundle = await rollup(options);

  if (Array.isArray(output)) {
    await Promise.all(output.map(o => bundle.write(o)));
  } else {
    await bundle.write(output);
  }
}

async function build(packageSymbol, packageInfos) {
  const { packageJson, dirs } = packageInfos;
  const isRoot = packageSymbol === ROOT_SYMBOL;
  const packagePath = path.resolve(rootPackagePath, ...dirs);
  const packageDistPath = path.resolve(rootPackageDistPath, ...dirs);
  const packageJsonDistPath = path.resolve(packageDistPath, 'package.json');
  const packageSrcPath = path.resolve(packagePath, 'src');
  const indexPath = path.resolve(packageSrcPath, 'index.ts');

  if (!(isRoot && !fs.existsSync(indexPath))) {
    const tsconfig = path.resolve(packagePath, 'tsconfig.build.json');

    execSync(`npx tsc --project ${tsconfig} --outDir ${packageDistPath} --emitDeclarationOnly`);

    await rollupBuild({
      input: indexPath,
      external: isExternal,
      output: ['es', 'cjs'].map(format => ({
        file: path.resolve(packageDistPath, `index.${format}.js`),
        format,
        externalLiveBindings: false,
      })),
      plugins: [
        ts({
          check: false,
          cacheRoot: tsPluginCachePath,
          tsconfig,
          tsconfigOverride: {
            compilerOptions: {
              declaration: false,
            },
          },
        }),
        postcss({
          extract: false,
          modules: false,
          minimize: true,
          extensions: ['scss'],
          plugins: [
            autoprefixer(),
          ],
        }),
      ],
    });

    packageJson.main = './index.cjs.js';
    packageJson.module = './index.es.js';
    packageJson.typings = './index.d.ts';
  }

  delete packageJson.scripts;
  delete packageJson.quadratsConfig;

  fs.writeFileSync(packageJsonDistPath, `${JSON.stringify(packageJson, undefined, 2)}\n`);

  fse.copySync(
    packageDistPath,
    path.resolve(nodeModulesPath, ...packageJson.name.split('/'))
  );
}

async function tryBuild(packagesInfos, packageSymbol, triggerSymbol) {
  const deps = DEPS_SET_RECORD[packageSymbol];
  const triggers = TRIGGERS_SET_RECORD[packageSymbol];

  if (deps && triggerSymbol) {
    deps.delete(triggerSymbol);
  }

  if (deps && deps.size > 0) {
    return;
  }

  await build(packageSymbol, packagesInfos[packageSymbol]);

  triggers?.forEach(trigger => tryBuild(packagesInfos, trigger, packageSymbol));
}

async function run() {
  const packagesInfos = await getPackagesInfos();

  /**
   * prepare dist
   */
  fs.mkdirSync(rootPackageDistPath);

  /**
   * copy LICENSE
   */
  fse.copyFileSync(
    path.resolve(rootPath, 'LICENSE'),
    path.resolve(rootPackageDistPath, 'LICENSE')
  );

  /**
   * copy README.md
   */
  fse.copyFileSync(
    path.resolve(rootPackagePath, 'README.md'),
    path.resolve(rootPackageDistPath, 'README.md')
  );

  /**
   * copy files or directories by config
   */
  quadratsConfig.copy?.forEach((dir) => {
    fse.copySync(
      path.resolve(rootPackagePath, dir),
      path.resolve(rootPackageDistPath, dir)
    );
  });

  /**
   * resolve dependencies inside root package
   */
  Object.entries(packagesInfos).forEach(([packageSymbol, { packageJson }]) => {
    packageJson.quadratsConfig?.deps?.forEach((dep) => {
      const depsSet = DEPS_SET_RECORD[packageSymbol] || new Set();
      const triggersSet = TRIGGERS_SET_RECORD[dep] || new Set();

      depsSet.add(dep);
      DEPS_SET_RECORD[packageSymbol] = depsSet;
      triggersSet.add(packageSymbol);
      TRIGGERS_SET_RECORD[dep] = triggersSet;
    });
  });

  for (const packageSymbol in packagesInfos) {
    tryBuild(packagesInfos, packageSymbol);
  }
}

run();
