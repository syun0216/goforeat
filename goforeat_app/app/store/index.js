import {createStore,combineReducers} from 'redux'
// reducers
import {auth,stockShop,stockArticle,refresh,theme,language,placeSetting,payType} from '../reducers/appReducer'

const rootReducer = combineReducers({
  auth,stockShop,stockArticle,refresh,theme,language,placeSetting,payType
});

const store = createStore(rootReducer)

export default store