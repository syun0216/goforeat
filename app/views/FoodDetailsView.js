import React, { Component } from "react";
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
  Platform,
  TouchableWithoutFeedback,
  Switch
} from "react-native";
import Share from "react-native-share";
import Antd from "react-native-vector-icons/AntDesign";
import {Overlay} from "teaset";
import Carousel from "react-native-snap-carousel";
import LottieView from "lottie-react-native";
import { sliderWidth } from "../styles/SliderEntry.style";
import SliderEntry from "../components/SliderEntry";
import {isNil} from 'lodash';
//styles
import styles from "../styles/index.style";
import FoodDetailsStyles from "../styles/fooddetails.style";
// utils
import GLOBAL_PARAMS, {
  em,
  HAS_FOODS,
  NO_MORE_FOODS,
  IS_INTERCEPT
} from "../utils/global_params";
import ToastUtil from "../utils/ToastUtil";
//api
import { getFoodDetails, myFavorite, getCommentList } from "../api/request";
//components
import PannelBottom from '../components/PannelBottom';
import ErrorPage from "../components/ErrorPage";
import BottomOrderConfirm from "../components/BottomOrderConfirm";
import Text from "../components/UnScalingText";
import SlideUpPanel from "../components/SlideUpPanel";
import CommonHeader from "../components/CommonHeader";
import ShareComponent from "../components/ShareComponent";
import ShimmerPlaceHolder from "../components/ShimmerPlaceholder";
import CustomizeContainer from "../components/CustomizeContainer";
import CommonFlatList from "../components/CommonFlatList";

const WeChat = require("react-native-wechat");

const SLIDER_1_FIRST_ITEM = 0;

const isFavorite = 1;
const isNotFavorite = 0;

function wp(percentage) {
  const value = (percentage * GLOBAL_PARAMS._winWidth) / 100;
  return Math.round(value);
}

const slideWidthSingle = wp(100) - em(30);
const slideWidthMulti = wp(80);
const itemHorizontalMargin = wp(1);

const { _winHeight, _winWidth } = GLOBAL_PARAMS;

class FoodDetailsView extends Component {
  _commentView = null;
  constructor(props) {
    super(props);
    WeChat.registerApp("wx5b3f09ef08ffa7a7"); // 微信id
    this._current_offset = 0;
    this._SliderEntry = null;
    this._panelBottom = null; // 評論底部彈框
    this._timer = null; // 延迟加载首页
    this.dateFoodId = this.props.navigation.state.params.dateFoodId;
    this.lastTap = null; //双击点赞
    this.state = {
      slider1ActiveSlide: SLIDER_1_FIRST_ITEM,
      shopDetail: null, // 商店详情
      foodDetails: null, // 菜品详情
      soldOut: HAS_FOODS, // 是否已售罄
      isError: false, // 是否加载出错
      loading: false, // 是否显示加载器
      refreshing: false, // 是否在刷新
      placeSelected: null, // 地区选择
      formatDate: { // 格式化日期
        date: "",
        week: "",
        endDate: ""
      },
      briefNumbersOfLines: GLOBAL_PARAMS._winHeight > 667 ? 4 : 3, // 简介显示多少列
      foodCount: 1, // 购买菜品数量
      isFavorite: false, // 是否被收藏
      isShareListShow: false, // 是否展示分享列表
      favoriteCount: 56, // 收藏总数
      showMoreDetail: false, //是否展示更多内容
      isAddFruit: false, // 是否添加水果
      isIntroOpen: false, // 是否展開菜品介紹
      commentTitle: '用戶評論', // 評論title
    };
  }

