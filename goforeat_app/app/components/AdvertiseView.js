import React from 'react';
import {Modal,View,Text,Image} from 'react-native';
//utils
import GLOBAL_PARAMS from '../utils/global_params';

const AdvertiseView = props => {
  return (
    <Modal
      animationType={"fade"}
      transparent={false}
      visible={props.modalVisible}
      onRequestClose={() => props.closeFunc()}
    >
      <Image source={{uri: props.Image}} style={{width: GLOBAL_PARAMS._winWidth,height: GLOBAL_PARAMS._winHeight}}/>
    </Modal>
  )
}

export default AdvertiseView;