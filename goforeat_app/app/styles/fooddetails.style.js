import {
  StyleSheet,
  Platform
} from 'react-native';
import GLOBAL_PARAMS,{em} from '../utils/global_params';
import Colors from '../utils/Colors';

const common = {
  marginLeft: em(15),
  fontColor: Colors.fontBlack,
}

export default StyleSheet.create({
  // _renderDateFormat
  DateFormatView: {
    marginTop: em(10),
    marginLeft: common.marginLeft
  },
  DateFormatWeekText: {
    fontSize: em(20),
    fontWeight: 'bold'
  },
  DateFormatDateText: {
    color: Colors.fontGray,
    fontSize: em(13)
  },
  //_renderDeadLineDate
  DeadLineDateView: {
    marginTop: em(10),
    marginLeft: common.marginLeft
  },
  DeadLineDateText: {
    color: '#999999',
    fontSize: em(16)
  },
  //_renderIntrodutionView
  IntroductionView: {
    width: GLOBAL_PARAMS._winWidth,
    paddingLeft: common.marginLeft,
    paddingRight: common.marginLeft,
  },
  IntroductionFoodNameCotainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: em(10),
  },
  IntroductionFoodName: {
    fontSize: em(20),
    color: '#111',
    fontWeight: 'bold',
    maxWidth: em(210)
  },
  IntroductionDetailBtn: {
    color: '#ff3348',
    fontSize: em(18),
    paddingLeft: em(20),
    paddingRight: 0
  },
  IntroductionFoodBrief: {
    fontSize: em(14),
    color: '#999999',
    textAlign: 'justify',
    lineHeight: Platform.OS == 'ios' ? em(20) : em(25),
  },
  // _renderAddPriceView
  AddPriceView: {
    width: GLOBAL_PARAMS._winWidth,
    paddingLeft: common.marginLeft,
    paddingRight: common.marginLeft,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  AddPriceViewPriceContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  AddPriceViewPriceUnit: {
    fontSize: em(18),
    color: Colors.fontBlack,
    marginRight: 8
  },
  AddPriceViewPrice: {
    fontSize: em(25),
    color: '#ff3348',
    marginRight: GLOBAL_PARAMS._winWidth < 340 ? em(10) : em(15),
    marginBottom: -4
  },
  AddPriceViewOriginPrice: {
    fontSize: em(16),
    color: '#9B9B9B'
  },
  AddPriceViewStriping: {
    width: GLOBAL_PARAMS._winWidth < 340 ? em(60) : em(75),
    transform: [{
      rotate: '-5deg'
    }],
    backgroundColor: '#9B9B9B',
    height: 2,
    position: 'absolute',
    bottom: 8,
    right: GLOBAL_PARAMS._winWidth < 340 ? em(-3) : em(-8),
    opacity: 0.63
  },
  AddPriceViewCountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  AddPriceViewCommonBtn: {
    width: em(40),
    alignItems: 'center'
  },
  AddPriceViewAddImage: {
    width: em(25),
    height: em(25)
  },
  AddPriceViewCountText: {
    color: Colors.fontBlack,
    fontSize: em(28),
    width: em(40),
    textAlign: 'center'
  },
  AddPriceViewRemoveImage: {
    width: em(34),
    height: em(34),
    marginTop: 7
  },
  //_renderPlacePickerBtn
  PlacePickerBtn: {
    flexDirection: 'row',
    // marginLeft: Platform.OS == 'ios' ? em(-45) : em(-30),
    flex: 1,
    marginTop: Platform.OS == 'ios' ? GLOBAL_PARAMS.isIphoneX() ? 15 : 0 : em(-8),
    position: 'relative',
  },
  PlacePickerBtnBgAbsolute: {
    backgroundColor: Colors.main_white,
    opacity: 0.2,
    borderRadius: 100,
    // width: em(250),
    flex: 1,
    height: em(35),
  },
  PlacePickerBtnImage: {
    width: em(20),
    height: em(20),
    position: 'absolute',
    top: em(8),
    right: em(12)
  },
  PlacePickerBtnText: {
    color: Colors.main_white,
    marginLeft: 10,
    fontSize: em(16),
    position: 'absolute',
    left: em(8),
    top: Platform.OS == 'android' ? em(7) : em(8),
    maxWidth: Platform.OS == 'ios' ? em(218) : em(250),
  },
  //render
  ContainerBg: {
    backgroundColor: '#fff'
  },
  Header: {
    borderBottomWidth: 0,
    padding: 0,
    marginTop: GLOBAL_PARAMS.isIphoneX() ? -GLOBAL_PARAMS.iPhoneXTop : 0,
    marginBottom: GLOBAL_PARAMS.isIphoneX() ? GLOBAL_PARAMS.iPhoneXTop : 0,
  },
  linearGradient: {
    height: GLOBAL_PARAMS.isIphoneX() ? 64 + GLOBAL_PARAMS.iPhoneXTop : 64,
    width: GLOBAL_PARAMS._winWidth,
    marginTop: Platform.OS == 'ios' ? -15 : 0,
    paddingTop: Platform.OS == 'ios' ? 15 : 0,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  MenuBtn: {
    width: GLOBAL_PARAMS._winWidth*0.15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Platform.OS == 'ios' ? 0 : -8,
    height: 50,
    position: 'relative',
  },
  MenuBtnAndroid: {
    width: GLOBAL_PARAMS._winWidth*0.15,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    position: 'relative',
    marginRight: 10
  },
  MenuImage: {
    width: em(23),
    height: em(23),
    marginTop: GLOBAL_PARAMS.isIphoneX() ? 15 : 0,
  },
  locationImage: {
    width: em(19),
    height: em(19),
    marginTop: GLOBAL_PARAMS.isIphoneX() ? 15 : 0,
  },
  HeaderContent: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  BottomView: {
    height: 80,
    width: GLOBAL_PARAMS._winWidth
  },
  //details
  panelTitle: {
    fontSize: em(20),
    marginTop: em(10),
    marginBottom: em(10),
  },
  panelImage: {height: em(250),marginTop: em(10),marginBottom: em(10),borderRadius: em(8)},
  canteenName: {
    fontSize: em(18),
    color: '#999'
  },
  canteenFavorite: {
    fontSize: em(20),
    color: '#959595',
    marginRight: em(8),
  },
  canteenFavoriteActive: {
    fontSize: em(20),
    color: Colors.main_orange
  },
  canteenImg: {
    width: em(16),
    height: em(13)
  }

})