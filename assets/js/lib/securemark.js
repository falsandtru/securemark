/*! securemark v0.43.0 https://github.com/falsandtru/securemark | (c) 2017, falsandtru | (Apache-2.0 AND MPL-2.0) License */
require = function () {
    function e(t, n, r) {
        function s(o, u) {
            if (!n[o]) {
                if (!t[o]) {
                    var a = typeof require == 'function' && require;
                    if (!u && a)
                        return a(o, !0);
                    if (i)
                        return i(o, !0);
                    var f = new Error('Cannot find module \'' + o + '\'');
                    throw f.code = 'MODULE_NOT_FOUND', f;
                }
                var l = n[o] = { exports: {} };
                t[o][0].call(l.exports, function (e) {
                    var n = t[o][1][e];
                    return s(n ? n : e);
                }, l, l.exports, e, t, n, r);
            }
            return n[o].exports;
        }
        var i = typeof require == 'function' && require;
        for (var o = 0; o < r.length; o++)
            s(r[o]);
        return s;
    }
    return e;
}()({
    1: [
        function (require, module, exports) {
        },
        {}
    ],
    2: [
        function (require, module, exports) {
            arguments[4][1][0].apply(exports, arguments);
        },
        { 'dup': 1 }
    ],
    3: [
        function (require, module, exports) {
            arguments[4][1][0].apply(exports, arguments);
        },
        { 'dup': 1 }
    ],
    4: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const type_1 = require('./type');
            exports.assign = template((key, target, source) => target[key] = source[key]);
            exports.clone = template((key, target, source) => {
                switch (type_1.type(source[key])) {
                case 'Array':
                    return target[key] = exports.clone([], source[key]);
                case 'Object':
                    return target[key] = source[key] instanceof Object ? exports.clone({}, source[key]) : source[key];
                default:
                    return target[key] = source[key];
                }
            });
            exports.extend = template((key, target, source) => {
                switch (type_1.type(source[key])) {
                case 'Array':
                    return target[key] = exports.extend([], source[key]);
                case 'Object':
                    switch (type_1.type(target[key])) {
                    case 'Object':
                        return target[key] = source[key] instanceof Object ? exports.extend(target[key], source[key]) : source[key];
                    default:
                        return target[key] = source[key] instanceof Object ? exports.extend({}, source[key]) : source[key];
                    }
                default:
                    return target[key] = source[key];
                }
            });
            function template(strategy) {
                return walk;
                function walk(target, ...sources) {
                    if (target === undefined || target === null) {
                        throw new TypeError(`Spica: assign: Cannot walk on ${ target }.`);
                    }
                    for (const source of sources) {
                        if (source === undefined || source === null) {
                            continue;
                        }
                        for (const key of Object.keys(Object(source))) {
                            const desc = Object.getOwnPropertyDescriptor(Object(source), key);
                            if (desc !== undefined && desc.enumerable) {
                                void strategy(key, Object(target), Object(source));
                            }
                        }
                    }
                    return Object(target);
                }
            }
        },
        { './type': 9 }
    ],
    5: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const assign_1 = require('./assign');
            const equal_1 = require('./equal');
            class Cache {
                constructor(size, callback = () => undefined, opts = {}) {
                    this.size = size;
                    this.callback = callback;
                    this.opts = {
                        ignore: {
                            delete: false,
                            clear: false
                        }
                    };
                    if (size > 0 === false)
                        throw new Error(`Spica: Cache: Cache size must be greater than 0.`);
                    void Object.freeze(assign_1.extend(this.opts, opts));
                    const {stats, entries} = opts.data || {
                        stats: [
                            [],
                            []
                        ],
                        entries: []
                    };
                    const LFU = stats[1].slice(0, size);
                    const LRU = stats[0].slice(0, size - LFU.length);
                    this.stats = {
                        LRU,
                        LFU
                    };
                    this.store = new Map(entries);
                    void [
                        ...stats[1],
                        ...stats[0]
                    ].slice(LFU.length + LRU.length).forEach(k => void this.store.delete(k));
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
                        const index = equal_1.findIndex(key, stat);
                        if (index === -1)
                            continue;
                        const val = this.store.get(key);
                        void this.store.delete(stat.splice(index, 1)[0]);
                        if (this.opts.ignore.delete)
                            return true;
                        void this.callback(key, val);
                        return true;
                    }
                    return false;
                }
                clear() {
                    const store = this.store;
                    this.store = new Map();
                    this.stats = {
                        LRU: [],
                        LFU: []
                    };
                    if (this.opts.ignore.clear)
                        return;
                    return void [...store].forEach(([key, val]) => void this.callback(key, val));
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
                    if (!this.store.has(key))
                        return false;
                    const {LRU} = this.stats;
                    const index = equal_1.findIndex(key, LRU);
                    if (index === -1)
                        return false;
                    const {LFU} = this.stats;
                    void LFU.unshift(...LRU.splice(index, 1));
                    return true;
                }
                accessLFU(key) {
                    if (!this.store.has(key))
                        return false;
                    const {LFU} = this.stats;
                    const index = equal_1.findIndex(key, LFU);
                    if (index === -1)
                        return false;
                    void LFU.unshift(...LFU.splice(index, 1));
                    return true;
                }
            }
            exports.Cache = Cache;
        },
        {
            './assign': 4,
            './equal': 7
        }
    ],
    6: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            function concat(target, source) {
                for (let i = 0, offset = target.length, len = source.length; i < len; ++i) {
                    target[offset + i] = source[i];
                }
                return target;
            }
            exports.concat = concat;
        },
        {}
    ],
    7: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            function findIndex(a1, as) {
                const isNaN = a1 !== a1;
                for (let i = 0; i < as.length; ++i) {
                    const a2 = as[i];
                    if (isNaN ? a2 !== a2 : a2 === a1)
                        return i;
                }
                return -1;
            }
            exports.findIndex = findIndex;
        },
        {}
    ],
    8: [
        function (require, module, exports) {
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
                return id === undefined ? (zeros + ++cnt).slice(-15) : (zeros + id).slice(-15);
            }
            exports.sqid = sqid;
        },
        {}
    ],
    9: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            function type(target) {
                const type = Object.prototype.toString.call(target).split(' ').pop().slice(0, -1);
                if (typeof target !== 'object' && target instanceof Object === false || target === null)
                    return type.toLowerCase();
                return type;
            }
            exports.type = type;
        },
        {}
    ],
    10: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const FORMAT_V4 = Object.freeze('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.split(''));
            function uuid() {
                let acc = '';
                for (const c of FORMAT_V4) {
                    if (c === 'x' || c === 'y') {
                        const r = Math.random() * 16 | 0;
                        const v = c == 'x' ? r : r & 3 | 8;
                        acc += v.toString(16);
                    } else {
                        acc += c;
                    }
                }
                return acc.toLowerCase();
            }
            exports.uuid = uuid;
        },
        {}
    ],
    11: [
        function (require, module, exports) {
            'use strict';
            function __export(m) {
                for (var p in m)
                    if (!exports.hasOwnProperty(p))
                        exports[p] = m[p];
            }
            Object.defineProperty(exports, '__esModule', { value: true });
            var builder_1 = require('./src/dom/builder');
            exports.default = builder_1.TypedHTML;
            exports.TypedHTML = builder_1.TypedHTML;
            exports.TypedSVG = builder_1.TypedSVG;
            __export(require('./src/util/dom'));
            __export(require('./src/util/listener'));
        },
        {
            './src/dom/builder': 12,
            './src/util/dom': 15,
            './src/util/listener': 16
        }
    ],
    12: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const manager_1 = require('./manager');
            const dom_1 = require('../util/dom');
            exports.TypedHTML = new Proxy({}, handle(dom_1.html));
            exports.TypedSVG = new Proxy({}, handle(dom_1.svg));
            function handle(defaultFactory) {
                return { get: (obj, prop) => obj[prop] || typeof prop !== 'string' ? obj[prop] : obj[prop] = builder(prop, () => defaultFactory(prop)) };
                function builder(tag, defaultFactory) {
                    return function build(attrs, children, factory) {
                        if (typeof attrs === 'function')
                            return build(undefined, undefined, attrs);
                        if (typeof children === 'function')
                            return build(attrs, undefined, children);
                        if (attrs !== undefined && isChildren(attrs))
                            return build(undefined, attrs, factory);
                        return new manager_1.El(elem(tag, factory, attrs), children);
                    };
                    function isChildren(children) {
                        return typeof children !== 'object' || Object.values(children).slice(-1).every(val => typeof val === 'object');
                    }
                    function elem(tag, factory = defaultFactory, attrs) {
                        const el = factory();
                        if (tag !== el.tagName.toLowerCase())
                            throw new Error(`TypedDOM: Tag name must be "${ tag }", but got "${ el.tagName.toLowerCase() }".`);
                        if (!attrs)
                            return el;
                        for (const [name, value] of Object.entries(attrs)) {
                            typeof value === 'string' ? void el.setAttribute(name, value) : void el.addEventListener(name.slice(2), value, {
                                passive: [
                                    'wheel',
                                    'mousewheel',
                                    'touchstart',
                                    'touchmove'
                                ].includes(name.slice(2))
                            });
                        }
                        return el;
                    }
                }
            }
        },
        {
            '../util/dom': 15,
            './manager': 14
        }
    ],
    13: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const uuid_1 = require('spica/uuid');
            const sqid_1 = require('spica/sqid');
            const id = uuid_1.uuid().split('-').slice(-1).join('-');
            function uid() {
                return `${ id }-${ String(Number(sqid_1.sqid())).padStart(6, '0') }`;
            }
            exports.uid = uid;
        },
        {
            'spica/sqid': 8,
            'spica/uuid': 10
        }
    ],
    14: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const identity_1 = require('./identity');
            var ElChildrenType;
            (function (ElChildrenType) {
                ElChildrenType.Void = 'void';
                ElChildrenType.Text = 'text';
                ElChildrenType.Collection = 'collection';
                ElChildrenType.Record = 'record';
            }(ElChildrenType || (ElChildrenType = {})));
            const memory = new WeakSet();
            class El {
                constructor(element_, children_) {
                    this.element_ = element_;
                    this.children_ = children_;
                    this.type = this.children_ === undefined ? ElChildrenType.Void : typeof this.children_ === 'string' ? ElChildrenType.Text : Array.isArray(this.children_) ? ElChildrenType.Collection : ElChildrenType.Record;
                    this.tag;
                    void throwErrorIfNotUsable(this);
                    void memory.add(element_);
                    switch (this.type) {
                    case ElChildrenType.Void:
                        return;
                    case ElChildrenType.Text:
                        void clear();
                        this.children_ = element_.appendChild(document.createTextNode(''));
                        this.children = children_;
                        return;
                    case ElChildrenType.Collection:
                        void clear();
                        this.children_ = [];
                        this.children = children_;
                        return;
                    case ElChildrenType.Record:
                        void clear();
                        this.children_ = observe(element_, Object.assign({}, children_));
                        this.children = children_;
                        return;
                    }
                    function clear() {
                        while (element_.childNodes.length > 0) {
                            void element_.removeChild(element_.firstChild);
                        }
                    }
                    function observe(element, children) {
                        return Object.defineProperties(children, Object.entries(children).reduce((descs, [name, child]) => {
                            void throwErrorIfNotUsable(child);
                            void element.appendChild(child.element);
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
                                    newChild.element_.parentElement === element || void throwErrorIfNotUsable(newChild);
                                    child = newChild;
                                    void element.replaceChild(newChild.element, oldChild.element);
                                }
                            };
                            return descs;
                        }, {}));
                    }
                }
                get id() {
                    return this.id_ = this.id_ || this.element_.id.trim() || identity_1.uid();
                }
                scope(children) {
                    const syntax = /^(\s*)\$scope(?!\w)/gm;
                    const id = this.id;
                    const query = id === this.element_.id.trim() ? `#${ id }` : `.${ id }`;
                    return void children.forEach(child => child.element instanceof HTMLStyleElement && void parse(child.element));
                    function parse(style) {
                        if (style.innerHTML.search(syntax) === -1)
                            return;
                        style.innerHTML = style.innerHTML.replace(syntax, (_, indent) => `${ indent }${ query }`);
                        switch (query[0]) {
                        case '.':
                            if (!(style.getAttribute('class') || '').split(' ').includes(id))
                                break;
                            void style.setAttribute('class', `${ style.getAttribute('class') } ${ id }`.trim());
                            break;
                        }
                        if (style.children.length === 0)
                            return;
                        void [...style.querySelectorAll('*')].forEach(el => void el.remove());
                    }
                }
                get element() {
                    return this.element_;
                }
                get children() {
                    switch (this.type) {
                    case ElChildrenType.Text:
                        return this.children_.data;
                    default:
                        return this.children_;
                    }
                }
                set children(children) {
                    switch (this.type) {
                    case ElChildrenType.Void:
                        return;
                    case ElChildrenType.Text:
                        this.children_.data = children;
                        return;
                    case ElChildrenType.Collection:
                        void this.children_.reduce((cs, c) => {
                            const i = cs.indexOf(c);
                            if (i > -1)
                                return cs;
                            void cs.splice(i, 1);
                            void c.element.remove();
                            return cs;
                        }, [...children]);
                        this.children_ = [];
                        void children.forEach((child, i) => {
                            child.element_.parentElement === this.element_ || void throwErrorIfNotUsable(child);
                            this.children_[i] = child;
                            void this.element_.appendChild(child.element);
                        });
                        void Object.freeze(this.children_);
                        void this.scope(Object.values(this.children_));
                        return;
                    case ElChildrenType.Record:
                        void Object.keys(this.children_).forEach(k => this.children_[k] = children[k]);
                        void this.scope(Object.values(this.children_));
                        return;
                    }
                }
            }
            exports.El = El;
            function throwErrorIfNotUsable({element}) {
                if (element.parentElement === null || !memory.has(element.parentElement))
                    return;
                throw new Error(`TypedDOM: Cannot add an element used in another typed dom.`);
            }
        },
        { './identity': 13 }
    ],
    15: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const cache = new Map();
            function html(tag, attrs = {}, children = []) {
                return element('html', tag, attrs, children);
            }
            exports.html = html;
            function svg(tag, attrs = {}, children = []) {
                return element('svg', tag, attrs, children);
            }
            exports.svg = svg;
            function element(ns, tag, attrs = {}, children = []) {
                if (typeof children === 'string')
                    return element(ns, tag, attrs, [document.createTextNode(children)]);
                if (typeof attrs === 'string' || Array.isArray(attrs))
                    return element(ns, tag, {}, attrs);
                const key = `${ ns }:${ tag }`;
                const el = cache.has(key) ? cache.get(key).cloneNode(true) : cache.set(key, elem(ns, tag)).get(key).cloneNode(true);
                void Object.entries(attrs).forEach(([name, value]) => void el.setAttribute(name, value));
                void children.forEach(child => void el.appendChild(child));
                return el;
            }
            function elem(ns, tag) {
                switch (ns) {
                case 'html':
                    return document.createElement(tag);
                case 'svg':
                    return document.createElementNS('http://www.w3.org/2000/svg', tag);
                default:
                    throw new Error(`TypedDOM: Unknown namespace: ${ ns }`);
                }
            }
        },
        {}
    ],
    16: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const noop_1 = require('./noop');
            exports.currentTargets = new WeakMap();
            function listen(target, a, b, c = false, d = {}) {
                return typeof b === 'string' ? delegate(target, a, b, c, d) : bind(target, a, b, c);
            }
            exports.listen = listen;
            function once(target, a, b, c = false, d = {}) {
                return typeof b === 'string' ? delegate(target, a, b, c, Object.assign({}, typeof d === 'boolean' ? { capture: d } : d, { once: true })) : bind(target, a, b, Object.assign({}, typeof c === 'boolean' ? { capture: c } : c, { once: true }));
            }
            exports.once = once;
            function bind(target, type, listener, option = false) {
                void target.addEventListener(type, handler, adjustEventListenerOptions(option));
                let unbind = () => (unbind = noop_1.noop, void target.removeEventListener(type, handler, adjustEventListenerOptions(option)));
                return () => void unbind();
                function handler(ev) {
                    if (typeof option === 'object') {
                        if (option.passive) {
                            ev.preventDefault = noop_1.noop;
                        }
                        if (option.once) {
                            void unbind();
                        }
                    }
                    void exports.currentTargets.set(ev, ev.currentTarget);
                    void listener(ev);
                }
                function adjustEventListenerOptions(option) {
                    return supportEventListenerOptions ? option : typeof option === 'boolean' ? option : !!option.capture;
                }
            }
            exports.bind = bind;
            function delegate(target, selector, type, listener, option = {}) {
                return bind(target instanceof Document ? target.documentElement : target, type, ev => {
                    const cx = ev.target.closest(selector);
                    if (!cx)
                        return;
                    void [...target.querySelectorAll(selector)].filter(el => el === cx).forEach(el => void once(el, type, ev => {
                        void listener(ev);
                    }, option));
                }, Object.assign({}, option, { capture: true }));
            }
            exports.delegate = delegate;
            let supportEventListenerOptions = false;
            try {
                document.createElement('div').addEventListener('test', function () {
                }, {
                    get capture() {
                        return supportEventListenerOptions = true;
                    }
                });
            } catch (e) {
            }
        },
        { './noop': 17 }
    ],
    17: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            function noop() {
                return;
            }
            exports.noop = noop;
        },
        {}
    ],
    18: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var combine_1 = require('./combinator/combine');
            exports.combine = combine_1.combine;
            var subsequence_1 = require('./combinator/subsequence');
            exports.subsequence = subsequence_1.subsequence;
            var some_1 = require('./combinator/some');
            exports.some = some_1.some;
            var bracket_1 = require('./combinator/bracket');
            exports.bracket = bracket_1.bracket;
            var transform_1 = require('./combinator/transform');
            exports.transform = transform_1.transform;
        },
        {
            './combinator/bracket': 19,
            './combinator/combine': 20,
            './combinator/some': 21,
            './combinator/subsequence': 22,
            './combinator/transform': 23
        }
    ],
    19: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            function bracket(start, parser, end) {
                return lmr_ => {
                    const l = match(lmr_, start);
                    if (l === undefined)
                        return;
                    const mr_ = lmr_.slice(l.length);
                    const [rs = [], r_ = mr_] = parser(mr_) || [];
                    const r = match(r_, end);
                    if (r === undefined)
                        return;
                    return l + r !== '' && r_.length - r.length < lmr_.length ? [
                        rs,
                        r_.slice(r.length)
                    ] : undefined;
                };
                function match(source, pattern) {
                    if (typeof pattern !== 'string') {
                        const result = source.slice(0, 9).match(pattern);
                        return result ? match(source, result[0]) : undefined;
                    }
                    return source.startsWith(pattern) ? pattern : undefined;
                }
            }
            exports.bracket = bracket;
        },
        {}
    ],
    20: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            function combine(parsers) {
                return source => {
                    let rest = source;
                    const results = [];
                    for (const parse of parsers) {
                        if (rest === '')
                            break;
                        const r = parse(rest);
                        if (!r)
                            continue;
                        if (r[1].length >= rest.length)
                            return;
                        void results.push(...r[0]);
                        rest = r[1];
                        break;
                    }
                    return rest.length < source.length ? [
                        results,
                        rest
                    ] : undefined;
                };
            }
            exports.combine = combine;
        },
        {}
    ],
    21: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            function some(parser, until) {
                return source => {
                    let rest = source;
                    const results = [];
                    while (true) {
                        if (rest === '')
                            break;
                        if (until && rest.slice(0, 9).search(until) === 0)
                            break;
                        const result = parser(rest);
                        if (!result)
                            break;
                        const [rs, r] = result;
                        void results.push(...rs);
                        rest = r;
                    }
                    return rest.length === source.length ? undefined : [
                        results,
                        rest
                    ];
                };
            }
            exports.some = some;
        },
        {}
    ],
    22: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            function subsequence(parsers) {
                return source => {
                    let rest = source;
                    const results = [];
                    for (const parse of parsers) {
                        if (rest === '')
                            break;
                        const r = parse(rest);
                        if (!r)
                            continue;
                        if (r[1].length >= rest.length)
                            return;
                        void results.push(...r[0]);
                        rest = r[1];
                    }
                    return rest.length < source.length ? [
                        results,
                        rest
                    ] : undefined;
                };
            }
            exports.subsequence = subsequence;
        },
        {}
    ],
    23: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            function transform(parser, f) {
                return source => {
                    const [rs = [], rest = undefined] = parser(source) || [];
                    if (rest === undefined)
                        return;
                    if (rest.length >= source.length)
                        return;
                    const result = f(rs, rest);
                    return result && result[1].length <= rest.length ? result : undefined;
                };
            }
            exports.transform = transform;
        },
        {}
    ],
    24: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var parse_1 = require('./parser/parse');
            exports.parse = parse_1.parse;
            var bind_1 = require('./parser/bind');
            exports.bind = bind_1.bind;
            var escape_1 = require('./parser/escape');
            exports.escape = escape_1.escape;
            var cache_1 = require('./parser/cache');
            exports.caches = cache_1.caches;
        },
        {
            './parser/bind': 25,
            './parser/cache': 46,
            './parser/escape': 47,
            './parser/parse': 70
        }
    ],
    25: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const segment_1 = require('./segment');
            const parse_1 = require('./parse');
            function bind(target) {
                const pairs = [];
                let revision;
                return function* (source) {
                    const rev = revision = Symbol();
                    const cs = pairs.map(([s]) => s);
                    if (source === cs.join(''))
                        return;
                    const ns = segment_1.segment(source);
                    let i = 0;
                    for (; i < cs.length; ++i) {
                        if (cs[i] !== ns[i])
                            break;
                    }
                    let j = 0;
                    for (; i + j < cs.length && i + j < ns.length; ++j) {
                        if (cs[cs.length - j - 1] !== ns[ns.length - j - 1])
                            break;
                    }
                    void pairs.splice(i, pairs.length - j - i).forEach(([, es]) => void es.forEach(el => void el.remove()));
                    const [, [ref = end()] = []] = pairs.slice(i).find(([, [el]]) => !!el) || [];
                    for (const [seg, k] of ns.slice(i, ns.length - j).map((seg, k) => [
                            seg,
                            i + k
                        ])) {
                        const es = parse_1.parse_(seg);
                        void pairs.splice(k, 0, [
                            seg,
                            es
                        ]);
                        for (const el of es) {
                            void target.insertBefore(el, ref);
                            yield el;
                            if (revision !== rev)
                                return;
                        }
                    }
                };
                function end() {
                    if (pairs.length === 0)
                        return target.firstChild;
                    for (let i = pairs.length - 1; i >= 0; --i) {
                        const [, es] = pairs[i];
                        if (es.length > 0)
                            return es[es.length - 1].nextSibling;
                    }
                    return target.firstChild;
                }
            }
            exports.bind = bind;
        },
        {
            './parse': 70,
            './segment': 71
        }
    ],
    26: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../combinator');
            const newline_1 = require('./block/newline');
            const horizontalrule_1 = require('./block/horizontalrule');
            const heading_1 = require('./block/heading');
            const ulist_1 = require('./block/ulist');
            const olist_1 = require('./block/olist');
            const dlist_1 = require('./block/dlist');
            const table_1 = require('./block/table');
            const blockquote_1 = require('./block/blockquote');
            const pretext_1 = require('./block/pretext');
            const math_1 = require('./block/math');
            const extension_1 = require('./block/extension');
            const paragraph_1 = require('./block/paragraph');
            exports.block = combinator_1.combine([
                newline_1.newline,
                horizontalrule_1.horizontalrule,
                heading_1.heading,
                ulist_1.ulist,
                olist_1.olist,
                dlist_1.dlist,
                table_1.table,
                blockquote_1.blockquote,
                pretext_1.pretext,
                math_1.math,
                extension_1.extension,
                paragraph_1.paragraph
            ]);
        },
        {
            '../combinator': 18,
            './block/blockquote': 27,
            './block/dlist': 28,
            './block/extension': 29,
            './block/heading': 32,
            './block/horizontalrule': 33,
            './block/math': 34,
            './block/newline': 35,
            './block/olist': 36,
            './block/paragraph': 37,
            './block/pretext': 40,
            './block/table': 41,
            './block/ulist': 42
        }
    ],
    27: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const verification_1 = require('./util/verification');
            const combinator_1 = require('../../combinator');
            const block_1 = require('../block');
            const unescapable_1 = require('../source/unescapable');
            const squash_1 = require('../squash');
            const typed_dom_1 = require('typed-dom');
            const syntax = /^>+(?=\s|$)/;
            exports.blockquote = verification_1.verify(source => {
                const mode = undefined || source.startsWith('>') && 'plain' || source.startsWith('|>') && 'markdown' || '';
                if (mode === '')
                    return;
                source = mode === 'plain' ? source : source.slice(1);
                let [indent = ''] = source.match(syntax) || [];
                if (!indent)
                    return;
                const top = typed_dom_1.html('blockquote');
                let bottom = indent.split('').slice(1).reduce(p => p.appendChild(typed_dom_1.html('blockquote')), top);
                while (true) {
                    if (source.split('\n', 1).shift().trim() === '')
                        break;
                    const diff = (source.match(syntax) || [indent])[0].length - indent.length;
                    if (diff > 0) {
                        bottom = source.slice(0, diff).split('').reduce(p => p.appendChild(typed_dom_1.html('blockquote')), bottom);
                    }
                    if (diff < 0) {
                        bottom = source.slice(0, -diff).split('').reduce(p => p.parentElement, bottom);
                    }
                    indent = indent[0].repeat(indent.length + diff);
                    if (bottom.lastChild instanceof Text) {
                        const node = mode === 'plain' ? typed_dom_1.html('br') : document.createTextNode('\n');
                        void bottom.appendChild(node);
                    }
                    source = source.split(/[^\S\n]/, 1)[0] === indent ? source.slice(indent.length + 1) : source.startsWith(`${ indent }\n`) ? source.slice(indent.length) : source;
                    const [cs = [], rest = source] = combinator_1.some(combinator_1.combine([unescapable_1.unescsource]), '\n|$')(source) || [];
                    const node = mode === 'plain' ? document.createTextNode(squash_1.squash(cs, document.createDocumentFragment()).textContent.replace(/ /g, String.fromCharCode(160))) : squash_1.squash(cs, document.createDocumentFragment());
                    if (bottom.childNodes.length === 0 && node.textContent.trim() === '')
                        return;
                    void bottom.appendChild(node);
                    source = rest.slice(1);
                }
                if (mode === 'markdown') {
                    void expand(top);
                }
                return [
                    [top],
                    source
                ];
            });
            function expand(el) {
                return void [...el.childNodes].reduce((ss, node) => {
                    switch (true) {
                    case node instanceof Text:
                        void ss.push(node.textContent);
                        const ref = node.nextSibling;
                        void el.removeChild(node);
                        if (ref instanceof Text)
                            return ss;
                        void el.insertBefore(parse(ss.join('')), ref);
                        return [];
                    case node instanceof HTMLQuoteElement:
                        void expand(node);
                        return [];
                    default:
                        void el.insertBefore(node, node.nextSibling);
                        return [];
                    }
                }, []);
                function parse(source) {
                    return (combinator_1.some(block_1.block)(source) || [[]])[0].reduce((frag, node) => (frag.appendChild(node), frag), document.createDocumentFragment());
                }
            }
        },
        {
            '../../combinator': 18,
            '../block': 26,
            '../source/unescapable': 78,
            '../squash': 80,
            './util/verification': 45,
            'typed-dom': 11
        }
    ],
    28: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const verification_1 = require('./util/verification');
            const combinator_1 = require('../../combinator');
            const indexer_1 = require('./util/indexer');
            const inline_1 = require('../inline');
            const squash_1 = require('../squash');
            const typed_dom_1 = require('typed-dom');
            const syntax = /^~\s/;
            const separator = /^[~:](?:\s|$)/;
            exports.dlist = verification_1.verify(source => {
                const [whole = ''] = source.match(syntax) || [];
                if (!whole)
                    return;
                const el = typed_dom_1.html('dl');
                while (true) {
                    const line = source.split('\n', 1)[0];
                    if (line.trim() === '')
                        break;
                    switch (line.slice(0, 2).trim()) {
                    case '~': {
                            const dt = el.appendChild(typed_dom_1.html('dt'));
                            void dt.appendChild(squash_1.squash((combinator_1.some(combinator_1.combine([
                                indexer_1.indexer,
                                inline_1.inline
                            ]))(line.slice(1).trim()) || [[]])[0], document.createDocumentFragment()));
                            void indexer_1.defineIndex(dt);
                            source = source.slice(line.length + 1);
                            continue;
                        }
                    default: {
                            const dd = line.slice(0, 2).trim() === ':' || el.lastElementChild.tagName.toLowerCase() !== 'dd' ? el.appendChild(typed_dom_1.html('dd')) : el.lastElementChild;
                            const texts = [line.slice(line.slice(0, 2).trim() === ':' ? 1 : 0)];
                            source = source.slice(line.length + 1);
                            while (true) {
                                const line = source.split('\n', 1)[0];
                                if (line.trim() === '' || line.search(separator) === 0)
                                    break;
                                void texts.push(line);
                                source = source.slice(line.length + 1);
                            }
                            void dd.appendChild(squash_1.squash((combinator_1.some(combinator_1.combine([inline_1.inline]))(texts.join('\n').trim()) || [[]])[0], document.createDocumentFragment()));
                            continue;
                        }
                    }
                }
                if (el.lastElementChild && el.lastElementChild.tagName.toLowerCase() === 'dt') {
                    void el.appendChild(typed_dom_1.html('dd'));
                }
                return [
                    [el],
                    source
                ];
            });
        },
        {
            '../../combinator': 18,
            '../inline': 48,
            '../squash': 80,
            './util/indexer': 44,
            './util/verification': 45,
            'typed-dom': 11
        }
    ],
    29: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../combinator');
            const figure_1 = require('./extension/figure');
            const placeholder_1 = require('./extension/placeholder');
            exports.extension = combinator_1.combine([
                figure_1.figure,
                placeholder_1.placeholder
            ]);
        },
        {
            '../../combinator': 18,
            './extension/figure': 30,
            './extension/placeholder': 31
        }
    ],
    30: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const verification_1 = require('../util/verification');
            const combinator_1 = require('../../../combinator');
            const inline_1 = require('../../inline');
            const table_1 = require('../table');
            const pretext_1 = require('../pretext');
            const math_1 = require('../math');
            const typed_dom_1 = require('typed-dom');
            const syntax = /^(~{3,})figure[^\S\n]+(\[:[^\]]+\])[^\S\n]*\n/;
            exports.figure = verification_1.verify(source => {
                if (!source.startsWith('~~~'))
                    return;
                const [whole = '', bracket = '', note = ''] = source.match(syntax) || [];
                if (!whole)
                    return;
                const [[figlabel = undefined] = []] = inline_1.label(note) || [];
                if (!figlabel)
                    return;
                return combinator_1.transform(combinator_1.combine([
                    table_1.table,
                    pretext_1.pretext,
                    math_1.math,
                    inline_1.url
                ]), ([content], rest) => {
                    if (content instanceof Text)
                        return;
                    if (content instanceof HTMLAnchorElement && !content.querySelector('img'))
                        return;
                    const next = rest;
                    const end = new RegExp(`^\n${ bracket }[^\S\n]*(?:\n|$)`);
                    return combinator_1.transform(combinator_1.bracket('', combinator_1.some(combinator_1.combine([inline_1.inline]), end), end), (caption, rest) => {
                        [caption = []] = combinator_1.some(inline_1.inline)(next.slice(0, next.lastIndexOf(bracket, next.length - rest.length)).trim()) || [];
                        return [
                            [typed_dom_1.html('figure', { class: figlabel.getAttribute('href').slice(1) }, [
                                    content,
                                    typed_dom_1.html('figcaption', { 'data-type': figlabel.getAttribute('href').slice(1).split(':', 2)[1].split('-', 1)[0] }, [typed_dom_1.html('span', caption)])
                                ])],
                            rest
                        ];
                    })(next);
                })(source.slice(source.indexOf('\n') + 1).replace(new RegExp(`(?=\n${ bracket }[^\S\n]*(?:\n|$))`), '\n'));
            });
        },
        {
            '../../../combinator': 18,
            '../../inline': 48,
            '../math': 34,
            '../pretext': 40,
            '../table': 41,
            '../util/verification': 45,
            'typed-dom': 11
        }
    ],
    31: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const verification_1 = require('../util/verification');
            const combinator_1 = require('../../../combinator');
            const block_1 = require('../../block');
            const unescapable_1 = require('../../source/unescapable');
            const syntax = /^(~{3,})([^\n]*)\n(?:[^\n]*\n)*?\1[^\S\n]*(?:\n|$)/;
            exports.placeholder = verification_1.verify(source => {
                if (!source.startsWith('~~~'))
                    return;
                const [whole = '', bracket = ''] = source.match(syntax) || [];
                if (!whole)
                    return;
                const [[message]] = block_1.block('**WARNING: DON\'T USE `~~~` SYNTAX!!**\\\nThis *extension syntax* is reserved for extensibility.');
                source = source.slice(source.indexOf('\n') + 1);
                const lines = [];
                while (true) {
                    const line = source.split('\n', 1)[0];
                    if (line.startsWith(`${ bracket }`) && line.trim() === `${ bracket }`)
                        break;
                    void lines.push((combinator_1.some(unescapable_1.unescsource)(`${ line }\n`) || [[]])[0].reduce((acc, n) => acc + n.textContent, ''));
                    source = source.slice(line.length + 1);
                    if (source === '')
                        return;
                }
                return [
                    [message],
                    source.slice(source.split('\n', 1)[0].length + 1)
                ];
            });
        },
        {
            '../../../combinator': 18,
            '../../block': 26,
            '../../source/unescapable': 78,
            '../util/verification': 45
        }
    ],
    32: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const verification_1 = require('./util/verification');
            const combinator_1 = require('../../combinator');
            const indexer_1 = require('./util/indexer');
            const inline_1 = require('../inline');
            const typed_dom_1 = require('typed-dom');
            const syntax = /^(#{1,6})[^\S\n]+?([^\n]+)/;
            exports.heading = verification_1.verify(source => {
                if (!source.startsWith('#'))
                    return;
                const [whole = '', {length: level} = '', title = ''] = source.split('\n', 1)[0].match(syntax) || [];
                if (!whole)
                    return;
                const [children = [], rest = undefined] = combinator_1.some(combinator_1.combine([
                    indexer_1.indexer,
                    inline_1.inline
                ]))(title.trim()) || [];
                if (rest === undefined)
                    return;
                const el = typed_dom_1.html(`h${ level }`, children);
                void indexer_1.defineIndex(el);
                return [
                    [el],
                    source.slice(whole.length + 1)
                ];
            });
        },
        {
            '../../combinator': 18,
            '../inline': 48,
            './util/indexer': 44,
            './util/verification': 45,
            'typed-dom': 11
        }
    ],
    33: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const verification_1 = require('./util/verification');
            const typed_dom_1 = require('typed-dom');
            const syntax = /^-{3,}[^\S\n]*?(?:\n|$)/;
            exports.horizontalrule = verification_1.verify(source => {
                const [whole = ''] = source.split('\n', 1)[0].match(syntax) || [];
                if (!whole)
                    return;
                return [
                    [typed_dom_1.html('hr')],
                    source.slice(whole.length + 1)
                ];
            });
        },
        {
            './util/verification': 45,
            'typed-dom': 11
        }
    ],
    34: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const verification_1 = require('./util/verification');
            const typed_dom_1 = require('typed-dom');
            const syntax = /^\$\$[^\S\n]*\n(?:[^\n]*?\S[^\n]*\n)+?\$\$[^\S\n]*(?:\n|$)/;
            exports.math = verification_1.verify(source => {
                if (!source.startsWith('$$'))
                    return;
                const [whole = ''] = source.match(syntax) || [];
                if (!whole)
                    return;
                return [
                    [typed_dom_1.html('div', { class: 'math' }, whole.trim())],
                    source.slice(whole.length)
                ];
            });
        },
        {
            './util/verification': 45,
            'typed-dom': 11
        }
    ],
    35: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const syntax = /^(?:[^\S\n]*?\\?\n)+/;
            exports.newline = source => {
                const [whole = ''] = source.match(syntax) || [];
                if (!whole)
                    return;
                return [
                    [],
                    source.slice(whole.length)
                ];
            };
        },
        {}
    ],
    36: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const verification_1 = require('./util/verification');
            const combinator_1 = require('../../combinator');
            const ulist_1 = require('./ulist');
            const indent_1 = require('./util/indent');
            const inline_1 = require('../inline');
            const squash_1 = require('../squash');
            const validation_1 = require('../source/validation');
            const typed_dom_1 = require('typed-dom');
            const syntax = /^([0-9]+|[A-Z]+|[a-z]+)(\.(?:\s|$)|(?=\n|$))/;
            exports.olist = verification_1.verify(source => {
                const [whole = '', index = '', flag = ''] = source.match(syntax) || [];
                if (!whole || !flag)
                    return;
                const el = typed_dom_1.html('ol', {
                    'start': index,
                    'type': Number.isFinite(+index) ? '1' : index === index.toLowerCase() ? 'a' : 'A'
                });
                while (true) {
                    const line = source.split('\n', 1)[0];
                    if (line.trim() === '')
                        break;
                    if (!validation_1.match(line, '', syntax))
                        return;
                    const text = line.slice(line.split(/\s/, 1)[0].length + 1).trim();
                    const li = el.appendChild(typed_dom_1.html('li'));
                    void li.appendChild(squash_1.squash((combinator_1.some(combinator_1.combine([inline_1.inline]))(text) || [[]])[0], document.createDocumentFragment()));
                    source = source.slice(line.length + 1);
                    const [block = '', rest = undefined] = indent_1.indent(source) || [];
                    if (rest === undefined)
                        continue;
                    if (!li.firstChild)
                        return;
                    const [children = [], brest = block] = combinator_1.combine([
                        ulist_1.ulist,
                        exports.olist
                    ])(indent_1.fillOListFlag(block)) || [];
                    if (children.length !== 1 || brest.length !== 0)
                        return;
                    void li.appendChild(squash_1.squash(children, document.createDocumentFragment()));
                    source = rest;
                    continue;
                }
                return [
                    [el],
                    source
                ];
            });
        },
        {
            '../../combinator': 18,
            '../inline': 48,
            '../source/validation': 79,
            '../squash': 80,
            './ulist': 42,
            './util/indent': 43,
            './util/verification': 45,
            'typed-dom': 11
        }
    ],
    37: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const verification_1 = require('./util/verification');
            const combinator_1 = require('../../combinator');
            const reference_1 = require('./paragraph/reference');
            const hashtag_1 = require('./paragraph/hashtag');
            const inline_1 = require('../inline');
            const typed_dom_1 = require('typed-dom');
            const separator = /^\s*$/m;
            const emptyline = /^\s*?\\?\n/mg;
            exports.paragraph = verification_1.verify(source => {
                if (source.split('\n', 1)[0].trim() === '')
                    return;
                const block = source.split(separator, 1)[0];
                const rest = source.slice(block.length);
                const [cs = []] = combinator_1.subsequence([
                    combinator_1.some(reference_1.reference),
                    combinator_1.some(combinator_1.combine([
                        hashtag_1.hashtag,
                        inline_1.inline
                    ]))
                ])(block.replace(emptyline, '').trim()) || [];
                const el = typed_dom_1.html('p', cs);
                for (const child of el.children) {
                    if (child instanceof HTMLBRElement)
                        continue;
                    if (!child.matches('.reference') || !child.nextSibling)
                        break;
                    void child.parentElement.insertBefore(typed_dom_1.html('br'), child.nextSibling);
                }
                return [
                    [el],
                    rest
                ];
            });
        },
        {
            '../../combinator': 18,
            '../inline': 48,
            './paragraph/hashtag': 38,
            './paragraph/reference': 39,
            './util/verification': 45,
            'typed-dom': 11
        }
    ],
    38: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../../combinator');
            const unescapable_1 = require('../../source/unescapable');
            const squash_1 = require('../../squash');
            const validation_1 = require('../../source/validation');
            const typed_dom_1 = require('typed-dom');
            const syntax = /^#\S+/;
            const closer = /^\s/;
            exports.hashtag = source => {
                if (!validation_1.match(source, '#', syntax))
                    return;
                const line = source.split('\n', 1)[0];
                const [ts = [], rest = undefined] = combinator_1.some(combinator_1.combine([unescapable_1.unescsource]), closer)(line) || [];
                if (rest === undefined)
                    return;
                return [
                    [typed_dom_1.html('a', {
                            class: 'hashtag',
                            rel: 'noopener'
                        }, squash_1.squash(ts))],
                    rest + source.slice(line.length)
                ];
            };
        },
        {
            '../../../combinator': 18,
            '../../source/unescapable': 78,
            '../../source/validation': 79,
            '../../squash': 80,
            'typed-dom': 11
        }
    ],
    39: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../../combinator');
            const unescapable_1 = require('../../source/unescapable');
            const squash_1 = require('../../squash');
            const validation_1 = require('../../source/validation');
            const typed_dom_1 = require('typed-dom');
            const syntax = /^>+[^>\s]\S*\s*?(?=\n|$)/;
            const closer = /^\s/;
            exports.reference = source => {
                if (!validation_1.match(source, '>', syntax))
                    return;
                const line = source.split('\n', 1)[0];
                const [ts = [], rest = undefined] = combinator_1.some(combinator_1.combine([unescapable_1.unescsource]), closer)(line) || [];
                if (rest === undefined)
                    return;
                return [
                    [typed_dom_1.html('a', {
                            class: 'reference',
                            rel: 'noopener'
                        }, squash_1.squash(ts))],
                    source.slice(line.length + 1)
                ];
            };
        },
        {
            '../../../combinator': 18,
            '../../source/unescapable': 78,
            '../../source/validation': 79,
            '../../squash': 80,
            'typed-dom': 11
        }
    ],
    40: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const verification_1 = require('./util/verification');
            const combinator_1 = require('../../combinator');
            const escapable_1 = require('../source/escapable');
            const typed_dom_1 = require('typed-dom');
            const syntax = /^(`{3,})([^\n]*)\n(?:([\s\S]*?)\n)?\1[^\S\n]*(?:\n|$)/;
            exports.pretext = verification_1.verify(source => {
                if (!source.startsWith('```'))
                    return;
                const [whole = '', , notes = '', body = ''] = source.match(syntax) || [];
                if (!whole)
                    return;
                const el = typed_dom_1.html('pre');
                const lang = notes.split(/\s/, 1)[0];
                if (lang) {
                    void el.setAttribute('class', `language-${ lang.toLowerCase() }`);
                    void el.setAttribute('data-lang', lang);
                }
                const filepath = (combinator_1.some(escapable_1.escsource, /^\s/)(notes.slice(lang.length).trim()) || [[]])[0].reduce((acc, n) => acc + n.textContent, '');
                if (filepath) {
                    void el.setAttribute('data-file', filepath);
                }
                void el.appendChild(document.createTextNode(body));
                return [
                    [el],
                    source.slice(whole.length)
                ];
            });
        },
        {
            '../../combinator': 18,
            '../source/escapable': 74,
            './util/verification': 45,
            'typed-dom': 11
        }
    ],
    41: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const verification_1 = require('./util/verification');
            const combinator_1 = require('../../combinator');
            const inline_1 = require('../inline');
            const squash_1 = require('../squash');
            const typed_dom_1 = require('typed-dom');
            const syntax = /^(\|[^\n]*)+?[^\S\n]*\n/;
            const align = /^:?-+:?$/;
            exports.table = verification_1.verify(source => {
                if (!source.startsWith('|') || source.search(syntax) !== 0)
                    return;
                const table = typed_dom_1.html('table');
                const [headers = [], hrest = source] = parse(source) || [];
                if (hrest.length === source.length)
                    return;
                source = hrest;
                const [aligns_ = [], arest = source] = parse(source) || [];
                if (arest.length === source.length)
                    return;
                source = arest;
                if (aligns_.some(e => !e.textContent || e.textContent.search(align) !== 0))
                    return;
                const aligns = headers.map((_, i) => (aligns_[i] || aligns_[aligns_.length - 1]).textContent).map(s => s[0] === ':' ? s[s.length - 1] === ':' ? 'center' : 'left' : s[s.length - 1] === ':' ? 'right' : '');
                void table.appendChild(typed_dom_1.html('thead'));
                void append(headers, table, headers.map((_, i) => i > 1 ? aligns[1] : aligns[i] === 'right' ? 'center' : aligns[i]));
                void table.appendChild(typed_dom_1.html('tbody'));
                while (true) {
                    const line = source.split('\n', 1)[0];
                    if (line.trim() === '')
                        break;
                    const [cols = [], rest = line] = parse(line) || [];
                    if (rest.length !== 0)
                        return;
                    void append(headers.map((_, i) => cols[i] || document.createDocumentFragment()), table, aligns);
                    source = source.slice(line.length + 1);
                }
                return [
                    [table],
                    source
                ];
            });
            function append(cols, table, aligns) {
                return void cols.reduce((tr, col, i) => (void tr.appendChild(typed_dom_1.html('td', { align: aligns[i] || '' }, [col])), tr), table.lastChild.appendChild(typed_dom_1.html('tr')));
            }
            const rowseparator = /^\||^[^\S\n]*(?=\n|$)/;
            const rowend = /^\|?[^\S\n]*(?=\n|$)/;
            function parse(row) {
                const cols = [];
                while (true) {
                    if (row[0] !== '|')
                        return;
                    const [, rest = row.slice(1)] = combinator_1.some(inline_1.inline, rowseparator)(row.slice(1)) || [];
                    const [col = []] = combinator_1.some(inline_1.inline)(row.slice(1, row.length - rest.length).trim()) || [];
                    row = rest;
                    void cols.push(squash_1.squash(col, document.createDocumentFragment()));
                    if (row.search(rowend) === 0)
                        return [
                            cols,
                            row.slice(row.split('\n')[0].length + 1)
                        ];
                }
            }
        },
        {
            '../../combinator': 18,
            '../inline': 48,
            '../squash': 80,
            './util/verification': 45,
            'typed-dom': 11
        }
    ],
    42: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const verification_1 = require('./util/verification');
            const combinator_1 = require('../../combinator');
            const olist_1 = require('./olist');
            const indent_1 = require('./util/indent');
            const inline_1 = require('../inline');
            const squash_1 = require('../squash');
            const validation_1 = require('../source/validation');
            const typed_dom_1 = require('typed-dom');
            const syntax = /^([-+*])(?=\s|$)/;
            const content = /^(\[[ x]\](?: +|$))?.*$/;
            exports.ulist = verification_1.verify(source => {
                const [whole = '', flag = ''] = source.match(syntax) || [];
                if (!whole)
                    return;
                const el = typed_dom_1.html('ul');
                while (true) {
                    const line = source.split('\n', 1)[0];
                    if (line.trim() === '')
                        break;
                    if (!validation_1.match(line, flag, syntax))
                        return;
                    const [text, checkbox = ''] = line.slice(line.split(/\s/, 1)[0].length + 1).trim().match(content);
                    const li = el.appendChild(typed_dom_1.html('li'));
                    if (checkbox) {
                        void li.appendChild(typed_dom_1.html('span', { class: 'checkbox' }, `${ checkbox.trim() } `));
                    }
                    void li.appendChild(squash_1.squash((combinator_1.some(combinator_1.combine([inline_1.inline]))(text.slice(checkbox.length)) || [[]])[0], document.createDocumentFragment()));
                    source = source.slice(line.length + 1);
                    const [block = '', rest = undefined] = indent_1.indent(source) || [];
                    if (rest === undefined)
                        continue;
                    if (!li.firstChild)
                        return;
                    const [children = [], brest = block] = combinator_1.combine([
                        exports.ulist,
                        olist_1.olist
                    ])(indent_1.fillOListFlag(block)) || [];
                    if (children.length !== 1 || brest.length !== 0)
                        return;
                    void li.appendChild(squash_1.squash(children, document.createDocumentFragment()));
                    source = rest;
                    continue;
                }
                return [
                    [el],
                    source
                ];
            });
        },
        {
            '../../combinator': 18,
            '../inline': 48,
            '../source/validation': 79,
            '../squash': 80,
            './olist': 36,
            './util/indent': 43,
            './util/verification': 45,
            'typed-dom': 11
        }
    ],
    43: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const syntax = /^\s*/;
            function indent(source) {
                const [indent = ''] = source.split('\n', 1)[0].match(syntax) || [];
                if (indent === '')
                    return;
                const lines = [];
                let rest = source;
                while (true) {
                    const line = rest.split('\n', 1)[0];
                    if (!line.startsWith(indent))
                        break;
                    if (line.slice(indent.length).trim() === '')
                        break;
                    void lines.push(line.slice(indent.length));
                    rest = rest.slice(line.length + 1);
                }
                return rest.length < source.length ? [
                    lines.join('\n'),
                    rest
                ] : undefined;
            }
            exports.indent = indent;
            ;
            function fillOListFlag(source) {
                return source.replace(/^(?:[0-9]+|[A-Z]+|[a-z]+)(?=\n|$)/, str => `${ str }.`);
            }
            exports.fillOListFlag = fillOListFlag;
        },
        {}
    ],
    44: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const inline_1 = require('../../inline');
            const syntax = /^\s+\[#\S+?\]\s*$/;
            exports.indexer = source => {
                if (source.search(syntax) !== 0)
                    return;
                const [[el = undefined] = [], rest = ''] = inline_1.index(source.trim()) || [];
                if (!el)
                    return;
                if (rest !== '')
                    return;
                void el.setAttribute('class', 'index');
                return [
                    [el],
                    rest
                ];
            };
            function defineIndex(target) {
                if (target.hasAttribute('id'))
                    return;
                const id = text(target);
                if (id === '')
                    return;
                void target.setAttribute('id', makeIndex(id));
            }
            exports.defineIndex = defineIndex;
            function text(target) {
                const el = target.querySelector('.index') || target.cloneNode(true);
                void el.remove();
                void [...el.querySelectorAll('code[data-src], .math[data-src]')].forEach(el => el.textContent = el.getAttribute('data-src'));
                return el.textContent.trim();
            }
            exports.text = text;
            function makeIndex(text) {
                return `index:${ text.trim().replace(/\s+/g, '-') }`;
            }
        },
        { '../../inline': 48 }
    ],
    45: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            function verify(parser) {
                return source => {
                    const result = parser(source);
                    if (!result)
                        return result;
                    if (result[1].split('\n', 1)[0].trim() !== '')
                        return undefined;
                    return result;
                };
            }
            exports.verify = verify;
        },
        {}
    ],
    46: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const math_1 = require('./inline/math');
            const media_1 = require('./inline/media');
            exports.caches = {
                math: math_1.cache,
                media: { image: media_1.cache }
            };
        },
        {
            './inline/math': 66,
            './inline/media': 67
        }
    ],
    47: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const symbols = /^[~:|>`$-+*\s]|^#[^\S\n]|^[0-9a-z]+\.|[*`$&()\[\]{}]|\\./gim;
            function escape(source) {
                return source.replace(symbols, str => str[0] === '\\' ? str : `\\${ str }`);
            }
            exports.escape = escape;
        },
        {}
    ],
    48: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../combinator');
            const brace_1 = require('./inline/brace');
            const annotation_1 = require('./inline/annotation');
            const parenthesis_1 = require('./inline/parenthesis');
            const link_1 = require('./inline/link');
            const extension_1 = require('./inline/extension');
            const bracket_1 = require('./inline/bracket');
            const html_1 = require('./inline/html');
            const anglebracket_1 = require('./inline/anglebracket');
            const emphasis_1 = require('./inline/emphasis');
            const strong_1 = require('./inline/strong');
            const code_1 = require('./inline/code');
            const math_1 = require('./inline/math');
            const media_1 = require('./inline/media');
            const htmlentity_1 = require('./inline/htmlentity');
            const autolink_1 = require('./inline/autolink');
            const text_1 = require('./source/text');
            exports.inline = combinator_1.combine([
                brace_1.brace,
                annotation_1.annotation,
                parenthesis_1.parenthesis,
                link_1.link,
                extension_1.extension,
                bracket_1.bracket,
                html_1.html,
                anglebracket_1.anglebracket,
                emphasis_1.emphasis,
                strong_1.strong,
                code_1.code,
                math_1.math,
                media_1.media,
                htmlentity_1.htmlentity,
                autolink_1.autolink,
                text_1.text
            ]);
            var index_1 = require('./inline/extension/index');
            exports.index = index_1.index;
            var label_1 = require('./inline/extension/label');
            exports.label = label_1.label;
            var media_2 = require('./inline/media');
            exports.media = media_2.media;
            var url_1 = require('./inline/autolink/url');
            exports.url = url_1.url;
        },
        {
            '../combinator': 18,
            './inline/anglebracket': 49,
            './inline/annotation': 50,
            './inline/autolink': 51,
            './inline/autolink/url': 53,
            './inline/brace': 54,
            './inline/bracket': 55,
            './inline/code': 56,
            './inline/emphasis': 57,
            './inline/extension': 58,
            './inline/extension/index': 59,
            './inline/extension/label': 60,
            './inline/html': 63,
            './inline/htmlentity': 64,
            './inline/link': 65,
            './inline/math': 66,
            './inline/media': 67,
            './inline/parenthesis': 68,
            './inline/strong': 69,
            './source/text': 77
        }
    ],
    49: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const inline_1 = require('../inline');
            const combinator_1 = require('../../combinator');
            const squash_1 = require('../squash');
            const validation_1 = require('../source/validation');
            const syntax = /^<[\s\S]*?>/;
            const closer = /^>/;
            exports.anglebracket = source => {
                if (!validation_1.match(source, '<', syntax))
                    return;
                return combinator_1.transform(combinator_1.bracket('<', combinator_1.some(combinator_1.combine([inline_1.inline]), closer), '>'), (ns, rest) => [
                    squash_1.squash([
                        document.createTextNode('<'),
                        ...ns,
                        document.createTextNode('>')
                    ]),
                    rest
                ])(source);
            };
        },
        {
            '../../combinator': 18,
            '../inline': 48,
            '../source/validation': 79,
            '../squash': 80
        }
    ],
    50: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const inline_1 = require('../inline');
            const combinator_1 = require('../../combinator');
            const validation_1 = require('../source/validation');
            const typed_dom_1 = require('typed-dom');
            const syntax = /^\(\([\s\S]+?\)\)/;
            const closer = /^\)\)/;
            exports.annotation = source => {
                if (!validation_1.match(source, '((', syntax))
                    return;
                return combinator_1.transform(combinator_1.bracket('((', combinator_1.some(combinator_1.combine([inline_1.inline]), closer), '))'), (ns, rest) => {
                    const el = typed_dom_1.html('sup', { class: 'annotation' }, ns);
                    if (!validation_1.isVisible(el.textContent))
                        return;
                    return [
                        [el],
                        rest
                    ];
                })(source);
            };
        },
        {
            '../../combinator': 18,
            '../inline': 48,
            '../source/validation': 79,
            'typed-dom': 11
        }
    ],
    51: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../combinator');
            const url_1 = require('./autolink/url');
            const account_1 = require('./autolink/account');
            exports.autolink = combinator_1.combine([
                url_1.url,
                account_1.account
            ]);
        },
        {
            '../../combinator': 18,
            './autolink/account': 52,
            './autolink/url': 53
        }
    ],
    52: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const typed_dom_1 = require('typed-dom');
            const syntax = /^@[a-zA-Z0-9]+(?:-[0-9a-zA-Z]+)*(?!@)/;
            const escape = /^[0-9a-zA-Z@]@.*?(?!@)/;
            exports.account = source => {
                const [flag = undefined] = source.match(escape) || [];
                if (flag)
                    return [
                        [document.createTextNode(flag)],
                        source.slice(flag.length)
                    ];
                const [whole = ''] = source.match(syntax) || [];
                if (!whole)
                    return;
                return [
                    [typed_dom_1.html('a', {
                            class: 'account',
                            rel: 'noopener'
                        }, whole)],
                    source.slice(whole.length)
                ];
            };
        },
        { 'typed-dom': 11 }
    ],
    53: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../../combinator');
            const escapable_1 = require('../../source/escapable');
            const parenthesis_1 = require('../../source/parenthesis');
            const link_1 = require('../link');
            const syntax = /^(?:!?h)?ttps?:\/\/\S/;
            exports.closer = /^['"`|\[\](){}<>]|^[-+*~^,.;:!?]*(?=[\s|\[\](){}<>]|$)|^\\?(?:\n|$)/;
            const escape = /^(?:[0-9a-zA-Z][!?]*h|\?h|[0-9a-gi-zA-Z!?])ttps?:\/\/\S/;
            exports.url = source => {
                if (source.search(escape) === 0)
                    return [
                        [document.createTextNode(source.slice(0, source.indexOf(':')))],
                        source.slice(source.indexOf(':'))
                    ];
                if (source.search(syntax) !== 0)
                    return;
                const flag = source.startsWith('!h');
                source = flag ? source.slice(1) : source;
                const [, rest = undefined] = combinator_1.some(combinator_1.combine([
                    combinator_1.bracket('[', ipv6, ']'),
                    parenthesis_1.parenthesis,
                    combinator_1.some(escapable_1.escsource, exports.closer)
                ]))(source) || [];
                if (rest === undefined)
                    return;
                const attribute = source.startsWith('ttp') ? ' nofollow' : '';
                const url = `${ source.startsWith('ttp') ? 'h' : '' }${ source.slice(0, source.length - rest.length) }`.replace(/\\.?/g, str => str.length < 2 ? '' : str).replace(/\s/g, encodeURI);
                return !flag ? link_1.link(`[](${ url }${ attribute })${ rest }`) : link_1.link(`[![](${ url })](${ url })${ rest }`);
            };
            const ipv6 = source => {
                const [whole = ''] = source.match(/^[:0-9a-z]+/i) || [];
                if (!whole)
                    return;
                return [
                    [document.createTextNode(whole)],
                    source.slice(whole.length)
                ];
            };
        },
        {
            '../../../combinator': 18,
            '../../source/escapable': 74,
            '../../source/parenthesis': 76,
            '../link': 65
        }
    ],
    54: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const inline_1 = require('../inline');
            const combinator_1 = require('../../combinator');
            const squash_1 = require('../squash');
            const validation_1 = require('../source/validation');
            const syntax = /^{[\s\S]*?}/;
            const closer = /^}/;
            exports.brace = source => {
                if (!validation_1.match(source, '{', syntax))
                    return;
                return combinator_1.transform(combinator_1.bracket('{', combinator_1.some(combinator_1.combine([inline_1.inline]), closer), '}'), (ns, rest) => [
                    squash_1.squash([
                        document.createTextNode('{'),
                        ...ns,
                        document.createTextNode('}')
                    ]),
                    rest
                ])(source);
            };
        },
        {
            '../../combinator': 18,
            '../inline': 48,
            '../source/validation': 79,
            '../squash': 80
        }
    ],
    55: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const inline_1 = require('../inline');
            const combinator_1 = require('../../combinator');
            const squash_1 = require('../squash');
            const validation_1 = require('../source/validation');
            const syntax = /^\[[\s\S]*?\]/;
            const closer = /^\]/;
            exports.bracket = source => {
                if (!validation_1.match(source, '[', syntax))
                    return;
                return combinator_1.transform(combinator_1.bracket('[', combinator_1.some(combinator_1.combine([inline_1.inline]), closer), ']'), (ns, rest) => [
                    squash_1.squash([
                        document.createTextNode('['),
                        ...ns,
                        document.createTextNode(']')
                    ]),
                    rest
                ])(source);
            };
        },
        {
            '../../combinator': 18,
            '../inline': 48,
            '../source/validation': 79,
            '../squash': 80
        }
    ],
    56: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../combinator');
            const unescapable_1 = require('../source/unescapable');
            const char_1 = require('../source/char');
            const validation_1 = require('../source/validation');
            const typed_dom_1 = require('typed-dom');
            const syntax = /^(`+)[^\n]+?\1(?!`)/;
            exports.code = source => {
                if (!validation_1.match(source, '`'))
                    return;
                const [whole = '', keyword = ''] = source.match(syntax) || [];
                if (!whole)
                    return;
                return combinator_1.transform(combinator_1.bracket(keyword, combinator_1.some(combinator_1.combine([
                    combinator_1.some(char_1.char('`')),
                    unescapable_1.unescsource
                ]), `^${ keyword }(?!\`)|^\n`), keyword), (ns, rest) => {
                    if (!validation_1.isSingleLine(source.slice(0, source.length - rest.length)))
                        return;
                    const el = typed_dom_1.html('code', { 'data-src': source.slice(0, source.length - rest.length) }, ns.reduce((acc, n) => acc + n.textContent, '').trim());
                    if (!validation_1.isVisible(el.textContent))
                        return;
                    return [
                        [el],
                        rest
                    ];
                })(source);
            };
        },
        {
            '../../combinator': 18,
            '../source/char': 72,
            '../source/unescapable': 78,
            '../source/validation': 79,
            'typed-dom': 11
        }
    ],
    57: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const inline_1 = require('../inline');
            const combinator_1 = require('../../combinator');
            const strong_1 = require('./strong');
            const validation_1 = require('../source/validation');
            const typed_dom_1 = require('typed-dom');
            const syntax = /^\*[\s\S]+?\*/;
            const closer = /^\*/;
            exports.emphasis = source => {
                if (!validation_1.match(source, '*', syntax))
                    return;
                return combinator_1.transform(combinator_1.bracket('*', combinator_1.some(combinator_1.combine([
                    combinator_1.some(inline_1.inline, closer),
                    strong_1.strong
                ])), '*'), (ns, rest) => {
                    const el = typed_dom_1.html('em', ns);
                    if (!validation_1.isVisible(el.textContent))
                        return;
                    return [
                        [el],
                        rest
                    ];
                })(source);
            };
        },
        {
            '../../combinator': 18,
            '../inline': 48,
            '../source/validation': 79,
            './strong': 69,
            'typed-dom': 11
        }
    ],
    58: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../combinator');
            const index_1 = require('./extension/index');
            const label_1 = require('./extension/label');
            const placeholder_1 = require('./extension/placeholder');
            exports.extension = combinator_1.combine([
                index_1.index,
                label_1.label,
                placeholder_1.placeholder
            ]);
        },
        {
            '../../combinator': 18,
            './extension/index': 59,
            './extension/label': 60,
            './extension/placeholder': 61
        }
    ],
    59: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const template_1 = require('./template');
            const link_1 = require('../link');
            const indexer_1 = require('../../block/util/indexer');
            const validation_1 = require('../../source/validation');
            exports.index = template_1.template('#', query => {
                const [[el = undefined] = [], rest = ''] = link_1.link(`[${ query }]()`) || [];
                if (!el)
                    return;
                if (!validation_1.isTightVisible(el.textContent))
                    return;
                void indexer_1.defineIndex(el);
                void el.setAttribute('href', `#${ el.id }`);
                void el.removeAttribute('id');
                return [
                    [el],
                    ''
                ];
            });
        },
        {
            '../../block/util/indexer': 44,
            '../../source/validation': 79,
            '../link': 65,
            './template': 62
        }
    ],
    60: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const template_1 = require('./template');
            const link_1 = require('../link');
            const validation_1 = require('../../source/validation');
            const syntax = /^[a-z]+(?:(?:-[a-z][0-9a-z]*|-[0-9]+[a-z][0-9a-z]*)+(?:-0(?:\.0)*)?|-[0-9]+(?:\.[0-9]+)*)$/;
            exports.label = template_1.template(':', query => {
                if (!validation_1.match(query, '', syntax))
                    return;
                const [[el = undefined] = [], rest = ''] = link_1.link(`[${ query }](#${ makeLabel(query) })`) || [];
                if (!el)
                    return;
                void el.setAttribute('class', el.getAttribute('href').slice(1));
                return [
                    [el],
                    ''
                ];
            });
            function makeLabel(text) {
                return `label:${ text }`;
            }
        },
        {
            '../../source/validation': 79,
            '../link': 65,
            './template': 62
        }
    ],
    61: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const inline_1 = require('../../inline');
            const combinator_1 = require('../../../combinator');
            const template_1 = require('./template');
            const typed_dom_1 = require('typed-dom');
            exports.placeholder = template_1.template('', (_, flag) => {
                const el = typed_dom_1.html('span', combinator_1.some(inline_1.inline)(`**WARNING: DON'T USE \`[${ flag } ]\` SYNTAX!!** This syntax is reserved for extensibility.`)[0]);
                return [
                    [el],
                    ''
                ];
            });
        },
        {
            '../../../combinator': 18,
            '../../inline': 48,
            './template': 62,
            'typed-dom': 11
        }
    ],
    62: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../../combinator');
            const inline_1 = require('../../inline');
            const validation_1 = require('../../source/validation');
            const syntax = /^\[[~#:^\[][^\n]*?\]/;
            exports.template = (flag, parser) => {
                return function (source) {
                    const [query = '', rest = ''] = parse(flag, source) || [];
                    if (query === '')
                        return undefined;
                    const result = parser(query, source[1]);
                    if (!result)
                        return undefined;
                    return [
                        result[0],
                        rest
                    ];
                };
            };
            function parse(flag, source) {
                if (!validation_1.match(source, `[${ flag }`, syntax))
                    return;
                const [, rest = undefined] = combinator_1.bracket('[', combinator_1.some(inline_1.inline, /^[\]\n]/), ']')(source) || [];
                if (rest === undefined)
                    return;
                const text = source.slice(1, source.length - rest.length - 1);
                const query = text.slice(flag.length || 1);
                if (!validation_1.isSingleLine(query))
                    return;
                return [
                    query,
                    rest
                ];
            }
        },
        {
            '../../../combinator': 18,
            '../../inline': 48,
            '../../source/validation': 79
        }
    ],
    63: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const inline_1 = require('../inline');
            const combinator_1 = require('../../combinator');
            const validation_1 = require('../source/validation');
            const typed_dom_1 = require('typed-dom');
            const syntax = /^<([a-z]+)>/;
            const inlinetags = Object.freeze('ins|del|sup|sub|small|cite|mark|ruby|rt|rp|bdi|bdo|wbr'.split('|'));
            exports.html = source => {
                if (!validation_1.match(source, '<'))
                    return;
                const [whole = '', tagname = ''] = source.match(syntax) || [];
                if (!whole)
                    return;
                if (!inlinetags.includes(tagname))
                    return;
                const opentag = `<${ tagname }>`;
                if (tagname === 'wbr')
                    return [
                        [typed_dom_1.html(tagname)],
                        source.slice(opentag.length)
                    ];
                return combinator_1.transform(combinator_1.bracket(`<${ tagname }>`, combinator_1.some(combinator_1.combine([inline_1.inline]), `^</${ tagname }>`), `</${ tagname }>`), (ns, rest) => {
                    const el = typed_dom_1.html(tagname, ns);
                    if (!validation_1.isVisible(el.textContent))
                        return;
                    return [
                        [el],
                        rest
                    ];
                })(source);
            };
        },
        {
            '../../combinator': 18,
            '../inline': 48,
            '../source/validation': 79,
            'typed-dom': 11
        }
    ],
    64: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const validation_1 = require('../source/validation');
            const typed_dom_1 = require('typed-dom');
            const syntax = /^&(?:[0-9a-z]+|#[0-9]{1,8}|#x[0-9a-f]{1,8});/i;
            exports.htmlentity = source => {
                if (!validation_1.match(source, '&'))
                    return;
                const [whole = ''] = source.match(syntax) || [];
                if (!whole)
                    return;
                return [
                    [document.createTextNode(parse(whole))],
                    source.slice(whole.length)
                ];
            };
            const parser = typed_dom_1.html('span');
            function parse(str) {
                parser.innerHTML = str;
                return parser.textContent;
            }
        },
        {
            '../source/validation': 79,
            'typed-dom': 11
        }
    ],
    65: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const inline_1 = require('../inline');
            const combinator_1 = require('../../combinator');
            const escapable_1 = require('../source/escapable');
            const parenthesis_1 = require('../source/parenthesis');
            const squash_1 = require('../squash');
            const validation_1 = require('../source/validation');
            const url_1 = require('../string/url');
            const typed_dom_1 = require('typed-dom');
            const syntax = /^\[[^\n]*?\]\(/;
            exports.link = source => {
                if (!validation_1.match(source, '[', syntax))
                    return;
                return combinator_1.transform(combinator_1.bracket('[', combinator_1.some(combinator_1.combine([inline_1.inline]), /^]\n?|^\n/), ']'), (ns, rest) => {
                    if (!validation_1.isSingleLine(source.slice(0, source.length - rest.length).trim()))
                        return;
                    const children = squash_1.squash(ns, document.createDocumentFragment());
                    if (children.querySelector('a, .annotation') && !children.querySelector('.media'))
                        return;
                    if (children.querySelector('img, .media')) {
                        if (children.childNodes.length > 1 || !children.firstElementChild || !children.firstElementChild.matches('img, .media'))
                            return;
                    } else {
                        if (children.childNodes.length > 0 && children.textContent.trim() === '')
                            return;
                    }
                    return combinator_1.transform(combinator_1.bracket('(', combinator_1.some(combinator_1.combine([
                        parenthesis_1.parenthesis,
                        escapable_1.escsource
                    ]), /^\)|^\s(?!nofollow)|^\n/), ')'), (ns, rest) => {
                        const [INSECURE_URL, attribute] = ns.reduce((s, c) => s + c.textContent, '').replace(/\\(.)/g, '$1').split(/\s/);
                        const url = url_1.sanitize(INSECURE_URL);
                        if (INSECURE_URL !== '' && url === '')
                            return;
                        const el = typed_dom_1.html('a', {
                            href: url,
                            rel: attribute === 'nofollow' ? 'noopener nofollow noreferrer' : 'noopener'
                        });
                        if (location.protocol !== el.protocol || location.host !== el.host) {
                            void el.setAttribute('target', '_blank');
                        }
                        void el.appendChild(children.textContent || children.querySelector('img') ? children : document.createTextNode((INSECURE_URL || el.href).replace(/^h(?=ttps?:\/\/)/, attribute === 'nofollow' ? '' : 'h')));
                        return [
                            [el],
                            rest
                        ];
                    })(rest);
                })(source);
            };
        },
        {
            '../../combinator': 18,
            '../inline': 48,
            '../source/escapable': 74,
            '../source/parenthesis': 76,
            '../source/validation': 79,
            '../squash': 80,
            '../string/url': 81,
            'typed-dom': 11
        }
    ],
    66: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../combinator');
            const escapable_1 = require('../source/escapable');
            const validation_1 = require('../source/validation');
            const cache_1 = require('spica/cache');
            const typed_dom_1 = require('typed-dom');
            exports.cache = new cache_1.Cache(100);
            const syntax = /^\$[^\s$][^\n]*?\$(?!\d)/;
            const closer = /^\$|^\n/;
            exports.math = source => {
                if (!validation_1.match(source, '$', syntax))
                    return;
                return combinator_1.transform(combinator_1.bracket('$', combinator_1.some(combinator_1.combine([escapable_1.escsource]), closer), /^\$(?![$\d])/), (ns, rest) => {
                    if (!validation_1.isTightVisible(source.slice(1, source.length - rest.length - 1)))
                        return;
                    if (!validation_1.isSingleLine(source.slice(0, source.length - rest.length)))
                        return;
                    const el = typed_dom_1.html('span', { class: 'math' }, `$${ ns.reduce((acc, n) => acc + n.textContent, '') }$`);
                    if (exports.cache.has(el.textContent))
                        return [
                            [exports.cache.get(el.textContent).cloneNode(true)],
                            rest
                        ];
                    void el.setAttribute('data-src', el.textContent);
                    return [
                        [el],
                        rest
                    ];
                })(source);
            };
        },
        {
            '../../combinator': 18,
            '../source/escapable': 74,
            '../source/validation': 79,
            'spica/cache': 5,
            'typed-dom': 11
        }
    ],
    67: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../combinator');
            const text_1 = require('../source/text');
            const escapable_1 = require('../source/escapable');
            const parenthesis_1 = require('../source/parenthesis');
            const validation_1 = require('../source/validation');
            const url_1 = require('../string/url');
            const cache_1 = require('spica/cache');
            const typed_dom_1 = require('typed-dom');
            exports.cache = new cache_1.Cache(100);
            const syntax = /^!\[[^\n]*?\]\(/;
            exports.media = source => {
                if (!validation_1.match(source, '![', syntax))
                    return;
                return combinator_1.transform(combinator_1.bracket('![', combinator_1.some(combinator_1.combine([text_1.text]), /^]\n?|^\n/), ']'), (ns, rest) => {
                    if (!validation_1.isSingleLine(source.slice(0, source.length - rest.length).trim()))
                        return;
                    const caption = ns.reduce((s, c) => s + c.textContent, '').trim();
                    return combinator_1.transform(combinator_1.bracket('(', combinator_1.some(combinator_1.combine([
                        parenthesis_1.parenthesis,
                        escapable_1.escsource
                    ]), /^\)|^\s/), ')'), (ns, rest) => {
                        const url = url_1.sanitize(ns.reduce((s, c) => s + c.textContent, '').replace(/\\(.)/g, '$1'));
                        if (url === '')
                            return;
                        if (exports.cache.has(url))
                            return [
                                [exports.cache.get(url).cloneNode(true)],
                                rest
                            ];
                        return [
                            [typed_dom_1.html('img', {
                                    'data-src': url,
                                    alt: caption
                                })],
                            rest
                        ];
                    })(rest);
                })(source);
            };
        },
        {
            '../../combinator': 18,
            '../source/escapable': 74,
            '../source/parenthesis': 76,
            '../source/text': 77,
            '../source/validation': 79,
            '../string/url': 81,
            'spica/cache': 5,
            'typed-dom': 11
        }
    ],
    68: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const inline_1 = require('../inline');
            const combinator_1 = require('../../combinator');
            const squash_1 = require('../squash');
            const validation_1 = require('../source/validation');
            const syntax = /^\([\s\S]*?\)/;
            const closer = /^\)/;
            exports.parenthesis = source => {
                if (!validation_1.match(source, '(', syntax))
                    return;
                return combinator_1.transform(combinator_1.bracket('(', combinator_1.some(combinator_1.combine([inline_1.inline]), closer), ')'), (ns, rest) => [
                    squash_1.squash([
                        document.createTextNode('('),
                        ...ns,
                        document.createTextNode(')')
                    ]),
                    rest
                ])(source);
            };
        },
        {
            '../../combinator': 18,
            '../inline': 48,
            '../source/validation': 79,
            '../squash': 80
        }
    ],
    69: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const inline_1 = require('../inline');
            const combinator_1 = require('../../combinator');
            const validation_1 = require('../source/validation');
            const typed_dom_1 = require('typed-dom');
            const syntax = /^\*\*[\s\S]+?\*\*/;
            const closer = /^\*\*/;
            exports.strong = source => {
                if (!validation_1.match(source, '**', syntax))
                    return;
                return combinator_1.transform(combinator_1.bracket('**', combinator_1.some(combinator_1.combine([inline_1.inline]), closer), '**'), (ns, rest) => {
                    const el = typed_dom_1.html('strong', ns);
                    if (!validation_1.isVisible(el.textContent))
                        return;
                    return [
                        [el],
                        rest
                    ];
                })(source);
            };
        },
        {
            '../../combinator': 18,
            '../inline': 48,
            '../source/validation': 79,
            'typed-dom': 11
        }
    ],
    70: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../combinator');
            const block_1 = require('./block');
            const segment_1 = require('./segment');
            function parse(source) {
                return segment_1.segment(source).reduce((frag, seg) => parse_(seg).reduce((doc, el) => (void doc.appendChild(el), doc), frag), document.createDocumentFragment());
            }
            exports.parse = parse;
            function parse_(source) {
                return (block_1.block(source) || [[]])[0];
            }
            exports.parse_ = parse_;
            const symbols = /^[#~:|>`$-+*\s]|^[0-9a-z]+\.|[*`$&()\[\]{}]|\\./gim;
            function escape(source) {
                return source.replace(symbols, str => str[0] === '\\' ? str : `\\${ str }`);
            }
            exports.escape = escape;
        },
        {
            '../combinator': 18,
            './block': 26,
            './segment': 71
        }
    ],
    71: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../combinator');
            const pretext_1 = require('./block/pretext');
            const extension_1 = require('./block/extension');
            const nonemptyline_1 = require('./source/nonemptyline');
            const emptyline_1 = require('./source/emptyline');
            function segment(source) {
                const segments = [];
                while (source.length > 0) {
                    const [, rest = ''] = combinator_1.combine([
                        pretext_1.pretext,
                        extension_1.extension,
                        nonemptyline_1.nonemptylines,
                        emptyline_1.emptylines
                    ])(source) || [];
                    void segments.push(source.slice(0, source.length - rest.length));
                    source = rest;
                }
                return segments;
            }
            exports.segment = segment;
        },
        {
            '../combinator': 18,
            './block/extension': 29,
            './block/pretext': 40,
            './source/emptyline': 73,
            './source/nonemptyline': 75
        }
    ],
    72: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            function char(char) {
                return source => {
                    switch (source[0]) {
                    case char:
                        return [
                            [document.createTextNode(source.slice(0, 1))],
                            source.slice(1)
                        ];
                    default:
                        return;
                    }
                };
            }
            exports.char = char;
            ;
        },
        {}
    ],
    73: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const syntax = /^(?:[^\S\n]*(?:\n|$))*/;
            exports.emptylines = source => {
                if (source.length === 0)
                    return;
                const [whole = ''] = source.match(syntax) || [];
                return whole === '' ? undefined : [
                    [],
                    source.slice(whole.length)
                ];
            };
        },
        {}
    ],
    74: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const separator = /[^0-9a-zA-Z\u0080-\uFFFF]/;
            exports.escsource = source => {
                if (source.length === 0)
                    return;
                const i = source.search(separator);
                switch (i) {
                case -1:
                    return [
                        [document.createTextNode(source)],
                        ''
                    ];
                case 0:
                    switch (source[0]) {
                    case '\\':
                        switch (source[1]) {
                        case '\n':
                            return [
                                [document.createTextNode(source.slice(0, 1))],
                                source.slice(1)
                            ];
                        default:
                            return [
                                [document.createTextNode(source.slice(0, 2))],
                                source.slice(2)
                            ];
                        }
                    default:
                        return [
                            [document.createTextNode(source.slice(0, 1))],
                            source.slice(1)
                        ];
                    }
                default:
                    return [
                        [document.createTextNode(source.slice(0, i))],
                        source.slice(i)
                    ];
                }
            };
        },
        {}
    ],
    75: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const syntax = /^(?:[^\S\n]*?\S[^\n]*(?:\n|$))*/;
            exports.nonemptylines = source => {
                if (source.length === 0)
                    return;
                const [whole = ''] = source.match(syntax) || [];
                return whole === '' ? undefined : [
                    [],
                    source.slice(whole.length)
                ];
            };
        },
        {}
    ],
    76: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../combinator');
            const escapable_1 = require('../source/escapable');
            const validation_1 = require('../source/validation');
            const syntax = /^\(\S*?\)/;
            const closer = /^\)|^\s/;
            exports.parenthesis = source => {
                if (!validation_1.match(source, '(', syntax))
                    return;
                return combinator_1.transform(combinator_1.bracket('(', combinator_1.some(combinator_1.combine([
                    exports.parenthesis,
                    escapable_1.escsource
                ]), closer), ')'), (_, rest) => [
                    [document.createTextNode(source.slice(0, source.length - rest.length))],
                    rest
                ])(source);
            };
        },
        {
            '../../combinator': 18,
            '../source/escapable': 74,
            '../source/validation': 79
        }
    ],
    77: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const typed_dom_1 = require('typed-dom');
            const separator = /[^0-9a-zA-Z\u0080-\uFFFF]|[\u0300-\u036F]|(?:[0-9a-zA-Z][!?]*h|\?h|[0-9a-gi-zA-Z!?])ttps?:|[0-9a-zA-Z@]?@[0-9a-zA-Z]|[、。]/;
            const linebreaks = /^(?:(?:\\?\s)*?\\?\n)+/;
            exports.text = source => {
                if (source.length === 0)
                    return;
                const i = source.search(separator);
                switch (i) {
                case -1:
                    return [
                        [document.createTextNode(source)],
                        ''
                    ];
                case 0:
                    switch (source[0]) {
                    case '\\':
                        switch (source[1]) {
                        case '\n':
                            return [
                                [typed_dom_1.html('br')],
                                source.replace(linebreaks, '')
                            ];
                        default:
                            return [
                                [document.createTextNode(source.slice(1, 2))],
                                source.slice(2)
                            ];
                        }
                    case '\u3001':
                    case '\u3002':
                    case '\uFF01':
                    case '\uFF1F':
                        switch (source[1]) {
                        case '\n':
                            return [
                                [document.createTextNode(source.slice(0, 1))],
                                source.slice(2)
                            ];
                        default:
                            return [
                                [document.createTextNode(source.slice(0, 1))],
                                source.slice(1)
                            ];
                        }
                    case '\n':
                        return [
                            [typed_dom_1.html('span', { class: 'newline' }, ' ')],
                            source.slice(1)
                        ];
                    default:
                        return [
                            [document.createTextNode(source.slice(0, 1))],
                            source.slice(1)
                        ];
                    }
                default:
                    return [
                        [document.createTextNode(source.slice(0, i))],
                        source.slice(i)
                    ];
                }
            };
        },
        { 'typed-dom': 11 }
    ],
    78: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const separator = /`|<\/code>|\s/i;
            exports.unescsource = source => {
                if (source.length === 0)
                    return;
                const i = source.search(separator);
                switch (i) {
                case -1:
                    return [
                        [document.createTextNode(source)],
                        ''
                    ];
                case 0:
                    return [
                        [document.createTextNode(source.slice(0, 1))],
                        source.slice(1)
                    ];
                default:
                    return [
                        [document.createTextNode(source.slice(0, i))],
                        source.slice(i)
                    ];
                }
            };
        },
        {}
    ],
    79: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            function match(source, start, syntax) {
                return source.startsWith(start) && (!syntax || source.search(syntax) === 0);
            }
            exports.match = match;
            function isVisible(source) {
                return source.trim() !== '';
            }
            exports.isVisible = isVisible;
            function isTightVisible(source) {
                return isVisible(source) && source === source.trim();
            }
            exports.isTightVisible = isTightVisible;
            function isSingleLine(source) {
                return !source.includes('\n');
            }
            exports.isSingleLine = isSingleLine;
        },
        {}
    ],
    80: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var Types;
            (function (Types) {
                Types[Types['Array'] = 0] = 'Array';
                Types[Types['Node'] = 1] = 'Node';
            }(Types || (Types = {})));
            function squash(nodes, container = []) {
                const obj = Array.isArray(container) ? {
                    type: 0,
                    value: container
                } : {
                    type: 1,
                    value: container
                };
                void nodes.reduce((prev, curr) => {
                    if (prev && prev.nodeType === 3 && curr.nodeType === 3) {
                        prev.textContent += curr.textContent;
                        curr.textContent = '';
                        return prev;
                    }
                    switch (obj.type) {
                    case 0:
                        void obj.value.push(curr);
                        break;
                    case 1:
                        void obj.value.appendChild(curr);
                        break;
                    }
                    return curr;
                }, undefined);
                return container;
            }
            exports.squash = squash;
        },
        {}
    ],
    81: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const typed_dom_1 = require('typed-dom');
            function sanitize(url) {
                url = url.trim().replace(/\s/g, encodeURIComponent);
                return isAcceptedProtocol(url) ? url : '';
            }
            exports.sanitize = sanitize;
            const parser = typed_dom_1.html('a');
            function isAcceptedProtocol(url) {
                parser.setAttribute('href', url);
                return [
                    'http:',
                    'https:'
                ].includes(parser.protocol);
            }
        },
        { 'typed-dom': 11 }
    ],
    82: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var render_1 = require('./renderer/render');
            exports.render = render_1.render;
        },
        { './renderer/render': 83 }
    ],
    83: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const media_1 = require('./render/media');
            const code_1 = require('./render/code');
            const math_1 = require('./render/math');
            function render(target, opts = {}) {
                void [
                    target,
                    ...target.querySelectorAll('img, pre, .math')
                ].forEach(target => void new Promise(() => {
                    switch (true) {
                    case target.matches('img:not([src])[data-src]'): {
                            const el = media_1.media(target, opts.media);
                            const scope = el instanceof HTMLImageElement === false && target.closest('a, h1, h2, h3, h4, h5, h6, p, li, dl, td') instanceof HTMLAnchorElement ? target.closest('a') : target;
                            return void scope.parentElement.replaceChild(el, scope);
                        }
                    case target.matches('pre') && target.children.length === 0:
                        return void (opts.code || code_1.code)(target);
                    case target.matches('.math') && target.children.length === 0:
                        return void (opts.math || math_1.math)(target);
                    default:
                        return;
                    }
                }));
                return target;
            }
            exports.render = render;
        },
        {
            './render/code': 84,
            './render/math': 85,
            './render/media': 86
        }
    ],
    84: [
        function (require, module, exports) {
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
    85: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const math_1 = require('../../parser/inline/math');
            function math(target) {
                if (target instanceof HTMLDivElement)
                    return void queue(target);
                void target.setAttribute('data-src', target.textContent);
                const expr = target.textContent;
                if (math_1.cache.has(expr))
                    return void (target.innerHTML = math_1.cache.get(expr).innerHTML);
                void queue(target, () => void math_1.cache.set(expr, target.cloneNode(true)));
            }
            exports.math = math;
            function queue(target, callback = () => undefined) {
                void MathJax.Hub.Queue([
                    'Typeset',
                    MathJax.Hub,
                    target,
                    callback
                ]);
            }
        },
        { '../../parser/inline/math': 66 }
    ],
    86: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const twitter_1 = require('./media/twitter');
            const youtube_1 = require('./media/youtube');
            const gist_1 = require('./media/gist');
            const slideshare_1 = require('./media/slideshare');
            const pdf_1 = require('./media/pdf');
            const video_1 = require('./media/video');
            const audio_1 = require('./media/audio');
            const image_1 = require('./media/image');
            function media(target, opts = {}) {
                const url = target.getAttribute('data-src');
                const alt = target.getAttribute('alt') || '';
                switch (true) {
                case url.startsWith('https://twitter.com/'):
                    return (opts.twitter || twitter_1.twitter)(url);
                case url.startsWith('https://www.youtube.com/') || url.startsWith('https://youtu.be/'):
                    return (opts.youtube || youtube_1.youtube)(url);
                case url.startsWith('https://gist.github.com/'):
                    return (opts.gist || gist_1.gist)(url);
                case url.startsWith('https://www.slideshare.net/'):
                    return (opts.slideshare || slideshare_1.slideshare)(url);
                case url.split('/').length > 3 && ['.pdf'].some(ext => url.split(/[?#]/, 1)[0].toLowerCase().endsWith(ext)):
                    return (opts.pdf || pdf_1.pdf)(url);
                case url.split('/').length > 3 && [
                        '.webm',
                        '.ogv'
                    ].some(ext => url.split(/[?#]/, 1)[0].toLowerCase().endsWith(ext)):
                    return (opts.video || video_1.video)(url, alt);
                case url.split('/').length > 3 && [
                        '.oga',
                        '.ogg'
                    ].some(ext => url.split(/[?#]/, 1)[0].toLowerCase().endsWith(ext)):
                    return (opts.audio || audio_1.audio)(url, alt);
                default:
                    return (opts.image || image_1.image)(url, alt);
                }
            }
            exports.media = media;
        },
        {
            './media/audio': 87,
            './media/gist': 88,
            './media/image': 89,
            './media/pdf': 90,
            './media/slideshare': 91,
            './media/twitter': 92,
            './media/video': 93,
            './media/youtube': 94
        }
    ],
    87: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const media_1 = require('../../../parser/inline/media');
            const typed_dom_1 = require('typed-dom');
            function audio(url, alt) {
                return media_1.cache.has(url) ? media_1.cache.get(url).cloneNode(true) : media_1.cache.set(url, typed_dom_1.html('audio', {
                    class: 'media',
                    src: url,
                    alt,
                    controls: '',
                    style: 'width: 100%;'
                }).cloneNode(true));
            }
            exports.audio = audio;
        },
        {
            '../../../parser/inline/media': 67,
            'typed-dom': 11
        }
    ],
    88: [
        function (require, module, exports) {
            (function (global) {
                'use strict';
                Object.defineProperty(exports, '__esModule', { value: true });
                const parser_1 = require('../../../parser');
                const media_1 = require('../../../parser/inline/media');
                const dompurify_1 = typeof window !== 'undefined' ? window['DOMPurify'] : typeof global !== 'undefined' ? global['DOMPurify'] : null;
                const typed_dom_1 = require('typed-dom');
                function gist(url) {
                    if (media_1.cache.has(url))
                        return media_1.cache.get(url).cloneNode(true);
                    return typed_dom_1.default.div({
                        class: 'media',
                        style: 'position: relative;'
                    }, [typed_dom_1.default.em(`loading ${ url }`)], () => {
                        const outer = typed_dom_1.html('div');
                        void $.ajax(`${ url }.json`, {
                            dataType: 'jsonp',
                            timeout: 10 * 1000,
                            cache: true,
                            success({div, stylesheet, description}) {
                                if (!stylesheet.startsWith('https://assets-cdn.github.com/'))
                                    return;
                                outer.innerHTML = dompurify_1.sanitize(`<div style="position: relative; margin-bottom: -1em;">${ div }</div>`);
                                const gist = outer.querySelector('.gist');
                                void gist.insertBefore(typed_dom_1.default.div({ class: 'gist-description' }, [typed_dom_1.default.a({ style: 'color: #555; font-size: 14px; font-weight: 600;' }, description, () => parser_1.parse(parser_1.escape(url)).querySelector('a'))]).element, gist.firstChild);
                                void media_1.cache.set(url, outer.cloneNode(true));
                                if (document.head.querySelector(`link[rel="stylesheet"][href="${ stylesheet }"]`))
                                    return;
                                void document.head.appendChild(typed_dom_1.html('link', {
                                    rel: 'stylesheet',
                                    href: stylesheet,
                                    crossorigin: 'anonymous'
                                }));
                            },
                            error({status, statusText}) {
                                outer.innerHTML = parser_1.parse(`*${ parser_1.escape(url) }\\\n-> ${ status }: ${ parser_1.escape(statusText) }*`).querySelector('p').innerHTML;
                            }
                        });
                        return outer;
                    }).element;
                }
                exports.gist = gist;
            }.call(this, typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {}));
        },
        {
            '../../../parser': 24,
            '../../../parser/inline/media': 67,
            'typed-dom': 11
        }
    ],
    89: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const media_1 = require('../../../parser/inline/media');
            const typed_dom_1 = require('typed-dom');
            function image(url, alt) {
                return media_1.cache.has(url) ? media_1.cache.get(url).cloneNode(true) : media_1.cache.set(url, typed_dom_1.html('img', {
                    class: 'media',
                    src: url,
                    alt,
                    style: 'max-width: 100%;'
                }).cloneNode(true));
            }
            exports.image = image;
        },
        {
            '../../../parser/inline/media': 67,
            'typed-dom': 11
        }
    ],
    90: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const parser_1 = require('../../../parser');
            const typed_dom_1 = require('typed-dom');
            function pdf(url) {
                return typed_dom_1.default.div({
                    class: 'media',
                    style: 'position: relative;'
                }, [
                    typed_dom_1.default.div({ style: 'position: relative; resize: vertical; overflow: hidden; padding-bottom: 10px;' }, [typed_dom_1.default.object({
                            type: 'application/pdf',
                            data: url,
                            style: 'width: 100%; height: 100%; min-height: 400px;'
                        }, () => {
                            const el = typed_dom_1.html('object');
                            el.typeMustMatch = true;
                            return el;
                        })]),
                    typed_dom_1.default.div([typed_dom_1.default.strong({ style: 'word-wrap: break-word;' }, () => parser_1.parse(`**${ parser_1.escape(url) }**`).querySelector('strong'))])
                ]).element;
            }
            exports.pdf = pdf;
        },
        {
            '../../../parser': 24,
            'typed-dom': 11
        }
    ],
    91: [
        function (require, module, exports) {
            (function (global) {
                'use strict';
                Object.defineProperty(exports, '__esModule', { value: true });
                const parser_1 = require('../../../parser');
                const media_1 = require('../../../parser/inline/media');
                const dompurify_1 = typeof window !== 'undefined' ? window['DOMPurify'] : typeof global !== 'undefined' ? global['DOMPurify'] : null;
                const typed_dom_1 = require('typed-dom');
                function slideshare(url) {
                    if (media_1.cache.has(url))
                        return media_1.cache.get(url).cloneNode(true);
                    return typed_dom_1.default.div({
                        class: 'media',
                        style: 'position: relative;'
                    }, [typed_dom_1.default.em(`loading ${ url }`)], () => {
                        const outer = typed_dom_1.html('div');
                        void $.ajax(`https://www.slideshare.net/api/oembed/2?url=${ url }&format=json`, {
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
                                void media_1.cache.set(url, outer.cloneNode(true));
                            },
                            error({status, statusText}) {
                                outer.innerHTML = parser_1.parse(`*${ parser_1.escape(url) }\\\n-> ${ status }: ${ parser_1.escape(statusText) }*`).querySelector('p').innerHTML;
                            }
                        });
                        return outer;
                    }).element;
                }
                exports.slideshare = slideshare;
            }.call(this, typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {}));
        },
        {
            '../../../parser': 24,
            '../../../parser/inline/media': 67,
            'typed-dom': 11
        }
    ],
    92: [
        function (require, module, exports) {
            (function (global) {
                'use strict';
                Object.defineProperty(exports, '__esModule', { value: true });
                const parser_1 = require('../../../parser');
                const cache_1 = require('spica/cache');
                const dompurify_1 = typeof window !== 'undefined' ? window['DOMPurify'] : typeof global !== 'undefined' ? global['DOMPurify'] : null;
                const typed_dom_1 = require('typed-dom');
                let widgetScriptRequested = false;
                const cache = new cache_1.Cache(100);
                function twitter(url) {
                    if (cache.has(url)) {
                        const el = cache.get(url).cloneNode(true);
                        window.twttr && void window.twttr.widgets.load(el);
                        return el;
                    }
                    return typed_dom_1.default.div({
                        class: 'media',
                        style: 'position: relative;'
                    }, [typed_dom_1.default.em(`loading ${ url }`)], () => {
                        const outer = typed_dom_1.html('div');
                        void $.ajax(`https://publish.twitter.com/oembed?url=${ url.replace('?', '&') }`, {
                            dataType: 'jsonp',
                            timeout: 10 * 1000,
                            cache: true,
                            success({html}) {
                                outer.innerHTML = dompurify_1.sanitize(`<div style="margin-top: -10px; margin-bottom: -10px;">${ html }</div>`, { ADD_TAGS: ['script'] });
                                void cache.set(url, outer.cloneNode(true));
                                if (window.twttr)
                                    return void window.twttr.widgets.load(outer);
                                if (widgetScriptRequested)
                                    return;
                                widgetScriptRequested = true;
                                const script = outer.querySelector('script');
                                if (!script.getAttribute('src').startsWith('https://platform.twitter.com/'))
                                    return;
                                void $.ajax(script.src, {
                                    dataType: 'script',
                                    cache: true
                                });
                            },
                            error({status, statusText}) {
                                outer.innerHTML = parser_1.parse(`*${ parser_1.escape(url) }\\\n-> ${ status }: ${ parser_1.escape(statusText) }*`).querySelector('p').innerHTML;
                            }
                        });
                        return outer;
                    }).element;
                }
                exports.twitter = twitter;
            }.call(this, typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {}));
        },
        {
            '../../../parser': 24,
            'spica/cache': 5,
            'typed-dom': 11
        }
    ],
    93: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const media_1 = require('../../../parser/inline/media');
            const typed_dom_1 = require('typed-dom');
            function video(url, alt) {
                return media_1.cache.has(url) ? media_1.cache.get(url).cloneNode(true) : media_1.cache.set(url, typed_dom_1.html('video', {
                    class: 'media',
                    src: url,
                    alt,
                    muted: '',
                    controls: '',
                    style: 'max-width: 100%;'
                }).cloneNode(true));
            }
            exports.video = video;
        },
        {
            '../../../parser/inline/media': 67,
            'typed-dom': 11
        }
    ],
    94: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const typed_dom_1 = require('typed-dom');
            function youtube(url) {
                return typed_dom_1.default.div({
                    class: 'media',
                    style: 'position: relative;'
                }, [typed_dom_1.default.div({ style: 'position: relative; padding-top: 56.25%;' }, [typed_dom_1.default.iframe({
                            src: `https://www.youtube.com/embed/${ url.startsWith('https://www.youtube.com/') && url.replace(/.+?=/, '').replace(/&/, '?') || url.startsWith('https://youtu.be/') && url.slice(url.indexOf('/', 9) + 1) }`,
                            allowfullscreen: '',
                            frameborder: '0',
                            style: 'position: absolute; top: 0; right: 0; width: 100%; height: 100%;'
                        })])]).element;
            }
            exports.youtube = youtube;
        },
        { 'typed-dom': 11 }
    ],
    95: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var figure_1 = require('./util/figure');
            exports.figure = figure_1.figure;
            var footnote_1 = require('./util/footnote');
            exports.footnote = footnote_1.footnote;
            var toc_1 = require('./util/toc');
            exports.toc = toc_1.toc;
        },
        {
            './util/figure': 96,
            './util/footnote': 97,
            './util/toc': 98
        }
    ],
    96: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const typed_dom_1 = require('typed-dom');
            function figure(source, header = el => capitalize(`${ el.getAttribute('data-type') }. ${ el.getAttribute('data-index') }.`)) {
                return void [...source.querySelectorAll('figure[class^="label:"]')].reduce((map, el) => {
                    const label = el.className;
                    const caption = el.lastElementChild;
                    const type = caption.getAttribute('data-type');
                    const es = map.get(type) || map.set(type, []).get(type);
                    void es.push(el);
                    const idx = index(label, es);
                    void el.setAttribute('id', `${ label.split('-', 1)[0] }-${ idx }`);
                    void caption.setAttribute('data-index', `${ idx }`);
                    if (caption.children.length === 1) {
                        void caption.insertBefore(typed_dom_1.html('span', header(caption.cloneNode())), caption.firstChild);
                    } else {
                        void caption.replaceChild(typed_dom_1.html('span', header(caption.cloneNode())), caption.firstChild);
                    }
                    void source.querySelectorAll(`a.${ label.replace(/[:.]/g, '\\$&') }`).forEach(link => {
                        void link.setAttribute('href', `#${ el.id }`);
                        void link.replaceChild(caption.firstChild.firstChild.cloneNode(true), link.firstChild);
                    });
                    return map;
                }, new Map());
                function index(label, es) {
                    switch (true) {
                    case isFixed(label):
                        return label.split('-').pop();
                    case isGroup(label):
                        return increment(label.split('-').pop(), es.length > 1 ? es[es.length - 2].lastElementChild.getAttribute('data-index') : '');
                    default:
                        return es.length + '';
                    }
                }
                function isFixed(label) {
                    return label.split(':').pop().search(/^[a-z][0-9a-z]*-[0-9]+(?:\.[0-9]+)*$/) === 0;
                }
                function isGroup(label) {
                    return label.split('-').pop().search(/^0(?:\.0)*$/) === 0;
                }
                function increment(order, prev) {
                    if (!prev)
                        return '1';
                    const ps = prev.split('.');
                    const os = order.split('.');
                    return Array(Math.max(ps.length, os.length)).fill(0).map((_, i) => +ps[i]).map((p, i) => isFinite(p) ? i + 1 < os.length ? p : i + 1 === os.length ? p + 1 : NaN : i + 1 < os.length ? 0 : 1).filter(isFinite).join('.');
                }
            }
            exports.figure = figure;
            function capitalize(str) {
                return str[0].toUpperCase() + str.slice(1);
            }
        },
        { 'typed-dom': 11 }
    ],
    97: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const indexer_1 = require('../parser/block/util/indexer');
            const typed_dom_1 = require('typed-dom');
            const annotation = new WeakMap();
            const reference = new WeakMap();
            function footnote(source, target) {
                return void typed_dom_1.TypedHTML.ol([...source.querySelectorAll('.annotation')].map((el, i) => {
                    !annotation.has(el) && void annotation.set(el, [...el.childNodes]);
                    reference.has(el) && void reference.get(el).remove();
                    void defineTitle(el);
                    void defineId(el, i + 1);
                    const id = `footnote:${ i + 1 }:${ description(el.getAttribute('title')) }`;
                    void reference.set(el, el.appendChild(typed_dom_1.html('a', {
                        href: `#${ id }`,
                        rel: 'noopener'
                    }, `[${ i + 1 }]`)));
                    return typed_dom_1.TypedHTML.li(() => typed_dom_1.html('li', { id }, [
                        ...annotation.get(el),
                        typed_dom_1.html('sup', [typed_dom_1.html('a', {
                                href: `#${ el.id }`,
                                rel: 'noopener'
                            }, el.lastChild.textContent)])
                    ]));
                }), () => target).element;
            }
            exports.footnote = footnote;
            function defineTitle(target) {
                if (target.hasAttribute('title'))
                    return;
                void target.setAttribute('title', indexer_1.text(target));
            }
            function defineId(target, index) {
                if (target.hasAttribute('id'))
                    return;
                void target.setAttribute('id', `annotation:${ index }:${ description(target.getAttribute('title')) }`);
            }
            function description(str) {
                str = str.replace(/\s/g, '_');
                return str.slice(0, 15) + '.'.repeat(str.slice(15, 18).length);
            }
        },
        {
            '../parser/block/util/indexer': 44,
            'typed-dom': 11
        }
    ],
    98: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const typed_dom_1 = require('typed-dom');
            const concat_1 = require('spica/concat');
            function toc(source) {
                const hs = [...source.children].filter(el => el instanceof HTMLHeadingElement);
                return parse(cons(hs));
                function parse(node) {
                    return typed_dom_1.html('ul', node.map(node => node instanceof Element ? typed_dom_1.html('li', [typed_dom_1.html('a', {
                            href: `#${ node.id }`,
                            rel: 'noopener'
                        }, node.textContent)]) : typed_dom_1.html('li', [
                        typed_dom_1.html('a', {
                            href: `#${ node[0].id }`,
                            rel: 'noopener'
                        }, node[0].textContent),
                        parse(node[1])
                    ])));
                }
                function cons(hs) {
                    return hs.reduce((hss, h) => {
                        const hs = hss[hss.length - 1];
                        const [fst = undefined] = hs;
                        !fst || level(h) > level(fst) ? void hs.push(h) : void hss.push([h]);
                        return hss;
                    }, [[]]).reduce((node, hs) => concat_1.concat(node, hs.length > 1 ? [[
                            hs.shift(),
                            cons(hs)
                        ]] : hs), []);
                    function level(h) {
                        return +h.tagName[1];
                    }
                }
            }
            exports.toc = toc;
        },
        {
            'spica/concat': 6,
            'typed-dom': 11
        }
    ],
    'securemark': [
        function (require, module, exports) {
            'use strict';
            function __export(m) {
                for (var p in m)
                    if (!exports.hasOwnProperty(p))
                        exports[p] = m[p];
            }
            Object.defineProperty(exports, '__esModule', { value: true });
            __export(require('./src/parser'));
            __export(require('./src/renderer'));
            __export(require('./src/util'));
        },
        {
            './src/parser': 24,
            './src/renderer': 82,
            './src/util': 95
        }
    ]
}, {}, [
    1,
    2,
    'securemark',
    3
]);