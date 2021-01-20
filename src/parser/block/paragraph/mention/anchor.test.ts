import { anchor } from './anchor';
import { some } from '../../../../combinator';
import { inspect } from '../../../../debug.test';

describe('Unit: parser/block/paragraph/mention/anchor', () => {
  describe('anchor', () => {
    const parser = (source: string) => some(anchor)(source, {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('>')), undefined);
      assert.deepStrictEqual(inspect(parser('>>')), undefined);
      assert.deepStrictEqual(inspect(parser('>> ')), undefined);
      assert.deepStrictEqual(inspect(parser('>>/')), undefined);
      assert.deepStrictEqual(inspect(parser('>>\\')), undefined);
      assert.deepStrictEqual(inspect(parser('>>あ')), undefined);
      assert.deepStrictEqual(inspect(parser('>>aあ')), undefined);
      assert.deepStrictEqual(inspect(parser('>>0 a')), undefined);
      assert.deepStrictEqual(inspect(parser('>> 0')), undefined);
      assert.deepStrictEqual(inspect(parser(' >>0')), undefined);
      assert.deepStrictEqual(inspect(parser('\\>>0')), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('>0')), [['<span class="quote"><a class="anchor" href="?res=0" rel="noopener">&gt;0</a></span>'], '']);
      assert.deepStrictEqual(inspect(parser('>>0')), [['<span class="quote">&gt;<a class="anchor" href="?res=0" rel="noopener">&gt;0</a></span>'], '']);
      assert.deepStrictEqual(inspect(parser('>>0 ')), [['<span class="quote">&gt;<a class="anchor" href="?res=0" rel="noopener">&gt;0</a></span>'], '']);
      assert.deepStrictEqual(inspect(parser('>>0\n')), [['<span class="quote">&gt;<a class="anchor" href="?res=0" rel="noopener">&gt;0</a></span>'], '']);
      assert.deepStrictEqual(inspect(parser('>>>0')), [['<span class="quote">&gt;&gt;<a class="anchor" href="?res=0" rel="noopener">&gt;0</a></span>'], '']);
      assert.deepStrictEqual(inspect(parser('>>0\n1')), [['<span class="quote">&gt;<a class="anchor" href="?res=0" rel="noopener">&gt;0</a></span>'], '1']);
      assert.deepStrictEqual(inspect(parser('>>0\n>1')), [['<span class="quote">&gt;<a class="anchor" href="?res=0" rel="noopener">&gt;0</a></span>', '<span class="quote"><a class="anchor" href="?res=1" rel="noopener">&gt;1</a></span>'], '']);
      assert.deepStrictEqual(inspect(parser('>>0\n>>')), [['<span class="quote">&gt;<a class="anchor" href="?res=0" rel="noopener">&gt;0</a></span>'], '>>']);
      assert.deepStrictEqual(inspect(parser('>>0\n>>1')), [['<span class="quote">&gt;<a class="anchor" href="?res=0" rel="noopener">&gt;0</a></span>', '<span class="quote">&gt;<a class="anchor" href="?res=1" rel="noopener">&gt;1</a></span>'], '']);
      assert.deepStrictEqual(inspect(parser('>>0\n>>>1')), [['<span class="quote">&gt;<a class="anchor" href="?res=0" rel="noopener">&gt;0</a></span>', '<span class="quote">&gt;&gt;<a class="anchor" href="?res=1" rel="noopener">&gt;1</a></span>'], '']);
      assert.deepStrictEqual(inspect(parser('>>>0\n>>')), [['<span class="quote">&gt;&gt;<a class="anchor" href="?res=0" rel="noopener">&gt;0</a></span>'], '>>']);
      assert.deepStrictEqual(inspect(parser('>>>0\n>>1')), [['<span class="quote">&gt;&gt;<a class="anchor" href="?res=0" rel="noopener">&gt;0</a></span>', '<span class="quote">&gt;<a class="anchor" href="?res=1" rel="noopener">&gt;1</a></span>'], '']);
    });

  });

});
