<template>
	<div class="card-container">
		<a-tabs v-model:activeKey="activeKey" type="card">
			<a-tab-pane key="1" tab="列表">
				<div class="query">
					<el-input style="width: 200px;" v-model="queryObj.account" placeholder="账号"></el-input>
					<el-input style="width: 200px;" v-model="queryObj.voteNum" placeholder="票数"></el-input>
					<!-- <el-date-picker v-model="queryObj.date" type="datetime" placeholder="创建时间"
						value-format="YYYY-MM-DD HH:mm:ss" /> -->
					<el-button @click="getData">查询</el-button>
					<el-button @click="queryClear">清空</el-button>
				</div>
				<el-table :data="tableData" style="width: 100%" stripe>
					<el-table-column fixed prop="uid" label="ID" width="50" />
					<el-table-column fixed prop="account" label="账号" width="150" />
					<el-table-column prop="staffName" label="谁的客户" width="120" />
					<el-table-column prop="voteNum" label="票数" width="120" />
					<el-table-column prop="dataError" label="是否数据错误" width="120">
						<template #default="scope">
							<template v-if="scope.row.dataError == 0">
								<el-tag type="success">数据正常</el-tag>
							</template>
							<template v-if="scope.row.dataError == 1">
								<el-tag type="danger">数据错误</el-tag>
								</template>
							<template v-if="scope.row.dataError == 2">
								<el-tag type="info">账户冻结</el-tag>
								</template>
							<template v-if="scope.row.dataError == 3">
								<el-tag type="danger">修复中</el-tag>
							</template>
						</template>
					</el-table-column>
					<el-table-column prop="voteId" label="模特编号" width="120" />
					<el-table-column prop="date" label="创建时间" width="120" />
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
			<a-tab-pane key="2" tab="修改" v-if="user">
				<div class="group">
					<label for="">用户名</label>
					<el-input placeholder="用户名" v-model="user.account" disabled></el-input>
				</div>
				<el-divider />
				<div class="group">
					<label for="">投票模特ID</label>
					<el-input placeholder="投票模特ID" v-model="user.voteId"></el-input>
				</div>
				<el-divider />
				<div class="group">
					<label for="">投票数</label>
					<el-input placeholder="投票数" v-model="user.voteNum"></el-input>
				</div>
				<el-divider />
				<div class="group">
					<label for="">创建时间</label>
					<el-date-picker v-model="user.date" type="datetime" placeholder="创建时间"
						value-format="YYYY-MM-DD HH:mm:ss" />
				</div>
				<el-divider />
				<el-button style="width: 200px;height: 50px;" @click="submitEit">修改</el-button>
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
	voteId: '',
	voteNum: '',
	date: ''
})
const clear = () => {
	user.value = {
		account: '',
		voteId: '',
		voteNum: '',
		date: ''
	}
}
const edit = (index, row) => {
	user.value = row
	activeKey.value = '2'
}
const del = (index, row) => {
	console.log(row.id)
	api.delVote({
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
const submitEit = () => {
	for (let i = 0; i < Object.keys(user.value).length; i++) {
		console.log(user.value[Object.keys(user.value)[i]])
		if (user.value[Object.keys(user.value)[i]] == 'undefined' || user.value[Object.keys(user.value)[i]] ==
			undefined) {
			user.value[Object.keys(user.value)[i]] = ''
		}
	}
	api.setVote(user.value).then(res => {
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
	account: '',
	voteNum: '',
})
const pageChange = (currentPage, pageSize) => {
	pageData.value.pageIndex = currentPage - 1
	getData()
}
const getData = () => {
	api.getVote({
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
const queryClear = () => {
	queryObj.value = {}
}
getData()
const getVipCode = () => {
	let code = Math.floor(Math.random() * 900000) + 100000
	user.value.inviteCode = code
}
const submit = () => {
	console.log(user.value)
	for (let i = 0; i < Object.keys(user.value).length; i++) {
		if (user.value[Object.keys(user.value)[i]] == '') {
			message.error('有必填项未填')
		}
	}
	api.addConvension(user.value).then(res => {
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
.el-pagination {
	display: flex;
	justify-content: center;
	margin: 20px;
}
</style>