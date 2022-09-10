/*! securemark v0.262.0 https://github.com/falsandtru/securemark | (c) 2017, falsandtru | UNLICENSED License */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("DOMPurify"), require("Prism"));
	else if(typeof define === 'function' && define.amd)
		define(["DOMPurify", "Prism"], factory);
	else if(typeof exports === 'object')
		exports["securemark"] = factory(require("DOMPurify"), require("Prism"));
	else
		root["securemark"] = factory(root["DOMPurify"], root["Prism"]);
})(this, (__WEBPACK_EXTERNAL_MODULE__6231__, __WEBPACK_EXTERNAL_MODULE__9450__) => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 8767:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  var desc = Object.getOwnPropertyDescriptor(m, k);

  if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
    desc = {
      enumerable: true,
      get: function () {
        return m[k];
      }
    };
  }

  Object.defineProperty(o, k2, desc);
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __exportStar = this && this.__exportStar || function (m, exports) {
  for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));

__webpack_require__(4128);

__exportStar(__webpack_require__(3019), exports);

__exportStar(__webpack_require__(4613), exports);

__exportStar(__webpack_require__(256), exports);

/***/ }),

/***/ 5406:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.ObjectSetPrototypeOf = exports.ObjectGetPrototypeOf = exports.ObjectCreate = exports.ObjectAssign = exports.toString = exports.isEnumerable = exports.isPrototypeOf = exports.hasOwnProperty = exports.isArray = exports.sqrt = exports.log = exports.tan = exports.cos = exports.sign = exports.round = exports.random = exports.min = exports.max = exports.floor = exports.ceil = exports.abs = exports.parseInt = exports.parseFloat = exports.isSafeInteger = exports.isNaN = exports.isInteger = exports.isFinite = exports[NaN] = void 0;
exports[NaN] = Number.NaN, exports.isFinite = Number.isFinite, exports.isInteger = Number.isInteger, exports.isNaN = Number.isNaN, exports.isSafeInteger = Number.isSafeInteger, exports.parseFloat = Number.parseFloat, exports.parseInt = Number.parseInt;
exports.abs = Math.abs, exports.ceil = Math.ceil, exports.floor = Math.floor, exports.max = Math.max, exports.min = Math.min, exports.random = Math.random, exports.round = Math.round, exports.sign = Math.sign, exports.cos = Math.cos, exports.tan = Math.tan, exports.log = Math.log, exports.sqrt = Math.sqrt;
exports.isArray = Array.isArray;
exports.hasOwnProperty = Object.prototype.hasOwnProperty.call.bind(Object.prototype.hasOwnProperty);
exports.isPrototypeOf = Object.prototype.isPrototypeOf.call.bind(Object.prototype.isPrototypeOf);
exports.isEnumerable = Object.prototype.propertyIsEnumerable.call.bind(Object.prototype.propertyIsEnumerable);
exports.toString = Object.prototype.toString.call.bind(Object.prototype.toString);
exports.ObjectAssign = Object.assign;
exports.ObjectCreate = Object.create;
exports.ObjectGetPrototypeOf = Object.getPrototypeOf;
exports.ObjectSetPrototypeOf = Object.setPrototypeOf;

/***/ }),

/***/ 8112:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.splice = exports.pop = exports.push = exports.shift = exports.unshift = exports.indexOf = void 0;

const global_1 = __webpack_require__(4128);

const undefined = void 0;

function indexOf(as, a) {
  if (as.length === 0) return -1;
  return a === a ? as.indexOf(a) : as.findIndex(a => a !== a);
}

exports.indexOf = indexOf;

function unshift(as, bs) {
  if ('length' in as) {
    if (as.length === 1) return bs.unshift(as[0]), bs;
    if (global_1.Symbol.iterator in as) return bs.unshift(...as), bs;

    for (let i = as.length; i--;) {
      bs.unshift(as[i]);
    }
  } else {
    bs.unshift(...as);
  }

  return bs;
}

exports.unshift = unshift;

function shift(as, count) {
  if (count < 0) throw new Error('Unexpected negative number');
  return count === undefined ? [as.shift(), as] : [splice(as, 0, count), as];
}

exports.shift = shift;

function push(as, bs) {
  if ('length' in bs) {
    if (bs.length === 1) return as.push(bs[0]), as;
    if (global_1.Symbol.iterator in bs && bs.length > 50) return as.push(...bs), as;

    for (let i = 0, len = bs.length; i < len; ++i) {
      as.push(bs[i]);
    }
  } else {
    for (const b of bs) {
      as.push(b);
    }
  }

  return as;
}

exports.push = push;

function pop(as, count) {
  if (count < 0) throw new Error('Unexpected negative number');
  return count === undefined ? [as, as.pop()] : [as, splice(as, as.length - count, count)];
}

exports.pop = pop;

function splice(as, index, count, ...values) {
  if (as.length === 0) return push(as, values), [];

  if (index > as.length) {
    index = as.length;
  } else if (index < 0) {
    index = -index > as.length ? 0 : as.length + index;
  }

  count = count > as.length ? as.length : count;
  if (count === 0 && values.length === 0) return [];
  if (count === 1 && values.length === 1) return [[as[index], as[index] = values[0]][0]];

  switch (index) {
    case 0:
      if (count === 0) return unshift(values, as), [];
      if (count === 1) return [[as.shift()], unshift(values, as)][0];
      break;

    case as.length - 1:
      if (count === 1) return [[as.pop()], push(as, values)][0];
      break;

    case as.length:
      return push(as, values), [];
  }

  return arguments.length > 2 ? as.splice(index, count, ...values) : as.splice(index);
}

exports.splice = splice;

/***/ }),

/***/ 4401:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.template = exports.inherit = exports.merge = exports.extend = exports.overwrite = exports.clone = exports.assign = void 0;

const global_1 = __webpack_require__(4128);

const alias_1 = __webpack_require__(5406);

const type_1 = __webpack_require__(5177);

const array_1 = __webpack_require__(8112);

exports.assign = template((prop, target, source) => target[prop] = source[prop]);
exports.clone = template((prop, target, source) => {
  switch ((0, type_1.type)(source[prop])) {
    case 'Array':
      return target[prop] = source[prop].slice();

    case 'Object':
      switch ((0, type_1.type)(target[prop])) {
        case 'Object':
          return target[prop] = (0, exports.clone)(empty(source[prop]), source[prop]);

        default:
          return target[prop] = source[prop];
      }

    default:
      return target[prop] = source[prop];
  }
});
exports.overwrite = template((prop, target, source) => {
  switch ((0, type_1.type)(source[prop])) {
    case 'Array':
      return target[prop] = source[prop];

    case 'Object':
      switch ((0, type_1.type)(target[prop])) {
        case 'Object':
          return (0, exports.overwrite)(target[prop], source[prop]);

        default:
          return target[prop] = (0, exports.overwrite)(empty(source[prop]), source[prop]);
      }

    default:
      return target[prop] = source[prop];
  }
});
exports.extend = template((prop, target, source) => {
  switch ((0, type_1.type)(source[prop])) {
    case 'undefined':
      return;

    case 'Array':
      return target[prop] = source[prop];

    case 'Object':
      switch ((0, type_1.type)(target[prop])) {
        case 'Object':
          return (0, exports.extend)(target[prop], source[prop]);

        default:
          return target[prop] = (0, exports.extend)(empty(source[prop]), source[prop]);
      }

    default:
      return target[prop] = source[prop];
  }
});
exports.merge = template((prop, target, source) => {
  switch ((0, type_1.type)(source[prop])) {
    case 'undefined':
      return;

    case 'Array':
      switch ((0, type_1.type)(target[prop])) {
        case 'Array':
          return target[prop] = (0, array_1.push)(target[prop], source[prop]);

        default:
          return target[prop] = source[prop].slice();
      }

    case 'Object':
      switch ((0, type_1.type)(target[prop])) {
        case 'Object':
          return (0, exports.merge)(target[prop], source[prop]);

        default:
          return target[prop] = (0, exports.merge)(empty(source[prop]), source[prop]);
      }

    default:
      return target[prop] = source[prop];
  }
});
exports.inherit = template((prop, target, source) => {
  switch ((0, type_1.type)(source[prop])) {
    case 'undefined':
      return;

    case 'Array':
      return target[prop] = source[prop].slice();

    case 'Object':
      switch ((0, type_1.type)(target[prop])) {
        case 'Object':
          return (0, alias_1.hasOwnProperty)(target, prop) ? (0, exports.inherit)(target[prop], source[prop]) : target[prop] = (0, exports.inherit)((0, alias_1.ObjectCreate)(target[prop]), source[prop]);

        default:
          return target[prop] = (0, alias_1.ObjectCreate)(source[prop]);
      }

    default:
      return target[prop] = source[prop];
  }
});

function template(strategy) {
  return walk;

  function walk(target, ...sources) {
    if ((0, type_1.isPrimitive)(target)) return target;

    for (let i = 0; i < sources.length; ++i) {
      const source = sources[i];
      if (source === target) continue;
      if ((0, type_1.isPrimitive)(source)) continue;
      const keys = global_1.Object.keys(source);

      for (let i = 0; i < keys.length; ++i) {
        strategy(keys[i], target, source);
      }
    }

    return target;
  }
}

exports.template = template;

function empty(source) {
  return source instanceof global_1.Object ? {} : (0, alias_1.ObjectCreate)(null);
}

/***/ }),

/***/ 9210:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Cache = void 0;

const global_1 = __webpack_require__(4128);

const alias_1 = __webpack_require__(5406);

const clock_1 = __webpack_require__(7681);

const invlist_1 = __webpack_require__(7452);

const heap_1 = __webpack_require__(818);

const assign_1 = __webpack_require__(4401);

class Cache {
  constructor(capacity, opts = {}) {
    this.settings = {
      capacity: 0,
      age: global_1.Infinity,
      earlyExpiring: false,
      capture: {
        delete: true,
        clear: true
      },
      window: 0,
      resolution: 1,
      offset: 0,
      block: 20,
      sweep: 10,
      limit: 950
    };
    this.overlap = 0;
    this.SIZE = 0;
    this.memory = new global_1.Map();
    this.indexes = {
      LRU: new invlist_1.List(),
      LFU: new invlist_1.List()
    };
    this.expiries = new heap_1.Heap(heap_1.Heap.min);
    this.misses = 0;
    this.sweep = 0;
    this.ratio = 500;

    if (typeof capacity === 'object') {
      opts = capacity;
      capacity = opts.capacity ?? 0;
    }

    const settings = (0, assign_1.extend)(this.settings, opts, {
      capacity
    });
    this.capacity = settings.capacity;
    if (this.capacity >= 1 === false) throw new Error(`Spica: Cache: Capacity must be 1 or more.`);
    this.window = settings.window || this.capacity;
    if (this.window * 1000 >= this.capacity === false) throw new Error(`Spica: Cache: Window must be 0.1% of capacity or more.`);
    this.block = settings.block;
    this.limit = settings.limit;
    this.earlyExpiring = settings.earlyExpiring;
    this.disposer = settings.disposer;
    this.stats = new Stats(this.window, settings.resolution, settings.offset);
  }

  get length() {
    //assert(this.indexes.LRU.length + this.indexes.LFU.length === this.memory.size);
    return this.indexes.LRU.length + this.indexes.LFU.length;
  }

  get size() {
    return this.SIZE;
  }

  evict(node, callback) {
    const index = node.value;
    callback &&= !!this.disposer;
    this.overlap -= +(index.region === 'LFU' && node.list === this.indexes.LRU);
    index.enode && this.expiries.delete(index.enode);
    node.delete();
    this.memory.delete(index.key);
    this.SIZE -= index.size;
    callback && this.disposer?.(node.value.value, index.key);
  }

  ensure(margin, skip) {
    let size = skip?.value.size ?? 0;
    const {
      LRU,
      LFU
    } = this.indexes;

    while (this.size + margin - size > this.capacity) {
      let target;

      switch (true) {
        case (target = this.expiries.peek()) && target !== skip && target.value.expiry < (0, clock_1.now)():
          break;

        case LRU.length === 0:
          target = LFU.last !== skip ? LFU.last : LFU.last.prev;
          break;
        // @ts-expect-error

        case LFU.length > this.capacity * this.ratio / 1000:
          target = LFU.last !== skip ? LFU.last : LFU.length >= 2 ? LFU.last.prev : skip;

          if (target !== skip) {
            LRU.unshiftNode(target);
            ++this.overlap;
          }

        // fallthrough

        default:
          if (this.misses * 100 > LRU.length * this.block) {
            this.sweep ||= LRU.length * this.settings.sweep / 100 + 1 | 0;

            if (this.sweep > 0) {
              LRU.head = LRU.head.next.next;
              --this.sweep;
              this.sweep ||= -(0, alias_1.round)(LRU.length * this.settings.sweep / 100 * 99 / 100);
            } else {
              ++this.sweep;
            }
          }

          target = LRU.last !== skip ? LRU.last : LRU.length >= 2 ? LRU.last.prev : LFU.last;
      }

      this.evict(target, true);
      skip = skip?.list && skip;
      size = skip?.value.size ?? 0;
    }

    return !!skip?.list;
  }

  put(key, value, {
    size = 1,
    age = this.settings.age
  } = {}) {
    if (size < 1 || this.capacity < size || age <= 0) {
      this.disposer?.(value, key);
      return false;
    }

    const expiry = age === global_1.Infinity ? global_1.Infinity : (0, clock_1.now)() + age;
    const node = this.memory.get(key);

    if (node && this.ensure(size, node)) {
      const val = node.value.value;
      const index = node.value;
      this.SIZE += size - index.size;
      index.size = size;
      index.expiry = expiry;

      if (this.earlyExpiring && expiry !== global_1.Infinity) {
        index.enode ? this.expiries.update(index.enode, expiry) : index.enode = this.expiries.insert(node, expiry);
      } else if (index.enode) {
        this.expiries.delete(index.enode);
        index.enode = void 0;
      }

      node.value.value = value;
      this.disposer?.(val, key);
      return true;
    }

    this.ensure(size);
    const {
      LRU
    } = this.indexes;
    this.SIZE += size;
    this.memory.set(key, LRU.unshift({
      key,
      value,
      size,
      expiry,
      region: 'LRU'
    }));

    if (this.earlyExpiring && expiry !== global_1.Infinity) {
      LRU.head.value.enode = this.expiries.insert(LRU.head, expiry);
    }

    return false;
  }

  set(key, value, opts) {
    this.put(key, value, opts);
    return this;
  }

  get(key) {
    const node = this.memory.get(key);

    if (!node) {
      ++this.misses;
      return;
    }

    const expiry = node.value.expiry;

    if (expiry !== global_1.Infinity && expiry < (0, clock_1.now)()) {
      ++this.misses;
      this.evict(node, true);
      return;
    }

    this.misses &&= 0;
    this.sweep &&= 0; // Optimization for memoize.

    if (this.capacity > 3 && node === node.list.head) return node.value.value;
    this.access(node);
    this.adjust();
    return node.value.value;
  }

  has(key) {
    //assert(this.memory.has(key) === (this.indexes.LFU.has(key) || this.indexes.LRU.has(key)));
    //assert(this.memory.size === this.indexes.LFU.length + this.indexes.LRU.length);
    const node = this.memory.get(key);
    if (!node) return false;
    const expiry = node.value.expiry;

    if (expiry !== global_1.Infinity && expiry < (0, clock_1.now)()) {
      this.evict(node, true);
      return false;
    }

    return true;
  }

  delete(key) {
    const node = this.memory.get(key);
    if (!node) return false;
    this.evict(node, this.settings.capture.delete === true);
    return true;
  }

  clear() {
    this.misses = 0;
    this.sweep = 0;
    this.overlap = 0;
    this.SIZE = 0;
    this.ratio = 500;
    this.stats.clear();
    this.indexes.LRU.clear();
    this.indexes.LFU.clear();
    this.expiries.clear();
    if (!this.disposer || !this.settings.capture.clear) return void this.memory.clear();
    const memory = this.memory;
    this.memory = new global_1.Map();

    for (const {
      0: key,
      1: {
        value: {
          value
        }
      }
    } of memory) {
      this.disposer(value, key);
    }
  }

  resize(capacity) {
    if (this.capacity >= 1 === false) throw new Error(`Spica: Cache: Capacity must be 1 or more.`);
    this.capacity = capacity;
    this.window = this.settings.window || this.capacity;
    if (this.window * 1000 >= this.capacity === false) throw new Error(`Spica: Cache: Window must be 0.1% of capacity or more.`);
    this.ensure(0);
  }

  *[Symbol.iterator]() {
    for (const {
      0: key,
      1: {
        value: {
          value
        }
      }
    } of this.memory) {
      yield [key, value];
    }

    return;
  }

  adjust() {
    const {
      capacity,
      ratio,
      limit,
      stats,
      indexes
    } = this;
    if (stats.subtotal() * 1000 % capacity || !stats.full()) return;
    const lenR = indexes.LRU.length;
    const lenF = indexes.LFU.length;
    const lenO = this.overlap;
    const leverage = (lenF + lenO) * 1000 / (lenR + lenF) | 0;
    const rateR0 = stats.rateLRU() * leverage;
    const rateF0 = stats.rateLFU() * (1000 - leverage);
    const rateF1 = stats.offset && stats.rateLFU(true) * (1000 - leverage); // 操作頻度を超えてキャッシュ比率を増減させても余剰比率の消化が追いつかず無駄
    // LRUの下限設定ではLRU拡大の要否を迅速に判定できないためLFUのヒット率低下の検出で代替する

    if (ratio > 0 && (rateR0 > rateF0 || stats.offset && rateF0 * 100 < rateF1 * (100 - stats.offset))) {
      //rateR0 <= rateF0 && rateF0 * 100 < rateF1 * (100 - stats.offset) && console.debug(0);
      if (lenR >= capacity * (1000 - ratio) / 1000) {
        //ratio % 100 || ratio === 1000 || console.debug('-', ratio, LRU, LFU);
        --this.ratio;
      }
    } else if (ratio < limit && rateF0 > rateR0) {
      if (lenF >= capacity * ratio / 1000) {
        //ratio % 100 || ratio === 0 || console.debug('+', ratio, LRU, LFU);
        ++this.ratio;
      }
    }
  }

  access(node) {
    return this.accessLFU(node) || this.accessLRU(node);
  }

  accessLRU(node) {
    const index = node.value;
    ++this.stats[index.region][0];
    this.overlap -= +(index.region === 'LFU');
    index.region = 'LFU';
    this.indexes.LFU.unshiftNode(node);
    return true;
  }

  accessLFU(node) {
    if (node.list !== this.indexes.LFU) return false;
    const index = node.value;
    ++this.stats[index.region][0];
    node.moveToHead();
    return true;
  }

}

exports.Cache = Cache;

class Stats {
  constructor(window, resolution, offset) {
    this.window = window;
    this.resolution = resolution;
    this.offset = offset;
    this.max = (0, alias_1.ceil)(this.resolution * (100 + this.offset) / 100) + 1;
    this.LRU = [0];
    this.LFU = [0];
  }

  get length() {
    return this.LRU.length;
  }

  full() {
    return this.length === this.max;
  }

  rateLRU(offset = false) {
    return rate(this.window, this.LRU, this.LFU, +offset && this.offset);
  }

  rateLFU(offset = false) {
    return rate(this.window, this.LFU, this.LRU, +offset && this.offset);
  }

  subtotal() {
    const {
      LRU,
      LFU,
      window,
      resolution,
      offset
    } = this;

    if (offset && LRU[0] + LFU[0] >= window * offset / 100) {
      if (this.length === 1) {
        this.slide();
      } else {
        LRU[1] += LRU[0];
        LFU[1] += LFU[0];
        LRU[0] = 0;
        LFU[0] = 0;
      }
    }

    const subtotal = LRU[+offset && 1] + LFU[+offset && 1] || 0;
    subtotal >= window / resolution && this.slide();
    return LRU[0] + LFU[0];
  }

  slide() {
    const {
      LRU,
      LFU,
      max
    } = this;

    if (LRU.length === max) {
      LRU.pop();
      LFU.pop();
    }

    LRU.unshift(0);
    LFU.unshift(0);
  }

  clear() {
    this.LRU = [0];
    this.LFU = [0];
  }

}

function rate(window, hits1, hits2, offset) {
  let total = 0;
  let hits = 0;
  let ratio = 100;

  for (let i = 0, len = hits1.length; i < len; ++i) {
    const subtotal = hits1[i] + hits2[i];
    if (subtotal === 0) continue;
    offset = i + 1 === len ? 0 : offset;
    const subratio = (0, alias_1.min)(subtotal * 100 / window, ratio) - offset;
    offset = offset && subratio < 0 ? -subratio : 0;
    if (subratio <= 0) continue;
    const rate = window * subratio / subtotal;
    total += subtotal * rate;
    hits += hits1[i] * rate;
    ratio -= subratio;
    if (ratio <= 0) break;
  }

  return hits * 10000 / total | 0;
}

/***/ }),

/***/ 7681:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.tick = exports.promise = exports.clock = exports.now = void 0;

const global_1 = __webpack_require__(4128);

const queue_1 = __webpack_require__(4934);

const exception_1 = __webpack_require__(7822);

const undefined = void 0;
let time;
let count = 0;

function now(nocache) {
  if (time === undefined) {
    tick(() => time = undefined);
  } else if (!nocache && count++ !== 20) {
    return time;
  }

  count = 1;
  return time = global_1.Date.now();
}

exports.now = now;
exports.clock = global_1.Promise.resolve(undefined);

function promise(cb) {
  global_1.Promise.resolve().then(cb);
}

exports.promise = promise;
const queue = new queue_1.Queue();
const scheduler = global_1.Promise.resolve();

function tick(cb) {
  queue.isEmpty() && scheduler.then(run);
  queue.push(cb);
}

exports.tick = tick;

function run() {
  for (let count = queue.length; count--;) {
    try {
      // @ts-expect-error
      (0, queue.pop())();
    } catch (reason) {
      (0, exception_1.causeAsyncException)(reason);
    }
  }
}

/***/ }),

/***/ 5529:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.equal = void 0;

function equal(a, b) {
  return a === a ? a === b : b !== b;
}

exports.equal = equal;

/***/ }),

/***/ 5084:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.MultiMap = void 0;

const global_1 = __webpack_require__(4128);

const ring_1 = __webpack_require__(6395);

class MultiMap {
  constructor(entries = [], memory = new global_1.Map()) {
    this.memory = memory;

    for (const {
      0: k,
      1: v
    } of entries) {
      this.set(k, v);
    }
  }

  get(key) {
    return this.memory.get(key)?.at(0);
  }

  getAll(key) {
    return this.memory.get(key);
  }

  set(key, val) {
    let vs = this.memory.get(key);
    if (vs) return vs.push(val), this;
    vs = new ring_1.Ring();
    vs.push(val);
    this.memory.set(key, vs);
    return this;
  }

  has(key, value) {
    const vs = this.memory.get(key);
    if (!vs?.length) return false;
    if (arguments.length < 2) return true;
    return vs.includes(value);
  }

  delete(key, value) {
    if (arguments.length < 2) return this.memory.delete(key);
    const vs = this.memory.get(key);
    if (!vs?.length) return false;
    const i = vs.indexOf(value);
    if (i === -1) return false;
    vs.splice(i, 1);
    return true;
  }

  clear() {
    this.memory.clear();
  }

  take(key, count) {
    const vs = this.memory.get(key);
    if (count === void 0) return vs?.shift();
    const acc = [];

    while (vs?.length && count--) {
      acc.push(vs.shift());
    }

    return acc;
  }

  ref(key) {
    let vs = this.memory.get(key);
    if (vs) return vs;
    vs = new ring_1.Ring();
    this.memory.set(key, vs);
    return vs;
  }

  *[Symbol.iterator]() {
    for (const {
      0: k,
      1: vs
    } of this.memory) {
      for (let i = 0; i < vs.length; ++i) {
        yield [k, vs.at(i)];
      }
    }

    return;
  }

}

exports.MultiMap = MultiMap;

/***/ }),

/***/ 8099:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.duffReduce = exports.duffEach = exports.duffbk = exports.duff = void 0; // 100,000以上でforより大幅に低速となり実用不可

function duff(count, proc) {
  if (count > 0) {
    let i = 0,
        m = count & 7,
        d = (count - m) / 8;

    while (m--) {
      proc(i++);
    }

    while (d--) {
      proc(i++);
      proc(i++);
      proc(i++);
      proc(i++);
      proc(i++);
      proc(i++);
      proc(i++);
      proc(i++);
    }
  } else {
    let i = -count,
        m = i & 7,
        d = (i - m) / 8;

    while (m--) {
      proc(--i);
    }

    while (d--) {
      proc(--i);
      proc(--i);
      proc(--i);
      proc(--i);
      proc(--i);
      proc(--i);
      proc(--i);
      proc(--i);
    }
  }
}

exports.duff = duff; // 100,000以上でforより大幅に低速となり実用不可

function duffbk(count, proc) {
  if (count > 0) {
    let i = 0,
        m = count & 7,
        d = (count - m) / 8;

    while (m--) {
      if (proc(i++) === false) return;
    }

    while (d--) {
      switch (false) {
        case proc(i++):
        case proc(i++):
        case proc(i++):
        case proc(i++):
        case proc(i++):
        case proc(i++):
        case proc(i++):
        case proc(i++):
          return;
      }
    }
  } else {
    let i = -count,
        m = i & 7,
        d = (i - m) / 8;

    while (m--) {
      if (proc(--i) === false) return;
    }

    while (d--) {
      switch (false) {
        case proc(--i):
        case proc(--i):
        case proc(--i):
        case proc(--i):
        case proc(--i):
        case proc(--i):
        case proc(--i):
        case proc(--i):
          return;
      }
    }
  }
}

exports.duffbk = duffbk;

function duffEach(array, proc) {
  let count = array.length;
  let i = 0,
      m = count & 7,
      d = (count - m) / 8;

  while (m--) {
    proc(array[i], i++, array);
  }

  while (d--) {
    proc(array[i], i++, array);
    proc(array[i], i++, array);
    proc(array[i], i++, array);
    proc(array[i], i++, array);
    proc(array[i], i++, array);
    proc(array[i], i++, array);
    proc(array[i], i++, array);
    proc(array[i], i++, array);
  }
}

exports.duffEach = duffEach; // ベンチマークの10,000以上で急激な速度低下が見られる場合があるがNodeListなどでの
// 実際の使用では速度低下は見られない

function duffReduce(array, proc, initial) {
  let count = array.length;
  let i = 0,
      m = count & 7,
      d = (count - m) / 8;
  let acc = initial;

  while (m--) {
    acc = proc(acc, array[i], i++, array);
  }

  while (d--) {
    acc = proc(acc, array[i], i++, array);
    acc = proc(acc, array[i], i++, array);
    acc = proc(acc, array[i], i++, array);
    acc = proc(acc, array[i], i++, array);
    acc = proc(acc, array[i], i++, array);
    acc = proc(acc, array[i], i++, array);
    acc = proc(acc, array[i], i++, array);
    acc = proc(acc, array[i], i++, array);
  }

  return acc;
}

exports.duffReduce = duffReduce;

/***/ }),

/***/ 7822:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.causeAsyncException = void 0;

const global_1 = __webpack_require__(4128);

function causeAsyncException(reason) {
  global_1.Promise.reject(reason);
}

exports.causeAsyncException = causeAsyncException;

/***/ }),

/***/ 4128:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


__webpack_require__(6921);

const global = void 0 || typeof globalThis !== 'undefined' && globalThis // @ts-ignore
|| typeof self !== 'undefined' && self || Function('return this')();
global.global = global;
module.exports = global;

/***/ }),

/***/ 6921:
/***/ (() => {

"use strict";
 // @ts-ignore

var globalThis; // @ts-ignore

var global = (/* unused pure expression or super */ null && (globalThis));

/***/ }),

/***/ 818:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.MultiHeap = exports.Heap = void 0;

const global_1 = __webpack_require__(4128);

const invlist_1 = __webpack_require__(7452);

const memoize_1 = __webpack_require__(1808);

const undefined = void 0;
let size = 16;

class Heap {
  constructor(cmp = Heap.max, stable = false) {
    this.cmp = cmp;
    this.stable = stable;
    this.array = (0, global_1.Array)(size);
    this.$length = 0;
  }

  get length() {
    return this.$length;
  }

  isEmpty() {
    return this.array[0] !== undefined;
  }

  peek() {
    return this.array[0]?.[1];
  }

  insert(value, order) {
    if (arguments.length < 2) {
      order = value;
    }

    const array = this.array;
    const node = array[this.$length] = [order, value, this.$length++];
    upHeapify(this.cmp, array, this.$length);
    return node;
  }

  replace(value, order) {
    if (arguments.length < 2) {
      order = value;
    }

    if (this.$length === 0) return void this.insert(value, order);
    const array = this.array;
    const replaced = array[0][1];
    array[0] = [order, value, 0];
    downHeapify(this.cmp, array, 1, this.$length, this.stable);
    return replaced;
  }

  extract() {
    if (this.$length === 0) return;
    const node = this.array[0];
    this.delete(node);
    return node[1];
  }

  delete(node) {
    const array = this.array;
    const index = node[2];
    if (array[index] !== node) throw new Error('Invalid node');
    swap(array, index, --this.$length); // @ts-expect-error

    array[this.$length] = undefined;
    index < this.$length && sort(this.cmp, array, index, this.$length, this.stable);
    return node[1];
  }

  update(node, order, value) {
    if (arguments.length < 2) {
      order = node[0];
    }

    const array = this.array;
    if (array[node[2]] !== node) throw new Error('Invalid node');

    if (arguments.length > 2) {
      node[1] = value;
    }

    if (this.cmp(node[0], node[0] = order) === 0) return;
    sort(this.cmp, array, node[2], this.$length, this.stable);
  }

  clear() {
    this.array = (0, global_1.Array)(size);
    this.$length = 0;
  }

}

exports.Heap = Heap;

Heap.max = (a, b) => a > b ? -1 : a < b ? 1 : 0;

Heap.min = (a, b) => a > b ? 1 : a < b ? -1 : 0;

class MultiHeap {
  constructor(cmp = MultiHeap.max, clean = true) {
    this.cmp = cmp;
    this.clean = clean;
    this.heap = new Heap(this.cmp);
    this.dict = new Map();
    this.list = (0, memoize_1.memoize)(order => {
      const list = new invlist_1.List();
      list[MultiHeap.order] = order;
      list[MultiHeap.heap] = this.heap.insert(list, order);
      return list;
    }, this.dict);
    this.$length = 0;
  }

  get length() {
    return this.$length;
  }

  isEmpty() {
    return this.heap.isEmpty();
  }

  peek() {
    return this.heap.peek()?.head.value;
  }

  insert(value, order) {
    if (arguments.length < 2) {
      order = value;
    }

    ++this.$length;
    const list = this.list(order);
    return [order, list.push(value)];
  }

  extract() {
    if (this.$length === 0) return;
    --this.$length;
    const list = this.heap.peek();
    const value = list.shift();

    if (list.length === 0) {
      this.heap.extract();
      this.clean && this.dict.delete(list[MultiHeap.order]);
    }

    return value;
  }

  delete(node) {
    if (!node[1].list) throw new Error('Invalid node');
    const {
      0: order,
      1: lnode
    } = node;
    --this.$length;

    if (lnode.list.length === 1) {
      this.heap.delete(lnode[MultiHeap.heap]);
      this.clean && this.dict.delete(order);
    }

    return lnode.delete();
  }

  update(node, order, value) {
    if (!node[1].list) throw new Error('Invalid node');

    if (arguments.length < 2) {
      order = node[0];
    }

    if (arguments.length > 2) {
      node[1].value = value;
    }

    if (this.cmp(node[0], order) === 0) return node;
    this.delete(node);
    return this.insert(node[1].value, order);
  }

  clear() {
    this.heap.clear();
    this.dict.clear();
    this.$length = 0;
  }

}

exports.MultiHeap = MultiHeap;
MultiHeap.order = Symbol('order');
MultiHeap.heap = Symbol('heap');
MultiHeap.max = Heap.max;
MultiHeap.min = Heap.min;

function sort(cmp, array, index, length, stable) {
  return upHeapify(cmp, array, index + 1) || downHeapify(cmp, array, index + 1, length, stable);
}

function upHeapify(cmp, array, index) {
  const order = array[index - 1][0];
  let changed = false;

  while (index > 1) {
    const parent = index / 2 | 0;
    if (cmp(array[parent - 1][0], order) <= 0) break;
    swap(array, index - 1, parent - 1);
    index = parent;
    changed ||= true;
  }

  return changed;
}

function downHeapify(cmp, array, index, length, stable) {
  let changed = false;

  while (index < length) {
    const left = index * 2;
    const right = index * 2 + 1;
    let min = index;

    if (left <= length && (stable ? cmp(array[left - 1][0], array[min - 1][0]) <= 0 : cmp(array[left - 1][0], array[min - 1][0]) < 0)) {
      min = left;
    }

    if (right <= length && (stable ? cmp(array[right - 1][0], array[min - 1][0]) <= 0 : cmp(array[right - 1][0], array[min - 1][0]) < 0)) {
      min = right;
    }

    if (min === index) break;
    swap(array, index - 1, min - 1);
    index = min;
    changed ||= true;
  }

  return changed;
}

function swap(array, index1, index2) {
  if (index1 === index2) return;
  const node1 = array[index1];
  const node2 = array[index2];
  node1[2] = index2;
  node2[2] = index1;
  array[index1] = node2;
  array[index2] = node1;
}

/***/ }),

/***/ 7452:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  var desc = Object.getOwnPropertyDescriptor(m, k);

  if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
    desc = {
      enumerable: true,
      get: function () {
        return m[k];
      }
    };
  }

  Object.defineProperty(o, k2, desc);
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __exportStar = this && this.__exportStar || function (m, exports) {
  for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));

__exportStar(__webpack_require__(2310), exports);

/***/ }),

/***/ 2310:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
 // Circular Inverse List

var _a;

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.List = void 0;
const undefined = void 0;
const LENGTH = Symbol('length');

class List {
  constructor() {
    this[_a] = 0;
    this.head = undefined;
  }

  get length() {
    return this[LENGTH];
  }

  get tail() {
    return this.head?.next;
  }

  get last() {
    return this.head?.prev;
  }

  clear() {
    this.head = undefined;
    this[LENGTH] = 0;
  }

  unshift(value) {
    return this.head = this.push(value);
  }

  push(value) {
    return new Node(this, value, this.head, this.head?.prev);
  }

  unshiftNode(node) {
    return this.head = this.pushNode(node);
  }

  pushNode(node) {
    return this.insert(node, this.head);
  }

  unshiftRotationally(value) {
    const node = this.last;
    if (!node) return this.unshift(value);
    node.value = value;
    this.head = node;
    return node;
  }

  pushRotationally(value) {
    const node = this.head;
    if (!node) return this.push(value);
    node.value = value;
    this.head = node.next;
    return node;
  }

  shift() {
    return this.head?.delete();
  }

  pop() {
    return this.last?.delete();
  }

  insert(node, before = this.head) {
    if (node.list === this) return node.moveTo(before), node;
    node.delete();
    ++this[LENGTH];
    this.head ??= node; // @ts-expect-error

    node.list = this;
    const next = node.next = before ?? node;
    const prev = node.prev = next.prev ?? node;
    next.prev = prev.next = node;
    return node;
  }

  *[(_a = LENGTH, Symbol.iterator)]() {
    for (let node = this.head; node;) {
      yield node.value;
      node = node.next;
      if (node === this.head) return;
    }
  }

}

exports.List = List;

class Node {
  constructor(list, value, next, prev) {
    this.list = list;
    this.value = value;
    this.next = next;
    this.prev = prev;
    ++list[LENGTH];
    list.head ??= this;
    next && prev ? next.prev = prev.next = this : this.next = this.prev = this;
  }

  delete() {
    if (!this.list) return this.value;
    --this.list[LENGTH];
    const {
      next,
      prev
    } = this;

    if (this.list.head === this) {
      this.list.head = next === this ? undefined : next;
    }

    if (next) {
      next.prev = prev;
    }

    if (prev) {
      prev.next = next;
    } // @ts-expect-error


    this.list = undefined; // @ts-expect-error

    this.next = this.prev = undefined;
    return this.value;
  }

  insertBefore(value) {
    return new Node(this.list, value, this, this.prev);
  }

  insertAfter(value) {
    return new Node(this.list, value, this.next, this);
  }

  moveTo(before) {
    if (!before) return false;
    if (this === before) return false;
    if (before.list !== this.list) return before.list.insert(this, before), true;
    const a1 = this;
    const b1 = before;
    if (a1.next === b1) return false;
    const b0 = b1.prev;
    const a0 = a1.prev;
    const a2 = a1.next;
    b0.next = a1;
    a1.next = b1;
    b1.prev = a1;
    a1.prev = b0;
    a0.next = a2;
    a2.prev = a0;
    return true;
  }

  moveToHead() {
    this.moveTo(this.list.head);
    this.list.head = this;
  }

  moveToLast() {
    this.moveTo(this.list.head);
  }

  swap(node) {
    const node1 = this;
    const node2 = node;
    if (node1 === node2) return false;
    const node3 = node2.next;
    if (node1.list !== node2.list) throw new Error(`Spica: InvList: Cannot swap nodes across lists.`);
    node2.moveTo(node1);
    node1.moveTo(node3);

    switch (this.list.head) {
      case node1:
        this.list.head = node2;
        break;

      case node2:
        this.list.head = node1;
        break;
    }

    return true;
  }

}

/***/ }),

/***/ 1808:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.reduce = exports.memoize = void 0;

const global_1 = __webpack_require__(4128);

const alias_1 = __webpack_require__(5406);

const compare_1 = __webpack_require__(5529);

const undefined = void 0;

function memoize(f, identify = (...as) => as[0], memory) {
  if (typeof identify === 'object') return memoize(f, undefined, identify);
  if (memory === undefined) return memoize(f, identify, new global_1.Map());
  if ((0, alias_1.isArray)(memory)) return memoize(f, identify, {
    has(key) {
      return memory[key] !== undefined;
    },

    get(key) {
      return memory[key];
    },

    set(key, value) {
      memory[key] = value;
      return this;
    },

    delete() {
      throw 0;
    }

  });
  let nullish = false;
  return (...as) => {
    const b = identify(...as);
    let z = memory.get(b);
    if (z !== undefined || nullish && memory.has(b)) return z;
    z = f(...as);
    nullish ||= z === undefined;
    memory.set(b, z);
    return z;
  };
}

