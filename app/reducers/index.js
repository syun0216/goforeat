import {combineReducers} from 'redux'
import {auth,refresh,stockShop} from './appReducer'
import {filterSort} from './filterReducer'

const rootReducer = combineReducers({
  auth,
  refresh,
  stockShop,
  filterSort
})

export default rootReducer
