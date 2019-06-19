const { CleanWebpackPlugin } = require("clean-webpack-plugin");
var HtmlWebpackPlugin = require("html-webpack-plugin");

const isProduction = process.env.ENV === "production";

module.exports = {
  entry: "./app/index.tsx",
  output: {
    path: __dirname + "/dist",
    publicPath: "/",
    filename: "bundle.js",
    libraryTarget: "umd"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      },
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      { test: /\.tsx?$/, loader: "awesome-typescript-loader" },

      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
      {
        test: /\.wasm$/,
        type: "webassembly/experimental"
      }
    ]
  },
  resolve: {
    extensions: ["*", ".js", ".jsx", ".ts", ".tsx", ".wasm"]
  },
  plugins: [
    new CleanWebpackPlugin({ protectWebpackAssets: true }),
    new HtmlWebpackPlugin({
      template: "./app/index.html",
      inject: true,
      minify: isProduction,
      favicon: "favicon.ico",
      production: isProduction
    })
  ]
};
