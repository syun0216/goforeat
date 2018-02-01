import {LOGIN,LOGOUT} from '../actions'
import appStorage from '../utils/appStorage'

const initialState = {
  userState:{
    username:null
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

export function http(){

}

export function theme(){

}
