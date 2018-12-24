import React, { Component } from "react";
import PropTypes from "prop-types";
import { Image } from "react-native";
import {connect} from 'react-redux';
//actions
import { STORE_PLACE_LIST, STOCK_PLACE } from '../actions';
//utils
import ToastUtils from "../utils/ToastUtil";
//api
import { foodPlaces } from "../api/request";
//cache
import { placeStorage, placeListStorage } from "../cache/appStorage";
//components
import CommonItem from "./CommonItem";
import CommonModal from "./CommonModal";
//language
import I18n from "../language/i18n";
//styles
import PaySettingStyles from "../styles/paysetting.style";

const _checked = "../asset/checked.png";
const _unchecked = "../asset/unchecked.png";
class PlacePickerModel extends Component {
  static propsType = {
    content: PropTypes.string,
    modalVisible: PropTypes.bool,
    closeFunc: PropTypes.func,
    title: PropTypes.string
  };

  state = {
    placeList: null,
    selected: null,
    i18n: I18n[this.props.screenProps.language]
  };

  componentDidMount() {
    placeListStorage.getData((error, placeList) => {
      if (error === null) {
        if (placeList !== null) {
          console.log(placeList);
          this.setState({
            placeList: placeList
          },() => {
            this.props.stockPlaceList(placeList);
            placeStorage.getData((error, place) => {
              if (error === null) {
                if (place !== null) {
                  this.setState({
                    selected: place.name
                  })
                  this.props.getSeletedValue(place);
                  this.props.stockPlace(place);
                } else {
                  this.props.getSeletedValue(placeList[0]);
                  this.props.stockPlace(placeList[0]);
                  this.setState({
                    selected: placeList[0].name
                  })
                }
              }
            });
          });
        } else {
          this.getPlace();
        }
      } else {
        this.getPlace();
      }
    });
    
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      i18n: I18n[nextProps.screenProps.language]
    });
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

  //api
  getPlace(storage_data) {
    
    foodPlaces().then(
      data => {
        if (data.ro.respCode === "0000") {
          let _data =
            typeof storage_data != "undefined" ? storage_data : data.data[0];
          this.setStateAsync({ selected: _data.name }).then(() => {
            this.setState({
              placeList: data.data
            });
          });
          this.props.getSeletedValue(_data);
          this.props.stockPlaceList(data.data);
          placeListStorage.setData(data.data);
          this.props.stockPlace(_data);
          placeStorage.setData(_data);
        } else {
          ToastUtils.showWithMessage(data.ro.repMsg);
          this.props.getSeletedValue(null);
        }
      },
      () => {
        ToastUtils.showWithMessage(this.state.i18n.common_tips.network_err);
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

  render() {
    const { modalVisible, closeFunc } = this.props;
    return (
      <CommonModal
        modalVisible={modalVisible}
        closeFunc={closeFunc}
        title={this.state.i18n.address}
      >
        {this.state.placeList != null
          ? this.state.placeList.map((item, idx) => (
              <CommonItem
                key={idx}
                content={item.name}
                clickFunc={() => this._onValueChange(item)}
                hasRightIcon
                rightIcon={this._checkedImage(item.name)}
              />
            ))
          : null}
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
