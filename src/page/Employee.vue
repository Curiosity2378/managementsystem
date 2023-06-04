<template>
    <div>
        <div>
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item><a href="/employee">员工管理</a></el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="header">
            <el-form :inline="true" :model="employeeFormData">
                <el-form-item label="账号">
                    <el-input v-model="employeeFormData.employeeUsername" placeholder="账号"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-select v-model="employeeFormData.employeeSex" filterable placeholder="请选择">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="部门">
                    <el-input v-model="employeeFormData.employeeDepartment" placeholder="部门"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="table">
            <el-table ref="multipleTable" border :data="employeeTableData" tooltip-effect="dark" style="width: 100%;"
                :cell-style="{ textAlign: 'center' }" @selection-change="handleSelectionChange"
                :header-cell-style="{ textAlign: 'center' }">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column prop="employeeUsername" label="账户" width="300">
                </el-table-column>
                <el-table-column prop="employeePassword" label="密码" width="300">
                </el-table-column>
                <el-table-column prop="employeeSex" label="性别" width="222" :formatter="genderFormatter">
                </el-table-column>
                <el-table-column prop="employeeDepartment" label="部门" width="300">
                </el-table-column>
                <el-table-column prop="employeeEmail" label="邮箱" width="350">
                </el-table-column>
                <el-table-column label="操作" width="300">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" @click="editEmployee(scope.row)">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" @click="removeEmployee(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="block" style="margin-top: 10px;padding-left: 50px;">
                <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage"
                    layout="total, prev, pager, next, jumper" :total="employeeCount">
                </el-pagination>
            </div>
            <div class="footer">
                <el-button type="primary" icon="el-icon-edit" @click="addEmployee">添加员工</el-button>
                <el-button type="danger" icon="el-icon-delete" @click="removeAnyEmployee"
                    :disabled="isCanable">批量删除</el-button>
            </div>
        </div>
    </div>
</template>
  
<script>
import axios from 'axios'

export default {
    name: 'My-Employee',
    data() {
        return {
            employeeCount: 0,
            currentPage: 1,
            employeeFormData: {
                employeeUsername: '',
                employeeSex: null,
                employeeDepartment: ''
            },
            queryData: {
                employeeUsername: '',
                employeeSex: null,
                employeeDepartment: ''
            },
            employeeTableData: [],
            multipleSelection: [],
            options: [{
                value: null,
                label: '请选择'
            }, {
                value: 'MALE',
                label: '男'
            }, {
                value: 'FEMALE',
                label: '女'
            }],
            value: '',
        }
    }, computed: {
        isCanable() {
            return this.multipleSelection.length === 0;
        }
    },
    methods: {
        genderFormatter(row) {
            return row.employeeSex === "MALE" ? "男" : "女";
        },
        addEmployee() {
            this.$router.push({
                name: 'employeeForm',
            });
        },
        editEmployee(rowData) {
            this.$router.push({
                name: 'employeeForm',
            });
            this.$nextTick(function () {
                this.$bus.$emit('employeeForm', rowData);
            })
        },
        onSubmit() {
            this.queryData.employeeUsername = this.employeeFormData.employeeUsername;
            this.queryData.employeeSex = this.employeeFormData.employeeSex;
            this.queryData.employeeDepartment = this.employeeFormData.employeeDepartment;
            this.currentPage = 1;
            this.handleCurrentChange();
            this.queryEmployeeCount();
        },
        removeEmployee(rowData) {
            let isDelete = confirm("确认删除该账号吗？");
            if (isDelete) {
                let Id = rowData.employeeId;
                axios.delete(
                    `/employee/${Id}`,
                ).then(
                    response => {
                        if (response.data) {
                            this.queryEmployeeCount();
                            this.handleCurrentChange(this.currentPage);
                        }
                    }
                )
            }
        },
        removeAnyEmployee() {
            let isDelete = confirm("确认删除这些账号吗？");
            if (isDelete) {
                let tranData = [];
                for (let i = 0; i < this.multipleSelection.length; i++) {
                    tranData[i] = this.multipleSelection[i].employeeId
                }
                axios.put(
                    "/employee/delete",
                    tranData
                ).then(
                    response => {
                        if (response.data) {
                            this.queryEmployeeCount();
                            this.handleCurrentChange(this.currentPage);
                        }
                    }
                )
            }
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        handleCurrentChange(val = 1) {
            axios.post(
                `/employee/condition/${val}`,
                this.queryData
            ).then(
                response => {
                    this.employeeTableData = response.data;
                }
            )
        },
        queryEmployeeCount() {
            axios.post(
                "/employee/employeeCount",
                this.queryData
            ).then(
                response => {
                    this.employeeCount = response.data;
                }
            )
        }
    },
    mounted() {
        this.queryEmployeeCount();
        this.handleCurrentChange();
        this.$bus.$on('employeeflush', () => {
            this.handleCurrentChange(this.currentPage);
        })
    }
}
</script>
  
<style scoped>
.header {
    background-color: #fff;
    padding-left: 10px;
    padding-top: 10px;
    margin: 10px 0px;
}

.table {
    height: 800px;
    background-color: #fff;
}

.footer {
    position: fixed;
    right: 89px;
    bottom: 100px;
}
</style>