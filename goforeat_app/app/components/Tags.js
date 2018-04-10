import React from 'react';
import { View,Text } from 'react-native';
import PropTypes from 'prop-types';
//utils
import Colors from '../utils/Colors';

const Tags = ({message,color,style}) => (
  <View style={[{width:22,height:22,justifyContent:'center',alignItems:'center',backgroundColor:color},style]}>
    <Text style={{fontSize:13,color:Colors.main_white,fontWeight:'bold'}}>{message}</Text>
  </View>
)


Tags.propTypes = {
  message: PropTypes.string,
  color: PropTypes.string,
  style: PropTypes.object
}

Tags.defaultProps = {
  message: '外',
  color: Colors.main_orange,
  style:{}
}

export default Tags;
