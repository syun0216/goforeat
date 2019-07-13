import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Image
} from "react-native";
import { Content, Icon, Input, Toast, Footer } from "native-base";
import {connect} from 'react-redux';
//components
import CommonBottomBtn from "../components/CommonBottomBtn";
import CommonHeader from "../components/CommonHeader";
import BlankPage from "../components/BlankPage";
import ErrorPage from "../components/ErrorPage";
import Text from "../components/UnScalingText";
import CommonItem from "../components/CommonItem";
import CustomizeContainer from "../components/CustomizeContainer";
//utils
import Colors from "../utils/Colors";
import GLOBAL_PARAMS, {
  em,
  EXPLAIN_PAY_TYPE,
  isEmpty,
  stripe_api_key,
  merchant_id
} from "../utils/global_params";
import ToastUtil from "../utils/ToastUtil";
import { getDeviceId } from "../utils/DeviceInfo";
//api
import { createNewOrder, useCoupon, confirmOrderV1 } from "../api/request";
import {abortRequestInPatchWhenRouteChange} from '../api/CancelToken';
//component
import Divider from "../components/Divider";
//styles
import ConfirmOrderStyles from "../styles/confirmorder.style";
//language
import I18n from "../language/i18n";
import ShimmerPlaceHolder from "../components/ShimmerPlaceholder";

const PAY_TYPE = {
  cash: 1,
  apple_pay: 2,
  android_pay: 3,
  credit_card: 6,
  month_ticket: 7,
  wechat_pay: 4,
  ali_pay: 5
};

// global.PaymentRequest = require('react-native-payments').PaymentRequest;

