import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

import '../src/assets/css/global.less'
import '../src/assets/font/iconfont.css'

axios.defaults.baseURL = 'http://127.0.0.1:8888/api'

const app =createApp(App)
// 全局echarts挂载，其他组件就可以用 this.$echarts
app.config.globalProperties.echarts = window.echarts
app.config.globalProperties.$axios = axios


app.use(store).use(router).mount("#app")