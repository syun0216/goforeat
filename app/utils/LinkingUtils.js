import {Platform,Alert,Linking} from 'react-native'
import ToastUtil from './ToastUtil'

const LinkingUtils = {
  dialPhoneWithNumber(phoneNumber) {
      if (phoneNumber == null || phoneNumber.length == 0) {
          return;
      }

      if (Platform.OS == 'ios'){
          Alert.alert(null
              , '是否拨打电话:' + phoneNumber + '?'
              , [
                  {text: '取消'},
                  {text: '确定', onPress: () => this._dialPhone(phoneNumber)}
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
              ToastUtil.show("不支持拨打电话",1000,'bottom','warning');
          } else {
              return Linking.openURL(dialPhoneUrl);
          }
      }).catch(error => {
          ToastUtil.show("拨打用户号码失败",1000,'bottom','warning');
      });
  },
}

export default LinkingUtils
