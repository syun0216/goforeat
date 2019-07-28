import request from './config';
import axios from 'axios';
import store from '../store/index';
import {getVersion} from '../utils/DeviceInfo';
import {currentPlatform} from '../utils/global_params';
import qs from 'qs';


// request 自定义属性
/**
 * loading 是否显示loading boolean
 * toast 是否显示toast boolean
 * postCustom 是否自定义post参数
 * loginBlock 是否自动进行登录拦截行为
 */

//login
export function getCode(mobile, type) {
  return request({
    url: '/passport/register',
    loading: true,
    method: 'post',
    data: {
      mobile,
      type
    }
  })
}

export function register(mobile, type, token, code, password) {
  return request({
    url: '/passport/checkCode',
    loading: true,
    method: 'post',
    data: {
      mobile,
      type,
      token,
      code,
      password
    }
  })
}

export function login(mobile, type, password) {
  return request({
    url: '/passport/login',
    loading: true,
    method: 'post',
    data: {
      mobile,
      type,
      password
    }
  })
}

export function checkCode(mobile, type, token, code) {
  return request({
    url: '/passport/checkCode',
    loading: true,
    method: 'post',
    data: {
      mobile,
      type,
      token,
      code
    }
  })
}

export function logout() {
  return request({
    url: '/passport/logout',
    loading: true,
    method: 'post'
  })
}

//article
export function getArticleList(offset, placeId) {
  return request({
    url: '/cms/getNewsList',
    loading: true,
    method: 'post',
    data: {
      limit: 5,
      offset,
      placeId
    }
  })
}

/**
 * 获取每日菜品
 *
 * @export
 * @param {*} {offset, placeId}
 * @returns
 */
export function getFoodList({offset, placeId}) {
  return request({
    url: '/food/getFoodList',
    loading: false,
    method: 'get',
    params: {
      offset,
      limit: 5,
      placeId
    }
  })
}

//homepage
export function getDailyFoods(placeId) { //被摒弃
  return request({
    url: '/food/getDailyFood',
    loading: false,
    method: 'get',
    params: {
      placeId
    }
  })
}

export function getFoodDetails(dateFoodId) {
  return request({
    url: '/food/getFoodDetail',
    loading: false,
    method: 'post',
    data: {
      dateFoodId
    }
  })
}

//confirm order
export function createOrder(foodId, placeId, amount) { //被摒弃
  return request({
    url: '/order/create',
    loading: true,
    method: 'get',
    params: {
      foodId,
      placeId,
      amount
    }
  })
}

export function createNewOrder(dateFoodId, amount, placeId, addStatus) {
  return request({
    url: '/order/createNew',
    loading: false,
    method: 'post',
    data: {
      dateFoodId,
      amount,
      placeId,
      addStatus
    }
  })
}
/**
 * 确认下单（旧）
 *
 * @export
 * @param {*} orderId
 * @param {*} payMoney
 * @param {number} [payment=1]
 * @param {*} token
 * @param {*} remark
 * @param {*} [deductionId=null]
 * @param {*} [placeId=null]
 * @returns
 */
export function confirmOrder(orderId, payMoney, payment = 1, token, remark, deductionId=null,placeId=null) {
  return request({
    url: '/order/confirm',
    loading: true,
    method: 'post',
    data: {
      orderId,
      payMoney,
      payment,
      token,
      remark,
      deductionId,
      placeId
    }
  })
}
/**
 * 确认下单接口（新）
 *
 * @export
 * @param {*} orderId
 * @param {*} payMoney
 * @param {number} [payment=1]
 * @param {*} token
 * @param {*} [deductionId=null]
 * @param {*} useMonthTicket
 * @param {*} remark
 * @returns
 */
export function confirmOrderV1(orderId, payMoney, payment=1, token, deductionId = null, useMonthTicket, remark) {
  return request({
    url: '/order/v1/confirm',
    loading: true,
    method: 'post',
    data: {
      orderId,
      payMoney,
      payment,
      token,
      deductionId,
      useMonthTicket,
      remark
    }
  })
}

/**
 * 获取可用优惠券
 *
 * @export
 * @param {*} coupon
 * @param {*} orderId
 * @returns
 */
export function useCoupon(coupon,orderId) {
  return request({
    url: '/coupon/isUseful',
    loading: true,
    method: 'post',
    data: {
      coupon,
      orderId
    }
  })
}

/**
 * 取消订单
 *
 * @export
 * @param {*} orderId
 * @returns
 */
export function cancelOrder(orderId) {
  return request({
    url: '/order/cancel',
    loading: true,
    method: 'post',
    data: {
      orderId
    }
  })
}

