import { deletion } from './deletion';
import { some } from '../../combinator';
import { input } from '../../combinator/data/parser';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/deletion', () => {
  describe('deletion', () => {
    const parser = (source: string) => some(deletion)(input(source, ctx));
    const { context: ctx } = input('', {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser(''), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('~'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('~~'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('~~a'), ctx), [['~~', 'a'], '']);
      assert.deepStrictEqual(inspect(parser('~~a~'), ctx), [['~~', 'a', '~'], '']);
      assert.deepStrictEqual(inspect(parser(' ~~a~~'), ctx), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('~~a~~'), ctx), [['<del>a</del>'], '']);
      assert.deepStrictEqual(inspect(parser('~~a~b~~'), ctx), [['<del>a~b</del>'], '']);
      assert.deepStrictEqual(inspect(parser('~~ ~~'), ctx), [['<del> </del>'], '']);
      assert.deepStrictEqual(inspect(parser('~~ a~~'), ctx), [['<del> a</del>'], '']);
      assert.deepStrictEqual(inspect(parser('~~ a ~~'), ctx), [['<del> a </del>'], '']);
      assert.deepStrictEqual(inspect(parser('~~  a  ~~'), ctx), [['<del>  a  </del>'], '']);
      assert.deepStrictEqual(inspect(parser('~~\na~~'), ctx), [['<del><br>a</del>'], '']);
      assert.deepStrictEqual(inspect(parser('~~\\\na~~'), ctx), [['<del><br>a</del>'], '']);
      assert.deepStrictEqual(inspect(parser('~~<wbr>a~~'), ctx), [['<del><wbr>a</del>'], '']);
      assert.deepStrictEqual(inspect(parser('~~a ~~'), ctx), [['<del>a </del>'], '']);
      assert.deepStrictEqual(inspect(parser('~~a \n ~~'), ctx), [['<del>a  </del>'], '']);
      assert.deepStrictEqual(inspect(parser('~~a\n~~'), ctx), [['<del>a</del>'], '']);
      assert.deepStrictEqual(inspect(parser('~~a\n ~~'), ctx), [['<del>a </del>'], '']);
      assert.deepStrictEqual(inspect(parser('~~a\n<wbr>~~'), ctx), [['<del>a<wbr></del>'], '']);
      assert.deepStrictEqual(inspect(parser('~~a\nb~~'), ctx), [['<del>a<br>b</del>'], '']);
      assert.deepStrictEqual(inspect(parser('~~a\\\nb~~'), ctx), [['<del>a<br>b</del>'], '']);
      assert.deepStrictEqual(inspect(parser('~~\\~~~'), ctx), [['<del>~</del>'], '']);
      assert.deepStrictEqual(inspect(parser('~~a~~~'), ctx), [['<del>a</del>'], '~']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('~~*~~a~~*~~'), ctx), [['<del><em><del>a</del></em></del>'], '']);
      assert.deepStrictEqual(inspect(parser('~~*++a++*~~'), ctx), [['<del><em><ins>a</ins></em></del>'], '']);
    });

  });

});
