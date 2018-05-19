import React, {
  PureComponent
} from 'react';
import {Icon,Picker} from 'native-base';
import PropTypes from 'prop-types';
//api
import api from '../api/index';
//utils
import ToastUtils from '../utils/ToastUtil';


export default class PlacePicker extends PureComponent {

  static propsType = {
    getSeletedValue: PropTypes.func
  }
  static defaultProps = {
    getSeletedValue: () => {return;}
  }

  constructor(props) {
    super(props);
    this.state = {
      selected: null,
      placeList: null
    };
  }
  onValueChange(value) {
    this.setState({
      selected: value
    });
    this.props.getSeletedValue(value);
  }

  componentDidMount() {
    this.getPlace()
  }

  //api 
  getPlace = () => {
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
    return this.state.placeList != null ? (
      <Picker mode = "dropdown"
      iosHeader = "選擇取餐地點"
      // iosIcon = { < Icon  name = "ios-arrow-down-outline"/ >}
      headerBackButtonText="返回"
      style = {
        {
          width: undefined,
        }
      }
      textStyle = {{color: 'white',textAlign:'center'}}
      selectedValue = {
        this.state.selected
      }
      onValueChange = {
        this.onValueChange.bind(this)
      } >
      {
        this.state.placeList.map((item,idx) => (
          <Picker.Item key={idx} label = {item.name}
            value = {item.id} / >
        ))
      }
    </Picker>
    ) : null
  }
}