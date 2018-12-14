import { StyleSheet, Platform } from "react-native";
import { em } from "../utils/global_params";

export default StyleSheet.create({
  UserInfoContent: {
    backgroundColor: "#efefef"
  },
  FinishBtn: {
    paddingRight: 10
  },
  FinishText: {
    color: "#fff"
  },
  AvatarView: {
    padding: em(10),
    justifyContent: "center",
    alignItems: "center"
  },
  AvatarImg: {
    width: em(80),
    height: em(80),
    borderRadius: em(40)
  },
  AccountDisable: {
    color: "#ccc"
  },
  ChangeBtnContainer: {
    padding: em(10)
  },
  ChangeBtn: {
    color: "#333"
  },
  Segment: {
    backgroundColor: "transparent"
  },
  SegmentActiveBtn: {
    backgroundColor: "#ff630f",
    borderColor: "#ff630f",
    paddingLeft: em(8),
    paddingRight: em(8)
  },
  SegmentDefaultBtn: {
    backgroundColor: "#fff",
    borderColor: "#ff630f",
    paddingLeft: em(8),
    paddingRight: em(8)
  },
  SegmentActiveText: {
    color: "#fff",
    fontSize: em(16)
  },
  SegmentDefaultText: {
    color: "#333",
    fontSize: em(16)
  }
});
