<template>
	<div class="card-container">
		<a-tabs v-model:activeKey="activeKey" type="card" @tab-click="tabClick">
			<a-tab-pane key="1" tab="修改/删除">
				<div class="query">
					<el-select style="width: 200px;" v-model="queryObj.country" placeholder="国家">
						<el-option value="jp">日本</el-option>
						<el-option value="ko">韩国</el-option>
						<el-option value="en">英国</el-option>
						<el-option value="vi">越南</el-option>
						<el-option value="zh">台湾</el-option>
					</el-select>
					<el-select style="width: 200px;" v-model="queryObj.vipGrade" placeholder="会员等级">
						<el-option value="0">普通会员</el-option>
						<el-option value="1">高级会员</el-option>
						<el-option value="2">至尊会员</el-option>
					</el-select>
					<!-- <el-date-picker v-model="queryObj.date" type="datetime" placeholder="创建时间"
						value-format="YYYY-MM-DD HH:mm:ss" /> -->
					<el-button @click="getData">查询</el-button>
					<el-button @click="queryClear">清空</el-button>
				</div>
				<el-table :data="tableData" style="width: 100%">
					<el-table-column fixed prop="account" label="账号" width="150" align="center" />
					<el-table-column prop="name" label="名字" width="120" align="center" />
					<el-table-column prop="country" label="国家" width="120" align="center" />
					<el-table-column prop="title" label="标题" width="120" align="center" />
					<el-table-column prop="content" label="内容" width="300" align="center">
						<template #default="scope">
							<div class="squareContent">
								{{ scope.row.content }}
							</div>
						</template>
					</el-table-column>
					<el-table-column prop="avatar" label="头像" width="120" align="center">
						<template #default="scope">
							<el-avatar :size="100"
								:src="scope.row.avatar ? 'http://soulmatemeet.vip:8080/' + scope.row.avatar : 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'" />
						</template>
					</el-table-column>
					<el-table-column prop="vipGrade" label="会员等级" width="120" align="center" />
					<el-table-column prop="likes" label="点赞数" width="120" align="center" />
					<el-table-column prop="comment" label="评论数" width="120" align="center" />
					<el-table-column prop="share" label="分享数" width="120" align="center" />
					<el-table-column prop="source" label="详情" width="120" align="center" />
					<el-table-column prop="date" label="创建时间" width="120" align="center" />
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
				<!-- <el-input placeholder="用户名" v-model="user.account"></el-input><el-divider /> -->
				<!-- <el-input placeholder="头像" v-model="user.avatar"></el-input><el-divider /> -->
				<div class="group">
					<label for="">头像：</label>
					<el-upload class="avatar-uploader" action="http://soulmatemeet.vip:8080/upload/square"
						:show-file-list="false" :before-upload="beforeUpload" :on-success="handleSuccess"
						:on-error="handleError">
						<img v-if="imageUrl" style="width: 100px; height: 100px;" :src="imageUrl" class="avatar"
							alt="Avatar" />
						<el-avatar v-else :size="100"
							:src="user.avatar ? 'http://soulmatemeet.vip:8080/' + user.avatar : 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'" />
					</el-upload>
				</div>
				<el-divider />
				<div class="group">
					<label for="">标题：</label>
					<el-input placeholder="标题" v-model="user.title"></el-input>
				</div>
				<el-divider />
				<div class="group">
					<label for="">内容：</label>
					<el-mention v-model="user.content" type="textarea" style="width: 320px" placeholder="内容" />
				</div>
				<el-divider />
				<div class="group">
					<label for="">名字：</label>
					<el-input placeholder="名字" v-model="user.name"></el-input>
				</div>
				<el-divider />
				<div class="group">
					<label for="">会员类型</label>
					<el-select name="" v-model="user.vipGrade" placeholder="会员类型">
						<el-option value="0">普通会员</el-option>
						<el-option value="1">高级会员</el-option>
						<el-option value="2">至尊会员</el-option>
					</el-select>
					<div class="tip">
						<el-tag class="tip" type="success" v-if="user.vipGrade == 0">普通会员</el-tag>
						<el-tag class="tip" type="primary" v-if="user.vipGrade == 1">高级会员</el-tag>
						<el-tag class="tip" type="danger" v-if="user.vipGrade == 2">至尊会员</el-tag>
					</div>
				</div>
				<el-divider />
				<div class="group">
					<label for="">发圈内容：</label>
					<el-upload class="avatar-uploader" action="http://soulmatemeet.vip:8080/upload/square"
						:show-file-list="false" :before-upload="beforeUpload1" :on-success="handleSuccess1"
						:on-error="handleError1">
						<img v-if="imageUrl1" style="width: 100px; height: 100px;" :src="imageUrl1" class="avatar"
							alt="此字体亮时请稍等" />
						<el-avatar v-else :size="100"
							:src="user.source ? 'http://soulmatemeet.vip:8080/' + user.source : 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'" />
					</el-upload>
				</div>
				<el-divider />
				<div class="group">
					<label for="">会员类型</label>
					<el-select name="" v-model="user.country" placeholder="国家">
						<el-option value="jp">日本</el-option>
						<el-option value="ko">韩国</el-option>
						<el-option value="en">英国</el-option>
						<el-option value="vi">越南</el-option>
						<el-option value="zh">台湾</el-option>
					</el-select>
					<div class="tip">
						<el-tag class="tip" type="primary" v-if="user.country == 'jp'">日本</el-tag>
						<el-tag class="tip" type="primary" v-if="user.country == 'ko'">韩国</el-tag>
						<el-tag class="tip" type="primary" v-if="user.country == 'en'">英国</el-tag>
						<el-tag class="tip" type="primary" v-if="user.country == 'vi'">越南</el-tag>
						<el-tag class="tip" type="primary" v-if="user.country == 'zh'">台湾</el-tag>
					</div>
				</div>
				<el-divider />
				<div class="group">
					<label for="">分享数</label>
					<el-date-picker v-model="user.date" type="datetime" placeholder="创建时间"
						value-format="YYYY-MM-DD HH:mm:ss" />
				</div>
				<el-divider />
				<el-button style="width: 200px;height: 50px;" @click="submit">新增</el-button>
				<el-button style="width: 200px;height: 50px;" @click="submitEit" :disable="editBtn">修改</el-button>
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
import {
	Item
} from 'ant-design-vue/es/menu';
const user = ref({
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
})
const editBtn = ref(false)
const del = (index, row) => {
	console.log(row)
	api.delSquare({
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
const clear = () => {
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
	imageUrl.value = ''
	imageUrl1.value = ''
}
const edit = (index, row) => {
	editBtn.value = true
	user.value = row
	activeKey.value = '2'
}
const submitEit = () => {
	editBtn.value = false
	api.updateSquare(user.value).then(res => {
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
	vipGrade: '',
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
	api.getSquare({
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
	// for (let i = 0; i < Object.keys(user.value).length; i++) {
	// 	if (user.value[Object.keys(user.value)[i]] == '') {
	// 		message.error('有必填项未填')
	// 		return
	// 	}
	// }
	api.addSquare(user.value).then(res => {
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
	messageEL.value = '上传失败，请稍后重试！'; //'头像上传失败，请稍后重试！'
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
		user.value.source = response.file
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
.squareContent {
	width: 300px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
</style>