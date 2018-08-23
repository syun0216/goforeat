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
    android: 60
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

export const em = (val) => val * ratioX 

export const currentPlatform = Platform.OS == 'ios' ? 1 : 2;

export default GLOBAL_PARAMS;