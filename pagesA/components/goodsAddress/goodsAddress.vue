<template>
	<view class="goodsAddress">
		<view class="mask"></view>
		<view class="panel">
			<view class="close" @click="close"></view>
			<view class="header">
				<view class="text">
					<image src="@/pagesA/static/integral/img_line01@2x.png" mode=""></image>
					<view class="title" v-text="moduleModel === 'default'?'收获地址'
					:moduleModel === 'editAddr'?'编辑地址' : '新增地址'">
						收货地址
					</view>
					<image src="@/pagesA/static/integral/img_line02@2x.png" mode=""></image>
				</view>
				<view class="edit" v-if="moduleModel==='default'" v-text="isEdit?'完成':'管理'" @click="isEdit = !isEdit">
					完成
				</view>
			</view>
			<view class="" v-if="moduleModel==='default'">
				<scroll-view scroll-y="true" class="addressUl">
					<view :class="{addressLi:true,currentAddr:currentAddr}">
						<image class="toAmend" src="@/pagesA/static/integral/icon_editor@2x.png" mode=""></image>
						<view class="info">
							<view class="headers">
								<view class="name">
									我能否
								</view>
								<view class="phone">
									115631325465
								</view>
								<view class="default" v-if="isDefault">
									默认
								</view>
							</view>
							<view class="info-center">
								halo世界里康乐那两个女生零零开发接口i领导安康就发哈克里
							</view>
						</view>
						<view class="editDefault" v-if="isEdit">
							<view class="select">
								<image v-if="!isDefault" src="@/pagesA/static/integral/icon_selected@2x.png" mode=""></image>
								<view class="circle" v-else></view>
								<text>设置默认地址</text>
							</view>
							<view class="delete">
								删除
							</view>
						</view>
					</view>
				</scroll-view>
				<view class="addAddress">
					<view class="fromWX">
						<image src="@/pagesA/static/integral/icon_WeChat@2x.png" mode=""></image>
						<text>微信导入</text>
					</view>
					<view class="fromOwn" @click="moduleModel = 'addAddr'">
						<image src="@/pagesA/static/integral/icon_add@2x.png" mode=""></image>
						<text>新建收获地址</text>
					</view>
				</view>
			</view>
			<view class="addrBox" v-else>
				<view class="option">
					<text class="label">收件人</text>
					<input type="text" value="" placeholder="请填写收货人姓名" placeholder-class="inPlace" />
				</view>
				<view class="option">
					<text class="label">联系电话</text>
					<input type="number" value="" placeholder="请填写收货人电话" placeholder-class="inPlace" />
				</view>
				<view class="option">
					<text class="label">所在地址</text>
					<view class="userAddr" @click="openPicker">
						<!-- 						<view class="toAdd">
							<text>点击选择地址</text>
							<image class="iconaddr" src="@/pagesA/static/integral/icon_triangle01@2x.png" mode=""></image>
						</view> -->
						<view class="toAdd">
							<text>我的老家</text>
							<image class="iconaddr" src="@/pagesA/static/integral/icon_triangle01@2x.png" mode=""></image>
						</view>
					</view>
				</view>
				<view class="option detailAddrs">
					<text class="label detailLabel">详细地址</text>
					<textarea class="detailAddr" value="" placeholder="需要填写楼栋层或房号信息" placeholder-class="inPlace" />
				</view>
				<view class="option">
					<text class="label">备注</text>
					<input type="text" value="" placeholder="备注信息写在这里" placeholder-class="inPlace" />
				</view>
				<view class="confirm">
					确定
				</view>
				<lotus-address v-on:choseVal="choseValue" :lotusAddressData="lotusAddressData"></lotus-address>
			</view>
		</view>
	</view>
</template>

<script>
	import lotusAddress from "@/components/Winglau14-lotusAddress/Winglau14-lotusAddress.vue";
	export default {
		name: 'goodsAddress',
		components: {
			lotusAddress
		},
		data() {
			return {
				moduleModel: 'default',
				isDefault: true,
				isEdit: false,
				currentAddr: true,
				lotusAddressData: {
					visible: false,
					provinceName: '',
					cityName: '',
					townName: '',
				},
				region: ''
			}
		},
		methods: {
			//打开picker
			openPicker() {
				this.lotusAddressData.visible = true;
				this.lotusAddressData.provinceName = '广东省';
				this.lotusAddressData.cityName = '广州市';
				this.lotusAddressData.townName = '白云区';
			},
			//回传已选的省市区的值
			choseValue(res) {
				//res数据源包括已选省市区与省市区code
				console.log(res);
				this.lotusAddressData.visible = res.visible; //visible为显示与关闭组件标识true显示false隐藏
				//res.isChose = 1省市区已选 res.isChose = 0;未选
				if (res.isChose) {
					this.lotusAddressData.provinceName = res.province; //省
					this.lotusAddressData.cityName = res.city; //市
					this.lotusAddressData.townName = res.town; //区
					this.region = `${res.province} ${res.city} ${res.town}`; //region为已选的省市区的值
				}
			},
			close() {
				this.$parent.goodsAddrShow = false
			}
		}
	}
</script>

