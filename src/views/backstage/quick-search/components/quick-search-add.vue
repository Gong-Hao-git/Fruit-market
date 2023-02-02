<template>
  <div class="quick-search-add">
    <el-dialog
      v-model="pageEl.dialogVisible"
      :title="pageEl.title"
      width="500px"
      destroy-on-close
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="关键词名称" prop="name">
          <el-input
            v-model="formData.name"
            placeholder="请输入关键词名称"
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
import { quickDetails, quickAdd, quickModify } from "@/api/backstage";

let emit = defineEmits(["refresh"]);
let formRef = ref();
let pageEl = reactive({
  dialogVisible: false,
  title: "新增",
  loading: false,
  id: "",
});

const setDialog = (bool: boolean, id?: string) => {
  pageEl.dialogVisible = bool;
  if (id) {
    pageEl.title = "修改";
    pageEl.id = id;
    let obj = {
      id,
    };
    quickDetails(obj).then((res: any) => {
      if (res.code == "20000") {
        let data = res.data;
        for (let key in formData) {
          formData[key] = data[key];
        }
      }
    });
  } else {
    pageEl.title = "新增";
    for (let key in formData) {
      formData[key] = "";
    }
  }
};

let formData = reactive({
  name: "",
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
  name: [
    { required: true, message: "内容不能为空", trigger: "blur" },
    { required: true, validator: validateName, trigger: "blur" },
  ],
});

const submit = () => {
  formRef.value.validate((valid: boolean) => {
    if (valid) {
      let obj: any = {
        ...formData,
      };
      let func = quickAdd;
      let name = "新增成功";
      if (pageEl.title != "新增") {
        obj.id = pageEl.id;
        func = quickModify;
        name = "修改成功";
      }
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
    }
  });
};

defineExpose({
  setDialog,
});
</script>

<style lang="scss" scoped>
.quick-search-add {
}
</style>
