/*! securemark v0.99.2 https://github.com/falsandtru/securemark | (c) 2017, falsandtru | (Apache-2.0 AND MPL-2.0) License */
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
                    return target[key] = type_1.isObject(source[key]) ? exports.clone(source[key] instanceof Object ? {} : Object.create(null), source[key]) : source[key];
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
                        return target[key] = type_1.isObject(source[key]) ? exports.extend(target[key], source[key]) : source[key];
                    default:
                        return target[key] = type_1.isObject(source[key]) ? exports.extend(source[key] instanceof Object ? {} : Object.create(null), source[key]) : source[key];
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
        { './type': 11 }
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
            function memoize(f, memory = new Map()) {
                return a => memory.has(a) ? memory.get(a) : void memory.set(a, f(a)) || memory.get(a);
            }
            exports.memoize = memoize;
        },
        {}
    ],
    10: [
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
    11: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            function type(target) {
                const type = Object.prototype.toString.call(target).split(' ').pop().slice(0, -1);
                if (target === null || typeof target !== 'object' && target instanceof Object === false)
                    return type.toLowerCase();
                return type;
            }
            exports.type = type;
            function isObject(target) {
                return target !== null && (typeof target === 'object' || target instanceof Object);
            }
            exports.isObject = isObject;
        },
        {}
    ],
    12: [
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
    13: [
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
            exports.API = builder_1.API;
            var dom_1 = require('./src/util/dom');
            exports.html = dom_1.html;
            exports.svg = dom_1.svg;
            exports.text = dom_1.text;
            exports.frag = dom_1.frag;
            exports.define = dom_1.define;
            exports.observer = dom_1.observer;
            __export(require('./src/util/listener'));
        },
        {
            './src/dom/builder': 14,
            './src/util/dom': 17,
            './src/util/listener': 18
        }
    ],
    14: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const manager_1 = require('./manager');
            const dom_1 = require('../util/dom');
            function API(baseFactory) {
                return new Proxy({}, handle(baseFactory));
            }
            exports.API = API;
            exports.TypedHTML = API(dom_1.html);
            exports.TypedSVG = API(dom_1.svg);
            function handle(baseFactory) {
                return { get: (obj, prop) => obj[prop] || prop in obj || typeof prop !== 'string' ? obj[prop] : obj[prop] = builder(prop, baseFactory) };
                function builder(tag, baseFactory) {
                    return function build(attrs, children, factory) {
                        if (typeof attrs === 'function')
                            return build(undefined, undefined, attrs);
                        if (typeof children === 'function')
                            return build(attrs, undefined, children);
                        if (attrs !== undefined && isChildren(attrs))
                            return build(undefined, attrs, factory);
                        return new manager_1.El(elem(factory || ((f, tag) => f(tag)), attrs || {}, children), children);
                    };
                    function isChildren(children) {
                        return typeof children !== 'object' || Object.values(children).slice(-1).every(val => typeof val === 'object');
                    }
                    function elem(factory, attrs, children) {
                        const el = factory(baseFactory, tag, attrs, children);
                        if (tag !== el.tagName.toLowerCase())
                            throw new Error(`TypedDOM: Tag name must be "${ tag }", but got "${ el.tagName.toLowerCase() }".`);
                        void dom_1.define(el, attrs);
                        return el;
                    }
                }
            }
        },
        {
            '../util/dom': 17,
            './manager': 16
        }
    ],
    15: [
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
            'spica/sqid': 10,
            'spica/uuid': 12
        }
    ],
    16: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const identity_1 = require('./identity');
            const dom_1 = require('../util/dom');
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
                        void dom_1.define(element_, []);
                        this.children_ = element_.appendChild(document.createTextNode(''));
                        this.children = children_;
                        return;
                    case ElChildrenType.Collection:
                        void dom_1.define(element_, []);
                        this.children_ = [];
                        this.children = children_;
                        return;
                    case ElChildrenType.Record:
                        void dom_1.define(element_, []);
                        this.children_ = observe(element_, Object.assign({}, children_));
                        this.children = children_;
                        return;
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
                        children = document.createTextNode(children);
                        void this.element_.replaceChild(children, this.children_);
                        this.children_ = children;
                        return;
                    case ElChildrenType.Collection:
                        this.children_ = [];
                        void children.forEach((child, i) => {
                            child.element_.parentElement === this.element_ || void throwErrorIfNotUsable(child);
                            this.children_[i] = child;
                            if (this.children_[i] === this.element_.childNodes[i])
                                return;
                            void this.element_.insertBefore(child.element, this.element_.childNodes[i]);
                        });
                        while (this.element_.childNodes.length > children.length) {
                            void this.element_.removeChild(this.element_.lastChild);
                        }
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
        {
            '../util/dom': 17,
            './identity': 15
        }
    ],
    17: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            function observer(factory, callback, opts = { childList: true }) {
                return (tag, ...args) => {
                    const obs = new MutationObserver(callback);
                    const el = factory(tag);
                    void obs.observe(el, opts);
                    void define(el, ...args);
                    return el;
                };
            }
            exports.observer = observer;
            var cache;
            (function (cache) {
                cache.elem = new Map();
                cache.text = document.createTextNode('');
                cache.frag = document.createDocumentFragment();
            }(cache || (cache = {})));
            function html(tag, attrs = {}, children = []) {
                return element(0, tag, attrs, children);
            }
            exports.html = html;
            function svg(tag, attrs = {}, children = []) {
                return element(1, tag, attrs, children);
            }
            exports.svg = svg;
            function frag(children = []) {
                children = typeof children === 'string' ? [text(children)] : children;
                const frag = cache.frag.cloneNode();
                void frag.append(...children);
                return frag;
            }
            exports.frag = frag;
            function text(source) {
                const text = cache.text.cloneNode();
                text.data = source;
                return text;
            }
            exports.text = text;
            var NS;
            (function (NS) {
                NS[NS['HTML'] = 0] = 'HTML';
                NS[NS['SVG'] = 1] = 'SVG';
            }(NS || (NS = {})));
            function element(ns, tag, attrs = {}, children = []) {
                const key = `${ ns }:${ tag }`;
                const el = cache.elem.has(key) ? cache.elem.get(key).cloneNode(true) : cache.elem.set(key, elem(ns, tag)).get(key).cloneNode(true);
                void define(el, attrs, children);
                return el;
            }
            function elem(ns, tag) {
                switch (ns) {
                case 0:
                    return document.createElement(tag);
                case 1:
                    return document.createElementNS('http://www.w3.org/2000/svg', tag);
                default:
                    throw new Error(`TypedDOM: Unknown namespace: ${ ns }`);
                }
            }
            function define(el, attrs = {}, children) {
                if (isChildren(attrs))
                    return define(el, undefined, attrs);
                if (typeof children === 'string')
                    return define(el, attrs, [text(children)]);
                void Object.entries(attrs).forEach(([name, value]) => {
                    switch (typeof value) {
                    case 'function':
                        return void el.addEventListener(name.slice(2), value, {
                            passive: [
                                'wheel',
                                'mousewheel',
                                'touchstart',
                                'touchmove'
                            ].includes(name.slice(2))
                        });
                    case 'undefined':
                        return void el.removeAttribute(name);
                    default:
                        return void el.setAttribute(name, value);
                    }
                });
                if (children) {
                    el.innerHTML = '';
                    while (el.firstChild) {
                        void el.removeChild(el.firstChild);
                    }
                    void el.append(...children);
                }
                return el;
            }
            exports.define = define;
            function isChildren(o) {
                return !!o[Symbol.iterator];
            }
        },
        {}
    ],
    18: [
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
        { './noop': 19 }
    ],
    19: [
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
    20: [
        function (require, module, exports) {
            'use strict';
            function __export(m) {
                for (var p in m)
                    if (!exports.hasOwnProperty(p))
                        exports[p] = m[p];
            }
            Object.defineProperty(exports, '__esModule', { value: true });
            var parser_1 = require('./combinator/data/parser');
            exports.eval = parser_1.eval;
            exports.exec = parser_1.exec;
            __export(require('./combinator/data/parser/union'));
            __export(require('./combinator/data/parser/sequence'));
            __export(require('./combinator/data/parser/subsequence'));
            __export(require('./combinator/data/parser/inits'));
            __export(require('./combinator/data/parser/tails'));
            __export(require('./combinator/data/parser/some'));
            __export(require('./combinator/control/constraint/block'));
            __export(require('./combinator/control/constraint/line'));
            __export(require('./combinator/control/constraint/scope'));
            __export(require('./combinator/control/constraint/contract'));
            __export(require('./combinator/control/manipulation/surround'));
            __export(require('./combinator/control/manipulation/match'));
            __export(require('./combinator/control/manipulation/convert'));
            __export(require('./combinator/control/manipulation/indent'));
            __export(require('./combinator/control/manipulation/trim'));
            __export(require('./combinator/control/manipulation/lazy'));
            __export(require('./combinator/control/monad/fmap'));
            __export(require('./combinator/control/monad/bind'));
        },
        {
            './combinator/control/constraint/block': 21,
            './combinator/control/constraint/contract': 22,
            './combinator/control/constraint/line': 23,
            './combinator/control/constraint/scope': 24,
            './combinator/control/manipulation/convert': 25,
            './combinator/control/manipulation/indent': 26,
            './combinator/control/manipulation/lazy': 27,
            './combinator/control/manipulation/match': 28,
            './combinator/control/manipulation/surround': 29,
            './combinator/control/manipulation/trim': 30,
            './combinator/control/monad/bind': 31,
            './combinator/control/monad/fmap': 32,
            './combinator/data/parser': 33,
            './combinator/data/parser/inits': 34,
            './combinator/data/parser/sequence': 35,
            './combinator/data/parser/some': 36,
            './combinator/data/parser/subsequence': 37,
            './combinator/data/parser/tails': 38,
            './combinator/data/parser/union': 39
        }
    ],
    21: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const parser_1 = require('../../data/parser');
            const line_1 = require('./line');
            function block(parser, separation = true) {
                return source => {
                    if (source.length === 0)
                        return;
                    const result = parser(source);
                    if (!result)
                        return;
                    const rest = parser_1.exec(result);
                    if (separation && line_1.firstline(rest).trim() !== '')
                        return;
                    return rest === '' || source[source.length - rest.length - 1] === '\n' ? result : undefined;
                };
            }
            exports.block = block;
        },
        {
            '../../data/parser': 33,
            './line': 23
        }
    ],
    22: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const parser_1 = require('../../data/parser');
            function contract(pattern, parser, cond) {
                return verify(validate(pattern, parser), cond);
            }
            exports.contract = contract;
            function validate(pattern, parser) {
                return source => {
                    if (source === '')
                        return;
                    const res = match(source, pattern);
                    if (!res)
                        return;
                    const result = parser(source);
                    if (!result)
                        return;
                    return parser_1.exec(result).length < source.length ? result : undefined;
                };
            }
            exports.validate = validate;
            function verify(parser, cond) {
                return source => {
                    if (source === '')
                        return;
                    const result = parser(source);
                    if (!result)
                        return;
                    if (!cond(parser_1.eval(result), parser_1.exec(result)))
                        return;
                    return parser_1.exec(result).length < source.length ? result : undefined;
                };
            }
            exports.verify = verify;
            function match(source, pattern) {
                return typeof pattern === 'string' ? source.startsWith(pattern) ? [pattern] : null : source.match(pattern);
            }
        },
        { '../../data/parser': 33 }
    ],
    23: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const parser_1 = require('../../data/parser');
            const scope_1 = require('./scope');
            const surround_1 = require('../manipulation/surround');
            function line(parser, allowTrailingWhitespace = true) {
                return scope_1.focus(/^[^\n]*(?:\n|$)/, surround_1.surround('', parser, allowTrailingWhitespace ? /^\s*$/ : /^$/));
            }
            exports.line = line;
            function subline(parser) {
                return source => {
                    if (source === '')
                        return;
                    const result = parser(source);
                    if (!result)
                        return result;
                    return source.length - parser_1.exec(result).length <= source.split('\n', 1)[0].length ? result : undefined;
                };
            }
            exports.subline = subline;
            function firstline(source) {
                const i = source.indexOf('\n');
                return i === -1 ? source : source.slice(0, i + 1);
            }
            exports.firstline = firstline;
        },
        {
            '../../data/parser': 33,
            '../manipulation/surround': 29,
            './scope': 24
        }
    ],
    24: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const parser_1 = require('../../data/parser');
            function focus(scope, parser) {
                return source => {
                    if (source === '')
                        return;
                    const [src = ''] = source.match(scope) || [];
                    if (src === '')
                        return;
                    const result = parser(src);
                    if (!result)
                        return;
                    return parser_1.exec(result).length < src.length ? [
                        parser_1.eval(result),
                        parser_1.exec(result) + source.slice(src.length)
                    ] : undefined;
                };
            }
            exports.focus = focus;
            function rewrite(scope, parser) {
                return source => {
                    if (source === '')
                        return;
                    const res1 = scope(source);
                    if (!res1 || parser_1.exec(res1).length >= source.length)
                        return;
                    const src = source.slice(0, source.length - parser_1.exec(res1).length);
                    const res2 = parser(src);
                    if (!res2)
                        return;
                    return parser_1.exec(res2).length < src.length ? [
                        parser_1.eval(res2),
                        parser_1.exec(res2) + parser_1.exec(res1)
                    ] : undefined;
                };
            }
            exports.rewrite = rewrite;
        },
        { '../../data/parser': 33 }
    ],
    25: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            function convert(conv, parser) {
                return source => {
                    if (source === '')
                        return;
                    source = conv(source);
                    return source !== '' ? parser(source) : [
                        [],
                        ''
                    ];
                };
            }
            exports.convert = convert;
        },
        {}
    ],
    26: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const parser_1 = require('../../data/parser');
            const some_1 = require('../../data/parser/some');
            const bind_1 = require('../monad/bind');
            const match_1 = require('./match');
            const surround_1 = require('./surround');
            const line_1 = require('../constraint/line');
            const scope_1 = require('../constraint/scope');
            function indent(parser) {
                return bind_1.bind(match_1.match(/^(?=([^\S\n]+))/, ([, indent]) => some_1.some(line_1.line(scope_1.rewrite(s => [
                    [],
                    s.slice(line_1.firstline(s).length)
                ], surround_1.surround(indent, s => [
                    [s.split('\n', 1)[0]],
                    ''
                ], ''))))), (rs, rest) => {
                    const result = parser(rs.join('\n'));
                    return result && parser_1.exec(result) === '' ? [
                        parser_1.eval(result),
                        rest
                    ] : undefined;
                });
            }
            exports.indent = indent;
        },
        {
            '../../data/parser': 33,
            '../../data/parser/some': 36,
            '../constraint/line': 23,
            '../constraint/scope': 24,
            '../monad/bind': 31,
            './match': 28,
            './surround': 29
        }
    ],
    27: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            function lazy(builder) {
                let parser;
                return source => (parser = parser || builder())(source);
            }
            exports.lazy = lazy;
        },
        {}
    ],
    28: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const parser_1 = require('../../data/parser');
            function match(pattern, f) {
                return source => {
                    if (source === '')
                        return;
                    const res = source.match(pattern);
                    if (!res)
                        return;
                    const rest = source.slice(res[0].length);
                    const result = f(res)(rest);
                    if (!result)
                        return;
                    return parser_1.exec(result).length < source.length && parser_1.exec(result).length <= rest.length ? result : undefined;
                };
            }
            exports.match = match;
        },
        { '../../data/parser': 33 }
    ],
    29: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            function surround(start, parser, end, strict = true) {
                return lmr_ => {
                    if (lmr_ === '')
                        return;
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
                return result && source.startsWith(result[0]) ? result[0] : undefined;
            }
        },
        {}
    ],
    30: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const convert_1 = require('./convert');
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
        { './convert': 25 }
    ],
    31: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const parser_1 = require('../../data/parser');
            function bind(parser, f) {
                return source => {
                    if (source === '')
                        return;
                    const res1 = parser(source);
                    if (!res1)
                        return;
                    const res2 = f(parser_1.eval(res1), parser_1.exec(res1));
                    if (!res2)
                        return;
                    return parser_1.exec(res2).length <= parser_1.exec(res1).length ? res2 : undefined;
                };
            }
            exports.bind = bind;
        },
        { '../../data/parser': 33 }
    ],
    32: [
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
        { './bind': 31 }
    ],
    33: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            function eval_(result, default_ = []) {
                return (result || [default_])[0];
            }
            exports.eval = eval_;
            function exec(result, default_ = '') {
                return (result || [
                    [],
                    default_
                ])[1];
            }
            exports.exec = exec;
            function validate(source, result) {
                if (!result)
                    return true;
                return true;
            }
            exports.validate = validate;
        },
        {}
    ],
    34: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const union_1 = require('./union');
            const sequence_1 = require('./sequence');
            const bind_1 = require('../../control/monad/bind');
            function inits(parsers) {
                let ps;
                return parsers.length < 2 ? union_1.union(parsers) : bind_1.bind(parsers[0], (rs, rest) => union_1.union([
                    sequence_1.sequence([
                        () => [
                            rs,
                            rest
                        ],
                        inits(ps = ps || parsers.slice(1))
                    ]),
                    () => [
                        rs,
                        rest
                    ]
                ])(` ${ rest }`));
            }
            exports.inits = inits;
        },
        {
            '../../control/monad/bind': 31,
            './sequence': 35,
            './union': 39
        }
    ],
    35: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const union_1 = require('./union');
            const bind_1 = require('../../control/monad/bind');
            const concat_1 = require('spica/concat');
            function sequence(parsers) {
                let ps;
                return parsers.length < 2 ? union_1.union(parsers) : bind_1.bind(parsers[0], (rs1, rest) => bind_1.bind(sequence(ps = ps || parsers.slice(1)), (rs2, rest) => [
                    concat_1.concat(rs1, rs2),
                    rest
                ])(rest));
            }
            exports.sequence = sequence;
        },
        {
            '../../control/monad/bind': 31,
            './union': 39,
            'spica/concat': 7
        }
    ],
    36: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const parser_1 = require('../parser');
            const concat_1 = require('spica/concat');
            function some(parser, until) {
                return source => {
                    let rest = source;
                    const results = [];
                    while (true) {
                        if (rest === '')
                            break;
                        if (until && match(rest, until))
                            break;
                        const result = parser(rest);
                        if (!result)
                            break;
                        if (parser_1.exec(result).length >= rest.length)
                            return;
                        void concat_1.concat(results, parser_1.eval(result));
                        rest = parser_1.exec(result);
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
        {
            '../parser': 33,
            'spica/concat': 7
        }
    ],
    37: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const union_1 = require('./union');
            const inits_1 = require('./inits');
            function subsequence(parsers) {
                return parsers.length < 2 ? union_1.union(parsers) : union_1.union([
                    inits_1.inits(parsers),
                    subsequence(parsers.slice(1))
                ]);
            }
            exports.subsequence = subsequence;
        },
        {
            './inits': 34,
            './union': 39
        }
    ],
    38: [
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
            './sequence': 35,
            './union': 39
        }
    ],
    39: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const parser_1 = require('../parser');
            function union(parsers) {
                switch (parsers.length) {
                case 0:
                    return () => undefined;
                case 1:
                    return parsers[0];
                default:
                    let ps;
                    return source => {
                        const result = parsers[0](source);
                        if (!result)
                            return union(ps = ps || parsers.slice(1))(source);
                        return parser_1.exec(result).length < source.length ? result : undefined;
                    };
                }
            }
            exports.union = union;
        },
        { '../parser': 33 }
    ],
    40: [
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
        { './parser/api': 41 }
    ],
    41: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var parse_1 = require('./api/parse');
            exports.parse = parse_1.parse;
            var bind_1 = require('./api/bind');
            exports.bind = bind_1.bind;
            var source_1 = require('./api/source');
            exports.breaklines = source_1.breaklines;
            var cache_1 = require('./api/cache');
            exports.caches = cache_1.caches;
        },
        {
            './api/bind': 42,
            './api/cache': 43,
            './api/parse': 45,
            './api/source': 47
        }
    ],
    42: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../combinator');
            const segment_1 = require('./segment');
            const block_1 = require('../block');
            const normalization_1 = require('./normalization');
            function bind(target) {
                const pairs = [];
                let revision;
                return function* (source) {
                    source = normalization_1.normalize(source);
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
                        const es = combinator_1.eval(block_1.block(seg));
                        void pairs.splice(k, 0, [
                            seg,
                            es
                        ]);
                        for (const el of es) {
                            void target.insertBefore(el, ref);
                            yield el;
                            if (revision !== rev)
                                throw new Error(`Reentered.`);
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
            '../../combinator': 20,
            '../block': 49,
            './normalization': 44,
            './segment': 46
        }
    ],
    43: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const math_1 = require('../inline/math');
            const media_1 = require('../inline/media');
            exports.caches = {
                math: math_1.cache,
                media: media_1.cache
            };
        },
        {
            '../inline/math': 93,
            '../inline/media': 94
        }
    ],
    44: [
        function (require, module, exports) {
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
    45: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../combinator');
            const block_1 = require('../block');
            const segment_1 = require('./segment');
            const normalization_1 = require('./normalization');
            const concat_1 = require('spica/concat');
            const typed_dom_1 = require('typed-dom');
            function parse(source) {
                return typed_dom_1.frag(segment_1.segment(normalization_1.normalize(source)).reduce((acc, seg) => concat_1.concat(acc, combinator_1.eval(block_1.block(seg))), []));
            }
            exports.parse = parse;
        },
        {
            '../../combinator': 20,
            '../block': 49,
            './normalization': 44,
            './segment': 46,
            'spica/concat': 7,
            'typed-dom': 13
        }
    ],
    46: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const normalization_1 = require('./normalization');
            const combinator_1 = require('../../combinator');
            const codeblock_1 = require('../block/codeblock');
            const mathblock_1 = require('../block/mathblock');
            const extension_1 = require('../block/extension');
            const line_1 = require('../source/line');
            function segment(source) {
                const segments = [];
                while (source.length > 0) {
                    const result = combinator_1.union([
                        codeblock_1.segment,
                        mathblock_1.segment,
                        extension_1.segment,
                        combinator_1.some(line_1.contentline),
                        combinator_1.some(line_1.blankline)
                    ])(source);
                    const rest = combinator_1.exec(result);
                    void segments.push(source.slice(0, source.length - rest.length));
                    source = rest;
                }
                return segments;
            }
            exports.segment = segment;
        },
        {
            '../../combinator': 20,
            '../block/codeblock': 51,
            '../block/extension': 53,
            '../block/mathblock': 62,
            '../source/line': 102,
            './normalization': 44
        }
    ],
    47: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../combinator');
            const parse_1 = require('./parse');
            const concat_1 = require('spica/concat');
            const sources = new WeakMap();
            function breaklines(source) {
                return [...parse_1.parse(source).children].map(el => {
                    if (el instanceof HTMLParagraphElement === false)
                        return sources.get(el);
                    const breaks = [...el.querySelectorAll('br, .linebreak, .comment')].reduce((acc, el) => concat_1.concat(acc, el.matches('.comment') ? Array(el.title.split('\n').length - 1).fill(el) : [el]), []);
                    return sources.get(el).split('\n').map((line, i) => breaks[i] && breaks[i].matches('.linebreak') && !breaks[i].closest('.annotation') ? `${ line }\\` : line).join('\n');
                }).join('\n');
            }
            exports.breaklines = breaklines;
            function memorize(parser) {
                return source => combinator_1.bind(parser, (rs, rest) => {
                    if (rs.length === 0)
                        return [
                            rs,
                            rest
                        ];
                    void sources.set(rs[0], source.slice(0, source.length - rest.length));
                    return [
                        rs,
                        rest
                    ];
                })(source);
            }
            exports.memorize = memorize;
        },
        {
            '../../combinator': 20,
            './parse': 45,
            'spica/concat': 7
        }
    ],
    48: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../combinator');
            const autolink_1 = require('./inline/autolink');
            const unescapable_1 = require('./source/unescapable');
            exports.autolink = combinator_1.union([
                autolink_1.autolink,
                unescapable_1.unescsource
            ]);
        },
        {
            '../combinator': 20,
            './inline/autolink': 72,
            './source/unescapable': 104
        }
    ],
    49: [
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
            const codeblock_1 = require('./block/codeblock');
            const mathblock_1 = require('./block/mathblock');
            const extension_1 = require('./block/extension');
            const paragraph_1 = require('./block/paragraph');
            const locale_1 = require('./locale');
            const source_1 = require('./api/source');
            exports.block = source_1.memorize(locale_1.localize(combinator_1.union([
                newline_1.newline,
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
            ])));
        },
        {
            '../combinator': 20,
            './api/source': 47,
            './block/blockquote': 50,
            './block/codeblock': 51,
            './block/dlist': 52,
            './block/extension': 53,
            './block/heading': 59,
            './block/horizontalrule': 60,
            './block/ilist': 61,
            './block/mathblock': 62,
            './block/newline': 63,
            './block/olist': 64,
            './block/paragraph': 65,
            './block/table': 67,
            './block/ulist': 68,
            './locale': 98
        }
    ],
    50: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../combinator');
            const line_1 = require('../source/line');
            const autolink_1 = require('../autolink');
            const parse_1 = require('../api/parse');
            const util_1 = require('../util');
            const typed_dom_1 = require('typed-dom');
            exports.blockquote = combinator_1.lazy(() => combinator_1.block(combinator_1.union([
                combinator_1.surround(/^(?=>+(?:[^\S\n]|\n.*?\S))/, textquote, ''),
                combinator_1.surround(/^!(?=>+(?:[^\S\n]|\n.*?\S))/, sourcequote, '')
            ])));
            const opener = /^(?=>>+(?:\s|$))/;
            const textquote = combinator_1.lazy(() => combinator_1.fmap(combinator_1.some(combinator_1.union([
                combinator_1.rewrite(indent, combinator_1.convert(unindent, textquote)),
                combinator_1.rewrite(combinator_1.some(line_1.contentline, opener), combinator_1.convert(unindent, combinator_1.fmap(util_1.defrag(combinator_1.some(autolink_1.autolink)), ns => [typed_dom_1.html('pre', ns)])))
            ])), ns => [typed_dom_1.html('blockquote', ns)]));
            const sourcequote = combinator_1.lazy(() => combinator_1.fmap(combinator_1.some(combinator_1.union([
                combinator_1.rewrite(indent, combinator_1.convert(unindent, sourcequote)),
                combinator_1.rewrite(combinator_1.some(line_1.contentline, opener), combinator_1.convert(unindent, source => [
                    [util_1.suppress(parse_1.parse(source))],
                    ''
                ]))
            ])), ns => [typed_dom_1.html('blockquote', ns)]));
            const indent = combinator_1.block(combinator_1.surround(opener, combinator_1.some(line_1.contentline, /^>(?:\s|$)/), ''), false);
            function unindent(source) {
                return source.replace(/\n$/, '').replace(/^>(?:$|\s|(?=>+(?:$|\s)))/mg, '');
            }
        },
        {
            '../../combinator': 20,
            '../api/parse': 45,
            '../autolink': 48,
            '../source/line': 102,
            '../util': 106,
            'typed-dom': 13
        }
    ],
    51: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../combinator');
            const escapable_1 = require('../source/escapable');
            require('../source/unescapable');
            const util_1 = require('../util');
            const typed_dom_1 = require('typed-dom');
            const autolink_1 = require('../autolink');
            exports.segment = combinator_1.lazy(() => combinator_1.block(exports.segment_));
            exports.segment_ = combinator_1.block(combinator_1.focus(/^(`{3,})(?!`)(\S*)([^\n]*)\n((?:(?!\1[^\S\n]*(?:\n|$))[^\n]*\n){0,300})\1[^\S\n]*(?:\n|$)/, _ => [
                [],
                ''
            ]), false);
            exports.codeblock = combinator_1.block(combinator_1.rewrite(exports.segment, combinator_1.trim(combinator_1.match(/^(`{3,})(?!`)(\S*)([^\n]*)\n([\s\S]*)\1$/, ([, , lang, param, body]) => rest => {
                const el = typed_dom_1.html('pre', { class: 'notranslate' }, body.slice(0, -1));
                if (lang) {
                    lang = lang.match(/^[a-z][a-z0-9]*(?:-[a-z][a-z0-9]*)*$/) ? lang : 'invalid';
                    void el.classList.add('code');
                    void el.classList.add(`language-${ lang }`);
                    void el.setAttribute('data-lang', lang);
                } else {
                    void typed_dom_1.define(el, combinator_1.eval(util_1.defrag(combinator_1.some(autolink_1.autolink))(el.textContent)));
                }
                const filepath = util_1.stringify(combinator_1.eval(combinator_1.some(escapable_1.escsource, /^\s/)(param.trim())));
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
            '../../combinator': 20,
            '../autolink': 48,
            '../source/escapable': 101,
            '../source/unescapable': 104,
            '../util': 106,
            'typed-dom': 13
        }
    ],
    52: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../combinator');
            const line_1 = require('../source/line');
            const inline_1 = require('../inline');
            const util_1 = require('../util');
            const concat_1 = require('spica/concat');
            const typed_dom_1 = require('typed-dom');
            exports.dlist = combinator_1.lazy(() => combinator_1.block(combinator_1.fmap(combinator_1.some(combinator_1.inits([
                combinator_1.some(term),
                combinator_1.some(desc)
            ])), es => [typed_dom_1.html('dl', fillTrailingDescription(es))])));
            const term = combinator_1.line(combinator_1.rewrite(line_1.contentline, inline_1.index(combinator_1.verify(combinator_1.fmap(combinator_1.surround(/^~(?=\s|$)/, util_1.defrag(combinator_1.trim(combinator_1.some(combinator_1.union([
                inline_1.indexer,
                inline_1.inline
            ])))), '', false), ns => [typed_dom_1.html('dt', ns)]), ([el]) => !util_1.hasMedia(el)))));
            const desc = combinator_1.block(combinator_1.fmap(combinator_1.rewrite(combinator_1.surround(/^:(?=\s|$)|/, combinator_1.some(line_1.anyline, /^[~:](?=\s|$)/), '', false), combinator_1.surround(/^:(?=\s|$)|/, util_1.defrag(combinator_1.trim(combinator_1.some(combinator_1.union([inline_1.inline])))), '', false)), ns => [typed_dom_1.html('dd', ns)]), false);
            function fillTrailingDescription(es) {
                return es.length > 0 && es[es.length - 1].tagName === 'DT' ? concat_1.concat(es, [typed_dom_1.html('dd')]) : es;
            }
        },
        {
            '../../combinator': 20,
            '../inline': 69,
            '../source/line': 102,
            '../util': 106,
            'spica/concat': 7,
            'typed-dom': 13
        }
    ],
    53: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../combinator');
            const fig_1 = require('./extension/fig');
            const figure_1 = require('./extension/figure');
            const graph_1 = require('./extension/graph');
            const example_1 = require('./extension/example');
            const placeholder_1 = require('./extension/placeholder');
            exports.segment = combinator_1.validate(/^~{3,}[a-z]|^\[:[^\]\s]+\][^\S\n]*\n/, combinator_1.union([
                fig_1.segment,
                figure_1.segment,
                graph_1.segment,
                example_1.segment,
                placeholder_1.segment
            ]));
            exports.extension = combinator_1.rewrite(exports.segment, combinator_1.union([
                fig_1.fig,
                figure_1.figure,
                graph_1.graph,
                example_1.example,
                placeholder_1.placeholder
            ]));
        },
        {
            '../../combinator': 20,
            './extension/example': 54,
            './extension/fig': 55,
            './extension/figure': 56,
            './extension/graph': 57,
            './extension/placeholder': 58
        }
    ],
    54: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../../combinator');
            const parse_1 = require('../../api/parse');
            const mathblock_1 = require('../mathblock');
            const util_1 = require('../../util');
            const util_2 = require('../../../util');
            const typed_dom_1 = require('typed-dom');
            exports.segment = combinator_1.lazy(() => combinator_1.block(exports.segment_));
            exports.segment_ = combinator_1.block(combinator_1.focus(/^(~{3,})example\/(?:markdown|math)[^\S\n]*\n(?:[^\n]*\n)*?\1[^\S\n]*(?:\n|$)/, _ => [
                [],
                ''
            ]), false);
            exports.example = combinator_1.block(combinator_1.rewrite(exports.segment, combinator_1.trim(combinator_1.union([
                combinator_1.match(/^(~{3,})example\/markdown[^\S\n]*(\n[\s\S]*)\1$/, ([, , body]) => rest => {
                    const view = typed_dom_1.html('div', [parse_1.parse(body.slice(1, -1))]);
                    const annotation = typed_dom_1.html('ol');
                    const authority = typed_dom_1.html('ol');
                    void util_2.figure(view);
                    void util_2.footnote(view, {
                        annotation,
                        authority
                    });
                    return [
                        [typed_dom_1.html('aside', {
                                class: 'example',
                                'data-type': 'markdown'
                            }, [
                                typed_dom_1.html('pre', body.slice(1, -1)),
                                util_1.suppress(view),
                                util_1.suppress(annotation),
                                util_1.suppress(authority)
                            ])],
                        rest
                    ];
                }),
                combinator_1.match(/^(~{3,})example\/math[^\S\n]*(\n[\s\S]*)\1$/, ([, , body]) => rest => [
                    [typed_dom_1.html('aside', {
                            class: 'example',
                            'data-type': 'math'
                        }, [
                            typed_dom_1.html('pre', body.slice(1, -1)),
                            ...combinator_1.eval(mathblock_1.mathblock(`$$${ body }$$`))
                        ])],
                    rest
                ])
            ]))));
        },
        {
            '../../../combinator': 20,
            '../../../util': 124,
            '../../api/parse': 45,
            '../../util': 106,
            '../mathblock': 62,
            'typed-dom': 13
        }
    ],
    55: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../../combinator');
            const line_1 = require('../../source/line');
            const figure_1 = require('./figure');
            const codeblock_1 = require('../codeblock');
            const mathblock_1 = require('../mathblock');
            const example_1 = require('../extension/example');
            const inline_1 = require('../../inline');
            exports.segment = combinator_1.block(combinator_1.union([
                combinator_1.sequence([
                    combinator_1.line(inline_1.label),
                    combinator_1.union([
                        codeblock_1.segment,
                        mathblock_1.segment,
                        example_1.segment,
                        combinator_1.some(line_1.contentline)
                    ])
                ]),
                () => undefined
            ]));
            exports.fig = combinator_1.block(combinator_1.rewrite(exports.segment, source => {
                const bracket = (source.match(/^[^\n]*\n!?>+\s/) && source.match(/^~{3,}(?=\s*)$/gm) || []).reduce((max, bracket) => bracket > max ? bracket : max, '~~') + '~';
                return figure_1.figure(`${ bracket }figure ${ source }\n${ bracket }`);
            }));
        },
        {
            '../../../combinator': 20,
            '../../inline': 69,
            '../../source/line': 102,
            '../codeblock': 51,
            '../extension/example': 54,
            '../mathblock': 62,
            './figure': 56
        }
    ],
    56: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../../combinator');
            const line_1 = require('../../source/line');
            const table_1 = require('../table');
            const blockquote_1 = require('../blockquote');
            const codeblock_1 = require('../codeblock');
            const mathblock_1 = require('../mathblock');
            const graph_1 = require('./graph');
            const example_1 = require('./example');
            const inline_1 = require('../../inline');
            const inline_2 = require('../../inline');
            const util_1 = require('../../util');
            const memoization_1 = require('spica/memoization');
            const typed_dom_1 = require('typed-dom');
            const closer = memoization_1.memoize(pattern => new RegExp(`^${ pattern }[^\\S\\n]*(?:\\n|$)`));
            exports.segment = combinator_1.block(combinator_1.union([
                combinator_1.match(/^(~{3,})figure[^\S\n]+(\[:\S+?\])[^\S\n]*\n(?=((?:[^\n]*\n)*?)\1[^\S\n]*(?:\n|$))/, ([, bracket, param]) => rest => combinator_1.surround('', combinator_1.sequence([
                    combinator_1.line(inline_2.label),
                    combinator_1.inits([
                        combinator_1.union([
                            codeblock_1.segment_,
                            mathblock_1.segment_,
                            graph_1.segment_,
                            example_1.segment_,
                            combinator_1.some(line_1.contentline, closer(bracket))
                        ]),
                        line_1.emptyline,
                        combinator_1.union([
                            line_1.blankline,
                            combinator_1.some(line_1.contentline, closer(bracket))
                        ])
                    ])
                ]), closer(bracket))(`${ param }\n${ rest }`)),
                () => undefined
            ]));
            exports.figure = combinator_1.block(combinator_1.rewrite(exports.segment, combinator_1.verify(combinator_1.trim(combinator_1.match(/^(~{3,})figure[^\S\n]+(\[:\S+?\])[^\S\n]*\n([\s\S]*)\1$/, ([, , param, body]) => rest => combinator_1.bind(combinator_1.sequence([
                combinator_1.line(inline_2.label),
                combinator_1.inits([
                    combinator_1.block(combinator_1.union([
                        table_1.table,
                        codeblock_1.codeblock,
                        mathblock_1.mathblock,
                        graph_1.graph,
                        example_1.example,
                        blockquote_1.blockquote,
                        combinator_1.line(inline_2.media),
                        combinator_1.line(inline_2.shortmedia)
                    ])),
                    line_1.emptyline,
                    combinator_1.block(combinator_1.union([
                        line_1.blankline,
                        util_1.defrag(combinator_1.trim(combinator_1.some(inline_1.inline)))
                    ]))
                ])
            ]), ([label, content, ...caption]) => [
                [typed_dom_1.html('figure', Object.assign({
                        'data-label': label.getAttribute('data-label'),
                        'data-group': label.getAttribute('data-label').split('-', 1)[0]
                    }, label.getAttribute('data-label').match(/^[^-]+-\d.*\.0$/) ? { style: 'display: none;' } : {}), [
                        typed_dom_1.html('div', { class: 'figcontent' }, [content]),
                        typed_dom_1.html('span', { class: 'figindex' }),
                        typed_dom_1.html('figcaption', caption)
                    ])],
                rest
            ])(`${ param }\n${ body.slice(0, -1) }`))), ([el]) => el.matches('[data-group="$"]') ? el.firstElementChild.firstElementChild.matches('.figcontent > .math') && el.lastElementChild.matches('figcaption:empty') : true)));
        },
        {
            '../../../combinator': 20,
            '../../inline': 69,
            '../../source/line': 102,
            '../../util': 106,
            '../blockquote': 50,
            '../codeblock': 51,
            '../mathblock': 62,
            '../table': 67,
            './example': 54,
            './graph': 57,
            'spica/memoization': 9,
            'typed-dom': 13
        }
    ],
    57: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../../combinator');
            require('../../source/unescapable');
            const typed_dom_1 = require('typed-dom');
            exports.segment = combinator_1.lazy(() => combinator_1.block(exports.segment_));
            exports.segment_ = combinator_1.block(combinator_1.union([
                combinator_1.focus(/^(~{3,})graph\/(sequence|flowchart)[^\S\n]*\n(?:[^\n]*\n)*?\1[^\S\n]*(?:\n|$)/, _ => [
                    [],
                    ''
                ]),
                combinator_1.focus(/^(~{3,})graph\/(graphviz)[^\S\n]*([a-z]+[^\S\n]*|)\n(?:[^\n]*\n)*?\1[^\S\n]*(?:\n|$)/, _ => [
                    [],
                    ''
                ])
            ]), false);
            exports.graph = combinator_1.block(combinator_1.rewrite(exports.segment, combinator_1.trim(combinator_1.union([
                combinator_1.match(/^(~{3,})graph\/(sequence|flowchart)[^\S\n]*\n([\s\S]*)\1$/, ([, , name, body]) => rest => [
                    [typed_dom_1.html('pre', { class: `${ name } graph notranslate` }, body.slice(0, -1))],
                    rest
                ]),
                combinator_1.match(/^(~{3,})graph\/(graphviz)[^\S\n]*([a-z]+[^\S\n]*|)\n([\s\S]*)\1$/, ([, , name, engine, body]) => rest => [
                    [typed_dom_1.html('pre', {
                            class: `${ name } graph notranslate`,
                            'data-engine': engine.trim()
                        }, body.slice(0, -1))],
                    rest
                ])
            ]))));
        },
        {
            '../../../combinator': 20,
            '../../source/unescapable': 104,
            'typed-dom': 13
        }
    ],
    58: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../../combinator');
            const inline_1 = require('../../inline');
            const typed_dom_1 = require('typed-dom');
            exports.segment = combinator_1.block(combinator_1.focus(/^(~{3,})[a-z][^\n]*(?:\n|$)(?=[^\S\n]*(?:\n|$))|^(~{3,})(?!~)[a-z][^\n]*\n(?:[^\n]*(?:\n|$))*?\1?[^\S\n]*(?:\n|$)/, _ => [
                [],
                ''
            ]));
            exports.placeholder = combinator_1.block(combinator_1.rewrite(exports.segment, () => [
                [typed_dom_1.html('p', {
                        class: 'invalid',
                        'data-invalid-syntax': 'extension',
                        'data-invalid-type': 'syntax'
                    }, combinator_1.eval(combinator_1.some(inline_1.inline)('Invalid syntax: Extension: Invalid extension name, attribute, or content.')))],
                ''
            ]));
        },
        {
            '../../../combinator': 20,
            '../../inline': 69,
            'typed-dom': 13
        }
    ],
    59: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../combinator');
            const inline_1 = require('../inline');
            const util_1 = require('../util');
            const typed_dom_1 = require('typed-dom');
            exports.heading = combinator_1.block(combinator_1.line(inline_1.index(combinator_1.verify(combinator_1.match(/^(#{1,6})\s+(?=\S)/, ([, {length: level}]) => combinator_1.fmap(util_1.defrag(combinator_1.trim(combinator_1.some(combinator_1.union([
                inline_1.indexer,
                inline_1.inline
            ])))), ns => [typed_dom_1.html(`h${ level }`, ns)])), ([el]) => util_1.hasText(el) && !util_1.hasMedia(el)))));
        },
        {
            '../../combinator': 20,
            '../inline': 69,
            '../util': 106,
            'typed-dom': 13
        }
    ],
    60: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../combinator');
            const typed_dom_1 = require('typed-dom');
            exports.horizontalrule = combinator_1.block(combinator_1.line(combinator_1.focus(/^-{3,}[^\S\n]*(?:\n|$)/, _ => [
                [typed_dom_1.html('hr')],
                ''
            ])));
        },
        {
            '../../combinator': 20,
            'typed-dom': 13
        }
    ],
    61: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../combinator');
            const line_1 = require('../source/line');
            const ulist_1 = require('./ulist');
            const olist_1 = require('./olist');
            const util_1 = require('../util');
            const typed_dom_1 = require('typed-dom');
            const inline_1 = require('../inline');
            exports.ilist = combinator_1.lazy(() => combinator_1.block(combinator_1.fmap(combinator_1.some(combinator_1.union([combinator_1.fmap(combinator_1.inits([
                    combinator_1.line(combinator_1.rewrite(line_1.contentline, combinator_1.verify(combinator_1.surround(/^[-+*](?:\s|$)/, util_1.defrag(combinator_1.trim(combinator_1.some(inline_1.inline))), '', false), rs => !util_1.hasMedia(typed_dom_1.frag(rs))))),
                    combinator_1.indent(combinator_1.union([
                        ulist_1.ulist,
                        olist_1.olist_,
                        exports.ilist
                    ]))
                ]), () => [typed_dom_1.html('li', combinator_1.eval(combinator_1.some(inline_1.inline)('Invalid syntax: UList: Use `-` instead.')))])])), es => [typed_dom_1.html('ul', {
                    class: 'invalid',
                    'data-invalid-syntax': 'list',
                    'data-invalid-type': 'syntax'
                }, es)])));
        },
        {
            '../../combinator': 20,
            '../inline': 69,
            '../source/line': 102,
            '../util': 106,
            './olist': 64,
            './ulist': 68,
            'typed-dom': 13
        }
    ],
    62: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../combinator');
            require('../source/unescapable');
            const typed_dom_1 = require('typed-dom');
            exports.segment = combinator_1.lazy(() => combinator_1.block(exports.segment_));
            exports.segment_ = combinator_1.block(combinator_1.focus(/^(\$\$)(?!\$)([^\n]*)(\n(?:(?!\1[^\S\n]*(?:\n|$))[^\n]*\n){0,99})\1[^\S\n]*(?:\n|$)/, _ => [
                [],
                ''
            ]), false);
            exports.mathblock = combinator_1.block(combinator_1.rewrite(exports.segment, combinator_1.trim(combinator_1.match(/^(\$\$)(?!\$)([^\n]*)(\n[\s\S]*)\1$/, ([, , param, body]) => rest => {
                const el = typed_dom_1.html('div', { class: `math notranslate` }, `$$${ body }$$`);
                if (param.trim() !== '') {
                    void el.classList.add('invalid');
                    void typed_dom_1.define(el, {
                        'data-invalid-syntax': 'math',
                        'data-invalid-type': 'parameter'
                    });
                }
                return [
                    [el],
                    rest
                ];
            }))));
        },
        {
            '../../combinator': 20,
            '../source/unescapable': 104,
            'typed-dom': 13
        }
    ],
    63: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../combinator');
            const line_1 = require('../source/line');
            exports.newline = combinator_1.some(combinator_1.union([line_1.blankline]));
        },
        {
            '../../combinator': 20,
            '../source/line': 102
        }
    ],
    64: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../combinator');
            const line_1 = require('../source/line');
            const ulist_1 = require('./ulist');
            const ilist_1 = require('./ilist');
            const inline_1 = require('../inline');
            const util_1 = require('../util');
            const memoization_1 = require('spica/memoization');
            const typed_dom_1 = require('typed-dom');
            const opener = memoization_1.memoize(pattern => new RegExp(`^${ pattern }(?:\\.\\s|\\.?(?=\\n|$))`));
            exports.olist = combinator_1.block(combinator_1.match(/^(?=([0-9]+|[a-z]+|[A-Z]+)\.(?=\s|$))/, ([, index]) => combinator_1.fmap(combinator_1.some(combinator_1.union([combinator_1.fmap(combinator_1.inits([
                    combinator_1.line(combinator_1.rewrite(line_1.contentline, combinator_1.verify(combinator_1.surround(opener(pattern(type(index))), util_1.defrag(combinator_1.trim(combinator_1.some(inline_1.inline))), '', false), rs => !util_1.hasMedia(typed_dom_1.frag(rs))))),
                    combinator_1.indent(combinator_1.union([
                        ulist_1.ulist,
                        exports.olist_,
                        ilist_1.ilist
                    ]))
                ]), ns => [typed_dom_1.html('li', ulist_1.fillFirstLine(ns))])])), es => [typed_dom_1.html('ol', {
                    start: index,
                    type: type(index)
                }, es)])));
            function type(index) {
                return Number.isInteger(+index) ? '1' : index === index.toLowerCase() ? 'a' : 'A';
            }
            function pattern(type) {
                return type === 'A' ? '[A-Z]+' : type === 'a' ? '[a-z]+' : '[0-9]+';
            }
            exports.olist_ = source => exports.olist(source.replace(/^(?:[0-9]+|[A-Z]+|[a-z]+)(?=\n|$)/, `$&.`));
        },
        {
            '../../combinator': 20,
            '../inline': 69,
            '../source/line': 102,
            '../util': 106,
            './ilist': 61,
            './ulist': 68,
            'spica/memoization': 9,
            'typed-dom': 13
        }
    ],
    65: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../combinator');
            const reference_1 = require('./paragraph/reference');
            const inline_1 = require('../inline');
            const util_1 = require('../util');
            const typed_dom_1 = require('typed-dom');
            exports.paragraph = combinator_1.block(combinator_1.fmap(combinator_1.subsequence([
                combinator_1.some(reference_1.reference),
                util_1.defrag(combinator_1.trim(combinator_1.some(inline_1.inline)))
            ]), ns => [typed_dom_1.html('p', dropTrailingLinebreak(ns))].filter(util_1.hasContent)));
            function dropTrailingLinebreak(ns) {
                return ns.length > 0 && ns[ns.length - 1] instanceof HTMLBRElement ? ns.slice(0, -1) : ns;
            }
        },
        {
            '../../combinator': 20,
            '../inline': 69,
            '../util': 106,
            './paragraph/reference': 66,
            'typed-dom': 13
        }
    ],
    66: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../../combinator');
            const line_1 = require('../../source/line');
            require('../../source/unescapable');
            const inline_1 = require('../../inline');
            const typed_dom_1 = require('typed-dom');
            exports.reference = combinator_1.line(combinator_1.rewrite(line_1.contentline, combinator_1.union([
                combinator_1.match(/^(>+)[0-9a-z]+\s*$/, ([ref, {length: level}]) => rest => [
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
                combinator_1.match(/^(>+)(?!>)\S.*$/, () => () => [
                    [
                        typed_dom_1.html('span', {
                            class: 'invalid',
                            'data-invalid-syntax': 'reference',
                            'data-invalid-type': 'syntax'
                        }, combinator_1.eval(combinator_1.some(inline_1.inline)(`Invalid syntax: Reference: Use lower-case alphanumeric characters in reference syntax.`))),
                        typed_dom_1.html('br')
                    ],
                    ''
                ])
            ])));
        },
        {
            '../../../combinator': 20,
            '../../inline': 69,
            '../../source/line': 102,
            '../../source/unescapable': 104,
            'typed-dom': 13
        }
    ],
    67: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../combinator');
            const line_1 = require('../source/line');
            const inline_1 = require('../inline');
            const util_1 = require('../util');
            const concat_1 = require('spica/concat');
            const typed_dom_1 = require('typed-dom');
            exports.table = combinator_1.lazy(() => combinator_1.block(combinator_1.fmap(combinator_1.sequence([
                row(cell(data), false),
                row(cell(align), true),
                combinator_1.some(row(cell(data), false))
            ]), ([head, as, ...rows]) => {
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
            })));
            const row = (parser, strict) => combinator_1.verify(combinator_1.fmap(combinator_1.line(combinator_1.rewrite(line_1.contentline, combinator_1.trimEnd(combinator_1.surround(/^(?=\|)/, combinator_1.some(combinator_1.union([parser])), /^\|?$/, strict)))), es => [typed_dom_1.html('tr', es)]), ([el]) => !util_1.hasMedia(el));
            const cell = parser => combinator_1.fmap(combinator_1.union([parser]), ns => [typed_dom_1.html('td', ns)]);
            const data = combinator_1.bind(combinator_1.surround(/^\|\s*/, combinator_1.union([combinator_1.some(inline_1.inline, /^\s*(?:\||$)/)]), /^\s*/, false), (ns, rest) => ns.length === 0 && rest === '' ? undefined : [
                util_1.squash(ns),
                rest
            ]);
            const align = combinator_1.surround('|', combinator_1.union([
                combinator_1.focus(/^:-+:/, _ => [
                    [typed_dom_1.text('center')],
                    ''
                ]),
                combinator_1.focus(/^:-+/, _ => [
                    [typed_dom_1.text('left')],
                    ''
                ]),
                combinator_1.focus(/^-+:/, _ => [
                    [typed_dom_1.text('right')],
                    ''
                ]),
                combinator_1.focus(/^-+/, _ => [
                    [typed_dom_1.text('')],
                    ''
                ])
            ]), '');
        },
        {
            '../../combinator': 20,
            '../inline': 69,
            '../source/line': 102,
            '../util': 106,
            'spica/concat': 7,
            'typed-dom': 13
        }
    ],
    68: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../combinator');
            const line_1 = require('../source/line');
            const olist_1 = require('./olist');
            const ilist_1 = require('./ilist');
            const inline_1 = require('../inline');
            const util_1 = require('../util');
            const concat_1 = require('spica/concat');
            const typed_dom_1 = require('typed-dom');
            exports.ulist = combinator_1.lazy(() => combinator_1.block(combinator_1.fmap(combinator_1.some(combinator_1.union([combinator_1.fmap(combinator_1.inits([
                    combinator_1.line(combinator_1.rewrite(line_1.contentline, combinator_1.verify(combinator_1.surround(/^-(?:\s|$)/, util_1.defrag(combinator_1.trim(combinator_1.some(inline_1.inline))), '', false), rs => !util_1.hasMedia(typed_dom_1.frag(rs))))),
                    combinator_1.indent(combinator_1.union([
                        exports.ulist,
                        olist_1.olist_,
                        ilist_1.ilist
                    ]))
                ]), ns => [typed_dom_1.html('li', fillFirstLine(ns))])])), es => [typed_dom_1.html('ul', es)])));
            function fillFirstLine(ns) {
                return [
                    HTMLUListElement,
                    HTMLOListElement
                ].some(E => ns[0] instanceof E) ? concat_1.concat([typed_dom_1.html('br')], ns) : ns;
            }
            exports.fillFirstLine = fillFirstLine;
        },
        {
            '../../combinator': 20,
            '../inline': 69,
            '../source/line': 102,
            '../util': 106,
            './ilist': 61,
            './olist': 64,
            'spica/concat': 7,
            'typed-dom': 13
        }
    ],
    69: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../combinator');
            const annotation_1 = require('./inline/annotation');
            const authority_1 = require('./inline/authority');
            const extension_1 = require('./inline/extension');
            const link_1 = require('./inline/link');
            const ruby_1 = require('./inline/ruby');
            const html_1 = require('./inline/html');
            const comment_1 = require('./inline/comment');
            const insertion_1 = require('./inline/insertion');
            const deletion_1 = require('./inline/deletion');
            const emphasis_1 = require('./inline/emphasis');
            const strong_1 = require('./inline/strong');
            const code_1 = require('./inline/code');
            const math_1 = require('./inline/math');
            const media_1 = require('./inline/media');
            const bracket_1 = require('./inline/bracket');
            const htmlentity_1 = require('./inline/htmlentity');
            const shortmedia_1 = require('./inline/shortmedia');
            const autolink_1 = require('./inline/autolink');
            const text_1 = require('./source/text');
            exports.inline = combinator_1.union([
                annotation_1.annotation,
                authority_1.authority,
                extension_1.extension,
                link_1.link,
                media_1.media,
                ruby_1.ruby,
                html_1.html,
                comment_1.comment,
                insertion_1.insertion,
                deletion_1.deletion,
                emphasis_1.emphasis,
                strong_1.strong,
                code_1.code,
                math_1.math,
                htmlentity_1.htmlentity,
                bracket_1.bracket,
                shortmedia_1.shortmedia,
                autolink_1.autolink,
                text_1.text
            ]);
            var indexer_1 = require('./inline/extension/indexer');
            exports.indexer = indexer_1.indexer;
            exports.index = indexer_1.index;
            var label_1 = require('./inline/extension/label');
            exports.label = label_1.label;
            exports.isGroup = label_1.isGroup;
            exports.isFixed = label_1.isFixed;
            var link_2 = require('./inline/link');
            exports.link = link_2.link;
            var media_2 = require('./inline/media');
            exports.media = media_2.media;
            var uri_1 = require('./inline/autolink/uri');
            exports.uri = uri_1.uri;
            var shortmedia_2 = require('./inline/shortmedia');
            exports.shortmedia = shortmedia_2.shortmedia;
        },
        {
            '../combinator': 20,
            './inline/annotation': 70,
            './inline/authority': 71,
            './inline/autolink': 72,
            './inline/autolink/uri': 77,
            './inline/bracket': 78,
            './inline/code': 79,
            './inline/comment': 80,
            './inline/deletion': 81,
            './inline/emphasis': 82,
            './inline/extension': 83,
            './inline/extension/indexer': 86,
            './inline/extension/label': 87,
            './inline/html': 89,
            './inline/htmlentity': 90,
            './inline/insertion': 91,
            './inline/link': 92,
            './inline/math': 93,
            './inline/media': 94,
            './inline/ruby': 95,
            './inline/shortmedia': 96,
            './inline/strong': 97,
            './source/text': 103
        }
    ],
    70: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../combinator');
            const inline_1 = require('../inline');
            const util_1 = require('../util');
            const typed_dom_1 = require('typed-dom');
            exports.annotation = combinator_1.lazy(() => combinator_1.verify(combinator_1.fmap(util_1.trimNodeEnd(combinator_1.surround('((', util_1.defrag(combinator_1.some(combinator_1.union([inline_1.inline]), '))')), '))')), ns => [typed_dom_1.html('sup', { class: 'annotation' }, ns)]), ([el]) => util_1.hasTightText(el) && !util_1.hasMedia(el) && !util_1.hasAnnotationOrAuthority(el)));
        },
        {
            '../../combinator': 20,
            '../inline': 69,
            '../util': 106,
            'typed-dom': 13
        }
    ],
    71: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../combinator');
            const inline_1 = require('../inline');
            const util_1 = require('../util');
            const typed_dom_1 = require('typed-dom');
            exports.authority = combinator_1.lazy(() => combinator_1.subline(combinator_1.verify(combinator_1.fmap(util_1.trimNodeEnd(combinator_1.surround('[[', util_1.defrag(combinator_1.some(combinator_1.union([inline_1.inline]), /^\n|^]]/)), ']]')), ns => [typed_dom_1.html('sup', { class: 'authority' }, ns)]), ([el]) => util_1.hasTightText(el) && !util_1.hasMedia(el) && !util_1.hasAnnotationOrAuthority(el))));
        },
        {
            '../../combinator': 20,
            '../inline': 69,
            '../util': 106,
            'typed-dom': 13
        }
    ],
    72: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../combinator');
            const uri_1 = require('./autolink/uri');
            const email_1 = require('./autolink/email');
            const channel_1 = require('./autolink/channel');
            const account_1 = require('./autolink/account');
            const hashtag_1 = require('./autolink/hashtag');
            exports.autolink = combinator_1.union([
                uri_1.uri,
                email_1.email,
                channel_1.channel,
                account_1.account,
                hashtag_1.hashtag
            ]);
        },
        {
            '../../combinator': 20,
            './autolink/account': 73,
            './autolink/channel': 74,
            './autolink/email': 75,
            './autolink/hashtag': 76,
            './autolink/uri': 77
        }
    ],
    73: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../../combinator');
            const unescapable_1 = require('../../source/unescapable');
            const util_1 = require('../../util');
            const typed_dom_1 = require('typed-dom');
            exports.account = combinator_1.subline(combinator_1.union([
                combinator_1.verify(combinator_1.focus(/^@[a-zA-Z0-9]+(?:-[0-9a-zA-Z]+)*/, source => [
                    [typed_dom_1.html('a', {
                            class: 'account',
                            rel: 'noopener'
                        }, source)],
                    ''
                ]), (_, rest) => !rest.startsWith('@')),
                combinator_1.focus(/^(?:@[a-zA-Z0-9.+_-]*)+/, util_1.defrag(combinator_1.some(unescapable_1.unescsource)))
            ]));
        },
        {
            '../../../combinator': 20,
            '../../source/unescapable': 104,
            '../../util': 106,
            'typed-dom': 13
        }
    ],
    74: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../../combinator');
            require('../../source/unescapable');
            const account_1 = require('./account');
            const hashtag_1 = require('./hashtag');
            const typed_dom_1 = require('typed-dom');
            exports.channel = combinator_1.subline(combinator_1.rewrite(combinator_1.sequence([
                combinator_1.verify(account_1.account, ([node]) => node instanceof HTMLAnchorElement),
                combinator_1.verify(combinator_1.some(hashtag_1.hashtag_), ns => ns.every(node => node instanceof HTMLAnchorElement))
            ]), source => [
                [typed_dom_1.html('a', {
                        class: 'channel',
                        rel: 'noopener'
                    }, source)],
                ''
            ]));
        },
        {
            '../../../combinator': 20,
            '../../source/unescapable': 104,
            './account': 73,
            './hashtag': 76,
            'typed-dom': 13
        }
    ],
    75: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../../combinator');
            const unescapable_1 = require('../../source/unescapable');
            const util_1 = require('../../util');
            const typed_dom_1 = require('typed-dom');
            exports.email = combinator_1.subline(combinator_1.union([
                combinator_1.verify(combinator_1.focus(/^[a-zA-Z0-9][a-zA-Z0-9.+_-]*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*/, source => [
                    [typed_dom_1.html('a', {
                            class: 'email',
                            href: `mailto:${ source }`,
                            rel: 'noopener'
                        }, source)],
                    ''
                ]), (_, rest) => !rest.startsWith('@')),
                combinator_1.focus(/^[a-zA-Z0-9][a-zA-Z0-9.+_-]*(?:@[a-zA-Z0-9.+_-]*)+/, util_1.defrag(combinator_1.some(unescapable_1.unescsource)))
            ]));
        },
        {
            '../../../combinator': 20,
            '../../source/unescapable': 104,
            '../../util': 106,
            'typed-dom': 13
        }
    ],
    76: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../../combinator');
            const unescapable_1 = require('../../source/unescapable');
            const util_1 = require('../../util');
            const typed_dom_1 = require('typed-dom');
            exports.hashtag = combinator_1.lazy(() => combinator_1.verify(exports.hashtag_, (_, rest) => !rest.startsWith('#')));
            exports.hashtag_ = combinator_1.subline(combinator_1.union([
                combinator_1.match(/^#((?:[a-zA-Z0-9]|[^\x00-\x7F])+)/, ([, tag]) => rest => [
                    [typed_dom_1.html('a', {
                            class: 'hashtag',
                            rel: 'noopener'
                        }, `#${ tag }`)],
                    rest
                ]),
                combinator_1.match(/^#{([^\s#{}]+)}/, ([, tag]) => rest => [
                    [typed_dom_1.html('a', {
                            class: 'hashtag',
                            rel: 'noopener'
                        }, `#${ tag }`)],
                    rest
                ]),
                combinator_1.focus(/^[a-zA-Z0-9]*#+/, util_1.defrag(combinator_1.some(unescapable_1.unescsource)))
            ]));
        },
        {
            '../../../combinator': 20,
            '../../source/unescapable': 104,
            '../../util': 106,
            'typed-dom': 13
        }
    ],
    77: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../../combinator');
            const unescapable_1 = require('../../source/unescapable');
            const link_1 = require('../link');
            const closer = /^[-+*~^,.;:!?]*(?=[\s"`|\[\](){}<>]|\\?(?:\s|$))/;
            exports.uri = combinator_1.subline(combinator_1.union([combinator_1.surround(/^(?=h?ttps?:\/\/[^/?#\s])/, combinator_1.rewrite(combinator_1.some(combinator_1.union([
                    link_1.bracket,
                    combinator_1.some(unescapable_1.unescsource, closer)
                ])), combinator_1.convert(source => `{${ address(source) }${ attribute(source) }}`, link_1.link)), '')]));
            function address(source) {
                return source.startsWith('ttp') ? `h${ source }` : source;
            }
            exports.address = address;
            function attribute(source) {
                return source.startsWith('ttp') ? ' nofollow' : '';
            }
            exports.attribute = attribute;
        },
        {
            '../../../combinator': 20,
            '../../source/unescapable': 104,
            '../link': 92
        }
    ],
    78: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const inline_1 = require('../inline');
            const combinator_1 = require('../../combinator');
            const util_1 = require('../util');
            const typed_dom_1 = require('typed-dom');
            exports.bracket = combinator_1.lazy(() => util_1.defrag(combinator_1.union([
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
            '../../combinator': 20,
            '../inline': 69,
            '../util': 106,
            'typed-dom': 13
        }
    ],
    79: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../combinator');
            const unescapable_1 = require('../source/unescapable');
            const typed_dom_1 = require('typed-dom');
            exports.code = combinator_1.subline(combinator_1.union([
                combinator_1.match(/^(`+)(?!`)([^\n]*?[^`\n])\1(?!`)/, ([whole, , body]) => rest => [
                    [typed_dom_1.html('code', { 'data-src': whole }, body.trim() || body)],
                    rest
                ]),
                combinator_1.focus(/^`+/, combinator_1.some(unescapable_1.unescsource))
            ]));
        },
        {
            '../../combinator': 20,
            '../source/unescapable': 104,
            'typed-dom': 13
        }
    ],
    80: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../combinator');
            require('../source/unescapable');
            const typed_dom_1 = require('typed-dom');
            exports.comment = combinator_1.match(/^<(#+)\s+(\S+(?:\s+\S+)*?)\s+\1>/, ([, , title]) => rest => [
                [typed_dom_1.html('sup', {
                        class: 'comment',
                        title
                    })],
                rest
            ]);
        },
        {
            '../../combinator': 20,
            '../source/unescapable': 104,
            'typed-dom': 13
        }
    ],
    81: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const inline_1 = require('../inline');
            const combinator_1 = require('../../combinator');
            const util_1 = require('../util');
            const typed_dom_1 = require('typed-dom');
            exports.deletion = combinator_1.lazy(() => combinator_1.verify(combinator_1.fmap(combinator_1.validate(/^~~[\s\S]+?~~/, combinator_1.surround('~~', util_1.defrag(combinator_1.some(combinator_1.some(combinator_1.union([inline_1.inline]), '~~'))), '~~')), ns => [typed_dom_1.html('del', ns)]), ([el]) => !util_1.hasInsOrDel(el)));
        },
        {
            '../../combinator': 20,
            '../inline': 69,
            '../util': 106,
            'typed-dom': 13
        }
    ],
    82: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const inline_1 = require('../inline');
            const combinator_1 = require('../../combinator');
            const strong_1 = require('./strong');
            const util_1 = require('../util');
            const typed_dom_1 = require('typed-dom');
            exports.emphasis = combinator_1.lazy(() => combinator_1.verify(combinator_1.fmap(util_1.trimNodeEnd(combinator_1.validate(/^\*\S[\s\S]*?\*/, combinator_1.surround('*', util_1.defrag(combinator_1.some(combinator_1.union([
                strong_1.strong,
                combinator_1.some(inline_1.inline, '*')
            ]))), '*'))), ns => [typed_dom_1.html('em', ns)]), ([el]) => util_1.hasTightText(el)));
        },
        {
            '../../combinator': 20,
            '../inline': 69,
            '../util': 106,
            './strong': 97,
            'typed-dom': 13
        }
    ],
    83: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../combinator');
            const index_1 = require('./extension/index');
            const label_1 = require('./extension/label');
            const data_1 = require('./extension/data');
            const placeholder_1 = require('./extension/placeholder');
            exports.extension = combinator_1.validate('[', combinator_1.union([
                index_1.index,
                label_1.label,
                data_1.data,
                placeholder_1.placeholder
            ]));
        },
        {
            '../../combinator': 20,
            './extension/data': 84,
            './extension/index': 85,
            './extension/label': 87,
            './extension/placeholder': 88
        }
    ],
    84: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const inline_1 = require('../../inline');
            const combinator_1 = require('../../../combinator');
            const unescapable_1 = require('../../source/unescapable');
            const util_1 = require('../../util');
            const typed_dom_1 = require('typed-dom');
            exports.data = combinator_1.lazy(() => combinator_1.fmap(combinator_1.surround('[~', combinator_1.inits([
                combinator_1.focus(/^[a-z]+(?:-[a-z0-9]+)*(?:=[a-z0-9]+(?:-[a-z0-9]+)*)?/, util_1.defrag(combinator_1.some(unescapable_1.unescsource))),
                combinator_1.surround('|', combinator_1.union([util_1.defrag(combinator_1.some(inline_1.inline, ']'))]), '', false)
            ]), ']'), ([data, ...ns]) => [typed_dom_1.html('span', attr(data.textContent), ns)]));
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
            '../../../combinator': 20,
            '../../inline': 69,
            '../../source/unescapable': 104,
            '../../util': 106,
            'typed-dom': 13
        }
    ],
    85: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const inline_1 = require('../../inline');
            const combinator_1 = require('../../../combinator');
            const link_1 = require('../link');
            const indexer_1 = require('./indexer');
            const util_1 = require('../../util');
            const typed_dom_1 = require('typed-dom');
            exports.index = combinator_1.lazy(() => combinator_1.subline(combinator_1.fmap(indexer_1.index(combinator_1.verify(util_1.trimNodeEnd(combinator_1.surround('[#', combinator_1.rewrite(combinator_1.some(inline_1.inline, /^[\n\]]/), combinator_1.convert(query => `[${ query }]{#}`, combinator_1.union([link_1.link]))), ']')), ([el]) => util_1.hasTightText(el) && !util_1.hasMedia(el))), ([el]) => [typed_dom_1.define(el, {
                    id: undefined,
                    href: `#${ el.id }`
                })])));
        },
        {
            '../../../combinator': 20,
            '../../inline': 69,
            '../../util': 106,
            '../link': 92,
            './indexer': 86,
            'typed-dom': 13
        }
    ],
    86: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../../combinator');
            const index_1 = require('./index');
            const typed_dom_1 = require('typed-dom');
            exports.indexer = combinator_1.lazy(() => combinator_1.line(combinator_1.fmap(combinator_1.surround(/^\s+(?=\[#)/, combinator_1.trim(combinator_1.union([index_1.index])), /^(?=\s*$)/), ([el]) => [typed_dom_1.html('small', {
                    class: 'indexer',
                    'data-index': el.getAttribute('href').slice(el.hash.indexOf(':') + 1)
                })])));
            function index(parser) {
                return combinator_1.fmap(parser, ([el]) => [typed_dom_1.define(el, { id: identifier(text(el)) || undefined })]);
            }
            exports.index = index;
            function text(source) {
                const indexer = source.querySelector('.indexer');
                if (indexer)
                    return indexer.getAttribute('data-index');
                const target = source.cloneNode(true);
                void target.querySelectorAll('code[data-src], .math[data-src]').forEach(el => void typed_dom_1.define(el, el.getAttribute('data-src')));
                return target.textContent.trim();
            }
            exports.text = text;
            function identifier(index) {
                return index ? `index:${ index.trim().replace(/\s+/g, '-') }` : '';
            }
        },
        {
            '../../../combinator': 20,
            './index': 85,
            'typed-dom': 13
        }
    ],
    87: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../../combinator');
            require('../../source/unescapable');
            const link_1 = require('../link');
            const util_1 = require('../../util');
            const typed_dom_1 = require('typed-dom');
            exports.label = combinator_1.subline(combinator_1.verify(combinator_1.fmap(combinator_1.surround('[:', combinator_1.focus(/^(?:\$|[a-z]+)(?:(?:-[a-z][0-9a-z]*)+(?:-0(?:\.0)*)?|-[0-9]+(?:\.[0-9]+)*)/, combinator_1.convert(query => `[${ query }]{#}`, combinator_1.union([link_1.link]))), ']'), ([el]) => [typed_dom_1.define(el, {
                    class: 'label',
                    'data-label': el.textContent.split(':').pop(),
                    href: undefined
                })]), ([el]) => util_1.hasTightText(el)));
            function index(label, index) {
                return isFixed(label) ? label.split('-').pop() : increment(index, isGroup(label) ? label.split('-').pop().split('.').length : index.split('.').length);
            }
            exports.index = index;
            function isFixed(label) {
                return label.search(/^(?:\$|[a-z]+)-[0-9]+(?:\.[0-9]+)*$/) === 0;
            }
            exports.isFixed = isFixed;
            function isGroup(label) {
                return label.split('-').pop().search(/^0(?:\.0)*$/) === 0 && !isFixed(label);
            }
            exports.isGroup = isGroup;
            function increment(index, position) {
                if (index === '0' && position > 1)
                    return increment('1', position);
                const ns = index.split('.');
                const idx = [];
                for (let i = 0; i < position; ++i) {
                    void idx.push(i < ns.length ? i + 1 < position ? +ns[i] : +ns[i] + 1 : 1);
                }
                return idx.join('.');
            }
        },
        {
            '../../../combinator': 20,
            '../../source/unescapable': 104,
            '../../util': 106,
            '../link': 92,
            'typed-dom': 13
        }
    ],
    88: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const inline_1 = require('../../inline');
            const combinator_1 = require('../../../combinator');
            const typed_dom_1 = require('typed-dom');
            exports.placeholder = combinator_1.lazy(() => combinator_1.subline(combinator_1.fmap(combinator_1.surround('[', combinator_1.validate(/^[\^](?!\])/, combinator_1.some(combinator_1.union([inline_1.inline]), /^[\n\]]/)), ']'), () => [typed_dom_1.html('span', {
                    class: 'invalid',
                    'data-invalid-syntax': 'extension',
                    'data-invalid-type': 'syntax'
                }, combinator_1.eval(combinator_1.some(inline_1.inline)(`Invalid syntax: Extension: Invalid flag.`)))])));
        },
        {
            '../../../combinator': 20,
            '../../inline': 69,
            'typed-dom': 13
        }
    ],
    89: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const inline_1 = require('../inline');
            const combinator_1 = require('../../combinator');
            const unescapable_1 = require('../source/unescapable');
            const escapable_1 = require('../source/escapable');
            const char_1 = require('../source/char');
            const util_1 = require('../util');
            const typed_dom_1 = require('typed-dom');
            const attributes = {
                bdo: {
                    dir: Object.freeze([
                        'ltr',
                        'rtl'
                    ])
                }
            };
            exports.html = combinator_1.lazy(() => combinator_1.validate(/^<[a-z]+[ >]/, combinator_1.union([
                combinator_1.match(/^(?=<(sup|sub|small|bdi|bdo)(?: [^\n]*?)?>)/, ([, tag]) => combinator_1.verify(combinator_1.fmap(combinator_1.sequence([
                    util_1.dup(combinator_1.surround(`<${ tag }`, combinator_1.some(util_1.defrag(combinator_1.union([exports.attribute]))), /^ ?>/, false)),
                    util_1.dup(combinator_1.surround(``, util_1.trimNode(util_1.defrag(combinator_1.some(combinator_1.union([inline_1.inline]), `</${ tag }>`))), `</${ tag }>`))
                ]), ([attrs, contents]) => [typed_dom_1.html(tag, attr(attributes[tag], attrs.map(t => t.textContent), new Set(), 'html'), contents)]), ([el]) => !el.matches('.invalid') && util_1.hasTightText(el))),
                combinator_1.match(/^(?=<(wbr)(?: [^\n]*?)?>)/, ([, tag]) => combinator_1.verify(combinator_1.fmap(combinator_1.sequence([util_1.dup(combinator_1.surround(`<${ tag }`, combinator_1.some(util_1.defrag(combinator_1.union([exports.attribute]))), /^ ?>/, false))]), ([attrs]) => [typed_dom_1.html(tag, attr(attributes[tag], attrs.map(t => t.textContent), new Set(), 'html'), [])]), ([el]) => !el.matches('.invalid'))),
                combinator_1.rewrite(combinator_1.sequence([util_1.dup(combinator_1.surround(/<[a-z]+/, combinator_1.some(util_1.defrag(combinator_1.union([exports.attribute]))), /^ ?\/?>/, false))]), source => [
                    [typed_dom_1.html('span', {
                            class: 'invalid',
                            'data-invalid-syntax': 'html',
                            'data-invalid-type': 'syntax'
                        }, source)],
                    ''
                ])
            ])));
            exports.attribute = combinator_1.subline(combinator_1.verify(combinator_1.surround(' ', combinator_1.inits([
                util_1.defrag(combinator_1.focus(/^[a-z]+(?:-[a-z]+)*/, combinator_1.some(unescapable_1.unescsource))),
                char_1.char('='),
                util_1.defrag(combinator_1.rewrite(combinator_1.surround('"', combinator_1.some(escapable_1.escsource, '"'), '"', false), combinator_1.some(escapable_1.escsource)))
            ]), ''), ts => ts.length !== 2));
            function attr(spec, params, classes, syntax) {
                const result = {};
                const attrs = new Map(params.map(arg => [
                    arg.split('=', 1)[0],
                    arg.includes('=') ? arg.slice(arg.split('=', 1)[0].length + 2, -1) : undefined
                ]));
                if (!spec && params.length > 0 || attrs.size !== params.length) {
                    void classes.add('invalid');
                }
                if (spec) {
                    if (!Object.entries(spec).filter(([, v]) => Object.isFrozen(v)).every(([k]) => attrs.has(k))) {
                        void classes.add('invalid');
                    }
                    for (const [key, value] of attrs) {
                        spec.hasOwnProperty(key) && spec[key].includes(value) ? result[key] = value : void classes.add('invalid');
                    }
                }
                if (classes.has('invalid')) {
                    result.class = [...classes].join(' ');
                    result['data-invalid-syntax'] = syntax;
                    result['data-invalid-type'] = 'parameter';
                }
                return result;
            }
            exports.attr = attr;
        },
        {
            '../../combinator': 20,
            '../inline': 69,
            '../source/char': 100,
            '../source/escapable': 101,
            '../source/unescapable': 104,
            '../util': 106,
            'typed-dom': 13
        }
    ],
    90: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../combinator');
            require('../source/unescapable');
            const typed_dom_1 = require('typed-dom');
            exports.htmlentity = combinator_1.subline(combinator_1.focus(/^&(?:[0-9a-z]+|#[0-9]{1,8}|#x[0-9a-f]{1,8});/i, entity => [
                [typed_dom_1.text(parse(entity))],
                ''
            ]));
            const parser = typed_dom_1.html('span');
            function parse(str) {
                parser.innerHTML = str;
                return parser.textContent;
            }
        },
        {
            '../../combinator': 20,
            '../source/unescapable': 104,
            'typed-dom': 13
        }
    ],
    91: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const inline_1 = require('../inline');
            const combinator_1 = require('../../combinator');
            const util_1 = require('../util');
            const typed_dom_1 = require('typed-dom');
            exports.insertion = combinator_1.lazy(() => combinator_1.verify(combinator_1.fmap(combinator_1.validate(/^\+\+[\s\S]+?\+\+/, combinator_1.surround('++', util_1.defrag(combinator_1.some(combinator_1.some(combinator_1.union([inline_1.inline]), '++'))), '++')), ns => [typed_dom_1.html('ins', ns)]), ([el]) => !util_1.hasInsOrDel(el)));
        },
        {
            '../../combinator': 20,
            '../inline': 69,
            '../util': 106,
            'typed-dom': 13
        }
    ],
    92: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const inline_1 = require('../inline');
            const combinator_1 = require('../../combinator');
            const unescapable_1 = require('../source/unescapable');
            const html_1 = require('./html');
            const util_1 = require('../util');
            const uri_1 = require('../string/uri');
            const concat_1 = require('spica/concat');
            const typed_dom_1 = require('typed-dom');
            exports.attributes = { nofollow: [undefined] };
            exports.link = combinator_1.lazy(() => combinator_1.subline(combinator_1.bind(combinator_1.verify(combinator_1.fmap(combinator_1.validate(/^(?:\[.*?\])?{.+?}/, combinator_1.tails([
                util_1.wrap(combinator_1.surround('[', util_1.trimNodeEnd(util_1.defrag(combinator_1.some(combinator_1.union([inline_1.inline]), /^[\n\]]/))), ']', false)),
                util_1.wrap(combinator_1.surround('{', combinator_1.inits([
                    exports.uri,
                    combinator_1.some(util_1.defrag(html_1.attribute))
                ]), /^ ?}/))
            ])), ns => concat_1.concat([...Array(2 - ns.length)].map(() => typed_dom_1.frag()), ns)), ([text]) => {
                if (util_1.hasMedia(text)) {
                    if (text.firstChild && text.firstChild.firstChild && text.firstChild.firstChild === text.querySelector('a > .media:last-child')) {
                        void text.replaceChild(text.firstChild.firstChild, text.firstChild);
                    }
                    if (text.childNodes.length !== 1)
                        return false;
                    if (!text.firstElementChild.matches('.media:last-child'))
                        return false;
                } else {
                    if (text.childNodes.length > 0 && !util_1.hasTightText(text))
                        return false;
                    if (util_1.hasLink(text))
                        return false;
                }
                return true;
            }), ([text, param], rest) => {
                const [INSECURE_URL, ...params] = [...param.childNodes].map(t => t.textContent);
                const path = uri_1.sanitize(INSECURE_URL);
                if (path === '' && INSECURE_URL !== '')
                    return;
                const el = typed_dom_1.html('a', {
                    href: path,
                    rel: `noopener${ params.includes('nofollow') ? ' nofollow noreferrer' : '' }`
                }, util_1.hasContent(text) ? text.childNodes : uri_1.sanitize(uri_1.decode(INSECURE_URL || '.')).replace(/^tel:/, '').replace(/^h(?=ttps?:\/\/)/, params.includes('nofollow') ? '' : 'h'));
                if (el.textContent.trim().match(/^[#@]/))
                    return;
                if (el.protocol === 'tel:' && el.getAttribute('href') !== `tel:${ el.innerHTML.replace(/-(?=[0-9])/g, '') }`)
                    return;
                if ((el.origin !== window.location.origin || util_1.hasMedia(el)) && el.protocol !== 'tel:') {
                    void el.setAttribute('target', '_blank');
                }
                return [
                    [typed_dom_1.define(el, html_1.attr(exports.attributes, params, new Set(el.classList), 'link'))],
                    rest
                ];
            })));
            exports.uri = combinator_1.subline(util_1.defrag(combinator_1.match(/^ ?(?! )/, ([flag]) => combinator_1.some(combinator_1.union([
                exports.bracket,
                unescapable_1.unescsource
            ]), flag === ' ' ? /^\s/ : /^[\s}]/))));
            exports.bracket = combinator_1.lazy(() => combinator_1.subline(combinator_1.union([
                combinator_1.fmap(combinator_1.surround('(', combinator_1.some(combinator_1.union([
                    exports.bracket,
                    unescapable_1.unescsource
                ]), /^[\s\)]/), ')', false), ts => [
                    typed_dom_1.text('('),
                    ...ts,
                    typed_dom_1.text(')')
                ]),
                combinator_1.fmap(combinator_1.surround('[', combinator_1.some(combinator_1.union([
                    exports.bracket,
                    unescapable_1.unescsource
                ]), /^[\s\]]/), ']', false), ts => [
                    typed_dom_1.text('['),
                    ...ts,
                    typed_dom_1.text(']')
                ]),
                combinator_1.fmap(combinator_1.surround('{', combinator_1.some(combinator_1.union([
                    exports.bracket,
                    unescapable_1.unescsource
                ]), /^[\s\}]/), '}', false), ts => [
                    typed_dom_1.text('{'),
                    ...ts,
                    typed_dom_1.text('}')
                ]),
                combinator_1.fmap(combinator_1.surround('<', combinator_1.some(combinator_1.union([
                    exports.bracket,
                    unescapable_1.unescsource
                ]), /^[\s\>]/), '>', false), ts => [
                    typed_dom_1.text('<'),
                    ...ts,
                    typed_dom_1.text('>')
                ]),
                combinator_1.fmap(combinator_1.surround('"', combinator_1.some(combinator_1.union([
                    exports.bracket,
                    unescapable_1.unescsource
                ]), /^[\s\"]/), '"', false), ts => [
                    typed_dom_1.text('"'),
                    ...ts,
                    typed_dom_1.text('"')
                ])
            ])));
        },
        {
            '../../combinator': 20,
            '../inline': 69,
            '../source/unescapable': 104,
            '../string/uri': 105,
            '../util': 106,
            './html': 89,
            'spica/concat': 7,
            'typed-dom': 13
        }
    ],
    93: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../combinator');
            const escapable_1 = require('../source/escapable');
            const util_1 = require('../util');
            const cache_1 = require('spica/cache');
            const typed_dom_1 = require('typed-dom');
            exports.cache = new cache_1.Cache(20);
            exports.math = combinator_1.subline(combinator_1.verify(combinator_1.rewrite(combinator_1.surround('${', combinator_1.some(combinator_1.union([escapable_1.escsource]), /^}\$|^\n/), '}$'), combinator_1.convert(source => `\${${ source.slice(2, -2).trim() }}$`, source => [
                exports.cache.has(source) ? [exports.cache.get(source).cloneNode(true)] : [typed_dom_1.html('span', {
                        class: 'math notranslate',
                        'data-src': source
                    }, source)],
                ''
            ])), ([el]) => util_1.hasText(typed_dom_1.frag(el.textContent.slice(2, -2)))));
        },
        {
            '../../combinator': 20,
            '../source/escapable': 101,
            '../util': 106,
            'spica/cache': 6,
            'typed-dom': 13
        }
    ],
    94: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../combinator');
            const text_1 = require('../source/text');
            require('../source/unescapable');
            const link_1 = require('./link');
            const html_1 = require('./html');
            const uri_1 = require('../string/uri');
            const util_1 = require('../util');
            const cache_1 = require('spica/cache');
            const concat_1 = require('spica/concat');
            const typed_dom_1 = require('typed-dom');
            exports.cache = new cache_1.Cache(10);
            exports.media = combinator_1.subline(combinator_1.bind(combinator_1.fmap(combinator_1.verify(combinator_1.fmap(combinator_1.surround(/^!(?=(?:\[.*?\])?{.+?})/, combinator_1.tails([
                util_1.dup(combinator_1.surround('[', util_1.trimNodeEnd(util_1.defrag(combinator_1.some(combinator_1.union([text_1.text]), /^[\n\]]/))), ']', false)),
                util_1.dup(combinator_1.surround('{', combinator_1.inits([
                    link_1.uri,
                    combinator_1.some(util_1.defrag(html_1.attribute))
                ]), /^ ?}/))
            ]), ''), ns => concat_1.concat([...Array(2 - ns.length)].map(() => []), ns)), ([[text = typed_dom_1.text('')]]) => text.textContent === '' || util_1.hasTightText(text)), ([[text = typed_dom_1.text('')], param]) => [
                text.textContent,
                ...param.map(t => t.textContent)
            ]), ([text, INSECURE_URL, ...params], rest) => {
                const path = uri_1.sanitize(INSECURE_URL.trim());
                if (path === '' && INSECURE_URL !== '')
                    return;
                const uri = new URL(path, window.location.href);
                if (uri.protocol === 'tel:')
                    return;
                const el = exports.cache.has(uri.href) ? exports.cache.get(uri.href).cloneNode(true) : typed_dom_1.html('img', {
                    class: 'media',
                    'data-src': path,
                    alt: text
                });
                if (exports.cache.has(uri.href) && el.hasAttribute('alt')) {
                    void typed_dom_1.define(el, { alt: text });
                }
                void typed_dom_1.define(el, html_1.attr(link_1.attributes, params, new Set(el.classList), 'media'));
                return el.matches('img') ? combinator_1.fmap(link_1.link, ([link]) => [typed_dom_1.define(link, [el])])(`{ ${ INSECURE_URL }${ params.map(p => ' ' + p).join('') } }${ rest }`) : [
                    [el],
                    rest
                ];
            }));
        },
        {
            '../../combinator': 20,
            '../source/text': 103,
            '../source/unescapable': 104,
            '../string/uri': 105,
            '../util': 106,
            './html': 89,
            './link': 92,
            'spica/cache': 6,
            'spica/concat': 7,
            'typed-dom': 13
        }
    ],
    95: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../combinator');
            const htmlentity_1 = require('./htmlentity');
            const text_1 = require('../source/text');
            const util_1 = require('../util');
            const concat_1 = require('spica/concat');
            const typed_dom_1 = require('typed-dom');
            exports.ruby = combinator_1.subline(combinator_1.fmap(combinator_1.fmap(combinator_1.verify(combinator_1.fmap(combinator_1.validate(/^\[.+?\]\(.+?\)/, combinator_1.sequence([
                combinator_1.fmap(combinator_1.verify(util_1.trimNodeEnd(combinator_1.surround('[', util_1.defrag(combinator_1.some(combinator_1.union([
                    htmlentity_1.htmlentity,
                    text_1.text
                ]), /^[\n\]]/)), ']')), ([text]) => util_1.hasTightText(text)), ([text]) => [text.textContent.split(/\s/).map(typed_dom_1.text)]),
                combinator_1.fmap(combinator_1.verify(combinator_1.surround('(', util_1.defrag(combinator_1.some(combinator_1.union([
                    htmlentity_1.htmlentity,
                    text_1.text
                ]), /^[\n)]/)), ')'), ([text]) => util_1.hasText(text)), ([text]) => [text.textContent.split(/\s/).map(typed_dom_1.text)])
            ])), ([text, ruby]) => text.length === 1 && text.length < ruby.length ? [
                [...util_1.stringify(text)].map(typed_dom_1.text),
                ruby
            ] : [
                text,
                ruby
            ]), ([text, ruby]) => text.length >= ruby.length), ([text, ruby]) => text.reduce((acc, _, i) => concat_1.concat(concat_1.concat(acc, [text[i]]), i < ruby.length && ruby[i].textContent.trim() !== '' ? [
                typed_dom_1.html('rp', '('),
                typed_dom_1.html('rt', [ruby[i]]),
                typed_dom_1.html('rp', ')')
            ] : [typed_dom_1.html('rt')]), [])), ns => [typed_dom_1.html('ruby', ns)]));
        },
        {
            '../../combinator': 20,
            '../source/text': 103,
            '../util': 106,
            './htmlentity': 90,
            'spica/concat': 7,
            'typed-dom': 13
        }
    ],
    96: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../combinator');
            const uri_1 = require('./autolink/uri');
            const media_1 = require('./media');
            exports.shortmedia = combinator_1.subline(combinator_1.union([combinator_1.surround(/^!(?=h?ttps?:\/\/[^/?#\s])/, combinator_1.rewrite(uri_1.uri, combinator_1.convert(source => `!{${ uri_1.address(source) }${ uri_1.attribute(source) }}`, media_1.media)), '')]));
        },
        {
            '../../combinator': 20,
            './autolink/uri': 77,
            './media': 94
        }
    ],
    97: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const inline_1 = require('../inline');
            const combinator_1 = require('../../combinator');
            const util_1 = require('../util');
            const typed_dom_1 = require('typed-dom');
            exports.strong = combinator_1.lazy(() => combinator_1.verify(combinator_1.fmap(util_1.trimNodeEnd(combinator_1.validate(/^\*\*\S[\s\S]*?\*\*/, combinator_1.surround('**', util_1.defrag(combinator_1.some(combinator_1.union([inline_1.inline]), '**')), '**'))), ns => [typed_dom_1.html('strong', ns)]), ([el]) => util_1.hasTightText(el)));
        },
        {
            '../../combinator': 20,
            '../inline': 69,
            '../util': 106,
            'typed-dom': 13
        }
    ],
    98: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../combinator');
            const ja_1 = require('./locale/ja');
            const typed_dom_1 = require('typed-dom');
            function localize(block) {
                return combinator_1.fmap(block, es => {
                    void es.forEach(el => void el.querySelectorAll('.linebreak').forEach(el => {
                        if (!el.firstChild || el.firstElementChild)
                            return;
                        if (!check(el))
                            return;
                        void el.replaceChild(typed_dom_1.html('wbr'), el.firstChild);
                    }));
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
                switch (node.nodeType) {
                case 3:
                    return node.textContent;
                case 1:
                    switch (node.tagName) {
                    case 'RUBY':
                        return [...node.childNodes].reduceRight((str, node) => {
                            if (str)
                                return str;
                            if (node.nodeType === 3)
                                return node.textContent;
                            switch (node.tagName) {
                            case 'RT':
                            case 'RP':
                                return '';
                            default:
                                return node.textContent;
                            }
                        }, '');
                    default:
                        return node.textContent;
                    }
                default:
                    return node.textContent;
                }
            }
        },
        {
            '../combinator': 20,
            './locale/ja': 99,
            'typed-dom': 13
        }
    ],
    99: [
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
    100: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const typed_dom_1 = require('typed-dom');
            function char(char) {
                return source => {
                    if (source.length === 0)
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
                };
            }
            exports.char = char;
            ;
        },
        { 'typed-dom': 13 }
    ],
    101: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const typed_dom_1 = require('typed-dom');
            const separator = /\s|(?=[\x00-\x7F])[^a-zA-Z0-9\s]/;
            exports.escsource = source => {
                if (source.length === 0)
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
                        switch (source[1]) {
                        case '\n':
                            return [
                                [typed_dom_1.text(source.slice(0, 1))],
                                source.slice(1)
                            ];
                        default:
                            return [
                                [typed_dom_1.text(source.slice(0, 2))],
                                source.slice(2)
                            ];
                        }
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
            };
        },
        { 'typed-dom': 13 }
    ],
    102: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../../combinator');
            exports.anyline = combinator_1.line(_ => [
                [],
                ''
            ], false);
            exports.emptyline = combinator_1.line(s => s.trim() === '' ? [
                [],
                ''
            ] : undefined, false);
            const invisible = /^(?:\\?\s)*$/;
            exports.blankline = combinator_1.line(s => s.search(invisible) === 0 ? [
                [],
                ''
            ] : undefined, false);
            exports.contentline = combinator_1.line(s => s.search(invisible) !== 0 ? [
                [],
                ''
            ] : undefined, false);
        },
        { '../../combinator': 20 }
    ],
    103: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const typed_dom_1 = require('typed-dom');
            exports.separator = /\s|(?=[\x00-\x7F])[^a-zA-Z0-9\s]|[a-zA-Z0-9][a-zA-Z0-9.+_-]*@[a-zA-Z0-9]|[a-zA-Z0-9]+#/;
            const next = /[\S\n]|$/;
            exports.text = source => {
                if (source.length === 0)
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
                        case '\n':
                            return [
                                [typed_dom_1.html('br')],
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
                            [typed_dom_1.html('span', { class: 'linebreak' }, ' ')],
                            source.slice(1)
                        ];
                    default:
                        const i = source.slice(0, 2).trim() === '' ? source.search(next) : 0;
                        return i === source.length || source[i] === '\n' ? [
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
            };
        },
        { 'typed-dom': 13 }
    ],
    104: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const text_1 = require('./text');
            const typed_dom_1 = require('typed-dom');
            exports.unescsource = source => {
                if (source.length === 0)
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
            };
        },
        {
            './text': 103,
            'typed-dom': 13
        }
    ],
    105: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const typed_dom_1 = require('typed-dom');
            function sanitize(uri) {
                uri = uri.replace(/\s/g, encodeURI);
                return isAcceptedProtocol(uri) ? uri : '';
            }
            exports.sanitize = sanitize;
            function decode(uri) {
                try {
                    uri = decodeURI(uri);
                } finally {
                    return uri.replace(/\s/g, encodeURIComponent);
                }
            }
            exports.decode = decode;
            const parser = typed_dom_1.html('a');
            function isAcceptedProtocol(uri) {
                parser.setAttribute('href', uri);
                return [
                    'http:',
                    'https:',
                    'tel:'
                ].includes(parser.protocol);
            }
        },
        { 'typed-dom': 13 }
    ],
    106: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = require('../combinator');
            const inline_1 = require('./inline');
            const typed_dom_1 = require('typed-dom');
            function dup(parser) {
                return combinator_1.fmap(parser, ns => [ns]);
            }
            exports.dup = dup;
            function wrap(parser) {
                return combinator_1.fmap(parser, ns => [typed_dom_1.frag(ns)]);
            }
            exports.wrap = wrap;
            function defrag(parser) {
                return combinator_1.fmap(parser, squash);
            }
            exports.defrag = defrag;
            function trimNode(parser) {
                return trimNode_(parser, 'both');
            }
            exports.trimNode = trimNode;
            function trimNodeStart(parser) {
                return trimNode_(parser, 'start');
            }
            exports.trimNodeStart = trimNodeStart;
            function trimNodeEnd(parser) {
                return trimNode_(parser, 'end');
            }
            exports.trimNodeEnd = trimNodeEnd;
            function trimNode_(parser, mode) {
                if (mode === 'both')
                    return trimNode_(trimNode_(parser, 'start'), 'end');
                return combinator_1.fmap(parser, ns => {
                    if (ns.length === 0)
                        return ns;
                    const node = ns[mode === 'start' ? 0 : ns.length - 1];
                    switch (node.nodeType) {
                    case 3:
                        const text = node.textContent;
                        if (text === '')
                            return ns;
                        switch (mode) {
                        case 'start':
                            node.textContent = text[0].trim() === '' ? text.slice(1) : text;
                            break;
                        case 'end':
                            node.textContent = text[text.length - 1].trim() === '' ? text.slice(0, -1) : text;
                            break;
                        }
                        break;
                    case 1:
                        switch (true) {
                        case node.tagName === 'BR':
                        case node.className === 'linebreak':
                            switch (mode) {
                            case 'start':
                                void ns.shift();
                                break;
                            case 'end':
                                void ns.pop();
                                break;
                            }
                            break;
                        }
                        break;
                    }
                    return ns;
                });
            }
            function squash(nodes) {
                const acc = [];
                void nodes.reduce((prev, curr) => {
                    if (curr.nodeType === 3) {
                        if (curr.textContent === '')
                            return prev;
                        if (prev && prev.nodeType === 3)
                            return prev.textContent += curr.textContent, prev;
                    }
                    curr = curr.nodeType === 3 ? curr.cloneNode() : curr;
                    void acc.push(curr);
                    return curr;
                }, undefined);
                return acc;
            }
            exports.squash = squash;
            function stringify(nodes) {
                return nodes.reduce((acc, node) => acc + node.textContent, '');
            }
            exports.stringify = stringify;
            function hasContent(node) {
                return hasText(node) || hasMedia(node);
            }
            exports.hasContent = hasContent;
            function hasMedia(node) {
                return !!node.querySelector('.media');
            }
            exports.hasMedia = hasMedia;
            function hasLink(node) {
                return !!node.querySelector('a, .annotation, .authority');
            }
            exports.hasLink = hasLink;
            function hasInsOrDel(node) {
                return !!node.querySelector('ins, del');
            }
            exports.hasInsOrDel = hasInsOrDel;
            function hasAnnotationOrAuthority(node) {
                return !!node.querySelector('.annotation, .authority');
            }
            exports.hasAnnotationOrAuthority = hasAnnotationOrAuthority;
            function hasText(node) {
                return node.textContent.trim() !== '';
            }
            exports.hasText = hasText;
            function hasTightText(node) {
                return hasText(node) && node.textContent === node.textContent.trim() && (!node.firstChild || node.firstChild.nodeType !== 1 || node.tagName !== 'BR') && (!node.firstChild || node.firstChild.nodeType !== 1 || node.tagName !== 'BR');
            }
            exports.hasTightText = hasTightText;
            function suppress(el) {
                void [...el.children].filter(el => !el.matches('blockquote, .example')).forEach(el => {
                    if (el.matches('[id]')) {
                        void el.removeAttribute('id');
                    }
                    if (el.matches('figure[data-label]:not([data-index])') && !inline_1.isFixed(el.getAttribute('data-label'))) {
                        void el.setAttribute('data-label', el.getAttribute('data-label').split('-')[0] + '-0');
                    }
                    void el.querySelectorAll('[id]').forEach(el => void el.removeAttribute('id'));
                    void el.querySelectorAll('a[href^="#"]').forEach(el => void el.setAttribute('onclick', 'return false;'));
                });
                return el;
            }
            exports.suppress = suppress;
        },
        {
            '../combinator': 20,
            './inline': 69,
            'typed-dom': 13
        }
    ],
    107: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var render_1 = require('./renderer/render');
            exports.render = render_1.render;
        },
        { './renderer/render': 108 }
    ],
    108: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const code_1 = require('./render/code');
            const math_1 = require('./render/math');
            const media_1 = require('./render/media');
            const graph_1 = require('./render/graph');
            function render(target, opts = {}) {
                opts = Object.assign({
                    code: code_1.code,
                    math: math_1.math,
                    media: {},
                    graph: {}
                }, opts);
                try {
                    switch (true) {
                    case target.style.display === 'none':
                    case target.matches('.invalid'):
                        return;
                    case !!opts.code && target.matches('pre.code') && target.children.length === 0:
                        return void opts.code(target);
                    case !!opts.math && target.matches('.math') && target.children.length === 0:
                        return void opts.math(target);
                    case target.matches('a > .media:not(img)'):
                        return void target.parentElement.parentElement.replaceChild(target, target.parentElement);
                    case !!opts.media && target.matches('img.media:not([src])[data-src]'): {
                            const el = media_1.media(target, opts.media);
                            if (!el)
                                return;
                            const scope = target.matches('a > .media') && !el.matches('img') ? target.closest('a') : target;
                            return void scope.parentElement.replaceChild(el, scope);
                        }
                    case !!opts.graph && target.matches('.graph'):
                        return void graph_1.graph(target, opts.graph);
                    case target.childNodes.length === 0:
                    case target.matches('pre, .math, .graph'):
                        return;
                    default:
                        return void target.querySelectorAll('img.media:not([src])[data-src], a > .media:not(img), pre.code, .graph, .math').forEach(el => void render(el, opts));
                    }
                } catch (reason) {
                    console.error(reason);
                }
            }
            exports.render = render;
        },
        {
            './render/code': 109,
            './render/graph': 110,
            './render/math': 114,
            './render/media': 115
        }
    ],
    109: [
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
    110: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const sequence_1 = require('./graph/sequence');
            const flowchart_1 = require('./graph/flowchart');
            const graphviz_1 = require('./graph/graphviz');
            function graph(target, opts) {
                opts = Object.assign({
                    sequence: sequence_1.sequence,
                    flowchart: flowchart_1.flowchart,
                    graphviz: graphviz_1.graphviz
                }, opts);
                switch (true) {
                case !!opts.sequence && target.matches('.sequence') && target.children.length === 0:
                    return void opts.sequence(target);
                case !!opts.flowchart && target.matches('.flowchart') && target.children.length === 0:
                    return void opts.flowchart(target);
                case !!opts.graphviz && target.matches('.graphviz') && target.children.length === 0:
                    return void opts.graphviz(target);
                default:
                    return;
                }
            }
            exports.graph = graph;
        },
        {
            './graph/flowchart': 111,
            './graph/graphviz': 112,
            './graph/sequence': 113
        }
    ],
    111: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const typed_dom_1 = require('typed-dom');
            function flowchart(target) {
                if (typeof window.flowchart === 'undefined')
                    return;
                void requestAnimationFrame(() => {
                    const observer = new MutationObserver(() => {
                        void observer.disconnect();
                        void target.querySelectorAll('svg a').forEach(el => void el.removeAttribute('href'));
                        const svg = target.querySelector('svg');
                        svg.style.maxHeight = `${ Math.round(parseFloat(svg.getAttribute('height')) * svg.clientWidth / parseFloat(svg.getAttribute('width'))) }`;
                    });
                    const diagram = window.flowchart.parse(target.textContent);
                    void typed_dom_1.define(target, []);
                    void diagram.drawSVG(target);
                    void observer.observe(target, { childList: true });
                    void target.querySelectorAll('svg a').forEach(el => void el.removeAttribute('href'));
                    const svg = target.querySelector('svg');
                    svg.style.maxHeight = `${ Math.round(parseFloat(svg.getAttribute('height')) * svg.clientWidth / parseFloat(svg.getAttribute('width'))) }`;
                });
            }
            exports.flowchart = flowchart;
        },
        { 'typed-dom': 13 }
    ],
    112: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const typed_dom_1 = require('typed-dom');
            let viz;
            function graphviz(target) {
                if (typeof Viz === 'undefined')
                    return;
                void requestAnimationFrame(() => {
                    viz = new Viz();
                    viz.renderSVGElement(target.textContent, { engine: target.getAttribute('data-engine') || 'dot' }).then(el => {
                        void typed_dom_1.define(target, [el]);
                        void target.querySelectorAll('svg a').forEach(el => void el.removeAttribute('href'));
                        const svg = target.querySelector('svg');
                        svg.style.maxHeight = `${ Math.round(parseFloat(svg.getAttribute('height')) * svg.clientWidth / parseFloat(svg.getAttribute('width'))) }pt`;
                    }).catch(error => {
                        viz = new Viz();
                        console.error(error);
                    });
                });
            }
            exports.graphviz = graphviz;
        },
        { 'typed-dom': 13 }
    ],
    113: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const typed_dom_1 = require('typed-dom');
            function sequence(target) {
                if (typeof Diagram === 'undefined')
                    return;
                void requestAnimationFrame(() => {
                    const observer = new MutationObserver(() => {
                        void observer.disconnect();
                        void target.querySelectorAll('svg a').forEach(el => void el.removeAttribute('href'));
                    });
                    const diagram = Diagram.parse(target.textContent);
                    void typed_dom_1.define(target, []);
                    void observer.observe(target, { childList: true });
                    void diagram.drawSVG(target, { theme: 'simple' });
                });
            }
            exports.sequence = sequence;
        },
        { 'typed-dom': 13 }
    ],
    114: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const math_1 = require('../../parser/inline/math');
            const typed_dom_1 = require('typed-dom');
            void MathJax.Hub.Config({
                tex2jax: {
                    inlineMath: [[
                            '${',
                            '}$'
                        ]],
                    displayMath: [[
                            '$$',
                            '$$'
                        ]]
                }
            });
            function math(target) {
                const source = target.textContent;
                return math_1.cache.has(source) ? void typed_dom_1.define(target, math_1.cache.get(source).cloneNode(true).childNodes) : void queue(target, () => target.matches('span') ? void math_1.cache.set(source, target.cloneNode(true)) : undefined);
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
        {
            '../../parser/inline/math': 93,
            'typed-dom': 13
        }
    ],
    115: [
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
            './media/audio': 116,
            './media/gist': 117,
            './media/image': 118,
            './media/pdf': 119,
            './media/slideshare': 120,
            './media/twitter': 121,
            './media/video': 122,
            './media/youtube': 123
        }
    ],
    116: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const media_1 = require('../../../parser/inline/media');
            const typed_dom_1 = require('typed-dom');
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
                    src: url.href,
                    alt,
                    controls: '',
                    style: 'width: 100%;'
                }).cloneNode(true));
            }
            exports.audio = audio;
        },
        {
            '../../../parser/inline/media': 94,
            'typed-dom': 13
        }
    ],
    117: [
        function (require, module, exports) {
            (function (global) {
                'use strict';
                Object.defineProperty(exports, '__esModule', { value: true });
                const parser_1 = require('../../../parser');
                const media_1 = require('../../../parser/inline/media');
                const dompurify_1 = typeof window !== 'undefined' ? window['DOMPurify'] : typeof global !== 'undefined' ? global['DOMPurify'] : null;
                const typed_dom_1 = require('typed-dom');
                const origins = new Set(['https://gist.github.com']);
                function gist(url) {
                    if (!origins.has(url.origin))
                        return;
                    if (!url.pathname.match(/^\/[\w\-]+?\/\w{32}(?!\w)/))
                        return;
                    if (media_1.cache.has(url.href))
                        return media_1.cache.get(url.href).cloneNode(true);
                    return typed_dom_1.default.div({ style: 'position: relative;' }, [typed_dom_1.default.em(`loading ${ url.href }`)], (f, tag) => {
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
                                void gist.insertBefore(typed_dom_1.html('div', { class: 'gist-description' }, [typed_dom_1.default.a({ style: 'color: #555; font-weight: 600;' }, description, () => parser_1.parse(`{ ${ url.href } }`).querySelector('a')).element]), gist.firstChild);
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
            '../../../parser': 40,
            '../../../parser/inline/media': 94,
            'typed-dom': 13
        }
    ],
    118: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const media_1 = require('../../../parser/inline/media');
            const typed_dom_1 = require('typed-dom');
            function image(url, alt) {
                if (media_1.cache.has(url.href))
                    return media_1.cache.get(url.href).cloneNode(true);
                return media_1.cache.set(url.href, typed_dom_1.html('img', {
                    src: url.href,
                    alt,
                    style: 'max-width: 100%;'
                }).cloneNode(true));
            }
            exports.image = image;
        },
        {
            '../../../parser/inline/media': 94,
            'typed-dom': 13
        }
    ],
    119: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const parser_1 = require('../../../parser');
            const media_1 = require('../../../parser/inline/media');
            const typed_dom_1 = require('typed-dom');
            const extensions = new Set(['.pdf']);
            function pdf(url) {
                if (!extensions.has(url.pathname.split(/(?=\.)/).pop()))
                    return;
                if (media_1.cache.has(url.href))
                    return media_1.cache.get(url.href).cloneNode(true);
                return media_1.cache.set(url.href, typed_dom_1.html('div', { style: 'position: relative;' }, [
                    typed_dom_1.html('div', { style: 'position: relative; resize: vertical; overflow: hidden; padding-bottom: 10px;' }, [typed_dom_1.html('object', {
                            type: 'application/pdf',
                            data: url.href,
                            style: 'width: 100%; height: 100%; min-height: 400px;',
                            typemustmatch: ''
                        })]),
                    typed_dom_1.html('div', { style: 'word-wrap: break-word;' }, parser_1.parse(`**{ ${ url.href } }**`).firstElementChild.childNodes)
                ]));
            }
            exports.pdf = pdf;
        },
        {
            '../../../parser': 40,
            '../../../parser/inline/media': 94,
            'typed-dom': 13
        }
    ],
    120: [
        function (require, module, exports) {
            (function (global) {
                'use strict';
                Object.defineProperty(exports, '__esModule', { value: true });
                const parser_1 = require('../../../parser');
                const media_1 = require('../../../parser/inline/media');
                const dompurify_1 = typeof window !== 'undefined' ? window['DOMPurify'] : typeof global !== 'undefined' ? global['DOMPurify'] : null;
                const typed_dom_1 = require('typed-dom');
                const origins = new Set(['https://www.slideshare.net']);
                function slideshare(url) {
                    if (!origins.has(url.origin))
                        return;
                    if (!url.pathname.match(/^\/[^/?#]+\/[^/?#]+/))
                        return;
                    if (media_1.cache.has(url.href))
                        return media_1.cache.get(url.href).cloneNode(true);
                    return typed_dom_1.default.div({ style: 'position: relative;' }, [typed_dom_1.default.em(`loading ${ url.href }`)], (f, tag) => {
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
            '../../../parser': 40,
            '../../../parser/inline/media': 94,
            'typed-dom': 13
        }
    ],
    121: [
        function (require, module, exports) {
            (function (global) {
                'use strict';
                Object.defineProperty(exports, '__esModule', { value: true });
                const parser_1 = require('../../../parser');
                const cache_1 = require('spica/cache');
                const dompurify_1 = typeof window !== 'undefined' ? window['DOMPurify'] : typeof global !== 'undefined' ? global['DOMPurify'] : null;
                const typed_dom_1 = require('typed-dom');
                const origins = new Set(['https://twitter.com']);
                const cache = new cache_1.Cache(10);
                function twitter(url) {
                    if (!origins.has(url.origin))
                        return;
                    if (!url.pathname.match(/^\/\w+\/status\/[0-9]{15,}(?!\w)/))
                        return;
                    if (cache.has(url.href)) {
                        const el = cache.get(url.href).cloneNode(true);
                        window.twttr && void window.twttr.widgets.load(el);
                        return el;
                    }
                    return typed_dom_1.default.div({ style: 'position: relative;' }, [typed_dom_1.default.em(`loading ${ url.href }`)], (f, tag) => {
                        const outer = f(tag);
                        void $.ajax(`https://publish.twitter.com/oembed?url=${ url.href.replace('?', '&') }&omit_script=true`, {
                            dataType: 'jsonp',
                            timeout: 10 * 1000,
                            cache: true,
                            success({html}) {
                                outer.innerHTML = dompurify_1.sanitize(`<div style="margin-top: -10px; margin-bottom: -10px;">${ html }</div>`);
                                void cache.set(url.href, outer.cloneNode(true));
                                if (window.twttr)
                                    return void window.twttr.widgets.load(outer);
                                const id = 'twitter-wjs';
                                if (document.getElementById(id))
                                    return;
                                void document.body.appendChild(typed_dom_1.html('script', {
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
            '../../../parser': 40,
            'spica/cache': 6,
            'typed-dom': 13
        }
    ],
    122: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const media_1 = require('../../../parser/inline/media');
            const typed_dom_1 = require('typed-dom');
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
            '../../../parser/inline/media': 94,
            'typed-dom': 13
        }
    ],
    123: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const media_1 = require('../../../parser/inline/media');
            const typed_dom_1 = require('typed-dom');
            const origins = new Set([
                'https://www.youtube.com',
                'https://youtu.be'
            ]);
            function youtube(url) {
                if (!origins.has(url.origin))
                    return;
                if (url.origin === 'https://www.youtube.com' && !url.pathname.match(/^\/watch$/))
                    return;
                if (url.origin === 'https://youtu.be' && !url.pathname.match(/^\/[\w\-]+$/))
                    return;
                if (media_1.cache.has(url.href))
                    return media_1.cache.get(url.href).cloneNode(true);
                return media_1.cache.set(url.href, typed_dom_1.html('div', { style: 'position: relative;' }, [typed_dom_1.html('div', { style: 'position: relative; padding-top: 56.25%;' }, [typed_dom_1.html('iframe', {
                            src: `https://www.youtube.com/embed/${ url.origin === 'https://www.youtube.com' && url.href.replace(/.+?=/, '').replace(/&/, '?') || url.origin === 'https://youtu.be' && url.href.slice(url.href.indexOf('/', 9) + 1) }`,
                            allowfullscreen: '',
                            frameborder: '0',
                            style: 'position: absolute; top: 0; right: 0; width: 100%; height: 100%;'
                        })])]));
            }
            exports.youtube = youtube;
        },
        {
            '../../../parser/inline/media': 94,
            'typed-dom': 13
        }
    ],
    124: [
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
            './util/figure': 125,
            './util/footnote': 126,
            './util/toc': 127
        }
    ],
    125: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const label_1 = require('../parser/inline/extension/label');
            const inline_1 = require('../parser/inline');
            const api_1 = require('../parser/api');
            const typed_dom_1 = require('typed-dom');
            const log = new WeakSet();
            function figure(source) {
                let skip = true;
                for (const el of source.children) {
                    if (log.has(el))
                        continue;
                    void log.add(el);
                    if (!el.matches('figure') && !el.querySelector('figure, .label'))
                        continue;
                    skip = false;
                }
                if (skip)
                    return;
                let base = '0';
                const indexes = new Map();
                const exclusions = new Set();
                return void source.querySelectorAll('figure[data-label][data-group], h2[id]').forEach(fig => {
                    if (fig.matches('h2')) {
                        if (base === '0')
                            return;
                        fig = api_1.parse(`[:$-${ +base.split('.')[0] + 1 }.0]\n$$\n$$`).querySelector('figure');
                    }
                    if (fig.matches('.example figure'))
                        return;
                    if (fig.parentElement !== source && fig.parentElement instanceof HTMLQuoteElement) {
                        return exclusions.has(fig.parentElement) ? undefined : void exclusions.add(fig.parentElement) || void figure(fig.parentElement);
                    }
                    const label = fig.getAttribute('data-label');
                    const group = fig.getAttribute('data-group');
                    let idx = label_1.index(label, indexes.get(group) || base);
                    if (idx.endsWith('.0')) {
                        base = idx = idx.startsWith('0.') ? `${ (indexes.get(group) || base).split('.', 1)[0] }.${ idx.slice(2) }` : idx;
                        void indexes.clear();
                    }
                    void indexes.set(group, idx);
                    void fig.setAttribute('data-index', idx);
                    const figindex = fig.lastElementChild.previousElementSibling;
                    void typed_dom_1.define(figindex, group === '$' ? `(${ idx })` : `${ capitalize(group) }. ${ idx }.`);
                    if (fig.matches('blockquote *'))
                        return;
                    if (idx.endsWith('.0'))
                        return;
                    void fig.setAttribute('id', `label:${ label.split('-', 1)[0] }-${ idx }`);
                    const query = inline_1.isGroup(label) ? label.split('-').slice(0, -1).join('-') : label;
                    void source.querySelectorAll(`a.label[data-label="${ query.replace(/[:$.]/g, '\\$&') }"]`).forEach(ref => void typed_dom_1.define(ref, { href: `#${ fig.id }` }, figindex.textContent.replace(/[.]$/, '')));
                });
            }
            exports.figure = figure;
            function capitalize(label) {
                return label[0].toUpperCase() + label.slice(1);
            }
        },
        {
            '../parser/api': 41,
            '../parser/inline': 69,
            '../parser/inline/extension/label': 87,
            'typed-dom': 13
        }
    ],
    126: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const indexer_1 = require('../parser/inline/extension/indexer');
            const typed_dom_1 = require('typed-dom');
            function footnote(source, targets) {
                void exports.annotation(source, targets.annotation);
                void exports.authority(source, targets.authority);
            }
            exports.footnote = footnote;
            exports.annotation = build('annotation', n => `*${ n }`);
            exports.authority = build('authority', n => `[${ n }]`);
            function build(category, marker) {
                const contents = new WeakMap();
                return (source, target) => {
                    const exclusions = new Set(source.querySelectorAll('.example'));
                    return void typed_dom_1.define(target, [...source.querySelectorAll(`.${ category }`)].reduce((acc, ref, i) => {
                        if (exclusions.has(ref.closest('.example')))
                            return acc;
                        if (!contents.has(ref) && ref.querySelector('a'))
                            return acc;
                        void contents.set(ref, contents.get(ref) || [...ref.childNodes]);
                        const refIndex = i + 1;
                        const refId = ref.id || `${ category }-ref:${ i + 1 }`;
                        const title = ref.title || indexer_1.text(ref);
                        const def = acc.get(title);
                        const defIndex = def ? +def.id.match(/[0-9]+/)[0] : acc.size + 1;
                        const defId = def ? def.id : `${ category }-def:${ defIndex }`;
                        void typed_dom_1.define(ref, {
                            id: refId,
                            title: title
                        }, [typed_dom_1.html('a', {
                                href: `#${ defId }`,
                                rel: 'noopener'
                            }, marker(defIndex))]);
                        if (def) {
                            void def.lastChild.appendChild(typed_dom_1.html('a', {
                                href: `#${ refId }`,
                                rel: 'noopener'
                            }, marker(refIndex)));
                        } else {
                            void acc.set(title, typed_dom_1.html('li', { id: defId }, [
                                ...contents.get(ref),
                                typed_dom_1.html('sup', [typed_dom_1.html('a', {
                                        href: `#${ refId }`,
                                        rel: 'noopener'
                                    }, marker(refIndex))])
                            ]));
                        }
                        return acc;
                    }, new Map()).values());
                };
            }
        },
        {
            '../parser/inline/extension/indexer': 86,
            'typed-dom': 13
        }
    ],
    127: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const concat_1 = require('spica/concat');
            const typed_dom_1 = require('typed-dom');
            function toc(source) {
                const hs = [...source.children].filter(el => el instanceof HTMLHeadingElement);
                return parse(cons(hs));
            }
            exports.toc = toc;
            function parse(node, index = []) {
                return typed_dom_1.html('ul', node.map(([el, node], i) => {
                    const idx = index.concat([i + 1]);
                    return typed_dom_1.html('li', [
                        typed_dom_1.html('a', {
                            href: `#${ el.id }`,
                            rel: 'noopener',
                            'data-index': idx.join('.')
                        }, el.textContent),
                        node.length > 0 ? parse(node, idx) : typed_dom_1.frag()
                    ]);
                }));
            }
            function cons(hs) {
                return hs.reduce((hss, h) => {
                    const hs = hss.pop();
                    return hs.length === 0 || level(h) > level(hs[0]) ? concat_1.concat(hss, [concat_1.concat(hs, [h])]) : concat_1.concat(hss, [
                        hs,
                        [h]
                    ]);
                }, [[]]).reduce((node, hs) => hs.length === 0 ? node : concat_1.concat(node, [[
                        hs.shift(),
                        cons(hs)
                    ]]), []);
            }
            function level(h) {
                return +h.tagName[1];
            }
        },
        {
            'spica/concat': 7,
            'typed-dom': 13
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
            './src/parser': 40,
            './src/renderer': 107,
            './src/util': 124
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