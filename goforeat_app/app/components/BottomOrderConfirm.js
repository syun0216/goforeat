import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {View,Animated,Easing,StyleSheet,Text} from 'react-native';
//utils
import GLOBAL_PARAMS from '../utils/global_params';
const styles = StyleSheet.create({
  bottomContainer:{
    width: GLOBAL_PARAMS._winWidth,
    height: 60,
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 99999,
  }
});

export default class BottomOrderConfirm extends PureComponent {
  static defaultProps = {
    isShow: false
  }

  static propsType = {
    isShow: PropTypes.bool
  }

  state = {
    bottom: new Animated.Value(0)
  }

  componentWillReceiveProps(nextProps) {
    Animated.timing(this.state.bottom, {
      toValue: nextProps.isShow? 1: 0,
      duration: 100,
      easing: Easing.quad
    }).start();
  }

  render() {
    return (
      <Animated.View style={[styles.bottomContainer,{backgroundColor: this.props.screenProps.theme,
        bottom:this.state.bottom.interpolate({
        inputRange: [0,1],
        outputRange: [-60, 0]
      })}]}>
        <Text>123</Text>
      </Animated.View>
    )
  }
}