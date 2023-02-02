import request from "@/utils/request";

// 登录
export function login(params: any) {
  return request({
    url: "/login/uLogin.do",
    method: "post",
    data: params
  })
}

//管理员登录
export function administratorsLogin(params: any) {
  return request({
    url: "/login/mLogin.do",
    method: "post",
    data: params
  })
}

// 注册
export function register(params: any) {
  return request({
    url: "/login/res.do",
    method: "post",
    data: params
  })
}