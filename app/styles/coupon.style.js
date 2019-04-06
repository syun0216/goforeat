import { Platform, StyleSheet } from "react-native";
import GLOBAL_PARAMS  from "../utils/global_params";

export default StyleSheet.create({
  CouponContainer: {
    backgroundColor: "#efefef",
    padding: 20,
    paddingLeft: 12,
    paddingRight: 12
  },
  CouponItemView: {
    height: Platform.OS == 'ios' ? 120 : 135,
    borderRadius: 8,
    backgroundColor: "#fff",
    margin: 10
  },
  ItemTop: {
    backgroundColor: "#ef7333",
    height: 80,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    position: "relative",
    paddingLeft: 12,
    paddingRight: 12,
    flexDirection: "row",
    zIndex: 100
  },
  PriceContainer: {
    flexDirection: "row",
    height: 80,
    alignItems: "center"
  },
  Unit: {
    color: "#fff",
    fontSize: 20,
    marginBottom: -20
  },
  Price: {
    color: "#fff",
    fontSize: 60,
    fontWeight: "800"
  },
  Content: {
    height: 80,
    justifyContent: "center",
    marginLeft: 20,
    position: "absolute",
    left: 92
  },
  ContentTop: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 5
  },
  ContentBottom: {
    fontSize: 24,
    color: "#fff"
  },
  CouponBorder: {
    width: "100%",
    marginTop: -5
  },
  ItemBottom: {
    backgroundColor: "#fff",
    height: 40,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 12,
    paddingRight: 12
  },
  ItemBottomLeft: {
    color: "#ef7333",
    fontSize: 14,
    marginTop: -5
  },
  ItemBottomRight: {
    color: "#999",
    fontSize: 14,
    marginTop: -5
  },
  Status: {
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 12,
    zIndex: 10
  },
  UseBtn: {
    width: 152/ 2,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14
  },
  BtnText: {
    fontSize: 14,
    color: "#ef7333"
  },
  StatusImg: {
    width: 70,
    height: 70,
    marginTop: 32,
    marginRight: 8,
    zIndex: 10
  },
  isUsed: {
    backgroundColor: "#c7c7c7"
  },
  isUsedColor: {
    color: "#c7c7c7"
  }
});
