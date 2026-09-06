/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */
const { defineConfig } = require("@vue/cli-service");
const path = require("path");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const { readFileSync } = require("fs");
const port = process.env.VUE_APP_FRONTEND_PORT;
const host = process.env.VUE_APP_FRONTEND_HOST;
const config = {
	publicPath: "/",
	lintOnSave: false,
	transpileDependencies: [],
	devServer: {
		port: port,
		host: host,
		allowedHosts: "all",
		webSocketServer: false,
	},
	chainWebpack: (webpackConfig) => {
		webpackConfig.plugins.delete("fork-ts-checker");
	},
	configureWebpack: {
		devtool: process.env.NODE_ENV === "prod" ? false : "source-map",
		optimization: {
			minimizer: [
				new TerserPlugin({
					extractComments: process.env.NODE_ENV === "prod" ? false : true,
					terserOptions: {
						compress: {
							drop_console: process.env.NODE_ENV === "prod" ? true : false,
						},
						format: {
							comments: process.env.NODE_ENV === "prod" ? false : true,
						},
					},
				}),
				new CssMinimizerPlugin({
					// Prevent postcss-calc from rewriting vendor CSS expressions that trigger invalid calc warnings.
					minimizerOptions: {
						preset: [
							"default",
							{
								calc: false,
							},
						],
					},
				}),
			],
		},
		// Keep CI output focused on actionable issues; bundle-size tuning is tracked separately.
		performance: {
			hints: false,
		},
		// Suppress known postcss-calc parser warnings from vendor CSS emitted by upstream dependencies.
		ignoreWarnings: [(warning) => typeof warning?.message === "string" && warning.message.includes("postcss-calc")],
		experiments: {
			topLevelAwait: true,
		},
		resolve: {
			fallback: {
				crypto: false,
				stream: require.resolve("stream-browserify"),
				vm: require.resolve("vm-browserify"),
				http: require.resolve("stream-http"),
				url: require.resolve("url"),
				https: require.resolve("https-browserify"),
				fs: false,
			},
		},
		plugins: [
			new webpack.ProvidePlugin({
				process: "process/browser",
			}),
			new webpack.ProvidePlugin({
				Buffer: ["buffer", "Buffer"],
			}),
			new webpack.DefinePlugin({
				__VUE_OPTIONS_API__: "true",
				__VUE_PROD_HYDRATION_MISMATCH_DETAILS__: "false",
			}),
		],
		module: {
			rules: [
				{
					test: /.html$/,
					loader: "vue-template-loader",
					exclude: /index.html/,
				},
				{
					test: /\.js$/,
					loader: "babel-loader",
					exclude: /node_modules/,
				},
			],
		},
	},
};
if (process.env.VUE_APP_FRONTEND_PROTOCOL === "https") {
	config.devServer.server = {
		type: process.env.VUE_APP_FRONTEND_PROTOCOL,
		options: {
			cert: readFileSync("certificates/" + process.env.VUE_APP_ENV + "-cert.pem"),
			key: readFileSync("certificates/" + process.env.VUE_APP_ENV + "-key.pem"),
		},
	};
}

module.exports = defineConfig(config);
