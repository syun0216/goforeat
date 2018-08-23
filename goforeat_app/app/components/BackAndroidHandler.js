import React,{Component} from "react";
import { BackHandler,Platform,Alert,ToastAndroid } from "react-native";
//utils
import { debounce } from '../utils/global_params';
//language
import I18n from '../language/i18n';

const lastBackPressed = Date.now();
const BackAndroidHandler = WarppedComponent => class extends Component {
  _didFocusSubscription;
  _willBlurSubscription;

  static navigationOptions = WarppedComponent.navigationOptions;

  constructor(props) {
    super(props);
    if (Platform.OS == 'android') {
    this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
      BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    );
  }
  }

  componentDidMount() {
    if (Platform.OS == 'android') {
    this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
      BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    );
    }
  }

  onBackButtonPressAndroid = () => {
    let {routeName} = this.props.navigation.state;
    if(routeName == "ShopTab" || routeName == "ArticleTab") {
      if(lastBackPressed && lastBackPressed + 2000 >= Date.now()) {
        BackHandler.exitApp();
      }
      lastBackPressed = Date.now();
      ToastAndroid.show(I18n[this.props.screenProps.language].pressToExit, ToastAndroid.SHORT);
      return true;
    }
    // if(routeName == "ShopTab") {
    //   Alert.alert(
    //     '提示',
    //     '確定要退出有得食嗎?',
    //     [
    //       {text: 'cancel', onPress: () => {return true}, style: 'cancel'},
    //       {text: 'confirm', onPress: () => {BackHandler.exitApp();}},
    //     ],
    //     { cancelable: false }
    //   )
    //   return true
    // }
  }

  componentWillUnmount() {
    if (Platform.OS == 'android') {
    this._didFocusSubscription && this._didFocusSubscription.remove();
    this._willBlurSubscription && this._willBlurSubscription.remove();
    }
  }

  render() {
    return (
      <WarppedComponent {...this.props}/>
    )
  }
}

export default BackAndroidHandler