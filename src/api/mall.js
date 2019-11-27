// node模块 序列化
// import QS from 'qs';
// 接口域名管理
import ports from './interfaces';
// axios实例
import axios from '../request'

const mall = {
  // 商家数据
  seller (params) {
    // 相当于 params: params
    return axios.get(`${ports.dev}api/seller`, {
      params
    })
  },
  // 商品数据
  goods (params) {
    return axios.get(`${ports.dev}api/goods`, {
      params
    })
  },
  // 评价数据
  ratings (params) {
    return axios.get(`${ports.dev}api/ratings`, {
      params
    })
  }

}

export default mall;
