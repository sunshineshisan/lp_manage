<template>
	<div class="card-container">
		<a-tabs v-model:activeKey="activeKey" type="card">
			<a-tab-pane key="1" tab="修改/删除">
				<div class="query">
					<el-select style="width: 200px;" v-model="queryObj.gender" placeholder="性别">
						<el-option value="0">女</el-option>
						<el-option value="1">男</el-option>
					</el-select>
					<!-- <el-date-picker v-model="queryObj.date" type="datetime" placeholder="创建时间"
						value-format="YYYY-MM-DD HH:mm:ss" /> -->
					<el-button @click="getData">查询</el-button>
					<el-button @click="queryClear">清空</el-button>
				</div>
				<el-table :data="tableData" style="width: 100%">
					<el-table-column fixed prop="account" label="账号" width="150" />
					<el-table-column prop="name" label="名字" width="120" />
					<el-table-column prop="avatar" label="头像" width="120" align="center">
						<template #default="scope">
							<el-avatar :size="100"
								:src="scope.row.avatar ? $imgHead + scope.row.avatar : 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'" />
						</template>
					</el-table-column>
					<el-table-column prop="gender" label="性别" width="120" />
					<el-table-column prop="height" label="身高" width="120" />
					<el-table-column prop="weight" label="体重" width="120" />
					<el-table-column prop="xw" label="胸围" width="120" />
					<el-table-column prop="job" label="职业" width="120" />
					<el-table-column prop="city" label="城市" width="120" />
					<!-- <el-table-column prop="jj" label="简介" width="220" /> -->
					<el-table-column prop="video" label="视频" width="120">
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
			<a-tab-pane key="2" tab="添加" v-if="user">
				<div class="group">
					<label for="">内容</label>
					<el-input placeholder="用户名" v-model="user.account"></el-input>
				</div>
				<el-divider />
				<div class="group">
					<label for="">头像</label>
					<el-upload class="avatar-uploader" action="http://soulmatemeet.vip:8080/upload/PL"
						:show-file-list="false" :before-upload="beforeUpload" :on-success="handleSuccess"
						:on-error="handleError">
						<img v-if="imageUrl" style="width: 100px; height: 100px;" :src="imageUrl" class="avatar"
							alt="Avatar" />
						<el-avatar v-else :size="100"
							:src="user.avatar ? $imgHead + user.avatar : 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'" />
					</el-upload>
				</div>
				<el-divider />
				<div class="group">
					<label for="">名字</label>
					<el-input placeholder="名字" v-model="user.name"></el-input>
				</div>
				<el-divider />
				<div class="group">
					<label for="">性别</label>
					<el-select name="" v-model="user.gender" placeholder="性别">
						<el-option value="女">女</el-option>
						<el-option value="男">男</el-option>
					</el-select>
				</div>
				<el-divider />
				<div class="group">
					<label for="">身高</label>
					<el-input placeholder="身高" v-model="user.height"></el-input>
				</div>
				<el-divider />
				<div class="group">
					<label for="">体重</label>
					<el-input placeholder="体重" v-model="user.weight"></el-input>
				</div>
				<el-divider />
				<div class="group">
					<label for="">胸围</label>
					<el-input v-if="user.gender == 0" placeholder="胸围" v-model="user.xw"></el-input>
				</div>
				<el-divider />
				<div class="group">
					<label for="">工作</label>
					<el-input placeholder="工作" v-model="user.job"></el-input>
				</div>
				<el-divider />
				<div class="group">
					<label for="">城市</label>
					<el-input placeholder="城市" v-model="user.city"></el-input>
				</div>
				<el-divider />
				<div class="group">
					<label for="">简介</label>
					<el-mention v-model="user.jj" type="textarea" style="width: 320px" placeholder="简介" />
				</div>
				<el-divider />
				<div class="group">
					<label for="">详情内容</label>
					<el-upload class="avatar-uploader" action="http://soulmatemeet.vip:8080/upload/PL"
						:show-file-list="false" :before-upload="beforeUpload1" :on-success="handleSuccess1"
						:on-error="handleError1">
						<img v-if="imageUrl1" style="width: 100px; height: 100px;" :src="imageUrl1" class="avatar"
							alt="此字体亮时请稍等" />
						<el-avatar v-else :size="100"
							:src="user.video ? $imgHead + user.video : 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'" />
					</el-upload>
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
import {
	ElMessage
} from 'element-plus'
import {
	Plus
} from '@element-plus/icons-vue'
const user = ref({
	account: '',
	height: '',
	weight: '',
	xw: '',
	job: '',
	city: '',
	avatar: '',
	jj: '',
	video: '',
	gender: ''
})
const del = (index, row) => {
	console.log(row)
	api.delConvension({
		id: row.id
	}).then(res => {
		if (res.code == 0) {
			getData()
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
		height: '',
		weight: '',
		xw: '',
		job: '',
		city: '',
		avatar: '',
		jj: '',
		video: '',
		gender: ''
	}
}
const edit = (index, row) => {
	editBtn.value = true
	user.value = row
	activeKey.value = '2'
}
const submitEit = () => {
	editBtn.value = false
	api.updateConvension(user.value).then(res => {
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
const pageData = ref({
	pageCount: 5,
	pageIndex: 0,
	pageSize: 5
})
const queryObj = ref({
	gender: ''
})
const pageChange = (currentPage, pageSize) => {
	pageData.value.pageIndex = currentPage - 1
	getData()
}
const getData = () => {
	api.getConvension({
		gender: queryObj.value.gender,
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
const tableData = ref([])
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