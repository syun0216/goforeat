/**
 * json的扩张工具
 */

const JSONUtils = {

  parseJSONFromString(string, successCallback, failCallback) {
      this._toJSONObject(string).then(resultJSON => {
          if (successCallback != null) {
              successCallback(resultJSON)
          }
      }).catch(error => {
          if (failCallback != null) {
              failCallback(error);
          }
      })
  },


  /*
   private methods
   */

  _toJSONObject(jsonString) {
      let promise = new Promise((resolve, reject) => {
          let object = JSON.parse(jsonString);
          resolve(object);
      })
      return promise;
  }
}

module.exports = JSONUtils;