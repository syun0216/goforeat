import React, { PureComponent } from 'react';
import {View, Image, Text, TouchableOpacity} from 'react-native';
import {Container, Content} from 'native-base';
//components
import CommonHeader from '../components/CommonHeader';
import CommonFlatList from '../components/CommonFlatList';
//styles
import CouponStyle from '../styles/coupon.style';
//api
import { myCoupon } from '../api/request';
//i18n
import I18n from '../language/i18n';

const effective = 1;
const used = 3;
const expired = 4;

export default class CouponView extends PureComponent{

  constructor(props) {
    super(props);
    this._from_confirm_order = typeof this.props.navigation.state.params != 'undefined'; // 从订单详情跳转过来
    this.state = {
      i18n: I18n[props.screenProps.language],
      refreshing: false
    }
  }

  _renderCouponItem(item, index) {
    const { condition,discount,endTime,deductionId,type,useStatus } = item;
    const _alreadyUsed = useStatus != effective;

    const useBtn = (
      <TouchableOpacity style={CouponStyle.UseBtn} onPress={() => {
        if(this._from_confirm_order) {
          this.props.navigation.state.params.callback(item);
        }
        this.props.navigation.goBack();
      }}>
        <Text style={CouponStyle.BtnText}>立即使用</Text>
      </TouchableOpacity>
    )

    const isUsed = (
      <Image source={require('../asset/used.png')} style={CouponStyle.StatusImg}/>
    )

    const isExpired = (
      <Image source={require('../asset/Invalid.png')} style={CouponStyle.StatusImg}/>
    )
    return (
      <View key={index} style={CouponStyle.CouponItemView}>
        <View style={[CouponStyle.ItemTop,_alreadyUsed?CouponStyle.isUsed: null]}>
          <View style={CouponStyle.PriceContainer}>
            <Text style={CouponStyle.Unit}>$</Text>
            <Text style={CouponStyle.Price}>{discount}</Text>
          </View>
          <View style={CouponStyle.Content}>
            <Text style={CouponStyle.ContentTop}>{condition > 0 ? `滿${condition}可用` : `無門檻使用`}</Text>
            <Text style={CouponStyle.ContentBottom}>優惠券</Text>
          </View>
          <View style={CouponStyle.Status}> 
            { useStatus == effective ? useBtn : useStatus == used ? isUsed : isExpired}
        </View>
        </View>
        <Image style={CouponStyle.CouponBorder} source={_alreadyUsed ? require('../asset/border_gray.png') : require('../asset/border.png')} resizeMode="contain"/>
        <View style={CouponStyle.ItemBottom}>
          <Text style={[CouponStyle.ItemBottomLeft,_alreadyUsed?CouponStyle.isUsedColor:null]}>{type}</Text>
          <Text style={[CouponStyle.ItemBottomRight,_alreadyUsed?CouponStyle.isUsedColor:null]}>有效期至{endTime}</Text>
        </View>
      </View>
    )
  }

  render() {
    let Header = () => (
      <CommonHeader hasMenu={!this._from_confirm_order} canBack={this._from_confirm_order} title="我的優惠券"/>
    )

    const isHeaderHide = typeof this.props.hideHeader !== undefined;
    // console.log(this.props.hideHeader);
    return (
      <Container>
        <Header />
          <CommonFlatList
            style={{backgroundColor: '#efefef'}}
            requestFunc={myCoupon}
            renderItem={(item,index) => this._renderCouponItem(item,index)}
            {...this.props}
            />
      </Container>
    )
  }
}