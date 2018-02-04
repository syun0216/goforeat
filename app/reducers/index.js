import {combineReducers} from 'redux'
import {auth} from './appReducer'
import {filterSort} from './filterReducer'

const rootReducer = combineReducers({
  auth,
  filterSort
})

export default rootReducer
