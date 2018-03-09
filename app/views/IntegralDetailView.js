import React, { PureComponent } from 'react';
import { View } from 'react-native';
import {Container} from 'native-base';
import CommonHeader from '../components/CommonHeader';

export default class IntegralDetailView extends PureComponent {
  render = () => (
    <Container>
      <CommonHeader title="積分詳情" canBack {...this['props']}/>
    </Container>
  )
}