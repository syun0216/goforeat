import React, { Component } from "react";
import {
  Platform,
  View,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  AppState,
  StyleSheet,
  ActivityIndicator
} from "react-native";
import {
  Container,
  Icon,
  Header,
  Col,
} from "native-base";
import Carousel, { Pagination } from "react-native-snap-carousel";
import LinearGradient from 'react-native-linear-gradient';
import { sliderWidth, itemWidth } from "../styles/SliderEntry.style";
import SliderEntry from "../components/SliderEntry";
import HotReloadHOC from '../components/HotReloadHOC';
import styles, { colors } from "../styles/index.style";
import { ENTRIES1, ENTRIES2 } from "../static/entries";
// utils
import Colors from "../utils/Colors";
import GLOBAL_PARAMS from "../utils/global_params";
import ToastUtil from "../utils/ToastUtil";
//api
import api from "../api";
//components
import ErrorPage from "../components/ErrorPage";
import Loading from "../components/Loading";
import PlacePickerModel from '../components/PlacePickerModel';
import BlankPage from '../components/BlankPage';
import BottomOrderConfirm from '../components/BottomOrderConfirm';
import WarningTips from '../components/WarningTips';
//language
import i18n from "../language/i18n";

const IS_ANDROID = Platform.OS === "android";
const SLIDER_1_FIRST_ITEM = 1;

const _styles = StyleSheet.create({
  linearGradient: {
    height: 65,
    width: GLOBAL_PARAMS._winWidth,
    marginTop: Platform.OS == 'ios' ? -15 : 0,
    paddingTop: Platform.OS == 'ios' ? 15 : 0,
    justifyContent:'center',
    alignItems:'center',
    flexDirection: 'row',
  }
});

