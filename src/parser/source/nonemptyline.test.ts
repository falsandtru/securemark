import { nonemptyline } from './nonemptyline';
import { loop } from '../../combinator';
import { inspect } from '../debug.test';

describe('Unit: parser/source/nonemptyline', () => {
  describe('nonemptyline', () => {
    const parser = loop(nonemptyline);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser(' ')), undefined);
      assert.deepStrictEqual(inspect(parser('\n')), undefined);
      assert.deepStrictEqual(inspect(parser(' \n')), undefined);
      assert.deepStrictEqual(inspect(parser('\n\n')), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('ab')), [['ab'], '']);
      assert.deepStrictEqual(inspect(parser('ab\n')), [['ab\n'], '']);
      assert.deepStrictEqual(inspect(parser('ab \n')), [['ab \n'], '']);
    });

  });

});
