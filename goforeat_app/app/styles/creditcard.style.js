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
    height: GLOBAL_PARAMS.widthAuto(60),
    width: GLOBAL_PARAMS._winWidth,
    padding: GLOBAL_PARAMS.em(20),
    paddingLeft: GLOBAL_PARAMS.em(15),
    paddingRight: GLOBAL_PARAMS.em(15),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  CommonInputAndroidView: {
    backgroundColor: Colors.main_white,
    height: GLOBAL_PARAMS.widthAuto(60),
    width: GLOBAL_PARAMS._winWidth,
    padding: GLOBAL_PARAMS.em(15),
    paddingLeft: GLOBAL_PARAMS.em(15),
    paddingRight: GLOBAL_PARAMS.em(15),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:'center',
    borderBottomWidth: 1,
    borderBottomColor: '#edebf4',
  },
  InputTitle: {
    fontSize: GLOBAL_PARAMS.em(16),
    color: '#333333'
  },
  Input: {
    color: '#333333',
    fontSize: GLOBAL_PARAMS.em(16),
    width: GLOBAL_PARAMS.em(200),
    justifyContent:'flex-end',
  },
  Input_Android: {
    color: '#333333',
    fontSize: GLOBAL_PARAMS.em(16),
    width: GLOBAL_PARAMS.em(200),
    justifyContent:'flex-end',
    height: GLOBAL_PARAMS.widthAuto(60),
  },

  SelectBtn: {
    width: GLOBAL_PARAMS.em(200),
    justifyContent:'flex-end',
    paddingLeft: Platform.OS=='android'?4:0
  }
})