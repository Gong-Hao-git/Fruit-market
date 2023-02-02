import { resolve } from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
function pathResolve(dir) {
  return resolve(process.cwd(), '.', dir)
};

export default defineConfig({
  plugins: [vue()],
  chainWebpack: (config) => {
    config.resolve.alias
      .set("@", resolve("./src"))
  },
  resolve: {
    alias: {
      '@': pathResolve('src')
    }
  },
  server: {
    host: '0.0.0.0', //ip地址
    port: 4000, //端口号
    open: true //启动后是否自动打开浏览器
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: []
    }
  },
  css: {
    preprocessorOptions: {
      // scss预处理器的选项
      scss: {
        additionalData: `@import "./src/scss/utils.scss";`,
      },
    },
  },
})
