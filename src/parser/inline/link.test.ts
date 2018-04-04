﻿import { link } from './link';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/link', () => {
  describe('link', () => {
    const parser = some(link);

    it('xss', () => {
      assert.deepStrictEqual(inspect(parser('[](javascript:alert)')), undefined);
      assert.deepStrictEqual(inspect(parser('[](vbscript:alert)')), undefined);
      assert.deepStrictEqual(inspect(parser('[](data:text/html;base64,PHNjcmlwdD5hbGVydCgnWFNTJyk8L3NjcmlwdD4K)')), undefined);
      assert.deepStrictEqual(inspect(parser('[](any:alert)')), undefined);
      assert.deepStrictEqual(inspect(parser('[](#")')), [['<a href="#&quot;" rel="noopener">#"</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[](#\\)')), undefined);
      assert.deepStrictEqual(inspect(parser('[](")')), [['<a href="&quot;" rel="noopener">"</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[]("#)')), [['<a href="&quot;#" rel="noopener">"#</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[]("\\)')), undefined);
      assert.deepStrictEqual(inspect(parser('[](\\)')), undefined);
      assert.deepStrictEqual(inspect(parser('[](#)')), [['<a href="#" rel="noopener">#</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[](\\")')), [['<a href="&quot;" rel="noopener">"</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[](\\\\)')), [['<a href="\\" rel="noopener">\\</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[](\\\\#)')), [['<a href="\\#" rel="noopener">\\#</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[](\\\\")')), [['<a href="\\&quot;" rel="noopener">\\"</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[<img>](#)')), [['<a href="#" rel="noopener">&lt;img&gt;</a>'], '']);
    });

    it('fishing', () => {
      assert.deepStrictEqual(inspect(parser('[http://host](http://evil)')), undefined);
      assert.deepStrictEqual(inspect(parser('[ http://host ](http://evil)')), undefined);
      assert.deepStrictEqual(inspect(parser('[_http://host](http://evil)')), undefined);
    });

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('[]( )')), undefined);
      assert.deepStrictEqual(inspect(parser('[](# )')), undefined);
      assert.deepStrictEqual(inspect(parser('[]( #)')), undefined);
      assert.deepStrictEqual(inspect(parser('[]( # )')), undefined);
      assert.deepStrictEqual(inspect(parser('[](()')), undefined);
      assert.deepStrictEqual(inspect(parser('[](a\nb)')), undefined);
      assert.deepStrictEqual(inspect(parser('[](a\\\nb)')), undefined);
      assert.deepStrictEqual(inspect(parser('[](\nnofollow)')), undefined);
      assert.deepStrictEqual(inspect(parser('[]((\n))')), undefined);
      assert.deepStrictEqual(inspect(parser('[ ]()')), undefined);
      assert.deepStrictEqual(inspect(parser('[ ]( )')), undefined);
      assert.deepStrictEqual(inspect(parser('[]](#)')), undefined);
      assert.deepStrictEqual(inspect(parser('[a\nb](ab)')), undefined);
      assert.deepStrictEqual(inspect(parser('[a\\\nb](ab)')), undefined);
      assert.deepStrictEqual(inspect(parser('[*a\\](\nb*](ab)')), undefined);
      assert.deepStrictEqual(inspect(parser('[。\n！](ab)')), undefined);
      assert.deepStrictEqual(inspect(parser('![](#)')), undefined);
    });

    it('ab', () => {
      assert.deepStrictEqual(inspect(parser('[]()')), [[`<a href="" rel="noopener">${location.href}</a>`], '']);
      assert.deepStrictEqual(inspect(parser('[](b)')), [['<a href="b" rel="noopener">b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[](b\\ )')), [['<a href="b%20" rel="noopener">b%20</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[](\\ )')), [[`<a href="%20" rel="noopener">%20</a>`], '']);
      assert.deepStrictEqual(inspect(parser('[](?b=c+d&\\ #)')), [['<a href="?b=c+d&amp;%20#" rel="noopener">?b=c+d&amp;%20#</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[](?&amp;)')), [['<a href="?&amp;amp;" rel="noopener">?&amp;amp;</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[a]()')), [['<a href="" rel="noopener">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[a](b)')), [['<a href="b" rel="noopener">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[a b](c)')), [['<a href="c" rel="noopener">a b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[a ]()')), [['<a href="" rel="noopener">a </a>'], '']);
      assert.deepStrictEqual(inspect(parser('[ a]()')), [['<a href="" rel="noopener"> a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[ a ]()')), [['<a href="" rel="noopener"> a </a>'], '']);
    });

    it('image', () => {
      assert.deepStrictEqual(inspect(parser('[![](#) ](#)')), undefined);
      assert.deepStrictEqual(inspect(parser('[ ![](#)](#)')), undefined);
      assert.deepStrictEqual(inspect(parser('[ ![](#) ](#)')), undefined);
      assert.deepStrictEqual(inspect(parser('[![](#)#](#)')), undefined);
      assert.deepStrictEqual(inspect(parser('[#![](#)](#)')), undefined);
      assert.deepStrictEqual(inspect(parser('[![](#)![](#)](#)')), undefined);
      assert.deepStrictEqual(inspect(parser('[![a](b)](#)')), [['<a href="#" rel="noopener" target="_blank"><img class="media" data-src="b" alt="a"></a>'], '']);
      assert.deepStrictEqual(inspect(parser('[*![a](b)c*](#)')), undefined);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('[](#())')), [['<a href="#()" rel="noopener">#()</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[](#(()))')), [['<a href="#(())" rel="noopener">#(())</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[](#(a(b)()(c)d))')), [['<a href="#(a(b)()(c)d)" rel="noopener">#(a(b)()(c)d)</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[[](#)](#)')), undefined);
      assert.deepStrictEqual(inspect(parser('[((#))](#)')), undefined);
      assert.deepStrictEqual(inspect(parser('[<wbr>](#)')), undefined);
      assert.deepStrictEqual(inspect(parser('[http://host](#)')), undefined);
      assert.deepStrictEqual(inspect(parser('[http://host](http://host)')), undefined);
      assert.deepStrictEqual(inspect(parser('[\\[](#)')), [['<a href="#" rel="noopener">[</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[\\]](#)')), [['<a href="#" rel="noopener">]</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[](#\\()')), [['<a href="#(" rel="noopener">#(</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[](#\\))')), [['<a href="#)" rel="noopener">#)</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[*#*](#)')), [['<a href="#" rel="noopener"><em>#</em></a>'], '']);
      assert.deepStrictEqual(inspect(parser('[<wbr>"]("?"#")')), [['<a href="&quot;?&quot;#&quot;" rel="noopener"><wbr>"</a>'], '']);
    });

    it('external', () => {
      assert.deepStrictEqual(inspect(parser('[](//host)')), [['<a href="//host" rel="noopener" target="_blank">//host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[](//[::])')), [['<a href="//[::]" rel="noopener" target="_blank">//[::]</a>'], '']);
    });

    it('nofollow', () => {
      assert.deepStrictEqual(inspect(parser('[](# #)')), undefined);
      assert.deepStrictEqual(inspect(parser('[](# nofollow )')), undefined);
      assert.deepStrictEqual(inspect(parser('[](#  nofollow)')), undefined);
      assert.deepStrictEqual(inspect(parser('[]( nofollow)')), [[`<a href="" rel="noopener nofollow noreferrer">${location.href.slice(1)}</a>`], '']);
      assert.deepStrictEqual(inspect(parser('[](# nofollow)')), [['<a href="#" rel="noopener nofollow noreferrer">#</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[](\\  nofollow)')), [['<a href="%20" rel="noopener nofollow noreferrer">%20</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[](http://host nofollow)')), [['<a href="http://host" rel="noopener nofollow noreferrer" target="_blank">ttp://host</a>'], '']);
    });

  });

});
