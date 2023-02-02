<template>
  <div class="commodity-add">
    <el-dialog
      v-model="pageEl.dialogVisible"
      :title="pageEl.title"
      width="800px"
      destroy-on-close
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="110px">
        <el-form-item label="商品名称" prop="name">
          <el-input
            v-model="formData.name"
            placeholder="请输入商品名称"
            clearable
            maxlength="50"
          />
        </el-form-item>
        <el-form-item label="商品价格" prop="price">
          <!-- <el-input
            v-model="formData.price"
            placeholder="请输入商品价格"
            clearable
          /> -->
          <el-input-number v-model="formData.price" :min="0" />
        </el-form-item>
        <el-form-item label="折扣" prop="zk">
          <el-input-number v-model="formData.zk" :min="0" :max="10" />
        </el-form-item>
        <el-form-item label="商品一级分类" prop="categoryIdOne">
          <!-- <el-input
            v-model="formData.categoryIdOne"
            placeholder="请输入商品一级分类"
            clearable
            maxlength="30"
          /> -->
          <el-select
            v-model="formData.categoryIdOne"
            placeholder="请选择商品一级分类"
            clearable
            @change="change"
          >
            <el-option
              v-for="list in pageEl.primaryData"
              :key="list.id"
              :label="list.name"
              :value="list.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="商品二级分类" prop="categoryIdTwo">
          <!-- <el-input
            v-model="formData.categoryIdTwo"
            placeholder="请输入商品二级分类"
            clearable
            maxlength="30"
          /> -->
          <el-select
            v-model="formData.categoryIdTwo"
            placeholder="请选择商品二级分类"
            clearable
          >
            <el-option
              v-for="list in pageEl.secondaryData"
              :key="list.id"
              :label="list.name"
              :value="list.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="商品主图">
          <el-upload
            class="avatar-uploader"
            action="http://localhost:8081/OnlineFruitStore_war_exploded/upload"
            :show-file-list="false"
            :auto-upload="false"
            :on-change="uploadChange"
          >
            <img v-if="pageEl.imageUrl" :src="pageEl.imageUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="商品图片">
          <el-upload
            action="http://localhost:8081/OnlineFruitStore_war_exploded/upload"
            list-type="picture-card"
            :file-list="pageEl.commodityList"
            :auto-upload="false"
            :on-change="commodityChange"
            :on-remove="onRemove"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
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
import {
  categorySearch,
  secondSearch,
  commodityDetails,
  commodityAdd,
  commodityModify,
} from "@/api/backstage";
import { Plus } from "@element-plus/icons-vue";
import { getImgUrl, beginUploadMore } from "@/utils/calculation";
import { base } from "@/utils/request";

let emit = defineEmits(["refresh"]);
let formRef = ref();
let pageEl = reactive({
  dialogVisible: false,
  title: "新增",
  loading: false,
  id: "",
  primaryData: [],
  secondaryData: [],
  imageUrl: "",
  uploadFile: null as any,
  // commodityImage: "",
  commodityList: [
    // {
    //   url: "./img/shopping-cart-1.png",
    // },
  ],
});

const setDialog = (bool: boolean, id?: string) => {
  pageEl.dialogVisible = bool;
  pageEl.uploadFile = null;
  if (id) {
    pageEl.title = "修改";
    pageEl.id = id;
    let obj = {
      id,
    };
    commodityDetails(obj).then((res: any) => {
      if (res.code == "20000") {
        let data = res.data;
        for (let key in formData) {
          if (key != "categoryIdOne" || key != "categoryIdTwo") {
            formData[key] = data[key];
          }
        }
        formData.price = parseFloat(formData.price);
        formData.zk = parseFloat(formData.zk);
        formData.categoryIdOne = data.yiji.id;
        formData.categoryIdTwo = data.erji.id;
        if (data.url1) {
          pageEl.imageUrl = base + data.url1;
        }
        if (data.url2) {
          pageEl.commodityList = [];
          let list = data.url2.split(",");
          list.forEach((item: any) => {
            let obj = {
              url: base + item,
              urlData: item,
            };
            pageEl.commodityList.push(obj);
          });
        }
        change(true);
      }
    });
  } else {
    pageEl.title = "新增";
    pageEl.id = "";
    for (let key in formData) {
      formData[key] = "";
    }
    formData.price = 0;
    formData.zk = 0;
    pageEl.commodityList = [];
    pageEl.imageUrl = "";
  }
  getPrimaryData();
};

