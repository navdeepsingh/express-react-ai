module.exports = {
    entry : './app.js',
    output: {
        filename: 'bundle.js' // Filename for production bundle
    },
    module : {
      loaders : [
        {
          test : /\.es6$/,
          exclude: /node_modules/,
          loader : 'babel-loader'
        }
      ]
    }
}
