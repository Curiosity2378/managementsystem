<template>
    <div>
        <div>
            <div>
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item><a href="/user">用户管理</a></el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </div>
        <div class="form">
            <el-form :model="formData" :rules="rules" ref="formData" label-width="100px" hide-required-asterisk>
                <el-form-item label="账户" :disabled=!manage>
                    <el-input v-model="formData.clientUsername"></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="clientName">
                    <el-input v-model="formData.clientName"></el-input>
                </el-form-item>
                <el-form-item label="联系方式" prop="clientPhone">
                    <el-input v-model="formData.clientPhone"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-radio-group v-model="formData.clientSex">
                        <el-radio label="MALE">男</el-radio>
                        <el-radio label="FEMALE">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="地址" prop="clientAddress">
                    <el-input type="textarea" v-model="formData.clientAddress"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="saveClient('formData')">保存</el-button>
                    <el-button @click="goBack">返回</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'

export default {
    name: 'My-UserForm',
    data() {
        return {
            formData: {
                clientId: 0,
                clientUsername: '',
                clientName: '',
                clientSex: '',
                clientPhone: '',
                clientAddress: ''
            },
            rules: {
                clientName: [
                    { required: true, message: '必须填写姓名', trigger: 'blur' },
                    { min: 2, max: 16, message: '长度为 2 到 16 个字符之间', trigger: 'blur' }
                ],
                clientPhone: [
                    { required: true, message: '必须填写联系方式', trigger: 'blur' },
                    { min: 11, max: 11, message: '请填写正确的联系方式', trigger: 'blur' }
                ],
                clientAddress: [
                    { required: true, message: '必须填写地址', trigger: 'blur' },
                    { min: 10, message: '请填写详细地址', trigger: 'blur' },
                    { max: 128, message: '超出地址最大长度', trigger: 'change' }
                ]
            }
        };
    },
    computed: {
        ...mapState(['manage'])
    },
    methods: {
        saveClient(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    axios.put(
                        "/client",
                        this.formData
                    ).then(
                        response => {
                            if (response.data) {
                                this.$router.replace({
                                    name: 'user'
                                })
                                this.$nextTick(function () {
                                    this.$bus.$emit('userflush');
                                })
                            }
                        }
                    )
                }
            })
        },
        goBack() {
            this.$router.replace({
                name: 'user',
            })
        }
    },
    mounted() {
        this.$bus.$on('userForm', (data) => {
            this.formData = data;
        })
    }
}
</script>

<style scoped>
.form {
    margin: 0px auto;
    margin-top: 30px;
    width: 400px;
    padding-right: 200px;
}
</style>