<template>
	<a-layout>
		<a-layout-header class="header">
			<div class="logo" />
			<a-menu v-model:selectedKeys="selectedKeys1" theme="dark" mode="horizontal" :style="{ lineHeight: '64px' }">
				<a-menu-item key="1">服务器到期</a-menu-item>
				<a-menu-item key="2">{{ systemTime }}</a-menu-item>
				<a-menu-item key="3" @click="refesh">刷新</a-menu-item>
				<a-menu-item key="4" @click="bulletin">公告</a-menu-item>
				<!-- <a-menu-item v-if="store.sysData.sys" key="3"><label for="">当前语言系统:&nbsp;&nbsp;&nbsp;</label>
					<strong style="color: white;">
						<template v-if="store.sysData.sys[0].lang == 'jp'">日语</template>
<template v-if="store.sysData.sys[0].lang == 'en'">英语</template>
<template v-if="store.sysData.sys[0].lang == 'vi'">韩语</template>
<template v-if="store.sysData.sys[0].lang == 'ko'">越南语</template>
<template v-if="store.sysData.sys[0].lang == 'zh'">繁体中文</template>
</strong>
</a-menu-item>
<a-menu-item key="4" style="width: 100px;">
	<el-select name="" v-if="store.sysData.sys" v-model="store.sysData.sys[0].lang" @change="langChange">
		<el-option value="jp">日语</el-option>
		<el-option value="en">英语</el-option>
		<el-option value="vi">韩语</el-option>
		<el-option value="ko">越南语</el-option>
		<el-option value="zh">繁体中文</el-option>
	</el-select>
</a-menu-item> -->
			</a-menu>
			<el-skeleton :rows="5" animated />
		</a-layout-header>
		<a-layout>
			<a-layout-sider width="200" style="background: #fff">
				<a-menu v-model:selectedKeys="selectedKeys2" v-model:openKeys="openKeys" mode="inline"
					:style="{ height: '100%', borderRight: 0 }">
					<a-sub-menu key="sub1">
						<template #title>
							<span>
								<user-outlined />
								首页
							</span>
						</template>
						<a-menu-item key="1" @click="jump('1')">公告</a-menu-item>
						<a-menu-item key="2" @click="jump('2')">社区</a-menu-item>
					</a-sub-menu>
					<a-sub-menu key="sub2">
						<template #title>
							<span>
								<laptop-outlined />
								私约
							</span>
						</template>
						<a-menu-item key="3" @click="jump('3')">男女专区</a-menu-item>
					</a-sub-menu>
					<a-sub-menu key="sub3">
						<template #title>
							<span>
								<laptop-outlined />
								投票
							</span>
						</template>
						<a-menu-item key="4" @click="jump('4')">投票专区</a-menu-item>
					</a-sub-menu>
					<a-sub-menu key="sub4">
						<template #title>
							<span>
								<laptop-outlined />
								我的
							</span>
						</template>
						<a-menu-item key="5" @click="jump('5')">用户管理</a-menu-item>
						<a-menu-item key="6" @click="jump('6')">账单管理</a-menu-item>
					</a-sub-menu>
					<a-sub-menu key="sub5">
						<template #title>
							<span>
								<laptop-outlined />
								系统
							</span>
						</template>
						<!-- <a-menu-item key="7" @click="jump('7')">系统管理</a-menu-item> -->
						<a-menu-item key="8" @click="jump('8')">抗日小分队</a-menu-item>
						<a-menu-item key="9" @click="jump('9')">会员卡</a-menu-item>
					</a-sub-menu>
				</a-menu>
			</a-layout-sider>
			<a-layout style="padding: 0 24px 24px">
				<!-- <a-breadcrumb style="margin: 16px 0">
					<a-breadcrumb-item>Home</a-breadcrumb-item>
					<a-breadcrumb-item>List</a-breadcrumb-item>
					<a-breadcrumb-item>App</a-breadcrumb-item>
				</a-breadcrumb> -->
				<a-layout-content :style="{ background: '#fff', padding: '24px', margin: 0, minHeight: '280px' }">
					<datingVue ref="datingRef" v-if="routerId == 1"></datingVue>
					<squareVue ref="squareRef" v-if="routerId == 2"></squareVue>
					<PLVue ref="PLRef" v-if="routerId == 3"></PLVue>
					<voteVue ref="voteRef" v-if="routerId == 4"></voteVue>
					<userVue ref="userRef" v-if="routerId == 5"></userVue>
					<orderVue ref="orderRef" v-if="routerId == 6"></orderVue>
					<sysVue ref="sysRef" v-if="routerId == 7"></sysVue>
					<staffVue ref="staffRef" v-if="routerId == 8"></staffVue>
					<vipVue ref="vipRef" v-if="routerId == 9"></vipVue>
				</a-layout-content>
			</a-layout>
		</a-layout>
	</a-layout>
