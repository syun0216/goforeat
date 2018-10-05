import React, { Component } from "react";
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  AppState,
  ActivityIndicator,
  RefreshControl,
  Linking,
  Platform
} from "react-native";
import {
  Container,
  Header,
} from "native-base";
import Carousel from "react-native-snap-carousel";
import LinearGradient from 'react-native-linear-gradient';
import { sliderWidth, itemWidth } from "../styles/SliderEntry.style";
import SliderEntry from "../components/SliderEntry";
import HotReloadHOC from '../components/HomePageHOC';
//styles
import styles from "../styles/index.style";
import HomePageStyles from "../styles/homepage.style";
// utils
import Colors from "../utils/Colors";
import GLOBAL_PARAMS,{em} from "../utils/global_params";
import JSONUtils from '../utils/JSONUtils';
//api
import { getDailyFoods, adSpace } from '../api/request';
//components
import AdervertiseView from '../components/AdvertiseView';
import ErrorPage from "../components/ErrorPage";
import Loading from "../components/Loading";
import PlacePickerModel from '../components/PlacePickerModel';
import BlankPage from '../components/BlankPage';
import BottomOrderConfirm from '../components/BottomOrderConfirm';
import WarningTips from '../components/WarningTips';
import Text from '../components/UnScalingText';
import SlideUpPanel from '../components/SlideUpPanel';
// language
import I18n from "../language/i18n";
//cache 
import {placeStorage,advertisementStorage} from '../cache/appStorage';

const SLIDER_1_FIRST_ITEM = 0;

const HAS_FOODS = 1;
const NO_MORE_FOODS = 2;
const IS_INTERCEPT = 3;

class HomePage extends Component {
  static navigationOptions = ({screenProps}) => {
    return ({
    tabBarLabel: I18n[screenProps.language].dailyFood
  })};

  _current_offset = 0; 
  _SliderEntry = null; 
  _timer = null; // 延迟加载首页
  _picker = null; // 选择地区picker 实例
  _interval = null;// 首页广告倒计时
  constructor(props) {
    super(props);
    this.state = {
      slider1ActiveSlide: SLIDER_1_FIRST_ITEM,
      shopDetail: null,
      foodDetails: [],
      soldOut: HAS_FOODS, // 是否已售罄
      isError: false,
      loading: false,
      refreshing: false,
      placeSelected: null,
      formatDate: {
        date: '',
        week: '',
        endDate: ''
      },
      refreshParams: '',
      briefNumbersOfLines: GLOBAL_PARAMS._winHeight>667? 4: 3,
      isBottomContainerShow: false,
      foodCount: 0,
      showPlacePicker: false,
      showMoreDetail: false,
      advertiseImg: '',
      advertiseData: null,
      advertiseCountdown: 5,
      isAdvertiseShow: false,
      i18n: I18n[props.screenProps.language]
    };
  }

  componentWillMount() {
    // console.log('homepage willmount');
    let {isAdShow, hideAd} = this.props.screenProps;
    if(isAdShow) {
      hideAd();
    }
    advertisementStorage.getData((error,data) => {
      if(error == null) {
        if(data != null) {
          isAdShow && this.setState({advertiseImg: data.image,advertiseData: data,isAdvertiseShow: true});
          this._advertiseInterval();
        }
        this._getAdvertise(data);
      }
    })
  }

  componentDidMount() {
    // console.log('homepage didmount', this.props.screenProps);
    AppState.addEventListener('change', (nextAppState) =>this._handleAppStateChange(nextAppState))
    
    this._current_offset = 0;
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', (nextAppState) =>this._handleAppStateChange(nextAppState));
    if(this._timer !== null) {
      clearTimeout(this._timer);
    }
    this.isMounted = false;
  }

  _handleAppStateChange(nextAppState) {
    if(nextAppState == 'active') {
      this._reloadPage();
    }
  }

  _reloadPage() {
    if(!this.state.placeSelected && this._picker != null) {
      this._picker.getPlace();
      return;
    }
    this._onRefreshToRequestFirstPageData(this.state.placeSelected.id);
  }

