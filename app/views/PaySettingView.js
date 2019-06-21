import React, { PureComponent } from "react";
import { View, Image } from "react-native";
import { Content } from "native-base";
//components
import CommonItem from "../components/CommonItem";
import CommonHeader from "../components/CommonHeader";
import Text from "../components/UnScalingText";
import CommonBottomBtn from "../components/CommonBottomBtn";
import ErrorPage from "../components/ErrorPage";
import CustomizeContainer from "../components/CustomizeContainer";
import Divider from "../components/Divider";
import OnlineBuyingModel from "../components/OnlineBuyingModel";
//utils
import {
  SET_PAY_TYPE,
  EXPLAIN_PAY_TYPE,
  em
} from "../utils/global_params";
import ToastUtil from "../utils/ToastUtil";
//styles
import PaySettingStyles from "../styles/paysetting.style";
//api
import {  getPaySettingNew } from "../api/request";

const _checked = "../asset/checked.png";
const _unchecked = "../asset/unchecked.png";
const LIST_IMAGE = {
  1: require("../asset/cash.png"),
  2: require("../asset/apple_pay.png"),
  3: require("../asset/android_pay.png"),
  4: require("../asset/wechat_pay.png"),
  5: require("../asset/ali_pay.png"),
  6: require("../asset/creditcard.png"),
  7: require("../asset/ticket.png")
};

export default class PaySettingView extends PureComponent {
  _onlineBuyingModel = null;

  constructor(props) {
    super(props);
    this.i18n = props.i18n;
    this.state = {
      checkedName: props.screenProps.paytype,
      loading: true,
      isError: false,
      payTypeList: [],
      monthTicketQuantity: 0,
      monthTicketEndTime: "",
      creditCardInfo: null
    };
  }

  componentDidMount() {
    let _timer = setTimeout(() => {
      this.props.showLoading && this.props.showLoading();
      this._getPaySetting();
      clearTimeout(_timer);
    }, 300);
  }

  //api
  _getPaySetting() {
    getPaySettingNew()
      .then(data => {
        let _arr = [];
        if (data && data.hasOwnProperty("creditCard")) {
          this.setState({
            creditCardInfo: data.creditCard
          });
        }
        data.payments.forEach((v, i) => {
          if (v.code != SET_PAY_TYPE.credit_card) {
            _arr.push({
              content:
                EXPLAIN_PAY_TYPE[v.code][this.props.screenProps.language],
              hasLeftIcon: true,
              leftIcon: this._leftImage(LIST_IMAGE[v.code]),
              code: v.code
            });
          }
        });
        this.setState({
          loading: false,
          payTypeList: _arr,
          checkedName: data.defaultPayment
        });
        // console.log(data);
      })
      .catch(err => {
        this.setState({
          loading: false,
          isError: true
        });
      });
  }

  _setPayType(payment) {
    let _from_confirm_order =
      typeof this.props.navigation.state.params != "undefined";
    _from_confirm_order && this.props.showLoadingModal();
    this.props.screenProps.setPayType(
      payment,
      () => {
        this.props.hideLoadingModal()
        if (_from_confirm_order) {
          const { callback } = this.props.navigation.state.params;
          callback && callback();
          this.props.navigation.goBack();
        } else {
          ToastUtil.showWithMessage("修改支付方式成功");
        }
      },
      () => this.props.hideLoadingModal()
    );
  }

  _checked(name) {
    // console.log(name)
    let _from_confirm_order =
      typeof this.props.navigation.state.params != "undefined";
    if (this.state.checkedName == name) {
      return;
    }
    this.setState({ checkedName: name });
    this._setPayType(name);
  }

  _checkedImage(name) {
    if (this.state.checkedName == name) {
      return (
        <Image
          source={require(_checked)}
          style={PaySettingStyles.payRightImage}
          resizeMode="contain"
        />
      );
    } else {
      return (
        <Image
          source={require(_unchecked)}
          style={PaySettingStyles.payRightImage}
          resizeMode="contain"
        />
      );
    }
  }

