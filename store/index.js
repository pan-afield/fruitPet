import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

//为了方便测试，此处用vuex做全局数据
const store = new Vuex.Store({
	state: {
		coin: 0,
		giftCoupon: 0,
		userInfo: {},
		seedsOrder: {},
		expressOrder: {},
		isLogin: false,
	},
	getters: {},
	mutations: {
		SetSeedsOrder(state, data) {
			state.seedsOrder = data
		},
		SetExpressOrder(state, data) {
			state.expressOrder = data
		},
		addCoin(state, data) {
			state.coin = state.coin + data
		},
		addGiftCoupon(state, data) {
			state.giftCoupon = state.giftCoupon + data
		},
		SetCoin(state, coin) {
			state.coin = coin
		},
		SetGiftCoupon(state, giftCoupon) {
			state.giftCoupon = giftCoupon
		},
		SetUserInfo(state, userInfo) {
			state.userInfo = userInfo
		},
		SetIsLogin(state, isLogin) {
			state.isLogin = isLogin
		},
	},
	actions: {
		AsyncAddCoin({
			commit
		}, data) {
			commit('addCoin', data)
		},
		AsyncAddGiftCoupon({
			commit
		}, data) {
			commit('addGiftCoupon', data)
		},
		AsyncUserInfo({
			commit
		}, data) {
			commit('SetUserInfo', data)
		},
		AsyncSetCoin({
			commit
		}, data) {
			commit('SetCoin', data)
		},
		AsyncSetGiftCoupon({
			commit
		}, data) {
			commit('SetGiftCoupon', data)
		},
	}
})

export default store
