import React, { Component } from "react";
import { View, TouchableOpacity,StyleSheet,SectionList,Alert,RefreshControl,Platform,Image } from "react-native";
import {
  Container,
  Tabs,
  Tab,
  TabHeading,
} from "native-base";
import {NavigationActions} from 'react-navigation';
//Colors
import Colors from '../utils/Colors';
//utils
import GLOBAL_PARAMS,{EXPLAIN_PAY_TYPE} from '../utils/global_params';
import ToastUtil from '../utils/ToastUtil';
//api
import {myOrder,cancelOrder} from '../api/request';
//components
import ListFooter from '../components/ListFooter';
  import ErrorPage from '../components/ErrorPage';
import Loading from '../components/Loading';
import BlankPage from '../components/BlankPage';
import CommonHeader from '../components/CommonHeader';
import Text from '../components/UnScalingText';
//language
import I18n from '../language/i18n';
//styles
import MyOrderStyles from '../styles/myorder.style';
import CommonStyles from '../styles/common.style';

let requestParams = {
  status: {
    LOADING: 0,
    LOAD_SUCCESS: 1,
    LOAD_FAILED: 2,
    NO_MORE_DATA: 3
  },
  nextOffset: 0,
  currentOffset: 0
}

const _ORDER_LIST = {};
const _TAB_DELIVERING = 0;
const _TAB_FINISHED = 1;
const _TAB_CANCEL = 2;
const _TAB_ALL = 3;

const _ORDER_CANCEL = -1;
const _ORDER_DELIVERING = 1;
const _ORDER_FINISHED = 2;
const _ORDER_ALL = null;

export default class PeopleView extends Component {
  timer = null;
  _tabs = null;
  _current_tab = _TAB_DELIVERING;
  _delivering_list = [];
  _section_list = null;
  _is_mounted = true;

  constructor(props) {
    super(props);
    this.state = {
    orderlist: [],
    orderTips: '沒有您的訂單哦~',
    firstPageLoading: GLOBAL_PARAMS.httpStatus.LOADING,
    pullUpLoading: GLOBAL_PARAMS.httpStatus.LOADING,
    isError: false,
    refresh:false,
    isExpired: false,
    expiredMessage: null,
    currentTab: _TAB_DELIVERING,
    currentStatus: _ORDER_DELIVERING,
    i18n: I18n[this.props.screenProps.language],
    hasDelivering: false
    }
  }

  shouldComponentUpdate(nextProps,nextState) {
    // console.log('_',this._current_tab);
    // console.log('should',nextState.currentTab);
    // console.log('this',this.state.currentTab);
    if(!this._is_mounted) {
      return false;
    }
    if(this.state.firstPageLoading != nextState.firstPageLoading) {
      return true;
    }
    if(this.state.currentTab != this._current_tab) {
      return false;
    }
    return true;
  }

  componentDidMount() {
    if(!this._is_mounted) {
      return ;
    }
    this.timer = setTimeout(() => {
      this._getMyOrder(0, this.state.currentStatus);
      clearTimeout(this.timer);
    },700)
    // console.log('didmount myorder');
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
    this._is_mounted = false;
    this._paramsInit();
    // console.log('willunmount myorder');
  }
  
  //common function

  _paramsInit() {
    requestParams = {
      status: {
        LOADING: 0,
        LOAD_SUCCESS: 1,
        LOAD_FAILED: 2,
        NO_MORE_DATA: 3
      },
      nextOffset: 0,
      currentOffset: 0
    }
  }

