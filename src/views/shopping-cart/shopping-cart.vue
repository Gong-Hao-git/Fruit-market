<template>
  <div class="shopping-cart">
    <div class="shopping-cart-content">
      <page-header />
      <div class="main">
        <div class="title">
          全部商品
          <span>({{ pageEl.table.length }})</span>
        </div>
        <div class="details-title">商品详情</div>
        <div class="details-content">
          <div v-if="pageEl.table.length > 0" class="details-header">
            <div class="list-index"></div>
            <div class="list-name">商品</div>
            <div class="list-item">价格</div>
            <div class="list-item">数量</div>
            <div class="list-item">小计</div>
            <div class="list-item">操作</div>
          </div>
          <div class="list" v-for="(list, index) in pageEl.table" :key="list">
            <div class="list-index">
              <el-checkbox v-model="list.selectBool" @change="change"></el-checkbox>
            </div>
            <div class="list-name-content">
              <div class="list-img">
                <img :src="base + list.item.url1" />
              </div>
              <div class="list-text">
                {{ list.item.name }}
              </div>
            </div>
            <div class="list-item">￥{{ list.price }}</div>
            <div class="list-item">
              <el-input-number
                v-model="list.num"
                @change="setNum(list)"
                :min="1"
                :disabled="!pageEl.numBool"
              ></el-input-number>
            </div>
            <div class="list-item color-red">
              ￥{{ parseFloat(list.price) * parseFloat(list.num) }}
            </div>
            <div class="list-item center">
              <div class="center list-operation" @click="deleteClick(list)">
                <img class="delete" src="@/assets/shopping-cart/delete.png" />
                <span>删除</span>
              </div>
            </div>
          </div>
          <el-empty v-if="pageEl.table.length == 0" description="购物车为空" />
        </div>
        <div class="details-control">
          <div class="control-select">
            <!-- :indeterminate="true" -->
            <el-checkbox
              :indeterminate="
                pageEl.selectLength != 0 && pageEl.selectLength != pageEl.table.length
              "
              v-model="pageEl.selectAll"
              @change="changeAll"
              >全选</el-checkbox
            >
          </div>
          <div class="control-delete">
            <span
              @click="deleteSelect"
              :class="pageEl.selectLength > 0 ? 'color-red' : ''"
              >删除</span
            >
          </div>
          <div class="control-flex">
            <span>已选商品(</span>
            <span class="color-red">{{ pageEl.selectLength }}</span>
            <span>)件</span>
          </div>
          <div class="control-total">
            <span>合计(不含运费):￥</span>
            <span class="color-red">{{ pageEl.moneyAll }}</span>
          </div>
          <div class="control-button" @click="setBuy">购买</div>
        </div>
      </div>
    </div>
    <page-bottom />
    <buy-dialog ref="buyRef" @refresh="refresh" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import PageHeader from "@/components/page-header/page-header.vue";
import img1 from "@/assets/shopping-cart/shopping-cart-1.png";
import img2 from "@/assets/shopping-cart/shopping-cart-2.png";
import PageBottom from "@/components/page-bottom/page-bottom.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { shoppingDelete, shoppingPage, shoppingModify } from "@/api/backstage";
import buyDialog from "@/components/buy-dialog/buy-dialog.vue";
import { base } from "@/utils/request";

let buyRef = ref();
let pageEl = reactive({
  table: [
    // {
    //   id: 1,
    //   selectBool: false,
    //   src: img1,
    //   name: "重庆渝北大苹果",
    //   price: 23.0,
    //   num: 1,
    //   item: {},
    // },
    // {
    //   id: 2,
    //   selectBool: false,
    //   src: img2,
    //   name: "云南特产玛瑙草莓",
    //   price: 43.0,
    //   num: 1,
    //   item: {},
    // },
  ],
  userData: null as any,
  selectAll: false,
  selectLength: 0,
  moneyAll: 0,
  numBool: true,
});

//获取数据
const getData = (list?: any, numBool?: boolean) => {
  let obj = {
    pageNum: 1,
    pageSize: 1000,
    userId: pageEl.userData.id,
  };
  shoppingPage(obj).then((res: any) => {
    if (res.code == 20000) {
      let data = res.data;
      // pageEl.table = data.datas;
      pageEl.table = data.datas.map((item: any) => {
        item.selectBool = false;
        if (list) {
          list.forEach((id: string) => {
            if (id == item.id) {
              item.selectBool = true;
            }
          });
        }
        return item;
      });
      if (numBool == true) {
        pageEl.numBool = true;
      }
      change();
    }
  });
};

//打开购买商品弹窗
const setBuy = () => {
  let list = [];
  pageEl.table.forEach((item: any) => {
    if (item.selectBool == true) {
      let obj = {
        itemId: item.item.id,
        num: item.num,
        price: item.price,
        total: parseFloat(item.price) * parseFloat(item.num),
      };
      list.push(obj);
    }
  });
  if (list.length < 1) {
    ElMessage.warning("请选择要购买的商品!");
    return;
  }
  buyRef.value.setDialog(true, list, pageEl.userData.address, pageEl.userData.id);
};

//购买成功后，把购物车里面已经购买的商品清理掉
const refresh = (data: any) => {
  let idList = [];
  // data.forEach((item: any) => {
  //   idList.push(item.id);
  // });
  // let obj = {
  //   id: idList,
  // };
  pageEl.table.forEach((item: any) => {
    if (item.selectBool == true) {
      idList.push({ id: item.id });
    }
  });
  shoppingDelete(idList).then((res: any) => {
    if (res.code == 20000) {
      getData();
    }
  });
};

