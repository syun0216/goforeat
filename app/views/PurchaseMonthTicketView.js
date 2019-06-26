import React, { PureComponent } from "react";
import { View, Text, TouchableOpacity, Image, Platform } from "react-native";
import { Footer, Right, Left, Body, Content } from "native-base";
import { Overlay } from "teaset";
//api
import {
  getMonthTicketList,
  createMonthTicket,
  confirmMonthTicket,
  getMonthTicket,
  getMonthTicketInfo
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
import GLOBAL_PARAMS,{
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
    monthTicketQuantity: 0, // 现有月票数量
    monthTicketEndTime: "", // 有效期
    monthTicketDetail: null //月票详情
  };

  componentDidMount() {
    this._timer = setTimeout(() => {
      this._getMonthTicket();
      this._getMonthTicketList();
      this._getMonthTicketInfo();
      clearTimeout(this._timer);
    }, 400);
  }

  componentWillUnmount() {
    this._timer && clearTimeout(this._timer);
  }

  _getMonthTicketList() {
    getMonthTicketList()
      .then(data => {
        if (data.list.length > 0) {
          this.setState({
            monthTicketList: data.list,
            currentMonthTicketSelect: data.list[0]
          });
        } else {
          this.props.toast("暫無月票銷售");
        }
      })
      .catch(err => {
      });
  }

  _getMonthTicketInfo() {
    getMonthTicketInfo().then(data => {
      if(data.list) {
        this.setState({
          monthTicketDetail: data.data.list
        })
      }
    })
  }

  _createMonthTicket() {
    createMonthTicket(this.state.currentMonthTicketSelect.specId)
      .then(data => {
        if (data) {
          this.setState(
            {
              currentMonthTicketOrder: data
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
        this.props.toast("獲取數據失敗");
      });
  }

  _getMonthTicket() {
    getMonthTicket().then(data => {
      if(data) {
        let _date = new Date(data.endTime);
        this.setState({
          monthTicketQuantity: data.amount,
          monthTicketEndTime: [
            _date.getDate() + 1 < 10 ? `0${_date.getDate() + 1}` : _date.getDate(),
            _date.getMonth() + 1 < 10 ? `0${_date.getMonth() + 1}` : _date.getMonth(),
            _date.getFullYear(),
          ].join("/")
        });
      }
    })
  }

  _payMonthTicket(token, payment) {
    // const { callback } = this.props.navigation.state.params;
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
        this.state.currentPayType == SET_PAY_TYPE.apple_pay && this._paymentRequest && this._paymentRequest.complete("success");
        this._getMonthTicket();
        this.props.toast('購買成功');
      })
      .catch(err => {
        this._pullView && this._pullView.close();
        this.props.hideLoadingModal();
        this.props.toast("購買失敗");
        if(err.errCode == "20010") {
          this.props.navigation.navigate('Credit', {
            callback: () => {
              this.props.navigation.goBack()
            }
          });
        }
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
          {Platform.OS == 'ios' && (<CommonItem
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
          />)}
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

  _renderMonthTicketDetails() {
    return (
      <View style={[PurchaseMonthTicketStyles.topTitleView, {borderWidth: 1,borderColor: '#e8e9ed', borderRadius: em(4), padding: em(8),marginLeft: GLOBAL_PARAMS._winWidth * .03,marginRight: GLOBAL_PARAMS._winWidth * .03,marginBottom: em(5),marginTop: em(10)}]}>
        <View style={{justifyContent: 'space-between',height: em(65)}}>
          <Text style={PurchaseMonthTicketStyles.detailTitle}>我的月票</Text>
          <Text style={PurchaseMonthTicketStyles.detailSubTitle}>清晰把握可用月票</Text>
        </View>
        <View style={{justifyContent: 'space-between',height: em(65)}}>
          <Text style={PurchaseMonthTicketStyles.detailQuantity}>{this.state.monthTicketQuantity}張</Text>
          <Text style={PurchaseMonthTicketStyles.detailDate}>{this.state.monthTicketEndTime || '--'}到期</Text>
        </View>
      </View>
    )
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
        activeOpacity={0.8}
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
    const {monthTicketDetail} = this.state;
    return(
      <View style={PurchaseMonthTicketStyles.infoView}>
        <View style={PurchaseMonthTicketStyles.infoViewTop}>
          <View style={PurchaseMonthTicketStyles.grayDivider}></View>
          <Text style={PurchaseMonthTicketStyles.dividerText}>購買月票須知</Text>
          <View style={PurchaseMonthTicketStyles.grayDivider}></View>
        </View>
        <View style={PurchaseMonthTicketStyles.infoContent}>
          {
            monthTicketDetail.map((text, idx) => (
              <Text key={idx} style={PurchaseMonthTicketStyles.infoContentText}>{text}</Text>
            ))
          }
          {/* <Text style={PurchaseMonthTicketStyles.infoContentText}>1.月票只會在購買當天的一個月內有效</Text>
          <Text style={PurchaseMonthTicketStyles.infoContentText}>2.使用期限請查看支付方式的月票到期日</Text>
          <Text style={PurchaseMonthTicketStyles.infoContentText}>3.月票每日僅限使用一張</Text>
          <Text style={PurchaseMonthTicketStyles.infoContentText}>4.如有任何爭議，Mealtime有得食保留最終解釋權</Text> */}
        </View>
      </View>
    )
  }

  render() {
    const { monthTicketList, currentMonthTicketSelect, monthTicketQuantity, monthTicketDetail } = this.state;
    const confirmBtn = () => {
      const {isUsed, callback} = this.props.navigation.state.params;
      return (
        <TouchableOpacity style={{paddingRight: em(15), width: em(100)}} onPress={() => {
            if(typeof callback != 'undefined') {
              monthTicketQuantity == 0 ? callback(false) : callback(!isUsed);
            }
            this.props.navigation.goBack();}}>
          <Text style={{color: '#fff',fontSize: em(16),alignSelf: 'flex-end',}}>{isUsed ? '不使用' : '使用1張'}</Text>
        </TouchableOpacity>
      )
    };
    return (
      <CustomizeContainer.SafeView mode="linear">
        <CommonHeader title="購買月票" canBack hasRight={typeof this.props.navigation.state.params != "undefined" && monthTicketQuantity >= 0} rightElement={confirmBtn}/>
        <Content>
          {this._renderMonthTicketDetails()}
          {this._renderTopTitle()}
          {monthTicketList.length > 0 ? (
            monthTicketList.map((item, key) =>
              this._renderTicketItem(item, key)
            )
          ) : null}
          {monthTicketDetail?this._renderInfoView():null}
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
              disabled={monthTicketList.length == 0}
            >
              <Text style={PurchaseMonthTicketStyles.submitBtnText}>購買</Text>
            </TouchableOpacity>
          </Right>
        </Footer>
      </CustomizeContainer.SafeView>
    );
  }
}
