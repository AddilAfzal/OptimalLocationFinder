var path = require("path");
var webpack = require('webpack');
var BundleTracker = require('webpack-bundle-tracker');

module.exports = {
    context: __dirname,
    mode: 'development',
    entry: {'main': ['@babel/polyfill', './Core/static/js/index']},

    output: {
        path: path.resolve('./Core/static/bundles/'),
        filename: "[name]-[hash].js",
    },

    plugins: [
        new BundleTracker({filename: './webpack-stats.json'}),
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                  loader: "babel-loader"
                }
            },
        ]
    },
    resolve: {
        extensions: ['*', '.js', '.jsx']
    }

};