import React, { PureComponent } from 'react';
import { View,Text,TouchableOpacity,TextInput } from 'react-native';
import { Container,Content,Input,Form,Item,Button } from 'native-base';
import Stripe from 'react-native-stripe-api';
import LinearGradient from 'react-native-linear-gradient';
//components
import CommonHeader from '../components/CommonHeader';
//styles
import CommonStyles from '../styles/common.style';
import CreditCardStyles from '../styles/creditcard.style';
//utils
import ToastUtils from '../utils/ToastUtil';
//cache
import appStorage from '../cache/appStorage';

const api_key = 'pk_live_4JIHSKBnUDiaFHy2poHeT2ks';
const client = new Stripe(api_key);

export default class CreditCardView extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      card: '',
      time: '',
      cvc: ''
    }
  }

  //logic
  _getName(name) {
    this.setState({
      name
    })
  }

  _getCard(card) {
    this.setState({
      card
    })
  }

  _getTime(time) {
    this.setState({
      time
    })
  }

  _getCVV(cvc) {
    this.setState({
      cvc
    })
  }

  _bindCard() {
    console.log(this.state);
    for(let i in this.state) {
      if(this.state[i] == '') {
        ToastUtils.showWithMessage(`${i}不能为空`);
        return ;
      }
    }
    let _info = JSON.stringify(this.state);
    appStorage.setCreditCardInfo(_info);
    this.props.screenProps.setCreditCardInfo(_info);

  }

  _renderCommonInput(item,key) {
    return (
      <View style={CreditCardStyles.CommonInputView} key={key}>
        <Text style={CreditCardStyles.InputTitle}>{item.label}</Text>
        <TextInput style={CreditCardStyles.Input} placeholder={item.placeholder} maxLength={item.maxlength} onChangeText={item.changeTextFunc} 
        clearButtonMode="while-editing"
        placeholderTextColor="#999999"/>
      </View>
    )
  }

  render() {
    let _list_arr = [
      {label: '姓名',placeholder: '請輸入(必填)',maxlength:4,changeTextFunc: (value) => this._getName(value)},
      {label: '信用卡號',placeholder: '請輸入信用卡號',maxlength: 16,changeTextFunc: (value) => this._getCard(value)},
      {label: '有效期',placeholder: '請輸入(必填)',maxlength: 4,changeTextFunc: (value) => this._getTime(value)},
      {label: '3位數CVV',placeholder: '請輸入(必填)',maxlength: 3,changeTextFunc: (value) => this._getCVV(value)},
    ];
    return (
      <Container>
        <CommonHeader title="綁定卡號" canBack {...this.props}/>
        <Content style={{backgroundColor: '#edebf4'}}>
            <View>
              {
                _list_arr.map((v,i) => this._renderCommonInput(v,i))
              }
            </View>
            <View style={CreditCardStyles.BtnView}>
              <TouchableOpacity onPress={() => this._bindCard()}>
                <LinearGradient colors={['#FF9F48','#FF4141']} start={{x:0.0, y:0.0}} end={{x:1.0,y: 0.0}} style={CommonStyles.btn}>
                  <Text style={{color:'#fff',fontSize:16}}>立即綁定</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
        </Content>
      </Container>
    )
  }

}