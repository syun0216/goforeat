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
import {em, SET_PAY_TYPE} from '../utils/global_params';
//api
import {getCreditCard} from '../api/request';

const STATUS_IMAGE = {
  open_eye: require('../asset/openeye.png'),
  close_eye: require('../asset/closeeye.png')
};


export default class ManageCreditCardView extends PureComponent {

  constructor(props) {
    super(props);
    this.i18n = props.i18n;
    this.state={
      isCardNumberShow: false,
      creditCardInfo: null
    }
  }

  componentDidMount() {
    this._getCreditCard();
  }

  //api
  _getCreditCard() {
    getCreditCard().then(data => {
      if(data.ro.ok) {
        this.setState({
          creditCardInfo: data.data
        })
      }
    });
  }

  _generate_text(val) {
    return (<Text style={{fontSize: 16,color: '#333',marginRight: 33/2 -10}}>{val}</Text>)
  }

  _unbindCard() {
    Alert.alert(
      this.i18n.tips,
      this.i18n.manage_card_tips.alert_cancel,
      [
        {text: this.i18n.cancel, onPress: () => {return null}, style: 'cancel'},
        {text: this.i18n.confirm, onPress: () => {
          const {callback} = this.props.navigation.state.params;
          callback && callback();
          this.props.navigation.goBack();
        }},
      ],
      { cancelable: false }
    )
    
  }

  _renderContentView(_creditCardInfo) {
    let _list_arr = [
      {content: this.i18n.cardType,rightIcon:this._generate_text(this.i18n.card)},
      {content: this.i18n.date,rightIcon: this._generate_text(_creditCardInfo.time)}
    ];
    return (
      <View>
        <View style={ManageCreditCardStyles.CardImageContainer}>
        <Image style={ManageCreditCardStyles.CardImage} source={require('../asset/card_bg.png')} resizeMode="cover"/>
        <View style={ManageCreditCardStyles.CardInfo}>
          <Text style={ManageCreditCardStyles.CardType}>{this.i18n.card}</Text>
          <Text style={ManageCreditCardStyles.CardNumber}>{`**** **** **** ${_creditCardInfo.tailNum}`}</Text>
          </View>
          {/*<TouchableOpacity onPress={() => this.setState({isCardNumberShow:!this.state.isCardNumberShow})} style={ManageCreditCardStyles.EyeBtn}>
            <Image style={ManageCreditCardStyles.EyeImage} source={this.state.isCardNumberShow?STATUS_IMAGE.open_eye:STATUS_IMAGE.close_eye} resizeMode="contain"/>
          </TouchableOpacity>*/}
      </View>
      {_list_arr.map((v,i) => (
        <CommonItem key={i} content={v.content} rightIcon={v.rightIcon} disabled={true} contentStyle={{marginLeft: 33/2 - 10}}/>
      ))}
      <CommonBottomBtn clickFunc={() => this.props.navigation.navigate('Credit',{
        callback:() => {
          this._getCreditCard();
        }
      })}>{this.i18n.changeCard}</CommonBottomBtn>
        <Text style={ManageCreditCardStyles.BottomInfo}>{this.i18n.bindCardOnce}</Text>
      </View>
    )
  }

  render() {
    let {creditCardInfo} = this.state;
    return (
      <Container>
        <Header iosBarStyle="dark-content" androidStatusBarColor="#fff" style={ManageCreditCardStyles.header}>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="ios-arrow-back" size={20} style={[{color:'#333'},Platform.OS == 'ios'? CommonStyles.common_icon_back : null]}/>
            </Button>
          </Left>
          <Body style={{minWidth: em(200),}}>
            <Text allowFontScaling={false} style={{color: '#333',fontSize: 16}} numberOfLines={1}>{this.i18n.manageCardTitle}</Text>
          </Body>
          <Right />
        </Header>
        <Content>
          {creditCardInfo == null ? null : this._renderContentView(creditCardInfo)}
        </Content>
        <Footer style={ManageCreditCardStyles.Footer}>
          <TouchableOpacity style={ManageCreditCardStyles.FooterBtn} onPress={() => this._unbindCard()}>
            <Text style={ManageCreditCardStyles.BottomInfo}>{this.i18n.cancelBind}</Text>
          </TouchableOpacity>
        </Footer>
      </Container>
    )
  }
}