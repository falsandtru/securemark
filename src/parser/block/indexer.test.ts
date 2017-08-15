import { loop } from '../../combinator/loop';
import { indexer } from './indexer';
import { inspect } from '../debug.test';

describe('Unit: parser/block/indexer', () => {
  describe('indexer', () => {
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
      assert.deepStrictEqual(inspect(parser(' [#a]')), [['<a href="#index:a" rel="noopener" class="index">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser(' [#\\]]')), [['<a href="#index:]" rel="noopener" class="index">]</a>'], '']);
      assert.deepStrictEqual(inspect(parser(' [#`a`]')), [['<a href="#index:`a`" rel="noopener" class="index">`a`</a>'], '']);
      assert.deepStrictEqual(inspect(parser('  [#a]')), [['<a href="#index:a" rel="noopener" class="index">a</a>'], '']);
    });

  });

});
