import {combineReducers} from 'redux'
import {auth,refresh,stockShop,theme} from './appReducer'
import {filterSort} from './filterReducer'

const rootReducer = combineReducers({
  auth,
  refresh,
  stockShop,
  theme,
  filterSort
})

export default rootReducer
