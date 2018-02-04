import React from 'react'
import PropTypes from 'prop-types'
import {View,Text,StyleSheet,Image} from 'react-native'
import Swiper from 'react-native-swiper'
import GLOBAL_PARAMS from '../utils/global_params'


const styles = StyleSheet.create({
  wrapper: {
    height:250,
  },
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5',
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9',
  },
  img: {
    width:GLOBAL_PARAMS._winWidth,
    height:250
  },
  activeDot:{}
})

const GoodsSwiper = () => (
  <Swiper style={styles.wrapper} autoplay
    paginationStyle={{position:'absolute',bottom:15,marginLeft:200}}
    dotStyle={{width: 10, height: 10, borderRadius: 5, marginLeft: 10,opacity:0.5}}
    dotColor="#fafafa" activeDotColor="white" activeDotStyle={{width: 25, height: 10, borderRadius: 5, marginLeft: 10,opacity:0.8}}>
    <View>
      <Image style={styles.img} source={require('../asset/s1.png')}/>
      {/* <Text style={styles.text}>Hello Swiper</Text> */}
    </View>
    <View>
      <Image style={styles.img} source={require('../asset/s2.png')}/>
    </View>
    <View>
      <Image style={styles.img} source={require('../asset/s3.png')}/>
    </View>
    <View>
      <Image style={styles.img} source={require('../asset/s4.png')}/>
    </View>
  </Swiper>
)

// GoodsSwiper.defaultProps({
//   imgArr:[]
// })

export default GoodsSwiper
