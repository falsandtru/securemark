import { emptyline } from './emptyline';
import { loop } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/source/emptyline', () => {
  describe('emptyline', () => {
    const parser = loop(emptyline);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('ab')), undefined);
      assert.deepStrictEqual(inspect(parser('ab\n')), undefined);
      assert.deepStrictEqual(inspect(parser('ab \n')), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser(' ')), [[' '], '']);
      assert.deepStrictEqual(inspect(parser('\n')), [['\n'], '']);
      assert.deepStrictEqual(inspect(parser(' \n')), [[' \n'], '']);
      assert.deepStrictEqual(inspect(parser('\n\n')), [['\n', '\n'], '']);
    });

  });

});
