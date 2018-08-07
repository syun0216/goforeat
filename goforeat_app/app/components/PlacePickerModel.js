import React,{Component} from 'react'
import PropTypes from 'prop-types'
import {Modal,View,TouchableOpacity,StyleSheet,Image} from 'react-native'
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
import CommonHeader from "./CommonHeader";
import CommonItem from "./CommonItem";
import Text from './UnScalingText';
//language
import I18n from '../language/i18n';
//styles
import PaySettingStyles from '../styles/paysetting.style';

const _checked = '../asset/checked.png';
const _unchecked = '../asset/unchecked.png';
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

  _checkedImage(name) {
    if(this.state.selected == name) {
      return (<Image source={require(_checked)} style={PaySettingStyles.payRightImage} resizeMode="contain"/>)
    }else{
      return (<Image source={require(_unchecked)} style={PaySettingStyles.payRightImage} resizeMode="contain"/>)
    }
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve)
    });
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
        this.setStateAsync({selected: _data.name}).then(() => {
          data.data.data = data.data.data.map(v => ({
            ...v,
            content: v.name,
            clickFunc: () => this._onValueChange(v)
          }))
          this.setState({
            placeList: data.data.data,
          })
        })

        this.props.getSeletedValue(_data);
        this.props.screenProps.stockPlace(_data);
        appStorage.setPlace(JSON.stringify(_data));  
      }else {
        ToastUtils.showWithMessage(data.data.ro.repMsg);
        this.props.getSeletedValue(null);
      }
    }, () => {
      ToastUtils.showWithMessage(this.state.i18n.common_tips.network_err);
      this.props.getSeletedValue(null);
    });
  }

  _onValueChange(item) {
    this.setState({
      selected: item.name,
      placeList: this.state.placeList
    },() => {
      this.props.getSeletedValue(item);
      let _timer = setTimeout(() => {
        clearTimeout(_timer);
        this.props.screenProps.stockPlace(item);
        appStorage.setPlace(JSON.stringify(item)); 
        this.props.closeFunc();
      },200)
    });
  }
  
  render() {
    return (<Modal
      animationType={"slide"}
      transparent={false}
      visible={this.props.modalVisible}
      onRequestClose={() => this.props.closeFunc()}
      >
       <Container>
          <CommonHeader canBack title={this.state.i18n.address} leftElement={<TouchableOpacity onPress={this.props.closeFunc} style={styles.placeBtn}>
          <Icon name="md-close" style={[{ fontSize: GLOBAL_PARAMS.em(22), color: '#fff' }]}/>
        </TouchableOpacity>} {...this.props}/> 
          <Content> 
            {this.state.placeList != null ? this.state.placeList.map((item,idx) => (
              <CommonItem key={idx} content={item.content} clickFunc={item.clickFunc} hasRightIcon rightIcon={this._checkedImage(item.name)}/>
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
   padding: GLOBAL_PARAMS.em(10),
   paddingBottom: GLOBAL_PARAMS.em(15),
   paddingTop: GLOBAL_PARAMS.em(15),
   borderBottomWidth: 1,
   borderBottomColor: Colors.main_gray,
 },
 placeBtn: {width:  GLOBAL_PARAMS.em(50),height: GLOBAL_PARAMS.em(40),alignItems:'center',marginLeft:-5,justifyContent:'center'}
});

export default PlacePickerModel
