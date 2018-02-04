import {SAVE_FILTER_PARAMS,RESET_FILTER_PARAMS} from '../actions'
const initialState = {areas:'default',categories:'default',seats:'default'}

export const filterSort = (state=initialState,action) => {
  switch(action.type){
    case SAVE_FILTER_PARAMS:{
      return {
        ...state,
        action.data
      }
    }
    case RESET_FILTER_PARAMS:{
      return {
        areas:'default',categories:'default',seats:'default'
      }
    }
    default:return state
  }
}
