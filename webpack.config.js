'use strict';

const path = require('path');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const miniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const fs = require('fs');

function generateEntryPoints(directory) {
    const entryPoints = {};
    const files = fs.readdirSync(directory);
    files.forEach(file => {
        const fileName = path.parse(file).name;
        entryPoints[fileName] = path.resolve(directory, file);
    });
    return entryPoints;
}

module.exports = {
    mode: 'development',
    entry: generateEntryPoints('./src/js'),
    output: {
        // Output for JS files
        filename: 'js/[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    devServer: {
        static: path.resolve(__dirname, 'dist'),
        port: 8080,
        hot: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html', // Output filename for index.html
        }),
        // new HtmlWebpackPlugin({
        //     template: './src/assignment.html',
        //     filename: 'assignment.html', // Output filename for assignment.html
        // }),
        new miniCssExtractPlugin({
            filename: 'css/[name].bundle.css', // Output filename for CSS files
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'src/images', to: 'images', noErrorOnMissing: true },
                { from: 'src/fonts', to: 'fonts', noErrorOnMissing: true },
            ],
        }),

    ],
    module: {
        rules: [
            {
                mimetype: 'image/svg+xml',
                scheme: 'data',
                type: 'asset/resource',
                generator: {
                    filename: 'icons/[hash].svg',
                },
            },
            {
                test: /\.(woff(2)?|ttf|eot)$/,
                type: 'asset/resource',
                generator: {
                    filename: './fonts/[name][ext]',
                },
            },
            {
                test: /\.(scss)$/,
                use: [
                    {
                        // Extracts CSS for each JS file that includes CSS
                        loader: miniCssExtractPlugin.loader,
                    },
                    {
                        // Interprets `@import` and `url()` like `import/require()` and will resolve them
                        loader: 'css-loader',
                    },
                    {
                        // Loader for webpack to process CSS with PostCSS
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [autoprefixer],
                            },
                        },
                    },
                    {
                        // Loads a SASS/SCSS file and compiles it to CSS
                        loader: 'sass-loader',
                    },
                ],
            },
        ],
    },
};
