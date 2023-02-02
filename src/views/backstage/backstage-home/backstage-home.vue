<template>
  <div class="backstage-home">
    <div class="main">
      <div class="model">
        <div class="title">
          <div class="border"></div>
          <div class="name">订单新增情况</div>
        </div>
        <div class="content">
          <div class="char" ref="orderRef"></div>
        </div>
      </div>
      <div class="model">
        <div class="title">
          <div class="border"></div>
          <div class="name">用户登录情况</div>
        </div>
        <div
          class="content"
          @mouseenter.stop="pageEl.rollBool = false"
          @mouseleave.stop="pageEl.rollBool = true"
        >
          <div class="char">
            <div class="table-header">
              <div class="header-border"></div>
              <div class="header-user">用户名</div>
              <div class="header-name">真实姓名</div>
              <div class="header-time">登录时间</div>
            </div>
            <div class="table-content" ref="userContentRef">
              <div
                class="table-content-height"
                :style="{ top: -pageEl.userTop + 'px' }"
                ref="userRef"
              >
                <div class="item" v-for="item in pageEl.userData" :key="item">
                  <div class="item-border">
                    <div :class="item.isDelete ? 'item-radius-red' : 'item-radius'"></div>
                  </div>
                  <div class="item-user">{{ item.userName }}</div>
                  <div class="item-name">{{ item.realName }}</div>
                  <div class="item-time">{{ item.createTime }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="model">
        <div class="title">
          <div class="border"></div>
          <div class="name">公告发布情况</div>
        </div>
        <div class="content">
          <div class="char" ref="noticeRef"></div>
        </div>
      </div>
      <div class="model">
        <div class="title">
          <div class="border"></div>
          <div class="name">用户留言情况</div>
        </div>
        <div class="content">
          <div class="char" ref="leaveRef"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount, nextTick } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import * as echarts from "echarts"; // 使用echarts
import { itemOrderDdti, findBySql, newsGgti, messageLyti } from "@/api/backstage";

let orderRef = ref();
let userRef = ref();
let userContentRef = ref();
let noticeRef = ref();
let leaveRef = ref();
let pageEl = reactive({
  orderData: {
    xAxisData: [],
    seriesData: [],
  },
  orderChart: null as any,
  userData: [],
  noticeData: {
    xAxisData: [],
    seriesData: [],
  },
  noticeChart: null as any,
  leaveData: [],
  leaveChart: null as any,
  userTop: 0,
  rollBool: true,
  setTimeout: null as any,
  type: {
    1: "意见建议",
    2: "用户评价",
    3: "系统优化",
    4: "其他留言",
  },
});

let params = reactive({
  pageNum: 1,
  pageSize: 30,
});

//获取订单数据
const getOrderData = () => {
  itemOrderDdti().then((res: any) => {
    if (res.code == 20000) {
      let data = res.data;
      pageEl.orderData.xAxisData = [];
      pageEl.orderData.seriesData = [];
      data.forEach((item: any) => {
        pageEl.orderData.xAxisData.push(item.month);
        pageEl.orderData.seriesData.push(item.num);
      });
      nextTick(() => {
        draw1();
      });
    }
  });
};

//获取用户登录数据
const getUserData = () => {
  let obj = {
    ...params,
  };
  findBySql(obj).then((res: any) => {
    if (res.code == 20000) {
      let data = res.data;
      pageEl.userData = data.datas;
      nextTick(() => {
        draw2();
      });
    }
  });
};

//获取公告发布情况数据
const getNoticeData = () => {
  newsGgti().then((res: any) => {
    if (res.code == 20000) {
      let data = res.data;
      pageEl.noticeData.xAxisData = [];
      pageEl.noticeData.seriesData = [];
      data.forEach((item: any) => {
        pageEl.noticeData.xAxisData.push(item.month);
        pageEl.noticeData.seriesData.push(item.num);
      });
      nextTick(() => {
        draw3();
      });
    }
  });
};

//获取用户留言数据
const getLeaveData = () => {
  messageLyti().then((res: any) => {
    if (res.code == 20000) {
      let data = res.data;
      pageEl.leaveData = [];
      data.forEach((item: any) => {
        let obj = {
          name: pageEl.type[item.type],
          value: item.num,
        };
        pageEl.leaveData.push(obj);
      });
      nextTick(() => {
        draw4();
      });
    }
  });
};

let draw1 = () => {
  if (pageEl.orderChart != null) {
    pageEl.orderChart.setOption({
      xAxis: {
        data: pageEl.orderData.xAxisData,
      },
      series: [
        {
          data: pageEl.orderData.seriesData,
        },
      ],
    });
    return;
  }
  pageEl.orderChart = echarts.init(orderRef.value);
  let option = {
    tooltip: {},
    toolbox: {
      show: true,
    },
    grid: {
      top: 30,
      bottom: 45,
      left: 50,
      right: 45,
    },

    xAxis: {
      type: "category",
      boundaryGap: false,
      data: pageEl.orderData.xAxisData,
      axisLine: {
        show: true,
      },
      splitLine: {
        show: true,
      },
    },
    yAxis: {
      type: "value",
      axisLine: {
        show: true,
      },
    },
    series: [
      {
        data: pageEl.orderData.seriesData,
        type: "line",
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#1759BE" },
            { offset: 1, color: "#DAE8FE " },
          ]),
        },
      },
    ],
  };
  pageEl.orderChart.setOption(option);
};

