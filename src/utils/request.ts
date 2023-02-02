import axios from "axios";
import { ElMessage } from "element-plus";

export const baseURL = "http://localhost:8081/OnlineFruitStore_war_exploded";

export const base = "http://localhost:8081";

let bool = true;

const request = axios.create({
  // baseURL: ''
  baseURL
});


// // 请求拦截
// request.interceptors.request.use(
//   (config: any) => {
//     let token = store.getters["user/getToken"];
//     if (token) {
//       config.headers["Authorization"] = "Bearer " + token; // token
//     }
//     if (config.url && config.url.startsWith("http://")) {
//       console.log(config);
//       config.baseURL = "/";
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // 响应拦截
// request.interceptors.response.use(
//   (response) => {
//     const res = response.data;
//     // 文件类型
//     if (response.data instanceof Blob) {
//       return res;
//     }
//     if (res.code && res.code != "20000") {
//       if (res.message) {
//         ElMessage.error(res.message);
//       }
//       return Promise.reject(res && res.msg);
//     }
//     return res;
//   },
//   (error) => {
//     if (axios.isCancel(error)) {
//     } else {
//       if (error.response && error.response.status == 401) {
//         if (bool == true) {
//           ElMessage.error("登录已过期，请重新登录");
//           bool = false;
//           setTimeout(() => {
//             bool = true
//           }, 1000)
//         }
//         store.commit("user/logout");
//         router.push("/login");
//       } else {
//         console.error(error.response);

//         const resData: any = error.response && error.response.data;
//         resData && resData.msg && ElMessage.error(resData.msg);
//         resData && resData.message && ElMessage.error(resData.message);
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// 响应拦截
request.interceptors.response.use(
  (response) => {
    const res = response.data;
    // 文件类型
    if (response.data instanceof Blob) {
      return res;
    }
    if (res.code && res.code != "20000") {
      if (res.message) {
        ElMessage.error(res.message);
      }
      return Promise.reject(res && res.msg);
    }
    return res;
  },
  (error) => {
    if (axios.isCancel(error)) {
    } else {
      if (error.response && error.response.status == 401) {
        if (bool == true) {
          ElMessage.error("登录已过期，请重新登录");
          bool = false;
          setTimeout(() => {
            bool = true
          }, 1000)
        }
      } else {
        console.error(error.response);

        const resData: any = error.response && error.response.data;
        resData && resData.msg && ElMessage.error(resData.msg);
        resData && resData.message && ElMessage.error(resData.message);
      }
    }
    return Promise.reject(error);
  }
);

export default request;

export const requestWithoutConfig = axios.create();
requestWithoutConfig.interceptors.response.use((response) => response.data);
