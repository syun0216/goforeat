import PropTypes from 'prop-types'
import {Modal} from 'react-native'

const CommonModal = ({content,closeFunc}) => (
  <Modal
    animationType={"slide"}
    transparent={false}
    visible={this.state.modalVisible}
    onRequestClose={() => {alert("Modal has been closed.")}}
    >
      <View style={{flex:1,justifyContent:'center'}}>
       <View style={{flex:1,alignItems:'center',justifyContent:'center',marginTop:-20,padding:10}}>
         <Image source={require('../asset/logo.png')} style={{marginBottom:30}}/>
         <Text style={{marginLeft:20,marginRight:20,fontSize:16}}>{content}</Text>
       </View>
       <View style={{height:100,display:'flex',alignItems:'center',justifyContent:'center'}}>
         <TouchableOpacity onPress={() => closeFunc()}>
           <Icon name="md-close-circle" style={{color:Colors.main_orange,fontSize:40}}/>
         </TouchableOpacity>
       </View>
      </View>
  </Modal>
)

CommonModal.propsType = {
  content: PropTypes.string,
  closeFunc: PropTypes.func
}

export default CommonModal
