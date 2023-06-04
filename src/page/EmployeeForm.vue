<template>
    <div>
        <div>
            <div>
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item><a href="/employee">员工管理</a></el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </div>
        <div class="form">
            <el-form :model="formData" :rules="rules" ref="formData" label-width="100px" hide-required-asterisk>
                <el-form-item label="账户" prop="employeeUsername">
                    <el-input v-model="formData.employeeUsername"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="employeePassword">
                    <el-input v-model="formData.employeePassword"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-radio-group v-model="formData.employeeSex">
                        <el-radio label="MALE">男</el-radio>
                        <el-radio label="FEMALE">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="部门" prop="employeeDepartment">
                    <el-input v-model="formData.employeeDepartment"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="employeeEmail">
                    <el-input v-model="formData.employeeEmail"></el-input>
                </el-form-item>
                <el-form-item label="管理">
                    <el-radio-group v-model="formData.isManage">
                        <el-radio :label=true>是</el-radio>
                        <el-radio :label=false>否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="saveEmployee('formData')">保存</el-button>
                    <el-button @click="goBack">返回</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'My-EmployeeForm',
    data() {
        return {
            formData: {
                employeeId: 0,
                employeeUsername: '',
                employeePassword: '',
                employeeSex: '',
                employeeDepartment: '',
                employeeEmail: '',
                isManage: false,
                isAddable: true
            },
            rules: {
                employeeUsername: [
                    { required: true, message: '账户不能为空', trigger: 'blur' },
                    { min: 4, max: 16, message: '账户长度为 4 到 16 个字符', trigger: 'blur' }
                ],
                employeePassword: [
                    { required: true, message: '密码不能为空', trigger: 'blur' },
                    { min: 5, max: 16, message: '密码长度为 5 到 16 个字符之间', trigger: 'blur' }
                ],
                employeeDepartment: [
                    { required: true, message: '必须填写部门名称', trigger: 'blur' }
                ],
                employeeEmail: [
                    { required: true, message: '必须填写邮箱', trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        saveEmployee(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (this.formData.isAddable) {
                        axios.post(
                            "/employee",
                            this.formData
                        ).then(
                            response => {
                                if (response.data) {
                                    this.$router.replace({
                                        name: 'employee'
                                    })
                                    this.$nextTick(function () {
                                        this.$bus.$emit('employeeflush');
                                    })
                                }
                            }
                        )
                    } else {
                        axios.put(
                            "/employee",
                            this.formData
                        ).then(
                            response => {
                                if (response.data) {
                                    this.$router.replace({
                                        name: 'employee'
                                    })
                                    this.$nextTick(function () {
                                        this.$bus.$emit('employeeflush');
                                    })
                                }
                            }
                        )
                    }
                }
            })
        },
        goBack() {
            this.$router.replace({
                name: 'employee',
            })
        }
    },
    mounted() {
        this.$bus.$on('employeeForm', (data) => {
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