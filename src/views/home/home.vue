<template>
  <div class="home">
    <product-header ref="headerRef" />
    <home-exhibition @search="search" class="margin" />
    <home-modular
      class="margin"
      :title="pageEl.modularTitle1"
      :list="pageEl.discountData"
      @search="search"
    />
    <home-modular
      class="margin"
      :title="pageEl.modularTitle2"
      :list="pageEl.hotData"
      @search="search"
    />
    <home-modular
      class="margin"
      :title="pageEl.modularTitle3"
      :list="pageEl.recommendData"
      @search="search"
    />
    <page-bottom />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import productHeader from "@/components/product-header/product-header.vue";
import HomeExhibition from "./components/home-exhibition.vue";
import HomeModular from "./components/home-modular.vue";
import PageBottom from "@/components/page-bottom/page-bottom.vue";
import { list } from "./home-components";
import { uIndex, uIndex2, uIndex3, uIndex4 } from "@/api/center";
import { base } from "@/utils/request";

let headerRef = ref();
const search = (data: string) => {
  headerRef.value.search(data);
};

let pageEl = reactive({
  modularTitle1: "折扣大促销",
  modularTitle2: "热门商品",
  modularTitle3: "精品推荐",
  // list: list,
  discountData: [], //折扣的数据
  hotData: [], //热门商品的数据
  recommendData: [], //精品推荐的数据
});

//获取折扣大促销数据
const getDiscountData = () => {
  uIndex2().then((res: any) => {
    if (res.code == "20000") {
      pageEl.discountData = res.data.map((item: any) => {
        item.url1 = base + item.url1;
        return item;
      });
    }
  });
};

//获取热门商品的数据
const getHotData = () => {
  uIndex3().then((res: any) => {
    if (res.code == "20000") {
      pageEl.hotData = res.data.map((item: any) => {
        item.url1 = base + item.url1;
        return item;
      });
    }
  });
};

//获取精品推荐的数据
const getRecommendData = () => {
  uIndex4().then((res: any) => {
    if (res.code == "20000") {
      pageEl.recommendData = res.data.map((item: any) => {
        item.url1 = base + item.url1;
        return item;
      });
    }
  });
};

onMounted(() => {
  getDiscountData();
  getHotData();
  getRecommendData();
  let data: any = JSON.parse(localStorage.getItem("userData"));
  if (!data) return;
  // if (!userData) {
  //   ElMessage.error("未登录！！");
  //   router.push("login");
  //   return;
  // }
});
</script>

<style lang="scss" scoped>
.home {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background-color: #f4f4f4;
  overflow: auto;
  overflow-y: visible;
}
.margin {
  margin-top: 10px;
  margin-bottom: 20px;
}
</style>
