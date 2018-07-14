import React, { PureComponent } from 'react';
import { View,Text,TouchableOpacity } from 'react-native';
import { Container,Content,Input,Form,Item,Button } from 'native-base';
import Stripe from 'react-native-stripe-api';
import LinearGradient from 'react-native-linear-gradient';
//components
import CommonHeader from '../components/CommonHeader';
//styles
import CommonStyles from '../styles/common.style';
import CreditCardStyles from '../styles/creditcard.style';

const api_key = 'pk_live_4JIHSKBnUDiaFHy2poHeT2ks';
const client = new Stripe(api_key);

export default class CreditCardView extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      card: '',
      year: '',
      month: '',
      cvc: ''
    }
  }

  //logic
  _getCard(card) {
    this.setState({
      card
    })
  }

  _getYear(year) {
    this.setState({
      year
    })
  }

  _getMonth(month) {
    this.setState({
      month
    })
  }

  _getCVC(cvc) {
    this.setState({
      cvc
    })
  }

  async _testPay() {
    const token = await client.createToken({
      number: '4581241318953824' ,
      exp_month: '07', 
      exp_year: '22', 
      cvc: '060',
      // address_zip: '12345'
   });
   console.log(token);
  }

  render() {
    return (
      <Container>
        <CommonHeader title="信用卡" canBack {...this.props}/>
        <Content>
          <Form>
            <Item>
              <Input placeholder="卡號" onChangeText={card => this._getCard(card)}/>
            </Item>
            <Item>
              <Input placeholder="有效年份" onChangeText={year => this._getYear(year)} maxLength={2}/>
            </Item>
            <Item>
              <Input placeholder="有效月份" onChangeText={month => this._getMonth(month)} maxLength={2}/>
            </Item>
            <Item last>
              <Input placeholder="安全碼" onChangeText={cvc => this._getCVC(cvc)} maxLength={3}/>
            </Item>
            </Form>
            <View style={CreditCardStyles.BtnView}>
              <TouchableOpacity onPress={() => this._testPay()}>
                <LinearGradient colors={['#FF9F48','#FF4141']} start={{x:0.0, y:0.0}} end={{x:1.0,y: 0.0}} style={CommonStyles.btn}>
                  <Text style={{color:'#fff',fontSize:16}}>綁定卡號</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
        </Content>
      </Container>
    )
  }

}