exports.memoize = memoize;

function reduce(f, identify = (...as) => as[0]) {
  let key = {};
  let val;
  return (...as) => {
    const b = identify(...as);

    if (!(0, compare_1.equal)(key, b)) {
      key = b;
      val = f(...as);
    }

    return val;
  };
}

exports.reduce = reduce;

/***/ }),

/***/ 940:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  var desc = Object.getOwnPropertyDescriptor(m, k);

  if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
    desc = {
      enumerable: true,
      get: function () {
        return m[k];
      }
    };
  }

  Object.defineProperty(o, k2, desc);
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __exportStar = this && this.__exportStar || function (m, exports) {
  for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));

__exportStar(__webpack_require__(5084), exports);

/***/ }),

/***/ 4934:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.PriorityQueue = exports.Queue = void 0;

const global_1 = __webpack_require__(4128);

const heap_1 = __webpack_require__(818);

const memoize_1 = __webpack_require__(1808);

const undefined = void 0;
const size = 2048;
const initsize = 16;

class Queue {
  constructor() {
    this.head = new FixedQueue(initsize);
    this.tail = this.head;
    this.count = 0;
    this.irregular = 0;
  }

  get length() {
    return this.count === 0 ? this.head.length : this.head.length + this.tail.length + (size - 1) * (this.count - 2) + (this.irregular || size) - 1;
  }

  isEmpty() {
    return this.head.isEmpty();
  }

  peek(index = 0) {
    return index === 0 ? this.head.peek(0) : this.tail.peek(-1);
  }

  push(value) {
    const tail = this.tail;

    if (tail.isFull()) {
      if (tail.next.isEmpty()) {
        this.tail = tail.next;
      } else {
        this.tail = tail.next = new FixedQueue(size, tail.next);
      }

      ++this.count;

      if (tail.size !== size && tail !== this.head) {
        this.irregular = tail.size;
      }
    }

    this.tail.push(value);
  }

  pop() {
    const head = this.head;
    const value = head.pop();

    if (head.isEmpty() && !head.next.isEmpty()) {
      --this.count;
      this.head = head.next;

      if (this.head.size === this.irregular) {
        this.irregular = 0;
      }
    }

    return value;
  }

  clear() {
    this.head = this.tail = new FixedQueue(initsize);
    this.count = 0;
    this.irregular = 0;
  }

  *[Symbol.iterator]() {
    while (!this.isEmpty()) {
      yield this.pop();
    }

    return;
  }

}

exports.Queue = Queue;

class FixedQueue {
  constructor(size, next) {
    this.size = size;
    this.array = (0, global_1.Array)(this.size);
    this.mask = this.array.length - 1;
    this.head = 0;
    this.tail = 0;
    this.next = next ?? this;
  }

  get length() {
    return this.tail >= this.head ? this.tail - this.head : this.array.length - this.head + this.tail;
  }

  isEmpty() {
    return this.tail === this.head;
  }

  isFull() {
    return (this.tail + 1 & this.mask) === this.head;
  }

  peek(index = 0) {
    return index === 0 ? this.array[this.head] : this.array[this.tail - 1 & this.mask];
  }

  push(value) {
    this.array[this.tail] = value;
    this.tail = this.tail + 1 & this.mask;
  }

  pop() {
    if (this.isEmpty()) return;
    const value = this.array[this.head];
    this.array[this.head] = undefined;
    this.head = this.head + 1 & this.mask;
    return value;
  }

}

class PriorityQueue {
  constructor(cmp = PriorityQueue.max, clean = true) {
    this.clean = clean;
    this.dict = new Map();
    this.queue = (0, memoize_1.memoize)(priority => {
      const queue = new Queue();
      queue[PriorityQueue.priority] = priority;
      this.heap.insert(queue, priority);
      return queue;
    }, this.dict);
    this.$length = 0;
    this.heap = new heap_1.Heap(cmp);
  }

  get length() {
    return this.$length;
  }

  isEmpty() {
    return this.$length === 0;
  }

  peek() {
    return this.heap.peek()?.peek();
  }

  push(value, priority) {
    ++this.$length;
    this.queue(priority).push(value);
  }

  pop() {
    if (this.$length === 0) return;
    --this.$length;
    const queue = this.heap.peek();
    const value = queue.pop();

    if (queue.isEmpty()) {
      this.heap.extract();
      this.clean && this.dict.delete(queue[PriorityQueue.priority]);
    }

    return value;
  }

  clear() {
    this.heap.clear();
    this.dict.clear();
    this.$length = 0;
  }

  *[Symbol.iterator]() {
    while (!this.isEmpty()) {
      yield this.pop();
    }

    return;
  }

}

exports.PriorityQueue = PriorityQueue;
PriorityQueue.priority = Symbol('priority');
PriorityQueue.max = heap_1.Heap.max;
PriorityQueue.min = heap_1.Heap.min;

/***/ }),

/***/ 7325:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.unique = exports.rndAf = exports.rndAP = exports.rnd0_ = exports.rnd0Z = exports.rnd0v = exports.rnd0f = exports.rnd64 = exports.rnd62 = exports.rnd32 = exports.rnd16 = void 0;

const global_1 = __webpack_require__(4128);

const bases = [...Array(7)].map((_, i) => 1 << i);
const dict0_ = [...[...Array(36)].map((_, i) => i.toString(36)), ...[...Array(36)].map((_, i) => i.toString(36).toUpperCase()).slice(-26), '-', '_'];
const dictAz = [...[...Array(36)].map((_, i) => i.toString(36).toUpperCase()).slice(-26), ...[...Array(36)].map((_, i) => i.toString(36)).slice(-26)];
exports.rnd16 = cons(16);
exports.rnd32 = cons(32);
exports.rnd62 = cons(62);
exports.rnd64 = cons(64);
exports.rnd0f = conv(exports.rnd16, dict0_);
exports.rnd0v = conv(exports.rnd32, dict0_);
exports.rnd0Z = conv(exports.rnd62, dict0_);
exports.rnd0_ = conv(exports.rnd64, dict0_);
exports.rndAP = conv(exports.rnd16, dictAz);
exports.rndAf = conv(exports.rnd32, dictAz);

function unique(rnd, len, mem) {
  const clear = !mem;
  mem ??= new global_1.Set();
  let limit = 5;
  return () => {
    while (true) {
      try {
        for (let i = 0; i < limit; ++i) {
          const r = rnd(len);
          if (mem.has(r)) continue;
          mem.add(r);
          return r;
        }
      } catch {}

      clear && mem.clear();
      ++len;
      limit = len < 3 ? limit : 3;
    }
  };
}

exports.unique = unique;

function cons(radix) {
  const base = bases.find(base => base >= radix);
  const len = bases.indexOf(base);
  return () => {
    while (true) {
      const r = random(len);
      if (r < radix) return r;
    }
  };
}

function conv(rnd, dict) {
  return (len = 1) => {
    let acc = '';

    while (len--) {
      acc += dict[rnd()];
    }

    return acc;
  };
}

const buffer = new Uint16Array(512);
const digit = 16;
const masks = bases.map((_, i) => +`0b${'1'.repeat(i) || 0}`);
let index = buffer.length;
let offset = digit;

function random(len) {
  if (index === buffer.length) {
    global_1.crypto.getRandomValues(buffer);
    index = 0;
  }

  if (offset === len) {
    offset = digit;
    return buffer[index++] & masks[len];
  } else if (offset > len) {
    offset -= len;
    return buffer[index] >> offset & masks[len];
  } else {
    offset = digit;
    ++index;
    return random(len);
  }
}

/***/ }),

/***/ 6395:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Ring = void 0;

const global_1 = __webpack_require__(4128);

const alias_1 = __webpack_require__(5406);

const array_1 = __webpack_require__(8112);

const undefined = void 0;
const empty = Symbol('empty');

const unempty = value => value === empty ? undefined : value;

const space = Object.freeze((0, global_1.Array)(100).fill(empty));
let size = 16;

class Ring {
  constructor() {
    this.array = (0, global_1.Array)(size);
    this.head = 0;
    this.tail = 0;
    this.$length = 0;
    this.excess = 0;
  }

  get length() {
    return this.$length;
  }

  at(index) {
    // Inline the code for optimization.
    const array = this.array;

    if (index >= 0) {
      if (index >= this.$length) return;
      return unempty(array[(this.head - 1 + index) % array.length]);
    } else {
      if (-index > this.$length) return;
      return this.tail + index >= 0 ? unempty(array[this.tail + index]) : unempty(array[array.length + this.tail + index]);
    }
  }

  replace(index, value, replacer) {
    const array = this.array;

    if (index >= 0) {
      if (index >= this.$length) throw new RangeError('Invalid index');
      index = (this.head - 1 + index) % array.length;
    } else {
      if (-index > this.$length) throw new RangeError('Invalid index');
      index = this.tail + index >= 0 ? this.tail + index : array.length + this.tail + index;
    }

    const val = unempty(array[index]);
    array[index] = replacer ? replacer(val, value) : value;
    return val;
  }

  push(value) {
    const array = this.array;
    let {
      head,
      tail
    } = this;
    tail = this.tail = next(head, tail, array.length);
    head = this.head ||= tail;

    if (head === tail && this.$length !== 0) {
      (0, array_1.splice)(array, tail - 1, 0, ...space);
      head = this.head += space.length;
    }

    array[tail - 1] = value;
    ++this.$length;
  }

  unshift(value) {
    const array = this.array;
    let {
      head,
      tail
    } = this;
    head = this.head = prev(head, tail, array.length);
    tail = this.tail ||= head;

    if (head === tail && this.$length !== 0) {
      (0, array_1.splice)(array, head, 0, ...space);
      head = this.head += space.length;
    }

    array[head - 1] = value;
    ++this.$length;
  }

  pop() {
    if (this.$length === 0) return;
    const array = this.array;
    const i = this.tail - 1;
    const value = unempty(array[i]);
    array[i] = empty;
    --this.$length === 0 ? this.head = this.tail = 0 : this.tail = this.tail === 1 ? array.length : this.tail - 1;
    return value;
  }

  shift() {
    if (this.$length === 0) return;
    const array = this.array;
    const i = this.head - 1;
    const value = unempty(array[i]);
    array[i] = empty;
    --this.$length === 0 ? this.head = this.tail = 0 : this.head = this.head === array.length ? 1 : this.head + 1;
    return value;
  }

  splice(index, count, ...values) {
    const array = this.array;

    if (this.excess > 100 && array.length - this.$length > 200) {
      (0, array_1.splice)(array, 0, 100 - (0, array_1.splice)(array, this.tail, 100).length);
      this.excess -= 100;
    } else if (-this.excess > array.length * 2) {
      this.excess = array.length;
    }

    index = index < 0 ? (0, alias_1.max)(0, this.$length + index) : index <= this.$length ? index : this.$length;
    count = (0, alias_1.min)((0, alias_1.max)(count, 0), this.$length - index);

    if (values.length === 0) {
      if (count === 0) return [];

      switch (index) {
        case 0:
          if (count === 1) return [this.shift()];
          break;

        case this.$length - 1:
          if (count === 1) return [this.pop()];
          break;

        case this.$length:
          return [];
      }
    }

    index = (this.head || 1) - 1 + index;
    index = index > array.length ? index % array.length : index;
    this.excess += values.length - count;
    this.$length += values.length - count; // |--H>*>T--|

    if (this.head <= this.tail) {
      this.tail += values.length - count;
      return (0, array_1.splice)(array, index, count, ...values);
    } // |*>T---H>>|


    if (index < this.tail) {
      this.head += values.length - count;
      this.tail += values.length - count;
      return (0, array_1.splice)(array, index, count, ...values);
    } // |>>T---H>*|


    const cnt = (0, alias_1.min)(count, array.length - index);
    const vs = (0, array_1.splice)(array, index, cnt, ...(0, array_1.splice)(values, 0, cnt));
    vs.push(...(0, array_1.splice)(array, 0, count - vs.length, ...values));
    return vs;
  }

  clear() {
    this.array = (0, global_1.Array)(size);
    this.$length = this.head = this.tail = 0;
  }

  includes(value) {
    return this.array.includes(value);
  }

  relational(index) {
    if (index === -1) return -1;
    return index + 1 >= this.head ? index + 1 - this.head : this.array.length - this.head + index;
  }

  indexOf(value) {
    return this.relational((0, array_1.indexOf)(this.array, value));
  }

  findIndex(f) {
    return this.relational(this.array.findIndex(value => value !== empty && f(value)));
  }

  find(f) {
    return unempty(this.array.find(value => value !== empty && f(value)));
  }

  toArray() {
    return this.head <= this.tail ? this.array.slice((this.head || 1) - 1, this.tail) : this.array.slice((this.head || 1) - 1).concat(this.array.slice(0, this.tail));
  }

  *[Symbol.iterator]() {
    for (let i = 0; i < this.$length; ++i) {
      yield this.at(i);
    }

    return;
  }

}

exports.Ring = Ring;

function next(head, tail, length) {
  return tail === length && head !== 1 ? 1 : tail + 1;
}

function prev(head, tail, length) {
  return head === 0 || head === 1 ? tail === length ? length + 1 : length : head - 1;
}

/***/ }),

/***/ 5177:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.isPrimitive = exports.isType = exports.type = void 0;

const global_1 = __webpack_require__(4128);

const alias_1 = __webpack_require__(5406);

const ObjectPrototype = Object.prototype;
const ArrayPrototype = Array.prototype;

function type(value) {
  if (value === void 0) return 'undefined';
  if (value === null) return 'null';
  const type = typeof value;

  if (type === 'object') {
    if (value[global_1.Symbol.toStringTag]) return value[global_1.Symbol.toStringTag];
    const proto = (0, alias_1.ObjectGetPrototypeOf)(value);
    if (proto === ObjectPrototype) return 'Object';
    if (proto === ArrayPrototype) return 'Array';
    return (0, alias_1.toString)(value).slice(8, -1);
  }

  if (type === 'function') return 'Function';
  return type;
}

exports.type = type;

function isType(value, name) {
  if (name === 'object') return value !== null && typeof value === name;
  if (name === 'function') return typeof value === name;
  return type(value) === name;
}

exports.isType = isType;

function isPrimitive(value) {
  const type = typeof value;
  return type === 'object' || type === 'function' ? value === null : true;
}

exports.isPrimitive = isPrimitive;

/***/ }),

/***/ 2261:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.URL = exports.ReadonlyURL = exports.standardize = void 0;

const global_1 = __webpack_require__(4128);

const format_1 = __webpack_require__(137);

var format_2 = __webpack_require__(137);

Object.defineProperty(exports, "standardize", ({
  enumerable: true,
  get: function () {
    return format_2.standardize;
  }
}));

var format_3 = __webpack_require__(137);

Object.defineProperty(exports, "ReadonlyURL", ({
  enumerable: true,
  get: function () {
    return format_3.ReadonlyURL;
  }
}));

class URL {
  constructor(source, base) {
    this.source = source;
    this.base = base;
    this.url = new format_1.ReadonlyURL(source, base);
  }

  get href() {
    return this.params?.toString().replace(/^(?=.)/, `${this.url.href.slice(0, -this.url.query.length - this.url.fragment.length || this.url.href.length)}?`).concat(this.fragment) ?? this.url.href;
  }

  get resource() {
    return this.params?.toString().replace(/^(?=.)/, `${this.url.href.slice(0, -this.url.query.length - this.url.fragment.length || this.url.href.length)}?`) ?? this.url.resource;
  }

  get origin() {
    return this.url.origin;
  }

  get scheme() {
    return this.url.protocol.slice(0, -1);
  }

  get protocol() {
    return this.url.protocol;
  }

  get username() {
    return this.url.username;
  }

  get password() {
    return this.url.password;
  }

  get host() {
    return this.url.host;
  }

  get hostname() {
    return this.url.hostname;
  }

  get port() {
    return this.url.port;
  }

  get path() {
    return this.params?.toString().replace(/^(?=.)/, `${this.pathname}?`) ?? this.url.path;
  }

  get pathname() {
    return this.url.pathname;
  }

  get search() {
    return this.params?.toString().replace(/^(?=.)/, '?') ?? this.url.search;
  }

  get query() {
    return this.params?.toString().replace(/^(?=.)/, '?') ?? this.url.query;
  }

  get hash() {
    return this.url.hash;
  }

  get fragment() {
    return this.url.fragment;
  }

  get searchParams() {
    return this.params ??= new global_1.URLSearchParams(this.search);
  }

  toString() {
    return this.href;
  }

  toJSON() {
    return this.href;
  }

}

exports.URL = URL;

/***/ }),

/***/ 137:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.ReadonlyURL = exports._encode = exports.standardize = void 0;

const global_1 = __webpack_require__(4128);

const memoize_1 = __webpack_require__(1808);

const cache_1 = __webpack_require__(9210);

function standardize(url, base) {
  const u = new ReadonlyURL(url, base);
  url = u.origin === 'null' ? u.protocol.toLowerCase() + u.href.slice(u.protocol.length) : u.origin.toLowerCase() + u.href.slice(u.origin.length);
  return encode(url);
}

exports.standardize = standardize;

function encode(url) {
  return url // Percent-encoding
  .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]?|[\uDC00-\uDFFF]/g, str => str.length === 2 ? str : '').replace(/%(?![0-9A-F]{2})|[^%\[\]]+/ig, global_1.encodeURI).replace(/\?[^#]+/, query => '?' + query.slice(1).replace(/%[0-9A-F]{2}|%|[^=&]+/ig, str => str[0] === '%' && str.length === 3 ? str : (0, global_1.encodeURIComponent)(str))) // Use uppercase letters within percent-encoding triplets
  .replace(/%[0-9A-F]{2}/ig, str => str.toUpperCase()).replace(/#.+/, url.slice(url.indexOf('#')));
}

exports._encode = encode;

class ReadonlyURL {
  constructor(source, base) {
    this.source = source;
    this.base = base;

    switch (source.slice(0, source.lastIndexOf('://', 9) + 1).toLowerCase()) {
      case 'http:':
      case 'https:':
        base = void 0;
        break;

      default:
        switch (base?.slice(0, base.lastIndexOf('://', 9) + 1).toLowerCase()) {
          case 'http:':
          case 'https:':
            const i = base.indexOf('#');

            if (i > -1) {
              base = base.slice(0, i);
            }

            const j = base.indexOf('?');

            if (i > -1 && source.indexOf('#') === -1) {
              base = base.slice(0, j);
            }

        }

    }

    this.share = ReadonlyURL.get(source, base);
  }

  get href() {
    return this.share.href ??= this.share.url.href;
  }

  get resource() {
    return this.share.resource ??= this.href.slice(0, -this.fragment.length - this.query.length || this.href.length) + this.search;
  }

  get origin() {
    return this.share.origin ??= this.share.url.origin;
  }

  get protocol() {
    return this.share.protocol ??= this.share.url.protocol;
  }

  get username() {
    return this.share.username ??= this.share.url.username;
  }

  get password() {
    return this.share.password ??= this.share.url.password;
  }

  get host() {
    return this.share.host ??= this.share.url.host;
  }

  get hostname() {
    return this.share.hostname ??= this.share.url.hostname;
  }

  get port() {
    return this.share.port ??= this.share.url.port;
  }

  get path() {
    return this.share.path ??= `${this.pathname}${this.search}`;
  }

  get pathname() {
    return this.share.pathname ??= this.share.url.pathname;
  }

  get search() {
    return this.share.search ??= this.share.url.search;
  }

  get query() {
    return this.share.query ??= this.search || this.href[this.href.length - this.fragment.length - 1] === '?' && '?' || '';
  }

  get hash() {
    return this.share.hash ??= this.share.url.hash;
  }

  get fragment() {
    return this.share.fragment ??= this.hash || this.href[this.href.length - 1] === '#' && '#' || '';
  }

  get searchParams() {
    return this.params ??= new global_1.URLSearchParams(this.search);
  }

  toString() {
    return this.href;
  }

  toJSON() {
    return this.href;
  }

}

exports.ReadonlyURL = ReadonlyURL; // Can't freeze URL object in the Firefox extension environment.
// ref: https://github.com/falsandtru/pjax-api/issues/44#issuecomment-633915035
// Bug: Error in dependents.
// @ts-ignore

ReadonlyURL.get = (0, memoize_1.memoize)((url, base) => ({
  url: new global_1.global.URL(url, base)
}), (url, base = '') => `${base.indexOf('\n') > -1 ? base.replace(/\n+/g, '') : base}\n${url}`, new cache_1.Cache(10000));

/***/ }),

/***/ 2087:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  var desc = Object.getOwnPropertyDescriptor(m, k);

  if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
    desc = {
      enumerable: true,
      get: function () {
        return m[k];
      }
    };
  }

  Object.defineProperty(o, k2, desc);
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __exportStar = this && this.__exportStar || function (m, exports) {
  for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));

__exportStar(__webpack_require__(6366), exports);

__exportStar(__webpack_require__(2491), exports);

__exportStar(__webpack_require__(960), exports);

__exportStar(__webpack_require__(2287), exports);

__exportStar(__webpack_require__(7005), exports);

__exportStar(__webpack_require__(5418), exports);

__exportStar(__webpack_require__(5684), exports);

__exportStar(__webpack_require__(2804), exports);

__exportStar(__webpack_require__(9315), exports);

__exportStar(__webpack_require__(9705), exports);

__exportStar(__webpack_require__(729), exports);

__exportStar(__webpack_require__(9758), exports);

__exportStar(__webpack_require__(1411), exports);

__exportStar(__webpack_require__(7130), exports);

__exportStar(__webpack_require__(8927), exports);

__exportStar(__webpack_require__(7957), exports);

__exportStar(__webpack_require__(4710), exports);

__exportStar(__webpack_require__(4052), exports);

__exportStar(__webpack_require__(1109), exports);

__exportStar(__webpack_require__(6159), exports);

__exportStar(__webpack_require__(5231), exports);

__exportStar(__webpack_require__(1497), exports);

__exportStar(__webpack_require__(502), exports);

__exportStar(__webpack_require__(1143), exports);

/***/ }),

/***/ 2804:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.block = void 0;

const global_1 = __webpack_require__(4128);

const parser_1 = __webpack_require__(6728);

const memo_1 = __webpack_require__(1090);

const line_1 = __webpack_require__(9315);

function block(parser, separation = true) {
  return ({
    source,
    context
  }) => {
    if (source === '') return;
    context.memo ??= new memo_1.Memo();
    const result = parser({
      source,
      context
    });
    if (!result) return;
    const rest = (0, parser_1.exec)(result);
    if (separation && !(0, line_1.isEmpty)((0, line_1.firstline)(rest))) return;
    return rest === '' || source[source.length - rest.length - 1] === '\n' ? result : global_1.undefined;
  };
}

exports.block = block;

/***/ }),

/***/ 9705:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.verify = exports.validate = void 0;

const global_1 = __webpack_require__(4128);

const alias_1 = __webpack_require__(5406);

const parser_1 = __webpack_require__(6728);

function validate(patterns, has, parser) {
  if (typeof has === 'function') return validate(patterns, '', has);
  if (!(0, alias_1.isArray)(patterns)) return validate([patterns], has, parser);
  const match = (0, global_1.Function)(['"use strict";', 'return source =>', '0', ...patterns.map(pattern => typeof pattern === 'string' ? `|| source.slice(0, ${pattern.length}) === '${pattern}'` : `|| /${pattern.source}/${pattern.flags}.test(source)`)].join(''))();
  return ({
    source,
    context
  }) => {
    if (source === '') return;
    if (!match(source)) return;
    const result = parser({
      source,
      context
    });
    if (!result) return;
    return (0, parser_1.exec)(result).length < source.length ? result : global_1.undefined;
  };
}

exports.validate = validate;

function verify(parser, cond) {
  return ({
    source,
    context
  }) => {
    if (source === '') return;
    const result = parser({
      source,
      context
    });
    if (!result) return;
    if (!cond((0, parser_1.eval)(result), (0, parser_1.exec)(result), context)) return;
    return (0, parser_1.exec)(result).length < source.length ? result : global_1.undefined;
  };
}

exports.verify = verify;

/***/ }),

/***/ 9315:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.isEmpty = exports.firstline = exports.line = void 0;

const global_1 = __webpack_require__(4128);

const parser_1 = __webpack_require__(6728);

const memo_1 = __webpack_require__(1090);

function line(parser) {
  return ({
    source,
    context
  }) => {
    if (source === '') return;
    context.memo ??= new memo_1.Memo();
    const line = firstline(source);
    context.offset ??= 0;
    context.offset += source.length - line.length;
    const result = parser({
      source: line,
      context
    });
    context.offset -= source.length - line.length;
    if (!result) return;
    return isEmpty((0, parser_1.exec)(result)) ? [(0, parser_1.eval)(result), source.slice(line.length)] : global_1.undefined;
  };
}

exports.line = line;

function firstline(source) {
  const i = source.indexOf('\n');

  switch (i) {
    case -1:
      return source;

    case 0:
      return '\n';

    default:
      return source.slice(0, i + 1);
  }
}

exports.firstline = firstline;

function isEmpty(line) {
  return line === '' || line === '\n' || line.trimStart() === '';
}

exports.isEmpty = isEmpty;

/***/ }),

/***/ 7957:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.convert = void 0;

const parser_1 = __webpack_require__(6728);

function convert(conv, parser) {
  return ({
    source,
    context
  }) => {
    if (source === '') return;
    const src = conv(source);
    if (src === '') return [[], ''];
    context.offset ??= 0;
    context.offset += source.length - src.length;
    const result = parser({
      source: src,
      context
    });
    context.offset -= source.length - src.length;
    return result;
  };
}

exports.convert = convert;

/***/ }),

/***/ 4052:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.dup = void 0;

const fmap_1 = __webpack_require__(502);

function dup(parser) {
  return (0, fmap_1.fmap)(parser, nodes => [nodes]);
}

exports.dup = dup;

/***/ }),

/***/ 6159:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.fallback = void 0;

const union_1 = __webpack_require__(6366);

function fallback(parser, otherwise) {
  return (0, union_1.union)([parser, otherwise]);
}

exports.fallback = fallback;

/***/ }),

/***/ 729:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.fence = void 0;

const line_1 = __webpack_require__(9315);

const array_1 = __webpack_require__(8112);

function fence(opener, limit, separation = true) {
  return ({
    source
  }) => {
    if (source === '') return;
    const matches = source.match(opener);
    if (!matches) return;
    const delim = matches[1];
    if (matches[0].indexOf(delim, delim.length) !== -1) return;
    let rest = source.slice(matches[0].length); // Prevent annoying parsing in editing.

    if ((0, line_1.isEmpty)((0, line_1.firstline)(rest)) && (0, line_1.firstline)(rest.slice((0, line_1.firstline)(rest).length)).trimEnd() !== delim) return;
    let block = '';
    let closer = '';
    let overflow = '';

    for (let count = 1;; ++count) {
      if (rest === '') break;
      const line = (0, line_1.firstline)(rest);
      if ((closer || count > limit + 1) && (0, line_1.isEmpty)(line)) break;

      if (closer) {
        overflow += line;
      }

      if (!closer && count <= limit + 1 && line.slice(0, delim.length) === delim && line.trimEnd() === delim) {
        closer = line;

        if ((0, line_1.isEmpty)((0, line_1.firstline)(rest.slice(line.length)))) {
          rest = rest.slice(line.length);
          break;
        }

        if (!separation) {
          rest = rest.slice(line.length);
          break;
        }

        overflow = line;
      }

      if (!overflow) {
        block += line;
      }

      rest = rest.slice(line.length);
    }

    return [(0, array_1.unshift)([block, overflow, closer], matches), rest];
  };
}

exports.fence = fence;

/***/ }),

/***/ 9758:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.indent = void 0;

const global_1 = __webpack_require__(4128);

const parser_1 = __webpack_require__(6728);

const some_1 = __webpack_require__(5418);

const block_1 = __webpack_require__(2804);

const line_1 = __webpack_require__(9315);

const bind_1 = __webpack_require__(1143);

const match_1 = __webpack_require__(8927);

const surround_1 = __webpack_require__(7130);

const memoize_1 = __webpack_require__(1808);

function indent(opener, parser, separation = false) {
  if (typeof opener === 'function') return indent(/^([ \t])\1*/, opener, parser);
  return (0, bind_1.bind)((0, block_1.block)((0, match_1.match)(opener, (0, memoize_1.memoize)(([indent]) => (0, some_1.some)((0, line_1.line)((0, surround_1.open)(indent, ({
    source
  }) => [[source], '']))), ([indent]) => indent.length * 2 + +(indent[0] === ' '), [])), separation), (lines, rest, context) => {
    context.offset ??= 0;
    context.offset += rest.length;
    const result = parser({
      source: trimBlockEnd(lines.join('')),
      context
    });
    context.offset -= rest.length;
    return result && (0, parser_1.exec)(result) === '' ? [(0, parser_1.eval)(result), rest] : global_1.undefined;
  });
}

exports.indent = indent;

function trimBlockEnd(block) {
  return block === '' || block[block.length - 1] !== '\n' ? block : block.slice(0, -1);
}

/***/ }),

/***/ 1497:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.lazy = void 0;

function lazy(builder) {
  let parser;
  return input => (parser ??= builder())(input);
}

exports.lazy = lazy;

/***/ }),

/***/ 8927:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.match = void 0;

const global_1 = __webpack_require__(4128);

const parser_1 = __webpack_require__(6728);

function match(pattern, f) {
  return ({
    source,
    context
  }) => {
    if (source === '') return;
    const param = source.match(pattern);
    if (!param) return;
    const result = f(param)({
      source,
      context
    });
    if (!result) return;
    return (0, parser_1.exec)(result).length < source.length && (0, parser_1.exec)(result).length <= source.length ? result : global_1.undefined;
  };
}

exports.match = match;

/***/ }),

/***/ 5231:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.recover = void 0;

function recover(parser, fallback) {
  return input => {
    try {
      return parser(input);
    } catch (reason) {
      return fallback(input, reason);
    }
  };
}

exports.recover = recover;

/***/ }),

/***/ 1109:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.reverse = void 0;

const fmap_1 = __webpack_require__(502);

function reverse(parser) {
  return (0, fmap_1.fmap)(parser, nodes => nodes.reverse());
}

exports.reverse = reverse;

/***/ }),

/***/ 1411:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.rewrite = exports.focus = void 0;

const global_1 = __webpack_require__(4128);

const parser_1 = __webpack_require__(6728);

function focus(scope, parser) {
  const match = typeof scope === 'string' ? source => source.slice(0, scope.length) === scope ? scope : '' : source => source.match(scope)?.[0] ?? '';
  return ({
    source,
    context
  }) => {
    if (source === '') return;
    const src = match(source);
    if (src === '') return;
    context.offset ??= 0;
    context.offset += source.length - src.length;
    const result = parser({
      source: src,
      context
    });
    context.offset -= source.length - src.length;
    if (!result) return;
    return (0, parser_1.exec)(result).length < src.length ? [(0, parser_1.eval)(result), (0, parser_1.exec)(result) + source.slice(src.length)] : global_1.undefined;
  };
}

exports.focus = focus;

function rewrite(scope, parser) {
  return ({
    source,
    context
  }) => {
    if (source === '') return;
    const memo = context.memo;
    context.memo = global_1.undefined;
    const res1 = scope({
      source,
      context
    });
    context.memo = memo;
    if (!res1 || (0, parser_1.exec)(res1).length >= source.length) return;
    const src = source.slice(0, source.length - (0, parser_1.exec)(res1).length);
    context.offset ??= 0;
    context.offset += source.length - src.length;
    const res2 = parser({
      source: src,
      context
    });
    context.offset -= source.length - src.length;
    if (!res2) return;
    return (0, parser_1.exec)(res2).length < src.length ? [(0, parser_1.eval)(res2), (0, parser_1.exec)(res2) + (0, parser_1.exec)(res1)] : global_1.undefined;
  };
}

exports.rewrite = rewrite;

/***/ }),

/***/ 7130:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.clear = exports.close = exports.open = exports.surround = void 0;

const global_1 = __webpack_require__(4128);

const parser_1 = __webpack_require__(6728);

const fmap_1 = __webpack_require__(502);

const array_1 = __webpack_require__(8112);

function surround(opener, parser, closer, optional = false, f, g) {
  switch (typeof opener) {
    case 'string':
    case 'object':
      return surround(match(opener), parser, closer, optional, f, g);
  }

  switch (typeof closer) {
    case 'string':
    case 'object':
      return surround(opener, parser, match(closer), optional, f, g);
  }

  return ({
    source,
    context
  }) => {
    const lmr_ = source;
    if (lmr_ === '') return;
    const res1 = opener({
      source: lmr_,
      context
    });
    if (!res1) return;
    const rl = (0, parser_1.eval)(res1);
    const mr_ = (0, parser_1.exec)(res1);
    const res2 = mr_ !== '' ? parser({
      source: mr_,
      context
    }) : global_1.undefined;
    const rm = (0, parser_1.eval)(res2);
    const r_ = (0, parser_1.exec)(res2, mr_);
    if (!rm && !optional) return;
    const res3 = closer({
      source: r_,
      context
    });
    const rr = (0, parser_1.eval)(res3);
    const rest = (0, parser_1.exec)(res3, r_);
    if (rest.length === lmr_.length) return;
    return rr ? f ? f([rl, rm, rr], rest, context) : [(0, array_1.push)((0, array_1.unshift)(rl, rm ?? []), rr), rest] : g ? g([rl, rm, mr_], rest, context) : global_1.undefined;
  };
}

exports.surround = surround;

function match(pattern) {
  switch (typeof pattern) {
    case 'string':
      return ({
        source
      }) => source.slice(0, pattern.length) === pattern ? [[], source.slice(pattern.length)] : global_1.undefined;

    case 'object':
      return ({
        source
      }) => {
        const m = source.match(pattern);
        return m ? [[], source.slice(m[0].length)] : global_1.undefined;
      };
  }
}

function open(opener, parser, optional = false) {
  return surround(opener, parser, '', optional);
}

exports.open = open;

function close(parser, closer, optional = false) {
  return surround('', parser, closer, optional);
}

exports.close = close;

function clear(parser) {
  return (0, fmap_1.fmap)(parser, () => []);
}

exports.clear = clear;

/***/ }),

/***/ 4710:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.trimEnd = exports.trimStart = exports.trim = void 0;

const convert_1 = __webpack_require__(7957);

function trim(parser) {
  return (0, convert_1.convert)(source => source.trim(), parser);
}

exports.trim = trim;

function trimStart(parser) {
  return (0, convert_1.convert)(source => source.trimStart(), parser);
}

exports.trimStart = trimStart;

function trimEnd(parser) {
  return (0, convert_1.convert)(source => source.trimEnd(), parser);
}

exports.trimEnd = trimEnd;

/***/ }),

/***/ 1143:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.bind = void 0;

const global_1 = __webpack_require__(4128);

const parser_1 = __webpack_require__(6728);

function bind(parser, f) {
  return ({
    source,
    context
  }) => {
    if (source === '') return;
    const res1 = parser({
      source,
      context
    });
    if (!res1) return;
    const res2 = f((0, parser_1.eval)(res1), (0, parser_1.exec)(res1), context);
    if (!res2) return;
    return (0, parser_1.exec)(res2).length <= (0, parser_1.exec)(res1).length ? res2 : global_1.undefined;
  };
}

exports.bind = bind;

/***/ }),

/***/ 502:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.fmap = void 0;

const bind_1 = __webpack_require__(1143);

function fmap(parser, f) {
  return (0, bind_1.bind)(parser, (nodes, rest, context) => [f(nodes, rest, context), rest]);
}

exports.fmap = fmap;

/***/ }),

/***/ 6728:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.check = exports.exec = exports.eval = void 0;

function eval_(result, default_) {
  return result ? result[0] : default_;
}

exports.eval = eval_;

function exec(result, default_) {
  return result ? result[1] : default_;
}

exports.exec = exec;

function check(source, result, mustConsume = true) {
  return true;
}

exports.check = check;

/***/ }),

/***/ 5684:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.state = exports.constraint = exports.guard = exports.precedence = exports.creation = exports.syntax = exports.context = exports.reset = void 0;

const global_1 = __webpack_require__(4128);

const alias_1 = __webpack_require__(5406);

const parser_1 = __webpack_require__(6728);

const memo_1 = __webpack_require__(1090);

function reset(base, parser) {
  if (!('memo' in base)) {
    base.memo = global_1.undefined;
  }

  const changes = global_1.Object.entries(base);
  const values = (0, global_1.Array)(changes.length);
  return ({
    source,
    context
  }) => apply(parser, source, (0, alias_1.ObjectCreate)(context), changes, values, true);
}

exports.reset = reset;

function context(base, parser) {
  const changes = global_1.Object.entries(base);
  const values = (0, global_1.Array)(changes.length);
  return ({
    source,
    context
  }) => apply(parser, source, context, changes, values);
}

exports.context = context;

function apply(parser, source, context, changes, values, reset = false) {
  if (context) for (let i = 0; i < changes.length; ++i) {
    const change = changes[i];
    const prop = change[0];

    switch (prop) {
      case 'resources':
        if (!reset) break;
        if (prop in context && !(0, alias_1.hasOwnProperty)(context, prop)) break;
        context[prop] = (0, alias_1.ObjectCreate)(change[1]);
        break;

      case 'memo':
        if (!reset) break;
        context.memo = new memo_1.Memo({
          targets: context.memo?.targets
        });
        break;

      default:
        values[i] = context[prop];
        context[prop] = change[1];
    }
  }
  const result = parser({
    source,
    context
  });
  if (context) for (let i = 0; i < changes.length; ++i) {
    const change = changes[i];
    const prop = change[0];

    switch (prop) {
      case 'resources': // @ts-expect-error

      case 'memo':
        if (!reset) break;
      // fallthrough

      default:
        context[prop] = values[i];
        values[i] = global_1.undefined;
    }
  }
  return result;
}

function syntax(syntax, prec, cost, state, parser) {
  return creation(cost, precedence(prec, ({
    source,
    context
  }) => {
    if (source === '') return;
    const memo = context.memo ??= new memo_1.Memo();
    context.offset ??= 0;
    const position = source.length + context.offset;
    const stateOuter = context.state ?? 0;
    const stateInner = context.state = stateOuter | state;
    const cache = syntax && stateInner & memo.targets && memo.get(position, syntax, stateInner);
    const result = cache ? cache.length === 0 ? global_1.undefined : [cache[0], source.slice(cache[1])] : parser({
      source,
      context
    });

    if (syntax && stateOuter & memo.targets) {
      cache ?? memo.set(position, syntax, stateInner, (0, parser_1.eval)(result), source.length - (0, parser_1.exec)(result, '').length);
    }

    if (result && !stateOuter && memo.length >= position + 2) {
      memo.clear(position + 2);
    }

    context.state = stateOuter;
    return result;
  }));
}

