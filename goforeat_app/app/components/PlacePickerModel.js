import React,{Component} from 'react'
import PropTypes from 'prop-types'
import {Modal,View,Image,Text,TouchableOpacity,ScrollView,StatusBar,StyleSheet} from 'react-native'
import {Icon,Container,Header,Left,Right,Body,Content,List,ListItem} from 'native-base'
//utils
import Colors from '../utils/Colors'
import GLOBAL_PARAMS from '../utils/global_params'
import ToastUtils from '../utils/ToastUtil'
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
          selected: data.data.data[0].name
        })
        this.props.getSeletedValue(data.data.data[0]);
      }else {
        ToastUtils.showWithMessage(data.data.ro.repMsg);
        this.props.getSeletedValue(null);
      }
    }, () => {
      ToastUtils.showWithMessage("网络請求失敗");
      this.props.getSeletedValue(null);
    });
  }

  _onValueChange(item) {
    this.setState({
      selected: item.name
    });
    this.props.getSeletedValue(item);
    this.props.closeFunc();
  }
  
  render() {
    return (<Modal
      animationType={"fade"}
      transparent={false}
      visible={this.props.modalVisible}
      onRequestClose={() => {alert("Modal has been closed.")}}
      >
       <Container>
          <Header style={{backgroundColor: '#fff'}}>
            <Left>
              <TouchableOpacity onPress={this.props.closeFunc} style={{width: 50,height:40,alignItems:'center',marginLeft:-5,justifyContent:'center'}}>
                <Icon name="md-close" style={[{ fontSize: 22, color: this.props.screenProps.theme }]}/>
              </TouchableOpacity>
            </Left>
            <Body><Text>請選擇取餐點</Text></Body>
            <Right />
          </Header>
          <Content> 
            {this.state.placeList != null ? this.state.placeList.map((item,idx) => (
              <TouchableOpacity key={idx} onPress={() => this._onValueChange(item)}>
                <View style={styles.placeView}>
                <Text style={this.state.selected == item.name ? {color: this.props.screenProps.theme} : null}>{item.name}</Text>
                {this.state.selected == item.name ? <Icon name="md-checkmark" style={{color:this.props.screenProps.theme,fontSize: 16}}/> : null}
                </View>
              </TouchableOpacity>
            )) : null}                 
          </Content>
       </Container>
    </Modal>
  )
  }
  }

const styles = StyleSheet.create({
 placeView: {
   flexDirection: 'row',
   justifyContent: 'space-between',
   alignItems: 'center',
   padding: 10,
   paddingBottom: 15,
   paddingTop: 15,
   borderBottomWidth: 1,
   borderBottomColor: Colors.main_gray,
 }
});

export default PlacePickerModel
