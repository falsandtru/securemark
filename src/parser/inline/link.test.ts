import { link } from './link';
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
      assert.deepStrictEqual(inspect(parser('[](")')), [['<a href="&quot;" rel="noopener">"</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[](\\)')), [['<a href="\\" rel="noopener">\\</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[](")')), [['<a href="&quot;" rel="noopener">"</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[]("#)')), [['<a href="&quot;#" rel="noopener">"#</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[<img>](/)')), [['<a href="/" rel="noopener">&lt;img&gt;</a>'], '']);
    });

    it('fishing', () => {
      assert.deepStrictEqual(inspect(parser('[http://host](http://evil)')), undefined);
      assert.deepStrictEqual(inspect(parser('[ http://host ](http://evil)')), undefined);
      assert.deepStrictEqual(inspect(parser('[_http://host](http://evil)')), undefined);
      assert.deepStrictEqual(inspect(parser('[https://host](http://host)')), undefined);
      assert.deepStrictEqual(inspect(parser('[[](http://host).com](http://host)')), undefined);
      assert.deepStrictEqual(inspect(parser('[[](http://host/a)b](http://host/ab)')), undefined);
      assert.deepStrictEqual(inspect(parser('[0987654321](tel:1234567890)')), undefined);
      assert.deepStrictEqual(inspect(parser('[](#)')), undefined);
      assert.deepStrictEqual(inspect(parser('[#]()')), undefined);
      assert.deepStrictEqual(inspect(parser('[#a]()')), undefined);
      assert.deepStrictEqual(inspect(parser('[ #a]()')), undefined);
      assert.deepStrictEqual(inspect(parser('[](@)')), undefined);
      assert.deepStrictEqual(inspect(parser('[@]()')), undefined);
      assert.deepStrictEqual(inspect(parser('[@a]()')), undefined);
      assert.deepStrictEqual(inspect(parser('[@a_]()')), undefined);
      assert.deepStrictEqual(inspect(parser('[ @a]()')), undefined);
    });

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('[]( )')), undefined);
      assert.deepStrictEqual(inspect(parser('[](  )')), undefined);
      assert.deepStrictEqual(inspect(parser('[](/  )')), undefined);
      assert.deepStrictEqual(inspect(parser('[](/ /)')), undefined);
      assert.deepStrictEqual(inspect(parser('[](()')), undefined);
      assert.deepStrictEqual(inspect(parser('[]( a)')), undefined);
      assert.deepStrictEqual(inspect(parser('[](a\nb)')), undefined);
      assert.deepStrictEqual(inspect(parser('[](a\\\nb)')), undefined);
      assert.deepStrictEqual(inspect(parser('[](a  nofollow)')), undefined);
      assert.deepStrictEqual(inspect(parser('[](a\nnofollow)')), undefined);
      assert.deepStrictEqual(inspect(parser('[]((\n))')), undefined);
      assert.deepStrictEqual(inspect(parser('[ ]()')), undefined);
      assert.deepStrictEqual(inspect(parser('[ ]( )')), undefined);
      assert.deepStrictEqual(inspect(parser('[[]()')), undefined);
      assert.deepStrictEqual(inspect(parser('[]]()')), undefined);
      assert.deepStrictEqual(inspect(parser('[ a]()')), undefined);
      assert.deepStrictEqual(inspect(parser('[ a ]()')), undefined);
      assert.deepStrictEqual(inspect(parser('[a\nb](ab)')), undefined);
      assert.deepStrictEqual(inspect(parser('[a\\\nb](ab)')), undefined);
      assert.deepStrictEqual(inspect(parser('[*a\\](\nb*](ab)')), undefined);
      assert.deepStrictEqual(inspect(parser('[。\n！](ab)')), undefined);
      assert.deepStrictEqual(inspect(parser('[[]()]()')), undefined);
      assert.deepStrictEqual(inspect(parser('![](/)')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('[]()')), [[`<a href="" rel="noopener">.</a>`], '']);
      assert.deepStrictEqual(inspect(parser('[](b)')), [['<a href="b" rel="noopener">b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[](b )')), [['<a href="b" rel="noopener">b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[]( b )')), [['<a href="b" rel="noopener">b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[](\\)')), [[`<a href="\\" rel="noopener">\\</a>`], '']);
      assert.deepStrictEqual(inspect(parser('[](\\ )')), [[`<a href="\\" rel="noopener">\\</a>`], '']);
      assert.deepStrictEqual(inspect(parser('[](\\b)')), [[`<a href="\\b" rel="noopener">\\b</a>`], '']);
      assert.deepStrictEqual(inspect(parser('[](a b)')), [['<a href="a" rel="noopener" class="invalid">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[](?b=c+d&\\#)')), [['<a href="?b=c+d&amp;\\#" rel="noopener">?b=c+d&amp;\\#</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[](?&amp;)')), [['<a href="?&amp;amp;" rel="noopener">?&amp;amp;</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[a]()')), [['<a href="" rel="noopener">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[a](b)')), [['<a href="b" rel="noopener">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[a](#)')), [['<a href="#" rel="noopener">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[a ]()')), [['<a href="" rel="noopener">a </a>'], '']);
      assert.deepStrictEqual(inspect(parser('[a b](c)')), [['<a href="c" rel="noopener">a b</a>'], '']);
      assert.deepStrictEqual(inspect(parser(`[](?#${encodeURIComponent(':/[]()<>?#=& ')})`)), [['<a href="?#%3A%2F%5B%5D()%3C%3E%3F%23%3D%26%20" rel="noopener">?#%3A%2F[]()&lt;&gt;%3F%23%3D%26%20</a>'], '']);
    });

    it('tel', () => {
      assert.deepStrictEqual(inspect(parser('[](tel:1234567890)')), [[`<a href="tel:1234567890" rel="noopener">1234567890</a>`], '']);
      assert.deepStrictEqual(inspect(parser('[1234567890](tel:1234567890)')), [[`<a href="tel:1234567890" rel="noopener">1234567890</a>`], '']);
      assert.deepStrictEqual(inspect(parser('[12-3456-7890](tel:1234567890)')), [[`<a href="tel:1234567890" rel="noopener">12-3456-7890</a>`], '']);
    });

    it('image', () => {
      assert.deepStrictEqual(inspect(parser('[![](/) ](/)')), undefined);
      assert.deepStrictEqual(inspect(parser('[ ![](/)](/)')), undefined);
      assert.deepStrictEqual(inspect(parser('[ ![](/) ](/)')), undefined);
      assert.deepStrictEqual(inspect(parser('[![](/)/](/)')), undefined);
      assert.deepStrictEqual(inspect(parser('[/![](/)](/)')), undefined);
      assert.deepStrictEqual(inspect(parser('[![](/)![](/)](/)')), undefined);
      assert.deepStrictEqual(inspect(parser('[![a](b)](/)')), [['<a href="/" rel="noopener" target="_blank"><img class="media" data-src="b" alt="a"></a>'], '']);
      assert.deepStrictEqual(inspect(parser('[*![a](b)c*](/)')), undefined);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('[]((b))')), [['<a href="(b)" rel="noopener">(b)</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[]((a(b)()(c)d))')), [['<a href="(a(b)()(c)d)" rel="noopener">(a(b)()(c)d)</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[]( )( )')), [['<a href=")(" rel="noopener">)(</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[[](/)](/)')), undefined);
      assert.deepStrictEqual(inspect(parser('[<wbr>](/)')), undefined);
      assert.deepStrictEqual(inspect(parser('[http://host](http://host)')), undefined);
      assert.deepStrictEqual(inspect(parser('[!http://host](/)')), [['<a href="/" rel="noopener" target="_blank"><img class="media" data-src="http://host" alt=""></a>'], '']);
      assert.deepStrictEqual(inspect(parser('[\\[](/)')), [['<a href="/" rel="noopener">[</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[\\]](/)')), [['<a href="/" rel="noopener">]</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[*a*](b)')), [['<a href="b" rel="noopener"><em>a</em></a>'], '']);
      assert.deepStrictEqual(inspect(parser('[<wbr>"]("?"#")')), [['<a href="&quot;?&quot;#&quot;" rel="noopener"><wbr>"</a>'], '']);
    });

    it('external', () => {
      assert.deepStrictEqual(inspect(parser('[](//host)')), [['<a href="//host" rel="noopener" target="_blank">//host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[](//[::])')), [['<a href="//[::]" rel="noopener" target="_blank">//[::]</a>'], '']);
    });

    it('attribute', () => {
      assert.deepStrictEqual(inspect(parser('[](/ constructor)')), [['<a href="/" rel="noopener" class="invalid">/</a>'], '']);
    });

    it('nofollow', () => {
      assert.deepStrictEqual(inspect(parser('[](/ nofollow=)')), undefined);
      assert.deepStrictEqual(inspect(parser('[](/ nofollow=nofollow)')), [['<a href="/" rel="noopener nofollow noreferrer" class="invalid">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[](/ nofollow nofollow)')), [['<a href="/" rel="noopener nofollow noreferrer" class="invalid">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[](/ nofollow)')), [['<a href="/" rel="noopener nofollow noreferrer">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[](/ nofollow)')), [['<a href="/" rel="noopener nofollow noreferrer">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[](/ nofollow )')), [['<a href="/" rel="noopener nofollow noreferrer">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[]( / nofollow)')), [['<a href="/" rel="noopener nofollow noreferrer">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[]( / nofollow )')), [['<a href="/" rel="noopener nofollow noreferrer">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[](http://host nofollow)')), [['<a href="http://host" rel="noopener nofollow noreferrer" target="_blank">ttp://host</a>'], '']);
    });

  });

});