<style lang="scss" scoped>
	.goodsAddress {
		width: 100%;
		height: 100vh;
		position: absolute;
		left: 0;
		top: 0;

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
			bottom: 0;
			width: 100%;
			height: 83.2vh;
			border-radius: 32rpx 32rpx 0px 0px;
			background: #FFFFFF;

			.close {
				position: absolute;
				right: 40rpx;
				top: -80rpx;
				width: 60rpx;
				height: 60rpx;
				background: url('@/pagesA/static/integral/icon_close01@2x.png') no-repeat;
				background-size: 100% 100%;
			}

			.header {
				position: relative;
				left: 0;
				top: 0;
				width: 100%;
				height: 118rpx;
				background: url('@/static/recharge/img_pattern@2x.png') no-repeat;
				background-size: 100% 100%;

				.edit {
					position: absolute;
					right: 20rpx;
					top: 50%;
					transform: translateY(-50%);
					width: 138rpx;
					height: 66rpx;
					background: url('@/pagesA/static/integral/btn_management@2x.png') no-repeat;
					background-size: 100% 100%;
					font-size: 26rpx;
					color: #FFF6F6;
					line-height: 60rpx;
					text-align: center;
				}

				.text {
					margin: 0 auto;
					width: 88%;
					height: 100%;
					display: flex;
					justify-content: space-around;
					align-items: center;

					.title {
						font-size: 36rpx;
						color: #FF4243;
					}

					image {
						width: 176rpx;
						height: 22rpx;
					}
				}
			}

			.addrBox {
				.confirm {
					margin: 200rpx auto 0;
					width: 690rpx;
					height: 152rpx;
					background: url('@/pagesA/static/integral/btn_determine@2x.png') no-repeat;
					background-size: 100% 100%;
					text-align: center;
					line-height: 126rpx;
					font-size: 36rpx;
					color: #FFFFFF;
				}

				.option {
					display: flex;
					align-items: center;
					height: 110rpx;
					border-bottom: 2rpx solid #DDDEE2;

					.label {
						flex: 3;
						text-align: center;
						color: #333333;
						font-size: 28rpx;
					}

					.userAddr {
						flex: 7;

						.toAdd {
							position: relative;
							font-size: 28rpx;
							height: 64rpx;
							border: 2rpx solid #DDDEE2;
							line-height: 64rpx;
							background: #F8F6F7;
							box-sizing: border-box;
							display: flex;
							align-items: center;
						}

						text {
							margin: 0 20rpx;
						}

						.iconaddr {
							position: absolute;
							right: 20rpx;
							top: 50%;
							transform: translateY(-50%);
							width: 32rpx;
							height: 30rpx;
						}
					}

					.detailAddr {
						margin-top: 20rpx;
						flex: 7;
						font-size: 28rpx;
						height: 120rpx;
					}

					input {
						flex: 7;
					}

					/deep/.inPlace {
						color: #B8B8B8;
						font-size: 28rpx;
					}
				}
			}

			.detailAddrs {
				height: 140rpx !important;

				.detailLabel {
					transform: translateY(-36rpx);
				}
			}

			.addressUl {
				height: 64vh;

				.currentAddr {
					border: 2rpx solid rgba(255, 66, 67, 0.30196078431372547);
				}

				.addressLi {
					position: relative;
					left: 0;
					top: 0;
					box-sizing: border-box;
					padding: 20rpx 20rpx 0;
					width: 95.67%;
					margin: 0 auto 20rpx;
					border-radius: 16rpx;
					box-shadow: 0px 6rpx 20rpx rgba(185, 162, 162, 0.3);

					.toAmend {
						position: absolute;
						right: 30rpx;
						top: 60rpx;
						width: 48rpx;
						height: 48rpx;
					}

					.info {
						// height: 50rpx;

						.headers {
							display: flex;
							justify-content: flex-start;
							align-items: flex-end;

							.name {
								font-weight: 700;
								font-size: 32rpx;
								color: #333333;
							}

							.phone {
								margin: 0 10rpx;
								font-size: 26rpx;
								color: #999999;
							}

							.default {
								width: 80rpx;
								height: 32rpx;
								background: linear-gradient(91deg, #FF6768 0%, #FF9786 100%);
								border-radius: 18rpx;
								font-size: 24rpx;
								color: #FFFFFF;
								line-height: 32rpx;
								text-align: center;
							}
						}

						&-center {
							width: 68.8%;
							height: 84rpx;
							font-size: 28rpx;
							line-height: 44rpx;
							color: #666666;
							padding-bottom: 20rpx;
						}
					}

					.editDefault {
						display: flex;
						justify-content: space-between;
						align-items: center;
						margin: 0 auto;
						height: 80rpx;
						border-top: 2rpx solid #F1F2F6;

						.select {
							display: flex;
							justify-content: space-between;
							align-items: center;

							.circle {
								width: 36rpx;
								height: 36rpx;
								border: 1rpx solid #999999;
								border-radius: 50%;
							}

							image {
								width: 36rpx;
								height: 36rpx;
							}

							text {
								margin-left: 10rpx;
								color: #666666;
								font-size: 26rpx;
							}
						}

						.delete {
							width: 120rpx;
							height: 48rpx;
							text-align: center;
							line-height: 48rpx;
							border: 2rpx solid #FF4243;
							border-radius: 24rpx;
							font-size: 28rpx;
							color: #FF4243;
						}
					}
				}
			}

			.addAddress {
				width: 100%;
				height: 144rpx;
				position: absolute;
				left: 0;
				bottom: 0;
				display: flex;
				align-items: center;
				justify-content: space-around;

				.fromWX {
					width: 260rpx;
					height: 80rpx;
					background: #E5FFE6;
					border: 2rpx solid rgba(97, 179, 101, 0.6);
					border-radius: 16rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					color: #3D443D;
					font-size: 32rpx;

					image {
						margin-right: 10rpx;
						width: 48rpx;
						height: 48rpx;
					}
				}

				.fromOwn {
					width: 386rpx;
					height: 80rpx;
					background: url('@/pagesA/static/integral/btn_address@2x.png') no-repeat;
					background-size: 100% 100%;
					display: flex;
					align-items: center;
					justify-content: center;
					color: #FFFFFF;
					font-size: 32rpx;


					image {
						margin-right: 10rpx;
						width: 28rpx;
						height: 28rpx;
					}
				}
			}
		}
	}
</style>
