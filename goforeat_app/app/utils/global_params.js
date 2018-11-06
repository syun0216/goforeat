import {
  Dimensions,
  Platform
} from 'react-native';

const X = Dimensions.get('window').width;
const Y = Dimensions.get('window').height;

//计算屏幕比例
const ratioX = X < 414 ? (X < 375 ? (X < 320 ? 0.75 : 0.875) : 1) : 1.104;
const ratioY = Y < 568 ? (Y < 480 ? 0.75 : 0.875) : 1;

// iPhoneX
const iPhoneX_WIDTH = 375;
const iPhoneX_HEIGHT = 812;

const GLOBAL_PARAMS = {
  _winWidth: X,
  _winHeight: Y,
  httpStatus: {
    LOADING: 0,
    LOAD_SUCCESS: 1,
    LOAD_FAILED: 2,
    NO_MORE_DATA: 3,
    NO_DATA: 4
  },
  phoneType: {
    CHN: {
      label: 'CHN +86',
      value: 2
    },
    HK: {
      label: 'HK +852',
      value: 1
    }
  },
  bottomDistance: Platform.select({
    ios: 80,
    android: 120
  }),
  iPhoneXBottom: 34,
  iPhoneXTop: 24,
  em: (val) => val * ratioX,
  heightAuto: (height) => height * (Y / 667),
  widthAuto: (width) => width * (X / 375),
  isIphoneX: () => {
    return (
      Platform.OS === 'ios' &&
      ((Y === iPhoneX_HEIGHT && X === iPhoneX_WIDTH) ||
        (Y === iPhoneX_WIDTH && X === iPhoneX_HEIGHT))
    )
  }
}

// 路由存储以abort请求
export const ABORT_LIST_WITH_ROUTE = [];

// 将会包装事件的 debounce 函数
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }
}

//支付方式
export const PAY_TYPE = {
  cash: 1,
  apple_pay: 2,
  android_pay: 3,
  credit_card: 6,
  month_ticket: 7
};

export const EXPLAIN_PAY_TYPE = {
  1: {zh:'現金支付',en: 'Cash Pay'},
  2: {zh:'Apple Pay',en: 'Apple Pay'},
  3: {zh:'Google Pay', en: 'Google Pay'},
  4: {zh: '微信支付',en: 'WeChat Pay'},
  5: {zh: '支付寶支付', en: 'Ali Pay'},
  6: {zh:'信用卡支付',en: 'Credit Card'},
  7: {zh: '月票支付',en: 'Month Tikcet'}
}

export const SET_PAY_TYPE = {
  cash: 1,
  apple_pay: 2,
  google_pay: 3,
  wechat_pay: 4,
  ali_pay: 5,
  credit_card: 6,
  month_ticket: 7,
}

export const em = (val) => val * ratioX 

export const currentPlatform = Platform.OS == 'ios' ? 1 : 2;

export function isEmpty(v) {
  switch (typeof v) {
    case 'undefined':
      return true;
    case 'string':
      if (v.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, '').length == 0) return true;
      break;
    case 'boolean':
      if (!v) return true;
      break;
    // case 'number':
    //   if (0 === v || isNaN(v)) return true;
    //   break;
    case 'object':
      if (null === v || v.length === 0) return true;
      for (var i in v) {
        return false;
      }
      return true;
  }
  return false;
}

export default GLOBAL_PARAMS;