import { pagebreak } from './pagebreak';
import { some } from '../../combinator';
import { input } from '../../combinator/data/parser';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/pagebreak', () => {
  describe('pagebreak', () => {
    const parser = (source: string) => some(pagebreak)(input(source, ctx));
    const { context: ctx } = input('', {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser(''), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('\n'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('='), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('=='), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('==\n='), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('===a'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('===\na'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('= = ='), ctx), undefined);
      assert.deepStrictEqual(inspect(parser(' ==='), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('---'), ctx), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('==='), ctx), [['<hr>'], '']);
      assert.deepStrictEqual(inspect(parser('=== '), ctx), [['<hr>'], '']);
      assert.deepStrictEqual(inspect(parser('===\n'), ctx), [['<hr>'], '']);
      assert.deepStrictEqual(inspect(parser('===='), ctx), [['<hr>'], '']);
    });

  });

});
