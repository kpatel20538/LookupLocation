const objectAccumlator = (obj, [key, value]) => {
    obj[key] = value;
    return obj;
}

const RangeBase = (start, stop, step) => {
  if (typeof stop === "undefined") {
    stop = start;
    start = 0;
  }
  if (typeof step === "undefined") {
    step = 1;
  }
  length = Math.max((stop - start) / step | 0, 0);
  
  return {
    start: start, 
    stop: stop, 
    step: step, 
    length: length,
    [Symbol.iterator]: function*() {
      for (let value = this.start; value < this.stop; value += this.step) {
        yield value;
      }
    }
  };
}

const Range = (start, stop, step) => {
  return Object.freeze(new Proxy(RangeBase(start, stop, step), {
    get(target, key) {
      const idx = Number(key.toString());
      if (Number.isInteger(idx)) {
        const value = target.start + target.step * idx;
        if (value < stop) {
          return value;
        }
      }
      return target[key];
    },
    has(target, key) {
      const idx = Number(key.toString());
      return Number.isInteger(idx) && 0 <= idx && idx < target.length;
    },
    ownKeys(target) {
      const arr = [];
      for (let idx = 0; idx < target.length; idx++) {
        arr.push(idx);
      }
      return arr;
    }
  }));
};