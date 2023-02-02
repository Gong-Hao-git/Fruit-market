<template>
  <div class="category">
    <tableModel
      ref="tableModelRef"
      :title="title"
      :fucData="fucData"
      :searchField="searchField"
      :titleButton="titleButton"
      :tableList="tableList"
    />
  </div>
  <category-add ref="categoryAddRef" @refresh="refresh" />
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
import tableModel from "@/components/table-model/table-model.vue";
import { categorySearch, categoryDelete } from "@/api/backstage";
import { useRouter } from "vue-router";
import categoryAdd from "./components/category-add.vue";

let router = useRouter();

let categoryAddRef = ref();
let tableModelRef = ref();

//标题
let title = "类目管理";

//查询和删除的接口
let fucData = {
  seach: categorySearch, //查询的方法
  delete: categoryDelete, //删除的方法，若没有此操作，可以不传
};

//搜索字段
let searchField = [
  {
    title: "类别名称",
    field: "name",
    type: "input",
    placeholder: "请输入类别名称",
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
      categoryAddRef.value.setDialog(true);
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
    label: "ID",
    field: "id",
    width: "auto",
  },
  {
    type: "text",
    label: "类别名称",
    field: "name",
    width: "auto",
  },
  {
    type: "operation", //type为operation表单的操作
    label: "操作",
    width: "250px",
    children: [
      {
        type: "other", //为其他操作时的类型
        name: "二级分类",
        // icon: "icon-xiugai", //修改icon标签
        icon: "icon-chakan", //查看icon标签
        class: "text-color-blue", //操作的icon的class样式
        //text-color-blue  为蓝色的class样式
        //text-color-red   为红色的class样式
        fuc: (data: any) => {
          //为其他操作时，把要执行的方法放在这儿
          let id = data.id;
          let name = data.name;
          router.push({
            path: "/backstage/category-second",
            query: { id, name },
          });
        },
      },
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
          categoryAddRef.value.setDialog(true, id);
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
.category {
  height: 100%;
  width: 100%;
}
</style>
