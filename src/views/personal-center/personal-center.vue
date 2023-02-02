<template>
  <div class="personal-center">
    <div class="content">
      <page-header :title="'个人中心'" />
      <div class="main">
        <div class="left">
          <div
            class="item"
            :class="{
              'item-boder': index == 0,
              'item-select': pageEl.show == item.id,
            }"
            @click="modelClick(item)"
            v-for="(item, index) in pageEl.item"
            :key="item"
          >
            {{ item.name }}
          </div>
        </div>
        <div class="right">
          <personal-information v-if="pageEl.show == 1" />
          <my-order v-if="pageEl.show == 2" />
          <commodity-collection v-if="pageEl.show == 3" />
          <change-password v-if="pageEl.show == 4" />
        </div>
      </div>
    </div>
    <page-bottom />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from "vue";
import PageHeader from "@/components/page-header/page-header.vue";
import PageBottom from "@/components/page-bottom/page-bottom.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import PersonalInformation from "./components/personal-information.vue";
import MyOrder from "./components/my-order.vue";
import CommodityCollection from "./components/commodity-collection.vue";
import ChangePassword from "./components/change-password.vue";
import { useRouter, useRoute } from "vue-router";

let router = useRouter();
let route = useRoute();

let pageEl = reactive({
  item: [
    {
      name: "个人信息",
      id: 1,
    },
    {
      name: "我的订单",
      id: 2,
    },
    {
      name: "商品收藏",
      id: 3,
    },
    {
      name: "修改密码",
      id: 4,
    },
  ],
  show: 1,
});

const modelClick = (data: any) => {
  pageEl.show = data.id;
  router.push({ path: "/personal-center", query: { show: data.id } });
};

onMounted(() => {
  let id = route.query.show;
  console.log(id);
  if (id) {
    pageEl.show = id;
  } else {
    pageEl.show = 1;
  }
});
</script>

<style lang="scss" scoped>
.personal-center {
  background: #f4f4f4;
  height: 100vh;
  overflow: auto;
  overflow-y: visible;
}
.content {
  min-height: calc(100vh - 150px);
  box-sizing: border-box;
  padding-bottom: 20px;
}
.main {
  width: 1190px;
  margin: 20px auto 0px;
  min-height: calc(100vh - 370px);
  box-sizing: border-box;
  display: flex;
  .left {
    width: 160px;
    margin-right: 40px;
    box-sizing: border-box;
    .item {
      // padding: 20px 0;
      height: 70px;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background: white;
      border: 1px solid #ddd;
      border-top: none;
      cursor: pointer;
      box-sizing: border-box;
      font-size: 21px;
    }
    .item-boder {
      border-top: 1px solid #ddd;
    }
    .item-select {
      border: none;
      background: rgb(255, 85, 1);
      color: white;
    }
  }
  .right {
    width: calc(100% - 200px);
    box-sizing: border-box;
  }
}
</style>
