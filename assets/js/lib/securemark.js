/*! securemark v0.3.1 https://github.com/falsandtru/securemark | (c) 2017, falsandtru | Apache-2.0 License */
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
            var syntax_1 = require('./syntax');
            exports.parse = syntax_1.parse;
            var view_1 = require('./view');
            exports.bind = view_1.bind;
        },
        {
            './syntax': 7,
            './view': 32
        }
    ],
    5: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            function compose(parsers) {
                return function (source) {
                    var rest = source;
                    var results = [];
                    for (var _i = 0, parsers_1 = parsers; _i < parsers_1.length; _i++) {
                        var parse = parsers_1[_i];
                        var r = parse(source);
                        if (!r)
                            continue;
                        void results.push.apply(results, r[0]);
                        rest = r[1];
                        break;
                    }
                    return source.length === rest.length ? void 0 : [
                        results,
                        rest
                    ];
                };
            }
            exports.compose = compose;
        },
        {}
    ],
    6: [
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
                        var r = parser(rest);
                        if (!r)
                            break;
                        void results.push.apply(results, r[0]);
                        rest = r[1];
                        if (until && rest.slice(0, 99).search(until) === 0)
                            break;
                    }
                    return source.length === rest.length ? void 0 : [
                        results,
                        rest
                    ];
                };
            }
            exports.loop = loop;
        },
        {}
    ],
    7: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var parser_1 = require('./syntax/parser');
            exports.parse = parser_1.parse;
        },
        { './syntax/parser': 30 }
    ],
    8: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var compose_1 = require('../parser/compose');
            var newline_1 = require('./block/newline');
            var horizontalrule_1 = require('./block/horizontalrule');
            var header_1 = require('./block/header');
            var ulist_1 = require('./block/ulist');
            var olist_1 = require('./block/olist');
            var table_1 = require('./block/table');
            var blockquote_1 = require('./block/blockquote');
            var pretext_1 = require('./block/pretext');
            var paragraph_1 = require('./block/paragraph');
            exports.block = compose_1.compose([
                newline_1.newline,
                horizontalrule_1.horizontalrule,
                header_1.header,
                ulist_1.ulist,
                olist_1.olist,
                table_1.table,
                blockquote_1.blockquote,
                pretext_1.pretext,
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
            '../parser/compose': 5,
            './block/blockquote': 9,
            './block/header': 10,
            './block/horizontalrule': 11,
            './block/newline': 13,
            './block/olist': 14,
            './block/paragraph': 15,
            './block/pretext': 16,
            './block/table': 17,
            './block/ulist': 18
        }
    ],
    9: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var block_1 = require('../block');
            var compose_1 = require('../../parser/compose');
            var loop_1 = require('../../parser/loop');
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
                    void bottom.appendChild(text_1.squash((loop_1.loop(compose_1.compose([plaintext_1.plaintext]))(line[0] === '>' ? line.slice(indent.length + diff).trim() : line.trim()) || [[]])[0]));
                    if (!bottom.lastChild || !bottom.lastChild.textContent)
                        return;
                    indent = indent[0].repeat(indent.length + diff);
                    source = source.slice(line.length + 1);
                }
                return bottom.childNodes.length === 0 ? void 0 : block_1.consumeBlockEndEmptyLine([top], source);
            };
        },
        {
            '../../parser/compose': 5,
            '../../parser/loop': 6,
            '../block': 8,
            '../inline/plaintext': 26,
            '../inline/text': 29
        }
    ],
    10: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var block_1 = require('../block');
            var compose_1 = require('../../parser/compose');
            var loop_1 = require('../../parser/loop');
            var inline_1 = require('../inline');
            var text_1 = require('../inline/text');
            var syntax = /^(#{1,6})\s+?([^\n]+)/;
            exports.header = function (source) {
                var _a = source.match(syntax) || [
                        '',
                        '',
                        ''
                    ], whole = _a[0], level = _a[1].length, title = _a[2];
                if (!whole)
                    return;
                var children = (loop_1.loop(compose_1.compose([inline_1.inline]))(title) || [
                    [],
                    ''
                ])[0];
                var el = document.createElement('h' + level);
                void el.appendChild(text_1.squash(children));
                return block_1.consumeBlockEndEmptyLine([el], source.slice(whole.length + 1));
            };
        },
        {
            '../../parser/compose': 5,
            '../../parser/loop': 6,
            '../block': 8,
            '../inline': 19,
            '../inline/text': 29
        }
    ],
    11: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var block_1 = require('../block');
            var syntax = /^[ \t]*-[ \t]*-[ \t]*(?:-[ \t]*)+(?:\n|$)/;
            exports.horizontalrule = function (source) {
                var whole = (source.match(syntax) || [''])[0];
                if (!whole)
                    return;
                return block_1.consumeBlockEndEmptyLine([document.createElement('hr')], source.slice(whole.length));
            };
        },
        { '../block': 8 }
    ],
    12: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var syntax = /^([ \t]*)/;
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
        },
        {}
    ],
    13: [
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
    14: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var block_1 = require('../block');
            var compose_1 = require('../../parser/compose');
            var loop_1 = require('../../parser/loop');
            var ulist_1 = require('./ulist');
            var indent_1 = require('./indent');
            var inline_1 = require('../inline');
            var text_1 = require('../inline/text');
            var syntax = /^([0-9]+)\./;
            exports.olist = function (source) {
                var _a = source.match(syntax) || [
                        '',
                        ''
                    ], whole = _a[0], index = _a[1];
                if (!whole)
                    return;
                var el = document.createElement('ol');
                void el.setAttribute('start', +index > 0 ? index : '1');
                while (true) {
                    var line = source.split('\n', 1)[0];
                    switch (line[0]) {
                    case (source.match(syntax) || [
                            '',
                            ''
                        ])[1][0] || '': {
                            var text = line.slice(line.indexOf('.') + 1);
                            if (text.length > 0 && text[0].trim() !== '')
                                return;
                            var li = document.createElement('li');
                            if (text.trim() !== '') {
                                void li.appendChild(text_1.squash((loop_1.loop(compose_1.compose([inline_1.inline]))(text.trim()) || [[]])[0]));
                            }
                            void el.appendChild(li);
                            source = source.slice(line.length + 1);
                            continue;
                        }
                    case ' ':
                    case '\t': {
                            if (line.trim() === '')
                                break;
                            if (el.lastElementChild.lastElementChild && [
                                    'ul',
                                    'ol'
                                ].indexOf(el.lastElementChild.lastElementChild.tagName.toLowerCase()) !== -1)
                                return;
                            var _b = indent_1.indent(source), block = _b[0], rest = _b[1];
                            if (rest === source)
                                return;
                            var _c = compose_1.compose([
                                    ulist_1.ulist,
                                    exports.olist
                                ])(block) || [
                                    [],
                                    ''
                                ], children = _c[0], brest = _c[1];
                            if (children.length === 0 || brest)
                                return;
                            void el.lastElementChild.appendChild(text_1.squash(children));
                            source = rest;
                            continue;
                        }
                    }
                    break;
                }
                return el.children.length === 0 ? void 0 : block_1.consumeBlockEndEmptyLine([el], source);
            };
        },
        {
            '../../parser/compose': 5,
            '../../parser/loop': 6,
            '../block': 8,
            '../inline': 19,
            '../inline/text': 29,
            './indent': 12,
            './ulist': 18
        }
    ],
    15: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var block_1 = require('../block');
            var compose_1 = require('../../parser/compose');
            var loop_1 = require('../../parser/loop');
            var inline_1 = require('../inline');
            var text_1 = require('../inline/text');
            var closer = /^\n\s*?\n/;
            exports.paragraph = function (source) {
                if (source.startsWith('\n') || source.match(closer))
                    return;
                var el = document.createElement('p');
                var _a = loop_1.loop(compose_1.compose([inline_1.inline]), closer)(source.trim()) || [
                        [],
                        ''
                    ], cs = _a[0], rest = _a[1];
                void el.appendChild(text_1.squash(cs));
                return el.childNodes.length === 0 ? void 0 : block_1.consumeBlockEndEmptyLine([el], rest.slice(1));
            };
        },
        {
            '../../parser/compose': 5,
            '../../parser/loop': 6,
            '../block': 8,
            '../inline': 19,
            '../inline/text': 29
        }
    ],
    16: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var block_1 = require('../block');
            var compose_1 = require('../../parser/compose');
            var loop_1 = require('../../parser/loop');
            var plaintext_1 = require('../inline/plaintext');
            var text_1 = require('../inline/text');
            var syntax = /^```([0-9a-z]+)?[ \t]*\n/;
            var closer = /^```\s*(?:\n|$)/;
            exports.pretext = function (source) {
                var _a = source.match(syntax) || [
                        '',
                        ''
                    ], whole = _a[0], lang = _a[1];
                if (!whole)
                    return;
                var el = document.createElement('pre');
                if (lang) {
                    void el.setAttribute('class', 'lang-' + lang.toLowerCase());
                }
                source = source.slice(whole.length);
                while (true) {
                    var line = source.split('\n', 1)[0];
                    if (line.match(closer))
                        break;
                    void el.appendChild(text_1.squash((loop_1.loop(compose_1.compose([plaintext_1.plaintext]))(line + '\n') || [[]])[0]));
                    source = source.slice(line.length + 1);
                    if (source === '')
                        return;
                }
                if (el.lastChild) {
                    el.lastChild.textContent = el.lastChild.textContent.slice(0, -1);
                }
                return block_1.consumeBlockEndEmptyLine([el], source.replace(closer, ''));
            };
        },
        {
            '../../parser/compose': 5,
            '../../parser/loop': 6,
            '../block': 8,
            '../inline/plaintext': 26,
            '../inline/text': 29
        }
    ],
    17: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var block_1 = require('../block');
            var loop_1 = require('../../parser/loop');
            var inline_1 = require('../inline');
            var text_1 = require('../inline/text');
            var syntax = /^(\|[^\n]*)+?\|\s*\n/;
            var align = /^:?-+:?$/;
            exports.table = function (source) {
                if (!source.match(syntax))
                    return;
                var table = document.createElement('table');
                var _a = parse(source) || [
                        [],
                        ''
                    ], headers = _a[0], hrest = _a[1];
                source = hrest;
                if (headers.length === 0)
                    return;
                var _b = parse(source) || [
                        [],
                        ''
                    ], aligns_ = _b[0], arest = _b[1];
                source = arest;
                if (aligns_.length !== headers.length)
                    return;
                if (aligns_.some(function (e) {
                        return !e.textContent || !e.textContent.match(align);
                    }))
                    return;
                var aligns = aligns_.map(function (e) {
                    return e.textContent;
                }).map(function (s) {
                    return s[0] === ':' ? s[s.length - 1] === ':' ? 'center' : 'left' : s[s.length - 1] === ':' ? 'right' : '';
                });
                void table.appendChild(document.createElement('thead'));
                void append(headers, table, []);
                void table.appendChild(document.createElement('tbody'));
                while (true) {
                    var line = source.split('\n', 1)[0];
                    var _c = parse(line) || [
                            [],
                            ''
                        ], cols = _c[0], rest = _c[1];
                    if (cols.length !== headers.length || rest !== '')
                        break;
                    void append(cols, table, aligns);
                    source = source.slice(line.length + 1);
                }
                return table.lastElementChild.children.length === 0 ? void 0 : block_1.consumeBlockEndEmptyLine([table], source);
            };
            function append(cols, table, aligns) {
                return void cols.map(function (h, i) {
                    var td = document.createElement('td');
                    void td.setAttribute('align', aligns[i] || '');
                    void td.appendChild(h);
                    return td;
                }).reduce(function (tr, td) {
                    return void tr.appendChild(td), tr;
                }, table.lastChild.appendChild(document.createElement('tr')));
            }
            function parse(source) {
                var cols = [];
                while (true) {
                    var result = source.startsWith('||') ? [
                        [],
                        source.slice(1)
                    ] : source[0] === '|' && source.length > 1 ? loop_1.loop(inline_1.inline, /^\|/)(source.slice(1)) : void 0;
                    if (!result)
                        return;
                    var col = result[0], rest = result[1];
                    source = rest;
                    void cols.push(text_1.squash(col));
                    var end = (rest.match(/^(\|\s*?(?:\n|$))/) || [''])[0];
                    if (end)
                        return [
                            cols,
                            rest.slice(end.length)
                        ];
                }
            }
        },
        {
            '../../parser/loop': 6,
            '../block': 8,
            '../inline': 19,
            '../inline/text': 29
        }
    ],
    18: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var block_1 = require('../block');
            var compose_1 = require('../../parser/compose');
            var loop_1 = require('../../parser/loop');
            var olist_1 = require('./olist');
            var indent_1 = require('./indent');
            var inline_1 = require('../inline');
            var text_1 = require('../inline/text');
            var syntax = /^-/;
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
                    switch (line[0]) {
                    case '-': {
                            var text = line.slice(1);
                            if (text.length > 0 && text[0].trim() !== '')
                                return;
                            var li = document.createElement('li');
                            if (text.trim() !== '') {
                                void li.appendChild(text_1.squash((loop_1.loop(compose_1.compose([inline_1.inline]))(text.trim()) || [[]])[0]));
                            }
                            void el.appendChild(li);
                            source = source.slice(line.length + 1);
                            continue;
                        }
                    case ' ':
                    case '\t': {
                            if (line.trim() === '')
                                break;
                            if (el.lastElementChild.lastElementChild && [
                                    'ul',
                                    'ol'
                                ].indexOf(el.lastElementChild.lastElementChild.tagName.toLowerCase()) !== -1)
                                return;
                            var _a = indent_1.indent(source), block = _a[0], rest = _a[1];
                            if (rest === source)
                                return;
                            var _b = compose_1.compose([
                                    exports.ulist,
                                    olist_1.olist
                                ])(block) || [
                                    [],
                                    ''
                                ], children = _b[0], brest = _b[1];
                            if (children.length === 0 || brest)
                                return;
                            void el.lastElementChild.appendChild(text_1.squash(children));
                            source = rest;
                            continue;
                        }
                    }
                    break;
                }
                return el.children.length === 0 ? void 0 : block_1.consumeBlockEndEmptyLine([el], source);
            };
        },
        {
            '../../parser/compose': 5,
            '../../parser/loop': 6,
            '../block': 8,
            '../inline': 19,
            '../inline/text': 29,
            './indent': 12,
            './olist': 14
        }
    ],
    19: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var compose_1 = require('../parser/compose');
            var strike_1 = require('./inline/strike');
            var strong_1 = require('./inline/strong');
            var emphasis_1 = require('./inline/emphasis');
            var code_1 = require('./inline/code');
            var image_1 = require('./inline/image');
            var link_1 = require('./inline/link');
            var annotation_1 = require('./inline/annotation');
            var html_1 = require('./inline/html');
            var text_1 = require('./inline/text');
            exports.inline = compose_1.compose([
                strike_1.strike,
                strong_1.strong,
                emphasis_1.emphasis,
                code_1.code,
                image_1.image,
                link_1.link,
                annotation_1.annotation,
                html_1.html,
                text_1.text
            ]);
        },
        {
            '../parser/compose': 5,
            './inline/annotation': 20,
            './inline/code': 21,
            './inline/emphasis': 22,
            './inline/html': 23,
            './inline/image': 24,
            './inline/link': 25,
            './inline/strike': 27,
            './inline/strong': 28,
            './inline/text': 29
        }
    ],
    20: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var compose_1 = require('../../parser/compose');
            var loop_1 = require('../../parser/loop');
            var text_1 = require('./text');
            var syntax = /^\(\([\s\S]+?\)\)/;
            exports.annotation = function (source) {
                if (!source.startsWith('((') || source.startsWith('(((') || !source.match(syntax))
                    return;
                var _a = loop_1.loop(compose_1.compose([text_1.text]), /^\)\)/)(source.slice(2)) || [
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
            '../../parser/compose': 5,
            '../../parser/loop': 6,
            './text': 29
        }
    ],
    21: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var compose_1 = require('../../parser/compose');
            var loop_1 = require('../../parser/loop');
            var plaintext_1 = require('./plaintext');
            var text_1 = require('./text');
            var syntax = /^([\`]+)[\S\s]+?\1/;
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
                var _b = loop_1.loop(compose_1.compose([plaintext_1.plaintext]), cache.get(keyword))(source.slice(keyword.length)) || [
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
            '../../parser/compose': 5,
            '../../parser/loop': 6,
            './plaintext': 26,
            './text': 29
        }
    ],
    22: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var inline_1 = require('../inline');
            var compose_1 = require('../../parser/compose');
            var loop_1 = require('../../parser/loop');
            var text_1 = require('./text');
            var syntax = /^\*[\s\S]+?\*/;
            var closer = /\*/;
            exports.emphasis = function (source) {
                if (!source.startsWith('*') || source.startsWith('**') || !source.match(syntax))
                    return;
                var _a = loop_1.loop(compose_1.compose([inline_1.inline]), closer)(source.slice(1)) || [
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
            '../../parser/compose': 5,
            '../../parser/loop': 6,
            '../inline': 19,
            './text': 29
        }
    ],
    23: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var inline_1 = require('../inline');
            var compose_1 = require('../../parser/compose');
            var loop_1 = require('../../parser/loop');
            var plaintext_1 = require('./plaintext');
            var text_1 = require('./text');
            var syntax = /^(<([a-z]+)>)/i;
            var inlinetags = Object.freeze('small|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|u|mark|ruby|rt|rp|bdi|bdo|ins|del'.split('|'));
            var cache = new Map();
            exports.html = function (source) {
                if (!source.startsWith('<') || source.startsWith('<<'))
                    return;
                var _a = source.match(syntax) || [
                        '',
                        '',
                        ''
                    ], whole = _a[0], opentag = _a[1], tagname = _a[2];
                if (!whole)
                    return;
                if (inlinetags.indexOf(tagname.toLowerCase()) === -1)
                    return;
                if (!cache.has(tagname)) {
                    void cache.set(tagname, new RegExp('^</' + tagname + '>', 'i'));
                }
                var _b = tagname.toLowerCase() === 'code' ? loop_1.loop(compose_1.compose([plaintext_1.plaintext]), cache.get(tagname))(source.slice(opentag.length)) || [
                        [],
                        source.slice(opentag.length)
                    ] : loop_1.loop(compose_1.compose([inline_1.inline]), cache.get(tagname))(source.slice(opentag.length)) || [
                        [],
                        source.slice(opentag.length)
                    ], cs = _b[0], rest = _b[1];
                var el = document.createElement(tagname);
                void el.appendChild(text_1.squash(cs));
                var closetag = '</' + tagname + '>';
                var closed = rest.slice(0, closetag.length).toLowerCase() === closetag.toLowerCase();
                return [
                    [el],
                    rest.slice(closed ? closetag.length : 0)
                ];
            };
        },
        {
            '../../parser/compose': 5,
            '../../parser/loop': 6,
            '../inline': 19,
            './plaintext': 26,
            './text': 29
        }
    ],
    24: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var compose_1 = require('../../parser/compose');
            var loop_1 = require('../../parser/loop');
            var text_1 = require('./text');
            var url_1 = require('../string/url');
            var syntax = /^!\[[^\n]*?\]\(/;
            exports.image = function (source) {
                if (!source.startsWith('![') || !source.match(syntax))
                    return;
                var _a = loop_1.loop(compose_1.compose([text_1.text]), /^\]|^\n/)(source) || [
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
            '../../parser/compose': 5,
            '../../parser/loop': 6,
            '../string/url': 31,
            './text': 29
        }
    ],
    25: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var compose_1 = require('../../parser/compose');
            var loop_1 = require('../../parser/loop');
            var image_1 = require('./image');
            var text_1 = require('./text');
            var url_1 = require('../string/url');
            var syntax = /^\[[^\n]*?\]\(/;
            exports.link = function (source) {
                if (!source.startsWith('[') || source.startsWith('[[') || !source.match(syntax))
                    return;
                var _a = source.startsWith('[]') ? [
                        [],
                        source.slice(1)
                    ] : compose_1.compose([image_1.image])(source.slice(1)) || loop_1.loop(compose_1.compose([text_1.text]), /^\]|^\n/)(source.slice(1)) || [
                        [],
                        ''
                    ], first = _a[0], next = _a[1];
                if (!next.startsWith(']('))
                    return;
                var children = text_1.squash(first);
                var _b = loop_1.loop(text_1.text, /^\)|^\s(?!nofollow\))/)(next) || [
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
            '../../parser/compose': 5,
            '../../parser/loop': 6,
            '../string/url': 31,
            './image': 24,
            './text': 29
        }
    ],
    26: [
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
    27: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var inline_1 = require('../inline');
            var compose_1 = require('../../parser/compose');
            var loop_1 = require('../../parser/loop');
            var text_1 = require('./text');
            var syntax = /^~~[\s\S]+?~~/;
            var closer = /^~~/;
            exports.strike = function (source) {
                if (!source.startsWith('~~') || source.startsWith('~~~') || !source.match(syntax))
                    return;
                var _a = loop_1.loop(compose_1.compose([inline_1.inline]), closer)(source.slice(2)) || [
                        [],
                        ''
                    ], cs = _a[0], rest = _a[1];
                if (!rest.startsWith('~~'))
                    return;
                var el = document.createElement('s');
                void el.appendChild(text_1.squash(cs));
                return [
                    [el],
                    rest.slice(2)
                ];
            };
        },
        {
            '../../parser/compose': 5,
            '../../parser/loop': 6,
            '../inline': 19,
            './text': 29
        }
    ],
    28: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var inline_1 = require('../inline');
            var compose_1 = require('../../parser/compose');
            var loop_1 = require('../../parser/loop');
            var text_1 = require('./text');
            var syntax = /^\*\*[\s\S]+?\*\*/;
            var closer = /^\*\*/;
            exports.strong = function (source) {
                if (!source.startsWith('**') || source.startsWith('****') || !source.match(syntax))
                    return;
                var _a = loop_1.loop(compose_1.compose([inline_1.inline]), closer)(source.slice(2)) || [
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
            '../../parser/compose': 5,
            '../../parser/loop': 6,
            '../inline': 19,
            './text': 29
        }
    ],
    29: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var separator = /[!~*`<>\[\]\(\)\|\s\n\\]/;
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
    30: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var loop_1 = require('../parser/loop');
            var block_1 = require('./block');
            function parse(source) {
                return Array.from((loop_1.loop(block_1.block)(source) || [[]])[0]).reduce(function (doc, el) {
                    return void doc.appendChild(el), doc;
                }, document.createDocumentFragment());
            }
            exports.parse = parse;
        },
        {
            '../parser/loop': 6,
            './block': 8
        }
    ],
    31: [
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
    32: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var bind_1 = require('./view/bind');
            exports.bind = bind_1.bind;
        },
        { './view/bind': 33 }
    ],
    33: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var syntax_1 = require('../syntax');
            var segment_1 = require('./segment');
            function bind(el, source) {
                if (source === void 0) {
                    source = '';
                }
                var pairs = [];
                void segment_1.segment(source).reduce(function (el, s) {
                    return void pairs.push([
                        s,
                        Array.from(syntax_1.parse(s).children)
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
                            Array.from(syntax_1.parse(s).children).map(function (e) {
                                return el.insertBefore(e, ref);
                            })
                        ];
                    })));
                };
            }
            exports.bind = bind;
        },
        {
            '../syntax': 7,
            './segment': 34
        }
    ],
    34: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var pretext_1 = require('../syntax/block/pretext');
            var compose_1 = require('../parser/compose');
            var loop_1 = require('../parser/loop');
            function segment(source) {
                var segments = [];
                while (true) {
                    var _a = loop_1.loop(compose_1.compose([pretext_1.pretext]))(source) || block(source), rest = _a[1];
                    void segments.push(source.slice(0, source.length - rest.length));
                    source = source.slice(source.length - rest.length);
                    source = rest;
                    if (source === '')
                        break;
                }
                return segments;
            }
            exports.segment = segment;
            var syntax = /^(?:[^\n]+\n)+\s*?\n|^(?:[ \t]*\n)+|^.*\n(?=```)/;
            function block(source) {
                return [
                    [],
                    source.slice((source.match(syntax) || [source])[0].length)
                ];
            }
        },
        {
            '../parser/compose': 5,
            '../parser/loop': 6,
            '../syntax/block/pretext': 16
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
        { './src/export': 4 }
    ]
}, {}, [
    1,
    2,
    'securemark',
    3
]);