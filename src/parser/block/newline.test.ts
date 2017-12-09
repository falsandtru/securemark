import { newline } from './newline';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/newline', () => {
  describe('newline', () => {
    const parser = newline;

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser(' ')), undefined);
      assert.deepStrictEqual(inspect(parser('a')), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('\n')), [[], '']);
      assert.deepStrictEqual(inspect(parser('\na')), [[], 'a']);
      assert.deepStrictEqual(inspect(parser('\n\n')), [[], '']);
      assert.deepStrictEqual(inspect(parser('\n\na')), [[], 'a']);
      assert.deepStrictEqual(inspect(parser('\n\n\n')), [[], '']);
      assert.deepStrictEqual(inspect(parser('\n\n\na')), [[], 'a']);
      assert.deepStrictEqual(inspect(parser('\\\n')), [[], '']);
      assert.deepStrictEqual(inspect(parser(' \n  \\\n')), [[], '']);
    });

  });

});
