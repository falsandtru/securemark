import { indexer } from './indexer';
import { some } from '../../../combinator';
import { input } from '../../../combinator/data/parser';
import { inspect } from '../../../debug.test';

describe('Unit: parser/inline/extension/indexer', () => {
  describe('indexer', () => {
    const parser = (source: string) => some(indexer)(input(source, ctx));
    const { context: ctx } = input('', {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser(''), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[|a]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser(' '), ctx), undefined);
      assert.deepStrictEqual(inspect(parser(' |'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser(' |a'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser(' [| ]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser(' [|]]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser(' [|a]]'), ctx), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser(' [|]'), ctx), [['<span class="indexer" data-index=""></span>'], '']);
      assert.deepStrictEqual(inspect(parser(' [|a]'), ctx), [['<span class="indexer" data-index="a"></span>'], '']);
      assert.deepStrictEqual(inspect(parser(' [|a] '), ctx), [['<span class="indexer" data-index="a"></span>'], '']);
      assert.deepStrictEqual(inspect(parser(' [|a ]'), ctx), [['<span class="indexer" data-index="a"></span>'], '']);
      assert.deepStrictEqual(inspect(parser(' [|a  ]'), ctx), [['<span class="indexer" data-index="a"></span>'], '']);
      assert.deepStrictEqual(inspect(parser(' [|a b]'), ctx), [['<span class="indexer" data-index="a_b"></span>'], '']);
      assert.deepStrictEqual(inspect(parser(' [|a  b]'), ctx), [['<span class="indexer" data-index="a__b"></span>'], '']);
      assert.deepStrictEqual(inspect(parser(' [|a\tb]'), ctx), [['<span class="indexer" data-index="a_b=33Mw2l"></span>'], '']);
      assert.deepStrictEqual(inspect(parser(' [|a_b]'), ctx), [['<span class="indexer" data-index="a_b=2H8oCG"></span>'], '']);
      assert.deepStrictEqual(inspect(parser(' [|A]'), ctx), [['<span class="indexer" data-index="A"></span>'], '']);
      assert.deepStrictEqual(inspect(parser(' [|\\A]'), ctx), [['<span class="indexer" data-index="A"></span>'], '']);
      assert.deepStrictEqual(inspect(parser(' [|*A*]'), ctx), [['<span class="indexer" data-index="*A*"></span>'], '']);
      assert.deepStrictEqual(inspect(parser(' [|`A`]'), ctx), [['<span class="indexer" data-index="`A`"></span>'], '']);
      assert.deepStrictEqual(inspect(parser(' [|${A}$]'), ctx), [['<span class="indexer" data-index="${A}$"></span>'], '']);
      assert.deepStrictEqual(inspect(parser('  [|a]'), ctx), [['<span class="indexer" data-index="a"></span>'], '']);
    });

  });

});
