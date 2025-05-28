<template>
	<div class="card-container">
		<a-tabs v-model:activeKey="activeKey" type="card" @tab-click="tabClick">
			<a-tab-pane key="1" tab="列表">
				<div class="query">
					<el-select style="width: 200px;" v-model="queryObj.country" placeholder="国家">
						<el-option value="jp">日本</el-option>
						<el-option value="en">英国</el-option>
						<el-option value="vi">越南</el-option>
						<el-option value="ko">韩国</el-option>
						<el-option value="zh">繁体中文</el-option>
					</el-select>
					<el-select style="width: 200px;" v-model="queryObj.type" placeholder="充值类型">
						<el-option value="0">充值</el-option>
						<el-option value="1">提现</el-option>
					</el-select>
					<el-select style="width: 200px;" v-model="queryObj.vipGrade" placeholder="会员等级">
						<el-option value="0">普通客户</el-option>
						<el-option value="1">普通会员</el-option>
						<el-option value="2">高级会员</el-option>
						<el-option value="3">至尊会员</el-option>
					</el-select>
					<!-- <el-date-picker v-model="queryObj.date" type="datetime" placeholder="创建时间"
						value-format="YYYY-MM-DD HH:mm:ss" /> -->
					<el-button @click="getData">查询</el-button>
					<el-button @click="queryClear">清空</el-button>
				</div>
				<el-table :data="tableData" style="width: 100%">
					<el-table-column fixed prop="account" label="账号" width="150" />
					<el-table-column prop="name" label="名字" width="120" />
					<el-table-column prop="vipGrade" label="会员等级" width="60">
						<template #default="scope">
							<span v-if="scope.row.vipGrade == 0">普通账号</span>
							<span v-if="scope.row.vipGrade == 1">普通会员</span>
							<span v-if="scope.row.vipGrade == 2">高级会员</span>
							<span v-if="scope.row.vipGrade == 3">至尊会员</span>
						</template>
					</el-table-column>
					<el-table-column prop="money" label="金额" width="120" />
					<el-table-column prop="type" label="充值类型" width="100" />
					<el-table-column prop="country" label="国家" width="120" />
					<el-table-column fixed="right" label="Operations" min-width="120">
						<template #default="scope">
							<el-button link type="primary" size="small" @click="edit(scope.$index, scope.row)">
								编辑
							</el-button>
							<el-popconfirm title="确定要删除吗?" @confirm="del(scope.$index, scope.row)">
								<template #reference>
									<el-button link type="primary" size="small">删除</el-button>
								</template>
							</el-popconfirm>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination background layout="prev, pager, next"
					:page-count="Math.ceil(pageData.pageCount / pageData.pageSize)" @change="pageChange" />
			</a-tab-pane>
			<a-tab-pane key="2" tab="添加" v-if="user">
				<div class="group">
					<label for="">用户名</label>
					<el-input placeholder="用户名" v-model="user.account"></el-input>
				</div>
				<el-divider />
				<div class="group">
					<label for="">会员等级</label>
					<el-select name="" v-model="user.vipGrade" placeholder="会员等级">
						<el-option value="0">普通会员</el-option>
						<el-option value="1">高级会员</el-option>
						<el-option value="2">至尊会员</el-option>
					</el-select>
					<div class="tip">
						<el-tag class="tip" type="primary" v-if="user.vipGrade == 0">普通会员</el-tag>
						<el-tag class="tip" type="primary" v-if="user.vipGrade == 1">高级会员</el-tag>
						<el-tag class="tip" type="primary" v-if="user.vipGrade == 2">至尊会员</el-tag>
					</div>
				</div>
				<el-divider />
				<div class="group">
					<label for="">姓名</label>
					<el-input placeholder="姓名" v-model="user.name"></el-input>
				</div>
				<el-divider />
				<div class="group">
					<label for="">金额</label>
					<el-input placeholder="金额" v-model="user.money"></el-input>
				</div>
				<el-divider />
				<div class="group">
					<label for="">充值/提现</label>
					<el-select name="" v-model="user.type" placeholder="充值/提现">
						<el-option value="0">充值</el-option>
						<el-option value="1">提现</el-option>
					</el-select>
					<div class="tip">
						<el-tag class="tip" type="primary" v-if="user.type == 0">充值</el-tag>
						<el-tag class="tip" type="primary" v-if="user.type == 1">提现</el-tag>
					</div>
				</div>
				<el-divider />
				<div class="group">
					<label for="">国家</label>
					<el-select name="" v-model="user.country" placeholder="国家">
						<el-option value="jp">日本</el-option>
						<el-option value="en">英国</el-option>
						<el-option value="vi">越南</el-option>
						<el-option value="ko">韩国</el-option>
						<el-option value="zh">繁体中文</el-option>
					</el-select>
					<div class="tip">
						<el-tag class="tip" type="primary" v-if="user.country == 'jp'">日本</el-tag>
						<el-tag class="tip" type="primary" v-if="user.country == 'en'">英国</el-tag>
						<el-tag class="tip" type="primary" v-if="user.country == 'vi'">越南</el-tag>
						<el-tag class="tip" type="primary" v-if="user.country == 'ko'">韩国</el-tag>
						<el-tag class="tip" type="primary" v-if="user.country == 'zh'">繁体中文</el-tag>
					</div>
				</div>
				<el-divider />
				<el-button style="width: 200px;height: 50px;" @click="submit">提交</el-button>
				<el-button v-if="editBtn" style="width: 200px;height: 50px;" @click="submitEit">修改</el-button>
				<el-button style="width: 200px;height: 50px;" @click="clear">清空</el-button>
			</a-tab-pane>
			<!-- <a-tab-pane key="3" tab="删除">
        <p>Content of Tab Pane 3</p>
        <p>Content of Tab Pane 3</p>
        <p>Content of Tab Pane 3</p>
      </a-tab-pane> -->
		</a-tabs>
	</div>
