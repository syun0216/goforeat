import React, { PureComponent } from "react";
import {
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Image
} from "react-native";
import { Container, Content, Icon, Input, Toast, Footer } from "native-base";
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
  client,
  stripe_api_key,
  merchant_id
} from "../utils/global_params";
import ToastUtil from "../utils/ToastUtil";
import { getDeviceId } from "../utils/DeviceInfo";
//api
import { createNewOrder, confirmOrder, useCoupon } from "../api/request";
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

export default class ConfirmOrderView extends PureComponent {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    console.log({ navigation });
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
    console.log(props);
    this.props.navigation.setParams({ i18n: this.props.i18n });
    this.dateFoodId = this.props.navigation.state.params.dateFoodId;
    this.amount = this.props.navigation.state.params.amount;
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
      isCouponPickModalShow: false,
      couponDetail: null,
      i18n: I18n[props.screenProps.language]
    };
  }

  componentDidMount() {
    this.timer = setTimeout(() => {
      this._createOrder();
      clearTimeout(this.timer);
    }, 500);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.screenProps.paytype == PAY_TYPE.month_ticket) {
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
    let { i18n } = this.state;
    createNewOrder(this.dateFoodId, this.amount).then(
      data => {
        if (data.ro.respCode == "0000" && data.data) {
          this.setState({
            loading: false,
            orderDetail: data.data,
            discountsPrice: data.data.deduction && data.data.deduction.discount || 0,
            couponDetail: data.data.deduction || null,
            isBottomShow: true,
            isError: false
          });
        } else {
          if (data.ro.respCode == "10006" || data.ro.respCode == "10007") {
            this.props.screenProps.userLogout();
          }
          ToastUtil.showWithMessage(data.ro.respMsg);
          this.props.navigation.goBack();
          this.setState({
            loading: false,
            isExpired: true,
            expiredMessage: data.ro.respMsg
          });
        }
      },
      () => {
        this.setState({ loading: false, isError: true });
        ToastUtil.showWithMessage(i18n.confirmorder_tips.fail.get_order);
      }
    );
  }

  async _confirmOrder() {
    let {
      i18n,
      orderDetail: { defaultPayment }
    } = this.state;
    let { creditCardInfo } = this.props.screenProps;
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
      discountsPrice,
      coupon,
      remark
    } = this.state;
    totalMoney =
      totalMoney - discountsPrice > 0 ? totalMoney - discountsPrice : 0;
    let { i18n } = this.state;
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
    confirmOrder(
      orderId,
      totalMoney,
      defaultPayment,
      token,
      remark,
      _deductionId,
      placeId
    ).then(
      data => {
        this.props.hideLoadingModal();
        if (data.ro.respCode == "0000") {
          ToastUtil.showWithMessage(i18n.confirmorder_tips.success.order);
          this.props.navigation.navigate("MyOrderDrawer", {
            replaceRoute: true,
            index: 0,
            confirm: true
          });
        } else {
          let _message =
            defaultPayment == PAY_TYPE.credit_card
              ? `,${i18n.confirmorder_tips.fail.check_card}`
              : "";
          ToastUtil.showWithMessage(data.ro.respMsg + _message);
        }
      },
      () => {
        // ToastUtil.showWithMessage(i18n.confirmorder_tips.fail.order);
        this.props.hideLoadingModal();
      }
    );
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
        if (data.ro.respCode == "0000") {
          ToastUtil.showWithMessage(i18n.confirmorder_tips.success.coupon);
          this.setState({
            discountsPrice: data.data.money
          });
        } else {
          ToastUtil.showWithMessage(data.ro.respMsg);
          this._input._root.clear();
          this.setState({
            coupon: null
          });
        }
      })
      .catch(() => {
        () => {
          ToastUtil.showWithMessage(i18n.confirmorder_tips.fail.get_coupon);
        };
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
    return EXPLAIN_PAY_TYPE[defaultPayment][this.props.screenProps.language];
  };

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
            name="ios-arrow-forward-outline"
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
          <View style={[ConfirmOrderStyles.NewsInner, styles.commonMarginTop, styles.commonMarginBottom]}>
            <ShimmerPlaceHolder autoRun={true} style={{width: "100%",height: 25}}/>
          </View>
        </View>
      );
    }
    let {
      orderDetail: { totalMoney, foodName, foodMoney, foodNum, defaultPayment, deduction },
      hasChangeDefaultPayment,
      discountsPrice,
      i18n
    } = this.state;
    defaultPayment =
      hasChangeDefaultPayment != null
        ? hasChangeDefaultPayment
        : defaultPayment;
    
    totalMoney =
      totalMoney - discountsPrice > 0 ? totalMoney - discountsPrice : 0;
    return (
      <View style={styles.commonNewContainer}>
        <View style={[ConfirmOrderStyles.NewsInner, styles.commonMarginTop]}>
          <Text style={ConfirmOrderStyles.FoodName} numberOfLines={1}>
            {foodName}
          </Text>
          <Text style={ConfirmOrderStyles.MoneyUnit} numberOfLines={1}>
            HKD {foodMoney.toFixed(2)}
          </Text>
        </View>
        <View style={[ConfirmOrderStyles.CountView, styles.commonMarginBottom]}>
          <Text style={ConfirmOrderStyles.CountText}>{i18n.quantity}:</Text>
          <Text style={ConfirmOrderStyles.FoodNum}>{foodNum}</Text>
        </View>
        {discountsPrice > 0 ? (
          <View style={[ConfirmOrderStyles.NewsInner, styles.commonMarginTop]}>
            <Text style={ConfirmOrderStyles.TotalText}>{i18n.discount}</Text>
            <View style={ConfirmOrderStyles.NewsInner}>
              <Text style={ConfirmOrderStyles.CouponUnit}>- HKD</Text>
              <Text style={ConfirmOrderStyles.CouponMoney} numberOfLines={1}>
                {discountsPrice.toFixed(2)}
              </Text>
            </View>
          </View>
        ) : null}
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
        {defaultPayment == PAY_TYPE.month_ticket
          ? null
          : this._renderNewCouponView()}
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
            placeholder="例如:加飯、少辣"
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
            <Text
              style={{
                fontSize: 18,
                color: item.fontColor,
                marginRight: item.hasPreIcon ? 20 : 0
              }}
              numberOfLines={1}
            >
              {item.content}
            </Text>
          </View>
          {item.canOpen ? (
            <Icon
              name={
                item.title == i18n.payment
                  ? "ios-arrow-forward-outline"
                  : "ios-arrow-down-outline"
              }
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
          height: em(50),
          backgroundColor: "#fff",
          height: GLOBAL_PARAMS.isIphoneX() ? em(50)+GLOBAL_PARAMS.iPhoneXBottom : em(50),
        }}
      >
        <CommonBottomBtn
          style={{ height: em(40) }}
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
    backgroundColor: Colors.main_white
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
