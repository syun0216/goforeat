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
    ios: 65,
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

// 将会包装事件的 debounce 函数
export function debounce(fn, delay) {
  // 维护一个 timer
  let timer = null;

  return function() {
    // 通过 ‘this’ 和 ‘arguments’ 获取函数的作用域和变量
    let context = this;
    let args = arguments;

    clearTimeout(timer);
    timer = setTimeout(function() {
      fn.apply(context, args);
    }, delay);
  }
}

export const em = (val) => val * ratioX 

export default GLOBAL_PARAMS;