</template>
<script setup>
import {
	ref
} from 'vue';
const activeKey = ref('1');
import api from '../api';
import {
	message
} from 'ant-design-vue';
const user = ref({
	account: '',
	vipGrade: '',
	name: '',
	money: '',
	type: '',
	country: ''
})
const del = (index, row) => {
	console.log(row)
	api.delDating({
		id: row.id
	}).then(res => {
		if (res.code == 0) {
			message.success('删除成功')
		} else {
			message.error(res.msg)
		}
	})
}
const editBtn = ref(false)
const clear = () => {
	editBtn.value = false
	user.value = {
		account: '',
		avatar: '',
		title: '',
		content: '',
		name: '',
		vipGrade: '',
		likes: '',
		comment: '',
		share: '',
		source: ''
	}
}
const edit = (index, row) => {
	editBtn.value = true
	user.value = row
	activeKey.value = '2'
}
const submitEit = () => {
	editBtn.value = false
	api.updateDating(user.value).then(res => {
		if (res.code == 0) {
			message.success('修改成功')
			activeKey.value = '1'
			clear()
		} else {
			message.error(res.msg)
		}
	})
}
const tabClick = (e) => {
	console.log(e)
	if (e == 1) {
		getData()
	}
}
const tableData = ref([])
const pageData = ref({
	pageCount: 5,
	pageIndex: 0,
	pageSize: 5
})
const queryObj = ref({
	country: '',
	type: '',
	vipGrade: '',
})
const queryClear = () => {
	queryObj.value = {}
}
const pageChange = (currentPage, pageSize) => {
	pageData.value.pageIndex = currentPage - 1
	getData()
}
const getData = () => {
	api.getDating({
		...queryObj.value,
		pageIndex: pageData.value.pageIndex,
		pageSize: pageData.value.pageSize
	}).then(res => {
		if (res.code == 0) {
			tableData.value = res.rows
			pageData.value.pageCount = res.count
			if (res.rows >= pageData.value.pageSize) {
				pageData.value.pageIndex++
			}
		} else {
			message.error(res.msg)
		}
	})
}
getData()
const submit = () => {
	api.addDating(user.value).then(res => {
		console.log(res)
		if (res.code == 0) {
			message.success('操作成功')
			user.value = {
				account: '',
				vipGrade: '',
				name: '',
				money: '',
				type: '',
				country: ''
			}
		} else {
			message.error(res.msg)
		}
	})
}
defineExpose({
	getData,
	queryClear
});
</script>
<style scoped>

</style>