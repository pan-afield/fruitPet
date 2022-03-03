<template>
	<view class="farm">
		<view class="panel">
			<view class="nav" :style="{'padding-top':customHeight*2 + 'rpx'}">
				<text>天天萌宠</text>
			</view>
			<view class="background"
				:style="{'transform':`translate(${bgLeft}%,0)`,'transition-property': bgAnimation}">
				<image class="spring" src="@/pagesB/static/bg_spring.png" mode=""></image>
				<image class="autumn" src="@/pagesB/static/bg_fall.png" mode=""></image>
				<image class="springCopy" src="@/pagesB/static/bg_spring.png" mode=""></image>
			</view>
			<view class="seed">
				<image src="@/pagesB/static/text.png" mode=""></image>
				<text>{{gameInfo.Instone}}</text>
			</view>
			<view class="stepBg">
				<view class="stepBox">
					<view class="step" :style="{'transform':`translateX(${gameInfo.Process-100}%)`}">
					</view>
				</view>
				<view class="pigBox" :style="{'transform':`translateX(${gameInfo.Process}%)`}">
					<image class="pig" src="https://gcdn.lexun.com/miniprogram/ttmc/img/prograss_pig.gif" mode=""></image>
				</view>
				<view class="seedHint">
					<text v-if="gameInfo.Countdown<=10">前方危险！野猪即将入侵！请注意规避！</text>
					<text v-else>野猪还有{{leftTime}}到达！请抓紧时间种植！</text>
				</view>
			</view>
			<view class="land" v-if="landShow">
				<view class="landContent">
					<image class="landBg" src="@/pagesB/static/img_landpng.png" mode=""></image>
					<image class="landNum" src="@/pagesB/static/img_number.png" mode=""></image>
					<view class="farmer">
						<image src="@/pagesB/static/img_farmer.png" mode=""></image>
					</view>
					<view class="periods">
						<image src="@/pagesB/static/img_plate.png" mode=""></image>
						<view class="periodsText">
							第{{gameInfo.Period}}号果园
						</view>
					</view>
					<view class="botany">
						<view v-for="(item,index) in plantInfo" :key="index" :class="{'deafultStyle':true, 'seed-0':index ===0,
						'seed-1':index ===1,'seed-2':index===2,'seed-3':index===3,'seed-4':index===4,
						'seed-5':index===5,'seed-6':index===6,'seed-7':index===7,'seed-8':index===8,
						'seed-9':index===9,'seed-10':index===10,'seed-11':index===11,'seed-12':index===12,
						'seed-13':index===13,'seed-14':index===14,'seed-15':index===15,'seed-16':index===16,
						'seed-17':index===17,'seed-18':index===18,'seed-19':index===19,'seed-20':index===20,
						'seed-21':index===21,'seed-22':index===22,'seed-23':index===23,'seed-24':index===24,
						'seed-25':index===25,'seed-26':index===26,'seed-27':index===27,}">
							<view class="kindSeed" v-if="item.kindOfSeed === 1">
								<image v-if="item.isPlanted" :src="item.seedLevel === 5 ? require(`@/pagesB/static/seed/result/img_tree_${item.serial}.png`):
									require(`@/pagesB/static/seed/kindof_one/status_${item.seedLevel}.png`)" mode="">
								</image>
							</view>
							<view class="kindSeed1" v-if="item.kindOfSeed === 2">
								<image v-if="item.isPlanted" :src="item.seedLevel === 5 ? require(`@/pagesB/static/seed/result/img_tree_${item.serial}.png`):
									require(`@/pagesB/static/seed/kindof_two/status_${item.seedLevel}.png`)" mode="">
								</image>
							</view>
						</view>
					</view>
					<image v-if="gameInfo.Countdown>5 && !farmerAniShow" @click="seedShopShow = true" class="toSeed"
						src="@/pagesB/static/icon_plant.png" mode="">
					</image>
				</view>
			</view>
			<view class="toPet" @click="toPet">
				<image class="cat" src="https://gcdn.lexun.com/miniprogram/ttmc/img/normal_cat.gif" mode=""></image>
				<image class="text" src="@/static/pet/text_cat.png" mode=""></image>
			</view>
			<swiper class="noticeBoard" :vertical="true" :indicator-dots="false" :autoplay="true" :interval="3000"
				:duration="1000" :circular="true">
				<swiper-item v-for="(item,index) in seedLogs" :key='index'>
					<image :src="item.HeadImg" mode=""></image>
					<view class="swiper-item">{{item.Nick}}刚刚种下了{{item.Name}}</view>
				</swiper-item>
			</swiper>
			<view class="farmOptions">
				<view class="pig" @click="pigRecord">
					<image src="@/pagesB/static/icon_pig.png" mode=""></image>
				</view>
				<view class="record" @click="farmRecordShow = true">
					<image src="@/pagesB/static/icon_record.png" mode=""></image>
				</view>
				<view class="backpack" @click="openBackpack">
					<image src="@/pagesB/static/icon_backpack.png" mode=""></image>
				</view>
				<view class="buy" @click="seedShopShow=true">
					<image src="@/pagesB/static/icon_buy.png" mode=""></image>
				</view>
			</view>
			<view class="pigAnimation" v-show="pigAnimationShow">
				<image class="pigAni" v-show="pigShow" :src="localPig" mode=""></image>
				<view class="smokeAni" v-show="smokeAniShow">
					<image class="smoke1" src="@/pagesB/static/smoke_pic@2x.png" mode=""></image>
					<image class="smoke2" src="@/pagesB/static/smoke_pic@2x.png" mode=""></image>
				</view>
			</view>
			<view class="farmerAni" v-show="farmerAniShow">
				<view class="mask"></view>
				<image src="https://gcdn.lexun.com/miniprogram/ttmc/img/ani_farmer.gif" mode=""></image>
			</view>
		</view>
		<!-- 种子商店 -->
		<SeedShop v-if="seedShopShow" :gameInfo="gameInfo" @footTheBill="footTheBill"></SeedShop>
		<!-- 充值商店 -->
		<Recharge v-if="rechargeShow"></Recharge>
		<!-- 购买种子提示 -->
		<popup v-if="showLessCoin" :winResult="!buyFail" @closePopup="closePopup" class="lessCoin" :popupHeight="536"
			:showClose="true">
			<image v-if="buyFail" class="cat" src="@/static/popup/img_lackofgold.png" mode=""></image>
			<image v-else class="cat catSuccess" src="@/static/popup/img_order_successfully.png" mode=""></image>
			<view class="reminder">
				<view v-if="buyFail" class="fail">
					<text>金币不足，请前往充值!</text>
				</view>
				<view class="success" v-else>
					<text>购买种子成功!</text>
					<view class="award">
						获赠<text>{{buySeedResult.GiftCoupon}}礼券</text>
					</view>
				</view>
			</view>
			<view class="footer">
				<view class="fail" v-if="buyFail">
					<view class="closeBtn" @click="showLessCoin = false">
						取消
					</view>
					<view class="sureBtn" @click="showLessCoin = false,seedShopShow = true">
						去充值
					</view>
				</view>
				<view class="success" v-else>
					<view class="minBtn">
						{{buySeedTime}}S后自动关闭
					</view>
				</view>
			</view>
		</popup>
		<!-- 入侵记录 -->
		<popup v-if="attackShow" @closePopup="closePopup" class="attack" title='入侵记录' :popupHeight="662"
			:showClose="true">
			<scroll-view class="attackUl" scroll-y="true" @scrolltolower="attackScroll">
				<view class="attackLi" v-for="(item,index) in gameHistoryList" :key="index">
					<image src="@/pagesB/static/img_wildpig.png" mode=""></image>
					<view class="attackInfo">
						<view v-if="index%3 === 0">
							野猪袭击了<text>{{item.Period}}号</text>果园，大家齐心抵抗，
							只有<text>{{item.Name}}</text>幸免于难。
						</view>
						<view v-if="index%3 === 1">
							野猪袭击了<text>{{item.Period}}号</text>果园，
							<text>{{item.Name}}</text>因为不符合猪口味成功存活。
						</view>
						<view v-if="index%3 === 2">
							野猪袭击了<text>{{item.Period}}号</text>果园，守护喵出战，
							保卫了<text>{{item.Name}}</text>。
						</view>
					</view>
				</view>
			</scroll-view>
			<view class="attackHint">
				下滑加载更多
				<image src="@/pagesB/static/icon_more.png" mode=""></image>
			</view>
		</popup>
		<!-- 购买种子 -->
		<BuySeed v-if="buySeedShow" :gameInfo="gameInfo" :buySeedTime="buySeedTime" :termid="gameInfo.Rid"
			:period="gameInfo.Period" :isExpress="isExpress" @getUserInfo="getUserInfo" @buyReward="buyReward"
			@close="close" @closePopup="closePopup"></BuySeed>
		<!-- 背包 -->
		<popup v-if="backpackShow" class="backpack" title='背包' @closePopup="closePopup" :popupHeight="900"
			:popupWidth="632" :showClose="true">
			<scroll-view scroll-y="true" style="height: 600rpx;margin-top: 20rpx;">
				<view class="backpackUl">
					<view class="backpackLi" v-for="(item , index) in fruitList" :key="index">
						<view class="header">
							{{item.Period}}号果园
						</view>
						<image class="fruit" :src="require(`@/static/fruit/img_fruit_${item.Nums}.png`)" mode="">
						</image>
						<view class="price">
							<image src="@/static/pet/icon_gold.png" mode=""></image>
							<text>{{item.Outstone}}</text>
						</view>
					</view>
				</view>
			</scroll-view>
			<view class="backpackWord">
				<text class="point"></text>全部喂养成熟蔬果预计可获赠<text>{{totalCoin}}</text>金币
			</view>
			<view class="backpackBtn" @click="$Router.push({path:'/pet'})">
				前往喂养萌宠
			</view>
		</popup>
		<!-- 果园记录 -->
		<FarmRecord v-if="farmRecordShow" @closePopup="closePopup" :farmRecordShow="farmRecordShow"></FarmRecord>
		<!-- 野猪入侵 -->
		<popup class="pigAttack" v-if="pigAttackShow" :winResult="isWiner" :popupHeight="536" title="野猪入侵">
			<image class="loser" v-if="!isWiner" src="@/static/popup/img_wildpig_attack.png" mode=""></image>
			<image class="winer" v-else :src="require(`@/static/fruit/img_fruit_${gameResult.Nums}.png`)" mode="">
			</image>
			<view class="pigAttackInfo">
				野猪袭击了<text>{{gameResult.Period}}号</text>果园，大家齐心抵抗，
				只有<text>{{gameResult.Name}}</text>幸免于难。
			</view>
			<view class="continue" @click="pigAttackShow = false,isWiner = false">
				确定
			</view>
		</popup>
		<!-- 登录提示 -->
		<Login v-if="!isLogin" @closeLogin="closeLogin"></Login>
	</view>
