import React from 'react'
import PropTypes from 'prop-types'
import {View,Text,TouchableOpacity,StyleSheet} from 'react-native'

const styles = StyleSheet.create({
  filterContainer:{
    height:250,
    flex:1,
    flexDirection:'row'
  },
  leftContainer: {
    width: 80,
    height:250,
    display:'flex'
  },
  leftContainerItem: {
    flex:1,
    borderColor:'#ccc',
    borderRightWidth:1,
    justifyContent:'center',
    alignItems:'center'
  },
  rightContainer: {
    flex:1,
    height:250
  }
})

const Dropdownfilter = () => (
  <View style={styles.filterContainer}>
    <View style={styles.leftContainer}>
      <View style={styles.leftContainerItem}><Text>123</Text></View>
      <View style={styles.leftContainerItem}><Text>123</Text></View>
      <View style={styles.leftContainerItem}><Text>123</Text></View>
    </View>
    <View style={styles.rightContainer}>

    </View>
  </View>
)

export default Dropdownfilter
