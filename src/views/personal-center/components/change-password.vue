<template>
  <div class="change-password">
    <div class="title">修改密码</div>
    <div class="content">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="80px"
        class="form"
      >
        <el-form-item label="当前密码" prop="currentPassword">
          <el-input
            v-model="formData.currentPassword"
            placeholder="请输入密码"
            clearable
            type="password"
          />
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input
            v-model="formData.password"
            placeholder="请输入密码"
            clearable
            type="password"
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="formData.confirmPassword"
            placeholder="请输入密码"
            clearable
            type="password"
          />
        </el-form-item>
        <div class="bottom">
          <el-button type="primary" @click="submit" v-loading="pageEl.loading">
            保存
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { modifyPassword } from "@/api/backstage";
import { useRouter } from "vue-router";

let router = useRouter();
let pageEl = reactive({
  loading: false,
  userData: null as any,
});
let formRef = ref();
let formData = reactive({
  currentPassword: "",
  password: "",
  confirmPassword: "",
});

let validateName = (rule: any, value: any, callback: any) => {
  let newsValue = value.trim();
  if (newsValue.length <= 0) {
    callback(new Error("内容不能为空"));
  } else {
    callback();
  }
};

let validatePassword = (rule: any, value: any, callback: any) => {
  let newValue = /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/g.test(value);
  if (value.length > 16) {
    callback(new Error("密码不能超过16位"));
    return;
  }
  if (value.length < 6) {
    callback(new Error("密码不能少于6位"));
    return;
  }
  if (newValue) {
    callback(new Error("密码不能包含中文"));
    return;
  }
  if (/\s/g.test(value)) {
    callback(new Error("密码不能包含空格"));
    return;
  }
  callback();
};

let validateConfirmPassword = (rule: any, value: any, callback: any) => {
  if (value.length > 16) {
    callback(new Error("密码不能超过16位"));
    return;
  }
  if (value.length < 6) {
    callback(new Error("密码不能少于6位"));
    return;
  }
  if (value != formData.password) {
    callback(new Error("确认密码和新密码不一致"));
    return;
  }
  callback();
};

let formRules = reactive({
  currentPassword: [
    { required: true, message: "内容不能为空", trigger: "blur" },
    { required: true, validator: validatePassword, trigger: "blur" },
  ],
  password: [
    { required: true, message: "内容不能为空", trigger: "blur" },
    { required: true, validator: validatePassword, trigger: "blur" },
  ],
  confirmPassword: [
    { required: true, message: "内容不能为空", trigger: "blur" },
    { required: true, validator: validateConfirmPassword, trigger: "blur" },
  ],
});

const submit = () => {
  formRef.value.validate((valid: boolean) => {
    if (valid) {
      let obj: any = {
        passWord: formData.currentPassword,
        newPassword: formData.password,
        userName: pageEl.userData.userName,
      };
      let func = modifyPassword;
      let name = "修改密码成功，请重新登录！";
      pageEl.loading = true;
      func(obj)
        .then((res: any) => {
          pageEl.loading = false;
          if (res.code == "20000") {
            ElMessage.success(name);
            router.push("/login");
          }
        })
        .catch((err) => {
          pageEl.loading = false;
        });
    }
  });
};

onMounted(() => {
  let data: any = JSON.parse(localStorage.getItem("userData"));
  if(!data)return;
  pageEl.userData = data;
});
</script>

<style lang="scss" scoped>
.change-password {
  width: 100%;
  border: 1px solid #ddd;
}
.title {
  height: 50px;
  font-size: 20px;
  font-weight: bold;
  color: #666;
  padding-left: 30px;
  display: flex;
  align-items: center;
  background: rgb(247, 247, 247);
  border-bottom: 1px solid #ddd;
}
.content {
  background: white;
  padding: 40px 20px 40px 20px;
}
.form {
  width: 300px;
  .bottom {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 40px;
  }
}
</style>
