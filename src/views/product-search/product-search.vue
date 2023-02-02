<template>
  <div class="product-search">
    <div class="main">
      <product-header />
      <div class="content">
        <screen-model
          ref="screenModelRef"
          :pageData="params"
          @setParams="setParams"
          @setPageNum="setPageNum"
        />
        <el-empty
          description="没有相关商品"
          v-if="pageEl.tableData.length == 0"
          class="no-commodity"
        ></el-empty>
        <div class="commodity-content" v-if="pageEl.tableData.length > 0">
          <div class="list-shell" v-for="item in pageEl.tableData" :key="item">
            <commodityModel :data="item" @getDetails="getDetails" />
          </div>
        </div>
        <div class="bottom">
          <el-pagination
            v-model:currentPage="params.pageNum"
            v-model:page-size="params.pageSize"
            background
            layout="total, prev, pager, next, jumper"
            :total="params.total"
            @current-change="setPageNum"
          />
        </div>
      </div>
    </div>
    <page-bottom />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from "vue";
import productHeader from "@/components/product-header/product-header.vue";
import PageBottom from "@/components/page-bottom/page-bottom.vue";
import screenModel from "./components/screen-model.vue";
import commodityModel from "@/components/commodity-model/commodity-model.vue";
import { useRouter, useRoute } from "vue-router";
import { commoditySearchs } from "@/api/backstage";
import { base } from "@/utils/request";

import modular1 from "@/assets/modular/modular-1/modular1-1.png";
import modular2 from "@/assets/modular/modular-1/modular1-2.png";
import modular3 from "@/assets/modular/modular-1/modular1-3.png";
import modular4 from "@/assets/modular/modular-1/modular1-4.png";
import modular5 from "@/assets/modular/modular-1/modular1-5.png";
import modular6 from "@/assets/modular/modular-1/modular1-6.png";
import modular7 from "@/assets/modular/modular-1/modular1-7.png";
import modular8 from "@/assets/modular/modular-1/modular1-8.png";
import modular9 from "@/assets/modular/modular-1/modular1-9.png";
import modular10 from "@/assets/modular/modular-1/modular1-10.png";
import modular11 from "@/assets/modular/modular-1/modular1-11.png";
import modular12 from "@/assets/modular/modular-1/modular1-12.png";
import modular13 from "@/assets/modular/modular-1/modular1-13.png";
import modular14 from "@/assets/modular/modular-1/modular1-14.png";
import modular15 from "@/assets/modular/modular-1/modular1-15.png";

let router = useRouter();
let route = useRoute();

