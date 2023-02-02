<template>
  <div class="personal-information">
    <div class="title">基本信息</div>
    <div class="content" v-if="pageEl.show == 1">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="80px"
        class="form"
      >
        <el-form-item label="真实姓名">
          {{ userData.realName ? userData.realName : "-" }}
        </el-form-item>
        <el-form-item label="性别">
          {{ userData.gender ? userData.gender : "-" }}
        </el-form-item>
        <el-form-item label="手机号">
          {{ userData.phone ? userData.phone : "-" }}
        </el-form-item>
        <el-form-item label="邮箱">
          {{ userData.emil ? userData.emil : "-" }}
        </el-form-item>
        <div class="bottom">
          <el-button type="success" @click="setShow(2)"> 修改 </el-button>
        </div>
      </el-form>
    </div>
    <div class="content" v-if="pageEl.show == 2">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="80px"
        class="form"
      >
        <el-form-item label="真实姓名" prop="realName">
          <el-input
            v-model="formData.realName"
            placeholder="请输入真实姓名"
            clearable
            maxlength="20"
          />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="formData.gender">
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
        <el-form-item label="邮箱" prop="emil">
          <el-input
            v-model="formData.emil"
            placeholder="请输入邮箱"
            clearable
            maxlength="30"
          />
        </el-form-item>
        <div class="bottom">
          <el-button type="primary" @click="submit" v-loading="pageEl.loading">
            保存
          </el-button>
          <el-button @click="setShow(1)"> 取消 </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { userModify } from "@/api/backstage";

let pageEl = reactive({
  show: 1,
  loading: false,
  id: null,
});
let formRef = ref();
let formData = reactive({
  userName: "",
  phone: "",
  realName: "",
  gender: "",
  emil: "",
});

let userData = reactive({
  userName: "",
  phone: "",
  realName: "",
  gender: "",
  emil: "",
});

let validateName = (rule: any, value: any, callback: any) => {
  let newsValue = value.trim();
  if (newsValue.length <= 0) {
    callback(new Error("内容不能为空"));
  } else {
    callback();
  }
};

let validatePhone = (rule: any, value: any, callback: any) => {
  let tf = /^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/.test(
    value
  );
  if (!value || value.length < 1) {
    callback(new Error("手机号不能为空"));
    return;
  }
  if (tf) {
    callback();
  } else {
    callback(new Error("手机号码格式不对"));
  }
};

let formRules = reactive({
  realName: [
    { required: true, message: "真实姓名不能为空", trigger: "blur" },
    { required: true, validator: validateName, trigger: "blur" },
  ],
  gender: [{ required: true, message: "性别不能为空" }],
  phone: [{ required: true, validator: validatePhone, trigger: "blur" }],
  emil: [
    { required: true, message: "邮箱不能为空", trigger: "blur" },
    { required: true, validator: validateName, trigger: "blur" },
  ],
});

const setShow = (val: number) => {
  pageEl.show = val;
  if (val == 1) {
    for (let key in formData) {
      formData[key] = "";
    }
  }
  if (val == 2) {
    for (let key in formData) {
      formData[key] = userData[key];
    }
  }
};

const submit = () => {
  formRef.value.validate((valid: boolean) => {
    if (valid) {
      let obj: any = {
        // ...formData,
        id: pageEl.id,
        userName: formData.userName,
        realName: formData.realName,
        phone: formData.phone,
        sex: formData.gender,
        email: formData.emil,
      };
      let func = userModify;
      let name = "保存成功";
      pageEl.loading = true;
      func(obj)
        .then((res: any) => {
          pageEl.loading = false;
          if (res.code == "20000") {
            ElMessage.success(name);
            let data = JSON.stringify(res.data);
            localStorage.setItem("userData", data);
            getUserData();
            setShow(1);
          }
        })
        .catch((err) => {
          pageEl.loading = false;
        });
    }
  });
};

//获取用户数据
const getUserData = () => {
  let data: any = JSON.parse(localStorage.getItem("userData"));
  if(!data)return;
  pageEl.id = data.id;
  userData.userName = data.userName;
  userData.realName = data.realName;
  userData.phone = data.phone;
  userData.gender = data.sex;
  userData.emil = data.email;
};

onMounted(() => {
  getUserData();
});
</script>

<style lang="scss" scoped>
.personal-information {
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
