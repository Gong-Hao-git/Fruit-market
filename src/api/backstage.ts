import request from "@/utils/request";

//后台首页:订单新增情况
export function itemOrderDdti(params: any) {
  return request({
    url: "/itemOrder/Ddti",
    method: "get",
    params
  })
}

//后台首页:公告发布情况
export function newsGgti(params: any) {
  return request({
    url: "/news/Ggti",
    method: "get",
    params
  })
}

//后台首页:用户留言情况
export function messageLyti(params: any) {
  return request({
    url: "/message/Lyti",
    method: "get",
    params
  })
}


// 类目管理

//类目管理:分页查询
export function categorySearch(params: any) {
  return request({
    url: "/itemCategory/findBySql1.do",
    method: "get",
    params
  })
}

//类目管理:详情
export function categoryDetails(params: any) {
  return request({
    url: "/itemCategory/show.do",
    method: "get",
    params
  })
}

//类目管理:新增
export function categoryAdd(params: any) {
  return request({
    url: "/itemCategory/exAdd1.do",
    method: "post",
    data: params
  })
}

//类目管理:修改
export function categoryModify(params: any) {
  return request({
    url: "/itemCategory/exUpdate1.do",
    method: "put",
    data: params
  })
}

//类目管理:删除
export function categoryDelete(params: any) {
  return request({
    url: "/itemCategory/delete1.do",
    method: "delete",
    data: params
  })
}



// 二级类目管理

//二级类目管理:分页查询
export function secondSearch(params: any) {
  return request({
    url: "/itemCategory/findBySql2.do",
    method: "get",
    params
  })
}

//二级类目管理:详情
export function secondDetails(params: any) {
  return request({
    url: "/itemCategory/show.do",
    method: "get",
    params
  })
}

//二级类目管理:新增
export function secondAdd(params: any) {
  return request({
    url: "/itemCategory/exAdd2.do",
    method: "post",
    data: params
  })
}

//二级类目管理:修改
export function secondModify(params: any) {
  return request({
    url: "/itemCategory/exUpdate2.do",
    method: "put",
    data: params
  })
}

//二级类目管理:删除
export function secondDelete(params: any) {
  return request({
    url: "/itemCategory/delete2.do",
    method: "delete",
    data: params
  })
}




// 用户管理

//用户管理:分页查询
export function userSearch(params: any) {
  return request({
    url: "/user/findBySql.do",
    method: "get",
    params
  })
}

//用户管理:详情
export function userDetails(params: any) {
  return request({
    url: "/user/show.do",
    method: "get",
    params
  })
}

//用户管理:修改密码
export function modifyPassword(params: any) {
  return request({
    url: "/login/upass",
    method: "put",
    data: params,
  })
}

//用户管理:新增
export function userAdd(params: any) {
  return request({
    url: "/user/exAdd.do",
    method: "post",
    data: params
  })
}

//用户管理:修改
export function userModify(params: any) {
  return request({
    url: "/user/exUpdate.do",
    method: "put",
    data: params
  })
}

//用户管理:删除
export function userDelete(params: any) {
  return request({
    url: "/user/delete.do",
    method: "delete",
    data: params
  })
}



// 商品管理

//商品管理:分页查询
export function commoditySearch(params: any) {
  return request({
    url: "/item/findBySql.do",
    method: "get",
    params
  })
}

//商品管理:搜索
export function commoditySearchs(params: any) {
  return request({
    url: "/item/shopList",
    method: "get",
    params
  })
}

//商品管理:详情
export function commodityDetails(params: any) {
  return request({
    url: "/item/show.do",
    method: "get",
    params
  })
}

//商品管理:新增
export function commodityAdd(params: any) {
  return request({
    url: "/item/exAdd.do",
    method: "post",
    data: params
  })
}

//商品管理:修改
export function commodityModify(params: any) {
  return request({
    url: "/item/exUpdate.do",
    method: "put",
    data: params
  })
}

//商品管理:删除
export function commodityDelete(params: any) {
  return request({
    url: "/item/delete.do",
    method: "delete",
    data: params
  })
}

//商品管理:商品收藏分页查询
export function collectionPage(params: any) {
  return request({
    url: "/sc/findBySql",
    method: "get",
    params
  })
}

//商品管理:商品收藏
export function collection(params: any) {
  return request({
    url: "/sc/exAdd",
    method: "post",
    data: params
  })
}

//商品管理:取消商品收藏
export function collectionCancel(params: any) {
  return request({
    url: "/sc/delete",
    method: "delete",
    data: params
  })
}

//商品管理:查询商品是否收藏
export function getCollection(params: any) {
  return request({
    url: "/sc/show",
    method: "get",
    params
  })
}




// 订单管理