  _getMyOrder (offset,status=null) {
    myOrder(offset,status).then(data => {
      if (data.ro.respCode == '0000') {
        if(data.data.length === 0){
          requestParams.nextOffset = requestParams.currentOffset
          if(this._is_mounted) {
            this.setState({
              orderlist: this.state.orderlist.concat(data.data),
              pullUpLoading: this.state.orderlist.length == 0 ? GLOBAL_PARAMS.httpStatus.NO_DATA:GLOBAL_PARAMS.httpStatus.NO_MORE_DATA,
              firstPageLoading: GLOBAL_PARAMS.httpStatus.LOAD_SUCCESS
            },() => console.log(this.state.pullUpLoading))
          }
          return
        }
        if(this._delivering_list.length == 0) {
          for(let i = 0;i<data.data.length;i++) {
            if(data.data[i].status == _ORDER_DELIVERING) {
              this._delivering_list.push(data.data[i].orderId)
            }
          }
          if(this._delivering_list.length > 0) {
            this.setState({
              hasDelivering: true
            });
          }
        }
        this.setState({
          orderlist: this.state.orderlist.concat(data.data),
          pullUpLoading:GLOBAL_PARAMS.httpStatus.LOADING,
          firstPageLoading: GLOBAL_PARAMS.httpStatus.LOAD_SUCCESS
        })
        requestParams.currentOffset = requestParams.nextOffset
      }else{
        ToastUtil.showWithMessage(data.ro.respMsg)
        if(data.ro.respCode == "10006" || data.ro.respCode == "10007") {
          this.props.screenProps.userLogout();
          this.props.navigation.goBack();
        }
        this.setState({
          isExpired: true,
          expiredMessage: data.ro.respMsg,
          pullUpLoading: GLOBAL_PARAMS.httpStatus.LOAD_FAILED
        })
      }
    },() => {
      requestParams.nextOffset = requestParams.currentOffset
      this.setState({
        pullUpLoading: GLOBAL_PARAMS.httpStatus.LOAD_FAILED
      })
    })
  }

  _cancelOrder(orderId, currentPayment) {
    let {i18n} = this.state;
    Alert.alert(
      i18n.tips,
      i18n.myorder_tips.common.cancel_order,
      [
        {text: i18n.cancel, onPress: () => {return null}, style: 'cancel'},
        {text: i18n.confirm, onPress: () => {
          this.setState({
            firstPageLoading: GLOBAL_PARAMS.httpStatus.LOADING
          })
          cancelOrder(orderId).then(data => {
            if(data.ro.respCode == '0000') {
              ToastUtil.showWithMessage(i18n.myorder_tips.success.cancel_order);
              this._onReloadPage();
              this._delivering_list.splice(this._delivering_list.indexOf(orderId),1);
              if(this._delivering_list.length == 0) {
                this.setState({
                  hasDelivering: false
                },() => {
                  this._getMyOrder(requestParams.offset, this.state.currentStatus);
                })
              }else {
                this._getMyOrder(requestParams.offset, this.state.currentStatus);
              }
            }else {
              ToastUtil.showWithMessage(data.ro.respMsg)
            }
          },() => {
            ToastUtil.showWithMessage(i18n.common_tips.err);
          })
        }},
      ],
      { cancelable: false }
    )
  }

  _onEndReach = () => {
    requestParams.nextOffset += 5
    this._getMyOrder(requestParams.nextOffset, this.state.currentStatus);
    console.log('onendreach',this.state.currentStatus);
  }

  _onErrorToRequestNextPage() {
    this.setState({
      pullUpLoading:GLOBAL_PARAMS.httpStatus.LOADING
    })
    requestParams.nextOffset += 5
    this._getMyOrder(requestParams.nextOffset)
  }

  _switchOrderStatus(status) {
    let {i18n} = this.state;
    switch(status) {
      case -1: return i18n.userCancel;
      case 0: return i18n.unconfirm;
      case 1: return i18n.delivering;
      case 2: return i18n.finish;
    }
  }

  _onRefreshToRequestFirstPageData() {
    this.timer = setTimeout(() => {
      this._onReloadPage();
      this._getMyOrder(requestParams.offset, this.state.currentStatus);
    },500)
  }

  _onReloadPage() {
    this._paramsInit();
    this.setState({
      refresh:false,
      orderlist: [],
      firstPageLoading: GLOBAL_PARAMS.httpStatus.LOADING
    })
  }

