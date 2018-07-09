import React, { Component } from "react";
import { View, Text, TouchableOpacity,StyleSheet,SectionList,Image,Alert,RefreshControl,Platform } from "react-native";
import {
  Container,
  Tabs,
  Tab,
  TabHeading,
} from "native-base";
//Colors
import Colors from '../utils/Colors'
//utils
import GLOBAL_PARAMS from '../utils/global_params'
import ToastUtil from '../utils/ToastUtil'
//api
import api from '../api'
//components
import ListFooter from '../components/ListFooter';
import ErrorPage from '../components/ErrorPage';
import Loading from '../components/Loading';
import BlankPage from '../components/BlankPage';
import CommonHeader from '../components/CommonHeader';
//language
import i18n from '../language/i18n';
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
const _TAB_FINISHED = 0;
const _TAB_DELIVERING = 1;
const _TAB_CANCEL = 2;

const _ORDER_CANCEL = -1;
const _ORDER_DELIVERING = 1;
const _ORDER_FINISHED = 2;
const _ORDER_ALL = null;

export default class PeopleView extends Component {
  timer = null;
  _tabs = null;
  state = {
    orderlist: [],
    orderTips: '沒有您的訂單哦~',
    i18n: i18n[this.props.screenProps.language],
    loadingStatus:{
      firstPageLoading: GLOBAL_PARAMS.httpStatus.LOADING,
      pullUpLoading: GLOBAL_PARAMS.httpStatus.LOADING,
    },
    isError: false,
    refresh:false,
    isExpired: false,
    expiredMessage: null,
    currentTab: _TAB_FINISHED,
    currentStatus: _ORDER_ALL
  }


  componentWillReceiveProps = (nextProps) => {
    this.setState({
      i18n: i18n[nextProps.screenProps.language]
    })
  }

  componentDidMount = () => {
    this.timer = setTimeout(() => {
      this._getMyOrder(0);
      clearTimeout(this.timer);
    },700)
  }

  componentWillUnmount = () => {
    clearTimeout(this.timer);
    this._paramsInit();
  }
  
  //common function

  _initOrderList() {

  }

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

  _getMyOrder = (offset,status=null) => {
    // console.log(offset);
    api.myOrder(offset,status,this.props.screenProps.sid).then(data => {
      if (data.status === 200 && data.data.ro.ok) {
        // console.log(data.data.data)
        if(data.data.data.length === 0){
          requestParams.nextOffset = requestParams.currentOffset
          this.setState({
            orderlist: this.state.orderlist.concat(data.data.data),
            loadingStatus: {
              pullUpLoading:GLOBAL_PARAMS.httpStatus.NO_MORE_DATA,
            }
          })
          return
        }
        this.setState({
          orderlist: this.state.orderlist.concat(data.data.data),
          loadingStatus: {
            pullUpLoading:GLOBAL_PARAMS.httpStatus.LOADING
          }
        })
        requestParams.currentOffset = requestParams.nextOffset
      }else{
        ToastUtil.showWithMessage(data.data.ro.respMsg)
        if(data.data.ro.respCode == "10006" || data.data.ro.respCode == "10007") {
          this.props.screenProps.userLogout();
        }
        this.setState({
          isExpired: true,
          expiredMessage: data.data.ro.respMsg
        });

        this.setState({
          loadingStatus: {
            pullUpLoading: GLOBAL_PARAMS.httpStatus.LOAD_FAILED
          }
        })
      }
    },() => {
      requestParams.nextOffset = requestParams.currentOffset
      this.setState({
        loadingStatus: {
          pullUpLoading: GLOBAL_PARAMS.httpStatus.LOAD_FAILED
        }
      })
    })
  }

  _cancelOrder(orderId) {
    Alert.alert(
      '提示',
      '確定要取消訂單嗎？',
      [
        {text: '取消', onPress: () => {return null}, style: 'cancel'},
        {text: '確定', onPress: () => {
          api.cancelOrder(orderId,this.props.screenProps.sid).then(data => {
            if(data.status === 200 && data.data.ro.ok) {
              ToastUtil.showWithMessage('取消訂單成功!');
              this._onReloadPage();
              this._getMyOrder(requestParams.offset, this.state.currentStatus);
            }
          },() => {
            ToastUtil.showWithMessage("出錯了");
          })
        }},
      ],
      { cancelable: false }
    )
  }

  _onEndReach = () => {
    requestParams.nextOffset += 5
    this._getMyOrder(requestParams.nextOffset, this.state.currentStatus);
  }

  _onErrorToRequestNextPage() {
    this.setState({
      loadingStatus:{
        pullUpLoading:GLOBAL_PARAMS.httpStatus.LOADING
      }
    })
    requestParams.nextOffset += 5
    this._getMyOrder(requestParams.nextOffset)
  }

