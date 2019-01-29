import React, { PureComponent } from 'react';
import {View,Text} from 'react-native';
import {Content} from 'native-base';
//api
import {getMonthTicketList, createMonthTicket, confirmMonthTicket} from '../api/request';
//components
import CommonHeader from '../components/CommonHeader';
import CustomizeContainer from '../components/CustomizeContainer';

export default class PurchaseMonthTicketView extends PureComponent {
  render() {
    return (
      <CustomizeContainer.SafeView mode="linear">
        <CommonHeader title="購買月票" canBack/>
        <Content>

        </Content>
      </CustomizeContainer.SafeView>  
    )
  }
}
