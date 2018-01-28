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
  test() {
    return fetch(root_url + '/guide/queryCanteen').then(res => {
      return res.json().then(
         () => res.json() // this will throw
      );
    });
  }
}

module.exports = api
