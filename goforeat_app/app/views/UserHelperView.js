import React from 'react';
import {View} from 'react-native';
import {Container,Content} from 'native-base';
//components
import CommonItem from '../components/CommonItem';
import CommonHeader from '../components/CommonHeader';
//utils
import LinkingUtils from '../utils/LinkingUtils';
import Colors from '../utils/Colors';
import ToastUtil from '../utils/ToastUtil';

const UserHelper = (props) => {
  let _phonecall = () => LinkingUtils.dialPhoneWithNumber(52268745);
  const _list_arr = [
    {content: '電話聯繫',isEnd: false,clickFunc: () => LinkingUtils.dialPhoneWithNumber(52268745)},
    // {content: '在線支援',isEnd: true,clickFunc: () => {ToastUtil.showWithMessage('該功能暫未開放')}},
  ]
  return (
    <Container>
      <CommonHeader canBack title="用戶支援" {...props}/>
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

export default UserHelper;

