const path = require('path');

module.exports = {
  outputDir: 'docs',
  chainWebpack: config => {
    const defaultState = process.env.VUE_APP_DEFAULT_STATE; // mock or prod
    config.resolve.alias.set(
      'default-state',
      path.resolve(__dirname, `src/store/${defaultState}/default.ts`),
    );
  },
};
