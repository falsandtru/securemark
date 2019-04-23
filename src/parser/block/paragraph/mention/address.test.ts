import { address } from './address';
import { some } from '../../../../combinator';
import { inspect } from '../../../../debug.test';

describe('Unit: parser/block/paragraph/mention/address', () => {
  describe('address', () => {
    const parser = some(address);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('>')), undefined);
      assert.deepStrictEqual(inspect(parser('> ')), undefined);
      assert.deepStrictEqual(inspect(parser('>>')), undefined);
      assert.deepStrictEqual(inspect(parser('>/')), undefined);
      assert.deepStrictEqual(inspect(parser('>\\')), undefined);
      assert.deepStrictEqual(inspect(parser('>あ')), undefined);
      assert.deepStrictEqual(inspect(parser('>aあ')), undefined);
      assert.deepStrictEqual(inspect(parser('>0 a')), undefined);
      assert.deepStrictEqual(inspect(parser('> 0')), undefined);
      assert.deepStrictEqual(inspect(parser(' >0')), undefined);
      assert.deepStrictEqual(inspect(parser('\\>0')), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('>0')), [['<span class="address" data-level="1"><a rel="noopener">&gt;0</a></span>'], '']);
      assert.deepStrictEqual(inspect(parser('>a')), [['<span class="address" data-level="1"><a rel="noopener">&gt;a</a></span>'], '']);
      assert.deepStrictEqual(inspect(parser('>a ')), [['<span class="address" data-level="1"><a rel="noopener">&gt;a</a></span>'], '']);
      assert.deepStrictEqual(inspect(parser('>a\n')), [['<span class="address" data-level="1"><a rel="noopener">&gt;a</a></span>'], '']);
      assert.deepStrictEqual(inspect(parser('>A')), [[`<span class="address" data-level="1"><a rel="noopener">&gt;A</a></span>`], '']);
      assert.deepStrictEqual(inspect(parser('>a/b')), [['<span class="address" data-level="1"><a rel="noopener">&gt;a/b</a></span>'], '']);
      assert.deepStrictEqual(inspect(parser('>>0')), [['<span class="address" data-level="2"><a rel="noopener">&gt;&gt;0</a></span>'], '']);
      assert.deepStrictEqual(inspect(parser('>0\n1')), [['<span class="address" data-level="1"><a rel="noopener">&gt;0</a></span>'], '1']);
      assert.deepStrictEqual(inspect(parser('>0\n>')), [['<span class="address" data-level="1"><a rel="noopener">&gt;0</a></span>'], '>']);
      assert.deepStrictEqual(inspect(parser('>0\n>1')), [['<span class="address" data-level="1"><a rel="noopener">&gt;0</a></span>', '<span class="address" data-level="1"><a rel="noopener">&gt;1</a></span>'], '']);
      assert.deepStrictEqual(inspect(parser('>0\n>>1')), [['<span class="address" data-level="1"><a rel="noopener">&gt;0</a></span>', '<span class="address" data-level="2"><a rel="noopener">&gt;&gt;1</a></span>'], '']);
      assert.deepStrictEqual(inspect(parser('>>0\n>1')), [['<span class="address" data-level="2"><a rel="noopener">&gt;&gt;0</a></span>', '<span class="address" data-level="1"><a rel="noopener">&gt;1</a></span>'], '']);
      assert.deepStrictEqual(inspect(parser('>https://あ')), [['<span class="address" data-level="1"><a rel="noopener" target="_blank">&gt;https://あ</a></span>'], '']);
    });

  });

});
