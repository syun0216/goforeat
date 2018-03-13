import {combineReducers} from 'redux'
import {auth,refresh,stockShop,theme,loading} from './appReducer'
import {filterSort} from './filterReducer'

const rootReducer = combineReducers({
  // nav,
  auth,
  refresh,
  stockShop,
  theme,
  filterSort,
  loading
})

export default rootReducer
