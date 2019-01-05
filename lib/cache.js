class Cache {
  constructor(func, policy) {
    this.load = func;
    this.store = new Map();
    if (typeof policy === "undefined")
      this.policy = new LruPolicy(1024);
  }
  
  get(key) {
    this.policy.onAccess(this, key);
    if (this.has(key)) {
      const value = this.store.get(key);
      this.policy.onHit(this, key, value);
      return value;
    } else {
      const value = this.load(key);
      this.store.set(key, value);
      this.policy.onWrite(this, key, value);
      return value;
    }
  }

  set(key, value) {
    this.policy.onAccess(this, key);
    this.store.set(key, value);
    this.policy.onWrite(this, key, value);
  }

  has(key) {
    return this.store.has(key);
  }

  evict(key) {
    this.store.delete(key);
  }

  get size() {
    return this.store.size;
  } 

  static wrap(func, policy) {
    const cache = new Cache(func, policy);
    return (x) => cache.get(x);
  }
}

class RandomReplacement {
  constructor(limit) {
    this.limit = limit;
    this.queue = new RandomQueue();
  }

  onAccess(cache, key) {
    this.queue.push(key);
  }
  
  onHit(cache, key, value) { }

  onWrite(cache, key, value) {
    while (limit < cache.size) {
      cache.evict(this.queue.pop(key));
    }
  }
}

class LruPolicy {
  constructor(limit) {
    this.limit = limit;
    this.deque = new LinkedMap();
  }

  onAccess(cache, key) {
    if (this.deque.has(key)) {
      this.deque.delete(key);
    }
    this.deque.pushLast(key);
  }
  
  onHit(cache, key, value) { }

  onWrite(cache, key, value) {
    while (limit < cache.size) {
      cache.evict(this.startKey);
      this.deque.popFirst();
    }
  }
}

class LfuPolicy {
  constructor(limit) {
    this.limit = limit;
    this.counter = new FrequencyTable();
  }

  onAccess(cache, key) {
    this.counter.increment(key);
  }
  
  onHit(cache, key, value) { }

  onWrite(cache, key, value) {
    while (limit < cache.size) {
      const leastKey = this.counter.popByFrequency(this.counter.minFreq);
      cache.evict(leastKey);
    }
  }
}


class LfruPolicy {
  constructor(protectedLimit, unprotectedLimit) {
    this.protectedLimit = protectedLimit;
    this.unprotectedLimit = unprotectedLimit;
    this.deque = new LinkedMap();
    this.counter = new FrequencyTable();
  }

  onAccess(cache, key) {
    if (this.deque.has(key)) {
      this.deque.delete(key);
    } 
    if (!this.counter.has(key)) {
      this.deque.pushLast(key);
    }
  }
  
  onHit(cache, key, value) { }

  onWrite(cache, key, value) {
    this.deque.pushLast(key);
    while (this.protectedLimit < this.deque.size) {
      this.counter.increment(this.startKey);
      this.deque.popFirst();
    }
    while (this.unprotectedLimit < this.counter.size) {
      const leastKey = this.counter.popByFrequency(this.counter.minFreq);
      cache.evict(leastKey);
    }
  }
}


class EvictAfterWritePolicy {
  constructor(delay) {
    this.delay = delay;
    this.lastWrite = new LinkedMap();
  }

  onAccess(cache, key) {
    while (this.delay < Date.now() - this.lastWrite.peekFirst()) {
      cache.evict(this.lastWrite.firstKey);
      this.lastWrite.popFirst();
    }
  }

  onHit(cache, key, value) { }

  onWrite(cache, key, value) {
    this.lastWrite.pushLast({time: Date.now(), key: key});
  }
}


class EvictAfterReadPolicy {
  constructor(delay) {
    this.delay = delay;
    this.lastRead = new LinkedMap();
  }

  onAccess(store, key) {
    while (this.delay < Date.now() - this.lastRead.peekFirst()) {
      store.delete(this.lastRead.firstKey);
      this.lastRead.popFirst();
    }
    this.lastRead.set(key, Date.now());
  }

  onHit(cache, key, value) { }

  onWrite(cache, key, value) { }
}

class LifoPolicy {
  constructor(limit) {
    this.limit = limit;
    this.deque = new LinkedMap();
  }

  onAccess(cache, key) { }
  
  onHit(cache, key, value) { }

  onWrite(cache, key, value) {
    while (limit < cache.size - 1) {
      cache.evict(this.deque.firstKey);
      this.deque.popFirst();
    }
    this.deque.pushLast(key);
  }
}

class FiloPolicy {
  constructor(limit) {
    this.limit = limit;
    this.list = new LinkedMap();
  }

  onAccess(cache, key) { }
  
  onHit(cache, key, value) { }

  onWrite(cache, key, value) {
    while (limit < cache.size - 1) {
      cache.evict(this.deque.lastKey);
      this.deque.popLast();
    }
    this.deque.pushLast(key);
  }
}