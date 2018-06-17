import {createStore,combineReducers} from 'redux'
// reducers
import {auth,stockShop,stockArticle,refresh,theme,language,placeSetting} from '../reducers/appReducer'

const rootReducer = combineReducers({
  auth,stockShop,stockArticle,refresh,theme,language,placeSetting
});

const store = createStore(rootReducer)

export default store