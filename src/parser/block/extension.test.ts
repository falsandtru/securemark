import { extension } from './extension';
import { loop } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/extension', () => {
  describe('extension', () => {
    const parser = loop(extension);

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
