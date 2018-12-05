import React from 'react';
import PropTypes from 'prop-types';
import {View,Image,StyleSheet,Platform} from 'react-native';
import LottieView from 'lottie-react-native';
//utils
import GLOBAL_PARAMS,{em} from '../utils/global_params';
import Colors from "../utils/Colors";
//components
import Text from './UnScalingText';
import CommonBottomBtn from '../components/CommonBottomBtn';

const styles = StyleSheet.create({
  blankContainer: {
    // position:'absolute',
    // top:0,
    // left:0,
    // flex:1,
    backgroundColor: Colors.main_white,
    justifyContent: "flex-start",
    alignItems:'center',
    padding: GLOBAL_PARAMS.em(60),
    height: GLOBAL_PARAMS._winHeight
  },
  blankContainerAndroid: {
    position:'absolute',
    top:0,
    left:0,
    flex:1,
    justifyContent: "flex-start",
    alignItems:'center',
    padding: GLOBAL_PARAMS.em(60),
    backgroundColor: Colors.main_white,
    width: GLOBAL_PARAMS._winWidth,
    height: GLOBAL_PARAMS._winHeight,
    zIndex: 10
  }
});

const BlankPage = ({message,style,hasBottomBtn,clickFunc}) => {
  return (
    <View style={[Platform.OS=='ios'?styles.blankContainer:styles.blankContainerAndroid,style]}>
      <LottieView
        ref={lv => this._lv = lv}
        autoPlay={true}
        style={{width: em(120),height: em(120)}}
        source={require('../animations/emoji_wink.json')}
        loop={false}
        enableMergePathsAndroidForKitKatAndAbove
      />
      <Text  allowFontScaling={false} style={{fontSize: GLOBAL_PARAMS.em(16),color:'#cdcdcd',fontWeight:'bold'}}>{message}</Text>
      {
        hasBottomBtn ? <CommonBottomBtn style={{width: GLOBAL_PARAMS._winWidth*0.5}} clickFunc={() => clickFunc()}>去下單</CommonBottomBtn> : null
      }
    </View>
  )
}

BlankPage.defaultProps = {
  message: 'T_T暫無數據',
  style: {},
  hasBottomBtn: false,
  clickFunc: () => {}
};

BlankPage.propsType = {
  message: PropTypes.String,
  style: PropTypes.object,
  hasBottomBtn: PropTypes.bool,
  clickFunc: PropTypes.func
}

export default BlankPage;