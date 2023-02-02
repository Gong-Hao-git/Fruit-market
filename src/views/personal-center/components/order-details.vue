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
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="getDetails">商品详情</el-button>
          <el-button
            type="danger"
            @click="cancelClick"
            :loading="pageEl.loading"
            v-show="pageEl.show"
          >
            取消订单
          </el-button>
          <el-button @click="pageEl.dialogVisible = false">取 消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { orderDetails, orderCancel, orderStatus } from "@/api/backstage";
import { base } from "@/utils/request";

let emit = defineEmits(["refresh"]);
let pageEl = reactive({
  dialogVisible: false,
  title: "订单详情",
  loading: false,
  id: "",
  data: null,
  show: true,
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
      title: "订单状态",
      field: "status",
    },
    {
      title: "商品名称",
      field: "name",
    },
    {
      title: "收获地址",
      field: "address",
    },
    {
      title: "总金额",
      field: "total",
    },
  ],
});

const setDialog = (bool: boolean, id: string, show: boolean) => {
  pageEl.dialogVisible = bool;
  pageEl.id = id;
  pageEl.show = show;
  let obj = {
    id,
  };
  orderDetails(obj).then((res: any) => {
    if (res.code == "20000") {
      let data = res.data;
      pageEl.data = data;
      // for (let key in formData) {
      //   formData[key] = data[key];
      // }
      formData.status = getStatusName(data.status);
      formData.total = data.total + "元";
      formData.code = data.code;
      formData.createTime = data.createTime;
      formData.name = data.item.name;
      formData.url = base + data.item.url1;
      formData.address = data.address;
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
  // status: "运输中",
  // name: "正宗新疆哈密瓜香瓜10斤脆甜瓜新鲜水果当季原产地发货网纹瓜包邮",
  // code: "202209091038",
  // createTime: "2020-10-10 20:20:30",
  // total: "10.2元",
  // url: "",
});

//取消订单
const cancelClick = () => {
  ElMessageBox.confirm("确定取消订单?", "提示", {
    confirmButtonText: "确 定",
    cancelButtonText: "取 消",
    type: "warning",
  }).then(() => {
    let obj: any = {
      id: pageEl.id,
      status: 3,
    };
    pageEl.loading = true;
    orderStatus(obj)
      .then((res: any) => {
        pageEl.loading = false;
        if (res.code == "20000") {
          ElMessage.success("订单取消成功");
          pageEl.dialogVisible = false;
          emit("refresh");
        }
      })
      .catch((err) => {
        pageEl.loading = false;
      });
  });
};

//商品详情
const getDetails = () => {
  // let id = pageEl.data.commodityId || 0;
  let id = pageEl.data.itemId;
  let origin = location.origin;
  let path = origin + "/#" + "/product-details?id=" + id;
  window.open(path);
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