  _formatDate(timestamp,endTimestamp) {
    let {i18n} = this.state;
    // let _Date = new Date(timestamp);
    let _endDate = new Date(endTimestamp);
    // let _date_format = [_Date.getMonth()+1 < 10 ? `0${_Date.getMonth()+1}`:_Date.getMonth()+1 ,
    // _Date.getDate() < 10 ? `0${_Date.getDate()}`:_Date.getDate(),_Date.getFullYear()].join('-');
    let _endDate_format = i18n.endTime;
    let _getWeekDay = (date) => {
      let _week_day = null;
      switch(date) 
      { 
        case 0:_week_day = i18n.sun;break; 
        case 1:_week_day = i18n.mon;break; 
        case 2:_week_day = i18n.tuse;break; 
        case 3:_week_day = i18n.wed;break; 
        case 4:_week_day = i18n.thr;break; 
        case 5:_week_day = i18n.fri;break; 
        case 6:_week_day = i18n.sat;break; 
        default:_week_day = i18n.common_tips.err 
      } 
      return _week_day;
    }
    
    _endDate_format += ` ${_endDate.getHours()}:${_endDate.getMinutes()<10?`0${_endDate.getMinutes()}`:`${_endDate.getMinutes()}`} ${_endDate.getMonth()+1}月${_endDate.getDate()}日 ${_getWeekDay(_endDate.getDay())}`;
    
    let _newFormatDate = Object.assign({},{
      endDate: _endDate_format,
      ...this.state.formatDate
    })
    this.setState({
      formatDate: _newFormatDate
    });
  }
  //api
  _getDailyFoodList(id) {
      getDailyFoods(id).then(data => {
        if(data.ro.respCode == '0000') {
          this.setState({
            foodDetails: data.data.foodList,
            loading: false,
            refreshing: false,
            soldOut: data.data.status,
            formatDate: {
              week: data.data.title,
              date: data.data.subTitle
            }
          })
          if(data.data.status == NO_MORE_FOODS || data.data.status == IS_INTERCEPT) {
            if(this.state.isBottomContainerShow) {
              this.props.navigation.setParams({visible: true})
              this.setState({
                isBottomContainerShow: false,
              })
            }
          }
          this._formatDate(data.data.timestamp,data.data.endTimestamp);
        }
      },() => {
        this.setState({ isError: true, loading: false,refreshing: false });
      })
  }

  _getWarningTips() {
    queryList().then(data => {
      if(data.ro.ok) {
        // console.log(data);
        this.setState({
          warningTipsData: data.data,
          isWarningTipShow: true
        })
      }
    })
  }

  _getAdvertise(old_data) {
    adSpace().then(data => {
      if(data.ro.respCode == '0000') {
        if(data.data.length == 0) { // 如果data为空，则不设置缓存为空
          advertisementStorage.setData(null);
          return;
        }
        if(old_data != null) { // 如果缓存不为空
          if(JSONUtils.jsonDeepCompare(old_data, data.data[0])) {
            return; // 判断缓存是否与服务器数据相等，如果相等则不做操作
          } else{ // 如果缓存不等则覆盖本地缓存为服务器数据
            advertisementStorage.setData(data.data[0]);
            Image.prefetch(data.data[0].image)
          }
        }else { // 如果缓存为空，则缓存到本地
          advertisementStorage.setData(data.data[0]);
          Image.prefetch(data.data[0].image)
        }
      }
    })
    .catch(err => {
      if (axios.isCancel(thrown)) {
        // console.log('Request canceled', thrown.message);
      } 
    })
    
  }

  _advertiseInterval = () => {
    this._interval = setInterval(() => {
      if(this.state.advertiseCountdown > 1) {
        this.setState({
          advertiseCountdown: this.state.advertiseCountdown - 1,
        })
        // console.log(this.state.advertiseCountdown);
      }else {
        this.setState({
          isAdvertiseShow: false
        })
        clearInterval(this._interval);
      }
    },1000)
  }

  _onLoadingToRequestFirstPageData(id) {
    this.setState({loading: true});
    this._timer = setTimeout(() => {
      clearTimeout(this._timer);
      this._getDailyFoodList(id);
    }, 300)
  }

