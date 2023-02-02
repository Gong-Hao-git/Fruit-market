<template>
  <div class="notice">
    <tableModel
      ref="tableModelRef"
      :title="title"
      :fucData="fucData"
      :searchField="searchField"
      :titleButton="titleButton"
      :tableList="tableList"
    />
    <notice-add ref="noticeAddRef" @refresh="refresh" />
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
import tableModel from "@/components/table-model/table-model.vue";
import { noticeSearch, noticeDelete } from "@/api/backstage";
import noticeAdd from "./components/notice-add.vue";

let noticeAddRef = ref();
let tableModelRef = ref();

//标题
let title = "公告管理";

//查询和删除的接口
let fucData = {
  seach: noticeSearch, //查询的方法
  delete: noticeDelete, //删除的方法，若没有此操作，可以不传
};

//搜索字段
let searchField = [
  {
    title: "公告标题",
    field: "name",
    type: "input",
    placeholder: "请输入公告标题",
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
      noticeAddRef.value.setDialog(true);
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
    label: "标题",
    field: "name",
    width: "auto",
  },
  {
    type: "text",
    label: "发布时间",
    field: "createTime",
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
          noticeAddRef.value.setDialog(true, id);
        },
      },
      {
        type: "delete", //为删除操作时的类型
        name: "删除",
        icon: "icon-shanchu",
        class: "text-color-red",
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
.notice {
  height: 100%;
  width: 100%;
}
</style>
