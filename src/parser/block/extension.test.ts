import { extension } from './extension';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/extension', () => {
  describe('extension', () => {
    const parser = some(extension);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('\n')), undefined);
      assert.deepStrictEqual(inspect(parser('~~~')), undefined);
      assert.deepStrictEqual(inspect(parser('~~~\n')), undefined);
      assert.deepStrictEqual(inspect(parser('~~~\na~~~')), undefined);
      assert.deepStrictEqual(inspect(parser(' ~~~\n~~~')), undefined);
    });

    it('valid', () => {
      assert(parser('~~~\n~~~'));
    });

  });

});
