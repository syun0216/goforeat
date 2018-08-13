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
import DashboardView from './app/DashBoardView'
//components
import AdervertiseView from './app/components/AdvertiseView';
//cache
import {advertisementStorage,userStorage,payTypeStorage,languageStorage,creditCardStorage} from './app/cache/appStorage'
//hot reload
import CodePush from 'react-native-code-push'
//jpush
import JPushModule from 'jpush-react-native';
//utils
import {getLanguage} from './app/utils/DeviceInfo';
import JSONUtils from './app/utils/JSONUtils';
//api
import {adSpace} from './app/api/request';

class App extends Component < {} > {
  _interval = null; // 首页广告倒计时
  state = {
    advertiseImg: '',
    advertiseCountdown: 5,
    isAdvertiseShow: false
  };
  componentWillMount() {
    // console.log(Push);
    // console.log(pushEnabled);
    // api.getNotifications().then(data => console.log(data));
    // appStorage.removeAll()
    advertisementStorage.getData((error,data) => {
      if(error == null) {
        if(data != null) {
          this.setState({advertiseImg: data.image,isAdvertiseShow: true});
          this._advertiseInterval();
        }
        this._getAdvertise(data);
      }
    })
    userStorage.getData((error, data) => {
      if (error === null && data != null) {
        if (store.getState().auth.username === null) {
          // console.log(data);
          store.dispatch({type: 'LOGIN', username: data.username,sid:data.sid})
        }
      }
    })
    payTypeStorage.getData((error,data) => {
      if(error == null) {
        if(data != null) {
          store.dispatch({type: 'SET_PAY_TYPE', paytype: data});
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

  //api
  _getAdvertise(old_data) {
    adSpace().then(data => {
      if(data.ro.respCode == '0000') {
        if(old_data != null) { // 如果缓存不为空
          if(JSONUtils.jsonDeepCompare(old_data, data.data[0])) {
            return; // 判断缓存是否与服务器数据相等，如果相等则不做操作
          } else{ // 如果缓存不等则覆盖本地缓存为服务器数据
            advertisementStorage.setData(data.data[0]);
            Image.prefetch(data.data[0].image)
          }
        }else { // 如果缓存为空，则缓存到本地
          advertisementStorage.setData(data.data[0]);
          Image.prefetch(data.data[0].image)
        }
      }
    })
    .catch(err => {
      if (axios.isCancel(thrown)) {
        console.log('Request canceled', thrown.message);
      } 
    })
    
  }

  _advertiseInterval = () => {
    this._interval = setInterval(() => {
      if(this.state.advertiseCountdown > 0) {
        this.setState({
          advertiseCountdown: this.state.advertiseCountdown - 1,
        })
        // console.log(this.state.advertiseCountdown);
      }else {
        this.setState({
          isAdvertiseShow: false
        })
        clearInterval(this._interval);
      }
    },1000)
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
  _renderAdvertisementView() {
    return (
      <AdervertiseView 
      modalVisible={this.state.isAdvertiseShow} Image={this.state.advertiseImg} countDown={this.state.advertiseCountdown}
      />
    )
  }

  render() {
    return (<Root>
      {this._renderAdvertisementView()}
      <Provider store={store}>
        <DashboardView />
      </Provider>
    </Root>);
  }
}


export default CodePush(App)
