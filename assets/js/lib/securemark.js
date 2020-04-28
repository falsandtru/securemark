/*! securemark v0.155.0 https://github.com/falsandtru/securemark | (c) 2017, falsandtru | UNLICENSED */
require = function () {
    function r(e, n, t) {
        function o(i, f) {
            if (!n[i]) {
                if (!e[i]) {
                    var c = 'function' == typeof require && require;
                    if (!f && c)
                        return c(i, !0);
                    if (u)
                        return u(i, !0);
                    var a = new Error('Cannot find module \'' + i + '\'');
                    throw a.code = 'MODULE_NOT_FOUND', a;
                }
                var p = n[i] = { exports: {} };
                e[i][0].call(p.exports, function (r) {
                    var n = e[i][1][r];
                    return o(n || r);
                }, p, p.exports, r, e, n, t);
            }
            return n[i].exports;
        }
        for (var u = 'function' == typeof require && require, i = 0; i < t.length; i++)
            o(t[i]);
        return o;
    }
    return r;
}()({
    1: [
        function (_dereq_, module, exports) {
        },
        {}
    ],
    2: [
        function (_dereq_, module, exports) {
            arguments[4][1][0].apply(exports, arguments);
        },
        { 'dup': 1 }
    ],
    3: [
        function (_dereq_, module, exports) {
            arguments[4][1][0].apply(exports, arguments);
        },
        { 'dup': 1 }
    ],
    4: [
        function (_dereq_, module, exports) {
            arguments[4][1][0].apply(exports, arguments);
        },
        { 'dup': 1 }
    ],
    5: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.isArray = exports.ObjectValues = exports.ObjectSetPrototypeOf = exports.ObjectSeal = exports.ObjectPreventExtensions = exports.ObjectKeys = exports.isSealed = exports.isFrozen = exports.isExtensible = exports.ObjectIs = exports.ObjectGetPrototypeOf = exports.ObjectGetOwnPropertySymbols = exports.ObjectGetOwnPropertyNames = exports.ObjectGetOwnPropertyDescriptors = exports.ObjectGetOwnPropertyDescriptor = exports.ObjectFreeze = exports.ObjectEntries = exports.ObjectDefineProperty = exports.ObjectDefineProperties = exports.ObjectCreate = exports.ObjectAssign = exports.toString = exports.isEnumerable = exports.isPrototypeOf = exports.hasOwnProperty = exports.SymbolKeyFor = exports.SymbolFor = exports.parseInt = exports.parseFloat = exports.isSafeInteger = exports.isNaN = exports.isInteger = exports.isFinite = exports.NaN = void 0;
            exports.NaN = Number.NaN, exports.isFinite = Number.isFinite, exports.isInteger = Number.isInteger, exports.isNaN = Number.isNaN, exports.isSafeInteger = Number.isSafeInteger, exports.parseFloat = Number.parseFloat, exports.parseInt = Number.parseInt;
            exports.SymbolFor = Symbol.for;
            exports.SymbolKeyFor = Symbol.keyFor;
            exports.hasOwnProperty = Object.prototype.hasOwnProperty.call.bind(Object.prototype.hasOwnProperty);
            exports.isPrototypeOf = Object.prototype.isPrototypeOf.call.bind(Object.prototype.isPrototypeOf);
            exports.isEnumerable = Object.prototype.propertyIsEnumerable.call.bind(Object.prototype.propertyIsEnumerable);
            exports.toString = Object.prototype.toString.call.bind(Object.prototype.toString);
            exports.ObjectAssign = Object.assign;
            exports.ObjectCreate = Object.create;
            exports.ObjectDefineProperties = Object.defineProperties;
            exports.ObjectDefineProperty = Object.defineProperty;
            exports.ObjectEntries = Object.entries;
            exports.ObjectFreeze = Object.freeze;
            exports.ObjectGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
            exports.ObjectGetOwnPropertyDescriptors = Object.getOwnPropertyDescriptors;
            exports.ObjectGetOwnPropertyNames = Object.getOwnPropertyNames;
            exports.ObjectGetOwnPropertySymbols = Object.getOwnPropertySymbols;
            exports.ObjectGetPrototypeOf = Object.getPrototypeOf;
            exports.ObjectIs = Object.is;
            exports.isExtensible = Object.isExtensible;
            exports.isFrozen = Object.isFrozen;
            exports.isSealed = Object.isSealed;
            exports.ObjectKeys = Object.keys;
            exports.ObjectPreventExtensions = Object.preventExtensions;
            exports.ObjectSeal = Object.seal;
            exports.ObjectSetPrototypeOf = Object.setPrototypeOf;
            exports.ObjectValues = Object.values;
            exports.isArray = Array.isArray;
        },
        {}
    ],
    6: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.join = exports.splice = exports.push = exports.pop = exports.unshift = exports.shift = exports.indexOf = void 0;
            const global_1 = _dereq_('./global');
            const alias_1 = _dereq_('./alias');
            function indexOf(as, a) {
                return a === a ? as.indexOf(a) : as.findIndex(a => a !== a);
            }
            exports.indexOf = indexOf;
            function shift(as, count) {
                if (count < 0)
                    throw new Error('Unexpected negative number');
                return count === global_1.undefined ? [
                    as.shift(),
                    as
                ] : [
                    splice(as, 0, count),
                    as
                ];
            }
            exports.shift = shift;
            function unshift(as, bs) {
                if (alias_1.isArray(as)) {
                    for (let i = as.length - 1; i >= 0; --i) {
                        bs.unshift(as[i]);
                    }
                } else {
                    bs.unshift(...as);
                }
                return bs;
            }
            exports.unshift = unshift;
            function pop(as, count) {
                if (count < 0)
                    throw new Error('Unexpected negative number');
                return count === global_1.undefined ? [
                    as,
                    as.pop()
                ] : [
                    as,
                    splice(as, as.length - count, count)
                ];
            }
            exports.pop = pop;
            function push(as, bs) {
                if (alias_1.isArray(bs)) {
                    for (let i = 0; i < bs.length; ++i) {
                        as.push(bs[i]);
                    }
                } else {
                    as.push(...bs);
                }
                return as;
            }
            exports.push = push;
            function splice(as, index, count, ...inserts) {
                if (count === 0 && inserts.length === 0)
                    return [];
                count = count > as.length ? as.length : count;
                switch (index) {
                case 0:
                    switch (count) {
                    case 0:
                        return [
                            [],
                            unshift(inserts, as)
                        ][0];
                    case 1:
                        return as.length === 0 ? [
                            [],
                            unshift(inserts, as)
                        ][0] : [
                            [as.shift()],
                            unshift(inserts, as)
                        ][0];
                    case global_1.undefined:
                        if (as.length > 1 || arguments.length > 2)
                            break;
                        return as.length === 0 ? [] : splice(as, index, 1);
                    }
                    break;
                case -1:
                case as.length - 1:
                case global_1.Infinity:
                    switch (count) {
                    case 0:
                        return [
                            [],
                            push(as, inserts)
                        ][0];
                    case 1:
                        return as.length === 0 ? [
                            [],
                            push(as, inserts)
                        ][0] : [
                            [as.pop()],
                            push(as, inserts)
                        ][0];
                    case global_1.undefined:
                        if (as.length > 1 || arguments.length > 2)
                            break;
                        return as.length === 0 ? [] : splice(as, index, 1);
                    }
                    break;
                }
                return arguments.length > 2 ? as.splice(index, count, ...inserts) : as.splice(index);
            }
            exports.splice = splice;
            function join(as, sep = '') {
                let acc = '';
                for (let i = 0; i < as.length; ++i) {
                    acc += i === 0 ? as[i] : sep + as[i];
                }
                return acc;
            }
            exports.join = join;
        },
        {
            './alias': 5,
            './global': 12
        }
    ],
    7: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.template = exports.inherit = exports.merge = exports.extend = exports.clone = exports.assign = void 0;
            const global_1 = _dereq_('./global');
            const alias_1 = _dereq_('./alias');
            const type_1 = _dereq_('./type');
            const array_1 = _dereq_('./array');
            exports.assign = template((prop, target, source) => target[prop] = source[prop]);
            exports.clone = template((prop, target, source) => {
                switch (type_1.type(source[prop])) {
                case 'Array':
                    return target[prop] = source[prop].slice();
                case 'Object':
                    switch (type_1.type(target[prop])) {
                    case 'Object':
                        return target[prop] = exports.clone(empty_(source[prop]), source[prop]);
                    default:
                        return target[prop] = source[prop];
                    }
                default:
                    return target[prop] = source[prop];
                }
            });
            exports.extend = template((prop, target, source) => {
                switch (type_1.type(source[prop])) {
                case 'Array':
                    return target[prop] = source[prop].slice();
                case 'Object':
                    switch (type_1.type(target[prop])) {
                    case 'Object':
                        return target[prop] = exports.extend(target[prop], source[prop]);
                    default:
                        return target[prop] = exports.extend(empty_(source[prop]), source[prop]);
                    }
                default:
                    return target[prop] = source[prop];
                }
            });
            exports.merge = template((prop, target, source) => {
                switch (type_1.type(source[prop])) {
                case 'Array':
                    switch (type_1.type(target[prop])) {
                    case 'Array':
                        return target[prop] = array_1.push(target[prop], source[prop]);
                    default:
                        return target[prop] = source[prop].slice();
                    }
                case 'Object':
                    switch (type_1.type(target[prop])) {
                    case 'Object':
                        return target[prop] = exports.merge(target[prop], source[prop]);
                    default:
                        return target[prop] = exports.merge(empty_(source[prop]), source[prop]);
                    }
                default:
                    return target[prop] = source[prop];
                }
            });
            exports.inherit = template((prop, target, source) => {
                switch (type_1.type(source[prop])) {
                case 'Array':
                    return target[prop] = source[prop].slice();
                case 'Object':
                    switch (type_1.type(target[prop])) {
                    case 'Object':
                        return target[prop] = isOwnProperty(target, prop) ? exports.inherit(target[prop], source[prop]) : exports.inherit(alias_1.ObjectCreate(target[prop]), source[prop]);
                    default:
                        return target[prop] = alias_1.ObjectCreate(source[prop]);
                    }
                default:
                    return target[prop] = source[prop];
                }
            });
            const isOwnProperty = '__proto__' in {} ? (o, p) => !('__proto__' in o) || o[p] !== o['__proto__'][p] : alias_1.hasOwnProperty;
            function template(strategy, empty = empty_) {
                return walk;
                function walk(target, ...sources) {
                    let isPrimitiveTarget = type_1.isPrimitive(target);
                    for (const source of sources) {
                        const isPrimitiveSource = type_1.isPrimitive(source);
                        if (isPrimitiveSource) {
                            target = source;
                            isPrimitiveTarget = isPrimitiveSource;
                        } else {
                            if (isPrimitiveTarget) {
                                target = empty(source);
                                isPrimitiveTarget = isPrimitiveSource;
                            }
                            const keys = alias_1.ObjectKeys(source);
                            for (let i = 0; i < keys.length; ++i) {
                                if (keys[i] in {})
                                    continue;
                                void strategy(keys[i], target, source);
                            }
                        }
                    }
                    return target;
                }
            }
            exports.template = template;
            function empty_(source) {
                switch (type_1.type(source)) {
                case 'Array':
                    return [];
                case 'Object':
                    return source instanceof global_1.Object ? {} : alias_1.ObjectCreate(null);
                default:
                    return source;
                }
            }
        },
        {
            './alias': 5,
            './array': 6,
            './global': 12,
            './type': 17
        }
    ],
    8: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.Cache = void 0;
            const global_1 = _dereq_('./global');
            const assign_1 = _dereq_('./assign');
            const array_1 = _dereq_('./array');
            class Cache {
                constructor(capacity, callback = () => global_1.undefined, opts = {}) {
                    this.capacity = capacity;
                    this.callback = callback;
                    this.settings = {
                        ignore: {
                            delete: false,
                            clear: false
                        },
                        data: {
                            stats: [
                                [],
                                []
                            ],
                            entries: []
                        }
                    };
                    this.nullish = false;
                    if (capacity > 0 === false)
                        throw new Error(`Spica: Cache: Cache capacity must be greater than 0.`);
                    assign_1.extend(this.settings, opts);
                    const {stats, entries} = this.settings.data;
                    const LFU = stats[1].slice(0, capacity);
                    const LRU = stats[0].slice(0, capacity - LFU.length);
                    this.stats = {
                        LRU,
                        LFU
                    };
                    this.store = new global_1.Map(entries);
                    if (!opts.data)
                        return;
                    for (const k of array_1.push(stats[1].slice(LFU.length), stats[0].slice(LRU.length))) {
                        this.store.delete(k);
                    }
                    if (this.store.size !== LFU.length + LRU.length)
                        throw new Error(`Spica: Cache: Size of stats and entries is not matched.`);
                    if (![
                            ...LFU,
                            ...LRU
                        ].every(k => this.store.has(k)))
                        throw new Error(`Spica: Cache: Keys of stats and entries is not matched.`);
                }
                put(key, value, log = true) {
                    !this.nullish && value === global_1.undefined ? this.nullish = true : global_1.undefined;
                    const hit = this.store.has(key);
                    if (!log && hit)
                        return this.store.set(key, value), true;
                    if (hit && this.access(key))
                        return this.store.set(key, value), true;
                    const {LRU, LFU} = this.stats;
                    if (LRU.length + LFU.length === this.capacity && LRU.length < LFU.length) {
                        const key = LFU.pop();
                        const val = this.store.get(key);
                        this.store.delete(key);
                        this.callback(key, val);
                    }
                    LRU.unshift(key);
                    this.store.set(key, value);
                    if (LRU.length + LFU.length > this.capacity) {
                        const key = LRU.pop();
                        const val = this.store.get(key);
                        this.store.delete(key);
                        this.callback(key, val);
                    }
                    return false;
                }
                set(key, value, log) {
                    this.put(key, value, log);
                    return value;
                }
                get(key, log = true) {
                    const val = this.store.get(key);
                    if (!log)
                        return val;
                    const hit = val !== global_1.undefined || this.nullish && this.store.has(key);
                    return hit && this.access(key) ? val : global_1.undefined;
                }
                has(key) {
                    return this.store.has(key);
                }
                delete(key) {
                    if (!this.store.has(key))
                        return false;
                    const {LRU, LFU} = this.stats;
                    for (const stat of [
                            LFU,
                            LRU
                        ]) {
                        const index = array_1.indexOf(stat, key);
                        if (index === -1)
                            continue;
                        const val = this.store.get(key);
                        this.store.delete(array_1.splice(stat, index, 1)[0]);
                        if (this.settings.ignore.delete)
                            return true;
                        this.callback(key, val);
                        return true;
                    }
                    return false;
                }
                clear() {
                    const store = this.store;
                    this.store = new global_1.Map();
                    this.stats = {
                        LRU: [],
                        LFU: []
                    };
                    if (this.settings.ignore.clear)
                        return;
                    for (const kv of store) {
                        this.callback(kv[0], kv[1]);
                    }
                }
                get size() {
                    return this.store.size;
                }
                [Symbol.iterator]() {
                    return this.store[Symbol.iterator]();
                }
                export() {
                    return {
                        stats: [
                            this.stats.LRU.slice(),
                            this.stats.LFU.slice()
                        ],
                        entries: [...this]
                    };
                }
                inspect() {
                    const {LRU, LFU} = this.stats;
                    return [
                        LRU.slice(),
                        LFU.slice()
                    ];
                }
                access(key) {
                    return this.accessLFU(key) || this.accessLRU(key);
                }
                accessLRU(key) {
                    const {LRU} = this.stats;
                    const index = array_1.indexOf(LRU, key);
                    if (index === -1)
                        return false;
                    const {LFU} = this.stats;
                    LFU.unshift(array_1.splice(LRU, index, 1)[0]);
                    return true;
                }
                accessLFU(key) {
                    const {LFU} = this.stats;
                    const index = array_1.indexOf(LFU, key);
                    if (index === -1)
                        return false;
                    if (index === 0)
                        return true;
                    LFU.unshift(array_1.splice(LFU, index, 1)[0]);
                    return true;
                }
            }
            exports.Cache = Cache;
        },
        {
            './array': 6,
            './assign': 7,
            './global': 12
        }
    ],
    9: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.MultiMap = void 0;
            const array_1 = _dereq_('../array');
            class MultiMap {
                constructor(entries = [], store = new Map()) {
                    this.store = store;
                    for (const [k, v] of entries) {
                        void this.set(k, v);
                    }
                }
                get(key) {
                    var _a;
                    return (_a = this.store.get(key)) === null || _a === void 0 ? void 0 : _a[0];
                }
                set(key, val) {
                    var _a;
                    ((_a = this.store.get(key)) === null || _a === void 0 ? void 0 : _a.push(val)) || this.store.set(key, [val]);
                    return this;
                }
                has(key) {
                    return this.store.has(key);
                }
                delete(key) {
                    return this.store.delete(key);
                }
                take(key, count) {
                    return array_1.splice(this.store.get(key) || [], 0, count);
                }
                ref(key) {
                    let vs = this.store.get(key);
                    if (vs)
                        return vs;
                    vs = [];
                    this.store.set(key, vs);
                    return vs;
                }
            }
            exports.MultiMap = MultiMap;
        },
        { '../array': 6 }
    ],
    10: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.uncurry = exports.curry = void 0;
            const global_1 = _dereq_('./global');
            const array_1 = _dereq_('./array');
            exports.curry = f => curry_(f, f.length);
            function curry_(f, arity, ...xs) {
                let g;
                return xs.length < arity ? (...ys) => curry_(g = g || xs.length && f.bind(global_1.undefined, ...xs) || f, arity - xs.length, ...ys) : f(...xs);
            }
            exports.uncurry = f => uncurry_(f);
            function uncurry_(f) {
                const arity = f.length;
                return (...xs) => arity === 0 || xs.length < 2 || xs.length <= arity ? f(...xs) : uncurry_(f(...array_1.shift(xs, arity)[0]))(...xs);
            }
        },
        {
            './array': 6,
            './global': 12
        }
    ],
    11: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.flip = void 0;
            function flip(f) {
                const arity = f.length;
                return arity > 1 ? (b, a) => f(a, b) : (b, ...as) => as.length === 0 ? a => f(a)(b) : f(as[0])(b);
            }
            exports.flip = flip;
        },
        {}
    ],
    12: [
        function (_dereq_, module, exports) {
            'use strict';
            const global = void 0 || typeof globalThis !== 'undefined' && globalThis || typeof self !== 'undefined' && self || Function('return this')();
            global.global = global;
            module.exports = global;
        },
        {}
    ],
    13: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.memoize = void 0;
            const global_1 = _dereq_('./global');
            function memoize(f, identify = (...as) => as[0], memory) {
                if (typeof identify === 'object')
                    return memoize(f, global_1.undefined, identify);
                if (memory === global_1.undefined)
                    return memoize(f, identify, new global_1.Map());
                let nullish = false;
                return (...as) => {
                    const b = identify(...as);
                    let z = memory.get(b);
                    if (z !== global_1.undefined || nullish && memory.has(b))
                        return z;
                    z = f(...as);
                    nullish = nullish || z === global_1.undefined;
                    memory.set(b, z);
                    return z;
                };
            }
            exports.memoize = memoize;
        },
        { './global': 12 }
    ],
    14: [
        function (_dereq_, module, exports) {
            'use strict';
            var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
                if (k2 === undefined)
                    k2 = k;
                Object.defineProperty(o, k2, {
                    enumerable: true,
                    get: function () {
                        return m[k];
                    }
                });
            } : function (o, m, k, k2) {
                if (k2 === undefined)
                    k2 = k;
                o[k2] = m[k];
            });
            var __exportStar = this && this.__exportStar || function (m, exports) {
                for (var p in m)
                    if (p !== 'default' && !exports.hasOwnProperty(p))
                        __createBinding(exports, m, p);
            };
            Object.defineProperty(exports, '__esModule', { value: true });
            __exportStar(_dereq_('./collection/multimap'), exports);
        },
        { './collection/multimap': 9 }
    ],
    15: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.noop = void 0;
            function noop() {
                return;
            }
            exports.noop = noop;
        },
        {}
    ],
    16: [
        function (_dereq_, module, exports) {
            'use strict';
            var _a;
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.isPromiseLike = exports.Internal = exports.AtomicPromise = void 0;
            const global_1 = _dereq_('./global');
            const alias_1 = _dereq_('./alias');
            const array_1 = _dereq_('./array');
            const internal = Symbol.for('spica/promise::internal');
            class AtomicPromise {
                constructor(executor) {
                    this[Symbol.toStringTag] = 'Promise';
                    this[_a] = new Internal();
                    try {
                        executor(value => this[internal].resolve(value), reason => this[internal].reject(reason));
                    } catch (reason) {
                        this[internal].reject(reason);
                    }
                }
                static get [Symbol.species]() {
                    return AtomicPromise;
                }
                static all(vs) {
                    return new AtomicPromise((resolve, reject) => {
                        const values = alias_1.isArray(vs) ? vs : [...vs];
                        const results = global_1.Array(values.length);
                        let count = 0;
                        for (let i = 0; i < values.length; ++i) {
                            const value = values[i];
                            if (!isPromiseLike(value)) {
                                results[i] = value;
                                ++count;
                                continue;
                            }
                            if (isAtomicPromiseLike(value)) {
                                const {status} = value[internal];
                                switch (status.state) {
                                case 2:
                                    results[i] = status.result;
                                    ++count;
                                    continue;
                                case 3:
                                    reject(status.result);
                                    i = values.length;
                                    continue;
                                }
                            }
                            value.then(value => {
                                results[i] = value;
                                ++count;
                                count === values.length && resolve(results);
                            }, reason => {
                                reject(reason);
                                i = values.length;
                            });
                        }
                        count === values.length && resolve(results);
                    });
                }
                static race(vs) {
                    return new AtomicPromise((resolve, reject) => {
                        const values = alias_1.isArray(vs) ? vs : [...vs];
                        for (let i = 0; i < values.length; ++i) {
                            const value = values[i];
                            if (!isPromiseLike(value)) {
                                return resolve(value);
                            }
                            if (isAtomicPromiseLike(value)) {
                                const {status} = value[internal];
                                switch (status.state) {
                                case 2:
                                    return resolve(status.result);
                                case 3:
                                    return reject(status.result);
                                }
                            }
                        }
                        let done = false;
                        for (let i = 0; i < values.length; ++i) {
                            const value = values[i];
                            value.then(value => {
                                resolve(value);
                                done = true;
                            }, reason => {
                                reject(reason);
                                done = true;
                            });
                            if (done)
                                return;
                        }
                    });
                }
                static resolve(value) {
                    return new AtomicPromise(resolve => resolve(value));
                }
                static reject(reason) {
                    return new AtomicPromise((_, reject) => reject(reason));
                }
                then(onfulfilled, onrejected) {
                    return new AtomicPromise((resolve, reject) => this[internal].then(onfulfilled, onrejected, resolve, reject));
                }
                catch(onrejected) {
                    return this.then(global_1.undefined, onrejected);
                }
                finally(onfinally) {
                    return this.then(onfinally, onfinally).then(() => this);
                }
            }
            exports.AtomicPromise = AtomicPromise;
            _a = internal;
            class Internal {
                constructor() {
                    this.status = { state: 0 };
                    this.reactable = true;
                    this.fulfillReactions = [];
                    this.rejectReactions = [];
                    this.isHandled = false;
                }
                get isPending() {
                    return this.status.state === 0;
                }
                resolve(value) {
                    if (this.status.state !== 0)
                        return;
                    if (!isPromiseLike(value)) {
                        this.status = {
                            state: 2,
                            result: value
                        };
                        return this.resume();
                    }
                    this.status = {
                        state: 1,
                        result: value
                    };
                    return void value.then(value => {
                        this.status = {
                            state: 2,
                            result: value
                        };
                        this.resume();
                    }, reason => {
                        this.status = {
                            state: 3,
                            result: reason
                        };
                        this.resume();
                    });
                }
                reject(reason) {
                    if (this.status.state !== 0)
                        return;
                    this.status = {
                        state: 3,
                        result: reason
                    };
                    return this.resume();
                }
                then(onfulfilled, onrejected, resolve, reject) {
                    const {status, fulfillReactions, rejectReactions} = this;
                    switch (status.state) {
                    case 2:
                        if (fulfillReactions.length > 0)
                            break;
                        try {
                            return onfulfilled ? resolve(onfulfilled(status.result)) : resolve(status.result);
                        } catch (reason) {
                            return reject(reason);
                        }
                    case 3:
                        if (rejectReactions.length > 0)
                            break;
                        try {
                            return onrejected ? resolve(onrejected(status.result)) : reject(status.result);
                        } catch (reason) {
                            return reject(reason);
                        }
                    }
                    if (status.state !== 3) {
                        fulfillReactions.push(value => {
                            try {
                                onfulfilled ? resolve(onfulfilled(value)) : resolve(value);
                            } catch (reason) {
                                reject(reason);
                            }
                        });
                    }
                    if (status.state !== 2) {
                        rejectReactions.push(reason => {
                            try {
                                onrejected ? resolve(onrejected(reason)) : reject(reason);
                            } catch (reason) {
                                reject(reason);
                            }
                        });
                    }
                    this.resume();
                }
                resume() {
                    if (!this.reactable)
                        return;
                    const {status, fulfillReactions, rejectReactions} = this;
                    switch (status.state) {
                    case 0:
                    case 1:
                        return;
                    case 2:
                        if (this.isHandled && rejectReactions.length > 0) {
                            array_1.splice(rejectReactions, 0);
                        }
                        if (fulfillReactions.length === 0)
                            return;
                        this.isHandled = true;
                        this.react(fulfillReactions, status.result);
                        return;
                    case 3:
                        if (this.isHandled && fulfillReactions.length > 0) {
                            array_1.splice(fulfillReactions, 0);
                        }
                        if (rejectReactions.length === 0)
                            return;
                        this.isHandled = true;
                        this.react(rejectReactions, status.result);
                        return;
                    }
                }
                react(reactions, result) {
                    this.reactable = false;
                    if (reactions.length < 5) {
                        while (reactions.length > 0) {
                            reactions.shift()(result);
                        }
                    } else {
                        for (let i = 0; i < reactions.length; ++i) {
                            reactions[i](result);
                        }
                        array_1.splice(reactions, 0);
                    }
                    this.reactable = true;
                }
            }
            exports.Internal = Internal;
            function isPromiseLike(value) {
                return value !== null && typeof value === 'object' && 'then' in value && typeof value.then === 'function';
            }
            exports.isPromiseLike = isPromiseLike;
            function isAtomicPromiseLike(value) {
                return internal in value;
            }
        },
        {
            './alias': 5,
            './array': 6,
            './global': 12
        }
    ],
    17: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.isPrimitive = exports.isType = exports.type = void 0;
            const toString = Object.prototype.toString.call.bind(Object.prototype.toString);
            function type(value) {
                const t = value == null ? value : typeof value;
                switch (t) {
                case undefined:
                case null:
                    return `${ value }`;
                case 'boolean':
                case 'number':
                case 'bigint':
                case 'string':
                case 'symbol':
                    return t;
                default:
                    return toString(value).slice(8, -1);
                }
            }
            exports.type = type;
            function isType(value, name) {
                switch (name) {
                case 'function':
                    return typeof value === 'function';
                case 'object':
                    return value !== null && typeof value === 'object';
                default:
                    return type(value) === name;
                }
            }
            exports.isType = isType;
            function isPrimitive(value) {
                switch (typeof value) {
                case 'undefined':
                case 'boolean':
                case 'number':
                case 'bigint':
                case 'string':
                case 'symbol':
                    return true;
                default:
                    return value === null;
                }
            }
            exports.isPrimitive = isPrimitive;
        },
        {}
    ],
    18: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.URL = void 0;
            const global_1 = _dereq_('./global');
            const format_1 = _dereq_('./url/domain/format');
            var format_2 = _dereq_('./url/domain/format');
            Object.defineProperty(exports, 'standardize', {
                enumerable: true,
                get: function () {
                    return format_2.standardize;
                }
            });
            class URL {
                constructor(url, base = global_1.location.href) {
                    this.url = new format_1.ReadonlyURL(url, base);
                }
                get reference() {
                    var _a;
                    return this.reference_ = (_a = this.reference_) !== null && _a !== void 0 ? _a : this.url.href;
                }
                get resource() {
                    return this.resource_ = this.resource_ === void 0 ? this.reference.slice(0, this.query === '?' ? this.fragment ? -this.fragment.length - 1 : -1 : -this.fragment.length || this.reference.length) : this.resource_;
                }
                get origin() {
                    var _a;
                    return this.origin_ = (_a = this.origin_) !== null && _a !== void 0 ? _a : this.url.origin;
                }
                get scheme() {
                    var _a;
                    return this.scheme_ = (_a = this.scheme_) !== null && _a !== void 0 ? _a : this.url.protocol.slice(0, -1);
                }
                get protocol() {
                    var _a;
                    return this.protocol_ = (_a = this.protocol_) !== null && _a !== void 0 ? _a : this.reference.slice(0, this.reference.indexOf(':') + 1);
                }
                get host() {
                    var _a;
                    return this.host_ = (_a = this.host_) !== null && _a !== void 0 ? _a : this.url.host;
                }
                get hostname() {
                    var _a;
                    return this.hostname_ = (_a = this.hostname_) !== null && _a !== void 0 ? _a : this.url.hostname;
                }
                get port() {
                    var _a;
                    return this.port_ = (_a = this.port_) !== null && _a !== void 0 ? _a : this.url.port;
                }
                get path() {
                    var _a;
                    return this.path_ = (_a = this.path_) !== null && _a !== void 0 ? _a : `${ this.pathname }${ this.query }`;
                }
                get pathname() {
                    var _a;
                    return this.pathname_ = (_a = this.pathname_) !== null && _a !== void 0 ? _a : this.url.pathname;
                }
                get query() {
                    return this.query_ = this.query_ === void 0 ? this.reference.slice(~(~this.reference.slice(0, -this.fragment.length || this.reference.length).indexOf('?') || ~this.reference.length), -this.fragment.length || this.reference.length) : this.query_;
                }
                get fragment() {
                    return this.fragment_ = this.fragment_ === void 0 ? this.reference.slice(~(~this.reference.indexOf('#') || ~this.reference.length)) : this.fragment_;
                }
            }
            exports.URL = URL;
        },
        {
            './global': 12,
            './url/domain/format': 19
        }
    ],
    19: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.ReadonlyURL = exports._encode = exports.standardize = void 0;
            const global_1 = _dereq_('../../global');
            const alias_1 = _dereq_('../../alias');
            const memoize_1 = _dereq_('../../memoize');
            const cache_1 = _dereq_('../../cache');
            const flip_1 = _dereq_('../../flip');
            const curry_1 = _dereq_('../../curry');
            var Identifier;
            (function (Identifier) {
            }(Identifier || (Identifier = {})));
            function standardize(url, base = global_1.location.href) {
                return encode(normalize(url, base));
            }
            exports.standardize = standardize;
            function encode(url) {
                return url.trim().replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]?|[\uDC00-\uDFFF]/g, str => str.length === 2 ? str : '').replace(/%(?![0-9A-F]{2})|[^%\[\]]+/ig, encodeURI).replace(/\?[^#]+/, query => '?' + query.slice(1).replace(/%[0-9A-F]{2}|[^=&]/ig, str => str.length < 3 ? encodeURIComponent(str) : str)).replace(/%[0-9A-F]{2}/ig, str => str.toUpperCase()).replace(/#.+/, url.slice(url.indexOf('#')).trim());
            }
            exports._encode = encode;
            function normalize(url, base) {
                return new ReadonlyURL(url, base).href;
            }
            let ReadonlyURL = (() => {
                class ReadonlyURL {
                    constructor(url, base) {
                        return ReadonlyURL.new(url, base);
                    }
                }
                ReadonlyURL.new = flip_1.flip(curry_1.uncurry(memoize_1.memoize(base => memoize_1.memoize(url => alias_1.ObjectFreeze(new global_1.global.URL(formatURLForEdge(url, base), base)), new cache_1.Cache(100)), new cache_1.Cache(100))));
                return ReadonlyURL;
            })();
            exports.ReadonlyURL = ReadonlyURL;
            function formatURLForEdge(url, base) {
                return url.trim() || base;
            }
        },
        {
            '../../alias': 5,
            '../../cache': 8,
            '../../curry': 10,
            '../../flip': 11,
            '../../global': 12,
            '../../memoize': 13
        }
    ],
    20: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.uuid = void 0;
            const FORMAT_V4 = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
            const {random} = Math;
            function uuid() {
                let acc = '';
                for (let i = 0; i < FORMAT_V4.length; ++i) {
                    const c = FORMAT_V4[i];
                    if (c === 'x' || c === 'y') {
                        const r = random() * 16 | 0;
                        const v = c == 'x' ? r : r & 3 | 8;
                        acc += v.toString(16);
                    } else {
                        acc += c;
                    }
                }
                return acc;
            }
            exports.uuid = uuid;
        },
        {}
    ],
    21: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            _dereq_('spica/global');
            var builder_1 = _dereq_('./src/dom/builder');
            Object.defineProperty(exports, 'Shadow', {
                enumerable: true,
                get: function () {
                    return builder_1.Shadow;
                }
            });
            Object.defineProperty(exports, 'HTML', {
                enumerable: true,
                get: function () {
                    return builder_1.HTML;
                }
            });
            Object.defineProperty(exports, 'SVG', {
                enumerable: true,
                get: function () {
                    return builder_1.SVG;
                }
            });
            Object.defineProperty(exports, 'API', {
                enumerable: true,
                get: function () {
                    return builder_1.API;
                }
            });
            var proxy_1 = _dereq_('./src/dom/proxy');
            Object.defineProperty(exports, 'proxy', {
                enumerable: true,
                get: function () {
                    return proxy_1.proxy;
                }
            });
            var dom_1 = _dereq_('./src/util/dom');
            Object.defineProperty(exports, 'shadow', {
                enumerable: true,
                get: function () {
                    return dom_1.shadow;
                }
            });
            Object.defineProperty(exports, 'frag', {
                enumerable: true,
                get: function () {
                    return dom_1.frag;
                }
            });
            Object.defineProperty(exports, 'html', {
                enumerable: true,
                get: function () {
                    return dom_1.html;
                }
            });
            Object.defineProperty(exports, 'svg', {
                enumerable: true,
                get: function () {
                    return dom_1.svg;
                }
            });
            Object.defineProperty(exports, 'text', {
                enumerable: true,
                get: function () {
                    return dom_1.text;
                }
            });
            Object.defineProperty(exports, 'element', {
                enumerable: true,
                get: function () {
                    return dom_1.element;
                }
            });
            Object.defineProperty(exports, 'define', {
                enumerable: true,
                get: function () {
                    return dom_1.define;
                }
            });
            var listener_1 = _dereq_('./src/util/listener');
            Object.defineProperty(exports, 'listen', {
                enumerable: true,
                get: function () {
                    return listener_1.listen;
                }
            });
            Object.defineProperty(exports, 'once', {
                enumerable: true,
                get: function () {
                    return listener_1.once;
                }
            });
            Object.defineProperty(exports, 'wait', {
                enumerable: true,
                get: function () {
                    return listener_1.wait;
                }
            });
            Object.defineProperty(exports, 'delegate', {
                enumerable: true,
                get: function () {
                    return listener_1.delegate;
                }
            });
            Object.defineProperty(exports, 'bind', {
                enumerable: true,
                get: function () {
                    return listener_1.bind;
                }
            });
            Object.defineProperty(exports, 'currentTarget', {
                enumerable: true,
                get: function () {
                    return listener_1.currentTarget;
                }
            });
            var query_1 = _dereq_('./src/util/query');
            Object.defineProperty(exports, 'apply', {
                enumerable: true,
                get: function () {
                    return query_1.apply;
                }
            });
        },
        {
            './src/dom/builder': 22,
            './src/dom/proxy': 24,
            './src/util/dom': 25,
            './src/util/listener': 26,
            './src/util/query': 27,
            'spica/global': 12
        }
    ],
    22: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.SVG = exports.HTML = exports.Shadow = exports.API = void 0;
            const global_1 = _dereq_('spica/global');
            const alias_1 = _dereq_('spica/alias');
            const proxy_1 = _dereq_('./proxy');
            const dom_1 = _dereq_('../util/dom');
            function API(baseFactory, formatter = el => el) {
                return new Proxy(() => global_1.undefined, handle(baseFactory, formatter));
            }
            exports.API = API;
            exports.Shadow = API(dom_1.html, dom_1.shadow);
            exports.HTML = API(dom_1.html);
            exports.SVG = API(dom_1.svg);
            function handle(baseFactory, formatter) {
                return {
                    apply(target, _, [prop, ...args]) {
                        return this.get(target, prop, target)(...args);
                    },
                    get: (target, prop) => target[prop] || prop in target || typeof prop !== 'string' ? target[prop] : target[prop] = builder(prop, baseFactory)
                };
                function builder(tag, baseFactory) {
                    return function build(attrs, children, factory) {
                        if (typeof attrs === 'function')
                            return build(global_1.undefined, global_1.undefined, attrs);
                        if (typeof children === 'function')
                            return build(attrs, global_1.undefined, children);
                        if (attrs !== global_1.undefined && isChildren(attrs))
                            return build(global_1.undefined, attrs, factory);
                        const node = formatter(elem(factory || defaultFactory, attrs, children));
                        return node.nodeType === 1 ? new proxy_1.Elem(node, children) : new proxy_1.Elem(node.host, children, node);
                    };
                    function isChildren(children) {
                        return typeof children !== 'object' || alias_1.ObjectValues(children).slice(-1).every(val => typeof val === 'object');
                    }
                    function elem(factory, attrs, children) {
                        const el = factory(baseFactory, tag, attrs || {}, children);
                        if (tag !== el.tagName.toLowerCase())
                            throw new Error(`TypedDOM: Expected tag name is "${ tag }" but actually "${ el.tagName.toLowerCase() }".`);
                        if (factory !== defaultFactory) {
                            if (attrs)
                                for (const name of alias_1.ObjectKeys(attrs)) {
                                    const value = attrs[name];
                                    if (typeof value !== 'function')
                                        continue;
                                    el.removeEventListener(name, value);
                                }
                            dom_1.define(el, attrs);
                        }
                        return el;
                    }
                    function defaultFactory(factory, tag, attrs) {
                        return factory(tag, attrs);
                    }
                }
            }
        },
        {
            '../util/dom': 25,
            './proxy': 24,
            'spica/alias': 5,
            'spica/global': 12
        }
    ],
    23: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.uid = void 0;
            const uuid_1 = _dereq_('spica/uuid');
            const id = uuid_1.uuid().split('-').pop();
            let counter = 0;
            function uid() {
                return `id-${ id }-${ ++counter }`;
            }
            exports.uid = uid;
        },
        { 'spica/uuid': 20 }
    ],
    24: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.Elem = exports.proxy = void 0;
            const global_1 = _dereq_('spica/global');
            const alias_1 = _dereq_('spica/alias');
            const identity_1 = _dereq_('./identity');
            const dom_1 = _dereq_('../util/dom');
            const array_1 = _dereq_('spica/array');
            const proxies = new global_1.WeakMap();
            function proxy(el) {
                const proxy = proxies.get(el);
                if (proxy)
                    return proxy;
                throw new Error(`TypedDOM: This element has no proxy.`);
            }
            exports.proxy = proxy;
            const tag = Symbol.for('typed-dom/tag');
            class Elem {
                constructor(element, children_, container = element) {
                    this.element = element;
                    this.children_ = children_;
                    this.container = container;
                    this.id_ = '';
                    this.query_ = '';
                    this.isPartialUpdate = false;
                    this.isInit = true;
                    switch (true) {
                    case children_ === global_1.undefined:
                        this.type = 0;
                        break;
                    case typeof children_ === 'string':
                        this.type = 1;
                        break;
                    case alias_1.isArray(children_):
                        this.type = 2;
                        break;
                    case children_ && typeof children_ === 'object':
                        this.type = 3;
                        break;
                    default:
                        throw new Error(`TypedDOM: Invalid type children.`);
                    }
                    throwErrorIfNotUsable(this);
                    proxies.set(this.element, this);
                    switch (this.type) {
                    case 0:
                        this.isInit = false;
                        return;
                    case 1:
                        dom_1.define(this.container, []);
                        this.children_ = this.container.appendChild(dom_1.text(''));
                        this.children = children_;
                        this.isInit = false;
                        return;
                    case 2:
                        dom_1.define(this.container, []);
                        this.children_ = [];
                        this.children = children_;
                        this.isInit = false;
                        return;
                    case 3:
                        dom_1.define(this.container, []);
                        this.children_ = this.observe({ ...children_ });
                        this.children = children_;
                        this.isInit = false;
                        return;
                    default:
                        throw new Error(`TypedDOM: Unreachable code.`);
                    }
                }
                get id() {
                    if (this.id_)
                        return this.id_;
                    this.id_ = this.element.id.trim();
                    if (this.id_)
                        return this.id_;
                    this.id_ = identity_1.uid();
                    this.element.classList.add(this.id_);
                    return this.id_;
                }
                get query() {
                    if (this.query_)
                        return this.query_;
                    switch (true) {
                    case this.element !== this.container:
                        return this.query_ = ':host';
                    case this.id === this.element.id.trim():
                        return this.query_ = `#${ this.id }`;
                    default:
                        return this.query_ = `.${ this.id }`;
                    }
                }
                observe(children) {
                    const descs = {};
                    for (const name of alias_1.ObjectKeys(children)) {
                        if (name in {})
                            continue;
                        let child = children[name];
                        throwErrorIfNotUsable(child);
                        this.container.appendChild(child.element);
                        descs[name] = {
                            configurable: true,
                            enumerable: true,
                            get: () => {
                                return child;
                            },
                            set: newChild => {
                                const oldChild = child;
                                if (newChild === oldChild)
                                    return;
                                if (this.isPartialUpdate) {
                                    child = newChild;
                                    if (newChild.element.parentNode === oldChild.element.parentNode) {
                                        const ref = newChild.element.nextSibling !== oldChild.element ? newChild.element.nextSibling : oldChild.element.nextSibling;
                                        this.container.replaceChild(newChild.element, oldChild.element);
                                        this.container.insertBefore(oldChild.element, ref);
                                    } else {
                                        this.container.insertBefore(newChild.element, oldChild.element);
                                        this.container.removeChild(oldChild.element);
                                    }
                                } else {
                                    this.children = {
                                        ...this.children_,
                                        [name]: newChild
                                    };
                                }
                            }
                        };
                    }
                    return alias_1.ObjectDefineProperties(children, descs);
                }
                scope(child) {
                    const style = child.element;
                    switch (false) {
                    case 'type' in style:
                    case 'media' in style:
                    case style.tagName === 'STYLE':
                        return;
                    }
                    const target = /(^|[,}])(\s*)\$scope(?![\w-])(?=[^;{}]*{)/g;
                    const html = style.innerHTML;
                    if (html.search(target) === -1)
                        return;
                    const query = this.query;
                    if (!/^[:#.][\w-]+$/.test(query))
                        return;
                    style.innerHTML = html.replace(target, (_, frag, space) => `${ frag }${ space }${ query }`);
                    if (!style.firstElementChild)
                        return;
                    for (let es = style.children, i = 0, len = es.length; i < len; ++i) {
                        es[0].remove();
                    }
                }
                get children() {
                    switch (this.type) {
                    case 1:
                        if (this.children_.parentNode !== this.container) {
                            this.children_ = global_1.undefined;
                            for (let ns = this.container.childNodes, i = 0, len = ns.length; i < len; ++i) {
                                const node = ns[i];
                                if ('wholeText' in node === false)
                                    continue;
                                this.children_ = node;
                                break;
                            }
                        }
                        return this.children_.data;
                    default:
                        return this.children_;
                    }
                }
                set children(children) {
                    const removedChildren = [];
                    const addedChildren = [];
                    let isChanged = false;
                    switch (this.type) {
                    case 0:
                        return;
                    case 1: {
                            if (!this.isInit && children === this.children)
                                return;
                            const targetChildren = this.children_;
                            const oldText = targetChildren.data;
                            const newText = children;
                            targetChildren.data = newText;
                            if (newText === oldText)
                                return;
                            this.element.dispatchEvent(new global_1.Event('change', {
                                bubbles: false,
                                cancelable: true
                            }));
                            return;
                        }
                    case 2: {
                            const sourceChildren = children;
                            const targetChildren = [];
                            this.children_ = targetChildren;
                            const nodeChildren = this.container.children;
                            for (let i = 0; i < sourceChildren.length; ++i) {
                                const newChild = sourceChildren[i];
                                const el = nodeChildren[i];
                                if (newChild.element.parentNode !== this.container) {
                                    throwErrorIfNotUsable(newChild);
                                }
                                if (newChild.element !== el) {
                                    if (newChild.element.parentNode !== this.container) {
                                        this.scope(newChild);
                                        addedChildren.push(newChild);
                                    }
                                    this.container.insertBefore(newChild.element, el);
                                    isChanged = true;
                                }
                                targetChildren.push(newChild);
                            }
                            for (let i = nodeChildren.length; sourceChildren.length < i--;) {
                                const el = nodeChildren[sourceChildren.length];
                                if (!proxies.has(el))
                                    continue;
                                removedChildren.push(proxy(this.container.removeChild(el)));
                                isChanged = true;
                            }
                            break;
                        }
                    case 3: {
                            const sourceChildren = children;
                            const targetChildren = this.children_;
                            for (const name of alias_1.ObjectKeys(targetChildren)) {
                                const oldChild = targetChildren[name];
                                const newChild = sourceChildren[name];
                                if (!this.isInit && newChild === oldChild)
                                    continue;
                                if (newChild.element.parentNode !== this.container) {
                                    throwErrorIfNotUsable(newChild);
                                }
                                if (this.isInit || newChild !== oldChild && newChild.element.parentNode !== oldChild.element.parentNode) {
                                    this.scope(newChild);
                                    addedChildren.push(newChild);
                                    if (!this.isInit) {
                                        let i = 0;
                                        i = removedChildren.lastIndexOf(newChild);
                                        i > -1 && array_1.splice(removedChildren, i, 1);
                                        removedChildren.push(oldChild);
                                        i = addedChildren.lastIndexOf(oldChild);
                                        i > -1 && array_1.splice(addedChildren, i, 1);
                                    }
                                }
                                this.isPartialUpdate = true;
                                targetChildren[name] = sourceChildren[name];
                                this.isPartialUpdate = false;
                                isChanged = true;
                            }
                            break;
                        }
                    }
                    if (removedChildren.length) {
                        const ev = new global_1.Event('disconnect', {
                            bubbles: false,
                            cancelable: true
                        });
                        for (const {element} of removedChildren) {
                            element.dispatchEvent(ev);
                        }
                    }
                    if (addedChildren.length) {
                        const ev = new global_1.Event('connect', {
                            bubbles: false,
                            cancelable: true
                        });
                        for (const {element} of addedChildren) {
                            element.dispatchEvent(ev);
                        }
                    }
                    if (isChanged) {
                        this.element.dispatchEvent(new global_1.Event('change', {
                            bubbles: false,
                            cancelable: true
                        }));
                    }
                }
            }
            exports.Elem = Elem;
            function throwErrorIfNotUsable({element}) {
                if (!element.parentElement || !proxies.has(element.parentElement))
                    return;
                throw new Error(`TypedDOM: Typed DOM children must not be used to another typed DOM.`);
            }
        },
        {
            '../util/dom': 25,
            './identity': 23,
            'spica/alias': 5,
            'spica/array': 6,
            'spica/global': 12
        }
    ],
    25: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.define = exports.element = exports.text = exports.svg = exports.html = exports.frag = exports.shadow = void 0;
            const global_1 = _dereq_('spica/global');
            const alias_1 = _dereq_('spica/alias');
            const memoize_1 = _dereq_('spica/memoize');
            var caches;
            (function (caches) {
                caches.shadows = new WeakMap();
                caches.fragment = global_1.document.createDocumentFragment();
            }(caches || (caches = {})));
            function shadow(el, children, opts) {
                if (typeof el === 'string')
                    return shadow(exports.html(el), children, opts);
                if (children && !isChildren(children))
                    return shadow(el, global_1.undefined, children);
                const root = opts === global_1.undefined ? el.shadowRoot || caches.shadows.get(el) : opts.mode === 'open' ? el.shadowRoot || global_1.undefined : caches.shadows.get(el);
                return defineChildren(!opts || opts.mode === 'open' ? root || el.attachShadow(opts || { mode: 'open' }) : root || caches.shadows.set(el, el.attachShadow(opts)).get(el), !root && children == global_1.undefined ? el.childNodes : children);
            }
            exports.shadow = shadow;
            function frag(children) {
                return defineChildren(caches.fragment.cloneNode(true), children);
            }
            exports.frag = frag;
            exports.html = element(global_1.document, 'HTML');
            exports.svg = element(global_1.document, 'SVG');
            function text(source) {
                return global_1.document.createTextNode(source);
            }
            exports.text = text;
            function element(context, ns) {
                const cache = memoize_1.memoize(elem, (_, ns, tag) => `${ ns }:${ tag }`);
                return element;
                function element(tag, attrs, children) {
                    const el = tag.includes('-') ? elem(context, ns, tag) : cache(context, ns, tag).cloneNode(true);
                    return isChildren(attrs) ? defineChildren(el, attrs) : defineChildren(defineAttrs(el, attrs), children);
                }
            }
            exports.element = element;
            function elem(context, ns, tag) {
                if (!('createElement' in context))
                    throw new Error(`TypedDOM: Scoped custom elements are not supported on this browser.`);
                switch (ns) {
                case 'HTML':
                    return context.createElement(tag);
                case 'SVG':
                    return context.createElementNS('http://www.w3.org/2000/svg', tag);
                }
            }
            function define(node, attrs, children) {
                return isChildren(attrs) ? defineChildren(node, attrs) : defineChildren(defineAttrs(node, attrs), children);
            }
            exports.define = define;
            function defineAttrs(el, attrs) {
                if (!attrs)
                    return el;
                for (const name of alias_1.ObjectKeys(attrs)) {
                    const value = attrs[name];
                    switch (typeof value) {
                    case 'string':
                        el.setAttribute(name, value);
                        continue;
                    case 'function':
                        if (name.length < 3)
                            throw new Error(`TypedDOM: Attribute names for event listeners must have an event name but got "${ name }".`);
                        if (name.slice(0, 2) !== 'on')
                            throw new Error(`TypedDOM: Attribute names for event listeners must start with "on" but got "${ name }".`);
                        el.addEventListener(name.slice(2), value, {
                            passive: [
                                'wheel',
                                'mousewheel',
                                'touchstart',
                                'touchmove'
                            ].includes(name.slice(2))
                        });
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
                switch (typeof children) {
                case 'undefined':
                    return node;
                case 'string':
                    return defineChildren(node, [children]);
                }
                if (!alias_1.isArray(children)) {
                    if (!('length' in children))
                        return defineChildren(node, [...children]);
                    const ns = [];
                    for (let i = 0, len = children.length; i < len; ++i) {
                        ns.push(children[i]);
                    }
                    return defineChildren(node, ns);
                }
                const targetNodes = node.firstChild ? node.childNodes : [];
                let targetLength = targetNodes.length;
                if (targetLength === 0) {
                    node.append(...children);
                    return node;
                }
                let count = 0;
                I:
                    for (let i = 0; i < children.length; ++i) {
                        if (count === targetLength) {
                            node.append(...children.slice(i));
                            return node;
                        }
                        const newChild = children[i];
                        if (typeof newChild === 'object' && newChild.nodeType === 11) {
                            const sourceLength = newChild.childNodes.length;
                            node.insertBefore(newChild, targetNodes[count] || null);
                            count += sourceLength;
                            targetLength += sourceLength;
                            continue;
                        }
                        ++count;
                        while (targetLength > children.length) {
                            const oldChild = targetNodes[count - 1];
                            if (equal(oldChild, newChild))
                                continue I;
                            oldChild.remove();
                            --targetLength;
                        }
                        const oldChild = targetNodes[count - 1];
                        if (equal(oldChild, newChild))
                            continue;
                        if (targetLength < children.length - i + count) {
                            node.insertBefore(typeof newChild === 'string' ? text(newChild) : newChild, oldChild);
                            ++targetLength;
                        } else {
                            node.replaceChild(typeof newChild === 'string' ? text(newChild) : newChild, oldChild);
                        }
                    }
                while (count < targetLength) {
                    targetNodes[count].remove();
                    --targetLength;
                }
                return node;
            }
            function isChildren(o) {
                return !!(o === null || o === void 0 ? void 0 : o[global_1.Symbol.iterator]);
            }
            function equal(node, data) {
                return typeof data === 'string' ? 'wholeText' in node && node.data === data : node === data;
            }
        },
        {
            'spica/alias': 5,
            'spica/global': 12,
            'spica/memoize': 13
        }
    ],
    26: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.bind = exports.delegate = exports.wait = exports.once = exports.listen = exports.currentTarget = void 0;
            const global_1 = _dereq_('spica/global');
            const promise_1 = _dereq_('spica/promise');
            const noop_1 = _dereq_('spica/noop');
            exports.currentTarget = Symbol.for('currentTarget');
            function listen(target, a, b, c = false, d = {}) {
                return typeof b === 'string' ? delegate(target, a, b, c, d) : bind(target, a, b, c);
            }
            exports.listen = listen;
            function once(target, a, b, c = false, d = {}) {
                return typeof b === 'string' ? delegate(target, a, b, c, {
                    ...typeof d === 'boolean' ? { capture: d } : d,
                    once: true
                }) : bind(target, a, b, {
                    ...typeof c === 'boolean' ? { capture: c } : c,
                    once: true
                });
            }
            exports.once = once;
            function wait(target, a, b = false, c = {}) {
                return new promise_1.AtomicPromise(resolve => typeof b === 'string' ? once(target, a, b, resolve, c) : once(target, a, resolve, b));
            }
            exports.wait = wait;
            function delegate(target, selector, type, listener, option = {}) {
                let unbind = noop_1.noop;
                return bind(target, type, ev => {
                    var _a, _b;
                    unbind();
                    const cx = ev.target.shadowRoot ? (_a = ev.composedPath()[0]) === null || _a === void 0 ? void 0 : _a.closest(selector) : (_b = ev.target) === null || _b === void 0 ? void 0 : _b.closest(selector);
                    return cx ? unbind = once(cx, type, listener, option) : global_1.undefined, ev.returnValue;
                }, {
                    ...option,
                    capture: true
                });
            }
            exports.delegate = delegate;
            function bind(target, type, listener, option = false) {
                target.addEventListener(type, handler, option);
                let unbind = () => void target.removeEventListener(type, handler, option);
                return () => void (unbind = unbind() || noop_1.noop);
                function handler(ev) {
                    return exports.currentTarget in ev && !ev[exports.currentTarget] ? global_1.undefined : ev[exports.currentTarget] = ev.currentTarget, listener(ev);
                }
            }
            exports.bind = bind;
        },
        {
            'spica/global': 12,
            'spica/noop': 15,
            'spica/promise': 16
        }
    ],
    27: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.apply = void 0;
            const dom_1 = _dereq_('./dom');
            function apply(node, selector, attrs) {
                const ns = node.querySelectorAll(selector);
                for (let i = 0, len = ns.length; i < len; ++i) {
                    dom_1.define(ns[i], attrs);
                }
                return ns;
            }
            exports.apply = apply;
        },
        { './dom': 25 }
    ],
    28: [
        function (_dereq_, module, exports) {
            'use strict';
            var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
                if (k2 === undefined)
                    k2 = k;
                Object.defineProperty(o, k2, {
                    enumerable: true,
                    get: function () {
                        return m[k];
                    }
                });
            } : function (o, m, k, k2) {
                if (k2 === undefined)
                    k2 = k;
                o[k2] = m[k];
            });
            var __exportStar = this && this.__exportStar || function (m, exports) {
                for (var p in m)
                    if (p !== 'default' && !exports.hasOwnProperty(p))
                        __createBinding(exports, m, p);
            };
            Object.defineProperty(exports, '__esModule', { value: true });
            var parser_1 = _dereq_('./combinator/data/parser');
            Object.defineProperty(exports, 'eval', {
                enumerable: true,
                get: function () {
                    return parser_1.eval;
                }
            });
            Object.defineProperty(exports, 'exec', {
                enumerable: true,
                get: function () {
                    return parser_1.exec;
                }
            });
            __exportStar(_dereq_('./combinator/data/parser/union'), exports);
            __exportStar(_dereq_('./combinator/data/parser/sequence'), exports);
            __exportStar(_dereq_('./combinator/data/parser/subsequence'), exports);
            __exportStar(_dereq_('./combinator/data/parser/inits'), exports);
            __exportStar(_dereq_('./combinator/data/parser/tails'), exports);
            __exportStar(_dereq_('./combinator/data/parser/some'), exports);
            __exportStar(_dereq_('./combinator/control/constraint/block'), exports);
            __exportStar(_dereq_('./combinator/control/constraint/line'), exports);
            __exportStar(_dereq_('./combinator/control/constraint/scope'), exports);
            __exportStar(_dereq_('./combinator/control/constraint/contract'), exports);
            __exportStar(_dereq_('./combinator/control/constraint/context'), exports);
            __exportStar(_dereq_('./combinator/control/constraint/resource'), exports);
            __exportStar(_dereq_('./combinator/control/monad/fmap'), exports);
            __exportStar(_dereq_('./combinator/control/monad/bind'), exports);
            __exportStar(_dereq_('./combinator/control/manipulation/surround'), exports);
            __exportStar(_dereq_('./combinator/control/manipulation/match'), exports);
            __exportStar(_dereq_('./combinator/control/manipulation/convert'), exports);
            __exportStar(_dereq_('./combinator/control/manipulation/indent'), exports);
            __exportStar(_dereq_('./combinator/control/manipulation/fence'), exports);
            __exportStar(_dereq_('./combinator/control/manipulation/trim'), exports);
            __exportStar(_dereq_('./combinator/control/manipulation/lazy'), exports);
            __exportStar(_dereq_('./combinator/control/manipulation/recovery'), exports);
        },
        {
            './combinator/control/constraint/block': 29,
            './combinator/control/constraint/context': 30,
            './combinator/control/constraint/contract': 31,
            './combinator/control/constraint/line': 32,
            './combinator/control/constraint/resource': 33,
            './combinator/control/constraint/scope': 34,
            './combinator/control/manipulation/convert': 35,
            './combinator/control/manipulation/fence': 36,
            './combinator/control/manipulation/indent': 37,
            './combinator/control/manipulation/lazy': 38,
            './combinator/control/manipulation/match': 39,
            './combinator/control/manipulation/recovery': 40,
            './combinator/control/manipulation/surround': 41,
            './combinator/control/manipulation/trim': 42,
            './combinator/control/monad/bind': 43,
            './combinator/control/monad/fmap': 44,
            './combinator/data/parser': 45,
            './combinator/data/parser/inits': 46,
            './combinator/data/parser/sequence': 47,
            './combinator/data/parser/some': 48,
            './combinator/data/parser/subsequence': 49,
            './combinator/data/parser/tails': 50,
            './combinator/data/parser/union': 51
        }
    ],
    29: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.block = void 0;
            const parser_1 = _dereq_('../../data/parser');
            const line_1 = _dereq_('./line');
            function block(parser, separation = true) {
                return (source, context) => {
                    if (source === '')
                        return;
                    const result = parser(source, context);
                    if (!result)
                        return;
                    const rest = parser_1.exec(result);
                    if (separation && !line_1.isEmpty(line_1.firstline(rest)))
                        return;
                    return rest === '' || source[source.length - rest.length - 1] === '\n' ? result : void 0;
                };
            }
            exports.block = block;
        },
        {
            '../../data/parser': 45,
            './line': 32
        }
    ],
    30: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.context = exports.update = exports.guard = void 0;
            const global_1 = _dereq_('spica/global');
            const alias_1 = _dereq_('spica/alias');
            const assign_1 = _dereq_('spica/assign');
            const type_1 = _dereq_('spica/type');
            const memoize_1 = _dereq_('spica/memoize');
            function guard(f, parser) {
                return (source, context) => f(context) ? parser(source, context) : void 0;
            }
            exports.guard = guard;
            function update(base, parser) {
                return (source, context) => parser(source, inherit(alias_1.ObjectCreate(context), base));
            }
            exports.update = update;
            function context(base, parser) {
                const inherit_ = memoize_1.memoize(context => inherit(alias_1.ObjectCreate(context), base), new global_1.WeakMap());
                return (source, context) => parser(source, inherit_(context));
            }
            exports.context = context;
            const inherit = assign_1.template((prop, target, source) => {
                switch (prop) {
                case 'resources':
                    if (prop in target)
                        return;
                    return target[prop] = alias_1.ObjectCreate(source[prop]);
                }
                switch (type_1.type(source[prop])) {
                case 'Object':
                    switch (type_1.type(target[prop])) {
                    case 'Object':
                        return target[prop] = inherit(alias_1.ObjectCreate(target[prop]), source[prop]);
                    default:
                        return target[prop] = alias_1.ObjectCreate(source[prop]);
                    }
                default:
                    return target[prop] = type_1.isPrimitive(source[prop]) ? source[prop] : alias_1.ObjectCreate(source[prop]);
                }
            });
        },
        {
            'spica/alias': 5,
            'spica/assign': 7,
            'spica/global': 12,
            'spica/memoize': 13,
            'spica/type': 17
        }
    ],
    31: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.validate = void 0;
            const alias_1 = _dereq_('spica/alias');
            const parser_1 = _dereq_('../../data/parser');
            function validate(patterns, parser) {
                if (!alias_1.isArray(patterns))
                    return validate([patterns], parser);
                const matchers = patterns.map(pattern => typeof pattern === 'string' ? source => source.slice(0, pattern.length) === pattern : source => pattern.test(source));
                const match = source => {
                    for (let i = 0, len = matchers.length; i < len; ++i) {
                        if (matchers[i](source))
                            return true;
                    }
                    return false;
                };
                return (source, context) => {
                    if (source === '')
                        return;
                    if (!match(source))
                        return;
                    const result = parser(source, context);
                    if (!result)
                        return;
                    return parser_1.exec(result).length < source.length ? result : void 0;
                };
            }
            exports.validate = validate;
        },
        {
            '../../data/parser': 45,
            'spica/alias': 5
        }
    ],
    32: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.isEmpty = exports.firstline = exports.subline = exports.line = void 0;
            const parser_1 = _dereq_('../../data/parser');
            function line(parser, allowTrailingWhitespace = true) {
                return (source, context) => {
                    if (source === '')
                        return;
                    const fst = firstline(source);
                    const result = parser(fst, context);
                    if (!result)
                        return;
                    return parser_1.exec(result) === '' || allowTrailingWhitespace && isEmpty(parser_1.exec(result)) ? [
                        parser_1.eval(result),
                        source.slice(fst.length)
                    ] : void 0;
                };
            }
            exports.line = line;
            function subline(parser) {
                return (source, context) => {
                    if (source === '')
                        return;
                    const result = parser(source, context);
                    if (!result)
                        return;
                    return source.length - parser_1.exec(result).length <= firstline(source, false).length ? result : void 0;
                };
            }
            exports.subline = subline;
            function firstline(source, keepLinebreak = true) {
                const i = source[0] === '\n' ? 0 : source.indexOf('\n');
                switch (i) {
                case -1:
                    return source;
                case 0:
                    return keepLinebreak ? '\n' : '';
                default:
                    return source.slice(0, keepLinebreak ? i + 1 : i);
                }
            }
            exports.firstline = firstline;
            function isEmpty(line) {
                return line === '' || line === '\n' || line.trim() === '';
            }
            exports.isEmpty = isEmpty;
        },
        { '../../data/parser': 45 }
    ],
    33: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.creator = void 0;
            function creator(cost, parser) {
                if (typeof cost === 'function')
                    return creator(1, cost);
                return (source, context) => {
                    const {resources} = context;
                    if (resources && resources.creation < 0)
                        throw new Error('Too many creations');
                    const result = parser(source, context);
                    if (result && resources) {
                        resources.creation -= cost;
                    }
                    return result;
                };
            }
            exports.creator = creator;
        },
        {}
    ],
    34: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.rewrite = exports.focus = void 0;
            const parser_1 = _dereq_('../../data/parser');
            function focus(scope, parser) {
                const match = typeof scope === 'string' ? source => source.slice(0, scope.length) === scope ? scope : '' : source => {
                    var _a;
                    return ((_a = source.match(scope)) === null || _a === void 0 ? void 0 : _a[0]) || '';
                };
                return (source, context) => {
                    if (source === '')
                        return;
                    const src = match(source);
                    if (src === '')
                        return;
                    const result = parser(src, context);
                    if (!result)
                        return;
                    return parser_1.exec(result).length < src.length ? [
                        parser_1.eval(result),
                        parser_1.exec(result) + source.slice(src.length)
                    ] : void 0;
                };
            }
            exports.focus = focus;
            function rewrite(scope, parser) {
                return (source, context) => {
                    if (source === '')
                        return;
                    const res1 = scope(source, context);
                    if (!res1 || parser_1.exec(res1).length >= source.length)
                        return;
                    const src = source.slice(0, source.length - parser_1.exec(res1).length);
                    const res2 = parser(src, context);
                    if (!res2)
                        return;
                    return parser_1.exec(res2).length < src.length ? [
                        parser_1.eval(res2),
                        parser_1.exec(res2) + parser_1.exec(res1)
                    ] : void 0;
                };
            }
            exports.rewrite = rewrite;
        },
        { '../../data/parser': 45 }
    ],
    35: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.convert = void 0;
            function convert(conv, parser) {
                return (source, context) => {
                    if (source === '')
                        return;
                    source = conv(source);
                    return source === '' ? [
                        [],
                        ''
                    ] : parser(source, context);
                };
            }
            exports.convert = convert;
        },
        {}
    ],
    36: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.fence = void 0;
            const line_1 = _dereq_('../constraint/line');
            const array_1 = _dereq_('spica/array');
            function fence(opener, limit, separation) {
                return source => {
                    if (source === '')
                        return;
                    const matches = source.match(opener);
                    if (!matches)
                        return;
                    const delim = matches[1];
                    if (matches[0].slice(delim.length).includes(delim))
                        return;
                    let rest = source.slice(matches[0].length);
                    let block = '';
                    let closer = '';
                    for (let count = 1, next;; ++count) {
                        if (rest === '')
                            break;
                        const line = next !== null && next !== void 0 ? next : line_1.firstline(rest);
                        next = void 0;
                        if (count > limit + 1 && (!separation || line.trim() === ''))
                            break;
                        if (count <= limit + 1 && line[0] === delim[0] && line.slice(0, delim.length) === delim && line.trim() === delim && (!separation || (next = line_1.firstline(rest.slice(line.length))).trim() === '')) {
                            closer = line.trim();
                            rest = rest.slice(line.length);
                            break;
                        }
                        block += line;
                        rest = rest.slice(line.length);
                    }
                    return [
                        array_1.unshift([
                            block,
                            closer
                        ], matches),
                        rest
                    ];
                };
            }
            exports.fence = fence;
        },
        {
            '../constraint/line': 32,
            'spica/array': 6
        }
    ],
    37: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.indent = void 0;
            const parser_1 = _dereq_('../../data/parser');
            const some_1 = _dereq_('../../data/parser/some');
            const line_1 = _dereq_('../constraint/line');
            const bind_1 = _dereq_('../monad/bind');
            const match_1 = _dereq_('./match');
            const surround_1 = _dereq_('./surround');
            const array_1 = _dereq_('spica/array');
            function indent(parser) {
                return bind_1.bind(match_1.match(/^(?=(([^\S\n])\2*))/, match_1.memoize(([, indent]) => indent, indent => some_1.some(line_1.line(surround_1.open(indent, source => [
                    [line_1.firstline(source, false)],
                    ''
                ]))))), (rs, rest, context) => {
                    const result = parser(array_1.join(rs, '\n'), context);
                    return result && parser_1.exec(result) === '' ? [
                        parser_1.eval(result),
                        rest
                    ] : void 0;
                });
            }
            exports.indent = indent;
        },
        {
            '../../data/parser': 45,
            '../../data/parser/some': 48,
            '../constraint/line': 32,
            '../monad/bind': 43,
            './match': 39,
            './surround': 41,
            'spica/array': 6
        }
    ],
    38: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.lazy = void 0;
            function lazy(builder) {
                let parser;
                return (source, context) => (parser = parser || builder())(source, context);
            }
            exports.lazy = lazy;
        },
        {}
    ],
    39: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.memoize = exports.match = void 0;
            const parser_1 = _dereq_('../../data/parser');
            const memoize_1 = _dereq_('spica/memoize');
            function match(pattern, f) {
                return (source, context) => {
                    if (source === '')
                        return;
                    const param = source.match(pattern);
                    if (!param)
                        return;
                    const rest = source.slice(param[0].length);
                    const result = f(param)(rest, context);
                    if (!result)
                        return;
                    return parser_1.exec(result).length < source.length && parser_1.exec(result).length <= rest.length ? result : void 0;
                };
            }
            exports.match = match;
            function memoize(f, g) {
                const h = memoize_1.memoize(g);
                return a => {
                    const b = f(a);
                    return b.length <= 20 ? h(b) : g(b);
                };
            }
            exports.memoize = memoize;
        },
        {
            '../../data/parser': 45,
            'spica/memoize': 13
        }
    ],
    40: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.recover = void 0;
            function recover(parser, fallback) {
                return (source, context) => {
                    try {
                        return parser(source, context);
                    } catch (reason) {
                        return fallback(source, context, reason);
                    }
                };
            }
            exports.recover = recover;
        },
        {}
    ],
    41: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.clear = exports.close = exports.open = exports.surround = void 0;
            const parser_1 = _dereq_('../../data/parser');
            const fmap_1 = _dereq_('../monad/fmap');
            const array_1 = _dereq_('spica/array');
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
                return (lmr_, context) => {
                    if (lmr_ === '')
                        return;
                    const res1 = opener(lmr_, context);
                    if (!res1)
                        return;
                    const rl = parser_1.eval(res1);
                    const mr_ = parser_1.exec(res1);
                    const res2 = mr_ !== '' ? parser(mr_, context) : void 0;
                    const rm = parser_1.eval(res2);
                    const r_ = parser_1.exec(res2, mr_);
                    if (!rm && !optional)
                        return;
                    const res3 = closer(r_, context);
                    const rr = parser_1.eval(res3);
                    const rest = parser_1.exec(res3, r_);
                    if (rest.length === lmr_.length)
                        return;
                    return rr ? f ? f([
                        rl,
                        rm,
                        rr
                    ], rest, context) : [
                        array_1.push(array_1.unshift(rl, rm || []), rr),
                        rest
                    ] : g ? g([
                        rl,
                        rm
                    ], rest, context) : void 0;
                };
            }
            exports.surround = surround;
            function match(pattern) {
                switch (typeof pattern) {
                case 'string':
                    return source => source.slice(0, pattern.length) === pattern ? [
                        [],
                        source.slice(pattern.length)
                    ] : void 0;
                case 'object':
                    return source => {
                        const m = source.match(pattern);
                        return m ? [
                            [],
                            source.slice(m[0].length)
                        ] : void 0;
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
                return fmap_1.fmap(parser, () => []);
            }
            exports.clear = clear;
        },
        {
            '../../data/parser': 45,
            '../monad/fmap': 44,
            'spica/array': 6
        }
    ],
    42: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.trim = void 0;
            const convert_1 = _dereq_('./convert');
            function trim(parser) {
                return convert_1.convert(source => source.trim(), parser);
            }
            exports.trim = trim;
        },
        { './convert': 35 }
    ],
    43: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.bind = void 0;
            const parser_1 = _dereq_('../../data/parser');
            function bind(parser, f) {
                return (source, context) => {
                    if (source === '')
                        return;
                    const res1 = parser(source, context);
                    if (!res1)
                        return;
                    const res2 = f(parser_1.eval(res1), parser_1.exec(res1), context);
                    if (!res2)
                        return;
                    return parser_1.exec(res2).length <= parser_1.exec(res1).length ? res2 : void 0;
                };
            }
            exports.bind = bind;
        },
        { '../../data/parser': 45 }
    ],
    44: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.fmap = void 0;
            const bind_1 = _dereq_('./bind');
            function fmap(parser, f) {
                return bind_1.bind(parser, (rs, r, context) => [
                    f(rs, r, context),
                    r
                ]);
            }
            exports.fmap = fmap;
        },
        { './bind': 43 }
    ],
    45: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.check = exports.exec = exports.eval = void 0;
            function eval_(result, default_) {
                return result ? result[0] : default_;
            }
            exports.eval = eval_;
            function exec(result, default_ = '') {
                return result ? result[1] : default_;
            }
            exports.exec = exec;
            function check(source, result, mustConsume = true) {
                return true;
            }
            exports.check = check;
        },
        {}
    ],
    46: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.inits = void 0;
            const parser_1 = _dereq_('../parser');
            const array_1 = _dereq_('spica/array');
            function inits(parsers) {
                return (source, context) => {
                    let rest = source;
                    let data;
                    for (let i = 0, len = parsers.length; i < len; ++i) {
                        if (rest === '')
                            break;
                        const result = parsers[i](rest, context);
                        if (!result)
                            break;
                        data = data ? array_1.push(data, parser_1.eval(result)) : parser_1.eval(result);
                        rest = parser_1.exec(result);
                    }
                    return rest.length < source.length ? [
                        data || [],
                        rest
                    ] : void 0;
                };
            }
            exports.inits = inits;
        },
        {
            '../parser': 45,
            'spica/array': 6
        }
    ],
    47: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.sequence = void 0;
            const parser_1 = _dereq_('../parser');
            const array_1 = _dereq_('spica/array');
            function sequence(parsers) {
                return (source, context) => {
                    let rest = source;
                    let data;
                    for (let i = 0, len = parsers.length; i < len; ++i) {
                        if (rest === '')
                            return;
                        const result = parsers[i](rest, context);
                        if (!result)
                            return;
                        data = data ? array_1.push(data, parser_1.eval(result)) : parser_1.eval(result);
                        rest = parser_1.exec(result);
                    }
                    return rest.length < source.length ? [
                        data || [],
                        rest
                    ] : void 0;
                };
            }
            exports.sequence = sequence;
        },
        {
            '../parser': 45,
            'spica/array': 6
        }
    ],
    48: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.some = void 0;
            const parser_1 = _dereq_('../parser');
            const array_1 = _dereq_('spica/array');
            function some(parser, until) {
                const match = typeof until === 'string' && until !== void 0 ? source => source.slice(0, until.length) === until : source => !!until && until.test(source);
                let memory = '';
                return (source, context) => {
                    if (source === memory)
                        return;
                    let rest = source;
                    let data;
                    while (true) {
                        if (rest === '')
                            break;
                        if (match(rest))
                            break;
                        const result = parser(rest, context);
                        if (!result)
                            break;
                        data = data ? array_1.push(data, parser_1.eval(result)) : parser_1.eval(result);
                        rest = parser_1.exec(result);
                    }
                    memory = rest || memory;
                    return rest.length < source.length ? [
                        data || [],
                        rest
                    ] : void 0;
                };
            }
            exports.some = some;
        },
        {
            '../parser': 45,
            'spica/array': 6
        }
    ],
    49: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.subsequence = void 0;
            const union_1 = _dereq_('./union');
            const inits_1 = _dereq_('./inits');
            function subsequence(parsers) {
                switch (parsers.length) {
                case 0:
                case 1:
                    return union_1.union(parsers);
                case 2:
                    return union_1.union([
                        inits_1.inits(parsers),
                        parsers[1]
                    ]);
                default:
                    return subsequence([
                        parsers[0],
                        subsequence(parsers.slice(1))
                    ]);
                }
            }
            exports.subsequence = subsequence;
        },
        {
            './inits': 46,
            './union': 51
        }
    ],
    50: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.tails = void 0;
            const union_1 = _dereq_('./union');
            const sequence_1 = _dereq_('./sequence');
            function tails(parsers) {
                return union_1.union(parsers.map((_, i) => sequence_1.sequence(parsers.slice(i))));
            }
            exports.tails = tails;
        },
        {
            './sequence': 47,
            './union': 51
        }
    ],
    51: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.union = void 0;
            const parser_1 = _dereq_('../parser');
            function union(parsers) {
                switch (parsers.length) {
                case 0:
                    return () => void 0;
                case 1:
                    return parsers[0];
                default:
                    return (source, context) => {
                        for (let i = 0, len = parsers.length; i < len; ++i) {
                            const result = parsers[i](source, context);
                            if (result)
                                return result;
                        }
                    };
                }
            }
            exports.union = union;
        },
        { '../parser': 45 }
    ],
    52: [
        function (_dereq_, module, exports) {
            'use strict';
            var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
                if (k2 === undefined)
                    k2 = k;
                Object.defineProperty(o, k2, {
                    enumerable: true,
                    get: function () {
                        return m[k];
                    }
                });
            } : function (o, m, k, k2) {
                if (k2 === undefined)
                    k2 = k;
                o[k2] = m[k];
            });
            var __exportStar = this && this.__exportStar || function (m, exports) {
                for (var p in m)
                    if (p !== 'default' && !exports.hasOwnProperty(p))
                        __createBinding(exports, m, p);
            };
            Object.defineProperty(exports, '__esModule', { value: true });
            __exportStar(_dereq_('./parser/api'), exports);
        },
        { './parser/api': 53 }
    ],
    53: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var parse_1 = _dereq_('./api/parse');
            Object.defineProperty(exports, 'parse', {
                enumerable: true,
                get: function () {
                    return parse_1.parse;
                }
            });
            var bind_1 = _dereq_('./api/bind');
            Object.defineProperty(exports, 'bind', {
                enumerable: true,
                get: function () {
                    return bind_1.bind;
                }
            });
            var cache_1 = _dereq_('./api/cache');
            Object.defineProperty(exports, 'caches', {
                enumerable: true,
                get: function () {
                    return cache_1.caches;
                }
            });
        },
        {
            './api/bind': 54,
            './api/cache': 55,
            './api/parse': 57
        }
    ],
    54: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.bind = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const segment_1 = _dereq_('../segment');
            const block_1 = _dereq_('../block');
            const normalize_1 = _dereq_('./normalize');
            const figure_1 = _dereq_('../../util/figure');
            const footnote_1 = _dereq_('../../util/footnote');
            const array_1 = _dereq_('spica/array');
            function bind(target, {footnotes}) {
                const pairs = [];
                const adds = [];
                const dels = [];
                const bottom = target.firstChild;
                let revision;
                return function* (source) {
                    var _a;
                    const rev = revision = Symbol();
                    source = normalize_1.normalize(source);
                    const sourceSegments = segment_1.segment(source);
                    const targetSegments = pairs.map(([seg]) => seg);
                    let head = 0;
                    for (; head < targetSegments.length; ++head) {
                        if (targetSegments[head] !== sourceSegments[head])
                            break;
                    }
                    if (adds.length + dels.length === 0 && sourceSegments.length === targetSegments.length && head === sourceSegments.length)
                        return;
                    let last = 0;
                    for (; head + last < targetSegments.length && head + last < sourceSegments.length; ++last) {
                        if (targetSegments[targetSegments.length - last - 1] !== sourceSegments[sourceSegments.length - last - 1])
                            break;
                    }
                    const base = next(head);
                    let index = head;
                    for (; index < sourceSegments.length - last; ++index) {
                        const seg = sourceSegments[index];
                        const es = combinator_1.eval(block_1.block(seg, {}), []);
                        void pairs.splice(index, 0, [
                            seg,
                            es
                        ]);
                        if (es.length === 0)
                            continue;
                        void array_1.push(adds, es.map(el => [
                            el,
                            base
                        ]));
                        while (adds.length > 0) {
                            const [el, base] = adds.shift();
                            void target.insertBefore(el, base);
                            yield el;
                            if (rev !== revision)
                                return yield;
                        }
                    }
                    for (let refuse = array_1.splice(pairs, index, pairs.length - sourceSegments.length), i = 0; i < refuse.length; ++i) {
                        const es = refuse[i][1];
                        if (es.length === 0)
                            continue;
                        void array_1.push(dels, es);
                    }
                    while (adds.length > 0) {
                        const [el, base] = adds.shift();
                        void target.insertBefore(el, base);
                        yield el;
                        if (rev !== revision)
                            return yield;
                    }
                    while (dels.length > 0) {
                        const el = dels.shift();
                        void ((_a = el.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(el));
                        yield el;
                        if (rev !== revision)
                            return yield;
                    }
                    for (const el of footnote_1.footnote(target, footnotes)) {
                        yield el;
                        if (rev !== revision)
                            return yield;
                    }
                    for (const el of figure_1.figure(target, footnotes)) {
                        yield el;
                        if (rev !== revision)
                            return yield;
                    }
                };
                function next(index) {
                    for (let i = index; i < pairs.length; ++i) {
                        const [, es] = pairs[i];
                        if (es.length > 0)
                            return es[0];
                    }
                    return bottom;
                }
            }
            exports.bind = bind;
        },
        {
            '../../combinator': 28,
            '../../util/figure': 141,
            '../../util/footnote': 142,
            '../block': 59,
            '../segment': 116,
            './normalize': 56,
            'spica/array': 6
        }
    ],
    55: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.caches = void 0;
            const math_1 = _dereq_('../inline/math');
            const media_1 = _dereq_('../inline/media');
            exports.caches = {
                math: math_1.cache,
                media: media_1.cache
            };
        },
        {
            '../inline/math': 107,
            '../inline/media': 108
        }
    ],
    56: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.normalize = void 0;
            function normalize(source) {
                return source.replace(/\u0000|[\uD800-\uDBFF][\uDC00-\uDFFF]?|[\uDC00-\uDFFF]/g, str => str.length === 2 ? str : '\uFFFD').replace(/\r\n|[\x00-\x08\x0B-\x1F\x7F]/g, char => {
                    switch (char) {
                    case '\r':
                    case '\x0B':
                    case '\f':
                    case '\r\n':
                        return '\n';
                    default:
                        return '';
                    }
                });
            }
            exports.normalize = normalize;
        },
        {}
    ],
    57: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.parse = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const block_1 = _dereq_('../block');
            const segment_1 = _dereq_('../segment');
            const normalize_1 = _dereq_('./normalize');
            const figure_1 = _dereq_('../../util/figure');
            const footnote_1 = _dereq_('../../util/footnote');
            const typed_dom_1 = _dereq_('typed-dom');
            const array_1 = _dereq_('spica/array');
            function parse(source, opts = {}) {
                var _a;
                const node = typed_dom_1.frag(segment_1.segment(normalize_1.normalize(source)).reduce((acc, seg) => array_1.push(acc, combinator_1.eval(block_1.block(seg, opts.context || {}), [])), []));
                if (opts.test)
                    return node;
                void [...footnote_1.footnote(node, (_a = opts.footnotes) !== null && _a !== void 0 ? _a : {
                        annotation: typed_dom_1.html('ol'),
                        reference: typed_dom_1.html('ol')
                    })];
                void [...figure_1.figure(node)];
                return node;
            }
            exports.parse = parse;
        },
        {
            '../../combinator': 28,
            '../../util/figure': 141,
            '../../util/footnote': 142,
            '../block': 59,
            '../segment': 116,
            './normalize': 56,
            'spica/array': 6,
            'typed-dom': 21
        }
    ],
    58: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.autolink = void 0;
            const combinator_1 = _dereq_('../combinator');
            const inline_1 = _dereq_('./inline');
            const source_1 = _dereq_('./source');
            exports.autolink = combinator_1.lazy(() => combinator_1.union([
                inline_1.autolink,
                source_1.linebreak,
                source_1.unescsource
            ]));
        },
        {
            '../combinator': 28,
            './inline': 79,
            './source': 117
        }
    ],
    59: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.block = void 0;
            const combinator_1 = _dereq_('../combinator');
            const line_1 = _dereq_('./source/line');
            const horizontalrule_1 = _dereq_('./block/horizontalrule');
            const heading_1 = _dereq_('./block/heading');
            const ulist_1 = _dereq_('./block/ulist');
            const olist_1 = _dereq_('./block/olist');
            const ilist_1 = _dereq_('./block/ilist');
            const dlist_1 = _dereq_('./block/dlist');
            const table_1 = _dereq_('./block/table');
            const blockquote_1 = _dereq_('./block/blockquote');
            const codeblock_1 = _dereq_('./block/codeblock');
            const mathblock_1 = _dereq_('./block/mathblock');
            const extension_1 = _dereq_('./block/extension');
            const paragraph_1 = _dereq_('./block/paragraph');
            const locale_1 = _dereq_('./locale');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.block = combinator_1.recover(locale_1.localize(combinator_1.update({ resources: { creation: 100 * 1000 } }, combinator_1.union([
                line_1.emptyline,
                horizontalrule_1.horizontalrule,
                heading_1.heading,
                ulist_1.ulist,
                olist_1.olist,
                ilist_1.ilist,
                dlist_1.dlist,
                table_1.table,
                codeblock_1.codeblock,
                mathblock_1.mathblock,
                extension_1.extension,
                blockquote_1.blockquote,
                paragraph_1.paragraph
            ]))), (_, __, reason) => [
                [typed_dom_1.html('h1', { class: 'invalid' }, reason instanceof Error ? `${ reason.name }: ${ reason.message }` : `Unknown error: ${ reason }`)],
                ''
            ]);
        },
        {
            '../combinator': 28,
            './block/blockquote': 60,
            './block/codeblock': 61,
            './block/dlist': 62,
            './block/extension': 63,
            './block/heading': 68,
            './block/horizontalrule': 69,
            './block/ilist': 70,
            './block/mathblock': 71,
            './block/olist': 72,
            './block/paragraph': 73,
            './block/table': 77,
            './block/ulist': 78,
            './locale': 114,
            './source/line': 120,
            'typed-dom': 21
        }
    ],
    60: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.blockquote = exports.segment = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const util_1 = _dereq_('../util');
            const source_1 = _dereq_('../source');
            const autolink_1 = _dereq_('../autolink');
            const parse_1 = _dereq_('../api/parse');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.segment = combinator_1.block(combinator_1.validate([
                '!',
                '>'
            ], combinator_1.union([combinator_1.validate(/^!?>+(?=[^\S\n]|\n\s*\S)/, combinator_1.some(source_1.contentline))])));
            exports.blockquote = combinator_1.lazy(() => combinator_1.block(combinator_1.creator(10, combinator_1.rewrite(exports.segment, combinator_1.union([
                combinator_1.open(/^(?=>)/, text),
                combinator_1.open(/^!(?=>)/, source)
            ])))));
            const opener = /^(?=>>+(?:$|\s))/;
            const indent = combinator_1.block(combinator_1.open(opener, combinator_1.some(source_1.contentline, /^>(?:$|\s)/)), false);
            function unindent(source) {
                return source.replace(/\n$/, '').replace(/^>(?:$|\s|(?=>+(?:$|\s)))/mg, '');
            }
            const text = combinator_1.lazy(() => combinator_1.fmap(combinator_1.some(combinator_1.union([
                combinator_1.rewrite(indent, combinator_1.convert(unindent, text)),
                combinator_1.rewrite(combinator_1.some(source_1.contentline, opener), combinator_1.convert(unindent, combinator_1.fmap(combinator_1.some(autolink_1.autolink), ns => [typed_dom_1.html('pre', util_1.defrag(ns))])))
            ])), ns => [typed_dom_1.html('blockquote', ns)]));
            const source = combinator_1.lazy(() => combinator_1.fmap(combinator_1.some(combinator_1.union([
                combinator_1.rewrite(indent, combinator_1.convert(unindent, source)),
                combinator_1.rewrite(combinator_1.some(source_1.contentline, opener), combinator_1.convert(unindent, (source, context) => [
                    [util_1.suppress(parse_1.parse(source, {
                            context,
                            footnotes: {
                                annotation: typed_dom_1.html('ol'),
                                reference: typed_dom_1.html('ol')
                            }
                        }))],
                    ''
                ]))
            ])), ns => [typed_dom_1.html('blockquote', ns)]));
        },
        {
            '../../combinator': 28,
            '../api/parse': 57,
            '../autolink': 58,
            '../source': 117,
            '../util': 125,
            'typed-dom': 21
        }
    ],
    61: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.codeblock = exports.segment_ = exports.segment = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const util_1 = _dereq_('../util');
            const source_1 = _dereq_('../source');
            const autolink_1 = _dereq_('../autolink');
            const typed_dom_1 = _dereq_('typed-dom');
            const array_1 = _dereq_('spica/array');
            const opener = /^(`{3,})(?!`)(\S*)([^\n]*)\n?/;
            const language = /^[a-z0-9]+(?:-[a-z][a-z0-9]*)*$/;
            exports.segment = combinator_1.block(combinator_1.validate('```', combinator_1.clear(combinator_1.fence(opener, 300, true))));
            exports.segment_ = combinator_1.block(combinator_1.validate('```', combinator_1.clear(combinator_1.fence(opener, 300, false))), false);
            exports.codeblock = combinator_1.block(combinator_1.validate('```', combinator_1.fmap(combinator_1.fence(opener, 300, true), ([body, closer, opener, delim, lang, param], _, context) => {
                [lang, param] = language.test(lang) ? [
                    lang,
                    param
                ] : [
                    '',
                    lang + param
                ];
                param = param.trim();
                const path = array_1.join(combinator_1.eval(combinator_1.some(source_1.escsource, /^\s/)(param, context), []));
                if (!closer || param !== path)
                    return [typed_dom_1.html('pre', {
                            class: `notranslate invalid`,
                            'data-invalid-syntax': 'codeblock',
                            'data-invalid-type': closer ? 'parameter' : 'closer',
                            'data-invalid-message': closer ? 'Invalid parameter' : `Missing closing delimiter ${ delim }`
                        }, `${ opener }${ body }${ closer }`)];
                const file = path.split('/').pop() || '';
                const ext = file && file.includes('.') && file[0] !== '.' ? file.split('.').pop() : '';
                lang = language.test(lang || ext) ? lang || ext : lang && 'invalid';
                const el = typed_dom_1.html('pre', { class: 'notranslate' }, body.slice(0, -1) || void 0);
                if (lang) {
                    void el.classList.add('code');
                    void el.classList.add(`language-${ lang }`);
                    void el.setAttribute('data-lang', lang);
                } else {
                    void typed_dom_1.define(el, util_1.defrag(combinator_1.eval(combinator_1.some(autolink_1.autolink)(el.textContent, context), [])));
                }
                if (path) {
                    void el.setAttribute('data-file', path);
                }
                return [el];
            })));
        },
        {
            '../../combinator': 28,
            '../autolink': 58,
            '../source': 117,
            '../util': 125,
            'spica/array': 6,
            'typed-dom': 21
        }
    ],
    62: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.dlist = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const util_1 = _dereq_('../util');
            const source_1 = _dereq_('../source');
            const inline_1 = _dereq_('../inline');
            const paragraph_1 = _dereq_('./paragraph');
            const typed_dom_1 = _dereq_('typed-dom');
            const array_1 = _dereq_('spica/array');
            exports.dlist = combinator_1.lazy(() => combinator_1.block(combinator_1.fmap(combinator_1.validate(/^~(?=[^\S\n])/, combinator_1.convert(source => source.replace(paragraph_1.blankline, ''), combinator_1.context({ syntax: { inline: { media: false } } }, combinator_1.some(combinator_1.inits([
                combinator_1.some(term),
                combinator_1.some(desc)
            ]))))), es => [typed_dom_1.html('dl', fillTrailingDescription(es))])));
            const term = combinator_1.line(inline_1.indexee(combinator_1.fmap(combinator_1.open(/^~(?=[^\S\n])/, combinator_1.context({
                syntax: {
                    inline: {
                        annotation: false,
                        reference: false,
                        extension: false,
                        link: false,
                        media: false,
                        autolink: false
                    }
                }
            }, combinator_1.trim(combinator_1.some(combinator_1.union([
                inline_1.indexer,
                inline_1.inline
            ])))), true), ns => [typed_dom_1.html('dt', util_1.defrag(ns))])));
            const desc = combinator_1.block(combinator_1.fmap(combinator_1.open(/^:(?=[^\S\n])|/, combinator_1.rewrite(combinator_1.some(source_1.anyline, /^[~:](?=[^\S\n])/), combinator_1.trim(combinator_1.some(combinator_1.union([inline_1.inline])))), true), ns => [typed_dom_1.html('dd', util_1.defrag(ns))]), false);
            function fillTrailingDescription(es) {
                return es.length > 0 && es[es.length - 1].tagName === 'DT' ? array_1.push(es, [typed_dom_1.html('dd')]) : es;
            }
        },
        {
            '../../combinator': 28,
            '../inline': 79,
            '../source': 117,
            '../util': 125,
            './paragraph': 73,
            'spica/array': 6,
            'typed-dom': 21
        }
    ],
    63: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.extension = exports.segment = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const fig_1 = _dereq_('./extension/fig');
            const figure_1 = _dereq_('./extension/figure');
            const example_1 = _dereq_('./extension/example');
            const placeholder_1 = _dereq_('./extension/placeholder');
            exports.segment = combinator_1.validate([
                '~~~',
                '[$',
                '$'
            ], combinator_1.validate(/^~{3,}|^\[?\$[a-z-]\S+[^\S\n]*\n/, combinator_1.union([
                fig_1.segment,
                figure_1.segment,
                example_1.segment,
                placeholder_1.segment
            ])));
            exports.extension = combinator_1.rewrite(exports.segment, combinator_1.union([
                fig_1.fig,
                figure_1.figure,
                example_1.example,
                placeholder_1.placeholder
            ]));
        },
        {
            '../../combinator': 28,
            './extension/example': 64,
            './extension/fig': 65,
            './extension/figure': 66,
            './extension/placeholder': 67
        }
    ],
    64: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.example = exports.segment_ = exports.segment = void 0;
            const combinator_1 = _dereq_('../../../combinator');
            const util_1 = _dereq_('../../util');
            const parse_1 = _dereq_('../../api/parse');
            const mathblock_1 = _dereq_('../mathblock');
            const typed_dom_1 = _dereq_('typed-dom');
            const opener = /^(~{3,})(?!~)example\/(\S+)([^\n]*)\n?/;
            exports.segment = combinator_1.block(combinator_1.validate('~~~', combinator_1.clear(combinator_1.fence(opener, 100, true))));
            exports.segment_ = combinator_1.block(combinator_1.validate('~~~', combinator_1.clear(combinator_1.fence(opener, 100, false))), false);
            exports.example = combinator_1.block(combinator_1.creator(10, combinator_1.validate('~~~', combinator_1.fmap(combinator_1.fence(opener, 100, true), ([body, closer, opener, delim, type, param], _, context) => {
                if (!closer || param.trim() !== '')
                    return [typed_dom_1.html('pre', {
                            class: `example notranslate invalid`,
                            'data-invalid-syntax': 'example',
                            'data-invalid-type': closer ? 'parameter' : 'closer',
                            'data-invalid-message': closer ? 'Invalid parameter' : `Missing closing delimiter ${ delim }`
                        }, `${ opener }${ body }${ closer }`)];
                switch (type) {
                case 'markdown': {
                        const annotation = typed_dom_1.html('ol');
                        const reference = typed_dom_1.html('ol');
                        const view = parse_1.parse(body.slice(0, -1), {
                            context,
                            footnotes: {
                                annotation,
                                reference
                            }
                        });
                        return [typed_dom_1.html('aside', {
                                class: 'example',
                                'data-type': 'markdown'
                            }, [
                                typed_dom_1.html('pre', body.slice(0, -1)),
                                typed_dom_1.html('div', [util_1.suppress(view)]),
                                util_1.suppress(annotation),
                                util_1.suppress(reference)
                            ])];
                    }
                case 'math':
                    return [typed_dom_1.html('aside', {
                            class: 'example',
                            'data-type': 'math'
                        }, [
                            typed_dom_1.html('pre', body.slice(0, -1)),
                            combinator_1.eval(mathblock_1.mathblock(`$$\n${ body }$$`, context), [])[0]
                        ])];
                default:
                    return [typed_dom_1.html('pre', {
                            class: 'example notranslate invalid',
                            'data-invalid-syntax': 'example',
                            'data-invalid-message': `Invalid example type`
                        }, `${ opener }${ body }${ closer }`)];
                }
            }))));
        },
        {
            '../../../combinator': 28,
            '../../api/parse': 57,
            '../../util': 125,
            '../mathblock': 71,
            'typed-dom': 21
        }
    ],
    65: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.fig = exports.segment = void 0;
            const combinator_1 = _dereq_('../../../combinator');
            const source_1 = _dereq_('../../source');
            const figure_1 = _dereq_('./figure');
            const label_1 = _dereq_('../../inline/extension/label');
            const codeblock_1 = _dereq_('../codeblock');
            const mathblock_1 = _dereq_('../mathblock');
            const example_1 = _dereq_('../extension/example');
            const blockquote_1 = _dereq_('../blockquote');
            exports.segment = combinator_1.block(combinator_1.sequence([
                combinator_1.line(combinator_1.clear(label_1.label)),
                combinator_1.union([
                    codeblock_1.segment,
                    mathblock_1.segment,
                    example_1.segment,
                    blockquote_1.segment,
                    combinator_1.some(source_1.contentline)
                ])
            ]));
            exports.fig = combinator_1.block(combinator_1.rewrite(exports.segment, combinator_1.convert(source => {
                const fence = (/^[^\n]*\n!?>+\s/.test(source) && source.match(/^~{3,}(?=\s*$)/gm) || []).reduce((max, fence) => fence > max ? fence : max, '~~') + '~';
                return `${ fence }figure ${ source }\n\n${ fence }`;
            }, figure_1.figure)));
        },
        {
            '../../../combinator': 28,
            '../../inline/extension/label': 100,
            '../../source': 117,
            '../blockquote': 60,
            '../codeblock': 61,
            '../extension/example': 64,
            '../mathblock': 71,
            './figure': 66
        }
    ],
    66: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.figure = exports.segment = void 0;
            const global_1 = _dereq_('spica/global');
            const combinator_1 = _dereq_('../../../combinator');
            const util_1 = _dereq_('../../util');
            const source_1 = _dereq_('../../source');
            const label_1 = _dereq_('../../inline/extension/label');
            const table_1 = _dereq_('../table');
            const codeblock_1 = _dereq_('../codeblock');
            const mathblock_1 = _dereq_('../mathblock');
            const example_1 = _dereq_('./example');
            const blockquote_1 = _dereq_('../blockquote');
            const paragraph_1 = _dereq_('../paragraph');
            const inline_1 = _dereq_('../../inline');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.segment = combinator_1.block(combinator_1.match(/^(~{3,})figure[^\S\n]+(?=\[?\$[\w-]\S*[^\S\n]*\n(?:[^\n]*\n)*?\1[^\S\n]*(?:$|\n))/, combinator_1.memoize(([, fence]) => fence, (fence, closer = new global_1.RegExp(`^${ fence }[^\\S\\n]*(?:$|\\n)`)) => combinator_1.close(combinator_1.sequence([
                combinator_1.line(combinator_1.clear(label_1.label)),
                combinator_1.inits([
                    combinator_1.union([
                        codeblock_1.segment_,
                        mathblock_1.segment_,
                        example_1.segment_,
                        blockquote_1.segment,
                        combinator_1.some(source_1.contentline, closer)
                    ]),
                    source_1.emptyline,
                    combinator_1.union([
                        source_1.emptyline,
                        combinator_1.some(source_1.contentline, closer)
                    ])
                ])
            ]), closer))));
            exports.figure = combinator_1.block(combinator_1.rewrite(exports.segment, combinator_1.trim(combinator_1.fmap(combinator_1.convert(source => source.slice(source.search(/[[$]/), source.lastIndexOf('\n')), combinator_1.sequence([
                combinator_1.line(label_1.label),
                combinator_1.inits([
                    combinator_1.block(combinator_1.union([
                        table_1.table,
                        codeblock_1.codeblock,
                        mathblock_1.mathblock,
                        example_1.example,
                        blockquote_1.blockquote,
                        combinator_1.line(inline_1.media),
                        combinator_1.line(inline_1.shortmedia)
                    ])),
                    source_1.emptyline,
                    combinator_1.block(combinator_1.convert(source => source.replace(paragraph_1.blankline, ''), combinator_1.context({ syntax: { inline: { media: false } } }, combinator_1.trim(combinator_1.some(inline_1.inline)))))
                ])
            ])), ([label, content, ...caption]) => [typed_dom_1.html('figure', attrs(label.getAttribute('data-label'), content, caption), [
                    typed_dom_1.html('div', { class: 'figcontent' }, [content]),
                    typed_dom_1.html('span', { class: 'figindex' }),
                    typed_dom_1.html('figcaption', util_1.defrag(caption))
                ])]))));
            function attrs(label, content, caption) {
                const group = label.split('-', 1)[0];
                const rebase = /^[^-]+-(?:[0-9]+\.)*0$/.test(label) || void 0;
                const invalid = group !== '$' || rebase ? void 0 : !content.classList.contains('math') || caption.length > 0 || void 0;
                return {
                    'data-label': label,
                    'data-group': group,
                    style: rebase && 'display: none;',
                    class: invalid && 'invalid',
                    'data-invalid-syntax': invalid && 'figure',
                    'data-invalid-type': invalid && 'content',
                    'data-invalid-message': invalid && 'A figure labeled to define a formula number can contain only a math formula and no caption'
                };
            }
        },
        {
            '../../../combinator': 28,
            '../../inline': 79,
            '../../inline/extension/label': 100,
            '../../source': 117,
            '../../util': 125,
            '../blockquote': 60,
            '../codeblock': 61,
            '../mathblock': 71,
            '../paragraph': 73,
            '../table': 77,
            './example': 64,
            'spica/global': 12,
            'typed-dom': 21
        }
    ],
    67: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.placeholder = exports.segment = void 0;
            const combinator_1 = _dereq_('../../../combinator');
            const typed_dom_1 = _dereq_('typed-dom');
            const opener = /^(~{3,})(?!~)[^\n]*\n?/;
            exports.segment = combinator_1.block(combinator_1.validate('~~~', combinator_1.clear(combinator_1.fence(opener, 300, true))));
            exports.placeholder = combinator_1.block(combinator_1.validate('~~~', combinator_1.fmap(combinator_1.fence(opener, 300, true), ([body, closer, opener]) => [typed_dom_1.html('pre', {
                    class: 'notranslate invalid',
                    'data-invalid-syntax': 'extension',
                    'data-invalid-type': 'syntax',
                    'data-invalid-message': 'Invalid syntax'
                }, `${ opener }${ body }${ closer }`)])));
        },
        {
            '../../../combinator': 28,
            'typed-dom': 21
        }
    ],
    68: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.heading = exports.segment = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const util_1 = _dereq_('../util');
            const inline_1 = _dereq_('../inline');
            const source_1 = _dereq_('../source');
            const typed_dom_1 = _dereq_('typed-dom');
            const array_1 = _dereq_('spica/array');
            exports.segment = combinator_1.block(combinator_1.validate('#', combinator_1.focus(/^#{1,6}[^\S\n][^\n]*(?:\n#{1,6}(?!\S)[^\n]*)*(?:$|\n)/, combinator_1.some(combinator_1.line(source => [
                [source],
                ''
            ])))));
            exports.heading = combinator_1.block(combinator_1.rewrite(exports.segment, combinator_1.context({
                syntax: {
                    inline: {
                        annotation: false,
                        reference: false,
                        extension: false,
                        link: false,
                        media: false,
                        autolink: false
                    }
                }
            }, combinator_1.some(combinator_1.line(inline_1.indexee(combinator_1.fmap(combinator_1.open(source_1.str(/^#+/), combinator_1.trim(combinator_1.some(combinator_1.union([
                inline_1.indexer,
                inline_1.inline
            ]))), true), ns => [typed_dom_1.html(`h${ ns[0].length }`, util_1.defrag(array_1.shift(ns)[1]))])))))));
        },
        {
            '../../combinator': 28,
            '../inline': 79,
            '../source': 117,
            '../util': 125,
            'spica/array': 6,
            'typed-dom': 21
        }
    ],
    69: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.horizontalrule = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.horizontalrule = combinator_1.block(combinator_1.line(combinator_1.focus(/^-{3,}[^\S\n]*(?:$|\n)/, () => [
                [typed_dom_1.html('hr')],
                ''
            ])));
        },
        {
            '../../combinator': 28,
            'typed-dom': 21
        }
    ],
    70: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.ilist_ = exports.ilist = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const util_1 = _dereq_('../util');
            const ulist_1 = _dereq_('./ulist');
            const olist_1 = _dereq_('./olist');
            const inline_1 = _dereq_('../inline');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.ilist = combinator_1.lazy(() => combinator_1.block(combinator_1.fmap(combinator_1.validate(/^[-+*](?=[^\S\n]|\n[^\S\n]*\S)/, combinator_1.some(combinator_1.union([combinator_1.fmap(combinator_1.inits([
                    combinator_1.line(combinator_1.open(/^[-+*](?:$|\s)/, combinator_1.trim(combinator_1.some(inline_1.inline)), true)),
                    combinator_1.indent(combinator_1.union([
                        ulist_1.ulist_,
                        olist_1.olist_,
                        exports.ilist_
                    ]))
                ]), ns => [typed_dom_1.html('li', util_1.defrag(ulist_1.fillFirstLine(ns)))])]))), es => [typed_dom_1.html('ul', {
                    class: 'invalid',
                    'data-invalid-syntax': 'list',
                    'data-invalid-type': 'syntax',
                    'data-invalid-message': 'Use - instead of + or *'
                }, es)])));
            exports.ilist_ = combinator_1.convert(source => source.replace(/^[-+*](?=$|\n)/, `$& `), exports.ilist);
        },
        {
            '../../combinator': 28,
            '../inline': 79,
            '../util': 125,
            './olist': 72,
            './ulist': 78,
            'typed-dom': 21
        }
    ],
    71: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.mathblock = exports.segment_ = exports.segment = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const typed_dom_1 = _dereq_('typed-dom');
            const opener = /^(\$\$)(?!\$)([^\n]*)\n?/;
            exports.segment = combinator_1.block(combinator_1.validate('$$', combinator_1.clear(combinator_1.fence(opener, 100, true))));
            exports.segment_ = combinator_1.block(combinator_1.validate('$$', combinator_1.clear(combinator_1.fence(opener, 100, false))), false);
            exports.mathblock = combinator_1.block(combinator_1.validate('$$', combinator_1.fmap(combinator_1.fence(opener, 100, true), ([body, closer, opener, delim, param]) => closer && param.trim() === '' ? [typed_dom_1.html('div', { class: `math notranslate` }, `$$\n${ body }$$`)] : [typed_dom_1.html('pre', {
                    class: `math notranslate invalid`,
                    'data-invalid-syntax': 'mathblock',
                    'data-invalid-type': closer ? 'parameter' : 'closer',
                    'data-invalid-message': closer ? 'Invalid parameter' : `Missing closing delimiter ${ delim }`
                }, `${ opener }${ body }${ closer }`)])));
        },
        {
            '../../combinator': 28,
            'typed-dom': 21
        }
    ],
    72: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.olist_ = exports.olist = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const util_1 = _dereq_('../util');
            const ulist_1 = _dereq_('./ulist');
            const ilist_1 = _dereq_('./ilist');
            const inline_1 = _dereq_('../inline');
            const typed_dom_1 = _dereq_('typed-dom');
            const array_1 = _dereq_('spica/array');
            exports.olist = combinator_1.lazy(() => combinator_1.block(combinator_1.fmap(combinator_1.validate(/^(?=([0-9]+|[a-z]+|[A-Z]+)\.(?=[^\S\n]|\n[^\S\n]*\S))/, combinator_1.context({ syntax: { inline: { media: false } } }, combinator_1.some(combinator_1.union([combinator_1.fmap(combinator_1.inits([
                    combinator_1.line(combinator_1.inits([
                        combinator_1.focus(/^(?:[0-9]+|[a-z]+|[A-Z]+)(?![^.\n])\.?(?:$|\s)/, source => [
                            [source.split('.')[0]],
                            ''
                        ]),
                        combinator_1.trim(combinator_1.some(inline_1.inline))
                    ])),
                    combinator_1.indent(combinator_1.union([
                        ulist_1.ulist_,
                        exports.olist_,
                        ilist_1.ilist_
                    ]))
                ]), ns => [typed_dom_1.html('li', {
                        value: format(ns[0]),
                        'data-type': type(ns[0])
                    }, util_1.defrag(ulist_1.fillFirstLine(array_1.shift(ns)[1])))])])))), es => {
                const ty = es[0].getAttribute('data-type');
                return [typed_dom_1.html('ol', {
                        type: ty,
                        start: ty === '1' ? es[0].getAttribute('value') : void 0
                    }, es.map(el => typed_dom_1.define(el, {
                        value: ty === '1' ? void 0 : null,
                        'data-type': null
                    })))];
            })));
            exports.olist_ = combinator_1.convert(source => source.replace(/^([0-9]+|[A-Z]+|[a-z]+)\.?(?=$|\n)/, `$1. `), exports.olist);
            function type(index) {
                switch (true) {
                case +index === 0:
                    return;
                case +index > 0:
                    return '1';
                case index === index.toLowerCase():
                    return 'a';
                case index === index.toUpperCase():
                    return 'A';
                }
            }
            function format(index) {
                switch (type(index)) {
                case void 0:
                    return;
                case '1':
                    return `${ +index }`;
                case 'a':
                    return index;
                case 'A':
                    return index;
                }
            }
        },
        {
            '../../combinator': 28,
            '../inline': 79,
            '../util': 125,
            './ilist': 70,
            './ulist': 78,
            'spica/array': 6,
            'typed-dom': 21
        }
    ],
    73: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.paragraph = exports.blankline = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const util_1 = _dereq_('../util');
            const mention_1 = _dereq_('./paragraph/mention');
            const inline_1 = _dereq_('../inline');
            const source_1 = _dereq_('../source');
            const typed_dom_1 = _dereq_('typed-dom');
            const array_1 = _dereq_('spica/array');
            exports.blankline = /^(?:\\?\s)*\\?(?:\n|$)/gm;
            exports.paragraph = combinator_1.block(combinator_1.fmap(combinator_1.convert(source => source.replace(exports.blankline, ''), combinator_1.some(combinator_1.subsequence([
                combinator_1.fmap(combinator_1.some(mention_1.mention), es => es.reduce((acc, el) => array_1.push(acc, [
                    el,
                    typed_dom_1.html('br')
                ]), [])),
                combinator_1.fmap(combinator_1.rewrite(combinator_1.some(source_1.anyline, '>'), combinator_1.trim(combinator_1.some(inline_1.inline))), ns => array_1.push(ns, [typed_dom_1.html('br')]))
            ]))), ns => ns.length > 0 ? [typed_dom_1.html('p', util_1.defrag(util_1.trimEnd(ns)))].map(el => isVisible(el) ? el : typed_dom_1.define(el, {
                class: 'invalid',
                'data-invalid-syntax': 'paragraph',
                'data-invalid-type': 'visibility',
                'data-invalid-message': 'All paragraphs must have a visible content'
            })) : []));
            function isVisible(node) {
                return node.textContent.trim() !== '' || node.getElementsByClassName('media').length > 0;
            }
        },
        {
            '../../combinator': 28,
            '../inline': 79,
            '../source': 117,
            '../util': 125,
            './paragraph/mention': 74,
            'spica/array': 6,
            'typed-dom': 21
        }
    ],
    74: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.mention = void 0;
            const combinator_1 = _dereq_('../../../combinator');
            const address_1 = _dereq_('./mention/address');
            const quotation_1 = _dereq_('./mention/quotation');
            exports.mention = combinator_1.block(combinator_1.subsequence([
                combinator_1.some(address_1.address),
                quotation_1.quotation
            ]), false);
        },
        {
            '../../../combinator': 28,
            './mention/address': 75,
            './mention/quotation': 76
        }
    ],
    75: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.address = void 0;
            const combinator_1 = _dereq_('../../../../combinator');
            const inline_1 = _dereq_('../../../inline');
            const source_1 = _dereq_('../../../source');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.address = combinator_1.line(combinator_1.creator(combinator_1.fmap(combinator_1.sequence([
                source_1.str(/^>+(?!>)(?=\S+\s*$)/),
                combinator_1.union([
                    combinator_1.focus(/^[A-Za-z0-9]+(?:[/-][A-Za-z0-9]+)*(?=\s*$)/, combinator_1.convert(source => `{ ${ source } }`, inline_1.link)),
                    combinator_1.focus(/^h?ttps?:\/\/[^/?#\s]\S*(?=\s*$)/, combinator_1.convert(inline_1.url2link, inline_1.link))
                ])
            ]), ([sym, link]) => [typed_dom_1.define(link, {
                    class: 'address',
                    'data-level': `${ sym.length }`,
                    href: null
                }, `${ sym }${ link.textContent }`)])));
        },
        {
            '../../../../combinator': 28,
            '../../../inline': 79,
            '../../../source': 117,
            'typed-dom': 21
        }
    ],
    76: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.quotation = void 0;
            const combinator_1 = _dereq_('../../../../combinator');
            const util_1 = _dereq_('../../../util');
            const source_1 = _dereq_('../../../source');
            const autolink_1 = _dereq_('../../../autolink');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.quotation = combinator_1.block(combinator_1.creator(combinator_1.fmap(combinator_1.union([
                combinator_1.rewrite(combinator_1.some(combinator_1.validate(/^>+(?:$|\s)/, source_1.contentline)), combinator_1.convert(source => source.replace(/\n$/, ''), combinator_1.some(autolink_1.autolink))),
                combinator_1.rewrite(combinator_1.some(combinator_1.validate(/^>+/, source_1.contentline)), combinator_1.convert(source => source.replace(/\n$/, ''), combinator_1.some(autolink_1.autolink)))
            ]), ns => [typed_dom_1.html('span', { class: 'quotation' }, util_1.defrag(ns))])), false);
        },
        {
            '../../../../combinator': 28,
            '../../../autolink': 58,
            '../../../source': 117,
            '../../../util': 125,
            'typed-dom': 21
        }
    ],
    77: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.table = void 0;
            const global_1 = _dereq_('spica/global');
            const combinator_1 = _dereq_('../../combinator');
            const util_1 = _dereq_('../util');
            const inline_1 = _dereq_('../inline');
            const typed_dom_1 = _dereq_('typed-dom');
            const array_1 = _dereq_('spica/array');
            exports.table = combinator_1.lazy(() => combinator_1.block(combinator_1.fmap(combinator_1.validate(/^\|[^\n]*(?:\n\|[^\n]*){2,}/, combinator_1.context({ syntax: { inline: { media: false } } }, combinator_1.sequence([
                row(cell(data), true),
                row(cell(alignment), false),
                combinator_1.some(row(cell(data), true))
            ]))), rows => {
                const [head, alignment] = array_1.shift(rows, 2)[0];
                void align(head, alignment, rows);
                return [typed_dom_1.html('table', [
                        typed_dom_1.html('thead', [head]),
                        typed_dom_1.html('tbody', rows)
                    ])];
            })));
            function align(head, alignment, rows) {
                const as = [...alignment.children].reduce((acc, el) => array_1.push(acc, [el.textContent || acc.length > 0 && acc[acc.length - 1] || '']), []);
                void apply(head, as.slice(0, 2));
                for (let i = 0, len = rows.length; i < len; ++i) {
                    void apply(rows[i], as);
                }
                return;
                function apply(row, aligns) {
                    const cols = row.children;
                    const len = cols.length;
                    void extend(aligns, len);
                    for (let i = 0; i < len; ++i) {
                        if (!aligns[i])
                            continue;
                        void cols[i].setAttribute('style', `text-align: ${ aligns[i] };`);
                    }
                }
                function extend(aligns, size) {
                    return size > aligns.length ? void array_1.push(aligns, global_1.Array(size - aligns.length).fill(aligns.length > 0 ? aligns[aligns.length - 1] : '')) : void 0;
                }
            }
            const row = (parser, optional) => combinator_1.fmap(combinator_1.line(combinator_1.surround(/^(?=\|)/, combinator_1.some(combinator_1.union([parser])), /^\|?\s*$/, optional)), es => [typed_dom_1.html('tr', es)]);
            const cell = parser => combinator_1.fmap(combinator_1.union([parser]), ns => [typed_dom_1.html('td', util_1.defrag(ns))]);
            const data = combinator_1.surround(/^\|(?:\\?\s)*(?=\S)/, combinator_1.some(combinator_1.union([inline_1.inline]), /^(?:\\?\s)*(?=\||\\?$)/), /^[^|]*/, true);
            const alignment = combinator_1.open('|', combinator_1.union([
                combinator_1.focus(/^:-+:/, () => [
                    ['center'],
                    ''
                ]),
                combinator_1.focus(/^:-+/, () => [
                    ['left'],
                    ''
                ]),
                combinator_1.focus(/^-+:/, () => [
                    ['right'],
                    ''
                ]),
                combinator_1.focus(/^-+/, () => [
                    [''],
                    ''
                ])
            ]));
        },
        {
            '../../combinator': 28,
            '../inline': 79,
            '../util': 125,
            'spica/array': 6,
            'spica/global': 12,
            'typed-dom': 21
        }
    ],
    78: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.fillFirstLine = exports.ulist_ = exports.ulist = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const util_1 = _dereq_('../util');
            const olist_1 = _dereq_('./olist');
            const ilist_1 = _dereq_('./ilist');
            const inline_1 = _dereq_('../inline');
            const typed_dom_1 = _dereq_('typed-dom');
            const array_1 = _dereq_('spica/array');
            exports.ulist = combinator_1.lazy(() => combinator_1.block(combinator_1.fmap(combinator_1.validate(/^-(?=[^\S\n]|\n[^\S\n]*\S)/, combinator_1.context({ syntax: { inline: { media: false } } }, combinator_1.some(combinator_1.union([combinator_1.fmap(combinator_1.inits([
                    combinator_1.line(combinator_1.open(/^-(?:$|\s)/, combinator_1.trim(combinator_1.some(inline_1.inline)), true)),
                    combinator_1.indent(combinator_1.union([
                        exports.ulist_,
                        olist_1.olist_,
                        ilist_1.ilist_
                    ]))
                ]), ns => [typed_dom_1.html('li', util_1.defrag(fillFirstLine(ns)))])])))), es => [typed_dom_1.html('ul', es)])));
            exports.ulist_ = combinator_1.convert(source => source.replace(/^-(?=$|\n)/, `$& `), exports.ulist);
            function fillFirstLine(ns) {
                return typeof ns[0] === 'object' && [
                    'UL',
                    'OL'
                ].includes(ns[0].tagName) ? array_1.unshift([typed_dom_1.html('br')], ns) : ns;
            }
            exports.fillFirstLine = fillFirstLine;
        },
        {
            '../../combinator': 28,
            '../inline': 79,
            '../util': 125,
            './ilist': 70,
            './olist': 72,
            'spica/array': 6,
            'typed-dom': 21
        }
    ],
    79: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.inline = void 0;
            const combinator_1 = _dereq_('../combinator');
            const escape_1 = _dereq_('./inline/escape');
            const annotation_1 = _dereq_('./inline/annotation');
            const reference_1 = _dereq_('./inline/reference');
            const template_1 = _dereq_('./inline/template');
            const extension_1 = _dereq_('./inline/extension');
            const ruby_1 = _dereq_('./inline/ruby');
            const link_1 = _dereq_('./inline/link');
            const html_1 = _dereq_('./inline/html');
            const comment_1 = _dereq_('./inline/comment');
            const insertion_1 = _dereq_('./inline/insertion');
            const deletion_1 = _dereq_('./inline/deletion');
            const mark_1 = _dereq_('./inline/mark');
            const emstrong_1 = _dereq_('./inline/emstrong');
            const emphasis_1 = _dereq_('./inline/emphasis');
            const strong_1 = _dereq_('./inline/strong');
            const code_1 = _dereq_('./inline/code');
            const math_1 = _dereq_('./inline/math');
            const media_1 = _dereq_('./inline/media');
            const htmlentity_1 = _dereq_('./inline/htmlentity');
            const shortmedia_1 = _dereq_('./inline/shortmedia');
            const autolink_1 = _dereq_('./inline/autolink');
            const bracket_1 = _dereq_('./inline/bracket');
            const source_1 = _dereq_('./source');
            exports.inline = combinator_1.union([
                escape_1.escape,
                annotation_1.annotation,
                reference_1.reference,
                template_1.template,
                extension_1.extension,
                ruby_1.ruby,
                link_1.link,
                media_1.media,
                html_1.html,
                comment_1.comment,
                insertion_1.insertion,
                deletion_1.deletion,
                mark_1.mark,
                emstrong_1.emstrong,
                strong_1.strong,
                emphasis_1.emphasis,
                code_1.code,
                math_1.math,
                htmlentity_1.htmlentity,
                shortmedia_1.shortmedia,
                autolink_1.autolink,
                bracket_1.bracket,
                source_1.text
            ]);
            var htmlentity_2 = _dereq_('./inline/htmlentity');
            Object.defineProperty(exports, 'htmlentity', {
                enumerable: true,
                get: function () {
                    return htmlentity_2.htmlentity;
                }
            });
            var comment_2 = _dereq_('./inline/comment');
            Object.defineProperty(exports, 'comment', {
                enumerable: true,
                get: function () {
                    return comment_2.comment;
                }
            });
            var link_2 = _dereq_('./inline/link');
            Object.defineProperty(exports, 'link', {
                enumerable: true,
                get: function () {
                    return link_2.link;
                }
            });
            var media_2 = _dereq_('./inline/media');
            Object.defineProperty(exports, 'media', {
                enumerable: true,
                get: function () {
                    return media_2.media;
                }
            });
            var shortmedia_2 = _dereq_('./inline/shortmedia');
            Object.defineProperty(exports, 'shortmedia', {
                enumerable: true,
                get: function () {
                    return shortmedia_2.shortmedia;
                }
            });
            var autolink_2 = _dereq_('./inline/autolink');
            Object.defineProperty(exports, 'autolink', {
                enumerable: true,
                get: function () {
                    return autolink_2.autolink;
                }
            });
            var url_1 = _dereq_('./inline/autolink/url');
            Object.defineProperty(exports, 'url', {
                enumerable: true,
                get: function () {
                    return url_1.url;
                }
            });
            Object.defineProperty(exports, 'url2link', {
                enumerable: true,
                get: function () {
                    return url_1.url2link;
                }
            });
            var indexer_1 = _dereq_('./inline/extension/indexer');
            Object.defineProperty(exports, 'indexer', {
                enumerable: true,
                get: function () {
                    return indexer_1.indexer;
                }
            });
            var indexee_1 = _dereq_('./inline/extension/indexee');
            Object.defineProperty(exports, 'indexee', {
                enumerable: true,
                get: function () {
                    return indexee_1.indexee;
                }
            });
            var label_1 = _dereq_('./inline/extension/label');
            Object.defineProperty(exports, 'isFixed', {
                enumerable: true,
                get: function () {
                    return label_1.isFixed;
                }
            });
            Object.defineProperty(exports, 'isFormatted', {
                enumerable: true,
                get: function () {
                    return label_1.isFormatted;
                }
            });
        },
        {
            '../combinator': 28,
            './inline/annotation': 80,
            './inline/autolink': 81,
            './inline/autolink/url': 87,
            './inline/bracket': 88,
            './inline/code': 89,
            './inline/comment': 90,
            './inline/deletion': 91,
            './inline/emphasis': 92,
            './inline/emstrong': 93,
            './inline/escape': 94,
            './inline/extension': 95,
            './inline/extension/indexee': 98,
            './inline/extension/indexer': 99,
            './inline/extension/label': 100,
            './inline/html': 102,
            './inline/htmlentity': 103,
            './inline/insertion': 104,
            './inline/link': 105,
            './inline/mark': 106,
            './inline/math': 107,
            './inline/media': 108,
            './inline/reference': 109,
            './inline/ruby': 110,
            './inline/shortmedia': 111,
            './inline/strong': 112,
            './inline/template': 113,
            './source': 117
        }
    ],
    80: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.annotation = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const util_1 = _dereq_('../util');
            const inline_1 = _dereq_('../inline');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.annotation = combinator_1.lazy(() => combinator_1.creator(combinator_1.bind(combinator_1.surround('((', combinator_1.guard(context => {
                var _a, _b, _c;
                return (_c = (_b = (_a = context.syntax) === null || _a === void 0 ? void 0 : _a.inline) === null || _b === void 0 ? void 0 : _b.annotation) !== null && _c !== void 0 ? _c : true;
            }, combinator_1.validate(/^\S[\s\S]*\)\)/, util_1.startTight(combinator_1.context({
                syntax: {
                    inline: {
                        annotation: false,
                        reference: false,
                        media: false
                    }
                },
                state: void 0
            }, combinator_1.union([combinator_1.some(inline_1.inline, ')')]))))), '))'), (ns, rest) => util_1.isTight(ns, 0, ns.length) ? [
                [typed_dom_1.html('sup', { class: 'annotation' }, util_1.defrag(util_1.trimEnd(ns)))],
                rest
            ] : void 0)));
        },
        {
            '../../combinator': 28,
            '../inline': 79,
            '../util': 125,
            'typed-dom': 21
        }
    ],
    81: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.autolink = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const util_1 = _dereq_('../util');
            const url_1 = _dereq_('./autolink/url');
            const email_1 = _dereq_('./autolink/email');
            const channel_1 = _dereq_('./autolink/channel');
            const account_1 = _dereq_('./autolink/account');
            const hashtag_1 = _dereq_('./autolink/hashtag');
            const hashref_1 = _dereq_('./autolink/hashref');
            const source_1 = _dereq_('../source');
            exports.autolink = combinator_1.fmap(combinator_1.guard(context => {
                var _a, _b, _c;
                return (_c = (_b = (_a = context.syntax) === null || _a === void 0 ? void 0 : _a.inline) === null || _b === void 0 ? void 0 : _b.autolink) !== null && _c !== void 0 ? _c : true;
            }, combinator_1.validate(/^[@#A-Za-z0-9]|^[^\x00-\x7F\s]#/, combinator_1.some(combinator_1.union([
                url_1.url,
                email_1.email,
                source_1.str(/^[A-Za-z0-9]+(?:[.+_-][A-Za-z0-9]+)*(?:@(?:[A-Za-z0-9]+(?:[.-][A-Za-z0-9]+)*)?)+/),
                source_1.str(/^[@#]+(?![A-Za-z0-9]|[^\x00-\x7F\s])/),
                channel_1.channel,
                account_1.account,
                source_1.str(/^@[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*/),
                source_1.str(/^(?:[A-Za-z0-9]|[^\x00-\x7F\s])(?=#)/),
                hashtag_1.hashtag,
                hashref_1.hashref,
                source_1.str(/^#[0-9]+(?:[A-Za-z0-9]|[^\x00-\x7F\s])+/)
            ])))), ns => ns.length === 1 ? ns : [util_1.stringify(ns)]);
        },
        {
            '../../combinator': 28,
            '../source': 117,
            '../util': 125,
            './autolink/account': 82,
            './autolink/channel': 83,
            './autolink/email': 84,
            './autolink/hashref': 85,
            './autolink/hashtag': 86,
            './autolink/url': 87
        }
    ],
    82: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.account = void 0;
            const combinator_1 = _dereq_('../../../combinator');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.account = combinator_1.creator(combinator_1.validate('@', combinator_1.focus(/^@(?:(?![^/]*?--)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9]{1,63}){1,2}\/)?[A-Z-a-z][A-Za-z0-9]*(?:-[A-Za-z0-9]+)*/, source => [
                [typed_dom_1.html('a', {
                        class: 'account',
                        rel: 'noopener',
                        'data-ns': namespace(source)
                    }, source)],
                ''
            ])));
            function namespace(source) {
                return source.includes('/') ? source.slice(1, source.indexOf('/')) : void 0;
            }
        },
        {
            '../../../combinator': 28,
            'typed-dom': 21
        }
    ],
    83: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.channel = void 0;
            const combinator_1 = _dereq_('../../../combinator');
            const util_1 = _dereq_('../../util');
            const account_1 = _dereq_('./account');
            const hashtag_1 = _dereq_('./hashtag');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.channel = combinator_1.validate('@', combinator_1.fmap(combinator_1.inits([
                account_1.account,
                combinator_1.some(hashtag_1.hashtag)
            ]), ns => ns.length > 1 ? [typed_dom_1.html('a', {
                    class: 'channel',
                    rel: 'noopener'
                }, util_1.stringify(ns))] : ns));
        },
        {
            '../../../combinator': 28,
            '../../util': 125,
            './account': 82,
            './hashtag': 86,
            'typed-dom': 21
        }
    ],
    84: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.email = void 0;
            const combinator_1 = _dereq_('../../../combinator');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.email = combinator_1.creator(combinator_1.focus(/^[A-Za-z0-9]+(?:[.+_-][A-Za-z0-9]+)*@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*/, source => [
                [typed_dom_1.html('a', {
                        class: 'email',
                        href: `mailto:${ source }`,
                        rel: 'noopener'
                    }, source)],
                ''
            ]));
        },
        {
            '../../../combinator': 28,
            'typed-dom': 21
        }
    ],
    85: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.hashref = void 0;
            const combinator_1 = _dereq_('../../../combinator');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.hashref = combinator_1.creator(combinator_1.validate('#', combinator_1.focus(/^#[0-9]+(?![A-Za-z]|[^\x00-\x7F\s])/, ref => [
                [typed_dom_1.html('a', {
                        class: 'hashref',
                        rel: 'noopener'
                    }, ref)],
                ''
            ])));
        },
        {
            '../../../combinator': 28,
            'typed-dom': 21
        }
    ],
    86: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.hashtag = void 0;
            const combinator_1 = _dereq_('../../../combinator');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.hashtag = combinator_1.creator(combinator_1.validate('#', combinator_1.focus(/^#(?![0-9])(?:[A-Za-z0-9]|[^\x00-\x7F\s])+/, tag => [
                [typed_dom_1.html('a', {
                        class: 'hashtag',
                        rel: 'noopener'
                    }, tag)],
                ''
            ])));
        },
        {
            '../../../combinator': 28,
            'typed-dom': 21
        }
    ],
    87: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.url2link = exports.url = void 0;
            const combinator_1 = _dereq_('../../../combinator');
            const source_1 = _dereq_('../../source');
            const link_1 = _dereq_('../link');
            const closer = /^[-+*~^,.;:!?]*(?=[\s"`|\[\](){}<>]|\\?(?:$|\s))/;
            exports.url = combinator_1.lazy(() => combinator_1.rewrite(combinator_1.validate([
                'http',
                'ttp'
            ], combinator_1.open(source_1.str(/^h?ttps?:\/\/(?=[^/?#\s])/), combinator_1.focus(/^[\x00-\x7F]+/, combinator_1.some(combinator_1.union([
                bracket,
                combinator_1.some(source_1.unescsource, closer)
            ]))))), combinator_1.convert(url2link, combinator_1.context({ syntax: { inline: { link: void 0 } } }, combinator_1.union([link_1.link])))));
            const bracket = combinator_1.lazy(() => combinator_1.creator(combinator_1.union([
                combinator_1.surround('"', combinator_1.some(source_1.unescsource, /^[\s"]+/), '"', true),
                combinator_1.surround('(', combinator_1.some(combinator_1.union([
                    bracket,
                    source_1.unescsource
                ]), /^[\s\)]/), ')', true),
                combinator_1.surround('[', combinator_1.some(combinator_1.union([
                    bracket,
                    source_1.unescsource
                ]), /^[\s\]]/), ']', true),
                combinator_1.surround('{', combinator_1.some(combinator_1.union([
                    bracket,
                    source_1.unescsource
                ]), /^[\s\}]/), '}', true),
                combinator_1.surround('<', combinator_1.some(combinator_1.union([
                    bracket,
                    source_1.unescsource
                ]), /^[\s\>]/), '>', true)
            ])));
            function url2link(url) {
                return url[0] === 'h' ? `{ ${ url } }` : `{ h${ url } nofollow }`;
            }
            exports.url2link = url2link;
        },
        {
            '../../../combinator': 28,
            '../../source': 117,
            '../link': 105
        }
    ],
    88: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.bracket = void 0;
            const inline_1 = _dereq_('../inline');
            const combinator_1 = _dereq_('../../combinator');
            const source_1 = _dereq_('../source');
            const array_1 = _dereq_('spica/array');
            exports.bracket = combinator_1.lazy(() => combinator_1.union([
                combinator_1.surround(source_1.char('('), combinator_1.some(inline_1.inline, ')'), source_1.char(')'), true, void 0, ([as, bs = []], rest) => [
                    array_1.unshift(as, bs),
                    rest
                ]),
                combinator_1.surround(source_1.char('['), combinator_1.some(inline_1.inline, ']'), source_1.char(']'), true, void 0, ([as, bs = []], rest) => [
                    array_1.unshift(as, bs),
                    rest
                ]),
                combinator_1.surround(source_1.char('{'), combinator_1.some(inline_1.inline, '}'), source_1.char('}'), true, void 0, ([as, bs = []], rest) => [
                    array_1.unshift(as, bs),
                    rest
                ])
            ]));
        },
        {
            '../../combinator': 28,
            '../inline': 79,
            '../source': 117,
            'spica/array': 6
        }
    ],
    89: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.code = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.code = combinator_1.creator(combinator_1.validate('`', combinator_1.match(/^(`+)(?!`)(?:([^\n]*?[^`\n])\1(?!`))?/, ([whole, , body]) => rest => body ? [
                [typed_dom_1.html('code', { 'data-src': whole }, body.trim() || body)],
                rest
            ] : [
                [whole],
                rest
            ])));
        },
        {
            '../../combinator': 28,
            'typed-dom': 21
        }
    ],
    90: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.comment = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.comment = combinator_1.creator(combinator_1.validate('<#', combinator_1.match(/^<(#+)\s+(\S+(?:\s+(?!\1)\S+)*)(\s+\1>)?/, ([whole, , title, closer]) => (rest, {resources}) => closer ? [
                [typed_dom_1.html('sup', {
                        class: 'comment',
                        title
                    })],
                rest
            ] : resources && void (resources.creation -= whole.match(/<#+\s/g).length))));
        },
        {
            '../../combinator': 28,
            'typed-dom': 21
        }
    ],
    91: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.deletion = void 0;
            const inline_1 = _dereq_('../inline');
            const combinator_1 = _dereq_('../../combinator');
            const util_1 = _dereq_('../util');
            const source_1 = _dereq_('../source');
            const typed_dom_1 = _dereq_('typed-dom');
            const array_1 = _dereq_('spica/array');
            exports.deletion = combinator_1.lazy(() => combinator_1.creator(combinator_1.surround(source_1.str('~~'), util_1.startTight(combinator_1.union([combinator_1.some(inline_1.inline, '~~')])), source_1.str('~~'), false, ([as, bs, cs], rest) => util_1.isTight(bs, 0, bs.length) ? [
                [typed_dom_1.html('del', util_1.defrag(util_1.trimEnd(bs)))],
                rest
            ] : [
                array_1.unshift(as, bs),
                cs[0] + rest
            ], ([as, bs], rest) => [
                array_1.unshift(as, bs),
                rest
            ])));
        },
        {
            '../../combinator': 28,
            '../inline': 79,
            '../source': 117,
            '../util': 125,
            'spica/array': 6,
            'typed-dom': 21
        }
    ],
    92: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.emphasis = void 0;
            const inline_1 = _dereq_('../inline');
            const combinator_1 = _dereq_('../../combinator');
            const util_1 = _dereq_('../util');
            const strong_1 = _dereq_('./strong');
            const source_1 = _dereq_('../source');
            const typed_dom_1 = _dereq_('typed-dom');
            const array_1 = _dereq_('spica/array');
            exports.emphasis = combinator_1.lazy(() => combinator_1.creator(combinator_1.surround(source_1.char('*'), util_1.startTight(combinator_1.some(combinator_1.union([
                strong_1.strong,
                combinator_1.some(inline_1.inline, '*')
            ]))), source_1.char('*'), false, ([as, bs, cs], rest) => util_1.isTight(bs, 0, bs.length) ? [
                [typed_dom_1.html('em', util_1.defrag(util_1.trimEnd(bs)))],
                rest
            ] : [
                array_1.unshift(as, bs),
                cs[0] + rest
            ], ([as, bs], rest) => [
                array_1.unshift(as, bs),
                rest
            ])));
        },
        {
            '../../combinator': 28,
            '../inline': 79,
            '../source': 117,
            '../util': 125,
            './strong': 112,
            'spica/array': 6,
            'typed-dom': 21
        }
    ],
    93: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.emstrong = void 0;
            const inline_1 = _dereq_('../inline');
            const combinator_1 = _dereq_('../../combinator');
            const util_1 = _dereq_('../util');
            const emphasis_1 = _dereq_('./emphasis');
            const strong_1 = _dereq_('./strong');
            const source_1 = _dereq_('../source');
            const typed_dom_1 = _dereq_('typed-dom');
            const array_1 = _dereq_('spica/array');
            exports.emstrong = combinator_1.lazy(() => combinator_1.creator(combinator_1.surround(source_1.str('***'), util_1.startTight(combinator_1.union([combinator_1.some(inline_1.inline, '*')])), source_1.str(/^\*{1,3}/), false, ([as, bs, cs], rest, context) => {
                if (!util_1.isTight(bs, 0, bs.length))
                    return [
                        array_1.unshift(as, bs),
                        cs[0] + rest
                    ];
                switch (cs[0]) {
                case '*':
                    return combinator_1.fmap(strong_1.strong, ms => typeof ms[0] === 'object' ? (ms[0].prepend(typed_dom_1.html('em', util_1.defrag(util_1.trimEnd(bs)))), ms) : array_1.push(array_1.unshift(as, bs), array_1.shift(ms)[1]))('**' + rest, context) || [
                        array_1.push(array_1.unshift(as, bs), cs),
                        rest
                    ];
                case '**':
                    return combinator_1.fmap(emphasis_1.emphasis, ms => typeof ms[0] === 'object' ? (ms[0].prepend(typed_dom_1.html('strong', util_1.defrag(util_1.trimEnd(bs)))), ms) : array_1.push(array_1.unshift(as, bs), array_1.shift(ms)[1]))('*' + rest, context) || [
                        array_1.push(array_1.unshift(as, bs), cs),
                        rest
                    ];
                case '***':
                    return [
                        [typed_dom_1.html('em', [typed_dom_1.html('strong', util_1.defrag(util_1.trimEnd(bs)))])],
                        rest
                    ];
                }
            }, ([as, bs], rest) => [
                array_1.unshift(as, bs),
                rest
            ])));
        },
        {
            '../../combinator': 28,
            '../inline': 79,
            '../source': 117,
            '../util': 125,
            './emphasis': 92,
            './strong': 112,
            'spica/array': 6,
            'typed-dom': 21
        }
    ],
    94: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.escape = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const source_1 = _dereq_('../source');
            const repeat = source_1.str(/^(.)\1*/);
            exports.escape = combinator_1.union([(source, context) => {
                    if (source.length < 3)
                        return;
                    switch (source[0]) {
                    case '*':
                        if (source.length < 4)
                            return;
                        return source[3] === source[0] && source[2] === source[0] && source[1] === source[0] ? repeat(source, context) : void 0;
                    case '+':
                    case '~':
                    case '=':
                        return source[2] === source[0] && source[1] === source[0] ? repeat(source, context) : void 0;
                    default:
                        return;
                    }
                }]);
        },
        {
            '../../combinator': 28,
            '../source': 117
        }
    ],
    95: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.extension = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const index_1 = _dereq_('./extension/index');
            const label_1 = _dereq_('./extension/label');
            const data_1 = _dereq_('./extension/data');
            const placeholder_1 = _dereq_('./extension/placeholder');
            exports.extension = combinator_1.guard(context => {
                var _a, _b, _c;
                return (_c = (_b = (_a = context.syntax) === null || _a === void 0 ? void 0 : _a.inline) === null || _b === void 0 ? void 0 : _b.extension) !== null && _c !== void 0 ? _c : true;
            }, combinator_1.validate([
                '[',
                '$'
            ], combinator_1.union([
                index_1.index,
                label_1.label,
                data_1.data,
                placeholder_1.placeholder
            ])));
        },
        {
            '../../combinator': 28,
            './extension/data': 96,
            './extension/index': 97,
            './extension/label': 100,
            './extension/placeholder': 101
        }
    ],
    96: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.data = void 0;
            const inline_1 = _dereq_('../../inline');
            const combinator_1 = _dereq_('../../../combinator');
            const util_1 = _dereq_('../../util');
            const source_1 = _dereq_('../../source');
            const typed_dom_1 = _dereq_('typed-dom');
            const array_1 = _dereq_('spica/array');
            exports.data = combinator_1.lazy(() => combinator_1.creator(combinator_1.surround(source_1.str('[~'), combinator_1.inits([
                source_1.str(/^[a-z]+(?:-[a-z0-9]+)*(?:=[a-z0-9]+(?:-[a-z0-9]+)*)?(?=[|\]])/),
                source_1.char('|'),
                util_1.startTight(combinator_1.some(inline_1.inline, ']'))
            ]), source_1.char(']'), false, ([as, bs, cs], rest) => [
                util_1.isTight(bs, 2, bs.length) ? [typed_dom_1.html('span', attrs(util_1.stringify(bs[0])), util_1.defrag(util_1.trimEnd(bs.slice(2))))] : array_1.push(array_1.unshift(as, bs), cs),
                rest
            ], ([as, bs], rest) => [
                array_1.unshift(as, bs),
                rest
            ])));
            function attrs(data) {
                const name = data.split('=', 1)[0];
                const value = data.slice(name.length + 1);
                return {
                    class: `data-${ name }`,
                    'data-name': name,
                    'data-value': value
                };
            }
        },
        {
            '../../../combinator': 28,
            '../../inline': 79,
            '../../source': 117,
            '../../util': 125,
            'spica/array': 6,
            'typed-dom': 21
        }
    ],
    97: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.index = void 0;
            const inline_1 = _dereq_('../../inline');
            const combinator_1 = _dereq_('../../../combinator');
            const util_1 = _dereq_('../../util');
            const indexee_1 = _dereq_('./indexee');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.index = combinator_1.lazy(() => combinator_1.subline(combinator_1.creator(combinator_1.fmap(indexee_1.indexee(combinator_1.surround('[#', combinator_1.validate(/^[^\n\]]+\]/, util_1.startTight(combinator_1.context({
                syntax: {
                    inline: {
                        link: false,
                        media: false,
                        annotation: false,
                        reference: false,
                        extension: false,
                        autolink: false
                    }
                }
            }, combinator_1.union([combinator_1.some(inline_1.inline, ']')])))), ']', false, ([, bs], rest) => util_1.isTight(bs, 0, bs.length) ? [
                [typed_dom_1.html('a', util_1.defrag(util_1.trimEnd(bs)))],
                rest
            ] : void 0)), ([el]) => [typed_dom_1.define(el, {
                    id: null,
                    class: 'index',
                    href: el.id ? `#${ el.id }` : void 0
                }, el.childNodes)]))));
        },
        {
            '../../../combinator': 28,
            '../../inline': 79,
            '../../util': 125,
            './indexee': 98,
            'typed-dom': 21
        }
    ],
    98: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.text = exports.indexee = void 0;
            const combinator_1 = _dereq_('../../../combinator');
            const typed_dom_1 = _dereq_('typed-dom');
            function indexee(parser) {
                return combinator_1.fmap(parser, ([el]) => [typed_dom_1.define(el, { id: identity(text(el)) || void 0 })]);
            }
            exports.indexee = indexee;
            function text(source) {
                const indexer = source.querySelector(':scope > .indexer');
                if (indexer)
                    return indexer.getAttribute('data-index');
                const target = source.cloneNode(true);
                for (let es = target.querySelectorAll('code[data-src], .math[data-src]'), i = 0, len = es.length; i < len; ++i) {
                    const el = es[i];
                    void typed_dom_1.define(el, el.getAttribute('data-src'));
                }
                for (let es = target.querySelectorAll('rt, rp'), i = 0, len = es.length; i < len; ++i) {
                    const el = es[i];
                    void el.remove();
                }
                return target.textContent.trim();
            }
            exports.text = text;
            function identity(index) {
                return index ? `index:${ index.trim().replace(/\s+/g, '_').slice(0, 101).replace(/^(.{97}).{4}$/, '$1...') }` : '';
            }
        },
        {
            '../../../combinator': 28,
            'typed-dom': 21
        }
    ],
    99: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.indexer = void 0;
            const combinator_1 = _dereq_('../../../combinator');
            const index_1 = _dereq_('./index');
            const source_1 = _dereq_('../../source');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.indexer = combinator_1.creator(combinator_1.surround(source_1.str(/^\s+(?=\[#[^\s\]])/), combinator_1.union([index_1.index]), /^\s*$/, false, ([, [el]], rest) => [
                [typed_dom_1.html('span', {
                        class: 'indexer',
                        'data-index': el.getAttribute('href').slice(el.hash.indexOf(':') + 1)
                    })],
                rest
            ]));
        },
        {
            '../../../combinator': 28,
            '../../source': 117,
            './index': 97,
            'typed-dom': 21
        }
    ],
    100: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.isFormatted = exports.isFixed = exports.number = exports.label = void 0;
            const combinator_1 = _dereq_('../../../combinator');
            const source_1 = _dereq_('../../source');
            const typed_dom_1 = _dereq_('typed-dom');
            const array_1 = _dereq_('spica/array');
            const body = source_1.str(/^(?:\$[a-z]*)(?:(?:-[a-z][0-9a-z]*)+(?:-0(?:\.0){0,2})?|-[0-9]+(?:\.[0-9]+){0,2})/);
            exports.label = combinator_1.creator(combinator_1.validate([
                '[$',
                '$'
            ], combinator_1.fmap(combinator_1.union([
                combinator_1.surround('[', body, ']'),
                body
            ]), ([text]) => [typed_dom_1.html('a', {
                    class: 'label',
                    'data-label': text.slice(text[1] === '-' ? 0 : 1)
                }, [text])])));
            function number(label, base) {
                return isFixed(label) ? label.slice(label.lastIndexOf('-') + 1) : increment(base, isFormatted(label) ? label.slice(label.lastIndexOf('-') + 1).split('.').length : base.split('.').length);
            }
            exports.number = number;
            function isFixed(label) {
                return /^[^-]+-[0-9]+(?:\.[0-9]+)*$/.test(label);
            }
            exports.isFixed = isFixed;
            function isFormatted(label) {
                return /^[^-]+.+?-0(?:\.0)*$/.test(label);
            }
            exports.isFormatted = isFormatted;
            function increment(number, position) {
                if (number === '0' && position > 1)
                    return increment('1', position);
                const ns = number.split('.');
                const ms = [];
                for (let i = 0; i < position; ++i) {
                    void ms.push(i < ns.length ? i + 1 < position ? +ns[i] : +ns[i] + 1 : i + 1 < position ? 0 : 1);
                }
                return array_1.join(ms, '.');
            }
        },
        {
            '../../../combinator': 28,
            '../../source': 117,
            'spica/array': 6,
            'typed-dom': 21
        }
    ],
    101: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.placeholder = void 0;
            const inline_1 = _dereq_('../../inline');
            const combinator_1 = _dereq_('../../../combinator');
            const util_1 = _dereq_('../../util');
            const source_1 = _dereq_('../../source');
            const typed_dom_1 = _dereq_('typed-dom');
            const array_1 = _dereq_('spica/array');
            exports.placeholder = combinator_1.lazy(() => combinator_1.creator(combinator_1.validate([
                '[:',
                '[^'
            ], combinator_1.surround(source_1.str(/^\[[:^]/), util_1.startTight(combinator_1.some(combinator_1.union([inline_1.inline]), ']')), source_1.char(']'), false, ([as, bs, cs], rest) => [
                util_1.isTight(bs, 0, bs.length) ? [typed_dom_1.html('span', {
                        class: 'invalid',
                        'data-invalid-syntax': 'extension',
                        'data-invalid-type': 'syntax',
                        'data-invalid-message': 'Invalid symbol'
                    }, util_1.defrag(util_1.trimEnd(bs)))] : array_1.push(array_1.unshift(as, bs), cs),
                rest
            ], ([as, bs], rest) => [
                array_1.unshift(as, bs),
                rest
            ]))));
        },
        {
            '../../../combinator': 28,
            '../../inline': 79,
            '../../source': 117,
            '../../util': 125,
            'spica/array': 6,
            'typed-dom': 21
        }
    ],
    102: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.makeAttrs = exports.attribute = exports.html = void 0;
            const global_1 = _dereq_('spica/global');
            const alias_1 = _dereq_('spica/alias');
            const inline_1 = _dereq_('../inline');
            const combinator_1 = _dereq_('../../combinator');
            const util_1 = _dereq_('../util');
            const source_1 = _dereq_('../source');
            const memoize_1 = _dereq_('spica/memoize');
            const typed_dom_1 = _dereq_('typed-dom');
            const array_1 = _dereq_('spica/array');
            const tags = alias_1.ObjectFreeze([
                'sup',
                'sub',
                'small',
                'bdo',
                'bdi'
            ]);
            const attributes = {
                bdo: {
                    dir: alias_1.ObjectFreeze([
                        'ltr',
                        'rtl'
                    ])
                }
            };
            void alias_1.ObjectSetPrototypeOf(attributes, null);
            void alias_1.ObjectValues(attributes).forEach(o => void alias_1.ObjectSetPrototypeOf(o, null));
            exports.html = combinator_1.lazy(() => combinator_1.creator(combinator_1.validate('<', combinator_1.union([
                combinator_1.match(/^(?=<(wbr)(?=[ >]))/, combinator_1.memoize(([, tag]) => tag, tag => combinator_1.surround(source_1.str(`<${ tag }`), combinator_1.some(combinator_1.union([exports.attribute])), source_1.str('>'), true, ([, as = []], rest) => [
                    [typed_dom_1.html(tag, makeAttrs(attributes[tag], as, [], 'html'))],
                    rest
                ]))),
                combinator_1.match(/^(?=<(sup|sub|small|bdo|bdi)(?=[ >]))/, combinator_1.memoize(([, tag]) => tag, tag => combinator_1.validate(new global_1.RegExp(`^<${ tag }[^\\n>]*>\\S[\\s\\S]*?</${ tag }>`), combinator_1.surround(combinator_1.surround(source_1.str(`<${ tag }`), combinator_1.some(exports.attribute), source_1.str('>'), true), util_1.startTight(combinator_1.context((() => {
                    switch (tag) {
                    case 'bdo':
                    case 'bdi':
                        return { state: { in: { bdx: true } } };
                    case 'sup':
                    case 'sub':
                        return {
                            state: { in: { supsub: true } },
                            syntax: {
                                inline: {
                                    annotation: false,
                                    reference: false
                                }
                            }
                        };
                    case 'small':
                    default:
                        return { state: { in: { small: true } } };
                    }
                })(), combinator_1.some(combinator_1.union([inline_1.inline]), `</${ tag }>`))), source_1.str(`</${ tag }>`), false, ([as, bs, cs], rest, context) => util_1.isTight(bs, 0, bs.length) ? [
                    [elem(tag, as, util_1.trimEnd(bs), cs, context)],
                    rest
                ] : void 0)))),
                combinator_1.match(/^(?=<([a-z]+)(?=[ >]))/, ([, tag]) => combinator_1.surround(combinator_1.surround(source_1.str(`<${ tag }`), combinator_1.some(exports.attribute), source_1.str('>'), true), util_1.startTight(combinator_1.some(combinator_1.union([inline_1.inline]), `</${ tag }>`)), source_1.str(`</${ tag }>`), false, ([as, bs, cs], rest) => util_1.isTight(bs, 0, bs.length) ? [
                    [elem(tag, as, util_1.trimEnd(bs), cs, {})],
                    rest
                ] : as.length === 1 ? [
                    array_1.push(array_1.unshift(as, bs), cs),
                    rest
                ] : void 0, ([as, bs], rest) => as.length === 1 ? [
                    array_1.unshift(as, bs),
                    rest
                ] : void 0))
            ]))));
            exports.attribute = combinator_1.union([source_1.str(/^ [a-z]+(?:-[a-z]+)*(?:="(?:\\[^\n]|[^\n"])*")?(?=[ >])/)]);
            function elem(tag, as, bs, cs, context) {
                var _a, _b, _c, _d, _e, _f, _g, _h;
                let attrs;
                if (!tags.includes(tag)) {
                    return invalid('tag', 'Invalid HTML tag', as, bs, cs);
                }
                switch (tag) {
                case 'bdo':
                case 'bdi':
                    switch (true) {
                    case (_b = (_a = context.state) === null || _a === void 0 ? void 0 : _a.in) === null || _b === void 0 ? void 0 : _b.bdx:
                        return invalid('nest', 'Cannot nest bdo/bdi HTML tag', as, bs, cs);
                    }
                    break;
                case 'sup':
                case 'sub':
                    switch (true) {
                    case (_d = (_c = context.state) === null || _c === void 0 ? void 0 : _c.in) === null || _d === void 0 ? void 0 : _d.supsub:
                        return invalid('nest', 'Cannot nest sup/sub HTML tag', as, bs, cs);
                    }
                    break;
                case 'small':
                    switch (true) {
                    case (_f = (_e = context.state) === null || _e === void 0 ? void 0 : _e.in) === null || _f === void 0 ? void 0 : _f.supsub:
                    case (_h = (_g = context.state) === null || _g === void 0 ? void 0 : _g.in) === null || _h === void 0 ? void 0 : _h.small:
                        return invalid('nest', 'Cannot nest small HTML tag', as, bs, cs);
                    }
                    break;
                }
                switch (true) {
                case util_1.stringify(as[as.length - 1]) !== '>' || 'data-invalid-syntax' in (attrs = makeAttrs(attributes[tag], as.slice(1, -1).map(util_1.stringify), [], 'html')):
                    return invalid('attribute', 'Invalid HTML attribute', as, bs, cs);
                case cs.length === 0:
                    return invalid('closer', 'Missing closing HTML tag', as, bs, cs);
                default:
                    return typed_dom_1.html(tag, attrs, util_1.defrag(bs));
                }
            }
            function invalid(type, message, as, bs, cs) {
                return typed_dom_1.html('span', {
                    class: 'invalid',
                    'data-invalid-syntax': 'html',
                    'data-invalid-type': type,
                    'data-invalid-message': message
                }, util_1.defrag(array_1.push(array_1.unshift(as, bs), cs)));
            }
            const requiredAttributes = memoize_1.memoize(spec => alias_1.ObjectEntries(spec).filter(([, v]) => alias_1.isFrozen(v)), new WeakMap());
            function makeAttrs(spec, params, classes, syntax) {
                let invalid = classes.includes('invalid');
                const attrs = params.reduce((attrs, param) => {
                    var _a;
                    param = param.slice(1);
                    const key = param.split('=', 1)[0];
                    const val = param.includes('=') ? param.slice(key.length + 2, -1).replace(/\\(.?)/g, '$1') : void 0;
                    invalid = invalid || !spec || key in attrs;
                    ((_a = spec === null || spec === void 0 ? void 0 : spec[key]) === null || _a === void 0 ? void 0 : _a.includes(val)) ? attrs[key] = val || '' : invalid = invalid || !!spec;
                    return attrs;
                }, alias_1.ObjectCreate(null));
                invalid = invalid || !!spec && !requiredAttributes(spec).every(([k]) => k in attrs);
                if (invalid) {
                    void classes.push('invalid');
                    attrs.class = array_1.join(classes, ' ').trim();
                    attrs['data-invalid-syntax'] = syntax;
                    attrs['data-invalid-type'] = syntax === 'html' ? 'attribute' : 'parameter';
                    attrs['data-invalid-message'] = `Invalid ${ attrs['data-invalid-type'] }`;
                }
                return attrs;
            }
            exports.makeAttrs = makeAttrs;
        },
        {
            '../../combinator': 28,
            '../inline': 79,
            '../source': 117,
            '../util': 125,
            'spica/alias': 5,
            'spica/array': 6,
            'spica/global': 12,
            'spica/memoize': 13,
            'typed-dom': 21
        }
    ],
    103: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.htmlentity = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const typed_dom_1 = _dereq_('typed-dom');
            const parser = typed_dom_1.html('textarea');
            exports.htmlentity = combinator_1.creator(combinator_1.validate('&', combinator_1.focus(/^&[0-9A-Za-z]+;/, entity => [
                [(parser.innerHTML = entity, parser.value)],
                ''
            ])));
        },
        {
            '../../combinator': 28,
            'typed-dom': 21
        }
    ],
    104: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.insertion = void 0;
            const inline_1 = _dereq_('../inline');
            const combinator_1 = _dereq_('../../combinator');
            const util_1 = _dereq_('../util');
            const source_1 = _dereq_('../source');
            const typed_dom_1 = _dereq_('typed-dom');
            const array_1 = _dereq_('spica/array');
            exports.insertion = combinator_1.lazy(() => combinator_1.creator(combinator_1.surround(source_1.str('++'), util_1.startTight(combinator_1.union([combinator_1.some(inline_1.inline, '++')])), source_1.str('++'), false, ([as, bs, cs], rest) => util_1.isTight(bs, 0, bs.length) ? [
                [typed_dom_1.html('ins', util_1.defrag(util_1.trimEnd(bs)))],
                rest
            ] : [
                array_1.unshift(as, bs),
                cs[0] + rest
            ], ([as, bs], rest) => [
                array_1.unshift(as, bs),
                rest
            ])));
        },
        {
            '../../combinator': 28,
            '../inline': 79,
            '../source': 117,
            '../util': 125,
            'spica/array': 6,
            'typed-dom': 21
        }
    ],
    105: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.sanitize = exports.attribute = exports.uri = exports.link = exports.attributes = void 0;
            const global_1 = _dereq_('spica/global');
            const alias_1 = _dereq_('spica/alias');
            const inline_1 = _dereq_('../inline');
            const combinator_1 = _dereq_('../../combinator');
            const util_1 = _dereq_('../util');
            const source_1 = _dereq_('../source');
            const html_1 = _dereq_('./html');
            const autolink_1 = _dereq_('../autolink');
            const typed_dom_1 = _dereq_('typed-dom');
            const {origin} = global_1.location;
            exports.attributes = { nofollow: [void 0] };
            void alias_1.ObjectSetPrototypeOf(exports.attributes, null);
            exports.link = combinator_1.lazy(() => combinator_1.subline(combinator_1.creator(10, combinator_1.validate([
                '[',
                '{'
            ], combinator_1.bind(combinator_1.fmap(combinator_1.guard(context => {
                var _a, _b, _c;
                return (_c = (_b = (_a = context.syntax) === null || _a === void 0 ? void 0 : _a.inline) === null || _b === void 0 ? void 0 : _b.link) !== null && _c !== void 0 ? _c : true;
            }, combinator_1.validate(/^(?:\[[^\n]*?\])?\{[^\n]+?\}/, combinator_1.tails([
                combinator_1.context({ syntax: { inline: { link: false } } }, util_1.dup(combinator_1.union([
                    combinator_1.surround('[', inline_1.media, ']'),
                    combinator_1.surround('[', inline_1.shortmedia, ']'),
                    combinator_1.surround('[', util_1.startTight(combinator_1.context({
                        syntax: {
                            inline: {
                                link: false,
                                media: false,
                                annotation: false,
                                reference: false,
                                extension: false,
                                autolink: false
                            }
                        }
                    }, combinator_1.some(inline_1.inline, /^\\?\n|^]/))), ']', true)
                ]))),
                util_1.dup(combinator_1.surround(/^{(?![{}])/, combinator_1.inits([
                    exports.uri,
                    combinator_1.some(exports.attribute)
                ]), /^ ?}/))
            ]))), ([as, bs]) => bs ? [
                as,
                bs
            ] : [
                [],
                as
            ]), ([content, params], rest, context) => {
                if (!util_1.isTight(content, 0, content.length))
                    return;
                if (combinator_1.eval(combinator_1.some(autolink_1.autolink)(util_1.stringify(content), context), []).some(node => typeof node === 'object'))
                    return;
                const INSECURE_URI = params.shift();
                const el = typed_dom_1.html('a', {
                    href: INSECURE_URI,
                    rel: `noopener${ params.includes(' nofollow') ? ' nofollow noreferrer' : '' }`
                }, content.length > 0 ? content = util_1.defrag(util_1.trimEnd(content)) : decode(INSECURE_URI || '.').replace(/^h(?=ttps?:\/\/[^/?#\s])/, params.includes(' nofollow') ? '' : 'h').replace(/^tel:/, ''));
                if (!sanitize(el, el, INSECURE_URI))
                    return [
                        [el],
                        rest
                    ];
                void typed_dom_1.define(el, alias_1.ObjectAssign(html_1.makeAttrs(exports.attributes, params, [...el.classList], 'link'), { nofollow: void 0 }));
                return [
                    [el],
                    rest
                ];
            })))));
            exports.uri = combinator_1.union([combinator_1.match(/^ ?(?! )/, combinator_1.memoize(([delim]) => delim, delim => source_1.str(delim ? /^\S+/ : /^[^\s{}]+/)))]);
            exports.attribute = combinator_1.union([source_1.str(/^ [a-z]+(?:-[a-z]+)*(?:="(?:\\[^\n]|[^\n"])*")?(?=[ }])/)]);
            function sanitize(uri, target, source) {
                let type;
                let message;
                switch (uri.protocol) {
                case 'http:':
                case 'https:': {
                        const {host} = uri;
                        host && uri.origin !== origin && target.tagName === 'A' && void target.setAttribute('target', '_blank');
                        if (host)
                            return true;
                        type = 'parameter';
                        message = 'Invalid host';
                        break;
                    }
                case target.tagName === 'A' && 'tel:':
                    if (`tel:${ uri.textContent.replace(/-(?=[0-9])/g, '') }` === source)
                        return true;
                    type = 'content';
                    message = 'Invalid phone number';
                    break;
                default:
                    type = 'parameter';
                    message = 'Invalid protocol';
                }
                void target.classList.toggle('invalid', true);
                void typed_dom_1.define(target, {
                    'data-invalid-syntax': 'link',
                    'data-invalid-type': type,
                    'data-invalid-message': message,
                    ...target.tagName === 'A' ? {
                        href: null,
                        rel: null
                    } : { 'data-src': null }
                });
                return false;
            }
            exports.sanitize = sanitize;
            function decode(uri) {
                try {
                    uri = global_1.decodeURI(uri);
                } finally {
                    return uri.replace(/\s+/g, global_1.encodeURI);
                }
            }
        },
        {
            '../../combinator': 28,
            '../autolink': 58,
            '../inline': 79,
            '../source': 117,
            '../util': 125,
            './html': 102,
            'spica/alias': 5,
            'spica/global': 12,
            'typed-dom': 21
        }
    ],
    106: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.mark = void 0;
            const inline_1 = _dereq_('../inline');
            const combinator_1 = _dereq_('../../combinator');
            const util_1 = _dereq_('../util');
            const source_1 = _dereq_('../source');
            const typed_dom_1 = _dereq_('typed-dom');
            const array_1 = _dereq_('spica/array');
            exports.mark = combinator_1.lazy(() => combinator_1.creator(combinator_1.surround(source_1.str('=='), util_1.startTight(combinator_1.union([combinator_1.some(inline_1.inline, '==')])), source_1.str('=='), false, ([as, bs, cs], rest) => util_1.isTight(bs, 0, bs.length) ? [
                [typed_dom_1.html('mark', util_1.defrag(util_1.trimEnd(bs)))],
                rest
            ] : [
                array_1.unshift(as, bs),
                cs[0] + rest
            ], ([as, bs], rest) => [
                array_1.unshift(as, bs),
                rest
            ])));
        },
        {
            '../../combinator': 28,
            '../inline': 79,
            '../source': 117,
            '../util': 125,
            'spica/array': 6,
            'typed-dom': 21
        }
    ],
    107: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.math = exports.cache = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const source_1 = _dereq_('../source');
            const typed_dom_1 = _dereq_('typed-dom');
            const cache_1 = _dereq_('spica/cache');
            exports.cache = new cache_1.Cache(20);
            exports.math = combinator_1.creator(combinator_1.fmap(combinator_1.surround('${', combinator_1.union([source_1.str(/^(?:(?!}\$)[^\n])+/)]), '}$'), ([source]) => exports.cache.has(source = `\${${ source.trim() }}$`) ? [exports.cache.get(source).cloneNode(true)] : [typed_dom_1.html('span', {
                    class: 'math notranslate',
                    'data-src': source
                }, source)]));
        },
        {
            '../../combinator': 28,
            '../source': 117,
            'spica/cache': 8,
            'typed-dom': 21
        }
    ],
    108: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.media = exports.cache = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const util_1 = _dereq_('../util');
            const link_1 = _dereq_('./link');
            const source_1 = _dereq_('../source');
            const html_1 = _dereq_('./html');
            const typed_dom_1 = _dereq_('typed-dom');
            const cache_1 = _dereq_('spica/cache');
            const array_1 = _dereq_('spica/array');
            const url = typed_dom_1.html('a');
            exports.cache = new cache_1.Cache(10);
            exports.media = combinator_1.lazy(() => combinator_1.creator(combinator_1.validate([
                '![',
                '!{'
            ], combinator_1.bind(combinator_1.fmap(combinator_1.open('!', combinator_1.guard(context => {
                var _a, _b, _c;
                return (_c = (_b = (_a = context.syntax) === null || _a === void 0 ? void 0 : _a.inline) === null || _b === void 0 ? void 0 : _b.media) !== null && _c !== void 0 ? _c : true;
            }, combinator_1.validate(/^(?:\[[^\n]*?\])?\{[^\n]+?\}/, combinator_1.tails([
                util_1.dup(combinator_1.surround(/^\[(?!\s)/, combinator_1.some(combinator_1.union([
                    bracket,
                    source_1.text
                ]), /^(?:\\?\n|\])/), ']', true)),
                util_1.dup(combinator_1.surround(/^{(?![{}])/, combinator_1.inits([
                    link_1.uri,
                    combinator_1.some(link_1.attribute)
                ]), /^ ?}/))
            ])))), ([as, bs]) => bs ? [
                [array_1.join(as)],
                bs
            ] : [
                [''],
                as
            ]), ([[text], params], rest, context) => {
                var _a, _b, _c;
                const INSECURE_URI = params.shift();
                if (text.length > 0 && text.slice(-2).trim() === '')
                    return;
                url.href = INSECURE_URI;
                const key = url.href;
                const media = exports.cache.has(key) ? exports.cache.get(key).cloneNode(true) : typed_dom_1.html('img', {
                    class: 'media',
                    'data-src': INSECURE_URI,
                    alt: text.trim()
                });
                if (exports.cache.has(key)) {
                    media.hasAttribute('alt') && void media.setAttribute('alt', text.trim());
                } else {
                    if (!link_1.sanitize(url, media, INSECURE_URI))
                        return [
                            [media],
                            rest
                        ];
                }
                void typed_dom_1.define(media, {
                    ...html_1.makeAttrs(link_1.attributes, params, [...media.classList], 'media'),
                    nofollow: void 0
                });
                return ((_c = (_b = (_a = context.syntax) === null || _a === void 0 ? void 0 : _a.inline) === null || _b === void 0 ? void 0 : _b.link) !== null && _c !== void 0 ? _c : true) && media.tagName === 'IMG' ? combinator_1.fmap(link_1.link, ([el]) => [typed_dom_1.define(el, { target: '_blank' }, [media])])(`{ ${ INSECURE_URI }${ array_1.join(params) } }${ rest }`, context) : [
                    [media],
                    rest
                ];
            }))));
            const bracket = combinator_1.lazy(() => combinator_1.creator(combinator_1.union([
                combinator_1.surround(source_1.char('('), combinator_1.some(combinator_1.union([
                    bracket,
                    source_1.text
                ]), /^(?:\\?\n|\))/), source_1.char(')'), true, void 0, ([as, bs = []], rest) => [
                    array_1.unshift(as, bs),
                    rest
                ]),
                combinator_1.surround(source_1.char('['), combinator_1.some(combinator_1.union([
                    bracket,
                    source_1.text
                ]), /^(?:\\?\n|\])/), source_1.char(']'), true, void 0, ([as, bs = []], rest) => [
                    array_1.unshift(as, bs),
                    rest
                ]),
                combinator_1.surround(source_1.char('{'), combinator_1.some(combinator_1.union([
                    bracket,
                    source_1.text
                ]), /^(?:\\?\n|\})/), source_1.char('}'), true, void 0, ([as, bs = []], rest) => [
                    array_1.unshift(as, bs),
                    rest
                ]),
                combinator_1.surround(source_1.char('"'), combinator_1.some(source_1.text, /^(?:\\?\n|")/), source_1.char('"'), true, void 0, ([as, bs = []], rest) => [
                    array_1.unshift(as, bs),
                    rest
                ])
            ])));
        },
        {
            '../../combinator': 28,
            '../source': 117,
            '../util': 125,
            './html': 102,
            './link': 105,
            'spica/array': 6,
            'spica/cache': 8,
            'typed-dom': 21
        }
    ],
    109: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.reference = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const util_1 = _dereq_('../util');
            const inline_1 = _dereq_('../inline');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.reference = combinator_1.lazy(() => combinator_1.subline(combinator_1.creator(combinator_1.bind(combinator_1.surround('[[', combinator_1.guard(context => {
                var _a, _b, _c;
                return (_c = (_b = (_a = context.syntax) === null || _a === void 0 ? void 0 : _a.inline) === null || _b === void 0 ? void 0 : _b.reference) !== null && _c !== void 0 ? _c : true;
            }, combinator_1.validate(/^\S[^\n]*\]\]/, util_1.startTight(combinator_1.context({
                syntax: {
                    inline: {
                        annotation: false,
                        reference: false,
                        media: false
                    }
                },
                state: void 0
            }, combinator_1.subsequence([
                alias,
                util_1.startTight(combinator_1.some(inline_1.inline, ']'))
            ]))))), ']]'), (ns, rest) => util_1.isTight(ns, typeof ns[0] === 'object' && ns[0].tagName === 'ABBR' ? 1 : 0, ns.length) ? [
                [typed_dom_1.html('sup', {
                        class: 'reference',
                        ...attrs(ns)
                    }, util_1.defrag(util_1.trimEnd(ns)))],
                rest
            ] : void 0))));
            const alias = combinator_1.creator(combinator_1.focus(/^~[A-za-z][A-Za-z0-9',-]*(?: [A-Za-z0-9',-]+)*(?:(?=]])|\|(?:(?=]])| ))/, source => [
                [typed_dom_1.html('abbr', source.slice(1, ~(~source.lastIndexOf('|') || ~source.length)))],
                ''
            ]));
            function attrs(ns) {
                return { 'data-alias': typeof ns[0] === 'object' && ns[0].tagName === 'ABBR' ? util_1.stringify(ns.shift()) : void 0 };
            }
        },
        {
            '../../combinator': 28,
            '../inline': 79,
            '../util': 125,
            'typed-dom': 21
        }
    ],
    110: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.ruby = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const util_1 = _dereq_('../util');
            const htmlentity_1 = _dereq_('./htmlentity');
            const typed_dom_1 = _dereq_('typed-dom');
            const array_1 = _dereq_('spica/array');
            exports.ruby = combinator_1.lazy(() => combinator_1.creator(combinator_1.bind(combinator_1.sequence([
                combinator_1.surround('[', combinator_1.focus(/^(?!\\?\s)(?:\\[^\n]|[^\]\n])+(?=]\()/, text), ']'),
                combinator_1.surround('(', combinator_1.focus(/^(?:\\[^\n]|[^\)\n])+(?=\))/, text), ')')
            ]), ([texts, rubies], rest) => {
                switch (true) {
                case rubies.length <= texts.length:
                    return [
                        [typed_dom_1.html('ruby', util_1.defrag(texts.reduce((acc, _, i) => array_1.push(acc, array_1.unshift([texts[i]], i < rubies.length && rubies[i].trim() !== '' ? [
                                typed_dom_1.html('rp', '('),
                                typed_dom_1.html('rt', rubies[i]),
                                typed_dom_1.html('rp', ')')
                            ] : [typed_dom_1.html('rt')])), [])))],
                        rest
                    ];
                case texts.length === 1 && [...texts[0]].length >= rubies.length:
                    return [
                        [typed_dom_1.html('ruby', util_1.defrag([...texts[0]].reduce((acc, _, i, texts) => array_1.push(acc, array_1.unshift([texts[i]], i < rubies.length && rubies[i].trim() !== '' ? [
                                typed_dom_1.html('rp', '('),
                                typed_dom_1.html('rt', rubies[i]),
                                typed_dom_1.html('rp', ')')
                            ] : [typed_dom_1.html('rt')])), [])))],
                        rest
                    ];
                default:
                    return [
                        [typed_dom_1.html('ruby', util_1.defrag(array_1.unshift([array_1.join(texts, ' ')], [
                                typed_dom_1.html('rp', '('),
                                typed_dom_1.html('rt', array_1.join(rubies, ' ')),
                                typed_dom_1.html('rp', ')')
                            ])))],
                        rest
                    ];
                }
            })));
            const text = combinator_1.creator((source, context) => {
                var _a;
                const {resources} = context;
                const next = /[\s\\&]/;
                const acc = [''];
                let printable = false;
                while (source !== '') {
                    resources && void --resources.creation;
                    const i = source.search(next);
                    switch (i) {
                    case -1:
                        acc[acc.length - 1] += source;
                        printable = printable || !!source.trim();
                        source = '';
                        continue;
                    case 0:
                        switch (source[0]) {
                        case '\\':
                            acc[acc.length - 1] += source[i + 1] || '';
                            printable = printable || !!((_a = source[i + 1]) === null || _a === void 0 ? void 0 : _a.trim());
                            source = source.slice(2);
                            continue;
                        case '&': {
                                const result = htmlentity_1.htmlentity(source, context);
                                const str = combinator_1.eval(result, [])[0] || source[0];
                                acc[acc.length - 1] += str;
                                printable = printable || !!str.trim();
                                source = combinator_1.exec(result, source.slice(str.length));
                                continue;
                            }
                        default:
                            source[0].trim() ? acc[acc.length - 1] += source[0] : void acc.push('');
                            printable = printable || !!source[0].trim();
                            source = source.slice(1);
                            continue;
                        }
                    default:
                        acc[acc.length - 1] += source.slice(0, i);
                        printable = printable || !!source.slice(0, i).trim();
                        source = source.slice(i);
                        continue;
                    }
                }
                return printable ? [
                    [acc],
                    ''
                ] : void 0;
            });
        },
        {
            '../../combinator': 28,
            '../util': 125,
            './htmlentity': 103,
            'spica/array': 6,
            'typed-dom': 21
        }
    ],
    111: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.shortmedia = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const url_1 = _dereq_('./autolink/url');
            const media_1 = _dereq_('./media');
            exports.shortmedia = combinator_1.rewrite(combinator_1.guard(context => {
                var _a, _b, _c;
                return (_c = (_b = (_a = context.syntax) === null || _a === void 0 ? void 0 : _a.inline) === null || _b === void 0 ? void 0 : _b.media) !== null && _c !== void 0 ? _c : true;
            }, combinator_1.open('!', url_1.url)), combinator_1.convert(source => `!${ url_1.url2link(source.slice(1)) }`, combinator_1.union([media_1.media])));
        },
        {
            '../../combinator': 28,
            './autolink/url': 87,
            './media': 108
        }
    ],
    112: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.strong = void 0;
            const inline_1 = _dereq_('../inline');
            const combinator_1 = _dereq_('../../combinator');
            const util_1 = _dereq_('../util');
            const emphasis_1 = _dereq_('./emphasis');
            const source_1 = _dereq_('../source');
            const typed_dom_1 = _dereq_('typed-dom');
            const array_1 = _dereq_('spica/array');
            exports.strong = combinator_1.lazy(() => combinator_1.creator(combinator_1.surround(source_1.str('**'), util_1.startTight(combinator_1.some(combinator_1.union([
                emphasis_1.emphasis,
                combinator_1.some(inline_1.inline, '*')
            ]), '**')), source_1.str('**'), false, ([as, bs, cs], rest) => util_1.isTight(bs, 0, bs.length) ? [
                [typed_dom_1.html('strong', util_1.defrag(util_1.trimEnd(bs)))],
                rest
            ] : [
                array_1.unshift(as, bs),
                cs[0] + rest
            ], ([as, bs], rest) => [
                array_1.unshift(as, bs),
                rest
            ])));
        },
        {
            '../../combinator': 28,
            '../inline': 79,
            '../source': 117,
            '../util': 125,
            './emphasis': 92,
            'spica/array': 6,
            'typed-dom': 21
        }
    ],
    113: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.template = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const source_1 = _dereq_('../source');
            const typed_dom_1 = _dereq_('typed-dom');
            const array_1 = _dereq_('spica/array');
            exports.template = combinator_1.lazy(() => combinator_1.creator(combinator_1.rewrite(combinator_1.surround('{{', combinator_1.some(combinator_1.union([
                bracket,
                source_1.escsource
            ]), '}'), '}}', true), source => [
                [typed_dom_1.html('span', { class: 'template' }, source)],
                ''
            ])));
            const bracket = combinator_1.lazy(() => combinator_1.creator(combinator_1.union([
                combinator_1.surround(source_1.char('('), combinator_1.some(combinator_1.union([
                    bracket,
                    source_1.escsource
                ]), ')'), source_1.char(')'), true, void 0, ([as, bs = []], rest) => [
                    array_1.unshift(as, bs),
                    rest
                ]),
                combinator_1.surround(source_1.char('['), combinator_1.some(combinator_1.union([
                    bracket,
                    source_1.escsource
                ]), ']'), source_1.char(']'), true, void 0, ([as, bs = []], rest) => [
                    array_1.unshift(as, bs),
                    rest
                ]),
                combinator_1.surround(source_1.char('{'), combinator_1.some(combinator_1.union([
                    bracket,
                    source_1.escsource
                ]), '}'), source_1.char('}'), true, void 0, ([as, bs = []], rest) => [
                    array_1.unshift(as, bs),
                    rest
                ]),
                combinator_1.surround(source_1.char('"'), combinator_1.some(source_1.escsource, /^(?:\\?\n|")/), source_1.char('"'), true, void 0, ([as, bs = []], rest) => [
                    array_1.unshift(as, bs),
                    rest
                ])
            ])));
        },
        {
            '../../combinator': 28,
            '../source': 117,
            'spica/array': 6,
            'typed-dom': 21
        }
    ],
    114: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.localize = void 0;
            const combinator_1 = _dereq_('../combinator');
            const ja_1 = _dereq_('./locale/ja');
            const typed_dom_1 = _dereq_('typed-dom');
            function localize(block) {
                return combinator_1.fmap(block, es => {
                    for (let i = 0, len = es.length; i < len; ++i) {
                        const bs = es[i].getElementsByClassName('linebreak');
                        for (let i = 0, len = bs.length; i < len; ++i) {
                            const el = bs[i];
                            if (!el.firstChild || el.firstElementChild)
                                continue;
                            if (!check(el))
                                continue;
                            void el.replaceChild(typed_dom_1.html('wbr'), el.firstChild);
                        }
                    }
                    return es;
                });
            }
            exports.localize = localize;
            function check(el) {
                const char = lastChar(el.previousSibling);
                if (!char)
                    return false;
                return ja_1.japanese(char);
            }
            function lastChar(node) {
                while (node) {
                    if ('id' in node && node.classList.contains('media'))
                        return '';
                    const str = text(node);
                    if (str)
                        return [...str.slice(-2)].pop() || '';
                    node = node.previousSibling;
                }
                return '';
            }
            function text(node) {
                switch ('id' in node && node.tagName) {
                case 'RUBY':
                    for (let i = node.childNodes.length; i--;) {
                        const child = node.childNodes[i];
                        switch ('id' in child && child.tagName) {
                        case 'RT':
                        case 'RP':
                            break;
                        default:
                            return 'data' in child ? child.data : child.textContent;
                        }
                    }
                    return '';
                default:
                    return 'data' in node ? node.data : node.textContent;
                }
            }
        },
        {
            '../combinator': 28,
            './locale/ja': 115,
            'typed-dom': 21
        }
    ],
    115: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.japanese = void 0;
            function japanese(char) {
                switch (char) {
                case '\u3001':
                case '\u3002':
                case '\uFF01':
                case '\uFF1F':
                    return true;
                default:
                    return false;
                }
            }
            exports.japanese = japanese;
        },
        {}
    ],
    116: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.segment = void 0;
            const combinator_1 = _dereq_('../combinator');
            const heading_1 = _dereq_('./block/heading');
            const codeblock_1 = _dereq_('./block/codeblock');
            const mathblock_1 = _dereq_('./block/mathblock');
            const extension_1 = _dereq_('./block/extension');
            const source_1 = _dereq_('./source');
            const normalize_1 = _dereq_('./api/normalize');
            const array_1 = _dereq_('spica/array');
            const parser = combinator_1.union([
                heading_1.segment,
                codeblock_1.segment,
                mathblock_1.segment,
                extension_1.segment,
                combinator_1.some(source_1.contentline),
                combinator_1.some(source_1.emptyline)
            ]);
            function segment(source) {
                if (source.length > 1000 * 1000)
                    return ['# ***Too large input over 1,000,000 characters***'];
                const segments = [];
                while (source !== '') {
                    const r = parser(source, {});
                    const segs = combinator_1.eval(r, []);
                    const rest = combinator_1.exec(r);
                    source.length - rest.length > 10 * 1000 ? segments.push('# ***Too large block over 10,000 characters***') : segs.length === 0 ? segments.push(source.slice(0, source.length - rest.length)) : array_1.push(segments, segs);
                    source = rest;
                }
                return segments;
            }
            exports.segment = segment;
        },
        {
            '../combinator': 28,
            './api/normalize': 56,
            './block/codeblock': 61,
            './block/extension': 63,
            './block/heading': 68,
            './block/mathblock': 71,
            './source': 117,
            'spica/array': 6
        }
    ],
    117: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var text_1 = _dereq_('./source/text');
            Object.defineProperty(exports, 'text', {
                enumerable: true,
                get: function () {
                    return text_1.text;
                }
            });
            var linebreak_1 = _dereq_('./source/linebreak');
            Object.defineProperty(exports, 'linebreak', {
                enumerable: true,
                get: function () {
                    return linebreak_1.linebreak;
                }
            });
            var escapable_1 = _dereq_('./source/escapable');
            Object.defineProperty(exports, 'escsource', {
                enumerable: true,
                get: function () {
                    return escapable_1.escsource;
                }
            });
            var unescapable_1 = _dereq_('./source/unescapable');
            Object.defineProperty(exports, 'unescsource', {
                enumerable: true,
                get: function () {
                    return unescapable_1.unescsource;
                }
            });
            var str_1 = _dereq_('./source/str');
            Object.defineProperty(exports, 'str', {
                enumerable: true,
                get: function () {
                    return str_1.str;
                }
            });
            var char_1 = _dereq_('./source/char');
            Object.defineProperty(exports, 'char', {
                enumerable: true,
                get: function () {
                    return char_1.char;
                }
            });
            var line_1 = _dereq_('./source/line');
            Object.defineProperty(exports, 'contentline', {
                enumerable: true,
                get: function () {
                    return line_1.contentline;
                }
            });
            Object.defineProperty(exports, 'emptyline', {
                enumerable: true,
                get: function () {
                    return line_1.emptyline;
                }
            });
            Object.defineProperty(exports, 'anyline', {
                enumerable: true,
                get: function () {
                    return line_1.anyline;
                }
            });
        },
        {
            './source/char': 118,
            './source/escapable': 119,
            './source/line': 120,
            './source/linebreak': 121,
            './source/str': 122,
            './source/text': 123,
            './source/unescapable': 124
        }
    ],
    118: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.char = void 0;
            const combinator_1 = _dereq_('../../combinator');
            function char(char) {
                return combinator_1.creator(source => {
                    if (source === '')
                        return;
                    return source[0] === char ? [
                        [char],
                        source.slice(char.length)
                    ] : void 0;
                });
            }
            exports.char = char;
            ;
        },
        { '../../combinator': 28 }
    ],
    119: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.escsource = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const separator = /\s|(?=[\x00-\x7F])[^A-Za-z0-9\s]/;
            exports.escsource = combinator_1.creator(source => {
                if (source === '')
                    return;
                const i = source.search(separator);
                switch (i) {
                case -1:
                    return [
                        [source],
                        ''
                    ];
                case 0:
                    switch (source[0]) {
                    case '\\':
                        return [
                            [source.slice(0, 2)],
                            source.slice(2)
                        ];
                    default:
                        return [
                            [source.slice(0, 1)],
                            source.slice(1)
                        ];
                    }
                default:
                    return [
                        [source.slice(0, i)],
                        source.slice(i)
                    ];
                }
            });
        },
        { '../../combinator': 28 }
    ],
    120: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.contentline = exports.emptyline = exports.anyline = void 0;
            const combinator_1 = _dereq_('../../combinator');
            exports.anyline = combinator_1.line(() => [
                [],
                ''
            ], false);
            exports.emptyline = combinator_1.line(s => combinator_1.isEmpty(s) ? [
                [],
                ''
            ] : void 0, false);
            exports.contentline = combinator_1.line(s => !combinator_1.isEmpty(s) ? [
                [],
                ''
            ] : void 0, false);
        },
        { '../../combinator': 28 }
    ],
    121: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.linebreak = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const text_1 = _dereq_('./text');
            exports.linebreak = combinator_1.fmap(combinator_1.focus('\n', combinator_1.union([text_1.text])), ns => ns);
        },
        {
            '../../combinator': 28,
            './text': 123
        }
    ],
    122: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.str = void 0;
            const combinator_1 = _dereq_('../../combinator');
            function str(pattern) {
                return typeof pattern === 'string' ? combinator_1.creator(source => {
                    if (source === '')
                        return;
                    return source.slice(0, pattern.length) === pattern ? [
                        [pattern],
                        source.slice(pattern.length)
                    ] : void 0;
                }) : combinator_1.creator(source => {
                    if (source === '')
                        return;
                    const m = source.match(pattern);
                    return m && m[0].length > 0 ? [
                        [m[0]],
                        source.slice(m[0].length)
                    ] : void 0;
                });
            }
            exports.str = str;
            ;
        },
        { '../../combinator': 28 }
    ],
    123: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.text = exports.alphanumeric = exports.separator = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const str_1 = _dereq_('./str');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.separator = /\s|[\x00-\x7F]|\S#/;
            exports.alphanumeric = /^[A-Za-z0-9]+/;
            const next = /[\S\n]|$/;
            const repeat = str_1.str(/^(.)\1*/);
            exports.text = combinator_1.creator(source => {
                if (source === '')
                    return;
                const i = source.search(exports.separator);
                switch (i) {
                case -1:
                    return [
                        [source],
                        ''
                    ];
                case 0:
                    switch (source[0]) {
                    case '\\':
                        switch (source[1]) {
                        case void 0:
                            return [
                                [],
                                ''
                            ];
                        case '\n':
                            return [
                                [typed_dom_1.html('span', { class: 'linebreak' }, ' ')],
                                source.slice(2)
                            ];
                        default:
                            return [
                                [source.slice(1, 2)],
                                source.slice(2)
                            ];
                        }
                    case '\n':
                        return [
                            [typed_dom_1.html('br')],
                            source.slice(1)
                        ];
                    case '*':
                    case '+':
                    case '~':
                    case '=':
                        return source[1] === source[0] ? repeat(source, {}) : [
                            [source[0]],
                            source.slice(1)
                        ];
                    default:
                        const b = source[0].trim() === '';
                        const i = b ? source.search(next) : 0;
                        const r = !b && source.match(exports.alphanumeric);
                        if (r)
                            return [
                                [r[0]],
                                source.slice(r[0].length)
                            ];
                        return i === source.length || source[i] === '\n' || source[i] === '\\' && source[i + 1] === '\n' ? [
                            [],
                            source.slice(i)
                        ] : [
                            [source.slice(0, i || 1)],
                            source.slice(i || 1)
                        ];
                    }
                default:
                    return [
                        [source.slice(0, i)],
                        source.slice(i)
                    ];
                }
            });
        },
        {
            '../../combinator': 28,
            './str': 122,
            'typed-dom': 21
        }
    ],
    124: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.unescsource = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const text_1 = _dereq_('./text');
            exports.unescsource = combinator_1.creator(source => {
                if (source === '')
                    return;
                const i = source.search(text_1.separator);
                switch (i) {
                case -1:
                    return [
                        [source],
                        ''
                    ];
                case 0:
                    const r = source.match(text_1.alphanumeric);
                    if (r)
                        return [
                            [r[0]],
                            source.slice(r[0].length)
                        ];
                    return [
                        [source.slice(0, 1)],
                        source.slice(1)
                    ];
                default:
                    return [
                        [source.slice(0, i)],
                        source.slice(i)
                    ];
                }
            });
        },
        {
            '../../combinator': 28,
            './text': 123
        }
    ],
    125: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.suppress = exports.stringify = exports.defrag = exports.dup = exports.trimEnd = exports.startTight = exports.isTight = void 0;
            const alias_1 = _dereq_('spica/alias');
            const combinator_1 = _dereq_('../combinator');
            const inline_1 = _dereq_('./inline');
            const typed_dom_1 = _dereq_('typed-dom');
            const array_1 = _dereq_('spica/array');
            function isTight(nodes, start, end) {
                if (end < 0)
                    return isTight(nodes, start, nodes.length + end);
                if (start >= nodes.length)
                    return true;
                switch (false) {
                case start < nodes.length:
                case end <= nodes.length:
                    return false;
                case end > start:
                    return true;
                }
                --end;
                return typeof nodes[end] === 'string' && nodes[end].length > 1 ? isVisible(nodes[end], 'end', 0) || isVisible(nodes[end], 'end', 1) : isVisible(nodes[end], 'end') || isVisible(nodes[end - 1], 'end');
            }
            exports.isTight = isTight;
            function isVisible(node, dir, offset = 0) {
                if (!node)
                    return false;
                switch (typeof node) {
                case 'string':
                    const char = node[dir === 'start' ? 0 + offset : node.length - 1 - offset];
                    switch (char) {
                    case '':
                    case ' ':
                    case '\t':
                    case '\n':
                        return false;
                    default:
                        return char.trim() !== '';
                    }
                default:
                    switch (node.tagName) {
                    case 'BR':
                    case 'WBR':
                        return false;
                    case 'SPAN':
                        return node.className !== 'linebreak';
                    case 'SUP':
                        return node.className !== 'comment';
                    default:
                        return true;
                    }
                }
            }
            function startTight(parser) {
                return (source, context) => {
                    var _a, _b;
                    if (source === '')
                        return;
                    switch (source[0]) {
                    case ' ':
                    case '\u3000':
                    case '\t':
                    case '\n':
                        return;
                    case '&':
                        switch (true) {
                        case source.length > 2 && source[1] !== ' ' && ((_a = combinator_1.eval(inline_1.htmlentity(source, context))) === null || _a === void 0 ? void 0 : _a[0].trim()) == '':
                            return;
                        }
                        break;
                    case '<':
                        switch (true) {
                        case source.length >= 7 && source[1] === '#' && !!inline_1.comment(source, context):
                        case source.length >= 5 && source[1] === 'w' && source.slice(0, 5) === '<wbr>':
                        case source.length >= 4 && source[1] === 'b' && source.slice(0, 4) === '<br>':
                            return;
                        }
                        break;
                    }
                    return ((_b = source[0] === '\\' ? source[1] : source[0]) === null || _b === void 0 ? void 0 : _b.trim()) ? parser(source, context) : void 0;
                };
            }
            exports.startTight = startTight;
            function trimEnd(nodes) {
                if (nodes.length === 0)
                    return nodes;
                const node = nodes[nodes.length - 1];
                return typeof node === 'object' && node.tagName === 'BR' ? array_1.pop(nodes)[0] : nodes;
            }
            exports.trimEnd = trimEnd;
            function dup(parser) {
                return combinator_1.fmap(parser, ns => [ns]);
            }
            exports.dup = dup;
            function defrag(nodes) {
                const acc = [];
                for (let i = 0; i < nodes.length; ++i) {
                    const node = nodes[i];
                    if (node === '')
                        continue;
                    if (acc.length === 0 || typeof node === 'object' || typeof nodes[i - 1] === 'object') {
                        void acc.push(node);
                    } else {
                        acc[acc.length - 1] += node;
                    }
                }
                return acc;
            }
            exports.defrag = defrag;
            function stringify(nodes) {
                if (typeof nodes === 'string')
                    return nodes;
                if (!alias_1.isArray(nodes))
                    return nodes.textContent;
                let acc = '';
                for (let i = 0; i < nodes.length; ++i) {
                    const node = nodes[i];
                    acc += typeof node === 'string' ? node : node.textContent;
                }
                return acc;
            }
            exports.stringify = stringify;
            function suppress(target) {
                if ('id' in target && target.tagName === 'OL') {
                    void typed_dom_1.apply(target, '.footnote > sup:last-child > a', { href: null });
                }
                for (let es = target.children, i = 0, len = es.length; i < len; ++i) {
                    const el = es[i];
                    switch (el.tagName) {
                    case 'DL':
                        void typed_dom_1.apply(el, 'dt', { id: null });
                        continue;
                    default:
                        el.id && void typed_dom_1.define(el, { id: null });
                        continue;
                    }
                }
                void typed_dom_1.apply(target, 'a.index[href], a.label[href], .annotation[id], .annotation[id] > a[href], .reference[id], .reference[id] > a[href]', {
                    id: null,
                    href: null
                });
                return target;
            }
            exports.suppress = suppress;
        },
        {
            '../combinator': 28,
            './inline': 79,
            'spica/alias': 5,
            'spica/array': 6,
            'typed-dom': 21
        }
    ],
    126: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var render_1 = _dereq_('./renderer/render');
            Object.defineProperty(exports, 'render', {
                enumerable: true,
                get: function () {
                    return render_1.render;
                }
            });
        },
        { './renderer/render': 127 }
    ],
    127: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.render = void 0;
            const global_1 = _dereq_('spica/global');
            const code_1 = _dereq_('./render/code');
            const math_1 = _dereq_('./render/math');
            const media_1 = _dereq_('./render/media');
            const url_1 = _dereq_('spica/url');
            const {origin} = global_1.location;
            function render(target, opts = {}) {
                opts = {
                    code: code_1.code,
                    math: math_1.math,
                    media: {},
                    ...opts
                };
                try {
                    switch (true) {
                    case target.classList.contains('invalid'):
                        return;
                    case !!opts.code && !target.firstElementChild && target.matches('pre.code'):
                        return void opts.code(target);
                    case !!opts.math && !target.firstElementChild && target.matches('.math'):
                        return void opts.math(target);
                    case target.matches('.media:not(img)'):
                        return void target.parentElement.parentElement.replaceChild(target, target.parentElement);
                    case !!opts.media && target.matches('img.media:not([src])[data-src]'): {
                            const el = media_1.media(target, opts.media);
                            if (!el)
                                return;
                            void el.setAttribute('data-src', new url_1.URL(target.getAttribute('data-src'), origin).reference);
                            const scope = el.matches('img') ? target : target.parentElement;
                            return void scope.parentElement.replaceChild(el, scope);
                        }
                    default:
                        for (let es = target.querySelectorAll('img.media:not([src])[data-src], a > .media:not(img), pre.code, .math'), i = 0, len = es.length; i < len; ++i) {
                            const el = es[i];
                            void render(el, opts);
                        }
                        return;
                    }
                } catch (reason) {
                    console.error(reason);
                }
            }
            exports.render = render;
        },
        {
            './render/code': 128,
            './render/math': 129,
            './render/media': 130,
            'spica/global': 12,
            'spica/url': 18
        }
    ],
    128: [
        function (_dereq_, module, exports) {
            (function (global) {
                'use strict';
                var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
                    if (k2 === undefined)
                        k2 = k;
                    Object.defineProperty(o, k2, {
                        enumerable: true,
                        get: function () {
                            return m[k];
                        }
                    });
                } : function (o, m, k, k2) {
                    if (k2 === undefined)
                        k2 = k;
                    o[k2] = m[k];
                });
                var __setModuleDefault = this && this.__setModuleDefault || (Object.create ? function (o, v) {
                    Object.defineProperty(o, 'default', {
                        enumerable: true,
                        value: v
                    });
                } : function (o, v) {
                    o['default'] = v;
                });
                var __importStar = this && this.__importStar || function (mod) {
                    if (mod && mod.__esModule)
                        return mod;
                    var result = {};
                    if (mod != null)
                        for (var k in mod)
                            if (Object.hasOwnProperty.call(mod, k))
                                __createBinding(result, mod, k);
                    __setModuleDefault(result, mod);
                    return result;
                };
                Object.defineProperty(exports, '__esModule', { value: true });
                exports.code = void 0;
                const Prism = __importStar(typeof window !== 'undefined' ? window['Prism'] : typeof global !== 'undefined' ? global['Prism'] : null);
                function code(target) {
                    void requestAnimationFrame(() => void Prism.highlightElement(target, false));
                }
                exports.code = code;
            }.call(this, typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {}));
        },
        {}
    ],
    129: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.math = void 0;
            const math_1 = _dereq_('../../parser/inline/math');
            const typed_dom_1 = _dereq_('typed-dom');
            void MathJax.Hub.Config({
                tex2jax: {
                    inlineMath: [[
                            '${',
                            '}$'
                        ]],
                    displayMath: [[
                            '$$\n',
                            '\n$$'
                        ]]
                }
            });
            function math(target) {
                const source = target.textContent;
                return math_1.cache.has(source) ? void typed_dom_1.define(target, math_1.cache.get(source).cloneNode(true).childNodes) : void queue(target, () => target.matches('span') ? void math_1.cache.set(source, target.cloneNode(true)) : void 0);
            }
            exports.math = math;
            function queue(target, callback = () => void 0) {
                void MathJax.Hub.Queue([
                    'Typeset',
                    MathJax.Hub,
                    target,
                    callback
                ]);
            }
        },
        {
            '../../parser/inline/math': 107,
            'typed-dom': 21
        }
    ],
    130: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.media = void 0;
            const global_1 = _dereq_('spica/global');
            const twitter_1 = _dereq_('./media/twitter');
            const youtube_1 = _dereq_('./media/youtube');
            const gist_1 = _dereq_('./media/gist');
            const slideshare_1 = _dereq_('./media/slideshare');
            const pdf_1 = _dereq_('./media/pdf');
            const video_1 = _dereq_('./media/video');
            const audio_1 = _dereq_('./media/audio');
            const image_1 = _dereq_('./media/image');
            const {origin} = global_1.location;
            function media(target, opts) {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                opts = {
                    twitter: twitter_1.twitter,
                    youtube: youtube_1.youtube,
                    gist: gist_1.gist,
                    slideshare: slideshare_1.slideshare,
                    pdf: pdf_1.pdf,
                    video: video_1.video,
                    audio: audio_1.audio,
                    image: image_1.image,
                    ...opts
                };
                const url = new URL(target.getAttribute('data-src'), origin);
                const alt = target.getAttribute('alt') || '';
                (_a = opts.video) === null || _a === void 0 ? void 0 : _a.call(opts, url, alt);
                return ((_b = opts.twitter) === null || _b === void 0 ? void 0 : _b.call(opts, url)) || ((_c = opts.youtube) === null || _c === void 0 ? void 0 : _c.call(opts, url)) || ((_d = opts.gist) === null || _d === void 0 ? void 0 : _d.call(opts, url)) || ((_e = opts.slideshare) === null || _e === void 0 ? void 0 : _e.call(opts, url)) || ((_f = opts.pdf) === null || _f === void 0 ? void 0 : _f.call(opts, url)) || ((_g = opts.video) === null || _g === void 0 ? void 0 : _g.call(opts, url, alt)) || ((_h = opts.audio) === null || _h === void 0 ? void 0 : _h.call(opts, url, alt)) || ((_j = opts.image) === null || _j === void 0 ? void 0 : _j.call(opts, url, alt));
            }
            exports.media = media;
        },
        {
            './media/audio': 131,
            './media/gist': 132,
            './media/image': 133,
            './media/pdf': 134,
            './media/slideshare': 135,
            './media/twitter': 136,
            './media/video': 137,
            './media/youtube': 138,
            'spica/global': 12
        }
    ],
    131: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.audio = void 0;
            const media_1 = _dereq_('../../../parser/inline/media');
            const typed_dom_1 = _dereq_('typed-dom');
            const extensions = new Set([
                '.oga',
                '.ogg'
            ]);
            function audio(url, alt) {
                if (!extensions.has(url.pathname.split(/(?=\.)/).pop()))
                    return;
                if (media_1.cache.has(url.href))
                    return media_1.cache.get(url.href).cloneNode(true);
                return media_1.cache.set(url.href, typed_dom_1.html('audio', {
                    class: 'media',
                    src: url.href,
                    alt,
                    controls: '',
                    style: 'width: 100%;'
                }).cloneNode(true));
            }
            exports.audio = audio;
        },
        {
            '../../../parser/inline/media': 108,
            'typed-dom': 21
        }
    ],
    132: [
        function (_dereq_, module, exports) {
            (function (global) {
                'use strict';
                Object.defineProperty(exports, '__esModule', { value: true });
                exports.gist = void 0;
                const global_1 = _dereq_('spica/global');
                const parser_1 = _dereq_('../../../parser');
                const media_1 = _dereq_('../../../parser/inline/media');
                const dompurify_1 = typeof window !== 'undefined' ? window['DOMPurify'] : typeof global !== 'undefined' ? global['DOMPurify'] : null;
                const typed_dom_1 = _dereq_('typed-dom');
                const origins = new Set(['https://gist.github.com']);
                function gist(url) {
                    if (!origins.has(url.origin))
                        return;
                    if (!url.pathname.match(/^\/[\w-]+?\/\w{32}(?!\w)/))
                        return;
                    if (media_1.cache.has(url.href))
                        return media_1.cache.get(url.href).cloneNode(true);
                    return typed_dom_1.HTML.div({
                        class: 'media',
                        style: 'position: relative;'
                    }, [typed_dom_1.HTML.em(`loading ${ url.href }`)], (f, tag) => {
                        const outer = f(tag);
                        void $.ajax(`${ url.href }.json`, {
                            dataType: 'jsonp',
                            timeout: 10 * 1000,
                            cache: true,
                            success({div, stylesheet, description}) {
                                if (!stylesheet.startsWith('https://github.githubassets.com/'))
                                    return;
                                outer.innerHTML = dompurify_1.sanitize(`<div style="position: relative; margin-bottom: -1em;">${ div }</div>`);
                                const gist = outer.querySelector('.gist');
                                void gist.insertBefore(typed_dom_1.html('div', { class: 'gist-description' }, [typed_dom_1.HTML.a({ style: 'color: #555; font-weight: 600;' }, description, () => parser_1.parse(`{ ${ url.href } }`).querySelector('a')).element]), gist.firstChild);
                                void media_1.cache.set(url.href, outer.cloneNode(true));
                                if (global_1.document.head.querySelector(`link[rel="stylesheet"][href="${ stylesheet }"]`))
                                    return;
                                void global_1.document.head.appendChild(typed_dom_1.html('link', {
                                    rel: 'stylesheet',
                                    href: stylesheet,
                                    crossorigin: 'anonymous'
                                }));
                            },
                            error({status, statusText}) {
                                void typed_dom_1.define(outer, [parser_1.parse(`*{ ${ url.href } }*\n\n\`\`\`\n${ status }\n${ statusText }\n\`\`\``)]);
                            }
                        });
                        return outer;
                    }).element;
                }
                exports.gist = gist;
            }.call(this, typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {}));
        },
        {
            '../../../parser': 52,
            '../../../parser/inline/media': 108,
            'spica/global': 12,
            'typed-dom': 21
        }
    ],
    133: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.image = void 0;
            const media_1 = _dereq_('../../../parser/inline/media');
            const typed_dom_1 = _dereq_('typed-dom');
            function image(url, alt) {
                if (media_1.cache.has(url.href))
                    return media_1.cache.get(url.href).cloneNode(true);
                return media_1.cache.set(url.href, typed_dom_1.html('img', {
                    class: 'media',
                    src: url.href,
                    alt,
                    style: 'max-width: 100%;'
                }).cloneNode(true));
            }
            exports.image = image;
        },
        {
            '../../../parser/inline/media': 108,
            'typed-dom': 21
        }
    ],
    134: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.pdf = void 0;
            const parser_1 = _dereq_('../../../parser');
            const media_1 = _dereq_('../../../parser/inline/media');
            const typed_dom_1 = _dereq_('typed-dom');
            const extensions = new Set(['.pdf']);
            function pdf(url) {
                if (!extensions.has(url.pathname.split(/(?=\.)/).pop()))
                    return;
                if (media_1.cache.has(url.href))
                    return media_1.cache.get(url.href).cloneNode(true);
                return media_1.cache.set(url.href, typed_dom_1.html('div', {
                    class: 'media',
                    style: 'position: relative;'
                }, [
                    typed_dom_1.html('div', { style: 'position: relative; resize: vertical; overflow: hidden; padding-bottom: 10px;' }, [typed_dom_1.html('object', {
                            type: 'application/pdf',
                            data: url.href,
                            style: 'width: 100%; height: 100%; min-height: 400px;'
                        })]),
                    typed_dom_1.html('div', { style: 'word-wrap: break-word;' }, parser_1.parse(`**{ ${ url.href } }**`).firstElementChild.childNodes)
                ]));
            }
            exports.pdf = pdf;
        },
        {
            '../../../parser': 52,
            '../../../parser/inline/media': 108,
            'typed-dom': 21
        }
    ],
    135: [
        function (_dereq_, module, exports) {
            (function (global) {
                'use strict';
                Object.defineProperty(exports, '__esModule', { value: true });
                exports.slideshare = void 0;
                const parser_1 = _dereq_('../../../parser');
                const media_1 = _dereq_('../../../parser/inline/media');
                const dompurify_1 = typeof window !== 'undefined' ? window['DOMPurify'] : typeof global !== 'undefined' ? global['DOMPurify'] : null;
                const typed_dom_1 = _dereq_('typed-dom');
                const origins = new Set(['https://www.slideshare.net']);
                function slideshare(url) {
                    if (!origins.has(url.origin))
                        return;
                    if (!url.pathname.match(/^\/[^/?#]+\/[^/?#]+/))
                        return;
                    if (media_1.cache.has(url.href))
                        return media_1.cache.get(url.href).cloneNode(true);
                    return typed_dom_1.HTML.div({
                        class: 'media',
                        style: 'position: relative;'
                    }, [typed_dom_1.HTML.em(`loading ${ url.href }`)], (f, tag) => {
                        const outer = f(tag);
                        void $.ajax(`https://www.slideshare.net/api/oembed/2?url=${ url.href }&format=json`, {
                            dataType: 'jsonp',
                            timeout: 10 * 1000,
                            cache: true,
                            success({html}) {
                                outer.innerHTML = dompurify_1.sanitize(`<div style="position: relative; padding-top: 83%;">${ html }</div>`, { ADD_TAGS: ['iframe'] });
                                const iframe = outer.querySelector('iframe');
                                void iframe.setAttribute('style', 'position: absolute; top: 0; bottom: 0; left: 0; right: 0; width: 100%; height: 100%;');
                                iframe.parentElement.style.paddingTop = `${ +iframe.height / +iframe.width * 100 }%`;
                                void outer.appendChild(iframe.nextElementSibling);
                                void outer.lastElementChild.removeAttribute('style');
                                void media_1.cache.set(url.href, outer.cloneNode(true));
                            },
                            error({status, statusText}) {
                                void typed_dom_1.define(outer, [parser_1.parse(`*{ ${ url.href } }*\n\n\`\`\`\n${ status }\n${ statusText }\n\`\`\``)]);
                            }
                        });
                        return outer;
                    }).element;
                }
                exports.slideshare = slideshare;
            }.call(this, typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {}));
        },
        {
            '../../../parser': 52,
            '../../../parser/inline/media': 108,
            'typed-dom': 21
        }
    ],
    136: [
        function (_dereq_, module, exports) {
            (function (global) {
                'use strict';
                Object.defineProperty(exports, '__esModule', { value: true });
                exports.twitter = void 0;
                const global_1 = _dereq_('spica/global');
                const parser_1 = _dereq_('../../../parser');
                const dompurify_1 = typeof window !== 'undefined' ? window['DOMPurify'] : typeof global !== 'undefined' ? global['DOMPurify'] : null;
                const typed_dom_1 = _dereq_('typed-dom');
                const cache_1 = _dereq_('spica/cache');
                const origins = new Set(['https://twitter.com']);
                const cache = new cache_1.Cache(10);
                function twitter(url) {
                    var _a;
                    if (!origins.has(url.origin))
                        return;
                    if (!url.pathname.match(/^\/\w+\/status\/[0-9]{15,}(?!\w)/))
                        return;
                    if (cache.has(url.href)) {
                        const el = cache.get(url.href).cloneNode(true);
                        (_a = global_1.window.twttr) === null || _a === void 0 ? void 0 : _a.widgets.load(el);
                        return el;
                    }
                    return typed_dom_1.HTML.div({
                        class: 'media',
                        style: 'position: relative;'
                    }, [typed_dom_1.HTML.em(`loading ${ url.href }`)], (f, tag) => {
                        const outer = f(tag);
                        void $.ajax(`https://publish.twitter.com/oembed?url=${ url.href.replace('?', '&') }&omit_script=true`, {
                            dataType: 'jsonp',
                            timeout: 10 * 1000,
                            cache: true,
                            success({html}) {
                                outer.innerHTML = dompurify_1.sanitize(`<div style="margin-top: -10px; margin-bottom: -10px;">${ html }</div>`);
                                void cache.set(url.href, outer.cloneNode(true));
                                if (global_1.window.twttr)
                                    return void global_1.window.twttr.widgets.load(outer);
                                const id = 'twitter-wjs';
                                if (global_1.document.getElementById(id))
                                    return;
                                void global_1.document.body.appendChild(typed_dom_1.html('script', {
                                    id,
                                    src: 'https://platform.twitter.com/widgets.js'
                                }));
                            },
                            error({status, statusText}) {
                                void typed_dom_1.define(outer, [parser_1.parse(`*{ ${ url.href } }*\n\n\`\`\`\n${ status }\n${ statusText }\n\`\`\``)]);
                            }
                        });
                        return outer;
                    }).element;
                }
                exports.twitter = twitter;
            }.call(this, typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {}));
        },
        {
            '../../../parser': 52,
            'spica/cache': 8,
            'spica/global': 12,
            'typed-dom': 21
        }
    ],
    137: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.video = void 0;
            const media_1 = _dereq_('../../../parser/inline/media');
            const typed_dom_1 = _dereq_('typed-dom');
            const extensions = new Set([
                '.webm',
                '.ogv'
            ]);
            function video(url, alt) {
                if (!extensions.has(url.pathname.split(/(?=\.)/).pop()))
                    return;
                if (media_1.cache.has(url.href))
                    return media_1.cache.get(url.href).cloneNode(true);
                return media_1.cache.set(url.href, typed_dom_1.html('video', {
                    class: 'media',
                    src: url.href,
                    alt,
                    muted: '',
                    controls: '',
                    style: 'max-width: 100%;'
                }).cloneNode(true));
            }
            exports.video = video;
        },
        {
            '../../../parser/inline/media': 108,
            'typed-dom': 21
        }
    ],
    138: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.youtube = void 0;
            const media_1 = _dereq_('../../../parser/inline/media');
            const typed_dom_1 = _dereq_('typed-dom');
            const origins = new Set([
                'https://www.youtube.com',
                'https://youtu.be'
            ]);
            function youtube(url) {
                if (!origins.has(url.origin))
                    return;
                if (url.origin === 'https://www.youtube.com' && !url.pathname.match(/^\/watch$/))
                    return;
                if (url.origin === 'https://youtu.be' && !url.pathname.match(/^\/[\w-]+$/))
                    return;
                if (media_1.cache.has(url.href))
                    return media_1.cache.get(url.href).cloneNode(true);
                return media_1.cache.set(url.href, typed_dom_1.html('div', {
                    class: 'media',
                    style: 'position: relative;'
                }, [typed_dom_1.html('div', { style: 'position: relative; padding-top: 56.25%;' }, [typed_dom_1.html('iframe', {
                            src: `https://www.youtube.com/embed/${ url.origin === 'https://www.youtube.com' && url.href.replace(/.+?=/, '').replace(/&/, '?') || url.origin === 'https://youtu.be' && url.href.slice(url.href.indexOf('/', 9) + 1) }`,
                            allowfullscreen: '',
                            frameborder: '0',
                            style: 'position: absolute; top: 0; right: 0; width: 100%; height: 100%;'
                        })])]));
            }
            exports.youtube = youtube;
        },
        {
            '../../../parser/inline/media': 108,
            'typed-dom': 21
        }
    ],
    139: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var toc_1 = _dereq_('./util/toc');
            Object.defineProperty(exports, 'toc', {
                enumerable: true,
                get: function () {
                    return toc_1.toc;
                }
            });
            var info_1 = _dereq_('./util/info');
            Object.defineProperty(exports, 'info', {
                enumerable: true,
                get: function () {
                    return info_1.info;
                }
            });
            var context_1 = _dereq_('./util/context');
            Object.defineProperty(exports, 'context', {
                enumerable: true,
                get: function () {
                    return context_1.context;
                }
            });
        },
        {
            './util/context': 140,
            './util/info': 143,
            './util/toc': 144
        }
    ],
    140: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.context = void 0;
            function context(base, bound = 'id' in base && base.id ? `#${ base.id }` : 'section, article, aside, blockquote') {
                const memory = new WeakMap();
                const context = 'id' in base && base.closest(bound) || null;
                return el => {
                    var _a;
                    const node = memory.has(el.parentNode) ? el.parentNode : el.parentNode.parentNode;
                    return memory.get(node) || memory.set(node, el.closest(bound) === context).get(node);
                };
            }
            exports.context = context;
        },
        {}
    ],
    141: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.figure = void 0;
            const global_1 = _dereq_('spica/global');
            const context_1 = _dereq_('./context');
            const inline_1 = _dereq_('../parser/inline');
            const label_1 = _dereq_('../parser/inline/extension/label');
            const multimap_1 = _dereq_('spica/multimap');
            const typed_dom_1 = _dereq_('typed-dom');
            const array_1 = _dereq_('spica/array');
            function* figure(target, footnotes) {
                const refs = new multimap_1.MultiMap([
                    ...target.querySelectorAll('a.label'),
                    ...(footnotes === null || footnotes === void 0 ? void 0 : footnotes.annotation.querySelectorAll('a.label')) || [],
                    ...(footnotes === null || footnotes === void 0 ? void 0 : footnotes.reference.querySelectorAll('a.label')) || []
                ].filter(context_1.context(target)).map(el => [
                    el.getAttribute('data-label'),
                    el
                ]));
                const numbers = new Map();
                let base = '0';
                let bases = base.split('.');
                for (let defs = target.children, i = 0, len = defs.length; i < len; ++i) {
                    const def = defs[i];
                    if (![
                            'FIGURE',
                            'H1',
                            'H2',
                            'H3'
                        ].includes(def.tagName))
                        continue;
                    if (base === '0' && def.tagName[0] === 'H')
                        continue;
                    const label = def.tagName === 'FIGURE' ? def.getAttribute('data-label') : `$-${ increment(bases, def) }`;
                    if (label === '$-')
                        continue;
                    const group = label.split('-', 1)[0];
                    let number = label_1.number(label, numbers.has(group) && !inline_1.isFixed(label) ? array_1.join(numbers.get(group).split('.').slice(0, inline_1.isFormatted(label) ? label.slice(label.lastIndexOf('-') + 1).split('.').length : bases.length), '.') : base);
                    if (number.split('.').pop() === '0') {
                        switch (true) {
                        case number === '0':
                            number = `0${ '.0'.repeat(bases.length - 1) }`;
                            break;
                        case number.startsWith('0.'):
                            number = array_1.join(bases.slice(0).reduce((ns, _, i, bs) => {
                                i === ns.length ? bs.length = i : ns[i] = +ns[i] > +bs[i] ? ns[i] : +ns[i] === 0 ? bs[i] : `${ +bs[i] + 1 }`;
                                return ns;
                            }, number.split('.')), '.');
                            break;
                        }
                        base = number;
                        bases = base.split('.');
                        void numbers.clear();
                        continue;
                    }
                    void numbers.set(group, number);
                    const figid = inline_1.isFormatted(label) ? label.slice(0, label.lastIndexOf('-')) : label;
                    void def.setAttribute('id', `label:${ figid }`);
                    const figindex = group === '$' ? `(${ number })` : `${ capitalize(group) } ${ number }`;
                    void typed_dom_1.define(def.querySelector(':scope > .figindex'), group === '$' ? figindex : `${ figindex }. `);
                    for (const ref of refs.take(figid, global_1.Infinity).filter(ref => ref.hash.slice(1) !== def.id)) {
                        if (ref.hash.slice(1) === def.id && ref.textContent === figindex)
                            continue;
                        yield typed_dom_1.define(ref, { href: `#${ def.id }` }, figindex);
                    }
                }
                return;
            }
            exports.figure = figure;
            function increment(bases, el) {
                const cursor = +el.tagName[1] - 1 || 1;
                return cursor < bases.length || bases.length === 1 ? array_1.join(array_1.push(bases.slice(0, cursor - 1), [
                    +bases[cursor - 1] + 1,
                    '0'
                ]), '.') : '';
            }
            function capitalize(label) {
                return label[0].toUpperCase() + label.slice(1);
            }
        },
        {
            '../parser/inline': 79,
            '../parser/inline/extension/label': 100,
            './context': 140,
            'spica/array': 6,
            'spica/global': 12,
            'spica/multimap': 14,
            'typed-dom': 21
        }
    ],
    142: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.reference = exports.annotation = exports.footnote = void 0;
            const global_1 = _dereq_('spica/global');
            const context_1 = _dereq_('./context');
            const indexee_1 = _dereq_('../parser/inline/extension/indexee');
            const multimap_1 = _dereq_('spica/multimap');
            const memoize_1 = _dereq_('spica/memoize');
            const typed_dom_1 = _dereq_('typed-dom');
            const array_1 = _dereq_('spica/array');
            function* footnote(target, footnotes) {
                yield* exports.annotation(target, footnotes.annotation);
                yield* exports.reference(target, footnotes.reference);
                return;
            }
            exports.footnote = footnote;
            exports.annotation = build('annotation', n => `*${ n }`);
            exports.reference = build('reference', n => `[${ n }]`);
            const identify = memoize_1.memoize(ref => ref.getAttribute('data-alias') || ref.innerHTML, new WeakMap());
            function build(syntax, marker) {
                const contentify = memoize_1.memoize(ref => typed_dom_1.frag(ref.childNodes), new WeakMap());
                return function* (target, footnote) {
                    var _a;
                    const check = context_1.context(target);
                    const defs = new Map();
                    const refs = new multimap_1.MultiMap();
                    const titles = new Map();
                    let count = 0;
                    for (let es = target.querySelectorAll(`.${ syntax }`), i = 0, len = es.length; i < len; ++i) {
                        const ref = es[i];
                        if (!check(ref))
                            continue;
                        void ++count;
                        const identifier = identify(ref);
                        const title = ref.classList.contains('invalid') ? void 0 : titles.get(identifier) || ref.title || indexee_1.text(ref) || void 0;
                        title && !titles.has(title) && void titles.set(identifier, title);
                        !title && void refs.set(identifier, ref);
                        const content = contentify(ref);
                        const refIndex = count;
                        const refId = ref.id || `${ syntax }:ref:${ count }`;
                        const def = void 0 || defs.get(identifier) || defs.set(identifier, typed_dom_1.html('li', {
                            id: `${ syntax }:def:${ defs.size + 1 }`,
                            class: 'footnote'
                        }, [
                            content.cloneNode(true),
                            typed_dom_1.html('sup', [])
                        ])).get(identifier);
                        if (title && content.firstChild && def.childNodes.length === 1) {
                            void def.insertBefore(content.cloneNode(true), def.lastChild);
                            for (const ref of refs.take(identifier, global_1.Infinity)) {
                                void ref.classList.remove('invalid');
                                void typed_dom_1.define(ref, {
                                    title,
                                    'data-invalid-syntax': null,
                                    'data-invalid-type': null,
                                    'data-invalid-message': null
                                });
                            }
                        }
                        const defIndex = +def.id.slice(def.id.lastIndexOf(':') + 1);
                        const defId = def.id;
                        const refChild = ref.firstChild;
                        yield typed_dom_1.define(ref, {
                            id: refId,
                            ...title ? { title } : {
                                class: ref.classList.contains('invalid') ? void 0 : array_1.join([
                                    ...ref.classList,
                                    'invalid'
                                ], ' '),
                                'data-invalid-syntax': syntax,
                                'data-invalid-type': 'content',
                                'data-invalid-message': 'Missing content'
                            }
                        }, ((_a = refChild === null || refChild === void 0 ? void 0 : refChild.getAttribute('href')) === null || _a === void 0 ? void 0 : _a.slice(1)) === defId && refChild.textContent === marker(defIndex) ? void 0 : [typed_dom_1.html('a', {
                                href: `#${ defId }`,
                                rel: 'noopener'
                            }, marker(defIndex))]).firstChild;
                        void def.lastChild.appendChild(typed_dom_1.html('a', {
                            href: `#${ refId }`,
                            rel: 'noopener',
                            title: content.firstChild && ref.hasAttribute('data-alias') ? title : void 0
                        }, ` ~${ refIndex }`));
                    }
                    count = 0;
                    const {children} = footnote;
                    let length = children.length;
                    I:
                        for (const def of defs.values()) {
                            void ++count;
                            while (length > defs.size) {
                                const node = children[count - 1];
                                if (equal(node, def))
                                    continue I;
                                yield footnote.removeChild(node);
                                void --length;
                            }
                            const node = count <= length ? children[count - 1] : null;
                            if (node && equal(node, def))
                                continue;
                            yield footnote.insertBefore(def, node);
                            void ++length;
                        }
                    while (length > defs.size) {
                        yield footnote.removeChild(children[defs.size]);
                        void --length;
                    }
                    return;
                };
            }
            function equal(a, b) {
                return a.id === b.id && a.innerHTML === b.innerHTML;
            }
        },
        {
            '../parser/inline/extension/indexee': 98,
            './context': 140,
            'spica/array': 6,
            'spica/global': 12,
            'spica/memoize': 13,
            'spica/multimap': 14,
            'typed-dom': 21
        }
    ],
    143: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.info = void 0;
            const context_1 = _dereq_('./context');
            function info(source) {
                const filter = context_1.context(source, 'section, article, aside, blockquote, .media, pre.notranslate, .math');
                return {
                    hashtag: find('a.hashtag[href]'),
                    hashref: find('a.hashref[href]'),
                    channel: find('a.channel[href]'),
                    account: find('a.account[href]'),
                    mention: find('a.address[href]'),
                    url: find('a[href]').filter(el => [
                        'http:',
                        'https:'
                    ].includes(el.protocol)).filter(el => !el.matches('.hashtag, .hashref, .channel, .account, .address')),
                    tel: find('a[href]').filter(el => el.protocol === 'tel:'),
                    email: find('a.email[href]'),
                    media: find('.media[data-src]')
                };
                function find(selector) {
                    return [...source.querySelectorAll(selector)].filter(filter);
                }
            }
            exports.info = info;
        },
        { './context': 140 }
    ],
    144: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.toc = void 0;
            const typed_dom_1 = _dereq_('typed-dom');
            const array_1 = _dereq_('spica/array');
            const Tags = [...Array(6)].map((_, i) => `H${ i + 1 }`);
            function toc(source) {
                const hs = [...source.children].filter(el => el.id !== '' && Tags.includes(el.tagName));
                return parse(cons(hs));
            }
            exports.toc = toc;
            function parse(node, index = []) {
                return typed_dom_1.html('ul', node.map(([el, cs], i) => {
                    const idx = array_1.push(index.slice(0), [i + 1]);
                    return typed_dom_1.html('li', array_1.push([typed_dom_1.html('a', {
                            href: `#${ el.id }`,
                            rel: 'noopener',
                            'data-index': array_1.join(idx, '.')
                        }, el.textContent)], cs.length > 0 ? [parse(cs, idx)] : []));
                }));
            }
            function cons(hs) {
                return hs.reduce((hss, h) => {
                    const hs = hss.pop() || [];
                    return hs.length === 0 || level(h) > level(hs[0]) ? array_1.push(hss, [array_1.push(hs, [h])]) : array_1.push(hss, [
                        hs,
                        [h]
                    ]);
                }, []).map(hs => [
                    hs.shift(),
                    cons(hs)
                ]);
            }
            function level(h) {
                return +h.tagName[1];
            }
        },
        {
            'spica/array': 6,
            'typed-dom': 21
        }
    ],
    'securemark': [
        function (_dereq_, module, exports) {
            'use strict';
            var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
                if (k2 === undefined)
                    k2 = k;
                Object.defineProperty(o, k2, {
                    enumerable: true,
                    get: function () {
                        return m[k];
                    }
                });
            } : function (o, m, k, k2) {
                if (k2 === undefined)
                    k2 = k;
                o[k2] = m[k];
            });
            var __exportStar = this && this.__exportStar || function (m, exports) {
                for (var p in m)
                    if (p !== 'default' && !exports.hasOwnProperty(p))
                        __createBinding(exports, m, p);
            };
            Object.defineProperty(exports, '__esModule', { value: true });
            _dereq_('spica/global');
            __exportStar(_dereq_('./src/parser'), exports);
            __exportStar(_dereq_('./src/util'), exports);
            __exportStar(_dereq_('./src/renderer'), exports);
        },
        {
            './src/parser': 52,
            './src/renderer': 126,
            './src/util': 139,
            'spica/global': 12
        }
    ]
}, {}, [
    1,
    2,
    3,
    'securemark',
    4
]);
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
    }
}(typeof self !== 'undefined' ? self : this, function () {
    return require('securemark');
}));