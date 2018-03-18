import React from 'react';
import PropTypes from 'prop-types';
import {View,Text,FlatList,Image} from 'react-native';
// utils 
import GLOBAL_PARAMS from '../utils/global_params';

const RecommendShop = (props) => {
  let _recommendShopView = (item,idx) => {
    console.log(item)
    return (
    <View style={{width: GLOBAL_PARAMS._winWidth/3,height: 200,marginRight: idx != props.length ? 10 : 0}}>
      <Image source={{uri: item.image}} style={{width: GLOBAL_PARAMS._winWidth/3,height:150}}/>
      <View style={{justifyContent: 'center',alignItems: 'center',}}>
        <Text>{item.name}</Text>
      </View>
    </View>
  )}
  return (
    <FlatList
      data={props}
      horizontal
      renderItem={({item,idx}) => _recommendShopView(item,idx)}
      keyExtractor={(item, index) => index}
      />
  )
}

RecommendShop.propsType = {
  list: PropTypes.Array
}

RecommendShop.defaultProps = {
  list: []
}

export default RecommendShop;