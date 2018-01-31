import React, { Component } from "react";
import {
  StyleSheet,
  ScrollView,
  Image,
  View,
  Dimensions,
  TouchableOpacity,
  Animated,
  Easing,
  Platform
} from "react-native";
import {
  Container,
  Content,
  Form,
  Item,
  Input,
  Label,
  Button,
  Text,
  Toast,
  Header,
  Body,
  Left,
  Right,
  Icon
} from "native-base";
import { StatusBar } from "react-native";
//utils
import GLOBAL_PARAMS from "./utils/global_params";
import Colors from "./utils/Colors";
import ToastUtil from "./utils/ToastUtil"
//cache
import appStorage from './utils/appStorage'
//api
import api from './api/index'
//react-redux
import {connect} from 'react-redux'
import {user} from './utils/mapStateAndDIspatch'

class LoginView extends Component {
  state = {
    phone: "",
    password: "",
    disabled: true
  };

  //common function
  _getPhone(text) {
    this.setState({
        phone:text
    })
  }

  _getPassword(text) {
    this.setState({
      password: text
    });
  }

  _login() {
    if (this.state.phone === "" && this.state.password === "") {
      ToastUtil.show("请填写用户名或密码", 1000, "bottom");
      return;
    }
    api.testLogin(this.state.phone,this.state.password).then(data => {
        console.log(data)
        if(data.status === 200 && !data.data.code) {
            appStorage.setLoginUserJsonData(data.data.data[0])
            this.props.userLogin(data.data.data[0])
        }else {
            Toast.show(data.data.msg,1000,'bottom','error')
        }
    })
    // const resetAction = NavigationActions.reset({
    //     index: 0,
    //     actions: [
    //         NavigationActions.navigate({ routeName: 'Home'})
    //     ]
    // });
    // UserStore.setLoginUserJsonData(this.state.phone);
    // console.log(userData.account.id);
    // this.props.navigation.dispatch(resetAction);
    // this.props.navigation.goBack();
  }

