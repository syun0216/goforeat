import {Dimensions} from 'react-native'

const GLOBAL_PARAMS = {
  _winWidth:Dimensions.get('window').width,
  _winHeight:Dimensions.get('window').height,
  httpStatus: {
    LOADING: 0,
    LOAD_SUCCESS: 1,
    LOAD_FAILED: 2,
    NO_MORE_DATA: 3
  },
}

module.exports = GLOBAL_PARAMS
