import {combineReducers} from 'redux'
import {auth,refresh} from './appReducer'
import {filterSort} from './filterReducer'

const rootReducer = combineReducers({
  auth,
  refresh,
  filterSort
})

export default rootReducer
