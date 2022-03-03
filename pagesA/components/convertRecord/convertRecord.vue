<template>
	<view class="convertRecord">
		<view class="mask"></view>
		<view class="panel">
			<view class="header">
				<image class="userPic" :src="userInfo.headimg" mode=""></image>
				<image class="coin" src="@/static/pet/icon_coupon.png" mode=""></image>
				<text>{{giftCoupon}}</text>
			</view>
			<view class="record">
				<view class="close" @click="close"></view>
				<view class="headBg">
					<view class="recordOptions">
						<view :class="{selected:selectedRecord === 1}" @click="selectedRecord =1">
							礼券记录
						</view>
						<text>|</text>
						<view :class="{selected:selectedRecord === 2}" @click="selectedRecord =2">
							兑换记录
						</view>
					</view>
				</view>
				<scroll-view scroll-y="true" @scrolltolower="couponScroll" class="couponRecordList"
					v-if="selectedRecord === 1">
					<view class="recordLi" v-for="(item,index) in getCouponLogs" :key='index'>
						<view class="left">
							<view class="name">
								{{item.source}}
							</view>
							<view class="time">
								{{item.writetime}}
							</view>
						</view>
						<view class="right">
							<text :class="[item.updatenums>=0?'red':'green']"
								v-text="item.updatenums>=0 ? '+' + item.updatenums : item.updatenums"></text>
						</view>
					</view>
				</scroll-view>
				<scroll-view scroll-y="true" @scrolltolower="convertScroll" class="convertRecordList" v-else>
					<view class="recordLi" v-for="(item,index) in convertLogList" :key='index'>
						<view class="left">
							<view class="name">
								{{item.Name}}
							</view>
							<view class="time">
								{{item.Writetime}}
							</view>
						</view>
						<view class="right" v-text="item.Status === -1 ? '兑换失败': item.status === 0 ? '兑换中' : '兑换成功'">
							充值中
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	import util from '@/util/util.js'
	import {
		mapState
	} from 'vuex'
	export default {
		computed: {
			...mapState(['giftCoupon', 'userInfo'])
		},
		name: "convertRecord",
		data() {
			return {
				getCouponLogs: [],
				convertLogList: [],
				selectedRecord: 1,
				couponPage: 2,
				convertPage: 2,
			}
		},
		methods: {
			couponScroll() {
				this.$ajax('/GiftCoupon/GiftCouponLogs', {
					page: this.couponPage++,
					pagesize: 10
				}).then((res) => {
					if(res.Data.list.length === 0) return
					res.Data.list.forEach((item, index) => {
						item.writetime = util.toTime(item.writetime)
					})
					this.getCouponLogs.push(...res.Data.list)
				})
			},
			convertScroll() {
				this.$ajax('/GiftCoupon/ConvertLog', {
					page: this.convertPage++,
					pagesize: 10,
					type:0
				}).then((res) => {
					if(res.Data.list.length === 0) return
					res.Data.list.forEach((item, index) => {
						item.Writetime = util.toTime(item.Writetime)
					})
					this.convertLogList.push(...res.Data.list)
				})
			},
			close() {
				this.$parent.convertRecordShow = false
			}
		},
		created() {
			//兑换日志
			this.$ajax('/GiftCoupon/ConvertLog', {
				page: 1,
				pagesize: 10,
				type:0
			}).then((res) => {
				this.convertLogList = res.Data.list
				this.convertLogList.forEach((item, index) => {
					item.Writetime = util.toTime(item.Writetime)
				})
			})
			//礼券获得日志
			this.$ajax('/GiftCoupon/GiftCouponLogs', {
				page: 1,
				pagesize: 10
			}).then((res) => {
				this.getCouponLogs = res.Data.list
				this.getCouponLogs.forEach((item, index) => {
					item.writetime = util.toTime(item.writetime)
				})
			})
		}
	}
</script>

<style lang="scss" scoped>
	.convertRecord {
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
					height: 118rpx;
					background: url('@/static/recharge/img_pattern@2x.png') no-repeat;
					background-size: 100% 100%;

					.recordOptions {
						display: flex;
						align-items: center;
						justify-content: space-around;
						width: 80%;
						margin: 0 auto;
						font-size: 36rpx;
						color: #333333;
						height: 120rpx;
						text{
							color: #C8BFBF;
						}
						.selected {
							font-weight: bold;
							color: #FF4243;
							position: relative;
						}

						.selected::after {
							content: '';
							position: absolute;
							left: 50%;
							transform: translateX(-50%);
							bottom: -18rpx;
							width: 60rpx;
							height: 8rpx;
							background: linear-gradient(180deg, #FF4243 0%, #FFF5F6 100%);
							border-radius: 60rpx;
						}
					}
				}

				.couponRecordList,
				.convertRecordList {
					width: 100%;
					box-sizing: border-box;
					height: 87%;

					.recordLi {
						padding: 0 40rpx;
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
							font-size: 36rpx;
							color: #666666;
						}
					}
				}

				.couponRecordList {
					.right {
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
		}
	}
</style>
