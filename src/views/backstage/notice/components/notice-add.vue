<template>
  <div class="notice-add">
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
        label-width="80px"
      >
        <el-form-item label="公告标题" prop="name">
          <el-input
            v-model="formData.name"
            placeholder="请输入公告标题"
            clearable
            maxlength="50"
          />
        </el-form-item>
        <el-form-item label="公告内容" prop="content">
          <el-input
            v-model="formData.content"
            placeholder="请输入公告内容"
            :rows="4"
            type="textarea"
            clearable
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
import { noticeDetails, noticeAdd, noticeModify } from "@/api/backstage";

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
    noticeDetails(obj).then((res: any) => {
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
  content: "",
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
  content: [
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
      let func = noticeAdd;
      let name = "新增成功";
      if (pageEl.title != "新增") {
        obj.id = pageEl.id;
        func = noticeModify;
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
.notice-add {
}
</style>
