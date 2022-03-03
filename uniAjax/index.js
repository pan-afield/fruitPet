// ajax.js

// 引入 uni-ajax 模块
import ajax from 'uni-ajax'
import store from '../store/index.js'

// 创建请求实例
const instance = ajax.create({
	// 初始配置
	baseURL: process.env.NODE_ENV === 'development' ? 'https://f8.lexun.com/lkl/' :
		'https://f8.lexun.com/lkl/',
	header: {
		post: {
			'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
		}
	},
	withCredentials: true
})

// 添加请求拦截器
instance.interceptors.request.use(
	config => {
		if (uni.getStorageSync('Authorization')) {
			config.header.token = uni.getStorageSync('Authorization')
		}
		// 在发送请求前做些什么

		return config
	},
	error => {
		// 对请求错误做些什么
		return Promise.reject(error)
	}
)

// 添加响应拦截器
instance.interceptors.response.use(
	response => {
		// 对响应数据做些什么
		if (response.statusCode === 200) {
			if (response.data.Result === -10) {
				store.commit('SetIsLogin', false)
			}
			return response.data
		} else {
			return response
		}
	},
	error => {
		// 对响应错误做些什么
		return Promise.reject(error)
	}
)

// 导出 create 创建后的实例
export default instance
