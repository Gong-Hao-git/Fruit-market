<template>
  <div class="img-page">
    <div class="main-drawing">
      <img
        v-if="props.imageList && props.imageList.length > 0"
        :src="props.imageList[pageEl.show].path"
      />
    </div>
    <div class="image-select">
      <div class="to-left">
        <i
          class="iconfont icon-xiangzuo show"
          :class="{ 'not-allowed': pageEl.page == 0 }"
          @click="turnPages(-1)"
        ></i>
      </div>
      <div class="center" ref="centerRef">
        <div class="content-box" :style="{ left: -pageEl.boxLeft + 'px' }">
          <div class="content">
            <div class="item" v-for="(item, index) in props.imageList" :key="item">
              <div
                class="item-data"
                :class="index == pageEl.show ? 'item-border' : ''"
                @mouseover="mouseover(index)"
              >
                <img :src="item.path" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="to-right">
        <i
          class="iconfont icon-xiangzuo show"
          @click="turnPages(1)"
          :class="{
            'not-allowed':
              pageEl.page == props.imageList.length - 5 ||
              props.imageList.length - 5 <= 0,
          }"
        ></i>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted, onBeforeUnmount, watch } from "vue";
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

let props = defineProps({
  imageList: {
    default: () => {
      return [
        // {
        //   path: modular1,
        // },
        // {
        //   path: modular2,
        // },
        // {
        //   path: modular3,
        // },
        // {
        //   path: modular4,
        // },
        // {
        //   path: modular5,
        // },
        // {
        //   path: modular6,
        // },
        // {
        //   path: modular7,
        // },
        // {
        //   path: modular8,
        // },
        // {
        //   path: modular9,
        // },
        // {
        //   path: modular10,
        // },
        // {
        //   path: modular11,
        // },
      ];
    },
  },
});

let centerRef = ref();

let pageEl = reactive({
  show: 0,
  page: 0,
  centerWidth: 0,
  itemWidth: 0,
  pageBool: true,
  boxLeft: 0,
  toWidth: 3,
  interval: 10,
  time: null as any,
});

//获取center框的宽度
const getCenterWidth = () => {
  pageEl.centerWidth = centerRef.value.offsetWidth;
  pageEl.itemWidth = pageEl.centerWidth / 5;
};

//鼠标移入事件，移动到那个图片上面，就显示那个图片
const mouseover = (index: number) => {
  pageEl.show = index;
};

//翻页
const turnPages = (val: number) => {
  let length = props.imageList.length - 5;
  if (pageEl.pageBool == false) return;
  if (pageEl.page == 0 && val < 0) return;
  if (val > 0 && length <= 0) return;
  if (pageEl.page == length && val > 0) return;
  getCenterWidth();
  pageEl.page = pageEl.page + val;
  pageAnima(val);
};

//翻页执行动画
const pageAnima = (val: number) => {
  clearTimeout(pageEl.time);
  pageEl.pageBool = false;
  let toWidth = pageEl.toWidth;
  if (val < 0) {
    toWidth = -toWidth;
  }
  let finalWidth = pageEl.page * pageEl.itemWidth;
  pageEl.boxLeft = pageEl.boxLeft + toWidth;
  let bool = true;
  if (val > 0) {
    if (pageEl.boxLeft >= finalWidth) {
      pageEl.boxLeft = finalWidth;
      bool = false;
    }
  }
  if (val < 0) {
    if (pageEl.boxLeft <= finalWidth) {
      pageEl.boxLeft = finalWidth;
      bool = false;
    }
  }
  if (bool) {
    pageEl.time = setTimeout(() => {
      pageAnima(val);
    }, pageEl.interval);
  } else {
    clearTimeout(pageEl.time);
    pageEl.pageBool = true;
  }
};

onMounted(() => {
  getCenterWidth();
});

onBeforeUnmount(() => {
  clearTimeout(pageEl.time);
});
</script>

<style lang="scss" scoped>
.img-page {
  width: 100%;
  .main-drawing {
    width: 100%;
    height: 400px;
    box-sizing: border-box;
    border: 1px solid #ccc;
    overflow: hidden;
    border-radius: 3px;
    background: white;
    position: relative;
    img {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      height: 100%;
    }
  }
  .image-select {
    width: 100%;
    height: 60px;
    margin-top: 20px;
    display: flex;
  }
  .to-left {
    width: 30px;
    height: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    i {
      font-size: 40px;
      color: #ccc;
      cursor: pointer;
    }
  }
  .to-right {
    width: 30px;
    height: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    transform: rotate(180deg);
    i {
      font-size: 40px;
      color: #ccc;
    }
  }
  .show {
    cursor: pointer;
    color: #ccc;
  }
  .show:hover {
    color: #aaa;
  }
  .not-allowed {
    cursor: not-allowed !important;
  }
  .center {
    width: calc(100% - 60px);
    height: 100%;
    overflow: hidden;
    position: relative;
    .content-box {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0px;
      top: 0px;
    }
    .content {
      // height: 100%;
      display: flex;
    }
    .item {
      width: 20%;
      height: 60px;
      // border: 1px solid $secondary-color;
      box-sizing: border-box;
      flex-shrink: 0;
    }
    .item-data {
      width: 60px;
      height: 60px;
      // border: 1px solid $secondary-color;
      border: 2px solid rgba(0, 0, 0, 0);
      background: white;
      box-sizing: border-box;
      margin: auto;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      img {
        height: 100%;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }
    .item-border {
      border: 2px solid $secondary-color;
    }
  }
}
</style>
