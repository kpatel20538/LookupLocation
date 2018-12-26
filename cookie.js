function getCookie(defaults) {
  if (document.cookie === "") {
    return getOrDefault(defaults, {});
  } else {
    const obj = JSON.parse(document.cookie);
    if (typeof defaults !== "undefined") {
      Object.setPrototypeOf(obj, defaults);
    }
    return obj;
  }
}

function setCookie(obj) {
  console.log(document.cookie);
  document.cookie = typeof obj === "undefined"
    ? ""
    : JSON.stringify(obj);  
  console.log(document.cookie);
}