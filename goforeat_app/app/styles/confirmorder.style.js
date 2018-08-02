import {
  StyleSheet,
  Platform
} from 'react-native';
import GLOBAL_PARAMS from '../utils/global_params';
import Colors from '../utils/Colors';
export default StyleSheet.create({
  //_renderPopupDialogView
  CommonListItem: {
    justifyContent: 'space-between',
  },
  Footer: {
    backgroundColor: Colors.main_white,
    borderTopWidth: 0,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
  },
  ConfirmBtn: {
    flex: 1,
    marginTop: 5,
    backgroundColor: '#FF3348',
    marginLeft: 40,
    marginRight: 40
  },
  ConfirmBtnText: {
    color: Colors.main_white,
    fontWeight: "600",
    fontSize: GLOBAL_PARAMS.em(16)
  },
  //_renderNewOrderView
  NewsInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  FoodName: {
    color: '#111111',
    fontSize: GLOBAL_PARAMS.em(18),
    flex: 1,
    fontWeight: '600'
  },
  FoodMoney: {
    color: '#111111',
    fontSize: GLOBAL_PARAMS.em(18)
  },
  CountView: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  CountText: {
    color: '#999999',
    fontSize: GLOBAL_PARAMS.em(16),
    marginRight: 5
  },
  FoodNum: {
    color: Colors.middle_red,
    fontSize: GLOBAL_PARAMS.em(16)
  },
  TotalText: {
    flex: 1,
    fontSize: GLOBAL_PARAMS.em(18),
    color: '#333333',
  },
  CouponText: {
    flex: 1,
    fontSize: GLOBAL_PARAMS.em(14),
    color: '#333333'
  },
  MoneyUnit: {
    fontSize: GLOBAL_PARAMS.em(20),
    color: '#111111',
    marginRight: 5
  },
  CouponUnit: {
    fontSize: GLOBAL_PARAMS.em(14),
    color: '#111111',
    marginRight: 5
  },
  TotalMoney: {
    fontSize: GLOBAL_PARAMS.em(22),
    color: '#ff3448',
    marginTop: -2,
    fontWeight: '600'
  },
  CouponMoney: {
    fontSize: GLOBAL_PARAMS.em(16),
    color: '#ff3448',
    marginTop: -2,
    fontWeight: '600'
  },
  //renderNewDetailsVew
  Title: {
    color: '#111111',
    fontSize: GLOBAL_PARAMS.em(20),
    fontWeight: 'bold'
  },
  Input: {
    color: '#111',
    fontSize: GLOBAL_PARAMS.em(16),
    height: Platform.OS == 'ios' ? GLOBAL_PARAMS.heightAuto(30) : 45 * (GLOBAL_PARAMS._winHeight / 592),
    width: GLOBAL_PARAMS._winWidth * 0.85,
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
  },
  //renderCommonDetailView
  DetailText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
    paddingBottom: 10
  },
  DetailInner: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  ArrowDown: {
    width: 20,
    height: 20,
    color: '#C8C7C7',
    marginTop: -8
  },
  //renderCouponBtnView
  CouponInput: {
    backgroundColor: '#F0EFF6',
    color: '#111111',
    fontSize: GLOBAL_PARAMS.em(14),
    borderBottomLeftRadius: 3,
    borderTopLeftRadius: 3,
    paddingLeft: 5,
    height: 40
  },
  CouponBtn: {
    backgroundColor: '#E1E0EA',
    // padding: Platform.OS == 'IOS' ? 12: 11,
    height: 40,
    paddingLeft: 25,
    paddingRight: 25,
    justifyContent: 'center',
    borderBottomRightRadius: 3,
    borderTopRightRadius: 3,
  },
  CouponText: {
    color: '#FF3348'
  }
})