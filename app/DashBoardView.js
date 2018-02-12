import React, {Component} from 'react'
import {Platform, View, Text, TouchableOpacity} from 'react-native'
import {Icon} from 'native-base'
//navigation
import {StackNavigator, TabNavigator, DrawerNavigator} from 'react-navigation'
//views
import LoginView from './LoginView'
import RegisterView from './RegisterView'
import SettingView from './SettingView'

import ContentView from './views/ContentView'

import SearchView from './views/SearchView'
import GoodsListPageView from './views/GoodsListPageView'
import ArticleView from './views/ArticleView'
import PersonView from './views/PersonView'
import MyFavoriteView from './views/MyFavoriteVIew'
//api
import api from './api'
//utils
import ToastUtil from './utils/ToastUtil'
import LinkingUtils from './utils/LinkingUtils'
import GLOBAL_PARAMS from './utils/global_params'
//react-redux
import {connect} from 'react-redux'
import {userStateAndDispatch,
      contentStateAndDispatch,
      goodsListStateAndDispatch,
      loginStateAndDispatch,
      registerStateAndDispatch,
      filterStateAndDispatch,
      personStateAndDispatch,
      myFavoriteStateAndDispatch} from './utils/mapStateAndDispatch'
//store
import store from './store'

const tabView = TabNavigator({
  GoodsListTab: {
    screen: connect(goodsListStateAndDispatch.mapStateToProps, goodsListStateAndDispatch.mapDispatchToProps)(GoodsListPageView),
    navigationOptions: {
      tabBarLabel: '商品',
      tabBarIcon: ({tintColor}) => (<Icon size={35} name="md-list-box" style={{
          color: tintColor
        }}/>)
    }
  },
  ArticleTab: {
    screen: ArticleView,
    navigationOptions: {
      tabBarLabel: '文章',
      tabBarIcon: ({tintColor}) => (<Icon size={28} name="md-images" style={{
          color: tintColor
        }}/>)
    }
  },
  PersonTab: {
    screen: connect(personStateAndDispatch.mapStateToProps, personStateAndDispatch.mapDispatchToProps)(PersonView),
    navigationOptions: {
      tabBarLabel: '個人中心',
      tabBarIcon: ({tintColor}) => (<Icon size={35} name="md-contact" style={{
          color: tintColor
        }}/>)
    }
  }
}, {
  animationEnabled: true,
  tabBarPosition: 'bottom',
  lazy:true, //该属性只会加载tab的当前view
  tabBarOptions: {
    activeTintColor: '#f07341',
    showLabel: false,
    showIcon: true,
    inactiveTintColor: '#707070',
    activeTintColor: '#f07341',
    style: {
      backgroundColor: '#fff'
    },
    // tabStyle: {
    //   height:100
    // }
  }
})

const darwerView = DrawerNavigator({
  GoodsListDrawer: {
    screen: tabView
  }
}, {
  drawerWidth: 240,
  drawerPosition: 'left',
  contentComponent: props => (<View style={{
      position: 'relative',
      flex: 1,
      height: GLOBAL_PARAMS._winHeight
    }}>
    <View style={{
        alignSelf: 'center',
        marginTop: 100
      }}>
      <Text>Goforeat v1.0.0</Text>
    </View>
    <TouchableOpacity style={{
        position: 'absolute',
        bottom: 30,
        right: 50
      }} onPress={() => LinkingUtils.dialPhoneWithNumber('97926095')}>
      <View>
        <Text style={{
            fontSize: 18
          }}>聯繫電話:97926095</Text>
      </View>
    </TouchableOpacity>
  </View>)
})

let MainView = StackNavigator({
  Home: {
    screen: darwerView
  },
  Content: {
    screen: connect(contentStateAndDispatch.mapStateToProps,contentStateAndDispatch.mapDispatchToProps)(ContentView),
    navigationOptions: {
      tabBarVisible: false
    }
  },
  Search: {
    screen: SearchView,
    navigationOptions: {
      tabBarVisible: false
    }
  },
  Login: {
    screen: connect(loginStateAndDispatch.mapStateToProps, loginStateAndDispatch.mapDispatchToProps)(LoginView),
    navigationOptions: {
      tabBarVisible: false,
      transitionConfig: {
        isModal: true
      }
    }
  },
  Register: {
    screen: connect(registerStateAndDispatch.mapStateToProps, registerStateAndDispatch.mapDispatchToProps)(RegisterView)
  },
  Setting: {
    screen: SettingView
  },
  MyFavorite: {
    screen: connect(myFavoriteStateAndDispatch.mapStateToProps,myFavoriteStateAndDispatch.mapDispatchToProps)(MyFavoriteView)
  }
}, {headerMode: 'none'})

// 自定义路由拦截
const defaultGetStateForAction = MainView.router.getStateForAction

MainView.router.getStateForAction = (action, state) => {
  console.log('action', action)
  console.log('state', state)
  if (action.type === 'Navigation/NAVIGATE' && action.routeName === 'Login' && store.getState().auth.username !== null) {
    ToastUtil.show('你不能进入', 1000, 'bottom', 'danger')
    return null
  }
  if (action.type === 'Navigation/RESET') {
    store.dispatch({type: 'REFRESH', refresh: action.actions[0].params.refresh})
  }
  if(typeof state !== 'undefined' && state.routes[state.routes.length - 1].routeName === 'Search'){
    const routes = state.routes.slice(0,state.routes.length - 1)
    // routes.push(action)
    return defaultGetStateForAction(action, {
      ...state,
      routes,
      index:routes.length - 1
    })
  }
  return defaultGetStateForAction(action, state)
}

export default MainView
