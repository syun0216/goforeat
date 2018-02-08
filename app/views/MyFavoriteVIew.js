import React,{PureComponent} from 'react'
import {Container,Content} from 'native-base'
//components
import CommonHeader from '../components/CommonHeader'

export default class MyFavoriteView extends PureComponent{
  render() {
    return (
      <Container>
        <CommonHeader canBack title="我的關注" {...this['props']}/>
        <Content></Content>
      </Container>
    )
  }
}
