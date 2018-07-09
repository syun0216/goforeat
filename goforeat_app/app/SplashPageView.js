import React, { Component } from 'react';
import { StyleSheet, Text, View, Button,Platform } from 'react-native';

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
            // paymentMethodTokenizationParameters: {
            //   parameters: {
            //     gateway: 'stripe',
            //     'stripe:publishableKey': 'pk_test_TpTQ3qfxsatlvVO1npNnw3pE',
            //     'stripe:version': '5.0.0'
            //   }
            // }
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
              publicKey: 'pk_test_TpTQ3qfxsatlvVO1npNnw3pE'
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
        this.setState({
          text: paymentResponse.details.paymentToken
        });

        paymentResponse.complete('success');
      })
      .catch(e => {
        pr.abort();

        this.setState({
          text: e.message
        });
      });
  }

  test() {
    console.log(ReactNativePayments.supportedGateways)
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
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
        </View>
      </View>
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