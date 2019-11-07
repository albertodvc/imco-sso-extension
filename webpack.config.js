const webpack = require('webpack');
const path = require('path');
const fileSystem = require('fs');
const env = require('./utils/env');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

// load the secrets
var alias = {};

var secretsPath = path.join(__dirname, ('secrets.' + env.NODE_ENV + '.js'));

var fileExtensions = ['jpg', 'jpeg', 'png', 'gif', 'eot', 'otf', 'svg', 'ttf', 'woff', 'woff2'];

if (fileSystem.existsSync(secretsPath)) {
  alias['secrets'] = secretsPath;
}

var options = {
	mode: process.env.NODE_ENV || 'development',
	entry: {
		popup: path.join(__dirname, 'src', 'popup', 'index.js'),
		options: path.join(__dirname, 'src', 'options', 'index.js'),
		background: path.join(__dirname, 'src', 'background', 'index.js')
	},
	output: {
		path: path.join(__dirname, 'imco-sso'),
		filename: '[name].bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: 'vue-loader'
			},
			{
				test: /\.js$/,
				exclude: /(node_modules)/,
				use: {
					loader: 'babel-loader',
				},
			},
			{
				test: /\.css$/,
				loader: 'style-loader!css-loader',
			},
			{
				test: new RegExp('\.(' + fileExtensions.join('|') + ')$'),
				loader: 'file-loader?name=[name].[ext]',
				exclude: /node_modules/
			},
			{
				test: /\.html$/,
				loader: 'html-loader',
				exclude: /node_modules/
			}
		]
	},
	resolve: {
		alias: alias,
		extensions: ['*', '.js', '.json', '.vue'],
	},
	plugins: [
		new VueLoaderPlugin(),
		// clean the build folder
		new CleanWebpackPlugin(['build']),
		// expose and write the allowed env vars on the compiled bundle
		new webpack.EnvironmentPlugin(['NODE_ENV']),
		new CopyWebpackPlugin([{
			from: 'src/manifest.json',
			transform: function (content, path) {
				// generates the manifest file using the package.json informations
				return Buffer.from(JSON.stringify({
					description: process.env.npm_package_description,
					version: process.env.npm_package_version,
					...JSON.parse(content.toString())
				}))
			}
		}]),
		new HtmlWebpackPlugin({
			template: path.join(__dirname, 'src', 'popup', 'index.html'),
			filename: 'popup.html',
			chunks: ['popup']
		}),
		new HtmlWebpackPlugin({
			template: path.join(__dirname, 'src', 'options', 'index.html'),
			filename: 'options.html',
			chunks: ['options']
		}),
		new HtmlWebpackPlugin({
			template: path.join(__dirname, 'src', 'background', 'index.html'),
			filename: 'background.html',
			chunks: ['background']
		}),
		new WriteFilePlugin()
	]
};

if (env.NODE_ENV === 'development') {
	options.devtool = 'cheap-module-eval-source-map';
}

module.exports = options;
