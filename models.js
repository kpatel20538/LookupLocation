export const models = {};

const searchIntent = {
  query: "",
  store: undefined,
  start: 0,
  totalResults: 0,
  numItems: 10,
  results: {}
};

const resultDataIntent = {
  name: "---",
  thumbnailImage: "https://via.placeholder.com/64?text=?",
  salePrice: "N/A",
  stock: "N/A",
};

const itemIntent = {
  upc: "00000000000",
  lastSearch: searchIntent
};

const itemDataIntent = {
  name: "---",
  thumbnailImage: "https://via.placeholder.com/64?text=?",
  upc: "00000000000",
  salePrice: "N/A",
  stock: "N/A",
  categoryPath: "N/A",
  shortDescription: "---",
};

const scannerIntent ={
  lastSearch: searchIntent
};

/**
 * Provide a Object Property Spec that coerces a fields value
 */
const validator = (init, coerce) => {
  coerce = typeof coerce === "function" ? coerce : x => x; 
  let prop = init;
  return {
    enumerable: true,
    get() { return prop; },
    set(value) { 
      const validated = coerce.call(this, value);
      prop = validated !== undefined ? validated : init;      
    }
  };
}

/**
 * Mandate a non-empty string (for use in validator)
 */
const acceptNonEmpty = str => { 
  if(str !== "") { 
    return str; 
  } 
}

/**
 * Mandate a positive int (for use in validator)
 */
const acceptPositiveInt = obj => { 
  const num = obj | 0;
  if(isFinite(num) && 0 < num) { 
    return num; 
  } 
}

/**
 * Coerce in a monetary format (for use in validator)
 */
const acceptPrice = str => { 
  if(str || str === "0" || str === 0) {
    return accounting.formatMoney(str);
  }
}

/**
 * Coerce to within a range (for use in validator)
 */
const acceptWithinRange = (min, max, obj) => {
  if (obj < min) {
    return min;
  } else if (max < obj) {
    return max;
  } else {
    return obj;
  }
}

/**
 * Provide a model that coerces its fields to be valid values for a search query
 */
models.search = (intent) => {
  const model = Object.create(searchIntent, { 
    query: validator(searchIntent.query),
    store: validator(searchIntent.store, acceptPositiveInt),
    start: validator(searchIntent.start, 
      function(x) { return acceptWithinRange(0, this.totalResults, x); })
  });
  return Object.assign(model, intent);
}

/**
 * Provide a model that coerces its fields to be valid values for a single search result 
 */
models.resultData = (intent) => {
  const model = Object.create(resultDataIntent, { 
    name: validator(resultDataIntent.name, acceptNonEmpty),
    thumbnailImage: validator(resultDataIntent.thumbnailImage, acceptNonEmpty),
    salePrice: validator(resultDataIntent.salePrice, acceptPrice),
    stock: validator(resultDataIntent.stock, acceptNonEmpty)
  });
  return Object.assign(model, intent);
}

/**
 * Provide a model that coerces its fields to be valid values for a single product's upc
 */
models.item = (intent) => {
  const model = Object.create(itemIntent, {
    upc: validator(itemIntent.upc, acceptNonEmpty),
  });
  return Object.assign(model, intent)
}

/**
 * Provide a model that coerces its fields to be valid values for a single product's full information
 */
models.itemData = (intent) => {
  const model = Object.create(itemDataIntent, {
    name: validator(itemDataIntent.name, acceptNonEmpty),
    thumbnailImage: validator(itemDataIntent.thumbnailImage, acceptNonEmpty),
    upc: validator(itemDataIntent.name, acceptNonEmpty),
    salePrice: validator(itemDataIntent.salePrice, acceptPrice),
    stock: validator(itemDataIntent.stock, acceptNonEmpty),
    categoryPath: validator(itemDataIntent.categoryPath, acceptNonEmpty),
    shortDescription: validator(itemDataIntent.shortDescription, acceptNonEmpty),
  });
  return Object.assign(model, intent);
}

/**
 * Provide a model that coerces its fields to be valid values for the barcode scanner 
 */
models.scanner = (intent) => {
  const model = Object.create(scannerIntent);
  return Object.assign(model, intent);
}


