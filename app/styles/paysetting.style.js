import { StyleSheet } from "react-native";
import GLOBAL_PARAMS, { em } from "../utils/global_params";

export default StyleSheet.create({
  payLeftImage: {
    width: em(20),
    height: em(20),
    marginRight: em(11.5),
    marginLeft: em(5),
  },
  payRightImage: {
    width: em(20),
    height: em(20),
    marginRight: em(6)
  },
  creditcardView: {
    height: em(44),
    justifyContent: "center",
    paddingLeft: em(15),
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    backgroundColor: "#fff"
  },
  creditcardText: {
    color: "#666666",
    fontSize: em(14)
  }
});
