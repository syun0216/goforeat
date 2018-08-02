import React from 'react';
import PropTypes from 'prop-types';
import {View,Image,StyleSheet,Platform} from 'react-native';
//utils
import GLOBAL_PARAMS from '../utils/global_params';
import Colors from "../utils/Colors";
//components
import Text from './UnScalingText';

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
    backgroundColor: "transparent",
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

const BlankPage = ({message,style}) => {
  return (
    <View style={[Platform.OS=='ios'?styles.blankContainer:styles.blankContainerAndroid,style]}>
      <Image source={require('../asset/cry.png')} style={{width: GLOBAL_PARAMS.em(100),height: GLOBAL_PARAMS.em(100),marginTop: GLOBAL_PARAMS.em(20)}}/>
      <Text  allowFontScaling={false} style={{fontSize: GLOBAL_PARAMS.em(16),marginTop:GLOBAL_PARAMS.em(20),color:'#cdcdcd',fontWeight:'bold'}}>{message}</Text>
    </View>
  )
}

BlankPage.defaultProps = {
  message: '暫無數據',
  style: {}
};

BlankPage.propsType = {
  message: PropTypes.String,
  style: PropTypes.object
}

export default BlankPage;