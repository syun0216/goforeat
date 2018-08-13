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
  }

  componentDidMount() {
    test();
  }

  render() {
    return (
      <Container>
      </Container>
    );
  }
}