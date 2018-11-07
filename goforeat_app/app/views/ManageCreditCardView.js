import React, { PureComponent } from 'react';
import {View,TouchableOpacity,Image,Platform,Alert} from 'react-native';
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
import {em, SET_PAY_TYPE} from '../utils/global_params';
//cache 
import {payTypeStorage} from '../cache/appStorage';
//language
import I18n from '../language/i18n';

const STATUS_IMAGE = {
  open_eye: require('../asset/openeye.png'),
  close_eye: require('../asset/closeeye.png')
};


export default class ManageCreditCardView extends PureComponent {

  state={
    isCardNumberShow: false,
    i18n: I18n[this.props.screenProps.language]
  }

  _generate_text(val) {
    return (<Text style={{fontSize: 16,color: '#333',marginRight: 33/2 -10}}>{val}</Text>)
  }

  _unbindCard() {
    let {i18n} = this.state;
    Alert.alert(
      i18n.tips,
      i18n.manage_card_tips.alert_cancel,
      [
        {text: i18n.cancel, onPress: () => {return null}, style: 'cancel'},
        {text: i18n.confirm, onPress: () => {
          this.props.navigation.goBack();
          this.props.screenProps.setPayType(SET_PAY_TYPE['cash']);
          this.props.screenProps.removeCreditCardInfo();
          payTypeStorage.removeData();
        }},
      ],
      { cancelable: false }
    )
    
  }

  _renderContentView(_creditCardInfo) {
    let {i18n} = this.state;
    let _list_arr = [
      {content: i18n.cardUser,rightIcon:this._generate_text(_creditCardInfo.name)},
      {content: i18n.cardType,rightIcon:this._generate_text(i18n.card)},
      {content: i18n.date,rightIcon: this._generate_text(_creditCardInfo.time)}
    ];
    return (
      <View>
        <View style={ManageCreditCardStyles.CardImageContainer}>
        <Image style={ManageCreditCardStyles.CardImage} source={require('../asset/card_bg.png')} resizeMode="cover"/>
        <View style={ManageCreditCardStyles.CardInfo}>
          <Text style={ManageCreditCardStyles.CardType}>{i18n.card}</Text>
          <Text style={ManageCreditCardStyles.CardNumber}>{formatCard(_creditCardInfo.card,this.state.isCardNumberShow)}</Text>
          </View>
          <TouchableOpacity onPress={() => this.setState({isCardNumberShow:!this.state.isCardNumberShow})} style={ManageCreditCardStyles.EyeBtn}>
            <Image style={ManageCreditCardStyles.EyeImage} source={this.state.isCardNumberShow?STATUS_IMAGE.open_eye:STATUS_IMAGE.close_eye} resizeMode="contain"/>
          </TouchableOpacity>
      </View>
      {_list_arr.map((v,i) => (
        <CommonItem key={i} content={v.content} rightIcon={v.rightIcon} disabled={true} contentStyle={{marginLeft: 33/2 - 10}}/>
      ))}
      <CommonBottomBtn clickFunc={() => this.props.navigation.navigate('Credit')}>{i18n.changeCard}</CommonBottomBtn>
        <Text style={ManageCreditCardStyles.BottomInfo}>{i18n.bindCardOnce}</Text>
      </View>
    )
  }

  render() {
    let {i18n} = this.state;
    let _creditCardInfo = this.props.screenProps.creditCardInfo == null ? null : this.props.screenProps.creditCardInfo;
    return (
      <Container>
        <Header iosBarStyle="dark-content" androidStatusBarColor="#fff" style={ManageCreditCardStyles.header}>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="ios-arrow-back" size={20} style={[{color:'#333'},Platform.OS == 'ios'? CommonStyles.common_icon_back : null]}/>
            </Button>
          </Left>
          <Body style={{minWidth: em(200),}}>
            <Text allowFontScaling={false} style={{color: '#333',fontSize: 16}} numberOfLines={1}>{i18n.manageCardTitle}</Text>
          </Body>
          <Right />
        </Header>
        <Content>
          {_creditCardInfo == null ? <BlankPage message="暫無卡片信息"/> : this._renderContentView(_creditCardInfo)}
        </Content>
        <Footer style={ManageCreditCardStyles.Footer}>
          <TouchableOpacity style={ManageCreditCardStyles.FooterBtn} onPress={() => this._unbindCard()}>
            <Text style={ManageCreditCardStyles.BottomInfo}>{i18n.cancelBind}</Text>
          </TouchableOpacity>
        </Footer>
      </Container>
    )
  }
}