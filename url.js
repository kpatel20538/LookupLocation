export const url = {};

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

url.encodeParameters = (path, params) => {
  return path + "?" + Object.entries(params)
    .filter(pair => pair.every(x => typeof x !== "undefined"))
    .map(pair => pair.map(encodeURIComponent).join("="))
    .join("&");
};

url.create = (template, args, params) => {
  const path = url.formatPath(template, args);
  return url.encodeParameters(path, params);
};