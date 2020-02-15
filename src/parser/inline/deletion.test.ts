import { deletion } from './deletion';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/deletion', () => {
  describe('deletion', () => {
    const parser = (source: string) => some(deletion)(source, {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('~')), undefined);
      assert.deepStrictEqual(inspect(parser('~~')), undefined);
      assert.deepStrictEqual(inspect(parser('~~a')), [['~~', 'a'], '']);
      assert.deepStrictEqual(inspect(parser('~~a~')), [['~~', 'a', '~'], '']);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('~~a~~')), [['<del>a</del>'], '']);
      assert.deepStrictEqual(inspect(parser('~~a~~~')), [['<del>a</del>'], '~']);
      assert.deepStrictEqual(inspect(parser('~~a ~~')), [['<del>a </del>'], '']);
      assert.deepStrictEqual(inspect(parser('~~ a~~')), [['<del> a</del>'], '']);
      assert.deepStrictEqual(inspect(parser('~~ a ~~')), [['<del> a </del>'], '']);
      assert.deepStrictEqual(inspect(parser('~~ ~~')), [['<del> </del>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~a~~')), [['<del>~a</del>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~a~~~')), [['<del>~a</del>'], '~']);
      assert.deepStrictEqual(inspect(parser('~~\n~~')), [['<del><br></del>'], '']);
      assert.deepStrictEqual(inspect(parser('~~\\\n~~')), [['<del><span class="linebreak"> </span></del>'], '']);
      assert.deepStrictEqual(inspect(parser('~~<wbr>~~')), [['<del><wbr></del>'], '']);
      assert.deepStrictEqual(inspect(parser('~~ab~~')), [['<del>ab</del>'], '']);
      assert.deepStrictEqual(inspect(parser('~~a\nb~~')), [['<del>a<br>b</del>'], '']);
      assert.deepStrictEqual(inspect(parser('~~a\\\nb~~')), [['<del>a<span class="linebreak"> </span>b</del>'], '']);
      assert.deepStrictEqual(inspect(parser('~~\\~~~')), [['<del>~</del>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('~~*~~a~~*~~')), [['<del><em><del>a</del></em></del>'], '']);
      assert.deepStrictEqual(inspect(parser('~~*++a++*~~')), [['<del><em><ins>a</ins></em></del>'], '']);
    });

  });

});
