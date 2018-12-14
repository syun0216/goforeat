import { StyleSheet, Platform } from "react-native";
import GLOBAL_PARAMS, { em } from "../utils/global_params";

export default StyleSheet.create({
  header: {
    backgroundColor: "#fff",
    borderBottomWidth: 0,
    elevation: 0
  },
  CardImageContainer: {
    position: "relative",
    margin: em(33 / 2),
    width: GLOBAL_PARAMS._winWidth - 33,
    borderRadius: 5,
    backgroundColor: "#fff"
  },
  EyeBtn: {
    position: "absolute",
    padding: em(10),
    top: Platform.OS == "android" ? 32 / 2 : 29 / 2,
    left: em(166),
    zIndex: 100
  },
  EyeImage: {
    width: em(44 / 2),
    height: em(29 / 2)
  },
  CardImage: {
    width: GLOBAL_PARAMS._winWidth - 33,
    height: Platform.OS === "ios" ? em(255 / 2) : em(140)
  },
  CardInfo: {
    position: "absolute",
    top: em(49 / 2),
    left: em(79 / 2)
  },
  CardType: {
    color: "#fff",
    marginBottom: em(18)
  },
  CardNumber: {
    color: "#fff",
    fontSize: em(26)
  },
  BottomInfo: {
    fontSize: em(12),
    color: "#999999",
    textAlign: "center"
  },
  Footer: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
    elevation: 0,
    alignItems: "center",
    height: GLOBAL_PARAMS.isIphoneX()
      ? em(40 + GLOBAL_PARAMS.iPhoneXBottom)
      : em(40)
  },
  FooterBtn: {
    height: em(40),
    paddingLeft: em(10),
    paddingRight: em(10),
    justifyContent: "center"
  }
});
