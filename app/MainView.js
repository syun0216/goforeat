import React from "react";
import { Image, Platform } from "react-native";
//navigation
import {
  StackNavigator,
  TabNavigator,
  DrawerNavigator,
  NavigationActions
} from "react-navigation";
import CardStackStyleInterpolator from "react-navigation/src/views/CardStack/CardStackStyleInterpolator";
//views
import SettingView from "./SettingView";
import FoodDetailsView from "./views/FoodDetailsView";
import FoodListView from "./views/FoodListView";
import ContentView from "./views/ContentView";
import MyOrderView from "./views/MyOrderView";
import StatementView from "./views/StatementView";
import MandatoryUpdateView from "./MandatoryUpdateView";
import ConfirmOrderView from "./views/ConfirmOrderView";
import UserHelperView from "./views/UserHelperView";
import PaySettingView from "./views/PaySettingView";
import CreditCardView from "./views/CreditCardView";
import ManageCreditCardView from "./views/ManageCreditCardView";
import FeedbackView from "./views/FeedbackView";
import UserInfoView from "./views/UserInfoView";
import CouponView from "./views/CouponView";
import PickPlaceView from "./views/PickPlaceView";
import PurchaseMonthTicketView from './views/PurchaseMonthTicketView';
import DebugView from './debugView';
//api
import {abortRequestInPatchWhenRouteChange} from "./api/CancelToken";
//utils
import GLOBAL_PARAMS from "./utils/global_params";
//store
import store from "./store";
//components
import CommonHOC from "./hoc/CommonHOC";
import TabBar from "./components/Tabbar";
import CustomDrawer from "./components/CustomDrawer";
//styles
import MainViewStyles from "./styles/mainview.style";
//permission
import { AuthInterceptor } from "./permission";

const tabView = TabNavigator(
  {
    ShopTab: {
      screen: FoodDetailsView,
      navigationOptions: {
        // tabBarLabel: '每日推薦',
        // drawerLockMode: Platform.OS=='ios'?'unlocked':'locked-closed', // 修复安卓侧滑问题
        tabBarIcon: ({ focused }) => {
          return focused ? (
            <Image
              style={MainViewStyles.tabBarImage}
              resizeMode="stretch"
              source={require("./asset/Shape.png")}
            />
          ) : (
            <Image
              style={MainViewStyles.tabBarImage}
              resizeMode="stretch"
              source={require("./asset/Shape_inactive.png")}
            />
          );
        }
      }
    },
    FoodListTab: {
      screen: FoodListView,
      navigationOptions: {
        // tabBarLabel: "本週菜單",
        drawerLockMode: Platform.OS == "ios" ? "unlocked" : "locked-closed",
        tabBarIcon: ({ focused }) => {
          return focused ? (
            <Image
              style={MainViewStyles.tabBarImage}
              resizeMode="stretch"
              source={require("./asset/date_active.png")}
            />
          ) : (
            <Image
              style={MainViewStyles.tabBarImage}
              resizeMode="stretch"
              source={require("./asset/date.png")}
            />
          );
        }
      }
    }
  },
  {
    // tabBarComponent: TabBar,
    animationEnabled: false,
    swipeEnabled: false,
    tabBarPosition: "bottom",
    lazyLoad: false, //该属性只会加载tab的当前view
    tabBarComponent: TabBar,
    backBehavior: "none",
    removeClippedSubviews: false,
    tabBarOptions: {
      showLabel: true,
      showIcon: true
    }
  }
);

