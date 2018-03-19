import {combineReducers} from 'redux'
import {auth,refresh,stockShop,stockArticle, theme,loading} from './appReducer'
import {filterSort} from './filterReducer'

const rootReducer = combineReducers({
  // nav,
  auth,
  refresh,
  stockShop,
  stockArticle,
  theme,
  filterSort,
  loading
})

export default rootReducer
