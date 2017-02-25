/*! securemark v0.11.0 https://github.com/falsandtru/securemark | (c) 2017, falsandtru | (Apache-2.0 AND MPL-2.0) License */
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
    5: [
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
    6: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var parser_1 = require('./parser');
            exports.parse = parser_1.parse;
            var bind_1 = require('./viewer/bind');
            exports.bind = bind_1.bind;
        },
        {
            './parser': 7,
            './viewer/bind': 38
        }
    ],
    7: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var loop_1 = require('./combinator/loop');
            var block_1 = require('./parser/block');
            var segment_1 = require('./parser/segment');
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
            './combinator/loop': 5,
            './parser/block': 8,
            './parser/segment': 36
        }
    ],
    8: [
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
            '../combinator/combine': 4,
            './block/blockquote': 9,
            './block/dlist': 10,
            './block/extension': 11,
            './block/heading': 13,
            './block/horizontalrule': 14,
            './block/newline': 16,
            './block/olist': 17,
            './block/paragraph': 18,
            './block/pretext': 19,
            './block/table': 20,
            './block/ulist': 21
        }
    ],
    9: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var block_1 = require('../block');
            var combine_1 = require('../../combinator/combine');
            var loop_1 = require('../../combinator/loop');
            var plaintext_1 = require('../inline/plaintext');
            var text_1 = require('../inline/text');
            var syntax = /^>+/;
            exports.blockquote = function (source) {
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
                    if (bottom.lastChild && bottom.lastChild !== bottom.lastElementChild) {
                        void bottom.appendChild(document.createElement('br'));
                    }
                    void bottom.appendChild(text_1.squash((loop_1.loop(combine_1.combine([plaintext_1.plaintext]))(line[0] === '>' ? line.slice(indent.length + diff).trim() : line.trim()) || [[]])[0]));
                    if (!bottom.lastChild || !bottom.lastChild.textContent)
                        return;
                    indent = indent[0].repeat(indent.length + diff);
                    source = source.slice(line.length + 1);
                }
                return bottom.childNodes.length === 0 ? void 0 : block_1.consumeBlockEndEmptyLine([top], source);
            };
        },
        {
            '../../combinator/combine': 4,
            '../../combinator/loop': 5,
            '../block': 8,
            '../inline/plaintext': 31,
            '../inline/text': 35
        }
    ],
    10: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var block_1 = require('../block');
            var combine_1 = require('../../combinator/combine');
            var loop_1 = require('../../combinator/loop');
            var inline_1 = require('../inline');
            var text_1 = require('../inline/text');
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
                                if (line_1.trim() === '' || line_1.match(separator))
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
                return el.children.length === 0 ? void 0 : block_1.consumeBlockEndEmptyLine([el], source);
            };
        },
        {
            '../../combinator/combine': 4,
            '../../combinator/loop': 5,
            '../block': 8,
            '../inline': 22,
            '../inline/text': 35
        }
    ],
    11: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var combine_1 = require('../../combinator/combine');
            var placeholder_1 = require('./extension/placeholder');
            exports.extension = combine_1.combine([placeholder_1.placeholder]);
        },
        {
            '../../combinator/combine': 4,
            './extension/placeholder': 12
        }
    ],
    12: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var block_1 = require('../../block');
            var loop_1 = require('../../../combinator/loop');
            var inline_1 = require('../../inline');
            var text_1 = require('../../inline/text');
            var syntax = /^(~{3,})(\S*?)\s*?\n(?:[^\n]*\n)*?\1/;
            var cache = new Map();
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
                if (!cache.has(keyword)) {
                    void cache.set(keyword, new RegExp('^' + keyword + 's*(?:\n|$)'));
                }
                var lines = [];
                while (true) {
                    var line = source.split('\n', 1)[0];
                    if (line.match(cache.get(keyword)))
                        break;
                    void lines.push(line + '\n');
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
            '../../../combinator/loop': 5,
            '../../block': 8,
            '../../inline': 22,
            '../../inline/text': 35
        }
    ],
    13: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var block_1 = require('../block');
            var combine_1 = require('../../combinator/combine');
            var loop_1 = require('../../combinator/loop');
            var inline_1 = require('../inline');
            var text_1 = require('../inline/text');
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
            '../../combinator/combine': 4,
            '../../combinator/loop': 5,
            '../block': 8,
            '../inline': 22,
            '../inline/text': 35
        }
    ],
    14: [
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
        { '../block': 8 }
    ],
    15: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var syntax = /^\s*/;
            function indent(source) {
                var indent = (source.split('\n', 1)[0].match(syntax) || [''])[0];
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
        },
        {}
    ],
    16: [
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
    17: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var block_1 = require('../block');
            var combine_1 = require('../../combinator/combine');
            var loop_1 = require('../../combinator/loop');
            var ulist_1 = require('./ulist');
            var indent_1 = require('./indent');
            var inline_1 = require('../inline');
            var text_1 = require('../inline/text');
            var syntax = /^([0-9]+|[A-Z]+|[a-z]+)\.(?:\s|$)/;
            exports.olist = function (source) {
                var _a = source.match(syntax) || [
                        '',
                        ''
                    ], whole = _a[0], index = _a[1];
                if (!whole)
                    return;
                var el = document.createElement('ol');
                void el.setAttribute('start', index);
                void el.setAttribute('type', !isNaN(+index) ? '1' : index === index.toLowerCase() ? 'a' : 'A');
                while (true) {
                    var line = source.split('\n', 1)[0];
                    if (line.trim() === '')
                        break;
                    if (line.match(syntax)) {
                        var text = line.slice(line.indexOf('.') + 1).trim();
                        var li = el.appendChild(document.createElement('li'));
                        void li.appendChild(text_1.squash((loop_1.loop(combine_1.combine([inline_1.inline]))(text) || [[]])[0]));
                        source = source.slice(line.length + 1);
                        continue;
                    } else {
                        if (el.lastElementChild.lastElementChild && [
                                'ul',
                                'ol'
                            ].indexOf(el.lastElementChild.lastElementChild.tagName.toLowerCase()) !== -1)
                            return;
                        var _b = indent_1.indent(source), block = _b[0], rest = _b[1];
                        if (rest === source)
                            return;
                        var _c = combine_1.combine([
                                ulist_1.ulist,
                                exports.olist
                            ])(block) || [
                                [],
                                block
                            ], children = _c[0], brest = _c[1];
                        if (children.length === 0 || brest.length !== 0)
                            return;
                        void el.lastElementChild.appendChild(text_1.squash(children));
                        source = rest;
                        continue;
                    }
                }
                return el.children.length === 0 ? void 0 : block_1.consumeBlockEndEmptyLine([el], source);
            };
        },
        {
            '../../combinator/combine': 4,
            '../../combinator/loop': 5,
            '../block': 8,
            '../inline': 22,
            '../inline/text': 35,
            './indent': 15,
            './ulist': 21
        }
    ],
    18: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var block_1 = require('../block');
            var combine_1 = require('../../combinator/combine');
            var loop_1 = require('../../combinator/loop');
            var inline_1 = require('../inline');
            var text_1 = require('../inline/text');
            var closer = /^\n\s*?\n/;
            exports.paragraph = function (source) {
                if (source.startsWith('\n') || source.match(closer))
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
            '../../combinator/combine': 4,
            '../../combinator/loop': 5,
            '../block': 8,
            '../inline': 22,
            '../inline/text': 35
        }
    ],
    19: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var block_1 = require('../block');
            var combine_1 = require('../../combinator/combine');
            var loop_1 = require('../../combinator/loop');
            var plaintext_1 = require('../inline/plaintext');
            var text_1 = require('../inline/text');
            var syntax = /^(`{3,})([0-9a-z]*)\S*\s*?\n(?:[^\n]*\n)*?\1/;
            var cache = new Map();
            exports.pretext = function (source) {
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
                source = source.slice(source.indexOf('\n') + 1);
                if (!cache.has(keyword)) {
                    void cache.set(keyword, new RegExp('^' + keyword + 's*(?:\n|$)'));
                }
                while (true) {
                    var line = source.split('\n', 1)[0];
                    if (line.match(cache.get(keyword)))
                        break;
                    void el.appendChild(text_1.squash((loop_1.loop(combine_1.combine([plaintext_1.plaintext]))(line + '\n') || [[]])[0]));
                    source = source.slice(line.length + 1);
                    if (source === '')
                        return;
                }
                if (el.lastChild) {
                    el.lastChild.textContent = el.lastChild.textContent.slice(0, -1);
                }
                return block_1.consumeBlockEndEmptyLine([el], source.slice(keyword.length + 1));
            };
        },
        {
            '../../combinator/combine': 4,
            '../../combinator/loop': 5,
            '../block': 8,
            '../inline/plaintext': 31,
            '../inline/text': 35
        }
    ],
    20: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var block_1 = require('../block');
            var loop_1 = require('../../combinator/loop');
            var inline_1 = require('../inline');
            var text_1 = require('../inline/text');
            var syntax = /^(\|[^\n]*)+?\s*?\n/;
            var align = /^:?-+:?$/;
            exports.table = function (source) {
                if (!source.match(syntax))
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
                        return !e.textContent || !e.textContent.match(align);
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
                while (true) {
                    var line = source.split('\n', 1)[0];
                    if (line.trim() === '')
                        break;
                    var _c = parse(line) || [
                            [],
                            line
                        ], cols = _c[0], rest = _c[1];
                    if (rest.length !== 0)
                        return;
                    void append(cols, table, aligns);
                    source = source.slice(line.length + 1);
                }
                return table.lastElementChild.children.length === 0 ? void 0 : block_1.consumeBlockEndEmptyLine([table], source);
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
                    void cols.push(text_1.squash(col));
                    if (source.match(rowend))
                        return [
                            cols,
                            source.slice(source.split('\n')[0].length + 1)
                        ];
                }
            }
        },
        {
            '../../combinator/loop': 5,
            '../block': 8,
            '../inline': 22,
            '../inline/text': 35
        }
    ],
    21: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var block_1 = require('../block');
            var combine_1 = require('../../combinator/combine');
            var loop_1 = require('../../combinator/loop');
            var olist_1 = require('./olist');
            var indent_1 = require('./indent');
            var inline_1 = require('../inline');
            var text_1 = require('../inline/text');
            var syntax = /^-(?:\s|$)/;
            exports.ulist = function (source) {
                var whole = (source.match(syntax) || [
                    '',
                    ''
                ])[0];
                if (!whole)
                    return;
                var el = document.createElement('ul');
                while (true) {
                    var line = source.split('\n', 1)[0];
                    if (line.trim() === '')
                        break;
                    if (line.match(syntax)) {
                        var text = line.slice(1).trim();
                        var li = el.appendChild(document.createElement('li'));
                        void li.appendChild(text_1.squash((loop_1.loop(combine_1.combine([inline_1.inline]))(text) || [[]])[0]));
                        source = source.slice(line.length + 1);
                        continue;
                    } else {
                        if (el.lastElementChild.lastElementChild && [
                                'ul',
                                'ol'
                            ].indexOf(el.lastElementChild.lastElementChild.tagName.toLowerCase()) !== -1)
                            return;
                        var _a = indent_1.indent(source), block = _a[0], rest = _a[1];
                        if (rest === source)
                            return;
                        var _b = combine_1.combine([
                                exports.ulist,
                                olist_1.olist
                            ])(block) || [
                                [],
                                block
                            ], children = _b[0], brest = _b[1];
                        if (children.length === 0 || brest.length !== 0)
                            return;
                        void el.lastElementChild.appendChild(text_1.squash(children));
                        source = rest;
                        continue;
                    }
                }
                return el.children.length === 0 ? void 0 : block_1.consumeBlockEndEmptyLine([el], source);
            };
        },
        {
            '../../combinator/combine': 4,
            '../../combinator/loop': 5,
            '../block': 8,
            '../inline': 22,
            '../inline/text': 35,
            './indent': 15,
            './olist': 17
        }
    ],
    22: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var combine_1 = require('../combinator/combine');
            var insertion_1 = require('./inline/insertion');
            var deletion_1 = require('./inline/deletion');
            var strong_1 = require('./inline/strong');
            var emphasis_1 = require('./inline/emphasis');
            var superscript_1 = require('./inline/superscript');
            var subscript_1 = require('./inline/subscript');
            var code_1 = require('./inline/code');
            var image_1 = require('./inline/image');
            var link_1 = require('./inline/link');
            var annotation_1 = require('./inline/annotation');
            var html_1 = require('./inline/html');
            var text_1 = require('./inline/text');
            exports.inline = combine_1.combine([
                insertion_1.insertion,
                deletion_1.deletion,
                strong_1.strong,
                emphasis_1.emphasis,
                superscript_1.superscript,
                subscript_1.subscript,
                code_1.code,
                image_1.image,
                link_1.link,
                annotation_1.annotation,
                html_1.html,
                text_1.text
            ]);
        },
        {
            '../combinator/combine': 4,
            './inline/annotation': 23,
            './inline/code': 24,
            './inline/deletion': 25,
            './inline/emphasis': 26,
            './inline/html': 27,
            './inline/image': 28,
            './inline/insertion': 29,
            './inline/link': 30,
            './inline/strong': 32,
            './inline/subscript': 33,
            './inline/superscript': 34,
            './inline/text': 35
        }
    ],
    23: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var combine_1 = require('../../combinator/combine');
            var loop_1 = require('../../combinator/loop');
            var text_1 = require('./text');
            var syntax = /^\(\([\s\S]+?\)\)/;
            var closer = /^\)\)(?!\))/;
            exports.annotation = function (source) {
                if (!source.startsWith('((') || !source.match(syntax))
                    return;
                var _a = loop_1.loop(combine_1.combine([text_1.text]), closer)(source.slice(2)) || [
                        [],
                        ''
                    ], cs = _a[0], rest = _a[1];
                if (!rest.startsWith('))'))
                    return;
                var el = document.createElement('sup');
                void el.setAttribute('class', 'annotation');
                void el.setAttribute('title', text_1.squash(cs).textContent.trim());
                el.textContent = '*';
                return [
                    [el],
                    rest.slice(2)
                ];
            };
        },
        {
            '../../combinator/combine': 4,
            '../../combinator/loop': 5,
            './text': 35
        }
    ],
    24: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var combine_1 = require('../../combinator/combine');
            var loop_1 = require('../../combinator/loop');
            var plaintext_1 = require('./plaintext');
            var text_1 = require('./text');
            var syntax = /^(`+)[^\n]+?\1/;
            var cache = new Map();
            exports.code = function (source) {
                if (!source.startsWith('`'))
                    return;
                var _a = source.match(syntax) || [
                        '',
                        ''
                    ], whole = _a[0], keyword = _a[1];
                if (!whole)
                    return;
                if (!cache.has(keyword)) {
                    void cache.set(keyword, new RegExp('^' + keyword));
                }
                var _b = loop_1.loop(combine_1.combine([plaintext_1.plaintext]), cache.get(keyword))(source.slice(keyword.length)) || [
                        [],
                        ''
                    ], cs = _b[0], rest = _b[1];
                if (!rest.startsWith(keyword))
                    return;
                var el = document.createElement('code');
                void el.appendChild(text_1.squash(cs));
                el.textContent = el.textContent.trim();
                return [
                    [el],
                    rest.slice(keyword.length)
                ];
            };
        },
        {
            '../../combinator/combine': 4,
            '../../combinator/loop': 5,
            './plaintext': 31,
            './text': 35
        }
    ],
    25: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var inline_1 = require('../inline');
            var combine_1 = require('../../combinator/combine');
            var loop_1 = require('../../combinator/loop');
            var text_1 = require('./text');
            var syntax = /^~~[\s\S]+?~~/;
            var closer = /^~~/;
            exports.deletion = function (source) {
                if (!source.startsWith('~~') || !source.match(syntax))
                    return;
                var _a = loop_1.loop(combine_1.combine([inline_1.inline]), closer)(source.slice(2)) || [
                        [],
                        ''
                    ], cs = _a[0], rest = _a[1];
                if (!rest.startsWith('~~'))
                    return;
                var el = document.createElement('del');
                void el.appendChild(text_1.squash(cs));
                return [
                    [el],
                    rest.slice(2)
                ];
            };
        },
        {
            '../../combinator/combine': 4,
            '../../combinator/loop': 5,
            '../inline': 22,
            './text': 35
        }
    ],
    26: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var inline_1 = require('../inline');
            var combine_1 = require('../../combinator/combine');
            var loop_1 = require('../../combinator/loop');
            var text_1 = require('./text');
            var syntax = /^\*[\s\S]+?\*/;
            var closer = /^\*/;
            exports.emphasis = function (source) {
                if (!source.startsWith('*') || !source.match(syntax))
                    return;
                var _a = loop_1.loop(combine_1.combine([inline_1.inline]), closer)(source.slice(1)) || [
                        [],
                        ''
                    ], cs = _a[0], rest = _a[1];
                if (!rest.startsWith('*'))
                    return;
                var el = document.createElement('em');
                void el.appendChild(text_1.squash(cs));
                return [
                    [el],
                    rest.slice(1)
                ];
            };
        },
        {
            '../../combinator/combine': 4,
            '../../combinator/loop': 5,
            '../inline': 22,
            './text': 35
        }
    ],
    27: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var inline_1 = require('../inline');
            var combine_1 = require('../../combinator/combine');
            var loop_1 = require('../../combinator/loop');
            var plaintext_1 = require('./plaintext');
            var text_1 = require('./text');
            var syntax = /^(<([a-z]+)>)/i;
            var inlinetags = Object.freeze('small|q|cite|code|mark|ruby|rt|rp|bdi|bdo|wbr'.split('|'));
            var cache = new Map();
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
                if (['wbr'].indexOf(tagname.toLowerCase()) !== -1)
                    return [
                        [document.createElement(tagname.toLowerCase())],
                        source.slice(opentag.length)
                    ];
                if (inlinetags.indexOf(tagname.toLowerCase()) === -1)
                    return;
                if (!cache.has(tagname)) {
                    void cache.set(tagname, new RegExp('^</' + tagname + '>', 'i'));
                }
                var _b = tagname.toLowerCase() === 'code' ? loop_1.loop(combine_1.combine([plaintext_1.plaintext]), cache.get(tagname))(source.slice(opentag.length)) || [
                        [],
                        source.slice(opentag.length)
                    ] : loop_1.loop(combine_1.combine([inline_1.inline]), cache.get(tagname))(source.slice(opentag.length)) || [
                        [],
                        source.slice(opentag.length)
                    ], cs = _b[0], rest = _b[1];
                var el = document.createElement(tagname);
                void el.appendChild(text_1.squash(cs));
                var closetag = '</' + tagname + '>';
                return rest.slice(0, closetag.length).toLowerCase() === closetag ? [
                    [el],
                    rest.slice(closetag.length)
                ] : void 0;
            };
        },
        {
            '../../combinator/combine': 4,
            '../../combinator/loop': 5,
            '../inline': 22,
            './plaintext': 31,
            './text': 35
        }
    ],
    28: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var combine_1 = require('../../combinator/combine');
            var loop_1 = require('../../combinator/loop');
            var text_1 = require('./text');
            var url_1 = require('../string/url');
            var syntax = /^!\[[^\n]*?\]\(/;
            exports.image = function (source) {
                if (!source.startsWith('![') || !source.match(syntax))
                    return;
                var _a = loop_1.loop(combine_1.combine([text_1.text]), /^\]\(|^\n/)(source) || [
                        [],
                        ''
                    ], _b = _a[0], first = _b.slice(2), next = _a[1];
                if (!next.startsWith(']('))
                    return;
                var caption = first.reduce(function (s, c) {
                    return s + c.textContent;
                }, '').trim();
                var _c = loop_1.loop(text_1.text, /^\)|^\s/)(next) || [
                        [],
                        ''
                    ], _d = _c[0], second = _d.slice(2), rest = _c[1];
                if (!rest.startsWith(')'))
                    return;
                var url = url_1.sanitize(second.reduce(function (s, c) {
                    return s + c.textContent;
                }, ''));
                if (url === '')
                    return;
                var el = document.createElement('img');
                void el.setAttribute('data-src', url);
                void el.setAttribute('alt', caption);
                return [
                    [el],
                    rest.slice(1)
                ];
            };
        },
        {
            '../../combinator/combine': 4,
            '../../combinator/loop': 5,
            '../string/url': 37,
            './text': 35
        }
    ],
    29: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var inline_1 = require('../inline');
            var combine_1 = require('../../combinator/combine');
            var loop_1 = require('../../combinator/loop');
            var text_1 = require('./text');
            var syntax = /^\+\+[\s\S]+?\+\+/;
            var closer = /^\+\+/;
            exports.insertion = function (source) {
                if (!source.startsWith('++') || !source.match(syntax))
                    return;
                var _a = loop_1.loop(combine_1.combine([inline_1.inline]), closer)(source.slice(2)) || [
                        [],
                        ''
                    ], cs = _a[0], rest = _a[1];
                if (!rest.startsWith('++'))
                    return;
                var el = document.createElement('ins');
                void el.appendChild(text_1.squash(cs));
                return [
                    [el],
                    rest.slice(2)
                ];
            };
        },
        {
            '../../combinator/combine': 4,
            '../../combinator/loop': 5,
            '../inline': 22,
            './text': 35
        }
    ],
    30: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var combine_1 = require('../../combinator/combine');
            var loop_1 = require('../../combinator/loop');
            var image_1 = require('./image');
            var text_1 = require('./text');
            var url_1 = require('../string/url');
            var syntax = /^\[[^\n]*?\]\(/;
            exports.link = function (source) {
                if (!source.startsWith('[') || !source.match(syntax))
                    return;
                var _a = source.startsWith('[]') ? [
                        [],
                        source.slice(1)
                    ] : combine_1.combine([image_1.image])(source.slice(1)) || loop_1.loop(combine_1.combine([text_1.text]), /^\]\(|^\n/)(source.slice(1)) || [
                        [],
                        ''
                    ], first = _a[0], next = _a[1];
                if (!next.startsWith(']('))
                    return;
                var children = text_1.squash(first);
                var _b = loop_1.loop(text_1.text, /^\)|^\s(?!nofollow)/)(next) || [
                        [],
                        ''
                    ], _c = _b[0], second = _c.slice(2), rest = _b[1];
                if (!rest.startsWith(')'))
                    return;
                var _d = second.reduce(function (s, c) {
                        return s + c.textContent;
                    }, '').split(/\s/), INSECURE_URL = _d[0], nofollow = _d[1];
                var url = url_1.sanitize(INSECURE_URL);
                if (url === '')
                    return;
                var el = document.createElement('a');
                void el.setAttribute('href', url);
                if (location.protocol !== el.protocol || location.host !== el.host) {
                    void el.setAttribute('target', '_blank');
                }
                if (nofollow) {
                    void el.setAttribute('rel', 'nofollow');
                }
                void el.appendChild(children.querySelector('img') || document.createTextNode((children.textContent || url).trim()));
                return [
                    [el],
                    rest.slice(1)
                ];
            };
        },
        {
            '../../combinator/combine': 4,
            '../../combinator/loop': 5,
            '../string/url': 37,
            './image': 28,
            './text': 35
        }
    ],
    31: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var separator = /`|<\/code>|\n/i;
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
    32: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var inline_1 = require('../inline');
            var combine_1 = require('../../combinator/combine');
            var loop_1 = require('../../combinator/loop');
            var text_1 = require('./text');
            var syntax = /^\*\*[\s\S]+?\*\*/;
            var closer = /^\*\*/;
            exports.strong = function (source) {
                if (!source.startsWith('**') || !source.match(syntax))
                    return;
                var _a = loop_1.loop(combine_1.combine([inline_1.inline]), closer)(source.slice(2)) || [
                        [],
                        ''
                    ], cs = _a[0], rest = _a[1];
                if (!rest.startsWith('**'))
                    return;
                var el = document.createElement('strong');
                void el.appendChild(text_1.squash(cs));
                return [
                    [el],
                    rest.slice(2)
                ];
            };
        },
        {
            '../../combinator/combine': 4,
            '../../combinator/loop': 5,
            '../inline': 22,
            './text': 35
        }
    ],
    33: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var combine_1 = require('../../combinator/combine');
            var loop_1 = require('../../combinator/loop');
            var text_1 = require('./text');
            var syntax = /^~\S[^\n]*?~/;
            var closer = /^~|^\n/;
            exports.subscript = function (source) {
                if (!source.startsWith('~') || !source.match(syntax))
                    return;
                var _a = loop_1.loop(combine_1.combine([text_1.text]), closer)(source.slice(1)) || [
                        [],
                        ''
                    ], cs = _a[0], rest = _a[1];
                if (!rest.startsWith('~'))
                    return;
                var el = document.createElement('sub');
                void el.appendChild(text_1.squash(cs));
                if (el.textContent && el.textContent !== el.textContent.trim())
                    return;
                return [
                    [el],
                    rest.slice(1)
                ];
            };
        },
        {
            '../../combinator/combine': 4,
            '../../combinator/loop': 5,
            './text': 35
        }
    ],
    34: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var combine_1 = require('../../combinator/combine');
            var loop_1 = require('../../combinator/loop');
            var text_1 = require('./text');
            var syntax = /^\^\S[^\n]*?\^/;
            var closer = /^\^|^\n/;
            exports.superscript = function (source) {
                if (!source.startsWith('^') || !source.match(syntax))
                    return;
                var _a = loop_1.loop(combine_1.combine([text_1.text]), closer)(source.slice(1)) || [
                        [],
                        ''
                    ], cs = _a[0], rest = _a[1];
                if (!rest.startsWith('^'))
                    return;
                var el = document.createElement('sup');
                void el.appendChild(text_1.squash(cs));
                if (el.textContent && el.textContent !== el.textContent.trim())
                    return;
                return [
                    [el],
                    rest.slice(1)
                ];
            };
        },
        {
            '../../combinator/combine': 4,
            '../../combinator/loop': 5,
            './text': 35
        }
    ],
    35: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var separator = /[!~^+*`<>\[\]\(\)\|\s\n\\]/;
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
                            [],
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
            function squash(nodes) {
                var frag = document.createDocumentFragment();
                for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
                    var curr = nodes_1[_i];
                    var prev = frag.lastChild;
                    if (prev && prev.nodeType === 3 && curr.nodeType === 3) {
                        prev.textContent += curr.textContent;
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
    36: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var pretext_1 = require('../parser/block/pretext');
            var extension_1 = require('../parser/block/extension');
            var combine_1 = require('../combinator/combine');
            var syntax = /^(?:\s*?\n)+|^(?:[^\n]*\n)+?\s*?\n/;
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
            '../combinator/combine': 4,
            '../parser/block/extension': 11,
            '../parser/block/pretext': 19
        }
    ],
    37: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            function sanitize(url) {
                url = url.trim();
                try {
                    url = encodeURI(decodeURI(url));
                } catch (e) {
                    url = '';
                    console.error(e);
                }
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
    38: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var parser_1 = require('../parser');
            var segment_1 = require('../parser/segment');
            function bind(el, source) {
                if (source === void 0) {
                    source = '';
                }
                var pairs = [];
                void segment_1.segment(source).reduce(function (el, s) {
                    return void pairs.push([
                        s,
                        Array.from(parser_1.parse(s).childNodes)
                    ]), void pairs[pairs.length - 1][1].forEach(function (e) {
                        return void el.appendChild(e);
                    }), el;
                }, el);
                return function (source) {
                    var os = pairs.map(function (_a) {
                        var s = _a[0];
                        return s;
                    });
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
                    if (os.length === i && ns.length === i)
                        return;
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
                    return void pairs.splice.apply(pairs, [
                        i,
                        0
                    ].concat(ns.slice(i, ns.length - j).map(function (s) {
                        return [
                            s,
                            Array.from(parser_1.parse(s).childNodes).map(function (e) {
                                return el.insertBefore(e, ref);
                            })
                        ];
                    })));
                };
            }
            exports.bind = bind;
        },
        {
            '../parser': 7,
            '../parser/segment': 36
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
            __export(require('./src/export'));
        },
        { './src/export': 6 }
    ]
}, {}, [
    1,
    2,
    'securemark',
    3
]);