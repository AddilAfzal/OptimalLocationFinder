var path = require("path");
var webpack = require('webpack');
var BundleTracker = require('webpack-bundle-tracker');
const MinifyPlugin = require("babel-minify-webpack-plugin");

module.exports = {
    target: "web",
    context: __dirname,
    mode: 'development',
    entry: {
        'IndexPage': ['@babel/polyfill', './Core/static/js/IndexPage'],
    },
    output: {
        filename: "[name]-[hash].js",
        publicPath: 'http://127.0.0.1:9001/static/bundles/'
    },

    plugins: [
        // new webpack.HotModuleReplacementPlugin(),
        new BundleTracker({filename: './webpack-stats.json'})
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            }
        ]
    },
    resolve: {
        extensions: ['*', '.js', '.jsx']
    },
    devServer: {
        contentBase: path.resolve('./Core/static/bundles/'),
        hot: true,
        publicPath: 'http://127.0.0.1:9001/static/bundles/',
        watchContentBase: true,
        compress: true,
        port: 9001,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Headers": "Content-Type, Authorization, x-id, Content-Length, X-Requested-With",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
        }
    },

};