<template>
  <div class="leave">
    <tableModel
      :title="title"
      :fucData="fucData"
      :searchField="searchField"
      :titleButton="titleButton"
      :tableList="tableList"
    >
      <template v-slot:type="{ data }">
        {{ getTypeText(data.row.type) }}
      </template>
    </tableModel>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
import tableModel from "@/components/table-model/table-model.vue";
import { leaveSearch, leaveDelete } from "@/api/backstage";
import { leaveType } from "@/utils/calculation";

let getTypeText = (type: any) => {
  let name = type;
  leaveType.forEach((item: any) => {
    if (type == item.value) {
      name = item.label;
    }
  });
  return name;
};

//标题
let title = "留言管理";

//查询和删除的接口
let fucData = {
  seach: leaveSearch, //查询的方法
  delete: leaveDelete, //删除的方法，若没有此操作，可以不传
};

//搜索字段
let searchField = [
  {
    title: "姓名",
    field: "name",
    type: "input",
    placeholder: "请输入姓名",
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
    label: "姓名",
    field: "name",
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
    label: "留言类型",
    field: "type",
    width: "auto",
  },
  {
    type: "text",
    label: "留言内容",
    field: "content",
    width: "auto",
  },
  {
    type: "operation", //type为operation表单的操作
    label: "操作",
    width: "250px",
    children: [
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
</script>

<style lang="scss" scoped>
.leave {
  height: 100%;
  width: 100%;
}
</style>
