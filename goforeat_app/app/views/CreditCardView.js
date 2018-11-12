import React, { PureComponent } from 'react';
import { View,TouchableOpacity,TextInput,Keyboard,Platform } from 'react-native';
import { Container, Content, Icon } from 'native-base';
import Picker from 'react-native-picker';
import Modal from 'react-native-modal';
//components
import CommonHeader from '../components/CommonHeader';
import CommonBottomBtn from '../components/CommonBottomBtn';
import Text from '../components/UnScalingText';
//styles
import CreditCardStyles from '../styles/creditcard.style';
//utils
import ToastUtils from '../utils/ToastUtil';
import {em, client, setPayType} from '../utils/global_params';
//cache
import {creditCardStorage,payTypeStorage} from '../cache/appStorage';
//api
import {vaildCard, setCreditCard} from '../api/request';
//language
import I18n from '../language/i18n';

export default class CreditCardView extends PureComponent {
  constructor(props) {
    super(props);
    let {creditCardInfo} = props.screenProps;
    this._raw_card = '';
    this.state = {
      name: creditCardInfo ? creditCardInfo.name : '',
      card: '',
      time: '',
      cvc: '',
      i18n: I18n[props.screenProps.language],
      isModalVisible: false
    }
  }

  componentWillMount () {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => this._keyboardDidShow(e));
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
  }

  componentDidMount() {
    this._showDatePicker();
  }  

  componentWillUnmount() {
    Picker.hide();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      i18n: I18n[nextProps.screenProps.language]
    })
  }

  //logic
  _getName(name) {
    this.setState({
      name
    })
  }

  _getCard(card) {
    this._raw_card = card.split(' ').join('');
    if(this._raw_card.length % 4 == 0 && this._raw_card.length < 16) {
      card = card + ' ';
    }
    this.setState({
      card
    })
  }

  _getTime(time) {
    this.setState({
      time
    })
  }

  _getCVC(cvc) {
    this.setState({
      cvc
    })
  }

  _createDateData() {
    let _date = new Date();
    let month = []
    for(let i =1;i<13;i++) {
      let year = [];
      for(let j=_date.getFullYear();j<2050;j++){
        year.push(j+'年');
      }
      let _month = {};
      _month[i+'月'] = year;
      month.push(_month);
    }
    return month;
  }

  _showDatePicker() {
    let {i18n} = this.state;
    let _today = new Date();
    let _selected_val = [`${_today.getMonth() +1}月`,_today.getFullYear()+'年'];

    Picker.init({
      pickerData: this._createDateData(),
      pickerFontColor: [255, 0 ,0, 1],
      pickerTitleText: '',
      pickerConfirmBtnText:i18n.confirm,
      pickerCancelBtnText: i18n.cancel,
      pickerConfirmBtnColor: [255,76,20,1],
      pickerCancelBtnColor:[102,102,102,1],
      pickerToolBarBg: [255,255,255,1],
      pickerBg: [255,255,255,1],
      wheelFlex:[1,1],
      pickerFontSize: 16,
      pickerFontColor: [51,51,51,1],
      pickerRowHeight: 45,
      selectedValue: _selected_val,
      onPickerConfirm: (pickedValue, pickedIndex) => {
        if(pickedValue[0].length < 3) {
          pickedValue[0] = pickedValue[0].substr(0,1);
        }else {
          pickedValue[0] = pickedValue[0].substr(0,2);
        }
        pickedValue[1] = pickedValue[1].substr(2,2);
        if(pickedValue[0] < 10) {pickedValue[0] = `0${pickedValue[0]}`}
        this.setState({
          time: pickedValue.join('/')
        })
      },
      })
  }

  _keyboardDidShow (e) {
    Picker.hide();
  }

  _bindCard() {
    const {i18n, cvc, time} = this.state;
    const {showLoading, hideLoading} = this.props; 
    const {callback} = this.props.navigation.state.params;
    for(let i in this.state) {
      if(this.state[i] == '') {
        switch(i){
          case "card": ToastUtils.showWithMessage(i18n.credit_card_tips.card_not_null);return;
          case "time": ToastUtils.showWithMessage(i18n.credit_card_tips.time_not_null);return;
          case "cvc": ToastUtils.showWithMessage(i18n.credit_card_tips.cvc_not_null);return;
        }
      }
    }
    showLoading();
    client.createToken({
      number: this._raw_card ,
      exp_month: time.substr(0,2), 
      exp_year: time.substr(3,2), 
      cvc: cvc,
   }).then(token => {
     console.log(token);
     if(token&&token.hasOwnProperty('id')) {
        return setCreditCard(token.id, time, this._raw_card.substr(-4));
     } else {
       throw token.error;
     }
   }).then(data => {
     hideLoading();
     if(data && data.ro.ok) {
        callback&&callback();
        ToastUtils.showWithMessage(i18n.credit_card_tips.bind_success);
        this.props.navigation.goBack();
     } else {
        ToastUtils.showWithMessage(i18n.credit_card_tips.bind_fail);
     }
     console.log({data})
   })
   .catch(err => {
      console.log({err});
      hideLoading();
      if(err.hasOwnProperty('type')) {
        ToastUtils.showWithMessage(i18n.credit_card_tips.card_number_error)
      } else {
        ToastUtils.showWithMessage(i18n.credit_card_tips.bind_fail);
      }
    });
  }

  _renderCommonInput(item,key) {
    if(item.label == this.state.i18n.date) {
      return (
        <View style={Platform.OS == 'ios'?CreditCardStyles.CommonInputView:CreditCardStyles.CommonInputAndroidView} key={key}>
          <Text style={CreditCardStyles.InputTitle}>{item.label}</Text>
          <TouchableOpacity style={CreditCardStyles.SelectBtn} onPress={() => {Picker.show();Keyboard.dismiss()}}>
            <Text style={{color: '#333333',fontSize: em(16)}}>{this.state.time != ''  ? this.state.time : this.state.i18n.timeRequire}</Text>
          </TouchableOpacity>
        </View>
      )
    }
    return (
      <View style={Platform.OS == 'ios'?CreditCardStyles.CommonInputView:CreditCardStyles.CommonInputAndroidView} key={key}>
        <Text style={CreditCardStyles.InputTitle}>{item.label}</Text>
        <TextInput allowFontScaling={false} style={Platform.OS=="android"?  CreditCardStyles.Input_Android:CreditCardStyles.Input} clearButtonMode="while-editing" underlineColorAndroid="transparent" keyboardType={item.keyboard} placeholder={item.placeholder} maxLength={item.maxlength} onChangeText={item.changeTextFunc} defaultValue={this.state[item.name]}
        clearButtonMode="never"
        placeholderTextColor="#333333"/>
      </View>
    )
  }

  render() {
    let {i18n} = this.state;
    let _list_arr = [
      // {name:'name',label: i18n.cardUser,placeholder: i18n.nameRequire,maxlength:20,keyboard:'default',changeTextFunc: (value) => this._getName(value)},
      {name:'card',label: i18n.card,placeholder: i18n.cardRequire,maxlength: 19,keyboard:'numeric',changeTextFunc: (value) => this._getCard(value)},
      {name:'time',label: i18n.date,placeholder: i18n.timeRequire,maxlength: 4,keyboard:'numeric',changeTextFunc: (value) => this._getTime(value)},
      {name:'cvc',label: 'CVC',placeholder: i18n.cvcRequire,maxlength: 3,keyboard:'numeric',changeTextFunc: (value) => this._getCVC(value)},
    ];
    return (
      <Container>
        <CommonHeader title={this.state.i18n.addCard} canBack/>
        <View style={{backgroundColor: '#efefef', flex: 1}}>
            <View>
              {
                _list_arr.map((v,i) => this._renderCommonInput(v,i))
              }
            </View>
            <CommonBottomBtn clickFunc={() => this._bindCard()}>{i18n.addCardNow}</CommonBottomBtn>
            <TouchableOpacity style={CreditCardStyles.BottomInfoBtn} onPress={() => {
              this.setState({
                isModalVisible: !this.state.isModalVisible
              },() => {
                console.log(this.state.isModalVisible);
              });

            }}>
              <Icon style={CreditCardStyles.BottomInfoIcon} name="md-alert"/>
              <Text style={CreditCardStyles.BottomInfoText}>支付安全需知</Text>
            </TouchableOpacity>  
            <Modal style={CreditCardStyles.modalContainer} isVisible={this.state.isModalVisible}>
              <View style={{ flex: 1 }}>
                <Text>Hello!</Text>
              </View>
            </Modal>
        </View>
      </Container>
    )
  }
}