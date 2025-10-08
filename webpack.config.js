const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/client/index.js',
  target: 'web',
  output: {
    path: path.resolve(__dirname, 'dist/client'),
    filename: 'bundle.js',
    clean: true,
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/client/index.html',
      filename: 'index.html'
    })
  ],
  externals: {
    // Don't bundle node_modules for server-side code
    'express': 'commonjs express',
    'cors': 'commonjs cors',
    'helmet': 'commonjs helmet',
    'dotenv': 'commonjs dotenv',
    'supertest': 'commonjs supertest'
  },
  optimization: {
    minimize: false // Keep readable for debugging
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist/client')
    },
    port: 8080,
    hot: true,
    historyApiFallback: true,
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
};
