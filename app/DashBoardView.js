import React, {Component} from 'react'
import {Platform,View,Text,TouchableOpacity} from 'react-native'
import {
  Icon
} from 'native-base'
//navigation
import {StackNavigator, TabNavigator,DrawerNavigator} from 'react-navigation'
//views
import LoginView from './LoginView'
import RegisterView from './RegisterView'

import ContentView from './views/ContentView'

import SearchView from './views/SearchView'
import GoodsListPageView from './views/GoodsListPageView'
import ArticleView from './views/ArticleView'
import PersonView from './views/PersonView'
//api
import api from './api'
//utils
import ToastUtil from './utils/ToastUtil'
import LinkingUtils from './utils/LinkingUtils'
import GLOBAL_PARAMS from './utils/global_params'
//react-redux
import {connect} from 'react-redux'
import {userStateAndDispatch,filterStateAndDispatch} from './utils/mapStateAndDIspatch'
//store
import store from './store'

const tabView = TabNavigator({
  GoodsListTab: {
    screen: connect(filterStateAndDispatch.mapStateToProps,filterStateAndDispatch.mapDispatchToProps)(GoodsListPageView),
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
    screen: connect(userStateAndDispatch.mapStateToProps,userStateAndDispatch.mapDispatchToProps)(PersonView),
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
    showLabel: false,
    showIcon:true,
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
},{
  drawerWidth:240,
  drawerPosition: 'left',
  contentComponent: props => (
    <View style={{position:'relative',flex:1,height:GLOBAL_PARAMS._winHeight}}>
      <View style={{alignSelf:'center',marginTop:100}}>
        <Text>Goforeat v1.0.0</Text>
      </View>
      <TouchableOpacity style={{position:'absolute',bottom:30,right:50}} onPress={() => LinkingUtils.dialPhoneWithNumber('97926095')}>
        <View>
          <Text style={{fontSize:18}}>聯繫電話:97926095</Text>
        </View>
      </TouchableOpacity>
    </View>
  )
})

let MainView = StackNavigator({
  Home: {
    screen: darwerView
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
    screen: connect(userStateAndDispatch.mapStateToProps,userStateAndDispatch.mapDispatchToProps)(LoginView),
    navigationOptions: {
      tabBarVisible: false,
      transitionConfig: {
        isModal: true
      }
    }
  },
  Register: {
    screen: connect(userStateAndDispatch.mapStateToProps,userStateAndDispatch.mapDispatchToProps)(RegisterView)
  }
}, {headerMode: 'none'})

// 自定义路由拦截
const defaultGetStateForAction = MainView.router.getStateForAction

MainView.router.getStateForAction = (action, state) => {
  console.log('action', action)
  console.log('state', state)
  if(action.type === 'Navigation/NAVIGATE' && action.routeName === 'Login'&& store.getState().auth.username !== null) {
    ToastUtil.show('你不能进入',1000,'bottom','danger')
    return null
  }
  return defaultGetStateForAction(action, state)
}



export default MainView
