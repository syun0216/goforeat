import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image
} from "react-native";
import { Container, Content } from "native-base";
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
import CustomLoginView from './CustomLoginView';
import SettingView from "./SettingView";

import HomePage from "./views/HomePage";
import ArticleView from "./views/ArticleView";
import ContentView from "./views/ContentView";
import PersonView from "./views/PersonView";
import StatementView from "./views/StatementView";
import MandatoryUpdateView from "./MandatoryUpdateView";
import ConfirmOrderView from "./views/ConfirmOrderView";
import UserHelperView from "./views/UserHelperView";
//api
import source from "./api/CancelToken";
//utils
import GLOBAL_PARAMS from "./utils/global_params";
//store
import store from "./store";
//components
import TabBar from "./components/Tabbar";
//styles
import MainViewStyles from './styles/mainview.style';

const tabView = TabNavigator(
  {
    ShopTab: {
      screen: HomePage,
      navigationOptions: {
        tabBarLabel: "每日外賣",
        tabBarIcon: ({ focused }) => {
          return focused ? (
            <Image
              style={MainViewStyles.tabBarImage}
              resizeMode="stretch"
              source={require('./asset/Shape.png')}
            />
        ): (<Image
          style={MainViewStyles.tabBarImage}
          resizeMode="stretch"
          source={require('./asset/Shape_inactive.png')}
        />)}
      }
    },
    ArticleTab: {
      screen: ArticleView,
      navigationOptions: {
        tabBarLabel: "本週菜單",
        tabBarIcon: ({ focused }) => {
          return focused ? (
          <Image
            style={MainViewStyles.tabBarImage}
            resizeMode="stretch"
            source={require('./asset/date_active.png')}
          />
        ): (<Image
          style={MainViewStyles.tabBarImage}
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
    drawerWidth: GLOBAL_PARAMS._winWidth * 0.75,
    drawerPosition: "left",
    contentComponent: props => {
      return (
        <Container>
        <View >
          <LinearGradient colors={['#FF7F0B','#FF1A1A']} start={{x:0.0, y:0.0}} end={{x:1.0,y: 0.0}} style={MainViewStyles.drawerTopContainer}>
            <Image source={require('./asset/logoTop.png')} style={MainViewStyles.drawerTopImage}/>
          </LinearGradient>
        </View>
          <Content style={MainViewStyles.drawerContent}>
            <View style={MainViewStyles.drawerInnerContent}>
              <TouchableOpacity
              onPress={() => {
                if(props.screenProps.user === null) {
                  props.navigation.navigate("Login",{page: 'Person'});
                }else {
                  props.navigation.navigate('Person');
                }
              }}
                style={MainViewStyles.drawerItemBtn}
              >
                <Image
                  source={require("./asset/order.png")}
                  style={MainViewStyles.drawerItemImage}
                  resizeMode="contain"
                />
                <Text
                  allowFontScaling={false}
                  style={MainViewStyles.drawerItemText}
                >
                  我的訂單
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  props.navigation.navigate('Help');
                }}
                style={MainViewStyles.drawerItemBtn}
              >
                <Image
                  source={require("./asset/help.png")}
                  style={MainViewStyles.drawerItemImage}
                  resizeMode="contain"
                />
                <Text
                  allowFontScaling={false}
                  style={MainViewStyles.drawerItemText}
                >
                  用戶支援
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={MainViewStyles.drawerItemBtn}
                onPress={() => props.navigation.navigate("Statement", { name: "about" })}
              >
                <Image
                  source={require("./asset/account.png")}
                  style={MainViewStyles.drawerItemImage}
                  resizeMode="contain"
                />
                <Text
                  allowFontScaling={false}
                  style={MainViewStyles.drawerItemText}
                >
                  關於我們
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
              onPress={() => props.navigation.navigate("Setting")}
              style={MainViewStyles.drawerItemBtn}
            >
              <Image source={require('./asset/setting.png')} style={MainViewStyles.drawerItemImage}
              resizeMode="contain"/>
              <Text allowFontScaling={false} style={MainViewStyles.drawerItemText}>系統設置</Text>
            </TouchableOpacity>
            </View>
          </Content>
        </Container>
      );
    }
  }
);

let MainView = StackNavigator(
  {
    // Splash: {
    //   screen: SplashPageView
    // },
    Home: {
      screen: darwerView
    },
    Mandatory: {
      screen: MandatoryUpdateView
    },
    Content: {
      screen: ContentView,
      navigationOptions: {
        tabBarVisible: false
      }
    },
    Login: {
      screen: CustomLoginView,
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
    Order: {
      screen: ConfirmOrderView
    },
    Person: {
      screen: PersonView
    },
    Help: {
      screen: UserHelperView
    }
  },
  { headerMode: "none",
    cardStyle: {
      backgroundColor: '#fff',
    },
    transitionConfig: (): Object => ({
      containerStyle: {
        backgroundColor: '#fff',
      },
    }),
  }
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
    typeof state !== "undefined" &&
    state.routes[state.routes.length - 1].routeName === "Search"
  ) {
    const routes = state.routes.slice(0, state.routes.length - 1);
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
