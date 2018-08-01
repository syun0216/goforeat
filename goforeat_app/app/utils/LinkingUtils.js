import {
    Platform,
    Alert,
    Linking
} from 'react-native'
import ToastUtil from './ToastUtil';
//language
import I18n from '../language/i18n';

const LinkingUtils = {
    dialingToCancelOrder(phoneNumber, language) {
        if (phoneNumber == null || phoneNumber.length == 0) {
            return;
        }
        Alert.alert(null, `${I18n[language].dialingToCancelOrder}(${phoneNumber})`,[
            {
                text: I18n[language].confirm,
                onPress: () => {
                    this._dialPhone(phoneNumber, language);
                }
            }
        ]);
    },
    dialPhoneWithNumber(phoneNumber, language) {
        if (phoneNumber == null || phoneNumber.length == 0) {
            return;
        }

        if (Platform.OS == 'ios') {
            Alert.alert(null, `${I18n[language].dialing}:` + phoneNumber + '?', [{
                    text: I18n[language].cancel
                },
                {
                    text: I18n[language].confirm,
                    onPress: () => this._dialPhone(phoneNumber,language)
                }
            ]);
        } else {
            this._dialPhone(phoneNumber, language);
        }
    },

    _dialPhone(phone, language) {
        let dialPhoneUrl = "tel:" + phone;
        Linking.canOpenURL(dialPhoneUrl).then(supported => {
            if (!supported) {
                ToastUtil.showWithMessage(I18n[language].notSupportDialing);
            } else {
                return Linking.openURL(dialPhoneUrl);
            }
        }).catch(error => {
            ToastUtil.showWithMessage(I18n[language].dialingFail);
        });
    },
}

export default LinkingUtils