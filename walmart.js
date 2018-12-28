// import http
// import url

const walmart = {};

const walmartOrigin = "https://cors-anywhere.herokuapp.com/http://api.walmartlabs.com";
const apiKey = "csfyhryrmswq86eqrab3jy9p";

walmart.search = (options, callback, errorHandler) => {
  options.apiKey = apiKey;

  const basePath = walmartOrigin + "/v1/search";
  const requestPath = url.encodeParameters(basePath, options);
  return http.getJson(requestPath, callback, errorHandler);
};

walmart.lookup = (id, options, callback, errorHandler) => {
  options.apiKey = apiKey;
  
  const template = walmartOrigin + "/v1/items/<id>";
  const basePath = url.formatPath(template, {id: id});
  const requestPath = url.encodeParameters(basePath, options);
  return http.getJson(requestPath, callback, errorHandler);
};

walmart.lookupUpc = (options, callback, errorHandler) => {
  options.apiKey = apiKey;
  
  const basePath = walmartOrigin + "/v1/items";
  const requestPath = url.encodeParameters(basePath, options);
  return http.getJson(requestPath, callback, errorHandler);
};