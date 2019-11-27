import axios from 'axios';
import router from 'vue-router';

// axios实例
const instance = axios.create( {
  timeout: 30 * 1000,
  // 请求头部
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
  },
})

export default instance;
