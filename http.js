const http = {};

http.getJsonCache = new Cache(() => null, new EvictAfterWritePolicy());

http.getJson = (url, callback, errorHandler) => {
  if (http.getJsonCache.has(url)) {
    const response =  http.getJsonCache.get(url);
    if (response.success) {
      callback(response.response);
    } else {
      errorHandler({message: response.message});
    }
  } else {
    const request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "json";
    request.addEventListener("load", () => {
      if (request.status <= 400) {
        http.getJsonCache.set(url, {success:true, response: request.response});
        callback(request.response);
      } else {
        http.getJsonCache.set(url, {success:false, message: request.statusText});
        errorHandler({message: "Server Error: " + request.statusText});
      }
    });
    request.addEventListener("error", () => {
      errorHandler({message: "Client Error: Can't connect to Internet"});
    });
    request.send();
    return request;
  }
};
