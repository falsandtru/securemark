import { newline } from './newline';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/newline', () => {
  describe('newline', () => {
    const parser = (source: string) => newline(source, {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('a')), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser(' ')), [[], '']);
      assert.deepStrictEqual(inspect(parser('\n')), [[], '']);
      assert.deepStrictEqual(inspect(parser('\\ ')), [[], '']);
      assert.deepStrictEqual(inspect(parser('\\\n')), [[], '']);
      assert.deepStrictEqual(inspect(parser(' \n\\ \\\n')), [[], '']);
    });

  });

});
