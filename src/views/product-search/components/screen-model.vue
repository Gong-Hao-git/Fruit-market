<template>
  <div class="screen-model">
    <div class="left">
      <div class="screen-left">
        <div
          class="screen-list"
          :class="{ show: pageEl.screenShow == list.id }"
          v-for="list in pageEl.screenList"
          :key="list"
          @click="searchField(list)"
        >
          <div class="screen-border"></div>
          <div class="screen-text" v-if="list.type == 'text'">
            <div class="text-left">{{ list.name }}</div>
            <div class="text-right">
              <i class="iconfont icon-shuzhixiajiang icon"></i>
            </div>
          </div>
          <div class="screen-text" v-if="list.type == 'many'">
            <div class="text-left">{{ list.name }}</div>
            <div class="text-right">
              <div
                class="top"
                :class="{
                  'top-border': pageEl.priceShow == 2 && pageEl.screenShow == 5,
                }"
              ></div>
              <div
                class="bottom"
                :class="{
                  'bottom-border': pageEl.priceShow == 1 && pageEl.screenShow == 5,
                }"
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div class="screen-right">
        <div class="screen-right-content">
          <div class="screen-right-input">
            <el-input
              v-model="pageEl.minMoney"
              class="input"
              placeholder="￥"
              clearable
              oninput="value=value.replace(/[^\d]/g,'')"
            ></el-input>
            <div class="screen-division"></div>
            <el-input
              v-model="pageEl.maxMoney"
              class="input"
              placeholder="￥"
              clearable
              oninput="value=value.replace(/[^\d]/g,'')"
            ></el-input>
          </div>
          <div class="screen-right-hover">
            <div class="screen-right-button">
              <el-button size="small" @click="moneyClear">清空</el-button>
              <el-button size="small" @click="moneyConfirm" type="primary"
                >确定</el-button
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="right-model">
        共
        <span class="right-black">{{ props.pageData.total }}</span>
        件商品
      </div>
      <div class="right-model">
        <span class="right-red">{{ props.pageData.pageNum }}</span>
        /
        {{ calculationPage() }}
      </div>
      <div class="right-model">
        <div
          class="forward"
          :class="{ 'forward-background': props.pageData.pageNum != 1 }"
          @click="setPageNum(-1)"
        >
          <i class="iconfont icon-xiangzuo1"></i>
        </div>
        <div
          class="backward"
          :class="{
            'forward-background': props.pageData.pageNum != calculationPage(),
          }"
          @click="setPageNum(1)"
        >
          <i class="iconfont icon-xiangzuo1"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";

let props = defineProps({
  pageData: {
    default: () => {
      return {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      };
    },
  },
});

let emit = defineEmits(["setParams", "setPageNum"]);
let pageEl = reactive({
  screenList: [
    {
      name: "综合",
      field: "all",
      type: "text",
      id: 1,
    },
    {
      name: "销量",
      field: "sales",
      type: "text",
      id: 2,
    },
    // {
    //   name: "评论数",
    //   field: "comment",
    //   type: "text",
    //   id: 3,
    // },
    // {
    //   name: "新品",
    //   field: "new",
    //   type: "text",
    //   id: 4,
    // },
    {
      name: "价格",
      field: "price",
      type: "many",
      id: 5,
      select: [
        {
          value: 1,
        },
        {
          value: 2,
        },
      ],
    },
  ],
  screenShow: 1,
  priceShow: 1,
  screenField: "all",
  minMoney: null,
  maxMoney: null,
});

let params = reactive({
  minMoney: null,
  maxMoney: null,
});

//更换排序字段
const searchField = (item: any) => {
  if (item.id != 5) {
    if (item.id == pageEl.screenShow) {
      return;
    }
  }
  if (item.id == 5) {
    if (pageEl.screenShow == 5) {
      if (pageEl.priceShow == 1) {
        pageEl.priceShow = 2;
      } else {
        pageEl.priceShow = 1;
      }
    } else {
      pageEl.priceShow = 1;
    }
  }
  pageEl.screenShow = item.id;
  pageEl.screenField = item.field;
  setData();
};

//清空价格输入框
const moneyClear = () => {
  pageEl.minMoney = null;
  pageEl.maxMoney = null;
  params.minMoney = null;
  params.maxMoney = null;
  setData();
};

//价格输入框确认
const moneyConfirm = () => {
  let minMoney = parseFloat(pageEl.minMoney);
  let maxMoney = parseFloat(pageEl.maxMoney);
  if (minMoney > maxMoney) {
    let money = minMoney;
    pageEl.minMoney = maxMoney;
    pageEl.maxMoney = money;
  }
  params.minMoney = parseFloat(pageEl.minMoney);
  params.maxMoney = parseFloat(pageEl.maxMoney);
  setData();
};

