import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Overlay } from "teaset";
import { View, Text, Image, Platform, TouchableOpacity } from "react-native";
import {connect} from 'react-redux';
//store
import store from '../store';
//actions
import {SHOW_LOADING_MODAL, HIDE_LOADING_MODAL} from '../actions';
//components
import CommonItem from "./CommonItem";
import LoadingModal from "./LoadingModal";
//utils
import {
  stripe_api_key,
  merchant_id,
  SET_PAY_TYPE,
  em
} from "../utils/global_params";
//style
import PurchaseMonthTicketStyles from "../styles/purchasemonthticket.style";
import PaySettingStyles from "../styles/paysetting.style";


const CHECKED = require("../asset/checked.png");
const UNCHECKED = require("../asset/unchecked.png");

class OnlineBuyingModel{
  _overlayViewKey = null;
  _overlayView = null;
  _paymentRequest = null;
  currentPayType = SET_PAY_TYPE.credit_card;
  _title = null;
  _total = null;
  _callback = () => {};
  constructor(title, total, callback) {
    this._title  = title;
    this._total = total;
    this._callback = callback;
  }

  _showOverlay() {
    this._overlayViewKey = Overlay.show(this.render());
  }

  _hideOverlay() {
    this._overlayView && this._overlayView.close();
  }

  _checked(paytype) {
    if (this.currentPayType == paytype) {
      return;
    }
    this.currentPayType = paytype;
    Overlay.hide(this._overlayViewKey);
    this._overlayViewKey = Overlay.show(this.render());
  }

  _showItemChecked(paytype) {
    if (this.currentPayType == paytype) {
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

  _payWithApplePay() {
    const { _total, _title, _callback } = this;
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
          label: _title,
          amount: { currency: "HKD", value: _total }
        }
      ],
      total: {
        label: "Goforeat Technoloy Limited",
        amount: { currency: "HKD", value: _total }
      }
    };
    store.dispatch({type:SHOW_LOADING_MODAL});
    const paymentRequest = new PaymentRequest(supportedMethods, details);
    paymentRequest
      .show()
      .then(res => {
        if (res.details && res.details.paymentToken) {
          _callback(
            // res.details.paymentToken,
            res,
            SET_PAY_TYPE.apple_pay
          );
        }
      })
      .catch(e => {
        store.dispatch({type:HIDE_LOADING_MODAL});
        paymentRequest.abort();
      });
  }

  _payWithCreditCard() {
    this._callback(null, SET_PAY_TYPE.credit_card);
  }

  render() {
    const { _title, _total } = this;
    return (
      <Overlay.PullView
        ref={overlay => {
          this._overlayView = overlay;
          // _ref(overlay);
        }}
        side="bottom"
        modal={false}
      >
        <View style={PurchaseMonthTicketStyles.confirmView}>
          <View style={PurchaseMonthTicketStyles.confirmTopTitle}>
            <Text style={PurchaseMonthTicketStyles.confirmTopTitleText}>
              {_title}
            </Text>
            <Text style={PurchaseMonthTicketStyles.confirmTopTitleText}>
              HKD {_total}
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
            {Platform.OS == "ios" && (
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
            )}
          </View>
          <View style={PurchaseMonthTicketStyles.confirmOrderBar}>
            <TouchableOpacity
              style={PurchaseMonthTicketStyles.payBtn}
              onPress={() => {
                if (this.currentPayType == SET_PAY_TYPE.credit_card) {
                  this._payWithCreditCard();
                } else {
                  this._payWithApplePay();
                }
              }}
            >
              <Text style={PurchaseMonthTicketStyles.submitBtnText}>
                去支付
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Overlay.PullView>
    );
  }
}

const stateToModel = () => {};

const dispatchToModel = dispatch => ({
  showLoadingModal: () => dispatch({type: SHOW_LOADING_MODAL}),
  hideLoadingModal: () => dispatch({type: HIDE_LOADING_MODAL}),
  dispatch
});

export default OnlineBuyingModel;