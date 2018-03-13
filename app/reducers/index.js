import {combineReducers} from 'redux'
import {nav,auth,refresh,stockShop,theme} from './appReducer'
import {filterSort} from './filterReducer'

const rootReducer = combineReducers({
  nav,
  auth,
  refresh,
  stockShop,
  theme,
  filterSort
})

export default rootReducer
