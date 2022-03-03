<template>
	<view class="intergral">
		<view class="mask"></view>
		<view class="panel">
			<view class="header">
				<image class="userPic" :src="userInfo.headimg" mode=""></image>
				<image class="coin" src="@/static/pet/icon_coupon.png" mode=""></image>
				<text>{{giftCoupon}}</text>
			</view>
			<view class="close" @click="close">
				<image src="@/pagesA/static/integral/icon_close01@2x.png" mode=""></image>
			</view>
			<swiper :vertical="true" :circular="true" :indicator-dots="false" :autoplay="true" :interval="3000"
				:duration="1000">
				<swiper-item class="swiper-item" v-for="(item,index) in allUserRecord" :key="index">
					<image src="@/pagesA/static/integral/icon_radio@2x.png" mode=""></image>
					<view class="word">
						恭喜{{item.Nick}}兑换了{{item.Name}}
					</view>
				</swiper-item>
			</swiper>
			<view class="shop">
				<view class="shopBox">
					<view class="shopOptions">
						<view class="option" @click="optionNumber = 'wood'">
							<text :class="{selected : optionNumber ==='wood'}">实物</text>
							<image v-if="optionNumber ==='wood'" class="optionImg"
								src="@/pagesA/static/integral/img_graphics@2x.png" mode=""></image>
						</view>
						<view class="option" @click="optionNumber = 'card'">
							<text :class="{selected : optionNumber ==='card'}">卡券</text>
							<image v-if="optionNumber ==='card'" class="optionImg"
								src="@/pagesA/static/integral/img_graphics@2x.png" mode=""></image>
						</view>
						<view class="option" @click="optionNumber = 'phone'">
							<text :class="{selected : optionNumber ==='phone'}">话费</text>
							<image v-if="optionNumber ==='phone'" class="optionImg"
								src="@/pagesA/static/integral/img_graphics@2x.png" mode=""></image>
						</view>
					</view>
					<scroll-view scroll-y="true">
						<view class="goodsUl">
							<view @click="toConvert(item)" class="goodsLi"
								v-for="(item,index) in goodsList[optionNumber]" :key="index">
								<image class="goodImg" :src="item.imgurl" mode=""></image>
								<view class="goodsName">
									{{item.name}}
								</view>
								<view class="goodsInfo">
									<text>剩余{{item.leftinventory}}份</text>|<text>月兑{{item.sells}}份</text>
								</view>
								<view class="convert">
									<view class="price">
										<text>{{item.price/10000}}</text>万礼券
									</view>
									<view class="btn">
										兑换
									</view>
								</view>
							</view>
						</view>
					</scroll-view>
				</view>
				<view class="shopHeader"></view>
			</view>
			<view class="convertPopup" v-if="convertPopupShow">
				<view class="mask"></view>
				<view class="content">
					<image class="contentBg" src="@/pagesA/static/integral/bg_toast.png" mode=""></image>
					<view class="header">
						<view class="left"></view>
						<view class="center">
							<text v-if="optionNumber ==='phone'">兑换话费</text>
							<text v-if="optionNumber ==='card'">兑换卡券</text>
							<text v-if="optionNumber ==='wood'">兑换实物</text>
						</view>
						<view class="right"></view>
					</view>
					<view class="kindOf">
						<image :src="contertInfo.imgurl" mode=""></image>
					</view>
					<input v-if="optionNumber !=='wood'" v-model="phoneNumber" class="phone" type="number" value=""
						placeholder="请输入您的手机号码" />
					<view class="woodInfo" v-if="optionNumber ==='wood'">
						{{contertInfo.name}}
					</view>
					<view class="addressInfo" v-if="optionNumber ==='wood'">
						<view class="haveAddr" v-if="userAddr">
							<view class="address-head">
								<view class="name">
									{{userAddr.userName}}
								</view>
								<view class="userPhone">
									{{userAddr.telNumber}}
								</view>
							</view>
							<view class="detailAddress">
								{{userAddr.provinceName}}{{userAddr.cityName}}{{userAddr.countyName}}{{userAddr.detailInfo}}
							</view>
						</view>
						<view class="noAddr" v-else>
							<view class="hintAddr" @click="toConvert(contertInfo)">
								点击选择地址
							</view>
							<view class="hintAddr1">
								提示：您还未选择地址
							</view>
						</view>
					</view>
					<view :class="{confirmConvert:true,confirm1:optionNumber ==='wood'}"
						@click="confirmConvert(contertInfo.rid)"></view>
					<view class="convertHint" v-if="optionNumber !=='wood'">
						*请重复确认手机号！京东卡密将已短信形式发放！
					</view>
				</view>
				<view class="closeX" @click="convertPopupShow = false"></view>
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
			...mapState(['giftCoupon', 'userInfo'])
		},
		data() {
			return {
				convertPopupShow: false,
				optionNumber: 'wood',
				goodsList: {
					wood: [],
					card: [],
					phone: []
				},
				contertInfo: {},
				phoneNumber: '',
				allUserRecord: [],
				userAddr: '',
			}
		},
		methods: {
			toConvert(item) {
				if (item.type === 4) {
					uni.chooseAddress({
						success: (res) => {
							console.log(res);
							this.userAddr = res
							uni.showToast({
								title: '选择成功',
								icon: 'success'
							})
						},
						fail: (res) => {
							uni.showToast({
								title: '未选择',
								icon: 'error'
							})
							this.userAddr = ''
						}
					})
					this.contertInfo = item
					this.convertPopupShow = true
				} else {
					this.contertInfo = item
					this.convertPopupShow = true
				}
			},
			confirmConvert(rid) {
				if (!this.phoneNumber && this.contertInfo.type !== 4) return
				this.$ajax.post('/GiftCoupon/ConvertGift', {
					rid,
					phone: this.phoneNumber
				}).then((res) => {
					if (res.Result === 0) {
						this.convertPopupShow = false
						uni.showToast({
							icon: 'success',
							title: res.Msg
						})
						this.getConvertList()
						this.$emit('getUserInfo')
					} else {
						uni.showToast({
							icon: 'error',
							title: res.Msg
						})
					}
				})
			},
			//获取物品列表
			getConvertList() {
				this.$ajax('/GiftCoupon/GiftList').then((res) => {
					this.goodsList.wood = res.Data.filter((item, index) => {
						return item.type === 4
					})
					this.goodsList.phone = res.Data.filter((item, index) => {
						return item.type === 0
					})
					this.goodsList.card = res.Data.filter((item, index) => {
						return item.type !== 4 && item.type !== 0
					})
				})
			},
			close() {
				this.$parent.integralShow = false
			}
		},
		created() {
			this.getConvertList()
			this.$ajax('/GiftCoupon/ConvertLog', {
				page: 1,
				pagesize: 10,
				type: 1
			}).then((res) => {
				this.allUserRecord = res.Data.list
			})
		}
	}
