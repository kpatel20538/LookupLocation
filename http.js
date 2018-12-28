const http = {};

http.getJson = (url, callback, errorHandler) => {
  const request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "json";
  request.addEventListener("load", () => {
    if (request.status === 200) {
      console.log("resolve")
      callback(request.response);
    } else {
      errorHandler({message: "Server Error: " + request.statusText});
    }
  });
  request.addEventListener("error", () => {
    errorHandler({message: "Client Error: Can't connect to Internet"});
  });
  request.send();
  return request;
};
