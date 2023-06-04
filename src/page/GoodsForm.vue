<template>
    <div>
        <div>
            <div>
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item><a href="/goods">商品管理</a></el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </div>
        <div class="form">
            <el-form :model="formData" :rules="rules" ref="formData" label-width="200px" hide-required-asterisk>
                <el-form-item label="商品名称" prop="goodsName">
                    <el-input v-model="formData.goodsName"></el-input>
                </el-form-item>
                <el-form-item label="商品价格" prop="goodsPrice">
                    <el-input v-model="formData.goodsPrice"></el-input>
                </el-form-item>
                <el-form-item label="商品信息" prop="goodsInformation">
                    <el-input type="textarea" v-model="formData.goodsInformation" autosize></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="saveGoods('formData')" :disabled=!manage>保存</el-button>
                    <el-button @click="goBack">返回</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'

export default {
    name: 'My-GoodsForm',
    data() {
        return {
            formData: {
                goodsId: 0,
                goodsName: '',
                goodsPrice: '',
                goodsInformation: '',
                isAddable: true
            },
            rules: {
                goodsName: [
                    { required: true, message: '必须填写商品名称', trigger: 'blur' }
                ],
                goodsPrice: [
                    { required: true, message: '必须填写商品价格', trigger: 'blur' },
                    { min: 1, max: 10, message: '请填写正确的价格', trigger: 'blur' }
                ],
                goodsInformation: [
                    { required: true, message: '必须填写商品信息', trigger: 'blur' },
                    { min: 10, message: '请填写详细商品信息', trigger: 'blur' },
                    { max: 1024, message: '信息字数过多', trigger: 'change' }
                ]
            }
        };
    },
    computed: {
        ...mapState(['manage'])
    },
    methods: {
        saveGoods(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (this.formData.isAddable) {
                        axios.post(
                            "/goods/",
                            this.formData
                        ).then(
                            response => {
                                if (response.data) {
                                    this.$router.replace({
                                        name: 'goods'
                                    })
                                    this.$nextTick(function () {
                                        this.$bus.$emit('goodsflush');
                                    })
                                }
                            }
                        )
                    } else {
                        axios.put(
                            "/goods/",
                            this.formData
                        ).then(
                            response => {
                                if (response.data) {
                                    this.$router.replace({
                                        name: 'goods'
                                    })
                                    this.$nextTick(function () {
                                        this.$bus.$emit('goodsflush');
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
                name: 'goods',
            })
        }
    },
    mounted() {
        this.$bus.$on('goodsForm', (data) => {
            this.formData = data;
        })
    }
}
</script>

<style scoped>
.form {
    margin: 0px auto;
    margin-top: 30px;
    width: 600px;
    padding-right: 200px;
}
</style>