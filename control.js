// import dom
// import view
// import model
// import walmart
// import optional

const setScreen = (model, screenName, screen) => {
  associate(model, "lastScreen", screenName);
  saveModel(model);
  document.body.setChild(screen);
}

const populateDetails = (parent, spec) => {
  for (const detail of spec) {
    const detailValue = parent.querySelector("." + detail.clazz + " .ll-value");
    detailValue.textContent = detail.value;
  }
};

const control = {};

control.searchScreen = (model, forceReload) => {
  const screen = view.searchScreen();
  
  const searchQuery = screen.querySelector(".ll-search-query");
  const searchStore = screen.querySelector(".ll-search-store");
  const searchResults = screen.querySelector(".ll-search-results");
  const searchNext = screen.querySelector(".ll-search-next");
  const searchPrev = screen.querySelector(".ll-search-prev");
  const searchSumbit = screen.querySelector(".ll-search-submit");
  console.log(screen);
  const search = () => {
    const options = {};
    associate(options, "query", searchQuery.value, (x) => x, " ");
    associate(options, "store", searchStore.value, (x) => x);
    associate(options, "numItems", 10);
    associate(options, "start", model.offset, (x) => x);
    
    searchResults.setChild(control.loading());
    walmart.search(
      options,
      (items) => {
        associate(model, "totalResults", items.totalResults, (x) => x, 0);
        saveModel();
        
        searchResults.setChild(control.results(model, items));
        toggleNavigation();
      },
      (err) => {
        delete model.totalResults;
        delete model.offset;
        searchResults.setChild(control.error(err));
        toggleNavigation();
      } 
    )
  }
  
  const toggleNavigation = () => {
    console.log(model)
    if (typeof model.totalResults === "undefined") {
      searchNext.disabled = true;
      searchPrev.disabled = true;
    } else {
      currentOffset = typeof model.offset !== "undefined" ? model.offset : 0;        
      searchPrev.disabled = currentOffset <= 0 ;
      searchNext.disabled = model.totalResults < currentOffset + 10;
    }
  }

  associate(searchQuery, "value", model.lastQuery, (x) => x);
  associate(searchStore, "value", model.lastStore, (x) => x);
  
  if (forceReload) { 
    search(); 
  } else { 
    toggleNavigation(); 
  }

  searchSumbit.addEventListener("click", () => {
    associate(model, "lastQuery", searchQuery.value, (x) => x)
    associate(model, "lastStore", searchStore.value, (x) => x)
    associate(model, "offset", 0)
    saveModel(model);
    
    search();
  });

  searchNext.addEventListener("click", () => {
    currentOffset = typeof model.offset !== "undefined" ? model.offset : 0;
    if (typeof model.totalResults !== "undefined" && currentOffset + 10 < model.totalResults) {
      associate(model, "offset", currentOffset + 10);
      saveModel(model);
      search();
    }
  });
  
  searchPrev.addEventListener("click", () => {
    currentOffset = typeof model.offset !== "undefined" ? model.offset : 0;    
    if (0 < currentOffset ) {
      const nextOffset = 10 < currentOffset ? currentOffset - 10 : 0
      associate(model, "offset", nextOffset);
      saveModel(model);
      search();
    }
  });
  
  const searchScan = screen.querySelector(".ll-search-scan");
  searchScan.addEventListener("click", () => {
    setScreen(model, "scanner", control.scannerScreen(model))
  });

  return screen;
};

control.loading = () => view.loading();

control.error = (err) => {
  console.log("ERROR!");
  console.log(err);
  const errorMessage = view.error();
  errorMessage.textConent = err.message;
  return errorMessage;
};

control.results = (model, results) => {
  if (results.items.length === 0) {
    return view.emptyResultsList();
  } else {
    const resultsContainer = view.resultsList();
    const resultElements = results.items
      .filter(x => x.upc)
      .map((x) => control.result(model, x));
    resultsContainer.setChildren(resultElements);
    return resultsContainer;
  }
};

