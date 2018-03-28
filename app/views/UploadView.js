import React, { PureComponent } from "react";
import { Container, Content,Button } from "native-base";
import {
  StyleSheet,
  Text,
  View,
  PixelRatio,
  TouchableOpacity,
  Image,
  Platform
} from "react-native";
import CommonHeader from "../components/CommonHeader";
import ImagePicker from "react-native-image-picker";
import RNFS from 'react-native-fs';
//api
import api from '../api';
//utils
import GLOBAL_PARAMS from '../utils/global_params';
import ToastUtil from '../utils/ToastUtil';
import Colors from '../utils/Colors';
//components
import Loading from '../components/Loading';

export default class UploadView extends PureComponent {
  state = {
    photoData: null,
    isUpload: false
  };

  selectPhotoTapped() {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true
      }
    };

    ImagePicker.showImagePicker(options, async (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          photoData: response
        });
      }
    });
  }

  uploadImage = () => {
    if(this.state.photoData === null) {
      ToastUtil.showWithMessage("請先選擇圖片")
      return;
    }
    this.setState({
      isUpload: true
    })
    api.uploadBillImg(this.state.avatarSource).then(data => {
      if(data.status === 200 && data.data.ro.ok) {
        console.log(data)
        ToastUtil.showWithMessage("上傳成功");
        this.setState({
          isUpload: false,
          photoData: null,
          avatarSource: null
        })
      }
    },() => {
      ToastUtil.showWithMessage("上傳失敗，請點擊重試");
    })
  }

  render() {
    return (
      <Container>
        {this.state.isUpload ? <Loading message="正在上傳中..."/> : null}
        <CommonHeader title="上傳發票" canBack {...this['props']}/>
        <View style={styles.container}>
          <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
            <View style={[styles.avatar, styles.avatarContainer, {marginBottom: 20}]}>
            { this.state.photoData === null ? <Text>點擊選擇圖片</Text> :
              <Image style={styles.avatar} source={{uri: this.state.photoData.uri}} />
            }
            </View>
          </TouchableOpacity>
          <Button block style={{margin:10,backgroundColor: this.props.screenProps.theme}} onPress={this.uploadImage}>
            <Text style={{color: Colors.main_white}}>上傳</Text>
          </Button>
        </View>
      </Container>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  avatarContainer: {
    borderColor: '#9B9B9B',
    borderWidth: 1 / PixelRatio.get(),
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatar: {
    width: GLOBAL_PARAMS._winWidth,
    height: GLOBAL_PARAMS._winWidth
  }
});