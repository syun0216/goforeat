import React, { PureComponent } from 'react';
import { View } from 'react-native';
import {Container,Content,Footer,Button,Text} from 'native-base';
// components
import CommonHeader from '../components/CommonHeader';
// api
import api from '../api'
//utils
import Colors from '../utils/Colors'
import GLOBAL_PARAMS from '../utils/global_params'

export default class IntegralDetailView extends PureComponent {
  state = {
    projectDetail: null
  }
  componentDidMount = () => {
    // api.getIntegralProjectDetail().then(data => {
    //   if(data.status === 200 && data.data.ro.ok) {
    //     this.setState({
    //       projectDetail: data.data.data
    //     })
    //   }
    // })
  }

  render = () => (
    <Container>
      <CommonHeader title="積分詳情" canBack {...this['props']}/>
      <Content style={{padding:10}}></Content>
      <Footer>
        <Button style={{backgroundColor: this.props.theme,flex:1,margin:5,justifyContent:'center'}}>
          <Text  style={{color:Colors.main_white}}>立即兌換</Text>
        </Button>
      </Footer>
    </Container>
  )
}