class ConfirmOrderView extends Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    const { params } = navigation.state;
    return {
      headerTintColor: "#fff",
      headerTitle: (
        <CommonHeader
          title={params.i18n && params.i18n.detailPage}
          {...navigation}
        />
      )
    };
  };

  constructor(props) {
    super(props);
    this.props.navigation.setParams({ i18n: this.props.i18n });
    this.dateFoodId = this.props.navigation.state.params.dateFoodId; // 菜品和地区关联id
    this.amount = this.props.navigation.state.params.amount; // 菜品数量
    this.addStatus = this.props.navigation.state.params.addStatus; //是否添加水果
    this._popupDialog = null;
    this._input = null;
    this.timer = null;
    this.picker = null;
    this.state = {
      orderDetail: null,
      loading: true,
      loadingModal: false,
      isError: false,
      isExpired: false,
      isBottomShow: false,
      coupon: null,
      discountsPrice: 0,
      remark: "",
      couponDetail: null,
      isMonthTicketUsed: false, //是否使用月票
      i18n: I18n[props.language],
    };
  }

  componentDidMount() {
    this.timer = setTimeout(() => {
      this._createOrder();
      clearTimeout(this.timer);
    }, 500);
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    return JSON.stringify(nextState) != JSON.stringify(this.state);
  };

  componentWillUnmount() {
    clearTimeout(this.timer);
    abortRequestInPatchWhenRouteChange();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.paytype == PAY_TYPE.month_ticket) {
      this.setState({
        discountsPrice: 0,
        coupon: null
      });
      this._input != null && this._input._root.clear();
      Toast.show({
        text: "*月票不能和優惠券一齊使用",
        duration: 3000,
        type: "warning",
        position: "bottom"
      });
    }
  }

  _createOrder() {
    // console.log("addStatus", this.addStatus);
    createNewOrder(this.dateFoodId, this.amount, this.props.currentPlace.id, this.addStatus).then(
      data => {
        if (data) {
          this.setState({
            loading: false,
            orderDetail: data,
            discountsPrice: data.deduction && data.deduction.discount || 0,
            couponDetail: data.deduction || null,
            isBottomShow: true,
            isError: false
          });
          if(data.monthTicketAmount > 0) {
            this.setState({
              isMonthTicketUsed: true
            })
            ToastUtil.showWithMessage("已為您抵購一張月票!");
          }
        } 
      },
      (err) => {
        if(err.errCode === "10006" || err.errCode == "10007") {
          this.setState({
            loading: false,
            isExpired: true,
            expiredMessage: data.ro.respMsg
          });
        }else if(err.errCode === 50000) {
          this.setState({ loading: false, isError: true });
        }
      }
    );
  }

  _countTotal() { // 计算最后总价
    let _total = 0;
    let {
      orderDetail: { totalMoney, foodMoney, foodNum, addPrice, monthTicketAmount, foodUnitPrice },
      isMonthTicketUsed,
      discountsPrice
    } = this.state;
    if(monthTicketAmount > 0 && isMonthTicketUsed) { // 证明有月票进行抵购或者月票是否可用
      _total = foodUnitPrice * (foodNum - 1) + (typeof addPrice != "undefined" && addPrice ? addPrice : 0); // 月票抵购一份饭
    }else { //如果没有月票 就进行优惠券抵购
      _total = totalMoney - discountsPrice > 0 ? totalMoney - discountsPrice : 0;
    }
    return _total;
  }

  async _confirmOrder() {
    let {
      i18n,
      orderDetail: { defaultPayment }
    } = this.state;
    let token = null;
    if (this.state.orderDetail === null) {
      ToastUtil.showWithMessage(i18n.confirmorder_tips.fail.confirm_order);
      return;
    }
    switch (defaultPayment) {
      case PAY_TYPE.apple_pay:
      case PAY_TYPE.android_pay:
        {
          let _device = getDeviceId().split(",")[0];
          if (_device == "iPhone6") {
            ToastUtil.showWithMessage(i18n.notSupport);
            return;
          }
          let _pay_res = new Promise((resolve, reject) => {
            this.handlePayWithAppleOrAndroid(resolve, reject, defaultPayment);
          });
          _pay_res
            .then(data => {
              this._confirmOrderWithToken(data);
            })
            .catch(err => {
              console.log({ err });
              ToastUtil.showWithMessage("取消了支付");
            });
        }
        break;
      case PAY_TYPE.credit_card:
        {
          this._confirmOrderWithToken(token);
        }
        break;
      case PAY_TYPE.cash:
      case PAY_TYPE.month_ticket:
        {
          this._confirmOrderWithToken(token);
        }
        break;
      default:
        {
          ToastUtil.showWithMessage("暫未支持該支付方式");
        }
        break;
    }
  }

  _confirmOrderWithToken(token) {
    let {
      couponDetail,
      orderDetail: { totalMoney, orderId, defaultPayment },
      isMonthTicketUsed,
      coupon,
      remark
    } = this.state;
    totalMoney = this._countTotal();
    let { i18n } = this.state;
    let useMonthTicket  = isMonthTicketUsed ? 1 : 0;
    let _appleAndAndroidPayRes = null;
    let _deductionId = isEmpty(couponDetail) ? null : couponDetail.deductionId;
    let placeId = isEmpty(this.props.currentPlace.id) ? null : this.props.currentPlace.id;
    if (
      defaultPayment == PAY_TYPE.android_pay ||
      defaultPayment == PAY_TYPE.apple_pay
    ) {
      _appleAndAndroidPayRes = token;
      token = _appleAndAndroidPayRes.details.paymentToken;
    }
    this.props.showLoadingModal();
    confirmOrderV1(
      orderId,
      totalMoney,
      defaultPayment,
      token,
      _deductionId,
      useMonthTicket,
      remark,
      placeId
    ).then(
      data => {
        console.log(9999999,data);
          ToastUtil.showWithMessage(i18n.confirmorder_tips.success.order);
          this.props.navigation.navigate("MyOrderDrawer", {
            replaceRoute: true,
            index: 0,
            confirm: true
          });
        }
    ).catch(err => {
      if(err.errCode !== 50000) {
        let _message =
            defaultPayment == PAY_TYPE.credit_card
            ? `,${i18n.confirmorder_tips.fail.check_card}`
            : "";
        ToastUtil.showWithMessage(data.ro.respMsg + _message);
      }
    });
  }

  _useCoupon = () => {
    let {
      i18n,
      coupon,
      discountsPrice,
      orderDetail: { orderId }
    } = this.state;
    if (coupon == null) {
      ToastUtil.showWithMessage(i18n.confirmorder_tips.fail.coupon_null);
      return;
    }
    if (discountsPrice > 0) {
      ToastUtil.showWithMessage(i18n.confirmorder_tips.fail.coupon_used);
      return;
    }
    useCoupon(coupon, orderId)
      .then(data => {
        ToastUtil.showWithMessage(i18n.confirmorder_tips.success.coupon);
        this.setState({
          discountsPrice: data.money
        });
      })
      .catch((err) => {
        if(err.errCode != 50000) {
          this._input._root.clear();
          this.setState({
            coupon: null
          });
        }
      });
  };

  _currentPayType = () => {
    let {
      hasChangeDefaultPayment,
      orderDetail: { defaultPayment }
    } = this.state;
    defaultPayment =
      hasChangeDefaultPayment != null
        ? hasChangeDefaultPayment
        : defaultPayment;
    return EXPLAIN_PAY_TYPE[defaultPayment][this.props.language];
  };

  _renderMonthTicketView() {
    const {orderDetail: {monthTicketAmount}, isMonthTicketUsed} = this.state;
    return (
      <View style={{flexDirection: 'row', justifyContent: "space-between",flex: 1, paddingRight: em(5)}}>
        <Text>{isMonthTicketUsed ? monthTicketAmount ? '1張' :   '不可用' : monthTicketAmount  ? '不使用月票抵購' : '不可用'}</Text>
        <Text>剩餘{monthTicketAmount || '0'}張</Text>
      </View>
    )
  }

  _renderCouponView() {
    const {orderDetail: {monthTicketAmount}, couponDetail, discountsPrice, isMonthTicketUsed} = this.state;
    return (
      <View style={{flexDirection: 'row', justifyContent: "space-between",flex: 1, paddingRight: em(5)}}>
        <View style={{flexDirection: 'row', justifyContent: "space-between"}}>
          <Image
            source={require("../asset/coupon.png")}
            resizeMode="contain"
            style={{ width: em(18), height: em(18), marginRight: em(11.5),marginTop: Platform.OS == 'android' ? em(2) : 0 }}
          />
          <Text>{isMonthTicketUsed && monthTicketAmount ? `優惠券` : couponDetail ? `通用` : "不可用"}</Text>
        </View>  
        <Text>{isMonthTicketUsed && monthTicketAmount ? `${couponDetail&&couponDetail.totalAmount || '0'}張` : couponDetail ? `- HKD ${parseInt(couponDetail.discount).toFixed(2)}` : "0張"}</Text>
      </View>
    )
  }

  //private function

  handlePayWithAppleOrAndroid(resolve, reject, paytype) {
    let supportedMethods = "";
    let {
      orderDetail: { totalMoney, orderDetail, foodName },
      discountsPrice
    } = this.state;
    totalMoney =
      totalMoney - discountsPrice > 0 ? totalMoney - discountsPrice : 0;
    if (Platform.OS == "ios" && paytype == PAY_TYPE.apple_pay) {
      supportedMethods = [
        {
          supportedMethods: ["apple-pay"],
          data: {
            merchantIdentifier: merchant_id,
            supportedNetworks: ["visa", "mastercard"],
            countryCode: "HK",
            currencyCode: "HKD",
            paymentMethodTokenizationParameters: {
              parameters: {
                gateway: "stripe",
                "stripe:publishableKey": stripe_api_key,
                "stripe:version": "13.0.3"
              }
            }
          }
        }
      ];
    }
    if (Platform.OS == "android" && paytype == PAY_TYPE.android_pay) {
      supportedMethods = [
        {
          supportedMethods: ["android-pay"],
          data: {
            supportedNetworks: ["visa", "mastercard", "amex"],
            currencyCode: "USD",
            // environment: 'TEST', // defaults to production
            paymentMethodTokenizationParameters: {
              tokenizationType: "NETWORK_TOKEN",
              parameters: {
                publicKey: stripe_api_key
              }
            }
          }
        }
      ];
    }

    const details = {
      id: "goforeat_pay",
      displayItems: [
        {
          label: foodName,
          amount: { currency: "HKD", value: totalMoney }
        }
      ],
      total: {
        label: "Goforeat Technoloy Limited",
        amount: { currency: "HKD", value: totalMoney }
      }
    };
    if(totalMoney == 0) {
      ToastUtil.showWithMessage('當前訂單總額為0,請切換到現金支付方式!');
      return;
    }

    const pr = new PaymentRequest(supportedMethods, details);
    pr.show()
      .then(paymentResponse => {
        resolve(paymentResponse);
        paymentResponse.complete("success");
      })
      .catch(e => {
        console.log({ e });
        pr.abort();
        reject();
      });
  }

  _getCoupon = coupon => {
    this.setState({
      coupon
    });
  };

  _getRemark(val) {
    this.setState({
      remark: val
    });
  }

  _renderCouponBtnView() {
    return (
      <View style={[ConfirmOrderStyles.NewsInner, styles.commonMarginBottom]}>
        <Input
          ref={t => (this._input = t)}
          clearButtonMode="while-editing"
          style={ConfirmOrderStyles.CouponInput}
          placeholderTextColor="#999999"
          placeholder={this.state.i18n.couponCode}
          multiline={false}
          autoFocus={false}
          returnKeyType="done"
          onChangeText={coupon => this._getCoupon(coupon)}
        />
        <TouchableOpacity
          onPress={() => this._useCoupon()}
          style={ConfirmOrderStyles.CouponBtn}
        >
          <Text style={ConfirmOrderStyles.CouponText}>
            {this.state.i18n.use}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  _renderNewCouponView() {
    let { couponDetail } = this.state;
    const payMoney = this._countTotal();
    return (
      <CommonItem
        style={{ padding: 0, width: "100%", borderBottomWidth: 0 , paddingTop: 10,
        paddingBottom: 10}}
        content={
          couponDetail != null
            ? couponDetail.condition > 0
              ? `滿$${couponDetail.condition}可用,立減$${couponDetail.discount}`
              : `無門檻使用,立減$${couponDetail.discount}`
            : "使用優惠券"
        }
        hasLeftIcon
        leftIcon={
          <Image
            source={require("../asset/coupon.png")}
            resizeMode="contain"
            style={{ width: em(20), height: em(20), marginRight: em(11.5) }}
          />
        }
        rightIcon={
          <Icon
            name="ios-arrow-forward"
            style={ConfirmOrderStyles.ArrowShow}
          />
        }
        clickFunc={() =>
          this.props.navigation.navigate("Coupon", {
            callback: coupon => {
              if (!isEmpty(coupon)) {
                this.setState({
                  couponDetail: coupon,
                  discountsPrice: coupon.discount
                });
              }
              // console.log({coupon})
            },
            payMoney,
            from: "confirm_order"
          })
        }
      />
    );
  }

  _renderNewOrderView() {
    if (this.state.orderDetail == null) {
      return (
        <View style={styles.commonNewContainer}>
          <View style={[ConfirmOrderStyles.NewsInner, styles.commonMarginTop]}>
            <ShimmerPlaceHolder autoRun={true} style={{width: "100%",height: 25}}/>
          </View>
          <View style={[ConfirmOrderStyles.NewsInner, styles.commonMarginTop]}>
            <ShimmerPlaceHolder autoRun={true} style={{width: "100%",height: 25}}/>
          </View>
          <View style={[ConfirmOrderStyles.NewsInner, styles.commonMarginTop, styles.commonMarginBottom]}>
            <ShimmerPlaceHolder autoRun={true} style={{width: "100%",height: 25}}/>
          </View>
        </View>
      );
    }
    let {
      orderDetail: { totalMoney, foodName, foodMoney, foodNum, defaultPayment, monthTicketAmount, addName, addPrice, foodUnitPrice },
      isMonthTicketUsed,
      hasChangeDefaultPayment,
      discountsPrice,
      i18n
    } = this.state;
    defaultPayment =
      hasChangeDefaultPayment != null
        ? hasChangeDefaultPayment
        : defaultPayment;
    
    totalMoney = isMonthTicketUsed && monthTicketAmount ? totalMoney :
      totalMoney - discountsPrice > 0 ? totalMoney - discountsPrice : 0;
    return (
      <View style={styles.commonNewContainer}>
        <View style={[ConfirmOrderStyles.NewsInner, styles.commonMarginTop]}>
          <Text style={ConfirmOrderStyles.FoodName} numberOfLines={1}>
            {foodName}
          </Text>
          <Text style={ConfirmOrderStyles.MoneyUnit} numberOfLines={1}>
            HKD {parseInt(foodUnitPrice * foodNum).toFixed(2)}
          </Text>
        </View>
        <View style={[ConfirmOrderStyles.CountView, styles.commonMarginBottom, {marginTop: em(5)}]}>
          <Text style={ConfirmOrderStyles.CountText}>{i18n.quantity}:</Text>
          <Text style={ConfirmOrderStyles.FoodNum}>{foodNum}</Text>
        </View>
        {
          typeof addName != 'undefined' && typeof addPrice != "undefined" ? (
            <View style={[ConfirmOrderStyles.NewsInner, {marginTop: em(5)}]}>
              <Text style={ConfirmOrderStyles.FoodName} numberOfLines={1}>
                {addName}
              </Text>
              <Text style={ConfirmOrderStyles.MoneyUnit} numberOfLines={1}>
                HKD {parseInt(addPrice).toFixed(2)}
              </Text>
            </View>
          ) : null
        }
        {
          typeof addName != 'undefined' && typeof addPrice != "undefined" ? 
          (<View style={[ConfirmOrderStyles.CountView, styles.commonMarginBottom, {marginTop: em(5)}]}>
            <Text style={ConfirmOrderStyles.CountText}>{i18n.quantity}:</Text>
            <Text style={ConfirmOrderStyles.FoodNum}>{foodNum}</Text>
          </View>) : null
        }
        {
          isMonthTicketUsed && monthTicketAmount ? null : discountsPrice > 0 ? (
            <View style={[ConfirmOrderStyles.NewsInner, styles.commonMarginTop]}>
              <Text style={ConfirmOrderStyles.TotalText}>{i18n.discount}</Text>
              <View style={ConfirmOrderStyles.NewsInner}>
                <Text style={ConfirmOrderStyles.CouponUnit}>- HKD</Text>
                <Text style={ConfirmOrderStyles.CouponMoney} numberOfLines={1}>
                  {discountsPrice.toFixed(2)}
                </Text>
              </View>
            </View>
          ) : null
        }
        <View
          style={[
            ConfirmOrderStyles.NewsInner,
            styles.commonMarginTop,
            styles.commonMarginBottom
          ]}
        >
          <Text style={ConfirmOrderStyles.TotalText}>{i18n.total}</Text>
          <View style={ConfirmOrderStyles.NewsInner}>
            <Text style={ConfirmOrderStyles.MoneyUnit}>HKD</Text>
            <Text style={ConfirmOrderStyles.TotalMoney} numberOfLines={1}>
              {totalMoney.toFixed(2)}
            </Text>
          </View>
        </View>
        <Divider bgColor="#EBEBEB" height={1} />
      </View>
    );
  }

  _renderNewDetailsView() {
    if(this.state.orderDetail == null) {
      return (
        <View style={styles.commonNewContainer}>
          <View style={[ConfirmOrderStyles.NewsInner, styles.commonMarginTop]}>
            <ShimmerPlaceHolder autoRun={true} style={{width: "20%",height: 50}}/>
            <ShimmerPlaceHolder autoRun={true} style={{width: "75%",height: 50}}/>
          </View>
          <View style={[ConfirmOrderStyles.NewsInner, styles.commonMarginTop]}>
            <ShimmerPlaceHolder autoRun={true} style={{width: "20%",height: 50}}/>
            <ShimmerPlaceHolder autoRun={true} style={{width: "75%",height: 50}}/>
          </View>
          <View style={[ConfirmOrderStyles.NewsInner, styles.commonMarginTop, styles.commonMarginBottom]}>
            <ShimmerPlaceHolder autoRun={true} style={{width: "20%",height: 50}}/>
            <ShimmerPlaceHolder autoRun={true} style={{width: "75%",height: 50}}/>
          </View>
          <View style={[ConfirmOrderStyles.NewsInner, styles.commonMarginTop, styles.commonMarginBottom]}>
            <ShimmerPlaceHolder autoRun={true} style={{width: "20%",height: 50}}/>
            <ShimmerPlaceHolder autoRun={true} style={{width: "75%",height: 50}}/>
          </View>
          <View style={[ConfirmOrderStyles.NewsInner, styles.commonMarginTop, styles.commonMarginBottom]}>
            <ShimmerPlaceHolder autoRun={true} style={{width: "20%",height: 50}}/>
            <ShimmerPlaceHolder autoRun={true} style={{width: "75%",height: 50}}/>
          </View>
        </View>
      );
    }
    let { i18n } = this.state;
    let {
      orderDetail: { takeTime, takeDate, takeAddress }
    } = this.state;
    let _details_arr = [
      {
        title: i18n.fooddate,
        content: takeDate,
        hasPreIcon: false,
        fontColor: "#ff3448",
        canOpen: false,
        clickFunc: () => {},
        disable: true
      },
      {
        title: i18n.foodAddress,
        content: takeAddress,
        hasPreIcon: true,
        fontColor: "#333333",
        canOpen: false,
        clickFunc: () => {},
        disable: true
      },
      {
        title: i18n.foodTime,
        content: takeTime,
        hasPreIcon: false,
        fontColor: "#333333",
        canOpen: false,
        clickFunc: () => {},
        disable: true
      },
      {
        title: i18n.useMonthTicket,
        isCustomContent: true,
        content: this._renderMonthTicketView(),
        hasPreIcon: false,
        fontColor: "#333333",
        canOpen: true,
        clickFunc: () => {
          this.props.navigation.navigate("MonthTicket", {
            from: 'confirm_order',
            isUsed: this.state.isMonthTicketUsed,
            callback: isUse => {
              this.setState({
                isMonthTicketUsed: isUse
              });
            }
          });
        },
        // disable: true
      },
      {
        title: i18n.useCoupon,
        isCustomContent: true,
        content: this._renderCouponView(),
        hasPreIcon: false,
        fontColor: "#333333",
        canOpen: true,
        clickFunc: () => {
          this.props.navigation.navigate("Coupon", {
            callback: coupon => {
              if (!isEmpty(coupon)) {
                this.setState({
                  couponDetail: {...this.state.couponDetail, ...coupon},
                  discountsPrice: coupon.discount
                });
              }
              // console.log({coupon})
            },
            payMoney: this._countTotal(),
            from: "confirm_order"
          })
        },
        // disable: true
      },
      {
        title: i18n.payment,
        content: this._currentPayType(),
        hasPreIcon: false,
        fontColor: "#333333",
        canOpen: true,
        clickFunc: () => {
          this.props.navigation.navigate("PayType", {
            from: "confirm_order",
            callback: () => {
              this._createOrder();
            }
          });
        }
      }
    ];
    return (
      <View
        style={[
          styles.commonNewContainer,
          {
            marginBottom: GLOBAL_PARAMS.isIphoneX()
              ? GLOBAL_PARAMS.iPhoneXBottom
              : 0
          }
        ]}
      >
        <Text
          style={[
            ConfirmOrderStyles.Title,
            styles.commonMarginBottom,
            styles.commonMarginTop
          ]}
        >
          {i18n.foodInformation}
        </Text>
        {_details_arr.map((item, idx) =>
          this._renderCommonDetailView(item, idx)
        )}
        <View
          style={[styles.commonDetailsContainer, styles.commonMarginBottom]}
        >
          <Text style={{ color: "#999999", marginBottom: 10 }}>
            {i18n.remark}
          </Text>
          <Input
            allowFontScaling={false}
            style={ConfirmOrderStyles.Input}
            placeholderTextColor="#999"
            placeholder="餐食恕無法滿足特殊要求"
            clearButtonMode="while-editing"
            onChangeText={val => this._getRemark(val)}
          />
        </View>
      </View>
    );
  }

  _renderCommonDetailView(item, idx) {
    let { i18n } = this.state;
    return (
      <View
        key={idx}
        style={[styles.commonDetailsContainer, styles.commonMarginBottom]}
      >
        <Text style={{ color: "#999999", marginBottom: 10 }}>{item.title}</Text>
        <TouchableOpacity
          disabled={item.disable}
          onPress={item.clickFunc}
          style={ConfirmOrderStyles.DetailText}
        >
          <View style={ConfirmOrderStyles.DetailInner}>
            {item.hasPreIcon ? (
              <Image
                source={require("../asset/location.png")}
                style={{ width: 18, height: 17, marginRight: 5 }}
                resizeMode="contain"
              />
            ) : null}
            {
              item.isCustomContent ? item.content : (<Text
                style={{
                  fontSize: 18,
                  color: item.fontColor,
                  marginRight: item.hasPreIcon ? 20 : 0
                }}
                numberOfLines={1}
              >
                {item.content}
              </Text>)
            }
          </View>
          {item.canOpen ? (
            <Icon
              name="ios-arrow-forward"
              style={ConfirmOrderStyles.ArrowShow}
            />
          ) : null}
        </TouchableOpacity>
      </View>
    );
  }

  _renderBottomConfirmView() {
    return (
      <Footer
        style={{
          backgroundColor: "#fff",
          height: em(60),
          justifyContent: 'space-around',
          alignItems: "center"
        }}
      >
        <View style={{flexDirection: 'row', justifyContent:'space-between',alignItems:'center'}}>
          <Text style={{color: '#666', fontSize: em(14)}}>還需支付 HKD  </Text>
          <Text style={{color: '#ff5050', fontSize: em(28),marginTop:em(-8)}}>{this.state.orderDetail ? this._countTotal().toFixed(2) : "--"}</Text>
        </View>
        <CommonBottomBtn
          style={{ height: em(40),width: em(140),alignSelf: 'center',marginBottom: 0,}}
          disabled={this.state.orderDetail == null}
          loading={this.state.orderDetail == null}
          clickFunc={() => this._confirmOrder()}
        >
          {this.state.i18n.orderNow}
        </CommonBottomBtn>
      </Footer>
    );
  }

  render() {
    let {
      i18n,
      orderDetail,
      loading,
      isError,
      isExpired,
      expiredMessage
    } = this.state;
    console.log("confirmorder~~~~~render");
    return (
      <CustomizeContainer.SafeView mode="linear">
        <CommonHeader
          canBack
          title={i18n.detailPage}
          titleStyle={{ fontSize: 18, fontWeight: "bold" }}
          {...this["props"]}
        />
        {isError ? (
          <ErrorPage
            errorToDo={() => this._createOrder()}
            errorTips={i18n.common_tips.reload}
          />
        ) : null}
        <Content style={{ backgroundColor: "#efefef" }} padder>
          {isExpired ? (
            <BlankPage message={expiredMessage} style={{ marginLeft: -10 }} />
          ) : null}
          {this._renderNewOrderView()}
          {this._renderNewDetailsView()}

          <View style={{ height: 20 }} />
        </Content>
        {this._renderBottomConfirmView()}
      </CustomizeContainer.SafeView>
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
    shadowColor: "#efefef",
    shadowOpacity: 0.8,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
    marginBottom: 10,
    backgroundColor: Colors.main_white,
  },
  commonDetailsContainer: {
    justifyContent: "space-around",
    alignItems: "flex-start"
  },
  commonMarginTop: {
    marginTop: 15
  },
  commonMarginBottom: {
    marginBottom: 15
  }
});

const stateToConfirmOrder = state => ({
  language: state.language.language,
  paytype: state.payType.payType,
})

export default connect(stateToConfirmOrder, {})(ConfirmOrderView);