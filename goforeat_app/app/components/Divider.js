import React from 'react'
import {View} from 'react-native'
import PropTypes from 'prop-types'
//utils
import GLOBAL_PARAMS from '../utils/global_params';
import Colors from '../utils/Colors';

const Divider = ({height,bgColor}) => (
  <View style={{width: GLOBAL_PARAMS._winWidth,height:height,backgroundColor:bgColor}} />
)

Divider.defaultProps = {
  height:10,
  bgColor: Colors.bgGray
}

Divider.propTypes = {
  height: PropTypes.number,
  bgColor: PropTypes.string
}

export default Divider
