import React, {Component} from 'react'
import {Platform, View, Text, TouchableOpacity, ScrollView, Image} from 'react-native'
import {Icon} from 'native-base'
//navigation
import {
    addNavigationHelpers,
    StackNavigator,
    TabNavigator,
    DrawerNavigator,
    DrawerItems,
    TabBarBottom
} from 'react-navigation'
//views
import LoginView from './LoginView';
import RegisterView from './RegisterView';
import SettingView from './SettingView';
import SplashPageView from './SplashPageView';

import ContentView from './views/ContentView';

import SearchView from './views/SearchView';
import GoodsListPageView from './views/GoodsListPageView';
import ArticleView from './views/ArticleView';
import PersonView from './views/PersonView';
import MyFavoriteView from './views/MyFavoriteVIew';
import StatementView from './views/StatementView';
import ShopSwiperablePage from './views/ShopSwiperablePage';
import ActivitySwiperablePage from './views/ActivitySwiperablePage';
import IntegralView from './views/IntegralView';
import IntegralDetailView from './views/IntegralDetailView';
import UploadView from './views/UploadView';
import CommentsView from './views/CommentsView';
import MandatoryUpdateView from './MandatoryUpdateView';
import ConfirmOrderView from './views/ConfirmOrderView';
//api
import api from './api';
import source from './api/CancelToken';
//utils
import ToastUtil from './utils/ToastUtil';
import LinkingUtils from './utils/LinkingUtils';
import GLOBAL_PARAMS from './utils/global_params';
import Colors from './utils/Colors';
import {addListener} from './utils/navigationWithRedux';
//react-redux
import {connect} from 'react-redux';
//store
import store from './store';
//event 
import EventEmitter from 'EventEmitter';

class CustomTabBar extends Component {
    componentDidMount() {
        // console.log(222,this.props);
    }

    render() {
        return (
            <TabBarBottom
                {...this['props']} activeTintColor={this.props.screenProps.theme}/>
        )
    }
}

const tabView = TabNavigator({
    GoodsListTab: {
        screen: GoodsListPageView,
        navigationOptions: {
            tabBarLabel: '餐廳',
            tabBarIcon: ({tintColor, focused}) => (<Icon size={28} name="md-restaurant" style={{
                color: tintColor
            }}/>)
        }
    },
    ShopTab: {
        screen: ShopSwiperablePage,
        navigationOptions: {
            tabBarLabel: '外卖',
            tabBarIcon: ({tintColor, focused}) => (<Icon size={28} name="md-pizza" style={{
                color: tintColor
            }}/>)
        }
    },
    ArticleTab: {
        screen: ArticleView,
        navigationOptions: {
            tabBarLabel: '文章',
            tabBarIcon: ({tintColor, focused}) => (<Icon size={28} name="md-images" style={{
                color: tintColor
            }}/>)
        }
    },
    AtivityTab: {
        screen: ActivitySwiperablePage,
        navigationOptions: {
            tabBarLabel: '線下',
            tabBarIcon: ({tintColor, focused}) => (<Icon size={28} name="md-aperture" style={{
                color: tintColor
            }}/>)
        }
    },
    PersonTab: {
        screen: PersonView,
        navigationOptions: {
            tabBarLabel: '個人中心',
            tabBarIcon: ({tintColor, focused}) => (<Icon size={35} name="md-contact" style={{
                color: tintColor
            }}/>)
        }
    }
}, {
    animationEnabled: false,
    swipeEnabled: false,
    tabBarPosition: 'bottom',
    lazy: true, //该属性只会加载tab的当前view
    tabBarComponent: CustomTabBar,
    tabBarOptions: {
        showLabel: true,
        showIcon: true,
        // inactiveTintColor: '#707070',
        // activeTintColor: Colors.main_orange,

        // tabStyle: {
        //   height:100
        // }
    }
})

