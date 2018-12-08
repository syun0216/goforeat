import React from 'react'
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {View,ActivityIndicator,Text,TouchableOpacity,StyleSheet,Platform} from 'react-native'
import GLOBAL_PARAMS,{em} from '../utils/global_params';
import LottieView from 'lottie-react-native';
//language
import I18n from '../language/i18n';

const styles = StyleSheet.create({
  commonContainer:{
    height:50,flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center',
  }
})

const ListFooter = ({loadingStatus,errorToDo,language}) => {
  switch (loadingStatus){
    case GLOBAL_PARAMS.httpStatus.LOADING:{
      return (
        <View style={styles.commonContainer}>
          {Platform.OS == 'ios' ? (
            <LottieView 
              autoPlay
              style={{width:em(20),height: em(20),transform:[{scale: 2},{translateY:em(0)}]}}
              source={require('../animations/material_wave_loading.json')}
              loop
              speed={1.5}
              enableMergePathsAndroidForKitKatAndAbove
            />
          ) : (
            <View style={styles.commonContainer}>
              <ActivityIndicator style={{flex:1,}} size='small' color='#000'/>
            </View>
          )}
        </View>
      )
    }
    case GLOBAL_PARAMS.httpStatus.LOAD_FAILED: {
      return (
        <TouchableOpacity style={styles.commonContainer} onPress={() => errorToDo()}>
          <View  style={{flex:1,alignItems:'center'}}>
            <Text>{I18n[language].common_tips.reload}...</Text>
          </View>
        </TouchableOpacity>
      )
    }
    case GLOBAL_PARAMS.httpStatus.NO_MORE_DATA: {
      return (
        <View style={[styles.commonContainer]}>
          {/*<View style={{width:GLOBAL_PARAMS._winWidth*0.3,height:1,marginLeft:10,marginRight:20,backgroundColor:'#959595'}}></View>*/}
          <View><Text style={{color: '#959595'}}>{I18n[language].common_tips.load_all}</Text></View>
          {/*<View style={{width:GLOBAL_PARAMS._winWidth*0.3,height:1,marginLeft:20,marginRight:10,backgroundColor:'#959595'}}></View>*/}
        </View>
      )
    }
    default: return null
  }
}

ListFooter.defaultProps = {
  loadingStatus: 0
}
ListFooter.propTypes = {
  loadingStatus:PropTypes.number,
  errorToDo:PropTypes.func
}

const mapStateToProps = (state) => {
  return ({
    language: state.language.language
  })
}

export default connect(mapStateToProps)(ListFooter);