</template>
<script setup>
import {
	ref,
	onMounted,
	onUnmounted,
	createApp
} from 'vue';
import datingVue from '../components/dating.vue';
import squareVue from '../components/square.vue';
import PLVue from '../components/PL.vue';
import userVue from '../components/user.vue';
import orderVue from '../components/order.vue';
import voteVue from '../components/vote.vue';
import sysVue from '../components/system.vue';
import staffVue from '../components/staff.vue';
import vipVue from '../components/vip.vue';
import api from '../api';
import {
	useCounterStore
} from '../store/index';
const store = useCounterStore();
import {
	useRouter
} from 'vue-router';
let router = useRouter()
const selectedKeys1 = ref(['2']);
const selectedKeys2 = ref(['5']);
const openKeys = ref(['sub4']);
if (localStorage.getItem('loginFlag') != 'true') {
	router.push('/login')
}
let routerId = ref(5)
const jump = (id) => {
	routerId.value = id
}
const refesh = () => {
	let temp = routerId.value
	routerId.value = ''
	setTimeout(() => {
		routerId.value = temp
	}, 300);
}
const lang = ref([])
const langVal = ref()
const sysObj = ref({})
const app = createApp({

})
const datingRef = ref(null)
const squareRef = ref(null)
const PLRef = ref(null)
const voteRef = ref(null)
const userRef = ref(null)
const orderRef = ref(null)
const sysRef = ref(null)
const staffRef = ref(null)
const bulletin = ()=> {
	
}
const handleKeyDown = (event) => {
	if (event.key === 'Enter') {
		console.log(routerId.value)
		switch (Number(routerId.value)) {
			case 1:
				datingRef.value.getData()
				break
			case 2:
				squareRef.value.getData()
				break
			case 3:
				PLRef.value.getData()
				break
			case 4:
				voteRef.value.getData()
				break
			case 5:
				userRef.value.getData()
				break
			case 6:
				console.log(123)
				orderRef.value.getData()
				break
			case 7:
				sysRef.value.getData()
				break
			case 8:
				staffRef.value.getData()
				break
			case 8:
				vipRef.value.getData()
				break
		}
	}
	if (event.key === 'Escape') {
		console.log(routerId.value)
		switch (Number(routerId.value)) {
			case 1:
				datingRef.value.queryClear()
				break
			case 2:
				squareRef.value.queryClear()
				break
			case 3:
				PLRef.value.queryClear()
				break
			case 4:
				voteRef.value.queryClear()
				break
			case 5:
				userRef.value.queryClear()
				break
			case 6:
				orderRef.value.queryClear()
				break
			case 7:
				sysRef.value.queryClear()
				break
			case 8:
				console.log(123)
				staffRef.value.queryClear()
				break
			case 8:
				console.log(123)
				vipRef.value.queryClear()
				break
		}
	};
}
onMounted(() => {
	window.addEventListener('keydown', handleKeyDown);
});
onUnmounted(() => {
	window.removeEventListener('keydown', handleKeyDown);
});
const langChange = () => {
	api.setSys({
		switch: 1
	}).then(res => {
		if (res.code == 0) {
			console.log(res)
			if (res.code == 0) {
				store.sysData.sys = res.sysRows
				store.sysData.lang = res.langRows
			}
		} else {
			message.error('fail')
		}
	})
}
const getData = () => {
	api.getSys().then(res => {
		if (res.code == 0) {
			console.log(res)
			if (res.code == 0) {
				store.sysData.sys = res.sysRows
				store.sysData.lang = res.langRows
			}
		} else {
			message.error('fail')
		}
	})
}
getData()
const systemTime = ref()
const countdownInterval = setInterval(() => {
	const now = new Date().getTime();
	let targetDate = new Date('2025-06-15')
	const distance = targetDate - now;

	if (distance < 0) {
		clearInterval(countdownInterval);
		document.getElementById('countdownDisplay').innerHTML = '倒计时已结束！';
		return;
	}

	const days = Math.floor(distance / (1000 * 60 * 60 * 24));
	const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
	const seconds = Math.floor((distance % (1000 * 60)) / 1000);

	systemTime.value = `${days} 天 ${hours} 小时 ${minutes} 分钟 ${seconds} 秒`;
}, 1000);
</script>
<style scoped>
#components-layout-demo-top-side-2 .logo {
	float: left;
	width: 120px;
	height: 31px;
	margin: 16px 24px 16px 0;
	background: rgba(255, 255, 255, 0.3);
}

.ant-row-rtl #components-layout-demo-top-side-2 .logo {
	float: right;
	margin: 16px 0 16px 24px;
}

.site-layout-background {
	background: #fff;
}
</style>