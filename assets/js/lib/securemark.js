/*! securemark v0.148.1 https://github.com/falsandtru/securemark | (c) 2017, falsandtru | UNLICENSED */
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
            exports.join = exports.push = exports.pop = exports.unshift = exports.shift = exports.indexOf = void 0;
            const alias_1 = _dereq_('./alias');
            function indexOf(as, a) {
                const isNaN = a !== a;
                for (let i = 0; i < as.length; ++i) {
                    const ai = as[i];
                    if (isNaN ? ai !== ai : ai === a)
                        return i;
                }
                return -1;
            }
            exports.indexOf = indexOf;
            function shift(as, count) {
                if (count < 0)
                    throw new Error('Unexpected negative number');
                return count === void 0 ? [
                    as.shift(),
                    as
                ] : [
                    as.splice(0, count),
                    as
                ];
            }
            exports.shift = shift;
            function unshift(as, bs) {
                if (alias_1.isArray(as)) {
                    for (let i = as.length; i--;) {
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
                return count === void 0 ? [
                    as,
                    as.pop()
                ] : [
                    as,
                    as.splice(as.length - count, count)
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
            function join(as, sep = '') {
                let acc = '';
                for (let i = 0; i < as.length; ++i) {
                    acc += i === 0 ? as[i] : sep + as[i];
                }
                return acc;
            }
            exports.join = join;
        },
        { './alias': 5 }
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
            './type': 18
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
                constructor(size, callback = () => void 0, opts = {}) {
                    this.size = size;
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
                    if (size > 0 === false)
                        throw new Error(`Spica: Cache: Cache size must be greater than 0.`);
                    void assign_1.extend(this.settings, opts);
                    const {stats, entries} = this.settings.data;
                    const LFU = stats[1].slice(0, size);
                    const LRU = stats[0].slice(0, size - LFU.length);
                    this.stats = {
                        LRU,
                        LFU
                    };
                    this.store = new global_1.Map(entries);
                    if (!opts.data)
                        return;
                    for (const k of array_1.push(stats[1].slice(LFU.length), stats[0].slice(LRU.length))) {
                        void this.store.delete(k);
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
                    if (!log && this.store.has(key))
                        return void this.store.set(key, value), true;
                    if (this.access(key))
                        return void this.store.set(key, value), true;
                    const {LRU, LFU} = this.stats;
                    if (LRU.length + LFU.length === this.size && LRU.length < LFU.length) {
                        const key = LFU.pop();
                        const val = this.store.get(key);
                        void this.store.delete(key);
                        void this.callback(key, val);
                    }
                    void LRU.unshift(key);
                    void this.store.set(key, value);
                    if (LRU.length + LFU.length > this.size) {
                        const key = LRU.pop();
                        const val = this.store.get(key);
                        void this.store.delete(key);
                        void this.callback(key, val);
                    }
                    return false;
                }
                set(key, value, log) {
                    void this.put(key, value, log);
                    return value;
                }
                get(key, log = true) {
                    if (!log)
                        return this.store.get(key);
                    void this.access(key);
                    return this.store.get(key);
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
                        void this.store.delete(stat.splice(index, 1)[0]);
                        if (this.settings.ignore.delete)
                            return true;
                        void this.callback(key, val);
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
                    for (const key of store.keys()) {
                        void this.callback(key, store.get(key));
                    }
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
                    if (!this.store.has(key))
                        return false;
                    return this.accessLFU(key) || this.accessLRU(key);
                }
                accessLRU(key) {
                    const {LRU} = this.stats;
                    const index = array_1.indexOf(LRU, key);
                    if (index === -1)
                        return false;
                    const {LFU} = this.stats;
                    void LFU.unshift(...LRU.splice(index, 1));
                    return true;
                }
                accessLFU(key) {
                    const {LFU} = this.stats;
                    const index = array_1.indexOf(LFU, key);
                    if (index === -1)
                        return false;
                    void LFU.unshift(...LFU.splice(index, 1));
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
            const global_1 = _dereq_('../global');
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
                take(key, size) {
                    const vs = this.store.get(key);
                    return (vs === null || vs === void 0 ? void 0 : vs.splice(0, size === global_1.Infinity ? vs.length : size)) || [];
                }
                ref(key) {
                    return this.store.get(key) || [];
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
            }
            exports.MultiMap = MultiMap;
        },
        { '../global': 12 }
    ],
    10: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.curry = void 0;
            exports.curry = f => apply(f, []);
            function apply(f, xs) {
                return xs.length >= f.length ? f(...xs) : (...ys) => apply(f, [
                    ...xs,
                    ...ys
                ]);
            }
        },
        {}
    ],
    11: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.flip = void 0;
            const curry_1 = _dereq_('./curry');
            function flip(f) {
                return curry_1.curry((b, a) => f.length > 1 ? f(a, b) : f(a)(b));
            }
            exports.flip = flip;
        },
        { './curry': 10 }
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
            function memoize(f, memory = new Map()) {
                return a => memory.has(a) ? memory.get(a) : void memory.set(a, f(a)) || memory.get(a);
            }
            exports.memoize = memoize;
        },
        {}
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
                    if (!exports.hasOwnProperty(p))
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
            exports.isPromiseLike = exports.AtomicPromise = void 0;
            const global_1 = _dereq_('./global');
            var State;
            (function (State) {
                State[State['pending'] = 0] = 'pending';
                State[State['resolved'] = 1] = 'resolved';
                State[State['fulfilled'] = 2] = 'fulfilled';
                State[State['rejected'] = 3] = 'rejected';
            }(State || (State = {})));
            class Internal {
                constructor() {
                    this.status = { state: 0 };
                    this.fulfillReactions = [];
                    this.rejectReactions = [];
                    this.isHandled = false;
                }
            }
            const internal = Symbol.for('spica/promise::internal');
            class AtomicPromise {
                constructor(executor) {
                    this[Symbol.toStringTag] = 'Promise';
                    this[_a] = new Internal();
                    const intl = internal;
                    try {
                        const internal = this[intl];
                        void executor(value => {
                            if (internal.status.state !== 0)
                                return;
                            if (isPromiseLike(value)) {
                                internal.status = {
                                    state: 1,
                                    result: value
                                };
                                void value.then(value => {
                                    internal.status = {
                                        state: 2,
                                        result: value
                                    };
                                    void resume(internal);
                                }, reason => {
                                    internal.status = {
                                        state: 3,
                                        result: reason
                                    };
                                    void resume(internal);
                                });
                            } else {
                                internal.status = {
                                    state: 2,
                                    result: value
                                };
                                void resume(internal);
                            }
                        }, reason => {
                            if (internal.status.state !== 0)
                                return;
                            internal.status = {
                                state: 3,
                                result: reason
                            };
                            void resume(internal);
                        });
                    } catch (reason) {
                        const internal = this[intl];
                        if (internal.status.state !== 0)
                            return;
                        internal.status = {
                            state: 3,
                            result: reason
                        };
                        void resume(internal);
                    }
                }
                static get [Symbol.species]() {
                    return AtomicPromise;
                }
                static all(vs) {
                    return new AtomicPromise((resolve, reject) => {
                        const values = [...vs];
                        const length = values.length;
                        const acc = global_1.Array(length);
                        let cnt = 0;
                        for (let i = 0; i < length; ++i) {
                            const value = values[i];
                            if (isPromiseLike(value)) {
                                void value.then(value => {
                                    acc[i] = value;
                                    void ++cnt;
                                    cnt === length && void resolve(acc);
                                }, reason => {
                                    i = length;
                                    void reject(reason);
                                });
                            } else {
                                acc[i] = value;
                                void ++cnt;
                            }
                        }
                        cnt === length && void resolve(acc);
                    });
                }
                static race(values) {
                    return new AtomicPromise((resolve, reject) => {
                        let done = false;
                        for (const value of values) {
                            if (done)
                                break;
                            if (isPromiseLike(value)) {
                                void value.then(value => {
                                    done = true;
                                    void resolve(value);
                                }, reason => {
                                    done = true;
                                    void reject(reason);
                                });
                            } else {
                                done = true;
                                void resolve(value);
                            }
                        }
                    });
                }
                static resolve(value) {
                    return new AtomicPromise(resolve => void resolve(value));
                }
                static reject(reason) {
                    return new AtomicPromise((_, reject) => void reject(reason));
                }
                then(onfulfilled, onrejected) {
                    return new AtomicPromise((resolve, reject) => {
                        const {fulfillReactions, rejectReactions, status} = this[internal];
                        if (status.state !== 3) {
                            void fulfillReactions.push(value => {
                                if (!onfulfilled)
                                    return void resolve(value);
                                try {
                                    void resolve(onfulfilled(value));
                                } catch (reason) {
                                    void reject(reason);
                                }
                            });
                        }
                        if (status.state !== 2) {
                            void rejectReactions.push(reason => {
                                if (!onrejected)
                                    return void reject(reason);
                                try {
                                    void resolve(onrejected(reason));
                                } catch (reason) {
                                    void reject(reason);
                                }
                            });
                        }
                        void resume(this[internal]);
                    });
                }
                catch(onrejected) {
                    return this.then(void 0, onrejected);
                }
                finally(onfinally) {
                    return this.then(onfinally, onfinally).then(() => this);
                }
            }
            exports.AtomicPromise = AtomicPromise;
            _a = internal;
            function isPromiseLike(value) {
                return value !== null && typeof value === 'object' && 'then' in value && typeof value.then === 'function';
            }
            exports.isPromiseLike = isPromiseLike;
            function resume(internal) {
                const {status, fulfillReactions, rejectReactions} = internal;
                switch (status.state) {
                case 0:
                case 1:
                    return;
                case 2:
                    if (!internal.isHandled && rejectReactions.length > 0) {
                        rejectReactions.length = 0;
                    }
                    if (fulfillReactions.length === 0)
                        return;
                    internal.isHandled = true;
                    void consume(fulfillReactions, status.result);
                    return;
                case 3:
                    if (!internal.isHandled && fulfillReactions.length > 0) {
                        fulfillReactions.length = 0;
                    }
                    if (rejectReactions.length === 0)
                        return;
                    internal.isHandled = true;
                    void consume(rejectReactions, status.result);
                    return;
                }
            }
            function consume(fs, a) {
                while (fs.length > 0) {
                    void fs.shift()(a);
                }
            }
        },
        { './global': 12 }
    ],
    17: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.sqid = void 0;
            const zeros = '0'.repeat(15);
            let cnt = 0;
            function sqid(id) {
                if (arguments.length > 0) {
                    if (typeof id !== 'number')
                        throw new TypeError(`Spica: sqid: A parameter value must be a number: ${ id }`);
                    if (id >= 0 === false)
                        throw new TypeError(`Spica: sqid: A parameter value must be a positive number: ${ id }`);
                    if (id % 1 !== 0)
                        throw new TypeError(`Spica: sqid: A parameter value must be an integer: ${ id }`);
                }
                return id === void 0 ? (zeros + ++cnt).slice(-15) : (zeros + id).slice(-15);
            }
            exports.sqid = sqid;
        },
        {}
    ],
    18: [
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
    19: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.uncurry = void 0;
            exports.uncurry = f => (...args) => args.reduce((f, arg) => f(arg), f);
        },
        {}
    ],
    20: [
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
                    this.url = format_1.newURL(url, base);
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
            './url/domain/format': 21
        }
    ],
    21: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.newURL = exports._encode = exports.standardize = void 0;
            const global_1 = _dereq_('../../global');
            const memoize_1 = _dereq_('../../memoize');
            const cache_1 = _dereq_('../../cache');
            const flip_1 = _dereq_('../../flip');
            const uncurry_1 = _dereq_('../../uncurry');
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
                return exports.newURL(url, base).href;
            }
            exports.newURL = flip_1.flip(uncurry_1.uncurry(memoize_1.memoize(base => memoize_1.memoize(url => new global_1.global.URL(formatURLForEdge(url, base), base), new cache_1.Cache(9)), new cache_1.Cache(9))));
            function formatURLForEdge(url, base) {
                return url.trim() || base;
            }
        },
        {
            '../../cache': 8,
            '../../flip': 11,
            '../../global': 12,
            '../../memoize': 13,
            '../../uncurry': 19
        }
    ],
    22: [
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
    23: [
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
            Object.defineProperty(exports, 'frag', {
                enumerable: true,
                get: function () {
                    return dom_1.frag;
                }
            });
            Object.defineProperty(exports, 'shadow', {
                enumerable: true,
                get: function () {
                    return dom_1.shadow;
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
            './src/dom/builder': 24,
            './src/dom/proxy': 26,
            './src/util/dom': 27,
            './src/util/listener': 28,
            './src/util/query': 29,
            'spica/global': 12
        }
    ],
    24: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.SVG = exports.HTML = exports.Shadow = exports.API = void 0;
            const alias_1 = _dereq_('spica/alias');
            const proxy_1 = _dereq_('./proxy');
            const dom_1 = _dereq_('../util/dom');
            function API(baseFactory, formatter = el => el) {
                return new Proxy(() => void 0, handle(baseFactory, formatter));
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
                            return build(void 0, void 0, attrs);
                        if (typeof children === 'function')
                            return build(attrs, void 0, children);
                        if (attrs !== void 0 && isChildren(attrs))
                            return build(void 0, attrs, factory);
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
                                    void el.removeEventListener(name, value);
                                }
                            void dom_1.define(el, attrs);
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
            '../util/dom': 27,
            './proxy': 26,
            'spica/alias': 5
        }
    ],
    25: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.uid = void 0;
            const uuid_1 = _dereq_('spica/uuid');
            const sqid_1 = _dereq_('spica/sqid');
            const id = uuid_1.uuid().slice(-7);
            function uid() {
                return `id-${ id }-${ +sqid_1.sqid() }`;
            }
            exports.uid = uid;
        },
        {
            'spica/sqid': 17,
            'spica/uuid': 22
        }
    ],
    26: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.Elem = exports.proxy = void 0;
            const global_1 = _dereq_('spica/global');
            const alias_1 = _dereq_('spica/alias');
            const identity_1 = _dereq_('./identity');
            const dom_1 = _dereq_('../util/dom');
            var ElChildrenType;
            (function (ElChildrenType) {
                ElChildrenType.Void = 'void';
                ElChildrenType.Text = 'text';
                ElChildrenType.Array = 'array';
                ElChildrenType.Record = 'record';
            }(ElChildrenType || (ElChildrenType = {})));
            const proxies = new global_1.WeakMap();
            function proxy(el) {
                if (!proxies.has(el))
                    throw new Error(`TypedDOM: This element has no proxy.`);
                return proxies.get(el);
            }
            exports.proxy = proxy;
            const tag = Symbol.for('typed-dom/tag');
            class Elem {
                constructor(element, children_, container = element) {
                    this.element = element;
                    this.children_ = children_;
                    this.container = container;
                    this.id_ = this.element.id.trim();
                    this.isPartialUpdate = false;
                    this.isInitialization = true;
                    switch (true) {
                    case children_ === void 0:
                        this.type = ElChildrenType.Void;
                        break;
                    case typeof children_ === 'string':
                        this.type = ElChildrenType.Text;
                        break;
                    case alias_1.isArray(children_):
                        this.type = ElChildrenType.Array;
                        break;
                    case children_ && typeof children_ === 'object':
                        this.type = ElChildrenType.Record;
                        break;
                    default:
                        throw new Error(`TypedDOM: Invalid type children.`);
                    }
                    void throwErrorIfNotUsable(this);
                    void proxies.set(this.element, this);
                    switch (this.type) {
                    case ElChildrenType.Void:
                        this.isInitialization = false;
                        return;
                    case ElChildrenType.Text:
                        void dom_1.define(this.container, []);
                        this.children_ = this.container.appendChild(dom_1.text(''));
                        this.children = children_;
                        this.isInitialization = false;
                        return;
                    case ElChildrenType.Array:
                        void dom_1.define(this.container, []);
                        this.children_ = [];
                        this.children = children_;
                        this.isInitialization = false;
                        return;
                    case ElChildrenType.Record:
                        void dom_1.define(this.container, []);
                        this.children_ = this.observe(Object.assign({}, children_));
                        this.children = children_;
                        this.isInitialization = false;
                        return;
                    default:
                        throw new Error(`TypedDOM: Unreachable code.`);
                    }
                }
                get id() {
                    if (this.id_)
                        return this.id_;
                    this.id_ = identity_1.uid();
                    void this.element.classList.add(this.id_);
                    return this.id_;
                }
                get query() {
                    switch (true) {
                    case this.element !== this.container:
                        return ':host';
                    case this.id === this.element.id.trim():
                        return `#${ this.id }`;
                    default:
                        return `.${ this.id }`;
                    }
                }
                observe(children) {
                    const descs = {};
                    for (const name of alias_1.ObjectKeys(children)) {
                        let child = children[name];
                        void throwErrorIfNotUsable(child);
                        void this.container.appendChild(child.element);
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
                                        void this.container.replaceChild(newChild.element, oldChild.element);
                                        void this.container.insertBefore(oldChild.element, ref);
                                    } else {
                                        void this.container.insertBefore(newChild.element, oldChild.element);
                                        void this.container.removeChild(oldChild.element);
                                    }
                                } else {
                                    this.children = Object.assign(Object.assign({}, this.children_), { [name]: newChild });
                                }
                            }
                        };
                    }
                    return alias_1.ObjectDefineProperties(children, descs);
                }
                scope(child) {
                    if (child.element.tagName !== 'STYLE')
                        return;
                    const syntax = /(^|[,}])(\s*)\$scope(?![\w-])(?=[^;{}]*{)/g;
                    const style = child.element;
                    const query = this.query;
                    if (style.innerHTML.search(syntax) === -1)
                        return;
                    style.innerHTML = style.innerHTML.replace(syntax, (_, frag, space) => `${ frag }${ space }${ query }`);
                    switch (query[0]) {
                    case '.': {
                            const id = query.slice(1);
                            if (!style.classList.contains(id))
                                break;
                            void style.classList.add(id);
                            break;
                        }
                    }
                    if (style.children.length === 0)
                        return;
                    for (const el of style.querySelectorAll('*')) {
                        void el.remove();
                    }
                }
                get children() {
                    switch (this.type) {
                    case ElChildrenType.Text:
                        if (this.children_.parentNode !== this.container) {
                            this.children_ = void 0;
                            for (const node of this.container.childNodes) {
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
                    case ElChildrenType.Void:
                        return;
                    case ElChildrenType.Text: {
                            if (!this.isInitialization && children === this.children)
                                return;
                            const targetChildren = this.children_;
                            const oldText = targetChildren.data;
                            const newText = children;
                            targetChildren.data = newText;
                            if (newText === oldText)
                                return;
                            void this.element.dispatchEvent(new global_1.Event('change', {
                                bubbles: false,
                                cancelable: true
                            }));
                            return;
                        }
                    case ElChildrenType.Array: {
                            const sourceChildren = children;
                            const targetChildren = [];
                            this.children_ = targetChildren;
                            const nodeChildren = this.container.children;
                            for (let i = 0; i < sourceChildren.length; ++i) {
                                const newChild = sourceChildren[i];
                                const el = nodeChildren[i];
                                if (newChild.element.parentNode !== this.container) {
                                    void throwErrorIfNotUsable(newChild);
                                }
                                if (newChild.element !== el) {
                                    if (newChild.element.parentNode !== this.container) {
                                        void this.scope(newChild);
                                        void addedChildren.push(newChild);
                                    }
                                    void this.container.insertBefore(newChild.element, el);
                                    isChanged = true;
                                }
                                void targetChildren.push(newChild);
                            }
                            void alias_1.ObjectFreeze(targetChildren);
                            for (let i = nodeChildren.length; sourceChildren.length < i--;) {
                                const el = nodeChildren[sourceChildren.length];
                                if (!proxies.has(el))
                                    continue;
                                void removedChildren.push(proxy(this.container.removeChild(el)));
                                isChanged = true;
                            }
                            break;
                        }
                    case ElChildrenType.Record: {
                            const sourceChildren = children;
                            const targetChildren = this.children_;
                            for (const name of alias_1.ObjectKeys(targetChildren)) {
                                const oldChild = targetChildren[name];
                                const newChild = sourceChildren[name];
                                if (!this.isInitialization && newChild === oldChild)
                                    continue;
                                if (newChild.element.parentNode !== this.container) {
                                    void throwErrorIfNotUsable(newChild);
                                }
                                if (this.isInitialization || newChild !== oldChild && newChild.element.parentNode !== oldChild.element.parentNode) {
                                    void this.scope(newChild);
                                    void addedChildren.push(newChild);
                                    if (!this.isInitialization) {
                                        let i = 0;
                                        i = removedChildren.lastIndexOf(newChild);
                                        i > -1 && removedChildren.splice(i, 1);
                                        void removedChildren.push(oldChild);
                                        i = addedChildren.lastIndexOf(oldChild);
                                        i > -1 && addedChildren.splice(i, 1);
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
                    for (const child of removedChildren) {
                        void child.element.dispatchEvent(new global_1.Event('disconnect', {
                            bubbles: false,
                            cancelable: true
                        }));
                    }
                    for (const child of addedChildren) {
                        void child.element.dispatchEvent(new global_1.Event('connect', {
                            bubbles: false,
                            cancelable: true
                        }));
                    }
                    if (isChanged) {
                        void this.element.dispatchEvent(new global_1.Event('change', {
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
                throw new Error(`TypedDOM: Typed DOM children can't be used to another typed DOM.`);
            }
        },
        {
            '../util/dom': 27,
            './identity': 25,
            'spica/alias': 5,
            'spica/global': 12
        }
    ],
    27: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.define = exports.element = exports.text = exports.svg = exports.html = exports.shadow = exports.frag = void 0;
            const global_1 = _dereq_('spica/global');
            const alias_1 = _dereq_('spica/alias');
            const memoize_1 = _dereq_('spica/memoize');
            var NS;
            (function (NS) {
                NS['HTML'] = 'HTML';
                NS['SVG'] = 'SVG';
            }(NS || (NS = {})));
            const shadows = new WeakMap();
            var caches;
            (function (caches) {
                caches.elem = memoize_1.memoize(() => Object.create(null), new WeakMap());
                caches.frag = global_1.document.createDocumentFragment();
            }(caches || (caches = {})));
            function frag(children) {
                if (typeof children === 'string')
                    return frag([children]);
                const node = caches.frag.cloneNode();
                return defineChildren(node, children, true);
            }
            exports.frag = frag;
            function shadow(el, children, opts) {
                if (typeof el === 'string')
                    return shadow(html(el), children, opts);
                if (children && !isChildren(children))
                    return shadow(el, void 0, children);
                return el.shadowRoot || shadows.has(el) ? defineChildren(opts ? opts.mode === 'open' ? el.shadowRoot || el.attachShadow(opts) : shadows.get(el) || shadows.set(el, el.attachShadow(opts)).get(el) : el.shadowRoot || shadows.get(el), children, !shadows.has(el)) : defineChildren(!opts || opts.mode === 'open' ? el.attachShadow({ mode: 'open' }) : shadows.set(el, el.attachShadow(opts)).get(el), children === void 0 ? el.childNodes : children, !shadows.has(el));
            }
            exports.shadow = shadow;
            function html(tag, attrs, children) {
                return element(global_1.document, 'HTML', tag, attrs, children);
            }
            exports.html = html;
            function svg(tag, attrs, children) {
                return element(global_1.document, 'SVG', tag, attrs, children);
            }
            exports.svg = svg;
            function text(source) {
                return global_1.document.createTextNode(source);
            }
            exports.text = text;
            function element(context, ns, tag, attrs, children) {
                const cache = caches.elem(context);
                const key = `${ ns }:${ tag }`;
                const el = tag.includes('-') ? elem(context, ns, tag) : (cache[key] = cache[key] || elem(context, ns, tag)).cloneNode(true);
                isChildren(attrs) ? defineChildren(el, attrs, true) : defineChildren(defineAttrs(el, attrs), children, true);
                return el;
            }
            exports.element = element;
            function elem(context, ns, tag) {
                if ('id' in context)
                    throw new Error(`TypedDOM: Scoped custom elements are not supported.`);
                switch (ns) {
                case 'HTML':
                    return context.createElement(tag);
                case 'SVG':
                    return context.createElementNS('http://www.w3.org/2000/svg', tag);
                }
            }
            function define(el, attrs, children) {
                return isChildren(attrs) ? defineChildren(el, attrs) : defineChildren(defineAttrs(el, attrs), children);
            }
            exports.define = define;
            function defineAttrs(el, attrs) {
                if (!attrs)
                    return el;
                for (const name of alias_1.ObjectKeys(attrs)) {
                    const value = attrs[name];
                    switch (typeof value) {
                    case 'string':
                        void el.setAttribute(name, value);
                        continue;
                    case 'function':
                        if (name.length < 3)
                            throw new Error(`TypedDOM: Attribute names for event listeners must have an event name but got "${ name }".`);
                        if (name.slice(0, 2) !== 'on')
                            throw new Error(`TypedDOM: Attribute names for event listeners must start with "on" but got "${ name }".`);
                        void el.addEventListener(name.slice(2), value, {
                            passive: [
                                'wheel',
                                'mousewheel',
                                'touchstart',
                                'touchmove'
                            ].includes(name.slice(2))
                        });
                        continue;
                    case 'object':
                        void el.removeAttribute(name);
                        continue;
                    default:
                        continue;
                    }
                }
                return el;
            }
            function defineChildren(el, children, clean = false) {
                switch (typeof children) {
                case 'undefined':
                    return el;
                case 'string':
                    return defineChildren(el, [children], clean);
                }
                const targetNodes = clean ? [] : el.childNodes;
                let targetLength = targetNodes.length;
                let count = 0;
                if (targetLength === 0) {
                    void el.append(...children);
                } else if (alias_1.isArray(children)) {
                    I:
                        for (const child of children) {
                            if (typeof child === 'object' && child.nodeType === 11) {
                                const sourceNodes = child.childNodes;
                                const sourceLength = sourceNodes.length;
                                void el.insertBefore(child, targetNodes[count] || null);
                                count += sourceLength;
                                targetLength += sourceLength;
                                continue;
                            }
                            void ++count;
                            while (targetLength > count) {
                                const node = targetNodes[count - 1];
                                if (equal(node, child))
                                    continue I;
                                void node.remove();
                                void --targetLength;
                            }
                            const node = targetNodes[count - 1] || null;
                            if (node && equal(node, child))
                                continue;
                            void el.insertBefore(typeof child === 'string' ? text(child) : child, node);
                            void ++targetLength;
                        }
                    while (count < targetLength) {
                        void targetNodes[count].remove();
                        void --targetLength;
                    }
                } else {
                    for (const child of children) {
                        if (typeof child === 'object' && child.nodeType === 11) {
                            const sourceNodes = child.childNodes;
                            const sourceLength = sourceNodes.length;
                            void el.insertBefore(child, targetNodes[count] || null);
                            count += sourceLength;
                            targetLength += sourceLength;
                            continue;
                        }
                        void ++count;
                        const node = targetNodes[count - 1] || null;
                        if (node && equal(node, child))
                            continue;
                        void el.insertBefore(typeof child === 'string' ? text(child) : child, node);
                        void ++targetLength;
                    }
                    while (count < targetLength) {
                        void targetNodes[count].remove();
                        void --targetLength;
                    }
                }
                return el;
            }
            function isChildren(o) {
                return !!(o === null || o === void 0 ? void 0 : o[global_1.Symbol.iterator]);
            }
            function equal(node, data) {
                return typeof data === 'string' ? 'wholeText' in node && data === node.data : data === node;
            }
        },
        {
            'spica/alias': 5,
            'spica/global': 12,
            'spica/memoize': 13
        }
    ],
    28: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.bind = exports.delegate = exports.wait = exports.once = exports.listen = exports.currentTarget = void 0;
            const promise_1 = _dereq_('spica/promise');
            const noop_1 = _dereq_('spica/noop');
            exports.currentTarget = Symbol.for('currentTarget');
            function listen(target, a, b, c = false, d = {}) {
                return typeof b === 'string' ? delegate(target, a, b, c, d) : bind(target, a, b, c);
            }
            exports.listen = listen;
            function once(target, a, b, c = false, d = {}) {
                return typeof b === 'string' ? delegate(target, a, b, c, Object.assign(Object.assign({}, typeof d === 'boolean' ? { capture: d } : d), { once: true })) : bind(target, a, b, Object.assign(Object.assign({}, typeof c === 'boolean' ? { capture: c } : c), { once: true }));
            }
            exports.once = once;
            function wait(target, a, b = false, c = {}) {
                return new promise_1.AtomicPromise(resolve => typeof b === 'string' ? void once(target, a, b, resolve, c) : void once(target, a, resolve, b));
            }
            exports.wait = wait;
            function delegate(target, selector, type, listener, option = {}) {
                return bind(target.nodeType === 9 ? target.documentElement : target, type, ev => {
                    const cx = (ev.target.shadowRoot && ev.composedPath()[0] || ev.target).closest(selector);
                    cx && void once(cx, type, listener, option);
                    return ev.returnValue;
                }, Object.assign(Object.assign({}, option), { capture: true }));
            }
            exports.delegate = delegate;
            function bind(target, type, listener, option = false) {
                void target.addEventListener(type, handler, option);
                let unbind = () => (unbind = noop_1.noop, void target.removeEventListener(type, handler, option));
                return () => void unbind();
                function handler(ev) {
                    ev[exports.currentTarget] = ev.currentTarget;
                    return listener(ev);
                }
            }
            exports.bind = bind;
        },
        {
            'spica/noop': 15,
            'spica/promise': 16
        }
    ],
    29: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.apply = void 0;
            const dom_1 = _dereq_('./dom');
            function apply(node, selector, attrs) {
                const ns = node.querySelectorAll(selector);
                for (let i = 0, len = ns.length; i < len; ++i) {
                    void dom_1.define(ns[i], attrs);
                }
                return ns;
            }
            exports.apply = apply;
        },
        { './dom': 27 }
    ],
    30: [
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
                    if (!exports.hasOwnProperty(p))
                        __createBinding(exports, m, p);
            };
            Object.defineProperty(exports, '__esModule', { value: true });
            var parser_1 = _dereq_('./combinator/data/parser');
            Object.defineProperty(exports, 'Result', {
                enumerable: true,
                get: function () {
                    return parser_1.Result;
                }
            });
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
            __exportStar(_dereq_('./combinator/control/manipulation/resource'), exports);
            __exportStar(_dereq_('./combinator/control/manipulation/surround'), exports);
            __exportStar(_dereq_('./combinator/control/manipulation/match'), exports);
            __exportStar(_dereq_('./combinator/control/manipulation/convert'), exports);
            __exportStar(_dereq_('./combinator/control/manipulation/indent'), exports);
            __exportStar(_dereq_('./combinator/control/manipulation/fence'), exports);
            __exportStar(_dereq_('./combinator/control/manipulation/trim'), exports);
            __exportStar(_dereq_('./combinator/control/manipulation/context'), exports);
            __exportStar(_dereq_('./combinator/control/manipulation/lazy'), exports);
            __exportStar(_dereq_('./combinator/control/manipulation/recovery'), exports);
            __exportStar(_dereq_('./combinator/control/monad/fmap'), exports);
            __exportStar(_dereq_('./combinator/control/monad/bind'), exports);
        },
        {
            './combinator/control/constraint/block': 31,
            './combinator/control/constraint/contract': 32,
            './combinator/control/constraint/line': 33,
            './combinator/control/constraint/scope': 34,
            './combinator/control/manipulation/context': 35,
            './combinator/control/manipulation/convert': 36,
            './combinator/control/manipulation/fence': 37,
            './combinator/control/manipulation/indent': 38,
            './combinator/control/manipulation/lazy': 39,
            './combinator/control/manipulation/match': 40,
            './combinator/control/manipulation/recovery': 41,
            './combinator/control/manipulation/resource': 42,
            './combinator/control/manipulation/surround': 43,
            './combinator/control/manipulation/trim': 44,
            './combinator/control/monad/bind': 45,
            './combinator/control/monad/fmap': 46,
            './combinator/data/parser': 47,
            './combinator/data/parser/inits': 48,
            './combinator/data/parser/sequence': 49,
            './combinator/data/parser/some': 50,
            './combinator/data/parser/subsequence': 51,
            './combinator/data/parser/tails': 52,
            './combinator/data/parser/union': 53
        }
    ],
    31: [
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
            '../../data/parser': 47,
            './line': 33
        }
    ],
    32: [
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
            '../../data/parser': 47,
            'spica/alias': 5
        }
    ],
    33: [
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
        { '../../data/parser': 47 }
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
        { '../../data/parser': 47 }
    ],
    35: [
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
                return (source, context) => parser(source, merge(alias_1.ObjectCreate(context), base));
            }
            exports.update = update;
            function context(base, parser) {
                const merge_ = memoize_1.memoize(context => merge(alias_1.ObjectCreate(context), base), new global_1.WeakMap());
                return (source, context) => parser(source, merge_(context));
            }
            exports.context = context;
            const merge = assign_1.template((prop, target, source) => {
                switch (prop) {
                case 'resource':
                    return prop in target ? target[prop] : target[prop] = alias_1.ObjectCreate(source[prop]);
                }
                switch (type_1.type(source[prop])) {
                case 'Object':
                    switch (type_1.type(target[prop])) {
                    case 'Object':
                        return target[prop] = isOwnProperty(target, prop) ? merge(target[prop], source[prop]) : merge(alias_1.ObjectCreate(target[prop]), source[prop]);
                    default:
                        return target[prop] = alias_1.ObjectCreate(source[prop]);
                    }
                default:
                    return target[prop] = source[prop];
                }
            });
            const isOwnProperty = '__proto__' in {} ? (o, p) => !('__proto__' in o) || o[p] !== o['__proto__'][p] : alias_1.hasOwnProperty;
        },
        {
            'spica/alias': 5,
            'spica/assign': 7,
            'spica/global': 12,
            'spica/memoize': 13,
            'spica/type': 18
        }
    ],
    36: [
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
    37: [
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
            '../constraint/line': 33,
            'spica/array': 6
        }
    ],
    38: [
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
            '../../data/parser': 47,
            '../../data/parser/some': 50,
            '../constraint/line': 33,
            '../monad/bind': 45,
            './match': 40,
            './surround': 43,
            'spica/array': 6
        }
    ],
    39: [
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
    40: [
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
            '../../data/parser': 47,
            'spica/memoize': 13
        }
    ],
    41: [
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
    42: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.creator = void 0;
            function creator(cost, parser) {
                if (typeof cost === 'function')
                    return creator(1, cost);
                return (source, context) => {
                    const {resource} = context;
                    if (resource && resource.creation < 0)
                        throw new Error('Too many creations');
                    const result = parser(source, context);
                    if (result && resource) {
                        resource.creation -= cost;
                    }
                    return result;
                };
            }
            exports.creator = creator;
        },
        {}
    ],
    43: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.clear = exports.close = exports.open = exports.surround = void 0;
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
                    const [rl = [], mr_] = opener(lmr_, context) || [];
                    if (mr_ === void 0)
                        return;
                    const [rm, r_ = mr_] = mr_ !== '' && parser(mr_, context) || [];
                    if (!optional && r_.length === mr_.length)
                        return;
                    const [rr, rest = r_] = closer(r_, context) || [];
                    if (rest.length === lmr_.length)
                        return;
                    return rr ? f ? f([
                        rl,
                        rm,
                        rr
                    ], rest, context) : [
                        rm ? array_1.push(array_1.unshift(rl, rm), rr) : array_1.push(rl, rr),
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
                if (typeof opener === 'string')
                    return open(match(opener), parser, optional);
                if (typeof opener === 'object')
                    return open(match(opener), parser, optional);
                return (source, context) => {
                    if (source === '')
                        return;
                    const [rl = [], mr_] = opener(source, context) || [];
                    if (mr_ === void 0)
                        return;
                    const [rm = [], r_] = mr_ !== '' && parser(mr_, context) || [];
                    if (r_ === void 0)
                        return optional && mr_.length < source.length ? [
                            rl,
                            mr_
                        ] : void 0;
                    void array_1.unshift(rl, rm);
                    return r_.length < source.length ? [
                        rm,
                        r_
                    ] : void 0;
                };
            }
            exports.open = open;
            function close(parser, closer, optional = false, f, g) {
                if (typeof closer === 'string')
                    return close(parser, match(closer), optional, f, g);
                if (typeof closer === 'object')
                    return close(parser, match(closer), optional, f, g);
                if (typeof optional === 'function')
                    return close(parser, closer, void 0, optional, f);
                return (source, context) => {
                    if (source === '')
                        return;
                    const [rm = [], r_ = source] = parser(source, context) || [];
                    if (!optional && r_.length === source.length)
                        return;
                    const [rr = [], rest] = r_ !== '' && closer(r_, context) || [];
                    if (rest === void 0)
                        return g ? g(rm, r_, context) : void 0;
                    if (rest.length === source.length)
                        return;
                    void array_1.push(rm, rr);
                    return f ? f(rm, rest, context) : [
                        rm,
                        rest
                    ];
                };
            }
            exports.close = close;
            function clear(parser) {
                return fmap_1.fmap(parser, () => []);
            }
            exports.clear = clear;
        },
        {
            '../monad/fmap': 46,
            'spica/array': 6
        }
    ],
    44: [
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
        { './convert': 36 }
    ],
    45: [
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
        { '../../data/parser': 47 }
    ],
    46: [
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
        { './bind': 45 }
    ],
    47: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.check = exports.exec = exports.eval = exports.Result = void 0;
            function Result(data, rest) {
                return [
                    [data],
                    rest
                ];
            }
            exports.Result = Result;
            function eval_(result, default_ = []) {
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
    48: [
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
            '../parser': 47,
            'spica/array': 6
        }
    ],
    49: [
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
            '../parser': 47,
            'spica/array': 6
        }
    ],
    50: [
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
            '../parser': 47,
            'spica/array': 6
        }
    ],
    51: [
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
            './inits': 48,
            './union': 53
        }
    ],
    52: [
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
            './sequence': 49,
            './union': 53
        }
    ],
    53: [
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
        { '../parser': 47 }
    ],
    54: [
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
                    if (!exports.hasOwnProperty(p))
                        __createBinding(exports, m, p);
            };
            Object.defineProperty(exports, '__esModule', { value: true });
            __exportStar(_dereq_('./parser/api'), exports);
        },
        { './parser/api': 55 }
    ],
    55: [
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
            './api/bind': 56,
            './api/cache': 57,
            './api/parse': 59
        }
    ],
    56: [
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
                        const es = combinator_1.eval(block_1.block(seg, {}));
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
                    for (const [, es] of pairs.splice(index, pairs.length - sourceSegments.length)) {
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
                    for (const el of figure_1.figure(target, footnotes)) {
                        yield el;
                        if (rev !== revision)
                            return yield;
                    }
                    for (const el of footnote_1.footnote(target, footnotes)) {
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
            '../../combinator': 30,
            '../../util/figure': 143,
            '../../util/footnote': 144,
            '../block': 61,
            '../segment': 118,
            './normalize': 58,
            'spica/array': 6
        }
    ],
    57: [
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
            '../inline/math': 109,
            '../inline/media': 110
        }
    ],
    58: [
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
    59: [
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
                const node = typed_dom_1.frag(segment_1.segment(normalize_1.normalize(source)).reduce((acc, seg) => array_1.push(acc, combinator_1.eval(block_1.block(seg, opts.context || {}))), []));
                if (opts.test)
                    return node;
                void [...figure_1.figure(node)];
                void [...footnote_1.footnote(node, (_a = opts.footnotes) !== null && _a !== void 0 ? _a : {
                        annotation: typed_dom_1.html('ol'),
                        reference: typed_dom_1.html('ol')
                    })];
                return node;
            }
            exports.parse = parse;
        },
        {
            '../../combinator': 30,
            '../../util/figure': 143,
            '../../util/footnote': 144,
            '../block': 61,
            '../segment': 118,
            './normalize': 58,
            'spica/array': 6,
            'typed-dom': 23
        }
    ],
    60: [
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
            '../combinator': 30,
            './inline': 81,
            './source': 119
        }
    ],
    61: [
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
            exports.block = combinator_1.recover(locale_1.localize(combinator_1.update({ resource: { creation: 100 * 1000 } }, combinator_1.union([
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
            '../combinator': 30,
            './block/blockquote': 62,
            './block/codeblock': 63,
            './block/dlist': 64,
            './block/extension': 65,
            './block/heading': 70,
            './block/horizontalrule': 71,
            './block/ilist': 72,
            './block/mathblock': 73,
            './block/olist': 74,
            './block/paragraph': 75,
            './block/table': 79,
            './block/ulist': 80,
            './locale': 116,
            './source/line': 122,
            'typed-dom': 23
        }
    ],
    62: [
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
            exports.blockquote = combinator_1.lazy(() => combinator_1.block(combinator_1.rewrite(exports.segment, combinator_1.union([
                combinator_1.open(/^(?=>)/, text),
                combinator_1.open(/^!(?=>)/, source)
            ]))));
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
            '../../combinator': 30,
            '../api/parse': 59,
            '../autolink': 60,
            '../source': 119,
            '../util': 127,
            'typed-dom': 23
        }
    ],
    63: [
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
            exports.codeblock = combinator_1.block(combinator_1.validate('```', combinator_1.fmap(combinator_1.fence(opener, 300, true), ([body, closer, opener, , lang, param], _, context) => {
                [lang, param] = language.test(lang) ? [
                    lang,
                    param
                ] : [
                    '',
                    lang + param
                ];
                param = param.trim();
                const path = array_1.join(combinator_1.eval(combinator_1.some(source_1.escsource, /^\s/)(param, context)));
                if (!closer || param !== path)
                    return [typed_dom_1.html('pre', {
                            class: 'notranslate invalid',
                            'data-invalid-syntax': 'codeblock',
                            'data-invalid-message': `Invalid ${ closer ? 'parameter' : 'content' }`
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
                    void typed_dom_1.define(el, util_1.defrag(combinator_1.eval(combinator_1.some(autolink_1.autolink)(el.textContent, context))));
                }
                if (path) {
                    void el.setAttribute('data-file', path);
                }
                return [el];
            })));
        },
        {
            '../../combinator': 30,
            '../autolink': 60,
            '../source': 119,
            '../util': 127,
            'spica/array': 6,
            'typed-dom': 23
        }
    ],
    64: [
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
            exports.dlist = combinator_1.lazy(() => combinator_1.block(combinator_1.fmap(combinator_1.validate(/^~(?=$|\s)/, combinator_1.convert(source => source.replace(paragraph_1.blankline, ''), combinator_1.context({ syntax: { inline: { media: false } } }, combinator_1.some(combinator_1.inits([
                combinator_1.some(term),
                combinator_1.some(desc)
            ]))))), es => [typed_dom_1.html('dl', fillTrailingDescription(es))])));
            const term = combinator_1.line(inline_1.indexee(combinator_1.fmap(combinator_1.open(/^~(?=$|\s)/, combinator_1.trim(combinator_1.some(combinator_1.union([
                inline_1.indexer,
                inline_1.inline
            ]))), true), ns => [typed_dom_1.html('dt', util_1.defrag(ns))])));
            const desc = combinator_1.block(combinator_1.fmap(combinator_1.open(/^:(?=$|\s)|/, combinator_1.rewrite(combinator_1.some(source_1.anyline, /^[~:](?=$|\s)/), combinator_1.trim(combinator_1.some(combinator_1.union([inline_1.inline])))), true), ns => [typed_dom_1.html('dd', util_1.defrag(ns))]), false);
            function fillTrailingDescription(es) {
                return es.length > 0 && es[es.length - 1].tagName === 'DT' ? array_1.push(es, [typed_dom_1.html('dd')]) : es;
            }
        },
        {
            '../../combinator': 30,
            '../inline': 81,
            '../source': 119,
            '../util': 127,
            './paragraph': 75,
            'spica/array': 6,
            'typed-dom': 23
        }
    ],
    65: [
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
            '../../combinator': 30,
            './extension/example': 66,
            './extension/fig': 67,
            './extension/figure': 68,
            './extension/placeholder': 69
        }
    ],
    66: [
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
            exports.example = combinator_1.block(combinator_1.validate('~~~', combinator_1.fmap(combinator_1.fence(opener, 100, true), ([body, closer, opener, , type, param], _, context) => {
                if (!closer || param.trim() !== '')
                    return [typed_dom_1.html('pre', {
                            class: 'example notranslate invalid',
                            'data-invalid-syntax': 'example',
                            'data-invalid-message': `Invalid ${ closer ? 'parameter' : 'content' }`
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
                            combinator_1.eval(mathblock_1.mathblock(`$$\n${ body }$$`, context))[0]
                        ])];
                default:
                    return [typed_dom_1.html('pre', {
                            class: 'example notranslate invalid',
                            'data-invalid-syntax': 'example',
                            'data-invalid-message': `Invalid example type`
                        }, `${ opener }${ body }${ closer }`)];
                }
            })));
        },
        {
            '../../../combinator': 30,
            '../../api/parse': 59,
            '../../util': 127,
            '../mathblock': 73,
            'typed-dom': 23
        }
    ],
    67: [
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
                const bracket = (/^[^\n]*\n!?>+\s/.test(source) && source.match(/^~{3,}(?=\s*$)/gm) || []).reduce((max, bracket) => bracket > max ? bracket : max, '~~') + '~';
                return `${ bracket }figure ${ source }\n\n${ bracket }`;
            }, figure_1.figure)));
        },
        {
            '../../../combinator': 30,
            '../../inline/extension/label': 102,
            '../../source': 119,
            '../blockquote': 62,
            '../codeblock': 63,
            '../extension/example': 66,
            '../mathblock': 73,
            './figure': 68
        }
    ],
    68: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.figure = exports.segment = void 0;
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
            exports.segment = combinator_1.block(combinator_1.match(/^(~{3,})figure[^\S\n]+(?=\[?\$[\w-]\S*[^\S\n]*\n(?:[^\n]*\n)*?\1[^\S\n]*(?:$|\n))/, combinator_1.memoize(([, fence]) => fence, (fence, closer = new RegExp(`^${ fence }[^\\S\\n]*(?:$|\\n)`)) => combinator_1.close(combinator_1.sequence([
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
                    'data-invalid-message': invalid && 'A figure labeled to define a formula number can contain only a math formula and no caption'
                };
            }
        },
        {
            '../../../combinator': 30,
            '../../inline': 81,
            '../../inline/extension/label': 102,
            '../../source': 119,
            '../../util': 127,
            '../blockquote': 62,
            '../codeblock': 63,
            '../mathblock': 73,
            '../paragraph': 75,
            '../table': 79,
            './example': 66,
            'typed-dom': 23
        }
    ],
    69: [
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
                    'data-invalid-message': 'Invalid syntax'
                }, `${ opener }${ body }${ closer }`)])));
        },
        {
            '../../../combinator': 30,
            'typed-dom': 23
        }
    ],
    70: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.heading = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const util_1 = _dereq_('../util');
            const inline_1 = _dereq_('../inline');
            const source_1 = _dereq_('../source');
            const typed_dom_1 = _dereq_('typed-dom');
            const array_1 = _dereq_('spica/array');
            exports.heading = combinator_1.block(combinator_1.focus(/^#{1,6}[^\S\n][^\n]*(?:\n#{1,6}(?:[^\S\n][^\n]*)?)*(?:$|\n)/, combinator_1.context({ syntax: { inline: { media: false } } }, combinator_1.some(combinator_1.line(inline_1.indexee(combinator_1.fmap(combinator_1.open(source_1.str(/^#+/), combinator_1.trim(combinator_1.some(combinator_1.union([
                inline_1.indexer,
                inline_1.inline
            ]))), true), ns => [typed_dom_1.html(`h${ ns[0].length }`, util_1.defrag(array_1.shift(ns)[1]))])))))));
        },
        {
            '../../combinator': 30,
            '../inline': 81,
            '../source': 119,
            '../util': 127,
            'spica/array': 6,
            'typed-dom': 23
        }
    ],
    71: [
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
            '../../combinator': 30,
            'typed-dom': 23
        }
    ],
    72: [
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
            exports.ilist = combinator_1.lazy(() => combinator_1.block(combinator_1.fmap(combinator_1.validate(/^[-+*](?:[^\S\n]|\n[^\S\n]*\S)/, combinator_1.some(combinator_1.union([combinator_1.fmap(combinator_1.inits([
                    combinator_1.line(combinator_1.open(/^[-+*](?:$|\s)/, combinator_1.trim(combinator_1.some(inline_1.inline)), true)),
                    combinator_1.indent(combinator_1.union([
                        ulist_1.ulist_,
                        olist_1.olist_,
                        exports.ilist_
                    ]))
                ]), ns => [typed_dom_1.html('li', util_1.defrag(ulist_1.fillFirstLine(ns)))])]))), es => [typed_dom_1.html('ul', {
                    class: 'invalid',
                    'data-invalid-syntax': 'list',
                    'data-invalid-message': 'Use - instead of + or *'
                }, es)])));
            exports.ilist_ = combinator_1.convert(source => source.replace(/^[-+*](?=$|\n)/, `$& `), exports.ilist);
        },
        {
            '../../combinator': 30,
            '../inline': 81,
            '../util': 127,
            './olist': 74,
            './ulist': 80,
            'typed-dom': 23
        }
    ],
    73: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.mathblock = exports.segment_ = exports.segment = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const typed_dom_1 = _dereq_('typed-dom');
            const opener = /^(\$\$)(?!\$)([^\n]*)\n?/;
            exports.segment = combinator_1.block(combinator_1.validate('$$', combinator_1.clear(combinator_1.fence(opener, 100, true))));
            exports.segment_ = combinator_1.block(combinator_1.validate('$$', combinator_1.clear(combinator_1.fence(opener, 100, false))), false);
            exports.mathblock = combinator_1.block(combinator_1.validate('$$', combinator_1.fmap(combinator_1.fence(opener, 100, true), ([body, closer, opener, , param]) => closer && param.trim() === '' ? [typed_dom_1.html('div', { class: `math notranslate` }, `$$\n${ body }$$`)] : [typed_dom_1.html('pre', {
                    class: 'math notranslate invalid',
                    'data-invalid-syntax': 'math',
                    'data-invalid-message': `Invalid ${ closer ? 'parameter' : 'content' }`
                }, `${ opener }${ body }${ closer }`)])));
        },
        {
            '../../combinator': 30,
            'typed-dom': 23
        }
    ],
    74: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.olist_ = exports.olist = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const util_1 = _dereq_('../util');
            const ulist_1 = _dereq_('./ulist');
            const ilist_1 = _dereq_('./ilist');
            const inline_1 = _dereq_('../inline');
            const source_1 = _dereq_('../source');
            const typed_dom_1 = _dereq_('typed-dom');
            const array_1 = _dereq_('spica/array');
            exports.olist = combinator_1.lazy(() => combinator_1.block(combinator_1.fmap(combinator_1.validate(/^(?=([0-9]+|[a-z]+|[A-Z]+)\.(?:[^\S\n]|\n[^\S\n]*\S))/, combinator_1.context({ syntax: { inline: { media: false } } }, combinator_1.some(combinator_1.union([combinator_1.fmap(combinator_1.inits([
                    combinator_1.line(combinator_1.inits([
                        source_1.str(/^(?:[0-9]+|[a-z]+|[A-Z]+)(?=\.\s|\.?(?=$|\n))/),
                        source_1.str(/^\.?\s*/),
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
                    }, util_1.defrag(ulist_1.fillFirstLine(array_1.shift(ns, 2)[1])))])])))), es => {
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
            '../../combinator': 30,
            '../inline': 81,
            '../source': 119,
            '../util': 127,
            './ilist': 72,
            './ulist': 80,
            'spica/array': 6,
            'typed-dom': 23
        }
    ],
    75: [
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
                'data-invalid-message': 'All paragraphs must have a visible content'
            })) : []));
            function isVisible(node) {
                return node.textContent.trim() !== '' || node.getElementsByClassName('media').length > 0;
            }
        },
        {
            '../../combinator': 30,
            '../inline': 81,
            '../source': 119,
            '../util': 127,
            './paragraph/mention': 76,
            'spica/array': 6,
            'typed-dom': 23
        }
    ],
    76: [
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
            '../../../combinator': 30,
            './mention/address': 77,
            './mention/quotation': 78
        }
    ],
    77: [
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
                    combinator_1.focus(/^h?ttps?:\/\/[^/?#\s]\S*(?=\s*$)/, combinator_1.convert(source => `{ ${ inline_1.address(source) }${ inline_1.attribute(source) } }`, inline_1.link))
                ])
            ]), ([sym, link]) => [typed_dom_1.define(link, {
                    class: 'address',
                    'data-level': `${ sym.length }`,
                    href: null
                }, `${ sym }${ link.textContent }`)])));
        },
        {
            '../../../../combinator': 30,
            '../../../inline': 81,
            '../../../source': 119,
            'typed-dom': 23
        }
    ],
    78: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.quotation = void 0;
            const combinator_1 = _dereq_('../../../../combinator');
            const util_1 = _dereq_('../../../util');
            const source_1 = _dereq_('../../../source');
            const autolink_1 = _dereq_('../../../autolink');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.quotation = combinator_1.lazy(() => combinator_1.block(combinator_1.creator(combinator_1.fmap(combinator_1.union([
                combinator_1.rewrite(combinator_1.some(combinator_1.validate(/^>+(?:$|\s)/, source_1.contentline)), combinator_1.convert(source => source.replace(/\n$/, ''), combinator_1.some(autolink_1.autolink))),
                combinator_1.rewrite(combinator_1.some(combinator_1.validate(/^>+/, source_1.contentline)), combinator_1.convert(source => source.replace(/\n$/, ''), combinator_1.some(autolink_1.autolink)))
            ]), ns => [typed_dom_1.html('span', { class: 'quotation' }, util_1.defrag(ns))])), false));
        },
        {
            '../../../../combinator': 30,
            '../../../autolink': 60,
            '../../../source': 119,
            '../../../util': 127,
            'typed-dom': 23
        }
    ],
    79: [
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
                const [[head, alignment]] = array_1.shift(rows, 2);
                void align(head, alignment, rows);
                return [typed_dom_1.html('table', [
                        typed_dom_1.html('thead', [head]),
                        typed_dom_1.html('tbody', rows)
                    ])];
            })));
            function align(head, alignment, rows) {
                const as = [...alignment.children].reduce((acc, el) => array_1.push(acc, [el.textContent || acc.length > 0 && acc[acc.length - 1] || '']), []);
                void apply(head, as.slice(0, 2));
                for (const row of rows) {
                    void apply(row, as);
                }
                return;
                function apply(row, aligns) {
                    const cols = row.children;
                    void extend(aligns, cols.length);
                    for (let i = 0; i < cols.length; ++i) {
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
            '../../combinator': 30,
            '../inline': 81,
            '../util': 127,
            'spica/array': 6,
            'spica/global': 12,
            'typed-dom': 23
        }
    ],
    80: [
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
            exports.ulist = combinator_1.lazy(() => combinator_1.block(combinator_1.fmap(combinator_1.validate(/^-(?:[^\S\n]|\n[^\S\n]*\S)/, combinator_1.context({ syntax: { inline: { media: false } } }, combinator_1.some(combinator_1.union([combinator_1.fmap(combinator_1.inits([
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
            '../../combinator': 30,
            '../inline': 81,
            '../util': 127,
            './ilist': 72,
            './olist': 74,
            'spica/array': 6,
            'typed-dom': 23
        }
    ],
    81: [
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
            Object.defineProperty(exports, 'address', {
                enumerable: true,
                get: function () {
                    return url_1.address;
                }
            });
            Object.defineProperty(exports, 'attribute', {
                enumerable: true,
                get: function () {
                    return url_1.attribute;
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
            '../combinator': 30,
            './inline/annotation': 82,
            './inline/autolink': 83,
            './inline/autolink/url': 89,
            './inline/bracket': 90,
            './inline/code': 91,
            './inline/comment': 92,
            './inline/deletion': 93,
            './inline/emphasis': 94,
            './inline/emstrong': 95,
            './inline/escape': 96,
            './inline/extension': 97,
            './inline/extension/indexee': 100,
            './inline/extension/indexer': 101,
            './inline/extension/label': 102,
            './inline/html': 104,
            './inline/htmlentity': 105,
            './inline/insertion': 106,
            './inline/link': 107,
            './inline/mark': 108,
            './inline/math': 109,
            './inline/media': 110,
            './inline/reference': 111,
            './inline/ruby': 112,
            './inline/shortmedia': 113,
            './inline/strong': 114,
            './inline/template': 115,
            './source': 119
        }
    ],
    82: [
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
            }, combinator_1.context({
                syntax: {
                    inline: {
                        annotation: false,
                        reference: false,
                        extension: true,
                        media: false
                    }
                },
                state: void 0
            }, util_1.startTight(combinator_1.union([combinator_1.some(inline_1.inline, '))')])))), '))'), (ns, rest) => util_1.isTight(ns, 0, ns.length) ? [
                [typed_dom_1.html('sup', { class: 'annotation' }, util_1.defrag(util_1.trimEnd(ns)))],
                rest
            ] : void 0)));
        },
        {
            '../../combinator': 30,
            '../inline': 81,
            '../util': 127,
            'typed-dom': 23
        }
    ],
    83: [
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
                source_1.str(/^[@#]+(?![0-9A-Za-z]|[^\x00-\x7F\s])/),
                channel_1.channel,
                account_1.account,
                hashtag_1.hashtag,
                hashref_1.hashref,
                source_1.str(/^(?:[A-Za-z0-9]|[^\x00-\x7F\s])(?=#)/)
            ])))), ns => ns.length === 1 ? ns : [util_1.stringify(ns)]);
        },
        {
            '../../combinator': 30,
            '../source': 119,
            '../util': 127,
            './autolink/account': 84,
            './autolink/channel': 85,
            './autolink/email': 86,
            './autolink/hashref': 87,
            './autolink/hashtag': 88,
            './autolink/url': 89
        }
    ],
    84: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.account = void 0;
            const combinator_1 = _dereq_('../../../combinator');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.account = combinator_1.creator(combinator_1.validate('@', combinator_1.focus(/^@[A-Za-z0-9]+(?:-[0-9A-Za-z]+)*/, source => [
                [typed_dom_1.html('a', {
                        class: 'account',
                        rel: 'noopener'
                    }, source)],
                ''
            ])));
        },
        {
            '../../../combinator': 30,
            'typed-dom': 23
        }
    ],
    85: [
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
            '../../../combinator': 30,
            '../../util': 127,
            './account': 84,
            './hashtag': 88,
            'typed-dom': 23
        }
    ],
    86: [
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
            '../../../combinator': 30,
            'typed-dom': 23
        }
    ],
    87: [
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
            '../../../combinator': 30,
            'typed-dom': 23
        }
    ],
    88: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.hashtag = void 0;
            const combinator_1 = _dereq_('../../../combinator');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.hashtag = combinator_1.creator(combinator_1.validate('#', combinator_1.focus(/^#(?![0-9]+(?![A-Za-z]|[^\x00-\x7F\s]))(?:[A-Za-z0-9]|[^\x00-\x7F\s])+/, tag => [
                [typed_dom_1.html('a', {
                        class: 'hashtag',
                        rel: 'noopener'
                    }, tag)],
                ''
            ])));
        },
        {
            '../../../combinator': 30,
            'typed-dom': 23
        }
    ],
    89: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.attribute = exports.address = exports.url = void 0;
            const combinator_1 = _dereq_('../../../combinator');
            const source_1 = _dereq_('../../source');
            const link_1 = _dereq_('../link');
            const closer = /^[-+*~^,.;:!?]*(?=[\s"`|\[\](){}<>]|\\?(?:$|\s))/;
            exports.url = combinator_1.lazy(() => combinator_1.rewrite(combinator_1.validate([
                'http',
                'ttp'
            ], combinator_1.open(source_1.str(/^h?ttps?:\/\/(?=[^/?#\s])/), combinator_1.some(combinator_1.union([
                bracket,
                combinator_1.some(source_1.unescsource, closer)
            ])))), combinator_1.convert(source => `{ ${ address(source) }${ attribute(source) } }`, combinator_1.context({ syntax: { inline: { link: void 0 } } }, combinator_1.union([link_1.link])))));
            const bracket = combinator_1.lazy(() => combinator_1.union([
                combinator_1.surround('(', combinator_1.some(combinator_1.union([
                    bracket,
                    source_1.str(/^[^\s\)([{<"]+/)
                ])), ')', true),
                combinator_1.surround('[', combinator_1.some(combinator_1.union([
                    bracket,
                    source_1.str(/^[^\s\]([{<"]+/)
                ])), ']', true),
                combinator_1.surround('{', combinator_1.some(combinator_1.union([
                    bracket,
                    source_1.str(/^[^\s\}([{<"]+/)
                ])), '}', true),
                combinator_1.surround('<', combinator_1.some(combinator_1.union([
                    bracket,
                    source_1.str(/^[^\s\>([{<"]+/)
                ])), '>', true),
                combinator_1.surround('"', source_1.str(/^[\s"]+/), '"', true)
            ]));
            function address(source) {
                return source.slice(0, 3) === 'ttp' ? `h${ source }` : source;
            }
            exports.address = address;
            function attribute(source) {
                return source.slice(0, 3) === 'ttp' ? ' nofollow' : '';
            }
            exports.attribute = attribute;
        },
        {
            '../../../combinator': 30,
            '../../source': 119,
            '../link': 107
        }
    ],
    90: [
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
            '../../combinator': 30,
            '../inline': 81,
            '../source': 119,
            'spica/array': 6
        }
    ],
    91: [
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
            '../../combinator': 30,
            'typed-dom': 23
        }
    ],
    92: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.comment = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.comment = combinator_1.creator(combinator_1.validate('<#', combinator_1.match(/^<(#+)\s+(\S+(?:\s+(?!\1)\S+)*)(\s+\1>)?/, ([whole, , title, last]) => (rest, {resource}) => last ? [
                [typed_dom_1.html('sup', {
                        class: 'comment',
                        title
                    })],
                rest
            ] : resource && void (resource.creation -= whole.match(/<#+\s/g).length))));
        },
        {
            '../../combinator': 30,
            'typed-dom': 23
        }
    ],
    93: [
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
            exports.deletion = combinator_1.lazy(() => combinator_1.creator(combinator_1.surround(source_1.str('~~'), combinator_1.union([combinator_1.some(inline_1.inline, '~~')]), source_1.str('~~'), false, ([as, bs, cs], rest) => util_1.isTight(bs, 0, bs.length) ? [
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
            '../../combinator': 30,
            '../inline': 81,
            '../source': 119,
            '../util': 127,
            'spica/array': 6,
            'typed-dom': 23
        }
    ],
    94: [
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
            exports.emphasis = combinator_1.lazy(() => combinator_1.creator(combinator_1.surround(source_1.char('*'), combinator_1.some(combinator_1.union([
                strong_1.strong,
                combinator_1.some(inline_1.inline, '*')
            ])), source_1.char('*'), false, ([as, bs, cs], rest) => util_1.isTight(bs, 0, bs.length) ? [
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
            '../../combinator': 30,
            '../inline': 81,
            '../source': 119,
            '../util': 127,
            './strong': 114,
            'spica/array': 6,
            'typed-dom': 23
        }
    ],
    95: [
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
            exports.emstrong = combinator_1.lazy(() => combinator_1.creator(combinator_1.surround(source_1.str('***'), combinator_1.union([combinator_1.some(inline_1.inline, '*')]), source_1.str(/^\*{1,3}/), false, ([as, bs, cs], rest, context) => {
                if (!util_1.isTight(bs, 0, bs.length))
                    return [
                        array_1.unshift(as, bs),
                        cs[0] + rest
                    ];
                switch (cs[0]) {
                case '*':
                    return combinator_1.fmap(strong_1.strong, ms => typeof ms[0] === 'object' ? void ms[0].prepend(typed_dom_1.html('em', util_1.defrag(util_1.trimEnd(bs)))) || ms : array_1.push(array_1.unshift(as, bs), array_1.shift(ms)[1]))('**' + rest, context) || [
                        array_1.push(array_1.unshift(as, bs), cs),
                        rest
                    ];
                case '**':
                    return combinator_1.fmap(emphasis_1.emphasis, ms => typeof ms[0] === 'object' ? void ms[0].prepend(typed_dom_1.html('strong', util_1.defrag(util_1.trimEnd(bs)))) || ms : array_1.push(array_1.unshift(as, bs), array_1.shift(ms)[1]))('*' + rest, context) || [
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
            '../../combinator': 30,
            '../inline': 81,
            '../source': 119,
            '../util': 127,
            './emphasis': 94,
            './strong': 114,
            'spica/array': 6,
            'typed-dom': 23
        }
    ],
    96: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.escape = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const source_1 = _dereq_('../source');
            const repeat = source_1.str(/^(.)\1*/);
            exports.escape = combinator_1.creator(combinator_1.union([(source, context) => {
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
                }]));
        },
        {
            '../../combinator': 30,
            '../source': 119
        }
    ],
    97: [
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
            '../../combinator': 30,
            './extension/data': 98,
            './extension/index': 99,
            './extension/label': 102,
            './extension/placeholder': 103
        }
    ],
    98: [
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
                combinator_1.some(inline_1.inline, ']')
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
            '../../../combinator': 30,
            '../../inline': 81,
            '../../source': 119,
            '../../util': 127,
            'spica/array': 6,
            'typed-dom': 23
        }
    ],
    99: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.index = void 0;
            const inline_1 = _dereq_('../../inline');
            const combinator_1 = _dereq_('../../../combinator');
            const util_1 = _dereq_('../../util');
            const indexee_1 = _dereq_('./indexee');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.index = combinator_1.lazy(() => combinator_1.creator(combinator_1.subline(combinator_1.fmap(indexee_1.indexee(combinator_1.surround('[#', combinator_1.context({
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
            }, util_1.startTight(combinator_1.union([combinator_1.some(inline_1.inline, ']')]))), ']', false, ([, bs], rest) => util_1.isTight(bs, 0, bs.length) ? [
                [typed_dom_1.html('a', util_1.defrag(util_1.trimEnd(bs)))],
                rest
            ] : void 0)), ([el]) => [typed_dom_1.define(el, {
                    id: null,
                    class: 'index',
                    href: el.id ? `#${ el.id }` : void 0
                }, el.childNodes)]))));
        },
        {
            '../../../combinator': 30,
            '../../inline': 81,
            '../../util': 127,
            './indexee': 100,
            'typed-dom': 23
        }
    ],
    100: [
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
                for (const el of target.querySelectorAll('code[data-src], .math[data-src]')) {
                    void typed_dom_1.define(el, el.getAttribute('data-src'));
                }
                for (const el of target.querySelectorAll('rt, rp, .annotation, .reference')) {
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
            '../../../combinator': 30,
            'typed-dom': 23
        }
    ],
    101: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.indexer = void 0;
            const combinator_1 = _dereq_('../../../combinator');
            const index_1 = _dereq_('./index');
            const source_1 = _dereq_('../../source');
            const typed_dom_1 = _dereq_('typed-dom');
            const array_1 = _dereq_('spica/array');
            exports.indexer = combinator_1.surround(source_1.str(/^\s+(?=\[#[^\s\]])/), combinator_1.union([index_1.index]), /^\s*$/, false, ([, [el]], rest) => [
                [typed_dom_1.html('span', {
                        class: 'indexer',
                        'data-index': el.getAttribute('href').slice(el.hash.indexOf(':') + 1)
                    })],
                rest
            ], ([as, bs], rest) => [
                array_1.unshift(as, bs),
                rest
            ]);
        },
        {
            '../../../combinator': 30,
            '../../source': 119,
            './index': 99,
            'spica/array': 6,
            'typed-dom': 23
        }
    ],
    102: [
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
            '../../../combinator': 30,
            '../../source': 119,
            'spica/array': 6,
            'typed-dom': 23
        }
    ],
    103: [
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
            ], combinator_1.surround(source_1.str(/^\[[:^]/), combinator_1.some(combinator_1.union([inline_1.inline]), ']'), source_1.char(']'), false, ([as, bs, cs], rest) => [
                util_1.isTight(bs, 0, bs.length) ? [typed_dom_1.html('span', {
                        class: 'invalid',
                        'data-invalid-syntax': 'extension',
                        'data-invalid-message': 'Invalid flag'
                    }, util_1.defrag(util_1.trimEnd(bs)))] : array_1.push(array_1.unshift(as, bs), cs),
                rest
            ], ([as, bs], rest) => [
                array_1.unshift(as, bs),
                rest
            ]))));
        },
        {
            '../../../combinator': 30,
            '../../inline': 81,
            '../../source': 119,
            '../../util': 127,
            'spica/array': 6,
            'typed-dom': 23
        }
    ],
    104: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.makeAttrs = exports.attribute = exports.html = void 0;
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
                combinator_1.match(/^(?=<(sup|sub|small|bdo|bdi)(?=[ >]))/, combinator_1.memoize(([, tag]) => tag, tag => combinator_1.surround(combinator_1.surround(source_1.str(`<${ tag }`), combinator_1.some(exports.attribute), source_1.str('>'), true), util_1.startTight(combinator_1.context((() => {
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
                ] : void 0))),
                combinator_1.match(/^(?=<([a-z]+)(?=[ >]))/, ([, tag]) => combinator_1.surround(combinator_1.surround(source_1.str(`<${ tag }`), combinator_1.some(exports.attribute), source_1.str('>'), true), util_1.startTight(combinator_1.some(combinator_1.union([inline_1.inline]), `</${ tag }>`)), source_1.str(`</${ tag }>`), false, ([as, bs, cs], rest) => util_1.isTight(bs, 0, bs.length) ? [
                    [elem(tag, as, util_1.trimEnd(bs), cs, {})],
                    rest
                ] : void 0))
            ]))));
            exports.attribute = combinator_1.creator(combinator_1.union([source_1.str(/^ [a-z]+(?:-[a-z]+)*(?:="(?:\\[^\n]|[^\n"])*")?(?=[ >])/)]));
            function elem(tag, as, bs, cs, context) {
                var _a, _b, _c, _d, _e, _f, _g, _h;
                let attrs;
                if (!tags.includes(tag)) {
                    return invalid('Invalid HTML tag', as, bs, cs);
                }
                switch (tag) {
                case 'bdo':
                case 'bdi':
                    switch (true) {
                    case (_b = (_a = context.state) === null || _a === void 0 ? void 0 : _a.in) === null || _b === void 0 ? void 0 : _b.bdx:
                        return invalid('Nested HTML tag', as, bs, cs);
                    }
                    break;
                case 'sup':
                case 'sub':
                    switch (true) {
                    case (_d = (_c = context.state) === null || _c === void 0 ? void 0 : _c.in) === null || _d === void 0 ? void 0 : _d.supsub:
                        return invalid('Nested HTML tag', as, bs, cs);
                    }
                    break;
                case 'small':
                    switch (true) {
                    case (_f = (_e = context.state) === null || _e === void 0 ? void 0 : _e.in) === null || _f === void 0 ? void 0 : _f.supsub:
                    case (_h = (_g = context.state) === null || _g === void 0 ? void 0 : _g.in) === null || _h === void 0 ? void 0 : _h.small:
                        return invalid('Nested HTML tag', as, bs, cs);
                    }
                    break;
                }
                switch (true) {
                case util_1.stringify(as[as.length - 1]) !== '>' || 'data-invalid-syntax' in (attrs = makeAttrs(attributes[tag], as.slice(1, -1).map(util_1.stringify), [], 'html')):
                    return invalid('Invalid HTML attribute', as, bs, cs);
                case cs.length === 0:
                    return invalid('Unclosed HTML tag', as, bs, cs);
                default:
                    return typed_dom_1.html(tag, attrs, util_1.defrag(bs));
                }
            }
            function invalid(message, as, bs, cs) {
                return typed_dom_1.html('span', {
                    class: 'invalid',
                    'data-invalid-syntax': 'html',
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
                    attrs['data-invalid-message'] = syntax === 'html' ? 'Invalid attribute' : 'Invalid parameter';
                }
                return attrs;
            }
            exports.makeAttrs = makeAttrs;
        },
        {
            '../../combinator': 30,
            '../inline': 81,
            '../source': 119,
            '../util': 127,
            'spica/alias': 5,
            'spica/array': 6,
            'spica/memoize': 13,
            'typed-dom': 23
        }
    ],
    105: [
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
            '../../combinator': 30,
            'typed-dom': 23
        }
    ],
    106: [
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
            exports.insertion = combinator_1.lazy(() => combinator_1.creator(combinator_1.surround(source_1.str('++'), combinator_1.union([combinator_1.some(inline_1.inline, '++')]), source_1.str('++'), false, ([as, bs, cs], rest) => util_1.isTight(bs, 0, bs.length) ? [
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
            '../../combinator': 30,
            '../inline': 81,
            '../source': 119,
            '../util': 127,
            'spica/array': 6,
            'typed-dom': 23
        }
    ],
    107: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.attribute = exports.uri = exports.link = exports.attributes = void 0;
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
            const log = new WeakSet();
            exports.attributes = { nofollow: [void 0] };
            void alias_1.ObjectSetPrototypeOf(exports.attributes, null);
            exports.link = combinator_1.lazy(() => combinator_1.creator(combinator_1.subline(combinator_1.validate([
                '[',
                '{'
            ], combinator_1.bind(combinator_1.fmap(combinator_1.guard(context => {
                var _a, _b, _c;
                return (_c = (_b = (_a = context.syntax) === null || _a === void 0 ? void 0 : _a.inline) === null || _b === void 0 ? void 0 : _b.link) !== null && _c !== void 0 ? _c : true;
            }, combinator_1.tails([
                util_1.dup(combinator_1.union([
                    combinator_1.surround('[', inline_1.media, ']'),
                    combinator_1.surround('[', inline_1.shortmedia, ']'),
                    combinator_1.surround('[', combinator_1.context({
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
                    }, util_1.startTight(combinator_1.some(inline_1.inline, /^\\?\n|^]/))), ']', true)
                ])),
                util_1.dup(combinator_1.surround(/^{(?![{}])/, combinator_1.inits([
                    exports.uri,
                    combinator_1.some(exports.attribute)
                ]), /^ ?}/))
            ])), nss => nss.length === 1 ? [
                [],
                nss[0]
            ] : nss), ([content, params], rest, context) => {
                var _a;
                if (!util_1.isTight(content, 0, content.length))
                    return;
                switch (true) {
                case content.length === 0:
                    break;
                case content.length === 1 && typeof content[0] === 'object' && content[0].tagName === 'A' && ((_a = content[0].firstElementChild) === null || _a === void 0 ? void 0 : _a.classList.contains('media')) && !log.has(content[0].firstElementChild):
                    content[0] = content[0].firstElementChild;
                    log.add(content[0]);
                    break;
                case !context.insecure && !!combinator_1.eval(combinator_1.some(autolink_1.autolink)(util_1.stringify(content), Object.assign(Object.assign({}, context), { insecure: true }))).some(node => typeof node === 'object'):
                    return;
                }
                const INSECURE_URI = params.shift();
                const el = typed_dom_1.html('a', {
                    href: INSECURE_URI,
                    rel: `noopener${ params.includes(' nofollow') ? ' nofollow noreferrer' : '' }`
                }, content.length > 0 ? content = util_1.defrag(util_1.trimEnd(content)) : decode(INSECURE_URI || '.').replace(/^h(?=ttps?:\/\/[^/?#\s])/, params.includes(' nofollow') ? '' : 'h').replace(/^tel:/, ''));
                if (!sanitize(el, INSECURE_URI))
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
            exports.uri = combinator_1.creator(combinator_1.match(/^ ?(?! )/, combinator_1.memoize(([delim]) => delim, delim => combinator_1.union([source_1.str(delim ? /^\S+/ : /^[^\s{}]+/)]))));
            exports.attribute = combinator_1.creator(combinator_1.union([source_1.str(/^ [a-z]+(?:-[a-z]+)*(?:="(?:\\[^\n]|[^\n"])*")?(?=[ }])/)]));
            function sanitize(el, uri) {
                let message;
                switch (el.protocol) {
                case 'http:':
                case 'https:': {
                        const {host} = el;
                        host && el.origin !== origin && void el.setAttribute('target', '_blank');
                        if (host)
                            return true;
                        message = 'Invalid host';
                        break;
                    }
                case 'tel:':
                    if (`tel:${ el.textContent.replace(/-(?=[0-9])/g, '') }` === uri)
                        return true;
                    message = 'Invalid phone number';
                    break;
                default:
                    message = 'Invalid protocol';
                }
                void typed_dom_1.define(el, {
                    class: 'invalid',
                    'data-invalid-syntax': 'link',
                    'data-invalid-message': message,
                    href: null,
                    rel: null
                });
                return false;
            }
            function decode(uri) {
                try {
                    uri = global_1.decodeURI(uri);
                } finally {
                    return uri.replace(/\s+/g, global_1.encodeURI);
                }
            }
        },
        {
            '../../combinator': 30,
            '../autolink': 60,
            '../inline': 81,
            '../source': 119,
            '../util': 127,
            './html': 104,
            'spica/alias': 5,
            'spica/global': 12,
            'typed-dom': 23
        }
    ],
    108: [
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
            exports.mark = combinator_1.lazy(() => combinator_1.creator(combinator_1.surround(source_1.str('=='), combinator_1.union([combinator_1.some(inline_1.inline, '==')]), source_1.str('=='), false, ([as, bs, cs], rest) => util_1.isTight(bs, 0, bs.length) ? [
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
            '../../combinator': 30,
            '../inline': 81,
            '../source': 119,
            '../util': 127,
            'spica/array': 6,
            'typed-dom': 23
        }
    ],
    109: [
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
            '../../combinator': 30,
            '../source': 119,
            'spica/cache': 8,
            'typed-dom': 23
        }
    ],
    110: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.media = exports.cache = void 0;
            const global_1 = _dereq_('spica/global');
            const alias_1 = _dereq_('spica/alias');
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
                var _a, _b, _c, _d, _e, _f;
                return ((_c = (_b = (_a = context.syntax) === null || _a === void 0 ? void 0 : _a.inline) === null || _b === void 0 ? void 0 : _b.link) !== null && _c !== void 0 ? _c : true) && ((_f = (_e = (_d = context.syntax) === null || _d === void 0 ? void 0 : _d.inline) === null || _e === void 0 ? void 0 : _e.media) !== null && _f !== void 0 ? _f : true);
            }, combinator_1.tails([
                util_1.dup(combinator_1.surround(/^\[(?!\s)/, combinator_1.some(combinator_1.union([
                    bracket,
                    combinator_1.some(source_1.text, /^(?:\\?\n|[\]([{<"])/)
                ]), ']'), ']', true)),
                util_1.dup(combinator_1.surround(/^{(?![{}])/, combinator_1.inits([
                    link_1.uri,
                    combinator_1.some(link_1.attribute)
                ]), /^ ?}/))
            ]))), sss => array_1.unshift([sss.length > 1 ? array_1.join(sss[0]) : ''], sss[sss.length - 1])), (params, rest, context) => {
                var _a;
                const [text, INSECURE_URL] = array_1.shift(params, 2)[0];
                if (text.length > 0 && text.slice(-2).trim() === '')
                    return;
                url.href = INSECURE_URL;
                const media = void 0 || ((_a = exports.cache.get(url.href)) === null || _a === void 0 ? void 0 : _a.cloneNode(true)) || typed_dom_1.html('img', {
                    class: 'media',
                    'data-src': INSECURE_URL.replace(/\s+/g, global_1.encodeURI),
                    alt: text.trim()
                });
                if (exports.cache.has(url.href) && media.hasAttribute('alt')) {
                    void typed_dom_1.define(media, { alt: text.trim() });
                }
                void typed_dom_1.define(media, alias_1.ObjectAssign(html_1.makeAttrs(link_1.attributes, params, [...media.classList], 'media'), { nofollow: void 0 }));
                return combinator_1.fmap(link_1.link, ([el]) => [typed_dom_1.define(el, { target: '_blank' }, [typed_dom_1.define(media, { 'data-src': el.getAttribute('href') })])])(`{ ${ INSECURE_URL }${ array_1.join(params) } }${ rest }`, context);
            }))));
            const bracket = combinator_1.lazy(() => combinator_1.union([
                combinator_1.surround(source_1.char('('), combinator_1.some(combinator_1.union([
                    bracket,
                    source_1.str(/^(?:\\[^\n]?|[^\n\)([{<"\\])+/)
                ])), source_1.char(')'), true, void 0, ([as, bs = []], rest) => [
                    array_1.unshift(as, bs),
                    rest
                ]),
                combinator_1.surround(source_1.char('['), combinator_1.some(combinator_1.union([
                    bracket,
                    source_1.str(/^(?:\\[^\n]?|[^\n\]([{<"\\])+/)
                ])), source_1.char(']'), true, void 0, ([as, bs = []], rest) => [
                    array_1.unshift(as, bs),
                    rest
                ]),
                combinator_1.surround(source_1.char('{'), combinator_1.some(combinator_1.union([
                    bracket,
                    source_1.str(/^(?:\\[^\n]?|[^\n\}([{<"\\])+/)
                ])), source_1.char('}'), true, void 0, ([as, bs = []], rest) => [
                    array_1.unshift(as, bs),
                    rest
                ]),
                combinator_1.surround(source_1.char('<'), combinator_1.some(combinator_1.union([
                    bracket,
                    source_1.str(/^(?:\\[^\n]?|[^\n\>([{<"\\])+/)
                ])), source_1.char('>'), true, void 0, ([as, bs = []], rest) => [
                    array_1.unshift(as, bs),
                    rest
                ]),
                combinator_1.surround(source_1.char('"'), source_1.str(/^(?:\\[^\n]?|[^\n([{<"\\])+/), source_1.char('"'), true, void 0, ([as, bs = []], rest) => [
                    array_1.unshift(as, bs),
                    rest
                ])
            ]));
        },
        {
            '../../combinator': 30,
            '../source': 119,
            '../util': 127,
            './html': 104,
            './link': 107,
            'spica/alias': 5,
            'spica/array': 6,
            'spica/cache': 8,
            'spica/global': 12,
            'typed-dom': 23
        }
    ],
    111: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.reference = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const util_1 = _dereq_('../util');
            const inline_1 = _dereq_('../inline');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.reference = combinator_1.lazy(() => combinator_1.creator(combinator_1.subline(combinator_1.bind(combinator_1.surround('[[', combinator_1.guard(context => {
                var _a, _b, _c;
                return (_c = (_b = (_a = context.syntax) === null || _a === void 0 ? void 0 : _a.inline) === null || _b === void 0 ? void 0 : _b.reference) !== null && _c !== void 0 ? _c : true;
            }, combinator_1.context({
                syntax: {
                    inline: {
                        annotation: false,
                        reference: false,
                        extension: false,
                        media: false
                    }
                },
                state: void 0
            }, combinator_1.subsequence([
                alias,
                util_1.startTight(combinator_1.some(inline_1.inline, ']]'))
            ]))), ']]'), (ns, rest) => util_1.isTight(ns, typeof ns[0] === 'object' && ns[0].tagName === 'ABBR' ? 1 : 0, ns.length) ? combinator_1.Result(typed_dom_1.html('sup', {
                class: 'reference',
                'data-alias': typeof ns[0] === 'object' && ns[0].tagName === 'ABBR' ? util_1.stringify(ns.shift()) : void 0
            }, util_1.defrag(util_1.trimEnd(ns))), rest) : void 0))));
            const alias = combinator_1.creator(combinator_1.focus(/^~[A-za-z][A-Za-z0-9',-]*(?: [A-Za-z0-9',-]+)*(?:(?=]])|\|(?:(?=]])| ))/, source => [
                [typed_dom_1.html('abbr', source.slice(1, ~(~source.lastIndexOf('|') || ~source.length)))],
                ''
            ]));
        },
        {
            '../../combinator': 30,
            '../inline': 81,
            '../util': 127,
            'typed-dom': 23
        }
    ],
    112: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.ruby = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const util_1 = _dereq_('../util');
            const htmlentity_1 = _dereq_('./htmlentity');
            const source_1 = _dereq_('../source');
            const typed_dom_1 = _dereq_('typed-dom');
            const array_1 = _dereq_('spica/array');
            exports.ruby = combinator_1.creator(combinator_1.bind(combinator_1.sequence([
                combinator_1.surround('[', source_1.str(/^(?!\\?\s)(?:\\[^\n]|[^\]\n])+/), ']'),
                combinator_1.surround('(', source_1.str(/^(?:\\[^\n]|[^\)\n])+/), ')')
            ]), ([t, r], rest, context) => {
                const texts = parse(t, context);
                const rubies = parse(r, context);
                if (!array_1.join(texts).trim() || !array_1.join(rubies).trim())
                    return;
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
                        [typed_dom_1.html('ruby', util_1.defrag(array_1.unshift([array_1.join(texts, ' ')], rubies.length === 0 ? [] : [
                                typed_dom_1.html('rp', '('),
                                typed_dom_1.html('rt', array_1.join(rubies, ' ')),
                                typed_dom_1.html('rp', ')')
                            ])))],
                        rest
                    ];
                }
            }));
            function parse(target, context) {
                const acc = [''];
                for (let i = 0; i < target.length; ++i) {
                    switch (target[i].trim()) {
                    case '':
                        void acc.push('');
                        continue;
                    case '\\':
                        acc[acc.length - 1] += target[++i];
                        continue;
                    case '&': {
                            const [[data = '&'] = [], rest = target.slice(i + data.length)] = htmlentity_1.htmlentity(target.slice(i), context) || [];
                            acc[acc.length - 1] += data;
                            i = target.length - rest.length - 1;
                            continue;
                        }
                    default:
                        acc[acc.length - 1] += target[i];
                        continue;
                    }
                }
                return acc;
            }
        },
        {
            '../../combinator': 30,
            '../source': 119,
            '../util': 127,
            './htmlentity': 105,
            'spica/array': 6,
            'typed-dom': 23
        }
    ],
    113: [
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
            }, combinator_1.open('!', url_1.url)), combinator_1.convert(source => `!{ ${ url_1.address(source.slice(1)) }${ url_1.attribute(source.slice(1)) } }`, combinator_1.union([media_1.media])));
        },
        {
            '../../combinator': 30,
            './autolink/url': 89,
            './media': 110
        }
    ],
    114: [
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
            exports.strong = combinator_1.lazy(() => combinator_1.creator(combinator_1.surround(source_1.str('**'), combinator_1.some(combinator_1.union([
                emphasis_1.emphasis,
                combinator_1.some(inline_1.inline, '*')
            ]), '**'), source_1.str('**'), false, ([as, bs, cs], rest) => util_1.isTight(bs, 0, bs.length) ? [
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
            '../../combinator': 30,
            '../inline': 81,
            '../source': 119,
            '../util': 127,
            './emphasis': 94,
            'spica/array': 6,
            'typed-dom': 23
        }
    ],
    115: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.template = void 0;
            const inline_1 = _dereq_('../inline');
            const combinator_1 = _dereq_('../../combinator');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.template = combinator_1.lazy(() => combinator_1.creator(combinator_1.rewrite(combinator_1.surround('{{', combinator_1.some(inline_1.inline, '}}'), '}}', true), source => [
                [typed_dom_1.html('span', { class: 'template' }, source)],
                ''
            ])));
        },
        {
            '../../combinator': 30,
            '../inline': 81,
            'typed-dom': 23
        }
    ],
    116: [
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
                const char = endingChar(el.previousSibling);
                if (!char)
                    return false;
                return ja_1.japanese(char);
            }
            function endingChar(node) {
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
            '../combinator': 30,
            './locale/ja': 117,
            'typed-dom': 23
        }
    ],
    117: [
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
    118: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.segment = void 0;
            const combinator_1 = _dereq_('../combinator');
            const codeblock_1 = _dereq_('./block/codeblock');
            const mathblock_1 = _dereq_('./block/mathblock');
            const extension_1 = _dereq_('./block/extension');
            const source_1 = _dereq_('./source');
            const normalize_1 = _dereq_('./api/normalize');
            const parser = combinator_1.union([
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
                    const rest = combinator_1.exec(parser(source, {}));
                    void segments.push(source.length - rest.length > 10 * 1000 ? '# ***Too large block over 10,000 characters***' : source.slice(0, source.length - rest.length));
                    source = rest;
                }
                return segments;
            }
            exports.segment = segment;
        },
        {
            '../combinator': 30,
            './api/normalize': 58,
            './block/codeblock': 63,
            './block/extension': 65,
            './block/mathblock': 73,
            './source': 119
        }
    ],
    119: [
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
            './source/char': 120,
            './source/escapable': 121,
            './source/line': 122,
            './source/linebreak': 123,
            './source/str': 124,
            './source/text': 125,
            './source/unescapable': 126
        }
    ],
    120: [
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
        { '../../combinator': 30 }
    ],
    121: [
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
        { '../../combinator': 30 }
    ],
    122: [
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
        { '../../combinator': 30 }
    ],
    123: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.linebreak = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const text_1 = _dereq_('./text');
            exports.linebreak = combinator_1.fmap(combinator_1.focus('\n', combinator_1.union([text_1.text])), ns => ns);
        },
        {
            '../../combinator': 30,
            './text': 125
        }
    ],
    124: [
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
        { '../../combinator': 30 }
    ],
    125: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.text = exports.separator = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const str_1 = _dereq_('./str');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.separator = /\s|(?=[^A-Za-z0-9\s])[\x00-\x7F]|[A-Za-z0-9][A-Za-z0-9.+_-]*@[A-Za-z0-9]|\S#/;
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
                        return source[1] === source[0] ? repeat(source, {}) : [
                            [source[0]],
                            source.slice(1)
                        ];
                    default:
                        const i = source[0].trim() === '' ? source.search(next) : 0;
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
            '../../combinator': 30,
            './str': 124,
            'typed-dom': 23
        }
    ],
    126: [
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
            '../../combinator': 30,
            './text': 125
        }
    ],
    127: [
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
                case isVisible(nodes[start], 'start'):
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
                    var _a;
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
                        case source.length > 2 && source[1] !== ' ' && !!inline_1.htmlentity(source, context):
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
                    return ((_a = source[0] === '\\' ? source[1] : source[0]) === null || _a === void 0 ? void 0 : _a.trim()) ? parser(source, context) : void 0;
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
                for (let i = 0, {children} = target, len = children.length; i < len; ++i) {
                    const child = children[i];
                    switch (child.tagName) {
                    case 'DL':
                        void typed_dom_1.apply(child, 'dt', { id: null });
                        continue;
                    default:
                        child.id && void typed_dom_1.define(child, { id: null });
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
            '../combinator': 30,
            './inline': 81,
            'spica/alias': 5,
            'spica/array': 6,
            'typed-dom': 23
        }
    ],
    128: [
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
        { './renderer/render': 129 }
    ],
    129: [
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
                opts = Object.assign({
                    code: code_1.code,
                    math: math_1.math,
                    media: {}
                }, opts);
                try {
                    switch (true) {
                    case target.matches('.invalid'):
                        return;
                    case !!opts.code && target.matches('pre.code') && target.children.length === 0:
                        return void opts.code(target);
                    case !!opts.math && target.matches('.math') && target.children.length === 0:
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
                        for (const el of target.querySelectorAll('img.media:not([src])[data-src], a > .media:not(img), pre.code, .math')) {
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
            './render/code': 130,
            './render/math': 131,
            './render/media': 132,
            'spica/global': 12,
            'spica/url': 20
        }
    ],
    130: [
        function (_dereq_, module, exports) {
            (function (global) {
                'use strict';
                Object.defineProperty(exports, '__esModule', { value: true });
                exports.code = void 0;
                const Prism = typeof window !== 'undefined' ? window['Prism'] : typeof global !== 'undefined' ? global['Prism'] : null;
                function code(target) {
                    void requestAnimationFrame(() => void Prism.highlightElement(target, false));
                }
                exports.code = code;
            }.call(this, typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {}));
        },
        {}
    ],
    131: [
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
            '../../parser/inline/math': 109,
            'typed-dom': 23
        }
    ],
    132: [
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
                opts = Object.assign({
                    twitter: twitter_1.twitter,
                    youtube: youtube_1.youtube,
                    gist: gist_1.gist,
                    slideshare: slideshare_1.slideshare,
                    pdf: pdf_1.pdf,
                    video: video_1.video,
                    audio: audio_1.audio,
                    image: image_1.image
                }, opts);
                const url = new URL(target.getAttribute('data-src'), origin);
                const alt = target.getAttribute('alt') || '';
                (_a = opts.video) === null || _a === void 0 ? void 0 : _a.call(opts, url, alt);
                return ((_b = opts.twitter) === null || _b === void 0 ? void 0 : _b.call(opts, url)) || ((_c = opts.youtube) === null || _c === void 0 ? void 0 : _c.call(opts, url)) || ((_d = opts.gist) === null || _d === void 0 ? void 0 : _d.call(opts, url)) || ((_e = opts.slideshare) === null || _e === void 0 ? void 0 : _e.call(opts, url)) || ((_f = opts.pdf) === null || _f === void 0 ? void 0 : _f.call(opts, url)) || ((_g = opts.video) === null || _g === void 0 ? void 0 : _g.call(opts, url, alt)) || ((_h = opts.audio) === null || _h === void 0 ? void 0 : _h.call(opts, url, alt)) || ((_j = opts.image) === null || _j === void 0 ? void 0 : _j.call(opts, url, alt));
            }
            exports.media = media;
        },
        {
            './media/audio': 133,
            './media/gist': 134,
            './media/image': 135,
            './media/pdf': 136,
            './media/slideshare': 137,
            './media/twitter': 138,
            './media/video': 139,
            './media/youtube': 140,
            'spica/global': 12
        }
    ],
    133: [
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
            '../../../parser/inline/media': 110,
            'typed-dom': 23
        }
    ],
    134: [
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
            '../../../parser': 54,
            '../../../parser/inline/media': 110,
            'spica/global': 12,
            'typed-dom': 23
        }
    ],
    135: [
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
            '../../../parser/inline/media': 110,
            'typed-dom': 23
        }
    ],
    136: [
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
            '../../../parser': 54,
            '../../../parser/inline/media': 110,
            'typed-dom': 23
        }
    ],
    137: [
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
            '../../../parser': 54,
            '../../../parser/inline/media': 110,
            'typed-dom': 23
        }
    ],
    138: [
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
            '../../../parser': 54,
            'spica/cache': 8,
            'spica/global': 12,
            'typed-dom': 23
        }
    ],
    139: [
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
            '../../../parser/inline/media': 110,
            'typed-dom': 23
        }
    ],
    140: [
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
            '../../../parser/inline/media': 110,
            'typed-dom': 23
        }
    ],
    141: [
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
            './util/context': 142,
            './util/info': 145,
            './util/toc': 146
        }
    ],
    142: [
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
                    return memory.has(node) ? memory.get(node) : memory.set(node, el.closest(bound) === context).get(node);
                };
            }
            exports.context = context;
        },
        {}
    ],
    143: [
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
                    ...(footnotes === null || footnotes === void 0 ? void 0 : footnotes.annotation.querySelectorAll('a.label')) || []
                ].filter(context_1.context(target)).map(el => [
                    el.getAttribute('data-label'),
                    el
                ]));
                const numbers = new Map();
                let base = '0';
                let bases = base.split('.');
                for (let i = 0, {children} = target, len = children.length; i < len; ++i) {
                    const def = children[i];
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
                    const figindex = group === '$' ? `(${ number })` : `${ capitalize(group) }. ${ number }`;
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
            '../parser/inline': 81,
            '../parser/inline/extension/label': 102,
            './context': 142,
            'spica/array': 6,
            'spica/global': 12,
            'spica/multimap': 14,
            'typed-dom': 23
        }
    ],
    144: [
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
                    for (const ref of target.querySelectorAll(`.${ syntax }`)) {
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
                        const def = defs.has(identifier) ? defs.get(identifier) : defs.set(identifier, typed_dom_1.html('li', {
                            id: `${ syntax }:def:${ defs.size + 1 }`,
                            class: 'footnote'
                        }, [
                            content.cloneNode(true),
                            typed_dom_1.html('sup', [])
                        ])).get(identifier);
                        if (title && def.childNodes.length === 1 && content.childNodes.length > 0) {
                            void def.insertBefore(content.cloneNode(true), def.lastChild);
                            for (const ref of refs.take(identifier, global_1.Infinity)) {
                                void ref.classList.remove('invalid');
                                void typed_dom_1.define(ref, {
                                    title,
                                    'data-invalid-syntax': null,
                                    'data-invalid-message': null
                                });
                            }
                        }
                        const defIndex = +def.id.slice(def.id.lastIndexOf(':') + 1);
                        const defId = def.id;
                        const refChild = ref.firstChild;
                        yield typed_dom_1.define(ref, Object.assign({ id: refId }, title ? { title } : {
                            class: ref.classList.contains('invalid') ? void 0 : array_1.join([
                                ...ref.classList,
                                'invalid'
                            ], ' '),
                            'data-invalid-syntax': syntax,
                            'data-invalid-message': 'Missing a content'
                        }), ((_a = refChild === null || refChild === void 0 ? void 0 : refChild.getAttribute('href')) === null || _a === void 0 ? void 0 : _a.slice(1)) === defId && refChild.textContent === marker(defIndex) ? void 0 : [typed_dom_1.html('a', {
                                href: `#${ defId }`,
                                rel: 'noopener'
                            }, marker(defIndex))]).firstChild;
                        void def.lastChild.appendChild(typed_dom_1.html('a', {
                            href: `#${ refId }`,
                            rel: 'noopener',
                            title: content.childNodes.length > 0 && ref.hasAttribute('data-alias') ? title : void 0
                        }, ` ~${ refIndex }`));
                    }
                    count = 0;
                    const {children} = footnote;
                    I:
                        for (const def of defs.values()) {
                            void ++count;
                            while (children.length > defs.size) {
                                if (equal(children[count - 1], def))
                                    continue I;
                                yield footnote.removeChild(children[count - 1]);
                            }
                            if (children.length >= count && equal(children[count - 1], def))
                                continue;
                            yield footnote.insertBefore(def, children[count - 1] || null);
                        }
                    while (children.length > defs.size) {
                        yield footnote.removeChild(children[defs.size]);
                    }
                    return;
                };
            }
            function equal(a, b) {
                return a.id === b.id && a.innerHTML === b.innerHTML;
            }
        },
        {
            '../parser/inline/extension/indexee': 100,
            './context': 142,
            'spica/array': 6,
            'spica/global': 12,
            'spica/memoize': 13,
            'spica/multimap': 14,
            'typed-dom': 23
        }
    ],
    145: [
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
        { './context': 142 }
    ],
    146: [
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
            'typed-dom': 23
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
                    if (!exports.hasOwnProperty(p))
                        __createBinding(exports, m, p);
            };
            Object.defineProperty(exports, '__esModule', { value: true });
            _dereq_('spica/global');
            __exportStar(_dereq_('./src/parser'), exports);
            __exportStar(_dereq_('./src/util'), exports);
            __exportStar(_dereq_('./src/renderer'), exports);
        },
        {
            './src/parser': 54,
            './src/renderer': 128,
            './src/util': 141,
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