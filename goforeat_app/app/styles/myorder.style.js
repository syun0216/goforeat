import {StyleSheet,Platform} from 'react-native';
import GLOBAL_PARAMS from '../utils/global_params';
import CommonStyles from './common.style';


export default StyleSheet.create({
  //_renderFoodDetailView
  FoodContainer: {
    flexDirection:'row',
    paddingBottom: 10
  },
  FoodImage: {
    width: 80,height: 80,marginRight: 20
  },
  FoodInnerContainer: {
    flex: 1
  },
  FoodTitleView: {
    ...CommonStyles.common_row,
    alignItems: 'flex-start',
    height: 23
  },
  FoodCommonView: {
    ...CommonStyles.common_row,
    alignItems: 'center'
  },
  //_renderPayView



})