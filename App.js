/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  View
} from 'react-native';
import {Root} from 'native-base'
import store from './app/store'
import {Provider} from 'react-redux'
import MainView from './app/DashBoardView'

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class App extends Component<{}> {
  render() {
    return (
      <Root>
        <Provider store={store}>
          <MainView />
        </Provider>
      </Root>
    );
  }
}
