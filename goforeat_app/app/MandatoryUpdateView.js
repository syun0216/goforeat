'use strict'

import React,{Component} from 'react'
import PropTypes from 'prop-types';
import {Container,Content} from 'native-base';
import {
    View,
    ActivityIndicator,
    ProgressViewIOS,
    Platform,
    ProgressBarAndroid,
    Alert,
    Text,
} from 'react-native'
import {Button} from 'native-base';

import CodePush from 'react-native-code-push';
import Colors from "./utils/Colors";
import * as ViewStatus from "./utils/ViewStatus";
import GLOBAL_PARAMS from './utils/global_params';
import ToastUtils from './utils/ToastUtil';
import CommonHeader from './components/CommonHeader';

//TODO: 在用户量较大情况下,更新逻辑优化
export default class MandatoryUpdateView extends Component {

    static propTypes = {
        remotePackage: PropTypes.object.isRequired,
    }

    _remotePackage = null;
    _viewWidth = null;

    constructor(props) {
        super(props)

        this._viewWidth = GLOBAL_PARAMS._winWidth / 3 * 2;
        this._remotePackage = props.remotePackage;
        alert(props.remotePackage);
        this.state = {
            progress: 0.0,
            viewStatus: ViewStatus.VIEW_STATUS_DATA,
        }
    }

    componentDidMount() {
        this._startDownload();
    }

    render() {
        return (
            <Container>
            <CommonHeader canBack title="更新界面" {...this['props']}/>
            <View style={{flex: 1,justifyContent:'center',alignItems:'center'}}>
                {this._renderDownloadMessage()}
                {
                    this.state.viewStatus == ViewStatus.VIEW_STATUS_DATA ? this._renderLoadingProgressView() : null
                }
                {
                    this.state.viewStatus == ViewStatus.VIEW_STATUS_REQUEST_NETWORK_ERROR ? this._renderRetryView() : null
                }
            </View>
            </Container>
        )
    }

    onPressAndroidHardWareBack() {
    }

    /*
     private methods
     */


    // view

    _renderDownloadMessage() {
        let message = this.state.viewStatus == ViewStatus.VIEW_STATUS_REQUEST_NETWORK_ERROR ? "更新失败,请重试" : '正在更新...'
        return (
            <Text style={{fontSize: 14, color: Colors.fontBlack, paddingBottom: 35}}>{message}</Text>
        )
    }

    _renderLoadingProgressView() {
        return (
            <View>
                {
                    Platform.OS == 'ios' ? <ProgressViewIOS progressTintColor={Colors.main_orange}
                                                            style={{width: this._viewWidth}}
                                                            progress={this.state.progress}/> : null

                }
                {
                    Platform.OS == 'android' ?
                        <ProgressBarAndroid style={{width: this._viewWidth}}
                                            color={Colors.main_orange} styleAttr="Horizontal"
                                            indeterminate={false}
                                            progress={this.state.progress}/> : null
                }
            </View>
        )
    }

    _renderRetryView() {
        return (
            <Button style={{height: 45, width: 80, backgroundColor: Colors.main_orange}}
                    title="重试"
                    textStyle={{fontSize: 14, color: Colors.main_white}}
                    onPress={() => this._startDownload()}/>
        )
    }

    // logic - download

    _startDownload() {
        if(this._remotePackage == null) {
            ToastUtils.showWithMessage('找不到安裝包...')
            return;
        }
        this.setState({progress: 0.0, viewStatus: ViewStatus.VIEW_STATUS_DATA});

        this._remotePackage.download((progress) => this._downloadProgressHasChange(progress)).then(localPackage => {
            if (localPackage != null) {
                localPackage.install(CodePush.InstallMode.IMMEDIATE)
            } else {
                this.setState({viewStatus: ViewStatus.VIEW_STATUS_REQUEST_NETWORK_ERROR});
            }
        }).catch(error => {
            this.setState({viewStatus: ViewStatus.VIEW_STATUS_REQUEST_NETWORK_ERROR});
        })
    }

    _downloadProgressHasChange(progress) {
        let progressValue = progress.receivedBytes * 1.0 / progress.totalBytes;
        this.setState({progress: progressValue})
    }
}
