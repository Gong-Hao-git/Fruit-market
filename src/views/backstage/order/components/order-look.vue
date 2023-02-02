<template>
  <div class="order-details">
    <el-dialog
      v-model="pageEl.dialogVisible"
      :title="pageEl.title"
      width="800px"
      destroy-on-close
    >
      <div class="content">
        <div class="left">
          <div class="item" v-for="item in pageEl.list" :key="item">
            <div class="item-title">{{ item.title }}</div>
            :
            <div class="item-value" :title="formData[item.field]">
              {{ formData[item.field] }}
            </div>
          </div>
        </div>
        <div class="right">
          <!-- <img src="@/assets/shopping-cart/shopping-cart-1.png" /> -->
          <img :src="formData.url" />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { orderDetailShow } from "@/api/backstage";
import { base } from "@/utils/request";

let emit = defineEmits(["refresh"]);
let pageEl = reactive({
  dialogVisible: false,
  title: "订单详情",
  loading: false,
  id: "",
  list: [
    {
      title: "订单号",
      field: "code",
    },
    {
      title: "下单时间",
      field: "createTime",
    },
    {
      title: "总金额",
      field: "total",
    },
    {
      title: "收获地址",
      field: "address",
    },
    {
      title: "购买数量",
      field: "num",
    },
    {
      title: "订单状态",
      field: "status",
    },
    {
      title: "商品名称",
      field: "name",
    },
    {
      title: "商品价格",
      field: "price",
    },
    {
      title: "商品折扣",
      field: "zk",
    },
    // {
    //   title: "一级分类",
    //   field: "oneName",
    // },
    // {
    //   title: "二级级分类",
    //   field: "twoName",
    // },
  ],
});

const setDialog = (bool: boolean, newData: any) => {
  pageEl.dialogVisible = bool;
  let id = newData.id;
  pageEl.id = id;
  let obj = {
    orderId: id,
  };
  orderDetailShow(obj).then((res: any) => {
    if (res.code == "20000") {
      let data = res.data;
      formData.status = getStatusName(data.status);
      formData.total = data.total + "元";
      formData.code = newData.code;
      formData.createTime = newData.createTime;
      formData.name = data.item.name;
      formData.url = base + data.item.url1;
      formData.address = newData.address;
      formData.num = data.num;
      formData.price = data.item.price + "元";
      formData.zk = data.item.zk + "折";
      formData.oneName = data.item.yiji.name;
      formData.twoName = data.item.erji.name;
    }
  });
};

let formData = reactive({
  status: "",
  name: "",
  code: "",
  createTime: "",
  total: "",
  url: "",
  address: "",
  num: "",
  price: "",
  zk: "",
  oneName: "",
  twoName: "",
});

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

defineExpose({
  setDialog,
});
</script>

<style lang="scss" scoped>
.order-details {
}
.content {
  display: flex;
  justify-content: space-between;
}
.left {
  width: 530px;
  .item {
    display: flex;
    margin-bottom: 10px;
    .item-title {
      width: 100px;
      font-size: 18px;
      margin-right: 5px;
      text-align-last: justify;
    }
    .item-value {
      margin-left: 15px;
      font-size: 18px;
      width: calc(100% - 150px);
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
.right {
  width: 200px;
  height: 200px;
  position: relative;
  border: 1px solid #aaa;
  border-radius: 6px;
  overflow: hidden;
  img {
    height: 100%;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
}
.dialog-footer {
  display: flex;
  justify-content: center;
}
</style>
