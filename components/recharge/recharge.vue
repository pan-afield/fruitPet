<template>
	<view class="recharge">
		<view class="mask"></view>
		<view class="panel">
			<view class="header">
				<image class="userPic" :src="userInfo.headimg" mode=""></image>
				<image class="coin" src="@/static/pet/icon_gold.png" mode=""></image>
				<text>{{coin}}</text>
			</view>
			<view class="shop">
				<image class="coffeeBorder" src="@/static/recharge/img_store02@2x.png" mode=""></image>
				<image class="shopHeader" src="@/static/recharge/img_store01@2x.png" mode=""></image>
				<image class="exclusive" src="@/static/recharge/img_slogan@2x.png" mode=""></image>
				<image @click="close" class="close" src="@/static/recharge/icon_close03@2x.png" mode=""></image>
				<image class="yellowBorder" src="@/static/recharge/img_store03@2x.png" mode=""></image>
				<view class="goodsList">
					<view class="goodsBg" v-for="(item,index) in giftBagList" :key="index" @click="toPay(item)">
						<image class="goods" :src="item.img" mode=""></image>
						<image v-if="item.usertype === 2" class="goodsIcon" src="@/static/recharge/goods_icon.png" mode=""></image>
						<view class="explain">
							赠送{{item.coin}}金币
						</view>
						<view class="footer">
							<view class="price">
								¥{{item.price}}
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	export default {
		computed: {
			...mapState(['coin', 'userInfo'])
		},
		name: 'recharge',
		data() {
			return {
				giftBagList: []
			}
		},
		methods: {
			//支付
			toPay(item) {
				//获取订单
				this.$ajax.post('/Goods/Apply', {
					goodsid: item.rid
				}).then((res) => {
					console.log(res);
				})
				//从服务端获取参数
				let currentTime = new Date()
				uni.requestPayment({
					provider: 'weixin',
					orderInfo: {}, //订单信息
					timeStamp: currentTime.getTime().toString(),
					nonceStr: 'lenxunkeji',
					package: 'prepay_id=4862255252',
					signType: 'MD5',
					paySign: '22D9B4E54AB1950F51E0649E8810ACD6x',
					success(res) {
						console.log(1)
					},
					fail(res) {
						console.log(res)
					}
				})
			},
			close() {
				this.$parent.rechargeShow = false
			}
		},
		created() {
			this.$ajax('/Goods/List', {
				page: 1,
				pagesize: 10
			}).then((res) => {
				this.giftBagList = res.Data.list
			})
		}
	}
</script>

<style lang="scss" scoped>
	.recharge {
		width: 100%;
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;

		.mask {
			width: 100%;
			height: 100vh;
			position: absolute;
			left: 0;
			top: 0;
			background: rgba($color: #000000, $alpha: .6);
		}

		.panel {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			overflow: hidden;

			.header {
				width: 100%;
				position: absolute;
				left: 0;
				top: 8%;
				display: flex;
				align-items: center;


				.userPic {
					width: 88rpx;
					height: 88rpx;
					border-radius: 50%;
					border: 2rpx solid #FFFFFF;
					background-color: skyblue;
					margin: 0 30rpx;
				}

				.coin {
					width: 66rpx;
					height: 66rpx;
				}

				text {
					color: #FFECCC;
					font-size: 26rpx;
				}
			}

			.shop {
				width: 100%;
				position: absolute;
				left: 0;
				bottom: 0;
				height: 71.4vh;

				.coffeeBorder {
					width: 100%;
					height: 100%;
				}

				.shopHeader {
					width: 810rpx;
					position: absolute;
					left: 50%;
					top: -110rpx;
					transform: translateX(-50%);
					height: 178rpx;
				}

				.exclusive {
					position: absolute;
					left: 0;
					top: -180rpx;
					width: 333rpx;
					height: 231rpx;
				}

				.close {
					position: absolute;
					right: 12rpx;
					top: -120rpx;
					width: 64rpx;
					height: 64rpx;
				}

				.yellowBorder {
					position: absolute;
					left: 50%;
					transform: translateX(-50%);
					bottom: -8rpx;
					width: 716rpx;
					height: 69.1vh;
				}

				.goodsList {
					width: 650rpx;
					display: flex;
					flex-flow: wrap;
					align-items: center;
					justify-content: space-around;
					position: absolute;
					left: 50%;
					transform: translateX(-50%);
					top: 68rpx;
					.goodsIcon{
						position: absolute;
						left: 0;
						top: 0;
						width: 100rpx;
						height: 100rpx;
					}
					.goodsBg {
						position: relative;
						margin-top: 20rpx;
						width: 196rpx;
						height: 240rpx;
						background: #FFEDDA;
						border: 2rpx solid #FCD799;
						box-shadow: 0px 6rpx 12rpx rgba(222, 87, 29, 0.3);
						border-radius: 12rpx;

						.goods {
							width: 196rpx;
							height: 152rpx;
						}

						.explain {
							width: 100%;
							text-align: center;
							font-size: 24rpx;
							color: #C9824C;
						}

						.footer {
							width: 196rpx;
							height: 48rpx;
							background: url('@/static/recharge/img_price@2x.png') no-repeat;
							background-size: 100% 100%;

							.price {
								width: 100%;
								height: 100%;
								line-height: 48rpx;
								text-align: center;
								font-weight: bold;
								font-size: 32rpx;
								color: #FFF6BF;
							}
						}
					}
				}
			}
		}
	}
</style>
