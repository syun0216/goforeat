import {createStore,applyMiddleware} from 'redux'
import rootReducer from '../reducers'
import {middleware} from '../utils/navigationWithRedux'

const store = createStore(rootReducer,applyMiddleware(middleware))

export default store
