const url = {};

url.formatPath = (template, args) => {
  const encodedArgs = {};
  for (const key of args) {
    encodedArgs["<" + key + ">"] = encodeURI(args[key]);
  }
  return template.replace(
    /<[^>]*>/,
    (key) => encodedArgs[key]
  );
};

url.encodeParameters = (path, params) => {
  return path + "?" + Object.keys(params)
    .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
    .join("&");
};

url.create = (template, args, params) => {
  const path = url.formatPath(template, args);
  return url.encodeParameters(path, params);
};