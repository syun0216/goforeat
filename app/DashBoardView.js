import React, { PureComponent } from 'react';
import MainView from './MainView';
import NavigationService from './utils/NavigationService';

class DashBoardView extends PureComponent {

  /**
   * 获取mainview的导航实例
   * 可以用作组件外的跳转，详见utils里的NavigationService
   *
   * @returns
   * @memberof DashBoardView
   */
  render() {
    return (
        <MainView 
          ref={navigationRef => NavigationService.setTopLevelNavigator(navigationRef)}
        // navigation={addNavigationHelpers({
        //   dispatch: this.props.dispatch,
        //   state: this.props.nav,
        //   // addListener,
        // })} 
        // screenProps={{...this.props}}
        />
    )
  }
}

export default DashBoardView