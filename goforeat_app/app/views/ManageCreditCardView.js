import React, { PureComponent } from 'react';
import {View,TouchableOpacity,Image,StatusBar,Alert} from 'react-native';
import {Container,Content,Header,Footer,Left,Body,Right,Button,Icon} from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
//styles
import CommonStyles from '../styles/common.style';
import ManageCreditCardStyles from '../styles/managecreditcard.style';
//components
import CommonItem from '../components/CommonItem';
import BlankPage from '../components/BlankPage';
import CommonBottomBtn from '../components/CommonBottomBtn';
import Text from '../components/UnScalingText';
//utils
import {formatCard} from '../utils/FormatCardInfo';
//cache 
import appStorage from '../cache/appStorage';

const STATUS_IMAGE = {
  open_eye: require('../asset/openeye.png'),
  close_eye: require('../asset/closeeye.png')
};


export default class ManageCreditCardView extends PureComponent {

  state={
    isCardNumberShow: false
  }

  _generate_text(val) {
    return (<Text style={{fontSize: 16,color: '#333',marginRight: 33/2 -10}}>{val}</Text>)
  }

  _unbindCard() {
    Alert.alert(
      '提示',
      '確定要取消綁定嗎？',
      [
        {text: '取消', onPress: () => {return null}, style: 'cancel'},
        {text: '確定', onPress: () => {
          this.props.navigation.goBack();
          appStorage.setPayType('cash');
          this.props.screenProps.setPayType('cash');
          this.props.screenProps.removeCreditCardInfo();
          appStorage.removeCreditCardInfo();
        }},
      ],
      { cancelable: false }
    )
    
  }

  _renderContentView(_creditCardInfo) {
    let _list_arr = [
      {content: '持卡人姓名',rightIcon:this._generate_text(_creditCardInfo.name)},
      {content: '卡片類型',rightIcon:this._generate_text('信用卡')},
      {content: '有效期',rightIcon: this._generate_text(_creditCardInfo.time)}
    ];
    return (
      <View>
        <View style={ManageCreditCardStyles.CardImageContainer}>
        <Image style={ManageCreditCardStyles.CardImage} source={require('../asset/card_bg.png')} resizeMode="cover"/>
        <View style={ManageCreditCardStyles.CardInfo}>
          <Text style={ManageCreditCardStyles.CardType}>信用卡</Text>
          <Text style={ManageCreditCardStyles.CardNumber}>{formatCard(_creditCardInfo.card,this.state.isCardNumberShow)}</Text>
          </View>
          <TouchableOpacity onPress={() => this.setState({isCardNumberShow:!this.state.isCardNumberShow})} style={ManageCreditCardStyles.EyeBtn}>
            <Image style={ManageCreditCardStyles.EyeImage} source={this.state.isCardNumberShow?STATUS_IMAGE.open_eye:STATUS_IMAGE.close_eye} resizeMode="contain"/>
          </TouchableOpacity>
      </View>
      {_list_arr.map((v,i) => (
        <CommonItem key={i} content={v.content} rightIcon={v.rightIcon} disabled={true} contentStyle={{marginLeft: 33/2 - 10}}/>
      ))}
      <CommonBottomBtn clickFunc={() => this.props.navigation.navigate('Credit')}>更換信用卡</CommonBottomBtn>
        <Text style={ManageCreditCardStyles.BottomInfo}>只可以綁定一張信用卡</Text>
      </View>
    )
  }

  render() {
    let _creditCardInfo = this.props.screenProps.creditCardInfo == null ? null : this.props.screenProps.creditCardInfo;
    return (
      <Container>
        <Header iosBarStyle="dark-content" style={ManageCreditCardStyles.header}>
        <StatusBar backgroundColor="#fff"/>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="ios-arrow-back" style={[{color:'#333'},CommonStyles.common_icon_back]}/>
            </Button>
          </Left>
          <Body>
            <Text allowFontScaling={false} style={{color: '#333',fontSize: 16}} numberOfLines={1}>管理我的銀行卡</Text>
          </Body>
          <Right />
        </Header>
        <Content>
          {_creditCardInfo == null ? <BlankPage message="暫無卡片信息"/> : this._renderContentView(_creditCardInfo)}
        </Content>
        <Footer style={ManageCreditCardStyles.Footer}>
          <TouchableOpacity style={ManageCreditCardStyles.FooterBtn} onPress={() => this._unbindCard()}>
            <Text style={ManageCreditCardStyles.BottomInfo}>取消綁定</Text>
          </TouchableOpacity>
        </Footer>
      </Container>
    )
  }
}