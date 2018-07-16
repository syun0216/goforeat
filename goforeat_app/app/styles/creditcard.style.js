import {StyleSheet,Platform} from 'react-native';
import GLOBAL_PARAMS from '../utils/global_params';
import Colors from '../utils/Colors';

export default StyleSheet.create({
  BtnView: {
    height: GLOBAL_PARAMS._winHeight*0.225,
    justifyContent: 'center',
    alignItems: 'center',
  },
  CommonInputView: {
    backgroundColor: Colors.main_white,
    height: 60 * (GLOBAL_PARAMS._winWidth/375),
    width: GLOBAL_PARAMS._winWidth,
    padding: 20,
    paddingLeft: 15,
    paddingRight: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#edebf4',
    borderTopWidth: 1,
    borderTopColor: '#edebf4',
  },
  InputTitle: {
    fontSize: 16,
    color: '#333333'
  }
})