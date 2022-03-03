<template>
	<view class="coinRecord">
		<view class="mask"></view>
		<view class="panel">
			<view class="header">
				<image class="userPic" :src="userInfo.headimg" mode=""></image>
				<image class="coin" src="@/static/pet/icon_gold.png" mode=""></image>
				<text>{{coin}}</text>
			</view>
			<view class="record">
				<view class="close" @click="close"></view>
				<view class="headBg">
					<view class="titleBg">
						<text>金币记录</text>
					</view>
				</view>
				<view class="explain">
					<view class="time">
						时间
					</view>
					<view class="coinExplain">
						金币记录
					</view>
				</view>
				<view class="recordList">
					<view class="recordLi" v-for="(item,index) in coinRecordList" :key="index">
						<view class="left">
							<view class="name">
								{{item.remark}}
							</view>
							<view class="time">
								{{item.writetime}}
							</view>
						</view>
						<view class="right">
							<text :class="[item.coin>=0? 'red':'green']">{{item.coin}}</text>
						</view>
					</view>
				</view>
				<view class="hint">
					下滑加载更多,仅显示最近<text>100</text>条记录
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import util from '@/util/util.js'
	export default {
		computed: {
			coin() {
				return this.$store.state.coin
			},
			userInfo(){
				return this.$store.state.userInfo
			}
		},
		name: "coinRecord",
		data() {
			return {
				coinRecordList: []
			}
		},
		methods: {
			close() {
				this.$parent.coinRecordShow = false
			}
		},
		created() {
			this.$ajax('User/CoinLog', {
				page: 1,
				pagesize: 100
			}).then((res) => {
				this.coinRecordList = res.Data.list
				this.coinRecordList.forEach((item) => {
					item.writetime = util.toTime(item.writetime)
				})
			})
		}
	}
</script>

<style lang="scss" scoped>
	.coinRecord {
		width: 100%;
		position: absolute;
		left: 0;
		top: 0;
		height: 100vh;

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

			.record {
				position: absolute;
				left: 0;
				bottom: 0;
				width: 100%;
				height: 83.2vh;
				background: #FFFFFF;
				border-radius: 32rpx 32rpx 0 0;

				.close {
					position: absolute;
					right: 20rpx;
					top: -80rpx;
					width: 60rpx;
					height: 60rpx;
					background: url('@/static/recharge/icon_close01@2x.png') no-repeat;
					background-size: 100% 100%;
				}

				.headBg {
					padding-top: 50rpx;
					box-sizing: border-box;
					height: 118rpx;
					background: url('@/static/recharge/img_pattern@2x.png') no-repeat;
					background-size: 100% 100%;

					.titleBg {
						text-align: center;
						margin: 0 auto;
						width: 548rpx;
						height: 22rpx;
						background: url('@/static/recharge/img_line@2x.png') no-repeat;
						background-size: 100% 100%;
						font-size: 36rpx;
						color: #FF4243;

						text {
							display: inline-block;
							transform: translateY(-30%);
						}
					}
				}

				.explain {
					margin: 0 auto;
					width: 686rpx;
					height: 66rpx;
					background-color: #F6F6F6;
					color: #333333;
					font-size: 30rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;

					.time {
						padding-left: 60rpx;
						box-sizing: border-box;
						flex: 3;
					}

					.coinExplain {
						flex: 1;
					}
				}

				.recordList {
					width: 100%;
					padding: 0 40rpx;
					box-sizing: border-box;
					height: 80%;
					overflow: scroll;

					.recordLi {
						display: flex;
						align-items: center;
						justify-content: space-between;
						height: 150rpx;
						border-bottom: 2rpx solid #F1F2F6;

						.left {
							.name {
								height: 50rpx;
								line-height: 50rpx;
								font-size: 30rpx;
								color: #333333;
							}

							.time {
								font-size: 24rpx;
								color: #999999;
							}
						}

						.right {
							padding-right: 60rpx;
							font-size: 32rpx;

							.red {
								color: #FF4243;
							}

							.green {
								color: #61B365;
							}
						}
					}
				}

				.hint {
					width: 100%;
					text-align: center;
					color: #999999;
					font-size: 24rpx;

					text {
						color: #FF4243;
					}
				}
			}
		}
	}
</style>
