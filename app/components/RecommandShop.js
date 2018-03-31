import React from "react";
import PropTypes from "prop-types";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { Spinner } from "native-base";
import Image from "react-native-image-progress";
import ProgressBar from "react-native-progress/Bar";
// utils
import GLOBAL_PARAMS from "../utils/global_params";

const RecommendShop = props => {
  let _toRecommendShopDetail = (item) => {
    props.navigation.navigate('Content',{
      data:item,
      kind:'canteen'
    })
  }
  let _recommendShopView = (item, idx) => {
    return (
      <TouchableOpacity
        style={{
          width: GLOBAL_PARAMS._winWidth / 3,
          height: 140,
          marginRight: idx != props.length - 1 ? 10 : 0
        }}
        onPress={() => _toRecommendShopDetail(item)}
      >
        <Image
          source={{ uri: item.image }}
          style={{ width: GLOBAL_PARAMS._winWidth / 3, height: 110 }}
          indicator={(ProgressBar)}
          indicatorProps={{ color: props.screenProps.theme, width: GLOBAL_PARAMS._winWidth / 4 }}
        />
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: 5
          }}
        >
          <Text numberOfLines={1}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <FlatList
      data={props.list}
      horizontal
      renderItem={({ item, idx }) => _recommendShopView(item, idx)}
      keyExtractor={(item, index) => index}
    />
  );
};

RecommendShop.propsType = {
  list: PropTypes.Array
};

RecommendShop.defaultProps = {
  list: []
};

export default RecommendShop;
