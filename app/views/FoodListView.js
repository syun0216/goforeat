import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  ActivityIndicator,
  BackHandler,
  ToastAndroid,
  Animated,
  Easing,
  Alert
} from "react-native";
import { Header } from "native-base";
import { connect } from "react-redux";
import LinearGradient from "react-native-linear-gradient";
import FastImage from "react-native-fast-image";
import Antd from "react-native-vector-icons/AntDesign";
import {PopoverPicker} from 'teaset';
import {isNil} from "lodash";
//actions
import { SHOW_AD, HIDE_AD } from "../actions";
//utils
import GLOBAL_PARAMS, { em, isEmpty, currentPlatform } from "../utils/global_params";
import JSONUtils from "../utils/JSONUtils";
import { getDeviceId, getVersion } from "../utils/DeviceInfo";
//api
import { getFoodList, adSpace, inviteActivityInfo } from "../api/request";
import {abortRequestInPatchWhenRouteChange} from "../api/CancelToken";
//components
import Text from "../components/UnScalingText";
import WarningTips from "../components/WarningTips";
import CommonFlatList from "../components/CommonFlatList";
import AdvertiseView from "../components/AdvertiseView";
import PlacePickerModel from "../components/PlacePickerModel";
import CustomizeContainer from "../components/CustomizeContainer";
import Tips from "../components/Tips";
import Swiper from "../components/Swiper";
//styles
import FoodDetailsStyles from "../styles/fooddetails.style";
//storage
import { advertisementStorage } from "../cache/appStorage";
import Divider from "../components/Divider";
//store
import store from "../store/index";
import { SAVE_ACTIVITY } from "../actions/index";

const {
  isIphoneX,
  bottomDistance,
  iPhoneXBottom,
  _winHeight,
  _winWidth
} = GLOBAL_PARAMS;

const HAS_FOODS = 1;
const NO_MORE_FOODS = 2;
const IS_INTERCEPT = 3;

let lastBackPressed = Date.now();

class FoodListView extends Component {
  _interval = null;
  _isFirstReload = null;
  flatlist = null;
  constructor(props) {
    super(props);
    this._interval = null;
    this._isFirstReload = true; //判断是否为首次加载
    // Platform.OS == 'android' && BackHandler.addEventListener('hardareBackPress', this.onBackButtonPressAndroid.bind(this));
    this.state = {
      currentItem: "",
      placeSelected: null,
      advertiseImg: "",
      advertiseData: null,
      advertiseCountdown: 5,
      warningTipsData: [],
      swiperListData: [],
      star: null,
      listDataLength: 0,
      isAdvertiseShow: false,
      isWarningTipShow: true,
      isActivityBtnShow: false,
      isSwiperShow: false,
      searchBarOpacity: new Animated.Value(1), 
      warningTipsScale: new Animated.Value(1),
      searchBtnShow: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.userInfo.username != this.props.userInfo.username) {
      this._getActivityInfo();
    }
  }
  

  shouldComponentUpdate(nextProps, nextState) {
    return JSON.stringify(nextState) != JSON.stringify(this.state) || nextProps.userInfo.username != this.props.userInfo.username;
  }

  componentDidMount() {
    let { isAdShow, hideAd } = this.props;
    if (isAdShow) {
      hideAd();
    }
    
    advertisementStorage.getData((error, data) => {
      if (error == null) {
        if (data != null) {
          isAdShow &&
            this.setState({
              advertiseImg: data.image,
              advertiseData: data,
              isAdvertiseShow: true
            });
          this._advertiseInterval();
        }
        this._getAdvertise(data);
      }
    });
    let _timer = setTimeout(() => {
      this._getActivityInfo();
      this._getSwiperAdList();
      clearTimeout(_timer);
    },300);
  }

  componentWillUnmount() {
    abortRequestInPatchWhenRouteChange();
  }

  //logic functions

