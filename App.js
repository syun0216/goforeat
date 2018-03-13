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
import MainView from './app/DashBoardView'
import {addNavigationHelpers} from 'react-navigation'
//cache
import appStorage from './app/cache/appStorage'
//hot reload
import codePush from 'react-native-code-push'
import {addListener} from './app/utils/navigationWithRedux'

class DashBoardView extends Component {
  componentDidMount() {
    console.log(this.props);
  }
  render() {
    return (
      <MainView 
      navigation={addNavigationHelpers({
        dispatch: this.props.dispatch,
        state: this.props.nav,
        addListener,
      })} 
      screenProps={{...this['props']}}
      />
    )
  }
}
const dashboardStateToProps = (state) => ({
  nav: state.nav,
  theme: state.theme.theme,
  user: state.auth.username,
  filterSort: state.filterSort,
  refresh: state.refresh.refreshParams,
  shopList: state.stockShop
})

const dashboardmapDispatchToProps = dispatch => ({
  saveFilter: (data) => dispatch({type:'SAVE_FILTER_PARAMS',data:data}),
  resetFilter: () => dispatch({type:'RESET_FILTER_PARAMS'}),
  userLogin: (username) => dispatch({type:'LOGIN',username:username}),
  userLogout: () => dispatch({type:'LOGOUT'}),
  refreshReset: () => dispatch({type:'REFRESH',refresh:false}),
  stockShop: (item) => dispatch({type:'STOCK_SHOP',data:item}),
  deleteShop: (id) => dispatch({type:'DELETE_SHOP',id:id}),
  changeTheme: (theme) => dispatch({type:'CHANGE_THEME',theme:theme}),
  dispatch: dispatch
})

const DashboardViewWithNav = connect(dashboardStateToProps,dashboardmapDispatchToProps)(DashBoardView)


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
        <DashboardViewWithNav/>
      </Provider>
    </Root>);
  }
}

export default codePush(App)
