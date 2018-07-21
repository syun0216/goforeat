import {StyleSheet} from 'react-native';
import GLOBAL_PARAMS from '../utils/global_params';

export default StyleSheet.create({
  header: {
    backgroundColor: '#fff',
    borderBottomWidth: 0
  },
  CardImageContainer: {
    position: 'relative',
    margin: 33/2,
    width: GLOBAL_PARAMS._winWidth - 33,
    borderRadius: 5,
    backgroundColor: '#fff'
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
  }
})