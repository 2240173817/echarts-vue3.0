import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

import './assets/css/global.less'
import './assets/font/iconfont.css'

import '/public/static/theme/chalk.js'
import '/public/static/theme/vintage.js'

import SocketService from '@/utils/socket_service'

axios.defaults.baseURL = 'http://127.0.0.1:8888/api'

const app =createApp(App)
// 全局echarts挂载，其他组件就可以用 this.$echarts
app.config.globalProperties.echarts = window.echarts
app.config.globalProperties.$axios = axios
app.config.globalProperties.$socket = SocketService.Instance

app.use(store).use(router).mount("#app")