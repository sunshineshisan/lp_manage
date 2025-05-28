<script setup>
import {
	ref,
	provide,
	inject,
	defineExpose
} from 'vue';
import {
	useRoute,
	RouterLink,
	RouterView,
	useRouter
} from 'vue-router';
import {
	useCounterStore
} from './store/index';
const store = useCounterStore();
const route = useRoute();
const router = useRouter();
router.push('/main')
</script>

<template>
	<router-view></router-view>
</template>

<style>
.query {
	display: flex;
}
.label::after {
	content: ":";
	margin-left: 2px;
}

.cell button {
	padding: 8px !important;
	box-sizing: border-box;
}
.el-pagination {
	display: flex;
	justify-content: center;
	margin: 20px;
}
.group {
	display: flex;
}
.group .el-input {
	height: 40px;
}

.group label {
	width: 120px;
	color: #666;
	padding-right: 20px;
	display: flex;
	justify-content: flex-end;
	align-items: center;
}

.group .el-select,
.group .el-input,
.group .el-mention {
	width: 300px;
}

.group .tip {
	padding: 0 10px;
	display: flex;
	align-items: center;
}

/* .logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
} */
</style>
