// #ifndef VUE3
import Vue from 'vue'
import App from './App'
import ajax from './uniAjax'
import store from './store/index.js'
import {
	router,
	RouterMount
} from './router'
import popup from './components/popup/popup.vue'
import Login from '@/components/login/login.vue'
Vue.config.productionTip = false

Vue.component('popup', popup)
Vue.component('Login', Login)
Vue.use(router)
App.mpType = 'app'
Vue.prototype.$ajax = ajax
const app = new Vue({
	store,
	...App
})
RouterMount(app, router, '#app')
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
import App from './App.vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif
