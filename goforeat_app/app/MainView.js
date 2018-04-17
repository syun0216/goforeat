import React, { Component } from "react";
import {
  Platform,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet
} from "react-native";
import { Icon,Container,Content,Footer } from "native-base";
//navigation
import {
  addNavigationHelpers,
  StackNavigator,
  TabNavigator,
  DrawerNavigator,
  DrawerItems,
  TabBarBottom
} from "react-navigation";
//views
import LoginView from "./LoginView";
import RegisterView from "./RegisterView";
import SettingView from "./SettingView";
import SplashPageView from "./SplashPageView";

import ContentView from "./views/ContentView";

import SearchView from "./views/SearchView";
import GoodsListPageView from "./views/GoodsListPageView";
import ArticleView from "./views/ArticleView";
import PersonView from "./views/PersonView";
import MyFavoriteView from "./views/MyFavoriteVIew";
import StatementView from "./views/StatementView";
import ShopSwiperablePage from "./views/ShopSwiperablePage";
import ActivitySwiperablePage from "./views/ActivitySwiperablePage";
import IntegralView from "./views/IntegralView";
import IntegralDetailView from "./views/IntegralDetailView";
import UploadView from "./views/UploadView";
import CommentsView from "./views/CommentsView";
import MandatoryUpdateView from "./MandatoryUpdateView";
import ConfirmOrderView from "./views/ConfirmOrderView";
//api
import api from "./api";
import source from "./api/CancelToken";
//utils
import ToastUtil from "./utils/ToastUtil";
import LinkingUtils from "./utils/LinkingUtils";
import GLOBAL_PARAMS from "./utils/global_params";
import Colors from "./utils/Colors";
import { addListener } from "./utils/navigationWithRedux";
//react-redux
import { connect } from "react-redux";
//store
import store from "./store";
//components 
import Divider from './components/Divider';
//event
import EventEmitter from "EventEmitter";

class CustomTabBar extends Component {
  componentDidMount() {
    // console.log(222,this.props);
  }

  render() {
    return (
      <TabBarBottom
        {...this["props"]}
        activeTintColor={this.props.screenProps.theme}
      />
    );
  }
}

const tabView = TabNavigator(
  {
    GoodsListTab: {
      screen: GoodsListPageView,
      navigationOptions: {
        tabBarLabel: "餐廳",
        tabBarIcon: ({ tintColor, focused }) => (
          <Icon
            size={28}
            name="md-restaurant"
            style={{
              color: tintColor
            }}
          />
        )
      }
    },
    ShopTab: {
      screen: ShopSwiperablePage,
      navigationOptions: {
        tabBarLabel: "外卖",
        tabBarIcon: ({ tintColor, focused }) => (
          <Icon
            size={28}
            name="md-pizza"
            style={{
              color: tintColor
            }}
          />
        )
      }
    },
    ArticleTab: {
        screen: ArticleView,
        navigationOptions: {
            tabBarLabel: '文章',
            tabBarIcon: ({tintColor, focused}) => (<Icon size={28} name="md-images" style={{
                color: tintColor
            }}/>)
        }
    },
    // AtivityTab: {
    //     screen: ActivitySwiperablePage,
    //     navigationOptions: {
    //         tabBarLabel: '線下',
    //         tabBarIcon: ({tintColor, focused}) => (<Icon size={28} name="md-aperture" style={{
    //             color: tintColor
    //         }}/>)
    //     }
    // },
    // PersonTab: {
    //   screen: PersonView,
    //   navigationOptions: {
    //     tabBarLabel: "個人中心",
    //     tabBarIcon: ({ tintColor, focused }) => (
    //       <Icon
    //         size={35}
    //         name="md-contact"
    //         style={{
    //           color: tintColor
    //         }}
    //       />
    //     )
    //   }
    // }
  },
  {
    animationEnabled: false,
    swipeEnabled: false,
    tabBarPosition: "bottom",
    lazy: true, //该属性只会加载tab的当前view
    tabBarComponent: CustomTabBar,
    tabBarOptions: {
      showLabel: true,
      showIcon: true
      // inactiveTintColor: '#707070',
      // activeTintColor: Colors.main_orange,

      // tabStyle: {
      //   height:100
      // }
    }
  }
);

