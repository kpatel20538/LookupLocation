import { url } from "./url.js";

export const walmart = {};

const walmartOrigin = "https://cors-anywhere.herokuapp.com/http://api.walmartlabs.com";
const apiKey = "csfyhryrmswq86eqrab3jy9p";

/**
 * Dispatch to Walmarts Open API to search for products
 */
walmart.search = options => {
  options.apiKey = apiKey;
  if (options.query === undefined || options.query === "") {
    options.query = " ";
  }
  if (options.start < 1) {
    delete options.start;
  }

  const basePath = walmartOrigin + "/v1/search";
  const requestPath = url.encodeParameters(basePath, options);
  return fetch(requestPath, {
    method: "GET",
    mode: "cors",
  }).then(resp => { 
    if (resp.ok) { return resp.json(); } 
  })
};

/**
 * Dispatch to Walmarts Open API to lookup a product by id
 */
walmart.lookup = options => {
  options.apiKey = apiKey;
  
  const template = walmartOrigin + "/v1/items/<id>";
  const basePath = url.formatPath(template, {id: options.id});
  delete options.id;

  const requestPath = url.encodeParameters(basePath, options);
  return fetch(requestPath, {
    method: "GET",
    mode: "cors",
  }).then(resp => { 
    if (resp.ok) { return resp.json(); } 
  });
};

/**
 * Dispatch to Walmarts Open API to lookup a product by upc
 */
walmart.lookupUpc = options => {
  options.apiKey = apiKey;

  const basePath = walmartOrigin + "/v1/items";
  const requestPath = url.encodeParameters(basePath, options);
  return fetch(requestPath, {
    method: "GET",
    mode: "cors",
  }).then(resp => resp.json())
  .then(json => {
      if ('errors' in json) {
        return Promise.reject({name: 'LookupError', message: json.errors[0].message})
      } else {
        return Promise.resolve(json);
      }
  });
};