import React, { PureComponent } from 'react';
import {View} from 'react-native';
import {Container,Content} from 'native-base';
//components
import CommonItem from '../components/CommonItem';
import CommonHeader from '../components/CommonHeader';
//utils
import Colors from '../utils/Colors';

const PaySettingView = props => {
  const _list_arr = [
    {
      content: '現金支付',isEnd: false,clickFunc: () => {}
    },
    {
      content: 'apple pay',isEnd: false,clickFunc: () => {}
    },
    {
      content: '信用卡支付',isEnd: true,clickFunc: () => {
        props.navigation.navigate('Credit');
      }
    }
  ]
  return (
    <Container>
    <CommonHeader title="我的支付方式" canBack {...props}/>
      <Content style={{backgroundColor:Colors.main_white}}>
      <View>
      {_list_arr.map((item,key) => (
        <CommonItem key={key} content={item.content} isEnd={item.isEnd} clickFunc={item.clickFunc}/>
      ))}
      </View>
    </Content>
    </Container>
  )
}

export default PaySettingView;