const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');
const { execSync } = require('child_process');
const { rollupBuild, packagePath: rootPackagePath, createTsPlugin, createCssPlugin } = require('./rollup');

const rootPackageJson = require(path.resolve(rootPackagePath, 'package.json'));
const { name: rootPackageName, dependencies, peerDependencies, quadratsConfig } = rootPackageJson;
const rootPackageDeps = Object.keys({
  ...dependencies,
  ...peerDependencies,
});

const rootPackageDistPath = path.resolve(rootPackagePath, 'dist');
const rootPath = path.resolve(rootPackagePath, '..', '..');
const nodeModulesPath = path.resolve(rootPath, 'node_modules');

function copyDirAndFiles() {
  fse.copyFileSync(
    path.resolve(rootPath, 'LICENSE'),
    path.resolve(rootPackageDistPath, 'LICENSE')
  );

  fse.copyFileSync(
    path.resolve(rootPackagePath, 'README.md'),
    path.resolve(rootPackageDistPath, 'README.md')
  );

  quadratsConfig.copy?.forEach((dir) => {
    fse.copySync(
      path.resolve(rootPackagePath, dir),
      path.resolve(rootPackageDistPath, dir)
    );
  });
}

const DEPS_SET_RECORD = {};
const TRIGGERS_SET_RECORD = {};

function resolveDeps() {
  Object.entries(quadratsConfig.packages).forEach(([packageDepName, { deps }]) => {
    deps?.forEach((dep) => {
      const depsSet = DEPS_SET_RECORD[packageDepName] || new Set();
      const triggersSet = TRIGGERS_SET_RECORD[dep] || new Set();

      depsSet.add(dep);
      DEPS_SET_RECORD[packageDepName] = depsSet;
      triggersSet.add(packageDepName);
      TRIGGERS_SET_RECORD[dep] = triggersSet;
    });
  });
}

const ROOT_SYMBOL = '__ROOT__';

function depsToExternal(deps) {
  return deps.map(dep => dep === ROOT_SYMBOL ? rootPackageName : `${rootPackageName}/${dep}`)
}

async function build(packageDepName) {
  const { deps, sideEffects } = quadratsConfig.packages[packageDepName];
  const relativePackagePath = packageDepName;
  const isRoot = relativePackagePath === ROOT_SYMBOL;

  const splittedRelativePackagePath = isRoot ? [] : relativePackagePath.split('/');
  const packagePath = path.resolve(rootPackagePath, ...splittedRelativePackagePath);
  const packageDistPath = path.resolve(rootPackageDistPath, ...splittedRelativePackagePath);
  const packageJsonDistPath = path.resolve(packageDistPath, 'package.json');
  const indexPath = path.resolve(packagePath, 'src', 'index.ts');

  const splittedName = [...rootPackageName.split('/'), ...splittedRelativePackagePath];
  const name = splittedName.join('/');
  const packageJson = isRoot ? { ...rootPackageJson } : { name };

  if (!(isRoot && !fs.existsSync(indexPath))) {
    const tsconfig = path.resolve(packagePath, 'tsconfig.build.json');
    const external = [...rootPackageDeps];

    if (deps) {
      external.push(...depsToExternal(deps));
    }

    execSync(`npx tsc --project ${tsconfig} --outDir ${packageDistPath} --emitDeclarationOnly`);

    await rollupBuild({
      input: indexPath,
      external,
      output: ['es', 'cjs'].map(format => ({
        file: path.resolve(packageDistPath, `index.${format}.js`),
        format,
        externalLiveBindings: false,
      })),
      plugins: [
        createTsPlugin({
          check: false,
          tsconfig,
          tsconfigOverride: {
            compilerOptions: {
              declaration: false,
            },
          },
        }),
        createCssPlugin(),
      ],
    });

    packageJson.main = './index.cjs.js';
    packageJson.module = './index.es.js';
    packageJson.typings = './index.d.ts';
    packageJson.sideEffects = sideEffects ?? false;
  }

  delete packageJson.scripts;
  delete packageJson.quadratsConfig;

  fs.writeFileSync(packageJsonDistPath, `${JSON.stringify(packageJson, undefined, 2)}\n`);

  fse.copySync(
    packageDistPath,
    path.resolve(nodeModulesPath, ...splittedName)
  );
}

async function tryBuild(packageDepName, triggerDepName) {
  const deps = DEPS_SET_RECORD[packageDepName];
  const triggers = TRIGGERS_SET_RECORD[packageDepName];

  if (deps && triggerDepName) {
    deps.delete(triggerDepName);
  }

  if (deps && deps.size > 0) {
    return;
  }

  await build(packageDepName);

  triggers?.forEach(trigger => tryBuild(trigger, packageDepName));
}

async function run() {
  fs.mkdirSync(rootPackageDistPath);
  copyDirAndFiles(quadratsConfig.copy);
  resolveDeps();

  for (const packageDepName in quadratsConfig.packages) {
    tryBuild(packageDepName);
  }
}

run();
