import { quote } from './quote';
import { some } from '../../../../combinator';
import { inspect } from '../../../../debug.test';

describe('Unit: parser/block/paragraph/mention/quote', () => {
  describe('quote', () => {
    const parser = (source: string) => some(quote)(source, {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser(' >0')), undefined);
      assert.deepStrictEqual(inspect(parser('\\>0')), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('>')), [['<span class="quote">&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('> ')), [['<span class="quote">&gt; </span>'], '']);
      assert.deepStrictEqual(inspect(parser('> 0')), [['<span class="quote">&gt; 0</span>'], '']);
      assert.deepStrictEqual(inspect(parser('> a')), [['<span class="quote">&gt; a</span>'], '']);
      assert.deepStrictEqual(inspect(parser('> a ')), [['<span class="quote">&gt; a </span>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n')), [['<span class="quote">&gt; a</span>'], '']);
      assert.deepStrictEqual(inspect(parser('> A')), [['<span class="quote">&gt; A</span>'], '']);
      assert.deepStrictEqual(inspect(parser('>> 0')), [['<span class="quote">&gt;&gt; 0</span>'], '']);
      assert.deepStrictEqual(inspect(parser('>\n')), [['<span class="quote">&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('>\na')), [['<span class="quote">&gt;</span>'], 'a']);
      assert.deepStrictEqual(inspect(parser('>\n>')), [['<span class="quote">&gt;<br>&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('> 0\na')), [['<span class="quote">&gt; 0</span>'], 'a']);
      assert.deepStrictEqual(inspect(parser('> 0\n>')), [['<span class="quote">&gt; 0<br>&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('> 0\n> ')), [['<span class="quote">&gt; 0<br>&gt; </span>'], '']);
      assert.deepStrictEqual(inspect(parser('> 0\n> 1')), [['<span class="quote">&gt; 0<br>&gt; 1</span>'], '']);
      assert.deepStrictEqual(inspect(parser('> 0\n>> 1')), [['<span class="quote">&gt; 0<br>&gt;&gt; 1</span>'], '']);
      assert.deepStrictEqual(inspect(parser('>>')), [['<span class="quote">&gt;&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('>> 0\n> 1')), [['<span class="quote">&gt;&gt; 0<br>&gt; 1</span>'], '']);
      assert.deepStrictEqual(inspect(parser('>\\')), [['<span class="quote">&gt;\\</span>'], '']);
      assert.deepStrictEqual(inspect(parser('>a')), [['<span class="quote">&gt;a</span>'], '']);
      assert.deepStrictEqual(inspect(parser('>a b')), [['<span class="quote">&gt;a b</span>'], '']);
      assert.deepStrictEqual(inspect(parser('>a b\nc')), [['<span class="quote">&gt;a b</span>'], 'c']);
      assert.deepStrictEqual(inspect(parser('>a b\n> c')), [['<span class="quote">&gt;a b<br>&gt; c</span>'], '']);
      assert.deepStrictEqual(inspect(parser('> >>0\n> > b')), [['<span class="quote">&gt; <a class="anchor" href="?res=0">&gt;&gt;0</a><br>&gt; &gt; b</span>'], '']);
      assert.deepStrictEqual(inspect(parser('> >>0\n> > b\n> c')), [['<span class="quote">&gt; <a class="anchor" href="?res=0">&gt;&gt;0</a><br>&gt; &gt; b<br>&gt; c</span>'], '']);
      assert.deepStrictEqual(inspect(parser('> > a\n> > b\n> > c')), [['<span class="quote">&gt; &gt; a<br>&gt; &gt; b<br>&gt; &gt; c</span>'], '']);
      assert.deepStrictEqual(inspect(parser('> > > a\n> > > b')), [['<span class="quote">&gt; &gt; &gt; a<br>&gt; &gt; &gt; b</span>'], '']);
      assert.deepStrictEqual(inspect(parser('>$a-b$')), [['<span class="quote">&gt;$a-b$</span>'], '']);
      assert.deepStrictEqual(inspect(parser('>${a}$')), [['<span class="quote">&gt;<span class="math notranslate" data-src="${a}$">${a}$</span></span>'], '']);
    });

  });

});
