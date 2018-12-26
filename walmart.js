const corsProxy = "https://cors-anywhere.herokuapp.com";
const walmartOrigin = "https://api.walmartlabs.com";
const apiOrgin = corsProxy + "/" + walmartOrigin;
const injectApiKey = R.assoc("apiKey", "csfyhryrmswq86eqrab3jy9p");

const walmartSearch = R.curry((params, callback, errorCallback) => 
  httpGetJson(
    buildUrl(
      apiOrgin + "/v1/search", 
      {}, 
      injectApiKey(params)
    ),
    callback,
    errorCallback,
  )
);

const walmartLookup = R.curry((params, callback, errorCallback) => 
  httpGetJson(
    buildUrl(
      apiOrgin + "/v1/items/<itemId>",
      R.pick(["itemId"], params),
      R.omit(["itemId"], injectApiKey(params))
    ),
    callback,
    errorCallback,
  )
);