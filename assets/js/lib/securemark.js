/*! securemark v0.23.0 https://github.com/falsandtru/securemark | (c) 2017, falsandtru | (Apache-2.0 AND MPL-2.0) License */
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
        { './src/export': 7 }
    ],
    5: [
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
                    this.mode = this.children_ === void 0 ? 'empty' : typeof this.children_ === 'string' ? 'text' : Array.isArray(this.children_) ? 'collection' : 'struct';
                    this.structkeys = this.mode === 'struct' ? Object.keys(this.children_) : [];
                    this.tag;
                    switch (this.mode) {
                    case 'empty':
                        return;
                    case 'text':
                        this.children_ = document.createTextNode('');
                        void this.element_.appendChild(this.children_);
                        this.children = children_;
                        return;
                    case 'collection':
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
                        case 'empty':
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
    6: [
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
        { './builder': 5 }
    ],
    7: [
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
            './dom/html': 6,
            './util/dom': 8
        }
    ],
    8: [
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
        { './noop': 9 }
    ],
    9: [
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
    10: [
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
    11: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            function loop(parser, until) {
                return function (source) {
                    var rest = source;
                    if (until && rest.slice(0, 99).search(until) === 0)
                        return;
                    var results = [];
                    while (true) {
                        if (rest === '')
                            break;
                        var r = parser(rest);
                        if (!r)
                            break;
                        void results.push.apply(results, r[0]);
                        rest = r[1];
                        if (until && rest.slice(0, 99).search(until) === 0)
                            break;
                    }
                    return rest.length < source.length ? [
                        results,
                        rest
                    ] : void 0;
                };
            }
            exports.loop = loop;
        },
        {}
    ],
    12: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var parser_1 = require('./renderer/parser');
            exports.parse = parser_1.parse;
            var bind_1 = require('./renderer/bind');
            exports.bind = bind_1.bind;
            var render_1 = require('./renderer/render');
            exports.render = render_1.render;
        },
        {
            './renderer/bind': 54,
            './renderer/parser': 62,
            './renderer/render': 63
        }
    ],
    13: [
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
            var mathblock_1 = require('./block/mathblock');
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
                mathblock_1.mathblock,
                extension_1.extension,
                paragraph_1.paragraph
            ]);
            var blockend = /^\s*?(?:\n|$)/;
            function consumeBlockEndEmptyLine(rs, rest) {
                var _a = (rest.match(blockend) || [])[0], newline = _a === void 0 ? void 0 : _a;
                return newline === void 0 ? void 0 : [
                    rs,
                    rest.slice(newline.length)
                ];
            }
            exports.consumeBlockEndEmptyLine = consumeBlockEndEmptyLine;
        },
        {
            '../combinator/combine': 10,
            './block/blockquote': 14,
            './block/dlist': 15,
            './block/extension': 16,
            './block/heading': 18,
            './block/horizontalrule': 19,
            './block/mathblock': 21,
            './block/newline': 22,
            './block/olist': 23,
            './block/paragraph': 24,
            './block/pretext': 25,
            './block/table': 26,
            './block/ulist': 27
        }
    ],
    14: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var combine_1 = require('../../combinator/combine');
            var loop_1 = require('../../combinator/loop');
            var block_1 = require('../block');
            var block_2 = require('../block');
            var text_1 = require('../text');
            var plaintext_1 = require('../text/plaintext');
            var syntax = /^>+(?=[ \n]|$)/;
            exports.blockquote = function (source) {
                var mode = source.startsWith('|>') ? 'markdown' : 'plain';
                source = mode === 'markdown' ? source.slice(1) : source;
                var indent = (source.match(syntax) || [''])[0];
                if (!indent)
                    return;
                var top = document.createElement('blockquote');
                var bottom = indent.split('').slice(1).reduce(function (p) {
                    return p.appendChild(document.createElement('blockquote'));
                }, top);
                while (true) {
                    var line = source.split('\n', 1)[0];
                    if (line.trim() === '')
                        break;
                    var diff = (line.match(syntax) || [indent])[0].length - indent.length;
                    if (diff > 0) {
                        bottom = line.slice(0, diff).split('').reduce(function (p) {
                            return p.appendChild(document.createElement('blockquote'));
                        }, bottom);
                    }
                    if (diff < 0) {
                        bottom = line.slice(0, -diff).split('').reduce(function (p) {
                            return p.parentElement;
                        }, bottom);
                    }
                    indent = indent[0].repeat(indent.length + diff);
                    if (bottom.lastChild instanceof Text) {
                        var node_1 = mode === 'plain' ? document.createElement('br') : document.createTextNode('\n');
                        void bottom.appendChild(node_1);
                    }
                    var text = line.split(' ', 1)[0] === indent ? line.slice(indent.length + 1) : line;
                    var node = mode === 'plain' ? text_1.squash((loop_1.loop(combine_1.combine([plaintext_1.plaintext]))(text.replace(/ /g, String.fromCharCode(160))) || [[document.createTextNode('')]])[0]) : document.createTextNode(text);
                    if (bottom.childNodes.length === 0 && node.textContent.trim() === '')
                        return;
                    void bottom.appendChild(node);
                    source = source.slice(line.length + 1);
                }
                if (mode === 'markdown') {
                    void expand(top);
                }
                return block_1.consumeBlockEndEmptyLine([top], source);
            };
            function expand(el) {
                return void Array.from(el.childNodes).reduce(function (ss, node) {
                    if (node instanceof HTMLQuoteElement) {
                        void expand(node);
                        return [];
                    } else {
                        void ss.push(node.textContent);
                        var ref = node.nextSibling;
                        void el.removeChild(node);
                        if (ref instanceof Text)
                            return ss;
                        void el.insertBefore(parse(ss.join('')), ref);
                        return [];
                    }
                }, []);
                function parse(source) {
                    return (loop_1.loop(block_2.block)(source) || [[]])[0].reduce(function (frag, node) {
                        return frag.appendChild(node), frag;
                    }, document.createDocumentFragment());
                }
            }
        },
        {
            '../../combinator/combine': 10,
            '../../combinator/loop': 11,
            '../block': 13,
            '../text': 47,
            '../text/plaintext': 49
        }
    ],
    15: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var combine_1 = require('../../combinator/combine');
            var loop_1 = require('../../combinator/loop');
            var block_1 = require('../block');
            var inline_1 = require('../inline');
            var text_1 = require('../text');
            var syntax = /^~\s/;
            var separator = /^[~:](?:\s|$)/;
            exports.dlist = function (source) {
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
                            void dt.appendChild(text_1.squash((loop_1.loop(combine_1.combine([inline_1.inline]))(line.slice(1).trim()) || [[]])[0]));
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
                            void dd.appendChild(text_1.squash((loop_1.loop(combine_1.combine([inline_1.inline]))(texts.join('\n').trim()) || [[]])[0]));
                            continue;
                        }
                    }
                }
                if (el.lastElementChild && el.lastElementChild.tagName.toLowerCase() === 'dt') {
                    void el.appendChild(document.createElement('dd'));
                }
                return block_1.consumeBlockEndEmptyLine([el], source);
            };
        },
        {
            '../../combinator/combine': 10,
            '../../combinator/loop': 11,
            '../block': 13,
            '../inline': 28,
            '../text': 47
        }
    ],
    16: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var combine_1 = require('../../combinator/combine');
            var placeholder_1 = require('./extension/placeholder');
            exports.extension = combine_1.combine([placeholder_1.placeholder]);
        },
        {
            '../../combinator/combine': 10,
            './extension/placeholder': 17
        }
    ],
    17: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var loop_1 = require('../../../combinator/loop');
            var block_1 = require('../../block');
            var inline_1 = require('../../inline');
            var text_1 = require('../../text');
            var plaintext_1 = require('../../text/plaintext');
            var syntax = /^(~{3,})(\S*?)\s*?\n(?:[^\n]*\n)*?\1/;
            exports.placeholder = function (source) {
                var _a = source.match(syntax) || [
                        '',
                        ''
                    ], whole = _a[0], keyword = _a[1];
                if (!whole)
                    return;
                var message = document.createElement('p');
                void message.appendChild(text_1.squash(loop_1.loop(inline_1.inline)('**WARNING: DON\'T USE `~~~` SYNTAX!!**\\\nThis *extension syntax* is reserved for extensibility.')[0]));
                source = source.slice(source.indexOf('\n') + 1);
                var lines = [];
                while (true) {
                    var line = source.split('\n', 1)[0];
                    if (line.search('^' + keyword + 's*(?:\n|$)') === 0)
                        break;
                    void lines.push(text_1.squash((loop_1.loop(plaintext_1.plaintext)(line + '\n') || [[]])[0]).textContent);
                    source = source.slice(line.length + 1);
                    if (source === '')
                        return;
                }
                var quote = document.createElement('pre');
                void quote.appendChild(document.createTextNode(keyword + '\n' + lines.join('') + keyword));
                return block_1.consumeBlockEndEmptyLine([
                    message,
                    quote
                ], source.slice(keyword.length + 1));
            };
        },
        {
            '../../../combinator/loop': 11,
            '../../block': 13,
            '../../inline': 28,
            '../../text': 47,
            '../../text/plaintext': 49
        }
    ],
    18: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var combine_1 = require('../../combinator/combine');
            var loop_1 = require('../../combinator/loop');
            var block_1 = require('../block');
            var inline_1 = require('../inline');
            var text_1 = require('../text');
            var syntax = /^(#{1,6})\s+?([^\n]+)/;
            exports.heading = function (source) {
                var _a = source.match(syntax) || [
                        '',
                        '',
                        ''
                    ], whole = _a[0], level = _a[1].length, title = _a[2];
                if (!whole)
                    return;
                var children = (loop_1.loop(combine_1.combine([inline_1.inline]))(title) || [[]])[0];
                var el = document.createElement('h' + level);
                void el.appendChild(text_1.squash(children));
                return block_1.consumeBlockEndEmptyLine([el], source.slice(whole.length + 1));
            };
        },
        {
            '../../combinator/combine': 10,
            '../../combinator/loop': 11,
            '../block': 13,
            '../inline': 28,
            '../text': 47
        }
    ],
    19: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var block_1 = require('../block');
            var syntax = /^\s*-\s*-\s*(?:-\s*)+(?:\n|$)/;
            exports.horizontalrule = function (source) {
                var whole = (source.split('\n', 1)[0].match(syntax) || [''])[0];
                if (!whole)
                    return;
                return block_1.consumeBlockEndEmptyLine([document.createElement('hr')], source.slice(whole.length + 1));
            };
        },
        { '../block': 13 }
    ],
    20: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var syntax = /^\s*/;
            function indent(source) {
                var indent = (source.match(syntax) || [''])[0];
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
    21: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var block_1 = require('../block');
            var combine_1 = require('../../combinator/combine');
            var loop_1 = require('../../combinator/loop');
            var text_1 = require('../text');
            var mathtext_1 = require('../text/mathtext');
            var syntax = /^\$\$\s*?\n(?:[^\n]*\n)*?\$\$/;
            var closer = /^\n\$\$\s*?(?:\n|$)/;
            exports.mathblock = function (source) {
                if (!source.startsWith('$$') || source.search(syntax) !== 0)
                    return;
                var _a = loop_1.loop(combine_1.combine([mathtext_1.mathtext]), closer)('\n' + source.slice(source.indexOf('\n') + 1)) || [
                        [],
                        ''
                    ], _b = _a[0], cs = _b.slice(1), rest = _a[1];
                if (rest.search(closer) !== 0)
                    return;
                var el = document.createElement('div');
                void el.setAttribute('class', 'math');
                void el.appendChild(text_1.squash([document.createTextNode('$$\n')].concat(cs, [document.createTextNode('\n$$')])));
                return block_1.consumeBlockEndEmptyLine([el], source.slice(source.length - rest.length + 3 + 1));
            };
        },
        {
            '../../combinator/combine': 10,
            '../../combinator/loop': 11,
            '../block': 13,
            '../text': 47,
            '../text/mathtext': 48
        }
    ],
    22: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var syntax = /^(\s*?\n)/;
            exports.newline = function (source) {
                var _a = source.match(syntax) || [
                        '',
                        ''
                    ], whole = _a[0], first = _a[1];
                if (!whole)
                    return;
                return [
                    [],
                    source.slice(first.length)
                ];
            };
        },
        {}
    ],
    23: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var combine_1 = require('../../combinator/combine');
            var loop_1 = require('../../combinator/loop');
            var block_1 = require('../block');
            var ulist_1 = require('./ulist');
            var indent_1 = require('./indent');
            var inline_1 = require('../inline');
            var text_1 = require('../text');
            var syntax = /^([0-9]+|[A-Z]+|[a-z]+)(\.(?:\s|$)|(?=\n|$))/;
            exports.olist = function (source) {
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
                        var text = line.slice(line.split(' ', 1)[0].length + 1).trim();
                        var li = el.appendChild(document.createElement('li'));
                        void li.appendChild(text_1.squash((loop_1.loop(combine_1.combine([inline_1.inline]))(text) || [[]])[0]));
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
                        void li_1.appendChild(text_1.squash(children));
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
                return block_1.consumeBlockEndEmptyLine([el], source);
            };
        },
        {
            '../../combinator/combine': 10,
            '../../combinator/loop': 11,
            '../block': 13,
            '../inline': 28,
            '../text': 47,
            './indent': 20,
            './ulist': 27
        }
    ],
    24: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var combine_1 = require('../../combinator/combine');
            var loop_1 = require('../../combinator/loop');
            var block_1 = require('../block');
            var inline_1 = require('../inline');
            var text_1 = require('../text');
            var closer = /^\n\s*?\n/;
            exports.paragraph = function (source) {
                if (source.startsWith('\n') || source.search(closer) === 0)
                    return;
                var el = document.createElement('p');
                var _a = loop_1.loop(combine_1.combine([inline_1.inline]), closer)(source.trim()) || [
                        [document.createTextNode(source.trim())],
                        ''
                    ], cs = _a[0], rest = _a[1];
                void el.appendChild(text_1.squash(cs));
                return block_1.consumeBlockEndEmptyLine([el], rest.slice(1));
            };
        },
        {
            '../../combinator/combine': 10,
            '../../combinator/loop': 11,
            '../block': 13,
            '../inline': 28,
            '../text': 47
        }
    ],
    25: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var combine_1 = require('../../combinator/combine');
            var loop_1 = require('../../combinator/loop');
            var block_1 = require('../block');
            var text_1 = require('../text');
            var plaintext_1 = require('../text/plaintext');
            var syntax = /^(`{3,})([0-9a-z]*)\S*\s*?\n(?:[^\n]*\n)*?\1/;
            exports.pretext = function (source) {
                if (!source.startsWith('```'))
                    return;
                var _a = source.match(syntax) || [
                        '',
                        '',
                        ''
                    ], whole = _a[0], keyword = _a[1], lang = _a[2];
                if (!whole)
                    return;
                var el = document.createElement('pre');
                if (lang) {
                    void el.setAttribute('class', 'lang-' + lang.toLowerCase());
                }
                var closer = '^\n' + keyword + 's*(?:\n|$)';
                var _b = loop_1.loop(combine_1.combine([plaintext_1.plaintext]), closer)('\n' + source.slice(source.indexOf('\n') + 1)) || [
                        [],
                        ''
                    ], _c = _b[0], cs = _c.slice(1), rest = _b[1];
                if (rest.search(closer) !== 0)
                    return;
                void el.appendChild(text_1.squash(cs));
                return block_1.consumeBlockEndEmptyLine([el], source.slice(source.length - rest.length + 1 + keyword.length + 1));
            };
        },
        {
            '../../combinator/combine': 10,
            '../../combinator/loop': 11,
            '../block': 13,
            '../text': 47,
            '../text/plaintext': 49
        }
    ],
    26: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var loop_1 = require('../../combinator/loop');
            var block_1 = require('../block');
            var inline_1 = require('../inline');
            var text_1 = require('../text');
            var syntax = /^(\|[^\n]*)+?\s*?\n/;
            var align = /^:?-+:?$/;
            exports.table = function (source) {
                if (source.search(syntax) !== 0)
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
                return block_1.consumeBlockEndEmptyLine([table], source);
            };
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
            var rowseparator = /^\||^\s*?\n/;
            var rowend = /^\|?\s*?(?:\n|$)/;
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
                    void cols.push(trim(text_1.squash(col)));
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
            '../../combinator/loop': 11,
            '../block': 13,
            '../inline': 28,
            '../text': 47
        }
    ],
    27: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var combine_1 = require('../../combinator/combine');
            var loop_1 = require('../../combinator/loop');
            var block_1 = require('../block');
            var olist_1 = require('./olist');
            var indent_1 = require('./indent');
            var inline_1 = require('../inline');
            var text_1 = require('../text');
            var syntax = /^([-+*])(?=\s|$)/;
            var content = /^(\[[ x]\](?: +|$))?.*$/;
            exports.ulist = function (source) {
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
                        var _a = line.slice(line.split(' ', 1)[0].length + 1).trim().match(content), text = _a[0], _b = _a[1], checkbox = _b === void 0 ? '' : _b;
                        var li = el.appendChild(document.createElement('li'));
                        if (checkbox) {
                            var cb = document.createElement('span');
                            void cb.setAttribute('class', 'checkbox');
                            void cb.appendChild(document.createTextNode(checkbox.trim() + ' '));
                            void li.appendChild(cb);
                        }
                        void li.appendChild(text_1.squash((loop_1.loop(combine_1.combine([inline_1.inline]))(text.slice(checkbox.length)) || [[]])[0]));
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
                        void li_1.appendChild(text_1.squash(children));
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
                return block_1.consumeBlockEndEmptyLine([el], source);
            };
        },
        {
            '../../combinator/combine': 10,
            '../../combinator/loop': 11,
            '../block': 13,
            '../inline': 28,
            '../text': 47,
            './indent': 20,
            './olist': 23
        }
    ],
    28: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var combine_1 = require('../combinator/combine');
            var annotation_1 = require('./inline/annotation');
            var parenthesis_1 = require('./inline/parenthesis');
            var insertion_1 = require('./inline/insertion');
            var deletion_1 = require('./inline/deletion');
            var strong_1 = require('./inline/strong');
            var emphasis_1 = require('./inline/emphasis');
            var superscript_1 = require('./inline/superscript');
            var subscript_1 = require('./inline/subscript');
            var code_1 = require('./inline/code');
            var mathinline_1 = require('./inline/mathinline');
            var media_1 = require('./inline/media');
            var link_1 = require('./inline/link');
            var html_1 = require('./inline/html');
            var htmlentity_1 = require('./inline/htmlentity');
            var autolink_1 = require('./inline/autolink');
            var text_1 = require('./text/text');
            exports.inline = combine_1.combine([
                annotation_1.annotation,
                parenthesis_1.parenthesis,
                insertion_1.insertion,
                deletion_1.deletion,
                strong_1.strong,
                emphasis_1.emphasis,
                superscript_1.superscript,
                subscript_1.subscript,
                code_1.code,
                mathinline_1.mathinline,
                media_1.media,
                link_1.link,
                html_1.html,
                htmlentity_1.htmlentity,
                autolink_1.autolink,
                text_1.text
            ]);
        },
        {
            '../combinator/combine': 10,
            './inline/annotation': 29,
            './inline/autolink': 30,
            './inline/code': 33,
            './inline/deletion': 34,
            './inline/emphasis': 35,
            './inline/html': 36,
            './inline/htmlentity': 37,
            './inline/insertion': 38,
            './inline/link': 39,
            './inline/mathinline': 40,
            './inline/media': 41,
            './inline/parenthesis': 42,
            './inline/strong': 43,
            './inline/subscript': 44,
            './inline/superscript': 45,
            './text/text': 50
        }
    ],
    29: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var combine_1 = require('../../combinator/combine');
            var loop_1 = require('../../combinator/loop');
            var inline_1 = require('../inline');
            var text_1 = require('../text');
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
                void el.appendChild(text_1.squash(cs));
                if (el.textContent.trim() === '')
                    return;
                return [
                    [el],
                    rest.slice(2)
                ];
            };
        },
        {
            '../../combinator/combine': 10,
            '../../combinator/loop': 11,
            '../inline': 28,
            '../text': 47
        }
    ],
    30: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var combine_1 = require('../../combinator/combine');
            var uri_1 = require('./autolink/uri');
            var account_1 = require('./autolink/account');
            exports.autolink = combine_1.combine([
                uri_1.uri,
                account_1.account
            ]);
        },
        {
            '../../combinator/combine': 10,
            './autolink/account': 31,
            './autolink/uri': 32
        }
    ],
    31: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var syntax = /^@[a-zA-Z0-9]+(?:[_\-]+[0-9a-zA-Z]+)*(?![0-9a-zA-Z@])/;
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
    32: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var combine_1 = require('../../../combinator/combine');
            var loop_1 = require('../../../combinator/loop');
            var text_1 = require('../../text');
            var text_2 = require('../../text/text');
            var link_1 = require('../link');
            var syntax = /^(?:!?h)?ttps?:\/\/\S+/;
            var closer = /^['"`[\](){}<>]|^\\?(?:\s|$)|^[~^+*,.;:!?]*(?:[\s\])}<>|]|$)/;
            var escape = /^(?:[0-9a-zA-Z][!?]*h|\?h|[0-9a-gi-zA-Z!?])ttps?:\/\/\S+/;
            exports.uri = function (source) {
                if (source.search(escape) === 0)
                    return [
                        [document.createTextNode(source.slice(0, source.indexOf(':')))],
                        source.slice(source.indexOf(':'))
                    ];
                if (source.search(syntax) !== 0)
                    return;
                var media = source.startsWith('!h');
                source = media ? source.slice(1) : source;
                var _a = loop_1.loop(combine_1.combine([text_2.text]), closer)(source) || [
                        [],
                        ''
                    ], cs = _a[0], rest = _a[1];
                return media ? link_1.link('[![](' + source.slice(0, source.length - rest.length) + ')](' + source.slice(0, source.length - rest.length) + ')' + rest) : link_1.link('[](' + (source.startsWith('h') ? '' : 'h') + source.slice(0, source.length - rest.length) + (source.startsWith('h') ? '' : ' nofollow') + ')' + rest);
            };
        },
        {
            '../../../combinator/combine': 10,
            '../../../combinator/loop': 11,
            '../../text': 47,
            '../../text/text': 50,
            '../link': 39
        }
    ],
    33: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var combine_1 = require('../../combinator/combine');
            var loop_1 = require('../../combinator/loop');
            var text_1 = require('../text');
            var plaintext_1 = require('../text/plaintext');
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
                var _b = loop_1.loop(combine_1.combine([plaintext_1.plaintext]), '^' + keyword)(source.slice(keyword.length)) || [
                        [],
                        ''
                    ], cs = _b[0], rest = _b[1];
                if (!rest.startsWith(keyword))
                    return;
                var el = document.createElement('code');
                void el.appendChild(text_1.squash(cs));
                if (el.textContent.trim() === '')
                    return;
                el.textContent = el.textContent.trim();
                return [
                    [el],
                    rest.slice(keyword.length)
                ];
            };
        },
        {
            '../../combinator/combine': 10,
            '../../combinator/loop': 11,
            '../text': 47,
            '../text/plaintext': 49
        }
    ],
    34: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var combine_1 = require('../../combinator/combine');
            var loop_1 = require('../../combinator/loop');
            var inline_1 = require('../inline');
            var text_1 = require('../text');
            var syntax = /^~~[\s\S]+?~~/;
            var closer = /^~~/;
            exports.deletion = function (source) {
                if (!source.startsWith('~~') || source.search(syntax) !== 0)
                    return;
                var _a = loop_1.loop(combine_1.combine([inline_1.inline]), closer)(source.slice(2)) || [
                        [],
                        ''
                    ], cs = _a[0], rest = _a[1];
                if (!rest.startsWith('~~'))
                    return;
                var el = document.createElement('del');
                void el.appendChild(text_1.squash(cs));
                if (el.textContent.trim() === '')
                    return;
                return [
                    [el],
                    rest.slice(2)
                ];
            };
        },
        {
            '../../combinator/combine': 10,
            '../../combinator/loop': 11,
            '../inline': 28,
            '../text': 47
        }
    ],
    35: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var combine_1 = require('../../combinator/combine');
            var loop_1 = require('../../combinator/loop');
            var inline_1 = require('../inline');
            var text_1 = require('../text');
            var syntax = /^\*[\s\S]+?\*/;
            var closer = /^\*/;
            exports.emphasis = function (source) {
                if (!source.startsWith('*') || source.search(syntax) !== 0)
                    return;
                var _a = loop_1.loop(combine_1.combine([inline_1.inline]), closer)(source.slice(1)) || [
                        [],
                        ''
                    ], cs = _a[0], rest = _a[1];
                if (!rest.startsWith('*'))
                    return;
                var el = document.createElement('em');
                void el.appendChild(text_1.squash(cs));
                if (el.textContent.trim() === '')
                    return;
                return [
                    [el],
                    rest.slice(1)
                ];
            };
        },
        {
            '../../combinator/combine': 10,
            '../../combinator/loop': 11,
            '../inline': 28,
            '../text': 47
        }
    ],
    36: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var combine_1 = require('../../combinator/combine');
            var loop_1 = require('../../combinator/loop');
            var inline_1 = require('../inline');
            var text_1 = require('../text');
            var plaintext_1 = require('../text/plaintext');
            var syntax = /^(<([a-z]+)>)/i;
            var inlinetags = Object.freeze('code|small|q|cite|mark|ruby|rt|rp|bdi|bdo|wbr'.split('|'));
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
                var _b = tagname === 'code' ? loop_1.loop(combine_1.combine([plaintext_1.plaintext]), '^</' + tagname + '>')(source.slice(opentag.length)) || [
                        [],
                        source.slice(opentag.length)
                    ] : loop_1.loop(combine_1.combine([inline_1.inline]), '^</' + tagname + '>')(source.slice(opentag.length)) || [
                        [],
                        source.slice(opentag.length)
                    ], cs = _b[0], rest = _b[1];
                var el = document.createElement(tagname);
                void el.appendChild(text_1.squash(cs));
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
            '../../combinator/combine': 10,
            '../../combinator/loop': 11,
            '../inline': 28,
            '../text': 47,
            '../text/plaintext': 49
        }
    ],
    37: [
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
    38: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var combine_1 = require('../../combinator/combine');
            var loop_1 = require('../../combinator/loop');
            var inline_1 = require('../inline');
            var text_1 = require('../text');
            var syntax = /^\+\+[\s\S]+?\+\+/;
            var closer = /^\+\+/;
            exports.insertion = function (source) {
                if (!source.startsWith('++') || source.search(syntax) !== 0)
                    return;
                var _a = loop_1.loop(combine_1.combine([inline_1.inline]), closer)(source.slice(2)) || [
                        [],
                        ''
                    ], cs = _a[0], rest = _a[1];
                if (!rest.startsWith('++'))
                    return;
                var el = document.createElement('ins');
                void el.appendChild(text_1.squash(cs));
                if (el.textContent.trim() === '')
                    return;
                return [
                    [el],
                    rest.slice(2)
                ];
            };
        },
        {
            '../../combinator/combine': 10,
            '../../combinator/loop': 11,
            '../inline': 28,
            '../text': 47
        }
    ],
    39: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var combine_1 = require('../../combinator/combine');
            var loop_1 = require('../../combinator/loop');
            var inline_1 = require('../inline');
            var text_1 = require('../text');
            var text_2 = require('../text/text');
            var url_1 = require('../text/url');
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
                var children = text_1.squash(first);
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
                var _c = loop_1.loop(text_2.text, /^\)|^\s(?!nofollow)/)('?' + next.replace(/^\]\n?\(/, '')) || [
                        [],
                        ''
                    ], _d = _c[0], second = _d.slice(1), rest = _c[1];
                if (!rest.startsWith(')'))
                    return;
                var _e = second.reduce(function (s, c) {
                        return s + c.textContent;
                    }, '').split(/\s/), INSECURE_URL = _e[0], nofollow = _e[1];
                var url = url_1.sanitize(INSECURE_URL);
                if (INSECURE_URL !== '' && url === '')
                    return;
                var el = document.createElement('a');
                void el.setAttribute('href', url);
                if (location.protocol !== el.protocol || location.host !== el.host) {
                    void el.setAttribute('target', '_blank');
                    void el.setAttribute('rel', 'noopener');
                }
                if (nofollow) {
                    void el.setAttribute('rel', 'noopener nofollow noreferrer');
                }
                void el.appendChild(children.textContent || children.querySelector('img') ? children : document.createTextNode((url || el.href).replace(/^h(?=ttps?:\/\/)/, nofollow ? '' : 'h')));
                return [
                    [el],
                    rest.slice(1)
                ];
            };
        },
        {
            '../../combinator/combine': 10,
            '../../combinator/loop': 11,
            '../inline': 28,
            '../text': 47,
            '../text/text': 50,
            '../text/url': 51
        }
    ],
    40: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var combine_1 = require('../../combinator/combine');
            var loop_1 = require('../../combinator/loop');
            var text_1 = require('../text');
            var mathtext_1 = require('../text/mathtext');
            var syntax = /^\$(\S[^\n]*?)\$(?!\d)/;
            var closer = /^\$(?!\d)|^\n/;
            exports.mathinline = function (source) {
                if (!source.startsWith('$') || source.search(syntax) !== 0)
                    return;
                var _a = loop_1.loop(combine_1.combine([mathtext_1.mathtext]), closer)(source.slice(1)) || [
                        [],
                        ''
                    ], cs = _a[0], rest = _a[1];
                if (!rest.startsWith('$'))
                    return;
                var el = document.createElement('span');
                void el.setAttribute('class', 'math');
                void el.appendChild(text_1.squash([document.createTextNode('$')].concat(cs, [document.createTextNode('$')])));
                if (el.textContent.slice(1, -1).trim() === '')
                    return;
                if (el.textContent.slice(1, -1) !== el.textContent.slice(1, -1).trim())
                    return;
                return [
                    [el],
                    rest.slice(1)
                ];
            };
        },
        {
            '../../combinator/combine': 10,
            '../../combinator/loop': 11,
            '../text': 47,
            '../text/mathtext': 48
        }
    ],
    41: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var combine_1 = require('../../combinator/combine');
            var loop_1 = require('../../combinator/loop');
            var text_1 = require('../text/text');
            var url_1 = require('../text/url');
            var typed_dom_1 = require('typed-dom');
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
                var el = typed_dom_1.default.img({
                    class: 'media',
                    'data-src': url,
                    alt: caption,
                    style: 'max-width: 100%;'
                }).element;
                return [
                    [el],
                    rest.slice(1)
                ];
            };
        },
        {
            '../../combinator/combine': 10,
            '../../combinator/loop': 11,
            '../text/text': 50,
            '../text/url': 51,
            'typed-dom': 4
        }
    ],
    42: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var combine_1 = require('../../combinator/combine');
            var loop_1 = require('../../combinator/loop');
            var inline_1 = require('../inline');
            var text_1 = require('../text');
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
                    Array.from(text_1.squash([document.createTextNode('(')].concat(cs).concat([document.createTextNode(')')])).childNodes),
                    rest.slice(1)
                ];
            };
        },
        {
            '../../combinator/combine': 10,
            '../../combinator/loop': 11,
            '../inline': 28,
            '../text': 47
        }
    ],
    43: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var combine_1 = require('../../combinator/combine');
            var loop_1 = require('../../combinator/loop');
            var inline_1 = require('../inline');
            var text_1 = require('../text');
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
                void el.appendChild(text_1.squash(cs));
                if (el.textContent.trim() === '')
                    return;
                return [
                    [el],
                    rest.slice(2)
                ];
            };
        },
        {
            '../../combinator/combine': 10,
            '../../combinator/loop': 11,
            '../inline': 28,
            '../text': 47
        }
    ],
    44: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var combine_1 = require('../../combinator/combine');
            var loop_1 = require('../../combinator/loop');
            var text_1 = require('../text');
            var text_2 = require('../text/text');
            var syntax = /^~\S[^\n]*?~/;
            var closer = /^~|^\n/;
            exports.subscript = function (source) {
                if (!source.startsWith('~') || source.search(syntax) !== 0)
                    return;
                var _a = loop_1.loop(combine_1.combine([text_2.text]), closer)(source.slice(1)) || [
                        [],
                        ''
                    ], cs = _a[0], rest = _a[1];
                if (!rest.startsWith('~'))
                    return;
                var el = document.createElement('sub');
                void el.appendChild(text_1.squash(cs));
                if (el.textContent.trim() === '')
                    return;
                if (el.textContent !== el.textContent.trim())
                    return;
                return [
                    [el],
                    rest.slice(1)
                ];
            };
        },
        {
            '../../combinator/combine': 10,
            '../../combinator/loop': 11,
            '../text': 47,
            '../text/text': 50
        }
    ],
    45: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var combine_1 = require('../../combinator/combine');
            var loop_1 = require('../../combinator/loop');
            var text_1 = require('../text');
            var text_2 = require('../text/text');
            var syntax = /^\^\S[^\n]*?\^/;
            var closer = /^\^|^\n/;
            exports.superscript = function (source) {
                if (!source.startsWith('^') || source.search(syntax) !== 0)
                    return;
                var _a = loop_1.loop(combine_1.combine([text_2.text]), closer)(source.slice(1)) || [
                        [],
                        ''
                    ], cs = _a[0], rest = _a[1];
                if (!rest.startsWith('^'))
                    return;
                var el = document.createElement('sup');
                void el.appendChild(text_1.squash(cs));
                if (el.textContent.trim() === '')
                    return;
                if (el.textContent !== el.textContent.trim())
                    return;
                return [
                    [el],
                    rest.slice(1)
                ];
            };
        },
        {
            '../../combinator/combine': 10,
            '../../combinator/loop': 11,
            '../text': 47,
            '../text/text': 50
        }
    ],
    46: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var pretext_1 = require('../parser/block/pretext');
            var mathblock_1 = require('../parser/block/mathblock');
            var extension_1 = require('../parser/block/extension');
            var combine_1 = require('../combinator/combine');
            var syntax = /^(?:\s*?\n)+|^(?:[^\n]*\n)+?\s*?\n/;
            function segment(source) {
                var segments = [];
                while (source.length > 0) {
                    var _a = combine_1.combine([
                            pretext_1.pretext,
                            mathblock_1.mathblock,
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
            '../combinator/combine': 10,
            '../parser/block/extension': 16,
            '../parser/block/mathblock': 21,
            '../parser/block/pretext': 25
        }
    ],
    47: [
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
    48: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var plaintext_1 = require('./zalgo/plaintext');
            var separator = /\$|\\|\n|[\u0300-\u036F]/i;
            exports.mathtext = function (source) {
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
                        case '\\':
                        case '$':
                            return plaintext_1.zalgo(source) || [
                                [document.createTextNode(source.slice(0, 2))],
                                source.slice(2)
                            ];
                        default:
                            return plaintext_1.zalgo(source) || [
                                [document.createTextNode(source.slice(0, 1))],
                                source.slice(1)
                            ];
                        }
                    default:
                        return plaintext_1.zalgo(source) || [
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
        { './zalgo/plaintext': 52 }
    ],
    49: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var plaintext_1 = require('./zalgo/plaintext');
            var separator = /`|<\/code>|\n|[\u0300-\u036F]/i;
            exports.plaintext = function (source) {
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
                    return plaintext_1.zalgo(source) || [
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
        { './zalgo/plaintext': 52 }
    ],
    50: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var text_1 = require('./zalgo/text');
            var separator = /[^0-9a-zA-Z\u0080-\uFFFF]|[\u0300-\u036F]|(?:[0-9a-zA-Z][!?]*h|\?h|[0-9a-gi-zA-Z!?])ttps?:|[0-9a-zA-Z@]?@[0-9a-zA-Z]/;
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
                            return text_1.zalgo(source) || [
                                [document.createTextNode(source.slice(1, 2))],
                                source.slice(2)
                            ];
                        }
                    case '\n':
                        return [
                            [document.createTextNode(' ')],
                            source.slice(1)
                        ];
                    default:
                        return text_1.zalgo(source) || [
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
        { './zalgo/text': 53 }
    ],
    51: [
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
    52: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var syntax = /^[\u0300-\u036F]+/;
            exports.zalgo = function (source) {
                if (source.search(syntax) !== 0)
                    return;
                return [
                    [document.createTextNode(source[0])],
                    source.replace(syntax, '')
                ];
            };
        },
        {}
    ],
    53: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var syntax = /^(?:\\?[\u0300-\u036F])+/;
            exports.zalgo = function (source) {
                if (source.search(syntax) !== 0)
                    return;
                return [
                    [document.createTextNode(source.startsWith('\\') ? source[1] : source[0])],
                    source.replace(syntax, '')
                ];
            };
        },
        {}
    ],
    54: [
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
            '../parser/segment': 46,
            './parser': 62
        }
    ],
    55: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var twitter_1 = require('./media/twitter');
            var youtube_1 = require('./media/youtube');
            var gist_1 = require('./media/gist');
            var slideshare_1 = require('./media/slideshare');
            var pdf_1 = require('./media/pdf');
            var image_1 = require('./media/image');
            function media(source) {
                var url = source.getAttribute('data-src');
                var target = source.closest('a') || source;
                var el = void 0 || twitter_1.twitter(url) || youtube_1.youtube(url) || gist_1.gist(url) || slideshare_1.slideshare(url) || pdf_1.pdf(url) || image_1.image(source);
                void target.parentElement.replaceChild(el, target);
            }
            exports.media = media;
        },
        {
            './media/gist': 56,
            './media/image': 57,
            './media/pdf': 58,
            './media/slideshare': 59,
            './media/twitter': 60,
            './media/youtube': 61
        }
    ],
    56: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var typed_dom_1 = require('typed-dom');
            var parser_1 = require('../parser');
            function gist(url) {
                if (!url.startsWith('https://gist.github.com/'))
                    return;
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
                                    var outer = parser_1.parse(url).querySelector('a');
                                    void outer.removeChild(outer.firstChild);
                                    return outer;
                                })]).element, gist.firstChild);
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
            '../parser': 62,
            'typed-dom': 4
        }
    ],
    57: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            function image(source) {
                var url = source.getAttribute('data-src');
                void source.setAttribute('src', url);
                return source.closest('a') || source;
            }
            exports.image = image;
        },
        {}
    ],
    58: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var typed_dom_1 = require('typed-dom');
            var parser_1 = require('../parser');
            function pdf(url) {
                if (!url.split(/[?#]/).shift().endsWith('.pdf') || url.split('/').length < 4)
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
                    typed_dom_1.default.div([typed_dom_1.default.strong(function () {
                            return parser_1.parse('**' + url + '**').querySelector('strong');
                        })])
                ]).element;
            }
            exports.pdf = pdf;
        },
        {
            '../parser': 62,
            'typed-dom': 4
        }
    ],
    59: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var typed_dom_1 = require('typed-dom');
            var parser_1 = require('../parser');
            function slideshare(url) {
                if (!url.startsWith('https://www.slideshare.net/'))
                    return;
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
            '../parser': 62,
            'typed-dom': 4
        }
    ],
    60: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var typed_dom_1 = require('typed-dom');
            var parser_1 = require('../parser');
            function twitter(url) {
                if (!url.startsWith('https://twitter.com/'))
                    return;
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
            '../parser': 62,
            'typed-dom': 4
        }
    ],
    61: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var typed_dom_1 = require('typed-dom');
            function youtube(url) {
                var query = void 0 || url.startsWith('https://youtu.be/') && url.slice(url.indexOf('/', 9)) || url.startsWith('https://www.youtube.com/watch?v=') && url.replace(/.+?=/, '').replace(/&/, '?') || '';
                if (!query)
                    return;
                return typed_dom_1.default.div({
                    class: 'media',
                    style: 'position: relative;'
                }, [typed_dom_1.default.div({ style: 'position: relative; padding-top: 56.25%;' }, [typed_dom_1.default.iframe({
                            src: 'https://www.youtube.com/embed/' + query,
                            sandbox: 'allow-scripts allow-same-origin allow-presentation',
                            allowfullscreen: '',
                            frameborder: '0',
                            style: 'position: absolute; top: 0; right: 0; width: 100%; height: 100%;'
                        })])]).element;
            }
            exports.youtube = youtube;
        },
        { 'typed-dom': 4 }
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
            '../combinator/loop': 11,
            '../parser/block': 13,
            '../parser/segment': 46
        }
    ],
    63: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var media_1 = require('./media');
            function render(el) {
                void [el].concat(Array.from(el.querySelectorAll('img:not([src]), .math'))).forEach(function (el) {
                    switch (true) {
                    case el instanceof HTMLImageElement:
                        return void media_1.media(el);
                    case el.matches('.math'):
                        return void MathJax.Hub.Queue([
                            'Typeset',
                            MathJax.Hub,
                            el
                        ]);
                    default:
                        return;
                    }
                });
            }
            exports.render = render;
        },
        { './media': 55 }
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
        { './src/export': 12 }
    ]
}, {}, [
    1,
    2,
    'securemark',
    3
]);