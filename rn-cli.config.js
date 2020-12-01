const blacklist = require('metro-config/src/defaults/blacklist');
module.exports = {
  resolver: {
    blacklistRE: blacklist([/#current-cloud-backend\/.*/, /amplify-backup\/.*/]),
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
};