  componentDidMount() {
    if (this.props.getCache(`Food${this.dateFoodId}`)) {
      this.setState(
        {
          ...this.props.getCache(`Food${this.dateFoodId}`)
        },
        () => {
          if (Platform.OS == "ios") {
            this.state.isFavorite && this._lv && this._lv
              ? this._lv.play()
              : this._lv.reset();
          }
        }
      );
    } else {
      this._onRefreshToRequestFirstPageData(this.dateFoodId);
    }
    this._current_offset = 0;
  }

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    if (this._timer !== null) {
      clearTimeout(this._timer);
    }
    this.isMounted = false;
  }

  /**
   * 获取菜品详情
   *
   * @param {*} id 菜品和地区关联的id
   * @memberof FoodDetailsView
   */
  _getFoodDetails(id) { 
    getFoodDetails(id).then(
      data => {
          // this.props.hideLoading && this.props.hideLoading();
          this.setState(
            {
              foodDetails: data,
              refreshing: false,
              soldOut: data.status,
              favoriteCount: data.likeCount,
              isFavorite: data.like == isFavorite
            },
            () => {
              if (Platform.OS == "ios") {
                this.state.isFavorite && this._lv && this._lv
                  ? this._lv.play()
                  : this._lv.reset();
              }
              this.props.saveCache(`Food${this.dateFoodId}`, this.state);
            }
          );
      },
      () => {
        this.props.hideLoading && this.props.hideLoading();
        this.setState({ isError: true, loading: false, refreshing: false });
      }
    );
  }

  _onRefreshToRequestFirstPageData(id) { // 刷新页面
    if (!id) return;
    this._timer = setTimeout(() => {
      // this.props.showLoading && this.props.showLoading();
      clearTimeout(this._timer);
      this._getFoodDetails(id);
    }, 500);
  }

  _handleDoubleTap() { // 双击图片点赞功能
    if (this.state.isFavorite) return;
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (this.lastTap && now - this.lastTap < DOUBLE_PRESS_DELAY) {
      this._onFavorite();
    } else {
      this.lastTap = now;
    }
  }

  _onFavorite() { // 点击关注功能
    let { foodId } = this.state.foodDetails;

    this.setState(
      {
        isFavorite: !this.state.isFavorite,
        favoriteCount: !this.state.isFavorite
          ? this.state.favoriteCount + 1
          : this.state.favoriteCount - 1
      },
      () => {
        this.props.saveCache(`Food${this.dateFoodId}`, this.state);
        if (this.state.isFavorite) {
          this._lv && Platform.OS == "ios" && this._lv.play();
        } else {
          this._lv && Platform.OS == "ios" && this._lv.reset();
        }
      }
    );
    let status = !this.state.isFavorite ? isFavorite : isNotFavorite;
    myFavorite(foodId, status).then(data => {
      // if (data.ro.ok) {
      //   return;
      // }
    });
  }

  _goToOrder() { // 去下单
    let {
      foodDetails: { price },
      foodCount,
      isAddFruit
    } = this.state;
    let _defaultObj = {
      page: "Order",
      dateFoodId: this.dateFoodId,
      amount: foodCount,
      total: foodCount * price,
      addStatus: isAddFruit ? 1 : 0
    };
    if (this.props.screenProps.user !== null) {
      this.props.navigation.navigate("Order", _defaultObj);
    } else {
      if (this.dateFoodId) {
        this.props.navigation.navigate(
          "Order",
          Object.assign(_defaultObj, {
            reloadFunc: () => this._reloadWhenCancelLogin()
          })
        );
      }
    }
  }

  _add() { //添加一个菜品
    this.setState({
      foodCount: this.state.foodCount + 1,
      isBottomContainerShow: true
    });
  }

  _remove() { // 删除一个菜品
    if (this.state.foodCount == 1) {
      this.props.navigation.setParams({ visible: true });
      this.setState({
        isBottomContainerShow: false
      });
    }
    if (this.state.foodCount == 1) {
      return;
    }
    this.setState({
      foodCount: this.state.foodCount - 1
    });
  }

  _reloadWhenCancelLogin() { // 选择不登录时刷新
    this._onRefreshToRequestFirstPageData(this.dateFoodId);
  }

  _cancelOrder = () => { // 取消下单
    this.props.navigation.goBack();
  };

  //render function
  _renderHeaderView() { 
    const { i18n } = this.props;
    const { foodDetails } = this.state;
    return <CommonHeader title={foodDetails ? foodDetails.title : i18n.dailyFood} subTitle={foodDetails ? foodDetails.subTitle : null} canBack />;
  }

  _renderDateFormat() {
    if (!this.state.foodDetails) {
      return (
        <View style={FoodDetailsStyles.DateFormatView}>
          <ShimmerPlaceHolder
            autoRun={true}
            style={{ width: 125, height: 25 }}
          />
          <ShimmerPlaceHolder
            autoRun={true}
            style={{ width: 250, marginTop: 5 }}
          />
        </View>
      );
    }
    return (
      <View style={FoodDetailsStyles.DateFormatView}>
        <Text style={FoodDetailsStyles.DateFormatWeekText}>
          {this.state.foodDetails.title}
        </Text>
        <Text style={FoodDetailsStyles.DateFormatDateText}>
          {this.state.foodDetails.subTitle}
        </Text>
      </View>
    );
  }

  _renderMainView() {
    const { foodDetails } = this.state;
    if (!foodDetails) {
      return (
        <ShimmerPlaceHolder
          autoRun={true}
          style={[
            styles.exampleContainer,
            { width: slideWidthSingle, height: em(250), marginLeft: 15 }
          ]}
        />
      );
    }
    const itemWidth =
      foodDetails.extralImage.length > 1 ? slideWidthMulti : slideWidthSingle;
    return foodDetails != null ? (
      <View style={[styles.exampleContainer, { marginTop: -15 }]}>
        <Carousel
          ref={c => (this._slider1Ref = c)}
          data={foodDetails.extralImage}
          renderItem={this._renderItemWithParallax.bind(this)}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth + itemHorizontalMargin}
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
    const itemWidth =
      this.state.foodDetails.extralImage.length > 1
        ? slideWidthMulti
        : slideWidthSingle;
    return (
      <SliderEntry
        ref={se => (this._SliderEntry = se)}
        data={item}
        even={(index + 1) % 2 === 0}
        length={this.state.foodDetails.extralImage.length || 1}
        width={itemWidth + itemHorizontalMargin}
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
        ref={lv => (this._lv = lv)}
        autoPlay={false}
        style={{
          width: em(55),
          height: em(55),
          position: "absolute",
          left: em(-15),
          top: em(-6)
        }}
        source={require("../animations/like_button.json")}
        loop={false}
        enableMergePathsAndroidForKitKatAndAbove
      />
    );
  }

  _renderIntroductionView() {
    if (!this.state.foodDetails) {
      return (
        <View style={FoodDetailsStyles.IntroductionView}>
          <View style={FoodDetailsStyles.IntroductionFoodNameCotainer}>
            <ShimmerPlaceHolder
              autoRun={true}
              style={{ width: 150, height: 25 }}
            />
            <ShimmerPlaceHolder
              autoRun={true}
              style={{ width: 80, height: 20 }}
            />
          </View>
          <View style={FoodDetailsStyles.IntroductionFoodNameCotainer}>
            <ShimmerPlaceHolder
              autoRun={true}
              style={{ width: 100, height: 20 }}
            />
            <ShimmerPlaceHolder
              autoRun={true}
              style={{ width: 40, height: 20 }}
            />
          </View>
          <ShimmerPlaceHolder
            autoRun={true}
            style={{ width: slideWidthSingle, marginBottom: 5 }}
          />
          <ShimmerPlaceHolder
            autoRun={true}
            style={{ width: slideWidthSingle, marginBottom: 5 }}
          />
          <ShimmerPlaceHolder
            autoRun={true}
            style={{ width: slideWidthSingle }}
          />
        </View>
      );
    }
    let {
      foodDetails: { foodName, canteenName, foodBrief },
      isFavorite,
      favoriteCount
    } = this.state;
    const _isFavorite = () =>
      isFavorite ? (
        Platform.OS == "android" && (
          <Antd style={FoodDetailsStyles.canteenFavoriteActive} name="heart" />
        )
      ) : (
        <Antd style={FoodDetailsStyles.canteenFavorite} name="hearto" />
      );
    return (
      <View style={FoodDetailsStyles.IntroductionView}>
        <View style={FoodDetailsStyles.IntroductionFoodNameCotainer}>
          <Text
            style={FoodDetailsStyles.IntroductionFoodName}
            numberOfLines={1}
          >
            {foodName}
          </Text>
          <TouchableWithoutFeedback onPress={() => this._onFavorite()}>
            <View style={{ position: "relative", flexDirection: "row" }}>
              {Platform.OS == "ios" && this._renderHeartView()}
              {_isFavorite()}
              <Text style={FoodDetailsStyles.canteenName}>
                {favoriteCount}次贊
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={FoodDetailsStyles.IntroductionFoodNameCotainer}>
          {canteenName != null ? (
            <Text style={FoodDetailsStyles.canteenName}>
              <Image
                style={FoodDetailsStyles.canteenImg}
                source={require("../asset/food.png")}
                resizeMode="cover"
              />
              {" " + canteenName}
            </Text>
          ) : null}
          <Text
            style={FoodDetailsStyles.IntroductionDetailBtn}
            onPress={() => 
              {
                // this.slideUpPanel._snapTo()
                this._panelBottom.toggleVisible();
                // Overlay.show(this._renderCommentModel())
              }
            }
          >
            {this.props.i18n.commentDetail}
          </Text>
        </View>
        <Text
          style={FoodDetailsStyles.IntroductionFoodBrief}
          numberOfLines={this.state.briefNumbersOfLines}
          onLayout={e => {
            const { height } = e.nativeEvent.layout;
            let _lineHeight = Platform.OS === "ios" ? em(20) : em(25);
            this.setState({
              briefNumbersOfLines: Math.ceil(height / _lineHeight)
            });
          }}
          numberOfLines={this.state.isIntroOpen ? 6 : 2}
        >
          {foodBrief}
        </Text>
        <TouchableOpacity
          style={{alignSelf: 'flex-end',margin: em(5)}}
         onPress={() => {
          this.setState({
            isIntroOpen: !this.state.isIntroOpen
          })
        }}>
          <Text style={{color: '#ff5050',fontSize: em(15),}}>{this.state.isIntroOpen ? '收起' : '展開'}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  _renderMoreDetailModal() {
    let {
      foodDetails: {
        foodName,
        canteenName,
        canteenAddress,
        foodBrief,
        extralImage,
        price,
        originPrice
      }
    } = this.state;
    return (
      <SlideUpPanel ref={r => (this.slideUpPanel = r)}>
        <View
          onLayout={e => {
            if (!!this.slideUpPanel) {
              this.slideUpPanel.changeTop(
                e.nativeEvent.layout.height + em(100)
              );
            }
          }}
        >
          <Text style={FoodDetailsStyles.panelTitle} numberOfLines={3}>
            {foodName}
          </Text>
          <Image
            style={FoodDetailsStyles.panelImage}
            source={{ uri: extralImage[0] }}
          />
          {canteenName != null ? (
            <Text style={FoodDetailsStyles.canteenName}>
              <Image
                style={FoodDetailsStyles.canteenImg}
                source={require("../asset/food.png")}
              />
              {"  " + canteenName}
            </Text>
          ) : null}
          {canteenAddress != null ? (
            <Text style={FoodDetailsStyles.canteenName}>
              餐廳地址:{canteenAddress}
            </Text>
          ) : null}
          <Text style={FoodDetailsStyles.IntroductionFoodBrief}>
            {foodBrief}
          </Text>
          <View style={FoodDetailsStyles.AddPriceViewPriceContainer}>
            <Text style={FoodDetailsStyles.AddPriceViewPriceUnit}>HKD</Text>
            <Text style={FoodDetailsStyles.AddPriceViewPrice}>{price}</Text>
            {originPrice != null ? (
              <Text
                style={[
                  FoodDetailsStyles.AddPriceViewOriginPrice,
                  { textDecorationLine: "line-through" }
                ]}
              >
                套餐價HKD {originPrice}
              </Text>
            ) : null}
          </View>
        </View>
      </SlideUpPanel>
    );
  }

  _renderCommentModel() {
    if(!this.state.foodDetails) return;
    const {foodDetails:{foodId}, commentTitle} = this.state;

    return (
      <PannelBottom ref={pb => this._panelBottom = pb} title={commentTitle}>
        <CommonFlatList 
          ref={c => this._flatList = c}
          requestFunc={getCommentList}
          renderItem={(item, idx) => this._renderCommentItem(item,idx)}
          extraParams={{foodId: foodId }}
          offset={15}
          getCount={count => {
            this.setState({
              commentTitle: `用戶評論(${count})`
            })
          }}
          {...this.props}/>
      </PannelBottom>
    )
  }

  _renderCommentItem(item, idx) {
    return (
      <View style={FoodDetailsStyles.commentItem} key={idx}>
        <Image style={FoodDetailsStyles.commentItemAvatar} source={isNil(item.profileImg) ? require('../asset/defaultAvatar.png') : {uri: item.profileImg}}/>
        <View style={FoodDetailsStyles.commentItemContent}>
          <Text style={FoodDetailsStyles.commentName}>{item.nickName}</Text>
          <Text style={[FoodDetailsStyles.commentCommonText, {fontSize:em(12), marginTop: -3}]}>評分: {item.star}星</Text>
          <Text numberOfLines={1} style={FoodDetailsStyles.commentCommonText}>{item.comment}</Text>
        </View>
      </View>
    )
  }

  _renderAddPriceView() {
    const { foodDetails, soldOut } = this.state;
    const { i18n } = this.props;
    if (!foodDetails)
      return (
        <View style={[FoodDetailsStyles.AddPriceView, { marginTop: 10 }]}>
          <ShimmerPlaceHolder
            autoPlay={true}
            style={{ width: 100, height: 20 }}
          />
          <ShimmerPlaceHolder
            autoPlay={true}
            style={{ width: 100, height: 20 }}
          />
        </View>
      );
    return (
      <View style={FoodDetailsStyles.AddPriceView}>
        <View style={FoodDetailsStyles.AddPriceViewPriceContainer}>
          <Text style={FoodDetailsStyles.AddPriceViewPriceUnit}>HKD</Text>
          <Text style={FoodDetailsStyles.AddPriceViewPrice}>
            {foodDetails.price}
          </Text>
          {/* {foodDetails.originPrice != null ? (
            <Text style={FoodDetailsStyles.AddPriceViewOriginPrice}>
              套餐價 HKD {foodDetails.originPrice}
          </Text>
          ) : null} */}
          {/* {foodDetails.originPrice != null ? (
            <View style={FoodDetailsStyles.AddPriceViewStriping} />
          ) : null} */}
        </View>
        <View style={FoodDetailsStyles.AddPriceViewCountContainer}>
          <TouchableOpacity
            onPress={() => this._remove()}
            style={FoodDetailsStyles.AddPriceViewCommonBtn}
          >
            <Image
              source={require("../asset/remove.png")}
              style={FoodDetailsStyles.AddPriceViewAddImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text
            style={FoodDetailsStyles.AddPriceViewCountText}
            numberOfLines={1}
          >
            {this.state.foodCount}
          </Text>
          <TouchableOpacity
            onPress={() => this._add()}
            style={FoodDetailsStyles.AddPriceViewCommonBtn}
          >
            <Image
              source={require("../asset/add.png")}
              style={FoodDetailsStyles.AddPriceViewRemoveImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  _renderMealComponentsPrice() {
    if(!this.state.foodDetails) {
      return (
        <View style={[FoodDetailsStyles.AddPriceView,{ marginTop: 10 }]}>
          <ShimmerPlaceHolder
            autoRun={true}
            style={{ width: slideWidthSingle }}
          />
        </View>
      )
    }
    return (
      <View style={FoodDetailsStyles.AddPriceView}>
        <Text style={[FoodDetailsStyles.AddPriceViewOriginPrice, {textDecorationLine:'line-through'}]}>{this.state.foodDetails.priceInfo || ''}</Text>
      </View>
    )
  }

  _renderIsAddedFruitView(foodDetails) { //是否加入水果
    const {isAddFruit} = this.state;
    return (
      <View style={FoodDetailsStyles.addFruitView}>
        <Text style={FoodDetailsStyles.addFruitText}>{foodDetails.addName} + HKD {foodDetails.addPrice}</Text>
        <Switch trackColor="#FF7A00" value={this.state.isAddFruit} onValueChange={val => {
          this.setState({
            isAddFruit: val
          })
        }}/>
        <Text style={FoodDetailsStyles.fruitTips}>{isAddFruit ? "真抵!" : "加埋更抵食~"}</Text>
      </View>
    )
  }

  _renderContentView() {
    let {
      foodDetails,
      refreshing,
      formatDate: { week }
    } = this.state;
    let { dateFoodId } = this.props.navigation.state.params;
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
        {/* {this._renderDateFormat()} */}
        {this._renderMainView()}
        <View>
          {this._renderIntroductionView()}
          {this._renderAddPriceView()}
          {this._renderMealComponentsPrice()}
          {foodDetails && foodDetails.addStatus ?this._renderIsAddedFruitView(foodDetails) : null}
        </View>
        {<View style={FoodDetailsStyles.BottomView} />}
      </ScrollView>
    );
  }

  _renderBottomBtnView() {
    const { soldOut, foodCount, foodDetails, isAddFruit } = this.state;
    const { i18n } = this.props;
    return (
      <BottomOrderConfirm
        btnMessage={i18n.book}
        {...this.props}
        isShow={true}
        total={foodDetails ? (foodCount * (parseInt(foodDetails.price) + (isAddFruit ? parseInt(foodDetails.addPrice) : 0))) : null}
        status={soldOut}
        btnClick={() => {
          if (!foodDetails) return;
          if (soldOut == HAS_FOODS) {
            this._goToOrder();
          } else {
            ToastUtil.showWithMessage("已停止下單");
          }
        }}
        shareClick={() => {
          if (!foodDetails) return;
          if (soldOut == HAS_FOODS) {
            this.setState({
              isShareListShow: true
            });
            this._shareList && this._shareList._toShowShareListView();
          } else {
            ToastUtil.showWithMessage("已停止分享");
          }
        }}
        cancelOrder={this._cancelOrder}
      />
    );
  }

  _pressToShare(type) {
    const {
      foodDetails: { foodName, extralImage }
    } = this.state;
    switch (type) {
      case "whatsapp":
        {
          const shareOptions = {
            //分享優惠券信息
            url: `https://m.goforeat.hk/#/foodDetails/${this.dateFoodId}`,
            message: foodName,
            title: "新人註冊領HKD35優惠券",
            social: "whatsapp"
          };
          this.timer = setTimeout(() => {
            Share.shareSingle(
              Object.assign(shareOptions, {
                social: "whatsapp"
              })
            )
              .then(info => {
                // console.log(info);
                this.setState({
                  modalVisible: false
                });
              })
              .catch(err => {
                alert(`WhatsApp:${err && err.error && err.error.message}`);
                // console.log(err);
                return;
              });
          }, 300);
        }
        break;
      case "wechat":
        {
          WeChat.isWXAppInstalled().then(isInstalled => {
            if (isInstalled) {
              let _obj = {
                title: "新人註冊領HKD35優惠券",
                description: foodName,
                thumbImage: extralImage[0],
                type: "news",
                webpageUrl: `https://m.goforeat.hk/#/foodDetails/${
                  this.dateFoodId
                }`
              };
              // Platform.OS=='ios' && (
              //   _obj['thumbImage'] = extralImage[0]
              // );
              WeChat.shareToSession(_obj).catch(error => {
                // console.log(error);
                if (error.message == -2) {
                  ToastUtil.showWithMessage("分享失敗");
                } else {
                  ToastUtil.showWithMessage("分享成功");
                }
              });
            } else {
              ToastUtil.showWithMessage("WeChat is not installed");
            }
          });
        }
        break;
    }
  }

  _renderErrorView() {
    const { i18n } = this.props;
    return (
      <ErrorPage
        errorToDo={this._onRefreshToRequestFirstPageData}
        errorTips={i18n.common_tips.reload}
      />
    );
  }

  _renderPreventClickView() {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          this.setState(
            {
              isShareListShow: false
            },
            () => {
              this._shareList && this._shareList._toHideShareListView();
            }
          );
        }}
      >
        <View
          style={{
            width: _winWidth,
            height: _winHeight,
            position: "absolute",
            zIndex: 99,
            top: 0,
            left: 0,
            backgroundColor: "#000",
            opacity: 0.3
          }}
        />
      </TouchableWithoutFeedback>
    );
  }

  render() {
    let { loading, isError, foodDetails, isShareListShow } = this.state;

    return (
      <CustomizeContainer.SafeView
        mode="linear"
        style={FoodDetailsStyles.ContainerBg}
      >
        {this._renderHeaderView()}
        {isError ? this._renderErrorView() : null}
        {isShareListShow && this._renderPreventClickView()}
        {this._renderContentView()}
        {this._renderBottomBtnView()}
        {foodDetails && this._renderMoreDetailModal()}
        {foodDetails && this._renderCommentModel()}
        {foodDetails && (
          <ShareComponent
            ref={sl => (this._shareList = sl)}
            getShareType={type => this._pressToShare(type)}
          />
        )}
      </CustomizeContainer.SafeView>
    );
  }
}

export default FoodDetailsView;
