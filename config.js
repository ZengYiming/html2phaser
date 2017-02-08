var path = require('path');

module.exports = {
  build : {
    env: { NODE_ENV: '"production"' },
    assetsRoot: path.resolve(__dirname, 'dist'),
    assetsSubDirectory : '',
    assetsPublicPath : '',
    productionSourceMap : false,
  },
  dev : {
    env : {NODE_ENV : '"development"'},
    port : 8989,
    assetsSubDirectory : 'static',
    assetsPublicPath : '/',
    proxyTable : {}
  }
};
