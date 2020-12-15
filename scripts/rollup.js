const path = require('path');
const { rollup } = require('rollup');
const ts = require('rollup-plugin-typescript2');
const postcss = require('rollup-plugin-postcss');
const autoprefixer = require('autoprefixer');

const { PWD } = process.env;
const packagePath = PWD;

function createCssPlugin() {
  return postcss({
    extract: false,
    modules: false,
    minimize: true,
    extensions: ['scss'],
    plugins: [
      autoprefixer(),
    ],
  });
}

function createTsPlugin(options) {
  return ts({
    cacheRoot: path.resolve(packagePath, '..', '..', 'node_modules', '.cache', 'rts2'),
    ...options,
  });
}

async function rollupBuild({ output, ...options }) {
  const bundle = await rollup(options);

  if (Array.isArray(output)) {
    await Promise.all(output.map(o => bundle.write(o)));
  } else {
    await bundle.write(output);
  }
}

exports.packagePath = packagePath;
exports.createCssPlugin = createCssPlugin;
exports.createTsPlugin = createTsPlugin;
exports.rollupBuild = rollupBuild;
