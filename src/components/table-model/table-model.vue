<template>
  <div class="table-model">
    <div class="title">
      <div class="title-border"></div>
      <div class="title-name">{{ props.title }}</div>
    </div>
    <div class="main">
      <div class="search">
        <div class="search-list" v-for="item in props.searchField" :key="item">
          <div class="search-name">{{ item.title }}:</div>
          <el-input
            class="input"
            v-if="item.type == 'input'"
            :placeholder="item.placeholder"
            v-model="searchData[item.field]"
            clearable
          ></el-input>
          <el-select
            class="input"
            v-if="item.type == 'select'"
            :placeholder="item.placeholder"
            v-model="searchData[item.field]"
            clearable
            @change="searchClick()"
          >
            <el-option
              v-for="list in item.selectData"
              :key="list.value"
              :label="list.label"
              :value="list.value"
            />
          </el-select>
        </div>
        <!-- <el-button
          type="primary"
          @click="searchClick"
          v-if="props.searchButton.searchBool"
        >
          <i class="iconfont icon-sousuo icon-margin"></i>
          搜索
        </el-button>
        <el-button @click="resetClick" v-if="props.searchButton.resetBool">
          <i class="iconfont icon-zhongzhi icon-margin"></i>
          重置
        </el-button>
        <el-button
          @click="addClick"
          type="success"
          v-if="props.searchButton.addBool"
        >
          <i class="iconfont icon-xinzeng icon-margin"></i>
          新增
        </el-button> -->
        <el-button
          @click="buttonClick(item)"
          :type="item.type"
          v-for="item in props.titleButton"
          :key="item"
        >
          <i :class="'iconfont ' + item.icon + ' icon-margin'"></i>
          <span>{{ item.name }}</span>
        </el-button>
      </div>
      <div class="content">
        <el-table
          :data="pageEl.tableData"
          style="width: 100%"
          height="calc(100%)"
          :header-cell-style="{
            background: '#F0F4FE',
            height: '67px',
            fontWeight: '500',
            color: '#333333',
            'text-align': 'center',
          }"
          :cell-style="{
            fontWeight: '400',
            height: '56px',
            color: '#666666',
            'text-align': 'center',
          }"
          tooltip-effect="light"
        >
          <template #empty>
            <el-empty :image-size="150" description="暂无数据"></el-empty>
          </template>
          <el-table-column
            :label="item.label"
            :width="item.width"
            v-for="item in props.tableList"
            :key="item"
            show-overflow-tooltip
          >
            <template #default="scope">
              <div v-if="item.type == 'index'">{{ scope.$index + 1 }}</div>
              <div v-if="item.type == 'text'">
                <slot :name="item.field" v-bind="{ data: scope }">
                  {{ scope.row[item.field] }}
                </slot>
              </div>
              <div v-if="item.type == 'operation'">
                <span
                  class="text-color-margin text-pointer"
                  :class="list.class"
                  @click="tableOperation(scope.row, list)"
                  v-for="list in item.children"
                  :key="list"
                >
                  <i :class="'iconfont ' + list.icon" :title="list.name"></i>
                  {{ list.name }}
                </span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="bottom">
        <el-pagination
          v-model:currentPage="params.pageNum"
          v-model:page-size="params.pageSize"
          :page-sizes="[10, 20, 30, 40]"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="params.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
import { categorySearch, categoryDelete } from "@/api/backstage";
import { ElMessageBox, ElMessage } from "element-plus";

let props = defineProps({
  title: {
    type: String,
    default: "类目管理",
  },
  fucData: {
    default: () => {
      return {
        seach: categorySearch, //查询的方法
        delete: categoryDelete, //删除的方法，若没有此操作，可以不传
      };
    },
  },
  //调用查询或者其他接口的时候要多传的参数
  specialParama: {
    default: () => {
      return {
        seach: {
          bool: false,
          data: {},
        },
      };
    },
  },
  searchField: {
    default: () => {
      return [
        {
          title: "类别名称",
          field: "name",
          type: "input",
          placeholder: "请输入类别名称",
        },
        // {
        //   title: "性别",
        //   field: "age",
        //   type: "select",
        //   placeholder: "请选择性别",
        //   selectData: [
        //     {
        //       label: "男",
        //       value: "男",
        //     },
        //     {
        //       label: "女",
        //       value: "女",
        //     },
        //   ],
        // },
      ];
    },
  },
  titleButton: {
    default: () => {
      return [
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
          fuc: () => {},
        },
      ];
    },
  },
  tableList: {
    default: () => {
      return [
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
              },
            },
            {
              type: "delete", //为删除操作时的类型
              name: "删除",
              icon: "icon-shanchu",
              class: "text-color-red",
              //为非其他操作时，不需要fuc属性，
              //因为非其他操作在组件里面可以直接进行该操作
              key: "deployId",
              value: "deploymentId",
            },
          ],
        },
      ];
    },
  },
});

