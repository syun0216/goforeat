import React, { Component } from "react";
import { View, StatusBar, Text, TouchableOpacity,StyleSheet,SectionList,Image,Alert,Modal,ScrollView,RefreshControl,Platform } from "react-native";
import {
  Container,
  Header,
  Body,
  Right,
  Left,
  Button,
  Icon,
  Title,
  Content,
  ListItem,
  List,
  Card,
  CardItem,
  Tabs,
  Tab,
  TabHeading
} from "native-base";
//cache
import appStorage from "../cache/appStorage";
//Colors
import Colors from '../utils/Colors'
//utils
import GLOBAL_PARAMS from '../utils/global_params'
import ToastUtil from '../utils/ToastUtil'
//api
import api from '../api'
//components
import Divider from '../components/Divider';
import ListFooter from '../components/ListFooter';
import ErrorPage from '../components/ErrorPage';
import Loading from '../components/Loading';
import BlankPage from '../components/BlankPage';
import CommonHeader from '../components/CommonHeader';
//language
import i18n from '../language/i18n';

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
  _renderPersonDetailHeader = () => (
    <View style={[styles.loginHeader,{backgroundColor:this.props.screenProps.theme}]}>
      {this.props.screenProps.user !== null ? (<Image style={styles.personAvatar} source={require('../asset/eat.png')}/>) :
    (<Image style={styles.personAvatar} source={require('../asset/touxiang.png')}/>)}
      {this.props.screenProps.user !== null ? (<Text style={{fontSize:16,color:'#fff',marginTop:10}}>用戶:{this.props.screenProps.user}</Text>) :
    (<TouchableOpacity style={{marginTop:10}} onPress={() => this.props.navigation.navigate("Login")}>
      <Text style={{fontSize:16,color:'#fff'}}>{this.state.i18n.login_text}</Text>
    </TouchableOpacity>)}
    </View>
  )

  _renderOrderListView = () => (
    <SectionList
      sections={[
        {title:'餐廳列表',data:this.state.orderlist},
      ]}
      renderItem = {({item,index}) => this._renderOrderListItemView(item,index)}
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

  _renderOrderListItemView = (item,index) => (
    <Card key={index}>
          <CardItem style={{ backgroundColor: "#fafafa" }}>
            <Body
              style={{
                borderBottomColor: "#ccc",
                borderBottomWidth: 1,
                paddingBottom: 10
              }}
            >
              <View style={{flex: 1,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}><Text style={styles.commonFlex}>菜品名稱</Text><Text style={styles.commonTitleText}>{item.orderName}</Text></View>
              <View style={{flex: 1,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}><Text style={styles.commonFlex}>數量</Text><Text style={styles.commonTitleText}>×{item.amount}</Text></View>
              <View style={{flex: 1,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}><Text style={styles.commonFlex}>取餐日期</Text><Text style={styles.commonTitleText}>{item.takeDate}</Text></View>
              <View style={{flex: 1,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}><Text style={styles.commonFlex}>取餐時間</Text><Text style={styles.commonTitleText}>{item.takeTime}</Text></View>
              <View style={{flex: 1,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}><Text style={styles.commonFlex}>取餐點</Text><Text style={styles.commonTitleText}>{item.takeAddressDetail}</Text></View>
            </Body>
          </CardItem>
          <CardItem style={{ backgroundColor: "#fafafa", marginTop: -10 }}>
            <Body style={[{
            paddingBottom: 10},item.status == _ORDER_DELIVERING ? {borderBottomColor: "#ccc",
            borderBottomWidth: 1,} : null]}>
              {/*<Text style={styles.commonTitleText}>*/}
              {/*NativeBase builds a layer on top of React Native that provides*/}
              {/*you with*/}
              {/*</Text>*/}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}
              >
                <Text style={styles.commonDecText}>TOTAL HKD {item.totalMoney}</Text>
                <Text style={[styles.commonPriceText,{color: this.props.screenProps.theme}]}>
                  {this._switchOrderStatus(item.status)}
                </Text>
              </View>
            </Body>
          </CardItem>
          {item.status == _ORDER_DELIVERING ? <CardItem style={{ backgroundColor: "#fafafa", marginTop: -10 }}>
          <Body>
            <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between"
                  }}
                >
              <Text style={styles.commonDecText}>訂單操作</Text>
              <Button style={{backgroundColor: this.props.screenProps.theme,paddingLeft: 10,paddingRight: 10,justifyContent:'flex-end'}} onPress={() => this._cancelOrder(item.orderId)}>
                <Text style={{color: Colors.main_white}}>取消訂單</Text>
              </Button>
            </View>
          </Body>
        </CardItem> : null}
        </Card>
  )

  _renderCommonListView = () => (
    <View style={{flex:1}}>
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
        <Tabs tabBarUnderlineStyle={{backgroundColor: this.props.screenProps.theme}} 
        ref={ t=>this._tabs = t } onChangeTab={() => this._onChangeTabs()}>
        <Tab textStyle={{color:Platform.OS == 'android' ? Colors.main_white : '#000'}} heading={ <TabHeading><Text style={styles.commonText}>全部訂單</Text></TabHeading>}>
          {this._renderCommonListView()}
        </Tab>
        <Tab heading={ <TabHeading><Text style={styles.commonText}>待配送</Text></TabHeading>}>
          {this._renderCommonListView()}
        </Tab>
        <Tab heading={ <TabHeading><Text style={styles.commonText}>已取消</Text></TabHeading>}>
          {this._renderCommonListView()}
        </Tab>
      </Tabs>
        {this.state.loadingStatus.firstPageLoading === GLOBAL_PARAMS.httpStatus.LOADING ?
          <Loading message="玩命加載中..."/> : (this.state.loadingStatus.firstPageLoading === GLOBAL_PARAMS.httpStatus.LOAD_FAILED ?
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
  commonText: {
    fontSize: 16,
    color: Platform.OS === 'android' ? Colors.main_white : Colors.fontBlack
  }
})
