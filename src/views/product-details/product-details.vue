<template>
  <div class="product-details">
    <div class="main">
      <product-header />
      <div class="content">
        <div class="left">
          <img-page :imageList="pageEl.imageList" />
        </div>
        <div class="right">
          <div class="name" :title="pageEl.data.name">
            {{ pageEl.data.name }}
          </div>
          <div class="price">
            <span class="price-title">价格:</span>
            <span class="price-value">￥{{ pageEl.data.price }}</span>
          </div>
          <div class="zk" v-if="parseFloat(pageEl.data.zk) < 10">
            {{ pageEl.data.zk }}折优惠
          </div>
          <div class="address">
            <span>配送至：</span>
            <el-input
              v-model="pageEl.address"
              placeholder="请输入配送地址"
              clearable
              class="input"
              size="mini"
            ></el-input>
            <span class="address-title">采购中，预计明日发货。</span>
          </div>
          <div class="item">
            <span>重量：</span>
            <span>1kg</span>
          </div>
          <div class="item">
            <span>购买数量：</span>
            <el-input-number v-model="pageEl.num" :min="1" controls-position="right" />
          </div>
          <div class="item">
            <div class="button" @click="setBuy">立即购买</div>
            <div class="button" v-loading="pageEl.loading" @click="setShopping">
              加入购物车
            </div>
          </div>
        </div>
        <div class="collection">
          <i
            class="iconfont icon-shoucang"
            :class="{ bright: pageEl.collectionBool }"
            @click="setCollection(!pageEl.collectionBool)"
          ></i>
        </div>
      </div>
    </div>
    <page-bottom />
    <buy-dialog ref="buyRef" />
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted, watch } from "vue";
import productHeader from "@/components/product-header/product-header.vue";
import PageBottom from "@/components/page-bottom/page-bottom.vue";
import imgPage from "@/components/img-page/img-page.vue";
import buyDialog from "@/components/buy-dialog/buy-dialog.vue";
import {
  collection,
  collectionCancel,
  shoppingAdd,
  commodityDetails,
  getCollection,
} from "@/api/backstage";
import { ElMessageBox, ElMessage } from "element-plus";
import { useRouter, useRoute } from "vue-router";
import { base } from "@/utils/request";

let router = useRouter();
let route = useRoute();

let buyRef = ref();
let pageEl = reactive({
  data: {
    id: 1,
    name: "海南小台农芒果新鲜小台芒9斤现摘应当季水果热带芒果整箱10包邮",
    price: 99.9,
    zk: 9,
  },
  id: 1,
  collectionId: null,
  imageList: [],
  userData: null as any,
  address: "",
  num: 1,
  collectionBool: false,
  loading: false,
});

//获取商品详情
const getData = () => {
  let id = route.query.id as any;
  if (id === null) return;
  pageEl.id = id;
  let obj = {
    id,
  };
  commodityDetails(obj).then((res: any) => {
    if (res.code == "20000") {
      let data = res.data;
      pageEl.data = {
        ...data,
      };
      pageEl.imageList = [];
      pageEl.imageList.push({
        path: base + data.url1,
      });
      let url2 = data.url2.split(",");
      url2.forEach((item: any) => {
        let obj = {
          path: base + item,
        };
        pageEl.imageList.push(obj);
      });
    }
  });
};

//查询商品是否收藏
const getCollections = () => {
  let id = route.query.id as any;
  if (id === null) return;
  let data: any = JSON.parse(localStorage.getItem("userData"));
  if (!data) return;
  pageEl.userData = data;
  pageEl.address = data.address;
  if (!(data && data.id)) return;
  let obj = {
    itemId: id,
    userId: data.id,
  };
  getCollection(obj).then((res: any) => {
    if (res.code == "20000") {
      if (res.data != null) {
        pageEl.collectionBool = true;
        pageEl.collectionId = res.data.id;
      }
    }
  });
};

//收藏商品
const setCollection = (bool: boolean) => {
  let func = collection;
  let title = "是否收藏该商品?";
  let name = "收藏成功！";
  let obj: any = {};
  if (bool == false) {
    func = collectionCancel;
    title = "是否取消收藏该商品?";
    name = "取消收藏成功！";
    if (pageEl.collectionId === null) return;
    obj.id = pageEl.collectionId;
  } else {
    obj = {
      itemId: pageEl.id,
      userId: pageEl.userData.id,
      userName: pageEl.userData.userName,
    };
  }
  ElMessageBox.confirm(title, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      func(obj).then((res: any) => {
        if (res.code == "20000") {
          ElMessage.success(name);
          pageEl.collectionBool = bool;
          if (bool == true) {
            pageEl.collectionId = res.data.id;
          }
        }
      });
    })
    .catch(() => {});
};

//添加进购物车
const setShopping = () => {
  ElMessageBox.confirm("确定加入购物车?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      let obj = {
        userId: pageEl.userData.id,
        itemId: pageEl.id,
        num: pageEl.num,
      };
      pageEl.loading = true;
      shoppingAdd(obj)
        .then((res: any) => {
          pageEl.loading = false;
          if (res.code == 20000) {
            ElMessage.success("成功加入购物车");
          }
        })
        .catch((err) => {
          pageEl.loading = false;
        });
    })
    .catch(() => {});
};

//打开购买商品弹窗
const setBuy = () => {
  let total = parseFloat(pageEl.data.price as any) * pageEl.num;
  total = parseInt((total * parseFloat(pageEl.data.zk as any) * 10) as any) / 100;
  let data = [
    {
      itemId: pageEl.id,
      num: pageEl.num,
      price: parseFloat(pageEl.data.price as any),
      total,
    },
  ];
  buyRef.value.setDialog(true, data, pageEl.address, pageEl.userData.id);
};

onMounted(() => {
  getData();
  getCollections();
});
</script>

<style lang="scss" scoped>
.product-details {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background-color: #f4f4f4;
  overflow: auto;
  overflow-y: visible;
}
.main {
  min-height: calc(100vh - 130px);
  margin-bottom: 20px;
}
.content {
  width: 1190px;
  margin: 20px auto 0;
  display: flex;
}
.left {
  width: 400px;
}
.right {
  width: calc(100% - 500px);
  margin-left: 50px;
  box-sizing: border-box;
  .name {
    width: 100%;
    font-size: 22px;
    font-weight: bold;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: #333;
  }
  .price {
    margin-top: 20px;
    background: rgba(200, 200, 200, 0.3);
    padding: 10px 10px;
    display: flex;
    align-items: center;
    border-radius: 6px;
    .price-title {
      font-size: 16px;
      margin-right: 5px;
    }
    .price-value {
      font-size: 24px;
      color: $secondary-color;
    }
  }
  .zk {
    margin-top: 20px;
    font-size: 22px;
    color: $primary-color;
  }
  .address {
    margin-top: 20px;
    font-size: 18px;
    display: flex;
    align-items: center;
    color: #666;
    .input {
      width: 200px;
    }
    .address-title {
      font-size: 14px;
      margin-left: 10px;
      color: #999;
    }
  }
  .item {
    margin-top: 20px;
    font-size: 18px;
    color: #666;
    display: flex;
    .button {
      background: $secondary-color;
      color: white;
      padding: 8px 20px;
      margin-right: 10px;
      border-radius: 3px;
      cursor: pointer;
    }
  }
}
.collection {
  width: 50px;
  display: flex;
  justify-content: flex-end;
  i {
    font-size: 20px;
    color: #999;
    cursor: pointer;
  }
  .bright {
    color: red;
  }
}
</style>
