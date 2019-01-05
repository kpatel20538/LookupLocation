export const dom = {};

const fromTemplate = spec => 
  new DOMParser()
    .parseFromString(spec, "text/html")
    .body.firstChild;

dom.factory = spec => {
  const el = typeof spec === "function" 
    ? spec() : fromTemplate(spec)
  return () => el.cloneNode(true);
}

dom.query = (parent, selectors) => 
  Object.freeze(Object.entries(selectors)
    .map(([key, selector]) => [key, parent.querySelector(selector)])
    .reduce((obj, [key, view]) => {obj[key] = view; return obj;}, {})); 

const ParentNode = [Element, Document, DocumentFragment];

ParentNode.map(obj => obj.prototype).forEach(proto => {
  proto.clearChildren = function() {
    while(this.firstChild) { 
      this.removeChild(this.firstChild); 
    }
  }

  proto.appendChildren = function(children) {
    for(const child of children) { 
      this.appendChild(child);
    }
  };
  
  Object.defineProperty(proto, 'child', {
    set(value) {
      this.clearChildren();
      this.appendChild(value);
    },
  });

  Object.defineProperty(proto, 'children', {
    set(value) {
      this.clearChildren();
      this.appendChildren(value);
    },
  });
}); 