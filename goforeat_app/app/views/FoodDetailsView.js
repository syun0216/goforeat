import React, { Component } from "react";
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  AppState,
  RefreshControl,
  Platform,
  TouchableWithoutFeedback
} from "react-native";
import {
  Container,
  Icon,
} from "native-base";
import Carousel from "react-native-snap-carousel";
import LottieView from 'lottie-react-native';
import { sliderWidth, itemWidth } from "../styles/SliderEntry.style";
import SliderEntry from "../components/SliderEntry";
//styles
import styles from "../styles/index.style";
import FoodDetailsStyles from "../styles/fooddetails.style";
// utils
import GLOBAL_PARAMS,{em} from "../utils/global_params";
import ToastUtil from "../utils/ToastUtil";
//api
import { getFoodDetails, myFavorite } from '../api/request';
//components
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

const isFavorite = 1;
const isNotFavorite = 0;

class FoodDetailsView extends Component {

  constructor(props) {
    super(props);
    this._current_offset = 0; 
    this._SliderEntry = null; 
    this._timer = null; // 延迟加载首页
    this.dateFoodId = this.props.navigation.state.params.dateFoodId;
    this.lastTap = null; //双击点赞
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
      isFavorite: false,
      favoriteCount: 56,
      showMoreDetail: false,
      i18n: I18n[props.screenProps.language]
    };
  }

  componentWillMount() {
    this._onRefreshToRequestFirstPageData(this.dateFoodId);
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
      this._onRefreshToRequestFirstPageData(this.dateFoodId);
    }
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
            favoriteCount: data.data.likeCount,
            isFavorite:data.data.like == isFavorite
          }, () => {
            this.state.isFavorite && this._lv ? this._lv.play() : this._lv.reset();
          })
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

  _handleDoubleTap() {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if(this.lastTap && (now - this.lastTap < DOUBLE_PRESS_DELAY)) {
      this._onFavorite();
    } else {
      this.lastTap = now;
    }
  }

  _onFavorite() {
    let {foodId} = this.state.foodDetails;
    
    this.setState({
      isFavorite: !this.state.isFavorite,
      favoriteCount: !this.state.isFavorite ? this.state.favoriteCount+1:this.state.favoriteCount-1
    }, () => {
      if(this.state.isFavorite) {
        this._lv && this._lv.play();
      } else {
        this._lv && this._lv.reset();
      }
    });
    let status = !this.state.isFavorite ? isFavorite : isNotFavorite;
    myFavorite(foodId, status).then(data => {
      if(data.ro.ok) {
        return;
      }
    })
  }

  _goToOrder() {
    let {foodDetails:{price}, foodCount} = this.state;
    let _defaultObj = {
      page: 'Order',
      dateFoodId: this.dateFoodId,
      amount: foodCount,
      total: foodCount*price
    }
    if(this.props.screenProps.user !== null) {
      this.props.navigation.navigate("Order", _defaultObj);
  }else {
    if(this.dateFoodId){
      this.props.navigation.navigate("Login", Object.assign(_defaultObj,{reloadFunc: () => this._reloadWhenCancelLogin()}));
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
    this._onRefreshToRequestFirstPageData(this.dateFoodId);
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
        {this.state.foodDetails.title}</Text>
        <Text style={FoodDetailsStyles.DateFormatDateText}>{this.state.foodDetails.subTitle}</Text>
      </View>
    )
  }

  _renderMainView() {
    const { foodDetails } = this.state;
    return foodDetails != null  ? (
      <View style={[styles.exampleContainer, { marginTop: -15 }]}>
        <Carousel
          ref={c => (this._slider1Ref = c)}
          data={foodDetails.extralImage}
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
      <SliderEntry
        ref={(se) => this._SliderEntry = se}
        data={item}
        even={(index + 1) % 2 === 0}
        clickFunc={() => this._handleDoubleTap()}
        {...this.props}
        // parallax={true}
        // parallaxProps={parallaxProps}
      />
    );
  }

  _renderHeartView() {
    return (
      <LottieView
        ref={lv => this._lv = lv}
        autoPlay={false}
        style={{width: em(55),height: em(55),position: 'absolute',left: em(-15),top: em(-6)}}
        source={require('../animations/like_button.json')}
        loop={false}
        enableMergePathsAndroidForKitKatAndAbove
      />
    )
  }

  _renderIntroductionView() {
    let {foodDetails:{foodName, canteenName, foodBrief}, isFavorite, favoriteCount} = this.state;
    const _isFavorite = () => (isFavorite ? null : <Icon style={FoodDetailsStyles.canteenFavorite} name="md-heart-outline"/>);
    return (
      <View style={FoodDetailsStyles.IntroductionView}>
      <View style={FoodDetailsStyles.IntroductionFoodNameCotainer}>
        <Text style={FoodDetailsStyles.IntroductionFoodName} numberOfLines={1}>{foodName}</Text>
        <TouchableWithoutFeedback onPress={() => this._onFavorite()}>
          <View style={{position:'relative',flexDirection: 'row'}}>
            {this._renderHeartView()} 
            {_isFavorite()}
            <Text style={FoodDetailsStyles.canteenName}>{favoriteCount}次贊</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
      <View style={FoodDetailsStyles.IntroductionFoodNameCotainer}>
        {canteenName != null ? <Text style={FoodDetailsStyles.canteenName}>
        <Image style={FoodDetailsStyles.canteenImg} source={require('../asset/food.png')} />
        {' '+canteenName}</Text> : null}
        <Text style={FoodDetailsStyles.IntroductionDetailBtn} onPress={() => this.slideUpPanel._snapTo()}>{this.state.i18n.foodDetail}</Text>
      </View>
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
          {'  '+canteenName}</Text> : null}
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
          {foodDetails != null ? this._renderDateFormat() : null}
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
    let {i18n, soldOut,foodCount, foodDetails} = this.state;
    return (
      <BottomOrderConfirm btnMessage={i18n.book} {...this.props} 
      isShow={true} 
      total={foodCount*foodDetails.price}
      btnClick={() => {
        if(soldOut == HAS_FOODS) {
          this._goToOrder()
        } else {
          ToastUtil.showWithMessage('已停止下單');
        }
      }}
      cancelOrder={this._cancelOrder}/>
    )
  }

  _renderErrorView() {
    let {i18n} = this.state;
    return (
      <ErrorPage
        errorToDo={this._onRefreshToRequestFirstPageData}
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