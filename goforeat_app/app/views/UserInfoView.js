import React, { PureComponent } from 'react';
import {View, TouchableOpacity} from 'react-native';
import {Container, Content} from 'native-base';
//api
import { getMyInfo, updateMyInfo, uploadAvatar } from '../api/request';
//components
import CommonHeader from '../components/CommonHeader';
import Text from '../components/UnScalingText';

export default class UserInfoView extends PureComponent {
  render() {
    return (
      <Container>
        <CommonHeader title="修改資料" hasMenu {...this.props}/>
        <Content>
          <Text>UserInfoView</Text>
        </Content>
      </Container>
    )
  }
}