exports.syntax = syntax;

function creation(cost, recursion, parser) {
  if (typeof cost === 'function') return creation(1, true, cost);
  if (typeof recursion === 'function') return creation(cost, true, recursion);
  return ({
    source,
    context
  }) => {
    const resources = context.resources ?? {
      clock: 1,
      recursion: 1
    };
    if (resources.clock <= 0) throw new Error('Too many creations');
    if (resources.recursion <= 0) throw new Error('Too much recursion');
    recursion && --resources.recursion;
    const result = parser({
      source,
      context
    });
    recursion && ++resources.recursion;

    if (result) {
      resources.clock -= cost;
    }

    return result;
  };
}

exports.creation = creation;

function precedence(precedence, parser) {
  return ({
    source,
    context
  }) => {
    const p = context.precedence;
    context.precedence = precedence;
    const result = parser({
      source,
      context
    });
    context.precedence = p;
    return result;
  };
}

exports.precedence = precedence;

function guard(f, parser) {
  return ({
    source,
    context
  }) => f(context) ? parser({
    source,
    context
  }) : global_1.undefined;
}

exports.guard = guard;

function constraint(state, positive, parser) {
  if (typeof positive === 'function') {
    parser = positive;
    positive = true;
  }

  return ({
    source,
    context
  }) => {
    const s = positive ? state & context.state : state & ~context.state;
    return s === state ? parser({
      source,
      context
    }) : global_1.undefined;
  };
}

exports.constraint = constraint;

function state(state, positive, parser) {
  if (typeof positive === 'function') {
    parser = positive;
    positive = true;
  }

  return ({
    source,
    context
  }) => {
    const s = context.state ?? 0;
    context.state = positive ? s | state : s & ~state;
    const result = parser({
      source,
      context
    });
    context.state = s;
    return result;
  };
}

exports.state = state;

/***/ }),

/***/ 1435:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _a;

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Delimiters = void 0;

const memoize_1 = __webpack_require__(1808);

class Delimiters {
  constructor() {
    this.matchers = [];
    this.registry = {};
    this.length = 0;
  }

  static signature(pattern) {
    switch (typeof pattern) {
      case 'undefined':
        return `undefined`;

      case 'string':
        return `s:${pattern}`;

      case 'object':
        return `r/${pattern.source}/${pattern.flags}`;
    }
  }

  push(...delimiters) {
    for (let i = 0; i < delimiters.length; ++i) {
      const delimiter = delimiters[i];
      const {
        signature,
        matcher,
        precedence = 1
      } = delimiter;

      if (!this.registry[signature]) {
        this.matchers.unshift([this.length, signature, precedence, matcher]);
        this.registry[signature] = true;
      }

      ++this.length;
    }
  }

  pop(count = 1) {
    for (let i = 0; i < count; ++i) {
      if (--this.length === this.matchers[0][0]) {
        this.registry[this.matchers.shift()[1]] = false;
      }
    }
  }

  match(source, precedence = 1) {
    const {
      matchers
    } = this;

    for (let i = 0; i < matchers.length; ++i) {
      const matcher = matchers[i];
      if (precedence >= matcher[2]) continue;

      switch (matcher[3](source)) {
        case true:
          return true;

        case false:
          return false;

        default:
          continue;
      }
    }

    return false;
  }

}

exports.Delimiters = Delimiters;
_a = Delimiters;
Delimiters.matcher = (0, memoize_1.memoize)(pattern => {
  switch (typeof pattern) {
    case 'undefined':
      return () => undefined;

    case 'string':
      return source => source.slice(0, pattern.length) === pattern || undefined;

    case 'object':
      return (0, memoize_1.reduce)(source => pattern.test(source) || undefined);
  }
}, _a.signature);

/***/ }),

/***/ 1090:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Memo = void 0;

class Memo {
  constructor({
    targets = ~0
  } = {}) {
    this.memory = [];
    this.targets = targets;
  }

  get length() {
    return this.memory.length;
  }

  get(position, syntax, state) {
    //console.log('get', position, syntax, state, this.memory[position - 1]?.[`${syntax}:${state}`]);;
    const cache = this.memory[position - 1]?.[`${syntax}:${state}`];
    return cache?.length === 2 ? [cache[0].slice(), cache[1]] : cache;
  }

  set(position, syntax, state, nodes, offset) {
    const record = this.memory[position - 1] ??= {};
    record[`${syntax}:${state}`] = nodes ? [nodes.slice(), offset] : []; //console.log('set', position, syntax, state, record[`${syntax}:${state}`]);
  }

  clear(position) {
    const memory = this.memory;

    for (let len = memory.length, i = position; i < len; ++i) {
      memory.pop();
    } //console.log('clear', position + 1);

  }

}

exports.Memo = Memo;

/***/ }),

/***/ 2491:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.inits = void 0;

const global_1 = __webpack_require__(4128);

const parser_1 = __webpack_require__(6728);

const array_1 = __webpack_require__(8112);

function inits(parsers, resume) {
  if (parsers.length === 1) return parsers[0];
  return ({
    source,
    context
  }) => {
    let rest = source;
    let nodes;

    for (let len = parsers.length, i = 0; i < len; ++i) {
      if (rest === '') break;
      if (context.delimiters?.match(rest, context.precedence)) break;
      const result = parsers[i]({
        source: rest,
        context
      });
      if (!result) break;
      nodes = nodes ? (0, array_1.push)(nodes, (0, parser_1.eval)(result)) : (0, parser_1.eval)(result);
      rest = (0, parser_1.exec)(result);
      if (resume?.((0, parser_1.eval)(result), (0, parser_1.exec)(result)) === false) break;
    }

    return nodes && rest.length < source.length ? [nodes, rest] : global_1.undefined;
  };
}

exports.inits = inits;

/***/ }),

/***/ 2287:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.sequence = void 0;

const global_1 = __webpack_require__(4128);

const parser_1 = __webpack_require__(6728);

const array_1 = __webpack_require__(8112);

function sequence(parsers, resume) {
  if (parsers.length === 1) return parsers[0];
  return ({
    source,
    context
  }) => {
    let rest = source;
    let nodes;

    for (let len = parsers.length, i = 0; i < len; ++i) {
      if (rest === '') return;
      if (context.delimiters?.match(rest, context.precedence)) return;
      const result = parsers[i]({
        source: rest,
        context
      });
      if (!result) return;
      nodes = nodes ? (0, array_1.push)(nodes, (0, parser_1.eval)(result)) : (0, parser_1.eval)(result);
      rest = (0, parser_1.exec)(result);
      if (resume?.((0, parser_1.eval)(result), (0, parser_1.exec)(result)) === false) return;
    }

    return nodes && rest.length < source.length ? [nodes, rest] : global_1.undefined;
  };
}

exports.sequence = sequence;

/***/ }),

/***/ 5418:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.some = void 0;

const global_1 = __webpack_require__(4128);

const parser_1 = __webpack_require__(6728);

const delimiter_1 = __webpack_require__(1435);

const array_1 = __webpack_require__(8112);

function some(parser, end, delimiters = [], limit = -1) {
  if (typeof end === 'number') return some(parser, global_1.undefined, delimiters, end);
  const match = delimiter_1.Delimiters.matcher(end);
  const delims = delimiters.map(([delimiter, precedence]) => ({
    signature: delimiter_1.Delimiters.signature(delimiter),
    matcher: delimiter_1.Delimiters.matcher(delimiter),
    precedence
  }));
  return ({
    source,
    context
  }) => {
    if (source === '') return;
    let rest = source;
    let nodes;

    if (delims.length > 0) {
      context.delimiters ??= new delimiter_1.Delimiters();
      context.delimiters.push(...delims);
    }

    while (true) {
      if (rest === '') break;
      if (match(rest)) break;
      if (context.delimiters?.match(rest, context.precedence)) break;
      const result = parser({
        source: rest,
        context
      });
      if (!result) break;
      nodes = nodes ? nodes.length < (0, parser_1.eval)(result).length ? (0, array_1.unshift)(nodes, (0, parser_1.eval)(result)) : (0, array_1.push)(nodes, (0, parser_1.eval)(result)) : (0, parser_1.eval)(result);
      rest = (0, parser_1.exec)(result);
      if (limit >= 0 && source.length - rest.length > limit) break;
    }

    if (delims.length > 0) {
      context.delimiters.pop(delims.length);
    }

    return nodes && rest.length < source.length ? [nodes, rest] : global_1.undefined;
  };
}

exports.some = some;

/***/ }),

/***/ 7005:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.subsequence = void 0;

const union_1 = __webpack_require__(6366);

const inits_1 = __webpack_require__(2491);

function subsequence(parsers, resume) {
  return (0, union_1.union)(parsers.map((_, i) => i + 1 < parsers.length ? (0, inits_1.inits)([parsers[i], subsequence(parsers.slice(i + 1), resume)], resume) : parsers[i]));
}

exports.subsequence = subsequence;

/***/ }),

/***/ 960:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.tails = void 0;

const union_1 = __webpack_require__(6366);

const sequence_1 = __webpack_require__(2287);

function tails(parsers, resume) {
  return (0, union_1.union)(parsers.map((_, i) => (0, sequence_1.sequence)(parsers.slice(i), resume)));
}

exports.tails = tails;

/***/ }),

/***/ 6366:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.union = void 0;

const global_1 = __webpack_require__(4128);

function union(parsers) {
  switch (parsers.length) {
    case 0:
      return () => global_1.undefined;

    case 1:
      return parsers[0];

    default:
      return (0, global_1.Function)('parsers', ['"use strict";', 'return (input, context) =>', '0', ...parsers.map((_, i) => `|| parsers[${i}](input, context)`)].join('\n'))(parsers);
  }
}

exports.union = union;

/***/ }),

/***/ 3019:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  var desc = Object.getOwnPropertyDescriptor(m, k);

  if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
    desc = {
      enumerable: true,
      get: function () {
        return m[k];
      }
    };
  }

  Object.defineProperty(o, k2, desc);
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __exportStar = this && this.__exportStar || function (m, exports) {
  for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));

__exportStar(__webpack_require__(8315), exports);

/***/ }),

/***/ 8315:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.normalize = exports.body = exports.headers = exports.header = exports.caches = exports.bind = exports.parse = void 0;

var parse_1 = __webpack_require__(5013);

Object.defineProperty(exports, "parse", ({
  enumerable: true,
  get: function () {
    return parse_1.parse;
  }
}));

var bind_1 = __webpack_require__(9912);

Object.defineProperty(exports, "bind", ({
  enumerable: true,
  get: function () {
    return bind_1.bind;
  }
}));

var cache_1 = __webpack_require__(6273);

Object.defineProperty(exports, "caches", ({
  enumerable: true,
  get: function () {
    return cache_1.caches;
  }
}));

var header_1 = __webpack_require__(7790);

Object.defineProperty(exports, "header", ({
  enumerable: true,
  get: function () {
    return header_1.header;
  }
}));
Object.defineProperty(exports, "headers", ({
  enumerable: true,
  get: function () {
    return header_1.headers;
  }
}));

var body_1 = __webpack_require__(168);

Object.defineProperty(exports, "body", ({
  enumerable: true,
  get: function () {
    return body_1.body;
  }
}));

var normalize_1 = __webpack_require__(185);

Object.defineProperty(exports, "normalize", ({
  enumerable: true,
  get: function () {
    return normalize_1.normalize;
  }
}));

/***/ }),

/***/ 9912:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.bind = void 0;

const global_1 = __webpack_require__(4128);

const parser_1 = __webpack_require__(6728);

const memo_1 = __webpack_require__(1090);

const segment_1 = __webpack_require__(9002);

const header_1 = __webpack_require__(5702);

const block_1 = __webpack_require__(4032);

const normalize_1 = __webpack_require__(185);

const header_2 = __webpack_require__(7790);

const figure_1 = __webpack_require__(9123);

const footnote_1 = __webpack_require__(7529);

const url_1 = __webpack_require__(2261);

const array_1 = __webpack_require__(8112);

function bind(target, settings) {
  let context = { ...settings,
    host: settings.host ?? new url_1.ReadonlyURL(global_1.location.pathname, global_1.location.origin),
    memo: new memo_1.Memo({
      targets: 236
      /* State.backtrackers */

    })
  };
  if (context.host?.origin === 'null') throw new Error(`Invalid host: ${context.host.href}`);
  const blocks = [];
  const adds = [];
  const dels = [];
  const bottom = target.firstChild;
  let revision;
  return {
    parse,
    nearest,
    index
  };

  function* parse(source) {
    if (settings.chunk && revision) throw new Error('Chunks cannot be updated');
    const url = (0, header_2.headers)(source).find(field => field.toLowerCase().startsWith('url:'))?.slice(4).trim() ?? '';
    source = (0, normalize_1.normalize)((0, segment_1.validate)(source, segment_1.MAX_INPUT_SIZE) ? source : source.slice(0, segment_1.MAX_INPUT_SIZE + 1)); // Change the object identity.

    context = { ...context,
      url: url ? new url_1.ReadonlyURL(url) : global_1.undefined
    };
    const rev = revision = Symbol();
    const sourceSegments = [];

    for (const seg of (0, segment_1.segment)(source)) {
      sourceSegments.push(seg);
      yield {
        type: 'segment',
        value: seg
      };
    }

    const targetSegments = blocks.map(([seg]) => seg);
    let head = 0;

    for (; head < targetSegments.length; ++head) {
      if (blocks[head][2] !== url) break;
      if (targetSegments[head] !== sourceSegments[head]) break;
    }

    if (adds.length + dels.length === 0 && sourceSegments.length === targetSegments.length && head === sourceSegments.length) return;
    let last = 0;

    for (; head + last < targetSegments.length && head + last < sourceSegments.length; ++last) {
      if (blocks[targetSegments.length - last - 1][2] !== url) break;
      if (targetSegments[targetSegments.length - last - 1] !== sourceSegments[sourceSegments.length - last - 1]) break;
    }

    const base = next(head);
    let index = head;

    for (; index < sourceSegments.length - last; ++index) {
      const seg = sourceSegments[index];
      const es = (0, parser_1.eval)((0, header_1.header)({
        source: seg,
        context: {
          header: index === 0
        }
      }) || (0, block_1.block)({
        source: seg,
        context
      }), []);
      blocks.splice(index, 0, [seg, es, url]);
      if (es.length === 0) continue; // All deletion processes always run after all addition processes have done.
      // Therefore any `base` node will never be unavailable by deletions until all the dependent `el` nodes are added.

      (0, array_1.push)(adds, es.map(el => [el, base]));

      while (adds.length > 0) {
        const [el, base] = adds.shift();
        target.insertBefore(el, base);
        yield {
          type: 'block',
          value: el
        };
        if (rev !== revision) return yield {
          type: 'cancel'
        };
      }
    }

    for (let refuse = (0, array_1.splice)(blocks, index, blocks.length - sourceSegments.length), i = 0; i < refuse.length; ++i) {
      const es = refuse[i][1];
      if (es.length === 0) continue;
      (0, array_1.push)(dels, es.map(el => [el]));
    }

    while (adds.length > 0) {
      const [el, base] = adds.shift();
      target.insertBefore(el, base);
      yield {
        type: 'block',
        value: el
      };
      if (rev !== revision) return yield {
        type: 'cancel'
      };
    }

    while (dels.length > 0) {
      const [el] = dels.shift();
      el.parentNode?.removeChild(el);
      yield {
        type: 'block',
        value: el
      };
      if (rev !== revision) return yield {
        type: 'cancel'
      };
    }

    for (const el of (0, figure_1.figure)(next(0)?.parentNode ?? target, settings.footnotes, context)) {
      el ? yield {
        type: 'figure',
        value: el
      } : yield {
        type: 'break'
      };
      if (rev !== revision) return yield {
        type: 'cancel'
      };
    }

    for (const el of (0, footnote_1.footnote)(next(0)?.parentNode ?? target, settings.footnotes, context, bottom)) {
      el ? yield {
        type: 'footnote',
        value: el
      } : yield {
        type: 'break'
      };
      if (rev !== revision) return yield {
        type: 'cancel'
      };
    }
  }

  function next(index) {
    for (let i = index; i < blocks.length; ++i) {
      const [, es] = blocks[i];
      if (es.length > 0) return es[0];
    }

    return bottom;
  }

  function nearest(index) {
    let el;

    for (let len = 0, i = 0; i < blocks.length; ++i) {
      const block = blocks[i];
      len += block[0].length;
      el = block[1][0] ?? el;
      if (len >= index) break;
    }

    return el;
  }

  function index(source) {
    for (let len = 0, i = 0; i < blocks.length; ++i) {
      const block = blocks[i];
      if (block[1].includes(source)) return len;
      len += block[0].length;
    }

    return -1;
  }
}

exports.bind = bind;

/***/ }),

/***/ 168:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.body = void 0;

const header_1 = __webpack_require__(7790);

function body(source) {
  return source.slice((0, header_1.header)(source).length);
}

exports.body = body;

/***/ }),

/***/ 6273:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.caches = void 0;

const cache_1 = __webpack_require__(9210); // For rerendering in editing.


exports.caches = {
  code: new cache_1.Cache(100),
  math: new cache_1.Cache(100),
  media: new cache_1.Cache(100)
};

/***/ }),

/***/ 7790:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.headers = exports.header = void 0;

const parser_1 = __webpack_require__(6728);

const header_1 = __webpack_require__(5702);

function header(source) {
  const [, rest = source] = parse(source);
  return source.slice(0, source.length - rest.length);
}

exports.header = header;

function headers(source) {
  const [el] = parse(source);
  return el?.textContent.trimEnd().slice(el.firstChild.firstChild.textContent.length).split('\n') ?? [];
}

exports.headers = headers;

function parse(source) {
  const result = (0, header_1.header)({
    source,
    context: {}
  });
  const [el] = (0, parser_1.eval)(result, []);
  return el?.tagName === 'ASIDE' ? [el, (0, parser_1.exec)(result)] : [];
}

/***/ }),

/***/ 185:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.escape = exports.invisibleHTMLEntityNames = exports.normalize = void 0;

const parser_1 = __webpack_require__(6728);

const htmlentity_1 = __webpack_require__(1562);

const UNICODE_REPLACEMENT_CHARACTER = '\uFFFD';

function normalize(source) {
  return sanitize(format(source));
}

exports.normalize = normalize;

function format(source) {
  return source.replace(/\r\n?/g, '\n');
}

function sanitize(source) {
  return source.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]|[\u2006\u200B-\u200F\u202A-\u202F\u2060\uFEFF]|(^|[^\u1820\u1821])\u180E/g, `$1${UNICODE_REPLACEMENT_CHARACTER}`).replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]?|[\uDC00-\uDFFF]/g, char => char.length === 1 ? UNICODE_REPLACEMENT_CHARACTER : char);
} // https://dev.w3.org/html5/html-author/charref
// https://en.wikipedia.org/wiki/Whitespace_character


exports.invisibleHTMLEntityNames = ['Tab', 'NewLine', 'NonBreakingSpace', 'nbsp', 'shy', 'ensp', 'emsp', 'emsp13', 'emsp14', 'numsp', 'puncsp', 'ThinSpace', 'thinsp', 'VeryThinSpace', 'hairsp', 'ZeroWidthSpace', 'NegativeVeryThinSpace', 'NegativeThinSpace', 'NegativeMediumSpace', 'NegativeThickSpace', 'zwj', 'zwnj', 'lrm', 'rlm', 'MediumSpace', 'NoBreak', 'ApplyFunction', 'af', 'InvisibleTimes', 'it', 'InvisibleComma', 'ic'];
const unreadableHTMLEntityNames = exports.invisibleHTMLEntityNames.slice(2);
const unreadableEscapableCharacters = unreadableHTMLEntityNames.map(name => (0, parser_1.eval)((0, htmlentity_1.unsafehtmlentity)({
  source: `&${name};`,
  context: {}
}))[0]);
const unreadableEscapableCharacter = new RegExp(`[${[...new Set(unreadableEscapableCharacters)].join('')}]`, 'g');
// https://www.pandanoir.info/entry/2018/03/11/193000
// http://anti.rosx.net/etc/memo/002_space.html
// http://nicowiki.com/%E7%A9%BA%E7%99%BD%E3%83%BB%E7%89%B9%E6%AE%8A%E8%A8%98%E5%8F%B7.html
const unreadableSpecialCharacters = (/* unused pure expression or super */ null && ([// SIX-PER-EM SPACE
'\u2006', // ZERO WIDTH SPACE
'\u200B', // ZERO WIDTH NON-JOINER
'\u200C', // ZERO WIDTH JOINER
'\u200D', // LEFT-TO-RIGHT MARK
'\u200E', // RIGHT-TO-LEFT MARK
'\u200F', // LEFT-TO-RIGHT EMBEDDING
'\u202A', // RIGHT-TO-LEFT EMBEDDING
'\u202B', // POP DIRECTIONAL FORMATTING
'\u202C', // LEFT-TO-RIGHT OVERRIDE
'\u202D', // RIGHT-TO-LEFT OVERRIDE
'\u202E', // NARROW NO-BREAK SPACE
'\u202F', // WORD JOINER
'\u2060', // ZERO WIDTH NON-BREAKING SPACE
'\uFEFF']));

// 特殊不可視文字はエディタおよびソースビューアでは等幅および強調表示により可視化する
function escape(source) {
  return source.replace(unreadableEscapableCharacter, char => `&${unreadableHTMLEntityNames[unreadableEscapableCharacters.indexOf(char)]};`);
}

exports.escape = escape;

/***/ }),

/***/ 5013:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.parse = void 0;

const global_1 = __webpack_require__(4128);

const parser_1 = __webpack_require__(6728);

const memo_1 = __webpack_require__(1090);

const segment_1 = __webpack_require__(9002);

const header_1 = __webpack_require__(5702);

const block_1 = __webpack_require__(4032);

const normalize_1 = __webpack_require__(185);

const header_2 = __webpack_require__(7790);

const figure_1 = __webpack_require__(9123);

const footnote_1 = __webpack_require__(7529);

const url_1 = __webpack_require__(2261);

const dom_1 = __webpack_require__(3252);

function parse(source, opts = {}, context) {
  if (!(0, segment_1.validate)(source, segment_1.MAX_SEGMENT_SIZE)) throw new Error(`Too large input over ${segment_1.MAX_SEGMENT_SIZE.toLocaleString('en')} bytes.`);
  const url = (0, header_2.headers)(source).find(field => field.toLowerCase().startsWith('url:'))?.slice(4).trim() ?? '';
  source = !context ? (0, normalize_1.normalize)(source) : source;
  context = {
    host: opts.host ?? context?.host ?? new url_1.ReadonlyURL(global_1.location.pathname, global_1.location.origin),
    url: url ? new url_1.ReadonlyURL(url) : context?.url,
    id: opts.id ?? context?.id,
    caches: context?.caches,
    ...(context?.resources && {
      resources: context.resources
    }),
    memo: new memo_1.Memo({
      targets: 236
      /* State.backtrackers */

    })
  };
  if (context.host?.origin === 'null') throw new Error(`Invalid host: ${context.host.href}`);
  const node = (0, dom_1.frag)();
  let index = 0;

  for (const seg of (0, segment_1.segment)(source)) {
    node.append(...(0, parser_1.eval)((0, header_1.header)({
      source: seg,
      context: {
        header: index++ === 0
      }
    }) || (0, block_1.block)({
      source: seg,
      context
    }), []));
  }

  if (opts.test) return node;

  for (const _ of (0, figure_1.figure)(node, opts.footnotes, context));

  for (const _ of (0, footnote_1.footnote)(node, opts.footnotes, context));

  return node;
}

exports.parse = parse;

/***/ }),

/***/ 6578:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.autolink = void 0;

const combinator_1 = __webpack_require__(2087);

const autolink_1 = __webpack_require__(6051);

const source_1 = __webpack_require__(6743);

const delimiter = /[@#>0-9A-Za-z\n]|\S[#>]/;

const autolink = ({
  source,
  context
}) => {
  if (source === '') return;
  const i = source.search(delimiter);

  switch (i) {
    case -1:
      return [[source], ''];

    case 0:
      return parser({
        source,
        context
      });

    default:
      return [[source.slice(0, i)], source.slice(i)];
  }
};

exports.autolink = autolink;
const parser = (0, combinator_1.lazy)(() => (0, combinator_1.union)([autolink_1.autolink, source_1.linebreak, source_1.unescsource]));

/***/ }),

/***/ 4032:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.block = void 0;

const global_1 = __webpack_require__(4128);

const combinator_1 = __webpack_require__(2087);

const source_1 = __webpack_require__(6743);

const horizontalrule_1 = __webpack_require__(9967);

const heading_1 = __webpack_require__(4623);

const ulist_1 = __webpack_require__(5425);

const olist_1 = __webpack_require__(7471);

const ilist_1 = __webpack_require__(238);

const dlist_1 = __webpack_require__(9373);

const table_1 = __webpack_require__(8717);

const codeblock_1 = __webpack_require__(1849);

const mathblock_1 = __webpack_require__(3754);

const extension_1 = __webpack_require__(4751);

const sidefence_1 = __webpack_require__(4078);

const blockquote_1 = __webpack_require__(7859);

const reply_1 = __webpack_require__(9978);

const paragraph_1 = __webpack_require__(6457);

const random_1 = __webpack_require__(7325);

const dom_1 = __webpack_require__(3252);

exports.block = (0, combinator_1.creation)(1, false, error((0, combinator_1.reset)({
  resources: {
    clock: 50 * 1000,
    recursion: 20
  }
}, (0, combinator_1.union)([source_1.emptyline, horizontalrule_1.horizontalrule, heading_1.heading, ulist_1.ulist, olist_1.olist, ilist_1.ilist, dlist_1.dlist, table_1.table, codeblock_1.codeblock, mathblock_1.mathblock, extension_1.extension, sidefence_1.sidefence, blockquote_1.blockquote, reply_1.reply, paragraph_1.paragraph]))));

function error(parser) {
  return (0, combinator_1.recover)((0, combinator_1.fallback)((0, combinator_1.open)('\x07', ({
    source
  }) => {
    throw new Error(source.split('\n', 1)[0]);
  }), parser), ({
    source,
    context: {
      id
    }
  }, reason) => [[(0, dom_1.html)('h1', {
    id: id !== '' ? `error:${(0, random_1.rnd0Z)(8)}` : global_1.undefined,
    class: 'error'
  }, reason instanceof Error ? `${reason.name}: ${reason.message}` : `UnknownError: ${reason}`), (0, dom_1.html)('pre', {
    class: 'error',
    translate: 'no'
  }, source.replace(/^\x07.*\n/, '').slice(0, 1001).replace(/^(.{997}).{4}$/s, '$1...') || global_1.undefined)], '']);
}

/***/ }),

/***/ 7859:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.blockquote = exports.segment = void 0;

const combinator_1 = __webpack_require__(2087);

const autolink_1 = __webpack_require__(6578);

const source_1 = __webpack_require__(6743);

const parse_1 = __webpack_require__(5013);

const dom_1 = __webpack_require__(3252);

exports.segment = (0, combinator_1.block)((0, combinator_1.validate)(['!>', '>'], (0, combinator_1.union)([(0, combinator_1.validate)(/^!?>+(?=[^\S\n]|\n[^\S\n]*\S)/, (0, combinator_1.some)(source_1.contentline))])));
exports.blockquote = (0, combinator_1.lazy)(() => (0, combinator_1.block)((0, combinator_1.rewrite)(exports.segment, (0, combinator_1.union)([(0, combinator_1.open)(/^(?=>)/, source), (0, combinator_1.open)(/^!(?=>)/, markdown)]))));
const opener = /^(?=>>+(?:$|\s))/;
const indent = (0, combinator_1.block)((0, combinator_1.open)(opener, (0, combinator_1.some)(source_1.contentline, /^>(?:$|\s)/)), false);

const unindent = source => source.replace(/(^|\n)>(?:[^\S\n]|(?=>*(?:$|\s)))|\n$/g, '$1');

const source = (0, combinator_1.lazy)(() => (0, combinator_1.fmap)((0, combinator_1.some)((0, combinator_1.creation)(1, false, (0, combinator_1.union)([(0, combinator_1.rewrite)(indent, (0, combinator_1.convert)(unindent, source)), (0, combinator_1.rewrite)((0, combinator_1.some)(source_1.contentline, opener), (0, combinator_1.convert)(unindent, (0, combinator_1.fmap)((0, combinator_1.some)(autolink_1.autolink), ns => [(0, dom_1.html)('pre', (0, dom_1.defrag)(ns))])))]))), ns => [(0, dom_1.html)('blockquote', ns)]));
const markdown = (0, combinator_1.lazy)(() => (0, combinator_1.fmap)((0, combinator_1.some)((0, combinator_1.creation)(1, false, (0, combinator_1.union)([(0, combinator_1.rewrite)(indent, (0, combinator_1.convert)(unindent, markdown)), (0, combinator_1.creation)(99, false, (0, combinator_1.rewrite)((0, combinator_1.some)(source_1.contentline, opener), (0, combinator_1.convert)(unindent, ({
  source,
  context
}) => {
  const references = (0, dom_1.html)('ol', {
    class: 'references'
  });
  const document = (0, parse_1.parse)(source, {
    id: '',
    footnotes: {
      references
    }
  }, context);
  return [[(0, dom_1.html)('section', [document, (0, dom_1.html)('h2', 'References'), references])], ''];
})))]))), ns => [(0, dom_1.html)('blockquote', ns)]));

/***/ }),

/***/ 1849:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.codeblock = exports.segment_ = exports.segment = void 0;

const global_1 = __webpack_require__(4128);

const parser_1 = __webpack_require__(6728);

const combinator_1 = __webpack_require__(2087);

const autolink_1 = __webpack_require__(6578);

const dom_1 = __webpack_require__(3252);

const opener = /^(`{3,})(?!`)([^\n]*)(?:$|\n)/;
const language = /^[0-9a-z]+(?:-[a-z][0-9a-z]*)*$/i;
exports.segment = (0, combinator_1.block)((0, combinator_1.validate)('```', (0, combinator_1.clear)((0, combinator_1.fence)(opener, 300))));
exports.segment_ = (0, combinator_1.block)((0, combinator_1.validate)('```', (0, combinator_1.clear)((0, combinator_1.fence)(opener, 300, false))), false);
exports.codeblock = (0, combinator_1.block)((0, combinator_1.validate)('```', (0, combinator_1.fmap)((0, combinator_1.fence)(opener, 300), // Bug: Type mismatch between outer and inner.
([body, overflow, closer, opener, delim, param], _, context) => {
  const params = param.match(/(?:\\.?|\S)+/g)?.reduce((params, value, i) => {
    let name;

    switch (true) {
      case i === 0 && value[0] === param[0] && language.test(value):
        name = 'lang';
        value = value.toLowerCase();
        break;

      case /^\d+(?:[,-]\d+)*$/.test(value):
        name = 'line';
        break;

      default:
        name = 'path';

        if (!params.lang) {
          const file = value.split('/').pop() ?? '';
          params.lang = file && file.includes('.', 1) ? file.split('.').pop()?.match(language)?.[0].toLowerCase() : params.lang;
        }

    }

    name in params ? params.invalid = `Duplicate ${name} attribute` : params[name] = value;
    return params;
  }, {}) ?? {};
  if (!closer || overflow || params.invalid) return [(0, dom_1.html)('pre', {
    class: 'invalid',
    translate: 'no',
    'data-invalid-syntax': 'codeblock',
    'data-invalid-type': !closer || overflow ? 'fence' : 'argument',
    'data-invalid-message': !closer ? `Missing the closing delimiter "${delim}"` : overflow ? `Invalid trailing line after the closing delimiter "${delim}"` : params.invalid
  }, `${opener}${body}${overflow || closer}`)];
  const el = (0, dom_1.html)('pre', {
    class: params.lang ? `code language-${params.lang}` : 'text',
    translate: params.lang ? 'no' : global_1.undefined,
    'data-lang': params.lang || global_1.undefined,
    'data-line': params.line || global_1.undefined,
    'data-path': params.path || global_1.undefined
  }, params.lang ? context.caches?.code?.get(`${params.lang ?? ''}\n${body.slice(0, -1)}`)?.cloneNode(true).childNodes || body.slice(0, -1) || global_1.undefined : (0, dom_1.defrag)((0, parser_1.eval)((0, combinator_1.some)(autolink_1.autolink)({
    source: body.slice(0, -1),
    context
  }), [])));
  return [el];
})));

/***/ }),

/***/ 9373:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.dlist = void 0;

const combinator_1 = __webpack_require__(2087);

const inline_1 = __webpack_require__(1160);

const source_1 = __webpack_require__(6743);

const locale_1 = __webpack_require__(5485);

const visibility_1 = __webpack_require__(7618);

const array_1 = __webpack_require__(8112);

const dom_1 = __webpack_require__(3252);

exports.dlist = (0, combinator_1.lazy)(() => (0, combinator_1.block)((0, locale_1.localize)((0, combinator_1.fmap)((0, combinator_1.validate)(/^~[^\S\n]+(?=\S)/, (0, combinator_1.some)((0, combinator_1.inits)([(0, combinator_1.state)(128
/* State.annotation */
| 64
/* State.reference */
| 32
/* State.index */
| 16
/* State.label */
| 8
/* State.link */
| 4
/* State.media */
, (0, combinator_1.some)(term)), (0, combinator_1.some)(desc)]))), es => [(0, dom_1.html)('dl', fillTrailingDescription(es))]))));
const term = (0, combinator_1.creation)(1, false, (0, combinator_1.line)((0, inline_1.indexee)((0, combinator_1.fmap)((0, combinator_1.open)(/^~[^\S\n]+(?=\S)/, (0, visibility_1.visualize)((0, visibility_1.trimBlank)((0, combinator_1.some)((0, combinator_1.union)([inline_1.indexer, inline_1.inline])))), true), ns => [(0, dom_1.html)('dt', (0, dom_1.defrag)(ns))]))));
const desc = (0, combinator_1.creation)(1, false, (0, combinator_1.block)((0, combinator_1.fmap)((0, combinator_1.open)(/^:[^\S\n]+(?=\S)|/, (0, combinator_1.rewrite)((0, combinator_1.some)(source_1.anyline, /^[~:][^\S\n]+\S/), (0, visibility_1.visualize)((0, combinator_1.trimEnd)((0, combinator_1.some)((0, combinator_1.union)([inline_1.inline]))))), true), ns => [(0, dom_1.html)('dd', (0, dom_1.defrag)(ns))]), false));

function fillTrailingDescription(es) {
  return es.length > 0 && es[es.length - 1].tagName === 'DT' ? (0, array_1.push)(es, [(0, dom_1.html)('dd')]) : es;
}

/***/ }),

/***/ 4751:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.extension = exports.segment = void 0;

const combinator_1 = __webpack_require__(2087);

const figbase_1 = __webpack_require__(7922);

const fig_1 = __webpack_require__(362);

const figure_1 = __webpack_require__(3790);

const table_1 = __webpack_require__(4511);

const message_1 = __webpack_require__(1467);

const aside_1 = __webpack_require__(7523);

const example_1 = __webpack_require__(230);

const placeholder_1 = __webpack_require__(5198);

exports.segment = (0, combinator_1.validate)(['~~~', '[$', '$'], (0, combinator_1.validate)(/^~{3,}|^\[?\$[A-Za-z-]\S+[^\S\n]*(?:$|\n)/, (0, combinator_1.union)([fig_1.segment, figure_1.segment, table_1.segment, placeholder_1.segment])));
exports.extension = (0, combinator_1.union)([figbase_1.figbase, fig_1.fig, figure_1.figure, table_1.table, message_1.message, aside_1.aside, example_1.example, placeholder_1.placeholder]);

/***/ }),

/***/ 7523:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.aside = void 0;

const combinator_1 = __webpack_require__(2087);

const indexee_1 = __webpack_require__(1269);

const parse_1 = __webpack_require__(5013);

const dom_1 = __webpack_require__(3252);

exports.aside = (0, combinator_1.block)((0, combinator_1.validate)('~~~', (0, combinator_1.fmap)((0, combinator_1.fence)(/^(~{3,})aside(?!\S)([^\n]*)(?:$|\n)/, 300), // Bug: Type mismatch between outer and inner.
([body, overflow, closer, opener, delim, param], _, context) => {
  if (!closer || overflow || param.trimStart()) return [(0, dom_1.html)('pre', {
    class: 'invalid',
    translate: 'no',
    'data-invalid-syntax': 'aside',
    'data-invalid-type': !closer || overflow ? 'fence' : 'argument',
    'data-invalid-message': !closer ? `Missing the closing delimiter "${delim}"` : overflow ? `Invalid trailing line after the closing delimiter "${delim}"` : 'Invalid argument'
  }, `${opener}${body}${overflow || closer}`)];
  const references = (0, dom_1.html)('ol', {
    class: 'references'
  });
  const document = (0, parse_1.parse)(body.slice(0, -1), {
    id: '',
    footnotes: {
      references
    }
  }, context);
  // Bug: Firefox
  //const heading = document.querySelector(':scope > h1:first-child');
  const heading = 'H1 H2 H3 H4 H5 H6'.split(' ').includes(document.firstElementChild?.tagName) && document.firstElementChild;
  if (!heading) return [(0, dom_1.html)('pre', {
    class: 'invalid',
    translate: 'no',
    'data-invalid-syntax': 'aside',
    'data-invalid-type': 'content',
    'data-invalid-message': 'Missing the title at the first line'
  }, `${opener}${body}${closer}`)];
  return [(0, dom_1.html)('aside', {
    id: (0, indexee_1.identity)((0, indexee_1.text)(heading)),
    class: 'aside'
  }, [document, (0, dom_1.html)('h2', 'References'), references])];
})));

/***/ }),

/***/ 230:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.example = void 0;

const parser_1 = __webpack_require__(6728);

const combinator_1 = __webpack_require__(2087);

const parse_1 = __webpack_require__(5013);

const mathblock_1 = __webpack_require__(3754);

const dom_1 = __webpack_require__(3252);

