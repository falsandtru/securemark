import { unescsource } from './unescapable';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/source/unescapable', () => {
  describe('unescsource', () => {
    const parser = some(unescsource);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
    });

    it('ab', () => {
      assert.deepStrictEqual(inspect(parser('a')), [['a'], '']);
      assert.deepStrictEqual(inspect(parser('ab')), [['ab'], '']);
    });

    it('`', () => {
      assert.deepStrictEqual(inspect(parser('``')), [['`', '`'], '']);
    });

    it('newline', () => {
      assert.deepStrictEqual(inspect(parser('\n\n')), [['\n', '\n'], '']);
    });

    it('\\', () => {
      assert.deepStrictEqual(inspect(parser('\\')), [['\\'], '']);
      assert.deepStrictEqual(inspect(parser('\\\\')), [['\\\\'], '']);
      assert.deepStrictEqual(inspect(parser('\\\\\\')), [['\\\\\\'], '']);
      assert.deepStrictEqual(inspect(parser('\\\\\\\\')), [['\\\\\\\\'], '']);
      assert.deepStrictEqual(inspect(parser('\\0')), [['\\0'], '']);
      assert.deepStrictEqual(inspect(parser('\\a')), [['\\a'], '']);
      assert.deepStrictEqual(inspect(parser('\\\n')), [['\\', '\n'], '']);
    });

  });

});
