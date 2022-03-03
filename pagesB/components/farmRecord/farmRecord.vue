<template>
	<view class="farmRecord">
		<popup title="果园记录" @closePopup="closePopup" :popupHeight="900" :popupWidth="632" :showClose="true">
			<view class="normal" v-if="!recordDetail">
				<scroll-view @scrolltolower="farmRecordScroll" scroll-y="true"
					style="height: 600rpx; margin-top: 20rpx;">
					<view class="farmUl">
						<view class="farmLi" @click="seeRecordDetail(item)" v-for="(item,index) in joinRecordList"
							:key="index">
							<view class="fruitName" v-text="item.Status === 0?'枯苗':item.ResultName">

							</view>
							<image v-if="item.Status === 0" class="fruitImg1"
								src="@/static/seed/kindof_one/status_6.png" mode=""></image>
							<image v-else class="fruitImg" :src="require(`@/static/fruit/img_fruit_${item.ResultNums}.png`)" mode=""></image>
							<view class="number">
								数量<text v-text="item.Status === 0?'- -':item.Instone"></text>
							</view>
							<view class="life">
								生命<text v-text="item.Status === 0?'- -':item.ResultOdds"></text>
							</view>
							<view class="sign">
								{{item.Period}}号果园
							</view>
							<view class="maskLi" v-if="item.Status === 2">
								<image src="@/pagesB/static/img_hadfeed.png" mode=""></image>
							</view>
						</view>
					</view>
				</scroll-view>
				<view class="farmWord">
					<view class="point"></view>
					全部喂养成熟蔬果预计可获赠<text>{{totalCoin}}</text>金币
				</view>
				<view class="farmBtn" @click="$Router.push({path:'/pet'})">
					前往喂养萌宠
				</view>
			</view>
			<view class="detail" v-else>
				<view class="header">
					<view class="left"></view>
					<view class="center">
						入侵记录
					</view>
					<view class="right"></view>
				</view>
				<view class="attackRecord">
					<image src="@/pagesB/static/img_wildpig.png" mode=""></image>
					<view class="attackRecordInfo">
						野猪袭击了<text>{{detailInfo.Period}}号</text>果园，
						大家齐心抵抗，只有<text>{{detailInfo.Name}}</text>幸免于难。
					</view>
				</view>
				<view class="header">
					<view class="left"></view>
					<view class="center">
						播种情况
					</view>
					<view class="right"></view>
				</view>
				<view class="seedInfo">
					<view class="buyHeader">
						<view class="option">
							<text>种子</text>
							<text>数量</text>
						</view>
						<view class="option">
							<text>种子</text>
							<text>数量</text>
						</view>
					</view>
					<view class="buyInfo">
						<view class="buyInfoLi" v-for="(item,index) in detailInfo.Seeds" :key="index">
							<view class="seedImg">
								<image src="@/static/seedShop/img_tomato.png" mode=""></image>
							</view>
							<view class="seedName">
								{{item.Name}}
							</view>
							<view class="seedNum">
								{{item.Instone}}
							</view>
						</view>
					</view>
					<view class="seedHint">
						下滑加载更多<image src="@/pagesB/static/icon_more.png" mode=""></image>
					</view>
					<view class="footer">
						<view class="total">
							合计
						</view>
						<view class="totalNum">
							<image src="@/pagesB/static/seed_icon.png" mode=""></image>
							{{total}}
						</view>
						<view class="buyBtn" @click="continueBuy">
							继续购买
						</view>
					</view>
				</view>
			</view>
		</popup>
	</view>
</template>

<script>
	//0烂果1正常2以喂养
	export default {
		name: 'farmRecord',
		computed: {
			totalCoin() {
				let d = 0
				this.joinRecordList.forEach((item) => {
					if (item.Status === 1) {
						d = item.Outstone + d
					}
				})
				return d
			}
		},
		data() {
			return {
				total: 0,
				joinRecordList: [],
				farmRecordPage: 2,
				recordDetail: false,
				stopScroll: false,
				detailInfo: {}
			}
		},
		methods: {
			farmRecordScroll() {
				if (this.stopScroll) return
				this.$ajax('/Game/UserHistory', {
					page: this.farmRecordPage++,
					pagesize: 10
				}).then((res) => {
					if (res.Data.List.length === 0) {
						this.stopScroll = true
						return
					}
					res.Data.List.forEach((item) => {
						item.ResultName = item.ResultName.split('-')[1]
					})
					this.joinRecordList.push(...res.Data.List)
				})
			},
			seeRecordDetail(item) {
				this.recordDetail = true
				this.$ajax('/Game/UserBuySeedsList', {
					termid: item.Termid
				}).then((res) => {
					this.detailInfo = res.Data
					this.detailInfo.Seeds.forEach((item) => {
						this.total = this.total + item.Instone
					})
				})
			},
			continueBuy() {
				this.$parent.seedShopShow = true
				this.closePopup('farmRecord')
			},
			closePopup(title) {
				this.$emit('closePopup', title)
			}
		},
		created() {
			this.$ajax('/Game/UserHistory', {
				page: 1,
				pagesize: 10
			}).then((res) => {
				this.joinRecordList = res.Data.List
				this.joinRecordList.forEach((item) => {
					item.ResultName = item.ResultName.split('-')[1]
				})
			})
		}
	}
