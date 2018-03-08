import React, { PureComponent } from 'react';
import {Container, Content} from 'native-base';
import { View, Text } from 'react-native';
import CommonHeader from '../components/CommonHeader';

export default class IntegralView extends PureComponent {
  render() {
    return (
      <Container>
        <CommonHeader canBack {...this['props']} />
      </Container>
    )
  }

}