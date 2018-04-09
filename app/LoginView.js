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
  Platform,
  StatusBar
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
  Icon,
  ActionSheet
} from "native-base";

//utils
import GLOBAL_PARAMS from "./utils/global_params";
import Colors from "./utils/Colors";
import ToastUtil from "./utils/ToastUtil"
//cache
import appStorage from './cache/appStorage'
//api
import api from './api/index'
import source from './api/CancelToken'

// const
const BUTTONS = [
  GLOBAL_PARAMS.phoneType.HK.label,
  GLOBAL_PARAMS.phoneType.CHN.label
];
const DESTRUCTIVE_INDEX = 3;
const CANCEL_INDEX = 4;
export default class LoginView extends Component {
  state = {
    phone: null,
    password: null,
    selectedValue:GLOBAL_PARAMS.phoneType.HK,
  };

  componentWillUnmount() {
    source.cancel()
  }


  //common function
  _getPhone(phone) {
    // let reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
    // if (reg.test(phone)) {
    //     this.setState({
    //       phone
    //     })
    // }
    // else{
      this.setState({
        phone: phone
      })
    // }
  }

  _getPassword(text) {
    this.setState({
      password: text
    });
  }

  _login() {
    if(this.state.phone === null){
      ToastUtil.showWithMessage("請填寫手機號")
      return
    }
    if(this.state.password === null){
      ToastUtil.showWithMessage("請填寫密碼")
      return
    }
    api.login(this.state.phone,this.state.selectedValue.value,this.state.password).then(data => {
      if(data.status === 200 && data.data.ro.ok){
        ToastUtil.showWithMessage("登錄成功")
        this.props.screenProps.userLogin(this.state.phone)
        this.props.navigation.goBack()
      }
      else{
        ToastUtil.showWithMessage("登錄失敗")
      }
    },() => {
      ToastUtil.showWithMessage("登錄失敗")
    })
  }

  _showActionSheet = () => {
    ActionSheet.show(
      {
        options: BUTTONS,
        cancelButtonIndex: CANCEL_INDEX,
        destructiveButtonIndex: DESTRUCTIVE_INDEX,
        title: "選擇電話類型"
      },
      buttonIndex => {
        switch (BUTTONS[buttonIndex]) {
          case GLOBAL_PARAMS.phoneType.HK.label:
            this.setState({ selectedValue: GLOBAL_PARAMS.phoneType.HK });
            break;
          case GLOBAL_PARAMS.phoneType.CHN.label:
            this.setState({ selectedValue: GLOBAL_PARAMS.phoneType.CHN });
            break;
        }
      }
    );
  };

  //views

  render() {
    let _imgHeight = GLOBAL_PARAMS._winWidth < 400 ?  GLOBAL_PARAMS._winHeight*0.35 : 250;
    return (
      <View style={{ flex: 1, backgroundColor: "#fafafa" }}>
        <StatusBar barStyle="light-content" />
        <View>
          <Image
            resizeMode="cover"
            style={{
              height: _imgHeight,
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
              marginTop: 250,
              backgroundColor: Colors.main_white,
              opacity: 1,
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
              style={{ position: "absolute", top: 35, right: 20, zIndex: 20 }}
            >
              <Image
                style={{ width: 28, height: 28 }}
                source={require("./asset/close.png")}
              />
            </Button>
            <View
              style={[{
                flex: 1,
                alignItems: "center",
                justifyContent: "flex-end",
                width: GLOBAL_PARAMS._winWidth,
                height: 150,

              },Platform.OS === 'ios' ? {
                position: "absolute",
                top: GLOBAL_PARAMS._winHeight * 0.15,
                left: 0
              } : {
                marginTop: 80
              } ]}
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
                {/*<Text style={{ color: "#fff", fontSize: 25 }}>Goforeat</Text>*/}
              </View>
            </View>

            <View
              style={[{
                flex: 1,
                alignItems: "center",
                width: GLOBAL_PARAMS._winWidth,
                marginTop: 30,
                // position: "absolute",
                // top: 0.35 * GLOBAL_PARAMS._winHeight,
                // left: 0
              },Platform.OS === 'ios' ? {
                position: "absolute",
                top: 0.35 * GLOBAL_PARAMS._winHeight,
                left: 0
              } : null]}
            >
              <View
                style={{
                  flex: 1,
                  width: 0.8 * GLOBAL_PARAMS._winWidth,
                  height: 50,
                  borderBottomWidth: 1,
                  marginBottom: 10,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  borderBottomColor: Colors.main_orange
                }}
              >
                <View style={{ width: 40, paddingLeft: 10 }}>
                  <Icon name="md-phone-portrait"
                    style={{color:Colors.main_orange,fontSize:28}} />
                  {/*<Image
                    source={require("./asset/phone.png")}
                    style={{
                      width: 22,
                      height: 22,
                      marginTop: -2
                    }}
                  />*/}
                </View>
                <Button transparent style={{marginLeft:-9,marginTop:2}} onPress={() => this._showActionSheet()}>
                  <Text style={{color:'gray'}}>{this.state.selectedValue.label}</Text>
                </Button>
                <View
                  style={{
                    flex: 1,
                    alignItems: "flex-start",
                    justifyContent: "center"
                  }}
                >
                  <Input
                    style={{
                      color: Colors.fontBlack,
                      width: GLOBAL_PARAMS._winWidth * 0.45
                    }}
                    onChangeText={phone => this._getPhone(phone)}
                    multiline={false}
                    autoFocus={false}
                    placeholder="請輸入手機號"
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
                  borderBottomWidth:1,
                  marginBottom: 5,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  borderBottomColor: Colors.main_orange
                }}
              >
                <View style={{ width: 40, paddingLeft: 10 }}>

                   <Icon name="md-lock" style={{fontSize: 28,color: Colors.main_orange}}/>
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
                      color: Colors.fontBlack,
                      width: GLOBAL_PARAMS._winWidth * 0.55
                    }}
                    onChangeText={password => this._getPassword(password)}
                    multiline={false}
                    autoFocus={false}
                    placeholder="請輸入密碼"
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
                    borderColor: Colors.main_orange,
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
                        color: Colors.main_orange,
                        fontSize: 20,
                        fontWeight: "500"
                      }}
                    >
                      登录
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('Register')}>
                <View
                  style={{
                    width: GLOBAL_PARAMS._winWidth,
                    height: 20,
                    marginTop: 15
                  }}
                  >
                    <Text
                      style={{ textAlign: "center", fontSize: 14, color: Colors.deep_gray }}
                      >
                        新用戶?點擊註冊
                      </Text>
                  </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        {/* <View
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
              新用戶?點擊註冊
            </Text>
          </View>
        </View> */}
      </View>
    );
  }
}
