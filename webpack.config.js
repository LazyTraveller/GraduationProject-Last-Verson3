const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtracTextPlugin = require('extrac-text-webpack-plugin');

module.exports = {
    entry: __dirname + "app/main.js",
    output: {
        path: __dirname + "/build",
        filename: "bundle-[hash].js"
    },
    devtool: 'none',
    devServer: {
        contentBase: './public',
    }
}