control.result = (model, item) => {
  const container = view.result();
  
  const resultThumbnail = container.querySelector(".ll-result-image");
  resultThumbnail.src = (new Optional(item))
    .map((x) => x.thumbnailImage)
    .getOrElse("https://via.placeholder.com/64?text=?");

  const resultName = container.querySelector(".ll-result-name");
  resultName.textContent = (new Optional(item))
    .map((x) => x.name)
    .getOrElse("---");

  populateDetails(container, [
    {
      clazz: "li-result-price", 
      value: (new Optional(item))
        .map((x) => x.salePrice)
        .map((x) => "$"+x)
        .getOrElse("N/A")
    },
    {
      clazz: "li-result-stock", 
      value: (new Optional(item))
        .map((x) => x.stock)
        .getOrElse("N/A")
    }
  ]);

  container.addEventListener("click", () => {
    associate(model, "lastUpc", item.upc);
    saveModel(model);
    setScreen(model, "item", control.itemScreen(model))
  });

  return container;
}

control.itemData = (item) => {
  const container = view.itemData();
  
  const itemThumbnail = container.querySelector(".ll-item-image");
  itemThumbnail.src = (new Optional(item))
        .map((x) => x.largeImage)
        .getOrElse("https://via.placeholder.com/64?text=?");

  const upc = (new Optional(item))
        .map((x) => item.upc)
        .getOrElse("00000000000");

  const itemBarcode = container.querySelector(".ll-item-barcode");
  JsBarcode(itemBarcode, upc, {format: "upc", valid: () => true});
  itemBarcode.removeAttributeNS(null, "width");
  itemBarcode.removeAttributeNS(null, "height");
  
  populateDetails(container, [
    {
      clazz: "li-item-name", 
      value: (new Optional(item))
        .map((x) => x.name)
        .getOrElse("---")
    },
    {
      clazz: "li-item-upc",
      value: upc
    },
    {
      clazz: "li-item-price", 
      value: (new Optional(item))
        .map((x) => x.salePrice)
        .map((x) => "$"+x)
        .getOrElse("N/A")
    },
    {
      clazz: "li-item-stock", 
      value: (new Optional(item))
        .map((x) => x.stock)
        .getOrElse("N/A")
    },
    {
      clazz: "li-item-category", 
      value: (new Optional(item))
        .map((x) => x.categoryPath)
        .getOrElse("N/A")
    },
  ]);
    
  const itemDescription = container.querySelector(".ll-item-description");
  itemDescription.innerHTML = (new Optional(item))
        .map((x) => x.shortDescription)
        .getOrElse("-----");

  return container;
}

control.itemScreen = (model) => {
  const options = {"upc": model.lastUpc};
  
  const screen = view.itemScreen();
  const itemContainer = screen.querySelector(".ll-item-container");

  itemContainer.setChild(control.loading());
  walmart.lookupUpc(
    options,
    (item) => itemContainer.setChild(control.itemData(item.items[0])),
    (err) => itemContainer.setChild(control.error(err))
  )
  
  const itemBackFab = screen.querySelector(".ll-item-return");
  itemBackFab.addEventListener("click", () =>
    setScreen(model, "search", control.searchScreen(model, true))
  );
    
  return screen;
}



control.scannerScreen = (model) => {
  const screen = view.scannerScreen();
  const scannerPreview = screen.querySelector(".ll-scanner-preview");
  const scannerCancel = screen.querySelector(".ll-scanner-cancel");
  Quagga.init({
    inputStream : {
      type : "LiveStream",
      target: scannerPreview,
      constraints: { 
        width: window.innerWidth * 0.9,
        height: window.innerHeight * 0.9,
        facingMode: "environment" 
      },
    },
    numOfWorkers: 2,
    frequency: 10,
    locator: {
      patchSize: "medium",
      halfSample: true
    },
    decoder : { readers : ["upc_reader"] }
  }, function(err) {
    if (err) { console.log(err); return; }
    
    Quagga.onProcessed((result) => {
      const canvas= Quagga.canvas.dom.overlay;
      const ctx = Quagga.canvas.ctx.overlay;
      const drawPath = Quagga.ImageDebug.drawPath;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (box of result.boxes) {
        const color = box == result.box ? "blue" : "green";
        drawPath(box, {x: 0, y: 1}, ctx, {color: color, lineWidth: 2});
      }
      
      if (result.codeResult && result.codeResult.code) {
        drawPath(result.line, {x: "x", y: "y"}, ctx, {color: "red", lineWidth: 3});
      }
    });

    Quagga.onDetected(function(result) {
      associate(model, "lastUpc", result.codeResult.code);
      saveModel(model);
      Quagga.stop();

      setScreen(model, "item", control.itemScreen(model));
    });
    
    Quagga.start();
  });
  
  
  scannerCancel.addEventListener("click", () => {
    Quagga.stop();
    setScreen(model, "search", control.searchScreen(model, true));
  });
  return screen;
};
