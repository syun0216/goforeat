import React from 'react';
import PropTypes from 'prop-types';
import {View,Image,Text} from 'react-native';
//utils
import GLOBAL_PARAMS from '../utils/global_params';

const BlankPage = ({message,style}) => {
  return (
    <View style={[{width: GLOBAL_PARAMS._winWidth, marginTop: 10,minHeight: 250, justifyContent: 'center', alignItems: 'center', },style]}>
      <Image source={require('../asset/cry.png')} style={{width: 100,height: 100}}/>
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