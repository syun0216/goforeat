/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  View
} from 'react-native';
import {Root} from 'native-base'
import SplashScreen from 'react-native-splash-screen'
import store from './app/store'
import {Provider} from 'react-redux'
import MainView from './app/DashBoardView'
//cache
import appStorage from './app/cache/appStorage'

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class App extends Component<{}> {
  componentDidMount = () => {
    SplashScreen.hide();
    appStorage.getLoginUserJsonData((error,data) => {
      if(error === null) {
        if(store.getState().auth.username === null) {
          store.dispatch({type:'LOGIN',username:data})
        }
      }
    })
  }

  render() {
    return (
      <Root>
        <Provider store={store}>
          <MainView />
        </Provider>
      </Root>
    );
  }
}
