import {
  StyleSheet,
  Platform
} from 'react-native';
import GLOBAL_PARAMS from '../utils/global_params';
import CommonStyles from './common.style';
import Colors from '../utils/Colors';


export default StyleSheet.create({
  //_renderFoodDetailView
  FoodContainer: {
    flexDirection: 'row',
    paddingBottom: GLOBAL_PARAMS.em(10)
  },
  FoodImage: {
    width: GLOBAL_PARAMS.em(80),
    height: GLOBAL_PARAMS.em(80),
    marginRight: GLOBAL_PARAMS.em(15)
  },
  FoodInnerContainer: {
    flex: 1
  },
  FoodTitleView: {
    ...CommonStyles.common_row,
    alignItems: 'flex-start',
    height: GLOBAL_PARAMS.em(23)
  },
  FoodCommonView: {
    ...CommonStyles.common_row,
    alignItems: 'center'
  },
  commonHeadering: {
    backgroundColor: Colors.main_white,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },
  commonText: {
    fontSize: GLOBAL_PARAMS.em(16),
    color: Colors.fontBlack
  },
  tabBarUnderlineStyle: {
    backgroundColor: '#FF3348',
    marginLeft: GLOBAL_PARAMS.widthAuto(47),
    width: GLOBAL_PARAMS.em(32)
  },
  //_renderPayView
  payContainer: {
    flexDirection: 'row',
    paddingTop: GLOBAL_PARAMS.em(10),
    paddingBottom: GLOBAL_PARAMS.em(10),
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  payStatus: {
    color: '#666666',
    fontSize: GLOBAL_PARAMS.em(16)
  },
  payInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  payTypeView: {
    padding: GLOBAL_PARAMS.em(5),
    paddingLeft: GLOBAL_PARAMS.em(10),
    paddingRight: GLOBAL_PARAMS.em(10),
    borderRadius: GLOBAL_PARAMS.em(20),
    borderWidth: 1,
    borderColor: '#979797'
  },
  payTypeText: {
    color: '#111111',
    fontSize: GLOBAL_PARAMS.em(16)
  },
  payStatusBtn: {
    padding: GLOBAL_PARAMS.em(5),
    paddingLeft: GLOBAL_PARAMS.em(10),
    paddingRight: GLOBAL_PARAMS.em(10),
    borderRadius: GLOBAL_PARAMS.em(20),
    borderWidth: 1,
    borderColor: '#FF3348',
    marginLeft: GLOBAL_PARAMS.em(5)
  },
  payStatusText: {
    color: '#ff3348',
    fontSize: GLOBAL_PARAMS.em(16)
  },
  //renderTotalPriceView
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  totalStatusText: {
    fontSize: GLOBAL_PARAMS.em(16),
    color: '#FF3348',
    marginTop: -3,
  },
  totalInnerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  totalUnitText: {
    fontSize: GLOBAL_PARAMS.em(16),
    color: '#666666',
    marginRight: GLOBAL_PARAMS.em(10),
  },
  totalPriceText: {
    fontSize: GLOBAL_PARAMS.em(22),
    color: '#FF3348',
    marginTop: -3,
  }
})