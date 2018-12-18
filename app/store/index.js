import { createStore, combineReducers, applyMiddleware } from "redux";
import {createLogger} from "redux-logger";
import promise from "redux-promise-middleware";
import errorMiddleware from "./errorCatchMiddleware";
// reducers
import * as appReducers from "../reducers/appReducer";

const rootReducer = combineReducers({
  ...appReducers
});

const store = createStore(rootReducer, {}, applyMiddleware(
  promise(),
  errorMiddleware,
  createLogger({collapsed: true, colors: {
    title: () => '#ef5b9c',
    prevState: () => '#9E9E9E',
    action: () => '#03A9F4',
    nextState: () => '#4CAF50',
    error: () => '#F20404',
  },})
));

export default store;
