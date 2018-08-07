import React, { PureComponent } from 'react';
import {View,Image,Platform} from 'react-native';
import {Container,Content} from 'native-base';
//components
import CommonItem from '../components/CommonItem';
import CommonHeader from '../components/CommonHeader';
import Text from '../components/UnScalingText';
import CommonBottomBtn from '../components/CommonBottomBtn';
//utils
import Colors from '../utils/Colors';
import {formatCard} from '../utils/FormatCardInfo';
//styles
import PaySettingStyles from '../styles/paysetting.style';
import CommonStyles from '../styles/common.style';
//cache
import AppStorage from '../cache/appStorage';
//language
import I18n from '../language/i18n';

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
      creditCardInfo: props.screenProps.creditCardInfo,
      i18n: I18n[props.screenProps.language]
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      checkedName: nextProps.screenProps.paytype,
      creditCardInfo: nextProps.screenProps.creditCardInfo,
      i18n: I18n[nextProps.screenProps.language]
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

  _renderBottomConfirm() {
    return(
      <CommonBottomBtn clickFunc={() => this.props.navigation.goBack()}>{this.state.i18n.confirm}</CommonBottomBtn>
    )
  }
   
  render() {
    let {i18n} = this.state;
    const _list_arr = [
      {
        content: i18n.cash,hasLeftIcon: true,leftIcon:this._leftImage(LIST_IMAGE.CASH),rightIcon:this._checkedImage('cash'),clickFunc: () => this._checked('cash')
      },
      // {
      //   content: 'WeChat Pay',hasLeftIcon: true,leftIcon:this._leftImage(LIST_IMAGE.WECHAT),rightIcon:this._checkedImage('wechat'),clickFunc: () => this._checked('wechat')
      // },
      // {
      //   content: 'Ali Pay',hasLeftIcon: true,isEnd: true,leftIcon:this._leftImage(LIST_IMAGE.ALI),rightIcon:this._checkedImage('ali'),clickFunc: () => this._checked('ali')
      // }
    ];
    let _verify_platform_pay = null;
    // if(Platform.OS == 'android') {
    //   _verify_platform_pay = {
    //     content: 'Android Pay',hasLeftIcon: true,leftIcon:this._leftImage(LIST_IMAGE.ANDROID_PAY),rightIcon:this._checkedImage('android_pay'),clickFunc: () => {this._checked('android_pay');}
    //   }
    // }
    if(Platform.OS == 'ios') {
      _verify_platform_pay = {
        content: 'Apple Pay',hasLeftIcon: true,leftIcon:this._leftImage(LIST_IMAGE.APPLE_PAY),rightIcon:this._checkedImage('apple_pay'),isEnd: true,clickFunc: () => {this._checked('apple_pay');}
      };
      _list_arr.push(_verify_platform_pay);  //暫時屏蔽apple_pay和android_pay
    }

    let {creditCardInfo} = this.state;
    let _from_confirm_order = this.props.navigation.state.params['from'] == 'confirm_order';
    let _creditCardNumber = '';
    if(creditCardInfo != null) {
      _creditCardNumber = formatCard(creditCardInfo.card);
    }
    return (
      <Container>
      <CommonHeader title={i18n.payment} canBack {...this.props}/>
        <Content style={{backgroundColor:'#efefef'}}>
        <View>
        {_list_arr.map((item,key) => (
          <CommonItem key={key} content={item.content} isEnd={item.isEnd} clickFunc={item.clickFunc}
          hasLeftIcon={item.hasLeftIcon} leftIcon={item.leftIcon} rightIcon={item.rightIcon}/>
        ))}
        <View style={PaySettingStyles.creditcardView}><Text style={PaySettingStyles.creditcardText}>{i18n.credit}</Text></View>
        {creditCardInfo != null ? <CommonItem hasLeftIcon leftIcon={this._leftImage(LIST_IMAGE.CREDIT_CARD)} content={_creditCardNumber} rightIcon={this._checkedImage('credit_card')} clickFunc={() => this._checked('credit_card')}/> : null}
        <CommonItem content={creditCardInfo != null ? i18n.manageCard : i18n.setCard} hasLeftIcon leftIcon={this._leftImage(LIST_IMAGE.CREDIT_CARD)}
        clickFunc={() => {
          if(creditCardInfo != null) {
            this.props.navigation.navigate('Manage_Card');
          }else {
            this.props.navigation.navigate("Credit");
          }
        }}/>
        </View>
        {_from_confirm_order?this._renderBottomConfirm():null}
      </Content>
      </Container>
    )
  }
}