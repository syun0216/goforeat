import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { View, Image, TouchableOpacity } from "react-native";
import { Container, Content, Icon } from "native-base";
import { connect } from "react-redux";
import Text from "./UnScalingText";
import LinearGradient from "react-native-linear-gradient";
import LottieView from "lottie-react-native";
import { DrawerItems, NavigationActions } from "react-navigation";
import { isNil } from 'lodash';
//store
import store from "../store";
//styles
import MainViewStyles from "../styles/mainview.style";
//language
import i18n from '../language/i18n';
//utils
import {em, currentPlatform} from '../utils/global_params';
import { getVersion } from '../utils/DeviceInfo';

const CustomDarwerItem = ({ leftImage, title }) => (
  <View style={MainViewStyles.drawerItemBtn}>
    <Image
      source={leftImage}
      style={MainViewStyles.drawerItemImage}
      resizeMode="contain"
    />
    <Text style={MainViewStyles.drawerItemText}>{title}</Text>
  </View>
);

const customItemPress = ({ route, focused }, navigation) => {
  // console.log(route);
  // console.log(navigation);
  let _toPage = (route, focused, navigation) => {
    navigation.navigate("DrawerClose");
    if (!focused) {
      let subAction;
      if (route.index !== undefined && route.index !== 0) {
        subAction = NavigationActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({
              routeName: route.routes[0].routeName
            })
          ]
        });
      }
      navigation.navigate(route.routeName, undefined, subAction);
    }
  };
  _toPage(route, focused, navigation);
};

class CustomDrawer extends PureComponent {
  render() {
    const stateToDrawer = {
      language: store.getState().language.language,
      userInfo: store.getState().auth,
      activityInfo: store.getState().activityInfo,
      sid: store.getState().auth.sid,
      user: store.getState().auth.username,
    };
    const {
      language,
      user,
      userInfo: { username, nickName, profileImg },
      activityInfo,
      sid
    } = this.props;
    let _drawItemArr = [
      {
        title: i18n[language].dailyFood,
        leftImage: require("../asset/food.png")
      },
      {
        title: i18n[language].myorder,
        leftImage: require("../asset/order.png")
      },
      {
        title: i18n[language].pickPlace,
        leftImage: require("../asset/location.png")
      },
      {
        title: i18n[language].payment,
        leftImage: require("../asset/payment.png")
      },
      {
        title: i18n[language].myMonthTicket,
        leftImage: require("../asset/monthticket.png")
      },
      {
        title: i18n[language].ticket,
        leftImage: require("../asset/coupon.png")
      },
      {
        title: i18n[language].setting,
        leftImage: require("../asset/setting.png")
      },
      {
        title: i18n[language].setting,
        leftImage: require("../asset/setting.png")
      }
    ];
    let _alreadyLogin = user != null;
    return (
      <Container>
        <View>
          <LinearGradient
            colors={["#FF7A00", "#FE560A"]}
            start={{ x: 0.0, y: 0.0 }}
            end={{ x: 1.0, y: 0.0 }}
            style={MainViewStyles.drawerTopContainer}
          >
            <Image
              source={
                _alreadyLogin
                  ? profileImg != "" && profileImg
                    ? { uri: profileImg }
                    : require("../asset/defaultAvatar.png")
                  : require("../asset/notlogged.png")
              }
              style={[
                MainViewStyles.drawerTopImage,
                !profileImg && { borderWidth: 0 }
              ]}
            />
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("UserInfo")}
              style={MainViewStyles.drawerTopImageContainer}
            >
              <View style={{ height: em(70), justifyContent: "space-around" }}>
                <Text style={MainViewStyles.topName}>
                  {_alreadyLogin ? nickName || "日日有得食" : "日日有得食"}
                </Text>
                {_alreadyLogin ? (
                  <Text style={MainViewStyles.topNickName}>{username}</Text>
                ) : (
                  <Text style={MainViewStyles.topNickName}>立即登錄</Text>
                )}
              </View>
              <Text style={MainViewStyles.loginBtnText}>
                {_alreadyLogin ? "去更改" : ""}{" "}
                <Icon
                  name="ios-arrow-forward"
                  style={MainViewStyles.loginBtnArrow}
                />
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
        <Content style={MainViewStyles.drawerContent}>
          <View style={MainViewStyles.drawerInnerContent}>
            <DrawerItems
              {...this.props}
              onItemPress={({ route, focused }) => {
                // customItemPress({ route, focused }, props.navigation)
                // console.log(route);
                if (route.routeName == "FoodListDrawer") {
                  customItemPress({ route, focused }, this.props.navigation);
                } else {
                  let _route = route.routeName.split("D")[0];
                  this.props.navigation.navigate(_route);
                }
              }}
              getLabel={scene => {
                if (scene.route.routeName == "UserInfoDrawer") {
                  return null;
                }
                return <CustomDarwerItem {..._drawItemArr[scene.index]} />;
              }}
            />
            {!isNil(activityInfo.activity) &&
              activityInfo.activity.showStatus == 1 && (
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={MainViewStyles.LottieView}
                  onPress={() => {
                    this.props.navigation.navigate("Content", {
                      data: {
                        url: `${activityInfo.activity.myInviteUrl}?sid=${
                          sid
                        }&language=${
                          language
                        }&sellClient=${currentPlatform}&appVersion=${getVersion()}`,
                        title: "邀請好友落Order獎你HKD10優惠券",
                        message: "goforeat"
                      },
                      kind: "activity"
                    });
                  }}
                >
                  <LottieView
                    style={MainViewStyles.lottieIcon}
                    autoPlay={true}
                    source={require("../animations/bell.json")}
                    loop={true}
                  />
                  <View style={MainViewStyles.lottieContent}>
                    <Text style={MainViewStyles.drawerItemText}>{i18n[language].invite}</Text>
                    <Text
                      style={[
                        MainViewStyles.drawerItemText,
                        {
                          color: "#ff5050",
                          fontSize: em(14),
                          marginTop: em(10)
                        }
                      ]}
                    >
                      已獲得{activityInfo.activity.inviteCount || "0"}張優惠券
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
          </View>
        </Content>
      </Container>
    );
  }
}

const stateToDrawer = state => ({
  user: state.auth.username,
  userInfo: state.auth,
  activityInfo: state.activityInfo,
  language: state.language.language,
  sid: state.auth.sid,
});

export default connect(stateToDrawer, {})(CustomDrawer);
