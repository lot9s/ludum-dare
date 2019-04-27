const CopyWebpackPlugin = require('copy-webpack-plugin');
const HTMLWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');


let CopyWebpackPluginConfig = new CopyWebpackPlugin([
    { from: 'static', to: 'static' }
]);

let HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
    template: __dirname + "/index.html",
    filename: "index.html",
    inject: "body"
});

let TerserPluginConfig = new TerserPlugin({
    test: /\.js$/,
    exclude: /node_modules/ 
});


module.exports = {
    entry: __dirname + "/src/index.js",

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ["babel-loader", "eslint-loader"]
            }
        ]
    },

    externals: {},

    output: {
        filename: "index-transpiled.js",
        path: __dirname + "/build"
    },

    plugins: [
        CopyWebpackPluginConfig,
        HTMLWebpackPluginConfig,
        TerserPluginConfig
    ],

    mode: "development"
};
