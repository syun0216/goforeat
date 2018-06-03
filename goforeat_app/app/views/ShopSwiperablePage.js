import React, { Component } from "react";
import {
  Platform,
  View,
  ScrollView,
  Text,
  StatusBar,
  SafeAreaView,
  Image,
  TouchableOpacity,
  AppState,
  Alert,
  Animated,
  ActivityIndicator,
} from "react-native";
import {
  Container,
  Button,
  Icon,
  Header,
  Left,
  Body,
  Right
} from "native-base";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { sliderWidth, itemWidth } from "../styles/SliderEntry.style";
import SliderEntry from "../components/SliderEntry";
import HotReloadHOC from '../components/HotReloadHOC';
import styles, { colors } from "../styles/index.style";
import { ENTRIES1, ENTRIES2 } from "../static/entries";
import { scrollInterpolators, animatedStyles } from "../utils/animations";
// utils
import Colors from "../utils/Colors";
import GLOBAL_PARAMS from "../utils/global_params";
import ToastUtil from "../utils/ToastUtil";
//api
import api from "../api";
//components
import CommonHeader from "../components/CommonHeader";
import ErrorPage from "../components/ErrorPage";
import Loading from "../components/Loading";
import PlacePickerModel from '../components/PlacePickerModel';
import BlankPage from '../components/BlankPage';
import BottomOrderConfirm from '../components/BottomOrderConfirm';
//language
import i18n from "../language/i18n";
//codepush
import CodePush from "react-native-code-push";
import CodePushUtils from "../utils/CodePushUtils";
import * as TextUtils from "../utils/TextUtils";
import * as JSONUtils from "../utils/JSONUtils";

const IS_ANDROID = Platform.OS === "android";
const SLIDER_1_FIRST_ITEM = 1;

class ShopSwiperablePage extends Component {
  _current_offset = 0;
  _SliderEntry = null;
  _timer = null;
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
      isBottomContainerShow: false,
      foodCount: 0,
      showPlacePicker: false
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      i18n: i18n[nextProps.screenProps.language]
    });
    this._reloadPage();
  }

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
    this._getDailyFoodList();
  };

  _refresh = () => {
    this._current_offset += 15;
    this.setState({
      loading: true
    });
    this._getDailyFoodList();
  };

  getSeletedValue = (val) => {
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
      this.props.navigation.navigate("Login",{foodId,placeId: placeSelected.id,amount: foodCount,reloadFunc: () => this._reloadWhenCancelLogin()});
    }
    }
  }

  _reloadWhenCancelLogin() {
    this._reloadPage();
  }

  _cancelOrder = () => {
    this.setState({
      isBottomContainerShow: false,
      foodCount: 0
    })
    
  }

  _renderDateFormat() {
    return (
      <View style={{marginTop:10,marginLeft:GLOBAL_PARAMS._winWidth*0.1}}>
        <Text style={{color: this.props.screenProps.theme,fontSize: 20}}>
        {this.state.formatDate.week}的餐單</Text>
        <Text style={{color: this.props.screenProps.theme,fontSize: 13}}>{this.state.formatDate.date}</Text>
      </View>
    )
  }

  _renderItem({ item, index }) {
    return (
      <SliderEntry
        data={item}
        even={(index + 1) % 2 === 0}
        {...this["props"]}
      />
    );
  }

  _renderItemWithParallax({ item, index }, parallaxProps) {
    return (
      this.state.placeSelected != null ?
      <SliderEntry
        ref={(se) => this._SliderEntry = se}
        data={item}
        even={(index + 1) % 2 === 0}
        placeId={this.state.placeSelected.id}
        getCount={(count) => {
          if(count > 0) {
            this.setState({
              isBottomContainerShow: true,
              foodCount: count
            })
          }else {
            this.setState({
              isBottomContainerShow: false,
              foodCount: 0
            })
          }
        }}
        count={this.state.foodCount}
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
          data={this.state.foodDetails}
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
      <TouchableOpacity style={{flexDirection:'row',marginLeft:-30,maxWidth: 200}} onPress={() => this.setState({showPlacePicker: true})}>
        <Image source={require('../asset/icon-location.png')} style={{width: 20,height: 20}}/>
        <Text style={{color: Colors.main_white,marginLeft: 10,fontSize: 16}} numberOfLines={1}>
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
      <Container>
        <PlacePickerModel modalVisible={this.state.showPlacePicker} closeFunc={() => this.setState({showPlacePicker: false})} getSeletedValue={(val) => this.getSeletedValue(val)} {...this.props}/>
        <Header
          style={{
            backgroundColor: this.props.screenProps.theme,
            borderBottomWidth: 0
          }}
          iosBarStyle="light-content"
        >
          <View style={{width: 30,justifyContent:'center',alignItems:'center'}}>
            <Icon
              onPress={() => this.props.navigation.navigate("DrawerOpen")}
              name="md-menu"
              size={20}
              style={{ color: "#fff" }}
            />
          </View>
          <View style={{flex: 1,alignItems:'center',flexDirection:'row',justifyContent:'center',}}>
            {/*<Text style={{ color: Colors.main_white, fontSize: 16 }}>
              {this.state.i18n.takeout_title}
        </Text>*/}
          {this.state.placeSelected != null ? this._renderPlacePickerBtn() : <ActivityIndicator color={Colors.main_white} style={{marginLeft:-30,}} size="small"/>}
          </View>
        </Header>
        {this.state.isError ? (
          <ErrorPage
            errorToDo={this._onErrorToRetry}
            errorTips="加載失败,請點擊重試"
          />
        ) : null}
        {this.state.loading ? <Loading message="玩命加載中..." /> : null}
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
        {example1}
        {this.state.foodDetails != null && this.state.foodDetails.length == 0 ? <BlankPage style={{marginTop:50}} message="暂无数据"/> : null}
          {/*<View style={{height:GLOBAL_PARAMS._winHeight*0.15,flexDirection:'row',backgroundColor:this.props.screenProps.theme}}>
                          <TouchableOpacity style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                            <Image style={{width:72,height:72}} source={{uri:'dislike'}}/>
                          </TouchableOpacity>
                          <TouchableOpacity style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                            <Image style={{width:72,height:72}} source={{uri:'like'}}/>
                          </TouchableOpacity>
                        </View>*/}
        </ScrollView>
      </Container>
    );
  }
}

export default HotReloadHOC(ShopSwiperablePage);