/*! securemark v0.146.2 https://github.com/falsandtru/securemark | (c) 2017, falsandtru | UNLICENSED */
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
        },
        {}
    ],
    7: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const global_1 = _dereq_('./global');
            const alias_1 = _dereq_('./alias');
            const type_1 = _dereq_('./type');
            const concat_1 = _dereq_('./concat');
            exports.assign = template((prop, target, source) => target[prop] = source[prop]);
            exports.clone = template((prop, target, source) => {
                switch (type_1.type(source[prop])) {
                case 'Array':
                    return target[prop] = exports.clone([], source[prop]);
                case 'Object':
                    switch (type_1.type(target[prop])) {
                    case 'Object':
                        return target[prop] = exports.clone(source[prop] instanceof global_1.Object ? {} : alias_1.ObjectCreate(null), source[prop]);
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
                    return target[prop] = exports.extend([], source[prop]);
                case 'Object':
                    switch (type_1.type(target[prop])) {
                    case 'Object':
                        return target[prop] = exports.extend(target[prop], source[prop]);
                    default:
                        return target[prop] = exports.extend(source[prop] instanceof global_1.Object ? {} : alias_1.ObjectCreate(null), source[prop]);
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
                        return target[prop] = concat_1.concat(target[prop], source[prop]);
                    default:
                        return target[prop] = exports.merge([], source[prop]);
                    }
                case 'Object':
                    switch (type_1.type(target[prop])) {
                    case 'Object':
                        return target[prop] = exports.merge(target[prop], source[prop]);
                    default:
                        return target[prop] = exports.merge(source[prop] instanceof global_1.Object ? {} : alias_1.ObjectCreate(null), source[prop]);
                    }
                default:
                    return target[prop] = source[prop];
                }
            });
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
                            for (const prop in source) {
                                if (!alias_1.hasOwnProperty(source, prop))
                                    continue;
                                void strategy(prop, target, source);
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
            './concat': 10,
            './global': 13,
            './type': 19
        }
    ],
    8: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const global_1 = _dereq_('./global');
            const assign_1 = _dereq_('./assign');
            const concat_1 = _dereq_('./concat');
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
                    for (const k of concat_1.concat(stats[1].slice(LFU.length), stats[0].slice(LRU.length))) {
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
            './concat': 10,
            './global': 13
        }
    ],
    9: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
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
        { '../global': 13 }
    ],
    10: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const alias_1 = _dereq_('./alias');
            function concat(target, source) {
                if (alias_1.isArray(source)) {
                    for (let i = 0; i < source.length; ++i) {
                        void target.push(source[i]);
                    }
                } else {
                    void target.push(...source);
                }
                return target;
            }
            exports.concat = concat;
        },
        { './alias': 5 }
    ],
    11: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
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
    12: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const curry_1 = _dereq_('./curry');
            function flip(f) {
                return curry_1.curry((b, a) => f.length > 1 ? f(a, b) : f(a)(b));
            }
            exports.flip = flip;
        },
        { './curry': 11 }
    ],
    13: [
        function (_dereq_, module, exports) {
            'use strict';
            const global = void 0 || typeof globalThis !== 'undefined' && globalThis || typeof self !== 'undefined' && self || Function('return this')();
            global.global = global;
            module.exports = global.global;
        },
        {}
    ],
    14: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            function memoize(f, memory = new Map()) {
                return a => memory.has(a) ? memory.get(a) : void memory.set(a, f(a)) || memory.get(a);
            }
            exports.memoize = memoize;
        },
        {}
    ],
    15: [
        function (_dereq_, module, exports) {
            'use strict';
            function __export(m) {
                for (var p in m)
                    if (!exports.hasOwnProperty(p))
                        exports[p] = m[p];
            }
            Object.defineProperty(exports, '__esModule', { value: true });
            __export(_dereq_('./collection/multimap'));
        },
        { './collection/multimap': 9 }
    ],
    16: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            function noop() {
                return;
            }
            exports.noop = noop;
        },
        {}
    ],
    17: [
        function (_dereq_, module, exports) {
            'use strict';
            var _a;
            Object.defineProperty(exports, '__esModule', { value: true });
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
        { './global': 13 }
    ],
    18: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
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
    19: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
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
    20: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.uncurry = f => (...args) => args.reduce((f, arg) => f(arg), f);
        },
        {}
    ],
    21: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const global_1 = _dereq_('./global');
            const format_1 = _dereq_('./url/domain/format');
            var format_2 = _dereq_('./url/domain/format');
            exports.standardize = format_2.standardize;
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
                    return this.query_ = this.query_ === void 0 ? this.reference.slice((this.reference.slice(0, -this.fragment.length || this.reference.length).indexOf('?') + 1 || this.reference.length + 1) - 1, -this.fragment.length || this.reference.length) : this.query_;
                }
                get fragment() {
                    return this.fragment_ = this.fragment_ === void 0 ? this.reference.slice((this.reference.indexOf('#') + 1 || this.reference.length + 1) - 1) : this.fragment_;
                }
            }
            exports.URL = URL;
        },
        {
            './global': 13,
            './url/domain/format': 22
        }
    ],
    22: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
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
            function formatURLForEdge(url, base = global_1.location.href) {
                return url.trim() || base;
            }
        },
        {
            '../../cache': 8,
            '../../flip': 12,
            '../../global': 13,
            '../../memoize': 14,
            '../../uncurry': 20
        }
    ],
    23: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
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
    24: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            _dereq_('spica/global');
            var builder_1 = _dereq_('./src/dom/builder');
            exports.Shadow = builder_1.Shadow;
            exports.HTML = builder_1.HTML;
            exports.SVG = builder_1.SVG;
            exports.API = builder_1.API;
            var proxy_1 = _dereq_('./src/dom/proxy');
            exports.proxy = proxy_1.proxy;
            var dom_1 = _dereq_('./src/util/dom');
            exports.frag = dom_1.frag;
            exports.shadow = dom_1.shadow;
            exports.html = dom_1.html;
            exports.svg = dom_1.svg;
            exports.text = dom_1.text;
            exports.element = dom_1.element;
            exports.define = dom_1.define;
            var listener_1 = _dereq_('./src/util/listener');
            exports.listen = listener_1.listen;
            exports.once = listener_1.once;
            exports.wait = listener_1.wait;
            exports.delegate = listener_1.delegate;
            exports.bind = listener_1.bind;
            exports.currentTarget = listener_1.currentTarget;
            var query_1 = _dereq_('./src/util/query');
            exports.apply = query_1.apply;
        },
        {
            './src/dom/builder': 25,
            './src/dom/proxy': 27,
            './src/util/dom': 28,
            './src/util/listener': 29,
            './src/util/query': 30,
            'spica/global': 13
        }
    ],
    25: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
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
                                for (const k in attrs) {
                                    if (!alias_1.hasOwnProperty(attrs, k))
                                        continue;
                                    const v = attrs[k];
                                    if (typeof v !== 'function')
                                        continue;
                                    void el.removeEventListener(k, v);
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
            '../util/dom': 28,
            './proxy': 27,
            'spica/alias': 5
        }
    ],
    26: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const uuid_1 = _dereq_('spica/uuid');
            const sqid_1 = _dereq_('spica/sqid');
            const id = uuid_1.uuid().slice(-7);
            function uid() {
                return `id-${ id }-${ +sqid_1.sqid() }`;
            }
            exports.uid = uid;
        },
        {
            'spica/sqid': 18,
            'spica/uuid': 23
        }
    ],
    27: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
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
                    case global_1.Array.isArray(children_):
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
                    for (const name in children) {
                        if (!alias_1.hasOwnProperty(children, name))
                            continue;
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
                    if (child.element.nodeName !== 'STYLE')
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
                        this.children_ = this.children_.parentNode === this.container ? this.children_ : [...this.container.childNodes].find(node => node.nodeType === 3) || this.children_.cloneNode();
                        return this.children_.textContent;
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
                            const oldText = targetChildren.textContent;
                            const newText = children;
                            targetChildren.textContent = newText;
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
                            const log = new global_1.WeakSet();
                            for (let i = 0; i < sourceChildren.length; ++i) {
                                const newChild = sourceChildren[i];
                                if (log.has(newChild))
                                    throw new Error(`TypedDOM: Typed DOM children can't repeatedly be used to the same object.`);
                                void log.add(newChild);
                                if (newChild.element.parentNode !== this.container) {
                                    void throwErrorIfNotUsable(newChild);
                                }
                                if (newChild.element !== this.container.children[i]) {
                                    if (newChild.element.parentNode !== this.container) {
                                        void this.scope(newChild);
                                        void addedChildren.push(newChild);
                                    }
                                    void this.container.insertBefore(newChild.element, this.container.children[i]);
                                    isChanged = true;
                                }
                                void targetChildren.push(newChild);
                            }
                            void alias_1.ObjectFreeze(targetChildren);
                            for (let i = sourceChildren.length; i < this.container.children.length; ++i) {
                                if (!proxies.has(this.container.children[i]))
                                    continue;
                                void removedChildren.push(proxy(this.container.removeChild(this.container.children[i])));
                                isChanged = true;
                                void --i;
                            }
                            break;
                        }
                    case ElChildrenType.Record: {
                            const sourceChildren = children;
                            const targetChildren = this.children_;
                            const log = new global_1.WeakSet();
                            for (const name in targetChildren) {
                                if (!alias_1.hasOwnProperty(sourceChildren, name))
                                    continue;
                                const oldChild = targetChildren[name];
                                const newChild = sourceChildren[name];
                                if (log.has(newChild))
                                    throw new Error(`TypedDOM: Typed DOM children can't repeatedly be used to the same object.`);
                                void log.add(newChild);
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
            '../util/dom': 28,
            './identity': 26,
            'spica/alias': 5,
            'spica/global': 13
        }
    ],
    28: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
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
                caches.elem = memoize_1.memoize(() => new Map(), new WeakMap());
                caches.text = global_1.document.createTextNode('');
                caches.frag = global_1.document.createDocumentFragment();
            }(caches || (caches = {})));
            function frag(children) {
                if (typeof children === 'string')
                    return frag([text(children)]);
                const node = caches.frag.cloneNode();
                children && void node.append(...children);
                return node;
            }
            exports.frag = frag;
            function shadow(el, children, opts) {
                if (typeof el === 'string')
                    return shadow(html(el), children, opts);
                if (children && !isChildren(children))
                    return shadow(el, void 0, children);
                return el.shadowRoot || shadows.has(el) ? define(opts ? opts.mode === 'open' ? el.shadowRoot || el.attachShadow(opts) : shadows.get(el) || shadows.set(el, el.attachShadow(opts)).get(el) : el.shadowRoot || shadows.get(el), children) : define(!opts || opts.mode === 'open' ? el.attachShadow({ mode: 'open' }) : shadows.set(el, el.attachShadow(opts)).get(el), children === void 0 ? el.childNodes : children);
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
                const text = caches.text.cloneNode();
                text.data = source;
                return text;
            }
            exports.text = text;
            function element(context, ns, tag, attrs, children) {
                const cache = caches.elem(context);
                const key = `${ ns }:${ tag }`;
                const el = tag.includes('-') ? elem(context, ns, tag) : cache.has(key) ? cache.get(key).cloneNode(true) : cache.set(key, elem(context, ns, tag)).get(key).cloneNode(true);
                void define(el, attrs, children);
                return el;
            }
            exports.element = element;
            function elem(context, ns, tag) {
                if (context.nodeType === 1)
                    throw new Error(`TypedDOM: Scoped custom elements are not supported.`);
                switch (ns) {
                case 'HTML':
                    return context.createElement(tag);
                case 'SVG':
                    return context.createElementNS('http://www.w3.org/2000/svg', tag);
                }
            }
            function define(el, attrs, children) {
                if (isChildren(attrs))
                    return define(el, void 0, attrs);
                if (typeof children === 'string')
                    return define(el, attrs, [text(children)]);
                if (attrs)
                    for (const name in attrs) {
                        if (!alias_1.hasOwnProperty(attrs, name))
                            continue;
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
                if (children) {
                    const {childNodes} = el;
                    if (childNodes.length === 0) {
                        void el.append(...children);
                    } else if (alias_1.isArray(children)) {
                        let cnt = 0;
                        I:
                            for (const child of children) {
                                if (child.nodeType === 11) {
                                    cnt += child.childNodes.length;
                                    void el.insertBefore(child, el.childNodes[cnt - child.childNodes.length] || null);
                                    continue;
                                }
                                void ++cnt;
                                while (el.childNodes.length > cnt) {
                                    if (el.childNodes[cnt - 1] === child)
                                        continue I;
                                    void el.removeChild(el.childNodes[cnt - 1]);
                                }
                                if (el.childNodes.length >= cnt && el.childNodes[cnt - 1] === child)
                                    continue;
                                void el.insertBefore(child, el.childNodes[cnt - 1] || null);
                            }
                        while (el.childNodes.length > cnt) {
                            void el.removeChild(el.childNodes[cnt]);
                        }
                    } else {
                        let cnt = 0;
                        for (const child of children) {
                            if (child.nodeType === 11) {
                                cnt += child.childNodes.length;
                                void el.insertBefore(child, el.childNodes[cnt - child.childNodes.length] || null);
                                continue;
                            }
                            void ++cnt;
                            if (childNodes.length <= cnt && child === childNodes[cnt - 1])
                                continue;
                            void el.insertBefore(child, childNodes[cnt - 1] || null);
                        }
                        while (childNodes.length > cnt) {
                            void el.removeChild(childNodes[cnt]);
                        }
                    }
                }
                return el;
            }
            exports.define = define;
            function isChildren(o) {
                return !!(o === null || o === void 0 ? void 0 : o[Symbol.iterator]);
            }
        },
        {
            'spica/alias': 5,
            'spica/global': 13,
            'spica/memoize': 14
        }
    ],
    29: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
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
            'spica/noop': 16,
            'spica/promise': 17
        }
    ],
    30: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const dom_1 = _dereq_('./dom');
            function apply(node, selector, attrs) {
                const ns = node.querySelectorAll(selector);
                for (const n of ns) {
                    void dom_1.define(n, attrs);
                }
                return ns;
            }
            exports.apply = apply;
        },
        { './dom': 28 }
    ],
    31: [
        function (_dereq_, module, exports) {
            'use strict';
            function __export(m) {
                for (var p in m)
                    if (!exports.hasOwnProperty(p))
                        exports[p] = m[p];
            }
            Object.defineProperty(exports, '__esModule', { value: true });
            var parser_1 = _dereq_('./combinator/data/parser');
            exports.eval = parser_1.eval;
            exports.exec = parser_1.exec;
            __export(_dereq_('./combinator/data/parser/union'));
            __export(_dereq_('./combinator/data/parser/sequence'));
            __export(_dereq_('./combinator/data/parser/subsequence'));
            __export(_dereq_('./combinator/data/parser/inits'));
            __export(_dereq_('./combinator/data/parser/tails'));
            __export(_dereq_('./combinator/data/parser/some'));
            __export(_dereq_('./combinator/control/constraint/block'));
            __export(_dereq_('./combinator/control/constraint/line'));
            __export(_dereq_('./combinator/control/constraint/scope'));
            __export(_dereq_('./combinator/control/constraint/contract'));
            __export(_dereq_('./combinator/control/manipulation/resource'));
            __export(_dereq_('./combinator/control/manipulation/surround'));
            __export(_dereq_('./combinator/control/manipulation/match'));
            __export(_dereq_('./combinator/control/manipulation/convert'));
            __export(_dereq_('./combinator/control/manipulation/indent'));
            __export(_dereq_('./combinator/control/manipulation/fence'));
            __export(_dereq_('./combinator/control/manipulation/trim'));
            __export(_dereq_('./combinator/control/manipulation/context'));
            __export(_dereq_('./combinator/control/manipulation/lazy'));
            __export(_dereq_('./combinator/control/manipulation/recovery'));
            __export(_dereq_('./combinator/control/monad/fmap'));
            __export(_dereq_('./combinator/control/monad/bind'));
        },
        {
            './combinator/control/constraint/block': 32,
            './combinator/control/constraint/contract': 33,
            './combinator/control/constraint/line': 34,
            './combinator/control/constraint/scope': 35,
            './combinator/control/manipulation/context': 36,
            './combinator/control/manipulation/convert': 37,
            './combinator/control/manipulation/fence': 38,
            './combinator/control/manipulation/indent': 39,
            './combinator/control/manipulation/lazy': 40,
            './combinator/control/manipulation/match': 41,
            './combinator/control/manipulation/recovery': 42,
            './combinator/control/manipulation/resource': 43,
            './combinator/control/manipulation/surround': 44,
            './combinator/control/manipulation/trim': 45,
            './combinator/control/monad/bind': 46,
            './combinator/control/monad/fmap': 47,
            './combinator/data/parser': 48,
            './combinator/data/parser/inits': 49,
            './combinator/data/parser/sequence': 50,
            './combinator/data/parser/some': 51,
            './combinator/data/parser/subsequence': 52,
            './combinator/data/parser/tails': 53,
            './combinator/data/parser/union': 54
        }
    ],
    32: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
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
            '../../data/parser': 48,
            './line': 34
        }
    ],
    33: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
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
            function verify(parser, cond) {
                return (source, context) => {
                    if (source === '')
                        return;
                    const result = parser(source, context);
                    if (!result)
                        return;
                    if (!cond(parser_1.eval(result), parser_1.exec(result), context))
                        return;
                    return parser_1.exec(result).length < source.length ? result : void 0;
                };
            }
            exports.verify = verify;
        },
        {
            '../../data/parser': 48,
            'spica/alias': 5
        }
    ],
    34: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
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
                        return result;
                    if (source.length - parser_1.exec(result).length <= firstline(source, false).length)
                        return result;
                    (context === null || context === void 0 ? void 0 : context.resource) && void --context.resource.backtrack;
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
        { '../../data/parser': 48 }
    ],
    35: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
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
            function rewrite_(scope, parser) {
                return rewrite(scope, parser);
            }
            exports.rewrite_ = rewrite_;
        },
        { '../../data/parser': 48 }
    ],
    36: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const global_1 = _dereq_('spica/global');
            const assign_1 = _dereq_('spica/assign');
            const concat_1 = _dereq_('spica/concat');
            const type_1 = _dereq_('spica/type');
            const memoize_1 = _dereq_('spica/memoize');
            function guard(f, parser) {
                return (source, context) => f(context) ? parser(source, context) : void 0;
            }
            exports.guard = guard;
            function update(context, parser) {
                const extend = memoize_1.memoize(base => merge({}, base, context), new global_1.WeakMap());
                return (source, base) => parser(source, extend(base));
            }
            exports.update = update;
            const merge = assign_1.template((prop, target, source) => {
                switch (prop) {
                case 'resource':
                    return target[prop] = target[prop] || source[prop];
                }
                switch (type_1.type(source[prop])) {
                case 'Array':
                    switch (type_1.type(target[prop])) {
                    case 'Array':
                        return target[prop] = concat_1.concat(target[prop].slice(), source[prop]);
                    default:
                        return target[prop] = merge([], source[prop]);
                    }
                case 'Object':
                    switch (type_1.type(target[prop])) {
                    case 'Object':
                        return target[prop] = merge(target[prop], source[prop]);
                    default:
                        return target[prop] = merge({}, source[prop]);
                    }
                case 'number':
                    switch (type_1.type(target[prop])) {
                    case 'number':
                        return target[prop] = target[prop] + source[prop];
                    default:
                        return target[prop] = source[prop];
                    }
                default:
                    return target[prop] = source[prop];
                }
            });
        },
        {
            'spica/assign': 7,
            'spica/concat': 10,
            'spica/global': 13,
            'spica/memoize': 14,
            'spica/type': 19
        }
    ],
    37: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
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
    38: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const line_1 = _dereq_('../constraint/line');
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
                        [
                            block,
                            closer,
                            ...matches
                        ],
                        rest
                    ];
                };
            }
            exports.fence = fence;
        },
        { '../constraint/line': 34 }
    ],
    39: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const parser_1 = _dereq_('../../data/parser');
            const some_1 = _dereq_('../../data/parser/some');
            const line_1 = _dereq_('../constraint/line');
            const scope_1 = _dereq_('../constraint/scope');
            const bind_1 = _dereq_('../monad/bind');
            const match_1 = _dereq_('./match');
            const surround_1 = _dereq_('./surround');
            function indent(parser) {
                return bind_1.bind(match_1.match(/^(?=(([^\S\n])\2*))/, match_1.memoize(([, indent]) => indent, indent => some_1.some(line_1.line(scope_1.rewrite(source => [
                    [],
                    source.slice(line_1.firstline(source).length)
                ], surround_1.surround(indent, source => [
                    [line_1.firstline(source, false)],
                    ''
                ], '')))))), (rs, rest, _, context) => {
                    const result = parser(rs.join('\n'), context);
                    return result && parser_1.exec(result) === '' ? [
                        parser_1.eval(result),
                        rest
                    ] : void 0;
                });
            }
            exports.indent = indent;
        },
        {
            '../../data/parser': 48,
            '../../data/parser/some': 51,
            '../constraint/line': 34,
            '../constraint/scope': 35,
            '../monad/bind': 46,
            './match': 41,
            './surround': 44
        }
    ],
    40: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            function lazy(builder) {
                let parser;
                return (source, context) => (parser = parser || builder())(source, context);
            }
            exports.lazy = lazy;
        },
        {}
    ],
    41: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
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
            '../../data/parser': 48,
            'spica/memoize': 14
        }
    ],
    42: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
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
    43: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            function creation(amount, parser) {
                if (typeof amount === 'function')
                    return creation(1, amount);
                return (source, context) => {
                    var _a;
                    if (((_a = context.resource) === null || _a === void 0 ? void 0 : _a.creation) < 0)
                        throw new Error('Too many creations');
                    const result = parser(source, context);
                    if (result && context.resource) {
                        context.resource.creation -= amount;
                    }
                    return result;
                };
            }
            exports.creation = creation;
            function backtrack(parser) {
                return (source, context) => {
                    var _a;
                    if (((_a = context.resource) === null || _a === void 0 ? void 0 : _a.backtrack) < 0)
                        throw new Error('Too many backtracking');
                    const result = parser(source, context);
                    if (!result && context.resource) {
                        void --context.resource.backtrack;
                    }
                    return result;
                };
            }
            exports.backtrack = backtrack;
        },
        {}
    ],
    44: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const parser_1 = _dereq_('../../data/parser');
            const fmap_1 = _dereq_('../monad/fmap');
            const bind_1 = _dereq_('../monad/bind');
            const concat_1 = _dereq_('spica/concat');
            function surround(start, parser, end, strict = true) {
                const starts = match(start);
                const ends = match(end);
                return (lmr_, context) => {
                    if (lmr_ === '')
                        return;
                    const l = starts(lmr_, context);
                    if (l === void 0)
                        return;
                    const mr_ = l ? lmr_.slice(l.length) : lmr_;
                    const [rs = [], r_ = mr_] = mr_ !== '' && parser(mr_, context) || [];
                    if (strict && r_.length === mr_.length)
                        return;
                    const r = ends(r_, context);
                    if (r === void 0)
                        return;
                    return l + r !== '' || r_.length - r.length < lmr_.length ? [
                        rs,
                        r ? r_.slice(r.length) : r_
                    ] : void 0;
                };
            }
            exports.surround = surround;
            function match(pattern) {
                switch (typeof pattern) {
                case 'string':
                    return source => source.slice(0, pattern.length) === pattern ? pattern : void 0;
                case 'object':
                    return source => {
                        var _a;
                        return (_a = source.match(pattern)) === null || _a === void 0 ? void 0 : _a[0];
                    };
                default:
                    return (source, context) => {
                        const res = pattern(source, context);
                        return res && source.slice(0, source.length - parser_1.exec(res).length);
                    };
                }
            }
            function open(opener, parser, optional = false) {
                return (lmr_, context) => {
                    if (lmr_ === '')
                        return;
                    const [rl = [], mr_ = lmr_] = opener(lmr_, context) || [];
                    if (mr_.length === lmr_.length)
                        return;
                    const [rm = [], r_ = mr_] = mr_ !== '' && parser(mr_, context) || [];
                    if (r_.length === mr_.length)
                        return optional ? [
                            rl,
                            mr_
                        ] : void 0;
                    rl.length > 0 && void rm.unshift(...rl);
                    return r_.length < lmr_.length ? [
                        rm,
                        r_
                    ] : void 0;
                };
            }
            exports.open = open;
            function close(parser, closer, keepSymbols = false, optional = false, f, g) {
                if (typeof keepSymbols === 'function' || typeof optional === 'function')
                    return close(parser, closer, void 0, void 0, keepSymbols, optional);
                return (source, context) => {
                    const [rs = [], r_ = source] = parser(source, context) || [];
                    if (!optional && r_.length === source.length)
                        return;
                    const [rr = [], rest = r_] = r_ !== '' && closer(r_, context) || [];
                    if (rest.length === source.length)
                        return;
                    if (rest.length === r_.length)
                        return g ? g(rs, rest, source, context) : void 0;
                    !keepSymbols && rs.length > 0 && void rs.shift();
                    keepSymbols && rr.length > 0 && void concat_1.concat(rs, rr);
                    return f ? f(rs, rest, source, context) : [
                        rs,
                        rest
                    ];
                };
            }
            exports.close = close;
            function open_(opener, parser, optional = false) {
                return (lmr_, context) => {
                    if (lmr_ === '')
                        return;
                    const [rl = [], mr_ = lmr_] = opener(lmr_, context) || [];
                    if (mr_.length === lmr_.length)
                        return;
                    const [rm = [], r_ = mr_] = mr_ !== '' && parser(mr_, context) || [];
                    return r_.length < mr_.length ? [
                        [
                            rl,
                            rm
                        ],
                        r_
                    ] : optional ? [
                        [rl],
                        mr_
                    ] : void 0;
                };
            }
            exports.open_ = open_;
            function close_(parser, closer, f, g) {
                return bind_1.bind(parser, (rs, r_, source, context) => {
                    const [rr = [], rest = r_] = r_ !== '' && closer(r_, context) || [];
                    return rest.length < r_.length ? f ? f([
                        rs[0],
                        rs[1] || [],
                        rr
                    ], rest, source, context) : [
                        concat_1.concat(concat_1.concat(rs[0], rs[1] || []), rr),
                        rest
                    ] : g ? g(rs, r_, source, context) : void 0;
                });
            }
            exports.close_ = close_;
            function when(parser, cond, f, g) {
                return bind_1.bind(parser, (rs, rest, source, context) => cond(rs, rest, source, context) ? f(rs, rest, source, context) : g ? g(rs, rest, source, context) : [
                    rs,
                    rest
                ]);
            }
            exports.when = when;
            function clear(parser) {
                return fmap_1.fmap(parser, () => []);
            }
            exports.clear = clear;
        },
        {
            '../../data/parser': 48,
            '../monad/bind': 46,
            '../monad/fmap': 47,
            'spica/concat': 10
        }
    ],
    45: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const convert_1 = _dereq_('./convert');
            function trim(parser) {
                return convert_1.convert(source => source.trim(), parser);
            }
            exports.trim = trim;
            function trimStart(parser) {
                return convert_1.convert(source => source.slice(source.lastIndexOf(source.trim())), parser);
            }
            exports.trimStart = trimStart;
            function trimEnd(parser) {
                return convert_1.convert((source, str) => source.slice(0, source.lastIndexOf(str = source.trim()) + str.length), parser);
            }
            exports.trimEnd = trimEnd;
        },
        { './convert': 37 }
    ],
    46: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const parser_1 = _dereq_('../../data/parser');
            function bind(parser, f) {
                return (source, context) => {
                    if (source === '')
                        return;
                    const res1 = parser(source, context);
                    if (!res1)
                        return;
                    const res2 = f(parser_1.eval(res1), parser_1.exec(res1), source, context);
                    if (!res2)
                        return;
                    return parser_1.exec(res2).length <= parser_1.exec(res1).length ? res2 : void 0;
                };
            }
            exports.bind = bind;
        },
        { '../../data/parser': 48 }
    ],
    47: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const bind_1 = _dereq_('./bind');
            function fmap(parser, f) {
                return bind_1.bind(parser, (rs, r, source, context) => [
                    f(rs, r, source, context),
                    r
                ]);
            }
            exports.fmap = fmap;
        },
        { './bind': 46 }
    ],
    48: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
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
    49: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const parser_1 = _dereq_('../parser');
            const concat_1 = _dereq_('spica/concat');
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
                        data = data ? concat_1.concat(data, parser_1.eval(result)) : parser_1.eval(result);
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
            '../parser': 48,
            'spica/concat': 10
        }
    ],
    50: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const parser_1 = _dereq_('../parser');
            const concat_1 = _dereq_('spica/concat');
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
                        data = data ? concat_1.concat(data, parser_1.eval(result)) : parser_1.eval(result);
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
            '../parser': 48,
            'spica/concat': 10
        }
    ],
    51: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const parser_1 = _dereq_('../parser');
            const concat_1 = _dereq_('spica/concat');
            function some(parser, until) {
                const match = typeof until === 'string' && until !== undefined ? source => source.slice(0, until.length) === until : source => !!until && until.test(source);
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
                        data = data ? concat_1.concat(data, parser_1.eval(result)) : parser_1.eval(result);
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
            '../parser': 48,
            'spica/concat': 10
        }
    ],
    52: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
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
            './inits': 49,
            './union': 54
        }
    ],
    53: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const union_1 = _dereq_('./union');
            const sequence_1 = _dereq_('./sequence');
            function tails(parsers) {
                return union_1.union(parsers.map((_, i) => sequence_1.sequence(parsers.slice(i))));
            }
            exports.tails = tails;
        },
        {
            './sequence': 50,
            './union': 54
        }
    ],
    54: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
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
        { '../parser': 48 }
    ],
    55: [
        function (_dereq_, module, exports) {
            'use strict';
            function __export(m) {
                for (var p in m)
                    if (!exports.hasOwnProperty(p))
                        exports[p] = m[p];
            }
            Object.defineProperty(exports, '__esModule', { value: true });
            __export(_dereq_('./parser/api'));
        },
        { './parser/api': 56 }
    ],
    56: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var parse_1 = _dereq_('./api/parse');
            exports.parse = parse_1.parse;
            var bind_1 = _dereq_('./api/bind');
            exports.bind = bind_1.bind;
            var cache_1 = _dereq_('./api/cache');
            exports.caches = cache_1.caches;
        },
        {
            './api/bind': 57,
            './api/cache': 58,
            './api/parse': 60
        }
    ],
    57: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../combinator');
            const segment_1 = _dereq_('../segment');
            const block_1 = _dereq_('../block');
            const normalize_1 = _dereq_('./normalize');
            const figure_1 = _dereq_('../../util/figure');
            const footnote_1 = _dereq_('../../util/footnote');
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
                    let start = 0;
                    for (; start < targetSegments.length; ++start) {
                        if (targetSegments[start] !== sourceSegments[start])
                            break;
                    }
                    if (adds.length + dels.length === 0 && sourceSegments.length === targetSegments.length && start === sourceSegments.length)
                        return;
                    let end = 0;
                    for (; start + end < targetSegments.length && start + end < sourceSegments.length; ++end) {
                        if (targetSegments[targetSegments.length - end - 1] !== sourceSegments[sourceSegments.length - end - 1])
                            break;
                    }
                    const base = next(start);
                    let index = start;
                    for (; index < sourceSegments.length - end; ++index) {
                        const seg = sourceSegments[index];
                        const es = combinator_1.eval(block_1.block(seg, {}));
                        void pairs.splice(index, 0, [
                            seg,
                            es
                        ]);
                        if (es.length === 0)
                            continue;
                        void adds.push(...es.map(el => [
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
                        void dels.push(...es);
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
            '../../combinator': 31,
            '../../util/figure': 144,
            '../../util/footnote': 145,
            '../block': 62,
            '../segment': 119,
            './normalize': 59
        }
    ],
    58: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const math_1 = _dereq_('../inline/math');
            const media_1 = _dereq_('../inline/media');
            exports.caches = {
                math: math_1.cache,
                media: media_1.cache
            };
        },
        {
            '../inline/math': 110,
            '../inline/media': 111
        }
    ],
    59: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
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
    60: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../combinator');
            const block_1 = _dereq_('../block');
            const segment_1 = _dereq_('../segment');
            const normalize_1 = _dereq_('./normalize');
            const figure_1 = _dereq_('../../util/figure');
            const footnote_1 = _dereq_('../../util/footnote');
            const concat_1 = _dereq_('spica/concat');
            const typed_dom_1 = _dereq_('typed-dom');
            function parse(source, opts = {}) {
                var _a;
                const node = typed_dom_1.frag(segment_1.segment(normalize_1.normalize(source)).reduce((acc, seg) => concat_1.concat(acc, combinator_1.eval(block_1.block(seg, opts.context || {}))), []));
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
            '../../combinator': 31,
            '../../util/figure': 144,
            '../../util/footnote': 145,
            '../block': 62,
            '../segment': 119,
            './normalize': 59,
            'spica/concat': 10,
            'typed-dom': 24
        }
    ],
    61: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
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
            '../combinator': 31,
            './inline': 82,
            './source': 120
        }
    ],
    62: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
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
            exports.block = combinator_1.recover(locale_1.localize(combinator_1.update({
                resource: {
                    creation: 100 * 1000,
                    backtrack: 100 * 1000
                }
            }, combinator_1.union([
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
            '../combinator': 31,
            './block/blockquote': 63,
            './block/codeblock': 64,
            './block/dlist': 65,
            './block/extension': 66,
            './block/heading': 71,
            './block/horizontalrule': 72,
            './block/ilist': 73,
            './block/mathblock': 74,
            './block/olist': 75,
            './block/paragraph': 76,
            './block/table': 80,
            './block/ulist': 81,
            './locale': 117,
            './source/line': 123,
            'typed-dom': 24
        }
    ],
    63: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../combinator');
            const source_1 = _dereq_('../source');
            const autolink_1 = _dereq_('../autolink');
            const parse_1 = _dereq_('../api/parse');
            const util_1 = _dereq_('../util');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.segment = combinator_1.block(combinator_1.union([combinator_1.validate(/^!?>+(?=[^\S\n]|\n\s*\S)/, combinator_1.some(source_1.contentline))]));
            exports.blockquote = combinator_1.lazy(() => combinator_1.block(combinator_1.rewrite(exports.segment, combinator_1.union([
                combinator_1.surround(/^(?=>)/, text, ''),
                combinator_1.surround(/^!(?=>)/, source, '')
            ]))));
            const opener = /^(?=>>+(?:$|\s))/;
            const indent = combinator_1.block(combinator_1.surround(opener, combinator_1.some(source_1.contentline, /^>(?:$|\s)/), ''), false);
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
            '../../combinator': 31,
            '../api/parse': 60,
            '../autolink': 61,
            '../source': 120,
            '../util': 128,
            'typed-dom': 24
        }
    ],
    64: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../combinator');
            const source_1 = _dereq_('../source');
            const util_1 = _dereq_('../util');
            const typed_dom_1 = _dereq_('typed-dom');
            const autolink_1 = _dereq_('../autolink');
            const opener = /^(`{3,})(?!`)(\S*)([^\n]*)\n?/;
            const language = /^[a-z0-9]+(?:-[a-z][a-z0-9]*)*$/;
            exports.segment = combinator_1.block(combinator_1.validate('```', combinator_1.clear(combinator_1.fence(opener, 300, true))));
            exports.segment_ = combinator_1.block(combinator_1.validate('```', combinator_1.clear(combinator_1.fence(opener, 300, false))), false);
            exports.codeblock = combinator_1.block(combinator_1.validate('```', combinator_1.fmap(combinator_1.fence(opener, 300, true), ([body, closer, opener, , lang, param], _, __, context) => {
                [lang, param] = language.test(lang) ? [
                    lang,
                    param
                ] : [
                    '',
                    lang + param
                ];
                param = param.trim();
                const path = util_1.stringify(combinator_1.eval(combinator_1.some(source_1.escsource, /^\s/)(param, context)));
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
            '../../combinator': 31,
            '../autolink': 61,
            '../source': 120,
            '../util': 128,
            'typed-dom': 24
        }
    ],
    65: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../combinator');
            const source_1 = _dereq_('../source');
            const inline_1 = _dereq_('../inline');
            const paragraph_1 = _dereq_('./paragraph');
            const util_1 = _dereq_('../util');
            const concat_1 = _dereq_('spica/concat');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.dlist = combinator_1.lazy(() => combinator_1.block(combinator_1.fmap(combinator_1.validate(/^~(?=$|\s)/, combinator_1.convert(source => source.replace(paragraph_1.blankline, ''), combinator_1.update({ syntax: { inline: { media: false } } }, combinator_1.some(combinator_1.inits([
                combinator_1.some(term),
                combinator_1.some(desc)
            ]))))), es => [typed_dom_1.html('dl', fillTrailingDescription(es))])));
            const term = combinator_1.line(inline_1.indexee(combinator_1.fmap(combinator_1.surround(/^~(?=$|\s)/, combinator_1.fmap(combinator_1.trim(combinator_1.some(combinator_1.union([
                inline_1.indexer,
                inline_1.inline
            ]))), util_1.defrag), '', false), ns => [typed_dom_1.html('dt', ns)])));
            const desc = combinator_1.block(combinator_1.fmap(combinator_1.surround(/^:(?=$|\s)|/, combinator_1.rewrite(combinator_1.some(source_1.anyline, /^[~:](?=$|\s)/), combinator_1.trim(combinator_1.some(combinator_1.union([inline_1.inline])))), '', false), ns => [typed_dom_1.html('dd', util_1.defrag(ns))]), false);
            function fillTrailingDescription(es) {
                return es.length > 0 && es[es.length - 1].tagName === 'DT' ? concat_1.concat(es, [typed_dom_1.html('dd')]) : es;
            }
        },
        {
            '../../combinator': 31,
            '../inline': 82,
            '../source': 120,
            '../util': 128,
            './paragraph': 76,
            'spica/concat': 10,
            'typed-dom': 24
        }
    ],
    66: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
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
            '../../combinator': 31,
            './extension/example': 67,
            './extension/fig': 68,
            './extension/figure': 69,
            './extension/placeholder': 70
        }
    ],
    67: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../../combinator');
            const parse_1 = _dereq_('../../api/parse');
            const mathblock_1 = _dereq_('../mathblock');
            const util_1 = _dereq_('../../util');
            const typed_dom_1 = _dereq_('typed-dom');
            const opener = /^(~{3,})(?!~)example\/(\S+)([^\n]*)\n?/;
            exports.segment = combinator_1.block(combinator_1.validate('~~~', combinator_1.clear(combinator_1.fence(opener, 100, true))));
            exports.segment_ = combinator_1.block(combinator_1.validate('~~~', combinator_1.clear(combinator_1.fence(opener, 100, false))), false);
            exports.example = combinator_1.block(combinator_1.validate('~~~', combinator_1.fmap(combinator_1.fence(opener, 100, true), ([body, closer, opener, , type, param], _, __, context) => {
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
                            ...combinator_1.eval(mathblock_1.mathblock(`$$\n${ body }$$`, context))
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
            '../../../combinator': 31,
            '../../api/parse': 60,
            '../../util': 128,
            '../mathblock': 74,
            'typed-dom': 24
        }
    ],
    68: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
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
            '../../../combinator': 31,
            '../../inline/extension/label': 103,
            '../../source': 120,
            '../blockquote': 63,
            '../codeblock': 64,
            '../extension/example': 67,
            '../mathblock': 74,
            './figure': 69
        }
    ],
    69: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../../combinator');
            const source_1 = _dereq_('../../source');
            const label_1 = _dereq_('../../inline/extension/label');
            const table_1 = _dereq_('../table');
            const codeblock_1 = _dereq_('../codeblock');
            const mathblock_1 = _dereq_('../mathblock');
            const example_1 = _dereq_('./example');
            const blockquote_1 = _dereq_('../blockquote');
            const paragraph_1 = _dereq_('../paragraph');
            const inline_1 = _dereq_('../../inline');
            const util_1 = _dereq_('../../util');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.segment = combinator_1.block(combinator_1.match(/^(~{3,})figure[^\S\n]+(?=\[?\$[\w-]\S*[^\S\n]*\n(?:[^\n]*\n)*?\1[^\S\n]*(?:$|\n))/, combinator_1.memoize(([, fence]) => fence, (fence, closer = new RegExp(`^${ fence }[^\\S\\n]*(?:$|\\n)`)) => combinator_1.surround('', combinator_1.sequence([
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
                    combinator_1.block(combinator_1.convert(source => source.replace(paragraph_1.blankline, ''), combinator_1.update({ syntax: { inline: { media: false } } }, combinator_1.trim(combinator_1.some(inline_1.inline)))))
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
            '../../../combinator': 31,
            '../../inline': 82,
            '../../inline/extension/label': 103,
            '../../source': 120,
            '../../util': 128,
            '../blockquote': 63,
            '../codeblock': 64,
            '../mathblock': 74,
            '../paragraph': 76,
            '../table': 80,
            './example': 67,
            'typed-dom': 24
        }
    ],
    70: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
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
            '../../../combinator': 31,
            'typed-dom': 24
        }
    ],
    71: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../combinator');
            const inline_1 = _dereq_('../inline');
            const source_1 = _dereq_('../source');
            const util_1 = _dereq_('../util');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.heading = combinator_1.block(combinator_1.focus(/^#{1,6}[^\S\n][^\n]*(?:\n#{1,6}(?:[^\S\n][^\n]*)?)*(?:$|\n)/, combinator_1.update({ syntax: { inline: { media: false } } }, combinator_1.some(combinator_1.line(inline_1.indexee(combinator_1.fmap(combinator_1.open(source_1.str(/^#+/), combinator_1.trim(combinator_1.some(combinator_1.union([
                inline_1.indexer,
                inline_1.inline
            ]))), true), ns => [typed_dom_1.html(`h${ ns.shift().textContent.length }`, util_1.defrag(ns))])))))));
        },
        {
            '../../combinator': 31,
            '../inline': 82,
            '../source': 120,
            '../util': 128,
            'typed-dom': 24
        }
    ],
    72: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../combinator');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.horizontalrule = combinator_1.block(combinator_1.line(combinator_1.focus(/^-{3,}[^\S\n]*(?:$|\n)/, () => [
                [typed_dom_1.html('hr')],
                ''
            ])));
        },
        {
            '../../combinator': 31,
            'typed-dom': 24
        }
    ],
    73: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../combinator');
            const ulist_1 = _dereq_('./ulist');
            const olist_1 = _dereq_('./olist');
            const inline_1 = _dereq_('../inline');
            const util_1 = _dereq_('../util');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.ilist = combinator_1.lazy(() => combinator_1.block(combinator_1.fmap(combinator_1.validate(/^[-+*](?:[^\S\n]|\n[^\S\n]*\S)/, combinator_1.some(combinator_1.union([combinator_1.fmap(combinator_1.inits([
                    combinator_1.line(combinator_1.surround(/^[-+*](?:$|\s)/, combinator_1.trim(combinator_1.some(inline_1.inline)), '', false)),
                    combinator_1.indent(combinator_1.union([
                        ulist_1.ulist_,
                        olist_1.olist_,
                        exports.ilist_
                    ]))
                ]), ns => [typed_dom_1.html('li', ulist_1.fillFirstLine(util_1.defrag(ns)))])]))), es => [typed_dom_1.html('ul', {
                    class: 'invalid',
                    'data-invalid-syntax': 'list',
                    'data-invalid-message': 'Use - instead of + or *'
                }, es)])));
            exports.ilist_ = combinator_1.convert(source => source.replace(/^[-+*](?=$|\n)/, `$& `), exports.ilist);
        },
        {
            '../../combinator': 31,
            '../inline': 82,
            '../util': 128,
            './olist': 75,
            './ulist': 81,
            'typed-dom': 24
        }
    ],
    74: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
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
            '../../combinator': 31,
            'typed-dom': 24
        }
    ],
    75: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../combinator');
            const ulist_1 = _dereq_('./ulist');
            const ilist_1 = _dereq_('./ilist');
            const inline_1 = _dereq_('../inline');
            const source_1 = _dereq_('../source');
            const util_1 = _dereq_('../util');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.olist = combinator_1.lazy(() => combinator_1.block(combinator_1.fmap(combinator_1.validate(/^(?=([0-9]+|[a-z]+|[A-Z]+)\.(?:[^\S\n]|\n[^\S\n]*\S))/, combinator_1.update({ syntax: { inline: { media: false } } }, combinator_1.some(combinator_1.union([combinator_1.fmap(combinator_1.inits([
                    combinator_1.line(combinator_1.inits([
                        combinator_1.focus(/^(?:[0-9]+|[a-z]+|[A-Z]+)(?:\.\s|\.?(?=$|\n))/, combinator_1.trim(combinator_1.surround('', combinator_1.some(source_1.unescsource, /^[.\n]/), /^\.?/))),
                        combinator_1.trim(combinator_1.some(inline_1.inline))
                    ])),
                    combinator_1.indent(combinator_1.union([
                        ulist_1.ulist_,
                        exports.olist_,
                        ilist_1.ilist_
                    ]))
                ]), ([{textContent: index}, ...ns]) => [typed_dom_1.html('li', {
                        value: format(index),
                        'data-type': type(index)
                    }, ulist_1.fillFirstLine(util_1.defrag(ns)))])])))), es => {
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
                if (index === null)
                    return;
                switch (true) {
                case +index === 0:
                    return void 0;
                case +index > 0:
                    return '1';
                case index === index.toLowerCase():
                    return 'a';
                case index === index.toUpperCase():
                    return 'A';
                default:
                    throw new Error(`${ index }`);
                }
            }
            function format(index) {
                switch (type(index)) {
                case void 0:
                    return void 0;
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
            '../../combinator': 31,
            '../inline': 82,
            '../source': 120,
            '../util': 128,
            './ilist': 73,
            './ulist': 81,
            'typed-dom': 24
        }
    ],
    76: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../combinator');
            const mention_1 = _dereq_('./paragraph/mention');
            const inline_1 = _dereq_('../inline');
            const source_1 = _dereq_('../source');
            const util_1 = _dereq_('../util');
            const concat_1 = _dereq_('spica/concat');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.blankline = /^(?:\\?\s)*\\?(?:\n|$)/gm;
            exports.paragraph = combinator_1.block(combinator_1.fmap(combinator_1.convert(source => source.replace(exports.blankline, ''), combinator_1.some(combinator_1.subsequence([
                combinator_1.fmap(combinator_1.some(mention_1.mention), es => es.reduce((acc, el) => concat_1.concat(acc, [
                    el,
                    typed_dom_1.html('br')
                ]), [])),
                combinator_1.fmap(combinator_1.rewrite(combinator_1.some(source_1.anyline, '>'), combinator_1.trim(combinator_1.some(inline_1.inline))), ns => concat_1.concat(util_1.defrag(ns), [typed_dom_1.html('br')]))
            ]))), ns => ns.length > 0 ? [typed_dom_1.html('p', format(ns))].map(el => util_1.isVisible(el) ? el : typed_dom_1.define(el, {
                class: 'invalid',
                'data-invalid-syntax': 'paragraph',
                'data-invalid-message': 'All paragraphs must have a visible content'
            })) : []));
            function format(ns) {
                void ns.pop();
                return ns;
            }
        },
        {
            '../../combinator': 31,
            '../inline': 82,
            '../source': 120,
            '../util': 128,
            './paragraph/mention': 77,
            'spica/concat': 10,
            'typed-dom': 24
        }
    ],
    77: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../../combinator');
            const address_1 = _dereq_('./mention/address');
            const quotation_1 = _dereq_('./mention/quotation');
            exports.mention = combinator_1.block(combinator_1.subsequence([
                combinator_1.some(address_1.address),
                quotation_1.quotation
            ]), false);
        },
        {
            '../../../combinator': 31,
            './mention/address': 78,
            './mention/quotation': 79
        }
    ],
    78: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../../../combinator');
            const inline_1 = _dereq_('../../../inline');
            const source_1 = _dereq_('../../../source');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.address = combinator_1.line(combinator_1.creation(combinator_1.fmap(combinator_1.sequence([
                source_1.str(/^>+(?!>)(?=\S+\s*$)/),
                combinator_1.union([
                    combinator_1.focus(/^[A-Za-z0-9]+(?:[/-][A-Za-z0-9]+)*(?=\s*$)/, combinator_1.backtrack(combinator_1.convert(source => `{ ${ source } }`, inline_1.link))),
                    combinator_1.focus(/^h?ttps?:\/\/[^/?#\s]\S*(?=\s*$)/, combinator_1.backtrack(combinator_1.convert(source => `{ ${ inline_1.address(source) }${ inline_1.attribute(source) } }`, inline_1.link)))
                ])
            ]), ([{data: flag}, link]) => [typed_dom_1.define(link, {
                    class: 'address',
                    'data-level': `${ flag.length }`,
                    href: null
                }, `${ flag }${ link.textContent }`)])));
        },
        {
            '../../../../combinator': 31,
            '../../../inline': 82,
            '../../../source': 120,
            'typed-dom': 24
        }
    ],
    79: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../../../combinator');
            const source_1 = _dereq_('../../../source');
            const autolink_1 = _dereq_('../../../autolink');
            const util_1 = _dereq_('../../../util');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.quotation = combinator_1.lazy(() => combinator_1.block(combinator_1.creation(combinator_1.fmap(combinator_1.union([
                combinator_1.rewrite(combinator_1.some(combinator_1.validate(/^>+(?:$|\s)/, source_1.contentline)), combinator_1.convert(source => source.replace(/\n$/, ''), combinator_1.some(autolink_1.autolink))),
                combinator_1.rewrite(combinator_1.some(combinator_1.validate(/^>+/, source_1.contentline)), combinator_1.convert(source => source.replace(/\n$/, ''), combinator_1.some(autolink_1.autolink)))
            ]), ns => [typed_dom_1.html('span', { class: 'quotation' }, util_1.defrag(ns))])), false));
        },
        {
            '../../../../combinator': 31,
            '../../../autolink': 61,
            '../../../source': 120,
            '../../../util': 128,
            'typed-dom': 24
        }
    ],
    80: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const global_1 = _dereq_('spica/global');
            const combinator_1 = _dereq_('../../combinator');
            const inline_1 = _dereq_('../inline');
            const util_1 = _dereq_('../util');
            const concat_1 = _dereq_('spica/concat');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.table = combinator_1.lazy(() => combinator_1.block(combinator_1.fmap(combinator_1.validate(/^\|[^\n]*(?:\n\|[^\n]*){2,}/, combinator_1.update({ syntax: { inline: { media: false } } }, combinator_1.sequence([
                row(cell(data), false),
                row(cell(alignment), true),
                combinator_1.some(row(cell(data), false))
            ]))), ([head, alignment, ...rows]) => {
                void align(head, alignment, rows);
                return [typed_dom_1.html('table', [
                        typed_dom_1.html('thead', [head]),
                        typed_dom_1.html('tbody', rows)
                    ])];
            })));
            function align(head, alignment, rows) {
                const as = [...alignment.children].reduce((acc, el) => concat_1.concat(acc, [el.textContent || acc.length > 0 && acc[acc.length - 1] || '']), []);
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
                    return size > aligns.length ? void concat_1.concat(aligns, global_1.Array(size - aligns.length).fill(aligns.length > 0 ? aligns[aligns.length - 1] : '')) : void 0;
                }
            }
            const row = (parser, strict) => combinator_1.fmap(combinator_1.line(combinator_1.surround(/^(?=\|)/, combinator_1.some(combinator_1.union([parser])), /^\|?\s*$/, strict)), es => [typed_dom_1.html('tr', es)]);
            const cell = parser => combinator_1.fmap(combinator_1.union([parser]), ns => [typed_dom_1.html('td', ns)]);
            const data = combinator_1.fmap(combinator_1.surround(/^\|(?:\\?\s)*(?=\S)/, combinator_1.some(combinator_1.union([inline_1.inline]), /^(?:\\?\s)*(?=\||\\?$)/), /^[^|]*/, false), util_1.defrag);
            const alignment = combinator_1.surround('|', combinator_1.union([
                combinator_1.focus(/^:-+:/, () => [
                    [typed_dom_1.text('center')],
                    ''
                ]),
                combinator_1.focus(/^:-+/, () => [
                    [typed_dom_1.text('left')],
                    ''
                ]),
                combinator_1.focus(/^-+:/, () => [
                    [typed_dom_1.text('right')],
                    ''
                ]),
                combinator_1.focus(/^-+/, () => [
                    [typed_dom_1.text('')],
                    ''
                ])
            ]), '');
        },
        {
            '../../combinator': 31,
            '../inline': 82,
            '../util': 128,
            'spica/concat': 10,
            'spica/global': 13,
            'typed-dom': 24
        }
    ],
    81: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../combinator');
            const olist_1 = _dereq_('./olist');
            const ilist_1 = _dereq_('./ilist');
            const inline_1 = _dereq_('../inline');
            const util_1 = _dereq_('../util');
            const concat_1 = _dereq_('spica/concat');
            const typed_dom_1 = _dereq_('typed-dom');
            const opener = /^-(?:$|\s)/;
            exports.ulist = combinator_1.lazy(() => combinator_1.block(combinator_1.fmap(combinator_1.validate(/^-(?:[^\S\n]|\n[^\S\n]*\S)/, combinator_1.update({ syntax: { inline: { media: false } } }, combinator_1.some(combinator_1.union([combinator_1.fmap(combinator_1.inits([
                    combinator_1.line(combinator_1.surround(opener, combinator_1.trim(combinator_1.some(inline_1.inline)), '', false)),
                    combinator_1.indent(combinator_1.union([
                        exports.ulist_,
                        olist_1.olist_,
                        ilist_1.ilist_
                    ]))
                ]), ns => [typed_dom_1.html('li', fillFirstLine(util_1.defrag(ns)))])])))), es => [typed_dom_1.html('ul', es)])));
            exports.ulist_ = combinator_1.convert(source => source.replace(/^-(?=$|\n)/, `$& `), exports.ulist);
            function fillFirstLine(ns) {
                var _a;
                return [
                    'UL',
                    'OL'
                ].includes((_a = ns[0]) === null || _a === void 0 ? void 0 : _a.nodeName) ? concat_1.concat([typed_dom_1.html('br')], ns) : ns;
            }
            exports.fillFirstLine = fillFirstLine;
        },
        {
            '../../combinator': 31,
            '../inline': 82,
            '../util': 128,
            './ilist': 73,
            './olist': 75,
            'spica/concat': 10,
            'typed-dom': 24
        }
    ],
    82: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
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
            var link_2 = _dereq_('./inline/link');
            exports.link = link_2.link;
            var media_2 = _dereq_('./inline/media');
            exports.media = media_2.media;
            var shortmedia_2 = _dereq_('./inline/shortmedia');
            exports.shortmedia = shortmedia_2.shortmedia;
            var autolink_2 = _dereq_('./inline/autolink');
            exports.autolink = autolink_2.autolink;
            var url_1 = _dereq_('./inline/autolink/url');
            exports.url = url_1.url;
            exports.address = url_1.address;
            exports.attribute = url_1.attribute;
            var indexer_1 = _dereq_('./inline/extension/indexer');
            exports.indexer = indexer_1.indexer;
            var indexee_1 = _dereq_('./inline/extension/indexee');
            exports.indexee = indexee_1.indexee;
            var label_1 = _dereq_('./inline/extension/label');
            exports.isFixed = label_1.isFixed;
            exports.isFormatted = label_1.isFormatted;
        },
        {
            '../combinator': 31,
            './inline/annotation': 83,
            './inline/autolink': 84,
            './inline/autolink/url': 90,
            './inline/bracket': 91,
            './inline/code': 92,
            './inline/comment': 93,
            './inline/deletion': 94,
            './inline/emphasis': 95,
            './inline/emstrong': 96,
            './inline/escape': 97,
            './inline/extension': 98,
            './inline/extension/indexee': 101,
            './inline/extension/indexer': 102,
            './inline/extension/label': 103,
            './inline/html': 105,
            './inline/htmlentity': 106,
            './inline/insertion': 107,
            './inline/link': 108,
            './inline/mark': 109,
            './inline/math': 110,
            './inline/media': 111,
            './inline/reference': 112,
            './inline/ruby': 113,
            './inline/shortmedia': 114,
            './inline/strong': 115,
            './inline/template': 116,
            './source': 120
        }
    ],
    83: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../combinator');
            const inline_1 = _dereq_('../inline');
            const source_1 = _dereq_('../source');
            const util_1 = _dereq_('../util');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.annotation = combinator_1.lazy(() => combinator_1.creation(combinator_1.fmap(combinator_1.surround('((', combinator_1.guard(context => {
                var _a, _b, _c;
                return (_c = (_b = (_a = context.syntax) === null || _a === void 0 ? void 0 : _a.inline) === null || _b === void 0 ? void 0 : _b.annotation) !== null && _c !== void 0 ? _c : true;
            }, combinator_1.update({
                syntax: {
                    inline: {
                        annotation: false,
                        reference: false,
                        extension: false,
                        media: false,
                        link: true,
                        autolink: true
                    }
                }
            }, util_1.startTight(combinator_1.union([combinator_1.some(inline_1.inline, '))')])))), combinator_1.backtrack(source_1.str('))'))), ns => [typed_dom_1.html('sup', { class: 'annotation' }, util_1.defrag(ns))])));
        },
        {
            '../../combinator': 31,
            '../inline': 82,
            '../source': 120,
            '../util': 128,
            'typed-dom': 24
        }
    ],
    84: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../combinator');
            const url_1 = _dereq_('./autolink/url');
            const email_1 = _dereq_('./autolink/email');
            const channel_1 = _dereq_('./autolink/channel');
            const account_1 = _dereq_('./autolink/account');
            const hashtag_1 = _dereq_('./autolink/hashtag');
            const hashref_1 = _dereq_('./autolink/hashref');
            const source_1 = _dereq_('../source');
            const util_1 = _dereq_('../util');
            const typed_dom_1 = _dereq_('typed-dom');
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
            ])))), ns => ns.length === 1 ? ns : [typed_dom_1.text(util_1.stringify(ns))]);
        },
        {
            '../../combinator': 31,
            '../source': 120,
            '../util': 128,
            './autolink/account': 85,
            './autolink/channel': 86,
            './autolink/email': 87,
            './autolink/hashref': 88,
            './autolink/hashtag': 89,
            './autolink/url': 90,
            'typed-dom': 24
        }
    ],
    85: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../../combinator');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.account = combinator_1.creation(combinator_1.focus(/^@[A-Za-z0-9]+(?:-[0-9A-Za-z]+)*/, source => [
                [typed_dom_1.html('a', {
                        class: 'account',
                        rel: 'noopener'
                    }, source)],
                ''
            ]));
        },
        {
            '../../../combinator': 31,
            'typed-dom': 24
        }
    ],
    86: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../../combinator');
            const account_1 = _dereq_('./account');
            const hashtag_1 = _dereq_('./hashtag');
            const util_1 = _dereq_('../../util');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.channel = combinator_1.fmap(combinator_1.inits([
                account_1.account,
                combinator_1.some(hashtag_1.hashtag)
            ]), ns => ns.length > 1 ? [typed_dom_1.html('a', {
                    class: 'channel',
                    rel: 'noopener'
                }, util_1.stringify(ns))] : ns);
        },
        {
            '../../../combinator': 31,
            '../../util': 128,
            './account': 85,
            './hashtag': 89,
            'typed-dom': 24
        }
    ],
    87: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../../combinator');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.email = combinator_1.creation(combinator_1.focus(/^[A-Za-z0-9]+(?:[.+_-][A-Za-z0-9]+)*@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*/, source => [
                [typed_dom_1.html('a', {
                        class: 'email',
                        href: `mailto:${ source }`,
                        rel: 'noopener'
                    }, source)],
                ''
            ]));
        },
        {
            '../../../combinator': 31,
            'typed-dom': 24
        }
    ],
    88: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../../combinator');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.hashref = combinator_1.creation(combinator_1.focus(/^#[0-9]+(?![A-Za-z]|[^\x00-\x7F\s])/, ref => [
                [typed_dom_1.html('a', {
                        class: 'hashref',
                        rel: 'noopener'
                    }, ref)],
                ''
            ]));
        },
        {
            '../../../combinator': 31,
            'typed-dom': 24
        }
    ],
    89: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../../combinator');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.hashtag = combinator_1.creation(combinator_1.focus(/^#(?![0-9]+(?![A-Za-z]|[^\x00-\x7F\s]))(?:[A-Za-z0-9]|[^\x00-\x7F\s])+/, tag => [
                [typed_dom_1.html('a', {
                        class: 'hashtag',
                        rel: 'noopener'
                    }, tag)],
                ''
            ]));
        },
        {
            '../../../combinator': 31,
            'typed-dom': 24
        }
    ],
    90: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../../combinator');
            const source_1 = _dereq_('../../source');
            const link_1 = _dereq_('../link');
            const closer = /^[-+*~^,.;:!?]*(?=[\s"`|\[\](){}<>]|\\?(?:$|\s))/;
            exports.url = combinator_1.lazy(() => combinator_1.rewrite(combinator_1.open_(source_1.str(/^h?ttps?:\/\/(?=[^/?#\s])/), combinator_1.backtrack(combinator_1.some(combinator_1.union([
                exports.bracket,
                combinator_1.some(source_1.unescsource, closer)
            ])))), combinator_1.convert(source => `{ ${ address(source) }${ attribute(source) } }`, combinator_1.update({ syntax: { inline: { link: void 0 } } }, combinator_1.union([link_1.link])))));
            exports.bracket = combinator_1.union([
                source_1.str(/^\([^\s\)]{0,100}\)/),
                source_1.str(/^\[[^\s\]]{0,100}\]/),
                source_1.str(/^\{[^\s\}]{0,100}\}/),
                source_1.str(/^\<[^\s\>]{0,100}\>/),
                source_1.str(/^\"[^\s\"]{0,100}\"/)
            ]);
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
            '../../../combinator': 31,
            '../../source': 120,
            '../link': 108
        }
    ],
    91: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const inline_1 = _dereq_('../inline');
            const combinator_1 = _dereq_('../../combinator');
            const source_1 = _dereq_('../source');
            exports.bracket = combinator_1.lazy(() => combinator_1.union([
                combinator_1.open(source_1.char('('), combinator_1.close(combinator_1.some(inline_1.inline, ')'), source_1.char(')'), true, true, void 0, (ns, rest) => [
                    ns,
                    rest
                ]), true),
                combinator_1.open(source_1.char('['), combinator_1.close(combinator_1.some(inline_1.inline, ']'), source_1.char(']'), true, true, void 0, (ns, rest) => [
                    ns,
                    rest
                ]), true),
                combinator_1.open(source_1.char('{'), combinator_1.close(combinator_1.some(inline_1.inline, '}'), source_1.char('}'), true, true, void 0, (ns, rest) => [
                    ns,
                    rest
                ]), true)
            ]));
        },
        {
            '../../combinator': 31,
            '../inline': 82,
            '../source': 120
        }
    ],
    92: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../combinator');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.code = combinator_1.creation(combinator_1.validate('`', combinator_1.backtrack(combinator_1.match(/^(`+)(?!`)(?:([^\n]*?[^`\n])\1(?!`))?/, ([whole, , body]) => rest => body ? [
                [typed_dom_1.html('code', { 'data-src': whole }, body.trim() || body)],
                rest
            ] : [
                [typed_dom_1.text(whole)],
                rest
            ]))));
        },
        {
            '../../combinator': 31,
            'typed-dom': 24
        }
    ],
    93: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../combinator');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.syntax = /^<(#+)\s+(\S+(?:\s+(?!\1)\S+)*)\s+\1>/;
            exports.comment = combinator_1.creation(combinator_1.validate('<#', combinator_1.backtrack(combinator_1.match(exports.syntax, ([, , title]) => rest => [
                [typed_dom_1.html('sup', {
                        class: 'comment',
                        title
                    })],
                rest
            ]))));
        },
        {
            '../../combinator': 31,
            'typed-dom': 24
        }
    ],
    94: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const inline_1 = _dereq_('../inline');
            const combinator_1 = _dereq_('../../combinator');
            const source_1 = _dereq_('../source');
            const util_1 = _dereq_('../util');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.deletion = combinator_1.lazy(() => combinator_1.creation(combinator_1.fmap(combinator_1.surround('~~', combinator_1.some(combinator_1.union([inline_1.inline]), '~~'), combinator_1.backtrack(source_1.str('~~'))), ns => [typed_dom_1.html('del', util_1.defrag(ns))])));
        },
        {
            '../../combinator': 31,
            '../inline': 82,
            '../source': 120,
            '../util': 128,
            'typed-dom': 24
        }
    ],
    95: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const inline_1 = _dereq_('../inline');
            const combinator_1 = _dereq_('../../combinator');
            const strong_1 = _dereq_('./strong');
            const source_1 = _dereq_('../source');
            const util_1 = _dereq_('../util');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.emphasis = combinator_1.lazy(() => combinator_1.creation(combinator_1.fmap(combinator_1.open(source_1.str('*'), combinator_1.close(util_1.startTight(combinator_1.some(combinator_1.union([
                strong_1.strong,
                combinator_1.some(inline_1.inline, '*')
            ]))), combinator_1.backtrack(source_1.str('*')), true, void 0, (ns, rest) => [
                [typed_dom_1.html('em', ns.pop() && util_1.defrag(ns))],
                rest
            ], (ns, rest) => [
                ns,
                rest
            ])), ns => 'id' in ns[1] && ns[1].nodeName === 'EM' ? ns.shift() && ns : ns)));
        },
        {
            '../../combinator': 31,
            '../inline': 82,
            '../source': 120,
            '../util': 128,
            './strong': 115,
            'typed-dom': 24
        }
    ],
    96: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const inline_1 = _dereq_('../inline');
            const combinator_1 = _dereq_('../../combinator');
            const emphasis_1 = _dereq_('./emphasis');
            const strong_1 = _dereq_('./strong');
            const source_1 = _dereq_('../source');
            const util_1 = _dereq_('../util');
            const typed_dom_1 = _dereq_('typed-dom');
            const concat_1 = _dereq_('spica/concat');
            exports.emstrong = combinator_1.lazy(() => combinator_1.creation(combinator_1.bind(combinator_1.open(source_1.str('***'), combinator_1.close(util_1.startTight(combinator_1.union([combinator_1.some(inline_1.inline, '*')])), combinator_1.backtrack(source_1.str(/^\*{1,3}/)), true)), (ns, rest, _, context) => {
                if (ns.length === 1)
                    return;
                switch (ns[ns.length - 1].textContent) {
                case '*':
                    return combinator_1.fmap(strong_1.strong, ms => 'id' in ms[0] ? [typed_dom_1.html('strong', [
                            typed_dom_1.html('em', util_1.defrag(ns.slice(1, -1))),
                            ...util_1.defrag(ms)[0].childNodes
                        ])] : concat_1.concat(ns, ms.shift() && ms))('**' + rest, context) || [
                        ns,
                        rest
                    ];
                case '**':
                    return combinator_1.fmap(emphasis_1.emphasis, ms => 'id' in ms[0] ? [typed_dom_1.html('em', [
                            typed_dom_1.html('strong', util_1.defrag(ns.slice(1, -1))),
                            ...util_1.defrag(ms)[0].childNodes
                        ])] : concat_1.concat(ns, ms.shift() && ms))('*' + rest, context) || [
                        ns,
                        rest
                    ];
                case '***':
                    return [
                        [typed_dom_1.html('em', [typed_dom_1.html('strong', util_1.defrag(ns.slice(1, -1)))])],
                        rest
                    ];
                default:
                    return [
                        ns,
                        rest
                    ];
                }
            })));
        },
        {
            '../../combinator': 31,
            '../inline': 82,
            '../source': 120,
            '../util': 128,
            './emphasis': 95,
            './strong': 115,
            'spica/concat': 10,
            'typed-dom': 24
        }
    ],
    97: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../combinator');
            const source_1 = _dereq_('../source');
            const repeat = source_1.str(/^(.)\1*/);
            exports.escape = combinator_1.creation(combinator_1.union([(source, context) => {
                    if (source.length < 3)
                        return;
                    switch (source[0]) {
                    case '*':
                        if (source.length < 4)
                            return;
                        return source[1] === source[0] && source[2] === source[0] && source[3] === source[0] ? repeat(source, context) : void 0;
                    case '+':
                    case '~':
                    case '=':
                        return source[1] === source[0] && source[2] === source[0] ? repeat(source, context) : void 0;
                    default:
                        return;
                    }
                }]));
        },
        {
            '../../combinator': 31,
            '../source': 120
        }
    ],
    98: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
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
            '../../combinator': 31,
            './extension/data': 99,
            './extension/index': 100,
            './extension/label': 103,
            './extension/placeholder': 104
        }
    ],
    99: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const inline_1 = _dereq_('../../inline');
            const combinator_1 = _dereq_('../../../combinator');
            const source_1 = _dereq_('../../source');
            const util_1 = _dereq_('../../util');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.data = combinator_1.lazy(() => combinator_1.creation(combinator_1.fmap(combinator_1.surround('[~', combinator_1.inits([
                source_1.str(/^[a-z]+(?:-[a-z0-9]+)*(?:=[a-z0-9]+(?:-[a-z0-9]+)*)?(?=[|\]])/),
                source_1.char('|'),
                util_1.startTight(combinator_1.some(inline_1.inline, ']'))
            ]), combinator_1.backtrack(source_1.str(']'))), ns => [typed_dom_1.html('span', attr(ns.shift().textContent), ns.shift() && util_1.defrag(ns))])));
            function attr(data) {
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
            '../../../combinator': 31,
            '../../inline': 82,
            '../../source': 120,
            '../../util': 128,
            'typed-dom': 24
        }
    ],
    100: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const inline_1 = _dereq_('../../inline');
            const combinator_1 = _dereq_('../../../combinator');
            const indexee_1 = _dereq_('./indexee');
            const source_1 = _dereq_('../../source');
            const util_1 = _dereq_('../../util');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.index = combinator_1.lazy(() => combinator_1.creation(combinator_1.fmap(indexee_1.indexee(combinator_1.fmap(combinator_1.surround('[#', combinator_1.subline(combinator_1.update({
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
            }, util_1.startTight(combinator_1.union([combinator_1.some(inline_1.inline, ']')])))), combinator_1.backtrack(source_1.str(']'))), ns => [typed_dom_1.html('a', util_1.defrag(ns))])), ([el]) => [typed_dom_1.define(el, {
                    id: null,
                    class: 'index',
                    href: el.id ? `#${ el.id }` : void 0
                }, el.childNodes)])));
        },
        {
            '../../../combinator': 31,
            '../../inline': 82,
            '../../source': 120,
            '../../util': 128,
            './indexee': 101,
            'typed-dom': 24
        }
    ],
    101: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../../combinator');
            const typed_dom_1 = _dereq_('typed-dom');
            function indexee(parser) {
                return combinator_1.fmap(parser, ([el]) => [typed_dom_1.define(el, { id: identity(text(el)) || void 0 })]);
            }
            exports.indexee = indexee;
            function text(source) {
                const indexer = [...source.children].find(el => el.classList.contains('indexer'));
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
                return index ? `index:${ index.trim().replace(/\s+/g, '_') }` : '';
            }
        },
        {
            '../../../combinator': 31,
            'typed-dom': 24
        }
    ],
    102: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../../combinator');
            const index_1 = _dereq_('./index');
            const source_1 = _dereq_('../../source');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.indexer = combinator_1.when(combinator_1.open(source_1.str(/^\s+(?=\[#)/), combinator_1.union([index_1.index])), (ns, rest) => ns.length === 2 && rest.trim() === '', ([, el]) => [
                [typed_dom_1.html('span', {
                        class: 'indexer',
                        'data-index': el.getAttribute('href').slice(el.hash.indexOf(':') + 1)
                    })],
                ''
            ]);
        },
        {
            '../../../combinator': 31,
            '../../source': 120,
            './index': 100,
            'typed-dom': 24
        }
    ],
    103: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../../combinator');
            const source_1 = _dereq_('../../source');
            const typed_dom_1 = _dereq_('typed-dom');
            const body = source_1.str(/^(?:\$[a-z]*)(?:(?:-[a-z][0-9a-z]*)+(?:-0(?:\.0){0,2})?|-[0-9]+(?:\.[0-9]+){0,2})/);
            exports.label = combinator_1.creation(combinator_1.fmap(combinator_1.union([
                combinator_1.surround('[', body, ']'),
                body
            ]), ([text]) => [typed_dom_1.html('a', {
                    class: 'label',
                    'data-label': text.data.slice(text.data[1] === '-' ? 0 : 1)
                }, [text])]));
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
                return ms.join('.');
            }
        },
        {
            '../../../combinator': 31,
            '../../source': 120,
            'typed-dom': 24
        }
    ],
    104: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const inline_1 = _dereq_('../../inline');
            const combinator_1 = _dereq_('../../../combinator');
            const source_1 = _dereq_('../../source');
            const util_1 = _dereq_('../../util');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.placeholder = combinator_1.lazy(() => combinator_1.creation(combinator_1.fmap(combinator_1.surround(/^\[[:^]/, combinator_1.update({
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
            }, util_1.startTight(combinator_1.some(combinator_1.union([inline_1.inline]), ']'))), combinator_1.backtrack(source_1.str(']'))), ns => [typed_dom_1.html('span', {
                    class: 'invalid',
                    'data-invalid-syntax': 'extension',
                    'data-invalid-message': 'Invalid flag'
                }, util_1.defrag(ns))])));
        },
        {
            '../../../combinator': 31,
            '../../inline': 82,
            '../../source': 120,
            '../../util': 128,
            'typed-dom': 24
        }
    ],
    105: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const global_1 = _dereq_('spica/global');
            const alias_1 = _dereq_('spica/alias');
            const inline_1 = _dereq_('../inline');
            const combinator_1 = _dereq_('../../combinator');
            const source_1 = _dereq_('../source');
            const util_1 = _dereq_('../util');
            const memoize_1 = _dereq_('spica/memoize');
            const concat_1 = _dereq_('spica/concat');
            const typed_dom_1 = _dereq_('typed-dom');
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
            exports.html = combinator_1.lazy(() => combinator_1.creation(combinator_1.validate('<', combinator_1.union([
                combinator_1.match(/^(?=<(wbr)(?=[ >]))/, combinator_1.memoize(([, tag]) => tag, tag => combinator_1.close_(combinator_1.open_(source_1.str(`<${ tag }`), combinator_1.some(combinator_1.union([exports.attribute])), true), combinator_1.backtrack(source_1.str('>')), ([, as], rest) => [
                    [typed_dom_1.html(tag, makeAttrs(attributes[tag], as.map(t => t.data), [], 'html'))],
                    rest
                ]))),
                combinator_1.match(/^(?=<(sup|sub|small|bdo|bdi)(?=[ >]))/, combinator_1.memoize(([, tag]) => tag, tag => combinator_1.close_(combinator_1.open_(combinator_1.close_(combinator_1.open_(source_1.str(`<${ tag }`), combinator_1.some(combinator_1.union([exports.attribute])), true), combinator_1.backtrack(source_1.str('>'))), util_1.startTight(combinator_1.update((() => {
                    switch (tag) {
                    case 'bdo':
                    case 'bdi':
                        return { state: { in: { bdx: true } } };
                    case 'sup':
                    case 'sub':
                        return { state: { in: { supsub: true } } };
                    case 'small':
                    default:
                        return { state: { in: { small: true } } };
                    }
                })(), combinator_1.some(combinator_1.union([inline_1.inline]), `</${ tag }>`)))), combinator_1.backtrack(source_1.str(`</${ tag }>`)), ([as, bs, cs], rest, _, context) => [
                    [elem(tag, as, bs, cs, context)],
                    rest
                ]))),
                combinator_1.match(/^(?=<([a-z]+)(?=[ >]))/, ([, tag]) => combinator_1.close_(combinator_1.open_(combinator_1.close_(combinator_1.open_(source_1.str(`<${ tag }`), combinator_1.some(combinator_1.union([exports.attribute])), true), combinator_1.backtrack(source_1.str('>'))), util_1.startTight(combinator_1.some(combinator_1.union([inline_1.inline]), `</${ tag }>`))), combinator_1.backtrack(source_1.str(`</${ tag }>`)), ([as, bs, cs], rest) => [
                    [elem(tag, as, bs, cs, {})],
                    rest
                ]))
            ]))));
            exports.attribute = combinator_1.creation(combinator_1.union([source_1.str(/^ [a-z]+(?:-[a-z]+)*(?:="(?:\\[^\n]|[^\n"])*")?(?=[ >])/)]));
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
                case as[as.length - 1].textContent !== '>' || 'data-invalid-syntax' in (attrs = makeAttrs(attributes[tag], as.slice(1, -1).map(a => a.textContent), [], 'html')):
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
                }, util_1.defrag(concat_1.concat(concat_1.concat(as, bs), cs)));
            }
            const requiredAttributes = memoize_1.memoize(spec => alias_1.ObjectEntries(spec).filter(([, v]) => alias_1.isFrozen(v)), new global_1.WeakMap());
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
                    attrs.class = classes.join(' ').trim();
                    attrs['data-invalid-syntax'] = syntax;
                    attrs['data-invalid-message'] = syntax === 'html' ? 'Invalid attribute' : 'Invalid parameter';
                }
                return attrs;
            }
            exports.makeAttrs = makeAttrs;
        },
        {
            '../../combinator': 31,
            '../inline': 82,
            '../source': 120,
            '../util': 128,
            'spica/alias': 5,
            'spica/concat': 10,
            'spica/global': 13,
            'spica/memoize': 14,
            'typed-dom': 24
        }
    ],
    106: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../combinator');
            const typed_dom_1 = _dereq_('typed-dom');
            const parser = typed_dom_1.html('span');
            exports.htmlentity = combinator_1.creation(combinator_1.focus(/^&(?:[0-9a-z]+|#[0-9]{1,8}|#x[0-9a-f]{1,8});/i, entity => [
                [[
                        parser.innerHTML = entity,
                        parser.firstChild.cloneNode()
                    ][1]],
                ''
            ]));
        },
        {
            '../../combinator': 31,
            'typed-dom': 24
        }
    ],
    107: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const inline_1 = _dereq_('../inline');
            const combinator_1 = _dereq_('../../combinator');
            const source_1 = _dereq_('../source');
            const util_1 = _dereq_('../util');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.insertion = combinator_1.lazy(() => combinator_1.creation(combinator_1.fmap(combinator_1.surround('++', combinator_1.some(combinator_1.union([inline_1.inline]), '++'), combinator_1.backtrack(source_1.str('++'))), ns => [typed_dom_1.html('ins', util_1.defrag(ns))])));
        },
        {
            '../../combinator': 31,
            '../inline': 82,
            '../source': 120,
            '../util': 128,
            'typed-dom': 24
        }
    ],
    108: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const global_1 = _dereq_('spica/global');
            const alias_1 = _dereq_('spica/alias');
            const inline_1 = _dereq_('../inline');
            const combinator_1 = _dereq_('../../combinator');
            const source_1 = _dereq_('../source');
            const html_1 = _dereq_('./html');
            const autolink_1 = _dereq_('../autolink');
            const util_1 = _dereq_('../util');
            const typed_dom_1 = _dereq_('typed-dom');
            const {origin} = global_1.location;
            const log = new WeakSet();
            exports.attributes = { nofollow: [void 0] };
            void alias_1.ObjectSetPrototypeOf(exports.attributes, null);
            exports.link = combinator_1.lazy(() => combinator_1.creation(combinator_1.bind(combinator_1.fmap(combinator_1.guard(context => {
                var _a, _b, _c;
                return (_c = (_b = (_a = context.syntax) === null || _a === void 0 ? void 0 : _a.inline) === null || _b === void 0 ? void 0 : _b.link) !== null && _c !== void 0 ? _c : true;
            }, combinator_1.tails([
                util_1.dup(combinator_1.union([
                    combinator_1.surround('[', inline_1.media, ']'),
                    combinator_1.surround('[', inline_1.shortmedia, ']'),
                    combinator_1.surround('[', combinator_1.update({
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
                    }, util_1.startTight(combinator_1.some(inline_1.inline, /^\\?\n|^]/))), combinator_1.backtrack(source_1.char(']')), false)
                ])),
                util_1.dup(combinator_1.surround(/^{(?![{}])/, combinator_1.inits([
                    exports.uri,
                    combinator_1.some(exports.attribute)
                ]), combinator_1.backtrack(source_1.str(/^ ?}/))))
            ])), nss => nss.length === 1 ? [
                [],
                nss[0]
            ] : nss), ([content, param], rest, _, context) => {
                var _a;
                switch (true) {
                case content.length === 0:
                    break;
                case content.length === 1 && content[0].nodeName === 'A' && ((_a = content[0].firstElementChild) === null || _a === void 0 ? void 0 : _a.classList.contains('media')) && !log.has(content[0].firstElementChild):
                    content[0] = content[0].firstElementChild;
                    log.add(content[0]);
                    break;
                case !context.insecure && !!typed_dom_1.frag(combinator_1.eval(combinator_1.some(autolink_1.autolink)(util_1.stringify(content), Object.assign(Object.assign({}, context), { insecure: true })))).firstElementChild:
                    return;
                }
                const [INSECURE_URL, ...params] = param.map(t => t.data);
                const el = typed_dom_1.html('a', {
                    href: INSECURE_URL,
                    rel: `noopener${ params.includes(' nofollow') ? ' nofollow noreferrer' : '' }`
                }, content.length > 0 ? content = util_1.defrag(content) : decode(INSECURE_URL || '.').replace(/^tel:/, '').replace(/^h(?=ttps?:\/\/[^/?#\s])/, params.includes(' nofollow') ? '' : 'h'));
                if (!verify(el, INSECURE_URL))
                    return [
                        [el],
                        rest
                    ];
                void typed_dom_1.define(el, alias_1.ObjectAssign(html_1.makeAttrs(exports.attributes, params, [...el.classList], 'link'), { nofollow: void 0 }));
                return [
                    [el],
                    rest
                ];
            })));
            exports.uri = combinator_1.creation(combinator_1.match(/^ ?(?! )/, combinator_1.memoize(([delim]) => delim, delim => combinator_1.union([source_1.str(delim ? /^\S+/ : /^[^\s{}]+/)]))));
            exports.attribute = combinator_1.creation(combinator_1.union([source_1.str(/^ [a-z]+(?:-[a-z]+)*(?:="(?:\\[^\n]|[^\n"])*")?(?=[ }])/)]));
            function verify(el, url) {
                let message;
                switch (el.protocol) {
                case 'tel:':
                    if (`tel:${ el.innerHTML.replace(/-(?=[0-9])/g, '') }` === url)
                        return true;
                    void typed_dom_1.define(el, {
                        class: 'invalid',
                        'data-invalid-syntax': 'link',
                        'data-invalid-message': 'Invalid protocol'
                    });
                    message = 'Invalid phone number';
                    break;
                case 'http:':
                case 'https:': {
                        const {host} = el;
                        host && el.origin !== origin && void el.setAttribute('target', '_blank');
                        if (host)
                            return true;
                        message = 'Invalid host';
                        break;
                    }
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
            '../../combinator': 31,
            '../autolink': 61,
            '../inline': 82,
            '../source': 120,
            '../util': 128,
            './html': 105,
            'spica/alias': 5,
            'spica/global': 13,
            'typed-dom': 24
        }
    ],
    109: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const inline_1 = _dereq_('../inline');
            const combinator_1 = _dereq_('../../combinator');
            const source_1 = _dereq_('../source');
            const util_1 = _dereq_('../util');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.mark = combinator_1.lazy(() => combinator_1.creation(combinator_1.fmap(combinator_1.surround('==', combinator_1.some(combinator_1.union([inline_1.inline]), '=='), combinator_1.backtrack(source_1.str('=='))), ns => [typed_dom_1.html('mark', util_1.defrag(ns))])));
        },
        {
            '../../combinator': 31,
            '../inline': 82,
            '../source': 120,
            '../util': 128,
            'typed-dom': 24
        }
    ],
    110: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../combinator');
            const source_1 = _dereq_('../source');
            const typed_dom_1 = _dereq_('typed-dom');
            const cache_1 = _dereq_('spica/cache');
            exports.cache = new cache_1.Cache(20);
            exports.math = combinator_1.creation(combinator_1.fmap(combinator_1.surround('${', combinator_1.union([source_1.str(/^(?:(?!}\$)[^\n])+/)]), combinator_1.backtrack(source_1.str('}$'))), ([{data: source}]) => exports.cache.has(source = `\${${ source.trim() }}$`) ? [exports.cache.get(source).cloneNode(true)] : [typed_dom_1.html('span', {
                    class: 'math notranslate',
                    'data-src': source
                }, source)]));
        },
        {
            '../../combinator': 31,
            '../source': 120,
            'spica/cache': 8,
            'typed-dom': 24
        }
    ],
    111: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const global_1 = _dereq_('spica/global');
            const alias_1 = _dereq_('spica/alias');
            const combinator_1 = _dereq_('../../combinator');
            const link_1 = _dereq_('./link');
            const source_1 = _dereq_('../source');
            const html_1 = _dereq_('./html');
            const util_1 = _dereq_('../util');
            const concat_1 = _dereq_('spica/concat');
            const typed_dom_1 = _dereq_('typed-dom');
            const cache_1 = _dereq_('spica/cache');
            const url = typed_dom_1.html('a');
            exports.cache = new cache_1.Cache(10);
            exports.media = combinator_1.creation(combinator_1.bind(combinator_1.fmap(combinator_1.surround('!', combinator_1.guard(context => {
                var _a, _b, _c;
                return (_c = (_b = (_a = context.syntax) === null || _a === void 0 ? void 0 : _a.inline) === null || _b === void 0 ? void 0 : _b.media) !== null && _c !== void 0 ? _c : true;
            }, combinator_1.tails([
                util_1.dup(combinator_1.surround('[', combinator_1.union([source_1.str(/^(?!\\?\s)(?:[^\]\n]|\\[^\n])+/)]), combinator_1.backtrack(source_1.char(']')), false)),
                util_1.dup(combinator_1.surround(/^{(?![{}])/, combinator_1.inits([
                    link_1.uri,
                    combinator_1.some(link_1.attribute)
                ]), combinator_1.backtrack(source_1.str(/^ ?}/))))
            ])), ''), ts => {
                var _a;
                return concat_1.concat([ts.length > 1 && ((_a = ts[ts.length - 2][0]) === null || _a === void 0 ? void 0 : _a.data) || ''], ts[ts.length - 1].map(t => t.data));
            }), ([text, INSECURE_URL, ...params], rest) => {
                var _a;
                text = text.trim().replace(/\\(.?)/g, '$1');
                url.href = INSECURE_URL;
                const media = void 0 || ((_a = exports.cache.get(url.href)) === null || _a === void 0 ? void 0 : _a.cloneNode(true)) || typed_dom_1.html('img', {
                    class: 'media',
                    'data-src': INSECURE_URL.replace(/\s+/g, global_1.encodeURI),
                    alt: text
                });
                if (exports.cache.has(url.href) && media.hasAttribute('alt')) {
                    void typed_dom_1.define(media, { alt: text });
                }
                void typed_dom_1.define(media, alias_1.ObjectAssign(html_1.makeAttrs(link_1.attributes, params, [...media.classList], 'media'), { nofollow: void 0 }));
                return combinator_1.fmap(link_1.link, ([el]) => [typed_dom_1.define(el, { target: '_blank' }, [typed_dom_1.define(media, { 'data-src': el.getAttribute('href') })])])(`{ ${ INSECURE_URL }${ params.join('') } }${ rest }`, {});
            }));
        },
        {
            '../../combinator': 31,
            '../source': 120,
            '../util': 128,
            './html': 105,
            './link': 108,
            'spica/alias': 5,
            'spica/cache': 8,
            'spica/concat': 10,
            'spica/global': 13,
            'typed-dom': 24
        }
    ],
    112: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../combinator');
            const inline_1 = _dereq_('../inline');
            const source_1 = _dereq_('../source');
            const util_1 = _dereq_('../util');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.reference = combinator_1.lazy(() => combinator_1.creation(combinator_1.fmap(combinator_1.surround('[[', combinator_1.guard(context => {
                var _a, _b, _c;
                return (_c = (_b = (_a = context.syntax) === null || _a === void 0 ? void 0 : _a.inline) === null || _b === void 0 ? void 0 : _b.reference) !== null && _c !== void 0 ? _c : true;
            }, combinator_1.subline(combinator_1.update({
                syntax: {
                    inline: {
                        annotation: false,
                        reference: false,
                        extension: true,
                        media: false,
                        link: true,
                        autolink: true
                    }
                }
            }, util_1.startTight(combinator_1.subsequence([
                alias,
                combinator_1.some(inline_1.inline, ']]')
            ]))))), combinator_1.backtrack(source_1.str(']]'))), ns => [typed_dom_1.html('sup', {
                    class: 'reference',
                    'data-alias': ns[0].nodeName === 'ABBR' ? ns.shift().textContent : undefined
                }, util_1.defrag(ns))])));
            const alias = combinator_1.creation(combinator_1.focus(/^~[A-za-z][A-Za-z0-9',-]*(?: [A-Za-z0-9',-]+)*(?:(?=]])|\|(?:(?=]])| ))/, source => [
                [typed_dom_1.html('abbr', source.slice(1, ~(~source.indexOf('|', -2) || ~source.length)))],
                ''
            ]));
        },
        {
            '../../combinator': 31,
            '../inline': 82,
            '../source': 120,
            '../util': 128,
            'typed-dom': 24
        }
    ],
    113: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../combinator');
            const htmlentity_1 = _dereq_('./htmlentity');
            const source_1 = _dereq_('../source');
            const util_1 = _dereq_('../util');
            const concat_1 = _dereq_('spica/concat');
            const typed_dom_1 = _dereq_('typed-dom');
            const parser = combinator_1.some(combinator_1.union([
                combinator_1.fmap(htmlentity_1.htmlentity, ts => [ts[0].data]),
                s => {
                    const i = s.indexOf('&');
                    return i === -1 ? [
                        [s],
                        ''
                    ] : [
                        [s.slice(0, i || 1)],
                        s.slice(i || 1)
                    ];
                }
            ]));
            exports.ruby = combinator_1.creation(combinator_1.bind(combinator_1.sequence([
                combinator_1.surround('[', source_1.str(/^(?!\\?\s)(?:[^\]\n]|\\[^\n])+/), combinator_1.backtrack(source_1.char(']'))),
                combinator_1.backtrack(combinator_1.surround('(', source_1.str(/^(?:[^\)\n]|\\[^\n])+/), combinator_1.backtrack(source_1.char(')'))))
            ]), ([{data: t}, {data: r}], rest, _, context) => {
                const texts = split(combinator_1.eval(parser(t, context)).join(''));
                const rubies = split(combinator_1.eval(parser(r, context)).join(''));
                if (!texts.join('').trim() || !rubies.join('').trim())
                    return;
                switch (true) {
                case rubies.length <= texts.length:
                    return [
                        [typed_dom_1.html('ruby', util_1.defrag(texts.reduce((acc, _, i) => concat_1.concat(concat_1.concat(acc, [typed_dom_1.text(texts[i])]), i < rubies.length && rubies[i].trim() !== '' ? [
                                typed_dom_1.html('rp', '('),
                                typed_dom_1.html('rt', rubies[i]),
                                typed_dom_1.html('rp', ')')
                            ] : [typed_dom_1.html('rt')]), [])))],
                        rest
                    ];
                case texts.length === 1 && [...texts[0]].length >= rubies.length:
                    return [
                        [typed_dom_1.html('ruby', util_1.defrag([...texts[0]].reduce((acc, _, i, texts) => concat_1.concat(concat_1.concat(acc, [typed_dom_1.text(texts[i])]), i < rubies.length && rubies[i].trim() !== '' ? [
                                typed_dom_1.html('rp', '('),
                                typed_dom_1.html('rt', rubies[i]),
                                typed_dom_1.html('rp', ')')
                            ] : [typed_dom_1.html('rt')]), [])))],
                        rest
                    ];
                default:
                    return [
                        [typed_dom_1.html('ruby', util_1.defrag([
                                typed_dom_1.text(texts.join(' ')),
                                typed_dom_1.html('rp', '('),
                                typed_dom_1.html('rt', rubies.join(' ') || void 0),
                                typed_dom_1.html('rp', ')')
                            ]))],
                        rest
                    ];
                }
            }));
            function split(target) {
                const acc = [''];
                for (let i = 0; i < target.length; ++i) {
                    switch (target[i]) {
                    case ' ':
                    case '\t':
                        void acc.push('');
                        continue;
                    case '\\':
                        acc[acc.length - 1] += target[++i];
                        continue;
                    default:
                        acc[acc.length - 1] += target[i];
                        continue;
                    }
                }
                return acc;
            }
        },
        {
            '../../combinator': 31,
            '../source': 120,
            '../util': 128,
            './htmlentity': 106,
            'spica/concat': 10,
            'typed-dom': 24
        }
    ],
    114: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../combinator');
            const url_1 = _dereq_('./autolink/url');
            const media_1 = _dereq_('./media');
            exports.shortmedia = combinator_1.rewrite(combinator_1.guard(context => {
                var _a, _b, _c;
                return (_c = (_b = (_a = context.syntax) === null || _a === void 0 ? void 0 : _a.inline) === null || _b === void 0 ? void 0 : _b.media) !== null && _c !== void 0 ? _c : true;
            }, combinator_1.surround('!', url_1.url, '')), combinator_1.convert(source => `!{ ${ url_1.address(source.slice(1)) }${ url_1.attribute(source.slice(1)) } }`, combinator_1.union([media_1.media])));
        },
        {
            '../../combinator': 31,
            './autolink/url': 90,
            './media': 111
        }
    ],
    115: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const inline_1 = _dereq_('../inline');
            const combinator_1 = _dereq_('../../combinator');
            const emphasis_1 = _dereq_('./emphasis');
            const source_1 = _dereq_('../source');
            const util_1 = _dereq_('../util');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.strong = combinator_1.lazy(() => combinator_1.creation(combinator_1.fmap(combinator_1.open(source_1.str('**'), combinator_1.close(util_1.startTight(combinator_1.some(combinator_1.union([
                emphasis_1.emphasis,
                combinator_1.some(inline_1.inline, '*')
            ]), '**')), combinator_1.backtrack(source_1.str('**')), true, void 0, (ns, rest) => [
                [typed_dom_1.html('strong', ns.pop() && util_1.defrag(ns))],
                rest
            ], (ns, rest) => [
                ns,
                rest
            ])), ns => 'id' in ns[1] && ns[1].nodeName === 'STRONG' ? ns.shift() && ns : ns)));
        },
        {
            '../../combinator': 31,
            '../inline': 82,
            '../source': 120,
            '../util': 128,
            './emphasis': 95,
            'typed-dom': 24
        }
    ],
    116: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const inline_1 = _dereq_('../inline');
            const combinator_1 = _dereq_('../../combinator');
            const source_1 = _dereq_('../source');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.template = combinator_1.lazy(() => combinator_1.creation(combinator_1.rewrite(combinator_1.surround('{{', combinator_1.some(inline_1.inline, '}}'), combinator_1.backtrack(source_1.str('}}')), false), source => [
                [typed_dom_1.html('span', { class: 'template' }, source)],
                ''
            ])));
        },
        {
            '../../combinator': 31,
            '../inline': 82,
            '../source': 120,
            'typed-dom': 24
        }
    ],
    117: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
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
                    const str = text(node);
                    if (str)
                        return [...str.slice(-2)].pop() || '';
                    node = node.previousSibling;
                }
                return '';
            }
            function text(node) {
                switch (node.nodeName) {
                case 'RUBY':
                    for (let i = node.childNodes.length; i--;) {
                        const child = node.childNodes[i];
                        switch (child.nodeName) {
                        case 'RT':
                        case 'RP':
                            break;
                        default:
                            return child.textContent;
                        }
                    }
                    return '';
                default:
                    return 'data' in node ? node.data : node.textContent;
                }
            }
        },
        {
            '../combinator': 31,
            './locale/ja': 118,
            'typed-dom': 24
        }
    ],
    118: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const endings = /^[、。！？]/;
            function japanese(char) {
                return endings.test(char);
            }
            exports.japanese = japanese;
        },
        {}
    ],
    119: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
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
            '../combinator': 31,
            './api/normalize': 59,
            './block/codeblock': 64,
            './block/extension': 66,
            './block/mathblock': 74,
            './source': 120
        }
    ],
    120: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var text_1 = _dereq_('./source/text');
            exports.text = text_1.text;
            var linebreak_1 = _dereq_('./source/linebreak');
            exports.linebreak = linebreak_1.linebreak;
            var escapable_1 = _dereq_('./source/escapable');
            exports.escsource = escapable_1.escsource;
            var unescapable_1 = _dereq_('./source/unescapable');
            exports.unescsource = unescapable_1.unescsource;
            var str_1 = _dereq_('./source/str');
            exports.str = str_1.str;
            var char_1 = _dereq_('./source/char');
            exports.char = char_1.char;
            var line_1 = _dereq_('./source/line');
            exports.contentline = line_1.contentline;
            exports.emptyline = line_1.emptyline;
            exports.anyline = line_1.anyline;
        },
        {
            './source/char': 121,
            './source/escapable': 122,
            './source/line': 123,
            './source/linebreak': 124,
            './source/str': 125,
            './source/text': 126,
            './source/unescapable': 127
        }
    ],
    121: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../combinator');
            const typed_dom_1 = _dereq_('typed-dom');
            function char(char) {
                return combinator_1.creation(source => {
                    if (source === '')
                        return;
                    switch (source[0]) {
                    case char:
                        return [
                            [typed_dom_1.text(source.slice(0, 1))],
                            source.slice(1)
                        ];
                    default:
                        return;
                    }
                });
            }
            exports.char = char;
            ;
        },
        {
            '../../combinator': 31,
            'typed-dom': 24
        }
    ],
    122: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../combinator');
            const typed_dom_1 = _dereq_('typed-dom');
            const separator = /\s|(?=[\x00-\x7F])[^A-Za-z0-9\s]/;
            exports.escsource = combinator_1.creation(source => {
                if (source === '')
                    return;
                const i = source.search(separator);
                switch (i) {
                case -1:
                    return [
                        [typed_dom_1.text(source)],
                        ''
                    ];
                case 0:
                    switch (source[0]) {
                    case '\\':
                        return [
                            [typed_dom_1.text(source.slice(0, 2))],
                            source.slice(2)
                        ];
                    default:
                        return [
                            [typed_dom_1.text(source.slice(0, 1))],
                            source.slice(1)
                        ];
                    }
                default:
                    return [
                        [typed_dom_1.text(source.slice(0, i))],
                        source.slice(i)
                    ];
                }
            });
        },
        {
            '../../combinator': 31,
            'typed-dom': 24
        }
    ],
    123: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
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
        { '../../combinator': 31 }
    ],
    124: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../combinator');
            const text_1 = _dereq_('./text');
            exports.linebreak = combinator_1.fmap(combinator_1.focus('\n', combinator_1.union([text_1.text])), ns => ns);
        },
        {
            '../../combinator': 31,
            './text': 126
        }
    ],
    125: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../combinator');
            const typed_dom_1 = _dereq_('typed-dom');
            function str(pat) {
                return typeof pat === 'string' ? combinator_1.creation(source => {
                    if (source === '')
                        return;
                    return source.slice(0, pat.length) === pat ? [
                        [typed_dom_1.text(pat)],
                        source.slice(pat.length)
                    ] : void 0;
                }) : combinator_1.creation(source => {
                    if (source === '')
                        return;
                    const m = source.match(pat);
                    return m && m[0].length > 0 ? [
                        [typed_dom_1.text(m[0])],
                        source.slice(m[0].length)
                    ] : void 0;
                });
            }
            exports.str = str;
            ;
        },
        {
            '../../combinator': 31,
            'typed-dom': 24
        }
    ],
    126: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../combinator');
            const str_1 = _dereq_('./str');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.separator = /\s|(?=[^A-Za-z0-9\s])[\x00-\x7F]|[A-Za-z0-9][A-Za-z0-9.+_-]*@[A-Za-z0-9]|\S#/;
            const next = /[\S\n]|$/;
            const repeat = str_1.str(/^(.)\1*/);
            exports.text = combinator_1.creation((source, context) => {
                if (source === '')
                    return;
                const i = source.search(exports.separator);
                switch (i) {
                case -1:
                    return [
                        [typed_dom_1.text(source)],
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
                                [typed_dom_1.text(source.slice(1, 2))],
                                source.slice(2)
                            ];
                        }
                    case '\n':
                        return [
                            [typed_dom_1.html('br')],
                            source.slice(1)
                        ];
                    case '*':
                        return source[1] === source[0] ? repeat(source, context) : [
                            [typed_dom_1.text(source[0])],
                            source.slice(1)
                        ];
                    default:
                        const i = source[0].trim() === '' ? source.search(next) : 0;
                        return i === source.length || source[i] === '\n' || source[i] === '\\' && source[i + 1] === '\n' ? [
                            [],
                            source.slice(i)
                        ] : [
                            [typed_dom_1.text(source.slice(0, i || 1))],
                            source.slice(i || 1)
                        ];
                    }
                default:
                    return [
                        [typed_dom_1.text(source.slice(0, i))],
                        source.slice(i)
                    ];
                }
            });
        },
        {
            '../../combinator': 31,
            './str': 125,
            'typed-dom': 24
        }
    ],
    127: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../combinator');
            const text_1 = _dereq_('./text');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.unescsource = combinator_1.creation(source => {
                if (source === '')
                    return;
                const i = source.search(text_1.separator);
                switch (i) {
                case -1:
                    return [
                        [typed_dom_1.text(source)],
                        ''
                    ];
                case 0:
                    return [
                        [typed_dom_1.text(source.slice(0, 1))],
                        source.slice(1)
                    ];
                default:
                    return [
                        [typed_dom_1.text(source.slice(0, i))],
                        source.slice(i)
                    ];
                }
            });
        },
        {
            '../../combinator': 31,
            './text': 126,
            'typed-dom': 24
        }
    ],
    128: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../combinator');
            const comment_1 = _dereq_('./inline/comment');
            const typed_dom_1 = _dereq_('typed-dom');
            function isVisible(node) {
                return hasText(node) || hasMedia(node);
            }
            exports.isVisible = isVisible;
            function hasText(node) {
                return node.textContent.trim() !== '';
            }
            function hasMedia(node) {
                return node.getElementsByClassName('media').length > 0;
            }
            function startTight(parser) {
                return (source, context) => {
                    switch (true) {
                    case source === '':
                    case (source[0] === '\\' ? source[1] || '' : source[0]).trim() === '':
                    case source.length >= 5 && source[0] === '<' && source.slice(0, 5) === '<wbr>':
                        return;
                    case source.length >= 7 && source[0] === '<' && source[1] === '#' && comment_1.syntax.test(source):
                        context.resource && void --context.resource.backtrack;
                        return;
                    default:
                        return parser(source, context);
                    }
                };
            }
            exports.startTight = startTight;
            function dup(parser) {
                return combinator_1.fmap(parser, ns => [ns]);
            }
            exports.dup = dup;
            function defrag(nodes) {
                const acc = [];
                for (let i = 0, prev; i < nodes.length; ++i) {
                    const curr = nodes[i];
                    if ('data' in curr) {
                        const text = curr.data;
                        if (text === '')
                            continue;
                        if (prev && 'data' in prev) {
                            prev.data += text;
                            continue;
                        }
                    }
                    void acc.push(curr);
                    prev = curr;
                }
                return acc;
            }
            exports.defrag = defrag;
            function stringify(nodes) {
                return nodes.reduce((acc, node) => `${ acc }${ 'data' in node ? node.data : node.textContent }`, '');
            }
            exports.stringify = stringify;
            function suppress(target) {
                if (target.nodeName === 'OL') {
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
            '../combinator': 31,
            './inline/comment': 93,
            'typed-dom': 24
        }
    ],
    129: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var render_1 = _dereq_('./renderer/render');
            exports.render = render_1.render;
        },
        { './renderer/render': 130 }
    ],
    130: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
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
            './render/code': 131,
            './render/math': 132,
            './render/media': 133,
            'spica/global': 13,
            'spica/url': 21
        }
    ],
    131: [
        function (_dereq_, module, exports) {
            (function (global) {
                'use strict';
                Object.defineProperty(exports, '__esModule', { value: true });
                const Prism = typeof window !== 'undefined' ? window['Prism'] : typeof global !== 'undefined' ? global['Prism'] : null;
                function code(target) {
                    void requestAnimationFrame(() => void Prism.highlightElement(target, false));
                }
                exports.code = code;
            }.call(this, typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {}));
        },
        {}
    ],
    132: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
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
            '../../parser/inline/math': 110,
            'typed-dom': 24
        }
    ],
    133: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
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
            './media/audio': 134,
            './media/gist': 135,
            './media/image': 136,
            './media/pdf': 137,
            './media/slideshare': 138,
            './media/twitter': 139,
            './media/video': 140,
            './media/youtube': 141,
            'spica/global': 13
        }
    ],
    134: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
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
            '../../../parser/inline/media': 111,
            'typed-dom': 24
        }
    ],
    135: [
        function (_dereq_, module, exports) {
            (function (global) {
                'use strict';
                Object.defineProperty(exports, '__esModule', { value: true });
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
            '../../../parser': 55,
            '../../../parser/inline/media': 111,
            'spica/global': 13,
            'typed-dom': 24
        }
    ],
    136: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
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
            '../../../parser/inline/media': 111,
            'typed-dom': 24
        }
    ],
    137: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
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
            '../../../parser': 55,
            '../../../parser/inline/media': 111,
            'typed-dom': 24
        }
    ],
    138: [
        function (_dereq_, module, exports) {
            (function (global) {
                'use strict';
                Object.defineProperty(exports, '__esModule', { value: true });
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
            '../../../parser': 55,
            '../../../parser/inline/media': 111,
            'typed-dom': 24
        }
    ],
    139: [
        function (_dereq_, module, exports) {
            (function (global) {
                'use strict';
                Object.defineProperty(exports, '__esModule', { value: true });
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
            '../../../parser': 55,
            'spica/cache': 8,
            'spica/global': 13,
            'typed-dom': 24
        }
    ],
    140: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
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
            '../../../parser/inline/media': 111,
            'typed-dom': 24
        }
    ],
    141: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
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
            '../../../parser/inline/media': 111,
            'typed-dom': 24
        }
    ],
    142: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var toc_1 = _dereq_('./util/toc');
            exports.toc = toc_1.toc;
            var info_1 = _dereq_('./util/info');
            exports.info = info_1.info;
            var context_1 = _dereq_('./util/context');
            exports.context = context_1.context;
        },
        {
            './util/context': 143,
            './util/info': 146,
            './util/toc': 147
        }
    ],
    143: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
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
    144: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const global_1 = _dereq_('spica/global');
            const context_1 = _dereq_('./context');
            const inline_1 = _dereq_('../parser/inline');
            const label_1 = _dereq_('../parser/inline/extension/label');
            const multimap_1 = _dereq_('spica/multimap');
            const typed_dom_1 = _dereq_('typed-dom');
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
                    let number = label_1.number(label, numbers.has(group) && !inline_1.isFixed(label) ? numbers.get(group).split('.').slice(0, inline_1.isFormatted(label) ? label.slice(label.lastIndexOf('-') + 1).split('.').length : bases.length).join('.') : base);
                    if (number.split('.').pop() === '0') {
                        switch (true) {
                        case number === '0':
                            number = `0${ '.0'.repeat(bases.length - 1) }`;
                            break;
                        case number.startsWith('0.'):
                            number = bases.slice(0).reduce((ns, _, i, bs) => {
                                i === ns.length ? bs.length = i : ns[i] = +ns[i] > +bs[i] ? ns[i] : +ns[i] === 0 ? bs[i] : `${ +bs[i] + 1 }`;
                                return ns;
                            }, number.split('.')).join('.');
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
                    void typed_dom_1.define([...def.children].find(el => el.classList.contains('figindex')), group === '$' ? figindex : `${ figindex }. `);
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
                return cursor < bases.length || bases.length === 1 ? [
                    ...bases.slice(0, cursor - 1),
                    +bases[cursor - 1] + 1,
                    '0'
                ].join('.') : '';
            }
            function capitalize(label) {
                return label[0].toUpperCase() + label.slice(1);
            }
        },
        {
            '../parser/inline': 82,
            '../parser/inline/extension/label': 103,
            './context': 143,
            'spica/global': 13,
            'spica/multimap': 15,
            'typed-dom': 24
        }
    ],
    145: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const global_1 = _dereq_('spica/global');
            const context_1 = _dereq_('./context');
            const indexee_1 = _dereq_('../parser/inline/extension/indexee');
            const multimap_1 = _dereq_('spica/multimap');
            const memoize_1 = _dereq_('spica/memoize');
            const typed_dom_1 = _dereq_('typed-dom');
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
                            class: ref.classList.contains('invalid') ? undefined : [
                                ...ref.classList,
                                'invalid'
                            ].join(' '),
                            'data-invalid-syntax': syntax,
                            'data-invalid-message': 'Missing a content'
                        }), ((_a = refChild === null || refChild === void 0 ? void 0 : refChild.getAttribute('href')) === null || _a === void 0 ? void 0 : _a.slice(1)) === defId && refChild.textContent === marker(defIndex) ? undefined : [typed_dom_1.html('a', {
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
                                if (compare(children[count - 1], def))
                                    continue I;
                                yield footnote.removeChild(children[count - 1]);
                            }
                            if (children.length >= count && compare(children[count - 1], def))
                                continue;
                            yield footnote.insertBefore(def, children[count - 1] || null);
                        }
                    while (children.length > defs.size) {
                        yield footnote.removeChild(children[defs.size]);
                    }
                    return;
                };
            }
            function compare(a, b) {
                return a.id === b.id && a.innerHTML === b.innerHTML;
            }
        },
        {
            '../parser/inline/extension/indexee': 101,
            './context': 143,
            'spica/global': 13,
            'spica/memoize': 14,
            'spica/multimap': 15,
            'typed-dom': 24
        }
    ],
    146: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
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
        { './context': 143 }
    ],
    147: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const concat_1 = _dereq_('spica/concat');
            const typed_dom_1 = _dereq_('typed-dom');
            const Tags = [...Array(6)].map((_, i) => `H${ i + 1 }`);
            function toc(source) {
                const hs = [...source.children].filter(el => el.id !== '' && Tags.includes(el.tagName));
                return parse(cons(hs));
            }
            exports.toc = toc;
            function parse(node, index = []) {
                return typed_dom_1.html('ul', node.map(([el, cs], i) => {
                    const idx = [
                        ...index,
                        i + 1
                    ];
                    return typed_dom_1.html('li', [
                        typed_dom_1.html('a', {
                            href: `#${ el.id }`,
                            rel: 'noopener',
                            'data-index': idx.join('.')
                        }, el.textContent),
                        cs.length > 0 ? parse(cs, idx) : typed_dom_1.frag()
                    ]);
                }));
            }
            function cons(hs) {
                return hs.reduce((hss, h) => {
                    const hs = hss.pop() || [];
                    return hs.length === 0 || level(h) > level(hs[0]) ? concat_1.concat(hss, [concat_1.concat(hs, [h])]) : concat_1.concat(hss, [
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
            'spica/concat': 10,
            'typed-dom': 24
        }
    ],
    'securemark': [
        function (_dereq_, module, exports) {
            'use strict';
            function __export(m) {
                for (var p in m)
                    if (!exports.hasOwnProperty(p))
                        exports[p] = m[p];
            }
            Object.defineProperty(exports, '__esModule', { value: true });
            _dereq_('spica/global');
            __export(_dereq_('./src/parser'));
            __export(_dereq_('./src/util'));
            __export(_dereq_('./src/renderer'));
        },
        {
            './src/parser': 55,
            './src/renderer': 129,
            './src/util': 142,
            'spica/global': 13
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