  onBackButtonPressAndroid() {
    if(lastBackPressed && lastBackPressed + 2000 >= Date.now()) {
      BackHandler.exitApp()
    }
    lastBackPressed = Date.now();
    ToastAndroid.show("再按一次退出app", ToastAndroid.SHORT);
    return true;
  }

/**
 * 获取启动页广告
 *
 * @param {*} old_data
 * @memberof FoodListView
 */
  _getAdvertise(old_data) {
    adSpace()
      .then(data => {
        if (data.ro.respCode == "0000") {
          if (data.data.length == 0) {
            // 如果data为空，则不设置缓存为空
            advertisementStorage.setData(null);
            return;
          }
          if (old_data != null) {
            // 如果缓存不为空
            if (JSONUtils.jsonDeepCompare(old_data, data.data[0])) {
              return; // 判断缓存是否与服务器数据相等，如果相等则不做操作
            } else {
              // 如果缓存不等则覆盖本地缓存为服务器数据
              advertisementStorage.setData(data.data[0]);
              Image.prefetch(data.data[0].image);
            }
          } else {
            // 如果缓存为空，则缓存到本地
            advertisementStorage.setData(data.data[0]);
            Image.prefetch(data.data[0].image);
          }
        }
      })
      .catch(err => {
        if (axios.isCancel(thrown)) {
          // console.log('Request canceled', thrown.message);
        }
      });
    }

  /**
   * 获取swiper活动详情列表
   * @params type=2 获取swiper
   * @memberof FoodListView
   */
  _getSwiperAdList() {
    adSpace(2).then(data => {
      this.setState({
        swiperListData: data
      })
    }).catch(err => {
      console.log('err', err)
    })
  }

  /**
   * 获取活动详情
   *
   * @memberof FoodListView
   */
  _getActivityInfo(){
    inviteActivityInfo().then(data => {
      console.log('data :', data);
      this.setState({
        isActivityBtnShow: data.showStatus == 1
      });
      store.dispatch({type: SAVE_ACTIVITY, data});
    }).catch(err => {
      console.log('err',err)
      this.setState({
        isActivityBtnShow: false
      });
    });
  }

  _advertiseInterval() {
    this._interval = setInterval(() => {
      if (this.state.advertiseCountdown > 1) {
        this.setState({
          advertiseCountdown: this.state.advertiseCountdown - 1
        });
      } else {
        this.setState({
          isAdvertiseShow: false
        });
        clearInterval(this._interval);
      }
    }, 1000);
  }

  _getSeletedValue(val) {
    if (val == null) {
      // this._picker.getPlace();
      this.setState({ isError: true, loading: false });
      return;
    }
    if(!!this.state.placeSelected && val.name == this.state.placeSelected.name) {
      return;
    }
    this.setState(
      {
        placeSelected: val
      },
      () => {
        if (!this._isFirstReload) {
          if (!!this.flatlist) {
            this.flatlist.getWrappedInstance().outSideRefresh();
            this._initMenuStatus();
          };
          this._isFirstReload = false;
        } else {
          this._isFirstReload = false;
        }
      }
    );
  }

  _getScrollTop(scrollTop) {
    this.setState({
      searchBtnShow: scrollTop > em(100)
    });
  }

  //render functions
  _renderAdvertisementView() {
    return (
      <AdvertiseView
        modalVisible={this.state.isAdvertiseShow}
        seconds={this.state.advertiseCountdown}
        image={this.state.advertiseImg}
        data={this.state.advertiseData}
        countDown={this.state.advertiseCountdown}
        closeFunc={() =>
          this.setState({
            isAdvertiseShow: false
          })
        }
      />
    );
  }

