import React,{Component} from 'react'
import {View,FlatList} from 'react-native'
import {Container,Header,Content,List,ListItem,Left,Body,Right,Thumbnail,Button,Text} from 'native-base'
//icon
import EntypoIcon from 'react-native-vector-icons/Entypo';
//navigation
import {StackNavigator,TabNavigator} from 'react-navigation'
//views
import LoginView from './LoginView'

import ContentView from './views/ContentView'

import GoodsListPageView from './views/GoodsListPageView'
import ArticleView from './views/ArticleView'
import PersonView from './views/PersonView'
//api
import api from './api'

let MainView = StackNavigator({
  Home: {screen: GoodsListPageView},
  Content: {screen: ContentView, navigationOptions: {
    tabBarVisible: false,
  }},
  Login: {screen: LoginView,navigationOptions: {
    tabBarVisible: false
  }}
}, {
  headerMode: 'none'
})

const StacksInTabs = TabNavigator({
  GoodsListTab: {
    screen: MainView,
    navigationOptions: {
        tabBarLabel: '商品',
        tabBarIcon: ({tintColor}) => (
          <EntypoIcon size={35} name="menu" style={{color:tintColor}}/>
        )
      },
  },
  ArticleTab: {
    screen: ArticleView,
    navigationOptions: {
        tabBarLabel: '文章',
        tabBarIcon: ({tintColor}) => (
          <EntypoIcon size={30} name="feather" style={{color:tintColor}}/>
        )
      },
  },
  PersonTab: {
    screen: PersonView,
    navigationOptions: {
        tabBarLabel: '个人中心',
        tabBarIcon: ({tintColor}) => (
          <EntypoIcon size={30} name="man" style={{color:tintColor}}/>
        )
      },
  }
},{
  animationEnabled: true,
  tabBarOptions: {
    activeTintColor: '#f07341',
    showLabel:false,
    // tabStyle: {
    //   height:100
    // }
  }
})

export default StacksInTabs
