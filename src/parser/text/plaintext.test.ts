import { loop } from '../../combinator/loop';
import { plaintext } from './plaintext';
import { inspect } from '../debug.test';

describe('Unit: parser/pretext', () => {
  describe('pretext', () => {
    const parser = loop(plaintext);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), void 0);
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

    it('zalgo', () => {
      assert.deepStrictEqual(inspect(parser('\u0300\u036F')), [['\u0300'], '']);
      assert.deepStrictEqual(inspect(parser('\\\u0300\\\u036F')), [['\\', '\u0300', '\\', '\u036F'], '']);
      assert.deepStrictEqual(inspect(parser('a\u0300\u036F')), [['a', '\u0300'], '']);
    });

  });

});
