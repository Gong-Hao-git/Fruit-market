<template>
  <div class="user-add">
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
        <el-form-item label="用户名" prop="userName">
          <el-input
            v-model="formData.userName"
            placeholder="请输入用户名"
            :disabled="pageEl.title != '新增'"
            clearable
          />
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName">
          <el-input
            v-model="formData.realName"
            placeholder="请输入真实姓名"
            clearable
            maxlength="20"
          />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="formData.sex">
            <el-radio label="男" />
            <el-radio label="女" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input
            v-model="formData.phone"
            placeholder="请输入手机号"
            clearable
          />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="formData.email"
            placeholder="请输入邮箱"
            clearable
            maxlength="30"
          />
        </el-form-item>
        <el-form-item label="密码" prop="passWord">
          <el-input
            v-model="formData.passWord"
            placeholder="请输入密码"
            clearable
            type="password"
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
import { userDetails, userAdd, userModify } from "@/api/backstage";

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
    userDetails(obj).then((res: any) => {
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
  userName: "",
  passWord: "",
  phone: "",
  realName: "",
  sex: "",
  email: "",
});

let validateName = (rule: any, value: any, callback: any) => {
  let newValue = /^[\da-z]+$/i.test(value);
  if (value.length > 16) {
    callback(new Error("账号不能超过16位"));
  }
  if (value.length < 3) {
    callback(new Error("账号不能少于3位"));
  }
  if (newValue) {
    callback();
  } else {
    callback(new Error("账号只能为数字和字母"));
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

let validatePhone = (rule: any, value: any, callback: any) => {
  let tf = /^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/.test(
    value
  );
  if (value.length < 1) {
    callback();
    return;
  }
  if (tf) {
    callback();
  } else {
    callback(new Error("手机号码格式不对"));
  }
};

let formRules = reactive({
  userName: [
    { required: true, message: "用户名不能为空", trigger: "blur" },
    { required: true, validator: validateName, trigger: "blur" },
  ],
  passWord: [
    { required: true, message: "密码不能为空", trigger: "blur" },
    { required: true, validator: validatePassword, trigger: "blur" },
  ],
  phone: [{ validator: validatePhone, trigger: "blur" }],
});

const submit = () => {
  formRef.value.validate((valid: boolean) => {
    if (valid) {
      let obj: any = {
        ...formData,
      };
      let func = userAdd;
      let name = "新增成功";
      if (pageEl.title != "新增") {
        obj.id = pageEl.id;
        func = userModify;
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
.user-add {
}
</style>