let draw2 = () => {
  clearTimeout(pageEl.setTimeout);
  if (pageEl.userData.length < 1) return;
  if (pageEl.rollBool == true) {
    let contentHeight = userContentRef.value.offsetHeight;
    let userHeight = userRef.value.offsetHeight;
    let disparity = userHeight - contentHeight;
    if (disparity <= 0) return;
    let addHeight = 1;
    if (disparity == pageEl.userTop) {
      pageEl.userTop = 0;
    } else if (disparity - pageEl.userTop - addHeight < 0) {
      pageEl.userTop = disparity;
    } else {
      pageEl.userTop = pageEl.userTop + addHeight;
    }
  }
  pageEl.setTimeout = setTimeout(() => {
    draw2();
  }, 50);
};

let draw3 = () => {
  if (pageEl.noticeChart != null) {
    pageEl.noticeChart.setOption({
      xAxis: {
        data: pageEl.noticeData.xAxisData,
      },
      series: [
        {
          data: pageEl.noticeData.seriesData,
        },
      ],
    });
    return;
  }
  pageEl.noticeChart = echarts.init(noticeRef.value);
  let option = {
    tooltip: {},
    toolbox: {
      show: true,
    },
    grid: {
      top: 30,
      bottom: 45,
      left: 50,
      right: 45,
    },

    xAxis: {
      type: "category",
      data: pageEl.noticeData.xAxisData,
    },
    yAxis: {
      type: "value",
      axisLine: {
        show: true,
      },
    },
    series: [
      {
        data: pageEl.noticeData.seriesData,
        type: "bar",
      },
    ],
  };
  pageEl.noticeChart.setOption(option);
};

let draw4 = () => {
  if (pageEl.leaveChart != null) {
    pageEl.leaveChart.setOption({
      series: [
        {
          data: pageEl.leaveData,
        },
      ],
    });
    return;
  }
  pageEl.leaveChart = echarts.init(leaveRef.value);
  let option = {
    // title: {
    //   text: "Referer of a Website",
    //   subtext: "Fake Data",
    //   left: "center",
    // },
    tooltip: {
      trigger: "item",
    },
    legend: {
      orient: "vertical",
      left: "left",
      padding: [20, 20, 20, 20], //可设定图例[距上方距离，距右方距离，距下方距离，距左方距离]
    },
    series: [
      {
        // name: "Access From",
        type: "pie",
        radius: "70%",
        data: pageEl.leaveData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };
  pageEl.leaveChart.setOption(option);
};

onMounted(() => {
  draw1();
  draw2();
  draw3();
  draw4();
  getOrderData();
  getUserData();
  getNoticeData();
  getLeaveData();
});
</script>
<style lang="scss" scoped>
.backstage-home {
  width: 100%;
  height: 100%;
  padding: 15px;
  box-sizing: border-box;
}
.main {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
  padding: 20px 20px 10px;
  box-sizing: border-box;
  .model {
    width: 50%;
    height: 50%;
    .title {
      color: $primary-color;
      font-size: 18px;
      display: flex;
      align-items: center;
      height: 20px;
      font-weight: bold;
    }
    .border {
      width: 7px;
      height: 20px;
      background: $primary-color;
      margin-right: 15px;
    }
    .content {
      width: 95%;
      height: calc(100% - 70px);
      margin-top: 20px;
      background: white;
    }
    .char {
      width: 100%;
      height: 100%;
    }
    .table-header {
      height: 50px;
      background: #f0f4fe;
      border-bottom: 1px solid #ccc;
      color: #999;
      display: flex;
      align-items: center;
      font-size: 18px;
      padding: 10px;
      box-sizing: border-box;
      .header-border {
        width: 50px;
      }
      .header-user {
        width: 250px;
      }
      .header-name {
        width: 250px;
      }
    }
    .table-content {
      height: calc(100% - 50px);
      box-sizing: border-box;
      overflow: hidden;
      position: relative;
    }
    .table-content-height {
      padding: 0 10px;
      box-sizing: border-box;
      width: 100%;
      position: absolute;
      top: 0px;
      left: 0px;
      .item {
        display: flex;
        background: #f0f4fe;
        color: #333;
        margin-bottom: 20px;
        padding: 10px 0;
        border-radius: 3px;
        .item-border {
          width: 50px;
          display: flex;
          justify-content: center;
          align-items: center;
          .item-radius {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: $primary-color;
          }
          .item-radius-red {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: $secondary-color;
          }
        }
        .item-user {
          width: 250px;
        }
        .item-name {
          width: 250px;
        }
      }
    }
  }
}
</style>