</template>

<script>
	import {
		mapActions,
		mapState
	} from 'vuex'
	import util from '@/util/util.js'
	import Recharge from '@/components/recharge/recharge.vue'
	import SeedShop from '@/pagesB/components/seedShop/seedShop.vue'
	import BuySeed from '@/pagesB/components/buySeed/buySeed.vue'
	import FarmRecord from '@/pagesB/components/farmRecord/farmRecord.vue'
	export default {
		name: 'farm',
		components: {
			Recharge,
			FarmRecord,
			SeedShop,
			BuySeed
		},
		computed: {
			...mapState(['coin', 'giftCoupon', 'userInfo', 'isLogin']),
			leftTime() {
				let maskerTime = this.gameInfo.Countdown - 5
				let min = Math.floor(maskerTime / 60)
				let second = maskerTime % 60
				if (min === 0) {
					return second + '秒'
				} else {
					return min + '分' + second + '秒'
				}
			},
			totalCoin() {
				let d = 0
				this.fruitList.forEach((item) => {
					d = item.Outstone + d
				})
				return d
			},
			plantInfo() {
				return util.plantInfo
			}
		},
		data() {
			return {
				buySeedTime: 2,
				alreadyOpen: false,
				gameResult: {},
				gameRid: '', //当前游戏期数
				farmerAniShow: false, //2-3s
				localPig: 'https://gcdn.lexun.com/miniprogram/ttmc/img/pig_run.gif',
				pigAnimationShow: false,
				smokeAniShow: false,
				pigShow: false,
				buyFail: true,
				farmRecordShow: false,
				backpackShow: false,
				isExpress: true,
				buySeedShow: false,
				pigAttackShow: false,
				attackShow: false,
				seedShopShow: false,
				convertRecordShow: false,
				rechargeShow: false,
				showLessCoin: false, // 购买种子提示
				landShow: true,
				bgAnimation: 'all',
				bgLeft: 0,
				customHeight: 0,
				scrollAttackPage: 2,
				gameInfo: {}, //游戏进度
				myPlantInfo: {}, //播种信息
				gameHistoryList: [],
				fruitList: [],
				buySeedResult: {},
				gameTimer: {},
				isWiner: false,
				seedLogs: [],
			}
		},
		methods: {
			...mapActions(['AsyncUserInfo', 'AsyncSetCoin', 'AsyncSetGiftCoupon']),
			async getUserInfo() {
				const userInfoRes = await this.$ajax('/User/GetUserInfo')
				this.AsyncUserInfo(userInfoRes.Data.userinfo)
				this.AsyncSetCoin(userInfoRes.Data.coin) //res.Data.coin
				this.AsyncSetGiftCoupon(userInfoRes.Data.giftcoupon)
			},
			toPet() {
				clearInterval(this.gameTimer)
				this.$Router.push({
					path: '/pet'
				})
			},
			//购买种子及奖励
			buyReward(data) {
				this.buySeedResult = data
				let timer = setInterval(() => {
					this.buySeedTime--
					if (this.buySeedTime === 0) {
						this.showLessCoin = false
						this.buySeedTime = 2
						clearInterval(timer)
					}
				}, 1000)
			},
			pigRecord() {
				this.$ajax('/Game/GameHistory', {
					page: 1,
					pagesize: 10
				}).then((res) => {
					this.gameHistoryList = res.Data.list
				})
				this.attackShow = true
			},
			openBackpack() {
				this.backpackShow = true
				this.$ajax('/Game/UserHistoryAll').then((res) => {
					this.fruitList = res.Data.List
				})
			},
			//入侵滚动
			attackScroll() {
				this.$ajax('/Game/GameHistory', {
					page: this.scrollAttackPage++,
					pagesize: 10
				}).then((res) => {
					if (res.Data.list.length === 0) return
					this.gameHistoryList.push(...res.Data.list)
				})
			},
			//野猪出现3S
			pigCome() {
				this.pigAnimationShow = true
				this.smokeAniShow = true
				setTimeout(() => {
					this.pigShow = true
				}, 500)
				setTimeout(() => {
					this.smokeAniShow = false
				}, 1400)
				setTimeout(() => {
					this.pigAnimationShow = false
					this.pigShow = false
					// this.localPig = 'https://gcdn.lexun.com/miniprogram/ttmc/img/pig_run.gif?' + new Date().getTime()
				}, 3000)
			},
			closeLogin() {
				this.$store.commit('SetIsLogin', true)
			},
			//结算
			footTheBill(option) {
				if (option === 1) {
					this.isExpress = false
				} else {
					this.isExpress = true
				}
				this.buySeedShow = true
			},
			closePopup(name) {
				switch (name) {
					case 'attack':
						this.attackShow = false
						break
					case 'buySeed':
						this.buySeedShow = false
						break
					case 'backpack':
						this.backpackShow = false
						break
					case 'farmRecord':
						this.farmRecordShow = false
						break
					default:
						this.showLessCoin = false
						break
				}
			},
			//重置种植种子信息
			initPlant() {
				util.plantInfo.forEach((item) => {
					item.isPlanted = false
					item.seedLevel = 1
				})
			},
			//场景切换1S
			exchangeScene() {
				if (this.bgLeft === 0) {
					this.bgAnimation = 'all'
					this.bgLeft = -100
				} else if (this.bgLeft === -100) {
					this.bgLeft = -200
					setTimeout(() => {
						this.bgAnimation = 'none'
						this.bgLeft = 0
					}, 1000)
				}
				this.landShow = false
				setTimeout(() => {
					this.initPlant()
					this.landShow = true
					this.farmerAniShow = true
					setTimeout(() => {
						this.farmerAniShow = false
					}, 4000)
				}, 1000)
			},
			//开奖结果
			openResult() {
				this.$ajax('/Game/GetResult', {
					termid: this.gameInfo.Rid
				}).then((res) => {
					this.gameResult = res.Data
					setTimeout(() => {
						this.pigAttackShow = true
					}, 4000)
				})
			},
			//获取当前游戏信息
			getGameInfo() {
				this.$ajax('/Game/CurInfo').then((res) => {
					this.gameInfo = res.Data.Gameinfo
					this.seedLogs = res.Data.SeedLogs
					if (res.Data.MyPlant.length > 0 && this.gameInfo.Countdown > 5) {
						this.myPlantInfo = res.Data.MyPlant
						this.myPlantInfo.forEach((item) => {
							util.plantInfo[item.Nums].isPlanted = true
							if (util.plantInfo[item.Nums].seedLevel < 5) {
								util.plantInfo[item.Nums].seedLevel++
							}
						})
					}
					// console.log(util.plantInfo);
					if (this.gameInfo.Countdown === 5) {
						this.alreadyOpen = true
						this.pigCome() //野猪出现持续3S
						setTimeout(() => {
							util.plantInfo.forEach((item) => {
								if (item.serial !== this.gameResult.Nums) {
									item.seedLevel = 6
								}
								if (item.seedLevel !== 1 && item.serial === this.gameResult.Nums) {
									this.isWiner = true
								}
							})
						}, 2000) //野猪出现2s后枯萎
						this.openResult() //4s后出现结果弹窗
						setTimeout(() => {
							this.exchangeScene()
						}, 5000)
					}
					if (this.gameInfo.Countdown < 5 && !this.alreadyOpen) {
						setTimeout(() => {
							this.openResult()
						}, 1000)
					}
				})
			},
		},
		created() {
			this.customHeight = uni.getSystemInfoSync()['statusBarHeight']
			this.getUserInfo()
			this.getGameInfo()
			this.gameTimer = setInterval(() => {
				this.getGameInfo()
			}, 1000)
		}
	}
</script>

<style lang="scss" scoped>
	@import './farm.scss'
</style>