//订单管理:分页查询
export function orderSearch(params: any) {
  return request({
    url: "/itemOrder/findBySql.do",
    method: "get",
    params
  })
}

//订单管理:分页查询（前台个人中心里面）
export function orderFindBySql(params: any) {
  return request({
    url: "/itemOrder/findBySql1",
    method: "get",
    params
  })
}

//订单管理:获取数量（前台个人中心里面）
export function orderDdsl(params: any) {
  return request({
    url: "/itemOrder/Ddsl",
    method: "get",
    params
  })
}

//订单管理:详情
export function orderDetails(params: any) {
  return request({
    url: "/itemOrder/show",
    method: "get",
    params
  })
}

//订单管理:详情后台接口
export function orderDetailShow(params: any) {
  return request({
    url: "/orderDetail/show",
    method: "get",
    params
  })
}

//订单管理:取消订单
export function orderCancel(params: any) {
  return request({
    url: "/login/orderCancel",
    method: "get",
    params
  })
}

//订单管理:新增
export function orderAdd(params: any) {
  return request({
    url: "/itemOrder/exAdd",
    method: "post",
    data: params
  })
}

//订单管理:修改
export function orderModify(params: any) {
  return request({
    url: "/login/orderModify",
    method: "post",
    data: params
  })
}

//订单管理:删除
export function orderDelete(params: any) {
  return request({
    url: "/login/orderDelete",
    method: "get",
    params
  })
}

//订单管理:修改订单状态
export function orderStatus(params: any) {
  return request({
    url: "/itemOrder/update",
    method: "put",
    data: params
  })
}



// 公告管理

//公告管理:分页查询
export function noticeSearch(params: any) {
  return request({
    url: "/news/findBySql.do",
    method: "get",
    params
  })
}

//公告管理:详情
export function noticeDetails(params: any) {
  return request({
    url: "/news/show.do",
    method: "get",
    params
  })
}

//公告管理:新增
export function noticeAdd(params: any) {
  return request({
    url: "news/exAdd.do",
    method: "post",
    data: params
  })
}

//公告管理:修改
export function noticeModify(params: any) {
  return request({
    url: "/news/exUpdate.do",
    method: "put",
    data: params
  })
}

//公告管理:删除
export function noticeDelete(params: any) {
  return request({
    url: "/news/delete.do",
    method: "delete",
    data: params
  })
}


// 留言管理

//留言管理:分页查询
export function leaveSearch(params: any) {
  return request({
    url: "/message/findBySql.do",
    method: "get",
    params
  })
}

//留言管理:详情
export function leaveDetails(params: any) {
  return request({
    url: "/login/leaveDetails",
    method: "get",
    params
  })
}

//留言管理:新增
export function leaveAdd(params: any) {
  return request({
    url: "/message/exAdd",
    method: "post",
    data: params
  })
}

//留言管理:修改
export function leaveModify(params: any) {
  return request({
    url: "/login/leaveModify",
    method: "post",
    data: params
  })
}

//留言管理:删除
export function leaveDelete(params: any) {
  return request({
    url: "/message/delete.do",
    method: "delete",
    data: params
  })
}


//图片上传
export function uploadFile(file: any) {
  return request({
    url: "/item/upload",
    method: "post",
    data: file
  })
}


//购物车

//购物车:分页查询
export function shoppingPage(params: any) {
  return request({
    url: "/car/findBySql",
    method: "get",
    params
  })
}

//购物车:修改商品的数量
export function shoppingModify(params: any) {
  return request({
    url: "/car/update",
    method: "put",
    data: params
  })
}

//购物车:新增
export function shoppingAdd(params: any) {
  return request({
    url: "/car/exAdd",
    method: "post",
    data: params
  })
}

//购物车:删除
export function shoppingDelete(params: any) {
  return request({
    url: "/car/delete",
    method: "delete",
    data: params
  })
}

//后台首页:用户登录情况
export function findBySql(params: any) {
  return request({
    url: "/loginUser/findBySql.do",
    method: "get",
    params
  })
}

//快捷搜索

//快捷搜索:分页查询
export function quickPage(params: any) {
  return request({
    url: "/itemKsear/findBySql",
    method: "get",
    params
  })
}

//快捷搜索:详情
export function quickDetails(params: any) {
  return request({
    url: "/itemKsear/show.do",
    method: "get",
    params
  })
}

//快捷搜索:新增
export function quickAdd(params: any) {
  return request({
    url: "/itemKsear/exAdd",
    method: "post",
    data: params
  })
}

//快捷搜索:修改
export function quickModify(params: any) {
  return request({
    url: "/itemKsear/exUpdate",
    method: "put",
    data: params
  })
}

//快捷搜索:删除
export function quickDelete(params: any) {
  return request({
    url: "/itemKsear/delete",
    method: "delete",
    data: params
  })
}