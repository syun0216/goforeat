import React from 'react';
import PropTypes from 'prop-types';
import { View,Text,StyleSheet,TouchableOpacity,Image,Platform } from 'react-native';
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
    height:GLOBAL_PARAMS._winHeight,
  }
})

const ErrorPage = (props) => {
  return (
    <View style={styles.loadingContainer}>
    <View style={{alignSelf:'center'}}>
      <TouchableOpacity style={{alignItems: 'center'}} onPress={() => props.errorToDo()}>
        {Platform.OS === 'android' ? (<Image source={{uri: 'notfound'}} style={{width: 128,height: 128}}/>) :
        (<Image source={{uri: '404'}} style={{width: 128,height: 128}}/>)}
        <Text style={{color:'#222',fontSize: 16}}>{props.errorTips}</Text>
      </TouchableOpacity>
    </View>
    </View>
  )
}

ErrorPage.defaultProps = {
  errorTips:'正在加載中...',
  errorToDo: () => {return }
};

ErrorPage.propTypes = {
  errorTips:PropTypes.string,
  errorToDo:PropTypes.func
};

export default ErrorPage
