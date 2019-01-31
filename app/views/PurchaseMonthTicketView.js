import React, { PureComponent } from 'react';
import {View,Text,TouchableOpacity,Image} from 'react-native';
import {Content} from 'native-base';
import {Footer, Right, Left,Body} from 'native-base';
//api
import {getMonthTicketList, createMonthTicket, confirmMonthTicket} from '../api/request';
//components
import CommonHeader from '../components/CommonHeader';
import CustomizeContainer from '../components/CustomizeContainer';
import BlankPage from '../components/BlankPage';
//style
import PurchaseMonthTicketStyles from '../styles/purchasemonthticket.style';

export default class PurchaseMonthTicketView extends PureComponent {

  state = {
    monthTicketList: [],
    currentMonthTicketSelect: {}
  }

  componentDidMount() {
    this._getMonthTicketList();
  }

  _getMonthTicketList() {
    getMonthTicketList().then(data => {
      if(data.ro.ok && data.data.list.length > 0) {
        this.setState({
          monthTicketList: data.data.list,
          currentMonthTicketSelect: data.data.list[0]
        })
      }else {
        this.props.toast('獲取數據失敗');
      }
    }).catch(err => {
      this.props.toast('獲取數據失敗');
    })
  }

  _renderTopTitle() {
    return (
      <View style={PurchaseMonthTicketStyles.topTitleView}>
        <View>
          <Text style={PurchaseMonthTicketStyles.topTitle}>月票套餐</Text>
          <Text style={PurchaseMonthTicketStyles.subTitle}>購買月票更優惠</Text>
        </View>
        <Image style={PurchaseMonthTicketStyles.img} source={require('../asset/goforeat.png')} resizeMode="cover"/>
      </View>
    )
  }

  _renderTicketItem(item, key) {
    const {currentMonthTicketSelect} = this.state;
    return (
      <TouchableOpacity onPress={() => this.setState({currentMonthTicketSelect: item})} style={[PurchaseMonthTicketStyles.ticketItem,currentMonthTicketSelect.specId == item.specId && PurchaseMonthTicketStyles.activeItem]} key={key}>
        <View>
          <Text style={PurchaseMonthTicketStyles.amount}>數量:{item.amount}</Text>
          <Text style={PurchaseMonthTicketStyles.date}>2018年1月1日到期</Text>
        </View>
        <View>
          <Text style={PurchaseMonthTicketStyles.price}>${item.price}</Text>
          <Text style={PurchaseMonthTicketStyles.oriPrice}>$18</Text>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    const {monthTicketList,currentMonthTicketSelect} = this.state;
    return (
      <CustomizeContainer.SafeView mode="linear">
        <CommonHeader title="購買月票" canBack/>
        <Content style={{marginTop: 10}}>
          {
            this._renderTopTitle()
          }
          {
            monthTicketList.length > 0 ? monthTicketList.map((item,key) => this._renderTicketItem(item,key)) : <BlankPage message="加载中..."/>
          }
        </Content>
        <Footer style={PurchaseMonthTicketStyles.footer}>
          <Left style={{flexDirection: 'row',alignItems:'center'}}>
            <Text style={PurchaseMonthTicketStyles.unit}>HKD</Text>
            <Text style={PurchaseMonthTicketStyles.total}>{currentMonthTicketSelect.price && currentMonthTicketSelect.price.toFixed(2) || '--'}</Text>
          </Left>  
          <Body></Body>
          <Right>
            <TouchableOpacity style={PurchaseMonthTicketStyles.submitBtn}>
              <Text style={PurchaseMonthTicketStyles.submitBtnText}>購買</Text>
            </TouchableOpacity>
          </Right>
        </Footer>
      </CustomizeContainer.SafeView>  
    )
  }
}
