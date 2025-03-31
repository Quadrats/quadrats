import { StorybookConfig } from '@storybook/react-webpack5';
import { resolve, dirname, join } from 'path';
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';

const ROOT_PATH = resolve(__dirname, '..');
const PACKAGES_PATH = resolve(ROOT_PATH, 'packages');
const STORIES_PATH = resolve(ROOT_PATH, 'stories');
const TS_CONFIG = resolve(ROOT_PATH, 'tsconfig.dev.json');

const config: StorybookConfig = {
  framework: getAbsolutePath("@storybook/react-webpack5"),
  stories: ['../stories/**/*.stories.@(tsx|mdx)'],

  addons: [getAbsolutePath("@storybook/addon-essentials"), {
    name: '@storybook/addon-styling',
    options: {
      sass: {
        implementation: require('sass'),
      },
    },
  }, getAbsolutePath("@storybook/addon-webpack5-compiler-babel")],

  docs: {},

  webpackFinal(config) {
    config.module!.rules = [
      ...(config.module?.rules ?? []),
      {
        test: /\.(ts|tsx)$/,
        include: [PACKAGES_PATH, STORIES_PATH],
        use: [{
          loader: 'ts-loader',
          options: {
            configFile: TS_CONFIG,
          },
        }]
      },
    ];

    config.resolve!.alias = {
      'react': resolve(__dirname, '../node_modules/react')
    }

    config.resolve!.plugins = [
      new TsconfigPathsPlugin({
        configFile: TS_CONFIG,
      }),
    ];

    return config;
  },

  typescript: {
    reactDocgen: 'react-docgen-typescript'
  }
};

export default config;

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, "package.json")));
}
