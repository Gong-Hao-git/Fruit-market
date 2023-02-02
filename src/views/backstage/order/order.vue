<template>
  <div class="order">
    <tableModel
      ref="tableModelRef"
      :title="title"
      :fucData="fucData"
      :searchField="searchField"
      :titleButton="titleButton"
      :tableList="tableList"
    >
      <template v-slot:user="{ data }">
        {{ data.row.user.realName }}
      </template>
      <template v-slot:status="{ data }">
        {{ getStatusName(data.row.status) }}
      </template>
    </tableModel>
    <order-look ref="orderLookRef" />
    <order-status ref="orderStatusRef" @refresh="refresh" />
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
import tableModel from "@/components/table-model/table-model.vue";
import { orderSearch, orderDelete } from "@/api/backstage";
import orderLook from "./components/order-look.vue";
import orderStatus from "./components/order-status.vue";

let orderLookRef = ref();
let orderStatusRef = ref();
let tableModelRef = ref();

//标题
let title = "订单管理";

//查询和删除的接口
let fucData = {
  seach: orderSearch, //查询的方法
  delete: orderDelete, //删除的方法，若没有此操作，可以不传
};

//搜索字段
let searchField = [
  {
    title: "订单号",
    field: "code",
    type: "input",
    placeholder: "请输入订单号",
  },
];

//搜索按钮
let titleButton = [
  {
    type: "primary",
    name: "搜索",
    operation: "seach",
    icon: "icon-sousuo",
  },
  {
    type: "reset",
    name: "重置",
    operation: "reset",
    icon: "icon-zhongzhi",
  },
  // {
  //   type: "success",
  //   name: "新增",
  //   operation: "unknown",
  //   icon: "icon-xinzeng",
  //   fuc: () => {},
  // },
];

//列表显示的字段
let tableList = [
  {
    type: "index", //type为index表示展示排序
    label: "序号",
    width: "80",
  },
  {
    type: "text", //type为index表示展示文本
    label: "订单号",
    field: "code",
    width: "auto",
  },
  {
    type: "text",
    label: "下单时间",
    field: "createTime",
    width: "auto",
  },
  {
    type: "text",
    label: "总金额",
    field: "total",
    width: "auto",
  },
  {
    type: "text",
    label: "下单人",
    field: "user",
    width: "auto",
  },
  {
    type: "text",
    label: "订单状态",
    field: "status",
    width: "auto",
  },
  {
    type: "operation", //type为operation表单的操作
    label: "操作",
    width: "250px",
    children: [
      {
        type: "other", //为其他操作时的类型
        name: "修改状态",
        icon: "icon-xiugai", //修改icon标签
        // icon: "icon-chakan", //查看icon标签
        class: "text-color-blue", //操作的icon的class样式
        //text-color-blue  为蓝色的class样式
        //text-color-red   为红色的class样式
        fuc: (data: any) => {
          //为其他操作时，把要执行的方法放在这儿
          orderStatusRef.value.setDialog(true, data.id, data.status);
        },
      },
      {
        type: "other", //为其他操作时的类型
        name: "查看",
        // icon: "icon-xiugai", //修改icon标签
        icon: "icon-chakan", //查看icon标签
        class: "text-color-blue", //操作的icon的class样式
        //text-color-blue  为蓝色的class样式
        //text-color-red   为红色的class样式
        fuc: (data: any) => {
          //为其他操作时，把要执行的方法放在这儿
          orderLookRef.value.setDialog(true, data);
        },
      },
    ],
  },
];
//刷新
const refresh = () => {
  tableModelRef.value.resetAll();
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
</script>

<style lang="scss" scoped>
.order {
  height: 100%;
  width: 100%;
}
</style>
