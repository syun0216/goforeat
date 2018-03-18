import React from 'react';
import PropTypes from 'prop-types';
import {View,Image,Text} from 'react-native';
//utils
import GLOBAL_PARAMS from '../utils/global_params';

const BlankPage = ({message}) => {
  return (
    <View style={{width: GLOBAL_PARAMS._winWidth, marginTop: 10,minHeight: 250, justifyContent: 'center', alignItems: 'center', }}>
      <Image source={{uri: '404'}} style={{width: 128,height: 128}}/>
      <Text style={{fontSize: 16,}}>{message}</Text>
    </View>
  )
}

BlankPage.defaultProps = {
  message: '暫無數據'
};

BlankPage.propsType = {
  message: PropTypes.String,
}

export default BlankPage;