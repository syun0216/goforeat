import {StyleSheet,Platform} from 'react-native';
import GLOBAL_PARAMS from '../utils/global_params';
import Colors from '../utils/Colors';

export default StyleSheet.create({
  //tabbar
  tabBarImage: {
    width: 22,
    height: 21
  },
  //drawer
  drawerTopContainer: {
    height: GLOBAL_PARAMS._winHeight * 0.2,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  drawerTopImage: {
    width: GLOBAL_PARAMS._winWidth*0.5,
    height: GLOBAL_PARAMS._winHeight * 0.1,
    marginTop: 10
  },
  drawerContent:{
    backgroundColor: Colors.main_white
  },
  drawerInnerContent: {
    backgroundColor: Colors.main_white,marginTop: 30
  },
  drawerItemBtn: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  drawerItemImage:{
    width: 22,
    height: 22
  },
  drawerItemText: {
    fontSize: Platform.OS == 'ios'?20:18,
    textAlignVertical: "center",
    marginLeft: 15,
    color: Colors.fontBlack,
    fontWeight: '700',
  }
})