
// 管理域名接口
const ports = {
  // 不能固定死，比如 http://localhost:8080/
  development: '/',
  // 服务器有多个项目时候,production用具体的,只有单个项目时候(以/开头)
  // production 用 /
  production: 'http://xujiacheng.online/food-mall/'
}
export default ports[process.env.NODE_ENV];
