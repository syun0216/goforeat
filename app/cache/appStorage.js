import { AsyncStorage } from "react-native";
import store from '../store'

let user_name = null;

let userStorage = {
  _STORAGE_KEY_USER_DATA: "storage_key_user_data",
  isLogin: user_name,
  /**
   * 存储用户信息
   * @param userInfo("id":"xxxxx","name":"xxxxx")
   */
  setLoginUserJsonData(username) {
    "use strict";
    user_name = username;
    AsyncStorage.setItem(this._STORAGE_KEY_USER_DATA, JSON.stringify(username));
  },
  /**
   * 获取登录用户信息
   * @param callBack 返回error和用户的信息，json("id":"xxxx","name":"xxx")
   */
  getLoginUserJsonData(callBack) {
    "use strict";
    if (callBack == null) {
      return;
    }
    if (user_name != null) {
      callBack(null, user_name);
      return;
    }

    AsyncStorage.getItem(this._STORAGE_KEY_USER_DATA, (error, value) => {
      if (error != null || value == null || value.length == 0) {
        callBack(error, null);
        return;
      }
      this.isLogin = !!user_name;
      user_name = JSON.parse(value);
      callBack(null, user_name);
    });
  },
  /**
   * 清空用户信息
   */
  removeStoreUser() {
    user_name = null;
    AsyncStorage.removeItem(this._STORAGE_KEY_USER_DATA);
  }
};

let shopListStorage = {
  _STORAGE_KEY_SHOP_LIST: "storage_key_shop_list",
  setShopListData() {
    // console.log(store.getState().stockShop)
    if(store.getState().stockShop.data.length > 0 ){
      AsyncStorage.setItem(this._STORAGE_KEY_SHOP_LIST, JSON.stringify(store.getState().stockShop));
    }
  },
  getShopListData(callBack) {
    "use strict";
    if (callBack == null) {
      return;
    }
    AsyncStorage.getItem(this._STORAGE_KEY_SHOP_LIST, (error, value) => {
      if (error != null || value == null || value.length == 0) {
        callBack(error, null);
        return;
      }
      callBack(null, JSON.parse(value));
    });
  },
  removeShopList() {
    AsyncStorage.removeItem(this._STORAGE_KEY_SHOP_LIST);
  }
}

const appStorage = {
  ...userStorage,
  ...shopListStorage
}

module.exports = appStorage
