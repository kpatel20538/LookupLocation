function isNull(obj) {
    return typeof obj === "undefined";
}

class LinkedMap {
    constructor () {
        this.nodes = new Map();
        this.firstKey = null;
        this.lastKey = null; 
    }

    get size () { return this.nodes.size; }

    isEmpty() { 
        return isNull(this.firstKey);
    }

    isSingleton() { 
        return !isNull(this.firstKey) && this.firstKey === this.lastKey;
    }

    has(key) { return this.nodes.has(key); }
    
    get(key) { 
        if (this.has(key)) {
            return this.nodes.get(key).value; 
        }
    }

    set(key, value) { 
        if (this.has(key)) {
            return this.nodes.get(key).value; 
        } else {
            this.pushLast(key, value);
        }
    }

    delete(key) {
        if (this.has(key)) {
            if (this.firstKey === key) {
                this.popFirst();
            } else if (this.lastKey === key) {
                this.popLast();
            } else {
                const node = this.nodes.get(key);
                const prevNode = this.nodes.get(node.prev);
                const nextNode = this.nodes.get(node.next);
                prevNode.next = node.next;
                nextNode.prev = node.prev;
                this.nodes.delete(key);
            }
            return true;
        }
        return false;
        
    }

    pushFirst(key, value) {
        if (this.isEmpty()) {
            this.nodes.set(key, {value: value, next: null, prev: null});
            this.firstKey = key;
            this.lastKey = key;
        } else if (!this.has(key)) {
            this.nodes.set(key, {value: value, next: this.firstKey, prev: null});
            const oldNode = this.nodes.get(this.firstKey);
            oldNode.prev = key;
            this.firstKey = key;
        }
    }
    
    pushLast(key, value) {
        if (this.isEmpty()) {
            this.nodes.set(key, {value: value, next: null, prev: null});
            this.firstKey = key;
            this.lastKey = key;
        } else if (!this.has(key)) {
            this.nodes.set(key, {value: value, next: null, prev: this.lastKey});
            const oldNode = this.nodes.get(this.lastKey);
            oldNode.next = key;
            this.lastKey = key;
        }
    }

    pushAfter(pivot, key, value) {
        if (isNull(pivot)) {
            pushFirst(key, value)
        } else if (pivot === this.lastKey) {
            pushLast(key, value)
        } else if (this.has(pivot) && !this.has(key)) {
            const pivotNode = this.nodes.get(pivot);
            const afterPivotNode = this.nodes.get(pivotNode.next);
            pivotNode.next = key;
            afterPivotNode.prev = key;
            this.nodes.set(key, {value: value, next: pivotNode.next, prev: pivot});
        }
    }
    
    pushBefore(pivot, key, value) {
        if (isNull(pivot)) {
            pushLast(key, value)
        } else if (pivot === this.firstKey) {
            pushFirst(key, value)
        } else if (this.has(pivot) && !this.has(key)) {
            const pivotNode = this.nodes.get(pivot);
            const beforePivotNode = this.nodes.get(pivotNode.prev);
            pivotNode.prev = key;
            beforePivotNode.next = key;
            this.nodes.set(key, {value: value, next: pivot, prev: pivotNode.prev});
        }
    }

    popFirst() { 
        if (!this.isEmpty()) {
            const oldNode = this.nodes.get(this.firstKey);
            this.nodes.delete(this.firstKey);
            this.firstKey = oldNode.next;
            if (this.isSingleton()) {
                this.lastKey = null;    
            } else {
                const newNode = this.nodes.get(this.firstKey);
                newNode.prev = null;
            }
            return oldNode.value;
        }
    }
    
    popLast() { 
        if (!this.isEmpty()) {
            const oldNode = this.nodes.get(this.lastKey);
            this.nodes.delete(this.lastKey);
            this.lastKey = oldNode.prev;
            if (this.isSingleton()) {
                this.firstKey = null;
            } else {
                const newNode = this.nodes.get(this.lastKey);
                newNode.next = null;
            }
            return oldNode.value;
        }
    }

    get firstValue () { 
        if (!this.isEmpty()) {
            return this.get(this.firstKey);
        }
    }
    
    get lastValue () { 
        if (!this.isEmpty()) {
            return this.get(this.lastKey);
        }
    }
}

class FrequencyTable {
    constructor() {
        this.indexed = new LinkedMap();
        this.frequencies = new Map();
    }

    get size() { return this.frequencies.size; }

    increment(key) {
        const freq = this.ensureFrequency(key);
        if (!this.indexed.has(freq + 1)) {
            this.indexed.pushAfter(freq, freq + 1, new Set());
        }
        this.exchangeFreq(key, freq, freq + 1);
    }

    exchangeFreq(key, oldFreq, newFreq) {
        if (this.indexed.has(oldFreq) && this.indexed.has(newFreq)) {
            const oldRow = this.indexed.get(oldFreq);
            const newRow = this.indexed.get(newFreq);
            oldRow.delete(key);
            newRow.add(key)
            this.frequencies.set(key, newFreq);
            if (oldRow.size === 0) {
                this.indexed.delete(oldFreq);
            }
        }
    }

    decrement(key) {
        const freq = this.ensureFrequency(key);
        if (!this.indexed.has(freq - 1)) {
            this.indexed.pushBefore(freq, freq - 1, new Set());
        }
        this.exchangeFreq(key, freq, freq - 1);
    }

    get(key) {
        return this.frequencies.get(key);
    }

    has(key) {
        return this.frequencies.has(key);
    }

    delete(key) {
        if (this.has(key)) {
            const freq = this.frequencies.get(key);
            this.indexed.get(freq).delete(key);
            this.frequencies.delete(key);
        }
    }

    get minFreq () {
        return this.indexed.firstKey;
    }

    get maxFreq () {
        return this.indexed.lastKey;
    }

    popByFrequency(freq) {
        if (this.indexed.has(freq)) {
            const row =  this.indexed.get(freq);
            const key = row.values().next();
            row.delete(key);
            if (row.size === 0) {
                this.indexed.delete(oldFreq);
            }
            return key;
        }
    }

    ensureFrequency(key) {
        if (!this.frequencies.has(key)) { 
            if (!this.indexed.has(0)) {
                this.indexed.pushFirst(0, new Set());
            }
            this.indexed.get(0).add(key)
            this.frequencies.set(key, 0);
        }
        return this.frequencies.get(key);
    }    
}

class RandomQueue {
    constructor () {
        this.queue = [];
        this.keys = new Set();
    }

    get size () { 
        return this.keys.size;
    }

    has(key) {
        this.keys.has(k);
    }

    push(key) {
        if (!this.has(key)) {
            this.queue.push(key);
            this.keys.add(key);
        }
    }

    pop() {
        const randomIndex = this.size * Math.random() | 0;
        const lastIndex = this.size - 1;
        const lastKey = this.queue[lastIndex];
        this.queue[lastIndex] = this.queue[randomIndex];
        this.queue[randomIndex] = lastKey;
        const randomKey = this.queue.pop();
        this.keys.delete(randomKey);
        return randomKey;
    }
}

