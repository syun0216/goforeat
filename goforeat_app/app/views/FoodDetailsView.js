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
//styles
import styles from "../styles/index.style";
import FoodDetailsStyles from "../styles/fooddetails.style";
// utils
import Colors from "../utils/Colors";
import GLOBAL_PARAMS,{em} from "../utils/global_params";
//api
import { getDailyFoods, getFoodDetails } from '../api/request';
//components
import AdervertiseView from '../components/AdvertiseView';
import ErrorPage from "../components/ErrorPage";
import Loading from "../components/Loading";
import BlankPage from '../components/BlankPage';
import BottomOrderConfirm from '../components/BottomOrderConfirm';
import Text from '../components/UnScalingText';
import SlideUpPanel from '../components/SlideUpPanel';
import CommonHeader from '../components/CommonHeader';
// language
import I18n from "../language/i18n";
//cache 
import {placeStorage} from '../cache/appStorage';

const SLIDER_1_FIRST_ITEM = 0;

const HAS_FOODS = 1;
const NO_MORE_FOODS = 2;
const IS_INTERCEPT = 3;

class FoodDetailsView extends Component {

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
      foodDetails: null,
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
      foodCount: 1,
      showMoreDetail: false,
      i18n: I18n[props.screenProps.language]
    };
  }

  componentWillMount() {
    let {dateFoodId} = this.props.navigation.state.params;
    this._onRefreshToRequestFirstPageData(dateFoodId);
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
  _getFoodDetails(id) {
      getFoodDetails(id).then(data => {
        if(data.ro.respCode == '0000') {
          this.setState({
            foodDetails: data.data,
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
        }
      },() => {
        this.setState({ isError: true, loading: false,refreshing: false });
      })
  }

  _onRefreshToRequestFirstPageData(id) {
    if(!id) return;
    this.setState({loading: true});
    this._timer = setTimeout(() => {
      clearTimeout(this._timer);
      this._getFoodDetails(id);
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

  _goToOrder = () => {
    let {foodId,price} = this.state.foodDetails;
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
  }

  _remove() {
    if(this.state.foodCount == 1) {
      this.props.navigation.setParams({visible: true})
      this.setState({
        isBottomContainerShow: false,
      })
    }
    if(this.state.foodCount == 1) {
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
    this.props.navigation.goBack();
  }

  //render function
  _renderHeaderView() {
    const {i18n} = this.state;
    return (
      <CommonHeader title={i18n.dailyFood} canBack />
    )
  }

  _renderDateFormat() {
    return (
      <View style={FoodDetailsStyles.DateFormatView}>
        <Text style={FoodDetailsStyles.DateFormatWeekText}>
        {this.state.formatDate.week}</Text>
        <Text style={FoodDetailsStyles.DateFormatDateText}>{this.state.formatDate.date}</Text>
      </View>
    )
  }

  _renderMainView() {
    const { foodDetails } = this.state;

    return foodDetails != null  ? (
      <View style={[styles.exampleContainer, { marginTop: -15 }]}>
        {/*<Text style={[styles.title,{color:'#1a1917'}]}>商家列表</Text>*/}
        <Carousel
          ref={c => (this._slider1Ref = c)}
          data={[foodDetails.extralImage]}
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
        // star={this.state.foodDetails.star}
        even={(index + 1) % 2 === 0}
        placeId={this.state.placeSelected.id}
        {...this.props}
        // parallax={true}
        // parallaxProps={parallaxProps}
      /> : null
    );
  }

  _renderIntroductionView() {
    let {foodDetails:{foodName, canteenName, foodBrief}} = this.state;
    return (
      <View style={FoodDetailsStyles.IntroductionView}>
      <View style={FoodDetailsStyles.IntroductionFoodNameCotainer}>
        <Text style={FoodDetailsStyles.IntroductionFoodName} numberOfLines={1}>{foodName}</Text>
        <Text style={FoodDetailsStyles.IntroductionDetailBtn} onPress={() => this.slideUpPanel._snapTo()}>{this.state.i18n.foodDetail}</Text>
      </View>
        {canteenName != null ? <Text style={FoodDetailsStyles.canteenName}>
        <Image style={FoodDetailsStyles.canteenImg} source={require('../asset/food.png')} />
        {' '+canteenName}</Text> : null}
        <Text style={FoodDetailsStyles.IntroductionFoodBrief} numberOfLines={this.state.briefNumbersOfLines} onLayout={e => {
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
    let {foodDetails:{foodName, canteenName, canteenAddress, foodBrief, extralImage, price, originPrice}} = this.state;
    return (
      <SlideUpPanel ref={r => this.slideUpPanel = r}>
        <View onLayout={e => {
          if(!!this.slideUpPanel) {
            this.slideUpPanel.changeTop(e.nativeEvent.layout.height + em(100))
          }
        }}>
          <Text style={FoodDetailsStyles.panelTitle} numberOfLines={3}>{foodName}</Text>
          <Image style={FoodDetailsStyles.panelImage} source={{uri: extralImage[0]}}/>
          {canteenName != null ?<Text style={FoodDetailsStyles.canteenName}>
          <Image style={FoodDetailsStyles.canteenImg} source={require('../asset/food.png')} />
          {canteenName}</Text> : null}
          {canteenAddress != null ? <Text style={FoodDetailsStyles.canteenName}>餐廳地址:{canteenAddress}</Text> : null}
          <Text style={FoodDetailsStyles.IntroductionFoodBrief} >{foodBrief}</Text>
          <View style={FoodDetailsStyles.AddPriceViewPriceContainer}>
            <Text style={FoodDetailsStyles.AddPriceViewPriceUnit}>HKD</Text>
            <Text style={FoodDetailsStyles.AddPriceViewPrice}>{price}</Text>
            {
              originPrice != null ? <Text style={FoodDetailsStyles.AddPriceViewOriginPrice}>HKD {originPrice}</Text> : null
            }
            {originPrice != null ? <View style={FoodDetailsStyles.AddPriceViewStriping}/> : null}
          </View>
        </View>
      </SlideUpPanel>
    )
  } 

  _renderAddPriceView() {
    let {foodDetails,i18n,soldOut} = this.state;
    return (
      <View style={FoodDetailsStyles.AddPriceView}>
        <View style={FoodDetailsStyles.AddPriceViewPriceContainer}>
          <Text style={FoodDetailsStyles.AddPriceViewPriceUnit}>HKD</Text>
          <Text style={FoodDetailsStyles.AddPriceViewPrice}>{foodDetails.price}</Text>
          {
            foodDetails.originPrice != null ? <Text style={FoodDetailsStyles.AddPriceViewOriginPrice}>HKD {foodDetails.originPrice}</Text> : null
          }
          {foodDetails.originPrice != null ? <View style={FoodDetailsStyles.AddPriceViewStriping}/> : null}
        </View>
        {
          soldOut == HAS_FOODS ? (
            <View style={FoodDetailsStyles.AddPriceViewCountContainer}>
              <TouchableOpacity onPress={() => this._remove()} style={FoodDetailsStyles.AddPriceViewCommonBtn}>
              <Image source={require("../asset/remove.png")} style={FoodDetailsStyles.AddPriceViewAddImage} resizeMode="contain"/>
              </TouchableOpacity>
              <Text style={FoodDetailsStyles.AddPriceViewCountText} numberOfLines={1}>{this.state.foodCount}</Text>
              <TouchableOpacity onPress={() => this._add()} style={FoodDetailsStyles.AddPriceViewCommonBtn}>
                  <Image source={require("../asset/add.png")} style={FoodDetailsStyles.AddPriceViewRemoveImage} resizeMode="contain"/>
              </TouchableOpacity>    
          </View>
          ) : 
          soldOut == NO_MORE_FOODS ?
          (
            <View style={FoodDetailsStyles.AddPriceViewCountContainer}>
              <Text style={FoodDetailsStyles.AddPriceViewPriceUnit}>{i18n.soldout}</Text>
            </View>
          ) : 
          (
            <View style={FoodDetailsStyles.AddPriceViewCountContainer}>
              <Text style={FoodDetailsStyles.AddPriceViewPriceUnit}>{i18n.intercept}</Text>
            </View>
          )
        }
      </View>
    )
  }
  
  _renderContentView() {
    const main_view = this._renderMainView();
    let {foodDetails,refreshing,formatDate: {week}} = this.state;
    let {dateFoodId} = this.props.navigation.state.params;
    return (
      <ScrollView
        style={styles.scrollview}
        scrollEventThrottle={200}
        directionalLockEnabled={true}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => this._onRefreshToRequestFirstPageData(dateFoodId)}
          />
        }
        >
          {week != '' ? this._renderDateFormat() : null}
          {main_view}
          {foodDetails != null ? (
            <View>
              {this._renderIntroductionView()}
              {this._renderAddPriceView()}
            </View>
          ) : <BlankPage style={{marginTop:50}} message="暂无数据"/>}
          {<View style={FoodDetailsStyles.BottomView}/>}
        </ScrollView>
    )
  }

  _renderBottomBtnView() {
    let {i18n, isBottomContainerShow,foodCount, foodDetails} = this.state;
    return (
      <BottomOrderConfirm btnMessage={i18n.book} {...this.props} 
      isShow={true} 
      total={foodCount*foodDetails.price}
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
      <Container style={FoodDetailsStyles.ContainerBg}>
        {this._renderHeaderView()}
        {isError ? this._renderErrorView() : null}
        {loading ? <Loading /> : null}
        {foodDetails != null ? this._renderContentView() : null}
        {foodDetails != null ? this._renderBottomBtnView() : null}
        {foodDetails != null ? this._renderMoreDetailModal() : null}
      </Container>
    );
  }
}

export default FoodDetailsView;