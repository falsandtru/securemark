import { nonemptylines } from './nonemptyline';
import { inspect } from '../../debug.test';

describe('Unit: parser/source/nonemptyline', () => {
  describe('nonemptyline', () => {
    const parser = nonemptylines;

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser(' ')), undefined);
      assert.deepStrictEqual(inspect(parser('\n')), undefined);
      assert.deepStrictEqual(inspect(parser(' \n')), undefined);
      assert.deepStrictEqual(inspect(parser('\n\n')), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('a')), [[], '']);
      assert.deepStrictEqual(inspect(parser('a ')), [[], '']);
      assert.deepStrictEqual(inspect(parser(' a')), [[], '']);
      assert.deepStrictEqual(inspect(parser(' a ')), [[], '']);
      assert.deepStrictEqual(inspect(parser(' a\n')), [[], '']);
      assert.deepStrictEqual(inspect(parser(' a \n')), [[], '']);
      assert.deepStrictEqual(inspect(parser('ab')), [[], '']);
      assert.deepStrictEqual(inspect(parser('a\nb')), [[], '']);
    });

  });

});
