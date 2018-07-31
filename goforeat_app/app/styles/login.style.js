import {StyleSheet,Platform} from 'react-native';
import GLOBAL_PARAMS from '../utils/global_params';
import Colors from '../utils/Colors';
import CommonStyles from '../styles/common.style';

const diffPlatform = {
  content_height: Platform.select({ios: GLOBAL_PARAMS._winHeight*0.6,android:GLOBAL_PARAMS._winHeight*0.55})
}

export default StyleSheet.create({
  LoginContainer: {
    backgroundColor: '#fff'
  },
  //_renderTopImage
  TopImageView: {
    width: GLOBAL_PARAMS._winWidth,
    position: 'relative',
  },
  TopImage: {
    width: GLOBAL_PARAMS._winWidth,
    height: GLOBAL_PARAMS._winHeight * 0.25
  },
  TopImageViewInner: {
    width: GLOBAL_PARAMS._winWidth,
    position:'absolute',
    top: 0,
    left: 0,
    height: GLOBAL_PARAMS._winHeight * 0.25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  TopImageViewTitle: {
    width: GLOBAL_PARAMS._winWidth*0.5,
    height: GLOBAL_PARAMS._winHeight * 0.1,
    paddingTop: 10
  },
  CloseBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: GLOBAL_PARAMS._winHeight * 0.09,
    left: 20,
    // zIndex: 100
  },
  CloseImage: {
    fontSize: 40, color: '#fff'
  },
  //_renderContentView
  ContentView: {
    width: GLOBAL_PARAMS._winWidth,
    height: diffPlatform.content_height,
    paddingLeft: 10,
    paddingRight: 10,
  },
  Title: {
    color: '#111111',
    fontSize: 26,
    fontWeight: '600',
    height: GLOBAL_PARAMS._winHeight* 0.15,
    lineHeight: GLOBAL_PARAMS._winHeight*0.15,
    marginLeft: 5,
  },
  LoginBtn: {
    ...CommonStyles.btn,
    alignSelf: 'center'
  },
  CommonView: {
    height: GLOBAL_PARAMS._winHeight*0.225,
    justifyContent: 'center'
  },
  CommonInputView: {
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
    flexDirection: 'row',
    alignItems: 'center'
  },
  Icon: {
    width: 17,
    height: 26,
    marginRight: 20,
    marginLeft: 5
  },
  ChangePhoneTypeBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 15,
    marginTop: 5
  },
  PhoneTypeText: {
    fontSize: 21,
    fontWeight: "400"
  },
  ArrowDown: {
    width: 20,
    height: 10,
    marginLeft: 10
  },
  CommonInput: {
    flex: 1,
    color: '#111111',
    marginTop: 7
  },
  BtnView: {
    alignItems:'center',
    justifyContent: 'center',
  },
  SendBtn: {
    padding: 5,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#999999',
    marginRight: 10
  },
  SendText: {
    color: '#999999'
  },
})
