// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//   plugins: [react()],
//   build: {
//     outDir: 'dist',
//     emptyOutDir: true,
//     sourcemap: false,        // disable in prod for security
//     chunkSizeWarningLimit: 1000,
//   },
//   server: {
//     proxy: {
//       '/api': {
//         target: 'http://localhost:5000',
//         changeOrigin: true,
//       },
//     },
//   },
// });
// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//   plugins: [react()],

//   build: {
//     outDir: 'dist',
//     emptyOutDir: true,
//     sourcemap: false,
//     chunkSizeWarningLimit: 1000,
//   },
// });







import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  server: {
    host: '0.0.0.0',
    port: 5173,
  },

  preview: {
    host: '0.0.0.0',
    port: 4173,
  }
})