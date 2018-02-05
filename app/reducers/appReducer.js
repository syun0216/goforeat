import {LOGIN,LOGOUT} from '../actions'
import appStorage from '../utils/appStorage'

const initialState = {
  userState:{
    username:null
  },
  goodsListState: {
    refreshParams:null //註冊后返回首頁強刷
  }
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
    appStorage.clearStoreUser();
    return {
      ...state,
      username: null
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

export function http(){

}

export function theme(){

}
