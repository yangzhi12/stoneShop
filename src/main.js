// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUi from 'element-ui'
import moment from 'moment'
import myBread from '@/components/cuscon/myBread.vue'
// tijiao
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/reset.css'
import MyServerHttp from '@/plugins/http.js'
// import axios from 'axios'
// Vue.prototype.$http = axios

Vue.use(ElementUi)
Vue.use(MyServerHttp)
Vue.config.productionTip = false

// 	全局过滤器
Vue.filter('fmtdate',(value) => {
	return moment(value).format('YYYY-MM-DD')
})

Vue.filter('levelChange',(value) => {
	switch (value) {
		case "0":
			// statements_1
			this.value = '一级'
			break;
		case "1":
			// statements_1
			this.value = '二级'
			break;			
		default:
			this.value = '三级'
			break;
	}
	return this.value
})

// 全局组件用在new Vue之前
Vue.component(myBread.name,myBread)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
