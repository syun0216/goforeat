import React, { Component } from 'react';
import { Platform, View, ScrollView, Text, StatusBar, SafeAreaView,Image,TouchableOpacity } from 'react-native';
import {Container} from 'native-base';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { sliderWidth, itemWidth } from '../styles/SliderEntry.style';
import SliderEntry from '../components/SliderEntry';
import styles, { colors } from '../styles/index.style';
import { ENTRIES1, ENTRIES2 } from '../static/entries';
import { scrollInterpolators, animatedStyles } from '../utils/animations';
// utils
import Colors from '../utils/Colors'
import GLOBAL_PARAMS from '../utils/global_params'
import CommonHeader from '../components/CommonHeader';
//api
import api from '../api';
//components 
import ErrorPage from '../components/ErrorPage';

const IS_ANDROID = Platform.OS === 'android';
const SLIDER_1_FIRST_ITEM = 1;

export default class ShopSwiperablePage extends Component {

    constructor (props) {
        super(props);
        this.state = {
            slider1ActiveSlide: SLIDER_1_FIRST_ITEM,
            shopDetail: null,
            isError: false
        };
    }
     

    componentWillReceiveProps() {
        console.log(this.props)
    }

    componentDidMount = () => {
        this.getRecommendList();
      };
      //api
      getRecommendList = () => {
        api.recommendOnlineShop().then(data => {
        //   console.log(data);
          if (data.status === 200 && data.data.ro.ok) {
            this.setState({
              shopDetail: data.data.data
            });
          }
        },() => {
            this.setState({isError: true})
        });
      };

    _renderItem ({item, index}) {
        return <SliderEntry data={item} even={(index + 1) % 2 === 0} {...this['props']}/>;
    }

    _renderItemWithParallax ({item, index}, parallaxProps) {
        return (
            <SliderEntry
              data={item}
              even={(index + 1) % 2 === 0}
              parallax={true}
              parallaxProps={parallaxProps}
              
            />
        );
    }

    _renderLightItem ({item, index}) {
        return <SliderEntry data={item} even={false} {...this['props']}/>;
    }

    _renderDarkItem ({item, index}) {
        return <SliderEntry data={item} even={true} {...this['props']}/>;
    }

    mainExample (number, title) {
        const { slider1ActiveSlide } = this.state;

        return this.state.shopDetail !== null ? (
            <View style={[styles.exampleContainer,{marginTop: -15}]}>
                {/*<Text style={[styles.title,{color:'#1a1917'}]}>商家列表</Text>*/}
                <Text style={[styles.subtitle,{color:'#1a1917'}]}>{title}</Text>
                <Carousel
                  ref={c => this._slider1Ref = c}
                  data={this.state.shopDetail}
                  renderItem={this._renderItemWithParallax}
                  sliderWidth={sliderWidth}
                  itemWidth={itemWidth}
                  hasParallaxImages={true}
                  firstItem={SLIDER_1_FIRST_ITEM}
                  inactiveSlideScale={0.94}
                  inactiveSlideOpacity={0.7}
                  // inactiveSlideShift={20}
                  containerCustomStyle={styles.slider}
                  contentContainerCustomStyle={styles.sliderContentContainer}
                  loop={true}
                  loopClonesPerSide={2}
                  autoplay={true}
                  autoplayDelay={500}
                  autoplayInterval={3000}
                  onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index }) }
                />
            </View>
        ) : null
    }

    render () {
        const example1 = this.mainExample(1, '- 為您推薦 -');

        return (
            <Container>
                <CommonHeader title="線上推薦" {...this['props']}/>
                {this.state.isError ? <ErrorPage errorToDo={this._getRecommendList}/> : null}
                <ScrollView
                      style={styles.scrollview}
                      scrollEventThrottle={200}
                      directionalLockEnabled={true}
                    >
                        { example1 }
                        {/*<View style={{height:GLOBAL_PARAMS._winHeight*0.15,flexDirection:'row',backgroundColor:this.props.screenProps.theme}}>
                          <TouchableOpacity style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                            <Image style={{width:72,height:72}} source={{uri:'dislike'}}/>
                          </TouchableOpacity>
                          <TouchableOpacity style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                            <Image style={{width:72,height:72}} source={{uri:'like'}}/>
                          </TouchableOpacity>
                        </View>*/}
                    </ScrollView>
            </Container>
        );
    }
}
