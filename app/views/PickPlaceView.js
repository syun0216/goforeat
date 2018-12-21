import React from "react";
import {View} from 'react-native';
import {CardItem, Card, Container, Content, Body} from 'native-base';
import Image from 'react-native-image-progress';
import {connect} from 'react-redux';
import FastImage from "react-native-fast-image";
//utils
import GLOBAL_PARMAS,{em} from '../utils/global_params';
//component 
import Text from '../components/UnScalingText';
import CommonHeader from '../components/CommonHeader';
//i18n
import i18n from '../language/i18n';

class PickPlaceView extends React.Component {
  render() {
    const {placeList, screenProps:{language}} = this.props;
    return (
      <Container>
        <CommonHeader hasMenu title={i18n[language].pickPlace} {...this.props} />
        <Content>
          {placeList.map((item, key) => (
            <Card key={key} style={{width: GLOBAL_PARMAS._winWidth* 0.9,marginLeft: GLOBAL_PARMAS._winWidth*0.05,marginBottom: GLOBAL_PARMAS._winWidth*0.05,}}>
              <CardItem cardBody>
                <FastImage style={{width:'100%', height: em(250)}} source={{
                  uri: item.picture,
                  priority: FastImage.priority.normal
                }} resizeMode={FastImage.resizeMode.contain}/>
                {/* <Image source={{uri: item.picture || '',cache: 'only-if-cached',}} style={{width:'100%',height: em(250)}} resizeMode="cover"/> */}
              </CardItem>
              <CardItem>
                <Body><Text>{item.name || '暫無名稱'}</Text></Body>
              </CardItem>
            </Card>
          ))}
        </Content>
      </Container>
    )

  }
}

const placePickerModalStateToProps = state => {
  return ({
    placeList: state.placeSetting.placeList
  })
}

export default connect(placePickerModalStateToProps,{})(PickPlaceView);