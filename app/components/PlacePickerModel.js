import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Image,
  View,
  Text,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { Input } from "native-base";
import FastImage from "react-native-fast-image";
import LinearGardient from "react-native-linear-gradient";
import { connect } from "react-redux";
import { isNil } from "lodash";
//actions
import { STORE_PLACE_LIST, STOCK_PLACE } from "../actions";
//utils
import Colors from "../utils/Colors";
import GLOBAL_PARAMS, { em } from "../utils/global_params";
//api
import { foodPlaces, getDeliveryList } from "../api/request";
//cache
import { placeStorage, placeListStorage } from "../cache/appStorage";
//components
import CommonItem from "./CommonItem";
import CommonModal from "./CommonModal";
import BlankPage from "./BlankPage";
import LoadingModal from "./LoadingModal";
import PreviewPlaceImg from "./PreviewPlaceImg";
//language
import I18n from "../language/i18n";
//styles
import PaySettingStyles from "../styles/paysetting.style";

const _checked = "../asset/checked.png";
const _unchecked = "../asset/unchecked.png";

let defaultData = { name: "請先選擇最接近的大廈", id: null, hasTips: true };

const styles = StyleSheet.create({
  placePreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: em(5),
    paddingBottom: em(5),
    paddingLeft: em(27),
    paddingRight: em(9),
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  locationIcon: {
    width: em(22.5),
    height: em(22.5)
  },
  grayText: {
    color: '#9B9B9B',
    fontSize: em(13)
  },
  orangeText: {
    color: '#FE5800',
    fontSize: em(13),
    marginLeft: em(3)
  },
  placeName: {
    color: '#000000',
    fontSize: em(16),
    maxWidth: em(160)
  },
  placePreviewImg: {
    width: em(90),
    height: em(68)
  },
  linearGradient: {
    height: em(70),
    width: GLOBAL_PARAMS._winWidth,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row"
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: em(12),
    backgroundColor: "#fff",
    width: em(276),
    height: em(44),
    borderRadius: em(22),
    marginRight: em(26)
  },
  inputIcon: {
    width: em(20),
    height: em(20),
    marginRight: em(12)
  },
  input: {
    flex: 1,
    marginTop: 1
  },
  inputBtn: {},
  inputBtnText: {
    color: "#fff",
    fontSize: em(16)
  },
  contentLeft: {
    width: em(80),
    maxWidth: em(80),
    borderRightWidth: 1,
    borderRightColor: '#E5E5E5',
  },
  contentLeftBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    width: em(80),
    minHeight: em(50),
    borderBottomWidth: 1,
    borderColor: '#E5E5E5'
  },
  contentLeftText: {
    fontSize: em(14),
    color: '#000',
    lineHeight: em(25)
  },
  contentRight: {
    // flex: 1
  }
});
class PlacePickerModel extends Component {
  static propsType = {
    content: PropTypes.string,
    modalVisible: PropTypes.bool,
    closeFunc: PropTypes.func,
    title: PropTypes.string
  };

  static defaultProps = {
    modalVisible: false
  };

  _rawPlaceList = null;
  popupDialog = null;

  state = {
    placeList: null, // 子层级level list
    parentList: null, // 父层级level list
    parentSelected: null, // 父层级选中值
    selected: null, // only name property
    selectedVal: null, // all data
    isSearching: false,
    loading: false,
    i18n: I18n[this.props.language]
  };

