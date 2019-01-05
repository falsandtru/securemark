import { indexer } from './indexer';
import { some } from '../../../combinator';
import { inspect } from '../../../debug.test';

describe('Unit: parser/inline/extension/indexer', () => {
  describe('indexer', () => {
    const parser = some(indexer);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('[#a]')), undefined);
      assert.deepStrictEqual(inspect(parser(' ')), undefined);
      assert.deepStrictEqual(inspect(parser(' #')), undefined);
      assert.deepStrictEqual(inspect(parser(' #a')), undefined);
      assert.deepStrictEqual(inspect(parser(' [#]')), undefined);
      assert.deepStrictEqual(inspect(parser(' [#]]')), undefined);
      assert.deepStrictEqual(inspect(parser(' [#a]]')), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser(' [#a]')), [['<small class="index" data-index="a"></small>'], '']);
      assert.deepStrictEqual(inspect(parser(' [#a] ')), [['<small class="index" data-index="a"></small>'], '']);
      assert.deepStrictEqual(inspect(parser(' [#a b]')), [['<small class="index" data-index="a-b"></small>'], '']);
      assert.deepStrictEqual(inspect(parser('  [#a]')), [['<small class="index" data-index="a"></small>'], '']);
    });

  });

});
