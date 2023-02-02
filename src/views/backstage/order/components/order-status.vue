<template>
  <div class="order-status">
    <el-dialog
      v-model="pageEl.dialogVisible"
      :title="pageEl.title"
      width="380px"
      destroy-on-close
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="70px">
        <el-form-item label="订单状态">
          <el-select v-model="formData.status" placeholder="请选择订单状态">
            <el-option
              v-for="list in pageEl.statusList"
              :key="list.id"
              :label="list.name"
              :value="list.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="pageEl.dialogVisible = false">取 消</el-button>
          <el-button type="primary" :loading="pageEl.loading" @click="submit">
            确 定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { orderStatus } from "@/api/backstage";

let emit = defineEmits(["refresh"]);
let formRef = ref();
let pageEl = reactive({
  dialogVisible: false,
  title: "修改状态",
  loading: false,
  id: "",
  statusList: [
    {
      id: 0,
      name: "待发货",
    },
    {
      id: 1,
      name: "待收货",
    },
    {
      id: 2,
      name: "已收货",
    },
    {
      id: 3,
      name: "已取消",
    },
  ],
});

const setDialog = (bool: boolean, id: string, status: any) => {
  pageEl.dialogVisible = bool;
  pageEl.id = id;
  formData.status = status;
};

let formData = reactive({
  status: "",
});

let formRules = reactive({});

const submit = () => {
  let obj: any = {
    id: pageEl.id,
    status: formData.status,
  };
  let func = orderStatus;
  let name = "修改状态成功";
  pageEl.loading = true;
  func(obj)
    .then((res: any) => {
      pageEl.loading = false;
      if (res.code == "20000") {
        ElMessage.success(name);
        pageEl.dialogVisible = false;
        emit("refresh");
      }
    })
    .catch((err) => {
      pageEl.loading = false;
    });
};

defineExpose({
  setDialog,
});
</script>

<style lang="scss" scoped>
.order-status {
}
</style>
