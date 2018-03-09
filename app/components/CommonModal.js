import React from 'react'
import PropTypes from 'prop-types'
import {Modal,View,Image,Text,TouchableOpacity,ScrollView} from 'react-native'
import {Icon} from 'native-base'
//utils
import Colors from '../utils/Colors'

const CommonModal = ({content,title,modalVisible,closeFunc,theme}) => (
  <Modal
    animationType={"slide"}
    transparent={false}
    visible={modalVisible}
    onRequestClose={() => {alert("Modal has been closed.")}}
    >
      <View style={{flex:1,justifyContent:'center'}}>
        <View style={{flex:1,alignItems:'center',justifyContent:'center',marginTop:30,padding:10}}>
          {/* <Image source={require('../asset/logo.png')} style={{marginBottom:30}}/> */}
          <Text style={{alignSelf:'center',fontSize:20}}>{title}</Text>
          <Text style={{marginLeft:20,marginRight:20,fontSize:16}}>{content}</Text>
        </View>
       <View style={{height:100,display:'flex',alignItems:'center',justifyContent:'center'}}>
         <TouchableOpacity onPress={() => closeFunc()}>
           <Icon name="md-close-circle" style={{color:theme,fontSize:50}}/>
         </TouchableOpacity>
       </View>
      </View>
  </Modal>
)

CommonModal.propsType = {
  content: PropTypes.string,
  modalVisible: PropTypes.bool,
  closeFunc: PropTypes.func,
  title: PropTypes.string
}

CommonModal.defaultProps = {
  content: 'This is a modal'
}

export default CommonModal
