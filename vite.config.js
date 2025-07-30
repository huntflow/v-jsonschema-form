import { fileURLToPath, URL } from 'url';
import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: ['.js', '.vue']
  },
  build: {
    minify: 'terser',
    lib: {
      entry: {
        vjsf: path.resolve(__dirname, 'src/components/Form.vue')
      },
      formats: ['es'],
      fileName: (format) => `vjsf.${format}.js`
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['vue'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue'
        },
        entryFileNames: '[name].[format].js',
      },
      input: {
        vjsf: path.resolve(__dirname, 'src/components/Form.vue'),
        schema: path.resolve(__dirname, 'src/helpers/schema.js'),
        validate: path.resolve(__dirname, 'src/validate.js')
      }
    }
  }
});