const darwerView = DrawerNavigator(
  {
    GoodsListDrawer: {
      screen: tabView
    }
  },
  {
    drawerWidth: GLOBAL_PARAMS._winWidth * 0.9,
    drawerPosition: "left",
    contentComponent: props => {
      // console.log('darwer', props)
      return (
          <Container>
            <Content style={{backgroundColor: props.screenProps.theme}}>
                <TouchableOpacity onPress={() => props.navigation.navigate('Login')}
                 style={{height:GLOBAL_PARAMS._winHeight*0.2,alignItems:'center',flexDirection:'row',justifyContent:'flex-start',paddingLeft:20,backgroundColor:props.screenProps.theme}}>
                    <Image style={drawer_style.drawer_avatar} source={require('./asset/eat.png')}/>
                    <Text style={{marginLeft: 10,fontSize: 16,color:Colors.main_white}}>{props.screenProps.user || '登錄/註冊'}</Text>
                    <Icon name='ios-arrow-forward-outline' style={{fontSize:20,color: Colors.main_white,position: 'absolute',right:20}}/>
                </TouchableOpacity>
                <Divider height={10} bgColor="#e6e6e6" />
                <View style={{height:219,backgroundColor:Colors.main_white}} >
                    <TouchableOpacity onPress={() => {props.screenProps.user ? props.navigation.navigate('MyFavorite') : props.navigation.navigate('Login')}}
                        style={{padding:20,flexDirection:'row',alignItems:'center',borderBottomWidth: 1,borderBottomColor:'#ccc'}}>
                        <Image source={require('./asset/02-guanzhu.png')} style={drawer_style.commonImage}/>
                        <Text style={{fontSize: 23,textAlignVertical:'center',marginLeft: 30,color: Colors.fontBlack}}>我的關注</Text>
                        <Icon name='ios-arrow-forward-outline' style={{fontSize:20,color: Colors.fontBlack,position: 'absolute',right:20}}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {props.screenProps.user ? props.navigation.navigate('Upload') : props.navigation.navigate('Login')}}
                        style={{padding:20,flexDirection:'row',alignItems:'center',borderBottomWidth: 1,borderBottomColor:'#ccc'}}>
                        <Image source={require('./asset/03-renzheng.png')} style={drawer_style.commonImage}/>
                        <Text style={{fontSize: 23,textAlignVertical:'center',marginLeft: 30,color: Colors.fontBlack}}>上傳發票</Text>
                        <Icon name='ios-arrow-forward-outline' style={{fontSize:20,color: Colors.fontBlack,position: 'absolute',right:20}}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {props.screenProps.user ? props.navigation.navigate('Integral') : props.navigation.navigate('Login')}}
                        style={{padding:20,flexDirection:'row',alignItems:'center',borderBottomWidth: 1,borderBottomColor:'#ccc'}}>
                        <Image source={require('./asset/01-guanli.png')} style={drawer_style.commonImage}/>
                        <Text style={{fontSize: 23,textAlignVertical:'center',marginLeft: 30,color: Colors.fontBlack}}>積分禮遇</Text>
                        <Icon name='ios-arrow-forward-outline' style={{fontSize:20,color: Colors.fontBlack,position: 'absolute',right:20}}/>
                    </TouchableOpacity>
                </View>
                <Divider height={10} bgColor="#e6e6e6" />
                <View style={drawer_style.drawer_container}>
                    <View style={{flex:1,flexDirection:'row',justifyContent:'center'}}>
                        <TouchableOpacity onPress={() => props.navigation.navigate('Statement', {name: 'service'})}
                            style={{alignItems: 'center',flex: 1}}>
                            <Image style={{width: 50, height: 50}}
                                source={require('./asset/Service.png')}/>
                            <Text style={{fontSize: 14, color: '#8a8a8a',marginTop: 10}}>服務條款</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => props.navigation.navigate('Statement', {name: 'policy'})}
                            style={{alignItems: 'center',flex: 1}}>
                            <Image style={{width: 50, height: 50}}
                                source={require('./asset/Privacy.png')}/>
                            <Text style={{fontSize: 14, color: '#8a8a8a',marginTop: 10}}>隱私政策</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => props.navigation.navigate('Statement', {name: 'about'})}
                            style={{alignItems: 'center',flex: 1}}>
                            <Image style={{width: 50, height: 50}}
                                source={require('./asset/about.png')}/>
                            <Text style={{fontSize: 14, color: '#8a8a8a',marginTop: 10}}>關於我們</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flex:1,flexDirection:'row',justifyContent:'center'}}>
                        <TouchableOpacity onPress={() => props.navigation.navigate('Statement', {name: 'allowPolicy'})}
                            style={{alignItems: 'center',flex: 1}}>
                            <Image style={{width: 50, height: 50}}
                                source={require('./asset/allow.png')}/>
                            <Text style={{fontSize: 14, color: '#8a8a8a',marginTop: 10}}>允許使用政策</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => props.navigation.navigate('Statement', {name: 'deletePolicy'})}
                            style={{alignItems: 'center',flex: 1}}>
                            <Image style={{width: 50, height: 50}}
                                source={require('./asset/delete.png')}/>
                            <Text style={{fontSize: 14, color: '#8a8a8a',marginTop: 10}}>刪除使用政策</Text>
                        </TouchableOpacity>
                        <View style={{alignItems: 'center',flex: 1}}/>
                    </View>
                </View>
                </Content>
                <Footer style={{flexDirection: 'row',backgroundColor: Colors.main_white}}>
                    <TouchableOpacity style={{flex: 1,justifyContent:'center',alignItems:'center',flexDirection:'row'}}>
                        <Icon name="md-create" style={{fontSize: 18,color:'#8a8a8a'}}/>
                        <Text style={{marginLeft:5}}>反饋</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => props.navigation.navigate('Search')}
                        style={{flex: 1,justifyContent:'center',alignItems:'center',flexDirection:'row'}}>
                        <Icon name="md-search" style={{fontSize: 18,color:'#8a8a8a'}}/>
                        <Text style={{marginLeft:5}}>搜索</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => props.navigation.navigate('Setting')}
                        style={{flex: 1,justifyContent:'center',alignItems:'center',flexDirection:'row'}}>
                        <Icon name="md-settings" style={{fontSize: 18,color:'#8a8a8a'}}/>
                        <Text style={{marginLeft:5}}>設置</Text>
                    </TouchableOpacity>
                </Footer>
          </Container>
        );
    }
  }
);

