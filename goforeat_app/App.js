/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, View, AppState,Alert} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {Root} from 'native-base'
import store from './app/store'
import {Provider,connect} from 'react-redux';
import DashboardView from './app/DashBoardView'
//cache
import appStorage from './app/cache/appStorage'
//hot reload
import CodePush from 'react-native-code-push'
//jpush
import JPushModule from 'jpush-react-native';
//api
import api from './app/api';

class App extends Component < {} > {
  componentWillMount() {
    // console.log(Push);
    // console.log(pushEnabled);
    // api.getNotifications().then(data => console.log(data));
    // appStorage.removeAll()
    SplashScreen.hide(); // 隐藏启动页
    appStorage.getLoginUserJsonData((error, data) => {
      if (error === null && data != null) {
        if (store.getState().auth.username === null) {
          // console.log(data);
          store.dispatch({type: 'LOGIN', username: data.username,sid:data.sid})
        }
      }
    })
    appStorage.getPayType((error,data) => {
      if(error == null) {
        if(data != null) {
          store.dispatch({type: 'SET_PAY_TYPE', paytype: data});
        }
      }
    })
    appStorage.getCreditCardInfo((error,data) => {
      if(error == null) {
        if(data != null) {
          store.dispatch({type: 'SET_CREDIT_CARD', creditCardInfo: data});
        }
      }
    })
  }


  componentDidMount = () => {
    if(Platform.OS == 'android') {
      this._jpush_android_setup()
    }else {
      JPushModule.setupPush()
    }    
    this._jpushCommonEvent();
  }

  componentWillUnmount = () => {
    JPushModule.removeReceiveNotificationListener('receiveNotification');
  }

  _jpush_android_setup = () => {
    JPushModule.initPush();
    JPushModule.notifyJSDidLoad(resultCode => {
      if (resultCode === 0) {
      }
    })
  }

  _jpushCommonEvent() {
    if(Platform.OS == 'ios') {
      JPushModule.setBadge(0, success => {})
    }
    // JPushModule.addReceiveOpenNotificationListener(map => {
      
    // })
  }

  render() {
    return (<Root>
      <Provider store={store}>
        <DashboardView />
      </Provider>
    </Root>);
  }
}


export default CodePush(App)
