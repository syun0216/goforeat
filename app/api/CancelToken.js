//存储页面请求token

let sourceKeyStore = [];

export const abortRequestInPatchWhenRouteChange = () => {
  if(sourceKeyStore.length == 0) return;
  sourceKeyStore.forEach(cancel => {
    cancel && cancel()
  });
};

export default sourceKeyStore;