/**
 * 获取我的订单
 *
 * @export
 * @param {*} {offset, status}
 * @returns
 */
export function myOrder({offset, status}) {
  return request({
    url: '/order/myOrderList',
    loading: false,
    method: 'post',
    data: {
      limit: 5,
      offset,
      status
    }
  })
}

/**
 * 获取配送点信息
 *
 * @export
 * @param {*} [lat=null]
 * @param {*} [lon=null]
 * @returns
 */
export function foodPlaces(lat = null, lon = null) { // 即将废弃
  return request({
    url: '/food/getDeliveryPlace',
    loading: true,
    method: 'get',
    params: {
      lat,
      lon
    }
  })
}

/**
 * 登录保存设备信息
 *
 * @export
 * @param {*} registrationId
 * @returns
 */
export function saveDevices(registrationId) {
  return request({
    url: '/device/save',
    loading: true,
    method: 'post',
    toast: false,
    data: {
      registrationId
    }
  })
}

/**
 * 监测信用卡是否合法
 *
 * @export
 * @param {*} bankCard
 * @returns
 */
export function vaildCard(bankCard) {
  return request({
    url: '/member/isBankCardValid',
    loading: true,
    method: 'post',
    data: {
      bankCard
    }
  })
}

/**
 * 反馈
 *
 * @export
 * @param {*} data
 * @returns
 */
export function feedback(data) {
  return request({
    url: '/feedback/add',
    loading: true,
    method: 'post',
    data: data
  })
}

/**
 * 获取广告位
 *
 * @export
 * @returns
 */
export function adSpace(pagePosition = 1) {
  return request({
    url: '/adSpace/list',
    loading: true,
    toast: false,
    method: 'post',
    data: {
      pagePosition
    }
  })
}

//首页公告栏
export function queryLatest() {
  return request({
    url: '/notice/queryLatest',
    toast: false,
    loading: false,
    method: 'get'
  })
}

/**
 * 获取公告栏信息
 *
 * @export
 * @returns
 */
export function queryList() {
  return request({
    url: '/notice/queryList',
    loading: true,
    toast: false,
    method: 'get'
  })
}

//pay setting
export function getPaySetting() {
  return request({
    url: '/member/myPayments',
    loading: true,
    method: 'get'
  })
}

/**
 * 新的支付方式
 *
 * @export
 * @returns
 */
export function getPaySettingNew() {
  return request({
    url: '/member/myPaymentNew',
    loading: true,
    method: 'post'
  })
}

/**
 * 设置支付方式
 *
 * @export
 * @param {*} payment
 * @returns
 */
export function setPayment(payment) {
  return request({
    url: '/member/setPayment',
    loading: true,
    method: 'post',
    data: { payment }
  })
}

/**
 * 获取月票
 *
 * @export
 * @returns
 */
export function getMonthTicket() {
  return request({
    url: '/member/myMonthTicket',
    loading: true,
    method: 'get'
  })
}

/**
 * 获取我的资料
 *
 * @export
 * @returns
 */
export function getMyInfo() {
  return request({
    url: '/member/me',
    loading: true,
    method: 'get'
  })
}

/**
 * 更新我的详情
 *
 * @export
 * @param {*} {nickName, address, email, gender}
 * @returns
 */
export function updateMyInfo({nickName, address, email, gender}) {
  return request({
    url: '/member/update',
    loading: true,
    method: 'post',
    data: {
      nickName,
      address,
      email,
      gender
    }
  })
}

export function uploadAvatar(profileImg) {
  let _img = {
      name: profileImg.fileName,
      uri: profileImg.uri
    };
  let params = new FormData();
  params.append('profileImg', _img);
  params.append('sid', store.getState().auth.sid);
  params.append('language', store.getState().language.language);
  params.append('sellClient', currentPlatform);
  params.append('appVersion', getVersion());
  console.log('params',JSON.stringify(params))
  // return axios.post('http://api.goforeat.hk/member/uploadProfileImg', params)
  return request({
    url: '/member/uploadProfileImg',
    method: 'post',
    loading: true,
    postCustom: true, // 自定义post传值
    data: params
  })
}


/**
 * 我的优惠券
 *
 * @export
 * @param {*} {offset,limit=5,useStatus =null,payMoney=null}
 * @returns
 */
export function myCoupon({offset,limit=5,useStatus =null,payMoney=null}) {
  return request({
    url: '/coupon/myCoupon',
    loading: false,
    method: 'post',
    data: {
      limit,
      offset,
      useStatus,
      payMoney
    }
  })
}

/**
 * 获取优惠券
 *
 * @export
 * @param {*} exchangeCode
 * @returns
 */