const drawer_style = StyleSheet.create({
    drawer_container: {
        height: GLOBAL_PARAMS._winHeight*0.4,
        backgroundColor: Colors.main_white,
        flex: 1,
        padding:10,
        paddingTop:30
    },
    drawer_avatar: {
        width: 65,
        height: 65
    },
    commonImage: {
        width:32,
        height:32,
      }
})

let MainView = StackNavigator(
  {
    // Splash: {
    //   screen: SplashPageView
    // },
    // Mandatory: {
    //   screen: MandatoryUpdateView
    // },
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
      screen: LoginView,
      navigationOptions: {
        tabBarVisible: false,
        transitionConfig: {
          isModal: true
        }
      }
    },
    Register: {
      screen: RegisterView
    },
    Setting: {
      screen: SettingView
    },
    MyFavorite: {
      screen: MyFavoriteView
    },
    Statement: {
      screen: StatementView
    },
    Upload: {
      screen: UploadView
    },
    Integral: {
      screen: IntegralView
    },
    IntegralDetail: {
      screen: IntegralDetailView
    },
    Comment: {
      screen: CommentsView
    },
    Order: {
      screen: ConfirmOrderView
    }
  },
  { headerMode: "none" }
);

// 自定义路由拦截
const defaultGetStateForAction = MainView.router.getStateForAction;

MainView.router.getStateForAction = (action, state) => {
  // console.log('action', action)
  // console.log('state', state)
  if (action.type === "Navigation/NAVIGATE") {
    source.cancel();
  }
  if (
    action.type === "Navigation/NAVIGATE" &&
    action.routeName === "Login" &&
    store.getState().auth.username !== null
  ) {
    ToastUtil.showWithMessage("個人中心暫未開放...");
    return null;
  }
  // if (action.type === 'Navigation/RESET') {
  //   store.dispatch({type: 'REFRESH', refresh: action.actions[0].params.refresh})
  // }
  // if(typeof action.routeName !== 'undefined' && (action.routeName === 'ShopTab' || action.routeName === 'AtivityTab')) {
  //   store.dispatch({type: 'IS_LOADING'})
  // }
  if (
    typeof state !== "undefined" &&
    state.routes[state.routes.length - 1].routeName === "Search"
  ) {
    const routes = state.routes.slice(0, state.routes.length - 1);
    // routes.push(action)
    return defaultGetStateForAction(action, {
      ...state,
      routes,
      index: routes.length - 1
    });
  }
  return defaultGetStateForAction(action, state);
};

export default MainView;
