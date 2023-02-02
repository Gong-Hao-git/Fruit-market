<template>
  <div class="commodity-model">
    <div class="list-content" @click="getDetails(props.data)">
      <img class="list-img" :src="props.data.url1" />
      <div class="list-title" :title="props.data.title">
        {{ props.data.name }}
      </div>
      <div class="price">
        <div class="present-price">￥{{ getMoney() }}</div>
        <div class="original-price">
          ￥{{ props.data.price }}
          <div class="scribing"></div>
        </div>
      </div>
      <div class="monthly-sales">
        月售
        {{
          props.data.monthlySales >= 100
            ? props.data.monthlySales + "+"
            : props.data.monthlySales
        }}
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import modular1 from "@/assets/modular/modular-1/modular1-1.png";
import { base } from "@/utils/request";

let props = defineProps({
  data: {
    default: () => {
      return {
        name: "海南小台农芒果新鲜小台芒9斤现摘应当季水果热带芒果整箱10包邮",
        price: 19.8,
        zk: 7,
        monthlySales: 100,
        url1: modular1,
      };
    },
  },
});

let emit = defineEmits(["getDetails"]);

const getMoney = () => {
  let price = parseFloat(props.data.price as any);
  let zk = parseFloat(props.data.zk as any);
  let money = parseInt((price * zk * 10) as any);
  return money / 100;
};

const getDetails = (data: any) => {
  emit("getDetails", data);
};
</script>

<style lang="scss" scoped>
.commodity-model {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  // margin-bottom: 20px;
  position: relative;

  .list-content {
    width: 100%;
    height: 100%;
    background: white;
    box-sizing: border-box;
    cursor: pointer;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .list-content:hover {
    width: 110%;
    height: 105%;
    transition: 200ms;
  }
  .list-img {
    height: 50%;
    display: flex;
    margin: 30px auto;
  }
  .list-title {
    color: #999;
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden; //溢出内容隐藏
    text-overflow: ellipsis; //文本溢出部分用省略号表示
    display: -webkit-box; //特别显示模式
    -webkit-line-clamp: 2; //行数
    line-clamp: 2;
    -webkit-box-orient: vertical; //盒子中内容竖直排列
    padding: 0 20px;
    height: 42px;
  }
  .price {
    padding: 0 20px;
    margin-top: 10px;
    display: flex;
    align-items: flex-end;
    .present-price {
      color: red;
      font-size: 20px;
      margin-right: 10px;
    }
    .original-price {
      font-size: 16px;
      color: #999;
      position: relative;
      .scribing {
        height: 1px;
        width: 100%;
        background: #999;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }
  .monthly-sales {
    padding: 5px 20px 0;
    display: flex;
    justify-content: flex-end;
    color: #999;
    font-size: 14px;
  }
}
</style>
