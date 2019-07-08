import axios from 'axios';
import { Platform, AsyncStorage } from 'react-native';
import store from '../store/index';
import qs from 'qs';
import { isNil } from 'lodash';
//actions
import { HIDE_LOADING_MODAL, SHOW_LOADING_MODAL, LOGOUT, SHOW_LOADING, HIDE_LOADING, RESET_ACTIVITY } from '../actions'
//language
import i18n from '../language/i18n';
//utils 
import ToastUtil from '../utils/ToastUtil';
import { getVersion } from '../utils/DeviceInfo';
import { currentPlatform } from '../utils/global_params';
import NavigationService from '../utils/NavigationService';

const CancelToken = axios.CancelToken;
export const source = CancelToken.source();

export const netWorkFailCode = 50000; //custom network error code

const BASE_URL = 'https://api.goforeat.hk';

// const generateBaseUrl = async () => {
//     let res = await AsyncStorage.getItem('storage_debug');
//     console.log('res :', res);
// }

// generateBaseUrl();

let service = axios.create({
    baseURL: BASE_URL,
    timeout: 4500
});

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
service.interceptors.request.use(config => {
    if(!store.getState().loading.showLoadingModal && config.loading) {
        store.dispatch({type: SHOW_LOADING});
    }
    if (config.method == 'post') {
        let _data = qs.parse(config.data);
        config.data = qs.stringify({
            ..._data,
            sid: store.getState().auth.sid,
            language: store.getState().language.language,
            sellClient: currentPlatform,
            appVersion: getVersion()
        })
    } else if (config.method == 'get') {
        config.params = {
            ...config.params,
            sid: store.getState().auth.sid,
            language: store.getState().language.language,
            sellClient: currentPlatform,
            appVersion: getVersion()
        }
    }
    console.log(`'%c request'${config.url}`,'background:#000;color:#bada55',config);
    // config.cancelToken = new CancelToken(function executor(c) {

    // })
    return config;
}, error => {
    // Do something with request error
    ToastUtil.showWithMessage(i18n[store.getState().language.language].common_tips.network_err);
    Promise.reject(error)
})

let _responseTimer = null;

service.interceptors.response.use(response => {
    console.log(`%c reponse'${response.config.url}`,'background:#000;color:#bada55',response);
    if (response.status == 200) {
        if(_responseTimer) clearTimeout(_responseTimer);
        _responseTimer = setTimeout(() => {
            store.dispatch({type: HIDE_LOADING});
            store.dispatch({type: HIDE_LOADING_MODAL});
            clearTimeout(_responseTimer);
        },500);
        const res = response.data;
        if(res.ro.respCode === "0000") {
            return res.data;
        }else if(res.ro.respCode === "10006" || res.ro.respCode === "10007") {
            store.dispatch({type:LOGOUT});
            store.dispatch({type: RESET_ACTIVITY});
            NavigationService.back();
            // console.log(NavigationService.navigatorRef)
        }
        if(!(!isNil(response.config.toast)&&!response.config.toast)) {
            ToastUtil.showWithMessage(res.ro.respMsg);
        }
        return Promise.reject({errCode: res.ro.respCode, errMsg: res.ro.respMsg});
    }
}, err => {
    // console.log({err})
    store.dispatch({type: HIDE_LOADING})
    ToastUtil.showWithMessage(i18n[store.getState().language.language].common_tips.network_err);
    return Promise.reject({errCode: netWorkFailCode, errMsg: i18n[store.getState().language.language].common_tips.network_err});
})

export const reinitServer = url => {
    service.defaults.baseURL = url
    // console.log('service :', service);
}


export default service;