  _onChangeTabs(val) {
    if(this._tabs.state.currentPage == this.state.currentTab) {
      return;
    }
    this._current_tab = this._tabs.state.currentPage;
    this._onReloadPage();
    this.timer = setTimeout(() => {
      switch(this._tabs.state.currentPage) {
        case _TAB_DELIVERING: {this._getMyOrder(requestParams.offset,_ORDER_DELIVERING);this.setState({currentStatus:_ORDER_DELIVERING})}break;
        case _TAB_ALL: {this._getMyOrder(requestParams.offset);this.setState({currentStatus:_ORDER_ALL})}break;
        case _TAB_FINISHED: {this._getMyOrder(requestParams.offset, _ORDER_FINISHED);this.setState({currentStatus:_ORDER_FINISHED})}break;
        case _TAB_CANCEL: {this._getMyOrder(requestParams.offset, _ORDER_CANCEL);this.setState({currentStatus:_ORDER_CANCEL})}break;
      }
      this.setState({
        currentTab: this._tabs.state.currentPage
      })
      clearTimeout(this.timer);
    },500)
  }

  //render view
  _renderOrderListView = () => (
    <SectionList

      style={{overflow: 'hidden',}}
      ref={(s) => this._section_list = s}
      sections={[
        {title:'餐廳列表',data:this.state.orderlist},
      ]}
      renderItem = {({item,index}) => this._renderNewListItemView(item,index)}
      keyExtractor={(item, index) => index}
      onEndReachedThreshold={0.01}
      initialListSize={5}
      pageSize={5}
      onEndReached={() => this._onEndReach()}
      ListFooterComponent={() => (<ListFooter  loadingStatus={this.state.pullUpLoading} errorToDo={() => this._onErrorToRequestNextPage()} {...this.props}/>)}
      refreshControl={
        <RefreshControl
          refreshing={this.state.refresh}
          onRefresh={() => this._onRefreshToRequestFirstPageData()}
        />
      }
    />
  )

  _renderNewListItemView(item,index) {
    return (
      <View style={{marginTop: 10,padding: 20,backgroundColor:'#fff'}} key={index}>
        {this._renderFoodDetailView(item)}
        {this._renderPayView(item)}
        {this._renderTotalPriceView(item)}
      </View>
    )
  }

  _renderFoodDetailView(item) {
    let {i18n} = this.state;
    let _picture = !item.picture ? require('../asset/default_pic.png') : {uri:item.picture};
    return (
      <View style={MyOrderStyles.FoodContainer}>
      <Image style={MyOrderStyles.FoodImage}
                    reasizeMode="contain" source={_picture}
                  />
        <View style={MyOrderStyles.FoodInnerContainer}>
          <View style={MyOrderStyles.FoodTitleView}>
            <Text style={[CommonStyles.common_title_text,{maxWidth: GLOBAL_PARAMS.em(130)}]} numberOfLines={1}>{item.orderName}</Text>
            <View style={{flexDirection:'row',marginTop: -2}}>
              <Text style={[CommonStyles.common_title_text,{marginRight: 5}]}>{i18n.quantity}:</Text>
              <Text style={CommonStyles.common_important_text}>{item.amount}</Text>
            </View>
          </View>
          <View style={MyOrderStyles.FoodCommonView}>
            <Text style={CommonStyles.common_info_text}>{i18n.foodTime}</Text>
            <Text style={[CommonStyles.common_info_text,{maxWidth: GLOBAL_PARAMS.em(180)}]} numberOfLines={1}>{item.takeTimeNew}</Text>
          </View>
          <View style={MyOrderStyles.FoodCommonView}>
            <Text style={CommonStyles.common_info_text}>{i18n.foodAddress}</Text>
            <Text style={[CommonStyles.common_info_text,{maxWidth: GLOBAL_PARAMS.em(180)}]} numberOfLines={1}>{item.takeAddressDetail}</Text>
          </View>
        </View>
      </View>
    )
  }

  _renderPayView(item) {
    let _isDelivering = item.status === _ORDER_DELIVERING;
    let {i18n} = this.state;
    let {language} = this.props.screenProps;
    return (
      <View style={MyOrderStyles.payContainer}>
        <Text style={MyOrderStyles.paymentStatus}>{i18n.paymentStatus}</Text>
        <View style={MyOrderStyles.payInner}>
          <View style={MyOrderStyles.payTypeView}>
            <Text style={MyOrderStyles.payTypeText}>{EXPLAIN_PAY_TYPE[item.payment][language] || i18n.cash}</Text>
          </View>
          {_isDelivering ? <TouchableOpacity onPress={() => this._cancelOrder(item.orderId, EXPLAIN_PAY_TYPE[item.payment])} style={MyOrderStyles.payStatusBtn}>
            <Text style={MyOrderStyles.payStatusText}>{i18n.myorder_tips.common.cancel_order_btn}</Text>
          </TouchableOpacity> : null}
        </View>
      </View>
    )
  }

