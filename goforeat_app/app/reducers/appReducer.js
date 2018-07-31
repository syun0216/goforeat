import {
  LOGIN,
  LOGOUT,
  STOCK_ARTICLE,
  STOCK_SHOP,
  DELETE_ARTICLE,
  DELETE_SHOP,
  IS_LOADING,
  IS_NOT_LOADING,
  CHANGE_LANGUAGE,
  STOCK_PLACE,
  DELETE_PLACE,
  CHANGE_THEME,
  REFRESH,
  SET_PAY_TYPE,
  SET_CREDIT_CARD,
  REMOVE_CREDIT_CARD
} from "../actions";
//cache
import appStorage from "../cache/appStorage";
//utils
import Colors from "../utils/Colors";

const initialState = {
  userState: {
    username: null,
    sid: null
  },
  placeState: {
    place: null
  },
  goodsListState: {
    refreshParams: null //註冊后返回首頁強刷
  },
  themeState: {
    theme: Colors.main_orange
  },
  languageState: {
    language: 'zh'
  },
  paytypeState: {
    payType: 'cash'
  },
  creditState: {
    creditCardInfo: null
  }
};

export function loading(state = initialState.loading, action) {
  switch (action.type) {
    case IS_LOADING:
      return true
    case IS_NOT_LOADING:
      return false
    default:
      return state;
  }
}

export function auth(state = initialState.userState, action) {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        username: action.username,
        sid: action.sid

      };
    case LOGOUT:
      appStorage.removeStoreUser();
      return {
        ...state,
        username: null
      };  
    default:
      return state;
  }
}

export function placeSetting(state = initialState.placeState, action) { 
  switch(action.type) {
    case STOCK_PLACE: {
    return {
      ...state,
      place: action.place
    }}
    case DELETE_PLACE: return {
      ...state,
      place: null
    }
    default: return state;
  }
 }

export function payType(state = initialState.paytypeState, action) {
  switch(action.type) {
    case SET_PAY_TYPE: {
      return {
        ...state,
        payType: action.paytype
      }
    }
    default: return state;
  }
}

export function creditCardInfo(state = initialState.creditState, action) {
  switch(action.type) {
    case SET_CREDIT_CARD: {
      return {
        ...state,
        creditCardInfo: action.creditCardInfo
      }
    };
    case REMOVE_CREDIT_CARD: {
      return {
        ...state,
        creditCardInfo: null
      }
    }
    default: return state;
  }
}

export function refresh(state = initialState.goodsListState, action) {
  switch (action.type) {
    case REFRESH:
      return {
        ...state,
        refreshParams: action.refresh
      };
    default:
      return state;
  }
}

export function theme(state = initialState.themeState, action) {
  switch (action.type) {
    case CHANGE_THEME:
      appStorage.setTheme(action.theme);
      return {
        ...state,
        theme: action.theme
      };
    default:
      return state;
  }
}

export function language(state=initialState.languageState,action) {
  switch(action.type) {
    case CHANGE_LANGUAGE: return {...state,language: action.language};
    default: return state
  }
}