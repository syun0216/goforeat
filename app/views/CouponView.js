import React, { PureComponent } from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import { isEmpty } from "lodash";
import { Container, Content, Icon, Item, Input } from "native-base";
import PopupDialog,{SlideAnimation,DialogButton} from 'react-native-popup-dialog';
import LottieView from "lottie-react-native";
//components
import CommonHeader from "../components/CommonHeader";
import CommonFlatList from "../components/CommonFlatList";
import CustomizeContainer from "../components/CustomizeContainer";
//styles
import CouponStyle from "../styles/coupon.style";
//api
import { myCoupon, getCoupon } from "../api/request";
//i18n
import I18n from "../language/i18n";
//utils
import GLOBAL_PARAMS, { em } from "../utils/global_params";

const effective = 1;
const used = 3;
const expired = 4;

const slideAnimation = new SlideAnimation({
  slideFrom: "bottom"
});

export default class CouponView extends PureComponent {
  _exchangeCode = '';
  state= {
    exchangeCodeRes: null
  };
  constructor(props) {
    super(props);
    this._from_confirm_order =
      typeof this.props.navigation.state.params != "undefined"; // 从订单详情跳转过来
  }

  //api
  _getCoupon = () => {
    if(this._exchangeCode == '') {
      this.props.toast('請填寫優惠碼');
      return ;
    };
    
    this.props.showLoadingModal && this.props.showLoadingModal();
    getCoupon(this._exchangeCode).then(data => {
      this.props.hideLoadingModal && this.props.hideLoadingModal();
      if(data.ro.ok) {
        this.popupDialog.show();
        this.setState({
          exchangeCodeRes: data.data
        },() => {
          this._lv&&this._lv.play();
        })
      }else {
        this.props.toast(data.ro.respMsg);
      }
    })
  }

  _getExchangeCode = code => {
    this._exchangeCode = code;
  }

  _renderSearchBar() {
    return (
      <Item style={{ paddingLeft: em(8), paddingRight: em(5),backgroundColor: '#fff' }}>
        <Input 
          placeholder="輸入優惠碼"
          allowFontScaling={false}
          clearButtonMode="while-editing"
          onChangeText={code => this._getExchangeCode(code)}
         />
        <TouchableOpacity onPress={this._getCoupon} style={{width: em(50),alignItems: 'flex-end',}}>
          <Icon name="md-return-right" style={{ color: "#666" }} />
        </TouchableOpacity>
      </Item>
    );
  }

  _renderCouponItem(item, index) {
    const { condition, discount, endTime, deductionId, type, useStatus } = item;
    const _alreadyUsed = useStatus != effective;
    const {goBack, state:{params}} = this.props.navigation;

    const useBtn = (
      <TouchableOpacity
        style={CouponStyle.UseBtn}
        onPress={() => {
          if (this._from_confirm_order) {
            params.callback && params.callback(item);
          }
          goBack();
        }}
      >
        <Text style={CouponStyle.BtnText}>立即使用</Text>
      </TouchableOpacity>
    );

    const isUsed = (
      <Image
        source={require("../asset/used.png")}
        style={CouponStyle.StatusImg}
      />
    );

    const isExpired = (
      <Image
        source={require("../asset/Invalid.png")}
        style={CouponStyle.StatusImg}
      />
    );
    return (
      <View key={index} style={CouponStyle.CouponItemView}>
        <View
          style={[
            CouponStyle.ItemTop,
            _alreadyUsed ? CouponStyle.isUsed : null
          ]}
        >
          <View style={CouponStyle.PriceContainer}>
            <Text style={CouponStyle.Unit}>$</Text>
            <Text style={CouponStyle.Price}>{discount}</Text>
          </View>
          <View style={CouponStyle.Content}>
            <Text style={CouponStyle.ContentTop}>
              {condition > 0 ? `滿${condition}可用` : `無門檻使用`}
            </Text>
            <Text style={CouponStyle.ContentBottom}>優惠券</Text>
          </View>
          <View style={CouponStyle.Status}>
            {useStatus == effective
              ? useBtn
              : useStatus == used
              ? isUsed
              : isExpired}
          </View>
        </View>
        <Image
          style={CouponStyle.CouponBorder}
          source={
            _alreadyUsed
              ? require("../asset/border_gray.png")
              : require("../asset/border.png")
          }
          resizeMode="contain"
        />
        <View style={CouponStyle.ItemBottom}>
          <Text
            style={[
              CouponStyle.ItemBottomLeft,
              _alreadyUsed ? CouponStyle.isUsedColor : null
            ]}
          >
            {type}
          </Text>
          <Text
            style={[
              CouponStyle.ItemBottomRight,
              _alreadyUsed ? CouponStyle.isUsedColor : null
            ]}
          >
            有效期至{endTime}
          </Text>
        </View>
      </View>
    );
  }

  _renderGiftCoupon() {
    const {exchangeCodeRes} = this.state;
    return(
      <PopupDialog
        ref={popupDialog => {
          this.popupDialog = popupDialog;
        }}
        width={GLOBAL_PARAMS._winWidth*.9}
        height={em(340)}
        dialogAnimation={slideAnimation}
        onDismissed={() => {
          this._commonFlatList && this._commonFlatList.outSideRefresh();
        }}
        // dialogTitle={
        //   <Text style={{ textAlign: "center", margin: em(10) }}>
        //     {this.state.currentPickTitle}
        //   </Text>
        // }
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
        <LottieView
          ref={lv => (this._lv = lv)}
          autoPlay={true}
          style={{ width: em(180), height: em(180), alignSelf: 'center', }}
          source={require("../animations/newAnimation.json")}
          loop={false}
          enableMergePathsAndroidForKitKatAndAbove
        />
        {exchangeCodeRes !=null&&this._renderCouponItem(exchangeCodeRes, 1)}
      </PopupDialog>
    )
  }

  render() {
    let Header = () => (
      <CommonHeader
        // hasMenu={!this._from_confirm_order}
        // canBack={this._from_confirm_order}
        canBack
        title={this.props.i18n.coupon_tips.title}
      />
    );

    const isHeaderHide = typeof this.props.hideHeader !== undefined;
    let payMoney = null;
    if(!isEmpty(this.props.navigation.state.params) && typeof this.props.navigation.state.params.payMoney != "undefined") {
      payMoney = this.props.navigation.state.params.payMoney;
    }
    return (
      <CustomizeContainer.SafeView mode="linear" style={{ backgroundColor: "#efefef" }}>
        <Header />
        {this._renderSearchBar()}
        {this._renderGiftCoupon()}
        <CommonFlatList
          ref={cf => this._commonFlatList = cf}
          requestFunc={myCoupon}
          extraParams={{payMoney}}
          renderItem={(item, index) => this._renderCouponItem(item, index)}
          {...this.props}
        />
      </CustomizeContainer.SafeView>
    );
  }
}
