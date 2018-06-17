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
  REFRESH
} from "../actions";
//cache
import appStorage from "../cache/appStorage";
//utils
import Colors from "../utils/Colors";

// const initialNavState=MainView.router.getStateForAction(NavigationActions.reset({
// 	index: 0,
// 	actions: [
// 	  NavigationActions.navigate({
// 		routeName: 'Home',
// 	  }),
// 	],
// }))

const initialState = {
  // navState: MainView.router.getStateForAction(
  //   NavigationActions.reset({
  //     index: 0,
  //     actions: [
  //       NavigationActions.navigate({
  //         routeName: "Home"
  //       })
  //     ]
  //   })
  // ),
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
  favoriteStock: {
    articleList: { title: "關注的文章", data: [] },
    shopList: { title: "關注的商店", data: [] }
  },
  themeState: {
    theme: Colors.main_orange
  },
  loading: false,
  languageState: {
    language: 'zh'
  }
};

// export function nav(state = initialState.navState, action) {
//   console.log(state, action);
//   const nextState = MainView.router.getStateForAction(action, state);
//   return nextState || state;
// }

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

export function stockShop(state = initialState.favoriteStock.shopList, action) {
  switch (action.type) {
    case STOCK_SHOP: {
      let _data = state.data.concat(action.data);
      return {
        ...state,
        data: _data
      };
    }
    case DELETE_SHOP: {
      return {
        ...state,
        data: state.data.filter(item => item.id !== action.id)
      };
    }
    default:
      return state;
  }
}

export function stockArticle(state = initialState.favoriteStock.articleList, action) {
  switch (action.type) {
    case STOCK_ARTICLE: {
      let _data = state.data.concat(action.data);
      return {
        ...state,
        data: _data
      };
    }
    case DELETE_ARTICLE: {
      return {
        ...state,
        data: state.data.filter(item => item.id !== action.id)
      };
    }
    default:
      return state;
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

export function http() {}

export function language(state=initialState.languageState,action) {
  switch(action.type) {
    case CHANGE_LANGUAGE: return {...state,language: action.language};
    default: return state
  }
}