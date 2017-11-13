/*! securemark v0.34.8 https://github.com/falsandtru/securemark | (c) 2017, falsandtru | (Apache-2.0 AND MPL-2.0) License */
require = function e(t, n, r) {
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
}({
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
            var __values = this && this.__values || function (o) {
                var m = typeof Symbol === 'function' && o[Symbol.iterator], i = 0;
                if (m)
                    return m.call(o);
                return {
                    next: function () {
                        if (o && i >= o.length)
                            o = void 0;
                        return {
                            value: o && o[i++],
                            done: !o
                        };
                    }
                };
            };
            Object.defineProperty(exports, '__esModule', { value: true });
            var type_1 = require('./type');
            exports.assign = template(function (key, target, source) {
                return target[key] = source[key];
            });
            exports.clone = template(function (key, target, source) {
                switch (type_1.type(source[key])) {
                case 'Array':
                    return target[key] = exports.clone([], source[key]);
                case 'Object':
                    return target[key] = source[key] instanceof Object ? exports.clone({}, source[key]) : source[key];
                default:
                    return target[key] = source[key];
                }
            });
            exports.extend = template(function (key, target, source) {
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
                function walk(target) {
                    var sources = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        sources[_i - 1] = arguments[_i];
                    }
                    if (target === undefined || target === null) {
                        throw new TypeError('Spica: assign: Cannot walk on ' + target + '.');
                    }
                    try {
                        for (var sources_1 = __values(sources), sources_1_1 = sources_1.next(); !sources_1_1.done; sources_1_1 = sources_1.next()) {
                            var source = sources_1_1.value;
                            if (source === undefined || source === null) {
                                continue;
                            }
                            try {
                                for (var _a = __values(Object.keys(Object(source))), _b = _a.next(); !_b.done; _b = _a.next()) {
                                    var key = _b.value;
                                    var desc = Object.getOwnPropertyDescriptor(Object(source), key);
                                    if (desc !== undefined && desc.enumerable) {
                                        void strategy(key, Object(target), Object(source));
                                    }
                                }
                            } catch (e_1_1) {
                                e_1 = { error: e_1_1 };
                            } finally {
                                try {
                                    if (_b && !_b.done && (_c = _a.return))
                                        _c.call(_a);
                                } finally {
                                    if (e_1)
                                        throw e_1.error;
                                }
                            }
                        }
                    } catch (e_2_1) {
                        e_2 = { error: e_2_1 };
                    } finally {
                        try {
                            if (sources_1_1 && !sources_1_1.done && (_d = sources_1.return))
                                _d.call(sources_1);
                        } finally {
                            if (e_2)
                                throw e_2.error;
                        }
                    }
                    return Object(target);
                    var e_2, _d, e_1, _c;
                }
            }
        },
        { './type': 8 }
    ],
    5: [
        function (require, module, exports) {
            'use strict';
            var __read = this && this.__read || function (o, n) {
                var m = typeof Symbol === 'function' && o[Symbol.iterator];
                if (!m)
                    return o;
                var i = m.call(o), r, ar = [], e;
                try {
                    while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                        ar.push(r.value);
                } catch (error) {
                    e = { error: error };
                } finally {
                    try {
                        if (r && !r.done && (m = i['return']))
                            m.call(i);
                    } finally {
                        if (e)
                            throw e.error;
                    }
                }
                return ar;
            };
            var __spread = this && this.__spread || function () {
                for (var ar = [], i = 0; i < arguments.length; i++)
                    ar = ar.concat(__read(arguments[i]));
                return ar;
            };
            var __values = this && this.__values || function (o) {
                var m = typeof Symbol === 'function' && o[Symbol.iterator], i = 0;
                if (m)
                    return m.call(o);
                return {
                    next: function () {
                        if (o && i >= o.length)
                            o = void 0;
                        return {
                            value: o && o[i++],
                            done: !o
                        };
                    }
                };
            };
            Object.defineProperty(exports, '__esModule', { value: true });
            var assign_1 = require('./assign');
            var equal_1 = require('./equal');
            var Cache = function () {
                function Cache(size, callback, opts) {
                    if (callback === void 0) {
                        callback = function () {
                            return undefined;
                        };
                    }
                    if (opts === void 0) {
                        opts = {};
                    }
                    var _this = this;
                    this.size = size;
                    this.callback = callback;
                    this.opts = {
                        ignore: {
                            delete: false,
                            clear: false
                        }
                    };
                    if (size > 0 === false)
                        throw new Error('Spica: Cache: Cache size must be greater than 0.');
                    void Object.freeze(assign_1.extend(this.opts, opts));
                    var _a = opts.data || {
                            stats: [
                                [],
                                []
                            ],
                            entries: []
                        }, stats = _a.stats, entries = _a.entries;
                    var LFU = stats[1].slice(0, size);
                    var LRU = stats[0].slice(0, size - LFU.length);
                    this.stats = {
                        LRU: LRU,
                        LFU: LFU
                    };
                    this.store = new Map(entries);
                    void __spread(stats[1], stats[0]).slice(LFU.length + LRU.length).forEach(function (k) {
                        return void _this.store.delete(k);
                    });
                    if (this.store.size !== LFU.length + LRU.length)
                        throw new Error('Spica: Cache: Size of stats and entries is not matched.');
                    if (!__spread(LFU, LRU).every(function (k) {
                            return _this.store.has(k);
                        }))
                        throw new Error('Spica: Cache: Keys of stats and entries is not matched.');
                }
                Cache.prototype.put = function (key, value, log) {
                    if (log === void 0) {
                        log = true;
                    }
                    if (!log && this.store.has(key))
                        return void this.store.set(key, value), true;
                    if (this.access(key))
                        return void this.store.set(key, value), true;
                    var _a = this.stats, LRU = _a.LRU, LFU = _a.LFU;
                    if (LRU.length + LFU.length === this.size && LRU.length < LFU.length) {
                        var key_1 = LFU.pop();
                        var val = this.store.get(key_1);
                        void this.store.delete(key_1);
                        void this.callback(key_1, val);
                    }
                    void LRU.unshift(key);
                    void this.store.set(key, value);
                    if (LRU.length + LFU.length > this.size) {
                        var key_2 = LRU.pop();
                        var val = this.store.get(key_2);
                        void this.store.delete(key_2);
                        void this.callback(key_2, val);
                    }
                    return false;
                };
                Cache.prototype.set = function (key, value, log) {
                    void this.put(key, value, log);
                    return value;
                };
                Cache.prototype.get = function (key, log) {
                    if (log === void 0) {
                        log = true;
                    }
                    if (!log)
                        return this.store.get(key);
                    void this.access(key);
                    return this.store.get(key);
                };
                Cache.prototype.has = function (key) {
                    return this.store.has(key);
                };
                Cache.prototype.delete = function (key) {
                    if (!this.store.has(key))
                        return false;
                    var _a = this.stats, LRU = _a.LRU, LFU = _a.LFU;
                    try {
                        for (var _b = __values([
                                    LFU,
                                    LRU
                                ]), _c = _b.next(); !_c.done; _c = _b.next()) {
                            var stat = _c.value;
                            var index = equal_1.findIndex(key, stat);
                            if (index === -1)
                                continue;
                            var val = this.store.get(key);
                            void this.store.delete(stat.splice(index, 1)[0]);
                            if (this.opts.ignore.delete)
                                return true;
                            void this.callback(key, val);
                            return true;
                        }
                    } catch (e_1_1) {
                        e_1 = { error: e_1_1 };
                    } finally {
                        try {
                            if (_c && !_c.done && (_d = _b.return))
                                _d.call(_b);
                        } finally {
                            if (e_1)
                                throw e_1.error;
                        }
                    }
                    return false;
                    var e_1, _d;
                };
                Cache.prototype.clear = function () {
                    var _this = this;
                    var store = this.store;
                    this.store = new Map();
                    this.stats = {
                        LRU: [],
                        LFU: []
                    };
                    if (this.opts.ignore.clear)
                        return;
                    return void __spread(store).forEach(function (_a) {
                        var _b = __read(_a, 2), key = _b[0], val = _b[1];
                        return void _this.callback(key, val);
                    });
                };
                Cache.prototype[Symbol.iterator] = function () {
                    return this.store[Symbol.iterator]();
                };
                Cache.prototype.export = function () {
                    return {
                        stats: [
                            this.stats.LRU.slice(),
                            this.stats.LFU.slice()
                        ],
                        entries: __spread(this)
                    };
                };
                Cache.prototype.inspect = function () {
                    var _a = this.stats, LRU = _a.LRU, LFU = _a.LFU;
                    return [
                        LRU.slice(),
                        LFU.slice()
                    ];
                };
                Cache.prototype.access = function (key) {
                    return this.accessLFU(key) || this.accessLRU(key);
                };
                Cache.prototype.accessLRU = function (key) {
                    if (!this.store.has(key))
                        return false;
                    var LRU = this.stats.LRU;
                    var index = equal_1.findIndex(key, LRU);
                    if (index === -1)
                        return false;
                    var LFU = this.stats.LFU;
                    void LFU.unshift.apply(LFU, __spread(LRU.splice(index, 1)));
                    return true;
                };
                Cache.prototype.accessLFU = function (key) {
                    if (!this.store.has(key))
                        return false;
                    var LFU = this.stats.LFU;
                    var index = equal_1.findIndex(key, LFU);
                    if (index === -1)
                        return false;
                    void LFU.unshift.apply(LFU, __spread(LFU.splice(index, 1)));
                    return true;
                };
                return Cache;
            }();
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
                for (var i = 0, len = source.length, offset = target.length; i < len; ++i) {
                    target[i + offset] = source[i];
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
                var isNaN = a1 !== a1;
                for (var i = 0; i < as.length; ++i) {
                    var a2 = as[i];
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
            function type(target) {
                var type = Object.prototype.toString.call(target).split(' ').pop().slice(0, -1);
                if (typeof target !== 'object' && target instanceof Object === false || target === null)
                    return type.toLowerCase();
                return type;
            }
            exports.type = type;
        },
        {}
    ],
    9: [
        function (require, module, exports) {
            'use strict';
            function __export(m) {
                for (var p in m)
                    if (!exports.hasOwnProperty(p))
                        exports[p] = m[p];
            }
            Object.defineProperty(exports, '__esModule', { value: true });
            __export(require('./src/export'));
            var export_1 = require('./src/export');
            exports.default = export_1.default;
        },
        { './src/export': 12 }
    ],
    10: [
        function (require, module, exports) {
            'use strict';
            var __assign = this && this.__assign || Object.assign || function (t) {
                for (var s, i = 1, n = arguments.length; i < n; i++) {
                    s = arguments[i];
                    for (var p in s)
                        if (Object.prototype.hasOwnProperty.call(s, p))
                            t[p] = s[p];
                }
                return t;
            };
            var __read = this && this.__read || function (o, n) {
                var m = typeof Symbol === 'function' && o[Symbol.iterator];
                if (!m)
                    return o;
                var i = m.call(o), r, ar = [], e;
                try {
                    while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                        ar.push(r.value);
                } catch (error) {
                    e = { error: error };
                } finally {
                    try {
                        if (r && !r.done && (m = i['return']))
                            m.call(i);
                    } finally {
                        if (e)
                            throw e.error;
                    }
                }
                return ar;
            };
            var __spread = this && this.__spread || function () {
                for (var ar = [], i = 0; i < arguments.length; i++)
                    ar = ar.concat(__read(arguments[i]));
                return ar;
            };
            Object.defineProperty(exports, '__esModule', { value: true });
            var ElChildrenType;
            (function (ElChildrenType) {
                ElChildrenType.Void = 'void';
                ElChildrenType.Text = 'text';
                ElChildrenType.Collection = 'collection';
                ElChildrenType.Struct = 'struct';
            }(ElChildrenType || (ElChildrenType = {})));
            var memory = new WeakSet();
            var El = function () {
                function El(element_, children_) {
                    this.element_ = element_;
                    this.children_ = children_;
                    this.type = this.children_ === undefined ? ElChildrenType.Void : typeof this.children_ === 'string' ? ElChildrenType.Text : Array.isArray(this.children_) ? ElChildrenType.Collection : ElChildrenType.Struct;
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
                        void scope(element_.id, this.children_);
                        return;
                    case ElChildrenType.Struct:
                        void clear();
                        this.children_ = observe(element_, __assign({}, children_));
                        void scope(element_.id, this.children_);
                        return;
                    }
                    function clear() {
                        while (element_.childNodes.length > 0) {
                            void element_.removeChild(element_.firstChild);
                        }
                    }
                    function scope(id, children) {
                        if (!id.match(/^[\w\-]+$/))
                            return;
                        return void Object.values(children).map(function (_a) {
                            var element = _a.element;
                            return element;
                        }).forEach(function (element) {
                            return element instanceof HTMLStyleElement && void parse(element, id);
                        });
                        function parse(style, id) {
                            style.innerHTML = style.innerHTML.replace(/^\s*\$scope(?!\w)/gm, '#' + id);
                            void __spread(style.querySelectorAll('*')).forEach(function (el) {
                                return void el.remove();
                            });
                        }
                    }
                    function observe(element, children) {
                        return Object.defineProperties(children, Object.entries(children).reduce(function (descs, _a) {
                            var _b = __read(_a, 2), name = _b[0], child = _b[1];
                            void throwErrorIfNotUsable(child);
                            void element.appendChild(child.element);
                            descs[name] = {
                                configurable: true,
                                enumerable: true,
                                get: function () {
                                    return child;
                                },
                                set: function (newChild) {
                                    var oldChild = child;
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
                Object.defineProperty(El.prototype, 'element', {
                    get: function () {
                        return this.element_;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(El.prototype, 'children', {
                    get: function () {
                        switch (this.type) {
                        case ElChildrenType.Text:
                            return this.children_.data;
                        default:
                            return this.children_;
                        }
                    },
                    set: function (children) {
                        var _this = this;
                        switch (this.type) {
                        case ElChildrenType.Void:
                            return;
                        case ElChildrenType.Text:
                            this.children_.data = children;
                            return;
                        case ElChildrenType.Collection:
                            void this.children_.reduce(function (cs, c) {
                                var i = cs.indexOf(c);
                                if (i > -1)
                                    return cs;
                                void cs.splice(i, 1);
                                void c.element.remove();
                                return cs;
                            }, __spread(children));
                            this.children_ = [];
                            void children.forEach(function (child, i) {
                                child.element_.parentElement === _this.element_ || void throwErrorIfNotUsable(child);
                                _this.children_[i] = child;
                                void _this.element_.appendChild(child.element);
                            });
                            void Object.freeze(this.children_);
                            return;
                        case ElChildrenType.Struct:
                            void Object.keys(this.children_).forEach(function (k) {
                                return _this.children_[k] = children[k];
                            });
                            return;
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                return El;
            }();
            exports.El = El;
            function throwErrorIfNotUsable(_a) {
                var element = _a.element;
                if (element.parentElement === null || !memory.has(element.parentElement))
                    return;
                throw new Error('TypedDOM: Cannot add an element used in another typed dom.');
            }
        },
        {}
    ],
    11: [
        function (require, module, exports) {
            'use strict';
            var __read = this && this.__read || function (o, n) {
                var m = typeof Symbol === 'function' && o[Symbol.iterator];
                if (!m)
                    return o;
                var i = m.call(o), r, ar = [], e;
                try {
                    while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                        ar.push(r.value);
                } catch (error) {
                    e = { error: error };
                } finally {
                    try {
                        if (r && !r.done && (m = i['return']))
                            m.call(i);
                    } finally {
                        if (e)
                            throw e.error;
                    }
                }
                return ar;
            };
            var __spread = this && this.__spread || function () {
                for (var ar = [], i = 0; i < arguments.length; i++)
                    ar = ar.concat(__read(arguments[i]));
                return ar;
            };
            Object.defineProperty(exports, '__esModule', { value: true });
            var builder_1 = require('./builder');
            exports.tags = {
                'a': 0,
                'applet': 0,
                'area': 0,
                'audio': 0,
                'base': 0,
                'basefont': 0,
                'blockquote': 0,
                'body': 0,
                'br': 0,
                'button': 0,
                'canvas': 0,
                'caption': 0,
                'col': 0,
                'colgroup': 0,
                'data': 0,
                'datalist': 0,
                'del': 0,
                'dir': 0,
                'div': 0,
                'dl': 0,
                'embed': 0,
                'fieldset': 0,
                'font': 0,
                'form': 0,
                'frame': 0,
                'frameset': 0,
                'h1': 0,
                'h2': 0,
                'h3': 0,
                'h4': 0,
                'h5': 0,
                'h6': 0,
                'head': 0,
                'hr': 0,
                'html': 0,
                'iframe': 0,
                'img': 0,
                'input': 0,
                'ins': 0,
                'isindex': 0,
                'label': 0,
                'legend': 0,
                'li': 0,
                'link': 0,
                'listing': 0,
                'map': 0,
                'marquee': 0,
                'menu': 0,
                'meta': 0,
                'meter': 0,
                'nextid': 0,
                'object': 0,
                'ol': 0,
                'optgroup': 0,
                'option': 0,
                'output': 0,
                'p': 0,
                'param': 0,
                'picture': 0,
                'pre': 0,
                'progress': 0,
                'q': 0,
                'script': 0,
                'select': 0,
                'source': 0,
                'span': 0,
                'style': 0,
                'table': 0,
                'tbody': 0,
                'td': 0,
                'template': 0,
                'textarea': 0,
                'tfoot': 0,
                'th': 0,
                'thead': 0,
                'time': 0,
                'title': 0,
                'tr': 0,
                'track': 0,
                'ul': 0,
                'video': 0,
                'x-ms-webview': 0,
                'xmp': 0,
                'abbr': 0,
                'acronym': 0,
                'address': 0,
                'article': 0,
                'aside': 0,
                'b': 0,
                'bdo': 0,
                'big': 0,
                'center': 0,
                'circle': 0,
                'cite': 0,
                'clippath': 0,
                'code': 0,
                'dd': 0,
                'defs': 0,
                'desc': 0,
                'dfn': 0,
                'dt': 0,
                'ellipse': 0,
                'em': 0,
                'feblend': 0,
                'fecolormatrix': 0,
                'fecomponenttransfer': 0,
                'fecomposite': 0,
                'feconvolvematrix': 0,
                'fediffuselighting': 0,
                'fedisplacementmap': 0,
                'fedistantlight': 0,
                'feflood': 0,
                'fefunca': 0,
                'fefuncb': 0,
                'fefuncg': 0,
                'fefuncr': 0,
                'fegaussianblur': 0,
                'feimage': 0,
                'femerge': 0,
                'femergenode': 0,
                'femorphology': 0,
                'feoffset': 0,
                'fepointlight': 0,
                'fespecularlighting': 0,
                'fespotlight': 0,
                'fetile': 0,
                'feturbulence': 0,
                'figcaption': 0,
                'figure': 0,
                'filter': 0,
                'footer': 0,
                'foreignobject': 0,
                'g': 0,
                'header': 0,
                'hgroup': 0,
                'i': 0,
                'image': 0,
                'kbd': 0,
                'keygen': 0,
                'line': 0,
                'lineargradient': 0,
                'mark': 0,
                'marker': 0,
                'mask': 0,
                'metadata': 0,
                'nav': 0,
                'nobr': 0,
                'noframes': 0,
                'noscript': 0,
                'path': 0,
                'pattern': 0,
                'plaintext': 0,
                'polygon': 0,
                'polyline': 0,
                'radialgradient': 0,
                'rect': 0,
                'rt': 0,
                'ruby': 0,
                's': 0,
                'samp': 0,
                'section': 0,
                'small': 0,
                'stop': 0,
                'strike': 0,
                'strong': 0,
                'sub': 0,
                'sup': 0,
                'svg': 0,
                'switch': 0,
                'symbol': 0,
                'text': 0,
                'textpath': 0,
                'tspan': 0,
                'tt': 0,
                'u': 0,
                'use': 0,
                'var': 0,
                'view': 0,
                'wbr': 0
            };
            exports.TypedHTML = __spread(Object.keys(exports.tags), [
                'create',
                'any'
            ]).reduce(function (obj, prop) {
                return obj[prop] = prop === 'create' ? function (tag, b, c, d) {
                    if (b === void 0) {
                        b = function () {
                            return document.createElement(tag);
                        };
                    }
                    if (c === void 0) {
                        c = function () {
                            return document.createElement(tag);
                        };
                    }
                    if (d === void 0) {
                        d = function () {
                            return document.createElement(tag);
                        };
                    }
                    return exports.TypedHTML['any'](b, c, d, tag);
                } : function (attrs, children, factory, tag) {
                    if (tag === void 0) {
                        tag = prop;
                    }
                    tag = prop === 'any' ? tag : prop;
                    switch (typeof attrs) {
                    case 'undefined':
                        return new builder_1.El(define(tag, function () {
                            return document.createElement(tag);
                        }), undefined);
                    case 'function':
                        return new builder_1.El(define(tag, attrs), undefined);
                    case 'string':
                        return new builder_1.El(define(tag, children || function () {
                            return document.createElement(tag);
                        }), attrs);
                    case 'object':
                        factory = typeof children === 'function' ? children : factory || function () {
                            return document.createElement(tag);
                        };
                        return Object.keys(attrs).slice(-1).every(function (key) {
                            return key === undefined || typeof attrs[key] === 'object';
                        }) ? new builder_1.El(define(tag, factory), attrs) : new builder_1.El(define(tag, factory, attrs), children === factory ? undefined : children);
                    default:
                        throw new TypeError('TypedDOM: Invalid arguments: [' + attrs + ', ' + children + ', ' + factory + ']');
                    }
                }, obj;
            }, {});
            function define(tag, factory, attrs) {
                var el = factory();
                if (tag !== el.tagName.toLowerCase())
                    throw new Error('TypedDOM: Tag name must be "' + tag + '" but "' + el.tagName.toLowerCase() + '".');
                if (!attrs)
                    return el;
                void Object.keys(attrs).forEach(function (name) {
                    return void el.setAttribute(name, attrs[name]);
                });
                return el;
            }
        },
        { './builder': 10 }
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
            var html_1 = require('./dom/html');
            exports.default = html_1.TypedHTML;
            exports.TypedHTML = html_1.TypedHTML;
            __export(require('./util/dom'));
        },
        {
            './dom/html': 11,
            './util/dom': 13
        }
    ],
    13: [
        function (require, module, exports) {
            'use strict';
            var __assign = this && this.__assign || Object.assign || function (t) {
                for (var s, i = 1, n = arguments.length; i < n; i++) {
                    s = arguments[i];
                    for (var p in s)
                        if (Object.prototype.hasOwnProperty.call(s, p))
                            t[p] = s[p];
                }
                return t;
            };
            var __read = this && this.__read || function (o, n) {
                var m = typeof Symbol === 'function' && o[Symbol.iterator];
                if (!m)
                    return o;
                var i = m.call(o), r, ar = [], e;
                try {
                    while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                        ar.push(r.value);
                } catch (error) {
                    e = { error: error };
                } finally {
                    try {
                        if (r && !r.done && (m = i['return']))
                            m.call(i);
                    } finally {
                        if (e)
                            throw e.error;
                    }
                }
                return ar;
            };
            var __spread = this && this.__spread || function () {
                for (var ar = [], i = 0; i < arguments.length; i++)
                    ar = ar.concat(__read(arguments[i]));
                return ar;
            };
            Object.defineProperty(exports, '__esModule', { value: true });
            var noop_1 = require('./noop');
            exports.currentTargets = new WeakMap();
            function listen(target, a, b, c, d) {
                if (c === void 0) {
                    c = false;
                }
                if (d === void 0) {
                    d = {};
                }
                return typeof b === 'string' ? delegate(target, a, b, c, d) : bind(target, a, b, c);
            }
            exports.listen = listen;
            function once(target, a, b, c, d) {
                if (c === void 0) {
                    c = false;
                }
                if (d === void 0) {
                    d = {};
                }
                return typeof b === 'string' ? delegate(target, a, b, c, __assign({}, typeof d === 'boolean' ? { capture: d } : d, { once: true })) : bind(target, a, b, __assign({}, typeof c === 'boolean' ? { capture: c } : c, { once: true }));
            }
            exports.once = once;
            function bind(target, type, listener, option) {
                if (option === void 0) {
                    option = false;
                }
                void target.addEventListener(type, handler, adjustEventListenerOptions(option));
                var unbind = function () {
                    return unbind = noop_1.noop, void target.removeEventListener(type, handler, adjustEventListenerOptions(option));
                };
                return function () {
                    return void unbind();
                };
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
            function delegate(target, selector, type, listener, option) {
                if (option === void 0) {
                    option = {};
                }
                return bind(target instanceof Document ? target.documentElement : target, type, function (ev) {
                    var cx = ev.target.closest(selector);
                    if (!cx)
                        return;
                    void __spread(target.querySelectorAll(selector)).filter(function (el) {
                        return el === cx;
                    }).forEach(function (el) {
                        return void once(el, type, function (ev) {
                            void listener(ev);
                        }, option);
                    });
                }, __assign({}, option, { capture: true }));
            }
            exports.delegate = delegate;
            var supportEventListenerOptions = false;
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
        { './noop': 14 }
    ],
    14: [
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
    15: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var combine_1 = require('./combinator/combine');
            exports.combine = combine_1.combine;
            var loop_1 = require('./combinator/loop');
            exports.loop = loop_1.loop;
            var bracket_1 = require('./combinator/bracket');
            exports.bracket = bracket_1.bracket;
            var transform_1 = require('./combinator/transform');
            exports.transform = transform_1.transform;
        },
        {
            './combinator/bracket': 16,
            './combinator/combine': 17,
            './combinator/loop': 18,
            './combinator/transform': 19
        }
    ],
    16: [
        function (require, module, exports) {
            'use strict';
            var __read = this && this.__read || function (o, n) {
                var m = typeof Symbol === 'function' && o[Symbol.iterator];
                if (!m)
                    return o;
                var i = m.call(o), r, ar = [], e;
                try {
                    while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                        ar.push(r.value);
                } catch (error) {
                    e = { error: error };
                } finally {
                    try {
                        if (r && !r.done && (m = i['return']))
                            m.call(i);
                    } finally {
                        if (e)
                            throw e.error;
                    }
                }
                return ar;
            };
            Object.defineProperty(exports, '__esModule', { value: true });
            function bracket(start, parser, end) {
                return function (lmr_) {
                    var l = match(lmr_, start);
                    if (l === undefined)
                        return;
                    var mr_ = lmr_.slice(l.length);
                    var _a = __read(parser(mr_) || [
                            [],
                            mr_
                        ], 2), rs = _a[0], r_ = _a[1];
                    if (!mr_.endsWith(r_))
                        return;
                    var r = match(r_, end);
                    if (r === undefined)
                        return;
                    if (r_ === mr_ && l + r === '')
                        return;
                    return [
                        rs,
                        r_.slice(r.length)
                    ];
                };
                function match(source, pattern) {
                    return typeof pattern === 'string' ? source.startsWith(pattern) ? pattern : undefined : source.slice(0, 9).search(pattern) === 0 ? source.slice(0, 9).match(pattern)[0] : undefined;
                }
            }
            exports.bracket = bracket;
        },
        {}
    ],
    17: [
        function (require, module, exports) {
            'use strict';
            var __values = this && this.__values || function (o) {
                var m = typeof Symbol === 'function' && o[Symbol.iterator], i = 0;
                if (m)
                    return m.call(o);
                return {
                    next: function () {
                        if (o && i >= o.length)
                            o = void 0;
                        return {
                            value: o && o[i++],
                            done: !o
                        };
                    }
                };
            };
            var __read = this && this.__read || function (o, n) {
                var m = typeof Symbol === 'function' && o[Symbol.iterator];
                if (!m)
                    return o;
                var i = m.call(o), r, ar = [], e;
                try {
                    while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                        ar.push(r.value);
                } catch (error) {
                    e = { error: error };
                } finally {
                    try {
                        if (r && !r.done && (m = i['return']))
                            m.call(i);
                    } finally {
                        if (e)
                            throw e.error;
                    }
                }
                return ar;
            };
            var __spread = this && this.__spread || function () {
                for (var ar = [], i = 0; i < arguments.length; i++)
                    ar = ar.concat(__read(arguments[i]));
                return ar;
            };
            Object.defineProperty(exports, '__esModule', { value: true });
            function combine(parsers) {
                return function (source) {
                    var rest = source;
                    var results = [];
                    try {
                        for (var parsers_1 = __values(parsers), parsers_1_1 = parsers_1.next(); !parsers_1_1.done; parsers_1_1 = parsers_1.next()) {
                            var parse = parsers_1_1.value;
                            if (rest === '')
                                break;
                            var r = parse(rest);
                            if (!r)
                                continue;
                            void results.push.apply(results, __spread(r[0]));
                            rest = r[1];
                            break;
                        }
                    } catch (e_1_1) {
                        e_1 = { error: e_1_1 };
                    } finally {
                        try {
                            if (parsers_1_1 && !parsers_1_1.done && (_a = parsers_1.return))
                                _a.call(parsers_1);
                        } finally {
                            if (e_1)
                                throw e_1.error;
                        }
                    }
                    return rest.length < source.length ? [
                        results,
                        rest
                    ] : undefined;
                    var e_1, _a;
                };
            }
            exports.combine = combine;
        },
        {}
    ],
    18: [
        function (require, module, exports) {
            'use strict';
            var __read = this && this.__read || function (o, n) {
                var m = typeof Symbol === 'function' && o[Symbol.iterator];
                if (!m)
                    return o;
                var i = m.call(o), r, ar = [], e;
                try {
                    while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                        ar.push(r.value);
                } catch (error) {
                    e = { error: error };
                } finally {
                    try {
                        if (r && !r.done && (m = i['return']))
                            m.call(i);
                    } finally {
                        if (e)
                            throw e.error;
                    }
                }
                return ar;
            };
            var __spread = this && this.__spread || function () {
                for (var ar = [], i = 0; i < arguments.length; i++)
                    ar = ar.concat(__read(arguments[i]));
                return ar;
            };
            Object.defineProperty(exports, '__esModule', { value: true });
            function loop(parser, until) {
                return function (source) {
                    var rest = source;
                    var results = [];
                    while (true) {
                        if (rest === '')
                            break;
                        if (until && rest.slice(0, 9).search(until) === 0)
                            break;
                        var result = parser(rest);
                        if (!result)
                            break;
                        var _a = __read(result, 2), rs = _a[0], r = _a[1];
                        void results.push.apply(results, __spread(rs));
                        rest = r;
                    }
                    return rest.length === source.length ? undefined : [
                        results,
                        rest
                    ];
                };
            }
            exports.loop = loop;
        },
        {}
    ],
    19: [
        function (require, module, exports) {
            'use strict';
            var __read = this && this.__read || function (o, n) {
                var m = typeof Symbol === 'function' && o[Symbol.iterator];
                if (!m)
                    return o;
                var i = m.call(o), r, ar = [], e;
                try {
                    while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                        ar.push(r.value);
                } catch (error) {
                    e = { error: error };
                } finally {
                    try {
                        if (r && !r.done && (m = i['return']))
                            m.call(i);
                    } finally {
                        if (e)
                            throw e.error;
                    }
                }
                return ar;
            };
            Object.defineProperty(exports, '__esModule', { value: true });
            function transform(parser, f) {
                return function (source) {
                    var _a = __read(parser(source) || [
                            [],
                            source
                        ], 2), rs = _a[0], rest = _a[1];
                    if (rest === source)
                        return;
                    var result = f(rs, rest);
                    if (!result || !rest.endsWith(result[1]))
                        return;
                    return result;
                };
            }
            exports.transform = transform;
        },
        {}
    ],
    20: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var parser_1 = require('./renderer/parser');
            exports.parse = parser_1.parse;
            exports.escape = parser_1.escape;
            var bind_1 = require('./renderer/bind');
            exports.bind = bind_1.bind;
            var render_1 = require('./renderer/render');
            exports.render = render_1.render;
            var cache_1 = require('./parser/cache');
            exports.caches = cache_1.caches;
        },
        {
            './parser/cache': 38,
            './renderer/bind': 69,
            './renderer/parser': 70,
            './renderer/render': 71
        }
    ],
    21: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var combinator_1 = require('../combinator');
            var newline_1 = require('./block/newline');
            var horizontalrule_1 = require('./block/horizontalrule');
            var heading_1 = require('./block/heading');
            var ulist_1 = require('./block/ulist');
            var olist_1 = require('./block/olist');
            var dlist_1 = require('./block/dlist');
            var table_1 = require('./block/table');
            var blockquote_1 = require('./block/blockquote');
            var pretext_1 = require('./block/pretext');
            var mathblock_1 = require('./block/mathblock');
            var extension_1 = require('./block/extension');
            var paragraph_1 = require('./block/paragraph');
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
                mathblock_1.mathblock,
                extension_1.extension,
                paragraph_1.paragraph
            ]);
        },
        {
            '../combinator': 15,
            './block/blockquote': 22,
            './block/dlist': 23,
            './block/extension': 25,
            './block/heading': 27,
            './block/horizontalrule': 28,
            './block/mathblock': 31,
            './block/newline': 32,
            './block/olist': 33,
            './block/paragraph': 34,
            './block/pretext': 35,
            './block/table': 36,
            './block/ulist': 37
        }
    ],
    22: [
        function (require, module, exports) {
            'use strict';
            var __read = this && this.__read || function (o, n) {
                var m = typeof Symbol === 'function' && o[Symbol.iterator];
                if (!m)
                    return o;
                var i = m.call(o), r, ar = [], e;
                try {
                    while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                        ar.push(r.value);
                } catch (error) {
                    e = { error: error };
                } finally {
                    try {
                        if (r && !r.done && (m = i['return']))
                            m.call(i);
                    } finally {
                        if (e)
                            throw e.error;
                    }
                }
                return ar;
            };
            var __spread = this && this.__spread || function () {
                for (var ar = [], i = 0; i < arguments.length; i++)
                    ar = ar.concat(__read(arguments[i]));
                return ar;
            };
            Object.defineProperty(exports, '__esModule', { value: true });
            var end_1 = require('./end');
            var combinator_1 = require('../../combinator');
            var block_1 = require('../block');
            var unescapable_1 = require('../source/unescapable');
            var squash_1 = require('../squash');
            var syntax = /^>+(?=\s|$)/;
            exports.blockquote = end_1.verifyBlockEnd(function (source) {
                var mode = undefined || source.startsWith('>') && 'plain' || source.startsWith('|>') && 'markdown' || '';
                if (mode === '')
                    return;
                source = mode === 'plain' ? source : source.slice(1);
                var _a = __read(source.match(syntax) || [''], 1), indent = _a[0];
                if (!indent)
                    return;
                var top = document.createElement('blockquote');
                var bottom = indent.split('').slice(1).reduce(function (p) {
                    return p.appendChild(document.createElement('blockquote'));
                }, top);
                while (true) {
                    if (source.split('\n', 1).shift().trim() === '')
                        break;
                    var diff = (source.match(syntax) || [indent])[0].length - indent.length;
                    if (diff > 0) {
                        bottom = source.slice(0, diff).split('').reduce(function (p) {
                            return p.appendChild(document.createElement('blockquote'));
                        }, bottom);
                    }
                    if (diff < 0) {
                        bottom = source.slice(0, -diff).split('').reduce(function (p) {
                            return p.parentElement;
                        }, bottom);
                    }
                    indent = indent[0].repeat(indent.length + diff);
                    if (bottom.lastChild instanceof Text) {
                        var node_1 = mode === 'plain' ? document.createElement('br') : document.createTextNode('\n');
                        void bottom.appendChild(node_1);
                    }
                    source = source.split(/[^\S\n]/, 1).shift() === indent ? source.slice(indent.length + 1) : source.startsWith(indent + '\n') ? source.slice(indent.length) : source;
                    var _b = __read(combinator_1.loop(combinator_1.combine([unescapable_1.unescsource]), '\n|$')(source) || [
                            [document.createTextNode('')],
                            source
                        ], 2), cs = _b[0], rest = _b[1];
                    var node = mode === 'plain' ? document.createTextNode(squash_1.squash(cs).textContent.replace(/ /g, String.fromCharCode(160))) : squash_1.squash(cs);
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
                return void __spread(el.childNodes).reduce(function (ss, node) {
                    switch (true) {
                    case node instanceof Text:
                        void ss.push(node.textContent);
                        var ref = node.nextSibling;
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
                    return (combinator_1.loop(block_1.block)(source) || [[]])[0].reduce(function (frag, node) {
                        return frag.appendChild(node), frag;
                    }, document.createDocumentFragment());
                }
            }
        },
        {
            '../../combinator': 15,
            '../block': 21,
            '../source/unescapable': 64,
            '../squash': 66,
            './end': 24
        }
    ],
    23: [
        function (require, module, exports) {
            'use strict';
            var __read = this && this.__read || function (o, n) {
                var m = typeof Symbol === 'function' && o[Symbol.iterator];
                if (!m)
                    return o;
                var i = m.call(o), r, ar = [], e;
                try {
                    while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                        ar.push(r.value);
                } catch (error) {
                    e = { error: error };
                } finally {
                    try {
                        if (r && !r.done && (m = i['return']))
                            m.call(i);
                    } finally {
                        if (e)
                            throw e.error;
                    }
                }
                return ar;
            };
            Object.defineProperty(exports, '__esModule', { value: true });
            var end_1 = require('./end');
            var combinator_1 = require('../../combinator');
            var indexer_1 = require('./indexer');
            var inline_1 = require('../inline');
            var squash_1 = require('../squash');
            var syntax = /^~\s/;
            var separator = /^[~:](?:\s|$)/;
            exports.dlist = end_1.verifyBlockEnd(function (source) {
                var _a = __read(source.match(syntax) || [''], 1), whole = _a[0];
                if (!whole)
                    return;
                var el = document.createElement('dl');
                while (true) {
                    var line = source.split('\n', 1)[0];
                    if (line.trim() === '')
                        break;
                    switch (line.slice(0, 2).trim()) {
                    case '~': {
                            var dt = el.appendChild(document.createElement('dt'));
                            void dt.appendChild(squash_1.squash((combinator_1.loop(combinator_1.combine([
                                indexer_1.indexer,
                                inline_1.inline
                            ]))(line.slice(1).trim()) || [[]])[0]));
                            void indexer_1.defineIndex(dt);
                            source = source.slice(line.length + 1);
                            continue;
                        }
                    default: {
                            var dd = line.slice(0, 2).trim() === ':' || el.lastElementChild.tagName.toLowerCase() !== 'dd' ? el.appendChild(document.createElement('dd')) : el.lastElementChild;
                            var texts = [line.slice(line.slice(0, 2).trim() === ':' ? 1 : 0)];
                            source = source.slice(line.length + 1);
                            while (true) {
                                var line_1 = source.split('\n', 1)[0];
                                if (line_1.trim() === '' || line_1.search(separator) === 0)
                                    break;
                                void texts.push(line_1);
                                source = source.slice(line_1.length + 1);
                            }
                            void dd.appendChild(squash_1.squash((combinator_1.loop(combinator_1.combine([inline_1.inline]))(texts.join('\n').trim()) || [[]])[0]));
                            continue;
                        }
                    }
                }
                if (el.lastElementChild && el.lastElementChild.tagName.toLowerCase() === 'dt') {
                    void el.appendChild(document.createElement('dd'));
                }
                return [
                    [el],
                    source
                ];
            });
        },
        {
            '../../combinator': 15,
            '../inline': 39,
            '../squash': 66,
            './end': 24,
            './indexer': 30
        }
    ],
    24: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            function verifyBlockEnd(parser) {
                return function (source) {
                    var result = parser(source);
                    if (!result)
                        return result;
                    if (result[1].split('\n', 1).shift().trim() !== '')
                        return undefined;
                    return result;
                };
            }
            exports.verifyBlockEnd = verifyBlockEnd;
        },
        {}
    ],
    25: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var combinator_1 = require('../../combinator');
            var placeholder_1 = require('./extension/placeholder');
            var end_1 = require('./end');
            exports.extension = combinator_1.combine([end_1.verifyBlockEnd(placeholder_1.placeholder)]);
        },
        {
            '../../combinator': 15,
            './end': 24,
            './extension/placeholder': 26
        }
    ],
    26: [
        function (require, module, exports) {
            'use strict';
            var __read = this && this.__read || function (o, n) {
                var m = typeof Symbol === 'function' && o[Symbol.iterator];
                if (!m)
                    return o;
                var i = m.call(o), r, ar = [], e;
                try {
                    while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                        ar.push(r.value);
                } catch (error) {
                    e = { error: error };
                } finally {
                    try {
                        if (r && !r.done && (m = i['return']))
                            m.call(i);
                    } finally {
                        if (e)
                            throw e.error;
                    }
                }
                return ar;
            };
            Object.defineProperty(exports, '__esModule', { value: true });
            var end_1 = require('../end');
            var combinator_1 = require('../../../combinator');
            var inline_1 = require('../../inline');
            var unescapable_1 = require('../../source/unescapable');
            var squash_1 = require('../../squash');
            var syntax = /^(~{3,})[^\n]*\n(?:[^\n]*\n)*?\1[^\S\n]*(?=\n|$)/;
            exports.placeholder = end_1.verifyBlockEnd(function (source) {
                if (!source.startsWith('~~~'))
                    return;
                var _a = __read(source.match(syntax) || [
                        '',
                        ''
                    ], 2), whole = _a[0], keyword = _a[1];
                if (!whole)
                    return;
                var message = document.createElement('p');
                void message.appendChild(squash_1.squash(combinator_1.loop(inline_1.inline)('**WARNING: DON\'T USE `~~~` SYNTAX!!**\\\nThis *extension syntax* is reserved for extensibility.')[0]));
                source = source.slice(source.indexOf('\n') + 1);
                var lines = [];
                while (true) {
                    var line = source.split('\n', 1)[0];
                    if (line.startsWith('' + keyword) && line.trim() === '' + keyword)
                        break;
                    void lines.push(squash_1.squash((combinator_1.loop(unescapable_1.unescsource)(line + '\n') || [[]])[0]).textContent);
                    source = source.slice(line.length + 1);
                    if (source === '')
                        return;
                }
                var quote = document.createElement('pre');
                void quote.appendChild(document.createTextNode(keyword + '\n' + lines.join('') + keyword));
                return [
                    [
                        message,
                        quote
                    ],
                    source.slice(keyword.length + 1)
                ];
            });
        },
        {
            '../../../combinator': 15,
            '../../inline': 39,
            '../../source/unescapable': 64,
            '../../squash': 66,
            '../end': 24
        }
    ],
    27: [
        function (require, module, exports) {
            'use strict';
            var __read = this && this.__read || function (o, n) {
                var m = typeof Symbol === 'function' && o[Symbol.iterator];
                if (!m)
                    return o;
                var i = m.call(o), r, ar = [], e;
                try {
                    while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                        ar.push(r.value);
                } catch (error) {
                    e = { error: error };
                } finally {
                    try {
                        if (r && !r.done && (m = i['return']))
                            m.call(i);
                    } finally {
                        if (e)
                            throw e.error;
                    }
                }
                return ar;
            };
            Object.defineProperty(exports, '__esModule', { value: true });
            var end_1 = require('./end');
            var combinator_1 = require('../../combinator');
            var indexer_1 = require('./indexer');
            var inline_1 = require('../inline');
            var squash_1 = require('../squash');
            var syntax = /^(#{1,6})[^\S\n]+?([^\n]+)/;
            exports.heading = end_1.verifyBlockEnd(function (source) {
                if (!source.startsWith('#'))
                    return;
                var _a = __read(source.split('\n', 1).shift().match(syntax) || [
                        '',
                        '',
                        ''
                    ], 3), whole = _a[0], level = _a[1].length, title = _a[2];
                if (!whole)
                    return;
                var _b = __read(combinator_1.loop(combinator_1.combine([
                        indexer_1.indexer,
                        inline_1.inline
                    ]))(title.trim()) || [[]], 1), children = _b[0];
                var el = document.createElement('h' + level);
                void el.appendChild(squash_1.squash(children));
                void indexer_1.defineIndex(el);
                return [
                    [el],
                    source.slice(whole.length + 1)
                ];
            });
        },
        {
            '../../combinator': 15,
            '../inline': 39,
            '../squash': 66,
            './end': 24,
            './indexer': 30
        }
    ],
    28: [
        function (require, module, exports) {
            'use strict';
            var __read = this && this.__read || function (o, n) {
                var m = typeof Symbol === 'function' && o[Symbol.iterator];
                if (!m)
                    return o;
                var i = m.call(o), r, ar = [], e;
                try {
                    while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                        ar.push(r.value);
                } catch (error) {
                    e = { error: error };
                } finally {
                    try {
                        if (r && !r.done && (m = i['return']))
                            m.call(i);
                    } finally {
                        if (e)
                            throw e.error;
                    }
                }
                return ar;
            };
            Object.defineProperty(exports, '__esModule', { value: true });
            var end_1 = require('./end');
            var syntax = /^\s*-\s*-\s*(?:-\s*)+(?:\n|$)/;
            exports.horizontalrule = end_1.verifyBlockEnd(function (source) {
                var _a = __read(source.split('\n', 1)[0].match(syntax) || [''], 1), whole = _a[0];
                if (!whole)
                    return;
                return [
                    [document.createElement('hr')],
                    source.slice(whole.length + 1)
                ];
            });
        },
        { './end': 24 }
    ],
    29: [
        function (require, module, exports) {
            'use strict';
            var __read = this && this.__read || function (o, n) {
                var m = typeof Symbol === 'function' && o[Symbol.iterator];
                if (!m)
                    return o;
                var i = m.call(o), r, ar = [], e;
                try {
                    while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                        ar.push(r.value);
                } catch (error) {
                    e = { error: error };
                } finally {
                    try {
                        if (r && !r.done && (m = i['return']))
                            m.call(i);
                    } finally {
                        if (e)
                            throw e.error;
                    }
                }
                return ar;
            };
            Object.defineProperty(exports, '__esModule', { value: true });
            var syntax = /^\s*/;
            function indent(source) {
                var _a = __read(source.split('\n', 1).shift().match(syntax) || [''], 1), indent = _a[0];
                if (indent === '')
                    return [
                        '',
                        source
                    ];
                var lines = [];
                while (true) {
                    var line = source.split('\n', 1)[0];
                    if (!line.startsWith(indent))
                        break;
                    void lines.push(line.slice(indent.length));
                    source = source.slice(line.length + 1);
                }
                return [
                    lines.join('\n'),
                    source
                ];
            }
            exports.indent = indent;
            ;
            function fillOListFlag(source) {
                return source.replace(/^(?:[0-9]+|[A-Z]+|[a-z]+)(?=\n|$)/, function (str) {
                    return str + '.';
                });
            }
            exports.fillOListFlag = fillOListFlag;
        },
        {}
    ],
    30: [
        function (require, module, exports) {
            'use strict';
            var __read = this && this.__read || function (o, n) {
                var m = typeof Symbol === 'function' && o[Symbol.iterator];
                if (!m)
                    return o;
                var i = m.call(o), r, ar = [], e;
                try {
                    while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                        ar.push(r.value);
                } catch (error) {
                    e = { error: error };
                } finally {
                    try {
                        if (r && !r.done && (m = i['return']))
                            m.call(i);
                    } finally {
                        if (e)
                            throw e.error;
                    }
                }
                return ar;
            };
            var __spread = this && this.__spread || function () {
                for (var ar = [], i = 0; i < arguments.length; i++)
                    ar = ar.concat(__read(arguments[i]));
                return ar;
            };
            Object.defineProperty(exports, '__esModule', { value: true });
            var inline_1 = require('../inline');
            var index_1 = require('../string/index');
            var syntax = /^\s+\[#\S+?\]$/;
            exports.indexer = function (source) {
                if (!source.trim().startsWith('[#') || source.search(syntax) !== 0)
                    return;
                source = source.trim();
                var _a = __read(inline_1.inline(source) || [
                        [document.createTextNode('')],
                        ''
                    ], 2), _b = __read(_a[0], 1), el = _b[0], rest = _a[1];
                if (!(el instanceof HTMLAnchorElement))
                    return;
                if (rest !== '')
                    return;
                void el.setAttribute('class', 'index');
                return [
                    [el],
                    ''
                ];
            };
            function defineIndex(target) {
                var el = target.querySelector('.index') || target.cloneNode(true);
                void el.remove();
                void __spread(el.querySelectorAll('code[data-src], .math[data-src]')).forEach(function (el) {
                    return el.textContent = el.getAttribute('data-src');
                });
                var text = el.textContent.trim();
                if (text === '')
                    return;
                void target.setAttribute('id', index_1.makeIndex(text));
            }
            exports.defineIndex = defineIndex;
        },
        {
            '../inline': 39,
            '../string/index': 67
        }
    ],
    31: [
        function (require, module, exports) {
            'use strict';
            var __read = this && this.__read || function (o, n) {
                var m = typeof Symbol === 'function' && o[Symbol.iterator];
                if (!m)
                    return o;
                var i = m.call(o), r, ar = [], e;
                try {
                    while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                        ar.push(r.value);
                } catch (error) {
                    e = { error: error };
                } finally {
                    try {
                        if (r && !r.done && (m = i['return']))
                            m.call(i);
                    } finally {
                        if (e)
                            throw e.error;
                    }
                }
                return ar;
            };
            Object.defineProperty(exports, '__esModule', { value: true });
            var end_1 = require('./end');
            var syntax = /^\$\$[^\S\n]*\n(?:[^\n]*?\S[^\n]*\n)+?\$\$[^\S\n]*(?=\n|$)/;
            exports.mathblock = end_1.verifyBlockEnd(function (source) {
                if (!source.startsWith('$$'))
                    return;
                var _a = __read(source.match(syntax) || [
                        '',
                        ''
                    ], 1), whole = _a[0];
                if (!whole)
                    return;
                var el = document.createElement('div');
                void el.setAttribute('class', 'math');
                void el.appendChild(document.createTextNode(whole));
                return [
                    [el],
                    source.slice(whole.length + 1)
                ];
            });
        },
        { './end': 24 }
    ],
    32: [
        function (require, module, exports) {
            'use strict';
            var __read = this && this.__read || function (o, n) {
                var m = typeof Symbol === 'function' && o[Symbol.iterator];
                if (!m)
                    return o;
                var i = m.call(o), r, ar = [], e;
                try {
                    while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                        ar.push(r.value);
                } catch (error) {
                    e = { error: error };
                } finally {
                    try {
                        if (r && !r.done && (m = i['return']))
                            m.call(i);
                    } finally {
                        if (e)
                            throw e.error;
                    }
                }
                return ar;
            };
            Object.defineProperty(exports, '__esModule', { value: true });
            var syntax = /^[^\S\n]*\n/;
            exports.newline = function (source) {
                var _a = __read(source.match(syntax) || [''], 1), whole = _a[0];
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
    33: [
        function (require, module, exports) {
            'use strict';
            var __read = this && this.__read || function (o, n) {
                var m = typeof Symbol === 'function' && o[Symbol.iterator];
                if (!m)
                    return o;
                var i = m.call(o), r, ar = [], e;
                try {
                    while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                        ar.push(r.value);
                } catch (error) {
                    e = { error: error };
                } finally {
                    try {
                        if (r && !r.done && (m = i['return']))
                            m.call(i);
                    } finally {
                        if (e)
                            throw e.error;
                    }
                }
                return ar;
            };
            Object.defineProperty(exports, '__esModule', { value: true });
            var end_1 = require('./end');
            var combinator_1 = require('../../combinator');
            var ulist_1 = require('./ulist');
            var indent_1 = require('./indent');
            var inline_1 = require('../inline');
            var squash_1 = require('../squash');
            var syntax = /^([0-9]+|[A-Z]+|[a-z]+)(\.(?:\s|$)|(?=\n|$))/;
            exports.olist = end_1.verifyBlockEnd(function (source) {
                var _a = __read(source.match(syntax) || [
                        '',
                        '',
                        ''
                    ], 3), whole = _a[0], index = _a[1], flag = _a[2];
                if (!whole || !flag)
                    return;
                var el = document.createElement('ol');
                void el.setAttribute('start', index);
                void el.setAttribute('type', Number.isFinite(+index) ? '1' : index === index.toLowerCase() ? 'a' : 'A');
                var _loop_1 = function () {
                    var line = source.split('\n', 1)[0];
                    if (line.trim() === '')
                        return 'break';
                    if (line.search(syntax) === 0) {
                        var text = line.slice(line.split(/\s/, 1)[0].length + 1).trim();
                        var li = el.appendChild(document.createElement('li'));
                        void li.appendChild(squash_1.squash((combinator_1.loop(combinator_1.combine([inline_1.inline]))(text) || [[]])[0]));
                        source = source.slice(line.length + 1);
                        return 'continue';
                    } else {
                        var li_1 = el.lastElementChild;
                        if (!li_1.firstChild || [
                                HTMLUListElement,
                                HTMLOListElement
                            ].some(function (E) {
                                return li_1.lastElementChild instanceof E;
                            }))
                            return { value: void 0 };
                        var _a = __read(indent_1.indent(source), 2), block = _a[0], rest = _a[1];
                        if (rest === source)
                            return { value: void 0 };
                        var _b = __read(combinator_1.combine([
                                ulist_1.ulist,
                                exports.olist
                            ])(indent_1.fillOListFlag(block)) || [
                                [],
                                block
                            ], 2), children = _b[0], brest = _b[1];
                        if (children.length !== 1 || brest.length !== 0)
                            return { value: void 0 };
                        void li_1.appendChild(squash_1.squash(children));
                        source = rest;
                        return 'continue';
                    }
                };
                while (true) {
                    var state_1 = _loop_1();
                    if (typeof state_1 === 'object')
                        return state_1.value;
                    if (state_1 === 'break')
                        break;
                }
                return [
                    [el],
                    source
                ];
            });
        },
        {
            '../../combinator': 15,
            '../inline': 39,
            '../squash': 66,
            './end': 24,
            './indent': 29,
            './ulist': 37
        }
    ],
    34: [
        function (require, module, exports) {
            'use strict';
            var __read = this && this.__read || function (o, n) {
                var m = typeof Symbol === 'function' && o[Symbol.iterator];
                if (!m)
                    return o;
                var i = m.call(o), r, ar = [], e;
                try {
                    while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                        ar.push(r.value);
                } catch (error) {
                    e = { error: error };
                } finally {
                    try {
                        if (r && !r.done && (m = i['return']))
                            m.call(i);
                    } finally {
                        if (e)
                            throw e.error;
                    }
                }
                return ar;
            };
            Object.defineProperty(exports, '__esModule', { value: true });
            var end_1 = require('./end');
            var combinator_1 = require('../../combinator');
            var inline_1 = require('../inline');
            var squash_1 = require('../squash');
            var closer = /^[^\S\n]*\\?(?=\n[^\S\n]*\\?\n|\n?$)/;
            exports.paragraph = end_1.verifyBlockEnd(function (source) {
                if (source.startsWith('\n'))
                    return;
                source = source.replace(/^\s+/, '');
                var el = document.createElement('p');
                var _a = __read(combinator_1.loop(combinator_1.combine([inline_1.inline]), closer)(source) || [
                        [document.createTextNode(source)],
                        ''
                    ], 2), cs = _a[0], rest = _a[1];
                void el.appendChild(squash_1.squash(cs));
                return [
                    [el],
                    rest.slice(rest.split('\n').shift().length + 1)
                ];
            });
        },
        {
            '../../combinator': 15,
            '../inline': 39,
            '../squash': 66,
            './end': 24
        }
    ],
    35: [
        function (require, module, exports) {
            'use strict';
            var __read = this && this.__read || function (o, n) {
                var m = typeof Symbol === 'function' && o[Symbol.iterator];
                if (!m)
                    return o;
                var i = m.call(o), r, ar = [], e;
                try {
                    while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                        ar.push(r.value);
                } catch (error) {
                    e = { error: error };
                } finally {
                    try {
                        if (r && !r.done && (m = i['return']))
                            m.call(i);
                    } finally {
                        if (e)
                            throw e.error;
                    }
                }
                return ar;
            };
            Object.defineProperty(exports, '__esModule', { value: true });
            var end_1 = require('./end');
            var syntax = /^(`{3,})[^\n]*\n(?:[^\n]*\n)+?\1[^\S\n]*(?=\n|$)/;
            exports.pretext = end_1.verifyBlockEnd(function (source) {
                if (!source.startsWith('```'))
                    return;
                var _a = __read(source.match(syntax) || [''], 1), whole = _a[0];
                if (!whole)
                    return;
                var _b = __read(source.split('\n', 1)[0].match(/^(?:`{3,})([a-z]*)(?:\s+([0-9a-zA-Z_\-.]+))?(?=\s|$)/), 3), lang = _b[1], _c = _b[2], filename = _c === void 0 ? '' : _c;
                var el = document.createElement('pre');
                if (lang) {
                    void el.setAttribute('class', 'language-' + lang.toLowerCase());
                    void el.setAttribute('data-lang', lang.toLowerCase());
                }
                if (filename) {
                    void el.setAttribute('data-file', filename);
                }
                void el.appendChild(document.createTextNode(whole.slice(whole.indexOf('\n') + 1, whole.lastIndexOf('\n'))));
                return [
                    [el],
                    source.slice(whole.length + 1)
                ];
            });
        },
        { './end': 24 }
    ],
    36: [
        function (require, module, exports) {
            'use strict';
            var __read = this && this.__read || function (o, n) {
                var m = typeof Symbol === 'function' && o[Symbol.iterator];
                if (!m)
                    return o;
                var i = m.call(o), r, ar = [], e;
                try {
                    while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                        ar.push(r.value);
                } catch (error) {
                    e = { error: error };
                } finally {
                    try {
                        if (r && !r.done && (m = i['return']))
                            m.call(i);
                    } finally {
                        if (e)
                            throw e.error;
                    }
                }
                return ar;
            };
            Object.defineProperty(exports, '__esModule', { value: true });
            var end_1 = require('./end');
            var combinator_1 = require('../../combinator');
            var inline_1 = require('../inline');
            var squash_1 = require('../squash');
            var syntax = /^(\|[^\n]*)+?[^\S\n]*\n/;
            var align = /^:?-+:?$/;
            exports.table = end_1.verifyBlockEnd(function (source) {
                if (!source.startsWith('|') || source.search(syntax) !== 0)
                    return;
                var table = document.createElement('table');
                var _a = __read(parse(source) || [
                        [],
                        source
                    ], 2), headers = _a[0], hrest = _a[1];
                if (hrest.length === source.length)
                    return;
                source = hrest;
                var _b = __read(parse(source) || [
                        [],
                        source
                    ], 2), aligns_ = _b[0], arest = _b[1];
                if (arest.length === source.length)
                    return;
                source = arest;
                if (aligns_.some(function (e) {
                        return !e.textContent || e.textContent.search(align) !== 0;
                    }))
                    return;
                var aligns = headers.map(function (_, i) {
                    return (aligns_[i] || aligns_[aligns_.length - 1]).textContent;
                }).map(function (s) {
                    return s[0] === ':' ? s[s.length - 1] === ':' ? 'center' : 'left' : s[s.length - 1] === ':' ? 'right' : '';
                });
                void table.appendChild(document.createElement('thead'));
                void append(headers, table, headers.map(function (_, i) {
                    return i > 1 ? aligns[1] : aligns[i] === 'right' ? 'center' : aligns[i];
                }));
                void table.appendChild(document.createElement('tbody'));
                var _loop_1 = function () {
                    var line = source.split('\n', 1)[0];
                    if (line.trim() === '')
                        return 'break';
                    var _a = __read(parse(line) || [
                            [],
                            line
                        ], 2), cols = _a[0], rest = _a[1];
                    if (rest.length !== 0)
                        return { value: void 0 };
                    void append(headers.map(function (_, i) {
                        return cols[i] || document.createDocumentFragment();
                    }), table, aligns);
                    source = source.slice(line.length + 1);
                };
                while (true) {
                    var state_1 = _loop_1();
                    if (typeof state_1 === 'object')
                        return state_1.value;
                    if (state_1 === 'break')
                        break;
                }
                return [
                    [table],
                    source
                ];
            });
            function append(cols, table, aligns) {
                return void cols.map(function (col, i) {
                    var td = document.createElement('td');
                    void td.setAttribute('align', aligns[i] || '');
                    void td.appendChild(col);
                    return td;
                }).reduce(function (tr, td) {
                    return void tr.appendChild(td), tr;
                }, table.lastChild.appendChild(document.createElement('tr')));
            }
            var rowseparator = /^\||^[^\S\n]*(?=\n|$)/;
            var rowend = /^\|?[^\S\n]*(?=\n|$)/;
            function parse(source) {
                var cols = [];
                while (true) {
                    if (source[0] !== '|')
                        return;
                    var result = combinator_1.loop(inline_1.inline, rowseparator)(source.slice(1)) || [
                        [document.createTextNode('')],
                        source.slice(1)
                    ];
                    var _a = __read(result, 2), col = _a[0], rest = _a[1];
                    source = rest;
                    void cols.push(trim(squash_1.squash(col)));
                    if (source.search(rowend) === 0)
                        return [
                            cols,
                            source.slice(source.split('\n')[0].length + 1)
                        ];
                }
            }
            function trim(n) {
                if (!n.firstChild || !n.lastChild)
                    return n;
                if (n.firstChild === n.firstElementChild)
                    return n;
                n.firstChild.textContent = n.firstChild.textContent.replace(/^\s+/, '');
                if (n.lastChild === n.lastElementChild)
                    return n;
                n.lastChild.textContent = n.lastChild.textContent.replace(/\s+$/, '');
                return n;
            }
        },
        {
            '../../combinator': 15,
            '../inline': 39,
            '../squash': 66,
            './end': 24
        }
    ],
    37: [
        function (require, module, exports) {
            'use strict';
            var __read = this && this.__read || function (o, n) {
                var m = typeof Symbol === 'function' && o[Symbol.iterator];
                if (!m)
                    return o;
                var i = m.call(o), r, ar = [], e;
                try {
                    while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                        ar.push(r.value);
                } catch (error) {
                    e = { error: error };
                } finally {
                    try {
                        if (r && !r.done && (m = i['return']))
                            m.call(i);
                    } finally {
                        if (e)
                            throw e.error;
                    }
                }
                return ar;
            };
            Object.defineProperty(exports, '__esModule', { value: true });
            var end_1 = require('./end');
            var combinator_1 = require('../../combinator');
            var olist_1 = require('./olist');
            var indent_1 = require('./indent');
            var inline_1 = require('../inline');
            var squash_1 = require('../squash');
            var syntax = /^([-+*])(?=\s|$)/;
            var content = /^(\[[ x]\](?: +|$))?.*$/;
            exports.ulist = end_1.verifyBlockEnd(function (source) {
                var _a = __read(source.match(syntax) || [
                        '',
                        ''
                    ], 2), whole = _a[0], flag = _a[1];
                if (!whole)
                    return;
                var el = document.createElement('ul');
                var _loop_1 = function () {
                    var line = source.split('\n', 1)[0];
                    if (line.trim() === '')
                        return 'break';
                    if (line.search(syntax) === 0) {
                        if (!line.startsWith(flag))
                            return { value: void 0 };
                        var _a = __read(line.slice(line.split(/\s/, 1)[0].length + 1).trim().match(content), 2), text = _a[0], _b = _a[1], checkbox = _b === void 0 ? '' : _b;
                        var li = el.appendChild(document.createElement('li'));
                        if (checkbox) {
                            var cb = document.createElement('span');
                            void cb.setAttribute('class', 'checkbox');
                            void cb.appendChild(document.createTextNode(checkbox.trim() + ' '));
                            void li.appendChild(cb);
                        }
                        void li.appendChild(squash_1.squash((combinator_1.loop(combinator_1.combine([inline_1.inline]))(text.slice(checkbox.length)) || [[]])[0]));
                        source = source.slice(line.length + 1);
                        return 'continue';
                    } else {
                        var li_1 = el.lastElementChild;
                        if (!li_1.firstChild || [
                                HTMLUListElement,
                                HTMLOListElement
                            ].some(function (E) {
                                return li_1.lastElementChild instanceof E;
                            }))
                            return { value: void 0 };
                        var _c = __read(indent_1.indent(source), 2), block = _c[0], rest = _c[1];
                        if (rest === source)
                            return { value: void 0 };
                        var _d = __read(combinator_1.combine([
                                exports.ulist,
                                olist_1.olist
                            ])(indent_1.fillOListFlag(block)) || [
                                [],
                                block
                            ], 2), children = _d[0], brest = _d[1];
                        if (children.length !== 1 || brest.length !== 0)
                            return { value: void 0 };
                        void li_1.appendChild(squash_1.squash(children));
                        source = rest;
                        return 'continue';
                    }
                };
                while (true) {
                    var state_1 = _loop_1();
                    if (typeof state_1 === 'object')
                        return state_1.value;
                    if (state_1 === 'break')
                        break;
                }
                return [
                    [el],
                    source
                ];
            });
        },
        {
            '../../combinator': 15,
            '../inline': 39,
            '../squash': 66,
            './end': 24,
            './indent': 29,
            './olist': 33
        }
    ],
    38: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var mathinline_1 = require('./inline/mathinline');
            var media_1 = require('./inline/media');
            exports.caches = {
                math: mathinline_1.cache,
                media: { image: media_1.cache }
            };
        },
        {
            './inline/mathinline': 56,
            './inline/media': 57
        }
    ],
    39: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var combinator_1 = require('../combinator');
            var brace_1 = require('./inline/brace');
            var annotation_1 = require('./inline/annotation');
            var parenthesis_1 = require('./inline/parenthesis');
            var link_1 = require('./inline/link');
            var extension_1 = require('./inline/extension');
            var bracket_1 = require('./inline/bracket');
            var html_1 = require('./inline/html');
            var anglebracket_1 = require('./inline/anglebracket');
            var emphasis_1 = require('./inline/emphasis');
            var strong_1 = require('./inline/strong');
            var code_1 = require('./inline/code');
            var mathinline_1 = require('./inline/mathinline');
            var media_1 = require('./inline/media');
            var htmlentity_1 = require('./inline/htmlentity');
            var autolink_1 = require('./inline/autolink');
            var text_1 = require('./source/text');
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
                mathinline_1.mathinline,
                media_1.media,
                htmlentity_1.htmlentity,
                autolink_1.autolink,
                text_1.text
            ]);
        },
        {
            '../combinator': 15,
            './inline/anglebracket': 40,
            './inline/annotation': 41,
            './inline/autolink': 42,
            './inline/brace': 45,
            './inline/bracket': 46,
            './inline/code': 47,
            './inline/emphasis': 48,
            './inline/extension': 49,
            './inline/html': 53,
            './inline/htmlentity': 54,
            './inline/link': 55,
            './inline/mathinline': 56,
            './inline/media': 57,
            './inline/parenthesis': 58,
            './inline/strong': 59,
            './source/text': 63
        }
    ],
    40: [
        function (require, module, exports) {
            'use strict';
            var __read = this && this.__read || function (o, n) {
                var m = typeof Symbol === 'function' && o[Symbol.iterator];
                if (!m)
                    return o;
                var i = m.call(o), r, ar = [], e;
                try {
                    while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                        ar.push(r.value);
                } catch (error) {
                    e = { error: error };
                } finally {
                    try {
                        if (r && !r.done && (m = i['return']))
                            m.call(i);
                    } finally {
                        if (e)
                            throw e.error;
                    }
                }
                return ar;
            };
            var __spread = this && this.__spread || function () {
                for (var ar = [], i = 0; i < arguments.length; i++)
                    ar = ar.concat(__read(arguments[i]));
                return ar;
            };
            Object.defineProperty(exports, '__esModule', { value: true });
            var inline_1 = require('../inline');
            var combinator_1 = require('../../combinator');
            var squash_1 = require('../squash');
            var validation_1 = require('../source/validation');
            var syntax = /^<[\s\S]*?>/;
            var closer = /^>/;
            exports.anglebracket = function (source) {
                if (!validation_1.validate(source, '<', syntax))
                    return;
                return combinator_1.transform(combinator_1.bracket('<', combinator_1.loop(combinator_1.combine([inline_1.inline]), closer), '>'), function (ns, rest) {
                    return [
                        __spread(squash_1.squash(__spread([document.createTextNode('<')], ns, [document.createTextNode('>')])).childNodes),
                        rest
                    ];
                })(source);
            };
        },
        {
            '../../combinator': 15,
            '../inline': 39,
            '../source/validation': 65,
            '../squash': 66
        }
    ],
    41: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var inline_1 = require('../inline');
            var combinator_1 = require('../../combinator');
            var squash_1 = require('../squash');
            var validation_1 = require('../source/validation');
            var syntax = /^\(\([\s\S]+?\)\)/;
            var closer = /^\)\)/;
            exports.annotation = function (source) {
                if (!validation_1.validate(source, '((', syntax))
                    return;
                return combinator_1.transform(combinator_1.bracket('((', combinator_1.loop(combinator_1.combine([inline_1.inline]), closer), '))'), function (ns, rest) {
                    var el = document.createElement('sup');
                    void el.setAttribute('class', 'annotation');
                    void el.appendChild(squash_1.squash(ns));
                    if (el.textContent.trim() === '')
                        return;
                    return [
                        [el],
                        rest
                    ];
                })(source);
            };
        },
        {
            '../../combinator': 15,
            '../inline': 39,
            '../source/validation': 65,
            '../squash': 66
        }
    ],
    42: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var combinator_1 = require('../../combinator');
            var url_1 = require('./autolink/url');
            var account_1 = require('./autolink/account');
            exports.autolink = combinator_1.combine([
                url_1.url,
                account_1.account
            ]);
        },
        {
            '../../combinator': 15,
            './autolink/account': 43,
            './autolink/url': 44
        }
    ],
    43: [
        function (require, module, exports) {
            'use strict';
            var __read = this && this.__read || function (o, n) {
                var m = typeof Symbol === 'function' && o[Symbol.iterator];
                if (!m)
                    return o;
                var i = m.call(o), r, ar = [], e;
                try {
                    while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                        ar.push(r.value);
                } catch (error) {
                    e = { error: error };
                } finally {
                    try {
                        if (r && !r.done && (m = i['return']))
                            m.call(i);
                    } finally {
                        if (e)
                            throw e.error;
                    }
                }
                return ar;
            };
            Object.defineProperty(exports, '__esModule', { value: true });
            var syntax = /^@[a-zA-Z0-9]+(?:-[0-9a-zA-Z]+)*(?!@)/;
            var escape = /^[0-9a-zA-Z@]@/;
            exports.account = function (source) {
                if (source.search(escape) === 0) {
                    var _a = __read(source.match(/^[0-9a-zA-Z@].*?(?!@|h?ttps?:)/) || [source], 1), frag = _a[0];
                    return [
                        [document.createTextNode(frag)],
                        source.slice(frag.length)
                    ];
                }
                var _b = __read(source.match(syntax) || [''], 1), whole = _b[0];
                if (!whole)
                    return;
                var el = document.createElement('span');
                void el.setAttribute('class', 'account');
                void el.appendChild(document.createTextNode(whole));
                return [
                    [el],
                    source.slice(whole.length)
                ];
            };
        },
        {}
    ],
    44: [
        function (require, module, exports) {
            'use strict';
            var __read = this && this.__read || function (o, n) {
                var m = typeof Symbol === 'function' && o[Symbol.iterator];
                if (!m)
                    return o;
                var i = m.call(o), r, ar = [], e;
                try {
                    while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                        ar.push(r.value);
                } catch (error) {
                    e = { error: error };
                } finally {
                    try {
                        if (r && !r.done && (m = i['return']))
                            m.call(i);
                    } finally {
                        if (e)
                            throw e.error;
                    }
                }
                return ar;
            };
            Object.defineProperty(exports, '__esModule', { value: true });
            var combinator_1 = require('../../../combinator');
            var escapable_1 = require('../../source/escapable');
            var link_1 = require('../link');
            var syntax = /^(?:!?h)?ttps?:\/\/\S/;
            var closer = /^['"`[\](){}<>]|^\\?(?:\s|$)|^[~^+*,.;:!?]*(?:[\s\])}<>|]|$)/;
            var escape = /^(?:[0-9a-zA-Z][!?]*h|\?h|[0-9a-gi-zA-Z!?])ttps?:\/\/\S/;
            exports.url = function (source) {
                if (source.search(escape) === 0)
                    return [
                        [document.createTextNode(source.slice(0, source.indexOf(':')))],
                        source.slice(source.indexOf(':'))
                    ];
                if (source.search(syntax) !== 0)
                    return;
                var flag = source.startsWith('!h');
                source = flag ? source.slice(1) : source;
                var _a = __read(combinator_1.loop(escapable_1.escsource, closer)(source) || [
                        [],
                        ''
                    ], 2), rest = _a[1];
                var attribute = source.startsWith('ttp') ? ' nofollow' : '';
                var uri = '' + (source.startsWith('ttp') ? 'h' : '') + source.slice(0, source.length - rest.length);
                return !flag ? link_1.link('[](' + uri + attribute + ')' + rest) : link_1.link('[![](' + uri + ')](' + uri + ')' + rest);
            };
        },
        {
            '../../../combinator': 15,
            '../../source/escapable': 62,
            '../link': 55
        }
    ],
    45: [
        function (require, module, exports) {
            'use strict';
            var __read = this && this.__read || function (o, n) {
                var m = typeof Symbol === 'function' && o[Symbol.iterator];
                if (!m)
                    return o;
                var i = m.call(o), r, ar = [], e;
                try {
                    while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                        ar.push(r.value);
                } catch (error) {
                    e = { error: error };
                } finally {
                    try {
                        if (r && !r.done && (m = i['return']))
                            m.call(i);
                    } finally {
                        if (e)
                            throw e.error;
                    }
                }
                return ar;
            };
            var __spread = this && this.__spread || function () {
                for (var ar = [], i = 0; i < arguments.length; i++)
                    ar = ar.concat(__read(arguments[i]));
                return ar;
            };
            Object.defineProperty(exports, '__esModule', { value: true });
            var inline_1 = require('../inline');
            var combinator_1 = require('../../combinator');
            var squash_1 = require('../squash');
            var validation_1 = require('../source/validation');
            var syntax = /^{[\s\S]*?}/;
            var closer = /^}/;
            exports.brace = function (source) {
                if (!validation_1.validate(source, '{', syntax))
                    return;
                return combinator_1.transform(combinator_1.bracket('{', combinator_1.loop(combinator_1.combine([inline_1.inline]), closer), '}'), function (ns, rest) {
                    return [
                        __spread(squash_1.squash(__spread([document.createTextNode('{')], ns, [document.createTextNode('}')])).childNodes),
                        rest
                    ];
                })(source);
            };
        },
        {
            '../../combinator': 15,
            '../inline': 39,
            '../source/validation': 65,
            '../squash': 66
        }
    ],
    46: [
        function (require, module, exports) {
            'use strict';
            var __read = this && this.__read || function (o, n) {
                var m = typeof Symbol === 'function' && o[Symbol.iterator];
                if (!m)
                    return o;
                var i = m.call(o), r, ar = [], e;
                try {
                    while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                        ar.push(r.value);
                } catch (error) {
                    e = { error: error };
                } finally {
                    try {
                        if (r && !r.done && (m = i['return']))
                            m.call(i);
                    } finally {
                        if (e)
                            throw e.error;
                    }
                }
                return ar;
            };
            var __spread = this && this.__spread || function () {
                for (var ar = [], i = 0; i < arguments.length; i++)
                    ar = ar.concat(__read(arguments[i]));
                return ar;
            };
            Object.defineProperty(exports, '__esModule', { value: true });
            var inline_1 = require('../inline');
            var combinator_1 = require('../../combinator');
            var squash_1 = require('../squash');
            var validation_1 = require('../source/validation');
            var syntax = /^\[[\s\S]*?\]/;
            var closer = /^\]/;
            exports.bracket = function (source) {
                if (!validation_1.validate(source, '[', syntax))
                    return;
                return combinator_1.transform(combinator_1.bracket('[', combinator_1.loop(combinator_1.combine([inline_1.inline]), closer), ']'), function (ns, rest) {
                    return [
                        __spread(squash_1.squash(__spread([document.createTextNode('[')], ns, [document.createTextNode(']')])).childNodes),
                        rest
                    ];
                })(source);
            };
        },
        {
            '../../combinator': 15,
            '../inline': 39,
            '../source/validation': 65,
            '../squash': 66
        }
    ],
    47: [
        function (require, module, exports) {
            'use strict';
            var __read = this && this.__read || function (o, n) {
                var m = typeof Symbol === 'function' && o[Symbol.iterator];
                if (!m)
                    return o;
                var i = m.call(o), r, ar = [], e;
                try {
                    while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                        ar.push(r.value);
                } catch (error) {
                    e = { error: error };
                } finally {
                    try {
                        if (r && !r.done && (m = i['return']))
                            m.call(i);
                    } finally {
                        if (e)
                            throw e.error;
                    }
                }
                return ar;
            };
            Object.defineProperty(exports, '__esModule', { value: true });
            var combinator_1 = require('../../combinator');
            var unescapable_1 = require('../source/unescapable');
            var backquote_1 = require('../source/backquote');
            var squash_1 = require('../squash');
            var validation_1 = require('../source/validation');
            var syntax = /^(`+)[^\n]+?\1/;
            exports.code = function (source) {
                if (!validation_1.validate(source, '`'))
                    return;
                var _a = __read(source.match(syntax) || [
                        '',
                        ''
                    ], 2), whole = _a[0], keyword = _a[1];
                if (!whole)
                    return;
                return combinator_1.transform(combinator_1.bracket(keyword, combinator_1.loop(combinator_1.combine([
                    combinator_1.loop(backquote_1.backquote),
                    unescapable_1.unescsource
                ]), '^' + keyword + '(?!`)'), keyword), function (ns, rest) {
                    var el = document.createElement('code');
                    void el.appendChild(squash_1.squash(ns));
                    el.textContent = el.textContent.trim();
                    if (el.textContent === '')
                        return;
                    void el.setAttribute('data-src', source.slice(0, source.length - rest.length));
                    return [
                        [el],
                        rest
                    ];
                })(source);
            };
        },
        {
            '../../combinator': 15,
            '../source/backquote': 61,
            '../source/unescapable': 64,
            '../source/validation': 65,
            '../squash': 66
        }
    ],
    48: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var inline_1 = require('../inline');
            var combinator_1 = require('../../combinator');
            var strong_1 = require('./strong');
            var squash_1 = require('../squash');
            var validation_1 = require('../source/validation');
            var syntax = /^\*[\s\S]+?\*/;
            var closer = /^\*/;
            exports.emphasis = function (source) {
                if (!validation_1.validate(source, '*', syntax))
                    return;
                return combinator_1.transform(combinator_1.bracket('*', combinator_1.loop(combinator_1.combine([
                    combinator_1.loop(inline_1.inline, closer),
                    strong_1.strong
                ])), '*'), function (ns, rest) {
                    var el = document.createElement('em');
                    void el.appendChild(squash_1.squash(ns));
                    if (el.textContent.trim() === '')
                        return;
                    return [
                        [el],
                        rest
                    ];
                })(source);
            };
        },
        {
            '../../combinator': 15,
            '../inline': 39,
            '../source/validation': 65,
            '../squash': 66,
            './strong': 59
        }
    ],
    49: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var combinator_1 = require('../../combinator');
            var index_1 = require('./extension/index');
            var placeholder_1 = require('./extension/placeholder');
            exports.extension = combinator_1.combine([
                index_1.index,
                placeholder_1.placeholder
            ]);
        },
        {
            '../../combinator': 15,
            './extension/index': 50,
            './extension/placeholder': 51
        }
    ],
    50: [
        function (require, module, exports) {
            'use strict';
            var __read = this && this.__read || function (o, n) {
                var m = typeof Symbol === 'function' && o[Symbol.iterator];
                if (!m)
                    return o;
                var i = m.call(o), r, ar = [], e;
                try {
                    while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                        ar.push(r.value);
                } catch (error) {
                    e = { error: error };
                } finally {
                    try {
                        if (r && !r.done && (m = i['return']))
                            m.call(i);
                    } finally {
                        if (e)
                            throw e.error;
                    }
                }
                return ar;
            };
            Object.defineProperty(exports, '__esModule', { value: true });
            var link_1 = require('../link');
            var index_1 = require('../../string/index');
            var template_1 = require('./template');
            exports.index = template_1.template(function (flag, query) {
                if (flag !== '#')
                    return;
                var result = link_1.link('[](#)');
                if (!result)
                    return;
                var _a = __read(result, 2), _b = __read(_a[0], 1), el = _b[0], rest = _a[1];
                void el.setAttribute('href', '#' + index_1.makeIndex(query));
                el.textContent = query;
                return [
                    [el],
                    rest
                ];
            });
        },
        {
            '../../string/index': 67,
            '../link': 55,
            './template': 52
        }
    ],
    51: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var inline_1 = require('../../inline');
            var combinator_1 = require('../../../combinator');
            var squash_1 = require('../../squash');
            var template_1 = require('./template');
            exports.placeholder = template_1.template(function (flag) {
                var el = document.createElement('span');
                void el.appendChild(squash_1.squash(combinator_1.loop(inline_1.inline)('++**WARNING: DON\'T USE `[' + flag + ' ]` SYNTAX!!** This syntax is reserved for extensibility.++')[0]));
                return [
                    [el],
                    ''
                ];
            });
        },
        {
            '../../../combinator': 15,
            '../../inline': 39,
            '../../squash': 66,
            './template': 52
        }
    ],
    52: [
        function (require, module, exports) {
            'use strict';
            var __read = this && this.__read || function (o, n) {
                var m = typeof Symbol === 'function' && o[Symbol.iterator];
                if (!m)
                    return o;
                var i = m.call(o), r, ar = [], e;
                try {
                    while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                        ar.push(r.value);
                } catch (error) {
                    e = { error: error };
                } finally {
                    try {
                        if (r && !r.done && (m = i['return']))
                            m.call(i);
                    } finally {
                        if (e)
                            throw e.error;
                    }
                }
                return ar;
            };
            Object.defineProperty(exports, '__esModule', { value: true });
            var combinator_1 = require('../../../combinator');
            var text_1 = require('../../source/text');
            var squash_1 = require('../../squash');
            var validation_1 = require('../../source/validation');
            var syntax = /^\[[~#:^\[][^\s\[\]][^\n]*?\]/;
            exports.template = function (parser) {
                return function (source) {
                    var _a = __read(parse(source) || [
                            '',
                            '',
                            ''
                        ], 3), flag = _a[0], query = _a[1], rest = _a[2];
                    if (!flag)
                        return undefined;
                    var result = parser(flag, query);
                    if (!result)
                        return undefined;
                    return [
                        result[0],
                        rest
                    ];
                };
            };
            function parse(source) {
                if (!validation_1.validate(source, '[', syntax))
                    return;
                var _a = __read(combinator_1.bracket('[', combinator_1.loop(combinator_1.combine([text_1.text]), /^[\]\n]/), ']')(source) || [
                        [],
                        source
                    ], 2), cs = _a[0], rest = _a[1];
                if (rest === source)
                    return;
                var txt = squash_1.squash(cs).textContent;
                if (txt === '' || txt !== txt.trim())
                    return;
                return [
                    txt[0],
                    txt.slice(1),
                    rest
                ];
            }
        },
        {
            '../../../combinator': 15,
            '../../source/text': 63,
            '../../source/validation': 65,
            '../../squash': 66
        }
    ],
    53: [
        function (require, module, exports) {
            'use strict';
            var __read = this && this.__read || function (o, n) {
                var m = typeof Symbol === 'function' && o[Symbol.iterator];
                if (!m)
                    return o;
                var i = m.call(o), r, ar = [], e;
                try {
                    while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                        ar.push(r.value);
                } catch (error) {
                    e = { error: error };
                } finally {
                    try {
                        if (r && !r.done && (m = i['return']))
                            m.call(i);
                    } finally {
                        if (e)
                            throw e.error;
                    }
                }
                return ar;
            };
            Object.defineProperty(exports, '__esModule', { value: true });
            var inline_1 = require('../inline');
            var combinator_1 = require('../../combinator');
            var squash_1 = require('../squash');
            var validation_1 = require('../source/validation');
            var syntax = /^<([a-z]+)>/;
            var inlinetags = Object.freeze('ins|del|sup|sub|small|q|cite|mark|ruby|rt|rp|bdi|bdo|wbr'.split('|'));
            exports.html = function (source) {
                if (!validation_1.validate(source, '<'))
                    return;
                var _a = __read(source.match(syntax) || [
                        '',
                        '',
                        ''
                    ], 2), opentag = _a[0], tagname = _a[1];
                if (!opentag)
                    return;
                if (inlinetags.indexOf(tagname) === -1)
                    return;
                if (tagname === 'wbr')
                    return [
                        [document.createElement(tagname)],
                        source.slice(opentag.length)
                    ];
                return combinator_1.transform(combinator_1.bracket('<' + tagname + '>', combinator_1.loop(combinator_1.combine([inline_1.inline]), '^</' + tagname + '>'), '</' + tagname + '>'), function (ns, rest) {
                    var el = document.createElement(tagname);
                    void el.appendChild(squash_1.squash(ns));
                    if (el.textContent.trim() === '')
                        return;
                    return [
                        [el],
                        rest
                    ];
                })(source);
            };
        },
        {
            '../../combinator': 15,
            '../inline': 39,
            '../source/validation': 65,
            '../squash': 66
        }
    ],
    54: [
        function (require, module, exports) {
            'use strict';
            var __read = this && this.__read || function (o, n) {
                var m = typeof Symbol === 'function' && o[Symbol.iterator];
                if (!m)
                    return o;
                var i = m.call(o), r, ar = [], e;
                try {
                    while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                        ar.push(r.value);
                } catch (error) {
                    e = { error: error };
                } finally {
                    try {
                        if (r && !r.done && (m = i['return']))
                            m.call(i);
                    } finally {
                        if (e)
                            throw e.error;
                    }
                }
                return ar;
            };
            Object.defineProperty(exports, '__esModule', { value: true });
            var validation_1 = require('../source/validation');
            var syntax = /^&(?:[0-9a-z]+|#[0-9]{1,8}|#x[0-9a-f]{1,8});/i;
            exports.htmlentity = function (source) {
                if (!validation_1.validate(source, '&'))
                    return;
                var _a = __read(source.match(syntax) || [''], 1), whole = _a[0];
                if (!whole)
                    return;
                return [
                    [document.createTextNode(parse(whole))],
                    source.slice(whole.length)
                ];
            };
            var parser = document.createElement('span');
            function parse(str) {
                parser.innerHTML = str;
                return parser.textContent;
            }
        },
        { '../source/validation': 65 }
    ],
    55: [
        function (require, module, exports) {
            'use strict';
            var __read = this && this.__read || function (o, n) {
                var m = typeof Symbol === 'function' && o[Symbol.iterator];
                if (!m)
                    return o;
                var i = m.call(o), r, ar = [], e;
                try {
                    while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                        ar.push(r.value);
                } catch (error) {
                    e = { error: error };
                } finally {
                    try {
                        if (r && !r.done && (m = i['return']))
                            m.call(i);
                    } finally {
                        if (e)
                            throw e.error;
                    }
                }
                return ar;
            };
            Object.defineProperty(exports, '__esModule', { value: true });
            var inline_1 = require('../inline');
            var combinator_1 = require('../../combinator');
            var escapable_1 = require('../source/escapable');
            var squash_1 = require('../squash');
            var validation_1 = require('../source/validation');
            var url_1 = require('../string/url');
            var syntax = /^\[[^\n]*?\]\n?\(/;
            exports.link = function (source) {
                if (!validation_1.validate(source, '[', syntax))
                    return;
                return combinator_1.transform(combinator_1.bracket('[', combinator_1.loop(combinator_1.combine([inline_1.inline]), /^\]\n?\(|^\n/), /\]\n?/), function (ns, rest) {
                    var children = squash_1.squash(ns);
                    if (children.querySelector('a, .annotation'))
                        return;
                    if (children.querySelector('img')) {
                        if (children.childNodes.length > 1)
                            return;
                    } else {
                        if (children.childNodes.length > 0 && children.textContent.trim() === '')
                            return;
                        if (children.textContent !== children.textContent.trim())
                            return;
                    }
                    return combinator_1.transform(combinator_1.bracket('(', combinator_1.loop(escapable_1.escsource, /^\)|^\s(?!nofollow)/), ')'), function (ns, rest) {
                        var _a = __read(ns.reduce(function (s, c) {
                                return s + c.textContent;
                            }, '').replace(/\\(.)/g, '$1').split(/\s/), 2), INSECURE_URL = _a[0], attribute = _a[1];
                        var url = url_1.sanitize(INSECURE_URL);
                        if (INSECURE_URL !== '' && url === '')
                            return;
                        var el = document.createElement('a');
                        void el.setAttribute('href', url);
                        void el.setAttribute('rel', attribute === 'nofollow' ? 'noopener nofollow noreferrer' : 'noopener');
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
            '../../combinator': 15,
            '../inline': 39,
            '../source/escapable': 62,
            '../source/validation': 65,
            '../squash': 66,
            '../string/url': 68
        }
    ],
    56: [
        function (require, module, exports) {
            'use strict';
            var __read = this && this.__read || function (o, n) {
                var m = typeof Symbol === 'function' && o[Symbol.iterator];
                if (!m)
                    return o;
                var i = m.call(o), r, ar = [], e;
                try {
                    while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                        ar.push(r.value);
                } catch (error) {
                    e = { error: error };
                } finally {
                    try {
                        if (r && !r.done && (m = i['return']))
                            m.call(i);
                    } finally {
                        if (e)
                            throw e.error;
                    }
                }
                return ar;
            };
            var __spread = this && this.__spread || function () {
                for (var ar = [], i = 0; i < arguments.length; i++)
                    ar = ar.concat(__read(arguments[i]));
                return ar;
            };
            Object.defineProperty(exports, '__esModule', { value: true });
            var combinator_1 = require('../../combinator');
            var escapable_1 = require('../source/escapable');
            var squash_1 = require('../squash');
            var validation_1 = require('../source/validation');
            var cache_1 = require('spica/cache');
            exports.cache = new cache_1.Cache(100);
            var syntax = /^\$\S[^\n]*?\$(?!\d)/;
            var closer = /^\$(?!\d)|^\n/;
            exports.mathinline = function (source) {
                if (source.startsWith('$$'))
                    return;
                if (!validation_1.validate(source, '$', syntax))
                    return;
                return combinator_1.transform(combinator_1.bracket('$', combinator_1.loop(combinator_1.combine([escapable_1.escsource]), closer), '$'), function (ns, rest) {
                    var el = document.createElement('span');
                    void el.setAttribute('class', 'math');
                    void el.appendChild(squash_1.squash(__spread([document.createTextNode('$')], ns, [document.createTextNode('$')])));
                    if (el.textContent.slice(1, -1) !== el.textContent.slice(1, -1).trim())
                        return;
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
            '../../combinator': 15,
            '../source/escapable': 62,
            '../source/validation': 65,
            '../squash': 66,
            'spica/cache': 5
        }
    ],
    57: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var combinator_1 = require('../../combinator');
            var text_1 = require('../source/text');
            var escapable_1 = require('../source/escapable');
            var validation_1 = require('../source/validation');
            var url_1 = require('../string/url');
            var typed_dom_1 = require('typed-dom');
            var cache_1 = require('spica/cache');
            exports.cache = new cache_1.Cache(100);
            var syntax = /^!\[[^\n]*?\]\n?\(/;
            exports.media = function (source) {
                if (!validation_1.validate(source, '![', syntax))
                    return;
                return combinator_1.transform(combinator_1.bracket('![', combinator_1.loop(combinator_1.combine([text_1.text]), /^\]\n?\(|^\n/), /\]\n?/), function (ns, rest) {
                    var caption = ns.reduce(function (s, c) {
                        return s + c.textContent;
                    }, '').trim();
                    return combinator_1.transform(combinator_1.bracket('(', combinator_1.loop(escapable_1.escsource, /^\)|^\s/), ')'), function (ns, rest) {
                        var url = url_1.sanitize(ns.reduce(function (s, c) {
                            return s + c.textContent;
                        }, '').replace(/\\(.)/g, '$1'));
                        if (url === '')
                            return;
                        if (exports.cache.has(url))
                            return [
                                [exports.cache.get(url).cloneNode(true)],
                                rest
                            ];
                        var el = typed_dom_1.default.img({
                            'data-src': url,
                            alt: caption
                        }).element;
                        return [
                            [el],
                            rest
                        ];
                    })(rest);
                })(source);
            };
        },
        {
            '../../combinator': 15,
            '../source/escapable': 62,
            '../source/text': 63,
            '../source/validation': 65,
            '../string/url': 68,
            'spica/cache': 5,
            'typed-dom': 9
        }
    ],
    58: [
        function (require, module, exports) {
            'use strict';
            var __read = this && this.__read || function (o, n) {
                var m = typeof Symbol === 'function' && o[Symbol.iterator];
                if (!m)
                    return o;
                var i = m.call(o), r, ar = [], e;
                try {
                    while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                        ar.push(r.value);
                } catch (error) {
                    e = { error: error };
                } finally {
                    try {
                        if (r && !r.done && (m = i['return']))
                            m.call(i);
                    } finally {
                        if (e)
                            throw e.error;
                    }
                }
                return ar;
            };
            var __spread = this && this.__spread || function () {
                for (var ar = [], i = 0; i < arguments.length; i++)
                    ar = ar.concat(__read(arguments[i]));
                return ar;
            };
            Object.defineProperty(exports, '__esModule', { value: true });
            var inline_1 = require('../inline');
            var combinator_1 = require('../../combinator');
            var squash_1 = require('../squash');
            var validation_1 = require('../source/validation');
            var syntax = /^\([\s\S]*?\)/;
            var closer = /^\)/;
            exports.parenthesis = function (source) {
                if (!validation_1.validate(source, '(', syntax))
                    return;
                return combinator_1.transform(combinator_1.bracket('(', combinator_1.loop(combinator_1.combine([inline_1.inline]), closer), ')'), function (ns, rest) {
                    return [
                        __spread(squash_1.squash(__spread([document.createTextNode('(')], ns, [document.createTextNode(')')])).childNodes),
                        rest
                    ];
                })(source);
            };
        },
        {
            '../../combinator': 15,
            '../inline': 39,
            '../source/validation': 65,
            '../squash': 66
        }
    ],
    59: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var inline_1 = require('../inline');
            var combinator_1 = require('../../combinator');
            var squash_1 = require('../squash');
            var validation_1 = require('../source/validation');
            var syntax = /^\*\*[\s\S]+?\*\*/;
            var closer = /^\*\*/;
            exports.strong = function (source) {
                if (!validation_1.validate(source, '**', syntax))
                    return;
                return combinator_1.transform(combinator_1.bracket('**', combinator_1.loop(combinator_1.combine([inline_1.inline]), closer), '**'), function (ns, rest) {
                    var el = document.createElement('strong');
                    void el.appendChild(squash_1.squash(ns));
                    if (el.textContent.trim() === '')
                        return;
                    return [
                        [el],
                        rest
                    ];
                })(source);
            };
        },
        {
            '../../combinator': 15,
            '../inline': 39,
            '../source/validation': 65,
            '../squash': 66
        }
    ],
    60: [
        function (require, module, exports) {
            'use strict';
            var __read = this && this.__read || function (o, n) {
                var m = typeof Symbol === 'function' && o[Symbol.iterator];
                if (!m)
                    return o;
                var i = m.call(o), r, ar = [], e;
                try {
                    while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                        ar.push(r.value);
                } catch (error) {
                    e = { error: error };
                } finally {
                    try {
                        if (r && !r.done && (m = i['return']))
                            m.call(i);
                    } finally {
                        if (e)
                            throw e.error;
                    }
                }
                return ar;
            };
            Object.defineProperty(exports, '__esModule', { value: true });
            var pretext_1 = require('../parser/block/pretext');
            var extension_1 = require('../parser/block/extension');
            var combinator_1 = require('../combinator');
            var syntax = /^(?:[^\S\n]*\n)+|^(?:[^\n]*\n)+?[^\S\n]*\n/;
            function segment(source) {
                var segments = [];
                while (source.length > 0) {
                    var _a = __read(combinator_1.combine([
                            pretext_1.pretext,
                            extension_1.extension
                        ])(source) || [
                            [],
                            source.slice((source.match(syntax) || [source])[0].length)
                        ], 2), rest = _a[1];
                    void segments.push(source.slice(0, source.length - rest.length));
                    source = rest;
                }
                return segments;
            }
            exports.segment = segment;
        },
        {
            '../combinator': 15,
            '../parser/block/extension': 25,
            '../parser/block/pretext': 35
        }
    ],
    61: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.backquote = function (source) {
                switch (source[0]) {
                case '`':
                    return [
                        [document.createTextNode(source.slice(0, 1))],
                        source.slice(1)
                    ];
                default:
                    return;
                }
            };
        },
        {}
    ],
    62: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var separator = /[^0-9a-zA-Z\u0080-\uFFFF]/;
            exports.escsource = function (source) {
                if (source.length === 0)
                    return;
                var i = source.search(separator);
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
    63: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var separator = /[^0-9a-zA-Z\u0080-\uFFFF]|[\u0300-\u036F]|(?:[0-9a-zA-Z][!?]*h|\?h|[0-9a-gi-zA-Z!?])ttps?:|[0-9a-zA-Z@]?@[0-9a-zA-Z]|[、。]/;
            var linebreaks = /^(?:(?:\\?\s)*?\\?\n)+/;
            exports.text = function (source) {
                if (source.length === 0)
                    return;
                var i = source.search(separator);
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
                                [document.createElement('br')],
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
                            [document.createTextNode(' ')],
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
        {}
    ],
    64: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var separator = /`|<\/code>|\n/i;
            exports.unescsource = function (source) {
                if (source.length === 0)
                    return;
                var i = source.search(separator);
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
    65: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            function validate(source, start, syntax) {
                return source.startsWith(start) && (!syntax || source.search(syntax) === 0);
            }
            exports.validate = validate;
        },
        {}
    ],
    66: [
        function (require, module, exports) {
            'use strict';
            var __values = this && this.__values || function (o) {
                var m = typeof Symbol === 'function' && o[Symbol.iterator], i = 0;
                if (m)
                    return m.call(o);
                return {
                    next: function () {
                        if (o && i >= o.length)
                            o = void 0;
                        return {
                            value: o && o[i++],
                            done: !o
                        };
                    }
                };
            };
            Object.defineProperty(exports, '__esModule', { value: true });
            function squash(nodes) {
                var frag = document.createDocumentFragment();
                try {
                    for (var nodes_1 = __values(nodes), nodes_1_1 = nodes_1.next(); !nodes_1_1.done; nodes_1_1 = nodes_1.next()) {
                        var curr = nodes_1_1.value;
                        var prev = frag.lastChild;
                        if (prev && prev.nodeType === 3 && curr.nodeType === 3) {
                            prev.textContent += curr.textContent;
                            curr.textContent = '';
                        } else {
                            void frag.appendChild(curr);
                        }
                    }
                } catch (e_1_1) {
                    e_1 = { error: e_1_1 };
                } finally {
                    try {
                        if (nodes_1_1 && !nodes_1_1.done && (_a = nodes_1.return))
                            _a.call(nodes_1);
                    } finally {
                        if (e_1)
                            throw e_1.error;
                    }
                }
                return frag;
                var e_1, _a;
            }
            exports.squash = squash;
        },
        {}
    ],
    67: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            function makeIndex(text) {
                return 'index:' + text.trim().replace(/\s+/g, '-');
            }
            exports.makeIndex = makeIndex;
        },
        {}
    ],
    68: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            function sanitize(url) {
                url = url.trim().replace(/\s/g, encodeURIComponent);
                return isAcceptedProtocol(url) ? url : '';
            }
            exports.sanitize = sanitize;
            var parser = document.createElement('a');
            function isAcceptedProtocol(url) {
                parser.setAttribute('href', url);
                return [
                    'http:',
                    'https:'
                ].indexOf(parser.protocol) !== -1;
            }
        },
        {}
    ],
    69: [
        function (require, module, exports) {
            'use strict';
            var __read = this && this.__read || function (o, n) {
                var m = typeof Symbol === 'function' && o[Symbol.iterator];
                if (!m)
                    return o;
                var i = m.call(o), r, ar = [], e;
                try {
                    while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                        ar.push(r.value);
                } catch (error) {
                    e = { error: error };
                } finally {
                    try {
                        if (r && !r.done && (m = i['return']))
                            m.call(i);
                    } finally {
                        if (e)
                            throw e.error;
                    }
                }
                return ar;
            };
            var __spread = this && this.__spread || function () {
                for (var ar = [], i = 0; i < arguments.length; i++)
                    ar = ar.concat(__read(arguments[i]));
                return ar;
            };
            Object.defineProperty(exports, '__esModule', { value: true });
            var parser_1 = require('./parser');
            var segment_1 = require('../parser/segment');
            var concat_1 = require('spica/concat');
            function bind(el) {
                var pairs = [];
                return function (source) {
                    var os = pairs.map(function (_a) {
                        var _b = __read(_a, 1), s = _b[0];
                        return s;
                    });
                    if (source === os.join(''))
                        return [];
                    var ns = segment_1.segment(source);
                    var i = 0;
                    for (; i < os.length; ++i) {
                        if (os[i] !== ns[i])
                            break;
                    }
                    var j = 0;
                    for (; i + j < os.length && i + j < ns.length; ++j) {
                        if (os[os.length - j - 1] !== ns[ns.length - j - 1])
                            break;
                    }
                    void pairs.splice(i, os.length - j - i).forEach(function (_a) {
                        var _b = __read(_a, 2), es = _b[1];
                        return void es.forEach(function (e) {
                            return void e.remove();
                        });
                    });
                    var ref = pairs.slice(i).reduce(function (e, _a) {
                        var _b = __read(_a, 2), es = _b[1];
                        return e || es[0];
                    }, null);
                    var ps = ns.slice(i, ns.length - j).map(function (s) {
                        return [
                            s,
                            __spread(parser_1.parse(s).children).map(function (e) {
                                return el.insertBefore(e, ref);
                            })
                        ];
                    });
                    void pairs.splice.apply(pairs, __spread([
                        i,
                        0
                    ], ps));
                    return ps.reduce(function (acc, _a) {
                        var _b = __read(_a, 2), es = _b[1];
                        return concat_1.concat(acc, es);
                    }, []);
                };
            }
            exports.bind = bind;
        },
        {
            '../parser/segment': 60,
            './parser': 70,
            'spica/concat': 6
        }
    ],
    70: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var combinator_1 = require('../combinator');
            var block_1 = require('../parser/block');
            var segment_1 = require('../parser/segment');
            function parse(source) {
                return segment_1.segment(source).reduce(function (doc, source) {
                    return parse_(source).reduce(function (doc, el) {
                        return void doc.appendChild(el), doc;
                    }, doc);
                }, document.createDocumentFragment());
                function parse_(source) {
                    return (combinator_1.loop(block_1.block)(source) || [[]])[0];
                }
            }
            exports.parse = parse;
            var symbols = /[`#&*|\\()\[\]{}]/g;
            function escape(source) {
                return source.replace(symbols, '\\$&');
            }
            exports.escape = escape;
        },
        {
            '../combinator': 15,
            '../parser/block': 21,
            '../parser/segment': 60
        }
    ],
    71: [
        function (require, module, exports) {
            'use strict';
            var __read = this && this.__read || function (o, n) {
                var m = typeof Symbol === 'function' && o[Symbol.iterator];
                if (!m)
                    return o;
                var i = m.call(o), r, ar = [], e;
                try {
                    while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                        ar.push(r.value);
                } catch (error) {
                    e = { error: error };
                } finally {
                    try {
                        if (r && !r.done && (m = i['return']))
                            m.call(i);
                    } finally {
                        if (e)
                            throw e.error;
                    }
                }
                return ar;
            };
            var __spread = this && this.__spread || function () {
                for (var ar = [], i = 0; i < arguments.length; i++)
                    ar = ar.concat(__read(arguments[i]));
                return ar;
            };
            Object.defineProperty(exports, '__esModule', { value: true });
            var media_1 = require('./render/media');
            var code_1 = require('./render/code');
            var math_1 = require('./render/math');
            function render(target, opts) {
                if (opts === void 0) {
                    opts = {};
                }
                void __spread([target], target.querySelectorAll('img, pre, .math')).forEach(function (target) {
                    switch (true) {
                    case target.matches('img:not([src])[data-src]'): {
                            var content = media_1.media(target, opts.media);
                            var scope = content instanceof HTMLImageElement === false && target.closest('a, h1, h2, h3, h4, h5, h6, p, li, dl, td') instanceof HTMLAnchorElement ? target.closest('a') : target;
                            return void scope.parentElement.replaceChild(content, scope);
                        }
                    case target.matches('pre') && target.children.length === 0:
                        return void (opts.code || code_1.code)(target);
                    case target.matches('.math') && target.children.length === 0:
                        return void (opts.math || math_1.math)(target);
                    default:
                        return;
                    }
                });
                return target;
            }
            exports.render = render;
        },
        {
            './render/code': 72,
            './render/math': 73,
            './render/media': 74
        }
    ],
    72: [
        function (require, module, exports) {
            (function (global) {
                'use strict';
                Object.defineProperty(exports, '__esModule', { value: true });
                var Prism = typeof window !== 'undefined' ? window['Prism'] : typeof global !== 'undefined' ? global['Prism'] : null;
                function code(target) {
                    void Prism.highlightElement(target, false);
                }
                exports.code = code;
            }.call(this, typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {}));
        },
        {}
    ],
    73: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var mathinline_1 = require('../../parser/inline/mathinline');
            function math(target) {
                if (target instanceof HTMLDivElement)
                    return void queue(target);
                void target.setAttribute('data-src', target.textContent);
                var expr = target.textContent;
                if (mathinline_1.cache.has(expr))
                    return void (target.innerHTML = mathinline_1.cache.get(expr).innerHTML);
                void queue(target, function () {
                    return void mathinline_1.cache.set(expr, target.cloneNode(true));
                });
            }
            exports.math = math;
            function queue(target, callback) {
                if (callback === void 0) {
                    callback = function () {
                        return undefined;
                    };
                }
                void MathJax.Hub.Queue([
                    'Typeset',
                    MathJax.Hub,
                    target,
                    callback
                ]);
            }
        },
        { '../../parser/inline/mathinline': 56 }
    ],
    74: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var twitter_1 = require('./media/twitter');
            var youtube_1 = require('./media/youtube');
            var gist_1 = require('./media/gist');
            var slideshare_1 = require('./media/slideshare');
            var pdf_1 = require('./media/pdf');
            var image_1 = require('./media/image');
            function media(target, opts) {
                if (opts === void 0) {
                    opts = {};
                }
                var url = target.getAttribute('data-src');
                return undefined || (opts.twitter || twitter_1.twitter)(url) || (opts.youtube || youtube_1.youtube)(url) || (opts.gist || gist_1.gist)(url) || (opts.slideshare || slideshare_1.slideshare)(url) || (opts.pdf || pdf_1.pdf)(url) || (opts.image || image_1.image)(url, target.getAttribute('alt') || '');
            }
            exports.media = media;
        },
        {
            './media/gist': 75,
            './media/image': 76,
            './media/pdf': 77,
            './media/slideshare': 78,
            './media/twitter': 79,
            './media/youtube': 80
        }
    ],
    75: [
        function (require, module, exports) {
            (function (global) {
                'use strict';
                Object.defineProperty(exports, '__esModule', { value: true });
                var typed_dom_1 = require('typed-dom');
                var parser_1 = require('../../parser');
                var cache_1 = require('spica/cache');
                var dompurify_1 = typeof window !== 'undefined' ? window['DOMPurify'] : typeof global !== 'undefined' ? global['DOMPurify'] : null;
                var cache = new cache_1.Cache(100);
                function gist(url) {
                    if (!url.startsWith('https://gist.github.com/'))
                        return;
                    if (cache.has(url))
                        return cache.get(url).cloneNode(true);
                    return typed_dom_1.default.div({
                        class: 'media',
                        style: 'position: relative;'
                    }, [typed_dom_1.default.em('loading ' + url)], function () {
                        var outer = document.createElement('div');
                        void $.ajax(url + '.json', {
                            dataType: 'jsonp',
                            timeout: 10 * 1000,
                            cache: true,
                            success: function (_a) {
                                var div = _a.div, stylesheet = _a.stylesheet, description = _a.description;
                                if (!stylesheet.startsWith('https://assets-cdn.github.com/'))
                                    return;
                                outer.innerHTML = dompurify_1.sanitize('<div style="position: relative; margin-bottom: -1em;">' + div + '</div>');
                                var gist = outer.querySelector('.gist');
                                void gist.insertBefore(typed_dom_1.default.div({ class: 'gist-description' }, [typed_dom_1.default.a({ style: 'text-decoration: none; color: #555; font-size: 14px; font-weight: 600;' }, description, function () {
                                        return parser_1.parse(parser_1.escape(url)).querySelector('a');
                                    })]).element, gist.firstChild);
                                void cache.set(url, outer.cloneNode(true));
                                if (document.head.querySelector('link[rel="stylesheet"][href="' + stylesheet + '"]'))
                                    return;
                                void document.head.appendChild(typed_dom_1.default.link({
                                    rel: 'stylesheet',
                                    href: stylesheet,
                                    crossorigin: 'anonymous'
                                }).element);
                            },
                            error: function (_a) {
                                var status = _a.status, statusText = _a.statusText;
                                outer.innerHTML = parser_1.parse('*' + parser_1.escape(url) + '\\\n-> ' + status + ': ' + parser_1.escape(statusText) + '*').querySelector('p').innerHTML;
                            }
                        });
                        return outer;
                    }).element;
                }
                exports.gist = gist;
            }.call(this, typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {}));
        },
        {
            '../../parser': 70,
            'spica/cache': 5,
            'typed-dom': 9
        }
    ],
    76: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var typed_dom_1 = require('typed-dom');
            var media_1 = require('../../../parser/inline/media');
            function image(url, alt) {
                return media_1.cache.has(url) ? media_1.cache.get(url).cloneNode(true) : media_1.cache.set(url, typed_dom_1.default.img({
                    class: 'media',
                    src: url,
                    alt: alt,
                    style: 'max-width: 100%;'
                }).element.cloneNode(true));
            }
            exports.image = image;
        },
        {
            '../../../parser/inline/media': 57,
            'typed-dom': 9
        }
    ],
    77: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var typed_dom_1 = require('typed-dom');
            var parser_1 = require('../../parser');
            function pdf(url) {
                if (!url.split(/[?#]/, 1).shift().endsWith('.pdf') || url.split('/').length < 4)
                    return;
                return typed_dom_1.default.div({
                    class: 'media',
                    style: 'position: relative;'
                }, [
                    typed_dom_1.default.div({ style: 'position: relative; resize: vertical; overflow: hidden; padding-bottom: 10px;' }, [typed_dom_1.default.object({
                            type: 'application/pdf',
                            data: url,
                            style: 'width: 100%; height: 100%; min-height: 400px;'
                        }, function () {
                            var el = document.createElement('object');
                            el.typeMustMatch = true;
                            return el;
                        })]),
                    typed_dom_1.default.div([typed_dom_1.default.strong({ style: 'word-wrap: break-word;' }, function () {
                            return parser_1.parse('**' + parser_1.escape(url) + '**').querySelector('strong');
                        })])
                ]).element;
            }
            exports.pdf = pdf;
        },
        {
            '../../parser': 70,
            'typed-dom': 9
        }
    ],
    78: [
        function (require, module, exports) {
            (function (global) {
                'use strict';
                Object.defineProperty(exports, '__esModule', { value: true });
                var typed_dom_1 = require('typed-dom');
                var parser_1 = require('../../parser');
                var cache_1 = require('spica/cache');
                var dompurify_1 = typeof window !== 'undefined' ? window['DOMPurify'] : typeof global !== 'undefined' ? global['DOMPurify'] : null;
                var cache = new cache_1.Cache(100);
                function slideshare(url) {
                    if (!url.startsWith('https://www.slideshare.net/'))
                        return;
                    if (cache.has(url))
                        return cache.get(url).cloneNode(true);
                    return typed_dom_1.default.div({
                        class: 'media',
                        style: 'position: relative;'
                    }, [typed_dom_1.default.em('loading ' + url)], function () {
                        var outer = document.createElement('div');
                        void $.ajax('https://www.slideshare.net/api/oembed/2?url=' + url + '&format=json', {
                            dataType: 'jsonp',
                            timeout: 10 * 1000,
                            cache: true,
                            success: function (_a) {
                                var html = _a.html;
                                outer.innerHTML = dompurify_1.sanitize('<div style="position: relative; padding-top: 83%;">' + html + '</div>', { ADD_TAGS: ['iframe'] });
                                var iframe = outer.querySelector('iframe');
                                void iframe.setAttribute('style', 'position: absolute; top: 0; bottom: 0; left: 0; right: 0; width: 100%; height: 100%;');
                                iframe.parentElement.style.paddingTop = +iframe.height / +iframe.width * 100 + '%';
                                void outer.appendChild(iframe.nextElementSibling);
                                void outer.lastElementChild.removeAttribute('style');
                                void cache.set(url, outer.cloneNode(true));
                            },
                            error: function (_a) {
                                var status = _a.status, statusText = _a.statusText;
                                outer.innerHTML = parser_1.parse('*' + parser_1.escape(url) + '\\\n-> ' + status + ': ' + parser_1.escape(statusText) + '*').querySelector('p').innerHTML;
                            }
                        });
                        return outer;
                    }).element;
                }
                exports.slideshare = slideshare;
            }.call(this, typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {}));
        },
        {
            '../../parser': 70,
            'spica/cache': 5,
            'typed-dom': 9
        }
    ],
    79: [
        function (require, module, exports) {
            (function (global) {
                'use strict';
                Object.defineProperty(exports, '__esModule', { value: true });
                var typed_dom_1 = require('typed-dom');
                var parser_1 = require('../../parser');
                var cache_1 = require('spica/cache');
                var dompurify_1 = typeof window !== 'undefined' ? window['DOMPurify'] : typeof global !== 'undefined' ? global['DOMPurify'] : null;
                var widgetScriptRequested = false;
                var cache = new cache_1.Cache(100);
                function twitter(url) {
                    if (!url.startsWith('https://twitter.com/'))
                        return;
                    if (cache.has(url)) {
                        var el = cache.get(url).cloneNode(true);
                        window.twttr && void window.twttr.widgets.load(el);
                        return el;
                    }
                    return typed_dom_1.default.div({
                        class: 'media',
                        style: 'position: relative;'
                    }, [typed_dom_1.default.em('loading ' + url)], function () {
                        var outer = document.createElement('div');
                        void $.ajax('https://publish.twitter.com/oembed?url=' + url.replace('?', '&'), {
                            dataType: 'jsonp',
                            timeout: 10 * 1000,
                            cache: true,
                            success: function (_a) {
                                var html = _a.html;
                                outer.innerHTML = dompurify_1.sanitize('<div style="margin-top: -10px; margin-bottom: -10px;">' + html + '</div>', { ADD_TAGS: ['script'] });
                                void cache.set(url, outer.cloneNode(true));
                                if (window.twttr)
                                    return void window.twttr.widgets.load(outer);
                                if (widgetScriptRequested)
                                    return;
                                widgetScriptRequested = true;
                                var script = outer.querySelector('script');
                                if (!script.getAttribute('src').startsWith('https://platform.twitter.com/'))
                                    return;
                                void $.ajax(script.src, {
                                    dataType: 'script',
                                    cache: true
                                });
                            },
                            error: function (_a) {
                                var status = _a.status, statusText = _a.statusText;
                                outer.innerHTML = parser_1.parse('*' + parser_1.escape(url) + '\\\n-> ' + status + ': ' + parser_1.escape(statusText) + '*').querySelector('p').innerHTML;
                            }
                        });
                        return outer;
                    }).element;
                }
                exports.twitter = twitter;
            }.call(this, typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {}));
        },
        {
            '../../parser': 70,
            'spica/cache': 5,
            'typed-dom': 9
        }
    ],
    80: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var typed_dom_1 = require('typed-dom');
            function youtube(url) {
                if (!url.startsWith('https://youtu.be/') && !url.startsWith('https://www.youtube.com/watch?v='))
                    return;
                return typed_dom_1.default.div({
                    class: 'media',
                    style: 'position: relative;'
                }, [typed_dom_1.default.div({ style: 'position: relative; padding-top: 56.25%;' }, [typed_dom_1.default.iframe({
                            src: 'https://www.youtube.com/embed/' + (url.startsWith('https://youtu.be/') && url.slice(url.indexOf('/', 9) + 1) || url.startsWith('https://www.youtube.com/watch?v=') && url.replace(/.+?=/, '').replace(/&/, '?')),
                            allowfullscreen: '',
                            frameborder: '0',
                            style: 'position: absolute; top: 0; right: 0; width: 100%; height: 100%;'
                        })])]).element;
            }
            exports.youtube = youtube;
        },
        { 'typed-dom': 9 }
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
            __export(require('./src/export'));
        },
        { './src/export': 20 }
    ]
}, {}, [
    1,
    2,
    'securemark',
    3
]);