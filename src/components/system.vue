<template>
    <div class="container">
        <el-card>
        </el-card>
        <el-card>
            <div class="part">
                <div class="operate" v-if="sysData.sys">
                    <div class="group">
                        <label class="label">注册默认金额</label>
                        <el-input v-model="sysData.sys.initMoney"></el-input>
                        <div class="tip">
                            <el-tag>注册后账户默认金额</el-tag>
                        </div>
                    </div>
                    <div class="group">
                        <label class="label">数据出错金额</label>
                        <el-mention placeholder="数据出错金额：" v-model="sysData.sys.errorMoney" type="textarea"
                            style="width: 320px" />
                        <div class="tip">
                            <el-tag>多个金额用 . 隔开,如2500.5000</el-tag>
                        </div>
                    </div>
                    <div class="group">
                        <label class="label">返利百分比</label>
                        <el-input v-model="sysData.sys.profit"><template #append>%</template></el-input>
                    </div>
                </div>
                <div class="btn">
                    <el-button style="width: 100px;height: 30px;margin: 20px 0 0px 0;"
                        @click="submitEit(1)">修改</el-button>
                </div>
            </div>
        </el-card>
        <el-card>
            <div class="part">
                <div class="operate">
                    <div class="group">
                        <label class="label">语言</label>
                        <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">
                            Check all
                        </el-checkbox>
                        <el-checkbox-group v-model="checkedlang" @change="handleCheckedlangChange">
                            <el-checkbox v-for="item in lang" :key="item" :label="item" :value="item">
                                {{ item }}
                            </el-checkbox>
                        </el-checkbox-group>
                    </div>
                </div>
                <div class="btn">
                    <el-button style="width: 100px;height: 30px;margin: 20px 0 10px 0;"
                        @click="submitEit(2)">修改</el-button>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script setup>
import {
    ref
} from 'vue';
import {
    message
} from 'ant-design-vue';
import {
    Plus
} from '@element-plus/icons-vue'
import api from '../api';
import {
    useCounterStore
} from '../store/index';
const store = useCounterStore();
const sysData = ref({
    sys:{
        initMoney:'123',
        errorMoney:'',
        profit:''
    }
})
const vipData = ref({})
const sysObj = ref({})
const checkAll = ref(false)
const isIndeterminate = ref(true)
const checkedlang = ref([])
const lang = ref([])
const submitEit = () => {
    console.log(sysData.value.sys.initMoney)
    api.setSys({
        id:sysData.value.sys.id,
        initMoney: sysData.value.sys.initMoney,
        errorMoney: sysData.value.sys.errorMoney,
        profit: sysData.value.sys.profit,
    }).then(res => {
        if (res.code == 0) {
            message.success('success')
        } else {
            message.error('fail')
        }
    })
}
const getData = () => {
    api.getSys().then(res => {
        if (res.code == 0) {
            console.log(res)
            if (res.code == 0) {
                sysData.value.sys = res.sysRows[0]
                sysData.value.lang = res.langRows
                for (let i = 0; i < sysData.value.lang.length; i++) {
                    lang.value.push(sysData.value.lang[i].lang)
                    if (sysData.value.lang[i].flag) {
                        checkedlang.value.push(sysData.value.lang[i].lang)
                    }
                }
                console.log(sysData.value)
            }
        } else {
            message.error('fail')
        }
    })
}
getData()

const handleCheckAllChange = (val) => {
    checkedlang.value = val ? lang.value : []
    isIndeterminate.value = false
}
const handleCheckedlangChange = (value) => {
    const checkedCount = value.length
    checkAll.value = checkedCount === lang.value.length
    isIndeterminate.value = checkedCount > 0 && checkedCount < lang.value.length
}
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
        // vipData.img = response.file
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
        vipData.img = response.file
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
.el-checkbox-group {
    display: flex;
    flex-wrap: wrap;
}

.el-card {
    margin-bottom: 5px;
}

.part {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.operate {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
}

.btn {
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: flex-end;
}

.label::after {
    content: ":";
    margin-left: 2px;
}

:deep(.el-checkbox-group) {
    display: flex;
    flex-direction: row;
}

.group {
    margin-bottom: 5px;
}

.group .tip {
    margin-left: 30px;
}

.group .el-select,
.group .el-input,
.group .el-mention {
    width: 300px;
}
</style>