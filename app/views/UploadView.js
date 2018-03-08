import React, { PureComponent } from 'react';
import {Container,Content} from 'native-base';
import CommonHeader from '../components/CommonHeader';


export default class UploadView extends PureComponent {
  render() {
    return (
      <Container>
        <CommonHeader canBack {...this['props']}/>
      </Container>
    )
  }
}
