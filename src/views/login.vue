<template>
	<div class="main">
		<h3>搞一个亿大项目！</h3>
		<el-divider />
		<el-input v-model="user.account"></el-input>
		<el-divider />
		<el-input type="password" v-model="user.password"></el-input>
		<el-divider />
		<el-button @click="login">登录</el-button>
	</div>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	import {
		useRouter,
	} from 'vue-router'
	import api from '../api'
	import {
		message
	} from 'ant-design-vue';
	const router = useRouter()
	const user = ref({
		account:'',
		password:''
	})
	const login = ()=> {
		if(user.value.account==''||user.value.password=='') {
			message.error('用户名密码不能为空')
			return
		}
		api.login({
			account:user.value.account,
			password:user.value.password
		}).then(res=>{
			console.log(res)
			if(res.code == 0) {
				if(res.rows.length<1) {
					message.error('用户或密码不正确')
				} else {
					message.success('登录成功！')
					localStorage.setItem('loginFlag','true')
					router.push('/main')
				}
			} else {
				message.error(res.msg)
			}
		})
	}
	
	
	const onFinish = (values) => {
		console.log('Success:', values);
	};

	const onFinishFailed = (errorInfo) => {
		console.log('Failed:', errorInfo);
	};
</script>

<style scoped>
	@import url(../style.css);
	.main {
		width: 50vw;
		height: 100vh;
		margin: auto;
		display: flex;
		flex-direction: column;
		justify-content: center;
		text-align: center;
	}
</style>