  componentDidMount() {
    if (Platform.OS == "ios") {
      this._getLocationByApi();
    } else if (Platform.OS == "android") {
      this._locationCanUseInAndroid(() => this._getLocationByApi());
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.modalVisible != this.props.modalVisible ||
      JSON.stringify(this.state) !=
        JSON.stringify(nextState)
    );
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.modalVisible &&
      nextProps.modalVisible != this.props.modalVisible
    ) {
      if (Platform.OS == "ios") {
        this._getCurrentPosition(position =>
          this._getSelectPlace(place => this.getPlace(position, place))
        );
      } else if (Platform.OS == "android") {
        this._locationCanUseInAndroid(() =>
          this._getCurrentPosition(position =>
            this._getSelectPlace(place => this.getPlace(position, place))
          )
        );
      }
    }
    this.setState({
      i18n: I18n[nextProps.language]
    });
  }

  _getCurrentPosition(callbackWithPosition) {
    navigator.geolocation
      .getCurrentPosition(position => {
        !!callbackWithPosition && callbackWithPosition(position);
      })
      .catch(err => {
        callbackWithPosition && callbackWithPosition(null);
      });
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
      );
      if (granted == PermissionsAndroid.RESULTS.GRANTED) {
        // 用户允许授权访问gps
        callbackWhenGranted && callbackWhenGranted();
      } else {
        this.getPlace();
      }
    } catch (err) {
      this.getPlace();
    }
  }

  _getLocationByApi() {
    // 不打开model情况下执行
    navigator.geolocation.getCurrentPosition(
      position => {
        placeListStorage.getData((error, placeList) => {
          if (error === null) {
            let currentDate = +new Date();
            if (placeList !== null) {
              // 有缓存则读缓存
              this.setState(
                {
                  placeList: placeList.data
                },
                () => {
                  this.props.stockPlaceList(placeList.data);
                  placeStorage.getData((error, place) => {
                    // console.log(place)
                    if (error === null) {
                      if (place !== null) {
                        console.log(place);
                        this.setState({
                          selected: place.name
                        });
                        this.props.getSeletedValue(place);
                        this.props.stockPlace(place);
                      } else {
                        // 没有缓存默认一个提示
                        defaultData.id = placeList.data[0].id;
                        this.props.getSeletedValue(defaultData);
                        this.props.stockPlace(defaultData);
                        this.setState({
                          selected: defaultData.name
                        });
                      }
                    }
                  });
                }
              );
            } else {
              this.getPlace(position);
            }
          } else {
            this.getPlace(position);
          }
        });
      },
      err => {
        this.getPlace();
      },
      {
        timeout: 3000
      }
    );
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

  _sortCheckedToFirstPlace(list, checkedEl) {
    // 将选择项排列在数组的首位
    let checked = [];
    let newList = list.slice(0);
    for (let idx in newList) {
      if (newList[idx].id == checkedEl.id) {
        checked = newList.splice(idx, 1);
        break;
      }
    }
    if (checked.length == 0) {
      checked = [newList[0]];
    }
    newList.unshift(checked[0]);
    return newList;
  }

  _checkCacheInList(item, list) {
    //检查缓存是否在列表中
    let isInList = false;
    for (let v of list) {
      if (v.id == item.id) {
        isInList = true;
        break;
      }
    }
    return isInList;
  }

  //api
  async getPlace(position, storage_data) {
    const { latitude, longitude } = (!!position && position.coords) || {
      latitude: "",
      longitude: ""
    };
    getDeliveryList(latitude, longitude).then(
      data => {
        // console.log(12345,data[0]);
        // console.log(12345,storage_data);
        let _parentList = data.parentList.slice(0);
        _parentList.unshift({name: '全部', id: null});
        this.setStateAsync({
          parentList: _parentList,
          parentSelected: {name: '全部', id: null}
        });
        console.log('data :', _parentList);
        data = data.childList;
        let _data = {
          ...defaultData,
          id: data[0].id
        }; // 如果沒有緩存信息就進行提示
        if (typeof storage_data != "undefined") {
          // 如果有缓存数据
          if (storage_data && this._checkCacheInList(storage_data, data)) {
            //如果缓存数据在列表中 未被服务器删除
            _data = storage_data;
          }
        }
        let _sortList = this._sortCheckedToFirstPlace(data, _data);
        this._rawPlaceList = _sortList; // 保存一份原始數據
        this.setStateAsync({ 
          selected: _data.name,
          selectedVal: _data
         }).then(() => {
          this.setState({
            placeList: _sortList
          });
        });
        let cacheTime = +new Date();
        this.props.getSeletedValue(_data);
        this.props.stockPlaceList(data);
        placeListStorage.setData({ data: data, cacheTime });
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
        selectedVal: item,
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

  _filterPickPlace(place) {
    this.setState({
      isSearching: place != ''
    });
    if (/^[A-Za-z]+$/.test(place)) {
      place = place.toLowerCase();
    }
    this.setState({
      placeList: this._rawPlaceList.filter(
        v => v.name.toLowerCase().indexOf(place) > -1
      )
    });
  }

  _setParentSelected(item) {
    // if(parentSelected.name == v.name) return;
    this.setState({
      parentSelected: item,
      placeList: isNil(item.id) ? this._rawPlaceList.slice(0) : this._rawPlaceList.filter(v => v.parentId == item.id)
    });
  }

  /**
   * 自定义头部搜索
   *
   * @memberof PlacePickerModel
   */
  _renderCustomHeader() {
    return (
      <LinearGardient
        colors={["#FF881D", "#FF312F"]}
        start={{ x: 0.0, y: 0.0 }}
        end={{ x: 1.0, y: 0.0 }}
        style={styles.linearGradient}
      >
        <View style={styles.inputContainer}>
          <Image
            style={styles.inputIcon}
            source={require("../asset/1.3.7/icon_search.png")}
          />
          <Input placeholder="輸入搜索地點" placeholderTextColor="#9B9B9B" style={styles.input} allowFontScaling={false} clearButtonMode="while-editing" onChangeText={text => this._filterPickPlace(text)}/>
        </View>
        <TouchableOpacity
          style={styles.inputBtn}
          onPress={() => {
            if(this.state.isSearching) {
              this.setState({
                isSearching: false
              });
            }
            this.props.closeFunc();
          }}
        >
          <Text style={styles.inputBtnText}>關閉</Text>
        </TouchableOpacity>
      </LinearGardient>
    );
  }

  _renderPositionPreviewer() {
    const { selectedVal } = this.state;
    if(!selectedVal) {
      return;
    }
    return (
      <TouchableOpacity style={styles.placePreview} onPress={() => {
        this.popupDialog && this.popupDialog.show();
      }}>
        <View style={{flexDirection: 'row',}}>
          <View style={{justifyContent: 'space-between',marginRight: em(16),height: em(45)}}>
            <Image source={require('../asset/1.3.7/icon_location.png')} resizeMode="contain" style={styles.locationIcon}/>
            <Text style={styles.grayText}>當前</Text>
          </View>
          <View style={{justifyContent: 'space-between',height: em(46)}}>
            <Text numberOfLines={1} style={styles.placeName}>{selectedVal.name}</Text>
            <View style={{flexDirection: 'row', alignItems: 'center',}}>
              <Text style={styles.grayText}>距離您</Text>
              <Text style={styles.orangeText}>{selectedVal.length}km</Text>
            </View>
          </View>
        </View>
        <FastImage source={{uri: selectedVal.picture}} resizeMode={FastImage.resizeMode.contain} style={styles.placePreviewImg}/>
      </TouchableOpacity>
    )
  }

  _renderPopupDialog() {
    const { selectedVal } = this.state;
    if(!selectedVal) {
      return;
    }
    return (
      <PreviewPlaceImg key="1" getRef={r => this.popupDialog = r} title={selectedVal.name} img={selectedVal.picture}/>
    )
  }

  _renderPickPlaceContent() {
    const { placeList, parentList, parentSelected, isSearching} = this.state;
    return (
      <View style={{flexDirection: 'row', height: parentSelected ? GLOBAL_PARAMS._winHeight - em(168.5) : 'auto'}}>
        {parentList && !isSearching ? 
        <ScrollView showsVerticalScrollIndicator={false} style={styles.contentLeft}>
          {
            parentList.map((v, i) => (
              <TouchableOpacity style={[styles.contentLeftBtn, parentSelected.name == v.name && {borderRightWidth: 2,borderRightColor: '#FF5100',}]} key={i} onPress={() => this._setParentSelected(v)}>
                <Text style={[styles.contentLeftText, parentSelected.name == v.name && {color: '#FE5800'}]}>{v.name}</Text>
              </TouchableOpacity>
            ))
          }
        </ScrollView> : null}
        {placeList ? <ScrollView style={styles.contentRight}>
          {placeList.map((item, idx) => (
              <CommonItem
                style={!isSearching && parentList && {width: GLOBAL_PARAMS._winWidth - em(80)}}
                leftStyle={!isSearching && parentList && {maxWidth: em(150)}}
                key={idx}
                content={item.name}
                clickFunc={() => this._onValueChange(item)}
                hasRightIcon
                rightIcon={
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text
                      style={{ marginRight: 10, color: Colors.main_orange }}
                    >
                      {(item.length && item.length.toFixed(2) + "  km") || null}
                    </Text>
                    {this._checkedImage(item.name)}
                  </View>
                }
              />
            ))
          }
          {placeList && placeList.length == 0 && (
            <BlankPage
              message="沒有搜索數據"
              style={{ backgroundColor: "transparent" }}
            />
          )}
        </ScrollView> : null
      }
      </View>
    )
  }


  render() {
    const { modalVisible, closeFunc } = this.props;
    return (
      <CommonModal
        modalVisible={modalVisible}
        closeFunc={closeFunc}
        // getSearchContent={content => this._filterPickPlace(content)}
        title={this.state.i18n.address}
        // isHeaderShow={false}
        // isSearchHeader
        // type="search"
        isCustomHeader={true}
        CustomHeader={this._renderCustomHeader()}
      >
        {this._renderPositionPreviewer()}
        {this._renderPopupDialog()}
        {this._renderPickPlaceContent()}
        {this.state.loading && <LoadingModal message="loading..." />}
      </CommonModal>
    );
  }
}

const placePickerModalStateToProps = state => {
  return {
    place: state.placeSetting.place,
    placeList: state.placeSetting.placeList,
    language: state.language.language
  };
};

const placePickerDispatchToProps = dispatch => ({
  stockPlace: place => dispatch({ type: STOCK_PLACE, place }),
  stockPlaceList: placeList => dispatch({ type: STORE_PLACE_LIST, placeList })
});

export default connect(
  placePickerModalStateToProps,
  placePickerDispatchToProps
)(PlacePickerModel);
