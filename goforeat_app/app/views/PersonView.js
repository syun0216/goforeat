import React, { Component } from "react";
import { View, StatusBar, Text, TouchableOpacity,StyleSheet,SectionList,Image,Alert,Modal,ScrollView } from "react-native";
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
import CommonModal from '../components/CommonModal';
import Divider from '../components/Divider';
import ListFooter from '../components/ListFooter';
import ErrorPage from '../components/ErrorPage';
import Loading from '../components/Loading';
import BlankPage from '../components/BlankPage';
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

export default class PeopleView extends Component {
  state = {
    orderlist: [],
    orderTips: '沒有您的訂單哦~',
    i18n: i18n[this.props.screenProps.language],
    loadingStatus:{
      firstPageLoading: GLOBAL_PARAMS.httpStatus.LOADING,
      pullUpLoading: GLOBAL_PARAMS.httpStatus.LOADING,
      refresh:false
    },
    isExpired: false,
    expiredMessage: null,
  }


  componentWillReceiveProps = (nextProps) => {
    this.setState({
      i18n: i18n[nextProps.screenProps.language]
    })
  }

  componentDidMount = () => {
    this._getMyOrder(0);
  }

  componentWillUnmount = () => {
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
  
  //common function
  _getMyOrder = (offset) => {
    // console.log(offset);
    api.myOrder(offset,this.props.screenProps.sid).then(data => {
      if (data.status === 200 && data.data.ro.ok) {
        // console.log(data.data.data)
        if(data.data.data.length === 0){
          requestParams.nextOffset = requestParams.currentOffset
          this.setState({
            orderlist: this.state.orderlist.concat(data.data.data),
            loadingStatus: {
              pullUpLoading:GLOBAL_PARAMS.httpStatus.NO_MORE_DATA
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
        this.props.screenProps.userLogout();
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

  _onEndReach = () => {
    requestParams.nextOffset += 5
    this._getMyOrder(requestParams.nextOffset)
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
      renderSectionHeader= {() => (<View style={{borderBottomWidth: 1,padding:10,paddingTop: 20,backgroundColor: Colors.main_white,borderBottomColor:'#ccc'}}><Text>我的訂單</Text></View>)}
      keyExtractor={(item, index) => index}
      onEndReachedThreshold={0.01}
      onEndReached={() => this._onEndReach()}
      ListHeaderComponent={() => this._renderPersonDetailHeader()}
      ListFooterComponent={() => (<ListFooter loadingStatus={this.state.loadingStatus.pullUpLoading} errorToDo={() => this._onErrorToRequestNextPage()}/>)}
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
              <Text style={styles.commonTitleText}>
                {item.orderName} {"\n"}
                取餐點 {item.takeAddressDetail} {"\n"}
                取餐日期 {item.takeDate} {"\n"}
                取餐時間 {item.takeTime} {"\n"}
              </Text>
            </Body>
          </CardItem>
          <CardItem style={{ backgroundColor: "#fafafa", marginTop: -10 }}>
            <Body>
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
                <Text style={styles.commonDecText}>TOTAL</Text>
                <Text style={styles.commonPriceText}>
                  HKD {item.totalMoney}
                </Text>
              </View>
            </Body>
          </CardItem>
        </Card>
  )

  render() {
    return (
      <Container style={{position: 'relative'}}>
        <Button transparent onPress={() => this.props.navigation.goBack()} 
        style={{position: 'absolute',top: 80,left: 10,width:40,height:40,borderRadius: 20,backgroundColor:Colors.fontBlack,opacity:0.5,zIndex:10}}>
        <Icon
          size={20}
          name="ios-arrow-back"
          style={[{ fontSize: 25, color: Colors.main_white }]}
        />
      </Button>
        <StatusBar barStyle="dark-content"/>
        {this.state.loadingStatus.firstPageLoading === GLOBAL_PARAMS.httpStatus.LOADING ?
          <Loading message="玩命加載中..."/> : (this.state.loadingStatus.firstPageLoading === GLOBAL_PARAMS.httpStatus.LOAD_FAILED ?
            <ErrorPage errorTips="加載失敗,請點擊重試" errorToDo={this._onErrorRequestFirstPage}/> : null)}
        <View style={{flex:1}}>
        {this.state.isExpired ? <BlankPage style={{marginTop:50}} message={this.state.expiredMessage}/> : null}
          {
            this.state.orderlist.length > 0
            ? this._renderOrderListView()
            : null
          }
        </View>
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
  commonTitleText: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "AvenirNext-UltraLightItalic"
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
    fontSize: 18
  }
})
