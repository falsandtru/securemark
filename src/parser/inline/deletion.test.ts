import { deletion } from './deletion';
import { some } from '../../combinator';
import { input } from '../../combinator/data/parser';
import { Context } from '../context';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/deletion', () => {
  describe('deletion', () => {
    const parser = some(deletion);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('~', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('~~', new Context())), [['~~'], '']);
      assert.deepStrictEqual(inspect(parser, input('~~a', new Context())), [['~~', 'a'], '']);
      assert.deepStrictEqual(inspect(parser, input('~~a~', new Context())), [['~~', 'a~'], '']);
      assert.deepStrictEqual(inspect(parser, input(' ~~a~~', new Context())), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser, input('~~a~~', new Context())), [['<del>a</del>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~~a~b~~', new Context())), [['<del>a~b</del>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~~ ~~', new Context())), [['<del> </del>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~~ a~~', new Context())), [['<del> a</del>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~~ a ~~', new Context())), [['<del> a </del>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~~  a  ~~', new Context())), [['<del> a </del>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~~\na~~', new Context())), [['<del><br>a</del>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~~\\\na~~', new Context())), [['<del><br>a</del>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~~<wbr>a~~', new Context())), [['<del><wbr>a</del>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~~a ~~', new Context())), [['<del>a </del>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~~a \n ~~', new Context())), [['<del>a </del>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~~a\n~~', new Context())), [['<del>a</del>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~~a\n ~~', new Context())), [['<del>a </del>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~~a\n<wbr>~~', new Context())), [['<del>a<wbr></del>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~~a\nb~~', new Context())), [['<del>a<br>b</del>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~~a\\\nb~~', new Context())), [['<del>a<br>b</del>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~~\\~~~', new Context())), [['<del>~</del>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~~a~~~', new Context())), [['<del>a</del>'], '~']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser, input('~~*~~a~~*~~', new Context())), [['<del><em><del>a</del></em></del>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~~*++a++*~~', new Context())), [['<del><em><ins>a</ins></em></del>'], '']);
    });

  });

});
