import { indexer } from './indexer';
import { some } from '../../../combinator';
import { input } from '../../context';
import { inspect } from '../../../debug.test';

describe('Unit: parser/inline/extension/indexer', () => {
  describe('indexer', () => {
    const parser = some(indexer);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[|a]')), undefined);
      assert.deepStrictEqual(inspect(parser, input(' ')), undefined);
      assert.deepStrictEqual(inspect(parser, input(' |')), undefined);
      assert.deepStrictEqual(inspect(parser, input(' |a')), undefined);
      assert.deepStrictEqual(inspect(parser, input(' [| ]')), undefined);
      assert.deepStrictEqual(inspect(parser, input(' [|]]')), undefined);
      assert.deepStrictEqual(inspect(parser, input(' [|a]]')), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser, input(' [|]')), [['<span class="indexer" data-index=""></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input(' [|a]')), [['<span class="indexer" data-index="a"></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input(' [|a] ')), [['<span class="indexer" data-index="a"></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input(' [|a ]')), [['<span class="indexer" data-index="a"></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input(' [|a  ]')), [['<span class="indexer" data-index="a"></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input(' [|a b]')), [['<span class="indexer" data-index="a_b"></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input(' [|a  b]')), [['<span class="indexer" data-index="a_b"></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input(' [|a\tb]')), [['<span class="indexer" data-index="a_b=33Mw2l"></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input(' [|a_b]')), [['<span class="indexer" data-index="a_b=2H8oCG"></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input(' [|A]')), [['<span class="indexer" data-index="A"></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input(' [|\\A]')), [['<span class="indexer" data-index="A"></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input(' [|*A*]')), [['<span class="indexer" data-index="*A*"></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input(' [|\\`A\\`]')), [['<span class="indexer" data-index="`A`"></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input(' [|\\$\\{A\\}\\$]')), [['<span class="indexer" data-index="${A}$"></span>'], '']);
    });

  });

});
