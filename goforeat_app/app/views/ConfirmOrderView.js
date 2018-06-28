import React, { PureComponent } from "react";
import { View, Text, StyleSheet, TextInput,Platform,Alert,TouchableOpacity,Image } from "react-native";
import {
  Container,
  Content,
  Button,
  Card,
  CardItem,
  Body,
  Form,
  Item,
  Input,
  Label,
  Footer,
  Separator,
  ListItem,
  Icon
} from "native-base";
import PopupDialog, {
  SlideAnimation,
  DialogTitle
} from "react-native-popup-dialog";
//components
import BottomOrderConfirm from '../components/BottomOrderConfirm';
import CommonHeader from "../components/CommonHeader";
import BlankPage from "../components/BlankPage";
import Loading from "../components/Loading";
import ErrorPage from "../components/ErrorPage";
//utils
import Colors from "../utils/Colors";
import GLOBAL_PARAMS from "../utils/global_params";
import ToastUtil from "../utils/ToastUtil";
//api
import api from "../api/index";
import Divider from "../components/Divider";

const slideAnimation = new SlideAnimation({
  slideFrom: "bottom"
});

export default class ConfirmOrderView extends PureComponent {
  _popupDialog = null;
  timer = null;
  state = {
    _name: "",
    _phone: "",
    orderDetail: null,
    loading: true,
    isError: false,
    isExpired: false,
    isBottomShow: false
  };

