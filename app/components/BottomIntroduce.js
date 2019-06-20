import React from "react";
import { View, TouchableOpacity, Text, Image, Linking } from "react-native";
//styles
import CommonStyle from "../styles/common.style";
import i18n from "../language/i18n";

const BottomIntroduce = props => {
  return (
    <View style={CommonStyle.BottomView}>
      <View style={CommonStyle.DividerView}>
        {/* <View style={CommonStyle.Divider} /> */}
        <Text style={CommonStyle.DividerText}>
          {i18n[props.screenProps.language].follow}
        </Text>
        {/* <View style={CommonStyle.Divider} /> */}
      </View>
      <View style={CommonStyle.BottomViewInner}>
        <TouchableOpacity
          onPress={() => {
            Linking.openURL("https://www.instagram.com/mealtime.hk").catch(
              err => alert(err)
            );
          }}
        >
          <Image
            source={require("../asset/instagram.png")}
            style={CommonStyle.BottomViewInnerImage}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            Linking.openURL(
              "https://www.facebook.com/MealTimeHK"
            ).catch(err => alert(err));
          }}
        >
          <Image
            source={require("../asset/facebook3.png")}
            style={CommonStyle.BottomViewInnerImage}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            Linking.openURL("http://goforeat.hk").catch(err => alert(err));
          }}
        >
          <Image
            source={require("../asset/icon_app.png")}
            style={CommonStyle.BottomViewInnerImage}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BottomIntroduce;