const opener = /^(~{3,})(?:example\/(\S+))?(?!\S)([^\n]*)(?:$|\n)/;
exports.example = (0, combinator_1.block)((0, combinator_1.validate)('~~~', (0, combinator_1.fmap)((0, combinator_1.fence)(opener, 300), // Bug: Type mismatch between outer and inner.
([body, overflow, closer, opener, delim, type = 'markdown', param], _, context) => {
  if (!closer || overflow || param.trimStart()) return [(0, dom_1.html)('pre', {
    class: 'invalid',
    translate: 'no',
    'data-invalid-syntax': 'example',
    'data-invalid-type': !closer || overflow ? 'fence' : 'argument',
    'data-invalid-message': !closer ? `Missing the closing delimiter "${delim}"` : overflow ? `Invalid trailing line after the closing delimiter "${delim}"` : 'Invalid argument'
  }, `${opener}${body}${overflow || closer}`)];

  switch (type) {
    case 'markdown':
      {
        const references = (0, dom_1.html)('ol', {
          class: 'references'
        });
        const document = (0, parse_1.parse)(body.slice(0, -1), {
          id: '',
          footnotes: {
            references
          }
        }, context);
        return [(0, dom_1.html)('aside', {
          class: 'example',
          'data-type': 'markdown'
        }, [(0, dom_1.html)('pre', {
          translate: 'no'
        }, body.slice(0, -1)), (0, dom_1.html)('hr'), (0, dom_1.html)('section', [document, (0, dom_1.html)('h2', 'References'), references])])];
      }

    case 'math':
      return [(0, dom_1.html)('aside', {
        class: 'example',
        'data-type': 'math'
      }, [(0, dom_1.html)('pre', {
        translate: 'no'
      }, body.slice(0, -1)), (0, dom_1.html)('hr'), (0, parser_1.eval)((0, mathblock_1.mathblock)({
        source: `$$\n${body}$$`,
        context
      }), [])[0]])];

    default:
      return [(0, dom_1.html)('pre', {
        class: 'invalid',
        translate: 'no',
        'data-invalid-syntax': 'example',
        'data-invalid-type': 'type',
        'data-invalid-message': 'Invalid example type'
      }, `${opener}${body}${closer}`)];
  }
})));

/***/ }),

/***/ 362:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.fig = exports.segment = void 0;

const combinator_1 = __webpack_require__(2087);

const source_1 = __webpack_require__(6743);

const figure_1 = __webpack_require__(3790);

const label_1 = __webpack_require__(466);

const codeblock_1 = __webpack_require__(1849);

const mathblock_1 = __webpack_require__(3754);

const table_1 = __webpack_require__(4511);

const blockquote_1 = __webpack_require__(7859);

const placeholder_1 = __webpack_require__(5198);

exports.segment = (0, combinator_1.block)((0, combinator_1.validate)(['[$', '$'], (0, combinator_1.sequence)([(0, combinator_1.line)((0, combinator_1.close)(label_1.segment, /^(?=\s).*\n/)), (0, combinator_1.union)([codeblock_1.segment, mathblock_1.segment, table_1.segment, blockquote_1.segment, placeholder_1.segment, (0, combinator_1.some)(source_1.contentline)])])));
exports.fig = (0, combinator_1.block)((0, combinator_1.rewrite)(exports.segment, (0, combinator_1.verify)((0, combinator_1.convert)(source => {
  const fence = (/^[^\n]*\n!?>+\s/.test(source) && source.match(/^~{3,}(?=[^\S\n]*$)/mg) || []).reduce((max, fence) => fence > max ? fence : max, '~~') + '~';
  return `${fence}figure ${source}\n\n${fence}`;
}, (0, combinator_1.union)([figure_1.figure])), ([el]) => el.tagName === 'FIGURE')));

/***/ }),

/***/ 7922:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.figbase = void 0;

const combinator_1 = __webpack_require__(2087);

const label_1 = __webpack_require__(466);

const dom_1 = __webpack_require__(3252);

exports.figbase = (0, combinator_1.block)((0, combinator_1.fmap)((0, combinator_1.validate)(/^\[?\$-(?:[0-9]+\.)*0\]?[^\S\n]*(?!\S|\n[^\S\n]*\S)/, (0, combinator_1.line)((0, combinator_1.union)([label_1.label]))), ([el]) => {
  const label = el.getAttribute('data-label');
  const group = label.split('-', 1)[0];
  return [(0, dom_1.html)('figure', {
    'data-label': label,
    'data-group': group,
    hidden: ''
  })];
}));

/***/ }),

/***/ 3790:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.figure = exports.segment = void 0;

const global_1 = __webpack_require__(4128);

const combinator_1 = __webpack_require__(2087);

const source_1 = __webpack_require__(6743);

const label_1 = __webpack_require__(466);

const ulist_1 = __webpack_require__(5425);

const olist_1 = __webpack_require__(7471);

const table_1 = __webpack_require__(8717);

const codeblock_1 = __webpack_require__(1849);

const mathblock_1 = __webpack_require__(3754);

const example_1 = __webpack_require__(230);

const table_2 = __webpack_require__(4511);

const blockquote_1 = __webpack_require__(7859);

const placeholder_1 = __webpack_require__(5198);

const inline_1 = __webpack_require__(1160);

const locale_1 = __webpack_require__(5485);

const visibility_1 = __webpack_require__(7618);

const memoize_1 = __webpack_require__(1808);

const dom_1 = __webpack_require__(3252);

exports.segment = (0, combinator_1.block)((0, combinator_1.match)(/^(~{3,})(?:figure[^\S\n])?(?=\[?\$)/, (0, memoize_1.memoize)(([, fence], closer = new RegExp(String.raw`^${fence}[^\S\n]*(?:$|\n)`)) => (0, combinator_1.close)((0, combinator_1.sequence)([source_1.contentline, (0, combinator_1.inits)([// All parsers which can include closing terms.
(0, combinator_1.union)([codeblock_1.segment_, mathblock_1.segment_, table_2.segment_, blockquote_1.segment, placeholder_1.segment_, (0, combinator_1.some)(source_1.contentline, closer)]), source_1.emptyline, (0, combinator_1.union)([source_1.emptyline, (0, combinator_1.some)(source_1.contentline, closer)])])]), closer), ([, fence]) => fence.length, [])));
exports.figure = (0, combinator_1.block)((0, combinator_1.fallback)((0, combinator_1.rewrite)(exports.segment, (0, combinator_1.fmap)((0, combinator_1.convert)(source => source.slice(source.match(/^~+(?:\w+\s+)?/)[0].length, source.trimEnd().lastIndexOf('\n')), (0, combinator_1.sequence)([(0, combinator_1.line)((0, combinator_1.sequence)([label_1.label, (0, source_1.str)(/^(?=\s).*\n/)])), (0, combinator_1.inits)([(0, combinator_1.block)((0, combinator_1.union)([ulist_1.ulist, olist_1.olist, table_1.table, codeblock_1.codeblock, mathblock_1.mathblock, example_1.example, table_2.table, blockquote_1.blockquote, placeholder_1.placeholder, (0, combinator_1.line)(inline_1.media), (0, combinator_1.line)(inline_1.shortmedia)])), source_1.emptyline, (0, combinator_1.block)((0, locale_1.localize)((0, combinator_1.state)(4
/* State.media */
, (0, visibility_1.visualize)((0, visibility_1.trimBlank)((0, combinator_1.trimEnd)((0, combinator_1.some)(inline_1.inline)))))))])])), ([label, param, content, ...caption]) => [(0, dom_1.html)('figure', attributes(label.getAttribute('data-label'), param, content, caption), [(0, dom_1.html)('figcaption', [(0, dom_1.html)('span', {
  class: 'figindex'
}), (0, dom_1.html)('span', {
  class: 'figtext'
}, (0, dom_1.defrag)(caption))]), (0, dom_1.html)('div', [content])])])), (0, combinator_1.fmap)((0, combinator_1.fence)(/^(~{3,})(?:figure|\[?\$\S*)(?!\S)[^\n]*(?:$|\n)/, 300), ([body, overflow, closer, opener, delim], _, context) => [(0, dom_1.html)('pre', {
  class: 'invalid',
  translate: 'no',
  'data-invalid-syntax': 'figure',
  ...(!closer && {
    'data-invalid-type': 'fence',
    'data-invalid-message': `Missing the closing delimiter "${delim}"`
  } || overflow && {
    'data-invalid-type': 'fence',
    'data-invalid-message': `Invalid trailing line after the closing delimiter "${delim}"`
  } || !(0, label_1.segment)({
    source: opener.match(/^~+(?:figure[^\S\n]+)?(\[?\$\S+)/)?.[1] ?? '',
    context
  }) && {
    'data-invalid-type': 'label',
    'data-invalid-message': 'Invalid label'
  } || /^~+(?:figure[^\S\n]+)?(\[?\$\S+)[^\S\n]+\S/.test(opener) && {
    'data-invalid-type': 'argument',
    'data-invalid-message': 'Invalid argument'
  } || {
    'data-invalid-type': 'content',
    'data-invalid-message': 'Invalid content'
  })
}, `${opener}${body}${overflow || closer}`)])));

function attributes(label, param, content, caption) {
  const group = label.split('-', 1)[0];
  let type = content.className.split(/\s/)[0];

  switch (type || content.tagName) {
    case 'UL':
    case 'OL':
    case 'checklist':
      type = 'list';
      break;

    case 'TABLE':
      type = 'table';
      break;

    case 'BLOCKQUOTE':
      type = 'quote';
      break;

    case 'A':
      type = 'media';
      break;

    case 'text':
    case 'code':
    case 'math':
    case 'example':
    case 'invalid':
      break;

    default:
  }

  const invalid = param.trimStart() !== '' && {
    'data-invalid-type': 'argument',
    'data-invalid-message': 'Invalid argument'
  } || /^[^-]+-(?:[0-9]+\.)*0$/.test(label) && {
    'data-invalid-type': 'label',
    'data-invalid-message': 'The last part of the fixed label numbers must not be 0'
  } || group === '$' && (type !== 'math' || caption.length > 0) && {
    'data-invalid-type': 'label',
    'data-invalid-message': '"$" label group must be used to math formulas with no caption'
  } || type === 'media' && {} || ['fig', 'figure'].includes(group) && {
    'data-invalid-type': 'label',
    'data-invalid-message': '"fig" and "figure" label groups must be used to media'
  } || group === 'table' && type !== group && {
    'data-invalid-type': 'label',
    'data-invalid-message': '"table" label group must be used to tables'
  } || group === 'list' && type !== group && {
    'data-invalid-type': 'label',
    'data-invalid-message': '"list" label group must be used to lists'
  } || group === 'quote' && type !== group && {
    'data-invalid-type': 'label',
    'data-invalid-message': '"quote" label group must be used to blockquotes'
  } || group === 'text' && type !== group && {
    'data-invalid-type': 'label',
    'data-invalid-message': '"text" label group must be used to codeblocks with no language'
  } || group === 'code' && type !== group && {
    'data-invalid-type': 'label',
    'data-invalid-message': '"code" label group must be used to codeblocks with any language'
  } || group === 'example' && type !== group && {
    'data-invalid-type': 'label',
    'data-invalid-message': '"example" label group must be used to examples'
  } || global_1.undefined;
  return {
    'data-type': type,
    'data-label': label,
    'data-group': group,
    ...(invalid?.['data-invalid-type'] && {
      class: 'invalid',
      'data-invalid-syntax': 'figure',
      ...invalid
    })
  };
}

/***/ }),

/***/ 1467:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.message = void 0;

const parser_1 = __webpack_require__(6728);

const combinator_1 = __webpack_require__(2087);

const segment_1 = __webpack_require__(9002);

const source_1 = __webpack_require__(6743);

const ulist_1 = __webpack_require__(5425);

const olist_1 = __webpack_require__(7471);

const ilist_1 = __webpack_require__(238);

const table_1 = __webpack_require__(8717);

const codeblock_1 = __webpack_require__(1849);

const mathblock_1 = __webpack_require__(3754);

const sidefence_1 = __webpack_require__(4078);

const blockquote_1 = __webpack_require__(7859);

const paragraph_1 = __webpack_require__(6457);

const array_1 = __webpack_require__(8112);

const dom_1 = __webpack_require__(3252);

exports.message = (0, combinator_1.block)((0, combinator_1.validate)('~~~', (0, combinator_1.fmap)((0, combinator_1.fence)(/^(~{3,})message\/(\S+)([^\n]*)(?:$|\n)/, 300), // Bug: Type mismatch between outer and inner.
([body, overflow, closer, opener, delim, type, param], _, context) => {
  if (!closer || overflow || param.trimStart()) return [(0, dom_1.html)('pre', {
    class: 'invalid',
    translate: 'no',
    'data-invalid-syntax': 'message',
    'data-invalid-type': !closer || overflow ? 'fence' : 'argument',
    'data-invalid-message': !closer ? `Missing the closing delimiter "${delim}"` : overflow ? `Invalid trailing line after the closing delimiter "${delim}"` : 'Invalid argument'
  }, `${opener}${body}${overflow || closer}`)];

  switch (type) {
    case 'note':
    case 'caution':
    case 'warning':
      break;

    default:
      return [(0, dom_1.html)('pre', {
        class: 'invalid',
        translate: 'no',
        'data-invalid-syntax': 'message',
        'data-invalid-type': 'type',
        'data-invalid-message': 'Invalid message type'
      }, `${opener}${body}${closer}`)];
  }

  return [(0, dom_1.html)('section', {
    class: `message`,
    'data-type': type
  }, (0, array_1.unshift)([(0, dom_1.html)('h1', title(type))], [...(0, segment_1.segment)(body)].reduce((acc, seg) => (0, array_1.push)(acc, (0, parser_1.eval)(content({
    source: seg,
    context
  }), [])), [])))];
})));

function title(type) {
  switch (type) {
    case 'warning':
      return type.toUpperCase() + '!!';

    case 'caution':
      return type[0].toUpperCase() + type.slice(1) + '!';

    default:
      return type[0].toUpperCase() + type.slice(1);
  }
} // Must not have indexed blocks.


const content = (0, combinator_1.union)([source_1.emptyline, ulist_1.ulist, olist_1.olist, ilist_1.ilist, table_1.table, codeblock_1.codeblock, mathblock_1.mathblock, sidefence_1.sidefence, blockquote_1.blockquote, paragraph_1.paragraph]);

/***/ }),

/***/ 5198:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.placeholder = exports.segment_ = exports.segment = void 0;

const combinator_1 = __webpack_require__(2087);

const dom_1 = __webpack_require__(3252);

const opener = /^(~{3,})(?!~)[^\n]*(?:$|\n)/;
exports.segment = (0, combinator_1.block)((0, combinator_1.validate)('~~~', (0, combinator_1.clear)((0, combinator_1.fence)(opener, 300))));
exports.segment_ = (0, combinator_1.block)((0, combinator_1.validate)('~~~', (0, combinator_1.clear)((0, combinator_1.fence)(opener, 300, false))), false);
exports.placeholder = (0, combinator_1.block)((0, combinator_1.validate)('~~~', (0, combinator_1.fmap)((0, combinator_1.fence)(opener, Infinity), ([body, overflow, closer, opener, delim]) => [(0, dom_1.html)('pre', {
  class: 'invalid',
  translate: 'no',
  'data-invalid-message': !closer ? `Missing the closing delimiter "${delim}"` : overflow ? `Invalid trailing line after the closing delimiter "${delim}"` : 'Invalid argument'
}, `${opener}${body}${overflow || closer}`)])));

/***/ }),

/***/ 4511:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.table = exports.segment_ = exports.segment = void 0;

const global_1 = __webpack_require__(4128);

const alias_1 = __webpack_require__(5406);

const parser_1 = __webpack_require__(6728);

const combinator_1 = __webpack_require__(2087);

const inline_1 = __webpack_require__(1160);

const source_1 = __webpack_require__(6743);

const locale_1 = __webpack_require__(5485);

const visibility_1 = __webpack_require__(7618);

const array_1 = __webpack_require__(8112);

const dom_1 = __webpack_require__(3252);

const opener = /^(~{3,})table(?:\/(\S+))?(?!\S)([^\n]*)(?:$|\n)/;
exports.segment = (0, combinator_1.block)((0, combinator_1.validate)('~~~', (0, combinator_1.clear)((0, combinator_1.fence)(opener, 10000))));
exports.segment_ = (0, combinator_1.block)((0, combinator_1.validate)('~~~', (0, combinator_1.clear)((0, combinator_1.fence)(opener, 10000, false))), false);
exports.table = (0, combinator_1.block)((0, combinator_1.validate)('~~~', (0, combinator_1.fmap)((0, combinator_1.fence)(opener, 10000), // Bug: Type mismatch between outer and inner.
([body, overflow, closer, opener, delim, type, param], _, context) => {
  if (!closer || overflow || param.trimStart()) return [(0, dom_1.html)('pre', {
    class: 'invalid',
    translate: 'no',
    'data-invalid-syntax': 'table',
    'data-invalid-type': !closer || overflow ? 'fence' : 'argument',
    'data-invalid-message': !closer ? `Missing the closing delimiter "${delim}"` : overflow ? `Invalid trailing line after the closing delimiter "${delim}"` : 'Invalid argument'
  }, `${opener}${body}${overflow || closer}`)];

  switch (type) {
    case 'grid':
    case global_1.undefined:
      return ((0, parser_1.eval)(parser({
        source: body,
        context
      })) ?? [(0, dom_1.html)('table')]).map(el => (0, dom_1.define)(el, {
        'data-type': type
      }));

    default:
      return [(0, dom_1.html)('pre', {
        class: 'invalid',
        translate: 'no',
        'data-invalid-syntax': 'table',
        'data-invalid-type': 'argument',
        'data-invalid-message': 'Invalid table type'
      }, `${opener}${body}${closer}`)];
  }
})));
const parser = (0, combinator_1.lazy)(() => (0, combinator_1.block)((0, locale_1.localize)((0, combinator_1.fmap)((0, combinator_1.some)((0, combinator_1.union)([row])), rows => [(0, dom_1.html)('table', format(rows))]))));
const row = (0, combinator_1.lazy)(() => (0, combinator_1.dup)((0, combinator_1.fmap)((0, combinator_1.subsequence)([(0, combinator_1.dup)((0, combinator_1.union)([align])), (0, combinator_1.some)((0, combinator_1.union)([head, data, (0, combinator_1.some)(dataline, alignment), source_1.emptyline]))]), ns => !(0, alias_1.isArray)(ns[0]) ? (0, array_1.unshift)([[[]]], ns) : ns)));
const alignment = /^[-=<>]+(?:\/[-=^v]*)?(?=[^\S\n]*\n)/;
const align = (0, combinator_1.line)((0, combinator_1.fmap)((0, combinator_1.union)([(0, source_1.str)(alignment)]), ([s]) => s.split('/').map(s => s.split(''))));
const delimiter = /^[-=<>]+(?:\/[-=^v]*)?(?=[^\S\n]*\n)|^[#:](?:(?!:\D|0)\d*:(?!0)\d*)?!*(?=\s)/;
const head = (0, combinator_1.creation)(1, false, (0, combinator_1.block)((0, combinator_1.fmap)((0, combinator_1.open)((0, source_1.str)(/^#(?:(?!:\D|0)\d*:(?!0)\d*)?!*(?=\s)/), (0, combinator_1.rewrite)((0, combinator_1.inits)([source_1.anyline, (0, combinator_1.some)(source_1.contentline, delimiter)]), (0, combinator_1.trim)((0, visibility_1.visualize)((0, combinator_1.some)((0, combinator_1.union)([inline_1.inline]))))), true), ns => [(0, dom_1.html)('th', attributes(ns.shift()), (0, dom_1.defrag)(ns))]), false));
const data = (0, combinator_1.creation)(1, false, (0, combinator_1.block)((0, combinator_1.fmap)((0, combinator_1.open)((0, source_1.str)(/^:(?:(?!:\D|0)\d*:(?!0)\d*)?!*(?=\s)/), (0, combinator_1.rewrite)((0, combinator_1.inits)([source_1.anyline, (0, combinator_1.some)(source_1.contentline, delimiter)]), (0, combinator_1.trim)((0, visibility_1.visualize)((0, combinator_1.some)((0, combinator_1.union)([inline_1.inline]))))), true), ns => [(0, dom_1.html)('td', attributes(ns.shift()), (0, dom_1.defrag)(ns))]), false));
const dataline = (0, combinator_1.creation)(1, false, (0, combinator_1.line)((0, combinator_1.rewrite)(source_1.contentline, (0, combinator_1.union)([(0, combinator_1.validate)(/^!+\s/, (0, combinator_1.convert)(source => `:${source}`, data)), (0, combinator_1.convert)(source => `: ${source}`, data)]))));

function attributes(source) {
  let [, rowspan = global_1.undefined, colspan = global_1.undefined, highlight = global_1.undefined] = source.match(/^.(?:(\d+)?:(\d+)?)?(!+)?$/) ?? [];
  rowspan === '1' ? rowspan = global_1.undefined : global_1.undefined;
  colspan === '1' ? colspan = global_1.undefined : global_1.undefined;
  rowspan &&= `${(0, alias_1.max)(0, (0, alias_1.min)(+rowspan, 65534))}`;
  colspan &&= `${(0, alias_1.max)(0, (0, alias_1.min)(+colspan, 1000))}`;
  highlight &&= highlight.length > 0 ? `${highlight.length}` : global_1.undefined;
  const valid = !highlight || source[0] === '#' && +highlight <= 1 || source[0] === ':' && +highlight <= 6;
  return {
    class: valid ? highlight && 'highlight' : 'invalid',
    rowspan,
    colspan,
    ...(valid ? {
      'data-highlight-level': +highlight > 1 ? highlight : global_1.undefined
    } : {
      'data-invalid-syntax': 'table',
      'data-invalid-type': 'syntax',
      'data-invalid-message': 'Too much highlight level'
    })
  };
}

function format(rows) {
  const thead = (0, dom_1.html)('thead');
  const tbody = (0, dom_1.html)('tbody');
  const tfoot = (0, dom_1.html)('tfoot');
  const aligns = [];
  const valigns = [];
  let target = thead;
  let ranges = {};
  let verticalHighlights = 0n;

  ROW: for (let i = 0; i < rows.length; ++i) {
    // Copy to make them retryable.
    const [[[...as], [...vs] = []], ...cells] = rows[i];
    let isBody = target === tfoot ? false : global_1.undefined;
    as.length === 0 && as.push('-');

    ALIGN_H: for (let j = 0, update = false; j < as.length || j < aligns.length; ++j) {
      switch (as[j]) {
        case '=':
          update = true;
          aligns[j] = 'center';
          continue;

        case '<':
          update = true;
          aligns[j] = 'start';
          continue;

        case '>':
          update = true;
          aligns[j] = 'end';
          continue;

        case '-':
          update = false;
          aligns[j] ??= j === 0 ? '' : aligns[j - 1];
          continue;

        default:
          if (!update) break ALIGN_H;
          aligns[j] = aligns[j - 1];
          continue;
      }
    }

    vs.length === 0 && vs.push('-');

    ALIGN_V: for (let j = 0, update = false; j < vs.length || j < valigns.length; ++j) {
      switch (vs[j]) {
        case '=':
          update = true;
          valigns[j] = 'middle';
          continue;

        case '^':
          update = true;
          valigns[j] = 'top';
          continue;

        case 'v':
          update = true;
          valigns[j] = 'bottom';
          continue;

        case '-':
          update = false;
          valigns[j] ??= j === 0 ? '' : valigns[j - 1];
          continue;

        default:
          if (!update) break ALIGN_V;
          aligns[j] = aligns[j - 1];
          continue;
      }
    }

    const row = (0, dom_1.html)('tr');
    let heads = 0n;
    let highlights = 0n;
    let hasDataCell = false;
    let lHeadCellIdx;
    let rHeadCellIdx;

    for (let j = 0; j < cells.length; ++j) {
      const jn = (0, global_1.BigInt)(j);
      const isVirtual = !!ranges[i]?.[j];
      const cell = isVirtual ? (0, array_1.splice)(cells, j, 0, global_1.undefined) && ranges[i][j] : cells[j];
      const isHeadCell = cell.tagName === 'TH';
      heads |= (0, global_1.BigInt)(isHeadCell) << jn;
      highlights |= (0, global_1.BigInt)(cell.className === 'highlight') << jn;
      hasDataCell ||= !isHeadCell;

      if (isHeadCell && !hasDataCell) {
        lHeadCellIdx = jn;
      }

      if (isHeadCell && hasDataCell) {
        rHeadCellIdx ??= jn;
      }

      const rowSpan = cell.rowSpan;

      if (rowSpan > 1 && !isVirtual) {
        const virtual = cell.cloneNode();

        for (let k = i + 1; k < i + rowSpan && k < rows.length; ++k) {
          ranges[k] ??= [];
          ranges[k][j] = virtual;
        }
      }

      const colSpan = cell.colSpan;

      if (colSpan > 1) {
        (0, array_1.splice)(cells, j + 1, 0, ...(0, global_1.Array)(colSpan - 1));
        heads |= heads & 1n << jn && ~(~0n << (0, global_1.BigInt)(colSpan)) << jn;
        highlights |= highlights & 1n << jn && ~(~0n << (0, global_1.BigInt)(colSpan)) << jn;
        j += colSpan - 1;
      }

      if (target === thead) {
        if (!isHeadCell && isBody !== false || isBody) {
          isBody = true;
          target = tbody;
          ranges = {};
          --i;
          continue ROW;
        }
      }

      if (target === tbody) {
        if (!isHeadCell && isBody !== false) {
          isBody = true;
        }

        if (j + 1 === cells.length && isBody !== true) {
          isBody = false;
          target = tfoot;
          ranges = {};
          --i;
          continue ROW;
        }
      }

      if (target === tfoot) {}

      j === aligns.length && aligns.push(aligns[j - 1]);
      j === valigns.length && valigns.push(valigns[j - 1]);
      if (isVirtual) continue;
      row.appendChild(cell);
      aligns[j] && cell.setAttribute('align', aligns[j]);
      valigns[j] && cell.setAttribute('valign', valigns[j]);
    }

    target.appendChild(row);

    switch (target) {
      case thead:
        verticalHighlights = heads & highlights;
        continue;

      case tbody:
        lHeadCellIdx ??= -1n;
        rHeadCellIdx ??= -1n;
        const tHighlights = verticalHighlights;
        const horizontalHighlights = heads & highlights;
        const lHighlight = ~lHeadCellIdx && horizontalHighlights & 1n << lHeadCellIdx;
        const rHighlight = ~rHeadCellIdx && horizontalHighlights & 1n << rHeadCellIdx;

        for (let i = 0, m = 1n; i < cells.length; ++i, m <<= 1n) {
          const cell = cells[i];
          if (!cell) continue;
          if (heads & m) continue;
          if (!(lHighlight || rHighlight || tHighlights & m || highlights & m)) continue;
          cell.classList.add('highlight');
        }

        continue;

      case tfoot:
        continue;
    }
  }

  return [thead, tbody, tfoot];
}

/***/ }),

/***/ 4623:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.heading = exports.segment = void 0;

const combinator_1 = __webpack_require__(2087);

const inline_1 = __webpack_require__(1160);

const source_1 = __webpack_require__(6743);

const visibility_1 = __webpack_require__(7618);

const dom_1 = __webpack_require__(3252);

exports.segment = (0, combinator_1.block)((0, combinator_1.validate)('#', (0, combinator_1.focus)(/^#+[^\S\n]+\S[^\n]*(?:\n#+(?!\S)[^\n]*)*(?:$|\n)/, (0, combinator_1.some)((0, combinator_1.line)(({
  source
}) => [[source], ''])))));
exports.heading = (0, combinator_1.block)((0, combinator_1.rewrite)(exports.segment, (0, combinator_1.state)(128
/* State.annotation */
| 64
/* State.reference */
| 32
/* State.index */
| 16
/* State.label */
| 8
/* State.link */
| 4
/* State.media */
, (0, combinator_1.line)((0, inline_1.indexee)((0, combinator_1.fmap)((0, combinator_1.union)([(0, combinator_1.open)((0, source_1.str)(/^##+/), (0, visibility_1.visualize)((0, visibility_1.trimBlank)((0, combinator_1.some)((0, combinator_1.union)([inline_1.indexer, inline_1.inline])))), true), (0, combinator_1.open)((0, source_1.str)('#'), (0, combinator_1.state)(2
/* State.autolink */
, (0, visibility_1.visualize)((0, visibility_1.trimBlank)((0, combinator_1.some)((0, combinator_1.union)([inline_1.indexer, inline_1.inline]))))), true)]), ([h, ...ns]) => [h.length <= 6 ? (0, dom_1.html)(`h${h.length}`, (0, dom_1.defrag)(ns)) : (0, dom_1.html)(`h6`, {
  class: 'invalid',
  'data-invalid-syntax': 'heading',
  'data-invalid-type': 'syntax',
  'data-invalid-message': 'Heading level must be up to 6'
}, (0, dom_1.defrag)(ns))]))))));

/***/ }),

/***/ 9967:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.horizontalrule = void 0;

const combinator_1 = __webpack_require__(2087);

const dom_1 = __webpack_require__(3252);

exports.horizontalrule = (0, combinator_1.block)((0, combinator_1.line)((0, combinator_1.focus)(/^-{3,}[^\S\n]*(?:$|\n)/, () => [[(0, dom_1.html)('hr')], ''])));

/***/ }),

/***/ 238:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.ilist_ = exports.ilist = void 0;

const combinator_1 = __webpack_require__(2087);

const ulist_1 = __webpack_require__(5425);

const olist_1 = __webpack_require__(7471);

const inline_1 = __webpack_require__(1160);

const dom_1 = __webpack_require__(3252);

exports.ilist = (0, combinator_1.lazy)(() => (0, combinator_1.block)((0, combinator_1.validate)(/^[-+*](?=[^\S\n]|\n[^\S\n]*\S)/, (0, combinator_1.state)(4
/* State.media */
, exports.ilist_))));
exports.ilist_ = (0, combinator_1.lazy)(() => (0, combinator_1.block)((0, combinator_1.fmap)((0, combinator_1.validate)(/^[-+*](?:$|\s)/, (0, combinator_1.some)((0, combinator_1.creation)(1, false, (0, combinator_1.union)([(0, combinator_1.fmap)((0, combinator_1.fallback)((0, combinator_1.inits)([(0, combinator_1.line)((0, combinator_1.open)(/^[-+*](?:$|\s)/, (0, combinator_1.some)(inline_1.inline), true)), (0, combinator_1.indent)((0, combinator_1.union)([ulist_1.ulist_, olist_1.olist_, exports.ilist_]))]), olist_1.invalid), ns => [(0, dom_1.html)('li', (0, dom_1.defrag)((0, ulist_1.fillFirstLine)(ns)))])])))), es => [(0, dom_1.html)('ul', {
  class: 'invalid',
  'data-invalid-syntax': 'list',
  'data-invalid-type': 'syntax',
  'data-invalid-message': 'Use "-" instead of "+" or "*"'
}, es)])));

/***/ }),

/***/ 3754:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.mathblock = exports.segment_ = exports.segment = void 0;

const global_1 = __webpack_require__(4128);

const combinator_1 = __webpack_require__(2087);

const dom_1 = __webpack_require__(3252);

const opener = /^(\${2,})(?!\$)([^\n]*)(?:$|\n)/;
exports.segment = (0, combinator_1.block)((0, combinator_1.validate)('$$', (0, combinator_1.clear)((0, combinator_1.fence)(opener, 300))));
exports.segment_ = (0, combinator_1.block)((0, combinator_1.validate)('$$', (0, combinator_1.clear)((0, combinator_1.fence)(opener, 300, false))), false);
exports.mathblock = (0, combinator_1.block)((0, combinator_1.validate)('$$', (0, combinator_1.fmap)((0, combinator_1.fence)(opener, 300), // Bug: Type mismatch between outer and inner.
([body, overflow, closer, opener, delim, param], _, {
  caches: {
    math: cache = global_1.undefined
  } = {}
}) => [delim.length === 2 && closer && !overflow && param.trimStart() === '' ? cache?.get(`${delim}\n${body}${delim}`)?.cloneNode(true) || (0, dom_1.html)('div', {
  class: 'math',
  translate: 'no'
}, `${delim}\n${body}${delim}`) : (0, dom_1.html)('pre', {
  class: 'invalid',
  translate: 'no',
  'data-invalid-syntax': 'mathblock',
  'data-invalid-type': delim.length > 2 ? 'syntax' : !closer || overflow ? 'fence' : 'argument',
  'data-invalid-message': delim.length > 2 ? 'Invalid syntax' : !closer ? `Missing the closing delimiter "${delim}"` : overflow ? `Invalid trailing line after the closing delimiter "${delim}"` : 'Invalid argument'
}, `${opener}${body}${overflow || closer}`)])));

/***/ }),

/***/ 7471:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.invalid = exports.olist_ = exports.olist = void 0;

const global_1 = __webpack_require__(4128);

const combinator_1 = __webpack_require__(2087);

const ulist_1 = __webpack_require__(5425);

const ilist_1 = __webpack_require__(238);

const inline_1 = __webpack_require__(1160);

const source_1 = __webpack_require__(6743);

const visibility_1 = __webpack_require__(7618);

const memoize_1 = __webpack_require__(1808);

const array_1 = __webpack_require__(8112);

const dom_1 = __webpack_require__(3252);

const openers = {
  '.': /^([0-9]+|[a-z]+|[A-Z]+)(?:-(?!-)[0-9]*)*(?![^\S\n])\.?(?:$|\s)/,
  '(': /^\(([0-9]*|[a-z]*)(?![^)\n])\)?(?:-(?!-)[0-9]*)*(?:$|\s)/
};
exports.olist = (0, combinator_1.lazy)(() => (0, combinator_1.block)((0, combinator_1.validate)(new RegExp([/^([0-9]+|[a-z]+|[A-Z]+)(?:-[0-9]+)*\.(?=[^\S\n]|\n[^\S\n]*\S)/.source, /^\(([0-9]+|[a-z]+)\)(?:-[0-9]+)*(?=[^\S\n]|\n[^\S\n]*\S)/.source].join('|')), (0, combinator_1.state)(4
/* State.media */
, exports.olist_))));
exports.olist_ = (0, combinator_1.lazy)(() => (0, combinator_1.block)((0, combinator_1.union)([(0, combinator_1.match)(openers['.'], (0, memoize_1.memoize)(ms => list(type(ms[1]), '.'), ms => type(ms[1]).charCodeAt(0) || 0, [])), (0, combinator_1.match)(openers['('], (0, memoize_1.memoize)(ms => list(type(ms[1]), '('), ms => type(ms[1]).charCodeAt(0) || 0, []))])));

const list = (type, form) => (0, combinator_1.fmap)((0, combinator_1.some)((0, combinator_1.creation)(1, false, (0, combinator_1.union)([(0, inline_1.indexee)((0, combinator_1.fmap)((0, combinator_1.fallback)((0, combinator_1.inits)([(0, combinator_1.line)((0, combinator_1.open)(heads[form], (0, combinator_1.subsequence)([ulist_1.checkbox, (0, visibility_1.trimBlank)((0, combinator_1.some)((0, combinator_1.union)([inline_1.indexer, inline_1.inline])))]), true)), (0, combinator_1.indent)((0, combinator_1.union)([ulist_1.ulist_, exports.olist_, ilist_1.ilist_]))]), exports.invalid), ns => [(0, dom_1.html)('li', {
  'data-marker': ns[0] || global_1.undefined
}, (0, dom_1.defrag)((0, ulist_1.fillFirstLine)((0, array_1.shift)(ns)[1])))]), true)]))), es => [format((0, dom_1.html)('ol', es), type, form)]);

const heads = {
  '.': (0, combinator_1.focus)(openers['.'], ({
    source
  }) => [[source.trimEnd().split('.', 1)[0] + '.'], '']),
  '(': (0, combinator_1.focus)(openers['('], ({
    source
  }) => [[source.trimEnd().replace(/^\($/, '(1)').replace(/^\((\w+)$/, '($1)')], ''])
};
exports.invalid = (0, combinator_1.rewrite)((0, combinator_1.inits)([source_1.contentline, (0, combinator_1.indent)(({
  source
}) => [[source], ''])]), ({
  source
}) => [['', (0, dom_1.html)('span', {
  class: 'invalid',
  'data-invalid-syntax': 'listitem',
  'data-invalid-type': 'syntax',
  'data-invalid-message': 'Fix the indent or the head of the list item'
}, source.replace('\n', ''))], '']);

function type(index) {
  switch (index) {
    case 'i':
      return 'i';

    case 'a':
      return 'a';

    case 'I':
      return 'I';

    case 'A':
      return 'A';

    default:
      return '';
  }
}

function style(type) {
  switch (type) {
    case 'i':
      return 'lower-roman';

    case 'a':
      return 'lower-alpha';

    case 'I':
      return 'upper-roman';

    case 'A':
      return 'upper-alpha';

    default:
      return '';
  }
}

function initial(type) {
  switch (type) {
    case 'i':
      return /^\(?i[).]?$/;

    case 'a':
      return /^\(?a[).]?$/;

    case 'I':
      return /^\(?I[).]?$/;

    case 'A':
      return /^\(?A[).]?$/;

    default:
      return /^\(?[01][).]?$/;
  }
}

function format(el, type, form) {
  if (el.firstElementChild?.firstElementChild?.className === 'checkbox') {
    el.setAttribute('class', 'checklist');
  }

  (0, dom_1.define)(el, {
    type: type || global_1.undefined,
    'data-format': form === '.' ? global_1.undefined : 'paren',
    'data-type': style(type) || global_1.undefined
  });
  const marker = el.firstElementChild?.getAttribute('data-marker').match(initial(type))?.[0] ?? '';

  for (let es = el.children, len = es.length, i = 0; i < len; ++i) {
    const el = es[i];

    switch (el.getAttribute('data-marker')) {
      case '':
      case marker:
        el.removeAttribute('data-marker');
        continue;
    }

    break;
  }

  return el;
}

/***/ }),

/***/ 6457:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.paragraph = void 0;

const combinator_1 = __webpack_require__(2087);

const inline_1 = __webpack_require__(1160);

const locale_1 = __webpack_require__(5485);

const visibility_1 = __webpack_require__(7618);

const dom_1 = __webpack_require__(3252);

exports.paragraph = (0, combinator_1.block)((0, locale_1.localize)((0, combinator_1.fmap)((0, visibility_1.visualize)((0, combinator_1.trimEnd)((0, combinator_1.some)((0, combinator_1.union)([inline_1.inline])))), ns => [(0, dom_1.html)('p', (0, dom_1.defrag)(ns))])));

