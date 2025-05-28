import { createApp } from 'vue'
import App from './App.vue';
import axios from 'axios';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import Antd from 'ant-design-vue';
import router from './router';
import {
	createPinia,
	getActivePinia
} from 'pinia'; //状态仓库
import icon from './components/icon.vue'

const pinia = createPinia()
const app = createApp(App);
// app.config.globalProperties.$domain = 'http://soulmatemeet.vip:3030/'
app.config.globalProperties.$imgHead = 'http://soulmatemeet.vip:8888/'
// app.config.globalProperties.$imgHead = 'http://soulmatemeet.vip:3333/'
app.use(Antd);
app.use(ElementPlus)
app.use(router);
const activePinia = getActivePinia(); 
app.use(pinia);
app.mount('#app')
