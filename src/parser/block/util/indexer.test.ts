import { indexer } from './indexer';
import { loop } from '../../../combinator';
import { inspect } from '../../../debug.test';

describe('Unit: parser/block/util/indexer', () => {
  describe('indexer', () => {
    const parser = loop(indexer);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('[#a]')), undefined);
      assert.deepStrictEqual(inspect(parser(' ')), undefined);
      assert.deepStrictEqual(inspect(parser(' #')), undefined);
      assert.deepStrictEqual(inspect(parser(' #a')), undefined);
      assert.deepStrictEqual(inspect(parser(' [#]')), undefined);
      assert.deepStrictEqual(inspect(parser(' [# ]')), undefined);
      assert.deepStrictEqual(inspect(parser(' [#a ]')), undefined);
      assert.deepStrictEqual(inspect(parser(' [#a] ')), undefined);
      assert.deepStrictEqual(inspect(parser(' [#]]')), undefined);
      assert.deepStrictEqual(inspect(parser(' [#\\]')), undefined);
    });

    it('ab', () => {
      assert.deepStrictEqual(inspect(parser(' [#a]')), [['<a href="#index:a" rel="noopener" class="index">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser(' [#\\]]')), [['<a href="#index:]" rel="noopener" class="index">]</a>'], '']);
      assert.deepStrictEqual(inspect(parser(' [#`a`]')), [['<a href="#index:`a`" rel="noopener" class="index">`a`</a>'], '']);
      assert.deepStrictEqual(inspect(parser('  [#a]')), [['<a href="#index:a" rel="noopener" class="index">a</a>'], '']);
    });

  });

});
