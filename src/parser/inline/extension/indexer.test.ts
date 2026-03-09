import { indexer } from './indexer';
import { some } from '../../../combinator';
import { input } from '../../../combinator/data/parser';
import { Context } from '../../context';
import { inspect } from '../../../debug.test';

describe('Unit: parser/inline/extension/indexer', () => {
  describe('indexer', () => {
    const parser = some(indexer);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[|a]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input(' ', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input(' |', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input(' |a', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input(' [| ]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input(' [|]]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input(' [|a]]', new Context())), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser, input(' [|]', new Context())), [['<span class="indexer" data-index=""></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input(' [|a]', new Context())), [['<span class="indexer" data-index="a"></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input(' [|a] ', new Context())), [['<span class="indexer" data-index="a"></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input(' [|a ]', new Context())), [['<span class="indexer" data-index="a"></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input(' [|a  ]', new Context())), [['<span class="indexer" data-index="a"></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input(' [|a b]', new Context())), [['<span class="indexer" data-index="a_b"></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input(' [|a  b]', new Context())), [['<span class="indexer" data-index="a_b"></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input(' [|a\tb]', new Context())), [['<span class="indexer" data-index="a_b=33Mw2l"></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input(' [|a_b]', new Context())), [['<span class="indexer" data-index="a_b=2H8oCG"></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input(' [|A]', new Context())), [['<span class="indexer" data-index="A"></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input(' [|\\A]', new Context())), [['<span class="indexer" data-index="A"></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input(' [|*A*]', new Context())), [['<span class="indexer" data-index="*A*"></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input(' [|\\`A\\`]', new Context())), [['<span class="indexer" data-index="`A`"></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input(' [|\\$\\{A\\}\\$]', new Context())), [['<span class="indexer" data-index="${A}$"></span>'], '']);
    });

  });

});
