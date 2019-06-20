import React from 'react';
import {TouchableOpacity, Text, StyleSheet, View} from 'react-native';
import Antd from "react-native-vector-icons/AntDesign";
import PropTypes from 'prop-types';
//utils
import {em} from '../utils/global_params';
import Colors from '../utils/Colors';

const styles = StyleSheet.create({
  tipsContainer: {
    position: 'absolute',
    left: 5,
    bottom: '15%',
    padding: em(8),
    backgroundColor: Colors.main_orange,
    zIndex: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: em(5),
  },
  tipsIcon: {
    color: Colors.main_white,
    fontSize: em(18),
    marginLeft: em(5)
  },  
  tipsText: {
    color: Colors.main_white,
    fontSize: em(16)
  }
});

const Tips = props => (
  <TouchableOpacity activeOpacity={0.8} style={styles.tipsContainer} onPress={props.clickFunc}>
    <View>
      <Text style={[styles.tipsText, {marginBottom: em(5)},]}>邀請好友</Text>
      <Text style={styles.tipsText}>領優惠券</Text>
    </View>
    <Antd style={styles.tipsIcon} name="right"/>
  </TouchableOpacity>
);

Tips.defaultProps = {
  message: '详情',
  clickFunc: () => {}
};

Tips.propTypes = {
  message: PropTypes.string,
  clickFunc: PropTypes.func
};

export default Tips;