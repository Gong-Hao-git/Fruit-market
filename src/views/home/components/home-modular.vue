<template>
  <div class="home-modular">
    <div class="main">
      <div class="title">
        <div class="title-img">
          <img class="front-img" src="@/assets/home/sprite.png" />
        </div>
        <span class="title-name">{{ props.title }}</span>
        <div class="title-img">
          <img class="rear-img" src="@/assets/home/sprite.png" />
        </div>
      </div>
      <div class="content">
        <div class="list-shell" v-for="item in props.list" :key="item">
          <commodityModel :data="item" @getDetails="getDetails" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import commodityModel from "@/components/commodity-model/commodity-model.vue";
import { useRouter, useRoute } from "vue-router";

let router = useRouter();
let route = useRoute();

let props = defineProps({
  title: {
    default: "折扣大促销",
  },
  list: {
    default: () => {
      return {};
    },
  },
});

let emit = defineEmits(["search"]);

const getDetails = (data: any) => {
  let id = data.id || 1;
  router.push({ path: "/product-details", query: { id } });
};
</script>

<style lang="scss" scoped>
.home-modular {
  width: 100%;
}

.main {
  width: 1190px;
  margin: auto;
}
.title {
  font-size: 28px;
  margin-bottom: 20px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  .title-name {
    margin: 0 20px;
  }
  .title-img {
    width: 26px;
    height: 45px;
    position: relative;
    overflow: hidden;
  }
  .front-img {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }
  .rear-img {
    position: absolute;
    right: 0%;
    top: 50%;
    transform: translateY(-50%);
  }
}

.content {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  // justify-content: space-between;
  .list-shell {
    width: 18.5%;
    height: 340px;
    box-sizing: border-box;
    margin-bottom: 20px;
    position: relative;
    margin-right: 1.875%;
  }
  .list-shell:nth-child(5n) {
    margin-right: 0;
  }
}
</style>