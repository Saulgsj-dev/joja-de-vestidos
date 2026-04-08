// frontend/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // ✅ Otimizações de Build para Performance
  build: {
    // Code splitting inteligente
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'supabase': ['@supabase/supabase-js'],
        },
      },
    },
    // ✅ Sourcemaps apenas em desenvolvimento (reduz tamanho em produção)
    sourcemap: false,
    // ✅ Minificação agressiva
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,    // Remove console.log em produção
        drop_debugger: true,   // Remove debugger statements
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
    },
    // ✅ Target moderno para bundles menores
    target: 'esnext',
    // ✅ Limite de chunk para warnings
    chunkSizeWarningLimit: 1000,
  },
  
  // ✅ Otimizações de Desenvolvimento
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@supabase/supabase-js'],
    esbuildOptions: {
      target: 'esnext',
    },
  },
  
  // ✅ Server config para preview
  server: {
    port: 3000,
    open: true,
  },
  
  // ✅ Preview config
  preview: {
    port: 4173,
  },
})