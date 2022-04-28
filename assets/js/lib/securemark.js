/*! securemark v0.243.2 https://github.com/falsandtru/securemark | (c) 2017, falsandtru | UNLICENSED */
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
        { './global': 13 }
    ],
    7: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.template = exports.inherit = exports.merge = exports.extend = exports.overwrite = exports.clone = exports.assign = void 0;
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
                return source instanceof global_1.Object ? {} : (0, alias_1.ObjectCreate)(null);
            }
        },
        {
            './alias': 5,
            './array': 6,
            './global': 13,
            './type': 20
        }
    ],
    8: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.Cache = void 0;
            const global_1 = _dereq_('./global');
            const clock_1 = _dereq_('./clock');
            const invlist_1 = _dereq_('./invlist');
            const assign_1 = _dereq_('./assign');
            const tuple_1 = _dereq_('./tuple');
            class Cache {
                constructor(capacity, opts = {}) {
                    var _a;
                    this.settings = {
                        capacity: 0,
                        space: global_1.Infinity,
                        age: global_1.Infinity,
                        life: 10,
                        limit: 95,
                        capture: {
                            delete: true,
                            clear: true
                        }
                    };
                    this.SIZE = 0;
                    this.clock = global_1.Number.MIN_SAFE_INTEGER;
                    this.clockR = global_1.Number.MIN_SAFE_INTEGER;
                    this.memory = new global_1.Map();
                    this.indexes = {
                        LRU: new invlist_1.List(),
                        LFU: new invlist_1.List(),
                        OVL: new invlist_1.List()
                    };
                    this.stats = {
                        LRU: (0, tuple_1.tuple)(0, 0),
                        LFU: (0, tuple_1.tuple)(0, 0),
                        slide() {
                            const {LRU, LFU} = this;
                            LRU[1] = LRU[0];
                            LRU[0] = 0;
                            LFU[1] = LFU[0];
                            LFU[0] = 0;
                        },
                        clear() {
                            const {LRU, LFU} = this;
                            LRU[0] = LRU[1] = 0;
                            LFU[0] = LFU[1] = 0;
                        }
                    };
                    this.ratio = 50;
                    if (typeof capacity === 'object') {
                        opts = capacity;
                        capacity = (_a = opts.capacity) !== null && _a !== void 0 ? _a : 0;
                    }
                    (0, assign_1.extend)(this.settings, opts, { capacity });
                    this.capacity = this.settings.capacity;
                    if (this.capacity >= 1 === false)
                        throw new Error(`Spica: Cache: Capacity must be 1 or more.`);
                    this.space = this.settings.space;
                    this.life = this.capacity * this.settings.life;
                    this.limit = this.settings.limit;
                }
                get length() {
                    return this.indexes.LRU.length + this.indexes.LFU.length;
                }
                get size() {
                    return this.SIZE;
                }
                evict(node, record, callback) {
                    var _a, _b, _c;
                    const index = node.value;
                    callback && (callback = !!this.settings.disposer);
                    record = callback ? record !== null && record !== void 0 ? record : this.memory.get(index.key) : record;
                    node.delete();
                    (_a = node.value.overlap) === null || _a === void 0 ? void 0 : _a.delete();
                    this.memory.delete(index.key);
                    this.SIZE -= index.size;
                    callback && ((_c = (_b = this.settings).disposer) === null || _c === void 0 ? void 0 : _c.call(_b, record.value, index.key));
                }
                ensure(margin, skip) {
                    var _a, _b, _c;
                    if (skip) {
                        skip.value.clock = this.clock;
                        skip.value.expiry = global_1.Infinity;
                    }
                    let size = (_a = skip === null || skip === void 0 ? void 0 : skip.value.size) !== null && _a !== void 0 ? _a : 0;
                    if (margin - size <= 0)
                        return;
                    const {LRU, LFU, OVL} = this.indexes;
                    while (this.length === this.capacity || this.size + margin - size > this.space) {
                        const lastNode = (_b = OVL.last) !== null && _b !== void 0 ? _b : LFU.last;
                        const lastIndex = lastNode === null || lastNode === void 0 ? void 0 : lastNode.value;
                        let target;
                        switch (true) {
                        case lastIndex && lastIndex.clock < this.clock - this.life:
                        case lastIndex && lastIndex.expiry !== global_1.Infinity && lastIndex.expiry < (0, clock_1.now)():
                            target = lastNode.list === OVL ? lastNode.value.node : lastNode;
                            break;
                        case LRU.length === 0:
                            target = LFU.last !== skip ? LFU.last : LFU.last.prev;
                            break;
                        case LFU.length > this.capacity * this.ratio / 100:
                            target = LFU.last !== skip ? LFU.last : LFU.length >= 2 ? LFU.last.prev : skip;
                            if (target !== skip) {
                                if (this.ratio >= 50)
                                    break;
                                LRU.unshiftNode(target);
                                LRU.head.value.node = LRU.head;
                                LRU.head.value.overlap = OVL.unshift(LRU.head.value);
                            }
                        default:
                            target = LRU.last !== skip ? LRU.last : LRU.length >= 2 ? LRU.last.prev : LFU.last;
                        }
                        this.evict(target, void 0, true);
                        skip = (skip === null || skip === void 0 ? void 0 : skip.list) && skip;
                        size = (_c = skip === null || skip === void 0 ? void 0 : skip.value.size) !== null && _c !== void 0 ? _c : 0;
                    }
                }
                put(key, value, size = 1, age = this.settings.age) {
                    var _a, _b, _c, _d;
                    if (size >= 1 === false)
                        throw new Error(`Spica: Cache: Size must be 1 or more.`);
                    if (age >= 1 === false)
                        throw new Error(`Spica: Cache: Age must be 1 or more.`);
                    if (size > this.space || age <= 0) {
                        (_b = (_a = this.settings).disposer) === null || _b === void 0 ? void 0 : _b.call(_a, value, key);
                        return false;
                    }
                    const expiry = age === global_1.Infinity ? global_1.Infinity : (0, clock_1.now)() + age;
                    const record = this.memory.get(key);
                    if (record) {
                        const node = record.index;
                        const val = record.value;
                        const index = node.value;
                        this.ensure(size, node);
                        index.clock = index.region === 'LRU' ? ++this.clockR : ++this.clock;
                        index.expiry = expiry;
                        this.SIZE += size - index.size;
                        index.size = size;
                        record.value = value;
                        (_d = (_c = this.settings).disposer) === null || _d === void 0 ? void 0 : _d.call(_c, val, key);
                        return true;
                    }
                    this.ensure(size);
                    const {LRU} = this.indexes;
                    this.SIZE += size;
                    this.memory.set(key, {
                        index: LRU.unshift({
                            key,
                            size,
                            clock: ++this.clockR,
                            expiry,
                            region: 'LRU'
                        }),
                        value
                    });
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
                    const node = record.index;
                    const expiry = node.value.expiry;
                    if (expiry !== global_1.Infinity && expiry < (0, clock_1.now)()) {
                        this.evict(node, record, true);
                        return;
                    }
                    if (this.capacity >= 10 && node === node.list.head)
                        return record.value;
                    this.access(node);
                    this.slide();
                    return record.value;
                }
                has(key) {
                    const record = this.memory.get(key);
                    if (!record)
                        return false;
                    const expiry = record.index.value.expiry;
                    if (expiry !== global_1.Infinity && expiry < (0, clock_1.now)()) {
                        this.evict(record.index, record, true);
                        return false;
                    }
                    return true;
                }
                delete(key) {
                    const record = this.memory.get(key);
                    if (!record)
                        return false;
                    this.evict(record.index, record, this.settings.capture.delete === true);
                    return true;
                }
                clear() {
                    this.SIZE = 0;
                    this.ratio = 50;
                    this.stats.clear();
                    this.indexes.LRU.clear();
                    this.indexes.LFU.clear();
                    this.indexes.OVL.clear();
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
                    const {capacity, ratio, limit, indexes} = this;
                    const window = capacity;
                    LRU[0] + LFU[0] === window && this.stats.slide();
                    if ((LRU[0] + LFU[0]) * 100 % capacity || LRU[1] + LFU[1] === 0)
                        return;
                    const lenR = indexes.LRU.length;
                    const lenF = indexes.LFU.length;
                    const lenV = indexes.OVL.length;
                    const r = (lenF + lenV) * 1000 / (lenR + lenF) | 0;
                    const rateR0 = rate(window, LRU[0], LRU[0] + LFU[0], LRU[1], LRU[1] + LFU[1], 0) * (1 + r);
                    const rateF0 = rate(window, LFU[0], LRU[0] + LFU[0], LFU[1], LRU[1] + LFU[1], 0) * (1001 - r);
                    const rateF1 = rate(window, LFU[1], LRU[1] + LFU[1], LFU[0], LRU[0] + LFU[0], 5) * (1001 - r);
                    if (ratio > 0 && (rateR0 > rateF0 || rateF0 < rateF1 * 0.95)) {
                        if (lenR >= capacity * (100 - ratio) / 100) {
                            --this.ratio;
                        }
                    } else if (ratio < limit && rateF0 > rateR0) {
                        if (lenF >= capacity * ratio / 100) {
                            ++this.ratio;
                        }
                    }
                }
                access(node) {
                    return this.accessLFU(node) || this.accessLRU(node);
                }
                accessLRU(node) {
                    var _a;
                    const index = node.value;
                    const {LRU, LFU} = this.indexes;
                    ++this.stats[index.region][0];
                    if (!index.overlap && index.clock >= this.clockR - LRU.length / 3 && this.capacity > 3) {
                        index.clock = ++this.clockR;
                        node.moveToHead();
                        return true;
                    }
                    index.clock = ++this.clock;
                    index.region = 'LFU';
                    (_a = index.overlap) === null || _a === void 0 ? void 0 : _a.delete();
                    LFU.unshiftNode(node);
                    return true;
                }
                accessLFU(node) {
                    const index = node.value;
                    const {LFU} = this.indexes;
                    if (node.list !== LFU)
                        return false;
                    ++this.stats[index.region][0];
                    index.clock = ++this.clock;
                    node.moveToHead();
                    return true;
                }
            }
            exports.Cache = Cache;
            function rate(window, currHits, currTotal, prevHits, prevTotal, offset) {
                const prevRate = prevHits * 100 / prevTotal | 0;
                const currRatio = currTotal * 100 / window - offset | 0;
                if (currRatio <= 0)
                    return prevRate * 100;
                const currRate = currHits * 100 / currTotal | 0;
                const prevRatio = 100 - currRatio;
                return currRate * currRatio + prevRate * prevRatio;
            }
        },
        {
            './assign': 7,
            './clock': 9,
            './global': 13,
            './invlist': 14,
            './tuple': 19
        }
    ],
    9: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.tick = exports.clock = exports.now = void 0;
            const global_1 = _dereq_('./global');
            const alias_1 = _dereq_('./alias');
            const exception_1 = _dereq_('./exception');
            let mem;
            let count = 0;
            function now(nocache = false) {
                if (mem === void 0) {
                    tick(() => mem = void 0);
                } else if (!nocache && ++count !== 100) {
                    return mem;
                }
                count = 0;
                return mem = global_1.Date.now();
            }
            exports.now = now;
            exports.clock = Promise.resolve(void 0);
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
            './exception': 12,
            './global': 13
        }
    ],
    10: [
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
            '../global': 13
        }
    ],
    11: [
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
            const global = void 0 || typeof globalThis !== 'undefined' && globalThis || typeof self !== 'undefined' && self || Function('return this')();
            eval('global.global = global');
            module.exports = global;
        },
        {}
    ],
    14: [
        function (_dereq_, module, exports) {
            'use strict';
            var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
                if (k2 === undefined)
                    k2 = k;
                var desc = Object.getOwnPropertyDescriptor(m, k);
                if (!desc || ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)) {
                    desc = {
                        enumerable: true,
                        get: function () {
                            return m[k];
                        }
                    };
                }
                Object.defineProperty(o, k2, desc);
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
        { './list/invlist': 15 }
    ],
    15: [
        function (_dereq_, module, exports) {
            'use strict';
            var _a;
            Object.defineProperty(exports, '__esModule', { value: true });
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
                unshiftNode(node) {
                    return this.head = this.pushNode(node);
                }
                unshiftRotationally(value) {
                    const node = this.last;
                    if (!node)
                        return this.unshift(value);
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
                pushNode(node) {
                    return this.insert(node, this.head);
                }
                pushRotationally(value) {
                    const node = this.head;
                    if (!node)
                        return this.push(value);
                    node.value = value;
                    this.head = node.next;
                    return node;
                }
                pop() {
                    var _b;
                    return (_b = this.last) === null || _b === void 0 ? void 0 : _b.delete();
                }
                insert(node, before = this.head) {
                    var _b, _c;
                    if (node.list === this)
                        return before && node.move(before), node;
                    node.delete();
                    ++this[LENGTH];
                    (_b = this.head) !== null && _b !== void 0 ? _b : this.head = node;
                    node.list = this;
                    const next = node.next = before !== null && before !== void 0 ? before : node;
                    const prev = node.prev = (_c = next.prev) !== null && _c !== void 0 ? _c : node;
                    next.prev = prev.next = node;
                    return node;
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
                constructor(value, next, prev, list) {
                    var _b, _c;
                    if (list === void 0) {
                        list = (_b = next === null || next === void 0 ? void 0 : next.list) !== null && _b !== void 0 ? _b : new List();
                    }
                    this.value = value;
                    this.next = next;
                    this.prev = prev;
                    this.list = list;
                    ++list[LENGTH];
                    (_c = list.head) !== null && _c !== void 0 ? _c : list.head = this;
                    next && prev ? next.prev = prev.next = this : this.next = this.prev = this;
                }
                delete() {
                    if (!this.list)
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
                    this.list = undefined;
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
                    if (before.list !== this.list)
                        return before.list.insert(this, before), true;
                    const a1 = this;
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
                    if (node1.list !== node2.list)
                        throw new Error(`Spica: InvList: Cannot swap nodes across lists.`);
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
        },
        {}
    ],
    16: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.reduce = exports.memoize = void 0;
            const global_1 = _dereq_('./global');
            const alias_1 = _dereq_('./alias');
            const compare_1 = _dereq_('./compare');
            function memoize(f, identify = (...as) => as[0], memory) {
                if (typeof identify === 'object')
                    return memoize(f, void 0, identify);
                if (memory === void 0)
                    return memoize(f, identify, new global_1.Map());
                if ((0, alias_1.isArray)(memory))
                    return memoize(f, identify, {
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
                    if (z !== void 0 || nullish && memory.has(b))
                        return z;
                    z = f(...as);
                    nullish || (nullish = z === void 0);
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
        },
        {
            './alias': 5,
            './compare': 11,
            './global': 13
        }
    ],
    17: [
        function (_dereq_, module, exports) {
            'use strict';
            var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
                if (k2 === undefined)
                    k2 = k;
                var desc = Object.getOwnPropertyDescriptor(m, k);
                if (!desc || ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)) {
                    desc = {
                        enumerable: true,
                        get: function () {
                            return m[k];
                        }
                    };
                }
                Object.defineProperty(o, k2, desc);
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
    18: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.unique = exports.rndAf = exports.rndAP = exports.rnd0_ = exports.rnd0Z = exports.rnd0v = exports.rnd0f = exports.rnd64 = exports.rnd62 = exports.rnd32 = exports.rnd16 = void 0;
            const global_1 = _dereq_('./global');
            const bases = [...Array(7)].map((_, i) => 1 << i);
            const dict0_ = [
                ...[...Array(36)].map((_, i) => i.toString(36)),
                ...[...Array(36)].map((_, i) => i.toString(36).toUpperCase()).slice(-26),
                '-',
                '_'
            ];
            const dictAz = [
                ...[...Array(36)].map((_, i) => i.toString(36).toUpperCase()).slice(-26),
                ...[...Array(36)].map((_, i) => i.toString(36)).slice(-26)
            ];
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
                mem !== null && mem !== void 0 ? mem : mem = new global_1.Set();
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
                        if (r < radix)
                            return r;
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
        { './global': 13 }
    ],
    19: [
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
    20: [
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
    21: [
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
                constructor(source, base) {
                    this.source = source;
                    this.base = base;
                    this[internal] = {
                        url: new format_1.ReadonlyURL(source, base),
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
            './global': 13,
            './url/format': 22
        }
    ],
    22: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.ReadonlyURL = exports._encode = exports.standardize = void 0;
            const global_1 = _dereq_('../global');
            const memoize_1 = _dereq_('../memoize');
            const cache_1 = _dereq_('../cache');
            function standardize(url, base) {
                const u = new ReadonlyURL(url, base);
                url = u.origin === 'null' ? u.protocol.toLowerCase() + u.href.slice(u.protocol.length) : u.origin.toLowerCase() + u.href.slice(u.origin.length);
                return encode(url);
            }
            exports.standardize = standardize;
            function encode(url) {
                return url.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]?|[\uDC00-\uDFFF]/g, str => str.length === 2 ? str : '').replace(/%(?![0-9A-F]{2})|[^%\[\]]+/ig, global_1.encodeURI).replace(/\?[^#]+/, query => '?' + query.slice(1).replace(/%[0-9A-F]{2}|%|[^=&]+/ig, str => str[0] === '%' && str.length === 3 ? str : (0, global_1.encodeURIComponent)(str))).replace(/%[0-9A-F]{2}/ig, str => str.toUpperCase()).replace(/#.+/, url.slice(url.indexOf('#')));
            }
            exports._encode = encode;
            const internal = Symbol.for('spica/url::internal');
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
                        switch (base === null || base === void 0 ? void 0 : base.slice(0, base.lastIndexOf('://', 9) + 1).toLowerCase()) {
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
                    this[internal] = {
                        share: ReadonlyURL.get(source, base),
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
            ReadonlyURL.get = (0, memoize_1.memoize)((url, base) => ({
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
            }), (url, base = '') => `${ base.indexOf('\n') > -1 ? base.replace(/\n+/g, '') : base }\n${ url }`, new cache_1.Cache(10000));
        },
        {
            '../cache': 8,
            '../global': 13,
            '../memoize': 16
        }
    ],
    23: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.defrag = exports.prepend = exports.append = exports.isChildren = exports.define = exports.element = exports.text = exports.svg = exports.html = exports.frag = exports.shadow = void 0;
            const global_1 = _dereq_('spica/global');
            const alias_1 = _dereq_('spica/alias');
            const memoize_1 = _dereq_('spica/memoize');
            var caches;
            (function (caches) {
                caches.shadows = new WeakMap();
                caches.shadow = (0, memoize_1.memoize)((el, opts) => el.attachShadow(opts), caches.shadows);
                caches.fragment = global_1.document.createDocumentFragment();
            }(caches || (caches = {})));
            function shadow(el, opts, children, factory = exports.html) {
                var _a, _b, _c, _d;
                if (typeof el === 'string')
                    return shadow(factory(el), opts, children, factory);
                if (typeof opts === 'function')
                    return shadow(el, void 0, children, opts);
                if (typeof children === 'function')
                    return shadow(el, opts, void 0, children);
                if (isChildren(opts))
                    return shadow(el, void 0, opts, factory);
                return defineChildren(!opts ? (_b = (_a = el.shadowRoot) !== null && _a !== void 0 ? _a : caches.shadows.get(el)) !== null && _b !== void 0 ? _b : el.attachShadow({ mode: 'open' }) : opts.mode === 'open' ? (_c = el.shadowRoot) !== null && _c !== void 0 ? _c : el.attachShadow(opts) : (_d = caches.shadows.get(el)) !== null && _d !== void 0 ? _d : caches.shadow(el, opts), children);
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
                    return !attrs || isChildren(attrs) ? defineChildren(el, attrs !== null && attrs !== void 0 ? attrs : children) : defineChildren(defineAttrs(el, attrs), children);
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
                case 'MathML':
                    return context.createElementNS('http://www.w3.org/1998/Math/MathML', tag);
                }
            }
            function define(node, attrs, children) {
                return !attrs || isChildren(attrs) ? defineChildren(node, attrs !== null && attrs !== void 0 ? attrs : children) : defineChildren(defineAttrs(node, attrs), children);
            }
            exports.define = define;
            function defineAttrs(el, attrs) {
                for (const name in attrs) {
                    if (!(0, alias_1.hasOwnProperty)(attrs, name))
                        continue;
                    const value = attrs[name];
                    switch (typeof value) {
                    case 'string':
                        el.setAttribute(name, value);
                        continue;
                    case 'function':
                        if (name.length < 3)
                            throw new Error(`TypedDOM: Attribute names for event listeners must have an event name but got "${ name }".`);
                        const names = name.split(/\s+/);
                        for (const name of names) {
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
                if (children === void 0)
                    return node;
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
                return !!(value === null || value === void 0 ? void 0 : value[global_1.Symbol.iterator]);
            }
            exports.isChildren = isChildren;
            function append(node, children) {
                if (children === void 0)
                    return node;
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
                if (children === void 0)
                    return node;
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
                    if (node === '')
                        continue;
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
        },
        {
            'spica/alias': 5,
            'spica/global': 13,
            'spica/memoize': 16
        }
    ],
    24: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.querySelectorAll = exports.querySelector = void 0;
            function querySelector(node, selector) {
                return 'matches' in node && node.matches(selector) ? node : node.querySelector(selector);
            }
            exports.querySelector = querySelector;
            function querySelectorAll(node, selector) {
                const acc = [];
                if ('matches' in node && node.matches(selector)) {
                    acc.push(node);
                }
                const nodes = node.querySelectorAll(selector);
                for (let i = 0, len = nodes.length; i < len; ++i) {
                    acc.push(nodes[i]);
                }
                return acc;
            }
            exports.querySelectorAll = querySelectorAll;
        },
        {}
    ],
    25: [
        function (_dereq_, module, exports) {
            'use strict';
            var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
                if (k2 === undefined)
                    k2 = k;
                var desc = Object.getOwnPropertyDescriptor(m, k);
                if (!desc || ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)) {
                    desc = {
                        enumerable: true,
                        get: function () {
                            return m[k];
                        }
                    };
                }
                Object.defineProperty(o, k2, desc);
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
            __exportStar(_dereq_('./combinator/control/manipulation/fallback'), exports);
            __exportStar(_dereq_('./combinator/control/manipulation/recovery'), exports);
            __exportStar(_dereq_('./combinator/control/manipulation/lazy'), exports);
            __exportStar(_dereq_('./combinator/control/monad/fmap'), exports);
            __exportStar(_dereq_('./combinator/control/monad/bind'), exports);
        },
        {
            './combinator/control/constraint/block': 26,
            './combinator/control/constraint/contract': 27,
            './combinator/control/constraint/line': 28,
            './combinator/control/manipulation/context': 29,
            './combinator/control/manipulation/convert': 30,
            './combinator/control/manipulation/duplicate': 31,
            './combinator/control/manipulation/fallback': 32,
            './combinator/control/manipulation/fence': 33,
            './combinator/control/manipulation/indent': 34,
            './combinator/control/manipulation/lazy': 35,
            './combinator/control/manipulation/match': 36,
            './combinator/control/manipulation/recovery': 37,
            './combinator/control/manipulation/resource': 38,
            './combinator/control/manipulation/reverse': 39,
            './combinator/control/manipulation/scope': 40,
            './combinator/control/manipulation/surround': 41,
            './combinator/control/manipulation/trim': 42,
            './combinator/control/monad/bind': 43,
            './combinator/control/monad/fmap': 44,
            './combinator/data/parser/inits': 46,
            './combinator/data/parser/sequence': 47,
            './combinator/data/parser/some': 48,
            './combinator/data/parser/subsequence': 49,
            './combinator/data/parser/tails': 50,
            './combinator/data/parser/union': 51
        }
    ],
    26: [
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
            '../../data/parser': 45,
            './line': 28,
            'spica/global': 13
        }
    ],
    27: [
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
                const match = (0, global_1.Function)([
                    '"use strict";',
                    'return source =>',
                    '0',
                    ...patterns.map(pattern => typeof pattern === 'string' ? `|| source.slice(0, ${ pattern.length }) === '${ pattern }'` : `|| /${ pattern.source }/${ pattern.flags }.test(source)`)
                ].join(''))();
                const match2 = source => {
                    if (!has)
                        return true;
                    const i = end ? source.indexOf(end, 1) : -1;
                    return i !== -1 ? source.slice(0, i).indexOf(has, 1) !== -1 : source.indexOf(has, 1) !== -1;
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
            '../../data/parser': 45,
            'spica/alias': 5,
            'spica/global': 13
        }
    ],
    28: [
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
            '../../data/parser': 45,
            'spica/global': 13
        }
    ],
    29: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.context = exports.reset = exports.guard = void 0;
            const global_1 = _dereq_('spica/global');
            const alias_1 = _dereq_('spica/alias');
            const assign_1 = _dereq_('spica/assign');
            const type_1 = _dereq_('spica/type');
            const memoize_1 = _dereq_('spica/memoize');
            function guard(f, parser) {
                return (source, context) => f(context) ? parser(source, context) : global_1.undefined;
            }
            exports.guard = guard;
            function reset(base, parser) {
                if (isEmpty(base))
                    return parser;
                return (source, context) => parser(source, inherit((0, alias_1.ObjectCreate)(context), base));
            }
            exports.reset = reset;
            function context(base, parser) {
                if (isEmpty(base))
                    return parser;
                const override = (0, memoize_1.memoize)(context => inherit((0, alias_1.ObjectCreate)(context), base), new global_1.WeakMap());
                return (source, context) => parser(source, override(context));
            }
            exports.context = context;
            const inherit = (0, assign_1.template)((prop, target, source) => {
                if (target[prop] === source[prop])
                    return;
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
                        return target[prop] = source[prop];
                    }
                default:
                    return target[prop] = source[prop];
                }
            });
            function isEmpty(context) {
                for (const _ in context)
                    return false;
                return true;
            }
        },
        {
            'spica/alias': 5,
            'spica/assign': 7,
            'spica/global': 13,
            'spica/memoize': 16,
            'spica/type': 20
        }
    ],
    30: [
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
    31: [
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
        { '../monad/fmap': 44 }
    ],
    32: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.fallback = void 0;
            const union_1 = _dereq_('../../data/parser/union');
            function fallback(parser, otherwise) {
                return (0, union_1.union)([
                    parser,
                    otherwise
                ]);
            }
            exports.fallback = fallback;
        },
        { '../../data/parser/union': 51 }
    ],
    33: [
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
                    if (matches[0].indexOf(delim, delim.length) !== -1)
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
            '../constraint/line': 28,
            'spica/array': 6
        }
    ],
    34: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.indent = void 0;
            const global_1 = _dereq_('spica/global');
            const parser_1 = _dereq_('../../data/parser');
            const some_1 = _dereq_('../../data/parser/some');
            const block_1 = _dereq_('../constraint/block');
            const line_1 = _dereq_('../constraint/line');
            const bind_1 = _dereq_('../monad/bind');
            const match_1 = _dereq_('./match');
            const surround_1 = _dereq_('./surround');
            const memoize_1 = _dereq_('spica/memoize');
            const array_1 = _dereq_('spica/array');
            function indent(parser, separation = false) {
                return (0, bind_1.bind)((0, block_1.block)((0, match_1.match)(/^(?=(([ \t])\2*))/, (0, memoize_1.memoize)(([, indent]) => (0, some_1.some)((0, line_1.line)((0, surround_1.open)(indent, source => [
                    [unline(source)],
                    ''
                ]))), ([, indent]) => indent.length * 2 + +(indent[0] === ' '), [])), separation), (nodes, rest, context) => {
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
            '../../data/parser': 45,
            '../../data/parser/some': 48,
            '../constraint/block': 26,
            '../constraint/line': 28,
            '../monad/bind': 43,
            './match': 36,
            './surround': 41,
            'spica/array': 6,
            'spica/global': 13,
            'spica/memoize': 16
        }
    ],
    35: [
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
    36: [
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
            '../../data/parser': 45,
            'spica/global': 13
        }
    ],
    37: [
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
    38: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.creator = void 0;
            function creator(cost, parser) {
                if (typeof cost === 'function')
                    return creator(1, cost);
                return (source, context) => {
                    const {
                        resources = {
                            budget: 1,
                            recursion: 1
                        }
                    } = context;
                    if (resources.budget <= 0)
                        throw new Error('Too many creations.');
                    if (resources.recursion <= 0)
                        throw new Error('Too much recursion.');
                    --resources.recursion;
                    const result = parser(source, context);
                    ++resources.recursion;
                    if (result) {
                        resources.budget -= cost;
                    }
                    return result;
                };
            }
            exports.creator = creator;
        },
        {}
    ],
    39: [
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
        { '../monad/fmap': 44 }
    ],
    40: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.rewrite = exports.focus = void 0;
            const global_1 = _dereq_('spica/global');
            const parser_1 = _dereq_('../../data/parser');
            function focus(scope, parser) {
                const match = typeof scope === 'string' ? source => source.slice(0, scope.length) === scope ? scope : '' : source => {
                    var _a, _b;
                    return (_b = (_a = source.match(scope)) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : '';
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
            '../../data/parser': 45,
            'spica/global': 13
        }
    ],
    41: [
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
            '../../data/parser': 45,
            '../monad/fmap': 44,
            'spica/array': 6,
            'spica/global': 13
        }
    ],
    42: [
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
        { './convert': 30 }
    ],
    43: [
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
            '../../data/parser': 45,
            'spica/global': 13
        }
    ],
    44: [
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
        { './bind': 43 }
    ],
    45: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.check = exports.exec = exports.eval = exports.Delimiters = void 0;
            class Delimiters {
                constructor() {
                    this.matchers = [];
                    this.record = {};
                }
                push(delimiter) {
                    const {signature, matcher, escape} = delimiter;
                    if (this.record[signature] === !escape) {
                        this.matchers.unshift(() => undefined);
                    } else {
                        this.matchers.unshift(matcher);
                        this.record[signature] = !escape;
                    }
                }
                pop() {
                    this.matchers.shift();
                }
                match(source) {
                    const {matchers} = this;
                    for (let i = 0; i < matchers.length; ++i) {
                        switch (matchers[i](source)) {
                        case true:
                            return true;
                        case false:
                            return false;
                        }
                    }
                    return false;
                }
            }
            exports.Delimiters = Delimiters;
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
    46: [
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
            '../parser': 45,
            'spica/array': 6,
            'spica/global': 13
        }
    ],
    47: [
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
            '../parser': 45,
            'spica/array': 6,
            'spica/global': 13
        }
    ],
    48: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.escape = exports.some = void 0;
            const global_1 = _dereq_('spica/global');
            const parser_1 = _dereq_('../parser');
            const memoize_1 = _dereq_('spica/memoize');
            const array_1 = _dereq_('spica/array');
            const signature = pattern => {
                switch (typeof pattern) {
                case 'undefined':
                    return signature('');
                case 'string':
                    return `s:${ pattern }`;
                case 'object':
                    return `r/${ pattern.source }/${ pattern.flags }`;
                }
            };
            const matcher = (0, memoize_1.memoize)(pattern => {
                switch (typeof pattern) {
                case 'undefined':
                    return () => global_1.undefined;
                case 'string':
                    return source => source.slice(0, pattern.length) === pattern || global_1.undefined;
                case 'object':
                    return (0, memoize_1.reduce)(source => pattern.test(source) || global_1.undefined);
                }
            }, signature);
            function some(parser, until, deep, limit = -1) {
                if (typeof until === 'number')
                    return some(parser, global_1.undefined, deep, until);
                const match = matcher(until);
                const delimiter = {
                    signature: signature(deep),
                    matcher: matcher(deep)
                };
                return (source, context) => {
                    var _a, _b;
                    if (source === '')
                        return;
                    let rest = source;
                    let nodes;
                    if (deep && context) {
                        (_a = context.delimiters) !== null && _a !== void 0 ? _a : context.delimiters = new parser_1.Delimiters();
                        context.delimiters.push(delimiter);
                    }
                    while (true) {
                        if (rest === '')
                            break;
                        if (match(rest))
                            break;
                        if ((_b = context.delimiters) === null || _b === void 0 ? void 0 : _b.match(rest))
                            break;
                        const result = parser(rest, context);
                        if (!result)
                            break;
                        nodes = nodes ? (0, array_1.push)(nodes, (0, parser_1.eval)(result)) : (0, parser_1.eval)(result);
                        rest = (0, parser_1.exec)(result);
                        if (limit >= 0 && source.length - rest.length > limit)
                            break;
                    }
                    if (deep && context.delimiters) {
                        context.delimiters.pop();
                    }
                    return nodes && rest.length < source.length ? [
                        nodes,
                        rest
                    ] : global_1.undefined;
                };
            }
            exports.some = some;
            function escape(parser, delim) {
                const delimiter = {
                    signature: signature(delim),
                    matcher: source => source.slice(0, delim.length) !== delim && global_1.undefined,
                    escape: true
                };
                return (source, context) => {
                    var _a;
                    if (source === '')
                        return;
                    if (context) {
                        (_a = context.delimiters) !== null && _a !== void 0 ? _a : context.delimiters = new parser_1.Delimiters();
                        context.delimiters.push(delimiter);
                    }
                    const result = parser(source, context);
                    if (context.delimiters) {
                        context.delimiters.pop();
                    }
                    return result;
                };
            }
            exports.escape = escape;
        },
        {
            '../parser': 45,
            'spica/array': 6,
            'spica/global': 13,
            'spica/memoize': 16
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
                return (0, union_1.union)(parsers.map((_, i) => i + 1 < parsers.length ? (0, inits_1.inits)([
                    parsers[i],
                    subsequence(parsers.slice(i + 1))
                ]) : parsers[i]));
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
                return (0, union_1.union)(parsers.map((_, i) => (0, sequence_1.sequence)(parsers.slice(i))));
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
                    ].join('\n'))(parsers);
                }
            }
            exports.union = union;
        },
        { 'spica/global': 13 }
    ],
    52: [
        function (_dereq_, module, exports) {
            'use strict';
            var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
                if (k2 === undefined)
                    k2 = k;
                var desc = Object.getOwnPropertyDescriptor(m, k);
                if (!desc || ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)) {
                    desc = {
                        enumerable: true,
                        get: function () {
                            return m[k];
                        }
                    };
                }
                Object.defineProperty(o, k2, desc);
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
        { './parser/api': 53 }
    ],
    53: [
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
            './api/bind': 54,
            './api/body': 55,
            './api/cache': 56,
            './api/header': 57,
            './api/normalize': 58,
            './api/parse': 59
        }
    ],
    54: [
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
            const figure_1 = _dereq_('../processor/figure');
            const footnote_1 = _dereq_('../processor/footnote');
            const url_1 = _dereq_('spica/url');
            const array_1 = _dereq_('spica/array');
            function bind(target, settings) {
                var _a, _b;
                const context = (0, alias_1.ObjectAssign)((0, alias_1.ObjectCreate)(settings), {
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
                    var _a, _b, _c, _d, _e, _f, _g;
                    if (settings.chunk && revision)
                        throw new Error('Chunks cannot be updated.');
                    const url = (_b = (_a = (0, header_2.headers)(source).find(field => field.toLowerCase().startsWith('url:'))) === null || _a === void 0 ? void 0 : _a.slice(4).trim()) !== null && _b !== void 0 ? _b : '';
                    source = (0, normalize_1.normalize)((0, segment_1.validate)(source, segment_1.MAX_INPUT_SIZE) ? source : source.slice(0, segment_1.MAX_INPUT_SIZE + 1));
                    (0, alias_1.ObjectAssign)(context, { url: url ? new url_1.ReadonlyURL(url) : global_1.undefined });
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
                        const es = (0, parser_1.eval)((0, header_1.header)(seg, { header: index === 0 }) || (0, block_1.block)(seg, context), []);
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
                        (_c = el.parentNode) === null || _c === void 0 ? void 0 : _c.removeChild(el);
                        yield {
                            type: 'block',
                            value: el
                        };
                        if (rev !== revision)
                            return yield { type: 'cancel' };
                    }
                    for (const el of (0, figure_1.figure)((_e = (_d = next(0)) === null || _d === void 0 ? void 0 : _d.parentNode) !== null && _e !== void 0 ? _e : target, settings.footnotes, context)) {
                        el ? yield {
                            type: 'figure',
                            value: el
                        } : yield { type: 'break' };
                        if (rev !== revision)
                            return yield { type: 'cancel' };
                    }
                    for (const el of (0, footnote_1.footnote)((_g = (_f = next(0)) === null || _f === void 0 ? void 0 : _f.parentNode) !== null && _g !== void 0 ? _g : target, settings.footnotes, context)) {
                        el ? yield {
                            type: 'footnote',
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
                    var _a;
                    let el;
                    let len = 0;
                    for (let i = 0; i < blocks.length; ++i) {
                        const block = blocks[i];
                        len += block[0].length;
                        el = (_a = block[1][0]) !== null && _a !== void 0 ? _a : el;
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
            '../../combinator/data/parser': 45,
            '../block': 61,
            '../header': 87,
            '../processor/figure': 125,
            '../processor/footnote': 126,
            '../segment': 127,
            './header': 57,
            './normalize': 58,
            'spica/alias': 5,
            'spica/array': 6,
            'spica/global': 13,
            'spica/url': 21
        }
    ],
    55: [
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
        { './header': 57 }
    ],
    56: [
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
        { 'spica/cache': 8 }
    ],
    57: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.headers = exports.header = void 0;
            const parser_1 = _dereq_('../../combinator/data/parser');
            const header_1 = _dereq_('../header');
            function header(source) {
                const [, rest = source] = parse(source);
                return source.slice(0, source.length - rest.length);
            }
            exports.header = header;
            function headers(source) {
                var _a;
                const [el] = parse(source);
                return (_a = el === null || el === void 0 ? void 0 : el.textContent.trimEnd().slice(el.firstChild.firstChild.textContent.length).split('\n')) !== null && _a !== void 0 ? _a : [];
            }
            exports.headers = headers;
            function parse(source) {
                const result = (0, header_1.header)(source, {});
                const [el] = (0, parser_1.eval)(result, []);
                return (el === null || el === void 0 ? void 0 : el.tagName) === 'ASIDE' ? [
                    el,
                    (0, parser_1.exec)(result)
                ] : [];
            }
        },
        {
            '../../combinator/data/parser': 45,
            '../header': 87
        }
    ],
    58: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.escape = exports.invisibleHTMLEntityNames = exports.normalize = void 0;
            const parser_1 = _dereq_('../../combinator/data/parser');
            const htmlentity_1 = _dereq_('../inline/htmlentity');
            const UNICODE_REPLACEMENT_CHARACTER = '\uFFFD';
            function normalize(source) {
                return sanitize(format(source));
            }
            exports.normalize = normalize;
            function format(source) {
                return source.replace(/\r\n?/g, '\n');
            }
            function sanitize(source) {
                return source.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]|[\u2006\u200B-\u200F\u202A-\u202F\u2060\uFEFF]|(^|[^\u1820\u1821])\u180E/g, `$1${ UNICODE_REPLACEMENT_CHARACTER }`).replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]?|[\uDC00-\uDFFF]/g, char => char.length === 1 ? UNICODE_REPLACEMENT_CHARACTER : char);
            }
            exports.invisibleHTMLEntityNames = [
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
            const unreadableHTMLEntityNames = exports.invisibleHTMLEntityNames.slice(2);
            const unreadableEscapableCharacters = unreadableHTMLEntityNames.map(name => (0, parser_1.eval)((0, htmlentity_1.unsafehtmlentity)(`&${ name };`, {}))[0]);
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
            function escape(source) {
                return source.replace(unreadableEscapableCharacter, char => `&${ unreadableHTMLEntityNames[unreadableEscapableCharacters.indexOf(char)] };`);
            }
            exports.escape = escape;
        },
        {
            '../../combinator/data/parser': 45,
            '../inline/htmlentity': 112
        }
    ],
    59: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.parse = void 0;
            const global_1 = _dereq_('spica/global');
            const parser_1 = _dereq_('../../combinator/data/parser');
            const header_1 = _dereq_('../header');
            const block_1 = _dereq_('../block');
            const segment_1 = _dereq_('../segment');
            const normalize_1 = _dereq_('./normalize');
            const header_2 = _dereq_('./header');
            const figure_1 = _dereq_('../processor/figure');
            const footnote_1 = _dereq_('../processor/footnote');
            const dom_1 = _dereq_('typed-dom/dom');
            const url_1 = _dereq_('spica/url');
            function parse(source, opts = {}, context) {
                var _a, _b, _c, _d, _e, _f, _g;
                if (!(0, segment_1.validate)(source, segment_1.MAX_SEGMENT_SIZE))
                    throw new Error(`Too large input over ${ segment_1.MAX_SEGMENT_SIZE.toLocaleString('en') } bytes.`);
                const url = (_b = (_a = (0, header_2.headers)(source).find(field => field.toLowerCase().startsWith('url:'))) === null || _a === void 0 ? void 0 : _a.slice(4).trim()) !== null && _b !== void 0 ? _b : '';
                source = !context ? (0, normalize_1.normalize)(source) : source;
                context = {
                    url: url ? new url_1.ReadonlyURL(url) : context === null || context === void 0 ? void 0 : context.url,
                    host: (_d = (_c = opts.host) !== null && _c !== void 0 ? _c : context === null || context === void 0 ? void 0 : context.host) !== null && _d !== void 0 ? _d : new url_1.ReadonlyURL(global_1.location.pathname, global_1.location.origin),
                    caches: context === null || context === void 0 ? void 0 : context.caches,
                    footnotes: global_1.undefined,
                    test: global_1.undefined,
                    ...opts
                };
                if (((_e = context.host) === null || _e === void 0 ? void 0 : _e.origin) === 'null')
                    throw new Error(`Invalid host: ${ context.host.href }`);
                const node = (0, dom_1.frag)();
                let index = 0;
                for (const seg of (0, segment_1.segment)(source)) {
                    node.append(...(0, parser_1.eval)((0, header_1.header)(seg, { header: index++ === 0 }) || (0, block_1.block)(seg, context), []));
                }
                if (opts.test)
                    return node;
                for (const _ of (0, figure_1.figure)(node, opts.footnotes, context));
                for (const _ of (0, footnote_1.footnote)(node, opts.footnotes, context));
                return node;
            }
            exports.parse = parse;
        },
        {
            '../../combinator/data/parser': 45,
            '../block': 61,
            '../header': 87,
            '../processor/figure': 125,
            '../processor/footnote': 126,
            '../segment': 127,
            './header': 57,
            './normalize': 58,
            'spica/global': 13,
            'spica/url': 21,
            'typed-dom/dom': 23
        }
    ],
    60: [
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
            '../combinator': 25,
            './inline/autolink': 90,
            './source': 128
        }
    ],
    61: [
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
            const indentblock_1 = _dereq_('./block/indentblock');
            const codeblock_1 = _dereq_('./block/codeblock');
            const mathblock_1 = _dereq_('./block/mathblock');
            const extension_1 = _dereq_('./block/extension');
            const sidefence_1 = _dereq_('./block/sidefence');
            const blockquote_1 = _dereq_('./block/blockquote');
            const reply_1 = _dereq_('./block/reply');
            const paragraph_1 = _dereq_('./block/paragraph');
            const dom_1 = _dereq_('typed-dom/dom');
            const random_1 = _dereq_('spica/random');
            exports.block = (0, combinator_1.creator)(error((0, combinator_1.reset)({
                resources: {
                    budget: 100 * 1000,
                    recursion: 200
                }
            }, (0, combinator_1.union)([
                source_1.emptyline,
                horizontalrule_1.horizontalrule,
                heading_1.heading,
                ulist_1.ulist,
                olist_1.olist,
                ilist_1.ilist,
                dlist_1.dlist,
                table_1.table,
                indentblock_1.indentblock,
                codeblock_1.codeblock,
                mathblock_1.mathblock,
                extension_1.extension,
                sidefence_1.sidefence,
                blockquote_1.blockquote,
                reply_1.reply,
                paragraph_1.paragraph
            ]))));
            function error(parser) {
                return (0, combinator_1.recover)((0, combinator_1.fallback)((0, combinator_1.open)('\x07', source => {
                    throw new Error(source.split('\n', 1)[0]);
                }), parser), (source, {id}, reason) => [
                    [
                        (0, dom_1.html)('h1', {
                            id: id !== '' ? `error:${ (0, random_1.rnd0Z)(8) }` : global_1.undefined,
                            class: 'error'
                        }, reason instanceof Error ? `${ reason.name }: ${ reason.message }` : `UnknownError: ${ reason }`),
                        (0, dom_1.html)('pre', {
                            class: 'error',
                            translate: 'no'
                        }, source.replace(/^\x07.*\n/, '').slice(0, 1001).replace(/^(.{997}).{4}$/s, '$1...') || global_1.undefined)
                    ],
                    ''
                ]);
            }
        },
        {
            '../combinator': 25,
            './block/blockquote': 62,
            './block/codeblock': 63,
            './block/dlist': 64,
            './block/extension': 65,
            './block/heading': 74,
            './block/horizontalrule': 75,
            './block/ilist': 76,
            './block/indentblock': 77,
            './block/mathblock': 78,
            './block/olist': 79,
            './block/paragraph': 80,
            './block/reply': 81,
            './block/sidefence': 84,
            './block/table': 85,
            './block/ulist': 86,
            './source': 128,
            'spica/global': 13,
            'spica/random': 18,
            'typed-dom/dom': 23
        }
    ],
    62: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.blockquote = exports.segment = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const autolink_1 = _dereq_('../autolink');
            const source_1 = _dereq_('../source');
            const parse_1 = _dereq_('../api/parse');
            const dom_1 = _dereq_('typed-dom/dom');
            exports.segment = (0, combinator_1.block)((0, combinator_1.validate)([
                '!>',
                '>'
            ], (0, combinator_1.union)([(0, combinator_1.validate)(/^!?>+(?=[^\S\n]|\n[^\S\n]*\S)/, (0, combinator_1.some)(source_1.contentline))])));
            exports.blockquote = (0, combinator_1.lazy)(() => (0, combinator_1.block)((0, combinator_1.rewrite)(exports.segment, (0, combinator_1.union)([
                (0, combinator_1.open)(/^(?=>)/, source),
                (0, combinator_1.open)(/^!(?=>)/, markdown)
            ]))));
            const opener = /^(?=>>+(?:$|\s))/;
            const indent = (0, combinator_1.block)((0, combinator_1.open)(opener, (0, combinator_1.some)(source_1.contentline, /^>(?:$|\s)/)), false);
            const unindent = source => source.replace(/(^|\n)>(?:[^\S\n]|(?=>*(?:$|\s)))|\n$/g, '$1');
            const source = (0, combinator_1.lazy)(() => (0, combinator_1.fmap)((0, combinator_1.some)((0, combinator_1.creator)((0, combinator_1.union)([
                (0, combinator_1.rewrite)(indent, (0, combinator_1.convert)(unindent, source)),
                (0, combinator_1.rewrite)((0, combinator_1.some)(source_1.contentline, opener), (0, combinator_1.convert)(unindent, (0, combinator_1.fmap)((0, combinator_1.some)(autolink_1.autolink), ns => [(0, dom_1.html)('pre', (0, dom_1.defrag)(ns))])))
            ]))), ns => [(0, dom_1.html)('blockquote', ns)]));
            const markdown = (0, combinator_1.lazy)(() => (0, combinator_1.fmap)((0, combinator_1.some)((0, combinator_1.creator)((0, combinator_1.union)([
                (0, combinator_1.rewrite)(indent, (0, combinator_1.convert)(unindent, markdown)),
                (0, combinator_1.creator)(99, (0, combinator_1.rewrite)((0, combinator_1.some)(source_1.contentline, opener), (0, combinator_1.convert)(unindent, (source, context) => {
                    const annotations = (0, dom_1.html)('ol', { class: 'annotations' });
                    const references = (0, dom_1.html)('ol', { class: 'references' });
                    const document = (0, parse_1.parse)(source, {
                        id: '',
                        footnotes: {
                            annotations,
                            references
                        }
                    }, context);
                    return [
                        [(0, dom_1.html)('section', [
                                document,
                                annotations,
                                references
                            ])],
                        ''
                    ];
                })))
            ]))), ns => [(0, dom_1.html)('blockquote', ns)]));
        },
        {
            '../../combinator': 25,
            '../api/parse': 59,
            '../autolink': 60,
            '../source': 128,
            'typed-dom/dom': 23
        }
    ],
    63: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.codeblock = exports.segment_ = exports.segment = void 0;
            const global_1 = _dereq_('spica/global');
            const parser_1 = _dereq_('../../combinator/data/parser');
            const combinator_1 = _dereq_('../../combinator');
            const autolink_1 = _dereq_('../autolink');
            const dom_1 = _dereq_('typed-dom/dom');
            const opener = /^(`{3,})(?!`)([^\n]*)(?:$|\n)/;
            const language = /^[0-9a-z]+(?:-[a-z][0-9a-z]*)*$/i;
            exports.segment = (0, combinator_1.block)((0, combinator_1.validate)('```', (0, combinator_1.clear)((0, combinator_1.fence)(opener, 300))));
            exports.segment_ = (0, combinator_1.block)((0, combinator_1.validate)('```', (0, combinator_1.clear)((0, combinator_1.fence)(opener, 300, false))), false);
            exports.codeblock = (0, combinator_1.block)((0, combinator_1.validate)('```', (0, combinator_1.fmap)((0, combinator_1.fence)(opener, 300), ([body, closer, opener, delim, param], _, context) => {
                var _a, _b, _c, _d, _e, _f;
                const params = (_b = (_a = param.match(/(?:\\.?|\S)+/g)) === null || _a === void 0 ? void 0 : _a.reduce((params, value, i) => {
                    var _a, _b, _c;
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
                            const file = (_a = value.split('/').pop()) !== null && _a !== void 0 ? _a : '';
                            params.lang = file && file.includes('.', 1) ? (_c = (_b = file.split('.').pop()) === null || _b === void 0 ? void 0 : _b.match(language)) === null || _c === void 0 ? void 0 : _c[0].toLowerCase() : params.lang;
                        }
                    }
                    name in params ? params.invalid = `Duplicate ${ name } value` : params[name] = value;
                    return params;
                }, {})) !== null && _b !== void 0 ? _b : {};
                if (!closer || params.invalid)
                    return [(0, dom_1.html)('pre', {
                            class: 'invalid',
                            translate: 'no',
                            'data-invalid-syntax': 'codeblock',
                            'data-invalid-type': !closer ? 'fence' : 'argument',
                            'data-invalid-message': !closer ? `Missing the closing delimiter "${ delim }"` : params.invalid
                        }, `${ opener }${ body }${ closer }`)];
                const el = (0, dom_1.html)('pre', {
                    class: params.lang ? `code language-${ params.lang }` : 'text',
                    translate: params.lang ? 'no' : global_1.undefined,
                    'data-lang': params.lang || global_1.undefined,
                    'data-line': params.line || global_1.undefined,
                    'data-path': params.path || global_1.undefined
                }, params.lang ? ((_f = (_d = (_c = context.caches) === null || _c === void 0 ? void 0 : _c.code) === null || _d === void 0 ? void 0 : _d.get(`${ (_e = params.lang) !== null && _e !== void 0 ? _e : '' }\n${ body.slice(0, -1) }`)) === null || _f === void 0 ? void 0 : _f.cloneNode(true).childNodes) || body.slice(0, -1) || global_1.undefined : (0, dom_1.defrag)((0, parser_1.eval)((0, combinator_1.some)(autolink_1.autolink)(body.slice(0, -1), context), [])));
                return [el];
            })));
        },
        {
            '../../combinator': 25,
            '../../combinator/data/parser': 45,
            '../autolink': 60,
            'spica/global': 13,
            'typed-dom/dom': 23
        }
    ],
    64: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.dlist = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const inline_1 = _dereq_('../inline');
            const source_1 = _dereq_('../source');
            const locale_1 = _dereq_('../locale');
            const util_1 = _dereq_('../util');
            const dom_1 = _dereq_('typed-dom/dom');
            const array_1 = _dereq_('spica/array');
            exports.dlist = (0, combinator_1.lazy)(() => (0, combinator_1.block)((0, locale_1.localize)((0, combinator_1.fmap)((0, combinator_1.validate)(/^~[^\S\n]+(?=\S)/, (0, combinator_1.some)((0, combinator_1.inits)([
                (0, combinator_1.context)({
                    syntax: {
                        inline: {
                            annotation: false,
                            reference: false,
                            index: false,
                            label: false,
                            link: false,
                            media: false
                        }
                    }
                }, (0, combinator_1.some)(term)),
                (0, combinator_1.some)(desc)
            ]))), es => [(0, dom_1.html)('dl', fillTrailingDescription(es))]))));
            const term = (0, combinator_1.creator)((0, combinator_1.line)((0, inline_1.indexee)((0, combinator_1.fmap)((0, combinator_1.open)(/^~[^\S\n]+(?=\S)/, (0, combinator_1.trim)((0, util_1.visualize)((0, combinator_1.some)((0, combinator_1.union)([
                inline_1.indexer,
                inline_1.inline
            ])))), true), ns => [(0, dom_1.html)('dt', (0, dom_1.defrag)(ns))]))));
            const desc = (0, combinator_1.creator)((0, combinator_1.block)((0, combinator_1.fmap)((0, combinator_1.open)(/^:[^\S\n]+(?=\S)|/, (0, combinator_1.rewrite)((0, combinator_1.some)(source_1.anyline, /^[~:][^\S\n]+\S/), (0, combinator_1.trim)((0, util_1.visualize)((0, combinator_1.some)((0, combinator_1.union)([inline_1.inline]))))), true), ns => [(0, dom_1.html)('dd', (0, dom_1.defrag)(ns))]), false));
            function fillTrailingDescription(es) {
                return es.length > 0 && es[es.length - 1].tagName === 'DT' ? (0, array_1.push)(es, [(0, dom_1.html)('dd')]) : es;
            }
        },
        {
            '../../combinator': 25,
            '../inline': 88,
            '../locale': 123,
            '../source': 128,
            '../util': 134,
            'spica/array': 6,
            'typed-dom/dom': 23
        }
    ],
    65: [
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
            ], (0, combinator_1.validate)(/^~{3,}|^\[?\$[A-Za-z-]\S+[^\S\n]*(?:$|\n)/, (0, combinator_1.union)([
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
            '../../combinator': 25,
            './extension/aside': 66,
            './extension/example': 67,
            './extension/fig': 68,
            './extension/figbase': 69,
            './extension/figure': 70,
            './extension/message': 71,
            './extension/placeholder': 72,
            './extension/table': 73
        }
    ],
    66: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.aside = void 0;
            const combinator_1 = _dereq_('../../../combinator');
            const indexee_1 = _dereq_('../../inline/extension/indexee');
            const parse_1 = _dereq_('../../api/parse');
            const dom_1 = _dereq_('typed-dom/dom');
            exports.aside = (0, combinator_1.creator)(100, (0, combinator_1.block)((0, combinator_1.validate)('~~~', (0, combinator_1.fmap)((0, combinator_1.fence)(/^(~{3,})aside(?!\S)([^\n]*)(?:$|\n)/, 300), ([body, closer, opener, delim, param], _, context) => {
                var _a;
                if (!closer || param.trimStart())
                    return [(0, dom_1.html)('pre', {
                            class: 'invalid',
                            translate: 'no',
                            'data-invalid-syntax': 'aside',
                            'data-invalid-type': !closer ? 'fence' : 'argument',
                            'data-invalid-message': !closer ? `Missing the closing delimiter "${ delim }"` : 'Invalid argument'
                        }, `${ opener }${ body }${ closer }`)];
                const annotations = (0, dom_1.html)('ol', { class: 'annotations' });
                const references = (0, dom_1.html)('ol', { class: 'references' });
                const document = (0, parse_1.parse)(body.slice(0, -1), {
                    id: '',
                    footnotes: {
                        annotations,
                        references
                    }
                }, context);
                const heading = 'H1 H2 H3 H4 H5 H6'.split(' ').includes((_a = document.firstElementChild) === null || _a === void 0 ? void 0 : _a.tagName) && document.firstElementChild;
                if (!heading)
                    return [(0, dom_1.html)('pre', {
                            class: 'invalid',
                            translate: 'no',
                            'data-invalid-syntax': 'aside',
                            'data-invalid-type': 'content',
                            'data-invalid-message': 'Missing the title at the first line'
                        }, `${ opener }${ body }${ closer }`)];
                return [(0, dom_1.html)('aside', {
                        id: (0, indexee_1.identity)((0, indexee_1.text)(heading)),
                        class: 'aside'
                    }, [
                        document,
                        annotations,
                        references
                    ])];
            }))));
        },
        {
            '../../../combinator': 25,
            '../../api/parse': 59,
            '../../inline/extension/indexee': 107,
            'typed-dom/dom': 23
        }
    ],
    67: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.example = void 0;
            const parser_1 = _dereq_('../../../combinator/data/parser');
            const combinator_1 = _dereq_('../../../combinator');
            const parse_1 = _dereq_('../../api/parse');
            const mathblock_1 = _dereq_('../mathblock');
            const dom_1 = _dereq_('typed-dom/dom');
            const opener = /^(~{3,})(?:example\/(\S+))?(?!\S)([^\n]*)(?:$|\n)/;
            exports.example = (0, combinator_1.creator)(100, (0, combinator_1.block)((0, combinator_1.validate)('~~~', (0, combinator_1.fmap)((0, combinator_1.fence)(opener, 300), ([body, closer, opener, delim, type = 'markdown', param], _, context) => {
                if (!closer || param.trimStart())
                    return [(0, dom_1.html)('pre', {
                            class: 'invalid',
                            translate: 'no',
                            'data-invalid-syntax': 'example',
                            'data-invalid-type': !closer ? 'fence' : 'argument',
                            'data-invalid-message': !closer ? `Missing the closing delimiter "${ delim }"` : 'Invalid argument'
                        }, `${ opener }${ body }${ closer }`)];
                switch (type) {
                case 'markdown': {
                        const annotations = (0, dom_1.html)('ol', { class: 'annotations' });
                        const references = (0, dom_1.html)('ol', { class: 'references' });
                        const document = (0, parse_1.parse)(body.slice(0, -1), {
                            id: '',
                            footnotes: {
                                annotations,
                                references
                            }
                        }, context);
                        return [(0, dom_1.html)('aside', {
                                class: 'example',
                                'data-type': 'markdown'
                            }, [
                                (0, dom_1.html)('pre', { translate: 'no' }, body.slice(0, -1)),
                                (0, dom_1.html)('hr'),
                                (0, dom_1.html)('section', [
                                    document,
                                    annotations,
                                    references
                                ])
                            ])];
                    }
                case 'math':
                    return [(0, dom_1.html)('aside', {
                            class: 'example',
                            'data-type': 'math'
                        }, [
                            (0, dom_1.html)('pre', { translate: 'no' }, body.slice(0, -1)),
                            (0, dom_1.html)('hr'),
                            (0, parser_1.eval)((0, mathblock_1.mathblock)(`$$\n${ body }$$`, context), [])[0]
                        ])];
                default:
                    return [(0, dom_1.html)('pre', {
                            class: 'invalid',
                            translate: 'no',
                            'data-invalid-syntax': 'example',
                            'data-invalid-message': 'Invalid example type'
                        }, `${ opener }${ body }${ closer }`)];
                }
            }))));
        },
        {
            '../../../combinator': 25,
            '../../../combinator/data/parser': 45,
            '../../api/parse': 59,
            '../mathblock': 78,
            'typed-dom/dom': 23
        }
    ],
    68: [
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
            const table_1 = _dereq_('./table');
            const blockquote_1 = _dereq_('../blockquote');
            const placeholder_1 = _dereq_('./placeholder');
            exports.segment = (0, combinator_1.block)((0, combinator_1.validate)([
                '[$',
                '$'
            ], (0, combinator_1.sequence)([
                (0, combinator_1.line)((0, combinator_1.close)(label_1.segment, /^(?=\s).*\n/)),
                (0, combinator_1.union)([
                    codeblock_1.segment,
                    mathblock_1.segment,
                    table_1.segment,
                    blockquote_1.segment,
                    placeholder_1.segment,
                    (0, combinator_1.some)(source_1.contentline)
                ])
            ])));
            exports.fig = (0, combinator_1.block)((0, combinator_1.rewrite)(exports.segment, (0, combinator_1.verify)((0, combinator_1.convert)(source => {
                const fence = (/^[^\n]*\n!?>+\s/.test(source) && source.match(/^~{3,}(?=[^\S\n]*$)/mg) || []).reduce((max, fence) => fence > max ? fence : max, '~~') + '~';
                return `${ fence }figure ${ source }\n\n${ fence }`;
            }, (0, combinator_1.union)([figure_1.figure])), ([el]) => el.tagName === 'FIGURE')));
        },
        {
            '../../../combinator': 25,
            '../../inline/extension/label': 109,
            '../../source': 128,
            '../blockquote': 62,
            '../codeblock': 63,
            '../mathblock': 78,
            './figure': 70,
            './placeholder': 72,
            './table': 73
        }
    ],
    69: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.figbase = void 0;
            const combinator_1 = _dereq_('../../../combinator');
            const label_1 = _dereq_('../../inline/extension/label');
            const dom_1 = _dereq_('typed-dom/dom');
            exports.figbase = (0, combinator_1.block)((0, combinator_1.fmap)((0, combinator_1.validate)(/^\[?\$-(?:[0-9]+\.)*0\]?[^\S\n]*(?!\S|\n[^\S\n]*\S)/, (0, combinator_1.line)((0, combinator_1.union)([label_1.label]))), ([el]) => {
                const label = el.getAttribute('data-label');
                const group = label.split('-', 1)[0];
                return [(0, dom_1.html)('figure', {
                        'data-label': label,
                        'data-group': group,
                        hidden: ''
                    })];
            }));
        },
        {
            '../../../combinator': 25,
            '../../inline/extension/label': 109,
            'typed-dom/dom': 23
        }
    ],
    70: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.figure = exports.segment = void 0;
            const global_1 = _dereq_('spica/global');
            const combinator_1 = _dereq_('../../../combinator');
            const source_1 = _dereq_('../../source');
            const label_1 = _dereq_('../../inline/extension/label');
            const ulist_1 = _dereq_('../ulist');
            const olist_1 = _dereq_('../olist');
            const table_1 = _dereq_('../table');
            const indentblock_1 = _dereq_('../indentblock');
            const codeblock_1 = _dereq_('../codeblock');
            const mathblock_1 = _dereq_('../mathblock');
            const example_1 = _dereq_('./example');
            const table_2 = _dereq_('./table');
            const blockquote_1 = _dereq_('../blockquote');
            const placeholder_1 = _dereq_('./placeholder');
            const inline_1 = _dereq_('../../inline');
            const locale_1 = _dereq_('../../locale');
            const util_1 = _dereq_('../../util');
            const dom_1 = _dereq_('typed-dom/dom');
            const memoize_1 = _dereq_('spica/memoize');
            const array_1 = _dereq_('spica/array');
            exports.segment = (0, combinator_1.block)((0, combinator_1.match)(/^(~{3,})(?:figure[^\S\n]|(?=\[?\$))/, (0, memoize_1.memoize)(([, fence], closer = new RegExp(String.raw`^${ fence }[^\S\n]*(?:$|\n)`)) => (0, combinator_1.close)((0, combinator_1.sequence)([
                source_1.contentline,
                (0, combinator_1.inits)([
                    (0, combinator_1.union)([
                        codeblock_1.segment_,
                        mathblock_1.segment_,
                        table_2.segment_,
                        blockquote_1.segment,
                        placeholder_1.segment_,
                        (0, combinator_1.some)(source_1.contentline, closer)
                    ]),
                    source_1.emptyline,
                    (0, combinator_1.union)([
                        source_1.emptyline,
                        (0, combinator_1.some)(source_1.contentline, closer)
                    ])
                ])
            ]), closer), ([, fence]) => fence.length, [])));
            exports.figure = (0, combinator_1.block)((0, combinator_1.fallback)((0, combinator_1.rewrite)(exports.segment, (0, combinator_1.fmap)((0, combinator_1.convert)(source => source.slice(source.match(/^~+(?:figure[^\S\n]+)?/)[0].length, source.trimEnd().lastIndexOf('\n')), (0, combinator_1.sequence)([
                (0, combinator_1.line)((0, combinator_1.sequence)([
                    label_1.label,
                    (0, source_1.str)(/^(?=\s).*\n/)
                ])),
                (0, combinator_1.inits)([
                    (0, combinator_1.block)((0, combinator_1.union)([
                        ulist_1.ulist,
                        olist_1.olist,
                        table_1.table,
                        indentblock_1.indentblock,
                        codeblock_1.codeblock,
                        mathblock_1.mathblock,
                        example_1.example,
                        table_2.table,
                        blockquote_1.blockquote,
                        placeholder_1.placeholder,
                        (0, combinator_1.line)(inline_1.media),
                        (0, combinator_1.line)(inline_1.shortmedia)
                    ])),
                    source_1.emptyline,
                    (0, combinator_1.block)((0, locale_1.localize)((0, combinator_1.context)({ syntax: { inline: { media: false } } }, (0, combinator_1.trim)((0, util_1.visualize)((0, combinator_1.some)(inline_1.inline))))))
                ])
            ])), ([label, param, content, ...caption]) => [(0, dom_1.html)('figure', attributes(label.getAttribute('data-label'), param, content, caption), [
                    (0, dom_1.html)('figcaption', (0, array_1.unshift)([(0, dom_1.html)('span', { class: 'figindex' })], (0, dom_1.defrag)(caption))),
                    (0, dom_1.html)('div', [content])
                ])])), (0, combinator_1.fmap)((0, combinator_1.fence)(/^(~{3,})(?:figure|\[?\$\S*)(?!\S)[^\n]*(?:$|\n)/, 300), ([body, closer, opener, delim], _, context) => {
                var _a, _b;
                return [(0, dom_1.html)('pre', {
                        class: 'invalid',
                        translate: 'no',
                        'data-invalid-syntax': 'figure',
                        ...!closer && {
                            'data-invalid-type': 'fence',
                            'data-invalid-message': `Missing the closing delimiter "${ delim }"`
                        } || !(0, label_1.segment)((_b = (_a = opener.match(/^~+(?:figure[^\S\n]+)?(\[?\$\S+)/)) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : '', context) && {
                            'data-invalid-type': 'label',
                            'data-invalid-message': 'Invalid label'
                        } || /^~+(?:figure[^\S\n]+)?(\[?\$\S+)[^\S\n]+\S/.test(opener) && {
                            'data-invalid-type': 'argument',
                            'data-invalid-message': 'Invalid argument'
                        } || {
                            'data-invalid-type': 'content',
                            'data-invalid-message': 'Invalid content'
                        }
                    }, `${ opener }${ body }${ closer }`)];
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
                const invalid = param.trimStart() !== '' && {
                    'data-invalid-type': 'argument',
                    'data-invalid-message': 'Invalid argument'
                } || /^[^-]+-(?:[0-9]+\.)*0$/.test(label) && {
                    'data-invalid-type': 'label',
                    'data-invalid-message': 'The last part of the fixed label numbers must not be 0'
                } || group === '$' && (type !== 'math' || caption.length > 0) && {
                    'data-invalid-type': 'label',
                    'data-invalid-message': '"$" label group must be used to math formulas with no caption'
                } || type === 'media' && {} || [
                    'fig',
                    'figure'
                ].includes(group) && {
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
                    ...(invalid === null || invalid === void 0 ? void 0 : invalid['data-invalid-type']) && {
                        class: 'invalid',
                        'data-invalid-syntax': 'figure',
                        ...invalid
                    }
                };
            }
        },
        {
            '../../../combinator': 25,
            '../../inline': 88,
            '../../inline/extension/label': 109,
            '../../locale': 123,
            '../../source': 128,
            '../../util': 134,
            '../blockquote': 62,
            '../codeblock': 63,
            '../indentblock': 77,
            '../mathblock': 78,
            '../olist': 79,
            '../table': 85,
            '../ulist': 86,
            './example': 67,
            './placeholder': 72,
            './table': 73,
            'spica/array': 6,
            'spica/global': 13,
            'spica/memoize': 16,
            'typed-dom/dom': 23
        }
    ],
    71: [
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
            const indentblock_1 = _dereq_('../indentblock');
            const codeblock_1 = _dereq_('../codeblock');
            const mathblock_1 = _dereq_('../mathblock');
            const sidefence_1 = _dereq_('../sidefence');
            const blockquote_1 = _dereq_('../blockquote');
            const paragraph_1 = _dereq_('../paragraph');
            const dom_1 = _dereq_('typed-dom/dom');
            const array_1 = _dereq_('spica/array');
            exports.message = (0, combinator_1.block)((0, combinator_1.validate)('~~~', (0, combinator_1.fmap)((0, combinator_1.fence)(/^(~{3,})message\/(\S+)([^\n]*)(?:$|\n)/, 300), ([body, closer, opener, delim, type, param], _, context) => {
                if (!closer || param.trimStart())
                    return [(0, dom_1.html)('pre', {
                            class: 'invalid',
                            translate: 'no',
                            'data-invalid-syntax': 'message',
                            'data-invalid-type': !closer ? 'fence' : 'argument',
                            'data-invalid-message': !closer ? `Missing the closing delimiter "${ delim }"` : 'Invalid argument'
                        }, `${ opener }${ body }${ closer }`)];
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
                            'data-invalid-message': 'Invalid message type'
                        }, `${ opener }${ body }${ closer }`)];
                }
                return [(0, dom_1.html)('div', {
                        class: `message`,
                        'data-type': type
                    }, (0, array_1.unshift)([(0, dom_1.html)('h6', title(type))], [...(0, segment_1.segment)(body)].reduce((acc, seg) => (0, array_1.push)(acc, (0, parser_1.eval)(content(seg, context), [])), [])))];
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
                indentblock_1.indentblock,
                codeblock_1.codeblock,
                mathblock_1.mathblock,
                sidefence_1.sidefence,
                blockquote_1.blockquote,
                paragraph_1.paragraph
            ]);
        },
        {
            '../../../combinator': 25,
            '../../../combinator/data/parser': 45,
            '../../segment': 127,
            '../../source': 128,
            '../blockquote': 62,
            '../codeblock': 63,
            '../ilist': 76,
            '../indentblock': 77,
            '../mathblock': 78,
            '../olist': 79,
            '../paragraph': 80,
            '../sidefence': 84,
            '../table': 85,
            '../ulist': 86,
            'spica/array': 6,
            'typed-dom/dom': 23
        }
    ],
    72: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.placeholder = exports.segment_ = exports.segment = void 0;
            const combinator_1 = _dereq_('../../../combinator');
            const dom_1 = _dereq_('typed-dom/dom');
            const opener = /^(~{3,})(?!~)[^\n]*(?:$|\n)/;
            exports.segment = (0, combinator_1.block)((0, combinator_1.validate)('~~~', (0, combinator_1.clear)((0, combinator_1.fence)(opener, 300))));
            exports.segment_ = (0, combinator_1.block)((0, combinator_1.validate)('~~~', (0, combinator_1.clear)((0, combinator_1.fence)(opener, 300, false))), false);
            exports.placeholder = (0, combinator_1.block)((0, combinator_1.validate)('~~~', (0, combinator_1.fmap)((0, combinator_1.fence)(opener, Infinity), ([body, closer, opener, delim]) => [(0, dom_1.html)('pre', {
                    class: 'invalid',
                    translate: 'no',
                    'data-invalid-syntax': 'extension',
                    'data-invalid-type': !closer ? 'fence' : 'syntax',
                    'data-invalid-message': !closer ? `Missing the closing delimiter "${ delim }"` : 'Invalid extension name'
                }, `${ opener }${ body }${ closer }`)])));
        },
        {
            '../../../combinator': 25,
            'typed-dom/dom': 23
        }
    ],
    73: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.table = exports.segment_ = exports.segment = void 0;
            const global_1 = _dereq_('spica/global');
            const alias_1 = _dereq_('spica/alias');
            const parser_1 = _dereq_('../../../combinator/data/parser');
            const combinator_1 = _dereq_('../../../combinator');
            const inline_1 = _dereq_('../../inline');
            const source_1 = _dereq_('../../source');
            const locale_1 = _dereq_('../../locale');
            const util_1 = _dereq_('../../util');
            const dom_1 = _dereq_('typed-dom/dom');
            const array_1 = _dereq_('spica/array');
            const opener = /^(~{3,})table(?!\S)([^\n]*)(?:$|\n)/;
            exports.segment = (0, combinator_1.block)((0, combinator_1.validate)('~~~', (0, combinator_1.clear)((0, combinator_1.fence)(opener, 10000))));
            exports.segment_ = (0, combinator_1.block)((0, combinator_1.validate)('~~~', (0, combinator_1.clear)((0, combinator_1.fence)(opener, 10000, false))), false);
            exports.table = (0, combinator_1.block)((0, combinator_1.validate)('~~~', (0, combinator_1.recover)((0, combinator_1.fmap)((0, combinator_1.fence)(opener, 10000), ([body, closer, opener, delim, param], _, context) => {
                var _a;
                if (!closer || param.trimStart())
                    return [(0, dom_1.html)('pre', {
                            class: 'invalid',
                            translate: 'no',
                            'data-invalid-syntax': 'table',
                            'data-invalid-type': !closer ? 'fence' : 'argument',
                            'data-invalid-message': !closer ? `Missing the closing delimiter "${ delim }"` : 'Invalid argument'
                        }, `${ opener }${ body }${ closer }`)];
                return (_a = (0, parser_1.eval)(parser(body, context))) !== null && _a !== void 0 ? _a : [(0, dom_1.html)('table')];
            }), (source, _, reason) => reason instanceof Error && reason.message === 'Number of columns must be 32 or less' ? [
                [(0, dom_1.html)('pre', {
                        class: 'invalid',
                        translate: 'no',
                        'data-invalid-syntax': 'table',
                        'data-invalid-type': 'content',
                        'data-invalid-message': reason.message
                    }, source)],
                ''
            ] : (() => {
                throw reason;
            })())));
            const parser = (0, combinator_1.lazy)(() => (0, combinator_1.block)((0, locale_1.localize)((0, combinator_1.fmap)((0, combinator_1.some)((0, combinator_1.union)([row])), rows => [(0, dom_1.html)('table', format(rows))]))));
            const row = (0, combinator_1.lazy)(() => (0, combinator_1.dup)((0, combinator_1.fmap)((0, combinator_1.subsequence)([
                (0, combinator_1.dup)((0, combinator_1.union)([align])),
                (0, combinator_1.some)((0, combinator_1.union)([
                    head,
                    data,
                    (0, combinator_1.some)(dataline, alignment),
                    source_1.emptyline
                ]))
            ]), ns => !(0, alias_1.isArray)(ns[0]) ? (0, array_1.unshift)([[[]]], ns) : ns)));
            const alignment = /^[-=<>]+(?:\/[-=^v]*)?(?=[^\S\n]*\n)/;
            const align = (0, combinator_1.line)((0, combinator_1.fmap)((0, combinator_1.union)([(0, source_1.str)(alignment)]), ([s]) => s.split('/').map(s => s.split(''))));
            const delimiter = /^[-=<>]+(?:\/[-=^v]*)?(?=[^\S\n]*\n)|^[#:](?:(?!:\D|0)\d*:(?!0)\d*)?!*(?=\s)/;
            const head = (0, combinator_1.creator)((0, combinator_1.block)((0, combinator_1.fmap)((0, combinator_1.open)((0, source_1.str)(/^#(?:(?!:\D|0)\d*:(?!0)\d*)?!*(?=\s)/), (0, combinator_1.rewrite)((0, combinator_1.inits)([
                source_1.anyline,
                (0, combinator_1.some)(source_1.contentline, delimiter)
            ]), (0, combinator_1.trim)((0, util_1.visualize)((0, combinator_1.some)((0, combinator_1.union)([inline_1.inline]))))), true), ns => [(0, dom_1.html)('th', attributes(ns.shift()), (0, dom_1.defrag)(ns))]), false));
            const data = (0, combinator_1.creator)((0, combinator_1.block)((0, combinator_1.fmap)((0, combinator_1.open)((0, source_1.str)(/^:(?:(?!:\D|0)\d*:(?!0)\d*)?!*(?=\s)/), (0, combinator_1.rewrite)((0, combinator_1.inits)([
                source_1.anyline,
                (0, combinator_1.some)(source_1.contentline, delimiter)
            ]), (0, combinator_1.trim)((0, util_1.visualize)((0, combinator_1.some)((0, combinator_1.union)([inline_1.inline]))))), true), ns => [(0, dom_1.html)('td', attributes(ns.shift()), (0, dom_1.defrag)(ns))]), false));
            const dataline = (0, combinator_1.creator)((0, combinator_1.line)((0, combinator_1.rewrite)(source_1.contentline, (0, combinator_1.union)([
                (0, combinator_1.validate)(/^!+\s/, (0, combinator_1.convert)(source => `:${ source }`, data)),
                (0, combinator_1.convert)(source => `: ${ source }`, data)
            ]))));
            function attributes(source) {
                var _a;
                let [, rowspan = global_1.undefined, colspan = global_1.undefined, highlight = global_1.undefined] = (_a = source.match(/^.(?:(\d+)?:(\d+)?)?(!+)?$/)) !== null && _a !== void 0 ? _a : [];
                rowspan === '1' ? rowspan = global_1.undefined : global_1.undefined;
                colspan === '1' ? colspan = global_1.undefined : global_1.undefined;
                rowspan && (rowspan = `${ (0, alias_1.max)(0, (0, alias_1.min)(+rowspan, 65534)) }`);
                colspan && (colspan = `${ (0, alias_1.max)(0, (0, alias_1.min)(+colspan, 1000)) }`);
                highlight && (highlight = highlight.length > 0 ? `${ highlight.length }` : global_1.undefined);
                const valid = !highlight || source[0] === '#' && +highlight <= 1 || source[0] === ':' && +highlight <= 6;
                return {
                    class: valid ? highlight && 'highlight' : 'invalid',
                    rowspan,
                    colspan,
                    ...valid ? { 'data-highlight-level': +highlight > 1 ? highlight : global_1.undefined } : {
                        'data-invalid-syntax': 'table',
                        'data-invalid-type': 'syntax',
                        'data-invalid-message': 'Too much highlight level'
                    }
                };
            }
            function format(rows) {
                var _a, _b, _c, _d, _e, _f;
                const thead = (0, dom_1.html)('thead');
                const tbody = (0, dom_1.html)('tbody');
                const tfoot = (0, dom_1.html)('tfoot');
                const aligns = [];
                const valigns = [];
                let target = thead;
                let ranges = {};
                let verticalHighlights = 0;
                ROW:
                    for (let i = 0; i < rows.length; ++i) {
                        const [[[...as], [...vs] = []], ...cells] = rows[i];
                        let isBody = target === tfoot ? false : global_1.undefined;
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
                        const row = (0, dom_1.html)('tr');
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
                            throw new Error('Number of columns must be 32 or less');
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
            '../../../combinator': 25,
            '../../../combinator/data/parser': 45,
            '../../inline': 88,
            '../../locale': 123,
            '../../source': 128,
            '../../util': 134,
            'spica/alias': 5,
            'spica/array': 6,
            'spica/global': 13,
            'typed-dom/dom': 23
        }
    ],
    74: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.heading = exports.segment = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const inline_1 = _dereq_('../inline');
            const source_1 = _dereq_('../source');
            const util_1 = _dereq_('../util');
            const dom_1 = _dereq_('typed-dom/dom');
            exports.segment = (0, combinator_1.block)((0, combinator_1.validate)('#', (0, combinator_1.focus)(/^#+[^\S\n]+\S[^\n]*(?:\n#+(?!\S)[^\n]*)*(?:$|\n)/, (0, combinator_1.some)((0, combinator_1.line)(source => [
                [source],
                ''
            ])))));
            exports.heading = (0, combinator_1.block)((0, combinator_1.rewrite)(exports.segment, (0, combinator_1.context)({
                syntax: {
                    inline: {
                        annotation: false,
                        reference: false,
                        index: false,
                        label: false,
                        link: false,
                        media: false
                    }
                }
            }, (0, combinator_1.line)((0, inline_1.indexee)((0, combinator_1.fmap)((0, combinator_1.union)([
                (0, combinator_1.open)((0, source_1.str)(/^##+/), (0, combinator_1.trim)((0, util_1.visualize)((0, combinator_1.some)((0, combinator_1.union)([
                    inline_1.indexer,
                    inline_1.inline
                ])))), true),
                (0, combinator_1.open)((0, source_1.str)('#'), (0, combinator_1.context)({ syntax: { inline: { autolink: false } } }, (0, combinator_1.trim)((0, util_1.visualize)((0, combinator_1.some)((0, combinator_1.union)([
                    inline_1.indexer,
                    inline_1.inline
                ]))))), true)
            ]), ([h, ...ns]) => [h.length <= 6 ? (0, dom_1.html)(`h${ h.length }`, (0, dom_1.defrag)(ns)) : (0, dom_1.html)(`h6`, {
                    class: 'invalid',
                    'data-invalid-syntax': 'heading',
                    'data-invalid-type': 'syntax',
                    'data-invalid-message': 'Heading level must be up to 6'
                }, (0, dom_1.defrag)(ns))]))))));
        },
        {
            '../../combinator': 25,
            '../inline': 88,
            '../source': 128,
            '../util': 134,
            'typed-dom/dom': 23
        }
    ],
    75: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.horizontalrule = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const dom_1 = _dereq_('typed-dom/dom');
            exports.horizontalrule = (0, combinator_1.block)((0, combinator_1.line)((0, combinator_1.focus)(/^-{3,}[^\S\n]*(?:$|\n)/, () => [
                [(0, dom_1.html)('hr')],
                ''
            ])));
        },
        {
            '../../combinator': 25,
            'typed-dom/dom': 23
        }
    ],
    76: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.ilist_ = exports.ilist = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const ulist_1 = _dereq_('./ulist');
            const olist_1 = _dereq_('./olist');
            const inline_1 = _dereq_('../inline');
            const source_1 = _dereq_('../source');
            const dom_1 = _dereq_('typed-dom/dom');
            exports.ilist = (0, combinator_1.lazy)(() => (0, combinator_1.block)((0, combinator_1.validate)(/^[-+*](?=[^\S\n]|\n[^\S\n]*\S)/, (0, combinator_1.context)({ syntax: { inline: { media: false } } }, exports.ilist_))));
            exports.ilist_ = (0, combinator_1.lazy)(() => (0, combinator_1.block)((0, combinator_1.fmap)((0, combinator_1.validate)(/^[-+*](?:$|\s)/, (0, combinator_1.some)((0, combinator_1.creator)((0, combinator_1.union)([(0, combinator_1.fmap)((0, combinator_1.fallback)((0, combinator_1.inits)([
                    (0, combinator_1.line)((0, combinator_1.open)(/^[-+*](?:$|\s)/, (0, combinator_1.trim)((0, combinator_1.some)(inline_1.inline)), true)),
                    (0, combinator_1.indent)((0, combinator_1.union)([
                        ulist_1.ulist_,
                        olist_1.olist_,
                        exports.ilist_
                    ]))
                ]), (0, combinator_1.rewrite)(source_1.contentline, source => [
                    [(0, dom_1.html)('span', source.replace('\n', ''))],
                    ''
                ])), ns => [(0, dom_1.html)('li', (0, dom_1.defrag)((0, ulist_1.fillFirstLine)(ns)))])])))), es => [(0, dom_1.html)('ul', {
                    class: 'invalid',
                    'data-invalid-syntax': 'list',
                    'data-invalid-type': 'syntax',
                    'data-invalid-message': 'Use "-" instead of "+" or "*"'
                }, es)])));
        },
        {
            '../../combinator': 25,
            '../inline': 88,
            '../source': 128,
            './olist': 79,
            './ulist': 86,
            'typed-dom/dom': 23
        }
    ],
    77: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.indentblock = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const codeblock_1 = _dereq_('./codeblock');
            exports.indentblock = (0, combinator_1.block)((0, combinator_1.validate)(/^(?:  |\t)/, (0, combinator_1.indent)((0, combinator_1.convert)(source => {
                var _a;
                const fence = ((_a = source.match(/^`{3,}(?=[^\S\n]*$)/mg)) !== null && _a !== void 0 ? _a : []).reduce((max, fence) => fence > max ? fence : max, '``') + '`';
                return `${ fence }\n${ source }\n${ fence }`;
            }, (0, combinator_1.union)([codeblock_1.codeblock])), true)));
        },
        {
            '../../combinator': 25,
            './codeblock': 63
        }
    ],
    78: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.mathblock = exports.segment_ = exports.segment = void 0;
            const global_1 = _dereq_('spica/global');
            const combinator_1 = _dereq_('../../combinator');
            const dom_1 = _dereq_('typed-dom/dom');
            const opener = /^(\${2,})(?!\$)([^\n]*)(?:$|\n)/;
            exports.segment = (0, combinator_1.block)((0, combinator_1.validate)('$$', (0, combinator_1.clear)((0, combinator_1.fence)(opener, 100))));
            exports.segment_ = (0, combinator_1.block)((0, combinator_1.validate)('$$', (0, combinator_1.clear)((0, combinator_1.fence)(opener, 100, false))), false);
            exports.mathblock = (0, combinator_1.block)((0, combinator_1.validate)('$$', (0, combinator_1.fmap)((0, combinator_1.fence)(opener, 100), ([body, closer, opener, delim, param], _, {
                caches: {
                    math: cache = global_1.undefined
                } = {}
            }) => {
                var _a;
                return [delim.length === 2 && closer && param.trimStart() === '' ? ((_a = cache === null || cache === void 0 ? void 0 : cache.get(`${ delim }\n${ body }${ delim }`)) === null || _a === void 0 ? void 0 : _a.cloneNode(true)) || (0, dom_1.html)('div', {
                        class: 'math',
                        translate: 'no'
                    }, `${ delim }\n${ body }${ delim }`) : (0, dom_1.html)('pre', {
                        class: 'invalid',
                        translate: 'no',
                        'data-invalid-syntax': 'mathblock',
                        'data-invalid-type': delim.length > 2 ? 'syntax' : !closer ? 'fence' : 'argument',
                        'data-invalid-message': delim.length > 2 ? 'Invalid syntax' : !closer ? `Missing the closing delimiter "${ delim }"` : 'Invalid argument'
                    }, `${ opener }${ body }${ closer }`)];
            })));
        },
        {
            '../../combinator': 25,
            'spica/global': 13,
            'typed-dom/dom': 23
        }
    ],
    79: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.olist_ = exports.olist = void 0;
            const global_1 = _dereq_('spica/global');
            const combinator_1 = _dereq_('../../combinator');
            const ulist_1 = _dereq_('./ulist');
            const ilist_1 = _dereq_('./ilist');
            const inline_1 = _dereq_('../inline');
            const source_1 = _dereq_('../source');
            const dom_1 = _dereq_('typed-dom/dom');
            const memoize_1 = _dereq_('spica/memoize');
            const array_1 = _dereq_('spica/array');
            const openers = {
                '.': /^(?:[0-9]+|[a-z]+|[A-Z]+)(?:-(?!-)[0-9]*)*(?![^\S\n])\.?(?=$|\s)/,
                '(': /^\((?:[0-9]*|[a-z]*)(?![^)\n])\)?(?:-(?!-)[0-9]*)*(?=$|\s)/
            };
            exports.olist = (0, combinator_1.lazy)(() => (0, combinator_1.block)((0, combinator_1.validate)([
                /^([0-9]+|[a-z]+|[A-Z]+)(?:-[0-9]+)*\.(?=[^\S\n]|\n[^\S\n]*\S)/,
                /^\(([0-9]+|[a-z]+)\)(?:-[0-9]+)*(?=[^\S\n]|\n[^\S\n]*\S)/
            ], (0, combinator_1.context)({ syntax: { inline: { media: false } } }, exports.olist_))));
            exports.olist_ = (0, combinator_1.lazy)(() => (0, combinator_1.block)((0, combinator_1.union)([
                (0, combinator_1.match)(new RegExp(`^(?=${ openers['.'].source.replace('?:', '') })`), (0, memoize_1.memoize)(ms => list(type(ms[1]), '.'), ms => type(ms[1]).charCodeAt(0) || 0, [])),
                (0, combinator_1.match)(new RegExp(`^(?=${ openers['('].source.replace('?:', '') })`), (0, memoize_1.memoize)(ms => list(type(ms[1]), '('), ms => type(ms[1]).charCodeAt(0) || 0, []))
            ])));
            const list = (type, form) => (0, combinator_1.fmap)((0, combinator_1.some)((0, combinator_1.creator)((0, combinator_1.union)([(0, inline_1.indexee)((0, combinator_1.fmap)((0, combinator_1.fallback)((0, combinator_1.inits)([
                    (0, combinator_1.line)((0, combinator_1.open)(heads[form], (0, combinator_1.trim)((0, combinator_1.subsequence)([
                        ulist_1.checkbox,
                        (0, combinator_1.trimStart)((0, combinator_1.some)((0, combinator_1.union)([
                            inline_1.indexer,
                            inline_1.inline
                        ])))
                    ])), true)),
                    (0, combinator_1.indent)((0, combinator_1.union)([
                        ulist_1.ulist_,
                        exports.olist_,
                        ilist_1.ilist_
                    ]))
                ]), invalid), ns => [(0, dom_1.html)('li', { 'data-marker': ns[0] }, (0, dom_1.defrag)((0, ulist_1.fillFirstLine)((0, array_1.shift)(ns)[1])))]), true)]))), es => [format((0, dom_1.html)('ol', es), type, form)]);
            const heads = {
                '.': (0, combinator_1.focus)(openers['.'], source => [
                    [`${ source.split('.', 1)[0] }.`],
                    ''
                ]),
                '(': (0, combinator_1.focus)(openers['('], source => [
                    [source.replace(/^\($/, '(1)').replace(/^\((\w+)$/, '($1)')],
                    ''
                ])
            };
            const invalid = (0, combinator_1.rewrite)(source_1.contentline, source => [
                [
                    '',
                    (0, dom_1.html)('span', {
                        class: 'invalid',
                        'data-invalid-syntax': 'listitem',
                        'data-invalid-type': 'syntax',
                        'data-invalid-message': 'Fix the indent or the head of the list item'
                    }, source.replace('\n', ''))
                ],
                ''
            ]);
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
                var _a, _b, _c, _d, _e;
                if ((_b = (_a = el.firstElementChild) === null || _a === void 0 ? void 0 : _a.firstElementChild) === null || _b === void 0 ? void 0 : _b.classList.contains('checkbox')) {
                    el.setAttribute('class', 'checklist');
                }
                (0, dom_1.define)(el, {
                    type: type || global_1.undefined,
                    'data-format': form === '.' ? global_1.undefined : 'paren',
                    'data-type': style(type) || global_1.undefined
                });
                const marker = (_e = (_d = (_c = el.firstElementChild) === null || _c === void 0 ? void 0 : _c.getAttribute('data-marker').match(initial(type))) === null || _d === void 0 ? void 0 : _d[0]) !== null && _e !== void 0 ? _e : '';
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
        },
        {
            '../../combinator': 25,
            '../inline': 88,
            '../source': 128,
            './ilist': 76,
            './ulist': 86,
            'spica/array': 6,
            'spica/global': 13,
            'spica/memoize': 16,
            'typed-dom/dom': 23
        }
    ],
    80: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.paragraph = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const inline_1 = _dereq_('../inline');
            const locale_1 = _dereq_('../locale');
            const util_1 = _dereq_('../util');
            const dom_1 = _dereq_('typed-dom/dom');
            exports.paragraph = (0, combinator_1.block)((0, locale_1.localize)((0, combinator_1.fmap)((0, combinator_1.trim)((0, util_1.visualize)((0, combinator_1.some)((0, combinator_1.union)([inline_1.inline])))), ns => [(0, dom_1.html)('p', (0, dom_1.defrag)(ns))])));
        },
        {
            '../../combinator': 25,
            '../inline': 88,
            '../locale': 123,
            '../util': 134,
            'typed-dom/dom': 23
        }
    ],
    81: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.reply = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const cite_1 = _dereq_('./reply/cite');
            const quote_1 = _dereq_('./reply/quote');
            const inline_1 = _dereq_('../inline');
            const source_1 = _dereq_('../source');
            const locale_1 = _dereq_('../locale');
            const util_1 = _dereq_('../util');
            const dom_1 = _dereq_('typed-dom/dom');
            const array_1 = _dereq_('spica/array');
            exports.reply = (0, combinator_1.block)((0, combinator_1.validate)('>', (0, locale_1.localize)((0, combinator_1.fmap)((0, combinator_1.inits)([
                (0, combinator_1.some)((0, combinator_1.inits)([
                    cite_1.cite,
                    quote_1.quote
                ])),
                (0, combinator_1.some)((0, combinator_1.subsequence)([
                    (0, combinator_1.some)(quote_1.quote),
                    (0, combinator_1.fmap)((0, combinator_1.rewrite)((0, combinator_1.some)(source_1.anyline, quote_1.syntax), (0, combinator_1.trim)((0, util_1.visualize)((0, combinator_1.some)(inline_1.inline)))), ns => (0, array_1.push)(ns, [(0, dom_1.html)('br')]))
                ]))
            ]), ns => [(0, dom_1.html)('p', (0, dom_1.defrag)((0, array_1.pop)(ns)[0]))]))));
        },
        {
            '../../combinator': 25,
            '../inline': 88,
            '../locale': 123,
            '../source': 128,
            '../util': 134,
            './reply/cite': 82,
            './reply/quote': 83,
            'spica/array': 6,
            'typed-dom/dom': 23
        }
    ],
    82: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.cite = void 0;
            const combinator_1 = _dereq_('../../../combinator');
            const anchor_1 = _dereq_('../../inline/autolink/anchor');
            const source_1 = _dereq_('../../source');
            const dom_1 = _dereq_('typed-dom/dom');
            exports.cite = (0, combinator_1.creator)((0, combinator_1.line)((0, combinator_1.fmap)((0, combinator_1.validate)('>>', (0, combinator_1.reverse)((0, combinator_1.tails)([
                (0, source_1.str)(/^>*(?=>>[^>\s]+[^\S\n]*(?:$|\n))/),
                (0, combinator_1.union)([
                    anchor_1.anchor,
                    (0, combinator_1.focus)(/^>>\.[^\S\n]*(?:$|\n)/, () => [
                        [(0, dom_1.html)('a', { class: 'anchor' }, '>>.')],
                        ''
                    ]),
                    (0, combinator_1.focus)(/^>>#\S*[^\S\n]*(?:$|\n)/, source => [
                        [(0, dom_1.html)('a', { class: 'anchor' }, source)],
                        ''
                    ])
                ])
            ]))), ([el, quotes = '']) => [
                (0, dom_1.html)('span', { class: 'cite' }, (0, dom_1.defrag)([
                    `${ quotes }>`,
                    (0, dom_1.define)(el, { 'data-depth': `${ quotes.length + 1 }` }, el.innerText.slice(1))
                ])),
                (0, dom_1.html)('br')
            ])));
        },
        {
            '../../../combinator': 25,
            '../../inline/autolink/anchor': 92,
            '../../source': 128,
            'typed-dom/dom': 23
        }
    ],
    83: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.quote = exports.syntax = void 0;
            const parser_1 = _dereq_('../../../combinator/data/parser');
            const combinator_1 = _dereq_('../../../combinator');
            const math_1 = _dereq_('../../inline/math');
            const source_1 = _dereq_('../../source');
            const autolink_1 = _dereq_('../../autolink');
            const dom_1 = _dereq_('typed-dom/dom');
            exports.syntax = /^>+(?=[^\S\n])|^>(?=[^\s>])|^>+(?=[^\s>])(?![0-9a-z]+(?:-[0-9a-z]+)*(?![0-9A-Za-z@#:]))/;
            exports.quote = (0, combinator_1.lazy)(() => (0, combinator_1.creator)((0, combinator_1.block)((0, combinator_1.fmap)((0, combinator_1.validate)('>', (0, combinator_1.union)([
                (0, combinator_1.rewrite)((0, combinator_1.some)((0, combinator_1.validate)(new RegExp(exports.syntax.source.split('|')[0]), source_1.anyline)), qblock),
                (0, combinator_1.rewrite)((0, combinator_1.validate)(new RegExp(exports.syntax.source.split('|').slice(1).join('|')), source_1.anyline), (0, combinator_1.line)((0, combinator_1.union)([(0, source_1.str)(/^.+/)])))
            ])), ns => [
                (0, dom_1.html)('span', ns.length > 1 ? { class: 'quote' } : {
                    class: 'quote invalid',
                    'data-invalid-syntax': 'quote',
                    'data-invalid-type': 'syntax',
                    'data-invalid-message': `Missing the whitespace after "${ ns[0].split(/[^>]/, 1)[0] }"`
                }, (0, dom_1.defrag)(ns)),
                (0, dom_1.html)('br')
            ]), false)));
            const qblock = (source, context) => {
                source = source.replace(/\n$/, '');
                const lines = source.match(/^.*\n?/mg);
                const quotes = source.match(/^>+[^\S\n]/mg);
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
                    if (child.classList.contains('cite') || child.classList.contains('quote')) {
                        context.resources && (context.resources.budget -= child.childNodes.length);
                        nodes.splice(i, 1, ...child.childNodes);
                        --i;
                        continue;
                    }
                }
                nodes.unshift('');
                return [
                    nodes,
                    ''
                ];
            };
            const text = (0, combinator_1.union)([
                math_1.math,
                autolink_1.autolink
            ]);
        },
        {
            '../../../combinator': 25,
            '../../../combinator/data/parser': 45,
            '../../autolink': 60,
            '../../inline/math': 116,
            '../../source': 128,
            'typed-dom/dom': 23
        }
    ],
    84: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.sidefence = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const autolink_1 = _dereq_('../autolink');
            const source_1 = _dereq_('../source');
            const dom_1 = _dereq_('typed-dom/dom');
            exports.sidefence = (0, combinator_1.lazy)(() => (0, combinator_1.block)((0, combinator_1.fmap)((0, combinator_1.focus)(/^(?=\|+(?:[^\S\n]|\n\|))(?:\|+(?:[^\S\n][^\n]*)?(?:$|\n))+$/, (0, combinator_1.union)([source])), ([el]) => [(0, dom_1.define)(el, {
                    class: 'invalid',
                    'data-invalid-syntax': 'sidefence',
                    'data-invalid-type': 'syntax',
                    'data-invalid-message': 'Reserved syntax'
                })])));
            const opener = /^(?=\|\|+(?:$|\s))/;
            const unindent = source => source.replace(/(^|\n)\|(?:[^\S\n]|(?=\|*(?:$|\s)))|\n$/g, '$1');
            const source = (0, combinator_1.lazy)(() => (0, combinator_1.fmap)((0, combinator_1.some)((0, combinator_1.creator)((0, combinator_1.union)([
                (0, combinator_1.focus)(/^(?:\|\|+(?:[^\S\n][^\n]*)?(?:$|\n))+/, (0, combinator_1.convert)(unindent, source)),
                (0, combinator_1.rewrite)((0, combinator_1.some)(source_1.contentline, opener), (0, combinator_1.convert)(unindent, (0, combinator_1.fmap)((0, combinator_1.some)(autolink_1.autolink), ns => [(0, dom_1.html)('pre', (0, dom_1.defrag)(ns))])))
            ]))), ns => [(0, dom_1.html)('blockquote', ns)]));
        },
        {
            '../../combinator': 25,
            '../autolink': 60,
            '../source': 128,
            'typed-dom/dom': 23
        }
    ],
    85: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.table = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const inline_1 = _dereq_('../inline');
            const source_1 = _dereq_('../source');
            const dom_1 = _dereq_('typed-dom/dom');
            const array_1 = _dereq_('spica/array');
            exports.table = (0, combinator_1.lazy)(() => (0, combinator_1.block)((0, combinator_1.fmap)((0, combinator_1.validate)(/^\|[^\n]*(?:\n\|[^\n]*){2}/, (0, combinator_1.sequence)([
                row((0, combinator_1.some)(head), true),
                row((0, combinator_1.some)(align), false),
                (0, combinator_1.some)(row((0, combinator_1.some)(data), true))
            ])), rows => [(0, dom_1.html)('table', [
                    (0, dom_1.html)('thead', [rows.shift()]),
                    (0, dom_1.html)('tbody', format(rows))
                ])])));
            const row = (parser, optional) => (0, combinator_1.creator)((0, combinator_1.fallback)((0, combinator_1.fmap)((0, combinator_1.line)((0, combinator_1.surround)(/^(?=\|)/, (0, combinator_1.some)((0, combinator_1.union)([parser])), /^\|?\s*$/, optional)), es => [(0, dom_1.html)('tr', es)]), (0, combinator_1.rewrite)(source_1.contentline, source => [
                [(0, dom_1.html)('tr', {
                        class: 'invalid',
                        'data-invalid-syntax': 'table-row',
                        'data-invalid-type': 'syntax',
                        'data-invalid-message': 'Missing the start symbol of the table row'
                    }, [(0, dom_1.html)('td', source.replace('\n', ''))])],
                ''
            ])));
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
            ])), ns => [(0, dom_1.html)('td', (0, dom_1.defrag)(ns))]));
            const cell = (0, combinator_1.surround)(/^\|(?:\\?\s)*(?=\S)/, (0, combinator_1.some)((0, combinator_1.union)([inline_1.inline]), /^(?:\\?\s)*(?=\||\\?$)/), /^[^|]*/, true);
            const head = (0, combinator_1.creator)((0, combinator_1.fmap)(cell, ns => [(0, dom_1.html)('th', (0, dom_1.defrag)(ns))]));
            const data = (0, combinator_1.creator)((0, combinator_1.fmap)(cell, ns => [(0, dom_1.html)('td', (0, dom_1.defrag)(ns))]));
            function format(rows) {
                const aligns = rows[0].classList.contains('invalid') ? [] : (0, array_1.push)([], rows.shift().children).map(el => el.textContent);
                for (let i = 0, len = rows.length; i < len; ++i) {
                    const cols = rows[i].children;
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
            '../../combinator': 25,
            '../inline': 88,
            '../source': 128,
            'spica/array': 6,
            'typed-dom/dom': 23
        }
    ],
    86: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.fillFirstLine = exports.checkbox = exports.ulist_ = exports.ulist = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const olist_1 = _dereq_('./olist');
            const ilist_1 = _dereq_('./ilist');
            const inline_1 = _dereq_('../inline');
            const dom_1 = _dereq_('typed-dom/dom');
            const array_1 = _dereq_('spica/array');
            const source_1 = _dereq_('../source');
            exports.ulist = (0, combinator_1.lazy)(() => (0, combinator_1.block)((0, combinator_1.validate)(/^-(?=[^\S\n]|\n[^\S\n]*\S)/, (0, combinator_1.context)({ syntax: { inline: { media: false } } }, exports.ulist_))));
            exports.ulist_ = (0, combinator_1.lazy)(() => (0, combinator_1.block)((0, combinator_1.fmap)((0, combinator_1.validate)(/^-(?=$|\s)/, (0, combinator_1.some)((0, combinator_1.creator)((0, combinator_1.union)([(0, inline_1.indexee)((0, combinator_1.fmap)((0, combinator_1.fallback)((0, combinator_1.inits)([
                    (0, combinator_1.line)((0, combinator_1.open)(/^-(?:$|\s)/, (0, combinator_1.trim)((0, combinator_1.subsequence)([
                        exports.checkbox,
                        (0, combinator_1.trimStart)((0, combinator_1.some)((0, combinator_1.union)([
                            inline_1.indexer,
                            inline_1.inline
                        ])))
                    ])), true)),
                    (0, combinator_1.indent)((0, combinator_1.union)([
                        exports.ulist_,
                        olist_1.olist_,
                        ilist_1.ilist_
                    ]))
                ]), invalid), ns => [(0, dom_1.html)('li', (0, dom_1.defrag)(fillFirstLine(ns)))]), true)])))), es => [format((0, dom_1.html)('ul', es))])));
            exports.checkbox = (0, combinator_1.focus)(/^\[[xX ]\](?=$|\s)/, source => [
                [(0, dom_1.html)('span', { class: 'checkbox' }, source[1].trimStart() ? '\u2611' : '\u2610')],
                ''
            ]);
            const invalid = (0, combinator_1.rewrite)(source_1.contentline, source => [
                [(0, dom_1.html)('span', {
                        class: 'invalid',
                        'data-invalid-syntax': 'listitem',
                        'data-invalid-type': 'syntax',
                        'data-invalid-message': 'Fix the indent or the head of the list item'
                    }, source.replace('\n', ''))],
                ''
            ]);
            function fillFirstLine(ns) {
                return ns.length === 1 && typeof ns[0] === 'object' && [
                    'UL',
                    'OL'
                ].includes(ns[0].tagName) ? (0, array_1.unshift)([(0, dom_1.html)('br')], ns) : ns;
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
            '../../combinator': 25,
            '../inline': 88,
            '../source': 128,
            './ilist': 76,
            './olist': 79,
            'spica/array': 6,
            'typed-dom/dom': 23
        }
    ],
    87: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.header = void 0;
            const combinator_1 = _dereq_('../combinator');
            const segment_1 = _dereq_('./segment');
            const source_1 = _dereq_('./source');
            const normalize_1 = _dereq_('./api/normalize');
            const dom_1 = _dereq_('typed-dom/dom');
            exports.header = (0, combinator_1.lazy)(() => (0, combinator_1.validate)(/^---+[^\S\v\f\r\n]*\r?\n[^\S\n]*(?=\S)/, (0, combinator_1.inits)([
                (0, combinator_1.rewrite)((source, context) => {
                    var _a;
                    return [
                        [],
                        ((_a = context.header) !== null && _a !== void 0 ? _a : true) ? source.slice((0, segment_1.segment)(source).next().value.length) : ''
                    ];
                }, (0, combinator_1.block)((0, combinator_1.union)([
                    (0, combinator_1.guard)(context => {
                        var _a;
                        return (_a = context.header) !== null && _a !== void 0 ? _a : true;
                    }, (0, combinator_1.focus)(/^---[^\S\v\f\r\n]*\r?\n(?:[A-Za-z][0-9A-Za-z]*(?:-[A-Za-z][0-9A-Za-z]*)*:[ \t]+\S[^\v\f\r\n]*\r?\n){1,100}---[^\S\v\f\r\n]*(?:$|\r?\n)/, (0, combinator_1.convert)(source => (0, normalize_1.normalize)(source.slice(source.indexOf('\n') + 1, source.trimEnd().lastIndexOf('\n'))).replace(/(\S)\s+$/mg, '$1'), (0, combinator_1.fmap)((0, combinator_1.some)((0, combinator_1.union)([field])), es => [(0, dom_1.html)('aside', { class: 'header' }, [(0, dom_1.html)('details', { open: '' }, (0, dom_1.defrag)([
                                (0, dom_1.html)('summary', 'Header'),
                                ...es
                            ]))])])))),
                    source => [
                        [(0, dom_1.html)('pre', {
                                class: 'invalid',
                                translate: 'no',
                                'data-invalid-syntax': 'header',
                                'data-invalid-type': 'syntax',
                                'data-invalid-message': 'Invalid syntax'
                            }, (0, normalize_1.normalize)(source))],
                        ''
                    ]
                ]))),
                (0, combinator_1.clear)((0, source_1.str)(/^[^\S\v\f\r\n]*\r?\n/))
            ])));
            const field = (0, combinator_1.line)(source => {
                const name = source.slice(0, source.indexOf(':'));
                const value = source.slice(name.length + 1).trim();
                return [
                    [(0, dom_1.html)('span', {
                            class: 'field',
                            'data-name': name.toLowerCase(),
                            'data-value': value
                        }, [
                            (0, dom_1.html)('span', { class: 'field-name' }, name),
                            ': ',
                            (0, dom_1.html)('span', { class: 'field-value' }, value),
                            '\n'
                        ])],
                    ''
                ];
            });
        },
        {
            '../combinator': 25,
            './api/normalize': 58,
            './segment': 127,
            './source': 128,
            'typed-dom/dom': 23
        }
    ],
    88: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.shortmedia = exports.media = exports.indexer = exports.indexee = exports.inline = void 0;
            const combinator_1 = _dereq_('../combinator');
            const escape_1 = _dereq_('./inline/escape');
            const annotation_1 = _dereq_('./inline/annotation');
            const reference_1 = _dereq_('./inline/reference');
            const template_1 = _dereq_('./inline/template');
            const comment_1 = _dereq_('./inline/comment');
            const extension_1 = _dereq_('./inline/extension');
            const ruby_1 = _dereq_('./inline/ruby');
            const link_1 = _dereq_('./inline/link');
            const html_1 = _dereq_('./inline/html');
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
                comment_1.comment,
                extension_1.extension,
                ruby_1.ruby,
                link_1.link,
                media_1.media,
                html_1.html,
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
            var indexee_1 = _dereq_('./inline/extension/indexee');
            Object.defineProperty(exports, 'indexee', {
                enumerable: true,
                get: function () {
                    return indexee_1.indexee;
                }
            });
            var indexer_1 = _dereq_('./inline/extension/indexer');
            Object.defineProperty(exports, 'indexer', {
                enumerable: true,
                get: function () {
                    return indexer_1.indexer;
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
        },
        {
            '../combinator': 25,
            './inline/annotation': 89,
            './inline/autolink': 90,
            './inline/bracket': 98,
            './inline/code': 99,
            './inline/comment': 100,
            './inline/deletion': 101,
            './inline/emphasis': 102,
            './inline/emstrong': 103,
            './inline/escape': 104,
            './inline/extension': 105,
            './inline/extension/indexee': 107,
            './inline/extension/indexer': 108,
            './inline/html': 111,
            './inline/htmlentity': 112,
            './inline/insertion': 113,
            './inline/link': 114,
            './inline/mark': 115,
            './inline/math': 116,
            './inline/media': 117,
            './inline/reference': 118,
            './inline/ruby': 119,
            './inline/shortmedia': 120,
            './inline/strong': 121,
            './inline/template': 122,
            './source': 128
        }
    ],
    89: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.annotation = void 0;
            const global_1 = _dereq_('spica/global');
            const combinator_1 = _dereq_('../../combinator');
            const inline_1 = _dereq_('../inline');
            const util_1 = _dereq_('../util');
            const dom_1 = _dereq_('typed-dom/dom');
            exports.annotation = (0, combinator_1.lazy)(() => (0, combinator_1.creator)((0, combinator_1.validate)('((', '))', '\n', (0, combinator_1.fmap)((0, combinator_1.surround)('((', (0, combinator_1.guard)(context => {
                var _a, _b, _c;
                return (_c = (_b = (_a = context.syntax) === null || _a === void 0 ? void 0 : _a.inline) === null || _b === void 0 ? void 0 : _b.annotation) !== null && _c !== void 0 ? _c : true;
            }, (0, util_1.startLoose)((0, combinator_1.context)({
                syntax: {
                    inline: {
                        annotation: false,
                        media: false
                    }
                },
                state: global_1.undefined,
                delimiters: global_1.undefined
            }, (0, util_1.trimSpaceStart)((0, combinator_1.union)([(0, combinator_1.some)(inline_1.inline, ')', /^\\?\n/)]))))), '))'), ns => [(0, dom_1.html)('sup', { class: 'annotation' }, (0, util_1.trimNodeEnd)((0, dom_1.defrag)(ns)))]))));
        },
        {
            '../../combinator': 25,
            '../inline': 88,
            '../util': 134,
            'spica/global': 13,
            'typed-dom/dom': 23
        }
    ],
    90: [
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
            const hashnum_1 = _dereq_('./autolink/hashnum');
            const anchor_1 = _dereq_('./autolink/anchor');
            const source_1 = _dereq_('../source');
            const util_1 = _dereq_('../util');
            exports.autolink = (0, combinator_1.fmap)((0, combinator_1.validate)(/^(?:[@#>0-9A-Za-z]|\S#)/, (0, combinator_1.guard)(context => {
                var _a, _b, _c;
                return (_c = (_b = (_a = context.syntax) === null || _a === void 0 ? void 0 : _a.inline) === null || _b === void 0 ? void 0 : _b.autolink) !== null && _c !== void 0 ? _c : true;
            }, (0, combinator_1.some)((0, combinator_1.union)([
                url_1.url,
                email_1.email,
                (0, source_1.str)(/^[0-9A-Za-z]+(?:[.+_-][0-9A-Za-z]+)*(?:@(?:[0-9A-Za-z]+(?:[.-][0-9A-Za-z]+)*)?)+/),
                channel_1.channel,
                account_1.account,
                (0, source_1.str)(/^@+[0-9A-Za-z]*(?:-[0-9A-Za-z]+)*/),
                (0, source_1.str)(new RegExp(String.raw`^(?:[^\p{C}\p{S}\p{P}\s]|${ hashtag_1.emoji }|['_])(?=#)`, 'u')),
                hashtag_1.hashtag,
                hashnum_1.hashnum,
                (0, source_1.str)(new RegExp(String.raw`^#+(?:[^\p{C}\p{S}\p{P}\s]|${ hashtag_1.emoji }|['_])*`, 'u')),
                anchor_1.anchor
            ])))), ns => ns.length === 1 ? ns : [(0, util_1.stringify)(ns)]);
        },
        {
            '../../combinator': 25,
            '../source': 128,
            '../util': 134,
            './autolink/account': 91,
            './autolink/anchor': 92,
            './autolink/channel': 93,
            './autolink/email': 94,
            './autolink/hashnum': 95,
            './autolink/hashtag': 96,
            './autolink/url': 97
        }
    ],
    91: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.account = void 0;
            const combinator_1 = _dereq_('../../../combinator');
            const link_1 = _dereq_('../link');
            const source_1 = _dereq_('../../source');
            const dom_1 = _dereq_('typed-dom/dom');
            exports.account = (0, combinator_1.lazy)(() => (0, combinator_1.fmap)((0, combinator_1.rewrite)((0, combinator_1.open)('@', (0, combinator_1.tails)([
                (0, combinator_1.verify)((0, source_1.str)(/^[0-9A-Za-z](?:(?:[0-9A-Za-z]|-(?=\w)){0,61}[0-9A-Za-z])?(?:\.[0-9A-Za-z](?:(?:[0-9A-Za-z]|-(?=\w)){0,61}[0-9A-Za-z])?)*\//), ([source]) => source.length <= 253 + 1),
                (0, combinator_1.verify)((0, source_1.str)(/^[A-Za-z][0-9A-Za-z]*(?:-[0-9A-Za-z]+)*/), ([source]) => source.length <= 64)
            ])), (0, combinator_1.context)({
                syntax: {
                    inline: {
                        link: true,
                        autolink: false
                    }
                }
            }, (0, combinator_1.convert)(source => `[${ source }]{ ${ source.includes('/') ? `https://${ source.slice(1).replace('/', '/@') }` : `/${ source }` } }`, (0, combinator_1.union)([link_1.link])))), ([el]) => [(0, dom_1.define)(el, { class: 'account' })]));
        },
        {
            '../../../combinator': 25,
            '../../source': 128,
            '../link': 114,
            'typed-dom/dom': 23
        }
    ],
    92: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.anchor = void 0;
            const combinator_1 = _dereq_('../../../combinator');
            const link_1 = _dereq_('../link');
            const dom_1 = _dereq_('typed-dom/dom');
            exports.anchor = (0, combinator_1.lazy)(() => (0, combinator_1.validate)('>>', (0, combinator_1.fmap)((0, combinator_1.focus)(/^>>(?:[A-Za-z][0-9A-Za-z]*(?:-[0-9A-Za-z]+)*\/)?[0-9A-Za-z]+(?:-[0-9A-Za-z]+)*(?![0-9A-Za-z@#:])/, (0, combinator_1.context)({
                syntax: {
                    inline: {
                        link: true,
                        autolink: false
                    }
                }
            }, (0, combinator_1.convert)(source => `[${ source }]{ ${ source.includes('/') ? `/@${ source.slice(2).replace('/', '/timeline/') }` : `?at=${ source.slice(2) }` } }`, (0, combinator_1.union)([link_1.link])))), ([el]) => [(0, dom_1.define)(el, { class: 'anchor' })])));
        },
        {
            '../../../combinator': 25,
            '../link': 114,
            'typed-dom/dom': 23
        }
    ],
    93: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.channel = void 0;
            const combinator_1 = _dereq_('../../../combinator');
            const account_1 = _dereq_('./account');
            const hashtag_1 = _dereq_('./hashtag');
            const util_1 = _dereq_('../../util');
            const dom_1 = _dereq_('typed-dom/dom');
            exports.channel = (0, combinator_1.validate)('@', (0, combinator_1.bind)((0, combinator_1.sequence)([
                account_1.account,
                (0, combinator_1.some)(hashtag_1.hashtag)
            ]), (es, rest) => {
                const source = (0, util_1.stringify)(es);
                if (source.includes('/', source.indexOf('#')))
                    return;
                const el = es[0];
                const url = `${ el.getAttribute('href') }?ch=${ source.slice(source.indexOf('#') + 1).replace(/#/g, '+') }`;
                return [
                    [(0, dom_1.define)(el, {
                            class: 'channel',
                            href: url
                        }, source)],
                    rest
                ];
            }));
        },
        {
            '../../../combinator': 25,
            '../../util': 134,
            './account': 91,
            './hashtag': 96,
            'typed-dom/dom': 23
        }
    ],
    94: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.email = void 0;
            const combinator_1 = _dereq_('../../../combinator');
            const source_1 = _dereq_('../../source');
            const dom_1 = _dereq_('typed-dom/dom');
            exports.email = (0, combinator_1.creator)((0, combinator_1.rewrite)((0, combinator_1.verify)((0, source_1.str)(/^[0-9A-Za-z]+(?:[.+_-][0-9A-Za-z]+)*@[0-9A-Za-z](?:(?:[0-9A-Za-z]|-(?=\w)){0,61}[0-9A-Za-z])?(?:\.[0-9A-Za-z](?:(?:[0-9A-Za-z]|-(?=\w)){0,61}[0-9A-Za-z])?)*(?![0-9A-Za-z])/), ([source]) => source.indexOf('@') <= 64 && source.length <= 255), source => [
                [(0, dom_1.html)('a', {
                        class: 'email',
                        href: `mailto:${ source }`
                    }, source)],
                ''
            ]));
        },
        {
            '../../../combinator': 25,
            '../../source': 128,
            'typed-dom/dom': 23
        }
    ],
    95: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.hashnum = void 0;
            const combinator_1 = _dereq_('../../../combinator');
            const link_1 = _dereq_('../link');
            const hashtag_1 = _dereq_('./hashtag');
            const source_1 = _dereq_('../../source');
            const dom_1 = _dereq_('typed-dom/dom');
            exports.hashnum = (0, combinator_1.lazy)(() => (0, combinator_1.fmap)((0, combinator_1.rewrite)((0, combinator_1.open)('#', (0, source_1.str)(new RegExp(String.raw`^[0-9]{1,16}(?![^\p{C}\p{S}\p{P}\s]|${ hashtag_1.emoji }|['_])`, 'u'))), (0, combinator_1.context)({
                syntax: {
                    inline: {
                        link: true,
                        autolink: false
                    }
                }
            }, (0, combinator_1.convert)(source => `[${ source }]{ ${ source.slice(1) } }`, (0, combinator_1.union)([link_1.link])))), ([el]) => [(0, dom_1.define)(el, {
                    class: 'hashnum',
                    href: null
                })]));
        },
        {
            '../../../combinator': 25,
            '../../source': 128,
            '../link': 114,
            './hashtag': 96,
            'typed-dom/dom': 23
        }
    ],
    96: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.hashtag = exports.emoji = void 0;
            const combinator_1 = _dereq_('../../../combinator');
            const link_1 = _dereq_('../link');
            const source_1 = _dereq_('../../source');
            const dom_1 = _dereq_('typed-dom/dom');
            exports.emoji = String.raw`\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|\p{Emoji_Presentation}|\p{Emoji}\uFE0F`;
            exports.hashtag = (0, combinator_1.lazy)(() => (0, combinator_1.fmap)((0, combinator_1.rewrite)((0, combinator_1.open)('#', (0, combinator_1.tails)([
                (0, combinator_1.verify)((0, source_1.str)(/^[0-9A-Za-z](?:(?:[0-9A-Za-z]|-(?=\w)){0,61}[0-9A-Za-z])?(?:\.[0-9A-Za-z](?:(?:[0-9A-Za-z]|-(?=\w)){0,61}[0-9A-Za-z])?)*\//), ([source]) => source.length <= 253 + 1),
                (0, combinator_1.verify)((0, source_1.str)(new RegExp([
                    '^',
                    String.raw`(?=[0-9]{0,127}_?(?:[^\d\p{C}\p{S}\p{P}\s]|${ exports.emoji }))`,
                    String.raw`(?:[^\p{C}\p{S}\p{P}\s]|${ exports.emoji }|_(?=[^\p{C}\p{S}\p{P}\s]|${ exports.emoji })){1,128}`,
                    String.raw`(?!_?(?:[^\p{C}\p{S}\p{P}\s]|${ exports.emoji })|')`
                ].join(''), 'u')), ([source]) => source.length <= 128)
            ])), (0, combinator_1.context)({
                syntax: {
                    inline: {
                        link: true,
                        autolink: false
                    }
                }
            }, (0, combinator_1.convert)(source => `[${ source }]{ ${ source.includes('/') ? `https://${ source.slice(1).replace('/', '/hashtags/') }` : `/hashtags/${ source.slice(1) }` } }`, (0, combinator_1.union)([link_1.link])))), ([el]) => [(0, dom_1.define)(el, { class: 'hashtag' }, el.innerText)]));
        },
        {
            '../../../combinator': 25,
            '../../source': 128,
            '../link': 114,
            'typed-dom/dom': 23
        }
    ],
    97: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.url = void 0;
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
            ])))), (0, combinator_1.context)({ syntax: { inline: { link: true } } }, (0, combinator_1.convert)(url => `{ ${ url } }`, (0, combinator_1.union)([link_1.link]))))));
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
            '../../../combinator': 25,
            '../../source': 128,
            '../link': 114
        }
    ],
    98: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.bracket = void 0;
            const global_1 = _dereq_('spica/global');
            const combinator_1 = _dereq_('../../combinator');
            const inline_1 = _dereq_('../inline');
            const source_1 = _dereq_('../source');
            const dom_1 = _dereq_('typed-dom/dom');
            const array_1 = _dereq_('spica/array');
            const index = /^(?:[0-9]+(?:(?:[.-]|, )[0-9]+)*|[A-Za-z])/;
            exports.bracket = (0, combinator_1.lazy)(() => (0, combinator_1.creator)((0, combinator_1.union)([
                (0, combinator_1.surround)((0, source_1.str)('('), (0, source_1.str)(index), (0, source_1.str)(')')),
                (0, combinator_1.surround)((0, source_1.str)('('), (0, combinator_1.some)(inline_1.inline, ')'), (0, source_1.str)(')'), true, ([as, bs = [], cs], rest) => [
                    [(0, dom_1.html)('span', { class: 'paren' }, (0, dom_1.defrag)((0, array_1.push)((0, array_1.unshift)(as, bs), cs)))],
                    rest
                ], ([as, bs = []], rest) => [
                    (0, array_1.unshift)(as, bs),
                    rest
                ]),
                (0, combinator_1.surround)((0, source_1.str)('\uFF08'), (0, source_1.str)(new RegExp(index.source.replace(/[09AZaz., ]|\-(?!\w)/g, c => c.trimStart() && String.fromCharCode(c.charCodeAt(0) + 65248)))), (0, source_1.str)('\uFF09')),
                (0, combinator_1.surround)((0, source_1.str)('\uFF08'), (0, combinator_1.some)(inline_1.inline, '\uFF09'), (0, source_1.str)('\uFF09'), true, ([as, bs = [], cs], rest) => [
                    [(0, dom_1.html)('span', { class: 'paren' }, (0, dom_1.defrag)((0, array_1.push)((0, array_1.unshift)(as, bs), cs)))],
                    rest
                ], ([as, bs = []], rest) => [
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
            ])));
        },
        {
            '../../combinator': 25,
            '../inline': 88,
            '../source': 128,
            'spica/array': 6,
            'spica/global': 13,
            'typed-dom/dom': 23
        }
    ],
    99: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.code = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const dom_1 = _dereq_('typed-dom/dom');
            exports.code = (0, combinator_1.creator)((0, combinator_1.validate)('`', (0, combinator_1.match)(/^(`+)(?!`)([^\n]*?[^`\n])\1(?!`)/, ([whole, , body]) => rest => [
                [(0, dom_1.html)('code', { 'data-src': whole }, format(body))],
                rest
            ])));
            function format(text) {
                return `${ text[0] }${ text[text.length - 1] }` === '  ' && text.trimStart() ? text.slice(1, -1) : text;
            }
        },
        {
            '../../combinator': 25,
            'typed-dom/dom': 23
        }
    ],
    100: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.comment = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const inline_1 = _dereq_('../inline');
            const source_1 = _dereq_('../source');
            const dom_1 = _dereq_('typed-dom/dom');
            const memoize_1 = _dereq_('spica/memoize');
            const array_1 = _dereq_('spica/array');
            exports.comment = (0, combinator_1.lazy)(() => (0, combinator_1.creator)((0, combinator_1.validate)('[#', (0, combinator_1.match)(/^(?=\[(#+)\s)/, (0, memoize_1.memoize)(([, fence]) => (0, combinator_1.surround)((0, combinator_1.open)((0, source_1.str)(`[${ fence }`), (0, combinator_1.some)(source_1.text, new RegExp(String.raw`^\s+${ fence }\]|^\S`)), true), (0, combinator_1.union)([(0, combinator_1.some)(inline_1.inline, new RegExp(String.raw`^\s+${ fence }\]`))]), (0, combinator_1.close)((0, combinator_1.some)(source_1.text, /^\S/), (0, source_1.str)(`${ fence }]`)), true, ([as, bs = [], cs], rest) => [
                [(0, dom_1.html)('span', { class: 'comment' }, [
                        (0, dom_1.html)('input', { type: 'checkbox' }),
                        (0, dom_1.html)('span', (0, dom_1.defrag)((0, array_1.push)((0, array_1.unshift)(as, bs), cs)))
                    ])],
                rest
            ], ([as, bs = []], rest) => [
                (0, array_1.unshift)(as, bs),
                rest
            ]), ([, fence]) => fence.length, [])))));
        },
        {
            '../../combinator': 25,
            '../inline': 88,
            '../source': 128,
            'spica/array': 6,
            'spica/memoize': 16,
            'typed-dom/dom': 23
        }
    ],
    101: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.deletion = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const inline_1 = _dereq_('../inline');
            const source_1 = _dereq_('../source');
            const util_1 = _dereq_('../util');
            const dom_1 = _dereq_('typed-dom/dom');
            const array_1 = _dereq_('spica/array');
            exports.deletion = (0, combinator_1.lazy)(() => (0, combinator_1.creator)((0, combinator_1.surround)((0, source_1.str)('~~'), (0, combinator_1.some)((0, combinator_1.union)([
                (0, combinator_1.some)(inline_1.inline, (0, util_1.blank)(/\n?/, '~~')),
                (0, combinator_1.open)(/^\n?/, (0, combinator_1.some)(inline_1.inline, '~'), true)
            ])), (0, source_1.str)('~~'), false, ([, bs], rest) => [
                [(0, dom_1.html)('del', (0, dom_1.defrag)(bs))],
                rest
            ], ([as, bs], rest) => [
                (0, array_1.unshift)(as, bs),
                rest
            ])));
        },
        {
            '../../combinator': 25,
            '../inline': 88,
            '../source': 128,
            '../util': 134,
            'spica/array': 6,
            'typed-dom/dom': 23
        }
    ],
    102: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.emphasis = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const inline_1 = _dereq_('../inline');
            const strong_1 = _dereq_('./strong');
            const source_1 = _dereq_('../source');
            const util_1 = _dereq_('../util');
            const dom_1 = _dereq_('typed-dom/dom');
            const array_1 = _dereq_('spica/array');
            exports.emphasis = (0, combinator_1.lazy)(() => (0, combinator_1.creator)((0, combinator_1.surround)((0, source_1.str)('*'), (0, util_1.startTight)((0, combinator_1.some)((0, combinator_1.union)([
                strong_1.strong,
                (0, combinator_1.some)(inline_1.inline, (0, util_1.blank)('', '*')),
                (0, combinator_1.open)((0, combinator_1.some)(inline_1.inline, '*'), inline_1.inline)
            ])), '*'), (0, source_1.str)('*'), false, ([, bs], rest) => [
                [(0, dom_1.html)('em', (0, dom_1.defrag)(bs))],
                rest
            ], ([as, bs], rest) => [
                (0, array_1.unshift)(as, bs),
                rest
            ])));
        },
        {
            '../../combinator': 25,
            '../inline': 88,
            '../source': 128,
            '../util': 134,
            './strong': 121,
            'spica/array': 6,
            'typed-dom/dom': 23
        }
    ],
    103: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.emstrong = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const inline_1 = _dereq_('../inline');
            const strong_1 = _dereq_('./strong');
            const source_1 = _dereq_('../source');
            const util_1 = _dereq_('../util');
            const dom_1 = _dereq_('typed-dom/dom');
            const array_1 = _dereq_('spica/array');
            const substrong = (0, combinator_1.lazy)(() => (0, combinator_1.some)((0, combinator_1.union)([
                (0, combinator_1.some)(inline_1.inline, (0, util_1.blank)('', '**')),
                (0, combinator_1.open)((0, combinator_1.some)(inline_1.inline, '*'), inline_1.inline)
            ])));
            const subemphasis = (0, combinator_1.lazy)(() => (0, combinator_1.some)((0, combinator_1.union)([
                strong_1.strong,
                (0, combinator_1.some)(inline_1.inline, (0, util_1.blank)('', '*')),
                (0, combinator_1.open)((0, combinator_1.some)(inline_1.inline, '*'), inline_1.inline)
            ])));
            exports.emstrong = (0, combinator_1.lazy)(() => (0, combinator_1.creator)((0, combinator_1.surround)((0, source_1.str)('***'), (0, util_1.startTight)((0, combinator_1.some)((0, combinator_1.union)([
                (0, combinator_1.some)(inline_1.inline, (0, util_1.blank)('', '*')),
                (0, combinator_1.open)((0, combinator_1.some)(inline_1.inline, '*'), inline_1.inline)
            ]))), (0, source_1.str)(/^\*{1,3}/), false, ([, bs, cs], rest, context) => {
                var _a, _b;
                switch (cs[0]) {
                case '***':
                    return [
                        [(0, dom_1.html)('em', [(0, dom_1.html)('strong', (0, dom_1.defrag)(bs))])],
                        rest
                    ];
                case '**':
                    return (_a = (0, combinator_1.bind)(subemphasis, (ds, rest) => rest.slice(0, 1) === '*' ? [
                        [(0, dom_1.html)('em', (0, array_1.unshift)([(0, dom_1.html)('strong', (0, dom_1.defrag)(bs))], (0, dom_1.defrag)(ds)))],
                        rest.slice(1)
                    ] : [
                        (0, array_1.unshift)([
                            '*',
                            (0, dom_1.html)('strong', (0, dom_1.defrag)(bs))
                        ], ds),
                        rest
                    ])(rest, context)) !== null && _a !== void 0 ? _a : [
                        [
                            '*',
                            (0, dom_1.html)('strong', (0, dom_1.defrag)(bs))
                        ],
                        rest
                    ];
                case '*':
                    return (_b = (0, combinator_1.bind)(substrong, (ds, rest) => rest.slice(0, 2) === '**' ? [
                        [(0, dom_1.html)('strong', (0, array_1.unshift)([(0, dom_1.html)('em', (0, dom_1.defrag)(bs))], (0, dom_1.defrag)(ds)))],
                        rest.slice(2)
                    ] : [
                        (0, array_1.unshift)([
                            '**',
                            (0, dom_1.html)('em', (0, dom_1.defrag)(bs))
                        ], ds),
                        rest
                    ])(rest, context)) !== null && _b !== void 0 ? _b : [
                        [
                            '**',
                            (0, dom_1.html)('em', (0, dom_1.defrag)(bs))
                        ],
                        rest
                    ];
                }
            }, ([as, bs], rest) => [
                (0, array_1.unshift)(as, bs),
                rest
            ])));
        },
        {
            '../../combinator': 25,
            '../inline': 88,
            '../source': 128,
            '../util': 134,
            './strong': 121,
            'spica/array': 6,
            'typed-dom/dom': 23
        }
    ],
    104: [
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
            '../../combinator': 25,
            '../source': 128,
            'spica/global': 13
        }
    ],
    105: [
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
            '../../combinator': 25,
            './extension/index': 106,
            './extension/label': 109,
            './extension/placeholder': 110
        }
    ],
    106: [
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
            const dom_1 = _dereq_('typed-dom/dom');
            const array_1 = _dereq_('spica/array');
            exports.index = (0, combinator_1.lazy)(() => (0, combinator_1.creator)((0, combinator_1.validate)('[#', ']', '\n', (0, combinator_1.fmap)((0, indexee_1.indexee)((0, combinator_1.fmap)((0, combinator_1.surround)('[#', (0, combinator_1.guard)(context => {
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
            }, (0, combinator_1.open)((0, source_1.stropt)('|'), (0, combinator_1.some)((0, combinator_1.union)([
                signature,
                inline_1.inline
            ]), ']', /^\\?\n/), true)))), ']'), ns => [(0, dom_1.html)('a', (0, util_1.trimNodeEnd)((0, dom_1.defrag)(ns)))])), ([el]) => [(0, dom_1.define)(el, {
                    id: el.id ? null : global_1.undefined,
                    class: 'index',
                    href: el.id ? `#${ el.id }` : global_1.undefined
                }, el.childNodes)]))));
            const signature = (0, combinator_1.lazy)(() => (0, combinator_1.creator)((0, combinator_1.fmap)((0, combinator_1.open)('|#', (0, util_1.startTight)((0, combinator_1.some)((0, combinator_1.union)([
                bracket,
                source_1.txt
            ]), ']'))), ns => [(0, dom_1.html)('span', {
                    class: 'indexer',
                    'data-index': (0, indexee_1.identity)((0, array_1.join)(ns)).slice(6)
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
            '../../../combinator': 25,
            '../../inline': 88,
            '../../source': 128,
            '../../util': 134,
            './indexee': 107,
            'spica/array': 6,
            'spica/global': 13,
            'typed-dom/dom': 23
        }
    ],
    107: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.text = exports.identity = exports.indexee = void 0;
            const global_1 = _dereq_('spica/global');
            const combinator_1 = _dereq_('../../../combinator');
            const dom_1 = _dereq_('typed-dom/dom');
            function indexee(parser, optional) {
                return (0, combinator_1.fmap)(parser, ([el], _, {id}) => [(0, dom_1.define)(el, { id: id !== '' && identity(text(el, optional)) || global_1.undefined })]);
            }
            exports.indexee = indexee;
            function identity(text) {
                text && (text = text.trim());
                return text && `index:${ text.replace(/\s+/g, '_').slice(0, 101).replace(/^(.{97}).{4}$/, '$1...') }`;
            }
            exports.identity = identity;
            function text(source, optional = false) {
                var _a;
                const indexer = source.querySelector(':scope > .indexer');
                if (!indexer && optional)
                    return '';
                const index = indexer === null || indexer === void 0 ? void 0 : indexer.getAttribute('data-index');
                if (index)
                    return index;
                const target = source.cloneNode(true);
                for (let es = target.querySelectorAll('code[data-src], .math[data-src], .comment, rt, rp, .reference, .checkbox, ul, ol'), i = 0, len = es.length; i < len; ++i) {
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
                }
                return target.textContent;
            }
            exports.text = text;
        },
        {
            '../../../combinator': 25,
            'spica/global': 13,
            'typed-dom/dom': 23
        }
    ],
    108: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.indexer = void 0;
            const combinator_1 = _dereq_('../../../combinator');
            const index_1 = _dereq_('./index');
            const dom_1 = _dereq_('typed-dom/dom');
            exports.indexer = (0, combinator_1.creator)((0, combinator_1.fmap)((0, combinator_1.verify)((0, combinator_1.surround)(/^\s+(?=\[#\S)/, (0, combinator_1.context)({ syntax: { inline: { index: true } } }, (0, combinator_1.union)([
                (0, combinator_1.focus)('[#]', () => [
                    [(0, dom_1.html)('a', { href: '#' })],
                    ''
                ]),
                index_1.index
            ])), /^\s*$/), ([el]) => el.getElementsByClassName('invalid').length === 0), ([el]) => [(0, dom_1.html)('span', {
                    class: 'indexer',
                    'data-index': el.getAttribute('href').slice(7)
                })]));
        },
        {
            '../../../combinator': 25,
            './index': 106,
            'typed-dom/dom': 23
        }
    ],
    109: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.isFixed = exports.number = exports.label = exports.segment = void 0;
            const global_1 = _dereq_('spica/global');
            const combinator_1 = _dereq_('../../../combinator');
            const source_1 = _dereq_('../../source');
            const dom_1 = _dereq_('typed-dom/dom');
            const array_1 = _dereq_('spica/array');
            const body = (0, source_1.str)(/^\$[A-Za-z]*(?:(?:-[A-Za-z][0-9A-Za-z]*)+|-(?:(?:0|[1-9][0-9]*)\.)*(?:0|[1-9][0-9]*)(?![0-9A-Za-z]))/);
            exports.segment = (0, combinator_1.clear)((0, combinator_1.validate)([
                '[$',
                '$'
            ], (0, combinator_1.union)([
                (0, combinator_1.surround)('[', body, ']'),
                body
            ])));
            exports.label = (0, combinator_1.creator)((0, combinator_1.validate)([
                '[$',
                '$'
            ], (0, combinator_1.fmap)((0, combinator_1.guard)(context => {
                var _a, _b, _c;
                return (_c = (_b = (_a = context.syntax) === null || _a === void 0 ? void 0 : _a.inline) === null || _b === void 0 ? void 0 : _b.label) !== null && _c !== void 0 ? _c : true;
            }, (0, combinator_1.union)([
                (0, combinator_1.surround)('[', body, ']'),
                body
            ])), ([text]) => [(0, dom_1.html)('a', {
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
            '../../../combinator': 25,
            '../../source': 128,
            'spica/array': 6,
            'spica/global': 13,
            'typed-dom/dom': 23
        }
    ],
    110: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.placeholder = void 0;
            const combinator_1 = _dereq_('../../../combinator');
            const inline_1 = _dereq_('../../inline');
            const source_1 = _dereq_('../../source');
            const util_1 = _dereq_('../../util');
            const dom_1 = _dereq_('typed-dom/dom');
            const array_1 = _dereq_('spica/array');
            exports.placeholder = (0, combinator_1.lazy)(() => (0, combinator_1.creator)((0, combinator_1.validate)([
                '[:',
                '[^'
            ], ']', '\n', (0, combinator_1.surround)((0, source_1.str)(/^\[[:^]/), (0, util_1.startTight)((0, combinator_1.some)((0, combinator_1.union)([inline_1.inline]), ']')), (0, source_1.str)(']'), false, ([as, bs], rest) => [
                [(0, dom_1.html)('span', {
                        class: 'invalid',
                        'data-invalid-syntax': 'extension',
                        'data-invalid-type': 'syntax',
                        'data-invalid-message': `Reserved start symbol "${ as[0][1] }" cannot be used in "[]"`
                    }, (0, dom_1.defrag)(bs))],
                rest
            ], ([as, bs], rest) => [
                (0, array_1.unshift)(as, bs),
                rest
            ]))));
        },
        {
            '../../../combinator': 25,
            '../../inline': 88,
            '../../source': 128,
            '../../util': 134,
            'spica/array': 6,
            'typed-dom/dom': 23
        }
    ],
    111: [
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
            const dom_1 = _dereq_('typed-dom/dom');
            const memoize_1 = _dereq_('spica/memoize');
            const cache_1 = _dereq_('spica/cache');
            const array_1 = _dereq_('spica/array');
            const tags = Object.freeze([
                'wbr',
                'sup',
                'sub',
                'small',
                'bdo',
                'bdi'
            ]);
            const attrspec = {
                bdo: {
                    dir: Object.freeze([
                        'ltr',
                        'rtl'
                    ])
                }
            };
            Object.setPrototypeOf(attrspec, null);
            Object.values(attrspec).forEach(o => Object.setPrototypeOf(o, null));
            exports.html = (0, combinator_1.lazy)(() => (0, combinator_1.creator)((0, combinator_1.validate)('<', (0, combinator_1.validate)(/^<[a-z]+(?=[^\S\n]|>)/, (0, combinator_1.union)([
                (0, combinator_1.match)(/^(?=<(wbr)(?=[^\S\n]|>))/, (0, memoize_1.memoize)(([, tag]) => (0, combinator_1.surround)(`<${ tag }`, (0, combinator_1.some)((0, combinator_1.union)([exports.attribute])), /^\s*>/, true, ([, bs = []], rest) => [
                    [(0, dom_1.html)(tag, attributes('html', [], attrspec[tag], bs))],
                    rest
                ]), ([, tag]) => tags.indexOf(tag), [])),
                (0, combinator_1.match)(/^(?=<(sup|sub|small)(?=[^\S\n]|>))/, (0, memoize_1.memoize)(([, tag]) => (0, combinator_1.validate)(`<${ tag }`, `</${ tag }>`, (0, combinator_1.surround)((0, combinator_1.surround)((0, source_1.str)(`<${ tag }`), (0, combinator_1.some)(exports.attribute), (0, source_1.str)(/^\s*>/), true), (0, util_1.startLoose)((0, combinator_1.context)((() => {
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
                })(), (0, combinator_1.some)((0, combinator_1.union)([
                    (0, combinator_1.some)(inline_1.inline, (0, util_1.blank)(/\n?/, `</${ tag }>`)),
                    (0, combinator_1.open)(/^\n?/, (0, combinator_1.some)(inline_1.inline, '</'), true)
                ]), `</${ tag }>`)), `</${ tag }>`), (0, source_1.str)(`</${ tag }>`), false, ([as, bs, cs], rest, context) => [
                    [elem(tag, as, (0, dom_1.defrag)(bs), cs, context)],
                    rest
                ])), ([, tag]) => tags.indexOf(tag), [])),
                (0, combinator_1.match)(/^(?=<(bdo|bdi)(?=[^\S\n]|>))/, (0, memoize_1.memoize)(([, tag]) => (0, combinator_1.validate)(`<${ tag }`, `</${ tag }>`, (0, combinator_1.surround)((0, combinator_1.surround)((0, source_1.str)(`<${ tag }`), (0, combinator_1.some)(exports.attribute), (0, source_1.str)(/^\s*>/), true), (0, util_1.startLoose)((0, combinator_1.some)((0, combinator_1.union)([
                    (0, combinator_1.some)(inline_1.inline, (0, util_1.blank)(/\n?/, `</${ tag }>`)),
                    (0, combinator_1.open)(/^\n?/, (0, combinator_1.some)(inline_1.inline, '</'), true)
                ]), `</${ tag }>`), `</${ tag }>`), (0, source_1.str)(`</${ tag }>`), false, ([as, bs, cs], rest, context) => [
                    [elem(tag, as, (0, dom_1.defrag)(bs), cs, context)],
                    rest
                ], ([as, bs], rest) => as.length === 1 ? [
                    (0, array_1.unshift)(as, bs),
                    rest
                ] : global_1.undefined)), ([, tag]) => tags.indexOf(tag), [])),
                (0, combinator_1.match)(/^(?=<([a-z]+)(?=[^\S\n]|>))/, (0, memoize_1.memoize)(([, tag]) => (0, combinator_1.validate)(`<${ tag }`, `</${ tag }>`, (0, combinator_1.surround)((0, combinator_1.surround)((0, source_1.str)(`<${ tag }`), (0, combinator_1.some)(exports.attribute), (0, source_1.str)(/^\s*>/), true), (0, util_1.startLoose)((0, combinator_1.some)((0, combinator_1.union)([
                    (0, combinator_1.some)(inline_1.inline, (0, util_1.blank)(/\n?/, `</${ tag }>`)),
                    (0, combinator_1.open)(/^\n?/, (0, combinator_1.some)(inline_1.inline, '</'), true)
                ]), `</${ tag }>`), `</${ tag }>`), (0, source_1.str)(`</${ tag }>`), false, ([as, bs, cs], rest, context) => [
                    [elem(tag, as, (0, dom_1.defrag)(bs), cs, context)],
                    rest
                ], ([as, bs], rest) => as.length === 1 ? [
                    (0, array_1.unshift)(as, bs),
                    rest
                ] : global_1.undefined)), ([, tag]) => tag, new cache_1.Cache(10000)))
            ])))));
            exports.attribute = (0, combinator_1.union)([(0, source_1.str)(/^[^\S\n]+[a-z]+(?:-[a-z]+)*(?:="(?:\\[^\n]|[^\\\n"])*")?(?=[^\S\n]|>)/)]);
            function elem(tag, as, bs, cs, context) {
                var _a, _b, _c, _d, _e, _f;
                if (!tags.includes(tag))
                    return invalid('tag', `Invalid HTML tag <${ tag }>`, as, bs, cs);
                switch (tag) {
                case 'sup':
                case 'sub':
                    switch (true) {
                    case (_b = (_a = context.state) === null || _a === void 0 ? void 0 : _a.in) === null || _b === void 0 ? void 0 : _b.supsub:
                        return invalid('nest', `<${ tag }> HTML tag cannot be used in <sup> or <sub> HTML tag`, as, bs, cs);
                    }
                    break;
                case 'small':
                    switch (true) {
                    case (_d = (_c = context.state) === null || _c === void 0 ? void 0 : _c.in) === null || _d === void 0 ? void 0 : _d.supsub:
                    case (_f = (_e = context.state) === null || _e === void 0 ? void 0 : _e.in) === null || _f === void 0 ? void 0 : _f.small:
                        return invalid('nest', `<${ tag }> HTML tag cannot be used in <sup>, <sub>, or <small> HTML tag`, as, bs, cs);
                    }
                    break;
                }
                const attrs = attributes('html', [], attrspec[tag], as.slice(1, -1));
                switch (true) {
                case 'data-invalid-syntax' in attrs:
                    return invalid('attribute', 'Invalid HTML attribute', as, bs, cs);
                default:
                    return (0, dom_1.html)(tag, attrs, bs);
                }
            }
            function invalid(type, message, as, bs, cs) {
                return (0, dom_1.html)('span', {
                    class: 'invalid',
                    'data-invalid-syntax': 'html',
                    'data-invalid-type': type,
                    'data-invalid-message': message
                }, (0, dom_1.defrag)((0, array_1.push)((0, array_1.unshift)(as, bs), cs)));
            }
            const requiredAttributes = (0, memoize_1.memoize)(spec => (0, alias_1.ObjectEntries)(spec).flatMap(([k, v]) => v && (0, alias_1.isFrozen)(v) ? [k] : []), new WeakMap());
            function attributes(syntax, classes, spec, params) {
                var _a, _b;
                let invalid = false;
                const attrs = {};
                for (let i = 0; i < params.length; ++i) {
                    const param = params[i].trim();
                    const name = param.split('=', 1)[0];
                    const value = param !== name ? param.slice(name.length + 2, -1).replace(/\\(.?)/g, '$1') : global_1.undefined;
                    invalid || (invalid = !spec || name in attrs);
                    if (spec && !spec[name] && name in spec)
                        continue;
                    ((_a = spec === null || spec === void 0 ? void 0 : spec[name]) === null || _a === void 0 ? void 0 : _a.includes(value)) || value !== global_1.undefined && ((_b = spec === null || spec === void 0 ? void 0 : spec[name]) === null || _b === void 0 ? void 0 : _b.length) === 0 ? attrs[name] = value !== null && value !== void 0 ? value : '' : invalid || (invalid = !!spec);
                    (0, array_1.splice)(params, i--, 1);
                }
                invalid || (invalid = !!spec && !requiredAttributes(spec).every(name => name in attrs));
                if (invalid) {
                    attrs['class'] = (0, array_1.join)(classes.includes('invalid') ? classes : (0, array_1.unshift)(classes, ['invalid']), ' ');
                    attrs['data-invalid-syntax'] = syntax;
                    attrs['data-invalid-type'] = 'argument';
                    attrs['data-invalid-message'] = 'Invalid argument';
                }
                return attrs;
            }
            exports.attributes = attributes;
        },
        {
            '../../combinator': 25,
            '../inline': 88,
            '../source': 128,
            '../util': 134,
            'spica/alias': 5,
            'spica/array': 6,
            'spica/cache': 8,
            'spica/global': 13,
            'spica/memoize': 16,
            'typed-dom/dom': 23
        }
    ],
    112: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.htmlentity = exports.unsafehtmlentity = void 0;
            const global_1 = _dereq_('spica/global');
            const combinator_1 = _dereq_('../../combinator');
            const dom_1 = _dereq_('typed-dom/dom');
            const memoize_1 = _dereq_('spica/memoize');
            exports.unsafehtmlentity = (0, combinator_1.creator)((0, combinator_1.validate)('&', (0, combinator_1.focus)(/^&[0-9A-Za-z]+;/, entity => {
                var _a;
                return [
                    [(_a = parse(entity)) !== null && _a !== void 0 ? _a : `\x1B${ entity }`],
                    ''
                ];
            })));
            exports.htmlentity = (0, combinator_1.fmap)((0, combinator_1.union)([exports.unsafehtmlentity]), ([test]) => [test[0] === '\x1B' ? (0, dom_1.html)('span', {
                    class: 'invalid',
                    'data-invalid-syntax': 'htmlentity',
                    'data-invalid-type': 'syntax',
                    'data-invalid-message': 'Invalid HTML entity'
                }, test.slice(1)) : test]);
            const parse = (0, memoize_1.reduce)((el => entity => {
                if (entity === '&NewLine;')
                    return ' ';
                el.innerHTML = entity;
                const text = el.textContent;
                return entity === text ? global_1.undefined : text;
            })((0, dom_1.html)('b')));
        },
        {
            '../../combinator': 25,
            'spica/global': 13,
            'spica/memoize': 16,
            'typed-dom/dom': 23
        }
    ],
    113: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.insertion = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const inline_1 = _dereq_('../inline');
            const source_1 = _dereq_('../source');
            const util_1 = _dereq_('../util');
            const dom_1 = _dereq_('typed-dom/dom');
            const array_1 = _dereq_('spica/array');
            exports.insertion = (0, combinator_1.lazy)(() => (0, combinator_1.creator)((0, combinator_1.surround)((0, source_1.str)('++'), (0, combinator_1.some)((0, combinator_1.union)([
                (0, combinator_1.some)(inline_1.inline, (0, util_1.blank)(/\n?/, '++')),
                (0, combinator_1.open)(/^\n?/, (0, combinator_1.some)(inline_1.inline, '+'), true)
            ])), (0, source_1.str)('++'), false, ([, bs], rest) => [
                [(0, dom_1.html)('ins', (0, dom_1.defrag)(bs))],
                rest
            ], ([as, bs], rest) => [
                (0, array_1.unshift)(as, bs),
                rest
            ])));
        },
        {
            '../../combinator': 25,
            '../inline': 88,
            '../source': 128,
            '../util': 134,
            'spica/array': 6,
            'typed-dom/dom': 23
        }
    ],
    114: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.resolve = exports.option = exports.uri = exports.link = void 0;
            const global_1 = _dereq_('spica/global');
            const parser_1 = _dereq_('../../combinator/data/parser');
            const combinator_1 = _dereq_('../../combinator');
            const inline_1 = _dereq_('../inline');
            const html_1 = _dereq_('./html');
            const autolink_1 = _dereq_('../autolink');
            const source_1 = _dereq_('../source');
            const util_1 = _dereq_('../util');
            const dom_1 = _dereq_('typed-dom/dom');
            const url_1 = _dereq_('spica/url');
            const optspec = { rel: ['nofollow'] };
            Object.setPrototypeOf(optspec, null);
            exports.link = (0, combinator_1.lazy)(() => (0, combinator_1.creator)(10, (0, combinator_1.validate)([
                '[',
                '{'
            ], '}', '\n', (0, combinator_1.bind)((0, combinator_1.guard)(context => {
                var _a, _b, _c;
                return (_c = (_b = (_a = context.syntax) === null || _a === void 0 ? void 0 : _a.inline) === null || _b === void 0 ? void 0 : _b.link) !== null && _c !== void 0 ? _c : true;
            }, (0, combinator_1.reverse)((0, combinator_1.tails)([
                (0, combinator_1.context)({ syntax: { inline: { link: false } } }, (0, combinator_1.dup)((0, combinator_1.union)([
                    (0, combinator_1.surround)('[', inline_1.media, ']'),
                    (0, combinator_1.surround)('[', inline_1.shortmedia, ']'),
                    (0, combinator_1.surround)('[', (0, util_1.startLoose)((0, combinator_1.context)({
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
                    }, (0, util_1.trimSpaceStart)((0, combinator_1.some)(inline_1.inline, ']', /^\\?\n/)))), ']', true)
                ]))),
                (0, combinator_1.dup)((0, combinator_1.surround)(/^{(?![{}])/, (0, combinator_1.inits)([
                    exports.uri,
                    (0, combinator_1.some)(exports.option)
                ]), /^[^\S\n]*}/))
            ]))), ([params, content = []], rest, context) => {
                var _a, _b, _c, _d, _e, _f;
                if ((_a = (0, parser_1.eval)((0, combinator_1.some)(autolink_1.autolink)((0, util_1.stringify)(content), context))) === null || _a === void 0 ? void 0 : _a.some(node => typeof node === 'object'))
                    return;
                const INSECURE_URI = params.shift();
                const el = elem(INSECURE_URI, (0, util_1.trimNodeEnd)((0, dom_1.defrag)(content)), new url_1.ReadonlyURL(resolve(INSECURE_URI, (_b = context.host) !== null && _b !== void 0 ? _b : global_1.location, (_d = (_c = context.url) !== null && _c !== void 0 ? _c : context.host) !== null && _d !== void 0 ? _d : global_1.location), ((_e = context.host) === null || _e === void 0 ? void 0 : _e.href) || global_1.location.href), ((_f = context.host) === null || _f === void 0 ? void 0 : _f.origin) || global_1.location.origin);
                if (el.classList.contains('invalid'))
                    return [
                        [el],
                        rest
                    ];
                return [
                    [(0, dom_1.define)(el, (0, html_1.attributes)('link', [], optspec, params))],
                    rest
                ];
            }))));
            exports.uri = (0, combinator_1.union)([
                (0, combinator_1.open)(/^[^\S\n]+/, (0, source_1.str)(/^\S+/)),
                (0, source_1.str)(/^[^\s{}]+/)
            ]);
            exports.option = (0, combinator_1.union)([
                (0, combinator_1.fmap)((0, source_1.str)(/^[^\S\n]+nofollow(?=[^\S\n]|})/), () => [` rel="nofollow"`]),
                (0, source_1.str)(/^[^\S\n]+[a-z]+(?:-[a-z]+)*(?:="(?:\\[^\n]|[^\\\n"])*")?(?=[^\S\n]|})/),
                (0, combinator_1.fmap)((0, source_1.str)(/^[^\S\n]+[^\s{}]+/), opt => [` \\${ opt.slice(1) }`])
            ]);
            function resolve(uri, host, source) {
                switch (true) {
                case uri.slice(0, 2) === '^/':
                    const last = host.pathname.slice(host.pathname.lastIndexOf('/') + 1);
                    return last.includes('.') && /^[0-9]*[A-Za-z][0-9A-Za-z]*$/.test(last.slice(last.lastIndexOf('.') + 1)) ? `${ host.pathname.slice(0, -last.length) }${ uri.slice(2) }` : `${ host.pathname.replace(/\/?$/, '/') }${ uri.slice(2) }`;
                case host.origin === source.origin && host.pathname === source.pathname:
                case uri.slice(0, 2) === '//':
                    return uri;
                default:
                    const target = new url_1.ReadonlyURL(uri, source.href);
                    return target.origin === host.origin ? target.href.slice(target.origin.length) : target.href;
                }
            }
            exports.resolve = resolve;
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
                        href: uri.source,
                        target: undefined || uri.origin !== origin || typeof content[0] === 'object' && content[0].classList.contains('media') ? '_blank' : undefined
                    }, content.length === 0 ? decode(INSECURE_URI) : content);
                case 'tel:':
                    if (content.length === 0) {
                        content = [INSECURE_URI];
                    }
                    const pattern = /^(?:tel:)?(?:\+(?!0))?\d+(?:-\d+)*$/i;
                    switch (true) {
                    case content.length === 1 && typeof content[0] === 'string' && pattern.test(INSECURE_URI) && pattern.test(content[0]) && INSECURE_URI.replace(/[^+\d]/g, '') === content[0].replace(/[^+\d]/g, ''):
                        return (0, dom_1.html)('a', { href: uri.source }, content);
                    }
                    type = 'content';
                    message = 'Invalid phone number';
                    break;
                }
                return (0, dom_1.html)('a', {
                    class: 'invalid',
                    'data-invalid-syntax': 'link',
                    'data-invalid-type': type !== null && type !== void 0 ? type : type = 'argument',
                    'data-invalid-message': message !== null && message !== void 0 ? message : message = 'Invalid protocol'
                }, content.length === 0 ? INSECURE_URI : content);
            }
            function decode(uri) {
                if (!uri.includes('%'))
                    return uri;
                try {
                    uri = (0, global_1.decodeURI)(uri);
                } finally {
                    return uri.replace(/\s+/g, global_1.encodeURI);
                }
            }
        },
        {
            '../../combinator': 25,
            '../../combinator/data/parser': 45,
            '../autolink': 60,
            '../inline': 88,
            '../source': 128,
            '../util': 134,
            './html': 111,
            'spica/global': 13,
            'spica/url': 21,
            'typed-dom/dom': 23
        }
    ],
    115: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.mark = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const inline_1 = _dereq_('../inline');
            const source_1 = _dereq_('../source');
            const util_1 = _dereq_('../util');
            const dom_1 = _dereq_('typed-dom/dom');
            const array_1 = _dereq_('spica/array');
            exports.mark = (0, combinator_1.lazy)(() => (0, combinator_1.creator)((0, combinator_1.surround)((0, source_1.str)('=='), (0, util_1.startTight)((0, combinator_1.some)((0, combinator_1.union)([
                (0, combinator_1.some)(inline_1.inline, (0, util_1.blank)('', '==')),
                (0, combinator_1.open)((0, combinator_1.some)(inline_1.inline, '='), inline_1.inline)
            ]))), (0, source_1.str)('=='), false, ([, bs], rest) => [
                [(0, dom_1.html)('mark', (0, dom_1.defrag)(bs))],
                rest
            ], ([as, bs], rest) => [
                (0, array_1.unshift)(as, bs),
                rest
            ])));
        },
        {
            '../../combinator': 25,
            '../inline': 88,
            '../source': 128,
            '../util': 134,
            'spica/array': 6,
            'typed-dom/dom': 23
        }
    ],
    116: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.math = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const source_1 = _dereq_('../source');
            const dom_1 = _dereq_('typed-dom/dom');
            const disallowedCommand = /\\(?:begin|tiny|huge|large)(?![0-9a-z])/i;
            exports.math = (0, combinator_1.lazy)(() => (0, combinator_1.creator)((0, combinator_1.validate)('$', (0, combinator_1.rewrite)((0, combinator_1.union)([
                (0, combinator_1.surround)('$', (0, source_1.str)(/^(?![\s{}#$%&]|\d+(?:[,.]\d+)*[^-+*/=<>^_~\\$]|-[\da-z]|[a-z]+-)(?:\\\$|\x20(?!\$)|[\x21-\x23\x25-\x7E])+/i), /^\$(?![0-9a-z])/i),
                (0, combinator_1.surround)('$', bracket, '$')
            ]), (source, {
                caches: {math: cache} = {}
            }) => {
                var _a;
                return [
                    [((_a = cache === null || cache === void 0 ? void 0 : cache.get(source)) === null || _a === void 0 ? void 0 : _a.cloneNode(true)) || (0, dom_1.html)('span', !disallowedCommand.test(source) ? {
                            class: 'math',
                            translate: 'no',
                            'data-src': source
                        } : {
                            class: 'invalid',
                            translate: 'no',
                            'data-invalid-syntax': 'math',
                            'data-invalid-type': 'content',
                            'data-invalid-message': `"${ source.match(disallowedCommand)[0] }" command is disallowed`
                        }, source)],
                    ''
                ];
            }))));
            const bracket = (0, combinator_1.lazy)(() => (0, combinator_1.creator)((0, combinator_1.surround)('{', (0, combinator_1.some)((0, combinator_1.union)([
                bracket,
                (0, combinator_1.some)(source_1.escsource, /^(?:[{}]|\\?\n)/)
            ])), '}', true)));
        },
        {
            '../../combinator': 25,
            '../source': 128,
            'typed-dom/dom': 23
        }
    ],
    117: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.media = void 0;
            const global_1 = _dereq_('spica/global');
            const combinator_1 = _dereq_('../../combinator');
            const link_1 = _dereq_('./link');
            const html_1 = _dereq_('./html');
            const htmlentity_1 = _dereq_('./htmlentity');
            const source_1 = _dereq_('../source');
            const dom_1 = _dereq_('typed-dom/dom');
            const url_1 = _dereq_('spica/url');
            const array_1 = _dereq_('spica/array');
            const optspec = {
                'width': [],
                'height': [],
                'aspect-ratio': [],
                rel: global_1.undefined
            };
            Object.setPrototypeOf(optspec, null);
            exports.media = (0, combinator_1.lazy)(() => (0, combinator_1.creator)(10, (0, combinator_1.validate)([
                '![',
                '!{'
            ], '}', '\n', (0, combinator_1.bind)((0, combinator_1.verify)((0, combinator_1.fmap)((0, combinator_1.open)('!', (0, combinator_1.guard)(context => {
                var _a, _b, _c;
                return (_c = (_b = (_a = context.syntax) === null || _a === void 0 ? void 0 : _a.inline) === null || _b === void 0 ? void 0 : _b.media) !== null && _c !== void 0 ? _c : true;
            }, (0, combinator_1.tails)([
                (0, combinator_1.dup)((0, combinator_1.surround)(/^\[(?!\s*\\\s)/, (0, combinator_1.some)((0, combinator_1.union)([
                    htmlentity_1.unsafehtmlentity,
                    bracket,
                    source_1.txt
                ]), ']', /^\\?\n/), ']', true)),
                (0, combinator_1.dup)((0, combinator_1.surround)(/^{(?![{}])/, (0, combinator_1.inits)([
                    link_1.uri,
                    (0, combinator_1.some)(option)
                ]), /^[^\S\n]*}/))
            ]))), ([as, bs]) => bs ? [
                [(0, array_1.join)(as).trim() || (0, array_1.join)(as)],
                bs
            ] : [
                [''],
                as
            ]), ([[text]]) => text === '' || text.trim() !== ''), ([[text], params], rest, context) => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                const INSECURE_URI = params.shift();
                const url = new url_1.ReadonlyURL((0, link_1.resolve)(INSECURE_URI, (_a = context.host) !== null && _a !== void 0 ? _a : global_1.location, (_c = (_b = context.url) !== null && _b !== void 0 ? _b : context.host) !== null && _c !== void 0 ? _c : global_1.location), ((_d = context.host) === null || _d === void 0 ? void 0 : _d.href) || global_1.location.href);
                let cache;
                const el = global_1.undefined || (cache = (_g = (_f = (_e = context.caches) === null || _e === void 0 ? void 0 : _e.media) === null || _f === void 0 ? void 0 : _f.get(url.href)) === null || _g === void 0 ? void 0 : _g.cloneNode(true)) || (0, dom_1.html)('img', {
                    class: 'media',
                    'data-src': url.source,
                    alt: text
                });
                (cache === null || cache === void 0 ? void 0 : cache.hasAttribute('alt')) && (cache === null || cache === void 0 ? void 0 : cache.setAttribute('alt', text));
                if (!sanitize(el, url, text))
                    return [
                        [el],
                        rest
                    ];
                (0, dom_1.define)(el, (0, html_1.attributes)('media', (0, array_1.push)([], el.classList), optspec, params));
                if (((_j = (_h = context.syntax) === null || _h === void 0 ? void 0 : _h.inline) === null || _j === void 0 ? void 0 : _j.link) === false || cache && cache.tagName !== 'IMG')
                    return [
                        [el],
                        rest
                    ];
                return (0, combinator_1.fmap)(link_1.link, ([link]) => [(0, dom_1.define)(link, { target: '_blank' }, [el])])(`{ ${ INSECURE_URI }${ (0, array_1.join)(params) } }${ rest }`, context);
            }))));
            const bracket = (0, combinator_1.lazy)(() => (0, combinator_1.union)([
                (0, combinator_1.surround)((0, source_1.str)('('), (0, combinator_1.some)((0, combinator_1.union)([
                    htmlentity_1.unsafehtmlentity,
                    bracket,
                    source_1.txt
                ]), ')'), (0, source_1.str)(')'), true, global_1.undefined, ([as, bs = []], rest) => [
                    (0, array_1.unshift)(as, bs),
                    rest
                ]),
                (0, combinator_1.surround)((0, source_1.str)('['), (0, combinator_1.some)((0, combinator_1.union)([
                    htmlentity_1.unsafehtmlentity,
                    bracket,
                    source_1.txt
                ]), ']'), (0, source_1.str)(']'), true, global_1.undefined, ([as, bs = []], rest) => [
                    (0, array_1.unshift)(as, bs),
                    rest
                ]),
                (0, combinator_1.surround)((0, source_1.str)('{'), (0, combinator_1.some)((0, combinator_1.union)([
                    htmlentity_1.unsafehtmlentity,
                    bracket,
                    source_1.txt
                ]), '}'), (0, source_1.str)('}'), true, global_1.undefined, ([as, bs = []], rest) => [
                    (0, array_1.unshift)(as, bs),
                    rest
                ]),
                (0, combinator_1.surround)((0, source_1.str)('"'), (0, combinator_1.some)((0, combinator_1.union)([
                    htmlentity_1.unsafehtmlentity,
                    source_1.txt
                ]), '"'), (0, source_1.str)('"'), true)
            ]));
            const option = (0, combinator_1.union)([
                (0, combinator_1.fmap)((0, source_1.str)(/^[^\S\n]+[1-9][0-9]*x[1-9][0-9]*(?=[^\S\n]|})/), ([opt]) => [
                    ` width="${ opt.slice(1).split('x')[0] }"`,
                    ` height="${ opt.slice(1).split('x')[1] }"`
                ]),
                (0, combinator_1.fmap)((0, source_1.str)(/^[^\S\n]+[1-9][0-9]*:[1-9][0-9]*(?=[^\S\n]|})/), ([opt]) => [` aspect-ratio="${ opt.slice(1).split(':').join('/') }"`]),
                link_1.option
            ]);
            function sanitize(target, uri, alt) {
                var _a;
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
                        'data-invalid-message': `Cannot use invalid HTML entitiy "${ alt.match(/&[0-9A-Za-z]+;/)[0] }"`,
                        alt: (_a = target.getAttribute('alt')) === null || _a === void 0 ? void 0 : _a.replace(/\x1B/g, '')
                    });
                    return false;
                }
                return true;
            }
        },
        {
            '../../combinator': 25,
            '../source': 128,
            './html': 111,
            './htmlentity': 112,
            './link': 114,
            'spica/array': 6,
            'spica/global': 13,
            'spica/url': 21,
            'typed-dom/dom': 23
        }
    ],
    118: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.reference = void 0;
            const global_1 = _dereq_('spica/global');
            const combinator_1 = _dereq_('../../combinator');
            const inline_1 = _dereq_('../inline');
            const source_1 = _dereq_('../source');
            const util_1 = _dereq_('../util');
            const dom_1 = _dereq_('typed-dom/dom');
            exports.reference = (0, combinator_1.lazy)(() => (0, combinator_1.creator)((0, combinator_1.validate)('[[', ']]', '\n', (0, combinator_1.fmap)((0, combinator_1.surround)('[[', (0, combinator_1.guard)(context => {
                var _a, _b, _c;
                return (_c = (_b = (_a = context.syntax) === null || _a === void 0 ? void 0 : _a.inline) === null || _b === void 0 ? void 0 : _b.reference) !== null && _c !== void 0 ? _c : true;
            }, (0, util_1.startLoose)((0, combinator_1.context)({
                syntax: {
                    inline: {
                        annotation: false,
                        reference: false,
                        media: false
                    }
                },
                state: global_1.undefined,
                delimiters: global_1.undefined
            }, (0, combinator_1.subsequence)([
                abbr,
                (0, combinator_1.focus)(/^\^[^\S\n]*/, source => [
                    [
                        '',
                        source
                    ],
                    ''
                ]),
                (0, util_1.trimSpaceStart)((0, combinator_1.some)(inline_1.inline, ']', /^\\?\n/))
            ])))), ']]'), ns => [(0, dom_1.html)('sup', attributes(ns), (0, util_1.trimNodeEnd)((0, dom_1.defrag)(ns)))]))));
            const abbr = (0, combinator_1.creator)((0, combinator_1.fmap)((0, combinator_1.verify)((0, combinator_1.surround)('^', (0, combinator_1.union)([(0, source_1.str)(/^(?![0-9]+\s?[|\]])[0-9A-Za-z]+(?:(?:-|(?=\W)(?!'\d)'?(?!\.\d)\.?(?!,\S),? ?)[0-9A-Za-z]+)*(?:-|'?\.?,? ?)?/)]), /^\|?(?=]])|^\|[^\S\n]*/), (_, rest, context) => (0, util_1.isStartLoose)(rest, context)), ([source]) => [(0, dom_1.html)('abbr', source)]));
            function attributes(ns) {
                return typeof ns[0] === 'object' && ns[0].tagName === 'ABBR' ? {
                    class: 'reference',
                    'data-abbr': (0, util_1.stringify)([ns.shift()]).trimEnd()
                } : ns[0] === '' ? {
                    class: 'invalid',
                    'data-invalid-syntax': 'reference',
                    'data-invalid-type': 'syntax',
                    'data-invalid-message': 'Invalid abbr'
                } : { class: 'reference' };
            }
        },
        {
            '../../combinator': 25,
            '../inline': 88,
            '../source': 128,
            '../util': 134,
            'spica/global': 13,
            'typed-dom/dom': 23
        }
    ],
    119: [
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
            const dom_1 = _dereq_('typed-dom/dom');
            const array_1 = _dereq_('spica/array');
            exports.ruby = (0, combinator_1.lazy)(() => (0, combinator_1.creator)((0, combinator_1.validate)('[', ')', '\n', (0, combinator_1.bind)((0, combinator_1.verify)((0, combinator_1.sequence)([
                (0, combinator_1.surround)('[', (0, combinator_1.focus)(/^(?:\\[^\n]|[^\\\[\]\n])+(?=]\()/, text), ']'),
                (0, combinator_1.surround)('(', (0, combinator_1.focus)(/^(?:\\[^\n]|[^\\\(\)\n])+(?=\))/, text), ')')
            ]), ([texts]) => (0, util_1.isStartTightNodes)(texts)), ([texts, rubies], rest) => {
                const tail = typeof texts[texts.length - 1] === 'object' ? [texts.pop()] : [];
                tail.length === 0 && texts[texts.length - 1] === '' && texts.pop();
                switch (true) {
                case rubies.length <= texts.length:
                    return [
                        [(0, dom_1.html)('ruby', attributes(texts, rubies), (0, dom_1.defrag)((0, array_1.push)(texts.reduce((acc, _, i) => (0, array_1.push)(acc, (0, array_1.unshift)([texts[i]], i < rubies.length && rubies[i] ? [
                                (0, dom_1.html)('rp', '('),
                                (0, dom_1.html)('rt', rubies[i]),
                                (0, dom_1.html)('rp', ')')
                            ] : [(0, dom_1.html)('rt')])), []), tail)))],
                        rest
                    ];
                case texts.length === 1 && [...texts[0]].length >= rubies.length:
                    return [
                        [(0, dom_1.html)('ruby', attributes(texts, rubies), (0, dom_1.defrag)((0, array_1.push)([...texts[0]].reduce((acc, _, i, texts) => (0, array_1.push)(acc, (0, array_1.unshift)([texts[i]], i < rubies.length && rubies[i] ? [
                                (0, dom_1.html)('rp', '('),
                                (0, dom_1.html)('rt', rubies[i]),
                                (0, dom_1.html)('rp', ')')
                            ] : [(0, dom_1.html)('rt')])), []), tail)))],
                        rest
                    ];
                default:
                    return [
                        [(0, dom_1.html)('ruby', attributes(texts, rubies), (0, dom_1.defrag)((0, array_1.push)((0, array_1.unshift)([(0, array_1.join)(texts, ' ')], [
                                (0, dom_1.html)('rp', '('),
                                (0, dom_1.html)('rt', (0, array_1.join)(rubies, ' ').trim()),
                                (0, dom_1.html)('rp', ')')
                            ]), tail)))],
                        rest
                    ];
                }
            }))));
            const text = (0, combinator_1.creator)((source, context) => {
                var _a;
                const acc = [''];
                while (source !== '') {
                    switch (source[0]) {
                    case '&': {
                            const result = (0, htmlentity_1.unsafehtmlentity)(source, context);
                            if (result) {
                                acc[acc.length - 1] += (0, parser_1.eval)(result)[0];
                                source = (0, parser_1.exec)(result, source.slice(1));
                                continue;
                            }
                        }
                    default: {
                            if (source[0].trimStart() === '') {
                                acc.push('');
                                source = source.slice(1);
                                continue;
                            }
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
            function attributes(texts, rubies) {
                let attrs;
                for (const ss of [
                        texts,
                        rubies
                    ]) {
                    for (let i = 0; i < ss.length; ++i) {
                        if (ss[i].indexOf('\x1B') === -1)
                            continue;
                        ss[i] = ss[i].replace(/\x1B/g, '');
                        attrs !== null && attrs !== void 0 ? attrs : attrs = {
                            class: 'invalid',
                            'data-invalid-syntax': 'ruby',
                            'data-invalid-type': ss === texts ? 'content' : 'argument',
                            'data-invalid-message': 'Invalid HTML entity'
                        };
                    }
                }
                return attrs !== null && attrs !== void 0 ? attrs : {};
            }
        },
        {
            '../../combinator': 25,
            '../../combinator/data/parser': 45,
            '../source': 128,
            '../util': 134,
            './htmlentity': 112,
            'spica/array': 6,
            'spica/global': 13,
            'typed-dom/dom': 23
        }
    ],
    120: [
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
            '../../combinator': 25,
            './autolink/url': 97,
            './media': 117
        }
    ],
    121: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.strong = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const inline_1 = _dereq_('../inline');
            const source_1 = _dereq_('../source');
            const util_1 = _dereq_('../util');
            const dom_1 = _dereq_('typed-dom/dom');
            const array_1 = _dereq_('spica/array');
            exports.strong = (0, combinator_1.lazy)(() => (0, combinator_1.creator)((0, combinator_1.surround)((0, source_1.str)('**'), (0, util_1.startTight)((0, combinator_1.some)((0, combinator_1.union)([
                (0, combinator_1.some)(inline_1.inline, (0, util_1.blank)('', '**')),
                (0, combinator_1.open)((0, combinator_1.some)(inline_1.inline, '*'), inline_1.inline)
            ])), '*'), (0, source_1.str)('**'), false, ([, bs], rest) => [
                [(0, dom_1.html)('strong', (0, dom_1.defrag)(bs))],
                rest
            ], ([as, bs], rest) => [
                (0, array_1.unshift)(as, bs),
                rest
            ])));
        },
        {
            '../../combinator': 25,
            '../inline': 88,
            '../source': 128,
            '../util': 134,
            'spica/array': 6,
            'typed-dom/dom': 23
        }
    ],
    122: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.template = void 0;
            const global_1 = _dereq_('spica/global');
            const combinator_1 = _dereq_('../../combinator');
            const source_1 = _dereq_('../source');
            const dom_1 = _dereq_('typed-dom/dom');
            const array_1 = _dereq_('spica/array');
            exports.template = (0, combinator_1.lazy)(() => (0, combinator_1.creator)((0, combinator_1.rewrite)((0, combinator_1.surround)('{{', (0, combinator_1.some)((0, combinator_1.union)([
                bracket,
                source_1.escsource
            ]), '}'), '}}', true), source => [
                [(0, dom_1.html)('span', { class: 'template' }, source.replace(/\x1B/g, ''))],
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
            '../../combinator': 25,
            '../source': 128,
            'spica/array': 6,
            'spica/global': 13,
            'typed-dom/dom': 23
        }
    ],
    123: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.localize = void 0;
            const combinator_1 = _dereq_('../combinator');
            const ja_1 = _dereq_('./locale/ja');
            const dom_1 = _dereq_('typed-dom/dom');
            function localize(parser) {
                return (0, combinator_1.fmap)(parser, ns => {
                    if (ns.length === 0)
                        return ns;
                    const el = ns.length === 1 && typeof ns[0] === 'object' ? ns[0] : (0, dom_1.html)('div', ns);
                    const es = el.querySelectorAll('.linebreak:not(:empty)');
                    for (let i = 0, len = es.length; i < len; ++i) {
                        const sb = es[i];
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
                var _a, _b;
                while (node = node === null || node === void 0 ? void 0 : node.previousSibling) {
                    if (!('id' in node))
                        return (_a = [...node.data.slice(-2)].pop()) !== null && _a !== void 0 ? _a : '';
                    if (node.firstChild)
                        return (_b = [...text(node).slice(-2)].pop()) !== null && _b !== void 0 ? _b : '';
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
                        if ('id' in child)
                            continue;
                        return child.data;
                    }
                    return '';
                default:
                    return el.textContent;
                }
            }
        },
        {
            '../combinator': 25,
            './locale/ja': 124,
            'typed-dom/dom': 23
        }
    ],
    124: [
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
    125: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.figure = void 0;
            const global_1 = _dereq_('spica/global');
            const label_1 = _dereq_('../inline/extension/label');
            const dom_1 = _dereq_('typed-dom/dom');
            const multimap_1 = _dereq_('spica/multimap');
            const array_1 = _dereq_('spica/array');
            function* figure(target, footnotes, opts = {}) {
                var _a, _b, _c, _d;
                const refs = new multimap_1.MultiMap((0, array_1.push)((0, array_1.push)((0, array_1.push)([], target.querySelectorAll('a.label:not(.disabled)[data-label]')), (_a = footnotes === null || footnotes === void 0 ? void 0 : footnotes.annotations.querySelectorAll('a.label:not(.disabled)')) !== null && _a !== void 0 ? _a : []), (_b = footnotes === null || footnotes === void 0 ? void 0 : footnotes.references.querySelectorAll('a.label:not(.disabled)')) !== null && _b !== void 0 ? _b : []).map(el => [
                    el.getAttribute('data-label'),
                    el
                ]));
                const labels = new global_1.Set();
                const numbers = new global_1.Map();
                let base = '0';
                let bases = base.split('.');
                let index = bases;
                for (let defs = target.querySelectorAll('figure[data-label], h1, h2'), i = 0, len = defs.length; i < len; ++i) {
                    yield;
                    const def = defs[i];
                    if (def.parentNode !== target)
                        continue;
                    const {tagName} = def;
                    if (bases.length === 1 && tagName[0] === 'H')
                        continue;
                    const label = tagName === 'FIGURE' ? def.getAttribute('data-label') : `$-${ increment(index, def) }`;
                    if (label.endsWith('-'))
                        continue;
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
                        if (label.lastIndexOf('.', label.length - 3) !== -1) {
                            (0, dom_1.define)(def, {
                                class: void def.classList.add('invalid'),
                                'data-invalid-syntax': 'figure',
                                'data-invalid-type': 'argument',
                                'data-invalid-message': 'Base index must be $-x.0 format',
                                hidden: null
                            });
                            continue;
                        }
                        if (!/^H[1-6]$/.test((_d = (_c = def.previousElementSibling) === null || _c === void 0 ? void 0 : _c.tagName) !== null && _d !== void 0 ? _d : '')) {
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
                    let number = (0, label_1.number)(label, numbers.has(group) && !(0, label_1.isFixed)(label) ? (0, array_1.join)(numbers.get(group).split('.').slice(0, bases.length), '.') : base);
                    if (number.endsWith('.0')) {
                        if (group !== '$' || tagName === 'FIGURE' && def.firstChild)
                            continue;
                        if (number.startsWith('0.')) {
                            number = (0, array_1.join)(index.slice(0).reduce((ns, _, i, xs) => {
                                i === ns.length ? xs.length = i : ns[i] = +ns[i] > +xs[i] ? ns[i] : +ns[i] === 0 ? xs[i] : `${ +xs[i] + 1 }`;
                                return ns;
                            }, number.split('.')), '.');
                        }
                        base = number;
                        bases = index = base.split('.');
                        tagName !== 'FIGURE' && numbers.clear();
                        continue;
                    }
                    !(0, label_1.isFixed)(label) && numbers.set(group, number);
                    const figindex = group === '$' ? `(${ number })` : `${ capitalize(group) }${ group === 'fig' ? '.' : '' } ${ number }`;
                    (0, dom_1.define)(def.querySelector(':scope > figcaption > .figindex'), group === '$' ? figindex : `${ figindex }. `);
                    if (labels.has(label)) {
                        if (def.classList.contains('invalid'))
                            continue;
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
                    opts.id !== '' && def.setAttribute('id', `label:${ opts.id ? `${ opts.id }:` : '' }${ label }`);
                    for (const ref of refs.take(label, global_1.Infinity)) {
                        if (ref.getAttribute('data-invalid-message') === messages.reference) {
                            (0, dom_1.define)(ref, {
                                class: void ref.classList.remove('invalid'),
                                'data-invalid-syntax': null,
                                'data-invalid-type': null,
                                'data-invalid-message': null
                            });
                        }
                        if (ref.hash.slice(1) === def.id && ref.innerText === figindex)
                            continue;
                        yield (0, dom_1.define)(ref, opts.id !== '' ? { href: `#${ def.id }` } : { class: `${ ref.className } disabled` }, figindex);
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
            '../inline/extension/label': 109,
            'spica/array': 6,
            'spica/global': 13,
            'spica/multimap': 17,
            'typed-dom/dom': 23
        }
    ],
    126: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.reference = exports.annotation = exports.footnote = void 0;
            const global_1 = _dereq_('spica/global');
            const indexee_1 = _dereq_('../inline/extension/indexee');
            const dom_1 = _dereq_('typed-dom/dom');
            const multimap_1 = _dereq_('spica/multimap');
            const memoize_1 = _dereq_('spica/memoize');
            function* footnote(target, footnotes, opts = {}) {
                yield* (0, exports.reference)(target, footnotes === null || footnotes === void 0 ? void 0 : footnotes.references, opts, (footnotes === null || footnotes === void 0 ? void 0 : footnotes.annotations) && [footnotes.annotations]);
                yield* (0, exports.annotation)(target, footnotes === null || footnotes === void 0 ? void 0 : footnotes.annotations, opts, []);
                return;
            }
            exports.footnote = footnote;
            exports.annotation = build('annotation', n => `*${ n }`);
            exports.reference = build('reference', (n, abbr) => `[${ abbr || n }]`);
            function build(syntax, marker) {
                const identify = (0, memoize_1.memoize)(ref => `${ +!ref.querySelector('.label') }:${ ref.getAttribute('data-abbr') || '_' + ref.innerHTML }`, new global_1.WeakMap());
                const contentify = (0, memoize_1.memoize)(ref => (0, dom_1.frag)(ref.cloneNode(true).childNodes), new global_1.WeakMap());
                return function* (target, footnote, opts = {}, footnotes = []) {
                    var _a, _b;
                    const defs = new global_1.Map();
                    const buffer = new multimap_1.MultiMap();
                    const titles = new global_1.Map();
                    const check = footnotes.some(el => target.contains(el));
                    let style;
                    for (let refs = target.querySelectorAll(`sup.${ syntax }:not(.disabled)`), i = 0, len = refs.length; i < len; ++i) {
                        yield;
                        const ref = refs[i];
                        if (check && footnotes.some(el => el.contains(ref)))
                            continue;
                        const identifier = identify(ref);
                        const abbr = ref.getAttribute('data-abbr') || global_1.undefined;
                        const content = contentify(ref);
                        style !== null && style !== void 0 ? style : style = abbr ? 'abbr' : 'count';
                        if (style === 'count' ? abbr : !abbr) {
                            (0, dom_1.define)(ref, {
                                class: void ref.classList.add('invalid'),
                                'data-invalid-syntax': syntax,
                                'data-invalid-type': 'style',
                                'data-invalid-message': `${ syntax[0].toUpperCase() + syntax.slice(1) } style must be consistent`
                            });
                        }
                        if (((_a = ref.firstElementChild) === null || _a === void 0 ? void 0 : _a.getAttribute('hidden')) !== '') {
                            ref.replaceChildren((0, dom_1.html)('span', { hidden: '' }, ref.childNodes));
                        } else {
                            (_b = ref.lastChild) === null || _b === void 0 ? void 0 : _b.remove();
                        }
                        const title = global_1.undefined || titles.get(identifier) || +identifier[0] && ref.title || (0, indexee_1.text)(content).trim() || content.textContent.trim() || global_1.undefined;
                        title ? !titles.has(identifier) && titles.set(identifier, title) : buffer.set(identifier, ref);
                        const blank = !!abbr && !content.firstChild;
                        const refIndex = i + 1;
                        const refId = opts.id !== '' ? ref.id || `${ syntax }:${ opts.id ? `${ opts.id }:` : '' }ref:${ refIndex }` : global_1.undefined;
                        const def = global_1.undefined || defs.get(identifier) || defs.set(identifier, (0, dom_1.html)('li', { id: opts.id !== '' ? `${ syntax }:${ opts.id ? `${ opts.id }:` : '' }def:${ defs.size + 1 }` : global_1.undefined }, [
                            content.cloneNode(true),
                            (0, dom_1.html)('sup')
                        ])).get(identifier);
                        if (title && !blank && def.childNodes.length === 1) {
                            def.insertBefore(content.cloneNode(true), def.lastChild);
                            for (const ref of buffer.take(identifier, global_1.Infinity)) {
                                if (ref.getAttribute('data-invalid-type') !== 'content')
                                    continue;
                                (0, dom_1.define)(ref, {
                                    title,
                                    class: void ref.classList.remove('invalid'),
                                    'data-invalid-syntax': null,
                                    'data-invalid-type': null,
                                    'data-invalid-message': null
                                });
                            }
                        }
                        const defIndex = +def.id.slice(def.id.lastIndexOf(':') + 1) || defs.size;
                        const defId = def.id || global_1.undefined;
                        (0, dom_1.define)(ref, {
                            id: refId,
                            class: opts.id !== '' ? global_1.undefined : `${ ref.className } disabled`,
                            ...title ? { title } : {
                                class: void ref.classList.add('invalid'),
                                'data-invalid-syntax': syntax,
                                'data-invalid-type': 'content',
                                'data-invalid-message': 'Missing the content'
                            }
                        });
                        yield ref.appendChild((0, dom_1.html)('a', { href: refId && defId && `#${ defId }` }, marker(defIndex, abbr)));
                        def.lastChild.appendChild((0, dom_1.html)('a', {
                            href: refId && `#${ refId }`,
                            title: abbr && !blank ? title : global_1.undefined
                        }, `^${ refIndex }`));
                    }
                    if (!footnote)
                        return;
                    const {children} = footnote;
                    const size = defs.size;
                    let count = 0;
                    let length = children.length;
                    I:
                        for (const def of defs.values()) {
                            ++count;
                            while (length > size) {
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
                    while (length > size) {
                        yield footnote.removeChild(children[size]);
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
            '../inline/extension/indexee': 107,
            'spica/global': 13,
            'spica/memoize': 16,
            'spica/multimap': 17,
            'typed-dom/dom': 23
        }
    ],
    127: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.validate = exports.segment = exports.MAX_INPUT_SIZE = exports.MAX_SEGMENT_SIZE = void 0;
            const global_1 = _dereq_('spica/global');
            const parser_1 = _dereq_('../combinator/data/parser');
            const combinator_1 = _dereq_('../combinator');
            const heading_1 = _dereq_('./block/heading');
            const codeblock_1 = _dereq_('./block/codeblock');
            const mathblock_1 = _dereq_('./block/mathblock');
            const extension_1 = _dereq_('./block/extension');
            const source_1 = _dereq_('./source');
            exports.MAX_SEGMENT_SIZE = 100000;
            exports.MAX_INPUT_SIZE = exports.MAX_SEGMENT_SIZE * 10;
            const parser = (0, combinator_1.union)([
                heading_1.segment,
                codeblock_1.segment,
                mathblock_1.segment,
                extension_1.segment,
                (0, combinator_1.some)(source_1.contentline, exports.MAX_SEGMENT_SIZE * 2),
                (0, combinator_1.some)(source_1.emptyline, exports.MAX_SEGMENT_SIZE * 2)
            ]);
            function* segment(source) {
                if (!validate(source, exports.MAX_INPUT_SIZE))
                    return yield `\x07Too large input over ${ exports.MAX_INPUT_SIZE.toLocaleString('en') } bytes.\n${ source.slice(0, 1001) }`;
                while (source !== '') {
                    const result = parser(source, {});
                    const rest = (0, parser_1.exec)(result);
                    const segs = (0, parser_1.eval)(result).length ? (0, parser_1.eval)(result) : [source.slice(0, source.length - rest.length)];
                    for (let i = 0; i < segs.length; ++i) {
                        const seg = segs[i];
                        validate(seg, exports.MAX_SEGMENT_SIZE) ? yield seg : yield `\x07Too large segment over ${ exports.MAX_SEGMENT_SIZE.toLocaleString('en') } bytes.\n${ seg }`;
                    }
                    source = rest;
                }
            }
            exports.segment = segment;
            function validate(source, size) {
                return source.length <= size / 4 || source.length <= size && new global_1.Blob([source]).size <= size;
            }
            exports.validate = validate;
        },
        {
            '../combinator': 25,
            '../combinator/data/parser': 45,
            './block/codeblock': 63,
            './block/extension': 65,
            './block/heading': 74,
            './block/mathblock': 78,
            './source': 128,
            'spica/global': 13
        }
    ],
    128: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.anyline = exports.emptyline = exports.contentline = exports.stropt = exports.str = exports.unescsource = exports.escsource = exports.linebreak = exports.txt = exports.text = void 0;
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
            Object.defineProperty(exports, 'stropt', {
                enumerable: true,
                get: function () {
                    return str_1.stropt;
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
            './source/escapable': 129,
            './source/line': 130,
            './source/str': 131,
            './source/text': 132,
            './source/unescapable': 133
        }
    ],
    129: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.escsource = void 0;
            const combinator_1 = _dereq_('../../combinator');
            const text_1 = _dereq_('./text');
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
                    case '\x1B':
                        return [
                            [source.slice(1, 2)],
                            source.slice(2)
                        ];
                    case '\\':
                        return [
                            [source.slice(0, 2)],
                            source.slice(2)
                        ];
                    default:
                        const b = source[0] !== '\n' && source[0].trimStart() === '';
                        const i = b ? source.search(text_1.nonWhitespace) : 1;
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
            '../../combinator': 25,
            './text': 132
        }
    ],
    130: [
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
            '../../combinator': 25,
            'spica/global': 13
        }
    ],
    131: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.stropt = exports.str = void 0;
            const global_1 = _dereq_('spica/global');
            const combinator_1 = _dereq_('../../combinator');
            function str(pattern) {
                return typeof pattern === 'string' ? (0, combinator_1.creator)(source => {
                    if (source === '')
                        return;
                    return source.slice(0, pattern.length) === pattern ? [
                        [pattern],
                        source.slice(pattern.length)
                    ] : global_1.undefined;
                }) : (0, combinator_1.creator)(source => {
                    if (source === '')
                        return;
                    const m = source.match(pattern);
                    return m && m[0].length > 0 ? [
                        [m[0]],
                        source.slice(m[0].length)
                    ] : global_1.undefined;
                });
            }
            exports.str = str;
            function stropt(pattern) {
                return typeof pattern === 'string' ? (0, combinator_1.creator)(source => {
                    if (source === '')
                        return;
                    return source.slice(0, pattern.length) === pattern ? [
                        [pattern],
                        source.slice(pattern.length)
                    ] : [
                        [],
                        source
                    ];
                }) : (0, combinator_1.creator)(source => {
                    if (source === '')
                        return;
                    const m = source.match(pattern);
                    return m ? [
                        [m[0]],
                        source.slice(m[0].length)
                    ] : [
                        [],
                        source
                    ];
                });
            }
            exports.stropt = stropt;
        },
        {
            '../../combinator': 25,
            'spica/global': 13
        }
    ],
    132: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.isAlphanumeric = exports.linebreak = exports.txt = exports.text = exports.nonAlphanumeric = exports.nonWhitespace = exports.separator = void 0;
            const global_1 = _dereq_('spica/global');
            const combinator_1 = _dereq_('../../combinator');
            const str_1 = _dereq_('./str');
            const dom_1 = _dereq_('typed-dom/dom');
            exports.separator = /[\s\x00-\x7F]|\S#|[、。！？][^\S\n]*(?=\\\n)/;
            exports.nonWhitespace = /[\S\n]|$/;
            exports.nonAlphanumeric = /[^0-9A-Za-z]|\S#|$/;
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
                    case '\x1B':
                    case '\\':
                        switch (source[1]) {
                        case '\u3001':
                        case '\u3002':
                        case '\uFF01':
                        case '\uFF1F':
                            return (0, exports.text)(source.slice(1), context);
                        }
                        break;
                    case '\u3001':
                    case '\u3002':
                    case '\uFF01':
                    case '\uFF1F':
                        const i = source.slice(1).search(exports.nonWhitespace) + 1;
                        if (i > 0 && source.slice(i, i + 2) === '\\\n')
                            return [
                                [
                                    source[0],
                                    (0, dom_1.html)('span', { class: 'linebreak' })
                                ],
                                source.slice(i + 2)
                            ];
                    }
                    switch (source[0]) {
                    case '\x1B':
                    case '\\':
                        switch (source[1]) {
                        case global_1.undefined:
                            return [
                                [],
                                ''
                            ];
                        case '\n':
                            return [
                                [(0, dom_1.html)('span', { class: 'linebreak' }, ' ')],
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
                            [(0, dom_1.html)('br')],
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
                    default:
                        const b = source[0].trimStart() === '';
                        const i = b || isAlphanumeric(source[0]) ? source.search(b ? exports.nonWhitespace : exports.nonAlphanumeric) || 1 : 1;
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
            exports.linebreak = (0, combinator_1.focus)('\n', (0, combinator_1.union)([exports.text]));
            function isAlphanumeric(char) {
                if (char < '0' || '\x7F' < char)
                    return false;
                return '0' <= char && char <= '9' || 'a' <= char && char <= 'z' || 'A' <= char && char <= 'Z';
            }
            exports.isAlphanumeric = isAlphanumeric;
        },
        {
            '../../combinator': 25,
            './str': 131,
            'spica/global': 13,
            'typed-dom/dom': 23
        }
    ],
    133: [
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
                        const i = b || (0, text_1.isAlphanumeric)(source[0]) ? source.search(b ? text_1.nonWhitespace : text_1.nonAlphanumeric) || 1 : 1;
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
            '../../combinator': 25,
            './text': 132
        }
    ],
    134: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.stringify = exports.trimNodeEnd = exports.trimSpaceStart = exports.isStartTightNodes = exports.startTight = exports.isStartLoose = exports.startLoose = exports.visualize = exports.blank = void 0;
            const global_1 = _dereq_('spica/global');
            const parser_1 = _dereq_('../combinator/data/parser');
            const combinator_1 = _dereq_('../combinator');
            const htmlentity_1 = _dereq_('./inline/htmlentity');
            const source_1 = _dereq_('./source');
            const normalize_1 = _dereq_('./api/normalize');
            const memoize_1 = _dereq_('spica/memoize');
            const array_1 = _dereq_('spica/array');
            function blank(prefix, suffix) {
                return new RegExp(String.raw`^${ prefix && prefix.source }(?:\\\s|[^\S\n]+|\n|&(?:${ normalize_1.invisibleHTMLEntityNames.join('|') });|<wbr>)?${ typeof suffix === 'string' ? suffix.replace(/[*+()\[\]]/g, '\\$&') : suffix.source }`);
            }
            exports.blank = blank;
            function visualize(parser) {
                const blankline = new RegExp(String.raw`^(?:\\$|\\?[^\S\n]|&(?:${ normalize_1.invisibleHTMLEntityNames.join('|') });|<wbr>)+$`, 'gm');
                return (0, combinator_1.union)([
                    (0, combinator_1.convert)(source => source.replace(blankline, line => line.replace(/[\\&<]/g, '\x1B$&')), (0, combinator_1.verify)(parser, (ns, rest, context) => !rest && hasVisible(ns, context))),
                    (0, combinator_1.some)((0, combinator_1.union)([
                        source_1.linebreak,
                        source_1.unescsource
                    ]))
                ]);
            }
            exports.visualize = visualize;
            function hasVisible(nodes, {
                syntax: {
                    inline: {
                        media = true
                    } = {}
                } = {}
            } = {}) {
                for (let i = 0; i < nodes.length; ++i) {
                    const node = nodes[i];
                    if (typeof node === 'string') {
                        if (node && node.trimStart())
                            return true;
                    } else {
                        if (node.innerText.trimStart())
                            return true;
                        if (media && (node.classList.contains('media') || node.getElementsByClassName('media')[0]))
                            return true;
                    }
                }
                return false;
            }
            function startLoose(parser, except) {
                return (source, context) => (0, exports.isStartLoose)(source, context, except) ? parser(source, context) : global_1.undefined;
            }
            exports.startLoose = startLoose;
            exports.isStartLoose = (0, memoize_1.reduce)((source, context, except) => {
                return isStartTight(source.replace(/^[^\S\n]+/, ''), context, except);
            }, (source, _, except = '') => `${ source }\x1E${ except }`);
            function startTight(parser, except) {
                return (source, context) => isStartTight(source, context, except) ? parser(source, context) : global_1.undefined;
            }
            exports.startTight = startTight;
            const isStartTight = (0, memoize_1.reduce)((source, context, except) => {
                var _a, _b, _c;
                if (source === '')
                    return true;
                if (except && source.slice(0, except.length) === except)
                    return false;
                switch (source[0]) {
                case ' ':
                case '\u3000':
                case '\t':
                case '\n':
                    return false;
                case '\\':
                    return ((_a = source[1]) === null || _a === void 0 ? void 0 : _a.trimStart()) !== '';
                case '&':
                    switch (true) {
                    case source.length > 2 && source[1] !== ' ' && ((_c = (_b = (0, parser_1.eval)((0, htmlentity_1.unsafehtmlentity)(source, context))) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.trimStart()) === '':
                        return false;
                    }
                    return true;
                case '<':
                    switch (true) {
                    case source.length >= 5 && source[1] === 'w' && source.slice(0, 5) === '<wbr>':
                        return false;
                    }
                    return true;
                default:
                    return source[0].trimStart() !== '';
                }
            }, (source, _, except = '') => `${ source }\x1E${ except }`);
            function isStartTightNodes(nodes) {
                if (nodes.length === 0)
                    return true;
                return isVisible(nodes[0], 0);
            }
            exports.isStartTightNodes = isStartTightNodes;
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
            function trimSpaceStart(parser) {
                return (0, combinator_1.convert)((0, memoize_1.reduce)(source => source.replace(/^[^\S\n]+/, '')), parser);
            }
            exports.trimSpaceStart = trimSpaceStart;
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
            exports.trimNodeEnd = trimNodeEnd;
            function stringify(nodes) {
                let acc = '';
                for (let i = 0; i < nodes.length; ++i) {
                    const node = nodes[i];
                    if (typeof node === 'string') {
                        acc += node;
                    } else {
                        acc += node.innerText;
                    }
                }
                return acc;
            }
            exports.stringify = stringify;
        },
        {
            '../combinator': 25,
            '../combinator/data/parser': 45,
            './api/normalize': 58,
            './inline/htmlentity': 112,
            './source': 128,
            'spica/array': 6,
            'spica/global': 13,
            'spica/memoize': 16
        }
    ],
    135: [
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
        { './renderer/render': 136 }
    ],
    136: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.render = void 0;
            const global_1 = _dereq_('spica/global');
            const code_1 = _dereq_('./render/code');
            const math_1 = _dereq_('./render/math');
            const media_1 = _dereq_('./render/media');
            const query_1 = _dereq_('typed-dom/query');
            const memoize_1 = _dereq_('spica/memoize');
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
                for (const el of (0, query_1.querySelectorAll)(source, selector)) {
                    render_(base, el, opts);
                }
            }
            exports.render = render;
            function render_(base, source, opts) {
                var _a, _b, _c;
                if (source.classList.contains('invalid'))
                    return;
                try {
                    switch (true) {
                    case !!opts.code && !source.firstElementChild && source.matches('pre.code'):
                        return void opts.code(source, (_a = opts.caches) === null || _a === void 0 ? void 0 : _a.code);
                    case !!opts.math && !source.firstElementChild && source.matches('.math'):
                        return void opts.math(source, (_b = opts.caches) === null || _b === void 0 ? void 0 : _b.math);
                    case source.matches('.media:not(img)'):
                        return void source.parentElement.parentElement.replaceChild(source, source.parentElement);
                    case !!opts.media && source.matches('img.media:not([src])[data-src]'): {
                            const el = (0, media_1.media)(base, source, opts.media, (_c = opts.caches) === null || _c === void 0 ? void 0 : _c.media);
                            if (!el)
                                return;
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
        },
        {
            './render/code': 137,
            './render/math': 138,
            './render/media': 139,
            'spica/global': 13,
            'spica/memoize': 16,
            'typed-dom/query': 24
        }
    ],
    137: [
        function (_dereq_, module, exports) {
            (function (global) {
                (function () {
                    'use strict';
                    var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
                        if (k2 === undefined)
                            k2 = k;
                        var desc = Object.getOwnPropertyDescriptor(m, k);
                        if (!desc || ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)) {
                            desc = {
                                enumerable: true,
                                get: function () {
                                    return m[k];
                                }
                            };
                        }
                        Object.defineProperty(o, k2, desc);
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
                        Prism.highlightElement(target, false, () => {
                            var _a;
                            return void (cache === null || cache === void 0 ? void 0 : cache.set(`${ (_a = target.getAttribute('data-lang')) !== null && _a !== void 0 ? _a : '' }\n${ source }`, target.cloneNode(true)));
                        });
                    }
                    exports.code = code;
                }.call(this));
            }.call(this, typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {}));
        },
        {}
    ],
    138: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.math = void 0;
            const global_1 = _dereq_('spica/global');
            const dom_1 = _dereq_('typed-dom/dom');
            function math(target, cache) {
                const source = target.textContent;
                queue(target, () => {
                    var _a;
                    !((_a = target.textContent) === null || _a === void 0 ? void 0 : _a.trim()) && (0, dom_1.define)(target, [(0, dom_1.html)('span', source)]);
                    return void (cache === null || cache === void 0 ? void 0 : cache.set(source, target.cloneNode(true)));
                });
            }
            exports.math = math;
            async function queue(target, callback = () => global_1.undefined) {
                !MathJax.typesetPromise && await MathJax.startup.promise;
                MathJax.typesetPromise([target]).then(callback);
            }
        },
        {
            'spica/global': 13,
            'typed-dom/dom': 23
        }
    ],
    139: [
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
            const memoize_1 = _dereq_('spica/memoize');
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
                var _a, _b, _c, _d, _e, _f;
                opts = extend(opts);
                const url = new url_1.ReadonlyURL(source.getAttribute('data-src'), base);
                return ((_a = opts.twitter) === null || _a === void 0 ? void 0 : _a.call(opts, source, url)) || ((_b = opts.youtube) === null || _b === void 0 ? void 0 : _b.call(opts, source, url)) || ((_c = opts.pdf) === null || _c === void 0 ? void 0 : _c.call(opts, source, url)) || ((_d = opts.video) === null || _d === void 0 ? void 0 : _d.call(opts, source, url)) || ((_e = opts.audio) === null || _e === void 0 ? void 0 : _e.call(opts, source, url)) || ((_f = opts.image) === null || _f === void 0 ? void 0 : _f.call(opts, source, url, cache));
            }
            exports.media = media;
        },
        {
            './media/audio': 140,
            './media/image': 141,
            './media/pdf': 142,
            './media/twitter': 143,
            './media/video': 144,
            './media/youtube': 145,
            'spica/memoize': 16,
            'spica/url': 21
        }
    ],
    140: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.audio = void 0;
            const dom_1 = _dereq_('typed-dom/dom');
            const extensions = [
                '.oga',
                '.ogg'
            ];
            function audio(source, url) {
                if (!extensions.includes(url.pathname.split(/(?=\.)/).pop()))
                    return;
                return (0, dom_1.html)('audio', {
                    class: source.className,
                    'data-type': 'audio',
                    src: source.getAttribute('data-src'),
                    alt: source.alt,
                    controls: ''
                });
            }
            exports.audio = audio;
        },
        { 'typed-dom/dom': 23 }
    ],
    141: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.image = void 0;
            const dom_1 = _dereq_('typed-dom/dom');
            const alias_1 = _dereq_('spica/alias');
            function image(source, url, cache) {
                if (cache === null || cache === void 0 ? void 0 : cache.has(url.href))
                    return (0, dom_1.define)(cache.get(url.href).cloneNode(true), (0, alias_1.ObjectFromEntries)([...source.attributes].map(attr => [
                        attr.name,
                        attr.value
                    ])));
                (0, dom_1.define)(source, {
                    'data-type': 'image',
                    src: source.getAttribute('data-src'),
                    loading: 'lazy'
                });
                cache === null || cache === void 0 ? void 0 : cache.set(url.href, (0, dom_1.define)(source.cloneNode(true), (0, alias_1.ObjectFromEntries)([...source.attributes].filter(attr => ![
                    'class',
                    'data-type',
                    'data-src',
                    'src',
                    'loading'
                ].includes(attr.name)).map(attr => [
                    attr.name,
                    null
                ]))));
                return source;
            }
            exports.image = image;
        },
        {
            'spica/alias': 5,
            'typed-dom/dom': 23
        }
    ],
    142: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.pdf = void 0;
            const parser_1 = _dereq_('../../../parser');
            const dom_1 = _dereq_('typed-dom/dom');
            const extensions = ['.pdf'];
            function pdf(source, url) {
                if (!extensions.includes(url.pathname.split(/(?=\.)/).pop()))
                    return;
                return (0, dom_1.html)('div', {
                    class: source.className,
                    'data-type': 'pdf'
                }, [
                    (0, dom_1.html)('object', {
                        type: 'application/pdf',
                        data: source.getAttribute('data-src')
                    }),
                    (0, dom_1.html)('div', [(0, dom_1.define)((0, parser_1.parse)(`{ ${ source.getAttribute('data-src') } }`).querySelector('a'), { target: '_blank' })])
                ]);
            }
            exports.pdf = pdf;
        },
        {
            '../../../parser': 52,
            'typed-dom/dom': 23
        }
    ],
    143: [
        function (_dereq_, module, exports) {
            (function (global) {
                (function () {
                    'use strict';
                    Object.defineProperty(exports, '__esModule', { value: true });
                    exports.twitter = void 0;
                    const global_1 = _dereq_('spica/global');
                    const parser_1 = _dereq_('../../../parser');
                    const dom_1 = _dereq_('typed-dom/dom');
                    const dompurify_1 = typeof window !== 'undefined' ? window['DOMPurify'] : typeof global !== 'undefined' ? global['DOMPurify'] : null;
                    const origins = ['https://twitter.com'];
                    function twitter(source, url) {
                        if (!origins.includes(url.origin))
                            return;
                        if (url.pathname.split('/').pop().includes('.'))
                            return;
                        if (!url.pathname.match(/^\/\w+\/status\/[0-9]{15,}(?!\w)/))
                            return;
                        const el = (0, dom_1.html)('div', {
                            class: source.className,
                            'data-type': 'twitter'
                        }, [(0, dom_1.html)('em', `Loading ${ source.getAttribute('data-src') }...`)]);
                        $.ajax(`https://publish.twitter.com/oembed?url=${ url.href.replace('?', '&') }&omit_script=true`, {
                            dataType: 'jsonp',
                            timeout: 10 * 1000,
                            cache: true,
                            success({html}) {
                                el.innerHTML = (0, dompurify_1.sanitize)(html);
                                if (global_1.window.twttr)
                                    return void global_1.window.twttr.widgets.load(el);
                                const id = 'twitter-wjs';
                                if (global_1.document.getElementById(id))
                                    return;
                                global_1.document.body.appendChild((0, dom_1.html)('script', {
                                    id,
                                    src: 'https://platform.twitter.com/widgets.js'
                                }));
                            },
                            error({status, statusText}) {
                                (0, dom_1.define)(el, [(0, parser_1.parse)(`*{ ${ source.getAttribute('data-src') } }*\n\n\`\`\`\n${ status }\n${ statusText }\n\`\`\``)]);
                            }
                        });
                        return el;
                    }
                    exports.twitter = twitter;
                }.call(this));
            }.call(this, typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {}));
        },
        {
            '../../../parser': 52,
            'spica/global': 13,
            'typed-dom/dom': 23
        }
    ],
    144: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.video = void 0;
            const dom_1 = _dereq_('typed-dom/dom');
            const alias_1 = _dereq_('spica/alias');
            const extensions = [
                '.webm',
                '.ogv'
            ];
            function video(source, url) {
                if (!extensions.includes(url.pathname.split(/(?=\.)/).pop()))
                    return;
                return (0, dom_1.html)('video', {
                    src: source.getAttribute('data-src'),
                    'data-type': 'video',
                    ...(0, alias_1.ObjectFromEntries)([...source.attributes].map(attr => [
                        attr.name,
                        attr.value
                    ])),
                    muted: '',
                    controls: ''
                });
            }
            exports.video = video;
        },
        {
            'spica/alias': 5,
            'typed-dom/dom': 23
        }
    ],
    145: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.youtube = void 0;
            const dom_1 = _dereq_('typed-dom/dom');
            function youtube(source, url) {
                const id = resolve(url);
                if (!id)
                    return;
                return (0, dom_1.html)('div', {
                    class: source.className,
                    'data-type': 'youtube'
                }, [(0, dom_1.html)('iframe', {
                        src: `https://www.youtube.com/embed/${ id }`,
                        allow: 'fullscreen',
                        loading: 'lazy'
                    })]);
            }
            exports.youtube = youtube;
            function resolve(url) {
                var _a;
                switch (url.origin) {
                case 'https://www.youtube.com':
                    return url.pathname.match(/^\/watch\/?$/) ? (_a = url.searchParams.get('v')) === null || _a === void 0 ? void 0 : _a.concat(url.search.replace(/([?&])v=[^&#]*&?/g, '$1'), url.hash) : undefined;
                case 'https://youtu.be':
                    return url.pathname.match(/^\/[\w-]+\/?$/) ? url.href.slice(url.origin.length) : undefined;
                default:
                    return;
                }
            }
        },
        { 'typed-dom/dom': 23 }
    ],
    146: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.scope = exports.info = exports.toc = exports.quote = void 0;
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
            var scope_1 = _dereq_('./util/scope');
            Object.defineProperty(exports, 'scope', {
                enumerable: true,
                get: function () {
                    return scope_1.scope;
                }
            });
        },
        {
            './util/info': 147,
            './util/quote': 148,
            './util/scope': 149,
            './util/toc': 150
        }
    ],
    147: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.info = void 0;
            const scope_1 = _dereq_('./scope');
            const query_1 = _dereq_('typed-dom/query');
            function info(source) {
                const match = (0, scope_1.scope)(source, '.invalid');
                return {
                    url: find('a:not(.email):not(.account):not(.channel):not(.hashtag):not(.hashnum):not(.anchor)').filter(el => [
                        'http:',
                        'https:'
                    ].includes(el.protocol)),
                    tel: find('a:not(.email):not(.account):not(.channel):not(.hashtag):not(.hashnum):not(.anchor)').filter(el => ['tel:'].includes(el.protocol)),
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
                    return (0, query_1.querySelectorAll)(source, selector).filter(match);
                }
            }
            exports.info = info;
        },
        {
            './scope': 149,
            'typed-dom/query': 24
        }
    ],
    148: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.quote = void 0;
            const global_1 = _dereq_('spica/global');
            const parser_1 = _dereq_('../combinator/data/parser');
            const cite_1 = _dereq_('../parser/block/reply/cite');
            const dom_1 = _dereq_('typed-dom/dom');
            function quote(anchor, range) {
                var _a, _b;
                if ((0, parser_1.exec)((0, cite_1.cite)(`>>${ anchor }`, {})) !== '')
                    throw new Error(`Invalid anchor: ${ anchor }`);
                fit(range);
                const node = trim(range.cloneContents());
                if (!node.firstChild)
                    return '';
                for (let es = node.querySelectorAll('code[data-src], .math[data-src], .media[data-src], rt, rp'), i = 0, len = es.length; i < len; ++i) {
                    const el = es[i];
                    switch (true) {
                    case el.matches('code'):
                    case el.matches('.math'):
                        (0, dom_1.define)(el, el.getAttribute('data-src'));
                        continue;
                    case el.matches('.media'):
                        el.replaceWith(/[\s{}]/.test(el.getAttribute('data-src')) ? `!{ ${ el.getAttribute('data-src') } }` : `!{${ el.getAttribute('data-src') }}`);
                        continue;
                    case el.matches('rt, rp'):
                        el.remove();
                        continue;
                    }
                }
                if (range.startOffset === 0 && ((_a = range.startContainer.parentElement) === null || _a === void 0 ? void 0 : _a.matches('.cite, .quote')) && (!range.startContainer.previousSibling || range.startContainer.previousSibling.nodeName === 'BR')) {
                    node.prepend(`>${ range.startContainer.parentElement.matches('.quote.invalid') ? ' ' : '' }`);
                } else {
                    node.prepend(`>>${ anchor }\n> `);
                    anchor = '';
                }
                for (let es = node.querySelectorAll('br'), i = 0, len = es.length; i < len; ++i) {
                    const el = es[i];
                    if (anchor && el.nextSibling instanceof global_1.Element && el.nextSibling.matches('.cite, .quote')) {
                        el.replaceWith(`\n>${ el.nextSibling.matches('.quote.invalid') ? ' ' : '' }`);
                        continue;
                    }
                    if (anchor && ((_b = el.parentElement) === null || _b === void 0 ? void 0 : _b.closest('.cite, .quote'))) {
                        el.replaceWith(`\n>${ el.parentElement.closest('.quote.invalid') ? ' ' : '' }`);
                        continue;
                    }
                    if (anchor) {
                        el.replaceWith(`\n>>${ anchor }\n> `);
                        anchor = '';
                        continue;
                    } else {
                        el.replaceWith(`\n> `);
                        continue;
                    }
                }
                anchor && node.append(`\n>>${ anchor }`);
                return node.textContent;
            }
            exports.quote = quote;
            function fit(range) {
                var _a, _b;
                const node = range.startContainer;
                if ((_a = node.parentElement) === null || _a === void 0 ? void 0 : _a.matches('.cite > .anchor')) {
                    return void range.setStart(node.parentElement.previousSibling, 0);
                }
                if (node.nodeName === 'BR' && node.nextSibling instanceof global_1.Element && node.nextSibling.matches('.cite, .quote')) {
                    return void range.setStart(node.nextSibling.firstChild, 0);
                }
                const offset = range.startOffset;
                if (((_b = node.parentElement) === null || _b === void 0 ? void 0 : _b.matches('.cite, .quote')) && node.textContent.slice(0, offset) === '>'.repeat(offset) && (!node.previousSibling || node.previousSibling.nodeName === 'BR')) {
                    return void range.setStart(node, 0);
                }
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
            '../combinator/data/parser': 45,
            '../parser/block/reply/cite': 82,
            'spica/global': 13,
            'typed-dom/dom': 23
        }
    ],
    149: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.scope = void 0;
            const global_1 = _dereq_('spica/global');
            function scope(base, filter = '', bound = `${ 'id' in base && base.id ? `#${ base.id }, ` : '' }section, article, aside, blockquote, pre, .quote, .math, .media`) {
                bound += filter && `, ${ filter }`;
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
            exports.scope = scope;
        },
        { 'spica/global': 13 }
    ],
    150: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.toc = void 0;
            const global_1 = _dereq_('spica/global');
            const dom_1 = _dereq_('typed-dom/dom');
            const array_1 = _dereq_('spica/array');
            const selector = 'h1 h2 h3 h4 h5 h6 aside.aside'.split(' ').map(s => `${ s }[id]`).join();
            function toc(source) {
                const es = source.querySelectorAll(selector);
                const hs = (0, global_1.Array)(es.length);
                for (let i = 0; i < hs.length; ++i) {
                    const el = es[i];
                    switch (el.tagName) {
                    case 'ASIDE':
                        hs[i] = (0, dom_1.html)(el.firstElementChild.tagName.toLowerCase(), {
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
                return (0, dom_1.html)('ul', node.map(([el, cs]) => {
                    const isHeading = !el.classList.contains('aside');
                    const idx = isHeading ? index === '' ? `${ ++i }` : `${ index }.${ ++i }` : index === '' ? `${ i }` : `${ index }.${ i }`;
                    return (0, dom_1.html)('li', (0, array_1.push)([(0, dom_1.html)('a', {
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
            'spica/global': 13,
            'typed-dom/dom': 23
        }
    ],
    'securemark': [
        function (_dereq_, module, exports) {
            'use strict';
            var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
                if (k2 === undefined)
                    k2 = k;
                var desc = Object.getOwnPropertyDescriptor(m, k);
                if (!desc || ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)) {
                    desc = {
                        enumerable: true,
                        get: function () {
                            return m[k];
                        }
                    };
                }
                Object.defineProperty(o, k2, desc);
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
            './src/parser': 52,
            './src/renderer': 135,
            './src/util': 146,
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
        root.commonJsStrict = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {
    return require('securemark');
}));