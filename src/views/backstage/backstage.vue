<template>
  <div class="backstage">
    <div class="backstage-header">
      <span class="title">后台管理系统</span>
      <div class="user">
        <el-dropdown class="hd-user">
          <div class="user-content">
            <div class="user-icon">
              <img src="@/assets/img/user-icon.png" />
            </div>
            <div>
              {{ pageEl.name }}
            </div>
            <div class="user-select">
              <img src="@/assets/img/select.png" />
            </div>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="goRouter('/home')">
                前台首页
              </el-dropdown-item>
              <el-dropdown-item @click="goRouter('/login')">
                退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <div class="main">
      <div class="sidebar">
        <sidebar />
      </div>
      <div class="content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import sidebar from "./components/sidebar.vue";

let router = useRouter();

let pageEl = reactive({
  activeIndex: "1",
  name: "XX",
});

//页面跳转
const goRouter = (str: string) => {
  router.push(str);
};

onMounted(() => {
  let data: any = JSON.parse(localStorage.getItem("userData"));
  if(!data)return;
  if (data && data.realName) {
    pageEl.name = data.realName;
  } else if (data && data.userName) {
    pageEl.name = data.userName;
  }
});
</script>

<style lang="scss" scoped>
.backstage {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
.backstage-header {
  height: 80px;
  color: white;
  background: $primary-color;
  position: relative;
  text-align: center;
  line-height: 80px;
  font-size: 35px;
  font-weight: bold;
  letter-spacing: 100px;
  .title {
    background-image: -webkit-linear-gradient(
      left,
      rgb(0, 255, 13),
      #fd8403,
      yellow
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .user {
    position: absolute;
    right: 70px;
    top: 50%;
    transform: translateY(-50%);
    .hd-user {
      letter-spacing: 0px;
      display: flex;
      align-items: center;
      color: $white-color;
      cursor: pointer;
      font-size: 17px;
      font-weight: normal;
    }
    .user-content {
      display: flex;
      align-items: center;
      .user-select {
        width: 20px;
        height: 25px;
        display: flex;
        align-items: flex-end;
        margin-left: 10px;
        img {
          width: 100%;
        }
      }
      .user-icon {
        width: 30px;
        height: 30px;
        margin-right: 10px;
        background: #ccc;
        position: relative;
        border-radius: 50%;
        img {
          width: 65%;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
      }
    }
  }
}
.main {
  height: calc(100% - 80px);
  width: 100%;
  box-sizing: border-box;
  display: flex;
}
.sidebar {
  width: 200px;
  height: 100%;
  border-right: 1px solid #e9eff3;
  overflow: hidden;
}
.content {
  width: calc(100% - 200px);
  height: 100%;
  background: #e9eff3;
  overflow: hidden;
}
</style>
