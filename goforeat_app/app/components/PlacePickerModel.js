import React,{Component} from 'react'
import PropTypes from 'prop-types'
import {Modal,View,Image,Text,TouchableOpacity,ScrollView,StatusBar} from 'react-native'
import {Icon,Container,Header,Left,Right,Body,Content} from 'native-base'
//utils
import Colors from '../utils/Colors'
import CityData from '../utils/CityData'
import GLOBAL_PARAMS from '../utils/global_params'
import ToastUtil from '../utils/ToastUtil'
//api
import api from '../api/index';

class PlacePickerModel extends Component{
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
    placeList: null,
    selected: null
  }

  componentDidMount() {
    this.getPlace();
  }
  
   //api 
   getPlace() {
    api.foodPlaces().then(data => {
      if(data.status === 200 && data.data.ro.ok) {
        // data.data.data = data.data.data.map((v,i) => ({
        //   ...v,
        //   name: v.name.length> 10 ? v.name.substring(0,10) + '...' : v.name
        // }))
        this.setState({
          placeList: data.data.data,
          selected: data.data.data[0].id
        })
        this.props.getSeletedValue(data.data.data[0].id);
      }else {
        ToastUtils.showWithMessage(data.data.ro.repMsg);
      }
    }, () => {
      ToastUtils.showWithMessage("网络請求失敗");
    });
  }
  
  render() {
    return (<Modal
      animationType={"fade"}
      transparent={false}
      visible={this.props.modalVisible}
      onRequestClose={() => {alert("Modal has been closed.")}}
      >
       <Container>
          <Header>
            <Left>
              <TouchableOpacity onPress={this.props.closeFunc}>
                <Icon name="ios-arrow-back" style={[{ fontSize: 25, color: props.textColor }]}/>
              </TouchableOpacity>
            </Left>
            <Body>請選擇取餐點</Body>
            <Right />
          </Header>
          <Content>

          </Content>
       </Container>
    </Modal>
  )
  }
  }

PlacePickerModel.propsType = {
  content: PropTypes.string,
  modalVisible: PropTypes.bool,
  closeFunc: PropTypes.func,
  title: PropTypes.string
}

PlacePickerModel.defaultProps = {
  content: 'This is a modal',
  title: 'map'
}

export default PlacePickerModel