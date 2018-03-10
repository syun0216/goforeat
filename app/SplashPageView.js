// import React from 'react'
// import {
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   AppState,
//   Alert
// } from 'react-native';
// import {NavigationActions} from 'react-navigation'
// import Swiper from 'react-native-swiper';
// //hot reload
// import codePush from 'react-native-code-push'
// import Push from 'appcenter-push'
//
// const styles = StyleSheet.create({
//   wrapper: {
//   },
//   slide1: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#9DD6EB',
//   },
//   slide2: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#97CAE5',
//   },
//   slide3: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#92BBD9',
//   },
//   text: {
//     color: '#fff',
//     fontSize: 30,
//     fontWeight: 'bold',
//   }
// })
//
// const SplashPageView = (props) => {
//   codePush.getUpdateMetadata().then(localPackage => {
//             if (localPackage == null) {
//                 console.log('codepush find no localPackage')
//             } else {
//                 console.log('has localPackage')
//             }
//         })
//     return (
//       <Swiper style={styles.wrapper} loop={false}>
//         <View style={styles.slide1}>
//           <Text style={styles.text}>Goforeat</Text>
//         </View>
//         <View style={styles.slide2}>
//           <Text style={styles.text}>HK</Text>
//         </View>
//         <View style={styles.slide3} >
//           <TouchableOpacity onPress={() => {
//             const resetAction = NavigationActions.reset({
//                 index: 0,
//                 actions: [
//                     NavigationActions.navigate( { routeName: 'Home',params:{refresh:true}} )
//                 ],
//             });
//             props.navigation.dispatch(resetAction);
//           }}>
//             <Text style={styles.text}>進入主頁</Text>
//           </TouchableOpacity>
//         </View>
//       </Swiper>
//     )
// }
//
// export default SplashPageView
//
//
// import React from 'react';
// import {
//   Text,
//   View,
//   ScrollView,
//   TouchableOpacity,
//   StyleSheet
// } from 'react-native';

// import Push from 'appcenter-push';

// export default class SplashPageView extends React.Component {
//   constructor() {
//     super();
//     this.state = {
//       pushEnabled: false
//     };
//     this.toggleEnabled = this.toggleEnabled.bind(this);
//   }

//   async componentDidMount() {
//     const component = this;

//     const pushEnabled = await Push.isEnabled();
//     component.setState({ pushEnabled });
//   }

//   async toggleEnabled() {
//     await Push.setEnabled(!this.state.pushEnabled);

//     const pushEnabled = await Push.isEnabled();
//     this.setState({ pushEnabled });
//   }

//   render() {
//     return (
//       <View style={SharedStyles.container}>
//         <ScrollView >
//           <Text style={SharedStyles.heading}>
//             Test Push
//           </Text>

//           <Text style={SharedStyles.enabledText}>
//             Push enabled: {this.state.pushEnabled ? 'yes' : 'no'}
//           </Text>
//           <TouchableOpacity onPress={this.toggleEnabled}>
//             <Text style={SharedStyles.toggleEnabled}>
//               toggle
//             </Text>
//           </TouchableOpacity>

//         </ScrollView>
//       </View>
//     );
//   }
// }

// const SharedStyles = StyleSheet.create({
//   heading: {
//     fontSize: 24,
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5FCFF',
//   },
//   button: {
//     color: '#4444FF',
//     fontSize: 18,
//     textAlign: 'center',
//     margin: 10,
//   },
//   enabledText: {
//     fontSize: 14,
//     textAlign: 'center',
//   },
//   toggleEnabled: {
//     color: '#4444FF',
//     fontSize: 14,
//     textAlign: 'center',
//     marginBottom: 10,
//   },
// });
