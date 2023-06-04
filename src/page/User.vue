<template>
  <div>
    <div>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item><a href="/user">用户管理</a></el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="header">
      <el-form :inline="true" :model="userFormData">
        <el-form-item label="账号">
          <el-input v-model="userFormData.clientUsername" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="userFormData.clientName" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input v-model="userFormData.clientPhone" placeholder="联系方式"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table">
      <el-table ref="table" border :data="userTableData" tooltip-effect="dark" style="width: 100%;"
        :cell-style="{ textAlign: 'center' }" @selection-change="handleSelectionChange"
        :header-cell-style="{ textAlign: 'center' }">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="clientUsername" label="账户" width="120">
        </el-table-column>
        <el-table-column prop="clientName" label="姓名" width="120">
        </el-table-column>
        <el-table-column prop="clientSex" label="性别" width="120" :formatter="genderFormatter">
        </el-table-column>
        <el-table-column prop="clientPhone" label="联系方式" width="120">
        </el-table-column>
        <el-table-column prop="clientAddress" label="地址" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click="editClient(scope.row)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" @click="removeClient(scope.row)"
              :disabled=!manage>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" style="margin-top: 10px;padding-left: 50px;">
        <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage"
          layout="total, prev, pager, next, jumper" :total="clientCount">
        </el-pagination>
      </div>
      <div class="footer">
        <el-button type="danger" icon="el-icon-delete" @click="removeAnyClient"
          :disabled="isCanable">批量删除</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'

export default {
  name: 'My-User',
  data() {
    return {
      clientCount: 0,
      currentPage: 1,
      userFormData: {
        clientUsername: '',
        clientName: '',
        clientPhone: ''
      },
      queryData: {
        clientUsername: '',
        clientName: '',
        clientPhone: ''
      },
      userTableData: [],
      clientIds: []
    }
  },
  computed: {
    ...mapState(['manage']),
    isCanable() {
      if (this.clientIds.length === 0) {
        return true;
      } else {
        return !this.manage
      }
    }
  },
  methods: {
    genderFormatter(row) {
      return row.employeeSex === "MALE" ? "男" : "女";
    },
    editClient(rowData) {
      this.$router.push({
        name: 'userForm',
      });
      this.$nextTick(function () {
        this.$bus.$emit('userForm', rowData);
      })
    },
    removeClient(rowData) {
      let isDelete = confirm("确认删除该用户吗？");
      if (isDelete) {
        let Id = rowData.clientId;
        axios.delete(
          `/client/${Id}`,
        ).then(
          response => {
            if (response.data) {
              this.queryClientCount();
              this.handleCurrentChange(this.currentPage);
            }
          }
        )
      }
    },
    removeAnyClient() {
      console.log(this.clientIds)
      let isDelete = confirm("确认删除这些用户吗？");
      if (isDelete) {
        axios.put(
          "/client/delete",
          this.clientIds
        ).then(
          response => {
            if (response.data) {
              this.queryClientCount();
              this.handleCurrentChange(this.currentPage);
            }
          }
        )
      }
    },
    onSubmit() {
      this.queryData.clientUsername = this.userFormData.clientUsername;
      this.queryData.clientName = this.userFormData.clientName;
      this.queryData.clientPhone = this.userFormData.clientPhone;
      this.currentPage = 1;
      this.handleCurrentChange();
      this.queryClientCount();
    },
    handleSelectionChange(val) {
      if (val.length !== 0) {
        this.clientIds.push(val[val.length - 1].clientId)
      }
    },
    handleCurrentChange(val = 1) {
      axios.post(
        `/client/condition/${val}`,
        this.queryData
      ).then(
        response => {
          this.userTableData = response.data;
        }
      )
    },
    queryClientCount() {
      axios.post(
        "/client/clientCount",
        this.queryData
      ).then(
        response => {
          this.clientCount = response.data;
        }
      )
    }
  },
  mounted() {
    this.queryClientCount();
    this.handleCurrentChange();
    this.$bus.$on('userflush', () => {
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
  margin-top: 10px;
}

.table {
  height: 800px;
  background-color: #fff;
  margin-top: 10px;
}

.footer {
  position: fixed;
  right: 100px;
  bottom: 90px;
}
</style>