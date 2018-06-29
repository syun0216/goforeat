import {StyleSheet,Platform} from 'react-native';
import GLOBAL_PARAMS from '../utils/global_params';
import Colors from '../utils/Colors';

const common = {
  marginLeft: GLOBAL_PARAMS._winWidth*0.08,
  fontColor: Colors.fontBlack,
}

export default StyleSheet.create({
  // _renderDateFormat
  DateFormatView: {
    marginTop:20,
    marginLeft:common.marginLeft
  },
  DateFormatWeekText: {
    color:Colors.fontBlack,
    fontSize: 18,
    marginBottom: 5,
    fontWeight: 'bold'
  },
  DateFormatDateText: {
    color: Colors.fontGray,
    fontSize: 13
  },
  //_renderDeadLineDate
  DeadLineDateView: {
    marginTop: 10,
    marginLeft: common.marginLeft
  },
  DeadLineDateText: {
    color: '#999999',
    fontSize: 16
  },
  //_renderIntrodutionView
  IntroductionView: {
    width: GLOBAL_PARAMS._winWidth,
    paddingLeft: common.marginLeft,
    paddingRight: common.marginLeft,
    paddingBottom: 10
  },
  IntroductionFoodName: {
    fontSize: 20,
    color: '#111',
    fontWeight:'bold',
    marginBottom:11
  },
  IntroductionFoodBrief: {
    fontSize: 14,
    color:'#999999',
    textAlign:'justify',
    lineHeight:Platform.OS =='ios'? 20 : 25
  },
  // _renderAddPriceView
  AddPriceView: {
    width: GLOBAL_PARAMS._winWidth,
    paddingLeft:common.marginLeft,
    paddingRight:common.marginLeft,
    flexDirection: 'row',
    justifyContent:'space-between',alignItems:'center'
  },
  AddPriceViewPriceContainer: {
    position:'relative',
    flexDirection: 'row',
    alignItems:'flex-end'
  },
  AddPriceViewPriceUnit: {
    fontSize: 18,
    color: Colors.fontBlack,
    marginRight: 8
  },
  AddPriceViewPrice: {
    fontSize: 25,
    color: '#ff3348',marginRight:GLOBAL_PARAMS._winWidth < 340 ?10 : 15,
    marginBottom:-4
  },
  AddPriceViewOriginPrice: {
    fontSize: 16,
    color: '#9B9B9B'
  },
  AddPriceViewStriping: {
    width: GLOBAL_PARAMS._winWidth < 340 ? 60 : 75,transform: [{ rotate: '-5deg'}],backgroundColor:'#9B9B9B',height:2,position:'absolute',bottom:8,right:GLOBAL_PARAMS._winWidth< 340 ? -3: -8,opacity:0.63
  },
  AddPriceViewCountContainer: {
    flexDirection:'row',justifyContent:'space-between',alignItems:'center'
  },
  AddPriceViewCommonBtn: {
    width: 40,
    alignItems:'center'
  },
  AddPriceViewAddImage: {
    width:25,height:25
  },
  AddPriceViewCountText: {
    color:Colors.fontBlack,fontSize:28,width:40,textAlign:'center'
  },
  AddPriceViewRemoveImage: {
    width:34,height:34,marginTop:7
  },
  //_renderPlacePickerBtn
  PlacePickerBtn: {
    flexDirection:'row',
    marginLeft:Platform.OS == 'ios' ? -65 : -30,
    maxWidth: Platform.OS == 'ios' ? 200 :250,
    marginTop: Platform.OS == 'ios' ? 0 : -8,
    position: 'relative'
  },
  PlacePickerBtnBgAbsolute: {
    backgroundColor:Colors.main_white,opacity:0.2,borderRadius: 100,width:250,height: 35,
  },
  PlacePickerBtnImage: {
    width: 20,height: 20,position:'absolute',top: 8,left:12
  },
  PlacePickerBtnText: {
    color: Colors.main_white,marginLeft: 10,
    fontSize: 16,position: 'absolute',
    left: 33,
    top:Platform.OS =='android' ? 7 : 8,height: 30
  },
  //render
  ContainerBg: {
    backgroundColor: '#fff'
  },
  Header: {
    borderBottomWidth: 0,
    padding: 0
  },
  linearGradient: {
    height: 65,
    width: GLOBAL_PARAMS._winWidth,
    marginTop: Platform.OS == 'ios' ? -15 : 0,
    paddingTop: Platform.OS == 'ios' ? 15 : 0,
    justifyContent:'center',
    alignItems:'center',
    flexDirection: 'row',
  },
  MenuBtn: {
    width: 60,justifyContent:'center',alignItems:'center',marginTop: Platform.OS == 'ios' ? 0 : -8,height: 50,position:'relative'
  },
  MenuImage: {
    width: 30,
    height: 15
  },
  HeaderContent: {
    flex: 1,alignItems:'center',flexDirection:'row',justifyContent:'center',
  },
  HeaderContentActivityIndicator: {
    marginLeft: -60
  },
  BottomView: {
    height: 80,
    width: GLOBAL_PARAMS._winWidth
  }

})
