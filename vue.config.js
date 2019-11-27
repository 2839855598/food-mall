const path = require('path');
const webpack = require('webpack');
// 把vendors.dll.js 移动到html中
const AddAssetPlugin = require('add-asset-html-webpack-plugin');
const baseConf = require('./src/envURL/index.js');

// 返回绝对路径
function resolve(url) {
  return path.resolve(__dirname, url);
}

module.exports = {
  publicPath: baseConf.publicPath,
  chainWebpack: config => {
      config
        .resolve
          .alias
            .set('@components', resolve('src/components'))
  },
  css: {
    loaderOptions: {
      sass: {
        data: `
         @import "@/assets/css/mixin.scss";
        `
      }
    }
  },
  // webpack配置
  configureWebpack: config => {
    // 有可能重复打包了，造成文件过大
    /*const commonPlugin = [
      new webpack.DllReferencePlugin({
        manifest: resolve('./dll/vendors2.manifest.json')
      }),
      new AddAssetPlugin({
        filepath: resolve('./dll/vendors2.dll.js'),
        outputPath: './assets/js',
        publicPath: './assets/js',
        hash: true
      })
    ]*/

    if(process.env.NODE_ENV === 'development') {
       // 加载express
      require('./src/mock/myExpress.js');
    } else {
    }

    // config.plugins.push(...commonPlugin);
  },
  // 服务器配置
  devServer: {
    host: '0.0.0.0',
    port: 8080,
    open: true,
    hot: true,
    // 配置反向代理,代理数据接口
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8082',
        changeOrigin: true
      }
    }
  }
}
