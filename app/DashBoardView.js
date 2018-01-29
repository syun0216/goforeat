import React,{Component} from 'react'
import {View,FlatList} from 'react-native'
import {Container,Header,Content,List,ListItem,Left,Body,Right,Thumbnail,Button,Text} from 'native-base'
import {StackNavigator,TabNavigator} from 'react-navigation'
//views
import ContentView from './views/ContentView'

import GoodsListPageView from './views/GoodsListPageView'
import ArticleView from './views/ArticleView'
import PersonView from './views/PersonView'
//api
import api from './api'

let MainView = StackNavigator({
  Home: {screen: GoodsListPageView},
  Content: {screen: ContentView}
}, {
  headerMode: 'none'
})

const StacksInTabs = TabNavigator({
  GoodsListTab: {
    screen: MainView,
    navigationOptions: {
        tabBarLabel: '商品',
      },
  },
  ArticleTab: {
    screen: ArticleView,
    navigationOptions: {
        tabBarLabel: '文章',
      },
  },
  PersonTab: {
    screen: PersonView,
    navigationOptions: {
        tabBarLabel: '个人中心',
      },
  }
})

export default StacksInTabs
