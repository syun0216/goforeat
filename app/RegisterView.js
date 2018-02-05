import React, {PureComponent} from 'react'
import {View, Image} from 'react-native'
import Picker from 'react-native-picker'
import {
  Container,
  Header,
  Content,
  Form,
  Item,
  Input,
  Label,
  Body,
  Button,
  Text,
  Icon,
  Left,
  Right
} from 'native-base';
//utils
import Colors from './utils/Colors'
import GLOBAL_PARAMS from './utils/global_params'

export default class RegisterView extends PureComponent {
  state = {
    selectedValue:GLOBAL_PARAMS.phoneType.HK,
    isBtnDisabled: true,
    codeContent: '點擊發送',
    isCodeDisabled: false
  }

  componentDidMount() {
    Picker.init({
      pickerData: [
        'HK +852', 'CHN +86'
      ],
      selectedValue: ['HK: +852'],
      pickerTitleText: '選擇電話類型',
      pickerConfirmBtnText: '確定',
      pickerCancelBtnText: '取消',
      onPickerConfirm: data => {
        switch(data[0]){
          case GLOBAL_PARAMS.phoneType.HK.label:this.setState({selectedValue:GLOBAL_PARAMS.phoneType.HK});break
          case GLOBAL_PARAMS.phoneType.CHN.label:this.setState({selectedValue:GLOBAL_PARAMS.phoneType.CHN});break
        }
      }
    });
  }

  componentWillUnmount() {
    Picker.hide()
  }

  //common function
  _sendPhoneAndGetCode = () => {
    let _during = 10
    let interval = setInterval(() => {
      _during--;
      this.setState({
        codeContent:`${_during}秒后重發`,
        isCodeDisabled: true
      })
      if(_during === 0) {
        this.setState({
          codeContent: '重新發送',
          isCodeDisabled: false
        })
        clearInterval(interval)
      }
    },1000)
  }

  render() {
    return (<Container>
      <Header>
        <Left>
          <Button transparent onPress={() => this.props.navigation.goBack()}>
            <Icon
              size={20}
              name="ios-arrow-back"
              style={{ fontSize: 25, color: Colors.main_orange }}
            />
          </Button>
        </Left>
        <Body>
          <Text>用戶註冊</Text>
        </Body>
        <Right/>
      </Header>
      <Content>
        <Form>
          <Item>
            <Label>選擇區域</Label>
            <Button transparent onPress={() => Picker.show()}>
              <Text style={{color:Colors.main_orange}}>{this.state.selectedValue.label}</Text>
            </Button>
          </Item>
          <Item inlineLabel>
            {/* <Label>填寫手機號</Label> */}
            <Input placeholder="填寫手機號碼"/>
          </Item>
          <Item inlineLabel last>
            {/* <Label>發送驗證碼</Label> */}
            <Input placeholder="填寫驗證碼"/>
            <Button disabled={this.state.isCodeDisabled} transparent onPress={() => this._sendPhoneAndGetCode()}>
              <Text style={this.state.isCodeDisabled ? {color:'#959595'} : {color:Colors.main_orange}}>{this.state.codeContent}</Text>
            </Button>
          </Item>
          <Button block disabled={this.state.isBtnDisabled} style={[{
              marginTop: 10,
              marginLeft: 10,
              marginRight: 10
            },this.state.isBtnDisabled ? null : {backgroundColor:Colors.main_orange}]}>
            <Text>點擊註冊</Text>
          </Button>
        </Form>
      </Content>
    </Container>)
  }
}
