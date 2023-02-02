<template>
  <div class="commodity">
    <tableModel
      ref="tableModelRef"
      :title="title"
      :fucData="fucData"
      :searchField="searchField"
      :titleButton="titleButton"
      :tableList="tableList"
    >
      <template v-slot:url1="{ data }">
        <!-- 54d458e0374f11ed6558754a32f0f52133.jpg -->
        <div class="slot">
          <!-- <div>{{data.row.url1}}</div> -->
          <!-- <img v-if="data.row.url1" :src="'http://localhost:8081'+data.row.url1"> -->
          <img v-if="data.row.url1" :src="base + data.row.url1" />
        </div>
      </template>
      <template v-slot:categoryIdOne="{ data }">
        {{ data.row.yiji.name }}
      </template>
      <template v-slot:zk="{ data }"> {{ data.row.zk }}折 </template>
      <template v-slot:categoryIdTwo="{ data }"> {{ data.row.erji.name }} </template>
    </tableModel>
  </div>
  <commodity-add ref="commodityAddRef" @refresh="refresh" />
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
import tableModel from "@/components/table-model/table-model.vue";
import { commoditySearch, commodityDelete } from "@/api/backstage";
import commodityAdd from "./components/commodity-add.vue";
import { base } from "@/utils/request";

let commodityAddRef = ref();
let tableModelRef = ref();

//标题
let title = "商品管理";

//查询和删除的接口
let fucData = {
  seach: commoditySearch, //查询的方法
  delete: commodityDelete, //删除的方法，若没有此操作，可以不传
};

//搜索字段
let searchField = [
  {
    title: "商品名称",
    field: "name",
    type: "input",
    placeholder: "请输入商品名称",
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
  {
    type: "success",
    name: "新增",
    operation: "unknown",
    icon: "icon-xinzeng",
    fuc: () => {
      commodityAddRef.value.setDialog(true);
    },
  },
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
    label: "商品名称",
    field: "name",
    width: "auto",
  },
  {
    type: "text",
    label: "商品主图",
    field: "url1",
    width: "auto",
  },
  {
    type: "text",
    label: "商品价格",
    field: "price",
    width: "auto",
  },
  {
    type: "text",
    label: "折扣",
    field: "zk",
    width: "auto",
  },
  {
    type: "text",
    label: "商品一级分类",
    field: "categoryIdOne",
    width: "auto",
  },
  {
    type: "text",
    label: "商品二级分类",
    field: "categoryIdTwo",
    width: "auto",
  },
  {
    type: "operation", //type为operation表单的操作
    label: "操作",
    width: "250px",
    children: [
      {
        type: "other", //为其他操作时的类型
        name: "修改",
        icon: "icon-xiugai", //修改icon标签
        // icon: "icon-chakan", //查看icon标签
        class: "text-color-blue", //操作的icon的class样式
        //text-color-blue  为蓝色的class样式
        //text-color-red   为红色的class样式
        fuc: (data: any) => {
          //为其他操作时，把要执行的方法放在这儿
          let id = data.id;
          commodityAddRef.value.setDialog(true, id);
        },
      },
      {
        type: "delete", //为删除操作时的类型
        name: "下架",
        icon: "icon-shanchu",
        class: "text-color-red",
        titleData:"是否下架该商品?",
        //为非其他操作时，不需要fuc属性，
        //因为非其他操作在组件里面可以直接进行该操作
        key: "id",
        value: "id",
      },
    ],
  },
];
//刷新
const refresh = () => {
  tableModelRef.value.resetAll();
};
</script>

<style lang="scss" scoped>
.commodity {
  height: 100%;
  width: 100%;
}
.slot {
  width: 50px;
  height: 50px;
  overflow: hidden;
  position: relative;
  img {
    height: 100%;
  }
}
</style>
