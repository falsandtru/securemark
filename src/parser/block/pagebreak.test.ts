import { pagebreak } from './pagebreak';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/pagebreak', () => {
  describe('pagebreak', () => {
    const parser = (source: string) => some(pagebreak)({ source, context: {} });

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('\n')), undefined);
      assert.deepStrictEqual(inspect(parser('=')), undefined);
      assert.deepStrictEqual(inspect(parser('==')), undefined);
      assert.deepStrictEqual(inspect(parser('==\n=')), undefined);
      assert.deepStrictEqual(inspect(parser('===a')), undefined);
      assert.deepStrictEqual(inspect(parser('===\na')), undefined);
      assert.deepStrictEqual(inspect(parser('= = =')), undefined);
      assert.deepStrictEqual(inspect(parser(' ===')), undefined);
      assert.deepStrictEqual(inspect(parser('---')), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('===')), [['<hr>'], '']);
      assert.deepStrictEqual(inspect(parser('=== ')), [['<hr>'], '']);
      assert.deepStrictEqual(inspect(parser('===\n')), [['<hr>'], '']);
      assert.deepStrictEqual(inspect(parser('====')), [['<hr>'], '']);
    });

  });

});
