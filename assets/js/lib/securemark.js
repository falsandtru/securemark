/*! securemark v0.33.0 https://github.com/falsandtru/securemark | (c) 2017, falsandtru | (Apache-2.0 AND MPL-2.0) License */
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
            Object.defineProperty(exports, '__esModule', { value: true });
            var equal_1 = require('./equal');
            var Cache = function () {
                function Cache(size, callback, _a) {
                    if (callback === void 0) {
                        callback = function () {
                            return void 0;
                        };
                    }
                    var _b = _a === void 0 ? {} : _a, _c = _b.stats, stats = _c === void 0 ? [
                            [],
                            []
                        ] : _c, _d = _b.entries, entries = _d === void 0 ? [] : _d;
                    var _this = this;
                    this.size = size;
                    this.callback = callback;
                    if (size > 0 === false)
                        throw new Error('Spica: Cache: Cache size must be greater than 0.');
                    var LFU = stats[1].slice(0, size);
                    var LRU = stats[0].slice(0, size - LFU.length);
                    this.stats = {
                        LRU: LRU,
                        LFU: LFU
                    };
                    this.store = new Map(entries.slice(0, size));
                    if (this.store.size !== LFU.length + LRU.length)
                        throw new Error('Spica: Cache: Size of stats and entries is not matched.');
                    if (!LFU.concat(LRU).every(function (k) {
                            return _this.store.has(k);
                        }))
                        throw new Error('Spica: Cache: Keys of stats and entries is not matched.');
                }
                Cache.prototype.put = function (key, value) {
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
                Cache.prototype.set = function (key, value) {
                    void this.put(key, value);
                    return value;
                };
                Cache.prototype.get = function (key) {
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
                    for (var _i = 0, _b = [
                                LFU,
                                LRU
                            ]; _i < _b.length; _i++) {
                        var log = _b[_i];
                        var index = equal_1.findIndex(key, log);
                        if (index === -1)
                            continue;
                        var val = this.store.get(key);
                        void this.store.delete(log.splice(index, 1)[0]);
                        void this.callback(key, val);
                        return true;
                    }
                    return false;
                };
                Cache.prototype.clear = function () {
                    var _this = this;
                    var entries = Array.from(this);
                    this.store = new Map();
                    this.stats = {
                        LRU: [],
                        LFU: []
                    };
                    return void entries.forEach(function (_a) {
                        var key = _a[0], val = _a[1];
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
                        entries: Array.from(this)
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
                    void LFU.unshift.apply(LFU, LRU.splice(index, 1));
                    return true;
                };
                Cache.prototype.accessLFU = function (key) {
                    if (!this.store.has(key))
                        return false;
                    var LFU = this.stats.LFU;
                    var index = equal_1.findIndex(key, LFU);
                    if (index === -1)
                        return false;
                    void LFU.unshift.apply(LFU, LFU.splice(index, 1));
                    return true;
                };
                return Cache;
            }();
            exports.Cache = Cache;
        },
        { './equal': 5 }
    ],
    5: [
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
    6: [
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
        { './src/export': 9 }
    ],
    7: [
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
            Object.defineProperty(exports, '__esModule', { value: true });
            var TypedHTMLElement = function () {
                function TypedHTMLElement(element_, children_) {
                    var _this = this;
                    this.element_ = element_;
                    this.children_ = children_;
                    this.mode = this.children_ === void 0 ? 'void' : typeof this.children_ === 'string' ? 'text' : Array.isArray(this.children_) ? 'collection' : 'struct';
                    this.structkeys = this.mode === 'struct' ? Object.keys(this.children_) : [];
                    this.tag;
                    switch (this.mode) {
                    case 'void':
                        return;
                    case 'text':
                        void clear();
                        this.children_ = document.createTextNode('');
                        void this.element_.appendChild(this.children_);
                        this.children = children_;
                        return;
                    case 'collection':
                        void clear();
                        if (element_.id) {
                            void children_.forEach(function (_a) {
                                var element = _a.element;
                                return element instanceof HTMLStyleElement && void scope(element);
                            });
                        }
                        this.children_ = Object.freeze([]);
                        this.children = children_;
                        return;
                    case 'struct':
                        void clear();
                        if (element_.id) {
                            void Object.keys(children_).map(function (k) {
                                return children_[k];
                            }).forEach(function (_a) {
                                var element = _a.element;
                                return element instanceof HTMLStyleElement && void scope(element);
                            });
                        }
                        this.children_ = this.observe(__assign({}, children_));
                        void this.structkeys.forEach(function (k) {
                            return void _this.element_.appendChild(children_[k].element);
                        });
                        return;
                    }
                    function clear() {
                        while (element_.childNodes.length > 0) {
                            void element_.removeChild(element_.firstChild);
                        }
                    }
                    function scope(style) {
                        if (!element_.id.match(/^[\w\-]+$/))
                            return;
                        style.innerHTML = style.innerHTML.replace(/^\s*\$scope(?!\w)/gm, '#' + element_.id);
                        void Array.from(style.querySelectorAll('*')).forEach(function (el) {
                            return void el.remove();
                        });
                    }
                }
                Object.defineProperty(TypedHTMLElement.prototype, 'element', {
                    get: function () {
                        return this.element_;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TypedHTMLElement.prototype, 'children', {
                    get: function () {
                        switch (this.mode) {
                        case 'text':
                            return this.children_.data;
                        default:
                            return this.children_;
                        }
                    },
                    set: function (children) {
                        var _this = this;
                        switch (this.mode) {
                        case 'void':
                            return;
                        case 'text':
                            if (children === this.children_.data)
                                return;
                            this.children_.data = children;
                            return;
                        case 'collection':
                            if (children === this.children_)
                                return;
                            if (!Object.isFrozen(this.children_))
                                throw new Error('TypedHTMLElement collections cannot be updated recursively.');
                            void children.reduce(function (ccs, ic) {
                                var i = ccs.indexOf(ic);
                                if (i === -1)
                                    return ccs;
                                void ccs.splice(i, 1);
                                return ccs;
                            }, this.children_.slice()).forEach(function (child) {
                                return void child.element.remove();
                            });
                            this.children_ = [];
                            void children.forEach(function (child, i) {
                                return _this.children_[i] = child, void _this.element_.appendChild(child.element);
                            });
                            void Object.freeze(this.children_);
                            return;
                        case 'struct':
                            if (children === this.children_)
                                return;
                            void this.structkeys.forEach(function (k) {
                                return _this.children_[k] = children[k];
                            });
                            return;
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                TypedHTMLElement.prototype.observe = function (children) {
                    var _this = this;
                    return Object.defineProperties(children, this.structkeys.reduce(function (descs, key) {
                        var current = children[key];
                        descs[key] = {
                            configurable: true,
                            enumerable: true,
                            get: function () {
                                return current;
                            },
                            set: function (newChild) {
                                var oldChild = current;
                                if (newChild === oldChild)
                                    return;
                                current = newChild;
                                void _this.element_.replaceChild(newChild.element, oldChild.element);
                            }
                        };
                        return descs;
                    }, {}));
                };
                return TypedHTMLElement;
            }();
            exports.TypedHTMLElement = TypedHTMLElement;
        },
        {}
    ],
    8: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var builder_1 = require('./builder');
            exports.TypedHTML = [
                'a',
                'applet',
                'area',
                'audio',
                'base',
                'basefont',
                'blockquote',
                'body',
                'br',
                'button',
                'canvas',
                'caption',
                'col',
                'colgroup',
                'data',
                'datalist',
                'del',
                'dir',
                'div',
                'dl',
                'embed',
                'fieldset',
                'font',
                'form',
                'frame',
                'frameset',
                'h1',
                'h2',
                'h3',
                'h4',
                'h5',
                'h6',
                'head',
                'hr',
                'html',
                'iframe',
                'img',
                'input',
                'ins',
                'isindex',
                'label',
                'legend',
                'li',
                'link',
                'listing',
                'map',
                'marquee',
                'menu',
                'meta',
                'meter',
                'nextid',
                'object',
                'ol',
                'optgroup',
                'option',
                'output',
                'p',
                'param',
                'picture',
                'pre',
                'progress',
                'q',
                'script',
                'select',
                'source',
                'span',
                'style',
                'table',
                'tbody',
                'td',
                'template',
                'textarea',
                'tfoot',
                'th',
                'thead',
                'time',
                'title',
                'tr',
                'track',
                'ul',
                'video',
                'x-ms-webview',
                'xmp',
                'abbr',
                'acronym',
                'address',
                'article',
                'aside',
                'b',
                'bdo',
                'big',
                'center',
                'cite',
                'code',
                'dd',
                'dfn',
                'dt',
                'em',
                'figcaption',
                'figure',
                'footer',
                'header',
                'hgroup',
                'i',
                'kbd',
                'keygen',
                'mark',
                'nav',
                'nobr',
                'noframes',
                'noscript',
                'plaintext',
                'rt',
                'ruby',
                's',
                'samp',
                'section',
                'small',
                'strike',
                'strong',
                'sub',
                'sup',
                'tt',
                'u',
                'var',
                'wbr',
                'custom'
            ].reduce(function (obj, tag) {
                return obj[tag] = function (attrs, children, factory) {
                    switch (typeof attrs) {
                    case 'undefined':
                        return new builder_1.TypedHTMLElement(document.createElement(tag), void 0);
                    case 'function':
                        return new builder_1.TypedHTMLElement(attrs(), void 0);
                    case 'string':
                        return new builder_1.TypedHTMLElement((children || function () {
                            return document.createElement(tag);
                        })(), attrs);
                    case 'object':
                        factory = typeof children === 'function' ? children : factory || function () {
                            return document.createElement(tag);
                        };
                        return [Object.keys(attrs)[0]].every(function (key) {
                            return key === void 0 || typeof attrs[key] === 'object';
                        }) ? new builder_1.TypedHTMLElement(factory(), attrs) : new builder_1.TypedHTMLElement(define(factory(), attrs), children === factory ? void 0 : children);
                    default:
                        throw new TypeError('Invalid arguments: [' + attrs + ', ' + children + ', ' + factory + ']');
                    }
                }, obj;
            }, {});
            function define(el, attrs) {
                return Object.keys(attrs).reduce(function (el, name) {
                    return void el.setAttribute(name, attrs[name] || ''), el;
                }, el);
            }
        },
        { './builder': 7 }
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
            var html_1 = require('./dom/html');
            exports.default = html_1.TypedHTML;
            exports.TypedHTML = html_1.TypedHTML;
            __export(require('./util/dom'));
        },
        {
            './dom/html': 8,
            './util/dom': 10
        }
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
            Object.defineProperty(exports, '__esModule', { value: true });
            var noop_1 = require('./noop');
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
                    if (typeof option === 'object' && option.passive) {
                        ev.preventDefault = noop_1.noop;
                    }
                    void listener(ev);
                }
            }
            exports.bind = bind;
            function once(target, type, listener, option) {
                if (option === void 0) {
                    option = false;
                }
                var unbind = bind(target, type, function (ev) {
                    void unbind();
                    void listener(ev);
                }, option);
                return function () {
                    return void unbind();
                };
            }
            exports.once = once;
            function delegate(target, selector, type, listener, option) {
                if (option === void 0) {
                    option = {};
                }
                return bind(target, type, function (ev) {
                    var cx = ev.target.closest(selector);
                    if (!cx)
                        return;
                    void Array.from(target.querySelectorAll(selector)).filter(function (el) {
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
            function adjustEventListenerOptions(option) {
                return supportEventListenerOptions ? option : typeof option === 'boolean' ? option : option.capture;
            }
        },
        { './noop': 11 }
    ],
    11: [
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
    12: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            function combine(parsers) {
                return function (source) {
                    var rest = source;
                    var results = [];
                    for (var _i = 0, parsers_1 = parsers; _i < parsers_1.length; _i++) {
                        var parse = parsers_1[_i];
                        if (rest === '')
                            break;
                        var r = parse(rest);
                        if (!r)
                            continue;
                        void results.push.apply(results, r[0]);
                        rest = r[1];
                        break;
                    }
                    return rest.length < source.length ? [
                        results,
                        rest
                    ] : void 0;
                };
            }
            exports.combine = combine;
        },
        {}
    ],
    13: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            function loop(parser, until) {
                var check = function () {
                    switch (typeof until) {
                    case 'undefined':
                        return function (_) {
                            return false;
                        };
                    case 'function':
                        return function (rest) {
                            return until(rest);
                        };
                    default:
                        return function (rest) {
                            return rest.slice(0, 99).search(until) === 0;
                        };
                    }
                }();
                return function (source) {
                    var rest = source;
                    var results = [];
                    while (true) {
                        if (rest === '')
                            break;
                        if (check(rest))
                            break;
                        var result = parser(rest);
                        if (!result)
                            break;
                        var rs = result[0], r = result[1];
                        void results.push.apply(results, rs);
                        rest = r;
                    }
                    if (rest.length === source.length)
                        return;
                    return !until || check(rest) ? [
                        results,
                        rest
                    ] : void 0;
                };
            }
            exports.loop = loop;
        },
        {}
    ],
    14: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var parser_1 = require('./renderer/parser');
            exports.parse = parser_1.parse;
            var bind_1 = require('./renderer/bind');
            exports.bind = bind_1.bind;
            var render_1 = require('./renderer/render');
            exports.render = render_1.render;
            var cache_1 = require('./parser/cache');
            exports.caches = cache_1.caches;
        },
        {
            './parser/cache': 32,
            './renderer/bind': 61,
            './renderer/parser': 62,
            './renderer/render': 63
        }
    ],
    15: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var combine_1 = require('../combinator/combine');
            var newline_1 = require('./block/newline');
            var horizontalrule_1 = require('./block/horizontalrule');
            var heading_1 = require('./block/heading');
            var ulist_1 = require('./block/ulist');
            var olist_1 = require('./block/olist');
            var dlist_1 = require('./block/dlist');
            var table_1 = require('./block/table');
            var blockquote_1 = require('./block/blockquote');
            var pretext_1 = require('./block/pretext');
            var math_1 = require('./block/math');
            var extension_1 = require('./block/extension');
            var paragraph_1 = require('./block/paragraph');
            exports.block = combine_1.combine([
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
            '../combinator/combine': 12,
            './block/blockquote': 16,
            './block/dlist': 17,
            './block/extension': 19,
            './block/heading': 21,
            './block/horizontalrule': 22,
            './block/math': 25,
            './block/newline': 26,
            './block/olist': 27,
            './block/paragraph': 28,
            './block/pretext': 29,
            './block/table': 30,
            './block/ulist': 31
        }
    ],
    16: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var combine_1 = require('../../combinator/combine');
            var loop_1 = require('../../combinator/loop');
            var end_1 = require('./end');
            var block_1 = require('../block');
            var unescapable_1 = require('../source/unescapable');
            var squash_1 = require('../squash');
            var syntax = /^>+(?=\s|$)/;
            exports.blockquote = end_1.verifyBlockEnd(function (source) {
                var mode = void 0 || source.startsWith('>') && 'plain' || source.startsWith('|>') && 'markdown' || '';
                if (mode === '')
                    return;
                source = mode === 'plain' ? source : source.slice(1);
                var indent = (source.match(syntax) || [''])[0];
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
                    var _a = loop_1.loop(combine_1.combine([unescapable_1.unescsource]), '\n|$')(source) || [
                            [document.createTextNode('')],
                            source
                        ], cs = _a[0], rest = _a[1];
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
                return void Array.from(el.childNodes).reduce(function (ss, node) {
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
                    return (loop_1.loop(block_1.block)(source) || [[]])[0].reduce(function (frag, node) {
                        return frag.appendChild(node), frag;
                    }, document.createDocumentFragment());
                }
            }
        },
        {
            '../../combinator/combine': 12,
            '../../combinator/loop': 13,
            '../block': 15,
            '../source/unescapable': 57,
            '../squash': 58,
            './end': 18
        }
    ],
    17: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var combine_1 = require('../../combinator/combine');
            var loop_1 = require('../../combinator/loop');
            var end_1 = require('./end');
            var indexer_1 = require('./indexer');
            var inline_1 = require('../inline');
            var squash_1 = require('../squash');
            var syntax = /^~\s/;
            var separator = /^[~:](?:\s|$)/;
            exports.dlist = end_1.verifyBlockEnd(function (source) {
                var whole = (source.match(syntax) || [''])[0];
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
                            void dt.appendChild(squash_1.squash((loop_1.loop(combine_1.combine([
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
                            void dd.appendChild(squash_1.squash((loop_1.loop(combine_1.combine([inline_1.inline]))(texts.join('\n').trim()) || [[]])[0]));
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
            '../../combinator/combine': 12,
            '../../combinator/loop': 13,
            '../inline': 33,
            '../squash': 58,
            './end': 18,
            './indexer': 24
        }
    ],
    18: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            function verifyBlockEnd(parser) {
                return function (source) {
                    var result = parser(source);
                    if (!result)
                        return result;
                    if (result[1].split('\n', 1).shift().trim() !== '')
                        return void 0;
                    return result;
                };
            }
            exports.verifyBlockEnd = verifyBlockEnd;
        },
        {}
    ],
    19: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var combine_1 = require('../../combinator/combine');
            var placeholder_1 = require('./extension/placeholder');
            var end_1 = require('./end');
            exports.extension = combine_1.combine([end_1.verifyBlockEnd(placeholder_1.placeholder)]);
        },
        {
            '../../combinator/combine': 12,
            './end': 18,
            './extension/placeholder': 20
        }
    ],
    20: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var loop_1 = require('../../../combinator/loop');
            var inline_1 = require('../../inline');
            var unescapable_1 = require('../../source/unescapable');
            var squash_1 = require('../../squash');
            var syntax = /^(~{3,})[^\n]*\n(?:[^\n]*\n)*?\1[^\S\n]*(?=\n|$)/;
            exports.placeholder = function (source) {
                if (!source.startsWith('~~~'))
                    return;
                var _a = source.match(syntax) || [
                        '',
                        ''
                    ], whole = _a[0], keyword = _a[1];
                if (!whole)
                    return;
                var message = document.createElement('p');
                void message.appendChild(squash_1.squash(loop_1.loop(inline_1.inline)('**WARNING: DON\'T USE `~~~` SYNTAX!!**\\\nThis *extension syntax* is reserved for extensibility.')[0]));
                source = source.slice(source.indexOf('\n') + 1);
                var lines = [];
                while (true) {
                    var line = source.split('\n', 1)[0];
                    if (line.startsWith('' + keyword) && line.trim() === '' + keyword)
                        break;
                    void lines.push(squash_1.squash((loop_1.loop(unescapable_1.unescsource)(line + '\n') || [[]])[0]).textContent);
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
            };
        },
        {
            '../../../combinator/loop': 13,
            '../../inline': 33,
            '../../source/unescapable': 57,
            '../../squash': 58
        }
    ],
    21: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var combine_1 = require('../../combinator/combine');
            var loop_1 = require('../../combinator/loop');
            var end_1 = require('./end');
            var indexer_1 = require('./indexer');
            var inline_1 = require('../inline');
            var squash_1 = require('../squash');
            var syntax = /^(#{1,6})[^\S\n]+?([^\n]+)/;
            exports.heading = end_1.verifyBlockEnd(function (source) {
                if (!source.startsWith('#'))
                    return;
                var _a = source.split('\n', 1).shift().match(syntax) || [
                        '',
                        '',
                        ''
                    ], whole = _a[0], level = _a[1].length, title = _a[2];
                if (!whole)
                    return;
                var children = (loop_1.loop(combine_1.combine([
                    indexer_1.indexer,
                    inline_1.inline
                ]))(title.trim()) || [[]])[0];
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
            '../../combinator/combine': 12,
            '../../combinator/loop': 13,
            '../inline': 33,
            '../squash': 58,
            './end': 18,
            './indexer': 24
        }
    ],
    22: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var end_1 = require('./end');
            var syntax = /^\s*-\s*-\s*(?:-\s*)+(?:\n|$)/;
            exports.horizontalrule = end_1.verifyBlockEnd(function (source) {
                var whole = (source.split('\n', 1)[0].match(syntax) || [''])[0];
                if (!whole)
                    return;
                return [
                    [document.createElement('hr')],
                    source.slice(whole.length + 1)
                ];
            });
        },
        { './end': 18 }
    ],
    23: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var syntax = /^\s*/;
            function indent(source) {
                var indent = (source.split('\n', 1).shift().match(syntax) || [''])[0];
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
    24: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var inline_1 = require('../inline');
            var index_1 = require('../string/index');
            var syntax = /^\s+\[#\S+?\]$/;
            exports.indexer = function (source) {
                if (!source.trim().startsWith('[#') || source.search(syntax) !== 0)
                    return;
                source = source.trim();
                var _a = inline_1.inline(source) || [
                        [document.createTextNode('')],
                        ''
                    ], el = _a[0][0], rest = _a[1];
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
                void Array.from(el.querySelectorAll('code[data-src], .math[data-src]')).forEach(function (el) {
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
            '../inline': 33,
            '../string/index': 59
        }
    ],
    25: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var end_1 = require('./end');
            var syntax = /^\$\$[^\S\n]*\n(?:[^\n]*?\S[^\n]*\n)+?\$\$[^\S\n]*(?=\n|$)/;
            exports.math = end_1.verifyBlockEnd(function (source) {
                if (!source.startsWith('$$'))
                    return;
                var whole = (source.match(syntax) || [
                    '',
                    ''
                ])[0];
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
        { './end': 18 }
    ],
    26: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var syntax = /^[^\S\n]*\n/;
            exports.newline = function (source) {
                var whole = (source.match(syntax) || [''])[0];
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
    27: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var combine_1 = require('../../combinator/combine');
            var loop_1 = require('../../combinator/loop');
            var end_1 = require('./end');
            var ulist_1 = require('./ulist');
            var indent_1 = require('./indent');
            var inline_1 = require('../inline');
            var squash_1 = require('../squash');
            var syntax = /^([0-9]+|[A-Z]+|[a-z]+)(\.(?:\s|$)|(?=\n|$))/;
            exports.olist = end_1.verifyBlockEnd(function (source) {
                var _a = source.match(syntax) || [
                        '',
                        '',
                        ''
                    ], whole = _a[0], index = _a[1], flag = _a[2];
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
                        void li.appendChild(squash_1.squash((loop_1.loop(combine_1.combine([inline_1.inline]))(text) || [[]])[0]));
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
                        var _a = indent_1.indent(source), block = _a[0], rest = _a[1];
                        if (rest === source)
                            return { value: void 0 };
                        var _b = combine_1.combine([
                                ulist_1.ulist,
                                exports.olist
                            ])(indent_1.fillOListFlag(block)) || [
                                [],
                                block
                            ], children = _b[0], brest = _b[1];
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
            '../../combinator/combine': 12,
            '../../combinator/loop': 13,
            '../inline': 33,
            '../squash': 58,
            './end': 18,
            './indent': 23,
            './ulist': 31
        }
    ],
    28: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var combine_1 = require('../../combinator/combine');
            var loop_1 = require('../../combinator/loop');
            var end_1 = require('./end');
            var inline_1 = require('../inline');
            var squash_1 = require('../squash');
            var closer = /^[^\S\n]*\\?(?=\n[^\S\n]*\\?\n|\n?$)/;
            exports.paragraph = end_1.verifyBlockEnd(function (source) {
                if (source.startsWith('\n'))
                    return;
                source = source.replace(/^\s+/, '');
                var el = document.createElement('p');
                var _a = loop_1.loop(combine_1.combine([inline_1.inline]), closer)(source) || [
                        [document.createTextNode(source)],
                        ''
                    ], cs = _a[0], rest = _a[1];
                void el.appendChild(squash_1.squash(cs));
                return [
                    [el],
                    rest.slice(rest.split('\n').shift().length + 1)
                ];
            });
        },
        {
            '../../combinator/combine': 12,
            '../../combinator/loop': 13,
            '../inline': 33,
            '../squash': 58,
            './end': 18
        }
    ],
    29: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var end_1 = require('./end');
            var syntax = /^(`{3,})([a-z]*)(?:[^\S\n]+([0-9a-zA-Z_\-.]+))?[^\S\n]*\n(?:[^\n]*\n)+?\1[^\S\n]*(?=\n|$)/;
            exports.pretext = end_1.verifyBlockEnd(function (source) {
                if (!source.startsWith('```'))
                    return;
                var _a = source.match(syntax) || [
                        '',
                        '',
                        ''
                    ], whole = _a[0], lang = _a[2], _b = _a[3], filename = _b === void 0 ? '' : _b;
                if (!whole)
                    return;
                var el = document.createElement('pre');
                if (lang) {
                    void el.setAttribute('class', 'language-' + lang.toLowerCase());
                    void el.setAttribute('data-lang', '' + lang.toLowerCase());
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
        { './end': 18 }
    ],
    30: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var loop_1 = require('../../combinator/loop');
            var end_1 = require('./end');
            var inline_1 = require('../inline');
            var squash_1 = require('../squash');
            var syntax = /^(\|[^\n]*)+?[^\S\n]*\n/;
            var align = /^:?-+:?$/;
            exports.table = end_1.verifyBlockEnd(function (source) {
                if (!source.startsWith('|') || source.search(syntax) !== 0)
                    return;
                var table = document.createElement('table');
                var _a = parse(source) || [
                        [],
                        source
                    ], headers = _a[0], hrest = _a[1];
                if (hrest.length === source.length)
                    return;
                source = hrest;
                var _b = parse(source) || [
                        [],
                        source
                    ], aligns_ = _b[0], arest = _b[1];
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
                    var _a = parse(line) || [
                            [],
                            line
                        ], cols = _a[0], rest = _a[1];
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
                    var result = loop_1.loop(inline_1.inline, rowseparator)(source.slice(1)) || [
                        [document.createTextNode('')],
                        source.slice(1)
                    ];
                    var col = result[0], rest = result[1];
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
            '../../combinator/loop': 13,
            '../inline': 33,
            '../squash': 58,
            './end': 18
        }
    ],
    31: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var combine_1 = require('../../combinator/combine');
            var loop_1 = require('../../combinator/loop');
            var end_1 = require('./end');
            var olist_1 = require('./olist');
            var indent_1 = require('./indent');
            var inline_1 = require('../inline');
            var squash_1 = require('../squash');
            var syntax = /^([-+*])(?=\s|$)/;
            var content = /^(\[[ x]\](?: +|$))?.*$/;
            exports.ulist = end_1.verifyBlockEnd(function (source) {
                var _a = source.match(syntax) || [
                        '',
                        ''
                    ], whole = _a[0], flag = _a[1];
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
                        var _a = line.slice(line.split(/\s/, 1)[0].length + 1).trim().match(content), text = _a[0], _b = _a[1], checkbox = _b === void 0 ? '' : _b;
                        var li = el.appendChild(document.createElement('li'));
                        if (checkbox) {
                            var cb = document.createElement('span');
                            void cb.setAttribute('class', 'checkbox');
                            void cb.appendChild(document.createTextNode(checkbox.trim() + ' '));
                            void li.appendChild(cb);
                        }
                        void li.appendChild(squash_1.squash((loop_1.loop(combine_1.combine([inline_1.inline]))(text.slice(checkbox.length)) || [[]])[0]));
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
                        var _c = indent_1.indent(source), block = _c[0], rest = _c[1];
                        if (rest === source)
                            return { value: void 0 };
                        var _d = combine_1.combine([
                                exports.ulist,
                                olist_1.olist
                            ])(indent_1.fillOListFlag(block)) || [
                                [],
                                block
                            ], children = _d[0], brest = _d[1];
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
            '../../combinator/combine': 12,
            '../../combinator/loop': 13,
            '../inline': 33,
            '../squash': 58,
            './end': 18,
            './indent': 23,
            './olist': 27
        }
    ],
    32: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var math_1 = require('./inline/math');
            var media_1 = require('./inline/media');
            exports.caches = {
                math: math_1.cache,
                media: { image: media_1.cache }
            };
        },
        {
            './inline/math': 50,
            './inline/media': 51
        }
    ],
    33: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var combine_1 = require('../combinator/combine');
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
            var math_1 = require('./inline/math');
            var media_1 = require('./inline/media');
            var htmlentity_1 = require('./inline/htmlentity');
            var autolink_1 = require('./inline/autolink');
            var text_1 = require('./source/text');
            exports.inline = combine_1.combine([
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
        },
        {
            '../combinator/combine': 12,
            './inline/anglebracket': 34,
            './inline/annotation': 35,
            './inline/autolink': 36,
            './inline/brace': 39,
            './inline/bracket': 40,
            './inline/code': 41,
            './inline/emphasis': 42,
            './inline/extension': 43,
            './inline/html': 47,
            './inline/htmlentity': 48,
            './inline/link': 49,
            './inline/math': 50,
            './inline/media': 51,
            './inline/parenthesis': 52,
            './inline/strong': 53,
            './source/text': 56
        }
    ],
    34: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var combine_1 = require('../../combinator/combine');
            var loop_1 = require('../../combinator/loop');
            var inline_1 = require('../inline');
            var squash_1 = require('../squash');
            var syntax = /^<[\s\S]*?>/;
            var closer = /^>/;
            exports.anglebracket = function (source) {
                if (!source.startsWith('<') || source.search(syntax) !== 0)
                    return;
                var _a = loop_1.loop(combine_1.combine([inline_1.inline]), closer)(' ' + source.slice(1)) || [
                        [],
                        ''
                    ], _b = _a[0], cs = _b.slice(1), rest = _a[1];
                if (!rest.startsWith('>'))
                    return;
                return [
                    Array.from(squash_1.squash([document.createTextNode('<')].concat(cs).concat([document.createTextNode('>')])).childNodes),
                    rest.slice(1)
                ];
            };
        },
        {
            '../../combinator/combine': 12,
            '../../combinator/loop': 13,
            '../inline': 33,
            '../squash': 58
        }
    ],
    35: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var combine_1 = require('../../combinator/combine');
            var loop_1 = require('../../combinator/loop');
            var inline_1 = require('../inline');
            var squash_1 = require('../squash');
            var syntax = /^\(\([\s\S]+?\)\)/;
            var closer = /^\)\)/;
            exports.annotation = function (source) {
                if (!source.startsWith('((') || source.search(syntax) !== 0)
                    return;
                var _a = loop_1.loop(combine_1.combine([inline_1.inline]), closer)(source.slice(2)) || [
                        [],
                        ''
                    ], cs = _a[0], rest = _a[1];
                if (!rest.startsWith('))'))
                    return;
                var el = document.createElement('sup');
                void el.setAttribute('class', 'annotation');
                void el.appendChild(squash_1.squash(cs));
                if (el.textContent.trim() === '')
                    return;
                return [
                    [el],
                    rest.slice(2)
                ];
            };
        },
        {
            '../../combinator/combine': 12,
            '../../combinator/loop': 13,
            '../inline': 33,
            '../squash': 58
        }
    ],
    36: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var combine_1 = require('../../combinator/combine');
            var url_1 = require('./autolink/url');
            var account_1 = require('./autolink/account');
            exports.autolink = combine_1.combine([
                url_1.url,
                account_1.account
            ]);
        },
        {
            '../../combinator/combine': 12,
            './autolink/account': 37,
            './autolink/url': 38
        }
    ],
    37: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var syntax = /^@[a-zA-Z0-9]+(?:[_\-][0-9a-zA-Z]+)*(?!@)/;
            var escape = /^[0-9a-zA-Z@]@/;
            exports.account = function (source) {
                if (source.search(escape) === 0) {
                    var frag = (source.match(/^[0-9a-zA-Z@].*?(?!@|h?ttps?:)/) || [source])[0];
                    return [
                        [document.createTextNode(frag)],
                        source.slice(frag.length)
                    ];
                }
                var whole = (source.match(syntax) || [''])[0];
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
    38: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var combine_1 = require('../../../combinator/combine');
            var loop_1 = require('../../../combinator/loop');
            var text_1 = require('../../source/text');
            var squash_1 = require('../../squash');
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
                var _a = loop_1.loop(combine_1.combine([text_1.text]), closer)(source) || [
                        [],
                        ''
                    ], cs = _a[0], rest = _a[1];
                var attribute = source.startsWith('ttp') ? ' nofollow' : '';
                var uri = '' + (source.startsWith('ttp') ? 'h' : '') + source.slice(0, source.length - rest.length);
                return !flag ? link_1.link('[](' + uri + attribute + ')' + rest) : link_1.link('[![](' + uri + ')](' + uri + ')' + rest);
            };
        },
        {
            '../../../combinator/combine': 12,
            '../../../combinator/loop': 13,
            '../../source/text': 56,
            '../../squash': 58,
            '../link': 49
        }
    ],
    39: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var combine_1 = require('../../combinator/combine');
            var loop_1 = require('../../combinator/loop');
            var inline_1 = require('../inline');
            var squash_1 = require('../squash');
            var syntax = /^{[\s\S]*?}/;
            var closer = /^}/;
            exports.brace = function (source) {
                if (!source.startsWith('{') || source.search(syntax) !== 0)
                    return;
                var _a = loop_1.loop(combine_1.combine([inline_1.inline]), closer)(' ' + source.slice(1)) || [
                        [],
                        ''
                    ], _b = _a[0], cs = _b.slice(1), rest = _a[1];
                if (!rest.startsWith('}'))
                    return;
                return [
                    Array.from(squash_1.squash([document.createTextNode('{')].concat(cs).concat([document.createTextNode('}')])).childNodes),
                    rest.slice(1)
                ];
            };
        },
        {
            '../../combinator/combine': 12,
            '../../combinator/loop': 13,
            '../inline': 33,
            '../squash': 58
        }
    ],
    40: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var combine_1 = require('../../combinator/combine');
            var loop_1 = require('../../combinator/loop');
            var inline_1 = require('../inline');
            var squash_1 = require('../squash');
            var syntax = /^\[[\s\S]*?\]/;
            var closer = /^\]/;
            exports.bracket = function (source) {
                if (!source.startsWith('[') || source.search(syntax) !== 0)
                    return;
                var _a = loop_1.loop(combine_1.combine([inline_1.inline]), closer)(' ' + source.slice(1)) || [
                        [],
                        ''
                    ], _b = _a[0], cs = _b.slice(1), rest = _a[1];
                if (!rest.startsWith(']'))
                    return;
                return [
                    Array.from(squash_1.squash([document.createTextNode('[')].concat(cs).concat([document.createTextNode(']')])).childNodes),
                    rest.slice(1)
                ];
            };
        },
        {
            '../../combinator/combine': 12,
            '../../combinator/loop': 13,
            '../inline': 33,
            '../squash': 58
        }
    ],
    41: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var combine_1 = require('../../combinator/combine');
            var loop_1 = require('../../combinator/loop');
            var unescapable_1 = require('../source/unescapable');
            var squash_1 = require('../squash');
            var syntax = /^(`+)[^\n]+?\1/;
            exports.code = function (source) {
                if (!source.startsWith('`'))
                    return;
                var _a = source.match(syntax) || [
                        '',
                        ''
                    ], whole = _a[0], keyword = _a[1];
                if (!whole)
                    return;
                var _b = loop_1.loop(combine_1.combine([unescapable_1.unescsource]), '^' + keyword)(source.slice(keyword.length)) || [
                        [],
                        ''
                    ], cs = _b[0], rest = _b[1];
                if (!rest.startsWith(keyword))
                    return;
                var el = document.createElement('code');
                void el.appendChild(squash_1.squash(cs));
                el.textContent = el.textContent.trim();
                if (el.textContent === '')
                    return;
                void el.setAttribute('data-src', source.slice(0, source.length - rest.length + keyword.length));
                return [
                    [el],
                    rest.slice(keyword.length)
                ];
            };
        },
        {
            '../../combinator/combine': 12,
            '../../combinator/loop': 13,
            '../source/unescapable': 57,
            '../squash': 58
        }
    ],
    42: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var combine_1 = require('../../combinator/combine');
            var loop_1 = require('../../combinator/loop');
            var inline_1 = require('../inline');
            var strong_1 = require('./strong');
            var squash_1 = require('../squash');
            var syntax = /^\*[\s\S]+?\*/;
            var closer = /^\*/;
            exports.emphasis = function (source) {
                if (!source.startsWith('*') || source.search(syntax) !== 0)
                    return;
                var _a = loop_1.loop(combine_1.combine([inline_1.inline]), function (rest) {
                        return rest.slice(0, 99).search(closer) === 0 && !strong_1.strong(rest);
                    })(source.slice(1)) || [
                        [],
                        ''
                    ], cs = _a[0], rest = _a[1];
                if (!rest.startsWith('*'))
                    return;
                var el = document.createElement('em');
                void el.appendChild(squash_1.squash(cs));
                if (el.textContent.trim() === '')
                    return;
                return [
                    [el],
                    rest.slice(1)
                ];
            };
        },
        {
            '../../combinator/combine': 12,
            '../../combinator/loop': 13,
            '../inline': 33,
            '../squash': 58,
            './strong': 53
        }
    ],
    43: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var combine_1 = require('../../combinator/combine');
            var index_1 = require('./extension/index');
            var placeholder_1 = require('./extension/placeholder');
            exports.extension = combine_1.combine([
                index_1.index,
                placeholder_1.placeholder
            ]);
        },
        {
            '../../combinator/combine': 12,
            './extension/index': 44,
            './extension/placeholder': 45
        }
    ],
    44: [
        function (require, module, exports) {
            'use strict';
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
                var el = result[0][0];
                void el.setAttribute('href', '#' + index_1.makeIndex(query));
                el.textContent = query;
                return result;
            });
        },
        {
            '../../string/index': 59,
            '../link': 49,
            './template': 46
        }
    ],
    45: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var loop_1 = require('../../../combinator/loop');
            var inline_1 = require('../../inline');
            var squash_1 = require('../../squash');
            var template_1 = require('./template');
            exports.placeholder = template_1.template(function () {
                var el = document.createElement('span');
                void el.appendChild(squash_1.squash(loop_1.loop(inline_1.inline)('++**WARNING: DON\'T USE `[: ]` SYNTAX!!** This syntax is reserved for extensibility.++')[0]));
                return [
                    [el],
                    ''
                ];
            });
        },
        {
            '../../../combinator/loop': 13,
            '../../inline': 33,
            '../../squash': 58,
            './template': 46
        }
    ],
    46: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var combine_1 = require('../../../combinator/combine');
            var loop_1 = require('../../../combinator/loop');
            var text_1 = require('../../source/text');
            var squash_1 = require('../../squash');
            var cache_1 = require('spica/cache');
            var syntax = /^\[[~#:^\[][^\s\[\]][^\n]*?\]/;
            exports.template = function (parser) {
                return function (source) {
                    var _a = parse(source) || [
                            '',
                            '',
                            ''
                        ], flag = _a[0], query = _a[1], rest = _a[2];
                    if (!flag)
                        return;
                    var result = parser(flag, query);
                    if (!result)
                        return;
                    return [
                        result[0],
                        rest
                    ];
                };
            };
            var cache = new cache_1.Cache(9);
            function parse(source) {
                if (!source.startsWith('[') || source.search(syntax) !== 0)
                    return;
                if (cache.has(source))
                    return cache.get(source);
                void cache.set(source, void 0);
                var _a = loop_1.loop(combine_1.combine([text_1.text]), /^[\]\n]/)(source) || [
                        [],
                        source
                    ], _b = _a[0], cs = _b.slice(1), rest = _a[1];
                if (!rest.startsWith(']'))
                    return;
                var txt = squash_1.squash(cs).textContent;
                if (txt === '' || txt !== txt.trim())
                    return;
                return cache.set(source, [
                    txt[0],
                    txt.slice(1),
                    rest.slice(1)
                ]);
            }
        },
        {
            '../../../combinator/combine': 12,
            '../../../combinator/loop': 13,
            '../../source/text': 56,
            '../../squash': 58,
            'spica/cache': 4
        }
    ],
    47: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var combine_1 = require('../../combinator/combine');
            var loop_1 = require('../../combinator/loop');
            var inline_1 = require('../inline');
            var squash_1 = require('../squash');
            var syntax = /^(<([a-z]+)>)/;
            var inlinetags = Object.freeze('ins|del|sup|sub|small|q|cite|mark|ruby|rt|rp|bdi|bdo|wbr'.split('|'));
            exports.html = function (source) {
                if (!source.startsWith('<'))
                    return;
                var _a = source.match(syntax) || [
                        '',
                        '',
                        ''
                    ], whole = _a[0], opentag = _a[1], tagname = _a[2];
                if (!whole)
                    return;
                if (inlinetags.indexOf(tagname) === -1)
                    return;
                if (tagname === 'wbr')
                    return [
                        [document.createElement(tagname)],
                        source.slice(opentag.length)
                    ];
                var _b = loop_1.loop(combine_1.combine([inline_1.inline]), '^</' + tagname + '>')(source.slice(opentag.length)) || [
                        [],
                        source.slice(opentag.length)
                    ], cs = _b[0], rest = _b[1];
                var el = document.createElement(tagname);
                void el.appendChild(squash_1.squash(cs));
                if (el.textContent.trim() === '')
                    return;
                var closetag = '</' + tagname + '>';
                return rest.slice(0, closetag.length) === closetag ? [
                    [el],
                    rest.slice(closetag.length)
                ] : void 0;
            };
        },
        {
            '../../combinator/combine': 12,
            '../../combinator/loop': 13,
            '../inline': 33,
            '../squash': 58
        }
    ],
    48: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var syntax = /^&(?:[0-9a-z]+|#[0-9]{1,8}|#x[0-9a-f]{1,8});/i;
            exports.htmlentity = function (source) {
                if (!source.startsWith('&'))
                    return;
                var whole = (source.match(syntax) || [''])[0];
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
        {}
    ],
    49: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var combine_1 = require('../../combinator/combine');
            var loop_1 = require('../../combinator/loop');
            var inline_1 = require('../inline');
            var text_1 = require('../source/text');
            var squash_1 = require('../squash');
            var url_1 = require('../string/url');
            var syntax = /^\[[^\n]*?\]\n?\(/;
            exports.link = function (source) {
                if (!source.startsWith('[') || source.search(syntax) !== 0)
                    return;
                var _a = loop_1.loop(combine_1.combine([inline_1.inline]), /^\]\n?\(|^\n/)(' ' + source.slice(1)) || [
                        [],
                        ''
                    ], _b = _a[0], first = _b.slice(1), next = _a[1];
                if (!next.startsWith('](') && !next.startsWith(']\n('))
                    return;
                var children = squash_1.squash(first);
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
                var _c = loop_1.loop(text_1.text, /^\)|^\s(?!nofollow)/)('?' + next.replace(/^\]\n?\(/, '')) || [
                        [],
                        ''
                    ], _d = _c[0], second = _d.slice(1), rest = _c[1];
                if (!rest.startsWith(')'))
                    return;
                var _e = second.reduce(function (s, c) {
                        return s + c.textContent;
                    }, '').split(/\s/), INSECURE_URL = _e[0], attribute = _e[1];
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
                    rest.slice(1)
                ];
            };
        },
        {
            '../../combinator/combine': 12,
            '../../combinator/loop': 13,
            '../inline': 33,
            '../source/text': 56,
            '../squash': 58,
            '../string/url': 60
        }
    ],
    50: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var combine_1 = require('../../combinator/combine');
            var loop_1 = require('../../combinator/loop');
            var escapable_1 = require('../source/escapable');
            var squash_1 = require('../squash');
            var cache_1 = require('spica/cache');
            exports.cache = new cache_1.Cache(100);
            var syntax = /^\$\S[^\n]*?\$(?!\d)/;
            var closer = /^\$(?!\d)|^\n/;
            exports.math = function (source) {
                if (!source.startsWith('$') || source.startsWith('$$') || source.search(syntax) !== 0)
                    return;
                var _a = loop_1.loop(combine_1.combine([escapable_1.escsource]), closer)(source.slice(1)) || [
                        [],
                        ''
                    ], cs = _a[0], rest = _a[1];
                if (!rest.startsWith('$'))
                    return;
                var el = document.createElement('span');
                void el.setAttribute('class', 'math');
                void el.appendChild(squash_1.squash([document.createTextNode('$')].concat(cs, [document.createTextNode('$')])));
                if (el.textContent.slice(1, -1) !== el.textContent.slice(1, -1).trim())
                    return;
                if (exports.cache.has(el.textContent))
                    return [
                        [exports.cache.get(el.textContent).cloneNode(true)],
                        rest.slice(1)
                    ];
                void el.setAttribute('data-src', el.textContent);
                return [
                    [el],
                    rest.slice(1)
                ];
            };
        },
        {
            '../../combinator/combine': 12,
            '../../combinator/loop': 13,
            '../source/escapable': 55,
            '../squash': 58,
            'spica/cache': 4
        }
    ],
    51: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var combine_1 = require('../../combinator/combine');
            var loop_1 = require('../../combinator/loop');
            var text_1 = require('../source/text');
            var url_1 = require('../string/url');
            var typed_dom_1 = require('typed-dom');
            var cache_1 = require('spica/cache');
            exports.cache = new cache_1.Cache(100);
            var syntax = /^!\[[^\n]*?\]\n?\(/;
            exports.media = function (source) {
                if (!source.startsWith('![') || source.search(syntax) !== 0)
                    return;
                var _a = loop_1.loop(combine_1.combine([text_1.text]), /^\]\n?\(|^\n/)(source) || [
                        [],
                        ''
                    ], _b = _a[0], first = _b.slice(2), next = _a[1];
                if (!next.startsWith('](') && !next.startsWith(']\n('))
                    return;
                var caption = first.reduce(function (s, c) {
                    return s + c.textContent;
                }, '').trim();
                var _c = loop_1.loop(text_1.text, /^\)|^\s/)(next.replace(/^\]\n?\(/, '')) || [
                        [],
                        ''
                    ], second = _c[0].slice(0), rest = _c[1];
                if (!rest.startsWith(')'))
                    return;
                var url = url_1.sanitize(second.reduce(function (s, c) {
                    return s + c.textContent;
                }, ''));
                if (url === '')
                    return;
                if (exports.cache.has(url))
                    return [
                        [exports.cache.get(url).cloneNode(true)],
                        rest.slice(1)
                    ];
                var el = typed_dom_1.default.img({
                    'data-src': url,
                    alt: caption
                }).element;
                return [
                    [el],
                    rest.slice(1)
                ];
            };
        },
        {
            '../../combinator/combine': 12,
            '../../combinator/loop': 13,
            '../source/text': 56,
            '../string/url': 60,
            'spica/cache': 4,
            'typed-dom': 6
        }
    ],
    52: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var combine_1 = require('../../combinator/combine');
            var loop_1 = require('../../combinator/loop');
            var inline_1 = require('../inline');
            var squash_1 = require('../squash');
            var syntax = /^\([\s\S]*?\)/;
            var closer = /^\)/;
            exports.parenthesis = function (source) {
                if (!source.startsWith('(') || source.search(syntax) !== 0)
                    return;
                var _a = loop_1.loop(combine_1.combine([inline_1.inline]), closer)(' ' + source.slice(1)) || [
                        [],
                        ''
                    ], _b = _a[0], cs = _b.slice(1), rest = _a[1];
                if (!rest.startsWith(')'))
                    return;
                return [
                    Array.from(squash_1.squash([document.createTextNode('(')].concat(cs).concat([document.createTextNode(')')])).childNodes),
                    rest.slice(1)
                ];
            };
        },
        {
            '../../combinator/combine': 12,
            '../../combinator/loop': 13,
            '../inline': 33,
            '../squash': 58
        }
    ],
    53: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var combine_1 = require('../../combinator/combine');
            var loop_1 = require('../../combinator/loop');
            var inline_1 = require('../inline');
            var squash_1 = require('../squash');
            var syntax = /^\*\*[\s\S]+?\*\*/;
            var closer = /^\*\*/;
            exports.strong = function (source) {
                if (!source.startsWith('**') || source.search(syntax) !== 0)
                    return;
                var _a = loop_1.loop(combine_1.combine([inline_1.inline]), closer)(source.slice(2)) || [
                        [],
                        ''
                    ], cs = _a[0], rest = _a[1];
                if (!rest.startsWith('**'))
                    return;
                var el = document.createElement('strong');
                void el.appendChild(squash_1.squash(cs));
                if (el.textContent.trim() === '')
                    return;
                return [
                    [el],
                    rest.slice(2)
                ];
            };
        },
        {
            '../../combinator/combine': 12,
            '../../combinator/loop': 13,
            '../inline': 33,
            '../squash': 58
        }
    ],
    54: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var pretext_1 = require('../parser/block/pretext');
            var extension_1 = require('../parser/block/extension');
            var combine_1 = require('../combinator/combine');
            var syntax = /^(?:[^\S\n]*\n)+|^(?:[^\n]*\n)+?[^\S\n]*\n/;
            function segment(source) {
                var segments = [];
                while (source.length > 0) {
                    var _a = combine_1.combine([
                            pretext_1.pretext,
                            extension_1.extension
                        ])(source) || [
                            [],
                            source.slice((source.match(syntax) || [source])[0].length)
                        ], rest = _a[1];
                    void segments.push(source.slice(0, source.length - rest.length));
                    source = rest;
                }
                return segments;
            }
            exports.segment = segment;
        },
        {
            '../combinator/combine': 12,
            '../parser/block/extension': 19,
            '../parser/block/pretext': 29
        }
    ],
    55: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var separator = /[$\n\\]/;
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
    56: [
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
    57: [
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
    58: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            function squash(nodes) {
                var frag = document.createDocumentFragment();
                for (var _i = 0, _a = Array.from(nodes); _i < _a.length; _i++) {
                    var curr = _a[_i];
                    var prev = frag.lastChild;
                    if (prev && prev.nodeType === 3 && curr.nodeType === 3) {
                        prev.textContent += curr.textContent;
                        curr.textContent = '';
                    } else {
                        void frag.appendChild(curr);
                    }
                }
                return frag;
            }
            exports.squash = squash;
        },
        {}
    ],
    59: [
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
    60: [
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
    61: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var parser_1 = require('./parser');
            var segment_1 = require('../parser/segment');
            function bind(node) {
                var pairs = [];
                return function (source) {
                    var os = pairs.map(function (_a) {
                        var s = _a[0];
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
                        var es = _a[1];
                        return void es.forEach(function (e) {
                            return void e.remove();
                        });
                    });
                    var ref = pairs.slice(i).reduce(function (e, _a) {
                        var es = _a[1];
                        return e || es[0];
                    }, null);
                    var ps = ns.slice(i, ns.length - j).map(function (s) {
                        return [
                            s,
                            Array.from(parser_1.parse(s).childNodes).map(function (e) {
                                return node.insertBefore(e, ref);
                            })
                        ];
                    });
                    void pairs.splice.apply(pairs, [
                        i,
                        0
                    ].concat(ps));
                    return ps.reduce(function (acc, _a) {
                        var es = _a[1];
                        return acc.concat(es);
                    }, []);
                };
            }
            exports.bind = bind;
        },
        {
            '../parser/segment': 54,
            './parser': 62
        }
    ],
    62: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var loop_1 = require('../combinator/loop');
            var block_1 = require('../parser/block');
            var segment_1 = require('../parser/segment');
            function parse(source) {
                return segment_1.segment(source).reduce(function (doc, source) {
                    return parse_(source).reduce(function (doc, el) {
                        return void doc.appendChild(el), doc;
                    }, doc);
                }, document.createDocumentFragment());
                function parse_(source) {
                    return (loop_1.loop(block_1.block)(source) || [[]])[0];
                }
            }
            exports.parse = parse;
        },
        {
            '../combinator/loop': 13,
            '../parser/block': 15,
            '../parser/segment': 54
        }
    ],
    63: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var media_1 = require('./render/media');
            var code_1 = require('./render/code');
            var math_1 = require('./render/math');
            function render(target, opts) {
                if (opts === void 0) {
                    opts = {};
                }
                void [target].concat(Array.from(target.querySelectorAll('img, pre, .math'))).forEach(function (target) {
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
            './render/code': 64,
            './render/math': 65,
            './render/media': 66
        }
    ],
    64: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            function code(target) {
                void Prism.highlightElement(target, false);
            }
            exports.code = code;
        },
        {}
    ],
    65: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var math_1 = require('../../parser/inline/math');
            function math(target) {
                if (target instanceof HTMLDivElement)
                    return void MathJax.Hub.Queue([
                        'Typeset',
                        MathJax.Hub,
                        target
                    ]);
                void target.setAttribute('data-src', target.textContent);
                var expr = target.textContent;
                if (math_1.cache.has(expr))
                    return void (target.innerHTML = math_1.cache.get(expr).innerHTML);
                void MathJax.Hub.Queue([
                    'Typeset',
                    MathJax.Hub,
                    target,
                    function () {
                        return void math_1.cache.set(expr, target.cloneNode(true));
                    }
                ]);
            }
            exports.math = math;
        },
        { '../../parser/inline/math': 50 }
    ],
    66: [
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
                return void 0 || (opts.twitter || twitter_1.twitter)(url) || (opts.youtube || youtube_1.youtube)(url) || (opts.gist || gist_1.gist)(url) || (opts.slideshare || slideshare_1.slideshare)(url) || (opts.pdf || pdf_1.pdf)(url) || (opts.image || image_1.image)(url, target.getAttribute('alt') || '');
            }
            exports.media = media;
        },
        {
            './media/gist': 67,
            './media/image': 68,
            './media/pdf': 69,
            './media/slideshare': 70,
            './media/twitter': 71,
            './media/youtube': 72
        }
    ],
    67: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var typed_dom_1 = require('typed-dom');
            var parser_1 = require('../../parser');
            var cache_1 = require('spica/cache');
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
                        success: function (_a) {
                            var div = _a.div, stylesheet = _a.stylesheet, description = _a.description;
                            outer.innerHTML = '<div style="position: relative; margin-bottom: -1em;">' + div + '</div>';
                            var gist = outer.querySelector('.gist');
                            void gist.insertBefore(typed_dom_1.default.div({ class: 'gist-description' }, [typed_dom_1.default.a({ style: 'text-decoration: none; color: #555; font-size: 14px; font-weight: 600;' }, description, function () {
                                    return parser_1.parse(url).querySelector('a');
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
                            var statusText = _a.statusText;
                            outer.innerHTML = parser_1.parse('*' + url + '\\\n-> ' + statusText + '*').querySelector('p').innerHTML;
                        }
                    });
                    return outer;
                }).element;
            }
            exports.gist = gist;
        },
        {
            '../../parser': 62,
            'spica/cache': 4,
            'typed-dom': 6
        }
    ],
    68: [
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
            '../../../parser/inline/media': 51,
            'typed-dom': 6
        }
    ],
    69: [
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
                            return parser_1.parse('**' + url + '**').querySelector('strong');
                        })])
                ]).element;
            }
            exports.pdf = pdf;
        },
        {
            '../../parser': 62,
            'typed-dom': 6
        }
    ],
    70: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var typed_dom_1 = require('typed-dom');
            var parser_1 = require('../../parser');
            var cache_1 = require('spica/cache');
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
                        success: function (_a) {
                            var html = _a.html;
                            outer.innerHTML = '<div style="position: relative; padding-top: 83%;">' + html + '</div>';
                            var iframe = outer.querySelector('iframe');
                            void iframe.setAttribute('style', 'position: absolute; top: 0; bottom: 0; left: 0; right: 0; width: 100%; height: 100%;');
                            iframe.parentElement.style.paddingTop = +iframe.height / +iframe.width * 100 + '%';
                            void outer.appendChild(iframe.nextElementSibling);
                            void outer.lastElementChild.removeAttribute('style');
                            void cache.set(url, outer.cloneNode(true));
                        },
                        error: function (_a) {
                            var statusText = _a.statusText;
                            outer.innerHTML = parser_1.parse('*' + url + '\\\n-> ' + statusText + '*').querySelector('p').innerHTML;
                        }
                    });
                    return outer;
                }).element;
            }
            exports.slideshare = slideshare;
        },
        {
            '../../parser': 62,
            'spica/cache': 4,
            'typed-dom': 6
        }
    ],
    71: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var typed_dom_1 = require('typed-dom');
            var parser_1 = require('../../parser');
            var cache_1 = require('spica/cache');
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
                        success: function (_a) {
                            var html = _a.html;
                            outer.innerHTML = '<div style="margin-top: -10px; margin-bottom: -10px;">' + html + '</div>';
                            void cache.set(url, outer.cloneNode(true));
                            if (widgetScriptRequested)
                                return;
                            if (window.twttr)
                                return void window.twttr.widgets.load(outer);
                            widgetScriptRequested = true;
                            $.ajax(outer.querySelector('script').src, {
                                dataType: 'script',
                                cache: true,
                                timeout: 10 * 1000
                            });
                        },
                        error: function (_a) {
                            var statusText = _a.statusText;
                            outer.innerHTML = parser_1.parse('*' + url + '\\\n-> ' + statusText + '*').querySelector('p').innerHTML;
                        }
                    });
                    return outer;
                }).element;
            }
            exports.twitter = twitter;
        },
        {
            '../../parser': 62,
            'spica/cache': 4,
            'typed-dom': 6
        }
    ],
    72: [
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
                            sandbox: 'allow-scripts allow-same-origin allow-presentation',
                            allowfullscreen: '',
                            frameborder: '0',
                            style: 'position: absolute; top: 0; right: 0; width: 100%; height: 100%;'
                        })])]).element;
            }
            exports.youtube = youtube;
        },
        { 'typed-dom': 6 }
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
        { './src/export': 14 }
    ]
}, {}, [
    1,
    2,
    'securemark',
    3
]);