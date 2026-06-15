import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          compatConfig: {
            MODE: 3
          }
        }
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'vue': '@vue/compat'
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html')
      },
      output: {
        // Vite 8 / Rolldown only supports the function form of manualChunks.
        // lottie is loaded from CDN at runtime, so it's intentionally absent here.
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (/[\\/]node_modules[\\/](@vue|vue|vue-router)[\\/]/.test(id)) return 'core-vendor'
          if (/[\\/]node_modules[\\/]aos[\\/]/.test(id)) return 'ui-vendor'
          if (/[\\/]node_modules[\\/]axios[\\/]/.test(id)) return 'http-vendor'
          if (/[\\/]node_modules[\\/]animated-scroll-to[\\/]/.test(id)) return 'animation-core'
          if (/[\\/]node_modules[\\/]@fortawesome[\\/]/.test(id)) return 'fontawesome'
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
        entryFileNames: 'assets/[name]-[hash].js'
      }
    },
    chunkSizeWarningLimit: 500,
    sourcemap: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
})