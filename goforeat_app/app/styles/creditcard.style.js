import {StyleSheet,Platform} from 'react-native';
import GLOBAL_PARAMS,{em} from '../utils/global_params';
import Colors from '../utils/Colors';
import { Col } from 'native-base';

export default StyleSheet.create({
  BtnView: {
    height: GLOBAL_PARAMS._winHeight*0.225,
    justifyContent: 'center',
    alignItems: 'center',
  },
  CommonInputView: {
    backgroundColor: Colors.main_white,
    height: em(60),
    width: GLOBAL_PARAMS._winWidth,
    padding: em(20),
    paddingLeft: em(15),
    paddingRight: em(15),
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
    padding: em(15),
    paddingLeft: em(15),
    paddingRight: em(15),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:'center',
    borderBottomWidth: 1,
    borderBottomColor: '#edebf4',
  },
  InputTitle: {
    fontSize: em(16),
    color: '#333333'
  },
  Input: {
    color: '#333333',
    fontSize: em(16),
    width: em(200),
    justifyContent:'flex-end',
    height: em(60)
  },
  Input_Android: {
    color: '#333333',
    fontSize: em(16),
    width: em(200),
    justifyContent:'flex-end',
    height: GLOBAL_PARAMS.widthAuto(60),
  },
  SelectBtn: {
    width: em(200),
    height: em(60),
    justifyContent:'center',
    paddingLeft: Platform.OS=='android'?4:0
  },
  BottomInfoBtn: {
    flexDirection: 'row',
    width: GLOBAL_PARAMS._winWidth*0.4,
    alignSelf: 'center',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: em(10)
  },
  BottomInfoIcon: {
    color: Colors.main_orange,
    fontSize: em(25)
  },
  BottomInfoText: {
    color: '#333'
  },
  panelTitle: {
    textAlign: 'center',
    fontWeight: '700',
    fontSize: em(25),
    marginBottom: em(20)
  },
  panelItemInfo: {
    flexDirection: 'row',
    width: GLOBAL_PARAMS._winWidth*0.9,
    marginBottom: em(20),
    alignItems: 'center'
  },
  panelItemImg: {
    flex: 1,
    marginRight:em(15),
  },
  panelItemContainer: {
    width: GLOBAL_PARAMS._winWidth*0.7
  },
  panelItemTitle: {
    color: Colors.main_orange,
    fontSize: em(20),
    marginBottom: em(10)
  },
  panelItemDesc: {
    color: '#333',
    fontSize: em(14),
    textAlign: 'justify'
  }
})