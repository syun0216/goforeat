import React from "react";
import {View, StyleSheet, Platform} from 'react-native';
import {Content} from 'native-base';
import {connect} from 'react-redux';
import FastImage from "react-native-fast-image";
//utils
import GLOBAL_PARMAS,{em} from '../utils/global_params';
import Colors from '../utils/Colors';
//component 
import Text from '../components/UnScalingText';
import CommonHeader from '../components/CommonHeader';
import CustomizeContainer from "../components/CustomizeContainer";
//i18n
import i18n from '../language/i18n';

const styles = StyleSheet.create({
  img: Platform.OS == 'ios'?{width:'100%', height: em(250),borderTopLeftRadius: 8,borderTopRightRadius: 8,}:
  {width:GLOBAL_PARMAS._winWidth*0.9,height:em(250),marginTop: GLOBAL_PARMAS._winWidth*0.05}
})

/**
 *
 *
 * @class PickPlaceView
 * @extends {React.Component}
 */
class PickPlaceView extends React.Component {
  render() {
    const {placeList, place, language,navigation: {state: {params}}} = this.props;
    let _formatData = placeList.slice(0);
    if(place) {
      let _selectPlace = null;
      for(let idx in _formatData) {
        if(_formatData[idx].id == place.id) {
          _selectPlace = _formatData.splice(idx, 1);
          // _selectPlace = _selectPlace[0].name + '  (當前選擇點)';
        }
      }
      _formatData.unshift(_selectPlace[0]);
    }
    return (
      <CustomizeContainer.SafeView mode="linear">
        <CommonHeader canBack title={i18n[language].pickPlace} />
        <Content style={{backgroundColor: '#efefef'}}>
          {_formatData.map((item, key) => (
            <View key={key} style={[{width: GLOBAL_PARMAS._winWidth* 0.9,marginLeft: GLOBAL_PARMAS._winWidth*0.05,marginBottom: GLOBAL_PARMAS._winWidth*0.05,borderRadius: 8,backgroundColor: '#fff'},key==0&&{marginTop:GLOBAL_PARMAS._winWidth*.05}]}>
              <FastImage style={styles.img} source={item.picture ? {
                uri: item.picture || '',
                priority: FastImage.priority.normal
              } : require('../asset/gardenListDefault.png')} resizeMode={FastImage.resizeMode.contain}/>
              <View style={{padding: GLOBAL_PARMAS._winWidth*.05,alignItems: 'flex-start',}}>
                <Text>{item.name || '暫無名稱'}</Text>
                {key == 0 && <Text style={{color: Colors.main_orange,fontSize: 15,marginTop: 8}}>(當前選擇點)</Text>}
              </View>
            </View>
          ))}
        </Content>
      </CustomizeContainer.SafeView>
    )

  }
}

const placePickerModalStateToProps = state => {
  return ({
    placeList: state.placeSetting.placeList,
    place: state.placeSetting.place,
    language: state.language.language
  })
}

export default connect(placePickerModalStateToProps,{})(PickPlaceView);