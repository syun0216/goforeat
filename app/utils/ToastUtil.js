/**
 * 通用toast
 */

// 'use strict';

 import Toast from 'react-native-root-toast';

const ToastUtil = {

    showWithMessage(message) {
        Toast.show(message, {duration: Toast.durations.SHORT,position:Toast.positions.CENTER});
    },

    showHttpRequestFailWithMessage(message) {
        if (message == null || message.length == 0) {
            message = '请检查网络连接状态,稍后再试';
        }

        this.showWithMessage(message);
    },

    showHttpRequestFail() {
        this.showHttpRequestFailWithMessage(null);
    },

    showAccountIsNotLogin() {
        this.showWithMessage("请确认已登录");
    },
};

export default ToastUtil;