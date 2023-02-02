import request from "@/utils/request";

//收藏:分页查询
export function collectionPage(params: any) {
  return request({
    url: "/sc/findBySql",
    method: "get",
    params
  })
}

//收藏:取消收藏
export function collectionCancel(params: any) {
  return request({
    url: "/sc/delete",
    method: "delete",
    data: params
  })
}

//首页:类目展示
export function uIndex(params: any) {
  return request({
    url: "/itemCategory/uIndex",
    method: "get",
    params
  })
}

//首页:折扣商品
export function uIndex2(params: any) {
  return request({
    url: "/item/uIndex2",
    method: "get",
    params
  })
}

//首页:热门商品
export function uIndex3(params: any) {
  return request({
    url: "/item/uIndex3",
    method: "get",
    params
  })
}

//首页:精品推荐
export function uIndex4(params: any) {
  return request({
    url: "/item/uIndex4",
    method: "get",
    params
  })
}

//随机商品
export function itemRandom(params: any) {
  return request({
    url: "/item/itemRandom",
    method: "get",
    params
  })
}