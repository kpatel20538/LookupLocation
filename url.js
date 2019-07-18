export const url = {};

/**
 * Populate a url-template with with the given arguments
 */
url.formatPath = (template, args) => {
  const encodedArgs = Object.entries(args)
    .filter(pair => pair.every(x => typeof x !== "undefined"))
    .map(([key, value]) => ["<" + key + ">", encodeURI(value)])
    .reduce((obj, [key, value]) => { obj[key] = value; return obj; }, {});

  return template.replace(
    /<[^>]*>/, key => {
      const value = encodedArgs[key];
      return typeof value !== "undefined" ? value : "";
    }
  );
};

/**
 * Encode a set of parameters and append them to an exisiting url
 */
url.encodeParameters = (path, params) => {
  return path + "?" + Object.entries(params)
    .filter(pair => pair.every(x => typeof x !== "undefined"))
    .map(pair => pair.map(encodeURIComponent).join("="))
    .join("&");
};

/**
 * Create url from the given template, template arumgents and url paramters
 */
url.create = (template, args, params) => {
  const path = url.formatPath(template, args);
  return url.encodeParameters(path, params);
};