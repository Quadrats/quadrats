const path = require('path');
const fs = require('fs');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const ROOT_PATH = path.resolve(__dirname, '..');
const PACKAGES_PATH = path.resolve(ROOT_PATH, 'packages');
const STORIES_PATH = path.resolve(ROOT_PATH, 'stories');
const TS_CONFIG = path.resolve(ROOT_PATH, 'tsconfig.dev.json');

module.exports = {
  core: {
    builder: 'webpack5',
  },
  stories: ['../stories/**/*.stories.@(tsx|mdx)'],
  addons: ['@storybook/addon-knobs', '@storybook/addon-docs/preset', '@storybook/addon-storysource'],
  webpackFinal: config => {
    config.module.rules.push(
      {
        test: /\.(ts|tsx)$/,
        include: [PACKAGES_PATH, STORIES_PATH],
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: TS_CONFIG
            }
          },
          // {
          //   loader: 'react-docgen-typescript-loader',
          //   options: {
          //     tsconfigPath: TS_CONFIG
          //   }
          // }
        ]
      },
      {
        test: /\.s[ac]ss$/,
        include: [PACKAGES_PATH, STORIES_PATH],
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    );

    config.resolve.plugins = [
      new TsconfigPathsPlugin({
        configFile: TS_CONFIG,
      })
    ];

    return config;
  }
};
