import React, { Component } from "react";
import PropTypes from "prop-types";
import { Image, View, Text, PermissionsAndroid, Platform, TouchableOpacity, Header } from "react-native";
import { Input, Item, Icon, Button } from 'native-base';
import {connect} from 'react-redux';
//actions
import { STORE_PLACE_LIST, STOCK_PLACE } from '../actions';
//utils
import ToastUtils from "../utils/ToastUtil";
import Colors from "../utils/Colors";
//api
import { foodPlaces } from "../api/request";
//cache
import { placeStorage, placeListStorage } from "../cache/appStorage";
//components
import CommonItem from "./CommonItem";
import CommonModal from "./CommonModal";
import BlankPage from "./BlankPage";
import LoadingModal from "./LoadingModal";
//language
import I18n from "../language/i18n";
//styles
import PaySettingStyles from "../styles/paysetting.style";

const _checked = "../asset/checked.png";
const _unchecked = "../asset/unchecked.png";

let defaultData = {name: '請先選擇最接近的大廈',id: null, hasTips: true};
class PlacePickerModel extends Component {
  static propsType = {
    content: PropTypes.string,
    modalVisible: PropTypes.bool,
    closeFunc: PropTypes.func,
    title: PropTypes.string
  };

  static defaultProps = {
    modalVisible: false
  }
  
  _rawPlaceList = null;

  state = {
    placeList: null,
    selected: null,
    loading: false,
    i18n: I18n[this.props.screenProps.language]
  };

  componentDidMount() {
    if(Platform.OS == "ios") {
      this._getLocationByApi()
    } else if(Platform.OS == "android"){
      this._locationCanUseInAndroid(
        () => this._getLocationByApi()
      )
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.modalVisible != this.props.modalVisible || JSON.stringify(this.state.placeList) != JSON.stringify(nextState.placeList);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.modalVisible && nextProps.modalVisible != this.props.modalVisible) {
     if(Platform.OS == 'ios') {
       this._getCurrentPosition(
         position => this._getSelectPlace(
            place => this.getPlace(position, place)
         ) 
       )
     } else if(Platform.OS == 'android'){
       this._locationCanUseInAndroid(
         () => this._getCurrentPosition(
           position => this._getSelectPlace(
             place => this.getPlace(position, place)
           )
         )
       )
     }
    }
    this.setState({
      i18n: I18n[nextProps.screenProps.language]
    });
  }

  _getCurrentPosition(callbackWithPosition) {
    navigator.geolocation.getCurrentPosition(position => {
      !!callbackWithPosition && callbackWithPosition(position)
    }).catch(err => {
      callbackWithPosition && callbackWithPosition(null);
    })
  }

  _getSelectPlace(callbackWithSelectedPlace) {
    placeStorage.getData((error, place) => {
      if (error === null) {
        callbackWithSelectedPlace && callbackWithSelectedPlace(place);
      }
    });
  }

