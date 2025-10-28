const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  css: {
    loaderOptions: {
      sass: {
        implementation: require('sass'),
        sassOptions: {
          outputStyle: 'compressed'
        }
      }
    }
  },
  chainWebpack: config => {
    // Add route-level code splitting for all routes
    if (process.env.NODE_ENV === 'production') {
      config.optimization.splitChunks({
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000, // Keep chunks under warning threshold
        cacheGroups: {
          vendor: {
            name: 'vendors',
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            chunks: 'initial'
          },
          common: {
            name: 'common',
            minChunks: 2,
            priority: -20,
            chunks: 'initial',
            reuseExistingChunk: true
          }
        }
      })
    }
  }
})