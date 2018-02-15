import React, {Component} from 'react'
import {Platform, View, Text, TouchableOpacity,ScrollView,Image} from 'react-native'
import {Icon} from 'native-base'
//navigation
import {StackNavigator, TabNavigator, DrawerNavigator,DrawerItems} from 'react-navigation'
//views
import LoginView from './LoginView'
import RegisterView from './RegisterView'
import SettingView from './SettingView'
import SplashPageView from './SplashPageView'

import ContentView from './views/ContentView'

import SearchView from './views/SearchView'
import GoodsListPageView from './views/GoodsListPageView'
import ArticleView from './views/ArticleView'
import PersonView from './views/PersonView'
import MyFavoriteView from './views/MyFavoriteVIew'
import StatementView from './views/StatementView'
//api
import api from './api'
//utils
import ToastUtil from './utils/ToastUtil'
import LinkingUtils from './utils/LinkingUtils'
import GLOBAL_PARAMS from './utils/global_params'
import Colors from './utils/Colors'
//react-redux
import {connect} from 'react-redux'
import {userStateAndDispatch,
      contentStateAndDispatch,
      goodsListStateAndDispatch,
      loginStateAndDispatch,
      registerStateAndDispatch,
      filterStateAndDispatch,
      personStateAndDispatch,
      myFavoriteStateAndDispatch,
      settingsStateAndDispatch,
      searchStateAndDispatch,
      statementStateAndDispatch} from './utils/mapStateAndDispatch'
//store
import store from './store'

const tabView = TabNavigator({
  GoodsListTab: {
    screen: connect(goodsListStateAndDispatch.mapStateToProps, goodsListStateAndDispatch.mapDispatchToProps)(GoodsListPageView),
    navigationOptions: {
      tabBarLabel: '商品',
      tabBarIcon: ({tintColor,focused}) => (<Icon size={35} name="md-list-box" style={{
          color:  focused ? store.getState().theme.theme : tintColor
        }}/>)
    }
  },
  ArticleTab: {
    screen: ArticleView,
    navigationOptions: {
      tabBarLabel: '文章',
      tabBarIcon: ({tintColor,focused}) => (<Icon size={28} name="md-images" style={{
          color:  focused ? store.getState().theme.theme : tintColor
        }}/>)
    }
  },
  PersonTab: {
    screen: connect(personStateAndDispatch.mapStateToProps, personStateAndDispatch.mapDispatchToProps)(PersonView),
    navigationOptions: {
      tabBarLabel: '個人中心',
      tabBarIcon: ({tintColor,focused}) => (<Icon size={35} name="md-contact" style={{
          color:  focused ? store.getState().theme.theme : tintColor
        }}/>)
    }
  }
}, {
  animationEnabled: true,
  tabBarPosition: 'bottom',
  lazy:true, //该属性只会加载tab的当前view
  tabBarOptions: {
    showLabel: false,
    showIcon: true,
    inactiveTintColor: '#707070',
    activeTintColor: store.getState().theme.theme,
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
      backgroundColor: store.getState().theme.theme
    }}>
    <View style={{
        alignSelf: 'center',
        marginTop: 100,
        marginBottom: 100
      }}>
      <Text style={{color:'#fff'}}>Goforeat v1.0.0</Text>
    </View>
    {/* <ScrollView style={{marginLeft:-50}} showsVerticalScrollIndicator={false}>
        <View style={{height:50,flex:1,justifyContent:'center',alignItems:'center',flexDirection:'row'}}>
          <Image style={{width:28,height:28,marginRight:30}} source={require('./asset/Law.png')}/>
          <Text style={{fontSize:22}}>法律聲明</Text>
        </View>
        <View style={{height:50,flex:1,justifyContent:'center',alignItems:'center',flexDirection:'row'}}>
          <Image style={{width:28,height:28,marginRight:30}} source={require('./asset/Service.png')}/>
          <Text style={{fontSize:22}}>服務條款</Text>
        </View>
        <View style={{height:50,flex:1,justifyContent:'center',alignItems:'center',flexDirection:'row'}}>
          <Image style={{width:28,height:33,marginRight:30}} source={require('./asset/Privacy.png')}/>
          <Text style={{fontSize:22}}>隱私政策</Text>
        </View>
        <View style={{height:50,flex:1,justifyContent:'center',alignItems:'center',flexDirection:'row'}}>
          <Image style={{width:28,height:28,marginRight:30}} source={require('./asset/about.png')}/>
          <Text style={{fontSize:22}}>關於我們</Text>
        </View>
    </ScrollView> */}
    <TouchableOpacity style={{
        position: 'absolute',
        bottom: 30,
        right: 50
      }} onPress={() => LinkingUtils.dialPhoneWithNumber('97926095')}>
      <View>
        <Text style={{
            fontSize: 18,color: '#fff'
          }}>聯繫電話:97926095</Text>
      </View>
    </TouchableOpacity>
  </View>)
})

let MainView = StackNavigator({
  // Splash: {
  //   screen: SplashPageView
  // },
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
    screen: connect(searchStateAndDispatch.mapStateToProps)(SearchView),
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
    screen: connect(settingsStateAndDispatch.mapStateToProps,settingsStateAndDispatch.mapDispatchToProps)(SettingView)
  },
  MyFavorite: {
    screen: connect(myFavoriteStateAndDispatch.mapStateToProps,myFavoriteStateAndDispatch.mapDispatchToProps)(MyFavoriteView)
  },
  Statement: {
    screen: connect(statementStateAndDispatch.mapStateToProps)(StatementView)
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
