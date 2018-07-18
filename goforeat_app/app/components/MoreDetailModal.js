import React from 'react';
import PropTypes from 'prop-types';
import {View,Modal,Text,StyleSheet,TouchableOpacity,Image,Platform} from 'react-native';
import {Container,Content,Footer,Icon} from 'native-base';
//components
import CommonHeader from './CommonHeader';
import Swiper from './Swiper';

const styles = StyleSheet.create({
  content_view: {
    padding: 10,
  },
  title: {
    fontSize: 20,
    color: '#111',
    fontWeight:'bold',
    marginBottom:11,
  },
  content: {
    fontSize: 14,
    color:'#999999',
    textAlign:'justify',
    lineHeight:Platform.OS =='ios'? 20 : 25
  },
  close_btn: {
    fontSize: 34,
    color: '#ff630f'
  },
  footer: {
    backgroundColor: '#fff',
    borderTopWidth: 0,
  }
})

const MoreDataModal = props => {
  return (
    <Modal animationType={"slide"}
    transparent={false}
    visible={props.modalVisible}
    onRequestClose={() => this.props.closeFunc()}>
      <Container>
        <CommonHeader title="詳情" {...props}/>
        <Content>
          <Swiper adDetail={props.images}/>
          <View style={styles.content_view}>
            <Text style={styles.title}>{props.foodtitle}</Text>
            <Text style={styles.content}>{props.content}</Text>
          </View>
        </Content>
        <Footer style={styles.footer}>
          <TouchableOpacity onPress={() => props.closeFunc()}>
            <Icon name="md-close-circle" style={styles.close_btn}/>
          </TouchableOpacity>
        </Footer>
      </Container>
    </Modal>
  )  
}

MoreDataModal.propsType = {
  content: PropTypes.string,
  modalVisible: PropTypes.bool,
  closeFunc: PropTypes.func,
  foodtitle: PropTypes.string,
  images: PropTypes.array
}

export default MoreDataModal;