let formData = reactive({
  name: "",
  price: 0,
  zk: 10,
  categoryIdOne: "",
  categoryIdTwo: "",
  url1: "",
  url2: "",
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
  price: [{ required: true, message: "内容不能为空", trigger: "blur" }],
  zk: [{ required: true, message: "内容不能为空", trigger: "blur" }],
  categoryIdOne: [{ required: true, message: "内容不能为空", trigger: "change" }],
  categoryIdTwo: [{ required: true, message: "内容不能为空", trigger: "change" }],
});

const submit = () => {
  formRef.value.validate((valid: boolean) => {
    if (valid) {
      if (pageEl.imageUrl == "") {
        ElMessage.warning("商品主图不能为空");
        return;
      }
      if (pageEl.commodityList == null || pageEl.commodityList.length == 0) {
        ElMessage.warning("商品图片不能为空");
        return;
      }
      let func = () => {
        let obj: any = {
          ...formData,
          price: parseInt(formData.price),
          zk: parseInt(formData.zk),
        };
        let funcs = commodityAdd;
        let name = "新增成功";
        if (pageEl.title != "新增") {
          obj.id = pageEl.id;
          funcs = commodityModify;
          name = "修改成功";
        }
        pageEl.loading = true;
        funcs(obj)
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
      let newFileList: any = [];
      if (pageEl.uploadFile != null) {
        newFileList.push(pageEl.uploadFile);
      }
      pageEl.commodityList.forEach((item: any, index: number) => {
        if (item.raw) {
          newFileList.push(item);
        }
      });
      if (newFileList.length > 0) {
        beginUploadMore(
          newFileList,
          (res: any) => {
            let j = 0;
            if (pageEl.uploadFile != null) {
              formData.url1 = res[j].data;
              j++;
            }
            formData.url2 = "";
            pageEl.commodityList.forEach((item: any, index: number) => {
              let imgUrl: any = "";
              if (item.raw) {
                imgUrl = res[j].data;
                j++;
              } else {
                imgUrl = item.urlData;
              }
              if (index != 0) {
                formData.url2 = formData.url2 + "," + imgUrl;
              } else {
                formData.url2 = imgUrl;
              }
            });
            func();
          },
          () => {}
        );
      } else {
        formData.url2 = "";
        pageEl.commodityList.forEach((item: any, index: number) => {
          if (index != 0) {
            formData.url2 = formData.url2 + "," + item.urlData;
          } else {
            formData.url2 = item.urlData;
          }
        });
        func();
      }
    }
  });
};

//获取一级分类的数据
const getPrimaryData = () => {
  let obj = {
    pageSize: 100,
    pageNum: 1,
  };
  categorySearch(obj).then((res: any) => {
    if (res.code == "20000") {
      let data = res.data;
      pageEl.primaryData = data.datas;
    }
  });
};

//获取二级分类的数据
const change = (bool?: boolean) => {
  let pid = formData.categoryIdOne;
  if (bool != true) {
    formData.categoryIdTwo = "";
  }
  if (pid == "") return;
  let obj = {
    pageSize: 100,
    pageNum: 1,
    pid,
  };
  secondSearch(obj).then((res: any) => {
    if (res.code == "20000") {
      let data = res.data;
      pageEl.secondaryData = data.datas;
    }
  });
};

//商品主图上传
const uploadChange = (file: any, fileList: any) => {
  let url = getImgUrl(file.name, file.raw);
  if (url == false) return;
  //用于放在页面上的图片的地址
  pageEl.imageUrl = url;
  //保存上传的文件
  pageEl.uploadFile = file;
};

//商品上传
const commodityChange = (file: any, fileList: any) => {
  if (fileList.length > 10) {
    ElMessage.warning("最多只能上传10张图片");
    pageEl.commodityList = fileList.filter((item: any, index: number) => index < 10);
    return;
  }
  pageEl.commodityList = fileList;
};

//商品删除
const onRemove = (file: any, fileList: any) => {
  pageEl.commodityList = fileList;
};

defineExpose({
  setDialog,
});
</script>

<style lang="scss" scoped>
.commodity-add {
}
.avatar-uploader .avatar {
  width: 148px;
  height: 148px;
  display: block;
}
</style>
<style lang="scss">
.commodity-add {
  .avatar-uploader .el-upload {
    border: 1px dashed #999;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #999;
  }

  .el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 148px;
    height: 148px;
    text-align: center;
  }
}
</style>

<style lang="scss" scoped>
.commodity-add {
}
.avatar-uploader .avatar {
  width: 148px;
  height: 148px;
  display: block;
}
</style>
<style lang="scss">
.commodity-add {
  .el-input-number {
    width: 100%;
  }
  .el-select {
    width: 100%;
  }
}
</style>
