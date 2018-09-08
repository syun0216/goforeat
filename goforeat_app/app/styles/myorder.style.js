import {
  StyleSheet,
  Platform
} from 'react-native';
import GLOBAL_PARAMS,{em} from '../utils/global_params';
import CommonStyles from './common.style';
import Colors from '../utils/Colors';


export default StyleSheet.create({
  //_renderFoodDetailView
  FoodContainer: {
    flexDirection: 'row',
    paddingBottom: em(10)
  },
  FoodImage: {
    width: em(80),
    height: em(80),
    marginRight: em(15)
  },
  FoodInnerContainer: {
    flex: 1
  },
  FoodTitleView: {
    ...CommonStyles.common_row,
    alignItems: 'flex-start',
    height: em(23)
  },
  FoodCommonView: {
    ...CommonStyles.common_row,
    alignItems: 'center'
  },
  commonHeadering: {
    backgroundColor: Colors.main_white,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    position: 'relative',
  },
  activeRedTips: {
    width: em(8),
    height: em(8),
    position: 'absolute',
    top: em(11),
    right: em(13)
  },
  commonText: {
    fontSize: em(16),
    color: Colors.fontBlack
  },
  tabBarUnderlineStyle: {
    backgroundColor: '#FF3348',
    // marginLeft: Platform.OS == 'ios' ? GLOBAL_PARAMS.widthAuto(31) : GLOBAL_PARAMS.widthAuto(32),
    // width: em(32)
  },
  //_renderPayView
  payContainer: {
    flexDirection: 'row',
    paddingTop: em(10),
    paddingBottom: em(10),
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  payStatus: {
    color: '#666666',
    fontSize: em(16)
  },
  payInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  payTypeView: {
    padding: em(5),
    paddingLeft: em(10),
    paddingRight: em(10),
    borderRadius: em(20),
    borderWidth: 1,
    borderColor: '#979797'
  },
  payTypeText: {
    color: '#111111',
    fontSize: em(16)
  },
  payStatusBtn: {
    padding: em(5),
    paddingLeft: em(10),
    paddingRight: em(10),
    borderRadius: em(20),
    borderWidth: 1,
    borderColor: '#FF3348',
    marginLeft: em(5)
  },
  payStatusText: {
    color: '#ff3348',
    fontSize: em(16)
  },
  //renderTotalPriceView
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  totalStatusText: {
    fontSize: em(16),
    color: '#FF3348',
    marginTop: -3,
  },
  totalInnerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  totalUnitText: {
    fontSize: em(16),
    color: '#666666',
    marginRight: em(10),
  },
  totalPriceText: {
    fontSize: em(22),
    color: '#FF3348',
    marginTop: -3,
  }
})