/***/ }),

/***/ 9978:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.reply = void 0;

const combinator_1 = __webpack_require__(2087);

const cite_1 = __webpack_require__(6315);

const quote_1 = __webpack_require__(6058);

const inline_1 = __webpack_require__(1160);

const source_1 = __webpack_require__(6743);

const locale_1 = __webpack_require__(5485);

const visibility_1 = __webpack_require__(7618);

const array_1 = __webpack_require__(8112);

const dom_1 = __webpack_require__(3252);
/*
必ず対象指定から始まる
対象がページである場合>>.を表現方法とする
対象をURLで指定すべき(引用ツリーにルートを追加する)場合はない
対象と引用は1:N(分割)、N:1(統合)のみ可能、N:N(混合)は不可能
*/


exports.reply = (0, combinator_1.block)((0, combinator_1.validate)('>', (0, locale_1.localize)((0, combinator_1.fmap)((0, combinator_1.inits)([(0, combinator_1.some)((0, combinator_1.inits)([cite_1.cite, quote_1.quote])), (0, combinator_1.some)((0, combinator_1.subsequence)([(0, combinator_1.some)(quote_1.quote), (0, combinator_1.fmap)((0, combinator_1.rewrite)((0, combinator_1.some)(source_1.anyline, quote_1.syntax), (0, visibility_1.visualize)((0, combinator_1.trimEnd)((0, combinator_1.some)(inline_1.inline)))), ns => (0, array_1.push)(ns, [(0, dom_1.html)('br')]))]))]), ns => [(0, dom_1.html)('p', (0, dom_1.defrag)((0, array_1.pop)(ns)[0]))]))));

/***/ }),

/***/ 6315:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.cite = void 0;

const combinator_1 = __webpack_require__(2087);

const anchor_1 = __webpack_require__(6495);

const source_1 = __webpack_require__(6743);

const dom_1 = __webpack_require__(3252);

exports.cite = (0, combinator_1.creation)(1, false, (0, combinator_1.line)((0, combinator_1.fmap)((0, combinator_1.validate)('>>', (0, combinator_1.reverse)((0, combinator_1.tails)([(0, source_1.str)(/^>*(?=>>[^>\s]+\s*$)/), (0, combinator_1.union)([anchor_1.anchor, // Subject page representation.
// リンクの実装は後で検討
(0, combinator_1.focus)(/^>>\.(?=\s*$)/, () => [[(0, dom_1.html)('a', {
  class: 'anchor'
}, '>>.')], '']), (0, combinator_1.focus)(/^>>#\S*(?=\s*$)/, ({
  source
}) => [[(0, dom_1.html)('a', {
  class: 'anchor'
}, source)], '']), // Support all domains, but don't support IP(v6) addresses.
(0, combinator_1.focus)(/^>>https?:\/\/[^\p{C}\p{S}\p{P}\s]\S*(?=\s*$)/u, ({
  source
}) => [[(0, dom_1.html)('a', {
  class: 'anchor',
  href: source.slice(2).trimEnd(),
  target: '_blank'
}, source)], ''])])]))), ([el, quotes = '']) => [(0, dom_1.html)('span', {
  class: 'cite'
}, (0, dom_1.defrag)([`${quotes}>`, (0, dom_1.define)(el, {
  'data-depth': `${quotes.length + 1}`
}, el.innerText.slice(1))])), (0, dom_1.html)('br')])));

/***/ }),

/***/ 6058:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.quote = exports.syntax = void 0;

const parser_1 = __webpack_require__(6728);

const combinator_1 = __webpack_require__(2087);

const math_1 = __webpack_require__(8946);

const source_1 = __webpack_require__(6743);

const autolink_1 = __webpack_require__(6578);

const dom_1 = __webpack_require__(3252);

exports.syntax = /^>+(?=[^\S\n])|^>(?=[^\s>])|^>+(?=[^\s>])(?![0-9a-z]+(?:-[0-9a-z]+)*(?![0-9A-Za-z@#:]))/;
exports.quote = (0, combinator_1.lazy)(() => (0, combinator_1.creation)(1, false, (0, combinator_1.block)((0, combinator_1.fmap)((0, combinator_1.validate)('>', (0, combinator_1.union)([(0, combinator_1.rewrite)((0, combinator_1.some)((0, combinator_1.validate)(new RegExp(exports.syntax.source.split('|')[0]), source_1.anyline)), qblock), (0, combinator_1.rewrite)((0, combinator_1.validate)(new RegExp(exports.syntax.source.split('|').slice(1).join('|')), source_1.anyline), (0, combinator_1.line)((0, combinator_1.union)([(0, source_1.str)(/^.+/)])))])), ns => [(0, dom_1.html)('span', ns.length > 1 ? {
  class: 'quote'
} : {
  class: 'quote invalid',
  'data-invalid-syntax': 'quote',
  'data-invalid-type': 'syntax',
  'data-invalid-message': `Missing the whitespace after "${ns[0].split(/[^>]/, 1)[0]}"`
}, (0, dom_1.defrag)(ns)), (0, dom_1.html)('br')]), false)));

const qblock = ({
  source,
  context
}) => {
  source = source.replace(/\n$/, '');
  const lines = source.match(/^.*\n?/mg);
  const quotes = source.match(/^>+[^\S\n]/mg);
  const content = lines.reduce((acc, line, row) => acc + line.slice(quotes[row].length), '');
  const nodes = (0, parser_1.eval)((0, combinator_1.some)(text)({
    source: content,
    context
  }), []);
  nodes.unshift(quotes.shift());

  for (let i = 0; i < nodes.length; ++i) {
    const child = nodes[i];
    if (typeof child === 'string') continue;

    if ('wholeText' in child) {
      nodes[i] = child.data;
      continue;
    }

    if (child.tagName === 'BR') {
      nodes.splice(i + 1, 0, quotes.shift());
      ++i;
      continue;
    }

    if (child.className === 'cite' || child.classList.contains('quote')) {
      context.resources && (context.resources.clock -= child.childNodes.length);
      nodes.splice(i, 1, ...child.childNodes);
      --i;
      continue;
    }
  }

  nodes.unshift('');
  return [nodes, ''];
};

const text = (0, combinator_1.union)([math_1.math, autolink_1.autolink]);

/***/ }),

/***/ 4078:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.sidefence = void 0;

const combinator_1 = __webpack_require__(2087);

const autolink_1 = __webpack_require__(6578);

const source_1 = __webpack_require__(6743);

const dom_1 = __webpack_require__(3252);

exports.sidefence = (0, combinator_1.lazy)(() => (0, combinator_1.block)((0, combinator_1.fmap)((0, combinator_1.focus)(/^(?=\|+(?:[^\S\n]|\n\|))(?:\|+(?:[^\S\n][^\n]*)?(?:$|\n))+$/, (0, combinator_1.union)([source])), ([el]) => [(0, dom_1.define)(el, {
  class: 'invalid',
  'data-invalid-syntax': 'sidefence',
  'data-invalid-type': 'syntax',
  'data-invalid-message': 'Reserved syntax'
})])));
const opener = /^(?=\|\|+(?:$|\s))/;

const unindent = source => source.replace(/(^|\n)\|(?:[^\S\n]|(?=\|*(?:$|\s)))|\n$/g, '$1');

const source = (0, combinator_1.lazy)(() => (0, combinator_1.fmap)((0, combinator_1.some)((0, combinator_1.creation)(1, false, (0, combinator_1.union)([(0, combinator_1.focus)(/^(?:\|\|+(?:[^\S\n][^\n]*)?(?:$|\n))+/, (0, combinator_1.convert)(unindent, source)), (0, combinator_1.rewrite)((0, combinator_1.some)(source_1.contentline, opener), (0, combinator_1.convert)(unindent, (0, combinator_1.fmap)((0, combinator_1.some)(autolink_1.autolink), ns => [(0, dom_1.html)('pre', (0, dom_1.defrag)(ns))])))]))), ns => [(0, dom_1.html)('blockquote', ns)]));

/***/ }),

/***/ 8717:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.table = void 0;

const combinator_1 = __webpack_require__(2087);

const inline_1 = __webpack_require__(1160);

const source_1 = __webpack_require__(6743);

const visibility_1 = __webpack_require__(7618);

const duff_1 = __webpack_require__(8099);

const array_1 = __webpack_require__(8112);

const dom_1 = __webpack_require__(3252);

exports.table = (0, combinator_1.lazy)(() => (0, combinator_1.block)((0, combinator_1.fmap)((0, combinator_1.validate)(/^\|[^\n]*(?:\n\|[^\n]*){2}/, (0, combinator_1.sequence)([row((0, combinator_1.some)(head), true), row((0, combinator_1.some)(align), false), (0, combinator_1.some)(row((0, combinator_1.some)(data), true))])), rows => [(0, dom_1.html)('table', [(0, dom_1.html)('thead', [rows.shift()]), (0, dom_1.html)('tbody', format(rows))])])));

const row = (parser, optional) => (0, combinator_1.creation)(1, false, (0, combinator_1.fallback)((0, combinator_1.fmap)((0, combinator_1.line)((0, combinator_1.surround)(/^(?=\|)/, (0, combinator_1.some)((0, combinator_1.union)([parser])), /^[|\\]?\s*$/, optional)), es => [(0, dom_1.html)('tr', es)]), (0, combinator_1.rewrite)(source_1.contentline, ({
  source
}) => [[(0, dom_1.html)('tr', {
  class: 'invalid',
  'data-invalid-syntax': 'table-row',
  'data-invalid-type': 'syntax',
  'data-invalid-message': 'Missing the start symbol of the table row'
}, [(0, dom_1.html)('td', source.replace('\n', ''))])], ''])));

const align = (0, combinator_1.creation)(1, false, (0, combinator_1.fmap)((0, combinator_1.open)('|', (0, combinator_1.union)([(0, combinator_1.focus)(/^:-+:/, () => [['center'], '']), (0, combinator_1.focus)(/^:-+/, () => [['start'], '']), (0, combinator_1.focus)(/^-+:/, () => [['end'], '']), (0, combinator_1.focus)(/^-+/, () => [[''], ''])])), ns => [(0, dom_1.html)('td', (0, dom_1.defrag)(ns))]));
const cell = (0, combinator_1.surround)(/^\|\s*(?=\S)/, (0, combinator_1.some)((0, combinator_1.union)([inline_1.inline]), /^\|/, [[/^[|\\]?\s*$/, 9]]), /^[^|]*/, true);
const head = (0, combinator_1.creation)(1, false, (0, combinator_1.fmap)(cell, ns => [(0, dom_1.html)('th', (0, visibility_1.trimNode)((0, dom_1.defrag)(ns)))]));
const data = (0, combinator_1.creation)(1, false, (0, combinator_1.fmap)(cell, ns => [(0, dom_1.html)('td', (0, visibility_1.trimNode)((0, dom_1.defrag)(ns)))]));

function format(rows) {
  const aligns = rows[0].className === 'invalid' ? [] : (0, duff_1.duffReduce)(rows.shift().children, (acc, el) => (0, array_1.push)(acc, [el.textContent]), []);

  for (let i = 0; i < rows.length; ++i) {
    for (let cols = rows[i].children, len = cols.length, j = 0; j < len; ++j) {
      if (j > 0 && !aligns[j]) {
        aligns[j] = aligns[j - 1];
      }

      if (!aligns[j]) continue;
      cols[j].setAttribute('align', aligns[j]);
    }
  }

  return rows;
}

/***/ }),

/***/ 5425:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.fillFirstLine = exports.checkbox = exports.ulist_ = exports.ulist = void 0;

const combinator_1 = __webpack_require__(2087);

const olist_1 = __webpack_require__(7471);

const ilist_1 = __webpack_require__(238);

const inline_1 = __webpack_require__(1160);

const visibility_1 = __webpack_require__(7618);

const array_1 = __webpack_require__(8112);

const dom_1 = __webpack_require__(3252);

exports.ulist = (0, combinator_1.lazy)(() => (0, combinator_1.block)((0, combinator_1.validate)(/^-(?=[^\S\n]|\n[^\S\n]*\S)/, (0, combinator_1.state)(4
/* State.media */
, exports.ulist_))));
exports.ulist_ = (0, combinator_1.lazy)(() => (0, combinator_1.block)((0, combinator_1.fmap)((0, combinator_1.validate)(/^-(?=$|\s)/, (0, combinator_1.some)((0, combinator_1.creation)(1, false, (0, combinator_1.union)([(0, inline_1.indexee)((0, combinator_1.fmap)((0, combinator_1.fallback)((0, combinator_1.inits)([(0, combinator_1.line)((0, combinator_1.open)(/^-(?:$|\s)/, (0, combinator_1.subsequence)([exports.checkbox, (0, visibility_1.trimBlank)((0, combinator_1.some)((0, combinator_1.union)([inline_1.indexer, inline_1.inline])))]), true)), (0, combinator_1.indent)((0, combinator_1.union)([exports.ulist_, olist_1.olist_, ilist_1.ilist_]))]), olist_1.invalid), ns => [(0, dom_1.html)('li', (0, dom_1.defrag)(fillFirstLine(ns)))]), true)])))), es => [format((0, dom_1.html)('ul', es))])));
exports.checkbox = (0, combinator_1.creation)(1, false, (0, combinator_1.focus)(/^\[[xX ]\](?=$|\s)/, ({
  source
}) => [[(0, dom_1.html)('span', {
  class: 'checkbox'
}, source[1].trimStart() ? '☑' : '☐')], '']));

function fillFirstLine(ns) {
  return ns.length === 1 && typeof ns[0] === 'object' && ['UL', 'OL'].includes(ns[0].tagName) ? (0, array_1.unshift)([(0, dom_1.html)('br')], ns) : ns;
}

exports.fillFirstLine = fillFirstLine;

function format(el) {
  if (el.firstElementChild?.firstElementChild?.className === 'checkbox') {
    el.setAttribute('class', 'checklist');
  }

  return el;
}

/***/ }),

/***/ 5702:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.header = void 0;

const combinator_1 = __webpack_require__(2087);

const segment_1 = __webpack_require__(9002);

const source_1 = __webpack_require__(6743);

const normalize_1 = __webpack_require__(185);

const dom_1 = __webpack_require__(3252);

exports.header = (0, combinator_1.lazy)(() => (0, combinator_1.validate)(/^---+[^\S\v\f\r\n]*\r?\n[^\S\n]*(?=\S)/, (0, combinator_1.inits)([(0, combinator_1.rewrite)(({
  source,
  context
}) => [[], context.header ?? true ? source.slice((0, segment_1.segment)(source).next().value.length) : ''], (0, combinator_1.block)((0, combinator_1.union)([(0, combinator_1.guard)(context => context.header ?? true, (0, combinator_1.focus)(/^---[^\S\v\f\r\n]*\r?\n(?:[A-Za-z][0-9A-Za-z]*(?:-[A-Za-z][0-9A-Za-z]*)*:[ \t]+\S[^\v\f\r\n]*\r?\n){1,100}---[^\S\v\f\r\n]*(?:$|\r?\n)/, (0, combinator_1.convert)(source => (0, normalize_1.normalize)(source.slice(source.indexOf('\n') + 1, source.trimEnd().lastIndexOf('\n'))).replace(/(\S)\s+$/mg, '$1'), (0, combinator_1.fmap)((0, combinator_1.some)((0, combinator_1.union)([field])), es => [(0, dom_1.html)('aside', {
  class: 'header'
}, [(0, dom_1.html)('details', {
  open: ''
}, (0, dom_1.defrag)([(0, dom_1.html)('summary', 'Header'), ...es]))])])))), ({
  source
}) => [[(0, dom_1.html)('pre', {
  class: 'invalid',
  translate: 'no',
  'data-invalid-syntax': 'header',
  'data-invalid-type': 'syntax',
  'data-invalid-message': 'Invalid syntax'
}, (0, normalize_1.normalize)(source))], '']]))), (0, combinator_1.clear)((0, source_1.str)(/^[^\S\v\f\r\n]*\r?\n/))])));
const field = (0, combinator_1.line)(({
  source
}) => {
  const name = source.slice(0, source.indexOf(':'));
  const value = source.slice(name.length + 1).trim();
  return [[(0, dom_1.html)('span', {
    class: 'field',
    'data-name': name.toLowerCase(),
    'data-value': value
  }, [(0, dom_1.html)('span', {
    class: 'field-name'
  }, name), ': ', (0, dom_1.html)('span', {
    class: 'field-value'
  }, value), '\n'])], ''];
});

/***/ }),

/***/ 1160:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.shortmedia = exports.media = exports.indexer = exports.indexee = exports.inline = void 0;

const combinator_1 = __webpack_require__(2087);

const annotation_1 = __webpack_require__(2736);

const reference_1 = __webpack_require__(3555);

const template_1 = __webpack_require__(4695);

const comment_1 = __webpack_require__(8657);

const math_1 = __webpack_require__(8946);

const extension_1 = __webpack_require__(8053);

const ruby_1 = __webpack_require__(6705);

const link_1 = __webpack_require__(9628);

const html_1 = __webpack_require__(5994);

const insertion_1 = __webpack_require__(2945);

const deletion_1 = __webpack_require__(7501);

const mark_1 = __webpack_require__(2480);

const emphasis_1 = __webpack_require__(3867);

const strong_1 = __webpack_require__(8072);

const code_1 = __webpack_require__(5771);

const media_1 = __webpack_require__(1303);

const htmlentity_1 = __webpack_require__(1562);

const shortmedia_1 = __webpack_require__(4189);

const autolink_1 = __webpack_require__(6051);

const bracket_1 = __webpack_require__(5196);

const source_1 = __webpack_require__(6743);

exports.inline = (0, combinator_1.union)([annotation_1.annotation, reference_1.reference, template_1.template, comment_1.comment, math_1.math, extension_1.extension, ruby_1.ruby, link_1.link, media_1.media, html_1.html, insertion_1.insertion, deletion_1.deletion, mark_1.mark, strong_1.strong, emphasis_1.emphasis, code_1.code, htmlentity_1.htmlentity, shortmedia_1.shortmedia, autolink_1.autolink, bracket_1.bracket, source_1.text]);

var indexee_1 = __webpack_require__(1269);

Object.defineProperty(exports, "indexee", ({
  enumerable: true,
  get: function () {
    return indexee_1.indexee;
  }
}));

var indexer_1 = __webpack_require__(1047);

Object.defineProperty(exports, "indexer", ({
  enumerable: true,
  get: function () {
    return indexer_1.indexer;
  }
}));

var media_2 = __webpack_require__(1303);

Object.defineProperty(exports, "media", ({
  enumerable: true,
  get: function () {
    return media_2.media;
  }
}));

var shortmedia_2 = __webpack_require__(4189);

Object.defineProperty(exports, "shortmedia", ({
  enumerable: true,
  get: function () {
    return shortmedia_2.shortmedia;
  }
}));

/***/ }),

/***/ 2736:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.annotation = void 0;

const global_1 = __webpack_require__(4128);

const combinator_1 = __webpack_require__(2087);

const inline_1 = __webpack_require__(1160);

const visibility_1 = __webpack_require__(7618);

const dom_1 = __webpack_require__(3252);

exports.annotation = (0, combinator_1.lazy)(() => (0, combinator_1.surround)('((', (0, combinator_1.constraint)(128
/* State.annotation */
, false, (0, combinator_1.syntax)(32
/* Syntax.annotation */
, 6, 1, 128
/* State.annotation */
| 4
/* State.media */
, (0, visibility_1.startLoose)((0, combinator_1.context)({
  delimiters: global_1.undefined
}, (0, combinator_1.some)((0, combinator_1.union)([inline_1.inline]), ')', [[/^\\?\n/, 9], [')', 2], ['))', 6]])), ')'))), '))', false, ([, ns], rest) => [[(0, dom_1.html)('sup', {
  class: 'annotation'
}, [(0, dom_1.html)('span', (0, visibility_1.trimNode)((0, dom_1.defrag)(ns)))])], rest]));

/***/ }),

/***/ 6051:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.autolink = void 0;

const combinator_1 = __webpack_require__(2087);

const url_1 = __webpack_require__(4318);

const email_1 = __webpack_require__(4701);

const channel_1 = __webpack_require__(4954);

const account_1 = __webpack_require__(7806);

const hashtag_1 = __webpack_require__(5491);

const hashnum_1 = __webpack_require__(5631);

const anchor_1 = __webpack_require__(6495);

const source_1 = __webpack_require__(6743);

const util_1 = __webpack_require__(9437);

exports.autolink = (0, combinator_1.fmap)((0, combinator_1.validate)(/^(?:[@#>0-9a-z]|\S[#>])/i, (0, combinator_1.constraint)(2
/* State.autolink */
, false, (0, combinator_1.syntax)(2
/* Syntax.autolink */
, 1, 1, ~1
/* State.shortcut */
, (0, combinator_1.some)((0, combinator_1.union)([url_1.url, email_1.email, // Escape unmatched email-like strings.
(0, combinator_1.focus)(/^[0-9a-z](?:[_.+-](?=[0-9a-z])|[0-9a-z])*(?:@(?:[0-9a-z]+(?:[.-][0-9a-z]+)*)?)*/i, ({
  source
}) => {
  if (source.length > 255 || source.includes('@')) return [[source], ''];
  const i = source.indexOf('_');
  if (i === -1) return [[source], ''];
  return [[source.slice(0, i)], source.slice(i)];
}), channel_1.channel, account_1.account, // Escape unmatched account-like strings.
(0, source_1.str)(/^@+[0-9a-z]*(?:-[0-9a-z]+)*/i), // Escape invalid leading characters.
(0, source_1.str)(new RegExp(/^(?:[^\p{C}\p{S}\p{P}\s]|emoji)(?=#)/u.source.replace('emoji', hashtag_1.emoji), 'u')), hashtag_1.hashtag, hashnum_1.hashnum, // Escape unmatched hashtag-like strings.
(0, source_1.str)(new RegExp(/^#+(?:[^\p{C}\p{S}\p{P}\s]|emoji|')*/u.source.replace('emoji', hashtag_1.emoji), 'u')), // Escape invalid leading characters.
(0, source_1.str)(/^[0-9\p{Sc}](?=>)/u), anchor_1.anchor]))))), ns => ns.length === 1 ? ns : [(0, util_1.stringify)(ns)]);

/***/ }),

/***/ 7806:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.account = void 0;

const combinator_1 = __webpack_require__(2087);

const link_1 = __webpack_require__(9628);

const source_1 = __webpack_require__(6743);

const dom_1 = __webpack_require__(3252); // https://example/@user must be a user page or a redirect page going there.


exports.account = (0, combinator_1.lazy)(() => (0, combinator_1.fmap)((0, combinator_1.rewrite)((0, combinator_1.constraint)(1
/* State.shortcut */
, false, (0, combinator_1.open)('@', (0, combinator_1.tails)([(0, combinator_1.verify)((0, source_1.str)(/^[0-9a-z](?:(?:[0-9a-z]|-(?=\w)){0,61}[0-9a-z])?(?:\.[0-9a-z](?:(?:[0-9a-z]|-(?=\w)){0,61}[0-9a-z])?)*\//i), ([source]) => source.length <= 253 + 1), (0, source_1.str)(/^[a-z](?:-(?=[0-9a-z])|[0-9a-z]){0,63}/i)]))), (0, combinator_1.convert)(source => `[${source}]{ ${source.includes('/') ? `https://${source.slice(1).replace('/', '/@')}` : `/${source}`} }`, (0, combinator_1.union)([link_1.unsafelink]))), ([el]) => [(0, dom_1.define)(el, {
  class: 'account'
})]));

/***/ }),

/***/ 6495:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.anchor = void 0;

const combinator_1 = __webpack_require__(2087);

const link_1 = __webpack_require__(9628);

const dom_1 = __webpack_require__(3252); // Timeline(pseudonym): user/tid
// Thread(anonymous): cid
// tid: YYYY-MM-DD-HH-MM-SS-TMZ
// cid: YYYY-MM-DD-HH-MM-SS-mmm-TMZ
// 内部表現はUnixTimeに統一する(時系列順)
// 外部表現は投稿ごとに投稿者の投稿時のタイムゾーンに統一する(非時系列順)


exports.anchor = (0, combinator_1.lazy)(() => (0, combinator_1.validate)('>>', (0, combinator_1.fmap)((0, combinator_1.constraint)(1
/* State.shortcut */
, false, (0, combinator_1.focus)(/^>>(?:[a-z][0-9a-z]*(?:-[0-9a-z]+)*\/)?[0-9a-z]+(?:-[0-9a-z]+)*(?![0-9a-z@#:])/i, (0, combinator_1.convert)(source => `[${source}]{ ${source.includes('/') ? `/@${source.slice(2).replace('/', '/timeline/')}` : `?at=${source.slice(2)}`} }`, (0, combinator_1.union)([link_1.unsafelink])))), ([el]) => [(0, dom_1.define)(el, {
  class: 'anchor'
})])));

/***/ }),

/***/ 4954:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.channel = void 0;

const combinator_1 = __webpack_require__(2087);

const account_1 = __webpack_require__(7806);

const hashtag_1 = __webpack_require__(5491);

const util_1 = __webpack_require__(9437);

const dom_1 = __webpack_require__(3252); // https://example/@user?ch=a+b must be a user channel page or a redirect page going there.


exports.channel = (0, combinator_1.validate)('@', (0, combinator_1.bind)((0, combinator_1.sequence)([account_1.account, (0, combinator_1.some)(hashtag_1.hashtag)]), (es, rest) => {
  const source = (0, util_1.stringify)(es);
  if (source.includes('/', source.indexOf('#'))) return;
  const el = es[0];
  const url = `${el.getAttribute('href')}?ch=${source.slice(source.indexOf('#') + 1).replace(/#/g, '+')}`;
  return [[(0, dom_1.define)(el, {
    class: 'channel',
    href: url
  }, source)], rest];
}));

/***/ }),

/***/ 4701:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.email = void 0;

const combinator_1 = __webpack_require__(2087);

const source_1 = __webpack_require__(6743);

const dom_1 = __webpack_require__(3252); // https://html.spec.whatwg.org/multipage/input.html


exports.email = (0, combinator_1.creation)((0, combinator_1.rewrite)((0, combinator_1.verify)((0, source_1.str)(/^[0-9a-z](?:[_.+-](?=[0-9a-z])|[0-9a-z]){0,255}@[0-9a-z](?:(?:[0-9a-z]|-(?=\w)){0,61}[0-9a-z])?(?:\.[0-9a-z](?:(?:[0-9a-z]|-(?=\w)){0,61}[0-9a-z])?)*(?![0-9a-z])/i), ([source]) => source.length <= 255), ({
  source
}) => [[(0, dom_1.html)('a', {
  class: 'email',
  href: `mailto:${source}`
}, source)], '']));

/***/ }),

/***/ 5631:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.hashnum = void 0;

const combinator_1 = __webpack_require__(2087);

const link_1 = __webpack_require__(9628);

const hashtag_1 = __webpack_require__(5491);

const source_1 = __webpack_require__(6743);

const dom_1 = __webpack_require__(3252);

exports.hashnum = (0, combinator_1.lazy)(() => (0, combinator_1.fmap)((0, combinator_1.rewrite)((0, combinator_1.constraint)(1
/* State.shortcut */
, false, (0, combinator_1.open)('#', (0, source_1.str)(new RegExp(/^[0-9]{1,16}(?![^\p{C}\p{S}\p{P}\s]|emoji|')/u.source.replace(/emoji/, hashtag_1.emoji), 'u')))), (0, combinator_1.convert)(source => `[${source}]{ ${source.slice(1)} }`, (0, combinator_1.union)([link_1.unsafelink]))), ([el]) => [(0, dom_1.define)(el, {
  class: 'hashnum',
  href: null
})]));

/***/ }),

/***/ 5491:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.hashtag = exports.emoji = void 0;

const combinator_1 = __webpack_require__(2087);

const link_1 = __webpack_require__(9628);

const source_1 = __webpack_require__(6743);

const dom_1 = __webpack_require__(3252); // https://example/hashtags/a must be a hashtag page or a redirect page going there.
// https://github.com/tc39/proposal-regexp-unicode-property-escapes#matching-emoji


exports.emoji = String.raw`\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|\p{Emoji_Presentation}|\p{Emoji}\uFE0F`;
exports.hashtag = (0, combinator_1.lazy)(() => (0, combinator_1.fmap)((0, combinator_1.rewrite)((0, combinator_1.constraint)(1
/* State.shortcut */
, false, (0, combinator_1.open)('#', (0, combinator_1.tails)([(0, combinator_1.verify)((0, source_1.str)(/^[0-9a-z](?:(?:[0-9a-z]|-(?=\w)){0,61}[0-9a-z])?(?:\.[0-9a-z](?:(?:[0-9a-z]|-(?=\w)){0,61}[0-9a-z])?)*\//i), ([source]) => source.length <= 253 + 1), (0, combinator_1.verify)((0, source_1.str)(new RegExp([/^(?=(?:[0-9]{1,127}_?)?(?:[^\d\p{C}\p{S}\p{P}\s]|emoji|'))/u.source, /(?:[^\p{C}\p{S}\p{P}\s]|emoji|(?<!')'|_(?=[^\p{C}\p{S}\p{P}\s]|emoji|')){1,128}/u.source, /(?!_?(?:[^\p{C}\p{S}\p{P}\s]|emoji|(?<!')'))/u.source].join('').replace(/emoji/g, exports.emoji), 'u')), ([source]) => source.length <= 128)]))), (0, combinator_1.convert)(source => `[${source}]{ ${source.includes('/') ? `https://${source.slice(1).replace('/', '/hashtags/')}` : `/hashtags/${source.slice(1)}`} }`, (0, combinator_1.union)([link_1.unsafelink]))), ([el]) => [(0, dom_1.define)(el, {
  class: 'hashtag'
}, el.innerText)]));

/***/ }),

/***/ 4318:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.url = void 0;

const combinator_1 = __webpack_require__(2087);

const link_1 = __webpack_require__(9628);

const source_1 = __webpack_require__(6743);

const closer = /^[-+*=~^_,.;:!?]*(?=[\\"`|\[\](){}<>]|$)/;
exports.url = (0, combinator_1.lazy)(() => (0, combinator_1.validate)(['http://', 'https://'], (0, combinator_1.rewrite)((0, combinator_1.open)(/^https?:\/\/(?=[\x21-\x7E])/, (0, combinator_1.focus)(/^[\x21-\x7E]+/, (0, combinator_1.some)((0, combinator_1.union)([bracket, (0, combinator_1.some)(source_1.unescsource, closer)])))), (0, combinator_1.convert)(url => `{ ${url} }`, (0, combinator_1.union)([link_1.unsafelink])))));
const bracket = (0, combinator_1.lazy)(() => (0, combinator_1.creation)((0, combinator_1.precedence)(2, (0, combinator_1.union)([(0, combinator_1.surround)('(', (0, combinator_1.some)((0, combinator_1.union)([bracket, source_1.unescsource]), ')'), ')', true), (0, combinator_1.surround)('[', (0, combinator_1.some)((0, combinator_1.union)([bracket, source_1.unescsource]), ']'), ']', true), (0, combinator_1.surround)('{', (0, combinator_1.some)((0, combinator_1.union)([bracket, source_1.unescsource]), '}'), '}', true), (0, combinator_1.surround)('"', (0, combinator_1.precedence)(8, (0, combinator_1.some)(source_1.unescsource, '"')), '"', true)]))));

/***/ }),

/***/ 5196:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.bracket = void 0;

const global_1 = __webpack_require__(4128);

const combinator_1 = __webpack_require__(2087);

const inline_1 = __webpack_require__(1160);

const source_1 = __webpack_require__(6743);

const array_1 = __webpack_require__(8112);

const dom_1 = __webpack_require__(3252);

const index = /^[0-9A-Za-z]+(?:(?:[.-]|, )[0-9A-Za-z]+)*/;
exports.bracket = (0, combinator_1.lazy)(() => (0, combinator_1.union)([(0, combinator_1.surround)((0, source_1.str)('('), (0, combinator_1.syntax)(0
/* Syntax.none */
, 2, 1, 0
/* State.none */
, (0, source_1.str)(index)), (0, source_1.str)(')')), (0, combinator_1.surround)((0, source_1.str)('('), (0, combinator_1.syntax)(128
/* Syntax.bracket */
, 2, 1, 0
/* State.none */
, (0, combinator_1.some)(inline_1.inline, ')', [[')', 2]])), (0, source_1.str)(')'), true, ([as, bs = [], cs], rest) => [[(0, dom_1.html)('span', {
  class: 'paren'
}, (0, dom_1.defrag)((0, array_1.push)((0, array_1.unshift)(as, bs), cs)))], rest], ([as, bs = []], rest) => [(0, array_1.unshift)([''], (0, array_1.unshift)(as, bs)), rest]), (0, combinator_1.surround)((0, source_1.str)('（'), (0, combinator_1.syntax)(0
/* Syntax.none */
, 2, 1, 0
/* State.none */
, (0, source_1.str)(new RegExp(index.source.replace(', ', '[，、]').replace(/[09AZaz.]|\-(?!\w)/g, c => c.trimStart() && String.fromCharCode(c.charCodeAt(0) + 0xFEE0))))), (0, source_1.str)('）')), (0, combinator_1.surround)((0, source_1.str)('（'), (0, combinator_1.syntax)(128
/* Syntax.bracket */
, 2, 1, 0
/* State.none */
, (0, combinator_1.some)(inline_1.inline, '）', [['）', 2]])), (0, source_1.str)('）'), true, ([as, bs = [], cs], rest) => [[(0, dom_1.html)('span', {
  class: 'paren'
}, (0, dom_1.defrag)((0, array_1.push)((0, array_1.unshift)(as, bs), cs)))], rest], ([as, bs = []], rest) => [(0, array_1.unshift)(as, bs), rest]), (0, combinator_1.surround)((0, source_1.str)('['), (0, combinator_1.syntax)(128
/* Syntax.bracket */
, 2, 1, 0
/* State.none */
, (0, combinator_1.some)(inline_1.inline, ']', [[']', 2]])), (0, source_1.str)(']'), true, global_1.undefined, ([as, bs = []], rest) => [(0, array_1.unshift)([''], (0, array_1.unshift)(as, bs)), rest]), (0, combinator_1.surround)((0, source_1.str)('{'), (0, combinator_1.syntax)(128
/* Syntax.bracket */
, 2, 1, 0
/* State.none */
, (0, combinator_1.some)(inline_1.inline, '}', [['}', 2]])), (0, source_1.str)('}'), true, global_1.undefined, ([as, bs = []], rest) => [(0, array_1.unshift)(as, bs), rest]), // Control media blinking in editing rather than control confusion of pairs of quote marks.
(0, combinator_1.surround)((0, source_1.str)('"'), (0, combinator_1.syntax)(1
/* Syntax.quote */
, 8, 1, 0
/* State.none */
, (0, combinator_1.some)(inline_1.inline, '"', [['"', 8]])), (0, source_1.str)('"'), true, global_1.undefined, ([as, bs = []], rest) => [(0, array_1.unshift)(as, bs), rest])]));

/***/ }),

/***/ 5771:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.code = void 0;

const combinator_1 = __webpack_require__(2087);

const dom_1 = __webpack_require__(3252);

exports.code = (0, combinator_1.creation)((0, combinator_1.validate)('`', (0, combinator_1.match)(/^(`+)(?!`)([^\n]*?[^`\n])\1(?!`)/, ([whole,, body]) => ({
  source
}) => [[(0, dom_1.html)('code', {
  'data-src': whole
}, format(body))], source.slice(whole.length)])));

function format(text) {
  return `${text[0]}${text[text.length - 1]}` === '  ' && text.trimStart() ? text.slice(1, -1) : text;
}

/***/ }),

/***/ 8657:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.comment = void 0;

const combinator_1 = __webpack_require__(2087);

const inline_1 = __webpack_require__(1160);

const source_1 = __webpack_require__(6743);

const memoize_1 = __webpack_require__(1808);

const array_1 = __webpack_require__(8112);

const dom_1 = __webpack_require__(3252);

exports.comment = (0, combinator_1.lazy)(() => (0, combinator_1.validate)('[%', (0, combinator_1.syntax)(0
/* Syntax.none */
, 4, 1, 0
/* State.none */
, (0, combinator_1.match)(/^\[(%+)\s/, (0, memoize_1.memoize)(([, fence]) => (0, combinator_1.surround)((0, combinator_1.open)((0, source_1.str)(`[${fence}`), (0, combinator_1.some)(source_1.text, new RegExp(String.raw`^\s+${fence}\]|^\S`)), true), (0, combinator_1.some)((0, combinator_1.union)([inline_1.inline]), new RegExp(String.raw`^\s+${fence}\]`), [[new RegExp(String.raw`^\s+${fence}\]`), 4]]), (0, combinator_1.close)((0, combinator_1.some)(source_1.text, /^\S/), (0, source_1.str)(`${fence}]`)), true, ([as, bs = [], cs], rest) => [[(0, dom_1.html)('span', {
  class: 'comment'
}, [(0, dom_1.html)('input', {
  type: 'checkbox'
}), (0, dom_1.html)('span', (0, dom_1.defrag)((0, array_1.push)((0, array_1.unshift)(as, bs), cs)))])], rest], ([as, bs = []], rest) => [(0, array_1.unshift)(as, bs), rest]), ([, fence]) => fence.length, [])))));

/***/ }),

/***/ 7501:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.deletion = void 0;

const combinator_1 = __webpack_require__(2087);

const inline_1 = __webpack_require__(1160);

const source_1 = __webpack_require__(6743);

const visibility_1 = __webpack_require__(7618);

const array_1 = __webpack_require__(8112);

const dom_1 = __webpack_require__(3252);

exports.deletion = (0, combinator_1.lazy)(() => (0, combinator_1.surround)((0, source_1.str)('~~', '~'), (0, combinator_1.syntax)(0
/* Syntax.none */
, 1, 1, 0
/* State.none */
, (0, combinator_1.some)((0, combinator_1.union)([(0, combinator_1.some)(inline_1.inline, (0, visibility_1.blankWith)('\n', '~~')), (0, combinator_1.open)('\n', (0, combinator_1.some)(inline_1.inline, '~'), true)]))), (0, source_1.str)('~~'), false, ([, bs], rest) => [[(0, dom_1.html)('del', (0, dom_1.defrag)(bs))], rest], ([as, bs], rest) => [(0, array_1.unshift)(as, bs), rest]));

