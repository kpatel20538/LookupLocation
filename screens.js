import { app } from "./app.js";
import { dom } from "./dom.js";
import { views } from "./views.js";
import { models } from "./models.js";
import { controls } from "./controls.js";
import { walmart } from "./walmart.js";

export const screens = {};

screens.search = intent => {
  const model = models.search(intent);
  const view = views.searchScreen();
  const tags = dom.query(view, {
    query: ".ll-search-query",
    store: ".ll-search-store",
    submit: ".ll-search-submit",
    results: ".ll-search-results",
    next: ".ll-search-next",
    prev: ".ll-search-prev",
    scan: ".ll-search-scan"
  });

  const onScan = () => {
    app.screen = screens.scanner({ lastSearch: model });
  };

  const onSubmit = () => {
    model.query = tags.query.value;
    model.store = tags.store.value;
    model.start = 0;
    requestSearch();
  }

  const onNext = () => {
    model.start += model.numItems;
    requestSearch();
  }

  const onPrev = () => {
    model.start -= model.numItems;
    requestSearch();
  };

  const onSuccess = (results) => {
    model.results = results;
    model.totalResults = results.totalResults;

    assignResults(true);
    onComplete();
  }

  const onError = (err) => {
    delete model.results;
    delete model.totalResults;
    model.start = 0;
    
    tags.results.child = controls.error(err);
    onComplete();
  }

  const onComplete = () => {
    const end = model.start + model.numItems
    tags.next.disabled = model.totalResults < end;
    tags.prev.disabled = model.start <= 0;
    
    Object.assign(app.storage, {
      screen: "search",
      intent: model
    });
  }

  const requestSearch = () => {
    tags.results.child = views.loading();
    walmart.search({
      query: model.query,
      store: model.store,
      numItems: model.numItems,
      start: model.start
    })
      .then(onSuccess)
      .catch(onError);
  }

  const assignResults = (force) => {  
    if (typeof model.results !== "undefined" ) {
      if (typeof model.results.items !== "undefined" && model.results.items.length !== 0) {
        tags.results.child = controls.results({data: model.results, onItemClick: onItemClick});
      } else if (force) {
        tags.results.child = views.emptyResultsList();
      }
    }
  }

  const onItemClick = (upc) => {
    app.screen = screens.item({ 
      upc: upc, 
      lastSearch: model 
    });
  }

  tags.query.value = model.query;
  tags.store.value = typeof model.store === "undefined" ? "" : model.store;  
  assignResults(false);
  
  tags.submit.addEventListener("click", onSubmit);
  tags.next.addEventListener("click", onNext);
  tags.prev.addEventListener("click", onPrev);
  tags.scan.addEventListener("click", onScan);

  return view;
}

screens.item = intent => {
  const model = models.item(intent);
  const view = views.itemScreen();
  const tags = dom.query(view, {
    container: ".ll-item-container",
    back: ".ll-item-return"
  });

  const onSuccess = (results) => {
    tags.container.child = controls.itemData(results.items[0]);
    onComplete();
  }

  const onError = (err) => {
    tags.container.child = controls.error(err);
    onComplete();
  }

  const onComplete = () => {
    Object.assign(app.storage, {
      screen: "item",
      intent: model
    });
  }

  const onReturn = () => {
    Object.assign(app.storage, {
      screen: "search",
      intent: model.lastSearch
    });
    app.screen = screens.search(model.lastSearch);

  }

  tags.back.addEventListener("click", onReturn);
  tags.container.child = views.loading();
  walmart.lookupUpc({upc: model.upc})
    .then(onSuccess)
    .catch(onError);
  return view;
}

screens.scanner = intent => {
  const model = models.scanner(intent);
  const view = views.scannerScreen();
  const tags = dom.query(view, {
    preview: ".ll-scanner-preview",
    cancel: ".ll-scanner-cancel"
  })

  Quagga.init({
    inputStream : {
      type : "LiveStream",
      target: tags.preview,
      constraints: { 
        facingMode: "environment" 
      },
    },
    numOfWorkers: 4,
    frequency: 20,
    locator: { patchSize: "large", halfSample: true },
    decoder: { readers : ["upc_reader"] }
  }, err => {
    if (err) { tags.preview.child = controls.error({message: err.name + ": " + err.message}) ; }

    Quagga.onProcessed(result => {
      const canvas= Quagga.canvas.dom.overlay;
      const ctx = Quagga.canvas.ctx.overlay;
      const drawPath = Quagga.ImageDebug.drawPath;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (typeof result !== "undefined") {
        if(typeof result.boxes !== "undefined") {
          for (const box of result.boxes) {
            const color = box === result.box ? "blue" : "green";
            drawPath(box, {x: 0, y: 1}, ctx, {color: color, lineWidth: 2});
          }
        }
      
        if (typeof result.codeResult !== "undefined" && typeof result.codeResult.code !== "undefined") {
          drawPath(result.line, {x: "x", y: "y"}, ctx, {color: "red", lineWidth: 3});
        }
      }
    });

    Quagga.onDetected(result => onSuccess(result.codeResult.code));
    Quagga.start();
  });
  
  const onCancel = () => {
    Quagga.stop();
    app.screen = screens.search(model.lastSearch);
  }

  const onSuccess = upc => {
    Quagga.stop();
    app.screen = screens.item({
      upc: upc, lastSearch: model.lastSearch
    });
  }
  
  tags.cancel.addEventListener("click", onCancel);
  return view;
}
