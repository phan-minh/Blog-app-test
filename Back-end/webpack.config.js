const path = require('path');
const { yamlParse } = require('yaml-cfn');
const fs = require('fs');

const { functions } = yamlParse(fs.readFileSync('./serverless.yml'));

module.exports = {
  entry: Object.keys(functions)
    .map((key) => functions[key].handler)
    .reduce((result, current) => {
      const entry = current.split('.')[0].replace('build/', '');
      if (!result[entry]) {
        result[entry] = `./src/handlers/${entry}`;
      }
      return result;
    }, {}),
  mode: 'none',
  target: 'node',
  devtool: false, // 'source-map',
  resolve: {
    extensions: ['.js', '.es6'],
    modules: ['node_modules'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
    ],
  },
  externals: ['aws-sdk'],
  output: {
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, 'build'),
    filename: '[name].js',
  },
};
