<template>
	<view class="buySeed">
		<popup :title="title" :popupHeight="900" :popupWidth="632">
			<view class="normal">
				<view class="inventory">
					请确认您运送<text>{{period}}号果园</text>的种子清单
				</view>
				<view class="seedList">
					<view class="header">
						<view class="left">
							<text>种子</text>
							<text>数量</text>
						</view>
						<view class="right">
							<text>种子</text>
							<text>数量</text>
						</view>
					</view>
					<scroll-view scroll-y="true" style="height: 238rpx;">
						<view class="seedUl">
							<view class="seedLi" v-for="(item,index) in orderList" :key="index">
								<view class="liImgBox">
									<image class="seedLiImg" :src="require(`@/static/fruit/img_fruit_${item.Num}.png`)"
										mode=""></image>
								</view>
								<view class="kindOf">
									{{item.Name}}
								</view>
								<view class="buyNum">
									{{buyNum}}
								</view>
							</view>
						</view>
					</scroll-view>
				</view>
				<view class="consume" v-if="!isExpress">
					<image src="@/static/popup/gouwuche-2.png" mode=""></image>
					购买<text>{{seedsOrder.length}}类</text>种子，需消耗<text>{{totalNum}}金币</text>
				</view>
				<view class="consume" v-else>
					<image src="@/static/popup/gouwuche-2.png" mode=""></image>
					购买<text>{{orderList.length}}类</text>种子，需消耗<text>{{totalNum}}金币</text>
				</view>
				<view class="amend">
					<view class="word">
						选择如下操作可修改订单金额
					</view>
					<view class="amendOptions">
						<view class="option" @click="changeNum(0.5)">
							<image style="width: 42rpx;height: 34rpx;" src="@/pagesB/static/seedShop/0.5.png" mode=""></image>
							<image class="sign" src="@/pagesB/static/seedShop/img_down.png" mode="">
							</image>
						</view>
						<view class="option" @click="changeNum(2)">
							<image style="width: 20rpx;height: 34rpx;" src="@/pagesB/static/seedShop/2.png" mode=""></image>
							<image class="sign" src="@/pagesB/static/seedShop/img_up.png" mode="">
							</image>
						</view>
						<view class="option" @click="changeNum(5)">
							<image style="width: 20rpx;height: 28rpx;" src="@/pagesB/static/seedShop/5.png" mode=""></image>
							<image class="sign" src="@/pagesB/static/seedShop/img_up.png" mode="">
							</image>
						</view>
						<view class="option" @click="changeNum(10)">
							<image style="width: 36rpx;height: 28rpx;" src="@/pagesB/static/seedShop/10.png" mode=""></image>
							<image class="sign" src="@/pagesB/static/seedShop/img_up.png" mode="">
							</image>
						</view>
					</view>
				</view>
			</view>
			<!-- 			<view class="express" v-else>
				<view class="expressBox">
					<image class="expressImg" src="@/pagesB/static/seedShop/img_carton.png" mode=""></image>
					<view class="expressName">
						{{expressOrder.Name}}
					</view>
				</view>
				<view class="expressText">
					{{expressOrder.Name}}快递种子套餐内含{{expressOrder.NumArr.length}}类种子
				</view>
				<scroll-view class="expressScroll" scroll-y="true">
					<view class="expressList">
						<view class="expressLi" v-for="(item,index) in expressOrder.NumArr" :key="index">
							<view class="liImgBox">
								<image class="seedLiImg" src="@/pagesB/static/seedShop/img_tomato.png" mode=""></image>
							</view>
							<view class="kindOf">
								0-番茄
							</view>
						</view>
					</view>
				</scroll-view>
				<view class="expressWord">
					<view class="center">
						<text class="point"></text>当前已选中<text>{{expressOrder.NumArr.length}}个</text>种子
					</view>
				</view>
			</view> -->
			<view class="footer">
				<view class="cancel" @click="close">
					取消
				</view>
				<view class="confirm" @click="checkOrder">
					确认购买
				</view>
			</view>
			<view class="stupid">
				<image class="gold" src="@/static/pet/icon_gold.png" mode=""></image>
				<text>{{coin}}</text>
			</view>
		</popup>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		name: 'buySeed',
		props: {
			isExpress: {
				type: Boolean,
				default: true
			},
			gameInfo: {
				type: Object,
				default: {}
			},
			period: {
				type: Number,
				default: 0,
			},
			termid: {
				type: Number,
			},
			buySeedTime: {
				type: Number,
				default: 2
			}
		},
		computed: {
			orderList() {
				return this.isExpress ? this.expressOrder.NumArr : this.seedsOrder
			},
			totalNum() {
				return this.orderList.length * this.buyNum
			},
			title() {
				return this.isExpress ? '快递套餐' : '购买种子'
			},
			...mapState(['coin', 'seedsOrder', 'expressOrder'])
		},
		data() {
			return {
				buyNum: 1,
			}
		},
		methods: {
			...mapMutations(['SetSeedsOrder', 'SetExpressOrder']),
			//确认订单
			checkOrder() {
				if (this.gameInfo.Countdown <= 5) {
					uni.showToast({
						title: '野猪快来了啦！',
						icon: 'error',
					})
					return
				}
				if (this.gameInfo.Countdown >= 295) {
					uni.showToast({
						title: '还在耕种哦！',
						icon: 'error',
					})
					return
				}
				if (!this.isExpress) {
					let numsArr = []
					this.seedsOrder.forEach((item) => {
						numsArr.push(item.Num)
					})
					numsArr = numsArr.join(',')
					console.log(numsArr);
					this.$ajax.post('/Game/Apply', {
						termid: this.termid,
						nums: numsArr,
						amount: this.buyNum
					}).then((res) => {
						this.$parent.showLessCoin = true
						if (res.Result === 0) {
							this.$parent.buyFail = false
							this.$emit('buyReward', res.Data)
							this.$emit('getUserInfo')
							// this.$emit('getGameInfo')
						} else {
							this.$parent.buyFail = true
						}
						this.SetSeedsOrder([])
						this.close()
						this.$parent.seedShopShow = false
					})
				} else {
					this.$ajax.post('/Game/ApplyByExpress', {
						termid: this.termid,
						expressid: this.expressOrder.Num,
						amount: this.buyNum
					}).then((res) => {
						this.$parent.showLessCoin = true
						if (res.Result === 0) {
							this.$parent.buyFail = false
							this.$emit('buyReward', res.Data)
							this.$emit('getUserInfo')
						} else {
							this.$parent.buyFail = true
						}
						this.SetExpressOrder({})
						this.close()
						this.$parent.seedShopShow = false
					})
				}
			},
			changeNum(multiple) {
				if (multiple === 0.5 && this.buyNum === 1) return
				this.buyNum = this.buyNum * multiple
			},
			close() {
				this.buyNum = 1
				this.$emit('closePopup', 'buySeed')
			}
		},
		created() {
			console.log(this.seedsOrder, this.expressOrder);
		}
	}
