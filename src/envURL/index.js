const modeUrlObj = {
  // 开发环境
  development: {
    publicPath: '/',
  },
  production: {
    // publicPath: 'https://xxxx:8082/prod',
    // 以便本地能打开, 就设置跟 ./ 本地路径
    publicPath: './',
  },
  test: {
    publicPath: 'https://xxxx:9090/test',
  },
};

module.exports = modeUrlObj[process.env.NODE_ENV];
