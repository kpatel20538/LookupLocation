Node.prototype.removeChildren = function () {
  while (this.firstChild) { this.firstChild.remove(); }
};

Node.prototype.appendChildren = function (children) {
  for (const child of children) { this.appendChild(child); }
};

Node.prototype.setChildren = function (children) {
  this.removeChildren();
  this.appendChildren(children);
};

Node.prototype.setChild = function (child) {
  this.removeChildren();
  this.appendChild(child);
};

const htmlFactory = (providePrototype) => {
  const prototype = providePrototype();
  return () => prototype.cloneNode(true);
};