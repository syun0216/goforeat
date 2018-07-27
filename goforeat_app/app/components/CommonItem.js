import React from 'react';
import {TouchableOpacity,StyleSheet,View} from 'react-native';
import PropTypes from 'prop-types';
import {Icon} from 'native-base';
//components
import Divider from '../components/Divider';
import Text from './UnScalingText';
//utils
import Colors from '../utils/Colors';
import GLOBAL_PARAMS from '../utils/global_params';

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: Colors.main_white,
    height: 60 * (GLOBAL_PARAMS._winWidth/375),
    width: GLOBAL_PARAMS._winWidth,
    padding:10,
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
    alignItems:'center'
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  itemIcon: {
    fontSize: 20,
    color: '#333',
    marginRight: 10,
  }
});

const CommonItem = ({content,isEnd,hasRightIcon,rightIcon,leftIcon,hasLeftIcon,clickFunc,style,contentStyle,disabled}) => (
  <View>
    <TouchableOpacity disabled={disabled} style={[styles.itemContainer,style]} onPress={() => clickFunc()}>
      <View style={styles.itemLeftView}>
        {hasLeftIcon ? leftIcon:null}
        <Text numberOfLines={1} style={[styles.itemText,contentStyle]}>{content}</Text>
      </View>
      {hasRightIcon ? rightIcon : null}
    </TouchableOpacity>
    {isEnd ? <Divider bgColor='#edebf4'/> : null}
  </View>
);

CommonItem.defaultProps = {
  content: '内容',
  isEnd: false,
  hasRightIcon: true,
  rightIcon: (<Icon name="ios-arrow-forward-outline" style={styles.itemIcon}/>),
  hasLeftIcon: false,
  leftIcon:(<Icon name="md-alert" style={styles.itemIcon}/>),
  clickFunc: () => {},
  style: {},
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