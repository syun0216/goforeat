import axios from 'axios'
import md5 from 'js-md5'
import qs from 'qs'
import source from './CancelToken'
import store from '../store'

const CancelToken = axios.CancelToken;
const root_url = 'http://goforeat.hk'
const api_url = 'http://api.goforeat.hk'

export let cancel_goods_list_request = null;

const api = {
    getCanteenList(page, filter) {
        const validItem = {}
        const params = {
            page: page,
            condition: 'default',
            limit: 8,
        }
        if (typeof filter !== 'undefined') {
            for (let i in filter) {
                if (filter[i] !== 'default') {
                    validItem[i] = filter[i]
                }
            }
            Object.assign(params, validItem)
        }
        return axios.get(api_url + '/guide/queryCanteen', {
            params: params,
            timeout: 4500,
            cancelToken: new CancelToken(function executor(c) {
                // An executor function receives a cancel function as a parameter
                cancel_goods_list_request = c;
            })
        })
    },
    getCanteenOptions() {
        return axios.get(api_url + '/guide/getCanteenOption', {
            cancelToken: source.token
        })
    },
    getCanteenDetail(canteenId) {
        // let params = new URLSearchParams();
        // params.append('canteenId', canteenId);
        return axios.post(api_url + "/guide/getCanteenDetail", qs.stringify({
            canteenId,
        }, {cancelToken: source.token,timeout: 4500,}), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
    },
    // login
    getCode(mobile, type) {
        return axios.post(api_url + "/passport/register", qs.stringify({
            mobile,
            type
        }, {cancelToken: source.token}), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
    },
    register(mobile, type, token, code, password) {
        return axios.post(api_url + "/passport/checkCode", qs.stringify({
            mobile,
            type,
            token,
            code,
            password
        }, {cancelToken: source.token}), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
    },
    login(mobile, type, password) {
        return axios.post(api_url + "/passport/login", qs.stringify({
            mobile,
            type,
            password
        }, {cancelToken: source.token}), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
    },
    logout() {
        return axios.post(api_url + "/passport/logout", qs.stringify({sid:store.getState().auth.sid}))
    },
    // article
    getArticleList(offset) {
        return axios.post(api_url + '/cms/getNewsList', qs.stringify({
            limit: 5,
            offset: offset,
        }, {cancelToken: source.token, timeout: 4500}), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
    },
    searchCanteenWithName(name) {
        return axios.post(api_url + '/guide/matchCanteenByName', qs.stringify({
            name,
        }, {cancelToken: source.token}), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
            }
        })
    },
    getIntegralProjectListData(sid) {
        return axios.get(api_url + '/point/getProjects',{
            params:{
                sid
            }
        })
    },
    getIntegralProjectDetail(projectId, sid) {
        return axios.post(api_url + '/point/getProjectDetail', qs.stringify({
            projectId,
            sid
        }, {cancelToken: source.token}), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
    },
    getProjectComments(projectId,sid) { //獲取項目留言
        return axios.post(api_url + '/point/getProjectComment', qs.stringify({
            projectId,
            sid
        }, {cancelToken: source.token}), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
    },
    uploadBillImg(billImg) { // 上傳發票
        let _img = {
            name: billImg.fileName,
            uri: billImg.uri
        }
        let params = new FormData();
        params.append('billImg', _img);
        return axios.post(api_url + '/member/uploadBillImg', params)
    },
    recommendShop(limit = 10, offset) { //线下餐厅推荐
        return axios.post(api_url + '/guide/canteenRecommend', qs.stringify({
            limit,
            offset,
        }, {cancelToken: source.token}), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
    },
    recommendOnlineShop(limit = 15, offset) {
        return axios.post(api_url + '/guide/onlineCanteenRecommend', qs.stringify({
            limit,
            offset,
        }, {cancelToken: source.token}), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
    },
    sendPoint(projectId, point ,sid) {
        return axios.post(api_url + '/point/sendPoint', qs.stringify({
            projectId,
            point,
            sid
        }, {cancelToken: source.token}), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
    },
    adSpace() { // 广告位接口
        return axios.get(api_url + '/adSpace/list')
    },
    getFoodRecommend(placeId, sid) {
        return axios.get(api_url + '/food/getFoodRecommend', {
            params: {
                placeId,
                sid
            },
            timeout: 4500
        })
    },
    createOrder(foodId,sid,placeId) {
        return axios.get(api_url + '/order/create', {
            params: {
                foodId,
                sid,
                placeId
            },
            timeout: 4500
        })
    },
    confirmOrder(orderId,sid) {
        return axios.post(api_url + '/order/confirm',qs.stringify({
            orderId,
            sid
        }, {cancelToken: source.token}), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
    },
    getNotifications() {
        return axios.get('https://api.appcenter.ms/v0.1/apps/junewensu/Goforeat/push/notifications', {
            params: {
                top: 1,
                orderby: 'count desc',
                owner_name: 'junewensu',
                app_name: 'Goforeat',
                inlinecount: 'none'
            },
            headers: {
                "Content-Type": "application/json",
                'X-API-Token': '1c49db9b101bb9ce4217d56206879e7f22a600db'
            }
        })
    },
    checkCode(mobile,type,token,code) {
        return axios.post( api_url + '/passport/checkCode',qs.stringify({
            mobile,type,token,code
        }, {cancelToken: source.token}), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
    },
    myOrder(offset,sid) {
        return axios.post(api_url + '/order/myOrders', qs.stringify({
            limit: 5,
            offset: offset,
            sid
        }, {cancelToken: source.token, timeout: 4500}), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
    },
    foodPlaces() {
        return axios.get(api_url + '/food/getDeliveryPlace', {timeout: 4500})
    }
}

module.exports = api
