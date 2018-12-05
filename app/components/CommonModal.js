import React,{Component} from 'react';
import PropTypes from 'prop-types';
import {Modal,TouchableOpacity,StyleSheet} from 'react-native';
import {Container,Content,Icon} from 'native-base';
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


class CommonModal extends Component {

  render() {
    const { modalVisible, closeFunc, title, children } = this.props;
    const CloseIcon = () => (
      <TouchableOpacity style={styles.closeIcon} onPress={closeFunc}>
        <Icon name="md-close" style={[{ fontSize: GLOBAL_PARAMS.em(22), color: '#fff' }]}/>
      </TouchableOpacity>
    )
    return (
      <Modal 
      animationType={"slide"}
      transparent={false}
      visible={modalVisible}
      onRequestClose={() => closeFunc()}>
        <Container>
          <CommonHeader title={title} canBack leftElement={<CloseIcon />}></CommonHeader>
          <Content>
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
  closeFunc: PropTypes.func
}

CommonModal.defaultProps = {
  modalVisible: false
}

export default CommonModal;

