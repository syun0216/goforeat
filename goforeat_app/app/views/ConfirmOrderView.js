import React, { PureComponent } from "react";
import { View, Text, StyleSheet, TextInput,Platform,Alert,TouchableOpacity,Image } from "react-native";
import {
  Container,
  Content,
  Button,
  Footer,
  Separator,
  ListItem,
  Icon,
  Input
} from "native-base";
import PopupDialog, {
  SlideAnimation,
  DialogTitle
} from "react-native-popup-dialog";
import Stripe from 'react-native-stripe-api';
//components
import BottomOrderConfirm from '../components/BottomOrderConfirm';
import CommonHeader from "../components/CommonHeader";
import BlankPage from "../components/BlankPage";
import Loading from "../components/Loading";
import LoadingModal from "../components/LoadingModal";
import ErrorPage from "../components/ErrorPage";
//utils
import Colors from "../utils/Colors";
import GLOBAL_PARAMS from "../utils/global_params";
import ToastUtil from "../utils/ToastUtil";
//api
import api from "../api/index";
import Divider from "../components/Divider";
//styles
import ConfirmOrderStyles from '../styles/confirmorder.style';
import CommonStyles from '../styles/common.style';

const slideAnimation = new SlideAnimation({
  slideFrom: "bottom"
});

const PAY_TYPE = {
  cash: 1,
  apple_pay: 2,
  credit_card: 6
}

const api_key = 'pk_live_4JIHSKBnUDiaFHy2poHeT2ks';
const client = new Stripe(api_key);

export default class ConfirmOrderView extends PureComponent {
  _popupDialog = null;
  timer = null;
  state = {
    orderDetail: null,
    loading: true,
    loadingModal: false,
    isError: false,
    isExpired: false,
    isBottomShow: false,
    coupon: null,
    discountsPrice: 0,
    remark: ''
  };