  componentDidMount() {
    this.timer = setTimeout(() => {
      this._createOrder();
      clearTimeout(this.timer);
    },500);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  componentWillReceiveProps(a, b) {
    // console.log(a, b);
  }

  _createOrder = () => {
    let {foodId,placeId,amount} = this.props.navigation.state.params;
    // console.log(this.props.navigation.state.params);
    api.createOrder(foodId,this.props.screenProps.sid,placeId,amount).then(
      data => {
        // console.log(data);
        if (data.status === 200 && data.data.ro.ok) {
          this.setState({
            loading: false,
            orderDetail: data.data.data,
            isBottomShow: true
          });
        } else {
          if(data.data.ro.respCode == "10006" || data.data.ro.respCode == "10007") {
            this.props.screenProps.userLogout();
          }
          Alert.alert(null
            , data.data.ro.respMsg
            , [
                {text: '取消'},
                {text: '確定', onPress: () => this.props.navigation.goBack()}
            ]
          );
          // alert(data.data.ro.respMsg);
          this.setState({
            loading: false,
            isExpired: true,
            expiredMessage: data.data.ro.respMsg
          });
        }
      },
      () => {
        this.setState({loading: false,isError: true});
        ToastUtil.showWithMessage("獲取訂單信息失敗");
      }
    );
  };

  _confirmOrder = () => {
    if (this.state.orderDetail === null) {
      ToastUtil.showWithMessage("確認訂單失敗");
      return;
    }
    api.confirmOrder(this.state.orderDetail.orderId,this.props.screenProps.sid).then(
      data => {
        // console.log(data);
        if (data.status === 200 && data.data.ro.ok) {
          ToastUtil.showWithMessage("下單成功");
          this._popupDialog.dismiss();
          this.props.navigation.goBack();
        } else {
          ToastUtil.showWithMessage(data.data.ro.respMsg);
        }
      },
      () => {
        ToastUtil.showWithMessage("下單失敗");
      }
    );
  };

  //private function
  _openDialog = () => {
    if(this.state.orderDetail === null) {
        ToastUtil.showWithMessage("下單失敗");
        return;
    }
    this._popupDialog.show(() => {
      // console.log('opened!')
    });
  };

  _getName = name => {
    this.setState({
      _name: name
    });
  };

  _getPhone = phone => {
    this.setState({
      _phone: phone
    });
  };

  _onSubmit = () => {
    if (this.state._name === "") {
      ToastUtil.showWithMessage("請訂餐人姓名");
      return;
    }
    if (this.state._phone === "") {
      ToastUtil.showWithMessage("請填寫聯繫人電話");
      return;
    }
  };

  _renderPopupDiaogView = () => {
      let {orderDetail:{takeAddressDetail,totalMoney,takeTime,takeDate,takeAddress,orderDetail}} = this.state;
      return (<PopupDialog
      dialogTitle={<DialogTitle title="您的訂單" />}
      width={GLOBAL_PARAMS._winWidth * 0.9}
      height={GLOBAL_PARAMS._winHeight * 0.65}
      // height={220}
      ref={popupDialog => {
        this._popupDialog = popupDialog;
      }}
      dialogAnimation={slideAnimation}
      onDismissed={() => {
        // console.log(this._username);
      }}
    >
      <Container>
        <Content>
          <ListItem>
            <Text style={styles.commonText}>下單電話: {this.props.screenProps.user}</Text>
          </ListItem>
          <Separator bordered>
            <Text style={styles.commonText}>訂單詳情</Text>
          </Separator>
          <ListItem>
            <Text style={styles.commonText}>菜品名稱:{orderDetail[0].foodName}{'\n'}HKD {orderDetail[0].foodMoney}{'      '}數量{orderDetail[0].foodNum}</Text>
          </ListItem>
          <ListItem>
            <Text style={styles.commonText}>{takeDate}{" "}{takeTime}{'\n'}{takeAddressDetail}</Text>
          </ListItem>
          <Separator bordered>
            <Text style={styles.commonText}>總計</Text>
          </Separator>
          <ListItem last>
            <Text style={[styles.commonText,{color:'#FF3348'}]}>HKD {totalMoney}</Text>
          </ListItem>
        </Content>
        <Footer
          style={{backgroundColor:Colors.main_white, borderTopWidth: 0, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}
        >
          <Button
            onPress={() => this._confirmOrder()}
            block
            style={{
              flex: 1,
              marginTop: 5,
              backgroundColor: '#FF3348',
              marginLeft: 40,
              marginRight: 40
            }}
          >
            <Text
              style={{
                color: Colors.main_white,
                fontWeight: "600",
                fontSize: 16
              }}
            >
              確認訂單
            </Text>
          </Button>
        </Footer>
      </Container>
    </PopupDialog>
  )};

  _renderNewOrderView = () => {
    let {orderDetail:{takeAddressDetail,totalMoney,takeTime,takeDate,takeAddress,orderDetail}} = this.state;
    return (
      <View style={styles.commonNewContainer}>
        <View style={[{flexDirection: 'row',alignItems:'center',justifyContent:'space-between'},styles.commonMarginTop,styles.commonMarginBottom]}>
        <Text allowFontScaling={false} style={{color: '#111111',fontSize: 18,flex:1,fontWeight:'600'}} numberOfLines={1}>{orderDetail[0].foodName}</Text>
        <Text allowFontScaling={false} style={{color:'#111111',fontSize: 18}} numberOfLines={1}>HKD {orderDetail[0].foodMoney.toFixed(2)}</Text>
        </View>
        <View style={[{flexDirection: 'row',alignItems:'center'},styles.commonMarginBottom]}>
          <Text allowFontScaling={false} style={{color: '#999999',fontSize:16,marginRight: 5}}>數量:</Text>
          <Text allowFontScaling={false} style={{color: Colors.middle_red,fontSize: 16}}>{orderDetail[0].foodNum}</Text>
        </View>
        <Divider bgColor="#EBEBEB" height={1}/>
        <View style={[{flexDirection: 'row',justifyContent:'space-between',alignItems:'center'},styles.commonMarginTop,styles.commonMarginBottom]}>
          <Text allowFontScaling={false} style={{flex: 1,fontSize: 18,color: '#333333',}}>總金額</Text>
          <View style={{flexDirection: 'row',justifyContent:'space-between',alignItems:'center'}}>
            <Text allowFontScaling={false} style={{fontSize: 20,color: '#111111',marginRight: 5}}>HKD</Text>
            <Text allowFontScaling={false} style={{fontSize: 22,color: '#ff3448',marginTop: -4,fontWeight:'600'}} numberOfLines={1}>{totalMoney.toFixed(2)}</Text>
          </View>
        </View>
      </View>
    )
  }

  _renderNewDetailsView = () => {
    let {orderDetail:{takeAddressDetail,totalMoney,takeTime,takeDate,takeAddress,orderDetail}} = this.state;
    let _details_arr = [
      {title:'取餐日期',content: takeDate,hasPreIcon: false,fontColor:'#ff3448',canOpen: false,clickFunc:()=>{}},
      {title:'取餐地點',content: takeAddress,hasPreIcon:true,fontColor:'#333333',canOpen:false,clickFunc:()=>{}},
      {title:'預計取餐時間',content: takeTime,hasPreIcon:false,fontColor:'#333333',canOpen:false,clickFunc:()=> {}},
      {title:'支付方式',content:'現金支付',hasPreIcon:false,fontColor:'#333333',canOpen:false,clickFunc:()=> {}}
    ];
    return (
      <View style={styles.commonNewContainer}>
        <Text allowFontScaling={false} style={[{color:'#111111',fontSize: 20,fontWeight:'bold'},styles.commonMarginBottom,styles.commonMarginTop]}>取餐資料</Text>
        {_details_arr.map((item,idx) => this._renderCommonDetailView(item,idx))}
      </View>
    )
  }

  _renderCommonDetailView = (item,idx) => {
    return (
      <View key={idx} style={[styles.commonDetailsContainer,styles.commonMarginBottom]}>
        <Text allowFontScaling={false} style={{color:'#999999',marginBottom: 10}}>{item.title}</Text>
        <TouchableOpacity onPress={item.clickFunc} style={{flexDirection: 'row',justifyContent:'space-between',alignItems:'center',flex: 1,borderBottomWidth:1,borderBottomColor:'#EBEBEB',paddingBottom:10}}>
          <View style={{flexDirection:'row',alignItems:'center',flex:1}}>
            {item.hasPreIcon ?<Image source={require('../asset/location.png')} style={{width: 18,height: 17,marginRight: 5}} resizeMode="contain"/> :null}
            <Text allowFontScaling={false} style={{fontSize: 18,color: item.fontColor,marginRight: item.hasPreIcon?20:0,}} numberOfLines={1}>{item.content}</Text>
          </View>
          {item.canOpen?<Icon name="ios-arrow-down-outline" style={{width: 20,height: 20,color:'#C8C7C7',marginTop:-8}}/>:null}
        </TouchableOpacity>
      </View>
    )
  }

  _renderBottomConfirmView() {
    return (
      <BottomOrderConfirm isShow={this.state.isBottomShow} total={this.props.navigation.state.params.total}  btnMessage="立即下單" btnClick={this._openDialog} canClose={false}/>
    )
  }

  render() {
    return (
      <Container>
        {this.state.orderDetail !== null ? this._renderPopupDiaogView() : null}
        <CommonHeader
          canBack
          title="訂單確認頁"
          titleStyle={{ fontSize: 18, fontWeight: "bold" }}
          {...this["props"]}
        />
        {this.state.loading ? <Loading/> : null}
        {this.state.isError ? (
          <ErrorPage errorToDo={this._createOrder} errorTips="加載失敗,請點擊重試"/>
        ) : null}
        <Content style={{ backgroundColor: '#edebf4' }} padder>
          {this.state.isExpired ? (
            <BlankPage message={this.state.expiredMessage} style={{marginLeft: -10}}/>
          ) : null}
          {this.state.orderDetail != null ? this._renderNewOrderView() : null}
          {this.state.orderDetail !== null ? this._renderNewDetailsView() : null}
          <View style={{height: 65}}/>
          </Content>
          {this._renderBottomConfirmView()}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  commonTitleText: {
    fontSize: 16,
    color: "#111111",
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
    color: "#3B254B",
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
  },
  commonNewContainer: {
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 5,
    shadowColor: '#E8E2F2',
    shadowOpacity: 0.8,
    shadowOffset: {width: 0,height: 8},
    elevation: 3,
    marginBottom: 10,
    backgroundColor: Colors.main_white
  },
  commonDetailsContainer: {
    justifyContent:'space-around',
    alignItems:'flex-start',
  },
  commonMarginTop: {
    marginTop: 15
  },
  commonMarginBottom: {
    marginBottom: 15
  }
});