  _onRefreshToRequestFirstPageData(id) {
    if(!id) return;
    this.setState({refreshing: true});
    this._timer = setTimeout(() => {
      clearTimeout(this._timer);
      this._getDailyFoodList(id);
    }, 800)
  }

  _onErrorToRetry = () => {
    this.setState({
      loading: true,
      isError: false
    });
    placeStorage.getData((error, data) => {
      if (error === null) {
        if (data !== null) {
          this._picker != null && this._picker.getPlace(data);
        }else {
          this._picker != null && this._picker.getPlace();
        }
      }
    })
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
    this._onLoadingToRequestFirstPageData(val.id);
    this.props.navigation.setParams({visible: true})
  }

  _goToOrder = () => {
    let {foodId,price} = this.state.foodDetails[0];
    let {placeSelected,foodCount} = this.state;
    if(this.props.screenProps.user !== null) {
      this.props.navigation.navigate("Order", {
          foodId,
          placeId: placeSelected.id,
          amount: foodCount,
          total: foodCount*price
      })
  }else {
    if(placeSelected.id){
      this.props.navigation.navigate("Login",{page:'Order',foodId,placeId: placeSelected.id,amount: foodCount,total: foodCount*price,reloadFunc: () => this._reloadWhenCancelLogin()});
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
    let {params: {visible}} = this.props.navigation.state;
    this.setState({
      isBottomContainerShow: false,
      foodCount: 0
    })
    !visible && this.props.navigation.setParams({visible: true})
  }

  

  //render function 
  _renderAdvertisementView() {
    return (
      <AdervertiseView 
      modalVisible={this.state.isAdvertiseShow} seconds={this.state.advertiseCountdown} image={this.state.advertiseImg} data={this.state.advertiseData} countDown={this.state.advertiseCountdown}  closeFunc={() => this.setState({
        isAdvertiseShow: false
      })} {...this.props}
      />
    )
  }  

  _renderHeaderView() {
    let {placeSelected} = this.state;
    let {navigate} = this.props.navigation;
    const scheme = Platform.select({ ios: 'http://maps.apple.com/?q=', android: 'geo:0,0?q=' });
    return (
      <Header
          style={HomePageStyles.Header}
          iosBarStyle="light-content"
          androidStatusBarColor="#333"
        >
        <LinearGradient colors={['#FF7F0B','#FF1A1A']} start={{x:0.0, y:0.0}} end={{x:1.0,y: 0.0}} style={HomePageStyles.linearGradient}>
          <TouchableOpacity onPress={() => navigate("DrawerOpen", { callback: this._add })} style={HomePageStyles.MenuBtn}>
            <Image source={require('../asset/menu.png')} style={HomePageStyles.MenuImage} resizeMode="contain"/>
            {/*<Image source={require('../asset/Oval.png')} style={{width: 10,height: 10,position: 'absolute',top: 10, right: 10}}/>*/}
          </TouchableOpacity>
          <View style={HomePageStyles.HeaderContent}>
            {placeSelected != null ? this._renderPlacePickerBtn() : <ActivityIndicator color={Colors.main_white} size="small"/>}
          </View>
          <TouchableOpacity onPress={() => Linking.openURL(`${scheme}${placeSelected.name}`)} style={HomePageStyles.MenuBtn}>
            <Image source={require('../asset/location_white.png')} style={HomePageStyles.locationImage} resizeMode="contain"/>
          </TouchableOpacity>
        </LinearGradient>
      </Header>
    )
  }

  _renderPlacePickerBtn() {
    return (
      <TouchableOpacity style={HomePageStyles.PlacePickerBtn} onPress={() => this.setState({showPlacePicker: true})}>
        <View style={HomePageStyles.PlacePickerBtnBgAbsolute}/>
        <Text style={HomePageStyles.PlacePickerBtnText} numberOfLines={1}>
          {this.state.placeSelected.name}
        </Text>
        <Image source={require('../asset/arrow_down.png')} style={HomePageStyles.PlacePickerBtnImage} resizeMode="contain"/>
      </TouchableOpacity>
    )
  }

  _renderPlacePicker() {
    let {showPlacePicker} = this.state;
    return (
      <PlacePickerModel ref={c => this._picker = c} modalVisible={showPlacePicker} closeFunc={() => this.setState({showPlacePicker: false})} getSeletedValue={(val) => this.getSeletedValue(val)} {...this.props}/>
    )
  }

  _renderDateFormat() {
    return (
      <View style={HomePageStyles.DateFormatView}>
        <Text style={HomePageStyles.DateFormatWeekText}>
        {this.state.formatDate.week}</Text>
        <Text style={HomePageStyles.DateFormatDateText}>{this.state.formatDate.date}</Text>
      </View>
    )
  }

  _renderWarningView() {
    return (
      <WarningTips {...this.props}/>
    )
  }

  _renderMainView() {
    const { foodDetails } = this.state;

    return foodDetails.length > 0  ? (
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
          inactiveSlideOpacity={0.5}
          // inactiveSlideShift={20}
          containerCustomStyle={styles.slider}
          contentContainerCustomStyle={styles.sliderContentContainer}
          loop={true}
          loopClonesPerSide={2}
          autoplay={false}
          autoplayDelay={3000}
          autoplayInterval={4000}
          onSnapToItem={index => this.setState({ slider1ActiveSlide: index })}
        />
      </View>
    ) : null;
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

  _renderIntroductionView() {
    let {foodDetails:{[0]:{foodName, canteenName, foodBrief}}} = this.state;
    return (
      <View style={HomePageStyles.IntroductionView}>
      <View style={HomePageStyles.IntroductionFoodNameCotainer}>
        <Text style={HomePageStyles.IntroductionFoodName} numberOfLines={1}>{foodName}</Text>
        <Text style={HomePageStyles.IntroductionDetailBtn} onPress={() => this.slideUpPanel._snapTo()}>{this.state.i18n.foodDetail}</Text>
      </View>
        {canteenName != null ? <Text style={HomePageStyles.canteenName}>餐廳:{canteenName}</Text> : null}
        <Text style={HomePageStyles.IntroductionFoodBrief} numberOfLines={this.state.briefNumbersOfLines} onLayout={e => {
          const {height} = e.nativeEvent.layout;
          let _lineHeight = Platform.OS === 'ios' ? em(20) : em(25)
          this.setState({
            briefNumbersOfLines: Math.ceil(height/_lineHeight)
          })
        }}>{foodBrief}</Text>
      </View>
    )
  }

  _renderMoreDetailModal() {
    let {foodDetails:{[0]:{foodName, canteenName, canteenAddress, foodBrief, extralImage, price, originPrice}}} = this.state;
    return (
      <SlideUpPanel ref={r => this.slideUpPanel = r}>
        <View onLayout={e => {
          if(!!this.slideUpPanel) {
            this.slideUpPanel.changeTop(e.nativeEvent.layout.height + em(100))
          }
        }}>
          <Text style={HomePageStyles.panelTitle} numberOfLines={3}>{foodName}</Text>
          <Image style={HomePageStyles.panelImage} source={{uri: extralImage[0]}}/>
          {canteenName != null ?<Text style={HomePageStyles.canteenName}>餐廳:{canteenName}</Text> : null}
          {canteenAddress != null ? <Text style={HomePageStyles.canteenName}>餐廳地址:{canteenAddress}</Text> : null}
          <Text style={HomePageStyles.IntroductionFoodBrief} >{foodBrief}</Text>
          <View style={HomePageStyles.AddPriceViewPriceContainer}>
            <Text style={HomePageStyles.AddPriceViewPriceUnit}>HKD</Text>
            <Text style={HomePageStyles.AddPriceViewPrice}>{price}</Text>
            {
              originPrice != null ? <Text style={HomePageStyles.AddPriceViewOriginPrice}>HKD {originPrice}</Text> : null
            }
            {originPrice != null ? <View style={HomePageStyles.AddPriceViewStriping}/> : null}
          </View>
        </View>
      </SlideUpPanel>
    )
  } 

  _renderAddPriceView() {
    let {foodDetails,i18n,soldOut} = this.state;
    return (
      <View style={HomePageStyles.AddPriceView}>
        <View style={HomePageStyles.AddPriceViewPriceContainer}>
          <Text style={HomePageStyles.AddPriceViewPriceUnit}>HKD</Text>
          <Text style={HomePageStyles.AddPriceViewPrice}>{foodDetails[0].price}</Text>
          {
            foodDetails[0].originPrice != null ? <Text style={HomePageStyles.AddPriceViewOriginPrice}>HKD {foodDetails[0].originPrice}</Text> : null
          }
          {foodDetails[0].originPrice != null ? <View style={HomePageStyles.AddPriceViewStriping}/> : null}
        </View>
        {
          soldOut == HAS_FOODS ? (
            <View style={HomePageStyles.AddPriceViewCountContainer}>
              <TouchableOpacity onPress={() => this._remove()} style={HomePageStyles.AddPriceViewCommonBtn}>
              <Image source={require("../asset/remove.png")} style={HomePageStyles.AddPriceViewAddImage} resizeMode="contain"/>
              </TouchableOpacity>
              <Text style={HomePageStyles.AddPriceViewCountText} numberOfLines={1}>{this.state.foodCount}</Text>
              <TouchableOpacity onPress={() => this._add()} style={HomePageStyles.AddPriceViewCommonBtn}>
                  <Image source={require("../asset/add.png")} style={HomePageStyles.AddPriceViewRemoveImage} resizeMode="contain"/>
              </TouchableOpacity>    
          </View>
          ) : 
          soldOut == NO_MORE_FOODS ?
          (
            <View style={HomePageStyles.AddPriceViewCountContainer}>
              <Text style={HomePageStyles.AddPriceViewPriceUnit}>{i18n.soldout}</Text>
            </View>
          ) : 
          (
            <View style={HomePageStyles.AddPriceViewCountContainer}>
              <Text style={HomePageStyles.AddPriceViewPriceUnit}>{i18n.intercept}</Text>
            </View>
          )
        }
      </View>
    )
  }

  _renderDeadLineDate() {
    return(
      <View style={HomePageStyles.DeadLineDateView}>
        <Text style={HomePageStyles.DeadLineDateText}>{this.state.formatDate.endDate}</Text>
      </View>
    )
  }
  
  _renderContentView() {
    const main_view = this._renderMainView();
    let {placeSelected,foodDetails,refreshing,formatDate: {week}} = this.state;
    return (
      <ScrollView
        style={styles.scrollview}
        scrollEventThrottle={200}
        directionalLockEnabled={true}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => this._onRefreshToRequestFirstPageData(placeSelected.id)}
          />
        }
        >
          {week != '' ? this._renderDateFormat() : null}
          {this._renderWarningView()}
          {main_view}
          {foodDetails.length > 0 ? (
            <View>
              {this._renderIntroductionView()}
              {this._renderAddPriceView()}
              {this._renderDeadLineDate()}
            </View>
          ) : <BlankPage style={{marginTop:50}} message="暂无数据"/>}
          {<View style={HomePageStyles.BottomView}/>}
        </ScrollView>
    )
  }

  _renderBottomBtnView() {
    let {i18n, isBottomContainerShow,foodCount, foodDetails} = this.state;
    return (
      <BottomOrderConfirm btnMessage={i18n.book} {...this.props} 
      isShow={isBottomContainerShow} 
      total={foodCount*foodDetails[0].price}
      btnClick={this._goToOrder}
      cancelOrder={this._cancelOrder}/>
    )
  }

  _renderErrorView() {
    let {i18n} = this.state;
    return (
      <ErrorPage
        errorToDo={this._onErrorToRetry}
        errorTips={i18n.common_tips.reload}
      />
    )
  }

  render() {
    let { loading, isError,foodDetails } = this.state;
  
    return (
      <Container style={HomePageStyles.ContainerBg}>
        {this._renderAdvertisementView()}
        {this._renderPlacePicker()}
        {this._renderHeaderView()}
        {isError ? this._renderErrorView() : null}
        {loading ? <Loading /> : null}
        {foodDetails.length > 0 ? this._renderContentView() : null}
        {foodDetails.length > 0 ? this._renderBottomBtnView() : null}
        {foodDetails.length > 0 ? this._renderMoreDetailModal() : null}
      </Container>
    );
  }
}

export default HotReloadHOC(HomePage);