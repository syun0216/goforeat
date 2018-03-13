import {LOGIN,LOGOUT,STOCK_ARTICLE,STOCK_SHOP,DELETE_ARTICLE,DELETE_SHOP} from '../actions'
import MainView from '../DashBoardView'
import {NavigationActions} from 'react-navigation';
//cache
import appStorage from '../cache/appStorage'
//utils
import ToastUtil from '../utils/ToastUtil'
import Colors from '../utils/Colors'

// const initialNavState=MainView.router.getStateForAction(NavigationActions.reset({
// 	index: 0,
// 	actions: [
// 	  NavigationActions.navigate({
// 		routeName: 'Home',
// 	  }),
// 	],
// }))

const initialState = {
  navState: MainView.router.getStateForAction(NavigationActions.reset({
    index: 0,
    actions: [
      NavigationActions.navigate({
      routeName: 'Home',
      }),
    ],
  })),
  userState:{
    username:null
  },
  goodsListState: {
    refreshParams:null //註冊后返回首頁強刷
  },
  favoriteStock:{
    articleList:{title:'文章收藏',data:[]},
    shopList:{title:'商店收藏',data:[]}
  },
  themeState: {
    theme: Colors.main_orange
  }
}

export function nav(state=initialState.navState,action) {
  const nextState = MainView.router.getStateForAction(action,state);
    if(typeof state !== 'undefined' && state.routes[state.routes.length - 1].routeName === 'Search'){
    const routes = state.routes.slice(0,state.routes.length - 1)
    const defaultGetStateForAction = MainView.router.getStateForAction
    // routes.push(action)
    return defaultGetStateForAction(action, {
      ...state,
      routes,
      index:routes.length - 1
    })
  }
  return nextState || state;
}

export function auth(state=initialState.userState,action) {
  switch(action.type) {
    case LOGIN:
    appStorage.setLoginUserJsonData(action.username)
    return {
      ...state,
      username: action.username
    };
    case LOGOUT:
    appStorage.removeStoreUser()
    return {
      ...state,
      username: null
    }
    default:return state
  }
}

export function stockShop(state=initialState.favoriteStock.shopList,action) {
  switch(action.type) {
    case STOCK_SHOP: {
      let _data = state.data.concat(action.data)
      return {
        ...state,
        data: _data
      }
    }
    case DELETE_SHOP: {
      return {
        ...state,
        data: state.data.filter(item => item.id !== action.id)
      }
    }
    default:return state
  }
}

export function refresh(state = initialState.goodsListState,action) {
  switch(action.type) {
    case 'REFRESH': return {
      ...state,
      refreshParams:action.refresh
    }
    default: return state
  }
}

export function theme(state = initialState.themeState,action) {
  switch(action.type) {
    case 'CHANGE_THEME':
      appStorage.setTheme(action.theme)
      return {
        ...state,
        theme: action.theme
      }
    default: return state
  }
}

export function http(){

}
