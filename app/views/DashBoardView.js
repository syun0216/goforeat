import React, {Component} from 'react';
import {FlatList} from 'react-native'
import {FontAwesome} from 'react-native-vector-icons'
import {Container,Header,Content,Button} from 'native-base'
// Api
import api from '../api'

export default class DashBoardView extends Component {
  state = {
    canteenData: []
  }
  componentWillMount() {
    api.getCanteenDetail(1).then(data => {
      console.log(data)
    })
  }
  render() {
    return (
      <Container>
        123
      </Container>
    )
  }
}