  async _locationCanUseInAndroid(callbackWhenGranted) {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      )
      if(granted == PermissionsAndroid.RESULTS.GRANTED) { // 用户允许授权访问gps
        callbackWhenGranted && callbackWhenGranted();
      } else {
        this.getPlace();
      }
    }catch(err) {
      this.getPlace();
    }
  }

  _getLocationByApi() { // 不打开model情况下执行
    navigator.geolocation.getCurrentPosition(position => {
      placeListStorage.getData((error, placeList) => {
        if (error === null) {
          let currentDate = + new Date; 
          if (placeList !== null) { // 有缓存则读缓存
            this.setState({
              placeList: placeList.data
            },() => {
              this.props.stockPlaceList(placeList.data);
              placeStorage.getData((error, place) => {
                console.log(place)
                if (error === null) {
                  if (place !== null) {
                    console.log(place);
                    this.setState({
                      selected: place.name
                    })
                    this.props.getSeletedValue(place);
                    this.props.stockPlace(place);
                  } else { // 没有缓存默认一个提示
                    defaultData.id = placeList.data[0].id
                    this.props.getSeletedValue(defaultData);
                    this.props.stockPlace(defaultData);
                    this.setState({
                      selected: defaultData.name
                    })
                  }
                }
              });
            });
          } else {
            this.getPlace(position);
          }
        } else {
          this.getPlace(position);
        }
      });
    }, err => {
      this.getPlace();
    },{
      timeout: 3000
    })
  }

  _checkedImage(name) {
    if (this.state.selected == name) {
      return (
        <Image
          source={require(_checked)}
          style={PaySettingStyles.payRightImage}
          resizeMode="contain"
        />
      );
    } else {
      return (
        <Image
          source={require(_unchecked)}
          style={PaySettingStyles.payRightImage}
          resizeMode="contain"
        />
      );
    }
  }

  setStateAsync(state) {
    return new Promise(resolve => {
      this.setState(state, resolve);
    });
  }

  _sortCheckedToFirstPlace(list, checkedEl) { // 将选择项排列在数组的首位
    let checked = [];
    let newList = list.slice(0);
    for(let idx in newList) {
      if(newList[idx].id == checkedEl.id) {
        checked = newList.splice(idx, 1);
        break;
      }
    }
    if(checked.length == 0) {
      checked = [newList[0]];
    }
    newList.unshift(checked[0]);
    return newList;
  }

  _checkCacheInList(item, list) { //检查缓存是否在列表中
    let isInList = false;
    for(let v of list) {
      if(v.id == item.id) {
        isInList = true;
        break;
      }
    }
    return isInList;
  }

  //api
  async getPlace(position, storage_data) {
    const {latitude, longitude} =!!position && position.coords || {latitude: "",longitude: ""};
    foodPlaces(latitude, longitude).then(
      data => {
          console.log(12345,data[0]);
          console.log(12345,storage_data);
          let _data = {
            ...defaultData,
            id: data[0].id
          }; // 如果沒有緩存信息就進行提示
          if(typeof storage_data != "undefined") { // 如果有缓存数据
            if(storage_data && this._checkCacheInList(storage_data, data)) { //如果缓存数据在列表中 未被服务器删除
              _data = storage_data;
            }
          }
          let _sortList = this._sortCheckedToFirstPlace(data, _data);
          this._rawPlaceList = _sortList; // 保存一份原始數據
          this.setStateAsync({ selected: _data.name}).then(() => {
            this.setState({
              placeList: _sortList,
            });
          });
          let cacheTime = +new Date();
          this.props.getSeletedValue(_data);
          this.props.stockPlaceList(data);
          placeListStorage.setData({data: data, cacheTime});
          // this.props.stockPlace(_data);
          // placeStorage.setData(_data);
      },
      () => {
        this.props.getSeletedValue(null);
      }
    );
  }

  _onValueChange(item) {
    this.setState(
      {
        selected: item.name,
        placeList: this.state.placeList
      },
      () => {
        this.props.getSeletedValue(item);
        let _timer = setTimeout(() => {
          clearTimeout(_timer);
          this.props.stockPlace(item);
          placeStorage.setData(item);
          this.props.closeFunc();
        }, 200);
      }
    );
  }

  _filterPickPlace(place){
    if(/^[A-Za-z]+$/.test(place)) {
      place = place.toLowerCase();
    }
    this.setState({
      placeList: this._rawPlaceList.filter(v => v.name.toLowerCase().indexOf(place) > -1)
    })
  }

  render() {
    const { modalVisible, closeFunc } = this.props;
    return (
      <CommonModal
        modalVisible={modalVisible}
        closeFunc={closeFunc}
        getSearchContent={content => this._filterPickPlace(content)}
        title={this.state.i18n.address}
        isHeaderShow={false}
        isSearchHeader
        type="search"
      >
        {this.state.placeList != null
          ? this.state.placeList.map((item, idx) => (
              <CommonItem
                key={idx}
                content={item.name}
                clickFunc={() => this._onValueChange(item)}
                hasRightIcon
                rightIcon={
                  <View style={{flexDirection: 'row', alignItems: 'center',}}>
                    <Text style={{marginRight: 10, color: Colors.main_orange}}>{item.length && item.length.toFixed(2)+"  km" || null}</Text>
                    {this._checkedImage(item.name)}
                  </View>
                }
              />
            ))
          : null }
          {
            this.state.placeList &&  this.state.placeList.length == 0 && <BlankPage message="沒有搜索數據" style={{backgroundColor: 'transparent'}}/>
          }
          {
            this.state.loading && <LoadingModal message="loading..."/>
          }
      </CommonModal>
    );
  }
}

const placePickerModalStateToProps = state => {
  return ({
    place: state.placeSetting.place,
    placeList: state.placeSetting.placeList
  })
}

const placePickerDispatchToProps = dispatch => ({
  stockPlace: (place) => dispatch({type: STOCK_PLACE,place}),
  stockPlaceList: placeList => dispatch({type: STORE_PLACE_LIST, placeList})
})

export default connect(placePickerModalStateToProps, placePickerDispatchToProps)(PlacePickerModel);
