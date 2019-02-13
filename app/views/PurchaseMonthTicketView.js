import React, { PureComponent } from "react";
import { View, Text, TouchableOpacity, Image, Platform } from "react-native";
import { Footer, Right, Left, Body, Content } from "native-base";
import { Overlay } from "teaset";
//api
import {
  getMonthTicketList,
  createMonthTicket,
  confirmMonthTicket
} from "../api/request";
//components
import CommonHeader from "../components/CommonHeader";
import CustomizeContainer from "../components/CustomizeContainer";
import BlankPage from "../components/BlankPage";
import CommonItem from "../components/CommonItem";
//style
import PurchaseMonthTicketStyles from "../styles/purchasemonthticket.style";
import PaySettingStyles from "../styles/paysetting.style";
//utils
import Colors from "../utils/Colors";
import {
  stripe_api_key,
  merchant_id,
  SET_PAY_TYPE,
  em
} from "../utils/global_params";

const CHECKED = require("../asset/checked.png");
const UNCHECKED = require("../asset/unchecked.png");

export default class PurchaseMonthTicketView extends PureComponent {
  _overlayViewKey = null; // overlayview的唯一key值
  _overlayView = null;
  _pullView = null;
  _timer = null;
  _paymentRequest = null;

  state = {
    monthTicketList: [],
    currentMonthTicketSelect: {},
    currentMonthTicketOrder: null,
    currentPayType: SET_PAY_TYPE.credit_card,
    test: 1
  };

  componentDidMount() {
    this._timer = setTimeout(() => {
      this.props.showLoading && this.props.showLoading();
      this._getMonthTicketList();
      clearTimeout(this._timer);
    }, 400);
  }

  componentWillUnmount() {
    this._timer && clearTimeout(this._timer);
  }

  _getMonthTicketList() {
    getMonthTicketList()
      .then(data => {
        this.props.hideLoading && this.props.hideLoading();
        if (data.ro.ok && data.data.list.length > 0) {
          this.setState({
            monthTicketList: data.data.list,
            currentMonthTicketSelect: data.data.list[0]
          });
        } else {
          this.props.toast("獲取數據失敗");
        }
      })
      .catch(err => {
        this.props.hideLoading && this.props.hideLoading();
        this.props.toast("獲取數據失敗");
      });
  }

  _createMonthTicket() {
    this.props.showLoadingModal();
    createMonthTicket(this.state.currentMonthTicketSelect.specId)
      .then(data => {
        this.props.hideLoadingModal();
        if (data.ro.ok && data.data) {
          this.setState(
            {
              currentMonthTicketOrder: data.data
            },
            () => {
              this._showOverlayConfirmView();
            }
          );
        } else {
          this.props.toast(data.ro.respMsg || "獲取數據失敗");
        }
      })
      .catch(err => {
        this.props.hideLoadingModal();
        this.props.toast("獲取數據失敗");
      });
  }

  _payMonthTicket(token, payment) {
    const { callback } = this.props.navigation.state.params;
    const { orderId, price } = this.state.currentMonthTicketOrder;
    let params = {
      orderId,
      payMoney: price,
      payment,
      token
    };
    confirmMonthTicket(params)
      .then(data => {
        this._pullView && this._pullView.close();
        this.props.hideLoadingModal();
        if (data.ro.ok) {
          this.state.currentPayType == SET_PAY_TYPE.apple_pay && this._paymentRequest && this._paymentRequest.complete("success");
          this.props.toast(data.ro.respMsg || "購買成功");
          this.props.navigation.goBack();
          callback && callback();
        } else {
          this.props.toast(data.ro.respMsg || "購買失敗");
          if(data.ro.respCode == "20010") {
            this.props.navigation.navigate('Credit', {
              callback: () => this.props.navigation.goBack()
            });
          }
        }
      })
      .catch(err => {
        console.log(err);
        this._pullView && this._pullView.close();
        this.props.hideLoadingModal();
        this.props.toast("購買失敗");
      });
  }

