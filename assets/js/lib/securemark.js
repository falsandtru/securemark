/*! securemark v0.203.3 https://github.com/falsandtru/securemark | (c) 2017, falsandtru | UNLICENSED */
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
            exports.isArray = exports.ObjectValues = exports.ObjectSetPrototypeOf = exports.ObjectSeal = exports.ObjectPreventExtensions = exports.ObjectKeys = exports.isSealed = exports.isFrozen = exports.isExtensible = exports.ObjectIs = exports.ObjectGetPrototypeOf = exports.ObjectGetOwnPropertySymbols = exports.ObjectGetOwnPropertyNames = exports.ObjectGetOwnPropertyDescriptors = exports.ObjectGetOwnPropertyDescriptor = exports.ObjectFromEntries = exports.ObjectFreeze = exports.ObjectEntries = exports.ObjectDefineProperty = exports.ObjectDefineProperties = exports.ObjectCreate = exports.ObjectAssign = exports.toString = exports.isEnumerable = exports.isPrototypeOf = exports.hasOwnProperty = exports.SymbolKeyFor = exports.SymbolFor = exports.sign = exports.round = exports.random = exports.min = exports.max = exports.floor = exports.ceil = exports.abs = exports.parseInt = exports.parseFloat = exports.isSafeInteger = exports.isNaN = exports.isInteger = exports.isFinite = exports.NaN = void 0;
            exports.NaN = Number.NaN, exports.isFinite = Number.isFinite, exports.isInteger = Number.isInteger, exports.isNaN = Number.isNaN, exports.isSafeInteger = Number.isSafeInteger, exports.parseFloat = Number.parseFloat, exports.parseInt = Number.parseInt;
            exports.abs = Math.abs, exports.ceil = Math.ceil, exports.floor = Math.floor, exports.max = Math.max, exports.min = Math.min, exports.random = Math.random, exports.round = Math.round, exports.sign = Math.sign;
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
            exports.ObjectFromEntries = Object.fromEntries;
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
            exports.join = exports.splice = exports.pop = exports.push = exports.shift = exports.unshift = exports.indexOf = void 0;
            const global_1 = _dereq_('./global');
            function indexOf(as, a) {
                if (as.length === 0)
                    return -1;
                return a === a ? as.indexOf(a) : as.findIndex(a => a !== a);
            }
            exports.indexOf = indexOf;
            function unshift(as, bs) {
                if ('length' in as) {
                    for (let i = as.length - 1; i >= 0; --i) {
                        bs.unshift(as[i]);
                    }
                } else {
                    bs.unshift(...as);
                }
                return bs;
            }
            exports.unshift = unshift;
            function shift(as, count) {
                if (count < 0)
                    throw new Error('Unexpected negative number');
                return count === void 0 ? [
                    as.shift(),
                    as
                ] : [
                    splice(as, 0, count),
                    as
                ];
            }
            exports.shift = shift;
            function push(as, bs) {
                if ('length' in bs) {
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
                if (count < 0)
                    throw new Error('Unexpected negative number');
                return count === void 0 ? [
                    as,
                    as.pop()
                ] : [
                    as,
                    splice(as, as.length - count, count)
                ];
            }
            exports.pop = pop;
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
                    case void 0:
                        if (as.length > 1 || arguments.length > 2)
                            break;
                        return as.length === 0 ? [] : splice(as, index, 1);
                    }
                    break;
                case -1:
                case as.length - 1:
                    switch (count) {
                    case 1:
                        return as.length === 0 ? [
                            [],
                            push(as, inserts)
                        ][0] : [
                            [as.pop()],
                            push(as, inserts)
                        ][0];
                    case void 0:
                        if (as.length > 1 || arguments.length > 2)
                            break;
                        return as.length === 0 ? [] : splice(as, index, 1);
                    }
                    break;
                case as.length:
                case global_1.Infinity:
                    return [
                        [],
                        push(as, inserts)
                    ][0];
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
        { './global': 17 }
    ],
    7: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.aggregate = exports.bundle = void 0;
            function bundle(...as) {
                return (...bs) => as.map((f, i) => f(bs[i]));
            }
            exports.bundle = bundle;
            function aggregate(...as) {
                return b => as.map(f => f(b));
            }
            exports.aggregate = aggregate;
        },
        {}
    ],
    8: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.template = exports.overwrite = exports.inherit = exports.merge = exports.extend = exports.clone = exports.assign = void 0;
            const global_1 = _dereq_('./global');
            const alias_1 = _dereq_('./alias');
            const type_1 = _dereq_('./type');
            const array_1 = _dereq_('./array');
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
            exports.extend = template((prop, target, source) => {
                switch ((0, type_1.type)(source[prop])) {
                case 'undefined':
                    return;
                case 'Array':
                    return target[prop] = source[prop];
                case 'Object':
                    switch ((0, type_1.type)(target[prop])) {
                    case 'Object':
                        return target[prop] = (0, exports.extend)(target[prop], source[prop]);
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
                        return target[prop] = (0, exports.merge)(target[prop], source[prop]);
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
                        return target[prop] = (0, alias_1.hasOwnProperty)(target, prop) ? (0, exports.inherit)(target[prop], source[prop]) : (0, exports.inherit)((0, alias_1.ObjectCreate)(target[prop]), source[prop]);
                    default:
                        return target[prop] = (0, alias_1.ObjectCreate)(source[prop]);
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
                        return target[prop] = (0, exports.overwrite)(target[prop], source[prop]);
                    default:
                        return target[prop] = (0, exports.overwrite)(empty(source[prop]), source[prop]);
                    }
                default:
                    return target[prop] = source[prop];
                }
            });
            function template(strategy) {
                return walk;
                function walk(target, ...sources) {
                    if ((0, type_1.isPrimitive)(target))
                        return target;
                    for (let i = 0; i < sources.length; ++i) {
                        const source = sources[i];
                        if (source === target)
                            continue;
                        if ((0, type_1.isPrimitive)(source))
                            continue;
                        const keys = (0, alias_1.ObjectKeys)(source);
                        for (let i = 0; i < keys.length; ++i) {
                            strategy(keys[i], target, source);
                        }
                    }
                    return target;
                }
            }
            exports.template = template;
            function empty(source) {
                switch ((0, type_1.type)(source)) {
                case 'Array':
                    return [];
                case 'Object':
                    return source instanceof global_1.Object ? {} : (0, alias_1.ObjectCreate)(null);
                default:
                    return source;
                }
            }
        },
        {
            './alias': 5,
            './array': 6,
            './global': 17,
            './type': 27
        }
    ],
    9: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.Cache = void 0;
            const global_1 = _dereq_('./global');
            const alias_1 = _dereq_('./alias');
            const clock_1 = _dereq_('./clock');
            const invlist_1 = _dereq_('./invlist');
            const stack_1 = _dereq_('./stack');
            const assign_1 = _dereq_('./assign');
            const tuple_1 = _dereq_('./tuple');
            const compare_1 = _dereq_('./compare');
            class Cache {
                constructor(capacity, opts = {}) {
                    this.capacity = capacity;
                    this.settings = {
                        space: global_1.Infinity,
                        age: global_1.Infinity,
                        capture: {
                            delete: true,
                            clear: true
                        }
                    };
                    this.SIZE = 0;
                    this.clock = 0;
                    this.clockR = 0;
                    this.memory = new global_1.Map();
                    this.indexes = {
                        LRU: new invlist_1.List(),
                        LFU: new invlist_1.List()
                    };
                    this.stack = new stack_1.Stack();
                    this.stats = {
                        LRU: (0, tuple_1.tuple)(0, 0),
                        LFU: (0, tuple_1.tuple)(0, 0)
                    };
                    this.ratio = 50;
                    this.frequency = (0, alias_1.max)(this.capacity / 100 | 0, 1);
                    if (capacity < 1)
                        throw new Error(`Spica: Cache: Capacity must be 1 or more.`);
                    (0, assign_1.extend)(this.settings, opts);
                    this.space = this.settings.space;
                }
                get length() {
                    return this.indexes.LRU.length + this.indexes.LFU.length;
                }
                get size() {
                    return this.SIZE;
                }
                resume() {
                    if (this.stack.isEmpty())
                        return;
                    const {
                        stack,
                        settings: {disposer}
                    } = this;
                    while (!stack.isEmpty()) {
                        const {key, value} = stack.pop();
                        disposer(value, key);
                    }
                }
                dispose({index, value, size}, callback) {
                    var _a, _b;
                    index.delete();
                    this.memory.delete(index.value.key);
                    this.SIZE -= size;
                    callback && ((_b = (_a = this.settings).disposer) === null || _b === void 0 ? void 0 : _b.call(_a, value, index.value.key));
                }
                secure(margin, key) {
                    if (margin <= 0)
                        return;
                    const {LRU, LFU} = this.indexes;
                    let miss = arguments.length < 2 ? false : void 0;
                    let restore;
                    while (this.length === this.capacity || this.size + margin > this.space) {
                        const list = false || LRU.length === +(restore === LRU) || LFU.length > this.capacity * this.ratio / 100 || LFU.length > this.capacity / 2 && LFU.last.value.clock < this.clock - this.capacity * 8 || LFU.last && LFU.last.value.expiry < (0, clock_1.now)() ? LFU : LRU;
                        const index = list.last.value;
                        if (miss !== null && miss !== void 0 ? miss : (0, compare_1.equal)(index.key, key)) {
                            miss = false;
                            restore = list;
                            restore.head = restore.last;
                            continue;
                        }
                        const record = this.memory.get(index.key);
                        this.dispose(record, false);
                        this.settings.disposer && this.stack.push({
                            key: index.key,
                            value: record.value
                        });
                    }
                    if (restore) {
                        restore.head = restore.tail;
                    }
                }
                put(key, value, size = 1, age = this.settings.age) {
                    var _a, _b;
                    if (size < 1)
                        throw new Error(`Spica: Cache: Size must be 1 or more.`);
                    if (age < 1)
                        throw new Error(`Spica: Cache: Age must be 1 or more.`);
                    if (size > this.space || age <= 0) {
                        (_b = (_a = this.settings).disposer) === null || _b === void 0 ? void 0 : _b.call(_a, value, key);
                        return false;
                    }
                    const expiry = age === global_1.Infinity ? global_1.Infinity : (0, clock_1.now)() + age;
                    const record = this.memory.get(key);
                    if (record) {
                        this.settings.disposer && this.stack.push({
                            key,
                            value: record.value
                        });
                        this.secure(size - record.size, key);
                        this.SIZE += size - record.size;
                        record.value = value;
                        record.size = size;
                        record.index.value.expiry = expiry;
                        this.resume();
                        return true;
                    }
                    this.secure(size);
                    const {LRU} = this.indexes;
                    this.SIZE += size;
                    this.memory.set(key, {
                        index: LRU.unshift({
                            key,
                            clock: ++this.clockR,
                            expiry
                        }),
                        value,
                        size
                    });
                    this.resume();
                    return false;
                }
                set(key, value, size, age) {
                    this.put(key, value, size, age);
                    return this;
                }
                get(key) {
                    const record = this.memory.get(key);
                    if (!record)
                        return;
                    const expiry = record.index.value.expiry;
                    if (expiry !== global_1.Infinity && expiry <= (0, clock_1.now)()) {
                        this.dispose(record, true);
                        return;
                    }
                    this.access(record);
                    this.slide();
                    return record.value;
                }
                has(key) {
                    const record = this.memory.get(key);
                    if (!record)
                        return false;
                    const expiry = record.index.value.expiry;
                    if (expiry !== global_1.Infinity && expiry <= (0, clock_1.now)()) {
                        this.dispose(record, true);
                        return false;
                    }
                    return true;
                }
                delete(key) {
                    const record = this.memory.get(key);
                    if (!record)
                        return false;
                    this.dispose(record, this.settings.capture.delete === true);
                    return true;
                }
                clear() {
                    this.SIZE = 0;
                    this.ratio = 50;
                    this.indexes.LRU.clear();
                    this.indexes.LFU.clear();
                    this.stack.clear();
                    this.stats = {
                        LRU: [
                            0,
                            0
                        ],
                        LFU: [
                            0,
                            0
                        ]
                    };
                    if (!this.settings.disposer || !this.settings.capture.clear)
                        return void this.memory.clear();
                    const memory = this.memory;
                    this.memory = new global_1.Map();
                    for (const [key, {value}] of memory) {
                        this.settings.disposer(value, key);
                    }
                }
                *[Symbol.iterator]() {
                    for (const [key, {value}] of this.memory) {
                        yield [
                            key,
                            value
                        ];
                    }
                    return;
                }
                slide() {
                    const {LRU, LFU} = this.stats;
                    const {capacity, ratio, indexes} = this;
                    if ((LRU[0] + LFU[0]) % this.frequency)
                        return;
                    const window = capacity;
                    const isCalculable = LRU[1] + LFU[1] > 0;
                    const rateR = +isCalculable && rate(window, LRU[0], LRU[0] + LFU[0], LRU[1], LRU[1] + LFU[1]);
                    const rateF = +isCalculable && rate(window, LFU[0], LRU[0] + LFU[0], LFU[1], LRU[1] + LFU[1]) * indexes.LRU.length / indexes.LFU.length | 0;
                    if (isCalculable && ratio < 100 && rateF > rateR && indexes.LFU.length >= capacity * ratio / 100) {
                        ++this.ratio;
                    } else if (isCalculable && ratio > 10 && rateR > rateF && indexes.LRU.length >= capacity * (100 - ratio) / 100) {
                        --this.ratio;
                    }
                    if (LRU[0] + LFU[0] >= window) {
                        this.stats = {
                            LRU: [
                                0,
                                LRU[0]
                            ],
                            LFU: [
                                0,
                                LFU[0]
                            ]
                        };
                    }
                }
                access(record) {
                    return this.accessLFU(record) || this.accessLRU(record);
                }
                accessLRU(record) {
                    const index = record.index;
                    const {LRU, LFU} = this.indexes;
                    ++this.stats.LRU[0];
                    ++this.clock;
                    ++this.clockR;
                    if (index.value.clock + LRU.length / 3 > this.clockR) {
                        index.value.clock = this.clockR;
                        index.moveToHead();
                        return true;
                    }
                    index.delete();
                    index.value.clock = this.clock;
                    record.index = LFU.unshift(index.value);
                    return true;
                }
                accessLFU(record) {
                    const index = record.index;
                    if (index.list !== this.indexes.LFU)
                        return false;
                    ++this.stats.LFU[0];
                    ++this.clock;
                    index.value.clock = this.clock;
                    index.moveToHead();
                    return true;
                }
            }
            exports.Cache = Cache;
            function rate(window, currHits, currTotal, prevHits, prevTotal) {
                window = (0, alias_1.min)(currTotal + prevTotal, window);
                const currRate = currHits * 100 / currTotal | 0;
                const currRatio = (0, alias_1.min)(currTotal * 100 / window | 0, 100);
                const prevRate = prevHits * 100 / prevTotal | 0;
                const prevRatio = 100 - currRatio;
                return currRate * currRatio + prevRate * prevRatio | 0;
            }
        },
        {
            './alias': 5,
            './assign': 8,
            './clock': 10,
            './compare': 12,
            './global': 17,
            './invlist': 18,
            './stack': 25,
            './tuple': 26
        }
    ],
    10: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.tick = exports.wait = exports.clock = exports.now = void 0;
            const global_1 = _dereq_('./global');
            const alias_1 = _dereq_('./alias');
            const promise_1 = _dereq_('./promise');
            const exception_1 = _dereq_('./exception');
            let now_;
            let count = 0;
            function now() {
                if (now_ === void 0) {
                    tick(() => now_ = void 0);
                } else {
                    if (++count !== 100)
                        return now_;
                    count = 0;
                }
                return now_ = global_1.Date.now();
            }
            exports.now = now;
            exports.clock = Promise.resolve(undefined);
            function wait(ms) {
                return ms === 0 ? promise_1.AtomicPromise.resolve(exports.clock) : new promise_1.AtomicPromise(resolve => void (0, global_1.setTimeout)(resolve, ms));
            }
            exports.wait = wait;
            let queue = [];
            let jobs = [];
            let index = 0;
            const scheduler = Promise.resolve();
            function tick(cb) {
                index === 0 && scheduler.then(run);
                index++ === queue.length ? queue.push(cb) : queue[index - 1] = cb;
            }
            exports.tick = tick;
            function run() {
                const count = index;
                [index, queue, jobs] = [
                    0,
                    jobs,
                    queue
                ];
                for (let i = 0; i < count; ++i) {
                    try {
                        jobs[i]();
                        jobs[i] = void 0;
                    } catch (reason) {
                        (0, exception_1.causeAsyncException)(reason);
                    }
                }
                jobs.length > 1000 && count < jobs.length * 0.5 && jobs.splice((0, alias_1.floor)(jobs.length * 0.9), jobs.length);
            }
        },
        {
            './alias': 5,
            './exception': 14,
            './global': 17,
            './promise': 23
        }
    ],
    11: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.MultiMap = void 0;
            const global_1 = _dereq_('../global');
            const array_1 = _dereq_('../array');
            class MultiMap {
                constructor(entries = [], memory = new global_1.Map()) {
                    this.memory = memory;
                    for (const [k, v] of entries) {
                        this.set(k, v);
                    }
                }
                get(key) {
                    var _a;
                    return (_a = this.memory.get(key)) === null || _a === void 0 ? void 0 : _a[0];
                }
                set(key, val) {
                    var _a, _b;
                    (_b = (_a = this.memory.get(key)) === null || _a === void 0 ? void 0 : _a.push(val)) !== null && _b !== void 0 ? _b : this.memory.set(key, [val]);
                    return this;
                }
                has(key, value) {
                    const vs = this.memory.get(key);
                    if (!vs || vs.length === 0)
                        return false;
                    if (arguments.length < 2)
                        return true;
                    switch (value) {
                    case vs[0]:
                    case vs[vs.length - 1]:
                        return true;
                    default:
                        return (0, array_1.indexOf)(vs, value) > -1;
                    }
                }
                delete(key, value) {
                    if (arguments.length < 2)
                        return this.memory.delete(key);
                    const vs = this.memory.get(key);
                    if (!vs || vs.length === 0)
                        return false;
                    switch (value) {
                    case vs[0]:
                        vs.shift();
                        break;
                    case vs[vs.length - 1]:
                        vs.pop();
                        break;
                    default:
                        const i = (0, array_1.indexOf)(vs, value);
                        if (i === -1)
                            return false;
                        (0, array_1.splice)(vs, i, 1);
                    }
                    vs.length === 0 && this.memory.delete(key);
                    return true;
                }
                clear() {
                    this.memory.clear();
                }
                take(key, count) {
                    var _a;
                    const vs = (_a = this.memory.get(key)) !== null && _a !== void 0 ? _a : [];
                    return count === void 0 ? (0, array_1.splice)(vs, 0, 1)[0] : (0, array_1.splice)(vs, 0, count);
                }
                ref(key) {
                    let vs = this.memory.get(key);
                    if (vs)
                        return vs;
                    vs = [];
                    this.memory.set(key, vs);
                    return vs;
                }
                *[Symbol.iterator]() {
                    for (const [k, vs] of this.memory) {
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
        {
            '../array': 6,
            '../global': 17
        }
    ],
    12: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.equal = void 0;
            function equal(a, b) {
                return a === a ? a === b : b !== b;
            }
            exports.equal = equal;
        },
        {}
    ],
    13: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.uncurry = exports.curry = void 0;
            const array_1 = _dereq_('./array');
            exports.curry = f => curry_(f, f.length);
            function curry_(f, arity, ...xs) {
                let g;
                return xs.length < arity ? (...ys) => curry_(g !== null && g !== void 0 ? g : g = xs.length && f.bind(void 0, ...xs) || f, arity - xs.length, ...ys) : f(...xs);
            }
            const uncurry = f => uncurry_(f);
            exports.uncurry = uncurry;
            function uncurry_(f) {
                const arity = f.length;
                return (...xs) => arity === 0 || xs.length < 2 || xs.length <= arity ? f(...xs) : uncurry_(f(...(0, array_1.shift)(xs, arity)[0]))(...xs);
            }
        },
        { './array': 6 }
    ],
    14: [
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
    15: [
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
    16: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.run = exports.once = exports.clear = exports.mapReturn = exports.mapParameters = void 0;
            const global_1 = _dereq_('./global');
            const noop_1 = _dereq_('./noop');
            function mapParameters(f, g) {
                return (...as) => f(...g(...as));
            }
            exports.mapParameters = mapParameters;
            function mapReturn(f, g) {
                return (...as) => g(f(...as));
            }
            exports.mapReturn = mapReturn;
            function clear(f) {
                return (...as) => void f(...as);
            }
            exports.clear = clear;
            function once(f) {
                return (...as) => {
                    if (f === noop_1.noop)
                        return;
                    f(...as);
                    f = noop_1.noop;
                    as = [];
                };
            }
            exports.once = once;
            function run(fs) {
                const gs = (0, global_1.Array)(fs.length);
                try {
                    for (let i = 0; i < fs.length; ++i) {
                        gs[i] = fs[i]();
                    }
                } catch (reason) {
                    for (let i = 0; gs[i]; ++i) {
                        gs[i]();
                    }
                    throw reason;
                }
                return once(() => {
                    for (let i = 0; gs[i]; ++i) {
                        gs[i]();
                    }
                });
            }
            exports.run = run;
        },
        {
            './global': 17,
            './noop': 22
        }
    ],
    17: [
        function (_dereq_, module, exports) {
            'use strict';
            const global = void 0 || typeof globalThis !== 'undefined' && globalThis || typeof self !== 'undefined' && self || Function('return this')();
            eval('global.global = global');
            module.exports = global;
        },
        {}
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
            var __exportStar = this && this.__exportStar || function (m, exports) {
                for (var p in m)
                    if (p !== 'default' && !Object.prototype.hasOwnProperty.call(exports, p))
                        __createBinding(exports, m, p);
            };
            Object.defineProperty(exports, '__esModule', { value: true });
            __exportStar(_dereq_('./list/invlist'), exports);
        },
        { './list/invlist': 19 }
    ],
    19: [
        function (_dereq_, module, exports) {
            'use strict';
            var _a;
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.Node = exports.List = void 0;
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
                    var _b;
                    return (_b = this.head) === null || _b === void 0 ? void 0 : _b.next;
                }
                get last() {
                    var _b;
                    return (_b = this.head) === null || _b === void 0 ? void 0 : _b.prev;
                }
                clear() {
                    this.head = undefined;
                    this[LENGTH] = 0;
                }
                unshift(value) {
                    return this.head = this.push(value);
                }
                unshiftRotationally(value) {
                    if (!this.head)
                        return this.unshift(value);
                    const node = this.last;
                    node.value = value;
                    this.head = node;
                    return node;
                }
                shift() {
                    var _b;
                    return (_b = this.head) === null || _b === void 0 ? void 0 : _b.delete();
                }
                push(value) {
                    var _b;
                    return new Node(value, this.head, (_b = this.head) === null || _b === void 0 ? void 0 : _b.prev, this);
                }
                pushRotationally(value) {
                    if (!this.head)
                        return this.push(value);
                    const node = this.head;
                    node.value = value;
                    this.head = node.next;
                    return node;
                }
                pop() {
                    var _b;
                    return (_b = this.last) === null || _b === void 0 ? void 0 : _b.delete();
                }
                *[(_a = LENGTH, Symbol.iterator)]() {
                    for (let node = this.head; node;) {
                        yield node.value;
                        node = node.next;
                        if (node === this.head)
                            return;
                    }
                }
            }
            exports.List = List;
            class Node {
                constructor(value, next, prev, list = next ? next.list : new List()) {
                    var _b;
                    this.value = value;
                    this.next = next;
                    this.prev = prev;
                    this.list = list;
                    ++list[LENGTH];
                    (_b = list.head) !== null && _b !== void 0 ? _b : list.head = this;
                    next ? next.prev = this : this.next = this;
                    prev ? prev.next = this : this.prev = this;
                }
                delete() {
                    if (!this.next && !this.prev)
                        return this.value;
                    --this.list[LENGTH];
                    if (this.list.head === this) {
                        this.list.head = this.next === this ? undefined : this.next;
                    }
                    if (this.next) {
                        this.next.prev = this.prev;
                    }
                    if (this.prev) {
                        this.prev.next = this.next;
                    }
                    this.next = this.prev = undefined;
                    return this.value;
                }
                insertBefore(value) {
                    return new Node(value, this, this.prev, this.list);
                }
                insertAfter(value) {
                    return new Node(value, this.next, this, this.list);
                }
                move(before) {
                    if (!before)
                        return false;
                    if (this === before)
                        return false;
                    const a1 = this;
                    if (!a1)
                        return false;
                    const b1 = before;
                    if (!b1)
                        return false;
                    if (a1.next === b1)
                        return false;
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
                    this.move(this.list.head);
                    this.list.head = this;
                }
                moveToLast() {
                    this.move(this.list.head);
                }
                swap(node) {
                    const node1 = this;
                    const node2 = node;
                    if (node1 === node2)
                        return false;
                    const node3 = node2.next;
                    node2.move(node1);
                    node1.move(node3);
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
            exports.Node = Node;
        },
        {}
    ],
    20: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.memoize = void 0;
            const global_1 = _dereq_('./global');
            function memoize(f, identify = (...as) => as[0], memory) {
                if (typeof identify === 'object')
                    return memoize(f, void 0, identify);
                if (memory === void 0)
                    return memoize(f, identify, new global_1.Map());
                let nullish = false;
                return (...as) => {
                    const b = identify(...as);
                    let z = memory.get(b);
                    if (z !== void 0 || nullish && memory.has(b))
                        return z;
                    z = f(...as);
                    nullish || (nullish = z === void 0);
                    memory.set(b, z);
                    return z;
                };
            }
            exports.memoize = memoize;
        },
        { './global': 17 }
    ],
    21: [
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
        { './collection/multimap': 11 }
    ],
    22: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.noop = void 0;
            function noop() {
            }
            exports.noop = noop;
        },
        {}
    ],
    23: [
        function (_dereq_, module, exports) {
            'use strict';
            var _a, _b;
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.never = exports.isPromiseLike = exports.Internal = exports.AtomicPromise = void 0;
            const global_1 = _dereq_('./global');
            const alias_1 = _dereq_('./alias');
            const noop_1 = _dereq_('./noop');
            const internal = Symbol.for('spica/promise::internal');
            class AtomicPromise {
                constructor(executor) {
                    this[_a] = 'Promise';
                    this[_b] = new Internal();
                    try {
                        executor(value => void this[internal].resolve(value), reason => void this[internal].reject(reason));
                    } catch (reason) {
                        this[internal].reject(reason);
                    }
                }
                static get [Symbol.species]() {
                    return AtomicPromise;
                }
                static all(vs) {
                    return new AtomicPromise((resolve, reject) => {
                        const values = (0, alias_1.isArray)(vs) ? vs : [...vs];
                        const results = (0, global_1.Array)(values.length);
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
                        const values = (0, alias_1.isArray)(vs) ? vs : [...vs];
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
                        const values = (0, alias_1.isArray)(vs) ? vs : [...vs];
                        const results = (0, global_1.Array)(values.length);
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
                    return new AtomicPromise((resolve, reject) => this[internal].then(resolve, reject, onfulfilled, onrejected));
                }
                catch(onrejected) {
                    return this.then(void 0, onrejected);
                }
                finally(onfinally) {
                    return this.then(onfinally, onfinally).then(() => this);
                }
            }
            exports.AtomicPromise = AtomicPromise;
            _a = Symbol.toStringTag, _b = internal;
            class Internal {
                constructor() {
                    this.status = { state: 0 };
                    this.fulfillReactions = [];
                    this.rejectReactions = [];
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
                    if (isAtomicPromiseLike(value)) {
                        const core = value[internal];
                        switch (core.status.state) {
                        case 2:
                        case 3:
                            this.status = core.status;
                            return this.resume();
                        default:
                            return core.then(() => (this.status = core.status, this.resume()), () => (this.status = core.status, this.resume()));
                        }
                    }
                    this.status = {
                        state: 1,
                        promise: value
                    };
                    return void value.then(value => {
                        this.status = {
                            state: 2,
                            value
                        };
                        this.resume();
                    }, reason => {
                        this.status = {
                            state: 3,
                            reason
                        };
                        this.resume();
                    });
                }
                reject(reason) {
                    if (this.status.state !== 0)
                        return;
                    this.status = {
                        state: 3,
                        reason
                    };
                    return this.resume();
                }
                then(resolve, reject, onfulfilled, onrejected) {
                    const {status, fulfillReactions, rejectReactions} = this;
                    switch (status.state) {
                    case 2:
                        if (fulfillReactions.length !== 0)
                            break;
                        return call(resolve, reject, resolve, onfulfilled, status.value);
                    case 3:
                        if (rejectReactions.length !== 0)
                            break;
                        return call(resolve, reject, reject, onrejected, status.reason);
                    }
                    fulfillReactions.push([
                        resolve,
                        reject,
                        resolve,
                        onfulfilled
                    ]);
                    rejectReactions.push([
                        resolve,
                        reject,
                        reject,
                        onrejected
                    ]);
                }
                resume() {
                    const {status, fulfillReactions, rejectReactions} = this;
                    switch (status.state) {
                    case 0:
                    case 1:
                        return;
                    case 2:
                        if (rejectReactions.length !== 0) {
                            this.rejectReactions = [];
                        }
                        if (fulfillReactions.length === 0)
                            return;
                        react(fulfillReactions, status.value);
                        this.fulfillReactions = [];
                        return;
                    case 3:
                        if (fulfillReactions.length !== 0) {
                            this.fulfillReactions = [];
                        }
                        if (rejectReactions.length === 0)
                            return;
                        react(rejectReactions, status.reason);
                        this.rejectReactions = [];
                        return;
                    }
                }
            }
            exports.Internal = Internal;
            function react(reactions, param) {
                for (let i = 0; i < reactions.length; ++i) {
                    const reaction = reactions[i];
                    call(reaction[0], reaction[1], reaction[2], reaction[3], param);
                }
            }
            function call(resolve, reject, cont, callback, param) {
                if (!callback)
                    return cont(param);
                try {
                    resolve(callback(param));
                } catch (reason) {
                    reject(reason);
                }
            }
            function isPromiseLike(value) {
                return value !== null && typeof value === 'object' && typeof value.then === 'function';
            }
            exports.isPromiseLike = isPromiseLike;
            function isAtomicPromiseLike(value) {
                return internal in value;
            }
            exports.never = new class Never extends Promise {
                static get [Symbol.species]() {
                    return Never;
                }
                constructor() {
                    super(noop_1.noop);
                }
                then() {
                    return this;
                }
                catch() {
                    return this;
                }
                finally() {
                    return this;
                }
            }();
        },
        {
            './alias': 5,
            './global': 17,
            './noop': 22
        }
    ],
    24: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.unique = exports.rnd0Z = exports.rnd0z = exports.rnd0f = exports.rnd64 = exports.rnd62 = exports.rnd36 = exports.rnd32 = exports.rnd16 = void 0;
            const global_1 = _dereq_('./global');
            const bases = [...Array(7)].map((_, i) => 1 << i);
            const dict = [
                ...[...Array(36)].map((_, i) => i.toString(36)),
                ...[...Array(36)].map((_, i) => i.toString(36).toUpperCase()).slice(-26)
            ];
            exports.rnd16 = cons(16);
            exports.rnd32 = cons(32);
            exports.rnd36 = cons(36);
            exports.rnd62 = cons(62);
            exports.rnd64 = cons(64);
            exports.rnd0f = conv(exports.rnd16);
            exports.rnd0z = conv(exports.rnd36);
            exports.rnd0Z = conv(exports.rnd62);
            function unique(rnd, len, mem = new global_1.Set()) {
                let limit = 5;
                return () => {
                    while (true) {
                        for (let i = 0; i < limit; ++i) {
                            const r = rnd(len);
                            if (mem.has(r))
                                continue;
                            mem.add(r);
                            return r;
                        }
                        mem.clear();
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
                        if (r < radix)
                            return r;
                    }
                };
            }
            function conv(rnd) {
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
            const masks = bases.map((_, i) => +`0b${ '1'.repeat(i) || 0 }`);
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
        },
        { './global': 17 }
    ],
    25: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.Stack = void 0;
            const undefined = void 0;
            class Stack {
                constructor() {
                    this.list = undefined;
                    this.length = 0;
                }
                push(value) {
                    const node = this.list;
                    const values = node === null || node === void 0 ? void 0 : node[0];
                    ++this.length;
                    !values || values.length === 100 ? this.list = [
                        [value],
                        node
                    ] : values.push(value);
                }
                pop() {
                    const node = this.list;
                    if (node === undefined)
                        return;
                    const values = node[0];
                    --this.length;
                    if (values.length !== 1)
                        return values.pop();
                    const value = values[0];
                    this.list = node[1];
                    node[1] = undefined;
                    return value;
                }
                clear() {
                    this.list = undefined;
                }
                isEmpty() {
                    return this.list === undefined;
                }
                peek() {
                    var _a;
                    return (_a = this.list) === null || _a === void 0 ? void 0 : _a[0][0];
                }
                *[Symbol.iterator]() {
                    while (!this.isEmpty()) {
                        yield this.pop();
                    }
                    return;
                }
            }
            exports.Stack = Stack;
        },
        {}
    ],
    26: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.tuple = void 0;
            function tuple(...as) {
                return as;
            }
            exports.tuple = tuple;
        },
        {}
    ],
    27: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.isPrimitive = exports.isType = exports.type = void 0;
            const alias_1 = _dereq_('./alias');
            const toString = Object.prototype.toString.call.bind(Object.prototype.toString);
            const ObjectPrototype = Object.prototype;
            const ArrayPrototype = Array.prototype;
            function type(value) {
                if (value === void 0)
                    return 'undefined';
                if (value === null)
                    return 'null';
                const type = typeof value;
                if (type === 'object') {
                    const proto = (0, alias_1.ObjectGetPrototypeOf)(value);
                    if (proto === ObjectPrototype || proto === null)
                        return 'Object';
                    if (proto === ArrayPrototype)
                        return 'Array';
                    return toString(value).slice(8, -1);
                }
                if (type === 'function')
                    return 'Function';
                return type;
            }
            exports.type = type;
            function isType(value, name) {
                if (name === 'object')
                    return value !== null && typeof value === name;
                if (name === 'function')
                    return typeof value === name;
                return type(value) === name;
            }
            exports.isType = isType;
            function isPrimitive(value) {
                const type = typeof value;
                return type === 'object' || type === 'function' ? value === null : true;
            }
            exports.isPrimitive = isPrimitive;
        },
        { './alias': 5 }
    ],
    28: [
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
                        searchParams: void 0
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
                    var _a;
                    var _b;
                    return (_a = (_b = this[internal]).searchParams) !== null && _a !== void 0 ? _a : _b.searchParams = new global_1.URLSearchParams(this.search);
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
            './global': 17,
            './url/format': 29
        }
    ],
    29: [
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
                return url.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]?|[\uDC00-\uDFFF]/g, str => str.length === 2 ? str : '').replace(/%(?![0-9A-F]{2})|[^%\[\]]+/ig, global_1.encodeURI).replace(/\?[^#]+/, query => '?' + query.slice(1).replace(/%[0-9A-F]{2}|%|[^=&]+/ig, str => str[0] === '%' && str.length === 3 ? str : (0, global_1.encodeURIComponent)(str))).replace(/%[0-9A-F]{2}/ig, str => str.toUpperCase()).replace(/#.+/, url.slice(url.indexOf('#')));
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
                        searchParams: void 0
                    };
                }
                get href() {
                    var _a;
                    var _b;
                    return (_a = (_b = this[internal].share).href) !== null && _a !== void 0 ? _a : _b.href = this[internal].share.url.href;
                }
                get resource() {
                    var _a;
                    var _b;
                    return (_a = (_b = this[internal].share).resource) !== null && _a !== void 0 ? _a : _b.resource = this.href.slice(0, -this.fragment.length - this.query.length || this.href.length) + this.search;
                }
                get origin() {
                    var _a;
                    var _b;
                    return (_a = (_b = this[internal].share).origin) !== null && _a !== void 0 ? _a : _b.origin = this[internal].share.url.origin;
                }
                get protocol() {
                    var _a;
                    var _b;
                    return (_a = (_b = this[internal].share).protocol) !== null && _a !== void 0 ? _a : _b.protocol = this[internal].share.url.protocol;
                }
                get username() {
                    var _a;
                    var _b;
                    return (_a = (_b = this[internal].share).username) !== null && _a !== void 0 ? _a : _b.username = this[internal].share.url.username;
                }
                get password() {
                    var _a;
                    var _b;
                    return (_a = (_b = this[internal].share).password) !== null && _a !== void 0 ? _a : _b.password = this[internal].share.url.password;
                }
                get host() {
                    var _a;
                    var _b;
                    return (_a = (_b = this[internal].share).host) !== null && _a !== void 0 ? _a : _b.host = this[internal].share.url.host;
                }
                get hostname() {
                    var _a;
                    var _b;
                    return (_a = (_b = this[internal].share).hostname) !== null && _a !== void 0 ? _a : _b.hostname = this[internal].share.url.hostname;
                }
                get port() {
                    var _a;
                    var _b;
                    return (_a = (_b = this[internal].share).port) !== null && _a !== void 0 ? _a : _b.port = this[internal].share.url.port;
                }
                get path() {
                    var _a;
                    var _b;
                    return (_a = (_b = this[internal].share).path) !== null && _a !== void 0 ? _a : _b.path = `${ this.pathname }${ this.search }`;
                }
                get pathname() {
                    var _a;
                    var _b;
                    return (_a = (_b = this[internal].share).pathname) !== null && _a !== void 0 ? _a : _b.pathname = this[internal].share.url.pathname;
                }
                get search() {
                    var _a;
                    var _b;
                    return (_a = (_b = this[internal].share).search) !== null && _a !== void 0 ? _a : _b.search = this[internal].share.url.search;
                }
                get query() {
                    var _a;
                    var _b;
                    return (_a = (_b = this[internal].share).query) !== null && _a !== void 0 ? _a : _b.query = this.search || this.href[this.href.length - this.fragment.length - 1] === '?' && '?' || '';
                }
                get hash() {
                    var _a;
                    var _b;
                    return (_a = (_b = this[internal].share).hash) !== null && _a !== void 0 ? _a : _b.hash = this[internal].share.url.hash;
                }
                get fragment() {
                    var _a;
                    var _b;
                    return (_a = (_b = this[internal].share).fragment) !== null && _a !== void 0 ? _a : _b.fragment = this.hash || this.href[this.href.length - 1] === '#' && '#' || '';
                }
                get searchParams() {
                    var _a;
                    var _b;
                    return (_a = (_b = this[internal]).searchParams) !== null && _a !== void 0 ? _a : _b.searchParams = new global_1.URLSearchParams(this.search);
                }
                toString() {
                    return this.href;
                }
                toJSON() {
                    return this.href;
                }
            }
            exports.ReadonlyURL = ReadonlyURL;
            ReadonlyURL.get = (0, flip_1.flip)((0, curry_1.uncurry)((0, memoize_1.memoize)(base => (0, memoize_1.memoize)(url => ({
                url: new global_1.global.URL(url, base),
                href: void 0,
                resource: void 0,
                origin: void 0,
                protocol: void 0,
                username: void 0,
                password: void 0,
                host: void 0,
                hostname: void 0,
                port: void 0,
                path: void 0,
                pathname: void 0,
                search: void 0,
                query: void 0,
                hash: void 0,
                fragment: void 0
            }), new cache_1.Cache(100)), new cache_1.Cache(100))));
        },
        {
            '../cache': 9,
            '../curry': 13,
            '../flip': 15,
            '../global': 17,
            '../memoize': 20
        }
    ],
    30: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.identity = exports.apply = exports.currentTarget = exports.wait = exports.once = exports.bind = exports.delegate = exports.listen = exports.defrag = exports.define = exports.element = exports.text = exports.svg = exports.html = exports.frag = exports.shadow = exports.proxy = exports.API = exports.SVG = exports.HTML = exports.Shadow = void 0;
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
            Object.defineProperty(exports, 'defrag', {
                enumerable: true,
                get: function () {
                    return dom_1.defrag;
                }
            });
            var listener_1 = _dereq_('./src/util/listener');
            Object.defineProperty(exports, 'listen', {
                enumerable: true,
                get: function () {
                    return listener_1.listen;
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
            var identity_1 = _dereq_('./src/util/identity');
            Object.defineProperty(exports, 'identity', {
                enumerable: true,
                get: function () {
                    return identity_1.identity;
                }
            });
        },
        {
            './src/builder': 31,
            './src/proxy': 32,
            './src/util/dom': 33,
            './src/util/identity': 34,
            './src/util/listener': 35,
            './src/util/query': 36,
            'spica/global': 17
        }
    ],
    31: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.SVG = exports.HTML = exports.Shadow = exports.API = void 0;
            const alias_1 = _dereq_('spica/alias');
            const proxy_1 = _dereq_('./proxy');
            const dom_1 = _dereq_('./util/dom');
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
                        if (attrs !== void 0 && isElChildren(attrs))
                            return build(void 0, attrs, factory);
                        const node = formatter(elem(factory, attrs, children));
                        return node.nodeType === 1 ? new proxy_1.Elem(node, children) : new proxy_1.Elem(node.host, children, node);
                    };
                    function isElChildren(children) {
                        if (typeof children !== 'object')
                            return true;
                        for (const i in children) {
                            if (!(0, alias_1.hasOwnProperty)(children, i))
                                continue;
                            return typeof children[i] === 'object';
                        }
                        return true;
                    }
                    function elem(factory, attrs, children) {
                        const el = factory ? (0, dom_1.define)(factory(baseFactory, tag, attrs || {}, children), attrs) : baseFactory(tag, attrs);
                        if (tag !== el.tagName.toLowerCase())
                            throw new Error(`TypedDOM: Expected tag name is "${ tag }" but actually "${ el.tagName.toLowerCase() }".`);
                        return el;
                    }
                }
            }
        },
        {
            './proxy': 32,
            './util/dom': 33,
            'spica/alias': 5
        }
    ],
    32: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.Elem = exports.proxy = void 0;
            const global_1 = _dereq_('spica/global');
            const alias_1 = _dereq_('spica/alias');
            const identity_1 = _dereq_('./util/identity');
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
            const tag = Symbol.for('typed-dom::tag');
            const id = (0, identity_1.identity)();
            let counter = 0;
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
                    case children_ === void 0:
                        this.type = 0;
                        break;
                    case typeof children_ === 'string':
                        this.type = 1;
                        break;
                    case (0, alias_1.isArray)(children_):
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
                        (0, dom_1.define)(this.container, []);
                        this.children_ = this.container.appendChild((0, dom_1.text)(''));
                        this.children = children_;
                        this.isInit = false;
                        return;
                    case 2:
                        (0, dom_1.define)(this.container, []);
                        this.children_ = [];
                        this.children = children_;
                        this.isInit = false;
                        return;
                    case 3:
                        (0, dom_1.define)(this.container, []);
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
                    this.id_ = this.element.id;
                    if (/^[\w-]+$/.test(this.id_))
                        return this.id_;
                    this.id_ = `rnd-${ id }-${ ++counter }`;
                    this.element.classList.add(this.id_);
                    return this.id_;
                }
                get query() {
                    if (this.query_)
                        return this.query_;
                    switch (true) {
                    case this.element !== this.container:
                        return this.query_ = ':host';
                    case this.id === this.element.id:
                        return this.query_ = `#${ this.id }`;
                    default:
                        return this.query_ = `.${ this.id }`;
                    }
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
                    style.innerHTML = html.replace(target, `$1$2${ query }`);
                    if (!style.firstElementChild)
                        return;
                    for (let es = style.children, i = 0, len = es.length; i < len; ++i) {
                        es[0].remove();
                    }
                }
                observe(children) {
                    const descs = {};
                    for (const name of (0, alias_1.ObjectKeys)(children)) {
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
                    return (0, alias_1.ObjectDefineProperties)(children, descs);
                }
                get children() {
                    switch (this.type) {
                    case 1:
                        if (this.children_.parentNode !== this.container) {
                            this.children_ = void 0;
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
                    let isMutated = false;
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
                            this.element.dispatchEvent(new global_1.Event('mutate', {
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
                                    isMutated = true;
                                }
                                targetChildren.push(newChild);
                            }
                            for (let i = nodeChildren.length; sourceChildren.length < i--;) {
                                const el = nodeChildren[sourceChildren.length];
                                if (!proxies.has(el))
                                    continue;
                                removedChildren.push(proxy(this.container.removeChild(el)));
                                isMutated = true;
                            }
                            break;
                        }
                    case 3: {
                            const sourceChildren = children;
                            const targetChildren = this.children_;
                            for (const name of (0, alias_1.ObjectKeys)(targetChildren)) {
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
                                        i > -1 && (0, array_1.splice)(removedChildren, i, 1);
                                        removedChildren.push(oldChild);
                                        i = addedChildren.lastIndexOf(oldChild);
                                        i > -1 && (0, array_1.splice)(addedChildren, i, 1);
                                    }
                                }
                                this.isPartialUpdate = true;
                                targetChildren[name] = sourceChildren[name];
                                this.isPartialUpdate = false;
                                isMutated = true;
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
                    if (isMutated) {
                        this.element.dispatchEvent(new global_1.Event('mutate', {
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
            './util/dom': 33,
            './util/identity': 34,
            'spica/alias': 5,
            'spica/array': 6,
            'spica/global': 17
        }
    ],
    33: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.defrag = exports.isChildren = exports.define = exports.element = exports.text = exports.svg = exports.html = exports.frag = exports.shadow = void 0;
            const global_1 = _dereq_('spica/global');
            const alias_1 = _dereq_('spica/alias');
            const memoize_1 = _dereq_('spica/memoize');
            const array_1 = _dereq_('spica/array');
            var caches;
            (function (caches) {
                caches.shadows = new WeakMap();
                caches.fragment = global_1.document.createDocumentFragment();
            }(caches || (caches = {})));
            function shadow(el, children, opts) {
                if (typeof el === 'string')
                    return shadow((0, exports.html)(el), children, opts);
                if (children && !isChildren(children))
                    return shadow(el, void 0, children);
                const root = opts === void 0 ? el.shadowRoot || caches.shadows.get(el) : opts.mode === 'open' ? el.shadowRoot || void 0 : caches.shadows.get(el);
                return defineChildren(!opts || opts.mode === 'open' ? root || el.attachShadow(opts || { mode: 'open' }) : root || caches.shadows.set(el, el.attachShadow(opts)).get(el), !root && children == void 0 ? el.childNodes : children);
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
                const cache = (0, memoize_1.memoize)(elem, (_, ns, tag) => `${ ns }:${ tag }`);
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
                for (let i = 0, names = (0, alias_1.ObjectKeys)(attrs); i < names.length; ++i) {
                    const name = names[i];
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
                                'touchmove',
                                'touchend',
                                'touchcancel'
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
                if (!('length' in children)) {
                    if (node.firstChild)
                        return defineChildren(node, (0, array_1.push)([], children));
                    for (const child of children) {
                        node.append(child);
                    }
                    return node;
                }
                if (!(0, alias_1.isArray)(children)) {
                    if (node.firstChild)
                        return defineChildren(node, (0, array_1.push)([], children));
                    for (let i = children.length; i--;) {
                        node.prepend(children[i]);
                    }
                    return node;
                }
                const targetNodes = node.firstChild ? node.childNodes : [];
                let targetLength = targetNodes.length;
                if (targetLength === 0)
                    return append(node, children);
                let count = 0;
                I:
                    for (let i = 0; i < children.length; ++i) {
                        if (count === targetLength)
                            return append(node, children, i);
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
            exports.isChildren = isChildren;
            function equal(node, data) {
                return typeof data === 'string' ? 'wholeText' in node && node.data === data : node === data;
            }
            function append(node, children, i = 0) {
                for (let len = children.length; i < len; ++i) {
                    node.append(children[i]);
                }
                return node;
            }
            function defrag(nodes) {
                const acc = [];
                for (let i = 0; i < nodes.length; ++i) {
                    const node = nodes[i];
                    if (node === '')
                        continue;
                    acc.length > 0 && typeof node === 'string' && typeof nodes[i - 1] === 'string' ? acc[acc.length - 1] += node : acc.push(node);
                }
                return acc;
            }
            exports.defrag = defrag;
        },
        {
            'spica/alias': 5,
            'spica/array': 6,
            'spica/global': 17,
            'spica/memoize': 20
        }
    ],
    34: [
        function (_dereq_, module, exports) {
            'use strict';
            var _a;
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.identity = void 0;
            const global_1 = _dereq_('spica/global');
            const random_1 = _dereq_('spica/random');
            const ids = Symbol.for('typed-dom::ids');
            exports.identity = (0, random_1.unique)(random_1.rnd0Z, 2, (_a = global_1.global[ids]) !== null && _a !== void 0 ? _a : global_1.global[ids] = new global_1.Set());
        },
        {
            'spica/global': 17,
            'spica/random': 24
        }
    ],
    35: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.bind = exports.delegate = exports.wait = exports.once = exports.listen = exports.currentTarget = void 0;
            const promise_1 = _dereq_('spica/promise');
            const function_1 = _dereq_('spica/function');
            const noop_1 = _dereq_('spica/noop');
            exports.currentTarget = Symbol.for('typed-dom::currentTarget');
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
                    return cx ? unbind = once(cx, type, listener, option) : void 0, ev.returnValue;
                }, {
                    ...option,
                    capture: true
                });
            }
            exports.delegate = delegate;
            function bind(target, type, listener, option = false) {
                target.addEventListener(type, handler, option);
                return (0, function_1.once)(() => void target.removeEventListener(type, handler, option));
                function handler(ev) {
                    return exports.currentTarget in ev && !ev[exports.currentTarget] ? void 0 : ev[exports.currentTarget] = ev.currentTarget, listener(ev);
                }
            }
            exports.bind = bind;
        },
        {
            'spica/function': 16,
            'spica/noop': 22,
            'spica/promise': 23
        }
    ],
    36: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.apply = void 0;
            const dom_1 = _dereq_('./dom');
            function apply(node, selector, attrs) {
                const ns = node.querySelectorAll(selector);
                for (let i = 0, len = ns.length; i < len; ++i) {
                    (0, dom_1.define)(ns[i], attrs);
                }
                return ns;
            }
            exports.apply = apply;
        },
        { './dom': 33 }
    ],
    37: [
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
            __exportStar(_dereq_('./combinator/data/parser/union'), exports);
            __exportStar(_dereq_('./combinator/data/parser/inits'), exports);
            __exportStar(_dereq_('./combinator/data/parser/tails'), exports);
            __exportStar(_dereq_('./combinator/data/parser/sequence'), exports);
            __exportStar(_dereq_('./combinator/data/parser/subsequence'), exports);
            __exportStar(_dereq_('./combinator/data/parser/some'), exports);
            __exportStar(_dereq_('./combinator/control/constraint/block'), exports);
            __exportStar(_dereq_('./combinator/control/constraint/line'), exports);
            __exportStar(_dereq_('./combinator/control/constraint/contract'), exports);
            __exportStar(_dereq_('./combinator/control/manipulation/fence'), exports);
            __exportStar(_dereq_('./combinator/control/manipulation/indent'), exports);
            __exportStar(_dereq_('./combinator/control/manipulation/scope'), exports);
            __exportStar(_dereq_('./combinator/control/manipulation/context'), exports);
            __exportStar(_dereq_('./combinator/control/manipulation/resource'), exports);
            __exportStar(_dereq_('./combinator/control/manipulation/surround'), exports);
            __exportStar(_dereq_('./combinator/control/manipulation/match'), exports);
            __exportStar(_dereq_('./combinator/control/manipulation/convert'), exports);
            __exportStar(_dereq_('./combinator/control/manipulation/trim'), exports);
            __exportStar(_dereq_('./combinator/control/manipulation/duplicate'), exports);
            __exportStar(_dereq_('./combinator/control/manipulation/reverse'), exports);
            __exportStar(_dereq_('./combinator/control/manipulation/recovery'), exports);
            __exportStar(_dereq_('./combinator/control/manipulation/lazy'), exports);
            __exportStar(_dereq_('./combinator/control/monad/fmap'), exports);
            __exportStar(_dereq_('./combinator/control/monad/bind'), exports);
        },
        {
            './combinator/control/constraint/block': 38,
            './combinator/control/constraint/contract': 39,
            './combinator/control/constraint/line': 40,
            './combinator/control/manipulation/context': 41,
            './combinator/control/manipulation/convert': 42,
            './combinator/control/manipulation/duplicate': 43,
            './combinator/control/manipulation/fence': 44,
            './combinator/control/manipulation/indent': 45,
            './combinator/control/manipulation/lazy': 46,
            './combinator/control/manipulation/match': 47,
            './combinator/control/manipulation/recovery': 48,
            './combinator/control/manipulation/resource': 49,
            './combinator/control/manipulation/reverse': 50,
            './combinator/control/manipulation/scope': 51,
            './combinator/control/manipulation/surround': 52,
            './combinator/control/manipulation/trim': 53,
            './combinator/control/monad/bind': 54,
            './combinator/control/monad/fmap': 55,
            './combinator/data/parser/inits': 57,
            './combinator/data/parser/sequence': 58,
            './combinator/data/parser/some': 59,
            './combinator/data/parser/subsequence': 60,
            './combinator/data/parser/tails': 61,
            './combinator/data/parser/union': 62
        }
    ],
    38: [
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
                    const rest = (0, parser_1.exec)(result);
                    if (separation && !(0, line_1.isEmpty)((0, line_1.firstline)(rest)))
                        return;
                    return rest === '' || source[source.length - rest.length - 1] === '\n' ? result : global_1.undefined;
                };
            }
            exports.block = block;
        },
        {
            '../../data/parser': 56,
            './line': 40,
            'spica/global': 17
        }
    ],
    39: [
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
                if (!(0, alias_1.isArray)(patterns))
                    return validate([patterns], has, end, parser);
                const match = (0, global_1.Function)('patterns', [
                    '"use strict";',
                    'return source =>',
                    'false',
                    ...patterns.map((pattern, i) => typeof pattern === 'string' ? `|| source.slice(0, ${ pattern.length }) === '${ pattern }'` : `|| patterns[${ i }].test(source)`)
                ].join(''))(patterns);
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
                    return (0, parser_1.exec)(result).length < source.length ? result : global_1.undefined;
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
                    if (!cond((0, parser_1.eval)(result), (0, parser_1.exec)(result), context))
                        return;
                    return (0, parser_1.exec)(result).length < source.length ? result : global_1.undefined;
                };
            }
            exports.verify = verify;
        },
        {
            '../../data/parser': 56,
            'spica/alias': 5,
            'spica/global': 17
        }
    ],
    40: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.isEmpty = exports.firstline = exports.line = void 0;
            const global_1 = _dereq_('spica/global');
            const parser_1 = _dereq_('../../data/parser');
            function line(parser) {
                return (source, context) => {
                    if (source === '')
                        return;
                    const line = firstline(source);
                    const result = parser(line, context);
                    if (!result)
                        return;
                    return isEmpty((0, parser_1.exec)(result)) ? [
                        (0, parser_1.eval)(result),
                        source.slice(line.length)
                    ] : global_1.undefined;
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
        },
        {
            '../../data/parser': 56,
            'spica/global': 17
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
                const clone = (0, memoize_1.memoize)(context => (0, alias_1.ObjectCreate)(context), new global_1.WeakMap());
                return (source, context) => parser(source, inherit(clone(context), base));
            }
            exports.update = update;
            function context(base, parser) {
                const inherit_ = (0, memoize_1.memoize)(context => inherit((0, alias_1.ObjectCreate)(context), base), new global_1.WeakMap());
                return (source, context) => parser(source, inherit_(context));
            }
            exports.context = context;
            const inherit = (0, assign_1.template)((prop, target, source) => {
                switch (prop) {
                case 'resources':
                    if (prop in target && !(0, alias_1.hasOwnProperty)(target, prop))
                        return;
                    return target[prop] = (0, alias_1.ObjectCreate)(source[prop]);
                }
                switch ((0, type_1.type)(source[prop])) {
                case 'Object':
                    switch ((0, type_1.type)(target[prop])) {
                    case 'Object':
                        return target[prop] = inherit((0, alias_1.ObjectCreate)(target[prop]), source[prop]);
                    default:
                        return target[prop] = (0, alias_1.ObjectCreate)(source[prop]);
                    }
                default:
                    return target[prop] = (0, type_1.isPrimitive)(source[prop]) ? source[prop] : (0, alias_1.ObjectCreate)(source[prop]);
                }
            });
        },
        {
            'spica/alias': 5,
            'spica/assign': 8,
            'spica/global': 17,
            'spica/memoize': 20,
            'spica/type': 27
        }
    ],
    42: [
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
    43: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.dup = void 0;
            const fmap_1 = _dereq_('../monad/fmap');
            function dup(parser) {
                return (0, fmap_1.fmap)(parser, nodes => [nodes]);
            }
            exports.dup = dup;
        },
        { '../monad/fmap': 55 }
    ],
    44: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.fence = void 0;
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
                    if (matches[0].indexOf(delim, delim.length) > -1)
                        return;
                    let rest = source.slice(matches[0].length);
                    if ((0, line_1.isEmpty)((0, line_1.firstline)(rest)) && (0, line_1.firstline)(rest.slice((0, line_1.firstline)(rest).length)).trimEnd() !== delim)
                        return;
                    let block = '';
                    let closer = '';
                    for (let count = 1, next = (0, line_1.firstline)(rest);; ++count) {
                        if (rest === '')
                            break;
                        const line = next;
                        next = (0, line_1.firstline)(rest.slice(line.length));
                        if (count > limit + 1 && (0, line_1.isEmpty)(line))
                            break;
                        if (count <= limit + 1 && line.slice(0, delim.length) === delim && line.trimEnd() === delim && (!separation || (0, line_1.isEmpty)(next))) {
                            closer = delim;
                            rest = rest.slice(line.length);
                            break;
                        }
                        block += line;
                        rest = rest.slice(line.length);
                    }
                    return [
                        (0, array_1.unshift)([
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
            '../constraint/line': 40,
            'spica/array': 6
        }
    ],
    45: [
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
            const memoize_1 = _dereq_('spica/memoize');
            const cache_1 = _dereq_('spica/cache');
            const array_1 = _dereq_('spica/array');
            function indent(parser) {
                return (0, bind_1.bind)((0, match_1.match)(/^(?=(([^\S\n])\2*))/, (0, memoize_1.memoize)(([, indent]) => (0, some_1.some)((0, line_1.line)((0, surround_1.open)(indent, source => [
                    [unline(source)],
                    ''
                ]))), ([, indent]) => indent, new cache_1.Cache(100))), (nodes, rest, context) => {
                    const result = parser((0, array_1.join)(nodes, '\n'), context);
                    return result && (0, parser_1.exec)(result) === '' ? [
                        (0, parser_1.eval)(result),
                        rest
                    ] : global_1.undefined;
                });
            }
            exports.indent = indent;
            function unline(line) {
                return line === '' || line[line.length - 1] !== '\n' ? line : line.slice(0, -1);
            }
        },
        {
            '../../data/parser': 56,
            '../../data/parser/some': 59,
            '../constraint/line': 40,
            '../monad/bind': 54,
            './match': 47,
            './surround': 52,
            'spica/array': 6,
            'spica/cache': 9,
            'spica/global': 17,
            'spica/memoize': 20
        }
    ],
    46: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.lazy = void 0;
            function lazy(builder) {
                let parser;
                return (source, context) => (parser !== null && parser !== void 0 ? parser : parser = builder())(source, context);
            }
            exports.lazy = lazy;
        },
        {}
    ],
    47: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.match = void 0;
            const global_1 = _dereq_('spica/global');
            const parser_1 = _dereq_('../../data/parser');
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
                    return (0, parser_1.exec)(result).length < source.length && (0, parser_1.exec)(result).length <= rest.length ? result : global_1.undefined;
                };
            }
            exports.match = match;
        },
        {
            '../../data/parser': 56,
            'spica/global': 17
        }
    ],
    48: [
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
    49: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.creator = void 0;
            function creator(cost, parser) {
                if (typeof cost === 'function')
                    return creator(1, cost);
                return (source, context) => {
                    const result = parser(source, context);
                    if (!result)
                        return;
                    const {resources} = context;
                    if (resources) {
                        resources.budget -= cost;
                        if (resources.budget < 0)
                            throw new Error('Too many creations.');
                    }
                    return result;
                };
            }
            exports.creator = creator;
        },
        {}
    ],
    50: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.reverse = void 0;
            const fmap_1 = _dereq_('../monad/fmap');
            function reverse(parser) {
                return (0, fmap_1.fmap)(parser, nodes => nodes.reverse());
            }
            exports.reverse = reverse;
        },
        { '../monad/fmap': 55 }
    ],
    51: [
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
                    return (0, parser_1.exec)(result).length < src.length ? [
                        (0, parser_1.eval)(result),
                        (0, parser_1.exec)(result) + source.slice(src.length)
                    ] : global_1.undefined;
                };
            }
            exports.focus = focus;
            function rewrite(scope, parser) {
                return (source, context) => {
                    if (source === '')
                        return;
                    const res1 = scope(source, context);
                    if (!res1 || (0, parser_1.exec)(res1).length >= source.length)
                        return;
                    const src = source.slice(0, source.length - (0, parser_1.exec)(res1).length);
                    const res2 = parser(src, context);
                    if (!res2)
                        return;
                    return (0, parser_1.exec)(res2).length < src.length ? [
                        (0, parser_1.eval)(res2),
                        (0, parser_1.exec)(res2) + (0, parser_1.exec)(res1)
                    ] : global_1.undefined;
                };
            }
            exports.rewrite = rewrite;
        },
        {
            '../../data/parser': 56,
            'spica/global': 17
        }
    ],
    52: [
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
                    const rl = (0, parser_1.eval)(res1);
                    const mr_ = (0, parser_1.exec)(res1);
                    const res2 = mr_ !== '' ? parser(mr_, context) : global_1.undefined;
                    const rm = (0, parser_1.eval)(res2);
                    const r_ = (0, parser_1.exec)(res2, mr_);
                    if (!rm && !optional)
                        return;
                    const res3 = closer(r_, context);
                    const rr = (0, parser_1.eval)(res3);
                    const rest = (0, parser_1.exec)(res3, r_);
                    if (rest.length === lmr_.length)
                        return;
                    return rr ? f ? f([
                        rl,
                        rm,
                        rr
                    ], rest, context) : [
                        (0, array_1.push)((0, array_1.unshift)(rl, rm !== null && rm !== void 0 ? rm : []), rr),
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
                return (0, fmap_1.fmap)(parser, () => []);
            }
            exports.clear = clear;
        },
        {
            '../../data/parser': 56,
            '../monad/fmap': 55,
            'spica/array': 6,
            'spica/global': 17
        }
    ],
    53: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.trimEnd = exports.trimStart = exports.trim = void 0;
            const convert_1 = _dereq_('./convert');
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
        },
        { './convert': 42 }
    ],
    54: [
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
                    const res2 = f((0, parser_1.eval)(res1), (0, parser_1.exec)(res1), context);
                    if (!res2)
                        return;
                    return (0, parser_1.exec)(res2).length <= (0, parser_1.exec)(res1).length ? res2 : global_1.undefined;
                };
            }
            exports.bind = bind;
        },
        {
            '../../data/parser': 56,
            'spica/global': 17
        }
    ],
    55: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.fmap = void 0;
            const bind_1 = _dereq_('./bind');
            function fmap(parser, f) {
                return (0, bind_1.bind)(parser, (nodes, rest, context) => [
                    f(nodes, rest, context),
                    rest
                ]);
            }
            exports.fmap = fmap;
        },
        { './bind': 54 }
    ],
    56: [
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
    57: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.inits = void 0;
            const global_1 = _dereq_('spica/global');
            const parser_1 = _dereq_('../parser');
            const array_1 = _dereq_('spica/array');
            function inits(parsers) {
                if (parsers.length === 1)
                    return parsers[0];
                return (source, context) => {
                    var _a;
                    let rest = source;
                    let nodes;
                    for (let i = 0, len = parsers.length; i < len; ++i) {
                        if (rest === '')
                            break;
                        const result = parsers[i](rest, context);
                        if (!result)
                            break;
                        nodes = nodes ? (0, array_1.push)(nodes, (0, parser_1.eval)(result)) : (0, parser_1.eval)(result);
                        rest = (0, parser_1.exec)(result);
                    }
                    return nodes && rest.length < source.length ? [
                        nodes,
                        rest
                    ] : global_1.undefined;
                };
            }
            exports.inits = inits;
        },
        {
            '../parser': 56,
            'spica/array': 6,
            'spica/global': 17
        }
    ],
    58: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.sequence = void 0;
            const global_1 = _dereq_('spica/global');
            const parser_1 = _dereq_('../parser');
            const array_1 = _dereq_('spica/array');
            function sequence(parsers) {
                if (parsers.length === 1)
                    return parsers[0];
                return (source, context) => {
                    var _a;
                    let rest = source;
                    let nodes;
                    for (let i = 0, len = parsers.length; i < len; ++i) {
                        if (rest === '')
                            return;
                        const result = parsers[i](rest, context);
                        if (!result)
                            return;
                        nodes = nodes ? (0, array_1.push)(nodes, (0, parser_1.eval)(result)) : (0, parser_1.eval)(result);
                        rest = (0, parser_1.exec)(result);
                    }
                    return nodes && rest.length < source.length ? [
                        nodes,
                        rest
                    ] : global_1.undefined;
                };
            }
            exports.sequence = sequence;
        },
        {
            '../parser': 56,
            'spica/array': 6,
            'spica/global': 17
        }
    ],
    59: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.some = void 0;
            const global_1 = _dereq_('spica/global');
            const parser_1 = _dereq_('../parser');
            const array_1 = _dereq_('spica/array');
            function some(parser, until, deep, limit = -1) {
                if (typeof until === 'number')
                    return some(parser, global_1.undefined, deep, until);
                const match = typeof until === 'string' && until !== global_1.undefined ? source => source.slice(0, until.length) === until : source => !!until && until.test(source);
                const delim = typeof deep === 'string' && deep !== global_1.undefined ? source => source.slice(0, deep.length) === deep : source => !!deep && deep.test(source);
                let memory = '';
                return (source, context) => {
                    var _a, _b, _c;
                    if (source === memory)
                        return;
                    let rest = source;
                    let nodes;
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
                        nodes = nodes ? (0, array_1.push)(nodes, (0, parser_1.eval)(result)) : (0, parser_1.eval)(result);
                        rest = (0, parser_1.exec)(result);
                        if (limit >= 0 && source.length - rest.length > limit)
                            break;
                    }
                    if (context && deep) {
                        ((_b = context.delimiters) === null || _b === void 0 ? void 0 : _b.length) > 1 ? (_c = context.delimiters) === null || _c === void 0 ? void 0 : _c.pop() : context.delimiters = global_1.undefined;
                    }
                    memory = limit < 0 && rest || memory;
                    return nodes && rest.length < source.length ? [
                        nodes,
                        rest
                    ] : global_1.undefined;
                };
            }
            exports.some = some;
        },
        {
            '../parser': 56,
            'spica/array': 6,
            'spica/global': 17
        }
    ],
    60: [
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
                    return (0, union_1.union)(parsers);
                case 2:
                    return (0, union_1.union)([
                        (0, inits_1.inits)(parsers),
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
            './inits': 57,
            './union': 62
        }
    ],
    61: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.tails = void 0;
            const union_1 = _dereq_('./union');
            const sequence_1 = _dereq_('./sequence');
            function tails(parsers) {
                return (0, union_1.union)(parsers.map((_, i) => (0, sequence_1.sequence)(parsers.slice(i))));
            }
            exports.tails = tails;
        },
        {
            './sequence': 58,
            './union': 62
        }
    ],
    62: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.union = void 0;
            const global_1 = _dereq_('spica/global');
            function union(parsers) {
                switch (parsers.length) {
                case 0:
                    return () => global_1.undefined;
                case 1:
                    return parsers[0];
                default:
                    return (0, global_1.Function)('parsers', [
                        '"use strict";',
                        'return (source, context) =>',
                        '0',
                        ...parsers.map((_, i) => `|| parsers[${ i }](source, context)`)
                    ].join(''))(parsers);
                }
            }
            exports.union = union;
        },
        { 'spica/global': 17 }
    ],
    63: [
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
        { './parser/api': 64 }
    ],
    64: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.normalize = exports.body = exports.headers = exports.header = exports.caches = exports.bind = exports.parse = void 0;
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
        },
        {
            './api/bind': 65,
            './api/body': 66,
            './api/cache': 67,
            './api/header': 68,
            './api/normalize': 69,
            './api/parse': 70
        }
    ],
    65: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.bind = void 0;
            const global_1 = _dereq_('spica/global');
            const alias_1 = _dereq_('spica/alias');
            const parser_1 = _dereq_('../../combinator/data/parser');
            const header_1 = _dereq_('../header');
            const block_1 = _dereq_('../block');
            const segment_1 = _dereq_('../segment');
            const normalize_1 = _dereq_('./normalize');
            const header_2 = _dereq_('./header');
            const figure_1 = _dereq_('../function/figure');
            const footnote_1 = _dereq_('../function/footnote');
            const url_1 = _dereq_('spica/url');
            const array_1 = _dereq_('spica/array');
            function bind(target, settings) {
                var _a, _b;
                let context = (0, alias_1.ObjectAssign)({}, settings, {
                    host: (_a = settings.host) !== null && _a !== void 0 ? _a : new url_1.ReadonlyURL(global_1.location.pathname, global_1.location.origin),
                    footnotes: global_1.undefined,
                    chunk: global_1.undefined
                });
                if (((_b = context.host) === null || _b === void 0 ? void 0 : _b.origin) === 'null')
                    throw new Error(`Invalid host: ${ context.host.href }`);
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
                    var _a, _b, _c, _d;
                    if (settings.chunk && revision)
                        throw new Error('Chunks cannot be updated.');
                    const url = ((_a = (0, header_2.headers)(source).find(field => field.toLowerCase().startsWith('url:'))) === null || _a === void 0 ? void 0 : _a.slice(4).trim()) || '';
                    source = (0, normalize_1.normalize)((0, segment_1.prepare)(source));
                    context = (0, alias_1.ObjectAssign)(context, { url: url ? new url_1.ReadonlyURL(url) : global_1.undefined });
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
                        const es = (0, parser_1.eval)(index === 0 && (0, header_1.header)(seg, context) || (0, block_1.block)(seg, context), []);
                        blocks.splice(index, 0, [
                            seg,
                            es,
                            url
                        ]);
                        if (es.length === 0)
                            continue;
                        (0, array_1.push)(adds, es.map(el => [
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
                    for (let refuse = (0, array_1.splice)(blocks, index, blocks.length - sourceSegments.length), i = 0; i < refuse.length; ++i) {
                        const es = refuse[i][1];
                        if (es.length === 0)
                            continue;
                        (0, array_1.push)(dels, es.map(el => [el]));
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
                        const [el] = dels.shift();
                        (_b = el.parentNode) === null || _b === void 0 ? void 0 : _b.removeChild(el);
                        yield {
                            type: 'block',
                            value: el
                        };
                        if (rev !== revision)
                            return yield { type: 'cancel' };
                    }
                    for (const el of (0, footnote_1.footnote)(((_c = next(0)) === null || _c === void 0 ? void 0 : _c.parentNode) || target, settings.footnotes, context)) {
                        el ? yield {
                            type: 'footnote',
                            value: el
                        } : yield { type: 'break' };
                        if (rev !== revision)
                            return yield { type: 'cancel' };
                    }
                    for (const el of (0, figure_1.figure)(((_d = next(0)) === null || _d === void 0 ? void 0 : _d.parentNode) || target, settings.footnotes, context)) {
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
                function nearest(index) {
                    let el;
                    let len = 0;
                    for (let i = 0; i < blocks.length; ++i) {
                        const block = blocks[i];
                        len += block[0].length;
                        el = block[1][0] || el;
                        if (len >= index)
                            break;
                    }
                    return el;
                }
                function index(source) {
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
            '../../combinator/data/parser': 56,
            '../block': 72,
            '../function/figure': 96,
            '../function/footnote': 97,
            '../header': 98,
            '../segment': 136,
            './header': 68,
            './normalize': 69,
            'spica/alias': 5,
            'spica/array': 6,
            'spica/global': 17,
            'spica/url': 28
        }
    ],
    66: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.body = void 0;
            const header_1 = _dereq_('./header');
            function body(source) {
                return source.slice((0, header_1.header)(source).length);
            }
            exports.body = body;
        },
        { './header': 68 }
    ],
    67: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.caches = void 0;
            const cache_1 = _dereq_('spica/cache');
            exports.caches = {
                code: new cache_1.Cache(100),
                math: new cache_1.Cache(100),
                media: new cache_1.Cache(100)
            };
        },
        { 'spica/cache': 9 }
    ],
    68: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.headers = exports.header = void 0;
            const parser_1 = _dereq_('../../combinator/data/parser');
            const header_1 = _dereq_('../header');
            function header(source) {
                return source.slice(0, source.length - (0, parser_1.exec)((0, header_1.header)(source, {}), source).length);
            }
            exports.header = header;
            function headers(source) {
                const [el] = (0, parser_1.eval)((0, header_1.header)(source, {}), []);
                return el && el.childNodes.length > 1 ? el.lastChild.textContent.split(/[^\S\n]*\n/) : [];
            }
            exports.headers = headers;
        },
        {
            '../../combinator/data/parser': 56,
            '../header': 98
        }
    ],
    69: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.normalize = void 0;
            const htmlentity_1 = _dereq_('../inline/htmlentity');
            const parser_1 = _dereq_('../../combinator/data/parser');
            const unreadableHTMLEntityNames = [
                'shy',
                'emsp13',
                'emsp14',
                'ThinSpace',
                'thinsp',
                'VeryThinSpace',
                'hairsp',
                'ZeroWidthSpace',
                'NegativeVeryThinSpace',
                'NegativeThinSpace',
                'NegativeMediumSpace',
                'NegativeThickSpace',
                'zwj',
                'zwnj',
                'lrm',
                'rlm',
                'NoBreak',
                'ApplyFunction',
                'af',
                'InvisibleTimes',
                'it',
                'InvisibleComma',
                'ic'
            ];
            const unreadableEscapableCharacters = unreadableHTMLEntityNames.flatMap(name => (0, parser_1.eval)((0, htmlentity_1.htmlentity)(`&${ name };`, {}), []));
            const unreadableEscapableCharacter = new RegExp(`[${ [...new Set(unreadableEscapableCharacters)].join('') }]`, 'g');
            const unreadableSpecialCharacters = [
                '\u2006',
                '\u200B',
                '‌',
                '‍',
                '\u200E',
                '\u200F',
                '\u202A',
                '\u202B',
                '\u202C',
                '\u202D',
                '\u202E',
                '\u202F',
                '\u2060',
                '\uFEFF'
            ];
            const UNICODE_REPLACEMENT_CHARACTER = '\uFFFD';
            function normalize(source) {
                return format(sanitize(escape(source)));
            }
            exports.normalize = normalize;
            function format(source) {
                return source.replace(/\r\n?/g, '\n');
            }
            function sanitize(source) {
                return source.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]|[\u2006\u200B-\u200F\u202A-\u202F\u2060\uFEFF]|(^|[^\u1820\u1821])\u180E/g, `$1${ UNICODE_REPLACEMENT_CHARACTER }`).replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]?|[\uDC00-\uDFFF]/g, char => char.length === 1 ? UNICODE_REPLACEMENT_CHARACTER : char);
            }
            function escape(source) {
                return source.replace(unreadableEscapableCharacter, char => `&${ unreadableHTMLEntityNames[unreadableEscapableCharacters.indexOf(char)] };`);
            }
        },
        {
            '../../combinator/data/parser': 56,
            '../inline/htmlentity': 123
        }
    ],
    70: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.parse = void 0;
            const global_1 = _dereq_('spica/global');
            const alias_1 = _dereq_('spica/alias');
            const parser_1 = _dereq_('../../combinator/data/parser');
            const header_1 = _dereq_('../header');
            const block_1 = _dereq_('../block');
            const segment_1 = _dereq_('../segment');
            const normalize_1 = _dereq_('./normalize');
            const header_2 = _dereq_('./header');
            const figure_1 = _dereq_('../function/figure');
            const footnote_1 = _dereq_('../function/footnote');
            const typed_dom_1 = _dereq_('typed-dom');
            const memoize_1 = _dereq_('spica/memoize');
            const url_1 = _dereq_('spica/url');
            const array_1 = _dereq_('spica/array');
            const inherit = (0, memoize_1.memoize)(context => (0, alias_1.ObjectCreate)(context), new WeakMap());
            const inherit2 = (0, memoize_1.memoize)(context => (0, memoize_1.memoize)(_ => (0, alias_1.ObjectCreate)(context)), new WeakMap());
            function parse(source, opts = {}, context) {
                var _a, _b, _c, _d, _e, _f, _g, _h;
                if (source.length > segment_1.SEGMENT_LENGTH_LIMIT)
                    throw new Error(`Too large input over ${ segment_1.SEGMENT_LENGTH_LIMIT.toLocaleString('en') } in length.`);
                const url = ((_a = (0, header_2.headers)(source).find(field => field.toLowerCase().startsWith('url:'))) === null || _a === void 0 ? void 0 : _a.slice(4).trim()) || '';
                source = !context ? (0, normalize_1.normalize)(source) : source;
                context = context && url === '' && context.id === opts.id ? context : (0, alias_1.ObjectAssign)(context ? url ? inherit2(context)(url) : inherit(context) : {}, opts, {
                    host: (_c = (_b = opts.host) !== null && _b !== void 0 ? _b : context === null || context === void 0 ? void 0 : context.host) !== null && _c !== void 0 ? _c : new url_1.ReadonlyURL(global_1.location.pathname, global_1.location.origin),
                    url: url ? new url_1.ReadonlyURL(url) : context === null || context === void 0 ? void 0 : context.url,
                    id: (_d = opts.id) !== null && _d !== void 0 ? _d : context === null || context === void 0 ? void 0 : context.id,
                    footnotes: global_1.undefined,
                    header: global_1.undefined,
                    test: global_1.undefined
                });
                if (((_e = context.host) === null || _e === void 0 ? void 0 : _e.origin) === 'null')
                    throw new Error(`Invalid host: ${ context.host.href }`);
                const es = [];
                let head = (_f = opts.header) !== null && _f !== void 0 ? _f : true;
                for (const seg of (0, segment_1.segment)(source)) {
                    (0, array_1.push)(es, (0, parser_1.eval)(head && (0, header_1.header)(seg, context) || (0, block_1.block)(seg, context), []));
                    head = false;
                }
                const node = (0, typed_dom_1.frag)(es);
                if (opts.test)
                    return node;
                for (const _ of (0, footnote_1.footnote)(node, opts.footnotes, context));
                for (const _ of (0, figure_1.figure)(node, opts.footnotes, context));
                return node;
            }
            exports.parse = parse;
        },
        {
            '../../combinator/data/parser': 56,
            '../block': 72,
            '../function/figure': 96,
            '../function/footnote': 97,
            '../header': 98,
            '../segment': 136,
            './header': 68,
            './normalize': 69,
            'spica/alias': 5,
            'spica/array': 6,
            'spica/global': 17,
            'spica/memoize': 20,
            'spica/url': 28,
            'typed-dom': 30
        }
    ],
    71: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.autolink = void 0;
            const combinator_1 = _dereq_('../combinator');
            const autolink_1 = _dereq_('./inline/autolink');
            const source_1 = _dereq_('./source');
            exports.autolink = (0, combinator_1.lazy)(() => (0, combinator_1.union)([
                autolink_1.autolink,
                source_1.linebreak,
                source_1.unescsource
            ]));
        },
        {
            '../combinator': 37,
            './inline/autolink': 101,
            './source': 137
        }
    ],
    72: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.block = void 0;
            const global_1 = _dereq_('spica/global');
            const combinator_1 = _dereq_('../combinator');
            const source_1 = _dereq_('./source');
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
            const typed_dom_1 = _dereq_('typed-dom');
            const random_1 = _dereq_('spica/random');
            exports.block = (0, combinator_1.creator)(error((0, combinator_1.update)({ resources: { budget: 100 * 1000 } }, (0, combinator_1.union)([
                source_1.emptyline,
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
            ]))));
            function error(parser) {
                return (0, combinator_1.recover)((0, combinator_1.union)([
                    (0, combinator_1.open)('\0', source => {
                        throw new Error(source.split('\n', 1)[0]);
                    }),
                    parser
                ]), (source, {id}, reason) => [
                    [
                        (0, typed_dom_1.html)('h1', {
                            id: id !== '' ? `error:${ (0, random_1.rnd0Z)(8) }` : global_1.undefined,
                            class: 'error'
                        }, reason instanceof Error ? `${ reason.name }: ${ reason.message }` : `UnknownError: ${ reason }`),
                        (0, typed_dom_1.html)('pre', source.replace(/^\0.*\n/, '').slice(0, 1001).replace(/^(.{997}).{4}$/s, '$1...') || global_1.undefined)
                    ],
                    ''
                ]);
            }
        },
        {
            '../combinator': 37,
            './block/blockquote': 73,
            './block/codeblock': 74,
            './block/dlist': 75,
            './block/extension': 76,
            './block/heading': 85,
            './block/horizontalrule': 86,
            './block/ilist': 87,
            './block/mathblock': 88,
            './block/olist': 89,
            './block/paragraph': 90,
            './block/table': 94,
            './block/ulist': 95,
            './source': 137,
            'spica/global': 17,
            'spica/random': 24,
            'typed-dom': 30
        }
    ],
    73: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.blockquote = exports.segment = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const autolink_1 = _dereq_('../autolink');
            const source_1 = _dereq_('../source');
            const parse_1 = _dereq_('../api/parse');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.segment = (0, combinator_1.block)((0, combinator_1.validate)([
                '!>',
                '>'
            ], (0, combinator_1.union)([(0, combinator_1.validate)(/^!?>+(?=[^\S\n]|\n\s*\S)/, (0, combinator_1.some)(source_1.contentline))])));
            exports.blockquote = (0, combinator_1.lazy)(() => (0, combinator_1.block)((0, combinator_1.rewrite)(exports.segment, (0, combinator_1.union)([
                (0, combinator_1.open)(/^(?=>)/, source),
                (0, combinator_1.open)(/^!(?=>)/, markdown)
            ]))));
            const opener = /^(?=>>+(?:$|\s))/;
            const indent = (0, combinator_1.block)((0, combinator_1.open)(opener, (0, combinator_1.some)(source_1.contentline, /^>(?:$|\s)/)), false);
            function unindent(source) {
                return source.replace(/\n$/, '').replace(/^>(?:$|\s|(?=>+(?:$|\s)))/mg, '');
            }
            const source = (0, combinator_1.lazy)(() => (0, combinator_1.fmap)((0, combinator_1.some)((0, combinator_1.creator)((0, combinator_1.union)([
                (0, combinator_1.rewrite)(indent, (0, combinator_1.convert)(unindent, source)),
                (0, combinator_1.rewrite)((0, combinator_1.some)(source_1.contentline, opener), (0, combinator_1.convert)(unindent, (0, combinator_1.fmap)((0, combinator_1.some)(autolink_1.autolink), ns => [(0, typed_dom_1.html)('pre', (0, typed_dom_1.defrag)(ns))])))
            ]))), ns => [(0, typed_dom_1.html)('blockquote', ns)]));
            const markdown = (0, combinator_1.lazy)(() => (0, combinator_1.fmap)((0, combinator_1.some)((0, combinator_1.creator)((0, combinator_1.union)([
                (0, combinator_1.rewrite)(indent, (0, combinator_1.convert)(unindent, markdown)),
                (0, combinator_1.creator)(99, (0, combinator_1.rewrite)((0, combinator_1.some)(source_1.contentline, opener), (0, combinator_1.convert)(unindent, (source, context) => {
                    const annotation = (0, typed_dom_1.html)('ol', { class: 'annotation' });
                    const reference = (0, typed_dom_1.html)('ol', { class: 'reference' });
                    return [
                        [
                            (0, parse_1.parse)(source, {
                                id: '',
                                footnotes: {
                                    annotation,
                                    reference
                                }
                            }, context),
                            annotation,
                            reference
                        ],
                        ''
                    ];
                })))
            ]))), ns => [(0, typed_dom_1.html)('blockquote', ns)]));
        },
        {
            '../../combinator': 37,
            '../api/parse': 70,
            '../autolink': 71,
            '../source': 137,
            'typed-dom': 30
        }
    ],
    74: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.codeblock = exports.segment_ = exports.segment = void 0;
            const global_1 = _dereq_('spica/global');
            const parser_1 = _dereq_('../../combinator/data/parser');
            const combinator_1 = _dereq_('../../combinator');
            const autolink_1 = _dereq_('../autolink');
            const source_1 = _dereq_('../source');
            const typed_dom_1 = _dereq_('typed-dom');
            const array_1 = _dereq_('spica/array');
            const opener = /^(`{3,})(?!`)(\S*)([^\n]*)(?:$|\n)/;
            const language = /^[0-9a-z]+(?:-[a-z][0-9a-z]*)*$/;
            exports.segment = (0, combinator_1.block)((0, combinator_1.validate)('```', (0, combinator_1.clear)((0, combinator_1.fence)(opener, 300))));
            exports.segment_ = (0, combinator_1.block)((0, combinator_1.validate)('```', (0, combinator_1.clear)((0, combinator_1.fence)(opener, 300, false))), false);
            exports.codeblock = (0, combinator_1.block)((0, combinator_1.validate)('```', (0, combinator_1.fmap)((0, combinator_1.fence)(opener, 300), ([body, closer, opener, delim, lang, param], _, context) => {
                var _a, _b;
                [lang, param] = language.test(lang) ? [
                    lang,
                    param
                ] : [
                    '',
                    lang + param
                ];
                param = param.trim();
                const path = (0, array_1.join)((0, parser_1.eval)((0, combinator_1.some)(source_1.escsource, /^\s/)(param, context), []));
                if (!closer || param !== path)
                    return [(0, typed_dom_1.html)('pre', {
                            class: `notranslate invalid`,
                            'data-invalid-syntax': 'codeblock',
                            'data-invalid-type': closer ? 'argument' : 'closer',
                            'data-invalid-description': closer ? 'Invalid argument.' : `Missing the closing delimiter ${ delim }.`
                        }, `${ opener }${ body }${ closer }`)];
                const file = path.split('/').pop() || '';
                const ext = file && file.indexOf('.') > 0 ? file.split('.').pop() : '';
                lang = language.test(lang || ext) ? lang || ext : lang && 'invalid';
                const el = (0, typed_dom_1.html)('pre', { class: 'notranslate' }, body.slice(0, -1) || global_1.undefined);
                if (lang) {
                    el.className += ` code language-${ lang }`;
                    el.setAttribute('data-lang', lang);
                } else {
                    (0, typed_dom_1.define)(el, (0, typed_dom_1.defrag)((0, parser_1.eval)((0, combinator_1.some)(autolink_1.autolink)(el.textContent, context), [])));
                }
                path && el.setAttribute('data-path', path);
                if ((_b = (_a = context.caches) === null || _a === void 0 ? void 0 : _a.code) === null || _b === void 0 ? void 0 : _b.has(`${ lang }\n${ el.textContent }`)) {
                    (0, typed_dom_1.define)(el, context.caches.code.get(`${ lang }\n${ el.textContent }`).cloneNode(true).childNodes);
                }
                return [el];
            })));
        },
        {
            '../../combinator': 37,
            '../../combinator/data/parser': 56,
            '../autolink': 71,
            '../source': 137,
            'spica/array': 6,
            'spica/global': 17,
            'typed-dom': 30
        }
    ],
    75: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.dlist = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const inline_1 = _dereq_('../inline');
            const indexer_1 = _dereq_('../inline/extension/indexer');
            const indexee_1 = _dereq_('../inline/extension/indexee');
            const source_1 = _dereq_('../source');
            const locale_1 = _dereq_('../locale');
            const util_1 = _dereq_('../util');
            const typed_dom_1 = _dereq_('typed-dom');
            const array_1 = _dereq_('spica/array');
            exports.dlist = (0, combinator_1.lazy)(() => (0, combinator_1.block)((0, locale_1.localize)((0, combinator_1.fmap)((0, combinator_1.validate)(/^~[^\S\n]+(?=\S)/, (0, combinator_1.context)({ syntax: { inline: { media: false } } }, (0, combinator_1.some)((0, combinator_1.inits)([
                (0, combinator_1.context)({ syntax: { inline: { label: false } } }, (0, combinator_1.some)(term)),
                (0, combinator_1.some)(desc)
            ])))), es => [(0, typed_dom_1.html)('dl', fillTrailingDescription(es))]))));
            const term = (0, combinator_1.creator)((0, combinator_1.line)((0, indexee_1.indexee)((0, combinator_1.fmap)((0, combinator_1.open)(/^~[^\S\n]+(?=\S)/, (0, util_1.visualize)((0, combinator_1.trim)((0, combinator_1.some)((0, combinator_1.union)([
                indexer_1.indexer,
                inline_1.inline
            ])))), true), ns => [(0, typed_dom_1.html)('dt', (0, typed_dom_1.defrag)(ns))]))));
            const desc = (0, combinator_1.creator)((0, combinator_1.block)((0, combinator_1.fmap)((0, combinator_1.open)(/^:[^\S\n]+(?=\S)|/, (0, combinator_1.rewrite)((0, combinator_1.some)(source_1.anyline, /^[~:][^\S\n]+\S/), (0, util_1.visualize)((0, combinator_1.trim)((0, combinator_1.some)((0, combinator_1.union)([inline_1.inline]))))), true), ns => [(0, typed_dom_1.html)('dd', (0, typed_dom_1.defrag)(ns))]), false));
            function fillTrailingDescription(es) {
                return es.length > 0 && es[es.length - 1].tagName === 'DT' ? (0, array_1.push)(es, [(0, typed_dom_1.html)('dd')]) : es;
            }
        },
        {
            '../../combinator': 37,
            '../inline': 99,
            '../inline/extension/indexee': 118,
            '../inline/extension/indexer': 119,
            '../locale': 134,
            '../source': 137,
            '../util': 143,
            'spica/array': 6,
            'typed-dom': 30
        }
    ],
    76: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.extension = exports.segment = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const figbase_1 = _dereq_('./extension/figbase');
            const fig_1 = _dereq_('./extension/fig');
            const figure_1 = _dereq_('./extension/figure');
            const table_1 = _dereq_('./extension/table');
            const message_1 = _dereq_('./extension/message');
            const aside_1 = _dereq_('./extension/aside');
            const example_1 = _dereq_('./extension/example');
            const placeholder_1 = _dereq_('./extension/placeholder');
            exports.segment = (0, combinator_1.validate)([
                '~~~',
                '[$',
                '$'
            ], (0, combinator_1.validate)(/^~{3,}|^\[?\$[a-z-]\S+[^\S\n]*(?:$|\n)/, (0, combinator_1.union)([
                fig_1.segment,
                figure_1.segment,
                table_1.segment,
                placeholder_1.segment
            ])));
            exports.extension = (0, combinator_1.union)([
                figbase_1.figbase,
                fig_1.fig,
                figure_1.figure,
                table_1.table,
                message_1.message,
                aside_1.aside,
                example_1.example,
                placeholder_1.placeholder
            ]);
        },
        {
            '../../combinator': 37,
            './extension/aside': 77,
            './extension/example': 78,
            './extension/fig': 79,
            './extension/figbase': 80,
            './extension/figure': 81,
            './extension/message': 82,
            './extension/placeholder': 83,
            './extension/table': 84
        }
    ],
    77: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.aside = void 0;
            const combinator_1 = _dereq_('../../../combinator');
            const indexee_1 = _dereq_('../../inline/extension/indexee');
            const parse_1 = _dereq_('../../api/parse');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.aside = (0, combinator_1.creator)(100, (0, combinator_1.block)((0, combinator_1.validate)('~~~', (0, combinator_1.fmap)((0, combinator_1.fence)(/^(~{3,})aside(?!\S)([^\n]*)(?:$|\n)/, 300), ([body, closer, opener, delim, param], _, context) => {
                var _a;
                if (!closer || param.trimStart())
                    return [(0, typed_dom_1.html)('pre', {
                            class: `notranslate invalid`,
                            'data-invalid-syntax': 'aside',
                            'data-invalid-type': closer ? 'argument' : 'closer',
                            'data-invalid-description': closer ? 'Invalid argument.' : `Missing the closing delimiter ${ delim }.`
                        }, `${ opener }${ body }${ closer }`)];
                const annotation = (0, typed_dom_1.html)('ol', { class: 'annotation' });
                const reference = (0, typed_dom_1.html)('ol', { class: 'reference' });
                const view = (0, parse_1.parse)(body.slice(0, -1), {
                    id: '',
                    footnotes: {
                        annotation,
                        reference
                    }
                }, context);
                const heading = 'H1 H2 H3 H4 H5 H6'.split(' ').includes((_a = view.firstElementChild) === null || _a === void 0 ? void 0 : _a.tagName) && view.firstElementChild;
                if (!heading)
                    return [(0, typed_dom_1.html)('pre', {
                            class: `notranslate invalid`,
                            'data-invalid-syntax': 'aside',
                            'data-invalid-type': 'content',
                            'data-invalid-description': 'Missing the title at the first line.'
                        }, `${ opener }${ body }${ closer }`)];
                return [(0, typed_dom_1.html)('aside', {
                        id: (0, indexee_1.identity)(heading),
                        class: 'aside'
                    }, [
                        view,
                        annotation,
                        reference
                    ])];
            }))));
        },
        {
            '../../../combinator': 37,
            '../../api/parse': 70,
            '../../inline/extension/indexee': 118,
            'typed-dom': 30
        }
    ],
    78: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.example = void 0;
            const parser_1 = _dereq_('../../../combinator/data/parser');
            const combinator_1 = _dereq_('../../../combinator');
            const parse_1 = _dereq_('../../api/parse');
            const mathblock_1 = _dereq_('../mathblock');
            const typed_dom_1 = _dereq_('typed-dom');
            const opener = /^(~{3,})(?:example\/(\S+)|(?!\S))([^\n]*)(?:$|\n)/;
            exports.example = (0, combinator_1.creator)(100, (0, combinator_1.block)((0, combinator_1.validate)('~~~', (0, combinator_1.fmap)((0, combinator_1.fence)(opener, 300), ([body, closer, opener, delim, type = 'markdown', param], _, context) => {
                if (!closer || param.trimStart())
                    return [(0, typed_dom_1.html)('pre', {
                            class: 'notranslate invalid',
                            'data-invalid-syntax': 'example',
                            'data-invalid-type': closer ? 'argument' : 'closer',
                            'data-invalid-description': closer ? 'Invalid argument.' : `Missing the closing delimiter ${ delim }.`
                        }, `${ opener }${ body }${ closer }`)];
                switch (type) {
                case 'markdown': {
                        const annotation = (0, typed_dom_1.html)('ol', { class: 'annotation' });
                        const reference = (0, typed_dom_1.html)('ol', { class: 'reference' });
                        const view = (0, parse_1.parse)(body.slice(0, -1), {
                            id: '',
                            footnotes: {
                                annotation,
                                reference
                            }
                        }, context);
                        return [(0, typed_dom_1.html)('aside', {
                                class: 'example',
                                'data-type': 'markdown'
                            }, [
                                (0, typed_dom_1.html)('pre', body.slice(0, -1)),
                                (0, typed_dom_1.html)('hr'),
                                (0, typed_dom_1.html)('div', [view]),
                                annotation,
                                reference
                            ])];
                    }
                case 'math':
                    return [(0, typed_dom_1.html)('aside', {
                            class: 'example',
                            'data-type': 'math'
                        }, [
                            (0, typed_dom_1.html)('pre', body.slice(0, -1)),
                            (0, typed_dom_1.html)('hr'),
                            (0, parser_1.eval)((0, mathblock_1.mathblock)(`$$\n${ body }$$`, context), [])[0]
                        ])];
                default:
                    return [(0, typed_dom_1.html)('pre', {
                            class: 'notranslate invalid',
                            'data-invalid-syntax': 'example',
                            'data-invalid-description': `Invalid example type.`
                        }, `${ opener }${ body }${ closer }`)];
                }
            }))));
        },
        {
            '../../../combinator': 37,
            '../../../combinator/data/parser': 56,
            '../../api/parse': 70,
            '../mathblock': 88,
            'typed-dom': 30
        }
    ],
    79: [
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
            const blockquote_1 = _dereq_('../blockquote');
            const table_1 = _dereq_('./table');
            const placeholder_1 = _dereq_('./placeholder');
            exports.segment = (0, combinator_1.block)((0, combinator_1.validate)([
                '[$',
                '$'
            ], (0, combinator_1.sequence)([
                (0, combinator_1.line)(label_1.segment),
                (0, combinator_1.union)([
                    codeblock_1.segment,
                    mathblock_1.segment,
                    blockquote_1.segment,
                    table_1.segment,
                    placeholder_1.segment,
                    (0, combinator_1.some)(source_1.contentline)
                ])
            ])));
            exports.fig = (0, combinator_1.block)((0, combinator_1.rewrite)(exports.segment, (0, combinator_1.convert)(source => {
                const fence = (/^[^\n]*\n!?>+\s/.test(source) && source.match(/^~{3,}(?=\s*$)/gm) || []).reduce((max, fence) => fence > max ? fence : max, '~~') + '~';
                return `${ fence }figure ${ source }\n\n${ fence }`;
            }, (0, combinator_1.union)([figure_1.figure]))));
        },
        {
            '../../../combinator': 37,
            '../../inline/extension/label': 120,
            '../../source': 137,
            '../blockquote': 73,
            '../codeblock': 74,
            '../mathblock': 88,
            './figure': 81,
            './placeholder': 83,
            './table': 84
        }
    ],
    80: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.figbase = void 0;
            const combinator_1 = _dereq_('../../../combinator');
            const label_1 = _dereq_('../../inline/extension/label');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.figbase = (0, combinator_1.block)((0, combinator_1.fmap)((0, combinator_1.validate)(/^\[?\$-(?:[0-9]+\.)*0\]?[^\S\n]*(?!\S|\n[^\S\n]*\S)/, (0, combinator_1.line)((0, combinator_1.union)([label_1.label]))), ([el]) => {
                const label = el.getAttribute('data-label');
                const group = label.split('-', 1)[0];
                return [(0, typed_dom_1.html)('figure', {
                        'data-label': label,
                        'data-group': group,
                        style: 'display: none;'
                    })];
            }));
        },
        {
            '../../../combinator': 37,
            '../../inline/extension/label': 120,
            'typed-dom': 30
        }
    ],
    81: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.figure = exports.segment = void 0;
            const global_1 = _dereq_('spica/global');
            const combinator_1 = _dereq_('../../../combinator');
            const source_1 = _dereq_('../../source');
            const label_1 = _dereq_('../../inline/extension/label');
            const table_1 = _dereq_('../table');
            const codeblock_1 = _dereq_('../codeblock');
            const mathblock_1 = _dereq_('../mathblock');
            const blockquote_1 = _dereq_('../blockquote');
            const example_1 = _dereq_('./example');
            const table_2 = _dereq_('./table');
            const placeholder_1 = _dereq_('./placeholder');
            const inline_1 = _dereq_('../../inline');
            const locale_1 = _dereq_('../../locale');
            const util_1 = _dereq_('../../util');
            const typed_dom_1 = _dereq_('typed-dom');
            const memoize_1 = _dereq_('spica/memoize');
            exports.segment = (0, combinator_1.block)((0, combinator_1.match)(/^(~{3,})figure[^\S\n]+(?=\[?\$[A-Za-z-]\S*[^\S\n]*\n(?:[^\n]*\n)*?\1[^\S\n]*(?:$|\n))/, (0, memoize_1.memoize)(([, fence], closer = new RegExp(String.raw`^${ fence }[^\S\n]*(?:$|\n)`)) => (0, combinator_1.close)((0, combinator_1.sequence)([
                (0, combinator_1.line)(label_1.segment),
                (0, combinator_1.inits)([
                    (0, combinator_1.union)([
                        codeblock_1.segment_,
                        mathblock_1.segment_,
                        blockquote_1.segment,
                        table_2.segment_,
                        placeholder_1.segment_,
                        (0, combinator_1.some)(source_1.contentline, closer)
                    ]),
                    source_1.emptyline,
                    (0, combinator_1.union)([
                        source_1.emptyline,
                        (0, combinator_1.some)(source_1.contentline, closer)
                    ])
                ])
            ]), closer), ([, fence]) => fence.length)));
            exports.figure = (0, combinator_1.block)((0, combinator_1.rewrite)(exports.segment, (0, combinator_1.fmap)((0, combinator_1.convert)(source => source.slice(source.search(/\s/) + 1, source.trimEnd().lastIndexOf('\n')), (0, combinator_1.sequence)([
                (0, combinator_1.line)(label_1.label),
                (0, combinator_1.inits)([
                    (0, combinator_1.block)((0, combinator_1.union)([
                        table_1.table,
                        codeblock_1.codeblock,
                        mathblock_1.mathblock,
                        blockquote_1.blockquote,
                        example_1.example,
                        table_2.table,
                        placeholder_1.placeholder,
                        (0, combinator_1.line)(inline_1.media),
                        (0, combinator_1.line)(inline_1.shortmedia)
                    ])),
                    source_1.emptyline,
                    (0, combinator_1.block)((0, locale_1.localize)((0, combinator_1.context)({ syntax: { inline: { media: false } } }, (0, util_1.visualize)((0, combinator_1.trim)((0, combinator_1.some)(inline_1.inline))))))
                ])
            ])), ([label, content, ...caption]) => [(0, typed_dom_1.html)('figure', attributes(label.getAttribute('data-label'), content, caption), [
                    (0, typed_dom_1.html)('div', { class: 'figcontent' }, [content]),
                    (0, typed_dom_1.html)('span', { class: 'figindex' }),
                    (0, typed_dom_1.html)('figcaption', (0, typed_dom_1.defrag)(caption))
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
                        'data-invalid-description': 'The last part of the fixed label numbers must not be 0.'
                    } || invalidContent && {
                        'data-invalid-syntax': 'figure',
                        'data-invalid-type': 'content',
                        'data-invalid-description': 'A figure labeled to define a formula number can contain only a math formula and no caption.'
                    } || global_1.undefined
                };
            }
        },
        {
            '../../../combinator': 37,
            '../../inline': 99,
            '../../inline/extension/label': 120,
            '../../locale': 134,
            '../../source': 137,
            '../../util': 143,
            '../blockquote': 73,
            '../codeblock': 74,
            '../mathblock': 88,
            '../table': 94,
            './example': 78,
            './placeholder': 83,
            './table': 84,
            'spica/global': 17,
            'spica/memoize': 20,
            'typed-dom': 30
        }
    ],
    82: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.message = void 0;
            const parser_1 = _dereq_('../../../combinator/data/parser');
            const combinator_1 = _dereq_('../../../combinator');
            const segment_1 = _dereq_('../../segment');
            const source_1 = _dereq_('../../source');
            const ulist_1 = _dereq_('../ulist');
            const olist_1 = _dereq_('../olist');
            const ilist_1 = _dereq_('../ilist');
            const table_1 = _dereq_('../table');
            const codeblock_1 = _dereq_('../codeblock');
            const mathblock_1 = _dereq_('../mathblock');
            const blockquote_1 = _dereq_('../blockquote');
            const paragraph_1 = _dereq_('../paragraph');
            const typed_dom_1 = _dereq_('typed-dom');
            const array_1 = _dereq_('spica/array');
            exports.message = (0, combinator_1.block)((0, combinator_1.validate)('~~~', (0, combinator_1.fmap)((0, combinator_1.fence)(/^(~{3,})message\/(\S+)([^\n]*)(?:$|\n)/, 300), ([body, closer, opener, delim, type, param], _, context) => {
                if (!closer || param.trimStart())
                    return [(0, typed_dom_1.html)('pre', {
                            class: `notranslate invalid`,
                            'data-invalid-syntax': 'message',
                            'data-invalid-type': closer ? 'argument' : 'closer',
                            'data-invalid-description': closer ? 'Invalid argument.' : `Missing the closing delimiter ${ delim }.`
                        }, `${ opener }${ body }${ closer }`)];
                switch (type) {
                case 'note':
                case 'caution':
                case 'warning':
                    break;
                default:
                    return [(0, typed_dom_1.html)('pre', {
                            class: 'notranslate invalid',
                            'data-invalid-syntax': 'message',
                            'data-invalid-description': `Invalid message type.`
                        }, `${ opener }${ body }${ closer }`)];
                }
                return [(0, typed_dom_1.html)('div', { class: `message type-${ type }` }, (0, array_1.unshift)([(0, typed_dom_1.html)('h6', title(type))], [...(0, segment_1.segment)(body)].reduce((acc, seg) => (0, array_1.push)(acc, (0, parser_1.eval)(content(seg, context), [])), [])))];
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
            }
            const content = (0, combinator_1.union)([
                source_1.emptyline,
                ulist_1.ulist,
                olist_1.olist,
                ilist_1.ilist,
                table_1.table,
                codeblock_1.codeblock,
                mathblock_1.mathblock,
                blockquote_1.blockquote,
                paragraph_1.paragraph
            ]);
        },
        {
            '../../../combinator': 37,
            '../../../combinator/data/parser': 56,
            '../../segment': 136,
            '../../source': 137,
            '../blockquote': 73,
            '../codeblock': 74,
            '../ilist': 87,
            '../mathblock': 88,
            '../olist': 89,
            '../paragraph': 90,
            '../table': 94,
            '../ulist': 95,
            'spica/array': 6,
            'typed-dom': 30
        }
    ],
    83: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.placeholder = exports.segment_ = exports.segment = void 0;
            const combinator_1 = _dereq_('../../../combinator');
            const typed_dom_1 = _dereq_('typed-dom');
            const opener = /^(~{3,})(?!~)[^\n]*(?:$|\n)/;
            exports.segment = (0, combinator_1.block)((0, combinator_1.validate)('~~~', (0, combinator_1.clear)((0, combinator_1.fence)(opener, 300))));
            exports.segment_ = (0, combinator_1.block)((0, combinator_1.validate)('~~~', (0, combinator_1.clear)((0, combinator_1.fence)(opener, 300, false))), false);
            exports.placeholder = (0, combinator_1.block)((0, combinator_1.validate)('~~~', (0, combinator_1.fmap)((0, combinator_1.fence)(opener, 300), ([body, closer, opener, delim]) => [(0, typed_dom_1.html)('pre', {
                    class: 'notranslate invalid',
                    'data-invalid-syntax': 'extension',
                    'data-invalid-type': closer ? 'syntax' : 'closer',
                    'data-invalid-description': closer ? 'Invalid syntax.' : `Missing the closing delimiter ${ delim }.`
                }, `${ opener }${ body }${ closer }`)])));
        },
        {
            '../../../combinator': 37,
            'typed-dom': 30
        }
    ],
    84: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.table = exports.segment_ = exports.segment = void 0;
            const global_1 = _dereq_('spica/global');
            const alias_1 = _dereq_('spica/alias');
            const combinator_1 = _dereq_('../../../combinator');
            const inline_1 = _dereq_('../../inline');
            const source_1 = _dereq_('../../source');
            const locale_1 = _dereq_('../../locale');
            const util_1 = _dereq_('../../util');
            const typed_dom_1 = _dereq_('typed-dom');
            const array_1 = _dereq_('spica/array');
            const opener = /^(~{3,})table(?!\S)([^\n]*)(?:$|\n)/;
            exports.segment = (0, combinator_1.block)((0, combinator_1.validate)('~~~', (0, combinator_1.clear)((0, combinator_1.fence)(opener, 10000))));
            exports.segment_ = (0, combinator_1.block)((0, combinator_1.validate)('~~~', (0, combinator_1.clear)((0, combinator_1.fence)(opener, 10000, false))), false);
            exports.table = (0, combinator_1.block)((0, combinator_1.validate)('~~~', (0, combinator_1.recover)((0, combinator_1.bind)((0, combinator_1.fence)(opener, 10000), ([body, closer, opener, delim, param], _, context) => {
                var _a;
                if (!closer || param.trimStart())
                    return [
                        [(0, typed_dom_1.html)('pre', {
                                class: `notranslate invalid`,
                                'data-invalid-syntax': 'table',
                                'data-invalid-type': closer ? 'argument' : 'closer',
                                'data-invalid-description': closer ? 'Invalid argument.' : `Missing the closing delimiter ${ delim }.`
                            }, `${ opener }${ body }${ closer }`)],
                        ''
                    ];
                return (_a = parser(body, context)) !== null && _a !== void 0 ? _a : [
                    [(0, typed_dom_1.html)('table')],
                    ''
                ];
            }), (source, _, reason) => reason instanceof Error && reason.message === 'Number of columns must be 32 or less.' ? [
                [(0, typed_dom_1.html)('pre', {
                        class: `notranslate invalid`,
                        'data-invalid-syntax': 'table',
                        'data-invalid-type': 'content',
                        'data-invalid-description': reason.message
                    }, source)],
                ''
            ] : (() => {
                throw reason;
            })())));
            const parser = (0, combinator_1.lazy)(() => (0, combinator_1.block)((0, locale_1.localize)((0, combinator_1.fmap)((0, combinator_1.some)((0, combinator_1.union)([row])), rows => [(0, typed_dom_1.html)('table', format(rows))]))));
            const row = (0, combinator_1.lazy)(() => (0, combinator_1.dup)((0, combinator_1.fmap)((0, combinator_1.subsequence)([
                (0, combinator_1.dup)((0, combinator_1.union)([align])),
                (0, combinator_1.some)((0, combinator_1.union)([
                    head,
                    data,
                    source_1.emptyline,
                    (0, combinator_1.some)(dataline, alignment)
                ]))
            ]), ns => !(0, alias_1.isArray)(ns[0]) ? (0, array_1.unshift)([[[]]], ns) : ns)));
            const alignment = /^[#:]?(?:[-=<>]+(?:\/[-=^v]*)?|\/[-=^v]+)(?=[^\S\n]*\n)/;
            const align = (0, combinator_1.line)((0, combinator_1.fmap)((0, combinator_1.union)([(0, source_1.str)(alignment)]), ([s]) => s.split('/').map(s => s.split(''))));
            const delimiter = /^[#:]?(?:[-=<>]+(?:\/[-=^v]*)?|\/[-=^v]+)(?=[^\S\n]*\n)|^[#:](?:(?!:!*[^\S\n]|0)\d*:(?!0)\d*)?!*(?=[^\S\n])/;
            const head = (0, combinator_1.creator)((0, combinator_1.block)((0, combinator_1.fmap)((0, combinator_1.open)((0, source_1.str)(/^#(?:(?!:!*[^\S\n]|0)\d*:(?!0)\d*)?!*(?=[^\S\n])/), (0, combinator_1.rewrite)((0, combinator_1.inits)([
                source_1.anyline,
                (0, combinator_1.some)(source_1.contentline, delimiter)
            ]), (0, util_1.visualize)((0, combinator_1.trim)((0, combinator_1.some)((0, combinator_1.union)([inline_1.inline]))), '')), true), ns => [(0, typed_dom_1.html)('th', attributes(ns.shift()), (0, typed_dom_1.defrag)(ns))]), false));
            const data = (0, combinator_1.creator)((0, combinator_1.block)((0, combinator_1.fmap)((0, combinator_1.open)((0, source_1.str)(/^:(?:(?!:!*[^\S\n]|0)\d*:(?!0)\d*)?!*(?=[^\S\n])/), (0, combinator_1.rewrite)((0, combinator_1.inits)([
                source_1.anyline,
                (0, combinator_1.some)(source_1.contentline, delimiter)
            ]), (0, util_1.visualize)((0, combinator_1.trim)((0, combinator_1.some)((0, combinator_1.union)([inline_1.inline]))), '')), true), ns => [(0, typed_dom_1.html)('td', attributes(ns.shift()), (0, typed_dom_1.defrag)(ns))]), false));
            const dataline = (0, combinator_1.creator)((0, combinator_1.line)((0, combinator_1.rewrite)(source_1.contentline, (0, combinator_1.union)([
                (0, combinator_1.validate)(/^:!*[^\S\n]/, data),
                (0, combinator_1.validate)(/^!+[^\S\n]/, (0, combinator_1.convert)(source => `:${ source }`, data)),
                (0, combinator_1.convert)(source => `: ${ source }`, data)
            ]))));
            function attributes(source) {
                var _a;
                let [, rowspan = global_1.undefined, colspan = global_1.undefined, highlight = global_1.undefined] = (_a = source.match(/^.(?:(\d+)?:(\d+)?)?(!+)?$/)) !== null && _a !== void 0 ? _a : [];
                rowspan === '1' ? rowspan = global_1.undefined : global_1.undefined;
                colspan === '1' ? colspan = global_1.undefined : global_1.undefined;
                rowspan && (rowspan = (0, alias_1.max)(0, (0, alias_1.min)(+rowspan, 65534)) + '');
                colspan && (colspan = (0, alias_1.max)(0, (0, alias_1.min)(+colspan, 1000)) + '');
                highlight && (highlight = highlight.length > 0 ? highlight.length + '' : global_1.undefined);
                const valid = !highlight || source[0] === '#' && +highlight <= 1 || source[0] === ':' && +highlight <= 6;
                return {
                    class: valid ? highlight && 'highlight' : 'invalid',
                    rowspan,
                    colspan,
                    ...valid ? { 'data-highlight-level': +highlight > 1 ? highlight : global_1.undefined } : {
                        'data-invalid-syntax': 'table',
                        'data-invalid-type': 'highlight',
                        'data-invalid-description': `Too much highlight level`
                    }
                };
            }
            function format(rows) {
                var _a, _b, _c, _d, _e, _f;
                const thead = (0, typed_dom_1.html)('thead');
                const tbody = (0, typed_dom_1.html)('tbody');
                const tfoot = (0, typed_dom_1.html)('tfoot');
                const aligns = [];
                const valigns = [];
                let target = thead;
                let ranges = {};
                let verticalHighlights = 0;
                ROW:
                    for (let i = 0; i < rows.length; ++i) {
                        const [[[...as], [...vs] = []], ...cells] = rows[i];
                        let isBody = target === tfoot ? false : [
                            as[0] === '#' ? !as.shift() : global_1.undefined,
                            as[0] === ':' ? !!as.shift() : global_1.undefined
                        ].reduce((a, b) => a !== null && a !== void 0 ? a : b);
                        as.length === 0 && as.push('-');
                        ALIGN_H:
                            for (let j = 0, update = false; j < as.length || j < aligns.length; ++j) {
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
                                    (_c = aligns[j]) !== null && _c !== void 0 ? _c : aligns[j] = j === 0 ? '' : aligns[j - 1];
                                    continue;
                                default:
                                    if (!update)
                                        break ALIGN_H;
                                    aligns[j] = aligns[j - 1];
                                    continue;
                                }
                            }
                        vs.length === 0 && vs.push('-');
                        ALIGN_V:
                            for (let j = 0, update = false; j < vs.length || j < valigns.length; ++j) {
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
                                    (_d = valigns[j]) !== null && _d !== void 0 ? _d : valigns[j] = j === 0 ? '' : valigns[j - 1];
                                    continue;
                                default:
                                    if (!update)
                                        break ALIGN_V;
                                    aligns[j] = aligns[j - 1];
                                    continue;
                                }
                            }
                        const row = (0, typed_dom_1.html)('tr');
                        let heads = 0;
                        let highlights = 0;
                        let hasDataCell = false;
                        let lHeadCellIdx;
                        let rHeadCellIdx;
                        for (let j = 0; j < cells.length && cells.length <= 32; ++j) {
                            const isVirtual = !!((_e = ranges[i]) === null || _e === void 0 ? void 0 : _e[j]);
                            const cell = isVirtual ? (0, array_1.splice)(cells, j, 0, global_1.undefined) && ranges[i][j] : cells[j];
                            const isHeadCell = cell.tagName === 'TH';
                            heads |= +isHeadCell << j;
                            highlights |= +!!cell.classList.contains('highlight') << j;
                            hasDataCell || (hasDataCell = !isHeadCell);
                            if (isHeadCell && !hasDataCell) {
                                lHeadCellIdx = j;
                            }
                            if (isHeadCell && hasDataCell) {
                                rHeadCellIdx !== null && rHeadCellIdx !== void 0 ? rHeadCellIdx : rHeadCellIdx = j;
                            }
                            const rowSpan = cell.rowSpan;
                            if (rowSpan > 1 && !isVirtual) {
                                const virtual = cell.cloneNode();
                                for (let k = i + 1; k < i + rowSpan && k < rows.length; ++k) {
                                    (_f = ranges[k]) !== null && _f !== void 0 ? _f : ranges[k] = [];
                                    ranges[k][j] = virtual;
                                }
                            }
                            const colSpan = cell.colSpan;
                            if (colSpan > 1) {
                                (0, array_1.splice)(cells, j + 1, 0, ...(0, global_1.Array)(colSpan - 1));
                                heads |= +`0b${ `${ heads & 1 << j && 1 }`.repeat(colSpan) }` << j;
                                highlights |= +`0b${ `${ highlights & 1 << j && 1 }`.repeat(colSpan) }` << j;
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
                            if (target === tfoot) {
                            }
                            j === aligns.length && aligns.push(aligns[j - 1]);
                            j === valigns.length && valigns.push(valigns[j - 1]);
                            if (isVirtual)
                                continue;
                            row.appendChild(cell);
                            aligns[j] && cell.setAttribute('align', aligns[j]);
                            valigns[j] && cell.setAttribute('valign', valigns[j]);
                        }
                        if (cells.length > 32)
                            throw new Error('Number of columns must be 32 or less.');
                        target.appendChild(row);
                        switch (target) {
                        case thead:
                            verticalHighlights = heads & highlights;
                            continue;
                        case tbody:
                            lHeadCellIdx !== null && lHeadCellIdx !== void 0 ? lHeadCellIdx : lHeadCellIdx = -1;
                            rHeadCellIdx !== null && rHeadCellIdx !== void 0 ? rHeadCellIdx : rHeadCellIdx = -1;
                            const tHighlights = verticalHighlights;
                            const horizontalHighlights = heads & highlights;
                            const lHighlight = ~lHeadCellIdx && horizontalHighlights & 1 << lHeadCellIdx;
                            const rHighlight = ~rHeadCellIdx && horizontalHighlights & 1 << rHeadCellIdx;
                            for (let i = 0, m = 1; i < cells.length; ++i, m <<= 1) {
                                const cell = cells[i];
                                if (!cell)
                                    continue;
                                if (heads & m)
                                    continue;
                                if (!(lHighlight || rHighlight || tHighlights & m || highlights & m))
                                    continue;
                                cell.classList.add('highlight');
                            }
                            continue;
                        case tfoot:
                            continue;
                        }
                    }
                return [
                    thead,
                    tbody,
                    tfoot
                ];
            }
        },
        {
            '../../../combinator': 37,
            '../../inline': 99,
            '../../locale': 134,
            '../../source': 137,
            '../../util': 143,
            'spica/alias': 5,
            'spica/array': 6,
            'spica/global': 17,
            'typed-dom': 30
        }
    ],
    85: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.heading = exports.segment = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const inline_1 = _dereq_('../inline');
            const indexer_1 = _dereq_('../inline/extension/indexer');
            const indexee_1 = _dereq_('../inline/extension/indexee');
            const source_1 = _dereq_('../source');
            const util_1 = _dereq_('../util');
            const typed_dom_1 = _dereq_('typed-dom');
            const array_1 = _dereq_('spica/array');
            exports.segment = (0, combinator_1.block)((0, combinator_1.validate)('#', (0, combinator_1.focus)(/^#{1,6}[^\S\n]+\S[^\n]*(?:\n#{1,6}(?!\S)[^\n]*)*(?:$|\n)/, (0, combinator_1.some)((0, combinator_1.line)(source => [
                [source],
                ''
            ])))));
            exports.heading = (0, combinator_1.block)((0, combinator_1.rewrite)(exports.segment, (0, combinator_1.context)({
                syntax: {
                    inline: {
                        label: false,
                        media: false
                    }
                }
            }, (0, combinator_1.line)((0, indexee_1.indexee)((0, combinator_1.fmap)((0, combinator_1.union)([
                (0, combinator_1.open)((0, source_1.str)(/^##+/), (0, util_1.visualize)((0, combinator_1.trim)((0, combinator_1.some)((0, combinator_1.union)([
                    indexer_1.indexer,
                    inline_1.inline
                ])))), true),
                (0, combinator_1.open)((0, source_1.str)('#'), (0, combinator_1.context)({
                    syntax: {
                        inline: {
                            annotation: false,
                            reference: false,
                            index: false,
                            link: false,
                            autolink: false
                        }
                    }
                }, (0, util_1.visualize)((0, combinator_1.trim)((0, combinator_1.some)((0, combinator_1.union)([
                    indexer_1.indexer,
                    inline_1.inline
                ]))))), true)
            ]), ns => [(0, typed_dom_1.html)(`h${ (0, array_1.shift)(ns)[0].length }`, (0, typed_dom_1.defrag)(ns))]))))));
        },
        {
            '../../combinator': 37,
            '../inline': 99,
            '../inline/extension/indexee': 118,
            '../inline/extension/indexer': 119,
            '../source': 137,
            '../util': 143,
            'spica/array': 6,
            'typed-dom': 30
        }
    ],
    86: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.horizontalrule = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.horizontalrule = (0, combinator_1.block)((0, combinator_1.line)((0, combinator_1.focus)(/^-{3,}[^\S\n]*(?:$|\n)/, () => [
                [(0, typed_dom_1.html)('hr')],
                ''
            ])));
        },
        {
            '../../combinator': 37,
            'typed-dom': 30
        }
    ],
    87: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.ilist_ = exports.ilist = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const ulist_1 = _dereq_('./ulist');
            const olist_1 = _dereq_('./olist');
            const inline_1 = _dereq_('../inline');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.ilist = (0, combinator_1.lazy)(() => (0, combinator_1.block)((0, combinator_1.fmap)((0, combinator_1.validate)(/^[-+*](?=[^\S\n]|\n[^\S\n]*\S)/, (0, combinator_1.some)((0, combinator_1.creator)((0, combinator_1.union)([(0, combinator_1.fmap)((0, combinator_1.inits)([
                    (0, combinator_1.line)((0, combinator_1.open)(/^[-+*](?:$|\s)/, (0, combinator_1.trim)((0, combinator_1.some)(inline_1.inline)), true)),
                    (0, combinator_1.indent)((0, combinator_1.union)([
                        ulist_1.ulist_,
                        olist_1.olist_,
                        exports.ilist_
                    ]))
                ]), ns => [(0, typed_dom_1.html)('li', (0, typed_dom_1.defrag)((0, ulist_1.fillFirstLine)(ns)))])])))), es => [(0, typed_dom_1.html)('ul', {
                    class: 'invalid',
                    'data-invalid-syntax': 'list',
                    'data-invalid-type': 'syntax',
                    'data-invalid-description': 'Use "-" instead of "+" or "*".'
                }, es)])));
            exports.ilist_ = (0, combinator_1.convert)(source => source.replace(/^[-+*](?=$|\n)/, `$& `), exports.ilist);
        },
        {
            '../../combinator': 37,
            '../inline': 99,
            './olist': 89,
            './ulist': 95,
            'typed-dom': 30
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
            exports.segment = (0, combinator_1.block)((0, combinator_1.validate)('$$', (0, combinator_1.clear)((0, combinator_1.fence)(opener, 100))));
            exports.segment_ = (0, combinator_1.block)((0, combinator_1.validate)('$$', (0, combinator_1.clear)((0, combinator_1.fence)(opener, 100, false))), false);
            exports.mathblock = (0, combinator_1.block)((0, combinator_1.validate)('$$', (0, combinator_1.fmap)((0, combinator_1.fence)(opener, 100), ([body, closer, opener, delim, param], _, {
                caches: {
                    math: cache = global_1.undefined
                } = {}
            }) => [closer && param.trimStart() === '' ? (body = `$$\n${ body }$$`) && (cache === null || cache === void 0 ? void 0 : cache.has(body)) ? cache.get(body).cloneNode(true) : (0, typed_dom_1.html)('div', { class: `math notranslate` }, body) : (0, typed_dom_1.html)('pre', {
                    class: `math notranslate invalid`,
                    'data-invalid-syntax': 'mathblock',
                    'data-invalid-type': closer ? 'argument' : 'closer',
                    'data-invalid-description': closer ? 'Invalid argument.' : `Missing the closing delimiter ${ delim }.`
                }, `${ opener }${ body }${ closer }`)])));
        },
        {
            '../../combinator': 37,
            'spica/global': 17,
            'typed-dom': 30
        }
    ],
    89: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.olist_ = exports.olist = void 0;
            const global_1 = _dereq_('spica/global');
            const combinator_1 = _dereq_('../../combinator');
            const ulist_1 = _dereq_('./ulist');
            const ilist_1 = _dereq_('./ilist');
            const inline_1 = _dereq_('../inline');
            const typed_dom_1 = _dereq_('typed-dom');
            const memoize_1 = _dereq_('spica/memoize');
            const array_1 = _dereq_('spica/array');
            exports.olist = (0, combinator_1.lazy)(() => (0, combinator_1.block)((0, combinator_1.match)(/^(?=(?:([0-9]+|[a-z]+|[A-Z]+)(?:-[0-9]+)?(\.)|\(([0-9]+|[a-z]+)(\))(?:-[0-9]+)?)(?=[^\S\n]|\n[^\S\n]*\S))/, (0, memoize_1.memoize)(ms => list(type(ms[1] || ms[3]), ms[2] || ms[4]), ms => type(ms[1] || ms[3]) + (ms[2] || ms[4])))));
            const list = (type, delim) => (0, combinator_1.fmap)((0, combinator_1.context)({ syntax: { inline: { media: false } } }, (0, combinator_1.some)((0, combinator_1.creator)((0, combinator_1.union)([(0, combinator_1.fmap)((0, combinator_1.inits)([
                    (0, combinator_1.line)((0, combinator_1.open)(items[delim], (0, combinator_1.trim)((0, combinator_1.subsequence)([
                        ulist_1.checkbox,
                        (0, combinator_1.trimStart)((0, combinator_1.some)(inline_1.inline))
                    ])), true)),
                    (0, combinator_1.indent)((0, combinator_1.union)([
                        ulist_1.ulist_,
                        exports.olist_,
                        ilist_1.ilist_
                    ]))
                ]), ns => [(0, typed_dom_1.html)('li', { 'data-value': ns[0] }, (0, typed_dom_1.defrag)((0, ulist_1.fillFirstLine)((0, array_1.shift)(ns)[1])))])])))), es => [format((0, typed_dom_1.html)('ol', es), type, delim)]);
            const items = {
                '.': (0, combinator_1.focus)(/^(?:[0-9]+|[a-z]+|[A-Z]+)(?:-[0-9]*)?(?![^.\n])\.?(?:$|\s)/, source => [
                    [`${ source.split('.', 1)[0] }.`],
                    ''
                ]),
                ')': (0, combinator_1.focus)(/^\((?:[0-9]*|[a-z]*)(?![^)\n])\)?(?:-[0-9]*)?(?:$|\s)/, source => [
                    [source.trimEnd().replace(/^\((\w+)\)?$/, '($1)').replace(/^\($/, '(1)')],
                    ''
                ])
            };
            exports.olist_ = (0, combinator_1.convert)(source => source[0] === '(' ? source.replace(/^\(((?:[0-9]+|[a-z]+))\)?(?:-[0-9]*)?(?=$|\n)/, `($1) `).replace(/^\(\)?(?=$|\n)/, `(1) `) : source.replace(/^((?:[0-9]+|[a-z]+|[A-Z]+)(?:-[0-9]*)?)\.?(?=$|\n)/, `$1. `), exports.olist);
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
            function format(el, type, delim) {
                var _a, _b, _c, _d;
                if ((_b = (_a = el.firstElementChild) === null || _a === void 0 ? void 0 : _a.firstElementChild) === null || _b === void 0 ? void 0 : _b.classList.contains('checkbox')) {
                    el.setAttribute('class', 'checklist');
                }
                (0, typed_dom_1.define)(el, {
                    type: type || global_1.undefined,
                    'data-format': delim === '.' ? global_1.undefined : 'paren',
                    'data-type': style(type) || global_1.undefined
                });
                const value = ((_d = (_c = el.firstElementChild) === null || _c === void 0 ? void 0 : _c.getAttribute('data-value').match(initial(type))) === null || _d === void 0 ? void 0 : _d[0]) || '';
                for (let es = el.children, i = 0; i < es.length; ++i) {
                    const el = es[i];
                    if (el.getAttribute('data-value') !== value)
                        break;
                    el.removeAttribute('data-value');
                }
                return el;
            }
        },
        {
            '../../combinator': 37,
            '../inline': 99,
            './ilist': 87,
            './ulist': 95,
            'spica/array': 6,
            'spica/global': 17,
            'spica/memoize': 20,
            'typed-dom': 30
        }
    ],
    90: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.paragraph = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const mention_1 = _dereq_('./paragraph/mention');
            const quote_1 = _dereq_('./paragraph/mention/quote');
            const inline_1 = _dereq_('../inline');
            const source_1 = _dereq_('../source');
            const locale_1 = _dereq_('../locale');
            const util_1 = _dereq_('../util');
            const typed_dom_1 = _dereq_('typed-dom');
            const array_1 = _dereq_('spica/array');
            exports.paragraph = (0, combinator_1.block)((0, locale_1.localize)((0, combinator_1.fmap)((0, combinator_1.some)((0, combinator_1.subsequence)([
                (0, combinator_1.fmap)((0, combinator_1.some)(mention_1.mention), es => es.reduce((acc, el) => (0, array_1.push)(acc, [
                    el,
                    (0, typed_dom_1.html)('br')
                ]), [])),
                (0, combinator_1.fmap)((0, combinator_1.rewrite)((0, combinator_1.some)(source_1.anyline, quote_1.syntax), (0, util_1.visualize)((0, combinator_1.trim)((0, combinator_1.some)(inline_1.inline)))), ns => (0, array_1.push)(ns, [(0, typed_dom_1.html)('br')]))
            ])), ns => [(0, typed_dom_1.html)('p', (0, typed_dom_1.defrag)((0, array_1.pop)(ns)[0]))])));
        },
        {
            '../../combinator': 37,
            '../inline': 99,
            '../locale': 134,
            '../source': 137,
            '../util': 143,
            './paragraph/mention': 91,
            './paragraph/mention/quote': 93,
            'spica/array': 6,
            'typed-dom': 30
        }
    ],
    91: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.mention = void 0;
            const combinator_1 = _dereq_('../../../combinator');
            const anchor_1 = _dereq_('./mention/anchor');
            const quote_1 = _dereq_('./mention/quote');
            exports.mention = (0, combinator_1.validate)('>', (0, combinator_1.subsequence)([
                (0, combinator_1.some)(anchor_1.anchor),
                quote_1.quote
            ]));
        },
        {
            '../../../combinator': 37,
            './mention/anchor': 92,
            './mention/quote': 93
        }
    ],
    92: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.anchor = void 0;
            const combinator_1 = _dereq_('../../../../combinator');
            const anchor_1 = _dereq_('../../../inline/autolink/anchor');
            const source_1 = _dereq_('../../../source');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.anchor = (0, combinator_1.creator)((0, combinator_1.line)((0, combinator_1.fmap)((0, combinator_1.validate)('>', (0, combinator_1.tails)([
                (0, source_1.str)(/^>*(?=>)/),
                anchor_1.anchor
            ])), ns => [(0, typed_dom_1.html)('span', { class: 'quote' }, ns)])));
        },
        {
            '../../../../combinator': 37,
            '../../../inline/autolink/anchor': 103,
            '../../../source': 137,
            'typed-dom': 30
        }
    ],
    93: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.quote = exports.syntax = void 0;
            const parser_1 = _dereq_('../../../../combinator/data/parser');
            const combinator_1 = _dereq_('../../../../combinator');
            const math_1 = _dereq_('../../../inline/math');
            const source_1 = _dereq_('../../../source');
            const autolink_1 = _dereq_('../../../autolink');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.syntax = /^>+(?!>|[0-9][0-9A-Za-z]*(?:-[0-9A-Za-z]+)*(?![^\S\n]*(?:$|\n)))/;
            exports.quote = (0, combinator_1.lazy)(() => (0, combinator_1.creator)((0, combinator_1.block)((0, combinator_1.fmap)((0, combinator_1.validate)('>', (0, combinator_1.union)([
                (0, combinator_1.rewrite)((0, combinator_1.some)((0, combinator_1.validate)(/^>+(?:$|\s)/, source_1.contentline)), (0, combinator_1.convert)(source => source.replace(/\n$/, ''), block_)),
                (0, combinator_1.rewrite)((0, combinator_1.some)((0, combinator_1.validate)(exports.syntax, source_1.contentline)), (0, combinator_1.convert)(source => source.replace(/\n$/, ''), block_))
            ])), ns => [(0, typed_dom_1.html)('span', { class: 'quote' }, ns)]), false)));
            const block_ = (source, context) => {
                const lines = source.match(/^.*\n?/mg);
                const quotes = source.match(/^>+(?:$|\s)/.test(source) ? /^>+(?:$|\s)/mg : /^>+/mg);
                const content = lines.reduce((acc, line, row) => acc + line.slice(quotes[row].length), '');
                const nodes = (0, parser_1.eval)((0, combinator_1.some)(text)(content, context), []);
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
                    if (child.classList.contains('quote')) {
                        context.resources && (context.resources.budget -= child.childNodes.length);
                        nodes.splice(i, 1, ...child.childNodes);
                        --i;
                        continue;
                    }
                }
                return [
                    (0, typed_dom_1.defrag)(nodes),
                    ''
                ];
            };
            const text = (0, combinator_1.union)([
                math_1.math,
                autolink_1.autolink
            ]);
        },
        {
            '../../../../combinator': 37,
            '../../../../combinator/data/parser': 56,
            '../../../autolink': 71,
            '../../../inline/math': 127,
            '../../../source': 137,
            'typed-dom': 30
        }
    ],
    94: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.table = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const inline_1 = _dereq_('../inline');
            const typed_dom_1 = _dereq_('typed-dom');
            const array_1 = _dereq_('spica/array');
            exports.table = (0, combinator_1.lazy)(() => (0, combinator_1.block)((0, combinator_1.fmap)((0, combinator_1.validate)(/^\|[^\n]*(?:\n\|[^\n]*){2,}/, (0, combinator_1.sequence)([
                row((0, combinator_1.some)(head), true),
                row((0, combinator_1.some)(align), false),
                (0, combinator_1.some)(row((0, combinator_1.some)(data), true))
            ])), rows => [(0, typed_dom_1.html)('table', [
                    (0, typed_dom_1.html)('thead', [rows.shift()]),
                    (0, typed_dom_1.html)('tbody', format(rows, (0, array_1.push)([], rows.shift().children).map(el => el.textContent)))
                ])])));
            const row = (parser, optional) => (0, combinator_1.creator)((0, combinator_1.fmap)((0, combinator_1.line)((0, combinator_1.surround)(/^(?=\|)/, (0, combinator_1.some)((0, combinator_1.union)([parser])), /^\|?\s*$/, optional)), es => [(0, typed_dom_1.html)('tr', es)]));
            const align = (0, combinator_1.creator)((0, combinator_1.fmap)((0, combinator_1.open)('|', (0, combinator_1.union)([
                (0, combinator_1.focus)(/^:-+:/, () => [
                    ['center'],
                    ''
                ]),
                (0, combinator_1.focus)(/^:-+/, () => [
                    ['start'],
                    ''
                ]),
                (0, combinator_1.focus)(/^-+:/, () => [
                    ['end'],
                    ''
                ]),
                (0, combinator_1.focus)(/^-+/, () => [
                    [''],
                    ''
                ])
            ])), ns => [(0, typed_dom_1.html)('td', (0, typed_dom_1.defrag)(ns))]));
            const cell = (0, combinator_1.surround)(/^\|(?:\\?\s)*(?=\S)/, (0, combinator_1.some)((0, combinator_1.union)([inline_1.inline]), /^(?:\\?\s)*(?=\||\\?$)/), /^[^|]*/, true);
            const head = (0, combinator_1.creator)((0, combinator_1.fmap)(cell, ns => [(0, typed_dom_1.html)('th', (0, typed_dom_1.defrag)(ns))]));
            const data = (0, combinator_1.creator)((0, combinator_1.fmap)(cell, ns => [(0, typed_dom_1.html)('td', (0, typed_dom_1.defrag)(ns))]));
            function format(rows, aligns) {
                for (let i = 0, len = rows.length; i < len; ++i) {
                    const row = rows[i];
                    const cols = row.children;
                    for (let i = 0, len = cols.length; i < len; ++i) {
                        if (i > 0 && !aligns[i]) {
                            aligns[i] = aligns[i - 1];
                        }
                        if (!aligns[i])
                            continue;
                        cols[i].setAttribute('align', aligns[i]);
                    }
                }
                return rows;
            }
        },
        {
            '../../combinator': 37,
            '../inline': 99,
            'spica/array': 6,
            'typed-dom': 30
        }
    ],
    95: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.fillFirstLine = exports.ulist_ = exports.checkbox = exports.ulist = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const olist_1 = _dereq_('./olist');
            const ilist_1 = _dereq_('./ilist');
            const inline_1 = _dereq_('../inline');
            const typed_dom_1 = _dereq_('typed-dom');
            const array_1 = _dereq_('spica/array');
            exports.ulist = (0, combinator_1.lazy)(() => (0, combinator_1.block)((0, combinator_1.fmap)((0, combinator_1.validate)(/^-(?=[^\S\n]|\n[^\S\n]*\S)/, (0, combinator_1.context)({ syntax: { inline: { media: false } } }, (0, combinator_1.some)((0, combinator_1.creator)((0, combinator_1.union)([(0, combinator_1.fmap)((0, combinator_1.inits)([
                    (0, combinator_1.line)((0, combinator_1.open)(/^-(?:$|\s)/, (0, combinator_1.trim)((0, combinator_1.subsequence)([
                        exports.checkbox,
                        (0, combinator_1.trimStart)((0, combinator_1.some)(inline_1.inline))
                    ])), true)),
                    (0, combinator_1.indent)((0, combinator_1.union)([
                        exports.ulist_,
                        olist_1.olist_,
                        ilist_1.ilist_
                    ]))
                ]), ns => [(0, typed_dom_1.html)('li', (0, typed_dom_1.defrag)(fillFirstLine(ns)))])]))))), es => [format((0, typed_dom_1.html)('ul', es))])));
            exports.checkbox = (0, combinator_1.focus)(/^\[[xX ]\](?=$|\s)/, source => [
                [(0, typed_dom_1.html)('span', { class: 'checkbox' }, source[1].trimStart() ? '\u2611' : '\u2610')],
                ''
            ]);
            exports.ulist_ = (0, combinator_1.convert)(source => source.replace(/^-(?=$|\n)/, `$& `), exports.ulist);
            function fillFirstLine(ns) {
                return ns.length === 1 && typeof ns[0] === 'object' && [
                    'UL',
                    'OL'
                ].includes(ns[0].tagName) ? (0, array_1.unshift)([(0, typed_dom_1.html)('br')], ns) : ns;
            }
            exports.fillFirstLine = fillFirstLine;
            function format(el) {
                var _a, _b;
                if ((_b = (_a = el.firstElementChild) === null || _a === void 0 ? void 0 : _a.firstElementChild) === null || _b === void 0 ? void 0 : _b.classList.contains('checkbox')) {
                    el.setAttribute('class', 'checklist');
                }
                return el;
            }
        },
        {
            '../../combinator': 37,
            '../inline': 99,
            './ilist': 87,
            './olist': 89,
            'spica/array': 6,
            'typed-dom': 30
        }
    ],
    96: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.figure = void 0;
            const global_1 = _dereq_('spica/global');
            const label_1 = _dereq_('../inline/extension/label');
            const typed_dom_1 = _dereq_('typed-dom');
            const multimap_1 = _dereq_('spica/multimap');
            const array_1 = _dereq_('spica/array');
            function* figure(target, footnotes, opts = {}) {
                var _a, _b, _c;
                const refs = new multimap_1.MultiMap([
                    ...target.querySelectorAll('a.label:not(.disabled)[data-label]'),
                    ...(_a = footnotes === null || footnotes === void 0 ? void 0 : footnotes.annotation.querySelectorAll('a.label:not(.disabled)')) !== null && _a !== void 0 ? _a : [],
                    ...(_b = footnotes === null || footnotes === void 0 ? void 0 : footnotes.reference.querySelectorAll('a.label:not(.disabled)')) !== null && _b !== void 0 ? _b : []
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
                        if (label.lastIndexOf('.', label.length - 3) < 0 && !(+((_c = def.previousElementSibling) === null || _c === void 0 ? void 0 : _c.tagName[1]) <= 2))
                            continue;
                        if (label.lastIndexOf('.', label.length - 3) > 0)
                            continue;
                    }
                    const group = label.split('-', 1)[0];
                    let number = (0, label_1.number)(label, numbers.has(group) && !(0, label_1.isFixed)(label) ? (0, array_1.join)(numbers.get(group).split('.').slice(0, bases.length), '.') : base);
                    if (number.endsWith('.0')) {
                        if (number.split('.').length > 2)
                            continue;
                        if (group !== '$' || def.tagName === 'FIGURE' && def.firstChild)
                            continue;
                        if (number.startsWith('0.')) {
                            number = (0, array_1.join)(index.slice(0).reduce((ns, _, i, bs) => {
                                i === ns.length ? bs.length = i : ns[i] = +ns[i] > +bs[i] ? ns[i] : +ns[i] === 0 ? bs[i] : `${ +bs[i] + 1 }`;
                                return ns;
                            }, number.split('.')), '.');
                        }
                        base = number;
                        bases = index = base.split('.');
                        numbers.clear();
                        continue;
                    }
                    !(0, label_1.isFixed)(label) && numbers.set(group, number);
                    opts.id !== '' && def.setAttribute('id', `label:${ opts.id ? `${ opts.id }:` : '' }${ label }`);
                    const figindex = group === '$' ? `(${ number })` : `${ capitalize(group) } ${ number }`;
                    (0, typed_dom_1.define)(def.querySelector(':scope > .figindex'), group === '$' ? figindex : `${ figindex }. `);
                    for (const ref of refs.take(label, global_1.Infinity)) {
                        if (ref.hash.slice(1) === def.id && ref.textContent === figindex)
                            continue;
                        yield (0, typed_dom_1.define)(ref, opts.id !== '' ? { href: `#${ def.id }` } : { class: `${ ref.className } disabled` }, figindex);
                    }
                }
                for (const [, ref] of refs) {
                    if (opts.id !== '') {
                        (0, typed_dom_1.define)(ref, {
                            class: `${ ref.className } disabled invalid`,
                            'data-invalid-syntax': 'label',
                            'data-invalid-type': 'reference',
                            'data-invalid-description': `Missing the reference.`
                        });
                    }
                    yield ref;
                }
                return;
            }
            exports.figure = figure;
            function increment(bases, el) {
                const index = (+el.tagName[1] - 1 || 1) - 1;
                return index + 1 < bases.length ? (0, array_1.join)(bases.slice(0, index + 2).map((v, i) => {
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
            '../inline/extension/label': 120,
            'spica/array': 6,
            'spica/global': 17,
            'spica/multimap': 21,
            'typed-dom': 30
        }
    ],
    97: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.reference = exports.annotation = exports.footnote = void 0;
            const global_1 = _dereq_('spica/global');
            const indexee_1 = _dereq_('../inline/extension/indexee');
            const typed_dom_1 = _dereq_('typed-dom');
            const multimap_1 = _dereq_('spica/multimap');
            const memoize_1 = _dereq_('spica/memoize');
            function* footnote(target, footnotes, opts = {}) {
                yield* (0, exports.annotation)(target, footnotes === null || footnotes === void 0 ? void 0 : footnotes.annotation, opts);
                yield* (0, exports.reference)(target, footnotes === null || footnotes === void 0 ? void 0 : footnotes.reference, opts);
                return;
            }
            exports.footnote = footnote;
            exports.annotation = build('annotation', n => `*${ n }`);
            exports.reference = build('reference', (n, abbr) => `[${ abbr || n }]`);
            const identify = (0, memoize_1.memoize)(ref => ref.getAttribute('data-abbr') || ref.innerHTML, new global_1.WeakMap());
            function build(syntax, marker) {
                const contentify = (0, memoize_1.memoize)(ref => (0, typed_dom_1.frag)(ref.childNodes), new global_1.WeakMap());
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
                        const abbr = ref.getAttribute('data-abbr') || global_1.undefined;
                        const title = ref.classList.contains('invalid') ? global_1.undefined : titles.get(identifier) || ref.title || (0, indexee_1.text)(ref) || global_1.undefined;
                        title && !titles.has(title) && titles.set(identifier, title);
                        !title && refs.set(identifier, ref);
                        const content = contentify(ref);
                        const refIndex = count;
                        const refId = opts.id !== '' ? ref.id || `${ syntax }:${ opts.id ? `${ opts.id }:` : '' }ref:${ count }` : global_1.undefined;
                        const def = global_1.undefined || defs.get(identifier) || defs.set(identifier, (0, typed_dom_1.html)('li', { id: opts.id !== '' ? `${ syntax }:${ opts.id ? `${ opts.id }:` : '' }def:${ defs.size + 1 }` : global_1.undefined }, [
                            content.cloneNode(true),
                            (0, typed_dom_1.html)('sup', [])
                        ])).get(identifier);
                        if (title && content.firstChild && def.childNodes.length === 1) {
                            def.insertBefore(content.cloneNode(true), def.lastChild);
                            for (const ref of refs.take(identifier, global_1.Infinity)) {
                                ref.classList.remove('invalid');
                                (0, typed_dom_1.define)(ref, {
                                    title,
                                    'data-invalid-syntax': null,
                                    'data-invalid-type': null,
                                    'data-invalid-description': null
                                });
                            }
                        }
                        const defIndex = +def.id.slice(def.id.lastIndexOf(':') + 1) || defs.size;
                        const defId = def.id || global_1.undefined;
                        const refChild = ref.firstChild;
                        yield (0, typed_dom_1.define)(ref, {
                            id: refId,
                            class: opts.id !== '' ? global_1.undefined : `${ ref.className } disabled`,
                            ...title ? { title } : {
                                class: void ref.classList.add('invalid'),
                                'data-invalid-syntax': syntax,
                                'data-invalid-type': 'content',
                                'data-invalid-description': 'Missing the content.'
                            }
                        }, ((_a = refChild === null || refChild === void 0 ? void 0 : refChild.getAttribute('href')) === null || _a === void 0 ? void 0 : _a.slice(1)) === defId && (refChild === null || refChild === void 0 ? void 0 : refChild.textContent) === marker(defIndex, abbr) ? global_1.undefined : [(0, typed_dom_1.html)('a', { href: refId && defId && `#${ defId }` }, marker(defIndex, abbr))]).firstChild;
                        def.lastChild.appendChild((0, typed_dom_1.html)('a', {
                            href: refId && `#${ refId }`,
                            title: content.firstChild && abbr ? title : global_1.undefined
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
            '../inline/extension/indexee': 118,
            'spica/global': 17,
            'spica/memoize': 20,
            'spica/multimap': 21,
            'typed-dom': 30
        }
    ],
    98: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.header = void 0;
            const global_1 = _dereq_('spica/global');
            const combinator_1 = _dereq_('../combinator');
            const segment_1 = _dereq_('./segment');
            const normalize_1 = _dereq_('./api/normalize');
            const source_1 = _dereq_('./source');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.header = (0, combinator_1.inits)([
                (0, combinator_1.rewrite)(source => {
                    const seg = (0, combinator_1.firstline)(source).trimEnd() === '---' && (0, segment_1.segment)(source).next().value || '';
                    return seg ? [
                        [],
                        source.slice(seg.length)
                    ] : global_1.undefined;
                }, (0, combinator_1.block)((0, combinator_1.focus)(/^---[^\S\v\f\r\n]*\r?\n(?:[A-Za-z][0-9A-Za-z]*(?:-[A-Za-z][0-9A-Za-z]*)*:[ \t]+\S[^\v\f\r\n]*\r?\n){0,100}---[^\S\v\f\r\n]*(?:$|\r?\n)/, source => [
                    [(0, typed_dom_1.html)('details', { class: 'header' }, (0, typed_dom_1.defrag)([
                            (0, typed_dom_1.html)('summary', 'Header'),
                            (0, normalize_1.normalize)(source.slice(source.indexOf('\n') + 1, source.trimEnd().lastIndexOf('\n'))).replace(/\s+$/mg, '')
                        ]))],
                    ''
                ]))),
                (0, combinator_1.clear)((0, source_1.str)(/^[^\S\v\f\r\n]*\r?\n/))
            ]);
        },
        {
            '../combinator': 37,
            './api/normalize': 69,
            './segment': 136,
            './source': 137,
            'spica/global': 17,
            'typed-dom': 30
        }
    ],
    99: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.shortmedia = exports.media = exports.inline = void 0;
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
            exports.inline = (0, combinator_1.union)([
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
            var shortmedia_2 = _dereq_('./inline/shortmedia');
            Object.defineProperty(exports, 'shortmedia', {
                enumerable: true,
                get: function () {
                    return shortmedia_2.shortmedia;
                }
            });
        },
        {
            '../combinator': 37,
            './inline/annotation': 100,
            './inline/autolink': 101,
            './inline/bracket': 109,
            './inline/code': 110,
            './inline/comment': 111,
            './inline/deletion': 112,
            './inline/emphasis': 113,
            './inline/emstrong': 114,
            './inline/escape': 115,
            './inline/extension': 116,
            './inline/html': 122,
            './inline/htmlentity': 123,
            './inline/insertion': 124,
            './inline/link': 125,
            './inline/mark': 126,
            './inline/math': 127,
            './inline/media': 128,
            './inline/reference': 129,
            './inline/ruby': 130,
            './inline/shortmedia': 131,
            './inline/strong': 132,
            './inline/template': 133,
            './source': 137
        }
    ],
    100: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.annotation = void 0;
            const global_1 = _dereq_('spica/global');
            const combinator_1 = _dereq_('../../combinator');
            const inline_1 = _dereq_('../inline');
            const util_1 = _dereq_('../util');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.annotation = (0, combinator_1.lazy)(() => (0, combinator_1.creator)((0, combinator_1.validate)('((', '))', '\n', (0, combinator_1.fmap)((0, combinator_1.verify)((0, combinator_1.surround)('((', (0, combinator_1.guard)(context => {
                var _a, _b, _c;
                return (_c = (_b = (_a = context.syntax) === null || _a === void 0 ? void 0 : _a.inline) === null || _b === void 0 ? void 0 : _b.annotation) !== null && _c !== void 0 ? _c : true;
            }, (0, util_1.startTight)((0, combinator_1.context)({
                syntax: {
                    inline: {
                        annotation: false,
                        reference: false,
                        media: false,
                        label: true
                    }
                },
                state: global_1.undefined
            }, (0, combinator_1.union)([(0, combinator_1.some)(inline_1.inline, ')', /^\\?\n/)])))), '))'), util_1.isEndTight), ns => [(0, typed_dom_1.html)('sup', { class: 'annotation' }, (0, typed_dom_1.defrag)(ns))]))));
        },
        {
            '../../combinator': 37,
            '../inline': 99,
            '../util': 143,
            'spica/global': 17,
            'typed-dom': 30
        }
    ],
    101: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.autolink = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const url_1 = _dereq_('./autolink/url');
            const email_1 = _dereq_('./autolink/email');
            const channel_1 = _dereq_('./autolink/channel');
            const account_1 = _dereq_('./autolink/account');
            const hashtag_1 = _dereq_('./autolink/hashtag');
            const hashref_1 = _dereq_('./autolink/hashref');
            const anchor_1 = _dereq_('./autolink/anchor');
            const source_1 = _dereq_('../source');
            const util_1 = _dereq_('../util');
            exports.autolink = (0, combinator_1.fmap)((0, combinator_1.validate)(/^(?:[@#>0-9A-Za-z]|[^\x00-\x7F\s])/, (0, combinator_1.guard)(context => {
                var _a, _b, _c;
                return (_c = (_b = (_a = context.syntax) === null || _a === void 0 ? void 0 : _a.inline) === null || _b === void 0 ? void 0 : _b.autolink) !== null && _c !== void 0 ? _c : true;
            }, (0, combinator_1.some)((0, combinator_1.union)([
                url_1.url,
                email_1.email,
                (0, source_1.str)(/^[0-9A-Za-z]+(?:[.+_-][0-9A-Za-z]+)*(?:@(?:[0-9A-Za-z]+(?:[.-][0-9A-Za-z]+)*)?)+/),
                (0, source_1.str)(/^[@#]+(?![0-9A-Za-z]|[^\x00-\x7F\s])/),
                channel_1.channel,
                account_1.account,
                (0, source_1.str)(/^@[0-9A-Za-z]+(?:-[0-9A-Za-z]+)*/),
                (0, source_1.str)(/^[0-9A-Za-z]+(?=#)|^[^\x00-\x7F\s]+(?=#)/),
                hashtag_1.hashtag,
                hashref_1.hashref,
                (0, source_1.str)(/^#(?:[0-9A-Za-z]|[^\x00-\x7F\s])+/),
                anchor_1.anchor
            ])))), ns => ns.length === 1 ? ns : [(0, util_1.stringify)(ns)]);
        },
        {
            '../../combinator': 37,
            '../source': 137,
            '../util': 143,
            './autolink/account': 102,
            './autolink/anchor': 103,
            './autolink/channel': 104,
            './autolink/email': 105,
            './autolink/hashref': 106,
            './autolink/hashtag': 107,
            './autolink/url': 108
        }
    ],
    102: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.account = void 0;
            const global_1 = _dereq_('spica/global');
            const combinator_1 = _dereq_('../../../combinator');
            const source_1 = _dereq_('../../source');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.account = (0, combinator_1.creator)((0, combinator_1.rewrite)((0, combinator_1.open)('@', (0, combinator_1.tails)([
                (0, combinator_1.verify)((0, source_1.str)(/^[0-9A-Za-z](?:[0-9A-Za-z-]{0,61}[0-9A-Za-z])?(?:\.[0-9A-Za-z](?:[0-9A-Za-z-]{0,61}[0-9A-Za-z])?)*\//), ([source]) => source.length <= 253 + 1),
                (0, combinator_1.verify)((0, source_1.str)(/^[A-Za-z][0-9A-Za-z]*(?:-[0-9A-Za-z]+)*/), ([source]) => source.length <= 63)
            ])), (source, {host, url}) => [
                [(0, typed_dom_1.html)('a', {
                        class: 'account',
                        href: source.indexOf('/') > -1 ? `https://${ source.slice(1).replace('/', '/@') }` : `${ (url === null || url === void 0 ? void 0 : url.origin) || '' }/${ source }`,
                        target: source.indexOf('/') > -1 || url && url.origin !== (host === null || host === void 0 ? void 0 : host.origin) ? '_blank' : global_1.undefined
                    }, source)],
                ''
            ]));
        },
        {
            '../../../combinator': 37,
            '../../source': 137,
            'spica/global': 17,
            'typed-dom': 30
        }
    ],
    103: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.anchor = void 0;
            const combinator_1 = _dereq_('../../../combinator');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.anchor = (0, combinator_1.creator)((0, combinator_1.validate)('>', (0, combinator_1.focus)(/^>>?[0-9][0-9A-Za-z]*(?:-[0-9A-Za-z]+)*/, source => [
                [(0, typed_dom_1.html)('a', {
                        class: 'anchor',
                        href: `?res=${ source.slice(source.lastIndexOf('>') + 1) }`
                    }, source)],
                ''
            ])));
        },
        {
            '../../../combinator': 37,
            'typed-dom': 30
        }
    ],
    104: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.channel = void 0;
            const combinator_1 = _dereq_('../../../combinator');
            const account_1 = _dereq_('./account');
            const hashtag_1 = _dereq_('./hashtag');
            const util_1 = _dereq_('../../util');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.channel = (0, combinator_1.validate)('@', (0, combinator_1.bind)((0, combinator_1.sequence)([
                account_1.account,
                (0, combinator_1.some)(hashtag_1.hashtag)
            ]), (es, rest) => {
                const source = (0, util_1.stringify)(es);
                if (source.indexOf('/', source.indexOf('#')) > -1)
                    return;
                const el = es[0];
                const url = `${ el.getAttribute('href') }?ch=${ source.slice(source.indexOf('#') + 1).replace(/#/g, '+') }`;
                return [
                    [(0, typed_dom_1.define)(el, {
                            class: 'channel',
                            href: url
                        }, source)],
                    rest
                ];
            }));
        },
        {
            '../../../combinator': 37,
            '../../util': 143,
            './account': 102,
            './hashtag': 107,
            'typed-dom': 30
        }
    ],
    105: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.email = void 0;
            const combinator_1 = _dereq_('../../../combinator');
            const source_1 = _dereq_('../../source');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.email = (0, combinator_1.creator)((0, combinator_1.rewrite)((0, combinator_1.sequence)([
                (0, combinator_1.verify)((0, source_1.str)(/^[0-9A-Za-z]+(?:[.+_-][0-9A-Za-z]+)*@/), ([source]) => source.length <= 63 + 1),
                (0, combinator_1.verify)((0, source_1.str)(/^[0-9A-Za-z](?:[0-9A-Za-z-]{0,61}[0-9A-Za-z])?(?:\.[0-9A-Za-z](?:[0-9A-Za-z-]{0,61}[0-9A-Za-z])?)*/), ([source]) => source.length <= 256 - 63 - 1)
            ]), source => [
                [(0, typed_dom_1.html)('a', {
                        class: 'email',
                        href: `mailto:${ source }`
                    }, source)],
                ''
            ]));
        },
        {
            '../../../combinator': 37,
            '../../source': 137,
            'typed-dom': 30
        }
    ],
    106: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.hashref = void 0;
            const combinator_1 = _dereq_('../../../combinator');
            const source_1 = _dereq_('../../source');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.hashref = (0, combinator_1.creator)((0, combinator_1.rewrite)((0, combinator_1.open)('#', (0, source_1.str)(/^[0-9]{1,16}(?![0-9A-Za-z]|[^\x00-\x7F\s])/)), (source, {host, url}) => [
                [(0, typed_dom_1.html)('a', {
                        class: 'hashref',
                        target: url && url.origin !== (host === null || host === void 0 ? void 0 : host.origin) ? '_blank' : undefined
                    }, source)],
                ''
            ]));
        },
        {
            '../../../combinator': 37,
            '../../source': 137,
            'typed-dom': 30
        }
    ],
    107: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.hashtag = void 0;
            const combinator_1 = _dereq_('../../../combinator');
            const source_1 = _dereq_('../../source');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.hashtag = (0, combinator_1.creator)((0, combinator_1.rewrite)((0, combinator_1.open)('#', (0, combinator_1.tails)([
                (0, combinator_1.verify)((0, source_1.str)(/^[0-9A-Za-z](?:[0-9A-Za-z-]{0,61}[0-9A-Za-z])?(?:\.[0-9A-Za-z](?:[0-9A-Za-z-]{0,61}[0-9A-Za-z])?)*\//), ([source]) => source.length <= 253 + 1),
                (0, combinator_1.validate)(/^[0-9]{0,4}(?:[A-Za-z]|[^\x00-\x7F\s])/, (0, source_1.str)(/^(?:[0-9A-Za-z]|[^\x00-\x7F\s]){1,128}(?![0-9A-Za-z]|[^\x00-\x7F\s])/))
            ])), (source, {host, url}) => [
                [(0, typed_dom_1.html)('a', {
                        class: 'hashtag',
                        href: source.indexOf('/') > -1 ? `https://${ source.slice(1).replace('/', '/hashtags/') }` : `${ (url === null || url === void 0 ? void 0 : url.origin) || '' }/hashtags/${ source.slice(1) }`,
                        target: source.indexOf('/') > -1 || url && url.origin !== (host === null || host === void 0 ? void 0 : host.origin) ? '_blank' : undefined
                    }, source)],
                ''
            ]));
        },
        {
            '../../../combinator': 37,
            '../../source': 137,
            'typed-dom': 30
        }
    ],
    108: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.url = void 0;
            const global_1 = _dereq_('spica/global');
            const combinator_1 = _dereq_('../../../combinator');
            const link_1 = _dereq_('../link');
            const source_1 = _dereq_('../../source');
            const closer = /^[-+*=~^,.;:!?]*(?=["`|\[\](){}<>]|\\?$)/;
            exports.url = (0, combinator_1.lazy)(() => (0, combinator_1.validate)([
                'http://',
                'https://'
            ], (0, combinator_1.rewrite)((0, combinator_1.open)(/^https?:\/\/(?=[\x21-\x7E])/, (0, combinator_1.focus)(/^[\x21-\x7E]+/, (0, combinator_1.some)((0, combinator_1.union)([
                bracket,
                (0, combinator_1.some)(source_1.unescsource, closer)
            ])))), (0, combinator_1.convert)(url => `{ ${ url } }`, (0, combinator_1.context)({ syntax: { inline: { link: global_1.undefined } } }, (0, combinator_1.union)([link_1.link]))))));
            const bracket = (0, combinator_1.lazy)(() => (0, combinator_1.creator)((0, combinator_1.union)([
                (0, combinator_1.surround)('(', (0, combinator_1.some)((0, combinator_1.union)([
                    bracket,
                    source_1.unescsource
                ]), ')'), ')', true),
                (0, combinator_1.surround)('[', (0, combinator_1.some)((0, combinator_1.union)([
                    bracket,
                    source_1.unescsource
                ]), ']'), ']', true),
                (0, combinator_1.surround)('{', (0, combinator_1.some)((0, combinator_1.union)([
                    bracket,
                    source_1.unescsource
                ]), '}'), '}', true),
                (0, combinator_1.surround)('"', (0, combinator_1.some)(source_1.unescsource, '"'), '"', true)
            ])));
        },
        {
            '../../../combinator': 37,
            '../../source': 137,
            '../link': 125,
            'spica/global': 17
        }
    ],
    109: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.bracket = void 0;
            const global_1 = _dereq_('spica/global');
            const combinator_1 = _dereq_('../../combinator');
            const inline_1 = _dereq_('../inline');
            const source_1 = _dereq_('../source');
            const array_1 = _dereq_('spica/array');
            exports.bracket = (0, combinator_1.lazy)(() => (0, combinator_1.union)([
                (0, combinator_1.surround)((0, source_1.str)('('), (0, combinator_1.some)(inline_1.inline, ')'), (0, source_1.str)(')'), true, global_1.undefined, ([as, bs = []], rest) => [
                    (0, array_1.unshift)(as, bs),
                    rest
                ]),
                (0, combinator_1.surround)((0, source_1.str)('['), (0, combinator_1.some)(inline_1.inline, ']'), (0, source_1.str)(']'), true, global_1.undefined, ([as, bs = []], rest) => [
                    (0, array_1.unshift)(as, bs),
                    rest
                ]),
                (0, combinator_1.surround)((0, source_1.str)('{'), (0, combinator_1.some)(inline_1.inline, '}'), (0, source_1.str)('}'), true, global_1.undefined, ([as, bs = []], rest) => [
                    (0, array_1.unshift)(as, bs),
                    rest
                ]),
                (0, combinator_1.surround)((0, source_1.str)('"'), (0, combinator_1.some)(inline_1.inline, '"', '"'), (0, source_1.str)('"'), true, global_1.undefined, ([as, bs = []], rest) => [
                    (0, array_1.unshift)(as, bs),
                    rest
                ])
            ]));
        },
        {
            '../../combinator': 37,
            '../inline': 99,
            '../source': 137,
            'spica/array': 6,
            'spica/global': 17
        }
    ],
    110: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.code = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.code = (0, combinator_1.creator)((0, combinator_1.validate)('`', '`', '\n', (0, combinator_1.match)(/^(`+)(?!`)([^\n]*?[^`\n])\1(?!`)/, ([whole, , body]) => rest => [
                [(0, typed_dom_1.html)('code', { 'data-src': whole }, format(body))],
                rest
            ])));
            function format(text) {
                return `${ text[0] }${ text[text.length - 1] }` === '  ' && text.trimStart() ? text.slice(1, -1) : text;
            }
        },
        {
            '../../combinator': 37,
            'typed-dom': 30
        }
    ],
    111: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.comment = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.comment = (0, combinator_1.creator)((0, combinator_1.validate)('<#', '#>', (0, combinator_1.match)(/^<(#+)\s+((?:(?!\1>)\S+\s+)+)(\1>)?/, ([, , title, closer]) => (rest, {resources}) => closer ? [
                [(0, typed_dom_1.html)('sup', {
                        class: 'comment',
                        title: title.trim()
                    })],
                rest
            ] : resources && void (resources.budget -= title.match(/\s+/g).length))));
        },
        {
            '../../combinator': 37,
            'typed-dom': 30
        }
    ],
    112: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.deletion = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const inline_1 = _dereq_('../inline');
            const source_1 = _dereq_('../source');
            const typed_dom_1 = _dereq_('typed-dom');
            const array_1 = _dereq_('spica/array');
            exports.deletion = (0, combinator_1.lazy)(() => (0, combinator_1.creator)((0, combinator_1.surround)((0, source_1.str)('~~'), (0, combinator_1.union)([(0, combinator_1.some)(inline_1.inline, '~~')]), (0, source_1.str)('~~'), false, ([, bs], rest) => [
                [(0, typed_dom_1.html)('del', (0, typed_dom_1.defrag)(bs))],
                rest
            ], ([as, bs], rest) => [
                (0, array_1.unshift)(as, bs),
                rest
            ])));
        },
        {
            '../../combinator': 37,
            '../inline': 99,
            '../source': 137,
            'spica/array': 6,
            'typed-dom': 30
        }
    ],
    113: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.emphasis = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const inline_1 = _dereq_('../inline');
            const strong_1 = _dereq_('./strong');
            const source_1 = _dereq_('../source');
            const util_1 = _dereq_('../util');
            const typed_dom_1 = _dereq_('typed-dom');
            const array_1 = _dereq_('spica/array');
            exports.emphasis = (0, combinator_1.lazy)(() => (0, combinator_1.creator)((0, combinator_1.surround)((0, source_1.str)('*', '*'), (0, util_1.startTight)((0, combinator_1.some)((0, combinator_1.union)([
                strong_1.strong,
                (0, combinator_1.some)(inline_1.inline, '*')
            ]))), (0, source_1.str)('*'), false, ([as, bs, cs], rest) => (0, util_1.isEndTight)(bs) ? [
                [(0, typed_dom_1.html)('em', (0, typed_dom_1.defrag)((0, util_1.trimEndBR)(bs)))],
                rest
            ] : [
                (0, array_1.unshift)(as, bs),
                cs[0] + rest
            ], ([as, bs], rest) => [
                (0, array_1.unshift)(as, bs),
                rest
            ])));
        },
        {
            '../../combinator': 37,
            '../inline': 99,
            '../source': 137,
            '../util': 143,
            './strong': 132,
            'spica/array': 6,
            'typed-dom': 30
        }
    ],
    114: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.emstrong = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const inline_1 = _dereq_('../inline');
            const source_1 = _dereq_('../source');
            const util_1 = _dereq_('../util');
            const typed_dom_1 = _dereq_('typed-dom');
            const array_1 = _dereq_('spica/array');
            exports.emstrong = (0, combinator_1.lazy)(() => (0, combinator_1.creator)((0, combinator_1.surround)((0, source_1.str)('***'), (0, util_1.startTight)((0, combinator_1.union)([(0, combinator_1.some)(inline_1.inline, '*')])), (0, source_1.str)(/^\*{1,3}/), false, ([as, bs, cs], rest, context) => {
                var _a, _b;
                if (!(0, util_1.isEndTight)(bs))
                    return [
                        (0, array_1.unshift)(as, bs),
                        cs[0] + rest
                    ];
                switch (cs[0]) {
                case '*':
                    return (_a = (0, combinator_1.bind)((0, combinator_1.union)([(0, combinator_1.some)(inline_1.inline, '**')]), (ds, rest) => rest.slice(0, 2) === '**' && (0, util_1.isEndTight)(ds) ? [
                        [(0, typed_dom_1.html)('strong', (0, array_1.unshift)([(0, typed_dom_1.html)('em', (0, typed_dom_1.defrag)((0, util_1.trimEndBR)(bs)))], (0, typed_dom_1.defrag)((0, util_1.trimEndBR)(ds))))],
                        rest.slice(2)
                    ] : [
                        (0, array_1.unshift)([
                            '**',
                            (0, typed_dom_1.html)('em', (0, typed_dom_1.defrag)((0, util_1.trimEndBR)(bs)))
                        ], ds),
                        rest
                    ])(rest, context)) !== null && _a !== void 0 ? _a : [
                        [
                            '**',
                            (0, typed_dom_1.html)('em', (0, typed_dom_1.defrag)((0, util_1.trimEndBR)(bs)))
                        ],
                        rest
                    ];
                case '**':
                    return (_b = (0, combinator_1.bind)((0, combinator_1.union)([(0, combinator_1.some)(inline_1.inline, '*')]), (ds, rest) => rest.slice(0, 1) === '*' && (0, util_1.isEndTight)(ds) ? [
                        [(0, typed_dom_1.html)('em', (0, array_1.unshift)([(0, typed_dom_1.html)('strong', (0, typed_dom_1.defrag)((0, util_1.trimEndBR)(bs)))], (0, typed_dom_1.defrag)((0, util_1.trimEndBR)(ds))))],
                        rest.slice(1)
                    ] : [
                        (0, array_1.unshift)([
                            '*',
                            (0, typed_dom_1.html)('strong', (0, typed_dom_1.defrag)((0, util_1.trimEndBR)(bs)))
                        ], ds),
                        rest
                    ])(rest, context)) !== null && _b !== void 0 ? _b : [
                        [
                            '*',
                            (0, typed_dom_1.html)('strong', (0, typed_dom_1.defrag)((0, util_1.trimEndBR)(bs)))
                        ],
                        rest
                    ];
                case '***':
                    return [
                        [(0, typed_dom_1.html)('em', [(0, typed_dom_1.html)('strong', (0, typed_dom_1.defrag)((0, util_1.trimEndBR)(bs)))])],
                        rest
                    ];
                }
            }, ([as, bs], rest) => [
                (0, array_1.unshift)(as, bs),
                rest
            ])));
        },
        {
            '../../combinator': 37,
            '../inline': 99,
            '../source': 137,
            '../util': 143,
            'spica/array': 6,
            'typed-dom': 30
        }
    ],
    115: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.escape = void 0;
            const global_1 = _dereq_('spica/global');
            const combinator_1 = _dereq_('../../combinator');
            const source_1 = _dereq_('../source');
            const repeat = (0, source_1.str)(/^(.)\1*/);
            exports.escape = (0, combinator_1.union)([(source, context) => {
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
            '../../combinator': 37,
            '../source': 137,
            'spica/global': 17
        }
    ],
    116: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.extension = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const index_1 = _dereq_('./extension/index');
            const label_1 = _dereq_('./extension/label');
            const placeholder_1 = _dereq_('./extension/placeholder');
            exports.extension = (0, combinator_1.validate)([
                '[',
                '$'
            ], (0, combinator_1.union)([
                index_1.index,
                label_1.label,
                placeholder_1.placeholder
            ]));
        },
        {
            '../../combinator': 37,
            './extension/index': 117,
            './extension/label': 120,
            './extension/placeholder': 121
        }
    ],
    117: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.index = void 0;
            const global_1 = _dereq_('spica/global');
            const combinator_1 = _dereq_('../../../combinator');
            const inline_1 = _dereq_('../../inline');
            const indexee_1 = _dereq_('./indexee');
            const source_1 = _dereq_('../../source');
            const util_1 = _dereq_('../../util');
            const typed_dom_1 = _dereq_('typed-dom');
            const array_1 = _dereq_('spica/array');
            exports.index = (0, combinator_1.lazy)(() => (0, combinator_1.creator)((0, combinator_1.validate)('[#', ']', '\n', (0, combinator_1.fmap)((0, indexee_1.indexee)((0, combinator_1.fmap)((0, combinator_1.verify)((0, combinator_1.surround)('[#', (0, combinator_1.guard)(context => {
                var _a, _b, _c;
                return (_c = (_b = (_a = context.syntax) === null || _a === void 0 ? void 0 : _a.inline) === null || _b === void 0 ? void 0 : _b.index) !== null && _c !== void 0 ? _c : true;
            }, (0, util_1.startTight)((0, combinator_1.context)({
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
            }, (0, combinator_1.inits)([
                (0, combinator_1.some)(inline_1.inline, /^]|^\|#(?!]|\\?\s)/, /^\\?\n/),
                indexer
            ])))), ']'), util_1.isEndTight), ns => [(0, typed_dom_1.html)('a', (0, typed_dom_1.defrag)(ns))])), ([el]) => [(0, typed_dom_1.define)(el, {
                    id: el.id ? null : global_1.undefined,
                    class: 'index',
                    href: el.id ? `#${ el.id }` : global_1.undefined
                }, el.childNodes)]))));
            const indexer = (0, combinator_1.lazy)(() => (0, combinator_1.creator)((0, combinator_1.fmap)((0, combinator_1.verify)((0, combinator_1.open)('|#', (0, combinator_1.some)((0, combinator_1.union)([
                bracket,
                source_1.txt
            ]), ']', /^\\?\n/)), util_1.isEndTight), ns => [(0, typed_dom_1.html)('span', {
                    class: 'indexer',
                    'data-index': (0, indexee_1.identify)((0, array_1.join)(ns).trim()).slice(6)
                })])));
            const bracket = (0, combinator_1.lazy)(() => (0, combinator_1.creator)((0, combinator_1.union)([
                (0, combinator_1.surround)((0, source_1.str)('('), (0, combinator_1.some)((0, combinator_1.union)([
                    bracket,
                    source_1.txt
                ]), ')'), (0, source_1.str)(')'), true),
                (0, combinator_1.surround)((0, source_1.str)('['), (0, combinator_1.some)((0, combinator_1.union)([
                    bracket,
                    source_1.txt
                ]), ']'), (0, source_1.str)(']'), true),
                (0, combinator_1.surround)((0, source_1.str)('{'), (0, combinator_1.some)((0, combinator_1.union)([
                    bracket,
                    source_1.txt
                ]), '}'), (0, source_1.str)('}'), true),
                (0, combinator_1.surround)((0, source_1.str)('"'), (0, combinator_1.some)(source_1.txt, '"'), (0, source_1.str)('"'), true)
            ])));
        },
        {
            '../../../combinator': 37,
            '../../inline': 99,
            '../../source': 137,
            '../../util': 143,
            './indexee': 118,
            'spica/array': 6,
            'spica/global': 17,
            'typed-dom': 30
        }
    ],
    118: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.identify = exports.text = exports.identity = exports.indexee = void 0;
            const global_1 = _dereq_('spica/global');
            const combinator_1 = _dereq_('../../../combinator');
            const typed_dom_1 = _dereq_('typed-dom');
            function indexee(parser) {
                return (0, combinator_1.fmap)(parser, ([el], _, {id}) => [(0, typed_dom_1.define)(el, { id: id !== '' && identity(el) || global_1.undefined })]);
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
                    (0, typed_dom_1.define)(es[i], es[i].getAttribute('data-src'));
                }
                for (let es = target.querySelectorAll('.annotation, .reference, rt, rp'), i = 0, len = es.length; i < len; ++i) {
                    es[i].remove();
                }
                return target.innerText.trim();
            }
            exports.text = text;
            function identify(index) {
                return index ? `index:${ index.replace(/\s+/g, '_').slice(0, 101).replace(/^(.{97}).{4}$/, '$1...') }` : '';
            }
            exports.identify = identify;
        },
        {
            '../../../combinator': 37,
            'spica/global': 17,
            'typed-dom': 30
        }
    ],
    119: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.indexer = void 0;
            const combinator_1 = _dereq_('../../../combinator');
            const index_1 = _dereq_('./index');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.indexer = (0, combinator_1.creator)((0, combinator_1.fmap)((0, combinator_1.open)(/^\s+(?=\[#[^\s\]])/, (0, combinator_1.context)({ syntax: { inline: { index: true } } }, (0, combinator_1.line)((0, combinator_1.union)([index_1.index])))), ([el]) => [(0, typed_dom_1.html)('span', {
                    class: 'indexer',
                    'data-index': el.getAttribute('href').slice(7)
                })]));
        },
        {
            '../../../combinator': 37,
            './index': 117,
            'typed-dom': 30
        }
    ],
    120: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.isFixed = exports.number = exports.label = exports.segment = void 0;
            const global_1 = _dereq_('spica/global');
            const combinator_1 = _dereq_('../../../combinator');
            const source_1 = _dereq_('../../source');
            const typed_dom_1 = _dereq_('typed-dom');
            const array_1 = _dereq_('spica/array');
            const body = (0, source_1.str)(/^\$[A-Za-z]*(?:(?:-[A-Za-z][0-9A-Za-z]*(?![0-9A-Za-z]))+|-(?:(?:0|[1-9][0-9]*)\.)*(?:0|[1-9][0-9]*)(?!\.?[0-9A-Za-z]))/);
            exports.segment = (0, combinator_1.clear)((0, combinator_1.validate)([
                '[$',
                '$'
            ], '-', '\n', (0, combinator_1.union)([
                (0, combinator_1.surround)('[', body, ']'),
                body
            ])));
            exports.label = (0, combinator_1.creator)((0, combinator_1.validate)([
                '[$',
                '$'
            ], '-', '\n', (0, combinator_1.fmap)((0, combinator_1.guard)(context => {
                var _a, _b, _c;
                return (_c = (_b = (_a = context.syntax) === null || _a === void 0 ? void 0 : _a.inline) === null || _b === void 0 ? void 0 : _b.label) !== null && _c !== void 0 ? _c : true;
            }, (0, combinator_1.union)([
                (0, combinator_1.surround)('[', body, ']'),
                body
            ])), ([text]) => [(0, typed_dom_1.html)('a', {
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
                if (number === '0' && position > 1)
                    return increment('1', position);
                const ns = number.split('.');
                const ms = (0, global_1.Array)(position);
                for (let i = 0; i < position; ++i) {
                    ms[i] = i < ns.length ? i + 1 < position ? +ns[i] : +ns[i] + 1 : i + 1 < position ? 0 : 1;
                }
                return (0, array_1.join)(ms, '.');
            }
        },
        {
            '../../../combinator': 37,
            '../../source': 137,
            'spica/array': 6,
            'spica/global': 17,
            'typed-dom': 30
        }
    ],
    121: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.placeholder = void 0;
            const combinator_1 = _dereq_('../../../combinator');
            const inline_1 = _dereq_('../../inline');
            const source_1 = _dereq_('../../source');
            const util_1 = _dereq_('../../util');
            const typed_dom_1 = _dereq_('typed-dom');
            const array_1 = _dereq_('spica/array');
            exports.placeholder = (0, combinator_1.lazy)(() => (0, combinator_1.creator)((0, combinator_1.validate)([
                '[:',
                '[^'
            ], ']', (0, combinator_1.surround)((0, source_1.str)(/^\[[:^]/), (0, util_1.startTight)((0, combinator_1.some)((0, combinator_1.union)([inline_1.inline]), ']')), (0, source_1.str)(']'), false, ([as, bs, cs], rest) => [
                (0, util_1.isEndTight)(bs) ? [(0, typed_dom_1.html)('span', {
                        class: 'invalid',
                        'data-invalid-syntax': 'extension',
                        'data-invalid-type': 'syntax',
                        'data-invalid-description': 'Invalid symbol.'
                    }, (0, typed_dom_1.defrag)((0, util_1.trimEndBR)(bs)))] : (0, array_1.push)((0, array_1.unshift)(as, bs), cs),
                rest
            ], ([as, bs], rest) => [
                (0, array_1.unshift)(as, bs),
                rest
            ]))));
        },
        {
            '../../../combinator': 37,
            '../../inline': 99,
            '../../source': 137,
            '../../util': 143,
            'spica/array': 6,
            'typed-dom': 30
        }
    ],
    122: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.attributes = exports.attribute = exports.html = void 0;
            const global_1 = _dereq_('spica/global');
            const alias_1 = _dereq_('spica/alias');
            const combinator_1 = _dereq_('../../combinator');
            const inline_1 = _dereq_('../inline');
            const source_1 = _dereq_('../source');
            const util_1 = _dereq_('../util');
            const typed_dom_1 = _dereq_('typed-dom');
            const memoize_1 = _dereq_('spica/memoize');
            const cache_1 = _dereq_('spica/cache');
            const array_1 = _dereq_('spica/array');
            const tags = (0, alias_1.ObjectFreeze)([
                'sup',
                'sub',
                'small',
                'bdo',
                'bdi'
            ]);
            const attrspec = {
                bdo: {
                    dir: (0, alias_1.ObjectFreeze)([
                        'ltr',
                        'rtl'
                    ])
                }
            };
            (0, alias_1.ObjectSetPrototypeOf)(attrspec, null);
            (0, alias_1.ObjectValues)(attrspec).forEach(o => (0, alias_1.ObjectSetPrototypeOf)(o, null));
            exports.html = (0, combinator_1.lazy)(() => (0, combinator_1.creator)((0, combinator_1.validate)('<', '>', '\n', (0, combinator_1.validate)(/^<[a-z]+[ >]/, (0, combinator_1.union)([
                (0, combinator_1.match)(/^(?=<(wbr)(?=[ >]))/, (0, memoize_1.memoize)(([, tag]) => (0, combinator_1.surround)((0, source_1.str)(`<${ tag }`), (0, combinator_1.some)((0, combinator_1.union)([exports.attribute])), (0, source_1.str)('>'), true, ([, as = []], rest) => [
                    [(0, typed_dom_1.html)(tag, attributes('html', [], attrspec[tag], as))],
                    rest
                ]), ([, tag]) => tag)),
                (0, combinator_1.match)(/^(?=<(sup|sub|small|bdo|bdi)(?=[ >]))/, (0, memoize_1.memoize)(([, tag]) => (0, combinator_1.validate)(`<${ tag }`, `</${ tag }>`, (0, combinator_1.surround)((0, combinator_1.surround)((0, source_1.str)(`<${ tag }`), (0, combinator_1.some)(exports.attribute), (0, source_1.str)('>'), true), (0, util_1.startTight)((0, combinator_1.verify)((0, combinator_1.context)((() => {
                    switch (tag) {
                    case 'sup':
                    case 'sub':
                        return {
                            state: { in: { supsub: true } },
                            syntax: {
                                inline: {
                                    annotation: false,
                                    reference: false,
                                    media: false
                                }
                            }
                        };
                    case 'small':
                        return {
                            state: { in: { small: true } },
                            syntax: { inline: { media: false } }
                        };
                    default:
                        return {};
                    }
                })(), (0, combinator_1.some)((0, combinator_1.union)([inline_1.inline]), `</${ tag }>`)), util_1.isEndTight)), (0, source_1.str)(`</${ tag }>`), false, ([as, bs, cs], rest, context) => [
                    [elem(tag, as, (0, util_1.trimEndBR)(bs), cs, context)],
                    rest
                ])), ([, tag]) => tag)),
                (0, combinator_1.match)(/^(?=<([a-z]+)(?=[ >]))/, (0, memoize_1.memoize)(([, tag]) => (0, combinator_1.validate)(`<${ tag }`, `</${ tag }>`, (0, combinator_1.surround)((0, combinator_1.surround)((0, source_1.str)(`<${ tag }`), (0, combinator_1.some)(exports.attribute), (0, source_1.str)('>'), true), (0, util_1.startTight)((0, combinator_1.some)((0, combinator_1.union)([inline_1.inline]), `</${ tag }>`)), (0, source_1.str)(`</${ tag }>`), false, ([as, bs, cs], rest) => (0, util_1.isEndTight)(bs) ? [
                    [elem(tag, as, (0, util_1.trimEndBR)(bs), cs, {})],
                    rest
                ] : as.length === 1 ? [
                    (0, array_1.push)((0, array_1.unshift)(as, bs), cs),
                    rest
                ] : global_1.undefined, ([as, bs], rest) => as.length === 1 ? [
                    (0, array_1.unshift)(as, bs),
                    rest
                ] : global_1.undefined)), ([, tag]) => tag, new cache_1.Cache(100)))
            ])))));
            exports.attribute = (0, combinator_1.union)([(0, source_1.str)(/^ [a-z]+(?:-[a-z]+)*(?:="(?:\\[^\n]|[^\n"])*")?(?=[ >])/)]);
            function elem(tag, as, bs, cs, context) {
                var _a, _b, _c, _d, _e, _f;
                if (!tags.includes(tag))
                    return invalid('tag', `Invalid HTML tag <${ tag }>.`, as, bs, cs);
                switch (tag) {
                case 'sup':
                case 'sub':
                    switch (true) {
                    case (_b = (_a = context.state) === null || _a === void 0 ? void 0 : _a.in) === null || _b === void 0 ? void 0 : _b.supsub:
                        return invalid('nest', `<${ tag }> HTML tag can't be used in <sup>/<sub> HTML tags.`, as, bs, cs);
                    }
                    break;
                case 'small':
                    switch (true) {
                    case (_d = (_c = context.state) === null || _c === void 0 ? void 0 : _c.in) === null || _d === void 0 ? void 0 : _d.supsub:
                    case (_f = (_e = context.state) === null || _e === void 0 ? void 0 : _e.in) === null || _f === void 0 ? void 0 : _f.small:
                        return invalid('nest', `<${ tag }> HTML tag can't be used in <sup>/<sub>/<small> HTML tags.`, as, bs, cs);
                    }
                    break;
                }
                let attrs;
                switch (true) {
                case as[as.length - 1] !== '>' || 'data-invalid-syntax' in (attrs = attributes('html', [], attrspec[tag], as.slice(1, -1))):
                    return invalid('attribute', 'Invalid HTML attribute.', as, bs, cs);
                case cs.length === 0:
                    return invalid('closer', `Missing the closing HTML tag <${ tag }>.`, as, bs, cs);
                default:
                    return (0, typed_dom_1.html)(tag, attrs, (0, typed_dom_1.defrag)(bs));
                }
            }
            function invalid(type, description, as, bs, cs) {
                return (0, typed_dom_1.html)('span', {
                    class: 'invalid',
                    'data-invalid-syntax': 'html',
                    'data-invalid-type': type,
                    'data-invalid-description': description
                }, (0, typed_dom_1.defrag)((0, array_1.push)((0, array_1.unshift)(as, bs), cs)));
            }
            const requiredAttributes = (0, memoize_1.memoize)(spec => (0, alias_1.ObjectEntries)(spec).flatMap(([k, v]) => v && (0, alias_1.isFrozen)(v) ? [k] : []), new WeakMap());
            function attributes(syntax, classes, spec, params) {
                var _a, _b;
                let invalid = false;
                const attrs = (0, alias_1.ObjectCreate)(null);
                for (let i = 0; i < params.length; ++i) {
                    const param = params[i].slice(1);
                    const name = param.split('=', 1)[0];
                    const value = param !== name ? param.slice(name.length + 2, -1).replace(/\\(.?)/g, '$1') : global_1.undefined;
                    invalid || (invalid = !spec || name in attrs);
                    if (spec && !spec[name] && name in spec)
                        continue;
                    ((_a = spec === null || spec === void 0 ? void 0 : spec[name]) === null || _a === void 0 ? void 0 : _a.includes(value)) || value !== global_1.undefined && ((_b = spec === null || spec === void 0 ? void 0 : spec[name]) === null || _b === void 0 ? void 0 : _b.length) === 0 ? attrs[name] = value : invalid || (invalid = !!spec);
                    (0, array_1.splice)(params, i--, 1);
                }
                invalid || (invalid = !!spec && !requiredAttributes(spec).every(name => name in attrs));
                if (invalid) {
                    !classes.includes('invalid') && classes.push('invalid');
                    attrs['class'] = (0, array_1.join)(classes, ' ');
                    attrs['data-invalid-syntax'] = syntax;
                    attrs['data-invalid-type'] = 'argument';
                    attrs['data-invalid-description'] = 'Invalid argument.';
                }
                return attrs;
            }
            exports.attributes = attributes;
        },
        {
            '../../combinator': 37,
            '../inline': 99,
            '../source': 137,
            '../util': 143,
            'spica/alias': 5,
            'spica/array': 6,
            'spica/cache': 9,
            'spica/global': 17,
            'spica/memoize': 20,
            'typed-dom': 30
        }
    ],
    123: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.htmlentity = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const typed_dom_1 = _dereq_('typed-dom');
            const parser = (0, typed_dom_1.html)('textarea');
            exports.htmlentity = (0, combinator_1.creator)((0, combinator_1.validate)('&', ';', '\n', (0, combinator_1.focus)(/^&[0-9A-Za-z]+;/, entity => [
                [(parser.innerHTML = entity, parser.value)],
                ''
            ])));
        },
        {
            '../../combinator': 37,
            'typed-dom': 30
        }
    ],
    124: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.insertion = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const inline_1 = _dereq_('../inline');
            const source_1 = _dereq_('../source');
            const typed_dom_1 = _dereq_('typed-dom');
            const array_1 = _dereq_('spica/array');
            exports.insertion = (0, combinator_1.lazy)(() => (0, combinator_1.creator)((0, combinator_1.surround)((0, source_1.str)('++'), (0, combinator_1.union)([(0, combinator_1.some)(inline_1.inline, '++')]), (0, source_1.str)('++'), false, ([, bs], rest) => [
                [(0, typed_dom_1.html)('ins', (0, typed_dom_1.defrag)(bs))],
                rest
            ], ([as, bs], rest) => [
                (0, array_1.unshift)(as, bs),
                rest
            ])));
        },
        {
            '../../combinator': 37,
            '../inline': 99,
            '../source': 137,
            'spica/array': 6,
            'typed-dom': 30
        }
    ],
    125: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.resolve = exports.option = exports.uri = exports.link = void 0;
            const global_1 = _dereq_('spica/global');
            const alias_1 = _dereq_('spica/alias');
            const parser_1 = _dereq_('../../combinator/data/parser');
            const combinator_1 = _dereq_('../../combinator');
            const inline_1 = _dereq_('../inline');
            const html_1 = _dereq_('./html');
            const autolink_1 = _dereq_('../autolink');
            const source_1 = _dereq_('../source');
            const util_1 = _dereq_('../util');
            const typed_dom_1 = _dereq_('typed-dom');
            const url_1 = _dereq_('spica/url');
            const optspec = { rel: ['nofollow'] };
            (0, alias_1.ObjectSetPrototypeOf)(optspec, null);
            exports.link = (0, combinator_1.lazy)(() => (0, combinator_1.creator)(10, (0, combinator_1.bind)((0, combinator_1.verify)((0, combinator_1.reverse)((0, combinator_1.validate)([
                '[',
                '{'
            ], '}', '\n', (0, combinator_1.guard)(context => {
                var _a, _b, _c;
                return (_c = (_b = (_a = context.syntax) === null || _a === void 0 ? void 0 : _a.inline) === null || _b === void 0 ? void 0 : _b.link) !== null && _c !== void 0 ? _c : true;
            }, (0, combinator_1.tails)([
                (0, combinator_1.context)({ syntax: { inline: { link: false } } }, (0, combinator_1.dup)((0, combinator_1.union)([
                    (0, combinator_1.surround)('[', inline_1.media, ']'),
                    (0, combinator_1.surround)('[', inline_1.shortmedia, ']'),
                    (0, combinator_1.surround)('[', (0, util_1.startTight)((0, combinator_1.context)({
                        syntax: {
                            inline: {
                                annotation: false,
                                reference: false,
                                index: false,
                                label: false,
                                media: false,
                                autolink: false
                            }
                        }
                    }, (0, combinator_1.some)(inline_1.inline, ']', /^\\?\n/))), ']', true)
                ]))),
                (0, combinator_1.dup)((0, combinator_1.surround)(/^{(?![{}])/, (0, combinator_1.inits)([
                    exports.uri,
                    (0, combinator_1.some)(exports.option)
                ]), /^ ?}/))
            ])))), ([, content = []]) => (0, util_1.isEndTight)(content)), ([params, content = []], rest, context) => {
                var _a, _b;
                if ((0, parser_1.eval)((0, combinator_1.some)(autolink_1.autolink)((0, util_1.stringify)(content), context), []).some(node => typeof node === 'object'))
                    return;
                const INSECURE_URI = params.shift();
                if (INSECURE_URI[0] === ' ')
                    return;
                const src = resolve(INSECURE_URI, context.host || global_1.location, context.url || global_1.location);
                const el = (0, typed_dom_1.html)('a', { href: src }, content.length > 0 ? content = (0, typed_dom_1.defrag)(content) : decode(INSECURE_URI.replace(/^tel:/i, '')));
                if (!sanitize(new url_1.ReadonlyURL(src, ((_a = context.host) === null || _a === void 0 ? void 0 : _a.href) || global_1.location.href), el, INSECURE_URI, ((_b = context.host) === null || _b === void 0 ? void 0 : _b.origin) || global_1.location.origin))
                    return [
                        [el],
                        rest
                    ];
                (0, typed_dom_1.define)(el, (0, html_1.attributes)('link', [], optspec, params));
                return [
                    [el],
                    rest
                ];
            })));
            exports.uri = (0, combinator_1.union)([
                (0, combinator_1.open)(' ', (0, source_1.str)(/^\S+/)),
                (0, source_1.str)(/^[^\s{}]+/),
                (0, source_1.str)(' ')
            ]);
            exports.option = (0, combinator_1.union)([
                (0, combinator_1.fmap)((0, source_1.str)(/^ nofollow(?=[ }])/), () => [` rel="nofollow"`]),
                (0, source_1.str)(/^ [a-z]+(?:-[a-z]+)*(?:="(?:\\[^\n]|[^\n"])*")?(?=[ }])/),
                (0, combinator_1.fmap)((0, source_1.str)(/^ [^\n{}]+/), opt => [` \\${ opt.slice(1) }`])
            ]);
            function resolve(uri, host, source) {
                var _a;
                switch (true) {
                case uri.slice(0, 2) === '^/':
                    const file = host.pathname.slice(host.pathname.lastIndexOf('/') + 1);
                    return file.indexOf('.') > -1 ? `${ host.pathname.slice(0, -file.length) }${ uri.slice(2) }` : `${ fillTrailingSlash(host.pathname) }${ uri.slice(2) }`;
                case host.origin === source.origin && host.pathname === source.pathname:
                case uri.slice(0, 2) === '//':
                    return uri;
                default:
                    const target = new url_1.ReadonlyURL(uri, source.href);
                    return target.origin === ((_a = uri.match(/^[A-Za-z][0-9A-Za-z.+-]*:\/\/[^/?#]*/)) === null || _a === void 0 ? void 0 : _a[0]) ? uri : target.origin === host.origin ? target.href.slice(target.origin.length) : target.href;
                }
            }
            exports.resolve = resolve;
            function fillTrailingSlash(pathname) {
                return pathname[pathname.length - 1] === '/' ? pathname : pathname + '/';
            }
            function sanitize(uri, target, source, origin) {
                let type;
                let description;
                switch (uri.protocol) {
                case 'http:':
                case 'https:':
                    uri.origin !== origin && target.setAttribute('target', '_blank');
                    return true;
                case 'tel:':
                    const pattern = /^tel:(?:\+(?!0))?\d+(?:-\d+)*$/i;
                    if (pattern.test(source) && pattern.test(`tel:${ target.textContent }`) && source.replace(/[^+\d]/g, '') === target.textContent.replace(/[^+\d]/g, ''))
                        return true;
                    type = 'content';
                    description = 'Invalid phone number.';
                    break;
                }
                type !== null && type !== void 0 ? type : type = 'argument';
                description !== null && description !== void 0 ? description : description = 'Invalid protocol.';
                (0, typed_dom_1.define)(target, {
                    class: void target.classList.add('invalid'),
                    'data-invalid-syntax': 'link',
                    'data-invalid-type': type,
                    'data-invalid-description': description,
                    href: null,
                    rel: null
                });
                return false;
            }
            function decode(uri) {
                if (uri.indexOf('%') === -1)
                    return uri;
                try {
                    uri = (0, global_1.decodeURI)(uri);
                } finally {
                    return uri.replace(/\s+/g, global_1.encodeURI);
                }
            }
        },
        {
            '../../combinator': 37,
            '../../combinator/data/parser': 56,
            '../autolink': 71,
            '../inline': 99,
            '../source': 137,
            '../util': 143,
            './html': 122,
            'spica/alias': 5,
            'spica/global': 17,
            'spica/url': 28,
            'typed-dom': 30
        }
    ],
    126: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.mark = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const inline_1 = _dereq_('../inline');
            const source_1 = _dereq_('../source');
            const util_1 = _dereq_('../util');
            const typed_dom_1 = _dereq_('typed-dom');
            const array_1 = _dereq_('spica/array');
            exports.mark = (0, combinator_1.lazy)(() => (0, combinator_1.creator)((0, combinator_1.surround)((0, source_1.str)('=='), (0, util_1.startTight)((0, combinator_1.union)([(0, combinator_1.some)(inline_1.inline, '==')])), (0, source_1.str)('=='), false, ([as, bs, cs], rest) => (0, util_1.isEndTight)(bs) ? [
                [(0, typed_dom_1.html)('mark', (0, typed_dom_1.defrag)((0, util_1.trimEndBR)(bs)))],
                rest
            ] : [
                (0, array_1.unshift)(as, bs),
                cs[0] + rest
            ], ([as, bs], rest) => [
                (0, array_1.unshift)(as, bs),
                rest
            ])));
        },
        {
            '../../combinator': 37,
            '../inline': 99,
            '../source': 137,
            '../util': 143,
            'spica/array': 6,
            'typed-dom': 30
        }
    ],
    127: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.math = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const source_1 = _dereq_('../source');
            const util_1 = _dereq_('../util');
            const typed_dom_1 = _dereq_('typed-dom');
            const disallowedCommand = /\\(?:begin|tiny|huge|large)(?![0-9a-z])/i;
            exports.math = (0, combinator_1.lazy)(() => (0, combinator_1.creator)((0, combinator_1.validate)('$', '$', '\n', (0, combinator_1.rewrite)((0, combinator_1.union)([
                (0, combinator_1.surround)('$', bracket, '$'),
                (0, combinator_1.surround)('$', (0, combinator_1.verify)((0, source_1.str)(/^(?=[\\^_[(|]|[A-Za-z][0-9A-Za-z]*'*[ ~]?(?:\$|([\\^_(|:=<>])(?!\1)))(?:\\\$|[\x20-\x23\x25-\x7E])*/), util_1.isEndTight), /^\$(?![0-9A-Za-z])/)
            ]), (source, {
                caches: {math: cache} = {}
            }) => [
                [(cache === null || cache === void 0 ? void 0 : cache.has(source)) ? cache.get(source).cloneNode(true) : !disallowedCommand.test(source) ? (0, typed_dom_1.html)('span', {
                        class: 'math notranslate',
                        'data-src': source
                    }, source) : (0, typed_dom_1.html)('span', {
                        class: 'notranslate invalid',
                        'data-invalid-syntax': 'math',
                        'data-invalid-type': 'content',
                        'data-invalid-description': `"${ source.match(disallowedCommand)[0] }" command is disallowed.`
                    }, source)],
                ''
            ]))));
            const bracket = (0, combinator_1.lazy)(() => (0, combinator_1.creator)((0, combinator_1.surround)('{', (0, combinator_1.some)((0, combinator_1.union)([
                bracket,
                (0, combinator_1.some)(source_1.escsource, /^[{}]/)
            ])), '}', true)));
        },
        {
            '../../combinator': 37,
            '../source': 137,
            '../util': 143,
            'typed-dom': 30
        }
    ],
    128: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.media = void 0;
            const global_1 = _dereq_('spica/global');
            const alias_1 = _dereq_('spica/alias');
            const combinator_1 = _dereq_('../../combinator');
            const link_1 = _dereq_('./link');
            const html_1 = _dereq_('./html');
            const htmlentity_1 = _dereq_('./htmlentity');
            const source_1 = _dereq_('../source');
            const util_1 = _dereq_('../util');
            const typed_dom_1 = _dereq_('typed-dom');
            const url_1 = _dereq_('spica/url');
            const array_1 = _dereq_('spica/array');
            const optspec = {
                'aspect-ratio': [],
                rel: global_1.undefined
            };
            (0, alias_1.ObjectSetPrototypeOf)(optspec, null);
            exports.media = (0, combinator_1.lazy)(() => (0, combinator_1.creator)(100, (0, combinator_1.bind)((0, combinator_1.verify)((0, combinator_1.fmap)((0, combinator_1.open)('!', (0, combinator_1.validate)([
                '[',
                '{'
            ], '}', '\n', (0, combinator_1.guard)(context => {
                var _a, _b, _c;
                return (_c = (_b = (_a = context.syntax) === null || _a === void 0 ? void 0 : _a.inline) === null || _b === void 0 ? void 0 : _b.media) !== null && _c !== void 0 ? _c : true;
            }, (0, combinator_1.tails)([
                (0, combinator_1.dup)((0, combinator_1.surround)(/^\[(?!\\?\s)/, (0, combinator_1.some)((0, combinator_1.union)([
                    htmlentity_1.htmlentity,
                    bracket,
                    source_1.txt
                ]), ']', /^\\?\n/), ']', true)),
                (0, combinator_1.dup)((0, combinator_1.surround)(/^{(?![{}])/, (0, combinator_1.inits)([
                    link_1.uri,
                    (0, combinator_1.some)(option)
                ]), /^ ?}/))
            ])))), ([as, bs]) => bs ? [
                [(0, array_1.join)(as)],
                bs
            ] : [
                [''],
                as
            ]), ([[text]]) => (0, util_1.isStartTight)([text || '-']) && (0, util_1.isEndTight)([text])), ([[text], params], rest, context) => {
                var _a, _b, _c, _d;
                const INSECURE_URI = params.shift();
                if (INSECURE_URI[0] === ' ')
                    return;
                const src = (0, link_1.resolve)(INSECURE_URI, context.host || global_1.location, context.url || global_1.location);
                const url = new url_1.ReadonlyURL(src, ((_a = context.host) === null || _a === void 0 ? void 0 : _a.href) || global_1.location.href);
                const cache = (_b = context.caches) === null || _b === void 0 ? void 0 : _b.media;
                const cached = cache === null || cache === void 0 ? void 0 : cache.has(url.href);
                const el = cache && cached ? cache.get(url.href).cloneNode(true) : (0, typed_dom_1.html)('img', {
                    class: 'media',
                    'data-src': src,
                    alt: text.trimEnd()
                });
                if (!cached && !sanitize(url, el))
                    return [
                        [el],
                        rest
                    ];
                cached && el.hasAttribute('alt') && el.setAttribute('alt', text.trimEnd());
                (0, typed_dom_1.define)(el, (0, html_1.attributes)('media', (0, array_1.push)([], el.classList), optspec, params));
                if (((_d = (_c = context.syntax) === null || _c === void 0 ? void 0 : _c.inline) === null || _d === void 0 ? void 0 : _d.link) === false || cached && el.tagName !== 'IMG')
                    return [
                        [el],
                        rest
                    ];
                return (0, combinator_1.fmap)(link_1.link, ([link]) => [(0, typed_dom_1.define)(link, { target: '_blank' }, [el])])(`{ ${ INSECURE_URI }${ (0, array_1.join)(params) } }${ rest }`, context);
            })));
            const bracket = (0, combinator_1.lazy)(() => (0, combinator_1.union)([
                (0, combinator_1.surround)((0, source_1.str)('('), (0, combinator_1.some)((0, combinator_1.union)([
                    htmlentity_1.htmlentity,
                    bracket,
                    source_1.txt
                ]), ')'), (0, source_1.str)(')'), true, global_1.undefined, ([as, bs = []], rest) => [
                    (0, array_1.unshift)(as, bs),
                    rest
                ]),
                (0, combinator_1.surround)((0, source_1.str)('['), (0, combinator_1.some)((0, combinator_1.union)([
                    htmlentity_1.htmlentity,
                    bracket,
                    source_1.txt
                ]), ']'), (0, source_1.str)(']'), true, global_1.undefined, ([as, bs = []], rest) => [
                    (0, array_1.unshift)(as, bs),
                    rest
                ]),
                (0, combinator_1.surround)((0, source_1.str)('{'), (0, combinator_1.some)((0, combinator_1.union)([
                    htmlentity_1.htmlentity,
                    bracket,
                    source_1.txt
                ]), '}'), (0, source_1.str)('}'), true, global_1.undefined, ([as, bs = []], rest) => [
                    (0, array_1.unshift)(as, bs),
                    rest
                ]),
                (0, combinator_1.surround)((0, source_1.str)('"'), (0, combinator_1.some)((0, combinator_1.union)([
                    htmlentity_1.htmlentity,
                    source_1.txt
                ]), '"'), (0, source_1.str)('"'), true)
            ]));
            const option = (0, combinator_1.union)([
                (0, combinator_1.fmap)((0, source_1.str)(/^ [1-9][0-9]*:[1-9][0-9]*(?=[ }])/), ([opt]) => [` aspect-ratio="${ opt.slice(1).split(':').join('/') }"`]),
                link_1.option
            ]);
            function sanitize(uri, target) {
                switch (uri.protocol) {
                case 'http:':
                case 'https:':
                    return true;
                }
                (0, typed_dom_1.define)(target, {
                    class: void target.classList.add('invalid'),
                    'data-invalid-syntax': 'media',
                    'data-invalid-type': 'argument',
                    'data-invalid-description': 'Invalid protocol.'
                });
                return false;
            }
        },
        {
            '../../combinator': 37,
            '../source': 137,
            '../util': 143,
            './html': 122,
            './htmlentity': 123,
            './link': 125,
            'spica/alias': 5,
            'spica/array': 6,
            'spica/global': 17,
            'spica/url': 28,
            'typed-dom': 30
        }
    ],
    129: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.reference = void 0;
            const global_1 = _dereq_('spica/global');
            const combinator_1 = _dereq_('../../combinator');
            const inline_1 = _dereq_('../inline');
            const source_1 = _dereq_('../source');
            const util_1 = _dereq_('../util');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.reference = (0, combinator_1.lazy)(() => (0, combinator_1.creator)((0, combinator_1.validate)('[[', ']]', '\n', (0, combinator_1.fmap)((0, combinator_1.verify)((0, combinator_1.surround)('[[', (0, combinator_1.guard)(context => {
                var _a, _b, _c;
                return (_c = (_b = (_a = context.syntax) === null || _a === void 0 ? void 0 : _a.inline) === null || _b === void 0 ? void 0 : _b.reference) !== null && _c !== void 0 ? _c : true;
            }, (0, util_1.startTight)((0, combinator_1.context)({
                syntax: {
                    inline: {
                        annotation: false,
                        reference: false,
                        media: false,
                        label: true
                    }
                },
                state: global_1.undefined
            }, (0, combinator_1.subsequence)([
                abbr,
                (0, util_1.startTight)((0, combinator_1.some)(inline_1.inline, ']', /^\\?\n/))
            ])))), ']]'), util_1.isEndTight), ns => [(0, typed_dom_1.html)('sup', {
                    class: 'reference',
                    ...attributes(ns)
                }, (0, typed_dom_1.defrag)(ns))]))));
            const abbr = (0, combinator_1.creator)((0, combinator_1.fmap)((0, combinator_1.surround)('^', (0, combinator_1.union)([(0, source_1.str)(/^[A-Za-z][0-9A-Za-z]*(?:(?:['-]|[.,]? |\., )[0-9A-Za-z]+)*/)]), /^\|?(?=]])|^\|[^\S\n]?/), ([source]) => [(0, typed_dom_1.html)('abbr', source)]));
            function attributes(ns) {
                return { 'data-abbr': typeof ns[0] === 'object' && ns[0].tagName === 'ABBR' ? (0, util_1.stringify)([ns.shift()]) : global_1.undefined };
            }
        },
        {
            '../../combinator': 37,
            '../inline': 99,
            '../source': 137,
            '../util': 143,
            'spica/global': 17,
            'typed-dom': 30
        }
    ],
    130: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.ruby = void 0;
            const global_1 = _dereq_('spica/global');
            const parser_1 = _dereq_('../../combinator/data/parser');
            const combinator_1 = _dereq_('../../combinator');
            const htmlentity_1 = _dereq_('./htmlentity');
            const source_1 = _dereq_('../source');
            const util_1 = _dereq_('../util');
            const typed_dom_1 = _dereq_('typed-dom');
            const array_1 = _dereq_('spica/array');
            exports.ruby = (0, combinator_1.lazy)(() => (0, combinator_1.creator)((0, combinator_1.bind)((0, combinator_1.verify)((0, combinator_1.validate)('[', ')', '\n', (0, combinator_1.sequence)([
                (0, combinator_1.surround)('[', (0, combinator_1.focus)(/^(?:\\[^\n]|[^\[\]\n])+(?=]\()/, text), ']'),
                (0, combinator_1.surround)('(', (0, combinator_1.focus)(/^(?:\\[^\n]|[^\(\)\n])+(?=\))/, text), ')')
            ])), ([texts]) => (0, util_1.isStartTight)(texts) && (0, util_1.isEndTight)(texts)), ([texts, rubies], rest) => {
                texts[texts.length - 1] || texts.pop();
                switch (true) {
                case rubies.length <= texts.length:
                    return [
                        [(0, typed_dom_1.html)('ruby', (0, typed_dom_1.defrag)(texts.reduce((acc, _, i) => (0, array_1.push)(acc, (0, array_1.unshift)([texts[i]], i < rubies.length && rubies[i] ? [
                                (0, typed_dom_1.html)('rp', '('),
                                (0, typed_dom_1.html)('rt', rubies[i]),
                                (0, typed_dom_1.html)('rp', ')')
                            ] : [(0, typed_dom_1.html)('rt')])), [])))],
                        rest
                    ];
                case texts.length === 1 && [...texts[0]].length >= rubies.length:
                    return [
                        [(0, typed_dom_1.html)('ruby', (0, typed_dom_1.defrag)([...texts[0]].reduce((acc, _, i, texts) => (0, array_1.push)(acc, (0, array_1.unshift)([texts[i]], i < rubies.length && rubies[i] ? [
                                (0, typed_dom_1.html)('rp', '('),
                                (0, typed_dom_1.html)('rt', rubies[i]),
                                (0, typed_dom_1.html)('rp', ')')
                            ] : [(0, typed_dom_1.html)('rt')])), [])))],
                        rest
                    ];
                default:
                    return [
                        [(0, typed_dom_1.html)('ruby', (0, typed_dom_1.defrag)((0, array_1.unshift)([(0, array_1.join)(texts, ' ')], [
                                (0, typed_dom_1.html)('rp', '('),
                                (0, typed_dom_1.html)('rt', (0, array_1.join)(rubies, ' ').trim()),
                                (0, typed_dom_1.html)('rp', ')')
                            ])))],
                        rest
                    ];
                }
            })));
            const text = (0, combinator_1.creator)((source, context) => {
                var _a;
                const acc = [''];
                while (source !== '') {
                    switch (source[0]) {
                    case ' ':
                    case '\u3000':
                        acc.push('');
                        source = source.slice(1);
                        continue;
                    case '&': {
                            const result = (0, htmlentity_1.htmlentity)(source, context);
                            acc[acc.length - 1] += (0, parser_1.eval)(result, [source[0]])[0];
                            source = (0, parser_1.exec)(result, source.slice(1));
                            continue;
                        }
                    default: {
                            const result = (0, source_1.text)(source, context);
                            acc[acc.length - 1] += (_a = (0, parser_1.eval)(result)[0]) !== null && _a !== void 0 ? _a : source.slice(0, source.length - (0, parser_1.exec)(result).length);
                            source = (0, parser_1.exec)(result);
                            continue;
                        }
                    }
                }
                return (0, array_1.join)(acc).trimStart() ? [
                    [acc],
                    ''
                ] : global_1.undefined;
            });
        },
        {
            '../../combinator': 37,
            '../../combinator/data/parser': 56,
            '../source': 137,
            '../util': 143,
            './htmlentity': 123,
            'spica/array': 6,
            'spica/global': 17,
            'typed-dom': 30
        }
    ],
    131: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.shortmedia = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const url_1 = _dereq_('./autolink/url');
            const media_1 = _dereq_('./media');
            exports.shortmedia = (0, combinator_1.rewrite)((0, combinator_1.guard)(context => {
                var _a, _b, _c;
                return (_c = (_b = (_a = context.syntax) === null || _a === void 0 ? void 0 : _a.inline) === null || _b === void 0 ? void 0 : _b.media) !== null && _c !== void 0 ? _c : true;
            }, (0, combinator_1.open)('!', url_1.url)), (0, combinator_1.convert)(source => `!{ ${ source.slice(1) } }`, (0, combinator_1.union)([media_1.media])));
        },
        {
            '../../combinator': 37,
            './autolink/url': 108,
            './media': 128
        }
    ],
    132: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.strong = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const inline_1 = _dereq_('../inline');
            const emphasis_1 = _dereq_('./emphasis');
            const source_1 = _dereq_('../source');
            const util_1 = _dereq_('../util');
            const typed_dom_1 = _dereq_('typed-dom');
            const array_1 = _dereq_('spica/array');
            exports.strong = (0, combinator_1.lazy)(() => (0, combinator_1.creator)((0, combinator_1.surround)((0, source_1.str)('**', '*'), (0, util_1.startTight)((0, combinator_1.some)((0, combinator_1.union)([
                emphasis_1.emphasis,
                (0, combinator_1.some)(inline_1.inline, '*'),
                (0, source_1.str)('*')
            ]), '**')), (0, source_1.str)('**'), false, ([as, bs, cs], rest) => (0, util_1.isEndTight)(bs) ? [
                [(0, typed_dom_1.html)('strong', (0, typed_dom_1.defrag)((0, util_1.trimEndBR)(bs)))],
                rest
            ] : [
                (0, array_1.unshift)(as, bs),
                cs[0] + rest
            ], ([as, bs], rest) => [
                (0, array_1.unshift)(as, bs),
                rest
            ])));
        },
        {
            '../../combinator': 37,
            '../inline': 99,
            '../source': 137,
            '../util': 143,
            './emphasis': 113,
            'spica/array': 6,
            'typed-dom': 30
        }
    ],
    133: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.template = void 0;
            const global_1 = _dereq_('spica/global');
            const combinator_1 = _dereq_('../../combinator');
            const source_1 = _dereq_('../source');
            const typed_dom_1 = _dereq_('typed-dom');
            const array_1 = _dereq_('spica/array');
            exports.template = (0, combinator_1.lazy)(() => (0, combinator_1.creator)((0, combinator_1.rewrite)((0, combinator_1.surround)('{{', (0, combinator_1.some)((0, combinator_1.union)([
                bracket,
                source_1.escsource
            ]), '}'), '}}', true), source => [
                [(0, typed_dom_1.html)('span', { class: 'template' }, source)],
                ''
            ])));
            const bracket = (0, combinator_1.lazy)(() => (0, combinator_1.union)([
                (0, combinator_1.surround)((0, source_1.str)('('), (0, combinator_1.some)((0, combinator_1.union)([
                    bracket,
                    source_1.escsource
                ]), ')'), (0, source_1.str)(')'), true, global_1.undefined, ([as, bs = []], rest) => [
                    (0, array_1.unshift)(as, bs),
                    rest
                ]),
                (0, combinator_1.surround)((0, source_1.str)('['), (0, combinator_1.some)((0, combinator_1.union)([
                    bracket,
                    source_1.escsource
                ]), ']'), (0, source_1.str)(']'), true, global_1.undefined, ([as, bs = []], rest) => [
                    (0, array_1.unshift)(as, bs),
                    rest
                ]),
                (0, combinator_1.surround)((0, source_1.str)('{'), (0, combinator_1.some)((0, combinator_1.union)([
                    bracket,
                    source_1.escsource
                ]), '}'), (0, source_1.str)('}'), true, global_1.undefined, ([as, bs = []], rest) => [
                    (0, array_1.unshift)(as, bs),
                    rest
                ]),
                (0, combinator_1.surround)((0, source_1.str)('"'), (0, combinator_1.some)(source_1.escsource, /^"|^\\?\n/), (0, source_1.str)('"'), true)
            ]));
        },
        {
            '../../combinator': 37,
            '../source': 137,
            'spica/array': 6,
            'spica/global': 17,
            'typed-dom': 30
        }
    ],
    134: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.localize = void 0;
            const combinator_1 = _dereq_('../combinator');
            const ja_1 = _dereq_('./locale/ja');
            const typed_dom_1 = _dereq_('typed-dom');
            function localize(parser) {
                return (0, combinator_1.fmap)(parser, ns => {
                    if (ns.length === 0)
                        return ns;
                    const el = ns.length === 1 && typeof ns[0] === 'object' ? ns[0] : (0, typed_dom_1.html)('div', ns);
                    const es = el.getElementsByClassName('linebreak');
                    for (let i = 0, len = es.length; i < len; ++i) {
                        const sb = es[i];
                        if (!sb.firstChild)
                            continue;
                        if (!check(sb))
                            continue;
                        sb.firstChild.remove();
                    }
                    return ns;
                });
            }
            exports.localize = localize;
            function check(el) {
                const char = lastChar(el);
                if (!char)
                    return false;
                return (0, ja_1.japanese)(char);
            }
            function lastChar(node) {
                while (node = node === null || node === void 0 ? void 0 : node.previousSibling) {
                    if ('id' in node && !node.firstChild) {
                        switch (node.tagName) {
                        case 'BR':
                            return '';
                        case 'SPAN':
                            if (node.className === 'linebreak')
                                return '';
                        }
                        continue;
                    }
                    const str = text(node);
                    return str && [...str.slice(-2)].pop();
                }
                return '';
            }
            function text(node) {
                if (!('id' in node))
                    return node.data;
                switch (node.tagName) {
                case 'RUBY':
                    for (let ns = node.childNodes, i = ns.length; i--;) {
                        const child = ns[i];
                        if ('id' in child)
                            continue;
                        return child.data;
                    }
                    return '';
                default:
                    return node.textContent;
                }
            }
        },
        {
            '../combinator': 37,
            './locale/ja': 135,
            'typed-dom': 30
        }
    ],
    135: [
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
    136: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.prepare = exports.segment = exports.SEGMENT_LENGTH_LIMIT = void 0;
            const global_1 = _dereq_('spica/global');
            const parser_1 = _dereq_('../combinator/data/parser');
            const combinator_1 = _dereq_('../combinator');
            const heading_1 = _dereq_('./block/heading');
            const codeblock_1 = _dereq_('./block/codeblock');
            const mathblock_1 = _dereq_('./block/mathblock');
            const extension_1 = _dereq_('./block/extension');
            const source_1 = _dereq_('./source');
            const INPUT_SIZE_LIMIT = 1000 ** 2;
            exports.SEGMENT_LENGTH_LIMIT = 100 * 1000;
            const parser = (0, combinator_1.union)([
                heading_1.segment,
                codeblock_1.segment,
                mathblock_1.segment,
                extension_1.segment,
                (0, combinator_1.some)(source_1.contentline, exports.SEGMENT_LENGTH_LIMIT),
                (0, combinator_1.some)(source_1.emptyline, exports.SEGMENT_LENGTH_LIMIT)
            ]);
            function* segment(source) {
                if (!validate(source))
                    return yield `\0Too large input over ${ INPUT_SIZE_LIMIT.toLocaleString('en') } bytes.\n${ source.slice(0, 1001) }`;
                while (source !== '') {
                    const result = parser(source, {});
                    const rest = (0, parser_1.exec)(result);
                    const segs = (0, parser_1.eval)(result).length ? (0, parser_1.eval)(result) : [source.slice(0, source.length - rest.length)];
                    for (let i = 0; i < segs.length; ++i) {
                        const seg = segs[i];
                        seg.length > exports.SEGMENT_LENGTH_LIMIT ? yield `\0Too large segment over ${ exports.SEGMENT_LENGTH_LIMIT.toLocaleString('en') } in length.\n${ seg }` : yield seg;
                    }
                    source = rest;
                }
            }
            exports.segment = segment;
            function validate(source) {
                return source.length <= INPUT_SIZE_LIMIT && new global_1.Blob([source]).size <= INPUT_SIZE_LIMIT;
            }
            function prepare(source) {
                return validate(source) ? source : source.slice(0, INPUT_SIZE_LIMIT + 1);
            }
            exports.prepare = prepare;
        },
        {
            '../combinator': 37,
            '../combinator/data/parser': 56,
            './block/codeblock': 74,
            './block/extension': 76,
            './block/heading': 85,
            './block/mathblock': 88,
            './source': 137,
            'spica/global': 17
        }
    ],
    137: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.anyline = exports.emptyline = exports.contentline = exports.str = exports.unescsource = exports.escsource = exports.linebreak = exports.txt = exports.text = void 0;
            var text_1 = _dereq_('./source/text');
            Object.defineProperty(exports, 'text', {
                enumerable: true,
                get: function () {
                    return text_1.text;
                }
            });
            Object.defineProperty(exports, 'txt', {
                enumerable: true,
                get: function () {
                    return text_1.txt;
                }
            });
            Object.defineProperty(exports, 'linebreak', {
                enumerable: true,
                get: function () {
                    return text_1.linebreak;
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
            './source/escapable': 138,
            './source/line': 139,
            './source/str': 140,
            './source/text': 141,
            './source/unescapable': 142
        }
    ],
    138: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.escsource = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const separator = /[\s\x00-\x2F\x3A-\x40\x5B-\x60\x7B-\x7F]/;
            exports.escsource = (0, combinator_1.creator)(source => {
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
        { '../../combinator': 37 }
    ],
    139: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.contentline = exports.emptyline = exports.anyline = void 0;
            const global_1 = _dereq_('spica/global');
            const combinator_1 = _dereq_('../../combinator');
            exports.anyline = (0, combinator_1.line)(() => [
                [],
                ''
            ]);
            exports.emptyline = (0, combinator_1.line)(s => (0, combinator_1.isEmpty)(s) ? [
                [],
                ''
            ] : global_1.undefined);
            exports.contentline = (0, combinator_1.line)(s => !(0, combinator_1.isEmpty)(s) ? [
                [],
                ''
            ] : global_1.undefined);
        },
        {
            '../../combinator': 37,
            'spica/global': 17
        }
    ],
    140: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.str = void 0;
            const global_1 = _dereq_('spica/global');
            const combinator_1 = _dereq_('../../combinator');
            function str(pattern, not) {
                return typeof pattern === 'string' ? (0, combinator_1.creator)(source => {
                    if (source === '')
                        return;
                    return source.slice(0, pattern.length) === pattern && !(not && source.slice(pattern.length, pattern.length + not.length) === not) ? [
                        [pattern],
                        source.slice(pattern.length)
                    ] : global_1.undefined;
                }) : (0, combinator_1.creator)(source => {
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
            '../../combinator': 37,
            'spica/global': 17
        }
    ],
    141: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.isAlphanumeric = exports.linebreak = exports.txt = exports.text = exports.nonAlphanumeric = exports.nonWhitespace = exports.separator = void 0;
            const global_1 = _dereq_('spica/global');
            const combinator_1 = _dereq_('../../combinator');
            const str_1 = _dereq_('./str');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.separator = /[\s\x00-\x7F]|[、。！？][^\S\n]*(?=\\\n)/;
            exports.nonWhitespace = /[\S\n]|$/;
            exports.nonAlphanumeric = /[^0-9A-Za-z]|$/;
            const repeat = (0, str_1.str)(/^(.)\1*/);
            exports.text = (0, combinator_1.creator)((source, context) => {
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
                                [(0, typed_dom_1.html)('span', { class: 'linebreak' }, ' ')],
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
                            [(0, typed_dom_1.html)('br')],
                            source.slice(1)
                        ];
                    case '*':
                    case '+':
                    case '~':
                    case '=':
                    case '`':
                        return source[1] === source[0] ? repeat(source, context) : [
                            [source[0]],
                            source.slice(1)
                        ];
                    case '\u3001':
                    case '\u3002':
                    case '\uFF01':
                    case '\uFF1F': {
                            const i = source.slice(1).search(exports.nonWhitespace) + 1;
                            if (i > 0 && source.slice(i, i + 2) === '\\\n')
                                return [
                                    [
                                        source[0],
                                        (0, typed_dom_1.html)('span', { class: 'linebreak' })
                                    ],
                                    source.slice(i + 2)
                                ];
                        }
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
            exports.txt = (0, combinator_1.union)([exports.text]);
            exports.linebreak = (0, combinator_1.fmap)((0, combinator_1.focus)('\n', (0, combinator_1.union)([exports.text])), ns => ns);
            function isAlphanumeric(char) {
                if (char < '0' || '\x7F' < char)
                    return false;
                return '0' <= char && char <= '9' || 'a' <= char && char <= 'z' || 'A' <= char && char <= 'Z';
            }
            exports.isAlphanumeric = isAlphanumeric;
        },
        {
            '../../combinator': 37,
            './str': 140,
            'spica/global': 17,
            'typed-dom': 30
        }
    ],
    142: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.unescsource = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const text_1 = _dereq_('./text');
            exports.unescsource = (0, combinator_1.creator)(source => {
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
                        const i = b || (0, text_1.isAlphanumeric)(source[0]) ? source.search(b ? text_1.nonWhitespace : text_1.nonAlphanumeric) : 1;
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
            '../../combinator': 37,
            './text': 141
        }
    ],
    143: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.stringify = exports.trimEndBR = exports.isEndTight = exports.isStartTight = exports.startTight = exports.visualize = void 0;
            const global_1 = _dereq_('spica/global');
            const parser_1 = _dereq_('../combinator/data/parser');
            const combinator_1 = _dereq_('../combinator');
            const comment_1 = _dereq_('./inline/comment');
            const htmlentity_1 = _dereq_('./inline/htmlentity');
            const array_1 = _dereq_('spica/array');
            const invisibleHTMLEntityNames = [
                'Tab',
                'NewLine',
                'NonBreakingSpace',
                'nbsp',
                'shy',
                'ensp',
                'emsp',
                'emsp13',
                'emsp14',
                'numsp',
                'puncsp',
                'ThinSpace',
                'thinsp',
                'VeryThinSpace',
                'hairsp',
                'ZeroWidthSpace',
                'NegativeVeryThinSpace',
                'NegativeThinSpace',
                'NegativeMediumSpace',
                'NegativeThickSpace',
                'zwj',
                'zwnj',
                'lrm',
                'rlm',
                'MediumSpace',
                'NoBreak',
                'ApplyFunction',
                'af',
                'InvisibleTimes',
                'it',
                'InvisibleComma',
                'ic'
            ];
            const blankline = new RegExp(String.raw`^(?!\n|$)(?:\\?\s|&(?:${ invisibleHTMLEntityNames.join('|') });)*\\?(?:\n|$)`, 'gm');
            function visualize(parser, message = '(Empty)') {
                return justify((0, combinator_1.union)([
                    (0, combinator_1.verify)(parser, (ns, rest, context) => !rest && hasVisible(ns, context)),
                    source => [
                        [source.trim() || message],
                        ''
                    ]
                ]));
            }
            exports.visualize = visualize;
            function justify(parser) {
                return (0, combinator_1.convert)(source => source.replace(blankline, visualize), parser);
                function visualize(line) {
                    return line.replace(/[\\&]/g, '\\$&');
                }
            }
            function hasVisible(nodes, {
                syntax: {
                    inline: {
                        media = true
                    } = {}
                } = {}
            }) {
                for (let i = 0; i < nodes.length; ++i) {
                    const node = nodes[i];
                    if (typeof node === 'string') {
                        if (node && node.trimStart())
                            return true;
                    } else {
                        if (node.innerText.trimStart())
                            return true;
                        if (media && node.getElementsByClassName('media').length > 0)
                            return true;
                    }
                }
                return false;
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
                        case source.length > 2 && source[1] !== ' ' && ((_a = (0, parser_1.eval)((0, htmlentity_1.htmlentity)(source, context))) === null || _a === void 0 ? void 0 : _a[0].trimStart()) == '':
                            return;
                        }
                        break;
                    case '<':
                        switch (true) {
                        case source.length >= 7 && source[1] === '#' && !!(0, comment_1.comment)(source, context):
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
            function isStartTight(nodes) {
                if (nodes.length === 0)
                    return true;
                return isVisible(nodes[0], 'start');
            }
            exports.isStartTight = isStartTight;
            function isEndTight(nodes) {
                if (nodes.length === 0)
                    return true;
                const last = nodes.length - 1;
                return typeof nodes[last] === 'string' && nodes[last].length > 1 ? isVisible(nodes[last], 'end', 0) || isVisible(nodes[last], 'end', 1) : isVisible(nodes[last], 'end') || last === 0 || isVisible(nodes[last - 1], 'end');
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
            function trimEndBR(nodes) {
                if (nodes.length === 0)
                    return nodes;
                const node = nodes[nodes.length - 1];
                return typeof node === 'object' && node.tagName === 'BR' ? (0, array_1.pop)(nodes)[0] : nodes;
            }
            exports.trimEndBR = trimEndBR;
            function stringify(nodes) {
                let acc = '';
                for (let i = 0; i < nodes.length; ++i) {
                    const node = nodes[i];
                    acc += typeof node === 'string' ? node : node.tagName === 'BR' ? '\n' : node.innerText;
                }
                return acc;
            }
            exports.stringify = stringify;
        },
        {
            '../combinator': 37,
            '../combinator/data/parser': 56,
            './inline/comment': 111,
            './inline/htmlentity': 123,
            'spica/array': 6,
            'spica/global': 17
        }
    ],
    144: [
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
        { './renderer/render': 145 }
    ],
    145: [
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
                            const el = (0, media_1.media)(base, target, opts.media, (_c = opts.caches) === null || _c === void 0 ? void 0 : _c.media);
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
            './render/code': 146,
            './render/math': 147,
            './render/media': 148,
            'spica/global': 17
        }
    ],
    146: [
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
    147: [
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
                    !((_a = target.textContent) === null || _a === void 0 ? void 0 : _a.trim()) && (0, typed_dom_1.define)(target, [(0, typed_dom_1.html)('span', source)]);
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
            'spica/global': 17,
            'typed-dom': 30
        }
    ],
    148: [
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
            './media/audio': 149,
            './media/image': 150,
            './media/pdf': 151,
            './media/twitter': 152,
            './media/video': 153,
            './media/youtube': 154,
            'spica/url': 28
        }
    ],
    149: [
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
                const el = (0, typed_dom_1.html)('audio', {
                    class: 'media',
                    src: url.href,
                    alt,
                    controls: '',
                    style: 'width: 100%;',
                    loading: 'lazy'
                });
                cache === null || cache === void 0 ? void 0 : cache.set(url.href, el.cloneNode(true));
                return el;
            }
            exports.audio = audio;
        },
        { 'typed-dom': 30 }
    ],
    150: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.image = void 0;
            const typed_dom_1 = _dereq_('typed-dom');
            function image(url, alt, cache) {
                if (cache === null || cache === void 0 ? void 0 : cache.has(url.href))
                    return cache.get(url.href).cloneNode(true);
                const el = (0, typed_dom_1.html)('img', {
                    class: 'media',
                    src: url.href,
                    alt,
                    style: 'max-width: 100%;',
                    loading: 'lazy'
                });
                cache === null || cache === void 0 ? void 0 : cache.set(url.href, el.cloneNode(true));
                return el;
            }
            exports.image = image;
        },
        { 'typed-dom': 30 }
    ],
    151: [
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
                const el = (0, typed_dom_1.html)('div', { class: 'media' }, [
                    (0, typed_dom_1.html)('div', { style: 'position: relative; resize: vertical; overflow: hidden; padding-bottom: 10px;' }, [(0, typed_dom_1.html)('object', {
                            type: 'application/pdf',
                            data: url.href,
                            style: 'width: 100%; height: 100%; min-height: 400px;',
                            loading: 'lazy'
                        })]),
                    (0, typed_dom_1.html)('div', { style: 'word-wrap: break-word;' }, (0, parser_1.parse)(`**{ ${ url.href } }**`).firstElementChild.childNodes)
                ]);
                cache === null || cache === void 0 ? void 0 : cache.set(url.href, el.cloneNode(true));
                return el;
            }
            exports.pdf = pdf;
        },
        {
            '../../../parser': 63,
            'typed-dom': 30
        }
    ],
    152: [
        function (_dereq_, module, exports) {
            (function (global) {
                (function () {
                    'use strict';
                    Object.defineProperty(exports, '__esModule', { value: true });
                    exports.twitter = void 0;
                    const global_1 = _dereq_('spica/global');
                    const parser_1 = _dereq_('../../../parser');
                    const typed_dom_1 = _dereq_('typed-dom');
                    const dompurify_1 = typeof window !== 'undefined' ? window['DOMPurify'] : typeof global !== 'undefined' ? global['DOMPurify'] : null;
                    const origins = ['https://twitter.com'];
                    function twitter(url) {
                        if (!origins.includes(url.origin))
                            return;
                        if (url.pathname.split('/').pop().indexOf('.') > -1)
                            return;
                        if (!url.pathname.match(/^\/\w+\/status\/[0-9]{15,}(?!\w)/))
                            return;
                        return typed_dom_1.HTML.div({ class: 'media' }, [typed_dom_1.HTML.em(`loading ${ url.href }`)], (h, tag) => {
                            const outer = h(tag);
                            $.ajax(`https://publish.twitter.com/oembed?url=${ url.href.replace('?', '&') }&omit_script=true`, {
                                dataType: 'jsonp',
                                timeout: 10 * 1000,
                                cache: true,
                                success({html}) {
                                    outer.innerHTML = (0, dompurify_1.sanitize)(`<div style="margin-top: -10px; margin-bottom: -10px;">${ html }</div>`);
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
                                    (0, typed_dom_1.define)(outer, [(0, parser_1.parse)(`*{ ${ url.href } }*\n\n\`\`\`\n${ status }\n${ statusText }\n\`\`\``)]);
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
            '../../../parser': 63,
            'spica/global': 17,
            'typed-dom': 30
        }
    ],
    153: [
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
                const el = (0, typed_dom_1.html)('video', {
                    class: 'media',
                    src: url.href,
                    alt,
                    muted: '',
                    controls: '',
                    style: 'max-width: 100%;',
                    loading: 'lazy'
                });
                cache === null || cache === void 0 ? void 0 : cache.set(url.href, el.cloneNode(true));
                return el;
            }
            exports.video = video;
        },
        { 'typed-dom': 30 }
    ],
    154: [
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
                if (url.pathname.split('/').pop().indexOf('.') > -1)
                    return;
                if (cache === null || cache === void 0 ? void 0 : cache.has(url.href))
                    return cache.get(url.href).cloneNode(true);
                const el = (0, typed_dom_1.html)('div', { class: 'media' }, [(0, typed_dom_1.html)('div', { style: 'position: relative; padding-top: 56.25%;' }, [(0, typed_dom_1.html)('iframe', {
                            src: `https://www.youtube.com/embed/${ id }`,
                            allowfullscreen: '',
                            frameborder: '0',
                            style: 'display: block; aspect-ratio: 16/9; position: absolute; top: 0; right: 0; width: 100%; height: 100%;',
                            loading: 'lazy'
                        })])]);
                cache === null || cache === void 0 ? void 0 : cache.set(url.href, el.cloneNode(true));
                return el;
            }
            exports.youtube = youtube;
        },
        { 'typed-dom': 30 }
    ],
    155: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.sync = exports.context = exports.info = exports.toc = exports.quote = void 0;
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
            var sync_1 = _dereq_('./util/sync');
            Object.defineProperty(exports, 'sync', {
                enumerable: true,
                get: function () {
                    return sync_1.sync;
                }
            });
        },
        {
            './util/context': 156,
            './util/info': 157,
            './util/quote': 158,
            './util/sync': 159,
            './util/toc': 160
        }
    ],
    156: [
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
        { 'spica/global': 17 }
    ],
    157: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.info = void 0;
            const context_1 = _dereq_('./context');
            function info(source) {
                const match = (0, context_1.context)(source, 'section, article, aside, blockquote, .media, pre.notranslate, .math');
                return {
                    hashtag: find('a.hashtag[href]'),
                    hashref: find('a.hashref[href]'),
                    channel: find('a.channel[href]'),
                    account: find('a.account[href]'),
                    mention: find('a.anchor[href]'),
                    url: find('a[href]:not(.hashtag):not(.hashref):not(.channel):not(.account):not(.anchor)').filter(el => [
                        'http:',
                        'https:'
                    ].includes(el.protocol)),
                    tel: find('a[href]:not(.hashtag):not(.hashref):not(.channel):not(.account):not(.anchor)').filter(el => el.protocol === 'tel:'),
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
        { './context': 156 }
    ],
    158: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.quote = void 0;
            const typed_dom_1 = _dereq_('typed-dom');
            function quote(anchor, range) {
                var _a;
                let expansion = expand(range);
                const node = range.cloneContents();
                for (let es = node.querySelectorAll('code[data-src], .math[data-src], .media[data-src], rt, rp'), i = 0, len = es.length; i < len; ++i) {
                    const el = es[i];
                    switch (true) {
                    case el.matches('code'):
                    case el.matches('.math'):
                        (0, typed_dom_1.define)(el, el.getAttribute('data-src'));
                        continue;
                    case el.matches('.media'):
                        el.replaceWith(`!{${ el.getAttribute('data-src').replace(/^.*?[\s{}].*$/, ' $& ') }}`);
                        continue;
                    case el.matches('rt, rp'):
                        el.remove();
                        continue;
                    }
                }
                expansion || (expansion = !!((_a = trim(node).firstElementChild) === null || _a === void 0 ? void 0 : _a.matches('.quote')));
                if (!node.firstChild)
                    return '';
                let add;
                if (expansion) {
                    node.prepend('>');
                    add = true;
                } else {
                    node.prepend(`>>${ anchor }\n> `);
                    add = false;
                }
                for (let es = node.querySelectorAll('br'), i = 0, len = es.length; i < len; ++i) {
                    const el = es[i];
                    const target = el.nextSibling;
                    if (target && 'id' in target && target.matches('.quote')) {
                        el.replaceWith('\n>');
                        add || (add = i < len - 1);
                    } else {
                        el.replaceWith(add ? `\n>>${ anchor }\n> ` : '\n> ');
                        add = false;
                    }
                }
                add && node.append(`\n>>${ anchor }`);
                return node.textContent;
            }
            exports.quote = quote;
            function expand(range) {
                var _a, _b;
                const node = range.startContainer;
                if ((_a = node.parentElement) === null || _a === void 0 ? void 0 : _a.matches('.quote > .anchor:first-child')) {
                    range.setStart(node.parentElement.previousSibling, 0);
                    return true;
                }
                const offset = range.startOffset;
                if (((_b = node.parentElement) === null || _b === void 0 ? void 0 : _b.matches('.quote')) && node.textContent.slice(0, offset) === '>'.repeat(offset)) {
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
        { 'typed-dom': 30 }
    ],
    159: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.sync = void 0;
            const global_1 = _dereq_('spica/global');
            const alias_1 = _dereq_('spica/alias');
            const arrow_1 = _dereq_('spica/arrow');
            const function_1 = _dereq_('spica/function');
            const typed_dom_1 = _dereq_('typed-dom');
            function sync(editor, viewer, bottom = viewer.firstElementChild) {
                var _a, _b;
                let hover = (_b = (_a = global_1.document.activeElement) === null || _a === void 0 ? void 0 : _a.contains(editor)) !== null && _b !== void 0 ? _b : true;
                let scroll = editor.scrollTop;
                return (0, function_1.clear)((0, arrow_1.aggregate)((0, typed_dom_1.once)(viewer, 'mousemove', () => {
                    hover = false;
                }, passive), (0, typed_dom_1.once)(viewer, 'mousedown', () => {
                    hover = false;
                }, passive), (0, typed_dom_1.once)(viewer, 'wheel', () => {
                    hover = false;
                }, passive), (0, typed_dom_1.bind)(editor, 'input', () => {
                    hover = true;
                }, passive), (0, typed_dom_1.bind)(editor, 'keydown', () => {
                    hover = true;
                }, passive), (0, typed_dom_1.bind)(editor, 'mouseenter', () => {
                    hover = true;
                }, passive), (0, typed_dom_1.bind)(editor, 'mouseleave', () => {
                    hover = false;
                }, passive), (0, typed_dom_1.bind)(editor, 'scroll', () => {
                    if (!hover)
                        return scroll = editor.scrollTop, global_1.undefined;
                    const delta = editor.scrollTop - scroll;
                    switch (scroll += delta) {
                    case 0:
                        return void viewer.scrollTo({ top: 0 });
                    default:
                        const last = bottom === null || bottom === void 0 ? void 0 : bottom.previousElementSibling;
                        const viewer_scrollHeight = last ? last.offsetTop + last.offsetHeight + +global_1.window.getComputedStyle(last).marginBottom.slice(0, -2) : viewer.scrollHeight;
                        return void viewer.scrollBy({ top: (0, alias_1.sign)(delta) * (0, alias_1.ceil)(+(0, alias_1.abs)(delta) * (viewer_scrollHeight - viewer.clientHeight) / (editor.scrollHeight - editor.clientHeight)) });
                    }
                }, passive)));
            }
            exports.sync = sync;
            const passive = { passive: true };
        },
        {
            'spica/alias': 5,
            'spica/arrow': 7,
            'spica/function': 16,
            'spica/global': 17,
            'typed-dom': 30
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
            const selector = 'h1 h2 h3 h4 h5 h6 aside.aside'.split(' ').map(s => `${ s }[id]`).join();
            function toc(source) {
                const es = source.querySelectorAll(selector);
                const hs = (0, global_1.Array)(es.length);
                for (let i = 0; i < hs.length; ++i) {
                    const el = es[i];
                    switch (el.tagName) {
                    case 'ASIDE':
                        hs[i] = (0, typed_dom_1.html)(el.firstElementChild.tagName.toLowerCase(), {
                            id: el.id,
                            class: 'aside'
                        }, el.firstElementChild.cloneNode(true).childNodes);
                        continue;
                    default:
                        hs[i] = el;
                        continue;
                    }
                }
                return parse(cons(hs));
            }
            exports.toc = toc;
            function parse(node, index = '') {
                let i = 0;
                return (0, typed_dom_1.html)('ul', node.map(([el, cs]) => {
                    const isHeading = !el.classList.contains('aside');
                    const idx = isHeading ? index === '' ? `${ ++i }` : `${ index }.${ ++i }` : index === '' ? `${ i }` : `${ index }.${ i }`;
                    return (0, typed_dom_1.html)('li', (0, array_1.push)([(0, typed_dom_1.html)('a', {
                            href: `#${ el.id }`,
                            'data-index': isHeading ? idx : global_1.undefined
                        }, fix(el))], cs.length > 0 ? [parse(cs, idx)] : []));
                }));
            }
            function cons(hs) {
                return hs.reduce((hss, h) => {
                    var _a;
                    const hs = (_a = hss.pop()) !== null && _a !== void 0 ? _a : [];
                    return hs.length === 0 || level(h) > level(hs[0]) ? (0, array_1.push)(hss, [(0, array_1.push)(hs, [h])]) : (0, array_1.push)(hss, [
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
            'spica/global': 17,
            'typed-dom': 30
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
            './src/parser': 63,
            './src/renderer': 144,
            './src/util': 155,
            'spica/global': 17
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
        root.commonJsStrict = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {
    return require('securemark');
}));