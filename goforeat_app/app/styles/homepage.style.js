import {
  StyleSheet,
  Platform
} from 'react-native';
import GLOBAL_PARAMS from '../utils/global_params';
import Colors from '../utils/Colors';

const common = {
  marginLeft: GLOBAL_PARAMS._winWidth * 0.08,
  fontColor: Colors.fontBlack,
}

export default StyleSheet.create({
  // _renderDateFormat
  DateFormatView: {
    marginTop: 20,
    marginLeft: common.marginLeft
  },
  DateFormatWeekText: {
    color: Colors.fontBlack,
    fontSize: GLOBAL_PARAMS.em(18),
    marginBottom: 5,
    fontWeight: 'bold'
  },
  DateFormatDateText: {
    color: Colors.fontGray,
    fontSize: GLOBAL_PARAMS.em(13)
  },
  //_renderDeadLineDate
  DeadLineDateView: {
    marginTop: GLOBAL_PARAMS.em(10),
    marginLeft: common.marginLeft
  },
  DeadLineDateText: {
    color: '#999999',
    fontSize: GLOBAL_PARAMS.em(16)
  },
  //_renderIntrodutionView
  IntroductionView: {
    width: GLOBAL_PARAMS._winWidth,
    paddingLeft: common.marginLeft,
    paddingRight: common.marginLeft,
    paddingBottom: GLOBAL_PARAMS.em(10)
  },
  IntroductionFoodNameCotainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  IntroductionFoodName: {
    fontSize: GLOBAL_PARAMS.em(20),
    color: '#111',
    fontWeight: 'bold',
    marginBottom: 11,
    maxWidth: 200
  },
  IntroductionDetailBtn: {
    color: '#ff3348',
    fontSize: GLOBAL_PARAMS.em(16),
    paddingLeft: 10,
    paddingRight: 10
  },
  IntroductionFoodBrief: {
    fontSize: GLOBAL_PARAMS.em(14),
    color: '#999999',
    textAlign: 'justify',
    lineHeight: Platform.OS == 'ios' ? GLOBAL_PARAMS.em(20) : GLOBAL_PARAMS.em(25)
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
    fontSize: GLOBAL_PARAMS.em(18),
    color: Colors.fontBlack,
    marginRight: 8
  },
  AddPriceViewPrice: {
    fontSize: GLOBAL_PARAMS.em(25),
    color: '#ff3348',
    marginRight: GLOBAL_PARAMS._winWidth < 340 ? GLOBAL_PARAMS.em(10) : GLOBAL_PARAMS.em(15),
    marginBottom: -4
  },
  AddPriceViewOriginPrice: {
    fontSize: GLOBAL_PARAMS.em(16),
    color: '#9B9B9B'
  },
  AddPriceViewStriping: {
    width: GLOBAL_PARAMS._winWidth < 340 ? GLOBAL_PARAMS.em(60) : GLOBAL_PARAMS.em(75),
    transform: [{
      rotate: '-5deg'
    }],
    backgroundColor: '#9B9B9B',
    height: 2,
    position: 'absolute',
    bottom: 8,
    right: GLOBAL_PARAMS._winWidth < 340 ? GLOBAL_PARAMS.em(-3) : GLOBAL_PARAMS.em(-8),
    opacity: 0.63
  },
  AddPriceViewCountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  AddPriceViewCommonBtn: {
    width: GLOBAL_PARAMS.em(40),
    alignItems: 'center'
  },
  AddPriceViewAddImage: {
    width: GLOBAL_PARAMS.em(25),
    height: GLOBAL_PARAMS.em(25)
  },
  AddPriceViewCountText: {
    color: Colors.fontBlack,
    fontSize: GLOBAL_PARAMS.em(28),
    width: GLOBAL_PARAMS.em(40),
    textAlign: 'center'
  },
  AddPriceViewRemoveImage: {
    width: GLOBAL_PARAMS.em(34),
    height: GLOBAL_PARAMS.em(34),
    marginTop: 7
  },
  //_renderPlacePickerBtn
  PlacePickerBtn: {
    flexDirection: 'row',
    marginLeft: Platform.OS == 'ios' ? GLOBAL_PARAMS.em(-65) : GLOBAL_PARAMS.em(-30),
    maxWidth: Platform.OS == 'ios' ? GLOBAL_PARAMS.em(200) : GLOBAL_PARAMS.em(250),
    marginTop: Platform.OS == 'ios' ? GLOBAL_PARAMS.isIphoneX() ? 15 : 0 : GLOBAL_PARAMS.em(-8),
    position: 'relative'
  },
  PlacePickerBtnBgAbsolute: {
    backgroundColor: Colors.main_white,
    opacity: 0.2,
    borderRadius: 100,
    width: GLOBAL_PARAMS.em(250),
    height: GLOBAL_PARAMS.em(35),
  },
  PlacePickerBtnImage: {
    width: GLOBAL_PARAMS.em(20),
    height: GLOBAL_PARAMS.em(20),
    position: 'absolute',
    top: GLOBAL_PARAMS.em(8),
    left: GLOBAL_PARAMS.em(12)
  },
  PlacePickerBtnText: {
    color: Colors.main_white,
    marginLeft: 10,
    fontSize: GLOBAL_PARAMS.em(16),
    position: 'absolute',
    left: GLOBAL_PARAMS.em(33),
    top: Platform.OS == 'android' ? GLOBAL_PARAMS.em(7) : GLOBAL_PARAMS.em(8),
    height: GLOBAL_PARAMS.em(30)
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
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Platform.OS == 'ios' ? 0 : -8,
    height: 50,
    position: 'relative'
  },
  MenuImage: {
    width: GLOBAL_PARAMS.em(30),
    height: GLOBAL_PARAMS.em(15),
    marginTop: GLOBAL_PARAMS.isIphoneX() ? 15 : 0,
  },
  HeaderContent: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  HeaderContentActivityIndicator: {
    marginLeft: -60
  },
  BottomView: {
    height: 80,
    width: GLOBAL_PARAMS._winWidth
  }

})