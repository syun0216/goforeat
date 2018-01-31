import {combineReducers} from 'redux'
import {auth} from './appReducer'

const rootReducer = combineReducers({
  auth
})

export default rootReducer