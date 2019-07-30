import React from 'react';
import {TouchableOpacity,StyleSheet,View} from 'react-native';
import PropTypes from 'prop-types';
import {Icon} from 'native-base';
//components
import Divider from '../components/Divider';
import Text from './UnScalingText';
//utils
import Colors from '../utils/Colors';
import GLOBAL_PARAMS,{em} from '../utils/global_params';

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: Colors.main_white,
    // height: GLOBAL_PARAMS.widthAuto(55),
    width: GLOBAL_PARAMS._winWidth,
    padding:em(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    // borderTopWidth: 1,
    // borderTopColor: '#E5E5E5',
  },
  itemLeftView: {
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems:'center',
    flexWrap: 'wrap',
    maxWidth: em(220)
  },
  itemText: {
    fontSize: em(16),
    color: '#333',
    lineHeight: em(30)
  },
  itemIcon: {
    fontSize: em(20),
    color: '#333',
    marginRight: em(10),
  }
});

const CommonItem = ({content,isEnd,hasRightIcon,rightIcon,leftIcon,hasLeftIcon,clickFunc,style,leftStyle,contentStyle,disabled}) => {
  // console.log(style);
  return (
  <View>
    <TouchableOpacity disabled={disabled} style={[styles.itemContainer,style]} onPress={() => {
      requestAnimationFrame(() => {
        clickFunc()  
      });
      // clickFunc()  
    }}>
      <View style={[styles.itemLeftView, leftStyle]}>
        {hasLeftIcon ? leftIcon:null}
        <Text style={[styles.itemText,contentStyle]}>{content}</Text>
      </View>
      {hasRightIcon ? rightIcon : null}
    </TouchableOpacity>
    {isEnd ? <Divider bgColor='#efefef' height={em(20)}/> : null}
  </View>
)};

CommonItem.defaultProps = {
  content: '内容',
  isEnd: false,
  hasRightIcon: true,
  rightIcon: (<Icon name="ios-arrow-forward" style={styles.itemIcon}/>),
  hasLeftIcon: false,
  leftIcon:(<Icon name="md-alert" style={styles.itemIcon}/>),
  clickFunc: () => {},
  style: {},
  leftStyle: {},
  contentStyle: {},
  disabled: false
};

CommonItem.propsType = {
  content: PropTypes.String,
  isEnd: PropTypes.bool,
  hasRightIcon: PropTypes.bool,
  rightIcon: PropTypes.element,
  hasLeftIcon: PropTypes.bool,
  leftIcon: PropTypes.element,
  clickFunc: PropTypes.func,
  style: PropTypes.object,
  contentStyle: PropTypes.object,
  disabled: PropTypes.bool
}

export default CommonItem;