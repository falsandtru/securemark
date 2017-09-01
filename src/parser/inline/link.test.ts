import { loop } from '../../combinator/loop';
import { link } from './link';
import { inspect } from '../debug.test';

describe('Unit: parser/inline/link', () => {
  describe('link', () => {
    const parser = loop(link);

    it('xss', () => {
      assert.deepStrictEqual(inspect(parser('[](javascript:alert)')), void 0);
      assert.deepStrictEqual(inspect(parser('[](vbscript:alert)')), void 0);
      assert.deepStrictEqual(inspect(parser('[](data:text/html;base64,PHNjcmlwdD5hbGVydCgnWFNTJyk8L3NjcmlwdD4K)')), void 0);
      assert.deepStrictEqual(inspect(parser('[](any:alert)')), void 0);
      assert.deepStrictEqual(inspect(parser('[](#")')), [['<a href="#&quot;" rel="noopener">#"</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[](#\\)')), void 0);
      assert.deepStrictEqual(inspect(parser('[](")')), [['<a href="&quot;" rel="noopener">"</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[]("#)')), [['<a href="&quot;#" rel="noopener">"#</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[]("\\)')), void 0);
      assert.deepStrictEqual(inspect(parser('[](\\)')), void 0);
      assert.deepStrictEqual(inspect(parser('[](#)')), [['<a href="#" rel="noopener">#</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[](\\")')), [['<a href="&quot;" rel="noopener">"</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[](\\\\)')), [['<a href="\\" rel="noopener">\\</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[](\\\\#)')), [['<a href="\\#" rel="noopener">\\#</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[](\\\\")')), [['<a href="\\&quot;" rel="noopener">\\"</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[<img>](#)')), [['<a href="#" rel="noopener">&lt;img&gt;</a>'], '']);
    });

    it('fishing', () => {
      assert.deepStrictEqual(inspect(parser('[http://host](http://evil)')), void 0);
      assert.deepStrictEqual(inspect(parser('[ http://host ](http://evil)')), void 0);
      assert.deepStrictEqual(inspect(parser('[_http://host](http://evil)')), void 0);
    });

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), void 0);
      assert.deepStrictEqual(inspect(parser('[](# )')), void 0);
      assert.deepStrictEqual(inspect(parser('[]( #)')), void 0);
      assert.deepStrictEqual(inspect(parser('[]( # )')), void 0);
      assert.deepStrictEqual(inspect(parser('[]( )')), void 0);
      assert.deepStrictEqual(inspect(parser('[ ]()')), void 0);
      assert.deepStrictEqual(inspect(parser('[ ]( )')), void 0);
      assert.deepStrictEqual(inspect(parser('[# ](#)')), void 0);
      assert.deepStrictEqual(inspect(parser('[ #](#)')), void 0);
      assert.deepStrictEqual(inspect(parser('[ # ](#)')), void 0);
      assert.deepStrictEqual(inspect(parser('[a\nb](ab)')), void 0);
      assert.deepStrictEqual(inspect(parser('[a\\\nb](ab)')), void 0);
      assert.deepStrictEqual(inspect(parser('[ab](a\nb)')), void 0);
      assert.deepStrictEqual(inspect(parser('[ab](a\\\nb)')), void 0);
      assert.deepStrictEqual(inspect(parser('[。\n！](ab)')), void 0);
      assert.deepStrictEqual(inspect(parser('![](#)')), void 0);
    });

    it('ab', () => {
      assert.deepStrictEqual(inspect(parser('[]()')), [[`<a href="" rel="noopener">${location.href}</a>`], '']);
      assert.deepStrictEqual(inspect(parser('[](b)')), [['<a href="b" rel="noopener">b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[](?b=c+d&#)')), [['<a href="?b=c+d&amp;#" rel="noopener">?b=c+d&amp;#</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[](?&amp;)')), [['<a href="?&amp;amp;" rel="noopener">?&amp;amp;</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[a]()')), [['<a href="" rel="noopener">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[a](b)')), [['<a href="b" rel="noopener">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[a b](c)')), [['<a href="c" rel="noopener">a b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[]\n(b)')), [['<a href="b" rel="noopener">b</a>'], '']);
    });

    it('image', () => {
      assert.deepStrictEqual(inspect(parser('[![](#) ](#)')), void 0);
      assert.deepStrictEqual(inspect(parser('[ ![](#)](#)')), void 0);
      assert.deepStrictEqual(inspect(parser('[ ![](#) ](#)')), void 0);
      assert.deepStrictEqual(inspect(parser('[![](#)#](#)')), void 0);
      assert.deepStrictEqual(inspect(parser('[#![](#)](#)')), void 0);
      assert.deepStrictEqual(inspect(parser('[![](#)![](#)](#)')), void 0);
      assert.deepStrictEqual(inspect(parser('[![a](b)](c)')), [['<a href="c" rel="noopener"><img data-src="b" alt="a"></a>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('[[](#)](#)')), void 0);
      assert.deepStrictEqual(inspect(parser('[((#))](#)')), void 0);
      assert.deepStrictEqual(inspect(parser('[<wbr>](#)')), void 0);
      assert.deepStrictEqual(inspect(parser('[http://host](#)')), void 0);
      assert.deepStrictEqual(inspect(parser('[http://host](http://host)')), void 0);
      assert.deepStrictEqual(inspect(parser('[\\[](#)')), [['<a href="#" rel="noopener">[</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[\\]](#)')), [['<a href="#" rel="noopener">]</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[](#()')), [['<a href="#(" rel="noopener">#(</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[](#\\))')), [['<a href="#)" rel="noopener">#)</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[*#*](#)')), [['<a href="#" rel="noopener"><em>#</em></a>'], '']);
      assert.deepStrictEqual(inspect(parser('[<wbr>"]("?"#")')), [['<a href="&quot;?&quot;#&quot;" rel="noopener"><wbr>"</a>'], '']);
    });

    it('external', () => {
      assert.deepStrictEqual(inspect(parser('[](http://host)')), [['<a href="http://host" rel="noopener" target="_blank">http://host</a>'], '']);
    });

    it('nofollow', () => {
      assert.deepStrictEqual(inspect(parser('[](# #)')), void 0);
      assert.deepStrictEqual(inspect(parser('[](# nofollow )')), void 0);
      assert.deepStrictEqual(inspect(parser('[](#  nofollow)')), void 0);
      assert.deepStrictEqual(inspect(parser('[]( nofollow)')), [[`<a href="" rel="noopener nofollow noreferrer">${location.href.slice(1)}</a>`], '']);
      assert.deepStrictEqual(inspect(parser('[](# nofollow)')), [['<a href="#" rel="noopener nofollow noreferrer">#</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[](http://host nofollow)')), [['<a href="http://host" rel="noopener nofollow noreferrer" target="_blank">ttp://host</a>'], '']);
    });

  });

});
