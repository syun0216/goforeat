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
//style
import PurchaseMonthTicketStyles from "../styles/purchasemonthticket.style";
//utils
import Colors from "../utils/Colors";
import { stripe_api_key, merchant_id, PAY_TYPE } from "../utils/global_params";

export default class PurchaseMonthTicketView extends PureComponent {
  _overlayViewKey = null; // overlayview的唯一key值
  state = {
    monthTicketList: [],
    currentMonthTicketSelect: {},
    currentMonthTicketOrder: null
  };

  componentDidMount() {
    this._getMonthTicketList();
  }

  _getMonthTicketList() {
    getMonthTicketList()
      .then(data => {
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
    const {callback} = this.props.navigation.state.params;
    const { orderId, price } = this.state.currentMonthTicketOrder;
    let params = {
      orderId,
      payMoney: price,
      payment,
      token
    };
    confirmMonthTicket(params)
      .then(data => {
        Overlay.hide(this._overlayViewKey);
        this.props.hideLoadingModal();
        if (data.ro.ok) {
          this.props.toast(data.ro.respMsg || "購買成功");
          this.props.navigation.goBack();
          callback&&callback();
        } else {
          this.props.toast(data.ro.respMsg || "購買失敗");
        }
      })
      .catch(err => {
        console.log(err);
        Overlay.hide(this._overlayViewKey);
        this.props.hideLoadingModal();
        this.props.toast("購買失敗");
      });
  }

  _payWithApplePay() {
    const {price} = this.state.currentMonthTicketOrder;
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
      id: 'goforeat_month_ticket',
      displayItems: [
        {
          label: '購買月票',
          amount: { currency: "HKD", value: price }
        }
      ],
      total: {
        label: "Goforeat Technoloy Limited",
        amount: { currency: "HKD", value: price }
      }
    };
    const prForMonthTicket = new PaymentRequest(supportedMethods, details);
    prForMonthTicket.show().then(res => {
      if(res.details&&res.details.paymentToken) {
        this._payMonthTicket(res.details.paymentToken, PAY_TYPE.apple_pay);
      }
    }).catch(e => {
      this.props.hideLoadingModal();
      prForMonthTicket.abort();
    })
  }

  _payWithCreditCard() {
    this.props.showLoadingModal();
    this._payMonthTicket(null, PAY_TYPE.credit_card);
  }

  _showOverlayConfirmView() {
    const { price, amount } = this.state.currentMonthTicketOrder;
    const _overlayView = (
      <Overlay.PullView side="bottom" modal={false}>
        <View style={PurchaseMonthTicketStyles.confirmView}>
          <View style={PurchaseMonthTicketStyles.confirmTopTitle}>
            <Text style={PurchaseMonthTicketStyles.confirmTopTitleText}>
              選擇支付方式
            </Text>
          </View>
          <View style={PurchaseMonthTicketStyles.confirmContent}>
            <Text style={PurchaseMonthTicketStyles.confirmCommonText}>
              請您支付HKD
            </Text>
            <Text
              style={PurchaseMonthTicketStyles.confirmStrongText}
            >{`  ${price}  `}</Text>
            <Text style={PurchaseMonthTicketStyles.confirmCommonText}>
              以獲得
            </Text>
            <Text
              style={PurchaseMonthTicketStyles.confirmStrongText}
            >{`  ${amount}  `}</Text>
            <Text style={PurchaseMonthTicketStyles.confirmCommonText}>
              張月票
            </Text>
          </View>
          <View style={PurchaseMonthTicketStyles.confirmOrderBar}>
            <TouchableOpacity
              style={[
                PurchaseMonthTicketStyles.submitBtn,
                { backgroundColor: Colors.main_orange }
              ]}
              onPress={() => this._payWithCreditCard()}
            >
              <Text style={PurchaseMonthTicketStyles.submitBtnText}>
                信用卡支付
              </Text>
            </TouchableOpacity>
            {Platform.OS == "ios" && (
              <TouchableOpacity
                style={PurchaseMonthTicketStyles.submitBtn}
                onPress={() => this._payWithApplePay()}
              >
                <Text style={PurchaseMonthTicketStyles.submitBtnText}>
                  Apple Pay
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Overlay.PullView>
    );
    this._overlayViewKey = Overlay.show(_overlayView);
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
          ) : (
            <BlankPage message="加载中..." />
          )}
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
