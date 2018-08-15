import React from 'react';
import PropTypes from 'prop-types';
import {Modal,View,Text,Image,StyleSheet,TouchableOpacity,TouchableWithoutFeedback} from 'react-native';
import {Container,Content,Footer,Left,Body,Right, Col} from 'native-base';
//utils
import GLOBAL_PARAMS,{em} from '../utils/global_params';
import Colors from '../utils/Colors';
//language
import I18n from '../language/i18n';
import i18n from '../language/i18n';

const styles = StyleSheet.create({
  AdvertiseViewContent: {
    height: GLOBAL_PARAMS._winHeight*0.85
  },
  ContentImg: {
    width: GLOBAL_PARAMS._winWidth,
    height:GLOBAL_PARAMS._winHeight*0.85
  },
  detailBtn: {
    position: 'absolute',
    backgroundColor: Colors.fontBlack,
    opacity: 0.7,
    borderRadius: 20,
    width: em(140),
    height: em(50),
    zIndex: 10,
    top: GLOBAL_PARAMS._winHeight*0.4,
    left: GLOBAL_PARAMS._winWidth*0.5 - em(120)/2,
    padding: em(8)
  },
  detailsText: {
    color: Colors.main_white,
    fontSize: em(26),
    textAlign:'center',
    justifyContent: 'center'
  },
  AdvertiseViewFooter: {
    height: GLOBAL_PARAMS._winHeight*0.15,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'center',
    borderTopWidth: 0,
    alignItems: 'center',
    position: 'relative',
  },
  logoText: {
    fontSize: em(26),
    color: Colors.main_orange
  },
  logoView: {
    flexDirection: 'row',
    justifyContent:'space-around',
    alignItems: 'center'
  },
  logoApp: {
    width: em(30),
    height:em(30),
    marginRight: 10,
  },
  skipBtn: {
    position: 'absolute',
    right: em(5),
    top: em(-18),
    backgroundColor: Colors.fontBlack,
    opacity: 0.7,
    borderRadius: 20,
    padding:em(10),
    paddingLeft: em(15),
    paddingRight: em(15),
    
  },
  skipText: {
    color: Colors.main_white,
    fontSize: em(16),
    textAlign:'center',
  }
})

const AdvertiseView = ({modalVisible,image,data,seconds,closeFunc,screenProps:{language},navigation}) => {
  return (
    <Modal
      animationType={"fade"}
      transparent={false}
      visible={modalVisible}
      onRequestClose={() => closeFunc()}
    >
      <Container>
        <View style={{position: 'relative'}}>
          <TouchableWithoutFeedback onPress={() => {
              closeFunc();
              let _timer = setTimeout(() => {
                navigation.navigate('Content', {
                  data,kind: 'advertise'
                })
              },0);
            }}>
            <Image source={{uri: image}} style={styles.ContentImg} reasizeMode="cover"/>
          </TouchableWithoutFeedback>
        </View>
        <Footer style={styles.AdvertiseViewFooter}>
        <View style={styles.logoView}>
        <Image style={styles.logoApp} source={require('../asset/icon_app.png')} reasizeMode="contain"/>
          <Text style={styles.logoText}>{I18n[language].goforeat}</Text>
        </View>
        <TouchableOpacity style={styles.skipBtn} onPress={() => closeFunc()}>
              <Text style={styles.skipText}>{I18n[language].skip} {seconds}s</Text>
            </TouchableOpacity>
        </Footer>
      </Container>
    </Modal>
  )
}

AdvertiseView.propsType = {
  modalVisible: PropTypes.bool,
  seconds: PropTypes.number,
  image: PropTypes.string,
  closeFunc: PropTypes.closeFunc
}

// AdvertiseView.defaultProps = {
//   modalVisible: true,
//   seconds: 5,
//   Image: 'http://r.goforeat.hk/img/test/11.jpg',
//   closeFunc: () => {}
// }

export default AdvertiseView;