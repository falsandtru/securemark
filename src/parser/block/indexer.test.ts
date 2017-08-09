import { loop } from '../../combinator/loop';
import { indexer } from './indexer';
import { inspect } from '../debug.test';

describe('Unit: parser/block/indexer', () => {
  describe('index', () => {
    const parser = loop(indexer);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), void 0);
      assert.deepStrictEqual(inspect(parser('[#a]')), void 0);
      assert.deepStrictEqual(inspect(parser(' ')), void 0);
      assert.deepStrictEqual(inspect(parser(' #')), void 0);
      assert.deepStrictEqual(inspect(parser(' #a')), void 0);
      assert.deepStrictEqual(inspect(parser(' [#]')), void 0);
      assert.deepStrictEqual(inspect(parser(' [# ]')), void 0);
      assert.deepStrictEqual(inspect(parser(' [#a ]')), void 0);
      assert.deepStrictEqual(inspect(parser(' [#a] ')), void 0);
      assert.deepStrictEqual(inspect(parser(' [#]]')), void 0);
      assert.deepStrictEqual(inspect(parser(' [#\\]')), void 0);
    });

    it('ab', () => {
      assert.deepStrictEqual(inspect(parser(' [#a]')), [['<span class="index">a</span>'], '']);
      assert.deepStrictEqual(inspect(parser(' [#\\]]')), [['<span class="index">]</span>'], '']);
      assert.deepStrictEqual(inspect(parser('  [#a]')), [['<span class="index">a</span>'], '']);
    });

  });

});