//修改商品的数量
const setNum = (data: any) => {
  let list = [];
  pageEl.table.forEach((item: any) => {
    if (item.selectBool == true) {
      list.push(item.id);
    }
  });
  let obj = {
    id: data.id,
    num: data.num,
    price: data.price,
  };
  pageEl.numBool = false;
  shoppingModify(obj)
    .then((res: any) => {
      getData(list, true);
      // if (res.code == 20000) {
      //   getData(list, true);
      // }
    })
    .catch((err) => {
      getData(list, true);
    });
};

//删除
const deleteClick = (data: any) => {
  let list = [];
  pageEl.table.forEach((item: any) => {
    if (item.selectBool == true && item.id != data.id) {
      list.push(item.id);
    }
  });
  ElMessageBox.confirm("确定删除此商品?", "提示", {
    confirmButtonText: "确 定",
    cancelButtonText: "取 消",
    type: "warning",
  }).then(() => {
    // let obj = {
    //   id: [data.id],
    // };
    let obj = [{ id: data.id }];
    shoppingDelete(obj).then((res: any) => {
      if (res.code == 20000) {
        ElMessage.success("删除成功");
        getData(list);
        // pageEl.table.splice(index, 1);
        // change();
      }
    });
  });
};

//计算选中的数据和钱
const change = () => {
  let num = 0;
  let moneyAll = 0;
  pageEl.table.forEach((item: any) => {
    if (item.selectBool == true) {
      num++;
      moneyAll = moneyAll + item.price * item.num;
    }
  });
  pageEl.selectLength = num;
  pageEl.moneyAll = moneyAll;
  if (num == pageEl.table.length) {
    pageEl.selectAll = true;
  } else {
    pageEl.selectAll = false;
  }
  if (num == 0) {
    pageEl.selectAll = false;
  }
};

//删除选中的数据
const deleteSelect = () => {
  let idList = [];
  pageEl.table.forEach((item: any) => {
    if (item.selectBool == true) {
      idList.push({ id: item.id });
    }
  });
  if (idList.length < 1) {
    ElMessage.warning("请选择要删除的商品");
    return;
  }
  ElMessageBox.confirm("确定删除选中的商品?", "提示", {
    confirmButtonText: "确 定",
    cancelButtonText: "取 消",
    type: "warning",
  }).then(() => {
    // let obj = {
    //   id: idList,
    // };
    deleteInterface(idList);
    // let obj = idList;
    // shoppingDelete(obj).then((res: any) => {
    //   if (res.code == 20000) {
    //     ElMessage.success("删除成功");
    //     getData();
    //     // ElMessage.success("删除成功");
    //     // pageEl.table = pageEl.table.filter((item: any) => {
    //     //   return item.selectAll == false;
    //     // });
    //     // change();
    //   }
    // });
  });
};

//批量删除商品的接口
const deleteInterface = (list: any) => {
  let obj = list;
  shoppingDelete(obj).then((res: any) => {
    if (res.code == 20000) {
      ElMessage.success("删除成功");
      getData();
    }
  });
};

//全选
const changeAll = () => {
  pageEl.table = pageEl.table.map((item: any) => {
    item.selectBool = pageEl.selectAll;
    return item;
  });
  change();
};

onMounted(() => {
  let data: any = JSON.parse(localStorage.getItem("userData"));
  if (data) {
    pageEl.userData = data;
  }
  getData();
});
</script>

<style lang="scss" scoped>
.shopping-cart {
  background: #f4f4f4;
  height: 100vh;
  overflow: auto;
  overflow-y: visible;
}
.shopping-cart-content {
  min-height: calc(100vh - 150px);
}
.main {
  width: 1190px;
  margin: 20px auto 0;
  // background: white;
}
.title {
  display: flex;
  justify-content: center;
  font-size: 22px;
  padding: 20px 0;
  margin-bottom: 10px;
  font-weight: bold;
  span {
    color: red;
  }
}
.details-title {
  width: 100%;
  border: 1px solid #ccc;
  background: #eee;
  padding: 10px 20px;
  box-sizing: border-box;
  font-size: 18px;
  font-weight: bold;
}
.details-content {
  width: 100%;
  border: 1px solid #ccc;
  border-top: none;
  // padding-bottom: 50px;
  box-sizing: border-box;
}
.details-header {
  display: flex;
  border-bottom: 1px solid #ccc;
  padding: 15px 0px;
}
.list-item {
  text-align: center;
  width: 200px;
}
.list-index {
  text-align: center;
  width: 90px;
}
.list-name {
  text-align: center;
  width: 300px;
}
.list {
  display: flex;
  border-bottom: 1px solid #ccc;
  padding: 15px 0px;
  align-items: center;
}
.list:hover {
  background: #eee;
}
.list-name-content {
  width: 300px;
  display: flex;
  align-items: center;
  .list-img {
    width: 100px;
    height: 100px;
    position: relative;
    border: 1px solid #999;
    box-sizing: border-box;
    margin-right: 20px;
    overflow: hidden;
    border-radius: 3px;
    img {
      height: 100%;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .list-text {
    width: 180px;
    overflow: hidden;
  }
}
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.list-operation {
  color: red;
  cursor: pointer;
  width: 60px;
}
.delete {
  height: 20px;
}
.color-red {
  color: red;
}
.cursor {
  cursor: pointer;
}

.details-control {
  height: 70px;
  width: 100%;
  background: #eee;
  border: 1px solid #ccc;
  margin: 20px 0 40px;
  display: flex;
  .control-select {
    width: 120px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .control-delete {
    display: flex;
    justify-content: center;
    align-items: center;
    span {
      cursor: pointer;
    }
  }
  .control-flex {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 0 20px;
  }
  .control-total {
    padding: 0 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .control-button {
    width: 100px;
    height: 100%;
    background: red;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    margin-left: 20px;
  }
}
</style>
