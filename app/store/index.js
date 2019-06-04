import { createStore, combineReducers, applyMiddleware } from "redux";
import {createLogger} from "redux-logger";
import promise from "redux-promise-middleware";
// reducers
import * as appReducers from "../reducers/appReducer";
import * as serverReducers from "../reducers/serverReducers";

const rootReducer = combineReducers({
  ...appReducers,
  ...serverReducers
});

const isPromise = obj => (!!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function');

const PendingMiddleware = store => next => action => {
  if(action.type.indexOf('PENDING') > -1) {
    store.dispatch({type: 'SHOW_LOADING'})
  } else if(action.type.indexOf('FULFILLED') > - 1) {
    store.dispatch({type: 'HIDE_LOADING'});
  }
  next(action);
}

const ErrorMiddleware = store => next => action => {
  if(!action.payload instanceof Promise) {
    return next(action);
  }
  else {

    return next(action)
  }
}

const store = createStore(rootReducer, {}, applyMiddleware(
  // PendingMiddleware,
  // ErrorMiddleware,
  // promise(),
  createLogger({collapsed: true, colors: {
    title: () => '#ef5b9c',
    prevState: () => '#9E9E9E',
    action: () => '#03A9F4',
    nextState: () => '#4CAF50',
    error: () => '#F20404',
  },})
));

export default store;
