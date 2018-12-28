// import dom


const makeDetails = (spec) => {
  return spec.map((detail) => {
    const detailContainer = dom.make("div", ["ll-detail", detail.clazz]);
    detailContainer.appendChild(dom.make("strong", ["ll-key"], detail.label));
    detailContainer.appendChild(dom.make("span", ["ll-value"]));
    return detailContainer;
  })
};

const view = {}

view.fab = dom.factory(() => dom.make("button", ["ll-fab", "btn", "btn-primary", "m-4", "btn-lg"]));
view.thumbnail = dom.factory(() => dom.make("img", ["ll-thumbnail"]));
view.screen = dom.factory(() => dom.make("div", ["ll-screen"]));

view.message = dom.factory(() => dom.make("div", ["ll-message"]));
view.loading = dom.factory(() => {
  const container = dom.make("div", ["ll-loading", "m-5", "d-flex", "justify-content-center", "align-items-center"]);
  
  const spinner = dom.make("div", ["spinner-border"]);
  spinner.role = "status";
  
  const message = dom.make("span", ["sr-only"], "Loading...");
  
  spinner.appendChild(message);
  container.appendChild(spinner);
  return container;
  
});
view.error = dom.factory(() => dom.make(view.message(), ["ll-error", "alert", "alert-danger"]));

view.searchBar = dom.factory(() => {
  const searchBar = dom.make("div", ["ll-search-bar", "input-group", "mb-4"]);
  
  const searchQuery = dom.make("input", ["ll-search-query", "form-control", "col-auto"]);
  searchQuery.type = "text";
  searchQuery.placeholder = "Item Name";
  searchBar.appendChild(searchQuery);
  
  const searchStore = dom.make("input", ["ll-search-store", "form-control","col-3"]);
  searchStore.type = "number";
  searchStore.placeholder = "Store #";
  searchStore.min = 1;
  searchBar.appendChild(searchStore);
  
  const appendGroup = dom.make("div", ["input-group-append"]);
  
  const searchSubmit = dom.make("button", ["ll-search-submit", "btn", "btn-primary"], "Go!");
  searchSubmit.type = "button";
  appendGroup.appendChild(searchSubmit);
  
  searchBar.appendChild(appendGroup);
  
  return searchBar;
});

view.searchResults = dom.factory(() => dom.make("div", ["ll-search-results"]));
view.emptyResultList = dom.factory(() => dom.make(view.message(), ["ll-no-results"], "No Items Found"));
view.resultsList = dom.factory(() => dom.make(view.message(), ["ll-results-container", "mb-6"]));

view.result = dom.factory(() => {
  const resultContainer = dom.make("div", ["ll-result-container", "border", "rounded", "container", "d-flex", "p-1", "mb-2"]);
  
  const resultThumbnail = dom.make(view.thumbnail(), ["ll-result-image" , "col-4", "col-md-2", "p-0"]);
  resultContainer.appendChild(resultThumbnail);
  
  const resultDetails = dom.make("div", ["ll-result-details", "col-8"]);
  const resultName = dom.make("h5", ["ll-result-name"]);
  resultDetails.appendChild(resultName);
  
  resultDetails.appendChildren(makeDetails([
    {clazz: "li-result-price", label: "Price: "},
    {clazz: "li-result-stock", label: "Stock: "},
  ]));
  resultContainer.appendChild(resultDetails);
  
  return resultContainer;
});

view.searchScreen = dom.factory(() => {
  const searchScreen = dom.make(view.screen(), ["ll-search-screen", "m-3"]);
  
  const searchContainer = dom.make("div", ["ll-search-container"]);
  searchContainer.appendChild(view.searchBar());
  searchContainer.appendChild(view.searchResults());
  
  const buttonBar = dom.make("div", ["ll-button-bar", "btn-group", "btn-block" , "my-5", "pt-3", "pb-5", "border-top"]);
  buttonBar.role = "group";
  const searchPrev = dom.make("button", ["btn", "btn-primary", "ll-search-prev", "col"], "Previous");
  searchPrev.type= "button";
  buttonBar.appendChild(searchPrev);
  const searchNext = dom.make("button", ["btn", "btn-primary", "ll-search-next", "col"], "Next");
  searchNext.type= "button";
  buttonBar.appendChild(searchNext);
  searchContainer.appendChild(buttonBar);
  searchScreen.appendChild(searchContainer);
  
  const searchScanFab = dom.make(view.fab(), ["ll-search-scan"], "Scan UPC");
  searchScreen.appendChild(searchScanFab);
  
  return searchScreen;
});

view.itemDetails = dom.factory(() => {
  const detailsContainer = dom.make("div", ["ll-item-details"]);
  detailsContainer.appendChildren(makeDetails([
    {clazz: "li-item-name", label: "Name: "},
    {clazz: "li-item-upc", label: "UPC: "},
    {clazz: "li-item-price", label: "Price: "},
    {clazz: "li-item-stock", label: "Stock: "},
    {clazz: "li-item-category", label: "Category: "},
  ]));
  return detailsContainer;  
});

view.barcode = dom.factory(() => dom.makeSvg("svg", ["ll-item-barcode"]));

view.itemData = dom.factory(() => {
  const itemContainer = dom.make("div", ["ll-item-data", "container", "m-2", "p-2", "rounded", "border"]);
  const topRow = dom.make("div", ["row", "mb-3"]);  
  topRow.appendChild(dom.make(view.thumbnail(), ["ll-item-image", "col-6"]));
  topRow.appendChild(dom.make(view.itemDetails(), ["col-6"]));
  itemContainer.appendChild(topRow);

  const middleRow = dom.make("div", ["row", "mb-5", "p-3"]);
  middleRow.appendChild(dom.make(view.barcode(), ["col"]));
  itemContainer.appendChild(middleRow);
  
  const bottomRow = dom.make("div", ["row", "mb-5"]);
  bottomRow.appendChild(dom.make("div", ["ll-item-description", "col"]));
  itemContainer.appendChild(bottomRow);
  
  return itemContainer;
});

view.itemScreen = dom.factory(() => {
  const itemScreen = dom.make(view.screen(), ["ll-item-screen"]);

  const itemContainer = dom.make("div", ["ll-item-container"]);
  itemScreen.appendChild(itemContainer);

  const itemBackFab = dom.make(view.fab(), ["ll-item-return"], "Back to Search");
  itemScreen.appendChild(itemBackFab);

  return itemScreen;
});




view.scannerScreen = dom.factory(() => {
  const scannerScreen = dom.make(view.screen(), ["ll-scanner-screen"]);
  
  const scannerContainer = dom.make("div", ["ll-scanner-container", "w-100", "h-100"]);
  scannerContainer.appenChild(dom.make("div", ["ll-scanner-preview"]));
  scannerScreen.appendChild(scannerContainer);
  
  const scannerCancel = dom.make(view.fab(), ["ll-scanner-cancel" , "btn", "btn-danger"], "Cancel");
  scannerCancel.type = "button";
  scannerScreen.appendChild(scannerCancel);
  return scannerScreen;
});
