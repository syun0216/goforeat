import axios from 'axios';
const ROOT_URL = "http://goforeat.hk/guide/"

export default {
  getCanteenDetail(page,extraFilter) {
    const params = {
      condition: 'default',
      page: page,
      limit: 12
    }
    if(typeof extraFilter !== 'undefined') {
      params = {...params,...extraFilter}
    }
    return axios.get('queryCanteen', {
      params: params
    })
  } ,
  getCanteenOptions() {
    return axios.get('getCanteenOption' ,{
      timeout: 4500
    })
  }
}
