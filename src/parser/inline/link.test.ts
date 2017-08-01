import { loop } from '../../combinator/loop';
import { link } from './link';
import { inspect } from '../debug.test';

describe('Unit: parser/link', () => {
  describe('link', () => {
    const parser = loop(link);

    it('xss', () => {
      assert.deepStrictEqual(inspect(parser('[](javascript:alert)')), void 0);
      assert.deepStrictEqual(inspect(parser('[](vbscript:alert)')), void 0);
      assert.deepStrictEqual(inspect(parser('[](data:text/html;base64,PHNjcmlwdD5hbGVydCgnWFNTJyk8L3NjcmlwdD4K)')), void 0);
      assert.deepStrictEqual(inspect(parser('[](any:alert)')), void 0);
      assert.deepStrictEqual(inspect(parser('[](#")')), [['<a href="#&quot;">#"</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[](#\\)')), void 0);
      assert.deepStrictEqual(inspect(parser('[](")')), [['<a href="&quot;">"</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[]("#)')), [['<a href="&quot;#">"#</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[]("\\)')), void 0);
      assert.deepStrictEqual(inspect(parser('[](\\)')), void 0);
      assert.deepStrictEqual(inspect(parser('[](#)')), [['<a href="#">#</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[](\\")')), [['<a href="&quot;">"</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[](\\\\)')), [['<a href="\\">\\</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[](\\\\#)')), [['<a href="\\#">\\#</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[](\\\\")')), [['<a href="\\&quot;">\\"</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[<img>](#)')), [['<a href="#">&lt;img&gt;</a>'], '']);
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
      assert.deepStrictEqual(inspect(parser('[](# #)')), void 0);
      assert.deepStrictEqual(inspect(parser('[](# nofollow )')), void 0);
      assert.deepStrictEqual(inspect(parser('[](#  nofollow)')), void 0);
      assert.deepStrictEqual(inspect(parser('[]( )')), void 0);
      assert.deepStrictEqual(inspect(parser('[ ]()')), void 0);
      assert.deepStrictEqual(inspect(parser('[ ]( )')), void 0);
      assert.deepStrictEqual(inspect(parser('[# ](#)')), void 0);
      assert.deepStrictEqual(inspect(parser('[ #](#)')), void 0);
      assert.deepStrictEqual(inspect(parser('[ # ](#)')), void 0);
      assert.deepStrictEqual(inspect(parser('[[](#)](#)')), void 0);
      assert.deepStrictEqual(inspect(parser('[![](#) ](#)')), void 0);
      assert.deepStrictEqual(inspect(parser('[ ![](#)](#)')), void 0);
      assert.deepStrictEqual(inspect(parser('[ ![](#) ](#)')), void 0);
      assert.deepStrictEqual(inspect(parser('[![](#)![](#)](#)')), void 0);
      assert.deepStrictEqual(inspect(parser('[((#))](#)')), void 0);
      assert.deepStrictEqual(inspect(parser('[<wbr>](#)')), void 0);
      assert.deepStrictEqual(inspect(parser('[http://host](#)')), void 0);
      assert.deepStrictEqual(inspect(parser('[http://host](http://host)')), void 0);
      assert.deepStrictEqual(inspect(parser('[a\nb](ab)')), void 0);
      assert.deepStrictEqual(inspect(parser('[ab](a\nb)')), void 0);
      assert.deepStrictEqual(inspect(parser('![](#)')), void 0);
    });

    it('ab', () => {
      assert.deepStrictEqual(inspect(parser('[]()')), [[`<a href="">${location.href}</a>`], '']);
      assert.deepStrictEqual(inspect(parser('[](b)')), [['<a href="b">b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[](?b=c+d&#)')), [['<a href="?b=c+d&amp;#">?b=c+d&amp;#</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[](?&amp;)')), [['<a href="?&amp;amp;">?&amp;amp;</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[a]()')), [['<a href="">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[a](b)')), [['<a href="b">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[a b](c)')), [['<a href="c">a b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[]\n(b)')), [['<a href="b">b</a>'], '']);
    });

    it('image', () => {
      assert.deepStrictEqual(inspect(parser('[![a](b)](c)')), [['<a href="c"><img class="media" data-src="b" alt="a" style="max-width: 100%;"></a>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('[\\[](#)')), [['<a href="#">[</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[\\]](#)')), [['<a href="#">]</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[](#()')), [['<a href="#(">#(</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[](#\\))')), [['<a href="#)">#)</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[~#~](#)')), [['<a href="#"><sub>#</sub></a>'], '']);
      assert.deepStrictEqual(inspect(parser('[<wbr>"]("?"#")')), [['<a href="&quot;?&quot;#&quot;"><wbr>"</a>'], '']);
    });

    it('external', () => {
      assert.deepStrictEqual(inspect(parser('[](http://host)')), [['<a href="http://host" target="_blank" rel="noopener">http://host</a>'], '']);
    });

    it('nofollow', () => {
      assert.deepStrictEqual(inspect(parser('[]( nofollow)')), [[`<a href="" rel="noopener nofollow noreferrer">${location.href.slice(1)}</a>`], '']);
      assert.deepStrictEqual(inspect(parser('[](# nofollow)')), [['<a href="#" rel="noopener nofollow noreferrer">#</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[](http://host nofollow)')), [['<a href="http://host" target="_blank" rel="noopener nofollow noreferrer">ttp://host</a>'], '']);
    });

  });

});
