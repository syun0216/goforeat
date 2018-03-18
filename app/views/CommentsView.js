import React, { PureComponent } from 'react'
import { View,Text } from 'react-native';
import {Container,Content,List,ListItem,Thumbnail,Body} from 'native-base';
// components
import CommonHeader from '../components/CommonHeader';
//utils
import Colors from '../utils/Colors';

export default class CommentsView extends PureComponent {
  render() {
    let {comment} = this.props.navigation.state.params;
    return (
      <Container>
        <CommonHeader canBack title="精彩評論" {...this['props']}/>
        <Content>
          {comment.map((item,idx) => (
            <ListItem avatar key={idx} style={{backgroundColor: Colors.main_white,marginLeft: 0}}>
            <Thumbnail size={10} source={{ uri: item.image }} />
            <Body style={{marginLeft: 10,borderBottomWidth: 0,}}>
              <Text style={{marginBottom: 10,borderBottomWidth: 0}}>{item.nickName}</Text>
              <Text note>{item.info}</Text>
            </Body>
          </ListItem>
          ))}
        </Content>
      </Container>
    )
  }
}