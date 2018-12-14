import React, { PureComponent } from "react";
import { View, Image } from "react-native";
import { Container, Content } from "native-base";
//components
import CommonItem from "../components/CommonItem";
import CommonHeader from "../components/CommonHeader";
import Text from "../components/UnScalingText";
import CommonBottomBtn from "../components/CommonBottomBtn";
import Loading from "../components/Loading";
import ErrorPage from "../components/ErrorPage";
//utils
import {
  SET_PAY_TYPE,
  EXPLAIN_PAY_TYPE,
  em,
  isEmpty
} from "../utils/global_params";
import ToastUtil from "../utils/ToastUtil";
import Colors from "../utils/Colors";
//styles
import PaySettingStyles from "../styles/paysetting.style";
//api
import { getPaySetting, getMonthTicket } from "../api/request";

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
      this._getPaySetting();
      clearTimeout(_timer);
    }, 300);
  }

  //api
  _getPaySetting() {
    getPaySetting()
      .then(data => {
        if (data.ro.ok) {
          let _arr = [];
          if (data.data && data.data.hasOwnProperty("creditCard")) {
            this.setState({
              creditCardInfo: data.data.creditCard
            });
          }
          data.data.payments.forEach((v, i) => {
            if (v.code != SET_PAY_TYPE.credit_card) {
              _arr.push({
                content:
                  EXPLAIN_PAY_TYPE[v.code][this.props.screenProps.language],
                hasLeftIcon: true,
                leftIcon: this._leftImage(LIST_IMAGE[v.code]),
                code: v.code
              });
              if (v.code == SET_PAY_TYPE.month_ticket) {
                _arr.push({
                  content: this.state.monthTicketQuantity,
                  hasLeftIcon: true,
                  leftIcon: (
                    <Text
                      style={{
                        marginRight: 5,
                        color: Colors.main_orange,
                        fontSize: em(16)
                      }}
                    >
                      月票數量
                    </Text>
                  ),
                  code: null
                });
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
          ToastUtil.showWithMessage(data.ro.respMsg);
          if (data.ro.respCode == "10006" || data.ro.respCode == "10007") {
            this.props.screenProps.userLogout();
            this.props.navigation.goBack();
          }
        }
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
    _from_confirm_order && this.props.showLoading();
    this.props.screenProps.setPayType(
      payment,
      () => {
        if (_from_confirm_order) {
          const { callback } = this.props.navigation.state.params;
          callback && callback();
          this.props.navigation.goBack();
        } else {
          ToastUtil.showWithMessage("修改支付方式成功");
        }
      },
      () => this.props.hideLoading()
    );
  }

  _getMonthTicket() {
    getMonthTicket()
      .then(data => {
        if (typeof data["data"] == "undefined") {
          return;
        }
        if (data.ro.ok) {
          let _date = new Date(data.data.endTime);
          this.setState({
            monthTicketQuantity: data.data.amount,
            monthTicketEndTime: [
              _date.getFullYear(),
              _date.getMonth() + 1,
              _date.getDate()
            ].join("-")
          });
        }
      })
      .catch(err => {
        this.setState({
          loading: false,
          isError: false
        });
      });
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
      <View style={{ marginTop: em(10) }}>
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
                  const { callback } = this.props.navigation.state.params;
                  callback && callback();
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
      <Container>
        <CommonHeader
          title={this.i18n.payment}
          hasMenu={!_from_confirm_order}
          canBack={_from_confirm_order}
        />
        <Content style={{ backgroundColor: "#efefef" }}>
          {this.state.loading ? (
            <Loading />
          ) : (
            <View>
              {payTypeList.map((item, key) => (
                <CommonItem
                  key={key}
                  content={
                    item.code == null && monthTicketQuantity != 0
                      ? monthTicketQuantity
                      : item.content
                  }
                  isEnd={item.isEnd}
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
              {this._renderManageCreditCard()}
            </View>
          )}
          {this.state.isError ? (
            <ErrorPage
              errorTips={this.i18n.common_tips.reload}
              errorToDo={() => this._getPaySetting()}
            />
          ) : null}
        </Content>
      </Container>
    );
  }
}