  _register() {
    if (this.state.phone === "" && this.state.password === "") {
      ToastUtil.show("请填写用户名或密码", 1000, "bottom");
      return;
    }
    if (this.state.phone !== "18022129789" && this.state.password !== "123") {
      ToastUtil.show("用户名和密码错误", 1000, "bottom", "danger");
      return;
    }
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#fafafa" }}>
        <StatusBar barStyle="light-content" />
        <View>
          <Image
            resizeMode="cover"
            style={{
              height: GLOBAL_PARAMS._winHeight,
              width: GLOBAL_PARAMS._winWidth,
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 0
            }}
            source={{ uri: "loginbg" }}
          />
          <View
            style={{
              width: GLOBAL_PARAMS._winWidth,
              height: GLOBAL_PARAMS._winHeight,
              backgroundColor: Colors.fontBlack,
              opacity: 0.6,
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 0
            }}
          />
        </View>
        <ScrollView style={{ position: "relative" }}>
          <View style={{ flex: 1 }}>
            <Button
              onPress={() => this.props.navigation.goBack()}
              transparent
              style={{ position: "absolute", top: 25, right: 10, zIndex: 20 }}
            >
              <Image
                style={{ width: 28, height: 28 }}
                source={require("./asset/close.png")}
              />
            </Button>
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "flex-end",
                width: GLOBAL_PARAMS._winWidth,
                height: 150,
                position: "absolute",
                top: GLOBAL_PARAMS._winHeight * 0.15,
                left: 0
              }}
            >
              {/* <Animated.View style={{
                          transform: [{
                              rotateZ: this.state.rotateValue.interpolate({
                                  inputRange: [0, 1],
                                  outputRange: ['0deg', '360deg']
                              })
                          }],
                          width: 80, height: 80
                      }}>
                          <Image style={{width: 80, height: 80}} source={require('./assets/react.png')}/>
                      </Animated.View> */}
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  width: GLOBAL_PARAMS._winWidth,
                  height: 30
                }}
              >
                <Text style={{ color: "#fff", fontSize: 25 }}>Goforeat</Text>
              </View>
            </View>

            <View
              style={{
                flex: 1,
                alignItems: "center",
                width: GLOBAL_PARAMS._winWidth,
                marginTop: 30,
                position: "absolute",
                top: 0.35 * GLOBAL_PARAMS._winHeight,
                left: 0
              }}
            >
              <View
                style={{
                  flex: 1,
                  width: 0.8 * GLOBAL_PARAMS._winWidth,
                  height: 50,
                  backgroundColor: "#000",
                  marginBottom: 10,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: 0.6
                }}
              >
                <View style={{ width: 40, paddingLeft: 10 }}>
                  <Image
                    source={require("./asset/phone.png")}
                    style={{
                      width: 22,
                      height: 22,
                      marginTop: -2
                    }}
                  />
                </View>
                <View
                  style={{
                    flex: 1,
                    alignItems: "flex-start",
                    justifyContent: "center"
                  }}
                >
                  <Input
                    style={{
                      color: "white",
                      width: GLOBAL_PARAMS._winWidth * 0.55
                    }}
                    onChangeText={phone => this._getPhone(phone)}
                    multiline={false}
                    autoFocus={false}
                    placeholder="请输入手机号"
                    keyboardType="numeric"
                    clearButtonMode="while-editing"
                    placeholderTextColor="gray"
                    maxLength={11}
                    returnKeyType="done"
                  />
                </View>
              </View>
              <View
                style={{
                  flex: 1,
                  width: 0.8 * GLOBAL_PARAMS._winWidth,
                  height: 50,
                  backgroundColor: "#000",
                  marginBottom: 5,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: 0.6
                }}
              >
                <View style={{ width: 40, paddingLeft: 10 }}>
                  <Image
                    source={require("./asset/password.png")}
                    style={{ width: 20, height: 20, marginTop: -2 }}
                  />
                </View>
                <View
                  style={{
                    flex: 1,
                    alignItems: "flex-start",
                    justifyContent: "center"
                  }}
                >
                  <Input
                    style={{
                      color: "white",
                      width: GLOBAL_PARAMS._winWidth * 0.55
                    }}
                    onChangeText={password => this._getPassword(password)}
                    multiline={false}
                    autoFocus={false}
                    placeholder="请输入密码"
                    clearButtonMode="while-editing"
                    placeholderTextColor="gray"
                    returnKeyType="done"
                    secureTextEntry={true}
                  />
                </View>
              </View>
              <View
                style={{
                  width: GLOBAL_PARAMS._winWidth,
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 20
                }}
              >
                <TouchableOpacity
                  style={{
                    width: GLOBAL_PARAMS._winWidth * 0.8,
                    height: 50,
                    borderColor: Colors.main_yellow,
                    borderWidth: 2,
                    backgroundColor: "transparent",
                    flex: 1,
                    alignItems: "center",
                    borderRadius: 25,
                    justifyContent: "center"
                  }}
                  onPress={() => this._login()}
                >
                  <View>
                    <Text
                      style={{
                        color: Colors.main_yellow,
                        fontSize: 20,
                        fontWeight: "500"
                      }}
                    >
                      登录
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  width: GLOBAL_PARAMS._winWidth,
                  height: 20,
                  marginTop: 15
                }}
              >
                <Text
                  style={{ textAlign: "center", fontSize: 12, color: "#fff" }}
                >
                  忘记密码？
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0.1 * GLOBAL_PARAMS._winWidth,
            opacity: 0.9
          }}
        >
          <View
            style={{
              width: 0.8 * GLOBAL_PARAMS._winWidth,
              borderTopColor: "#fff",
              borderTopWidth: 1
            }}
          >
            <Text
              style={{
                textAlign: "center",
                color: "#fff",
                padding: 10,
                fontSize: 12
              }}
            >
              新用户？点击注册
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

export default connect(user.mapStateToProps,user.mapDispatchToProps)(LoginView)