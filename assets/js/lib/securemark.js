/*! securemark v0.192.0 https://github.com/falsandtru/securemark | (c) 2017, falsandtru | UNLICENSED */
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
            './global': 14
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
            './global': 14,
            './type': 28
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
                put(key, value) {
                    !this.nullish && value === global_1.undefined ? this.nullish = true : global_1.undefined;
                    const hit = this.store.has(key);
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
                set(key, value) {
                    this.put(key, value);
                    return this;
                }
                get(key) {
                    const val = this.store.get(key);
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
            './global': 14
        }
    ],
    9: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.Cancellation = void 0;
            const global_1 = _dereq_('./global');
            const promise_1 = _dereq_('./promise');
            const exception_1 = _dereq_('./exception');
            const maybe_1 = _dereq_('./monad/maybe');
            const either_1 = _dereq_('./monad/either');
            const noop_1 = _dereq_('./noop');
            const internal = Symbol.for('spica/cancellation::internal');
            class Cancellation extends promise_1.AtomicPromise {
                constructor(cancelees = []) {
                    super(res => resolve = res);
                    var resolve;
                    this[internal] = new Internal(resolve);
                    for (const cancellee of cancelees) {
                        cancellee.register(this.cancel);
                    }
                }
                get alive() {
                    return this[internal].alive;
                }
                get canceled() {
                    return this[internal].canceled;
                }
                register(listener) {
                    return this[internal].register(listener);
                }
                get cancel() {
                    return reason => this[internal].cancel(reason);
                }
                get close() {
                    return reason => this[internal].close(reason);
                }
                get promise() {
                    return val => this[internal].promise(val);
                }
                get maybe() {
                    return val => this[internal].maybe(val);
                }
                get either() {
                    return val => this[internal].either(val);
                }
            }
            exports.Cancellation = Cancellation;
            class Internal {
                constructor(resolve) {
                    this.resolve = resolve;
                    this.alive = true;
                    this.available = true;
                    this.listeners = new global_1.Set();
                }
                get canceled() {
                    return 'reason' in this;
                }
                register(listener) {
                    if (!this.alive) {
                        this.canceled && handler(this.reason);
                        return noop_1.noop;
                    }
                    this.listeners.add(handler);
                    return () => void this.listeners.delete(handler);
                    function handler(reason) {
                        try {
                            listener(reason);
                        } catch (reason) {
                            exception_1.causeAsyncException(reason);
                        }
                    }
                }
                cancel(reason) {
                    if (!this.available)
                        return;
                    this.available = false;
                    this.reason = reason;
                    for (const listener of this.listeners) {
                        listener(reason);
                    }
                    this.resolve(this.reason);
                    this.alive = false;
                }
                close(reason) {
                    if (!this.available)
                        return;
                    this.available = false;
                    this.resolve(promise_1.AtomicPromise.reject(reason));
                    this.alive = false;
                }
                promise(val) {
                    return this.canceled ? promise_1.AtomicPromise.reject(this.reason) : promise_1.AtomicPromise.resolve(val);
                }
                maybe(val) {
                    return maybe_1.Just(val).bind(val => this.canceled ? maybe_1.Nothing : maybe_1.Just(val));
                }
                either(val) {
                    return either_1.Right(val).bind(val => this.canceled ? either_1.Left(this.reason) : either_1.Right(val));
                }
            }
        },
        {
            './exception': 12,
            './global': 14,
            './monad/either': 18,
            './monad/maybe': 22,
            './noop': 26,
            './promise': 27
        }
    ],
    10: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.MultiMap = void 0;
            const array_1 = _dereq_('../array');
            class MultiMap {
                constructor(entries = [], store = new Map()) {
                    this.store = store;
                    for (const [k, v] of entries) {
                        this.set(k, v);
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
                *[Symbol.iterator]() {
                    for (const [k, vs] of this.store) {
                        for (let i = 0; i < vs.length; ++i) {
                            yield [
                                k,
                                vs[i]
                            ];
                        }
                    }
                    return;
                }
            }
            exports.MultiMap = MultiMap;
        },
        { '../array': 6 }
    ],
    11: [
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
            const uncurry = f => uncurry_(f);
            exports.uncurry = uncurry;
            function uncurry_(f) {
                const arity = f.length;
                return (...xs) => arity === 0 || xs.length < 2 || xs.length <= arity ? f(...xs) : uncurry_(f(...array_1.shift(xs, arity)[0]))(...xs);
            }
        },
        {
            './array': 6,
            './global': 14
        }
    ],
    12: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.causeAsyncException = void 0;
            function causeAsyncException(reason) {
                void Promise.reject(reason);
            }
            exports.causeAsyncException = causeAsyncException;
        },
        {}
    ],
    13: [
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
    14: [
        function (_dereq_, module, exports) {
            'use strict';
            const global = void 0 || typeof globalThis !== 'undefined' && globalThis || typeof self !== 'undefined' && self || Function('return this')();
            eval('global.global = global');
            module.exports = global;
        },
        {}
    ],
    15: [
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
        { './global': 14 }
    ],
    16: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.Applicative = void 0;
            const functor_1 = _dereq_('./functor');
            const curry_1 = _dereq_('../curry');
            class Applicative extends functor_1.Functor {
            }
            exports.Applicative = Applicative;
            (function (Applicative) {
                function ap(af, aa) {
                    return aa ? af.bind(f => aa.fmap(curry_1.curry(f))) : aa => ap(af, aa);
                }
                Applicative.ap = ap;
            }(Applicative = exports.Applicative || (exports.Applicative = {})));
        },
        {
            '../curry': 11,
            './functor': 19
        }
    ],
    17: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.Right = exports.Left = exports.Either = void 0;
            const monad_1 = _dereq_('./monad');
            const promise_1 = _dereq_('../promise');
            class Either extends monad_1.Monad {
                constructor(thunk) {
                    super(thunk);
                    void this.EITHER;
                }
                fmap(f) {
                    return this.bind(b => new Right(f(b)));
                }
                ap(b) {
                    return Either.ap(this, b);
                }
                bind(f) {
                    return new Either(() => {
                        const m = this.evaluate();
                        if (m instanceof Left) {
                            return m;
                        }
                        if (m instanceof Right) {
                            return f(m.extract());
                        }
                        if (m instanceof Either) {
                            return m.bind(f);
                        }
                        throw new TypeError(`Spica: Either: Invalid monad value.\n\t${ m }`);
                    });
                }
                join() {
                    return this.bind(m => m);
                }
                extract(left, right) {
                    return !right ? this.evaluate().extract(left) : this.fmap(right).extract(left);
                }
                static do(block) {
                    const iter = block();
                    let val;
                    while (true) {
                        const {
                            value: m,
                            done
                        } = iter.next(val);
                        if (done)
                            return m;
                        const r = m.extract(() => void 0, a => [a]);
                        if (!r)
                            return m;
                        val = r[0];
                    }
                }
            }
            exports.Either = Either;
            (function (Either) {
                function pure(b) {
                    return new Right(b);
                }
                Either.pure = pure;
                Either.Return = pure;
                function sequence(fm) {
                    return fm instanceof Either ? fm.extract(b => promise_1.AtomicPromise.resolve(new Left(b)), a => promise_1.AtomicPromise.resolve(a).then(Either.Return)) : fm.reduce((acc, m) => acc.bind(as => m.fmap(a => [
                        ...as,
                        a
                    ])), Either.Return([]));
                }
                Either.sequence = sequence;
            }(Either = exports.Either || (exports.Either = {})));
            class Left extends Either {
                constructor(a) {
                    super(throwCallError);
                    this.a = a;
                    void this.LEFT;
                }
                bind(_) {
                    return this;
                }
                extract(left) {
                    if (!left)
                        throw this.a;
                    return left(this.a);
                }
            }
            exports.Left = Left;
            class Right extends Either {
                constructor(b) {
                    super(throwCallError);
                    this.b = b;
                    void this.RIGHT;
                }
                bind(f) {
                    return new Either(() => f(this.extract()));
                }
                extract(_, right) {
                    return !right ? this.b : right(this.b);
                }
            }
            exports.Right = Right;
            function throwCallError() {
                throw new Error(`Spica: Either: Invalid thunk call.`);
            }
        },
        {
            '../promise': 27,
            './monad': 23
        }
    ],
    18: [
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
                        if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k))
                            __createBinding(result, mod, k);
                __setModuleDefault(result, mod);
                return result;
            };
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.Right = exports.Left = exports.Either = void 0;
            const Monad = __importStar(_dereq_('./either.impl'));
            class Either extends Monad.Either {
                constructor() {
                    super(() => void 0);
                }
            }
            exports.Either = Either;
            function Left(a) {
                return new Monad.Left(a);
            }
            exports.Left = Left;
            function Right(b) {
                return new Monad.Right(b);
            }
            exports.Right = Right;
        },
        { './either.impl': 17 }
    ],
    19: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.Functor = void 0;
            const lazy_1 = _dereq_('./lazy');
            class Functor extends lazy_1.Lazy {
            }
            exports.Functor = Functor;
            (function (Functor) {
                function fmap(m, f) {
                    return f ? m.fmap(f) : f => m.fmap(f);
                }
                Functor.fmap = fmap;
            }(Functor = exports.Functor || (exports.Functor = {})));
        },
        { './lazy': 20 }
    ],
    20: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.Lazy = void 0;
            class Lazy {
                constructor(thunk) {
                    this.thunk = thunk;
                }
                evaluate() {
                    return this.memory_ = this.memory_ || this.thunk();
                }
            }
            exports.Lazy = Lazy;
        },
        {}
    ],
    21: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.Nothing = exports.Just = exports.Maybe = void 0;
            const monadplus_1 = _dereq_('./monadplus');
            const promise_1 = _dereq_('../promise');
            class Maybe extends monadplus_1.MonadPlus {
                constructor(thunk) {
                    super(thunk);
                    void this.MAYBE;
                }
                fmap(f) {
                    return this.bind(a => new Just(f(a)));
                }
                ap(a) {
                    return Maybe.ap(this, a);
                }
                bind(f) {
                    return new Maybe(() => {
                        const m = this.evaluate();
                        if (m instanceof Just) {
                            return f(m.extract());
                        }
                        if (m instanceof Nothing) {
                            return m;
                        }
                        if (m instanceof Maybe) {
                            return m.bind(f);
                        }
                        throw new TypeError(`Spica: Maybe: Invalid monad value.\n\t${ m }`);
                    });
                }
                guard(cond) {
                    return cond ? this : Maybe.mzero;
                }
                join() {
                    return this.bind(m => m);
                }
                extract(nothing, just) {
                    return !just ? this.evaluate().extract(nothing) : this.fmap(just).extract(nothing);
                }
                static do(block) {
                    const iter = block();
                    let val;
                    while (true) {
                        const {
                            value: m,
                            done
                        } = iter.next(val);
                        if (done)
                            return m;
                        const r = m.extract(() => void 0, a => [a]);
                        if (!r)
                            return m;
                        val = r[0];
                    }
                }
            }
            exports.Maybe = Maybe;
            (function (Maybe) {
                function pure(a) {
                    return new Just(a);
                }
                Maybe.pure = pure;
                Maybe.Return = pure;
                function sequence(fm) {
                    return fm instanceof Maybe ? fm.extract(() => promise_1.AtomicPromise.resolve(Maybe.mzero), a => promise_1.AtomicPromise.resolve(a).then(Maybe.Return)) : fm.reduce((acc, m) => acc.bind(as => m.fmap(a => [
                        ...as,
                        a
                    ])), Maybe.Return([]));
                }
                Maybe.sequence = sequence;
            }(Maybe = exports.Maybe || (exports.Maybe = {})));
            class Just extends Maybe {
                constructor(a) {
                    super(throwCallError);
                    this.a = a;
                    void this.JUST;
                }
                bind(f) {
                    return new Maybe(() => f(this.extract()));
                }
                extract(_, just) {
                    return !just ? this.a : just(this.a);
                }
            }
            exports.Just = Just;
            class Nothing extends Maybe {
                constructor() {
                    super(throwCallError);
                    void this.NOTHING;
                }
                bind(_) {
                    return this;
                }
                extract(nothing) {
                    if (!nothing)
                        throw void 0;
                    return nothing();
                }
            }
            exports.Nothing = Nothing;
            (function (Maybe) {
                Maybe.mzero = new Nothing();
                function mplus(ml, mr) {
                    return new Maybe(() => ml.fmap(() => ml).extract(() => mr));
                }
                Maybe.mplus = mplus;
            }(Maybe = exports.Maybe || (exports.Maybe = {})));
            function throwCallError() {
                throw new Error(`Spica: Maybe: Invalid thunk call.`);
            }
        },
        {
            '../promise': 27,
            './monadplus': 24
        }
    ],
    22: [
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
                        if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k))
                            __createBinding(result, mod, k);
                __setModuleDefault(result, mod);
                return result;
            };
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.Nothing = exports.Just = exports.Maybe = void 0;
            const Monad = __importStar(_dereq_('./maybe.impl'));
            class Maybe extends Monad.Maybe {
                constructor() {
                    super(() => void 0);
                }
            }
            exports.Maybe = Maybe;
            function Just(a) {
                return new Monad.Just(a);
            }
            exports.Just = Just;
            exports.Nothing = Monad.Maybe.mzero;
        },
        { './maybe.impl': 21 }
    ],
    23: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.Monad = void 0;
            const applicative_1 = _dereq_('./applicative');
            class Monad extends applicative_1.Applicative {
            }
            exports.Monad = Monad;
            (function (Monad) {
                function bind(m, f) {
                    return f ? m.bind(f) : f => bind(m, f);
                }
                Monad.bind = bind;
            }(Monad = exports.Monad || (exports.Monad = {})));
        },
        { './applicative': 16 }
    ],
    24: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.MonadPlus = void 0;
            const monad_1 = _dereq_('./monad');
            class MonadPlus extends monad_1.Monad {
            }
            exports.MonadPlus = MonadPlus;
            (function (MonadPlus) {
            }(MonadPlus = exports.MonadPlus || (exports.MonadPlus = {})));
        },
        { './monad': 23 }
    ],
    25: [
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
                    if (p !== 'default' && !Object.prototype.hasOwnProperty.call(exports, p))
                        __createBinding(exports, m, p);
            };
            Object.defineProperty(exports, '__esModule', { value: true });
            __exportStar(_dereq_('./collection/multimap'), exports);
        },
        { './collection/multimap': 10 }
    ],
    26: [
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
    27: [
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
                                    results[i] = status.value;
                                    ++count;
                                    continue;
                                case 3:
                                    reject(status.reason);
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
                                    return resolve(status.value);
                                case 3:
                                    return reject(status.reason);
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
                static allSettled(vs) {
                    return new AtomicPromise(resolve => {
                        const values = alias_1.isArray(vs) ? vs : [...vs];
                        const results = global_1.Array(values.length);
                        let count = 0;
                        for (let i = 0; i < values.length; ++i) {
                            const value = values[i];
                            if (!isPromiseLike(value)) {
                                results[i] = {
                                    status: 'fulfilled',
                                    value: value
                                };
                                ++count;
                                continue;
                            }
                            if (isAtomicPromiseLike(value)) {
                                const {status} = value[internal];
                                switch (status.state) {
                                case 2:
                                    results[i] = {
                                        status: 'fulfilled',
                                        value: status.value
                                    };
                                    ++count;
                                    continue;
                                case 3:
                                    results[i] = {
                                        status: 'rejected',
                                        reason: status.reason
                                    };
                                    ++count;
                                    continue;
                                }
                            }
                            value.then(value => {
                                results[i] = {
                                    status: 'fulfilled',
                                    value: value
                                };
                                ++count;
                                count === values.length && resolve(results);
                            }, reason => {
                                results[i] = {
                                    status: 'rejected',
                                    reason
                                };
                                ++count;
                                count === values.length && resolve(results);
                            });
                        }
                        count === values.length && resolve(results);
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
                            value: value
                        };
                        return this.resume();
                    }
                    this.status = {
                        state: 1,
                        promise: value
                    };
                    return void value.then(value => {
                        this.status = {
                            state: 2,
                            value: value
                        };
                        this.resume();
                    }, reason => {
                        this.status = {
                            state: 3,
                            reason: reason
                        };
                        this.resume();
                    });
                }
                reject(reason) {
                    if (this.status.state !== 0)
                        return;
                    this.status = {
                        state: 3,
                        reason: reason
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
                            return onfulfilled ? resolve(onfulfilled(status.value)) : resolve(status.value);
                        } catch (reason) {
                            return reject(reason);
                        }
                    case 3:
                        if (rejectReactions.length > 0)
                            break;
                        try {
                            return onrejected ? resolve(onrejected(status.reason)) : reject(status.reason);
                        } catch (reason) {
                            return reject(reason);
                        }
                    default:
                        fulfillReactions.push(value => {
                            try {
                                onfulfilled ? resolve(onfulfilled(value)) : resolve(value);
                            } catch (reason) {
                                reject(reason);
                            }
                        });
                        rejectReactions.push(reason => {
                            try {
                                onrejected ? resolve(onrejected(reason)) : reject(reason);
                            } catch (reason) {
                                reject(reason);
                            }
                        });
                        return this.resume();
                    }
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
                        this.react(fulfillReactions, status.value);
                        return;
                    case 3:
                        if (this.isHandled && fulfillReactions.length > 0) {
                            array_1.splice(fulfillReactions, 0);
                        }
                        if (rejectReactions.length === 0)
                            return;
                        this.isHandled = true;
                        this.react(rejectReactions, status.reason);
                        return;
                    }
                }
                react(reactions, param) {
                    this.reactable = false;
                    if (reactions.length < 5) {
                        while (reactions.length > 0) {
                            reactions.shift()(param);
                        }
                    } else {
                        for (let i = 0; i < reactions.length; ++i) {
                            reactions[i](param);
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
            './global': 14
        }
    ],
    28: [
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
    29: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.URL = exports.ReadonlyURL = exports.standardize = void 0;
            const global_1 = _dereq_('./global');
            const format_1 = _dereq_('./url/format');
            var format_2 = _dereq_('./url/format');
            Object.defineProperty(exports, 'standardize', {
                enumerable: true,
                get: function () {
                    return format_2.standardize;
                }
            });
            var format_3 = _dereq_('./url/format');
            Object.defineProperty(exports, 'ReadonlyURL', {
                enumerable: true,
                get: function () {
                    return format_3.ReadonlyURL;
                }
            });
            const internal = Symbol.for('spica/url::internal');
            class URL {
                constructor(url, base) {
                    this.url = url;
                    this.base = base;
                    this[internal] = {
                        url: new format_1.ReadonlyURL(url, base),
                        searchParams: global_1.undefined
                    };
                }
                get href() {
                    var _a, _b;
                    return (_b = (_a = this[internal].searchParams) === null || _a === void 0 ? void 0 : _a.toString().replace(/^(?=.)/, `${ this[internal].url.href.slice(0, -this[internal].url.query.length - this[internal].url.fragment.length || this[internal].url.href.length) }?`).concat(this.fragment)) !== null && _b !== void 0 ? _b : this[internal].url.href;
                }
                get resource() {
                    var _a, _b;
                    return (_b = (_a = this[internal].searchParams) === null || _a === void 0 ? void 0 : _a.toString().replace(/^(?=.)/, `${ this[internal].url.href.slice(0, -this[internal].url.query.length - this[internal].url.fragment.length || this[internal].url.href.length) }?`)) !== null && _b !== void 0 ? _b : this[internal].url.resource;
                }
                get origin() {
                    return this[internal].url.origin;
                }
                get scheme() {
                    return this[internal].url.protocol.slice(0, -1);
                }
                get protocol() {
                    return this[internal].url.protocol;
                }
                get username() {
                    return this[internal].url.username;
                }
                get password() {
                    return this[internal].url.password;
                }
                get host() {
                    return this[internal].url.host;
                }
                get hostname() {
                    return this[internal].url.hostname;
                }
                get port() {
                    return this[internal].url.port;
                }
                get path() {
                    var _a, _b;
                    return (_b = (_a = this[internal].searchParams) === null || _a === void 0 ? void 0 : _a.toString().replace(/^(?=.)/, `${ this.pathname }?`)) !== null && _b !== void 0 ? _b : this[internal].url.path;
                }
                get pathname() {
                    return this[internal].url.pathname;
                }
                get search() {
                    var _a, _b;
                    return (_b = (_a = this[internal].searchParams) === null || _a === void 0 ? void 0 : _a.toString().replace(/^(?=.)/, '?')) !== null && _b !== void 0 ? _b : this[internal].url.search;
                }
                get query() {
                    var _a, _b;
                    return (_b = (_a = this[internal].searchParams) === null || _a === void 0 ? void 0 : _a.toString().replace(/^(?=.)/, '?')) !== null && _b !== void 0 ? _b : this[internal].url.query;
                }
                get hash() {
                    return this[internal].url.hash;
                }
                get fragment() {
                    return this[internal].url.fragment;
                }
                get searchParams() {
                    return this[internal].searchParams === global_1.undefined ? this[internal].searchParams = new global_1.URLSearchParams(this.search) : this[internal].searchParams;
                }
                toString() {
                    return this.href;
                }
                toJSON() {
                    return this.href;
                }
            }
            exports.URL = URL;
        },
        {
            './global': 14,
            './url/format': 30
        }
    ],
    30: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.ReadonlyURL = exports._encode = exports.standardize = void 0;
            const global_1 = _dereq_('../global');
            const memoize_1 = _dereq_('../memoize');
            const cache_1 = _dereq_('../cache');
            const flip_1 = _dereq_('../flip');
            const curry_1 = _dereq_('../curry');
            function standardize(url, base) {
                const u = new ReadonlyURL(url, base);
                url = u.origin !== 'null' ? u.origin.toLowerCase() + u.href.slice(u.origin.length) : u.protocol.toLowerCase() + u.href.slice(u.protocol.length);
                return encode(url);
            }
            exports.standardize = standardize;
            function encode(url) {
                return url.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]?|[\uDC00-\uDFFF]/g, str => str.length === 2 ? str : '').replace(/%(?![0-9A-F]{2})|[^%\[\]]+/ig, encodeURI).replace(/\?[^#]+/, query => '?' + query.slice(1).replace(/%[0-9A-F]{2}|%|[^=&]+/ig, str => str[0] === '%' && str.length === 3 ? str : encodeURIComponent(str))).replace(/%[0-9A-F]{2}/ig, str => str.toUpperCase()).replace(/#.+/, url.slice(url.indexOf('#')));
            }
            exports._encode = encode;
            const internal = Symbol.for('spica/url::internal');
            class ReadonlyURL {
                constructor(src, base) {
                    var _a, _b;
                    this.src = src;
                    this.base = base;
                    const i = (_a = base === null || base === void 0 ? void 0 : base.indexOf('#')) !== null && _a !== void 0 ? _a : -1;
                    if (i > -1) {
                        base = base === null || base === void 0 ? void 0 : base.slice(0, i);
                    }
                    const j = (_b = base === null || base === void 0 ? void 0 : base.indexOf('?')) !== null && _b !== void 0 ? _b : -1;
                    if (i > -1 && src.indexOf('#') === -1) {
                        base = base === null || base === void 0 ? void 0 : base.slice(0, j);
                    }
                    this[internal] = {
                        share: ReadonlyURL.get(src, base),
                        searchParams: global_1.undefined
                    };
                }
                get href() {
                    return this[internal].share.href === global_1.undefined ? this[internal].share.href = this[internal].share.url.href : this[internal].share.href;
                }
                get resource() {
                    return this[internal].share.resource === global_1.undefined ? this[internal].share.resource = this.href.slice(0, -this.fragment.length - this.query.length || this.href.length) + this.search : this[internal].share.resource;
                }
                get origin() {
                    return this[internal].share.origin === global_1.undefined ? this[internal].share.origin = this[internal].share.url.origin : this[internal].share.origin;
                }
                get protocol() {
                    return this[internal].share.protocol === global_1.undefined ? this[internal].share.protocol = this[internal].share.url.protocol : this[internal].share.protocol;
                }
                get username() {
                    return this[internal].share.username === global_1.undefined ? this[internal].share.username = this[internal].share.url.username : this[internal].share.username;
                }
                get password() {
                    return this[internal].share.password === global_1.undefined ? this[internal].share.password = this[internal].share.url.password : this[internal].share.password;
                }
                get host() {
                    return this[internal].share.host === global_1.undefined ? this[internal].share.host = this[internal].share.url.host : this[internal].share.host;
                }
                get hostname() {
                    return this[internal].share.hostname === global_1.undefined ? this[internal].share.hostname = this[internal].share.url.hostname : this[internal].share.hostname;
                }
                get port() {
                    return this[internal].share.port === global_1.undefined ? this[internal].share.port = this[internal].share.url.port : this[internal].share.port;
                }
                get path() {
                    return this[internal].share.path === global_1.undefined ? this[internal].share.path = `${ this.pathname }${ this.search }` : this[internal].share.path;
                }
                get pathname() {
                    return this[internal].share.pathname === global_1.undefined ? this[internal].share.pathname = this[internal].share.url.pathname : this[internal].share.pathname;
                }
                get search() {
                    return this[internal].share.search === global_1.undefined ? this[internal].share.search = this[internal].share.url.search : this[internal].share.search;
                }
                get query() {
                    return this[internal].share.query === global_1.undefined ? this[internal].share.query = this.search || this.href[this.href.length - this.fragment.length - 1] === '?' && '?' || '' : this[internal].share.query;
                }
                get hash() {
                    return this[internal].share.hash === global_1.undefined ? this[internal].share.hash = this[internal].share.url.hash : this[internal].share.hash;
                }
                get fragment() {
                    return this[internal].share.fragment === global_1.undefined ? this[internal].share.fragment = this.hash || this.href[this.href.length - 1] === '#' && '#' || '' : this[internal].share.fragment;
                }
                get searchParams() {
                    return this[internal].searchParams === global_1.undefined ? this[internal].searchParams = new global_1.URLSearchParams(this.search) : this[internal].searchParams;
                }
                toString() {
                    return this.href;
                }
                toJSON() {
                    return this.href;
                }
            }
            exports.ReadonlyURL = ReadonlyURL;
            ReadonlyURL.get = flip_1.flip(curry_1.uncurry(memoize_1.memoize(base => memoize_1.memoize(url => ({
                url: new global_1.global.URL(url, base),
                href: global_1.undefined,
                resource: global_1.undefined,
                origin: global_1.undefined,
                protocol: global_1.undefined,
                username: global_1.undefined,
                password: global_1.undefined,
                host: global_1.undefined,
                hostname: global_1.undefined,
                port: global_1.undefined,
                path: global_1.undefined,
                pathname: global_1.undefined,
                search: global_1.undefined,
                query: global_1.undefined,
                hash: global_1.undefined,
                fragment: global_1.undefined
            }), new cache_1.Cache(100)), new cache_1.Cache(100))));
        },
        {
            '../cache': 8,
            '../curry': 11,
            '../flip': 13,
            '../global': 14,
            '../memoize': 15
        }
    ],
    31: [
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
    32: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.apply = exports.currentTarget = exports.bind = exports.delegate = exports.wait = exports.once = exports.listen = exports.define = exports.element = exports.text = exports.svg = exports.html = exports.frag = exports.shadow = exports.proxy = exports.API = exports.SVG = exports.HTML = exports.Shadow = void 0;
            _dereq_('spica/global');
            var builder_1 = _dereq_('./src/builder');
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
            var proxy_1 = _dereq_('./src/proxy');
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
            './src/builder': 33,
            './src/proxy': 35,
            './src/util/dom': 36,
            './src/util/listener': 37,
            './src/util/query': 38,
            'spica/global': 14
        }
    ],
    33: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.SVG = exports.HTML = exports.Shadow = exports.API = void 0;
            const global_1 = _dereq_('spica/global');
            const alias_1 = _dereq_('spica/alias');
            const proxy_1 = _dereq_('./proxy');
            const dom_1 = _dereq_('./util/dom');
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
            './proxy': 35,
            './util/dom': 36,
            'spica/alias': 5,
            'spica/global': 14
        }
    ],
    34: [
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
        { 'spica/uuid': 31 }
    ],
    35: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.Elem = exports.proxy = void 0;
            const global_1 = _dereq_('spica/global');
            const alias_1 = _dereq_('spica/alias');
            const identity_1 = _dereq_('./identity');
            const dom_1 = _dereq_('./util/dom');
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
            './identity': 34,
            './util/dom': 36,
            'spica/alias': 5,
            'spica/array': 6,
            'spica/global': 14
        }
    ],
    36: [
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
                return (tag, attrs, children) => {
                    const el = tag.includes('-') ? elem(context, ns, tag) : cache(context, ns, tag).cloneNode(true);
                    return isChildren(attrs) ? defineChildren(el, attrs) : defineChildren(defineAttrs(el, attrs), children);
                };
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
                            targetLength += newChild !== node ? sourceLength : 0;
                            node.insertBefore(newChild, targetNodes[count] || null);
                            count += sourceLength;
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
                            targetLength += typeof newChild === 'string' || newChild.parentNode !== node ? 1 : 0;
                            node.insertBefore(typeof newChild === 'string' ? text(newChild) : newChild, oldChild);
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
            'spica/global': 14,
            'spica/memoize': 15
        }
    ],
    37: [
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
            'spica/global': 14,
            'spica/noop': 26,
            'spica/promise': 27
        }
    ],
    38: [
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
        { './dom': 36 }
    ],
    39: [
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
                    if (p !== 'default' && !Object.prototype.hasOwnProperty.call(exports, p))
                        __createBinding(exports, m, p);
            };
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.exec = exports.eval = void 0;
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
            __exportStar(_dereq_('./combinator/control/manipulation/reverse'), exports);
            __exportStar(_dereq_('./combinator/control/manipulation/lazy'), exports);
            __exportStar(_dereq_('./combinator/control/manipulation/recovery'), exports);
        },
        {
            './combinator/control/constraint/block': 40,
            './combinator/control/constraint/context': 41,
            './combinator/control/constraint/contract': 42,
            './combinator/control/constraint/line': 43,
            './combinator/control/constraint/resource': 44,
            './combinator/control/constraint/scope': 45,
            './combinator/control/manipulation/convert': 46,
            './combinator/control/manipulation/fence': 47,
            './combinator/control/manipulation/indent': 48,
            './combinator/control/manipulation/lazy': 49,
            './combinator/control/manipulation/match': 50,
            './combinator/control/manipulation/recovery': 51,
            './combinator/control/manipulation/reverse': 52,
            './combinator/control/manipulation/surround': 53,
            './combinator/control/manipulation/trim': 54,
            './combinator/control/monad/bind': 55,
            './combinator/control/monad/fmap': 56,
            './combinator/data/parser': 57,
            './combinator/data/parser/inits': 58,
            './combinator/data/parser/sequence': 59,
            './combinator/data/parser/some': 60,
            './combinator/data/parser/subsequence': 61,
            './combinator/data/parser/tails': 62,
            './combinator/data/parser/union': 63
        }
    ],
    40: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.block = void 0;
            const global_1 = _dereq_('spica/global');
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
                    return rest === '' || source[source.length - rest.length - 1] === '\n' ? result : global_1.undefined;
                };
            }
            exports.block = block;
        },
        {
            '../../data/parser': 57,
            './line': 43,
            'spica/global': 14
        }
    ],
    41: [
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
                return (source, context) => f(context) ? parser(source, context) : global_1.undefined;
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
            'spica/global': 14,
            'spica/memoize': 15,
            'spica/type': 28
        }
    ],
    42: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.verify = exports.validate = void 0;
            const global_1 = _dereq_('spica/global');
            const alias_1 = _dereq_('spica/alias');
            const parser_1 = _dereq_('../../data/parser');
            function validate(patterns, has, end, parser) {
                if (typeof has === 'function')
                    return validate(patterns, '', '', has);
                if (typeof end === 'function')
                    return validate(patterns, has, '', end);
                if (!alias_1.isArray(patterns))
                    return validate([patterns], has, end, parser);
                const matchers = patterns.map(pattern => typeof pattern === 'string' ? source => source.slice(0, pattern.length) === pattern : source => pattern.test(source));
                const match = source => {
                    for (let i = 0, len = matchers.length; i < len; ++i) {
                        if (matchers[i](source))
                            return true;
                    }
                    return false;
                };
                const match2 = source => {
                    if (!has)
                        return true;
                    const i = end ? source.indexOf(end, 1) : -1;
                    return i > -1 ? source.slice(0, i).indexOf(has, 1) > -1 : source.indexOf(has, 1) > -1;
                };
                return (source, context) => {
                    if (source === '')
                        return;
                    if (!match(source))
                        return;
                    if (!match2(source))
                        return;
                    const result = parser(source, context);
                    if (!result)
                        return;
                    return parser_1.exec(result).length < source.length ? result : global_1.undefined;
                };
            }
            exports.validate = validate;
            function verify(parser, cond) {
                return (source, context) => {
                    if (source === '')
                        return;
                    const result = parser(source, context);
                    if (!result)
                        return;
                    if (!cond(parser_1.eval(result), parser_1.exec(result), context))
                        return;
                    return parser_1.exec(result).length < source.length ? result : global_1.undefined;
                };
            }
            exports.verify = verify;
        },
        {
            '../../data/parser': 57,
            'spica/alias': 5,
            'spica/global': 14
        }
    ],
    43: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.isEmpty = exports.firstline = exports.line = void 0;
            const global_1 = _dereq_('spica/global');
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
                    ] : global_1.undefined;
                };
            }
            exports.line = line;
            function firstline(source, keepLinebreak = true) {
                const i = source.indexOf('\n');
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
                return line === '' || line === '\n' || line.trimStart() === '';
            }
            exports.isEmpty = isEmpty;
        },
        {
            '../../data/parser': 57,
            'spica/global': 14
        }
    ],
    44: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.creator = void 0;
            function creator(cost, parser) {
                if (typeof cost === 'function')
                    return creator(1, cost);
                return (source, context) => {
                    const {resources} = context;
                    if (!resources)
                        return parser(source, context);
                    const result = parser(source, context);
                    if (result) {
                        resources.budget -= cost;
                    }
                    if (resources.budget < 0)
                        throw new Error('Too many creations.');
                    return result;
                };
            }
            exports.creator = creator;
        },
        {}
    ],
    45: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.rewrite = exports.focus = void 0;
            const global_1 = _dereq_('spica/global');
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
                    ] : global_1.undefined;
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
                    ] : global_1.undefined;
                };
            }
            exports.rewrite = rewrite;
        },
        {
            '../../data/parser': 57,
            'spica/global': 14
        }
    ],
    46: [
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
    47: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.fence = void 0;
            const global_1 = _dereq_('spica/global');
            const line_1 = _dereq_('../constraint/line');
            const array_1 = _dereq_('spica/array');
            function fence(opener, limit, separation = true) {
                return source => {
                    if (source === '')
                        return;
                    const matches = source.match(opener);
                    if (!matches)
                        return;
                    const delim = matches[1];
                    if (matches[0].slice(delim.length).indexOf(delim) > -1)
                        return;
                    let rest = source.slice(matches[0].length);
                    let block = '';
                    let closer = '';
                    for (let count = 1, next;; ++count) {
                        if (rest === '')
                            break;
                        const line = next !== null && next !== void 0 ? next : line_1.firstline(rest);
                        next = global_1.undefined;
                        if (count > limit + 1 && (!separation || line.trimStart() === ''))
                            break;
                        if (count <= limit + 1 && line.slice(0, delim.length) === delim && line.trimEnd() === delim && (!separation || (next = line_1.firstline(rest.slice(line.length))).trimStart() === '')) {
                            closer = delim;
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
            '../constraint/line': 43,
            'spica/array': 6,
            'spica/global': 14
        }
    ],
    48: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.indent = void 0;
            const global_1 = _dereq_('spica/global');
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
                    ] : global_1.undefined;
                });
            }
            exports.indent = indent;
        },
        {
            '../../data/parser': 57,
            '../../data/parser/some': 60,
            '../constraint/line': 43,
            '../monad/bind': 55,
            './match': 50,
            './surround': 53,
            'spica/array': 6,
            'spica/global': 14
        }
    ],
    49: [
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
    50: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.memoize = exports.match = void 0;
            const global_1 = _dereq_('spica/global');
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
                    return parser_1.exec(result).length < source.length && parser_1.exec(result).length <= rest.length ? result : global_1.undefined;
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
            '../../data/parser': 57,
            'spica/global': 14,
            'spica/memoize': 15
        }
    ],
    51: [
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
    52: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.reverse = void 0;
            const fmap_1 = _dereq_('../monad/fmap');
            function reverse(parser) {
                return fmap_1.fmap(parser, ns => ns.reverse());
            }
            exports.reverse = reverse;
        },
        { '../monad/fmap': 56 }
    ],
    53: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.clear = exports.close = exports.open = exports.surround = void 0;
            const global_1 = _dereq_('spica/global');
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
                    const res2 = mr_ !== '' ? parser(mr_, context) : global_1.undefined;
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
                    ], rest, context) : global_1.undefined;
                };
            }
            exports.surround = surround;
            function match(pattern) {
                switch (typeof pattern) {
                case 'string':
                    return source => source.slice(0, pattern.length) === pattern ? [
                        [],
                        source.slice(pattern.length)
                    ] : global_1.undefined;
                case 'object':
                    return source => {
                        const m = source.match(pattern);
                        return m ? [
                            [],
                            source.slice(m[0].length)
                        ] : global_1.undefined;
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
            '../../data/parser': 57,
            '../monad/fmap': 56,
            'spica/array': 6,
            'spica/global': 14
        }
    ],
    54: [
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
        { './convert': 46 }
    ],
    55: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.bind = void 0;
            const global_1 = _dereq_('spica/global');
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
                    return parser_1.exec(res2).length <= parser_1.exec(res1).length ? res2 : global_1.undefined;
                };
            }
            exports.bind = bind;
        },
        {
            '../../data/parser': 57,
            'spica/global': 14
        }
    ],
    56: [
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
        { './bind': 55 }
    ],
    57: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
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
        },
        {}
    ],
    58: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.inits = void 0;
            const global_1 = _dereq_('spica/global');
            const parser_1 = _dereq_('../parser');
            const array_1 = _dereq_('spica/array');
            function inits(parsers) {
                return (source, context) => {
                    var _a;
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
                    ] : global_1.undefined;
                };
            }
            exports.inits = inits;
        },
        {
            '../parser': 57,
            'spica/array': 6,
            'spica/global': 14
        }
    ],
    59: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.sequence = void 0;
            const global_1 = _dereq_('spica/global');
            const parser_1 = _dereq_('../parser');
            const array_1 = _dereq_('spica/array');
            function sequence(parsers) {
                return (source, context) => {
                    var _a;
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
                    ] : global_1.undefined;
                };
            }
            exports.sequence = sequence;
        },
        {
            '../parser': 57,
            'spica/array': 6,
            'spica/global': 14
        }
    ],
    60: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.some = void 0;
            const global_1 = _dereq_('spica/global');
            const parser_1 = _dereq_('../parser');
            const array_1 = _dereq_('spica/array');
            function some(parser, until, deep) {
                const match = typeof until === 'string' && until !== global_1.undefined ? source => source.slice(0, until.length) === until : source => !!until && until.test(source);
                const delim = typeof deep === 'string' && deep !== global_1.undefined ? source => source.slice(0, deep.length) === deep : source => !!deep && deep.test(source);
                let memory = '';
                return (source, context) => {
                    var _a, _b, _c;
                    if (source === memory)
                        return;
                    let rest = source;
                    let data;
                    if (context && deep) {
                        context.delimiters ? context.delimiters.push(delim) : context.delimiters = [delim];
                    }
                    while (true) {
                        if (rest === '')
                            break;
                        if (match(rest))
                            break;
                        if ((_a = context === null || context === void 0 ? void 0 : context.delimiters) === null || _a === void 0 ? void 0 : _a.some(match => match(rest)))
                            break;
                        const result = parser(rest, context);
                        if (!result)
                            break;
                        data = data ? array_1.push(data, parser_1.eval(result)) : parser_1.eval(result);
                        rest = parser_1.exec(result);
                    }
                    if (context && deep) {
                        ((_b = context.delimiters) === null || _b === void 0 ? void 0 : _b.length) > 1 ? (_c = context.delimiters) === null || _c === void 0 ? void 0 : _c.pop() : context.delimiters = global_1.undefined;
                    }
                    memory = rest || memory;
                    return rest.length < source.length ? [
                        data || [],
                        rest
                    ] : global_1.undefined;
                };
            }
            exports.some = some;
        },
        {
            '../parser': 57,
            'spica/array': 6,
            'spica/global': 14
        }
    ],
    61: [
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
            './inits': 58,
            './union': 63
        }
    ],
    62: [
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
            './sequence': 59,
            './union': 63
        }
    ],
    63: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.union = void 0;
            const global_1 = _dereq_('spica/global');
            const parser_1 = _dereq_('../parser');
            function union(parsers) {
                switch (parsers.length) {
                case 0:
                    return () => global_1.undefined;
                case 1:
                    return parsers[0];
                default:
                    return (source, context) => {
                        var _a;
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
        {
            '../parser': 57,
            'spica/global': 14
        }
    ],
    64: [
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
                    if (p !== 'default' && !Object.prototype.hasOwnProperty.call(exports, p))
                        __createBinding(exports, m, p);
            };
            Object.defineProperty(exports, '__esModule', { value: true });
            __exportStar(_dereq_('./parser/api'), exports);
        },
        { './parser/api': 65 }
    ],
    65: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.caches = exports.sync = exports.normalize = exports.body = exports.headers = exports.header = exports.bind = exports.parse = void 0;
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
            var header_1 = _dereq_('./api/header');
            Object.defineProperty(exports, 'header', {
                enumerable: true,
                get: function () {
                    return header_1.header;
                }
            });
            Object.defineProperty(exports, 'headers', {
                enumerable: true,
                get: function () {
                    return header_1.headers;
                }
            });
            var body_1 = _dereq_('./api/body');
            Object.defineProperty(exports, 'body', {
                enumerable: true,
                get: function () {
                    return body_1.body;
                }
            });
            var normalize_1 = _dereq_('./api/normalize');
            Object.defineProperty(exports, 'normalize', {
                enumerable: true,
                get: function () {
                    return normalize_1.normalize;
                }
            });
            var sync_1 = _dereq_('./api/sync');
            Object.defineProperty(exports, 'sync', {
                enumerable: true,
                get: function () {
                    return sync_1.sync;
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
            './api/bind': 66,
            './api/body': 67,
            './api/cache': 68,
            './api/header': 69,
            './api/normalize': 70,
            './api/parse': 71,
            './api/sync': 72
        }
    ],
    66: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.bind = void 0;
            const global_1 = _dereq_('spica/global');
            const alias_1 = _dereq_('spica/alias');
            const combinator_1 = _dereq_('../../combinator');
            const header_1 = _dereq_('../header');
            const block_1 = _dereq_('../block');
            const segment_1 = _dereq_('../segment');
            const normalize_1 = _dereq_('./normalize');
            const header_2 = _dereq_('../api/header');
            const figure_1 = _dereq_('../../util/figure');
            const footnote_1 = _dereq_('../../util/footnote');
            const url_1 = _dereq_('spica/url');
            const array_1 = _dereq_('spica/array');
            function bind(target, settings) {
                var _a;
                settings = !settings.host ? {
                    ...settings,
                    host: new url_1.URL(global_1.location.pathname, global_1.location.origin)
                } : settings;
                if (((_a = settings.host) === null || _a === void 0 ? void 0 : _a.origin) === 'null')
                    throw new Error(`Invalid host: ${ settings.host.href }`);
                const blocks = [];
                const adds = [];
                const dels = [];
                const bottom = target.firstChild;
                let revision;
                return {
                    parse,
                    nearest,
                    position
                };
                function* parse(source) {
                    var _a, _b;
                    const rev = revision = Symbol();
                    const url = ((_a = header_2.headers(source).find(field => field.toLowerCase().startsWith('url:'))) === null || _a === void 0 ? void 0 : _a.slice(4).trim()) || '';
                    settings = url ? alias_1.ObjectAssign(alias_1.ObjectCreate(settings), { url: new url_1.URL(url, url) }) : settings;
                    source = normalize_1.normalize(source);
                    const sourceSegments = [];
                    for (const seg of segment_1.segment(source)) {
                        sourceSegments.push(seg);
                        yield {
                            type: 'segment',
                            value: seg
                        };
                    }
                    const targetSegments = blocks.map(([seg]) => seg);
                    let head = 0;
                    for (; head < targetSegments.length; ++head) {
                        if (blocks[head][2] !== url)
                            break;
                        if (targetSegments[head] !== sourceSegments[head])
                            break;
                    }
                    if (adds.length + dels.length === 0 && sourceSegments.length === targetSegments.length && head === sourceSegments.length)
                        return;
                    let last = 0;
                    for (; head + last < targetSegments.length && head + last < sourceSegments.length; ++last) {
                        if (blocks[targetSegments.length - last - 1][2] !== url)
                            break;
                        if (targetSegments[targetSegments.length - last - 1] !== sourceSegments[sourceSegments.length - last - 1])
                            break;
                    }
                    const base = next(head);
                    let index = head;
                    for (; index < sourceSegments.length - last; ++index) {
                        const seg = sourceSegments[index];
                        const es = combinator_1.eval(index === 0 && header_1.header(seg, settings) || block_1.block(seg, settings), []);
                        blocks.splice(index, 0, [
                            seg,
                            es,
                            url
                        ]);
                        if (es.length === 0)
                            continue;
                        array_1.push(adds, es.map(el => [
                            el,
                            base
                        ]));
                        while (adds.length > 0) {
                            const [el, base] = adds.shift();
                            target.insertBefore(el, base);
                            yield {
                                type: 'block',
                                value: el
                            };
                            if (rev !== revision)
                                return yield { type: 'cancel' };
                        }
                    }
                    for (let refuse = array_1.splice(blocks, index, blocks.length - sourceSegments.length), i = 0; i < refuse.length; ++i) {
                        const es = refuse[i][1];
                        if (es.length === 0)
                            continue;
                        array_1.push(dels, es);
                    }
                    while (adds.length > 0) {
                        const [el, base] = adds.shift();
                        target.insertBefore(el, base);
                        yield {
                            type: 'block',
                            value: el
                        };
                        if (rev !== revision)
                            return yield { type: 'cancel' };
                    }
                    while (dels.length > 0) {
                        const el = dels.shift();
                        (_b = el.parentNode) === null || _b === void 0 ? void 0 : _b.removeChild(el);
                        yield {
                            type: 'block',
                            value: el
                        };
                        if (rev !== revision)
                            return yield { type: 'cancel' };
                    }
                    for (const el of footnote_1.footnote(target, settings.footnotes, settings)) {
                        el ? yield {
                            type: 'footnote',
                            value: el
                        } : yield { type: 'break' };
                        if (rev !== revision)
                            return yield { type: 'cancel' };
                    }
                    for (const el of figure_1.figure(target, settings.footnotes, settings)) {
                        el ? yield {
                            type: 'figure',
                            value: el
                        } : yield { type: 'break' };
                        if (rev !== revision)
                            return yield { type: 'cancel' };
                    }
                }
                function next(index) {
                    for (let i = index; i < blocks.length; ++i) {
                        const [, es] = blocks[i];
                        if (es.length > 0)
                            return es[0];
                    }
                    return bottom;
                }
                function nearest(position) {
                    let el;
                    let len = 0;
                    for (let i = 0; i < blocks.length; ++i) {
                        const block = blocks[i];
                        len += block[0].length;
                        el = block[1][0] || el;
                        if (len >= position)
                            break;
                    }
                    return el;
                }
                function position(source) {
                    let len = 0;
                    for (let i = 0; i < blocks.length; ++i) {
                        const block = blocks[i];
                        if (block[1].includes(source))
                            return len;
                        len += block[0].length;
                    }
                    return -1;
                }
            }
            exports.bind = bind;
        },
        {
            '../../combinator': 39,
            '../../util/figure': 156,
            '../../util/footnote': 157,
            '../api/header': 69,
            '../block': 74,
            '../header': 96,
            '../segment': 134,
            './normalize': 70,
            'spica/alias': 5,
            'spica/array': 6,
            'spica/global': 14,
            'spica/url': 29
        }
    ],
    67: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.body = void 0;
            const header_1 = _dereq_('./header');
            function body(source) {
                return source.slice(header_1.header(source).length);
            }
            exports.body = body;
        },
        { './header': 69 }
    ],
    68: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.caches = void 0;
            const cache_1 = _dereq_('spica/cache');
            exports.caches = {
                code: new cache_1.Cache(10),
                math: new cache_1.Cache(20),
                media: new cache_1.Cache(10)
            };
        },
        { 'spica/cache': 8 }
    ],
    69: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.headers = exports.header = exports.syntax = void 0;
            exports.syntax = /^---[^\S\v\f\r\n]*\r?\n(?:[A-Za-z][0-9A-Za-z]*(?:-[A-Za-z][0-9A-Za-z]*)*:[ \t]+\S[^\v\f\r\n]*\r?\n){1,100}---[^\S\v\f\r\n]*(?:$|\r?\n(?:[^\S\v\f\r\n]*(?:$|\r?\n)))/;
            function header(source) {
                var _a;
                return ((_a = source.match(exports.syntax)) === null || _a === void 0 ? void 0 : _a[0]) || '';
            }
            exports.header = header;
            function headers(source) {
                return header(source).trimEnd().split('\n').slice(1, -1);
            }
            exports.headers = headers;
        },
        {}
    ],
    70: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.normalize = void 0;
            const UNICODE_REPLACEMENT_CHARACTER = '\uFFFD';
            function normalize(source) {
                return source.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]?|[\uDC00-\uDFFF]/g, str => str.length === 1 ? UNICODE_REPLACEMENT_CHARACTER : str).replace(/\r\n|[\x00-\x08\x0B-\x1F\x7F]/g, char => {
                    switch (char) {
                    case '\0':
                    case '\r':
                    case '\x0B':
                    case '\f':
                    case '\r\n':
                        return '\n';
                    default:
                        return UNICODE_REPLACEMENT_CHARACTER;
                    }
                });
            }
            exports.normalize = normalize;
        },
        {}
    ],
    71: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.parse = void 0;
            const global_1 = _dereq_('spica/global');
            const alias_1 = _dereq_('spica/alias');
            const combinator_1 = _dereq_('../../combinator');
            const header_1 = _dereq_('../header');
            const block_1 = _dereq_('../block');
            const segment_1 = _dereq_('../segment');
            const normalize_1 = _dereq_('./normalize');
            const header_2 = _dereq_('../api/header');
            const figure_1 = _dereq_('../../util/figure');
            const footnote_1 = _dereq_('../../util/footnote');
            const url_1 = _dereq_('spica/url');
            const array_1 = _dereq_('spica/array');
            const typed_dom_1 = _dereq_('typed-dom');
            function parse(source, opts = {}) {
                var _a, _b, _c, _d;
                opts = !opts.host ? {
                    ...opts,
                    host: new url_1.URL(global_1.location.pathname, global_1.location.origin)
                } : opts;
                if (((_a = opts.host) === null || _a === void 0 ? void 0 : _a.origin) === 'null')
                    throw new Error(`Invalid host: ${ opts.host.href }`);
                const url = ((_b = header_2.headers(source).find(field => field.toLowerCase().startsWith('url:'))) === null || _b === void 0 ? void 0 : _b.slice(4).trim()) || '';
                opts = url ? alias_1.ObjectAssign(alias_1.ObjectCreate(opts), { url: new url_1.URL(url, url) }) : opts;
                const node = typed_dom_1.frag([...segment_1.segment(normalize_1.normalize(source))].reduce((acc, seg, i) => array_1.push(acc, combinator_1.eval(i === 0 && header_1.header(seg, opts) || block_1.block(seg, opts), [])), []));
                if (opts.test && opts.hasOwnProperty('test'))
                    return node;
                for (const _ of footnote_1.footnote(node, opts.footnotes, opts));
                for (const _ of figure_1.figure(node, opts.footnotes, opts));
                return node;
            }
            exports.parse = parse;
        },
        {
            '../../combinator': 39,
            '../../util/figure': 156,
            '../../util/footnote': 157,
            '../api/header': 69,
            '../block': 74,
            '../header': 96,
            '../segment': 134,
            './normalize': 70,
            'spica/alias': 5,
            'spica/array': 6,
            'spica/global': 14,
            'spica/url': 29,
            'typed-dom': 32
        }
    ],
    72: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.sync = void 0;
            const global_1 = _dereq_('spica/global');
            const cancellation_1 = _dereq_('spica/cancellation');
            const typed_dom_1 = _dereq_('typed-dom');
            function sync(editor, viewer, footnotes) {
                const cancellation = new cancellation_1.Cancellation();
                let active = true;
                cancellation.register(typed_dom_1.bind(editor, 'focus', ev => {
                    active = ev.defaultPrevented;
                    setTimeout(() => active = true, 30);
                }));
                cancellation.register(typed_dom_1.bind(editor, 'scroll', () => {
                    if (!active)
                        return;
                    return void viewer.scrollTo({
                        top: +editor.scrollTop * footnotes.reduce((height, el) => {
                            const {marginTop, marginBottom} = global_1.window.getComputedStyle(el);
                            return height - el.clientHeight - +marginTop.slice(0, -2) - +marginBottom.slice(0, -2);
                        }, viewer.scrollHeight) / editor.scrollHeight
                    });
                }, { passive: true }));
                return cancellation.cancel;
            }
            exports.sync = sync;
        },
        {
            'spica/cancellation': 9,
            'spica/global': 14,
            'typed-dom': 32
        }
    ],
    73: [
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
            '../combinator': 39,
            './inline': 97,
            './source': 135
        }
    ],
    74: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.block = void 0;
            const global_1 = _dereq_('spica/global');
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
            const util_1 = _dereq_('./util');
            const typed_dom_1 = _dereq_('typed-dom');
            const uuid_1 = _dereq_('spica/uuid');
            exports.block = combinator_1.creator(combinator_1.recover(util_1.error(locale_1.localize(combinator_1.update({ resources: { budget: 100 * 1000 } }, combinator_1.union([
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
            ])))), (_, {id}, reason) => [
                [typed_dom_1.html('h1', {
                        id: id !== '' ? `error:${ uuid_1.uuid() }` : global_1.undefined,
                        class: 'error'
                    }, reason instanceof Error ? `${ reason.name }: ${ reason.message }` : `UnknownError: ${ reason }`)],
                ''
            ]));
        },
        {
            '../combinator': 39,
            './block/blockquote': 75,
            './block/codeblock': 76,
            './block/dlist': 77,
            './block/extension': 78,
            './block/heading': 85,
            './block/horizontalrule': 86,
            './block/ilist': 87,
            './block/mathblock': 88,
            './block/olist': 89,
            './block/paragraph': 90,
            './block/table': 94,
            './block/ulist': 95,
            './locale': 132,
            './source/line': 137,
            './util': 142,
            'spica/global': 14,
            'spica/uuid': 31,
            'typed-dom': 32
        }
    ],
    75: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.blockquote = exports.segment = void 0;
            const alias_1 = _dereq_('spica/alias');
            const combinator_1 = _dereq_('../../combinator');
            const util_1 = _dereq_('../util');
            const autolink_1 = _dereq_('../autolink');
            const source_1 = _dereq_('../source');
            const parse_1 = _dereq_('../api/parse');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.segment = combinator_1.block(combinator_1.validate([
                '!>',
                '>'
            ], combinator_1.union([combinator_1.validate(/^!?>+(?=[^\S\n]|\n\s*\S)/, combinator_1.some(source_1.contentline))])));
            exports.blockquote = combinator_1.lazy(() => combinator_1.block(combinator_1.rewrite(exports.segment, combinator_1.union([
                combinator_1.open(/^(?=>)/, source),
                combinator_1.open(/^!(?=>)/, markdown)
            ]))));
            const opener = /^(?=>>+(?:$|\s))/;
            const indent = combinator_1.block(combinator_1.open(opener, combinator_1.some(source_1.contentline, /^>(?:$|\s)/)), false);
            function unindent(source) {
                return source.replace(/\n$/, '').replace(/^>(?:$|\s|(?=>+(?:$|\s)))/mg, '');
            }
            const source = combinator_1.lazy(() => combinator_1.fmap(combinator_1.some(combinator_1.creator(combinator_1.union([
                combinator_1.rewrite(indent, combinator_1.convert(unindent, source)),
                combinator_1.rewrite(combinator_1.some(source_1.contentline, opener), combinator_1.convert(unindent, combinator_1.fmap(combinator_1.some(autolink_1.autolink), ns => [typed_dom_1.html('pre', util_1.defrag(ns))])))
            ]))), ns => [typed_dom_1.html('blockquote', ns)]));
            const markdown = combinator_1.lazy(() => combinator_1.fmap(combinator_1.some(combinator_1.creator(combinator_1.union([
                combinator_1.rewrite(indent, combinator_1.convert(unindent, markdown)),
                combinator_1.creator(99, combinator_1.rewrite(combinator_1.some(source_1.contentline, opener), combinator_1.convert(unindent, (source, context) => {
                    const annotation = typed_dom_1.html('ol', { class: 'annotation' });
                    const reference = typed_dom_1.html('ol', { class: 'reference' });
                    return [
                        [
                            parse_1.parse(source, alias_1.ObjectAssign(alias_1.ObjectCreate(context), {
                                id: '',
                                footnotes: {
                                    annotation,
                                    reference
                                }
                            })),
                            annotation,
                            reference
                        ],
                        ''
                    ];
                })))
            ]))), ns => [typed_dom_1.html('blockquote', ns)]));
        },
        {
            '../../combinator': 39,
            '../api/parse': 71,
            '../autolink': 73,
            '../source': 135,
            '../util': 142,
            'spica/alias': 5,
            'typed-dom': 32
        }
    ],
    76: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.codeblock = exports.segment_ = exports.segment = void 0;
            const global_1 = _dereq_('spica/global');
            const combinator_1 = _dereq_('../../combinator');
            const util_1 = _dereq_('../util');
            const autolink_1 = _dereq_('../autolink');
            const source_1 = _dereq_('../source');
            const typed_dom_1 = _dereq_('typed-dom');
            const array_1 = _dereq_('spica/array');
            const opener = /^(`{3,})(?!`)(\S*)([^\n]*)(?:$|\n)/;
            const language = /^[0-9a-z]+(?:-[a-z][0-9a-z]*)*$/;
            exports.segment = combinator_1.block(combinator_1.validate('```', combinator_1.clear(combinator_1.fence(opener, 300))));
            exports.segment_ = combinator_1.block(combinator_1.validate('```', combinator_1.clear(combinator_1.fence(opener, 300, false))), false);
            exports.codeblock = combinator_1.block(combinator_1.validate('```', combinator_1.fmap(combinator_1.fence(opener, 300), ([body, closer, opener, delim, lang, param], _, context) => {
                var _a, _b;
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
                            'data-invalid-message': closer ? 'Invalid parameter.' : `Missing the closing delimiter ${ delim }.`
                        }, `${ opener }${ body }${ closer }`)];
                const file = path.split('/').pop() || '';
                const ext = file && file.includes('.') && file[0] !== '.' ? file.split('.').pop() : '';
                lang = language.test(lang || ext) ? lang || ext : lang && 'invalid';
                const el = typed_dom_1.html('pre', { class: 'notranslate' }, body.slice(0, -1) || global_1.undefined);
                if (lang) {
                    el.className += ` code language-${ lang }`;
                    el.setAttribute('data-lang', lang);
                } else {
                    typed_dom_1.define(el, util_1.defrag(combinator_1.eval(combinator_1.some(autolink_1.autolink)(el.textContent, context), [])));
                }
                if (path) {
                    el.setAttribute('data-file', path);
                }
                if ((_b = (_a = context.caches) === null || _a === void 0 ? void 0 : _a.code) === null || _b === void 0 ? void 0 : _b.has(`${ lang }\n${ el.textContent }`)) {
                    typed_dom_1.define(el, context.caches.code.get(`${ lang }\n${ el.textContent }`).cloneNode(true).childNodes);
                }
                return [el];
            })));
        },
        {
            '../../combinator': 39,
            '../autolink': 73,
            '../source': 135,
            '../util': 142,
            'spica/array': 6,
            'spica/global': 14,
            'typed-dom': 32
        }
    ],
    77: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.dlist = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const util_1 = _dereq_('../util');
            const paragraph_1 = _dereq_('./paragraph');
            const inline_1 = _dereq_('../inline');
            const source_1 = _dereq_('../source');
            const typed_dom_1 = _dereq_('typed-dom');
            const array_1 = _dereq_('spica/array');
            exports.dlist = combinator_1.lazy(() => combinator_1.block(combinator_1.fmap(combinator_1.validate(/^~(?=[^\S\n])/, combinator_1.convert(source => source.replace(paragraph_1.blankline, ''), combinator_1.context({ syntax: { inline: { media: false } } }, combinator_1.some(combinator_1.inits([
                combinator_1.context({ syntax: { inline: { label: false } } }, combinator_1.some(term)),
                combinator_1.some(desc)
            ]))))), es => [typed_dom_1.html('dl', fillTrailingDescription(es))])));
            const term = combinator_1.creator(combinator_1.line(inline_1.indexee(combinator_1.fmap(combinator_1.open(/^~(?=[^\S\n])/, combinator_1.trim(combinator_1.some(combinator_1.union([
                inline_1.indexer,
                inline_1.inline
            ]))), true), ns => [typed_dom_1.html('dt', util_1.defrag(ns))]))));
            const desc = combinator_1.creator(combinator_1.block(combinator_1.fmap(combinator_1.open(/^:(?=[^\S\n])|/, combinator_1.rewrite(combinator_1.some(source_1.anyline, /^[~:](?=[^\S\n])/), combinator_1.trim(combinator_1.some(combinator_1.union([inline_1.inline])))), true), ns => [typed_dom_1.html('dd', util_1.defrag(ns))]), false));
            function fillTrailingDescription(es) {
                return es.length > 0 && es[es.length - 1].tagName === 'DT' ? array_1.push(es, [typed_dom_1.html('dd')]) : es;
            }
        },
        {
            '../../combinator': 39,
            '../inline': 97,
            '../source': 135,
            '../util': 142,
            './paragraph': 90,
            'spica/array': 6,
            'typed-dom': 32
        }
    ],
    78: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.extension = exports.segment = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const figbase_1 = _dereq_('./extension/figbase');
            const fig_1 = _dereq_('./extension/fig');
            const figure_1 = _dereq_('./extension/figure');
            const example_1 = _dereq_('./extension/example');
            const aside_1 = _dereq_('./extension/aside');
            const placeholder_1 = _dereq_('./extension/placeholder');
            exports.segment = combinator_1.validate([
                '~~~',
                '[$',
                '$'
            ], combinator_1.validate(/^~{3,}|^\[?\$[a-z-]\S+[^\S\n]*(?:$|\n)/, combinator_1.union([
                fig_1.segment,
                figure_1.segment,
                example_1.segment,
                placeholder_1.segment
            ])));
            exports.extension = combinator_1.union([
                figbase_1.figbase,
                fig_1.fig,
                figure_1.figure,
                example_1.example,
                aside_1.aside,
                placeholder_1.placeholder
            ]);
        },
        {
            '../../combinator': 39,
            './extension/aside': 79,
            './extension/example': 80,
            './extension/fig': 81,
            './extension/figbase': 82,
            './extension/figure': 83,
            './extension/placeholder': 84
        }
    ],
    79: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.aside = void 0;
            const alias_1 = _dereq_('spica/alias');
            const combinator_1 = _dereq_('../../../combinator');
            const indexee_1 = _dereq_('../../inline/extension/indexee');
            const parse_1 = _dereq_('../../api/parse');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.aside = combinator_1.creator(100, combinator_1.block(combinator_1.validate('~~~', combinator_1.fmap(combinator_1.fence(/^(~{3,})aside(?!\S)([^\n]*)(?:$|\n)/, 300), ([body, closer, opener, delim, param], _, context) => {
                var _a;
                if (!closer || param.trimStart() !== '')
                    return [typed_dom_1.html('pre', {
                            class: `notranslate invalid`,
                            'data-invalid-syntax': 'aside',
                            'data-invalid-type': closer ? 'parameter' : 'closer',
                            'data-invalid-message': closer ? 'Invalid parameter.' : `Missing the closing delimiter ${ delim }.`
                        }, `${ opener }${ body }${ closer }`)];
                const annotation = typed_dom_1.html('ol', { class: 'annotation' });
                const reference = typed_dom_1.html('ol', { class: 'reference' });
                const view = parse_1.parse(body.slice(0, -1), alias_1.ObjectAssign(alias_1.ObjectCreate(context), {
                    id: '',
                    footnotes: {
                        annotation,
                        reference
                    }
                }));
                const heading = 'H1 H2 H3 H4 H5 H6'.split(' ').includes((_a = view.firstElementChild) === null || _a === void 0 ? void 0 : _a.tagName) && view.firstElementChild;
                if (!heading)
                    return [typed_dom_1.html('pre', {
                            class: `notranslate invalid`,
                            'data-invalid-syntax': 'aside',
                            'data-invalid-type': 'content',
                            'data-invalid-message': 'Missing the title at the first line.'
                        }, `${ opener }${ body }${ closer }`)];
                return [typed_dom_1.html('aside', {
                        id: indexee_1.identity(heading),
                        class: 'aside'
                    }, [
                        view,
                        annotation,
                        reference
                    ])];
            }))));
        },
        {
            '../../../combinator': 39,
            '../../api/parse': 71,
            '../../inline/extension/indexee': 116,
            'spica/alias': 5,
            'typed-dom': 32
        }
    ],
    80: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.example = exports.segment_ = exports.segment = void 0;
            const alias_1 = _dereq_('spica/alias');
            const combinator_1 = _dereq_('../../../combinator');
            const parse_1 = _dereq_('../../api/parse');
            const mathblock_1 = _dereq_('../mathblock');
            const typed_dom_1 = _dereq_('typed-dom');
            const opener = /^(~{3,})example\/(\S+)([^\n]*)(?:$|\n)/;
            exports.segment = combinator_1.block(combinator_1.validate('~~~', combinator_1.clear(combinator_1.fence(opener, 100))));
            exports.segment_ = combinator_1.block(combinator_1.validate('~~~', combinator_1.clear(combinator_1.fence(opener, 100, false))), false);
            exports.example = combinator_1.creator(100, combinator_1.block(combinator_1.validate('~~~', combinator_1.fmap(combinator_1.fence(opener, 100), ([body, closer, opener, delim, type, param], _, context) => {
                if (!closer || param.trimStart() !== '')
                    return [typed_dom_1.html('pre', {
                            class: 'notranslate invalid',
                            'data-invalid-syntax': 'example',
                            'data-invalid-type': closer ? 'parameter' : 'closer',
                            'data-invalid-message': closer ? 'Invalid parameter.' : `Missing the closing delimiter ${ delim }.`
                        }, `${ opener }${ body }${ closer }`)];
                switch (type) {
                case 'markdown': {
                        const annotation = typed_dom_1.html('ol', { class: 'annotation' });
                        const reference = typed_dom_1.html('ol', { class: 'reference' });
                        const view = parse_1.parse(body.slice(0, -1), alias_1.ObjectAssign(alias_1.ObjectCreate(context), {
                            id: '',
                            footnotes: {
                                annotation,
                                reference
                            }
                        }));
                        return [typed_dom_1.html('aside', {
                                class: 'example',
                                'data-type': 'markdown'
                            }, [
                                typed_dom_1.html('pre', body.slice(0, -1)),
                                typed_dom_1.html('hr'),
                                typed_dom_1.html('div', [view]),
                                annotation,
                                reference
                            ])];
                    }
                case 'math':
                    return [typed_dom_1.html('aside', {
                            class: 'example',
                            'data-type': 'math'
                        }, [
                            typed_dom_1.html('pre', body.slice(0, -1)),
                            typed_dom_1.html('hr'),
                            combinator_1.eval(mathblock_1.mathblock(`$$\n${ body }$$`, context), [])[0]
                        ])];
                default:
                    return [typed_dom_1.html('pre', {
                            class: 'notranslate invalid',
                            'data-invalid-syntax': 'example',
                            'data-invalid-message': `Invalid example type.`
                        }, `${ opener }${ body }${ closer }`)];
                }
            }))));
        },
        {
            '../../../combinator': 39,
            '../../api/parse': 71,
            '../mathblock': 88,
            'spica/alias': 5,
            'typed-dom': 32
        }
    ],
    81: [
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
            exports.segment = combinator_1.block(combinator_1.validate([
                '[$',
                '$'
            ], combinator_1.sequence([
                combinator_1.line(label_1.segment),
                combinator_1.union([
                    codeblock_1.segment,
                    mathblock_1.segment,
                    example_1.segment,
                    blockquote_1.segment,
                    combinator_1.some(source_1.contentline)
                ])
            ])));
            exports.fig = combinator_1.block(combinator_1.rewrite(exports.segment, combinator_1.convert(source => {
                const fence = (/^[^\n]*\n!?>+\s/.test(source) && source.match(/^~{3,}(?=\s*$)/gm) || []).reduce((max, fence) => fence > max ? fence : max, '~~') + '~';
                return `${ fence }figure ${ source }\n\n${ fence }`;
            }, combinator_1.union([figure_1.figure]))));
        },
        {
            '../../../combinator': 39,
            '../../inline/extension/label': 118,
            '../../source': 135,
            '../blockquote': 75,
            '../codeblock': 76,
            '../extension/example': 80,
            '../mathblock': 88,
            './figure': 83
        }
    ],
    82: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.figbase = void 0;
            const combinator_1 = _dereq_('../../../combinator');
            const label_1 = _dereq_('../../inline/extension/label');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.figbase = combinator_1.block(combinator_1.fmap(combinator_1.validate(/^\[?\$-(?:[0-9]+\.)*0\]?[^\S\n]*(?!\S|\n[^\S\n]*\S)/, combinator_1.line(combinator_1.union([label_1.label]))), ([el]) => {
                const label = el.getAttribute('data-label');
                const group = label.split('-', 1)[0];
                return [typed_dom_1.html('figure', {
                        'data-label': label,
                        'data-group': group,
                        style: 'display: none;'
                    })];
            }));
        },
        {
            '../../../combinator': 39,
            '../../inline/extension/label': 118,
            'typed-dom': 32
        }
    ],
    83: [
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
            exports.segment = combinator_1.block(combinator_1.match(/^(~{3,})figure[^\S\n]+(?=\[?\$[A-Za-z-]\S*[^\S\n]*\n(?:[^\n]*\n)*?\1[^\S\n]*(?:$|\n))/, combinator_1.memoize(([, fence]) => fence, (fence, closer = new global_1.RegExp(`^${ fence }[^\\S\\n]*(?:$|\\n)`)) => combinator_1.close(combinator_1.sequence([
                combinator_1.line(label_1.segment),
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
            exports.figure = combinator_1.block(combinator_1.rewrite(exports.segment, combinator_1.fmap(combinator_1.convert(source => source.slice(source.search(/\s/) + 1, source.trimEnd().lastIndexOf('\n')), combinator_1.sequence([
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
            ])), ([label, content, ...caption]) => [typed_dom_1.html('figure', attributes(label.getAttribute('data-label'), content, caption), [
                    typed_dom_1.html('div', { class: 'figcontent' }, [content]),
                    typed_dom_1.html('span', { class: 'figindex' }),
                    typed_dom_1.html('figcaption', util_1.defrag(caption))
                ])])));
            function attributes(label, content, caption) {
                const group = label.split('-', 1)[0];
                const invalidLabel = /^[^-]+-(?:[0-9]+\.)*0$/.test(label);
                const invalidContent = group === '$' && (!content.classList.contains('math') || caption.length > 0);
                const invalid = invalidLabel || invalidContent || global_1.undefined;
                return {
                    'data-label': label,
                    'data-group': group,
                    class: invalid && 'invalid',
                    ...invalidLabel && {
                        'data-invalid-syntax': 'figure',
                        'data-invalid-type': 'label',
                        'data-invalid-message': 'The last part of the fixed label numbers must not be 0.'
                    } || invalidContent && {
                        'data-invalid-syntax': 'figure',
                        'data-invalid-type': 'content',
                        'data-invalid-message': 'A figure labeled to define a formula number can contain only a math formula and no caption.'
                    } || global_1.undefined
                };
            }
        },
        {
            '../../../combinator': 39,
            '../../inline': 97,
            '../../inline/extension/label': 118,
            '../../source': 135,
            '../../util': 142,
            '../blockquote': 75,
            '../codeblock': 76,
            '../mathblock': 88,
            '../paragraph': 90,
            '../table': 94,
            './example': 80,
            'spica/global': 14,
            'typed-dom': 32
        }
    ],
    84: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.placeholder = exports.segment = void 0;
            const combinator_1 = _dereq_('../../../combinator');
            const typed_dom_1 = _dereq_('typed-dom');
            const opener = /^(~{3,})(?!~)[^\n]*(?:$|\n)/;
            exports.segment = combinator_1.block(combinator_1.validate('~~~', combinator_1.clear(combinator_1.fence(opener, 300))));
            exports.placeholder = combinator_1.block(combinator_1.validate('~~~', combinator_1.fmap(combinator_1.fence(opener, 300), ([body, closer, opener]) => [typed_dom_1.html('pre', {
                    class: 'notranslate invalid',
                    'data-invalid-syntax': 'extension',
                    'data-invalid-type': 'syntax',
                    'data-invalid-message': 'Invalid syntax.'
                }, `${ opener }${ body }${ closer }`)])));
        },
        {
            '../../../combinator': 39,
            'typed-dom': 32
        }
    ],
    85: [
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
            exports.segment = combinator_1.block(combinator_1.validate('#', combinator_1.focus(/^#{1,6}[^\S\n]+\S[^\n]*(?:\n#{1,6}(?!\S)[^\n]*)*(?:$|\n)/, combinator_1.some(combinator_1.line(source => [
                [source],
                ''
            ])))));
            exports.heading = combinator_1.block(combinator_1.rewrite(exports.segment, combinator_1.context({
                syntax: {
                    inline: {
                        label: false,
                        media: false
                    }
                }
            }, combinator_1.line(inline_1.indexee(combinator_1.fmap(combinator_1.union([
                combinator_1.open(source_1.str(/^##+/), combinator_1.trim(util_1.startTight(combinator_1.some(combinator_1.union([
                    inline_1.indexer,
                    inline_1.inline
                ])))), true),
                combinator_1.open(source_1.str('#'), combinator_1.context({
                    syntax: {
                        inline: {
                            annotation: false,
                            reference: false,
                            index: false,
                            link: false,
                            autolink: false
                        }
                    }
                }, combinator_1.trim(util_1.startTight(combinator_1.some(combinator_1.union([
                    inline_1.indexer,
                    inline_1.inline
                ]))))), true)
            ]), ns => [typed_dom_1.html(`h${ ns[0].length }`, util_1.defrag(array_1.shift(ns)[1]))]))))));
        },
        {
            '../../combinator': 39,
            '../inline': 97,
            '../source': 135,
            '../util': 142,
            'spica/array': 6,
            'typed-dom': 32
        }
    ],
    86: [
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
            '../../combinator': 39,
            'typed-dom': 32
        }
    ],
    87: [
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
            exports.ilist = combinator_1.lazy(() => combinator_1.block(combinator_1.fmap(combinator_1.validate(/^[-+*](?=[^\S\n]|\n[^\S\n]*\S)/, combinator_1.some(combinator_1.creator(combinator_1.union([combinator_1.fmap(combinator_1.inits([
                    combinator_1.line(combinator_1.open(/^[-+*](?:$|\s)/, combinator_1.trim(combinator_1.some(inline_1.inline)), true)),
                    combinator_1.indent(combinator_1.union([
                        ulist_1.ulist_,
                        olist_1.olist_,
                        exports.ilist_
                    ]))
                ]), ns => [typed_dom_1.html('li', util_1.defrag(ulist_1.fillFirstLine(ns)))])])))), es => [typed_dom_1.html('ul', {
                    class: 'invalid',
                    'data-invalid-syntax': 'list',
                    'data-invalid-type': 'syntax',
                    'data-invalid-message': 'Use - instead of + or *.'
                }, es)])));
            exports.ilist_ = combinator_1.convert(source => source.replace(/^[-+*](?=$|\n)/, `$& `), exports.ilist);
        },
        {
            '../../combinator': 39,
            '../inline': 97,
            '../util': 142,
            './olist': 89,
            './ulist': 95,
            'typed-dom': 32
        }
    ],
    88: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.mathblock = exports.segment_ = exports.segment = void 0;
            const global_1 = _dereq_('spica/global');
            const combinator_1 = _dereq_('../../combinator');
            const typed_dom_1 = _dereq_('typed-dom');
            const opener = /^(\$\$)(?!\$)([^\n]*)(?:$|\n)/;
            exports.segment = combinator_1.block(combinator_1.validate('$$', combinator_1.clear(combinator_1.fence(opener, 100))));
            exports.segment_ = combinator_1.block(combinator_1.validate('$$', combinator_1.clear(combinator_1.fence(opener, 100, false))), false);
            exports.mathblock = combinator_1.block(combinator_1.validate('$$', combinator_1.fmap(combinator_1.fence(opener, 100), ([body, closer, opener, delim, param], _, {
                caches: {
                    math: cache = global_1.undefined
                } = {}
            }) => [closer && param.trimStart() === '' ? (body = `$$\n${ body }$$`) && (cache === null || cache === void 0 ? void 0 : cache.has(body)) ? cache.get(body).cloneNode(true) : typed_dom_1.html('div', { class: `math notranslate` }, body) : typed_dom_1.html('pre', {
                    class: `math notranslate invalid`,
                    'data-invalid-syntax': 'mathblock',
                    'data-invalid-type': closer ? 'parameter' : 'closer',
                    'data-invalid-message': closer ? 'Invalid parameter.' : `Missing the closing delimiter ${ delim }.`
                }, `${ opener }${ body }${ closer }`)])));
        },
        {
            '../../combinator': 39,
            'spica/global': 14,
            'typed-dom': 32
        }
    ],
    89: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.olist_ = exports.olist = void 0;
            const global_1 = _dereq_('spica/global');
            const combinator_1 = _dereq_('../../combinator');
            const util_1 = _dereq_('../util');
            const ulist_1 = _dereq_('./ulist');
            const ilist_1 = _dereq_('./ilist');
            const inline_1 = _dereq_('../inline');
            const typed_dom_1 = _dereq_('typed-dom');
            const array_1 = _dereq_('spica/array');
            exports.olist = combinator_1.lazy(() => combinator_1.block(combinator_1.match(/^(?=(?:([0-9]+|[a-z]+|[A-Z]+)(?:-[0-9]+)?(\.)|\(([0-9]+|[a-z]+)(\))(?:-[0-9]+)?)(?=[^\S\n]|\n[^\S\n]*\S))/, combinator_1.memoize(ms => type(ms[1] || ms[ms.length - 2]) + (ms[2] || ms[ms.length - 1]), (_, type = _.slice(0, -1), delim = _[_.length - 1]) => combinator_1.fmap(combinator_1.context({ syntax: { inline: { media: false } } }, combinator_1.some(combinator_1.creator(combinator_1.union([combinator_1.fmap(combinator_1.inits([
                    combinator_1.line(combinator_1.inits([
                        combinator_1.focus(delim === '.' ? /^(?:[0-9]+|[a-z]+|[A-Z]+)(?:-[0-9]*)?(?![^.\n])\.?(?:$|\s)/ : /^\((?:[0-9]*|[a-z]*)(?![^)\n])\)?(?:-[0-9]*)?(?:$|\s)/, delim === '.' ? source => [
                            [`${ source.split('.', 1)[0] }.`],
                            ''
                        ] : source => [
                            [source.trimEnd().replace(/^\((\w+)\)?$/, '($1)').replace(/^\($/, '(1)')],
                            ''
                        ]),
                        combinator_1.trim(combinator_1.some(inline_1.inline))
                    ])),
                    combinator_1.indent(combinator_1.union([
                        ulist_1.ulist_,
                        exports.olist_,
                        ilist_1.ilist_
                    ]))
                ]), ns => [typed_dom_1.html('li', { 'data-value': ns[0] }, util_1.defrag(ulist_1.fillFirstLine(array_1.shift(ns)[1])))])])))), es => [typed_dom_1.html('ol', {
                    type: type || global_1.undefined,
                    'data-format': delim === '.' ? global_1.undefined : 'paren',
                    'data-type': style(type) || global_1.undefined
                }, format(es, type))])))));
            exports.olist_ = combinator_1.convert(source => source[0] === '(' ? source.replace(/^\(((?:[0-9]+|[a-z]+))\)?(?:-[0-9]*)?(?=$|\n)/, `($1) `).replace(/^\(\)?(?=$|\n)/, `(1) `) : source.replace(/^((?:[0-9]+|[a-z]+|[A-Z]+)(?:-[0-9]*)?)\.?(?=$|\n)/, `$1. `), exports.olist);
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
            function format(es, type) {
                var _a;
                const value = ((_a = es[0].getAttribute('data-value').match(initial(type))) === null || _a === void 0 ? void 0 : _a[0]) || '';
                for (let i = 0; i < es.length; ++i) {
                    const el = es[i];
                    if (el.getAttribute('data-value') !== value)
                        break;
                    typed_dom_1.define(el, { 'data-value': null });
                }
                return es;
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
        },
        {
            '../../combinator': 39,
            '../inline': 97,
            '../util': 142,
            './ilist': 87,
            './ulist': 95,
            'spica/array': 6,
            'spica/global': 14,
            'typed-dom': 32
        }
    ],
    90: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.paragraph = exports.blankline = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const util_1 = _dereq_('../util');
            const mention_1 = _dereq_('./paragraph/mention');
            const quotation_1 = _dereq_('./paragraph/mention/quotation');
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
                combinator_1.fmap(combinator_1.rewrite(combinator_1.some(source_1.anyline, quotation_1.syntax), combinator_1.trim(combinator_1.some(inline_1.inline))), ns => array_1.push(ns, [typed_dom_1.html('br')]))
            ]))), ns => {
                if (ns.length === 0)
                    return [];
                const el = typed_dom_1.html('p', util_1.defrag(array_1.pop(ns)[0]));
                return [isVisible(el) ? el : typed_dom_1.define(el, {
                        class: 'invalid',
                        'data-invalid-syntax': 'paragraph',
                        'data-invalid-type': 'visibility',
                        'data-invalid-message': 'Paragraphs must have a visible content.'
                    })];
            }));
            function isVisible(node) {
                return node.innerText.trimStart() !== '' || node.getElementsByClassName('media').length > 0;
            }
        },
        {
            '../../combinator': 39,
            '../inline': 97,
            '../source': 135,
            '../util': 142,
            './paragraph/mention': 91,
            './paragraph/mention/quotation': 93,
            'spica/array': 6,
            'typed-dom': 32
        }
    ],
    91: [
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
            '../../../combinator': 39,
            './mention/address': 92,
            './mention/quotation': 93
        }
    ],
    92: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.address = void 0;
            const combinator_1 = _dereq_('../../../../combinator');
            const inline_1 = _dereq_('../../../inline');
            const str_1 = _dereq_('../../../source/str');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.address = combinator_1.creator(combinator_1.line(combinator_1.fmap(combinator_1.tails([
                str_1.str(/^>*(?=>)/),
                inline_1.address
            ]), ns => [typed_dom_1.html('span', { class: 'quotation' }, ns)])));
        },
        {
            '../../../../combinator': 39,
            '../../../inline': 97,
            '../../../source/str': 139,
            'typed-dom': 32
        }
    ],
    93: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.quotation = exports.syntax = void 0;
            const combinator_1 = _dereq_('../../../../combinator');
            const util_1 = _dereq_('../../../util');
            const inline_1 = _dereq_('../../../inline');
            const autolink_1 = _dereq_('../../../autolink');
            const source_1 = _dereq_('../../../source');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.syntax = /^>+(?!>|[0-9][0-9A-Za-z]*(?:-[0-9A-Za-z]+)*(?![^\S\n]*(?:$|\n)))/;
            exports.quotation = combinator_1.lazy(() => combinator_1.creator(combinator_1.block(combinator_1.fmap(combinator_1.union([
                combinator_1.rewrite(combinator_1.some(combinator_1.validate(/^>+(?:$|\s)/, source_1.contentline)), combinator_1.convert(source => source.replace(/\n$/, ''), block_)),
                combinator_1.rewrite(combinator_1.some(combinator_1.validate(exports.syntax, source_1.contentline)), combinator_1.convert(source => source.replace(/\n$/, ''), block_))
            ]), ns => [typed_dom_1.html('span', { class: 'quotation' }, ns)]), false)));
            const block_ = (source, context) => {
                const lines = source.match(/^.*\n?/mg);
                const quotes = source.match(/^>+(?:$|\s)/.test(source) ? /^>+(?:$|\s)/mg : /^>+/mg);
                const content = lines.reduce((acc, line, row) => acc + line.slice(quotes[row].length), '');
                const nodes = combinator_1.eval(combinator_1.some(text)(content, context), []);
                nodes.unshift(quotes.shift());
                for (let i = 0; i < nodes.length; ++i) {
                    const child = nodes[i];
                    if (typeof child === 'string')
                        continue;
                    if ('wholeText' in child) {
                        nodes[i] = child.data;
                        continue;
                    }
                    if (child.tagName === 'BR') {
                        nodes.splice(i + 1, 0, quotes.shift());
                        ++i;
                        continue;
                    }
                    if (child.classList.contains('quotation')) {
                        context.resources && (context.resources.budget -= child.childNodes.length);
                        nodes.splice(i, 1, ...child.childNodes);
                        --i;
                        continue;
                    }
                }
                return [
                    util_1.defrag(nodes),
                    ''
                ];
            };
            const text = combinator_1.union([
                inline_1.math,
                autolink_1.autolink
            ]);
        },
        {
            '../../../../combinator': 39,
            '../../../autolink': 73,
            '../../../inline': 97,
            '../../../source': 135,
            '../../../util': 142,
            'typed-dom': 32
        }
    ],
    94: [
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
                align(head, alignment, rows);
                return [typed_dom_1.html('table', [
                        typed_dom_1.html('thead', [head]),
                        typed_dom_1.html('tbody', rows)
                    ])];
            })));
            function align(head, alignment, rows) {
                const as = [...alignment.children].reduce((acc, el) => array_1.push(acc, [el.textContent || acc.length > 0 && acc[acc.length - 1] || '']), []);
                apply(head, as.slice(0, 2));
                for (let i = 0, len = rows.length; i < len; ++i) {
                    apply(rows[i], as);
                }
                return;
                function apply(row, aligns) {
                    const cols = row.children;
                    const len = cols.length;
                    extend(aligns, len);
                    for (let i = 0; i < len; ++i) {
                        if (!aligns[i])
                            continue;
                        cols[i].setAttribute('style', `text-align: ${ aligns[i] };`);
                    }
                }
                function extend(aligns, size) {
                    return size > aligns.length ? void array_1.push(aligns, global_1.Array(size - aligns.length).fill(aligns.length > 0 ? aligns[aligns.length - 1] : '')) : global_1.undefined;
                }
            }
            const row = (parser, optional) => combinator_1.fmap(combinator_1.line(combinator_1.surround(/^(?=\|)/, combinator_1.some(combinator_1.union([parser])), /^\|?\s*$/, optional)), es => [typed_dom_1.html('tr', es)]);
            const cell = parser => combinator_1.creator(combinator_1.fmap(combinator_1.union([parser]), ns => [typed_dom_1.html('td', util_1.defrag(ns))]));
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
            '../../combinator': 39,
            '../inline': 97,
            '../util': 142,
            'spica/array': 6,
            'spica/global': 14,
            'typed-dom': 32
        }
    ],
    95: [
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
            exports.ulist = combinator_1.lazy(() => combinator_1.block(combinator_1.fmap(combinator_1.validate(/^-(?=[^\S\n]|\n[^\S\n]*\S)/, combinator_1.context({ syntax: { inline: { media: false } } }, combinator_1.some(combinator_1.creator(combinator_1.union([combinator_1.fmap(combinator_1.inits([
                    combinator_1.line(combinator_1.open(/^-(?:$|\s)/, combinator_1.trim(combinator_1.some(inline_1.inline)), true)),
                    combinator_1.indent(combinator_1.union([
                        exports.ulist_,
                        olist_1.olist_,
                        ilist_1.ilist_
                    ]))
                ]), ns => [typed_dom_1.html('li', util_1.defrag(fillFirstLine(ns)))])]))))), es => [typed_dom_1.html('ul', es)])));
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
            '../../combinator': 39,
            '../inline': 97,
            '../util': 142,
            './ilist': 87,
            './olist': 89,
            'spica/array': 6,
            'typed-dom': 32
        }
    ],
    96: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.header = void 0;
            const combinator_1 = _dereq_('../combinator');
            const header_1 = _dereq_('./api/header');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.header = combinator_1.validate('---', combinator_1.focus(header_1.syntax, source => [
                [typed_dom_1.html('details', { class: 'header' }, [
                        typed_dom_1.html('summary', 'Header'),
                        source.slice(source.indexOf('\n') + 1, source.trimEnd().lastIndexOf('\n'))
                    ])],
                ''
            ]));
        },
        {
            '../combinator': 39,
            './api/header': 69,
            'typed-dom': 32
        }
    ],
    97: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.indexee = exports.indexer = exports.address = exports.autolink = exports.shortmedia = exports.math = exports.media = exports.inline = void 0;
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
            var media_2 = _dereq_('./inline/media');
            Object.defineProperty(exports, 'media', {
                enumerable: true,
                get: function () {
                    return media_2.media;
                }
            });
            var math_2 = _dereq_('./inline/math');
            Object.defineProperty(exports, 'math', {
                enumerable: true,
                get: function () {
                    return math_2.math;
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
            var address_1 = _dereq_('./inline/autolink/address');
            Object.defineProperty(exports, 'address', {
                enumerable: true,
                get: function () {
                    return address_1.address;
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
        },
        {
            '../combinator': 39,
            './inline/annotation': 98,
            './inline/autolink': 99,
            './inline/autolink/address': 101,
            './inline/bracket': 107,
            './inline/code': 108,
            './inline/comment': 109,
            './inline/deletion': 110,
            './inline/emphasis': 111,
            './inline/emstrong': 112,
            './inline/escape': 113,
            './inline/extension': 114,
            './inline/extension/indexee': 116,
            './inline/extension/indexer': 117,
            './inline/html': 120,
            './inline/htmlentity': 121,
            './inline/insertion': 122,
            './inline/link': 123,
            './inline/mark': 124,
            './inline/math': 125,
            './inline/media': 126,
            './inline/reference': 127,
            './inline/ruby': 128,
            './inline/shortmedia': 129,
            './inline/strong': 130,
            './inline/template': 131,
            './source': 135
        }
    ],
    98: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.annotation = void 0;
            const global_1 = _dereq_('spica/global');
            const combinator_1 = _dereq_('../../combinator');
            const util_1 = _dereq_('../util');
            const inline_1 = _dereq_('../inline');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.annotation = combinator_1.lazy(() => combinator_1.creator(combinator_1.validate('((', '))', combinator_1.bind(combinator_1.surround('((', combinator_1.guard(context => {
                var _a, _b, _c;
                return (_c = (_b = (_a = context.syntax) === null || _a === void 0 ? void 0 : _a.inline) === null || _b === void 0 ? void 0 : _b.annotation) !== null && _c !== void 0 ? _c : true;
            }, util_1.startTight(combinator_1.context({
                syntax: {
                    inline: {
                        annotation: false,
                        reference: false,
                        media: false
                    }
                },
                state: global_1.undefined
            }, combinator_1.union([combinator_1.some(inline_1.inline, ')')])))), '))'), (ns, rest) => util_1.isEndTight(ns) ? [
                [typed_dom_1.html('sup', { class: 'annotation' }, util_1.defrag(util_1.trimEnd(ns)))],
                rest
            ] : global_1.undefined))));
        },
        {
            '../../combinator': 39,
            '../inline': 97,
            '../util': 142,
            'spica/global': 14,
            'typed-dom': 32
        }
    ],
    99: [
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
            const address_1 = _dereq_('./autolink/address');
            const source_1 = _dereq_('../source');
            exports.autolink = combinator_1.fmap(combinator_1.validate(/^(?:[@#>0-9A-Za-z]|[^\x00-\x7F\s]#)/, combinator_1.guard(context => {
                var _a, _b, _c;
                return (_c = (_b = (_a = context.syntax) === null || _a === void 0 ? void 0 : _a.inline) === null || _b === void 0 ? void 0 : _b.autolink) !== null && _c !== void 0 ? _c : true;
            }, combinator_1.some(combinator_1.union([
                url_1.url,
                email_1.email,
                source_1.str(/^[0-9A-Za-z]+(?:[.+_-][0-9A-Za-z]+)*(?:@(?:[0-9A-Za-z]+(?:[.-][0-9A-Za-z]+)*)?)+/),
                source_1.str(/^[@#]+(?![0-9A-Za-z]|[^\x00-\x7F\s])/),
                channel_1.channel,
                account_1.account,
                source_1.str(/^@[0-9A-Za-z]+(?:-[0-9A-Za-z]+)*/),
                source_1.str(/^[0-9A-Za-z]+(?=#)|^[^\x00-\x7F\s](?=#)/),
                hashtag_1.hashtag,
                hashref_1.hashref,
                source_1.str(/^#(?:[0-9A-Za-z]|[^\x00-\x7F\s])+/),
                address_1.address
            ])))), ns => ns.length === 1 ? ns : [util_1.stringify(ns)]);
        },
        {
            '../../combinator': 39,
            '../source': 135,
            '../util': 142,
            './autolink/account': 100,
            './autolink/address': 101,
            './autolink/channel': 102,
            './autolink/email': 103,
            './autolink/hashref': 104,
            './autolink/hashtag': 105,
            './autolink/url': 106
        }
    ],
    100: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.account = void 0;
            const global_1 = _dereq_('spica/global');
            const combinator_1 = _dereq_('../../../combinator');
            const source_1 = _dereq_('../../source');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.account = combinator_1.creator(combinator_1.rewrite(combinator_1.open('@', combinator_1.tails([
                combinator_1.verify(source_1.str(/^[0-9A-Za-z](?:[0-9A-Za-z-]{0,61}[0-9A-Za-z])?(?:\.[0-9A-Za-z](?:[0-9A-Za-z-]{0,61}[0-9A-Za-z])?)*\//), ([source]) => source.length <= 253 + 1),
                combinator_1.verify(source_1.str(/^[A-Z-a-z][0-9A-Za-z]*(?:-[0-9A-Za-z]+)*/), ([source]) => source.length <= 63)
            ])), (source, {host, url}) => [
                [typed_dom_1.html('a', {
                        class: 'account',
                        href: source.includes('/') ? `https://${ source.slice(1).replace('/', '/@') }` : `${ (url === null || url === void 0 ? void 0 : url.origin) || '' }/${ source }`,
                        rel: 'noopener',
                        target: source.includes('/') || url && url.origin !== (host === null || host === void 0 ? void 0 : host.origin) ? '_blank' : global_1.undefined
                    }, source)],
                ''
            ]));
        },
        {
            '../../../combinator': 39,
            '../../source': 135,
            'spica/global': 14,
            'typed-dom': 32
        }
    ],
    101: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.address = void 0;
            const combinator_1 = _dereq_('../../../combinator');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.address = combinator_1.creator(combinator_1.validate('>', combinator_1.focus(/^>>?[0-9][0-9A-Za-z]*(?:-[0-9A-Za-z]+)*/, source => [
                [typed_dom_1.html('a', {
                        class: 'address',
                        href: `?res=${ source.slice(source.lastIndexOf('>') + 1) }`,
                        rel: 'noopener'
                    }, source)],
                ''
            ])));
        },
        {
            '../../../combinator': 39,
            'typed-dom': 32
        }
    ],
    102: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.channel = void 0;
            const combinator_1 = _dereq_('../../../combinator');
            const util_1 = _dereq_('../../util');
            const account_1 = _dereq_('./account');
            const hashtag_1 = _dereq_('./hashtag');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.channel = combinator_1.validate('@', combinator_1.bind(combinator_1.sequence([
                account_1.account,
                combinator_1.some(hashtag_1.hashtag)
            ]), (es, rest) => {
                const source = util_1.stringify(es);
                if (source.includes('/', source.indexOf('#')))
                    return;
                const el = es[0];
                const url = `${ el.getAttribute('href') }?ch=${ source.slice(source.indexOf('#') + 1).replace(/#/g, '+') }`;
                return [
                    [typed_dom_1.define(el, {
                            class: 'channel',
                            href: url
                        }, source)],
                    rest
                ];
            }));
        },
        {
            '../../../combinator': 39,
            '../../util': 142,
            './account': 100,
            './hashtag': 105,
            'typed-dom': 32
        }
    ],
    103: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.email = void 0;
            const combinator_1 = _dereq_('../../../combinator');
            const source_1 = _dereq_('../../source');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.email = combinator_1.creator(combinator_1.rewrite(combinator_1.sequence([
                combinator_1.verify(source_1.str(/^[0-9A-Za-z]+(?:[.+_-][0-9A-Za-z]+)*@/), ([source]) => source.length <= 63 + 1),
                combinator_1.verify(source_1.str(/^[0-9A-Za-z](?:[0-9A-Za-z-]{0,61}[0-9A-Za-z])?(?:\.[0-9A-Za-z](?:[0-9A-Za-z-]{0,61}[0-9A-Za-z])?)*/), ([source]) => source.length <= 256 - 63 - 1)
            ]), source => [
                [typed_dom_1.html('a', {
                        class: 'email',
                        href: `mailto:${ source }`,
                        rel: 'noopener'
                    }, source)],
                ''
            ]));
        },
        {
            '../../../combinator': 39,
            '../../source': 135,
            'typed-dom': 32
        }
    ],
    104: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.hashref = void 0;
            const combinator_1 = _dereq_('../../../combinator');
            const source_1 = _dereq_('../../source');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.hashref = combinator_1.creator(combinator_1.rewrite(combinator_1.open('#', source_1.str(/^[0-9]{1,16}(?![0-9A-Za-z]|[^\x00-\x7F\s])/)), (source, {host, url}) => [
                [typed_dom_1.html('a', {
                        class: 'hashref',
                        rel: 'noopener',
                        target: url && url.origin !== (host === null || host === void 0 ? void 0 : host.origin) ? '_blank' : undefined
                    }, source)],
                ''
            ]));
        },
        {
            '../../../combinator': 39,
            '../../source': 135,
            'typed-dom': 32
        }
    ],
    105: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.hashtag = void 0;
            const combinator_1 = _dereq_('../../../combinator');
            const source_1 = _dereq_('../../source');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.hashtag = combinator_1.creator(combinator_1.rewrite(combinator_1.open('#', combinator_1.tails([
                combinator_1.verify(source_1.str(/^[0-9A-Za-z](?:[0-9A-Za-z-]{0,61}[0-9A-Za-z])?(?:\.[0-9A-Za-z](?:[0-9A-Za-z-]{0,61}[0-9A-Za-z])?)*\//), ([source]) => source.length <= 253 + 1),
                combinator_1.validate(/^[0-9]{0,4}(?:[A-Za-z]|[^\x00-\x7F\s])/, source_1.str(/^(?:[0-9A-Za-z]|[^\x00-\x7F\s]){1,128}(?![0-9A-Za-z]|[^\x00-\x7F\s])/))
            ])), (source, {host, url}) => [
                [typed_dom_1.html('a', {
                        class: 'hashtag',
                        href: source.includes('/') ? `https://${ source.slice(1).replace('/', '/hashtags/') }` : `${ (url === null || url === void 0 ? void 0 : url.origin) || '' }/hashtags/${ source.slice(1) }`,
                        rel: 'noopener',
                        target: source.includes('/') || url && url.origin !== (host === null || host === void 0 ? void 0 : host.origin) ? '_blank' : undefined
                    }, source)],
                ''
            ]));
        },
        {
            '../../../combinator': 39,
            '../../source': 135,
            'typed-dom': 32
        }
    ],
    106: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.url = void 0;
            const global_1 = _dereq_('spica/global');
            const combinator_1 = _dereq_('../../../combinator');
            const link_1 = _dereq_('../link');
            const source_1 = _dereq_('../../source');
            const closer = /^[-+*=~^,.;:!?]*(?=["`|\[\](){}<>]|\\?$)/;
            exports.url = combinator_1.lazy(() => combinator_1.validate('http', '://', '\n', combinator_1.rewrite(combinator_1.open(/^https?:\/\/(?=[\x21-\x7E])/, combinator_1.focus(/^[\x21-\x7E]+/, combinator_1.some(combinator_1.union([
                bracket,
                combinator_1.some(source_1.unescsource, closer)
            ])))), combinator_1.convert(url => `{ ${ url } }`, combinator_1.context({ syntax: { inline: { link: global_1.undefined } } }, combinator_1.union([link_1.link]))))));
            const bracket = combinator_1.lazy(() => combinator_1.creator(combinator_1.union([
                combinator_1.surround('(', combinator_1.some(combinator_1.union([
                    bracket,
                    source_1.unescsource
                ]), ')'), ')', true),
                combinator_1.surround('[', combinator_1.some(combinator_1.union([
                    bracket,
                    source_1.unescsource
                ]), ']'), ']', true),
                combinator_1.surround('{', combinator_1.some(combinator_1.union([
                    bracket,
                    source_1.unescsource
                ]), '}'), '}', true),
                combinator_1.surround('<', combinator_1.some(combinator_1.union([
                    bracket,
                    source_1.unescsource
                ]), '>'), '>', true),
                combinator_1.surround('"', combinator_1.some(source_1.unescsource, '"'), '"', true)
            ])));
        },
        {
            '../../../combinator': 39,
            '../../source': 135,
            '../link': 123,
            'spica/global': 14
        }
    ],
    107: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.bracket = void 0;
            const global_1 = _dereq_('spica/global');
            const inline_1 = _dereq_('../inline');
            const combinator_1 = _dereq_('../../combinator');
            const source_1 = _dereq_('../source');
            const array_1 = _dereq_('spica/array');
            exports.bracket = combinator_1.lazy(() => combinator_1.union([
                combinator_1.surround(source_1.str('('), combinator_1.some(inline_1.inline, ')'), source_1.str(')'), true, global_1.undefined, ([as, bs = []], rest) => [
                    array_1.unshift(as, bs),
                    rest
                ]),
                combinator_1.surround(source_1.str('['), combinator_1.some(inline_1.inline, ']'), source_1.str(']'), true, global_1.undefined, ([as, bs = []], rest) => [
                    array_1.unshift(as, bs),
                    rest
                ]),
                combinator_1.surround(source_1.str('{'), combinator_1.some(inline_1.inline, '}'), source_1.str('}'), true, global_1.undefined, ([as, bs = []], rest) => [
                    array_1.unshift(as, bs),
                    rest
                ]),
                combinator_1.surround(source_1.str('"'), combinator_1.some(inline_1.inline, '"', '"'), source_1.str('"'), true, global_1.undefined, ([as, bs = []], rest) => [
                    array_1.unshift(as, bs),
                    rest
                ])
            ]));
        },
        {
            '../../combinator': 39,
            '../inline': 97,
            '../source': 135,
            'spica/array': 6,
            'spica/global': 14
        }
    ],
    108: [
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
            '../../combinator': 39,
            'typed-dom': 32
        }
    ],
    109: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.comment = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.comment = combinator_1.creator(combinator_1.validate('<#', '#>', combinator_1.match(/^<(#+)\s+((?:(?!\1>)\S+\s+)+)(\1>)?/, ([, , title, closer]) => (rest, {resources}) => closer ? [
                [typed_dom_1.html('sup', {
                        class: 'comment',
                        title: title.trim()
                    })],
                rest
            ] : resources && void (resources.budget -= title.match(/\s+/g).length))));
        },
        {
            '../../combinator': 39,
            'typed-dom': 32
        }
    ],
    110: [
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
            exports.deletion = combinator_1.lazy(() => combinator_1.creator(combinator_1.surround(source_1.str('~~'), combinator_1.union([combinator_1.some(inline_1.inline, '~~')]), source_1.str('~~'), false, ([, bs], rest) => [
                [typed_dom_1.html('del', util_1.defrag(bs))],
                rest
            ], ([as, bs], rest) => [
                array_1.unshift(as, bs),
                rest
            ])));
        },
        {
            '../../combinator': 39,
            '../inline': 97,
            '../source': 135,
            '../util': 142,
            'spica/array': 6,
            'typed-dom': 32
        }
    ],
    111: [
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
            exports.emphasis = combinator_1.lazy(() => combinator_1.creator(combinator_1.surround(source_1.str('*', '*'), util_1.startTight(combinator_1.some(combinator_1.union([
                strong_1.strong,
                combinator_1.some(inline_1.inline, '*')
            ]))), source_1.str('*'), false, ([as, bs, cs], rest) => util_1.isEndTight(bs) ? [
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
            '../../combinator': 39,
            '../inline': 97,
            '../source': 135,
            '../util': 142,
            './strong': 130,
            'spica/array': 6,
            'typed-dom': 32
        }
    ],
    112: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.emstrong = void 0;
            const inline_1 = _dereq_('../inline');
            const combinator_1 = _dereq_('../../combinator');
            const util_1 = _dereq_('../util');
            const source_1 = _dereq_('../source');
            const typed_dom_1 = _dereq_('typed-dom');
            const array_1 = _dereq_('spica/array');
            exports.emstrong = combinator_1.lazy(() => combinator_1.creator(combinator_1.surround(source_1.str('***'), util_1.startTight(combinator_1.union([combinator_1.some(inline_1.inline, '*')])), source_1.str(/^\*{1,3}/), false, ([as, bs, cs], rest, context) => {
                if (!util_1.isEndTight(bs))
                    return [
                        array_1.unshift(as, bs),
                        cs[0] + rest
                    ];
                switch (cs[0]) {
                case '*':
                    return combinator_1.bind(combinator_1.union([combinator_1.some(inline_1.inline, '**')]), (ms, rest) => rest.slice(0, 2) === '**' && util_1.isEndTight(ms) ? [
                        [typed_dom_1.html('strong', array_1.unshift([typed_dom_1.html('em', util_1.defrag(util_1.trimEnd(bs)))], util_1.defrag(util_1.trimEnd(ms))))],
                        rest.slice(2)
                    ] : [
                        array_1.unshift([
                            '**',
                            typed_dom_1.html('em', util_1.defrag(util_1.trimEnd(bs)))
                        ], ms),
                        rest
                    ])(rest, context) || [
                        [
                            '**',
                            typed_dom_1.html('em', util_1.defrag(util_1.trimEnd(bs)))
                        ],
                        rest
                    ];
                case '**':
                    return combinator_1.bind(combinator_1.union([combinator_1.some(inline_1.inline, '*')]), (ms, rest) => rest.slice(0, 1) === '*' && util_1.isEndTight(ms) ? [
                        [typed_dom_1.html('em', array_1.unshift([typed_dom_1.html('strong', util_1.defrag(util_1.trimEnd(bs)))], util_1.defrag(util_1.trimEnd(ms))))],
                        rest.slice(1)
                    ] : [
                        array_1.unshift([
                            '*',
                            typed_dom_1.html('strong', util_1.defrag(util_1.trimEnd(bs)))
                        ], ms),
                        rest
                    ])(rest, context) || [
                        [
                            '*',
                            typed_dom_1.html('strong', util_1.defrag(util_1.trimEnd(bs)))
                        ],
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
            '../../combinator': 39,
            '../inline': 97,
            '../source': 135,
            '../util': 142,
            'spica/array': 6,
            'typed-dom': 32
        }
    ],
    113: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.escape = void 0;
            const global_1 = _dereq_('spica/global');
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
                        return source[3] === source[0] && source[2] === source[0] && source[1] === source[0] ? repeat(source, context) : global_1.undefined;
                    case '+':
                    case '~':
                    case '=':
                        return source[2] === source[0] && source[1] === source[0] ? repeat(source, context) : global_1.undefined;
                    default:
                        return;
                    }
                }]);
        },
        {
            '../../combinator': 39,
            '../source': 135,
            'spica/global': 14
        }
    ],
    114: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.extension = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const index_1 = _dereq_('./extension/index');
            const label_1 = _dereq_('./extension/label');
            const placeholder_1 = _dereq_('./extension/placeholder');
            exports.extension = combinator_1.validate([
                '[',
                '$'
            ], combinator_1.union([
                index_1.index,
                label_1.label,
                placeholder_1.placeholder
            ]));
        },
        {
            '../../combinator': 39,
            './extension/index': 115,
            './extension/label': 118,
            './extension/placeholder': 119
        }
    ],
    115: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.index = void 0;
            const global_1 = _dereq_('spica/global');
            const inline_1 = _dereq_('../../inline');
            const combinator_1 = _dereq_('../../../combinator');
            const util_1 = _dereq_('../../util');
            const indexee_1 = _dereq_('./indexee');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.index = combinator_1.lazy(() => combinator_1.creator(combinator_1.validate('[#', ']', '\n', combinator_1.fmap(indexee_1.indexee(combinator_1.surround('[#', combinator_1.guard(context => {
                var _a, _b, _c;
                return (_c = (_b = (_a = context.syntax) === null || _a === void 0 ? void 0 : _a.inline) === null || _b === void 0 ? void 0 : _b.index) !== null && _c !== void 0 ? _c : true;
            }, util_1.startTight(combinator_1.context({
                syntax: {
                    inline: {
                        annotation: false,
                        reference: false,
                        index: false,
                        label: false,
                        link: false,
                        media: false,
                        autolink: false
                    }
                }
            }, combinator_1.union([combinator_1.some(inline_1.inline, ']', /^\\?\n/)])))), ']', false, ([, bs], rest) => util_1.isEndTight(bs) ? [
                [typed_dom_1.html('a', util_1.defrag(util_1.trimEnd(bs)))],
                rest
            ] : global_1.undefined)), ([el]) => [typed_dom_1.define(el, {
                    id: el.id ? null : global_1.undefined,
                    class: 'index',
                    href: el.id ? `#${ el.id }` : global_1.undefined
                }, el.childNodes)]))));
        },
        {
            '../../../combinator': 39,
            '../../inline': 97,
            '../../util': 142,
            './indexee': 116,
            'spica/global': 14,
            'typed-dom': 32
        }
    ],
    116: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.text = exports.identity = exports.indexee = void 0;
            const global_1 = _dereq_('spica/global');
            const combinator_1 = _dereq_('../../../combinator');
            const typed_dom_1 = _dereq_('typed-dom');
            function indexee(parser) {
                return combinator_1.fmap(parser, ([el], _, {id}) => [typed_dom_1.define(el, { id: id !== '' && identity(el) || global_1.undefined })]);
            }
            exports.indexee = indexee;
            function identity(source) {
                return identify(text(source));
            }
            exports.identity = identity;
            function text(source) {
                const indexer = source.querySelector('.indexer');
                if (indexer)
                    return indexer.getAttribute('data-index');
                const target = source.cloneNode(true);
                for (let es = target.querySelectorAll('code[data-src], .math[data-src]'), i = 0, len = es.length; i < len; ++i) {
                    typed_dom_1.define(es[i], es[i].getAttribute('data-src'));
                }
                for (let es = target.querySelectorAll('.annotation, .reference, rt, rp'), i = 0, len = es.length; i < len; ++i) {
                    es[i].remove();
                }
                return target.innerText.trim();
            }
            exports.text = text;
            function identify(index) {
                return index ? `index:${ index.trim().replace(/\s+/g, '_').slice(0, 101).replace(/^(.{97}).{4}$/, '$1...') }` : '';
            }
        },
        {
            '../../../combinator': 39,
            'spica/global': 14,
            'typed-dom': 32
        }
    ],
    117: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.indexer = void 0;
            const combinator_1 = _dereq_('../../../combinator');
            const index_1 = _dereq_('./index');
            const source_1 = _dereq_('../../source');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.indexer = combinator_1.creator(combinator_1.surround(source_1.str(/^\s+(?=\[#[^\s\]])/), combinator_1.context({ syntax: { inline: { index: true } } }, combinator_1.union([index_1.index])), /^\s*$/, false, ([, [el]], rest) => [
                [typed_dom_1.html('span', {
                        class: 'indexer',
                        'data-index': el.getAttribute('href').slice(el.hash.indexOf(':') + 1)
                    })],
                rest
            ]));
        },
        {
            '../../../combinator': 39,
            '../../source': 135,
            './index': 115,
            'typed-dom': 32
        }
    ],
    118: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.isFixed = exports.number = exports.label = exports.segment = void 0;
            const combinator_1 = _dereq_('../../../combinator');
            const source_1 = _dereq_('../../source');
            const typed_dom_1 = _dereq_('typed-dom');
            const array_1 = _dereq_('spica/array');
            const body = source_1.str(/^\$[A-Za-z]*(?:(?:-[A-Za-z][0-9A-Za-z]*(?![0-9A-Za-z]))+|-(?:(?:0|[1-9][0-9]*)\.)*(?:0|[1-9][0-9]*)(?!\.?[0-9A-Za-z]))/);
            exports.segment = combinator_1.clear(combinator_1.validate([
                '[$',
                '$'
            ], combinator_1.union([
                combinator_1.surround('[', body, ']'),
                body
            ])));
            exports.label = combinator_1.creator(combinator_1.fmap(combinator_1.validate([
                '[$',
                '$'
            ], combinator_1.guard(context => {
                var _a, _b, _c;
                return (_c = (_b = (_a = context.syntax) === null || _a === void 0 ? void 0 : _a.inline) === null || _b === void 0 ? void 0 : _b.label) !== null && _c !== void 0 ? _c : true;
            }, combinator_1.union([
                combinator_1.surround('[', body, ']'),
                body
            ]))), ([text]) => [typed_dom_1.html('a', {
                    class: 'label',
                    'data-label': text.slice(text[1] === '-' ? 0 : 1).toLowerCase()
                }, text)]));
            function number(label, base) {
                return isFixed(label) ? label.slice(label.lastIndexOf('-') + 1) : increment(base, base.split('.').length);
            }
            exports.number = number;
            function isFixed(label) {
                return /^[^-]+-[0-9]+(?:\.[0-9]+)*$/.test(label);
            }
            exports.isFixed = isFixed;
            function increment(number, position) {
                if (number === '0' && position > 1)
                    return increment('1', position);
                const ns = number.split('.');
                const ms = [];
                for (let i = 0; i < position; ++i) {
                    ms.push(i < ns.length ? i + 1 < position ? +ns[i] : +ns[i] + 1 : i + 1 < position ? 0 : 1);
                }
                return array_1.join(ms, '.');
            }
        },
        {
            '../../../combinator': 39,
            '../../source': 135,
            'spica/array': 6,
            'typed-dom': 32
        }
    ],
    119: [
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
            exports.placeholder = combinator_1.lazy(() => combinator_1.creator(combinator_1.surround(source_1.str(/^\[[:^]/), util_1.startTight(combinator_1.some(combinator_1.union([inline_1.inline]), ']')), source_1.str(']'), false, ([as, bs, cs], rest) => [
                util_1.isEndTight(bs) ? [typed_dom_1.html('span', {
                        class: 'invalid',
                        'data-invalid-syntax': 'extension',
                        'data-invalid-type': 'syntax',
                        'data-invalid-message': 'Invalid symbol.'
                    }, util_1.defrag(util_1.trimEnd(bs)))] : array_1.push(array_1.unshift(as, bs), cs),
                rest
            ], ([as, bs], rest) => [
                array_1.unshift(as, bs),
                rest
            ])));
        },
        {
            '../../../combinator': 39,
            '../../inline': 97,
            '../../source': 135,
            '../../util': 142,
            'spica/array': 6,
            'typed-dom': 32
        }
    ],
    120: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.attributes = exports.attribute = exports.html = void 0;
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
            const attrspec = {
                bdo: {
                    dir: alias_1.ObjectFreeze([
                        'ltr',
                        'rtl'
                    ])
                }
            };
            alias_1.ObjectSetPrototypeOf(attrspec, null);
            alias_1.ObjectValues(attrspec).forEach(o => alias_1.ObjectSetPrototypeOf(o, null));
            exports.html = combinator_1.lazy(() => combinator_1.creator(combinator_1.validate('<', combinator_1.union([
                combinator_1.match(/^(?=<(wbr)(?=[ >]))/, combinator_1.memoize(([, tag]) => tag, tag => combinator_1.surround(source_1.str(`<${ tag }`), combinator_1.some(combinator_1.union([exports.attribute])), source_1.str('>'), true, ([, as = []], rest) => [
                    [typed_dom_1.html(tag, attributes('html', attrspec[tag], as, []))],
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
                })(), combinator_1.some(combinator_1.union([inline_1.inline]), `</${ tag }>`))), source_1.str(`</${ tag }>`), false, ([as, bs, cs], rest, context) => util_1.isEndTight(bs) ? [
                    [elem(tag, as, util_1.trimEnd(bs), cs, context)],
                    rest
                ] : global_1.undefined)))),
                combinator_1.match(/^(?=<([a-z]+)(?=[ >]))/, ([, tag]) => combinator_1.surround(combinator_1.surround(source_1.str(`<${ tag }`), combinator_1.some(exports.attribute), source_1.str('>'), true), util_1.startTight(combinator_1.some(combinator_1.union([inline_1.inline]), `</${ tag }>`)), source_1.str(`</${ tag }>`), false, ([as, bs, cs], rest) => util_1.isEndTight(bs) ? [
                    [elem(tag, as, util_1.trimEnd(bs), cs, {})],
                    rest
                ] : as.length === 1 ? [
                    array_1.push(array_1.unshift(as, bs), cs),
                    rest
                ] : global_1.undefined, ([as, bs], rest) => as.length === 1 ? [
                    array_1.unshift(as, bs),
                    rest
                ] : global_1.undefined))
            ]))));
            exports.attribute = combinator_1.union([source_1.str(/^ [a-z]+(?:-[a-z]+)*(?:="(?:\\[^\n]|[^\n"])*")?(?=[ >])/)]);
            function elem(tag, as, bs, cs, context) {
                var _a, _b, _c, _d, _e, _f, _g, _h;
                if (!tags.includes(tag)) {
                    return invalid('tag', `Invalid HTML tag <${ tag }>.`, as, bs, cs);
                }
                switch (tag) {
                case 'bdo':
                case 'bdi':
                    switch (true) {
                    case (_b = (_a = context.state) === null || _a === void 0 ? void 0 : _a.in) === null || _b === void 0 ? void 0 : _b.bdx:
                        return invalid('nest', `Unnestable HTML tag <${ tag }>.`, as, bs, cs);
                    }
                    break;
                case 'sup':
                case 'sub':
                    switch (true) {
                    case (_d = (_c = context.state) === null || _c === void 0 ? void 0 : _c.in) === null || _d === void 0 ? void 0 : _d.supsub:
                        return invalid('nest', `Unnestable HTML tag <${ tag }>.`, as, bs, cs);
                    }
                    break;
                case 'small':
                    switch (true) {
                    case (_f = (_e = context.state) === null || _e === void 0 ? void 0 : _e.in) === null || _f === void 0 ? void 0 : _f.supsub:
                    case (_h = (_g = context.state) === null || _g === void 0 ? void 0 : _g.in) === null || _h === void 0 ? void 0 : _h.small:
                        return invalid('nest', `Unnestable HTML tag <${ tag }>.`, as, bs, cs);
                    }
                    break;
                }
                let attrs;
                switch (true) {
                case as[as.length - 1] !== '>' || 'data-invalid-syntax' in (attrs = attributes('html', attrspec[tag], as.slice(1, -1).map(util_1.stringify), [])):
                    return invalid('attribute', 'Invalid HTML attribute.', as, bs, cs);
                case cs.length === 0:
                    return invalid('closer', `Missing the closing HTML tag <${ tag }>.`, as, bs, cs);
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
            function attributes(syntax, spec, params, classes) {
                let invalid = false;
                const attrs = params.reduce((attrs, param) => {
                    var _a;
                    param = param.slice(1);
                    const key = param.split('=', 1)[0];
                    const val = param !== key ? param.slice(key.length + 2, -1).replace(/\\(.?)/g, '$1') : global_1.undefined;
                    invalid = invalid || !spec || key in attrs;
                    ((_a = spec === null || spec === void 0 ? void 0 : spec[key]) === null || _a === void 0 ? void 0 : _a.includes(val)) ? attrs[key] = val || '' : invalid = invalid || !!spec;
                    return attrs;
                }, alias_1.ObjectCreate(null));
                invalid = invalid || !!spec && !requiredAttributes(spec).every(([k]) => k in attrs);
                if (invalid) {
                    !classes.includes('invalid') && classes.push('invalid');
                    attrs.class = array_1.join(classes, ' ').trim();
                    attrs['data-invalid-syntax'] = syntax;
                    attrs['data-invalid-type'] = syntax === 'html' ? 'attribute' : 'parameter';
                    attrs['data-invalid-message'] = `Invalid ${ attrs['data-invalid-type'] }.`;
                }
                return attrs;
            }
            exports.attributes = attributes;
        },
        {
            '../../combinator': 39,
            '../inline': 97,
            '../source': 135,
            '../util': 142,
            'spica/alias': 5,
            'spica/array': 6,
            'spica/global': 14,
            'spica/memoize': 15,
            'typed-dom': 32
        }
    ],
    121: [
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
            '../../combinator': 39,
            'typed-dom': 32
        }
    ],
    122: [
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
            exports.insertion = combinator_1.lazy(() => combinator_1.creator(combinator_1.surround(source_1.str('++'), combinator_1.union([combinator_1.some(inline_1.inline, '++')]), source_1.str('++'), false, ([, bs], rest) => [
                [typed_dom_1.html('ins', util_1.defrag(bs))],
                rest
            ], ([as, bs], rest) => [
                array_1.unshift(as, bs),
                rest
            ])));
        },
        {
            '../../combinator': 39,
            '../inline': 97,
            '../source': 135,
            '../util': 142,
            'spica/array': 6,
            'typed-dom': 32
        }
    ],
    123: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.sanitize = exports.resolve = exports.option = exports.uri = exports.link = exports.optspec = void 0;
            const global_1 = _dereq_('spica/global');
            const alias_1 = _dereq_('spica/alias');
            const inline_1 = _dereq_('../inline');
            const combinator_1 = _dereq_('../../combinator');
            const util_1 = _dereq_('../util');
            const html_1 = _dereq_('./html');
            const autolink_1 = _dereq_('../autolink');
            const source_1 = _dereq_('../source');
            const url_1 = _dereq_('spica/url');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.optspec = { nofollow: [global_1.undefined] };
            alias_1.ObjectSetPrototypeOf(exports.optspec, null);
            exports.link = combinator_1.lazy(() => combinator_1.creator(10, combinator_1.bind(combinator_1.reverse(combinator_1.validate([
                '[',
                '{'
            ], combinator_1.validate(/^(?:\[[^\n]*?\])?\{[^\n]+?\}/, combinator_1.guard(context => {
                var _a, _b, _c;
                return (_c = (_b = (_a = context.syntax) === null || _a === void 0 ? void 0 : _a.inline) === null || _b === void 0 ? void 0 : _b.link) !== null && _c !== void 0 ? _c : true;
            }, combinator_1.tails([
                combinator_1.context({ syntax: { inline: { link: false } } }, util_1.dup(combinator_1.union([
                    combinator_1.surround('[', inline_1.media, ']'),
                    combinator_1.surround('[', inline_1.shortmedia, ']'),
                    combinator_1.surround('[', util_1.startTight(combinator_1.context({
                        syntax: {
                            inline: {
                                annotation: false,
                                reference: false,
                                index: false,
                                label: false,
                                link: false,
                                media: false,
                                autolink: false
                            }
                        }
                    }, combinator_1.some(inline_1.inline, ']', /^\\?\n/))), ']', true)
                ]))),
                util_1.dup(combinator_1.surround(/^{(?![{}])/, combinator_1.inits([
                    exports.uri,
                    combinator_1.some(exports.option)
                ]), /^ ?}/))
            ]))))), ([options, content = []], rest, context) => {
                var _a, _b;
                if (!util_1.isEndTight(content))
                    return;
                if (combinator_1.eval(combinator_1.some(autolink_1.autolink)(util_1.stringify(content), context), []).some(node => typeof node === 'object'))
                    return;
                const INSECURE_URI = options.shift();
                const src = resolve(INSECURE_URI, context.host || global_1.location, context.url || global_1.location);
                const el = typed_dom_1.html('a', {
                    href: src,
                    rel: `noopener${ options.includes(' nofollow') ? ' nofollow noreferrer' : '' }`
                }, content.length > 0 ? content = util_1.defrag(util_1.trimEnd(content)) : decode(INSECURE_URI).replace(/^tel:/, ''));
                if (!sanitize(new url_1.URL(src, ((_a = context.host) === null || _a === void 0 ? void 0 : _a.href) || global_1.location.href), el, INSECURE_URI, ((_b = context.host) === null || _b === void 0 ? void 0 : _b.origin) || global_1.location.origin))
                    return [
                        [el],
                        rest
                    ];
                typed_dom_1.define(el, alias_1.ObjectAssign(html_1.attributes('link', exports.optspec, options, []), { nofollow: global_1.undefined }));
                return [
                    [el],
                    rest
                ];
            })));
            exports.uri = combinator_1.union([
                combinator_1.open(' ', source_1.str(/^\S+/)),
                source_1.str(/^[^\s{}]+/)
            ]);
            exports.option = combinator_1.union([source_1.str(/^ [a-z]+(?:-[a-z]+)*(?:="(?:\\[^\n]|[^\n"])*")?(?=[ }])/)]);
            function resolve(uri, host, source) {
                var _a;
                switch (true) {
                case uri.slice(0, 2) === '^/':
                    const filename = host.pathname.slice(host.pathname.lastIndexOf('/') + 1);
                    return filename.includes('.') ? `${ host.pathname.slice(0, -filename.length) }${ uri.slice(2) }` : `${ fillTrailingSlash(host.pathname) }${ uri.slice(2) }`;
                case host.origin === source.origin && host.pathname === source.pathname:
                case uri.slice(0, 2) === '//':
                    return uri;
                default:
                    const target = new url_1.URL(uri, source.href);
                    return target.origin === ((_a = uri.match(/^[A-Za-z][0-9A-Za-z.+-]*:\/\/[^/?#]*/)) === null || _a === void 0 ? void 0 : _a[0]) ? uri : target.origin === host.origin ? target.href.slice(target.origin.length) : target.href;
                }
            }
            exports.resolve = resolve;
            function fillTrailingSlash(pathname) {
                return pathname[pathname.length - 1] === '/' ? pathname : pathname + '/';
            }
            function sanitize(uri, target, text, origin) {
                let type;
                let message;
                switch (uri.protocol) {
                case 'http:':
                case 'https:': {
                        uri.host && uri.origin !== origin && target.tagName === 'A' && target.setAttribute('target', '_blank');
                        if (uri.host)
                            return true;
                        type = 'parameter';
                        message = 'Invalid host.';
                        break;
                    }
                case target.tagName === 'A' && 'tel:':
                    if (`tel:${ target.textContent.replace(/-(?=[0-9])/g, '') }` === text)
                        return true;
                    type = 'content';
                    message = 'Invalid phone number.';
                    break;
                default:
                    type = 'parameter';
                    message = 'Invalid protocol.';
                }
                typed_dom_1.define(target, {
                    class: `${ target.className } invalid`.trim(),
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
            '../../combinator': 39,
            '../autolink': 73,
            '../inline': 97,
            '../source': 135,
            '../util': 142,
            './html': 120,
            'spica/alias': 5,
            'spica/global': 14,
            'spica/url': 29,
            'typed-dom': 32
        }
    ],
    124: [
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
            exports.mark = combinator_1.lazy(() => combinator_1.creator(combinator_1.surround(source_1.str('=='), util_1.startTight(combinator_1.union([combinator_1.some(inline_1.inline, '==')])), source_1.str('=='), false, ([as, bs, cs], rest) => util_1.isEndTight(bs) ? [
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
            '../../combinator': 39,
            '../inline': 97,
            '../source': 135,
            '../util': 142,
            'spica/array': 6,
            'typed-dom': 32
        }
    ],
    125: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.math = void 0;
            const global_1 = _dereq_('spica/global');
            const combinator_1 = _dereq_('../../combinator');
            const source_1 = _dereq_('../source');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.math = combinator_1.creator(combinator_1.fmap(combinator_1.surround('${', combinator_1.union([source_1.str(/^[^\S\n]*(?!}\$)\S[^\n]*?(?=}\$)/)]), '}$'), ([source], _, {
                caches: {
                    math: cache = global_1.undefined
                } = {}
            }) => [(source = `\${${ source.trim() }}$`) && (cache === null || cache === void 0 ? void 0 : cache.has(source)) ? cache.get(source).cloneNode(true) : typed_dom_1.html('span', {
                    class: 'math notranslate',
                    'data-src': source
                }, source)]));
        },
        {
            '../../combinator': 39,
            '../source': 135,
            'spica/global': 14,
            'typed-dom': 32
        }
    ],
    126: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.media = void 0;
            const global_1 = _dereq_('spica/global');
            const combinator_1 = _dereq_('../../combinator');
            const util_1 = _dereq_('../util');
            const link_1 = _dereq_('./link');
            const source_1 = _dereq_('../source');
            const html_1 = _dereq_('./html');
            const url_1 = _dereq_('spica/url');
            const array_1 = _dereq_('spica/array');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.media = combinator_1.lazy(() => combinator_1.creator(10, combinator_1.bind(combinator_1.fmap(combinator_1.open('!', combinator_1.validate([
                '[',
                '{'
            ], combinator_1.validate(/^(?:\[[^\n]*?\])?\{[^\n]+?\}/, combinator_1.guard(context => {
                var _a, _b, _c;
                return (_c = (_b = (_a = context.syntax) === null || _a === void 0 ? void 0 : _a.inline) === null || _b === void 0 ? void 0 : _b.media) !== null && _c !== void 0 ? _c : true;
            }, combinator_1.tails([
                util_1.dup(combinator_1.surround(/^\[(?!\\?\s)/, combinator_1.some(combinator_1.union([
                    bracket,
                    source_1.text
                ]), ']', /^\\?\n/), ']', true)),
                util_1.dup(combinator_1.surround(/^{(?![{}])/, combinator_1.inits([
                    link_1.uri,
                    combinator_1.some(link_1.option)
                ]), /^ ?}/))
            ]))))), ([as, bs]) => bs ? [
                [array_1.join(as)],
                bs
            ] : [
                [''],
                as
            ]), ([[text], options], rest, context) => {
                var _a, _b, _c, _d, _e, _f;
                if (text.length > 0 && text.slice(-2).trimStart() === '')
                    return;
                const INSECURE_URI = options.shift();
                const src = link_1.resolve(INSECURE_URI, context.host || global_1.location, context.url || global_1.location);
                const url = new url_1.URL(src, ((_a = context.host) === null || _a === void 0 ? void 0 : _a.href) || global_1.location.href);
                const cache = (_b = context.caches) === null || _b === void 0 ? void 0 : _b.media;
                const cached = cache === null || cache === void 0 ? void 0 : cache.has(url.href);
                const el = cache && cached ? cache.get(url.href).cloneNode(true) : typed_dom_1.html('img', {
                    class: 'media',
                    'data-src': src,
                    alt: text.trim()
                });
                if (!cached && !link_1.sanitize(url, el, INSECURE_URI, ((_c = context.host) === null || _c === void 0 ? void 0 : _c.origin) || global_1.location.origin))
                    return [
                        [el],
                        rest
                    ];
                cached && el.hasAttribute('alt') && el.setAttribute('alt', text.trim());
                typed_dom_1.define(el, {
                    ...html_1.attributes('media', link_1.optspec, options, el.className.trim().split(/\s+/)),
                    nofollow: global_1.undefined
                });
                return ((_f = (_e = (_d = context.syntax) === null || _d === void 0 ? void 0 : _d.inline) === null || _e === void 0 ? void 0 : _e.link) !== null && _f !== void 0 ? _f : true) && (!cached || el.tagName === 'IMG') ? combinator_1.fmap(link_1.link, ([link]) => [typed_dom_1.define(link, { target: '_blank' }, [el])])(`{ ${ INSECURE_URI }${ array_1.join(options) } }${ rest }`, context) : [
                    [el],
                    rest
                ];
            })));
            const bracket = combinator_1.lazy(() => combinator_1.creator(combinator_1.union([
                combinator_1.surround(source_1.str('('), combinator_1.some(combinator_1.union([
                    bracket,
                    source_1.text
                ]), ')'), source_1.str(')'), true, global_1.undefined, ([as, bs = []], rest) => [
                    array_1.unshift(as, bs),
                    rest
                ]),
                combinator_1.surround(source_1.str('['), combinator_1.some(combinator_1.union([
                    bracket,
                    source_1.text
                ]), ']'), source_1.str(']'), true, global_1.undefined, ([as, bs = []], rest) => [
                    array_1.unshift(as, bs),
                    rest
                ]),
                combinator_1.surround(source_1.str('{'), combinator_1.some(combinator_1.union([
                    bracket,
                    source_1.text
                ]), '}'), source_1.str('}'), true, global_1.undefined, ([as, bs = []], rest) => [
                    array_1.unshift(as, bs),
                    rest
                ]),
                combinator_1.surround(source_1.str('"'), combinator_1.some(source_1.text, '"'), source_1.str('"'), true, global_1.undefined, ([as, bs = []], rest) => [
                    array_1.unshift(as, bs),
                    rest
                ])
            ])));
        },
        {
            '../../combinator': 39,
            '../source': 135,
            '../util': 142,
            './html': 120,
            './link': 123,
            'spica/array': 6,
            'spica/global': 14,
            'spica/url': 29,
            'typed-dom': 32
        }
    ],
    127: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.reference = void 0;
            const global_1 = _dereq_('spica/global');
            const combinator_1 = _dereq_('../../combinator');
            const util_1 = _dereq_('../util');
            const inline_1 = _dereq_('../inline');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.reference = combinator_1.lazy(() => combinator_1.creator(combinator_1.validate('[[', ']]', '\n', combinator_1.bind(combinator_1.surround('[[', combinator_1.guard(context => {
                var _a, _b, _c;
                return (_c = (_b = (_a = context.syntax) === null || _a === void 0 ? void 0 : _a.inline) === null || _b === void 0 ? void 0 : _b.reference) !== null && _c !== void 0 ? _c : true;
            }, util_1.startTight(combinator_1.context({
                syntax: {
                    inline: {
                        annotation: false,
                        reference: false,
                        media: false
                    }
                },
                state: global_1.undefined
            }, combinator_1.subsequence([
                alias,
                util_1.startTight(combinator_1.some(inline_1.inline, ']', /^\\?\n/))
            ])))), ']]'), (ns, rest) => util_1.isEndTight(ns) ? [
                [typed_dom_1.html('sup', {
                        class: 'reference',
                        ...attributes(ns)
                    }, util_1.defrag(util_1.trimEnd(ns)))],
                rest
            ] : global_1.undefined))));
            const alias = combinator_1.creator(combinator_1.focus(/^\^[0-9A-Za-z]+(?:(?:['-]|[.,]? |\., )[0-9A-Za-z]+)*(?:(?=]])|\|[^\S\n]?)/, source => [
                [typed_dom_1.html('abbr', source.split('|', 1)[0].slice(1))],
                ''
            ]));
            function attributes(ns) {
                return { 'data-alias': typeof ns[0] === 'object' && ns[0].tagName === 'ABBR' ? util_1.stringify(ns.shift()) : global_1.undefined };
            }
        },
        {
            '../../combinator': 39,
            '../inline': 97,
            '../util': 142,
            'spica/global': 14,
            'typed-dom': 32
        }
    ],
    128: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.ruby = void 0;
            const global_1 = _dereq_('spica/global');
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
                        [typed_dom_1.html('ruby', util_1.defrag(texts.reduce((acc, _, i) => array_1.push(acc, array_1.unshift([texts[i]], i < rubies.length && rubies[i].trimStart() !== '' ? [
                                typed_dom_1.html('rp', '('),
                                typed_dom_1.html('rt', rubies[i]),
                                typed_dom_1.html('rp', ')')
                            ] : [typed_dom_1.html('rt')])), [])))],
                        rest
                    ];
                case texts.length === 1 && [...texts[0]].length >= rubies.length:
                    return [
                        [typed_dom_1.html('ruby', util_1.defrag([...texts[0]].reduce((acc, _, i, texts) => array_1.push(acc, array_1.unshift([texts[i]], i < rubies.length && rubies[i].trimStart() !== '' ? [
                                typed_dom_1.html('rp', '('),
                                typed_dom_1.html('rt', rubies[i]),
                                typed_dom_1.html('rp', ')')
                            ] : [typed_dom_1.html('rt')])), [])))],
                        rest
                    ];
                default:
                    return [
                        [typed_dom_1.html('ruby', util_1.defrag(array_1.unshift([array_1.join(texts, ' ').trim()], [
                                typed_dom_1.html('rp', '('),
                                typed_dom_1.html('rt', array_1.join(rubies, ' ').trim()),
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
                    resources && --resources.budget;
                    const i = source.search(next);
                    switch (i) {
                    case -1:
                        acc[acc.length - 1] += source;
                        printable = printable || !!source.trimStart();
                        source = '';
                        continue;
                    case 0:
                        switch (source[0]) {
                        case '\\':
                            acc[acc.length - 1] += source[i + 1] || '';
                            printable = printable || !!((_a = source[i + 1]) === null || _a === void 0 ? void 0 : _a.trimStart());
                            source = source.slice(2);
                            continue;
                        case '&': {
                                const result = htmlentity_1.htmlentity(source, context);
                                const str = combinator_1.eval(result, [])[0] || source[0];
                                acc[acc.length - 1] += str;
                                printable = printable || !!str.trimStart();
                                source = combinator_1.exec(result, source.slice(str.length));
                                continue;
                            }
                        default:
                            source[0].trimStart() ? acc[acc.length - 1] += source[0] : acc.push('');
                            printable = printable || !!source[0].trimStart();
                            source = source.slice(1);
                            continue;
                        }
                    default:
                        acc[acc.length - 1] += source.slice(0, i);
                        printable = printable || !!source.slice(0, i).trimStart();
                        source = source.slice(i);
                        continue;
                    }
                }
                return printable ? [
                    [acc],
                    ''
                ] : global_1.undefined;
            });
        },
        {
            '../../combinator': 39,
            '../util': 142,
            './htmlentity': 121,
            'spica/array': 6,
            'spica/global': 14,
            'typed-dom': 32
        }
    ],
    129: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.shortmedia = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const url_1 = _dereq_('./autolink/url');
            const media_1 = _dereq_('./media');
            exports.shortmedia = combinator_1.rewrite(combinator_1.open('!', combinator_1.guard(context => {
                var _a, _b, _c;
                return (_c = (_b = (_a = context.syntax) === null || _a === void 0 ? void 0 : _a.inline) === null || _b === void 0 ? void 0 : _b.media) !== null && _c !== void 0 ? _c : true;
            }, url_1.url)), combinator_1.convert(source => `!{ ${ source.slice(1) } }`, combinator_1.union([media_1.media])));
        },
        {
            '../../combinator': 39,
            './autolink/url': 106,
            './media': 126
        }
    ],
    130: [
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
            exports.strong = combinator_1.lazy(() => combinator_1.creator(combinator_1.surround(source_1.str('**', '*'), util_1.startTight(combinator_1.some(combinator_1.union([
                emphasis_1.emphasis,
                combinator_1.some(inline_1.inline, '*'),
                source_1.str('*')
            ]), '**')), source_1.str('**'), false, ([as, bs, cs], rest) => util_1.isEndTight(bs) ? [
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
            '../../combinator': 39,
            '../inline': 97,
            '../source': 135,
            '../util': 142,
            './emphasis': 111,
            'spica/array': 6,
            'typed-dom': 32
        }
    ],
    131: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.template = void 0;
            const global_1 = _dereq_('spica/global');
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
                combinator_1.surround(source_1.str('('), combinator_1.some(combinator_1.union([
                    bracket,
                    source_1.escsource
                ]), ')'), source_1.str(')'), true, global_1.undefined, ([as, bs = []], rest) => [
                    array_1.unshift(as, bs),
                    rest
                ]),
                combinator_1.surround(source_1.str('['), combinator_1.some(combinator_1.union([
                    bracket,
                    source_1.escsource
                ]), ']'), source_1.str(']'), true, global_1.undefined, ([as, bs = []], rest) => [
                    array_1.unshift(as, bs),
                    rest
                ]),
                combinator_1.surround(source_1.str('{'), combinator_1.some(combinator_1.union([
                    bracket,
                    source_1.escsource
                ]), '}'), source_1.str('}'), true, global_1.undefined, ([as, bs = []], rest) => [
                    array_1.unshift(as, bs),
                    rest
                ]),
                combinator_1.surround(source_1.str('"'), combinator_1.some(source_1.escsource, /^"|^\\?\n/), source_1.str('"'), true, global_1.undefined, ([as, bs = []], rest) => [
                    array_1.unshift(as, bs),
                    rest
                ])
            ])));
        },
        {
            '../../combinator': 39,
            '../source': 135,
            'spica/array': 6,
            'spica/global': 14,
            'typed-dom': 32
        }
    ],
    132: [
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
                            el.replaceChild(typed_dom_1.html('wbr'), el.firstChild);
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
                    for (let ns = node.childNodes, i = ns.length; i--;) {
                        const child = ns[i];
                        switch ('id' in child && child.tagName) {
                        case 'RT':
                        case 'RP':
                            continue;
                        default:
                            return 'wholeText' in child ? child.data : 'innerText' in child ? child.innerText : child.textContent;
                        }
                    }
                    return '';
                default:
                    return 'wholeText' in node ? node.data : 'innerText' in node ? node.innerText : node.textContent;
                }
            }
        },
        {
            '../combinator': 39,
            './locale/ja': 133,
            'typed-dom': 32
        }
    ],
    133: [
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
    134: [
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
            const parser = combinator_1.union([
                heading_1.segment,
                codeblock_1.segment,
                mathblock_1.segment,
                extension_1.segment,
                combinator_1.some(source_1.contentline),
                combinator_1.some(source_1.emptyline)
            ]);
            function* segment(source) {
                if (source.length > 1000 * 1000)
                    return yield `\0# Error: Too large input over length 1,000,000.`;
                while (source !== '') {
                    const result = parser(source, {});
                    const rest = combinator_1.exec(result);
                    const segs = combinator_1.eval(result).length ? combinator_1.eval(result) : [source.slice(0, source.length - rest.length)];
                    for (let i = 0; i < segs.length; ++i) {
                        const seg = segs[i];
                        seg.length > 10 * 1000 ? yield `\0# Error: Too large block over length 10,000.` : yield seg;
                    }
                    source = rest;
                }
            }
            exports.segment = segment;
        },
        {
            '../combinator': 39,
            './block/codeblock': 76,
            './block/extension': 78,
            './block/heading': 85,
            './block/mathblock': 88,
            './source': 135
        }
    ],
    135: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.anyline = exports.emptyline = exports.contentline = exports.str = exports.unescsource = exports.escsource = exports.linebreak = exports.text = void 0;
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
            './source/escapable': 136,
            './source/line': 137,
            './source/linebreak': 138,
            './source/str': 139,
            './source/text': 140,
            './source/unescapable': 141
        }
    ],
    136: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.escsource = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const separator = /[\s\x00-\x2F\x3A-\x40\x5B-\x60\x7B-\x7F]/;
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
        { '../../combinator': 39 }
    ],
    137: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.contentline = exports.emptyline = exports.anyline = void 0;
            const global_1 = _dereq_('spica/global');
            const combinator_1 = _dereq_('../../combinator');
            exports.anyline = combinator_1.line(() => [
                [],
                ''
            ], false);
            exports.emptyline = combinator_1.line(s => combinator_1.isEmpty(s) ? [
                [],
                ''
            ] : global_1.undefined, false);
            exports.contentline = combinator_1.line(s => !combinator_1.isEmpty(s) ? [
                [],
                ''
            ] : global_1.undefined, false);
        },
        {
            '../../combinator': 39,
            'spica/global': 14
        }
    ],
    138: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.linebreak = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const text_1 = _dereq_('./text');
            exports.linebreak = combinator_1.fmap(combinator_1.focus('\n', combinator_1.union([text_1.text])), ns => ns);
        },
        {
            '../../combinator': 39,
            './text': 140
        }
    ],
    139: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.str = void 0;
            const global_1 = _dereq_('spica/global');
            const combinator_1 = _dereq_('../../combinator');
            function str(pattern, not) {
                return typeof pattern === 'string' ? combinator_1.creator(source => {
                    if (source === '')
                        return;
                    return source.slice(0, pattern.length) === pattern && !(not && source.slice(pattern.length, pattern.length + not.length) === not) ? [
                        [pattern],
                        source.slice(pattern.length)
                    ] : global_1.undefined;
                }) : combinator_1.creator(source => {
                    if (source === '')
                        return;
                    const m = source.match(pattern);
                    return m && m[0].length > 0 && !(not && source.slice(m[0].length, m[0].length + not.length) === not) ? [
                        [m[0]],
                        source.slice(m[0].length)
                    ] : global_1.undefined;
                });
            }
            exports.str = str;
            ;
        },
        {
            '../../combinator': 39,
            'spica/global': 14
        }
    ],
    140: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.isAlphanumeric = exports.text = exports.nonWhitespace = exports.nonAlphanumeric = exports.separator = void 0;
            const global_1 = _dereq_('spica/global');
            const combinator_1 = _dereq_('../../combinator');
            const str_1 = _dereq_('./str');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.separator = /[\s\x00-\x7F]|[^\x00-\x7F\s]#/;
            exports.nonAlphanumeric = /[^0-9A-Za-z]|$/;
            exports.nonWhitespace = /[\S\n]|$/;
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
                        case global_1.undefined:
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
                        const b = source[0].trimStart() === '';
                        const i = b || isAlphanumeric(source[0]) ? source.search(b ? exports.nonWhitespace : exports.nonAlphanumeric) : 1;
                        return b && i === source.length || b && source[i] === '\n' || b && source[i] === '\\' && source[i + 1] === '\n' ? [
                            [],
                            source.slice(i)
                        ] : [
                            [source.slice(0, i)],
                            source.slice(i)
                        ];
                    }
                default:
                    return [
                        [source.slice(0, i)],
                        source.slice(i)
                    ];
                }
            });
            function isAlphanumeric(char) {
                return '0' <= char && char <= '9' || 'a' <= char && char <= 'z' || 'A' <= char && char <= 'Z';
            }
            exports.isAlphanumeric = isAlphanumeric;
        },
        {
            '../../combinator': 39,
            './str': 139,
            'spica/global': 14,
            'typed-dom': 32
        }
    ],
    141: [
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
                case 0: {
                        const b = source[0] !== '\n' && source[0].trimStart() === '';
                        const i = b || text_1.isAlphanumeric(source[0]) ? source.search(b ? text_1.nonWhitespace : text_1.nonAlphanumeric) : 1;
                        return [
                            [source.slice(0, i)],
                            source.slice(i)
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
            '../../combinator': 39,
            './text': 140
        }
    ],
    142: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.error = exports.stringify = exports.defrag = exports.dup = exports.trimEnd = exports.startTight = exports.isEndTight = void 0;
            const global_1 = _dereq_('spica/global');
            const alias_1 = _dereq_('spica/alias');
            const combinator_1 = _dereq_('../combinator');
            const comment_1 = _dereq_('./inline/comment');
            const htmlentity_1 = _dereq_('./inline/htmlentity');
            const uuid_1 = _dereq_('spica/uuid');
            const array_1 = _dereq_('spica/array');
            const typed_dom_1 = _dereq_('typed-dom');
            function isEndTight(nodes) {
                if (nodes.length === 0)
                    return true;
                const end = nodes.length - 1;
                return typeof nodes[end] === 'string' && nodes[end].length > 1 ? isVisible(nodes[end], 'end', 0) || isVisible(nodes[end], 'end', 1) : isVisible(nodes[end], 'end') || end === 0 || isVisible(nodes[end - 1], 'end');
            }
            exports.isEndTight = isEndTight;
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
                        return char.trimStart() !== '';
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
                        case source.length > 2 && source[1] !== ' ' && ((_a = combinator_1.eval(htmlentity_1.htmlentity(source, context))) === null || _a === void 0 ? void 0 : _a[0].trimStart()) == '':
                            return;
                        }
                        break;
                    case '<':
                        switch (true) {
                        case source.length >= 7 && source[1] === '#' && !!comment_1.comment(source, context):
                        case source.length >= 5 && source[1] === 'w' && source.slice(0, 5) === '<wbr>':
                        case source.length >= 4 && source[1] === 'b' && source.slice(0, 4) === '<br>':
                            return;
                        }
                        break;
                    }
                    return ((_b = source[0] === '\\' ? source[1] : source[0]) === null || _b === void 0 ? void 0 : _b.trimStart()) ? parser(source, context) : global_1.undefined;
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
                        acc.push(node);
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
                    return nodes.innerText;
                let acc = '';
                for (let i = 0; i < nodes.length; ++i) {
                    const node = nodes[i];
                    acc += typeof node === 'string' ? node : node.tagName === 'BR' ? '\n' : node.innerText;
                }
                return acc;
            }
            exports.stringify = stringify;
            function error(parser) {
                return (source, context) => source[0] === '\0' ? combinator_1.fmap(parser, ([el]) => [typed_dom_1.define(el, {
                        id: `error:${ uuid_1.uuid() }`,
                        class: 'error'
                    })])(source.slice(1), context) : parser(source, context);
            }
            exports.error = error;
        },
        {
            '../combinator': 39,
            './inline/comment': 109,
            './inline/htmlentity': 121,
            'spica/alias': 5,
            'spica/array': 6,
            'spica/global': 14,
            'spica/uuid': 31,
            'typed-dom': 32
        }
    ],
    143: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.render = void 0;
            var render_1 = _dereq_('./renderer/render');
            Object.defineProperty(exports, 'render', {
                enumerable: true,
                get: function () {
                    return render_1.render;
                }
            });
        },
        { './renderer/render': 144 }
    ],
    144: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.render = void 0;
            const global_1 = _dereq_('spica/global');
            const code_1 = _dereq_('./render/code');
            const math_1 = _dereq_('./render/math');
            const media_1 = _dereq_('./render/media');
            const selector = 'img.media:not(.invalid):not([src])[data-src], a > :not(img).media:not(.invalid), pre.code:not(.invalid), .math:not(.invalid)';
            function render(target, opts = {}) {
                opts = {
                    code: code_1.code,
                    math: math_1.math,
                    media: {},
                    ...opts
                };
                if (target.classList.contains('invalid'))
                    return;
                const base = global_1.location.href;
                if (target.matches(selector))
                    return void render_(base, target, opts);
                for (let es = target.querySelectorAll(selector), i = 0, len = es.length; i < len; ++i) {
                    render_(base, es[i], opts);
                }
            }
            exports.render = render;
            function render_(base, target, opts) {
                var _a, _b, _c;
                try {
                    switch (true) {
                    case !!opts.code && !target.firstElementChild && target.matches('pre.code'):
                        return void opts.code(target, (_a = opts.caches) === null || _a === void 0 ? void 0 : _a.code);
                    case !!opts.math && !target.firstElementChild && target.matches('.math'):
                        return void opts.math(target, (_b = opts.caches) === null || _b === void 0 ? void 0 : _b.math);
                    case target.matches('.media:not(img)'):
                        return void target.parentElement.parentElement.replaceChild(target, target.parentElement);
                    case !!opts.media && target.matches('img.media:not([src])[data-src]'): {
                            const el = media_1.media(base, target, opts.media, (_c = opts.caches) === null || _c === void 0 ? void 0 : _c.media);
                            if (!el)
                                return;
                            el.setAttribute('data-src', target.getAttribute('data-src'));
                            const scope = el.matches('img') ? target : target.parentElement;
                            return void scope.parentElement.replaceChild(el, scope);
                        }
                    default:
                        return;
                    }
                } catch (reason) {
                    console.error(reason);
                }
            }
        },
        {
            './render/code': 145,
            './render/math': 146,
            './render/media': 147,
            'spica/global': 14
        }
    ],
    145: [
        function (_dereq_, module, exports) {
            (function (global) {
                (function () {
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
                                if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k))
                                    __createBinding(result, mod, k);
                        __setModuleDefault(result, mod);
                        return result;
                    };
                    Object.defineProperty(exports, '__esModule', { value: true });
                    exports.code = void 0;
                    const Prism = __importStar(typeof window !== 'undefined' ? window['Prism'] : typeof global !== 'undefined' ? global['Prism'] : null);
                    function code(target, cache) {
                        const source = target.textContent;
                        Prism.highlightElement(target, false, () => void (cache === null || cache === void 0 ? void 0 : cache.set(`${ target.getAttribute('data-lang') || '' }\n${ source }`, target.cloneNode(true))));
                    }
                    exports.code = code;
                }.call(this));
            }.call(this, typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {}));
        },
        {}
    ],
    146: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.math = void 0;
            const global_1 = _dereq_('spica/global');
            const typed_dom_1 = _dereq_('typed-dom');
            function math(target, cache) {
                const source = target.textContent;
                queue(target, () => {
                    var _a;
                    !((_a = target.textContent) === null || _a === void 0 ? void 0 : _a.trim()) && typed_dom_1.define(target, [typed_dom_1.html('span', source)]);
                    return void (cache === null || cache === void 0 ? void 0 : cache.set(source, target.cloneNode(true)));
                });
            }
            exports.math = math;
            async function queue(target, callback = () => global_1.undefined) {
                MathJax.typesetPromise || await MathJax.startup.promise;
                MathJax.typesetPromise([target]).then(callback);
            }
        },
        {
            'spica/global': 14,
            'typed-dom': 32
        }
    ],
    147: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.media = void 0;
            const twitter_1 = _dereq_('./media/twitter');
            const youtube_1 = _dereq_('./media/youtube');
            const pdf_1 = _dereq_('./media/pdf');
            const video_1 = _dereq_('./media/video');
            const audio_1 = _dereq_('./media/audio');
            const image_1 = _dereq_('./media/image');
            const url_1 = _dereq_('spica/url');
            function media(base, target, opts, cache) {
                var _a, _b, _c, _d, _e, _f;
                opts = {
                    twitter: twitter_1.twitter,
                    youtube: youtube_1.youtube,
                    pdf: pdf_1.pdf,
                    video: video_1.video,
                    audio: audio_1.audio,
                    image: image_1.image,
                    ...opts
                };
                const url = new url_1.ReadonlyURL(target.getAttribute('data-src'), base);
                const alt = target.getAttribute('alt') || '';
                return ((_a = opts.twitter) === null || _a === void 0 ? void 0 : _a.call(opts, url)) || ((_b = opts.youtube) === null || _b === void 0 ? void 0 : _b.call(opts, url, cache)) || ((_c = opts.pdf) === null || _c === void 0 ? void 0 : _c.call(opts, url, cache)) || ((_d = opts.video) === null || _d === void 0 ? void 0 : _d.call(opts, url, alt, cache)) || ((_e = opts.audio) === null || _e === void 0 ? void 0 : _e.call(opts, url, alt, cache)) || ((_f = opts.image) === null || _f === void 0 ? void 0 : _f.call(opts, url, alt, cache));
            }
            exports.media = media;
        },
        {
            './media/audio': 148,
            './media/image': 149,
            './media/pdf': 150,
            './media/twitter': 151,
            './media/video': 152,
            './media/youtube': 153,
            'spica/url': 29
        }
    ],
    148: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.audio = void 0;
            const typed_dom_1 = _dereq_('typed-dom');
            const extensions = [
                '.oga',
                '.ogg'
            ];
            function audio(url, alt, cache) {
                if (!extensions.includes(url.pathname.split(/(?=\.)/).pop()))
                    return;
                if (cache === null || cache === void 0 ? void 0 : cache.has(url.href))
                    return cache.get(url.href).cloneNode(true);
                const el = typed_dom_1.html('audio', {
                    class: 'media',
                    src: url.href,
                    alt,
                    controls: '',
                    style: 'width: 100%;'
                });
                cache === null || cache === void 0 ? void 0 : cache.set(url.href, el.cloneNode(true));
                return el;
            }
            exports.audio = audio;
        },
        { 'typed-dom': 32 }
    ],
    149: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.image = void 0;
            const typed_dom_1 = _dereq_('typed-dom');
            function image(url, alt, cache) {
                if (cache === null || cache === void 0 ? void 0 : cache.has(url.href))
                    return cache.get(url.href).cloneNode(true);
                const el = typed_dom_1.html('img', {
                    class: 'media',
                    src: url.href,
                    alt,
                    style: 'max-width: 100%;'
                });
                cache === null || cache === void 0 ? void 0 : cache.set(url.href, el.cloneNode(true));
                return el;
            }
            exports.image = image;
        },
        { 'typed-dom': 32 }
    ],
    150: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.pdf = void 0;
            const parser_1 = _dereq_('../../../parser');
            const typed_dom_1 = _dereq_('typed-dom');
            const extensions = ['.pdf'];
            function pdf(url, cache) {
                if (!extensions.includes(url.pathname.split(/(?=\.)/).pop()))
                    return;
                if (cache === null || cache === void 0 ? void 0 : cache.has(url.href))
                    return cache.get(url.href).cloneNode(true);
                const el = typed_dom_1.html('div', {
                    class: 'media',
                    style: 'position: relative;'
                }, [
                    typed_dom_1.html('div', { style: 'position: relative; resize: vertical; overflow: hidden; padding-bottom: 10px;' }, [typed_dom_1.html('object', {
                            type: 'application/pdf',
                            data: url.href,
                            style: 'width: 100%; height: 100%; min-height: 400px;'
                        })]),
                    typed_dom_1.html('div', { style: 'word-wrap: break-word;' }, parser_1.parse(`**{ ${ url.href } }**`).firstElementChild.childNodes)
                ]);
                cache === null || cache === void 0 ? void 0 : cache.set(url.href, el.cloneNode(true));
                return el;
            }
            exports.pdf = pdf;
        },
        {
            '../../../parser': 64,
            'typed-dom': 32
        }
    ],
    151: [
        function (_dereq_, module, exports) {
            (function (global) {
                (function () {
                    'use strict';
                    Object.defineProperty(exports, '__esModule', { value: true });
                    exports.twitter = void 0;
                    const global_1 = _dereq_('spica/global');
                    const parser_1 = _dereq_('../../../parser');
                    const dompurify_1 = typeof window !== 'undefined' ? window['DOMPurify'] : typeof global !== 'undefined' ? global['DOMPurify'] : null;
                    const typed_dom_1 = _dereq_('typed-dom');
                    const origins = ['https://twitter.com'];
                    function twitter(url) {
                        if (!origins.includes(url.origin))
                            return;
                        if (url.pathname.split('/').pop().includes('.'))
                            return;
                        if (!url.pathname.match(/^\/\w+\/status\/[0-9]{15,}(?!\w)/))
                            return;
                        return typed_dom_1.HTML.div({
                            class: 'media',
                            style: 'position: relative;'
                        }, [typed_dom_1.HTML.em(`loading ${ url.href }`)], (h, tag) => {
                            const outer = h(tag);
                            $.ajax(`https://publish.twitter.com/oembed?url=${ url.href.replace('?', '&') }&omit_script=true`, {
                                dataType: 'jsonp',
                                timeout: 10 * 1000,
                                cache: true,
                                success({html}) {
                                    outer.innerHTML = dompurify_1.sanitize(`<div style="margin-top: -10px; margin-bottom: -10px;">${ html }</div>`);
                                    if (global_1.window.twttr)
                                        return void global_1.window.twttr.widgets.load(outer);
                                    const id = 'twitter-wjs';
                                    if (global_1.document.getElementById(id))
                                        return;
                                    global_1.document.body.appendChild(h('script', {
                                        id,
                                        src: 'https://platform.twitter.com/widgets.js'
                                    }));
                                },
                                error({status, statusText}) {
                                    typed_dom_1.define(outer, [parser_1.parse(`*{ ${ url.href } }*\n\n\`\`\`\n${ status }\n${ statusText }\n\`\`\``)]);
                                }
                            });
                            return outer;
                        }).element;
                    }
                    exports.twitter = twitter;
                }.call(this));
            }.call(this, typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {}));
        },
        {
            '../../../parser': 64,
            'spica/global': 14,
            'typed-dom': 32
        }
    ],
    152: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.video = void 0;
            const typed_dom_1 = _dereq_('typed-dom');
            const extensions = [
                '.webm',
                '.ogv'
            ];
            function video(url, alt, cache) {
                if (!extensions.includes(url.pathname.split(/(?=\.)/).pop()))
                    return;
                if (cache === null || cache === void 0 ? void 0 : cache.has(url.href))
                    return cache.get(url.href).cloneNode(true);
                const el = typed_dom_1.html('video', {
                    class: 'media',
                    src: url.href,
                    alt,
                    muted: '',
                    controls: '',
                    style: 'max-width: 100%;'
                });
                cache === null || cache === void 0 ? void 0 : cache.set(url.href, el.cloneNode(true));
                return el;
            }
            exports.video = video;
        },
        { 'typed-dom': 32 }
    ],
    153: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.youtube = void 0;
            const typed_dom_1 = _dereq_('typed-dom');
            function youtube(url, cache) {
                let id;
                switch (url.origin) {
                case 'https://www.youtube.com':
                    if (!url.pathname.match(/^\/watch$/))
                        return;
                    id = url.href.replace(/.+?=/, '').replace('&', '?');
                    break;
                case 'https://youtu.be':
                    if (!url.pathname.match(/^\/[\w-]+$/))
                        return;
                    id = url.href.slice(url.href.indexOf('/', 9) + 1);
                    break;
                default:
                    return;
                }
                if (url.pathname.split('/').pop().includes('.'))
                    return;
                if (cache === null || cache === void 0 ? void 0 : cache.has(url.href))
                    return cache.get(url.href).cloneNode(true);
                const el = typed_dom_1.html('div', {
                    class: 'media',
                    style: 'position: relative;'
                }, [typed_dom_1.html('div', { style: 'position: relative; padding-top: 56.25%;' }, [typed_dom_1.html('iframe', {
                            src: `https://www.youtube.com/embed/${ id }`,
                            allowfullscreen: '',
                            frameborder: '0',
                            style: 'position: absolute; top: 0; right: 0; width: 100%; height: 100%;'
                        })])]);
                cache === null || cache === void 0 ? void 0 : cache.set(url.href, el.cloneNode(true));
                return el;
            }
            exports.youtube = youtube;
        },
        { 'typed-dom': 32 }
    ],
    154: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.context = exports.info = exports.toc = exports.quote = void 0;
            var quote_1 = _dereq_('./util/quote');
            Object.defineProperty(exports, 'quote', {
                enumerable: true,
                get: function () {
                    return quote_1.quote;
                }
            });
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
            './util/context': 155,
            './util/info': 158,
            './util/quote': 159,
            './util/toc': 160
        }
    ],
    155: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.context = void 0;
            const global_1 = _dereq_('spica/global');
            function context(base, bound = `${ 'id' in base && base.id ? `#${ base.id }, ` : '' }section, article, aside, blockquote`) {
                const memory = new global_1.WeakMap();
                const context = 'id' in base && base.closest(bound) || null;
                return el => {
                    var _a;
                    const {parentNode} = el;
                    const node = memory.has(parentNode) ? parentNode : parentNode.parentNode;
                    let result = memory.get(node);
                    if (result === global_1.undefined) {
                        result = el.closest(bound) === context;
                        memory.set(node, result);
                    }
                    return result;
                };
            }
            exports.context = context;
        },
        { 'spica/global': 14 }
    ],
    156: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.figure = void 0;
            const global_1 = _dereq_('spica/global');
            const label_1 = _dereq_('../parser/inline/extension/label');
            const multimap_1 = _dereq_('spica/multimap');
            const typed_dom_1 = _dereq_('typed-dom');
            const array_1 = _dereq_('spica/array');
            function* figure(target, footnotes, opts = {}) {
                var _a;
                const refs = new multimap_1.MultiMap([
                    ...target.querySelectorAll('a.label:not(.disabled)[data-label]'),
                    ...(footnotes === null || footnotes === void 0 ? void 0 : footnotes.annotation.querySelectorAll('a.label:not(.disabled)')) || [],
                    ...(footnotes === null || footnotes === void 0 ? void 0 : footnotes.reference.querySelectorAll('a.label:not(.disabled)')) || []
                ].map(el => [
                    el.getAttribute('data-label'),
                    el
                ]));
                const numbers = new global_1.Map();
                let base = '0';
                let bases = base.split('.');
                let index = bases;
                for (let defs = target.querySelectorAll('figure[data-label], h1, h2, h3'), i = 0, len = defs.length; i < len; ++i) {
                    yield;
                    const def = defs[i];
                    if (def.parentNode !== target)
                        continue;
                    if (bases.length === 1 && def.tagName[0] === 'H')
                        continue;
                    const label = def.tagName === 'FIGURE' ? def.getAttribute('data-label') : `$-${ increment(index, def) }`;
                    if (label.endsWith('-'))
                        continue;
                    if (label.endsWith('-0'))
                        continue;
                    if (def.tagName === 'FIGURE' && label.endsWith('.0')) {
                        if (label.lastIndexOf('.', label.length - 3) < 0 && !(+((_a = def.previousElementSibling) === null || _a === void 0 ? void 0 : _a.tagName[1]) <= 2))
                            continue;
                        if (label.lastIndexOf('.', label.length - 3) > 0)
                            continue;
                    }
                    const group = label.split('-', 1)[0];
                    let number = label_1.number(label, numbers.has(group) && !label_1.isFixed(label) ? array_1.join(numbers.get(group).split('.').slice(0, bases.length), '.') : base);
                    if (number.endsWith('.0')) {
                        if (number.split('.').length > 2)
                            continue;
                        if (group !== '$' || def.tagName === 'FIGURE' && def.firstChild)
                            continue;
                        if (number.startsWith('0.')) {
                            number = array_1.join(index.slice(0).reduce((ns, _, i, bs) => {
                                i === ns.length ? bs.length = i : ns[i] = +ns[i] > +bs[i] ? ns[i] : +ns[i] === 0 ? bs[i] : `${ +bs[i] + 1 }`;
                                return ns;
                            }, number.split('.')), '.');
                        }
                        base = number;
                        bases = index = base.split('.');
                        numbers.clear();
                        continue;
                    }
                    !label_1.isFixed(label) && numbers.set(group, number);
                    opts.id !== '' && def.setAttribute('id', `label:${ opts.id ? `${ opts.id }:` : '' }${ label }`);
                    const figindex = group === '$' ? `(${ number })` : `${ capitalize(group) } ${ number }`;
                    typed_dom_1.define(def.querySelector(':scope > .figindex'), group === '$' ? figindex : `${ figindex }. `);
                    for (const ref of refs.take(label, global_1.Infinity)) {
                        if (ref.hash.slice(1) === def.id && ref.textContent === figindex)
                            continue;
                        yield typed_dom_1.define(ref, opts.id !== '' ? { href: `#${ def.id }` } : { class: `${ ref.className } disabled` }, figindex);
                    }
                }
                for (const [, ref] of refs) {
                    if (opts.id !== '') {
                        typed_dom_1.define(ref, {
                            class: `${ ref.className } disabled invalid`,
                            'data-invalid-syntax': 'label',
                            'data-invalid-type': 'reference',
                            'data-invalid-message': `Missing the reference.`
                        });
                    }
                    yield ref;
                }
                return;
            }
            exports.figure = figure;
            function increment(bases, el) {
                const index = (+el.tagName[1] - 1 || 1) - 1;
                return index < bases.length - 1 ? array_1.join(bases.slice(0, index + 2).map((v, i) => {
                    switch (true) {
                    case i < index:
                        return v;
                    case i === index:
                        return +v + 1;
                    default:
                        return 0;
                    }
                }), '.') : '';
            }
            function capitalize(label) {
                return label[0].toUpperCase() + label.slice(1);
            }
        },
        {
            '../parser/inline/extension/label': 118,
            'spica/array': 6,
            'spica/global': 14,
            'spica/multimap': 25,
            'typed-dom': 32
        }
    ],
    157: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.reference = exports.annotation = exports.footnote = void 0;
            const global_1 = _dereq_('spica/global');
            const indexee_1 = _dereq_('../parser/inline/extension/indexee');
            const multimap_1 = _dereq_('spica/multimap');
            const memoize_1 = _dereq_('spica/memoize');
            const typed_dom_1 = _dereq_('typed-dom');
            function* footnote(target, footnotes, opts = {}) {
                yield* exports.annotation(target, footnotes === null || footnotes === void 0 ? void 0 : footnotes.annotation, opts);
                yield* exports.reference(target, footnotes === null || footnotes === void 0 ? void 0 : footnotes.reference, opts);
                return;
            }
            exports.footnote = footnote;
            exports.annotation = build('annotation', n => `*${ n }`);
            exports.reference = build('reference', n => `[${ n }]`);
            const identify = memoize_1.memoize(ref => ref.getAttribute('data-alias') || ref.innerHTML, new global_1.WeakMap());
            function build(syntax, marker) {
                const contentify = memoize_1.memoize(ref => typed_dom_1.frag(ref.childNodes), new global_1.WeakMap());
                return function* (target, footnote, opts = {}) {
                    var _a;
                    const defs = new global_1.Map();
                    const refs = new multimap_1.MultiMap();
                    const titles = new global_1.Map();
                    let count = 0;
                    for (let es = target.querySelectorAll(`sup.${ syntax }:not(.disabled)`), i = 0, len = es.length; i < len; ++i) {
                        yield;
                        const ref = es[i];
                        ++count;
                        const identifier = identify(ref);
                        const title = ref.classList.contains('invalid') ? global_1.undefined : titles.get(identifier) || ref.title || indexee_1.text(ref) || global_1.undefined;
                        title && !titles.has(title) && titles.set(identifier, title);
                        !title && refs.set(identifier, ref);
                        const content = contentify(ref);
                        const refIndex = count;
                        const refId = opts.id !== '' ? ref.id || `${ syntax }:${ opts.id ? `${ opts.id }:` : '' }ref:${ count }` : global_1.undefined;
                        const def = global_1.undefined || defs.get(identifier) || defs.set(identifier, typed_dom_1.html('li', { id: opts.id !== '' ? `${ syntax }:${ opts.id ? `${ opts.id }:` : '' }def:${ defs.size + 1 }` : global_1.undefined }, [
                            content.cloneNode(true),
                            typed_dom_1.html('sup', [])
                        ])).get(identifier);
                        if (title && content.firstChild && def.childNodes.length === 1) {
                            def.insertBefore(content.cloneNode(true), def.lastChild);
                            for (const ref of refs.take(identifier, global_1.Infinity)) {
                                ref.classList.remove('invalid');
                                typed_dom_1.define(ref, {
                                    title,
                                    'data-invalid-syntax': null,
                                    'data-invalid-type': null,
                                    'data-invalid-message': null
                                });
                            }
                        }
                        const defIndex = +def.id.slice(def.id.lastIndexOf(':') + 1) || defs.size;
                        const defId = def.id || global_1.undefined;
                        const refChild = ref.firstChild;
                        yield typed_dom_1.define(ref, {
                            id: refId,
                            class: opts.id !== '' ? global_1.undefined : `${ ref.className } disabled`,
                            ...title ? { title } : {
                                class: void ref.classList.add('invalid'),
                                'data-invalid-syntax': syntax,
                                'data-invalid-type': 'content',
                                'data-invalid-message': 'Missing the content.'
                            }
                        }, ((_a = refChild === null || refChild === void 0 ? void 0 : refChild.getAttribute('href')) === null || _a === void 0 ? void 0 : _a.slice(1)) === defId && (refChild === null || refChild === void 0 ? void 0 : refChild.textContent) === marker(defIndex) ? global_1.undefined : [typed_dom_1.html('a', {
                                href: refId && defId && `#${ defId }`,
                                rel: 'noopener'
                            }, marker(defIndex))]).firstChild;
                        def.lastChild.appendChild(typed_dom_1.html('a', {
                            href: refId && `#${ refId }`,
                            rel: 'noopener',
                            title: content.firstChild && ref.hasAttribute('data-alias') ? title : global_1.undefined
                        }, `~${ refIndex }`));
                    }
                    if (!footnote)
                        return;
                    const {children} = footnote;
                    count = 0;
                    let length = children.length;
                    I:
                        for (const def of defs.values()) {
                            ++count;
                            while (length > defs.size) {
                                const node = children[count - 1];
                                if (equal(node, def))
                                    continue I;
                                yield footnote.removeChild(node);
                                --length;
                            }
                            const node = count <= length ? children[count - 1] : null;
                            if (node && equal(node, def))
                                continue;
                            yield footnote.insertBefore(def, node);
                            ++length;
                        }
                    while (length > defs.size) {
                        yield footnote.removeChild(children[defs.size]);
                        --length;
                    }
                    return;
                };
            }
            function equal(a, b) {
                return a.id === b.id && a.innerHTML === b.innerHTML;
            }
        },
        {
            '../parser/inline/extension/indexee': 116,
            'spica/global': 14,
            'spica/memoize': 15,
            'spica/multimap': 25,
            'typed-dom': 32
        }
    ],
    158: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.info = void 0;
            const context_1 = _dereq_('./context');
            function info(source) {
                const match = context_1.context(source, 'section, article, aside, blockquote, .media, pre.notranslate, .math');
                return {
                    hashtag: find('a.hashtag[href]'),
                    hashref: find('a.hashref[href]'),
                    channel: find('a.channel[href]'),
                    account: find('a.account[href]'),
                    mention: find('a.address[href]'),
                    url: find('a[href]:not(.hashtag):not(.hashref):not(.channel):not(.account):not(.address)').filter(el => [
                        'http:',
                        'https:'
                    ].includes(el.protocol)),
                    tel: find('a[href]:not(.hashtag):not(.hashref):not(.channel):not(.account):not(.address)').filter(el => el.protocol === 'tel:'),
                    email: find('a.email[href]'),
                    media: find('.media[data-src]')
                };
                function find(selector) {
                    const acc = [];
                    for (let es = source.querySelectorAll(selector), i = 0, len = es.length; i < len; ++i) {
                        const el = es[i];
                        if (!match(el))
                            continue;
                        acc.push(el);
                    }
                    return acc;
                }
            }
            exports.info = info;
        },
        { './context': 155 }
    ],
    159: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.quote = void 0;
            const global_1 = _dereq_('spica/global');
            const url_1 = _dereq_('spica/url');
            const typed_dom_1 = _dereq_('typed-dom');
            function quote(address, range) {
                var _a;
                let expansion = expand(range);
                const node = range.cloneContents();
                const base = global_1.location.href;
                for (let es = node.querySelectorAll('code[data-src], .math[data-src], .media[data-src], rt, rp'), i = 0, len = es.length; i < len; ++i) {
                    const el = es[i];
                    switch (true) {
                    case el.matches('code'):
                    case el.matches('.math'):
                        typed_dom_1.define(el, el.getAttribute('data-src'));
                        continue;
                    case el.matches('.media'):
                        el.replaceWith(`!{ ${ new url_1.ReadonlyURL(el.getAttribute('data-src'), base).href } }`);
                        continue;
                    case el.matches('rt, rp'):
                        el.remove();
                        continue;
                    }
                }
                expansion = expansion || !!((_a = trim(node).firstElementChild) === null || _a === void 0 ? void 0 : _a.matches('.quotation'));
                if (!node.firstChild)
                    return '';
                let add;
                if (expansion) {
                    node.prepend('>');
                    add = true;
                } else {
                    node.prepend(`>>${ address }\n> `);
                    add = false;
                }
                for (let es = node.querySelectorAll('br'), i = 0, len = es.length; i < len; ++i) {
                    const el = es[i];
                    const target = el.nextSibling;
                    if (target && 'id' in target && target.matches('.quotation')) {
                        el.replaceWith('\n>');
                        add = add || i < len - 1;
                    } else {
                        el.replaceWith(add ? `\n>>${ address }\n> ` : '\n> ');
                        add = false;
                    }
                }
                add && node.append(`\n>>${ address }`);
                return node.textContent;
            }
            exports.quote = quote;
            function expand(range) {
                var _a, _b;
                const node = range.startContainer;
                if ((_a = node.parentElement) === null || _a === void 0 ? void 0 : _a.matches('.quotation > .address:first-child')) {
                    range.setStart(node.parentElement.previousSibling, 0);
                    return true;
                }
                const offset = range.startOffset;
                if (((_b = node.parentElement) === null || _b === void 0 ? void 0 : _b.matches('.quotation')) && node.textContent.slice(0, offset) === '>'.repeat(offset)) {
                    range.setStart(node, 0);
                    return true;
                }
                return false;
            }
            function trim(node) {
                for (let child; child = node.firstChild;) {
                    if (child.textContent)
                        break;
                    child.remove();
                }
                return node;
            }
        },
        {
            'spica/global': 14,
            'spica/url': 29,
            'typed-dom': 32
        }
    ],
    160: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.toc = void 0;
            const global_1 = _dereq_('spica/global');
            const typed_dom_1 = _dereq_('typed-dom');
            const array_1 = _dereq_('spica/array');
            function toc(source) {
                const hs = [];
                for (let es = source.querySelectorAll('h1 h2 h3 h4 h5 h6 aside.aside'.split(' ').map(s => `${ s }[id]`).join()), i = 0, len = es.length; i < len; ++i) {
                    const el = es[i];
                    switch (el.tagName) {
                    case 'ASIDE':
                        hs.push(typed_dom_1.html(el.firstElementChild.tagName.toLowerCase(), {
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
                return typed_dom_1.html('ul', node.map(([el, cs]) => {
                    const isHeading = !el.classList.contains('aside');
                    const idx = isHeading ? index === '' ? `${ ++i }` : `${ index }.${ ++i }` : index === '' ? `${ i }` : `${ index }.${ i }`;
                    return typed_dom_1.html('li', array_1.push([typed_dom_1.html('a', {
                            href: `#${ el.id }`,
                            rel: 'noopener',
                            'data-index': isHeading ? idx : global_1.undefined
                        }, fix(el))], cs.length > 0 ? [parse(cs, idx)] : []));
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
            function fix(h) {
                h = h.cloneNode(true);
                for (let es = h.getElementsByTagName('a'), i = 0, len = es.length; i < len; ++i) {
                    const el = es[i];
                    el.replaceWith(...el.childNodes);
                }
                return h.childNodes;
            }
        },
        {
            'spica/array': 6,
            'spica/global': 14,
            'typed-dom': 32
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
                    if (p !== 'default' && !Object.prototype.hasOwnProperty.call(exports, p))
                        __createBinding(exports, m, p);
            };
            Object.defineProperty(exports, '__esModule', { value: true });
            _dereq_('spica/global');
            __exportStar(_dereq_('./src/parser'), exports);
            __exportStar(_dereq_('./src/util'), exports);
            __exportStar(_dereq_('./src/renderer'), exports);
        },
        {
            './src/parser': 64,
            './src/renderer': 143,
            './src/util': 154,
            'spica/global': 14
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