  componentDidMount() {
    this.timer = setTimeout(() => {
      this._createOrder();
      clearTimeout(this.timer);
    },500);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  _createOrder = () => {
    let {foodId,placeId,amount} = this.props.navigation.state.params;
    api.createOrder(foodId,this.props.screenProps.sid,placeId,amount).then(
      data => {
        if (data.status === 200 && data.data.ro.ok) {
          this.setState({
            loading: false,
            orderDetail: data.data.data,
            isBottomShow: true
          });
        } else {
          if(data.data.ro.respCode == "10006" || data.data.ro.respCode == "10007") {
            this.props.screenProps.userLogout();
          }
          Alert.alert(null
            , data.data.ro.respMsg
            , [
                {text: '取消'},
                {text: '確定', onPress: () => this.props.navigation.goBack()}
            ]
          );
          // alert(data.data.ro.respMsg);
          this.setState({
            loading: false,
            isExpired: true,
            expiredMessage: data.data.ro.respMsg
          });
        }
      },
      () => {
        this.setState({loading: false,isError: true});
        ToastUtil.showWithMessage("獲取訂單信息失敗");
      }
    );
  };

  async _confirmOrder() {
    let {orderDetail:{totalMoney,orderId},discountsPrice,coupon,remark} = this.state;
    totalMoney = totalMoney - discountsPrice;
    let payment = PAY_TYPE[this.props.screenProps.paytype];
    let {creditCardInfo} = this.props.screenProps;
    let token = null;
    if (this.state.orderDetail === null) {
      ToastUtil.showWithMessage("確認訂單失敗");
      return;
    }
    if(payment != PAY_TYPE.apple_pay) {
      if(payment == PAY_TYPE.credit_card) {
        this.setState({
          loadingModal: true
        })
        token = await client.createToken({
          number: creditCardInfo.card ,
          exp_month: creditCardInfo.time.substr(0,2), 
          exp_year: creditCardInfo.time.substr(3,2), 
          cvc: creditCardInfo.cvc,
          // address_zip: '12345'
       });
      //  console.log(token)
      if(!token.hasOwnProperty('id')) {
        ToastUtil.showWithMessage('你的卡片暫未支持,請見諒')
        this.setState({
          loadingModal: false
        })
        return ;
      }
       token = token.id;
      }
      api.confirmOrder(orderId,this.props.screenProps.sid,coupon,totalMoney,payment,token,remark).then(
        data => {
          this.setState({
            loadingModal: false
          })
          if (data.status === 200 && data.data.ro.ok) {
            ToastUtil.showWithMessage("下單成功");
            this._popupDialog.dismiss();
            this.props.navigation.goBack();
          } else {
            let _message = payment == PAY_TYPE.credit_card ? ',請核對信用卡信息是否正確' : '';
            ToastUtil.showWithMessage(data.data.ro.respMsg+_message);
          }
        },
        () => {
          ToastUtil.showWithMessage("下單失敗");
          this.setState({
            loadingModal: false
          })
        }
      );
    }
    else {
      // let getToken = new Promise((resolve,reject) => {
      //   this._handleApplePay(resolve,reject)
      // })
      // getToken.then(data => console.log(data));
    }
  };

  _useCoupon = () => {
    if(this.state.coupon == null) {
      ToastUtil.showWithMessage("請輸入優惠碼");
      return ;
    }
    if(this.state.discountsPrice > 0) {
      ToastUtil.showWithMessage("您已經優惠過了");
      return;
    }
    api.useCoupon(this.state.coupon,this.props.screenProps.sid).then(data => {
      if(data.status === 200 && data.data.ro.ok) {
        ToastUtil.showWithMessage("優惠成功");
        this.setState({
          discountsPrice: data.data.data.money
        })
      } else {
        ToastUtil.showWithMessage(data.data.ro.respMsg);
      }
    }).catch(() => {
      () => {
        ToastUtil.showWithMessage("獲取優惠失敗");
      }
    })
  }

  _currentPayType = () => {
    switch(this.props.screenProps.paytype) {
      case 'cash': return '現金支付';
      case 'apple_pay': return 'Apple Pay';
      case 'credit_card': return '信用卡支付';
      case 'ali': return '支付寶支付';
      case 'wechat': return '微信支付';
      default: return '現金支付';
    }
  }

  //private function

  _handleApplePay(resolve,reject) {
    let supportedMethods = ''
    let {orderDetail:{takeAddressDetail,totalMoney,takeTime,takeDate,takeAddress,orderDetail},discountsPrice} = this.state;
    totalMoney = totalMoney - this.state.discountsPrice;
    if(Platform.OS == 'ios') {
      supportedMethods = [
        {
          supportedMethods: ['apple-pay'],
          data: {
            merchantIdentifier: 'merchant.com.syun.goforeat',
            supportedNetworks: ['visa', 'mastercard'],
            countryCode: 'HK',
            currencyCode: 'HKD',
            paymentMethodTokenizationParameters: {
              parameters: {
                gateway: 'stripe',
                'stripe:publishableKey': 'pk_live_4JIHSKBnUDiaFHy2poHeT2ks',
                'stripe:version': '13.0.3'
              }
            }
          }
        }
      ];
    }else {
      supportedMethods = [{
        supportedMethods: ['android-pay'],
        data: {
          supportedNetworks: ['visa', 'mastercard', 'amex'],
          currencyCode: 'USD',
          environment: 'TEST', // defaults to production
          paymentMethodTokenizationParameters: {
            tokenizationType: 'NETWORK_TOKEN',
            parameters: {
              publicKey: 'pk_live_4JIHSKBnUDiaFHy2poHeT2ks'
            }
          }
        }
      }];
    }

    const details = {
      id: 'basic-example',
      displayItems: [
        {
          label: orderDetail[0].foodName,
          amount: { currency: 'HKD', value: totalMoney }
        }
      ],
      total: {
        label: orderDetail[0].foodName,
        amount: { currency: 'HKD', value: totalMoney }
      }
    };

    const pr = new PaymentRequest(supportedMethods, details);

    pr
      .show()
      .then(paymentResponse => {
        resolve(paymentResponse.details.paymentToken);
      })
      .catch(e => {
        pr.abort();
        reject();
        ToastUtil.showWithMessage('取消了支付');
      });
  }

  _openDialog = () => {
    if(this.state.orderDetail === null) {
        ToastUtil.showWithMessage("下單失敗");
        return;
    }
    this._popupDialog.show(() => {
    });
  };

  _getCoupon = coupon => {
    this.setState({
      coupon
    })
  }

  _getRemark(val) {
    this.setState({
      remark: val
    })
  }

  _renderPopupDiaogView() {
      let {orderDetail:{takeAddressDetail,totalMoney,takeTime,takeDate,takeAddress,orderDetail},discountsPrice} = this.state;
      totalMoney = totalMoney - this.state.discountsPrice;
      return (<PopupDialog
      dialogTitle={<DialogTitle title="您的訂單" />}
      width={GLOBAL_PARAMS._winWidth * 0.9}
      height={GLOBAL_PARAMS._winHeight * 0.65*(667/ GLOBAL_PARAMS._winHeight)}
      ref={popupDialog => {
        this._popupDialog = popupDialog;
      }}
      dialogAnimation={slideAnimation}
      onDismissed={() => {
      }}
    >
      <Container>
        <Content>
          <ListItem last style={ConfirmOrderStyles.CommonListItem}>
            <Text style={CommonStyles.common_title_text}>下單電話:</Text>
            <Text style={CommonStyles.common_title_text}>{this.props.screenProps.user}</Text>
          </ListItem>
          <Separator bordered>
            <Text style={CommonStyles.common_title_text}>訂單詳情</Text>
          </Separator>
          <ListItem style={ConfirmOrderStyles.CommonListItem}>
            <Text style={CommonStyles.common_title_text}>菜品名稱</Text>
            <Text style={[CommonStyles.common_title_text,Platform.OS=='android'?{maxWidth:150}:null]}>{orderDetail[0].foodName}</Text>
          </ListItem>
          <ListItem style={ConfirmOrderStyles.CommonListItem}>
            <Text style={CommonStyles.common_title_text}>數量</Text>
            <Text style={CommonStyles.common_title_text}>{orderDetail[0].foodNum}</Text>
          </ListItem>
          <ListItem style={ConfirmOrderStyles.CommonListItem}>
            <Text style={CommonStyles.common_title_text}>取餐地點</Text>
            <Text tyle={CommonStyles.common_title_text}>{takeAddressDetail}</Text>
          </ListItem>
          <ListItem style={ConfirmOrderStyles.CommonListItem}>
            <Text style={CommonStyles.common_title_text}>取餐時間</Text>
            <Text style={[CommonStyles.common_title_text,{maxWidth: 200}]} numberOfLines={1}>{takeDate}{" "}{takeTime}</Text>
          </ListItem>
          <ListItem style={ConfirmOrderStyles.CommonListItem} last>
            <Text style={CommonStyles.common_title_text}>總計</Text>
            <Text style={[CommonStyles.common_title_text,{color:'#FF3348'}]}>HKD {totalMoney}</Text>
          </ListItem>          
        </Content>
        <Footer style={ConfirmOrderStyles.Footer}>
          <Button
            onPress={() => this._confirmOrder()}
            block
            style={ConfirmOrderStyles.ConfirmBtn}
          >
            <Text
              style={ConfirmOrderStyles.ConfirmBtnText}
            >
              確認訂單
            </Text>
          </Button>
        </Footer>
      </Container>
    </PopupDialog>
  )};

  _renderCouponBtnView() {
    return (
      <View style={[ConfirmOrderStyles.NewsInner,styles.commonMarginBottom]}>
        <Input 
          style={ConfirmOrderStyles.CouponInput}
          placeholderTextColor="#999999"
          placeholder='優惠碼'
          multiline={false}
          autoFocus={false}
          returnKeyType="done"
          onChangeText={coupon => this._getCoupon(coupon)}
        />
        <TouchableOpacity onPress={this._useCoupon} style={ConfirmOrderStyles.CouponBtn}>
          <Text style={ConfirmOrderStyles.CouponText}>使用</Text>
        </TouchableOpacity>
      </View>
    )
  }

  _renderNewOrderView() {
    let {orderDetail:{totalMoney,orderDetail},discountsPrice} = this.state;
    totalMoney = totalMoney - discountsPrice;
    return (
      <View style={styles.commonNewContainer}>
        <View style={[ConfirmOrderStyles.NewsInner,styles.commonMarginTop]}>
        <Text allowFontScaling={false} style={ConfirmOrderStyles.FoodName} numberOfLines={1}>{orderDetail[0].foodName}</Text>
        <Text allowFontScaling={false} style={ConfirmOrderStyles.MoneyUnit} numberOfLines={1}>HKD {orderDetail[0].foodMoney.toFixed(2)}</Text>
        </View>
        <View style={[ConfirmOrderStyles.CountView,styles.commonMarginBottom]}>
          <Text allowFontScaling={false} style={ConfirmOrderStyles.CountText}>數量:</Text>
          <Text allowFontScaling={false} style={ConfirmOrderStyles.FoodNum}>{orderDetail[0].foodNum}</Text>
        </View>
        <Divider bgColor="#EBEBEB" height={1}/>
        {
          discountsPrice>0? <View style={[ConfirmOrderStyles.NewsInner,styles.commonMarginTop]}>
          <Text allowFontScaling={false} style={ConfirmOrderStyles.TotalText}>優惠金額</Text>
          <View style={ConfirmOrderStyles.NewsInner}>
            <Text allowFontScaling={false} style={ConfirmOrderStyles.CouponUnit}>- HKD</Text>
            <Text allowFontScaling={false} style={ConfirmOrderStyles.CouponMoney} numberOfLines={1}>{discountsPrice.toFixed(2)}</Text>
          </View>
        </View> : null
        }
        <View style={[ConfirmOrderStyles.NewsInner,styles.commonMarginTop,styles.commonMarginBottom]}>
          <Text allowFontScaling={false} style={ConfirmOrderStyles.TotalText}>總金額</Text>
          <View style={ConfirmOrderStyles.NewsInner}>
            <Text allowFontScaling={false} style={ConfirmOrderStyles.MoneyUnit}>HKD</Text>
            <Text allowFontScaling={false} style={ConfirmOrderStyles.TotalMoney} numberOfLines={1}>{totalMoney.toFixed(2)}</Text>
          </View>
        </View>
        {this._renderCouponBtnView()}
      </View>
    )
  }

  _renderNewDetailsView() {
    let {orderDetail:{takeAddressDetail,totalMoney,takeTime,takeDate,takeAddress,orderDetail}} = this.state;
    let _details_arr = [
      {title:'取餐日期',content: takeDate,hasPreIcon: false,fontColor:'#ff3448',canOpen: false,clickFunc:()=>{}},
      {title:'取餐地點',content: takeAddress,hasPreIcon:true,fontColor:'#333333',canOpen:false,clickFunc:()=>{}},
      {title:'預計取餐時間',content: takeTime,hasPreIcon:false,fontColor:'#333333',canOpen:false,clickFunc:()=> {}},
      {title:'支付方式',content:this._currentPayType(),hasPreIcon:false,fontColor:'#333333',canOpen:false,clickFunc:()=> {
        ToastUtil.showWithMessage('請到我的支付方式修改哦！')
      }}
    ];
    return (
      <View style={styles.commonNewContainer}>
        <Text allowFontScaling={false} style={[ConfirmOrderStyles.Title,styles.commonMarginBottom,styles.commonMarginTop]}>取餐資料</Text>
        {_details_arr.map((item,idx) => this._renderCommonDetailView(item,idx))}
        <View style={[styles.commonDetailsContainer,styles.commonMarginBottom]}>
          <Text allowFontScaling={false} style={{color:'#999999',marginBottom: 10}}>送餐備註</Text>
          <Input style={ConfirmOrderStyles.Input} placeholderTextColor="#999" 
          placeholder="例如:加飯、少辣" clearButtonMode="while-editing" onChangeText={(val) => this._getRemark(val)}/>
        </View>
      </View>
    )
  }

  _renderCommonDetailView(item,idx) {
    return (
      <View key={idx} style={[styles.commonDetailsContainer,styles.commonMarginBottom]}>
        <Text allowFontScaling={false} style={{color:'#999999',marginBottom: 10}}>{item.title}</Text>
        <TouchableOpacity onPress={item.clickFunc} style={ConfirmOrderStyles.DetailText}>
          <View style={ConfirmOrderStyles.DetailInner}>
            {item.hasPreIcon ?<Image source={require('../asset/location.png')} style={{width: 18,height: 17,marginRight: 5}} resizeMode="contain"/> :null}
            <Text allowFontScaling={false} style={{fontSize: 18,color: item.fontColor,marginRight: item.hasPreIcon?20:0,}} numberOfLines={1}>{item.content}</Text>
          </View>
          {item.canOpen?<Icon name="ios-arrow-down-outline" style={ConfirmOrderStyles.ArrowDown}/>:null}
        </TouchableOpacity>
      </View>
    )
  }

  _renderBottomConfirmView() {
    return (
      <BottomOrderConfirm isShow={this.state.isBottomShow} total={this.props.navigation.state.params.total-this.state.discountsPrice}  btnMessage="立即下單" btnClick={this._openDialog} canClose={false}/>
    )
  }

  render() {
    return (
      <Container>
        {this.state.orderDetail !== null ? this._renderPopupDiaogView() : null}
        <CommonHeader
          canBack
          title="訂單確認頁"
          titleStyle={{ fontSize: 18, fontWeight: "bold" }}
          {...this["props"]}
        />
        {this.state.loading ? <Loading/> : null}
        {this.state.loadingModal ? <LoadingModal message="支付中..."/> : null}
        {this.state.isError ? (
          <ErrorPage errorToDo={this._createOrder} errorTips="加載失敗,請點擊重試"/>
        ) : null}
        <Content style={{ backgroundColor: '#edebf4' }} padder>
          {this.state.isExpired ? (
            <BlankPage message={this.state.expiredMessage} style={{marginLeft: -10}}/>
          ) : null}
          {this.state.orderDetail != null ? this._renderNewOrderView() : null}
          {this.state.orderDetail !== null ? this._renderNewDetailsView() : null}
          <View style={{height: 65}}/>
          </Content>
          {this._renderBottomConfirmView()}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  commonTitleText: {
    fontSize: 16,
    color: "#111111",
    fontWeight: "bold",
    fontFamily: "AvenirNext-UltraLightItalic"
  },
  commonDecText: {
    // fontFamily: 'AvenirNext-UltraLightItalic',
    color: Colors.fontBlack,
    fontWeight: "normal",
    fontSize: 16,
    // marginTop: 5,
    flex: 1
  },
  commonPriceText: {
    color: "#3B254B",
    fontWeight: "bold",
    fontSize: 16
    // marginTop: 5,
  },
  commonDetailText: {
    fontWeight: "700",
    color: Colors.fontBlack,
    fontSize: 20
    // fontFamily:'AvenirNext-Regular',
    // textShadowColor:'#C0C0C0',
    // textShadowRadius:2,
    // textShadowOffset:{width:2,height:2},
  },
  commonLabel: {
    letterSpacing: 2,
    fontWeight: "200",
    color: Colors.fontBlack
  },
  commonText: {
    fontSize: 18
  },
  commonNewContainer: {
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 5,
    shadowColor: '#E8E2F2',
    shadowOpacity: 0.8,
    shadowOffset: {width: 0,height: 8},
    elevation: 3,
    marginBottom: 10,
    backgroundColor: Colors.main_white
  },
  commonDetailsContainer: {
    justifyContent:'space-around',
    alignItems:'flex-start',
  },
  commonMarginTop: {
    marginTop: 15
  },
  commonMarginBottom: {
    marginBottom: 15
  }
});
