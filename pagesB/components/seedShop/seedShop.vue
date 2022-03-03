<template>
	<view class="seedShop">
		<view class="mask"></view>
		<view class="panel">
			<view class="header">
				<view class="stepBg">
					<view class="stepBox">
						<view class="step" :style="{'transform':`translateX(${gameInfo.Process-100}%)`}">
						</view>
					</view>
					<view class="pigBox" :style="{'transform':`translateX(${gameInfo.Process}%)`}">
						<image class="pig" src="https://gcdn.lexun.com/miniprogram/ttmc/img/prograss_pig.gif" mode=""></image>
					</view>
				</view>
				<view class="hint">
					<text v-if="gameInfo.Countdown<=5">前方危险！野猪即将入侵！请注意规避！</text>
					<text v-else>野猪还有{{leftTime}}到达！请抓紧时间种植！</text>
				</view>
			</view>
			<view class="shop">
				<image class="coffeeBorder" src="@/static/recharge/img_store02@2x.png" mode=""></image>
				<image class="shopHeader" src="@/static/recharge/img_store01@2x.png" mode=""></image>
				<image @click="close" class="close" src="@/static/recharge/icon_close03@2x.png" mode=""></image>
				<view class="goodsList">
					<view class="optionHeader">
						<view @click="selectedOption = 1" :class="[selectedOption === 1 ? 'selected' : 'normal']">
							<image v-if="selectedOption === 1 " src="@/pagesB/static/seedShop/text_shop_sel.png" mode="">
							</image>
							<image v-else src="@/pagesB/static/seedShop/text_shop_nor.png" mode=""></image>
						</view>
						<view @click="selectedOption = 2" :class="[selectedOption === 2 ? 'selected' : 'normal']">
							<image v-if="selectedOption === 2" src="@/pagesB/static/seedShop/text_express_sel.png" mode="">
							</image>
							<image v-else src="@/pagesB/static/seedShop/text_express_nor.png" mode=""></image>
						</view>
					</view>
					<view class="optionBox">
						<view class="seedBox" v-if="selectedOption === 1">
							<view class="optionLi" v-for="(item,index) in 7" :key="index">
								<view class="liBg"></view>
							</view>
							<view class="fruitUl">
								<view @click="chooseFruit(item)" :class="{'fruitLi':true,'selectedfruitLi':item.select}"
									v-for="(item,index) in seedsInfoList" :key="index">
									<view class="fruit">
										<image :src="require(`@/static/fruit/img_fruit_${index}.png`)" mode=""></image>
									</view>
									<view class="numBg">
										<text>{{index}}</text>
									</view>
									<view :class="{'normalIcon':true,'selectedIcon':item.select}">
									</view>

									<view class="fruitName">
										{{item.Name}}
									</view>
									<view :class="{'normalFooter':true,'selectedFooter':item.select}">
										活力 {{item.Odds}}
									</view>
								</view>
							</view>
						</view>
						<view class="expressBox" v-else>
							<view @click="chooseExpress(item)" class="expressLi" v-for="(item,index) in expressList"
								:key="index">
								<image class="box" src="@/pagesB/static/seedShop/img_carton.png" mode=""></image>
								<!-- 								<view class="select">
									<image v-if="!item.select" src="@/pagesB/static/seedShop/choose_nor.png" mode=""></image>
									<image v-else src="@/pagesB/static/seedShop/sel_seed.png" mode=""></image>
								</view> -->
								<view class="expressName">
									{{item.Name}}
								</view>
							</view>
							<view class="placeholder"></view>
						</view>
					</view>
					<view class="currentSeed" v-if="selectedOption === 1">
						当前已选中<text>{{selectedFruitList.length}}个</text>种子
					</view>
					<!-- 					<view class="currentSeed" v-else>
						当前已选中<text>{{selectedExptessList.length}}个</text>快递
					</view> -->
				</view>
				<view class="coinNum">
					<view class="coin">
						<image class="gold" src="@/static/pet/icon_gold.png" mode=""></image>
						<text>{{coin}}</text>
						<image @click="add" class="add" src="@/static/pet/icon_add.png" mode=""></image>
					</view>
					<image @click="check" class="check" src="@/pagesB/static/seedShop/bt_settlement.png" mode=""></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapMutations
	} from 'vuex'
	export default {
		props: {
			gameInfo: {
				type: Object,
				default: {}
			}
		},
		computed: {
			coin() {
				return this.$store.state.coin
			},
			leftTime() {
				let min = Math.floor(this.gameInfo.Countdown / 60)
				let second = this.gameInfo.Countdown % 60
				if (min === 0) {
					return second + '秒'
				} else {
					return min + '分' + second + '秒'
				}
			},
		},
		data() {
			return {
				expressList: [],
				selectedOption: 1,
				seedsInfoList: [],
				selectedFruitList: [],
				selectedExpressList: [],
			}
		},
		methods: {
			...mapMutations(['SetSeedsOrder', 'SetExpressOrder']),
			//选择水果
			chooseFruit(item) {
				if (item.select) {
					item.select = false
					this.selectedFruitList.forEach((items, indexs) => {
						if (items === item) {
							this.selectedFruitList.splice(indexs, 1)
						}
					})
				} else {
					item.select = true
					this.selectedFruitList.push(item)
				}
				console.log(this.selectedFruitList);
			},
			//选择快递
			chooseExpress(item) {
				this.selectedExpressList = item
				this.SetExpressOrder(this.selectedExpressList)
				this.$emit('footTheBill', this.selectedOption)
			},
			add() {
				this.$parent.seedShopShow = false
				this.$parent.rechargeShow = true
			},
			check() {
				if (this.gameInfo.Countdown <= 5) {
					uni.showToast({
						title: '野猪快来了啦！',
						icon: 'error',
					})
					return
				}
				if (this.gameInfo.Countdown >= 297) {
					uni.showToast({
						title: '还在耕种哦！',
						icon: 'error',
					})
					return
				}
				if (this.selectedOption === 1) {
					if (this.selectedFruitList.length === 0) {
						uni.showToast({
							icon: 'error',
							title: '还未选择种子'
						})
						return
					}
					this.SetSeedsOrder(this.selectedFruitList)
				} else {
					if (this.selectedExpressList.length === 0) {
						uni.showToast({
							icon: 'error',
							title: '还未选择快递'
						})
						return
					}
					this.SetExpressOrder(this.selectedExpressList)
				}
				this.$emit('footTheBill', this.selectedOption)
			},
			close() {
				this.$parent.seedShopShow = false
			}
		},
		created() {
			console.log(this.$store.state);
			this.$ajax('/Game/GetSeedsInfo').then((res) => {
				this.seedsInfoList = res.Data
				this.seedsInfoList.forEach((item) => {
					item.Name = item.Name.split('-')[1].split(']')[0]
					this.$set(item, 'select', false)
				})
			})
			this.$ajax('/Game/GetExpress').then((res) => {
				this.expressList = res.Data
				// this.expressList.forEach((item) => {
				// 	this.$set(item, 'select', false)
				// })
			})
		}
	}
