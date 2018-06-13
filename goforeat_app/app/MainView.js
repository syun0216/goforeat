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
import { Icon, Container, Content, Footer } from "native-base";
//navigation
import {
  addNavigationHelpers,
  StackNavigator,
  TabNavigator,
  DrawerNavigator,
  DrawerItems,
  TabBarBottom,
  NavigationActions
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
import TestView from './views/TestView';
//api
import source from "./api/CancelToken";
//utils
import ToastUtil from "./utils/ToastUtil";
import LinkingUtils from "./utils/LinkingUtils";
import GLOBAL_PARAMS from "./utils/global_params";
import Colors from "./utils/Colors";
//store
import store from "./store";
//components
import Divider from "./components/Divider";
import TabBar from "./components/Tabbar";
//language
import i18n from './language/i18n';

const tabView = TabNavigator(
  {
    ShopTab: {
      screen: ShopSwiperablePage,
      navigationOptions: {
        tabBarLabel: "外賣",
        tabBarIcon: ({ tintColor, focused }) => {
          return focused ? (
          <Image
            style={{width: 25,
            height: 25}}
            source={require('./asset/Shape.png')}
          />
        ): (<Image
          style={{width: 25,
          height: 25}}
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
            style={{width: 25,
            height: 25}}
            source={require('./asset/date_active.png')}
          />
        ): (<Image
          style={{width: 25,
          height: 25}}
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
          <Content style={{ backgroundColor: props.screenProps.theme }}>
            <TouchableOpacity onPress={
              () => props.screenProps.user
              ? ToastUtil.showWithMessage('用戶中心暫未開放')
              : props.navigation.navigate("Login")
            }
              style={{
                height: GLOBAL_PARAMS._winHeight * 0.2,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "flex-start",
                paddingLeft: 20,
                backgroundColor: props.screenProps.theme
              }}
            >
              {props.screenProps.user ? (
                <Image
                  style={drawer_style.drawer_avatar}
                  source={require("./asset/eat.png")}
                />
              ) : (
                <Image
                  style={drawer_style.drawer_avatar}
                  source={require("./asset/touxiang.png")}
                />
              )}
              <Text
                style={{
                  marginLeft: 15,
                  fontSize: 18,
                  color: Colors.main_white
                }}
              >
                {props.screenProps.user ? _language.user_name+ props.screenProps.user : _language.login_text}
              </Text>
              <Icon
                name="ios-arrow-forward-outline"
                style={{
                  fontSize: 20,
                  color: Colors.main_white,
                  position: "absolute",
                  right: 20
                }}
              />
            </TouchableOpacity>
            <Divider height={10} bgColor="#f0f0ee" />
            <View style={{ height: 219, backgroundColor: Colors.main_white }}>
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
                  borderBottomWidth: 1,
                  borderBottomColor: "#ccc"
                }}
              >
                <Image
                  source={require("./asset/02-guanzhu.png")}
                  style={drawer_style.commonImage}
                />
                <Text
                  style={{
                    fontSize: 23,
                    textAlignVertical: "center",
                    marginLeft: 26,
                    color: Colors.fontBlack
                  }}
                >
                  {i18n[props.screenProps.language].my_order}
                </Text>
                <Icon
                  name="ios-arrow-forward-outline"
                  style={{
                    fontSize: 20,
                    color: Colors.fontBlack,
                    position: "absolute",
                    right: 20
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  LinkingUtils.dialPhoneWithNumber(52268745);
                }}
                style={{
                  padding: 20,
                  flexDirection: "row",
                  alignItems: "center",
                  borderBottomWidth: 1,
                  borderBottomColor: "#ccc"
                }}
              >
                <Image
                  source={require("./asset/03-renzheng.png")}
                  style={drawer_style.commonImage}
                />
                <Text
                  style={{
                    fontSize: 23,
                    textAlignVertical: "center",
                    marginLeft: 26,
                    color: Colors.fontBlack
                  }}
                >
                  {_language.contact_us}
                </Text>
                <Icon
                  name="ios-arrow-forward-outline"
                  style={{
                    fontSize: 20,
                    color: Colors.fontBlack,
                    position: "absolute",
                    right: 20
                  }}
                />
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
                  borderBottomWidth: 1,
                  borderBottomColor: "#ccc"
                }}
              >
                <Image
                  source={require("./asset/01-guanli.png")}
                  style={drawer_style.commonImage}
                />
                <Text
                  style={{
                    fontSize: 23,
                    textAlignVertical: "center",
                    marginLeft: 26,
                    color: Colors.fontBlack
                  }}
                >
                  {_language.integral_text}
                </Text>
                <Icon
                  name="ios-arrow-forward-outline"
                  style={{
                    fontSize: 20,
                    color: Colors.fontBlack,
                    position: "absolute",
                    right: 20
                  }}
                />
              </TouchableOpacity>
            </View>
            <Divider height={10} bgColor="#f0f0ee" />
            <View style={drawer_style.drawer_container}>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "center"
                }}
              >
                <TouchableOpacity
                  onPress={() =>
                    props.navigation.navigate("Statement", { name: "service" })
                  }
                  style={{ alignItems: "center", flex: 1 }}
                >
                  <Image
                    style={{ width: 50, height: 50 }}
                    source={require("./asset/Service.png")}
                  />
                  <Text
                    style={{ fontSize: 12, color: "#8a8a8a", marginTop: 10 }}
                  >
                    {_language.service_text}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    props.navigation.navigate("Statement", { name: "policy" })
                  }
                  style={{ alignItems: "center", flex: 1 }}
                >
                  <Image
                    style={{ width: 50, height: 50 }}
                    source={require("./asset/Privacy.png")}
                  />
                  <Text
                    style={{ fontSize: 12, color: "#8a8a8a", marginTop: 10 }}
                  >
                    {_language.privacy_text}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    props.navigation.navigate("Statement", { name: "about" })
                  }
                  style={{ alignItems: "center", flex: 1 }}
                >
                  <Image
                    style={{ width: 50, height: 50 }}
                    source={require("./asset/about.png")}
                  />
                  <Text
                    style={{ fontSize: 12, color: "#8a8a8a", marginTop: 10 }}
                  >
                    {_language.about_text}
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "center"
                }}
              >
                <TouchableOpacity
                  onPress={() =>
                    props.navigation.navigate("Statement", {
                      name: "allowPolicy"
                    })
                  }
                  style={{ alignItems: "center", flex: 1 }}
                >
                  <Image
                    style={{ width: 50, height: 50 }}
                    source={require("./asset/allow.png")}
                  />
                  <Text
                    style={{ fontSize: 12, color: "#8a8a8a", marginTop: 10 }}
                  >
                    {_language.use_policy}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    props.navigation.navigate("Statement", {
                      name: "deletePolicy"
                    })
                  }
                  style={{ alignItems: "center", flex: 1 }}
                >
                  <Image
                    style={{ width: 50, height: 50 }}
                    source={require("./asset/delete.png")}
                  />
                  <Text
                    style={{ fontSize: 12, color: "#8a8a8a", marginTop: 10 }}
                  >
                    {_language.del_policy}
                  </Text>
                </TouchableOpacity>
                <View style={{ alignItems: "center", flex: 1 }} />
              </View>
            </View>
          </Content>
          <Footer
            style={{ flexDirection: "row", backgroundColor: Colors.main_white }}
          >
            {/*<TouchableOpacity
              onPress={() => props.navigation.navigate("Ativity")}
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row"
              }}
            >
              <Icon
                name="md-cloud-download"
                style={{ fontSize: 18, color: "#8a8a8a" }}
              />
              <Text style={{ marginLeft: 5 }}>{_language.tab4}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => props.navigation.navigate("GoodsList")}
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row"
              }}
            >
              <Icon
                name="md-restaurant"
                style={{ fontSize: 18, color: "#8a8a8a" }}
              />
              <Text style={{ marginLeft: 5 }}>{_language.tab1}</Text>
            </TouchableOpacity>*/}
            <TouchableOpacity
              onPress={() => props.navigation.navigate("Setting")}
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row"
              }}
            >
              <Icon
                name="md-settings"
                style={{ fontSize: 18, color: "#8a8a8a" }}
              />
              <Text style={{ marginLeft: 5 }}>{_language.setting_title}</Text>
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
    width: 32,
    height: 32
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
    },
    Ativity: {
      screen: ActivitySwiperablePage
    },
    Person: {
      screen: PersonView
    },
  },
  { headerMode: "none" }
);

// 自定义路由拦截
const defaultGetStateForAction = MainView.router.getStateForAction;

MainView.router.getStateForAction = (action, state) => {
  console.log('action', action)
  console.log('state', state)
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