  _payWithApplePay() {
    const { price } = this.state.currentMonthTicketOrder;
    this.props.showLoadingModal();
    let supportedMethods = [
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
    const details = {
      id: "goforeat_month_ticket",
      displayItems: [
        {
          label: "購買月票",
          amount: { currency: "HKD", value: price }
        }
      ],
      total: {
        label: "Goforeat Technoloy Limited",
        amount: { currency: "HKD", value: price }
      }
    };
    const prMonthTicket = new PaymentRequest(supportedMethods, details);
    prMonthTicket
      .show()
      .then(res => {
        if (res.details && res.details.paymentToken) {
          this._paymentRequest = res;
          this._payMonthTicket(
            res.details.paymentToken,
            SET_PAY_TYPE.apple_pay
          );
        }
      })
      .catch(e => {
        this.props.hideLoadingModal();
        prMonthTicket.abort();
      });
  }

  _payWithCreditCard() {
    this.props.showLoadingModal();
    this._payMonthTicket(null, SET_PAY_TYPE.credit_card);
  }

  _showItemChecked(paytype) {
    if (this.state.currentPayType == paytype) {
      return (
        <Image
          source={CHECKED}
          style={[
            PaySettingStyles.payRightImage,
            { marginRight: 16, width: em(24), height: em(24) }
          ]}
          resizeMode="contain"
        />
      );
    } else {
      return (
        <Image
          source={UNCHECKED}
          style={[
            PaySettingStyles.payRightImage,
            { marginRight: 16, width: em(24), height: em(24) }
          ]}
          resizeMode="contain"
        />
      );
    }
  }

  _checked(paytype) {
    if (this.state.currentPayType == paytype) {
      return;
    }
    this.setState({ currentPayType: paytype },() => {
      Overlay.hide(this._overlayViewKey);
      this._overlayViewKey = Overlay.show(this.OverlayContent());
    });
  }

  OverlayContent() {
    const { price, amount } = this.state.currentMonthTicketOrder;
    return (
      <Overlay.PullView
        ref={pullview => (this._pullView = pullview)}
        side="bottom"
        modal={false}
      >
      <View style={PurchaseMonthTicketStyles.confirmView}>
        <View style={PurchaseMonthTicketStyles.confirmTopTitle}>
          <Text style={PurchaseMonthTicketStyles.confirmTopTitleText}>
            購買月票{amount}張
          </Text>
          <Text style={PurchaseMonthTicketStyles.confirmTopTitleText}>
            HKD {price}
          </Text>
        </View>
        <View style={PurchaseMonthTicketStyles.confirmContent}>
          <CommonItem
            style={PurchaseMonthTicketStyles.checPayTypeItem}
            hasLeftIcon
            leftIcon={
              <Image
                source={require("../asset/creditcard.png")}
                style={PaySettingStyles.payLeftImage}
                resizeMode="contain"
              />
            }
            content="信用卡支付"
            hasRightIcon
            rightIcon={this._showItemChecked(SET_PAY_TYPE.credit_card)}
            clickFunc={() => this._checked(SET_PAY_TYPE.credit_card)}
          />
          <CommonItem
            style={PurchaseMonthTicketStyles.checPayTypeItem}
            content="Apple Pay"
            hasLeftIcon
            leftIcon={
              <Image
                source={require("../asset/apple_pay.png")}
                style={PaySettingStyles.payLeftImage}
                resizeMode="contain"
              />
            }
            resizeMode="contain"
            hasRightIcon
            rightIcon={this._showItemChecked(SET_PAY_TYPE.apple_pay)}
            clickFunc={() => this._checked(SET_PAY_TYPE.apple_pay)}
          />
        </View>
        <View style={PurchaseMonthTicketStyles.confirmOrderBar}>
          <TouchableOpacity
            style={PurchaseMonthTicketStyles.payBtn}
            onPress={() => {
              if (this.state.currentPayType == SET_PAY_TYPE.credit_card) {
                this._payWithCreditCard();
              } else {
                this._payWithApplePay();
              }
            }}
          >
            <Text style={PurchaseMonthTicketStyles.submitBtnText}>去支付</Text>
          </TouchableOpacity>
        </View>
      </View>
      </Overlay.PullView>
    );
  }

  _showOverlayConfirmView() {
      
    this._overlayViewKey = Overlay.show(this.OverlayContent());
  }

  _renderTopTitle() {
    return (
      <View style={PurchaseMonthTicketStyles.topTitleView}>
        <View>
          <Text style={PurchaseMonthTicketStyles.topTitle}>月票套餐</Text>
          <Text style={PurchaseMonthTicketStyles.subTitle}>購買月票更優惠</Text>
        </View>
        <Image
          style={PurchaseMonthTicketStyles.img}
          source={require("../asset/goforeat.png")}
          resizeMode="cover"
        />
      </View>
    );
  }

  _renderTicketItem(item, key) {
    const { currentMonthTicketSelect } = this.state;
    return (
      <TouchableOpacity
        onPress={() => this.setState({ currentMonthTicketSelect: item })}
        style={[
          PurchaseMonthTicketStyles.ticketItem,
          currentMonthTicketSelect.specId == item.specId &&
            PurchaseMonthTicketStyles.activeItem
        ]}
        key={key}
      >
        <View>
          <Text style={PurchaseMonthTicketStyles.amount}>
            數量:{item.amount}
          </Text>
          <Text style={PurchaseMonthTicketStyles.date}>{item.endTime}</Text>
        </View>
        <View>
          <Text style={PurchaseMonthTicketStyles.price}>${item.price}</Text>
          <Text style={PurchaseMonthTicketStyles.oriPrice}>
            ${item.originPrice}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  _renderInfoView() {
    return(
      <View style={PurchaseMonthTicketStyles.infoView}>
        <View style={PurchaseMonthTicketStyles.infoViewTop}>
          <View style={PurchaseMonthTicketStyles.grayDivider}></View>
          <Text style={PurchaseMonthTicketStyles.dividerText}>購買月票须知</Text>
          <View style={PurchaseMonthTicketStyles.grayDivider}></View>
        </View>
        <View style={PurchaseMonthTicketStyles.infoContent}>
          <Text style={PurchaseMonthTicketStyles.infoContentText}>1.月票只會在購買當天的一個月內有效</Text>
          <Text style={PurchaseMonthTicketStyles.infoContentText}>2.使用期限請查看支付方式的月票到期日</Text>
          <Text style={PurchaseMonthTicketStyles.infoContentText}>3.如有任何爭議，Mealtime有得食保留最終解釋權</Text>
        </View>
      </View>
    )
  }

  render() {
    const { monthTicketList, currentMonthTicketSelect } = this.state;
    return (
      <CustomizeContainer.SafeView mode="linear">
        <CommonHeader title="購買月票" canBack />
        <Content style={{ marginTop: 10 }}>
          {this._renderTopTitle()}
          {monthTicketList.length > 0 ? (
            monthTicketList.map((item, key) =>
              this._renderTicketItem(item, key)
            )
          ) : null}
          {this._renderInfoView()}
        </Content>
        <Footer style={PurchaseMonthTicketStyles.footer}>
          <Left style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={PurchaseMonthTicketStyles.unit}>HKD</Text>
            <Text style={PurchaseMonthTicketStyles.total}>
              {(currentMonthTicketSelect.price &&
                currentMonthTicketSelect.price.toFixed(2)) ||
                "--"}
            </Text>
          </Left>
          <Body />
          <Right>
            <TouchableOpacity
              style={PurchaseMonthTicketStyles.submitBtn}
              onPress={() => this._createMonthTicket()}
            >
              <Text style={PurchaseMonthTicketStyles.submitBtnText}>購買</Text>
            </TouchableOpacity>
          </Right>
        </Footer>
      </CustomizeContainer.SafeView>
    );
  }
}