  _switchOrderStatus(status) {
    switch(status) {
      case -1: return '用戶取消';
      case 0: return '未確認';
      case 1: return '待配送';
      case 2: return '已完成';
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
      loadingStatus:{
        firstPageLoading: GLOBAL_PARAMS.httpStatus.LOADING
      },
    })
  }

  _onChangeTabs(val) {
    if(this._tabs.state.currentPage == this.state.currentTab) {
      return;
    }
    this._onReloadPage();
    this.timer = setTimeout(() => {
      switch(this._tabs.state.currentPage) {
        case 0: {this._getMyOrder(requestParams.offset,_ORDER_ALL);this.setState({currentStatus:_ORDER_ALL})}break;
        case 1: {this._getMyOrder(requestParams.offset, _ORDER_DELIVERING);this.setState({currentStatus:_ORDER_DELIVERING})}break;
        case 2: {this._getMyOrder(requestParams.offset, _ORDER_CANCEL);this.setState({currentStatus:_ORDER_CANCEL})}break;
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
      sections={[
        {title:'餐廳列表',data:this.state.orderlist},
      ]}
      renderItem = {({item,index}) => this._renderNewListItemView(item,index)}
      // renderSectionHeader= {() => (<View style={{borderBottomWidth: 1,padding:10,paddingTop: 20,backgroundColor: Colors.main_white,borderBottomColor:'#ccc'}}><Text>我的訂單</Text></View>)}
      keyExtractor={(item, index) => index}
      onEndReachedThreshold={0.01}
      onEndReached={() => this._onEndReach()}
      // ListHeaderComponent={() => this._renderPersonDetailHeader()}
      ListFooterComponent={() => (<ListFooter loadingStatus={this.state.loadingStatus.pullUpLoading} errorToDo={() => this._onErrorToRequestNextPage()}/>)}
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
    let _picture = !item.picture ? require('../asset/default_pic.png') : {uri:item.picture};
    return (
      <View style={MyOrderStyles.FoodContainer}>
        <Image style={MyOrderStyles.FoodImage} reasizeMode="contain" source={_picture}/>
        <View style={MyOrderStyles.FoodInnerContainer}>
          <View style={MyOrderStyles.FoodTitleView}>
            <Text style={[CommonStyles.common_title_text,{maxWidth: 200}]} numberOfLines={1}>{item.orderName}</Text>
            <View style={{flexDirection:'row',marginTop: -3}}>
              <Text style={[CommonStyles.common_title_text,{marginRight: 5}]}>數量:</Text>
              <Text style={CommonStyles.common_important_text}>{item.amount}</Text>
            </View>
          </View>
          <View style={MyOrderStyles.FoodCommonView}>
            <Text style={CommonStyles.common_info_text}>取餐日期</Text>
            <Text style={[CommonStyles.common_info_text,{maxWidth: 200}]} numberOfLines={1}>{item.takeDate} {item.takeTime}</Text>
          </View>
          <View style={MyOrderStyles.FoodCommonView}>
            <Text style={CommonStyles.common_info_text}>取餐地點</Text>
            <Text style={[CommonStyles.common_info_text,{maxWidth: 200}]} numberOfLines={1}>{item.takeAddressDetail}</Text>
          </View>
        </View>
      </View>
    )
  }

  _renderPayView(item) {
    let _isDelivering = item.status === _ORDER_DELIVERING;
    return (
      <View style={{flexDirection: 'row',paddingTop: 10,paddingBottom:10,justifyContent:'space-between',alignItems:'center'}}>
        <Text style={{color: '#666666',fontSize: 16}}>支付狀態</Text>
        <View style={{flexDirection:'row',justifyContent: 'space-between',}}>
          <View style={{padding: 5,paddingLeft: 10,paddingRight: 10,borderRadius: 20,borderWidth: 1,borderColor: '#979797'}}>
            <Text style={{color: '#111111',fontSize: 16}}>現金支付</Text>
          </View>
          {/*<TouchableOpacity style={{padding: 5,paddingLeft: 10,paddingRight: 10,borderRadius: 20,borderWidth: 1,borderColor: '#FF3348',marginRight: 10,}}>
            <Text style={{color: '#ff3348'}}>線上支付</Text>
    </TouchableOpacity>*/}
          {_isDelivering ? <TouchableOpacity onPress={() => this._cancelOrder(item.orderId)} style={{padding: 5,paddingLeft: 10,paddingRight: 10,borderRadius: 20,borderWidth: 1,borderColor: '#FF3348',marginLeft: 5}}>
            <Text style={{color: '#ff3348'}}>取消訂單</Text>
          </TouchableOpacity> : null}
        </View>
      </View>
    )
  }

  _renderTotalPriceView(item) {
    let _isDelivering = item.status === _ORDER_DELIVERING;
    return (
      <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
        <View style={{backgroundColor: 'transparent'}}>
            <Text style={{fontSize: 16,color: '#FF3348',marginTop: -3,}}>{this._switchOrderStatus(item.status)}</Text>
          </View>
       <View style={{flexDirection:'row',justifyContent: 'space-between',alignItems:'center'}}>
        <Text style={{fontSize: 16,color: '#666666',marginRight: 10,}}>實付款 HKD</Text>
        <Text style={{fontSize: 22,color: '#FF3348',marginTop: -3,}}>{item.totalMoney}</Text>
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

  _renderCommonListView = () => (
    <View style={{flex:1,backgroundColor:'#f0eff6'}}>
    {this.state.isExpired ? <BlankPage style={{marginTop:50}} message={this.state.expiredMessage}/> : null}
      {
        this.state.orderlist.length > 0 
        ? this._renderOrderListView()
        : null
      }
      {/*
        this.state.loadingStatus.firstPageLoading === GLOBAL_PARAMS.httpStatus.NO_MORE_DATA ? <BlankPage  style={{marginTop:50}} message="暫無訂單數據哦"/> :null
      */}
    </View>
  )

  render() {
    let {theme} = this.props.screenProps;
    return (
      <Container style={{position: 'relative'}}>
        {/*<Button transparent onPress={() => this.props.navigation.goBack()} 
        style={{position: 'absolute',top: 80,left: 10,width:40,height:40,borderRadius: 20,backgroundColor:Colors.fontBlack,opacity:0.5,zIndex:10}}>
        <Icon
          size={20}
          name="ios-arrow-back"
          style={[{ fontSize: 25, color: Colors.main_white }]}
        />
    </Button>*/}
        <CommonHeader canBack hasTabs title="我的訂單" {...this.props}/>
        <Tabs tabBarUnderlineStyle={{backgroundColor: '#FF3348',marginLeft: 47*(GLOBAL_PARAMS._winWidth/375),width: 32}} 
        ref={ t=>this._tabs = t } onChangeTab={() => this._onChangeTabs()}>
        <Tab activeTextStyle={{fontWeight:'800',fontSize: 20}} heading={ <TabHeading style={styles.commonHeadering}><Text allowFontScaling={false} style={[styles.commonText,{fontWeight: this.state.currentStatus == _ORDER_ALL? '800':'normal',}]}>全部</Text></TabHeading>}>
          {this._renderCommonListView()}
        </Tab>
        <Tab heading={ <TabHeading style={styles.commonHeadering}><Text allowFontScaling={false}style={[styles.commonText,{fontWeight: this.state.currentStatus == _ORDER_DELIVERING? '800':'normal',}]}>待配送</Text></TabHeading>}>
          {this._renderCommonListView()}
        </Tab>
        <Tab heading={ <TabHeading style={styles.commonHeadering}><Text allowFontScaling={false} style={[styles.commonText,{fontWeight: this.state.currentStatus == _ORDER_CANCEL? '800':'normal',}]}>已取消</Text></TabHeading>}>
          {this._renderCommonListView()}
        </Tab>
      </Tabs>
        {this.state.loadingStatus.firstPageLoading === GLOBAL_PARAMS.httpStatus.LOADING ?
          <Loading style={Platform.OS == 'android' ? {marginTop:110} : {}}/> : (this.state.loadingStatus.firstPageLoading === GLOBAL_PARAMS.httpStatus.LOAD_FAILED ?
            <ErrorPage errorTips="加載失敗,請點擊重試" errorToDo={this._onErrorRequestFirstPage}/> : null)}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  loginContainer:{
    flex:1
  },
  loginHeader: {
    width: GLOBAL_PARAMS._winWidth,
    height: 200,
    display:'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  personAvatar: {
    width:65,
    height:65,
  },
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: 'rgba(247,247,247,1.0)',
  },
  commonItem:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
  },
  commonImage: {
    width:28,
    height:28,
    marginBottom:10
  },
  commonFlex:{
    flex: 1
  },
  commonTitleText: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "AvenirNext-UltraLightItalic",
  },
  commonDecText: {
    // fontFamily: 'AvenirNext-UltraLightItalic',
    color: Colors.fontBlack,
    fontWeight: "normal",
    fontSize: 16,
    // marginTop: 5,
    flex: 1
  },
  commonPriceText: {
    fontWeight: "bold",
    fontSize: 16
    // marginTop: 5,
  },
  commonDetailText: {
    fontWeight: "700",
    color: Colors.fontBlack,
    fontSize: 20
    // fontFamily:'AvenirNext-Regular',
    // textShadowColor:'#C0C0C0',
    // textShadowRadius:2,
    // textShadowOffset:{width:2,height:2},
  },
  commonLabel: {
    letterSpacing: 2,
    fontWeight: "200",
    color: Colors.fontBlack
  },
  commonHeadering: {
    backgroundColor: Colors.main_white,
    borderBottomWidth: 1,
    borderBottomColor:'#ddd'
  },
  commonText: {
    fontSize: 16,
    color: Colors.fontBlack
  }
})
