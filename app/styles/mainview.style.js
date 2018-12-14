import { StyleSheet, Platform } from "react-native";
import GLOBAL_PARAMS, { em } from "../utils/global_params";
import Colors from "../utils/Colors";

export default StyleSheet.create({
  //tabbar
  tabBarImage: {
    width: em(22),
    height: em(21)
  },
  //drawer
  drawerTopContainer: {
    height: GLOBAL_PARAMS._winHeight * 0.2,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: GLOBAL_PARAMS.isIphoneX() ? GLOBAL_PARAMS.iPhoneXTop : 0
  },
  drawerTopImage: {
    width: em(65),
    height: em(65),
    marginTop: em(5),
    borderRadius: em(65 / 2),
    borderWidth: 1,
    borderColor: "#fff",
    marginLeft: em(10)
  },
  drawerTopImageContainer: {
    flex: 1,
    marginLeft: em(15),
    justifyContent: "space-between",
    height: em(70),
    flexDirection: "row",
    alignItems: "center"
  },
  topName: {
    color: "#fff",
    fontSize: em(20)
  },
  topNickName: {
    color: "#fff",
    fontSize: em(13)
  },
  topLoginBtn: {
    height: em(30),
    justifyContent: "center"
  },
  loginBtnText: {
    color: "#F8E71C",
    fontSize: em(16),
    marginRight: em(10),
    fontWeight: "800"
  },
  loginBtnArrow: {
    color: "#fff",
    fontSize: em(16),
    fontWeight: "800",
    marginBottom: em(-5)
  },
  drawerContent: {
    backgroundColor: Colors.main_white
  },
  drawerInnerContent: {
    backgroundColor: Colors.main_white
  },
  drawerItemBtn: {
    padding: em(20),
    flexDirection: "row",
    alignItems: "center"
  },
  drawerItemImage: {
    width: em(22),
    height: em(22)
  },
  drawerItemIcon: {
    color: "#EE6723",
    fontSize: em(25)
  },
  drawerItemText: {
    fontSize: Platform.OS == "ios" ? em(20) : em(18),
    textAlignVertical: "center",
    marginLeft: em(25),
    color: Colors.fontBlack,
    fontWeight: "700"
  }
});
