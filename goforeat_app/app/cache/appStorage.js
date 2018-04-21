import { AsyncStorage } from "react-native";
import store from '../store'

let user_name = null;
let sid = null;
let userStorage = {
  _STORAGE_KEY_USER_DATA: "storage_key_user_data",
  isLogin: user_name,
  sid: null,
  /**
   * 存储用户信息
   * @param userInfo("id":"xxxxx","name":"xxxxx")
   */
  setLoginUserJsonData(username,_sid) {
    "use strict";
    user_name = username;
    sid = _sid;
    AsyncStorage.setItem(this._STORAGE_KEY_USER_DATA, JSON.stringify({username:username,sid: sid}));
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
      callBack(null, JSON.parse(value));
    });
  },
  /**
   * 清空用户信息
   */
  removeStoreUser() {
    user_name = null;
    sid = null;
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

let themeStorage = {
  _STORAGE_KEY_THEME: "storage_key_theme",
  setTheme(theme) {
      AsyncStorage.setItem(this._STORAGE_KEY_THEME, theme);
  },
  getTheme(callBack) {
    "use strict";
    if (callBack == null) {
      return;
    }
    AsyncStorage.getItem(this._STORAGE_KEY_THEME, (error, value) => {
      if (error != null || value == null || value.length == 0) {
        callBack(error, null);
        return;
      }
      callBack(null, value);
    });
  },
  removeAll() {
    AsyncStorage.clear()
  }

}

const appStorage = {
  ...userStorage,
  ...shopListStorage,
  ...themeStorage
}

module.exports = appStorage
