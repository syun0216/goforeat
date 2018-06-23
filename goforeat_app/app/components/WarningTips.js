import React from 'react';
import {View,Text,Image,StyleSheet} from 'react-native';
import {Icon} from 'native-base';
//utils
import GLOBAL_PAMRAS from '../utils/global_params';

const styles = StyleSheet.create({
  warn_container: {
    backgroundColor: '#FEFCEB',
    width: GLOBAL_PAMRAS._winWidth,
    height: 36,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 9,
    paddingBottom: 5,
    alignItems: 'center',
  },
  warning_img: {
    width: 16,
    height: 16
  },
  warning_text: {
    color: '#F86B25',
    fontSize: 14,
    width: GLOBAL_PAMRAS._winWidth*0.8,
    maxWidth: GLOBAL_PAMRAS._winWidth*0.8
  },
  warning_close: {
    width: 12,
    height: 12
  }
});


const WarningTips = (props) => (
  <View style={styles.warn_container}> 
    <Image source={require('../asset/warning.png')} style={styles.warning_img} resizeMode="contain"/>
    <Text numberOfLines={1} style={styles.warning_text}>四号线的美食不知道您有了解多少呢?</Text>
    <Image source={require('../asset/close_red.png')} style={styles.warning_close}/>
  </View>
)

export default WarningTips;
