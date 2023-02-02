<template>
  <div class="product-header">
    <div class="header">
      <div class="header-content">
        <div class="header-left">欢迎来到水果商城!</div>
        <div class="header-right">
          <div
            class="header-name"
            @click="routeJump('/login')"
            v-if="pageEl.userData == null"
          >
            您好，请登录！！！
          </div>
          <div class="header-text" v-if="pageEl.userData != null">
            欢迎您：{{ pageEl.name }}
          </div>
          <div class="header-border" v-if="pageEl.userData != null"></div>
          <div
            class="header-name"
            @click="routeJump('/shopping-cart')"
            v-if="pageEl.userData != null"
          >
            购物车
          </div>
          <div class="header-border" v-if="pageEl.userData != null"></div>
          <div
            class="header-name"
            @click="routeJump('/system-notice')"
            v-if="pageEl.userData != null"
          >
            公告
          </div>
          <div class="header-border" v-if="pageEl.userData != null"></div>
          <div
            class="header-name"
            @click="routeJump('/system-leave')"
            v-if="pageEl.userData != null"
          >
            留言
          </div>
          <div class="header-border" v-if="pageEl.userData != null"></div>
          <div
            class="header-name"
            @click="routeJump('/personal-center')"
            v-if="pageEl.userData != null"
          >
            个人中心
          </div>
          <div class="header-border" v-if="pageEl.userData != null"></div>
          <div
            class="header-name"
            @click="routeJump('/login')"
            v-if="pageEl.userData != null"
          >
            退出
          </div>
        </div>
      </div>
    </div>
    <div class="search">
      <div class="search-content">
        <div class="search-left">
          <div class="left-img">
            <img src="@/assets/home/login-title.png" @click="routeJump('/home')" />
          </div>
          <div class="left-text" @click="routeJump('/home')">水果商城</div>
        </div>
        <div class="search-center">
          <div class="center-content">
            <div class="input-box">
              <input
                v-model="pageEl.input"
                class="input"
                placeholder="好品质水果"
                @keyup.enter="search(pageEl.input)"
                placeholder-class="placeholder"
              />
            </div>
            <div class="input-button" @click="search(pageEl.input)">
              <img src="@/assets/home/search.png" />
            </div>
          </div>
          <div class="center-select">
            <div class="select-title">新鲜水果</div>
            <div class="select-data">
              <div
                class="select-item"
                @click="search(item)"
                v-for="item in pageEl.list"
                :key="item"
              >
                {{ item }}
              </div>
            </div>
          </div>
        </div>
        <div class="search-right">
          <img src="@/assets/home/login-title2.png" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import { quickPage } from "@/api/backstage";

let emit = defineEmits(["search"]);

let router = useRouter();
let route = useRoute();

let pageEl = reactive({
  name: "xx",
  userData: null,
  list: ["苹果", "橘子", "香蕉", "榴莲", "哈密瓜", "火龙果", "西瓜", "葡萄", "李子"],
  input: "" as String,
});

//获取快捷搜索的数据
const getList = () => {
  let obj = {
    pageSize: 10,
    pageNum: 1,
  };
  quickPage(obj).then((res: any) => {
    if (res.code == "20000") {
      let data = res.data.datas;
      pageEl.list = [];
      data.forEach((item: any, index: number) => {
        if (index < 9) {
          pageEl.list.push(item.name);
        }
      });
    }
  });
};

//路由跳转
const routeJump = (str: string) => {
  router.push(str);
};

//搜索
const search = (data: string) => {
  router.push({ path: "/product-search", query: { data } });
};

watch(
  () => route.query.data,
  () => {
    let name = route.query.data as any;
    pageEl.input = name;
  }
);

onMounted(() => {
  getList();
  let name = route.query.data as String;
  pageEl.input = name;
  let data: any = JSON.parse(localStorage.getItem("userData"));
  if (!data) return;
  pageEl.userData = data;
  if (data && data.realName) {
    pageEl.name = data.realName;
  } else if (data && data.userName) {
    pageEl.name = data.userName;
  }
});

defineExpose({
  search,
});
</script>

<style lang="scss" scoped>
/* 1190 */
.product-header {
  width: 100%;
  // height: 100%;
  box-sizing: border-box;
}
.header {
  border-bottom: 1px solid #ddd;
  background-color: #e3e4e5;
  height: 31px;
  box-sizing: border-box;
  .header-content {
    width: 1190px;
    height: 100%;
    margin: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #666;
  }
  .header-right {
    display: flex;
    align-items: center;
    font-size: 14px;
  }
  .header-border {
    // border-left:1px solid #999;
    margin: 0 20px;
    height: 15px;
    width: 1px;
    background: #bbb;
  }
  .header-name {
    cursor: pointer;
  }
  .header-name:hover {
    color: red;
  }
}
.search {
  width: 100%;
  height: 140px;
  background: #fff;
  border-bottom: 1px solid #ddd;
  .search-content {
    width: 1190px;
    height: 100%;
    margin: auto;
    display: flex;
    justify-content: space-between;
  }
  .search-left {
    width: 190px;
    height: 100%;
    margin-right: 10px;
    // background:red;
    .left-img {
      width: 100%;
      height: 50%;
      text-align: center;
      margin-top: 20px;
      img {
        cursor: pointer;
        height: 100%;
        border-radius: 6px;
      }
    }
    .left-text {
      text-align: center;
      color: orange;
      margin-top: 5px;
      font-size: 25px;
      font-style: italic;
    }
  }
  .search-center {
    flex: 1;
    height: 100%;
    .center-content {
      display: flex;
      // height: 100%;
      justify-content: center;
      // align-items: center;
      padding-top: 30px;
    }
    .input-box {
      width: 546px;
      height: 42px;
      border: 2px solid #e2231a;
      border-right: none;
      display: flex;
      align-items: center;
      padding: 0 15px;
    }
    .input {
      outline: none;
      width: 535px;
      height: 30px;
      border: none;
    }
    .input-button {
      height: 42px;
      width: 58px;
      background: red;
      border: 2px solid #e2231a;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 22px;
      }
    }
    .input-button:hover {
      background: rgb(211, 6, 6);
      border: 2px solid #e2231a;
    }
    .center-select {
      height: 30px;
      width: 640px;
      margin: 10px auto 0;
      display: flex;
      align-items: center;
      .select-title {
        font-size: 18px;
        color: #e2231a;
        font-weight: bold;
        margin-right: 30px;
      }
      .select-data {
        flex: 1;
        display: flex;
        justify-content: space-between;
        font-size: 16px;
        color: #999;
      }
      .select-item {
        cursor: pointer;
      }
      .select-item:hover {
        color: red;
      }
    }
  }
  .search-right {
    width: 190px;
    height: 100%;
    margin-left: 10px;
    text-align: center;
    position: relative;
    img {
      width: 90%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      border-radius: 20px;
    }
  }
}
</style>
<style lang="scss">
.product-header {
  input::-webkit-input-placeholder {
    /* WebKit browsers */
    color: #aaa;
  }

  input:-moz-placeholder {
    /* Mozilla Firefox 4 to 18 */
    color: #aaa;
  }

  input::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    color: #aaa;
  }

  input:-ms-input-placeholder {
    /* Internet Explorer 10+ */
    color: #aaa;
  }
}
</style>
