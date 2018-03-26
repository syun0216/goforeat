import React from 'react'
import PropTypes from 'prop-types'
import {View,Text,StyleSheet,Image} from 'react-native'
import Swiper from 'react-native-swiper'
import GLOBAL_PARAMS from '../utils/global_params'
import Colors from '../utils/Colors'

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
    height:250,
    // borderRadius:15,
    // borderWidth: 1,
    // borderColor:Colors.main_gray
  },
  activeDot:{}
})

const img_arr = [
  {style:styles.img,position: require('../asset/s1.png')},
  {style:styles.img,position: require('../asset/s2.png')},
  {style:styles.img,position: require('../asset/s3.png')},
  {style:styles.img,position: require('../asset/s4.png')},
]

const GoodsSwiper = (props) => {
  // console.log(props);
  return (<Swiper style={styles.wrapper}
    paginationStyle={{position:'absolute',bottom:15,marginLeft:200}}
    dotStyle={{width: 10, height: 10, borderRadius: 5, marginLeft: 10,opacity:0.5}}
    dotColor="#fafafa" activeDotColor="white" activeDotStyle={{width: 25, height: 10, borderRadius: 5, marginLeft: 10,opacity:0.8}}>
    {props.adDetail.map((item,idx) => (
      <View key={idx}>
        <Image style={styles.img} source={{uri: item.image}}/>
      </View>
    ))}
  </Swiper>
)}

// GoodsSwiper.defaultProps({
//   imgArr:[]
// })

export default GoodsSwiper
