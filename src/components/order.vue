<template>
	<div class="card-container">
		<a-tabs v-model:activeKey="activeKey" type="card">
			<a-tab-pane key="1" tab="列表">
				<div class="query">
					<el-input style="width: 100px;" v-model="queryObj.id" placeholder="ID"></el-input>
					<el-input style="width: 200px;" v-model="queryObj.account" placeholder="账号/姓名"></el-input>
					<el-select style="width: 200px;" v-model="queryObj.type" placeholder="账单类型">
						<el-option value="0">充值</el-option>
						<el-option value="1">提现</el-option>
					</el-select>
					<el-select style="width: 200px;" v-model="queryObj.status" placeholder="账户状态">
						<el-option value="0">审核中</el-option>
						<el-option value="1">通过</el-option>
						<el-option value="2">拒绝</el-option>
					</el-select>
					<el-button @click="getData">查询</el-button>
					<el-button @click="queryClear">清空</el-button>
				</div>
				<el-table :data="tableData" style="width: 100%">
					<el-table-column fixed prop="uid" label="ID" width="80" />
					<el-table-column fixed prop="account" label="账号" width="150" />
					<!-- <el-table-column prop="name" label="名字" width="120" /> -->
					<!-- 	<el-table-column prop="avatar" label="头像" width="120" align="center">
						<template #default="scope">
							<el-avatar :size="100"
								:src="scope.row.avatar?$imgHead+scope.row.avatar:'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'" />
						</template>
