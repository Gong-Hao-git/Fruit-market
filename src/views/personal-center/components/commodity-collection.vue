<template>
  <div class="commodity-collection">
    <div class="title">商品收藏</div>
    <div class="content" v-loading="pageEl.loading">
      <div
        class="list"
        :class="{ 'list-margin': index + 1 == pageEl.table.length }"
        v-for="(item, index) in pageEl.table"
        :key="item"
        @click="getDetails(item)"
      >
        <div class="left">
          <!-- <img src="@/assets/shopping-cart/shopping-cart-1.png" /> -->
          <img :src="base + item.item?.url1" />
        </div>
        <div class="right">
          <div class="right-text right-title">
            {{ item.item?.name }}
          </div>
          <div class="right-text">
            <span>折扣：</span>
            <span class="right-type">{{ item.item?.zk }}折</span>
          </div>
          <div class="right-text">
            <span>价格：</span>
            <span class="right-price">￥{{ item.item?.price }}</span>
          </div>
          <div class="right-text">
            <el-button type="info" @click.stop="cancel(item)">取消收藏</el-button>
          </div>
        </div>
      </div>
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
        :disabled="pageEl.loading"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { collectionPage, collectionCancel } from "@/api/backstage";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter, useRoute } from "vue-router";
import { base } from "@/utils/request";

let router = useRouter();
let route = useRoute();

let pageEl = reactive({
  table: [
    // {
    //   id: 1,
    //   item: {},
    // },
    // {
    //   id: 2,
    //   item: {},
    // },
  ],
  loading: false,
  userData: null as any,
});

let params = reactive({
  pageSize: 10,
  pageNum: 1,
  total: 0,
});

const getData = () => {
  let obj = {
    pageSize: params.pageSize,
    pageNum: params.pageNum,
    userId: pageEl.userData.id,
  };
  pageEl.loading = true;
  collectionPage(obj)
    .then((res: any) => {
      pageEl.loading = false;
      if (res.code == "20000") {
        let data = res.data;
        pageEl.table = data.datas;
        params.total = parseInt(data.total);
      }
    })
    .catch((err) => {
      pageEl.loading = false;
    });
};

//每页显示条数改变
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

//取消收藏
const cancel = (data: any) => {
  ElMessageBox.confirm("确定取消收藏该商品?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      let id = data.id;
      let obj = {
        id,
      };
      collectionCancel(obj).then((res: any) => {
        if (res.code == "20000") {
          ElMessage.success("取消收藏成功");
          let number = params.total / 10 + 1;
          let index = params.total % 10;
          let pageNum = params.pageNum;
          if (index == 1 && pageNum > 1 && number == pageNum) {
            params.pageNum = params.pageNum - 1;
          }
          getData();
        }
      });
    })
    .catch(() => {});
};

const getDetails = (data: any) => {
  let id = data.id || 1;
  let origin = location.origin;
  let path = origin + "/#" + "/product-details?id=" + id;
  window.open(path);
};

onMounted(() => {
  let data: any = JSON.parse(localStorage.getItem("userData"));
  if (data) {
    pageEl.userData = data;
  }
  getData();
});
</script>

<style lang="scss" scoped>
.commodity-collection {
  width: 100%;
  // border: 1px solid #ddd;
}
.title {
  height: 50px;
  font-size: 20px;
  font-weight: bold;
  color: #666;
  padding-left: 30px;
  display: flex;
  align-items: center;
  background: rgb(247, 247, 247);
  border: 1px solid #ddd;
}
.content {
  background: white;
  padding: 40px 20px 40px 20px;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #ddd;
  border-top: none;
  .list {
    display: flex;
    cursor: pointer;
    margin-bottom: 30px;
    background: #eee;
    padding: 20px;
    .left {
      width: 120px;
      height: 120px;
      border: 1px solid #ddd;
      overflow: hidden;
      position: relative;
      border-radius: 10px;
      box-sizing: border-box;
      img {
        height: 100%;
        position: absolute;
        left: 50%;
        transform: translate(-50%);
      }
    }
    .right {
      width: calc(100% - 140px);
      height: 120px;
      margin-left: 20px;
      box-sizing: border-box;
      // border: 1px solid #ddd;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .right-static {
        font-size: 20px;
        font-weight: 550;
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .right-text {
        font-size: 18px;
        // font-weight: 550;
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: #666;
      }
      .right-price {
        color: $secondary-color;
        font-size: 19px;
      }
      .right-flex {
        display: flex;
        align-items: center;
      }
      .right-title {
        font-size: 20px;
      }
      .right-type {
        color: orange;
      }
      .border {
        width: 1px;
        height: 16px;
        background: #666;
        margin: 0 10px;
      }
    }
  }
  .list-margin {
    margin-bottom: 0px;
  }
  .list:hover {
    background: rgba(200, 200, 200, 0.2);
  }
}
.details-control {
  height: 70px;
  width: 100%;
  background: rgb(247, 247, 247);
  border: 1px solid #ccc;
  margin: 20px 0 40px;
  display: flex;
  justify-content: center;
}
</style>
