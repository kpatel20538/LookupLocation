const setScreen = (screen) => document.body.setChild(screen);

const protoviewSearchScreen = htmlFactory(() => {
  const searchScreen = document.createElement("div");
  searchScreen.classList.add("search-screen");
  
  const searchBox = document.createElement("div");
  searchBox.classList.add("search-box");
  
  const searchQuery = document.createElement("input");
  searchQuery.classList.add("search-query");
  searchQuery.type = "text";
  searchQuery.placeholder = "Item Name";
  searchBox.appendChild(searchQuery);
  
  const searchStore = document.createElement("input");
  searchStore.classList.add("search-store");
  searchStore.type = "number";
  searchStore.placeholder = "Store #";
  searchBox.appendChild(searchStore);
  
  const searchSubmit = document.createElement("button");
  searchSubmit.classList.add("search-submit");
  searchSubmit.textContent = "Search";
  searchBox.appendChild(searchSubmit);
  
  searchScreen.appendChild(searchBox);
  
  const searchResults = document.createElement("div");
  searchResults.classList.add("search-results");
  searchScreen.appendChild(searchResults);
  
  return searchScreen;
});

const viewSearchScreen = () => {
  const searchScreen = protoviewSearchScreen();
  const searchQuery = searchScreen.querySelector(".search-query");
  const searchStore = searchScreen.querySelector(".search-store");
  const searchSubmit = searchScreen.querySelector(".search-submit");
  const searchResults = searchScreen.querySelector(".search-results");
  
  const cookie = getCookie({query: "", store: ""});
  searchQuery.value = cookie.query;
  searchStore.value = cookie.store;
  
  const collectParams = () => {
    const params = {};
    params.query = searchQuery.value;
    if (searchStore.value !== "") {
      params.store = parseInt(searchStore.value);
    }
    return params;
  }
  
  searchSubmit.addEventListener("click", () => {
    const params = collectParams();
    setCookie(params);
    
    searchResults.setChild(viewLoading());
    walmartSearch(
      params,
      R.compose((el) => searchResults.setChild(el), viewResults, R.prop("items")),
      R.compose((el) => searchResults.setChild(el), viewError, R.prop("statusText"))
    );
  });

  return searchScreen;
}

const gotoSearchScreen = () => {
  setScreen(viewSearchScreen());
}

const protoviewResult = htmlFactory(() => {
  const resultBox = document.createElement("div");
  resultBox.classList.add("result-box");
  
  const img = document.createElement("img");
  img.classList.add("result-thumbnail");
  resultBox.appendChild(img);
  
  const nameDiv = document.createElement("div");
  nameDiv.classList.add("result-name");
  resultBox.appendChild(nameDiv);
  
  return resultBox;
});

const viewResult = (result, store) => {
  const resultBox = protoviewResult();
  const img = resultBox.querySelector(".result-thumbnail");
  const nameDiv = resultBox.querySelector(".result-name");
  
  const params = {};
  params.itemId = result.itemId;
  if (typeof store !== "undefined") {
    params.store = store
  }
  
  img.src = result.thumbnailImage;
  nameDiv.textContent = result.name;
  resultBox.addEventListener("click", () => gotoItemScreen(params));
  
  return resultBox;
}

const protoviewResults = htmlFactory(() => {
  const results = document.createElement("div");
  results.classList.add("results-items");
  return results;
});

const viewResults = (items, store) => {
  if (items.length === 0) {
    return viewNoResults();
  } else {
    const results = protoviewResults();
    results.setChildren(R.map((item) => viewResult(item, store), items));
    return results;
  }
}

function randomResult() {
  return {
    name: randomId(randomInt(10, 200)),
    thumbnailImage: randomImg(10, 100)
  };
}

const randomResults = generate(randomResult);

const protoviewLoading = htmlFactory(() => {
  const loading = document.createElement("div");
  loading.classList.add("message", "loading");
  loading.textContent = "loading...";
  return loading;
});

