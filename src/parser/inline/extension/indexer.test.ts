import { indexer } from './indexer';
import { some } from '../../../combinator';
import { inspect } from '../../../debug.test';

describe('Unit: parser/inline/extension/indexer', () => {
  describe('indexer', () => {
    const parser = (source: string) => some(indexer)({ source, context: {} });

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('[|a]')), undefined);
      assert.deepStrictEqual(inspect(parser(' ')), undefined);
      assert.deepStrictEqual(inspect(parser(' |')), undefined);
      assert.deepStrictEqual(inspect(parser(' |a')), undefined);
      assert.deepStrictEqual(inspect(parser(' [| ]')), undefined);
      assert.deepStrictEqual(inspect(parser(' [|]]')), undefined);
      assert.deepStrictEqual(inspect(parser(' [|a]]')), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser(' [|]')), [['<span class="indexer" data-index=""></span>'], '']);
      assert.deepStrictEqual(inspect(parser(' [|a]')), [['<span class="indexer" data-index="a"></span>'], '']);
      assert.deepStrictEqual(inspect(parser(' [|a] ')), [['<span class="indexer" data-index="a"></span>'], '']);
      assert.deepStrictEqual(inspect(parser(' [|a ]')), [['<span class="indexer" data-index="a"></span>'], '']);
      assert.deepStrictEqual(inspect(parser(' [|a  ]')), [['<span class="indexer" data-index="a"></span>'], '']);
      assert.deepStrictEqual(inspect(parser(' [|a b]')), [['<span class="indexer" data-index="a_b"></span>'], '']);
      assert.deepStrictEqual(inspect(parser(' [|a  b]')), [['<span class="indexer" data-index="a__b"></span>'], '']);
      assert.deepStrictEqual(inspect(parser(' [|a\tb]')), [['<span class="indexer" data-index="a_b=33Mw2l"></span>'], '']);
      assert.deepStrictEqual(inspect(parser(' [|a_b]')), [['<span class="indexer" data-index="a_b=2H8oCG"></span>'], '']);
      assert.deepStrictEqual(inspect(parser(' [|A]')), [['<span class="indexer" data-index="A"></span>'], '']);
      assert.deepStrictEqual(inspect(parser(' [|\\A]')), [['<span class="indexer" data-index="A"></span>'], '']);
      assert.deepStrictEqual(inspect(parser(' [|*A*]')), [['<span class="indexer" data-index="*A*"></span>'], '']);
      assert.deepStrictEqual(inspect(parser(' [|`A`]')), [['<span class="indexer" data-index="`A`"></span>'], '']);
      assert.deepStrictEqual(inspect(parser(' [|${A}$]')), [['<span class="indexer" data-index="${A}$"></span>'], '']);
      assert.deepStrictEqual(inspect(parser('  [|a]')), [['<span class="indexer" data-index="a"></span>'], '']);
    });

  });

});
