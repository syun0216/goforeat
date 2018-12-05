/**
 * CodePush辅助工具类
 */

'use strict'

import React from 'react'
import {
    Platform,
} from 'react-native'

let DebugStatus = false;


let _DEPLOYMENT_KEY_PRODUCTION_ON_IOS = "loe6czezecl4T5wIpFxONddIqmCMd261912e-873f-4270-b887-25c360664c8c";
let _DEPLOYMENT_KEY_STAGING_ON_IOS_DEV = "y5mK05OSrYUfX9dfqMBWnJiRhkm3d261912e-873f-4270-b887-25c360664c8c";
let _DEPLOYMENT_KEY_PRODUCTION_ON_ANDROID = "tbisaS3TKf-Bo3vwCkzIC-TJPf4cd261912e-873f-4270-b887-25c360664c8c";
let _DEPLOYMENT_KEY_STAGING_ON_ANDROID_DEV = "fMXsr1oL8ExCRlmMZD2nLEWHY0-rd261912e-873f-4270-b887-25c360664c8c";

var CodePushUtils = {

    getDeploymentKey() {
        if (Platform.OS == 'ios') {
            return this._getDeploymentKeyOnIOSPlatform();
        } else if (Platform.OS == 'android') {
            return this._getDeploymentKeyOnAndroidPlatform();
        } else {
            return null;
        }
    },


    /*
     private methods
     */

    _getDeploymentKeyOnIOSPlatform() {
        if (!DebugStatus) {
            return _DEPLOYMENT_KEY_PRODUCTION_ON_IOS;
        } else {
            return _DEPLOYMENT_KEY_STAGING_ON_IOS_DEV;
        }
    },

    _getDeploymentKeyOnAndroidPlatform() {
        if (!DebugStatus) {
            return _DEPLOYMENT_KEY_PRODUCTION_ON_ANDROID;
        } else {
            return _DEPLOYMENT_KEY_STAGING_ON_ANDROID_DEV;
        }
    }
}

module.exports = CodePushUtils;
