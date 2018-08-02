import {
  StyleSheet
} from 'react-native';
import GLOBAL_PARAMS from '../utils/global_params';

export default StyleSheet.create({
  payLeftImage: {
    width: GLOBAL_PARAMS.em(20),
    height: GLOBAL_PARAMS.em(20),
    marginRight: GLOBAL_PARAMS.em(11.5),
  },
  payRightImage: {
    width: GLOBAL_PARAMS.em(20),
    height: GLOBAL_PARAMS.em(20),
    marginRight: GLOBAL_PARAMS.em(6)
  },
  creditcardView: {
    height: GLOBAL_PARAMS.em(44),
    justifyContent: 'center',
    marginLeft: GLOBAL_PARAMS.em(15),
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  creditcardText: {
    color: '#666666',
    fontSize: GLOBAL_PARAMS.em(14),
  }
})