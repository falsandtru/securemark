/*! securemark v0.61.0 https://github.com/falsandtru/securemark | (c) 2017, falsandtru | (Apache-2.0 AND MPL-2.0) License */
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
            arguments[4][1][0].apply(exports, arguments);
        },
        { 'dup': 1 }
    ],
    5: [
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
        { './type': 10 }
    ],
    6: [
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
            './assign': 5,
            './equal': 8
        }
    ],
    7: [
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
    8: [
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
    9: [
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
    10: [
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
    11: [
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
    12: [
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
            './src/dom/builder': 13,
            './src/util/dom': 16,
            './src/util/listener': 17
        }
    ],
    13: [
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
            '../util/dom': 16,
            './manager': 15
        }
    ],
    14: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const uuid_1 = require('spica/uuid');
            const sqid_1 = require('spica/sqid');
            const id = uuid_1.uuid().split('-').pop();
            function uid() {
                return `id-${ id }-${ String(+sqid_1.sqid()).padStart(6, '0') }`;
            }
            exports.uid = uid;
        },
        {
            'spica/sqid': 9,
            'spica/uuid': 11
        }
    ],
    15: [
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
                get query() {
                    return this.id === this.element_.id.trim() ? `#${ this.id }` : `.${ this.id }`;
                }
                scope(children) {
                    const syntax = /^(\s*)\$scope(?!\w)/gm;
                    return void children.forEach(child => child.element instanceof HTMLStyleElement && void parse(child.element, this.query));
                    function parse(style, query) {
                        if (style.innerHTML.search(syntax) === -1)
                            return;
                        style.innerHTML = style.innerHTML.replace(syntax, (_, indent) => `${ indent }${ query }`);
                        const id = query.slice(1);
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
        { './identity': 14 }
    ],
    16: [
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
            function frag(children = []) {
                children = typeof children === 'string' ? [text(children)] : children;
                const frag = document.createDocumentFragment();
                void [...children].forEach(child => void frag.appendChild(child));
                return frag;
            }
            exports.frag = frag;
            function text(source) {
                return document.createTextNode(source);
            }
            exports.text = text;
            function element(ns, tag, attrs = {}, children = []) {
                if (isChildren(attrs))
                    return element(ns, tag, {}, attrs);
                if (typeof children === 'string')
                    return element(ns, tag, attrs, [text(children)]);
                const key = `${ ns }:${ tag }`;
                const el = cache.has(key) ? cache.get(key).cloneNode(true) : cache.set(key, elem(ns, tag)).get(key).cloneNode(true);
                void Object.entries(attrs).forEach(([name, value]) => void el.setAttribute(name, value));
                void [...children].forEach(child => void el.appendChild(child));
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
            function isChildren(o) {
                return !!o[Symbol.iterator];
            }
        },
        {}
    ],
    17: [
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
        { './noop': 18 }
    ],
    18: [
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
    19: [
        function (require, module, exports) {
            'use strict';
            function __export(m) {
                for (var p in m)
                    if (!exports.hasOwnProperty(p))
                        exports[p] = m[p];
            }
            Object.defineProperty(exports, '__esModule', { value: true });
            __export(require('./combinator/union'));
            __export(require('./combinator/sequence'));
            __export(require('./combinator/subsequence'));
            __export(require('./combinator/inits'));
            __export(require('./combinator/tails'));
            __export(require('./combinator/some'));
            __export(require('./combinator/match'));
            __export(require('./combinator/surround'));
            __export(require('./combinator/contract'));
            __export(require('./combinator/indent'));
            __export(require('./combinator/fmap'));
            __export(require('./combinator/bind'));
            __export(require('./combinator/rewrite'));
            __export(require('./combinator/trim'));
            __export(require('./combinator/build'));
        },
        {
            './combinator/bind': 20,
            './combinator/build': 21,
            './combinator/contract': 22,
            './combinator/fmap': 23,
            './combinator/indent': 24,
            './combinator/inits': 25,
            './combinator/match': 26,
            './combinator/rewrite': 27,
            './combinator/sequence': 28,
            './combinator/some': 29,
            './combinator/subsequence': 30,
            './combinator/surround': 31,
            './combinator/tails': 32,
            './combinator/trim': 33,
            './combinator/union': 34
        }
    ],
    20: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            function bind(parser, f) {
                return source => {
                    if (source === '')
                        return;
                    const [rs = [], rest = undefined] = parser(source) || [];
                    if (rest === undefined)
                        return;
                    if (rest.length >= source.length)
                        return;
                    const result = f(rs, rest);
                    return result && result[1].length <= rest.length ? result : undefined;
                };
            }
            exports.bind = bind;
        },
        {}
    ],
    21: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            function build(builder) {
                let parser;
                return source => (parser = parser || builder())(source);
            }
            exports.build = build;
        },
        {}
    ],
    22: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            function contract(pattern, parser, cond) {
                return verify(validate(pattern, parser), cond);
            }
            exports.contract = contract;
            function validate(pattern, parser) {
                return source => {
                    const result = match(source, pattern);
                    if (!result)
                        return;
                    const [rs = [], r = undefined] = parser(source) || [];
                    if (r === undefined)
                        return;
                    return r.length < source.length ? [
                        rs,
                        r
                    ] : undefined;
                };
            }
            exports.validate = validate;
            function verify(parser, cond) {
                return source => {
                    const [rs = [], r = undefined] = parser(source) || [];
                    if (r === undefined)
                        return;
                    if (!cond(rs, r))
                        return;
                    return r.length < source.length ? [
                        rs,
                        r
                    ] : undefined;
                };
            }
            exports.verify = verify;
            function match(source, pattern) {
                if (typeof pattern === 'string')
                    return source.startsWith(pattern) ? [pattern] : null;
                return source.match(pattern);
            }
        },
        {}
    ],
    23: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const bind_1 = require('./bind');
            function fmap(parser, f) {
                return bind_1.bind(parser, (rs, r) => [
                    f(rs),
                    r
                ]);
            }
            exports.fmap = fmap;
        },
        { './bind': 20 }
    ],
    24: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const some_1 = require('./some');
            const match_1 = require('./match');
            const surround_1 = require('./surround');
            const line_1 = require('../parser/source/line');
            const bind_1 = require('./bind');
            function indent(parser) {
                return bind_1.bind(match_1.match(/^\s+/, ([whole], rest) => some_1.some(line_1.line(surround_1.surround(whole, s => [
                    [s.split('\n')[0]],
                    ''
                ], ''), true, true))(whole + rest)), (rs, rest) => {
                    const result = parser(rs.join('\n'));
                    return result && result[1] === '' ? [
                        result[0],
                        rest
                    ] : undefined;
                });
            }
            exports.indent = indent;
        },
        {
            '../parser/source/line': 86,
            './bind': 20,
            './match': 26,
            './some': 29,
            './surround': 31
        }
    ],
    25: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            function inits(parsers) {
                return source => {
                    let rest = source;
                    const results = [];
                    for (const parser of parsers) {
                        if (rest === '')
                            break;
                        const [rs = [], r = undefined] = parser(rest) || [];
                        if (r === undefined)
                            break;
                        if (r.length >= rest.length)
                            return;
                        void results.push(...rs);
                        rest = r;
                    }
                    return rest.length < source.length ? [
                        results,
                        rest
                    ] : undefined;
                };
            }
            exports.inits = inits;
        },
        {}
    ],
    26: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            function match(pattern, f) {
                return source => {
                    const result = source.match(pattern);
                    if (!result)
                        return;
                    const rest = source.slice(result[0].length);
                    const [rs = [], r = undefined] = f(result, rest) || [];
                    if (r === undefined)
                        return;
                    return r.length < source.length && r.length <= rest.length ? [
                        rs,
                        r
                    ] : undefined;
                };
            }
            exports.match = match;
        },
        {}
    ],
    27: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            function rewrite(a, b) {
                return source => {
                    if (source === '')
                        return;
                    const ar = a(source);
                    if (!ar || ar[1].length >= source.length)
                        return;
                    const br = b(source.slice(0, source.length - ar[1].length));
                    if (!br || br[1].length >= source.length)
                        return;
                    return br[1].length + ar[1].length < source.length ? [
                        br[0],
                        br[1] + ar[1]
                    ] : undefined;
                };
            }
            exports.rewrite = rewrite;
        },
        {}
    ],
    28: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            function sequence(parsers) {
                return source => {
                    let rest = source;
                    const results = [];
                    for (const parser of parsers) {
                        if (rest === '')
                            return;
                        const [rs = [], r = undefined] = parser(rest) || [];
                        if (r === undefined)
                            return;
                        if (r.length >= rest.length)
                            return;
                        void results.push(...rs);
                        rest = r;
                    }
                    return rest.length < source.length ? [
                        results,
                        rest
                    ] : undefined;
                };
            }
            exports.sequence = sequence;
        },
        {}
    ],
    29: [
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
                        if (until && match(rest, until))
                            break;
                        const [rs = [], r = undefined] = parser(rest) || [];
                        if (r === undefined)
                            break;
                        if (r.length >= rest.length)
                            return;
                        void results.push(...rs);
                        rest = r;
                    }
                    return rest.length < source.length ? [
                        results,
                        rest
                    ] : undefined;
                };
            }
            exports.some = some;
            function match(source, pattern) {
                return typeof pattern === 'string' ? source.startsWith(pattern) : source.search(pattern) === 0;
            }
        },
        {}
    ],
    30: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            function subsequence(parsers) {
                return source => {
                    let rest = source;
                    const results = [];
                    for (const parser of parsers) {
                        if (rest === '')
                            break;
                        const [rs = [], r = undefined] = parser(rest) || [];
                        if (r === undefined)
                            continue;
                        if (r.length >= rest.length)
                            return;
                        void results.push(...rs);
                        rest = r;
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
    31: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            function surround(start, parser, end, strict = true) {
                return lmr_ => {
                    const l = match(lmr_, start);
                    if (l === undefined)
                        return;
                    const mr_ = lmr_.slice(l.length);
                    const [rs = [], r_ = mr_] = mr_ !== '' && parser(mr_) || [];
                    if (strict && r_.length === mr_.length)
                        return;
                    if (r_.length > mr_.length)
                        return;
                    const r = match(r_, end);
                    if (r === undefined)
                        return;
                    return l + r !== '' || r_.length - r.length < lmr_.length ? [
                        rs,
                        r_.slice(r.length)
                    ] : undefined;
                };
            }
            exports.surround = surround;
            function match(source, pattern) {
                if (typeof pattern === 'string')
                    return source.startsWith(pattern) ? pattern : undefined;
                const result = source.match(pattern);
                return result ? result[0] : undefined;
            }
        },
        {}
    ],
    32: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const union_1 = require('./union');
            const sequence_1 = require('./sequence');
            function tails(parsers) {
                return union_1.union(parsers.map((_, i) => sequence_1.sequence(parsers.slice(i))));
            }
            exports.tails = tails;
        },
        {
            './sequence': 28,
            './union': 34
        }
    ],
    33: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            function trim(parser) {
                return trimWith(parser, s => s.trim());
            }
            exports.trim = trim;
            function trimStart(parser) {
                return trimWith(parser, source => {
                    const mid = source.trim();
                    return source.slice(source.lastIndexOf(mid));
                });
            }
            exports.trimStart = trimStart;
            function trimEnd(parser) {
                return trimWith(parser, source => {
                    const mid = source.trim();
                    return source.slice(0, source.lastIndexOf(mid) + mid.length);
                });
            }
            exports.trimEnd = trimEnd;
            function trimWith(parser, trim) {
                return source => {
                    if (source === '')
                        return;
                    source = trim(source);
                    if (source === '')
                        return [
                            [],
                            ''
                        ];
                    const [results = [], rest = undefined] = parser(source) || [];
                    if (rest === undefined)
                        return;
                    if (rest.length >= source.length)
                        return;
                    return rest.length < source.length ? [
                        results,
                        rest
                    ] : undefined;
                };
            }
        },
        {}
    ],
    34: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            function union(parsers) {
                return source => {
                    let rest = source;
                    const results = [];
                    for (const parser of parsers) {
                        if (rest === '')
                            break;
                        const [rs = [], r = undefined] = parser(rest) || [];
                        if (r === undefined)
                            continue;
                        if (r.length >= rest.length)
                            return;
                        void results.push(...rs);
                        rest = r;
                        break;
                    }
                    return rest.length < source.length ? [
                        results,
                        rest
                    ] : undefined;
                };
            }
            exports.union = union;
        },
        {}
    ],
    35: [
        function (require, module, exports) {
            'use strict';
            function __export(m) {
                for (var p in m)
                    if (!exports.hasOwnProperty(p))
                        exports[p] = m[p];
            }
            Object.defineProperty(exports, '__esModule', { value: true });
            __export(require('./parser/api'));
        },
        { './parser/api': 36 }
    ],
    36: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var parse_1 = require('./api/parse');
            exports.parse = parse_1.parse;
            var bind_1 = require('./api/bind');
            exports.bind = bind_1.bind;
            var escape_1 = require('./api/escape');
            exports.escape = escape_1.escape;
            var cache_1 = require('./api/cache');
            exports.caches = cache_1.caches;
        },
        {
            './api/bind': 37,
            './api/cache': 38,
            './api/escape': 39,
            './api/parse': 40
        }
    ],
    37: [
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
                    const [, [ref = bottom()] = []] = pairs.slice(i).find(([, [el]]) => !!el) || [];
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
                function bottom() {
                    if (pairs.length === 0)
                        return target.firstChild;
                    for (let i = pairs.length - 1; i >= 0; --i) {
                        const [, es] = pairs[i];
                        if (es.length === 0)
                            continue;
                        return es[es.length - 1].nextSibling;
                    }
                    return target.firstChild;
                }
            }
            exports.bind = bind;
        },
        {
            './parse': 40,
            './segment': 41
        }
    ],
    38: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const math_1 = require('../inline/math');
            const media_1 = require('../inline/media');
            exports.caches = {
                math: math_1.cache,
                media: { image: media_1.cache }
            };
        },
        {
            '../inline/math': 78,
            '../inline/media': 79
        }
    ],
    39: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const symbols = /^(?:[~:|>`$-+*\s]|[0-9a-z]+\.|!>|#+\s)|[*`$&()\[\]{}]|\\./gim;
            function escape(source) {
                return source.replace(symbols, str => str[0] === '\\' ? str : `\\${ str }`);
            }
            exports.escape = escape;
        },
        {}
    ],
    40: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../combinator');
            const block_1 = require('../block');
            const segment_1 = require('./segment');
            function parse(source) {
                return segment_1.segment(source).reduce((parent, seg) => (void parse_(seg).forEach(el => void parent.appendChild(el)), parent), document.createDocumentFragment());
            }
            exports.parse = parse;
            function parse_(source) {
                return (block_1.block(source) || [[]])[0];
            }
            exports.parse_ = parse_;
        },
        {
            '../../combinator': 19,
            '../block': 42,
            './segment': 41
        }
    ],
    41: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../combinator');
            const pretext_1 = require('../block/pretext');
            const extension_1 = require('../block/extension');
            const line_1 = require('../source/line');
            function segment(source) {
                const segments = [];
                while (source.length > 0) {
                    const [, rest = ''] = combinator_1.union([
                        pretext_1.segment,
                        extension_1.segment,
                        combinator_1.some(line_1.contentline),
                        combinator_1.some(line_1.blankline)
                    ])(source) || [];
                    void segments.push(source.slice(0, source.length - rest.length));
                    source = rest;
                }
                return segments;
            }
            exports.segment = segment;
        },
        {
            '../../combinator': 19,
            '../block/extension': 45,
            '../block/pretext': 59,
            '../source/line': 86
        }
    ],
    42: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../combinator');
            const newline_1 = require('./block/newline');
            const horizontalrule_1 = require('./block/horizontalrule');
            const heading_1 = require('./block/heading');
            const ulist_1 = require('./block/ulist');
            const olist_1 = require('./block/olist');
            const ilist_1 = require('./block/ilist');
            const dlist_1 = require('./block/dlist');
            const table_1 = require('./block/table');
            const blockquote_1 = require('./block/blockquote');
            const pretext_1 = require('./block/pretext');
            const math_1 = require('./block/math');
            const extension_1 = require('./block/extension');
            const paragraph_1 = require('./block/paragraph');
            const locale_1 = require('./locale');
            exports.block = locale_1.localize(combinator_1.union([
                newline_1.newline,
                horizontalrule_1.horizontalrule,
                heading_1.heading,
                ulist_1.ulist,
                olist_1.olist,
                ilist_1.ilist,
                dlist_1.dlist,
                table_1.table,
                blockquote_1.blockquote,
                pretext_1.pretext,
                math_1.math,
                extension_1.extension,
                paragraph_1.paragraph
            ]));
        },
        {
            '../combinator': 19,
            './block/blockquote': 43,
            './block/dlist': 44,
            './block/extension': 45,
            './block/heading': 49,
            './block/horizontalrule': 50,
            './block/ilist': 51,
            './block/math': 53,
            './block/newline': 54,
            './block/olist': 55,
            './block/paragraph': 56,
            './block/pretext': 59,
            './block/table': 60,
            './block/ulist': 61,
            './locale': 81
        }
    ],
    43: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../combinator');
            const block_1 = require('../source/block');
            const line_1 = require('../source/line');
            require('../source/unescapable');
            const parse_1 = require('../api/parse');
            const typed_dom_1 = require('typed-dom');
            exports.blockquote = block_1.block(combinator_1.build(() => combinator_1.union([
                combinator_1.surround(/^(?=(>+)\s)/, textquote, ''),
                combinator_1.surround(/^!(?=(>+)\s)/, mdquote, '')
            ])));
            const opener = /^(?=>>+(?:\s|$))/;
            const textquote = combinator_1.fmap(combinator_1.build(() => combinator_1.some(combinator_1.union([
                combinator_1.fmap(combinator_1.some(line_1.line(s => [
                    [
                        typed_dom_1.text(unindent(s.split('\n')[0].replace(/ /g, String.fromCharCode(160)))),
                        typed_dom_1.html('br')
                    ],
                    ''
                ], true, true), opener), ns => ns.slice(0, -1)),
                combinator_1.rewrite(indent, s => textquote(unindent(s)))
            ]))), ns => [typed_dom_1.html('blockquote', ns)]);
            const mdquote = combinator_1.fmap(combinator_1.build(() => combinator_1.some(combinator_1.union([
                combinator_1.rewrite(combinator_1.some(line_1.line(s => [
                    [s],
                    ''
                ], true, true), opener), s => [
                    [parse_1.parse(unindent(s))],
                    ''
                ]),
                combinator_1.rewrite(indent, s => mdquote(unindent(s)))
            ]))), ns => [typed_dom_1.html('blockquote', ns)]);
            const indent = block_1.block(combinator_1.surround(opener, combinator_1.some(line_1.line(s => [
                [s],
                ''
            ], true, true), /^>(?:\s|$)/), ''), false);
            function unindent(source) {
                return source.replace(/^>(?:$|\s)|^>(?=>*(?:$|\s))/mg, '');
            }
        },
        {
            '../../combinator': 19,
            '../api/parse': 40,
            '../source/block': 83,
            '../source/line': 86,
            '../source/unescapable': 88,
            'typed-dom': 12
        }
    ],
    44: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../combinator');
            const block_1 = require('../source/block');
            const line_1 = require('../source/line');
            const indexer_1 = require('./indexer');
            const inline_1 = require('../inline');
            const util_1 = require('../util');
            const concat_1 = require('spica/concat');
            const typed_dom_1 = require('typed-dom');
            exports.dlist = block_1.block(combinator_1.fmap(combinator_1.build(() => combinator_1.some(combinator_1.inits([
                combinator_1.some(term),
                combinator_1.some(desc)
            ]))), es => [typed_dom_1.html('dl', es.length > 0 && es[es.length - 1].tagName.toLowerCase() === 'dt' ? concat_1.concat(es, [typed_dom_1.html('dd')]) : es)]));
            const term = line_1.line(combinator_1.verify(combinator_1.fmap(combinator_1.build(() => combinator_1.surround(/^~(?=\s|$)/, util_1.compress(combinator_1.trim(combinator_1.some(combinator_1.union([
                indexer_1.indexer,
                inline_1.inline
            ])))), '', false)), ns => {
                const dt = typed_dom_1.html('dt', ns);
                void indexer_1.defineIndex(dt);
                return [dt];
            }), ([el]) => !util_1.hasMedia(el)), true, true);
            const desc = block_1.block(combinator_1.fmap(combinator_1.build(() => combinator_1.rewrite(combinator_1.surround(/^:(?=\s|$)|/, combinator_1.some(line_1.line(() => [
                [],
                ''
            ], true, true), /^[~:](?:\s|$)/), '', false), combinator_1.surround(/^:(?=\s|$)|/, combinator_1.trim(combinator_1.some(combinator_1.union([inline_1.inline]))), '', false))), ns => [typed_dom_1.html('dd', ns)]), false);
        },
        {
            '../../combinator': 19,
            '../inline': 62,
            '../source/block': 83,
            '../source/line': 86,
            '../util': 90,
            './indexer': 52,
            'spica/concat': 7,
            'typed-dom': 12
        }
    ],
    45: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../combinator');
            const fig_1 = require('./extension/fig');
            const figure_1 = require('./extension/figure');
            const placeholder_1 = require('./extension/placeholder');
            exports.segment = combinator_1.union([
                fig_1.segment,
                figure_1.segment,
                placeholder_1.segment
            ]);
            exports.extension = combinator_1.union([
                fig_1.fig,
                figure_1.figure,
                placeholder_1.placeholder
            ]);
        },
        {
            '../../combinator': 19,
            './extension/fig': 46,
            './extension/figure': 47,
            './extension/placeholder': 48
        }
    ],
    46: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../../combinator');
            const block_1 = require('../../source/block');
            const line_1 = require('../../source/line');
            const figure_1 = require('./figure');
            const pretext_1 = require('../pretext');
            const inline_1 = require('../../inline');
            exports.segment = block_1.block(combinator_1.union([
                combinator_1.sequence([
                    line_1.line(combinator_1.trimEnd(inline_1.label), true, true),
                    combinator_1.union([
                        pretext_1.segment_,
                        combinator_1.some(line_1.contentline)
                    ])
                ]),
                () => undefined
            ]));
            exports.fig = block_1.block(combinator_1.rewrite(exports.segment, source => figure_1.figure(source.replace(/^([^\n]+)\n([\s\S]+?)\n?$/, '~~~figure $1\n$2\n~~~'))));
        },
        {
            '../../../combinator': 19,
            '../../inline': 62,
            '../../source/block': 83,
            '../../source/line': 86,
            '../pretext': 59,
            './figure': 47
        }
    ],
    47: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../../combinator');
            const block_1 = require('../../source/block');
            const line_1 = require('../../source/line');
            const table_1 = require('../table');
            const blockquote_1 = require('../blockquote');
            const pretext_1 = require('../pretext');
            const math_1 = require('../math');
            const inline_1 = require('../../inline');
            const util_1 = require('../../util');
            const typed_dom_1 = require('typed-dom');
            exports.segment = block_1.block(combinator_1.union([
                combinator_1.match(/^(~{3,})figure[^\S\n]+(\[:\S+?\])[^\S\n]*\n(?=((?:[^\n]*\n)*?)\1[^\S\n]*(?:\n|$))/, ([, bracket, note], rest) => {
                    return block_1.block(combinator_1.bind(combinator_1.sequence([
                        line_1.line(combinator_1.trimEnd(inline_1.label), true, true),
                        combinator_1.inits([
                            combinator_1.union([pretext_1.segment_]),
                            combinator_1.inits([
                                line_1.emptyline,
                                combinator_1.union([
                                    line_1.emptyline,
                                    combinator_1.some(line_1.contentline)
                                ])
                            ])
                        ])
                    ]), (_, rest) => rest.split('\n')[0].trim() === bracket ? [
                        [],
                        rest.slice(rest.split('\n')[0].length + 1)
                    ] : undefined))(`${ note }\n${ rest }`);
                }),
                combinator_1.match(/^(~{3,})figure[^\S\n]+(\[:\S+?\])[^\S\n]*\n((?:[^\n]*\n)*?)\1[^\S\n]*(?:\n|$)/, (_, rest) => [
                    [],
                    rest
                ])
            ]));
            exports.figure = block_1.block(combinator_1.rewrite(exports.segment, combinator_1.trimEnd(combinator_1.match(/^(~{3,})figure[^\S\n]+(\[:\S+?\])[^\S\n]*\n((?:[^\n]*\n)*?)\1$/, ([, , note, body], rest) => {
                return block_1.block(combinator_1.fmap(combinator_1.sequence([
                    line_1.line(combinator_1.trimEnd(inline_1.label), true, true),
                    combinator_1.inits([
                        block_1.block(combinator_1.union([
                            table_1.table,
                            blockquote_1.blockquote,
                            pretext_1.pretext,
                            math_1.math,
                            line_1.line(combinator_1.contract('!', combinator_1.trimEnd(inline_1.url), ([node]) => node instanceof Element), true, true)
                        ])),
                        combinator_1.rewrite(combinator_1.inits([
                            line_1.emptyline,
                            combinator_1.union([
                                line_1.emptyline,
                                combinator_1.some(line_1.contentline)
                            ])
                        ]), util_1.compress(combinator_1.trim(combinator_1.some(combinator_1.union([inline_1.inline])))))
                    ])
                ]), ([label, content, ...caption]) => [fig(label, content, caption)]))(`${ note }\n${ body.slice(0, -1) }`);
            }))));
            function fig(label, content, caption) {
                return typed_dom_1.html('figure', { class: label.getAttribute('href').slice(1) }, [
                    content,
                    typed_dom_1.html('figcaption', { 'data-type': label.getAttribute('href').slice(1).split(':', 2)[1].split('-', 1)[0] }, [typed_dom_1.html('span', caption)])
                ]);
            }
        },
        {
            '../../../combinator': 19,
            '../../inline': 62,
            '../../source/block': 83,
            '../../source/line': 86,
            '../../util': 90,
            '../blockquote': 43,
            '../math': 53,
            '../pretext': 59,
            '../table': 60,
            'typed-dom': 12
        }
    ],
    48: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../../combinator');
            const block_1 = require('../../source/block');
            const paragraph_1 = require('../paragraph');
            exports.segment = block_1.block(combinator_1.match(/^(~{3,})[^\n]*\n(?:[^\n]*\n)*?\1[^\S\n]*(?:\n|$)/, (_, rest) => [
                [],
                rest
            ]));
            exports.placeholder = block_1.block(combinator_1.rewrite(exports.segment, () => [
                paragraph_1.paragraph('*Invalid syntax: Extension syntax: ~~~.*\n')[0],
                ''
            ]));
        },
        {
            '../../../combinator': 19,
            '../../source/block': 83,
            '../paragraph': 56
        }
    ],
    49: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../combinator');
            const block_1 = require('../source/block');
            const line_1 = require('../source/line');
            const indexer_1 = require('./indexer');
            const inline_1 = require('../inline');
            const util_1 = require('../util');
            const typed_dom_1 = require('typed-dom');
            exports.heading = block_1.block(line_1.line(combinator_1.verify(combinator_1.match(/^(#{1,6})\s+([^\n]+)(?:\n|$)/, ([, {length: level}, content]) => combinator_1.bind(util_1.compress(combinator_1.trim(combinator_1.some(combinator_1.union([
                indexer_1.indexer,
                inline_1.inline
            ])))), cs => {
                const el = typed_dom_1.html(`h${ level }`, cs);
                void indexer_1.defineIndex(el);
                return [
                    [el],
                    ''
                ];
            })(content)), ([el]) => util_1.hasText(el) && !util_1.hasMedia(el)), true, true));
        },
        {
            '../../combinator': 19,
            '../inline': 62,
            '../source/block': 83,
            '../source/line': 86,
            '../util': 90,
            './indexer': 52,
            'typed-dom': 12
        }
    ],
    50: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../combinator');
            const block_1 = require('../source/block');
            const line_1 = require('../source/line');
            const typed_dom_1 = require('typed-dom');
            exports.horizontalrule = block_1.block(line_1.line(combinator_1.match(/^-{3,}[^\S\n]*(?:\n|$)/, (_, r) => [
                [typed_dom_1.html('hr')],
                r
            ])));
        },
        {
            '../../combinator': 19,
            '../source/block': 83,
            '../source/line': 86,
            'typed-dom': 12
        }
    ],
    51: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../combinator');
            const block_1 = require('../source/block');
            const line_1 = require('../source/line');
            const ulist_1 = require('./ulist');
            const olist_1 = require('./olist');
            const inline_1 = require('../inline');
            const util_1 = require('../util');
            const typed_dom_1 = require('typed-dom');
            exports.ilist = block_1.block(combinator_1.fmap(combinator_1.build(() => combinator_1.some(combinator_1.union([combinator_1.fmap(combinator_1.inits([
                    line_1.line(combinator_1.verify(combinator_1.surround(/^[-+*](?:\s|$)/, util_1.compress(combinator_1.trim(combinator_1.some(inline_1.inline))), '', false), rs => !util_1.hasMedia(typed_dom_1.html('b', rs))), true, true),
                    combinator_1.indent(combinator_1.union([
                        ulist_1.ulist,
                        olist_1.olist_,
                        exports.ilist
                    ]))
                ]), () => [typed_dom_1.html('li', combinator_1.some(inline_1.inline)('*Invalid syntax: UList syntax: Use `-` instead.*')[0])])]))), es => [typed_dom_1.html('ul', es)]));
        },
        {
            '../../combinator': 19,
            '../inline': 62,
            '../source/block': 83,
            '../source/line': 86,
            '../util': 90,
            './olist': 55,
            './ulist': 61,
            'typed-dom': 12
        }
    ],
    52: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../combinator');
            const line_1 = require('../source/line');
            const inline_1 = require('../inline');
            exports.indexer = line_1.line(combinator_1.fmap(combinator_1.surround(/^\s+?(?=\[#)/, combinator_1.trim(combinator_1.union([inline_1.index])), /$/), ([el]) => {
                void el.setAttribute('class', 'index');
                return [el];
            }));
            function defineIndex(source) {
                if (source.hasAttribute('id'))
                    return;
                const index = source.querySelector('.index');
                const id = text(index || source);
                if (id === '')
                    return;
                index && void index.remove();
                void source.setAttribute('id', makeIndex(id));
            }
            exports.defineIndex = defineIndex;
            function text(source) {
                const target = source.cloneNode(true);
                void [...target.querySelectorAll('code[data-src], .math[data-src]')].forEach(el => el.textContent = el.getAttribute('data-src'));
                return target.textContent.trim();
            }
            exports.text = text;
            function makeIndex(text) {
                return `index:${ text.trim().replace(/\s+/g, '-').toLowerCase() }`;
            }
        },
        {
            '../../combinator': 19,
            '../inline': 62,
            '../source/line': 86
        }
    ],
    53: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../combinator');
            const block_1 = require('../source/block');
            require('../source/unescapable');
            const typed_dom_1 = require('typed-dom');
            exports.math = block_1.block(combinator_1.match(/^\$\$[^\S\n]*\n(?:[^\n]+\n)+?\$\$[^\S\n]*(?:\n|$)/, ([whole], rest) => [
                [typed_dom_1.html('div', { class: 'math' }, whole.trim())],
                rest
            ]));
        },
        {
            '../../combinator': 19,
            '../source/block': 83,
            '../source/unescapable': 88,
            'typed-dom': 12
        }
    ],
    54: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../combinator');
            const line_1 = require('../source/line');
            exports.newline = combinator_1.some(combinator_1.union([line_1.blankline]));
        },
        {
            '../../combinator': 19,
            '../source/line': 86
        }
    ],
    55: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../combinator');
            const block_1 = require('../source/block');
            const line_1 = require('../source/line');
            const ulist_1 = require('./ulist');
            const ilist_1 = require('./ilist');
            const inline_1 = require('../inline');
            const util_1 = require('../util');
            const typed_dom_1 = require('typed-dom');
            const cache = new Map();
            exports.olist = block_1.block(combinator_1.match(/^([0-9]+|[a-z]+|[A-Z]+)\.(?=\s|$)/, ([whole, index], rest) => {
                const ty = type(index);
                const opener = cache.has(ty) ? cache.get(ty) : cache.set(ty, new RegExp(`^${ pattern(ty) }(?:\\.\\s|\\.?(?=\\n|$))`)).get(ty);
                return combinator_1.fmap(combinator_1.some(combinator_1.union([combinator_1.fmap(combinator_1.inits([
                        line_1.line(combinator_1.verify(combinator_1.surround(opener, util_1.compress(combinator_1.trim(combinator_1.some(inline_1.inline))), '', false), rs => !util_1.hasMedia(typed_dom_1.html('b', rs))), true, true),
                        combinator_1.indent(combinator_1.union([
                            ulist_1.ulist,
                            exports.olist_,
                            ilist_1.ilist
                        ]))
                    ]), ns => [typed_dom_1.html('li', ulist_1.fillFirstLine(ns))])])), es => [typed_dom_1.html('ol', {
                        start: index,
                        type: ty
                    }, es)])(whole + rest);
            }));
            function type(index) {
                return Number.isInteger(+index) ? '1' : index === index.toLowerCase() ? 'a' : 'A';
            }
            function pattern(type) {
                return type === 'A' ? '[A-Z]+' : type === 'a' ? '[a-z]+' : '[0-9]+';
            }
            exports.olist_ = source => exports.olist(source.replace(/^(?:[0-9]+|[A-Z]+|[a-z]+)(?=\n|$)/, `$&.`));
        },
        {
            '../../combinator': 19,
            '../inline': 62,
            '../source/block': 83,
            '../source/line': 86,
            '../util': 90,
            './ilist': 51,
            './ulist': 61,
            'typed-dom': 12
        }
    ],
    56: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../combinator');
            const block_1 = require('../source/block');
            const reference_1 = require('./paragraph/reference');
            const hashtag_1 = require('./paragraph/hashtag');
            const inline_1 = require('../inline');
            const util_1 = require('../util');
            const typed_dom_1 = require('typed-dom');
            exports.paragraph = block_1.block(combinator_1.fmap(combinator_1.build(() => combinator_1.subsequence([
                combinator_1.some(reference_1.reference),
                util_1.compress(combinator_1.trim(combinator_1.some(combinator_1.union([
                    hashtag_1.hashtag,
                    combinator_1.some(inline_1.inline, /^\s(?=#\S)/),
                    inline_1.inline
                ]))))
            ])), ns => {
                const el = typed_dom_1.html('p', dropTrailingLinebreak(ns));
                return util_1.hasContent(el) ? [el] : [];
            }));
            function dropTrailingLinebreak(ns) {
                return ns.length > 0 && ns[ns.length - 1] instanceof HTMLBRElement ? ns.slice(0, -1) : ns;
            }
        },
        {
            '../../combinator': 19,
            '../inline': 62,
            '../source/block': 83,
            '../util': 90,
            './paragraph/hashtag': 57,
            './paragraph/reference': 58,
            'typed-dom': 12
        }
    ],
    57: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../../combinator');
            const line_1 = require('../../source/line');
            require('../../source/unescapable');
            const typed_dom_1 = require('typed-dom');
            exports.hashtag = line_1.line(combinator_1.match(/^(#+)\S+/, ([tag, {length: level}], rest) => [
                [typed_dom_1.html('a', {
                        class: 'hashtag',
                        rel: 'noopener',
                        'data-level': `${ level }`
                    }, tag)],
                rest
            ]), false);
        },
        {
            '../../../combinator': 19,
            '../../source/line': 86,
            '../../source/unescapable': 88,
            'typed-dom': 12
        }
    ],
    58: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../../combinator');
            const line_1 = require('../../source/line');
            require('../../source/unescapable');
            const inline_1 = require('../../inline');
            const typed_dom_1 = require('typed-dom');
            exports.reference = line_1.line(combinator_1.validate(/^(>+)[^>\s].*/, combinator_1.union([
                combinator_1.match(/^(>+)[0-9a-z]+\s*$/, ([ref, {length: level}], rest) => [
                    [
                        typed_dom_1.html('a', {
                            class: 'reference',
                            rel: 'noopener',
                            'data-level': `${ level }`
                        }, ref.trim()),
                        typed_dom_1.html('br')
                    ],
                    rest
                ]),
                () => [
                    [
                        ...inline_1.inline(`*Invalid syntax: Reference syntax: Use lower-case alphanumeric characters in reference syntax.*`)[0],
                        typed_dom_1.html('br')
                    ],
                    ''
                ]
            ])), true, true);
        },
        {
            '../../../combinator': 19,
            '../../inline': 62,
            '../../source/line': 86,
            '../../source/unescapable': 88,
            'typed-dom': 12
        }
    ],
    59: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../combinator');
            const block_1 = require('../source/block');
            const escapable_1 = require('../source/escapable');
            require('../source/unescapable');
            const util_1 = require('../util');
            const typed_dom_1 = require('typed-dom');
            exports.segment = block_1.block(combinator_1.build(() => exports.segment_));
            exports.segment_ = block_1.block(combinator_1.match(/^(`{3,})(\S*)([^\n]*)\n((?:[^\n]*\n)*?)\1[^\S\n]*(?:\n|$)/, (_, rest) => [
                [],
                rest
            ]), false);
            exports.pretext = block_1.block(combinator_1.rewrite(exports.segment, combinator_1.trimEnd(combinator_1.match(/^(`{3,})(\S*)([^\n]*)\n((?:[^\n]*\n)*?)\1$/, ([, , lang, notes, body], rest) => {
                const el = typed_dom_1.html('pre', body.slice(0, -1));
                if (lang) {
                    void el.setAttribute('class', `language-${ lang.toLowerCase() }`);
                    void el.setAttribute('data-lang', lang);
                }
                const filepath = util_1.stringify((combinator_1.some(escapable_1.escsource, /^\s/)(notes.trim()) || [[]])[0]);
                if (filepath) {
                    void el.setAttribute('data-file', filepath);
                }
                return [
                    [el],
                    rest
                ];
            }))));
        },
        {
            '../../combinator': 19,
            '../source/block': 83,
            '../source/escapable': 85,
            '../source/unescapable': 88,
            '../util': 90,
            'typed-dom': 12
        }
    ],
    60: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../combinator');
            const block_1 = require('../source/block');
            const line_1 = require('../source/line');
            const inline_1 = require('../inline');
            const util_1 = require('../util');
            const concat_1 = require('spica/concat');
            const typed_dom_1 = require('typed-dom');
            exports.table = block_1.block(combinator_1.fmap(combinator_1.build(() => combinator_1.sequence([
                row(cell(data), false),
                row(cell(align), true),
                combinator_1.some(row(cell(data), false))
            ])), ([head, as, ...rows]) => {
                void align();
                return [typed_dom_1.html('table', [
                        typed_dom_1.html('thead', [head]),
                        typed_dom_1.html('tbody', rows)
                    ])];
                function align() {
                    const aligns = [...as.children].reduce((acc, el) => concat_1.concat(acc, [el.textContent || acc.length > 0 && acc[acc.length - 1] || '']), []);
                    void align(head, extend(aligns.slice(0, 2), head.children.length));
                    void rows.forEach(row => void align(row, extend(aligns, row.children.length)));
                    return;
                    function extend(aligns, size) {
                        return size > aligns.length ? concat_1.concat(aligns, Array(size - aligns.length).fill(aligns.length > 0 ? aligns[aligns.length - 1] : '')) : aligns;
                    }
                    function align(row, aligns) {
                        return void [...row.children].forEach((col, i) => aligns[i] && aligns[i] === sanitize(aligns[i]) && void col.setAttribute('style', `text-align: ${ sanitize(aligns[i]) };`));
                    }
                    function sanitize(align) {
                        return [
                            'left',
                            'center',
                            'right'
                        ].includes(align) ? align : '';
                    }
                }
            }));
            const row = (parser, strict) => combinator_1.fmap(line_1.line(combinator_1.contract('|', combinator_1.trimEnd(combinator_1.surround('', combinator_1.some(combinator_1.union([parser])), /^\|?$/, strict)), ns => !util_1.hasMedia(typed_dom_1.html('b', ns))), true, true), es => [typed_dom_1.html('tr', es)]);
            const cell = parser => combinator_1.fmap(combinator_1.union([parser]), ns => [typed_dom_1.html('td', ns)]);
            const data = combinator_1.build(() => combinator_1.bind(combinator_1.surround(/^\|\s*/, util_1.compress(combinator_1.union([combinator_1.some(inline_1.inline, /^\s*(?:\||$)/)])), /^\s*/, false), (ns, rest) => ns.length === 0 && rest === '' ? undefined : [
                concat_1.concat([typed_dom_1.text('')], ns),
                rest
            ]));
            const align = combinator_1.surround('|', combinator_1.union([
                combinator_1.match(/^:-+:/, (_, rest) => [
                    [typed_dom_1.text('center')],
                    rest
                ]),
                combinator_1.match(/^:-+/, (_, rest) => [
                    [typed_dom_1.text('left')],
                    rest
                ]),
                combinator_1.match(/^-+:/, (_, rest) => [
                    [typed_dom_1.text('right')],
                    rest
                ]),
                combinator_1.match(/^-+/, (_, rest) => [
                    [typed_dom_1.text('')],
                    rest
                ])
            ]), '');
        },
        {
            '../../combinator': 19,
            '../inline': 62,
            '../source/block': 83,
            '../source/line': 86,
            '../util': 90,
            'spica/concat': 7,
            'typed-dom': 12
        }
    ],
    61: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../combinator');
            const block_1 = require('../source/block');
            const line_1 = require('../source/line');
            const olist_1 = require('./olist');
            const ilist_1 = require('./ilist');
            const inline_1 = require('../inline');
            const util_1 = require('../util');
            const concat_1 = require('spica/concat');
            const typed_dom_1 = require('typed-dom');
            exports.ulist = block_1.block(combinator_1.fmap(combinator_1.build(() => combinator_1.some(combinator_1.union([combinator_1.fmap(combinator_1.inits([
                    line_1.line(combinator_1.verify(combinator_1.surround(/^-(?:\s|$)/, util_1.compress(combinator_1.trim(combinator_1.some(inline_1.inline))), '', false), rs => !util_1.hasMedia(typed_dom_1.html('b', rs))), true, true),
                    combinator_1.indent(combinator_1.union([
                        exports.ulist,
                        olist_1.olist_,
                        ilist_1.ilist
                    ]))
                ]), ns => [typed_dom_1.html('li', fillFirstLine(ns))])]))), es => [typed_dom_1.html('ul', es)]));
            function fillFirstLine(ns) {
                return [
                    HTMLUListElement,
                    HTMLOListElement
                ].some(E => ns[0] instanceof E) ? concat_1.concat([typed_dom_1.html('br')], ns) : ns;
            }
            exports.fillFirstLine = fillFirstLine;
        },
        {
            '../../combinator': 19,
            '../inline': 62,
            '../source/block': 83,
            '../source/line': 86,
            '../util': 90,
            './ilist': 51,
            './olist': 55,
            'spica/concat': 7,
            'typed-dom': 12
        }
    ],
    62: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../combinator');
            const comment_1 = require('./inline/comment');
            const annotation_1 = require('./inline/annotation');
            const link_1 = require('./inline/link');
            const extension_1 = require('./inline/extension');
            const html_1 = require('./inline/html');
            const emphasis_1 = require('./inline/emphasis');
            const strong_1 = require('./inline/strong');
            const code_1 = require('./inline/code');
            const math_1 = require('./inline/math');
            const media_1 = require('./inline/media');
            const bracket_1 = require('./inline/bracket');
            const htmlentity_1 = require('./inline/htmlentity');
            const autolink_1 = require('./inline/autolink');
            const text_1 = require('./source/text');
            exports.inline = combinator_1.union([
                comment_1.comment,
                annotation_1.annotation,
                link_1.link,
                extension_1.extension,
                html_1.html,
                emphasis_1.emphasis,
                strong_1.strong,
                code_1.code,
                math_1.math,
                media_1.media,
                bracket_1.bracket,
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
            '../combinator': 19,
            './inline/annotation': 63,
            './inline/autolink': 64,
            './inline/autolink/url': 66,
            './inline/bracket': 67,
            './inline/code': 68,
            './inline/comment': 69,
            './inline/emphasis': 70,
            './inline/extension': 71,
            './inline/extension/index': 72,
            './inline/extension/label': 73,
            './inline/html': 75,
            './inline/htmlentity': 76,
            './inline/link': 77,
            './inline/math': 78,
            './inline/media': 79,
            './inline/strong': 80,
            './source/text': 87
        }
    ],
    63: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const inline_1 = require('../inline');
            const combinator_1 = require('../../combinator');
            const util_1 = require('../util');
            const typed_dom_1 = require('typed-dom');
            exports.annotation = combinator_1.verify(combinator_1.fmap(combinator_1.build(() => combinator_1.surround('((', combinator_1.some(combinator_1.union([inline_1.inline]), '))'), '))')), ns => {
                const el = typed_dom_1.html('sup', { class: 'annotation' }, ns);
                return [el];
            }), ([el]) => util_1.hasText(el) && !util_1.hasMedia(el) && !util_1.hasAnnotation(el));
        },
        {
            '../../combinator': 19,
            '../inline': 62,
            '../util': 90,
            'typed-dom': 12
        }
    ],
    64: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../combinator');
            const url_1 = require('./autolink/url');
            const account_1 = require('./autolink/account');
            exports.autolink = combinator_1.union([
                url_1.url,
                account_1.account
            ]);
        },
        {
            '../../combinator': 19,
            './autolink/account': 65,
            './autolink/url': 66
        }
    ],
    65: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../../combinator');
            const line_1 = require('../../source/line');
            require('../../source/unescapable');
            const typed_dom_1 = require('typed-dom');
            exports.account = line_1.line(combinator_1.union([
                combinator_1.match(/^[0-9a-zA-Z@]@.*?(?!@)/, ([frag], rest) => [
                    [typed_dom_1.text(frag)],
                    rest
                ]),
                combinator_1.match(/^@[a-zA-Z0-9]+(?:-[0-9a-zA-Z]+)*(?!@)/, ([whole], rest) => [
                    [typed_dom_1.html('a', {
                            class: 'account',
                            rel: 'noopener'
                        }, whole)],
                    rest
                ])
            ]), false);
        },
        {
            '../../../combinator': 19,
            '../../source/line': 86,
            '../../source/unescapable': 88,
            'typed-dom': 12
        }
    ],
    66: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../../combinator');
            const line_1 = require('../../source/line');
            const escapable_1 = require('../../source/escapable');
            const link_1 = require('../link');
            const typed_dom_1 = require('typed-dom');
            const closer = /^['"`|\[\](){}<>]|^[-+*~^,.;:!?]*(?=[\s|\[\](){}<>]|$)|^\\?(?:\n|$)/;
            exports.url = line_1.line(combinator_1.union([
                combinator_1.match(/^(?:[0-9a-zA-Z][!?]*h|\?h|[0-9a-gi-zA-Z!?])ttps?(?=:\/\/\S)/, ([frag], rest) => [
                    [typed_dom_1.text(frag)],
                    rest
                ]),
                combinator_1.surround(/^(?=h?ttps?:\/\/\S)/, combinator_1.verify(combinator_1.rewrite(combinator_1.some(combinator_1.union([
                    link_1.ipv6,
                    link_1.parenthesis,
                    combinator_1.some(escapable_1.escsource, closer)
                ])), source => link_1.link(`[](${ address(source) }${ attribute(source) })`)), ([node]) => node instanceof HTMLAnchorElement), ''),
                combinator_1.surround(/^!(?=https?:\/\/\S)/, combinator_1.verify(combinator_1.rewrite(combinator_1.build(() => combinator_1.verify(exports.url, ([node]) => node instanceof HTMLAnchorElement)), source => link_1.link(`[![](${ source })](${ source })`)), ([node]) => node instanceof HTMLAnchorElement), '')
            ]), false);
            function address(source) {
                return source.startsWith('ttp') ? `h${ source }` : source;
            }
            function attribute(source) {
                return source.startsWith('ttp') ? ' nofollow' : '';
            }
        },
        {
            '../../../combinator': 19,
            '../../source/escapable': 85,
            '../../source/line': 86,
            '../link': 77,
            'typed-dom': 12
        }
    ],
    67: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const inline_1 = require('../inline');
            const combinator_1 = require('../../combinator');
            const util_1 = require('../util');
            const typed_dom_1 = require('typed-dom');
            exports.bracket = combinator_1.build(() => util_1.compress(combinator_1.union([
                combinator_1.fmap(combinator_1.surround('(', combinator_1.some(inline_1.inline, ')'), ')', false), ns => [
                    typed_dom_1.text('('),
                    ...ns,
                    typed_dom_1.text(')')
                ]),
                combinator_1.fmap(combinator_1.surround('[', combinator_1.some(inline_1.inline, ']'), ']', false), ns => [
                    typed_dom_1.text('['),
                    ...ns,
                    typed_dom_1.text(']')
                ]),
                combinator_1.fmap(combinator_1.surround('{', combinator_1.some(inline_1.inline, '}'), '}', false), ns => [
                    typed_dom_1.text('{'),
                    ...ns,
                    typed_dom_1.text('}')
                ]),
                combinator_1.fmap(combinator_1.surround('<', combinator_1.some(inline_1.inline, '>'), '>', false), ns => [
                    typed_dom_1.text('<'),
                    ...ns,
                    typed_dom_1.text('>')
                ]),
                combinator_1.fmap(combinator_1.surround('"', combinator_1.some(inline_1.inline, '"'), '"', false), ns => [
                    typed_dom_1.text('"'),
                    ...ns,
                    typed_dom_1.text('"')
                ])
            ])));
        },
        {
            '../../combinator': 19,
            '../inline': 62,
            '../util': 90,
            'typed-dom': 12
        }
    ],
    68: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../combinator');
            const line_1 = require('../source/line');
            const unescapable_1 = require('../source/unescapable');
            const char_1 = require('../source/char');
            const util_1 = require('../util');
            const typed_dom_1 = require('typed-dom');
            const cache = new Map();
            exports.code = line_1.line(combinator_1.match(/^(`+)[^\n]+?\1(?!`)/, ([whole, bracket], source) => {
                source = whole + source;
                const closer = cache.has(bracket) ? cache.get(bracket) : cache.set(bracket, new RegExp(`^${ bracket }(?!\`)`)).get(bracket);
                return combinator_1.verify(combinator_1.bind(combinator_1.surround(bracket, combinator_1.some(combinator_1.union([
                    combinator_1.some(char_1.char('`')),
                    unescapable_1.unescsource
                ]), closer), closer), (ns, rest) => {
                    const el = typed_dom_1.html('code', { 'data-src': source.slice(0, source.length - rest.length) }, util_1.stringify(ns).trim());
                    return [
                        [el],
                        rest
                    ];
                }), ([el]) => util_1.hasText(el))(source);
            }), false);
        },
        {
            '../../combinator': 19,
            '../source/char': 84,
            '../source/line': 86,
            '../source/unescapable': 88,
            '../util': 90,
            'typed-dom': 12
        }
    ],
    69: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../combinator');
            require('../source/unescapable');
            exports.comment = combinator_1.union([
                combinator_1.match(/^<(#+)\s+(?:\S+\s+)*?\1>/, (_, r) => [
                    [],
                    r
                ]),
                combinator_1.match(/^<!(-{2,})\s+(?:\S+\s+)*?\1>/, (_, r) => [
                    [],
                    r
                ])
            ]);
        },
        {
            '../../combinator': 19,
            '../source/unescapable': 88
        }
    ],
    70: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const inline_1 = require('../inline');
            const combinator_1 = require('../../combinator');
            const strong_1 = require('./strong');
            const util_1 = require('../util');
            const typed_dom_1 = require('typed-dom');
            exports.emphasis = combinator_1.verify(combinator_1.fmap(combinator_1.build(() => combinator_1.surround('*', util_1.compress(combinator_1.some(combinator_1.union([
                strong_1.strong,
                combinator_1.some(inline_1.inline, '*')
            ]))), '*')), ns => [typed_dom_1.html('em', ns)]), ([el]) => util_1.hasText(el));
        },
        {
            '../../combinator': 19,
            '../inline': 62,
            '../util': 90,
            './strong': 80,
            'typed-dom': 12
        }
    ],
    71: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../combinator');
            const index_1 = require('./extension/index');
            const label_1 = require('./extension/label');
            const placeholder_1 = require('./extension/placeholder');
            exports.extension = combinator_1.union([
                index_1.index,
                label_1.label,
                placeholder_1.placeholder
            ]);
        },
        {
            '../../combinator': 19,
            './extension/index': 72,
            './extension/label': 73,
            './extension/placeholder': 74
        }
    ],
    72: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const inline_1 = require('../../inline');
            const combinator_1 = require('../../../combinator');
            const line_1 = require('../../source/line');
            const link_1 = require('../link');
            const indexer_1 = require('../../block/indexer');
            const util_1 = require('../../util');
            exports.index = line_1.line(combinator_1.verify(combinator_1.fmap(combinator_1.build(() => combinator_1.surround('[#', combinator_1.rewrite(combinator_1.some(inline_1.inline, ']'), s => combinator_1.union([link_1.link])(`[${ s }]()`)), ']')), ([el]) => {
                void indexer_1.defineIndex(el);
                void el.setAttribute('href', `#${ el.id.toLowerCase() }`);
                void el.removeAttribute('id');
                return [el];
            }), ([el]) => util_1.hasTightText(el)), false);
        },
        {
            '../../../combinator': 19,
            '../../block/indexer': 52,
            '../../inline': 62,
            '../../source/line': 86,
            '../../util': 90,
            '../link': 77
        }
    ],
    73: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../../combinator');
            const line_1 = require('../../source/line');
            require('../../source/unescapable');
            const link_1 = require('../link');
            exports.label = line_1.line(combinator_1.fmap(combinator_1.build(() => combinator_1.surround('[:', combinator_1.match(/^(?:\$|[a-z]+)(?:(?:-[a-z][0-9a-z]*)+(?:-0(?:\.0)*)?|-[0-9]+(?:\.[0-9]+)*)/, ([query], rest) => combinator_1.union([link_1.link])(`[\\${ query }](#${ makeLabel(query) })${ rest }`)), ']')), ([el]) => {
                void el.setAttribute('class', el.getAttribute('href').slice(1));
                return [el];
            }), false);
            function makeLabel(text) {
                return `label:${ text }`;
            }
        },
        {
            '../../../combinator': 19,
            '../../source/line': 86,
            '../../source/unescapable': 88,
            '../link': 77
        }
    ],
    74: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const inline_1 = require('../../inline');
            const combinator_1 = require('../../../combinator');
            const line_1 = require('../../source/line');
            const typed_dom_1 = require('typed-dom');
            exports.placeholder = line_1.line(combinator_1.fmap(combinator_1.build(() => combinator_1.surround('[', combinator_1.match(/^[~^\[]/, ([flag], rest) => combinator_1.some(combinator_1.union([inline_1.inline]), ']')(flag === '[' ? flag + rest : rest)), ']')), ns => [typed_dom_1.html('span', combinator_1.some(inline_1.inline)(`*Invalid syntax: Extension syntax: \`[${ ns[0].textContent[0] } ]\`.*`)[0])]), false);
        },
        {
            '../../../combinator': 19,
            '../../inline': 62,
            '../../source/line': 86,
            'typed-dom': 12
        }
    ],
    75: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const inline_1 = require('../inline');
            const combinator_1 = require('../../combinator');
            const util_1 = require('../util');
            const typed_dom_1 = require('typed-dom');
            const tags = Object.freeze('ins|del|sup|sub|small|cite|mark|ruby|rt|rp|bdi|bdo|wbr'.split('|'));
            exports.html = combinator_1.match(/^<([a-z]+)>/, ([whole, tag], rest) => {
                if (!tags.includes(tag))
                    return;
                const opentag = `<${ tag }>`;
                if (tag === 'wbr')
                    return [
                        [typed_dom_1.html(tag)],
                        rest
                    ];
                return combinator_1.verify(combinator_1.fmap(combinator_1.surround(`<${ tag }>`, util_1.compress(combinator_1.some(combinator_1.union([inline_1.inline]), `</${ tag }>`)), `</${ tag }>`), ns => [typed_dom_1.html(tag, ns)]), ([el]) => util_1.hasText(el))(whole + rest);
            });
        },
        {
            '../../combinator': 19,
            '../inline': 62,
            '../util': 90,
            'typed-dom': 12
        }
    ],
    76: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../combinator');
            require('../source/unescapable');
            const typed_dom_1 = require('typed-dom');
            exports.htmlentity = combinator_1.match(/^&(?:[0-9a-z]+|#[0-9]{1,8}|#x[0-9a-f]{1,8});/i, ([entity], rest) => [
                [typed_dom_1.text(parse(entity))],
                rest
            ]);
            const parser = typed_dom_1.html('span');
            function parse(str) {
                parser.innerHTML = str;
                return parser.textContent;
            }
        },
        {
            '../../combinator': 19,
            '../source/unescapable': 88,
            'typed-dom': 12
        }
    ],
    77: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const inline_1 = require('../inline');
            const combinator_1 = require('../../combinator');
            const line_1 = require('../source/line');
            const text_1 = require('../source/text');
            const escapable_1 = require('../source/escapable');
            const util_1 = require('../util');
            const url_1 = require('../string/url');
            const typed_dom_1 = require('typed-dom');
            exports.link = line_1.line(combinator_1.bind(combinator_1.build(() => line_1.line(combinator_1.surround('[', util_1.compress(combinator_1.some(combinator_1.union([inline_1.inline]), ']')), ']', false), false)), (ns, rest) => {
                const children = typed_dom_1.frag(ns);
                if (util_1.hasAnnotation(children))
                    return;
                if (util_1.hasMedia(children)) {
                    void children.querySelectorAll('a > .media').forEach(el => void el.parentNode.parentNode.replaceChild(el, el.parentNode));
                    if (children.childNodes.length !== 1)
                        return;
                    if (!children.firstElementChild.matches('.media'))
                        return;
                } else {
                    if (children.childNodes.length > 0 && !util_1.hasText(children))
                        return;
                    if (util_1.hasLink(children))
                        return;
                }
                return combinator_1.bind(line_1.line(combinator_1.surround('(', combinator_1.subsequence([
                    combinator_1.some(combinator_1.union([
                        exports.parenthesis,
                        text_1.text
                    ]), /^\)|^\s/),
                    attribute
                ]), ')', false), false), (ns, rest) => {
                    const [, INSECURE_URL = '', attr = ''] = util_1.stringify(ns).match(/^(.*?)(?:\n(.*))?$/) || [];
                    const url = url_1.sanitize(INSECURE_URL);
                    if (url === '' && INSECURE_URL !== '')
                        return;
                    const el = typed_dom_1.html('a', {
                        href: url,
                        rel: attr === 'nofollow' ? 'noopener nofollow noreferrer' : 'noopener'
                    }, util_1.hasContent(children) ? children.childNodes : url_1.sanitize(INSECURE_URL.replace(/^tel:/, '') || window.location.href).replace(/^h(?=ttps?:\/\/)/, attr === 'nofollow' ? '' : 'h'));
                    if (el.protocol === 'tel:' && el.getAttribute('href') !== `tel:${ el.innerHTML.replace(/-(?=\d)/g, '') }`)
                        return;
                    if ((window.location.origin !== el.origin || util_1.hasMedia(el)) && el.protocol !== 'tel:') {
                        void el.setAttribute('target', '_blank');
                    }
                    return [
                        [el],
                        rest
                    ];
                })(rest);
            }), false);
            exports.ipv6 = combinator_1.fmap(combinator_1.surround('[', combinator_1.match(/^[:0-9a-z]+/, ([addr], rest) => [
                [typed_dom_1.text(addr)],
                rest
            ]), ']'), ts => [
                typed_dom_1.text('['),
                ...ts,
                typed_dom_1.text(']')
            ]);
            exports.parenthesis = combinator_1.bind(combinator_1.build(() => combinator_1.surround('(', combinator_1.some(combinator_1.union([
                exports.parenthesis,
                escapable_1.escsource
            ]), /^\)|^\s/), ')', false)), (ts, rest) => [
                [
                    typed_dom_1.text('('),
                    ...ts,
                    typed_dom_1.text(')')
                ],
                rest
            ]);
            const attribute = combinator_1.surround(/^\s(?=\S)/, combinator_1.match(/^nofollow/, ([attr], rest) => [
                [typed_dom_1.text(`\n${ attr }`)],
                rest
            ]), /^(?=\))/);
        },
        {
            '../../combinator': 19,
            '../inline': 62,
            '../source/escapable': 85,
            '../source/line': 86,
            '../source/text': 87,
            '../string/url': 89,
            '../util': 90,
            'typed-dom': 12
        }
    ],
    78: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../combinator');
            const line_1 = require('../source/line');
            const escapable_1 = require('../source/escapable');
            const util_1 = require('../util');
            const cache_1 = require('spica/cache');
            const typed_dom_1 = require('typed-dom');
            exports.cache = new cache_1.Cache(100);
            exports.math = line_1.line(combinator_1.verify(combinator_1.fmap(combinator_1.surround('$', combinator_1.some(combinator_1.union([escapable_1.escsource]), '$'), /^\$(?![$\d])/), ns => {
                const el = typed_dom_1.html('span', { class: 'math' }, `$${ util_1.stringify(ns) }$`);
                if (exports.cache.has(el.textContent))
                    return [exports.cache.get(el.textContent).cloneNode(true)];
                void el.setAttribute('data-src', el.textContent);
                return [el];
            }), ([el]) => util_1.hasTightText(typed_dom_1.html('span', el.textContent.slice(1, -1)))), false);
        },
        {
            '../../combinator': 19,
            '../source/escapable': 85,
            '../source/line': 86,
            '../util': 90,
            'spica/cache': 6,
            'typed-dom': 12
        }
    ],
    79: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../combinator');
            const line_1 = require('../source/line');
            const text_1 = require('../source/text');
            const link_1 = require('./link');
            const url_1 = require('../string/url');
            const util_1 = require('../util');
            const cache_1 = require('spica/cache');
            const typed_dom_1 = require('typed-dom');
            exports.cache = new cache_1.Cache(100);
            exports.media = line_1.line(combinator_1.bind(line_1.line(combinator_1.surround('![', combinator_1.some(combinator_1.union([text_1.text]), ']'), ']', false), false), (ts, rest) => {
                const caption = util_1.stringify(ts).trim();
                return combinator_1.bind(line_1.line(combinator_1.surround('(', combinator_1.some(combinator_1.union([
                    link_1.parenthesis,
                    text_1.text
                ]), /^\)|^\s/), ')'), false), (ts, rest) => {
                    const url = url_1.sanitize(util_1.stringify(ts));
                    if (url === '')
                        return;
                    if (exports.cache.has(url))
                        return [
                            [exports.cache.get(url).cloneNode(true)],
                            rest
                        ];
                    if (url.trim().toLowerCase().startsWith('tel:'))
                        return;
                    return [
                        [typed_dom_1.html('img', {
                                class: 'media',
                                'data-src': url,
                                alt: caption
                            })],
                        rest
                    ];
                })(rest);
            }), false);
        },
        {
            '../../combinator': 19,
            '../source/line': 86,
            '../source/text': 87,
            '../string/url': 89,
            '../util': 90,
            './link': 77,
            'spica/cache': 6,
            'typed-dom': 12
        }
    ],
    80: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const inline_1 = require('../inline');
            const combinator_1 = require('../../combinator');
            const util_1 = require('../util');
            const typed_dom_1 = require('typed-dom');
            exports.strong = combinator_1.verify(combinator_1.fmap(combinator_1.build(() => combinator_1.surround('**', util_1.compress(combinator_1.some(combinator_1.union([inline_1.inline]), '**')), '**')), ns => [typed_dom_1.html('strong', ns)]), ([el]) => util_1.hasText(el));
        },
        {
            '../../combinator': 19,
            '../inline': 62,
            '../util': 90,
            'typed-dom': 12
        }
    ],
    81: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../combinator');
            const ja_1 = require('./locale/ja');
            function localize(block) {
                return combinator_1.fmap(block, es => {
                    void es.forEach(el => void el.querySelectorAll('.linebreak').forEach(el => {
                        if (el.childNodes.length === 1)
                            return;
                        if (!check(el))
                            return;
                        void el.removeChild(el.firstChild);
                    }));
                    return es;
                });
            }
            exports.localize = localize;
            function check(el) {
                const char = endingChar(el.previousSibling);
                return !!char && ja_1.japanese(char);
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
                if (!(node instanceof Element))
                    return node.textContent;
                switch (node.tagName.toLowerCase()) {
                case 'ruby':
                    return [...node.childNodes].reduceRight((str, node) => {
                        if (str)
                            return str;
                        if (node instanceof Text)
                            return node.textContent;
                        switch (node.tagName.toLowerCase()) {
                        case 'rt':
                        case 'rp':
                            return '';
                        default:
                            return node.textContent;
                        }
                    }, '');
                default:
                    return node.textContent;
                }
            }
        },
        {
            '../combinator': 19,
            './locale/ja': 82
        }
    ],
    82: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const endings = /[、。！？]/;
            function japanese(char) {
                return char.search(endings) === 0;
            }
            exports.japanese = japanese;
        },
        {}
    ],
    83: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const line_1 = require('./line');
            function block(parser, separation = true) {
                return source => {
                    if (source.length === 0)
                        return;
                    const result = parser(source);
                    if (!result)
                        return;
                    const rest = result[1];
                    if (separation && line_1.firstline(rest).trim() !== '')
                        return;
                    return rest === '' || source[source.length - rest.length - 1] === '\n' ? result : undefined;
                };
            }
            exports.block = block;
        },
        { './line': 86 }
    ],
    84: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            function char(char) {
                return source => {
                    if (source.length === 0)
                        return;
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
    85: [
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
    86: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const block_1 = require('./block');
            function line(parser, entire = true, force = false) {
                return source => {
                    if (source.length === 0)
                        return;
                    if (force) {
                        const src = firstline(source);
                        const rst = source.slice(src.length + 1);
                        const result = line(parser, entire, false)(src + (source.length > src.length ? source[src.length] : ''));
                        return result ? [
                            result[0],
                            result[1] + rst
                        ] : undefined;
                    }
                    const result = entire ? block_1.block(parser, false)(source) : parser(source);
                    if (!result)
                        return result;
                    const src = source.slice(0, source.length - result[1].length);
                    return src === '\n' || src.lastIndexOf('\n', src.length - 2) === -1 ? result : undefined;
                };
            }
            exports.line = line;
            function firstline(source) {
                const i = source.indexOf('\n');
                return i === -1 ? source : source.slice(0, i);
            }
            exports.firstline = firstline;
            exports.emptyline = line(s => s.trim() === '' ? [
                [],
                ''
            ] : undefined, true, true);
            const invisible = /^(?:\\?[^\S\\]+)*\\?$/;
            exports.blankline = line(s => s.search(invisible) === 0 ? [
                [],
                ''
            ] : undefined, true, true);
            exports.contentline = line(s => s.search(invisible) !== 0 ? [
                [],
                ''
            ] : undefined, true, true);
        },
        { './block': 83 }
    ],
    87: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const typed_dom_1 = require('typed-dom');
            const separator = /[^0-9a-zA-Z\u0080-\uFFFF]|[\u0300-\u036F]|(?:[0-9a-zA-Z][!?]*h|\?h|[0-9a-gi-zA-Z!?])ttps?:|[0-9a-zA-Z@]?@[0-9a-zA-Z]/;
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
                                source.slice(2)
                            ];
                        default:
                            return [
                                [document.createTextNode(source.slice(1, 2))],
                                source.slice(2)
                            ];
                        }
                    case '\n':
                        return [
                            [typed_dom_1.html('span', { class: 'linebreak' }, [
                                    document.createTextNode(' '),
                                    typed_dom_1.html('wbr')
                                ])],
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
        { 'typed-dom': 12 }
    ],
    88: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const separator = /`|<\/code>|[>\]\)\s]/i;
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
    89: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const typed_dom_1 = require('typed-dom');
            function sanitize(url) {
                url = url.replace(/\s/g, encodeURI);
                return isAcceptedProtocol(url) ? url : '';
            }
            exports.sanitize = sanitize;
            const parser = typed_dom_1.html('a');
            function isAcceptedProtocol(url) {
                parser.setAttribute('href', url);
                return [
                    'http:',
                    'https:',
                    'tel:'
                ].includes(parser.protocol);
            }
        },
        { 'typed-dom': 12 }
    ],
    90: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../combinator');
            function compress(parser) {
                return combinator_1.fmap(parser, squash);
            }
            exports.compress = compress;
            function squash(nodes) {
                const acc = [];
                void nodes.reduce((prev, curr) => {
                    if (prev) {
                        if (curr.nodeType === 3 && curr.textContent === '')
                            return prev;
                        if (prev.nodeType === 3 && curr.nodeType === 3) {
                            prev.textContent += curr.textContent;
                            curr.textContent = '';
                            return prev;
                        }
                    }
                    void acc.push(curr);
                    return curr;
                }, undefined);
                return acc;
            }
            exports.squash = squash;
            function hasContent(node) {
                return hasText(node) || hasMedia(node);
            }
            exports.hasContent = hasContent;
            function hasMedia(node) {
                return !!node.querySelector('.media');
            }
            exports.hasMedia = hasMedia;
            function hasLink(node) {
                return !!node.querySelector('a');
            }
            exports.hasLink = hasLink;
            function hasAnnotation(node) {
                return !!node.querySelector('.annotation');
            }
            exports.hasAnnotation = hasAnnotation;
            function hasText(node) {
                return node.textContent.trim() !== '';
            }
            exports.hasText = hasText;
            function hasTightText(el) {
                return hasText(el) && el.textContent === el.textContent.trim();
            }
            exports.hasTightText = hasTightText;
            function stringify(ns) {
                return ns.reduce((s, n) => s + n.textContent, '');
            }
            exports.stringify = stringify;
        },
        { '../combinator': 19 }
    ],
    91: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var render_1 = require('./renderer/render');
            exports.render = render_1.render;
        },
        { './renderer/render': 92 }
    ],
    92: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const media_1 = require('./render/media');
            const code_1 = require('./render/code');
            const math_1 = require('./render/math');
            function render(target, opts = {}) {
                opts = Object.assign({
                    code: code_1.code,
                    math: math_1.math,
                    media: {}
                }, opts);
                void [
                    target,
                    ...target.querySelectorAll('img, pre, .math')
                ].forEach(target => void new Promise(() => {
                    switch (true) {
                    case target.matches('img:not([src])[data-src]'): {
                            const el = opts.media && media_1.media(target, opts.media);
                            if (!el)
                                return;
                            const scope = el instanceof HTMLImageElement === false && target.closest('a, h1, h2, h3, h4, h5, h6, p, li, dl, td') instanceof HTMLAnchorElement ? target.closest('a') : target;
                            return void scope.parentElement.replaceChild(el, scope);
                        }
                    case target.matches('pre'):
                        return target.children.length === 0 && opts.code ? void opts.code(target) : void 0;
                    case target.matches('.math'):
                        return target.children.length === 0 && opts.math ? void opts.math(target) : void 0;
                    default:
                        return;
                    }
                }));
                return target;
            }
            exports.render = render;
        },
        {
            './render/code': 93,
            './render/math': 94,
            './render/media': 95
        }
    ],
    93: [
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
    94: [
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
        { '../../parser/inline/math': 78 }
    ],
    95: [
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
            function media(target, opts) {
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
                const url = new URL(target.getAttribute('data-src'), window.location.href);
                const alt = target.getAttribute('alt') || '';
                const el = undefined || opts.twitter && opts.twitter(url) || opts.youtube && opts.youtube(url) || opts.gist && opts.gist(url) || opts.slideshare && opts.slideshare(url) || opts.pdf && opts.pdf(url) || opts.video && opts.video(url, alt) || opts.audio && opts.audio(url, alt) || opts.image && opts.image(url, alt);
                if (!el)
                    return;
                void el.classList.add('media');
                return el;
            }
            exports.media = media;
        },
        {
            './media/audio': 96,
            './media/gist': 97,
            './media/image': 98,
            './media/pdf': 99,
            './media/slideshare': 100,
            './media/twitter': 101,
            './media/video': 102,
            './media/youtube': 103
        }
    ],
    96: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const media_1 = require('../../../parser/inline/media');
            const typed_dom_1 = require('typed-dom');
            function audio(url, alt) {
                if (![
                        '.oga',
                        '.ogg'
                    ].includes(url.pathname.split(/(?=\.)/).pop()))
                    return;
                return media_1.cache.has(url.href) ? media_1.cache.get(url.href).cloneNode(true) : media_1.cache.set(url.href, typed_dom_1.html('audio', {
                    src: url.href,
                    alt,
                    controls: '',
                    style: 'width: 100%;'
                }).cloneNode(true));
            }
            exports.audio = audio;
        },
        {
            '../../../parser/inline/media': 79,
            'typed-dom': 12
        }
    ],
    97: [
        function (require, module, exports) {
            (function (global) {
                'use strict';
                Object.defineProperty(exports, '__esModule', { value: true });
                const parser_1 = require('../../../parser');
                const media_1 = require('../../../parser/inline/media');
                const dompurify_1 = typeof window !== 'undefined' ? window['DOMPurify'] : typeof global !== 'undefined' ? global['DOMPurify'] : null;
                const typed_dom_1 = require('typed-dom');
                function gist(url) {
                    if (!['https://gist.github.com'].includes(url.origin))
                        return;
                    if (media_1.cache.has(url.href))
                        return media_1.cache.get(url.href).cloneNode(true);
                    return typed_dom_1.default.div({ style: 'position: relative;' }, [typed_dom_1.default.em(`loading ${ url.href }`)], () => {
                        const outer = typed_dom_1.html('div');
                        void $.ajax(`${ url.href }.json`, {
                            dataType: 'jsonp',
                            timeout: 10 * 1000,
                            cache: true,
                            success({div, stylesheet, description}) {
                                if (!stylesheet.startsWith('https://assets-cdn.github.com/'))
                                    return;
                                outer.innerHTML = dompurify_1.sanitize(`<div style="position: relative; margin-bottom: -1em;">${ div }</div>`);
                                const gist = outer.querySelector('.gist');
                                void gist.insertBefore(typed_dom_1.default.div({ class: 'gist-description' }, [typed_dom_1.default.a({ style: 'color: #555; font-size: 14px; font-weight: 600;' }, description, () => parser_1.parse(parser_1.escape(url.href)).querySelector('a'))]).element, gist.firstChild);
                                void media_1.cache.set(url.href, outer.cloneNode(true));
                                if (document.head.querySelector(`link[rel="stylesheet"][href="${ stylesheet }"]`))
                                    return;
                                void document.head.appendChild(typed_dom_1.html('link', {
                                    rel: 'stylesheet',
                                    href: stylesheet,
                                    crossorigin: 'anonymous'
                                }));
                            },
                            error({status, statusText}) {
                                outer.innerHTML = parser_1.parse(`*${ parser_1.escape(url.href) }\\\n-> ${ status }: ${ parser_1.escape(statusText) }*`).querySelector('p').innerHTML;
                            }
                        });
                        return outer;
                    }).element;
                }
                exports.gist = gist;
            }.call(this, typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {}));
        },
        {
            '../../../parser': 35,
            '../../../parser/inline/media': 79,
            'typed-dom': 12
        }
    ],
    98: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const media_1 = require('../../../parser/inline/media');
            const typed_dom_1 = require('typed-dom');
            function image(url, alt) {
                return media_1.cache.has(url.href) ? media_1.cache.get(url.href).cloneNode(true) : media_1.cache.set(url.href, typed_dom_1.html('img', {
                    src: url.href,
                    alt,
                    style: 'max-width: 100%;'
                }).cloneNode(true));
            }
            exports.image = image;
        },
        {
            '../../../parser/inline/media': 79,
            'typed-dom': 12
        }
    ],
    99: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const parser_1 = require('../../../parser');
            const typed_dom_1 = require('typed-dom');
            function pdf(url) {
                if (!['.pdf'].includes(url.pathname.split(/(?=\.)/).pop()))
                    return;
                return typed_dom_1.default.div({ style: 'position: relative;' }, [
                    typed_dom_1.default.div({ style: 'position: relative; resize: vertical; overflow: hidden; padding-bottom: 10px;' }, [typed_dom_1.default.object({
                            type: 'application/pdf',
                            data: url.href,
                            style: 'width: 100%; height: 100%; min-height: 400px;'
                        }, () => {
                            const el = typed_dom_1.html('object');
                            el.typeMustMatch = true;
                            return el;
                        })]),
                    typed_dom_1.default.div([typed_dom_1.default.strong({ style: 'word-wrap: break-word;' }, () => parser_1.parse(`**${ parser_1.escape(url.href) }**`).querySelector('strong'))])
                ]).element;
            }
            exports.pdf = pdf;
        },
        {
            '../../../parser': 35,
            'typed-dom': 12
        }
    ],
    100: [
        function (require, module, exports) {
            (function (global) {
                'use strict';
                Object.defineProperty(exports, '__esModule', { value: true });
                const parser_1 = require('../../../parser');
                const media_1 = require('../../../parser/inline/media');
                const dompurify_1 = typeof window !== 'undefined' ? window['DOMPurify'] : typeof global !== 'undefined' ? global['DOMPurify'] : null;
                const typed_dom_1 = require('typed-dom');
                function slideshare(url) {
                    if (!['https://www.slideshare.net'].includes(url.origin))
                        return;
                    if (media_1.cache.has(url.href))
                        return media_1.cache.get(url.href).cloneNode(true);
                    return typed_dom_1.default.div({ style: 'position: relative;' }, [typed_dom_1.default.em(`loading ${ url.href }`)], () => {
                        const outer = typed_dom_1.html('div');
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
                                outer.innerHTML = parser_1.parse(`*${ parser_1.escape(url.href) }\\\n-> ${ status }: ${ parser_1.escape(statusText) }*`).querySelector('p').innerHTML;
                            }
                        });
                        return outer;
                    }).element;
                }
                exports.slideshare = slideshare;
            }.call(this, typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {}));
        },
        {
            '../../../parser': 35,
            '../../../parser/inline/media': 79,
            'typed-dom': 12
        }
    ],
    101: [
        function (require, module, exports) {
            (function (global) {
                'use strict';
                Object.defineProperty(exports, '__esModule', { value: true });
                const parser_1 = require('../../../parser');
                const cache_1 = require('spica/cache');
                const dompurify_1 = typeof window !== 'undefined' ? window['DOMPurify'] : typeof global !== 'undefined' ? global['DOMPurify'] : null;
                const typed_dom_1 = require('typed-dom');
                let widgetScriptRequested = !!window.twttr;
                const cache = new cache_1.Cache(100);
                function twitter(url) {
                    if (!['https://twitter.com'].includes(url.origin))
                        return;
                    if (cache.has(url.href)) {
                        const el = cache.get(url.href).cloneNode(true);
                        window.twttr && void window.twttr.widgets.load(el);
                        return el;
                    }
                    return typed_dom_1.default.div({ style: 'position: relative;' }, [typed_dom_1.default.em(`loading ${ url.href }`)], () => {
                        const outer = typed_dom_1.html('div');
                        void $.ajax(`https://publish.twitter.com/oembed?url=${ url.href.replace('?', '&') }`, {
                            dataType: 'jsonp',
                            timeout: 10 * 1000,
                            cache: true,
                            success({html}) {
                                outer.innerHTML = dompurify_1.sanitize(`<div style="margin-top: -10px; margin-bottom: -10px;">${ html }</div>`, { ADD_TAGS: ['script'] });
                                const script = outer.querySelector('script');
                                script && void script.remove();
                                void cache.set(url.href, outer.cloneNode(true));
                                if (window.twttr)
                                    return void window.twttr.widgets.load(outer);
                                if (widgetScriptRequested || !script)
                                    return;
                                widgetScriptRequested = true;
                                if (!script.getAttribute('src').startsWith('https://platform.twitter.com/'))
                                    return;
                                if (document.querySelector(`script[src="${ script.getAttribute('src') }"]`))
                                    return;
                                void $.ajax(script.src, {
                                    dataType: 'script',
                                    cache: true
                                });
                            },
                            error({status, statusText}) {
                                outer.innerHTML = parser_1.parse(`*${ parser_1.escape(url.href) }\\\n-> ${ status }: ${ parser_1.escape(statusText) }*`).querySelector('p').innerHTML;
                            }
                        });
                        return outer;
                    }).element;
                }
                exports.twitter = twitter;
            }.call(this, typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {}));
        },
        {
            '../../../parser': 35,
            'spica/cache': 6,
            'typed-dom': 12
        }
    ],
    102: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const media_1 = require('../../../parser/inline/media');
            const typed_dom_1 = require('typed-dom');
            function video(url, alt) {
                if (![
                        '.webm',
                        '.ogv'
                    ].includes(url.pathname.split(/(?=\.)/).pop()))
                    return;
                return media_1.cache.has(url.href) ? media_1.cache.get(url.href).cloneNode(true) : media_1.cache.set(url.href, typed_dom_1.html('video', {
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
            '../../../parser/inline/media': 79,
            'typed-dom': 12
        }
    ],
    103: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const typed_dom_1 = require('typed-dom');
            function youtube(url) {
                if (![
                        'https://www.youtube.com',
                        'https://youtu.be'
                    ].includes(url.origin))
                    return;
                return typed_dom_1.default.div({ style: 'position: relative;' }, [typed_dom_1.default.div({ style: 'position: relative; padding-top: 56.25%;' }, [typed_dom_1.default.iframe({
                            src: `https://www.youtube.com/embed/${ url.origin === 'https://www.youtube.com' && url.href.replace(/.+?=/, '').replace(/&/, '?') || url.origin === 'https://youtu.be' && url.href.slice(url.href.indexOf('/', 9) + 1) }`,
                            allowfullscreen: '',
                            frameborder: '0',
                            style: 'position: absolute; top: 0; right: 0; width: 100%; height: 100%;'
                        })])]).element;
            }
            exports.youtube = youtube;
        },
        { 'typed-dom': 12 }
    ],
    104: [
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
            './util/figure': 105,
            './util/footnote': 106,
            './util/toc': 107
        }
    ],
    105: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const typed_dom_1 = require('typed-dom');
            function figure(source, header = caption => caption.getAttribute('data-type') === '$' ? `(${ caption.getAttribute('data-index') })` : capitalize(`${ caption.getAttribute('data-type') }. ${ caption.getAttribute('data-index') }.`)) {
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
                    void source.querySelectorAll(`a.${ label.replace(/[:$.]/g, '\\$&') }`).forEach(link => {
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
            function capitalize(label) {
                return label[0].toUpperCase() + label.slice(1);
            }
        },
        { 'typed-dom': 12 }
    ],
    106: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const indexer_1 = require('../parser/block/indexer');
            const concat_1 = require('spica/concat');
            const typed_dom_1 = require('typed-dom');
            const annotation = new WeakMap();
            const reference = new WeakMap();
            function footnote(source, target) {
                const footnotes = new Map();
                return void typed_dom_1.TypedHTML.ol([...source.querySelectorAll('.annotation')].reduce((acc, el, i) => {
                    !annotation.has(el) && void annotation.set(el, [...el.childNodes]);
                    reference.has(el) && void reference.get(el).remove();
                    void defineTitle(el);
                    const title = el.getAttribute('title');
                    void defineId(el, i + 1);
                    const fn = footnotes.get(title);
                    const index = fn ? +fn.getAttribute('id').match(/\d+/)[0] : acc.length + 1;
                    const id = fn ? fn.getAttribute('id') : `footnote:${ index }`;
                    void reference.set(el, el.appendChild(typed_dom_1.html('a', {
                        href: `#${ id }`,
                        rel: 'noopener'
                    }, `[${ index }]`)));
                    return fn ? (() => {
                        void fn.lastChild.appendChild(typed_dom_1.html('a', {
                            href: `#${ el.id }`,
                            rel: 'noopener'
                        }, `[${ i + 1 }]`));
                        void [...annotation.get(el)].forEach(node => node.parentNode === el && void el.removeChild(node));
                        return acc;
                    })() : concat_1.concat(acc, [typed_dom_1.html('li', { id }, [
                            ...annotation.get(el),
                            typed_dom_1.html('sup', [typed_dom_1.html('a', {
                                    href: `#${ el.id }`,
                                    rel: 'noopener'
                                }, `[${ i + 1 }]`)])
                        ])].map(el => void footnotes.set(title, el) || el));
                }, []).map(el => typed_dom_1.TypedHTML.li(() => el)), () => target).element;
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
                void target.setAttribute('id', `annotation:${ index }`);
            }
        },
        {
            '../parser/block/indexer': 52,
            'spica/concat': 7,
            'typed-dom': 12
        }
    ],
    107: [
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
            'spica/concat': 7,
            'typed-dom': 12
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
            './src/parser': 35,
            './src/renderer': 91,
            './src/util': 104
        }
    ]
}, {}, [
    1,
    2,
    3,
    'securemark',
    4
]);