import { quote } from './quote';
import { some } from '../../../combinator';
import { input } from '../../../combinator/data/parser';
import { inspect } from '../../../debug.test';

describe('Unit: parser/block/reply/quote', () => {
  describe('quote', () => {
    const parser = (source: string) => some(quote)(input(source, ctx));
    const { context: ctx } = input('', {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser(''), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('>'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('>\n'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('>>'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('>0'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('>>0'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('>0A'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('>>0A'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('>0 a'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('>>0 a'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('>A'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('>A 0'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('>/'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('>\\'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('>>01#'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('>>01@'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('>>https://host'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('>>tel:1234567890'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('>#a'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('>A\n> b'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser(' > 0'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('\\> 0'), ctx), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('> '), ctx), [['<span class="quote">&gt; </span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('> 0'), ctx), [['<span class="quote">&gt; 0</span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('> a'), ctx), [['<span class="quote">&gt; a</span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('> a '), ctx), [['<span class="quote">&gt; a </span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('> a b'), ctx), [['<span class="quote">&gt; a b</span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n'), ctx), [['<span class="quote">&gt; a</span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('> A'), ctx), [['<span class="quote">&gt; A</span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('>> 0'), ctx), [['<span class="quote">&gt;&gt; 0</span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('> 0\na'), ctx), [['<span class="quote">&gt; 0</span>', '<br>'], 'a']);
      assert.deepStrictEqual(inspect(parser('> 0\n>'), ctx), [['<span class="quote">&gt; 0</span>', '<br>'], '>']);
      assert.deepStrictEqual(inspect(parser('> 0\n> '), ctx), [['<span class="quote">&gt; 0<br>&gt; </span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('> 0\n> 1'), ctx), [['<span class="quote">&gt; 0<br>&gt; 1</span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('> 0\n>> 1'), ctx), [['<span class="quote">&gt; 0<br>&gt;&gt; 1</span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('>> 0\n> 1'), ctx), [['<span class="quote">&gt;&gt; 0<br>&gt; 1</span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('> \\'), ctx), [['<span class="quote">&gt; \\</span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('> >>0\n> > b'), ctx), [['<span class="quote">&gt; <a class="anchor" href="?at=0">&gt;&gt;0</a><br>&gt; &gt; b</span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('> >>0\n> > b\n> c'), ctx), [['<span class="quote">&gt; <a class="anchor" href="?at=0">&gt;&gt;0</a><br>&gt; &gt; b<br>&gt; c</span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('> > a\n> > b\n> > c'), ctx), [['<span class="quote">&gt; &gt; a<br>&gt; &gt; b<br>&gt; &gt; c</span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('> > > a\n> > > b'), ctx), [['<span class="quote">&gt; &gt; &gt; a<br>&gt; &gt; &gt; b</span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('> #a'), ctx), [['<span class="quote">&gt; <a class="hashtag" href="/hashtags/a">#a</a></span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('> $-a, $-b'), ctx), [['<span class="quote">&gt; $-a, $-b</span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('> $a=b$'), ctx), [['<span class="quote">&gt; <span class="math" translate="no" data-src="$a=b$">$a=b$</span></span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('> ${a}$'), ctx), [['<span class="quote">&gt; <span class="math" translate="no" data-src="${a}$">${a}$</span></span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('> http://host)'), ctx), [['<span class="quote">&gt; <a class="url" href="http://host)" target="_blank">http://host)</a></span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n> http://host) \n> b'), ctx), [['<span class="quote">&gt; a<br>&gt; <a class="url" href="http://host)" target="_blank">http://host)</a> <br>&gt; b</span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('> !http://host)'), ctx), [['<span class="quote">&gt; !<a class="url" href="http://host)" target="_blank">http://host)</a></span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n> !http://host) \n> b'), ctx), [['<span class="quote">&gt; a<br>&gt; !<a class="url" href="http://host)" target="_blank">http://host)</a> <br>&gt; b</span>', '<br>'], '']);
    });

  });

});
