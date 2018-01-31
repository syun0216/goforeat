import {LOGIN,LOGOUT} from '../actions'

const initialState = {
  username:null
}

export function auth(state=initialState,action) {
  switch(action.type) {
    case LOGIN:return {
      ...state,
      username: action.username
    };
    case LOGOUT:return {
      ...state,
      username: null
    }
    default:return state
  }
}