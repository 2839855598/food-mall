
// 管理域名接口
const ports = {
  // 不能固定死，比如 http://localhost:8080/
  dev: '/',
  se: 'http://47.105.169.196/food-mall/'
}
export default ports[process.env.NODE_ENV];