</script>

<style lang="scss" scoped>
	.buySeed {
		width: 100%;
		position: absolute;
		left: 0;
		top: 0;

		.stupid {
			position: absolute;
			left: -26rpx;
			bottom: -200rpx;
			width: 240rpx;
			height: 78rpx;
			background: rgba(32, 29, 29, 0.6);
			border-radius: 44rpx;
			line-height: 78rpx;
			padding-left: 80rpx;
			box-sizing: border-box;

			.gold {
				width: 66rpx;
				height: 66rpx;
				position: absolute;
				left: 6rpx;
				top: 50%;
				transform: translateY(-50%);
			}

			text {
				font-weight: 500;
				color: #FFECCC;
				font-size: 30rpx;
			}
		}

		.inventory {
			width: 580rpx;
			height: 86rpx;
			background: linear-gradient(108deg, #FCE8C3 0%, #FCE8C3 100%);
			box-shadow: 0px 2rpx 0px 0px rgba(227, 174, 77, 0.3), 0px -2rpx 0px 0px #FFF7E9;
			border-radius: 16rpx;
			margin: 30rpx auto 20rpx;
			text-align: center;
			line-height: 86rpx;
			font-size: 28rpx;
			color: #A3894C;

			text {
				color: #ED5B26;
			}
		}

		.seedUl {
			margin: 20rpx auto;
			width: 554rpx;
			// height: 238rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			flex-wrap: wrap;

			.seedLi {
				width: 49.5%;
				height: 80rpx;
				border-right: 2rpx solid rgba(227, 204, 140, 0.46);
				display: flex;
				justify-content: space-around;
				align-items: center;

				.liImgBox {
					width: 34rpx;
					height: 34rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					background-color: #DCC389;
					border-radius: 6rpx;
				}

				.seedLiImg {
					width: 28rpx;
					height: 28rpx;
				}

				.kindOf {
					transform: translateX(-20rpx);
				}

				.buyNum,
				.kindOf {
					font-weight: 500;
					font-size: 28rpx;
					color: #A3894C;
				}
			}

			.seedLi:nth-child(even) {
				border: none;
			}
		}



		.seedList {
			margin: 0 auto;
			width: 580rpx;
			height: 340rpx;
			background: linear-gradient(108deg, #FCE8C3 0%, #FCE8C3 100%);
			box-shadow: 0px 2rpx 0px 0px rgba(227, 174, 77, 0.3), 0px -2rpx 0px 0px #FFF7E9;
			border-radius: 16rpx;
			padding-top: 20rpx;

			.header {
				width: 554rpx;
				height: 54rpx;
				background: linear-gradient(270deg, #FFA164 0%, #FF7C55 100%);
				box-shadow: 0px 2rpx 0px 0px rgba(255, 255, 255, 0.18), 0px 2rpx 0px 0px rgba(249, 106, 46, 0.27);
				border-radius: 27rpx;
				margin: 0 auto;
				display: flex;
				align-items: center;

				.left,
				.right {
					width: 50%;
					display: flex;
					justify-content: space-around;
					font-size: 28rpx;
					color: #FFFCEB;
				}

				.left {
					border-right: 2rpx solid rgba(249, 103, 61, 0.42);
				}
			}
		}

		.express {
			.expressBox {
				margin: 10rpx auto 0;
				width: 144rpx;
				height: 134rpx;
				background: #FFEFD6;
				border-radius: 7rpx;
				border: 2rpx solid #E8BE78;
				padding-top: 10rpx;

				.expressImg {
					margin-left: 22rpx;
					width: 92rpx;
					height: 70rpx;
				}

				.expressName {
					margin-top: 6rpx;
					width: 144rpx;
					height: 50rpx;
					background: #FEE7C2;
					text-align: center;
					line-height: 50rpx;
					color: #C9824C;
					font-size: 34rpx;
				}
			}

			.expressText {
				width: 100%;
				text-align: center;
				font-size: 30rpx;
				color: #A3894C;
				margin-top: 10rpx;
			}

			.expressWord {
				position: relative;
				margin: 10rpx auto 0;
				width: 570rpx;
				height: 64rpx;
				line-height: 64rpx;
				background: linear-gradient(108deg, #FCE8C3 0%, #FCE8C3 100%);
				box-shadow: 0px 2rpx 0px 0px rgba(227, 174, 77, 0.3), 0px -2rpx 0px 0px #FFF7E9;
				border-radius: 32rpx;
				font-size: 28rpx;
				color: #9F7217;
				padding-left: 40rpx;
				box-sizing: border-box;

				.center {
					position: absolute;
					left: 50%;
					top: 50%;
					transform: translate(-50%, -50%);

					.point {
						width: 8rpx;
						height: 8rpx;
						position: absolute;
						left: -12rpx;
						top: 50%;
						background: #9F7217;
						transform: translateY(-50%);
					}

					text {
						color: #ED5B26;
					}
				}

			}

			.expressScroll {
				margin: 10rpx auto 0;
				width: 580rpx;
				height: 402rpx;
				background: linear-gradient(108deg, #FCE8C3 0%, #FCE8C3 100%);
				box-shadow: 0px 2rpx 0px 0px rgba(227, 174, 77, 0.3), 0px -2rpx 0px 0px #FFF7E9;
				border-radius: 16rpx;
			}

			.expressList {
				display: flex;
				align-items: center;
				flex-wrap: wrap;

				.expressLi {
					width: 25%;
					height: 58rpx;
					display: flex;
					align-items: center;
					justify-content: space-around;

					.liImgBox {
						width: 34rpx;
						height: 34rpx;
						display: flex;
						justify-content: center;
						align-items: center;
						background-color: #DCC389;
						border-radius: 6rpx;
					}

					.seedLiImg {
						width: 28rpx;
						height: 28rpx;
					}

					.kindOf {
						font-weight: 500;
						font-size: 26rpx;
						color: #A3894C;
					}
				}
			}

		}

		.footer {
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			bottom: 0;
			padding-top: 22rpx;
			width: 560rpx;
			margin: 0 auto;
			height: 92rpx;
			background: linear-gradient(108deg, #FCE8C3 0%, #FCE8C3 100%);
			box-shadow: 0px 2rpx 0px 0rpx rgba(227, 174, 77, 0.3), 0px -2rpx 0px 0px #FFF7E9;
			border-radius: 16rpx;

			.cancel {
				margin: 0 50rpx 0 40rpx;
				display: inline-block;
				width: 212rpx;
				height: 74rpx;
				background: #FCEAC2;
				border: 2rpx solid rgba(250, 101, 42, 0.51);
				font-size: 30rpx;
				color: #FA682C;
				border-radius: 20rpx;
				line-height: 74rpx;
				font-weight: 500;
				text-align: center;
			}

			.confirm {
				width: 212rpx;
				height: 76rpx;
				background: url('@/static/popup/bt_suer.png') no-repeat;
				background-size: 100% 100%;
				display: inline-block;
				text-align: center;
				line-height: 66rpx;
				font-weight: 500;
				font-size: 30rpx;
				color: #FFF1D0;
			}
		}

		.amend {
			margin-top: 20rpx;
			width: 100%;

			.word {
				text-align: center;
				font-size: 24rpx;
				color: #9F7217;
			}

			.amendOptions {
				margin-top: 20rpx;
				display: flex;
				align-items: center;
				justify-content: space-around;

				.option {
					padding-top: 4rpx;
					box-sizing: border-box;
					width: 130rpx;
					height: 52rpx;
					box-shadow: 0px 2rpx 6rpx 0px rgba(255, 242, 185, 0.66), 0px -2rpx 4rpx 0px rgba(255, 224, 130, 0.37);
					border-radius: 6rpx;
					color: #C77C2B;
					font-size: 28rpx;
					text-align: center;
					line-height: 52rpx;
					background: url('@/pagesB/static/seedShop/bt_bg.png') no-repeat;
					background-size: 100% 100%;

					.sign {
						width: 20rpx;
						height: 28rpx;
					}
				}
			}
		}

		.consume {
			margin: 20rpx auto 0;
			width: 570rpx;
			height: 64rpx;
			background: linear-gradient(108deg, #FCE8C3 0%, #FCE8C3 100%);
			box-shadow: 0px 2rpx 0px 0px rgba(227, 174, 77, 0.3), 0px -2rpx 0px 0px #FFF7E9;
			border-radius: 32rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 28rpx;
			color: #9F7217;

			text {
				color: #ED5B26;
			}

			image {
				width: 30rpx;
				height: 30rpx;
			}
		}
	}
</style>
