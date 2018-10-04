import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { View,StyleSheet,Image,TouchableOpacity } from 'react-native';
import GLOBAL_PARAMS from '../utils/global_params';
//styles
import CommonStyle from '../styles/common.style';
//components
import Text from './UnScalingText';
import CommonBottomBtn from '../components/CommonBottomBtn';
//language
import I18n from '../language/i18n';

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
    height: GLOBAL_PARAMS.heightAuto(320)
  },
  infoText: {
    position: 'absolute',
    width: GLOBAL_PARAMS._winWidth,
    bottom: GLOBAL_PARAMS.em(-20),
    zIndex: 100
  },
  text1: {
    fontSize: GLOBAL_PARAMS.em(22),
    color: '#111111',
    marginBottom: GLOBAL_PARAMS.em(12),
    fontWeight:'600',
    textAlign: 'center'
  },
  text2: {
    fontSize: GLOBAL_PARAMS.em(22),
    color:'#999999',
    fontWeight: '400',
    textAlign:'center'
  },
  refresh_btn: {
  },
  refresh_btn_inner:{
    marginTop: GLOBAL_PARAMS.em(60),
    ...CommonStyle.btn
  }
})

const ErrorPage = (props) => {
  const { language, errorToDo } = props;
  return (
    <View style={[styles.loadingContainer,props.style]}>
      <View style={styles.inner}>
        <Image source={require('../asset/badnetwork.png')} style={styles.image} resizeMode="cover"/>
        <View style={styles.infoText}>
          <Text style={styles.text1}>{I18n[language].common_tips.network_err}</Text>
          <Text style={styles.text2}>{I18n[language].common_tips.reload_again}</Text>
        </View>
      </View>
      <CommonBottomBtn style={{marginTop: 10}} clickFunc={() => errorToDo()}>{I18n[language].refresh}</CommonBottomBtn>
    </View>
  )
}

ErrorPage.defaultProps = {
  errorTips:'Loading...',
  errorToDo: () => {return },
  style: {}
};

ErrorPage.propTypes = {
  errorTips:PropTypes.string,
  errorToDo:PropTypes.func,
  style: PropTypes.object
};

const mapStateToProps = (state) => {
  return ({
    language: state.language.language
  })
}


export default connect(mapStateToProps)(ErrorPage)
