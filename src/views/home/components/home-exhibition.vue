<template>
  <div class="home-exhibition">
    <div class="exhibition-width">
      <div class="exhibition-left">
        <div class="left-list" v-for="list in pageEl.list" :key="list">
          <span v-for="item in list.nameList" :key="item">
            {{ item }}
          </span>
          <div class="left-cover">
            <div class="cover-content">
              <span @click="search(item)" v-for="item in list.data" :key="item">{{
                item
              }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="exhibition-center">
        <el-carousel height="500px">
          <el-carousel-item v-for="item in pageEl.fruitsList" :key="item">
            <div class="fruits">
              <img :src="item.url" @click="search(item.name)" />
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="exhibition-right">
        <div class="discount-list" v-for="item in pageEl.discountList" :key="item">
          <img :src="item.url" @click="search(item.name)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { uIndex, itemRandom } from "@/api/center";
import fruits1 from "@/assets/home/fruits-1.png";
import fruits2 from "@/assets/home/fruits-2.png";
import fruits3 from "@/assets/home/fruits-3.png";
import fruits4 from "@/assets/home/fruits-4.png";
import fruits5 from "@/assets/home/fruits-5.png";

import discount1 from "@/assets/home/discount-1.png";
import discount2 from "@/assets/home/discount-2.png";
import discount3 from "@/assets/home/discount-3.png";
import discount4 from "@/assets/home/discount-4.png";
import { base } from "@/utils/request";

let emit = defineEmits(["search"]);
let pageEl = reactive({
  list: [
    {
      nameList: ["春季水果"],
      data: ["苹果", "梨子", "香蕉", "菠萝"],
    },
    {
      nameList: ["夏季水果"],
      data: ["西瓜", "葡萄", "李子", "火龙果"],
    },
    {
      nameList: ["秋季水果"],
      data: [
        "鲜枣",
        "橘子",
        "山楂",
        "柿子",
        "桔子",
        "弥猴桃",
        "甘蔗",
        "柠檬",
        "柚子",
        "芒果",
      ],
    },
    {
      nameList: ["冬季水果"],
      data: ["山楂", "冬枣", "苹果", "石榴", "甘蔗", "橙子", "橘子", "青枣", "柚子"],
    },
    {
      nameList: ["云南特产"],
      data: [
        "华宁柑桔",
        "丽江雪桃",
        "华坪芒果",
        "昭通苹果",
        "保山甜柿",
        "屏边荔枝",
        "蒙自石榴",
      ],
    },
    {
      nameList: ["重庆特产"],
      data: [
        "白羊柠檬",
        "分水李子",
        "茅山贡桃",
        "玫瑰香橙",
        "万州猕猴桃",
        "万县红桔",
        "溪口杨梅",
        "金溪红心猕猴桃",
        "涪陵龙眼",
        "统景梨橙",
        "歪嘴李",
      ],
    },
    {
      nameList: ["长沙特产"],
      data: [
        "沙糖桔",
        "浏阳金桔",
        "天岩寨柑桔",
        "望城樱桃",
        "大围山梨",
        "望城提子",
        "沅江枇杷",
        "冰糖橙",
      ],
    },
    {
      nameList: ["贵州特产"],
      data: [
        "关岭山火龙果",
        "沿河沙子空心李",
        "修文猕猴桃",
        "开阳富硒枇杷",
        "湄潭无花果",
        "永乐艳红桃",
        "红岩葡萄",
        "台江金秋梨",
      ],
    },
    {
      nameList: ["河南特产"],
      data: [
        "汴梁西瓜",
        "孟津梨",
        "孟津葡萄",
        "郑州蜜桃",
        "灵宝苹果",
        "西峡猕猴桃",
        "宁陵酥梨",
      ],
    },
    {
      nameList: ["河北特产"],
      data: [
        "赞皇金丝大枣",
        "满城磨盘柿",
        "龙眼葡萄",
        "宣化牛奶葡萄",
        "魏县鸭梨",
        "深州蜜桃",
        "串枝红杏",
      ],
    },
    {
      nameList: ["热带水果"],
      data: [
        "菠萝蜜",
        "椰子",
        "柠檬",
        "百香果",
        "橄榄",
        "芒果",
        "木瓜",
        "枇杷",
        "火龙果",
        "释迦果",
        "芭蕉",
      ],
    },
    {
      nameList: ["雨林水果"],
      data: ["香蕉", "鳄梨", "芒果", "荔枝", "番石榴", "椰子"],
    },
    {
      nameList: ["新疆水果"],
      data: [
        "吐鲁番葡萄",
        "八角梨",
        "哈密瓜",
        "榅桲",
        "库尔勒香梨",
        "新疆大枣",
        "沙棘果",
        "轮台小白杏",
      ],
    },
    {
      nameList: ["进口水果"],
      data: ["车厘子", "牛油果", "泰国榴莲", "莲雾", "鸡蛋果", "椰青", "椰皇"],
    },
  ],
  fruitsList: [
    {
      name: "蓝莓",
      url: fruits1,
    },
    {
      name: "桃子",
      url: fruits2,
    },
    {
      name: "草莓",
      url: fruits3,
    },
    {
      name: "猕猴桃",
      url: fruits4,
    },
    {
      name: "石榴",
      url: fruits5,
    },
  ],
  discountList: [
    {
      name: "德庆皇帝柑",
      url: discount1,
    },
    {
      name: "脐橙",
      url: discount2,
    },
    {
      name: "雾莲果",
      url: discount3,
    },
    // {
    //   name: "优惠4",
    //   url: discount4,
    // },
  ],
});

//获取类目的数据
const getListData = () => {
  uIndex().then((res: any) => {
    if (res.code == "20000") {
      let data = res.data;
      pageEl.list = [];
      data.forEach((item: any, index: number) => {
        if (index <= 13) {
          let obj = {
            nameList: [item.father.name],
            data: [],
          };
          item.childrens.forEach((list: any) => {
            obj.data.push(list.name);
          });
          pageEl.list.push(obj);
        }
      });
    }
  });
};

//获取随机商品
const getDiscount = () => {
  itemRandom({}).then((res: any) => {
    if (res.code == 20000) {
      pageEl.discountList = [];
      res.data.forEach((item: any, index: number) => {
        if (index < 3) {
          let obj = {
            name: item.name,
            url: base + item.url1,
          };
          pageEl.discountList.push(obj);
        }
      });
    }
  });
};
//搜索
const search = (data: string) => {
  emit("search", data);
};

onMounted(() => {
  getListData();
  getDiscount();
});
</script>

<style lang="scss" scoped>
/* 1190 */
.home-exhibition {
  width: 100%;
  box-sizing: border-box;
  position: relative;
}
.exhibition-width {
  width: 1190px;
  height: 500px;
  margin: auto;
  display: flex;
  box-sizing: border-box;
}

.exhibition-left {
  width: 190px;
  height: 100%;
  margin-right: 10px;
  box-sizing: border-box;
  background: white;
  // padding: 10px 0;
  font-size: 15px;
  position: relative;
  padding-top: 5px;
  .left-list {
    padding: 7.5px 15px;
    cursor: pointer;
    // margin: 9px 0;
    text-align: center;
  }
  .left-list:hover {
    background: #ccc;
    .left-cover {
      display: block;
    }
  }
  .left-cover {
    position: absolute;
    left: 190px;
    top: 0px;
    width: 1000px;
    height: 100%;
    background: white;
    z-index: 10;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.3);
    display: none;
    .cover-content {
      width: 100%;
      height: 100%;
      text-align: left;
      padding: 20px;
      cursor: default;
      span {
        margin: 0 10px;
        cursor: pointer;
      }
      span:hover {
        color: red;
      }
    }
  }
}

.exhibition-center {
  width: calc(100% - 400px);
  height: 100%;
  background: white;
  .fruits {
    width: 100%;
    height: 100%;
    // background: red;
    img {
      width: 100%;
      height: 100%;
      cursor: pointer;
    }
  }
}

.exhibition-right {
  width: 190px;
  height: 100%;
  margin-left: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .discount-list {
    width: 100%;
    height: 160px;
    img {
      width: 100%;
      height: 100%;
      cursor: pointer;
    }
  }
}
</style>