const darwerView = DrawerNavigator({
    GoodsListDrawer: {
        screen: tabView
    }
}, {
    drawerWidth: 240,
    drawerPosition: 'left',
    contentComponent: props => {
        // console.log('darwer', props)
        return (<View style={{
            position: 'relative',
            flex: 1,
            backgroundColor: props.screenProps.theme
        }}>
            <View style={{
                alignSelf: 'center',
                marginTop: 100,
                marginBottom: 130
            }}>
                <Text style={{color: Colors.main_white}}>Goforeat v1.0.3</Text>
            </View>
            <ScrollView style={{marginLeft: -50}} showsVerticalScrollIndicator={false}>
                {/* <TouchableOpacity onPress={() => props.navigation.navigate('Statement',{name:'service'})}>
        <View style={{height:50,flex:1,justifyContent:'center',alignItems:'center',flexDirection:'row'}}>
          <Image style={{width:28,height:28,marginRight:30}} source={require('./asset/Law.png')}/>
          <Text style={{fontSize:22}}>法律聲明</Text>
        </View>
    </TouchableOpacity> */}
                <TouchableOpacity onPress={() => props.navigation.navigate('Statement', {name: 'service'})}>
                    <View style={{
                        height: 50,
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row'
                    }}>
                        <Image style={{width: 26, height: 26, marginRight: 30}}
                               source={require('./asset/Service.png')}/>
                        <Text style={{fontSize: 22, color: Colors.main_white}}>服務條款</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => props.navigation.navigate('Statement', {name: 'policy'})}>
                    <View style={{
                        height: 50,
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row'
                    }}>
                        <Image style={{width: 26, height: 26, marginRight: 30}}
                               source={require('./asset/Privacy.png')}/>
                        <Text style={{fontSize: 22, color: Colors.main_white}}>隱私政策</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => props.navigation.navigate('Statement', {name: 'about'})}>
                    <View style={{
                        height: 50,
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row'
                    }}>
                        <Image style={{width: 26, height: 26, marginRight: 30}} source={require('./asset/about.png')}/>
                        <Text style={{fontSize: 22, color: Colors.main_white}}>關於我們</Text>
                    </View>
                </TouchableOpacity>
            </ScrollView>
            <TouchableOpacity style={{
                position: 'absolute',
                bottom: 60,
                right: 50
            }} onPress={() => LinkingUtils.dialPhoneWithNumber('97926095')}>
                <View>
                    <Text style={{
                        fontSize: 18, color: Colors.main_white
                    }}>聯繫電話:97926095</Text>
                </View>
            </TouchableOpacity>
        </View>)
    }
})

let MainView = StackNavigator({
    // Splash: {
    //   screen: SplashPageView
    // },
    // Mandatory: {
    //   screen: MandatoryUpdateView
    // },
    Home: {
        screen: darwerView
    },
    Content: {
        screen: ContentView,
        navigationOptions: {
            tabBarVisible: false
        }
    },
    Search: {
        screen: SearchView,
        navigationOptions: {
            tabBarVisible: false
        }
    },
    Login: {
        screen: LoginView,
        navigationOptions: {
            tabBarVisible: false,
            transitionConfig: {
                isModal: true
            }
        }
    },
    Register: {
        screen: RegisterView
    },
    Setting: {
        screen: SettingView
    },
    MyFavorite: {
        screen: MyFavoriteView
    },
    Statement: {
        screen: StatementView
    },
    Upload: {
        screen: UploadView
    },
    Integral: {
        screen: IntegralView
    },
    IntegralDetail: {
        screen: IntegralDetailView
    },
    Comment: {
        screen: CommentsView
    },
    Order: {
        screen: ConfirmOrderView
    },
}, {headerMode: 'none'})


// 自定义路由拦截
const defaultGetStateForAction = MainView.router.getStateForAction

MainView.router.getStateForAction = (action, state) => {
    // console.log('action', action)
    // console.log('state', state)
    if (action.type === 'Navigation/NAVIGATE') {
        source.cancel();
    }
    if (action.type === 'Navigation/NAVIGATE' && action.routeName === 'Login' && store.getState().auth.username !== null) {
        ToastUtil.showWithMessage('你不能进入')
        return null
    }
    // if (action.type === 'Navigation/RESET') {
    //   store.dispatch({type: 'REFRESH', refresh: action.actions[0].params.refresh})
    // }
    // if(typeof action.routeName !== 'undefined' && (action.routeName === 'ShopTab' || action.routeName === 'AtivityTab')) {
    //   store.dispatch({type: 'IS_LOADING'})
    // }
    if (typeof state !== 'undefined' && state.routes[state.routes.length - 1].routeName === 'Search') {
        const routes = state.routes.slice(0, state.routes.length - 1)
        // routes.push(action)
        return defaultGetStateForAction(action, {
            ...state,
            routes,
            index: routes.length - 1
        })
    }
    return defaultGetStateForAction(action, state)
}

export default MainView;
