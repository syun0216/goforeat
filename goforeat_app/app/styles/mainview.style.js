import {
  StyleSheet,
  Platform
} from 'react-native';
import GLOBAL_PARAMS from '../utils/global_params';
import Colors from '../utils/Colors';

export default StyleSheet.create({
  //tabbar
  tabBarImage: {
    width: GLOBAL_PARAMS.em(22),
    height: GLOBAL_PARAMS.em(21)
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
    marginTop: GLOBAL_PARAMS.em(10)
  },
  drawerContent: {
    backgroundColor: Colors.main_white
  },
  drawerInnerContent: {
    backgroundColor: Colors.main_white,
    marginTop: GLOBAL_PARAMS.em(30)
  },
  drawerItemBtn: {
    padding: GLOBAL_PARAMS.em(20),
    flexDirection: "row",
    alignItems: "center",
  },
  drawerItemImage: {
    width: GLOBAL_PARAMS.em(22),
    height: GLOBAL_PARAMS.em(22)
  },
  drawerItemIcon: {
    color: '#EE6723',
    fontSize: GLOBAL_PARAMS.em(22)
  },
  drawerItemText: {
    fontSize: Platform.OS == 'ios' ? GLOBAL_PARAMS.em(20) : GLOBAL_PARAMS.em(18),
    textAlignVertical: "center",
    marginLeft: GLOBAL_PARAMS.em(15),
    color: Colors.fontBlack,
    fontWeight: '700',
  }
})