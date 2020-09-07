module.exports = {
  entry: {
    main: './main.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'], // babel的config配置快捷方式
            // plugins: ['@babel/plugin-transform-react-jsx'], // 支持react的jsx语法支持
            plugins: [
              [
                '@babel/plugin-transform-react-jsx', {
                  pragma: 'createElement' // jsx默认为React.createElement('div', null),pragma可以指定其前缀为createElement('div', null)
                }
              ]
            ], // 支持react的jsx语法支持
          }
        }
      }
    ]
  },
  mode: 'development', // 这两个配置是为了让webpack打包出来的代码不压缩
  optimization: {
    minimize: false
  }
}