const express = require('express');
const app = express();
const appData = require('./data.json');
// 商家
const seller = appData.seller;
// 商品
const goods = appData.goods;
// 评价
const ratings = appData.ratings;
const apiRoutes = express.Router();

// 请求 商家 数据
apiRoutes.get('/seller', (req, res) => {
  res.json({
    errno: 0,
    data: seller
  })
})
// 请求 商品 数据
apiRoutes.get('/goods', (req, res) => {
  res.json({
    errno: 0,
    data: goods
  })
})
// 请求 评价 数据
apiRoutes.get('/ratings', (req, res) => {
  res.json({
    errno: 0,
    data: ratings
  })
})
// api/ratings 或者 api/goods等，api作为上层
app.use('/api', apiRoutes);
// 监听服务器
app.listen(8082, () => {
  console.log('mock data is running');
})
