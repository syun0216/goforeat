import React, { Component } from "react";
import {
  ScrollView,
  Image,
  View,
  TouchableOpacity,
  Platform,
  StatusBar
} from "react-native";
import {
  Input,
  Button,
  Text,
  Icon,
  ActionSheet
} from "native-base";
//utils
import GLOBAL_PARAMS from "./utils/global_params";
import Colors from "./utils/Colors";
import ToastUtil from "./utils/ToastUtil";
//cache
import appStorage from './cache/appStorage';
//api
import api from './api/index';
import source from './api/CancelToken';
//language
import i18n from './language/i18n';
//jpush
import JPushModule from 'jpush-react-native';

// const
const BUTTONS = [
  GLOBAL_PARAMS.phoneType.HK.label,
  GLOBAL_PARAMS.phoneType.CHN.label
];
const DESTRUCTIVE_INDEX = 3;
const CANCEL_INDEX = 4;
export default class LoginView extends Component {
  token = 'null';
  state = {
    phone: null,
    password: null,
    selectedValue:GLOBAL_PARAMS.phoneType.HK,
    codeContent: i18n[this.props.screenProps.language].send_code,
    isCodeDisabled: false,
    i18n: i18n[this.props.screenProps.language],
  };

  componentWillUnmount() {
    source.cancel();
    clearInterval(this.interval);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      i18n: i18n[nextProps.screenProps.language]
    });
  }



  //common function

  _sendPhoneAndGetCode = () => {
    if (this.state.phone === null) {
      ToastUtil.showWithMessage("手機號格式有誤");
      return;
    }
    api.getCode(this.state.phone, this.state.selectedValue.value).then(
      data => {
        if (data.status === 200 && data.data.ro.ok) {
          this.token = data.data.data.token;
          // console.log(this.token);
          ToastUtil.showWithMessage("驗證碼發送成功");
          let _during = 60;
          this.interval = setInterval(() => {
            _during--;
            this.setState({
              codeContent: `${_during}${i18n[this.props.screenProps.language].second}`,
              isCodeDisabled: true
            });
            if (_during === 0) {
              this.setState({
                codeContent: i18n[this.props.screenProps.language].retry_code,
                isCodeDisabled: false
              });
              clearInterval(this.interval);
            }
          }, 1000);
        } else {
          ToastUtil.showWithMessage(data.data.ro.respMsg);
        }
      },
      () => {
        ToastUtil.showWithMessage("驗證碼發送失敗");
      }
    );
  };

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
    let {params} = this.props.navigation.state;
    if(this.state.phone === null){
      ToastUtil.showWithMessage("請填寫手機號")
      return
    }
    if(this.state.password === null){
      ToastUtil.showWithMessage("請填寫驗證碼")
      return
    }
    api.checkCode(this.state.phone,this.state.selectedValue.value,this.token,this.state.password).then(data => {
      if(data.status === 200 && data.data.ro.ok){
        // console.log(data);
        ToastUtil.showWithMessage("登錄成功")
        appStorage.setLoginUserJsonData(this.state.phone,data.data.data.sid);
        this.props.screenProps.userLogin(this.state.phone,data.data.data.sid);
        if(typeof params === 'undefined') {
          this.props.navigation.goBack()
        }else {
          if(params.page == 'Order') {
            this.props.navigation.navigate('Order',
              {
                  replaceRoute: true,
                  foodId: params.foodId,
                  placeId: params.placeId,
                  amount: params.amount,
                  total: params.total
              })
          }else {
            this.props.navigation.navigate(params.page,{replaceRoute: true,});
          }
        }
        JPushModule.getRegistrationID(registrationId => {
          api.saveDevices(registrationId,this.token);
        },() => {
          ToastUtil.showWithMessage("登錄失敗")
        })
      }
      else{
        ToastUtil.showWithMessage(data.data.ro.respMsg);
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
    const {i18n} = this.state;
    let {navigation,screenProps:{theme}} = this.props;
    let _imgHeight = GLOBAL_PARAMS._winWidth < 350 ?  GLOBAL_PARAMS._winHeight*0.35 : 250;
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
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
              zIndex: 10
            }}
            source={require('./asset/loginbg.png')}
          />
          <View
            style={{
              width: GLOBAL_PARAMS._winWidth,
              height: _imgHeight,
              // marginTop: 250,
              backgroundColor: theme,
              opacity: 1,
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 0
            }}
          />
        </View>
        <Button
              onPress={() => {navigation.goBack();
              if(navigation.state.params) {
                if(navigation.state.params.page == 'Order') {
                  navigation.state.params.reloadFunc();
                }
              }
            }}
              transparent
              style={{ position: "absolute", top: 35, right: 20, zIndex: 20 }}
            >
              <Image
                style={{ width: 28, height: 28 }}
                source={require("./asset/close.png")}
              />
            </Button>
        <ScrollView style={{ position: "relative" }}>
          <View style={{ flex: 1 }}>
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
                  borderBottomColor: theme
                }}
              >
                <View style={{ width: 40, paddingLeft: 10 }}>
                  <Icon name="md-phone-portrait"
                    style={{color:theme,fontSize:28}} />
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
                    placeholder={i18n.login_phone}
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
                  borderBottomColor: theme
                }}
              >
                <View style={{ width: 40, paddingLeft: 10 }}>

                   <Icon name="md-lock" style={{fontSize: 28,color: theme}}/>
                </View>
                <View
                  style={{
                    flex: 1,
                    alignItems: "flex-start",
                    justifyContent: "center",
                    position:'relative'
                  }}
                >
                  <Input
                    style={{
                      color: Colors.fontBlack,
                      width: GLOBAL_PARAMS._winWidth * 0.35
                    }}
                    onChangeText={password => this._getPassword(password)}
                    multiline={false}
                    autoFocus={false}
                    placeholder={i18n.login_code}
                    clearButtonMode="while-editing"
                    placeholderTextColor="gray"
                    returnKeyType="done"
                    keyboardType="numeric"
                    maxLength={6}
                  />
                  <Button
                style={{position: 'absolute',right:10,top: -1}}
                disabled={this.state.isCodeDisabled}
                transparent
                onPress={() => this._sendPhoneAndGetCode()}
              >
                <Text
                  style={
                    this.state.isCodeDisabled
                      ? { color: "#959595" }
                      : { color: theme }
                  }
                >
                  {this.state.codeContent}
                </Text>
              </Button>
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
                    borderColor: theme,
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
                        color: theme,
                        fontSize: 20,
                        fontWeight: "500"
                      }}
                    >
                    {i18n.login_text}
                    </Text>
                  </View>
                </TouchableOpacity>
                
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}
