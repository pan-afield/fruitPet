<template>
	<view class="popup">
		<view class="panel">
			<view class="mask">
			</view>
			<view class="content" :style="{'width':`${popupWidth}rpx`,'height':`${popupHeight}rpx`}">
				<view :class="[winResult?'headers':'header']">
					<view class="title">
						{{title}}
					</view>
				</view>
				<view class="yellowBox">
					<view class="whiteBox" :style="{'width':`${popupWidth-26}rpx`,'height':`${popupHeight-50}rpx`}">
						<view class="figure">
							<image src="@/static/popup/figure.png" mode=""></image>
						</view>
						<slot></slot>
					</view>
				</view>
				<view class="close" v-if="showClose" @click="closePopup">
					<view class="connect">
					</view>
					<image src="@/static/popup/icon_close.png" mode=""></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "popup",
		props: {
			popupWidth: {
				default: 608,
				type: Number
			},
			popupHeight: {
				default: 1102,
				type: Number
			},
			title: {
				default: '温馨提示',
				type: String
			},
			showClose: {
				type: Boolean,
				default: false
			},
			winResult: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {

			};
		},
		methods: {
			closePopup() {
				switch (this.title) {
					case '入侵记录':
						this.$emit('closePopup', 'attack')
						break
					case '个人信息':
						this.$emit('closePopup')
						break
					case '背包':
						this.$emit('closePopup', 'backpack')
						break
					case '果园记录':
						this.$emit('closePopup', 'farmRecord')
						break
					default:
						this.$emit('closePopup')
						break
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.popup {
		.panel {
			width: 100%;
			height: 100vh;
			position: absolute;
			left: 0;
			top: 0;
			z-index: 100;

			.mask {
				position: absolute;
				left: 0;
				top: 0;
				width: 100%;
				height: 100vh;
				background-color: rgba($color: #000000, $alpha: .6);
			}

			.content {
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translate(-50%, -50%);

				.headers,
				.header {
					position: absolute;
					left: 50%;
					top: -80rpx;
					transform: translateX(-50%);
					width: 608rpx;
					height: 144rpx;
					background: url('~@/static/popup/bg_top.png') no-repeat;
					background-size: 100% 100%;

					.title {
						width: 100%;
						text-align: center;
						font-size: 40rpx;
						text-shadow: 0px 2px 6px rgba(208, 108, 32, 0.64);
						color: #FCF9E8;
						margin-top: 20rpx;
					}
				}
				.headers{
					width: 626rpx;
					height: 184rpx;
					top: -136rpx;
					background: url('~@/static/popup/bg_toast-success.png') no-repeat;
					background-size: 100% 100%;
					.title{
						margin-top: 80rpx;
					}
				}
				.yellowBox {
					position: absolute;
					left: 0;
					top: 0;
					width: 100%;
					height: 100%;
					border: 2rpx solid #F6E5BC;
					border-radius: 66rpx;
					background: #F9E99F;

					.whiteBox {
						position: absolute;
						left: 50%;
						top: 16rpx;
						width: 582rpx;
						transform: translateX(-50%);
						border: 2rpx solid #F6E5BC;
						border-radius: 50rpx;
						background: linear-gradient(180deg, #FCF2E8 0%, #FCF2D1 100%);
						box-shadow: 0 8rpx 0 0 rgba(255, 254, 232, 0.66), 0 4rpx 6rpx 0 #E3B963, 0 -2rpx 6rpx 0 #F7C39E;

						.figure {
							position: absolute;
							left: 0;
							bottom: 0;
							width: 582rpx;
							height: 82rpx;

							image {
								width: 100%;
								height: 100%;
							}
						}
					}
				}

				.close {
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);

					.connect {
						position: absolute;
						left: 50%;
						top: 0;
						transform: translateX(-50%);
						width: 2rpx;
						height: 77rpx;
						opacity: 0.64;
						background-color: #F7E69C;
						border: 2rpx solid #F7E69C;
					}

					image {
						position: absolute;
						left: 50%;
						top: 72rpx;
						transform: translateX(-50%);
						width: 68rpx;
						height: 68rpx;
					}
				}
			}
		}
	}
</style>
