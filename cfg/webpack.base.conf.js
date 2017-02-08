var path = require('path');
var config = require('../config');
var utils = require('./utils');
var projectRoot = path.resolve(__dirname, '../');

module.exports = {
    entry: {
    },
    output: {
        path: config.build.assetsRoot,
        publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath,
        filename: '[name].js'
    },
    resolve: {
        extensions: ['', '.js'],
        fallback: [path.join(__dirname, '../node_modules')],
        alias: {
            'src': path.resolve(__dirname, '../src'),
            'assets': path.resolve(__dirname, '../src/assets'),
            'js': path.resolve(__dirname, '../src/js'),
            'style': path.resolve(__dirname, '../src/style'),
            'images': path.resolve(__dirname, '../src/assets/images'),
            'sounds': path.resolve(__dirname, '../src/assets/sounds'),
            'dist': path.resolve(__dirname, '../dist'),
        }
    },
    resolveLoader: {
        fallback: [path.join(__dirname, '../node_modules')]
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                //include: projectRoot,
                exclude: /node_modules/,
                query: {
                    presets: ['es2015']
                }
            },
            {
                test: /\.json$/,
                loader: 'json'
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url',
                query: {
                    limit: 5120,
                    name: utils.assetsPath('img/[name].[ext]')
                }
            },
            {
                test: /\.(mp3|wav)(\?.*)?$/,
                loader: 'url',
                query: {
                    limit: 2048,
                    name: utils.assetsPath('sound/[name].[ext]')
                }
            },
            {
                test: /\.(woff2|eot|ttf|otf)$/,
                loader: "url?limit=10000&mimetype=application/octet-stream",
                query: {
                    name: utils.assetsPath('fonts/[name].[ext]')
                }
            }
        ]
    },
};
