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
  },
  drawerTopImage: {
    width: GLOBAL_PARAMS._winWidth * 0.5,
    height: GLOBAL_PARAMS._winHeight * 0.1,
    marginTop: em(10)
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
    fontSize: em(22)
  },
  drawerItemText: {
    fontSize: Platform.OS == 'ios' ? em(20) : em(18),
    textAlignVertical: "center",
    marginLeft: em(15),
    color: Colors.fontBlack,
    fontWeight: '700',
  }
})