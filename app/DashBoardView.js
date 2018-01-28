import React,{Component} from 'react'
import {Container,Button,Text} from 'native-base'
//api
import api from './api'

export default class DashBoardView extends Component {
  componentDidMount() {
    api.test(1).then(data => {
      console.log(data)
    })
  }
  render(){
    return (
      <Container>
        <Button>
          <Text>DashBoardView</Text>
        </Button>
      </Container>
    )
  }
}
