<template>
  <div class="system-leave">
    <div class="content">
      <page-header :title="'留言'" />
      <div class="main">
        <div class="form">
          <el-form
            :model="formData"
            :rules="formRules"
            ref="formRef"
            label-width="80px"
            class="demo-tableRuleForm"
          >
            <el-form-item label="留言类型" prop="type">
              <el-select
                class="input"
                v-model="formData.type"
                placeholder="请选择留言类型"
              >
                <el-option
                  :label="item.label"
                  :value="item.value"
                  v-for="item in pageEl.typeList"
                  :key="item"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="留言内容" prop="content">
              <el-input
                v-model="formData.content"
                placeholder="请输入留言内容"
                type="textarea"
                :rows="5"
                maxlength="500"
                clearable
              ></el-input>
            </el-form-item>
            <div class="submit">
              <el-button
                type="primary"
                :loading="pageEl.loading"
                @click="submit"
              >
                <div class="button">提交</div>
              </el-button>
            </div>
          </el-form>
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
import { leaveAdd } from "@/api/backstage";
import { leaveType } from "@/utils/calculation";

let formRef = ref();
let pageEl = reactive({
  typeList: [...leaveType],
  loading: false,
});

let formData = reactive({
  userName: "",
  type: "",
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
  content: [
    { required: true, message: "内容不能为空", trigger: "blur" },
    { required: true, validator: validateName, trigger: "blur" },
  ],
  type: [{ required: true, message: "内容不能为空", trigger: "change" }],
});

const submit = () => {
  formRef.value.validate((valid: boolean) => {
    if (valid) {
      let obj: any = {
        name: "",
        type: formData.type,
        content: formData.content,
        phone: null,
      };
      let userData: any = JSON.parse(localStorage.getItem("userData"));
      if (userData && userData.phone) {
        obj.phone = userData.phone;
      } else {
        ElMessage.warning("请在个人中心先完善个人信息再留言！");
        return;
      }
      if (userData && userData.userName) {
        obj.name = userData.userName;
        let func = leaveAdd;
        pageEl.loading = true;
        func(obj)
          .then((res: any) => {
            pageEl.loading = false;
            if (res.code == "20000") {
              ElMessage.success("留言成功");
            }
          })
          .catch((err) => {
            pageEl.loading = false;
          });
      }
    }
  });
};

onMounted(() => {});
</script>

<style lang="scss" scoped>
.system-leave {
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
  padding: 40px;
  box-sizing: border-box;
}
.form {
  width: 500px;
  margin: auto;
}
.input {
  width: 100%;
}
.submit {
  margin-top: 40px;
  display: flex;
  justify-content: center;
  .button {
    width: 100px;
  }
}
</style>
