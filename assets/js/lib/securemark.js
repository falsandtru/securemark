/*! securemark v0.112.1 https://github.com/falsandtru/securemark | (c) 2017, falsandtru | (Apache-2.0 AND MPL-2.0) License */
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
            const type_1 = _dereq_('./type');
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
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const assign_1 = _dereq_('./assign');
            const equal_1 = _dereq_('./equal');
            class Cache {
                constructor(size, callback = () => undefined, opts = {}) {
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
                    this.store = new Map(entries);
                    for (const k of [
                            ...stats[1],
                            ...stats[0]
                        ].slice(LFU.length + LRU.length)) {
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
                        const index = equal_1.findIndex(key, stat);
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
                    this.store = new Map();
                    this.stats = {
                        LRU: [],
                        LFU: []
                    };
                    if (this.settings.ignore.clear)
                        return;
                    for (const [key, val] of store) {
                        void this.callback(key, val);
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
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            function concat(target, source) {
                target.push(...source);
                return target;
            }
            exports.concat = concat;
        },
        {}
    ],
    8: [
        function (_dereq_, module, exports) {
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
    10: [
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
                return id === undefined ? (zeros + ++cnt).slice(-15) : (zeros + id).slice(-15);
            }
            exports.sqid = sqid;
        },
        {}
    ],
    11: [
        function (_dereq_, module, exports) {
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
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const FORMAT_V4 = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
            function uuid() {
                let acc = '';
                for (let i = 0; i < FORMAT_V4.length; ++i) {
                    const c = FORMAT_V4[i];
                    if (c === 'x' || c === 'y') {
                        const r = Math.random() * 16 | 0;
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
    13: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
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
            exports.define = dom_1.define;
            var listener_1 = _dereq_('./src/util/listener');
            exports.listen = listener_1.listen;
            exports.once = listener_1.once;
            exports.wait = listener_1.wait;
            exports.delegate = listener_1.delegate;
            exports.bind = listener_1.bind;
            exports.currentTargets = listener_1.currentTargets;
        },
        {
            './src/dom/builder': 14,
            './src/dom/proxy': 16,
            './src/util/dom': 17,
            './src/util/listener': 18
        }
    ],
    14: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const proxy_1 = _dereq_('./proxy');
            const dom_1 = _dereq_('../util/dom');
            function API(baseFactory, formatter = el => el) {
                return new Proxy(() => undefined, handle(baseFactory, formatter));
            }
            exports.API = API;
            exports.Shadow = API(dom_1.html, dom_1.shadow);
            exports.HTML = API(dom_1.html);
            exports.SVG = API(dom_1.svg);
            function handle(baseFactory, formatter) {
                return {
                    apply(obj, _, [prop, ...args]) {
                        return this.get(obj, prop, undefined)(...args);
                    },
                    get: (obj, prop) => obj[prop] || prop in obj || typeof prop !== 'string' ? obj[prop] : obj[prop] = builder(prop, baseFactory)
                };
                function builder(tag, baseFactory) {
                    return function build(attrs, children, factory) {
                        if (typeof attrs === 'function')
                            return build(undefined, undefined, attrs);
                        if (typeof children === 'function')
                            return build(attrs, undefined, children);
                        if (attrs !== undefined && isChildren(attrs))
                            return build(undefined, attrs, factory);
                        const node = formatter(elem(factory || defaultFactory, attrs || {}, children));
                        return node instanceof Element ? new proxy_1.Elem(node, children) : new proxy_1.Elem(node.host, children, node);
                    };
                    function isChildren(children) {
                        return typeof children !== 'object' || Object.values(children).slice(-1).every(val => typeof val === 'object');
                    }
                    function elem(factory, attrs, children) {
                        const el = factory(baseFactory, tag, attrs, children);
                        if (tag !== el.tagName.toLowerCase())
                            throw new Error(`TypedDOM: Expected tag name is "${ tag }" but actually "${ el.tagName.toLowerCase() }".`);
                        if (factory !== defaultFactory) {
                            for (const [k, v] of Object.entries(attrs)) {
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
            '../util/dom': 17,
            './proxy': 16
        }
    ],
    15: [
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
            'spica/sqid': 10,
            'spica/uuid': 12
        }
    ],
    16: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const identity_1 = _dereq_('./identity');
            const dom_1 = _dereq_('../util/dom');
            var ElChildrenType;
            (function (ElChildrenType) {
                ElChildrenType.Void = 'void';
                ElChildrenType.Text = 'text';
                ElChildrenType.Collection = 'collection';
                ElChildrenType.Record = 'record';
            }(ElChildrenType || (ElChildrenType = {})));
            const memory = new WeakMap();
            function proxy(el) {
                if (!memory.has(el))
                    throw new Error(`TypedDOM: This element has no proxy.`);
                return memory.get(el);
            }
            exports.proxy = proxy;
            const tag = Symbol();
            class Elem {
                constructor(element, children_, container = element) {
                    this.element = element;
                    this.children_ = children_;
                    this.container = container;
                    this.id_ = this.element.id.trim();
                    switch (true) {
                    case children_ === undefined:
                        this.type = ElChildrenType.Void;
                        break;
                    case typeof children_ === 'string':
                        this.type = ElChildrenType.Text;
                        break;
                    case Array.isArray(children_):
                        this.type = ElChildrenType.Collection;
                        break;
                    case children_ && typeof children_ === 'object':
                        this.type = ElChildrenType.Record;
                        break;
                    default:
                        throw new Error(`TypedDOM: Invalid type children.`);
                    }
                    void throwErrorIfNotUsable(this);
                    void memory.set(this.element, this);
                    switch (this.type) {
                    case ElChildrenType.Void:
                        this.initialChildren = new WeakSet();
                        return;
                    case ElChildrenType.Text:
                        this.initialChildren = new WeakSet();
                        void dom_1.define(this.container, []);
                        this.children_ = this.container.appendChild(dom_1.text(''));
                        this.children = children_;
                        return;
                    case ElChildrenType.Collection:
                        this.initialChildren = new WeakSet(children_);
                        void dom_1.define(this.container, []);
                        this.children_ = [];
                        this.children = children_;
                        return;
                    case ElChildrenType.Record:
                        this.initialChildren = new WeakSet(Object.values(children_));
                        void dom_1.define(this.container, []);
                        this.children_ = observe(this.container, Object.assign({}, children_));
                        this.children = children_;
                        return;
                    default:
                        throw new Error(`TypedDOM: Unreachable code.`);
                    }
                    function observe(node, children) {
                        return Object.defineProperties(children, Object.entries(children).reduce((descs, [name, child]) => {
                            void throwErrorIfNotUsable(child);
                            void node.appendChild(child.element);
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
                                    if (newChild.element.parentElement !== node) {
                                        void throwErrorIfNotUsable(newChild);
                                    }
                                    void node.replaceChild(newChild.element, oldChild.element);
                                    child = newChild;
                                }
                            };
                            return descs;
                        }, {}));
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
                scope(child) {
                    if (!(child.element instanceof HTMLStyleElement))
                        return;
                    const syntax = /^(\s*)\$scope(?!\w)/gm;
                    const style = child.element;
                    const query = this.query;
                    if (style.innerHTML.search(syntax) === -1)
                        return;
                    style.innerHTML = style.innerHTML.replace(syntax, (_, indent) => `${ indent }${ query }`);
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
                        this.children_ = this.children_.parentNode === this.container ? this.children_ : [...this.container.childNodes].find(node => node instanceof Text) || this.children_.cloneNode();
                        return this.children_.textContent;
                    default:
                        return this.children_;
                    }
                }
                set children(children) {
                    const removedChildren = new Set();
                    const addedChildren = new Set();
                    switch (this.type) {
                    case ElChildrenType.Void:
                        return;
                    case ElChildrenType.Text: {
                            if (children === this.children && !this.initialChildren.has(this.children_))
                                return;
                            const targetChildren = this.children_;
                            const oldText = targetChildren.textContent;
                            const newText = children;
                            targetChildren.textContent = newText;
                            if (newText === oldText)
                                return;
                            void this.element.dispatchEvent(new Event('change', {
                                bubbles: false,
                                cancelable: true
                            }));
                            return;
                        }
                    case ElChildrenType.Collection: {
                            const sourceChildren = children;
                            const targetChildren = [];
                            this.children_ = targetChildren;
                            const mem = new WeakSet();
                            for (let i = 0; i < sourceChildren.length; ++i) {
                                const newChild = sourceChildren[i];
                                if (mem.has(newChild))
                                    throw new Error(`TypedDOM: Typed DOM children can't repeatedly be used to the same object.`);
                                void mem.add(newChild);
                                if (newChild.element.parentNode !== this.container) {
                                    void throwErrorIfNotUsable(newChild);
                                }
                                if (newChild.element === this.container.children[i]) {
                                    void targetChildren.push(newChild);
                                } else {
                                    if (newChild.element.parentNode !== this.container) {
                                        void this.scope(newChild);
                                        void addedChildren.add(newChild);
                                    }
                                    void this.container.insertBefore(newChild.element, this.container.children[i]);
                                    void targetChildren.push(newChild);
                                }
                            }
                            void Object.freeze(targetChildren);
                            for (let i = this.container.children.length; i >= sourceChildren.length; --i) {
                                if (!memory.has(this.container.children[i]))
                                    continue;
                                void removedChildren.add(proxy(this.container.removeChild(this.container.children[i])));
                            }
                            break;
                        }
                    case ElChildrenType.Record: {
                            const sourceChildren = children;
                            const targetChildren = this.children_;
                            const mem = new WeakSet();
                            for (const name in targetChildren) {
                                const oldChild = targetChildren[name];
                                const newChild = sourceChildren[name];
                                if (!newChild)
                                    continue;
                                if (mem.has(newChild))
                                    throw new Error(`TypedDOM: Typed DOM children can't repeatedly be used to the same object.`);
                                void mem.add(newChild);
                                if (newChild.element.parentNode !== this.container) {
                                    void throwErrorIfNotUsable(newChild);
                                }
                                if (oldChild.element !== newChild.element || this.initialChildren.has(oldChild)) {
                                    void this.scope(newChild);
                                    void addedChildren.add(newChild);
                                    void removedChildren.add(oldChild);
                                }
                                targetChildren[name] = sourceChildren[name];
                            }
                            break;
                        }
                    }
                    for (const child of removedChildren) {
                        if (this.initialChildren.has(child))
                            continue;
                        void child.element.dispatchEvent(new Event('disconnect', {
                            bubbles: false,
                            cancelable: true
                        }));
                    }
                    for (const child of addedChildren) {
                        void child.element.dispatchEvent(new Event('connect', {
                            bubbles: false,
                            cancelable: true
                        }));
                    }
                    removedChildren.size + addedChildren.size > 0 && void this.element.dispatchEvent(new Event('change', {
                        bubbles: false,
                        cancelable: true
                    }));
                }
            }
            exports.Elem = Elem;
            function throwErrorIfNotUsable({element}) {
                if (!element.parentElement || !memory.has(element.parentElement))
                    return;
                throw new Error(`TypedDOM: Typed DOM children can't be used to another typed DOM.`);
            }
        },
        {
            '../util/dom': 17,
            './identity': 15
        }
    ],
    17: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const shadows = new WeakMap();
            var cache;
            (function (cache) {
                cache.elem = new Map();
                cache.text = document.createTextNode('');
                cache.frag = document.createDocumentFragment();
            }(cache || (cache = {})));
            function frag(children = []) {
                children = typeof children === 'string' ? [text(children)] : children;
                const frag = cache.frag.cloneNode();
                void frag.append(...children);
                return frag;
            }
            exports.frag = frag;
            function shadow(el, children, opts) {
                if (children && !isChildren(children))
                    return shadow(el, undefined, children);
                if (el.shadowRoot || shadows.has(el)) {
                    return define(opts ? opts.mode === 'open' ? el.shadowRoot || el.attachShadow(opts) : shadows.get(el) || shadows.set(el, el.attachShadow(opts)).get(el) : el.shadowRoot || shadows.get(el), children);
                } else {
                    return define(!opts || opts.mode === 'open' ? el.attachShadow({ mode: 'open' }) : shadows.set(el, el.attachShadow(opts)).get(el), children === undefined ? el.childNodes : children);
                }
            }
            exports.shadow = shadow;
            function html(tag, attrs = {}, children = []) {
                return element(0, tag, attrs, children);
            }
            exports.html = html;
            function svg(tag, attrs = {}, children = []) {
                return element(1, tag, attrs, children);
            }
            exports.svg = svg;
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
                const el = tag.includes('-') ? elem(ns, tag) : cache.elem.has(key) ? cache.elem.get(key).cloneNode(true) : cache.elem.set(key, elem(ns, tag)).get(key).cloneNode(true);
                void define(el, attrs, children);
                return el;
            }
            function elem(ns, tag) {
                switch (ns) {
                case 0:
                    return document.createElement(tag);
                case 1:
                    return document.createElementNS('http://www.w3.org/2000/svg', tag);
                }
            }
            function define(el, attrs = {}, children) {
                if (isChildren(attrs))
                    return define(el, undefined, attrs);
                if (typeof children === 'string')
                    return define(el, attrs, [text(children)]);
                void Object.entries(attrs).forEach(([name, value]) => {
                    switch (typeof value) {
                    case 'string':
                        return void el.setAttribute(name, value);
                    case 'function':
                        return void el.addEventListener(name.slice(2), value, {
                            passive: [
                                'wheel',
                                'mousewheel',
                                'touchstart',
                                'touchmove'
                            ].includes(name.slice(2))
                        });
                    case 'object':
                        return void el.removeAttribute(name);
                    default:
                        return;
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
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const noop_1 = _dereq_('./noop');
            exports.currentTargets = new WeakMap();
            function listen(target, a, b, c = false, d = {}) {
                return typeof b === 'string' ? delegate(target, a, b, c, d) : bind(target, a, b, c);
            }
            exports.listen = listen;
            function once(target, a, b, c = false, d = {}) {
                return typeof b === 'string' ? delegate(target, a, b, c, Object.assign({}, typeof d === 'boolean' ? { capture: d } : d, { once: true })) : bind(target, a, b, Object.assign({}, typeof c === 'boolean' ? { capture: c } : c, { once: true }));
            }
            exports.once = once;
            function wait(target, a, b = false, c = {}) {
                return new Promise(resolve => typeof b === 'string' ? void once(target, a, b, resolve, c) : void once(target, a, resolve, b));
            }
            exports.wait = wait;
            function delegate(target, selector, type, listener, option = {}) {
                return bind(target instanceof Document ? target.documentElement : target, type, ev => {
                    const cx = (ev.target.shadowRoot && ev.composedPath()[0] || ev.target).closest(selector);
                    if (cx instanceof Element) {
                        void once(cx, type, listener, option);
                    }
                    return ev.returnValue;
                }, Object.assign({}, option, { capture: true }));
            }
            exports.delegate = delegate;
            function bind(target, type, listener, option = false) {
                void target.addEventListener(type, handler, option);
                let unbind = () => (unbind = noop_1.noop, void target.removeEventListener(type, handler, option));
                return () => void unbind();
                function handler(ev) {
                    void exports.currentTargets.set(ev, ev.currentTarget);
                    return listener(ev);
                }
            }
            exports.bind = bind;
        },
        { './noop': 19 }
    ],
    19: [
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
    20: [
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
            __export(_dereq_('./combinator/control/manipulation/surround'));
            __export(_dereq_('./combinator/control/manipulation/match'));
            __export(_dereq_('./combinator/control/manipulation/convert'));
            __export(_dereq_('./combinator/control/manipulation/indent'));
            __export(_dereq_('./combinator/control/manipulation/trim'));
            __export(_dereq_('./combinator/control/manipulation/lazy'));
            __export(_dereq_('./combinator/control/monad/fmap'));
            __export(_dereq_('./combinator/control/monad/bind'));
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
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const parser_1 = _dereq_('../../data/parser');
            const line_1 = _dereq_('./line');
            function block(parser, separation = true) {
                return source => {
                    if (source === '')
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
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const parser_1 = _dereq_('../../data/parser');
            function contract(pattern, parser, cond) {
                return verify(validate(pattern, parser), cond);
            }
            exports.contract = contract;
            function validate(pattern, parser) {
                return source => {
                    if (source === '')
                        return;
                    if (typeof pattern === 'string' ? !source.startsWith(pattern) : !pattern.test(source))
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
        },
        { '../../data/parser': 33 }
    ],
    23: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const parser_1 = _dereq_('../../data/parser');
            function line(parser, allowTrailingWhitespace = true) {
                return source => {
                    if (source === '')
                        return;
                    const fst = firstline(source);
                    const result = parser(fst);
                    if (!result)
                        return;
                    return (allowTrailingWhitespace ? parser_1.exec(result).trim() === '' : parser_1.exec(result) === '') ? [
                        parser_1.eval(result),
                        source.slice(fst.length)
                    ] : undefined;
                };
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
        { '../../data/parser': 33 }
    ],
    24: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const parser_1 = _dereq_('../../data/parser');
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
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            function convert(conv, parser) {
                return source => {
                    if (source === '')
                        return;
                    source = conv(source);
                    return source === '' ? [
                        [],
                        ''
                    ] : parser(source);
                };
            }
            exports.convert = convert;
        },
        {}
    ],
    26: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const parser_1 = _dereq_('../../data/parser');
            const some_1 = _dereq_('../../data/parser/some');
            const bind_1 = _dereq_('../monad/bind');
            const match_1 = _dereq_('./match');
            const surround_1 = _dereq_('./surround');
            const line_1 = _dereq_('../constraint/line');
            const scope_1 = _dereq_('../constraint/scope');
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
        function (_dereq_, module, exports) {
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
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const parser_1 = _dereq_('../../data/parser');
            function match(pattern, f) {
                return source => {
                    if (source === '')
                        return;
                    const param = source.match(pattern);
                    if (!param)
                        return;
                    const rest = source.slice(param[0].length);
                    const result = f(param)(rest);
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
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            function surround(start, parser, end, strict = true) {
                return lmr_ => {
                    if (lmr_ === '')
                        return;
                    const l = match(lmr_, start);
                    if (l === undefined)
                        return;
                    const mr_ = l ? lmr_.slice(l.length) : lmr_;
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
                        r ? r_.slice(r.length) : r_
                    ] : undefined;
                };
            }
            exports.surround = surround;
            function match(source, pattern) {
                if (pattern === '')
                    return pattern;
                if (typeof pattern === 'string')
                    return source.startsWith(pattern) ? pattern : undefined;
                const result = source.match(pattern);
                return result && source.startsWith(result[0]) ? result[0] : undefined;
            }
        },
        {}
    ],
    30: [
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
        { './convert': 25 }
    ],
    31: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const parser_1 = _dereq_('../../data/parser');
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
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const bind_1 = _dereq_('./bind');
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
            function verify(source, result) {
                return true;
            }
            exports.verify = verify;
        },
        {}
    ],
    34: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const union_1 = _dereq_('./union');
            const sequence_1 = _dereq_('./sequence');
            const bind_1 = _dereq_('../../control/monad/bind');
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
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const union_1 = _dereq_('./union');
            const bind_1 = _dereq_('../../control/monad/bind');
            const concat_1 = _dereq_('spica/concat');
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
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const parser_1 = _dereq_('../parser');
            const concat_1 = _dereq_('spica/concat');
            function some(parser, until) {
                return source => {
                    let rest = source;
                    const data = [];
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
                        void concat_1.concat(data, parser_1.eval(result));
                        rest = parser_1.exec(result);
                    }
                    return rest.length < source.length ? [
                        data,
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
            './inits': 34,
            './union': 39
        }
    ],
    38: [
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
            './sequence': 35,
            './union': 39
        }
    ],
    39: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            function union(parsers) {
                switch (parsers.length) {
                case 0:
                    return () => undefined;
                case 1:
                    return parsers[0];
                case 2:
                    return source => parsers[0](source) || parsers[1](source);
                default:
                    return union([
                        parsers[0],
                        union(parsers.slice(1))
                    ]);
                }
            }
            exports.union = union;
        },
        {}
    ],
    40: [
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
        { './parser/api': 41 }
    ],
    41: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var parse_1 = _dereq_('./api/parse');
            exports.parse = parse_1.parse;
            var bind_1 = _dereq_('./api/bind');
            exports.bind = bind_1.bind;
            var source_1 = _dereq_('./api/source');
            exports.breaklines = source_1.breaklines;
            var cache_1 = _dereq_('./api/cache');
            exports.caches = cache_1.caches;
        },
        {
            './api/bind': 42,
            './api/cache': 43,
            './api/parse': 45,
            './api/source': 46
        }
    ],
    42: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../combinator');
            const segment_1 = _dereq_('../segment');
            const block_1 = _dereq_('../block');
            const normalization_1 = _dereq_('./normalization');
            function bind(target) {
                const pairs = [];
                let revision;
                return function* (source) {
                    source = normalization_1.normalize(source);
                    const rev = revision = Symbol();
                    const targetSegments = pairs.map(([seg]) => seg);
                    if (source === targetSegments.join(''))
                        return;
                    const sourceSegments = segment_1.segment(source);
                    let start = 0;
                    for (; start < targetSegments.length; ++start) {
                        if (targetSegments[start] !== sourceSegments[start])
                            break;
                    }
                    let end = 0;
                    for (; start + end < targetSegments.length && start + end < sourceSegments.length; ++end) {
                        if (targetSegments[targetSegments.length - end - 1] !== sourceSegments[sourceSegments.length - end - 1])
                            break;
                    }
                    let base;
                    let position = start;
                    for (const segment of sourceSegments.slice(start, sourceSegments.length - end)) {
                        const skip = position < pairs.length && segment === pairs[position][0];
                        const elements = skip ? pairs[position][1] : combinator_1.eval(block_1.block(segment));
                        for (const [, es] of pairs.splice(position, position < pairs.length - end ? 1 : 0, [
                                segment,
                                elements
                            ])) {
                            for (const el of es) {
                                if (!el.parentNode)
                                    continue;
                                base = el.nextSibling;
                                if (skip)
                                    continue;
                                void el.remove();
                            }
                        }
                        void ++position;
                        if (skip)
                            continue;
                        base = base === undefined ? bottom(start, position) || target.firstChild : base;
                        for (const el of elements) {
                            base = target.insertBefore(el, base).nextSibling;
                            yield el;
                            if (revision !== rev)
                                throw new Error(`Abort by reentering.`);
                        }
                    }
                    for (const [, es] of pairs.splice(position, pairs.length - position - end)) {
                        for (const el of es) {
                            if (!el.parentNode)
                                continue;
                            void el.remove();
                        }
                    }
                };
                function bottom(start, position) {
                    if (pairs.length === 0)
                        return null;
                    if (start === pairs.length) {
                        const el = bottom(pairs.length - 1, position);
                        return el && el.nextSibling;
                    }
                    for (let i = start; i >= 0 && i < pairs.length; --i) {
                        const [, es] = pairs[i];
                        for (let i = es.length - 1; i >= 0; --i) {
                            const el = es[i];
                            if (el.parentNode !== target)
                                continue;
                            return el.nextSibling;
                        }
                    }
                    for (let i = position; i < pairs.length; ++i) {
                        const [, es] = pairs[i];
                        for (let i = 0; i < es.length; ++i) {
                            const el = es[i];
                            if (el.parentNode !== target)
                                continue;
                            return el;
                        }
                    }
                    return null;
                }
            }
            exports.bind = bind;
        },
        {
            '../../combinator': 20,
            '../block': 48,
            '../segment': 102,
            './normalization': 44
        }
    ],
    43: [
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
            '../inline/math': 94,
            '../inline/media': 95
        }
    ],
    44: [
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
    45: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../combinator');
            const block_1 = _dereq_('../block');
            const segment_1 = _dereq_('../segment');
            const normalization_1 = _dereq_('./normalization');
            const concat_1 = _dereq_('spica/concat');
            const typed_dom_1 = _dereq_('typed-dom');
            function parse(source) {
                return typed_dom_1.frag(segment_1.segment(normalization_1.normalize(source)).reduce((acc, seg) => concat_1.concat(acc, combinator_1.eval(block_1.block(seg))), []));
            }
            exports.parse = parse;
        },
        {
            '../../combinator': 20,
            '../block': 48,
            '../segment': 102,
            './normalization': 44,
            'spica/concat': 7,
            'typed-dom': 13
        }
    ],
    46: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../combinator');
            const parse_1 = _dereq_('./parse');
            const concat_1 = _dereq_('spica/concat');
            const sources = new WeakMap();
            function breaklines(source) {
                return [...parse_1.parse(source).children].map(el => {
                    if (el instanceof HTMLParagraphElement === false)
                        return sources.get(el);
                    const breaks = [...el.querySelectorAll('.address, .quote, br, .linebreak, .comment')].reduce((acc, el) => {
                        switch (true) {
                        case el.matches('.quote'):
                            return concat_1.concat(acc, Array(el.textContent.split('\n').length).fill(el));
                        case el.matches('.comment'):
                            return concat_1.concat(acc, Array(el.title.split('\n').length - 1).fill(el));
                        default:
                            return concat_1.concat(acc, [el]);
                        }
                    }, []);
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
    47: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../combinator');
            const autolink_1 = _dereq_('./inline/autolink');
            const unescapable_1 = _dereq_('./source/unescapable');
            exports.autolink = combinator_1.union([
                autolink_1.autolink,
                unescapable_1.unescsource
            ]);
        },
        {
            '../combinator': 20,
            './inline/autolink': 73,
            './source/unescapable': 107
        }
    ],
    48: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../combinator');
            const newline_1 = _dereq_('./block/newline');
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
            const source_1 = _dereq_('./api/source');
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
            './api/source': 46,
            './block/blockquote': 49,
            './block/codeblock': 50,
            './block/dlist': 51,
            './block/extension': 52,
            './block/heading': 58,
            './block/horizontalrule': 59,
            './block/ilist': 60,
            './block/mathblock': 61,
            './block/newline': 62,
            './block/olist': 63,
            './block/paragraph': 64,
            './block/table': 68,
            './block/ulist': 69,
            './locale': 100
        }
    ],
    49: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../combinator');
            const line_1 = _dereq_('../source/line');
            const autolink_1 = _dereq_('../autolink');
            const parse_1 = _dereq_('../api/parse');
            const util_1 = _dereq_('../util');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.segment = combinator_1.block(combinator_1.union([
                combinator_1.validate(/^(?=>+([^\S\n]|\n\s*\S))/, combinator_1.some(line_1.contentline)),
                combinator_1.validate(/^!(?=>+([^\S\n]|\n\s*\S))/, combinator_1.some(line_1.contentline))
            ]));
            exports.blockquote = combinator_1.lazy(() => combinator_1.block(combinator_1.rewrite(exports.segment, combinator_1.union([
                combinator_1.surround(/^(?=>)/, text, ''),
                combinator_1.surround(/^!(?=>)/, source, '')
            ]))));
            const opener = /^(?=>>+(?:\s|$))/;
            const indent = combinator_1.block(combinator_1.surround(opener, combinator_1.some(line_1.contentline, /^>(?:\s|$)/), ''), false);
            function unindent(source) {
                return source.replace(/\n$/, '').replace(/^>(?:$|\s|(?=>+(?:$|\s)))/mg, '');
            }
            const text = combinator_1.lazy(() => combinator_1.fmap(combinator_1.some(combinator_1.union([
                combinator_1.rewrite(indent, combinator_1.convert(unindent, text)),
                combinator_1.rewrite(combinator_1.some(line_1.contentline, opener), combinator_1.convert(unindent, combinator_1.fmap(util_1.defrag(combinator_1.some(autolink_1.autolink)), ns => [typed_dom_1.html('pre', ns)])))
            ])), ns => [typed_dom_1.html('blockquote', ns)]));
            const source = combinator_1.lazy(() => combinator_1.fmap(combinator_1.some(combinator_1.union([
                combinator_1.rewrite(indent, combinator_1.convert(unindent, source)),
                combinator_1.rewrite(combinator_1.some(line_1.contentline, opener), combinator_1.convert(unindent, source => [
                    [util_1.suppress(parse_1.parse(source))],
                    ''
                ]))
            ])), ns => [typed_dom_1.html('blockquote', ns)]));
        },
        {
            '../../combinator': 20,
            '../api/parse': 45,
            '../autolink': 47,
            '../source/line': 105,
            '../util': 109,
            'typed-dom': 13
        }
    ],
    50: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../combinator');
            const escapable_1 = _dereq_('../source/escapable');
            _dereq_('../source/unescapable');
            const util_1 = _dereq_('../util');
            const typed_dom_1 = _dereq_('typed-dom');
            const autolink_1 = _dereq_('../autolink');
            exports.segment = combinator_1.lazy(() => combinator_1.block(exports.segment_));
            exports.segment_ = combinator_1.block(combinator_1.focus(/^(`{3,})(?!`)(\S*)([^\n]*)\n((?:(?!\1[^\S\n]*(?:\n|$))[^\n]*\n){0,300})\1[^\S\n]*(?:\n|$)/, _ => [
                [],
                ''
            ]), false);
            exports.codeblock = combinator_1.block(combinator_1.rewrite(exports.segment, combinator_1.trim(combinator_1.match(/^(`{3,})(?!`)(\S*)([^\n]*)\n([\s\S]*)\1$/, ([, , lang, param, body]) => rest => {
                const path = util_1.stringify(combinator_1.eval(combinator_1.some(escapable_1.escsource, /^\s/)(param.trim())));
                const file = path.split('/').pop() || '';
                const ext = file && file.includes('.') && !file.startsWith('.') ? file.split('.').pop() : '';
                lang = /^[a-z][a-z0-9]*(-[a-z][a-z0-9]*)*$/.test(lang || ext) ? lang || ext : lang && 'invalid';
                const el = typed_dom_1.html('pre', { class: 'notranslate' }, body.slice(0, -1));
                if (lang) {
                    void el.classList.add('code');
                    void el.classList.add(`language-${ lang }`);
                    void el.setAttribute('data-lang', lang);
                } else {
                    void typed_dom_1.define(el, combinator_1.eval(util_1.defrag(combinator_1.some(autolink_1.autolink))(el.textContent)));
                }
                if (path) {
                    void el.setAttribute('data-file', path);
                }
                return [
                    [el],
                    rest
                ];
            }))));
        },
        {
            '../../combinator': 20,
            '../autolink': 47,
            '../source/escapable': 104,
            '../source/unescapable': 107,
            '../util': 109,
            'typed-dom': 13
        }
    ],
    51: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../combinator');
            const line_1 = _dereq_('../source/line');
            const inline_1 = _dereq_('../inline');
            const util_1 = _dereq_('../util');
            const concat_1 = _dereq_('spica/concat');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.dlist = combinator_1.lazy(() => combinator_1.block(combinator_1.fmap(combinator_1.some(combinator_1.inits([
                combinator_1.some(term),
                combinator_1.some(desc)
            ])), es => [typed_dom_1.html('dl', fillTrailingDescription(es))])));
            const term = combinator_1.line(inline_1.index(combinator_1.verify(combinator_1.fmap(combinator_1.surround(/^~(?=\s|$)/, util_1.defrag(combinator_1.trim(combinator_1.some(combinator_1.union([
                inline_1.indexer,
                inline_1.inline
            ])))), '', false), ns => [typed_dom_1.html('dt', ns)]), ([el]) => !util_1.hasMedia(el))));
            const desc = combinator_1.block(combinator_1.fmap(combinator_1.surround(/^:(?=\s|$)|/, combinator_1.rewrite(combinator_1.some(line_1.anyline, /^[~:](?=\s|$)/), util_1.defrag(combinator_1.trim(combinator_1.some(combinator_1.union([inline_1.inline]))))), '', false), ns => [typed_dom_1.html('dd', ns)]), false);
            function fillTrailingDescription(es) {
                return es.length > 0 && es[es.length - 1].tagName === 'DT' ? concat_1.concat(es, [typed_dom_1.html('dd')]) : es;
            }
        },
        {
            '../../combinator': 20,
            '../inline': 70,
            '../source/line': 105,
            '../util': 109,
            'spica/concat': 7,
            'typed-dom': 13
        }
    ],
    52: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../combinator');
            const fig_1 = _dereq_('./extension/fig');
            const figure_1 = _dereq_('./extension/figure');
            const graph_1 = _dereq_('./extension/graph');
            const example_1 = _dereq_('./extension/example');
            const placeholder_1 = _dereq_('./extension/placeholder');
            exports.segment = combinator_1.validate(/^~{3,}[a-z]|^\[?\$[\w-]\S*[^\S\n]*\n/, combinator_1.union([
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
            './extension/example': 53,
            './extension/fig': 54,
            './extension/figure': 55,
            './extension/graph': 56,
            './extension/placeholder': 57
        }
    ],
    53: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../../combinator');
            const parse_1 = _dereq_('../../api/parse');
            const mathblock_1 = _dereq_('../mathblock');
            const util_1 = _dereq_('../../util');
            const util_2 = _dereq_('../../../util');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.segment = combinator_1.lazy(() => combinator_1.block(exports.segment_));
            exports.segment_ = combinator_1.block(combinator_1.focus(/^(~{3,})example\/(?:markdown|math)[^\S\n]*\n(?:(?!\1[^\S\n]*(?:\n|$))[^\n]*\n){0,100}\1[^\S\n]*(?:\n|$)/, _ => [
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
            '../../../util': 127,
            '../../api/parse': 45,
            '../../util': 109,
            '../mathblock': 61,
            'typed-dom': 13
        }
    ],
    54: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../../combinator');
            const line_1 = _dereq_('../../source/line');
            const figure_1 = _dereq_('./figure');
            const codeblock_1 = _dereq_('../codeblock');
            const mathblock_1 = _dereq_('../mathblock');
            const graph_1 = _dereq_('./graph');
            const example_1 = _dereq_('../extension/example');
            const blockquote_1 = _dereq_('../blockquote');
            const inline_1 = _dereq_('../../inline');
            exports.segment = combinator_1.block(combinator_1.sequence([
                combinator_1.line(inline_1.label),
                combinator_1.union([
                    codeblock_1.segment,
                    mathblock_1.segment,
                    graph_1.segment,
                    example_1.segment,
                    blockquote_1.segment,
                    combinator_1.some(line_1.contentline)
                ])
            ]));
            exports.fig = combinator_1.block(combinator_1.rewrite(exports.segment, combinator_1.convert(source => {
                const bracket = (/^[^\n]*\n!?>+\s/.test(source) && source.match(/^~{3,}(?=\s*)$/gm) || []).reduce((max, bracket) => bracket > max ? bracket : max, '~~') + '~';
                return `${ bracket }figure ${ source }\n\n${ bracket }`;
            }, figure_1.figure)));
        },
        {
            '../../../combinator': 20,
            '../../inline': 70,
            '../../source/line': 105,
            '../blockquote': 49,
            '../codeblock': 50,
            '../extension/example': 53,
            '../mathblock': 61,
            './figure': 55,
            './graph': 56
        }
    ],
    55: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../../combinator');
            const line_1 = _dereq_('../../source/line');
            const table_1 = _dereq_('../table');
            const codeblock_1 = _dereq_('../codeblock');
            const mathblock_1 = _dereq_('../mathblock');
            const graph_1 = _dereq_('./graph');
            const example_1 = _dereq_('./example');
            const blockquote_1 = _dereq_('../blockquote');
            const inline_1 = _dereq_('../../inline');
            const inline_2 = _dereq_('../../inline');
            const util_1 = _dereq_('../../util');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.segment = combinator_1.block(combinator_1.match(/^(~{3,})figure[^\S\n]+(?=\[?\$[\w-]\S*[^\S\n]*\n(?:(?!\1[^\S\n]*(?:\n|$))[^\n]*\n){0,300}\1[^\S\n]*(?:\n|$))/, util_1.memoize(([, bracket]) => bracket, (bracket, closer = new RegExp(`^${ bracket }[^\\S\\n]*(?:\\n|$)`)) => combinator_1.surround('', combinator_1.sequence([
                combinator_1.line(inline_2.label),
                combinator_1.inits([
                    combinator_1.union([
                        codeblock_1.segment_,
                        mathblock_1.segment_,
                        graph_1.segment_,
                        example_1.segment_,
                        blockquote_1.segment,
                        combinator_1.some(line_1.contentline, closer)
                    ]),
                    line_1.emptyline,
                    combinator_1.union([
                        line_1.blankline,
                        combinator_1.some(line_1.contentline, closer)
                    ])
                ])
            ]), closer))));
            exports.figure = combinator_1.block(combinator_1.rewrite(exports.segment, combinator_1.trim(combinator_1.fmap(combinator_1.verify(combinator_1.convert(source => source.slice(source.search(/[[$]/), source.lastIndexOf('\n')), combinator_1.sequence([
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
                    combinator_1.block(util_1.defrag(combinator_1.trim(combinator_1.some(inline_1.inline))))
                ])
            ])), ([label, content, ...caption]) => label.getAttribute('data-label').split('-', 1)[0] === '$' ? content.matches('.math') && caption.length === 0 : true), ([label, content, ...caption]) => [typed_dom_1.html('figure', {
                    'data-label': label.getAttribute('data-label'),
                    'data-group': label.getAttribute('data-label').split('-', 1)[0],
                    style: /^[^-]+-(\d+\.)+0$/.test(label.getAttribute('data-label')) ? 'display: none;' : undefined
                }, [
                    typed_dom_1.html('div', { class: 'figcontent' }, [content]),
                    typed_dom_1.html('span', { class: 'figindex' }),
                    typed_dom_1.html('figcaption', caption)
                ])]))));
        },
        {
            '../../../combinator': 20,
            '../../inline': 70,
            '../../source/line': 105,
            '../../util': 109,
            '../blockquote': 49,
            '../codeblock': 50,
            '../mathblock': 61,
            '../table': 68,
            './example': 53,
            './graph': 56,
            'typed-dom': 13
        }
    ],
    56: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../../combinator');
            _dereq_('../../source/unescapable');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.segment = combinator_1.lazy(() => combinator_1.block(exports.segment_));
            exports.segment_ = combinator_1.block(combinator_1.union([
                combinator_1.focus(/^(~{3,})graph\/(sequence|flowchart)[^\S\n]*\n(?:(?!\1[^\S\n]*(?:\n|$))[^\n]*\n){0,100}\1[^\S\n]*(?:\n|$)/, _ => [
                    [],
                    ''
                ]),
                combinator_1.focus(/^(~{3,})graph\/(graphviz)[^\S\n]*([a-z]+[^\S\n]*|)\n(?:(?!\1[^\S\n]*(?:\n|$))[^\n]*\n){0,100}\1[^\S\n]*(?:\n|$)/, _ => [
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
            '../../source/unescapable': 107,
            'typed-dom': 13
        }
    ],
    57: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../../combinator');
            const inline_1 = _dereq_('../../inline');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.segment = combinator_1.block(combinator_1.focus(/^(~{3,})[a-z][^\n]*\n(?:(?!\1[^\S\n]*(?:\n|$))[^\n]*\n){0,300}\1[^\S\n]*(?:\n|$)/, _ => [
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
            '../../inline': 70,
            'typed-dom': 13
        }
    ],
    58: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../combinator');
            const inline_1 = _dereq_('../inline');
            const util_1 = _dereq_('../util');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.heading = combinator_1.block(combinator_1.line(inline_1.index(combinator_1.verify(combinator_1.match(/^(#{1,6})\s+(?=\S)/, util_1.memoize(([, {length: level}]) => level, level => combinator_1.fmap(util_1.defrag(combinator_1.trim(combinator_1.some(combinator_1.union([
                inline_1.indexer,
                inline_1.inline
            ])))), ns => [typed_dom_1.html(`h${ level }`, ns)]))), ([el]) => util_1.hasText(el) && !util_1.hasMedia(el)))));
        },
        {
            '../../combinator': 20,
            '../inline': 70,
            '../util': 109,
            'typed-dom': 13
        }
    ],
    59: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../combinator');
            const typed_dom_1 = _dereq_('typed-dom');
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
    60: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../combinator');
            const ulist_1 = _dereq_('./ulist');
            const olist_1 = _dereq_('./olist');
            const inline_1 = _dereq_('../inline');
            const util_1 = _dereq_('../util');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.ilist = combinator_1.lazy(() => combinator_1.block(combinator_1.fmap(combinator_1.validate(/^[-+*]([^\S\n]|\n[^\S\n]*\S)/, combinator_1.some(combinator_1.union([combinator_1.fmap(combinator_1.inits([
                    combinator_1.line(combinator_1.surround(/^[-+*](?:\s|$)/, util_1.defrag(combinator_1.trim(combinator_1.some(inline_1.inline))), '', false)),
                    combinator_1.indent(combinator_1.union([
                        ulist_1.ulist_,
                        olist_1.olist_,
                        exports.ilist_
                    ]))
                ]), () => [typed_dom_1.html('li', combinator_1.eval(util_1.defrag(combinator_1.some(inline_1.inline))('Invalid syntax: UList: Use `-` instead.')))])]))), es => [typed_dom_1.html('ul', {
                    class: 'invalid',
                    'data-invalid-syntax': 'list',
                    'data-invalid-type': 'syntax'
                }, es)])));
            exports.ilist_ = combinator_1.convert(source => source.replace(/^[-+*](?=\n|$)/, `$& `), exports.ilist);
        },
        {
            '../../combinator': 20,
            '../inline': 70,
            '../util': 109,
            './olist': 63,
            './ulist': 69,
            'typed-dom': 13
        }
    ],
    61: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../combinator');
            _dereq_('../source/unescapable');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.segment = combinator_1.lazy(() => combinator_1.block(exports.segment_));
            exports.segment_ = combinator_1.block(combinator_1.focus(/^(\$\$)(?!\$)([^\n]*)(\n(?:(?!\1[^\S\n]*(?:\n|$))[^\n]*\n){0,100})\1[^\S\n]*(?:\n|$)/, _ => [
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
            '../source/unescapable': 107,
            'typed-dom': 13
        }
    ],
    62: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../combinator');
            const line_1 = _dereq_('../source/line');
            exports.newline = combinator_1.some(combinator_1.union([line_1.blankline]));
        },
        {
            '../../combinator': 20,
            '../source/line': 105
        }
    ],
    63: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../combinator');
            const ulist_1 = _dereq_('./ulist');
            const ilist_1 = _dereq_('./ilist');
            const inline_1 = _dereq_('../inline');
            const unescapable_1 = _dereq_('../source/unescapable');
            const util_1 = _dereq_('../util');
            const memoization_1 = _dereq_('spica/memoization');
            const typed_dom_1 = _dereq_('typed-dom');
            const opener = memoization_1.memoize(pattern => new RegExp(`^${ pattern }(?:\\.\\s|\\.?(?=\\n|$))`));
            exports.olist = combinator_1.block(combinator_1.match(/^(?=([0-9]+|[a-z]+|[A-Z]+)\.(?:[^\S\n]|\n[^\S\n]*\S))/, util_1.memoize(([, index]) => index, index => combinator_1.fmap(combinator_1.some(combinator_1.union([combinator_1.fmap(combinator_1.inits([
                    combinator_1.line(combinator_1.inits([
                        combinator_1.focus(opener(pattern(type(index))), util_1.defrag(combinator_1.trim(combinator_1.surround('', combinator_1.some(unescapable_1.unescsource, /^[.\n]/), /^\.?/)))),
                        util_1.defrag(combinator_1.trim(combinator_1.some(inline_1.inline)))
                    ])),
                    combinator_1.indent(combinator_1.union([
                        ulist_1.ulist_,
                        exports.olist_,
                        ilist_1.ilist_
                    ]))
                ]), ([{textContent: index}, ...ns]) => [typed_dom_1.html('li', { value: type(index) === '1' ? format(index) : undefined }, ulist_1.fillFirstLine(ns))].map(ulist_1.verifyListItem))])), es => [typed_dom_1.html('ol', {
                    start: type(index) === '1' ? format(index) : undefined,
                    type: type(index)
                }, es)]))));
            exports.olist_ = combinator_1.convert(source => source.replace(/^([0-9]+|[A-Z]+|[a-z]+)\.?(?=\n|$)/, `$1. `), exports.olist);
            function type(index) {
                switch (true) {
                case +index === 0:
                    return undefined;
                case Number.isInteger(+index):
                    return '1';
                case index === index.toLowerCase():
                    return 'a';
                case index === index.toUpperCase():
                    return 'A';
                default:
                    throw new Error(`${ index }`);
                }
            }
            function pattern(type) {
                switch (type) {
                case undefined:
                    return `(?:${ pattern('1') }|${ pattern('a') }|${ pattern('A') })`;
                case '1':
                    return '(?:[0-9]+)';
                case 'a':
                    return '(?:[a-z]+|0)';
                case 'A':
                    return '(?:[A-Z]+|0)';
                }
            }
            function format(index) {
                switch (type(index)) {
                case undefined:
                    return undefined;
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
            '../../combinator': 20,
            '../inline': 70,
            '../source/unescapable': 107,
            '../util': 109,
            './ilist': 60,
            './ulist': 69,
            'spica/memoization': 9,
            'typed-dom': 13
        }
    ],
    64: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../combinator');
            const mention_1 = _dereq_('./paragraph/mention');
            const inline_1 = _dereq_('../inline');
            const util_1 = _dereq_('../util');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.paragraph = combinator_1.block(combinator_1.fmap(combinator_1.subsequence([
                combinator_1.some(mention_1.mention),
                util_1.defrag(combinator_1.trim(combinator_1.some(inline_1.inline)))
            ]), ns => [typed_dom_1.html('p', ns)].filter(util_1.hasContent)));
        },
        {
            '../../combinator': 20,
            '../inline': 70,
            '../util': 109,
            './paragraph/mention': 65,
            'typed-dom': 13
        }
    ],
    65: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../../combinator');
            const address_1 = _dereq_('./mention/address');
            const quote_1 = _dereq_('./mention/quote');
            exports.mention = combinator_1.block(combinator_1.subsequence([
                combinator_1.some(address_1.address),
                quote_1.quote
            ]), false);
        },
        {
            '../../../combinator': 20,
            './mention/address': 66,
            './mention/quote': 67
        }
    ],
    66: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../../../combinator');
            const inline_1 = _dereq_('../../../inline');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.address = combinator_1.line(combinator_1.match(/^(?=((>+)(?:[a-zA-Z0-9]+(?:[/-][a-zA-Z0-9]+)*|https?:\/\/[^/]\S*)\s*$))/, ([, addr, {length: level}]) => combinator_1.convert(source => `{ ${ addr.slice(level).trim() } }${ source.slice(addr.length) }`, combinator_1.fmap(combinator_1.union([inline_1.link]), ([el]) => [typed_dom_1.html('span', {
                    class: 'address',
                    href: null,
                    'data-level': `${ level }`
                }, [typed_dom_1.define(el, { href: null }, addr.trim())])]))));
        },
        {
            '../../../../combinator': 20,
            '../../../inline': 70,
            'typed-dom': 13
        }
    ],
    67: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../../../combinator');
            const line_1 = _dereq_('../../../source/line');
            const autolink_1 = _dereq_('../../../autolink');
            const util_1 = _dereq_('../../../util');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.quote = combinator_1.lazy(() => combinator_1.block(combinator_1.fmap(combinator_1.union([
                combinator_1.validate(/^(?=>+([^\S\n]|\n\s*\S))/, combinator_1.rewrite(combinator_1.some(combinator_1.validate(/^(?=>+(\s|$))/, line_1.contentline)), combinator_1.convert(source => source.replace(/\n$/, ''), util_1.defrag(combinator_1.some(autolink_1.autolink))))),
                combinator_1.validate(/^(?=>+([^>\n]|\n\s*\S))/, combinator_1.rewrite(combinator_1.some(combinator_1.validate(/^(?=>+)/, line_1.contentline)), combinator_1.convert(source => source.replace(/\n$/, ''), util_1.defrag(combinator_1.some(autolink_1.autolink)))))
            ]), ns => [typed_dom_1.html('span', { class: 'quote' }, ns)]), false));
        },
        {
            '../../../../combinator': 20,
            '../../../autolink': 47,
            '../../../source/line': 105,
            '../../../util': 109,
            'typed-dom': 13
        }
    ],
    68: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../combinator');
            const inline_1 = _dereq_('../inline');
            const util_1 = _dereq_('../util');
            const concat_1 = _dereq_('spica/concat');
            const typed_dom_1 = _dereq_('typed-dom');
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
                    for (const row of rows) {
                        void align(row, extend(aligns, row.children.length));
                    }
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
            const row = (parser, strict) => combinator_1.verify(combinator_1.fmap(combinator_1.line(combinator_1.trimEnd(combinator_1.surround(/^(?=\|)/, combinator_1.some(combinator_1.union([parser])), /^\|?$/, strict))), es => [typed_dom_1.html('tr', es)]), ([el]) => !util_1.hasMedia(el));
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
            '../inline': 70,
            '../util': 109,
            'spica/concat': 7,
            'typed-dom': 13
        }
    ],
    69: [
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
            const opener = /^-(?:\s|$)/;
            exports.ulist = combinator_1.lazy(() => combinator_1.block(combinator_1.fmap(combinator_1.validate(/^-([^\S\n]|\n[^\S\n]*\S)/, combinator_1.some(combinator_1.union([combinator_1.fmap(combinator_1.inits([
                    combinator_1.line(combinator_1.surround(opener, util_1.defrag(combinator_1.trim(combinator_1.some(inline_1.inline))), '', false)),
                    combinator_1.indent(combinator_1.union([
                        exports.ulist_,
                        olist_1.olist_,
                        ilist_1.ilist_
                    ]))
                ]), ns => [typed_dom_1.html('li', fillFirstLine(ns))].map(verifyListItem))]))), es => [typed_dom_1.html('ul', es)])));
            exports.ulist_ = combinator_1.convert(source => source.replace(/^-(?=\n|$)/, `$& `), exports.ulist);
            function fillFirstLine(ns) {
                return ns[0] instanceof HTMLUListElement || ns[0] instanceof HTMLOListElement ? concat_1.concat([typed_dom_1.html('br')], ns) : ns;
            }
            exports.fillFirstLine = fillFirstLine;
            function verifyListItem(el) {
                if (util_1.hasMedia(el)) {
                    void typed_dom_1.define(el, {
                        class: 'invalid',
                        'data-invalid-syntax': 'listitem',
                        'data-invalid-type': 'content'
                    }, combinator_1.eval(util_1.defrag(combinator_1.some(inline_1.inline))('Invalid syntax: ListItem: Unable to use media syntax in lists.')));
                }
                return el;
            }
            exports.verifyListItem = verifyListItem;
        },
        {
            '../../combinator': 20,
            '../inline': 70,
            '../util': 109,
            './ilist': 60,
            './olist': 63,
            'spica/concat': 7,
            'typed-dom': 13
        }
    ],
    70: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../combinator');
            const annotation_1 = _dereq_('./inline/annotation');
            const authority_1 = _dereq_('./inline/authority');
            const template_1 = _dereq_('./inline/template');
            const extension_1 = _dereq_('./inline/extension');
            const link_1 = _dereq_('./inline/link');
            const ruby_1 = _dereq_('./inline/ruby');
            const html_1 = _dereq_('./inline/html');
            const comment_1 = _dereq_('./inline/comment');
            const insertion_1 = _dereq_('./inline/insertion');
            const deletion_1 = _dereq_('./inline/deletion');
            const emphasis_1 = _dereq_('./inline/emphasis');
            const strong_1 = _dereq_('./inline/strong');
            const code_1 = _dereq_('./inline/code');
            const math_1 = _dereq_('./inline/math');
            const media_1 = _dereq_('./inline/media');
            const htmlentity_1 = _dereq_('./inline/htmlentity');
            const shortmedia_1 = _dereq_('./inline/shortmedia');
            const autolink_1 = _dereq_('./inline/autolink');
            const bracket_1 = _dereq_('./inline/bracket');
            const text_1 = _dereq_('./source/text');
            exports.inline = combinator_1.union([
                annotation_1.annotation,
                authority_1.authority,
                template_1.template,
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
                shortmedia_1.shortmedia,
                autolink_1.autolink,
                bracket_1.bracket,
                text_1.text
            ]);
            var indexer_1 = _dereq_('./inline/extension/indexer');
            exports.indexer = indexer_1.indexer;
            exports.index = indexer_1.index;
            var label_1 = _dereq_('./inline/extension/label');
            exports.label = label_1.label;
            exports.isGroup = label_1.isGroup;
            exports.isFixed = label_1.isFixed;
            var link_2 = _dereq_('./inline/link');
            exports.link = link_2.link;
            var media_2 = _dereq_('./inline/media');
            exports.media = media_2.media;
            var uri_1 = _dereq_('./inline/autolink/uri');
            exports.uri = uri_1.uri;
            var shortmedia_2 = _dereq_('./inline/shortmedia');
            exports.shortmedia = shortmedia_2.shortmedia;
        },
        {
            '../combinator': 20,
            './inline/annotation': 71,
            './inline/authority': 72,
            './inline/autolink': 73,
            './inline/autolink/uri': 78,
            './inline/bracket': 79,
            './inline/code': 80,
            './inline/comment': 81,
            './inline/deletion': 82,
            './inline/emphasis': 83,
            './inline/extension': 84,
            './inline/extension/indexer': 87,
            './inline/extension/label': 88,
            './inline/html': 90,
            './inline/htmlentity': 91,
            './inline/insertion': 92,
            './inline/link': 93,
            './inline/math': 94,
            './inline/media': 95,
            './inline/ruby': 96,
            './inline/shortmedia': 97,
            './inline/strong': 98,
            './inline/template': 99,
            './source/text': 106
        }
    ],
    71: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../combinator');
            const inline_1 = _dereq_('../inline');
            const util_1 = _dereq_('../util');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.annotation = combinator_1.lazy(() => combinator_1.verify(combinator_1.fmap(util_1.trimNodeEnd(combinator_1.surround(/^\n?\(\((?:[^\S\n]*\n)?/, util_1.defrag(combinator_1.some(combinator_1.union([inline_1.inline]), /^\n?\)\)/)), /^\n?\)\)/)), ns => [typed_dom_1.html('sup', { class: 'annotation' }, ns)]), ([el]) => util_1.hasTightText(el) && !util_1.hasMedia(el) && !util_1.hasAnnotationOrAuthority(el)));
        },
        {
            '../../combinator': 20,
            '../inline': 70,
            '../util': 109,
            'typed-dom': 13
        }
    ],
    72: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../combinator');
            const inline_1 = _dereq_('../inline');
            const util_1 = _dereq_('../util');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.authority = combinator_1.lazy(() => combinator_1.subline(combinator_1.verify(combinator_1.fmap(util_1.trimNodeEnd(combinator_1.surround('[[', util_1.defrag(combinator_1.some(combinator_1.union([inline_1.inline]), /^\n|^]]/)), ']]')), ns => [typed_dom_1.html('sup', { class: 'authority' }, ns)]), ([el]) => util_1.hasTightText(el) && !util_1.hasMedia(el) && !util_1.hasAnnotationOrAuthority(el))));
        },
        {
            '../../combinator': 20,
            '../inline': 70,
            '../util': 109,
            'typed-dom': 13
        }
    ],
    73: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../combinator');
            const uri_1 = _dereq_('./autolink/uri');
            const email_1 = _dereq_('./autolink/email');
            const channel_1 = _dereq_('./autolink/channel');
            const account_1 = _dereq_('./autolink/account');
            const hashtag_1 = _dereq_('./autolink/hashtag');
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
            './autolink/account': 74,
            './autolink/channel': 75,
            './autolink/email': 76,
            './autolink/hashtag': 77,
            './autolink/uri': 78
        }
    ],
    74: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../../combinator');
            const unescapable_1 = _dereq_('../../source/unescapable');
            const util_1 = _dereq_('../../util');
            const typed_dom_1 = _dereq_('typed-dom');
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
            '../../source/unescapable': 107,
            '../../util': 109,
            'typed-dom': 13
        }
    ],
    75: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../../combinator');
            _dereq_('../../source/unescapable');
            const account_1 = _dereq_('./account');
            const hashtag_1 = _dereq_('./hashtag');
            const util_1 = _dereq_('../../util');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.channel = combinator_1.subline(combinator_1.fmap(combinator_1.sequence([
                combinator_1.verify(account_1.account, ([node]) => node instanceof HTMLAnchorElement),
                combinator_1.some(combinator_1.verify(hashtag_1.hashtag_, ([node]) => node instanceof HTMLAnchorElement))
            ]), ns => [typed_dom_1.html('a', {
                    class: 'channel',
                    rel: 'noopener'
                }, util_1.stringify(ns))]));
        },
        {
            '../../../combinator': 20,
            '../../source/unescapable': 107,
            '../../util': 109,
            './account': 74,
            './hashtag': 77,
            'typed-dom': 13
        }
    ],
    76: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../../combinator');
            const unescapable_1 = _dereq_('../../source/unescapable');
            const util_1 = _dereq_('../../util');
            const typed_dom_1 = _dereq_('typed-dom');
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
            '../../source/unescapable': 107,
            '../../util': 109,
            'typed-dom': 13
        }
    ],
    77: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../../combinator');
            const unescapable_1 = _dereq_('../../source/unescapable');
            const util_1 = _dereq_('../../util');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.hashtag = combinator_1.lazy(() => combinator_1.verify(exports.hashtag_, (_, rest) => !rest.startsWith('#')));
            exports.hashtag_ = combinator_1.subline(combinator_1.union([
                combinator_1.focus(/^#(?:[a-zA-Z0-9]|[^\x00-\x7F\s])+/, tag => [
                    [typed_dom_1.html('a', {
                            class: 'hashtag',
                            rel: 'noopener'
                        }, tag)],
                    ''
                ]),
                combinator_1.focus(/^(?:[a-zA-Z0-9]|[^\x00-\x7F\s])?#+/, util_1.defrag(combinator_1.some(unescapable_1.unescsource)))
            ]));
        },
        {
            '../../../combinator': 20,
            '../../source/unescapable': 107,
            '../../util': 109,
            'typed-dom': 13
        }
    ],
    78: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../../combinator');
            const unescapable_1 = _dereq_('../../source/unescapable');
            const link_1 = _dereq_('../link');
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
            '../../source/unescapable': 107,
            '../link': 93
        }
    ],
    79: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const inline_1 = _dereq_('../inline');
            const combinator_1 = _dereq_('../../combinator');
            const util_1 = _dereq_('../util');
            const typed_dom_1 = _dereq_('typed-dom');
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
                combinator_1.fmap(combinator_1.surround('"', combinator_1.some(inline_1.inline, '"'), '"', false), ns => [
                    typed_dom_1.text('"'),
                    ...ns,
                    typed_dom_1.text('"')
                ])
            ])));
        },
        {
            '../../combinator': 20,
            '../inline': 70,
            '../util': 109,
            'typed-dom': 13
        }
    ],
    80: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../combinator');
            const unescapable_1 = _dereq_('../source/unescapable');
            const typed_dom_1 = _dereq_('typed-dom');
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
            '../source/unescapable': 107,
            'typed-dom': 13
        }
    ],
    81: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../combinator');
            const typed_dom_1 = _dereq_('typed-dom');
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
            'typed-dom': 13
        }
    ],
    82: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const inline_1 = _dereq_('../inline');
            const combinator_1 = _dereq_('../../combinator');
            const util_1 = _dereq_('../util');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.deletion = combinator_1.lazy(() => combinator_1.verify(combinator_1.fmap(combinator_1.validate(/^~~[\s\S]+?~~/, combinator_1.surround('~~', util_1.defrag(combinator_1.some(combinator_1.some(combinator_1.union([inline_1.inline]), '~~'))), '~~')), ns => [typed_dom_1.html('del', ns)]), ([el]) => !util_1.hasInsOrDel(el)));
        },
        {
            '../../combinator': 20,
            '../inline': 70,
            '../util': 109,
            'typed-dom': 13
        }
    ],
    83: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const inline_1 = _dereq_('../inline');
            const combinator_1 = _dereq_('../../combinator');
            const strong_1 = _dereq_('./strong');
            const util_1 = _dereq_('../util');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.emphasis = combinator_1.lazy(() => combinator_1.verify(combinator_1.fmap(util_1.trimNodeEnd(combinator_1.validate(/^\*\S[\s\S]*?\*/, combinator_1.surround('*', util_1.defrag(combinator_1.some(combinator_1.union([
                strong_1.strong,
                combinator_1.some(inline_1.inline, '*')
            ]))), '*'))), ns => [typed_dom_1.html('em', ns)]), ([el]) => util_1.hasTightText(el)));
        },
        {
            '../../combinator': 20,
            '../inline': 70,
            '../util': 109,
            './strong': 98,
            'typed-dom': 13
        }
    ],
    84: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../combinator');
            const index_1 = _dereq_('./extension/index');
            const label_1 = _dereq_('./extension/label');
            const data_1 = _dereq_('./extension/data');
            const placeholder_1 = _dereq_('./extension/placeholder');
            exports.extension = combinator_1.validate(/^[[$]/, combinator_1.union([
                index_1.index,
                label_1.label,
                data_1.data,
                placeholder_1.placeholder
            ]));
        },
        {
            '../../combinator': 20,
            './extension/data': 85,
            './extension/index': 86,
            './extension/label': 88,
            './extension/placeholder': 89
        }
    ],
    85: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const inline_1 = _dereq_('../../inline');
            const combinator_1 = _dereq_('../../../combinator');
            const unescapable_1 = _dereq_('../../source/unescapable');
            const util_1 = _dereq_('../../util');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.data = combinator_1.lazy(() => combinator_1.fmap(combinator_1.surround('[~', combinator_1.inits([
                combinator_1.focus(/^[a-z]+(?:-[a-z0-9]+)*(?:=[a-z0-9]+(?:-[a-z0-9]+)*)?/, util_1.defrag(combinator_1.some(unescapable_1.unescsource))),
                combinator_1.surround('|', util_1.defrag(combinator_1.some(inline_1.inline, ']')), '', false)
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
            '../../inline': 70,
            '../../source/unescapable': 107,
            '../../util': 109,
            'typed-dom': 13
        }
    ],
    86: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const inline_1 = _dereq_('../../inline');
            const combinator_1 = _dereq_('../../../combinator');
            const link_1 = _dereq_('../link');
            const indexer_1 = _dereq_('./indexer');
            const util_1 = _dereq_('../../util');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.index = combinator_1.lazy(() => combinator_1.subline(combinator_1.fmap(indexer_1.index(combinator_1.verify(util_1.trimNodeEnd(combinator_1.surround('[#', combinator_1.rewrite(combinator_1.some(inline_1.inline, /^[\n\]]/), combinator_1.convert(query => `[${ query }]{#}`, combinator_1.union([link_1.link]))), ']')), ([el]) => util_1.hasTightText(el) && !util_1.hasMedia(el))), ([el]) => [typed_dom_1.define(el, {
                    id: null,
                    href: `#${ el.id }`
                })])));
        },
        {
            '../../../combinator': 20,
            '../../inline': 70,
            '../../util': 109,
            '../link': 93,
            './indexer': 87,
            'typed-dom': 13
        }
    ],
    87: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../../combinator');
            const index_1 = _dereq_('./index');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.indexer = combinator_1.lazy(() => combinator_1.line(combinator_1.fmap(combinator_1.surround(/^\s+(?=\[#)/, combinator_1.trim(combinator_1.union([index_1.index])), /^(?=\s*$)/), ([el]) => [typed_dom_1.html('span', {
                    class: 'indexer',
                    'data-index': el.getAttribute('href').slice(el.hash.indexOf(':') + 1)
                })])));
            function index(parser) {
                return combinator_1.fmap(parser, ([el]) => [typed_dom_1.define(el, { id: identifier(text(el)) || null })]);
            }
            exports.index = index;
            function text(source) {
                const indexer = source.querySelector('.indexer');
                if (indexer)
                    return indexer.getAttribute('data-index');
                const target = source.cloneNode(true);
                for (const el of target.querySelectorAll('code[data-src], .math[data-src]')) {
                    void typed_dom_1.define(el, el.getAttribute('data-src'));
                }
                return target.textContent.trim();
            }
            exports.text = text;
            function identifier(index) {
                return index ? `index:${ index.trim().replace(/\s+/g, '-') }` : '';
            }
        },
        {
            '../../../combinator': 20,
            './index': 86,
            'typed-dom': 13
        }
    ],
    88: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../../combinator');
            _dereq_('../../source/unescapable');
            const link_1 = _dereq_('../link');
            const util_1 = _dereq_('../../util');
            const typed_dom_1 = _dereq_('typed-dom');
            const parser = combinator_1.focus(/^(?:\$[a-z]*)(?:(?:-[a-z][0-9a-z]*)+(?:-0(?:\.0)*)?|-[0-9]+(?:\.[0-9]+)*)/, combinator_1.convert(query => `[\\${ query }]{#}`, link_1.link));
            exports.label = combinator_1.subline(combinator_1.verify(combinator_1.fmap(combinator_1.union([
                combinator_1.surround('[', parser, ']'),
                parser
            ]), ([el]) => [typed_dom_1.define(el, {
                    class: 'label',
                    'data-label': el.textContent.slice(el.textContent[1] === '-' ? 0 : 1),
                    href: null
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
            '../../source/unescapable': 107,
            '../../util': 109,
            '../link': 93,
            'typed-dom': 13
        }
    ],
    89: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const inline_1 = _dereq_('../../inline');
            const combinator_1 = _dereq_('../../../combinator');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.placeholder = combinator_1.lazy(() => combinator_1.subline(combinator_1.fmap(combinator_1.surround('[', combinator_1.validate(/^[:^](?!\])/, combinator_1.some(combinator_1.union([inline_1.inline]), /^[\n\]]/)), ']'), () => [typed_dom_1.html('span', {
                    class: 'invalid',
                    'data-invalid-syntax': 'extension',
                    'data-invalid-type': 'syntax'
                }, combinator_1.eval(combinator_1.some(inline_1.inline)(`Invalid syntax: Extension: Invalid flag.`)))])));
        },
        {
            '../../../combinator': 20,
            '../../inline': 70,
            'typed-dom': 13
        }
    ],
    90: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const inline_1 = _dereq_('../inline');
            const combinator_1 = _dereq_('../../combinator');
            const unescapable_1 = _dereq_('../source/unescapable');
            const escapable_1 = _dereq_('../source/escapable');
            const char_1 = _dereq_('../source/char');
            const util_1 = _dereq_('../util');
            const typed_dom_1 = _dereq_('typed-dom');
            const attributes = {
                bdo: {
                    dir: Object.freeze([
                        'ltr',
                        'rtl'
                    ])
                }
            };
            exports.html = combinator_1.lazy(() => combinator_1.validate(/^<[a-z]+[ >]/, combinator_1.union([
                combinator_1.match(/^(?=<(sup|sub|small|bdi|bdo)(?: [^\n]*?)?>)/, util_1.memoize(([, tag]) => tag, tag => combinator_1.verify(combinator_1.fmap(combinator_1.sequence([
                    util_1.dup(combinator_1.surround(`<${ tag }`, combinator_1.some(util_1.defrag(combinator_1.union([exports.attribute]))), /^ ?>/, false)),
                    util_1.dup(combinator_1.surround(``, util_1.trimNode(util_1.defrag(combinator_1.some(combinator_1.union([inline_1.inline]), `</${ tag }>`))), `</${ tag }>`))
                ]), ([attrs_, contents]) => [typed_dom_1.html(tag, attrs(attributes[tag], attrs_.map(t => t.textContent), new Set(), 'html'), contents)]), ([el]) => !el.matches('.invalid') && util_1.hasTightText(el)))),
                combinator_1.match(/^(?=<(wbr)(?: [^\n]*?)?>)/, util_1.memoize(([, tag]) => tag, tag => combinator_1.verify(combinator_1.fmap(combinator_1.sequence([util_1.dup(combinator_1.surround(`<${ tag }`, combinator_1.some(util_1.defrag(combinator_1.union([exports.attribute]))), /^ ?>/, false))]), ([attrs_]) => [typed_dom_1.html(tag, attrs(attributes[tag], attrs_.map(t => t.textContent), new Set(), 'html'), [])]), ([el]) => !el.matches('.invalid')))),
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
            function attrs(spec, params, classes, syntax) {
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
                        spec.hasOwnProperty(key) && spec[key].includes(value) ? result[key] = value || '' : void classes.add('invalid');
                    }
                }
                if (classes.has('invalid')) {
                    result.class = [...classes].join(' ');
                    result['data-invalid-syntax'] = syntax;
                    result['data-invalid-type'] = 'parameter';
                }
                return result;
            }
            exports.attrs = attrs;
        },
        {
            '../../combinator': 20,
            '../inline': 70,
            '../source/char': 103,
            '../source/escapable': 104,
            '../source/unescapable': 107,
            '../util': 109,
            'typed-dom': 13
        }
    ],
    91: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../combinator');
            _dereq_('../source/unescapable');
            const typed_dom_1 = _dereq_('typed-dom');
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
            '../source/unescapable': 107,
            'typed-dom': 13
        }
    ],
    92: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const inline_1 = _dereq_('../inline');
            const combinator_1 = _dereq_('../../combinator');
            const util_1 = _dereq_('../util');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.insertion = combinator_1.lazy(() => combinator_1.verify(combinator_1.fmap(combinator_1.validate(/^\+\+[\s\S]+?\+\+/, combinator_1.surround('++', util_1.defrag(combinator_1.some(combinator_1.some(combinator_1.union([inline_1.inline]), '++'))), '++')), ns => [typed_dom_1.html('ins', ns)]), ([el]) => !util_1.hasInsOrDel(el)));
        },
        {
            '../../combinator': 20,
            '../inline': 70,
            '../util': 109,
            'typed-dom': 13
        }
    ],
    93: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const inline_1 = _dereq_('../inline');
            const combinator_1 = _dereq_('../../combinator');
            const unescapable_1 = _dereq_('../source/unescapable');
            const html_1 = _dereq_('./html');
            const util_1 = _dereq_('../util');
            const uri_1 = _dereq_('../string/uri');
            const concat_1 = _dereq_('spica/concat');
            const typed_dom_1 = _dereq_('typed-dom');
            const log = new WeakSet();
            exports.attributes = { nofollow: [undefined] };
            exports.link = combinator_1.lazy(() => combinator_1.subline(combinator_1.bind(combinator_1.verify(combinator_1.fmap(combinator_1.validate(/^(\[.*?\])?{.+?}/, combinator_1.tails([
                util_1.wrap(combinator_1.surround('[', util_1.trimNodeEnd(util_1.defrag(combinator_1.some(combinator_1.union([inline_1.inline]), /^[\n\]]/))), ']', false)),
                util_1.wrap(combinator_1.surround('{', combinator_1.inits([
                    exports.uri,
                    combinator_1.some(util_1.defrag(html_1.attribute))
                ]), /^ ?}/))
            ])), ns => concat_1.concat([...Array(2 - ns.length)].map(() => typed_dom_1.frag()), ns)), ([text]) => {
                if (util_1.hasMedia(text)) {
                    if (text.firstChild && text.firstChild.firstChild && text.firstChild.firstChild === text.querySelector('a > .media:last-child')) {
                        if (log.has(text.firstChild))
                            return false;
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
                if (util_1.hasMedia(el)) {
                    void log.add(el);
                }
                return [
                    [typed_dom_1.define(el, attrs(exports.attributes, params, new Set(el.classList), 'link'))],
                    rest
                ];
            })));
            exports.uri = combinator_1.subline(util_1.defrag(combinator_1.match(/^ ?(?! )/, util_1.memoize(([flag]) => flag, flag => combinator_1.some(combinator_1.union([
                exports.bracket,
                unescapable_1.unescsource
            ]), flag === ' ' ? /^\s/ : /^[\s}]/)))));
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
            function attrs(spec, params, classes, syntax) {
                const attrs = html_1.attrs(spec, params, classes, syntax);
                for (const name of ['nofollow']) {
                    attrs[name] = undefined;
                }
                return attrs;
            }
            exports.attrs = attrs;
        },
        {
            '../../combinator': 20,
            '../inline': 70,
            '../source/unescapable': 107,
            '../string/uri': 108,
            '../util': 109,
            './html': 90,
            'spica/concat': 7,
            'typed-dom': 13
        }
    ],
    94: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../combinator');
            const escapable_1 = _dereq_('../source/escapable');
            const util_1 = _dereq_('../util');
            const cache_1 = _dereq_('spica/cache');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.cache = new cache_1.Cache(20);
            exports.math = combinator_1.subline(combinator_1.verify(combinator_1.rewrite(combinator_1.surround('${', combinator_1.some(combinator_1.union([escapable_1.escsource]), /^}\$|^\n/), '}$'), combinator_1.convert(source => `\${${ source.slice(2, -2).trim() }}$`, source => [
                exports.cache.has(source) ? [exports.cache.get(source).cloneNode(true)] : [typed_dom_1.html('span', {
                        class: 'math notranslate',
                        'data-src': source
                    }, source)],
                ''
            ])), ([el]) => util_1.hasText(typed_dom_1.text(el.textContent.slice(2, -2)))));
        },
        {
            '../../combinator': 20,
            '../source/escapable': 104,
            '../util': 109,
            'spica/cache': 6,
            'typed-dom': 13
        }
    ],
    95: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../combinator');
            const text_1 = _dereq_('../source/text');
            const link_1 = _dereq_('./link');
            const html_1 = _dereq_('./html');
            const uri_1 = _dereq_('../string/uri');
            const util_1 = _dereq_('../util');
            const cache_1 = _dereq_('spica/cache');
            const concat_1 = _dereq_('spica/concat');
            const typed_dom_1 = _dereq_('typed-dom');
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
                void typed_dom_1.define(el, link_1.attrs(link_1.attributes, params, new Set(el.classList), 'media'));
                if (!el.matches('img'))
                    return [
                        [el],
                        rest
                    ];
                return combinator_1.fmap(link_1.link, ([link]) => [typed_dom_1.define(link, [el])])(`{ ${ INSECURE_URL }${ params.map(p => ' ' + p).join('') } }${ rest }`);
            }));
        },
        {
            '../../combinator': 20,
            '../source/text': 106,
            '../string/uri': 108,
            '../util': 109,
            './html': 90,
            './link': 93,
            'spica/cache': 6,
            'spica/concat': 7,
            'typed-dom': 13
        }
    ],
    96: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../combinator');
            const htmlentity_1 = _dereq_('./htmlentity');
            const text_1 = _dereq_('../source/text');
            const util_1 = _dereq_('../util');
            const concat_1 = _dereq_('spica/concat');
            const typed_dom_1 = _dereq_('typed-dom');
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
            ]), ([text, ruby]) => text.length >= ruby.length), ([text, ruby]) => [text.reduce((acc, _, i) => concat_1.concat(concat_1.concat(acc, [text[i]]), i < ruby.length && ruby[i].textContent.trim() !== '' ? [
                    typed_dom_1.html('rp', '('),
                    typed_dom_1.html('rt', [ruby[i]]),
                    typed_dom_1.html('rp', ')')
                ] : [typed_dom_1.html('rt')]), [])]), ([ns]) => [typed_dom_1.html('ruby', ns)]));
        },
        {
            '../../combinator': 20,
            '../source/text': 106,
            '../util': 109,
            './htmlentity': 91,
            'spica/concat': 7,
            'typed-dom': 13
        }
    ],
    97: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../combinator');
            const uri_1 = _dereq_('./autolink/uri');
            const media_1 = _dereq_('./media');
            exports.shortmedia = combinator_1.subline(combinator_1.union([combinator_1.surround(/^!(?=h?ttps?:\/\/[^/?#\s])/, combinator_1.rewrite(uri_1.uri, combinator_1.convert(source => `!{${ uri_1.address(source) }${ uri_1.attribute(source) }}`, media_1.media)), '')]));
        },
        {
            '../../combinator': 20,
            './autolink/uri': 78,
            './media': 95
        }
    ],
    98: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const inline_1 = _dereq_('../inline');
            const combinator_1 = _dereq_('../../combinator');
            const util_1 = _dereq_('../util');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.strong = combinator_1.lazy(() => combinator_1.verify(combinator_1.fmap(util_1.trimNodeEnd(combinator_1.validate(/^\*\*\S[\s\S]*?\*\*/, combinator_1.surround('**', util_1.defrag(combinator_1.some(combinator_1.union([inline_1.inline]), '**')), '**'))), ns => [typed_dom_1.html('strong', ns)]), ([el]) => util_1.hasTightText(el)));
        },
        {
            '../../combinator': 20,
            '../inline': 70,
            '../util': 109,
            'typed-dom': 13
        }
    ],
    99: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../combinator');
            const unescapable_1 = _dereq_('../source/unescapable');
            const escapable_1 = _dereq_('../source/escapable');
            const util_1 = _dereq_('../util');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.template = combinator_1.lazy(() => combinator_1.subline(combinator_1.tails([
                combinator_1.focus(/^!/, unescapable_1.unescsource),
                combinator_1.rewrite(combinator_1.surround('{{', util_1.defrag(combinator_1.some(combinator_1.union([escapable_1.escsource]), /^\n|^}}/)), '}}', false), source => [
                    [typed_dom_1.html('span', { class: 'template' }, source)],
                    ''
                ])
            ])));
        },
        {
            '../../combinator': 20,
            '../source/escapable': 104,
            '../source/unescapable': 107,
            '../util': 109,
            'typed-dom': 13
        }
    ],
    100: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../combinator');
            const ja_1 = _dereq_('./locale/ja');
            const typed_dom_1 = _dereq_('typed-dom');
            function localize(block) {
                return combinator_1.fmap(block, es => {
                    for (const block of es) {
                        for (const el of block.querySelectorAll('.linebreak')) {
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
            './locale/ja': 101,
            'typed-dom': 13
        }
    ],
    101: [
        function (_dereq_, module, exports) {
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
    102: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const normalization_1 = _dereq_('./api/normalization');
            const combinator_1 = _dereq_('../combinator');
            const codeblock_1 = _dereq_('./block/codeblock');
            const mathblock_1 = _dereq_('./block/mathblock');
            const extension_1 = _dereq_('./block/extension');
            const line_1 = _dereq_('./source/line');
            const parser = combinator_1.union([
                codeblock_1.segment,
                mathblock_1.segment,
                extension_1.segment,
                combinator_1.some(line_1.contentline),
                combinator_1.some(line_1.blankline)
            ]);
            function segment(source) {
                const segments = [];
                while (source !== '') {
                    const rest = combinator_1.exec(parser(source));
                    void segments.push(source.slice(0, source.length - rest.length));
                    source = rest;
                }
                return segments;
            }
            exports.segment = segment;
        },
        {
            '../combinator': 20,
            './api/normalization': 44,
            './block/codeblock': 50,
            './block/extension': 52,
            './block/mathblock': 61,
            './source/line': 105
        }
    ],
    103: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const typed_dom_1 = _dereq_('typed-dom');
            function char(char) {
                return source => {
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
                };
            }
            exports.char = char;
            ;
        },
        { 'typed-dom': 13 }
    ],
    104: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const typed_dom_1 = _dereq_('typed-dom');
            const separator = /\s|(?=[\x00-\x7F])[^a-zA-Z0-9\s]/;
            exports.escsource = source => {
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
    105: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../../combinator');
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
    106: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const typed_dom_1 = _dereq_('typed-dom');
            exports.separator = /\s|(?=[\x00-\x7F])[^a-zA-Z0-9\s]|[a-zA-Z0-9][a-zA-Z0-9.+_-]*@[a-zA-Z0-9]|\S#/;
            const next = /[\S\n]|$/;
            exports.text = source => {
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
    107: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const text_1 = _dereq_('./text');
            const typed_dom_1 = _dereq_('typed-dom');
            exports.unescsource = source => {
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
            };
        },
        {
            './text': 106,
            'typed-dom': 13
        }
    ],
    108: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const typed_dom_1 = _dereq_('typed-dom');
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
    109: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const combinator_1 = _dereq_('../combinator');
            const inline_1 = _dereq_('./inline');
            const memoization_1 = _dereq_('spica/memoization');
            const typed_dom_1 = _dereq_('typed-dom');
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
            function suppress(el) {
                for (const child of [...el.children].filter(child => !child.matches('blockquote, .example'))) {
                    if (child.matches('[id]')) {
                        void child.removeAttribute('id');
                    }
                    if (child.matches('figure[data-label]:not([data-index])') && !inline_1.isFixed(child.getAttribute('data-label'))) {
                        void child.setAttribute('data-label', child.getAttribute('data-label').split('-', 1)[0] + '-0');
                    }
                    if (child.matches('figure')) {
                        void suppress(child.lastElementChild);
                        continue;
                    }
                    for (const el of child.querySelectorAll('[id]')) {
                        void el.removeAttribute('id');
                    }
                    for (const el of child.querySelectorAll('a[href^="#"]')) {
                        void el.setAttribute('onclick', 'return false;');
                    }
                }
                return el;
            }
            exports.suppress = suppress;
            function memoize(f, g) {
                g = memoization_1.memoize(g);
                return a => g(f(a));
            }
            exports.memoize = memoize;
        },
        {
            '../combinator': 20,
            './inline': 70,
            'spica/memoization': 9,
            'typed-dom': 13
        }
    ],
    110: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var render_1 = _dereq_('./renderer/render');
            exports.render = render_1.render;
        },
        { './renderer/render': 111 }
    ],
    111: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const code_1 = _dereq_('./render/code');
            const math_1 = _dereq_('./render/math');
            const media_1 = _dereq_('./render/media');
            const graph_1 = _dereq_('./render/graph');
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
                            void el.classList.add('media');
                            void el.setAttribute('data-src', new URL(target.getAttribute('data-src'), window.location.href).href);
                            const scope = target.matches('a > .media') && !el.matches('img') ? target.closest('a') : target;
                            return void scope.parentElement.replaceChild(el, scope);
                        }
                    case !!opts.graph && target.matches('.graph'):
                        return void graph_1.graph(target, opts.graph);
                    case target.childNodes.length === 0:
                    case target.matches('pre, .math, .graph'):
                        return;
                    default:
                        for (const el of target.querySelectorAll('img.media:not([src])[data-src], a > .media:not(img), pre.code, .graph, .math')) {
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
            './render/code': 112,
            './render/graph': 113,
            './render/math': 117,
            './render/media': 118
        }
    ],
    112: [
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
    113: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const sequence_1 = _dereq_('./graph/sequence');
            const flowchart_1 = _dereq_('./graph/flowchart');
            const graphviz_1 = _dereq_('./graph/graphviz');
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
            './graph/flowchart': 114,
            './graph/graphviz': 115,
            './graph/sequence': 116
        }
    ],
    114: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const typed_dom_1 = _dereq_('typed-dom');
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
    115: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const typed_dom_1 = _dereq_('typed-dom');
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
    116: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const typed_dom_1 = _dereq_('typed-dom');
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
    117: [
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
            '../../parser/inline/math': 94,
            'typed-dom': 13
        }
    ],
    118: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const twitter_1 = _dereq_('./media/twitter');
            const youtube_1 = _dereq_('./media/youtube');
            const gist_1 = _dereq_('./media/gist');
            const slideshare_1 = _dereq_('./media/slideshare');
            const pdf_1 = _dereq_('./media/pdf');
            const video_1 = _dereq_('./media/video');
            const audio_1 = _dereq_('./media/audio');
            const image_1 = _dereq_('./media/image');
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
                return opts.twitter && opts.twitter(url) || opts.youtube && opts.youtube(url) || opts.gist && opts.gist(url) || opts.slideshare && opts.slideshare(url) || opts.pdf && opts.pdf(url) || opts.video && opts.video(url, alt) || opts.audio && opts.audio(url, alt) || opts.image && opts.image(url, alt);
            }
            exports.media = media;
        },
        {
            './media/audio': 119,
            './media/gist': 120,
            './media/image': 121,
            './media/pdf': 122,
            './media/slideshare': 123,
            './media/twitter': 124,
            './media/video': 125,
            './media/youtube': 126
        }
    ],
    119: [
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
                    src: url.href,
                    alt,
                    controls: '',
                    style: 'width: 100%;'
                }).cloneNode(true));
            }
            exports.audio = audio;
        },
        {
            '../../../parser/inline/media': 95,
            'typed-dom': 13
        }
    ],
    120: [
        function (_dereq_, module, exports) {
            (function (global) {
                'use strict';
                Object.defineProperty(exports, '__esModule', { value: true });
                const parser_1 = _dereq_('../../../parser');
                const media_1 = _dereq_('../../../parser/inline/media');
                const dompurify_1 = typeof window !== 'undefined' ? window['DOMPurify'] : typeof global !== 'undefined' ? global['DOMPurify'] : null;
                const typed_dom_1 = _dereq_('typed-dom');
                const origins = new Set(['https://gist.github.com']);
                function gist(url) {
                    if (!origins.has(url.origin))
                        return;
                    if (!url.pathname.match(/^\/[\w\-]+?\/\w{32}(?!\w)/))
                        return;
                    if (media_1.cache.has(url.href))
                        return media_1.cache.get(url.href).cloneNode(true);
                    return typed_dom_1.HTML.div({ style: 'position: relative;' }, [typed_dom_1.HTML.em(`loading ${ url.href }`)], (f, tag) => {
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
            '../../../parser/inline/media': 95,
            'typed-dom': 13
        }
    ],
    121: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const media_1 = _dereq_('../../../parser/inline/media');
            const typed_dom_1 = _dereq_('typed-dom');
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
            '../../../parser/inline/media': 95,
            'typed-dom': 13
        }
    ],
    122: [
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
            '../../../parser/inline/media': 95,
            'typed-dom': 13
        }
    ],
    123: [
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
                    return typed_dom_1.HTML.div({ style: 'position: relative;' }, [typed_dom_1.HTML.em(`loading ${ url.href }`)], (f, tag) => {
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
            '../../../parser/inline/media': 95,
            'typed-dom': 13
        }
    ],
    124: [
        function (_dereq_, module, exports) {
            (function (global) {
                'use strict';
                Object.defineProperty(exports, '__esModule', { value: true });
                const parser_1 = _dereq_('../../../parser');
                const cache_1 = _dereq_('spica/cache');
                const dompurify_1 = typeof window !== 'undefined' ? window['DOMPurify'] : typeof global !== 'undefined' ? global['DOMPurify'] : null;
                const typed_dom_1 = _dereq_('typed-dom');
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
                    return typed_dom_1.HTML.div({ style: 'position: relative;' }, [typed_dom_1.HTML.em(`loading ${ url.href }`)], (f, tag) => {
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
    125: [
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
            '../../../parser/inline/media': 95,
            'typed-dom': 13
        }
    ],
    126: [
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
            '../../../parser/inline/media': 95,
            'typed-dom': 13
        }
    ],
    127: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var figure_1 = _dereq_('./util/figure');
            exports.figure = figure_1.figure;
            var footnote_1 = _dereq_('./util/footnote');
            exports.footnote = footnote_1.footnote;
            var toc_1 = _dereq_('./util/toc');
            exports.toc = toc_1.toc;
        },
        {
            './util/figure': 128,
            './util/footnote': 129,
            './util/toc': 130
        }
    ],
    128: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const label_1 = _dereq_('../parser/inline/extension/label');
            const inline_1 = _dereq_('../parser/inline');
            const api_1 = _dereq_('../parser/api');
            const typed_dom_1 = _dereq_('typed-dom');
            function figure(source) {
                let base = '0';
                const indexes = new Map();
                const exclusions = new Set();
                for (let fig of source.querySelectorAll('figure[data-label][data-group], h2[id]')) {
                    if (fig.matches('h2')) {
                        if (base === '0')
                            continue;
                        fig = api_1.parse(`[$-${ +base.split('.', 1)[0] + 1 }.0]\n$$\n$$`).querySelector('figure');
                    }
                    if (fig.matches('.example figure'))
                        continue;
                    if (fig.parentElement !== source && fig.parentElement instanceof HTMLQuoteElement) {
                        exclusions.has(fig.parentElement) ? undefined : void exclusions.add(fig.parentElement) || void figure(fig.parentElement);
                        continue;
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
                        continue;
                    if (idx.endsWith('.0'))
                        continue;
                    void fig.setAttribute('id', `label:${ label.split('-', 1)[0] }-${ idx }`);
                    const query = inline_1.isGroup(label) ? label.split('-').slice(0, -1).join('-') : label;
                    for (const ref of source.querySelectorAll(`a.label[data-label="${ query.replace(/[$.]/g, '\\$&') }"]`)) {
                        void typed_dom_1.define(ref, { href: `#${ fig.id }` }, figindex.textContent.replace(/[.]$/, ''));
                    }
                }
            }
            exports.figure = figure;
            function capitalize(label) {
                return label[0].toUpperCase() + label.slice(1);
            }
        },
        {
            '../parser/api': 41,
            '../parser/inline': 70,
            '../parser/inline/extension/label': 88,
            'typed-dom': 13
        }
    ],
    129: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const indexer_1 = _dereq_('../parser/inline/extension/indexer');
            const typed_dom_1 = _dereq_('typed-dom');
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
                        const refId = ref.id || `${ category }:ref:${ i + 1 }`;
                        const title = ref.title || indexer_1.text(ref);
                        const def = acc.get(title);
                        const defIndex = def ? +def.id.match(/[0-9]+/)[0] : acc.size + 1;
                        const defId = def ? def.id : `${ category }:def:${ defIndex }`;
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
                            }, `~${ refIndex }`));
                        } else {
                            void acc.set(title, typed_dom_1.html('li', { id: defId }, [
                                ...contents.get(ref),
                                typed_dom_1.html('sup', [typed_dom_1.html('a', {
                                        href: `#${ refId }`,
                                        rel: 'noopener'
                                    }, `~${ refIndex }`)])
                            ]));
                        }
                        return acc;
                    }, new Map()).values());
                };
            }
        },
        {
            '../parser/inline/extension/indexer': 87,
            'typed-dom': 13
        }
    ],
    130: [
        function (_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            const concat_1 = _dereq_('spica/concat');
            const typed_dom_1 = _dereq_('typed-dom');
            function toc(source) {
                const hs = [...source.children].filter(el => el instanceof HTMLHeadingElement);
                return parse(cons(hs));
            }
            exports.toc = toc;
            function parse(node, index = []) {
                return typed_dom_1.html('ul', node.map(([el, node], i) => {
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
        function (_dereq_, module, exports) {
            'use strict';
            function __export(m) {
                for (var p in m)
                    if (!exports.hasOwnProperty(p))
                        exports[p] = m[p];
            }
            Object.defineProperty(exports, '__esModule', { value: true });
            __export(_dereq_('./src/parser'));
            __export(_dereq_('./src/renderer'));
            __export(_dereq_('./src/util'));
        },
        {
            './src/parser': 40,
            './src/renderer': 110,
            './src/util': 127
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