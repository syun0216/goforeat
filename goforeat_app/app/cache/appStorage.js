import {
  AsyncStorage
} from "react-native";
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
  setLoginUserJsonData(username, _sid) {
    "use strict";
    user_name = username;
    sid = _sid;
    AsyncStorage.setItem(this._STORAGE_KEY_USER_DATA, JSON.stringify({
      username: username,
      sid: sid
    }));
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
  },
  removeAll() {
    AsyncStorage.clear();
  }
};

let placeStorage = {
  _STORAGE_KEY_PLACE: "storage_key_place",
  setPlace(place) {
    AsyncStorage.setItem(this._STORAGE_KEY_PLACE, place);
  },
  getPlace(callBack) {
    "use strict";
    if (callBack == null) {
      return;
    }
    AsyncStorage.getItem(this._STORAGE_KEY_PLACE, (error, value) => {
      if (error != null || value == null || value.length == 0) {
        callBack(error, null);
        return;
      }
      callBack(null, JSON.parse(value));
    });
  },
  removePlace() {
    AsyncStorage.removeItem(this._STORAGE_KEY_PLACE)
  }
}

let payTypeStorage = {
  _STORAGE_KEY_PAY_TYPE: "storage_key_pay",
  setPayType(pay) {
    AsyncStorage.setItem(this._STORAGE_KEY_PAY_TYPE, pay);
  },
  getPayType(callBack) {
    "use strict";
    if (callBack == null) {
      return;
    }
    AsyncStorage.getItem(this._STORAGE_KEY_PAY_TYPE, (error, value) => {
      if (error != null || value == null || value.length == 0) {
        callBack(error, null);
        return;
      }
      callBack(null, value);
    });
  },
  removePayType() {
    AsyncStorage.removeItem(this._STORAGE_KEY_PAY_TYPE);
  }
}

let creditCardInfo = {
  _STORAGE_KEY_CREDIT_CARD: "storage_credit_card",
  setCreditCardInfo(info) {
    AsyncStorage.setItem(this._STORAGE_KEY_CREDIT_CARD, info);
  },
  getCreditCardInfo(callBack) {
    "use strict";
    if (callBack == null) {
      return;
    }
    AsyncStorage.getItem(this._STORAGE_KEY_CREDIT_CARD, (error, value) => {
      if (error != null || value == null || value.length == 0) {
        callBack(error, null);
        return;
      }
      callBack(null, JSON.parse(value));
    });
  },
  removeCreditCardInfo() {
    AsyncStorage.removeItem(this._STORAGE_KEY_CREDIT_CARD);
  }
}

const appStorage = {
  ...userStorage,
  ...payTypeStorage,
  ...placeStorage,
  ...creditCardInfo
}

module.exports = appStorage