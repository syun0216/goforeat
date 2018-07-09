import React from 'react';
import {TouchableOpacity,Text,StyleSheet,View} from 'react-native';
import PropTypes from 'prop-types';
import {Icon} from 'native-base';
//components
import Divider from '../components/Divider';
//utils
import Colors from '../utils/Colors';
import GLOBAL_PARAMS from '../utils/global_params';

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: Colors.main_white,
    height: 50,
    width: GLOBAL_PARAMS._winWidth,
    padding:10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#edebf4',
    borderTopWidth: 1,
    borderTopColor: '#edebf4',
  },
  itemText: {
    fontSize: 16,
    color: Colors.fontBlack,
  },
  itemArrow: {
    fontSize: 20,
    color: Colors.fontBlack
  }
});

const CommonItem = ({content,isEnd,hasRightIcon,clickFunc,style}) => (
  <View>
    <TouchableOpacity style={[styles.itemContainer,style]} onPress={() => clickFunc()}>
      <Text numberOfLines={1} style={styles.itemText}>{content}</Text>
      {hasRightIcon ? <Icon name="ios-arrow-forward-outline" style={styles.itemArrow}/> : null}
    </TouchableOpacity>
    {isEnd ? <Divider bgColor='#edebf4'/> : null}
  </View>
);

CommonItem.defaultProps = {
  content: '内容',
  isEnd: false,
  hasRightIcon: true,
  clickFunc: () => {},
  style: {}
};

CommonItem.propsType = {
  content: PropTypes.String,
  isEnd: PropTypes.bool,
  hasRightIcon: PropTypes.bool,
  clickFunc: PropTypes.func,
  style: PropTypes.object
}

export default CommonItem;