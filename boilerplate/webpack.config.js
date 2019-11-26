const path = require('path')
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
  entry: path.resolve(__dirname, 'src/main.tsx'),
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    // In the module section, add a rule.
    rules: [{
      test:  /\.(ts|tsx)$/,
      exclude:  /node_modules/,
      loader: "babel-loader"
    }]
  },
  resolve: {
    // add the .ts | .tsx extension
    extensions: [
      '.js', '.jsx', '.tsx', '.ts', '.json'
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      // Define the template that the plugin will use to generate the HTML
      template: path.resolve(__dirname, 'src/index.html'),
      filename:  "index.html"
    })
  ],
  devServer: {
    // Specify a port number to listen for requests on, default is 8080
    port: 8086,

    // Enable gzip compression for everything served
    compress: true,

    // Tell dev-server to open the browser after server had been started.
    open: true,

    // Tell the server where to serve content from - the directory which look for the index.html file
    // This is only necessary if we want to serve static files.
    // By default it will use current working directory to serve content.
    // contentBase: "/",

    // Indicate the generated bundle files will placed. By default it is an in memory bundle which is not written on disk.
    // publicPath: "/",

    // Enable Hot Module Replacement feature
    hot: true,

    // Inline mode is recommended for Hot Module Replacement as it includes an HMR trigger from the websocket
    inline: true
  }
}