import React,{Component} from "react";
import { BackHandler,Platform,Alert,ToastAndroid } from "react-native";
//utils
import { debounce } from '../utils/global_params';

const lastBackPressed = Date.now();
const BackAndroidHandler = WarppedComponent => class extends Component {

  constructor(props) {
    super(props);
    if (Platform.OS == 'android') {
      this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
      BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid.bind(this))
    );
  }
  }

  componentDidMount() {
    if (Platform.OS == 'android') {
      this._handleBackAndroid();
    }
  }

  //back android
  _handleBackAndroid() {
    if (Platform.OS == 'android') {
    this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
      BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid.bind(this))
    );
    }
  }

  onBackButtonPressAndroid() {
    let {routeName} = this.props.navigation.state;
    console.log(this.props.navigation,routeName);
    // if(routeName == "FoodDetails") {
    //   if(lastBackPressed && lastBackPressed + 2000 >= Date.now()) {
    //     BackHandler.exitApp();
    //   }
    //   lastBackPressed = Date.now();
    //   ToastAndroid.show(I18n[this.props.screenProps.language].pressToExit, ToastAndroid.SHORT);
    //   return true;
    // }
  }

  _removeBackAndroidHandler() {
    if(Platform.OS == 'android') {
      this._didFocusSubscription && this._didFocusSubscription.remove();
      this._willBlurSubscription && this._willBlurSubscription.remove();
    }
  }

  componentWillUnmount() {
    if (Platform.OS == 'android') {
      this._removeBackAndroidHandler();
    }
  }

  render() {
    return (
      <WarppedComponent {...this.props}/>
    )
  }
}

export default BackAndroidHandler