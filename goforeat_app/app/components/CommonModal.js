import React,{Component} from 'react'
import PropTypes from 'prop-types'
import {Modal,View,Image,Text,TouchableOpacity,ScrollView,StatusBar} from 'react-native'
import {Icon} from 'native-base'
//utils
import Colors from '../utils/Colors'
import CityData from '../utils/CityData'
import GLOBAL_PARAMS from '../utils/global_params'
import ToastUtil from '../utils/ToastUtil'

class CommonModal extends Component{
  static propsType = {
    content: PropTypes.string,
    modalVisible: PropTypes.bool,
    closeFunc: PropTypes.func,
    title: PropTypes.string
  }
  static defaultProps = {
    content: 'This is a modal',
    title: 'map'
  }
  state = {
    totalData: CityData.cityData,
    currentSelect: null
  }
  //private function
  _nextCityClick = (item) => {
    let _data = this.state.totalData.filter(v => item.cityName === v.cityName);
    // console.log(_data)
    if(typeof _data[0].city !== 'undefined') {
      this.setState({
        totalData: _data[0].city,
        currentSelect: item.cityName
      })
    }else {
      ToastUtil.showWithMessage("已到最后一級了");
    }
  }

  _lastCityClick = () => {
    this.setState({
      totalData: CityData.cityData
    })
  }

  _renderMapDataView = () => (
    this.state.totalData.map((item,idx) => (
      <TouchableOpacity key={idx} style={{padding: 10,borderBottomWidth: 1,borderColor: Colors.main_gray,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}} 
      onPress={() => this._nextCityClick(item)}>
        <Text style={{color: Colors.fontBlack}}>{item.cityName}</Text>
        <Icon name="md-arrow-dropright" style={{color: Colors.fontBlack,fontSize: 25}}/>
      </TouchableOpacity>))
  )
  render() {
    return (<Modal
      animationType={"slide"}
      transparent={false}
      visible={this.props.modalVisible}
      onRequestClose={() => {alert("Modal has been closed.")}}
      >
      <View style={{position: 'absolute',top: 0,height:20,width:GLOBAL_PARAMS._winWidth,backgroundColor:Colors.fontBlack}} />
        <View style={{flex:1,justifyContent:'center'}}>
          <ScrollView style={{flex:1,marginTop:30,padding:10}}>
            {/* <Image source={require('../asset/logo.png')} style={{marginBottom:30}}/> */}
            {this._renderMapDataView()}
          </ScrollView>
         <View style={{backgroundColor:this.props.theme,height:100,display:'flex',flexDirection: 'row',alignItems:'center',justifyContent:'space-around'}}>
           <TouchableOpacity onPress={() => this.props.closeFunc()}>
             <Icon name="md-close-circle" style={{color:Colors.main_white,fontSize:50}}/>
           </TouchableOpacity>
           <TouchableOpacity onPress={() => this._lastCityClick}>
             <Text style={{color:Colors.main_white}}>返回上一級</Text>
           </TouchableOpacity>
           <TouchableOpacity onPress={() => this.props.closeFunc()}>
             <Icon name="md-checkmark-circle" style={{color:Colors.main_white,fontSize:50}}/>
           </TouchableOpacity>
         </View>
        </View>
    </Modal>
  )
  }
  }

CommonModal.propsType = {
  content: PropTypes.string,
  modalVisible: PropTypes.bool,
  closeFunc: PropTypes.func,
  title: PropTypes.string
}

CommonModal.defaultProps = {
  content: 'This is a modal',
  title: 'map'
}

export default CommonModal
