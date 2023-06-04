<template>
  <div>
    <div>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item><a href="/problem">售后问题</a></el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="header">
      <el-form :inline="true" :model="problemFormData">
        <el-form-item label="用户">
          <el-input v-model="problemFormData.clientUsername" placeholder="用户"></el-input>
        </el-form-item>
        <el-form-item label="产品">
          <el-input v-model="problemFormData.goodsName" placeholder="产品"></el-input>
        </el-form-item>
        <el-form-item label="员工">
          <el-input v-model="problemFormData.employeeUsername" placeholder="员工"></el-input>
        </el-form-item>
        <el-form-item label="提交日期">
          <el-date-picker type="date" placeholder="选择日期" v-model="problemFormData.problemStarttime"
            value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
        </el-form-item>
        <el-form-item label="完成日期">
          <el-date-picker type="date" placeholder="选择日期" v-model="problemFormData.problemEndtime"
            value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table">
      <el-table ref="multipleTable" border :data="problemTableData" tooltip-effect="dark" style="width: 100%"
        :header-cell-style="{ textAlign: 'center' }" @selection-change="handleSelectionChange"
        :cell-style="{ textAlign: 'center' }">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="clientUsername" label="用户" width="150">
        </el-table-column>
        <el-table-column prop="goodsName" label="产品" width="150">
        </el-table-column>
        <el-table-column prop="employeeUsername" label="员工" width="150">
        </el-table-column>
        <el-table-column prop="problemCategory" label="分类" width="150" :formatter="categoryFormatter">
        </el-table-column>
        <el-table-column prop="problemContent" label="内容" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="problemStatus" label="状态" width="150" :formatter="statusFormatter">
        </el-table-column>
        <el-table-column label="提交时间" width="150">
          <template slot-scope="scope">{{ timeFormatter(scope.row.problemStarttime) }}</template>
        </el-table-column>
        <el-table-column label="结束时间" width="150">
          <template slot-scope="scope">{{ timeFormatter(scope.row.problemEndtime) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button type="danger" icon="el-icon-delete" @click="removeProblem(scope.row)"
              :disabled=!manage>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" style="margin-top: 10px;padding-left: 50px;">
        <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage"
          layout="total, prev, pager, next, jumper" :total="problemCount">
        </el-pagination>
      </div>
      <div class="footer">
        <el-button type="danger" icon="el-icon-delete" @click="removeAnyProblem" :disabled="isCanable">批量删除</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import { mapState } from 'vuex'

export default {
  name: 'My-Problem',
  data() {
    return {
      problemCount: 0,
      currentPage: 1,
      problemFormData: {
        clientUsername: '',
        goodsName: '',
        employeeUsername: '',
        problemStarttime: '',
        problemEndtime: ''
      },
      queryData: {
        clientUsername: '',
        goodsName: '',
        employeeUsername: '',
        category: null,
        status: null,
        problemStarttime: '',
        problemEndtime: ''
      },
      problemTableData: [],
      multipleSelection: []
    }
  },
  computed: {
    ...mapState(['manage']),
    isCanable() {
      if (this.multipleSelection.length === 0) {
        return true;
      } else {
        return !this.manage
      }
    }
  },
  methods: {
    timeFormatter(value) {
      if (value != null) {
        return moment(value).format('YYYY-MM-DD')
      }
    },
    categoryFormatter(row) {
      return row.problemCategory === "RETURN" ? "退货" : row.problemCategory === "EXCHANGE" ? "换货" : "维修";
    },
    statusFormatter(row) {
      return row.problemStatus === "UNTREATED" ? "未处理" : row.problemStatus === "PROCESSING" ? "处理中" : "已处理";
    },
    onSubmit() {
      this.queryData.clientUsername = this.problemFormData.clientUsername;
      this.queryData.goodsName = this.problemFormData.goodsName;
      this.queryData.employeeUsername = this.problemFormData.employeeUsername;
      this.queryData.problemStarttime = this.problemFormData.problemStarttime;
      this.queryData.problemEndtime = this.problemFormData.problemEndtime;
      this.currentPage = 1;
      this.handleCurrentChange();
      this.queryProblemCount();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    removeProblem(rowData) {
      let isDelete = confirm("确认删除该售后问题吗？");
      if (isDelete) {
        axios.delete(
          `/problem/${rowData.problemId}`,
        ).then(
          response => {
            if (response.data) {
              this.queryProblemCount();
              this.handleCurrentChange(this.currentPage);
            }
          }
        )
      }
    },
    removeAnyProblem() {
      let isDelete = confirm("确认删除这些售后问题吗？");
      if (isDelete) {
        let Data = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          Data[i] = this.multipleSelection[i].problemId
        }
        axios.put(
          "/problem/delete",
          Data
        ).then(
          response => {
            if (response.data) {
              this.queryProblemCount();
              this.handleCurrentChange(this.currentPage);
            }
          }
        )
      }
    },
    handleCurrentChange(val = 1) {
      axios.post(
        `/problem/condition/${val}`,
        this.queryData
      ).then(
        response => {
          this.problemTableData = response.data;
        }
      )
    },
    queryProblemCount() {
      axios.post(
        "/problem/problemCount",
        this.queryData
      ).then(
        response => {
          this.problemCount = response.data;
        }
      )
    },
  },
  mounted() {
    this.queryProblemCount();
    this.handleCurrentChange();
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
  right: 100px;
  bottom: 90px;
}
</style>