  _renderRefreshBgView() {
    return (
      <LinearGradient
        colors={["#FF7A00", "#FE560A"]}
        start={{ x: 0.0, y: 0.0 }}
        end={{ x: 1.0, y: 0.0 }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: _winHeight*0.6,
          width: _winWidth,
          overflow: "hidden"
        }}
      />
    );
  }

  _renderTopTitleView() {
    return (
      <LinearGradient
        colors={["#FF7A00", "#FE560A"]}
        start={{ x: 0.0, y: 0.0 }}
        end={{ x: 1.0, y: 0.0 }}
        style={{
          paddingTop: em(10),
          paddingBottom: em(10),
          paddingLeft: em(15),
          paddingRight: em(15),
          justifyContent: "space-between",
          flexDirection: "row",
          position: "relative"
        }}
      >
        <Text style={[FoodDetailsStyles.DateFormatWeekText, { color: "#fff" }]}>
          {this.props.i18n.foodlist_tips.title}
        </Text>
        <Text style={{ color: "#fff", fontWeight: "700" }}>
          {this.props.i18n.foodlist_tips.sub_title}:{this.state.star}/5
        </Text>
      </LinearGradient>
    );
  }

  _renderWarningView() {
    return (
      <Animated.View style={{height: this.state.warningTipsScale.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 40]
      })}}>
        <WarningTips/>
      </Animated.View>
    )
  }

  _renderHeaderView() {
    let { placeSelected } = this.state;
    let { navigate } = this.props.navigation;
    let scheme = "";
    if (placeSelected != null) {
      let {
        placeSelected: { lon, lat, name }
      } = this.state;
      scheme = Platform.select({
        android: `geo:${lon},${lat}?q=${name}`,
        ios: `http://maps.apple.com/?q=${name}&ll=${lon},${lat}`
      });
    }
    const menuElement = title => (<Text style={{padding: em(5)}}>{title}</Text>)
    return (
      <Header
        style={FoodDetailsStyles.Header}
        iosBarStyle="light-content"
        androidStatusBarColor="transparent"
      >
        <LinearGradient
          colors={["#FF7A00", "#FE560A"]}
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 1.0, y: 0.0 }}
          style={FoodDetailsStyles.linearGradient}
        >
          <TouchableOpacity
            onPress={() => navigate("DrawerOpen", { callback: this._add })}
            style={FoodDetailsStyles.MenuBtn}
          >
            <Antd name="menu-fold" style={FoodDetailsStyles.MenuImage} />
            {/* <Image
              source={require("../asset/menu.png")}
              style={FoodDetailsStyles.MenuImage}
              resizeMode="contain"
            /> */}
          </TouchableOpacity>
          {this.state.searchBtnShow ? <View style={[FoodDetailsStyles.HeaderContent, ]}><Text style={{color: '#fff', fontSize: em(18),fontWeight: 'bold',marginRight: em(-52)}}>精選菜品</Text></View> :
          <Animated.View style={[FoodDetailsStyles.HeaderContent,{opacity: this.state.searchBarOpacity}]}>
            {placeSelected != null ? this._renderPlacePickerBtn() : (
              <ActivityIndicator color="#fff" size="small" />
            )}
          </Animated.View>}
          <View style={{flexDirection: 'row', alignItems:'center'}}>
            {this.state.searchBtnShow && <TouchableOpacity style={[FoodDetailsStyles.MenuBtn,{marginRight: -8}]} onPress={() => this.setState({ showPlacePicker: true })}>
              <Antd name="enviromento" style={FoodDetailsStyles.moreIcon}/>
            </TouchableOpacity>} 
            <TouchableOpacity
              onPress={() =>{
                PopoverPicker.show(
                  {x: _winWidth - 135, y: -50, width:100, height:100},
                  [menuElement("查看配送點"),menuElement("兌換優惠碼"), menuElement('反饋')],
                  this.state.modalSelectedIndex,
                  (item, index) => {
                    switch(index) {
                      case 0: {
                        this.props.navigation.navigate('PickPlace', {
                          navigate: true
                        });break;
                      }
                      case 1: {
                        this.props.navigation.navigate('Coupon', {
                          navigate: true
                        });break;
                      }
                      case 2: {
                        this.props.navigation.navigate('Feedback', {
                          navigate: true
                        });break;
                      }
                    }
                  },
                  {modal: false}
                );
              }}
              style={FoodDetailsStyles.MenuBtn}
            >
              {/* <Image
                source={require("../asset/location_white.png")}
                style={FoodDetailsStyles.locationImage}
                resizeMode="contain"
              /> */}
              <Antd name="appstore-o" style={FoodDetailsStyles.moreIcon}/>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Header>
    );
  }

  _renderPlacePickerBtn() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={FoodDetailsStyles.PlacePickerBtn}
        onPress={() => this.setState({ showPlacePicker: true })}
      >
        <View style={FoodDetailsStyles.PlacePickerBtnBgAbsolute} />
        <Text style={FoodDetailsStyles.PlacePickerBtnText} numberOfLines={1}>
          {this.state.placeSelected.name}
        </Text>
        {/* <Image
          source={require("../asset/arrow_down.png")}
          style={FoodDetailsStyles.PlacePickerBtnImage}
          resizeMode="contain"
        /> */}
        <Antd name="search1" style={FoodDetailsStyles.PlacePickerBtnImage}/>
      </TouchableOpacity>
    );
  }

  _renderPlacePicker() {
    let { showPlacePicker } = this.state;
    return (
      <PlacePickerModel
        ref={c => (this._picker = c)}
        modalVisible={showPlacePicker}
        closeFunc={() => this.setState({ showPlacePicker: false })}
        getSeletedValue={val => this._getSeletedValue(val)}
      />
    );
  }

  _renderIndicator() {
    return (
      <Divider height={1} bgColor="#ccc"/>
    )
  }

  _renderFoodListItemView(item, index) {
    if (typeof item === "undefined") return;
    let _device = getDeviceId().split(",")[0];
    return (
      <TouchableOpacity style={styles.itemContainer}
      onPress={() => {
        const {placeSelected} = this.state;
        if(placeSelected && typeof placeSelected.hasTips == "undefined") {
          this.props.navigation.navigate("Food", {
            dateFoodId: item.dateFoodId
          });
        }else {
          Alert.alert(
            this.props.i18n.tips,
            placeSelected.name,
            [
              { text: this.props.i18n.confirm, onPress: () => {
                this.setState({
                  showPlacePicker: true
                })
              } }
            ],
            { cancelable: false }
          )
        }
      }} activeOpacity={1}>
        <Text style={styles.dateText}>{item.date}</Text>
        <View
        style={[
          styles.articleItemContainer,
          {
            borderTopRightRadius: 8,
            borderTopLeftRadius: 8,
            overflow: 'hidden',
          }
        ]}
      >
        <FastImage
          source={{ uri: item.thumbnail }}
          borderRadius={8}
          style={{
            width: '100%',
            height: em(200),
            alignSelf: "center",
            borderRadius: 8,
            marginBottom: em(5),
            overflow: 'hidden'
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
        <View style={styles.itemLike}>
          <Image style={styles.itemLikeImg} source={require('../asset/1.3.7/icon_2.png')} resizeMode="contain"/>
          <Text style={styles.itemLikeText}>{item.likeCount || 0}贊</Text>
        </View>
        <View style={styles.articleItemDetails}>
          <View style={[styles.itemName, styles.marginBottom9]}>
            <Text style={styles.foodName} numberOfLines={1}>
              {item.name}
            </Text>
          </View>
          {
           !isNil(item.prePrice) && !isNil(item.dayPrice) ? (
              <View style={styles.foodCommonContainer}>
                <Text style={[styles.foodCommon]}>是日價:   </Text>
                <Text style={[styles.foodCommon,{textDecorationLine:'line-through'}]}>
                  {` HKD${parseInt(item.dayPrice).toFixed(2)}`}
                </Text>
              </View>
            ) : null
          }
          <View style={[styles.foodCommonContainer]}>
            <Text style={styles.foodCommon}>{item.prePrice ? `預購價:   ` : `是日價:   `} </Text>
            <Text style={styles.foodCommon}>
            HKD{parseInt(item.prePrice ? `${item.prePrice}` : `${item.dayPrice || item.prePrice}`).toFixed(2)}
            </Text>
          </View>
          <View>
            <Text numberOfLines={4} style={styles.foodBrief}>成分:   {item.component || ""}</Text>
          </View>
        </View>
      </View>
      <View style={styles.confirmBtn}>
        <Text
          style={{
            color: "#fff",
            alignSelf: 'flex-end',
            fontSize: em(20),
            marginTop: Platform.OS == "android" ? -3 : 0
          }}
        >
          {
            item.status && (item.status == HAS_FOODS ? '立即預訂' : item.status == NO_MORE_FOODS ? '已售罄' : '已截單') || '立即預訂'
          }
        </Text>
      </View>
      </TouchableOpacity>
      );
  }

  _renderFlatListView() {
    _bottomDistance = isIphoneX()
      ? bottomDistance + iPhoneXBottom
      : bottomDistance;
    const { placeSelected } = this.state;
    if (isEmpty(placeSelected)) {
      return null;
    }
    return (
      <CommonFlatList
        ref={c => (this.flatlist = c)}
        requestFunc={getFoodList}
        // renderIndicator={() => this._renderIndicator()}
        renderItem={(item, index) => this._renderFoodListItemView(item, index)}
        renderHeader={() => {return this.state.swiperListData.length > 0 ? <Swiper adDetail={this.state.swiperListData} /> : null}}
        extraParams={{ placeId: this.state.placeSelected.id }}
        refreshControlTitleColor="#999999"
        isIndicatorShow={false}
        blankBtnMessage="所選配送點暫未有餐食供應,請選擇其他離你最近的配送點"
        getRawData={data => {
          this.setState({ star: data.star});
        }}
        getScrollTop={
          scrollTop => this._getScrollTop(scrollTop)
        }
      />
    );
  }

  render() {
    console.log(9999999,'render');
    const {
      activityInfo
    } = this.props;
    return (
      <CustomizeContainer.SafeView mode="linear" style={{ position: "relative", backgroundColor: "#fff" }}>
        {this._renderAdvertisementView()}
        {/* {this.state.star && this._renderRefreshBgView()} */}
        {/* {this._renderIndicator()} */}
        {this._renderPlacePicker()}
        {this._renderHeaderView()}
        {/* {this.state.isWarningTipShow && this._renderWarningView()} */}
        {
          (this.state.isActivityBtnShow) && (<Tips message="邀請好友,領取優惠券" clickFunc={() => 
            this.props.navigation.navigate('Content', {
              data: {
                url: `${activityInfo.activity.myInviteUrl}?sid=${store.getState().auth.sid}&language=${store.getState().language.language}&sellClient=${currentPlatform}&appVersion=${getVersion()}`,
                title: '邀請好友落Order獎你HKD10優惠券',
                message: 'goforeat'
              },
              kind: 'activity'
            })
          }/>)
        }
        {this._renderFlatListView()}
      </CustomizeContainer.SafeView>
    );
  }
}

const foodListStateToProps = state => {
  return {
    isAdShow: state.toggleAd.isAdvertisementShow,
    sid: state.auth.sid,
    userInfo: state.auth,
    activityInfo: state.activityInfo
  };
};

const foodListDispatchToProps = dispatch => ({
  showAd: () => dispatch({ type: SHOW_AD }),
  hideAd: () => dispatch({ type: HIDE_AD })
});

export default connect(
  foodListStateToProps,
  foodListDispatchToProps,
  null,
  {withRef: true}
)(FoodListView);

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: '#fff',
    padding: em(8),
    // height: em(190),
    borderBottomWidth: em(15),
    borderBottomColor: '#f0f0f0',
    justifyContent: 'center',
    position: 'relative'
  },
  dateText: {
    fontSize: em(20),
    color: "#333",
    marginBottom: em(10),
    fontWeight: "800"
  },
  articleItemContainer: {
    // flex: 1,
    // paddingBottom: 15,
    // flexDirection: "row",
    shadowColor: "#333",
    shadowOffset: { width: 3, height: 5 },
    shadowOpacity: 0,
    shadowRadius: 10,
    backgroundColor: "#fff",
    // overflow: "hidden",
    // alignItems: 'center',
    
  },
  itemLike: {
    backgroundColor: "rgba(0, 0, 0, .5)",
    width: em(92),
    height: em(32),
    borderRadius: em(20),
    position: 'absolute',
    top: em(155),
    left: em(12),
    zIndex: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  itemLikeImg: {
    width: em(22),
    marginRight: em(10)
  },
  itemLikeText: {
    color: '#fff',
    fontSize: em(16),

  },
  articleItemDetails: {
    // height: em(100),
    // paddingLeft: em(10),
    // paddingRight: 0,
    marginTop: em(5),
    flex: 1,
    backgroundColor: "#fff",
    // borderWidth: 1,
    // borderColor: '#ededeb',
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    // overflow: "hidden",
    // justifyContent: "space-between"
  },
  itemName: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  foodCommonContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: em(5)
  },
  foodName: {
    fontSize: em(20),
    color: "#111",
    fontWeight: "800",
    maxWidth: em(220)
  },
  foodCommon: {
    fontSize: em(18),
    color: "#666"
  },
  foodBrief: {
    fontSize: em(14),
    color: "#959595",
    textAlign: "justify",
    lineHeight: 20,
  },
  foodUnit: {
    fontSize: em(15),
    color: "#666",
    marginRight: em(3),
    marginTop: Platform.OS === "android" ? em(-3.5) : 0
  },
  foodPrice: {
    fontSize: _winWidth < 375 ? em(20) : em(20),
    color: "#2a2a2a",
    lineHeight: em(20)
  },
  marginBottom9: {
    marginBottom: em(10)
  },
  confirmBtn: {
    position: "absolute",
    right: 15,
    top: em(260),
    backgroundColor: '#ff5050',
    padding: em(5),
    borderRadius: em(2.5)
  }
});
