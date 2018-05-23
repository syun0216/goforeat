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
  Animated
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
import PlacePicker from '../components/PlacePicker';
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

export default class ShopSwiperablePage extends Component {
  _current_offset = 0;
  _SliderEntry = null;
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
      foodCount: 0
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      i18n: i18n[nextProps.screenProps.language]
    });
  }

  componentDidMount() {
    CodePush.getUpdateMetadata().then(localPackage => {
            // console.log(localPackage);
            if (localPackage == null) {
                this._checkForUpdate();
                
            } else {
                if (localPackage.isPending) {
                    localPackage.install(CodePush.InstallMode.ON_NEXT_RESUME)
                } else {
                    this._checkForUpdate();
                }
            }
        })
    this._current_offset = 0;
    this._formatDate();
  }

  _formatDate() {
    let _Date = new Date();
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

  // logic - update

  _checkForUpdate() {
    CodePush.checkForUpdate(CodePushUtils.getDeploymentKey()).then(remotePackage => {
      // console.log(remotePackage);
        if (remotePackage == null) {
            return;
        }
        this._syncInNonSilent(remotePackage);
        // if (TextUtils.isEmpty(remotePackage.description)) {
        //     this._syncInSilent(remotePackage);
        // } else {
        //     JSONUtils.parseJSONFromString(remotePackage.description, (resultJSON) => {
        //         if (resultJSON.isSilentSync != null && !resultJSON.isSilentSync) {
        //             this._syncInNonSilent(remotePackage);
        //         } else {
        //             this._syncInSilent(remotePackage);
        //         }
        //     }, (error) => {
        //         this._syncInSilent(remotePackage);
        //     });
        // }
    })
}
  // logic - update - silent
  _syncInSilent = remotePackage => {
    remotePackage.download().then(localPackage => {
      if (localPackage != null) {
        localPackage.install(CodePush.InstallMode.ON_NEXT_RESUME);
      } else {
      }
    });
  };
  // logic - update - no silent

  _syncInNonSilent = remotePackage => {
    if (remotePackage.isMandatory) {
      Alert.alert(null, `更新到最新版本,更新內容為：\n ${remotePackage.description}`, [
        {
          text: "明白",
          onPress: () => {
            this._downloadMandatoryNewVersionWithRemotePackage(remotePackage)
          }
        }
      ]);

      // setTimeout(
      //   () => this._downloadMandatoryNewVersionWithRemotePackage(remotePackage),
      //   1000
      // );
      return;
    } else {
      Alert.alert(null, "有新功能,是否現在立即更新？", [
        { text: "以後再說" },
        {
          text: "立即更新",
          onPress: () => {
            this._downloadNewVersionWithRemotePackage(remotePackage);
          }
        }
      ]);
    }
  };

  _downloadNewVersionWithRemotePackage = remotePackage => {
    ToastUtils.showWithMessage("新版本正在下載,請稍候...");
    remotePackage.download().then(localPackage => {
      if (localPackage != null) {
        Alert.alert(null, "下載完成,是否立即安裝?", [
          {
            text: "下次安裝",
            onPress: () => {
              localPackage.install(CodePush.InstallMode.ON_NEXT_RESUME);
            }
          },
          {
            text: "現在安裝",
            onPress: () => {
              localPackage.install(CodePush.InstallMode.IMMEDIATE);
            }
          }
        ]);
      } else {
        // if (DebugStatus.isDebug()) {
        //     console.log("新版本下载失败");
        // }
      }
    });
  };

  _downloadMandatoryNewVersionWithRemotePackage = remotePackage => {
    this.props.navigation.navigate('Mandatory',{
      remotePackage: remotePackage
    })
  }

  //api
  _getRecomendFoodList = (placeId) => {
    api.getFoodRecommend(placeId, this.props.screenProps.sid).then(
      data => {
        if (data.status === 200 && data.data.ro.ok) {
          console.log(data.data.data);
          // if (data.data.data.length === 0) {
          //     ToastUtil.showWithMessage('沒有更多數據了...');
          //     this.setState({
          //         loading: false
          //     })
          //     return;
          // }
          this.setState({
            foodDetails: data.data.data,
            loading: false
          });
        }
      },
      () => {
        this.setState({ isError: true, loading: false });
      }
    );
  };

  _onErrorToRetry = () => {
    this.setState({
      loading: true,
      isError: false
    });
    this._getRecomendFoodList();
  };

  _refresh = () => {
    this._current_offset += 15;
    this.setState({
      loading: true
    });
    this.getRecommendList();
  };

  getSeletedValue = (val) => {
    this.setState({
      placeSelected: val
    })
    this._getRecomendFoodList(val);
  }

  _goToOrder = () => {
    let {foodId} = this.state.foodDetails[0];
    let {placeSelected} = this.state.placeSelected;
    if(this.props.user !== null) {
      this.props.navigation.navigate("Order", {
          foodId,
          placeId: placeSelected
      })
  }else {
      this.props.navigation.navigate("Login",{foodId,placeId: placeSelected});
  }
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
        placeId={this.state.placeSelected}
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
        {...this['props']}
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

  render() {
    const example1 = this.mainExample(
      1,
      `- ${this.state.i18n.recommend_text} -`
    );

    return (
      <Container>
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
          <View style={{flex: 1,alignItems:'center',flexDirection:'row',justifyContent:'center'}}>
            {/*<Text style={{ color: Colors.main_white, fontSize: 16 }}>
              {this.state.i18n.takeout_title}
        </Text>*/}
          <Icon name="md-locate" style={{fontSize:20,color:'#fff'}}/>
          <PlacePicker getSeletedValue={this.getSeletedValue}/>
          </View>
        </Header>

        {this.state.isError ? (
          <ErrorPage
            errorToDo={this._onErrorToRetry}
            errorTips="加載失败,請點擊重試"
          />
        ) : null}
        {this.state.loading ? <Loading message="玩命加載中..." /> : null}
        <BottomOrderConfirm {...this['props']} 
        isShow={this.state.isBottomContainerShow} 
        total={this.state.foodCount*30}
        goToOrder={this._goToOrder}
        cancelOrder={this._cancelOrder}/>
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