export function getCoupon(exchangeCode) {
  return request({
    url: '/coupon/exchangeCoupon',
    loading: true,
    method: 'post',
    data: {
      exchangeCode
    }
  })
}

/**
 * 点赞
 *
 * @export
 * @param {*} foodId
 * @param {*} status
 * @returns
 */
export function myFavorite(foodId, status) {
  return request({
    url: '/food/like',
    loading: false,
    loginBlock: false, // 是否未登录自动退出
    toast: false,
    method: 'post',
    data: {
      foodId,
      status
    }
  })
}

/**
 * 弹出窗口评论
 *
 * @export
 * @returns
 */
export function popupComment() {
  return request({
    url: '/comment/isPopup',
    loading: true,
    method: 'post'
  })
}

/**
 * 添加评论
 *
 * @export
 * @param {*} orderId
 * @param {*} star
 * @param {*} comment
 * @returns
 */
export function addComment(orderId, star, comment) {
  return request({
    url: '/comment/add',
    loading: true,
    method: 'post',
    data: {
      orderId,
      star,
      comment
    }
  })
}

/**
 * 保存信用卡
 *
 * @export
 * @param {*} token
 * @param {*} time
 * @param {*} tailNum
 * @returns
 */
export function setCreditCard(token, time, tailNum) {
  return request({
    url: '/member/setCreditCard',
    loading: true,
    method: 'post',
    data: {
      token, time, tailNum
    }
  })
}

/**
 * 获取信用卡
 *
 * @export
 * @returns
 */
export function getCreditCard() {
  return request({
    url: '/member/myCreditCard',
    loading: true,
    method: 'get',
  })
}

/**
 * 取消绑定信用卡
 *
 * @export
 * @returns
 */
export function removeCreditCard() {
  return request({
    url: '/member/cancelCreditCard',
    loading: true,
    method: 'post'
  })
}

/**
 * 获取月票列表
 *
 * @export
 * @returns
 */
export function getMonthTicketList() {
  return request({
    url: '/monthTicket/getSpecList',
    loading: true,
    method: 'get'
  })
}

/**
 * 获取月票须知
 *
 * @export
 * @returns
 */
export function getMonthTicketInfo() {
  return request({
    url: '/monthTicket/info',
    loading: true,
    method: 'post'
  })
}

/**
 * 创建月票订单
 *
 * @export
 * @param {*} specId
 * @returns
 */
export function createMonthTicket(specId) {
  return request({
    url: '/monthTicket/create',
    loading: true,
    method: 'post',
    data: {
      specId
    }
  })
}

/** 
 * 确认购买月票
 *
 * @export
 * @param {*} {orderId, payMoney, payment, token}
 * @returns
 */
export function confirmMonthTicket({orderId, payMoney, payment, token}) {
  return request({
    url: '/monthTicket/confirm',
    loading: true,
    method: 'post',
    data: {
      orderId, payMoney, payment, token
    }
  })
}
/**
 * 通过订单id 获取评论详情
 *
 * @export
 * @param {*} orderId
 * @returns
 */
export function getCommentByOrderId(orderId) {
  return request({
    url: '/comment/getComment',
    loading: true,
    method: 'post',
    data: {
      orderId
    }
  })
}
/**
 * 查看菜品评论
 *
 * @export
 * @param {*} {foodId, limit, offset}
 * @returns
 */
export function getCommentList({foodId, limit, offset}) {
  return request({
    url: '/comment/getCommentList',
    loading: false,
    method: 'post',
    data: {
      foodId,
      limit: 15,
      offset
    }
  })
}

/**
 * 获取版本更新信息
 *
 * @export
 * @returns
 */
export function getVersionFromServer() {
  return request({
    url: '/info/getVersionInfo',
    loading: true,
    toast: false,
    method: 'post'
  })
}

export const versionCode = {
  normal: 1,
  alertToUpdate: 2,
  mustUpdate: 3
};

/**
 * 我的邀请概要
 *
 * @export
 * @returns
 */
export function inviteActivityInfo() {
  return request({
    url: '/invite/showInvite',
    method: 'post',
    loading: false,
    toast: false
  });
}

/**
 * 获取我的邀请
 *
 * @export
 * @returns
 */
export function myInvites() {
  return request({
    url: '/invite/myInvites',
    method: 'post',
    loading: false,
    toast: true,
    data: {
      offset: 0,
      limit: 1
    }
  })
}

/**
 * 获取有层级关系的配送地址
 *
 * @export
 * @returns
 */
export function getDeliveryList(lat = null, lon = null) {
  return request({
    url: '/deliveryPlace/getList',
    method: 'post',
    loading: false,
    toast: false,
    data: {
      lat, lon
    }
  })
}

