import {createStore,combineReducers} from 'redux'
// reducers
import {auth,refresh,theme,language,placeSetting,payType,creditCardInfo,toggleAd} from '../reducers/appReducer'

const rootReducer = combineReducers({
  auth,refresh,theme,language,placeSetting,payType,creditCardInfo,toggleAd
});

const store = createStore(rootReducer)

export default store