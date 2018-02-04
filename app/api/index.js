import axios from 'axios'
import md5 from 'js-md5'
import qs from 'qs'

const root_url = 'http://goforeat.hk'
const test_url = 'http://localhost:1091'

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
    console.log(params)
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
      canteenId:canteenId
    }), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });
  },

  testLogin(username, password) {
    let params = new URLSearchParams();
    params.append('username', username);
    params.append('password', md5(password));
    return axios.post(test_url + "/api/user/login_v2", params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });
  }
}

module.exports = api
