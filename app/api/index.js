import axios from 'axios'
import md5 from 'js-md5'
import qs from 'qs'

const root_url = 'http://goforeat.hk'
const api_url = 'http://api.goforeat.hk'

const api = {
  getCanteenList(page, filter) {
    const validItem = {}
    const params = {
      page: page,
      condition: 'default',
      limit: 12
    }
    if (typeof filter !== 'undefined') {
      for (let i in filter) {
        if (filter[i] !== 'default') {
          validItem[i] = filter[i]
        }
      }
      Object.assign(params, validItem)
    }
    return axios.get(root_url + '/guide/queryCanteen', {
      params: params,
      timeout: 4500
    })
  },
  getCanteenOptions() {
    return axios.get(root_url + '/guide/getCanteenOption')
  },
  getCanteenDetail(canteenId){
    // let params = new URLSearchParams();
    // params.append('canteenId', canteenId);
    return axios.post(root_url + "/guide/getCanteenDetail", qs.stringify({
      canteenId
    }), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });
  },
  // login
  getCode(mobile,type) {
    return axios.post(api_url + "/passport/register" ,qs.stringify({
      mobile,
      type
    }), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
  },
  register(mobile,type,token,code,password) {
    return axios.post(api_url + "/passport/checkCode", qs.stringify({
      mobile,
      type,
      token,
      code,
      password
    }),{
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
  },
  login(mobile,type,password) {
    return axios.post(api_url + "/passport/login", qs.stringify({
      mobile,
      type,
      password
    }),{
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
  },
  logout() {
    return axios.post(api_url + "/passport/logout")
  },
  // article
  getArticleList() {
    return axios.post(root_url + '/cms/getNewsList', qs.stringify({
      limit: 15,
      offset: 0
    }),{
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
  }
}

module.exports = api
