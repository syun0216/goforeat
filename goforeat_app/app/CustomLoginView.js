import React, { PureComponent } from 'react';
import {
  ScrollView,
  Image,
  View,
  TouchableOpacity,
  Platform,
  StatusBar,
  Animated,
  Easing,
  Keyboard
} from "react-native";
import {
  Input,
  Button,
  Text,
  Icon,
  ActionSheet
} from "native-base";
import LinearGradient from 'react-native-linear-gradient';
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
//styles 
import LoginStyle from '../app/styles/login.style';

const BUTTONS = [
  GLOBAL_PARAMS.phoneType.HK.label,
  GLOBAL_PARAMS.phoneType.CHN.label
];
const DESTRUCTIVE_INDEX = 3;
const CANCEL_INDEX = 4;

export default class CustomLoginView extends PureComponent {
  _textInput = null;
  token = 'null';
  _timer = null;
  _keyboard_height = 0;
  state = {
    phone: null,
    password: null,
    selectedValue:GLOBAL_PARAMS.phoneType.HK,
    codeContent: '點擊發送',
    isCodeDisabled: false,
    isKeyBoardShow: false,
    containerTop: new Animated.Value(0),
    keyboardHeight: null
  };

  componentWillMount () {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => this._keyboardDidShow(e));
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => this._keyboardDidHide());
  }

  componentWillUnmount() {
    source.cancel();
    clearInterval(this.interval);
    clearTimeout(this._timer);
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  //common function

  _keyboardDidShow (e) {
    // this._keyboard_height = e.startCoordinates.height - e.endCoordinates.height;
    this._toggleKeyBoard(1);
  }

  _keyboardDidHide () {
    this._toggleKeyBoard(0);
  }

  _sendPhoneAndGetCode() {
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
    this.setState({
      phone: phone
    })
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
          api.saveDevices(registrationId,this.token).then((sdata) => {
            // console.log(111,sdata);
            // console.log(222,registrationId);
          });
        },() => {
          ToastUtil.showWithMessage("登錄失敗")
        })
      }
      else{
        ToastUtil.showWithMessage(data.data.ro.respMsg);
      }
    })
    .catch(err => {
      ToastUtil.showWithMessage('發生未知錯誤');
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

  _toggleKeyBoard(val) {
      Animated.timing(this.state.containerTop, {
        toValue: val,
        duration: 200,
        easing: Easing.linear
      }).start();
  }

  //render function

  _renderTopImage() {
    let {navigation} = this.props;
    return (
      <View style={LoginStyle.TopImageView}>
        <Image source={require('./asset/login_bg.png')}
        style={LoginStyle.TopImage} reasizeMode="cover"/>
        <View style={LoginStyle.TopImageViewInner}>
          <Image source={require('./asset/logoTop.png')} style={LoginStyle.TopImageViewTitle}/>
        </View>
        <TouchableOpacity style={LoginStyle.CloseBtn} 
        onPress={() => {navigation.goBack();
          if(navigation.state.params) {
            if(navigation.state.params.page == 'Order') {
              navigation.state.params.reloadFunc();
            }
          }
        }}>
          <Image source={require('./asset/close2.png')} style={LoginStyle.CloseImage}/>
        </TouchableOpacity>
      </View>
    )
  }

  _renderContentView() {
    return (
      <View style={LoginStyle.ContentView}>
        <Text style={LoginStyle.Title}>手機號登入</Text>
        <View style={LoginStyle.CommonView}>
          <View style={LoginStyle.CommonInputView}>
            <Image source={require('./asset/phone.png')} style={LoginStyle.Icon} reasizeMode="cover"/>
            <TouchableOpacity onPress={() => this._showActionSheet()} style={LoginStyle.ChangePhoneTypeBtn}>
              <Text style={LoginStyle.PhoneTypeText}>{this.state.selectedValue.label}</Text>
              <Image reasizeMode="cover" source={require('./asset/arrowdown.png')} style={LoginStyle.ArrowDown}/>
            </TouchableOpacity>
            <Input 
              ref={(t) => this._textInput = t}
              onChangeText={phone => this._getPhone(phone)}
              style={LoginStyle.CommonInput}
              multiline={false}
              autoFocus={false}
              placeholder='請輸入手機號'
              keyboardType="numeric"
              clearButtonMode="while-editing"
              placeholderTextColor="#999999"
              maxLength={11}
              returnKeyType="done"/>
          </View>
          <View style={LoginStyle.CommonInputView}>
            <Image source={require('./asset/password.png')} style={LoginStyle.Icon} reasizeMode="cover"/>
            <Input 
            onChangeText={password => this._getPassword(password)}
            style={LoginStyle.CommonInput} 
            multiline={false}
            autoFocus={false}
            placeholder="請輸入驗證碼"
            clearButtonMode="while-editing"
            placeholderTextColor="#999999"
            returnKeyType="done"
            keyboardType="numeric"
            maxLength={6}/>
            <TouchableOpacity style={LoginStyle.SendBtn} disabled={this.state.isCodeDisabled} onPress={() => this._sendPhoneAndGetCode()}>
              <Text style={LoginStyle.SendText}>{this.state.codeContent}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={LoginStyle.CommonView}>
          <TouchableOpacity onPress={() => this._login()}>
          <LinearGradient colors={['#FF9F48','#FF4141']} start={{x:0.0, y:0.0}} end={{x:1.0,y: 0.0}} style={LoginStyle.LoginBtn}>
            <Text style={{color:'#fff',fontSize:16}}>登入/註冊</Text>
          </LinearGradient>
        </TouchableOpacity>
        </View>
      </View>
    )
  }

  _renderDividerView() {
    return (
      <View style={LoginStyle.DividerView}>
        <View style={LoginStyle.Divider}/>
        <Text style={LoginStyle.DividerText}>或</Text>
        <View style={LoginStyle.Divider}/>
      </View>
    )
  }

  _renderBottomView() {
    return (
      <View style={LoginStyle.BottomView}>
        {this._renderDividerView()}
        <View style={LoginStyle.BottomViewInner}>
          <Image source={require('./asset/facebook2.png')} style={LoginStyle.BottomViewInnerImage} />
          <Image source={require('./asset/wechat.png')} style={LoginStyle.BottomViewInnerImage} />
        </View>
      </View>
    )
  }

  render() {
    return (
      <Animated.View style={[LoginStyle.LoginContainer,{transform: [{translateY: this.state.containerTop.interpolate({
        inputRange: [0,1],
        outputRange: [0,GLOBAL_PARAMS._winHeight<667?-GLOBAL_PARAMS._winHeight*0.25:-260]
      })}]}]}>
        {this._renderTopImage()}
        {this._renderContentView()}
        {this._renderBottomView()}
      </Animated.View>
    )
  }

}
