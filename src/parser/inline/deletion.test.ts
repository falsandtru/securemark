import { deletion } from './deletion';
import { some } from '../../combinator';
import { input } from '../context';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/deletion', () => {
  describe('deletion', () => {
    const parser = some(deletion);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('')), undefined);
      assert.deepStrictEqual(inspect(parser, input('~')), undefined);
      assert.deepStrictEqual(inspect(parser, input('~~')), [['~~'], '']);
      assert.deepStrictEqual(inspect(parser, input('~~a')), [['~~', 'a'], '']);
      assert.deepStrictEqual(inspect(parser, input('~~a~')), [['~~', 'a~'], '']);
      assert.deepStrictEqual(inspect(parser, input(' ~~a~~')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser, input('~~a~~')), [['<del>a</del>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~~a~b~~')), [['<del>a~b</del>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~~ ~~')), [['<del> </del>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~~ a~~')), [['<del> a</del>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~~ a ~~')), [['<del> a </del>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~~  a  ~~')), [['<del> a </del>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~~\na~~')), [['<del><br>a</del>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~~\\\na~~')), [['<del><br>a</del>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~~<wbr>a~~')), [['<del><wbr>a</del>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~~a ~~')), [['<del>a </del>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~~a \n ~~')), [['<del>a </del>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~~a\n~~')), [['<del>a</del>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~~a\n ~~')), [['<del>a </del>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~~a\n<wbr>~~')), [['<del>a<wbr></del>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~~a\nb~~')), [['<del>a<br>b</del>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~~a\\\nb~~')), [['<del>a<br>b</del>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~~\\~~~')), [['<del>~</del>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~~a~~~')), [['<del>a</del>'], '~']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser, input('~~*~~a~~*~~')), [['<del><em><del>a</del></em></del>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~~*++a++*~~')), [['<del><em><ins>a</ins></em></del>'], '']);
    });

  });

});
