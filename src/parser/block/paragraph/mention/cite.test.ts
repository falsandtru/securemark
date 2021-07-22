import { cite } from './cite';
import { some } from '../../../../combinator';
import { inspect } from '../../../../debug.test';

describe('Unit: parser/block/paragraph/mention/cite', () => {
  describe('cite', () => {
    const parser = (source: string) => some(cite)(source, {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('>')), undefined);
      assert.deepStrictEqual(inspect(parser('>0')), undefined);
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
      assert.deepStrictEqual(inspect(parser('>>0')), [['<span class="cite">&gt;<a class="anchor" href="?res=0" data-depth="1">&gt;0</a></span>'], '']);
      assert.deepStrictEqual(inspect(parser('>>0 ')), [['<span class="cite">&gt;<a class="anchor" href="?res=0" data-depth="1">&gt;0</a></span>'], '']);
      assert.deepStrictEqual(inspect(parser('>>0\n')), [['<span class="cite">&gt;<a class="anchor" href="?res=0" data-depth="1">&gt;0</a></span>'], '']);
      assert.deepStrictEqual(inspect(parser('>>>0')), [['<span class="cite">&gt;&gt;<a class="anchor" href="?res=0" data-depth="2">&gt;0</a></span>'], '']);
      assert.deepStrictEqual(inspect(parser('>>0\n1')), [['<span class="cite">&gt;<a class="anchor" href="?res=0" data-depth="1">&gt;0</a></span>'], '1']);
      assert.deepStrictEqual(inspect(parser('>>0\n>1')), [['<span class="cite">&gt;<a class="anchor" href="?res=0" data-depth="1">&gt;0</a></span>'], '>1']);
      assert.deepStrictEqual(inspect(parser('>>0\n>>')), [['<span class="cite">&gt;<a class="anchor" href="?res=0" data-depth="1">&gt;0</a></span>'], '>>']);
      assert.deepStrictEqual(inspect(parser('>>0\n>>1')), [['<span class="cite">&gt;<a class="anchor" href="?res=0" data-depth="1">&gt;0</a></span>', '<span class="cite">&gt;<a class="anchor" href="?res=1" data-depth="1">&gt;1</a></span>'], '']);
      assert.deepStrictEqual(inspect(parser('>>0\n>>>1')), [['<span class="cite">&gt;<a class="anchor" href="?res=0" data-depth="1">&gt;0</a></span>', '<span class="cite">&gt;&gt;<a class="anchor" href="?res=1" data-depth="2">&gt;1</a></span>'], '']);
      assert.deepStrictEqual(inspect(parser('>>>0\n>>')), [['<span class="cite">&gt;&gt;<a class="anchor" href="?res=0" data-depth="2">&gt;0</a></span>'], '>>']);
      assert.deepStrictEqual(inspect(parser('>>>0\n>>1')), [['<span class="cite">&gt;&gt;<a class="anchor" href="?res=0" data-depth="2">&gt;0</a></span>', '<span class="cite">&gt;<a class="anchor" href="?res=1" data-depth="1">&gt;1</a></span>'], '']);
    });

  });

});
