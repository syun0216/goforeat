import {
  AsyncStorage
} from "react-native";
import JSONUtils from '../utils/JSONUtils';
/**
 *缓存构造函数
 *
 * @param {*} key 缓存键名
 */
function storageFactory(key) {
  this.key = key;
  this.setData = function(data) {
    if(Object.prototype.toString.call(data) == "[object String]") {
      AsyncStorage.setItem(this.key, data);
    } else {
      AsyncStorage.setItem(this.key, JSON.stringify(data));
    }
  };
  this.getData = function(callBack) {
    "use strict";
    if (callBack == null) {
      return;
    }
    AsyncStorage.getItem(this.key, (error, value) => {
      if (error != null || value == null || value.length == 0) {
        callBack(error, null);
        return;
      }
      if(JSONUtils.isJsonString(value)) {
        callBack(null,JSON.parse(value))
      }else {
        callBack(null,value);
      }
    });
  };
  this.removeData = function() {
    AsyncStorage.removeItem(this.key);
  };
  this.removeAll = function() {
    AsyncStorage.clear();
  }
}

export const userStorage = new storageFactory('storage_key_user_data');

export const placeStorage = new storageFactory('storage_key_place');

export const languageStorage = new storageFactory('storage_key_language');

export const payTypeStorage = new storageFactory('storage_key_pay');

export const creditCardStorage = new storageFactory('storage_credit_card');

export const advertisementStorage = new storageFactory('storage_advertisement');