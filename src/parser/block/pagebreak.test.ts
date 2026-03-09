import { pagebreak } from './pagebreak';
import { some } from '../../combinator';
import { input } from '../../combinator/data/parser';
import { Context } from '../context';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/pagebreak', () => {
  describe('pagebreak', () => {
    const parser = some(pagebreak);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('\n', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('=', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('==', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('==\n=', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('===a', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('===\na', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('= = =', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input(' ===', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('---', new Context())), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser, input('===', new Context())), [['<hr>'], '']);
      assert.deepStrictEqual(inspect(parser, input('=== ', new Context())), [['<hr>'], '']);
      assert.deepStrictEqual(inspect(parser, input('===\n', new Context())), [['<hr>'], '']);
      assert.deepStrictEqual(inspect(parser, input('====', new Context())), [['<hr>'], '']);
    });

  });

});
