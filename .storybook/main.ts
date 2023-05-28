import { StorybookConfig } from '@storybook/react-webpack5';
import { resolve } from 'path';
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';

const ROOT_PATH = resolve(__dirname, '..');
const PACKAGES_PATH = resolve(ROOT_PATH, 'packages');
const STORIES_PATH = resolve(ROOT_PATH, 'stories');
const TS_CONFIG = resolve(ROOT_PATH, 'tsconfig.dev.json');

const config: StorybookConfig = {
  framework: '@storybook/react-webpack5',
  stories: ['../stories/**/*.stories.@(tsx|mdx)'],
  addons: [
    '@storybook/addon-essentials',
    {
      name: '@storybook/addon-styling',
      options: {
        sass: {
          implementation: require('sass'),
        },
      },
    },
  ],
  docs: {
    autodocs: 'tag',
  },
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

    config.resolve!.plugins = [
      new TsconfigPathsPlugin({
        configFile: TS_CONFIG,
      }),
    ];

    return config;
  },
};

export default config;
