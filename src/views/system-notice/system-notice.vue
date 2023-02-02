<template>
  <div class="system-notice">
    <div class="content">
      <page-header :title="'公告'" />
      <div class="main">
        <div class="title">公告列表</div>
        <div class="details-content">
          <div
            class="list cursor"
            @click="getDetails(list)"
            v-for="list in pageEl.table"
            :key="list"
          >
            <div class="list-name">{{ list.name }}</div>
            <div class="list-time">{{ list.time }}</div>
          </div>
          <el-empty v-if="pageEl.table.length == 0" description="购物车为空" />
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
          />
        </div>
      </div>
    </div>
    <page-bottom />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import PageHeader from "@/components/page-header/page-header.vue";
import PageBottom from "@/components/page-bottom/page-bottom.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { noticeSearch } from "@/api/backstage";

let pageEl = reactive({
  table: [],
});

let params = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0,
});

//获取数据
const getData = () => {
  let obj = {
    pageNum: params.pageNum,
    pageSize: params.pageSize,
  };
  noticeSearch(obj).then((res: any) => {
    if (res.code == "20000") {
      let data = res.data;
      pageEl.table = data.datas;
      params.total = parseInt(data.total);
    }
  });
};

//每页显示多少条
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

//详情
const getDetails = (data: any) => {
  let id = data.id || "";
  let origin = location.origin;
  let path = origin + "/#" + "/notice-details?id=" + id;
  window.open(path);
};

onMounted(() => {
  getData();
});
</script>

<style lang="scss" scoped>
.system-notice {
  background: #f4f4f4;
  height: 100vh;
  overflow: auto;
  overflow-y: visible;
}
.content {
  min-height: calc(100vh - 150px);
}
.main {
  width: 1190px;
  margin: 20px auto 0;
  // background: white;
}
.title {
  display: flex;
  justify-content: center;
  font-size: 22px;
  padding: 20px 0;
  margin-bottom: 10px;
  font-weight: bold;
  span {
    color: red;
  }
}
.details-content {
  width: 100%;
  border: 1px solid #ccc;
  // border-top: none;
  // padding-bottom: 50px;
  box-sizing: border-box;
}
.list {
  display: flex;
  border-bottom: 1px solid #ccc;
  padding: 20px;
  align-items: center;
}
.list:hover {
  background: #eee;
}
.list-name {
  width: 900px;
  font-size: 18px;
  margin-right: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap; // 默认不换行；
}
.list-time {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}
.color-red {
  color: red;
}
.cursor {
  cursor: pointer;
}

.details-control {
  height: 70px;
  width: 100%;
  background: #eee;
  border: 1px solid #ccc;
  margin: 20px 0 40px;
  display: flex;
  justify-content: center;
}
</style>
