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
    margin: 33/2,
    width: GLOBAL_PARAMS._winWidth - 33,
    borderRadius: 5,
    backgroundColor: '#fff'
  },
  EyeBtn: {
    position: "absolute",
    padding: 10,
    top: Platform.OS=="android"?32/2:29/2,
    left: 166/2,
    zIndex: 100
  },
  EyeImage: {
    width: 44/2,
    height: 29/2
  },
  CardImage: {
    width: GLOBAL_PARAMS._winWidth - 33,
    height: 249/2
  },
  CardInfo: {
    position: "absolute",
    top: 49/2,
    left: 79/2
  },
  CardType: {
    color: '#fff',
    marginBottom: 18
  },
  CardNumber: {
    color: '#fff',
    fontSize: 26
  },
  BottomInfo: {
    fontSize: 12,
    color:'#999999',
    textAlign: 'center'
  },
  Footer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    elevation: 0,
    alignItems: 'center',
    height: 40
  },
  FooterBtn: {
    height: 40,
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: 'center',
  }
})