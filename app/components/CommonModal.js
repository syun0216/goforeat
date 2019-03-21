import React,{PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Modal,TouchableOpacity,StyleSheet} from 'react-native';
import {Content,Icon, Header, Item, Input,Button, Container} from 'native-base';
import Text from './UnScalingText';
import CustomizeContainer from './CustomizeContainer';
//components
import CommonHeader from './CommonHeader';
//utils
import GLOBAL_PARAMS from '../utils/global_params';

const styles = StyleSheet.create({
  closeIcon: {
    width:  GLOBAL_PARAMS.em(50),
    height: GLOBAL_PARAMS.em(40),
    alignItems:'center',
    marginLeft:-5,
    justifyContent:'center'
  }
});


class CommonModal extends PureComponent {

  render() {
    const { modalVisible, closeFunc, getSearchContent, title, children, isHeaderShow, isSearchHeader } = this.props;
    const CloseIcon = () => (
      <TouchableOpacity style={styles.closeIcon} onPress={closeFunc}>
        <Icon name="md-close" style={[{ fontSize: GLOBAL_PARAMS.em(22), color: '#fff' }]}/>
      </TouchableOpacity>
    )
    return (
      <Modal 
      transparent
      style={{ zIndex: 1 }}
      animationType={"slide"}
      transparent={false}
      visible={modalVisible}
      onRequestClose={() => {
        closeFunc && closeFunc();
      }}>
        <Container>
          {isHeaderShow && <CommonHeader title={title} canBack leftElement={<CloseIcon />}></CommonHeader>}
          {isSearchHeader && (
            <Header searchBar rounded style={{backgroundColor: '#fff'}} androidStatusBarColor="#666">
              <Item>
                <Icon name="ios-search" />
                <Input placeholder="輸入要搜索的地點" allowFontScaling={false}
                clearButtonMode="while-editing"
                onChangeText={place => getSearchContent && getSearchContent(place)}
                />
              </Item>
              <Button transparent onPress={() => {
                closeFunc && closeFunc();
              }}>
                <Text>關閉</Text>
              </Button>
            </Header>
          )}
          <Content bounces={false}>
            {children}
          </Content>
        </Container>
      </Modal>
    )
  }
}

CommonModal.propsType = {
  title: PropTypes.string,
  modalVisible: PropTypes.bool,
  closeFunc: PropTypes.func,
  getSearchContent: PropTypes.func,
  isHeaderShow: PropTypes.bool,
  isSearchHeader: PropTypes.bool,
}

CommonModal.defaultProps = {
  modalVisible: false,
  isHeaderShow: true,
  isSearchHeader: false
}

export default CommonModal;

