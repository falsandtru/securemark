import { deletion } from './deletion';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/deletion', () => {
  describe('deletion', () => {
    const parser = some(deletion);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('~')), undefined);
      assert.deepStrictEqual(inspect(parser('~~')), undefined);
      assert.deepStrictEqual(inspect(parser('~~~')), undefined);
      assert.deepStrictEqual(inspect(parser('~~~~')), undefined);
      assert.deepStrictEqual(inspect(parser('~~~~~')), undefined);
      assert.deepStrictEqual(inspect(parser('a~~a~~')), undefined);
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
      assert.deepStrictEqual(inspect(parser('~~a~~b~~~~')), [['<del>a</del>'], 'b~~~~']);
      assert.deepStrictEqual(inspect(parser('~~~~a~~b~~')), undefined);
      assert.deepStrictEqual(inspect(parser('~~~~a~~b~~c~~~~')), undefined);
      assert.deepStrictEqual(inspect(parser('~~*~~a~~*~~')), undefined);
    });

  });

});
