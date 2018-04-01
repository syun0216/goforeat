/**
 * 字符串处理工具
 */


'use strict'

const TextUtils = {

    isEmpty(text) {
        return text == null || text.length == 0;
    },

    isAllBlank(text) {
        let regex = /^\s+$/;
        return regex.test(text);
    },

    isDecimal(text) {
        if (text == null || text.length == 0) {
            return false;
        }

        return !isNaN(parseFloat(text)) && isFinite(text);
    },
}

module.exports = TextUtils;