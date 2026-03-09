import { quote } from './quote';
import { some } from '../../../combinator';
import { input } from '../../../combinator/data/parser';
import { Context } from '../../context';
import { inspect } from '../../../debug.test';

describe('Unit: parser/block/reply/quote', () => {
  describe('quote', () => {
    const parser = some(quote);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('>', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('>\n', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('>>', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('>0', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('>>0', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('>0A', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('>>0A', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('>0 a', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('>>0 a', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('>A', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('>A 0', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('>/', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('>\\', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('>>01#', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('>>01@', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('>>https://host', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('>>tel:1234567890', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('>#a', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('>A\n> b', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input(' > 0', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('\\> 0', new Context())), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser, input('> ', new Context())), [['<span class="quote">&gt; </span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> 0', new Context())), [['<span class="quote">&gt; 0</span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> a', new Context())), [['<span class="quote">&gt; a</span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> a ', new Context())), [['<span class="quote">&gt; a </span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> a b', new Context())), [['<span class="quote">&gt; a b</span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> a\n', new Context())), [['<span class="quote">&gt; a</span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> A', new Context())), [['<span class="quote">&gt; A</span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('>> 0', new Context())), [['<span class="quote">&gt;&gt; 0</span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> 0\na', new Context())), [['<span class="quote">&gt; 0</span>', '<br>'], 'a']);
      assert.deepStrictEqual(inspect(parser, input('> 0\n>', new Context())), [['<span class="quote">&gt; 0</span>', '<br>'], '>']);
      assert.deepStrictEqual(inspect(parser, input('> 0\n> ', new Context())), [['<span class="quote">&gt; 0<br>&gt; </span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> 0\n> 1', new Context())), [['<span class="quote">&gt; 0<br>&gt; 1</span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> 0\n>> 1', new Context())), [['<span class="quote">&gt; 0<br>&gt;&gt; 1</span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('>> 0\n> 1', new Context())), [['<span class="quote">&gt;&gt; 0<br>&gt; 1</span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> \\', new Context())), [['<span class="quote">&gt; \\</span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> >>0\n> > b', new Context())), [['<span class="quote">&gt; <a class="anchor" href="?at=0">&gt;&gt;0</a><br>&gt; &gt; b</span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> >>0\n> > b\n> c', new Context())), [['<span class="quote">&gt; <a class="anchor" href="?at=0">&gt;&gt;0</a><br>&gt; &gt; b<br>&gt; c</span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> > a\n> > b\n> > c', new Context())), [['<span class="quote">&gt; &gt; a<br>&gt; &gt; b<br>&gt; &gt; c</span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> > > a\n> > > b', new Context())), [['<span class="quote">&gt; &gt; &gt; a<br>&gt; &gt; &gt; b</span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> #a', new Context())), [['<span class="quote">&gt; <a class="hashtag" href="/hashtags/a">#a</a></span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> $-a, $-b', new Context())), [['<span class="quote">&gt; $-a, $-b</span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> $a=b$', new Context())), [['<span class="quote">&gt; <span class="math" translate="no" data-src="$a=b$">$a=b$</span></span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> ${a}$', new Context())), [['<span class="quote">&gt; <span class="math" translate="no" data-src="${a}$">${a}$</span></span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> http://host)', new Context())), [['<span class="quote">&gt; <a class="url" href="http://host)" target="_blank">http://host)</a></span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> a\n> http://host) \n> b', new Context())), [['<span class="quote">&gt; a<br>&gt; <a class="url" href="http://host)" target="_blank">http://host)</a> <br>&gt; b</span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> !http://host)', new Context())), [['<span class="quote">&gt; !<a class="url" href="http://host)" target="_blank">http://host)</a></span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> a\n> !http://host) \n> b', new Context())), [['<span class="quote">&gt; a<br>&gt; !<a class="url" href="http://host)" target="_blank">http://host)</a> <br>&gt; b</span>', '<br>'], '']);
    });

  });

});
