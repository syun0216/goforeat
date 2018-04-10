import {Platform,Alert,Linking} from 'react-native'
import ToastUtil from './ToastUtil'

const LinkingUtils = {
  dialPhoneWithNumber(phoneNumber) {
      if (phoneNumber == null || phoneNumber.length == 0) {
          return;
      }

      if (Platform.OS == 'ios'){
          Alert.alert(null
              , '是否撥打電話:' + phoneNumber + '?'
              , [
                  {text: '取消'},
                  {text: '確定', onPress: () => this._dialPhone(phoneNumber)}
              ]
          );
      } else {
          this._dialPhone(phoneNumber);
      }
  },

  _dialPhone(phone) {
      let dialPhoneUrl = "tel:" + phone;
      Linking.canOpenURL(dialPhoneUrl).then(supported => {
          if (!supported) {
              ToastUtil.showWithMessage("不支持撥打電話");
          } else {
              return Linking.openURL(dialPhoneUrl);
          }
      }).catch(error => {
          ToastUtil.showWithMessage("撥打用戶號碼失敗");
      });
  },
}

export default LinkingUtils
