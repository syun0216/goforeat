import React from "react";
import PropTypes from "prop-types";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import FastImage from "react-native-fast-image";
import Swiper from "react-native-swiper";
//utils
import GLOBAL_PARAMS, { em } from "../utils/global_params";
import NavigationService from '../utils/NavigationService';

const styles = StyleSheet.create({
  wrapper: {
    width: GLOBAL_PARAMS._winWidth - em(16),
    height: GLOBAL_PARAMS.em(90)
  },
  img: {
    width: GLOBAL_PARAMS._winWidth - em(16),
    height: GLOBAL_PARAMS.em(90),
    borderRadius: em(5),
    alignSelf: "center"
    // borderColor:Colors.main_gray
  },
  dot: {
    width: em(4),
    height: em(4),
    borderRadius: em(2),
    marginLeft: em(2.5),
    opacity: 0.5
  },
  activeDot: {
    width: em(18),
    height: em(4),
    borderRadius: em(2),
    marginLeft: em(2.5)
  }
});

const GoodsSwiper = props => {
  return (
    <View style={{height: em(108),paddingTop: em(15)}}>
      <Swiper
        autoplay
        loop
        paginationStyle={{ position: "absolute", bottom: 11 }}
        dotStyle={styles.dot}
        dotColor="#fafafa"
        activeDotColor="white"
        activeDotStyle={styles.activeDot}
        showsPagination
      >
        {props.adDetail.length > 0 &&
          props.adDetail.map((item, idx) => (
            <TouchableOpacity key={idx} onPress={
              () => NavigationService.navigate("Content", {
                data: item,
                kind: "warning"
              })
            }>
              <FastImage
                resizeMode={FastImage.resizeMode.cover}
                style={styles.img}
                source={{ uri: item.image }}
              />
            </TouchableOpacity>
          ))}
      </Swiper>
    </View>
  );
};

// GoodsSwiper.defaultProps({
//   imgArr:[]
// })

GoodsSwiper.propTypes = {
  adDetail: PropTypes.array
};

GoodsSwiper.defaultProps = {
  adDetail: []
};

export default GoodsSwiper;
