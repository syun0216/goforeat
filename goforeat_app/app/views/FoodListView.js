import React, {Component} from 'react'
import {View,TouchableOpacity,StyleSheet} from 'react-native'
import {
  Container,
} from 'native-base';
import Image from 'react-native-image-progress';
//utils
import GLOBAL_PARAMS, { em } from '../utils/global_params';
//api
import {getNewArticleList} from '../api/request';
import source from '../api/CancelToken';
//components
import CommonHeader from '../components/CommonHeader';
import Text from '../components/UnScalingText';
import SlideUpPanel from '../components/SlideUpPanel';
import CommonFlatList from "../components/CommonFlatList";
//language
import I18n from '../language/i18n';
//styles
import HomePageStyles from '../styles/homepage.style';

let requestParams = {
  status: {
    LOADING: 0,
    LOAD_SUCCESS: 1,
    LOAD_FAILED: 2,
    NO_MORE_DATA: 3
  },
  nextOffset: 0,
  currentOffset: 0
}

const { isIphoneX, bottomDistance, iPhoneXBottom, _winHeight } = GLOBAL_PARAMS;

export default class FoodListView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentItem: '',
      i18n: I18n[props.screenProps.language]
    };
  }

  componentWillReceiveProps() {
    if(!!this.flatlist) this.flatlist.outSideRefresh();
  }

  componentWillUnmount() {
    source.cancel()
  }
  
  //common functions

  _renderFoodListItemView (item,index) {
    if(typeof item === 'undefined') return;
    return (
      <TouchableOpacity style={styles.articleItemContainer}
        onPress={() => {
          this.setState({
            currentItem: item
          }, () => {
            this.slideUpPanel._snapTo()    
          })
        }}>
        <Image source={{uri: item.thumbnail}} style={{width: em(124),height: em(160)}} resizeMode="cover"/>
        <View style={styles.articleItemDetails}>
          <View style={[styles.itemName, styles.marginBottom9]}>
            <Text style={styles.foodName} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.foodTime}>{item.date}</Text>
          </View>
          <View style={{height: em(75),marginBottom: 12.5,}}>
            <Text style={styles.foodBrief} numberOfLines={5}>{item.brief}</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.foodUnit}>HKD</Text>
            <Text style={styles.foodPrice}>{item.price}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )}

  _renderFoodDetailsView() {
    let {name,date,thumbnail,brief,price} = this.state.currentItem;
    return (
      <SlideUpPanel ref={r => this.slideUpPanel = r}>
        <View onLayout={e => {
          this.foodDetailsViewHeight = e.nativeEvent.layout.height;
        }}>
          <Text style={HomePageStyles.panelTitle} numberOfLines={2}>{name}</Text>
          <Image style={HomePageStyles.panelImage} source={{uri: thumbnail}}/>
          <Text style={HomePageStyles.IntroductionFoodBrief} >{brief}</Text>
          <View style={HomePageStyles.AddPriceViewPriceContainer}>
            <Text style={HomePageStyles.AddPriceViewPriceUnit}>HKD</Text>
            <Text style={HomePageStyles.AddPriceViewPrice}>{price}</Text>
            <Text style={HomePageStyles.AddPriceViewOriginPrice}>{date}</Text>
          </View>
        </View>
      </SlideUpPanel>
    )
  }

  render() {
    let {i18n} = this.state;
    _bottomDistance = isIphoneX() ?  bottomDistance + iPhoneXBottom : bottomDistance;
    return (
    <Container style={{position:'relative'}}>
      <CommonHeader hasMenu headerHeight={em(76)} title={i18n.weekMenu}/>
        <View style={{marginTop:-em(75),height: _winHeight - _bottomDistance,minHeight: _winHeight - _bottomDistance}}>
          {<CommonFlatList ref={c => this.flatlist = c} requestFunc={getNewArticleList} renderItem={(item,index) => this._renderFoodListItemView(item,index)} extraParams={{placeId: this.props.screenProps.place.id}} {...this.props}/>}
        </View>  
        {this._renderFoodDetailsView()}  
      </Container>)
    }
  }

FoodListView.navigationOptions = ({screenProps}) => ({
  tabBarLabel: I18n[screenProps.language].weekMenu
})

const styles = StyleSheet.create({
  articleItemContainer:{
    height: em(160),
    flex:1,
    borderRadius: 8,
    margin: 10,
    borderRadius :5,
    flexDirection: 'row',
    shadowColor: '#ededeb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    backgroundColor: '#fff',
    overflow: 'hidden'
  },
  articleItemDetails: {
    padding: 17,
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ededeb',
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  itemName: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  foodName: {
    fontSize: em(18),
    color: '#111',
    fontWeight: '800',
    maxWidth: em(130)
  },
  foodTime: {
    fontSize: em(13),
    color: '#666',
    lineHeight: em(20)
  },
  foodBrief: {
    fontSize: em(11),
    color: '#999',
    textAlign: 'justify',
    lineHeight: 16
  },
  foodUnit: {
    fontSize: em(14),
    color: '#666',
    marginRight: em(5)
  },
  foodPrice: {
    fontSize: em(18),
    color: '#2a2a2a',
    lineHeight: em(18)
  },
  marginBottom9: {
    marginBottom: em(10),
  }
})
