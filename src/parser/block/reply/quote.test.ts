import { quote } from './quote';
import { some } from '../../../combinator';
import { input } from '../../context';
import { inspect } from '../../../debug.test';

describe('Unit: parser/block/reply/quote', () => {
  describe('quote', () => {
    const parser = some(quote);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('')), undefined);
      assert.deepStrictEqual(inspect(parser, input('>')), undefined);
      assert.deepStrictEqual(inspect(parser, input('>\n')), undefined);
      assert.deepStrictEqual(inspect(parser, input('>>')), undefined);
      assert.deepStrictEqual(inspect(parser, input('>0')), undefined);
      assert.deepStrictEqual(inspect(parser, input('>>0')), undefined);
      assert.deepStrictEqual(inspect(parser, input('>0A')), undefined);
      assert.deepStrictEqual(inspect(parser, input('>>0A')), undefined);
      assert.deepStrictEqual(inspect(parser, input('>0 a')), undefined);
      assert.deepStrictEqual(inspect(parser, input('>>0 a')), undefined);
      assert.deepStrictEqual(inspect(parser, input('>A')), undefined);
      assert.deepStrictEqual(inspect(parser, input('>A 0')), undefined);
      assert.deepStrictEqual(inspect(parser, input('>/')), undefined);
      assert.deepStrictEqual(inspect(parser, input('>\\')), undefined);
      assert.deepStrictEqual(inspect(parser, input('>>01#')), undefined);
      assert.deepStrictEqual(inspect(parser, input('>>01@')), undefined);
      assert.deepStrictEqual(inspect(parser, input('>>https://host')), undefined);
      assert.deepStrictEqual(inspect(parser, input('>>tel:1234567890')), undefined);
      assert.deepStrictEqual(inspect(parser, input('>#a')), undefined);
      assert.deepStrictEqual(inspect(parser, input('>A\n> b')), undefined);
      assert.deepStrictEqual(inspect(parser, input(' > 0')), undefined);
      assert.deepStrictEqual(inspect(parser, input('\\> 0')), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser, input('> ')), [['<span class="quote">&gt; </span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> 0')), [['<span class="quote">&gt; 0</span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> a')), [['<span class="quote">&gt; a</span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> a ')), [['<span class="quote">&gt; a </span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> a b')), [['<span class="quote">&gt; a b</span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> a\n')), [['<span class="quote">&gt; a</span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> A')), [['<span class="quote">&gt; A</span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('>> 0')), [['<span class="quote">&gt;&gt; 0</span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> 0\na')), [['<span class="quote">&gt; 0</span>', '<br>'], 'a']);
      assert.deepStrictEqual(inspect(parser, input('> 0\n>')), [['<span class="quote">&gt; 0</span>', '<br>'], '>']);
      assert.deepStrictEqual(inspect(parser, input('> 0\n> ')), [['<span class="quote">&gt; 0<br>&gt; </span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> 0\n> 1')), [['<span class="quote">&gt; 0<br>&gt; 1</span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> 0\n>> 1')), [['<span class="quote">&gt; 0<br>&gt;&gt; 1</span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('>> 0\n> 1')), [['<span class="quote">&gt;&gt; 0<br>&gt; 1</span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> \\')), [['<span class="quote">&gt; \\</span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> >>0\n> > b')), [['<span class="quote">&gt; <a class="anchor" href="?at=0">&gt;&gt;0</a><br>&gt; &gt; b</span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> >>0\n> > b\n> c')), [['<span class="quote">&gt; <a class="anchor" href="?at=0">&gt;&gt;0</a><br>&gt; &gt; b<br>&gt; c</span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> > a\n> > b\n> > c')), [['<span class="quote">&gt; &gt; a<br>&gt; &gt; b<br>&gt; &gt; c</span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> > > a\n> > > b')), [['<span class="quote">&gt; &gt; &gt; a<br>&gt; &gt; &gt; b</span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> #a')), [['<span class="quote">&gt; <a class="hashtag" href="/hashtags/a">#a</a></span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> $-a, $-b')), [['<span class="quote">&gt; $-a, $-b</span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> $a=b$')), [['<span class="quote">&gt; <span class="math" translate="no" data-src="$a=b$">$a=b$</span></span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> ${a}$')), [['<span class="quote">&gt; <span class="math" translate="no" data-src="${a}$">${a}$</span></span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> http://host)')), [['<span class="quote">&gt; <a class="url" href="http://host)" target="_blank">http://host)</a></span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> a\n> http://host) \n> b')), [['<span class="quote">&gt; a<br>&gt; <a class="url" href="http://host)" target="_blank">http://host)</a> <br>&gt; b</span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> !http://host)')), [['<span class="quote">&gt; !<a class="url" href="http://host)" target="_blank">http://host)</a></span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> a\n> !http://host) \n> b')), [['<span class="quote">&gt; a<br>&gt; !<a class="url" href="http://host)" target="_blank">http://host)</a> <br>&gt; b</span>', '<br>'], '']);
    });

  });

});
