var path = require("path");
var webpack = require('webpack');
var BundleTracker = require('webpack-bundle-tracker');

const defaults = [
    'babel-polyfill',
];

module.exports = {
    context: __dirname,
    mode: 'production',

    entry: {
        'index': [...defaults, './react/Index'],
        'servers': [...defaults, './react/Servers'],
        'bans': [...defaults, './react/Bans'],
        'admin_application': [...defaults, './react/AdminApplication'],
    },

    output: {
        path: path.resolve('./react/static/bundles'),
        filename: "[name]-[hash].js",
    },

    plugins: [
        new BundleTracker({filename: './webpack-stats.json'}),
    ],

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                }
            },
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                }
            },
            {
                test: /\.(scss)$/,
                use: [{
                    loader: 'style-loader', // inject CSS to page
                }, {
                    loader: 'css-loader', // translates CSS into CommonJS modules
                }, {
                    loader: 'postcss-loader', // Run post css actions
                    options: {
                        plugins: function () { // post css plugins, can be exported to postcss.config.js
                            return [
                                require('precss'),
                                require('autoprefixer')
                            ];
                        }
                    }
                }, {
                    loader: 'sass-loader' // compiles Sass to CSS
                }]
            },
        ]
    },


    resolve: {
        modules: ['node_modules', 'bower_components'],
        extensions: ['.js', '.jsx']
    },

};