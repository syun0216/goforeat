import React from 'react';
import PropTypes from 'prop-types';
import {View,Image,Text} from 'react-native';
//utils
import GLOBAL_PARAMS from '../utils/global_params';
import Colors from "../utils/Colors";

const BlankPage = ({message,style}) => {
  return (
    <View style={[{backgroundColor: Colors.main_white,
      justifyContent: "flex-start",
      alignItems:'center',
      padding: 60,
      backgroundColor: "transparent",
      height: GLOBAL_PARAMS._winHeight},style]}>
      <Image source={require('../asset/cry.png')} style={{width: 100,height: 100,marginTop: 20}}/>
      <Text  allowFontScaling={false} style={{fontSize: 16,marginTop:20,color:'#cdcdcd',fontWeight:'bold'}}>{message}</Text>
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