const walmartApiKey = "csfyhryrmswq86eqrab3jy9p";

function createDiv() { return document.createElement("div"); }

function createSearchResult(result) {
  const boxDiv = createDiv();
  const img = document.createElement("img");
  const nameDiv = createDiv();
  
  boxDiv.classList.add("result-box");
  img.classList.add("result-thumbnail");
  nameDiv.classList.add("result-name");
  
  img.src = result.thumbnailImage;
  nameDiv.textContent = result.name;
  
  boxDiv.appendChild(img);
  boxDiv.appendChild(nameDiv);
  return boxDiv;
}


function setResults(items) { 
  const results = document.querySelector(".results-box");
  while (results.firstChild) {
    results.removeChild(results.firstChild);
  }
  for (let item of items) {
    const result = createSearchResult(item);
    results.appendChild(result);
  }
}

const generate = R.curry((gen, size) => {
  const arr = [];
  for (let i = 0; i < size; i++) 
    arr.push(gen(i));
  return arr;
});

function getOrDefault(given, base) {
  return typeof given === "undefined" ? base : given
}

function randomInt(lo, hi) {
  return Math.floor(lo + (hi - lo) * Math.random());
}

function randomChoice(arr) {
  return arr[randomInt(0, arr.length)];
}

function randomImg(minX, maxX, minY, maxY) {
  minY = getOrDefault(minY, minX);
  maxY = getOrDefault(maxY, maxX);
  return "http://via.placeholder.com/" + randomInt(minX, maxX) + "x" + randomInt(minY, maxY);
}

function randomId(length) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=,./<>?;':\"[]\\|`~ \t\n\r";
  return generate(() => randomChoice(alphabet), length).join("");
}

function randomResult() {
  return new Result(randomId(randomInt(10, 200)), randomImg(10, 100));
}

function Result(name, thumbnailimage) {
  this.name = name;
  this.thumbnailimage = thumbnailimage;
}

const randomResults = generate(randomResult);

const buildUrl = R.curry((base, params) => {
  const encode = R.compose(R.join("="), R.map(encodeURIComponent));
  const encodeParams =  R.compose(R.join("&"), R.map(encode), R.toPairs);
  return base + "?" + encodeParams(params);
});

const searchUrl = buildUrl("http://api.walmartlabs.com/v1/search");

document.querySelector("#search-box .search-submit")
  .addEventListener("click", () => {
    const criteria = document.querySelector("#search-box .search-criteria");
    const query = encodeURIComponent(criteria.value);
    
    httpGetJson(
      searchUrl({query:query, apiKey:walmartApiKey}),
      R.compose(setResults, R.prop("items")),
      R.compose(console.log, R.prop("statusText"))
    );    
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

