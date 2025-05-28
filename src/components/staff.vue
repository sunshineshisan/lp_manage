<template>
	<div class="card-container">
		<a-tabs v-model:activeKey="activeKey" type="card" @tab-click="tabClick">
			<a-tab-pane key="1" tab="列表">
				<div class="query">
					<el-input style="width: 200px;" placeholder="名字" v-model="queryObj.name"></el-input>
					<el-input style="width: 200px;" placeholder="邀请码" v-model="queryObj.inviteCode"></el-input>
					<!-- <el-date-picker v-model="queryObj.date" type="datetime" placeholder="创建时间"
						value-format="YYYY-MM-DD HH:mm:ss" /> -->
					<el-button @click="getData">查询</el-button>
					<el-button @click="queryClear">清空</el-button>
				</div>
				<el-table :data="tableData" style="width: 100%">
					<el-table-column fixed prop="id" label="ID" width="150" />
					<el-table-column prop="name" label="名字" width="120" />
					<el-table-column prop="inviteCode" label="邀请码" width="120" />
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
					<label for="">名字</label>
					<el-input placeholder="名字" v-model="user.name"></el-input>
				</div>
				<el-divider />
				<div class="group">
					<label for="">邀请码</label>
					<el-input placeholder="邀请码" v-model="user.inviteCode"></el-input>
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
	name: '',
	inviteCode: ''
})
const del = (index, row) => {
	console.log(row)
	api.delStaff({
		id: row.id
	}).then(res => {
		if (res.code == 0) {
			message.success('删除成功')
			getData()
		} else {
			message.error(res.msg)
		}
	})
}
const editBtn = ref(false)
const clear = () => {
	editBtn.value = false
	user.value = {
		name: '',
		inviteCode: ''
	}
}
const edit = (index, row) => {
	editBtn.value = true
	user.value = row
	activeKey.value = '2'
}
const submitEit = () => {
	editBtn.value = false
	api.setStaff(user.value).then(res => {
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
	name: '',
	inviteCode: ''
})
const queryClear = () => {
	queryObj.value = {}
}
const pageChange = (currentPage, pageSize) => {
	pageData.value.pageIndex = currentPage - 1
	getData()
}
const getData = () => {
	api.getStaff({
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
	api.addStaff(user.value).then(res => {
		console.log(res)
		if (res.code == 0) {
			message.success('操作成功')
			user.value = {
				name: '',
				inviteCode: ''
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
<style scoped></style>