const { resolve } = require('path')

export default {
  build: {
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        nested: resolve(__dirname, 'event-map/index.html')
      }
    }
  }
}