</script>

<style lang="scss" scoped>
	.seedShop {
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
				margin-top: 130rpx;

				.stepBg {
					position: relative;
					margin: 0 auto;
					width: 550rpx;
					height: 34rpx;
					background: rgba(32, 29, 29, 0.7);
					border-radius: 17rpx;

					.stepBox {
						position: absolute;
						left: 0;
						top: 0;
						width: 100%;
						height: 100%;
						border-radius: 17rpx;
						overflow: hidden;

						.step {
							position: absolute;
							left: 0;
							top: 0;
							width: 100%;
							height: 100%;
							background: url('@/pagesB/static/bg_rate.png') no-repeat;
							background-size: 100% 100%;
						}
					}

					.pigBox {
						position: absolute;
						left: 0;
						top: 0;
						width: 100%;
						height: 100%;

						.pig {
							position: absolute;
							left: -42rpx;
							top: -16rpx;
							width: 74rpx;
							height: 64rpx;
						}
					}

				}

				.hint {
					width: 100%;
					text-align: center;
					font-weight: 28rpx;
					color: #9AD355;
				}
			}

			.shop {
				width: 100%;
				position: absolute;
				left: 0;
				bottom: 0;
				height: 77vh;

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

				.close {
					position: absolute;
					right: 12rpx;
					top: -120rpx;
					width: 64rpx;
					height: 64rpx;
				}

				.goodsList {
					position: absolute;
					left: 50%;
					transform: translateX(-50%);
					bottom: 10rpx;
					width: 690rpx;
					height: 89%;
					background: linear-gradient(180deg, #FEA648 0%, #D57D3C 100%);
					border-radius: 36rpx;

					.optionHeader {
						display: flex;
						align-items: center;
						justify-content: space-around;
						position: absolute;
						left: 50%;
						transform: translateX(-50%);
						top: -50rpx;
						width: 96%;

						.normal {
							width: 320rpx;
							height: 90rpx;
							background: url('@/pagesB/static/seedShop/tab_nor.png') no-repeat;
							background-size: 100% 100%;
							display: flex;
							align-items: center;
							justify-content: center;

							image {
								width: 172rpx;
								height: 52rpx;
								transform: translateY(4rpx);
							}
						}

						.selected {
							display: flex;
							align-items: center;
							justify-content: center;
							width: 320rpx;
							height: 90rpx;
							background: url('@/pagesB/static/seedShop/tab_sel.png') no-repeat;
							background-size: 100% 100%;

							image {
								width: 172rpx;
								height: 52rpx;
								transform: translateY(4rpx);
							}
						}
					}

					.optionBox {
						position: absolute;
						left: 50%;
						transform: translateX(-50%);
						top: 30rpx;
						width: 662rpx;
						height: 82%;
						background: #F9DAA7;
						border-radius: 36rpx;
						overflow: scroll;
						padding-bottom: 78rpx;
						box-sizing: border-box;

						.expressBox {
							width: 100%;
							display: flex;
							flex-wrap: wrap;
							align-items: center;
							justify-content: space-around;
							padding: 10rpx 10rpx 0;
							box-sizing: border-box;

							.placeholder {
								width: 120rpx;
								height: 120rpx;
							}

							.expressLi {
								position: relative;
								width: 120rpx;
								height: 120rpx;
								background: #FFEFD6;
								border-radius: 6rpx;
								border: 2rpx solid #E8BE78;
								margin-top: 10rpx;
								box-sizing: border-box;
								padding-top: 10rpx;

								.box {
									width: 92rpx;
									height: 70rpx;
									margin-left: 10rpx;
								}

								.select {
									position: absolute;
									right: 10rpx;
									top: 8rpx;
									width: 40rpx;
									height: 40rpx;

									image {
										width: 100%;
										height: 100%;
									}
								}

								.expressName {
									position: absolute;
									left: 0;
									bottom: 0;
									width: 100%;
									height: 41rpx;
									background: #FEE7C2;
									text-align: center;
									line-height: 41rpx;
									font-size: 28rpx;
									color: #C9824C;
									border-radius: 0 0 6rpx 6rpx;
								}
							}
						}

						.optionLi {
							position: relative;
							width: 100%;
							height: 200rpx;
							// background-color: skyblue;

							.liBg {
								position: absolute;
								left: 0;
								bottom: 0;
								width: 100%;
								height: 40rpx;
								background: url('@/pagesB/static/seedShop/img_showwindow.png') no-repeat;
								background-size: 100% 100%;
							}
						}

						.fruitUl {
							box-sizing: border-box;
							padding: 0 10rpx;
							position: absolute;
							left: 0;
							top: 0;
							width: 100%;
							height: 100%;
							// overflow: hidden;
							display: flex;
							flex-wrap: wrap;
							align-items: center;
							justify-content: space-around;

							.fruitLi {
								position: relative;
								margin: 17rpx 0;
								width: 148rpx;
								height: 160rpx;
								background: #FFEDDA;
								box-shadow: 0px 2rpx 6rpx 0px #FFFFFF;
								border-radius: 8rpx;
								border: 4rpx solid transparent;
							}

							.selectedfruitLi {
								box-shadow: 0px 2rpx 6rpx 0px rgba(254, 140, 48, 0.48), 0px 2px 6px 0px #FFFFFF;
								border-radius: 8rpx;
								border: 4rpx solid #FF7C25;
							}

							.numBg {
								position: relative;
								width: 0;
								height: 0;
								border-top: 28rpx solid #FAE3BC;
								border-left: 43rpx solid #FAE3BC;
								border-right: 43rpx solid transparent;
								border-bottom: 28rpx solid transparent;

								text {
									position: absolute;
									left: -32rpx;
									top: -28rpx;
									color: #C9824C;
									font-size: 26rpx;
								}
							}

							.normalIcon {
								position: absolute;
								right: 4rpx;
								top: 4rpx;
								width: 40rpx;
								height: 40rpx;
								background: url('@/pagesB/static/seedShop/choose_nor.png') no-repeat;
								background-size: 100% 100%;
							}

							.selectedIcon {
								background: url('@/pagesB/static/seedShop/sel_seed.png') no-repeat;
								background-size: 100% 100%;
							}

							.fruit {
								position: absolute;
								left: 50%;
								transform: translateX(-50%);
								top: 12rpx;
								width: 68rpx;
								height: 68rpx;
								background: #F1C49B;
								box-shadow: 0px 2rpx 6rpx 0px rgba(254, 140, 48, 0.48);
								border-radius: 8rpx;

								image {
									position: absolute;
									left: 50%;
									top: 50%;
									transform: translate(-50%, -50%);
									width: 58rpx;
									height: 58rpx;
								}
							}

							.fruitName {
								width: 100%;
								text-align: center;
								margin-top: 24rpx;
								font-size: 26rpx;
								color: #C9824C;
							}

							.normalFooter {
								position: absolute;
								left: 0;
								bottom: 0;
								width: 148rpx;
								height: 45rpx;
								background: linear-gradient(258deg, #F0B680 0%, #E4905A 100%);
								border-radius: 0 0 8rpx 8rpx;
								text-align: center;
								line-height: 45rpx;
								font-size: 26rpx;
								color: #FFFFFF;
							}

							.selectedFooter {
								box-shadow: 0px 2rpx 6rpx 0px rgba(254, 140, 48, 0.48);
								background: linear-gradient(120deg, #FF741F 0%, #FDB44B 100%);
								color: #FFF7BF;
								border-radius: 0 0 4rpx 4rpx;
							}
						}
					}

					.currentSeed {
						position: absolute;
						left: 50%;
						transform: translateX(-50%);
						width: 662rpx;
						bottom: 132rpx;
						height: 78rpx;
						background: #F9DAA7;
						border-radius: 0 0 36rpx 36rpx;
						color: #9F7217;
						text-align: center;
						line-height: 78rpx;
						font-size: 28rpx;

						text {
							color: #ED5B26;
						}
					}
				}

				.coinNum {
					display: flex;
					align-items: center;
					justify-content: space-between;
					width: 88%;
					position: absolute;
					left: 50%;
					transform: translateX(-50%);
					bottom: 40rpx;

					.coin {
						background: rgba(32, 29, 29, 0.4);
						border-radius: 44rpx;
						width: 224rpx;
						height: 74rpx;
						display: flex;
						align-items: center;
						justify-content: space-between;
						padding-right: 8rpx;
						box-sizing: border-box;

						.gold {
							width: 66rpx;
							height: 66rpx;
						}

						.add {
							width: 30rpx;
							height: 32rpx;
						}

						text {
							font-size: 30rpx;
							color: #FFECCC;
						}
					}

					.check {
						width: 414rpx;
						height: 88rpx;
					}
				}
			}
		}
	}
</style>
