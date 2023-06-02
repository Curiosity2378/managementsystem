<template>
  <div>
    <div class="header">
      <div class="item">
        售后问题总数量
        <div class="num">{{ totalInfo[0] | num }}</div>
        <div class="bottom">今日售后数量：{{ dayInfo[0] }}</div>
      </div>
      <div class="item">
        未处理的售后问题数量
        <div class="num">{{ totalInfo[1] | num }}</div>
        <div class="bottom">今日退货数量：{{ dayInfo[1] }}</div>
      </div>
      <div class="item">
        正在处理的售后问题数量
        <div class="num">{{ totalInfo[2] | num }}</div>
        <div class="bottom">今日换货数量：{{ dayInfo[2] }}</div>
      </div>
      <div class="item">
        已处理的售后问题数量
        <div class="num">{{ totalInfo[3] | num }}</div>
        <div class="bottom">今日维修数量：{{ dayInfo[3] }}</div>
      </div>
    </div>
    <div class="content">
      <div class="main">
        <div class="title">近七天售后问题情况</div>
        <div id="serven" style="width: 100%; height: 360px;"></div>
      </div>
    </div>
    <div class="home-footer">
      <div class="area">
        <div class="title">售后问题比例(产品)</div>
        <div id="product" style="width: 100%;height:200px"></div>
      </div>
      <div class="area">
        <div class="title">售后问题比例（状态）</div>
        <div id="status" style="width: 100%;height:200px"></div>
      </div>
      <div class="area">
        <div class="title">售后问题比例(原因)</div>
        <div id="reason" style="width: 100%;height:200px"></div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import axios from 'axios';

export default {
  name: 'My-Home',
  data() {
    return {
      totalInfo: [0, 0, 0, 0],
      dayInfo: []
    }
  },
  filters: {
    num(value) {
      return value.toLocaleString('zh', { style: 'decimal' });
    }
  },
  methods: {
    queryTotalInfo() {
      axios.get(
        "http://localhost:8080/lone/problem/totalAndDay?isToday=false"
      ).then(
        response => {
          this.totalInfo = response.data
        }
      )
    },
    queryDayInfo() {
      axios.get(
        "http://localhost:8080/lone/problem/totalAndDay?isToday=true"
      ).then(
        response => {
          this.dayInfo = response.data
        }
      )
    },
    queryCenterInfo() {
      axios.get(
        "http://localhost:8080/lone/problem/seven"
      ).then(
        response => {
          let myChart = echarts.init(document.getElementById('serven'));
          // 指定图表的配置项和数据
          let option = {
            legend: {},
            tooltip: {},
            dataset: {
              dimensions: ['condition', '退货', '换货', '维修'],
              source: response.data
            },
            xAxis: { type: 'category' },
            yAxis: {},
            series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }]
          };
          // 使用刚指定的配置项和数据显示图表。
          myChart.setOption(option);
        })
    },
    queryStatusInfo() {
      axios.get(
        "http://localhost:8080/lone/problem/status"
      ).then(
        response => {
          let status = echarts.init(document.getElementById('status'));
          // 指定图表的配置项和数据
          let statusOption = {
            tooltip: {
              trigger: 'item'
            },
            legend: {
              orient: 'vertical',
              left: 'left'
            },
            series: [
              {
                name: 'Access From',
                type: 'pie',
                radius: '50%',
                data: [
                  { value: response.data[0], name: '未处理' },
                  { value: response.data[1], name: '处理中' },
                  { value: response.data[2], name: '已处理' },
                ],
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
          };
          // 使用刚指定的配置项和数据显示图表。
          status.setOption(statusOption);
        }
      )
    },
    queryReasonInfo() {
      axios.get(
        "http://localhost:8080/lone/problem/category"
      ).then(
        response => {
          let reason = echarts.init(document.getElementById('reason'));
          // 指定图表的配置项和数据
          let reasonOption = {
            tooltip: {
              trigger: 'item'
            },
            legend: {
              orient: 'vertical',
              left: 'left'
            },
            series: [
              {
                type: 'pie',
                radius: '50%',
                data: [
                  { value: response.data[0], name: '退货' },
                  { value: response.data[1], name: '换货' },
                  { value: response.data[2], name: '维修' },
                ],
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
          };
          // 使用刚指定的配置项和数据显示图表。
          reason.setOption(reasonOption);
        }
      )
    },
    queryGoodsInfo() {
      axios.get(
        "http://localhost:8080/lone/problem/goods"
      ).then(
        response => {
          let product = echarts.init(document.getElementById('product'));
          // 指定图表的配置项和数据
          let productOption = {
            tooltip: {
              trigger: 'item'
            },
            legend: {
              orient: 'vertical',
              left: 'left'
            },
            series: [
              {
                name: 'Access From',
                type: 'pie',
                radius: '50%',
                data: response.data,
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
          };
          // 使用刚指定的配置项和数据显示图表。
          product.setOption(productOption);
        }
      )
    }
  },
  mounted() {
    this.queryTotalInfo();
    this.queryDayInfo();
    this.queryCenterInfo();
    this.queryReasonInfo();
    this.queryStatusInfo();
    this.queryGoodsInfo();
  }
}
</script>

<style scoped>
.header {
  display: flex;
  padding-right: 20px;
  margin-top: 20px;
  margin-right: 8px;
}

.item {
  flex: 1;
  padding: 20px;
  margin-left: 30px;
  background-color: #fff;
  font-weight: bold;
  color: #fff;
  font-size: 30px;
  height: 200px;
  border-radius: 20px;
  position: relative;
  text-align: center;
}

.num {
  font-size: 40px;
  padding: 20px;
  margin: 20px;
  text-align: center;
  color: #fff;
}

.bottom {
  position: absolute;
  border-top: 1px solid rgb(246, 245, 245);
  padding: 10px 20px;
  bottom: 0;
  right: 0;
  left: 0;
  color: #fff;
  font-size: medium;
  font-weight: normal;
}

.item:nth-child(1) {
  background-image: linear-gradient(#df887d, #88554d);
}

.item:nth-child(2) {
  background-image: linear-gradient(#409eff, #2e556e);
}

.item:nth-child(3) {
  background-image: linear-gradient(#b54fa8, #713c7a);
}

.item:nth-child(4) {
  background-image: linear-gradient(#1cd2f1, #39717a);
}

.content {
  margin: 20px 0px;
  display: flex;
  height: 380px;
}

.main {
  flex: 2;
  background: #fff;
  padding: 10px;
  margin: 0px 30px;
}

.title {
  word-break: keep-all;
  white-space: nowrap;
  display: inline;
}

.home-footer {
  display: flex;
  margin: 15px;
}

.area {
  flex: 1;
  background: #fff;
  text-align: center;
  padding: 10px;
  margin: 15px;
  margin-bottom: 0px;
}
</style>