</script>

<style lang="scss" scoped>
	.farmRecord {
		width: 100%;
		position: absolute;
		left: 0;
		top: 0;

		.detail {
			.header {
				width: 50%;
				margin: 30rpx auto 0;
				display: flex;
				align-items: center;
				justify-content: space-around;

				.center {
					font-size: 32rpx;
					font-weight: 500;
					color: #FF7C55;
					transform: translateY(-4rpx);
				}

				.right,
				.left {
					width: 36rpx;
					height: 0rpx;
					border: 2rpx solid;
					border-image: linear-gradient(270deg, rgba(255, 124, 85, 0), rgba(255, 124, 85, 1)) 4 4;
				}

				.left {
					transform: rotateY(180deg);
				}
			}

			.attackRecord {
				width: 580rpx;
				height: 140rpx;
				background: linear-gradient(108deg, #FCE8C3 0%, #FCE8C3 100%);
				box-shadow: 0px 2rpx 0px 0px rgba(227, 174, 77, 0.3), 0px -2rpx 0px 0px #FFF7E9;
				border-radius: 16rpx;
				margin: 10rpx auto;
				display: flex;
				align-items: center;
				justify-content: center;

				image {
					width: 80rpx;
					height: 74rpx;
					margin-right: 10rpx;
				}

				.attackRecordInfo {
					font-size: 28rpx;
					color: #A3894C;
					width: 418rpx;

					text {
						color: #FF7C55;
					}
				}
			}

			.seedInfo {
				box-sizing: border-box;
				padding-top: 20rpx;
				margin: 10rpx auto 0;
				width: 580rpx;
				height: 410rpx;
				background: linear-gradient(108deg, #FCE8C3 0%, #FCE8C3 100%);
				box-shadow: 0px 2rpx 0px 0px rgba(227, 174, 77, 0.3), 0px -2rpx 0px 0px #FFF7E9;
				border-radius: 16rpx;

				.buyHeader {
					margin: 0 auto;
					display: flex;
					align-items: center;
					justify-content: start;
					width: 554rpx;
					height: 54rpx;
					background: linear-gradient(270deg, #FFA164 0%, #FF7C55 100%);
					box-shadow: 0px 2rpx 0px 0px rgba(255, 255, 255, 0.18), 0px 2rpx 0px 0px rgba(249, 106, 46, 0.27);
					border-radius: 27rpx;
					text-align: center;

					.option {
						width: 50%;
						font-size: 28rpx;
						color: #FFFCEB;
						display: flex;
						align-items: center;
						justify-content: space-around;
					}

					.option:nth-child(odd) {
						border-right: 2rpx solid rgba(249, 103, 61, 0.42);
					}
				}

				.buyInfo {
					margin-top: 20rpx;
					width: 100%;
					height: 256rpx;
					display: flex;
					flex-wrap: wrap;
					overflow-y: scroll;

					.buyInfoLi {
						width: 49.8%;
						height: 60rpx;
						display: flex;
						align-items: center;
						justify-content: space-around;

						.seedImg {
							display: flex;
							align-items: center;
							justify-content: center;
							width: 34rpx;
							height: 34rpx;
							background: #DCC389;
							border-radius: 6rpx;

							image {
								width: 28rpx;
								height: 28rpx;
							}
						}

						.seedNum,
						.seedName {
							font-size: 28rpx;
							font-weight: 500;
							color: #A3894C;
						}

						.seedName {
							transform: translateX(-20rpx);
						}
					}

					.buyInfoLi:nth-child(odd) {
						border-right: 2rpx solid rgba(227, 204, 140, 0.46);
					}
				}

				.seedHint {
					margin-top: 20rpx;
					font-size: 24rpx;
					color: #A3894C;
					display: flex;
					align-items: center;
					justify-content: center;

					image {
						width: 12rpx;
						height: 18rpx;
					}
				}

				.footer {
					position: absolute;
					left: 50%;
					bottom: 20rpx;
					transform: translateX(-50%);
					width: 580rpx;
					height: 108rpx;
					background: linear-gradient(108deg, #FCE8C3 0%, #FCE8C3 100%);
					box-shadow: 0px 2rpx 0px 0px rgba(227, 174, 77, 0.3), 0px -2rpx 0px 0px #FFF7E9;
					border-radius: 16rpx;
					display: flex;
					align-items: center;
					justify-content: space-around;

					.total {
						width: 84rpx;
						height: 40rpx;
						text-align: center;
						line-height: 40rpx;
						background: #FCEAC2;
						border-radius: 4rpx;
						border: 2rpx solid rgba(250, 101, 42, 0.51);
						font-size: 26rpx;
						color: #FF7C55;
					}

					.totalNum {
						display: flex;
						align-items: center;
						justify-content: center;

						image {
							width: 68rpx;
							height: 60rpx;
						}

						font-weight: 500;
						font-size: 30rpx;
						color: #FF7C55;
					}

					.buyBtn {
						width: 212rpx;
						height: 76rpx;
						text-align: center;
						line-height: 60rpx;
						background: url('@/pagesB/static/bt_sure.png') no-repeat;
						background-size: 100% 100%;
						font-size: 30rpx;
						font-weight: 500;
						color: #FFF1D0;
					}
				}
			}
		}

		.farmBtn {
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			bottom: 20rpx;
			width: 212rpx;
			height: 76rpx;
			line-height: 60rpx;
			text-align: center;
			background: url('@/pagesB/static/bt_sure.png') no-repeat;
			background-size: 100% 100%;
			font-weight: 500;
			color: #FFF1D0;
			font-size: 30rpx;
		}

		.farmWord {
			position: relative;
			margin: 30rpx auto 0;
			width: 580rpx;
			height: 64rpx;
			line-height: 64rpx;
			box-sizing: border-box;
			padding-left: 40rpx;
			background: linear-gradient(108deg, #FCE8C3 0%, #FCE8C3 100%);
			box-shadow: 0px 2rpx 0px 0px rgba(227, 174, 77, 0.3), 0px -2rpx 0px 0px #FFF7E9;
			border-radius: 27rpx;
			font-size: 28rpx;
			color: #9F7217;

			.point {
				width: 8rpx;
				height: 8rpx;
				position: absolute;
				left: 18rpx;
				top: 50%;
				background: #9F7217;
				transform: translateY(-50%);
			}

			text {
				color: #ED5B26;
			}
		}

		.farmUl {
			.farmLi {
				position: relative;
				left: 0;
				top: 0;
				display: inline-block;
				margin: 10rpx 10rpx 0;
				width: 180rpx;
				height: 272rpx;
				background: #FFFFFF;
				box-shadow: 0px 4rpx 8rpx 0px rgba(255, 190, 107, 0.5);
				border-radius: 18rpx;

				.maskLi {
					position: absolute;
					left: 0;
					top: 0;
					width: 100%;
					height: 100%;
					border-radius: 18rpx;
					background-color: rgba($color: #000000, $alpha: .6);

					image {
						position: absolute;
						bottom: 30rpx;
						right: 10rpx;
						width: 100rpx;
						height: 92rpx;
					}
				}

				.fruitName {
					margin-top: 10rpx;
					width: 100%;
					text-align: center;
					text-shadow: 0px 4rpx 8rpx rgba(255, 190, 107, 0.5);
					font-size: 28rpx;
					font-weight: 500;
					color: #EAA36D;
				}

				.fruitImg1,
				.fruitImg {
					display: block;
					margin: 10rpx auto;
					width: 80rpx;
					height: 80rpx;
				}

				.life,
				.number {
					width: 100%;
					text-align: center;
					font-size: 28rpx;
					color: #EAA36D;

					text {
						margin-left: 10rpx;
					}
				}

				.sign {
					margin-top: 6rpx;
					height: 42rpx;
					text-align: center;
					line-height: 42rpx;
					background: #EDAD77;
					box-shadow: 0px 4rpx 8rpx 0px rgba(255, 190, 107, 0.5);
					border-radius: 0 0 18rpx 18rpx;
					color: #FFFFFF;
					font-size: 24rpx;
					text-shadow: 0px 4rpx 8rpx rgba(255, 190, 107, 0.5);
				}
			}
		}
	}
</style>
