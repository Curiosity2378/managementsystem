<template>
  <div>
    <div>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item><a href="/goods">商品管理</a></el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="header">
      <el-form :inline="true" :model="goodsFormData">
        <el-form-item label="产品名称">
          <el-input v-model="goodsFormData.goodsName" placeholder="产品名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table">
      <el-table ref="multipleTable" border :data="goodsTableData" tooltip-effect="dark" style="width: 100%"
        :cell-style="{ textAlign: 'center' }" @selection-change="handleSelectionChange"
        :header-cell-style="{ textAlign: 'center' }">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="goodsName" label="商品名称" width="120">
        </el-table-column>
        <el-table-column prop="goodsPrice" label="商品价格" width="120">
        </el-table-column>
        <el-table-column prop="goodsInformation" label="商品信息" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click="editGoods(scope.row)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" @click="removeGoods(scope.row)"
              :disabled=!manage>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" style="margin-top: 10px;padding-left: 50px;">
        <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage"
          layout="total, prev, pager, next, jumper" :total="goodsCount">
        </el-pagination>
      </div>
      <div class="footer">
        <el-button type="primary" icon="el-icon-edit" @click="addGoods" :disabled=!manage>添加商品</el-button>
        <el-button type="danger" icon="el-icon-delete" @click="removeAnyGoods" :disabled="isCanable">批量删除</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'

export default {
  name: 'My-Goods',
  data() {
    return {
      goodsCount: 0,
      currentPage: 1,
      goodsFormData: {
        goodsName: '',
      },
      queryData: {
        goodsName: '',
      },
      goodsTableData: [],
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
    addGoods() {
      this.$router.push({
        name: 'goodsForm'
      });
      this.$nextTick(function () {
        let tranData = {
          goodsId: '',
          goodsName: '',
          goodsPrice: '',
          goodsInformation: '',
          isAddable: true
        }
        this.$bus.$emit('goodsForm', tranData);
      })
    },
    editGoods(rowData) {
      this.$router.push({
        name: 'goodsForm',
      });
      this.$nextTick(function () {
        let tranData = {
          goodsId: rowData.goodsId,
          goodsName: rowData.goodsName,
          goodsPrice: rowData.goodsPrice,
          goodsInformation: rowData.goodsInformation
        }
        this.$bus.$emit('goodsForm', tranData);
      })
    },
    onSubmit() {
      this.queryData = this.goodsFormData;
      this.currentPage = 1;
      this.handleCurrentChange();
      this.queryGoodsCount();
    },
    removeGoods(rowData) {
      let isDelete = confirm("确认删除该商品吗？");
      if (isDelete) {
        let Id = rowData.goodsId;
        axios.delete(
          `/goods/${Id}`,
        ).then(
          response => {
            if (response.data) {
              this.queryGoodsCount();
              this.handleCurrentChange(this.currentPage);
            }
          }
        )
      }
    },
    removeAnyGoods() {
      let isDelete = confirm("确认删除这些商品吗？");
      if (isDelete) {
        let Data = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          Data[i] = this.multipleSelection[i].goodsId
        }
        axios.put(
          "/goods/delete",
          Data
        ).then(
          response => {
            if (response.data) {
              this.queryGoodsCount();
              this.handleCurrentChange(this.currentPage);
            }
          }
        )
      }
    },
    handleSelectionChange(val = 1) {
      this.multipleSelection = val;
    },
    handleCurrentChange(val = 1) {
      axios.post(
        `/goods/condition/${val}`,
        {
          "goodsName": this.queryData.goodsName
        }
      ).then(
        response => {
          this.goodsTableData = response.data;
        }
      )
    },
    queryGoodsCount() {
      axios.post(
        "/goods/goodsCount",
        {
          "goodsName": this.queryData.goodsName
        }
      ).then(
        response => {
          this.goodsCount = response.data;
        }
      )
    }
  },
  mounted() {
    this.queryGoodsCount();
    this.handleCurrentChange();
    this.$bus.$on('goodsflush', () => {
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
  right: 39px;
  bottom: 100px;
}
</style>