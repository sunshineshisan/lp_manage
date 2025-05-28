<template>
	<div class="card-container">
		<a-tabs v-model:activeKey="activeKey" type="card">
			<a-tab-pane key="1" tab="列表">
				<div class="query">
					<el-input style="width: 100px;" v-model="queryObj.id" placeholder="ID"></el-input>
					<el-input style="width: 200px;" v-model="queryObj.account" placeholder="账号/姓名/谁的客户"></el-input>
					<el-input style="width: 200px;" v-model="queryObj.remake" placeholder="备注"></el-input>
					<el-select style="width: 200px;" v-model="queryObj.vipGrade" placeholder="会员等级">
						<el-option value="0">普通客户</el-option>
						<el-option value="1">普通会员</el-option>
						<el-option value="2">高级会员</el-option>
						<el-option value="3">至尊会员</el-option>
					</el-select>
					<el-input style="width: 200px;" v-model="queryObj.inviteCode" placeholder="邀请码"></el-input>
					<!-- <el-date-picker v-model="queryObj.date" type="datetime" placeholder="创建时间"
						value-format="YYYY-MM-DD HH:mm:ss" /> -->
					<el-button @click="getData">查询</el-button>
					<el-button @click="queryClear">清空</el-button>
				</div>
				<el-table :data="tableData" style="width: 100%" stripe> <!-- @expand-change="childChange" -->
					<el-table-column fixed width="50" type="expand">
						<!-- <div>
							阿鑫客户
						</div>
						<div>目前进度</div>
						<div>备注</div> -->
					</el-table-column>
					<el-table-column fixed prop="id" label="ID" width="60" />
					<el-table-column fixed prop="account" label="账号" width="150" />
					<!-- <el-table-column prop="name" label="名字" width="120" /> -->
					<el-table-column prop="avatar" label="头像" width="120" align="center">
						<template #default="scope">
							<a-image :width="100"
								:src="scope.row.avatar ? $imgHead + scope.row.avatar : 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'" />
							<!-- <el-avatar :size="100"
								:src="scope.row.avatar ? $imgHead + scope.row.avatar : 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'" /> -->
						</template>
					</el-table-column>
					<el-table-column prop="staffName" align="center" label="谁的客户" width="120" />
					<el-table-column prop="remake" label="备注" width="120" />
					<el-table-column prop="password" label="密码" width="120" />
					<el-table-column prop="money" label="余额" width="120" />
					<el-table-column prop="vipStatus" label="会员状态" width="120">
						<template #default="scope">
							<template v-if="scope.row.vipStatus == 0">制作中</template>
							<template v-if="scope.row.vipStatus == 1">未激活</template>
							<template v-if="scope.row.vipStatus == 2">激活中</template>
							<template v-if="scope.row.vipStatus == 3">已激活</template>
						</template>
					</el-table-column>
					<el-table-column prop="dataError" label="是否数据错误" width="120" align="center">
						<template #default="scope">
							<template v-if="scope.row.dataError == 0">正常</template>
							<template v-if="scope.row.dataError == 1">数据错误</template>
							<template v-if="scope.row.dataError == 2">账户冻结</template>
						</template>
					</el-table-column>
					<el-table-column prop="inviteCode" label="邀请码" width="120" />
					<el-table-column prop="lineCode" label="LINE" width="120" />
					<el-table-column prop="bankCard" label="银行卡号" width="220" />
					<el-table-column prop="vipCode" label="会员卡号" width="120" />
					<el-table-column prop="vipGrade" label="会员等级" width="120">
						<template #default="scope">
							<template v-if="scope.row.vipGrade == 0">普通客户</template>
							<template v-if="scope.row.vipGrade == 1">普通会员</template>
							<template v-if="scope.row.vipGrade == 2">高级会员</template>
							<template v-if="scope.row.vipGrade == 3">至尊会员</template>
						</template>
					</el-table-column>
					<el-table-column prop="age" label="年龄" width="120" />
					<el-table-column prop="city" label="城市" width="120" />
					<el-table-column prop="createDate" label="创建时间" width="120" />
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
					<el-input placeholder="用户名" v-model="user.account"></el-input>
				</div>
				<el-divider />
				<div class="group">
					<label for="">密码</label>
					<el-input placeholder="密码" v-model="user.password" disabled></el-input>
				</div>
				<el-divider />
				<div class="group">
					<label for="">头像：</label>
					<a-image :width="100"
						:src="user.avatar ? $imgHead + user.avatar : 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'" />
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
					<div class="tip">
						<el-tag class="tip" type="primary" v-if="user.gender == '女'">女</el-tag>
						<el-tag class="tip" type="primary" v-if="user.gender == '男'">男</el-tag>
					</div>
				</div>
				<el-divider />
				<!-- <div class="group">
					<label for="">年龄</label>
					<el-input placeholder="年龄" v-model="user.age"></el-input>
				</div>
				<el-divider />
				<div class="group">
					<label for="">LINE</label>
					<el-input placeholder="LINE" v-model="user.lineCode"></el-input>
				</div>
				<el-divider />
				<div class="group">
					<label for="">城市</label>
					<el-input placeholder="城市" v-model="user.city"></el-input>
				</div>
				<el-divider /> -->
				<div class="group">
					<label for="">银行卡</label>
					<el-mention placeholder="银行卡" v-model="user.bankCard" type="textarea" style="width: 320px" />
				</div>
				<el-divider />
				<div class="group">
					<label for="">余额</label>
					<el-input placeholder="余额" v-model="user.money"></el-input>
					<div class="tip">
						<el-button type="success" @click="showModal('+')">+</el-button>
						<el-button type="danger" @click="showModal('-')">-</el-button>
						<el-button type="danger" @click="showModal('.')">复原</el-button>
						<!-- <el-button type="success" @click="setMoney('cz')">充值</el-button>
						<el-button type="success" @click="setMoney('tx')">提现</el-button> -->
					</div>
					<a-modal v-model:open="open" title="增加减金额" centered ok-text="确认" cancel-text="取消" @ok="handleOk"
						@cancel="handleCancel">
						<div class="mask" style="padding: 80px 20px;">
							<el-input type="text" style="font-size: 21px; width: 320px;" size="large"
								v-model="calcMoney" @input="convertMoney" /><br />
							<strong style="font-size: 21px;">{{ calcValue }}</strong>
						</div>
					</a-modal>
				</div>
				<el-divider />
				<div class="group">
					<label for="">邀请码</label>
					<el-input placeholder="邀请码" v-model="user.inviteCode"></el-input>
				</div>
				<el-divider />
				<div class="group">
					<label for="">账户状态</label>
					<el-select name="" v-model="user.dataError" placeholder="账户状态">
						<el-option value="0">正常</el-option>
						<el-option value="1">数据出错</el-option>
						<el-option value="2">已放弃</el-option>
						<el-option value="3">修复中</el-option>
						<el-option value="4">账户冻结</el-option>
					</el-select>
					<div class="tip">
						<el-tag class="tip" type="success" v-if="user.dataError == 0">正常</el-tag>
						<el-tag class="tip" type="danger" v-if="user.dataError == 1">数据出错</el-tag>
						<el-tag class="tip" type="danger" v-if="user.dataError == 2">已放弃</el-tag>
						<el-tag class="tip" type="danger" v-if="user.dataError == 3">修复中</el-tag>
						<el-tag class="tip" type="warning" v-if="user.dataError == 4">账户冻结</el-tag>
					</div>
				</div>
				<el-divider />
				<div class="group">
					<label for="">会员卡号</label>
					<el-input placeholder="会员卡号" v-model="user.vipCode"></el-input>
				</div>
				<el-divider />
				<div class="group">
					<label for="">会员等级</label>
					<el-select name="" v-model="user.vipGrade" placeholder="会员等级">
						<el-option value="0">普通用户</el-option>
						<el-option value="1">普通会员</el-option>
						<el-option value="2">高级会员</el-option>
						<el-option value="3">至尊会员</el-option>
					</el-select>
					<div class="tip">
						<el-tag class="tip" type="primary" v-if="user.vipGrade == 0">普通用户</el-tag>
						<el-tag class="tip" type="primary" v-if="user.vipGrade == 1">普通会员</el-tag>
						<el-tag class="tip" type="primary" v-if="user.vipGrade == 2">高级会员</el-tag>
						<el-tag class="tip" type="primary" v-if="user.vipGrade == 3">至尊会员</el-tag>
					</div>
				</div>
				<el-divider />
				<div class="group">
					<label for="">会员状态</label>
					<el-select name="" v-model="user.vipStatus" placeholder="会员状态">
						<el-option value="0">制作中</el-option>
						<el-option value="1">未激活</el-option>
						<el-option value="2">激活中</el-option>
						<el-option value="3">已激活</el-option>
					</el-select>
					<div class="tip">
						<el-tag class="tip" type="primary" v-if="user.vipStatus == 0">制作中</el-tag>
						<el-tag class="tip" type="primary" v-if="user.vipStatus == 1">未激活</el-tag>
						<el-tag class="tip" type="primary" v-if="user.vipStatus == 2">激活中</el-tag>
						<el-tag class="tip" type="success" v-if="user.vipStatus == 3">已激活</el-tag>
					</div>
				</div>
				<el-divider />
				<div class="group">
					<label for="">谁的客户</label>
					<el-select name="" filterable v-model="user.staffName" placeholder="谁的客户">
						<el-option :value="''">不确定</el-option>
						<template v-for="(item, index) in staffData" :key="index">
							<el-option :value="item.name">{{ item.name }}</el-option>
						</template>
					</el-select>
				</div>
				<el-divider />
				<div class="group">
					<label for="">是否可以投票</label>
					<el-select name="" v-model="user.voteFlag" placeholder="是否可以投票">
						<el-option value="1">可以投票</el-option>
						<el-option value="0">静止投票</el-option>
					</el-select>
					<div class="tip">
						<el-tag class="tip" type="success" v-if="user.voteFlag == 1">可以投票</el-tag>
						<el-tag class="tip" type="danger" v-if="user.voteFlag == 0">禁止投票</el-tag>
					</div>
				</div>
				<el-divider />
				<div class="group">
					<label for="">备注</label>
					<el-mention placeholder="备注" v-model="user.remake" type="textarea" style="width: 320px" />
				</div>
				<el-divider />
				<div class="group">
					<label for="">创建时间</label>
					<el-date-picker v-model="user.createDate" type="datetime" placeholder="创建时间"
						value-format="YYYY-MM-DD HH:mm:ss" />
				</div>
				<el-divider />
				<!-- <el-input placeholder="会员状态" v-model="user.vipStatus"></el-input><el-divider /> -->
				<!-- <el-input placeholder="配对用户" v-model="user.pairAccount"></el-input><el-divider /> -->
				<!-- <a-image :src="$imgHead+user.pz" width="100px"></a-image>
				<el-input placeholder="凭证1" v-model="user.pz" disable></el-input><el-divider />
				<a-image :src="$imgHead+user.pz1" width="100px"></a-image>
				<el-input placeholder="凭证2" v-model="user.pz1" disable></el-input><el-divider />
				<a-image :src="$imgHead+user.pz2" width="100px"></a-image>
				<el-input placeholder="凭证3" v-model="user.pz2" disable></el-input><el-divider /> -->
				<el-popconfirm title="确定要生成吗?会覆盖之前的邀请码" @confirm="getInviteCode">
					<template #reference>
						<el-button style="width: 200px;height: 50px;">获取邀请码</el-button>
					</template>
				</el-popconfirm>
				<el-popconfirm title="确定要生成吗?会覆盖之前的ID" @confirm="getVipCode">
					<template #reference>
						<el-button style="width: 200px;height: 50px;">获取会员ID</el-button>
					</template>
				</el-popconfirm>
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
	ref,
	onMounted,
	onUnmounted
} from 'vue';
const activeKey = ref('1');
const open = ref(false);
const user = ref({
	account: '',
	name: '',
	avatar: '',
	gender: '',
	password: '',
	city: '',
	age: '',
	bankCard: '',
	money: '',
	inviteCode: '',
	dataError: 0,
	vipCode: '',
	vipGrade: '',
	vipStatus: '',
	likeSquare: '',
	createDate: '',
	remake: ''
})
const calcMoney = ref()
const calcValue = ref()
let initMoney
let calcType
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
const staffData = ref({})
//先获取本地数据，同时等待服务器加载
if (localStorage.getItem('staffData')) {
	staffData.value = localStorage.getItem('staffData')
}
const convertMoney = () => {
	console.log(calcMoney.value)
	const number = parseFloat(calcMoney.value);
	if (!isNaN(number)) {
		// 使用 toLocaleString 方法将数字转换为日元金额格式
		calcValue.value = number.toLocaleString('ja-JP', {
			style: 'currency',
			currency: 'JPY'
		});
	} else {
		calcValue.value = '输入的不是有效的数字';
	}
}
const showModal = (type) => {
	if (type == '.') {
		user.value.money = initMoney
		return
	}
	open.value = true
	calcType = type
}
const handleOk = () => {
	if (calcType == '+') {
		user.value.money = Number(user.value.money) + Number(calcMoney.value)
	} else if (calcType == '-') {
		user.value.money -= calcMoney.value
	} else {
		user.value.money = initMoney
	}
	open.value = false;
	calcMoney.value = ''
	calcValue.value = ''
};
const handleCancel = () => {
	calcMoney.value = ''
	calcValue.value = ''
}
const staffRefesh = () => {
	api.getStaff().then(res => {
		console.log(res)
		if (res.code == 0) {
			staffData.value = res.rows
			localStorage.setItem('staffData', res.rows)
		} else {
			message.error(res.error)
		}
	})
}
staffRefesh()
//过滤不显示的用户
const columnShow = () => {
	return tableData.value.some(item => item.vipGrade >= 3)
}
const editBtn = ref(false)
const clear = () => {
	editBtn.value = false
	user.value = {
		account: '',
		name: '',
		avatar: '',
		gender: '',
		password: '',
		city: '',
		age: '',
		bankCard: '',
		money: '',
		inviteCode: '',
		dataError: '',
		vipCode: '',
		vipGrade: '',
		vipStatus: '',
		likeSquare: '',
		createDate: '',
		remake: ''
	}
}
const edit = (index, row) => {
	editBtn.value = true
	user.value = row
	//记录账户初始金额
	initMoney = user.value.money
	activeKey.value = '2'
}
const del = (index, row) => {
	console.log(row.id)
	api.delUser({
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
	api.updateUser(user.value).then(res => {
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
const childData = ref([])
const pageData = ref({
	pageCount: 5,
	pageIndex: 0,
	pageSize: 5
})
const queryObj = ref({
	id: '',
	account: '',
	staffName: '',
	remake: '',
	vipGrade: '',
	inviteCode: ''
})
const pageChange = (currentPage, pageSize) => {
	pageData.value.pageIndex = currentPage - 1
	getData()
}
const getData = () => {
	api.getUser({
		// account: queryObj.value.account || '',
		// inviteCode: queryObj.value.inviteCode || '',
		// date: queryObj.value.date || '',
		// vipGrade: queryObj.value.vipGrade || '',
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
const getInviteCode = () => {
	let code = Math.floor(Math.random() * 900000) + 100000
	user.value.inviteCode = code
}
const getVipCode = () => {
	let code = Math.floor(Math.random() * 900000) + 100000
	user.value.vipCode = code
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
/* .el-pagination {
		display: flex;
		justify-content: center;
		margin: 20px;
	}
	.card-container p {
		margin: 0;
	}

	.card-container>.ant-tabs-card .ant-tabs-content {
		height: 120px;
		margin-top: -16px;
	}

	.card-container>.ant-tabs-card .ant-tabs-content>.ant-tabs-tabpane {
		padding: 16px;
		background: #fff;
	}

	.card-container>.ant-tabs-card>.ant-tabs-nav::before {
		display: none;
	}

	.card-container>.ant-tabs-card .ant-tabs-tab,
	[data-theme='compact'] .card-container>.ant-tabs-card .ant-tabs-tab {
		background: transparent;
		border-color: transparent;
	}

	.card-container>.ant-tabs-card .ant-tabs-tab-active,
	[data-theme='compact'] .card-container>.ant-tabs-card .ant-tabs-tab-active {
		background: #fff;
		border-color: #fff;
	}

	#components-tabs-demo-card-top .code-box-demo {
		padding: 24px;
		overflow: hidden;
		background: #f5f5f5;
	}

	[data-theme='compact'] .card-container>.ant-tabs-card .ant-tabs-content {
		height: 120px;
		margin-top: -8px;
	}

	[data-theme='dark'] .card-container>.ant-tabs-card .ant-tabs-tab {
		background: transparent;
		border-color: transparent;
	}

	[data-theme='dark'] #components-tabs-demo-card-top .code-box-demo {
		background: #000;
	}

	[data-theme='dark'] .card-container>.ant-tabs-card .ant-tabs-content>.ant-tabs-tabpane {
		background: #141414;
	}

	[data-theme='dark'] .card-container>.ant-tabs-card .ant-tabs-tab-active {
		background: #141414;
		border-color: #141414;
	} */
</style>