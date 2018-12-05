import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import {Container, Content} from 'native-base';
import LottieView from 'lottie-react-native';
//component
import CommonHeader from './CommonHeader';
//utils
import GLOBAL_PARAMS,{em} from '../utils/global_params';

const styles = StyleSheet.create({
  customLoadingContainer: {
    backgroundColor: '#fff',
    zIndex: 999,
    height: GLOBAL_PARAMS._winHeight,
    
  }
})

const CustomLoading = props => {
  return (
    <View style={{position:'absolute',top:0,left:0,right:0,bottom: 0,width:GLOBAL_PARAMS._winWidth,height:GLOBAL_PARAMS._winHeight, zIndex: 10,backgroundColor: '#fff', alignItems:'center',}}>
      <CommonHeader>
          <ActivityIndicator color="#fff" size="small"/>
      </CommonHeader>
      <View style={styles.customLoadingView}>
        <LottieView 
          autoPlay
          style={{width:em(100),height: em(100),transform:[{scale: 1.3}],marginTop: em(20)}}
          source={require('../animations/custom_load.json')}
          loop
          enableMergePathsAndroidForKitKatAndAbove
        />
      </View>
    </View>
  )
}

export default CustomLoading;