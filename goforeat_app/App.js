/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {Platform,Image} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {Root} from 'native-base'
import store from './app/store'
import {Provider} from 'react-redux';
import DashboardView from './app/DashBoardView';
//cache
import {userStorage,languageStorage,creditCardStorage} from './app/cache/appStorage'
//hot reload
import CodePush from 'react-native-code-push'
//jpush
import JPushModule from 'jpush-react-native';
//utils
import {getLanguage} from './app/utils/DeviceInfo';

class App extends Component < {} > {
  componentWillMount() {
    // console.log(Push);
    // console.log(pushEnabled);
    // api.getNotifications().then(data => console.log(data));
    // appStorage.removeAll()
    userStorage.getData((error, data) => {
      if (error === null && data != null) {
        if (store.getState().auth.username === null) {
          // console.log(data);
          store.dispatch({type: 'LOGIN', username: data.username,sid:data.sid})
        }
      }
    })
    creditCardStorage.getData((error,data) => {
      if(error == null) {
        if(data != null) {
          store.dispatch({type: 'SET_CREDIT_CARD', creditCardInfo: data});
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
