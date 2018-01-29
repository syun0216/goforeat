import axios from 'axios'

const root_url = 'http://goforeat.hk'

const api = {
  getCanteenDetail(page) {
    const params = {
      page: page,
      condition: 'default',
      limit: 12
    }
    return axios.get(root_url + '/guide/queryCanteen',{
      params:params
    })
  },
  getCanteenOptions() {
    return axios.get(root_url + '/guide/getCanteenOption')
  }
}

module.exports = api
