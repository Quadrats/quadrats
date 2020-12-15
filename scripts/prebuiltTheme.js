const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const { PWD } = process.env;
const PACKAGE_PATH = PWD;
const SRC_PATH = path.resolve(PACKAGE_PATH, 'src');

fs
  .readdirSync(SRC_PATH)
  .forEach((file) => {
    const result = /(.*)\.scss/g.exec(file);

    if (!result) {
      return;
    }

    const [, name] = result;
    const filePath = path.resolve(SRC_PATH, file);
    const buildPath = path.resolve(PACKAGE_PATH, 'prebuilts', `${name}.css`);

    execSync(`npx sass ${filePath} ${buildPath}`);
  });