/***/ }),

/***/ 3867:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.emphasis = void 0;

const combinator_1 = __webpack_require__(2087);

const inline_1 = __webpack_require__(1160);

const source_1 = __webpack_require__(6743);

const visibility_1 = __webpack_require__(7618);

const array_1 = __webpack_require__(8112);

const dom_1 = __webpack_require__(3252);

exports.emphasis = (0, combinator_1.lazy)(() => (0, combinator_1.surround)((0, source_1.str)('_', '_'), (0, combinator_1.syntax)(0
/* Syntax.none */
, 1, 1, 0
/* State.none */
, (0, visibility_1.startTight)((0, combinator_1.some)((0, combinator_1.union)([(0, combinator_1.some)(inline_1.inline, (0, visibility_1.blankWith)('_')), (0, combinator_1.open)((0, combinator_1.some)(inline_1.inline, '_'), exports.emphasis)])))), (0, source_1.str)('_'), false, ([, bs], rest) => [[(0, dom_1.html)('em', (0, dom_1.defrag)(bs))], rest], ([as, bs], rest) => [(0, array_1.unshift)(as, bs), rest]));

/***/ }),

/***/ 8053:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.extension = void 0;

const combinator_1 = __webpack_require__(2087);

const index_1 = __webpack_require__(4479);

const label_1 = __webpack_require__(466);

const placeholder_1 = __webpack_require__(5534);

exports.extension = (0, combinator_1.validate)(['[', '$'], (0, combinator_1.union)([index_1.index, label_1.label, placeholder_1.placeholder]));

/***/ }),

/***/ 4479:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.index = void 0;

const global_1 = __webpack_require__(4128);

const combinator_1 = __webpack_require__(2087);

const inline_1 = __webpack_require__(1160);

const indexee_1 = __webpack_require__(1269);

const source_1 = __webpack_require__(6743);

const visibility_1 = __webpack_require__(7618);

const dom_1 = __webpack_require__(3252);

exports.index = (0, combinator_1.lazy)(() => (0, combinator_1.validate)('[#', (0, combinator_1.fmap)((0, indexee_1.indexee)((0, combinator_1.surround)('[#', (0, combinator_1.constraint)(32
/* State.index */
, false, (0, combinator_1.syntax)(2048
/* Syntax.index */
, 2, 1, 250
/* State.linkers */
| 4
/* State.media */
, (0, visibility_1.startTight)((0, combinator_1.open)((0, source_1.stropt)(/^\|?/), (0, visibility_1.trimBlankEnd)((0, combinator_1.some)((0, combinator_1.union)([signature, inline_1.inline]), ']', [[/^\\?\n/, 9], [']', 2]])), true)))), ']', false, ([, ns], rest) => [[(0, dom_1.html)('a', (0, dom_1.defrag)(ns))], rest])), ([el]) => [(0, dom_1.define)(el, {
  id: el.id ? null : global_1.undefined,
  class: 'index',
  href: el.id ? `#${el.id}` : global_1.undefined
}, el.childNodes)])));
const signature = (0, combinator_1.lazy)(() => (0, combinator_1.creation)((0, combinator_1.fmap)((0, combinator_1.open)('|#', (0, visibility_1.startTight)((0, combinator_1.some)((0, combinator_1.union)([bracket, source_1.txt]), ']'))), ns => [(0, dom_1.html)('span', {
  class: 'indexer',
  'data-index': (0, indexee_1.identity)(ns.join('')).slice(6)
})])));
const bracket = (0, combinator_1.lazy)(() => (0, combinator_1.creation)((0, combinator_1.union)([(0, combinator_1.surround)((0, source_1.str)('('), (0, combinator_1.some)((0, combinator_1.union)([bracket, source_1.txt]), ')'), (0, source_1.str)(')'), true), (0, combinator_1.surround)((0, source_1.str)('['), (0, combinator_1.some)((0, combinator_1.union)([bracket, source_1.txt]), ']'), (0, source_1.str)(']'), true), (0, combinator_1.surround)((0, source_1.str)('{'), (0, combinator_1.some)((0, combinator_1.union)([bracket, source_1.txt]), '}'), (0, source_1.str)('}'), true), (0, combinator_1.surround)((0, source_1.str)('"'), (0, combinator_1.precedence)(8, (0, combinator_1.some)(source_1.txt, '"')), (0, source_1.str)('"'), true)])));

/***/ }),

/***/ 1269:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.text = exports.identity = exports.indexee = void 0;

const global_1 = __webpack_require__(4128);

const combinator_1 = __webpack_require__(2087);

const dom_1 = __webpack_require__(3252);

const query_1 = __webpack_require__(6120);

function indexee(parser, optional) {
  return (0, combinator_1.fmap)(parser, ([el], _, {
    id
  }) => [(0, dom_1.define)(el, {
    id: id !== '' && identity(text(el, optional)) || global_1.undefined
  })]);
}

exports.indexee = indexee;

function identity(text) {
  text &&= text.trim();
  return text && `index:${text.replace(/\s+/g, '_').slice(0, 101).replace(/^(.{97}).{4}$/, '$1...')}`;
}

exports.identity = identity;

function text(source, optional = false) {
  const indexer = source.querySelector(':scope > .indexer');
  if (!indexer && optional) return '';
  const index = indexer?.getAttribute('data-index');
  if (index) return index;
  const target = source.cloneNode(true);

  for (let es = (0, query_1.querySelectorAll)(target, 'code[data-src], .math[data-src], .comment, rt, rp, .reference, .checkbox, ul, ol'), i = 0; i < es.length; ++i) {
    const el = es[i];

    switch (el.tagName) {
      case 'CODE':
        (0, dom_1.define)(el, el.getAttribute('data-src'));
        continue;

      case 'RT':
      case 'RP':
      case 'UL':
      case 'OL':
        el.remove();
        continue;
    }

    switch (el.className) {
      case 'math':
        (0, dom_1.define)(el, el.getAttribute('data-src'));
        continue;

      case 'comment':
      case 'checkbox':
        el.remove();
        continue;

      case 'reference':
        el.firstChild.remove();
        continue;
    }
  } // Better:
  //return target.innerText;


  return target.textContent;
}

exports.text = text;

/***/ }),

/***/ 1047:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.indexer = void 0;

const combinator_1 = __webpack_require__(2087);

const index_1 = __webpack_require__(4479);

const dom_1 = __webpack_require__(3252);

exports.indexer = (0, combinator_1.creation)((0, combinator_1.fmap)((0, combinator_1.verify)((0, combinator_1.surround)(/^\s+(?=\[#\S)/, (0, combinator_1.state)(32
/* State.index */
, false, (0, combinator_1.union)([(0, combinator_1.focus)('[#]', () => [[(0, dom_1.html)('a', {
  href: '#'
})], '']), index_1.index])), /^\s*$/), // Indexer is invisible but invalids must be visible.
([el]) => el.getElementsByClassName('invalid').length === 0), ([el]) => [(0, dom_1.html)('span', {
  class: 'indexer',
  'data-index': el.getAttribute('href').slice(7)
})]));

/***/ }),

/***/ 466:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.isFixed = exports.number = exports.label = exports.segment = void 0;

const global_1 = __webpack_require__(4128);

const combinator_1 = __webpack_require__(2087);

const source_1 = __webpack_require__(6743);

const dom_1 = __webpack_require__(3252);

const body = (0, source_1.str)(/^\$[A-Za-z]*(?:(?:-[A-Za-z][0-9A-Za-z]*)+|-(?:(?:0|[1-9][0-9]*)\.)*(?:0|[1-9][0-9]*)(?![0-9A-Za-z]))/);
exports.segment = (0, combinator_1.clear)((0, combinator_1.validate)(['[$', '$'], (0, combinator_1.union)([(0, combinator_1.surround)('[', body, ']'), body])));
exports.label = (0, combinator_1.validate)(['[$', '$'], (0, combinator_1.creation)((0, combinator_1.fmap)((0, combinator_1.constraint)(16
/* State.label */
, false, (0, combinator_1.union)([(0, combinator_1.surround)('[', body, ']'), body])), ([text]) => [(0, dom_1.html)('a', {
  class: 'label',
  'data-label': text.slice(text[1] === '-' ? 0 : 1).toLowerCase()
}, text)])));

function number(label, base) {
  return isFixed(label) ? label.slice(label.lastIndexOf('-') + 1) : increment(base, base.split('.').length);
}

exports.number = number;

function isFixed(label) {
  return /^[^-]+-[0-9]+(?:\.[0-9]+)*$/.test(label);
}

exports.isFixed = isFixed;

function increment(number, position) {
  if (number === '0' && position > 1) return increment('1', position);
  const ns = number.split('.');
  const ms = (0, global_1.Array)(position);

  for (let i = 0; i < position; ++i) {
    ms[i] = i < ns.length ? i + 1 < position ? +ns[i] : +ns[i] + 1 : i + 1 < position ? 0 : 1;
  }

  return ms.join('.');
}

/***/ }),

/***/ 5534:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.placeholder = void 0;

const combinator_1 = __webpack_require__(2087);

const inline_1 = __webpack_require__(1160);

const source_1 = __webpack_require__(6743);

const visibility_1 = __webpack_require__(7618);

const array_1 = __webpack_require__(8112);

const dom_1 = __webpack_require__(3252); // Don't use the symbols already used: !#$%@&*+~=
// All syntax surrounded by square brackets shouldn't contain line breaks.


exports.placeholder = (0, combinator_1.lazy)(() => (0, combinator_1.validate)(['[:', '[^'], (0, combinator_1.surround)((0, source_1.str)(/^\[[:^]/), (0, combinator_1.syntax)(1024
/* Syntax.placeholder */
, 2, 1, 0
/* State.none */
, (0, visibility_1.startTight)((0, combinator_1.some)((0, combinator_1.union)([inline_1.inline]), ']', [[/^\\?\n/, 9], [']', 2]]))), (0, source_1.str)(']'), false, ([as, bs], rest) => [[(0, dom_1.html)('span', {
  class: 'invalid',
  'data-invalid-syntax': 'extension',
  'data-invalid-type': 'syntax',
  'data-invalid-message': `Reserved start symbol "${as[0][1]}" cannot be used in "[]"`
}, (0, dom_1.defrag)(bs))], rest], ([as, bs], rest) => [(0, array_1.unshift)(as, bs), rest])));

/***/ }),

/***/ 5994:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.attributes = exports.attribute = exports.html = void 0;

const global_1 = __webpack_require__(4128);

const combinator_1 = __webpack_require__(2087);

const inline_1 = __webpack_require__(1160);

const source_1 = __webpack_require__(6743);

const visibility_1 = __webpack_require__(7618);

const memoize_1 = __webpack_require__(1808);

const cache_1 = __webpack_require__(9210);

const array_1 = __webpack_require__(8112);

const dom_1 = __webpack_require__(3252);

const tags = global_1.Object.freeze(['bdo', 'bdi']);
const attrspecs = {
  bdo: {
    dir: global_1.Object.freeze(['ltr', 'rtl'])
  }
};
global_1.Object.setPrototypeOf(attrspecs, null);
global_1.Object.values(attrspecs).forEach(o => global_1.Object.setPrototypeOf(o, null));
exports.html = (0, combinator_1.lazy)(() => (0, combinator_1.validate)('<', (0, combinator_1.validate)(/^<[a-z]+(?=[^\S\n]|>)/i, (0, combinator_1.syntax)(0
/* Syntax.none */
, 5, 1, 0
/* State.none */
, (0, combinator_1.union)([(0, combinator_1.focus)(/^<wbr[^\S\n]*>/i, () => [[(0, dom_1.html)('wbr')], '']), (0, combinator_1.surround)( // https://html.spec.whatwg.org/multipage/syntax.html#void-elements
(0, source_1.str)(/^<(?:area|base|br|col|embed|hr|img|input|link|meta|source|track|wbr)(?=[^\S\n]|>)/i), (0, combinator_1.some)((0, combinator_1.union)([exports.attribute])), (0, source_1.str)(/^[^\S\n]*>/), true, ([as, bs = [], cs], rest) => [[elem(as[0].slice(1), (0, array_1.push)((0, array_1.unshift)(as, bs), cs), [], [])], rest]), (0, combinator_1.match)(new RegExp(String.raw`^<(${TAGS.join('|')})(?=[^\S\n]|>)`), (0, memoize_1.memoize)(([, tag]) => (0, combinator_1.surround)((0, combinator_1.surround)((0, source_1.str)(`<${tag}`), (0, combinator_1.some)(exports.attribute), (0, source_1.str)(/^[^\S\n]*>/), true), (0, combinator_1.subsequence)([(0, combinator_1.focus)(/^[^\S\n]*\n/, (0, combinator_1.some)(inline_1.inline)), (0, combinator_1.some)((0, combinator_1.open)(/^\n?/, (0, combinator_1.some)(inline_1.inline, (0, visibility_1.blankWith)('\n', `</${tag}>`), [[(0, visibility_1.blankWith)('\n', `</${tag}>`), 5]]), true))]), (0, source_1.str)(`</${tag}>`), true, ([as, bs = [], cs], rest) => [[elem(tag, as, bs, cs)], rest], ([as, bs = []], rest) => [[elem(tag, as, bs, [])], rest]), ([, tag]) => TAGS.indexOf(tag), [])), (0, combinator_1.match)(/^<([a-z]+)(?=[^\S\n]|>)/i, (0, memoize_1.memoize)(([, tag]) => (0, combinator_1.surround)((0, combinator_1.surround)((0, source_1.str)(`<${tag}`), (0, combinator_1.some)(exports.attribute), (0, source_1.str)(/^[^\S\n]*>/), true), (0, combinator_1.subsequence)([(0, combinator_1.focus)(/^[^\S\n]*\n/, (0, combinator_1.some)(inline_1.inline)), (0, combinator_1.some)(inline_1.inline, `</${tag}>`, [[`</${tag}>`, 5]])]), (0, source_1.str)(`</${tag}>`), true, ([as, bs = [], cs], rest) => [[elem(tag, as, bs, cs)], rest], ([as, bs = []], rest) => [[elem(tag, as, bs, [])], rest]), ([, tag]) => tag, new cache_1.Cache(10000)))])))));
exports.attribute = (0, combinator_1.union)([(0, source_1.str)(/^[^\S\n]+[a-z]+(?:-[a-z]+)*(?:="[^"\n]*")?(?=[^\S\n]|>)/i)]); // https://developer.mozilla.org/en-US/docs/Web/HTML/Element
// [...document.querySelectorAll('tbody > tr > td:first-child')].map(el => el.textContent.slice(1, -1))

const TAGS = global_1.Object.freeze(["html", "base", "head", "link", "meta", "style", "title", "body", "address", "article", "aside", "footer", "header", "h1", "h2", "h3", "h4", "h5", "h6", "main", "nav", "section", "blockquote", "dd", "div", "dl", "dt", "figcaption", "figure", "hr", "li", "menu", "ol", "p", "pre", "ul", "a", "abbr", "b", "bdi", "bdo", "br", "cite", "code", "data", "dfn", "em", "i", "kbd", "mark", "q", "rp", "rt", "ruby", "s", "samp", "small", "span", "strong", "sub", "sup", "time", "u", "var", "wbr", "area", "audio", "img", "map", "track", "video", "embed", "iframe", "object", "picture", "portal", "source", "svg", "math", "canvas", "noscript", "script", "del", "ins", "caption", "col", "colgroup", "table", "tbody", "td", "tfoot", "th", "thead", "tr", "button", "datalist", "fieldset", "form", "input", "label", "legend", "meter", "optgroup", "option", "output", "progress", "select", "textarea", "details", "dialog", "summary", "slot", "template", "acronym", "applet", "basefont", "bgsound", "big", "blink", "center", "content", "dir", "font", "frame", "frameset", "hgroup", "image", "keygen", "marquee", "menuitem", "nobr", "noembed", "noframes", "param", "plaintext", "rb", "rtc", "shadow", "spacer", "strike", "tt", "xmp"]);

function elem(tag, as, bs, cs) {
  if (!tags.includes(tag)) return invalid('tag', `Invalid HTML tag name "${tag}"`, as, bs, cs);
  if (cs.length === 0) return invalid('tag', `Missing the closing HTML tag "</${tag}>"`, as, bs, cs);
  if (bs.length === 0) return invalid('content', `Missing the content`, as, bs, cs);
  if (!(0, visibility_1.isStartLooseNodes)(bs)) return invalid('content', `Missing the visible content in the same line`, as, bs, cs);
  const attrs = attributes('html', [], attrspecs[tag], as.slice(1, -1));
  return 'data-invalid-syntax' in attrs ? invalid('attribute', 'Invalid HTML attribute', as, bs, cs) : (0, dom_1.html)(tag, attrs, (0, dom_1.defrag)(bs));
}

function invalid(type, message, as, bs, cs) {
  return (0, dom_1.html)('span', {
    class: 'invalid',
    'data-invalid-syntax': 'html',
    'data-invalid-type': type,
    'data-invalid-message': message
  }, (0, dom_1.defrag)((0, array_1.push)((0, array_1.unshift)(as, bs), cs)));
}

const requiredAttributes = (0, memoize_1.memoize)(spec => global_1.Object.entries(spec).flatMap(([k, v]) => v && global_1.Object.isFrozen(v) ? [k] : []), new WeakMap());

function attributes(syntax, classes, spec, params) {
  let invalid = false;
  const attrs = {};

  for (let i = 0; i < params.length; ++i) {
    const param = params[i].trim();
    const name = param.split('=', 1)[0];
    const value = param !== name ? param.slice(name.length + 2, -1).replace(/\\(.?)/g, '$1') : global_1.undefined;
    invalid ||= !spec || name in attrs;
    if (spec && name in spec && !spec[name]) continue;
    spec?.[name]?.includes(value) || value !== global_1.undefined && spec?.[name]?.length === 0 ? attrs[name] = value ?? '' : invalid ||= !!spec;
    (0, array_1.splice)(params, i--, 1);
  }

  invalid ||= !!spec && !requiredAttributes(spec).every(name => name in attrs);

  if (invalid) {
    attrs['class'] = (classes.includes('invalid') ? classes : (0, array_1.unshift)(classes, ['invalid'])).join(' ');
    attrs['data-invalid-syntax'] = syntax;
    attrs['data-invalid-type'] = 'argument';
    attrs['data-invalid-message'] = 'Invalid argument';
  }

  return attrs;
}

exports.attributes = attributes;

/***/ }),

/***/ 1562:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.htmlentity = exports.unsafehtmlentity = void 0;

const global_1 = __webpack_require__(4128);

const combinator_1 = __webpack_require__(2087);

const dom_1 = __webpack_require__(3252);

const memoize_1 = __webpack_require__(1808);

exports.unsafehtmlentity = (0, combinator_1.creation)((0, combinator_1.validate)('&', (0, combinator_1.focus)(/^&[0-9A-Za-z]+;/, ({
  source
}) => [[parse(source) ?? `\x1B${source}`], ''])));
exports.htmlentity = (0, combinator_1.fmap)((0, combinator_1.union)([exports.unsafehtmlentity]), ([test]) => [test[0] === '\x1B' ? (0, dom_1.html)('span', {
  class: 'invalid',
  'data-invalid-syntax': 'htmlentity',
  'data-invalid-type': 'syntax',
  'data-invalid-message': 'Invalid HTML entity'
}, test.slice(1)) : test]);
const parse = (0, memoize_1.reduce)((el => entity => {
  if (entity === '&NewLine;') return ' ';
  el.innerHTML = entity;
  const text = el.textContent;
  return entity === text ? global_1.undefined : text;
})((0, dom_1.html)('b')));

/***/ }),

/***/ 2945:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.insertion = void 0;

const combinator_1 = __webpack_require__(2087);

const inline_1 = __webpack_require__(1160);

const source_1 = __webpack_require__(6743);

const visibility_1 = __webpack_require__(7618);

const array_1 = __webpack_require__(8112);

const dom_1 = __webpack_require__(3252);

exports.insertion = (0, combinator_1.lazy)(() => (0, combinator_1.surround)((0, source_1.str)('++', '+'), (0, combinator_1.syntax)(0
/* Syntax.none */
, 1, 1, 0
/* State.none */
, (0, combinator_1.some)((0, combinator_1.union)([(0, combinator_1.some)(inline_1.inline, (0, visibility_1.blankWith)('\n', '++')), (0, combinator_1.open)('\n', (0, combinator_1.some)(inline_1.inline, '+'), true)]))), (0, source_1.str)('++'), false, ([, bs], rest) => [[(0, dom_1.html)('ins', (0, dom_1.defrag)(bs))], rest], ([as, bs], rest) => [(0, array_1.unshift)(as, bs), rest]));

/***/ }),

/***/ 9628:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.resolve = exports.option = exports.uri = exports.unsafelink = exports.link = void 0;

const global_1 = __webpack_require__(4128);

const parser_1 = __webpack_require__(6728);

const combinator_1 = __webpack_require__(2087);

const inline_1 = __webpack_require__(1160);

const html_1 = __webpack_require__(5994);

const autolink_1 = __webpack_require__(6578);

const source_1 = __webpack_require__(6743);

const visibility_1 = __webpack_require__(7618);

const util_1 = __webpack_require__(9437);

const url_1 = __webpack_require__(2261);

const dom_1 = __webpack_require__(3252);

