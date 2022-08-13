import { deletion } from './deletion';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/deletion', () => {
  describe('deletion', () => {
    const parser = (source: string) => some(deletion)({ source, context: {} });

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('~')), undefined);
      assert.deepStrictEqual(inspect(parser('~~')), undefined);
      assert.deepStrictEqual(inspect(parser('~~a')), [['~~', 'a'], '']);
      assert.deepStrictEqual(inspect(parser('~~a~')), [['~~', 'a', '~'], '']);
      assert.deepStrictEqual(inspect(parser(' ~~a~~')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('~~a~~')), [['<del>a</del>'], '']);
      assert.deepStrictEqual(inspect(parser('~~a~b~~')), [['<del>a~b</del>'], '']);
      assert.deepStrictEqual(inspect(parser('~~ ~~')), [['<del> </del>'], '']);
      assert.deepStrictEqual(inspect(parser('~~ a~~')), [['<del> a</del>'], '']);
      assert.deepStrictEqual(inspect(parser('~~ a ~~')), [['<del> a </del>'], '']);
      assert.deepStrictEqual(inspect(parser('~~  a  ~~')), [['<del>  a  </del>'], '']);
      assert.deepStrictEqual(inspect(parser('~~\na~~')), [['<del><br>a</del>'], '']);
      assert.deepStrictEqual(inspect(parser('~~\\\na~~')), [['<del><span class="linebreak"> </span>a</del>'], '']);
      assert.deepStrictEqual(inspect(parser('~~<wbr>a~~')), [['<del><wbr>a</del>'], '']);
      assert.deepStrictEqual(inspect(parser('~~a ~~')), [['<del>a </del>'], '']);
      assert.deepStrictEqual(inspect(parser('~~a \n ~~')), [['<del>a </del>'], '']);
      assert.deepStrictEqual(inspect(parser('~~a\n~~')), [['<del>a</del>'], '']);
      assert.deepStrictEqual(inspect(parser('~~a\n ~~')), [['<del>a </del>'], '']);
      assert.deepStrictEqual(inspect(parser('~~a\n<wbr>~~')), [['<del>a<wbr></del>'], '']);
      assert.deepStrictEqual(inspect(parser('~~a\nb~~')), [['<del>a<br>b</del>'], '']);
      assert.deepStrictEqual(inspect(parser('~~a\\\nb~~')), [['<del>a<span class="linebreak"> </span>b</del>'], '']);
      assert.deepStrictEqual(inspect(parser('~~\\~~~')), [['<del>~</del>'], '']);
      assert.deepStrictEqual(inspect(parser('~~a~~~')), [['<del>a</del>'], '~']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('~~_~~a~~_~~')), [['<del><em><del>a</del></em></del>'], '']);
      assert.deepStrictEqual(inspect(parser('~~_++a++_~~')), [['<del><em><ins>a</ins></em></del>'], '']);
    });

  });

});
