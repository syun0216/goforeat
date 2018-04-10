/**
 * Created by ihaiwen on 16/10/14.
 * CodePush辅助工具类
 */

'use strict'

import React from 'react'
import {
    Platform,
} from 'react-native'


let _DEPLOYMENT_KEY_PRODUCTION = "0i_dbmC1qWlt2auwdgMGue2L98OcSyMGMDAPz";
let _DEPLOYMENT_KEY_STAGING = "aOVmD8X5ZYW8SSa0u_UmBKiP6m3OBJzMzDAwG";

var CodePushUtils = {

    getDeploymentKey(type) {
        if (type == 'production') {
            return _DEPLOYMENT_KEY_PRODUCTION;
        } else {
          return _DEPLOYMENT_KEY_STAGING;
        }
    },


    /*
     private methods
     */

    // _getDeploymentKeyOnIOSPlatform() {
    //     if (!DebugStatus.isDebug()) {
    //         return _DEPLOYMENT_KEY_PRODUCTION_ON_IOS;
    //     } else {
    //         return _DEPLOYMENT_KEY_STAGING_ON_IOS_QA;
    //     }
    // },

    // _getDeploymentKeyOnAndroidPlatform() {
    //     if (!DebugStatus.isDebug()) {
    //         return _DEPLOYMENT_KEY_PRODUCTION_ON_ANDROID;
    //     } else {
    //         return _DEPLOYMENT_KEY_STAGING_ON_ANDROID_QA;
    //     }
    // }
}

module.exports = CodePushUtils;
