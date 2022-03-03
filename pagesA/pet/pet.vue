<template>
	<view class="pet">
		<view class="panel">
			<view class="nav" :style="{'padding-top':customHeight*2 + 'rpx'}">
				<text>天天萌宠</text>
			</view>
			<view class="header">
				<view class="level">
					<view class="picBg" @click="myInfoShow = true">
						<image :src="userInfo.headimg" mode=""></image>
					</view>
					<view class="stepBox">
						<view class="step" :style="{'width':`${levelPercent*144}rpx`}">
						</view>
						<view class="grades">
							Lv{{petInfo.pet.level}}/100
						</view>
					</view>
				</view>
				<view class="goldCoin" @click="coinRecordShow = true">
					<image class="coinBg" src="@/pagesA/static/icon_gold.png" mode=""></image>
					<text>{{coin}}</text>
					<image @click.stop="rechargeShow = true" class="add" src="@/pagesA/static/icon_add.png" mode="">
					</image>
					<view class="increased" v-if="increasedCoin>0">+{{increasedCoin}}</view>
				</view>
				<view class="ticket" @click="convertRecordShow = true">
					<image class="ticketBg" src="@/pagesA/static/icon_coupon.png" mode=""></image>
					<text>{{giftCoupon}}</text>
					<view class="increased" v-if="increasedGiftCoupon>0">+{{increasedGiftCoupon}}</view>
				</view>
			</view>
			<view class="petOptions">
				<view class="ticket" @click="integralShow = true">
					<image src="@/pagesA/static/icon_exchange.png" mode=""></image>
				</view>
				<view class="strategy">
					<image src="@/pagesA/static/icon_strategy.png" mode=""></image>
				</view>
				<button open-type="share" plain="true" class="wxShare">
					<image src="@/pagesA/static/icon_wechat_share.png" mode=""></image>
					<view class="tips">
					</view>
				</button>
			</view>
			<view class="petBox">
				<view class="miaow">
					<view class="someTalk">
						室内多通风，让病毒细菌远离你～
					</view>
				</view>
				<view class="shadowCat">
					<image src="@/pagesA/static/shaow_cat.png" mode=""></image>
				</view>
				<view class="petGif">
					<image v-show="!snakeCatShow && !eatCatShow" class="normal" src="https://gcdn.lexun.com/miniprogram/ttmc/img/normal_cat.gif"
						mode=""></image>
					<image v-show="snakeCatShow" class="snake" src="https://gcdn.lexun.com/miniprogram/ttmc/img/snake_cat.gif" mode=""></image>
					<image v-show="eatCatShow" class="eating" src="https://gcdn.lexun.com/miniprogram/ttmc/img/eating_cat.gif" mode=""></image>
				</view>
				<view class="riceBowl">
					<image class="bowl" src="@/pagesA/static/img_catbowl.png" mode=""></image>
					<image v-show="eatCatShow || snakeCatShow" class="food" src="@/pagesA/static/cat_food.png" mode="">
					</image>
				</view>
			</view>
			<view class="backpack">
				<view class="title">
					背包
				</view>
				<view class="empty" v-if="fruitList.length === 0">
					空空如也，快前往果园种植获得食物吧～
				</view>
				<scroll-view scroll-x="true" scroll-left="0" class="fruitScroll" v-else>
					<!-- Y轴移动-210rpx -->
					<view class="fruitLi" @click="feedPet(item,index)" v-for="(item,index) in fruitList" :key='index'>
						<image
							:style="{'transform':`translate(${-item.aniLeft*2}rpx,${-item.aniTop*2}rpx) scale(${item.aniSize});`}"
							id="fruit" :class="{'fruit':true, 'Ani': item.aniLeft && item.aniTop}"
							:src="require(`@/static/fruit/img_fruit_${item.Nums}.png`)" mode="">
						</image>
						<view class="price">
							<image src="@/pagesA/static/icon_gold.png" mode=""></image>
							{{item.Outstone}}
						</view>
					</view>
				</scroll-view>
			</view>
			<view class="toFarm" @click="$Router.push({path:'/farm'})">
				<image src="https://gcdn.lexun.com/miniprogram/ttmc/img/ani_tofarm.gif" mode=""></image>
			</view>
			<swiper class="noticeBoard" :vertical="true" :indicator-dots="false" :autoplay="true" :interval="3000"
				:duration="1000" :circular="true">
				<swiper-item v-for="(item,index) in feedLog" :key='index'>
					<image :src="item.headimg" mode=""></image>
					<view class="swiper-item" v-if="item.type === 3">{{item.nick}}刚刚喂养宠物获得{{item.nums}}金币</view>
					<view class="swiper-item" v-else-if="item.type === 1">可喜可贺，恭喜{{item.nick}}获得{{item.nums}}礼券</view>
					<view class="swiper-item" v-else-if="item.type === 0">可喜可贺，恭喜{{item.nick}}获得{{item.nums}}金币</view>
				</swiper-item>
			</swiper>
			<view class="feed" @click="feedAll"></view>
			<view class="snakeAni" v-if="snakeMove">
				<view :class="{snakeAniBg:true,snakeMove:snakeMove}">
					<image class="goldPic" src="@/pagesA/static/icon_gold.png" mode=""></image>
				</view>
				<view :class="{snakeAniBg1:true,snakeMove1:snakeMove}">
					<image class="couponPic" src="../../static/pet/icon_coupon.png" mode=""></image>
				</view>
			</view>
			<view class="bubble">
				<view v-if="petInfo.rewards[0].isShow" :class="{coinBubble:true,aniOne:animationBubble.aniOne}"
					@click="getFreeCoin(0)">
					<image v-if="petInfo.rewards[0].type === 1" class="couponPic" src="../../static/pet/icon_coupon.png"
						mode=""></image>
					<image v-else class="goldPic" src="@/pagesA/static/icon_gold.png" mode=""></image>
				</view>
				<view v-if="petInfo.rewards[1].isShow"
					:class="{coinBubble:true, shadow1:true,aniTwo:animationBubble.aniTwo}" @click="getFreeCoin(1)">
					<image v-if="petInfo.rewards[1].type !== 1" class="goldPic" src="@/pagesA/static/icon_gold.png"
						mode=""></image>
					<image v-else class="couponPic" src="../../static/pet/icon_coupon.png" mode=""></image>
				</view>
				<view v-if="petInfo.rewards[2].isShow"
					:class="{coinBubble:true, shadow2:true,aniThree:animationBubble.aniThree}" @click="getFreeCoin(2)">
					<image v-if="petInfo.rewards[2].type !== 1" class="goldPic" src="@/pagesA/static/icon_gold.png"
						mode=""></image>
					<image v-else class="couponPic" src="../../static/pet/icon_coupon.png" mode=""></image>
				</view>
				<view v-if="petInfo.rewards[4].isShow"
					:class="{coinBubble:true, shadow3:true,aniFour:animationBubble.aniFour}" @click="getFreeCoin(4)">
					<image v-if="petInfo.rewards[4].type !== 1" class="goldPic" src="@/pagesA/static/icon_gold.png"
						mode=""></image>
					<image class="couponPic" src="../../static/pet/icon_coupon.png" mode=""></image>
				</view>
				<view v-if="petInfo.rewards[3].isShow" :class="{ticketBubble:true,aniTicket:aniTicket}"
					@click="getFreeCoin(3)">
					<image v-if="petInfo.rewards[3].type !== 1" class="goldPic" src="@/pagesA/static/icon_gold.png"
						mode=""></image>
					<image v-else class="couponPic" src="../../static/pet/icon_coupon.png" mode=""></image>
				</view>
			</view>
		</view>
		<!-- 金币记录 -->
		<CoinRecord v-if="coinRecordShow"></CoinRecord>
		<!-- 礼券,兑换记录 -->
		<ConvertRecord v-if="convertRecordShow"></ConvertRecord>
		<!-- 充值商店 -->
		<Recharge v-if="rechargeShow"></Recharge>
		<!-- 我的信息 -->
		<popup v-if="myInfoShow" @closePopup="closePopup" :showClose="true" class="myInfo" :popupHeight="664"
			title="个人信息">
			<view class="userInfo">
				<image class="userPic" :src="userInfo.headimg" mode=""></image>
				<view class="nick">
					<view class="name">
						昵称:{{userInfo.nick}}
					</view>
					<view class="id">
						ID:{{userInfo.UserId}}
					</view>
				</view>
			</view>
			<view class="music">
				<image class="musicIcon" src="@/static/myInfo/icon_music@2x.png" mode=""></image>
				<text>音乐</text>
				<switch :disabled="true" color="#E9A26C" @change="musicChange" />
			</view>
			<view class="sound">
				<image class="musicIcon" src="@/static/myInfo/icon_sound@2x.png" mode=""></image>
				<text>音效</text>
				<switch :disabled="true" color="#E9A26C" @change="soundChange" />
			</view>
			<view class="footer">
				<view class="notice">
					游戏公告
				</view>
				<button type="default" plain="true" class="servie" open-type="contact">
					在线客服
				</button>
			</view>
		</popup>
		<!-- 喂养萌宠 -->
		<popup v-if="feedShow" class="feed" :winResult="true" title="喂养萌宠" :popupHeight="536">
			<image class="feedImg" src="@/pagesA/static/feedafter.png" mode=""></image>
			<view class="feedTalk">
				招财猫吃饱喝足后伸了个懒腰，掉落<text>{{feedPetResult.Coin}}</text>
				金币和<text>{{feedPetResult.GiftCoupon}}</text>礼券。
			</view>
			<view class="feedBtn" @click="feedShow = false">
				确定
			</view>
		</popup>
		<!-- 礼券商店 -->
		<IntegralShop v-if="integralShow" @getUserInfo="getUserInfo"></IntegralShop>
		<!-- 登录提示弹窗 -->
		<Login v-if="!isLogin" @closeLogin="closeLogin"></Login>
	</view>
