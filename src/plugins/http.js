//插件模块
import axios from 'axios'

const MyHttpServer = {}

MyHttpServer.install = (Vue) => {
  axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
  Vue.prototype.$http = axios

  // 添加请求拦截器
  axios.interceptors.request.use(function(config) {
    // 在发送请求之前做些什么
    console.log(config)
    if (config.url !== 'login') {
      const AUTH_TOKEN = localStorage.getItem('token')
      config.headers.common['Authorization'] = AUTH_TOKEN;
    }
    return config;
  }, function(error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

}

export default MyHttpServer
