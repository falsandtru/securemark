import { cite } from './cite';
import { some } from '../../../combinator';
import { inspect } from '../../../debug.test';

describe('Unit: parser/block/mention/cite', () => {
  describe('cite', () => {
    const parser = (source: string) => some(cite)(source, {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('>')), undefined);
      assert.deepStrictEqual(inspect(parser('>0')), undefined);
      assert.deepStrictEqual(inspect(parser('>\n')), undefined);
      assert.deepStrictEqual(inspect(parser('>>')), undefined);
      assert.deepStrictEqual(inspect(parser('>> ')), undefined);
      assert.deepStrictEqual(inspect(parser('>>0A')), undefined);
      assert.deepStrictEqual(inspect(parser('>>0 a')), undefined);
      assert.deepStrictEqual(inspect(parser('>>A')), undefined);
      assert.deepStrictEqual(inspect(parser('>>/')), undefined);
      assert.deepStrictEqual(inspect(parser('>>\\')), undefined);
      assert.deepStrictEqual(inspect(parser('>>01#')), undefined);
      assert.deepStrictEqual(inspect(parser('>>01@')), undefined);
      assert.deepStrictEqual(inspect(parser('>>https://host')), undefined);
      assert.deepStrictEqual(inspect(parser('>>tel:1234567890')), undefined);
      assert.deepStrictEqual(inspect(parser('>> 0')), undefined);
      assert.deepStrictEqual(inspect(parser(' >>0')), undefined);
      assert.deepStrictEqual(inspect(parser('\\>>0')), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('>>0')), [['<span class="cite">&gt;<a href="?comment=0" class="anchor" data-depth="1">&gt;0</a></span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('>>0 ')), [['<span class="cite">&gt;<a href="?comment=0" class="anchor" data-depth="1">&gt;0</a></span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('>>0\n')), [['<span class="cite">&gt;<a href="?comment=0" class="anchor" data-depth="1">&gt;0</a></span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('>>>0')), [['<span class="cite">&gt;&gt;<a href="?comment=0" class="anchor" data-depth="2">&gt;0</a></span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('>>0\n1')), [['<span class="cite">&gt;<a href="?comment=0" class="anchor" data-depth="1">&gt;0</a></span>', '<br>'], '1']);
      assert.deepStrictEqual(inspect(parser('>>0\n>1')), [['<span class="cite">&gt;<a href="?comment=0" class="anchor" data-depth="1">&gt;0</a></span>', '<br>'], '>1']);
      assert.deepStrictEqual(inspect(parser('>>0\n>>')), [['<span class="cite">&gt;<a href="?comment=0" class="anchor" data-depth="1">&gt;0</a></span>', '<br>'], '>>']);
      assert.deepStrictEqual(inspect(parser('>>0\n>>1')), [['<span class="cite">&gt;<a href="?comment=0" class="anchor" data-depth="1">&gt;0</a></span>', '<br>', '<span class="cite">&gt;<a href="?comment=1" class="anchor" data-depth="1">&gt;1</a></span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('>>0\n>>>1')), [['<span class="cite">&gt;<a href="?comment=0" class="anchor" data-depth="1">&gt;0</a></span>', '<br>', '<span class="cite">&gt;&gt;<a href="?comment=1" class="anchor" data-depth="2">&gt;1</a></span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('>>>0\n>>')), [['<span class="cite">&gt;&gt;<a href="?comment=0" class="anchor" data-depth="2">&gt;0</a></span>', '<br>'], '>>']);
      assert.deepStrictEqual(inspect(parser('>>>0\n>>1')), [['<span class="cite">&gt;&gt;<a href="?comment=0" class="anchor" data-depth="2">&gt;0</a></span>', '<br>', '<span class="cite">&gt;<a href="?comment=1" class="anchor" data-depth="1">&gt;1</a></span>', '<br>'], '']);
    });

  });

});
