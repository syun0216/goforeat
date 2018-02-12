/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, View, AppState} from 'react-native';
import {Root} from 'native-base'
import store from './app/store'
import {Provider} from 'react-redux'
import MainView from './app/DashBoardView'
//cache
import appStorage from './app/cache/appStorage'

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' + 'Shake or press menu button for dev menu'
});

export default class App extends Component < {} > {
  componentDidMount = () => {
    AppState.addEventListener('change', this._handleAppStateChange)

    appStorage.getLoginUserJsonData((error, data) => {
      if (error === null) {
        if (store.getState().auth.username === null) {
          store.dispatch({type: 'LOGIN', username: data})
        }
      }
    })
    // appStorage.removeAll()
    appStorage.getShopListData((error, data) => {
      if (error === null) {
        if (data !== null) {
          store.dispatch({type: 'STOCK_SHOP', data: data.data})
        }
      }
    })
    //theme
    appStorage.getTheme((error, data) => {
      if (error === null) {
        if (data !== null) {
          console.log(data)
          store.dispatch({type: 'CHANGE_THEME', theme: data})
        }
      }
    })
  }

  componentWillUnmount = () => {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {
    if (nextAppState.match(/inactive/)) {
      appStorage.setShopListData()
      // return
    }
    // this.setState({currentAppState: nextAppState});
    // console.log(nextAppState)
  }

  render() {
    return (<Root>
      <Provider store={store}>
        <MainView/>
      </Provider>
    </Root>);
  }
}
