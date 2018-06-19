import React, { Component } from "react";
import {
  Platform,
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet
} from "react-native";
import { Icon, Container, Content, Footer } from "native-base";
import LinearGradient from 'react-native-linear-gradient';
//navigation
import {
  StackNavigator,
  TabNavigator,
  DrawerNavigator,
  NavigationActions
} from "react-navigation";
//views
import LoginView from "./LoginView";
import SettingView from "./SettingView";
import SplashPageView from "./SplashPageView";

import ContentView from "./views/ContentView";
import GoodsListPageView from "./views/GoodsListPageView";
import ArticleView from "./views/ArticleView";
import PersonView from "./views/PersonView";
import StatementView from "./views/StatementView";
import ShopSwiperablePage from "./views/ShopSwiperablePage";
import ActivitySwiperablePage from "./views/ActivitySwiperablePage";
import UploadView from "./views/UploadView";
import MandatoryUpdateView from "./MandatoryUpdateView";
import ConfirmOrderView from "./views/ConfirmOrderView";
import UserHelperView from "./views/UserHelperView";
//api
import source from "./api/CancelToken";
//utils
import LinkingUtils from "./utils/LinkingUtils";
import GLOBAL_PARAMS from "./utils/global_params";
import Colors from "./utils/Colors";
//store
import store from "./store";
//components
import TabBar from "./components/Tabbar";
//language
import i18n from './language/i18n';

const tabView = TabNavigator(
  {
    ShopTab: {
      screen: ShopSwiperablePage,
      navigationOptions: {
        tabBarLabel: "每日外賣",
        tabBarIcon: ({ tintColor, focused }) => {
          return focused ? (
            <Image
              style={{width: 22,
              height: 21}}
              resizeMode="stretch"
              source={require('./asset/Shape.png')}
            />
        ): (<Image
          style={{width: 22,
          height: 21}}
          resizeMode="stretch"
          source={require('./asset/Shape_inactive.png')}
        />)}
      }
    },
    ArticleTab: {
      screen: ArticleView,
      navigationOptions: {
        tabBarLabel: "本月菜單",
        tabBarIcon: ({ tintColor, focused }) => {
          return focused ? (
          <Image
            style={{width: 22,
              
            height: 21}}
            resizeMode="stretch"
            source={require('./asset/date_active.png')}
          />
        ): (<Image
          style={{width: 22,
          height: 21}}
          resizeMode="stretch"
          source={require('./asset/date.png')}
        />)}
      }
    }
  },
  {
    // tabBarComponent: TabBar,
    animationEnabled: false,
    swipeEnabled: false,
    tabBarPosition: "bottom",
    lazy: false, //该属性只会加载tab的当前view
    tabBarComponent: TabBar,
    backBehavior:"none",
    removeClippedSubviews: false,
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
    drawerWidth: GLOBAL_PARAMS._winWidth * 0.8,
    drawerPosition: "left",
    contentComponent: props => {
      // console.log(2222,props);
      let _language = i18n[props.screenProps.language];
      return (
        <Container>
        <View >
          <LinearGradient colors={['#FF7F0B','#FF1A1A']} start={{x:0.0, y:0.0}} end={{x:1.0,y: 0.0}} style={{
            height: GLOBAL_PARAMS._winHeight * 0.2,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
          }}>
            <Image source={require('./asset/logoTop.png')} style={{width: GLOBAL_PARAMS._winWidth*0.5,height: GLOBAL_PARAMS._winHeight * 0.1,marginTop: 10,marginLeft: -40}}/>
          </LinearGradient>
        </View>
          <Content style={{ backgroundColor: Colors.main_white }}>
            <View style={{ height: 219, backgroundColor: Colors.main_white,marginTop: 20 }}>
              <TouchableOpacity
              onPress={() => {
                if(props.screenProps.user === null) {
                  props.navigation.navigate("Login",{page: 'Person'});
                }else {
                  props.navigation.navigate('Person');
                }
              }}
                style={{
                  padding: 20,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Image
                  source={require("./asset/order.png")}
                  style={drawer_style.commonImage}
                  resizeMode="contain"
                />
                <Text
                  style={{
                    fontSize: 23,
                    textAlignVertical: "center",
                    marginLeft: 26,
                    color: Colors.fontBlack
                  }}
                >
                  我的訂單
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  padding: 20,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Image
                  source={require("./asset/account.png")}
                  style={drawer_style.commonImage}
                  resizeMode="contain"
                />
                <Text
                  style={{
                    fontSize: 23,
                    textAlignVertical: "center",
                    marginLeft: 26,
                    color: Colors.fontBlack
                  }}
                >
                  我的賬戶
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  props.navigation.navigate('Help');
                }}
                style={{
                  padding: 20,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Image
                  source={require("./asset/help.png")}
                  style={drawer_style.commonImage}
                  resizeMode="contain"
                />
                <Text
                  style={{
                    fontSize: 23,
                    textAlignVertical: "center",
                    marginLeft: 26,
                    color: Colors.fontBlack
                  }}
                >
                  用戶支援
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  props.screenProps.user
                    ? props.navigation.navigate("Integral")
                    : props.navigation.navigate("Login", {page: 'Integral'});
                }}
                style={{
                  padding: 20,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Image
                  source={require("./asset/bell.png")}
                  style={drawer_style.commonImage}
                  resizeMode="contain"
                />
                <Text
                  style={{
                    fontSize: 23,
                    textAlignVertical: "center",
                    marginLeft: 26,
                    color: Colors.fontBlack
                  }}
                >
                  最新通知
                </Text>
              </TouchableOpacity>
            </View>
          </Content>
          <Footer
            style={{ flexDirection: "row", backgroundColor: Colors.main_white,borderTopWidth: 1,borderTopColor:Colors.bgGray }}
          >
            <TouchableOpacity
              onPress={() => props.navigation.navigate("Statement", { name: "about" })}
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row"
              }}
            >
            <Image source={require('./asset/about.png')} style={{width: 22,height: 22}} resizeMode="contain"/>
              <Text style={{ marginLeft: 10,fontSize: 18 }}>關於我們</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => props.navigation.navigate("Setting")}
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <Image source={require('./asset/setting.png')} style={{width: 20,height: 20}} resizeMode="contain"/>
              <Text style={{ marginLeft: 10 ,fontSize: 18}}>系統設置</Text>
            </TouchableOpacity>
          </Footer>
        </Container>
      );
    }
  }
);