const optspec = {
  rel: ['nofollow']
};
Object.setPrototypeOf(optspec, null);
exports.link = (0, combinator_1.lazy)(() => (0, combinator_1.validate)(['[', '{'], (0, combinator_1.union)([medialink, textlink])));
const textlink = (0, combinator_1.lazy)(() => (0, combinator_1.constraint)(8
/* State.link */
, false, (0, combinator_1.syntax)(256
/* Syntax.link */
, 2, 10, 250
/* State.linkers */
| 4
/* State.media */
, (0, combinator_1.bind)((0, combinator_1.reverse)((0, combinator_1.tails)([(0, combinator_1.dup)((0, combinator_1.surround)('[', (0, combinator_1.some)((0, combinator_1.union)([inline_1.inline]), ']', [[/^\\?\n/, 9], [']', 2]]), ']', true)), (0, combinator_1.dup)((0, combinator_1.surround)(/^{(?![{}])/, (0, combinator_1.inits)([exports.uri, (0, combinator_1.some)(exports.option)]), /^[^\S\n]*}/))])), ([params, content = []], rest, context) => {
  return parse(content, params, rest, context);
}))));
const medialink = (0, combinator_1.lazy)(() => (0, combinator_1.constraint)(8
/* State.link */
| 4
/* State.media */
, false, (0, combinator_1.syntax)(256
/* Syntax.link */
, 2, 10, 250
/* State.linkers */
, (0, combinator_1.bind)((0, combinator_1.reverse)((0, combinator_1.sequence)([(0, combinator_1.dup)((0, combinator_1.surround)('[', (0, combinator_1.union)([inline_1.media, inline_1.shortmedia]), ']')), (0, combinator_1.dup)((0, combinator_1.surround)(/^{(?![{}])/, (0, combinator_1.inits)([exports.uri, (0, combinator_1.some)(exports.option)]), /^[^\S\n]*}/))])), ([params, content = []], rest, context) => parse(content, params, rest, context)))));
exports.unsafelink = (0, combinator_1.lazy)(() => (0, combinator_1.creation)(10, (0, combinator_1.precedence)(2, (0, combinator_1.bind)((0, combinator_1.reverse)((0, combinator_1.tails)([(0, combinator_1.dup)((0, combinator_1.surround)('[', (0, combinator_1.some)((0, combinator_1.union)([source_1.unescsource]), ']'), ']')), (0, combinator_1.dup)((0, combinator_1.surround)(/^{(?![{}])/, (0, combinator_1.inits)([exports.uri, (0, combinator_1.some)(exports.option)]), /^[^\S\n]*}/))])), ([params, content = []], rest, context) => parse(content, params, rest, context)))));
exports.uri = (0, combinator_1.union)([(0, combinator_1.open)(/^[^\S\n]+/, (0, source_1.str)(/^\S+/)), (0, source_1.str)(/^[^\s{}]+/)]);
exports.option = (0, combinator_1.union)([(0, combinator_1.fmap)((0, source_1.str)(/^[^\S\n]+nofollow(?=[^\S\n]|})/), () => [` rel="nofollow"`]), (0, source_1.str)(/^[^\S\n]+[a-z]+(?:-[a-z]+)*(?:="(?:\\[^\n]|[^\\\n"])*")?(?=[^\S\n]|})/), (0, combinator_1.fmap)((0, source_1.str)(/^[^\S\n]+[^\s{}]+/), opt => [` \\${opt.slice(1)}`])]);
const autolink = (0, combinator_1.state)(2
/* State.autolink */
, false, (0, combinator_1.state)(1
/* State.shortcut */
, autolink_1.autolink));

function parse(content, params, rest, context) {
  if (content.length !== 0 && (0, visibility_1.trimNode)(content).length === 0) return;
  content = (0, dom_1.defrag)(content);

  for (let source = (0, util_1.stringify)(content); source;) {
    if (/^[a-z][0-9a-z]*(?:[-.][0-9a-z]+)*:(?:\/{0,2}[^/?#\s]+|\/\/(?=[/]))/i.test(source)) return;
    const result = autolink({
      source,
      context
    });
    if (typeof (0, parser_1.eval)(result, [])[0] === 'object') return;
    source = (0, parser_1.exec)(result, '');
  }

  const INSECURE_URI = params.shift();
  const uri = new url_1.ReadonlyURL(resolve(INSECURE_URI, context.host ?? global_1.location, context.url ?? context.host ?? global_1.location), context.host?.href || global_1.location.href);

  switch (uri.protocol) {
    case 'tel:':
      {
        const tel = content.length === 0 ? INSECURE_URI : content[0];
        const pattern = /^(?:tel:)?(?:\+(?!0))?\d+(?:-\d+)*$/i;

        if (content.length <= 1 && typeof tel === 'string' && pattern.test(tel) && pattern.test(INSECURE_URI) && tel.replace(/[^+\d]/g, '') === INSECURE_URI.replace(/[^+\d]/g, '')) {
          break;
        }

        return;
      }
  }

  const el = elem(INSECURE_URI, content, uri, context.host?.origin || global_1.location.origin);
  if (el.className === 'invalid') return [[el], rest];
  return [[(0, dom_1.define)(el, (0, html_1.attributes)('link', [], optspec, params))], rest];
}

function elem(INSECURE_URI, content, uri, origin) {
  let type;
  let message;

  switch (uri.protocol) {
    case 'http:':
    case 'https:':
      if (INSECURE_URI.slice(0, 2) === '^/' && /\/\.\.?(?:\/|$)/.test(INSECURE_URI.slice(0, INSECURE_URI.search(/[?#]|$/)))) {
        type = 'argument';
        message = 'Dot-segments cannot be used in subresource paths';
        break;
      }

      return (0, dom_1.html)('a', {
        class: content.length === 0 ? 'url' : 'link',
        href: uri.source,
        target: global_1.undefined || uri.origin !== origin || typeof content[0] === 'object' && content[0].classList.contains('media') ? '_blank' : global_1.undefined
      }, content.length === 0 ? decode(INSECURE_URI) : content);

    case 'tel:':
      return (0, dom_1.html)('a', {
        class: 'tel',
        href: uri.source
      }, content.length === 0 ? [INSECURE_URI] : content);
  }

  return (0, dom_1.html)('a', {
    class: 'invalid',
    'data-invalid-syntax': 'link',
    'data-invalid-type': type ??= 'argument',
    'data-invalid-message': message ??= 'Invalid protocol'
  }, content.length === 0 ? INSECURE_URI : content);
}

function resolve(uri, host, source) {
  switch (true) {
    case uri.slice(0, 2) === '^/':
      const last = host.pathname.slice(host.pathname.lastIndexOf('/') + 1);
      return last.includes('.') // isFile
      && /^[0-9]*[a-z][0-9a-z]*$/i.test(last.slice(last.lastIndexOf('.') + 1)) ? `${host.pathname.slice(0, -last.length)}${uri.slice(2)}` : `${host.pathname.replace(/\/?$/, '/')}${uri.slice(2)}`;

    case host.origin === source.origin && host.pathname === source.pathname:
    case uri.slice(0, 2) === '//':
      return uri;

    default:
      const target = new url_1.ReadonlyURL(uri, source.href);
      return target.origin === host.origin ? target.href.slice(target.origin.length) : target.href;
  }
}

exports.resolve = resolve;

function decode(uri) {
  if (!uri.includes('%')) return uri;
  const origin = uri.match(/^[a-z](?:[-.](?=\w)|[0-9a-z])*:(?:\/{0,2}[^/?#\s]+|\/\/(?=[/]))/i)?.[0] ?? '';

  try {
    let path = (0, global_1.decodeURI)(uri.slice(origin.length));

    if (!origin && /^[a-z](?:[-.](?=\w)|[0-9a-z])*:(?:\/{0,2}[^/?#\s]+|\/\/(?=[/]))/i.test(path)) {
      path = uri.slice(origin.length);
    }

    uri = origin + path;
  } finally {
    return uri.replace(/\s+/g, global_1.encodeURI);
  }
}

/***/ }),

/***/ 2480:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.mark = void 0;

const combinator_1 = __webpack_require__(2087);

const inline_1 = __webpack_require__(1160);

const source_1 = __webpack_require__(6743);

const visibility_1 = __webpack_require__(7618);

const array_1 = __webpack_require__(8112);

const dom_1 = __webpack_require__(3252);

exports.mark = (0, combinator_1.lazy)(() => (0, combinator_1.surround)((0, source_1.str)('==', '='), (0, combinator_1.syntax)(0
/* Syntax.none */
, 1, 1, 0
/* State.none */
, (0, visibility_1.startTight)((0, combinator_1.some)((0, combinator_1.union)([(0, combinator_1.some)(inline_1.inline, (0, visibility_1.blankWith)('==')), (0, combinator_1.open)((0, combinator_1.some)(inline_1.inline, '='), exports.mark)])))), (0, source_1.str)('=='), false, ([, bs], rest) => [[(0, dom_1.html)('mark', (0, dom_1.defrag)(bs))], rest], ([as, bs], rest) => [(0, array_1.unshift)(as, bs), rest]));

/***/ }),

/***/ 8946:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.math = void 0;

const combinator_1 = __webpack_require__(2087);

const source_1 = __webpack_require__(6743);

const dom_1 = __webpack_require__(3252);

const forbiddenCommand = /\\(?:begin|tiny|huge|large)(?![a-z])/i;
exports.math = (0, combinator_1.lazy)(() => (0, combinator_1.validate)('$', (0, combinator_1.creation)((0, combinator_1.rewrite)((0, combinator_1.union)([(0, combinator_1.surround)('$', (0, combinator_1.precedence)(6, bracket), '$'), (0, combinator_1.surround)(/^\$(?![\s{}])/, (0, combinator_1.precedence)(3, (0, combinator_1.some)((0, combinator_1.union)([bracket, (0, combinator_1.focus)(/^(?:[ ([](?!\$)|\\[\\{}$]?|[!#%&')\x2A-\x5A\]^_\x61-\x7A|~])+/, (0, combinator_1.some)(source_1.unescsource))]))), /^\$(?![0-9A-Za-z])/)]), ({
  source,
  context: {
    caches: {
      math: cache
    } = {}
  }
}) => [[cache?.get(source)?.cloneNode(true) || (0, dom_1.html)('span', !forbiddenCommand.test(source) ? {
  class: 'math',
  translate: 'no',
  'data-src': source
} : {
  class: 'invalid',
  translate: 'no',
  'data-invalid-syntax': 'math',
  'data-invalid-type': 'content',
  'data-invalid-message': `"${source.match(forbiddenCommand)[0]}" command is forbidden`
}, source)], '']))));
const bracket = (0, combinator_1.lazy)(() => (0, combinator_1.creation)((0, combinator_1.surround)('{', (0, combinator_1.some)((0, combinator_1.union)([bracket, (0, combinator_1.some)(source_1.escsource, /^(?:[{}$]|\\?\n)/)])), '}', true)));

/***/ }),

/***/ 1303:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.media = void 0;

const global_1 = __webpack_require__(4128);

const combinator_1 = __webpack_require__(2087);

const link_1 = __webpack_require__(9628);

const html_1 = __webpack_require__(5994);

const htmlentity_1 = __webpack_require__(1562);

const source_1 = __webpack_require__(6743);

const url_1 = __webpack_require__(2261);

const array_1 = __webpack_require__(8112);

const dom_1 = __webpack_require__(3252);

const optspec = {
  'width': [],
  'height': [],
  'aspect-ratio': [],
  rel: global_1.undefined
};
Object.setPrototypeOf(optspec, null);
exports.media = (0, combinator_1.lazy)(() => (0, combinator_1.validate)(['![', '!{'], (0, combinator_1.open)('!', (0, combinator_1.constraint)(4
/* State.media */
, false, (0, combinator_1.syntax)(64
/* Syntax.media */
, 2, 10, ~8
/* State.link */
, (0, combinator_1.bind)((0, combinator_1.verify)((0, combinator_1.fmap)((0, combinator_1.tails)([(0, combinator_1.dup)((0, combinator_1.surround)('[', (0, combinator_1.some)((0, combinator_1.union)([htmlentity_1.unsafehtmlentity, bracket, source_1.txt]), ']', [[/^\\?\n/, 9]]), ']', true)), (0, combinator_1.dup)((0, combinator_1.surround)(/^{(?![{}])/, (0, combinator_1.inits)([link_1.uri, (0, combinator_1.some)(option)]), /^[^\S\n]*}/))]), ([as, bs]) => bs ? [[as.join('').trim() || as.join('')], bs] : [[''], as]), ([[text]]) => text === '' || text.trim() !== ''), ([[text], params], rest, context) => {
  const INSECURE_URI = params.shift();
  const url = new url_1.ReadonlyURL((0, link_1.resolve)(INSECURE_URI, context.host ?? global_1.location, context.url ?? context.host ?? global_1.location), context.host?.href || global_1.location.href);
  let cache;
  const el = global_1.undefined || (cache = context.caches?.media?.get(url.href)?.cloneNode(true)) || (0, dom_1.html)('img', {
    class: 'media',
    'data-src': url.source,
    alt: text
  });
  cache?.hasAttribute('alt') && cache?.setAttribute('alt', text);
  if (!sanitize(el, url, text)) return [[el], rest];
  (0, dom_1.define)(el, (0, html_1.attributes)('media', (0, array_1.push)([], el.classList), optspec, params));

  // Awaiting the generic support for attr().
  if (el.hasAttribute('aspect-ratio')) {
    el.style.aspectRatio = el.getAttribute('aspect-ratio');
  }

  if (context.state & 8
  /* State.link */
  ) return [[el], rest];
  if (cache && cache.tagName !== 'IMG') return (0, combinator_1.creation)(10, _ => [[el], rest])({
    source: '!',
    context
  });
  return (0, combinator_1.fmap)(link_1.unsafelink, ([link]) => [(0, dom_1.define)(link, {
    class: null,
    target: '_blank'
  }, [el])])({
    source: `{ ${INSECURE_URI}${params.join('')} }${rest}`,
    context
  });
}))))));
const bracket = (0, combinator_1.lazy)(() => (0, combinator_1.creation)((0, combinator_1.union)([(0, combinator_1.surround)((0, source_1.str)('('), (0, combinator_1.some)((0, combinator_1.union)([htmlentity_1.unsafehtmlentity, bracket, source_1.txt]), ')'), (0, source_1.str)(')'), true, global_1.undefined, ([as, bs = []], rest) => [(0, array_1.unshift)(as, bs), rest]), (0, combinator_1.surround)((0, source_1.str)('['), (0, combinator_1.some)((0, combinator_1.union)([htmlentity_1.unsafehtmlentity, bracket, source_1.txt]), ']'), (0, source_1.str)(']'), true, global_1.undefined, ([as, bs = []], rest) => [(0, array_1.unshift)(as, bs), rest]), (0, combinator_1.surround)((0, source_1.str)('{'), (0, combinator_1.some)((0, combinator_1.union)([htmlentity_1.unsafehtmlentity, bracket, source_1.txt]), '}'), (0, source_1.str)('}'), true, global_1.undefined, ([as, bs = []], rest) => [(0, array_1.unshift)(as, bs), rest]), (0, combinator_1.surround)((0, source_1.str)('"'), (0, combinator_1.precedence)(8, (0, combinator_1.some)((0, combinator_1.union)([htmlentity_1.unsafehtmlentity, source_1.txt]), '"')), (0, source_1.str)('"'), true)])));
const option = (0, combinator_1.union)([(0, combinator_1.fmap)((0, source_1.str)(/^[^\S\n]+[1-9][0-9]*x[1-9][0-9]*(?=[^\S\n]|})/), ([opt]) => [` width="${opt.slice(1).split('x')[0]}"`, ` height="${opt.slice(1).split('x')[1]}"`]), (0, combinator_1.fmap)((0, source_1.str)(/^[^\S\n]+[1-9][0-9]*:[1-9][0-9]*(?=[^\S\n]|})/), ([opt]) => [` aspect-ratio="${opt.slice(1).split(':').join('/')}"`]), link_1.option]);

function sanitize(target, uri, alt) {
  switch (uri.protocol) {
    case 'http:':
    case 'https:':
      if (/\/\.\.?(?:\/|$)/.test('/' + uri.source.slice(0, uri.source.search(/[?#]|$/)))) {
        (0, dom_1.define)(target, {
          class: void target.classList.add('invalid'),
          'data-invalid-syntax': 'media',
          'data-invalid-type': 'argument',
          'data-invalid-message': 'Dot-segments cannot be used in media paths; use subresource paths instead'
        });
        return false;
      }

      break;

    default:
      (0, dom_1.define)(target, {
        class: void target.classList.add('invalid'),
        'data-invalid-syntax': 'media',
        'data-invalid-type': 'argument',
        'data-invalid-message': 'Invalid protocol'
      });
      return false;
  }

  if (alt.includes('\x1B')) {
    (0, dom_1.define)(target, {
      class: void target.classList.add('invalid'),
      'data-invalid-syntax': 'media',
      'data-invalid-type': 'content',
      'data-invalid-message': `Cannot use invalid HTML entitiy "${alt.match(/&[0-9A-Za-z]+;/)[0]}"`,
      alt: target.getAttribute('alt')?.replace(/\x1B/g, '')
    });
    return false;
  }

  return true;
}

/***/ }),

/***/ 3555:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.reference = void 0;

const global_1 = __webpack_require__(4128);

const combinator_1 = __webpack_require__(2087);

const inline_1 = __webpack_require__(1160);

const source_1 = __webpack_require__(6743);

const visibility_1 = __webpack_require__(7618);

const util_1 = __webpack_require__(9437);

const dom_1 = __webpack_require__(3252);

exports.reference = (0, combinator_1.lazy)(() => (0, combinator_1.surround)('[[', (0, combinator_1.constraint)(64
/* State.reference */
, false, (0, combinator_1.syntax)(8192
/* Syntax.reference */
, 6, 1, 128
/* State.annotation */
| 64
/* State.reference */
| 4
/* State.media */
, (0, visibility_1.startLoose)((0, combinator_1.context)({
  delimiters: global_1.undefined
}, (0, combinator_1.subsequence)([abbr, (0, combinator_1.open)((0, source_1.stropt)(/^(?=\^)/), (0, combinator_1.some)(inline_1.inline, ']', [[/^\\?\n/, 9], [']', 2], [']]', 6]])), (0, combinator_1.some)(inline_1.inline, ']', [[/^\\?\n/, 9], [']', 2], [']]', 6]])])), ']'))), ']]', false, ([, ns], rest) => [[(0, dom_1.html)('sup', attributes(ns), [(0, dom_1.html)('span', (0, visibility_1.trimNode)((0, dom_1.defrag)(ns)))])], rest]));
const abbr = (0, combinator_1.creation)((0, combinator_1.bind)((0, combinator_1.surround)('^', (0, combinator_1.union)([(0, source_1.str)(/^(?![0-9]+\s?[|\]])[0-9A-Za-z]+(?:(?:-|(?=\W)(?!'\d)'?(?!\.\d)\.?(?!,\S),? ?)[0-9A-Za-z]+)*(?:-|'?\.?,? ?)?/)]), /^\|?(?=]])|^\|[^\S\n]*/), ([source], rest) => [[(0, dom_1.html)('abbr', source)], rest.replace(visibility_1.regBlankStart, '')]));

function attributes(ns) {
  return typeof ns[0] === 'object' && ns[0].tagName === 'ABBR' ? {
    class: 'reference',
    'data-abbr': (0, util_1.stringify)([ns.shift()]).trimEnd()
  } : ns[0] === '' ? {
    class: 'invalid',
    'data-invalid-syntax': 'reference',
    'data-invalid-type': 'syntax',
    'data-invalid-message': 'Invalid abbr'
  } : {
    class: 'reference'
  };
}

/***/ }),

/***/ 6705:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.ruby = void 0;

const global_1 = __webpack_require__(4128);

const parser_1 = __webpack_require__(6728);

const combinator_1 = __webpack_require__(2087);

const htmlentity_1 = __webpack_require__(1562);

const source_1 = __webpack_require__(6743);

const visibility_1 = __webpack_require__(7618);

const array_1 = __webpack_require__(8112);

const dom_1 = __webpack_require__(3252);

exports.ruby = (0, combinator_1.lazy)(() => (0, combinator_1.validate)('[', (0, combinator_1.syntax)(512
/* Syntax.ruby */
, 2, 1, -1
/* State.all */
, (0, combinator_1.fmap)((0, combinator_1.verify)((0, combinator_1.fmap)((0, combinator_1.sequence)([(0, combinator_1.surround)('[', (0, source_1.str)(/^(?:\\[^\n]|[^\\[\](){}"\n])+/), ']'), (0, combinator_1.surround)('(', (0, source_1.str)(/^(?:\\[^\n]|[^\\[\](){}"\n])+/), ')')]), ([texts, rubies], _, context) => [(0, parser_1.eval)(text({
  source: texts,
  context
}), [])[0] ?? '', (0, parser_1.eval)(text({
  source: rubies,
  context
}), [])[0] ?? '']), ([texts, rubies]) => texts && rubies && (0, visibility_1.isStartTightNodes)(texts)), ([texts, rubies]) => {
  texts[texts.length - 1] === '' && texts.pop();

  switch (true) {
    case rubies.length <= texts.length:
      return [(0, dom_1.html)('ruby', attributes(texts, rubies), (0, dom_1.defrag)(texts.reduce((acc, _, i) => (0, array_1.push)(acc, (0, array_1.unshift)([texts[i]], i < rubies.length && rubies[i] ? [(0, dom_1.html)('rp', '('), (0, dom_1.html)('rt', rubies[i]), (0, dom_1.html)('rp', ')')] : [(0, dom_1.html)('rt')])), [])))];

    case texts.length === 1 && [...texts[0]].length >= rubies.length:
      return [(0, dom_1.html)('ruby', attributes(texts, rubies), (0, dom_1.defrag)([...texts[0]].reduce((acc, _, i, texts) => (0, array_1.push)(acc, (0, array_1.unshift)([texts[i]], i < rubies.length && rubies[i] ? [(0, dom_1.html)('rp', '('), (0, dom_1.html)('rt', rubies[i]), (0, dom_1.html)('rp', ')')] : [(0, dom_1.html)('rt')])), [])))];

    default:
      return [(0, dom_1.html)('ruby', attributes(texts, rubies), (0, dom_1.defrag)((0, array_1.unshift)([texts.join(' ')], [(0, dom_1.html)('rp', '('), (0, dom_1.html)('rt', rubies.join(' ').trim()), (0, dom_1.html)('rp', ')')])))];
  }
}))));
const text = (0, combinator_1.creation)(1, false, ({
  source,
  context
}) => {
  const acc = [''];

  while (source !== '') {
    switch (source[0]) {
      // @ts-expect-error
      case '&':
        {
          const result = (0, htmlentity_1.unsafehtmlentity)({
            source,
            context
          });

          if (result) {
            acc[acc.length - 1] += (0, parser_1.eval)(result)[0];
            source = (0, parser_1.exec)(result, source.slice(1));
            continue;
          } // fallthrough

        }

      default:
        {
          if (source[0].trimStart() === '') {
            acc.push('');
            source = source.slice(1);
            continue;
          }

          const result = (0, source_1.text)({
            source,
            context
          });
          acc[acc.length - 1] += (0, parser_1.eval)(result)[0] ?? source.slice(0, source.length - (0, parser_1.exec)(result).length);
          source = (0, parser_1.exec)(result);
          continue;
        }
    }
  }

  return acc.join('').trimStart() ? [[acc], ''] : global_1.undefined;
});

function attributes(texts, rubies) {
  let attrs;

  for (const ss of [texts, rubies]) {
    for (let i = 0; i < ss.length; ++i) {
      if (ss[i].indexOf('\x1B') === -1) continue;
      ss[i] = ss[i].replace(/\x1B/g, '');
      attrs ??= {
        class: 'invalid',
        'data-invalid-syntax': 'ruby',
        'data-invalid-type': ss === texts ? 'content' : 'argument',
        'data-invalid-message': 'Invalid HTML entity'
      };
    }
  }

  return attrs ?? {};
}

/***/ }),

/***/ 4189:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.shortmedia = void 0;

const combinator_1 = __webpack_require__(2087);

const url_1 = __webpack_require__(4318);

const media_1 = __webpack_require__(1303);

exports.shortmedia = (0, combinator_1.rewrite)((0, combinator_1.constraint)(4
/* State.media */
, false, (0, combinator_1.open)('!', url_1.url)), (0, combinator_1.convert)(source => `!{ ${source.slice(1)} }`, (0, combinator_1.union)([media_1.media])));

/***/ }),

/***/ 8072:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.strong = void 0;

const combinator_1 = __webpack_require__(2087);

const inline_1 = __webpack_require__(1160);

const source_1 = __webpack_require__(6743);

const visibility_1 = __webpack_require__(7618);

const array_1 = __webpack_require__(8112);

const dom_1 = __webpack_require__(3252);

exports.strong = (0, combinator_1.lazy)(() => (0, combinator_1.surround)((0, source_1.str)('*', '*'), (0, combinator_1.syntax)(0
/* Syntax.none */
, 1, 1, 0
/* State.none */
, (0, visibility_1.startTight)((0, combinator_1.some)((0, combinator_1.union)([(0, combinator_1.some)(inline_1.inline, (0, visibility_1.blankWith)('*')), (0, combinator_1.open)((0, combinator_1.some)(inline_1.inline, '*'), exports.strong)])))), (0, source_1.str)('*'), false, ([, bs], rest) => [[(0, dom_1.html)('strong', (0, dom_1.defrag)(bs))], rest], ([as, bs], rest) => [(0, array_1.unshift)(as, bs), rest]));

/***/ }),

/***/ 4695:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.template = void 0;

const global_1 = __webpack_require__(4128);

const combinator_1 = __webpack_require__(2087);

const source_1 = __webpack_require__(6743);

const array_1 = __webpack_require__(8112);

const dom_1 = __webpack_require__(3252);

exports.template = (0, combinator_1.lazy)(() => (0, combinator_1.surround)('{{', (0, combinator_1.syntax)(0
/* Syntax.none */
, 2, 1, -1
/* State.all */
, (0, combinator_1.some)((0, combinator_1.union)([bracket, source_1.escsource]), '}')), '}}', true, ([, ns = []], rest) => [[(0, dom_1.html)('span', {
  class: 'template'
}, `{{${ns.join('').replace(/\x1B/g, '')}}}`)], rest]));
const bracket = (0, combinator_1.lazy)(() => (0, combinator_1.creation)((0, combinator_1.union)([(0, combinator_1.surround)((0, source_1.str)('('), (0, combinator_1.some)((0, combinator_1.union)([bracket, source_1.escsource]), ')'), (0, source_1.str)(')'), true, global_1.undefined, ([as, bs = []], rest) => [(0, array_1.unshift)(as, bs), rest]), (0, combinator_1.surround)((0, source_1.str)('['), (0, combinator_1.some)((0, combinator_1.union)([bracket, source_1.escsource]), ']'), (0, source_1.str)(']'), true, global_1.undefined, ([as, bs = []], rest) => [(0, array_1.unshift)(as, bs), rest]), (0, combinator_1.surround)((0, source_1.str)('{'), (0, combinator_1.some)((0, combinator_1.union)([bracket, source_1.escsource]), '}'), (0, source_1.str)('}'), true, global_1.undefined, ([as, bs = []], rest) => [(0, array_1.unshift)(as, bs), rest]), (0, combinator_1.surround)((0, source_1.str)('"'), (0, combinator_1.precedence)(8, (0, combinator_1.some)(source_1.escsource, /^"|^\\?\n/)), (0, source_1.str)('"'), true)])));

/***/ }),

/***/ 5485:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.localize = void 0;

const combinator_1 = __webpack_require__(2087);

const ja_1 = __webpack_require__(1499);

const dom_1 = __webpack_require__(3252);

const query_1 = __webpack_require__(6120);

function localize(parser) {
  return (0, combinator_1.fmap)(parser, ns => {
    if (ns.length === 0) return ns;
    const el = ns.length === 1 && typeof ns[0] === 'object' ? ns[0] : (0, dom_1.html)('div', ns);

    for (let es = (0, query_1.querySelectorAll)(el, '.linebreak:not(:empty)'), i = 0; i < es.length; ++i) {
      const el = es[i];
      if (!check(el)) continue;
      el.firstChild.remove();
    }

    return ns;
  });
}

exports.localize = localize;

function check(el) {
  const char = lastChar(el);
  if (!char) return false;
  return (0, ja_1.japanese)(char);
}

function lastChar(node) {
  while (node = node?.previousSibling) {
    if (!('id' in node)) return [...node.data.slice(-2)].pop() ?? '';
    if (node.firstChild) return [...text(node).slice(-2)].pop() ?? '';

    switch (node.tagName) {
      case 'BR':
        return '';

      case 'SPAN':
        switch (node.className) {
          case 'linebreak':
            return '';
        }

    }
  }

  return '';
}

function text(el) {
  switch (el.tagName) {
    case 'RUBY':
      for (let ns = el.childNodes, i = ns.length; i--;) {
        const child = ns[i];
        if ('id' in child) continue;
        return child.data;
      }

      return '';

    default:
      return el.textContent;
  }
}

/***/ }),

/***/ 1499:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.japanese = void 0;

function japanese(char) {
  return /^[\p{Ideo}\p{scx=Hiragana}\p{scx=Katakana}～！？]/u.test(char);
}

exports.japanese = japanese;

/***/ }),

/***/ 9123:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.figure = void 0;

const global_1 = __webpack_require__(4128);

const label_1 = __webpack_require__(466);

const multimap_1 = __webpack_require__(940);

const array_1 = __webpack_require__(8112);

const dom_1 = __webpack_require__(3252);

const query_1 = __webpack_require__(6120);

function* figure(target, footnotes, opts = {}) {
  const refs = new multimap_1.MultiMap((0, array_1.push)((0, query_1.querySelectorAll)(target, 'a.label:not(.disabled)[data-label]'), footnotes && (0, query_1.querySelectorAll)(footnotes.references, 'a.label:not(.disabled)') || []).map(el => [el.getAttribute('data-label'), el]));
  const labels = new global_1.Set();
  const numbers = new global_1.Map();
  let base = '0';
  let bases = base.split('.');
  let index = bases; // Bug: Firefox
  //for (let defs = querySelectorAll(target, ':scope > figure[data-label], :scope > h1, :scope > h2'), len = defs.length, i = 0; i < len; ++i) {

  for (let defs = (0, query_1.querySelectorAll)(target, 'figure[data-label], h1, h2'), len = defs.length, i = 0; i < len; ++i) {
    yield;
    const def = defs[i];
    if (def.parentNode !== target) continue;
    const {
      tagName
    } = def;
    if (bases.length === 1 && tagName[0] === 'H') continue;
    const label = tagName === 'FIGURE' ? def.getAttribute('data-label') : `$-${increment(index, def)}`;
    if (label.endsWith('-')) continue;

    if (label.endsWith('-0')) {
      (0, dom_1.define)(def, {
        class: void def.classList.add('invalid'),
        'data-invalid-syntax': 'figure',
        'data-invalid-type': 'argument',
        'data-invalid-message': 'Invalid base index',
        hidden: null
      });
      continue;
    }

    if (tagName === 'FIGURE' && label.endsWith('.0')) {
      // $-x.x.0 is disabled.
      if (label.lastIndexOf('.', label.length - 3) !== -1) {
        (0, dom_1.define)(def, {
          class: void def.classList.add('invalid'),
          'data-invalid-syntax': 'figure',
          'data-invalid-type': 'argument',
          'data-invalid-message': 'Base index must be $-x.0 format',
          hidden: null
        });
        continue;
      } // $-x.0 after h1-h6.


      if (!/^H[1-6]$/.test(def.previousElementSibling?.tagName ?? '')) {
        (0, dom_1.define)(def, {
          class: void def.classList.add('invalid'),
          'data-invalid-syntax': 'figure',
          'data-invalid-type': 'position',
          'data-invalid-message': messages.declaration,
          hidden: null
        });
        continue;
      } else if (def.getAttribute('data-invalid-message') === messages.declaration) {
        (0, dom_1.define)(def, {
          class: void def.classList.remove('invalid'),
          'data-invalid-syntax': null,
          'data-invalid-type': null,
          'data-invalid-message': null,
          hidden: ''
        });
      }
    }

    const group = label.split('-', 1)[0];
    let number = (0, label_1.number)(label, numbers.has(group) && !(0, label_1.isFixed)(label) ? numbers.get(group).split('.').slice(0, bases.length).join('.') : base);

    if (number.endsWith('.0')) {
      if (group !== '$' || tagName === 'FIGURE' && def.firstChild) continue;

      if (number.startsWith('0.')) {
        number = index.slice(0).reduce((ns, _, i, xs) => {
          i === ns.length ? xs.length = i : ns[i] = +ns[i] > +xs[i] ? ns[i] : +ns[i] === 0 ? xs[i] : `${+xs[i] + 1}`;
          return ns;
        }, number.split('.')).join('.');
      }

      base = number;
      bases = index = base.split('.');
      tagName !== 'FIGURE' && numbers.clear();
      continue;
    }

    !(0, label_1.isFixed)(label) && numbers.set(group, number);
    const figindex = group === '$' ? `(${number})` : `${capitalize(group)}${group === 'fig' ? '.' : ''} ${number}`;
    (0, dom_1.define)(def.querySelector(':scope > figcaption > .figindex'), group === '$' ? figindex : `${figindex}. `);

    if (labels.has(label)) {
      if (def.classList.contains('invalid')) continue;
      (0, dom_1.define)(def, {
        id: null,
        class: void def.classList.add('invalid'),
        'data-invalid-syntax': 'figure',
        'data-invalid-type': 'argument',
        'data-invalid-message': messages.duplicate
      });
      continue;
    } else if (def.getAttribute('data-invalid-message') === messages.duplicate) {
      (0, dom_1.define)(def, {
        class: void def.classList.remove('invalid'),
        'data-invalid-syntax': null,
        'data-invalid-type': null,
        'data-invalid-message': null
      });
    }

    labels.add(label);
    opts.id !== '' && def.setAttribute('id', `label:${opts.id ? `${opts.id}:` : ''}${label}`);

    for (let rs = refs.take(label, global_1.Infinity), i = 0; i < rs.length; ++i) {
      const ref = rs[i];

      if (ref.getAttribute('data-invalid-message') === messages.reference) {
        (0, dom_1.define)(ref, {
          class: void ref.classList.remove('invalid'),
          'data-invalid-syntax': null,
          'data-invalid-type': null,
          'data-invalid-message': null
        });
      }

      if (ref.hash.slice(1) === def.id && ref.innerText === figindex) continue;
      yield (0, dom_1.define)(ref, opts.id !== '' ? {
        href: `#${def.id}`
      } : {
        class: `${ref.className} disabled`
      }, figindex);
    }
  }

  for (const [, ref] of refs) {
    if (opts.id !== '' && !ref.classList.contains('invalid')) {
      (0, dom_1.define)(ref, {
        class: void ref.classList.add('invalid'),
        'data-invalid-syntax': 'label',
        'data-invalid-type': 'reference',
        'data-invalid-message': messages.reference
      });
    }

    yield ref;
  }

  return;
}

exports.figure = figure;
const messages = {
  declaration: 'Base index declarations must be after level 1 to 6 headings',
  duplicate: 'Duplicate label',
  reference: 'Missing the target figure'
};

function increment(bases, el) {
  const index = (+el.tagName[1] - 1 || 1) - 1;
  return index + 1 < bases.length ? bases.slice(0, index + 2).map((v, i) => {
    switch (true) {
      case i < index:
        return v;

      case i === index:
        return +v + 1;

      default:
        return 0;
    }
  }).join('.') : '';
}

function capitalize(label) {
  return label[0].toUpperCase() + label.slice(1);
}

/***/ }),

/***/ 7529:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.reference = exports.annotation = exports.footnote = void 0;

const global_1 = __webpack_require__(4128);

const indexee_1 = __webpack_require__(1269);

const multimap_1 = __webpack_require__(940);

const dom_1 = __webpack_require__(3252);

const query_1 = __webpack_require__(6120);

function* footnote(target, footnotes, opts = {}, bottom = null) {
  // Bug: Firefox
  //querySelectorAll(target, `:scope > .annotations`).forEach(el => el.remove());
  for (let es = (0, query_1.querySelectorAll)(target, `.annotations`), i = 0; i < es.length; ++i) {
    const el = es[i];
    el.parentNode === target && el.remove();
  }

  yield* (0, exports.reference)(target, footnotes?.references, opts, bottom);
  yield* (0, exports.annotation)(target, footnotes?.annotations, opts, bottom);
  return;
}

exports.footnote = footnote;
exports.annotation = build('annotation', n => `*${n}`, 'h1, h2, h3, h4, h5, h6, aside.aside, hr');
exports.reference = build('reference', (n, abbr) => `[${abbr || n}]`);

function build(syntax, marker, splitter) {
  // Referenceを含むAnnotationの重複排除は両構文が互いに処理済みであることを必要とするため
  // 構文ごとに各1回の処理では不可能
  return function* (target, footnote, opts = {}, bottom = null) {
    const defs = new global_1.Map();
    const buffer = new multimap_1.MultiMap();
    const titles = new global_1.Map(); // Bug: Firefox
    //const splitters = push([], querySelectorAll(target, `:scope > :is(${splitter ?? '_'})`));

    const splitters = [];

    for (let es = (0, query_1.querySelectorAll)(target, splitter ?? '_'), i = 0; i < es.length; ++i) {
      const el = es[i];
      el.parentNode === target && splitters.push(el);
    }

    let count = 0;
    let total = 0;
    let style;

    for (let refs = (0, query_1.querySelectorAll)(target, `sup.${syntax}:not(.disabled)`), len = refs.length, i = 0; i < len; ++i) {
      yield;
      const ref = refs[i];

      while (+splitters[0]?.compareDocumentPosition(ref) & global_1.Node.DOCUMENT_POSITION_FOLLOWING) {
        if (defs.size > 0) {
          total += defs.size;
          yield* proc(defs, target.insertBefore((0, dom_1.html)('ol', {
            class: `${syntax}s`
          }), splitters[0] ?? null));
        }

        splitters.shift();
      }

      const identifier = `${+!ref.querySelector('.label')}:${ref.getAttribute('data-abbr') || '_' + ref.firstElementChild.innerHTML}`;
      const abbr = ref.getAttribute('data-abbr') || global_1.undefined;
      const content = (0, dom_1.frag)(ref.firstElementChild.cloneNode(true).childNodes);
      style ??= abbr ? 'abbr' : 'count';

      if (style === 'count' ? abbr : !abbr) {
        (0, dom_1.define)(ref, {
          class: void ref.classList.add('invalid'),
          'data-invalid-syntax': syntax,
          'data-invalid-type': 'style',
          'data-invalid-message': `${syntax[0].toUpperCase() + syntax.slice(1)} style must be consistent`
        });
      } else if (ref.getAttribute('data-invalid-type') === 'style') {
        (0, dom_1.define)(ref, {
          class: void ref.classList.remove('invalid'),
          'data-invalid-syntax': null,
          'data-invalid-type': null,
          'data-invalid-message': null
        });
      }

      if (!ref.firstElementChild.hasAttribute('hidden')) {
        ref.firstElementChild.setAttribute('hidden', '');
      } else {
        ref.lastChild?.remove();
      }

      const title = global_1.undefined || titles.get(identifier) || +identifier[0] && ref.title || (0, indexee_1.text)(content).trim() || content.textContent.trim() || global_1.undefined;
      title ? !titles.has(identifier) && titles.set(identifier, title) : buffer.set(identifier, ref);
      const blank = !!abbr && !content.firstChild;
      const refIndex = ++count;
      const refId = opts.id !== '' ? ref.id || `${syntax}:${opts.id ? `${opts.id}:` : ''}ref:${refIndex}` : global_1.undefined;
      const def = global_1.undefined || defs.get(identifier) || defs.set(identifier, (0, dom_1.html)('li', {
        id: opts.id !== '' ? `${syntax}:${opts.id ? `${opts.id}:` : ''}def:${total + defs.size + 1}` : global_1.undefined,
        'data-marker': !footnote ? marker(total + defs.size + 1, abbr) : global_1.undefined
      }, [content.cloneNode(true), (0, dom_1.html)('sup')])).get(identifier);

      if (title && !blank && def.childNodes.length === 1) {
        def.insertBefore(content.cloneNode(true), def.lastChild);

        for (let refs = buffer.take(identifier, global_1.Infinity), i = 0; i < refs.length; ++i) {
          const ref = refs[i];
          if (ref.getAttribute('data-invalid-type') !== 'content') continue;
          (0, dom_1.define)(ref, {
            title,
            class: void ref.classList.remove('invalid'),
            'data-invalid-syntax': null,
            'data-invalid-type': null,
            'data-invalid-message': null
          });
        }
      }

      const defIndex = +def.id.slice(def.id.lastIndexOf(':') + 1) || total + defs.size;
      const defId = def.id || global_1.undefined;
      (0, dom_1.define)(ref, {
        id: refId,
        class: opts.id !== '' ? global_1.undefined : `${ref.className} disabled`,
        ...(title ? {
          title
        } : {
          class: void ref.classList.add('invalid'),
          'data-invalid-syntax': syntax,
          'data-invalid-type': 'content',
          'data-invalid-message': 'Missing the content'
        })
      });
      yield ref.appendChild((0, dom_1.html)('a', {
        href: refId && defId && `#${defId}`
      }, marker(defIndex, abbr)));
      def.lastChild.appendChild((0, dom_1.html)('a', {
        href: refId && `#${refId}`,
        title: abbr && !blank ? title : global_1.undefined
      }, `^${refIndex}`));
    }

    if (defs.size > 0 || footnote) {
      yield* proc(defs, footnote ?? target.insertBefore((0, dom_1.html)('ol', {
        class: `${syntax}s`
      }), splitters[0] ?? bottom));
    }

    return;
  };

  function* proc(defs, footnote) {
    const {
      children
    } = footnote;
    const size = defs.size;
    let count = 0;
    let length = children.length;

    I: for (const [key, def] of defs) {
      defs.delete(key);
      ++count;

      while (length > size) {
        const node = children[count - 1];
        if (equal(node, def)) continue I;
        yield footnote.removeChild(node);
        --length;
      }

      const node = count <= length ? children[count - 1] : null;
      if (node && equal(node, def)) continue;
      yield footnote.insertBefore(def, node);
      ++length;
    }

    while (length > size) {
      yield footnote.removeChild(children[size]);
      --length;
    }

    return;
  }
}

function equal(a, b) {
  return a.id === b.id && a.innerHTML === b.innerHTML;
}

/***/ }),

/***/ 9002:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.validate = exports.segment = exports.MAX_INPUT_SIZE = exports.MAX_SEGMENT_SIZE = void 0;

const global_1 = __webpack_require__(4128);

const parser_1 = __webpack_require__(6728);

const combinator_1 = __webpack_require__(2087);

const heading_1 = __webpack_require__(4623);

const codeblock_1 = __webpack_require__(1849);

const mathblock_1 = __webpack_require__(3754);

const extension_1 = __webpack_require__(4751);

const source_1 = __webpack_require__(6743);

exports.MAX_SEGMENT_SIZE = 100000; // 100,000 bytes (Max value size of FDB)

exports.MAX_INPUT_SIZE = exports.MAX_SEGMENT_SIZE * 10;
const parser = (0, combinator_1.union)([heading_1.segment, codeblock_1.segment, mathblock_1.segment, extension_1.segment, (0, combinator_1.some)(source_1.contentline, exports.MAX_SEGMENT_SIZE * 2), (0, combinator_1.some)(source_1.emptyline, exports.MAX_SEGMENT_SIZE * 2)]);

function* segment(source) {
  if (!validate(source, exports.MAX_INPUT_SIZE)) return yield `\x07Too large input over ${exports.MAX_INPUT_SIZE.toLocaleString('en')} bytes.\n${source.slice(0, 1001)}`;

  while (source !== '') {
    const result = parser({
      source,
      context: {}
    });
    const rest = (0, parser_1.exec)(result);
    const segs = (0, parser_1.eval)(result).length ? (0, parser_1.eval)(result) : [source.slice(0, source.length - rest.length)];

    for (let i = 0; i < segs.length; ++i) {
      const seg = segs[i];
      validate(seg, exports.MAX_SEGMENT_SIZE) ? yield seg : yield `\x07Too large segment over ${exports.MAX_SEGMENT_SIZE.toLocaleString('en')} bytes.\n${seg}`;
    }

    source = rest;
  }
}

exports.segment = segment;

function validate(source, size) {
  return source.length <= size / 4 || source.length <= size && new global_1.Blob([source]).size <= size;
}

exports.validate = validate;

/***/ }),

/***/ 6743:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.anyline = exports.emptyline = exports.contentline = exports.stropt = exports.str = exports.unescsource = exports.escsource = exports.linebreak = exports.txt = exports.text = void 0;

var text_1 = __webpack_require__(7763);

Object.defineProperty(exports, "text", ({
  enumerable: true,
  get: function () {
    return text_1.text;
  }
}));
Object.defineProperty(exports, "txt", ({
  enumerable: true,
  get: function () {
    return text_1.txt;
  }
}));
Object.defineProperty(exports, "linebreak", ({
  enumerable: true,
  get: function () {
    return text_1.linebreak;
  }
}));

var escapable_1 = __webpack_require__(8431);

Object.defineProperty(exports, "escsource", ({
  enumerable: true,
  get: function () {
    return escapable_1.escsource;
  }
}));

var unescapable_1 = __webpack_require__(8380);

Object.defineProperty(exports, "unescsource", ({
  enumerable: true,
  get: function () {
    return unescapable_1.unescsource;
  }
}));

var str_1 = __webpack_require__(2790);

Object.defineProperty(exports, "str", ({
  enumerable: true,
  get: function () {
    return str_1.str;
  }
}));
Object.defineProperty(exports, "stropt", ({
  enumerable: true,
  get: function () {
    return str_1.stropt;
  }
}));

var line_1 = __webpack_require__(5034);

Object.defineProperty(exports, "contentline", ({
  enumerable: true,
  get: function () {
    return line_1.contentline;
  }
}));
Object.defineProperty(exports, "emptyline", ({
  enumerable: true,
  get: function () {
    return line_1.emptyline;
  }
}));
Object.defineProperty(exports, "anyline", ({
  enumerable: true,
  get: function () {
    return line_1.anyline;
  }
}));

/***/ }),

/***/ 8431:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.escsource = void 0;

const combinator_1 = __webpack_require__(2087);

const text_1 = __webpack_require__(7763);

const delimiter = /[\s\x00-\x2F\x3A-\x40\x5B-\x60\x7B-\x7F]/;
exports.escsource = (0, combinator_1.creation)(1, false, ({
  source
}) => {
  if (source === '') return;
  const i = source.search(delimiter);

  switch (i) {
    case -1:
      return [[source], ''];

    case 0:
      switch (source[0]) {
        case '\x1B':
          return [[source.slice(1, 2)], source.slice(2)];

        case '\\':
          return [[source.slice(0, 2)], source.slice(2)];

        default:
          const b = source[0] !== '\n' && source[0].trimStart() === '';
          const i = b ? source.search(text_1.nonWhitespace) : 1;
          return [[source.slice(0, i - +b || 1)], source.slice(i - +b || 1)];
      }

    default:
      return [[source.slice(0, i)], source.slice(i)];
  }
});

/***/ }),

/***/ 5034:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.contentline = exports.emptyline = exports.anyline = void 0;

const global_1 = __webpack_require__(4128);

const combinator_1 = __webpack_require__(2087);

exports.anyline = (0, combinator_1.line)(() => [[], '']);
exports.emptyline = (0, combinator_1.line)(i => (0, combinator_1.isEmpty)(i.source) ? [[], ''] : global_1.undefined);
exports.contentline = (0, combinator_1.line)(i => !(0, combinator_1.isEmpty)(i.source) ? [[], ''] : global_1.undefined);

/***/ }),

/***/ 2790:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.stropt = exports.str = void 0;

const global_1 = __webpack_require__(4128);

const combinator_1 = __webpack_require__(2087);

function str(pattern, not) {
  return typeof pattern === 'string' ? (0, combinator_1.creation)(1, false, ({
    source
  }) => {
    if (source === '') return;
    if (not && source.slice(pattern.length, pattern.length + not.length) === not) return;
    return source.slice(0, pattern.length) === pattern ? [[pattern], source.slice(pattern.length)] : global_1.undefined;
  }) : (0, combinator_1.creation)(1, false, ({
    source
  }) => {
    if (source === '') return;
    const m = source.match(pattern);
    if (m && not && source.slice(m[0].length, m[0].length + not.length) === not) return;
    return m && m[0].length > 0 ? [[m[0]], source.slice(m[0].length)] : global_1.undefined;
  });
}

exports.str = str;

function stropt(pattern) {
  return typeof pattern === 'string' ? (0, combinator_1.creation)(1, false, ({
    source
  }) => {
    if (source === '') return;
    return source.slice(0, pattern.length) === pattern ? [[pattern], source.slice(pattern.length)] : global_1.undefined;
  }) : (0, combinator_1.creation)(1, false, ({
    source
  }) => {
    if (source === '') return;
    const m = source.match(pattern);
    return m ? [[m[0]], source.slice(m[0].length)] : global_1.undefined;
  });
}

exports.stropt = stropt;

/***/ }),

/***/ 7763:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.isAlphanumeric = exports.linebreak = exports.txt = exports.text = exports.nonAlphanumeric = exports.nonWhitespace = exports.delimiter = void 0;

const global_1 = __webpack_require__(4128);

const combinator_1 = __webpack_require__(2087);

const str_1 = __webpack_require__(2790);

const dom_1 = __webpack_require__(3252);

exports.delimiter = /[\s\x00-\x7F]|\S[#>]|[\p{Ideo}\p{scx=Hiragana}\p{scx=Katakana}～！？][^\S\n]*(?=\\\n)/u;
exports.nonWhitespace = /[\S\n]|$/;
exports.nonAlphanumeric = /[^0-9A-Za-z]|\S[#>]|$/;
const nssb = /^[\p{Ideo}\p{scx=Hiragana}\p{scx=Katakana}～！？][^\S\n]*(?=\\\n)/u;
const repeat = (0, str_1.str)(/^(.)\1*/);
exports.text = (0, combinator_1.creation)(1, false, ({
  source,
  context
}) => {
  if (source === '') return;
  const i = source.search(exports.delimiter);

  switch (i) {
    case -1:
      return [[source], ''];

    case 0:
      switch (source[0]) {
        case '\x1B':
        case '\\':
          if (!nssb.test(source.slice(1))) break;
          return (0, exports.text)({
            source: source.slice(1),
            context
          });

        default:
          const i = source.match(nssb)?.[0].length ?? -1;
          if (i !== -1) return [[source[0], (0, dom_1.html)('span', {
            class: 'linebreak'
          })], source.slice(i + 2)];
      }

      switch (source[0]) {
        case '\x1B':
        case '\\':
          switch (source[1]) {
            case global_1.undefined:
              return [[], ''];

            case '\n':
              return [[(0, dom_1.html)('span', {
                class: 'linebreak'
              }, ' ')], source.slice(2)];

            default:
              return [[source.slice(1, 2)], source.slice(2)];
          }

        case '\n':
          return [[(0, dom_1.html)('br')], source.slice(1)];

        case '_':
        case '*':
        case '+':
        case '~':
        case '=':
        case '`':
          return source[1] === source[0] ? repeat({
            source,
            context
          }) : [[source[0]], source.slice(1)];

        default:
          const b = source[0].trimStart() === '';
          const i = b || isAlphanumeric(source[0]) ? source.search(b ? exports.nonWhitespace : exports.nonAlphanumeric) || 1 : 1;
          return b && i === source.length || b && source[i] === '\n' || b && source[i] === '\\' && source[i + 1] === '\n' ? [[], source.slice(i)] : [[source.slice(0, i - +b || 1)], source.slice(i - +b || 1)];
      }

    default:
      return [[source.slice(0, i)], source.slice(i)];
  }
});
exports.txt = (0, combinator_1.union)([exports.text]);
exports.linebreak = (0, combinator_1.focus)('\n', (0, combinator_1.union)([exports.text]));

function isAlphanumeric(char) {
  if (char < '0' || '\x7F' < char) return false;
  return '0' <= char && char <= '9' || 'a' <= char && char <= 'z' || 'A' <= char && char <= 'Z';
}

exports.isAlphanumeric = isAlphanumeric;

/***/ }),

/***/ 8380:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.unescsource = void 0;

const combinator_1 = __webpack_require__(2087);

const text_1 = __webpack_require__(7763);

exports.unescsource = (0, combinator_1.creation)(1, false, ({
  source
}) => {
  if (source === '') return;
  const i = source.search(text_1.delimiter);

  switch (i) {
    case -1:
      return [[source], ''];

    case 0:
      {
        const b = source[0] !== '\n' && source[0].trimStart() === '';
        const i = b || (0, text_1.isAlphanumeric)(source[0]) ? source.search(b ? text_1.nonWhitespace : text_1.nonAlphanumeric) || 1 : 1;
        return [[source.slice(0, i - +b || 1)], source.slice(i - +b || 1)];
      }

    default:
      return [[source.slice(0, i)], source.slice(i)];
  }
});

/***/ }),

/***/ 9437:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.stringify = void 0;

function stringify(nodes) {
  let acc = '';

  for (let i = 0; i < nodes.length; ++i) {
    const node = nodes[i];

    if (typeof node === 'string') {
      acc += node;
    } else {
      // NOTE: Doesn't reflect line breaks.
      acc += node.innerText;
    }
  }

  return acc;
}

exports.stringify = stringify;

/***/ }),

/***/ 7618:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.trimNode = exports.trimBlankEnd = exports.trimBlankStart = exports.trimBlank = exports.isStartTightNodes = exports.isStartLooseNodes = exports.startTight = exports.startLoose = exports.blankWith = exports.regBlankStart = exports.visualize = void 0;

const global_1 = __webpack_require__(4128);

const parser_1 = __webpack_require__(6728);

const combinator_1 = __webpack_require__(2087);

const htmlentity_1 = __webpack_require__(1562);

const source_1 = __webpack_require__(6743);

const normalize_1 = __webpack_require__(185);

const memoize_1 = __webpack_require__(1808);

const array_1 = __webpack_require__(8112);

function visualize(parser) {
  const blankline = new RegExp(/^(?:\\$|\\?[^\S\n]|&IHN;|<wbr[^\S\n]*>)+$/.source.replace('IHN', `(?:${normalize_1.invisibleHTMLEntityNames.join('|')})`), 'gm');
  return (0, combinator_1.union)([(0, combinator_1.convert)(source => source.replace(blankline, line => line.replace(/[\\&<]/g, '\x1B$&')), (0, combinator_1.verify)(parser, (ns, rest, context) => !rest && hasVisible(ns, context))), (0, combinator_1.some)((0, combinator_1.union)([source_1.linebreak, source_1.unescsource]))]);
}

exports.visualize = visualize;

function hasVisible(nodes, {
  state = 0
} = {}) {
  for (let i = 0; i < nodes.length; ++i) {
    const node = nodes[i];

    if (typeof node === 'string') {
      if (node && node.trimStart()) return true;
    } else {
      if (node.innerText.trimStart()) return true;
      if (state & 4
      /* State.media */
      ^ 4
      /* State.media */
      && (node.classList.contains('media') || node.getElementsByClassName('media')[0])) return true;
    }
  }

  return false;
}

exports.regBlankStart = new RegExp(/^(?:\\?[^\S\n]|&IHN;|<wbr[^\S\n]*>)+/.source.replace('IHN', `(?:${normalize_1.invisibleHTMLEntityNames.join('|')})`));

