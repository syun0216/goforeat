import {
  StyleSheet,
  Platform
} from 'react-native';
import GLOBAL_PARAMS,{em} from '../utils/global_params';
import Colors from '../utils/Colors';

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
    justifyContent: "center",
    paddingTop: GLOBAL_PARAMS.isIphoneX() ? GLOBAL_PARAMS.iPhoneXTop : 0
  },
  drawerTopImage: {
    width: em(50),
    height: em(50),
    marginTop: em(10)
  },
  drawerTopImageContainer: {
    marginLeft: em(30)
  },
  topName: {
    color: '#fff',
    fontSize: em(14),
    marginBottom: em(10),
  },
  topLoginBtn: {
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 5,
    padding: em(10)
  },
  loginBtnText: {
    color: '#fff',
    fontSize: em(14),
    textAlign: 'center'
  },
  drawerContent: {
    backgroundColor: Colors.main_white
  },
  drawerInnerContent: {
    backgroundColor: Colors.main_white,
    marginTop: em(30)
  },
  drawerItemBtn: {
    padding: em(20),
    flexDirection: "row",
    alignItems: "center",
  },
  drawerItemImage: {
    width: em(22),
    height: em(22)
  },
  drawerItemIcon: {
    color: '#EE6723',
    fontSize: em(25)
  },
  drawerItemText: {
    fontSize: Platform.OS == 'ios' ? em(20) : em(18),
    textAlignVertical: "center",
    marginLeft: em(15),
    color: Colors.fontBlack,
    fontWeight: '700',
  }
})