</script>

<style lang="scss" scoped>
	.intergral {
		width: 100%;
		position: absolute;
		left: 0;
		top: 0;
		height: 100vh;

		.convertPopup {
			width: 100%;
			position: absolute;
			left: 0;
			top: 0;
			height: 100vh;

			.content {
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translate(-50%, -50%);
				width: 100%;
				height: 1096rpx;

				.contentBg {
					position: absolute;
					left: 0;
					top: 0;
					z-index: -1;
					width: 100%;
					height: 100%;
				}

				.header {
					position: absolute;
					left: 50%;
					transform: translateX(-50%);
					top: 220rpx;
					width: 50%;
					display: flex;
					align-items: center;
					justify-content: space-around;

					.center {
						text {
							font-size: 40rpx;
							font-weight: 500;
							color: #FE554C;
							transform: translateY(-4rpx);
						}
					}

					.right,
					.left {
						width: 43rpx;
						height: 4rpx;
						background: linear-gradient(90deg, #FE554C 0%, rgba(254, 85, 76, 0) 100%);
						border-radius: 5rpx;
					}

					.left {
						transform: rotateY(180deg);
					}
				}

				.kindOf {
					position: absolute;
					left: 50%;
					transform: translateX(-50%);
					top: 300rpx;
					width: 226rpx;
					height: 214rpx;

					image {
						width: 100%;
						height: 100%;
					}
				}

				.woodInfo {
					width: 100%;
					text-align: center;
					color: #A3894C;
					font-size: 32rpx;
					font-weight: 500;
					left: 50%;
					position: absolute;
					transform: translateX(-50%);
					top: 530rpx;
				}

				.phone {
					position: absolute;
					left: 50%;
					transform: translateX(-50%);
					top: 500rpx;
					padding-left: 20rpx;
					width: 548rpx;
					height: 88rpx;
					line-height: 88rpx;
					background: #FFFFFF;
					border-radius: 4rpx;
					border: 2rpx solid rgba(181, 109, 69, 0.2);
					font-size: 32rpx;
				}

				.addressInfo {
					position: absolute;
					left: 50%;
					transform: translateX(-50%);
					top: 590rpx;
					width: 564rpx;
					height: 182rpx;
					border-radius: 10rpx;
					background: linear-gradient(180deg, #FFF1D8 100%, #FFEECD 100%);
					border: 2rpx dashed #FE7F59;

					.address-head {
						width: 90%;
						margin: 20rpx auto 10rpx;
						display: flex;
						align-items: center;
						justify-content: space-between;
						font-size: 28rpx;
						color: #A3894C;
					}

					.detailAddress {
						width: 90%;
						margin: 0 auto;
						color: #A3894C;
						font-size: 28rpx;
						font-weight: 700;
					}

					.hintAddr {
						margin: 30rpx 0 20rpx 20rpx;
						font-size: 32rpx;
						color: #FE554C;
					}

					.hintAddr1 {
						margin-left: 20rpx;
						font-size: 24rpx;
						color: #A3894C;
					}
				}

				.confirmConvert {
					position: absolute;
					left: 50%;
					transform: translateX(-50%);
					top: 640rpx;
					width: 288rpx;
					height: 146rpx;
					background: url('@/pagesA/static/integral/bt_sure.png') no-repeat;
					background-size: 100% 100%;
				}

				.confirm1 {
					top: 780rpx;
				}

				.convertHint {
					width: 420rpx;
					text-align: center;
					position: absolute;
					left: 50%;
					transform: translateX(-50%);
					top: 800rpx;
					font-size: 28rpx;
					color: rgba(181, 102, 69, 0.6);
				}
			}

			.closeX {
				position: absolute;
				left: 50%;
				transform: translateX(-50%);
				bottom: 13vh;
				width: 60rpx;
				height: 60rpx;
				background: url('@/pagesA/static/integral/icon_clsoe.png') no-repeat;
				background-size: 100% 100%;
			}
		}

		.mask {
			width: 100%;
			position: absolute;
			left: 0;
			top: 0;
			background-color: rgba($color: #000000, $alpha: 0.6);
			height: 100%;
		}

		.panel {
			width: 100%;
			position: absolute;
			left: 0;
			top: 0;
			height: 100%;

			swiper {
				position: absolute;
				left: 50%;
				top: 17vh;
				transform: translateX(-50%);
				width: 686rpx;
				height: 52rpx;
				border-radius: 60rpx;
				background: linear-gradient(180deg, #FFF3F3 0%, #FFC0A4 100%);
				box-shadow: 0px 2rpx 6rpx rgba(226, 28, 28, 0.6);
			}

			.swiper-item {
				display: flex;
				align-items: center;
				height: 52rpx;
				padding-left: 20rpx;
				box-sizing: border-box;
				font-size: 26rpx;
				color: #F75546;

				image {
					width: 48rpx;
					height: 48rpx;
					margin-right: 20rpx;
				}

				.word {}
			}

			.close {
				position: absolute;
				right: 60rpx;
				top: 10vh;
				width: 60rpx;
				height: 60rpx;

				image {
					width: 100%;
					height: 100%;
				}
			}

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
					width: 70rpx;
					height: 52rpx;
					transform: translateY(4rpx);
				}

				text {
					color: #FFECCC;
					font-size: 26rpx;
					transform: translateX(8rpx);
				}
			}

			.shop {
				.shopHeader {
					width: 810rpx;
					height: 178rpx;
					position: absolute;
					left: 50%;
					transform: translateX(-50%);
					top: 22vh;
					background: url('@/pagesA/static/integral/img_store04@2x.png') no-repeat;
					background-size: 100% 100%;
				}

				.shopBox {
					width: 100%;
					height: 71.66vh;
					position: absolute;
					left: 0;
					bottom: 0;
					background: url('@/pagesA/static/integral/img_store05@2x.png') no-repeat;
					background-size: 100% 100%;
					box-sizing: border-box;
					padding-top: 50rpx;

					scroll-view {
						height: 88.88%;
					}

					.goodsUl {
						display: flex;
						flex-wrap: wrap;
						padding-top: 20rpx;

						.goodsLi {
							margin: 0px -6px 20rpx 30rpx;
							width: 332rpx;
							height: 452rpx;
							background: #FFFFFF;
							border: 2rpx solid #FFD9D9;
							box-shadow: 0px 6rpx 20rpx rgba(222, 87, 29, 0.3);
							border-radius: 12rpx;

							.goodImg {
								width: 100%;
								height: 280rpx;
								border-radius: 12rpx 12rpx 0 0;
							}

							.goodsName {
								padding-left: 20rpx;
								font-size: 28rpx;
								font-weight: bold;
								color: #300202;
							}

							.goodsInfo {
								margin-top: 10rpx;
								padding-left: 20rpx;
								font-size: 24rpx;
								color: #AE8B8B;
							}

							.convert {
								margin-top: 10rpx;
								padding-left: 20rpx;
								font-size: 24rpx;
								color: #FF4243;
								display: flex;
								align-items: center;
								justify-content: space-between;

								.price {
									display: flex;
									align-items: center;
								}

								text {
									font-size: 36rpx;
									font-weight: 700;
									color: #FF4243;
								}

								.btn {
									width: 158rpx;
									height: 70rpx;
									text-align: center;
									line-height: 70rpx;
									background: url('@/pagesA/static/integral/btn_exchange@2x.png') no-repeat;
									background-size: 100% 100%;
									font-size: 26rpx;
									color: #FFEFEF;
								}
							}
						}
					}

					.shopOptions {
						display: flex;
						align-items: center;
						justify-content: space-around;
						height: 100rpx;
						width: 70%;
						margin: 0 auto;
					}

					.option {
						position: relative;
						font-size: 36rpx;
						color: #FFABAB;
						flex: 1;
						text-align: center;

						.selected {
							font-size: 40rpx;
							color: #333333;
							font-weight: bold;
						}

						.optionImg {
							position: absolute;
							left: 50%;
							transform: translateX(-50%);
							bottom: -17rpx;
							width: 58rpx;
							height: 17rpx;
						}
					}
				}
			}
		}
	}
</style>
