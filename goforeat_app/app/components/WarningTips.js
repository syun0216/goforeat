import React from 'react';
import PropTypes from 'prop-types';
import {View,Image,StyleSheet,TouchableOpacity} from 'react-native';
import {Icon} from 'native-base';
//utils
import GLOBAL_PAMRAS,{em} from '../utils/global_params';
//components
import Text from './UnScalingText';

const styles = StyleSheet.create({
  warn_container: {
    backgroundColor: '#FEFCEB',
    width: GLOBAL_PAMRAS._winWidth,
    height: em(36),
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 9,
    paddingBottom: 9,
    paddingLeft: 5,
    paddingRight: 5,
    alignItems: 'center'
  },
  warning_img: {
    width: em(16),
    height: em(16)
  },
  warning_text: {
    color: '#F86B25',
    fontSize: em(14),
    width: GLOBAL_PAMRAS._winWidth*0.8,
    maxWidth: GLOBAL_PAMRAS._winWidth*0.8,
    padding: em(9)
  },
  warning_close: {
    width: 12,
    height: 12,
  }
});


const WarningTips = ({data,closeFunc,navigation}) => (
  <View style={styles.warn_container}> 
    <Image source={require('../asset/warning.png')} style={styles.warning_img} resizeMode="contain"/>
    <TouchableOpacity onPress={
      () => navigation.navigate('Content',{
        data,kind: 'warning'
      })
    }>
      <Text numberOfLines={1} style={styles.warning_text}>{data.title}</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => closeFunc()}>
      <Image source={require('../asset/close_red.png')} style={styles.warning_close}/>
    </TouchableOpacity>  
  </View>
);

WarningTips.propTypes = {
  data: PropTypes.object,
  closeFunc: PropTypes.func
}

WarningTips.defaultProps = {
  data:{},
  closeFunc: () => {}
}

export default WarningTips;
