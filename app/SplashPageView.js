import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';

import Swiper from 'react-native-swiper';

const styles = StyleSheet.create({
  wrapper: {
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
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  }
})

const SplashPageView = (props) => {
  console.log(props)
    return (
      <Swiper style={styles.wrapper} loop={false}>
        <View style={styles.slide1}>
          <Text style={styles.text}>Goforeat</Text>
        </View>
        <View style={styles.slide2}>
          <Text style={styles.text}>HK</Text>
        </View>
        <View style={styles.slide3} >
          <TouchableOpacity onPress={() => props.navigation.navigate('Home')}>
            <Text style={styles.text}>Go to Home Page</Text>
          </TouchableOpacity>
        </View>
      </Swiper>
    )
}

export default SplashPageView
