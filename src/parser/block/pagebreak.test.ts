import { pagebreak } from './pagebreak';
import { some } from '../../combinator';
import { input } from '../context';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/pagebreak', () => {
  describe('pagebreak', () => {
    const parser = some(pagebreak);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('')), undefined);
      assert.deepStrictEqual(inspect(parser, input('\n')), undefined);
      assert.deepStrictEqual(inspect(parser, input('=')), undefined);
      assert.deepStrictEqual(inspect(parser, input('==')), undefined);
      assert.deepStrictEqual(inspect(parser, input('==\n=')), undefined);
      assert.deepStrictEqual(inspect(parser, input('===a')), undefined);
      assert.deepStrictEqual(inspect(parser, input('===\na')), undefined);
      assert.deepStrictEqual(inspect(parser, input('= = =')), undefined);
      assert.deepStrictEqual(inspect(parser, input(' ===')), undefined);
      assert.deepStrictEqual(inspect(parser, input('---')), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser, input('===')), [['<hr>'], '']);
      assert.deepStrictEqual(inspect(parser, input('=== ')), [['<hr>'], '']);
      assert.deepStrictEqual(inspect(parser, input('===\n')), [['<hr>'], '']);
      assert.deepStrictEqual(inspect(parser, input('====')), [['<hr>'], '']);
    });

  });

});
