import React from "react";
import {View, StyleSheet, Platform} from 'react-native';
import {CardItem, Card, Container, Content, Body} from 'native-base';
import Image from 'react-native-image-progress';
import {connect} from 'react-redux';
import FastImage from "react-native-fast-image";
//utils
import GLOBAL_PARMAS,{em} from '../utils/global_params';
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

class PickPlaceView extends React.Component {
  render() {
    const {placeList, screenProps:{language},navigation: {state: {params}}} = this.props;
    console.log(params);
    return (
      <CustomizeContainer.SafeView mode="linear">
        <CommonHeader hasMenu={!params} canBack={params && params.navigate} title={i18n[language].pickPlace} {...this.props} />
        <Content style={{backgroundColor: '#efefef'}}>
          {placeList.map((item, key) => (
            <View key={key} style={[{width: GLOBAL_PARMAS._winWidth* 0.9,marginLeft: GLOBAL_PARMAS._winWidth*0.05,marginBottom: GLOBAL_PARMAS._winWidth*0.05,borderRadius: 8,backgroundColor: '#fff'},key==0&&{marginTop:GLOBAL_PARMAS._winWidth*.05}]}>
              <FastImage style={styles.img} source={item.picture ? {
                uri: item.picture || '',
                priority: FastImage.priority.normal
              } : require('../asset/gardenListDefault.png')} resizeMode={FastImage.resizeMode.contain}/>
              <View style={{padding: GLOBAL_PARMAS._winWidth*.05,alignItems: 'flex-start',}}>
                <Text>{item.name || '暫無名稱'}</Text>
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
    placeList: state.placeSetting.placeList
  })
}

export default connect(placePickerModalStateToProps,{})(PickPlaceView);