let searchData = reactive({});
let params = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0,
});

let pageEl = reactive({
  tableData: [],
});

//初始化搜索的字段
const init = () => {
  props.searchField.forEach((item: any) => {
    searchData[item.field] = "";
  });
};
init();

//按钮事件
const buttonClick = (data: any) => {
  if (data.fuc) {
    data.fuc();
    return;
  }
  if (data.operation == "seach") {
    searchClick();
  }
  if (data.operation == "reset") {
    resetClick();
  }
};

//搜索
const searchClick = () => {
  let obj = {
    ...searchData,
    pageNum: params.pageNum,
    pageSize: params.pageSize,
  };
  if (props.specialParama.seach.bool) {
    obj = { ...obj, ...props.specialParama.seach.data };
  }
  let func: any = props.fucData.seach;
  func(obj).then((res: any) => {
    if (res.code == "20000") {
      let data = res.data;
      pageEl.tableData = data.datas;
      params.total = parseInt(data.total);
    }
  });
};

//重置
const resetClick = () => {
  for (let key in searchData) {
    searchData[key] = "";
  }
  searchClick();
};

//变成第一页并重置
const resetAll = () => {
  params.pageSize = 10;
  params.pageNum = 1;
  resetClick();
};

//每页显示条数改变
const handleSizeChange = (val: number) => {
  params.pageSize = val;
  params.pageNum = 1;
  searchClick();
};

//翻页
const handleCurrentChange = (val: number) => {
  params.pageNum = val;
  searchClick();
};

//表单操作
const tableOperation = (data: any, list: any) => {
  if (list.type == "other") {
    if (list.fuc && typeof list.fuc == "function") {
      list.fuc(data);
    }
  }
  if (list.type == "delete") {
    deleteClick(data, list);
  }
};

//删除
const deleteClick = (data: any, list: any) => {
  let key = list.key;
  let value = list.value;
  let titleData = "此操作将删除该数据, 是否继续?";
  if (list.titleData) {
    titleData = list.titleData;
  }
  let func: any = props.fucData.delete;
  ElMessageBox.confirm(titleData, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      let obj: any = {};
      obj[key] = data[value];
      func(obj).then((res: any) => {
        if (res.code == "20000") {
          ElMessage.success("删除成功");
          let number = params.total / 10 + 1;
          let index = params.total % 10;
          let pageNum = params.pageNum;
          if (index == 1 && pageNum > 1 && number == pageNum) {
            params.pageNum = params.pageNum - 1;
          }
          searchClick();
        }
      });
    })
    .catch(() => {});
};

onMounted(() => {
  searchClick();
});

defineExpose({
  resetAll,
});
</script>

<style lang="scss" scoped>
.table-model {
  height: 100%;
  width: 100%;
  padding: 15px;
  box-sizing: border-box;
}
.title {
  display: flex;
  align-items: center;
  height: 20px;
  .title-border {
    background: $primary-color;
    margin-right: 10px;
    height: 20px;
    width: 5px;
  }
  .title-name {
    color: $primary-color;
    font-size: 18px;
    font-weight: bold;
  }
}
.main {
  height: calc(100% - 35px);
  width: 100%;
  background: white;
  margin-top: 15px;
  border-radius: 6px;
  padding: 20px;
  box-sizing: border-box;
  .search {
    display: flex;
    align-items: center;
    // height:80px;
    // padding: 20px;
    .search-list {
      display: flex;
      align-items: center;
      flex-wrap: nowrap;
      margin-right: 20px;
      .search-name {
        margin-right: 10px;
        white-space: nowrap;
      }
    }
  }
  .content {
    height: calc(100% - 120px);
    width: 100%;
    margin-top: 20px;
    box-sizing: border-box;
    .text-color-margin {
      margin: 0 5px;
    }
  }
  .bottom {
    height: 60px;
    width: 100%;
    margin-top: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.input {
  width: 200px;
}
.icon-margin {
  margin-right: 3px;
  font-size: 16px;
}
.text-pointer {
  cursor: pointer;
}
</style>

<style lang="scss">
.table-model {
  .el-table__expanded-cell {
    padding: 0 5px 20px 5px;
  }
  .el-table__inner-wrapper::before {
    display: none;
  }
}
</style>
