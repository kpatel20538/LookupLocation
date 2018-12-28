Node.prototype.clearChildren = function() {
  while(this.firstChild) { 
    this.removeChild(this.firstChild);
  }
};

Node.prototype.appendChildren = function(children) {
  for(const child of children) { 
    this.appendChild(child);
  }
};

Node.prototype.setChildren = function(children) {
  this.clearChildren();
  this.appendChildren(children);
};

Node.prototype.setChild = function(child) {
  this.clearChildren();
  this.appendChild(child);
};

const dom = {};

dom.factory = (provider) => {
  const el = provider();
  return () => el.cloneNode(true);
}

dom.make = (el, classList, textContent) => {
  if (typeof el === "string") {
    el = document.createElement(el);
  }
  if (typeof classList !== "undefined") {
    for (const clazz of classList) {
      el.classList.add(clazz);
    }
  }
  if (typeof textContent !== "undefined") {
    const textNode = document.createTextNode(textContent); 
    el.setChild(textNode);
  }
  return el;
}

dom.makeSvg = (el, classList, textContent) => {
  if (typeof el === "string") {
    el = document.createElementNS("http://www.w3.org/2000/svg", el);
  }
  return dom.make(el, classList, textContent);
}
