import React,{PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Modal,TouchableOpacity,StyleSheet,Platform, Animated, Easing} from 'react-native';
import {Content,Icon, Header, Item, Input,Button, Container} from 'native-base';
import Text from './UnScalingText';
import CustomizeContainer from './CustomizeContainer';
//components
import CommonHeader from './CommonHeader';
//utils
import GLOBAL_PARAMS,{em} from '../utils/global_params';
import Colors from '../utils/Colors';

const styles = StyleSheet.create({
  closeIcon: {
    width:  GLOBAL_PARAMS.em(50),
    height: GLOBAL_PARAMS.em(40),
    alignItems:'center',
    marginLeft:-5,
    justifyContent:'center'
  },
  toastContent: {
    position: 'absolute',
    zIndex: 999,
    padding: em(15),
    backgroundColor: "#000",
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: em(8),
    top: '50%',
  },
  toastText: {
    color: Colors.main_white,
    fontSize: em(20),
    fontWeight: 'bold'
  }
});


class CommonModal extends PureComponent {

  state = {
    isToastShow: false,
    toastOpacity: new Animated.Value(0),
    toastText: ''
  }

  //logic
  showToast = (text, during=1000) => {
    Animated.timing(this.state.toastOpacity, {
      toValue: 0.8,
      duration: 300,
      easing: Easing.linear
    }).start();
    this.setState({
      toastText: text
    }, () => {
      let _timer = setTimeout(() => {
        Animated.timing(this.state.toastOpacity, {
          toValue: 0,
          duration: 300,
          easing: Easing.linear
        }).start();
        clearTimeout(_timer);
      }, during)
    });
  }

  _renderToastUtil() {
    return (
      <Animated.View style={[styles.toastContent, {opacity: this.state.toastOpacity}]}>
        <Text style={styles.toastText}>{this.state.toastText}</Text>
      </Animated.View>
    )
  }

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
    const { modalVisible, closeFunc, type, animationType } = this.props;
    return (
      <Modal 
      transparent
      style={{ zIndex: 1 }}
      animationType={animationType}
      transparent={false}
      visible={modalVisible}
      onRequestClose={() => {
        closeFunc && closeFunc();
      }}>
        {this._renderToastUtil()}
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
  animationType: PropTypes.string
}

CommonModal.defaultProps = {
  modalVisible: false,
  isHeaderShow: true,
  isSearchHeader: false,
  type: 'default',
  CustomHeader: null,
  isCustomHeader: false,
  animationType: 'slide'
}

export default CommonModal;

