import React, { Component } from "react";
import { View, TouchableOpacity, Alert, Platform, Image } from "react-native";
import { Container, Tabs, Tab, TabHeading } from "native-base";
import Antd from "react-native-vector-icons/AntDesign";
import PopupDialog, {
  SlideAnimation,
  DialogButton
} from "react-native-popup-dialog";
import FastImage from "react-native-fast-image";
//utils
import GLOBAL_PARAMS, {
  EXPLAIN_PAY_TYPE,
  isEmpty
} from "../utils/global_params";
import ToastUtil from "../utils/ToastUtil";
//api
import { myOrder, cancelOrder, popupComment } from "../api/request";
//components
import CommonHeader from "../components/CommonHeader";
import Text from "../components/UnScalingText";
import CommonFlatList from "../components/CommonFlatList";
import CustomizeContainer from "../components/CustomizeContainer";
import CommonComment from "../components/CommonComment";
//utils
import { em } from "../utils/global_params";
import Colors from "../utils/Colors";
//language
import I18n from "../language/i18n";
//styles
import MyOrderStyles from "../styles/myorder.style";
import CommonStyles from "../styles/common.style";

const _TAB_DELIVERING = 0; //待配送
const _TAB_FINISHED = 1; // 已完成
const _TAB_CANCEL = 2; // 已取消
const _TAB_ALL = 3; // 全部订单
const _TAB_COMMENT = 1; // 待评价

const _ORDER_CANCEL = -1; // 用户取消
const _ORDER_DELIVERING = 1; // 待配送
const _ORDER_FINISHED = 2; //已完成
const _ORDER_ALL = null; // 全部
const _ORDER_COMMENT = 3; // 待评价

const slideAnimation = new SlideAnimation({
  slideFrom: "bottom"
});

export default class PeopleView extends Component {
  timer = null;
  _tabs = null;
  _commentView = null;
  _current_tab = _TAB_DELIVERING;
  _delivering_list = [];
  _section_list = null;
  _is_mounted = true;

  constructor(props) {
    super(props);
    this.state = {
      currentTab: _TAB_DELIVERING,
      currentStatus: _ORDER_DELIVERING,
      currentPickImage: null,
      currentPickTitle: "",
      i18n: I18n[props.screenProps.language],
      hasDelivering: false,
      listCount: 0
    };
  }

  //private function

  _cancelOrder(orderId, currentPayment, status) {
    let { i18n, currentTab } = this.state;
    const cancelRefresh = () => {
      if (!isEmpty(this[`${_TAB_ALL}flatlist`])) {
        this[`${_TAB_ALL}flatlist`].outSideRefresh();
      }
      this[`${_TAB_DELIVERING}flatlist`].outSideRefresh();
    };
    Alert.alert(
      i18n.tips,
      i18n.myorder_tips.common.cancel_order,
      [
        {
          text: i18n.cancel,
          onPress: () => {
            return null;
          },
          style: "cancel"
        },
        {
          text: i18n.confirm,
          onPress: () => {
            cancelOrder(orderId).then(
              data => {
                if (data.ro.respCode == "0000") {
                  ToastUtil.showWithMessage(
                    i18n.myorder_tips.success.cancel_order
                  );

                  cancelRefresh();
                } else {
                  ToastUtil.showWithMessage(data.ro.respMsg);
                }
              },
              () => {
                ToastUtil.showWithMessage(i18n.common_tips.err);
              }
            );
          }
        }
      ],
      { cancelable: false }
    );
  }

  _switchOrderStatus(status) {
    let { i18n } = this.state;
    switch (status) {
      case -1:
        return i18n.userCancel;
      case 0:
        return i18n.unconfirm;
      case 1:
        return i18n.delivering;
      case 2:
        return i18n.finish;
      case 3: 
        return i18n.uncomment
    }
  }

  _onChangeTabs(val) {
    if (this._tabs.state.currentPage == this.state.currentTab) {
      return;
    }
    this.setState({
      currentTab: this._tabs.state.currentPage
    });
  }

  _getListCount(count, tab) {
    if (tab != _TAB_DELIVERING) return;
    this.setState({
      listCount: count
    });
  }

  //render view

  _renderNewListItemView(item, index) {
    return (
      <View style={{ padding: 20, backgroundColor: "#fff" }} key={index}>
        {this._renderFoodDetailView(item)}
        {this._renderPayView(item)}
        {this._renderTotalPriceView(item)}
      </View>
    );
  }

