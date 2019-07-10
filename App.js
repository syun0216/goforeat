/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import SplashScreen from 'react-native-splash-screen';
import {Root} from 'native-base'
import store from './app/store'
import {Provider} from 'react-redux';
import DashboardView from './app/DashBoardView';
//cache
import {userStorage,languageStorage,debugStorage} from './app/cache/appStorage'
//hot reload
import CodePush from 'react-native-code-push'
//utils
import {getLanguage, isDebugVersion} from './app/utils/DeviceInfo';
//api config
import {reinitServer} from "./app/api/config";

class App extends Component < {} > {
  componentWillMount() {
    // console.log(Push);
    // console.log(pushEnabled);
    // api.getNotifications().then(data => console.log(data));
    // appStorage.removeAll()
    if(isDebugVersion()) {
      debugStorage.getData((err, data) => {
        if(err == null && data) {
          // console.log('data', data)
          reinitServer(data.value);
        }
      })
    }

    userStorage.getData((error, data) => {
      if (error === null && data != null) {
        if (store.getState().auth.username === null) {
          store.dispatch({type: 'LOGIN', ...data})
        }
      }
    })
    languageStorage.getData((error,data) => {
      if(error == null) {
        if(data != null) {
          store.dispatch({type: 'CHANGE_LANGUAGE', language: data});
        }
        else {
          if(getLanguage().indexOf('zh') == -1) { //判断系统语言环境,如果不是中文环境则自动设定英文语言
            store.dispatch({type: 'CHANGE_LANGUAGE', language: 'en'});
          }
        }
      }
    })
    
    SplashScreen.hide(); // 隐藏启动页
  }
  //render
  

  render() {
    return (<Root>
      <Provider store={store}>
        <DashboardView />
      </Provider>
    </Root>);
  }
}


export default CodePush(App)