const viewLoading = protoviewLoading;

const protoviewError = htmlFactory(() => {
  const error = document.createElement("div");
  error.classList.add("message", "error");
  return error;
});

const viewError = (statusText) => {
  const error = protoviewError();
  error.textContent = "ERROR: " + statusText;  
  return error;
};

const protoviewNoResults = htmlFactory(() => {
  const loadingResults = document.createElement("div");
  loadingResults.classList.add("results-message", "results-empty");
  loadingResults.textContent = "No Results Found";
  return loadingResults;
});

const viewNoResults = protoviewNoResults;

const gotoItemScreen = (params) => {
  setScreen(viewLoading());
  walmartLookup(
    params,
    R.compose(setScreen, viewItemScreen),
    R.compose((err) => setScreen(err), viewError, R.prop("statusText"))
  );
}

const protoviewItemScreen = htmlFactory(() => {
  const itemScreen = document.createElement("div");
  itemScreen.classList.add("item-screen");

  const itemBack = document.createElement("button");
  itemBack.classList.add("item-back");
  itemBack.textContent = "Back to Search";
  itemScreen.appendChild(itemBack);

  const itemBox = document.createElement("div");
  itemBox.classList.add("item-box");
  
  const itemImage = document.createElement("img");
  itemImage.classList.add("item-image");
  itemBox.appendChild(itemImage);
  
  const itemDescription = document.createElement("div");
  itemDescription.classList.add("item-description");
  itemBox.appendChild(itemDescription);
  
  const itemBarcode = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  itemBarcode.classList.add("item-barcode");
  itemBox.appendChild(itemBarcode);

  const itemDetails = document.createElement("div");
  itemDetails.classList.add("item-details");
  const protoviewDetail = (clazz, label) => {
    const itemDetail = document.createElement("div");
    itemDetail.classList.add(clazz, "item-detail");
    
    const itemKey = document.createElement("div");
    itemKey.classList.add("item-detail-key");
    itemKey.textContent = label + ": ";
    itemDetail.appendChild(itemKey);
    
    const itemValue = document.createElement("div");
    itemValue.classList.add("item-detail-value");
    itemDetail.appendChild(itemValue);
    
    return itemDetail;
  }
  itemDetails.appendChild(protoviewDetail("item-name", "Name"));
  itemDetails.appendChild(protoviewDetail("item-price", "Price"));
  itemDetails.appendChild(protoviewDetail("item-upc", "UPC"));
  itemDetails.appendChild(protoviewDetail("item-stock", "Stock"));
  itemBox.appendChild(itemDetails);
  
  itemScreen.appendChild(itemBox);
  return itemScreen;
});

const viewItemScreen = (item) => {
  const itemScreen = protoviewItemScreen();
  const itemBack = itemScreen.querySelector(".item-back");
  const itemImage = itemScreen.querySelector(".item-image");
  const itemBarcode = itemScreen.querySelector(".item-barcode");
  const itemDescription = itemScreen.querySelector(".item-description");
  const itemName = itemScreen.querySelector(".item-name .item-detail-value");
  const itemPrice = itemScreen.querySelector(".item-price .item-detail-value");
  const itemUPC = itemScreen.querySelector(".item-upc .item-detail-value");
  const itemStock = itemScreen.querySelector(".item-stock .item-detail-value");
  
  itemImage.src = item.mediumImage;
  JsBarcode(itemBarcode, item.upc, {format: "upc"});
  itemBarcode.removeAttributeNS(null, "width");
  itemBarcode.removeAttributeNS(null, "height");
  
  itemDescription.textContent = item.shortDescription
  itemName.textContent = item.name;
  itemPrice.textContent = "$"+item.salePrice;
  itemUPC.textContent = item.upc;
  itemStock.textContent = item.stock;
  
  itemBack.addEventListener("click", gotoSearchScreen);
  
  return itemScreen;
}

window.addEventListener("load", gotoSearchScreen);