const darwerView = DrawerNavigator(
  {
    FoodListDrawer: {
      screen: CommonHOC(FoodListView)
    },
    MyOrderDrawer: {
      screen: CommonHOC(MyOrderView)
    },
    PickPlaceDrawer: {
      screen: CommonHOC(PickPlaceView)
    },
    PayTypeDrawer: {
      screen: CommonHOC(PaySettingView)
    },
    MonthTicketDrawer: {
      screen: CommonHOC(PurchaseMonthTicketView)
    },
    CouponDrawer: {
      screen: CommonHOC(CouponView)
    },
    SettingDrawer: {
      screen: CommonHOC(SettingView)
    },
    UserInfoDrawer: {
      screen: CommonHOC(UserInfoView)
    }
  },
  {
    initialRouteName: "FoodListDrawer",
    drawerWidth: GLOBAL_PARAMS._winWidth * 0.75,
    drawerPosition: "left",
    contentComponent: props => {
      return <CustomDrawer {...props}/>
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
    UserInfo: {
      screen: CommonHOC(UserInfoView)
    },
    Food: {
      screen: CommonHOC(FoodDetailsView)
    },
    FoodList: {
      screen: CommonHOC(FoodListView)
    },
    MyOrder: {
      screen: CommonHOC(MyOrderView)
    },
    PickPlace: {
      screen: CommonHOC(PickPlaceView)
    },
    PayType: {
      screen: CommonHOC(PaySettingView)
    },
    Coupon: {
      screen: CommonHOC(CouponView)
    },
    UserHelp: {
      screen: CommonHOC(UserHelperView)
    },
    Setting: {
      screen: CommonHOC(SettingView)
    },
    UserInfo: {
      screen: CommonHOC(UserInfoView)
    },
    Mandatory: {
      screen: MandatoryUpdateView
    },
    Content: {
      screen: CommonHOC(ContentView),
      navigationOptions: {
        tabBarVisible: false
      }
    },
    Statement: {
      screen: CommonHOC(StatementView)
    },
    Order: {
      screen: CommonHOC(ConfirmOrderView)
    },
    PayType: {
      screen: CommonHOC(PaySettingView)
    },
    Coupon: {
      screen: CommonHOC(CouponView)
    },
    Credit: {
      screen: CommonHOC(CreditCardView)
    },
    Manage_Card: {
      screen: CommonHOC(ManageCreditCardView)
    },
    Feedback: {
      screen: CommonHOC(FeedbackView)
    },
    PickPlace: {
      screen: CommonHOC(PickPlaceView)
    },
    MonthTicket: {
      screen: CommonHOC(PurchaseMonthTicketView)
    },
    Debug: {
      screen: CommonHOC(DebugView)
    },
  },
  {
    headerMode: "none",
    cardStyle: {
      backgroundColor: "#fff"
    },
    transitionConfig: (): Object => ({
      containerStyle: {
        backgroundColor: "#fff"
      },
      screenInterpolator: sceneProps => {
        return CardStackStyleInterpolator.forHorizontal(sceneProps);
      }
    })
  }
);

// 自定义路由拦截
const defaultGetStateForAction = MainView.router.getStateForAction;

// 拦截路由主方法
MainView.router.getStateForAction = (action, state) => {
  // console.log('action', action)
  // console.log('state', state)

  //登录拦截
  const mustLogin = AuthInterceptor(action, state);
  if (mustLogin) {
    let _action = {...action};
    if(_action.routeName == "UserInfoDrawer") {
      _action.routeName = "FoodDetails";
    }
    requestAnimationFrame(() => {
      store.dispatch({ type: "CHANGE_LOGIN_STATUS", showLogin: true });
      store.dispatch({ type: "SET_LOGIN_TO_PAGE", toPage: _action });
    });
    // return defaultGetStateForAction(newAction, state);
    return;
  }
  // if (action.type === NavigationActions.NAVIGATE) {
  //   source.cancel();
  // }
  if (state && action.type === NavigationActions.NAVIGATE) {
    if (action.params && action.params.replaceRoute) {
      //replaceRoute值 仅仅作为一个标识，进到这个方法之后就没有作用了
      delete action.params.replaceRoute;
      if (state.routes.length > 1 && state.index > 0) {
        let _routeIndex =
          typeof action.params.index == "undefined"
            ? state.routes.length - 2
            : action.params.index;
        let routes = null;
        if (_routeIndex == 0) {
          routes = [state.routes[0]];
        } else {
          routes = state.routes.slice(0, state.routes.length - 1);
        }
        // routes.push(action)
        return defaultGetStateForAction(action, {
          ...state,
          routes,
          index: _routeIndex
        });
      }
    }
  }

  // 避免重复跳转
  if (
    state &&
    action.type == NavigationActions.NAVIGATE &&
    action.routeName == state.routes[state.routes.length - 1].routeName
  ) {
    return null;
  }
  return defaultGetStateForAction(action, state);
};

export default MainView;