//把需要搜索的数据返回出去
const setData = () => {
  let obj: any = {
    screenField: pageEl.screenField,
  };
  if (pageEl.screenField == "price") {
    obj.sort = pageEl.priceShow;
  }
  if (params.minMoney) {
    obj.minMoney = params.minMoney;
  }
  if (params.minMoney) {
    obj.maxMoney = params.maxMoney;
  }
  emit("setParams", obj);
};

//计算页数
const calculationPage = () => {
  let total = props.pageData.total;
  let pageSize = props.pageData.pageSize;
  if (total == 0) return 1;
  let num = parseInt((total / pageSize) as any);
  let surplus = total % pageSize;
  if (num == 0) return 1;
  if (surplus > 0) return num + 1;
  return num;
};

//翻页
const setPageNum = (val: number) => {
  let num = calculationPage();
  let pageNum = props.pageData.pageNum;
  if (val > 0) {
    if (pageNum == num) return;
    emit("setPageNum", pageNum + 1);
    return;
  }
  if (val < 0) {
    if (pageNum == 1) return;
    emit("setPageNum", pageNum - 1);
    return;
  }
};

//重置
const reset = () => {
  pageEl.screenShow = 1;
  pageEl.priceShow = 1;
  pageEl.screenField = "all";
  pageEl.minMoney = null;
  pageEl.maxMoney = null;
  params.minMoney = null;
  params.maxMoney = null;
};

defineExpose({
  reset,
});
</script>

<style lang="scss" scoped>
.screen-model {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  background: white;
  border: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  .left {
    display: flex;
  }
  .screen-left {
    display: flex;
    font-size: 14px;
    .screen-list {
      border: 1px solid #999;
      // border-left: none;
      border-right: none;
      // padding: 2px 8px;
      cursor: pointer;
      position: relative;
      box-sizing: border-box;
      color: #666;
      .screen-border {
        position: absolute;
        border: 1px solid $secondary-color;
        width: 100%;
        height: 100%;
        top: -1px;
        left: -1px;
        display: none;
        z-index: 1;
      }
      .screen-text {
        padding: 4px 8px;
        display: flex;
        align-items: center;
      }
      .top {
        border-top: 4px solid rgba(0, 0, 0, 0);
        border-bottom: 4px solid rgba(0, 0, 0, 1);
        border-left: 4px solid rgba(0, 0, 0, 0);
        border-right: 4px solid rgba(0, 0, 0, 0);
        margin: 0 0 2px 5px;
      }
      .bottom {
        border-top: 4px solid rgba(0, 0, 0, 1);
        border-bottom: 4px solid rgba(0, 0, 0, 0);
        border-left: 4px solid rgba(0, 0, 0, 0);
        border-right: 4px solid rgba(0, 0, 0, 0);
        margin: 2px 0 0 5px;
      }
    }
    .screen-list:last-child {
      border: 1px solid #999;
    }
    .screen-list:hover {
      .screen-border {
        display: block;
      }
    }
    .show {
      border: 1px solid $secondary-color;
      background: red;
      color: white;
      .screen-border {
        display: block;
      }
      .top {
        border-bottom: 4px solid rgba(255, 255, 255, 1);
      }
      .bottom {
        border-top: 4px solid rgba(255, 255, 255, 1);
      }
      .top-border {
        border-bottom: 4px solid rgba(255, 255, 255, 0.6);
      }
      .bottom-border {
        border-top: 4px solid rgba(255, 255, 255, 0.6);
      }
    }
  }
  .screen-right {
    // display: flex;
    // align-items: center;
    margin-left: 20px;
    position: relative;
    .screen-right-content {
      position: absolute;
      top: -20px;
      .screen-right-input {
        margin: 20px;
        display: flex;
        align-items: center;
        position: relative;
        z-index: 1;
        .input {
          width: 80px;
        }
        .screen-division {
          width: 5px;
          height: 1px;
          background: #aaa;
          margin: 0 5px;
        }
      }
      .screen-right-hover {
        display: none;
        position: absolute;
        top: 0px;
        left: 0px;
        width: 214px;
        height: 100px;
        border: 1px solid #999;
        background: white;
        box-sizing: border-box;
        padding: 10px 20px;
      }
      .screen-right-button {
        display: flex;
        width: 100%;
        height: 100%;
        justify-content: space-between;
        align-items: flex-end;
      }
    }
    .screen-right-content:hover {
      .screen-right-hover {
        display: block;
      }
    }
  }
  .right {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    color: #777;
    .right-black {
      color: #333;
    }
    .right-red {
      color: $secondary-color;
    }
    .right-model {
      margin-left: 20px;
      display: flex;
    }
    .forward {
      width: 50px;
      height: 27px;
      border: 1px solid #ccc;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 18px;
      background: #f1f1f1;
      color: #aaa;
    }
    .backward {
      width: 50px;
      height: 27px;
      border: 1px solid #ccc;
      border-right: none;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 18px;
      transform: rotate(180deg);
      background: #f1f1f1;
      color: #aaa;
    }
    .forward-background {
      background: white;
      cursor: pointer;
    }
  }
}
</style>
