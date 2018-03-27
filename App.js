/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, View, AppState} from 'react-native';
import {Root} from 'native-base'
import store from './app/store'
import {Provider,connect} from 'react-redux'
import DashboardView from './app/DashBoardView'
//components
import Loading from './app/components/Loading'
//cache
import appStorage from './app/cache/appStorage'
//hot reload
import codePush from 'react-native-code-push'
import {addListener} from './app/utils/navigationWithRedux'




class App extends Component < {} > {
  componentWillMount = () => {
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
          // console.log(data)
          store.dispatch({type: 'CHANGE_THEME', theme: data})
        }
      }
    })
  }


  componentDidMount = () => {
    AppState.addEventListener('change', this._handleAppStateChange)
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
        <DashboardView />
      </Provider>
    </Root>);
  }
}

export default codePush(App)
