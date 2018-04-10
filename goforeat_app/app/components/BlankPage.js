import React from 'react';
import PropTypes from 'prop-types';
import {View,Image,Text} from 'react-native';
//utils
import GLOBAL_PARAMS from '../utils/global_params';

const BlankPage = ({message,style}) => {
  return (
    <View style={[style,{width: GLOBAL_PARAMS._winWidth, marginTop: 10,minHeight: 250, justifyContent: 'center', alignItems: 'center', }]}>
      <Image source={require('../asset/cry.png')} style={{width: 120,height: 120}}/>
      <Text style={{fontSize: 16,marginTop:10,color:'#cdcdcd',fontWeight:'bold'}}>{message}</Text>
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