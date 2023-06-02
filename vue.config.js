const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/lone': {
        target: 'http://localhost:8081',
        pathRewrite: {'^/lone' : ''}
      }
    }
  }
})
