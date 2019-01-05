import { dom } from "./dom.js";

export const views = {}

views.loading = dom.factory(`
  <div class="ll-loading m-5 d-flex justify-content-center align-items-center">
    <div class="spinner-border" role="status">
      <span class="sr-only"> Loading... </span>
    </div>
  </div>
`);

views.error = dom.factory(`
  <div class="ll-message ll-error alert alert-danger"> 
    <!-- ERROR MESSAGE -->
  </div>
`);

views.muted = dom.factory(`
  <span class="text-muted"> 
    <!-- MUTED TEXT -->
  </span>
`)

views.normal = dom.factory(`
  <span class="font-weight-normal"> 
    <!-- NORMAL TEXT -->
  </span>
`)

views.blueBadge = dom.factory(`
  <span class="badge badge-primary px-2 py-1"> 
    <!-- BLUE BADGE TEXT -->
  </span>
`)

views.redBadge = dom.factory(`
  <span class="badge badge-danger px-2 py-1"> 
    <!-- RED BADGE TEXT -->
  </span>
`)

views.emptyResultsList = dom.factory(`
  <div class="ll-message ll-no-results alert alert-warning"> 
    No Items Found 
  </div>
`);

views.resultsList = dom.factory(`
  <div class="ll-results-container mb-6"> 
    <!-- RESULT DATA VIEWS -->
  </div>
`);

views.resultData = dom.factory(`
  <div class="ll-result-container border rounded container d-flex p-1 mb-2">
    <img class="ll-result-image col-4 col-md-2 p-0" /> <!-- THUMBNAIL FIELD --> 
    <div class="ll-result-details col-8">
      <h5 class="ll-result-name">
        <!-- NAME FIELD --> 
      </h5>
      <div class="ll-detail ll-result-price">
        <strong class="ll-key"> Price: </strong>
        <span class="ll-value"> 
          <!-- PRICE FIELD --> 
        </span>
      </div>
      <div class="ll-detail ll-result-stock">
        <strong class="ll-key"> Stock: </strong>
        <span class="ll-value">
          <!-- STOCK FIELD --> 
        </span>
      </div>
    </div>
  </div>
`);

views.searchScreen = dom.factory(`
  <div class="ll-screen ll-search-screen m-3">
    <div class="ll-search-container">
      <div class="ll-search-bar input-group mb-4">
        <input class="ll-search-query form-control col-auto" placeholder="Item Name" type="text" />
        <input class="ll-search-store form-control col-3" placeholder="Store #" type="number" min="1"/>
        <div class="input-group-append">
          <button class="ll-search-submit btn btn-primary" role="button"> Go! </button>
        </div>
      </div>
      <div class="ll-search-results"> 
        <!-- SEARCH RESULT VIEWS -->
      </div>
      <div class="ll-button-bar btn-group btn-block border-top my-5 pt-3 pb-5" role="group">
        <button class="ll-search-prev btn btn-primary col" role="button"> Previous </button>
        <button class="ll-search-next btn btn-primary col" role="button"> Next </button>
      </div>
    </div>
    <button class="ll-search-scan ll-fab btn btn-primary btn-lg m-4"> Scan UPC </button>
  </div>
`);

views.itemData = dom.factory(`
  <div class="ll-item-data container border rounded mx-auto my-2 p-2">
    <div class="row mb-3">
      <img class="ll-thumbnail ll-item-image col-6"/> <!-- THUMBNAIL FIELD --> 
      <div class="ll-item-details col-6">
        <div class="ll-detail ll-item-name">
          <strong class="ll-key"> Name: </strong>
          <span class="ll-value"> 
            <!-- NAME FIELD -->
          </span>
        </div>
        <div class="ll-detail ll-item-upc">
          <strong class="ll-key"> UPC: </strong>
          <span class="ll-value"> </span>
        </div>
        <div class="ll-detail ll-item-price">
          <strong class="ll-key"> Price: </strong>
          <span class="ll-value"> 
            <!-- PRICE FIELD --> 
          </span>
        </div>
        <div class="ll-detail ll-item-stock">
          <strong class="ll-key"> Stock: </strong>
          <span class="ll-value"> 
            <!-- STOCK FIELD --> 
          </span>
        </div>
        <div class="ll-detail ll-item-category">
          <strong class="ll-key"> Category: </strong>
          <span class="ll-value"> 
            <!-- CATEGORY FIELD --> 
          </span>
        </div>
      </div>
    </div>
    <div class="row mb-3 p-3">
      <svg class="ll-item-barcode col"> 
        <!-- BARCODE FIELD --> 
      </svg>
    </div>
    <div class="row mb-5">
      <div class="ll-item-description col"> 
        <!-- DESCRIPTION FIELD --> 
      </div>
    </div>
  </div>
`);

views.itemScreen = dom.factory(`
  <div class="ll-screen ll-item-screen">
    <div class="ll-item-container p-2"> 
      <!-- ITEM DATA VIEW --> 
    </div>
    <button class="ll-item-return ll-fab btn btn-primary btn-lg m-4" type="button"> Back to Search </div>
  </div>
`);

views.scannerScreen = dom.factory(`
  <div class="ll-screen ll-scanner-screen">
    <div class="ll-scanner-preview"> 
      <!-- SCANNER PREVIEW --> 
    </div>
    <button class="ll-scanner-cancel btn btn-danger btn-block" type="button"> Cancel </div>
  </div>
`);