  _renderTotalPriceView(item) {
    let _isDelivering = item.status === _ORDER_DELIVERING;
    let {i18n} = this.state;
    return (
      <View style={MyOrderStyles.totalContainer}>
        <View style={{backgroundColor: 'transparent'}}>
            <Text style={MyOrderStyles.totalStatusText}>{this._switchOrderStatus(item.status)}</Text>
          </View>
       <View style={MyOrderStyles.totalInnerView}>
        <Text style={MyOrderStyles.totalUnitText}>{i18n.total} HKD</Text>
        <Text style={MyOrderStyles.totalPriceText}>{item.totalMoney}</Text>
       </View>
      </View>
    )
  }

  _renderCancelOrderView(item) {
    return (
      item.status === _ORDER_DELIVERING ? (
        <View style={{flexDirection:'row',justifyContent:'flex-end'}}>
          
        </View>
      ) : null
    )
  }

  _renderCommonListView(tab) {
    if(!this._is_mounted) return;
    return (
    <View style={{flex:1,backgroundColor:'#efefef'}}>
    {this.state.isExpired ? <BlankPage style={Platform.OS === 'ios' ?{marginTop:50}:{marginTop:0}} message={'T_T'+this.state.expiredMessage}/> : null}
      { this.state.orderlist.length > 0 ? 
        this._renderOrderListView() : null
      }
    </View>
  )}

  render() {
    let {i18n} = this.state;
    let _order_arr = [
      {title: i18n.delivering, tab: _TAB_DELIVERING, status: _ORDER_DELIVERING},
      {title: i18n.finished, tab: _TAB_FINISHED, status: _ORDER_FINISHED},
      {title: i18n.cancelOrder, tab: _TAB_CANCEL, status: _ORDER_CANCEL},
      {title: i18n.all, tab: _TAB_ALL, status: _ORDER_ALL},
    ];
    return (
      <Container style={{position: 'relative'}}>
        <CommonHeader hasMenu hasTabs title={i18n.myorder} {...this.props}/>
        <Tabs tabBarUnderlineStyle={MyOrderStyles.tabBarUnderlineStyle} 
        ref={ t=>this._tabs = t } onChangeTab={() => this._onChangeTabs()}>
          {
            _order_arr.map((item,key) => (
              <Tab key={key} heading={ <TabHeading style={MyOrderStyles.commonHeadering}><Text allowFontScaling={false} style={[MyOrderStyles.commonText,{fontWeight: this.state.currentStatus == item.status? '800':'normal',}]}>{item.title}</Text>
                {this.state.hasDelivering&&item.status == _ORDER_DELIVERING?<Image source={require('../asset/Oval.png')} style={MyOrderStyles.activeRedTips}/> : null}
              </TabHeading>}>
                {this.state.currentTab == item.tab ? this._renderCommonListView(item.tab) : null}
              </Tab>
            ))
          }
        </Tabs>
        {this.state.firstPageLoading === GLOBAL_PARAMS.httpStatus.LOADING ?
          <Loading style={Platform.OS == 'android' ? {marginTop:110} : {}}/> : (this.state.firstPageLoading === GLOBAL_PARAMS.httpStatus.LOAD_FAILED ?
            <ErrorPage errorTips={i18n.common_tips.reload} errorToDo={this._onErrorRequestFirstPage} {...this.props}/> : null)}
        {this.state.pullUpLoading == GLOBAL_PARAMS.httpStatus.NO_DATA ? <BlankPage style={{marginTop: Platform.OS=='ios'? 50:110}} message={'T_T'+i18n.common_tips.no_data} hasBottomBtn clickFunc={() => this.props.navigation.goBack()}/> : null}   
      </Container>
    );
  }
}
