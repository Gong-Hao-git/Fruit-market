<template>
  <div class="buy-dialog">
    <el-dialog
      v-model="pageEl.dialogVisible"
      :title="pageEl.title"
      width="500px"
      destroy-on-close
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="80px">
        <el-form-item label="收货地址" prop="address">
          <el-input
            v-model="formData.address"
            placeholder="请输入收货地址"
            clearable
            maxlength="50"
          />
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
import { orderAdd } from "@/api/backstage";

let emit = defineEmits(["refresh"]);
let formRef = ref();
let pageEl = reactive({
  dialogVisible: false,
  title: "确认购买",
  loading: false,
  data: [],
});

const setDialog = (bool: boolean, data: any, address: string, userId: any) => {
  pageEl.dialogVisible = bool;
  pageEl.data = data;
  formData.address = address;
  formData.userId = userId;
};

let formData = reactive({
  address: "",
  userId: "",
});

let validateName = (rule: any, value: any, callback: any) => {
  let newsValue = value.trim();
  if (newsValue.length <= 0) {
    callback(new Error("内容不能为空"));
  } else {
    callback();
  }
};

let formRules = reactive({
  address: [
    { required: true, message: "地址不能为空", trigger: "blur" },
    { required: true, validator: validateName, trigger: "blur" },
  ],
});

const submit = () => {
  formRef.value.validate((valid: boolean) => {
    if (valid) {
      let obj: any = {
        ...formData,
        list: pageEl.data,
      };
      let func = orderAdd;
      let name = "购买成功";
      pageEl.loading = true;
      func(obj)
        .then((res: any) => {
          pageEl.loading = false;
          if (res.code == "20000") {
            ElMessage.success(name);
            pageEl.dialogVisible = false;
            emit("refresh", pageEl.data);
          }
        })
        .catch((err) => {
          pageEl.loading = false;
        });
    }
  });
};

defineExpose({
  setDialog,
});
</script>

<style lang="scss" scoped>
.buy-dialog {
}
</style>