</el-table-column> -->
					<el-table-column prop="makeMoney" label="金额" width="120" />
					<el-table-column prop="type" label="账单类型" width="120">
						<template #default="scope">
							<el-tag class="tip" type="success" v-if="scope.row.type == 0">充值</el-tag>
						<el-tag class="tip" type="primary" v-if="scope.row.type == 1">提现</el-tag>
							<!-- {{ scope.row.type == 0 ? '充值' : '提现' }} -->
						</template>
					</el-table-column>
					<el-table-column prop="staffName" label="谁的客户" width="120" />
					<el-table-column prop="status" label="账单状态" width="120">
						<template #default="scope">
							<div :style="{ color: scope.row.status == 0 ? 'red' : scope.row.status == 1 ? 'green' : 'black' }">
								{{ scope.row.status == 0 ? '待审核' : scope.row.status == 1 ? '已通过' : '已拒绝' }}
							</div>
						</template>
					</el-table-column>
					<el-table-column prop="date" label="创建时间" width="120">
					</el-table-column>
					<el-table-column fixed="right" label="Operations" min-width="120">
						<template #default="scope">
							<el-button link type="primary" size="small" @click="edit(scope.$index, scope.row)">
								编辑
							</el-button>
							<template v-if="scope.row.status == 0">
								<el-popconfirm title="通过之后订单将生成,确定要通过吗?" @confirm="audit(scope.$index, scope.row, 1)">
									<template #reference>
										<el-button link type="primary" size="small">通过</el-button>
									</template>
								</el-popconfirm>
								<el-popconfirm title="拒绝之后此条账单会消失,确定拒绝吗" @confirm="audit(scope.$index, scope.row, 2)">
									<template #reference>
										<el-button link type="primary" size="small">拒绝</el-button>
									</template>
								</el-popconfirm>
							</template>
							<template v-if="scope.row.status == 1">
								<el-popconfirm title="撤销之后这笔订单会无效,确定撤销吗" @confirm="audit(scope.$index, scope.row, 0)">
									<template #reference>
										<el-button link type="primary" size="small">
											撤销
										</el-button>
									</template>
								</el-popconfirm>
							</template>
							<el-popconfirm title="删除之后这笔订单无法恢复,确定删除吗" @confirm="del(scope.$index, scope.row)">
								<template #reference>
									<el-button link type="primary" size="small">
										删除
									</el-button>
								</template>
							</el-popconfirm>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination background layout="prev, pager, next"
					:page-count="Math.ceil(pageData.pageCount / pageData.pageSize)" @change="pageChange" />
			</a-tab-pane>
			<a-tab-pane key="2" tab="修改" v-if="user">
				<div class="group">
					<label for="">用户名</label>
					<el-input placeholder="用户名" v-model="user.account"></el-input>
				</div>
				<el-divider />
				<div class="group">
					<label for="">金额</label>
					<el-input placeholder="金额" v-model="user.makeMoney"></el-input>
				</div>
				<el-divider />
				<div class="group">
					<label for="">账单类型</label>
					<el-select name="" v-model="user.type" placeholder="账单类型">
						<el-option value="0">充值</el-option>
						<el-option value="1">提现</el-option>
					</el-select>
					<div class="tip">
						<el-tag class="tip" type="success" v-if="user.type == 0">充值</el-tag>
						<el-tag class="tip" type="primary" v-if="user.type == 1">提现</el-tag>
					</div>
				</div>
				<el-divider />
				<div class="group">
					<label for="">账单状态</label>
					<el-select name="" v-model="user.status" placeholder="账单状态">
						<el-option value="0">待审核</el-option>
						<el-option value="1">已通过</el-option>
						<el-option value="2">已拒绝</el-option>
					</el-select>
					<div class="tip">
						<el-tag class="tip" type="warning" v-if="user.status == 0">待审核</el-tag>
						<el-tag class="tip" type="success" v-if="user.status == 1">已通过</el-tag>
						<el-tag class="tip" type="danger" v-if="user.status == 2">已拒绝</el-tag>
					</div>
				</div>
				<el-divider />
				<div class="group">
					<label for="">创建时间</label>
					<el-date-picker v-model="user.date" type="datetime" placeholder="创建时间"
						value-format="YYYY-MM-DD HH:mm:ss" />
				</div>
				<el-divider />
				<!-- <el-select name="" v-model="user.status" placeholder="账单状态">
					<el-option value="0">待审核</el-option>
					<el-option value="1">通过</el-option>
				</el-select><el-divider /> -->
				<el-button style="width: 200px;height: 50px;" @click="submit">添加</el-button>
				<el-button v-if="editBtn" style="width: 200px;height: 50px;" @click="submitEit">修改</el-button>
				<!-- <el-button style="width: 200px;height: 50px;" @click="clear">清空</el-button> -->
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
import {
	ElMessage
} from 'element-plus'
import {
	Plus
} from '@element-plus/icons-vue'
const user = ref({
	account: '',
	makeMoney: '',
	type: '',
	date: '',
	status: ''
})
const del = (index, row) => {
	console.log(row)
	api.delOrder({
		id: row.id
	}).then(res => {
		console.log(res)
		if (res.code == 0) {
			message.success('删除成功')
			getData()
		} else {
			message.error(res.error)
		}
	})
}
//审核 0待审核 1通过 2拒绝
const audit = (index, row, status) => {
	console.log(row)
	api.validOrder({
		id: row.id,
		status: status
	}).then(res => {
		if (res.code == 0) {
			if (status == 2) {
				message.success('已拒绝')
				getData()
				return
			}
			let item = row
			if (status == 1) {
				message.success('已通过')
			} else if (status == 0) {
				item.type = item.type == 0 ? 1 : 0
				message.success('已撤回')
			}
			getData()
			api.updateMoney({
				makeMoney: row.makeMoney,
				account: row.account,
				type: item.type,
				voteFlag: item.type == 0 ? 1 : 0
			}).then(resChild => {
				console.log(resChild)
			})
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
		makeMoney: '',
		type: '',
		date: '',
		status: ''
	}
}
const edit = (index, row) => {
	editBtn.value = true
	user.value = row
	activeKey.value = '2'
}
const submitEit = () => {
	editBtn.value = false
	for (let i = 0; i < Object.keys(user.value).length; i++) {
		console.log(user.value[Object.keys(user.value)[i]])
		if (user.value[Object.keys(user.value)[i]] == 'undefined') {
			user.value[Object.keys(user.value)[i]] = ''
		}
	}
	api.setOrder(user.value).then(res => {
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
	clear()
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
	id:'',
	account: '',
	type: '',
	status: '',
	date: ''
})
const queryClear = () => {
	queryObj.value = {}
}
const pageChange = (currentPage, pageSize) => {
	pageData.value.pageIndex = currentPage - 1
	getData()
}
const getData = () => {
	api.getOrder({
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
	console.log(user.value)
	//for (let i = 0; i < Object.keys(user.value).length; i++) {
		//if (user.value[Object.keys(user.value)[i]] == '') {
		//	message.error('有必填项未填')
		//}
	//}
	api.addOrder(user.value).then(res => {
		console.log(res)
		if (res.code == 0) {
			message.success('操作成功')
			clear()
		} else {
			message.error(res.msg)
		}
	})
}
defineExpose({
	getData,
	queryClear
});
// 存储头像图片的 URL
const imageUrl = ref('');
// 存储提示消息
const messageEL = ref('');
// 存储消息类型
const messageType = ref('');
// 上传前的处理函数
const beforeUpload = async (file) => {
	const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
	if (!isJpgOrPng) {
		messageEL.value = lang.mine.model.message[5]; //'只能上传 JPG/PNG 格式的图片！'
		messageType.value = 'error';
		return false;
	}
	const isLt2M = file.size / 1024 / 1024 < 2;
	if (!isLt2M) {
		messageEL.value = lang.mine.model.message[6]; //'图片大小不能超过 2MB！'
		messageType.value = 'error';
		return false;
	}
	const reader = new FileReader();
	reader.onload = (e) => {
		imageUrl.value = e.target.result;
	};
	reader.readAsDataURL(file);
	return true;
};

// 上传成功的处理函数
const handleSuccess = (response) => {
	//记录图片名
	console.log(response.file)
	if (response.code == 0) {
		user.value.avatar = response.file
	}
	console.log(response)
};

// 上传失败的处理函数
const handleError = () => {
	messageEL.value = lang.mine.model.message[7]; //'头像上传失败，请稍后重试！'
	messageType.value = 'error';
};
// 存储头像图片的 URL
const imageUrl1 = ref('');
// 存储提示消息
const messageEL1 = ref('');
// 存储消息类型
const messageType1 = ref('');
// 上传前的处理函数
const beforeUpload1 = async (file) => {
	const reader = new FileReader();
	reader.onload = (e) => {
		imageUrl1.value = e.target.result;
	};
	reader.readAsDataURL(file);
	return true;
};

// 上传成功的处理函数
const handleSuccess1 = (response) => {
	//记录图片名
	console.log(response.file)
	if (response.code == 0) {
		message.success(response.msg)
		user.value.video = response.file
	}
	console.log(response)
};

// 上传失败的处理函数
const handleError1 = () => {
	messageEL1.value = '上传失败，请稍后重试！'; //
	messageType1.value = 'error';
};
</script>
<style scoped>

</style>