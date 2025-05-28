<template>
	<div class="card-container">
		<a-tabs v-model:activeKey="activeKey" type="card">
			<a-tab-pane key="1" tab="列表">
				<div class="query">
					<el-select style="width: 200px;" v-model="queryObj.type" placeholder="等级">
						<el-option value="0">一般用户</el-option>
						<el-option value="1">普通会员</el-option>
						<el-option value="2">高级会员</el-option>
						<el-option value="3">至尊会员</el-option>
					</el-select>
					<el-button @click="getData">查询</el-button>
					<el-button @click="queryClear">清空</el-button>
				</div>
				<el-table :data="tableData" style="width: 100%" stripe>
					<el-table-column fixed prop="id" label="ID" width="50" />
					<el-table-column fixed prop="name" label="vip名称" width="200" />
					<el-table-column fixed prop="name" label="ID" width="200" />
					<el-table-column prop="type" label="等级" width="120">
						<template #default="scope">
							<template v-if="scope.row.type == 0">
								<el-tag type="info">一般用户</el-tag>
							</template>
							<template v-if="scope.row.type == 1">
								<el-tag type="primary">普通会员</el-tag>
							</template>
							<template v-if="scope.row.type == 2">
								<el-tag type="warning">高级会员</el-tag>
							</template>
							<template v-if="scope.row.type == 3">
								<el-tag type="danger">至尊会员</el-tag>
							</template>
						</template>
					</el-table-column>
					<el-table-column prop="img" label="会员卡" width="200">
						<template #default="scope">
							<img style="width: 150px;height: 80px;" :src="$imgHead + scope.row.img" alt="">
						</template>
					</el-table-column>
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
					<label for="">vip名称</label>
					<el-input placeholder="vip名称" v-model="user.name"></el-input>
				</div>
				<el-divider />
				<div class="group">
					<label for="">vip对应ID</label>
					<el-input placeholder="vip对应ID" v-model="user.type"></el-input>
				</div>
				<el-divider />
				<div class="group">
					<label class="label">头像</label>
					<el-upload class="avatar-uploader" action="http://soulmatemeet.vip:8080/upload/system"
						:show-file-list="false" :before-upload="beforeUpload" :on-success="handleSuccess"
						:on-error="handleError">
						<img v-if="imageUrl" style="width: 100px; height: 100px;" :src="imageUrl" class="avatar"
							alt="Avatar" />
						<el-image v-else style="width: 100px; height: 100px"
							:src="user.img ? $imgHead + user.img : 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'"
							:fit="fit" />
					</el-upload>
				</div>
				<el-divider />
				<el-button style="width: 200px;height: 50px;" @click="submit">提交</el-button>
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
	name: '',
	type: '',
	img: '',
})
const editBtn = ref(false)
const clear = () => {
	imageUrl.value = ''
	editBtn.value = false
	user.value = {
		name: '',
		type: '',
		img: '',
	}
}
const edit = (index, row) => {
	editBtn.value = true
	user.value = row
	activeKey.value = '2'
}
const del = (index, row) => {
	console.log(row.id)
	api.delVip({
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
	editBtn.value = false
	for (let i = 0; i < Object.keys(user.value).length; i++) {
		console.log(user.value[Object.keys(user.value)[i]])
		if (user.value[Object.keys(user.value)[i]] == 'undefined' || user.value[Object.keys(user.value)[i]] ==
			undefined) {
			user.value[Object.keys(user.value)[i]] = ''
		}
	}
	api.setVip(user.value).then(res => {
		if (res.code == 0) {
			message.success('修改成功')
			activeKey.value = '1'
			getData()
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
	type: '',
})
const pageChange = (currentPage, pageSize) => {
	pageData.value.pageIndex = currentPage - 1
	getData()
}
const getData = () => {
	api.getVip({
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
	api.addVip(user.value).then(res => {
		console.log(res)
		if (res.code == 0) {
			message.success('操作成功')
			activeKey.value = '1'
			getData()
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
		user.value.img = response.file
		console.log(user.value, 111)
	}
	console.log(response)
};

// 上传失败的处理函数
const handleError = () => {
	messageEL.value = lang.mine.model.message[7]; //'头像上传失败，请稍后重试！'
	messageType.value = 'error';
};
</script>
<style scoped>
.el-pagination {
	display: flex;
	justify-content: center;
	margin: 20px;
}
</style>