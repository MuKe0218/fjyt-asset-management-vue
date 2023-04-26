// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import store from './store'
import './permission'
import './assets/icons'
import '@/assets/styles/index.scss'
import plugins from './plugins'
import directive from './directive' // directive
import { parseTime, resetForm, addDateRange, selectDictLabel, selectDictLabels, handleTree } from './utils/fjyt'
import { getDicts } from './api/system/dict/data'
// 自定义表格工具组件
import RightToolbar from './components/RightToolbar'
// 字典数据组件
import DictData from './components/DictData'

// 全局方法挂载
Vue.prototype.getDicts = getDicts
Vue.prototype.parseTime = parseTime
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.selectDictLabels = selectDictLabels
Vue.prototype.handleTree = handleTree

Vue.use(ElementUI)
Vue.use(plugins)
Vue.use(directive)
Vue.component('RightToolbar', RightToolbar)
DictData.install()
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
