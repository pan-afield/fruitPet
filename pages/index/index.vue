<template>
	<view class="container">
<!-- 		<view class="van" @click="$Router.push({name:'pet'})">
			pet
		</view>
		<view class="van" @click="$Router.push({path:'/farm'})">
			farm
		</view>
		<view class="intro">本项目已包含uni ui组件，无需import和注册，可直接使用。在代码区键入字母u，即可通过代码助手列出所有可用组件。光标置于组件名称处按F1，即可查看组件文档。</view>
		<text class="intro">详见：</text>
		<uni-link :href="href" :text="href"></uni-link>
		<button @click="chooseAddress">chooseAddress</button>
		<button @click="authorization">授权设置</button>
		<button type="default" open-type="contact">打开客服</button>
		<view class="" @click="text">
			弹窗
		</view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				delayed: 0,
				href: 'https://uniapp.dcloud.io/component/README?id=uniui'
			}
		},
		methods: {
			text() {
				uni.navigateTo({
					url:'pagesA/pet/pet'
				})
				// uni.showModal({
				// 	title: '标题',
				// 	content: '内容',
				// 	success(res) {
				// 		if (res.confirm) {
				// 			console.log(111);
				// 		} else if (res.cancel) {
				// 			console.log(222);
				// 		}
				// 	}
				// })
			},
			chooseAddress() {
				uni.chooseAddress({
					success(res) {
						console.log(res.userName)
						console.log(res.postalCode)
						console.log(res.provinceName)
						console.log(res.cityName)
						console.log(res.countyName)
						console.log(res.detailInfo)
						console.log(res.nationalCode)
						console.log(res.telNumber)
					},
					fail() {
						console.log('还未选择')
					}
				})
			},
			//授权
			authorization() {
				uni.getUserProfile({
					desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
					success: (res) => {
						let userinfo = res.userInfo
						//储存用户基本信息
						this.$ajax.post('/User/AddUserInfo', {
							...userinfo
						}).then((res) => {
							uni.showToast({
								icon: res.Result === 0 ? 'success' : 'error',
								title: res.Msg
							})
							//获取用户所有当前页面初始化信息接口
						})
					}
				})
			},
		},
		onLoad() {
			//延长第一次进入获取token的时长
			uni.showLoading({
				title: '加载中'
			})
			let isOlder = uni.getStorageSync('isOlder')
			if (isOlder) {
				this.delayed = 500
			} else {
				this.delayed = 2000
				uni.setStorageSync('isOlder', true)
			}
			setTimeout(() => {
				this.$Router.push({
					path: "/pet"
				})
				// uni.navigateTo({
				// 	url:'pagesA/pet/pet'
				// })
				uni.hideLoading()
			}, this.delayed)
		}
	}
</script>

<style>
	.container {
		padding: 20px;
		font-size: 14px;
		line-height: 24px;
	}
</style>
