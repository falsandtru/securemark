import { quotation } from './quotation';
import { some } from '../../../../combinator';
import { inspect } from '../../../../debug.test';

describe('Unit: parser/block/paragraph/mention/quotation', () => {
  describe('quotation', () => {
    const parser = (source: string) => some(quotation)(source, {}, {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser(' >0')), undefined);
      assert.deepStrictEqual(inspect(parser('\\>0')), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('>')), [['<span class="quotation">&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('> ')), [['<span class="quotation">&gt; </span>'], '']);
      assert.deepStrictEqual(inspect(parser('> 0')), [['<span class="quotation">&gt; 0</span>'], '']);
      assert.deepStrictEqual(inspect(parser('> a')), [['<span class="quotation">&gt; a</span>'], '']);
      assert.deepStrictEqual(inspect(parser('> a ')), [['<span class="quotation">&gt; a </span>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n')), [['<span class="quotation">&gt; a</span>'], '']);
      assert.deepStrictEqual(inspect(parser('> A')), [['<span class="quotation">&gt; A</span>'], '']);
      assert.deepStrictEqual(inspect(parser('>> 0')), [['<span class="quotation">&gt;&gt; 0</span>'], '']);
      assert.deepStrictEqual(inspect(parser('>\n')), [['<span class="quotation">&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('>\na')), [['<span class="quotation">&gt;</span>'], 'a']);
      assert.deepStrictEqual(inspect(parser('>\n>')), [['<span class="quotation">&gt;<br>&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('> 0\na')), [['<span class="quotation">&gt; 0</span>'], 'a']);
      assert.deepStrictEqual(inspect(parser('> 0\n>')), [['<span class="quotation">&gt; 0<br>&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('> 0\n> ')), [['<span class="quotation">&gt; 0<br>&gt; </span>'], '']);
      assert.deepStrictEqual(inspect(parser('> 0\n> 1')), [['<span class="quotation">&gt; 0<br>&gt; 1</span>'], '']);
      assert.deepStrictEqual(inspect(parser('> 0\n>> 1')), [['<span class="quotation">&gt; 0<br>&gt;&gt; 1</span>'], '']);
      assert.deepStrictEqual(inspect(parser('>>')), [['<span class="quotation">&gt;&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('>> 0\n> 1')), [['<span class="quotation">&gt;&gt; 0<br>&gt; 1</span>'], '']);
      assert.deepStrictEqual(inspect(parser('>\\')), [['<span class="quotation">&gt;\\</span>'], '']);
      assert.deepStrictEqual(inspect(parser('>a')), [['<span class="quotation">&gt;a</span>'], '']);
      assert.deepStrictEqual(inspect(parser('>a b')), [['<span class="quotation">&gt;a b</span>'], '']);
      assert.deepStrictEqual(inspect(parser('>a b\nc')), [['<span class="quotation">&gt;a b</span>'], 'c']);
      assert.deepStrictEqual(inspect(parser('>a b\n> c')), [['<span class="quotation">&gt;a b<br>&gt; c</span>'], '']);
    });

  });

});
