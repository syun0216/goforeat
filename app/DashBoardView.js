import React, {Component} from 'react'
import {Platform} from 'react-native'
import {
  Container,
  Header,
  Content,
  List,
  ListItem,
  Left,
  Body,
  Right,
  Thumbnail,
  Button,
  Text,
  Icon
} from 'native-base'
//navigation
import {StackNavigator, TabNavigator} from 'react-navigation'
//views
import LoginView from './LoginView'

import ContentView from './views/ContentView'

import SearchView from './views/SearchView'
import GoodsListPageView from './views/GoodsListPageView'
import ArticleView from './views/ArticleView'
import PersonView from './views/PersonView'
//api
import api from './api'
//utils
import ToastUtil from './utils/ToastUtil'

const isLabelShow = Platform.select({ios: false, android: true});

const rootView = TabNavigator({
  GoodsListTab: {
    screen: GoodsListPageView,
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
    screen: PersonView,
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
  tabBarOptions: {
    activeTintColor: '#f07341',
    showLabel: isLabelShow,
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

let MainView = StackNavigator({
  Home: {
    screen: rootView
  },
  Content: {
    screen: ContentView,
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
    screen: LoginView,
    navigationOptions: {
      tabBarVisible: false,
      transitionConfig: {
        isModal: true
      }
    }
  }
}, {headerMode: 'none'})

// 自定义路由拦截
const defaultGetStateForAction = MainView.router.getStateForAction

MainView.router.getStateForAction = (action, state) => {
  console.log('action', action)
  console.log('state', state)
  // if(action.type === 'Navigation/NAVIGATE' && action.routeName === 'Login') {
  //
  // }
  return defaultGetStateForAction(action, state)
}



export default MainView
