import React, { PureComponent } from 'react';
import {View, Text} from 'react-native';
import {Container, Content} from 'native-base';
//components
import CommonHeader from '../components/CommonHeader';

export default class CouponView extends PureComponent{
  render() {
    return (
      <Container>
        <Content>
          <CommonHeader title="優惠券" hasMenu {...this.props}/>
        </Content>
      </Container>
    )
  }
}