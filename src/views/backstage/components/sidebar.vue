<template>
  <div class="sidebar">
    <div
      class="sidebar-list"
      :class="{ select: item.name == pageEl.selectData }"
      @click="jump(item)"
      v-for="item in pageEl.list"
      :key="item"
    >
      <i :class="'iconfont ' + item.icon"></i>
      <div class="name">{{ item.name }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { useRouter, useRoute } from "vue-router";

let router = useRouter();
let route = useRoute();
let pageEl = reactive({
  list: [
    {
      name: "系统首页",
      path: "/backstage/backstage-home",
      icon: "icon-shouye",
      children: [],
    },
    {
      name: "类目管理",
      path: "/backstage/category",
      icon: "icon-leimu",
      children: ["/backstage/category-second"],
    },
    {
      name: "用户管理",
      path: "/backstage/user",
      icon: "icon-yonghu",
      children: [],
    },
    {
      name: "商品管理",
      path: "/backstage/commodity",
      icon: "icon-31quanbushangpin",
      children: [],
    },
    {
      name: "订单管理",
      path: "/backstage/order",
      icon: "icon-dingdan",
      children: [],
    },
    {
      name: "公告管理",
      path: "/backstage/notice",
      icon: "icon-gonggao",
      children: [],
    },
    {
      name: "留言管理",
      path: "/backstage/leave",
      icon: "icon-liuyan",
      children: [],
    },
    {
      name: "快捷搜索",
      path: "/backstage/quick-search",
      icon: "icon-sousuo",
      children: [],
    },
  ],
  selectData: "",
});

const jump = (item: any) => {
  pageEl.selectData = item.name;
  router.push(item.path);
};

//设置要跳转的路由改显示哪儿高亮
const setHighlight = (path: string) => {
  let newPath = path.split("?")[0];
  pageEl.list.forEach((item: any) => {
    if (item.path == newPath) {
      pageEl.selectData = item.name;
    } else if (item.children && item.children.length > 0) {
      item.children.forEach((list: any) => {
        if (list == newPath) {
          pageEl.selectData = item.name;
        }
      });
    }
  });
};

onMounted(() => {
  let path = route.path;
  setHighlight(path);
  router.beforeEach((to, from, next) => {
    if (to) {
      let path = to.fullPath;
      setHighlight(path);
    }
    next();
  });
});
</script>

<style lang="scss" scoped>
.sidebar {
  width: 100%;
  height: 100%;
}
.sidebar-list {
  display: flex;
  // justify-content: center;
  align-items: center;
  padding: 20px 20px 20px 40px;
  cursor: pointer;
  i {
    margin-right: 10px;
    font-size: 20px;
  }
}
.sidebar-list:hover {
  background: rgb(236, 245, 255);
}
.select {
  color: $primary-color;
}
</style>
