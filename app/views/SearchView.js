import React,{Component} from 'react'
import { Container, Header, Item, Input, Icon, Button, Text } from 'native-base'

export default class SearchView extends Component{
  render() {
    return (
      <Container>
       <Header searchBar rounded>
         <Item>
           <Icon name="ios-search" />
           <Input placeholder="輸入商品名稱" />
           {/* <Icon name="ios-people" /> */}
         </Item>
         <Button transparent>
           <Text>搜索</Text>
         </Button>
       </Header>
     </Container>
    )
  }
}
