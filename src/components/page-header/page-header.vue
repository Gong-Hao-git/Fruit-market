<template>
  <div class="page-header">
    <div class="header">
      <div class="header-content">
        <div class="header-left">欢迎来到水果商城!</div>
        <div class="header-right">
          <div class="header-text">欢迎您：{{ pageEl.name }}</div>
          <div class="header-border"></div>
          <div class="header-name" @click="routeReturn()">返回</div>
          <div class="header-border"></div>
          <div class="header-name" @click="routeJump('/login')">退出</div>
        </div>
      </div>
    </div>
    <div class="search">
      <div class="search-content">
        <div class="search-left">
          <div class="left-img">
            <img src="@/assets/home/login-title.png" />
          </div>
          <div class="left-text">水果商城</div>
        </div>
        <div class="search-center">
          <div class="center-title">{{ props.title }}</div>
        </div>
        <div class="search-right">
          <img src="@/assets/home/login-title2.png" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";

let router = useRouter();

let props = defineProps({
  title: {
    default: "购物车",
  },
  returnPath: {
    default: "/home",
  },
});

let pageEl = reactive({
  name: "xx",
  userData: null as any,
});

//路由跳转
const routeJump = (str: string) => {
  router.push(str);
};

//返回
const routeReturn = () => {
  let path = props.returnPath;
  router.push(path);
};

onMounted(() => {
  let data: any = JSON.parse(localStorage.getItem("userData"));
  if (!data) return;
  pageEl.userData = data;
  if (data && data.realName) {
    pageEl.name = data.realName;
  } else if (data && data.userName) {
    pageEl.name = data.userName;
  }
});
</script>

<style lang="scss" scoped>
.page-header {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background: white;
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
    width: 100%;
    height: 100%;
    position: relative;
    .center-title {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 50px;
      color: orange;
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
