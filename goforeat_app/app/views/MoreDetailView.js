import React from 'react';
import {View,Modal,Text,StyleSheet,TouchableOpacity,Platform} from 'react-native';
import {Container,Content,Footer,Icon} from 'native-base';
//components
import CommonHeader from '../components/CommonHeader';
import Swiper from '../components/Swiper';
//styles
import HomePageStyles from '../styles/homepage.style';
//language
import i18n from '../language/i18n';

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
    elevation: 0
  }
})

const MoreDetailView = props => {
  let {item} = props.navigation.state.params;
  let {language} = props.screenProps;
  return (
    <Container>
      <CommonHeader title={i18n[language].foodDetail} {...props}/>
      <Content>
        <Swiper adDetail={item.extralImage}/>
        <View style={styles.content_view}>
          <Text style={styles.title}>{item.foodName}</Text>
          <Text style={styles.content}>{item.foodBrief}</Text>
        </View>
        <View style={HomePageStyles.AddPriceView}>
        <View style={HomePageStyles.AddPriceViewPriceContainer}>
          <Text allowFontScaling={false} style={HomePageStyles.AddPriceViewPriceUnit}>HKD</Text>
          <Text allowFontScaling={false} style={HomePageStyles.AddPriceViewPrice}>{item.price}</Text>
          <Text allowFontScaling={false} style={HomePageStyles.AddPriceViewOriginPrice}>HKD {item.originPrice}</Text>
          <View style={HomePageStyles.AddPriceViewStriping}/>
        </View>

      </View>
      </Content>
      <Footer style={styles.footer}>
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <Icon name="md-close-circle" style={styles.close_btn}/>
        </TouchableOpacity>
      </Footer>
    </Container>
  )  
}

export default MoreDetailView;