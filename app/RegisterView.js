import React,{PureComponent} from 'react'
import {View,Image} from 'react-native'
import { Container, Header, Content, Form, Item, Input, Label, Body, Button,Text } from 'native-base';

export default class RegisterView extends PureComponent {
  state={

  }
  render() {
    return (
      <Container>
       <Header>
         <Body>
           <Text>用戶註冊</Text>
         </Body>
       </Header>
       <Content>
         <Form>
           <Button transparent><Text>+852</Text></Button>
           <Item floatingLabel>
             <Label>填寫手機號</Label>
             <Input />
           </Item>
           <Item floatingLabel last>
             <Label>發送驗證碼</Label>
             <Input />
           </Item>
             <Button  block style={{marginTop:10,marginLeft:10,marginRight:10}}>
               <Text>點擊註冊</Text>
             </Button>
         </Form>
       </Content>
     </Container>
    )
  }
}
