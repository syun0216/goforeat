import React, { PureComponent } from "react";
import { View, Image } from "react-native";
import {
  Container,
  Content,
  Form,
  Item,
  Input,
  Label,
  Body,
  Button,
  Text,
  Icon,
  Left,
  Right,
  ActionSheet
} from "native-base";
import { NavigationActions } from "react-navigation";
//utils
import Colors from "./utils/Colors";
import GLOBAL_PARAMS from "./utils/global_params";
import ToastUtil from "./utils/ToastUtil";
//api
import api from "./api";
import source from "./api/CancelToken";
//components
import CommonHeader from "./components/CommonHeader";

const BUTTONS = [
  GLOBAL_PARAMS.phoneType.HK.label,
  GLOBAL_PARAMS.phoneType.CHN.label
];
const DESTRUCTIVE_INDEX = 3;
const CANCEL_INDEX = 4;

export default class RegisterView extends PureComponent {
  token = null;
  interval = null; //定時器

  state = {
    selectedValue: GLOBAL_PARAMS.phoneType.HK,
    isBtnDisabled: true,
    codeContent: "點擊發送",
    isCodeDisabled: false,
    phone: null,
    code: null,
    password: null
  };

  componentWillUnmount() {
    source.cancel();
    clearInterval(this.interval);
  }

  //common function
  _sendPhoneAndGetCode = () => {
    if (this.state.phone === null) {
      ToastUtil.showWithMessage("手機號格式有誤");
      return;
    }
    api.getCode(this.state.phone, this.state.selectedValue.value).then(
      data => {
        console.log(data);
        if (data.status === 200 && data.data.ro.ok) {
          this.token = data.data.data.token;
          ToastUtil.showWithMessage("驗證碼發送成功");
          let _during = 60;
          this.interval = setInterval(() => {
            _during--;
            this.setState({
              codeContent: `${_during}秒后重發`,
              isCodeDisabled: true
            });
            if (_during === 0) {
              this.setState({
                codeContent: "重新發送",
                isCodeDisabled: false
              });
              clearInterval(interval);
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

  _getPhone = phone => {
    // let reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
    // if (reg.test(phone)) {
    //     this.setState({
    //       isBtnDisabled: false,
    //       phone
    //     })
    // }
    // else{
    this.setState({
      isBtnDisabled: false,
      phone: phone
    });
    // }
  };

  _getCode = code => {
    this.setState({
      code
    });
  };

  _getPassword = password => {
    this.setState({
      password
    });
  };

  _register = () => {
    if (this.state.password === null) {
      ToastUtil.showWithMessage("請輸入密碼");
      return;
    }
    if (this.state.code === null) {
      ToastUtil.showWithMessage("請輸入6位驗證碼");
      return;
    }
    api
      .register(
        this.state.phone,
        this.state.selectedValue.value,
        this.token,
        this.state.code,
        this.state.password
      )
      .then(
        data => {
          // console.log(data);
          if (data.status === 200 && data.data.ro.ok) {
            ToastUtil.showWithMessage("註冊成功");
            this.props.screenProps.userLogin(this.state.phone);
            const resetAction = NavigationActions.reset({
              index: 0,
              actions: [
                NavigationActions.navigate({
                  routeName: "Home",
                  params: { refresh: true }
                })
              ]
            });
            this.props.navigation.dispatch(resetAction);
          } else {
            ToastUtil.showWithMessage(data.data.ro.respMsg);
          }
        },
        () => {
          ToastUtil.showWithMessage("註冊失敗");
        }
      );
  };

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

  render() {
    return (
      <Container>
        <CommonHeader canBack title="用戶註冊" {...this["props"]} />
        <Content>
          <Form>
            <Item>
              <Label>選擇區域</Label>
              <Button transparent onPress={() => this._showActionSheet()}>
                <Text style={{ color: this.props.screenProps.theme }}>
                  {this.state.selectedValue.label}
                </Text>
                <Text style={{ color: this.props.screenProps.theme }}>
                  {this.state.clicked}
                </Text>
              </Button>
            </Item>
            <Item inlineLabel>
              {/* <Label>填寫手機號</Label> */}
              <Input
                onChangeText={phone => this._getPhone(phone)}
                placeholder="填寫手機號碼"
                autoFocus={false}
                keyboardType="numeric"
                clearButtonMode="while-editing"
                maxLength={11}
                returnKeyType="done"
              />
            </Item>
            <Item inlineLabel>
              <Input
                placeholder="填寫密碼"
                returnKeyType="done"
                maxLength={12}
                secureTextEntry={true}
                onChangeText={password => this._getPassword(password)}
              />
            </Item>
            <Item inlineLabel last>
              {/* <Label>發送驗證碼</Label> */}
              <Input
                placeholder="填寫驗證碼"
                keyboardType="numeric"
                returnKeyType="done"
                maxLength={6}
                onChangeText={code => this._getCode(code)}
              />
              <Button
                disabled={this.state.isCodeDisabled}
                transparent
                onPress={() => this._sendPhoneAndGetCode()}
              >
                <Text
                  style={
                    this.state.isCodeDisabled
                      ? { color: "#959595" }
                      : { color: this.props.screenProps.theme }
                  }
                >
                  {this.state.codeContent}
                </Text>
              </Button>
            </Item>
            <Button
              onPress={() => this._register()}
              block
              disabled={this.state.isBtnDisabled}
              style={[
                {
                  marginTop: 10,
                  marginLeft: 10,
                  marginRight: 10
                },
                this.state.isBtnDisabled
                  ? null
                  : { backgroundColor: this.props.screenProps.theme }
              ]}
            >
              <Text>點擊註冊</Text>
            </Button>
          </Form>
        </Content>
      </Container>
    );
  }
}
