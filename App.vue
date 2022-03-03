<script>
	export default {
		onLaunch: function() {
			uni.getProvider({
				service: 'oauth',
				success: (res) => {
					if (res.provider.includes('weixin')) {
						uni.login({
							provider: 'weixin',
							success: async (res) => {
								const loginRes = await this.$ajax.post('/User/Login', {
									code: res.code
								})
								if (loginRes.Result === 0) {
									if (loginRes.Data.userinfo) {
										this.$store.commit('SetIsLogin', true)
									}
									//储存用户信息
									this.$store.dispatch('AsyncUserInfo', loginRes.Data.userinfo)
									//储存session_key
									uni.setStorageSync('Authorization', loginRes.Data.token)
								}
							}
						})
					}
				},
			})
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import '@/static/style/base.scss';
	@import '@/uni_modules/uni-scss';
	/* #ifndef APP-NVUE */
	@import '@/static/customicons.css';


	// 设置整个项目的背景色
	page {
		background-color: #f5f5f5;
	}

	/* #endif */
	.example-info {
		font-size: 14px;
		color: #333;
		padding: 10px;
	}
</style>
