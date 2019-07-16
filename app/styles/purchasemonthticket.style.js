import {
  StyleSheet,
  Platform
} from "react-native";
import GLOBAL_PARAMS, {
  em,
} from "../utils/global_params";

export default StyleSheet.create({
  detailTitle: {
    fontSize: em(22),
    fontWeight: '700',
  },
  detailSubTitle: {
    fontSize: em(18),
    color: '#959595',
  },
  detailQuantity: {
    color: '#ff5050',
    alignSelf: 'flex-end',
    fontSize: em(25),
  },
  detailDate: {
    fontSize: em(18),
    color: '#959595',
    alignSelf: 'flex-end',
  },
  topTitleView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: GLOBAL_PARAMS._winWidth * .03,
    paddingRight: GLOBAL_PARAMS._winWidth * .025,
    marginBottom: em(20)
  },
  topTitle: {
    fontSize: em(22),
    fontWeight: '700',
    marginBottom: em(20)
  },
  subTitle: {
    color: '#959595',
    fontSize: em(18),
    marginLeft: em(5)
  },
  img: {
    width: em(100),
    height: em(100)
  },
  ticketItem: {
    width: GLOBAL_PARAMS._winWidth * .95,
    height: em(100),
    marginLeft: GLOBAL_PARAMS._winWidth * .025,
    borderWidth: 3,
    borderColor: '#e8e9ed',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: em(8),
    marginBottom: em(10),
    padding: em(20)
  },
  activeItem: {
    borderColor: '#fe4908'
  },
  amount: {
    fontSize: em(18),
    color: '#333',
    marginBottom: em(10)
  },
  price: {
    fontSize: em(25),
    color: '#666',
    marginBottom: em(5)
  },
  oriPrice: {
    textDecorationLine: 'line-through',
    color: '#959595',
    fontSize: em(14),
    textAlign: 'right'
  },
  date: {
    color: '#666',
    fontSize: em(16),
  },
  footer: {
    position: 'absolute',
    bottom: GLOBAL_PARAMS.isIphoneX() ? -15 : 0,
    height: em(90),
    borderTopWidth: 1,
    borderTopColor: '#e8e9ed',
    left:0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingLeft: GLOBAL_PARAMS._winWidth * .025,
    paddingRight: GLOBAL_PARAMS._winWidth * .025,
    paddingTop: em(8),
    // height: em(60),
    marginBottom: GLOBAL_PARAMS.isIphoneX() ? 15 :0 ,
    justifyContent: 'space-between',
    alignItems:'flex-start'
  },
  priceContent: {
    height: em(50),
    flexDirection: 'row',
    alignItems: 'center'
  },
  unit: {
    fontSize: em(14),
    color: '#333',
    marginTop: em(10),
    marginRight: em(10),
  },
  total: {
    fontSize: em(30),
    color: '#333',
    fontWeight: '700'
  },
  submitBtn: {
    width: em(130),
    height: em(50),
    borderRadius: em(50),
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center'
  },
  submitBtnText: {
    color: '#fff',
    fontSize: em(17)
  },
  payBtn: {
    width: GLOBAL_PARAMS._winWidth *.95,
    paddingLeft: GLOBAL_PARAMS._winWidth*.025,
    height: em(50),
    borderRadius: em(50),
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: GLOBAL_PARAMS.isIphoneX() ? GLOBAL_PARAMS.iPhoneXBottom : 0

  },
  confirmView: {
    backgroundColor: '#fff',
    minWidth: 300,
    minHeight:Platform.OS == 'ios' ? 280 : 230,
    paddingLeft: GLOBAL_PARAMS._winWidth * .025,
    paddingRight: GLOBAL_PARAMS._winWidth * .025,
    position: 'relative',
  },
  confirmOrderBar: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    left: GLOBAL_PARAMS._winWidth * .025,
    right: GLOBAL_PARAMS._winWidth * .025,
    bottom: em(10)
  },
  confirmTopTitle: {
    padding: em(10),
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',    
  },
  confirmTopTitleText: {
    color: '#333',
    fontSize: em(20),
    fontWeight: '700'
  },
  confirmContent: {
    justifyContent:'center',
    alignItems: 'flex-start',
    marginTop: em(20),
  },
  confirmCommonText: {
    color: '#333',
    fontSize: em(17)
  },
  confirmStrongText: {
    color: '#ff5858',
    fontSize: em(30),
    marginTop: em(-13)
  },
  checPayTypeItem: {
    borderBottomWidth: 0,
    paddingLeft: GLOBAL_PARAMS._winWidth* 0.06,
    paddingRight: GLOBAL_PARAMS._winWidth* 0.06
  },
  infoView: {
  },
  infoViewTop: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems:'center',
    marginTop: em(20),
  },
  grayDivider: {
    backgroundColor: '#ccc',
    width: 0.25*GLOBAL_PARAMS._winWidth,
    height: 1
  },
  dividerText: {
    fontSize: em(19),
    color: '#959595'
  },
  infoContent: {
    paddingLeft: GLOBAL_PARAMS._winWidth* 0.04,
    paddingRight: GLOBAL_PARAMS._winWidth* 0.04,
    marginTop: em(25),
  },
  infoContentText: {
    color: '#959595',
    fontSize:em (16),
    lineHeight: em(30),
  }
});