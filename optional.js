const associate = (obj, prop, value, condition, def) => {
  if (typeof condition === "undefined" || condition(value)) {
    obj[prop] = value;
  } else if (typeof def !== "undefined") {
    obj[prop] = def;
  }
}

function Optional(value) {
  this.isEmpty = typeof value === "undefined"; 

  this.getOrElse = (other) => this.isEmpty ? other : value;
  this.map = (func) => this.isEmpty ? this : new Optional(func(value));

  this.filter = (cond) => {
    this.isEmpty = this.isEmpty || !cond(value);
    return this;
  }  
};

function Either(value) {
  this.isError = value instanceof Error; 
  tryFunc = (func) => {
    try {
      value = func(value);
    } catch (err) {
      return new Either(err);
    }
  };
  
  this.getOrElse = (other) => this.isError ? value : other;
  this.getErrorOrElse = (other) => this.isError ? other : value;
  
  this.catch = (errorHandler) => {
    if (this.isError) {
      tryFunc(errorHandler);
    }
    return this;
  };
  this.then = (successHandler, errorHandler) => {
    if (!this.isError) {
      tryFunc(successHandler);
    } else if (typeof errorHandler != "undefined") {
      tryFunc(errorHandler);
    }
    return this;
  };

  this.filter = (cond, message) => {
    this.isError = !cond(value);
    value = new Error(message ? message : "Did not match filter");
    return this;
  }
};

