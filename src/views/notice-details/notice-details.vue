<template>
  <div class="notice-details">
    <div class="content">
      <page-header :title="'公告详情'" :returnPath="'/system-notice'" />
      <div class="main">
        <div class="title" v-if="pageEl.table && pageEl.table.name">
          {{ pageEl.table.name }}
        </div>
        <div class="time" v-if="pageEl.table && pageEl.table.createTime">
          {{ pageEl.table.createTime }}
        </div>
        <div
          class="details-content"
          v-if="pageEl.table && pageEl.table.content"
          v-html="pageEl.table.content"
        >
        </div>
      </div>
    </div>
    <page-bottom />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import PageHeader from "@/components/page-header/page-header.vue";
import PageBottom from "@/components/page-bottom/page-bottom.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { noticeDetails } from "@/api/backstage";
import { useRoute } from "vue-router";

let route = useRoute();

let pageEl = reactive({
  table: {
    name: "公告1",
    createTime: "2022-09-06 10:00:00",
    content: `8月24日是乌克兰独立日，也是俄开始“特别军事行动”整半年。
    乌方举行了较大规模的庆祝活动，在首都主要街道上高调“展览”了被摧毁/缴获的俄罗斯武器装备。
    占据战场优势的俄军对此反应不大，其在24日发布的当日战报毫无特殊之处，
    仅例行性地宣布击毙击伤乌军四个旅上千名官兵，摧毁数十台/套武器装备，命中十多
    个小型指挥所、弹药库、后勤仓库等固定目标。值得注意的是被大量杀伤的第68猎兵旅、
    第66机械化旅都是乌军在战后新组建的部队，第56摩步旅在开战初期被整建制击溃过；
    第93机械化旅、第35海军陆战旅也是经历大量减员后被迫重建。`,
  },
});

//获取数据
const getData = () => {
  let id = route.query.id;
  if (id) {
    let obj = {
      id,
    };
    noticeDetails(obj).then((res: any) => {
      if (res.code == "20000") {
        let data = res.data;
        pageEl.table = data;
      }
    });
  }
};

onMounted(() => {
  getData();
});
</script>

<style lang="scss" scoped>
.notice-details {
  background: #f4f4f4;
  height: 100vh;
  overflow: auto;
  overflow-y: visible;
}
.content {
  min-height: calc(100vh - 150px);
  box-sizing: border-box;
  padding-bottom: 20px;
}
.main {
  width: 1190px;
  margin: 20px auto 0px;
  background: white;
  min-height: calc(100vh - 370px);
  padding: 20px 40px 40px 40px;
  box-sizing: border-box;
}
.title {
  display: flex;
  justify-content: center;
  font-size: 25px;
  // padding: 20px 0;
  margin-bottom: 10px;
  font-weight: bold;
}
.time {
  display: flex;
  justify-content: center;
  font-size: 18px;
  color: #999;
}
.details-content {
  width: 100%;
  // border-top: none;
  // padding-bottom: 50px;
  box-sizing: border-box;
  margin-top: 20px;
  font-size: 20px;
}
</style>