</template>

<script>
	import {
		mapActions,
		mapState
	} from 'vuex'
	import goodsAddress from '@/pagesA/components/goodsAddress/goodsAddress.vue'
	import Recharge from '@/components/recharge/recharge.vue'
	import ConvertRecord from '@/pagesA/components/convertRecord/convertRecord.vue'
	import CoinRecord from '@/pagesA/components/coinRecord/coinRecord.vue'
	import IntegralShop from '@/pagesA/components/integralShop/integralShop.vue'
	export default {
		name: 'pet',
		components: {
			Recharge,
			ConvertRecord,
			CoinRecord,
			IntegralShop,
			goodsAddress
		},
		computed: {
			...mapState(['userInfo', 'isLogin']),
			coin() {
				let d = this.$store.state.coin
				if (d > 999999) {
					return Math.round(d / 10000) + '万'
				} else {
					return d
				}
			},
			giftCoupon() {
				let d = this.$store.state.giftCoupon
				if (d > 999999) {
					return Math.round(d / 10000) + '万'
				} else {
					return d
				}
			}
		},
		data() {
			return {
				feedLog:[],
				feedPetResult: {},
				increasedCoin: 0,
				increasedGiftCoupon: 0,
				eatCatShow: false,
				snakeCatShow: false,
				aniSize: 1,
				relativeLeft: 0,
				relativeTop: 0,
				fruitAni: true,
				snakeMove: false,
				aniTicket: false,
				animationBubble: {
					aniOne: false,
					aniTwo: false,
					aniThree: false,
					aniFour: false,
				},
				integralShow: false,
				feedShow: false,
				myInfoShow: false,
				coinRecordShow: false,
				convertRecordShow: false,
				rechargeShow: false,
				fruitList: [],
				levelPercent: 1,
				customHeight: 0,
				petInfo: {}, //宠物信息
			}
		},
		methods: {
			...mapActions(['AsyncUserInfo', 'AsyncSetCoin', 'AsyncSetGiftCoupon', 'AsyncAddCoin', 'AsyncAddGiftCoupon']),
			//获取宠物状态信息
			async getPetInfo() {
				const petInfoRes = await this.$ajax('/Pet/PetInfo')
				this.petInfo = petInfoRes.Data
				this.feedLog = petInfoRes.Data.clamelogs
				this.petInfo.rewards.forEach((item) => {
					this.$set(item, 'isShow', true)
				})
			},
			async getUserInfo() {
				const userInfoRes = await this.$ajax('/User/GetUserInfo')
				this.AsyncUserInfo(userInfoRes.Data.userinfo)
				this.AsyncSetCoin(userInfoRes.Data.coin) //res.Data.coin
				this.AsyncSetGiftCoupon(userInfoRes.Data.giftcoupon)
			},
			//喂食宠物
			feedPet(item, index) {
				// 获取饭碗中心位置
				let bowlInfo = {}
				let bowlLeft, bowlTop;
				const bowl = uni.createSelectorQuery()
				bowl.select('.riceBowl').boundingClientRect()
				bowl.selectViewport().scrollOffset()
				bowl.exec(function(res) {
					bowlInfo = res[0]
					bowlLeft = bowlInfo.left + bowlInfo.width / 2
					bowlTop = bowlInfo.top + bowlInfo.height / 2
				})
				//获取当前水果位置
				let fruitInfo = {}
				let fruitLeft, fruitTop;
				const query = uni.createSelectorQuery()
				query.selectAll('#fruit').boundingClientRect()
				query.selectViewport().scrollOffset()
				query.exec(function(res) {
					fruitInfo = res[0][index]
					fruitLeft = fruitInfo.left + fruitInfo.width / 2
					fruitTop = fruitInfo.top + fruitInfo.height / 2
				})
				//计算水果相对于饭碗的相对位置
				setTimeout(() => {
					this.relativeLeft = fruitLeft - bowlLeft
					this.relativeTop = fruitTop - bowlTop
					this.aniSize = 0.4
					this.$set(item, 'aniLeft', this.relativeLeft)
					this.$set(item, 'aniTop', this.relativeTop)
					this.$set(item, 'aniSize', this.aniSize)
				}, 100)
				let flyCoin, flyGiftCopon;
				//飞水果.5s
				setTimeout(() => {
					//删除列表中的对应项
					this.fruitList.forEach((items, indexs) => {
						if (indexs === index) {
							this.fruitList.splice(index, 1)
						}
					})
					//吃水果1.5s
					this.eatCatShow = true
					setTimeout(() => {
						this.eatCatShow = false
						this.snakeCatShow = true
						this.feedCoinAni() //抖飞金币1s
						setTimeout(() => {
							this.feedShow = true
							this.snakeCatShow = false
							//飞数字.5s
							this.increasedCoin = flyCoin
							this.increasedGiftCoupon = flyGiftCopon
							setTimeout(() => {
								this.increasedCoin = 0
								this.increasedGiftCoupon = 0
							}, 1000)
						}, 1000)
					}, 1500)
				}, 800)
				this.$ajax.post('/Game/Feed', {
					termid: item.Termid
				}).then((res) => {
					this.feedPetResult = res.Data
					flyCoin = res.Data.Coin
					flyGiftCopon = res.Data.GiftCoupon
					this.AsyncAddCoin(res.Data.Coin)
					this.AsyncAddGiftCoupon(res.Data.GiftCoupon)
				})
			},
			//获取食物
			async getFood() {
				const foodRes = await this.$ajax('/Game/UserHistoryAll')
				this.fruitList = foodRes.Data.List
			},
			//一键喂养
			feedAll() {
				if(this.fruitList.length === 0) return
				let flyCoin, flyGiftCopon;
				this.fruitList = []
				//吃水果1.5s
				this.eatCatShow = true
				setTimeout(() => {
					this.eatCatShow = false
					this.snakeCatShow = true
					this.feedCoinAni() //抖飞金币1s
					setTimeout(() => {
						this.feedShow = true
						this.snakeCatShow = false
						//飞数字.5s
						this.increasedCoin = flyCoin
						this.increasedGiftCoupon = flyGiftCopon
						setTimeout(() => {
							this.increasedCoin = 0
							this.increasedGiftCoupon = 0
						}, 1000)
					}, 1000)
				}, 1500)
				this.$ajax.post('/Game/FeedAll').then((res) => {
					this.feedPetResult = res.Data
					flyCoin = res.Data.Coin
					flyGiftCopon = res.Data.GiftCoupon
					this.AsyncAddCoin(res.Data.Coin)
					this.AsyncAddGiftCoupon(res.Data.GiftCoupon)
				})
			},
			//喂食金币动画
			feedCoinAni() {
				this.snakeMove = true
				setTimeout(() => {
					this.snakeMove = false
				}, 1000)
			},
			//点击领取免费金币,免费礼券气泡--0.6s
			getFreeCoin(type, animation) {
				if (type === 0) {
					this.animationBubble.aniOne = true
					setTimeout(() => {
						this.animationBubble.aniOne = false
					}, 550)
				} else if (type === 1) {
					this.animationBubble.aniTwo = true
					setTimeout(() => {
						this.animationBubble.aniTwo = false
					}, 550)
				} else if (type === 2) {
					this.animationBubble.aniThree = true
					setTimeout(() => {
						this.animationBubble.aniThree = false
					}, 550)
				} else if (type === 3) {
					this.aniTicket = true
					setTimeout(() => {
						this.aniTicket = false
					}, 550)
				}else if(type === 4){
					this.animationBubble.aniFour = true
					setTimeout(() => {
						this.animationBubble.aniFour = false
					}, 550)
				}
				setTimeout(() => {
					this.petInfo.rewards[type].isShow = false
				}, 550)
				let rewardid = this.petInfo.rewards[type].rid
				this.$ajax.post('/Pet/GetReward', {
					rewardid
				}).then((res) => {
					if (res.Result === 0) {
						if (res.Data.type === 1) {
							setTimeout(() => {
								this.increasedGiftCoupon = res.Data.nums
							}, 600)
							setTimeout(() => {
								this.increasedGiftCoupon = 0
							}, 1000)
							this.AsyncAddGiftCoupon(res.Data.nums)
						} else {
							setTimeout(() => {
								this.increasedCoin = res.Data.nums
							}, 600)
							setTimeout(() => {
								this.increasedCoin = 0
							}, 1000)
							this.AsyncAddCoin(res.Data.nums)
						}
					}
				})
			},
			closeLogin() {
				this.$store.commit('SetIsLogin', true)
			},
			closePopup() {
				this.myInfoShow = false
			},
			musicChange(e) {
				console.log(e.target.value);
			},
			soundChange(e) {
				console.log(e.target.value);
			}
		},
		//分享到朋友圈
		onShareTimeline() {
			return {
				title: '分享到朋友圈123',
				query: {}, //携带参数
				// imageUrl:''
			}
		},
		//编辑分享页
		onShareAppMessage: function(options) {
			// 设置菜单中的转发按钮触发转发事件时的转发内容
			var shareObj = {
				title: '天天萌宠', // 默认是小程序的名称(可以写slogan等)
				path: '/pages/index/index', // 默认是当前页面，必须是以‘/’开头的完整路径
				imageUrl: '../../static/', //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
				success: function(res) {
					// 转发成功之后的回调
				},
				fail: function() {
					uni.showToast({
						title: '转发失败',
						icon: Error
					})
				}
			}
			// 来自页面内的按钮的转发
			if (options.from == 'button') {
				//根据按钮自定义属性区分不同按钮
				var eData = options.target.dataset
				console.log(eData.name) // shareBtn
				// 此处可以修改 shareObj 中的内容
				//分享出去的卡片地址都带上自己的信息标记
				shareObj.path = '/pages/index/index'
			}
			// 返回shareObj
			return shareObj
		},
		created() {
			console.log(uni.getSystemInfoSync()) //获取设备适配
			this.customHeight = uni.getSystemInfoSync()['statusBarHeight']
			console.log(this.$store.state);
			this.getUserInfo()
			this.getPetInfo()
			this.getFood()
		},
		mounted() {}
	}
</script>

<style lang="scss" scoped>
	@import './pet.scss'
</style>
