import React, { PureComponent } from 'react';
import { View,Text,TouchableOpacity,TextInput,Keyboard,Platform } from 'react-native';
import { Container,Content } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import Picker from 'react-native-picker';
//components
import CommonHeader from '../components/CommonHeader';
//styles
import CommonStyles from '../styles/common.style';
import CreditCardStyles from '../styles/creditcard.style';
//utils
import ToastUtils from '../utils/ToastUtil';
//cache
import appStorage from '../cache/appStorage';
//api
import api from '../api/index';

export default class CreditCardView extends PureComponent {
  constructor(props) {
    super(props);
    let {creditCardInfo} = props.screenProps;
    console.log(props.screenProps);
    this.state = {
      name: creditCardInfo ? creditCardInfo.name : '',
      card: '',
      time: '',
      cvc: ''
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

  _getCVC(cvc) {
    this.setState({
      cvc
    })
  }

  _createDateData() {
    let month = []
    for(let i =1;i<13;i++) {
      let year = [];
      for(let j=2016;j<2050;j++){
        year.push(j+'年');
      }
      let _month = {};
      _month[i+'月'] = year;
      month.push(_month);
    }
    return month;
  }

  _showDatePicker() {
    let _today = new Date();
    let _selected_val = [`${_today.getMonth() +1}月`,_today.getFullYear()+'年'];

    Picker.init({
      pickerData: this._createDateData(),
      pickerFontColor: [255, 0 ,0, 1],
      pickerTitleText: '',
      pickerConfirmBtnText:'確定',
      pickerCancelBtnText: '取消',
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
        pickedValue[0] = pickedValue[0].substr(0,1);
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
    api.VaildCard(this.state.card,this.props.screenProps.sid).then(data => {
      // console.log(data);
      if (data.status === 200 && data.data.ro.ok) {
        if(data.data.data == 0) {
          ToastUtils.showWithMessage('卡號有誤');
        }else {
          for(let i in this.state) {
            if(this.state[i] == '') {
              switch(i){
                case "name": ToastUtils.showWithMessage(`姓名不能為空`);break;
                case "card": ToastUtils.showWithMessage(`卡號不能為空`);break;
                case "time": ToastUtils.showWithMessage(`有效期不能為空`);break;
                case "cvc": ToastUtils.showWithMessage(`CVC不能為空`);break;
              }
              return ;
            }
          }
          let _info = JSON.stringify(this.state);
          appStorage.setCreditCardInfo(_info);
          this.props.screenProps.setCreditCardInfo(JSON.parse(_info));
          ToastUtils.showWithMessage('綁定成功');
          this.props.navigation.goBack();
        }
      }else {
        ToastUtils.showWithMessage(data.data.ro.respMsg);
      }
    })
    .catch(err => {
      ToastUtils.showWithMessage('發生錯誤');
    })
  }

  _renderCommonInput(item,key) {
    if(item.label == '有效期') {
      return (
        <View style={Platform.OS == 'ios'?CreditCardStyles.CommonInputView:CreditCardStyles.CommonInputAndroidView} key={key}>
          <Text style={CreditCardStyles.InputTitle}>{item.label}</Text>
          <TouchableOpacity style={CreditCardStyles.SelectBtn} onPress={() => {Picker.show();Keyboard.dismiss()}}>
            <Text style={{color: '#333333',fontSize: 16}}>{this.state.time != '' ? this.state.time : '請選擇有效期'}</Text>
          </TouchableOpacity>
        </View>
      )
    }
    return (
      <View style={Platform.OS == 'ios'?CreditCardStyles.CommonInputView:CreditCardStyles.CommonInputAndroidView} key={key}>
        <Text style={CreditCardStyles.InputTitle}>{item.label}</Text>
        <TextInput style={Platform.OS=="android"?  CreditCardStyles.Input_Android:CreditCardStyles.Input} underlineColorAndroid="transparent" keyboardType={item.keyboard} placeholder={item.placeholder} maxLength={item.maxlength} onChangeText={item.changeTextFunc} defaultValue={this.state[item.name]}
        clearButtonMode="while-editing"
        placeholderTextColor="#333333"/>
      </View>
    )
  }

  render() {
    let _list_arr = [
      {name:'name',label: '姓名',placeholder: '請輸入(必填)',maxlength:20,keyboard:'default',changeTextFunc: (value) => this._getName(value)},
      {name:'card',label: '信用卡號',placeholder: '請輸入信用卡號',maxlength: 16,keyboard:'numeric',changeTextFunc: (value) => this._getCard(value)},
      {name:'time',label: '有效期',placeholder: '請輸入(必填)',maxlength: 4,keyboard:'numeric',changeTextFunc: (value) => this._getTime(value)},
      {name:'cvc',label: '3位數CVC',placeholder: '請輸入(必填)',maxlength: 3,keyboard:'numeric',changeTextFunc: (value) => this._getCVC(value)},
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
            <View style={CommonStyles.common_btn_container}>
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