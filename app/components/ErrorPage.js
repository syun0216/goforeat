import React from 'react';
import PropTypes from 'prop-types';
import { View,Text,StyleSheet,TouchableOpacity } from 'react-native';
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

const ErrorPage = (props) => {
  return (
    <View style={styles.loadingContainer}>
    <View style={{alignSelf:'center'}}>
      <TouchableOpacity onPress={() => props.errorToDo()}>
        <Text style={{color:'#222', marginTop:10}}>{props.errorTips}</Text>
      </TouchableOpacity>
    </View>
    </View>
  )
}

ErrorPage.defaultProps = {
  errorTips:'正在加載中...'
};

ErrorPage.propTypes = {
  errorTips:PropTypes.string,
  errorToDo:PropTypes.func
};

export default ErrorPage
