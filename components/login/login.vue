<template>
	<view class="login">
		<!-- 授权登录提示弹窗 -->
		<popup :popupHeight='536'>
			<image class="theCat" src="@/static/pet/feedafter.png" mode=""></image>
			<view class="hint">
				新人登录可免费领取3000金币!
			</view>
			<view class="bottom">
				<view class="canel" @click="closeLogin">
					暂不登录
				</view>
				<view class="confirm" @click="login">
					授权登录
				</view>
			</view>
		</popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {
			login() {
				uni.getUserProfile({
					desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
					success: (res) => {
						this.closeLogin()
						let userinfo = res.userInfo
						//储存用户基本信息
						this.$ajax.post('/User/AddUserInfo', {
							...userinfo
						}).then((res) => {
							uni.showToast({
								icon: res.Result === 0 ? 'success' : 'error',
								title: res.Msg
							})
							setTimeout(() => {
								this.$Router.push({
									name: 'index'
								})
							}, 1500)
						})
					}
				})
			},
			closeLogin() {
				this.$emit('closeLogin')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.login {
		width: 100%;
		position: absolute;
		left: 0;
		top: 0;
		height: 100vh;

		.theCat {
			width: 250rpx;
			height: 182rpx;
			position: absolute;
			left: 50%;
			top: 40rpx;
			transform: translateX(-50%);
		}

		.hint {
			text-align: center;
			margin: 280rpx auto 0;
			color: #A3894C;
			font-size: 32rpx;
		}

		.bottom{
			margin: 40rpx auto 0;
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-around;

			.confirm {
				width: 212rpx;
				height: 76rpx;
				text-align: center;
				line-height: 70rpx;
				background: url('@/static/pet/bt_sure.png') no-repeat;
				background-size: 100% 100%;
				color: #FFE5C3;
				font-size: 32rpx;
				font-size: 600;
			}
			.canel{
				width: 212rpx;
				height: 74rpx;
				background: #FCEAC2;
				border: 2rpx solid rgba(250, 101, 42, 0.51);
				text-align: center;
				line-height: 70rpx;
				font-weight: 500;
				color: #FA682C;
				border-radius: 20rpx;
			}
		}
	}
</style>
