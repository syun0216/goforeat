import { StyleSheet, Platform } from "react-native";
import GLOBAL_PARAMS, { em } from "../utils/global_params";
import Colors from "../utils/Colors";

const common = {
  marginLeft: em(15),
  fontColor: Colors.fontBlack
};

export default StyleSheet.create({
  // _renderDateFormat
  DateFormatView: {
    marginTop: em(10),
    marginLeft: common.marginLeft
  },
  DateFormatWeekText: {
    fontSize: em(20),
    fontWeight: "bold"
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
    color: "#999999",
    fontSize: em(16)
  },
  //_renderIntrodutionView
  IntroductionView: {
    width: GLOBAL_PARAMS._winWidth,
    paddingLeft: common.marginLeft,
    paddingRight: common.marginLeft,
    marginBottom: em(10)
  },
  IntroductionFoodNameCotainer: {
    position: 'relative',
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingBottom: em(10)
  },
  IntroductionFoodName: {
    fontSize: em(20),
    color: "#111",
    fontWeight: "bold",
    maxWidth: em(200)
  },
  IntroductionDetailBtn: {
    color: "#ff3348",
    fontSize: em(16),
    paddingLeft: em(12),
    paddingRight: 0
  },
  Commentbtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },  
  CommentImg: {
    width: em(20),
    height: em(20)
  },
  IntroductionFoodBrief: {
    fontSize: em(14),
    color: "#999999",
    textAlign: "justify",
    lineHeight: Platform.OS == "ios" ? em(20) : em(25)
  },
  // _renderAddPriceView
  AddPriceView: {
    width: GLOBAL_PARAMS._winWidth,
    paddingLeft: common.marginLeft,
    paddingRight: common.marginLeft,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  AddPriceViewPriceContainer: {
    position: "relative",
    flexDirection: "row",
    alignItems: "flex-end"
  },
  AddPriceViewPriceUnit: {
    fontSize: em(18),
    color: Colors.fontBlack,
    marginRight: 8
  },
  AddPriceViewPrice: {
    fontSize: em(25),
    color: "#ff3348",
    marginRight: GLOBAL_PARAMS._winWidth < 340 ? em(10) : em(15),
    marginBottom: -4
  },
  AddPriceViewOriginPrice: {
    fontSize: em(14),
    color: "#9B9B9B"
  },
  AddPriceViewStriping: {
    width: GLOBAL_PARAMS._winWidth < 340 ? em(60) : em(85),
    transform: [
      {
        rotate: "-5deg"
      }
    ],
    backgroundColor: "#9B9B9B",
    height: 2,
    position: "absolute",
    bottom: 8,
    right: em(-3),
    opacity: 0.63
  },
  AddPriceViewCountContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  AddPriceViewCommonBtn: {
    width: em(40),
    alignItems: "center"
  },
  AddPriceViewAddImage: {
    width: em(25),
    height: em(25)
  },
  AddPriceViewCountText: {
    color: Colors.fontBlack,
    fontSize: em(28),
    width: em(40),
    textAlign: "center"
  },
  AddPriceViewRemoveImage: {
    width: em(34),
    height: em(34),
    marginTop: 7
  },
  //_renderPlacePickerBtn
  PlacePickerBtn: {
    flexDirection: "row",
    // marginLeft: Platform.OS == 'ios' ? em(-45) : em(-30),
    flex: 1,
    position: "relative"
  },
  PlacePickerBtnBgAbsolute: {
    backgroundColor: Colors.main_white,
    // opacity: 0.2,
    borderRadius: 100,
    // width: em(250),
    flex: 1,
    height: em(32)
  },
  PlacePickerBtnImage: {
    // width: em(30),
    // height: em(30),
    position: "absolute",
    top: em(6),
    right: em(10),
    color: '#9C9FA1',
    fontSize: em(18)
  },
  PlacePickerBtnText: {
    color: '#9C9FA1',
    marginLeft: 10,
    fontSize: em(16),
    position: "absolute",
    left: em(8),
    top: Platform.OS == "android" ? em(5) : em(7),
    maxWidth: Platform.OS == "ios" ? em(218) : em(250)
  },
  //render
  ContainerBg: {
    backgroundColor: "#fff"
  },
  Header: {
    backgroundColor: '#FE560A',
    height: GLOBAL_PARAMS.isIphoneX() ? 44 : Platform.OS == 'ios' ? 64 : 50,
    borderBottomWidth: 0,
    padding: 0,
    marginTop: Platform.OS == "ios" ? (GLOBAL_PARAMS.isIphoneX() ? -44 : -20) : 0,
    marginBottom: GLOBAL_PARAMS.isIphoneX() ? GLOBAL_PARAMS.iPhoneXTop : 0,
    elevation: 0
  },
  linearGradient: {
    height: Platform.OS == 'ios' ? 50 : 50,
    width:Platform.OS == 'ios' ? GLOBAL_PARAMS._winWidth + 5 : GLOBAL_PARAMS._winWidth,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row"
  },
  MenuBtn: {
    width: GLOBAL_PARAMS._winWidth * 0.15,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 0,
    height: 50,
    position: "relative"
  },
  MenuBtnAndroid: {
    width: GLOBAL_PARAMS._winWidth * 0.15,
    justifyContent: "center",
    alignItems: "center",
    height: 64,
    position: "relative",
  },
  MenuImage: {
    fontSize: em(25),
    color: '#fff',
  },
  moreIcon: {
    color: '#fff',
    fontSize: em(23),
  },
  HeaderContent: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  BottomView: {
    height: 80,
    width: GLOBAL_PARAMS._winWidth
  },
  //details
  panelTitle: {
    fontSize: em(20),
    marginTop: em(10),
    marginBottom: em(10)
  },
  panelImage: {
    height: em(250),
    marginTop: em(10),
    marginBottom: em(10),
    borderRadius: em(8)
  },
  canteenName: {
    fontSize: em(16),
    color: "#999999"
  },
  canteenFavorite: {
    width: em(20),
    marginRight: em(8),
    marginTop: -1
  },
  canteenFavoriteActive: {
    marginRight: em(8),
    color: Colors.main_orange,
    width: em(20),
    marginTop: -1
  },
  canteenImg:
    Platform.OS == "ios"
      ? {
          width: em(16),
          height: em(13)
        }
      : {
          width: em(16),
          height: em(13)
        },
  addFruitView: {
    flexDirection: 'row',
    position: 'relative',
    justifyContent: 'space-between',
    paddingLeft: common.marginLeft,
    paddingRight: common.marginLeft
  },
  addFruitText: {
    color: "#959595",
    fontSize: em(18)
  },
  fruitTips: {
    position: 'absolute',
    bottom: em(-25),
    right: common.marginLeft,
    color: "#959595"
  },
  commentItem: {
    flexDirection: 'row',
    padding: em(10)
  },
  commentItemAvatar: {
    width: em(40),
    height: em(40),
    borderRadius: em(20),
    marginRight: em(10),
    borderWidth: 1,
    borderColor: '#ccc'
  },
  commentItemContent: {
    justifyContent: 'space-between',
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#efefef',
    height: em(80),
    paddingBottom: em(10),
    marginRight: em(5)
  },
  commentName: {
    color: '#043e79',
    fontSize: em(16)
  },
  commentCommonText: {
    color: '#666',
    fontSize: em(14)
  }
});
