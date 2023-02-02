<template>
  <div class="user">
    <tableModel
      ref="tableModelRef"
      :title="title"
      :fucData="fucData"
      :searchField="searchField"
      :titleButton="titleButton"
      :tableList="tableList"
    />
  </div>
  <user-add ref="userAddRef" @refresh="refresh" />
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
import tableModel from "@/components/table-model/table-model.vue";
import { userSearch, userDelete } from "@/api/backstage";
import userAdd from "./components/user-add.vue";

let userAddRef = ref();
let tableModelRef = ref();

//标题
let title = "用户管理";

//查询和删除的接口
let fucData = {
  seach: userSearch, //查询的方法
  delete: userDelete, //删除的方法，若没有此操作，可以不传
};

//搜索字段
let searchField = [
  {
    title: "用户名称",
    field: "userName",
    type: "input",
    placeholder: "请输入用户名称",
  },
  {
    title: "真实姓名",
    field: "realName",
    type: "input",
    placeholder: "请输入真实姓名",
  },
  {
    title: "性别",
    field: "sex",
    type: "select",
    placeholder: "请选择性别",
    selectData: [
      {
        label: "男",
        value: "男",
      },
      {
        label: "女",
        value: "女",
      },
    ],
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
      userAddRef.value.setDialog(true);
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
    label: "用户名",
    field: "userName",
    width: "auto",
  },
  {
    type: "text",
    label: "手机号",
    field: "phone",
    width: "auto",
  },
  {
    type: "text",
    label: "真实姓名",
    field: "realName",
    width: "auto",
  },
  {
    type: "text",
    label: "性别",
    field: "sex",
    width: "auto",
  },
  {
    type: "text",
    label: "邮箱",
    field: "email",
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
          userAddRef.value.setDialog(true, id);
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
.user {
  height: 100%;
  width: 100%;
}
</style>
