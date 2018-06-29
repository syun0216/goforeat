import React from 'react';
import PropTypes from 'prop-types';
import { View,StyleSheet,Image,Text,TouchableOpacity } from 'react-native';
import GLOBAL_PARAMS from '../utils/global_params';
import LinearGradient from 'react-native-linear-gradient';

const styles = StyleSheet.create({
  loadingContainer: {
    // position:'absolute',
    // top:0,
    // left:0,
    // flex:1,
    justifyContent: 'flex-start',
    zIndex:10000,
    backgroundColor: '#fff',
    height:GLOBAL_PARAMS._winHeight,
    paddingTop: 20,
    alignItems: 'center',
  },
  inner: {
    position:'relative'
  },
  image: {
    width: GLOBAL_PARAMS._winWidth,
    height: 320
  },
  infoText: {
    position: 'absolute',
    width: GLOBAL_PARAMS._winWidth,
    bottom: -20,
    zIndex: 100
  },
  text1: {
    fontSize: 25,
    color: '#111111',
    marginBottom: 12,
    fontWeight:'600',
    textAlign: 'center'
  },
  text2: {
    fontSize: 25,
    color:'#999999',
    fontWeight: '400',
    textAlign:'center'
  },
  refresh_btn: {
  },
  refresh_btn_inner:{
    marginTop: 60,
    height: 45,
    width:GLOBAL_PARAMS._winWidth*0.7,
    justifyContent:'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 5,
    shadowColor: '#FA9285',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.8,
    elevation: 3,
  }
})

const ErrorPage = (props) => {
  return (
    <View style={styles.loadingContainer}>
      <View style={styles.inner}>
        <Image source={require('../asset/badnetwork.png')} style={styles.image} resizeMode="cover"/>
        <View style={styles.infoText}>
          <Text style={styles.text1}>網絡加載失敗</Text>
          <Text style={styles.text2}>再次刷新 或檢查網絡</Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => props.errorToDo()} style={styles.refresh_btn}>
        <LinearGradient colors={['#FF7F0B','#FF1A1A']} start={{x:0.0, y:0.0}} end={{x:1.0,y: 0.0}} style={styles.refresh_btn_inner}>
          <Text style={{color:'#fff',fontSize:16}}>刷新</Text>
        </LinearGradient>
      </TouchableOpacity>
    {/*<View style={{alignSelf:'center'}}>
      <TouchableOpacity style={{alignItems: 'center'}} onPress={() => props.errorToDo()}>
        {Platform.OS === 'android' ? (<Image source={{uri: 'notfound'}} style={{width: 80,height: 80}}/>) :
        (<Image source={{uri: '404'}} style={{width: 80,height: 80,marginBottom: 10,}}/>)}
        <Text style={{color:'#222',fontSize: 16}}>{props.errorTips}</Text>
      </TouchableOpacity>
  </View>*/}
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
