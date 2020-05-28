import { address } from './address';
import { some } from '../../../../combinator';
import { inspect } from '../../../../debug.test';

describe('Unit: parser/block/paragraph/mention/address', () => {
  describe('address', () => {
    const parser = (source: string) => some(address)(source, {});

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
      assert.deepStrictEqual(inspect(parser('>0')), [['<a href="?log=0" rel="noopener" class="address" data-level="1">&gt;0</a>'], '']);
      assert.deepStrictEqual(inspect(parser('>a')), [['<a href="?log=a" rel="noopener" class="address" data-level="1">&gt;a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('>a ')), [['<a href="?log=a" rel="noopener" class="address" data-level="1">&gt;a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('>a\n')), [['<a href="?log=a" rel="noopener" class="address" data-level="1">&gt;a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('>A')), [[`<a href="?log=A" rel="noopener" class="address" data-level="1">&gt;A</a>`], '']);
      assert.deepStrictEqual(inspect(parser('>>0')), [['<a href="?log=0" rel="noopener" class="address" data-level="2">&gt;&gt;0</a>'], '']);
      assert.deepStrictEqual(inspect(parser('>0\n1')), [['<a href="?log=0" rel="noopener" class="address" data-level="1">&gt;0</a>'], '1']);
      assert.deepStrictEqual(inspect(parser('>0\n>')), [['<a href="?log=0" rel="noopener" class="address" data-level="1">&gt;0</a>'], '>']);
      assert.deepStrictEqual(inspect(parser('>0\n>1')), [['<a href="?log=0" rel="noopener" class="address" data-level="1">&gt;0</a>', '<a href="?log=1" rel="noopener" class="address" data-level="1">&gt;1</a>'], '']);
      assert.deepStrictEqual(inspect(parser('>0\n>>1')), [['<a href="?log=0" rel="noopener" class="address" data-level="1">&gt;0</a>', '<a href="?log=1" rel="noopener" class="address" data-level="2">&gt;&gt;1</a>'], '']);
      assert.deepStrictEqual(inspect(parser('>>0\n>1')), [['<a href="?log=0" rel="noopener" class="address" data-level="2">&gt;&gt;0</a>', '<a href="?log=1" rel="noopener" class="address" data-level="1">&gt;1</a>'], '']);
      assert.deepStrictEqual(inspect(parser('>https://host?<')), [['<a href="https://host?<" rel="noopener" target="_blank" class="address" data-level="1">&gt;https://host?&lt;</a>'], '']);
    });

    it('nofollow', () => {
      assert.deepStrictEqual(inspect(parser('>ttps://host')), [['<a href="https://host" rel="noopener nofollow noreferrer" target="_blank" class="address" data-level="1">&gt;ttps://host</a>'], '']);
    });

  });

});
