import {
  LOGIN,
  LOGOUT,
  SHOW_LOADING,
  SHOW_LOADING_MODAL,
  HIDE_LOADING,
  HIDE_LOADING_MODAL,
  CHANGE_LANGUAGE,
  STOCK_PLACE,
  DELETE_PLACE,
  CHANGE_THEME,
  SET_PAY_TYPE,
  SHOW_AD,
  HIDE_AD,
  STORE_PLACE_LIST,
  SAVE_CACHE,
  RESET_CACHE,
  SAVE_ACTIVITY,
  RESET_ACTIVITY
} from "../actions";
//cache
import { userStorage } from "../cache/appStorage";
//utils
import Colors from "../utils/Colors";
import { isEmpty } from "../utils/global_params";
//api
import { setPayment } from "../api/request";

const initialState = {
  userState: {
    username: null,
    sid: null,
    nickName: "",
    profileImg: ""
  },
  loginState: {
    showLogin: false,
    toPage: null
  },
  loadingState: {
    showLoading: true,
    showLoadingModal: false
  },
  placeState: {
    place: null,
    placeList: []
  },
  themeState: {
    theme: Colors.main_orange
  },
  languageState: {
    language: "zh"
  },
  paytypeState: {
    payType: "cash"
  },
  creditState: {
    creditCardInfo: null
  },
  advertimentState: {
    isAdvertisementShow: true
  },
  pageState: {}, //页面缓存
  activityState: {}
};

export function pageCache(state = initialState.pageState, action) {
  switch (action.type) {
    case SAVE_CACHE: {
      return {
        ...state,
        ...action.pageCache
      };
    }
    case RESET_CACHE: {
      return {};
    }
    default:
      return {};
  }
}

export function toggleAd(state = initialState.advertimentState, action) {
  switch (action.type) {
    case SHOW_AD:
      return {
        ...state,
        isAdvertisementShow: true
      };
    case HIDE_AD:
      return {
        ...state,
        isAdvertisementShow: false
      };
    default:
      return state;
  }
}

export function loading(state = initialState.loadingState, action) {

  switch (action.type) {
    case SHOW_LOADING:
      state.showLoading = true;
      break;
    case HIDE_LOADING:
      state.showLoading = false;
      break;
    case SHOW_LOADING_MODAL:
      state.showLoadingModal = true;
      break;
    case HIDE_LOADING_MODAL:
      state.showLoadingModal = false;
      break;
  }
  return state;
}

export function auth(state = initialState.userState, action) {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        username: action.username,
        sid: action.sid,
        nickName: action.nickName,
        profileImg: action.profileImg
      };
    case LOGOUT:
      userStorage.removeData();
      return {
        ...state,
        username: null
      };
    default:
      return state;
  }
}

export function login(state = initialState.loginState, action) {
  switch (action.type) {
    case "CHANGE_LOGIN_STATUS": {
      return {
        ...state,
        showLogin: action.showLogin
      };
    }
    case "SET_LOGIN_TO_PAGE": {
      return {
        ...state,
        toPage: action.toPage
      };
    }
    default:
      return state;
  }
}

export function placeSetting(state = initialState.placeState, action) {
  switch (action.type) {
    case STOCK_PLACE: {
      state["place"] = action.place;
      return state;
    }
    case DELETE_PLACE: {
      state["place"] = null;
      return state;
    }
    case STORE_PLACE_LIST: {
      state["placeList"] = action.placeList;
      return state;
    }
    default:
      return state;
  }
}

export function payType(state = initialState.paytypeState, action) {
  switch (action.type) {
    case SET_PAY_TYPE: {
      setPayment(action.paytype).then(data => {
        !isEmpty(action.callback) && action.callback();
      }).catch(err => {});
      return {
        ...state,
        payType: action.paytype
      };
    }
    default:
      return state;
  }
}

export function theme(state = initialState.themeState, action) {
  switch (action.type) {
    case CHANGE_THEME:
      return {
        ...state,
        theme: action.theme
      };
    default:
      return state;
  }
}

export function language(state = initialState.languageState, action) {
  switch (action.type) {
    case CHANGE_LANGUAGE:
      return { ...state, language: action.language };
    default:
      return state;
  }
}


export function activityInfo(state = {}, action) {
  switch(action.type) {
    case SAVE_ACTIVITY: {
      return { ...state, activity: action.data};
    }
    case RESET_ACTIVITY: {
      return { ...state, activity: {} }
    }
    default: return state;
  }
}