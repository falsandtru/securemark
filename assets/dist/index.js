/*! securemark v0.298.0 https://github.com/falsandtru/securemark | (c) 2017, falsandtru | UNLICENSED License */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("Prism"), require("DOMPurify"));
	else if(typeof define === 'function' && define.amd)
		define(["Prism", "DOMPurify"], factory);
	else if(typeof exports === 'object')
		exports["securemark"] = factory(require("Prism"), require("DOMPurify"));
	else
		root["securemark"] = factory(root["Prism"], root["DOMPurify"]);
})(this, (__WEBPACK_EXTERNAL_MODULE__293__, __WEBPACK_EXTERNAL_MODULE__611__) => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 8257
(__unused_webpack_module, exports, __webpack_require__) {

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
__webpack_require__(518);
__exportStar(__webpack_require__(3561), exports);
__exportStar(__webpack_require__(2570), exports);
__exportStar(__webpack_require__(1625), exports);

/***/ },

/***/ 5413
(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.ObjectSetPrototypeOf = exports.ObjectGetPrototypeOf = exports.ObjectCreate = exports.ObjectAssign = exports.toString = exports.isEnumerable = exports.isPrototypeOf = exports.hasOwnProperty = exports.isArray = exports.sqrt = exports.log10 = exports.log2 = exports.log = exports.tan = exports.cos = exports.sign = exports.round = exports.random = exports.min = exports.max = exports.floor = exports.ceil = exports.abs = exports.PI = exports.parseInt = exports.parseFloat = exports.isSafeInteger = exports.isNaN = exports.isInteger = exports.isFinite = exports.EPSILON = exports.MIN_VALUE = exports.MIN_SAFE_INTEGER = exports.MAX_VALUE = exports.MAX_SAFE_INTEGER = void 0;
exports.MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER, exports.MAX_VALUE = Number.MAX_VALUE, exports.MIN_SAFE_INTEGER = Number.MIN_SAFE_INTEGER, exports.MIN_VALUE = Number.MIN_VALUE, exports.EPSILON = Number.EPSILON, exports.isFinite = Number.isFinite, exports.isInteger = Number.isInteger, exports.isNaN = Number.isNaN, exports.isSafeInteger = Number.isSafeInteger, exports.parseFloat = Number.parseFloat, exports.parseInt = Number.parseInt;
exports.PI = Math.PI, exports.abs = Math.abs, exports.ceil = Math.ceil, exports.floor = Math.floor, exports.max = Math.max, exports.min = Math.min, exports.random = Math.random, exports.round = Math.round, exports.sign = Math.sign, exports.cos = Math.cos, exports.tan = Math.tan, exports.log = Math.log, exports.log2 = Math.log2, exports.log10 = Math.log10, exports.sqrt = Math.sqrt;
exports.isArray = Array.isArray;
exports.hasOwnProperty = Object.prototype.hasOwnProperty.call.bind(Object.prototype.hasOwnProperty);
exports.isPrototypeOf = Object.prototype.isPrototypeOf.call.bind(Object.prototype.isPrototypeOf);
exports.isEnumerable = Object.prototype.propertyIsEnumerable.call.bind(Object.prototype.propertyIsEnumerable);
exports.toString = Object.prototype.toString.call.bind(Object.prototype.toString);
exports.ObjectAssign = Object.assign;
exports.ObjectCreate = Object.create;
exports.ObjectGetPrototypeOf = Object.getPrototypeOf;
exports.ObjectSetPrototypeOf = Object.setPrototypeOf;

/***/ },

/***/ 6876
(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.splice = exports.pop = exports.push = exports.shift = exports.unshift = exports.indexOf = void 0;
function indexOf(as, a) {
  if (as.length === 0) return -1;
  return a === a ? as.indexOf(a) : as.findIndex(a => a !== a);
}
exports.indexOf = indexOf;
function unshift(as, bs) {
  if ('length' in as) {
    if (as.length === 1) return bs.unshift(as[0]), bs;
    if (Array.isArray(as)) return bs.unshift(...as), bs;
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
    if (Array.isArray(bs) && bs.length > 100) return as.push(...bs), as;
    for (let len = bs.length, i = 0; i < len; ++i) {
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
    case as.length - 1:
      if (as.length === 0) return push(as, values), [];
      if (count >= 1) return [[as.pop()], push(as, values)][0];
      break;
    case 0:
      if (count === 0) return unshift(values, as), [];
      if (count === 1) return [[as.shift()], unshift(values, as)][0];
      break;
    case as.length:
      return push(as, values), [];
  }
  switch (values.length) {
    case 0:
      return arguments.length > 2 ? as.splice(index, count) : as.splice(index);
    case 1:
      return as.splice(index, count, values[0]);
    case 2:
      return as.splice(index, count, values[0], values[1]);
    case 3:
      return as.splice(index, count, values[0], values[1], values[2]);
    case 4:
      return as.splice(index, count, values[0], values[1], values[2], values[3]);
    case 5:
      return as.splice(index, count, values[0], values[1], values[2], values[3], values[4]);
    default:
      return as.splice(index, count, ...values);
  }
}
exports.splice = splice;

/***/ },

/***/ 9888
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.template = exports.inherit = exports.merge = exports.extend = exports.overwrite = exports.clone = exports.assign = void 0;
const alias_1 = __webpack_require__(5413);
const type_1 = __webpack_require__(113);
const array_1 = __webpack_require__(6876);
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
          return (0, exports.inherit)(target[prop], source[prop]);
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
      const keys = Object.keys(source);
      for (let i = 0; i < keys.length; ++i) {
        strategy(keys[i], target, source);
      }
    }
    return target;
  }
}
exports.template = template;
function empty(source) {
  return source instanceof Object ? {} : (0, alias_1.ObjectCreate)(null);
}

/***/ },

/***/ 6212
(__unused_webpack_module, exports, __webpack_require__) {

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
__exportStar(__webpack_require__(1311), exports);

/***/ },

/***/ 1934
(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.equal = void 0;
function equal(a, b) {
  return a === a ? a === b : b !== b;
}
exports.equal = equal;

/***/ },

/***/ 9202
(__unused_webpack_module, exports) {

"use strict";


// ベンチマーク上の高速性は単一のプロシージャに最適化されたことによるものであり
// 複数のプロシージャに使用すると著しく低速化するため使用禁止。
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.duffReduce = exports.duffEach = exports.duffbk = exports.duff = void 0;
// @deprecated
function duff(count, proc) {
  if (count > 0) {
    let i = 0;
    const m = count & 7,
      d = (count - m) / 8;
    for (let j = 0; j < m; ++j) {
      proc(i++);
    }
    for (let j = 0; j < d; ++j) {
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
    let i = -count;
    const m = i & 7,
      d = (i - m) / 8;
    for (let j = 0; j < m; ++j) {
      proc(--i);
    }
    for (let j = 0; j < d; ++j) {
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
// @deprecated
function duffbk(count, proc) {
  if (count > 0) {
    let i = 0;
    const m = count & 7,
      d = (count - m) / 8;
    for (let j = 0; j < m; ++j) {
      if (proc(i++) === false) return;
    }
    for (let j = 0; j < d; ++j) {
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
    let i = -count;
    const m = i & 7,
      d = (i - m) / 8;
    for (let j = 0; j < m; ++j) {
      if (proc(--i) === false) return;
    }
    for (let j = 0; j < d; ++j) {
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
// @deprecated
function duffEach(array, proc) {
  let count = array.length;
  let i = 0;
  const m = count & 7,
    d = (count - m) / 8;
  for (let j = 0; j < m; ++j) {
    proc(array[i], i++, array);
  }
  for (let j = 0; j < d; ++j) {
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
exports.duffEach = duffEach;
// @deprecated
function duffReduce(array, proc, initial) {
  let count = array.length;
  let i = 0;
  const m = count & 7,
    d = (count - m) / 8;
  let acc = initial;
  for (let j = 0; j < m; ++j) {
    acc = proc(acc, array[i], i++, array);
  }
  for (let j = 0; j < d; ++j) {
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

/***/ },

/***/ 518
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
__webpack_require__(3394);
const global = globalThis;
global.global = global;
exports["default"] = global;

/***/ },

/***/ 3394
() {

"use strict";


// @ts-ignore
var global = (/* unused pure expression or super */ null && (globalThis));

/***/ },

/***/ 3719
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.MultiHeap = exports.Heap = void 0;
const list_1 = __webpack_require__(4609);
const memoize_1 = __webpack_require__(6925);
class Heap {
  constructor(cmp = Heap.max, options) {
    this.cmp = cmp;
    this.array = {};
    this.$length = 0;
    this.stable = options?.stable ?? false;
  }
  get length() {
    return this.$length;
  }
  isEmpty() {
    return this.array[0] !== undefined;
  }
  peek() {
    return this.array[0];
  }
  insert(value, order) {
    if (arguments.length === 1) {
      order = value;
    }
    const array = this.array;
    const node = array[this.$length] = {
      index: ++this.$length,
      order,
      value
    };
    upHeapify(this.cmp, array, this.$length);
    return node;
  }
  replace(value, order) {
    if (arguments.length === 1) {
      order = value;
    }
    if (this.$length === 0) return void this.insert(value, order);
    const array = this.array;
    const node = array[0];
    const val = node.value;
    node.order = order;
    node.value = value;
    downHeapify(this.cmp, array, 1, this.$length, this.stable);
    return val;
  }
  extract() {
    if (this.$length === 0) return;
    const node = this.array[0];
    this.delete(node);
    return node.value;
  }
  delete(node) {
    const array = this.array;
    const index = node.index;
    if (array[index - 1] !== node) throw new Error('Invalid node');
    swap(array, index, this.$length--);
    sort(this.cmp, array, index, this.$length, this.stable);
    array[this.$length] = undefined;
    return node.value;
  }
  update(node, order, value) {
    const array = this.array;
    const index = node.index;
    if (array[index - 1] !== node) throw new Error('Invalid node');
    if (arguments.length === 1) {
      order = node.order;
    }
    if (arguments.length >= 3) {
      node.value = value;
    }
    if (this.cmp(node.order, node.order = order) === 0) return;
    sort(this.cmp, array, index, this.$length, this.stable);
  }
  clear() {
    this.array = {};
    this.$length = 0;
  }
}
exports.Heap = Heap;
Heap.max = (a, b) => a > b ? -1 : a < b ? 1 : 0;
Heap.min = (a, b) => a > b ? 1 : a < b ? -1 : 0;
function sort(cmp, array, index, length, stable) {
  if (length === 0) return false;
  switch (index) {
    case 1:
      return  false || downHeapify(cmp, array, index, length, stable);
    case length:
      return upHeapify(cmp, array, index);
    default:
      return upHeapify(cmp, array, index) || downHeapify(cmp, array, index, length, stable);
  }
}
function upHeapify(cmp, array, index) {
  const order = array[index - 1].order;
  let changed = false;
  while (index > 1) {
    const parent = index / 2 | 0;
    if (cmp(array[parent - 1].order, order) <= 0) break;
    swap(array, index, parent);
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
    if (left <= length) {
      const result = cmp(array[left - 1].order, array[min - 1].order);
      if (stable ? result <= 0 : result < 0) {
        min = left;
      }
    }
    if (right <= length) {
      const result = cmp(array[right - 1].order, array[min - 1].order);
      if (stable ? result <= 0 : result < 0) {
        min = right;
      }
    }
    if (min === index) break;
    swap(array, index, min);
    index = min;
    changed ||= true;
  }
  return changed;
}
function swap(array, index1, index2) {
  if (index1 === index2) return;
  const pos1 = index1 - 1;
  const pos2 = index2 - 1;
  const node1 = array[pos1];
  const node2 = array[pos2];
  array[pos1] = node2;
  array[pos2] = node1;
  node1.index = index2;
  node2.index = index1;
}
class MList extends list_1.List {
  constructor(order, heap) {
    super();
    this.order = order;
    this.heap = heap.insert(this, order);
  }
}
class MNode {
  constructor(list, order, value) {
    this.list = list;
    this.order = order;
    this.value = value;
    this.next = undefined;
    this.prev = undefined;
  }
}
class MultiHeap {
  constructor(cmp = MultiHeap.max, options) {
    this.cmp = cmp;
    this.dict = new Map();
    this.list = (0, memoize_1.memoize)(order => {
      return new MList(order, this.heap);
    }, this.dict);
    this.$length = 0;
    this.clean = options?.clean ?? true;
    this.heap = new Heap(this.cmp);
  }
  get length() {
    return this.$length;
  }
  isEmpty() {
    return this.heap.isEmpty();
  }
  peek() {
    return this.heap.peek()?.value.head;
  }
  insert(value, order) {
    if (arguments.length === 1) {
      order = value;
    }
    ++this.$length;
    const node = new MNode(this.list(order), order, value);
    node.list.push(node);
    return node;
  }
  extract() {
    if (this.$length === 0) return;
    --this.$length;
    const list = this.heap.peek()?.value;
    const value = list.shift().value;
    if (list.length === 0) {
      this.heap.extract();
      this.clean && this.dict.delete(list.order);
    }
    return value;
  }
  delete(node) {
    if (node.next === undefined) throw new Error('Invalid node');
    const list = node.list;
    --this.$length;
    if (list.length === 1) {
      this.heap.delete(list.heap);
      this.clean && this.dict.delete(list.order);
    }
    return list.delete(node).value;
  }
  update(node, order, value) {
    const list = node.list;
    if (list === undefined) throw new Error('Invalid node');
    if (arguments.length >= 3) {
      node.value = value;
    }
    if (this.cmp(list.order, order) === 0) return node;
    this.delete(node);
    return this.insert(node.value, order);
  }
  clear() {
    this.heap.clear();
    this.dict.clear();
    this.$length = 0;
  }
}
exports.MultiHeap = MultiHeap;
MultiHeap.max = Heap.max;
MultiHeap.min = Heap.min;

/***/ },

/***/ 4609
(__unused_webpack_module, exports, __webpack_require__) {

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
__exportStar(__webpack_require__(1952), exports);

/***/ },

/***/ 1311
(__unused_webpack_module, exports) {

"use strict";


// Memory-efficient flexible list.
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.List = void 0;
class List {
  constructor() {
    this.length = 0;
    this.head = undefined;
  }
  get tail() {
    return this.head?.next;
  }
  get last() {
    return this.head?.prev;
  }
  insert(node, before) {
    if (++this.length === 1) {
      return this.head = node.next = node.prev = node;
    }
    const next = node.next = before ?? this.head;
    const prev = node.prev = next.prev;
    return next.prev = prev.next = node;
  }
  delete(node) {
    if (--this.length === 0) {
      this.head = undefined;
    } else {
      const {
        next,
        prev
      } = node;
      if (node === this.head) {
        this.head = next;
      }
      // Error if not used.
      prev.next = next;
      next.prev = prev;
    }
    node.next = node.prev = undefined;
    return node;
  }
  unshift(node) {
    return this.head = this.insert(node, this.head);
  }
  push(node) {
    return this.insert(node, this.head);
  }
  shift() {
    if (this.length === 0) return;
    return this.delete(this.head);
  }
  pop() {
    if (this.length === 0) return;
    return this.delete(this.head.prev);
  }
  import(list, before) {
    if (list.length === 0) return this;
    if (this.length === 0) {
      this.head = list.head;
      this.length = list.length;
      list.head = undefined;
      list.length = 0;
      return this;
    }
    const head = list.head;
    const last = list.last;
    const next = last.next = before ?? this.head;
    const prev = head.prev = next.prev;
    next.prev = last;
    prev.next = head;
    this.length += list.length;
    list.length = 0;
    list.head = undefined;
    return this;
  }
  clear() {
    this.length = 0;
    this.head = undefined;
  }
  *[Symbol.iterator]() {
    for (let node = this.head; node && this.head;) {
      const next = node.next;
      yield node;
      node = next;
      if (node === this.head) break;
    }
  }
  flatMap(f) {
    const acc = new List();
    for (let node = this.head; node && this.head;) {
      const next = node.next;
      acc.import(f(node));
      node = next;
      if (node === this.head) break;
    }
    return acc;
  }
  foldl(f, acc) {
    for (let node = this.head; node && this.head;) {
      const next = node.next;
      acc = f(acc, node);
      node = next;
      if (node === this.head) break;
    }
    return acc;
  }
  foldr(f, acc) {
    for (let node = this.head?.prev; node && this.head;) {
      const prev = node.prev;
      acc = f(node, acc);
      if (node === this.head) break;
      node = prev;
    }
    return acc;
  }
  find(f) {
    for (let node = this.head; node && this.head;) {
      const next = node.next;
      if (f(node)) return node;
      node = next;
      if (node === this.head) break;
    }
  }
}
exports.List = List;
(function (List) {
  class Node {
    constructor() {
      this.next = undefined;
      this.prev = undefined;
    }
  }
  List.Node = Node;
})(List || (exports.List = List = {}));

/***/ },

/***/ 1952
(__unused_webpack_module, exports) {

"use strict";


// Memory-efficient flexible list.
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.List = void 0;
// LRUではclistの方が速い。
class List {
  constructor() {
    this.length = 0;
    this.head = undefined;
    this.last = undefined;
  }
  get tail() {
    return this.head?.next;
  }
  insert(node, before) {
    if (before === undefined) return this.push(node);
    if (before === this.head) return this.unshift(node);
    if (++this.length === 1) {
      return this.head = this.last = node;
    }
    const next = node.next = before;
    const prev = node.prev = next.prev;
    return next.prev = prev.next = node;
  }
  delete(node) {
    if (--this.length === 0) {
      this.head = this.last = undefined;
    } else {
      const {
        next,
        prev
      } = node;
      prev === undefined ? this.head = next : prev.next = next;
      next === undefined ? this.last = prev : next.prev = prev;
    }
    node.next = node.prev = undefined;
    return node;
  }
  unshift(node) {
    if (++this.length === 1) {
      return this.head = this.last = node;
    }
    node.next = this.head;
    return this.head = this.head.prev = node;
  }
  push(node) {
    if (++this.length === 1) {
      return this.head = this.last = node;
    }
    node.prev = this.last;
    return this.last = this.last.next = node;
  }
  shift() {
    if (this.length === 0) return;
    return this.delete(this.head);
  }
  pop() {
    if (this.length === 0) return;
    return this.delete(this.last);
  }
  import(list, before) {
    if (list.length === 0) return this;
    if (this.length === 0) {
      this.head = list.head;
      this.last = list.last;
      this.length = list.length;
      list.clear();
      return this;
    }
    const head = list.head;
    const last = list.last;
    const next = last.next = before;
    const prev = head.prev = before?.prev ?? this.last;
    next === undefined ? this.last = last : next.prev = last;
    prev.next = head;
    this.length += list.length;
    list.clear();
    return this;
  }
  clear() {
    this.length = 0;
    this.head = this.last = undefined;
  }
  *[Symbol.iterator]() {
    for (let node = this.head; node && this.head;) {
      const next = node.next;
      yield node;
      node = next;
    }
  }
  flatMap(f) {
    const acc = new List();
    for (let node = this.head; node && this.head;) {
      const next = node.next;
      acc.import(f(node));
      node = next;
    }
    return acc;
  }
  foldl(f, acc) {
    for (let node = this.head; node && this.head;) {
      const next = node.next;
      acc = f(acc, node);
      node = next;
    }
    return acc;
  }
  foldr(f, acc) {
    for (let node = this.last; node && this.head;) {
      const prev = node.prev;
      acc = f(node, acc);
      node = prev;
    }
    return acc;
  }
  find(f) {
    for (let node = this.head; node && this.head;) {
      const next = node.next;
      if (f(node)) return node;
      node = next;
    }
  }
}
exports.List = List;
(function (List) {
  class Node {
    constructor() {
      this.next = undefined;
      this.prev = undefined;
    }
  }
  List.Node = Node;
})(List || (exports.List = List = {}));

/***/ },

/***/ 6925
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.reduce = exports.memoize = void 0;
const alias_1 = __webpack_require__(5413);
const compare_1 = __webpack_require__(1934);
function memoize(f, identify, memory, mask) {
  if (typeof identify === 'object') {
    mask = memory;
    memory = identify;
    identify = undefined;
  }
  identify ??= (...as) => as[0];
  switch (true) {
    case (0, alias_1.isArray)(memory):
      return mask === undefined ? memoizeArray(f, identify, memory) : cacheArray(f, identify, memory, mask);
    case memory?.constructor === Object:
      return mask === undefined ? memoizeObject(f, identify, memory) : cacheObject(f, identify, memory, mask);
    default:
      return memoizeDict(f, identify, memory ?? new Map());
  }
}
exports.memoize = memoize;
function memoizeArray(f, identify, memory) {
  return (...as) => {
    const b = identify(...as);
    let z = memory[b];
    if (z !== undefined) return z;
    z = f(...as);
    memory[b] = z;
    return z;
  };
}
function cacheArray(f, identify, memory, mask) {
  const mask1 = mask >>>= 1;
  const mask2 = mask;
  const mem1 = memory;
  const mem2 = [];
  return (...as) => {
    const b = identify(...as);
    if (b <= mask1) {
      let z = mem1[b];
      if (z !== undefined) return z;
      z = f(...as);
      mem1[b] = z;
      return z;
    } else {
      const i = b & mask2;
      const t = mem2[i];
      if (t && t[0] === b) return t[1];
      const z = f(...as);
      mem2[i] = [b, z];
      return z;
    }
  };
}
function memoizeObject(f, identify, memory) {
  let nullable = false;
  return (...as) => {
    const b = identify(...as);
    let z = memory[b];
    if (z !== undefined || nullable && b in memory) return z;
    z = f(...as);
    nullable ||= z === undefined;
    memory[b] = z;
    return z;
  };
}
function cacheObject(f, identify, memory, mask) {
  const mask1 = mask >>>= 1;
  const mask2 = mask;
  const mem1 = memory;
  const mem2 = {};
  let nullable = false;
  return (...as) => {
    const b = identify(...as);
    if (b <= mask1) {
      let z = mem1[b];
      if (z !== undefined || nullable && b in mem1) return z;
      z = f(...as);
      nullable ||= z === undefined;
      mem1[b] = z;
      return z;
    } else {
      const i = b & mask2;
      const t = mem2[i];
      if (t && t[0] === b) return t[1];
      const z = f(...as);
      mem2[i] = [b, z];
      return z;
    }
  };
}
function memoizeDict(f, identify, memory) {
  let nullable = false;
  return (...as) => {
    const b = identify(...as);
    let z = memory.get(b);
    if (z !== undefined || nullable && memory.has(b)) return z;
    z = f(...as);
    nullable ||= z === undefined;
    memory.add?.(b, z) ?? memory.set(b, z);
    return z;
  };
}
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

/***/ },

/***/ 4110
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.MultiQueue = exports.PriorityQueue = exports.Queue = void 0;
const heap_1 = __webpack_require__(3719);
const memoize_1 = __webpack_require__(6925);
const size = 2048;
const initsize = 16;
class Queue {
  constructor() {
    this.head = new FixedQueue(initsize);
    this.tail = this.head;
    this.count = 0;
  }
  get length() {
    return this.head === this.tail ? this.head.length : this.head.length + this.count + this.tail.length;
  }
  // Faster than queue.length > 0.
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
      if (this.head !== tail) {
        this.count += tail.size;
      }
    }
    this.tail.push(value);
  }
  pop() {
    const head = this.head;
    const value = head.pop();
    if (head.isEmpty() && !head.next.isEmpty()) {
      const tail = this.tail;
      // 空になるごとの削除と再作成を避ける
      if (tail.next !== head) {
        // 初期サイズの方を消す
        tail.next.next = tail.next;
        tail.next = head;
      }
      this.head = head.next;
      if (this.head !== tail) {
        this.count -= head.next.size;
      }
    }
    return value;
  }
  clear() {
    this.head = this.tail = new FixedQueue(initsize);
    this.count = 0;
  }
  *[Symbol.iterator]() {
    while (!this.isEmpty()) {
      yield this.pop();
    }
  }
}
exports.Queue = Queue;
class FixedQueue {
  constructor(size, next) {
    this.size = size;
    this.array = Array(this.size);
    this.mask = this.array.length - 1;
    this.head = 0;
    this.tail = 0;
    // 1要素無駄にしフラグを使用しない場合と有意差がないため可読性とテスト性を優先しフラグを使用。
    this.empty = true;
    this.next = next ?? this;
  }
  get length() {
    return this.tail >= this.head ? this.empty ? 0 : this.tail - this.head || this.size : this.array.length - this.head + this.tail;
  }
  isEmpty() {
    return this.empty;
  }
  isFull() {
    return this.tail === this.head && !this.empty;
  }
  peek(index = 0) {
    return index >= 0 ? this.array[this.head + index & this.mask] : this.array[this.tail + index & this.mask];
  }
  push(value) {
    this.array[this.tail] = value;
    this.tail = this.tail + 1 & this.mask;
    this.empty = false;
  }
  pop() {
    if (this.empty) return;
    const value = this.array[this.head];
    this.array[this.head] = undefined;
    this.head = this.head + 1 & this.mask;
    // isEmptyの前倒し
    this.empty = this.tail === this.head;
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
  peek(priority) {
    return arguments.length === 0 ? this.heap.peek()?.value.peek() : this.dict.get(priority)?.peek();
  }
  push(priority, value) {
    ++this.$length;
    this.queue(priority).push(value);
  }
  pop(priority) {
    if (this.$length === 0) return;
    --this.$length;
    const queue = arguments.length === 0 ? this.heap.peek().value : this.dict.get(priority);
    const value = queue?.pop();
    if (queue?.isEmpty()) {
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
  }
}
exports.PriorityQueue = PriorityQueue;
PriorityQueue.priority = Symbol('priority');
PriorityQueue.max = heap_1.Heap.max;
PriorityQueue.min = heap_1.Heap.min;
class MultiQueue {
  constructor(entries) {
    this.dict = new Map();
    if (entries) for (const {
      0: k,
      1: v
    } of entries) {
      this.set(k, v);
    }
  }
  get length() {
    return this.dict.size;
  }
  isEmpty() {
    return this.dict.size === 0;
  }
  peek(key) {
    return this.dict.get(key)?.peek();
  }
  push(key, value) {
    let vs = this.dict.get(key);
    if (vs) return void vs.push(value);
    vs = new Queue();
    vs.push(value);
    this.dict.set(key, vs);
  }
  pop(key) {
    return this.dict.get(key)?.pop();
  }
  clear() {
    this.dict = new Map();
  }
  take(key, count) {
    if (count === undefined) return this.pop(key);
    const vs = this.dict.get(key);
    const acc = [];
    while (vs && !vs.isEmpty() && count--) {
      acc.push(vs.pop());
    }
    return acc;
  }
  ref(key) {
    let vs = this.dict.get(key);
    if (vs) return vs;
    vs = new Queue();
    this.dict.set(key, vs);
    return vs;
  }
  get size() {
    return this.length;
  }
  get(key) {
    return this.peek(key);
  }
  set(key, value) {
    this.push(key, value);
    return this;
  }
  has(key) {
    return this.dict.has(key);
  }
  delete(key) {
    return this.dict.delete(key);
  }
  *[Symbol.iterator]() {
    for (const {
      0: k,
      1: vs
    } of this.dict) {
      while (!vs.isEmpty()) {
        yield [k, vs.pop()];
      }
    }
  }
}
exports.MultiQueue = MultiQueue;

/***/ },

/***/ 3158
(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.pcg32 = exports.xorshift = exports.unique = exports.rndAf = exports.rndAP = exports.rnd0_ = exports.rnd0S = exports.rnd0Z = exports.rnd0z = exports.rnd0v = exports.rnd0f = exports.rnd09 = exports.rnd64 = exports.rnd62 = exports.rnd36 = exports.rnd32 = exports.rnd16 = exports.rnd10 = void 0;
const bases = Object.freeze([...Array(7)].map((_, i) => 1 << i));
const masks = Object.freeze(bases.map(radix => radix - 1));
const table0S = [...[...Array(36)].map((_, i) => i.toString(36)), ...[...Array(36)].map((_, i) => i.toString(36).toUpperCase()).slice(-26), '+', '/'].join('');
const table0_ = [...[...Array(36)].map((_, i) => i.toString(36)), ...[...Array(36)].map((_, i) => i.toString(36).toUpperCase()).slice(-26), '-', '_'].join('');
const tableAz = [...[...Array(36)].map((_, i) => i.toString(36).toUpperCase()).slice(-26), ...[...Array(36)].map((_, i) => i.toString(36)).slice(-26)].join('');
exports.rnd10 = cons(10);
exports.rnd16 = cons(16);
exports.rnd32 = cons(32);
exports.rnd36 = cons(36);
exports.rnd62 = cons(62);
exports.rnd64 = cons(64);
exports.rnd09 = conv(exports.rnd10, table0_, 10);
exports.rnd0f = conv(exports.rnd16, table0_, 16);
exports.rnd0v = conv(exports.rnd32, table0_, 32);
exports.rnd0z = conv(exports.rnd36, table0_, 36);
exports.rnd0Z = conv(exports.rnd62, table0_, 62);
exports.rnd0S = conv(exports.rnd64, table0S, 64);
exports.rnd0_ = conv(exports.rnd64, table0_, 64);
exports.rndAP = conv(exports.rnd16, tableAz, 16);
exports.rndAf = conv(exports.rnd32, tableAz, 32);
function unique(rng, len = 1, mem) {
  const independence = !mem;
  mem ??= new Set();
  const trials = 3;
  let prefixes;
  let prefix = '';
  return function random() {
    for (let i = 0; i < trials; ++i) {
      const r = rng(len);
      if (mem.has(r)) continue;
      try {
        mem.add(r);
      } catch (reason) {
        // ベンチマーク程度でもSetがパンクする場合がある。
        if (!independence) throw reason;
        prefixes ??= new Set();
        prefix ||= '?';
        for (let i = 0; i < trials; ++i) {
          prefix = rng(prefix.length);
          if (prefixes.has(prefix)) continue;
          prefixes.add(prefix);
          mem.clear();
          return random();
        }
        prefixes = new Set();
        prefix += '?';
        return random();
      }
      return prefix + r;
    }
    ++len;
    independence && mem.clear();
    return random();
  };
}
exports.unique = unique;
function cons(size) {
  const len = bases.findIndex(radix => radix >= size);
  return function rng() {
    const r = random(len);
    return r < size ? r : rng();
  };
}
function conv($rng, table, size) {
  return (len = 1, rng = $rng) => {
    let acc = '';
    while (len--) {
      const i = rng();
      if (i >= size) throw new Error(`Spica: Random: Invalid rng`);
      acc += table[i];
    }
    return acc;
  };
}
const buffer = new Uint16Array(512);
const digit = 16;
let index = 0;
let buf = 0;
let offset = 0;
function random(len) {
  if (offset < len) {
    if (index === 0) {
      crypto.getRandomValues(buffer);
      index = buffer.length - 1;
      buf = buffer[index];
      offset = digit;
    } else {
      buf = buf << digit | buffer[--index];
      offset += digit;
    }
  }
  offset -= len;
  return buf >> offset & masks[len];
}
function xorshift(seed = xorshift.seed()) {
  return () => {
    let x = seed;
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 15;
    return seed = x >>> 0;
  };
}
exports.xorshift = xorshift;
(function (xorshift) {
  const max = ~0 >>> 0;
  function seed() {
    return Math.random() * max + 1 >>> 0;
  }
  xorshift.seed = seed;
  function random(seed) {
    const rng = xorshift(seed);
    return () => rng() / (max + 1);
  }
  xorshift.random = random;
})(xorshift || (exports.xorshift = xorshift = {}));
const uint32n = n => n & 2n ** 32n - 1n;
const uint64n = n => n & 2n ** 64n - 1n;
// https://www.pcg-random.org/download.html
// https://github.com/imneme/pcg-c/blob/master/include/pcg_variants.h
function pcg32(seed = pcg32.seed()) {
  return () => pcg32.next(seed);
}
exports.pcg32 = pcg32;
(function (pcg32) {
  const MULT = 6364136223846793005n;
  function random(seed) {
    const rng = pcg32(seed);
    return () => rng() / 2 ** 32;
  }
  pcg32.random = random;
  function seed(state = BigInt(xorshift.seed()) << 32n | BigInt(xorshift.seed()), inc = BigInt(xorshift.seed()) << 32n | BigInt(xorshift.seed())) {
    const seed = [0n, uint64n(inc << 1n | 1n)];
    seed[0] = uint64n(seed[0] * MULT + seed[1]);
    seed[0] = uint64n(seed[0] + state);
    seed[0] = uint64n(seed[0] * MULT + seed[1]);
    return seed;
  }
  pcg32.seed = seed;
  function next(seed) {
    const oldstate = seed[0];
    seed[0] = uint64n(oldstate * MULT + seed[1]);
    const xorshifted = uint32n((oldstate >> 18n ^ oldstate) >> 27n);
    const rot = oldstate >> 59n;
    return Number(uint32n(xorshifted >> rot | xorshifted << (-rot & 31n)));
  }
  pcg32.next = next;
  function advance(seed, delta) {
    delta = uint64n(delta);
    let acc_mult = 1n;
    let acc_plus = 0n;
    let cur_mult = MULT;
    let cur_plus = seed[1];
    while (delta > 0) {
      if (delta & 1n) {
        acc_mult = uint64n(acc_mult * cur_mult);
        acc_plus = uint64n(acc_plus * cur_mult + cur_plus);
      }
      cur_plus = uint64n((cur_mult + 1n) * cur_plus);
      cur_mult = uint64n(cur_mult * cur_mult);
      delta >>= 1n;
    }
    seed[0] = uint64n(acc_mult * seed[0] + acc_plus);
    return seed;
  }
  pcg32.advance = advance;
})(pcg32 || (exports.pcg32 = pcg32 = {}));

/***/ },

/***/ 3307
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.TClock = void 0;
const alias_1 = __webpack_require__(5413);
const BASE = 32;
const DIGIT = Math.log2(BASE);
const MASK = BASE - 1;
const empty = Symbol('empty');
class TClock {
  // Capacity is rounded up to multiples of 32.
  constructor(capacity,
  // ヒット率99%で平均100bitの走査となるためこれを極端に超えない走査数に制限
  limit = BASE * 10, demotion = 8) {
    this.capacity = capacity;
    this.limit = limit;
    this.demotion = demotion;
    this.dict = new Map();
    this.keys = [];
    this.values = [];
    this.hand = 0;
    this.stock = 0;
    this.threshold = 100 / this.demotion | 0;
    this.$count = 0;
    this.$length = 0;
    this.initial = 1;
    this.capacity = ((capacity - 1 | MASK) >>> 0) + 1;
    this.refs = new Int32Array(this.capacity >>> DIGIT);
  }
  get count() {
    return this.$count;
  }
  set count(value) {
    this.$count = value;
    if (value < this.threshold) return;
    this.stock = (0, alias_1.min)(this.stock + value * this.demotion / 100, this.capacity);
    this.$count = (0, alias_1.min)(value % this.threshold, this.capacity);
  }
  get length() {
    return this.$length;
  }
  get size() {
    return this.$length;
  }
  mark(index) {
    const i = index >>> DIGIT;
    const before = this.refs[i];
    const after = before | 1 << (index & MASK);
    if (after === before) return;
    this.refs[i] = after;
  }
  unmark(index) {
    const i = index >>> DIGIT;
    const before = this.refs[i];
    const after = before & ~(1 << (index & MASK));
    if (after === before) return;
    this.refs[i] = after;
  }
  locate(hand, key, value) {
    const {
      capacity,
      dict,
      keys,
      values
    } = this;
    this.$length === capacity || this.initial === 0 && values[hand] !== empty ? dict.delete(keys[hand]) : ++this.$length;
    dict.set(key, hand);
    keys[hand] = key;
    values[hand] = value;
    this.hand = ++hand === capacity ? this.initial = 0 : hand;
  }
  add(key, value) {
    const {
      capacity,
      limit,
      refs
    } = this;
    for (let {
        hand
      } = this, i = hand >>> DIGIT, r = hand & MASK, c = 0;;) {
      const b = refs[i];
      if (b >>> r === ~0 >>> r && c < limit) {
        const d = BASE - r;
        c += d;
        hand += d;
        this.count += d;
        if (this.stock > 0) {
          refs[i] = b & (1 << r) - 1;
          this.stock -= d;
        }
        r = 0;
        if (hand < capacity) {
          ++i;
        } else {
          hand -= capacity;
          i = 0;
        }
        continue;
      }
      const l = c < limit ? search(b, r) : r;
      if (l !== r) {
        hand += l - r;
        this.count += l - r;
        if (this.stock > 0) {
          refs[i] = b & ~((1 << l) - 1 >>> r << r);
          this.stock -= l - r;
        }
      }
      this.locate(hand, key, value);
      return hand;
    }
  }
  put(key, value) {
    const index = this.dict.get(key);
    if (index === undefined) return this.add(key, value);
    this.values[index] = value;
    return index;
  }
  set(key, value) {
    this.put(key, value);
    return this;
  }
  get(key) {
    const index = this.dict.get(key);
    if (index === undefined) return;
    this.mark(index);
    return this.values[index];
  }
  has(key) {
    return this.dict.has(key);
  }
  delete(key) {
    const index = this.dict.get(key);
    if (index === undefined) return false;
    // 末尾と削除対象を交換して削除する。
    // 次の挿入の前に次の削除が行われると交換できないが稀なため対処しない。
    const {
      hand,
      dict,
      keys,
      values,
      refs
    } = this;
    dict.delete(key);
    --this.$length;
    const k = keys[index] = keys[hand];
    const v = values[index] = values[hand];
    keys[hand] = undefined;
    values[hand] = empty;
    if (index !== hand && v !== empty) {
      dict.set(k, index);
      (refs[hand >>> DIGIT] & 1 << (hand & MASK)) === 0 ? this.unmark(index) : this.mark(index);
    }
    this.unmark(hand);
    return true;
  }
  clear() {
    this.dict = new Map();
    this.keys = [];
    this.values = [];
    this.refs.fill(0);
    this.hand = 0;
    this.stock = 0;
    this.$count = 0;
    this.$length = 0;
    this.initial = 1;
  }
  *[Symbol.iterator]() {
    const {
      keys,
      values
    } = this;
    for (const index of this.dict.values()) {
      yield [keys[index], values[index]];
    }
  }
}
exports.TClock = TClock;
function search(b, r) {
  for (let l = r;; ++l) {
    if ((b & 1 << l) === 0) return l;
  }
}
function bsearch(b, r) {
  const n = ~b >>> r << r >>> 0;
  const l = potision(0x05f66a47 * (n & -n) >>> 27);
  return l;
}
//const potisions = new Uint8Array([
//  0, 1, 2, 26, 23, 3, 15, 27, 24, 21, 19, 4, 12, 16, 28, 6, 31, 25, 22, 14, 20, 18, 11, 5, 30, 13, 17, 10, 29, 9, 8, 7,
//]);
function potision(n) {
  switch (n) {
    case 0:
      return 0;
    case 1:
      return 1;
    case 2:
      return 2;
    case 3:
      return 26;
    case 4:
      return 23;
    case 5:
      return 3;
    case 6:
      return 15;
    case 7:
      return 27;
    case 8:
      return 24;
    case 9:
      return 21;
    case 10:
      return 19;
    case 11:
      return 4;
    case 12:
      return 12;
    case 13:
      return 16;
    case 14:
      return 28;
    case 15:
      return 6;
    case 16:
      return 31;
    case 17:
      return 25;
    case 18:
      return 22;
    case 19:
      return 14;
    case 20:
      return 20;
    case 21:
      return 18;
    case 22:
      return 11;
    case 23:
      return 5;
    case 24:
      return 30;
    case 25:
      return 13;
    case 26:
      return 17;
    case 27:
      return 10;
    case 28:
      return 29;
    case 29:
      return 9;
    case 30:
      return 8;
    default:
      return 7;
  }
}

/***/ },

/***/ 108
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.TLRU = void 0;
const alias_1 = __webpack_require__(5413);
const clist_1 = __webpack_require__(6212);
class Entry {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.next = undefined;
    this.prev = undefined;
  }
}
class TLRU {
  constructor(capacity, demotion = 2, window = 0, retrial = true,
  // ヒットにより前方が増えるためstep=100では不足する。
  pure = demotion >= 100) {
    this.capacity = capacity;
    this.demotion = demotion;
    this.window = window;
    this.retrial = retrial;
    this.pure = pure;
    this.dict = new Map();
    this.list = new clist_1.List();
    this.handV = undefined;
    this.handG = undefined;
    this.count = 0;
  }
  get length() {
    return this.list.length;
  }
  get size() {
    return this.list.length;
  }
  extend() {
    const {
      list
    } = this;
    // 1周できる

    this.count = -(0, alias_1.max)(
    //list.length * this.demotion / 100 / max(this.count / list.length * this.demotion, 1) | 0,
    (list.length - this.count) * this.demotion / 100 | 0, list.length * this.window / 100 - this.count | 0, this.demotion && 1);
  }
  replace(key, value) {
    const {
      dict,
      list
    } = this;
    this.handV ??= list.last;
    if (this.handV === this.handG && this.count >= 0) {
      this.extend();
    }
    // 非延命
    if (this.count >= 0 || this.handV === list.last || !this.retrial) {
      const entry = this.handV;
      dict.delete(entry.key);
      dict.set(key, entry);
      entry.key = key;
      entry.value = value;
    }
    // 延命
    else {
      const entry = list.last;
      dict.delete(entry.key);
      dict.set(key, entry);
      entry.key = key;
      entry.value = value;
      this.escape(entry);
      list.delete(entry);
      if (this.handG !== list.head) {
        list.insert(entry, this.handG);
      } else {
        list.unshift(entry);
      }
      this.handV = entry;
      this.handG = entry;
    }
    if (this.count < 0) {
      this.handG = this.handG !== list.head ? this.handG.prev : undefined;
    }
    if (this.handV !== this.handG) {
      this.handV = this.handV.prev;
    }
    if (this.handV === list.last || this.count === -1) {
      this.handV = list.last;
      this.count = 0;
    } else {
      ++this.count;
    }
  }
  evict() {
    const {
      list
    } = this;
    const entry = this.handV ?? list.last;
    if (entry === undefined) return;
    this.delete(entry.key);
    return [entry.key, entry.value];
  }
  add(key, value) {
    const {
      dict,
      list
    } = this;
    if (list.length === this.capacity) {
      this.replace(key, value);
    } else {
      const entry = new Entry(key, value);
      dict.set(key, entry);
      if (this.pure && this.handG !== undefined) {
        // 純粋なTLRUの検証用。
        list.insert(entry, this.handG.next);
      } else if (this.handV !== undefined) {
        // 基本的にこのほうがヒット率が高い。
        list.insert(entry, this.handV.next);
      } else {
        list.unshift(entry);
      }
    }
    return true;
  }
  set(key, value) {
    const entry = this.dict.get(key);
    if (entry === undefined) {
      this.add(key, value);
    } else {
      entry.value = value;
    }
    return this;
  }
  escape(entry) {
    const {
      list
    } = this;
    if (list.length === 1) {
      this.handV = undefined;
      this.handG = undefined;
      this.count = 0;
      return;
    }
    if (entry === this.handV) {
      this.handV = this.handV.prev;
    }
    if (entry === this.handG) {
      this.handG = this.handG.prev;
    }
  }
  get(key) {
    const {
      dict,
      list
    } = this;
    const entry = dict.get(key);
    if (entry === undefined) return;
    if (entry !== list.head) {
      this.escape(entry);
      list.delete(entry);
      list.unshift(entry);
    }
    this.handG ??= entry;
    return entry.value;
  }
  has(key) {
    return this.dict.has(key);
  }
  delete(key) {
    const {
      dict,
      list
    } = this;
    const entry = dict.get(key);
    if (entry === undefined) return false;
    if (entry === this.handG && entry === list.head) {
      this.handG = undefined;
    }
    this.escape(entry);
    list.delete(entry);
    return dict.delete(key);
  }
  clear() {
    this.dict.clear();
    this.list.clear();
    this.handV = undefined;
    this.handG = undefined;
    this.count = 0;
  }
  *[Symbol.iterator]() {
    for (const {
      key,
      value
    } of this.list) {
      yield [key, value];
    }
  }
}
exports.TLRU = TLRU;

/***/ },

/***/ 8888
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


// TLRU: True LRU
// TRC: True Recency-based Cache
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
__exportStar(__webpack_require__(108), exports);
/*
真に最近性に基づく真のLRU。
最近性には有参照間、無参照間、有無参照間の3つがある。
LRUは有無参照間の最近性を喪失しClockは有参照間の最近性を喪失する。
TLRUはすべての最近性を保持する。
パラメータを調整しやすく用途に合わせてヒット率を上げやすい。
stepパラメータはヒットエントリを重み付けおよび保護しており
demotion=100で重み付けと保護なしの純粋なTLRUを設定できる。
windowパラメータでSLRU同様捕捉可能最小再利用距離を設定できるが
降格区間内では捕捉可能再利用距離が半減しSLRUより短くなる。
DWCより高速かつ堅牢でアプリケーションのインメモリキャッシュなどの
極端に変化の大きいアクセスパターンにも適応する。

*/
/*
LRUとClockは偽の最近性に基づく誤ったアルゴリズムにより性能が大幅に低下する。
真の最近性は偽の最近性よりも非常に優れている。

エントリ間の最近性関係には使用済みと使用済み、使用済みと未使用、未使用と未使用の3種類がある。
ただしLRUとClockは一部の最近性に違反する。真のLRUはすべての最近性を維持することにより
LRUとClockよりも優れた性能を発揮する。

LRUの根本的誤りは新しいエントリを最近使用されたと見なすことである。実際それがキャッシュ内で
使用されたことはない。従って新しいエントリは実際に使用されたエントリの後ろに追加する必要がある。

```
Sequence: 1, 2, 3, 3, 2, 4

LRU

  MRU |4 2 3 1| LRU
  Hit |0 1 1 0|
        ^ Violation of the recency between used and unused.

Clock

  N-1 |4 3 2 1| 0
  Hit |0 1 1 0|
          ^ Violation of the recency between used and used.

True LRU

  MRU |2 3 4 1| LRU
  Hit |1 1 0 0|
        ^ ^ ^ Ideal recency(Recency-complete).
```

この最近性はClockですでに使用され普及していることから奇異でも不合理でもないことが証明されて
おりLRUよりClockの方がヒット率が同等または非常に高いことから使用済みエントリ間の最近性より
未使用エントリとの最近性の方が効果が高く重要であることがわかる。

またClockはLRUの近似アルゴリズムとして知られているがLRUとClockはこのように異なる種類の最近性
に基づくアルゴリズムであることからClockは実際にはLRUの近似アルゴリズムではなく異なる種類の
最近性に基づくまったく異なる最近性基準アルゴリズムである。

|Algorithm|Used-Used|Used-Unused|Unused-Unused|
|:-------:|:-------:|:---------:|:-----------:|
|LRU      |✓        |           |✓           |
|Clock    |         |✓          |✓           |
|True LRU |✓        |✓          |✓           |

再利用距離と同様に使用済みと未使用の最近性には有限と無限の差があり差を埋める方法には
様々な方法が考えられこの調整可能性はTrue LRUとClockにのみ存在しLRUには存在しない。

True LRUにおけるLRUからの大幅な改善はすべてのアルゴリズムの改善の過半が未使用のエントリを
偶然削除したことによるものを独自の改善として混同および錯覚したものであり各アルゴリズムの
独自性による改善は小さいか半分に満たないことを示している。True LRUをLRUの代わりに真の
ベースラインとすると他のアルゴリズムは特に汎用性においてあまり魅力的な性能を達成していない。

*/

/***/ },

/***/ 113
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.isPrimitive = exports.is = exports.type = void 0;
const alias_1 = __webpack_require__(5413);
const ObjectPrototype = Object.prototype;
const ArrayPrototype = Array.prototype;
function type(value) {
  const type = typeof value;
  switch (type) {
    case 'function':
      return 'Function';
    case 'object':
      if (value === null) return 'null';
      const tag = value[Symbol.toStringTag];
      if (tag) return tag;
      switch ((0, alias_1.ObjectGetPrototypeOf)(value)) {
        case ArrayPrototype:
          return 'Array';
        case ObjectPrototype:
          return 'Object';
        default:
          return value?.constructor?.name || (0, alias_1.toString)(value).slice(8, -1);
      }
    default:
      return type;
  }
}
exports.type = type;
function is(type, value) {
  switch (type) {
    case 'null':
      return value === null;
    case 'array':
      return (0, alias_1.isArray)(value);
    case 'object':
      return value !== null && typeof value === type;
    default:
      return typeof value === type;
  }
}
exports.is = is;
function isPrimitive(value) {
  switch (typeof value) {
    case 'function':
      return false;
    case 'object':
      return value === null;
    default:
      return true;
  }
}
exports.isPrimitive = isPrimitive;

/***/ },

/***/ 1904
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.URL = exports.ReadonlyURL = exports.standardize = void 0;
const internal_1 = __webpack_require__(1094);
var internal_2 = __webpack_require__(1094);
Object.defineProperty(exports, "standardize", ({
  enumerable: true,
  get: function () {
    return internal_2.standardize;
  }
}));
var internal_3 = __webpack_require__(1094);
Object.defineProperty(exports, "ReadonlyURL", ({
  enumerable: true,
  get: function () {
    return internal_3.ReadonlyURL;
  }
}));
class URL {
  constructor(source, base) {
    source = source.trim();
    base = base?.trim();
    this.url = new internal_1.ReadonlyURL(source, base);
    this.params = undefined;
    this.source = source;
    this.base = base;

    //assert(this.href.startsWith(this.resource));
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
    return this.url.scheme;
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
    return this.params ??= new URLSearchParams(this.search);
  }
  toString() {
    return this.url.toString();
  }
  toJSON() {
    return this.url.toJSON();
  }
}
exports.URL = URL;

/***/ },

/***/ 1094
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.ReadonlyURL = exports.encode = exports.standardize = void 0;
__webpack_require__(518);
const memoize_1 = __webpack_require__(6925);
const tlru_1 = __webpack_require__(8888);
function standardize(url, base) {
  const {
    origin,
    protocol,
    href
  } = new ReadonlyURL(url, base);
  url = origin === 'null' ? protocol.toLowerCase() + href.slice(protocol.length) : origin.toLowerCase() + href.slice(origin.length);
  return encode(url);
}
exports.standardize = standardize;
function encode(url) {
  url = url.replace(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g, '');
  const {
    1: base,
    2: hash
  } = url.match(/^([^#]*)(.*)$/s);
  const {
    1: path,
    2: query
  } = base.replace(/(?:%(?:[0-9][a-f]|[a-f][0-9a-fA-F]|[A-F][0-9a-f]))+/g, str => str.toUpperCase()).match(/^([^?]*)(.*)$/s);
  return '' + path.replace(/(?:[^%[\]]|%(?![0-9A-F]{2}))+/ig, encodeURI) + query.replace(/(?!^)(?:[^%=&]|%(?![0-9A-F]{2}))+/ig, encodeURIComponent) + hash;
}
exports.encode = encode;
class ReadonlyURL {
  constructor(source, base) {
    source = source.trim();
    base = base?.trim();
    switch (source.slice(0, source.lastIndexOf('://', 9) + 1).toLowerCase()) {
      case 'http:':
      case 'https:':
        base = undefined;
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
            if (j > -1 && source !== '' && source[0] !== '#') {
              base = base.slice(0, j);
            }
        }
    }
    this.cache = ReadonlyURL.get(source, base);
    this.params = undefined;
    this.source = source;
    this.base = base;
  }
  get href() {
    return this.cache.href ??= this.cache.url.href;
  }
  get resource() {
    return this.cache.resource ??= this.href.slice(0, this.href.search(/[?#]|$/)) + this.search;
  }
  get origin() {
    return this.cache.origin ??= this.cache.url.origin;
  }
  get scheme() {
    return this.cache.scheme ??= this.protocol.slice(0, -1);
  }
  get protocol() {
    return this.cache.protocol ??= this.cache.url.protocol;
  }
  get username() {
    return this.cache.username ??= this.cache.url.username;
  }
  get password() {
    return this.cache.password ??= this.cache.url.password;
  }
  get host() {
    return this.cache.host ??= this.cache.url.host;
  }
  get hostname() {
    return this.cache.hostname ??= this.cache.url.hostname;
  }
  get port() {
    return this.cache.port ??= this.cache.url.port;
  }
  get path() {
    return this.cache.path ??= `${this.pathname}${this.search}`;
  }
  get pathname() {
    return this.cache.pathname ??= this.cache.url.pathname;
  }
  get search() {
    return this.cache.search ??= this.cache.url.search;
  }
  get query() {
    return this.cache.query ??= this.search || this.href[this.href.length - this.fragment.length - 1] === '?' && '?' || '';
  }
  get hash() {
    return this.cache.hash ??= this.cache.url.hash;
  }
  get fragment() {
    return this.cache.fragment ??= this.hash || this.href[this.href.length - 1] === '#' && '#' || '';
  }
  get searchParams() {
    return this.params ??= new ReadonlyURLSearchParams(this.search);
  }
  toString() {
    return this.href;
  }
  toJSON() {
    return this.href;
  }
}
exports.ReadonlyURL = ReadonlyURL;
// Can't freeze URL object in the Firefox extension environment.
// ref: https://github.com/falsandtru/pjax-api/issues/44#issuecomment-633915035
// Bug: Error in dependents.
// @ts-ignore
ReadonlyURL.get = (0, memoize_1.memoize)((url, base) => ({
  url: new __webpack_require__.g.URL(url, base)
}), (url, base = '') => `${base.indexOf('\n') > -1 ? base.replace(/\n+/g, '') : base}\n${url}`, new tlru_1.TLRU(10000));
class ReadonlyURLSearchParams extends URLSearchParams {
  append(name, value) {
    this.sort();
    name;
    value;
  }
  delete(name, value) {
    this.sort();
    name;
    value;
  }
  set(name, value) {
    this.sort();
    name;
    value;
  }
  sort() {
    throw new Error('Spica: URL: Cannot use mutable methods with ReadonlyURLSearchParams');
  }
}

/***/ },

/***/ 3484
(__unused_webpack_module, exports, __webpack_require__) {

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
__exportStar(__webpack_require__(2369), exports);
__exportStar(__webpack_require__(2861), exports);
__exportStar(__webpack_require__(765), exports);
__exportStar(__webpack_require__(3989), exports);
__exportStar(__webpack_require__(7429), exports);
__exportStar(__webpack_require__(2148), exports);
__exportStar(__webpack_require__(5745), exports);
__exportStar(__webpack_require__(8212), exports);
__exportStar(__webpack_require__(8287), exports);
__exportStar(__webpack_require__(4271), exports);
__exportStar(__webpack_require__(7190), exports);
__exportStar(__webpack_require__(549), exports);
__exportStar(__webpack_require__(7723), exports);
__exportStar(__webpack_require__(8606), exports);
__exportStar(__webpack_require__(5781), exports);
__exportStar(__webpack_require__(1638), exports);
__exportStar(__webpack_require__(6572), exports);
__exportStar(__webpack_require__(4750), exports);
__exportStar(__webpack_require__(2217), exports);
__exportStar(__webpack_require__(5117), exports);
__exportStar(__webpack_require__(1672), exports);
__exportStar(__webpack_require__(6981), exports);
__exportStar(__webpack_require__(2705), exports);
__exportStar(__webpack_require__(994), exports);

/***/ },

/***/ 8212
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.block = void 0;
const parser_1 = __webpack_require__(605);
const line_1 = __webpack_require__(8287);
function block(parser, separation = true, segment = 0) {
  return (0, parser_1.failsafe)(input => {
    const context = input;
    const {
      source,
      position
    } = context;
    if (position === source.length) return;
    if (segment !== 0 && context.segment & 1 /* Segment.write */) {
      if (context.segment !== (segment | 1 /* Segment.write */)) return;
      context.position = source.length;
      return new parser_1.List();
    }
    const result = parser(input);
    if (result === undefined) return;
    if (separation && !(0, line_1.isEmptyline)(source, context.position)) return;
    if (segment !== 0 && context.segment & 1 /* Segment.write */ ^ 1 /* Segment.write */) {
      context.segment = segment;
    }
    return result;
  });
}
exports.block = block;

/***/ },

/***/ 4271
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.verify = exports.validate = void 0;
const delimiter_1 = __webpack_require__(385);
const bind_1 = __webpack_require__(994);
function validate(pattern, parser) {
  if (typeof pattern === 'function') return guard(pattern, parser);
  const test = (0, delimiter_1.tester)(pattern, false);
  return input => test(input) && parser(input);
}
exports.validate = validate;
function guard(f, parser) {
  return input => f(input) ? parser(input) : undefined;
}
function verify(parser, cond) {
  return (0, bind_1.bind)(parser, (nodes, context) => cond(nodes, context) ? nodes : undefined);
}
exports.verify = verify;

/***/ },

/***/ 8287
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.isEmptyline = exports.firstline = exports.line = void 0;
const parser_1 = __webpack_require__(605);
function line(parser) {
  return (0, parser_1.failsafe)(context => {
    const {
      source,
      position
    } = context;
    if (position === source.length) return;
    const line = firstline(source, position);
    context.offset += position;
    const result = parser((0, parser_1.input)(line, context));
    context.position += position;
    context.position += result && context.position === position ? line.length : 0;
    context.source = source;
    context.offset -= position;
    if (result === undefined) return;
    if (context.position < position + line.length && !isEmptyline(source, context.position)) return;
    context.position = position + line.length;
    return result;
  });
}
exports.line = line;
function firstline(source, position) {
  const i = source.indexOf('\n', position);
  return i === -1 ? source.slice(position) : source.slice(position, i + 1);
}
exports.firstline = firstline;
const emptyline = /[^\S\n]*(?:$|\n)/y;
function isEmptyline(source, position) {
  emptyline.lastIndex = position;
  return source.length === position || source[position] === '\n' || emptyline.test(source);
}
exports.isEmptyline = isEmptyline;

/***/ },

/***/ 8606
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.clear = void 0;
const parser_1 = __webpack_require__(605);
function clear(parser) {
  return input => parser(input) && new parser_1.List();
}
exports.clear = clear;

/***/ },

/***/ 6572
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.convert = void 0;
const parser_1 = __webpack_require__(605);
function convert(conv, parser, empty = false) {
  return (0, parser_1.failsafe)(input => {
    const context = input;
    const {
      source,
      position
    } = context;
    if (position === source.length) return;
    const src = conv(source.slice(position), context);
    if (src === '') {
      if (!empty) return;
      context.position = source.length;
      return new parser_1.List();
    }
    const {
      offset,
      backtracks
    } = context;
    const result = parser((0, parser_1.subinput)(src, context));
    context.position = context.source.length;
    return result;
  });
}
exports.convert = convert;

/***/ },

/***/ 4750
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.dup = void 0;
const parser_1 = __webpack_require__(605);
const fmap_1 = __webpack_require__(2705);
function dup(parser) {
  return (0, fmap_1.fmap)(parser, nodes => new parser_1.List([new parser_1.Node(nodes)]));
}
exports.dup = dup;

/***/ },

/***/ 5117
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.fallback = void 0;
const union_1 = __webpack_require__(2369);
function fallback(parser, otherwise) {
  return (0, union_1.union)([parser, otherwise]);
}
exports.fallback = fallback;

/***/ },

/***/ 7190
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.fence = void 0;
const parser_1 = __webpack_require__(605);
const combinator_1 = __webpack_require__(3484);
const line_1 = __webpack_require__(8287);
const array_1 = __webpack_require__(6876);
function fence(opener, limit, separation = true) {
  return (0, parser_1.failsafe)(input => {
    const context = input;
    const {
      source,
      position
    } = context;
    if (position === source.length) return;
    opener.lastIndex = position;
    const matches = opener.exec(source);
    if (!matches) return;
    (0, combinator_1.consume)(matches[0].length, context);
    const delim = matches[1];
    if (matches[0].includes(delim, delim.length)) return;
    context.position += matches[0].length;
    // Prevent annoying parsing in editing.
    const secondline = (0, line_1.firstline)(source, context.position);
    if ((0, line_1.isEmptyline)(secondline, 0) && (0, line_1.firstline)(source, context.position + secondline.length).trimEnd() !== delim) return;
    let block = '';
    let closer = '';
    let overflow = '';
    for (let count = 1;; ++count) {
      if (context.position === source.length) break;
      const line = (0, line_1.firstline)(source, context.position);
      if ((closer || count > limit + 1) && (0, line_1.isEmptyline)(line, 0)) break;
      if (closer) {
        overflow += line;
      }
      if (!closer && count <= limit + 1 && line.slice(0, delim.length) === delim && line.trimEnd() === delim) {
        closer = line;
        if ((0, line_1.isEmptyline)(source, context.position + line.length)) {
          context.position += line.length;
          break;
        }
        if (!separation) {
          context.position += line.length;
          break;
        }
        overflow = line;
      }
      if (!overflow) {
        block += line;
      }
      context.position += line.length;
    }
    return new parser_1.List((0, array_1.push)([block, overflow, closer], matches).map(str => new parser_1.Node(str)));
  });
}
exports.fence = fence;

/***/ },

/***/ 549
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.indent = void 0;
const parser_1 = __webpack_require__(605);
const some_1 = __webpack_require__(2148);
const block_1 = __webpack_require__(8212);
const line_1 = __webpack_require__(8287);
const bind_1 = __webpack_require__(994);
const match_1 = __webpack_require__(1638);
const surround_1 = __webpack_require__(5781);
const memoize_1 = __webpack_require__(6925);
function indent(opener, parser = false, separation = false) {
  if (typeof opener === 'function') {
    separation = parser;
    parser = opener;
    opener = / {1,4}|\t{1,2}/y;
  }
  return (0, parser_1.failsafe)((0, bind_1.bind)((0, block_1.block)((0, match_1.match)(opener, (0, memoize_1.memoize)(([indent]) => (0, some_1.some)((0, line_1.line)((0, surround_1.open)(indent, context => {
    const {
      source,
      position
    } = context;
    context.position = source.length;
    return new parser_1.List([new parser_1.Node(source.slice(position))]);
  }))), ([indent]) => indent.length * 2 + -(indent[0] === ' '), [], 2 ** 4 - 1)), separation), (lines, context) => parser((0, parser_1.subinput)(trimBlockEnd(lines.foldl((acc, node) => acc + node.value, '')), context))));
}
exports.indent = indent;
function trimBlockEnd(block) {
  return block === '' || block.at(-1) !== '\n' ? block : block.slice(0, -1);
}

/***/ },

/***/ 6981
(__unused_webpack_module, exports) {

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

/***/ },

/***/ 1638
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.match = void 0;
const parser_1 = __webpack_require__(605);
const combinator_1 = __webpack_require__(3484);
function match(pattern, f) {
  const count = typeof pattern === 'object' ? /[^^\\*+][*+]/.test(pattern.source) : false;
  return (0, parser_1.failsafe)(input => {
    const context = input;
    const {
      source,
      position
    } = context;
    if (position === source.length) return;
    pattern.lastIndex = position;
    const params = pattern.exec(source);
    if (!params) return;
    count && (0, combinator_1.consume)(params[0].length, context);
    const result = f(params)(input);
    context.position += result && context.position === position ? params[0].length : 0;
    return result;
  });
}
exports.match = match;

/***/ },

/***/ 1672
(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.recover = void 0;
function recover(parser, catcher) {
  return input => {
    const context = input;
    const {
      source,
      position
    } = context;
    try {
      return parser(input);
    } catch (reason) {
      context.source = source;
      context.position = position;
      return catcher(input, reason);
    }
  };
}
exports.recover = recover;

/***/ },

/***/ 2217
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.reverse = void 0;
const parser_1 = __webpack_require__(605);
const fmap_1 = __webpack_require__(2705);
function reverse(parser) {
  return (0, fmap_1.fmap)(parser, nodes => nodes.foldr((node, acc) => acc.push(nodes.delete(node)) && acc, new parser_1.List()));
}
exports.reverse = reverse;

/***/ },

/***/ 7723
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.rewrite = exports.focus = void 0;
const parser_1 = __webpack_require__(605);
const delimiter_1 = __webpack_require__(385);
function focus(scope, parser, slice = true) {
  const match = (0, delimiter_1.matcher)(scope, false);
  return (0, parser_1.failsafe)(context => {
    const {
      source,
      position
    } = context;
    if (position === source.length) return;
    const src = match(context)?.head?.value ?? '';
    if (src === '') return;
    const range = context.range = src.length;
    if (!slice) {
      const result = parser(context);
      context.position += result && context.position === position ? range : 0;
      return result;
    }
    context.offset += position;
    const result = parser((0, parser_1.input)(src, context));
    context.position += position;
    context.position += result && context.position === position ? src.length : 0;
    context.source = source;
    context.offset -= position;
    return result;
  });
}
exports.focus = focus;
function rewrite(scope, parser, slice = true) {
  return (0, parser_1.failsafe)(context => {
    const {
      source,
      position
    } = context;
    if (position === source.length) return;
    const res1 = scope(context);
    if (res1 === undefined || context.position < position) return;
    const range = context.range = context.position - position;
    if (!slice) {
      context.position = position;
      const res2 = parser(context);
      context.position += res2 && context.position === position ? range : 0;
      return res2;
    }
    const src = source.slice(position, context.position);
    context.offset += position;
    const res2 = parser((0, parser_1.input)(src, context));
    context.position += position;
    context.position += res2 && context.position === position ? src.length : 0;
    context.source = source;
    context.offset -= position;
    return res2;
  });
}
exports.rewrite = rewrite;

/***/ },

/***/ 5781
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.setBacktrack = exports.isBacktrack = exports.close = exports.open = exports.surround = void 0;
const parser_1 = __webpack_require__(605);
const delimiter_1 = __webpack_require__(385);
function surround(opener, parser, closer, optional = false, backtracks = [], f, g) {
  switch (typeof opener) {
    case 'string':
    case 'object':
      opener = (0, delimiter_1.tester)(opener, true);
  }
  switch (typeof parser) {
    case 'string':
    case 'object':
      parser = (0, delimiter_1.tester)(parser, true);
  }
  switch (typeof closer) {
    case 'string':
    case 'object':
      closer = (0, delimiter_1.tester)(closer, true);
  }
  const [blen, rbs, wbs] = reduce(backtracks);
  return (0, parser_1.failsafe)(input => {
    const context = input;
    const {
      source,
      position
    } = context;
    if (position === source.length) return;
    const {
      linebreak
    } = context;
    context.linebreak = 0;
    const nodesO = opener(input);
    if (nodesO === undefined) {
      return void revert(context, linebreak);
    }
    if (rbs && isBacktrack(context, rbs, position, blen)) {
      return void revert(context, linebreak);
    }
    const nodesM = context.position < source.length ? parser(input) : undefined;
    context.range = context.position - position;
    if (nodesM === undefined && !optional) {
      wbs && setBacktrack(context, wbs, position);
      const result = g?.([nodesO, nodesM], context);
      return result || void revert(context, linebreak);
    }
    const nodesC = optional || nodesM ? closer(input) : undefined;
    context.range = context.position - position;
    if (nodesC === undefined) {
      wbs && setBacktrack(context, wbs, position);
      const result = g?.([nodesO, nodesM], context);
      return result || void revert(context, linebreak);
    }
    if (context.position === position) {
      return void revert(context, linebreak);
    }
    context.range = context.position - position;
    const result = f ? f([nodesO, nodesM, nodesC], context) : nodesM ? nodesO.import(nodesM).import(nodesC) : nodesO.import(nodesC);
    if (result) {
      context.linebreak ||= linebreak;
    }
    return result || void revert(context, linebreak);
  });
}
exports.surround = surround;
function open(opener, parser, optional, backtracks = []) {
  return surround(opener, parser, '', optional, backtracks);
}
exports.open = open;
function close(parser, closer, optional, backtracks = []) {
  return surround('', parser, closer, optional, backtracks);
}
exports.close = close;
const commandsize = 2;
function isBacktrack(context, backtrack, position = context.position, length = 1) {
  const {
    backtracks,
    offset
  } = context;
  for (let i = 0; i < length; ++i) {
    if (backtracks[position + i + offset] & backtrack >>> commandsize) return true;
  }
  return false;
}
exports.isBacktrack = isBacktrack;
function setBacktrack(context, backtrack, position, length = 1) {
  // バックトラックの可能性がなく記録不要の場合もあるが判別が面倒なので省略

  const {
    backtracks,
    offset
  } = context;
  for (let i = 0; i < length; ++i) {
    backtracks[position + i + offset] |= backtrack >>> commandsize;
  }
}
exports.setBacktrack = setBacktrack;
function reduce(backtracks) {
  let len = 1;
  let rbs = 0;
  let wbs = 0;
  for (const backtrack of backtracks) {
    if (backtrack >>> commandsize === 0) {
      len = backtrack;
      continue;
    }
    if (1 & backtrack) {
      rbs |= backtrack;
    }
    if (2 & backtrack) {
      wbs |= backtrack;
    }
  }
  return [len, rbs, wbs];
}
function revert(context, linebreak) {
  context.linebreak = linebreak;
}

/***/ },

/***/ 994
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.bind = void 0;
const parser_1 = __webpack_require__(605);
function bind(parser, f) {
  return (0, parser_1.failsafe)(input => {
    const context = input;
    const {
      source,
      position
    } = context;
    if (position === source.length) return;
    const result = parser(input);
    if (result === undefined) return;
    context.range = context.position - position;
    return f(result, context);
  });
}
exports.bind = bind;

/***/ },

/***/ 2705
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.fmap = void 0;
const bind_1 = __webpack_require__(994);
function fmap(parser, f) {
  return (0, bind_1.bind)(parser, (nodes, context) => f(nodes, context));
}
exports.fmap = fmap;

/***/ },

/***/ 385
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.tester = exports.matcher = exports.Delimiters = void 0;
const parser_1 = __webpack_require__(605);
const context_1 = __webpack_require__(5745);
class Delimiters {
  constructor() {
    this.tree = {};
    this.map = new Map();
    this.delimiters = [];
    this.stack = [];
    this.states = [];
  }
  // 手間を惜しまなければ規定のパターンはすべて配列のインデクスに変換可能。
  static signature(pattern) {
    switch (typeof pattern) {
      case 'undefined':
        return 1 << 7;
      case 'string':
        if (pattern.length === 1) {
          const code = pattern.charCodeAt(0);
          return code;
        }
        return `s:${pattern}`;
      case 'object':
        return `r/${pattern.source}`;
    }
  }
  static matcher(pattern, after) {
    switch (typeof pattern) {
      case 'undefined':
        return () => undefined;
      case 'string':
      case 'object':
        const test = tester(pattern, false);
        const verify = after ? tester(after, false) : undefined;
        return verify ? input => test(input) !== undefined && verify(input) !== undefined || undefined : input => test(input) !== undefined || undefined;
    }
  }
  registry(signature) {
    if (typeof signature === 'number') {
      return this.tree[signature] ??= [];
    } else {
      const ds = this.map.get(signature);
      if (ds) return ds;
      const blank = [];
      this.map.set(signature, blank);
      return blank;
    }
  }
  push(delims) {
    const {
      delimiters,
      stack
    } = this;
    // シグネチャ数以下

    for (let i = 0; i < delims.length; ++i) {
      const {
        signature,
        matcher,
        precedence
      } = delims[i];
      const memory = this.registry(signature);
      const index = memory[0]?.index ?? delimiters.length;
      if (memory.length === 0) {
        const delimiter = {
          memory,
          index,
          signature,
          matcher,
          precedence,
          state: true
        };
        delimiters[index] = delimiter;
        memory.push(delimiter);
        stack.push(index);
      } else {
        stack.push(-1);
      }
      // 現状各優先順位は固定
    }
  }
  pop(count) {
    const {
      delimiters,
      stack
    } = this;
    for (let i = 0; i < count; ++i) {
      const index = stack.pop();
      if (index === -1) continue;
      const {
        memory
      } = delimiters[index];
      if (memory.length === 1) {
        memory.pop();
        delimiters.pop();
      } else {
        memory.pop();
        delimiters[index] = memory.at(-1);
      }
    }
  }
  shift(precedence) {
    const {
      delimiters
    } = this;
    const indexes = [];
    for (let i = delimiters.length; i--;) {
      const delimiter = delimiters[i];
      if (delimiter.precedence >= precedence || !delimiter.state) continue;
      delimiter.state = false;
      indexes.push(i);
    }
    this.states.push(indexes);
  }
  unshift() {
    const {
      delimiters
    } = this;
    const indexes = this.states.pop();
    for (let i = indexes.length; i--;) {
      delimiters[indexes[i]].state = true;
    }
  }
  match(input) {
    const {
      precedence
    } = input;
    const {
      delimiters
    } = this;
    for (let i = delimiters.length; i--;) {
      const delimiter = delimiters[i];
      if (delimiter.precedence <= precedence || !delimiter.state) continue;
      switch (delimiter.matcher(input)) {
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
function matcher(pattern, advance, after) {
  const count = typeof pattern === 'object' ? /[^^\\*+][*+]/.test(pattern.source) : false;
  switch (typeof pattern) {
    case 'string':
      if (pattern === '') return () => new parser_1.List([new parser_1.Node(pattern)]);
      return input => {
        const context = input;
        const {
          source,
          position
        } = context;
        if (!source.startsWith(pattern, position)) return;
        if (advance) {
          context.position += pattern.length;
        }
        const next = after?.(input);
        return after ? next && new parser_1.List([new parser_1.Node(pattern)]).import(next) : new parser_1.List([new parser_1.Node(pattern)]);
      };
    case 'object':
      return input => {
        const context = input;
        const {
          source,
          position
        } = context;
        pattern.lastIndex = position;
        if (!pattern.test(source)) return;
        const src = source.slice(position, pattern.lastIndex);
        count && (0, context_1.consume)(src.length, context);
        if (advance) {
          context.position += src.length;
        }
        const next = after?.(input);
        return after ? next && new parser_1.List([new parser_1.Node(src)]).import(next) : new parser_1.List([new parser_1.Node(src)]);
      };
  }
}
exports.matcher = matcher;
function tester(pattern, advance, after) {
  const count = typeof pattern === 'object' ? /[^^\\*+][*+]/.test(pattern.source) : false;
  switch (typeof pattern) {
    case 'string':
      if (pattern === '') return () => new parser_1.List();
      return input => {
        const context = input;
        const {
          source,
          position
        } = context;
        if (!source.startsWith(pattern, position)) return;
        if (advance) {
          context.position += pattern.length;
        }
        if (after && after(input) === undefined) return;
        return new parser_1.List();
      };
    case 'object':
      return input => {
        const context = input;
        const {
          source,
          position
        } = context;
        pattern.lastIndex = position;
        if (!pattern.test(source)) return;
        const len = pattern.lastIndex - position;
        count && (0, context_1.consume)(len, context);
        if (advance) {
          context.position += len;
        }
        if (after && after(input) === undefined) return;
        return new parser_1.List();
      };
  }
}
exports.tester = tester;

/***/ },

/***/ 1610
(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.List = void 0;
class List {
  constructor(nodes) {
    this.length = 0;
    this.head = undefined;
    this.last = undefined;
    if (nodes === undefined) return;
    for (let i = 0; i < nodes.length; ++i) {
      this.push(nodes[i]);
    }
  }
  get tail() {
    return this.head?.next;
  }
  insert(node, before) {
    if (before === undefined) return this.push(node);
    if (before === this.head) return this.unshift(node);
    if (++this.length === 1) {
      return this.head = this.last = node;
    }
    const next = node.next = before;
    const prev = node.prev = next.prev;
    return next.prev = prev.next = node;
  }
  delete(node) {
    if (--this.length === 0) {
      this.head = this.last = undefined;
    } else {
      const {
        next,
        prev
      } = node;
      prev === undefined ? this.head = next : prev.next = next;
      next === undefined ? this.last = prev : next.prev = prev;
    }
    node.next = node.prev = undefined;
    return node;
  }
  unshift(node) {
    if (++this.length === 1) {
      return this.head = this.last = node;
    }
    node.next = this.head;
    return this.head = this.head.prev = node;
  }
  push(node) {
    if (++this.length === 1) {
      return this.head = this.last = node;
    }
    node.prev = this.last;
    return this.last = this.last.next = node;
  }
  shift() {
    if (this.length === 0) return;
    return this.delete(this.head);
  }
  pop() {
    if (this.length === 0) return;
    return this.delete(this.last);
  }
  import(list, before) {
    if (list.length === 0) return this;
    if (this.length === 0) {
      this.head = list.head;
      this.last = list.last;
      this.length = list.length;
      list.clear();
      return this;
    }
    const head = list.head;
    const last = list.last;
    const next = last.next = before;
    const prev = head.prev = before?.prev ?? this.last;
    next === undefined ? this.last = last : next.prev = last;
    prev.next = head;
    this.length += list.length;
    list.clear();
    return this;
  }
  clear() {
    this.length = 0;
    this.head = this.last = undefined;
  }
  *[Symbol.iterator]() {
    for (let node = this.head; node && this.head;) {
      const next = node.next;
      yield node;
      node = next;
    }
  }
  flatMap(f) {
    const acc = new List();
    for (let node = this.head; node && this.head;) {
      const next = node.next;
      acc.import(f(node));
      node = next;
    }
    return acc;
  }
  foldl(f, acc) {
    for (let node = this.head; node && this.head;) {
      const next = node.next;
      acc = f(acc, node);
      node = next;
    }
    return acc;
  }
  foldr(f, acc) {
    for (let node = this.last; node && this.head;) {
      const prev = node.prev;
      acc = f(node, acc);
      node = prev;
    }
    return acc;
  }
  find(f) {
    for (let node = this.head; node && this.head;) {
      const next = node.next;
      if (f(node)) return node;
      node = next;
    }
  }
}
exports.List = List;
(function (List) {
  class Node {
    constructor() {
      this.next = undefined;
      this.prev = undefined;
    }
  }
  List.Node = Node;
})(List || (exports.List = List = {}));

/***/ },

/***/ 605
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.failsafe = exports.subinput = exports.input = exports.Context = exports.Node = exports.List = void 0;
const node_1 = __webpack_require__(1610);
Object.defineProperty(exports, "List", ({
  enumerable: true,
  get: function () {
    return node_1.List;
  }
}));
const delimiter_1 = __webpack_require__(385);
class Node {
  constructor(value, flags = 0) {
    this.value = value;
    this.flags = flags;
    this.next = undefined;
    this.prev = undefined;
  }
}
exports.Node = Node;
class Context {
  constructor({
    source,
    position,
    segment,
    resources,
    delimiters,
    precedence,
    state,
    linebreak,
    range,
    offset,
    backtracks
  } = {}) {
    this.source = source ?? '';
    this.position = position ?? 0;
    this.segment = segment ?? 0;
    this.resources = resources;
    this.precedence = precedence ?? 0;
    this.delimiters = delimiters ?? new delimiter_1.Delimiters();
    this.state = state ?? 0;
    this.linebreak = linebreak ?? 0;
    this.range = range ?? 0;
    this.offset = offset ?? 0;
    this.backtracks = backtracks ?? {};
  }
}
exports.Context = Context;
function input(source, context) {
  context.source = source;
  context.position = 0;
  return context;
}
exports.input = input;
function subinput(source, context) {
  return {
    ...context,
    source,
    position: 0,
    offset: 0,
    backtracks: {}
  };
}
exports.subinput = subinput;
function failsafe(parser) {
  return context => {
    const position = context.position;
    return parser(context) ?? (context.position = position, undefined);
  };
}
exports.failsafe = failsafe;

/***/ },

/***/ 5745
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.constraint = exports.state = exports.precedence = exports.recursions = exports.recursion = exports.consume = exports.creation = exports.context = exports.reset = void 0;
const alias_1 = __webpack_require__(5413);
const assign_1 = __webpack_require__(9888);
function reset(base, parser) {
  return input => {
    const context = input;
    // @ts-expect-error
    context.resources ??= {
      clock: base.resources?.clock,
      recursions: base.resources?.recursions.slice()
    };
    context.backtracks = {};
    return parser(input);
  };
  // removed by dead control flow

  // removed by dead control flow

  // removed by dead control flow

}
exports.reset = reset;
function context(base, parser) {
  const changes = Object.entries(base);
  const values = Array(changes.length);
  return context => apply(parser, context, changes, values);
}
exports.context = context;
function apply(parser, context, changes, values, reset = false) {
  for (let i = 0; i < changes.length; ++i) {
    const change = changes[i];
    const prop = change[0];
    switch (prop) {
      case 'source':
      case 'position':
        continue;
      case 'resources':
        values[i] = context[prop];
        context[prop] ??= (0, assign_1.clone)({}, change[1]);
        continue;
      case 'backtracks':
        change[1] = {};
    }
    values[i] = context[prop];
    context[prop] = change[1];
  }
  const result = parser(context);
  for (let i = 0; i < changes.length; ++i) {
    const change = changes[i];
    const prop = change[0];
    switch (prop) {
      case 'source':
      case 'position':
        continue;
      case 'resources':
    }
    context[prop] = values[i];
    values[i] = undefined;
  }
  return result;
}
function creation(cost, parser) {
  return input => {
    const context = input;
    const resources = context.resources ?? {
      clock: cost || 1,
      recursions: [1]
    };
    const {
      recursions
    } = resources;
    const result = parser(input);
    if (result === undefined) return;
    consume(cost, context);
    return result;
  };
}
exports.creation = creation;
function consume(cost, context) {
  const {
    resources
  } = context;
  if (!resources) return;
  if (resources.clock < cost) throw new Error('Too many creations');
  resources.clock -= cost;
}
exports.consume = consume;
function recursion(recursion, parser) {
  return input => {
    const context = input;
    const resources = context.resources ?? {
      clock: 1,
      recursions: [1]
    };
    const {
      recursions
    } = resources;
    const rec = (0, alias_1.min)(recursion, recursions.length - 1);
    if (rec >= 0 && recursions[rec] < 1) throw new Error('Too much recursion');
    rec >= 0 && --recursions[rec];
    const result = parser(input);
    rec >= 0 && ++recursions[rec];
    return result;
  };
}
exports.recursion = recursion;
function recursions(rs, parser) {
  return input => {
    const context = input;
    const resources = context.resources ?? {
      clock: 1,
      recursions: [4]
    };
    const {
      recursions
    } = resources;
    for (const recursion of rs) {
      const rec = (0, alias_1.min)(recursion, recursions.length - 1);
      if (rec >= 0 && recursions[rec] < 1) throw new Error('Too much recursion');
      rec >= 0 && --recursions[rec];
    }
    const result = parser(input);
    for (const recursion of rs) {
      const rec = (0, alias_1.min)(recursion, recursions.length - 1);
      rec >= 0 && ++recursions[rec];
    }
    return result;
  };
}
exports.recursions = recursions;
function precedence(precedence, parser) {
  return input => {
    const context = input;
    const {
      delimiters,
      precedence: p
    } = context;
    const shift = delimiters && precedence > p;
    context.precedence = precedence;
    // デリミタはシフト後に設定しなければならない
    shift && delimiters.shift(precedence);
    const result = parser(input);
    shift && delimiters.unshift();
    context.precedence = p;
    return result;
  };
}
exports.precedence = precedence;
function state(state, positive, parser) {
  if (typeof positive === 'function') {
    parser = positive;
    positive = true;
  }
  return input => {
    const context = input;
    const s = context.state ?? 0;
    context.state = positive ? s | state : s & ~state;
    const result = parser(input);
    context.state = s;
    return result;
  };
}
exports.state = state;
//export function constraint<P extends Parser>(state: number, positive: boolean, parser: P): P;
function constraint(state, positive, parser) {
  if (typeof positive === 'function') {
    parser = positive;
    positive = false;
  }
  return input => {
    const context = input;
    const s = positive ? state & context.state : state & ~context.state;
    return s === state ? parser(input) : undefined;
  };
}
exports.constraint = constraint;

/***/ },

/***/ 2861
(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.inits = void 0;
function inits(parsers) {
  if (parsers.length === 1) return parsers[0];
  return input => {
    const context = input;
    const {
      source
    } = context;
    let nodes;
    for (let len = parsers.length, i = 0; i < len; ++i) {
      if (context.position === source.length) break;
      if (context.delimiters.match(input)) break;
      const result = parsers[i](input);
      if (result === undefined) break;
      nodes = nodes?.import(result) ?? result;
    }
    return nodes;
  };
}
exports.inits = inits;

/***/ },

/***/ 3989
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.sequence = void 0;
const parser_1 = __webpack_require__(605);
function sequence(parsers) {
  if (parsers.length === 1) return parsers[0];
  return (0, parser_1.failsafe)(input => {
    const context = input;
    const {
      source
    } = context;
    let nodes;
    for (let len = parsers.length, i = 0; i < len; ++i) {
      if (context.position === source.length) return;
      if (context.delimiters.match(input)) return;
      const result = parsers[i](input);
      if (result === undefined) return;
      nodes = nodes?.import(result) ?? result;
    }
    return nodes;
  });
}
exports.sequence = sequence;

/***/ },

/***/ 2148
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.some = void 0;
const delimiter_1 = __webpack_require__(385);
function some(parser, delimiter, after, delimiters, limit = -1) {
  if (typeof delimiter === 'number') {
    limit = delimiter;
    delimiter = undefined;
  } else if (Array.isArray(delimiter)) {
    delimiters = delimiter;
    delimiter = undefined;
  } else if (after === undefined || Array.isArray(after)) {
    delimiters = after;
    after = undefined;
  }
  const match = delimiter_1.Delimiters.matcher(delimiter, after);
  const delims = delimiters?.map(([delimiter, precedence]) => ({
    signature: delimiter_1.Delimiters.signature(delimiter),
    matcher: delimiter_1.Delimiters.matcher(delimiter),
    precedence
  }));
  return input => {
    const context = input;
    const {
      source,
      position
    } = context;
    //assert(context.backtracks ??= {});
    let nodes;
    delims && context.delimiters.push(delims);
    // whileは数倍遅い
    for (const len = source.length; context.position < len;) {
      if (match(input)) break;
      if (context.delimiters.match(input)) break;
      const result = parser(input);
      if (result === undefined) break;
      nodes = nodes?.import(result) ?? result;
      if (limit >= 0 && context.position - position > limit) break;
    }
    delims && context.delimiters.pop(delims.length);
    return context.position > position ? nodes : undefined;
  };
}
exports.some = some;

/***/ },

/***/ 7429
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.subsequence = void 0;
const union_1 = __webpack_require__(2369);
const inits_1 = __webpack_require__(2861);
function subsequence(parsers) {
  return (0, union_1.union)(parsers.map((_, i) => i + 1 < parsers.length ? (0, inits_1.inits)([parsers[i], subsequence(parsers.slice(i + 1))]) : parsers[i]));
}
exports.subsequence = subsequence;

/***/ },

/***/ 765
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.tails = void 0;
const union_1 = __webpack_require__(2369);
const sequence_1 = __webpack_require__(3989);
function tails(parsers) {
  return (0, union_1.union)(parsers.map((_, i) => (0, sequence_1.sequence)(parsers.slice(i))));
}
exports.tails = tails;

/***/ },

/***/ 2369
(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.union = void 0;
function union(parsers) {
  switch (parsers.length) {
    case 0:
      return () => undefined;
    case 1:
      return parsers[0];
    default:
      return eval(['((', parsers.map((_, i) => `parser${i},`).join(''), ') =>', 'input =>', parsers.map((_, i) => `|| parser${i}(input)`).join('').slice(2), ')'].join(''))(...parsers);
  }
}
exports.union = union;

/***/ },

/***/ 3561
(__unused_webpack_module, exports, __webpack_require__) {

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
__exportStar(__webpack_require__(5886), exports);

/***/ },

/***/ 5886
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.normalize = exports.body = exports.headers = exports.header = exports.caches = exports.bind = exports.parse = void 0;
var parse_1 = __webpack_require__(3662);
Object.defineProperty(exports, "parse", ({
  enumerable: true,
  get: function () {
    return parse_1.parse;
  }
}));
var bind_1 = __webpack_require__(7990);
Object.defineProperty(exports, "bind", ({
  enumerable: true,
  get: function () {
    return bind_1.bind;
  }
}));
var cache_1 = __webpack_require__(4331);
Object.defineProperty(exports, "caches", ({
  enumerable: true,
  get: function () {
    return cache_1.caches;
  }
}));
var header_1 = __webpack_require__(3652);
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
var body_1 = __webpack_require__(3413);
Object.defineProperty(exports, "body", ({
  enumerable: true,
  get: function () {
    return body_1.body;
  }
}));
var normalize_1 = __webpack_require__(4490);
Object.defineProperty(exports, "normalize", ({
  enumerable: true,
  get: function () {
    return normalize_1.normalize;
  }
}));

/***/ },

/***/ 7990
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.bind = void 0;
const context_1 = __webpack_require__(8669);
const parser_1 = __webpack_require__(605);
const segment_1 = __webpack_require__(3967);
const block_1 = __webpack_require__(7099);
const normalize_1 = __webpack_require__(4490);
const header_1 = __webpack_require__(3652);
const figure_1 = __webpack_require__(1657);
const note_1 = __webpack_require__(165);
const url_1 = __webpack_require__(1904);
const array_1 = __webpack_require__(6876);
function bind(target, settings) {
  const context = new context_1.Context({
    ...settings,
    host: settings.host ?? new url_1.ReadonlyURL(location.pathname, location.origin)
  });
  if (context.id?.match(/[^0-9a-z/-]/i)) throw new Error('Invalid ID: ID must be alphanumeric');
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
    const url = (0, header_1.headers)(source).find(field => field.toLowerCase().startsWith('url:'))?.slice(4).trim() ?? '';
    source = (0, normalize_1.normalize)(source);
    // @ts-expect-error
    context.url = url ? new url_1.ReadonlyURL(url) : undefined;
    const rev = revision = Symbol();
    const sourceSegments = [];
    const sourceSegmentAttrs = [];
    for (const [seg, attr] of (0, segment_1.segment)(source)) {
      sourceSegments.push(seg);
      sourceSegmentAttrs.push(attr);
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
    // @ts-expect-error
    context.header = true;
    for (; index < sourceSegments.length - last; ++index) {
      const src = sourceSegments[index];
      context.segment = sourceSegmentAttrs[index] | 1 /* Segment.write */;
      const es = (0, block_1.block)((0, parser_1.input)(src, new context_1.Context(context)))?.foldl((acc, {
        value
      }) => void acc.push(value) || acc, []) ?? [];
      // @ts-expect-error
      context.header = false;
      blocks.length === index ? blocks.push([src, es, url]) : blocks.splice(index, 0, [src, es, url]);
      if (es.length === 0) continue;
      // All deletion processes always run after all addition processes have done.
      // Therefore any `base` node will never be unavailable by deletions until all the dependent `el` nodes are added.
      adds.push(...es.map(el => [el, base]));
      adds.reverse();
      for (; adds.length > 0;) {
        const [el, base] = adds.pop();
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
      dels.push(...es.map(el => [el]));
    }
    adds.reverse();
    for (; adds.length > 0;) {
      const [el, base] = adds.pop();
      target.insertBefore(el, base);
      yield {
        type: 'block',
        value: el
      };
      if (rev !== revision) return yield {
        type: 'cancel'
      };
    }
    dels.reverse();
    for (; dels.length > 0;) {
      const [el] = dels.pop();
      el.parentNode?.removeChild(el);
      yield {
        type: 'block',
        value: el
      };
      if (rev !== revision) return yield {
        type: 'cancel'
      };
    }
    yield {
      type: 'break'
    };
    if (rev !== revision) return yield {
      type: 'cancel'
    };
    for (const el of (0, figure_1.figure)(next(0)?.parentNode ?? target, settings.notes, context)) {
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
    for (const el of (0, note_1.note)(next(0)?.parentNode ?? target, settings.notes, context, bottom)) {
      el ? yield {
        type: 'note',
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

/***/ },

/***/ 3413
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.body = void 0;
const header_1 = __webpack_require__(3652);
function body(source) {
  return source.slice((0, header_1.header)(source).length);
}
exports.body = body;

/***/ },

/***/ 4331
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.caches = void 0;
const tclock_1 = __webpack_require__(3307);
const tlru_1 = __webpack_require__(8888);
// For rerendering in editing.
/*
同一文書内で複数回使用される可能性が低いデータ: TClock
同一文書内で複数回使用される可能性が高いデータ: TLRU

編集時の再描画高速化が主目的であるためブロックを周期とするループおよび
異なるブロックへのジャンプに適したアルゴリズムを使用。
キャッシュサイズはブロック内の全データをキャッシュできなければならない。
キャッシュサイズは100あれば足りるが10,000までは速度低下しないようなので
データサイズを加味して100から1,000とする。
遠くで少数の同じデータを高速描画してもあまり意味はない。
タイムラインとスレッドのmediaにおいても多数の同一データが長周期で複数回表示
される適切な状況はないと思われる。
同一投稿は頻繁に再送されてはならずスパムは削除されなければならず
ジャーゴンは考慮に値しない。

*/
exports.caches = {
  code: new tclock_1.TClock(1000),
  math: new tlru_1.TLRU(1000),
  media: new tclock_1.TClock(100)
};

/***/ },

/***/ 3652
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.headers = exports.header = void 0;
const context_1 = __webpack_require__(8669);
const header_1 = __webpack_require__(3009);
function header(source) {
  const [, pos = 0] = parse(source);
  return source.slice(0, pos);
}
exports.header = header;
function headers(source) {
  const [el] = parse(source);
  return el?.textContent.trimEnd().slice(el.firstChild.firstChild.textContent.length).split('\n') ?? [];
}
exports.headers = headers;
function parse(source) {
  const context = new context_1.Context({
    source
  });
  const result = (0, header_1.header)(context);
  const el = result?.head?.value;
  return el?.tagName === 'ASIDE' ? [el, context.position] : [];
}

/***/ },

/***/ 4490
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.escape = exports.invisibleGraphHTMLEntityNames = exports.invisibleBlankHTMLEntityNames = exports.normalize = void 0;
const dom_1 = __webpack_require__(394);
const UNICODE_REPLACEMENT_CHARACTER = '\uFFFD';
function normalize(source) {
  return sanitize(format(source));
}
exports.normalize = normalize;
function format(source) {
  return source.replace(/\r\n?|[\u2028\u2029]/g, '\n');
}
const invalid = new RegExp([/(?![\t\r\n])[\x00-\x1F\x7F]/g.source, /(?![\u200C\u200D])[\u2006\u200B-\u200F\u202A-\u202F\u2060\uFEFF]/g.source
// 後読みが重い
///(?<![\u1820\u1821])\u180E/g.source,
///[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g.source,
].join('|'), 'g');
function sanitize(source) {
  return source.replace(invalid, UNICODE_REPLACEMENT_CHARACTER);
}
// https://dev.w3.org/html5/html-author/charref
// https://en.wikipedia.org/wiki/Whitespace_character
const invisibleHTMLEntityNames = ['Tab', 'NewLine', 'NonBreakingSpace', 'nbsp', 'shy', 'ensp', 'emsp', 'emsp13', 'emsp14', 'numsp', 'puncsp', 'ThinSpace', 'thinsp', 'VeryThinSpace', 'hairsp', 'ZeroWidthSpace', 'NegativeVeryThinSpace', 'NegativeThinSpace', 'NegativeMediumSpace', 'NegativeThickSpace', 'zwj', 'zwnj', 'lrm', 'rlm', 'MediumSpace', 'NoBreak', 'ApplyFunction', 'af', 'InvisibleTimes', 'it', 'InvisibleComma', 'ic'];
const parser = (el => entity => {
  if (entity === '&NewLine;') return entity;
  el.innerHTML = entity;
  return el.textContent;
})((0, dom_1.html)('span'));
exports.invisibleBlankHTMLEntityNames = invisibleHTMLEntityNames.filter(name => parser(`&${name};`).trimStart() === '');
exports.invisibleGraphHTMLEntityNames = invisibleHTMLEntityNames.filter(name => parser(`&${name};`).trimStart() !== '');
const unreadableEscapeHTMLEntityNames = invisibleHTMLEntityNames.filter(name => !['Tab', 'NewLine', 'NonBreakingSpace', 'nbsp', 'zwj', 'zwnj'].includes(name));
const unreadableEscapeCharacters = unreadableEscapeHTMLEntityNames.map(name => parser(`&${name};`));
const unreadableEscapeCharacter = new RegExp(`[${unreadableEscapeCharacters.join('')}]`, 'g');
// https://www.pandanoir.info/entry/2018/03/11/193000
// http://anti.rosx.net/etc/memo/002_space.html
// http://nicowiki.com/%E7%A9%BA%E7%99%BD%E3%83%BB%E7%89%B9%E6%AE%8A%E8%A8%98%E5%8F%B7.html
const unreadableSpecialCharacters = (/* unused pure expression or super */ null && ([
// SIX-PER-EM SPACE
'\u2006',
// ZERO WIDTH SPACE
'\u200B',
// ZERO WIDTH NON-JOINER
//'\u200C',
// ZERO WIDTH JOINER
//'\u200D',
// LEFT-TO-RIGHT MARK
'\u200E',
// RIGHT-TO-LEFT MARK
'\u200F',
// LEFT-TO-RIGHT EMBEDDING
'\u202A',
// RIGHT-TO-LEFT EMBEDDING
'\u202B',
// POP DIRECTIONAL FORMATTING
'\u202C',
// LEFT-TO-RIGHT OVERRIDE
'\u202D',
// RIGHT-TO-LEFT OVERRIDE
'\u202E',
// NARROW NO-BREAK SPACE
'\u202F',
// WORD JOINER
'\u2060',
// ZERO WIDTH NON-BREAKING SPACE
'\uFEFF']));
// 特殊不可視文字はエディタおよびソースビューアでは等幅および強調表示により可視化する
function escape(source) {
  return source.replace(unreadableEscapeCharacter, char => `&${unreadableEscapeHTMLEntityNames[unreadableEscapeCharacters.indexOf(char)]};`);
}
exports.escape = escape;

/***/ },

/***/ 3662
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.parse = void 0;
const parser_1 = __webpack_require__(605);
const context_1 = __webpack_require__(8669);
const segment_1 = __webpack_require__(3967);
const block_1 = __webpack_require__(7099);
const normalize_1 = __webpack_require__(4490);
const header_1 = __webpack_require__(3652);
const figure_1 = __webpack_require__(1657);
const note_1 = __webpack_require__(165);
const url_1 = __webpack_require__(1904);
const dom_1 = __webpack_require__(394);
function parse(source, options = {}, context) {
  const url = (0, header_1.headers)(source).find(field => field.toLowerCase().startsWith('url:'))?.slice(4).trim() ?? '';
  source = !context ? (0, normalize_1.normalize)(source) : source;
  context = new context_1.Context({
    host: options.host ?? context?.host ?? new url_1.ReadonlyURL(location.pathname, location.origin),
    url: url ? new url_1.ReadonlyURL(url) : context?.url,
    id: options.id ?? context?.id,
    caches: context?.caches,
    resources: context?.resources
  });
  if (context.id?.match(/[^0-9a-z/-]/i)) throw new Error('Invalid ID: ID must be alphanumeric');
  if (context.host?.origin === 'null') throw new Error(`Invalid host: ${context.host.href}`);
  const node = (0, dom_1.frag)();
  // @ts-expect-error
  context.header = true;
  for (const [seg, attr] of (0, segment_1.segment)(source)) {
    context.segment = attr | 1 /* Segment.write */;
    node.append(...((0, block_1.block)((0, parser_1.input)(seg, new context_1.Context(context)))?.foldl((acc, {
      value
    }) => void acc.push(value) || acc, []) ?? []));
    // @ts-expect-error
    context.header = false;
  }
  if (options.test) return node;
  for (const _ of (0, figure_1.figure)(node, options.notes, context));
  for (const _ of (0, note_1.note)(node, options.notes, context));
  return node;
}
exports.parse = parse;

/***/ },

/***/ 1671
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.autolink = void 0;
const combinator_1 = __webpack_require__(3484);
const autolink_1 = __webpack_require__(5691);
const source_1 = __webpack_require__(8745);
exports.autolink = (0, combinator_1.lazy)(() => (0, combinator_1.some)((0, combinator_1.union)([autolink_1.autolink, source_1.unescsource])));

/***/ },

/***/ 7099
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.block = void 0;
const parser_1 = __webpack_require__(605);
const combinator_1 = __webpack_require__(3484);
const segment_1 = __webpack_require__(3967);
const header_1 = __webpack_require__(3009);
const source_1 = __webpack_require__(8745);
const pagebreak_1 = __webpack_require__(2946);
const heading_1 = __webpack_require__(2778);
const ulist_1 = __webpack_require__(7595);
const olist_1 = __webpack_require__(7697);
const ilist_1 = __webpack_require__(4223);
const dlist_1 = __webpack_require__(636);
const table_1 = __webpack_require__(2752);
const codeblock_1 = __webpack_require__(9194);
const mathblock_1 = __webpack_require__(4903);
const extension_1 = __webpack_require__(6193);
const figbase_1 = __webpack_require__(8289);
const fig_1 = __webpack_require__(7396);
const figure_1 = __webpack_require__(4248);
const sidefence_1 = __webpack_require__(6500);
const blockquote_1 = __webpack_require__(5885);
const mediablock_1 = __webpack_require__(2583);
const reply_1 = __webpack_require__(3832);
const paragraph_1 = __webpack_require__(4330);
const random_1 = __webpack_require__(3158);
const dom_1 = __webpack_require__(394);
exports.block = (0, combinator_1.reset)({
  resources: {
    // バックトラックのせいで文字数制限を受けないようにする。
    clock: segment_1.MAX_SEGMENT_SIZE * 6 + 1,
    recursions: [5 || 0 /* Recursion.block */, 20 || 0 /* Recursion.blockquote */, 40 || 0 /* Recursion.listitem */, 20 || 0 /* Recursion.inline */, 20 || 0 /* Recursion.annotation */, 20 || 0 /* Recursion.bracket */, 20 || 0 /* Recursion.terminal */]
  },
  backtracks: {}
}, error((0, combinator_1.union)([source_1.emptysegment, input => {
  const {
    source,
    position,
    segment
  } = input;
  if (position === source.length) return;
  switch (segment ^ 1 /* Segment.write */) {
    case 6 /* Segment.heading */:
      return (0, heading_1.heading)(input);
    case 8 /* Segment.fig */:
      return (0, fig_1.fig)(input);
    case 10 /* Segment.figure */:
      return (0, figure_1.figure)(input);
  }
  const fst = source[position];
  switch (fst) {
    case "\u0007" /* Command.Error */:
      throw new Error((0, combinator_1.firstline)(source, position + 1).trimEnd());
    case '=':
      if (source.startsWith('===', position)) return (0, pagebreak_1.pagebreak)(input);
      break;
    case '`':
      if (source.startsWith('```', position)) return (0, codeblock_1.codeblock)(input);
      break;
    case '~':
      if (source.startsWith('~~~', position)) return (0, extension_1.extension)(input);
      if (source[position + 1] === ' ') return (0, dlist_1.dlist)(input);
      break;
    case '-':
      if (source.startsWith('---', position)) return (0, header_1.header)(input);
      if (source[position + 1] === ' ') return (0, ulist_1.ulist)(input) || (0, ilist_1.ilist)(input);
      break;
    case '+':
    case '*':
      if (source[position + 1] === ' ') return (0, ilist_1.ilist)(input);
      break;
    case '[':
      switch (source[position + 1]) {
        case '$':
          return (0, figbase_1.figbase)(input);
        case '!':
          return (0, mediablock_1.mediablock)(input);
      }
      break;
    case '!':
      if (source[position + 1] === '>') return (0, blockquote_1.blockquote)(input);
      return (0, mediablock_1.mediablock)(input);
    case '>':
      if (source[position + 1] === '>') return (0, blockquote_1.blockquote)(input) || (0, reply_1.reply)(input);
      return (0, blockquote_1.blockquote)(input);
    case '$':
      if (source[position + 1] === '$') return (0, mathblock_1.mathblock)(input);
      return (0, figbase_1.figbase)(input);
    case '|':
      return (0, table_1.table)(input) || (0, sidefence_1.sidefence)(input);
    case '(':
      return (0, olist_1.olist)(input);
    default:
      if ('0' <= fst && fst <= '9') return (0, olist_1.olist)(input);
  }
}, paragraph_1.paragraph])));
function error(parser) {
  const reg = new RegExp(String.raw`^${"\u0007" /* Command.Error */}[^\n]*\n`);
  return (0, combinator_1.recover)(parser, ({
    source,
    position,
    id
  }, reason) => new parser_1.List([new parser_1.Node((0, dom_1.html)('h1', {
    id: id !== '' ? `error:${(0, random_1.rnd0Z)(8)}` : undefined,
    class: 'error'
  }, reason instanceof Error ? `${reason.name}: ${reason.message}` : `UnknownError: ${reason}`)), new parser_1.Node((0, dom_1.html)('pre', {
    class: 'error',
    translate: 'no'
  }, source.slice(position).replace(reg, '').slice(0, 1001).replace(/^(.{997}).{4}$/s, '$1...') || undefined))]));
}

/***/ },

/***/ 5885
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.blockquote = exports.segment = void 0;
const parser_1 = __webpack_require__(605);
const combinator_1 = __webpack_require__(3484);
const autolink_1 = __webpack_require__(1671);
const source_1 = __webpack_require__(8745);
const util_1 = __webpack_require__(4992);
const parse_1 = __webpack_require__(3662);
const dom_1 = __webpack_require__(394);
exports.segment = (0, combinator_1.block)((0, combinator_1.union)([(0, combinator_1.validate)(/!?>+ /y, (0, combinator_1.some)(source_1.contentline))]));
exports.blockquote = (0, combinator_1.lazy)(() => (0, combinator_1.block)((0, combinator_1.rewrite)(exports.segment, (0, combinator_1.union)([(0, combinator_1.open)(/(?=>)/y, source), (0, combinator_1.open)(/!(?=>)/y, markdown)]))));
const opener = /(?=>>+(?:$|[ \n]))/y;
const indent = (0, combinator_1.open)(opener, (0, combinator_1.some)(source_1.contentline, />(?:$|[ \n])/y));
const unindent = source => source.replace(/(?<=^|\n)>(?: |(?=>*(?:$|[ \n])))|\n$/g, '');
const source = (0, combinator_1.lazy)(() => (0, combinator_1.fmap)((0, combinator_1.recursion)(1 /* Recursion.blockquote */, (0, combinator_1.some)((0, combinator_1.union)([(0, combinator_1.rewrite)(indent, (0, combinator_1.convert)(unindent, source, true)), (0, combinator_1.rewrite)((0, combinator_1.some)(source_1.contentline, opener), (0, combinator_1.convert)(unindent, (0, combinator_1.fmap)(autolink_1.autolink, ns => new parser_1.List([new parser_1.Node((0, dom_1.html)('pre', (0, dom_1.defrag)((0, util_1.unwrap)(ns))))])), true))]))), ns => new parser_1.List([new parser_1.Node((0, dom_1.html)('blockquote', (0, util_1.unwrap)(ns)))])));
const markdown = (0, combinator_1.lazy)(() => (0, combinator_1.fmap)((0, combinator_1.recursion)(1 /* Recursion.blockquote */, (0, combinator_1.some)((0, combinator_1.union)([(0, combinator_1.rewrite)(indent, (0, combinator_1.convert)(unindent, markdown, true)), (0, combinator_1.rewrite)((0, combinator_1.some)(source_1.contentline, opener), (0, combinator_1.convert)(unindent, context => {
  (0, combinator_1.consume)(10, context);
  const {
    source
  } = context;
  const references = (0, dom_1.html)('ol', {
    class: 'references'
  });
  const document = (0, parse_1.parse)(source, {
    id: '',
    notes: {
      references
    }
  }, context);
  context.position = source.length;
  return new parser_1.List([new parser_1.Node((0, dom_1.html)('section', [document, (0, dom_1.html)('h2', 'References'), references]))]);
}, true))]))), ns => new parser_1.List([new parser_1.Node((0, dom_1.html)('blockquote', (0, util_1.unwrap)(ns)))])));

/***/ },

/***/ 9194
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.codeblock = exports.segment_ = exports.segment = void 0;
const parser_1 = __webpack_require__(605);
const combinator_1 = __webpack_require__(3484);
const autolink_1 = __webpack_require__(1671);
const util_1 = __webpack_require__(4992);
const dom_1 = __webpack_require__(394);
const opener = /(`{3,})(?!`)([^\n]*)(?:$|\n)/y;
const language = /^[0-9a-z]+(?:-[a-z][0-9a-z]*)*$/i;
exports.segment = (0, combinator_1.block)((0, combinator_1.clear)((0, combinator_1.fence)(opener, 300)));
exports.segment_ = (0, combinator_1.block)((0, combinator_1.clear)((0, combinator_1.fence)(opener, 300, false)), false);
exports.codeblock = (0, combinator_1.block)((0, combinator_1.fmap)((0, combinator_1.fence)(opener, 300),
// Bug: Type mismatch between outer and inner.
(nodes, context) => {
  const [body, overflow, closer, opener, delim, param] = (0, util_1.unwrap)(nodes);
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
  if (!closer || overflow || params.invalid) return new parser_1.List([new parser_1.Node((0, dom_1.html)('pre', {
    class: 'invalid',
    translate: 'no',
    ...(0, util_1.invalid)('codeblock', !closer || overflow ? 'fence' : 'argument', !closer ? `Missing the closing delimiter "${delim}"` : overflow ? `Invalid trailing line after the closing delimiter "${delim}"` : params.invalid)
  }, `${opener}${body}${overflow || closer}`))]);
  const el = (0, dom_1.html)('pre', {
    class: params.lang ? `code language-${params.lang}` : 'text',
    translate: params.lang ? 'no' : undefined,
    'data-lang': params.lang || undefined,
    'data-line': params.line || undefined,
    'data-path': params.path || undefined
  }, params.lang ? context.caches?.code?.get(`${params.lang ?? ''}\n${body.slice(0, -1)}`)?.cloneNode(true).childNodes || body.slice(0, -1) || undefined : (0, dom_1.defrag)((0, util_1.unwrap)((0, autolink_1.autolink)((0, parser_1.subinput)(body.slice(0, -1), context)))));
  return new parser_1.List([new parser_1.Node(el)]);
}));

/***/ },

/***/ 636
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.dlist = void 0;
const parser_1 = __webpack_require__(605);
const combinator_1 = __webpack_require__(3484);
const inline_1 = __webpack_require__(7973);
const source_1 = __webpack_require__(8745);
const visibility_1 = __webpack_require__(6364);
const util_1 = __webpack_require__(4992);
const dom_1 = __webpack_require__(394);
exports.dlist = (0, combinator_1.lazy)(() => (0, combinator_1.block)((0, combinator_1.fmap)((0, combinator_1.validate)(/~ +(?=\S)/y, (0, combinator_1.some)((0, combinator_1.inits)([(0, combinator_1.state)(128 /* State.annotation */ | 64 /* State.reference */ | 32 /* State.index */ | 16 /* State.label */ | 8 /* State.link */, (0, combinator_1.some)(term)), (0, combinator_1.some)(desc)]))), ns => new parser_1.List([new parser_1.Node((0, dom_1.html)('dl', (0, util_1.unwrap)(fillTrailingDescription(ns))))]))));
const term = (0, combinator_1.line)((0, inline_1.indexee)((0, combinator_1.fmap)((0, combinator_1.open)(/~ +(?=\S)/y, (0, visibility_1.visualize)((0, visibility_1.trimBlank)((0, combinator_1.some)((0, combinator_1.union)([inline_1.indexer, inline_1.inline])))), true), ns => new parser_1.List([new parser_1.Node((0, dom_1.html)('dt', {
  'data-index': (0, inline_1.dataindex)(ns)
}, (0, dom_1.defrag)((0, util_1.unwrap)(ns))))]))));
const desc = (0, combinator_1.block)((0, combinator_1.fmap)((0, combinator_1.open)(/: +(?=\S)|/y, (0, combinator_1.rewrite)((0, combinator_1.some)(source_1.anyline, /[~:] +(?=\S)/y), (0, visibility_1.visualize)((0, visibility_1.trimBlankEnd)((0, combinator_1.some)((0, combinator_1.union)([inline_1.inline]))))), true), ns => new parser_1.List([new parser_1.Node((0, dom_1.html)('dd', (0, dom_1.defrag)((0, util_1.unwrap)(ns))))])), false);
function fillTrailingDescription(nodes) {
  return nodes.last?.value.tagName === 'DT' ? nodes.push(new parser_1.Node((0, dom_1.html)('dd'))) && nodes : nodes;
}

/***/ },

/***/ 6193
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.extension = exports.segment = void 0;
const combinator_1 = __webpack_require__(3484);
const fig_1 = __webpack_require__(7396);
const figure_1 = __webpack_require__(4248);
const table_1 = __webpack_require__(3646);
const message_1 = __webpack_require__(3949);
const aside_1 = __webpack_require__(6150);
const example_1 = __webpack_require__(6624);
const placeholder_1 = __webpack_require__(4091);
exports.segment = (0, combinator_1.union)([fig_1.segment, figure_1.segment, table_1.segment, placeholder_1.segment]);
exports.extension = (0, combinator_1.union)([
//figbase,
//fig,
figure_1.figure, table_1.table, message_1.message, aside_1.aside, example_1.example, placeholder_1.placeholder]);

/***/ },

/***/ 6150
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.aside = void 0;
const parser_1 = __webpack_require__(605);
const combinator_1 = __webpack_require__(3484);
const indexee_1 = __webpack_require__(7610);
const util_1 = __webpack_require__(4992);
const parse_1 = __webpack_require__(3662);
const dom_1 = __webpack_require__(394);
exports.aside = (0, combinator_1.block)((0, combinator_1.recursion)(0 /* Recursion.block */, (0, combinator_1.fmap)((0, combinator_1.fence)(/(~{3,})aside(?!\S)([^\n]*)(?:$|\n)/y, 300),
// Bug: Type mismatch between outer and inner.
(nodes, context) => {
  const [body, overflow, closer, opener, delim, param] = (0, util_1.unwrap)(nodes);
  if (!closer || overflow || param.trimStart()) return new parser_1.List([new parser_1.Node((0, dom_1.html)('pre', {
    class: 'invalid',
    translate: 'no',
    ...(0, util_1.invalid)('aside', !closer || overflow ? 'fence' : 'argument', !closer ? `Missing the closing delimiter "${delim}"` : overflow ? `Invalid trailing line after the closing delimiter "${delim}"` : 'Invalid argument')
  }, `${opener}${body}${overflow || closer}`))]);
  const references = (0, dom_1.html)('ol', {
    class: 'references'
  });
  const document = (0, parse_1.parse)(body.slice(0, -1), {
    id: '',
    notes: {
      references
    }
  }, context);
  const heading = 'H1 H2 H3 H4 H5 H6'.split(' ').includes(document.firstElementChild?.tagName) && document.firstElementChild;
  if (!heading) return new parser_1.List([new parser_1.Node((0, dom_1.html)('pre', {
    class: 'invalid',
    translate: 'no',
    ...(0, util_1.invalid)('aside', 'content', 'Missing the title at the first line')
  }, `${opener}${body}${closer}`))]);
  return new parser_1.List([new parser_1.Node((0, dom_1.html)('aside', {
    id: (0, indexee_1.identity)('index', context.id, heading),
    class: 'aside'
  }, [document, (0, dom_1.html)('h2', 'References'), references]))]);
})));

/***/ },

/***/ 6624
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.example = void 0;
const parser_1 = __webpack_require__(605);
const combinator_1 = __webpack_require__(3484);
const mathblock_1 = __webpack_require__(4903);
const util_1 = __webpack_require__(4992);
const parse_1 = __webpack_require__(3662);
const dom_1 = __webpack_require__(394);
exports.example = (0, combinator_1.block)((0, combinator_1.recursion)(0 /* Recursion.block */, (0, combinator_1.fmap)((0, combinator_1.fence)(/(~{3,})(?:example\/(\S+))?(?!\S)([^\n]*)(?:$|\n)/y, 300),
// Bug: Type mismatch between outer and inner.
(nodes, context) => {
  const [body, overflow, closer, opener, delim, type = 'markdown', param] = (0, util_1.unwrap)(nodes);
  if (!closer || overflow || param.trimStart()) return new parser_1.List([new parser_1.Node((0, dom_1.html)('pre', {
    class: 'invalid',
    translate: 'no',
    ...(0, util_1.invalid)('example', !closer || overflow ? 'fence' : 'argument', !closer ? `Missing the closing delimiter "${delim}"` : overflow ? `Invalid trailing line after the closing delimiter "${delim}"` : 'Invalid argument')
  }, `${opener}${body}${overflow || closer}`))]);
  switch (type) {
    case 'markdown':
      {
        const references = (0, dom_1.html)('ol', {
          class: 'references'
        });
        const document = (0, parse_1.parse)(body.slice(0, -1), {
          id: '',
          notes: {
            references
          }
        }, context);
        return new parser_1.List([new parser_1.Node((0, dom_1.html)('aside', {
          class: 'example',
          'data-type': 'markdown'
        }, [(0, dom_1.html)('pre', {
          translate: 'no'
        }, body.slice(0, -1)), (0, dom_1.html)('hr'), (0, dom_1.html)('section', [document, (0, dom_1.html)('h2', 'References'), references])]))]);
      }
    case 'math':
      return new parser_1.List([new parser_1.Node((0, dom_1.html)('aside', {
        class: 'example',
        'data-type': 'math'
      }, [(0, dom_1.html)('pre', {
        translate: 'no'
      }, body.slice(0, -1)), (0, dom_1.html)('hr'), (0, mathblock_1.mathblock)((0, parser_1.subinput)(`$$\n${body}$$`, context)).head.value]))]);
    default:
      return new parser_1.List([new parser_1.Node((0, dom_1.html)('pre', {
        class: 'invalid',
        translate: 'no',
        ...(0, util_1.invalid)('example', 'type', 'Invalid example type')
      }, `${opener}${body}${closer}`))]);
  }
})));

/***/ },

/***/ 7396
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.fig = exports.segment = void 0;
const combinator_1 = __webpack_require__(3484);
const source_1 = __webpack_require__(8745);
const figure_1 = __webpack_require__(4248);
const label_1 = __webpack_require__(2178);
const codeblock_1 = __webpack_require__(9194);
const mathblock_1 = __webpack_require__(4903);
const table_1 = __webpack_require__(3646);
const blockquote_1 = __webpack_require__(5885);
const placeholder_1 = __webpack_require__(4091);
const inline_1 = __webpack_require__(7973);
exports.segment = (0, combinator_1.block)((0, combinator_1.sequence)([(0, combinator_1.line)((0, combinator_1.close)(label_1.segment, /(?!\S).*\n/y)), (0, combinator_1.union)([codeblock_1.segment, mathblock_1.segment, table_1.segment, blockquote_1.segment, placeholder_1.segment, (0, combinator_1.some)(source_1.contentline)])]), true, 8 /* Segment.fig */);
exports.fig = (0, combinator_1.block)((0, combinator_1.rewrite)(exports.segment, (0, combinator_1.verify)((0, combinator_1.convert)((source, context) => {
  // Bug: TypeScript
  const fence = (/^[^\n]*\n!?>+ /.test(source) && source.match(/^~{3,}(?=[^\S\n]*$)/gm) || []).reduce((max, fence) => fence > max ? fence : max, '~~') + '~';
  const {
    position
  } = context;
  const result = parser(context);
  context.position = position;
  context.segment = 10 /* Segment.figure */ | 1 /* Segment.write */;
  return result ? `${fence}figure ${source.replace(/^(.+\n.+\n)([\S\s]+?)\n?$/, '$1\n$2')}\n${fence}` : `${fence}figure ${source}\n\n${fence}`;
}, (0, combinator_1.union)([figure_1.figure])), ([{
  value: el
}]) => el.tagName === 'FIGURE')));
const parser = (0, combinator_1.sequence)([(0, combinator_1.line)((0, combinator_1.close)(label_1.segment, /(?!\S).*\n/y)), (0, combinator_1.line)((0, combinator_1.union)([inline_1.media, inline_1.lineshortmedia])), (0, combinator_1.some)(source_1.contentline)]);

/***/ },

/***/ 8289
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.figbase = void 0;
const parser_1 = __webpack_require__(605);
const combinator_1 = __webpack_require__(3484);
const label_1 = __webpack_require__(2178);
const dom_1 = __webpack_require__(394);
exports.figbase = (0, combinator_1.block)((0, combinator_1.fmap)((0, combinator_1.validate)(/\[?\$-(?:[0-9]+\.)*0\]?[^\S\n]*(?:$|\n)/y, (0, combinator_1.line)((0, combinator_1.union)([label_1.label]))), ([{
  value: el
}]) => {
  const label = el.getAttribute('data-label');
  const group = label.split('-', 1)[0];
  return new parser_1.List([new parser_1.Node((0, dom_1.html)('figure', {
    'data-label': label,
    'data-group': group,
    hidden: ''
  }))]);
}));

/***/ },

/***/ 4248
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.figure = exports.segment = void 0;
const parser_1 = __webpack_require__(605);
const combinator_1 = __webpack_require__(3484);
const source_1 = __webpack_require__(8745);
const label_1 = __webpack_require__(2178);
const ulist_1 = __webpack_require__(7595);
const olist_1 = __webpack_require__(7697);
const table_1 = __webpack_require__(2752);
const codeblock_1 = __webpack_require__(9194);
const mathblock_1 = __webpack_require__(4903);
const example_1 = __webpack_require__(6624);
const table_2 = __webpack_require__(3646);
const blockquote_1 = __webpack_require__(5885);
const placeholder_1 = __webpack_require__(4091);
const inline_1 = __webpack_require__(7973);
const visibility_1 = __webpack_require__(6364);
const util_1 = __webpack_require__(4992);
const memoize_1 = __webpack_require__(6925);
const dom_1 = __webpack_require__(394);
exports.segment = (0, combinator_1.block)((0, combinator_1.match)(/(~{3,})(?:figure )?(?=\[?\$)/y, (0, memoize_1.memoize)(([, fence], closer = new RegExp(String.raw`${fence}[^\S\n]*(?:$|\n)`, 'y')) => (0, combinator_1.close)((0, combinator_1.sequence)([source_1.contentline, (0, combinator_1.inits)([
// All parsers which can include closing terms.
(0, combinator_1.union)([codeblock_1.segment_, mathblock_1.segment_, table_2.segment_, blockquote_1.segment, placeholder_1.segment_, (0, combinator_1.some)(source_1.contentline, closer)]), source_1.emptyline, (0, combinator_1.union)([source_1.emptyline, (0, combinator_1.some)(source_1.contentline, closer)])])]), closer), ([, fence]) => fence.length - 1, [], 2 ** 4 - 1)), true, 10 /* Segment.figure */);
exports.figure = (0, combinator_1.block)((0, combinator_1.fallback)((0, combinator_1.rewrite)(exports.segment, (0, combinator_1.fmap)((0, combinator_1.convert)(source => source.slice(source.match(/^~+(?:\w+\s+)?/)[0].length, source.trimEnd().lastIndexOf('\n')), (0, combinator_1.sequence)([(0, combinator_1.line)((0, combinator_1.sequence)([label_1.label, (0, source_1.str)(/(?!\S).*\n/y)])), (0, combinator_1.inits)([(0, combinator_1.block)((0, combinator_1.union)([ulist_1.ulist, olist_1.olist, table_1.table, codeblock_1.codeblock, mathblock_1.mathblock, example_1.example, table_2.table, blockquote_1.blockquote, placeholder_1.placeholder, (0, combinator_1.line)(inline_1.media), (0, combinator_1.line)(inline_1.lineshortmedia)])), source_1.emptyline, (0, combinator_1.block)((0, visibility_1.visualize)((0, visibility_1.trimBlank)((0, combinator_1.some)(inline_1.inline))))])])), nodes => {
  const [label, param, content, ...caption] = (0, util_1.unwrap)(nodes);
  return new parser_1.List([new parser_1.Node((0, dom_1.html)('figure', attributes(label.getAttribute('data-label'), param, content, caption), [(0, dom_1.html)('figcaption', [(0, dom_1.html)('span', {
    class: 'figindex'
  }), (0, dom_1.html)('span', {
    class: 'figtext'
  }, (0, dom_1.defrag)(caption))]), (0, dom_1.html)('div', [content])]))]);
})), (0, combinator_1.fmap)((0, combinator_1.fence)(/(~{3,})(?:figure(?=$|[ \n])|\[?\$)[^\n]*(?:$|\n)/y, 300), (nodes, context) => {
  const [body, overflow, closer, opener, delim] = (0, util_1.unwrap)(nodes);
  const violation = !closer && ['fence', `Missing the closing delimiter "${delim}"`] || overflow && ['fence', `Invalid trailing line after the closing delimiter "${delim}"`] || !(0, label_1.segment)((0, parser_1.subinput)(opener.match(/^~+(?:figure )?(\[?\$\S+)/)?.[1] ?? '', context)) && ['label', 'Invalid label'] || /^~+(?:figure )?(\[?\$\S+)[^\S\n]+\S/.test(opener) && ['argument', 'Invalid argument'] || ['content', 'Invalid content'];
  return new parser_1.List([new parser_1.Node((0, dom_1.html)('pre', {
    class: 'invalid',
    translate: 'no',
    ...(0, util_1.invalid)('figure', violation[0], violation[1])
  }, `${opener}${body}${overflow || closer}`))]);
})));
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
  const violation = param.trimStart() !== '' && ['argument', 'Invalid argument'] || /^[^-]+-(?:[0-9]+\.)*0$/.test(label) && ['label', 'The last part of the fixed label numbers must not be 0'] || group === '$' && (type !== 'math' || caption.length > 0) && ['label', '"$" label group must be used to math formulas with no caption'] || type === 'media' && [] || ['fig', 'figure'].includes(group) && ['label', '"fig" and "figure" label groups must be used to media'] || group === 'table' && type !== group && ['label', '"table" label group must be used to tables'] || group === 'list' && type !== group && ['label', '"list" label group must be used to lists'] || group === 'quote' && type !== group && ['label', '"quote" label group must be used to blockquotes'] || group === 'text' && type !== group && ['label', '"text" label group must be used to codeblocks with no language'] || group === 'code' && type !== group && ['label', '"code" label group must be used to codeblocks with any language'] || group === 'example' && type !== group && ['label', '"example" label group must be used to examples'] || undefined;
  return {
    'data-type': type,
    'data-label': label,
    'data-group': group,
    ...(violation?.[0] && {
      class: 'invalid',
      ...(0, util_1.invalid)('figure', violation[0], violation[1])
    })
  };
}

/***/ },

/***/ 3949
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.message = void 0;
const parser_1 = __webpack_require__(605);
const combinator_1 = __webpack_require__(3484);
const segment_1 = __webpack_require__(3967);
const source_1 = __webpack_require__(8745);
const ulist_1 = __webpack_require__(7595);
const olist_1 = __webpack_require__(7697);
const ilist_1 = __webpack_require__(4223);
const table_1 = __webpack_require__(2752);
const codeblock_1 = __webpack_require__(9194);
const mathblock_1 = __webpack_require__(4903);
const sidefence_1 = __webpack_require__(6500);
const blockquote_1 = __webpack_require__(5885);
const mediablock_1 = __webpack_require__(2583);
const paragraph_1 = __webpack_require__(4330);
const util_1 = __webpack_require__(4992);
const array_1 = __webpack_require__(6876);
const dom_1 = __webpack_require__(394);
exports.message = (0, combinator_1.block)((0, combinator_1.fmap)((0, combinator_1.fence)(/(~{3,})message\/(\S+)(?!\S)([^\n]*)(?:$|\n)/y, 300),
// Bug: Type mismatch between outer and inner.
(nodes, context) => {
  const [body, overflow, closer, opener, delim, type, param] = (0, util_1.unwrap)(nodes);
  if (!closer || overflow || param.trimStart()) return new parser_1.List([new parser_1.Node((0, dom_1.html)('pre', {
    class: 'invalid',
    translate: 'no',
    ...(0, util_1.invalid)('message', !closer || overflow ? 'fence' : 'argument', !closer ? `Missing the closing delimiter "${delim}"` : overflow ? `Invalid trailing line after the closing delimiter "${delim}"` : 'Invalid argument')
  }, `${opener}${body}${overflow || closer}`))]);
  switch (type) {
    case 'note':
    case 'caution':
    case 'warning':
      break;
    default:
      return new parser_1.List([new parser_1.Node((0, dom_1.html)('pre', {
        class: 'invalid',
        translate: 'no',
        ...(0, util_1.invalid)('message', 'type', 'Invalid message type')
      }, `${opener}${body}${closer}`))]);
  }
  return new parser_1.List([new parser_1.Node((0, dom_1.html)('section', {
    class: `message`,
    'data-type': type
  }, [...(0, segment_1.segment)(body)].reduce((acc, [seg]) => (0, array_1.push)(acc, (0, util_1.unwrap)(content((0, parser_1.subinput)(seg, context)))), [(0, dom_1.html)('h1', title(type))])))]);
}));
function title(type) {
  switch (type) {
    case 'warning':
      return type.toUpperCase() + '!!';
    case 'caution':
      return type[0].toUpperCase() + type.slice(1) + '!';
    default:
      return type[0].toUpperCase() + type.slice(1);
  }
}
// Must not have indexed blocks.
const content = (0, combinator_1.union)([source_1.emptyline, ulist_1.ulist, olist_1.olist, ilist_1.ilist, table_1.table, codeblock_1.codeblock, mathblock_1.mathblock, sidefence_1.sidefence, blockquote_1.blockquote, mediablock_1.mediablock, paragraph_1.paragraph]);

/***/ },

/***/ 4091
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.placeholder = exports.segment_ = exports.segment = void 0;
const parser_1 = __webpack_require__(605);
const combinator_1 = __webpack_require__(3484);
const util_1 = __webpack_require__(4992);
const dom_1 = __webpack_require__(394);
const opener = /(~{3,})(?!~)[^\n]*(?:$|\n)/y;
exports.segment = (0, combinator_1.block)((0, combinator_1.clear)((0, combinator_1.fence)(opener, 300)));
exports.segment_ = (0, combinator_1.block)((0, combinator_1.clear)((0, combinator_1.fence)(opener, 300, false)), false);
exports.placeholder = (0, combinator_1.block)((0, combinator_1.fmap)((0, combinator_1.fence)(opener, Infinity), nodes => {
  const [body, overflow, closer, opener, delim] = (0, util_1.unwrap)(nodes);
  return new parser_1.List([new parser_1.Node((0, dom_1.html)('pre', {
    class: 'invalid',
    translate: 'no',
    ...(0, util_1.invalid)('extension', 'fence', !closer ? `Missing the closing delimiter "${delim}"` : overflow ? `Invalid trailing line after the closing delimiter "${delim}"` : 'Invalid argument')
  }, `${opener}${body}${overflow || closer}`))]);
}));

/***/ },

/***/ 3646
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.table = exports.segment_ = exports.segment = void 0;
const parser_1 = __webpack_require__(605);
const combinator_1 = __webpack_require__(3484);
const inline_1 = __webpack_require__(7973);
const source_1 = __webpack_require__(8745);
const util_1 = __webpack_require__(4992);
const visibility_1 = __webpack_require__(6364);
const alias_1 = __webpack_require__(5413);
const array_1 = __webpack_require__(6876);
const dom_1 = __webpack_require__(394);
const opener = /(~{3,})table(?:\/(\S+))?(?!\S)([^\n]*)(?:$|\n)/y;
exports.segment = (0, combinator_1.block)((0, combinator_1.clear)((0, combinator_1.fence)(opener, 10000)));
exports.segment_ = (0, combinator_1.block)((0, combinator_1.clear)((0, combinator_1.fence)(opener, 10000, false)), false);
exports.table = (0, combinator_1.block)((0, combinator_1.fmap)((0, combinator_1.fence)(opener, 10000),
// Bug: Type mismatch between outer and inner.
(nodes, context) => {
  const [body, overflow, closer, opener, delim, type, param] = (0, util_1.unwrap)(nodes);
  if (!closer || overflow || param.trimStart()) return new parser_1.List([new parser_1.Node((0, dom_1.html)('pre', {
    class: 'invalid',
    translate: 'no',
    ...(0, util_1.invalid)('table', !closer || overflow ? 'fence' : 'argument', !closer ? `Missing the closing delimiter "${delim}"` : overflow ? `Invalid trailing line after the closing delimiter "${delim}"` : 'Invalid argument')
  }, `${opener}${body}${overflow || closer}`))]);
  switch (type) {
    case 'grid':
    case undefined:
      return (parser((0, parser_1.subinput)(body, context)) ?? new parser_1.List([new parser_1.Node((0, dom_1.html)('table'))])).foldl((acc, {
        value
      }) => acc.push(new parser_1.Node((0, dom_1.define)(value, {
        'data-type': type
      }))) && acc, new parser_1.List());
    default:
      return new parser_1.List([new parser_1.Node((0, dom_1.html)('pre', {
        class: 'invalid',
        translate: 'no',
        ...(0, util_1.invalid)('table', 'argument', 'Invalid table type')
      }, `${opener}${body}${closer}`))]);
  }
}));
const parser = (0, combinator_1.lazy)(() => (0, combinator_1.block)((0, combinator_1.fmap)((0, combinator_1.some)((0, combinator_1.union)([row])), rows => new parser_1.List([new parser_1.Node((0, dom_1.html)('table', format([...(0, util_1.unwrap)(rows)])))]))));
const row = (0, combinator_1.lazy)(() => (0, combinator_1.dup)((0, combinator_1.fmap)((0, combinator_1.subsequence)([(0, combinator_1.union)([align]), (0, combinator_1.some)((0, combinator_1.union)([head, data, (0, combinator_1.some)(dataline, alignment), source_1.emptyline]))]), ns => Array.isArray(ns.head?.value) ? ns : ns.unshift(new parser_1.Node([[]])) && ns)));
const alignment = /[-=<>]+(?:\/[-=^v]*)?(?=[^\S\n]*\n)/y;
const align = (0, combinator_1.line)((0, combinator_1.fmap)((0, combinator_1.union)([(0, source_1.str)(alignment)]), ([{
  value
}]) => new parser_1.List([new parser_1.Node(value.split('/').map(s => s.split('')))])));
const delimiter = /[-=<>]+(?:\/[-=^v]*)?(?=[^\S\n]*\n)|[#:](?:(?!:\D|0)\d*:(?!0)\d*)?(?:!+[+]?)?(?=[ \n])/y;
const head = (0, combinator_1.block)((0, combinator_1.fmap)((0, combinator_1.open)((0, source_1.str)(/#(?:(?!:\D|0)\d*:(?!0)\d*)?(?:!+[+]?)?(?=[ \n])/y), (0, combinator_1.rewrite)((0, combinator_1.inits)([source_1.anyline, (0, combinator_1.some)(source_1.contentline, delimiter)]), (0, combinator_1.union)([(0, combinator_1.block)((0, combinator_1.surround)(/\s/y, (0, combinator_1.union)([inline_1.medialink, inline_1.media, inline_1.lineshortmedia]), /[^\S\n]*(?:$|\n)/y)), (0, combinator_1.open)(/(?:[^\S\n]*\n|\s)/y, (0, visibility_1.visualize)((0, visibility_1.trimBlank)((0, combinator_1.some)(inline_1.inline))), true)])), true), ns => new parser_1.List([new parser_1.Node((0, dom_1.html)('th', attributes(ns.shift().value), (0, dom_1.defrag)((0, util_1.unwrap)(ns))))])), false);
const data = (0, combinator_1.block)((0, combinator_1.fmap)((0, combinator_1.open)((0, source_1.str)(/:(?:(?!:\D|0)\d*:(?!0)\d*)?(?:!+[+]?)?(?=[ \n])/y), (0, combinator_1.rewrite)((0, combinator_1.inits)([source_1.anyline, (0, combinator_1.some)(source_1.contentline, delimiter)]), (0, combinator_1.union)([(0, combinator_1.block)((0, combinator_1.surround)(/\s/y, (0, combinator_1.union)([inline_1.medialink, inline_1.media, inline_1.lineshortmedia]), /[^\S\n]*(?:$|\n)/y)), (0, combinator_1.open)(/(?:[^\S\n]*\n|\s)/y, (0, visibility_1.visualize)((0, visibility_1.trimBlankEnd)((0, combinator_1.some)(inline_1.inline))), true)])), true), ns => new parser_1.List([new parser_1.Node((0, dom_1.html)('td', attributes(ns.shift().value), (0, dom_1.defrag)((0, util_1.unwrap)(ns))))])), false);
const dataline = (0, combinator_1.line)((0, combinator_1.rewrite)(source_1.contentline, (0, combinator_1.union)([(0, combinator_1.validate)(/!+ /y, (0, combinator_1.convert)(source => `:${source}`, data)), (0, combinator_1.convert)(source => `: ${source}`, data)])));
function attributes(source) {
  let [, rowspan = undefined, colspan = undefined, highlight = undefined, extension = undefined] = source.match(/^[#:](?:(\d+)?:(\d+)?)?(?:(!+)([+]?))?$/) ?? [];
  rowspan === '1' ? rowspan = undefined : undefined;
  colspan === '1' ? colspan = undefined : undefined;
  rowspan &&= `${(0, alias_1.max)(0, (0, alias_1.min)(+rowspan, 65534))}`;
  colspan &&= `${(0, alias_1.max)(0, (0, alias_1.min)(+colspan, 1000))}`;
  extension ||= undefined;
  const level = highlight?.length ?? 0;
  const validH = !highlight || source[0] === '#' && level <= 6 || source[0] === ':' && level <= 6;
  const validE = source[0] === '#' || extension !== '+';
  const valid = validH && validE;
  return {
    class: valid ? highlight && 'highlight' : 'invalid',
    rowspan,
    colspan,
    ...(!validH && (0, util_1.invalid)('table', 'syntax', 'Too much highlight level') || !validE && (0, util_1.invalid)('table', 'syntax', 'Extensible cells are only head cells') || {
      'data-highlight-level': level > 1 ? `${level}` : undefined,
      'data-highlight-extension': extension
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
  let verticalHighlightExtensions = 0n;
  let verticalHighlightLevels = [];
  let cnt = 0;
  for (const list of rows) ROW: for (let i = cnt++; i < cnt; ++i) {
    // Copy to make them retryable.
    const [{
      value: [[...as], [...vs] = []]
    }, ...cells] = list;
    let isBody = target === tfoot ? false : undefined;
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
    let highlightExtensions = 0n;
    let highlightLevels = [];
    let hasDataCell = false;
    let lHeadCellIndex;
    let rHeadCellIndex;
    for (let j = 0; j < cells.length; ++j) {
      const jn = BigInt(j);
      const isVirtual = !!ranges[i]?.[j];
      const cell = isVirtual ? (0, array_1.splice)(cells, j, 0, undefined) && ranges[i][j] : cells[j].value;
      const isHeadCell = cell.tagName === 'TH';
      heads |= isHeadCell ? 1n << jn : 0n;
      highlights |= cell.className === 'highlight' ? 1n << jn : 0n;
      highlightExtensions |= cell.getAttribute('data-highlight-extension') ? 1n << jn : 0n;
      highlightLevels[j] = cell.getAttribute('data-highlight-level') ?? '1';
      hasDataCell ||= !isHeadCell;
      if (isHeadCell && !hasDataCell) {
        lHeadCellIndex = jn;
      }
      if (isHeadCell && hasDataCell) {
        rHeadCellIndex ??= jn;
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
        (0, array_1.splice)(cells, j + 1, 0, ...Array(colSpan - 1));
        heads |= heads & 1n << jn && ~(~0n << BigInt(colSpan)) << jn;
        highlights |= highlights & 1n << jn && ~(~0n << BigInt(colSpan)) << jn;
        highlightExtensions |= highlightExtensions & 1n << jn && ~(~0n << BigInt(colSpan)) << jn;
        (0, array_1.splice)(highlightLevels, j + 1, 0, ...Array(colSpan - 1));
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
        verticalHighlightExtensions = highlightExtensions;
        verticalHighlightLevels = highlightLevels;
        continue;
      case tbody:
        lHeadCellIndex ??= -1n;
        rHeadCellIndex ??= -1n;
        const tHighlights = verticalHighlightExtensions;
        const horizontalHighlights = highlightExtensions;
        const horizontalHighlightLevels = highlightLevels;
        const lHighlight = ~lHeadCellIndex && horizontalHighlights & 1n << lHeadCellIndex;
        const rHighlight = ~rHeadCellIndex && horizontalHighlights & 1n << rHeadCellIndex;
        for (let i = 0, m = 1n; i < cells.length; ++i, m <<= 1n) {
          const cell = cells[i]?.value;
          if (!cell) continue;
          if (heads & m) continue;
          switch (m) {
            case highlights & m:
              (lHighlight || rHighlight) && cell.setAttribute('data-highlight-level', horizontalHighlightLevels[i]);
              break;
            case lHighlight && m:
            case rHighlight && m:
              cell.classList.add('highlight');
              break;
            case tHighlights & m:
              cell.classList.add('highlight');
              +verticalHighlightLevels[i] > 1 && cell.setAttribute('data-highlight-level', verticalHighlightLevels[i]);
              break;
            default:
              continue;
          }
        }
        continue;
      case tfoot:
        continue;
    }
  }
  return [thead, tbody, tfoot];
}

/***/ },

/***/ 2778
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.heading = exports.segment = void 0;
const parser_1 = __webpack_require__(605);
const combinator_1 = __webpack_require__(3484);
const inline_1 = __webpack_require__(7973);
const source_1 = __webpack_require__(8745);
const visibility_1 = __webpack_require__(6364);
const util_1 = __webpack_require__(4992);
const dom_1 = __webpack_require__(394);
exports.segment = (0, combinator_1.block)((0, combinator_1.focus)(/#+ +\S[^\n]*(?:\n#+(?=$|[ \n])[^\n]*)*(?:$|\n)/y, input => {
  const context = input;
  const {
    source,
    range
  } = context;
  const acc = new parser_1.List();
  for (const len = context.position + range; context.position < len;) {
    const line = (0, combinator_1.firstline)(source, context.position);
    acc.push(new parser_1.Node(line));
    context.position += line.length;
  }
  return acc;
}, false), true, 6 /* Segment.heading */);
exports.heading = (0, combinator_1.block)((0, combinator_1.rewrite)(exports.segment,
// その他の表示制御は各所のCSSで行う。
(0, combinator_1.state)(128 /* State.annotation */ | 64 /* State.reference */ | 32 /* State.index */ | 16 /* State.label */ | 8 /* State.link */, (0, combinator_1.line)((0, inline_1.indexee)((0, combinator_1.fmap)((0, combinator_1.union)([(0, combinator_1.open)((0, source_1.strs)('#', 2), (0, visibility_1.visualize)((0, visibility_1.trimBlank)((0, combinator_1.some)((0, combinator_1.union)([inline_1.indexer, inline_1.inline])))), true), (0, combinator_1.open)((0, source_1.str)('#'), (0, combinator_1.state)(251 /* State.linkers */, (0, visibility_1.visualize)((0, visibility_1.trimBlank)((0, combinator_1.some)((0, combinator_1.union)([inline_1.indexer, inline_1.inline]))))), true)]), (nodes, context) => {
  const [h, ...ns] = (0, util_1.unwrap)(nodes);
  return new parser_1.List([h.length <= 6 ? new parser_1.Node((0, dom_1.html)(`h${h.length}`, {
    'data-index': (0, inline_1.dataindex)(nodes)
  }, (0, dom_1.defrag)(ns))) : new parser_1.Node((0, dom_1.html)(`h6`, {
    class: 'invalid',
    ...(0, util_1.invalid)('heading', 'syntax', 'Heading level must be up to 6')
  }, context.source.slice(context.position - context.range, context.position)))]);
}))))));

/***/ },

/***/ 4223
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.ilistitem = exports.ilist_ = exports.ilist = void 0;
const parser_1 = __webpack_require__(605);
const combinator_1 = __webpack_require__(3484);
const ulist_1 = __webpack_require__(7595);
const olist_1 = __webpack_require__(7697);
const inline_1 = __webpack_require__(7973);
const source_1 = __webpack_require__(8745);
const visibility_1 = __webpack_require__(6364);
const util_1 = __webpack_require__(4992);
const dom_1 = __webpack_require__(394);
exports.ilist = (0, combinator_1.lazy)(() => (0, combinator_1.block)((0, combinator_1.validate)(/[-+*] /y, exports.ilist_)));
exports.ilist_ = (0, combinator_1.lazy)(() => (0, combinator_1.block)((0, combinator_1.fmap)((0, combinator_1.validate)(/[-+*](?:$|[ \n])/y, (0, combinator_1.recursion)(2 /* Recursion.listitem */, (0, combinator_1.some)((0, combinator_1.union)([(0, combinator_1.fmap)((0, combinator_1.fallback)((0, combinator_1.inits)([(0, combinator_1.line)((0, combinator_1.open)(/[-+*](?:$|[ \n])/y, (0, visibility_1.visualize)((0, visibility_1.trimBlank)((0, combinator_1.some)(inline_1.inline))), true)), (0, combinator_1.indent)((0, combinator_1.union)([ulist_1.ulist_, olist_1.olist_, exports.ilist_]))]), exports.ilistitem), ns => new parser_1.List([new parser_1.Node((0, dom_1.html)('li', (0, dom_1.defrag)((0, util_1.unwrap)((0, ulist_1.fillFirstLine)(ns)))))]))])))), ns => new parser_1.List([new parser_1.Node((0, dom_1.html)('ul', {
  class: 'invalid',
  ...(0, util_1.invalid)('list', 'syntax', 'Use "-" instead of "+" or "*"')
}, (0, util_1.unwrap)(ns)))]))));
exports.ilistitem = (0, combinator_1.rewrite)((0, combinator_1.inits)([source_1.contentline, (0, combinator_1.indent)(({
  source
}) => new parser_1.List([new parser_1.Node(source)]))]), ({
  source
}) => new parser_1.List([new parser_1.Node(''), new parser_1.Node((0, dom_1.html)('span', {
  class: 'invalid',
  ...(0, util_1.invalid)('list', 'syntax', 'Fix the indent or the head of the list item')
}, source.replace('\n', '')))]));

/***/ },

/***/ 4903
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.mathblock = exports.segment_ = exports.segment = void 0;
const parser_1 = __webpack_require__(605);
const combinator_1 = __webpack_require__(3484);
const util_1 = __webpack_require__(4992);
const dom_1 = __webpack_require__(394);
const opener = /(\${2,})(?!\$)([^\n]*)(?:$|\n)/y;
exports.segment = (0, combinator_1.block)((0, combinator_1.clear)((0, combinator_1.fence)(opener, 300)));
exports.segment_ = (0, combinator_1.block)((0, combinator_1.clear)((0, combinator_1.fence)(opener, 300, false)), false);
exports.mathblock = (0, combinator_1.block)((0, combinator_1.fmap)((0, combinator_1.fence)(opener, 300),
// Bug: Type mismatch between outer and inner.
(nodes, {
  caches: {
    math: cache = undefined
  } = {}
}) => {
  const [body, overflow, closer, opener, delim, param] = (0, util_1.unwrap)(nodes);
  return new parser_1.List([delim.length === 2 && closer && !overflow && param.trimStart() === '' ? new parser_1.Node(cache?.get(`${delim}\n${body}${delim}`)?.cloneNode(true) || (0, dom_1.html)('div', {
    class: 'math',
    translate: 'no'
  }, `${delim}\n${body}${delim}`)) : new parser_1.Node((0, dom_1.html)('pre', {
    class: 'invalid',
    translate: 'no',
    ...(0, util_1.invalid)('mathblock', delim.length > 2 ? 'syntax' : !closer || overflow ? 'fence' : 'argument', delim.length > 2 ? 'Invalid syntax' : !closer ? `Missing the closing delimiter "${delim}"` : overflow ? `Invalid trailing line after the closing delimiter "${delim}"` : 'Invalid argument')
  }, `${opener}${body}${overflow || closer}`))]);
}));

/***/ },

/***/ 2583
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.mediablock = void 0;
const parser_1 = __webpack_require__(605);
const combinator_1 = __webpack_require__(3484);
const inline_1 = __webpack_require__(7973);
const util_1 = __webpack_require__(4992);
const dom_1 = __webpack_require__(394);
exports.mediablock = (0, combinator_1.block)((0, combinator_1.fmap)((0, combinator_1.inits)([(0, combinator_1.line)((0, combinator_1.union)([inline_1.medialink, inline_1.media, inline_1.lineshortmedia])), (0, combinator_1.some)((0, combinator_1.line)((0, combinator_1.fallback)((0, combinator_1.union)([inline_1.medialink, inline_1.media, inline_1.lineshortmedia]), ({
  source
}) => new parser_1.List([new parser_1.Node((0, dom_1.html)('span', {
  class: 'invalid',
  ...(0, util_1.invalid)('mediablock', 'syntax', 'Not media syntax')
}, source.replace('\n', '')))]))))]), ns => new parser_1.List([new parser_1.Node((0, dom_1.html)('div', (0, util_1.unwrap)(ns)))])));

/***/ },

/***/ 7697
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.olist_ = exports.olist = void 0;
const parser_1 = __webpack_require__(605);
const combinator_1 = __webpack_require__(3484);
const ulist_1 = __webpack_require__(7595);
const ilist_1 = __webpack_require__(4223);
const inline_1 = __webpack_require__(7973);
const util_1 = __webpack_require__(4992);
const visibility_1 = __webpack_require__(6364);
const memoize_1 = __webpack_require__(6925);
const dom_1 = __webpack_require__(394);
const openers = {
  '.': /([0-9]+|[a-z]+|[A-Z]+)(?:-(?=$|[0-9\n])[0-9]*)*(?:\.?(?:$|[\n])|\. )/y,
  '(': /\((?=$|[0-9a-z\n])([0-9]*|[a-z]*)(?=$|[)\n])\)?(?:-(?=$|[0-9\n])[0-9]*)*(?:$|[ \n])/y
};
exports.olist = (0, combinator_1.lazy)(() => (0, combinator_1.block)((0, combinator_1.validate)(new RegExp([/(?:[0-9]+)(?:-[0-9]+)*\. /y.source, /\((?:[0-9]+)\)(?:-[0-9]+)* /y.source].join('|'), 'y'), exports.olist_)));
exports.olist_ = (0, combinator_1.lazy)(() => (0, combinator_1.block)((0, combinator_1.union)([(0, combinator_1.match)(openers['.'], (0, memoize_1.memoize)(ms => list(type(ms[1]), '.'), ms => idx(ms[1]), [])), (0, combinator_1.match)(openers['('], (0, memoize_1.memoize)(ms => list(type(ms[1]), '('), ms => idx(ms[1]), []))])));
const list = (type, form) => (0, combinator_1.fmap)((0, combinator_1.recursion)(2 /* Recursion.listitem */, (0, combinator_1.some)((0, combinator_1.union)([(0, inline_1.indexee)((0, combinator_1.fmap)((0, combinator_1.fallback)((0, combinator_1.inits)([(0, combinator_1.line)((0, combinator_1.open)(heads[form], (0, combinator_1.subsequence)([ulist_1.checkbox, (0, visibility_1.visualize)((0, visibility_1.trimBlank)((0, combinator_1.some)((0, combinator_1.union)([inline_1.indexer, inline_1.inline]))))]), true)), (0, combinator_1.indent)((0, combinator_1.union)([ulist_1.ulist_, exports.olist_, ilist_1.ilist_]))]), ilist_1.ilistitem), ns => new parser_1.List([new parser_1.Node((0, dom_1.html)('li', {
  'data-index': (0, inline_1.dataindex)(ns),
  'data-marker': ns.shift()?.value || undefined
}, (0, dom_1.defrag)((0, util_1.unwrap)((0, ulist_1.fillFirstLine)(ns)))))])))]))), ns => new parser_1.List([new parser_1.Node(format((0, dom_1.html)('ol', (0, util_1.unwrap)(ns)), type, form))]));
const heads = {
  '.': (0, combinator_1.focus)(openers['.'], ({
    source
  }) => new parser_1.List([new parser_1.Node(source.trimEnd().split('.', 1)[0] + '.')])),
  '(': (0, combinator_1.focus)(openers['('], ({
    source
  }) => new parser_1.List([new parser_1.Node(source.trimEnd().replace(/^\($/, '(1)').replace(/^\((\w+)$/, '($1)'))]))
};
function idx(value) {
  switch (value) {
    case 'i':
      return 1;
    case 'a':
      return 2;
    case 'I':
      return 3;
    case 'A':
      return 4;
    default:
      return 0;
  }
}
function type(value) {
  switch (value) {
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
function pattern(type) {
  switch (type) {
    case 'i':
      return /\(?i[).]?$/y;
    case 'a':
      return /\(?a[).]?$/y;
    case 'I':
      return /\(?I[).]?$/y;
    case 'A':
      return /\(?A[).]?$/y;
    default:
      return /\(?[01][).]?$/y;
  }
}
function format(list, type, form) {
  if (list.firstElementChild?.firstElementChild?.classList.contains('checkbox')) {
    list.classList.add('checklist');
  }
  (0, dom_1.define)(list, {
    type: type || undefined,
    'data-format': form === '.' ? undefined : 'paren',
    'data-type': style(type) || undefined
  });
  const marker = list.firstElementChild?.getAttribute('data-marker') ?? '';
  // TODO: CSSカウンターをattr(start)でリセットできるようになればstart値からのオートインクリメントに対応させる。
  const start = marker.match(pattern(type))?.[0] ?? '';
  for (let es = list.children, len = es.length, i = 0; i < len; ++i) {
    const item = es[i];
    switch (item.getAttribute('data-marker')) {
      case null:
        continue;
      case start:
        item.removeAttribute('data-marker');
        continue;
      case marker:
        if (i === 0 || item.classList.contains('invalid')) continue;
        (0, dom_1.define)(item, {
          class: 'invalid',
          ...(0, util_1.invalid)('list', 'index', 'Fix the duplicate index')
        });
    }
    break;
  }
  return list;
}

/***/ },

/***/ 2946
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.pagebreak = void 0;
const parser_1 = __webpack_require__(605);
const combinator_1 = __webpack_require__(3484);
const dom_1 = __webpack_require__(394);
exports.pagebreak = (0, combinator_1.block)((0, combinator_1.line)((0, combinator_1.focus)(/={3,}[^\S\n]*(?:$|\n)/y, () => new parser_1.List([new parser_1.Node((0, dom_1.html)('hr'))]))));

/***/ },

/***/ 4330
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.paragraph = void 0;
const parser_1 = __webpack_require__(605);
const combinator_1 = __webpack_require__(3484);
const inline_1 = __webpack_require__(7973);
const visibility_1 = __webpack_require__(6364);
const util_1 = __webpack_require__(4992);
const dom_1 = __webpack_require__(394);
exports.paragraph = (0, combinator_1.block)((0, combinator_1.fmap)((0, visibility_1.visualize)((0, visibility_1.trimBlankEnd)((0, combinator_1.some)((0, combinator_1.union)([inline_1.inline])))), ns => new parser_1.List([new parser_1.Node((0, dom_1.html)('p', (0, dom_1.defrag)((0, util_1.unwrap)(ns))))])));

/***/ },

/***/ 3832
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.reply = void 0;
const parser_1 = __webpack_require__(605);
const combinator_1 = __webpack_require__(3484);
const cite_1 = __webpack_require__(1200);
const quote_1 = __webpack_require__(4847);
const inline_1 = __webpack_require__(7973);
const source_1 = __webpack_require__(8745);
const visibility_1 = __webpack_require__(6364);
const util_1 = __webpack_require__(4992);
const dom_1 = __webpack_require__(394);
const delimiter = new RegExp(`${cite_1.syntax.source}|${quote_1.syntax.source}`, 'y');
exports.reply = (0, combinator_1.block)((0, combinator_1.validate)(cite_1.syntax, (0, combinator_1.fmap)((0, combinator_1.some)((0, combinator_1.union)([cite_1.cite, quote_1.quote, (0, combinator_1.rewrite)((0, combinator_1.some)(source_1.anyline, delimiter), (0, visibility_1.visualize)((0, combinator_1.fmap)((0, combinator_1.some)(inline_1.inline), (ns, {
  source,
  position
}) => source[position - 1] === '\n' ? ns : ns.push(new parser_1.Node((0, dom_1.html)('br'), 1 /* Flag.blank */)) && ns)))])), ns => new parser_1.List([new parser_1.Node((0, dom_1.html)('p', (0, dom_1.defrag)((0, util_1.unwrap)((0, visibility_1.trimBlankNodeEnd)(ns)))))]))));

/***/ },

/***/ 1200
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.cite = exports.syntax = void 0;
const parser_1 = __webpack_require__(605);
const combinator_1 = __webpack_require__(3484);
const anchor_1 = __webpack_require__(8535);
const source_1 = __webpack_require__(8745);
const util_1 = __webpack_require__(4992);
const dom_1 = __webpack_require__(394);
exports.syntax = />*(?=>>[^>\s]\S*[^\S\n]*(?:$|\n))/y;
exports.cite = (0, combinator_1.line)((0, combinator_1.fmap)((0, combinator_1.open)((0, source_1.str)(exports.syntax), (0, combinator_1.union)([(0, combinator_1.line)(anchor_1.anchor),
// Subject page representation.
// リンクの実装は後で検討
(0, combinator_1.focus)(/>>#\S*(?=\s*$)/y, ({
  source
}) => new parser_1.List([new parser_1.Node((0, dom_1.html)('a', {
  class: 'anchor'
}, source))])), (0, combinator_1.focus)(/>>https?:\/\/\S+(?=\s*$)/y, ({
  source
}) => new parser_1.List([new parser_1.Node((0, dom_1.html)('a', {
  class: 'anchor',
  href: source.slice(2).trimEnd(),
  target: '_blank'
}, source))])), (0, combinator_1.focus)(/>>\S+(?=\s*$)/y, ({
  source
}) => new parser_1.List([new parser_1.Node(source)]))])), nodes => {
  const quotes = nodes.head.value;
  const node = nodes.last.value;
  return new parser_1.List([new parser_1.Node((0, dom_1.html)('span', typeof node === 'object' ? {
    class: 'cite'
  } : {
    class: 'cite invalid',
    ...(0, util_1.invalid)('cite', 'syntax', 'Invalid syntax')
  }, (0, dom_1.defrag)([`${quotes}>`, typeof node === 'object' ? (0, dom_1.define)(node, {
    'data-depth': `${quotes.length + 1}`
  }, node.innerText.slice(1)) : node.slice(1)]))), new parser_1.Node((0, dom_1.html)('br'), 1 /* Flag.blank */)]);
}));

/***/ },

/***/ 4847
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.quote = exports.syntax = void 0;
const parser_1 = __webpack_require__(605);
const combinator_1 = __webpack_require__(3484);
const math_1 = __webpack_require__(2962);
const autolink_1 = __webpack_require__(5691);
const source_1 = __webpack_require__(8745);
const util_1 = __webpack_require__(4992);
const dom_1 = __webpack_require__(394);
exports.syntax = />+ /y;
exports.quote = (0, combinator_1.lazy)(() => (0, combinator_1.block)((0, combinator_1.fmap)((0, combinator_1.rewrite)((0, combinator_1.some)((0, combinator_1.validate)(exports.syntax, source_1.anyline)), (0, combinator_1.convert)(source => source.replace(/(?<=^>+ )/gm, '\r'), (0, combinator_1.some)((0, combinator_1.union)([
// quote補助関数が残した数式をパースする。
math_1.math, autolink_1.autolink, source_1.unescsource])))), (ns, {
  source,
  position
}) => new parser_1.List([new parser_1.Node(source[position - 1] === '\n' ? ns.pop().value : (0, dom_1.html)('br'), 1 /* Flag.blank */), new parser_1.Node((0, dom_1.html)('span', {
  class: 'quote'
}, (0, dom_1.defrag)((0, util_1.unwrap)(ns))))].reverse())), false));

/***/ },

/***/ 6500
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.sidefence = void 0;
const parser_1 = __webpack_require__(605);
const combinator_1 = __webpack_require__(3484);
const autolink_1 = __webpack_require__(1671);
const source_1 = __webpack_require__(8745);
const util_1 = __webpack_require__(4992);
const dom_1 = __webpack_require__(394);
exports.sidefence = (0, combinator_1.lazy)(() => (0, combinator_1.block)((0, combinator_1.fmap)((0, combinator_1.focus)(/\|+ [^\n]*(?:\n\|+(?=$|[ \n])[^\n]*)*(?:$|\n)/y, (0, combinator_1.union)([source])), ([{
  value
}]) => new parser_1.List([new parser_1.Node((0, dom_1.define)(value, {
  class: 'invalid',
  ...(0, util_1.invalid)('sidefence', 'syntax', 'Reserved syntax')
}))]))));
const opener = /(?=\|\|+(?:$|[ \n]))/y;
const indent = (0, combinator_1.open)(opener, (0, combinator_1.some)(source_1.contentline, /\|(?:$|[ \n])/y));
const unindent = source => source.replace(/(?<=^|\n)\|(?: |(?=\|*(?:$|[ \n])))|\n$/g, '');
const source = (0, combinator_1.lazy)(() => (0, combinator_1.fmap)((0, combinator_1.recursion)(0 /* Recursion.block */, (0, combinator_1.some)((0, combinator_1.union)([(0, combinator_1.rewrite)(indent, (0, combinator_1.convert)(unindent, source, true)), (0, combinator_1.rewrite)((0, combinator_1.some)(source_1.contentline, opener), (0, combinator_1.convert)(unindent, (0, combinator_1.fmap)(autolink_1.autolink, ns => new parser_1.List([new parser_1.Node((0, dom_1.html)('pre', (0, dom_1.defrag)((0, util_1.unwrap)(ns))))])), true))]))), ns => new parser_1.List([new parser_1.Node((0, dom_1.html)('blockquote', (0, util_1.unwrap)(ns)))])));

/***/ },

/***/ 2752
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.table = void 0;
const parser_1 = __webpack_require__(605);
const combinator_1 = __webpack_require__(3484);
const inline_1 = __webpack_require__(7973);
const source_1 = __webpack_require__(8745);
const visibility_1 = __webpack_require__(6364);
const util_1 = __webpack_require__(4992);
const duff_1 = __webpack_require__(9202);
const array_1 = __webpack_require__(6876);
const dom_1 = __webpack_require__(394);
exports.table = (0, combinator_1.lazy)(() => (0, combinator_1.block)((0, combinator_1.fmap)((0, combinator_1.validate)(/\|[^\n]*\n\|[-:][^\n]*\n\|/y, (0, combinator_1.sequence)([row((0, combinator_1.some)(head), true), row((0, combinator_1.some)(align), false), (0, combinator_1.some)(row((0, combinator_1.some)(data), true))])), rows => new parser_1.List([new parser_1.Node((0, dom_1.html)('table', [(0, dom_1.html)('thead', [rows.shift().value]), (0, dom_1.html)('tbody', (0, util_1.unwrap)(format(rows)))]))]))));
const row = (parser, optional) => (0, combinator_1.fallback)((0, combinator_1.fmap)((0, combinator_1.line)((0, combinator_1.surround)(/(?=\|)/y, (0, combinator_1.some)((0, combinator_1.union)([parser])), /\|?\s*$/y, optional)), ns => new parser_1.List([new parser_1.Node((0, dom_1.html)('tr', (0, util_1.unwrap)(ns)))])), (0, combinator_1.rewrite)(source_1.contentline, ({
  source
}) => new parser_1.List([new parser_1.Node((0, dom_1.html)('tr', {
  class: 'invalid',
  ...(0, util_1.invalid)('table-row', 'syntax', 'Missing the start symbol of the table row')
}, [(0, dom_1.html)('td', source.replace('\n', ''))]))])));
const align = (0, combinator_1.fmap)((0, combinator_1.open)('|', (0, combinator_1.union)([(0, combinator_1.focus)(/:-+:?/y, ({
  source,
  position,
  range
}) => new parser_1.List([new parser_1.Node(source[position + range - 1] === ':' ? 'center' : 'start')]), false), (0, combinator_1.focus)(/-+:?/y, ({
  source,
  position,
  range
}) => new parser_1.List([new parser_1.Node(source[position + range - 1] === ':' ? 'end' : '')]), false)])), ns => new parser_1.List([new parser_1.Node((0, dom_1.html)('td', (0, dom_1.defrag)((0, util_1.unwrap)(ns))))]));
const cell = (0, combinator_1.surround)(/\|\s*(?=\S)/y, (0, combinator_1.union)([(0, combinator_1.close)(inline_1.medialink, /\s*(?=\||$)/y), (0, combinator_1.close)(inline_1.media, /\s*(?=\||$)/y), (0, combinator_1.close)(inline_1.shortmedia, /\s*(?=\||$)/y), (0, visibility_1.trimBlank)((0, combinator_1.some)(inline_1.inline, /\|/y, [[/\|?\s*$/y, 9]]))]), /[^|]*/y, true);
const head = (0, combinator_1.fmap)(cell, ns => new parser_1.List([new parser_1.Node((0, dom_1.html)('th', (0, dom_1.defrag)((0, util_1.unwrap)(ns))))]));
const data = (0, combinator_1.fmap)(cell, ns => new parser_1.List([new parser_1.Node((0, dom_1.html)('td', (0, dom_1.defrag)((0, util_1.unwrap)(ns))))]));
function format(rows) {
  const aligns = rows.head.value.className === 'invalid' ? [] : (0, duff_1.duffReduce)(rows.shift().value.children, (acc, el) => (0, array_1.push)(acc, [el.textContent]), []);
  for (const {
    value: row
  } of rows) {
    for (let cols = row.children, len = cols.length, j = 0; j < len; ++j) {
      if (j > 0 && !aligns[j]) {
        aligns[j] = aligns[j - 1];
      }
      if (!aligns[j]) continue;
      cols[j].setAttribute('align', aligns[j]);
    }
  }
  return rows;
}

/***/ },

/***/ 7595
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.fillFirstLine = exports.checkbox = exports.ulist_ = exports.ulist = void 0;
const parser_1 = __webpack_require__(605);
const combinator_1 = __webpack_require__(3484);
const olist_1 = __webpack_require__(7697);
const ilist_1 = __webpack_require__(4223);
const inline_1 = __webpack_require__(7973);
const visibility_1 = __webpack_require__(6364);
const util_1 = __webpack_require__(4992);
const dom_1 = __webpack_require__(394);
exports.ulist = (0, combinator_1.lazy)(() => (0, combinator_1.block)((0, combinator_1.validate)('- ', exports.ulist_)));
exports.ulist_ = (0, combinator_1.lazy)(() => (0, combinator_1.block)((0, combinator_1.fmap)((0, combinator_1.validate)(/-(?=$|[ \n])/y, (0, combinator_1.recursion)(2 /* Recursion.listitem */, (0, combinator_1.some)((0, combinator_1.union)([(0, inline_1.indexee)((0, combinator_1.fmap)((0, combinator_1.fallback)((0, combinator_1.inits)([(0, combinator_1.line)((0, combinator_1.open)(/-(?:$|[ \n])/y, (0, combinator_1.subsequence)([exports.checkbox, (0, visibility_1.visualize)((0, visibility_1.trimBlank)((0, combinator_1.some)((0, combinator_1.union)([inline_1.indexer, inline_1.inline]))))]), true)), (0, combinator_1.indent)((0, combinator_1.union)([exports.ulist_, olist_1.olist_, ilist_1.ilist_]))]), ilist_1.ilistitem), ns => new parser_1.List([new parser_1.Node((0, dom_1.html)('li', {
  'data-index': (0, inline_1.dataindex)(ns)
}, (0, dom_1.defrag)((0, util_1.unwrap)(fillFirstLine(ns)))))])))])))), ns => new parser_1.List([new parser_1.Node(format((0, dom_1.html)('ul', (0, util_1.unwrap)(ns))))]))));
exports.checkbox = (0, combinator_1.focus)(/\[[xX ]\](?=$|[ \n])/y, ({
  source,
  position
}) => new parser_1.List([new parser_1.Node((0, dom_1.html)('span', {
  class: 'checkbox'
}, source[position + 1].trimStart() ? '☑' : '☐'))]), false);
function fillFirstLine(nodes) {
  const node = nodes.head?.value;
  if (typeof node !== 'object') return nodes;
  switch (node.tagName) {
    case 'UL':
    case 'OL':
      nodes.unshift(new parser_1.Node((0, dom_1.html)('br')));
  }
  return nodes;
}
exports.fillFirstLine = fillFirstLine;
function format(list) {
  if (list.firstElementChild?.firstElementChild?.classList.contains('checkbox')) {
    list.classList.add('checklist');
  }
  return list;
}

/***/ },

/***/ 8669
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.CmdRegExp = exports.Context = void 0;
const parser_1 = __webpack_require__(605);
class Context extends parser_1.Context {
  constructor(options = {}) {
    super(options);
    this.recursion = new RecursionCounter('annotation', 2);
    const {
      segment,
      buffer,
      sequential,
      header,
      host,
      url,
      id,
      caches
    } = options;
    this.segment = segment ?? 0 /* Segment.unknown */;
    this.buffer = buffer ?? new parser_1.List();
    this.sequential = sequential ?? false;
    this.header = header ?? true;
    this.host = host;
    this.url = url;
    this.id = id;
    this.caches = caches;
  }
}
exports.Context = Context;
class RecursionCounter {
  constructor(syntax, limit) {
    this.syntax = syntax;
    this.limit = limit;
    this.stack = [];
    this.index = 0;
  }
  add(depth) {
    const {
      stack
    } = this;
    for (; this.index > 0 && stack[this.index - 1] <= depth; --this.index);
    // 内側から数えるので無効化処理できずエラーを投げるしかない。
    if (this.index === this.limit) throw new Error(`Too much ${this.syntax} recursion`);
    stack[this.index] = depth;
    ++this.index;
  }
}
exports.CmdRegExp = {
  Error: /\x07/g
};

/***/ },

/***/ 3009
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.header = void 0;
const parser_1 = __webpack_require__(605);
const combinator_1 = __webpack_require__(3484);
const source_1 = __webpack_require__(8745);
const util_1 = __webpack_require__(4992);
const normalize_1 = __webpack_require__(4490);
const dom_1 = __webpack_require__(394);
exports.header = (0, combinator_1.lazy)(() => (0, combinator_1.validate)(/---+[^\S\n]*\n(?=\S)/y, (0, combinator_1.inits)([(0, combinator_1.block)((0, combinator_1.union)([(0, combinator_1.validate)(context => context.header, (0, combinator_1.focus)(/(---+)[^\S\n]*\n(?:[a-z][0-9a-z]*(?:-[0-9a-z]+)*:[ \t]+\S[^\n]*\n){1,100}\1[^\S\n]*(?:$|\n)/yi, (0, combinator_1.convert)(source => (0, normalize_1.normalize)(source.slice(source.indexOf('\n') + 1, source.trimEnd().lastIndexOf('\n'))), (0, combinator_1.fmap)((0, combinator_1.some)((0, combinator_1.union)([field])), ns => new parser_1.List([new parser_1.Node((0, dom_1.html)('aside', {
  class: 'header'
}, [(0, dom_1.html)('details', {
  open: ''
}, (0, dom_1.defrag)((0, util_1.unwrap)(ns.unshift(new parser_1.Node((0, dom_1.html)('summary', 'Header'))) && ns)))]))]))))), context => {
  const {
    source,
    position
  } = context;
  context.position += source.length;
  return new parser_1.List([new parser_1.Node((0, dom_1.html)('pre', {
    class: 'invalid',
    translate: 'no',
    ...(0, util_1.invalid)('header', 'syntax', 'Invalid syntax')
  }, (0, normalize_1.normalize)(source.slice(position))))]);
}])), (0, combinator_1.clear)((0, source_1.str)(/[^\S\n]*\n/y))])));
const field = (0, combinator_1.line)(({
  source,
  position
}) => {
  const name = source.slice(position, source.indexOf(':', position));
  const value = source.slice(position + name.length + 1).trim();
  return new parser_1.List([new parser_1.Node((0, dom_1.html)('span', {
    class: 'field',
    'data-name': name.toLowerCase(),
    'data-value': value
  }, [(0, dom_1.html)('span', {
    class: 'field-name'
  }, name), ': ', (0, dom_1.html)('span', {
    class: 'field-value'
  }, value), '\n']))]);
});

/***/ },

/***/ 7973
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.lineshortmedia = exports.shortmedia = exports.media = exports.medialink = exports.dataindex = exports.indexer = exports.indexee = exports.inline = void 0;
const combinator_1 = __webpack_require__(3484);
const annotation_1 = __webpack_require__(4045);
const reference_1 = __webpack_require__(9047);
const template_1 = __webpack_require__(4510);
const remark_1 = __webpack_require__(8948);
const extension_1 = __webpack_require__(2743);
const label_1 = __webpack_require__(2178);
const link_1 = __webpack_require__(3628);
const ruby_1 = __webpack_require__(7304);
const html_1 = __webpack_require__(5013);
const insertion_1 = __webpack_require__(4515);
const deletion_1 = __webpack_require__(7066);
const mark_1 = __webpack_require__(5381);
const emstrong_1 = __webpack_require__(365);
const strong_1 = __webpack_require__(6591);
const emphasis_1 = __webpack_require__(1354);
const italic_1 = __webpack_require__(3744);
const math_1 = __webpack_require__(2962);
const code_1 = __webpack_require__(3481);
const htmlentity_1 = __webpack_require__(470);
const bracket_1 = __webpack_require__(4526);
const autolink_1 = __webpack_require__(5691);
const source_1 = __webpack_require__(8745);
const stars = (0, source_1.strs)('*');
exports.inline = (0, combinator_1.lazy)(() => (0, combinator_1.union)([input => {
  const {
    source,
    position
  } = input;
  if (position === source.length) return;
  switch (source[position]) {
    case '(':
      if (source[position + 1] === '(') return (0, annotation_1.annotation)(input) || (0, bracket_1.bracket)(input);
      return (0, bracket_1.bracket)(input);
    case '[':
      switch (source[position + 1]) {
        case '[':
          return (0, reference_1.reference)(input) || (0, link_1.textlink)(input) || (0, bracket_1.bracket)(input);
        case '%':
          return (0, remark_1.remark)(input) || (0, link_1.textlink)(input) || (0, ruby_1.ruby)(input) || (0, bracket_1.bracket)(input);
        case '#':
        case '$':
        case ':':
        case '^':
        case '|':
          return (0, extension_1.extension)(input) || (0, link_1.textlink)(input) || (0, ruby_1.ruby)(input) || (0, bracket_1.bracket)(input);
      }
      return (0, link_1.textlink)(input) || (0, ruby_1.ruby)(input) || (0, bracket_1.bracket)(input);
    case '{':
      if (source[position + 1] === '{') return (0, template_1.template)(input) || (0, bracket_1.bracket)(input);
      return (0, link_1.textlink)(input) || (0, bracket_1.bracket)(input);
    case '"':
    case '（':
    case '［':
    case '｛':
      return (0, bracket_1.bracket)(input);
    case '<':
      return (0, html_1.html)(input);
    case '$':
      if (source[position + 1] === '{') return (0, math_1.math)(input);
      return (0, label_1.label)(input) || (0, math_1.math)(input);
    case '+':
      if (source[position + 1] === '+') return (0, insertion_1.insertion)(input);
      break;
    case '~':
      if (source[position + 1] === '~') return (0, deletion_1.deletion)(input);
      break;
    case '=':
      if (source[position + 1] === '=') return (0, mark_1.mark)(input);
      break;
    case '/':
      if (source[position + 1] === '/' && source[position + 2] === '/') return (0, italic_1.italic)(input);
      break;
    case '*':
      return source[position + 1] === '*' ? source[position + 2] === '*' ? (0, emstrong_1.emstrong)(input) || stars(input) : (0, strong_1.strong)(input) || stars(input) : (0, emphasis_1.emphasis)(input);
    case '`':
      return (0, code_1.code)(input);
    case '&':
      return (0, htmlentity_1.htmlentity)(input);
  }
}, autolink_1.autolink, source_1.text]));
var indexee_1 = __webpack_require__(7610);
Object.defineProperty(exports, "indexee", ({
  enumerable: true,
  get: function () {
    return indexee_1.indexee;
  }
}));
var indexer_1 = __webpack_require__(7483);
Object.defineProperty(exports, "indexer", ({
  enumerable: true,
  get: function () {
    return indexer_1.indexer;
  }
}));
var index_1 = __webpack_require__(4688);
Object.defineProperty(exports, "dataindex", ({
  enumerable: true,
  get: function () {
    return index_1.dataindex;
  }
}));
var link_2 = __webpack_require__(3628);
Object.defineProperty(exports, "medialink", ({
  enumerable: true,
  get: function () {
    return link_2.medialink;
  }
}));
var media_1 = __webpack_require__(7478);
Object.defineProperty(exports, "media", ({
  enumerable: true,
  get: function () {
    return media_1.media;
  }
}));
var shortmedia_1 = __webpack_require__(5902);
Object.defineProperty(exports, "shortmedia", ({
  enumerable: true,
  get: function () {
    return shortmedia_1.shortmedia;
  }
}));
Object.defineProperty(exports, "lineshortmedia", ({
  enumerable: true,
  get: function () {
    return shortmedia_1.lineshortmedia;
  }
}));

/***/ },

/***/ 4045
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.annotation = void 0;
const parser_1 = __webpack_require__(605);
const combinator_1 = __webpack_require__(3484);
const inline_1 = __webpack_require__(7973);
const bracket_1 = __webpack_require__(4526);
const visibility_1 = __webpack_require__(6364);
const util_1 = __webpack_require__(4992);
const dom_1 = __webpack_require__(394);
// シグネチャ等生成のために構文木のツリーウォークを再帰的に行い指数計算量にならないよう
// 動的計画法を適用するか再帰数を制限する必要がある。
// 動的計画法においては再帰的記録により指数空間計算量にならないよう下位の記録を消しながら記録しなければならない。
// トリムも再帰的に行わないよう前後のトリムサイズの記録を要する。
// しかし理論的には無制限の再帰が可能だがホバーテキストの記録やハッシュの計算を行う言語仕様から指数計算量を
// 避けられないためAnnotation構文に限り再帰数の制限が必要となる。
// シグネチャやハッシュは分割計算可能にすれば解決するがホバーテキストは記録せず動的に再計算して
// 表示しなければ指数空間計算量を避けられない。
// 注釈を除外すると重複排除により参照元が消滅し欠番が生じるため少なくとも直接注釈は残す必要があるが間接注釈は
// 除外できる。しかしこれを効率的に行うことは難しいため最大再帰数を1回に制限することで間接注釈を行えない
// ようにするのが合理的だろう。
// 原理的には逆順処理により圧縮後正順で再附番すればすべて解決するはずだがテキストとシグネチャとハッシュも
// 修正する必要があるためほぼ完全な二重処理が必要になり三重以上の注釈という不適切な使用のために
// 常に非常に非効率な処理を行い常時低速化するより三重以上の注釈を禁止して効率性を維持するのが妥当である。
const MAX_DEPTH = 20;
exports.annotation = (0, combinator_1.lazy)(() => (0, combinator_1.constraint)(128 /* State.annotation */, (0, combinator_1.surround)((0, combinator_1.open)('((', visibility_1.beforeNonblank), (0, combinator_1.precedence)(1, (0, combinator_1.recursions)([4 /* Recursion.annotation */, 3 /* Recursion.inline */, 5 /* Recursion.bracket */, 5 /* Recursion.bracket */], (0, combinator_1.some)((0, combinator_1.union)([inline_1.inline]), ')', [[')', 1]]))), '))', false, [], ([, ns], context) => {
  const {
    linebreak,
    recursion,
    resources
  } = context;
  if (linebreak !== 0) {
    ns.unshift(new parser_1.Node('('));
    ns.push(new parser_1.Node(')'));
    return new parser_1.List([new parser_1.Node((0, dom_1.html)('span', {
      class: 'bracket'
    }, ['(', (0, dom_1.html)('span', {
      class: 'bracket'
    }, (0, dom_1.defrag)((0, util_1.unwrap)(ns))), ')']))]);
  }
  const depth = MAX_DEPTH - (resources?.recursions[4 /* Recursion.annotation */] ?? resources?.recursions.at(-1) ?? MAX_DEPTH);
  recursion.add(depth);
  return new parser_1.List([new parser_1.Node((0, dom_1.html)('sup', {
    class: 'annotation'
  }, [(0, dom_1.html)('span', (0, dom_1.defrag)((0, util_1.unwrap)((0, visibility_1.trimBlankNodeEnd)(ns))))]))]);
}, ([, bs], context) => {
  const {
    source,
    position,
    range,
    linebreak,
    recursion,
    resources
  } = context;
  const depth = MAX_DEPTH - (resources?.recursions[4 /* Recursion.annotation */] ?? resources?.recursions.at(-1) ?? MAX_DEPTH);
  if (linebreak === 0 && bs && bs.length === 1 && source[position] === ')' && typeof bs.head?.value === 'object') {
    const {
      className
    } = bs.head.value;
    if (className === 'paren' || className === 'bracket') {
      const {
        firstChild,
        lastChild
      } = bs.head.value;
      if (firstChild.nodeValue.length === 1) {
        firstChild.remove();
      } else {
        firstChild.nodeValue = firstChild.nodeValue.slice(1);
      }
      if (lastChild.nodeValue.length === 1) {
        lastChild.remove();
      } else {
        lastChild.nodeValue = lastChild.nodeValue.slice(0, -1);
      }
      context.position += 1;
      recursion.add(depth);
      return new parser_1.List([new parser_1.Node((0, dom_1.html)('span', {
        class: 'bracket'
      }, ['(', (0, dom_1.html)('sup', {
        class: 'annotation'
      }, [(0, dom_1.html)('span', bs.head.value.childNodes)])]))]);
    }
    if (className === 'annotation' && deepunwrap(bs)) {
      context.position += 1;
      recursion.add(depth);
      return new parser_1.List([new parser_1.Node((0, dom_1.html)('span', {
        class: 'bracket'
      }, ['(', (0, dom_1.html)('sup', {
        class: 'annotation'
      }, [(0, dom_1.html)('span', [bs.head.value])])]))]);
    }
  }
  bs ??= new parser_1.List();
  bs.unshift(new parser_1.Node('('));
  if (source[context.position] === ')') {
    bs.push(new parser_1.Node(')'));
    context.position += 1;
  }
  const str = linebreak === 0 ? source.slice(position - range + 2, position) : '';
  bs = linebreak === 0 && (str === '' || bracket_1.indexA.test(str)) ? new parser_1.List([new parser_1.Node((0, dom_1.html)('span', {
    class: 'paren'
  }, (0, dom_1.defrag)((0, util_1.unwrap)(bs))))]) : new parser_1.List([new parser_1.Node((0, dom_1.html)('span', {
    class: 'bracket'
  }, (0, dom_1.defrag)((0, util_1.unwrap)(bs))))]);
  bs.unshift(new parser_1.Node('('));
  const cs = parser(context);
  if (source[context.position] === ')') {
    cs && bs.import(cs);
    bs.push(new parser_1.Node(')'));
    context.position += 1;
  }
  return new parser_1.List([new parser_1.Node((0, dom_1.html)('span', {
    class: 'bracket'
  }, (0, dom_1.defrag)((0, util_1.unwrap)(bs))))]);
})));
const parser = (0, combinator_1.lazy)(() => (0, combinator_1.precedence)(1, (0, combinator_1.some)(inline_1.inline, ')', [[')', 1]])));
function deepunwrap(list) {
  let bottom = list.head.value;
  for (; bottom;) {
    const el = bottom.firstChild.firstChild;
    if (el !== el?.parentNode?.lastChild) break;
    if (el instanceof HTMLElement === false) break;
    if (el?.className !== 'annotation') break;
    bottom = el;
  }
  const el = bottom.firstChild.firstChild;
  if (el instanceof Element === false) return false;
  if (el === el?.parentNode?.lastChild) {
    const {
      className,
      firstChild,
      lastChild
    } = el;
    if (className === 'paren' || className === 'bracket') {
      firstChild.nodeValue.length === 1 ? firstChild.remove() : firstChild.nodeValue = firstChild.nodeValue.slice(1);
      lastChild.nodeValue.length === 1 ? lastChild.remove() : lastChild.nodeValue = lastChild.nodeValue.slice(0, -1);
      el.replaceWith(...el.childNodes);
      return true;
    }
  }
  return false;
}

/***/ },

/***/ 5691
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.autolink = void 0;
const combinator_1 = __webpack_require__(3484);
const url_1 = __webpack_require__(2129);
const email_1 = __webpack_require__(5836);
const account_1 = __webpack_require__(4107);
const hashtag_1 = __webpack_require__(5764);
const hashnum_1 = __webpack_require__(8684);
const anchor_1 = __webpack_require__(8535);
const text_1 = __webpack_require__(5655);
exports.autolink = (0, combinator_1.lazy)(() => (0, combinator_1.state)(~1 /* State.autolink */, input => {
  const {
    source,
    position
  } = input;
  if (position === source.length) return;
  const fst = source[position];
  switch (fst) {
    case '@':
      return (0, account_1.account)(input);
    case '#':
      return (0, hashtag_1.hashtag)(input) || (0, hashnum_1.hashnum)(input);
    case '>':
      return (0, anchor_1.anchor)(input);
    case '!':
      if (!source.startsWith('http', position + 1)) break;
      if (position === 0) return (0, url_1.lineurl)(input);
      switch (source[position - 1]) {
        case '\r':
        case '\n':
          return (0, url_1.lineurl)(input);
      }
      break;
    case 'h':
      if (!source.startsWith('http', position)) return;
      if (position === 0) return (0, url_1.lineurl)(input) || (0, url_1.url)(input) || (0, email_1.email)(input);
      switch (source[position - 1]) {
        case '\r':
        case '\n':
          return (0, url_1.lineurl)(input) || (0, url_1.url)(input) || (0, email_1.email)(input);
      }
      return (0, url_1.url)(input) || (0, email_1.email)(input);
    default:
      if ((0, text_1.isAlphanumeric)(fst)) return (0, email_1.email)(input);
  }
}));

/***/ },

/***/ 4107
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.account = void 0;
const parser_1 = __webpack_require__(605);
const combinator_1 = __webpack_require__(3484);
const link_1 = __webpack_require__(3628);
const hashtag_1 = __webpack_require__(5764);
const source_1 = __webpack_require__(8745);
const dom_1 = __webpack_require__(394);
// https://example/@user must be a user page or a redirect page going there.
// https://example/@user?ch=a+b must be a user channel page or a redirect page going there.
exports.account = (0, combinator_1.lazy)(() => (0, combinator_1.constraint)(1 /* State.autolink */, (0, combinator_1.state)(1 /* State.autolink */, (0, combinator_1.surround)((0, combinator_1.surround)(/(?<![0-9a-z@#])@/yi, (0, source_1.str)(/[0-9a-z](?:[.-](?=[0-9a-z])|[0-9a-z]){0,254}\/|/yi), (0, source_1.str)(/[a-z][0-9a-z]*(?:[.-][0-9a-z]+)*(?![_.-]?[0-9a-z@]|>>|:\S)/yi), false, [3 | 8 /* Backtrack.unescapable */]), (0, combinator_1.some)((0, combinator_1.surround)('#', (0, combinator_1.verify)((0, source_1.str)(new RegExp([/(?!['_])(?:[^\p{C}\p{S}\p{P}\s]|emoji|'(?=[0-9A-Za-z])|_(?=[^\p{C}\p{S}\p{P}\s]|emoji))+/yu.source].join('|').replace(/emoji/g, hashtag_1.emoji.source), 'yu')), ([{
  value
}]) => /^[0-9]{0,4}[^0-9]/.test(value)), new RegExp([/(?![_.-]?[0-9a-z@]|>>|:\S|[^\p{C}\p{S}\p{P}\s]|emoji)/yu.source].join('|').replace(/emoji/g, hashtag_1.emoji.source), 'yu'), false, [3 | 8 /* Backtrack.unescapable */])), '', false, [], ([[{
  value: host
}, {
  value: account
}], nodes], context) => {
  const hashes = nodes.foldl((acc, {
    value
  }) => acc + '#' + value, '');
  const param = nodes.foldl((acc, {
    value
  }) => acc ? acc + '+' + value : value, '');
  return new parser_1.List([new parser_1.Node((0, dom_1.define)((0, link_1.parse)(new parser_1.List([new parser_1.Node(`@${host}${account}${hashes}`)]), new parser_1.List([new parser_1.Node(host ? `https://${host}@${account}?ch=${param}` : `/@${account}?ch=${param}`)]), context), {
    class: 'channel'
  }))]);
}, ([[{
  value: host
}, {
  value: account
}]], context) => {
  if (context.source[context.position] === '#') {
    return void (0, combinator_1.setBacktrack)(context, 2 | 8 /* Backtrack.unescapable */, context.position - context.range);
  }
  return new parser_1.List([new parser_1.Node((0, dom_1.define)((0, link_1.parse)(new parser_1.List([new parser_1.Node(`@${host}${account}`)]), new parser_1.List([new parser_1.Node(host ? `https://${host}@${account}` : `/@${account}`)]), context), {
    class: 'account'
  }))]);
}))));

/***/ },

/***/ 8535
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.anchor = void 0;
const parser_1 = __webpack_require__(605);
const combinator_1 = __webpack_require__(3484);
const link_1 = __webpack_require__(3628);
const source_1 = __webpack_require__(8745);
const dom_1 = __webpack_require__(394);
// Timeline(pseudonym): user/tid
// Thread(anonymous): cid
// UTC
// tid: YYYY-MMDD-HHMM-SS
// cid: YYYY-MMDD-HHMM-SSmmm
// 内部表現はUnixTimeに統一する(時系列順)
// 外部表現は投稿ごとに投稿者の投稿時のタイムゾーンに統一する(非時系列順)
exports.anchor = (0, combinator_1.lazy)(() => (0, combinator_1.constraint)(1 /* State.autolink */, (0, combinator_1.state)(1 /* State.autolink */, (0, combinator_1.surround)(/(?<![0-9a-z@#])>>/yi, (0, source_1.str)(/[0-9a-z]+(?:-[0-9a-z]+)*(?![_.-]?[0-9a-z@#]|>>|:\S)/yi), '', false, [3 | 8 /* Backtrack.unescapable */], ([, [{
  value
}]], context) => new parser_1.List([new parser_1.Node((0, dom_1.define)((0, link_1.parse)(new parser_1.List([new parser_1.Node(`>>${value}`)]), new parser_1.List([new parser_1.Node(`?at=${value}`)]), context), {
  class: 'anchor'
}))])))));

/***/ },

/***/ 5836
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.email = void 0;
const parser_1 = __webpack_require__(605);
const combinator_1 = __webpack_require__(3484);
const source_1 = __webpack_require__(8745);
const dom_1 = __webpack_require__(394);
// https://html.spec.whatwg.org/multipage/input.html
exports.email = (0, combinator_1.constraint)(1 /* State.autolink */, (0, combinator_1.state)(1 /* State.autolink */, (0, combinator_1.surround)(/(?<![0-9a-z][_.+-]?|[@#])(?=[0-9a-z])/yi, (0, combinator_1.verify)((0, source_1.str)(/[0-9a-z](?:[_.+-](?=[0-9a-z])|[0-9a-z]){0,63}@[0-9a-z](?:[.-](?=[0-9a-z])|[0-9a-z]){0,254}(?![_.-]?[0-9a-z@#]|>>|:\S)/yi), ([{
  value
}]) => value.length <= 254), '', false, [3 | 8 /* Backtrack.unescapable */], ([, [{
  value
}]]) => new parser_1.List([new parser_1.Node((0, dom_1.html)('a', {
  class: 'email',
  href: `mailto:${value}`
}, value))]))));

/***/ },

/***/ 8684
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.hashnum = void 0;
const parser_1 = __webpack_require__(605);
const combinator_1 = __webpack_require__(3484);
const link_1 = __webpack_require__(3628);
const hashtag_1 = __webpack_require__(5764);
const source_1 = __webpack_require__(8745);
const dom_1 = __webpack_require__(394);
exports.hashnum = (0, combinator_1.lazy)(() => (0, combinator_1.constraint)(1 /* State.autolink */, (0, combinator_1.state)(1 /* State.autolink */, (0, combinator_1.surround)(new RegExp([/(?<![^\p{C}\p{S}\p{P}\s]|emoji|[@#])#/yu.source].join('|').replace(/emoji/g, hashtag_1.emoji.source), 'yu'), (0, source_1.str)(new RegExp([/[0-9]{1,9}(?![_.-]?[0-9a-z@#]|>>|:\S|[^\p{C}\p{S}\p{P}\s]|emoji)/yu.source].join('|').replace(/emoji/g, hashtag_1.emoji.source), 'yu')), '', false,
// unescapableを使用するべきだがhashtagとの重複を回避するためescapableを使用する。
[3 | 16 /* Backtrack.escapable */], ([, [{
  value
}]], context) => new parser_1.List([new parser_1.Node((0, dom_1.define)((0, link_1.parse)(new parser_1.List([new parser_1.Node(`#${value}`)]), new parser_1.List([new parser_1.Node(value)]), context), {
  class: 'hashnum',
  href: null
}))])))));

/***/ },

/***/ 5764
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.hashtag = exports.emoji = void 0;
const parser_1 = __webpack_require__(605);
const combinator_1 = __webpack_require__(3484);
const link_1 = __webpack_require__(3628);
const source_1 = __webpack_require__(8745);
const dom_1 = __webpack_require__(394);
// https://example/hashtags/a must be a hashtag page or a redirect page going there.
// https://github.com/tc39/proposal-regexp-unicode-property-escapes#matching-emoji
exports.emoji = /\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|\p{Emoji_Presentation}|\p{Emoji}\uFE0F|\u200D/u;
exports.hashtag = (0, combinator_1.lazy)(() => (0, combinator_1.constraint)(1 /* State.autolink */, (0, combinator_1.state)(1 /* State.autolink */, (0, combinator_1.surround)(new RegExp([/(?<![^\p{C}\p{S}\p{P}\s]|emoji|[@#])#/yu.source].join('|').replace(/emoji/g, exports.emoji.source), 'yu'), (0, combinator_1.verify)((0, source_1.str)(new RegExp([/(?!['_])(?:[^\p{C}\p{S}\p{P}\s]|emoji|'(?=[0-9A-Za-z])|_(?=[^\p{C}\p{S}\p{P}\s]|emoji))+/yu.source].join('|').replace(/emoji/g, exports.emoji.source), 'yu')), ([{
  value
}]) => /^[0-9]{0,4}[^0-9]/.test(value)), new RegExp([/(?![_.-]?[0-9a-z@#]|>>|:\S|[^\p{C}\p{S}\p{P}\s]|emoji)/yu.source].join('|').replace(/emoji/g, exports.emoji.source), 'yu'), false, [3 | 8 /* Backtrack.unescapable */], ([, [{
  value
}]], context) => new parser_1.List([new parser_1.Node((0, dom_1.define)((0, link_1.parse)(new parser_1.List([new parser_1.Node(`#${value}`)]), new parser_1.List([new parser_1.Node(`/hashtags/${value}`)]), context), {
  class: 'hashtag'
}))])))));

/***/ },

/***/ 2129
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.lineurl = exports.url = void 0;
const parser_1 = __webpack_require__(605);
const combinator_1 = __webpack_require__(3484);
const inline_1 = __webpack_require__(7973);
const link_1 = __webpack_require__(3628);
const source_1 = __webpack_require__(8745);
exports.url = (0, combinator_1.lazy)(() => (0, combinator_1.rewrite)((0, combinator_1.open)(/(?<![0-9A-Za-z][.+-]?|[@#])https?:\/\/(?=[\x21-\x7E])/y, (0, combinator_1.precedence)(0, (0, combinator_1.some)((0, combinator_1.union)([(0, combinator_1.some)(source_1.unescsource, /(?<![-+*=~^_,.;:!?]|\/{3})(?:[-+*=~^_,.;:!?]|\/{3,}(?!\/))*(?=[\\$"`\[\](){}<>（）［］｛｝|]|[^\x21-\x7E]|$)/y), (0, combinator_1.precedence)(1, bracket)]), [[/[^\x21-\x7E]|\$/y, 9]])), false, [3 | 8 /* Backtrack.unescapable */]), (0, combinator_1.union)([(0, combinator_1.constraint)(1 /* State.autolink */, (0, combinator_1.state)(1 /* State.autolink */, context => new parser_1.List([new parser_1.Node((0, link_1.parse)(new parser_1.List(), new parser_1.List([new parser_1.Node(context.source)]), context))]))), (0, combinator_1.open)((0, source_1.str)(/[^:]+/y), (0, combinator_1.some)(inline_1.inline))])));
exports.lineurl = (0, combinator_1.lazy)(() => (0, combinator_1.focus)(/(?<=^|[\r\n])!?https?:\/\/\S+(?=[^\S\n]*(?=$|\n))/y, (0, combinator_1.tails)([(0, source_1.str)('!'), (0, combinator_1.union)([(0, combinator_1.constraint)(1 /* State.autolink */, (0, combinator_1.state)(1 /* State.autolink */, context => {
  const {
    source,
    position
  } = context;
  context.position -= source[0] === '!' ? 1 : 0;
  return new parser_1.List([new parser_1.Node((0, link_1.parse)(new parser_1.List(), new parser_1.List([new parser_1.Node(source.slice(position))]), context))]);
})), (0, source_1.str)(/[^:]+/y)])])));
const bracket = (0, combinator_1.lazy)(() => (0, combinator_1.union)([(0, combinator_1.surround)((0, source_1.str)('('), (0, combinator_1.recursion)(6 /* Recursion.terminal */, (0, combinator_1.some)((0, combinator_1.union)([bracket, source_1.unescsource]), ')')), (0, source_1.str)(')'), true, [3 | 8 /* Backtrack.unescapable */]), (0, combinator_1.surround)((0, source_1.str)('['), (0, combinator_1.recursion)(6 /* Recursion.terminal */, (0, combinator_1.some)((0, combinator_1.union)([bracket, source_1.unescsource]), ']')), (0, source_1.str)(']'), true, [3 | 8 /* Backtrack.unescapable */]), (0, combinator_1.surround)((0, source_1.str)('{'), (0, combinator_1.recursion)(6 /* Recursion.terminal */, (0, combinator_1.some)((0, combinator_1.union)([bracket, source_1.unescsource]), '}')), (0, source_1.str)('}'), true, [3 | 8 /* Backtrack.unescapable */]), (0, combinator_1.surround)((0, source_1.str)('"'), (0, combinator_1.precedence)(2, (0, combinator_1.recursion)(6 /* Recursion.terminal */, (0, combinator_1.some)(source_1.unescsource, '"'))), (0, source_1.str)('"'), true, [3 | 8 /* Backtrack.unescapable */])]));

/***/ },

/***/ 4526
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.bracket = exports.indexA = void 0;
const parser_1 = __webpack_require__(605);
const combinator_1 = __webpack_require__(3484);
const inline_1 = __webpack_require__(7973);
const link_1 = __webpack_require__(3628);
const source_1 = __webpack_require__(8745);
const util_1 = __webpack_require__(4992);
const dom_1 = __webpack_require__(394);
exports.indexA = /^[0-9A-Za-z]+(?:(?:[.-]|, )[0-9A-Za-z]+)*$/;
const indexF = new RegExp(exports.indexA.source.replace(', ', '[，、]').replace(/[09AZaz.]|\-(?!\w)/g, c => String.fromCodePoint(c.codePointAt(0) + 0xFEE0)));
exports.bracket = (0, combinator_1.lazy)(() => (0, combinator_1.union)([input => {
  const {
    source,
    position
  } = input;
  switch (source[position]) {
    case '(':
      return p1(input);
    case '（':
      return p2(input);
    case '[':
      return s1(input);
    case '［':
      return s2(input);
    case '{':
      return c1(input);
    case '｛':
      return c2(input);
    case '"':
      return d1(input);
  }
}]));
const p1 = (0, combinator_1.lazy)(() => (0, combinator_1.surround)((0, source_1.str)('('), (0, combinator_1.precedence)(1, (0, combinator_1.recursion)(5 /* Recursion.bracket */, (0, combinator_1.some)(inline_1.inline, ')', [[')', 1]]))), (0, source_1.str)(')'), true, [], ([as, bs = [], cs], {
  source,
  position,
  range,
  linebreak
}) => {
  const str = linebreak === 0 ? source.slice(position - range + 1, position - 1) : '';
  return linebreak === 0 && (str === '' || exports.indexA.test(str)) ? new parser_1.List([new parser_1.Node((0, dom_1.html)('span', {
    class: 'paren'
  }, `(${str})`))]) : new parser_1.List([new parser_1.Node((0, dom_1.html)('span', {
    class: 'bracket'
  }, (0, dom_1.defrag)((0, util_1.unwrap)(as.import(bs).import(cs)))))]);
}, ([as, bs = new parser_1.List()], context) => {
  const {
    source,
    position,
    range,
    linebreak
  } = context;
  const str = linebreak === 0 ? source.slice(position - range + 1, position) : '';
  return linebreak === 0 && (str === '' || exports.indexA.test(str)) ? new parser_1.List([new parser_1.Node((0, dom_1.html)('span', {
    class: 'paren'
  }, `(${str}`))]) : new parser_1.List([new parser_1.Node((0, dom_1.html)('span', {
    class: 'bracket'
  }, (0, dom_1.defrag)((0, util_1.unwrap)(as.import(bs)))))]);
}));
const p2 = (0, combinator_1.lazy)(() => (0, combinator_1.surround)((0, source_1.str)('（'), (0, combinator_1.precedence)(1, (0, combinator_1.recursion)(5 /* Recursion.bracket */, (0, combinator_1.some)(inline_1.inline, '）', [['）', 1]]))), (0, source_1.str)('）'), true, [], ([as, bs = [], cs], {
  source,
  position,
  range,
  linebreak
}) => {
  const str = linebreak === 0 ? source.slice(position - range + 1, position - 1) : '';
  return linebreak === 0 && (str === '' || indexF.test(str)) ? new parser_1.List([new parser_1.Node((0, dom_1.html)('span', {
    class: 'paren'
  }, `（${str}）`))]) : new parser_1.List([new parser_1.Node((0, dom_1.html)('span', {
    class: 'bracket'
  }, (0, dom_1.defrag)((0, util_1.unwrap)(as.import(bs).import(cs)))))]);
}, ([as, bs = new parser_1.List()], context) => {
  const {
    source,
    position,
    range,
    linebreak
  } = context;
  const str = linebreak === 0 ? source.slice(position - range + 1, position) : '';
  return linebreak === 0 && (str === '' || indexF.test(str)) ? new parser_1.List([new parser_1.Node((0, dom_1.html)('span', {
    class: 'paren'
  }, `（${str}`))]) : new parser_1.List([new parser_1.Node((0, dom_1.html)('span', {
    class: 'bracket'
  }, (0, dom_1.defrag)((0, util_1.unwrap)(as.import(bs)))))]);
}));
const s1 = (0, combinator_1.lazy)(() => (0, combinator_1.surround)((0, source_1.str)('['), (0, combinator_1.precedence)(1, (0, combinator_1.recursion)(5 /* Recursion.bracket */, (0, combinator_1.some)(inline_1.inline, ']', [[']', 1]]))), (0, source_1.str)(']'), true, [2 | 4 /* Backtrack.common */], ([as, bs = new parser_1.List(), cs], context) => {
  const {
    source,
    position,
    range,
    linebreak
  } = context;
  const head = position - range;
  if (source[head + 1] === '[' && (linebreak !== 0 || source[position - 2] !== ']')) {
    (0, combinator_1.setBacktrack)(context, 2 | 128 /* Backtrack.doublebracket */, head);
  }
  if (context.state & 8 /* State.link */) {
    if (linebreak !== 0) {
      (0, combinator_1.setBacktrack)(context, 2 | 64 /* Backtrack.link */ | 32 /* Backtrack.ruby */, head);
    } else if (source[position] !== '{') {
      (0, combinator_1.setBacktrack)(context, 2 | 64 /* Backtrack.link */, head);
    } else {
      if (!(0, combinator_1.isBacktrack)(context, 1 | 64 /* Backtrack.link */) && !(0, link_1.textlink)(context)) {
        (0, combinator_1.setBacktrack)(context, 2 | 64 /* Backtrack.link */, head);
      }
      context.position = position;
      context.range = range;
    }
  }
  return as.import(bs).import(cs);
}, ([as, bs = new parser_1.List()]) => as.import(bs)));
const s2 = (0, combinator_1.lazy)(() => (0, combinator_1.surround)((0, source_1.str)('［'), (0, combinator_1.precedence)(1, (0, combinator_1.recursion)(5 /* Recursion.bracket */, (0, combinator_1.some)(inline_1.inline, '］', [['］', 1]]))), (0, source_1.str)('］'), true, [], undefined, ([as, bs = new parser_1.List()]) => as.import(bs)));
const c1 = (0, combinator_1.lazy)(() => (0, combinator_1.surround)((0, source_1.str)('{'), (0, combinator_1.precedence)(1, (0, combinator_1.recursion)(5 /* Recursion.bracket */, (0, combinator_1.some)(inline_1.inline, '}', [['}', 1]]))), (0, source_1.str)('}'), true, [], undefined, ([as, bs = new parser_1.List()]) => as.import(bs)));
const c2 = (0, combinator_1.lazy)(() => (0, combinator_1.surround)((0, source_1.str)('｛'), (0, combinator_1.precedence)(1, (0, combinator_1.recursion)(5 /* Recursion.bracket */, (0, combinator_1.some)(inline_1.inline, '｝', [['｝', 1]]))), (0, source_1.str)('｝'), true, [], undefined, ([as, bs = new parser_1.List()]) => as.import(bs)));
const d1 = (0, combinator_1.lazy)(() => (0, combinator_1.surround)((0, source_1.str)('"'),
// 改行の優先度を構文ごとに変える場合シグネチャの優先度対応が必要
(0, combinator_1.precedence)(2, (0, combinator_1.recursion)(5 /* Recursion.bracket */, (0, combinator_1.some)(inline_1.inline, /["\n]/y, [['"', 2], ['\n', 3]]))), (0, source_1.str)('"'), true, [], undefined, ([as, bs = new parser_1.List()]) => as.import(bs)));

/***/ },

/***/ 3481
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.code = void 0;
const parser_1 = __webpack_require__(605);
const combinator_1 = __webpack_require__(3484);
const util_1 = __webpack_require__(4992);
const dom_1 = __webpack_require__(394);
exports.code = (0, combinator_1.match)(/(`+)(?!`)([^\n]*?)(?:((?<!`)\1(?!`))|(?=$|\n))/y, ([whole, opener, body, closer]) => () => closer ? new parser_1.List([new parser_1.Node((0, dom_1.html)('code', {
  'data-src': whole
}, format(body)))]) : body ? new parser_1.List([new parser_1.Node((0, dom_1.html)('code', {
  class: 'invalid',
  ...(0, util_1.invalid)('code', 'syntax', `Missing the closing symbol "${opener}"`)
}, whole))]) : new parser_1.List([new parser_1.Node(opener)]));
function format(text) {
  return text.length > 2 && text[0] === ' ' && text[1] === '`' && text.at(-1) === ' ' ? text.slice(1, -1) : text;
}

/***/ },

/***/ 7066
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.deletion = void 0;
const parser_1 = __webpack_require__(605);
const combinator_1 = __webpack_require__(3484);
const inline_1 = __webpack_require__(7973);
const visibility_1 = __webpack_require__(6364);
const util_1 = __webpack_require__(4992);
const dom_1 = __webpack_require__(394);
exports.deletion = (0, combinator_1.lazy)(() => (0, combinator_1.precedence)(0, (0, util_1.repeat)('~~', '', (0, combinator_1.recursion)(3 /* Recursion.inline */, (0, combinator_1.surround)('', (0, combinator_1.some)((0, combinator_1.union)([(0, combinator_1.some)(inline_1.inline, (0, visibility_1.blankWith)('\n', '~~')), (0, combinator_1.open)('\n', (0, combinator_1.some)(inline_1.inline, '~'), true)])), '~~', false, [], ([, bs], {
  buffer
}) => buffer.import(bs), ([, bs], {
  buffer
}) => bs && buffer.import(bs).push(new parser_1.Node("\u0018" /* Command.Cancel */)) && buffer)), nodes => new parser_1.List([new parser_1.Node((0, dom_1.html)('del', (0, dom_1.defrag)((0, util_1.unwrap)(nodes))))]))));

/***/ },

/***/ 1354
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.emphasis = void 0;
const parser_1 = __webpack_require__(605);
const combinator_1 = __webpack_require__(3484);
const inline_1 = __webpack_require__(7973);
const strong_1 = __webpack_require__(6591);
const source_1 = __webpack_require__(8745);
const visibility_1 = __webpack_require__(6364);
const util_1 = __webpack_require__(4992);
const dom_1 = __webpack_require__(394);
exports.emphasis = (0, combinator_1.lazy)(() => (0, combinator_1.surround)((0, source_1.str)('*', (0, visibility_1.beforeNonblankWith)(/(?!\*)/)), (0, combinator_1.precedence)(0, (0, combinator_1.recursion)(3 /* Recursion.inline */, (0, combinator_1.some)((0, combinator_1.union)([(0, combinator_1.some)(inline_1.inline, '*', visibility_1.afterNonblank), strong_1.strong])))), (0, source_1.str)('*'), false, [], ([, bs]) => new parser_1.List([new parser_1.Node((0, dom_1.html)('em', (0, dom_1.defrag)((0, util_1.unwrap)(bs))))]), ([as, bs]) => bs && as.import(bs)));

/***/ },

/***/ 365
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.emstrong = void 0;
const parser_1 = __webpack_require__(605);
const combinator_1 = __webpack_require__(3484);
const inline_1 = __webpack_require__(7973);
const strong_1 = __webpack_require__(6591);
const emphasis_1 = __webpack_require__(1354);
const source_1 = __webpack_require__(8745);
const visibility_1 = __webpack_require__(6364);
const util_1 = __webpack_require__(4992);
const dom_1 = __webpack_require__(394);
const substrong = (0, combinator_1.lazy)(() => (0, combinator_1.some)((0, combinator_1.union)([(0, combinator_1.some)(inline_1.inline, '*', visibility_1.afterNonblank), emphasis_1.emphasis])));
const subemphasis = (0, combinator_1.lazy)(() => (0, combinator_1.some)((0, combinator_1.union)([(0, combinator_1.some)(inline_1.inline, '*', visibility_1.afterNonblank), strong_1.strong])));
// 開閉が明示的でない構文は開閉の不明確な記号による再帰的適用を行わず
// 可能な限り早く閉じるよう解析しなければならない。
// このため終端記号の後ろを見て終端を中止し同じ構文を再帰的に適用してはならない。
exports.emstrong = (0, combinator_1.lazy)(() => (0, combinator_1.precedence)(0, (0, util_1.repeat)('***', visibility_1.beforeNonblank, (0, combinator_1.recursion)(3 /* Recursion.inline */, (0, combinator_1.surround)('', (0, combinator_1.some)((0, combinator_1.union)([(0, combinator_1.some)(inline_1.inline, '*', visibility_1.afterNonblank)])), (0, source_1.strs)('*', 1, 3), false, [], ([, bs, cs], context) => {
  const {
    buffer
  } = context;
  switch (cs.head.value) {
    case '***':
      return buffer.import(bs);
    case '**':
      return (0, combinator_1.bind)(subemphasis, ds => {
        const {
          source
        } = context;
        if (source.startsWith('*', context.position)) {
          context.position += 1;
          buffer.push(new parser_1.Node((0, dom_1.html)('strong', (0, dom_1.defrag)((0, util_1.unwrap)(bs)))));
          buffer.import(ds);
          return new parser_1.List([new parser_1.Node((0, dom_1.html)('em', (0, dom_1.defrag)((0, util_1.unwrap)(buffer)))), new parser_1.Node("\u001F" /* Command.Separator */)]);
        } else {
          buffer.push(new parser_1.Node((0, dom_1.html)('strong', (0, dom_1.defrag)((0, util_1.unwrap)(bs)))));
          buffer.import(ds);
          buffer.push(new parser_1.Node("\u001F" /* Command.Separator */));
          return prepend('*', buffer);
        }
      })(context) ?? prepend('*', buffer.import(new parser_1.List([new parser_1.Node((0, dom_1.html)('strong', (0, dom_1.defrag)((0, util_1.unwrap)(bs)))), new parser_1.Node("\u001F" /* Command.Separator */)])));
    case '*':
      return (0, combinator_1.bind)(substrong, ds => {
        const {
          source
        } = context;
        if (source.startsWith('**', context.position)) {
          context.position += 2;
          buffer.push(new parser_1.Node((0, dom_1.html)('em', (0, dom_1.defrag)((0, util_1.unwrap)(bs)))));
          buffer.import(ds);
          return new parser_1.List([new parser_1.Node((0, dom_1.html)('strong', (0, dom_1.defrag)((0, util_1.unwrap)(buffer)))), new parser_1.Node("\u001F" /* Command.Separator */)]);
        } else {
          buffer.push(new parser_1.Node((0, dom_1.html)('em', (0, dom_1.defrag)((0, util_1.unwrap)(bs)))));
          buffer.import(ds);
          buffer.push(new parser_1.Node("\u001F" /* Command.Separator */));
          return prepend('**', buffer);
        }
      })(context) ?? prepend('**', buffer.import(new parser_1.List([new parser_1.Node((0, dom_1.html)('em', (0, dom_1.defrag)((0, util_1.unwrap)(bs)))), new parser_1.Node("\u001F" /* Command.Separator */)])));
  }
}, ([, bs], {
  buffer
}) => bs && buffer.import(bs) && buffer.push(new parser_1.Node("\u0018" /* Command.Cancel */)) && buffer)),
// 3以上の`*`に対してemの適用を保証する
nodes => new parser_1.List([new parser_1.Node((0, dom_1.html)('em', [(0, dom_1.html)('strong', (0, dom_1.defrag)((0, util_1.unwrap)(nodes)))]))]), (nodes, context, prefix, postfix, state) => {
  context.position += postfix;
  if (state) {
    switch (postfix) {
      case 0:
        break;
      case 1:
        nodes = new parser_1.List([new parser_1.Node((0, dom_1.html)('em', (0, dom_1.defrag)((0, util_1.unwrap)(nodes))))]);
        break;
      case 2:
        nodes = new parser_1.List([new parser_1.Node((0, dom_1.html)('strong', (0, dom_1.defrag)((0, util_1.unwrap)(nodes))))]);
        break;
      default:
    }
    prefix -= postfix;
    postfix -= postfix;
    switch (prefix) {
      case 0:
        break;
      case 1:
        nodes = (0, combinator_1.bind)(subemphasis, ds => {
          const {
            source
          } = context;
          if (source.startsWith('*', context.position)) {
            context.position += 1;
            return new parser_1.List([new parser_1.Node((0, dom_1.html)('em', (0, dom_1.defrag)((0, util_1.unwrap)(nodes.import(ds)))))]);
          } else {
            return prepend('*', nodes.import(ds));
          }
        })(context) ?? prepend('*', nodes);
        prefix -= 1;
        break;
      case 2:
        nodes = (0, combinator_1.bind)(substrong, ds => {
          const {
            source
          } = context;
          if (source.startsWith('**', context.position)) {
            context.position += 2;
            return new parser_1.List([new parser_1.Node((0, dom_1.html)('strong', (0, dom_1.defrag)((0, util_1.unwrap)(nodes.import(ds)))))]);
          } else {
            return prepend('**', nodes.import(ds));
          }
        })(context) ?? prepend('**', nodes);
        prefix -= 2;
        break;
    }
  }
  if (prefix > postfix) {
    nodes = prepend('*'.repeat(prefix - postfix), nodes);
  }
  return nodes;
})));
function prepend(prefix, nodes) {
  if (typeof nodes.head?.value === 'string') {
    nodes.head.value = prefix + nodes.head.value;
  } else {
    nodes.unshift(new parser_1.Node(prefix));
  }
  return nodes;
}

/***/ },

/***/ 2743
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.extension = void 0;
const combinator_1 = __webpack_require__(3484);
const index_1 = __webpack_require__(4688);
const label_1 = __webpack_require__(2178);
const placeholder_1 = __webpack_require__(6033);
exports.extension = (0, combinator_1.union)([index_1.index, label_1.label, placeholder_1.placeholder]);

/***/ },

/***/ 4688
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.dataindex = exports.signature = exports.index = void 0;
const parser_1 = __webpack_require__(605);
const combinator_1 = __webpack_require__(3484);
const inline_1 = __webpack_require__(7973);
const indexee_1 = __webpack_require__(7610);
const htmlentity_1 = __webpack_require__(470);
const source_1 = __webpack_require__(8745);
const visibility_1 = __webpack_require__(6364);
const util_1 = __webpack_require__(4992);
const dom_1 = __webpack_require__(394);
exports.index = (0, combinator_1.lazy)(() => (0, combinator_1.constraint)(32 /* State.index */, (0, combinator_1.fmap)((0, indexee_1.indexee)((0, combinator_1.surround)((0, source_1.str)('[#', visibility_1.beforeNonblank), (0, combinator_1.precedence)(1, (0, combinator_1.state)(251 /* State.linkers */, (0, combinator_1.some)((0, combinator_1.inits)([inline_1.inline, exports.signature]), ']', [[']', 1]]))), (0, source_1.str)(']'), false, [3 | 4 /* Backtrack.common */], ([, bs], context) => context.linebreak === 0 && (0, visibility_1.trimBlankNodeEnd)(bs).length > 0 ? new parser_1.List([new parser_1.Node((0, dom_1.html)('a', {
  'data-index': dataindex(bs)
}, (0, dom_1.defrag)((0, util_1.unwrap)(bs))))]) : undefined, undefined)), ns => {
  const el = ns.head.value;
  return new parser_1.List([new parser_1.Node((0, dom_1.define)(el, {
    id: el.id ? null : undefined,
    class: 'index',
    href: el.id ? `#${el.id}` : undefined
  }))]);
})));
exports.signature = (0, combinator_1.lazy)(() => (0, combinator_1.validate)('|', (0, combinator_1.surround)((0, source_1.str)(/\|(?!\\?\s)/y), (0, combinator_1.precedence)(9, (0, combinator_1.some)((0, combinator_1.union)([htmlentity_1.unsafehtmlentity, (0, combinator_1.some)(source_1.txt, /(?:[$"`\[\](){}<>（）［］｛｝|])/y)]), ']')), /(?=])/y, false, [3 | 16 /* Backtrack.escapable */], ([, ns], context) => {
  const index = (0, indexee_1.identity)('index', undefined, ns.foldl((acc, {
    value
  }) => acc + value, ''))?.slice(7);
  return index && context.linebreak === 0 ? new parser_1.List([new parser_1.Node((0, dom_1.html)('span', {
    class: 'indexer',
    'data-index': index
  }))]) : undefined;
}, ([as, bs]) => bs && as.import(bs))));
function dataindex(nodes) {
  let node = nodes.last;
  if (typeof node?.value !== 'object') return;
  switch (node.value.tagName) {
    case 'UL':
    case 'OL':
      node = node.prev;
      if (typeof node?.value !== 'object') return;
  }
  if (!node.value.classList.contains('indexer')) return;
  return node.value.getAttribute('data-index') ?? undefined;
}
exports.dataindex = dataindex;

/***/ },

/***/ 7610
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.text = exports.signature = exports.identity = exports.indexee = void 0;
const parser_1 = __webpack_require__(605);
const combinator_1 = __webpack_require__(3484);
const dom_1 = __webpack_require__(394);
function indexee(parser) {
  return (0, combinator_1.fmap)(parser, (ns, {
    id
  }) => ns.length === 1 ? new parser_1.List([new parser_1.Node((0, dom_1.define)(ns.head.value, {
    id: identity('index', id, ns.head.value),
    'data-index': null
  }))]) : ns);
}
exports.indexee = indexee;
const MAX = 60;
const ELLIPSIS = '...';
const PART = (MAX - ELLIPSIS.length) / 2 | 0;
const REM = MAX - PART * 2 - ELLIPSIS.length;
const table = [...[...Array(36)].map((_, i) => i.toString(36)), ...[...Array(36)].map((_, i) => i.toString(36).toUpperCase()).slice(-26), '-', '='].join('');
function identity(type, id, text) {
  if (id === '') return undefined;
  if (typeof text !== 'string') {
    const index = text.getAttribute('data-index') ?? undefined;
    if (index === '' && text.tagName === 'LI') return undefined;
    return index ? `${type}:${id ?? ''}:${index}` : identity(type, id, signature(text.cloneNode(true)));
  }
  text = text.trim();
  if (text === '') return undefined;
  const str = text.replace(/\s/g, '_');
  const cs = [...str];
  if (type === '' || cs.length <= MAX) {
    return `${type}:${id ?? ''}:${str}${/_|[^\S ]|=[0-9A-Za-z]{1,6}$/.test(text) ? `=${hash(text)}` : ''}`;
  }
  const s1 = cs.slice(0, PART + REM).join('');
  const s2 = cs.slice(-PART).join('');
  return `${type}:${id ?? ''}:${s1}${ELLIPSIS}${s2}=${hash(text)}`;
}
exports.identity = identity;
function hash(source) {
  let x = 0;
  for (let i = 0; i < source.length; ++i) {
    const c = source.charCodeAt(i);
    x = x ^ c << 1 || ~x ^ c << 1; // 16+1bit

    x ^= x << 13; // shift <= 32-17bit
    x ^= x >>> 17;
    x ^= x << 15;
  }
  return baseR(x >>> 0, 62);
}
// 62も64も最大6桁
function baseR(n, r) {
  let acc = '';
  do {
    const mod = n % r;
    n = (n - mod) / r;
    acc = table[mod] + acc;
  } while (n > 0);
  return acc;
}
function signature(target) {
  for (let es = target.querySelectorAll('code[data-src], .math[data-src], .remark, rt, rp, br, .annotation, .reference, :is(.annotation, .reference) > a, .checkbox, ul, ol, .label[data-label]'), i = es.length; i--;) {
    const el = es[i];
    switch (el.className) {
      case 'math':
        el.replaceWith(el.getAttribute('data-src'));
        continue;
      case 'label':
        el.replaceWith(`[$${el.getAttribute('data-label').replace('$', '')}]`);
        continue;
      case 'annotation':
        el.replaceWith(`((${el.textContent}))`);
        continue;
      case 'reference':
        const abbr = el.getAttribute('data-abbr');
        el.replaceWith(`[[${abbr ? `^${abbr}` : el.textContent}]]`);
        continue;
      case 'checkbox':
      case 'remark':
        el.remove();
        continue;
    }
    switch (el.tagName) {
      case 'CODE':
        el.replaceWith(el.getAttribute('data-src'));
        continue;
      case 'UL':
      case 'OL':
      case 'RT':
      case 'RP':
      case 'A':
        el.remove();
        continue;
      case 'BR':
        el.replaceWith('\n');
        continue;
    }
  }
  return target.textContent.trim();
}
exports.signature = signature;
function text(target) {
  for (let es = target.querySelectorAll('code[data-src], .math[data-src], .remark, rt, rp, br, .annotation, .reference, :is(.annotation, .reference) > a, .checkbox, ul, ol'), i = es.length; i--;) {
    const el = es[i];
    switch (el.className) {
      case 'math':
        el.replaceWith(el.getAttribute('data-src'));
        continue;
      case 'annotation':
        el.replaceWith(`((${el.textContent}))`);
        continue;
      case 'reference':
        const abbr = el.getAttribute('data-abbr');
        el.replaceWith(`[[${abbr ? `^${abbr}` : el.textContent}]]`);
        continue;
      case 'checkbox':
      case 'remark':
        el.remove();
        continue;
    }
    switch (el.tagName) {
      case 'CODE':
        el.replaceWith(el.getAttribute('data-src'));
        continue;
      case 'UL':
      case 'OL':
      case 'RT':
      case 'RP':
      case 'A':
      case 'BR':
        el.remove();
        continue;
    }
  }
  return target.textContent;
}
exports.text = text;

/***/ },

/***/ 7483
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.indexer = void 0;
const parser_1 = __webpack_require__(605);
const combinator_1 = __webpack_require__(3484);
const index_1 = __webpack_require__(4688);
const dom_1 = __webpack_require__(394);
// インデクスの重複解消は不要な重複を削除するのが最もよい。
// 複合生成インデクスは参照と同期させることが困難であり
// 複合生成インデクスを手動で同期させるより最初から重複のない
// テキストまたはインデクスを付けて同期が必要な機会を減らすのが
// 継続的編集において最も簡便となる。
exports.indexer = (0, combinator_1.validate)(' [|', (0, combinator_1.surround)(/ \[(?=\|\S)/y, (0, combinator_1.union)([index_1.signature, (0, combinator_1.focus)(/\|(?=\])/y, () => new parser_1.List([new parser_1.Node((0, dom_1.html)('span', {
  class: 'indexer',
  'data-index': ''
}))]))]), /\][^\S\n]*(?:$|\n)/y));

/***/ },

/***/ 2178
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.isFixed = exports.number = exports.label = exports.segment = void 0;
const parser_1 = __webpack_require__(605);
const combinator_1 = __webpack_require__(3484);
const source_1 = __webpack_require__(8745);
const dom_1 = __webpack_require__(394);
const body = (0, source_1.str)(/\$[A-Za-z]*(?:(?:-[A-Za-z][0-9A-Za-z]*)+|-(?:(?:0|[1-9][0-9]*)\.)*(?:0|[1-9][0-9]*)(?![0-9A-Za-z]))/y);
exports.segment = (0, combinator_1.clear)((0, combinator_1.union)([(0, combinator_1.surround)('[', body, ']'), body]));
exports.label = (0, combinator_1.constraint)(16 /* State.label */, (0, combinator_1.fmap)((0, combinator_1.union)([(0, combinator_1.surround)('[', body, ']', false, [1 | 4 /* Backtrack.common */]), body]), ([{
  value
}]) => new parser_1.List([new parser_1.Node((0, dom_1.html)('a', {
  class: 'label',
  'data-label': value.slice(value[1] === '-' ? 0 : 1).toLowerCase()
}, value))])));
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
  const ms = Array(position);
  for (let i = 0; i < position; ++i) {
    ms[i] = i < ns.length ? i + 1 < position ? +ns[i] : +ns[i] + 1 : i + 1 < position ? 0 : 1;
  }
  return ms.join('.');
}

/***/ },

/***/ 6033
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.placeholder = void 0;
const parser_1 = __webpack_require__(605);
const combinator_1 = __webpack_require__(3484);
const inline_1 = __webpack_require__(7973);
const source_1 = __webpack_require__(8745);
const visibility_1 = __webpack_require__(6364);
const util_1 = __webpack_require__(4992);
const dom_1 = __webpack_require__(394);
// Don't use the symbols already used: !#$%@&*+~=|
// All syntax surrounded by square brackets shouldn't contain line breaks.
exports.placeholder = (0, combinator_1.lazy)(() => (0, combinator_1.surround)(
// ^はabbrで使用済みだが^:などのようにして分離使用可能
(0, source_1.str)(/\[[:^|]/y, visibility_1.beforeNonblank), (0, combinator_1.precedence)(1, (0, combinator_1.recursion)(3 /* Recursion.inline */, (0, combinator_1.some)((0, combinator_1.union)([inline_1.inline]), ']', [[']', 1]]))), (0, source_1.str)(']'), false, [3 | 4 /* Backtrack.common */], (_, context) => new parser_1.List([new parser_1.Node((0, dom_1.html)('span', {
  class: 'invalid',
  ...(0, util_1.invalid)('extension', 'syntax', `Invalid start symbol or linebreak`)
}, context.source.slice(context.position - context.range, context.position)))]), ([as, bs]) => bs && as.import(bs)));

/***/ },

/***/ 5013
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.attributes = exports.attribute = exports.html = void 0;
const parser_1 = __webpack_require__(605);
const combinator_1 = __webpack_require__(3484);
const inline_1 = __webpack_require__(7973);
const source_1 = __webpack_require__(8745);
const visibility_1 = __webpack_require__(6364);
const util_1 = __webpack_require__(4992);
const memoize_1 = __webpack_require__(6925);
const dom_1 = __webpack_require__(394);
const tags = ['wbr', 'bdo', 'bdi'];
const attrspecs = {
  wbr: {},
  bdo: {
    dir: Object.freeze(['ltr', 'rtl'])
  }
};
Object.setPrototypeOf(attrspecs, null);
Object.values(attrspecs).forEach(o => Object.setPrototypeOf(o, null));
exports.html = (0, combinator_1.lazy)(() => (0, combinator_1.validate)(/<[a-z]+(?=[ >])/yi, (0, combinator_1.union)([(0, combinator_1.surround)(
// https://html.spec.whatwg.org/multipage/syntax.html#void-elements
(0, source_1.str)(/<(?:area|base|br|col|embed|hr|img|input|link|meta|source|track|wbr)(?=[ >])/y), (0, combinator_1.precedence)(9, (0, combinator_1.some)((0, combinator_1.union)([exports.attribute]))), (0, combinator_1.open)((0, source_1.str)(/ ?/y), (0, source_1.str)('>'), true), true, [], ([as, bs = new parser_1.List(), cs], context) => new parser_1.List([new parser_1.Node(elem(as.head.value.slice(1), false, [...(0, util_1.unwrap)(as.import(bs).import(cs))], new parser_1.List(), new parser_1.List(), context), as.head.value === '<wbr' ? 1 /* Flag.blank */ : 0 /* Flag.none */)]), ([as, bs = new parser_1.List()], context) => new parser_1.List([new parser_1.Node(elem(as.head.value.slice(1), false, [...(0, util_1.unwrap)(as.import(bs))], new parser_1.List(), new parser_1.List(), context))])), (0, combinator_1.match)(new RegExp(String.raw`<(${TAGS.join('|')})(?=[ >])`, 'y'), (0, memoize_1.memoize)(([, tag]) => (0, combinator_1.surround)((0, combinator_1.surround)((0, source_1.str)(`<${tag}`), (0, combinator_1.precedence)(9, (0, combinator_1.some)(exports.attribute)), (0, combinator_1.open)((0, source_1.str)(/ ?/y), (0, source_1.str)('>'), true), true, [], ([as, bs = new parser_1.List(), cs]) => as.import(bs).import(cs), ([as, bs = new parser_1.List()]) => as.import(bs)),
// 不可視のHTML構造が可視構造を変化させるべきでない。
// 可視のHTMLは優先度変更を検討する。
// このため`<>`記号は将来的に共通構造を変化させる可能性があり
// 共通構造を変化させない非構造文字列としては依然としてエスケープを要する。
(0, combinator_1.precedence)(0, (0, combinator_1.recursion)(3 /* Recursion.inline */, (0, combinator_1.some)((0, combinator_1.union)([(0, combinator_1.some)(inline_1.inline, (0, visibility_1.blankWith)('\n', `</${tag}>`)), (0, combinator_1.open)('\n', (0, combinator_1.some)(inline_1.inline, `</${tag}>`), true)])))), (0, source_1.str)(`</${tag}>`), true, [], ([as, bs = new parser_1.List(), cs], context) => new parser_1.List([new parser_1.Node(elem(tag, true, [...(0, util_1.unwrap)(as)], bs, cs, context))]), ([as, bs = new parser_1.List()], context) => new parser_1.List([new parser_1.Node(elem(tag, true, [...(0, util_1.unwrap)(as)], bs, new parser_1.List(), context))])), ([, tag]) => tag, new Map())), (0, combinator_1.surround)(
// https://html.spec.whatwg.org/multipage/syntax.html#void-elements
(0, source_1.str)(/<[a-z]+(?=[ >])/yi), (0, combinator_1.precedence)(9, (0, combinator_1.some)((0, combinator_1.union)([exports.attribute]))), (0, combinator_1.open)((0, source_1.str)(/ ?/y), (0, source_1.str)('>'), true), true, [], ([as, bs = new parser_1.List(), cs], context) => new parser_1.List([new parser_1.Node(elem(as.head.value.slice(1), false, [...(0, util_1.unwrap)(as.import(bs).import(cs))], new parser_1.List(), new parser_1.List(), context))]), ([as, bs = new parser_1.List()], context) => new parser_1.List([new parser_1.Node(elem(as.head.value.slice(1), false, [...(0, util_1.unwrap)(as.import(bs))], new parser_1.List(), new parser_1.List(), context))]))])));
exports.attribute = (0, combinator_1.union)([(0, source_1.str)(/ [a-z]+(?:-[a-z]+)*(?:="(?:\\[^\n]|[^\\\n"])*")?(?=[ >])/yi), (0, source_1.str)(/ [^\s<>]+/y)]);
function elem(tag, content, as, bs, cs, context) {
  if (!tags.includes(tag)) return ielem('tag', `Invalid HTML tag name "${tag}"`, context);
  if (content) {
    if (cs.length === 0) return ielem('tag', `Missing the closing HTML tag "</${tag}>"`, context);
    if (bs.length === 0) return ielem('content', `Missing the content`, context);
    if (!(0, visibility_1.isNonblankFirstLine)(bs)) return ielem('content', `Missing the visible content in the same line`, context);
  }
  const [attrs] = attributes('html', attrspecs[tag], as.slice(1, as.at(-1) === '>' ? -1 : as.length));
  if (/(?<!\S)invalid(?!\S)/.test(attrs['class'] ?? '')) return ielem('attribute', 'Invalid HTML attribute', context);
  if (as.at(-1) !== '>') return ielem('tag', `Missing the closing symbol ">"`, context);
  return (0, dom_1.html)(tag, attrs, (0, dom_1.defrag)((0, util_1.unwrap)(bs)));
}
function ielem(type, message, context) {
  return (0, dom_1.html)('span', {
    class: 'invalid',
    ...(0, util_1.invalid)('html', type, message)
  }, context.source.slice(context.position - context.range, context.position));
}
const requiredAttributes = (0, memoize_1.memoize)(spec => Object.entries(spec).flatMap(([k, v]) => v && Object.isFrozen(v) ? [k] : []), new WeakMap());
function attributes(syntax, spec, params) {
  const remains = [];
  let invalidation = false;
  const attrs = {};
  for (const param of params) {
    const attr = param.trimStart();
    if (attr === '') continue;
    const name = attr.split('=', 1)[0];
    const value = attr !== name ? attr.slice(name.length + 2, -1).replace(/\\(.?)/g, '$1') : undefined;
    invalidation ||= name === '' || !spec || name in attrs;
    if (name === '') continue;
    if (spec && name in spec && !spec[name]) {
      remains.push(param);
      continue;
    }
    if (spec?.[name]?.includes(value) || spec?.[name]?.length === 0 && value !== undefined) {
      attrs[name] = value ?? '';
    } else {
      invalidation ||= !!spec;
    }
  }
  invalidation ||= !!spec && !requiredAttributes(spec).every(name => name in attrs);
  if (invalidation) {
    attrs['class'] = 'invalid';
    Object.assign(attrs, (0, util_1.invalid)(syntax, 'argument', 'Invalid argument'));
  }
  return [attrs, remains];
}
exports.attributes = attributes;
// https://developer.mozilla.org/en-US/docs/Web/HTML/Element
// [...document.querySelectorAll('tbody > tr > td:first-child')].map(el => el.textContent.slice(1, -1))
const TAGS = ["html", "base", "head", "link", "meta", "style", "title", "body", "address", "article", "aside", "footer", "header", "h1", "h2", "h3", "h4", "h5", "h6", "hgroup", "main", "nav", "section", "blockquote", "dd", "div", "dl", "dt", "figcaption", "figure", "hr", "li", "menu", "ol", "p", "pre", "ul", "a", "abbr", "b", "bdi", "bdo", "br", "cite", "code", "data", "dfn", "em", "i", "kbd", "mark", "q", "rp", "rt", "ruby", "s", "samp", "small", "span", "strong", "sub", "sup", "time", "u", "var", "wbr", "area", "audio", "img", "map", "track", "video", "embed", "iframe", "object", "picture", "portal", "source", "svg", "math", "canvas", "noscript", "script", "del", "ins", "caption", "col", "colgroup", "table", "tbody", "td", "tfoot", "th", "thead", "tr", "button", "datalist", "fieldset", "form", "input", "label", "legend", "meter", "optgroup", "option", "output", "progress", "select", "textarea", "details", "dialog", "summary", "slot", "template", "acronym", "applet", "bgsound", "big", "blink", "center", "content", "dir", "font", "frame", "frameset", "image", "keygen", "marquee", "menuitem", "nobr", "noembed", "noframes", "param", "plaintext", "rb", "rtc", "shadow", "spacer", "strike", "tt", "xmp"];

/***/ },

/***/ 470
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.htmlentity = exports.unsafehtmlentity = void 0;
const parser_1 = __webpack_require__(605);
const node_1 = __webpack_require__(8068);
const combinator_1 = __webpack_require__(3484);
const source_1 = __webpack_require__(8745);
const util_1 = __webpack_require__(4992);
const dom_1 = __webpack_require__(394);
exports.unsafehtmlentity = (0, combinator_1.surround)((0, source_1.str)('&'), (0, source_1.str)(/[0-9A-Za-z]+/y), (0, source_1.str)(';'), false, [3 | 8 /* Backtrack.unescapable */], ([as, bs, cs]) => new parser_1.List([new parser_1.Node(parser(as.head.value + bs.head.value + cs.head.value), (0, node_1.isBlankHTMLEntityName)(bs.head.value) ? 1 /* Flag.blank */ : 0 /* Flag.none */)]), ([as, bs]) => new parser_1.List([new parser_1.Node(as.head.value + (bs?.head?.value ?? ''))]));
exports.htmlentity = (0, combinator_1.fmap)((0, combinator_1.union)([exports.unsafehtmlentity]), ([{
  value,
  flags
}]) => new parser_1.List([value.length === 1 || value.at(-1) !== ';' ? new parser_1.Node(value, flags) : new parser_1.Node((0, dom_1.html)('span', {
  class: 'invalid',
  ...(0, util_1.invalid)('htmlentity', 'syntax', 'Invalid HTML entity')
}, value))]));
const parser = (el => entity => {
  if (entity === '&NewLine;') return entity;
  el.innerHTML = entity;
  return el.textContent;
})((0, dom_1.html)('span'));

/***/ },

/***/ 4515
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.insertion = void 0;
const parser_1 = __webpack_require__(605);
const combinator_1 = __webpack_require__(3484);
const inline_1 = __webpack_require__(7973);
const visibility_1 = __webpack_require__(6364);
const util_1 = __webpack_require__(4992);
const dom_1 = __webpack_require__(394);
exports.insertion = (0, combinator_1.lazy)(() => (0, combinator_1.precedence)(0, (0, util_1.repeat)('++', '', (0, combinator_1.recursion)(3 /* Recursion.inline */, (0, combinator_1.surround)('', (0, combinator_1.some)((0, combinator_1.union)([(0, combinator_1.some)(inline_1.inline, (0, visibility_1.blankWith)('\n', '++')), (0, combinator_1.open)('\n', (0, combinator_1.some)(inline_1.inline, '+'), true)])), '++', false, [], ([, bs], {
  buffer
}) => buffer.import(bs), ([, bs], {
  buffer
}) => bs && buffer.import(bs).push(new parser_1.Node("\u0018" /* Command.Cancel */)) && buffer)), nodes => new parser_1.List([new parser_1.Node((0, dom_1.html)('ins', (0, dom_1.defrag)((0, util_1.unwrap)(nodes))))]))));

/***/ },

/***/ 3744
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.italic = void 0;
const parser_1 = __webpack_require__(605);
const combinator_1 = __webpack_require__(3484);
const inline_1 = __webpack_require__(7973);
const visibility_1 = __webpack_require__(6364);
const util_1 = __webpack_require__(4992);
const dom_1 = __webpack_require__(394);
// 可読性のため実際にはオブリーク体を指定する。
// 斜体は単語に使うとかえって見づらく読み飛ばしやすくなるため使わないべきであり
// ある程度の長さのある文に使うのが望ましい。
exports.italic = (0, combinator_1.lazy)(() => (0, combinator_1.precedence)(0, (0, util_1.repeat)('///', visibility_1.beforeNonblank, (0, combinator_1.recursion)(3 /* Recursion.inline */, (0, combinator_1.surround)('', (0, combinator_1.some)((0, combinator_1.union)([inline_1.inline]), '///', visibility_1.afterNonblank), '///', false, [], ([, bs], {
  buffer
}) => buffer.import(bs), ([, bs], {
  buffer
}) => bs && buffer.import(bs).push(new parser_1.Node("\u0018" /* Command.Cancel */)) && buffer)), nodes => new parser_1.List([new parser_1.Node((0, dom_1.html)('i', (0, dom_1.defrag)((0, util_1.unwrap)(nodes))))]))));

/***/ },

/***/ 3628
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.decode = exports.resolve = exports.parse = exports.option = exports.uri = exports.medialink = exports.textlink = void 0;
const parser_1 = __webpack_require__(605);
const combinator_1 = __webpack_require__(3484);
const inline_1 = __webpack_require__(7973);
const html_1 = __webpack_require__(5013);
const source_1 = __webpack_require__(8745);
const visibility_1 = __webpack_require__(6364);
const util_1 = __webpack_require__(4992);
const url_1 = __webpack_require__(1904);
const dom_1 = __webpack_require__(394);
const optspec = {
  rel: ['nofollow']
};
Object.setPrototypeOf(optspec, null);
exports.textlink = (0, combinator_1.lazy)(() => (0, combinator_1.bind)((0, combinator_1.subsequence)([(0, combinator_1.constraint)(8 /* State.link */, (0, combinator_1.state)(251 /* State.linkers */, (0, combinator_1.dup)((0, combinator_1.surround)((0, combinator_1.open)('[', visibility_1.beforeNonblank), (0, combinator_1.precedence)(1, (0, combinator_1.some)((0, combinator_1.union)([inline_1.inline]), ']', [[']', 1]])), ']', true, [3 | 4 /* Backtrack.common */ | 64 /* Backtrack.link */, 2 | 32 /* Backtrack.ruby */], ([, ns = new parser_1.List()], context) => {
  if (context.linebreak !== 0) {
    const head = context.position - context.range;
    return void (0, combinator_1.setBacktrack)(context, 2 | 64 /* Backtrack.link */ | 32 /* Backtrack.ruby */, head);
  }
  return ns.push(new parser_1.Node("\u001F" /* Command.Separator */)) && ns;
})))),
// `{ `と`{`で個別にバックトラックが発生し+1nされる。
// 自己再帰的にパースしてもオプションの不要なパースによる計算量の増加により相殺される。
(0, combinator_1.dup)((0, combinator_1.surround)(/{(?![{}])/y, (0, combinator_1.precedence)(9, (0, combinator_1.inits)([exports.uri, (0, combinator_1.some)(exports.option)])), / ?}/y, false, [], undefined, ([as, bs]) => bs && as.import(bs).push(new parser_1.Node("\u0018" /* Command.Cancel */)) && as))]), ([{
  value: content
}, {
  value: params = undefined
} = {}], context) => {
  if (context.state & 8 /* State.link */) return new parser_1.List([new parser_1.Node(context.source.slice(context.position - context.range, context.position).replace(/\\($|.)/g, '$1'))]);
  if (content.last.value === "\u001F" /* Command.Separator */) {
    content.pop();
    if (params === undefined) {
      const head = context.position - context.range;
      return void (0, combinator_1.setBacktrack)(context, 2 | 64 /* Backtrack.link */, head);
    }
  } else {
    params = content;
    content = new parser_1.List();
  }
  if (params.last.value === "\u0018" /* Command.Cancel */) {
    params.pop();
    return new parser_1.List([new parser_1.Node((0, dom_1.html)('span', {
      class: 'invalid',
      ...(0, util_1.invalid)('link', 'syntax', 'Missing the closing symbol "}"')
    }, context.source.slice(context.position - context.range, context.position)))]);
  }
  if (content.length !== 0 && (0, visibility_1.trimBlankNodeEnd)(content).length === 0) return;
  return new parser_1.List([new parser_1.Node(parse(content, params, context))]);
}));
exports.medialink = (0, combinator_1.lazy)(() => (0, combinator_1.constraint)(8 /* State.link */ | 4 /* State.media */, (0, combinator_1.state)(251 /* State.linkers */, (0, combinator_1.bind)((0, combinator_1.sequence)([(0, combinator_1.dup)((0, combinator_1.surround)('[', (0, combinator_1.union)([inline_1.media, inline_1.shortmedia]), ']')), (0, combinator_1.dup)((0, combinator_1.surround)(/{(?![{}])/y, (0, combinator_1.precedence)(9, (0, combinator_1.inits)([exports.uri, (0, combinator_1.some)(exports.option)])), / ?}/y))]), ([{
  value: content
}, {
  value: params
}], context) => new parser_1.List([new parser_1.Node(parse(content, params, context))])))));
exports.uri = (0, combinator_1.union)([(0, combinator_1.open)(' ', (0, source_1.str)(/\S+/y)), (0, source_1.str)(/[^\s{}]+/y)]);
exports.option = (0, combinator_1.union)([(0, combinator_1.fmap)((0, source_1.str)(/ nofollow(?=[ }])/y), () => new parser_1.List([new parser_1.Node(' rel="nofollow"')])), (0, source_1.str)(/ [a-z]+(?:-[a-z]+)*(?:="(?:\\[^\n]|[^\\\n"])*")?(?=[ }])/yi), (0, source_1.str)(/ [^\s{}]+/y)]);
function parse(content, params, context) {
  const INSECURE_URI = params.shift().value;
  (0, combinator_1.consume)(10, context);
  let uri;
  try {
    uri = new url_1.ReadonlyURL(resolve(INSECURE_URI, context.host ?? location, context.url ?? context.host ?? location), context.host?.href || location.href);
  } catch {}
  const el = elem(INSECURE_URI, content, uri, context.host?.origin || location.origin);
  return el.classList.contains('invalid') ? el : (0, dom_1.define)(el, (0, html_1.attributes)('link', optspec, (0, util_1.unwrap)(params))[0]);
}
exports.parse = parse;
function elem(INSECURE_URI, content, uri, origin) {
  let type;
  let message;
  switch (uri?.protocol) {
    case undefined:
      type = 'argument';
      message = 'Invalid URI';
      break;
    case 'http:':
    case 'https:':
      switch (true) {
        case /[0-9a-z]:\S/i.test((0, util_1.stringify)((0, util_1.unwrap)(content))):
          type = 'content';
          message = 'URI must not be contained';
          break;
        case INSECURE_URI.startsWith('^/') && /\/\.\.?(?:\/|$)/.test(INSECURE_URI.slice(0, INSECURE_URI.search(/[?#]|$/))):
          type = 'argument';
          message = 'Dot-segments cannot be used in subresource paths';
          break;
        default:
          return (0, dom_1.html)('a', {
            class: content.length === 0 ? 'url' : 'link',
            href: uri.source,
            target:  false || uri.origin !== origin || typeof content.head?.value === 'object' && content.head.value.classList.contains('media') ? '_blank' : undefined
          }, content.length === 0 ? decode(INSECURE_URI) : (0, dom_1.defrag)((0, util_1.unwrap)(content)));
      }
      break;
    case 'tel:':
      const tel = content.length === 0 ? INSECURE_URI : (0, util_1.stringify)((0, util_1.unwrap)(content));
      const pattern = /^(?:tel:)?(?:\+(?!0))?\d+(?:-\d+)*$/i;
      switch (true) {
        case content.length <= 1 && pattern.test(INSECURE_URI) && typeof tel === 'string' && pattern.test(tel) && tel.replace(/[^+\d]/g, '') === INSECURE_URI.replace(/[^+\d]/g, ''):
          return (0, dom_1.html)('a', {
            class: 'tel',
            href: uri.source
          }, content.length === 0 ? INSECURE_URI : (0, dom_1.defrag)((0, util_1.unwrap)(content)));
        default:
          type = 'content';
          message = 'Invalid content';
      }
      break;
    default:
      type = 'argument';
      message = 'Invalid protocol';
  }
  return (0, dom_1.html)('a', {
    class: 'invalid',
    ...(0, util_1.invalid)('link', type, message)
  }, content.length === 0 ? INSECURE_URI : (0, dom_1.defrag)((0, util_1.unwrap)(content)));
}
function resolve(uri, host, source) {
  switch (true) {
    case uri.startsWith('^/'):
      const last = host.pathname.slice(host.pathname.lastIndexOf('/') + 1);
      return last.includes('.') // isFile
      // Exclude ISO 6709.
      && /^[0-9]*[a-z][0-9a-z]*$/i.test(last.slice(last.lastIndexOf('.') + 1)) ? `${host.pathname.slice(0, -last.length)}${uri.slice(2)}` : `${host.pathname.replace(/\/?$/, '/')}${uri.slice(2)}`;
    case host.origin === source.origin && host.pathname === source.pathname:
    case uri.startsWith('//'):
      return uri;
    default:
      const target = new url_1.ReadonlyURL(uri, source.href);
      return target.origin === host.origin ? target.href.slice(target.origin.length) : target.href;
  }
}
exports.resolve = resolve;
function decode(uri) {
  const head = /^[a-z]+(?:[.+-][0-9a-z]+)*:\/*[^/?#\s]+/i;
  const origin = uri.match(head)?.[0] ?? '';
  try {
    const path = decodeURI(uri.slice(origin.length));
    uri = !origin && head.test(path) ? uri.slice(origin.length) : origin + path;
  } finally {
    return uri.replace(/\s+/g, encodeURI);
  }
}
exports.decode = decode;

/***/ },

/***/ 5381
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.mark = void 0;
const parser_1 = __webpack_require__(605);
const combinator_1 = __webpack_require__(3484);
const inline_1 = __webpack_require__(7973);
const indexee_1 = __webpack_require__(7610);
const visibility_1 = __webpack_require__(6364);
const util_1 = __webpack_require__(4992);
const dom_1 = __webpack_require__(394);
exports.mark = (0, combinator_1.lazy)(() => (0, combinator_1.precedence)(0, (0, util_1.repeat)('==', visibility_1.beforeNonblank, (0, combinator_1.recursion)(3 /* Recursion.inline */, (0, combinator_1.surround)('', (0, combinator_1.state)(2 /* State.mark */, (0, combinator_1.some)((0, combinator_1.union)([inline_1.inline]), '==', visibility_1.afterNonblank)), '==', false, [], ([, bs], {
  buffer
}) => buffer.import(bs), ([, bs], {
  buffer
}) => bs && buffer.import(bs).push(new parser_1.Node("\u0018" /* Command.Cancel */)) && buffer)), (nodes, {
  id,
  state
}, nest) => {
  const el = (0, dom_1.html)('mark', (0, dom_1.defrag)((0, util_1.unwrap)(nodes)));
  if (state & 251 /* State.linkers */ || nest) return new parser_1.List([new parser_1.Node(el)]);
  (0, dom_1.define)(el, {
    id: (0, indexee_1.identity)('mark', id, (0, indexee_1.signature)(el.cloneNode(true)))
  });
  return el.id ? new parser_1.List([new parser_1.Node(el), new parser_1.Node((0, dom_1.html)('a', {
    href: `#${el.id}`
  }))]) : new parser_1.List([new parser_1.Node(el)]);
})));

/***/ },

/***/ 2962
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.math = void 0;
const parser_1 = __webpack_require__(605);
const combinator_1 = __webpack_require__(3484);
const source_1 = __webpack_require__(8745);
const util_1 = __webpack_require__(4992);
const dom_1 = __webpack_require__(394);
const forbiddenCommand = /\\(?:begin|tiny|huge|large)(?![a-z])|:\/\//i;
exports.math = (0, combinator_1.lazy)(() => (0, combinator_1.rewrite)((0, combinator_1.union)([(0, combinator_1.surround)(/\$(?={)/y, (0, combinator_1.precedence)(4, bracket), '$', false, [3 | 16 /* Backtrack.escapable */]), (0, combinator_1.surround)(/\$(?![\s{}])/y, (0, combinator_1.precedence)(2, (0, combinator_1.some)((0, combinator_1.union)([(0, combinator_1.some)(source_1.escsource, /\$|[`"{}\n]/y), (0, combinator_1.precedence)(4, bracket)]))), /(?<!\s)\$(?![-0-9A-Za-z])/y, false, [3 | 16 /* Backtrack.escapable */])]), ({
  source,
  caches: {
    math: cache
  } = {}
}) => new parser_1.List([new parser_1.Node(cache?.get(source)?.cloneNode(true) || (0, dom_1.html)('span', !forbiddenCommand.test(source) ? {
  class: 'math',
  translate: 'no',
  'data-src': source
} : {
  class: 'invalid',
  translate: 'no',
  ...(0, util_1.invalid)('math', 'content', `"${source.match(forbiddenCommand)[0]}" command is forbidden`)
}, source))])));
const bracket = (0, combinator_1.lazy)(() => (0, combinator_1.surround)((0, source_1.str)('{'), (0, combinator_1.recursion)(6 /* Recursion.terminal */, (0, combinator_1.some)((0, combinator_1.union)([bracket, (0, combinator_1.some)(source_1.escsource, /[{}$\n]/y)]))), (0, source_1.str)('}'), true));

/***/ },

/***/ 7478
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.media = void 0;
const parser_1 = __webpack_require__(605);
const combinator_1 = __webpack_require__(3484);
const link_1 = __webpack_require__(3628);
const html_1 = __webpack_require__(5013);
const htmlentity_1 = __webpack_require__(470);
const source_1 = __webpack_require__(8745);
const util_1 = __webpack_require__(4992);
const url_1 = __webpack_require__(1904);
const dom_1 = __webpack_require__(394);
const optspec = {
  'width': [],
  'height': [],
  'aspect-ratio': [],
  rel: undefined
};
Object.setPrototypeOf(optspec, null);
exports.media = (0, combinator_1.lazy)(() => (0, combinator_1.constraint)(4 /* State.media */, (0, combinator_1.open)('!', (0, combinator_1.bind)((0, combinator_1.fmap)((0, combinator_1.tails)([(0, combinator_1.dup)((0, combinator_1.surround)('[', (0, combinator_1.precedence)(1, (0, combinator_1.some)((0, combinator_1.union)([htmlentity_1.unsafehtmlentity, bracket, source_1.txt]), ']')), ']', true, [3 | 16 /* Backtrack.escapable */, 2 | 32 /* Backtrack.ruby */], ([, ns = new parser_1.List()], context) => {
  if (context.linebreak !== 0) {
    const head = context.position - context.range;
    return void (0, combinator_1.setBacktrack)(context, 2 | 64 /* Backtrack.link */ | 32 /* Backtrack.ruby */, head);
  }
  return ns;
})), (0, combinator_1.dup)((0, combinator_1.surround)(/{(?![{}])/y, (0, combinator_1.precedence)(9, (0, combinator_1.inits)([link_1.uri, (0, combinator_1.some)(option)])), / ?}/y, false, [], undefined, ([as, bs]) => bs && as.import(bs).push(new parser_1.Node("\u0018" /* Command.Cancel */)) && as))]), nodes => nodes.length === 1 ? new parser_1.List([new parser_1.Node(new parser_1.List([new parser_1.Node('')])), nodes.delete(nodes.head)]) : new parser_1.List([new parser_1.Node(new parser_1.List([new parser_1.Node(nodes.head.value.foldl((acc, {
  value
}) => acc + value, ''), nodes.head.value.head?.flags)])), nodes.delete(nodes.last)])), ([{
  value: [{
    value: text,
    flags
  }]
}, {
  value: params
}], context) => {
  if (flags & 1 /* Flag.blank */) return;
  if (text) {
    const tmp = text;
    text = text.trim();
    if (text === '' || text[0] !== tmp[0]) return;
  }
  (0, combinator_1.consume)(100, context);
  if (params.last.value === "\u0018" /* Command.Cancel */) {
    params.pop();
    return new parser_1.List([new parser_1.Node((0, dom_1.html)('span', {
      class: 'invalid',
      ...(0, util_1.invalid)('media', 'syntax', 'Missing the closing symbol "}"')
    }, '!' + context.source.slice(context.position - context.range, context.position)))]);
  }
  const INSECURE_URI = params.shift().value;
  // altが空だとエラーが見えないため埋める。
  text ||= (0, link_1.decode)(INSECURE_URI);
  let uri;
  try {
    uri = new url_1.ReadonlyURL((0, link_1.resolve)(INSECURE_URI, context.host ?? location, context.url ?? context.host ?? location), context.host?.href || location.href);
  } catch {}
  let cache;
  const el =  false || uri && (cache = context.caches?.media?.get(uri.href)?.cloneNode(true)) || (0, dom_1.html)('img', {
    class: 'media',
    'data-src': uri?.source
  });
  el.setAttribute('alt', text);
  if (!sanitize(el, uri)) return new parser_1.List([new parser_1.Node(el)]);
  const [attrs, linkparams] = (0, html_1.attributes)('media', optspec, (0, util_1.unwrap)(params));
  (0, dom_1.define)(el, attrs);
  // Awaiting the generic support for attr().
  if (el.hasAttribute('aspect-ratio')) {
    el.style.aspectRatio = el.getAttribute('aspect-ratio');
  }
  if (context.state & 8 /* State.link */) return new parser_1.List([new parser_1.Node(el)]);
  if (cache && cache.tagName !== 'IMG') return new parser_1.List([new parser_1.Node(el)]);
  return new parser_1.List([new parser_1.Node((0, dom_1.define)((0, link_1.parse)(new parser_1.List(), linkparams.reduce((acc, p) => acc.push(new parser_1.Node(p)) && acc, new parser_1.List([new parser_1.Node(INSECURE_URI)])), context), {
    class: null,
    target: '_blank'
  }, [el]))]);
}))));
const bracket = (0, combinator_1.lazy)(() => (0, combinator_1.union)([(0, combinator_1.surround)((0, source_1.str)('('), (0, combinator_1.recursion)(6 /* Recursion.terminal */, (0, combinator_1.some)((0, combinator_1.union)([htmlentity_1.unsafehtmlentity, bracket, source_1.txt]), ')')), (0, source_1.str)(')'), true, [], undefined, () => new parser_1.List()), (0, combinator_1.surround)((0, source_1.str)('['), (0, combinator_1.recursion)(6 /* Recursion.terminal */, (0, combinator_1.some)((0, combinator_1.union)([htmlentity_1.unsafehtmlentity, bracket, source_1.txt]), ']')), (0, source_1.str)(']'), true, [], undefined, () => new parser_1.List()), (0, combinator_1.surround)((0, source_1.str)('{'), (0, combinator_1.recursion)(6 /* Recursion.terminal */, (0, combinator_1.some)((0, combinator_1.union)([htmlentity_1.unsafehtmlentity, bracket, source_1.txt]), '}')), (0, source_1.str)('}'), true, [], undefined, () => new parser_1.List()), (0, combinator_1.surround)((0, source_1.str)('"'), (0, combinator_1.precedence)(2, (0, combinator_1.recursion)(6 /* Recursion.terminal */, (0, combinator_1.some)((0, combinator_1.union)([htmlentity_1.unsafehtmlentity, source_1.txt]), '"'))), (0, source_1.str)('"'), true, [], undefined, () => new parser_1.List())]));
const option = (0, combinator_1.lazy)(() => (0, combinator_1.union)([(0, combinator_1.surround)((0, combinator_1.open)(/ /y, (0, source_1.str)(/[1-9][0-9]*/y)), (0, source_1.str)(/[x:]/y), (0, source_1.str)(/[1-9][0-9]*(?=[ }])/y), false, [], ([[{
  value: a
}], [{
  value: b
}], [{
  value: c
}]]) => b === 'x' ? new parser_1.List([new parser_1.Node(`width="${a}"`), new parser_1.Node(`height="${c}"`)]) : new parser_1.List([new parser_1.Node(`aspect-ratio="${a}/${c}"`)])), link_1.option]));
function sanitize(target, uri) {
  let type;
  let message;
  switch (uri?.protocol) {
    case undefined:
      type = 'argument';
      message = 'Invalid URI';
      break;
    case 'http:':
    case 'https:':
      if (!/\/\.\.?(?:\/|$)/.test('/' + uri.source.slice(0, uri.source.search(/[?#]|$/)))) return true;
      type = 'argument';
      message = 'Dot-segments cannot be used in media paths; use subresource paths instead';
      break;
    default:
      type = 'argument';
      message = 'Invalid protocol';
  }
  (0, dom_1.define)(target, {
    'data-src': null,
    class: 'invalid',
    ...(0, util_1.invalid)('link', type, message)
  });
  return false;
}

/***/ },

/***/ 9047
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.reference = void 0;
const parser_1 = __webpack_require__(605);
const combinator_1 = __webpack_require__(3484);
const inline_1 = __webpack_require__(7973);
const link_1 = __webpack_require__(3628);
const source_1 = __webpack_require__(8745);
const visibility_1 = __webpack_require__(6364);
const util_1 = __webpack_require__(4992);
const dom_1 = __webpack_require__(394);
exports.reference = (0, combinator_1.lazy)(() => (0, combinator_1.constraint)(64 /* State.reference */, (0, combinator_1.surround)('[[', (0, combinator_1.precedence)(1, (0, combinator_1.state)(128 /* State.annotation */ | 64 /* State.reference */, (0, combinator_1.subsequence)([abbr, (0, combinator_1.open)(visibility_1.beforeNonblank, (0, combinator_1.some)(inline_1.inline, ']', [[']', 1]]))]))), ']]', false, [2, 1 | 4 /* Backtrack.common */, 3 | 128 /* Backtrack.doublebracket */], ([, ns], context) => {
  const {
    position,
    range,
    linebreak
  } = context;
  const head = position - range;
  if (linebreak !== 0) {
    (0, combinator_1.setBacktrack)(context, 2 | 64 /* Backtrack.link */, head, 2);
    return;
  }
  return new parser_1.List([new parser_1.Node((0, dom_1.html)('sup', attributes(ns), [(0, dom_1.html)('span', (0, dom_1.defrag)((0, util_1.unwrap)((0, visibility_1.trimBlankNodeEnd)(ns))))]))]);
}, (_, context) => {
  const {
    source,
    position,
    range,
    linebreak
  } = context;
  const head = position - range;
  if (source[position] !== ']') {
    (0, combinator_1.setBacktrack)(context, 2 | 4 /* Backtrack.common */, head, 2);
  } else if (linebreak !== 0) {
    (0, combinator_1.setBacktrack)(context, 2 | 128 /* Backtrack.doublebracket */ | 64 /* Backtrack.link */ | 32 /* Backtrack.ruby */, head, 2);
  } else if (source[position + 1] !== '{') {
    (0, combinator_1.setBacktrack)(context, 2 | 64 /* Backtrack.link */, head + 1);
  } else {
    context.position += 1;
    if (!(0, link_1.textlink)(context)) {
      (0, combinator_1.setBacktrack)(context, 2 | 64 /* Backtrack.link */, head + 1);
    }
    context.position = position;
    context.range = range;
  }
})));
// Chicago-Style
const abbr = (0, combinator_1.surround)((0, source_1.str)('^'), (0, combinator_1.union)([(0, source_1.str)(/(?=[A-Z])(?:[0-9A-Za-z]'?|(?:[-.:]|\.?\??,? ?)(?!['\-.:?, ]))+/y)]), /\|?(?=]])|\|/y, true, [], ([, ns], context) => {
  const {
    source,
    position,
    range
  } = context;
  if (!ns) return new parser_1.List([new parser_1.Node(''), new parser_1.Node(source.slice(position - range, source[position - 1] === '|' ? position - 1 : position))]);
  context.position += source[position] === ' ' ? 1 : 0;
  return new parser_1.List([new parser_1.Node("\u001F" /* Command.Separator */), new parser_1.Node(ns.head.value.trimEnd())]);
}, (_, context) => {
  context.position -= context.range;
  return new parser_1.List([new parser_1.Node('')]);
});
function attributes(ns) {
  switch (ns.head.value) {
    case '':
      return {
        class: 'invalid',
        ...(0, util_1.invalid)('reference', 'syntax', 'Invalid abbreviation')
      };
    case "\u001F" /* Command.Separator */:
      const abbr = ns.head.next.value;
      ns.head.value = ns.head.next.value = '';
      return {
        class: 'reference',
        'data-abbr': abbr
      };
    default:
      return {
        class: 'reference'
      };
  }
}

/***/ },

/***/ 8948
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.remark = void 0;
const parser_1 = __webpack_require__(605);
const combinator_1 = __webpack_require__(3484);
const inline_1 = __webpack_require__(7973);
const source_1 = __webpack_require__(8745);
const util_1 = __webpack_require__(4992);
const dom_1 = __webpack_require__(394);
exports.remark = (0, combinator_1.lazy)(() => (0, combinator_1.fallback)((0, combinator_1.surround)((0, source_1.str)(/\[%(?=[ \n])/y), (0, combinator_1.precedence)(3, (0, combinator_1.recursion)(3 /* Recursion.inline */, (0, combinator_1.some)((0, combinator_1.union)([inline_1.inline]), /[ \n]%\]/y, [[/[ \n]%\]/y, 3]]))), (0, combinator_1.close)(source_1.text, (0, source_1.str)('%]')), true, [], ([as, bs = new parser_1.List(), cs]) => new parser_1.List([new parser_1.Node((0, dom_1.html)('span', {
  class: 'remark'
}, [(0, dom_1.html)('input', {
  type: 'checkbox'
}), (0, dom_1.html)('span', (0, dom_1.defrag)((0, util_1.unwrap)(as.import(bs).import(cs))))]))]), ([as, bs]) => bs && as.import(bs)), (0, combinator_1.focus)(/\[%+(?=[ \n])/y, ({
  source
}) => new parser_1.List([new parser_1.Node((0, dom_1.html)('span', {
  class: 'invalid',
  ...(0, util_1.invalid)('remark', 'syntax', 'Invalid start symbol')
}, source))]))));

/***/ },

/***/ 7304
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.ruby = void 0;
const parser_1 = __webpack_require__(605);
const combinator_1 = __webpack_require__(3484);
const htmlentity_1 = __webpack_require__(470);
const source_1 = __webpack_require__(8745);
const visibility_1 = __webpack_require__(6364);
const util_1 = __webpack_require__(4992);
const dom_1 = __webpack_require__(394);
exports.ruby = (0, combinator_1.lazy)(() => (0, combinator_1.bind)((0, combinator_1.inits)([(0, combinator_1.dup)((0, combinator_1.surround)('[', text, ']', false, [1 | 4 /* Backtrack.common */, 3 | 32 /* Backtrack.ruby */], ([, ns]) => {
  ns && ns.last?.value === '' && ns.pop();
  return (0, visibility_1.isNonblankNodeStart)(ns) ? ns : undefined;
})), (0, combinator_1.dup)((0, combinator_1.surround)('(', text, ')', false, [3 | 32 /* Backtrack.ruby */]))]), ([{
  value: texts
}, {
  value: rubies = undefined
} = {}], context) => {
  if (rubies === undefined) {
    const head = context.position - context.range;
    return void (0, combinator_1.setBacktrack)(context, 2 | 32 /* Backtrack.ruby */, head);
  }
  switch (true) {
    case texts.length >= rubies.length:
      return new parser_1.List([new parser_1.Node((0, dom_1.html)('ruby', (0, dom_1.defrag)((0, util_1.unwrap)([...zip(texts, rubies)].reduce((acc, [{
        value: text = ''
      } = {}, {
        value: ruby = ''
      } = {}]) => acc.import(ruby ? new parser_1.List([new parser_1.Node(text), new parser_1.Node((0, dom_1.html)('rp', '(')), new parser_1.Node((0, dom_1.html)('rt', ruby)), new parser_1.Node((0, dom_1.html)('rp', ')'))]) : new parser_1.List([new parser_1.Node(text), new parser_1.Node((0, dom_1.html)('rt'))])), new parser_1.List())))))]);
    case texts.length === 1 && [...texts.head.value].length >= rubies.length:
      return new parser_1.List([new parser_1.Node((0, dom_1.html)('ruby', (0, dom_1.defrag)((0, util_1.unwrap)([...zip(new parser_1.List([...texts.head.value].map(char => new parser_1.Node(char))), rubies)].reduce((acc, [{
        value: text = ''
      } = {}, {
        value: ruby = ''
      } = {}]) => acc.import(ruby ? new parser_1.List([new parser_1.Node(text), new parser_1.Node((0, dom_1.html)('rp', '(')), new parser_1.Node((0, dom_1.html)('rt', ruby)), new parser_1.Node((0, dom_1.html)('rp', ')'))]) : new parser_1.List([new parser_1.Node(text), new parser_1.Node((0, dom_1.html)('rt'))])), new parser_1.List())))))]);
    default:
      return new parser_1.List([new parser_1.Node((0, dom_1.html)('ruby', (0, dom_1.defrag)((0, util_1.unwrap)(new parser_1.List([new parser_1.Node(texts.foldl((acc, {
        value
      }) => acc ? acc + ' ' + value : value, '')), new parser_1.Node((0, dom_1.html)('rp', '(')), new parser_1.Node((0, dom_1.html)('rt', rubies.foldl((acc, {
        value
      }) => acc ? acc + ' ' + value : value, '').trim())), new parser_1.Node((0, dom_1.html)('rp', ')'))])))))]);
  }
}));
const delimiter = /[$"`\[\](){}<>（）［］｛｝|]|\\?\n/y;
const text = input => {
  const context = input;
  const {
    source
  } = context;
  const acc = new parser_1.List([new parser_1.Node('')]);
  let state = false;
  context.sequential = true;
  for (let {
    position
  } = context; position < source.length; position = context.position) {
    delimiter.lastIndex = position;
    if (delimiter.test(source)) break;
    switch (source[position]) {
      case '&':
        {
          const result = source[position + 1] !== ' ' ? (0, htmlentity_1.unsafehtmlentity)(input) ?? (0, source_1.txt)(input) : (0, source_1.txt)(input);
          acc.last.value += result.head.value;
          continue;
        }
      default:
        {
          if (source[position].trimStart() === '') {
            state ||= acc.last.value.trimStart() !== '';
            acc.push(new parser_1.Node(''));
            context.position += 1;
            continue;
          }
          const result = (0, source_1.txt)(input);
          acc.last.value += result.head?.value ?? '';
          continue;
        }
    }
  }
  context.sequential = false;
  state ||= acc.last.value.trimStart() !== '';
  return state ? acc : undefined;
};
function* zip(a, b) {
  const ia = a[Symbol.iterator]();
  const ib = b[Symbol.iterator]();
  for (;;) {
    const ra = ia.next();
    const rb = ib.next();
    if (ra.done) break;
    yield [ra.value, rb.value];
  }
}

/***/ },

/***/ 5902
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.lineshortmedia = exports.shortmedia = void 0;
const combinator_1 = __webpack_require__(3484);
const url_1 = __webpack_require__(2129);
const media_1 = __webpack_require__(7478);
exports.shortmedia = (0, combinator_1.constraint)(4 /* State.media */, (0, combinator_1.rewrite)((0, combinator_1.open)('!', url_1.url), (0, combinator_1.convert)(source => `!{ ${source.slice(1)} }`, (0, combinator_1.union)([media_1.media]))));
exports.lineshortmedia = (0, combinator_1.constraint)(4 /* State.media */, (0, combinator_1.focus)(/(?<=^|[\r\n])!https?:\/\/\S+(?=[^\S\n]*(?:$|\n))/y, (0, combinator_1.convert)(source => `!{ ${source.slice(1)} }`, (0, combinator_1.union)([media_1.media]))));

/***/ },

/***/ 6591
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.strong = void 0;
const parser_1 = __webpack_require__(605);
const combinator_1 = __webpack_require__(3484);
const inline_1 = __webpack_require__(7973);
const emphasis_1 = __webpack_require__(1354);
const source_1 = __webpack_require__(8745);
const visibility_1 = __webpack_require__(6364);
const util_1 = __webpack_require__(4992);
const dom_1 = __webpack_require__(394);
exports.strong = (0, combinator_1.lazy)(() => (0, combinator_1.surround)((0, source_1.str)('**', (0, visibility_1.beforeNonblankWith)(/(?!\*)/)), (0, combinator_1.precedence)(0, (0, combinator_1.recursion)(3 /* Recursion.inline */, (0, combinator_1.some)((0, combinator_1.union)([(0, combinator_1.some)(inline_1.inline, '*', visibility_1.afterNonblank), emphasis_1.emphasis])))), (0, source_1.str)('**'), false, [], ([, bs]) => new parser_1.List([new parser_1.Node((0, dom_1.html)('strong', (0, dom_1.defrag)((0, util_1.unwrap)(bs))))]), ([as, bs]) => bs && as.import(bs)));

/***/ },

/***/ 4510
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.template = void 0;
const parser_1 = __webpack_require__(605);
const combinator_1 = __webpack_require__(3484);
const source_1 = __webpack_require__(8745);
const util_1 = __webpack_require__(4992);
const dom_1 = __webpack_require__(394);
exports.template = (0, combinator_1.lazy)(() => (0, combinator_1.surround)((0, source_1.str)('{{'), (0, combinator_1.precedence)(1, (0, combinator_1.some)((0, combinator_1.union)([bracket, source_1.escsource]), '}')), (0, source_1.str)('}}'), true, [], ([as, bs = new parser_1.List(), cs]) => new parser_1.List([new parser_1.Node((0, dom_1.html)('span', {
  class: 'template'
}, (0, dom_1.defrag)((0, util_1.unwrap)(as.import(bs).import(cs)))))]), ([, bs], context) => bs && new parser_1.List([new parser_1.Node((0, dom_1.html)('span', {
  class: 'invalid',
  ...(0, util_1.invalid)('template', 'syntax', `Missing the closing symbol "}}"`)
}, context.source.slice(context.position - context.range, context.position)))])));
const bracket = (0, combinator_1.lazy)(() => (0, combinator_1.union)([(0, combinator_1.surround)((0, source_1.str)('('), (0, combinator_1.recursion)(6 /* Recursion.terminal */, (0, combinator_1.some)((0, combinator_1.union)([bracket, source_1.escsource]), ')')), (0, source_1.str)(')'), true, [], undefined, ([as, bs]) => bs && as.import(bs)), (0, combinator_1.surround)((0, source_1.str)('['), (0, combinator_1.recursion)(6 /* Recursion.terminal */, (0, combinator_1.some)((0, combinator_1.union)([bracket, source_1.escsource]), ']')), (0, source_1.str)(']'), true, [], undefined, ([as, bs]) => bs && as.import(bs)), (0, combinator_1.surround)((0, source_1.str)('{'), (0, combinator_1.recursion)(6 /* Recursion.terminal */, (0, combinator_1.some)((0, combinator_1.union)([bracket, source_1.escsource]), '}')), (0, source_1.str)('}'), true, [], undefined, ([as, bs]) => bs && as.import(bs)), (0, combinator_1.surround)((0, source_1.str)('"'), (0, combinator_1.precedence)(2, (0, combinator_1.recursion)(6 /* Recursion.terminal */, (0, combinator_1.some)(source_1.escsource, /["\n]/y, [['"', 2], ['\n', 3]]))), (0, source_1.str)('"'), true, [], undefined, ([as, bs]) => bs && as.import(bs))]));

/***/ },

/***/ 8068
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.isBlankHTMLEntityName = void 0;
const normalize_1 = __webpack_require__(4490);
exports.isBlankHTMLEntityName = eval(['name => {', 'switch(name){', normalize_1.invisibleBlankHTMLEntityNames.map(name => `case '${name}':`).join(''), 'return true;', 'default:', 'return false;', '}', '}'].join(''));

/***/ },

/***/ 1657
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.figure = void 0;
const label_1 = __webpack_require__(2178);
const util_1 = __webpack_require__(4992);
const queue_1 = __webpack_require__(4110);
const array_1 = __webpack_require__(6876);
const dom_1 = __webpack_require__(394);
const query_1 = __webpack_require__(2282);
function* figure(target, notes, opts = {}) {
  const refs = new queue_1.MultiQueue((0, array_1.push)((0, query_1.querySelectorAll)(target, 'a.label:not(.disabled)[data-label]'), notes && (0, query_1.querySelectorAll)(notes.references, 'a.label:not(.disabled)') || []).map(el => [el.getAttribute('data-label'), el]));
  const labels = new Set();
  const numbers = new Map();
  const scope = target instanceof Element ? ':scope > ' : '';
  let base = '0';
  let bases = base.split('.');
  let index = bases;
  for (let defs = target.querySelectorAll(`${scope}:is(figure[data-label], h1, h2)`), len = defs.length, i = 0; i < len; ++i) {
    yield;
    const def = defs[i];
    if (!scope && def.parentNode !== target) continue;
    const {
      tagName
    } = def;
    if (bases.length === 1 && tagName[0] === 'H') continue;
    const label = tagName === 'FIGURE' ? def.getAttribute('data-label') : `$-${increment(index, def)}`;
    if (label.endsWith('-')) continue;
    if (label.endsWith('-0')) {
      (0, util_1.markInvalid)(def, 'figure', 'argument', 'Invalid base index');
      (0, dom_1.define)(def, {
        hidden: null
      });
      continue;
    }
    if (tagName === 'FIGURE' && label.endsWith('.0')) {
      // $-x.x.0 is disabled.
      if (label.lastIndexOf('.', label.length - 3) !== -1) {
        (0, util_1.markInvalid)(def, 'figure', 'argument', 'Base index must be $-x.0 format');
        (0, dom_1.define)(def, {
          hidden: null
        });
        continue;
      }
      // $-x.0 after h1-h6.
      if (!/^H[1-6]$/.test(def.previousElementSibling?.tagName ?? '')) {
        (0, util_1.markInvalid)(def, 'figure', 'position', messages.declaration);
        (0, dom_1.define)(def, {
          hidden: null
        });
        continue;
      } else if (def.getAttribute('data-invalid-message') === messages.declaration) {
        (0, util_1.unmarkInvalid)(def);
        (0, dom_1.define)(def, {
          hidden: null
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
        id: null
      });
      (0, util_1.markInvalid)(def, 'figure', 'argument', messages.duplicate);
      continue;
    } else if (def.getAttribute('data-invalid-message') === messages.duplicate) {
      (0, util_1.unmarkInvalid)(def);
    }
    labels.add(label);
    opts.id !== '' && def.setAttribute('id', `label:${opts.id ? `${opts.id}:` : ''}${label}`);
    for (const ref of refs.take(label, Infinity)) {
      if (ref.getAttribute('data-invalid-message') === messages.reference) {
        (0, util_1.unmarkInvalid)(ref);
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
      (0, util_1.markInvalid)(ref, 'label', 'reference', messages.reference);
    }
    yield ref;
  }
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

/***/ },

/***/ 165
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.note = void 0;
const indexee_1 = __webpack_require__(7610);
const util_1 = __webpack_require__(4992);
const memoize_1 = __webpack_require__(6925);
const dom_1 = __webpack_require__(394);
function* note(target, notes, opts = {}, bottom = null) {
  const referenceRefMemory = referenceRefsMemoryCaller(target);
  const annotationRefMemory = annotationRefsMemoryCaller(target);
  for (const memory of [referenceRefMemory, annotationRefMemory]) {
    for (const [ref, {
      content
    }] of memory) {
      ref.replaceChildren(content);
    }
    memory.clear();
  }
  yield* reference(referenceRefMemory, target, notes?.references, opts, bottom);
  yield* annotation(annotationRefMemory, target, notes?.annotations, opts, bottom);
}
exports.note = note;
const annotationRefsMemoryCaller = (0, memoize_1.memoize)(target => new Map() ?? target, new WeakMap());
const referenceRefsMemoryCaller = (0, memoize_1.memoize)(target => new Map() ?? target, new WeakMap());
const annotation = build('annotation', 'annotations', '.annotation:not(:is(.annotations, .references) .annotation, .disabled)', n => `*${n}`, 'h1, h2, h3, h4, h5, h6, aside.aside, hr');
const reference = build('reference', 'references', '.reference:not(:is(.annotations, .references) .reference, .disabled)', (n, abbr) => `[${abbr || n}]`);
function build(syntax, list, query, marker, splitter = '') {
  splitter &&= `${splitter}, .${list}`;
  return function* (memory, target, note, opts = {}, bottom = null) {
    const refInfoCaller = (0, memoize_1.memoize)(ref => {
      const content = ref.firstElementChild;
      const abbr = ref.getAttribute('data-abbr') ?? '';
      const clone = ref.cloneNode(true);
      const txt = (0, indexee_1.text)(clone).trim();
      const identifier = abbr ? (0, indexee_1.identity)('', undefined, abbr.match(/^(?:\S+ )+?(?:(?:January|February|March|April|May|June|August|September|October|November|December) \d{1,2}(?:-\d{0,2})?, \d{1,4}(?:-\d{0,4})?[a-z]?|n\.d\.)(?=,|$)/)?.[0] ?? abbr.match(/^[^,\s]+(?:,? [^,\s]+)*?(?: \d{1,4}(?:-\d{0,4})?[a-z]?(?=,|$)|(?=,(?: [a-z]+\.?)? [0-9]))/)?.[0] ?? abbr)?.slice(2) || '' : (0, indexee_1.identity)('mark', undefined, (0, indexee_1.signature)(clone))?.slice(6) || '';
      return {
        content,
        identifier,
        abbr,
        text: txt
      };
    }, memory);
    const defs = new Map();
    const refs = target.querySelectorAll(query);
    const identifierInfoCaller = (0, memoize_1.memoize)(identifier => ({
      defIndex: 0,
      defSubindex: 0,
      refSubindex: 0,
      title: '' && 0,
      queue: []
    }));
    const scope = target instanceof Element ? ':scope > ' : '';
    const splitters = splitter ? target.querySelectorAll(`${scope}:is(${splitter})`) : [];
    let iSplitters = 0;
    let total = 0;
    let format;
    let refIndex = 0;
    for (let len = refs.length, i = 0; i < len; ++i) {
      const ref = refs[i];
      if (splitter) for (let splitter; splitter = splitters[iSplitters]; ++iSplitters) {
        const pos = splitter?.compareDocumentPosition(ref) ?? 0;
        if (pos & (Node.DOCUMENT_POSITION_PRECEDING | Node.DOCUMENT_POSITION_DISCONNECTED)) break;
        if (~iSplitters << 32 - 8 === 0) yield;
        if (splitter.classList.contains(list) && defs.size === 0) {
          splitter.remove();
          continue;
        }
        if (defs.size > 0) {
          total += defs.size;
          const note = splitter.classList.contains(list) ? splitter : target.insertBefore((0, dom_1.html)('ol', {
            class: list
          }), splitter);
          yield* proc(defs, note);
        }
      }
      const {
        content,
        identifier,
        abbr,
        text
      } = refInfoCaller(ref);
      const info = identifierInfoCaller(identifier);
      const refSubindex = ++info.refSubindex;
      const refId = opts.id !== '' ? `${syntax}:${opts.id ?? ''}:ref:${identifier}:${refSubindex}` : undefined;
      const initial = splitter ? !defs.has(identifier) : refSubindex === 1;
      const defSubindex = initial ? ++info.defSubindex : info.defSubindex;
      const defId = opts.id !== '' ? `${syntax}:${opts.id ?? ''}:def:${identifier}${splitter && `:${defSubindex}`}` : undefined;
      const def = initial ? (0, dom_1.html)('li', {
        id: defId,
        'data-marker': note ? undefined : marker(total + defs.size + 1, abbr)
      }, [content, (0, dom_1.html)('sup')]) : defs.get(identifier);
      initial && defs.set(identifier, def);
      if (!initial && content.innerHTML.length > def.firstElementChild.innerHTML.length) {
        def.firstElementChild.replaceWith(content);
      }
      const defIndex = initial ? info.defIndex = total + defs.size : info.defIndex;
      const title = info.title ||= text;
      (0, dom_1.define)(ref, {
        id: refId,
        class: opts.id !== '' ? undefined : void ref.classList.add('disabled'),
        title
      }, []);
      if (title && info.queue.length > 0) {
        for (const ref of info.queue) {
          (0, dom_1.define)(ref, {
            title
          });
          (0, util_1.unmarkInvalid)(ref);
        }
        info.queue = [];
        def.firstElementChild.replaceWith(content);
      }
      switch (ref.getAttribute('data-invalid-syntax')) {
        case 'format':
        case 'content':
          (0, util_1.unmarkInvalid)(ref);
      }
      format ??= abbr ? 'abbr' : 'number';
      if (!ref.classList.contains('invalid')) switch (true) {
        case format === 'number' ? abbr !== '' : abbr === '':
          (0, util_1.markInvalid)(ref, syntax, 'format', 'Notation format must be consistent with numbers or abbreviations');
          break;
        case title === '':
          (0, util_1.markInvalid)(ref, syntax, 'content', 'Missing the content');
          info.queue.push(ref);
          break;
      }
      ref.appendChild((0, dom_1.html)('a', {
        href: refId && defId && `#${defId}`
      }, marker(defIndex, abbr)));
      def.lastElementChild.appendChild((0, dom_1.html)('a', {
        href: refId && `#${refId}`,
        title: abbr && text || undefined
      }, `^${++refIndex}`));
      yield;
    }
    if (note || defs.size > 0) {
      const splitter = splitters[iSplitters++];
      yield* proc(defs, note ?? (splitter?.classList.contains(list) ? splitter : target.insertBefore((0, dom_1.html)('ol', {
        class: list
      }), splitter ?? bottom)));
    }
    if (splitter) for (let splitter; splitter = splitters[iSplitters]; ++iSplitters) {
      if (~iSplitters << 32 - 8 === 0) yield;
      if (splitter.classList.contains(list)) {
        splitter.remove();
      }
    }
  };
}
function* proc(defs, note) {
  const {
    children
  } = note;
  for (let defs = note.children, i = defs.length; i--;) {
    yield note.removeChild(children[i]);
  }
  for (const [, def] of defs) {
    yield note.appendChild(def);
  }
  defs.clear();
}

/***/ },

/***/ 3967
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.validate = exports.segment = exports.MAX_INPUT_SIZE = exports.MAX_SEGMENT_SIZE = void 0;
const context_1 = __webpack_require__(8669);
const combinator_1 = __webpack_require__(3484);
const heading_1 = __webpack_require__(2778);
const codeblock_1 = __webpack_require__(9194);
const mathblock_1 = __webpack_require__(4903);
const extension_1 = __webpack_require__(6193);
const source_1 = __webpack_require__(8745);
exports.MAX_SEGMENT_SIZE = 100_000; // 100,000 bytes (Max value size of FDB)
exports.MAX_INPUT_SIZE = exports.MAX_SEGMENT_SIZE * 10;
const parser = (0, combinator_1.union)([(0, combinator_1.some)(source_1.emptysegment, exports.MAX_SEGMENT_SIZE + 1), input => {
  const {
    source,
    position
  } = input;
  if (position === source.length) return;
  switch (source[position]) {
    case '`':
      if (source.startsWith('```', position)) return (0, codeblock_1.segment)(input);
      break;
    case '~':
      if (source.startsWith('~~~', position)) return (0, extension_1.segment)(input);
      break;
    case '$':
      if (source[position + 1] === '$') return (0, mathblock_1.segment)(input);
      return (0, extension_1.segment)(input);
    case '[':
      if (source[position + 1] === '$') return (0, extension_1.segment)(input);
      break;
    case '#':
      return (0, heading_1.segment)(input);
  }
}, (0, combinator_1.some)(source_1.contentline, exports.MAX_SEGMENT_SIZE + 1)]);
function* segment(source) {
  if (!validate(source, exports.MAX_INPUT_SIZE)) return yield [`${"\u0007" /* Command.Error */}Too large input over ${exports.MAX_INPUT_SIZE.toLocaleString('en')} bytes.\n${source.slice(0, 1001)}`, 0 /* Segment.unknown */];
  for (let position = 0; position < source.length;) {
    const context = new context_1.Context({
      source,
      position
    });
    const result = parser(context);
    const segs = result.length > 0 ? result.foldl((acc, {
      value
    }) => void acc.push(value) || acc, []) : [source.slice(position, context.position)];
    position = context.position;
    for (let i = 0; i < segs.length; ++i) {
      const seg = segs[i];
      validate(seg, exports.MAX_SEGMENT_SIZE) ? yield [seg, context.segment] : yield [`${"\u0007" /* Command.Error */}Too large segment over ${exports.MAX_SEGMENT_SIZE.toLocaleString('en')} bytes.\n${seg}`, 0 /* Segment.unknown */];
    }
  }
}
exports.segment = segment;
function validate(source, size) {
  return source.length <= size / 4 || source.length <= size && new Blob([source]).size <= size;
}
exports.validate = validate;

/***/ },

/***/ 8745
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.anyline = exports.emptysegment = exports.emptyline = exports.contentline = exports.strs = exports.str = exports.unescsource = exports.escsource = exports.txt = exports.text = void 0;
var text_1 = __webpack_require__(5655);
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
var escapable_1 = __webpack_require__(3770);
Object.defineProperty(exports, "escsource", ({
  enumerable: true,
  get: function () {
    return escapable_1.escsource;
  }
}));
var unescapable_1 = __webpack_require__(8407);
Object.defineProperty(exports, "unescsource", ({
  enumerable: true,
  get: function () {
    return unescapable_1.unescsource;
  }
}));
var str_1 = __webpack_require__(4017);
Object.defineProperty(exports, "str", ({
  enumerable: true,
  get: function () {
    return str_1.str;
  }
}));
Object.defineProperty(exports, "strs", ({
  enumerable: true,
  get: function () {
    return str_1.strs;
  }
}));
var line_1 = __webpack_require__(702);
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
Object.defineProperty(exports, "emptysegment", ({
  enumerable: true,
  get: function () {
    return line_1.emptysegment;
  }
}));
Object.defineProperty(exports, "anyline", ({
  enumerable: true,
  get: function () {
    return line_1.anyline;
  }
}));

/***/ },

/***/ 3770
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.escsource = void 0;
const parser_1 = __webpack_require__(605);
const combinator_1 = __webpack_require__(3484);
const text_1 = __webpack_require__(5655);
const dom_1 = __webpack_require__(394);
const delimiter = /(?=[\\$"`\[\](){}\r\n]|\s\$|:\/\/)/g;
const escsource = context => {
  const {
    source,
    position,
    state
  } = context;
  if (position === source.length) return;
  const char = source[position];
  (0, combinator_1.consume)(1, context);
  context.position += 1;
  switch (char) {
    case "\u001B" /* Command.Escape */:
      (0, combinator_1.consume)(1, context);
      context.position += 1;
      return new parser_1.List([new parser_1.Node(source.slice(position + 1, position + 2))]);
    case '\\':
      switch (source[position + 1]) {
        case undefined:
          return new parser_1.List([new parser_1.Node(char)]);
        case '\n':
          return new parser_1.List([new parser_1.Node(char)]);
        default:
          (0, combinator_1.consume)(1, context);
          context.position += 1;
          return new parser_1.List([new parser_1.Node(source.slice(position, position + 2))]);
      }
    case '\r':
      (0, combinator_1.consume)(-1, context);
      return new parser_1.List();
    case '\n':
      context.linebreak ||= source.length - position;
      return new parser_1.List([new parser_1.Node((0, dom_1.html)('br'), 1 /* Flag.blank */)]);
    default:
      if (context.sequential) return new parser_1.List([new parser_1.Node(char)]);
      let i = (0, text_1.next)(source, position, state, delimiter);
      i -= position;
      (0, combinator_1.consume)(i - 1, context);
      context.position += i - 1;
      return new parser_1.List([new parser_1.Node(source.slice(position, context.position))]);
  }
};
exports.escsource = escsource;

/***/ },

/***/ 702
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.contentline = exports.emptysegment = exports.emptyline = exports.anyline = void 0;
const parser_1 = __webpack_require__(605);
const anyline = input => {
  const context = input;
  const {
    source,
    position
  } = context;
  if (position === source.length) return;
  context.position = source.indexOf('\n', position) + 1 || source.length;
  return new parser_1.List();
};
exports.anyline = anyline;
const regEmptyline = /[^\S\n]*(?:$|\n)/y;
const emptyline = input => {
  const context = input;
  const {
    source,
    position
  } = context;
  if (position === source.length) return;
  const i = eoel(source, position);
  if (i === position) return;
  context.position = i;
  return new parser_1.List();
};
exports.emptyline = emptyline;
const emptysegment = input => {
  const context = input;
  const {
    source,
    position,
    segment
  } = context;
  if (position === source.length) return;
  if (segment & 1 /* Segment.write */) {
    if (segment !== (2 /* Segment.empty */ | 1 /* Segment.write */)) return;
    context.position = source.length;
    return new parser_1.List();
  }
  const i = eoel(source, position);
  if (i === position) return;
  context.position = i;
  context.segment = 2 /* Segment.empty */;
  return new parser_1.List();
};
exports.emptysegment = emptysegment;
function eoel(source, position) {
  if (source[position] === '\n') return position + 1;
  regEmptyline.lastIndex = position;
  regEmptyline.test(source);
  return regEmptyline.lastIndex || position;
}
const regContentline = /[^\S\n]*\S[^\n]*(?:$|\n)/y;
const contentline = input => {
  const context = input;
  const {
    source,
    position
  } = context;
  if (position === source.length) return;
  if (source[position] === '\n') return;
  regContentline.lastIndex = position;
  regContentline.test(source);
  const i = regContentline.lastIndex;
  if (i === 0) return;
  context.position = i;
  return new parser_1.List();
};
exports.contentline = contentline;

/***/ },

/***/ 4017
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.strs = exports.str = void 0;
const parser_1 = __webpack_require__(605);
const delimiter_1 = __webpack_require__(385);
function str(pattern, after) {
  return (0, delimiter_1.matcher)(pattern, true, after ? (0, delimiter_1.tester)(after, false) : undefined);
}
exports.str = str;
function strs(char, min = 1, max = -1) {
  return context => {
    const {
      source,
      position
    } = context;
    let cnt = 0;
    for (; cnt !== max && context.position < source.length && source[context.position] === char; ++cnt) {
      context.position += char.length;
    }
    return cnt >= min ? new parser_1.List([new parser_1.Node(source.slice(position, context.position))]) : undefined;
  };
}
exports.strs = strs;

/***/ },

/***/ 5655
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.isAlphanumeric = exports.next = exports.canSkip = exports.txt = exports.text = exports.nonWhitespace = void 0;
const parser_1 = __webpack_require__(605);
const combinator_1 = __webpack_require__(3484);
const dom_1 = __webpack_require__(394);
exports.nonWhitespace = /[^ \t　]/g;
const text = input => {
  const context = input;
  const {
    source,
    position,
    state
  } = context;
  if (position === source.length) return;
  const char = source[position];
  (0, combinator_1.consume)(1, context);
  context.position += 1;
  switch (char) {
    case "\u001B" /* Command.Escape */:
    case '\\':
      switch (source[position + 1]) {
        case undefined:
          return new parser_1.List();
        case '\n':
          return new parser_1.List();
        default:
          (0, combinator_1.consume)(1, context);
          context.position += 1;
          return new parser_1.List([new parser_1.Node(source.slice(position + 1, context.position))]);
      }
    case '\r':
      (0, combinator_1.consume)(-1, context);
      return new parser_1.List();
    case '\n':
      context.linebreak ||= source.length - position;
      return new parser_1.List([new parser_1.Node((0, dom_1.html)('br'), 1 /* Flag.blank */)]);
    default:
      if (context.sequential) return new parser_1.List([new parser_1.Node(char)]);
      exports.nonWhitespace.lastIndex = position + 1;
      const s = canSkip(source, position);
      let i = s ? exports.nonWhitespace.test(source) ? exports.nonWhitespace.lastIndex - 1 : source.length : next(source, position, state);
      const lineend =  false || s && i === source.length || s && source[i] === '\n';
      i -= position;
      i = lineend ? i : i - +s || 1;
      (0, combinator_1.consume)(i - 1, context);
      context.position += i - 1;
      const linestart = position === 0 || source[position - 1] === '\n';
      if (position === context.position || s && !linestart || lineend) return new parser_1.List();
      return new parser_1.List([new parser_1.Node(source.slice(position, context.position))]);
  }
};
exports.text = text;
exports.txt = (0, combinator_1.union)([exports.text]);
function canSkip(source, position) {
  if (!isWhitespace(source[position], false)) return false;
  if (position + 1 === source.length) return true;
  return isWhitespace(source[position + 1], true);
}
exports.canSkip = canSkip;
function isWhitespace(char, linebreak) {
  switch (char) {
    case ' ':
    case '\t':
    case '　':
      return true;
    case '\r':
    case '\n':
      return linebreak;
    default:
      return false;
  }
}
function next(source, position, state, delimiter) {
  let index;
  if (delimiter) {
    delimiter.lastIndex = position + 1;
    delimiter.test(source);
    index = delimiter.lastIndex || position;
  } else {
    index = seek(source, position, state);
  }
  if (index === position || index === source.length) return source.length;
  const char = source[index];
  switch (char) {
    case '%':
      index += !delimiter && index - 1 > position ? -1 : 0;
      break;
    case '[':
      index += !delimiter && index - 1 > position && source.startsWith(' [|', index - 1) ? -1 : 0;
      break;
    case ':':
      index = source.startsWith('//', index + 1) ? backToUrlHead(source, position, index) : index;
      break;
    case '@':
      index = ~state & 1 /* State.autolink */ ? backToEmailHead(source, position, index) : index;
      break;
  }
  return index;
}
exports.next = next;
function backToUrlHead(source, position, index) {
  const delim = index;
  let state = false;
  for (let i = index - 1; i >= position; --i) {
    const char = source[i];
    if (state) switch (char) {
      case '.':
      case '+':
      case '-':
        state = false;
        continue;
    }
    if (isAlphanumeric(char)) {
      state = true;
      index = i;
      continue;
    }
    break;
  }
  return index === position || source[index] !== 'h' ? delim : index;
}
function backToEmailHead(source, position, index) {
  const delim = index;
  let state = false;
  for (let i = index - 1; i >= position; --i) {
    const char = source[i];
    if (state) switch (char) {
      case '_':
      case '.':
      case '+':
      case '-':
        state = false;
        continue;
    }
    if (isAlphanumeric(char)) {
      state = true;
      index = i;
      continue;
    }
    break;
  }
  return index === position ? delim : index;
}
function isAlphanumeric(char) {
  if (char < '0' || '\x7F' < char) return false;
  return '0' <= char && char <= '9' || 'A' <= char && char <= 'Z' || 'a' <= char && char <= 'z';
}
exports.isAlphanumeric = isAlphanumeric;
function seek(source, position, state) {
  for (let i = position + 1; i < source.length; ++i) {
    const fst = source[i];
    switch (fst) {
      case '\\':
      case '!':
      case '$':
      case '"':
      case '`':
      case '[':
      case ']':
      case '(':
      case ')':
      case '{':
      case '}':
      case '<':
      case '>':
      case '（':
      case '）':
      case '［':
      case '］':
      case '｛':
      case '｝':
      case '*':
      case '|':
      case '\r':
      case '\n':
        return i;
      case '@':
      case '#':
        if (~state & 1 /* State.autolink */) return i;
        continue;
      case '+':
      case '~':
      case '=':
        if (source[i + 1] === fst) return i;
        continue;
      case '/':
        if (source[i + 1] === fst && source[i + 2] === fst) return i;
        continue;
      case '%':
        if (source[i + 1] === ']' && isWhitespace(source[i - 1], true)) return i;
        continue;
      case ':':
        if (source[i + 1] === '/' && source[i + 2] === '/') return i;
        continue;
      case '&':
        if (source[i + 1] !== ' ') return i;
        continue;
      case ' ':
      case '\t':
      case '　':
        if (i + 1 === source.length) return i;
        switch (source[i + 1]) {
          case ' ':
          case '\t':
          case '\r':
          case '\n':
          case '　':
            return i;
          case '\\':
            if (i + 2 === source.length) return i;
            switch (source[i + 2]) {
              case ' ':
              case '\t':
              case '\r':
              case '\n':
              case '　':
                return i;
            }
        }
        continue;
      default:
        continue;
    }
  }
  return source.length;
}

/***/ },

/***/ 8407
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.unescsource = exports.delimiter = void 0;
const parser_1 = __webpack_require__(605);
const combinator_1 = __webpack_require__(3484);
const text_1 = __webpack_require__(5655);
const dom_1 = __webpack_require__(394);
exports.delimiter = /(?=(?=[\x00-\x7F])[^0-9A-Za-z]|(?<=[\x00-\x7F])[^\x00-\x7F])/g;
const unescsource = context => {
  const {
    source,
    position,
    state
  } = context;
  if (position === source.length) return;
  const char = source[position];
  (0, combinator_1.consume)(1, context);
  context.position += 1;
  switch (char) {
    case "\u001B" /* Command.Escape */:
      (0, combinator_1.consume)(1, context);
      context.position += 1;
      return new parser_1.List([new parser_1.Node(source.slice(position + 1, position + 2))]);
    case '\r':
      return new parser_1.List();
    case '\n':
      context.linebreak ||= source.length - position;
      return new parser_1.List([new parser_1.Node((0, dom_1.html)('br'), 1 /* Flag.blank */)]);
    default:
      if (context.sequential) return new parser_1.List([new parser_1.Node(char)]);
      text_1.nonWhitespace.lastIndex = position + 1;
      let i = (0, text_1.canSkip)(source, position) ? text_1.nonWhitespace.test(source) ? text_1.nonWhitespace.lastIndex - 1 : source.length : (0, text_1.next)(source, position, state, exports.delimiter);
      i -= position;
      (0, combinator_1.consume)(i - 1, context);
      context.position += i - 1;
      return new parser_1.List([new parser_1.Node(source.slice(position, context.position))]);
  }
};
exports.unescsource = unescsource;

/***/ },

/***/ 4992
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.stringify = exports.unmarkInvalid = exports.markInvalid = exports.invalid = exports.repeat = exports.unwrap = void 0;
const parser_1 = __webpack_require__(605);
const delimiter_1 = __webpack_require__(385);
const alias_1 = __webpack_require__(5413);
const dom_1 = __webpack_require__(394);
function* unwrap(nodes) {
  if (nodes === undefined) return;
  for (const node of nodes) {
    yield node.value;
  }
}
exports.unwrap = unwrap;
function repeat(symbol, after, parser, cons, termination = (nodes, context, prefix, postfix) => {
  const acc = new parser_1.List();
  if (prefix > 0) {
    acc.push(new parser_1.Node(symbol[0].repeat(prefix)));
  }
  acc.import(nodes);
  if (postfix > 0) {
    const {
      source,
      position
    } = context;
    acc.push(new parser_1.Node(source.slice(position, position + postfix)));
    context.position += postfix;
  }
  return acc;
}) {
  const test = (0, delimiter_1.tester)(after, false);
  return (0, parser_1.failsafe)(input => {
    const context = input;
    const {
      source,
      position
    } = context;
    if (!source.startsWith(symbol, context.position)) return;
    let nodes = new parser_1.List();
    let i = symbol.length;
    for (; source[context.position + i] === source[context.position];) ++i;
    context.position += i;
    if (test(input) === undefined) return;
    let state = false;
    for (; i >= symbol.length; i -= symbol.length) {
      if (nodes.length > 0 && source.startsWith(symbol, context.position)) {
        nodes = cons(nodes, context, i > symbol.length);
        context.position += symbol.length;
        continue;
      }
      const buf = context.buffer;
      context.buffer = nodes;
      const result = parser(input);
      context.buffer = buf;
      if (result === undefined) break;
      nodes = result;
      switch (nodes.last?.value) {
        case "\u0018" /* Command.Cancel */:
          nodes.pop();
          state = false;
          break;
        case "\u001F" /* Command.Separator */:
          nodes.pop();
          state = true;
          continue;
        default:
          nodes = cons(nodes, context, i > symbol.length);
          state = true;
          continue;
      }
      break;
    }
    if (nodes.length === 0) return;
    const prefix = i;
    i = 0;
    for (let len = (0, alias_1.min)(prefix, source.length - context.position); i < len && source[context.position + i] === symbol[0];) {
      ++i;
    }
    const postfix = i;
    context.range = context.position - position;
    return termination(nodes, context, prefix, postfix, state);
  });
}
exports.repeat = repeat;
function invalid(syntax, type, message) {
  return {
    'data-invalid-syntax': syntax,
    'data-invalid-type': type,
    'data-invalid-message': message
  };
}
exports.invalid = invalid;
function markInvalid(el, syntax, type, message) {
  return (0, dom_1.define)(el, {
    class: void el.classList.add('invalid'),
    'data-invalid-syntax': syntax,
    'data-invalid-type': type,
    'data-invalid-message': message
  });
}
exports.markInvalid = markInvalid;
function unmarkInvalid(el) {
  return (0, dom_1.define)(el, {
    class: void el.classList.remove('invalid'),
    'data-invalid-syntax': null,
    'data-invalid-type': null,
    'data-invalid-message': null
  });
}
exports.unmarkInvalid = unmarkInvalid;
function stringify(nodes) {
  let acc = '';
  for (const node of nodes) {
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

/***/ },

/***/ 6364
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.trimBlankNodeEnd = exports.trimBlankEnd = exports.trimBlank = exports.isNonblankNodeStart = exports.isNonblankFirstLine = exports.beforeNonblankWith = exports.blankWith = exports.afterNonblank = exports.beforeNonblank = exports.visualize = void 0;
const parser_1 = __webpack_require__(605);
const combinator_1 = __webpack_require__(3484);
const normalize_1 = __webpack_require__(4490);
var blank;
(function (blank) {
  blank.line = new RegExp(/((?:^|\n)[^\S\n]*(?=\S))((?:[^\S\n]|\\(?=$|\s)|&IBHN;|<wbr ?>)+(?=$|\n))/g.source.replace('IBHN', `(?:${normalize_1.invisibleBlankHTMLEntityNames.join('|')})`), 'g');
  blank.start = new RegExp(/(?:[^\S\n]|\\(?=$|\s)|&IBHN;|<wbr ?>)+/y.source.replace('IBHN', `(?:${normalize_1.invisibleBlankHTMLEntityNames.join('|')})`), 'y');
  blank.unit = new RegExp(/(?:[^\S\n]|\\(?=$|\s)|&IBHN;|<wbr ?>)/y.source.replace('IBHN', `(?:${normalize_1.invisibleBlankHTMLEntityNames.join('|')})`), 'y');
})(blank || (blank = {}));
function visualize(parser) {
  return (0, combinator_1.convert)(source => source.replace(blank.line, `$1${"\u001B" /* Command.Escape */}$2`), parser);
}
exports.visualize = visualize;
exports.beforeNonblank = beforeNonblankWith('');
exports.afterNonblank = afterNonblankWith('');
function blankWith(starts, delimiter) {
  return new RegExp([
  // 空行除去
  // 完全な空行はエスケープ済みなので再帰的バックトラックにはならない。
  String.raw`(?:${starts}(?:\\?\s|&(?:${normalize_1.invisibleBlankHTMLEntityNames.join('|')});|<wbr ?>)*)?`, typeof delimiter === 'string' ? delimiter.replace(/[*+()\[\]]/g, '\\$&') : delimiter.source].join(''), 'y');
}
exports.blankWith = blankWith;
function beforeNonblankWith(delimiter) {
  return new RegExp([typeof delimiter === 'string' ? delimiter.replace(/[*+()\[\]]/g, '\\$&') : delimiter.source, String.raw`(?!\\?\s|&(?:${normalize_1.invisibleBlankHTMLEntityNames.join('|')});|<wbr ?>)`].join(''), 'y');
}
exports.beforeNonblankWith = beforeNonblankWith;
function afterNonblankWith(delimiter) {
  return new RegExp([String.raw`(?<!\s|&(?:${normalize_1.invisibleBlankHTMLEntityNames.join('|')});|<wbr ?>)`, typeof delimiter === 'string' ? delimiter.replace(/[*+()\[\]]/g, '\\$&') : delimiter.source].join(''), 'y');
}
function isNonblankFirstLine(nodes) {
  if (nodes.length === 0) return true;
  for (const node of nodes) {
    if (isNonblank(node)) return true;
    if (node.flags & 1 /* Flag.blank */ && typeof node.value === 'object' && node.value.tagName === 'BR') break;
  }
  return false;
}
exports.isNonblankFirstLine = isNonblankFirstLine;
function isNonblankNodeStart(nodes) {
  if (nodes.length === 0) return true;
  return isNonblank(nodes.head, 0);
}
exports.isNonblankNodeStart = isNonblankNodeStart;
function isNonblank({
  value: node,
  flags
}, strpos) {
  if (flags & 1 /* Flag.blank */) return false;
  if (typeof node !== 'string') return true;
  const str = node && strpos !== undefined ? node[strpos >= 0 ? strpos : node.length + strpos] : node;
  switch (str) {
    case '':
    case ' ':
    case '\t':
    case '\n':
      return false;
    default:
      return str.trimStart() !== '';
  }
}
function trimBlank(parser) {
  return trimBlankStart(trimBlankEnd(parser));
}
exports.trimBlank = trimBlank;
function trimBlankStart(parser) {
  return (0, parser_1.failsafe)(input => {
    const context = input;
    const {
      source,
      position
    } = context;
    if (position === source.length) return;
    const reg = blank.start;
    reg.lastIndex = position;
    reg.test(source);
    context.position = reg.lastIndex || position;
    return context.position === source.length ? new parser_1.List() : parser(input);
  });
}
function trimBlankEnd(parser) {
  return (0, combinator_1.fmap)(parser, trimBlankNodeEnd);
}
exports.trimBlankEnd = trimBlankEnd;
function trimBlankNodeEnd(nodes) {
  const skip = nodes.last && ~nodes.last.flags & 1 /* Flag.blank */ && typeof nodes.last.value === 'object' ? nodes.last.value.className === 'indexer' : false;
  for (let node = skip ? nodes.last?.prev : nodes.last; node;) {
    if (~node.flags & 1 /* Flag.blank */) {
      if (typeof node.value === 'string') {
        const str = node.value.trimEnd();
        if (str.length > 0) {
          node.value = str;
          break;
        }
      } else {
        break;
      }
    }
    const target = node;
    node = node.prev;
    nodes.delete(target);
  }
  return nodes;
}
exports.trimBlankNodeEnd = trimBlankNodeEnd;

/***/ },

/***/ 1625
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.render = void 0;
var render_1 = __webpack_require__(3268);
Object.defineProperty(exports, "render", ({
  enumerable: true,
  get: function () {
    return render_1.render;
  }
}));

/***/ },

/***/ 3268
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.render = void 0;
const code_1 = __webpack_require__(3042);
const math_1 = __webpack_require__(3165);
const media_1 = __webpack_require__(3567);
const memoize_1 = __webpack_require__(6925);
const query_1 = __webpack_require__(2282);
const selector = ':not(.invalid):is(.media:is(img:not([src])[data-src], a > :not(img).media), pre.code, .math)';
const extend = (0, memoize_1.reduce)(opts => ({
  code: code_1.code,
  math: math_1.math,
  media: {},
  ...opts
}));
function render(source, opts = {}) {
  opts = extend(opts);
  const base = location.href;
  for (let es = (0, query_1.querySelectorAllWith)(source, selector), i = 0; i < es.length; ++i) {
    render_(base, es[i], opts);
  }
}
exports.render = render;
function render_(base, source, opts) {
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

/***/ },

/***/ 3042
(__unused_webpack_module, exports, __webpack_require__) {

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
const prismjs_1 = __importDefault(__webpack_require__(293));
function code(target, cache) {
  const source = target.textContent;
  prismjs_1.default.highlightElement(target, false, () => void cache?.set(`${target.getAttribute('data-lang') ?? ''}\n${source}`, target.cloneNode(true)));
}
exports.code = code;

/***/ },

/***/ 3165
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.math = void 0;
const dom_1 = __webpack_require__(394);
function math(target, cache) {
  const source = target.textContent;
  queue(target, () => {
    !target.textContent?.trim() && (0, dom_1.define)(target, [(0, dom_1.html)('span', source)]);
    return void cache?.set(source, target.cloneNode(true));
  });
}
exports.math = math;
async function queue(target, callback = () => undefined) {
  // @ts-ignore
  !MathJax.typesetPromise && (await MathJax.startup.promise);
  // @ts-ignore
  MathJax.typesetPromise([target]).then(callback);
}

/***/ },

/***/ 3567
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.media = void 0;
const twitter_1 = __webpack_require__(1231);
const youtube_1 = __webpack_require__(6713);
const pdf_1 = __webpack_require__(4290);
const video_1 = __webpack_require__(6991);
const audio_1 = __webpack_require__(7086);
const image_1 = __webpack_require__(8673);
const url_1 = __webpack_require__(1904);
const memoize_1 = __webpack_require__(6925);
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

/***/ },

/***/ 7086
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.audio = void 0;
const dom_1 = __webpack_require__(394);
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

/***/ },

/***/ 8673
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.image = void 0;
const dom_1 = __webpack_require__(394);
function image(source, url, cache) {
  if (cache?.has(url.href)) return (0, dom_1.define)(cache.get(url.href).cloneNode(true), Object.fromEntries([...source.attributes].map(attr => [attr.name, attr.value])));
  (0, dom_1.define)(source, {
    'data-type': 'image',
    src: source.getAttribute('data-src'),
    loading: 'lazy'
  });
  cache?.set(url.href, (0, dom_1.define)(source.cloneNode(true), Object.fromEntries([...source.attributes].filter(attr => !['class', 'data-type', 'data-src', 'src', 'loading'].includes(attr.name)).map(attr => [attr.name, attr.name === 'alt' ? '' : null]))));
  return source;
}
exports.image = image;

/***/ },

/***/ 4290
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.pdf = void 0;
const parser_1 = __webpack_require__(3561);
const dom_1 = __webpack_require__(394);
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

/***/ },

/***/ 1231
(__unused_webpack_module, exports, __webpack_require__) {

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
const parser_1 = __webpack_require__(3561);
const dom_1 = __webpack_require__(394);
const dompurify_1 = __importDefault(__webpack_require__(611));
const origins = ['https://twitter.com'];
function twitter(source, url) {
  if (!origins.includes(url.origin)) return;
  if (url.pathname.split('/').pop().includes('.')) return;
  if (!url.pathname.match(/^\/\w+\/status\/[0-9]{15,}\/?$/)) return;
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
      if (window.twttr) return void window.twttr.widgets.load(el);
      const id = 'twitter-wjs';
      if (document.getElementById(id)) return;
      document.body.appendChild((0, dom_1.html)('script', {
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

/***/ },

/***/ 6991
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.video = void 0;
const dom_1 = __webpack_require__(394);
const extensions = ['.webm', '.ogv'];
function video(source, url) {
  if (!extensions.includes(url.pathname.split(/(?=\.)/).pop())) return;
  return (0, dom_1.html)('video', {
    src: source.getAttribute('data-src'),
    'data-type': 'video',
    ...Object.fromEntries([...source.attributes].map(attr => [attr.name, attr.value])),
    style: source.hasAttribute('aspect-ratio') ? `aspect-ratio: ${source.getAttribute('aspect-ratio')};` : undefined,
    muted: '',
    controls: ''
  });
}
exports.video = video;

/***/ },

/***/ 6713
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.youtube = void 0;
const dom_1 = __webpack_require__(394);
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
      return url.pathname.match(/^\/watch\/?$/) ? url.searchParams.get('v')?.concat(url.search.replace(/([?&])v=[^&#]*&?/g, '$1'), url.hash) : undefined;
    case 'https://youtu.be':
      return url.pathname.match(/^\/[\w-]+\/?$/) ? url.href.slice(url.origin.length) : undefined;
    default:
      return;
  }
}

/***/ },

/***/ 2570
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.scope = exports.info = exports.toc = exports.quote = void 0;
var quote_1 = __webpack_require__(4001);
Object.defineProperty(exports, "quote", ({
  enumerable: true,
  get: function () {
    return quote_1.quote;
  }
}));
var toc_1 = __webpack_require__(7539);
Object.defineProperty(exports, "toc", ({
  enumerable: true,
  get: function () {
    return toc_1.toc;
  }
}));
var info_1 = __webpack_require__(6825);
Object.defineProperty(exports, "info", ({
  enumerable: true,
  get: function () {
    return info_1.info;
  }
}));
var scope_1 = __webpack_require__(7169);
Object.defineProperty(exports, "scope", ({
  enumerable: true,
  get: function () {
    return scope_1.scope;
  }
}));

/***/ },

/***/ 6825
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.info = void 0;
const scope_1 = __webpack_require__(7169);
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
    for (let es = source.querySelectorAll(selector), len = es.length, i = 0; i < len; ++i) {
      const el = es[i];
      match(el) && acc.push(el);
    }
    return acc;
  }
}
exports.info = info;

/***/ },

/***/ 4001
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.quote = void 0;
const parser_1 = __webpack_require__(605);
const context_1 = __webpack_require__(8669);
const cite_1 = __webpack_require__(1200);
function quote(anchor, range) {
  const context = (0, parser_1.input)('', new context_1.Context());
  (0, cite_1.cite)((0, parser_1.input)(`>>${anchor}`, context));
  if (context.position !== context.source.length) throw new Error(`Invalid anchor: ${anchor}`);
  fit(range);
  const node = trim(range.cloneContents());
  if (!node.firstChild) return '';
  for (let es = node.querySelectorAll('code[data-src], .math[data-src], .media[data-src], rt, rp'), len = es.length, i = 0; i < len; ++i) {
    const el = es[i];
    switch (true) {
      case el.matches('code'):
      case el.matches('.math'):
        el.replaceWith(el.getAttribute('data-src'));
        continue;
      case el.matches('.url'):
        el.replaceWith(/[\s{}]/.test(el.getAttribute('href')) ? `{ ${el.getAttribute('href')} }` : `{${el.getAttribute('href')}}`);
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
  for (let es = node.querySelectorAll('br'), len = es.length, i = 0; i < len; ++i) {
    const el = es[i];
    if (anchor && el.nextSibling instanceof Element && el.nextSibling.matches('.cite, .quote')) {
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
  if (node.nodeName === 'BR' && node.nextSibling instanceof Element && node.nextSibling.matches('.cite, .quote')) {
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

/***/ },

/***/ 7169
(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.scope = void 0;
function scope(base, filter = '', bound = `${'id' in base && base.id ? `#${base.id}, ` : ''}section, article, aside, blockquote, pre, .quote, .math, .media`) {
  bound += filter && `, ${filter}`;
  const memory = new WeakMap();
  const context = 'id' in base && base.closest(bound) || null;
  return el => {
    const {
      parentNode
    } = el;
    const node = memory.has(parentNode) ? parentNode : parentNode.parentNode;
    let result = memory.get(node);
    if (result === undefined) {
      result = el.closest(bound) === context;
      memory.set(node, result);
    }
    return result;
  };
}
exports.scope = scope;

/***/ },

/***/ 7539
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.toc = void 0;
const array_1 = __webpack_require__(6876);
const dom_1 = __webpack_require__(394);
const selector = ':is(h1, h2, h3, h4, h5, h6, aside.aside)[id]';
function toc(source) {
  const hs = [];
  for (let es = source.querySelectorAll(selector), len = es.length, i = 0; i < len; ++i) {
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
      'data-index': isHeading ? idx : undefined
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
    el.firstChild ? el.replaceWith(el.firstChild) : el.remove();
  }
  return h.childNodes;
}

/***/ },

/***/ 394
(module) {

/*! typed-dom v0.0.351 https://github.com/falsandtru/typed-dom | (c) 2016, falsandtru | (Apache-2.0 AND MPL-2.0) License */
(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory();
	else // removed by dead control flow
{}
})(this, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 413
(__unused_webpack_module, exports) {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.ObjectSetPrototypeOf = exports.ObjectGetPrototypeOf = exports.ObjectCreate = exports.ObjectAssign = exports.toString = exports.isEnumerable = exports.isPrototypeOf = exports.hasOwnProperty = exports.isArray = exports.sqrt = exports.log10 = exports.log2 = exports.log = exports.tan = exports.cos = exports.sign = exports.round = exports.random = exports.min = exports.max = exports.floor = exports.ceil = exports.abs = exports.PI = exports.parseInt = exports.parseFloat = exports.isSafeInteger = exports.isNaN = exports.isInteger = exports.isFinite = exports.EPSILON = exports.MIN_VALUE = exports.MIN_SAFE_INTEGER = exports.MAX_VALUE = exports.MAX_SAFE_INTEGER = void 0;
exports.MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER, exports.MAX_VALUE = Number.MAX_VALUE, exports.MIN_SAFE_INTEGER = Number.MIN_SAFE_INTEGER, exports.MIN_VALUE = Number.MIN_VALUE, exports.EPSILON = Number.EPSILON, exports.isFinite = Number.isFinite, exports.isInteger = Number.isInteger, exports.isNaN = Number.isNaN, exports.isSafeInteger = Number.isSafeInteger, exports.parseFloat = Number.parseFloat, exports.parseInt = Number.parseInt;
exports.PI = Math.PI, exports.abs = Math.abs, exports.ceil = Math.ceil, exports.floor = Math.floor, exports.max = Math.max, exports.min = Math.min, exports.random = Math.random, exports.round = Math.round, exports.sign = Math.sign, exports.cos = Math.cos, exports.tan = Math.tan, exports.log = Math.log, exports.log2 = Math.log2, exports.log10 = Math.log10, exports.sqrt = Math.sqrt;
exports.isArray = Array.isArray;
exports.hasOwnProperty = Object.prototype.hasOwnProperty.call.bind(Object.prototype.hasOwnProperty);
exports.isPrototypeOf = Object.prototype.isPrototypeOf.call.bind(Object.prototype.isPrototypeOf);
exports.isEnumerable = Object.prototype.propertyIsEnumerable.call.bind(Object.prototype.propertyIsEnumerable);
exports.toString = Object.prototype.toString.call.bind(Object.prototype.toString);
exports.ObjectAssign = Object.assign;
exports.ObjectCreate = Object.create;
exports.ObjectGetPrototypeOf = Object.getPrototypeOf;
exports.ObjectSetPrototypeOf = Object.setPrototypeOf;

/***/ },

/***/ 934
(__unused_webpack_module, exports) {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.equal = void 0;
function equal(a, b) {
  return a === a ? a === b : b !== b;
}
exports.equal = equal;

/***/ },

/***/ 925
(__unused_webpack_module, exports, __nested_webpack_require_3115__) {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.reduce = exports.memoize = void 0;
const alias_1 = __nested_webpack_require_3115__(413);
const compare_1 = __nested_webpack_require_3115__(934);
function memoize(f, identify, memory) {
  if (typeof identify === 'object') {
    memory = identify;
    identify = undefined;
  }
  identify ??= (...as) => as[0];
  switch (true) {
    case (0, alias_1.isArray)(memory):
      return memoizeArray(f, identify, memory);
    case memory?.constructor === Object:
      return memoizeObject(f, identify, memory);
    default:
      return memoizeDict(f, identify, memory ?? new Map());
  }
}
exports.memoize = memoize;
function memoizeArray(f, identify, memory) {
  return (...as) => {
    const b = identify(...as);
    let z = memory[b];
    if (z !== undefined) return z;
    z = f(...as);
    memory[b] = z;
    return z;
  };
}
function memoizeObject(f, identify, memory) {
  let nullable = false;
  return (...as) => {
    const b = identify(...as);
    let z = memory[b];
    if (z !== undefined || nullable && b in memory) return z;
    z = f(...as);
    nullable ||= z === undefined;
    memory[b] = z;
    return z;
  };
}
function memoizeDict(f, identify, memory) {
  let nullable = false;
  return (...as) => {
    const b = identify(...as);
    let z = memory.get(b);
    if (z !== undefined || nullable && memory.has(b)) return z;
    z = f(...as);
    nullable ||= z === undefined;
    memory.add?.(b, z) ?? memory.set(b, z);
    return z;
  };
}
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

/***/ },

/***/ 761
(__unused_webpack_module, exports, __nested_webpack_require_4963__) {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.defrag = exports.prepend = exports.append = exports.isChildren = exports.define = exports.element = exports.text = exports.math = exports.svg = exports.html = exports.frag = exports.shadow = void 0;
const alias_1 = __nested_webpack_require_4963__(413);
const memoize_1 = __nested_webpack_require_4963__(925);
var caches;
(function (caches) {
  // Closed only.
  caches.shadows = new WeakMap();
  caches.shadow = (0, memoize_1.memoize)((el, opts) => el.attachShadow(opts), caches.shadows);
  caches.fragment = document.createDocumentFragment();
})(caches || (caches = {}));
function shadow(el, opts, children, factory = exports.html) {
  if (typeof el === 'string') return shadow(factory(el), opts, children, factory);
  if (typeof opts === 'function') return shadow(el, undefined, children, opts);
  if (typeof children === 'function') return shadow(el, opts, undefined, children);
  if (isChildren(opts)) return shadow(el, undefined, opts, factory);
  return defineChildren(!opts ? el.shadowRoot ?? caches.shadows.get(el) ?? el.attachShadow({
    mode: 'open'
  }) : opts.mode === 'open' ? el.shadowRoot ?? el.attachShadow(opts) : caches.shadow(el, opts), children);
}
exports.shadow = shadow;
function frag(children) {
  return defineChildren(caches.fragment.cloneNode(true), children);
}
exports.frag = frag;
exports.html = element(document, "HTML" /* NS.HTML */);
exports.svg = element(document, "SVG" /* NS.SVG */);
exports.math = element(document, "MathML" /* NS.Math */);
function text(source) {
  return document.createTextNode(source);
}
exports.text = text;
function element(context, ns) {
  return (tag, attrs, children) => {
    return !attrs || isChildren(attrs) ? defineChildren(elem(context, ns, tag, {}), attrs ?? children) : defineChildren(defineAttrs(elem(context, ns, tag, attrs), attrs), children);
  };
}
exports.element = element;
function elem(context, ns, tag, attrs) {
  if (!('createElement' in context)) throw new Error(`Typed-DOM: Scoped custom elements are not supported on this browser`);
  const opts = 'is' in attrs ? {
    is: attrs['is']
  } : undefined;
  switch (ns) {
    case "HTML" /* NS.HTML */:
      return context.createElement(tag, opts);
    case "SVG" /* NS.SVG */:
      return context.createElementNS('http://www.w3.org/2000/svg', tag, opts);
    case "MathML" /* NS.Math */:
      return context.createElementNS('http://www.w3.org/1998/Math/MathML', tag, opts);
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
  for (const name of Object.keys(attrs)) {
    switch (name) {
      case 'is':
        continue;
    }
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
              el[prop] ?? Object.defineProperty(el, prop, {
                configurable: true,
                enumerable: false,
                writable: true,
                value: prop in el && !(0, alias_1.hasOwnProperty)(el, prop) ? ev => ev.returnValue : ''
              });
          }
        }
        continue;
      case 'function':
        if (name.length < 3) throw new Error(`Typed-DOM: Attribute names for event listeners must have an event name but got "${name}"`);
        const names = name.split(/\s+/);
        for (const name of names) {
          if (!name.startsWith('on')) throw new Error(`Typed-DOM: Attribute names for event listeners must start with "on" but got "${name}"`);
          const type = name.slice(2).toLowerCase();
          el.addEventListener(type, value, {
            passive: ['wheel', 'mousewheel', 'touchstart', 'touchmove', 'touchend', 'touchcancel'].includes(type)
          });
          switch (type) {
            case 'mutate':
            case 'connect':
            case 'disconnect':
              const prop = `on${type}`;
              el[prop] ?? Object.defineProperty(el, prop, {
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
  if (children === undefined) return node;
  if (typeof children === 'string') {
    node.textContent = children;
  } else {
    node.replaceChildren(...children);
  }
  return node;
}
function isChildren(value) {
  return value?.[Symbol.iterator] !== undefined;
}
exports.isChildren = isChildren;
function append(node, children) {
  if (children === undefined) return node;
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
  if (children === undefined) return node;
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
function* defrag(nodes) {
  let acc = '';
  for (const node of nodes) {
    if (typeof node === 'string') {
      acc += node;
    } else {
      if (acc) yield acc;
      acc = '';
      yield node;
    }
  }
  if (acc) yield acc;
}
exports.defrag = defrag;

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nested_webpack_require_11558__(moduleId) {
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
/******/ 		__webpack_modules__[moduleId](module, module.exports, __nested_webpack_require_11558__);
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
/******/ 	var __nested_webpack_exports__ = __nested_webpack_require_11558__(761);
/******/ 	
/******/ 	return __nested_webpack_exports__;
/******/ })()
;
});

/***/ },

/***/ 2282
(module) {

/*! typed-dom v0.0.351 https://github.com/falsandtru/typed-dom | (c) 2016, falsandtru | (Apache-2.0 AND MPL-2.0) License */
(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory();
	else // removed by dead control flow
{}
})(this, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __nested_webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it uses a non-standard name for the exports (exports).
(() => {
var exports = __nested_webpack_exports__;


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.querySelectorAll = exports.querySelectorAllWith = exports.querySelectorWith = void 0;
function querySelectorWith(node, selector) {
  return 'matches' in node && node.matches(selector) ? node : node.querySelector(selector);
}
exports.querySelectorWith = querySelectorWith;
function querySelectorAllWith(node, selector) {
  const acc = [];
  if ('matches' in node && node.matches(selector)) {
    acc.push(node);
  }
  for (let es = node.querySelectorAll(selector), len = es.length, i = 0; i < len; ++i) {
    acc.push(es[i]);
  }
  return acc;
}
exports.querySelectorAllWith = querySelectorAllWith;
function querySelectorAll(node, selector) {
  const acc = [];
  for (let es = node.querySelectorAll(selector), len = es.length, i = 0; i < len; ++i) {
    acc.push(es[i]);
  }
  return acc;
}
exports.querySelectorAll = querySelectorAll;
})();

/******/ 	return __nested_webpack_exports__;
/******/ })()
;
});

/***/ },

/***/ 611
(module) {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__611__;

/***/ },

/***/ 293
(module) {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__293__;

/***/ }

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
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(8257);
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});