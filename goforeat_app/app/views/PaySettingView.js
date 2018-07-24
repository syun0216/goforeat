import React, { PureComponent } from 'react';
import {View,Image,Text,Platform} from 'react-native';
import {Container,Content} from 'native-base';
//components
import CommonItem from '../components/CommonItem';
import CommonHeader from '../components/CommonHeader';
import Divider from '../components/Divider';
//utils
import Colors from '../utils/Colors';
import {formatCard} from '../utils/FormatCardInfo';
//styles
import PaySettingStyles from '../styles/paysetting.style';
//cache
import AppStorage from '../cache/appStorage';

const _checked = '../asset/checked.png';
const _unchecked = '../asset/unchecked.png';
const LIST_IMAGE = {
  CASH: require('../asset/cash.png'),
  APPLE_PAY: require('../asset/apple_pay.png'),
  ANDROID_PAY: require('../asset/android_pay.png'),
  CREDIT_CARD: require('../asset/creditcard.png'),
  WECHAT: require('../asset/wechat_pay.png'),
  ALI: require('../asset/ali_pay.png'),
};

export default class PaySettingView extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      checkedName: props.screenProps.paytype,
      creditCardInfo: props.screenProps.creditCardInfo
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      creditCardInfo: nextProps.screenProps.creditCardInfo
    })
  }

  _checked(name) {
    this.setState(
      {checkedName: name}
    );
    AppStorage.setPayType(name);
    this.props.screenProps.setPayType(name);
  }

  _checkedImage(name) {
    if(this.state.checkedName == name) {
      return (<Image source={require(_checked)} style={PaySettingStyles.payRightImage} resizeMode="contain"/>)
    }else{
      return (<Image source={require(_unchecked)} style={PaySettingStyles.payRightImage} resizeMode="contain"/>)
    }
  }

  _leftImage(image) {
    return (<Image source={image} style={PaySettingStyles.payLeftImage} resizeMode="contain"/>)
  }
   
  render() {
    const _list_arr = [
      {
        content: '現金支付',hasLeftIcon: true,leftIcon:this._leftImage(LIST_IMAGE.CASH),rightIcon:this._checkedImage('cash'),clickFunc: () => this._checked('cash')
      },
      // {
      //   content: 'WeChat Pay',hasLeftIcon: true,leftIcon:this._leftImage(LIST_IMAGE.WECHAT),rightIcon:this._checkedImage('wechat'),clickFunc: () => this._checked('wechat')
      // },
      // {
      //   content: 'Ali Pay',hasLeftIcon: true,isEnd: true,leftIcon:this._leftImage(LIST_IMAGE.ALI),rightIcon:this._checkedImage('ali'),clickFunc: () => this._checked('ali')
      // }
    ];
    let _verify_platform_pay = null;
    if(Platform.OS == 'android') {
      _verify_platform_pay = {
        content: 'Android Pay',hasLeftIcon: true,leftIcon:this._leftImage(LIST_IMAGE.ANDROID_PAY),rightIcon:this._checkedImage('android_pay'),clickFunc: () => {this._checked('android_pay');}
      }
    }else {
      _verify_platform_pay = {
        content: 'Apple Pay',hasLeftIcon: true,leftIcon:this._leftImage(LIST_IMAGE.APPLE_PAY),rightIcon:this._checkedImage('apple_pay'),clickFunc: () => {this._checked('apple_pay');}
      };
    }
    // _list_arr.push(_verify_platform_pay);  //暫時屏蔽apple_pay和android_pay
    let {creditCardInfo} = this.state;
    let _creditCardNumber = '';
    if(creditCardInfo != null) {
      _creditCardNumber = formatCard(creditCardInfo.card);
    }
    return (
      <Container>
      <CommonHeader title="我的支付方式" canBack {...this.props}/>
        <Content style={{backgroundColor:Colors.main_white}}>
        <View>
        {_list_arr.map((item,key) => (
          <CommonItem key={key} content={item.content} isEnd={item.isEnd} clickFunc={item.clickFunc}
          hasLeftIcon={item.hasLeftIcon} leftIcon={item.leftIcon} rightIcon={item.rightIcon}/>
        ))}
        <View style={PaySettingStyles.creditcardView}><Text style={PaySettingStyles.creditcardText}>信用卡支付</Text></View>
        {creditCardInfo != null ? <CommonItem hasLeftIcon leftIcon={this._leftImage(LIST_IMAGE.CREDIT_CARD)} content={_creditCardNumber} rightIcon={this._checkedImage('credit_card')} clickFunc={() => this._checked('credit_card')}/> : null}
        <CommonItem content={creditCardInfo != null ? '管理您的信用卡' : '設定您的信用卡'} hasLeftIcon leftIcon={this._leftImage(LIST_IMAGE.CREDIT_CARD)}
        clickFunc={() => {
          if(creditCardInfo != null) {
            this.props.navigation.navigate('Manage_Card');
          }else {
            this.props.navigation.navigate("Credit");
          }
        }}/>
        </View>
      </Content>
      </Container>
    )
  }
}