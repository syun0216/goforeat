import {StyleSheet,Platform} from 'react-native';
import GLOBAL_PARAMS from '../utils/global_params';

export default StyleSheet.create({
  header: {
    backgroundColor: '#fff',
    borderBottomWidth: 0,
    elevation: 0
  },
  CardImageContainer: {
    position: 'relative',
    margin: GLOBAL_PARAMS.em(33/2),
    width: GLOBAL_PARAMS._winWidth - 33,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  EyeBtn: {
    position: "absolute",
    padding: GLOBAL_PARAMS.em(10),
    top: Platform.OS=="android"?32/2:29/2,
    left: GLOBAL_PARAMS.em(166),
    zIndex: 100
  },
  EyeImage: {
    width: GLOBAL_PARAMS.em(44)/2,
    height: GLOBAL_PARAMS.em(29)/2
  },
  CardImage: {
    width: GLOBAL_PARAMS._winWidth - 33,
    height: GLOBAL_PARAMS.em(255/2)
  },
  CardInfo: {
    position: "absolute",
    top: GLOBAL_PARAMS.em(49)/2,
    left: GLOBAL_PARAMS.em(79)/2
  },
  CardType: {
    color: '#fff',
    marginBottom: GLOBAL_PARAMS.em(18)
  },
  CardNumber: {
    color: '#fff',
    fontSize: GLOBAL_PARAMS.em(26)
  },
  BottomInfo: {
    fontSize: GLOBAL_PARAMS.em(12),
    color:'#999999',
    textAlign: 'center'
  },
  Footer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    elevation: 0,
    alignItems: 'center',
    height: GLOBAL_PARAMS.em(40)
  },
  FooterBtn: {
    height: GLOBAL_PARAMS.em(40),
    paddingLeft: GLOBAL_PARAMS.em(10),
    paddingRight: GLOBAL_PARAMS.em(10),
    justifyContent: 'center',
  }
})