let screenModelRef = ref();
let pageEl = reactive({
  tableData: [
    // {
    //   name: "海南小台农芒果新鲜小台芒9斤现摘应当季水果热带芒果整箱10包邮",
    //   price: 19.8,
    //   zk: 7,
    //   monthlySales: 100,
    //   url1: modular1,
    // },
    // {
    //   name: "正宗新疆哈密瓜香瓜10斤脆甜瓜新鲜水果当季原产地发货网纹瓜包邮",
    //   price: 18.8,
    //   zk: 128.0,
    //   monthlySales: 4000,
    //   url1: modular2,
    // },
    // {
    //   name: "青苹果水果新鲜当季整箱云南昭通丑平萍果酸脆甜金帅10斤包邮现摘",
    //   price: 18.6,
    //   zk: 168.0,
    //   monthlySales: 800,
    //   url1: modular3,
    // },
    // {
    //   name: "部派马来西亚猫山王榴莲新鲜顺丰包邮d197肉冷冻一整个带壳水果",
    //   price: 158.0,
    //   zk: 168.0,
    //   monthlySales: 800,
    //   url1: modular4,
    // },
    // {
    //   name: "果园现采现发正宗锦绣黄桃大果红心脆甜新鲜当季水果5斤包邮",
    //   price: 29.9,
    //   zk: 48.0,
    //   monthlySales: 300,
    //   url1: modular5,
    // },
    // {
    //   title: "陕西大荔冬枣新鲜5斤枣子当季水果甜脆鲜枣青大红枣整箱顺丰包邮",
    //   presentPrice: 16.5,
    //   originalPrice: 99.0,
    //   monthlySales: 47,
    //   src: modular6,
    // },
    // {
    //   title: "陕西大荔冬枣5斤枣子新鲜当季甜脆枣大青枣孕妇水果整箱3顺丰包邮",
    //   presentPrice: 16.5,
    //   originalPrice: 99.0,
    //   monthlySales: 37,
    //   src: modular7,
    // },
    // {
    //   title: "日本品种青印晴王5.5斤礼盒装云南阳光玫瑰青提葡萄提子新鲜水果",
    //   presentPrice: 369.9,
    //   originalPrice: 419.9,
    //   monthlySales: 8,
    //   src: modular8,
    // },
    // {
    //   title: "日本品种冈藤蜜瓜6个礼盒静冈夕张玫珑网纹蜜瓜哈密瓜甜瓜小蜜",
    //   presentPrice: 55.0,
    //   originalPrice: 88.0,
    //   monthlySales: 29,
    //   src: modular9,
    // },
    // {
    //   title: "顺丰包邮6斤混合组合混搭新鲜水果大礼盒装精品高端果篮中秋送礼",
    //   presentPrice: 129.0,
    //   originalPrice: 138.0,
    //   monthlySales: 100,
    //   src: modular10,
    // },
    // {
    //   title: "新鲜四川脆红李脱骨8月李小脆红脆甜多汁应季正宗现货5斤大果",
    //   presentPrice: 29.8,
    //   originalPrice: 29.8,
    //   monthlySales: 40,
    //   src: modular11,
    // },
    // {
    //   title: "顺丰包邮10斤混合组合混搭新鲜水果进口车厘子礼盒装高端中秋送礼",
    //   presentPrice: 358,
    //   originalPrice: 398,
    //   monthlySales: 40,
    //   src: modular12,
    // },
    // {
    //   title: "日本品种青印晴王4.5斤礼盒装云南阳光玫瑰青提葡萄提子新鲜水果",
    //   presentPrice: 309.9,
    //   originalPrice: 359.9,
    //   monthlySales: 37,
    //   src: modular13,
    // },
    // {
    //   title: "【新疆直发】新疆库尔勒香梨子水果新鲜当季整箱批发雪梨9斤大果",
    //   presentPrice: 58.0,
    //   originalPrice: 69.0,
    //   monthlySales: 300,
    //   src: modular14,
    // },
    // {
    //   title: "番石榴 芭乐果 5斤白心番石榴果园直供发货 时令新鲜水果清甜可口",
    //   presentPrice: 23.8,
    //   originalPrice: 29,
    //   monthlySales: 100,
    //   src: modular15,
    // },
  ],
});

let params = reactive({
  pageNum: 1,
  pageSize: 50,
  total: 0,
  name: "",
  query: {
    screenField: "all",
  },
});

//获取数据
const getData = () => {
  let obj = {
    pageNum: params.pageNum,
    pageSize: params.pageSize,
    condition: params.name,
    // query: params.query,
    ...params.query,
  };
  commoditySearchs(obj).then((res: any) => {
    if (res.code == "20000") {
      let data = res.data;
      pageEl.tableData = data.datas.map((item: any) => {
        item.url1 = base + item.url1;
        return item;
      });
      params.total = parseInt(data.total);
    }
  });
};

//重置
const reset = () => {
  params.pageNum = 1;
  params.query = {
    screenField: "all",
  };
  screenModelRef.value.reset();
  getData();
};

//设置筛选数据
const setParams = (data: any) => {
  params.query = data;
  getData();
};

//翻页
const setPageNum = (val: number) => {
  params.pageNum = val;
  getData();
};

//详情
const getDetails = (data: any) => {
  let id = data.id || 1;
  router.push({ path: "/product-details", query: { id } });
};

watch(
  () => route.query.data,
  () => {
    let name = route.query.data as any;
    params.name = name;
    reset();
  }
);

onMounted(() => {
  let name = route.query.data as any;
  params.name = name;
  reset();
});
</script>

<style lang="scss" scoped>
.product-search {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background-color: #f4f4f4;
  overflow: auto;
  overflow-y: visible;
}
.main {
  min-height: calc(100vh - 150px);
}
.content {
  width: 1190px;
  margin: 20px auto 0;
  // border: 1px solid red;
  .no-commodity {
    min-height: 200px;
    margin-top: 20px;
  }
  .commodity-content {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    // justify-content: space-between;
    margin-top: 40px;
    .list-shell {
      width: 18.5%;
      height: 340px;
      box-sizing: border-box;
      margin-bottom: 40px;
      position: relative;
      margin-right: 1.875%;
    }
    .list-shell:nth-child(5n) {
      margin-right: 0;
    }
  }
  .bottom {
    width: 100%;
    background: white;
    display: flex;
    justify-content: center;
    padding: 20px 0;
    margin-bottom: 40px;
  }
}
</style>


{
  code:20000,
  data{
    datas:[
      {
        name:"",
      }
    ]
  }
}