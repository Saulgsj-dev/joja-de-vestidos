import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // ✅ Otimizações de Build compatíveis com Vite 8 + Rolldown
  build: {
    // ✅ Code splitting com função (não objeto)
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor-react';
            }
            if (id.includes('@supabase')) {
              return 'vendor-supabase';
            }
            return 'vendor';
          }
        },
        // ✅ Nomeação de arquivos otimizada
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    // ✅ Sourcemaps apenas em desenvolvimento
    sourcemap: false,
    // ✅ Minificação
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // ✅ Target compatível
    target: 'es2020',
    chunkSizeWarningLimit: 1000,
  },
  
  // ✅ Otimizações de Desenvolvimento (sem esbuildOptions deprecated)
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
  
  // ✅ Server config para preview local
  server: {
    port: 3000,
    open: true,
  },
  
  preview: {
    port: 4173,
  },
})