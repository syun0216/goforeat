import React, { PureComponent } from 'react';
import {View,Image,Platform} from 'react-native';
import {Container,Content} from 'native-base';
//components
import CommonItem from '../components/CommonItem';
import CommonHeader from '../components/CommonHeader';
import Text from '../components/UnScalingText';
import CommonBottomBtn from '../components/CommonBottomBtn';
import Loading from '../components/Loading';
import ErrorPage from '../components/ErrorPage';
//utils
import {formatCard} from '../utils/FormatCardInfo';
import {PAY_TYPE, EXPLAIN_PAY_TYPE, em} from '../utils/global_params';
import ToastUtil from '../utils/ToastUtil';
import Colors from '../utils/Colors';
//styles
import PaySettingStyles from '../styles/paysetting.style';
//cache
import { payTypeStorage } from '../cache/appStorage';
//language
import I18n from '../language/i18n';
//api
import {getPaySetting,setPayment,getMonthTicket} from '../api/request';

const _checked = '../asset/checked.png';
const _unchecked = '../asset/unchecked.png';
const LIST_IMAGE = {
  1: require('../asset/cash.png'),
  2: require('../asset/apple_pay.png'),
  3: require('../asset/android_pay.png'),
  4: require('../asset/wechat_pay.png'),
  5: require('../asset/ali_pay.png'),
  6: require('../asset/creditcard.png'),
  7: require('../asset/ticket.png')
};

export default class PaySettingView extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      checkedName: props.screenProps.paytype,
      creditCardInfo: props.screenProps.creditCardInfo,
      i18n: I18n[props.screenProps.language],
      loading: true,
      isError: false,
      payTypeList: [],
      hasCreditCardPay: false,
      monthTicketQuantity: 0,
      monthTicketEndTime: ''
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      creditCardInfo: nextProps.screenProps.creditCardInfo,
      i18n: I18n[nextProps.screenProps.language]
    })
  }

  componentDidMount() {
    let _timer = setTimeout(() => {
      this._getPaySetting();
      clearTimeout(_timer);
    },300)
  }

  //api
  _getPaySetting() {
    let {creditCardInfo} = this.state;
    getPaySetting().then(data => {
      if(data.ro.ok) {
        let _arr = [];
        data.data.payments.forEach((v,i) => {
          if(v.code == PAY_TYPE.credit_card) {
            this.setState({
              hasCreditCardPay: true
            });
          }else {
            _arr.push({
              content: EXPLAIN_PAY_TYPE[v.code][this.props.screenProps.language],hasLeftIcon: true,leftIcon:this._leftImage(LIST_IMAGE[v.code]),code: v.code
            });
            if(v.code == PAY_TYPE.month_ticket) {
              _arr.push({
                content: this.state.monthTicketQuantity,hasLeftIcon: true, leftIcon:(<Text style={{marginRight: 5,color: Colors.main_orange,fontSize: em(16)}}>月票數量</Text>), code: null
              })
            }
          }
        });
        this.setState({
          loading: false,
          payTypeList: _arr,
          checkedName: data.data.defaultPayment
        });
        this._getMonthTicket();
      } else {
        ToastUtil.showWithMessage(data.ro.respMsg)
        if(data.ro.respCode == "10006" || data.ro.respCode == "10007") {
          this.props.screenProps.userLogout();
          this.props.navigation.goBack();
        }
      }
      // console.log(data);
    }).catch(err => {
      this.setState({
        loading: false,
        isError: true
      })
    })
  }

  _setPayType(payment) {
    let _from_confirm_order = typeof this.props.navigation.state.params != 'undefined';
    setPayment(payment).then(data => {
      if(data.ro.ok) {
        !_from_confirm_order && ToastUtil.showWithMessage('修改支付方式成功'); 
      }
    })
  }

  _getMonthTicket() {
    getMonthTicket().then(data => {
      if(typeof data['data'] == "undefined") {
        return;
      }
      if(data.ro.ok) {
        let _date = new Date(data.data.endTime);
        this.setState({
          monthTicketQuantity: data.data.amount,
          monthTicketEndTime: [_date.getFullYear(),_date.getMonth()+1,_date.getDate()].join('-')
        });
      } 
    }).catch(err => {
      this.setState({
        loading: false,
        isError: false
      })
    })
  }


  _checked(name) { 
    // console.log(name)
    let _from_confirm_order = typeof this.props.navigation.state.params != 'undefined';
    if(this.state.checkedName == name) {
      return;
    }
    this.setState(
      {checkedName: name}
    );  
    this._setPayType(name);
    this.props.screenProps.setPayType(name);
    _from_confirm_order && this.props.navigation.goBack();
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

  _renderManageCreditCard() {
    let { creditCardInfo,i18n } = this.state;
    let _creditCardNumber = '';
    if(creditCardInfo != null) {
      _creditCardNumber = formatCard(creditCardInfo.card);
    }
    return (
      <View style={{marginTop: em(10)}}>
        <View style={PaySettingStyles.creditcardView}><Text style={PaySettingStyles.creditcardText}>{i18n.credit}</Text></View>
        {creditCardInfo != null ? <CommonItem hasLeftIcon leftIcon={this._leftImage(LIST_IMAGE[PAY_TYPE.credit_card])} content={_creditCardNumber} rightIcon={this._checkedImage(PAY_TYPE.credit_card)} clickFunc={() => this._checked(PAY_TYPE.credit_card)}/> : null}
        <CommonItem content={creditCardInfo != null ? i18n.manageCard : i18n.setCard} hasLeftIcon leftIcon={this._leftImage(LIST_IMAGE[PAY_TYPE.credit_card])}
        clickFunc={() => {
          if(creditCardInfo != null) {
            this.props.navigation.navigate('Manage_Card');
          }else {
            this.props.navigation.navigate("Credit");
          }
        }}/>
      </View>
    )
  }

  _renderBottomConfirm() {
    return(
      <CommonBottomBtn clickFunc={() => this.props.navigation.goBack()}>{this.state.i18n.confirm}</CommonBottomBtn>
    )
  }
   
  render() {
    let {i18n, payTypeList,monthTicketQuantity} = this.state;
    let _from_confirm_order = typeof this.props.navigation.state.params != 'undefined';
    return (
      <Container>
      <CommonHeader title={i18n.payment} hasMenu={!_from_confirm_order} canBack={_from_confirm_order} {...this.props}/>
        <Content style={{backgroundColor:'#efefef'}}>
          {this.state.loading ? <Loading /> : (
            <View>
              {payTypeList.map((item,key) => (
                <CommonItem key={key} content={item.code == null && monthTicketQuantity != 0 ? monthTicketQuantity : item.content} isEnd={item.isEnd} clickFunc={() =>{
                  item.code != null && this._checked(item.code);
                }}
                hasLeftIcon={item.hasLeftIcon} leftIcon={item.leftIcon} rightIcon={item.code != null ?this._checkedImage(item.code) : (<Text>{this.state.monthTicketEndTime}  到期</Text>)}
                style={item.code != null ? item.code != PAY_TYPE.month_ticket ? {} : {borderBottomWidth: 0,} : {height: em(44),}} disabled={item.code == null}/>
              ))}
              { this.state.hasCreditCardPay ? this._renderManageCreditCard() : null}
            </View>
          )}
          { this.state.isError ? <ErrorPage errorTips={i18n.common_tips.reload} errorToDo={() => this._getPaySetting()} {...this.props}/> : null}
        </Content>
      </Container>
    )
  }
}