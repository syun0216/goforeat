import React from 'react';
import PropTypes from 'prop-types';
import { View,Text,StyleSheet,ActivityIndicator } from 'react-native';
import GLOBAL_PARAMS from '../utils/global_params'

const styles = StyleSheet.create({
  loadingContainer: {
    // position:'absolute',
    // top:0,
    // left:0,
    // flex:1,
    justifyContent: 'center',
    zIndex:10000,
    backgroundColor: '#F1FAFE',
    height:GLOBAL_PARAMS._winHeight
  }
})

const Loading = (props) => {
  return (
    <View style={styles.loadingContainer}>
    <View style={{alignSelf:'center'}}>
      <ActivityIndicator size="small"/>
      <Text style={{color:'#222', marginTop:10}}>{props.message}</Text>
    </View>
    </View>  
  )
}

Loading.defaultProps = {
  message:'正在加载中...'
};

Loading.propTypes = {
  message:PropTypes.string,
};

export default Loading
