const path = require('path');
const fs = require('fs');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const ROOT_PATH = path.resolve(__dirname, '..');
const PACKAGES_PATH = path.resolve(ROOT_PATH, 'packages');
const STORIES_PATH = path.resolve(ROOT_PATH, 'stories');
const STORY_BOOK_TS_CONFIG_PATH = path.resolve(__dirname, 'tsconfig.json');

module.exports = {
  stories: ['../stories/**/*.stories.@(tsx|mdx)'],
  addons: ['@storybook/addon-knobs', '@storybook/addon-docs/preset', '@storybook/addon-storysource'],
  webpackFinal: config => {
    config.module.rules.push(
      {
        test: /\.(ts|tsx)$/,
        include: [PACKAGES_PATH, STORIES_PATH],
        use: [
          {
            loader: 'awesome-typescript-loader',
            options: {
              configFileName: STORY_BOOK_TS_CONFIG_PATH
            }
          },
          {
            loader: 'react-docgen-typescript-loader',
            options: {
              tsconfigPath: path.resolve(STORIES_PATH, 'tsconfig.json')
            }
          }
        ]
      },
      {
        test: /\.s[ac]ss$/,
        include: [PACKAGES_PATH, STORIES_PATH],
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    );
    config.resolve.plugins.push(
      new TsconfigPathsPlugin({
        configFile: STORY_BOOK_TS_CONFIG_PATH,
      })
    );

    return config;
  }
};
