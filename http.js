const encodeUrl = R.curry((base, params) => {
  const encode = R.compose(R.join("="), R.map(encodeURIComponent));
  const encodeParams =  R.compose(R.join("&"), R.map(encode), R.toPairs);
  return base + "?" + encodeParams(params);
});


const formatUrl = R.curry((base, params) => {
  return base.replace(/<[^>]*>/g, (match) => {
    const param = match.substring(1, match.length-1);
    return encodeURI(params[param]);
  });
});

const buildUrl = R.curry((base, formatParams, encodeParams) => {
  return encodeUrl(formatUrl(base, formatParams), encodeParams);
});

function httpGet(url, callback, errorCallback) {
  const request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.addEventListener("readystatechange", () => { 
    if (request.readyState == 4 && request.status == 200) {
      callback(request);
    } else if (typeof errorCallback !== "undefined") {
      errorCallback(request)
    }
  });
  request.send();
}

function httpGetJson(url, callback, errorCallback) {
  const getResponse = R.prop("responseText");
  const jsonCallback = R.compose(callback, JSON.parse, getResponse);
  httpGet(url, jsonCallback, errorCallback);
}
