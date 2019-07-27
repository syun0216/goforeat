import React,{PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Modal,TouchableOpacity,StyleSheet,Platform, StatusBar} from 'react-native';
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

  _renderSearchMode() {
    const {getSearchContent, children,isSearchHeader,closeFunc} = this.props;
    return (
      <Container>
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
                <Text style={{color: '#333'}}>關閉</Text>
              </Button>
            </Header>
          )}
          <Content bounces={false}>
            {children}
          </Content>
        </Container>
    )
  }

  _renderDefaultMode() {
    const { title, children, isHeaderShow,closeFunc, CustomHeader, isCustomHeader} = this.props;
    const CloseIcon = () => (
      <TouchableOpacity style={styles.closeIcon} onPress={closeFunc}>
        <Icon name="md-close" style={[{ fontSize: GLOBAL_PARAMS.em(22), color: '#fff' }]}/>
      </TouchableOpacity>
    )
    return (
      <CustomizeContainer.SafeView mode={Platform.OS == 'ios' ? 'linear' : 'none'} >
        {isCustomHeader ? CustomHeader : isHeaderShow && <CommonHeader title={title} canBack leftElement={<CloseIcon />}></CommonHeader>}
        <Content bounces={false}>
            {children}
          </Content>
      </CustomizeContainer.SafeView>  
    )
  }

  render() {
    const { modalVisible, closeFunc, type } = this.props;
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
        {
          type == 'default' ? this._renderDefaultMode() : this._renderSearchMode()
        }
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
  type: PropTypes.string,
}

CommonModal.defaultProps = {
  modalVisible: false,
  isHeaderShow: true,
  isSearchHeader: false,
  type: 'default',
  CustomHeader: null,
  isCustomHeader: false
}

export default CommonModal;

