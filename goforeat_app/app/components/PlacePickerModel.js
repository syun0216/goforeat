import React,{Component} from 'react'
import PropTypes from 'prop-types'
import {Modal,View,TouchableOpacity,StyleSheet} from 'react-native'
import {Icon,Container,Content} from 'native-base'
//utils
import Colors from '../utils/Colors'
import GLOBAL_PARAMS from '../utils/global_params'
import ToastUtils from '../utils/ToastUtil'
//api
import api from '../api/index';
//cache
import appStorage from "../cache/appStorage";
//components
import CommonHeader from "../components/CommonHeader";
import Text from './UnScalingText';
//language
import I18n from '../language/i18n';

class PlacePickerModel extends Component{
  static propsType = {
    content: PropTypes.string,
    modalVisible: PropTypes.bool,
    closeFunc: PropTypes.func,
    title: PropTypes.string
  }
  state = {
    placeList: null,
    selected: null,
    i18n: I18n[this.props.screenProps.language]
  }

  componentDidMount() {
    appStorage.getPlace((error, data) => {
      if (error === null) {
        if (data !== null) {
          this.getPlace(data);
        }else {
          this.getPlace();
        }
      }
    })
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      i18n: I18n[nextProps.screenProps.language]
    })
  }

   //api 
   getPlace(storage_data) {
    api.foodPlaces().then(data => {
      if(data.status === 200 && data.data.ro.ok) {
        // data.data.data = data.data.data.map((v,i) => ({
        //   ...v,
        //   name: v.name.length> 10 ? v.name.substring(0,10) + '...' : v.name
        // }))
        let _data = typeof storage_data != 'undefined' ? storage_data : data.data.data[0];
        this.setState({
          placeList: data.data.data,
          selected: _data.name
        })

        this.props.getSeletedValue(_data);
        this.props.screenProps.stockPlace(_data);
        appStorage.setPlace(JSON.stringify(_data));  
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
    this.props.screenProps.stockPlace(item);
    appStorage.setPlace(JSON.stringify(item)); 
    this.props.closeFunc();
  }
  
  render() {
    return (<Modal
      animationType={"fade"}
      transparent={false}
      visible={this.props.modalVisible}
      onRequestClose={() => this.props.closeFunc()}
      >
       <Container>
          <CommonHeader canBack title={this.state.i18n.address} leftElement={<TouchableOpacity onPress={this.props.closeFunc} style={{width: 50,height:40,alignItems:'center',marginLeft:-5,justifyContent:'center'}}>
          <Icon name="md-close" style={[{ fontSize: 22, color: '#fff' }]}/>
        </TouchableOpacity>} {...this.props}/> 
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
