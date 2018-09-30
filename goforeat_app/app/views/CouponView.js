import React, { PureComponent } from 'react';
import {View, Image, Text, TouchableOpacity, FlatList, RefreshControl} from 'react-native';
import {Container, Content} from 'native-base';
//components
import CommonHeader from '../components/CommonHeader';
import Loading from '../components/Loading';
import ListFooter from '../components/ListFooter';
import ErrorPage from '../components/ErrorPage';
import BlankPage from '../components/BlankPage';
//styles
import CouponStyle from '../styles/coupon.style';
//api
import { myCoupon } from '../api/request';
//utils
import ToastUtil from '../utils/ToastUtil';
import GLOBAL_PARAMS from '../utils/global_params';
//i18n
import I18n from '../language/i18n';

const effective = 1;
const used = 3;
const expired = 4;

let requestParams = {
  nextOffset: 0,
  currentOffset: 0
};

const { httpStatus: {LOADING, LOAD_SUCCESS, LOAD_FAILED, NO_DATA, NO_MORE_DATA} } = GLOBAL_PARAMS;

export default class CouponView extends PureComponent{

  constructor(props) {
    super(props);
    this.state = {
      couponList: [],
      i18n: I18n[props.screenProps.language],
      loadingStatus: {
        first: LOADING,
        next: LOADING
      },
      refreshing: false
    }
  }

  componentDidMount() {
    this._requestFirstPage();
  }

  getCoupon(offset, successCallback, failCallback) {
    myCoupon(offset).then(data => {
      if(data.ro.ok) {
        successCallback(data.data);
      } else{
        if(data.ro.respCode == "10006" || data.ro.respCode == "10007") {
          this.props.screenProps.userLogout();
          this.props.navigation.goBack();
        }
        ToastUtil.showWithMessage(data.ro.respMsg);
        failCallback && failCallback()
      }
    }, () => {
      ToastUtil.showWithMessage(i18n.common_tips.network_err);
    });
  }

  _requestFirstPage() {
    this.getCoupon(requestParams.nextOffset, (data) => {
      if(data.length == 0) {
        this.setState({
          loadingStatus: {
            first: NO_DATA
          }
        });
        return;
      }
      this.setState({
        couponList: data,
        loadingStatus: {
          first: LOAD_SUCCESS
        },
        refreshing: false
      });
    },() => {
      this.setState({
        loadingStatus: {
          first: LOAD_FAILED
        }
      });
    });
  }

  _requestNextPage() {
    this.getCoupon(requestParams.nextOffset, data => {
      if(data.length == 0) {
        requestParams.nextOffset = requestParams.currentOffset;
        let _temp = Object.assign({next: NO_MORE_DATA}, this.state.loadingStatus);
        this.setState({
          loadingStatus: _temp,
          couponList: this.state.couponList.concat(data),
        });
        return;
      }
      this.setState({
        couponList: this.state.couponList.concat(data),
        loadStatus: {
          next: LOADING
        }
      });
      requestParams.currentOffset = requestParams.nextOffset;
    });
  }

  _onRefreshToRequestFirstPageData() {
    this.setState({
      refreshing: true
    }, () => {
      requestParams.currentOffset = 0;
      requestParams.currentOffset = 0;
      this._requestFirstPage(0);
    });
  }

  _onErrorRequestFirstPage() {
    this.setState({
      loadingStatus: {
        first: LOADING
      }
    });
    this._requestFirstPage(0);
  }

  _onErrorToRequestNextPage() {
    this.setState({
      loadingStatus:{
        next:LOADING
      }
    })
    requestParams.nextOffset += 5;
    this._requestNextPage();
  }

  _onEndReach() {
    requestParams.nextOffset += 5;
    if(this.state.loadingStatus.next == NO_MORE_DATA) return;
    this._requestNextPage();
  }

  _renderCouponList() {
    const { loadingStatus: {next} } = this.state;
    return (
      <FlatList 
        data={this.state.couponList}
        renderItem={({item, index}) => this._renderCouponItem(item, index)}
        keyExtractor={(item,index) => index}
        onEndReachedThreshold={0.01}
        onEndReached={() => this._onEndReach()}
        ListFooterComponent={() =>(
          <ListFooter loadingStatus={next} errorToDo={() => this._onErrorToRequestNextPage()} {...this.props}/>
        )}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={() => this._onRefreshToRequestFirstPageData()}
          />
        }
      />
    )
  }

  _renderCouponItem(item, index) {
    const { condition,discount,endTime,deductionId,type,useStatus } = item;
    const _alreadyUsed = useStatus != effective;

    const useBtn = (
      <TouchableOpacity style={CouponStyle.UseBtn} onPress={() => this.props.navigation.goBack()}>
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
            <Text style={CouponStyle.ContentTop}>滿{condition}可用</Text>
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
    const { loadingStatus: {first}, i18n } = this.state
    const Error = () => (
      <ErrorPage errorTips={i18n.common_tips.network_err} errorToDo={this._onErrorRequestFirstPage}/>
    )
    const Blank = () => (
      <BlankPage message={i18n.common_tips.no_data}/>
    )
    let Header = () => (
      <CommonHeader title="我的優惠券" hasMenu {...this.props}/>
    )

    const isHeaderHide = typeof this.props.hideHeader !== undefined;
    console.log(this.props.hideHeader);
    return (
      <Container>
        { !isHeaderHide ? <Header /> : null }
        <Content style={CouponStyle.CouponContainer}>
          { first == LOADING ? <Loading /> : null }
          { first == LOAD_FAILED ?  <Error /> : null }
          { first == NO_DATA ?  <Blank /> : null}
          { first == LOAD_SUCCESS ? this._renderCouponList() : null }
        </Content>
      </Container>
    )
  }
}