const drawer_style = StyleSheet.create({
  drawer_container: {
    height: GLOBAL_PARAMS._winHeight * 0.4,
    backgroundColor: Colors.main_white,
    flex: 1,
    padding: 10,
    paddingTop: 30
  },
  drawer_avatar: {
    width: 45,
    height: 45
  },
  commonImage: {
    width: 22,
    height: 22
  }
});

let MainView = StackNavigator(
  {
    // Splash: {
    //   screen: SplashPageView
    // },
    // Test: {
    //   screen: TestView
    // },
    Home: {
      screen: darwerView
    },
    Mandatory: {
      screen: MandatoryUpdateView
    },
    GoodsList:{
      screen: GoodsListPageView
    },
    Content: {
      screen: ContentView,
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
    Setting: {
      screen: SettingView
    },
    Statement: {
      screen: StatementView
    },
    Upload: {
      screen: UploadView
    },
    Order: {
      screen: ConfirmOrderView
    },
    Ativity: {
      screen: ActivitySwiperablePage
    },
    Person: {
      screen: PersonView
    },
    Help: {
      screen: UserHelperView
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
  // if (
  //   action.type === "Navigation/NAVIGATE" &&
  //   action.routeName === "Login" &&
  //   store.getState().auth.username !== null
  // ) {
  //   ToastUtil.showWithMessage("個人中心暫未開放...");
    
  //   return null;
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
  if(action.type != 'Navigation/SET_PARAMS') {
    if(action.routeName == 'DrawerClose' || action.routeName == 'ShopTab') { //监听首页
      store.dispatch({type:'REFRESH',refresh:new Date()})
    }
  }
  if (state && action.type === NavigationActions.NAVIGATE) {
    if (action.params && action.params.replaceRoute) {
      //replaceRoute值 仅仅作为一个标识，进到这个方法之后就没有作用了
      delete action.params.replaceRoute;
      if (state.routes.length > 1 && state.index > 0) {
          const routes = state.routes.slice(0, state.routes.length - 1);
      // routes.push(action)
          return defaultGetStateForAction(action, {
            ...state,
            routes,
            index: routes.length - 1
          });
      }
    }
  }

  return defaultGetStateForAction(action, state);
};

export default MainView;
