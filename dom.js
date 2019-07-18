export const dom = {};

/**
 * Creates an Element to be cloned for later use.
 *  
 * @param {string} spec an html document as a string
 * @return {Element} the element based on the spec
 */
const fromTemplate = spec => 
  new DOMParser()
    .parseFromString(spec, "text/html")
    .body.firstChild;

/**
 * Creates an Element to be cloned for later use.
 *  
 * @param {string| function} spec an html document as a string or function that will provide an Element
 * @return {function} an element factory
 */
dom.factory = spec => {
  const el = typeof spec === "function" 
    ? spec() : fromTemplate(spec)
  return () => el.cloneNode(true);
}

/**
 * Querys a set of selectors for a given parent.
 * The return type will have the same keys as the selector set. 
 * The values of the return will be the selected element.
 *  
 * @param {Element} parent The View be queried
 * @param {object} selectors a Mapping of strings to css selectors
 * @return {object} a Mapping of strings to Elements
 */
dom.query = (parent, selectors) => 
  Object.freeze(Object.entries(selectors)
    .map(([key, selector]) => [key, parent.querySelector(selector)])
    .reduce((obj, [key, view]) => {obj[key] = view; return obj;}, {})); 

const ParentNode = [Element, Document, DocumentFragment];

ParentNode.map(obj => obj.prototype).forEach(proto => {
  /**
   * Patched Function: remove all chlidren elements
   */
  proto.clearChildren = function() {
    while(this.firstChild) { 
      this.removeChild(this.firstChild); 
    }
  }

  /**
   * Patched Function: append all chlidren elements
   */
  proto.appendChildren = function(children) {
    for(const child of children) { 
      this.appendChild(child);
    }
  };
  
  /**
   * Patched Property: set value to be the only child of the element
   */
  Object.defineProperty(proto, 'child', {
    set(value) {
      this.clearChildren();
      this.appendChild(value);
    },
  });

  /**
   * Patched Property: set value to be the only children of the element
   */
  Object.defineProperty(proto, 'children', {
    set(value) {
      this.clearChildren();
      this.appendChildren(value);
    },
  });
}); 