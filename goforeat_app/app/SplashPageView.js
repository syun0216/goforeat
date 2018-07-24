import React, { Component } from 'react';
import { StyleSheet, Text, View, Button,Platform } from 'react-native';
import CommonHeader from './components/CommonHeader';
import {Container,Content} from 'native-base'
global.PaymentRequest = require('react-native-payments').PaymentRequest;
const ReactNativePaymentsVersion = require('react-native-payments/package.json')
  .version;
import { NativeModules } from 'react-native';
const { ReactNativePayments } = NativeModules;

export default class StripeExample extends Component {
  constructor() {
    super();

    this.state = {
      text: null
    };
  }

  handlePress() {
    let supportedMethods = ''
    if(Platform.OS == 'ios') {
      supportedMethods = [
        {
          supportedMethods: ['apple-pay'],
          data: {
            merchantIdentifier: 'merchant.com.syun.goforeat',
            supportedNetworks: ['visa', 'mastercard'],
            countryCode: 'US',
            currencyCode: 'USD',
            paymentMethodTokenizationParameters: {
              parameters: {
                gateway: 'stripe',
                'stripe:publishableKey': 'pk_live_4JIHSKBnUDiaFHy2poHeT2ks',
                'stripe:version': '13.0.3'
              }
            }
          }
        }
      ];
    }else {
      supportedMethods = [{
        supportedMethods: ['android-pay'],
        data: {
          supportedNetworks: ['visa', 'mastercard', 'amex'],
          currencyCode: 'USD',
          environment: 'TEST', // defaults to production
          paymentMethodTokenizationParameters: {
            tokenizationType: 'NETWORK_TOKEN',
            parameters: {
              publicKey: 'pk_live_4JIHSKBnUDiaFHy2poHeT2ks'
            }
          }
        }
      }];
    }

    const details = {
      id: 'basic-example',
      displayItems: [
        {
          label: 'Movie Ticket',
          amount: { currency: 'USD', value: '15.00' }
        }
      ],
      total: {
        label: 'Merchant Name',
        amount: { currency: 'USD', value: '15.00' }
      }
    };

    const pr = new PaymentRequest(supportedMethods, details);

    pr
      .show()
      .then(paymentResponse => {
        test()
        this.setState({
          text: paymentResponse.details.paymentToken
        });

        // paymentResponse.complete('success');
      })
      .catch(e => {
        pr.abort();

        this.setState({
          text: e.message
        });
      });
  }

  test() {
    // console.log(ReactNativePayments.supportedGateways)
  }

  render() {
    return (
      <Container>
        <CommonHeader title="測試apple_pay" canBack {...this.props}/>
        <Content>
        <Button
        title="Buy with Stripe"
        onPress={this.handlePress.bind(this)}
          />
          <Text>
            {this.state.text}
          </Text>
          <Text>
            {ReactNativePaymentsVersion}
          </Text>
        
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 25,
    padding: 10
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});