function blankWith(starting, delimiter) {
  if (delimiter === global_1.undefined) return blankWith('', starting);
  return new RegExp(String.raw`^(?:(?=${starting})(?:\\?\s|&(?:${normalize_1.invisibleHTMLEntityNames.join('|')});|<wbr[^\S\n]*>)${starting && '+'})?${typeof delimiter === 'string' ? delimiter.replace(/[*+()\[\]]/g, '\\$&') : delimiter.source}`);
}

exports.blankWith = blankWith;

function startLoose(parser, except) {
  return input => isStartLoose(input, except) ? parser(input) : global_1.undefined;
}

exports.startLoose = startLoose;
const isStartLoose = (0, memoize_1.reduce)(({
  source,
  context
}, except) => {
  return isStartTight({
    source: source.replace(exports.regBlankStart, ''),
    context
  }, except);
}, ({
  source
}, except = '') => `${source}\x1E${except}`);

function startTight(parser, except) {
  return input => isStartTight(input, except) ? parser(input) : global_1.undefined;
}

exports.startTight = startTight;
const isStartTight = (0, memoize_1.reduce)(({
  source,
  context
}, except) => {
  if (source === '') return true;
  if (except && source.slice(0, except.length) === except) return false;

  switch (source[0]) {
    case ' ':
    case '　':
    case '\t':
    case '\n':
      return false;

    case '\\':
      return source[1]?.trimStart() !== '';

    case '&':
      switch (true) {
        case source.length > 2 && source[1] !== ' ' && (0, parser_1.eval)((0, htmlentity_1.unsafehtmlentity)({
          source,
          context
        }))?.[0]?.trimStart() === '':
          return false;
      }

      return true;

    case '<':
      switch (true) {
        case source.length >= 5 && source.slice(0, 4) === '<wbr' && (source[5] === '>' || /^<wbr[^\S\n]*>/.test(source)):
          return false;
      }

      return true;

    default:
      return source[0].trimStart() !== '';
  }
}, ({
  source
}, except = '') => `${source}\x1E${except}`);

function isStartLooseNodes(nodes) {
  if (nodes.length === 0) return true;

  for (let i = 0; i < nodes.length; ++i) {
    const node = nodes[i];
    if (isVisible(node)) return true;

    if (typeof node === 'object') {
      if (node.tagName === 'BR') break;
      if (node.className === 'linebreak') break;
    }
  }

  return false;
}

exports.isStartLooseNodes = isStartLooseNodes;

function isStartTightNodes(nodes) {
  if (nodes.length === 0) return true;
  return isVisible(nodes[0], 0);
}

exports.isStartTightNodes = isStartTightNodes; //export function isEndTightNodes(nodes: readonly (HTMLElement | string)[]): boolean {
//  if (nodes.length === 0) return true;
//  return isVisible(nodes[nodes.length - 1], -1);
//}

function isVisible(node, strpos) {
  switch (typeof node) {
    case 'string':
      const char = node && strpos !== global_1.undefined ? node[strpos >= 0 ? strpos : node.length + strpos] : node;

      switch (char) {
        case '':
        case ' ':
        case '\t':
        case '\n':
          return false;

        default:
          return char.trimStart() !== '';
      }

    default:
      switch (node.tagName) {
        case 'BR':
        case 'WBR':
          return false;

        case 'SPAN':
          return node.className !== 'linebreak';

        default:
          return true;
      }

  }
}

function trimBlank(parser) {
  return trimBlankStart(trimBlankEnd(parser));
}

exports.trimBlank = trimBlank;

function trimBlankStart(parser) {
  return (0, combinator_1.convert)((0, memoize_1.reduce)(source => source.replace(exports.regBlankStart, '')), parser);
}

exports.trimBlankStart = trimBlankStart;

function trimBlankEnd(parser) {
  return (0, combinator_1.fmap)(parser, trimNodeEnd);
}

exports.trimBlankEnd = trimBlankEnd;

function trimNode(nodes) {
  return trimNodeStart(trimNodeEnd(nodes));
}

exports.trimNode = trimNode;

function trimNodeStart(nodes) {
  for (let node = nodes[0]; nodes.length > 0 && !isVisible(node = nodes[0], 0);) {
    if (nodes.length === 1 && typeof node === 'object' && node.className === 'indexer') break;

    if (typeof node === 'string') {
      const pos = node.trimStart().length;

      if (pos > 0) {
        nodes[0] = node.slice(-pos);
        break;
      }
    }

    nodes.shift();
  }

  return nodes;
}

function trimNodeEnd(nodes) {
  const skip = nodes.length > 0 && typeof nodes[nodes.length - 1] === 'object' && nodes[nodes.length - 1]['className'] === 'indexer' ? [nodes.pop()] : [];

  for (let node = nodes[0]; nodes.length > 0 && !isVisible(node = nodes[nodes.length - 1], -1);) {
    if (typeof node === 'string') {
      const pos = node.trimEnd().length;

      if (pos > 0) {
        nodes[nodes.length - 1] = node.slice(0, pos);
        break;
      }
    }

    nodes.pop();
  }

  return (0, array_1.push)(nodes, skip);
}

/***/ }),

/***/ 256:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.render = void 0;

var render_1 = __webpack_require__(3378);

Object.defineProperty(exports, "render", ({
  enumerable: true,
  get: function () {
    return render_1.render;
  }
}));

/***/ }),

/***/ 3378:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.render = void 0;

const global_1 = __webpack_require__(4128);

const code_1 = __webpack_require__(7686);

const math_1 = __webpack_require__(611);

const media_1 = __webpack_require__(2233);

const memoize_1 = __webpack_require__(1808);

const query_1 = __webpack_require__(6120);

const selector = 'img.media:not(.invalid):not([src])[data-src], a > :not(img).media:not(.invalid), pre.code:not(.invalid), .math:not(.invalid)';
const extend = (0, memoize_1.reduce)(opts => ({
  code: code_1.code,
  math: math_1.math,
  media: {},
  ...opts
}));

function render(source, opts = {}) {
  opts = extend(opts);
  const base = global_1.location.href;

  for (let es = (0, query_1.querySelectorAllWith)(source, selector), i = 0; i < es.length; ++i) {
    render_(base, es[i], opts);
  }
}

exports.render = render;

function render_(base, source, opts) {
  if (source.classList.contains('invalid')) return;

  try {
    switch (true) {
      case !!opts.code && !source.firstElementChild && source.matches('pre.code'):
        return void opts.code(source, opts.caches?.code);

      case !!opts.math && !source.firstElementChild && source.matches('.math'):
        return void opts.math(source, opts.caches?.math);

      case source.matches('.media:not(img)'):
        return void source.parentElement.parentElement.replaceChild(source, source.parentElement);

      case !!opts.media && source.matches('img.media:not([src])[data-src]'):
        {
          const el = (0, media_1.media)(base, source, opts.media, opts.caches?.media);
          if (!el) return;
          el.setAttribute('data-src', source.getAttribute('data-src'));
          const scope = el.matches('img') ? source : source.parentElement;
          return void scope.parentElement.replaceChild(el, scope);
        }

      default:
        return;
    }
  } catch (reason) {
    console.error(reason);
  }
}

/***/ }),

/***/ 7686:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.code = void 0;

const prismjs_1 = __importDefault(__webpack_require__(9450));

function code(target, cache) {
  const source = target.textContent;
  prismjs_1.default.highlightElement(target, false, () => void cache?.set(`${target.getAttribute('data-lang') ?? ''}\n${source}`, target.cloneNode(true)));
}

exports.code = code;

/***/ }),

/***/ 611:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.math = void 0;

const global_1 = __webpack_require__(4128);

const dom_1 = __webpack_require__(3252);

function math(target, cache) {
  const source = target.textContent;
  queue(target, () => {
    !target.textContent?.trim() && (0, dom_1.define)(target, [(0, dom_1.html)('span', source)]);
    return void cache?.set(source, target.cloneNode(true));
  });
}

exports.math = math;

async function queue(target, callback = () => global_1.undefined) {
  // @ts-ignore
  !MathJax.typesetPromise && (await MathJax.startup.promise); // @ts-ignore

  MathJax.typesetPromise([target]).then(callback);
}

/***/ }),

/***/ 2233:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.media = void 0;

const twitter_1 = __webpack_require__(4366);

const youtube_1 = __webpack_require__(5052);

const pdf_1 = __webpack_require__(9973);

const video_1 = __webpack_require__(1699);

const audio_1 = __webpack_require__(7281);

const image_1 = __webpack_require__(1472);

const url_1 = __webpack_require__(2261);

const memoize_1 = __webpack_require__(1808);

const extend = (0, memoize_1.reduce)(opts => ({
  twitter: twitter_1.twitter,
  youtube: youtube_1.youtube,
  pdf: pdf_1.pdf,
  video: video_1.video,
  audio: audio_1.audio,
  image: image_1.image,
  ...opts
}));

function media(base, source, opts, cache) {
  opts = extend(opts);
  const url = new url_1.ReadonlyURL(source.getAttribute('data-src'), base);
  return opts.twitter?.(source, url) || opts.youtube?.(source, url) || opts.pdf?.(source, url) || opts.video?.(source, url) || opts.audio?.(source, url) || opts.image?.(source, url, cache);
}

exports.media = media;

/***/ }),

/***/ 7281:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.audio = void 0;

const dom_1 = __webpack_require__(3252);

const extensions = ['.oga', '.ogg'];

function audio(source, url) {
  if (!extensions.includes(url.pathname.split(/(?=\.)/).pop())) return;
  return (0, dom_1.html)('audio', {
    class: source.className,
    'data-type': 'audio',
    src: source.getAttribute('data-src'),
    alt: source.alt,
    controls: ''
  });
}

exports.audio = audio;

/***/ }),

/***/ 1472:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.image = void 0;

const global_1 = __webpack_require__(4128);

const dom_1 = __webpack_require__(3252);

function image(source, url, cache) {
  if (cache?.has(url.href)) return (0, dom_1.define)(cache.get(url.href).cloneNode(true), global_1.Object.fromEntries([...source.attributes].map(attr => [attr.name, attr.value])));
  (0, dom_1.define)(source, {
    'data-type': 'image',
    src: source.getAttribute('data-src'),
    loading: 'lazy'
  });
  cache?.set(url.href, (0, dom_1.define)(source.cloneNode(true), global_1.Object.fromEntries([...source.attributes].filter(attr => !['class', 'data-type', 'data-src', 'src', 'loading'].includes(attr.name)).map(attr => [attr.name, null]))));
  return source;
}

exports.image = image;

/***/ }),

/***/ 9973:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.pdf = void 0;

const parser_1 = __webpack_require__(3019);

const dom_1 = __webpack_require__(3252);

const extensions = ['.pdf'];

function pdf(source, url) {
  if (!extensions.includes(url.pathname.split(/(?=\.)/).pop())) return;
  return (0, dom_1.html)('div', {
    class: source.className,
    'data-type': 'pdf'
  }, [(0, dom_1.html)('object', {
    type: 'application/pdf',
    data: source.getAttribute('data-src')
  }), (0, dom_1.html)('div', [(0, dom_1.define)((0, parser_1.parse)(`{ ${source.getAttribute('data-src')} }`).querySelector('a'), {
    class: null,
    target: '_blank'
  })])]);
}

exports.pdf = pdf;

/***/ }),

/***/ 4366:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.twitter = void 0;

const global_1 = __webpack_require__(4128);

const parser_1 = __webpack_require__(3019);

const dom_1 = __webpack_require__(3252);

const dompurify_1 = __importDefault(__webpack_require__(6231));

const origins = ['https://twitter.com'];

function twitter(source, url) {
  if (!origins.includes(url.origin)) return;
  if (url.pathname.split('/').pop().includes('.')) return;
  if (!url.pathname.match(/^\/\w+\/status\/[0-9]{15,}(?!\w)/)) return;
  const el = (0, dom_1.html)('div', {
    class: source.className,
    'data-type': 'twitter'
  }, [(0, dom_1.html)('em', `Loading ${source.getAttribute('data-src')}...`)]);
  $.ajax(`https://publish.twitter.com/oembed?url=${url.href.replace('?', '&')}&omit_script=true`, {
    dataType: 'jsonp',
    timeout: 10 * 1e3,
    cache: true,

    success({
      html
    }) {
      el.innerHTML = dompurify_1.default.sanitize(html);
      if (global_1.window.twttr) return void global_1.window.twttr.widgets.load(el);
      const id = 'twitter-wjs';
      if (global_1.document.getElementById(id)) return;
      global_1.document.body.appendChild((0, dom_1.html)('script', {
        id,
        src: 'https://platform.twitter.com/widgets.js'
      }));
    },

    error({
      status,
      statusText
    }) {
      (0, dom_1.define)(el, [(0, dom_1.define)((0, parser_1.parse)(`{ ${source.getAttribute('data-src')} }`).querySelector('a'), {
        class: null,
        target: '_blank'
      }), (0, dom_1.html)('pre', `${status}\n${statusText}`)]);
    }

  });
  return el;
}

exports.twitter = twitter;

/***/ }),

/***/ 1699:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.video = void 0;

const global_1 = __webpack_require__(4128);

const dom_1 = __webpack_require__(3252);

const extensions = ['.webm', '.ogv'];

function video(source, url) {
  if (!extensions.includes(url.pathname.split(/(?=\.)/).pop())) return;
  return (0, dom_1.html)('video', {
    src: source.getAttribute('data-src'),
    'data-type': 'video',
    ...global_1.Object.fromEntries([...source.attributes].map(attr => [attr.name, attr.value])),
    style: source.hasAttribute('aspect-ratio') ? `aspect-ratio: ${source.getAttribute('aspect-ratio')};` : global_1.undefined,
    muted: '',
    controls: ''
  });
}

exports.video = video;

/***/ }),

/***/ 5052:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.youtube = void 0;

const global_1 = __webpack_require__(4128);

const dom_1 = __webpack_require__(3252);

function youtube(source, url) {
  const id = resolve(url);
  if (!id) return;
  return (0, dom_1.html)('div', {
    class: source.className,
    'data-type': 'youtube'
  }, [(0, dom_1.html)('iframe', {
    src: `https://www.youtube.com/embed/${id}`,
    allow: 'fullscreen',
    loading: 'lazy'
  })]);
}

exports.youtube = youtube;

function resolve(url) {
  switch (url.origin) {
    case 'https://www.youtube.com':
      return url.pathname.match(/^\/watch\/?$/) ? url.searchParams.get('v')?.concat(url.search.replace(/([?&])v=[^&#]*&?/g, '$1'), url.hash) : global_1.undefined;

    case 'https://youtu.be':
      return url.pathname.match(/^\/[\w-]+\/?$/) ? url.href.slice(url.origin.length) : global_1.undefined;

    default:
      return;
  }
}

/***/ }),

/***/ 4613:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.scope = exports.info = exports.toc = exports.quote = void 0;

var quote_1 = __webpack_require__(423);

Object.defineProperty(exports, "quote", ({
  enumerable: true,
  get: function () {
    return quote_1.quote;
  }
}));

var toc_1 = __webpack_require__(9391);

Object.defineProperty(exports, "toc", ({
  enumerable: true,
  get: function () {
    return toc_1.toc;
  }
}));

var info_1 = __webpack_require__(2569);

Object.defineProperty(exports, "info", ({
  enumerable: true,
  get: function () {
    return info_1.info;
  }
}));

var scope_1 = __webpack_require__(5202);

Object.defineProperty(exports, "scope", ({
  enumerable: true,
  get: function () {
    return scope_1.scope;
  }
}));

/***/ }),

/***/ 2569:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.info = void 0;

const scope_1 = __webpack_require__(5202);

const query_1 = __webpack_require__(6120);

function info(source) {
  const match = (0, scope_1.scope)(source, '.invalid');
  return {
    url: find('a.link, a.url'),
    tel: find('a.tel'),
    email: find('a.email'),
    account: find('a.account'),
    channel: find('a.channel'),
    hashtag: find('a.hashtag'),
    hashnum: find('a.hashnum'),
    reply: find('.cite > a.anchor'),
    anchor: find(':not(.cite) > a.anchor'),
    media: find('.media[data-src]')
  };

  function find(selector) {
    const acc = [];

    for (let es = (0, query_1.querySelectorAll)(source, selector), i = 0; i < es.length; ++i) {
      const el = es[i];
      match(el) && acc.push(el);
    }

    return acc;
  }
}

exports.info = info;

/***/ }),

/***/ 423:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.quote = void 0;

const global_1 = __webpack_require__(4128);

const parser_1 = __webpack_require__(6728);

const cite_1 = __webpack_require__(6315);

const dom_1 = __webpack_require__(3252);

const query_1 = __webpack_require__(6120);

function quote(anchor, range) {
  if ((0, parser_1.exec)((0, cite_1.cite)({
    source: `>>${anchor}`,
    context: {}
  })) !== '') throw new Error(`Invalid anchor: ${anchor}`);
  fit(range);
  const node = trim(range.cloneContents());
  if (!node.firstChild) return '';

  for (let es = (0, query_1.querySelectorAll)(node, 'code[data-src], .math[data-src], .media[data-src], rt, rp'), i = 0; i < es.length; ++i) {
    const el = es[i];

    switch (true) {
      case el.matches('code'):
      case el.matches('.math'):
        (0, dom_1.define)(el, el.getAttribute('data-src'));
        continue;

      case el.matches('.media'):
        el.replaceWith(/[\s{}]/.test(el.getAttribute('data-src')) ? `!{ ${el.getAttribute('data-src')} }` : `!{${el.getAttribute('data-src')}}`);
        continue;

      case el.matches('rt, rp'):
        el.remove();
        continue;
    }
  }

  if (range.startOffset === 0 && range.startContainer.parentElement?.matches('.cite, .quote') && (!range.startContainer.previousSibling || range.startContainer.previousSibling.nodeName === 'BR')) {
    node.prepend(`>${range.startContainer.parentElement.matches('.quote.invalid') ? ' ' : ''}`);
  } else {
    node.prepend(`>>${anchor}\n> `);
    anchor = '';
  }

  for (let es = (0, query_1.querySelectorAll)(node, 'br'), i = 0; i < es.length; ++i) {
    const el = es[i];

    if (anchor && el.nextSibling instanceof global_1.Element && el.nextSibling.matches('.cite, .quote')) {
      el.replaceWith(`\n>${el.nextSibling.matches('.quote.invalid') ? ' ' : ''}`);
      continue;
    }

    if (anchor && el.parentElement?.closest('.cite, .quote')) {
      el.replaceWith(`\n>${el.parentElement.closest('.quote.invalid') ? ' ' : ''}`);
      continue;
    }

    if (anchor) {
      el.replaceWith(`\n>>${anchor}\n> `);
      anchor = '';
      continue;
    } else {
      el.replaceWith(`\n> `);
      continue;
    }
  }

  anchor && node.append(`\n>>${anchor}`);
  return node.textContent;
}

exports.quote = quote;

function fit(range) {
  const node = range.startContainer;

  if (node.parentElement?.matches('.cite > .anchor')) {
    return void range.setStart(node.parentElement.previousSibling, 0);
  }

  if (node.nodeName === 'BR' && node.nextSibling instanceof global_1.Element && node.nextSibling.matches('.cite, .quote')) {
    return void range.setStart(node.nextSibling.firstChild, 0);
  }

  const offset = range.startOffset;

  if (node.parentElement?.matches('.cite, .quote') && node.textContent.slice(0, offset) === '>'.repeat(offset) && (!node.previousSibling || node.previousSibling.nodeName === 'BR')) {
    return void range.setStart(node, 0);
  }
}

function trim(node) {
  for (let child; child = node.firstChild;) {
    if (child.textContent) break;
    child.remove();
  }

  return node;
}

/***/ }),

/***/ 5202:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.scope = void 0;

const global_1 = __webpack_require__(4128);

function scope(base, filter = '', bound = `${'id' in base && base.id ? `#${base.id}, ` : ''}section, article, aside, blockquote, pre, .quote, .math, .media`) {
  bound += filter && `, ${filter}`;
  const memory = new global_1.WeakMap();
  const context = 'id' in base && base.closest(bound) || null;
  return el => {
    const {
      parentNode
    } = el;
    const node = memory.has(parentNode) ? parentNode : parentNode.parentNode;
    let result = memory.get(node);

    if (result === global_1.undefined) {
      result = el.closest(bound) === context;
      memory.set(node, result);
    }

    return result;
  };
}

exports.scope = scope;

/***/ }),

/***/ 9391:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.toc = void 0;

const global_1 = __webpack_require__(4128);

const array_1 = __webpack_require__(8112);

const dom_1 = __webpack_require__(3252);

const query_1 = __webpack_require__(6120); // Bug: Firefox
//const selector = 'h1 h2 h3 h4 h5 h6 aside.aside'.split(' ').map(s => `:scope > ${s}[id]`).join();


const selector = ':is(h1, h2, h3, h4, h5, h6, aside.aside)[id]';

function toc(source) {
  const hs = [];

  for (let es = (0, query_1.querySelectorAll)(source, selector), i = 0; i < es.length; ++i) {
    const el = es[i];

    switch (el.tagName) {
      case 'ASIDE':
        hs.push((0, dom_1.html)(el.firstElementChild.tagName.toLowerCase(), {
          id: el.id,
          class: 'aside'
        }, el.firstElementChild.cloneNode(true).childNodes));
        continue;

      default:
        hs.push(el);
        continue;
    }
  }

  return parse(cons(hs));
}

exports.toc = toc;

function parse(node, index = '') {
  let i = 0;
  return (0, dom_1.html)('ul', node.map(([el, cs]) => {
    const isHeading = !el.classList.contains('aside');
    const idx = isHeading ? index === '' ? `${++i}` : `${index}.${++i}` : index === '' ? `${i}` : `${index}.${i}`;
    return (0, dom_1.html)('li', (0, array_1.push)([(0, dom_1.html)('a', {
      href: `#${el.id}`,
      'data-index': isHeading ? idx : global_1.undefined
    }, unlink(el.cloneNode(true)))], cs.length > 0 ? [parse(cs, idx)] : []));
  }));
}

function cons(hs) {
  return hs.reduce((hss, h) => {
    const hs = hss.pop() ?? [];
    return hs.length === 0 || level(h) > level(hs[0]) ? (0, array_1.push)(hss, [(0, array_1.push)(hs, [h])]) : (0, array_1.push)(hss, [hs, [h]]);
  }, []).map(hs => [hs.shift(), cons(hs)]);
}

function level(h) {
  return +h.tagName[1];
}

function unlink(h) {
  for (let es = h.getElementsByTagName('a'), len = es.length, i = 0; i < len; ++i) {
    const el = es[i];
    el.replaceWith(...el.childNodes);
  }

  return h.childNodes;
}

/***/ }),

/***/ 3252:
/***/ (function(module) {

/*! typed-dom v0.0.305 https://github.com/falsandtru/typed-dom | (c) 2016, falsandtru | (Apache-2.0 AND MPL-2.0) License */
(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory();
	else {}
})(this, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 406:
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.ObjectSetPrototypeOf = exports.ObjectGetPrototypeOf = exports.ObjectCreate = exports.ObjectAssign = exports.toString = exports.isEnumerable = exports.isPrototypeOf = exports.hasOwnProperty = exports.isArray = exports.sqrt = exports.log = exports.tan = exports.cos = exports.sign = exports.round = exports.random = exports.min = exports.max = exports.floor = exports.ceil = exports.abs = exports.parseInt = exports.parseFloat = exports.isSafeInteger = exports.isNaN = exports.isInteger = exports.isFinite = exports[NaN] = void 0;
exports[NaN] = Number.NaN, exports.isFinite = Number.isFinite, exports.isInteger = Number.isInteger, exports.isNaN = Number.isNaN, exports.isSafeInteger = Number.isSafeInteger, exports.parseFloat = Number.parseFloat, exports.parseInt = Number.parseInt;
exports.abs = Math.abs, exports.ceil = Math.ceil, exports.floor = Math.floor, exports.max = Math.max, exports.min = Math.min, exports.random = Math.random, exports.round = Math.round, exports.sign = Math.sign, exports.cos = Math.cos, exports.tan = Math.tan, exports.log = Math.log, exports.sqrt = Math.sqrt;
exports.isArray = Array.isArray;
exports.hasOwnProperty = Object.prototype.hasOwnProperty.call.bind(Object.prototype.hasOwnProperty);
exports.isPrototypeOf = Object.prototype.isPrototypeOf.call.bind(Object.prototype.isPrototypeOf);
exports.isEnumerable = Object.prototype.propertyIsEnumerable.call.bind(Object.prototype.propertyIsEnumerable);
exports.toString = Object.prototype.toString.call.bind(Object.prototype.toString);
exports.ObjectAssign = Object.assign;
exports.ObjectCreate = Object.create;
exports.ObjectGetPrototypeOf = Object.getPrototypeOf;
exports.ObjectSetPrototypeOf = Object.setPrototypeOf;

/***/ }),

/***/ 529:
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.equal = void 0;

function equal(a, b) {
  return a === a ? a === b : b !== b;
}

exports.equal = equal;

/***/ }),

/***/ 128:
/***/ ((module, __unused_webpack_exports, __nested_webpack_require_2745__) => {



__nested_webpack_require_2745__(921);

const global = void 0 || typeof globalThis !== 'undefined' && globalThis // @ts-ignore
|| typeof self !== 'undefined' && self || Function('return this')();
global.global = global;
module.exports = global;

/***/ }),

/***/ 921:
/***/ (() => {

 // @ts-ignore

var globalThis; // @ts-ignore

var global = (/* unused pure expression or super */ null && (0));

/***/ }),

/***/ 808:
/***/ ((__unused_webpack_module, exports, __nested_webpack_require_3232__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.reduce = exports.memoize = void 0;

const global_1 = __nested_webpack_require_3232__(128);

const alias_1 = __nested_webpack_require_3232__(406);

const compare_1 = __nested_webpack_require_3232__(529);

function memoize(f, identify = (...as) => as[0], memory) {
  if (typeof identify === 'object') return memoize(f, void 0, identify);
  if (memory === void 0) return memoize(f, identify, new global_1.Map());
  if ((0, alias_1.isArray)(memory)) return memoize(f, identify, {
    has(key) {
      return memory[key] !== void 0;
    },

    get(key) {
      return memory[key];
    },

    set(key, value) {
      memory[key] = value;
      return this;
    },

    delete() {
      throw 0;
    }

  });
  let nullish = false;
  return (...as) => {
    const b = identify(...as);
    let z = memory.get(b);
    if (z !== void 0 || nullish && memory.has(b)) return z;
    z = f(...as);
    nullish ||= z === void 0;
    memory.set(b, z);
    return z;
  };
}

exports.memoize = memoize;

function reduce(f, identify = (...as) => as[0]) {
  let key = [];
  let val = [];
  return (...as) => {
    const b = identify(...as);

    if (!(0, compare_1.equal)(key, b)) {
      key = b;
      val = f(...as);
    }

    return val;
  };
}

exports.reduce = reduce;

/***/ }),

/***/ 521:
/***/ ((__unused_webpack_module, exports, __nested_webpack_require_4622__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.defrag = exports.prepend = exports.append = exports.isChildren = exports.define = exports.element = exports.text = exports.svg = exports.html = exports.frag = exports.shadow = void 0;

const global_1 = __nested_webpack_require_4622__(128);

const alias_1 = __nested_webpack_require_4622__(406);

const memoize_1 = __nested_webpack_require_4622__(808);

var caches;

(function (caches) {
  caches.shadows = new WeakMap();
  caches.shadow = (0, memoize_1.memoize)((el, opts) => el.attachShadow(opts), caches.shadows);
  caches.fragment = global_1.document.createDocumentFragment();
})(caches || (caches = {}));

function shadow(el, opts, children, factory = exports.html) {
  if (typeof el === 'string') return shadow(factory(el), opts, children, factory);
  if (typeof opts === 'function') return shadow(el, void 0, children, opts);
  if (typeof children === 'function') return shadow(el, opts, void 0, children);
  if (isChildren(opts)) return shadow(el, void 0, opts, factory);
  return defineChildren(!opts ? el.shadowRoot ?? caches.shadows.get(el) ?? el.attachShadow({
    mode: 'open'
  }) : opts.mode === 'open' ? el.shadowRoot ?? el.attachShadow(opts) : caches.shadows.get(el) ?? caches.shadow(el, opts), children);
}

exports.shadow = shadow;

function frag(children) {
  return defineChildren(caches.fragment.cloneNode(true), children);
}

exports.frag = frag;
exports.html = element(global_1.document, "HTML"
/* NS.HTML */
);
exports.svg = element(global_1.document, "SVG"
/* NS.SVG */
);

function text(source) {
  return global_1.document.createTextNode(source);
}

exports.text = text;

function element(context, ns) {
  return (tag, attrs, children) => {
    const el = elem(context, ns, tag);
    return !attrs || isChildren(attrs) ? defineChildren(el, attrs ?? children) : defineChildren(defineAttrs(el, attrs), children);
  };
}

exports.element = element;

function elem(context, ns, tag) {
  if (!('createElement' in context)) throw new Error(`TypedDOM: Scoped custom elements are not supported on this browser.`);

  switch (ns) {
    case "HTML"
    /* NS.HTML */
    :
      return context.createElement(tag);

    case "SVG"
    /* NS.SVG */
    :
      return context.createElementNS('http://www.w3.org/2000/svg', tag);

    case "MathML"
    /* NS.MathML */
    :
      return context.createElementNS('http://www.w3.org/1998/Math/MathML', tag);
  }
}

function define(node, attrs, children) {
  // Bug: TypeScript
  // Need the next type assertions to suppress an impossible type error on dependent projects.
  // Probably caused by typed-query-selector.
  //
  //   typed-dom/dom.ts(113,3): Error TS2322: Type 'ParentNode & Node' is not assignable to type 'E'.
  //     'E' could be instantiated with an arbitrary type which could be unrelated to 'ParentNode & Node'.
  //
  return !attrs || isChildren(attrs) ? defineChildren(node, attrs ?? children) : defineChildren(defineAttrs(node, attrs), children);
}

exports.define = define;

function defineAttrs(el, attrs) {
  for (const name in attrs) {
    if (!(0, alias_1.hasOwnProperty)(attrs, name)) continue;
    const value = attrs[name];

    switch (typeof value) {
      case 'string':
        el.setAttribute(name, value);

        if (name.startsWith('on')) {
          const type = name.slice(2).toLowerCase();

          switch (type) {
            case 'mutate':
            case 'connect':
            case 'disconnect':
              const prop = `on${type}`;
              el[prop] ?? global_1.Object.defineProperty(el, prop, {
                configurable: true,
                enumerable: false,
                writable: true,
                value: prop in el && !(0, alias_1.hasOwnProperty)(el, prop) ? ev => ev.returnValue : ''
              });
          }
        }

        continue;

      case 'function':
        if (name.length < 3) throw new Error(`TypedDOM: Attribute names for event listeners must have an event name but got "${name}".`);
        const names = name.split(/\s+/);

        for (const name of names) {
          if (!name.startsWith('on')) throw new Error(`TypedDOM: Attribute names for event listeners must start with "on" but got "${name}".`);
          const type = name.slice(2).toLowerCase();
          el.addEventListener(type, value, {
            passive: ['wheel', 'mousewheel', 'touchstart', 'touchmove', 'touchend', 'touchcancel'].includes(type)
          });

          switch (type) {
            case 'mutate':
            case 'connect':
            case 'disconnect':
              const prop = `on${type}`;
              el[prop] ?? global_1.Object.defineProperty(el, prop, {
                configurable: true,
                enumerable: false,
                writable: true,
                value: prop in el && !(0, alias_1.hasOwnProperty)(el, prop) ? ev => ev.returnValue : ''
              });
          }
        }

        continue;

      case 'object':
        el.removeAttribute(name);
        continue;

      default:
        continue;
    }
  }

  return el;
}

function defineChildren(node, children) {
  if (children === void 0) return node;

  if (typeof children === 'string') {
    node.textContent = children;
  } else if ((0, alias_1.isArray)(children) && !node.firstChild) {
    for (let i = 0; i < children.length; ++i) {
      const child = children[i];
      typeof child === 'object' ? node.appendChild(child) : node.append(child);
    }
  } else {
    node.replaceChildren(...children);
  }

  return node;
}

function isChildren(value) {
  return !!value?.[global_1.Symbol.iterator];
}

exports.isChildren = isChildren;

function append(node, children) {
  if (children === void 0) return node;

  if (typeof children === 'string') {
    node.append(children);
  } else {
    for (const child of children) {
      typeof child === 'object' ? node.appendChild(child) : node.append(child);
    }
  }

  return node;
}

exports.append = append;

function prepend(node, children) {
  if (children === void 0) return node;

  if (typeof children === 'string') {
    node.prepend(children);
  } else {
    for (const child of children) {
      typeof child === 'object' ? node.insertBefore(child, null) : node.prepend(child);
    }
  }

  return node;
}

exports.prepend = prepend;

function defrag(nodes) {
  const acc = [];
  let appendable = false;

  for (let i = 0; i < nodes.length; ++i) {
    const node = nodes[i];
    if (node === '') continue;

    if (typeof node === 'string') {
      appendable ? acc[acc.length - 1] += node : acc.push(node);
      appendable = true;
    } else {
      acc.push(node);
      appendable = false;
    }
  }

  return acc;
}

exports.defrag = defrag;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nested_webpack_require_11575__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __nested_webpack_require_11575__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __nested_webpack_require_11575__(521);
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});

/***/ }),

/***/ 6120:
/***/ (function(module) {

/*! typed-dom v0.0.305 https://github.com/falsandtru/typed-dom | (c) 2016, falsandtru | (Apache-2.0 AND MPL-2.0) License */
(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory();
	else {}
})(this, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 99:
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.duffReduce = exports.duffEach = exports.duffbk = exports.duff = void 0;

function duff(count, proc) {
  if (count > 0) {
    let i = 0,
        m = count & 7,
        d = (count - m) / 8;

    while (m--) {
      proc(i++);
    }

    while (d--) {
      proc(i++);
      proc(i++);
      proc(i++);
      proc(i++);
      proc(i++);
      proc(i++);
      proc(i++);
      proc(i++);
    }
  } else {
    let i = -count,
        m = i & 7,
        d = (i - m) / 8;

    while (m--) {
      proc(--i);
    }

    while (d--) {
      proc(--i);
      proc(--i);
      proc(--i);
      proc(--i);
      proc(--i);
      proc(--i);
      proc(--i);
      proc(--i);
    }
  }
}

exports.duff = duff;

function duffbk(count, proc) {
  if (count > 0) {
    let i = 0,
        m = count & 7,
        d = (count - m) / 8;

    while (m--) {
      if (proc(i++) === false) return;
    }

    while (d--) {
      switch (false) {
        case proc(i++):
        case proc(i++):
        case proc(i++):
        case proc(i++):
        case proc(i++):
        case proc(i++):
        case proc(i++):
        case proc(i++):
          return;
      }
    }
  } else {
    let i = -count,
        m = i & 7,
        d = (i - m) / 8;

    while (m--) {
      if (proc(--i) === false) return;
    }

    while (d--) {
      switch (false) {
        case proc(--i):
        case proc(--i):
        case proc(--i):
        case proc(--i):
        case proc(--i):
        case proc(--i):
        case proc(--i):
        case proc(--i):
          return;
      }
    }
  }
}

exports.duffbk = duffbk;

function duffEach(array, proc) {
  let count = array.length;
  let i = 0,
      m = count & 7,
      d = (count - m) / 8;

  while (m--) {
    proc(array[i], i++, array);
  }

  while (d--) {
    proc(array[i], i++, array);
    proc(array[i], i++, array);
    proc(array[i], i++, array);
    proc(array[i], i++, array);
    proc(array[i], i++, array);
    proc(array[i], i++, array);
    proc(array[i], i++, array);
    proc(array[i], i++, array);
  }
}

exports.duffEach = duffEach; // ベンチマークの10,000以上で急激な速度低下が見られるがNodeListなどでの
// 実際の使用では速度低下は見られない

function duffReduce(array, proc, initial) {
  let count = array.length;
  let i = 0,
      m = count & 7,
      d = (count - m) / 8;
  let acc = initial;

  while (m--) {
    acc = proc(acc, array[i], i++, array);
  }

  while (d--) {
    acc = proc(acc, array[i], i++, array);
    acc = proc(acc, array[i], i++, array);
    acc = proc(acc, array[i], i++, array);
    acc = proc(acc, array[i], i++, array);
    acc = proc(acc, array[i], i++, array);
    acc = proc(acc, array[i], i++, array);
    acc = proc(acc, array[i], i++, array);
    acc = proc(acc, array[i], i++, array);
  }

  return acc;
}

exports.duffReduce = duffReduce;

/***/ }),

/***/ 128:
/***/ ((module, __unused_webpack_exports, __nested_webpack_require_3560__) => {



__nested_webpack_require_3560__(921);

const global = void 0 || typeof globalThis !== 'undefined' && globalThis // @ts-ignore
|| typeof self !== 'undefined' && self || Function('return this')();
global.global = global;
module.exports = global;

/***/ }),

/***/ 921:
/***/ (() => {

 // @ts-ignore

var globalThis; // @ts-ignore

var global = (/* unused pure expression or super */ null && (0));

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nested_webpack_require_4212__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __nested_webpack_require_4212__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.querySelectorAll = exports.querySelectorAllWith = exports.querySelectorWith = void 0;

const global_1 = __nested_webpack_require_4212__(128);

const duff_1 = __nested_webpack_require_4212__(99);

function querySelectorWith(node, selector) {
  return 'matches' in node && node.matches(selector) ? node : node.querySelector(selector);
}

exports.querySelectorWith = querySelectorWith;

function querySelectorAllWith(node, selector) {
  const acc = [];

  if ('matches' in node && node.matches(selector)) {
    acc.push(node);
  }

  return (0, duff_1.duffReduce)(node.querySelectorAll(selector), (acc, el) => (acc.push(el), acc), acc);
}

exports.querySelectorAllWith = querySelectorAllWith;

function querySelectorAll(node, selector) {
  return (0, duff_1.duffReduce)(node.querySelectorAll(selector), (acc, el) => (acc.push(el), acc), (0, global_1.Array)());
}

exports.querySelectorAll = querySelectorAll;
})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});

/***/ }),

/***/ 6231:
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__6231__;

/***/ }),

/***/ 9450:
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__9450__;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(8767);
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});