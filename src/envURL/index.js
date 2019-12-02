const modeUrlObj = {
  // 开发环境
  development: {
    publicPath: '/',
  },
  production: {
    // hash模式下用 './', history模式下, 如果部署在服务器根目录(/)下,
    // 用 '/', 如果部署在服务器子目录下(如: /food-mall/)下, 就用
    // '/food-mall/'
    publicPath: '/food-mall/',
  },
  test: {
    publicPath: 'https://xxxx:9090/test',
  },
};

module.exports = modeUrlObj[process.env.NODE_ENV];
