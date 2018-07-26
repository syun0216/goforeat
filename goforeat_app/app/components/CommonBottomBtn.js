import React from 'react';
import PropTypes from 'prop-types';
import { View,TouchableOpacity,Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
//styles
import CommonStyles from '../styles/common.style';



/**
 *底部公用渐变btn
 *
 * @param {*} content string
 * @param {*} clickFunc func
 * @returns element
 */
const CommonBottomBtn = props => {
  return (
    <View style={CommonStyles.common_btn_container}>
      <TouchableOpacity onPress={props.clickFunc}>
        <LinearGradient colors={['#FF9F48','#FF4141']} start={{x:0.0, y:0.0}} end={{x:1.0,y: 0.0}} style={CommonStyles.btn}>
          <Text style={{color:'#fff',fontSize:16}}>{props.content}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  )
}

CommonBottomBtn.defaultProps = {
  content: '確定',
  clickFunc: () => {}
}

CommonBottomBtn.propsType = {
  content: PropTypes.string,
  clickFunc: PropTypes.func
}

export default CommonBottomBtn;