  _renderFoodDetailView(item) {
    let { i18n } = this.state;
    let { language } = this.props.screenProps;
    let _picture = !item.picture
      ? require("../asset/default_pic.png")
      : { uri: item.picture };
    return (
      <View style={[MyOrderStyles.FoodContainer,{height: item.addAmount ? em(120) : (110)}]}>
        <FastImage
          style={MyOrderStyles.FoodImage}
          reasizeMode={FastImage.resizeMode.contain}
          source={_picture}
        />
        <View style={MyOrderStyles.FoodInnerContainer}>
          <View style={MyOrderStyles.FoodTitleView}>
            <View>
              <Text
                style={[
                  CommonStyles.common_title_text,
                  { maxWidth: GLOBAL_PARAMS.em(150) }
                ]}
                numberOfLines={1}
              >
                {item.orderName}
              </Text>
            </View>
            <View style={{ flexDirection: "row"}}>
              <Text
                style={[CommonStyles.common_title_text, { marginRight: 5 }]}
              >
                ×
              </Text>
              <Text style={CommonStyles.common_important_text}>
                {item.amount}
              </Text>
            </View>
          </View>
          {
            item.addAmount ? (
              <View style={[MyOrderStyles.FoodTitleView]}>
                <Text style={CommonStyles.common_title_text}>{item.addName}</Text>
                <View style={{ flexDirection: "row"}}>
                  <Text
                    style={[CommonStyles.common_title_text, { marginRight: 5 }]}
                  >
                    ×
                  </Text>
                  <Text style={CommonStyles.common_important_text}>
                    {item.addAmount}
                  </Text>
                </View>
              </View>
            ) : null
          }
          <View style={MyOrderStyles.FoodCommonView}>
            <Text style={CommonStyles.common_info_text}>{i18n.foodTime}</Text>
            <Text
              style={[
                CommonStyles.common_info_text,
                { maxWidth: GLOBAL_PARAMS.em(180) }
              ]}
              numberOfLines={1}
            >
              {item.takeTimeNew}
            </Text>
          </View>
          <View style={MyOrderStyles.FoodCommonView}>
            <Text style={CommonStyles.common_info_text}>
              {i18n.foodAddress}
            </Text>
            <TouchableOpacity onPress={() => {
                this.setState(
                  {
                    currentPickImage: item.takePointPicture,
                    currentPickTitle: item.takeAddressDetail || ""
                  },
                  () => {
                    this.popupDialog.show();
                  }
                );
              }} style={{flexDirection: "row"}}>
              <Text
                style={[
                  CommonStyles.common_info_text,
                  { maxWidth: GLOBAL_PARAMS.em(130), color: Colors.main_orange },
                ]}
                numberOfLines={1}
              >
                {item.takeAddressDetail}
              </Text>
              <Antd name="doubleright" style={{color: Colors.main_orange, marginTop:  Platform.OS == 'ios' ? em(2) : em(4)}}/>
            </TouchableOpacity>  

          </View>
          <View style={MyOrderStyles.FoodCommonView}>
            <Text style={CommonStyles.common_info_text}>
              {i18n.paymentStatus}
            </Text>
            <Text
              style={[
                CommonStyles.common_info_text,
                { maxWidth: GLOBAL_PARAMS.em(180) }
              ]}
              numberOfLines={1}
            >
              {EXPLAIN_PAY_TYPE[item.payment || 1][language] || i18n.cash}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  _renderPayView(item) {
    let _isDelivering = item.status === _ORDER_DELIVERING;
    let { i18n } = this.state;

    return (
      <View style={MyOrderStyles.payContainer}>
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <Text>取餐號:</Text>
          <Text style={MyOrderStyles.pickNumber}>{item.mealCode}</Text>
        </View>
        <View style={MyOrderStyles.payInner}>
          {/* <TouchableOpacity
              onPress={() => {
                this.setState(
                  {
                    currentPickImage: item.takePointPicture,
                    currentPickTitle: item.takeAddressDetail || ""
                  },
                  () => {
                    this.popupDialog.show();
                  }
                );
              }}
              style={[MyOrderStyles.payStatusBtn, { borderColor: "#ff5858" }]}
            >
            <Text style={[MyOrderStyles.payStatusText, { color: "#ff5858" }]}>
              {i18n.myorder_tips.common.pick_place_btn}
            </Text>
          </TouchableOpacity> */}
          <View style={[MyOrderStyles.totalInnerView, item.status == _ORDER_ALL || item.status == _ORDER_CANCEL && {
            position: 'absolute',
            right: 0,
            bottom: em(-20)
          }]}>
            <Text style={MyOrderStyles.totalUnitText}>{i18n.total} HKD</Text>
            <Text style={MyOrderStyles.totalPriceText}>{item.totalMoney}</Text>
          </View>
        </View>
      </View>
    );
  }

  _renderTotalPriceView(item) {
    let _isDelivering = item.status === _ORDER_DELIVERING;
    let _isCommenting = item.status == _ORDER_COMMENT;
    let { i18n } = this.state;
    return (
      <View style={MyOrderStyles.totalContainer}>
        <View style={{ backgroundColor: "transparent" }}>
          <Text style={MyOrderStyles.totalStatusText}>
            {this._switchOrderStatus(item.status)}
          </Text>
        </View>
        {_isDelivering && (
            <TouchableOpacity
              onPress={() =>
                this._cancelOrder(
                  item.orderId,
                  EXPLAIN_PAY_TYPE[item.payment],
                  item.status
                )
              }
              style={MyOrderStyles.payStatusBtn}
            >
              <Text style={MyOrderStyles.payStatusText}>
                {i18n.myorder_tips.common.cancel_order_btn}
              </Text>
            </TouchableOpacity>
          )}
        {_isCommenting && (
            <TouchableOpacity
              onPress={() =>
                {
                  // console.log(this._commentView);
                  // console.log(item);
                  this._commentView._commentPopup(item.orderId, () => {

                  })
                }
              }
              style={[MyOrderStyles.payStatusBtn, {borderColor: '#ff5050',}]}
            >
              <Text style={[MyOrderStyles.payStatusText, {color: '#ff5050'}]}>
                評論得優惠券
              </Text>
            </TouchableOpacity>
          )}
      </View>
    );
  }

  _renderPopupDialog() {
    return (
      <PopupDialog
        ref={popupDialog => {
          this.popupDialog = popupDialog;
        }}
        width={em(295)}
        height={em(270)}
        dialogAnimation={slideAnimation}
        dialogTitle={
          <Text style={{ textAlign: "center", margin: em(10) }}>
            {this.state.currentPickTitle}
          </Text>
        }
        actions={[
          <DialogButton
            key={0}
            textStyle={{ color: "#fff" }}
            text="關閉"
            onPress={() => {
              this.popupDialog.dismiss();
            }}
          />
        ]}
      >
        <FastImage
          source={this.state.currentPickImage ? { uri: this.state.currentPickImage }: require("../asset/gardenListDefault.png")}
          style={{ width: em(295), height: em(250), borderBottomLeftRadius: 8,borderBottomRightRadius: 8, }}
        />
      </PopupDialog>
    );
  }

  render() {
    let { i18n, listCount } = this.state;
    let _order_arr = [
      {
        title: i18n.delivering,
        tab: _TAB_DELIVERING,
        status: _ORDER_DELIVERING
      },
      { title: i18n.commented, tab: _TAB_COMMENT, status: _ORDER_COMMENT },
      { title: i18n.cancelOrder, tab: _TAB_CANCEL, status: _ORDER_CANCEL },
      { title: i18n.all, tab: _TAB_ALL, status: _ORDER_ALL }
    ];
    return (
      <CustomizeContainer.SafeView mode="linear" style={{ position: "relative" }}>
        {this._renderPopupDialog()}
        <CommonHeader canBack hasTabs title={i18n.myorder} />
        <Tabs
          tabBarUnderlineStyle={MyOrderStyles.tabBarUnderlineStyle}
          ref={t => (this._tabs = t)}
          onChangeTab={() => this._onChangeTabs()}
        >
          {_order_arr.map((item, key) => (
            <Tab
              key={key}
              heading={
                <TabHeading style={MyOrderStyles.commonHeadering}>
                  <Text
                    allowFontScaling={false}
                    style={[
                      MyOrderStyles.commonText,
                      {
                        fontWeight:
                          this.state.currentTab == item.tab ? "800" : "normal"
                      }
                    ]}
                  >
                    {item.title}
                  </Text>
                  {listCount > 0 && item.status == _ORDER_DELIVERING ? (
                    <Image
                      source={require("../asset/Oval.png")}
                      style={MyOrderStyles.activeRedTips}
                    />
                  ) : null}
                </TabHeading>
              }
            >
              <CommonFlatList
                style={{ backgroundColor: "#efefef" }}
                ref={cfl => (this[`${item.tab}flatlist`] = cfl)}
                requestFunc={myOrder}
                extraParams={{ status: item.status }}
                renderItem={(index, item) =>
                  this._renderNewListItemView(index, item)
                }
                isBlankInfoBtnShow
                isItemSeparatorShow
                blankBtnMessage={i18n.common_tips.no_data}
                blankBtnFunc={() => this.props.navigation.goBack()}
                getCount={count => this._getListCount(count, item.tab)}
                {...this.props}
              />
            </Tab>
          ))}
        </Tabs>
        <CommonComment ref={c => this._commentView = c} callback={() => {
          this[`${_TAB_COMMENT}flatlist`].outSideRefresh();
          ToastUtil.showWithMessage("添加評論成功!");
        }}/>
      </CustomizeContainer.SafeView>
    );
  }
}
