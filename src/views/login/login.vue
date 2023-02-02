<template>
  <div class="login">
    <div class="login-background">
      <img class="img" src="@/assets/login/login.png" />
    </div>
    <div class="login-content">
      <div v-if="pageEl.status == 1" class="title">用户登录</div>
      <div v-if="pageEl.status == 2" class="title">用户注册</div>
      <div class="form">
        <el-form
          ref="formRef"
          :model="form"
          :rules="formRules"
          label-width="60px"
        >
          <el-form-item
            v-if="pageEl.status == 1"
            label="账号:"
            class="item"
            prop="name"
          >
            <el-input
              size="large"
              v-model="form.name"
              placeholder="请输入账号"
            ></el-input>
          </el-form-item>
          <el-form-item
            v-if="pageEl.status == 1"
            label="密码:"
            class="item"
            prop="password"
          >
            <el-input
              size="large"
              v-model="form.password"
              placeholder="请输入密码"
              type="password"
            ></el-input>
          </el-form-item>
          <el-radio-group
            v-if="pageEl.status == 1"
            class="radio"
            v-model="form.role"
          >
            <div>
              <el-radio :label="'1'">普通用户</el-radio>
            </div>
            <div>
              <el-radio :label="'2'">管理用户</el-radio>
            </div>
          </el-radio-group>
          <el-form-item
            v-if="pageEl.status == 2"
            label="账号:"
            class="item"
            prop="registerName"
          >
            <el-input
              size="large"
              v-model="form.registerName"
              placeholder="请输入账号"
            ></el-input>
          </el-form-item>
          <el-form-item
            v-if="pageEl.status == 2"
            label="密码:"
            class="item"
            prop="registerPassword"
          >
            <el-input
              size="large"
              v-model="form.registerPassword"
              placeholder="请输入密码"
              type="password"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="button">
        <div
          v-if="pageEl.status == 1"
          class="login-button"
          @click="loginClick"
          v-loading="pageEl.loading"
        >
          登录
        </div>
        <div
          v-if="pageEl.status == 2"
          class="login-button"
          @click="registerClick"
          v-loading="pageEl.loading"
        >
          注册
        </div>
      </div>
      <div class="bottom">
        <div
          v-if="pageEl.status == 1"
          class="bottom-item"
          @click="switchClick(2)"
        >
          注册账号
        </div>
        <div
          v-if="pageEl.status == 2"
          class="bottom-item"
          @click="switchClick(1)"
        >
          返回登录
        </div>
        <div class="bottom-item">忘记密码</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { login, register, administratorsLogin } from "@/api/login";
import { useRouter } from "vue-router";

let router = useRouter();
let formRef = ref();
let form = reactive({
  name: "",
  password: "",
  registerName: "",
  registerPassword: "",
  role: "1",
});

let pageEl = reactive({
  status: 1,
  loading: false,
});

const switchClick = (num: number) => {
  form.name = "";
  form.password = "";
  form.registerName = "";
  form.registerPassword = "";
  pageEl.status = num;
};

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

let formRules = reactive({
  name: [
    { required: true, message: "请输入账号", trigger: "blur" },
    { required: true, validator: validateName, trigger: "blur" },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { required: true, validator: validatePassword, trigger: "blur" },
  ],
  registerName: [
    { required: true, message: "请输入账号", trigger: "blur" },
    { required: true, validator: validateName, trigger: "blur" },
  ],
  registerPassword: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { required: true, validator: validatePassword, trigger: "blur" },
  ],
  role: [{ required: true, message: "请输入选择角色", trigger: "change" }],
});

const loginClick = () => {
  if (pageEl.loading == true) return;
  formRef.value.validate((valid: boolean) => {
    if (valid) {
      let obj = {
        userName: form.name,
        passWord: form.password,
      };
      pageEl.loading = true;
      let url = "/home";
      let func = login;
      if (form.role == "2") {
        func = administratorsLogin;
        url = "backstage";
      }
      func(obj)
        .then((res: any) => {
          pageEl.loading = false;
          if (res.code == "20000") {
            ElMessage.success("登录成功");
            let data = JSON.stringify(res.data);
            localStorage.setItem("userData", data);
            router.push(url);
          }
        })
        .catch((err: any) => {
          pageEl.loading = false;
        });
    }
  });
};

const registerClick = () => {
  if (pageEl.loading == true) return;
  formRef.value.validate((valid: boolean) => {
    if (valid) {
      let obj = {
        userName: form.registerName,
        passWord: form.registerPassword,
      };
      pageEl.loading = true;
      register(obj)
        .then((res: any) => {
          pageEl.loading = false;
          if (res.code == "20000") {
            ElMessage.success("注册成功");
            switchClick(1);
            form.role = "1";
          }
        })
        .catch((err: any) => {
          pageEl.loading = false;
        });
    }
  });
};

onMounted(() => {
  localStorage.clear();
  // localStorage.setItem('access_token', access_token)
  // localStorage.getItem('access_token')
});
</script>

<style lang="scss" scoped>
.login {
  width: 100%;
  height: 100%;
  position: relative;
  padding: 0px;
  margin: 0px;
}

.login-background {
  width: 100%;
  height: 100%;

  .img {
    height: 100%;
    padding: 0px;
    margin: 0px;
    margin-left: -550px;
  }
}

.login-content {
  position: absolute;
  top: 50%;
  right: 200px;
  width: 500px;
  // height: 430px;
  background: white;
  transform: translateY(-50%);
  box-shadow: 2.9952px 6.0096px 150.0096px #fff;
  border-radius: 10px;
  .title {
    margin-top: 40px;
    font-size: 30px;
    text-align: center;
    font-weight: bold;
  }
  .form {
    width: 100%;
    padding: 0 40px;
    box-sizing: border-box;
    margin-top: 40px;
    .item {
      margin-bottom: 20px;
    }
    .radio {
      display: flex;
      justify-content: space-around;
      padding: 0 20px 0 0px;
      width: 100%;
    }
  }
  .button {
    display: flex;
    justify-content: center;
    margin-top: 30px;
    .login-button {
      width: 180px;
      padding: 15px 0;
      background: rgb(73, 162, 255);
      text-align: center;
      color: white;
      border-radius: 5px;
      cursor: pointer;
    }
  }
  .bottom {
    display: flex;
    justify-content: space-between;
    padding: 0 40px;
    margin: 20px 0 25px;
    .bottom-item {
      color: #999;
      cursor: pointer;
    }
    .bottom-item:hover {
      color: rgb(73, 162, 255);
    }
  }
}
</style>
