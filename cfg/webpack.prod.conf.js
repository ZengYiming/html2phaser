var path = require('path');
var config = require('../config');
var utils = require('./utils');
var webpack = require('webpack');
var merge = require('webpack-merge');
var baseWebpackConfig = require('./webpack.base.conf');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var env = process.env.NODE_ENV === 'testing' ? require('../config/test.env') : config.build.env;

var webpackConfig = merge(baseWebpackConfig, {
    entry: {
        html2phaser: './src/h2p/index.js',
    },
    output: {
        path: config.build.assetsRoot,
        filename: utils.assetsPath('js/[name].js'),
        chunkFilename: utils.assetsPath('[id].js'),
        library: 'html2phaser',
        libraryTarget: 'umd'
    },
    module: {
        loaders: utils.styleLoaders({sourceMap: config.build.productionSourceMap, extract: true}),
    },
    devtool: config.build.productionSourceMap ? '#source-map' : false,
    plugins: [
        new webpack.DefinePlugin({
            'process.env': env
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
    ]
});

module.exports = webpackConfig;
