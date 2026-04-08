import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  
  build: {
    // ✅ Code splitting agressivo para tree shaking
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            // ✅ React e Router - sempre usados
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor-react'
            }
            // ✅ Supabase - carregado sob demanda no admin
            if (id.includes('@supabase')) {
              return 'vendor-supabase'
            }
            // ✅ Outros vendors
            return 'vendor'
          }
        },
        // ✅ Nomes de arquivos com hash para cache
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    // ✅ Sourcemaps apenas em desenvolvimento
    sourcemap: false,
    // ✅ Minificação com Terser para remover código morto
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,      // Remove console.log em produção
        drop_debugger: true,     // Remove debugger statements
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        passes: 2,               // Múltiplas passagens para melhor tree shaking
      },
      format: {
        comments: false,         // Remove comentários
      },
    },
    // ✅ Target compatível com browsers modernos
    target: 'es2020',
    chunkSizeWarningLimit: 1000,
  },
  
  // ✅ Otimiza dependências - exclui Supabase do pré-carregamento
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: ['@supabase/supabase-js'], // ✅ Carrega sob demanda
  },
  
  // ✅ Server config para desenvolvimento
  server: {
    port: 3000,
    open: true,
  },
  
  preview: {
    port: 4173,
  },
})