  _leftImage(image) {
    return (
      <Image
        source={image}
        style={PaySettingStyles.payLeftImage}
        resizeMode="contain"
      />
    );
  }

  _renderManageCreditCard() {
    let { creditCardInfo } = this.state;
    let _creditCardNumber = "";
    if (creditCardInfo != null) {
      _creditCardNumber = "**** **** **** " + creditCardInfo.tailNum;
    }
    return (
      <View>
        <View style={PaySettingStyles.creditcardView}>
          <Text style={PaySettingStyles.creditcardText}>
            {this.i18n.credit}
          </Text>
        </View>
        {creditCardInfo != null ? (
          <CommonItem
            hasLeftIcon
            leftIcon={this._leftImage(LIST_IMAGE[SET_PAY_TYPE.credit_card])}
            content={_creditCardNumber}
            rightIcon={this._checkedImage(SET_PAY_TYPE.credit_card)}
            clickFunc={() => this._checked(SET_PAY_TYPE.credit_card)}
          />
        ) : null}
        <CommonItem
          content={
            creditCardInfo != null ? this.i18n.manageCard : this.i18n.setCard
          }
          hasLeftIcon
          leftIcon={this._leftImage(LIST_IMAGE[SET_PAY_TYPE.credit_card])}
          clickFunc={() => {
            if (creditCardInfo != null) {
              this.props.navigation.navigate("Manage_Card", {
                callback: () => {
                  this.setState(
                    {
                      creditCardInfo: null
                    },
                    () => {
                      this._getPaySetting();
                    }
                  );
                }
              });
            } else {
              this.props.navigation.navigate("Credit", {
                callback: () => {
                  this._getPaySetting();
                }
              });
            }
          }}
        />
      </View>
    );
  }

  _renderBottomConfirm() {
    return (
      <CommonBottomBtn clickFunc={() => this.props.navigation.goBack()}>
        {this.i18n.confirm}
      </CommonBottomBtn>
    );
  }

  render() {
    let { payTypeList, monthTicketQuantity } = this.state;
    let _from_confirm_order =
      typeof this.props.navigation.state.params != "undefined";
    return (
      <CustomizeContainer.SafeView mode="linear">
        <CommonHeader
          title={this.i18n.payment}
          canBack
        />
        <Content bounces={false} style={{ backgroundColor: "#efefef"}}>
          {!this.state.loading && !this.state.isError && (
            <View>
              {this._renderManageCreditCard()}
              <Divider bgColor='#efefef' height={em(10)}/>
              <View style={PaySettingStyles.creditcardView}>
                <Text style={PaySettingStyles.creditcardText}>
                  {this.i18n.otherPayment}
                </Text>
              </View>
              {payTypeList.map((item, key) => (
                <CommonItem
                  key={key}
                  content={
                    item.code == null && monthTicketQuantity != 0
                      ? monthTicketQuantity
                      : item.content
                  }
                  // isEnd={item.isEnd}
                  clickFunc={() => {
                    item.code != null && this._checked(item.code);
                  }}
                  hasLeftIcon={item.hasLeftIcon}
                  leftIcon={item.leftIcon}
                  rightIcon={
                    item.code != null ? (
                      this._checkedImage(item.code)
                    ) : (
                      <Text>{this.state.monthTicketEndTime} 到期</Text>
                    )
                  }
                  style={
                    item.code != null
                      ? item.code != SET_PAY_TYPE.month_ticket
                        ? {}
                        : { borderBottomWidth: 0 }
                      : { height: em(44) }
                  }
                  disabled={item.code == null}
                />
              ))}
            </View>
          )}
          {this.state.isError ? (
            <ErrorPage
              errorTips={this.i18n.common_tips.reload}
              errorToDo={() => this._getPaySetting()}
            />
          ) : null}
        </Content>
      </CustomizeContainer.SafeView>
    );
  }
}
