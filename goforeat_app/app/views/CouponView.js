import React, { PureComponent } from 'react';
import {View, Image, Text, TouchableOpacity} from 'react-native';
import {Container, Content} from 'native-base';
//components
import CommonHeader from '../components/CommonHeader';
//styles
import CouponStyle from '../styles/coupon.style';

const effective = 1;
const used = 2;
const expired = 3;

export default class CouponView extends PureComponent{

  _renderCouponItem(status = effective) {
    const _alreadyUsed = status != effective;

    const useBtn = (
      <TouchableOpacity style={CouponStyle.UseBtn}>
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
      <View style={CouponStyle.CouponItemView}>
        <View style={[CouponStyle.ItemTop,_alreadyUsed?CouponStyle.isUsed: null]}>
          <View style={CouponStyle.PriceContainer}>
            <Text style={CouponStyle.Unit}>$</Text>
            <Text style={CouponStyle.Price}>10</Text>
          </View>
          <View style={CouponStyle.Content}>
            <Text style={CouponStyle.ContentTop}>滿100可用</Text>
            <Text style={CouponStyle.ContentBottom}>優惠券</Text>
          </View>
          <View style={CouponStyle.Status}> 
            { status == effective ? useBtn : status == used ? isUsed : isExpired}
          </View>
        </View>
        <Image style={CouponStyle.CouponBorder} source={_alreadyUsed ? require('../asset/border_gray.png') : require('../asset/border.png')} resizeMode="contain"/>
        <View style={CouponStyle.ItemBottom}>
          <Text style={[CouponStyle.ItemBottomLeft,_alreadyUsed?CouponStyle.isUsedColor:null]}>麥當勞中環店</Text>
          <Text style={[CouponStyle.ItemBottomRight,_alreadyUsed?CouponStyle.isUsedColor:null]}>有效期至2018/09/23</Text>
        </View>
      </View>
    )
  }

  render() {
    return (
      <Container>
        <CommonHeader title="我的優惠券" hasMenu {...this.props}/>
        <Content style={CouponStyle.CouponContainer}>
          {this._renderCouponItem(effective)}
          {this._renderCouponItem(used)}
          {this._renderCouponItem(expired)}
        </Content>
      </Container>
    )
  }
}