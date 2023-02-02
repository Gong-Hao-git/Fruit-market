<template>
  <div class="my-order">
    <div class="title">
      <div
        class="title-list"
        :class="{ color: item.id == pageEl.show }"
        v-for="item in pageEl.orderModel"
        :key="item"
        @click="switchModel(item.id)"
      >
        <span>
          {{ item.name }}
          ({{ item.num }})
        </span>
      </div>
    </div>
    <div class="content" v-loading="pageEl.loading">
      <div
        class="list"
        :class="{ 'list-margin': index + 1 == pageEl.table.length }"
        v-for="(item, index) in pageEl.table"
        :key="item"
        @click="getDetails(item)"
      >
        <div class="left">
          <!-- <img src="@/assets/shopping-cart/shopping-cart-1.png" /> -->
          <img :src="base + item.item.url1" />
        </div>
        <div class="right">
          <div class="right-static">
            {{ getStatusName(item.status) }}
          </div>
          <div class="right-text" :title="item.item.title">
            {{ item.item.name }}
          </div>
          <div class="right-text">
            <div class="right-flex">
              <!-- <div>{{ item.express }}</div>
              <div class="border"></div> -->
              <div>订单号：{{ item.code }}</div>
            </div>
          </div>
          <div class="right-text">
            <span>总金额：</span>
            <span class="right-price">￥{{ item.total }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="details-control">
      <el-pagination
        v-model:currentPage="params.pageNum"
        v-model:page-size="params.pageSize"
        :page-sizes="[10, 20, 30, 40]"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="params.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :disabled="pageEl.loading"
      />
    </div>
    <order-details ref="orderDetailsRef" @refresh="refresh" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { orderFindBySql, orderDdsl } from "@/api/backstage";
import orderDetails from "./order-details.vue";
import { base } from "@/utils/request";

let orderDetailsRef = ref();
let pageEl = reactive({
  orderModel: [
    {
      name: "全部订单",
      num: 0,
      id: null,
    },
    {
      name: "待发货",
      num: 0,
      id: 0,
    },
    {
      name: "待收货",
      num: 0,
      id: 1,
    },
    {
      name: "已收货",
      num: 0,
      id: 2,
    },
    {
      name: "已取消",
      num: 0,
      id: 3,
    },
  ],
  show: null,
  table: [
    // {
    //   id: 1,
    //   static: "运输中",
    //   code: "202209091038",
    //   total: 10.2,
    //   item: {
    //     name: "正宗新疆哈密瓜香瓜10斤脆甜瓜新鲜水果当季原产地发货网纹瓜包邮",
    //     url1: "",
    //   },
    // },
    // {
    //   id: 2,
    //   static: "运输中",
    //   code: "202209091038",
    //   total: 10.2,
    //   item: {
    //     name: "正宗新疆哈密瓜香瓜10斤脆甜瓜新鲜水果当季原产地发货网纹瓜包邮",
    //     url1: "",
    //   },
    // },
  ],
  loading: false,
  userData: null as any,
});

let params = reactive({
  pageSize: 10,
  pageNum: 1,
  total: 0,
});

const switchModel = (id: number) => {
  pageEl.show = id;
  params.pageNum = 1;
  getData();
};

const getData = () => {
  let obj = {
    pageSize: params.pageSize,
    pageNum: params.pageNum,
    // type: pageEl.show,
    userId: pageEl.userData.id,
    status: pageEl.show,
  };
  pageEl.loading = true;
  orderFindBySql(obj)
    .then((res: any) => {
      pageEl.loading = false;
      if (res.code == "20000") {
        let data = res.data;
        pageEl.table = data.datas;
        params.total = parseInt(data.total);
      }
    })
    .catch((err) => {
      pageEl.loading = false;
    });
};

const getNum = () => {
  let obj = {
    userId: pageEl.userData.id,
  };
  orderDdsl(obj).then((res: any) => {
    if (res.code == "20000") {
      let data = res.data;
      data.forEach((num: number, index: number) => {
        pageEl.orderModel[index].num = num;
      });
    }
  });
};

//每页显示条数改变
const handleSizeChange = (val: number) => {
  params.pageSize = val;
  params.pageNum = 1;
  getData();
};

//翻页
const handleCurrentChange = (val: number) => {
  params.pageNum = val;
  getData();
};

//查看详情
const getDetails = (data: any) => {
  if (pageEl.show == 3) {
    orderDetailsRef.value.setDialog(true, data.id, false);
  } else {
    orderDetailsRef.value.setDialog(true, data.id, true);
  }
};

//刷新
const refresh = () => {
  params.pageNum = 1;
  getData();
};

//设置状态
const getStatusName = (val: number) => {
  let name = val;
  if (val == 0) {
    name = "待发货";
  }
  if (val == 1) {
    name = "待收货";
  }
  if (val == 2) {
    name = "已收货";
  }
  if (val == 3) {
    name = "已取消";
  }
  return name;
};

onMounted(() => {
  let data: any = JSON.parse(localStorage.getItem("userData"));
  if (data) {
    pageEl.userData = data;
  }
  getData();
  getNum();
});
</script>

<style lang="scss" scoped>
.my-order {
  width: 100%;
  // border: 1px solid #ddd;
}
.title {
  height: 70px;
  font-size: 20px;
  font-weight: bold;
  color: #666;
  padding: 0 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgb(247, 247, 247);
  // border-bottom: 1px solid #ddd;
  border: 1px solid #ddd;
  .color {
    color: rgb(255, 85, 1);
  }
  span {
    cursor: pointer;
  }
}
.content {
  background: white;
  padding: 40px 20px 40px 20px;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #ddd;
  border-top: none;
  .list {
    display: flex;
    cursor: pointer;
    margin-bottom: 30px;
    background: #eee;
    padding: 20px;
    .left {
      width: 120px;
      height: 120px;
      border: 1px solid #ddd;
      overflow: hidden;
      position: relative;
      border-radius: 10px;
      box-sizing: border-box;
      img {
        height: 100%;
        position: absolute;
        left: 50%;
        transform: translate(-50%);
      }
    }
    .right {
      width: calc(100% - 140px);
      height: 120px;
      margin-left: 20px;
      box-sizing: border-box;
      // border: 1px solid #ddd;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .right-static {
        font-size: 20px;
        font-weight: 550;
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .right-text {
        font-size: 18px;
        // font-weight: 550;
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: #666;
      }
      .right-price {
        color: $secondary-color;
        font-size: 19px;
      }
      .right-flex {
        display: flex;
        align-items: center;
      }
      .border {
        width: 1px;
        height: 16px;
        background: #666;
        margin: 0 10px;
      }
    }
  }
  .list-margin {
    margin-bottom: 0px;
  }
  .list:hover {
    background: rgba(200, 200, 200, 0.2);
  }
}
.details-control {
  height: 70px;
  width: 100%;
  background: rgb(247, 247, 247);
  border: 1px solid #ccc;
  margin: 20px 0 40px;
  display: flex;
  justify-content: center;
}
</style>