class ShopSwiperablePage extends Component {
  _current_offset = 0;
  _SliderEntry = null;
  _timer = null;
  _picker = null;
  constructor(props) {
    super(props);
    this.state = {
      slider1ActiveSlide: SLIDER_1_FIRST_ITEM,
      shopDetail: null,
      foodDetails: null,
      isError: false,
      loading: true,
      i18n: i18n[this.props.screenProps.language],
      placeSelected: null,
      formatDate: {
        date: '',
        week: ''
      },
      refreshParams: '',
      isBottomContainerShow: false,
      foodCount: 0,
      showPlacePicker: false
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      i18n: i18n[nextProps.screenProps.language]
    });
    if(!this.state.isBottomContainerShow&&(nextProps.screenProps.refresh != this.state.refreshParams)&&nextProps.screenProps.refresh!= null) {
      this._reloadPage();
    }
    this.setState({refreshParams: nextProps.screenProps.refresh})
  }

  // shouldComponentUpdate(nextProps,nextState) {
  //   return !(nextProps.screenProps.refresh == nextState.refreshParams);
  // }

  componentDidMount() {
    AppState.addEventListener('change', (nextAppState) =>this._handleAppStateChange(nextAppState))
    
    this._current_offset = 0;
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', (nextAppState) =>this._handleAppStateChange(nextAppState));
    if(this.timer !== null) {
      clearTimeout(this.timer);
    }
  }

  _handleAppStateChange(nextAppState) {
    if(nextAppState == 'active') {
      this._reloadPage();
    }
  }

  _reloadPage() {
    if(!this.state.placeSelected) {
      this._picker.getPlace();
      return;
    }
    this.setState({loading: true});
      setTimeout(() => {
        this._getDailyFoodList(this.state.placeSelected.id);
        clearTimeout(this.timer);
      },500)
  }

  _formatDate(timestamp) {
    let _Date = new Date(timestamp);
    let _date_format = [_Date.getFullYear(),_Date.getMonth()+1,_Date.getDate()].join('-');
    let _week_day = null;
    switch(_Date.getDay()) 
      { 
      case 0:_week_day = "星期日";break; 
      case 1:_week_day = "星期一";break; 
      case 2:_week_day = "星期二";break; 
      case 3:_week_day = "星期三";break; 
      case 4:_week_day = "星期四";break; 
      case 5:_week_day = "星期五";break; 
      case 6:_week_day = "星期六";break; 
      default:_week_day = "系统错误！" 
      } 
    this.setState({
      formatDate: {
        date: _date_format,
        week: _week_day
      }
    });
  }
  //api
  _getDailyFoodList = (placeId) => {
    api.getDailyFoods(placeId, this.props.screenProps.sid).then(data => {
      if(data.status === 200 && data.data.ro.ok) {
        console.log(data);
        this.setState({
          foodDetails: data.data.data.foodList,
          loading: false
        })
        this._formatDate(data.data.data.timestamp);
      }
    },() => {
      this.setState({ isError: true, loading: false });
    })
  }

  _onErrorToRetry = () => {
    this.setState({
      loading: true,
      isError: false
    });
    this._picker.getPlace();
  };

  _refresh = () => {
    this._current_offset += 15;
    this.setState({
      loading: true
    });
    this._getDailyFoodList();
  };

  getSeletedValue = (val) => {
    if(val == null) {
      // this._picker.getPlace();
      this.setState({ isError: true, loading: false });
      return;
    }
    this.setState({
      placeSelected: val,
      foodCount: 0,
      isBottomContainerShow: false
    })
    let timer = setTimeout(() => {
      // this._getRecomendFoodList(val.id);
      this._getDailyFoodList(val.id);
      clearTimeout(timer);
    },200);
  }

  _goToOrder = () => {
    let {foodId} = this.state.foodDetails[0];
    let {placeSelected,foodCount} = this.state;
    if(this.props.screenProps.user !== null) {
      this.props.navigation.navigate("Order", {
          foodId,
          placeId: placeSelected.id,
          amount: foodCount
      })
  }else {
    if(placeSelected.id){
      this.props.navigation.navigate("Login",{page:'Order',foodId,placeId: placeSelected.id,amount: foodCount,reloadFunc: () => this._reloadWhenCancelLogin()});
    }
    }
  }

  _add() {
    this.setState({
      foodCount: this.state.foodCount + 1,
      isBottomContainerShow: true
    })
    this.props.navigation.setParams({visible: false})
  }

  _remove() {
    if(this.state.foodCount == 1) {
      this.props.navigation.setParams({visible: true})
      this.setState({
        isBottomContainerShow: false,
      })
    }
    if(this.state.foodCount == 0) {
      return ;
    }
    this.setState({
      foodCount: this.state.foodCount - 1
    })
  }

  _reloadWhenCancelLogin() {
    this._reloadPage();
  }

  _cancelOrder = () => {
    this.setState({
      isBottomContainerShow: false,
      foodCount: 0
    })
    this.props.navigation.setParams({visible: true})
  }

  _renderDateFormat() {
    return (
      <View style={{marginTop:10,marginLeft:GLOBAL_PARAMS._winWidth*0.1}}>
        <Text style={{color: Colors.fontBlack,fontSize: 20}}>
        {this.state.formatDate.week}的餐單</Text>
        <Text style={{color: Colors.fontGray,fontSize: 13}}>{this.state.formatDate.date}</Text>
      </View>
    )
  }

  _renderWarningView() {
    return (
      <WarningTips />
    )
  }

  // _renderItem({ item, index }) {
  //   return (
  //     <SliderEntry
  //       data={item}
  //       even={(index + 1) % 2 === 0}
  //       {...this["props"]}
  //     />
  //   );
  // }

  _renderIntrodutionView() {
    let {foodDetails} = this.state;
    let _width = GLOBAL_PARAMS._winWidth*0.08;
    return (
      <View style={{width: GLOBAL_PARAMS._winWidth,height:GLOBAL_PARAMS._winHeight>667?170: 140,paddingLeft: _width,paddingRight: _width,paddingTop: 10,paddingBottom: 20}}>
        <Text style={{fontSize: 20,color: '#111',fontWeight:'bold',marginBottom:11}} numberOfLines={1}>{foodDetails[0].foodName}</Text>
        <Text style={{fontSize: 14,color:'#999999',textAlign:'justify',lineHeight: 20}} numberOfLines={GLOBAL_PARAMS._winHeight>667? 5: 4}>{foodDetails[0].foodBrief}</Text>
      </View>
    )
  }

  _renderAddPriceView() {
    let {foodDetails} = this.state;
    let _width = GLOBAL_PARAMS._winWidth*0.08;
    return (
      <View style={{width: GLOBAL_PARAMS._winWidth,paddingLeft:_width,paddingRight:_width,flexDirection: 'row',justifyContent:'space-between',alignItems:'center'}}>
        <View style={{position:'relative',flexDirection: 'row',alignItems:'flex-end'}}>
          <Text style={{fontSize: 18,color: Colors.fontBlack,marginRight: 8}}>HKD</Text>
          <Text style={{fontSize: 30,color: '#ff3348',marginRight:GLOBAL_PARAMS._winWidth < 340 ?10 : 15,marginBottom:-4}}>{foodDetails[0].price}</Text>
          <Text style={{fontSize: 16,color: '#9B9B9B'}}>HKD {foodDetails[0].originPrice}</Text>
          <View style={{width: GLOBAL_PARAMS._winWidth < 340 ? 60 : 75,transform: [{ rotate: '-5deg'}],backgroundColor:'#9B9B9B',height:2,position:'absolute',bottom:8,right:GLOBAL_PARAMS._winWidth< 340 ? -3: -8,opacity:0.63}}/>
        </View>
        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
            <TouchableOpacity onPress={() => this._remove()} style={{width: 40,alignItems:'center'}}>
            <Image source={require("../asset/remove.png")} style={{width:25,height:25}}/>
            </TouchableOpacity>
            <Text style={{color:Colors.fontBlack,fontSize:30,width:40,textAlign:'center'}} numberOfLines={1}>{this.state.foodCount}</Text>
            <TouchableOpacity onPress={() => this._add()} style={{width: 40,alignItems:'center'}}>
                <Image source={require("../asset/add.png")} style={{width:34,height:34,marginTop:7}}/>
            </TouchableOpacity>    
        </View>
      </View>
    )
  }

  _renderItemWithParallax({ item, index }, parallaxProps) {
    return (
      this.state.placeSelected != null ?
      <SliderEntry
        ref={(se) => this._SliderEntry = se}
        data={item}
        star={this.state.foodDetails[0].star}
        even={(index + 1) % 2 === 0}
        placeId={this.state.placeSelected.id}
        {...this.props}
        // parallax={true}
        // parallaxProps={parallaxProps}
      /> : null
    );
  }

  mainExample(number, title) {
    const { slider1ActiveSlide,foodDetails } = this.state;

    return foodDetails !== null  ? (
      <View style={[styles.exampleContainer, { marginTop: -15 }]}>
        {/*<Text style={[styles.title,{color:'#1a1917'}]}>商家列表</Text>*/}

        <Carousel
          ref={c => (this._slider1Ref = c)}
          data={foodDetails[0].extralImage}
          renderItem={this._renderItemWithParallax.bind(this)}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          hasParallaxImages={false}
          firstItem={SLIDER_1_FIRST_ITEM}
          inactiveSlideScale={0.94}
          inactiveSlideOpacity={0.7}
          // inactiveSlideShift={20}
          containerCustomStyle={styles.slider}
          contentContainerCustomStyle={styles.sliderContentContainer}
          loop={false}
          loopClonesPerSide={2}
          autoplay={false}
          autoplayDelay={3000}
          autoplayInterval={4000}
          onSnapToItem={index => this.setState({ slider1ActiveSlide: index })}
        />
      </View>
    ) : null;
  }

  _renderPlacePickerBtn() {
    return (
      <TouchableOpacity style={{flexDirection:'row',marginLeft:Platform.OS == 'ios' ? -65 : -30,maxWidth: Platform.OS == 'ios' ? 200 :250,marginTop: Platform.OS == 'ios' ? 0 : -8,position: 'relative'}} onPress={() => this.setState({showPlacePicker: true})}>
        <View style={{backgroundColor:Colors.main_white,opacity:0.2,borderRadius: 100,width:250,height: 35,}}/>
        <Image source={require('../asset/icon-location.png')} style={{width: 20,height: 20,position:'absolute',top: 8,left:12}}/>
        <Text style={{color: Colors.main_white,marginLeft: 10,fontSize: 16,position: 'absolute',left: 33,top:Platform.OS =='android' ? 7 : 8,height: 30}} numberOfLines={1}>
          {this.state.placeSelected.name}
        </Text>
      </TouchableOpacity>
    )
  }

  render() {
    const example1 = this.mainExample(
      1,
      `- ${this.state.i18n.recommend_text} -`
    );
    return (
      <Container style={{backgroundColor: '#fff'}}>
        <PlacePickerModel ref={c => this._picker = c} modalVisible={this.state.showPlacePicker} closeFunc={() => this.setState({showPlacePicker: false})} getSeletedValue={(val) => this.getSeletedValue(val)} {...this.props}/>
        <Header
          style={{
            borderBottomWidth: 0,
            padding: 0
          }}
          iosBarStyle="light-content"
        >
        <LinearGradient colors={['#FF7F0B','#FF1A1A']} start={{x:0.0, y:0.0}} end={{x:1.0,y: 0.0}} style={_styles.linearGradient}>
          <TouchableOpacity onPress={() => this.props.navigation.navigate("DrawerOpen")} style={{width: 60,justifyContent:'center',alignItems:'center',marginTop: Platform.OS == 'ios' ? 0 : -8}}>
            <Icon
              name="md-menu"
              size={20}
              style={{ color: "#fff" }}
            />
          </TouchableOpacity>
          <View style={{flex: 1,alignItems:'center',flexDirection:'row',justifyContent:'center',}}>
          {this.state.placeSelected != null ? this._renderPlacePickerBtn() : <ActivityIndicator color={Colors.main_white} style={{marginLeft:-60,}} size="small"/>}
          </View>
        </LinearGradient>
          
        </Header>
        {this.state.isError ? (
          <ErrorPage
            errorToDo={this._onErrorToRetry}
            errorTips="加載失败,請點擊重試"
          />
        ) : null}
        {this.state.loading ? <Loading /> : null}
        {this.state.foodDetails != null && this.state.foodDetails.length >0  ? <BottomOrderConfirm {...this.props} 
        isShow={this.state.isBottomContainerShow} 
        total={this.state.foodCount*this.state.foodDetails[0].price}
        goToOrder={this._goToOrder}
        cancelOrder={this._cancelOrder}/> : null}
        <ScrollView
        style={styles.scrollview}
        scrollEventThrottle={200}
        directionalLockEnabled={true}
        >
        {this.state.formatDate.week != '' ? this._renderDateFormat() : null}
        {/*this._renderWarningView()*/}
        {example1}
        {this.state.foodDetails != null ? this._renderIntrodutionView() : null}
        {this.state.foodDetails != null ? this._renderAddPriceView() : null}
        {this.state.foodDetails != null && this.state.foodDetails.length == 0 ? <BlankPage style={{marginTop:50}} message="暂无数据"/> : null}
        {GLOBAL_PARAMS._winHeight < 652 ? <View style={{height: 80,width: GLOBAL_PARAMS._winWidth}}/> : null}
        </ScrollView>
      </Container>
    );
  }
}

export default HotReloadHOC(ShopSwiperablePage);