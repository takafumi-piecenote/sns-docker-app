// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// // export default defineConfig({
// //   plugins: [react()],
// // })

// export default defineConfig({
//   server: {
//     host: true,
//     port: 5173
//   }
// })


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()], // React プラグインを有効化
  root: './frontend', // プロジェクトのルートディレクトリを指定
  // publicDir: false, // public ディレクトリの場所
  publicDir: 'public', // public ディレクトリの場所
  server: {
    host: true,
    port: 5173
  },
  build: {
    outDir: 'dist', // ビルド成果物の出力先
    emptyOutDir: true, // ビルド時に出力先をクリア
  }
})
