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

    it('escape', () => {
      assert.deepStrictEqual(inspect(parser('\\!')), [['\\!'], '']);
      assert.deepStrictEqual(inspect(parser('\\[')), [['\\['], '']);
      assert.deepStrictEqual(inspect(parser('\\~')), [['\\~'], '']);
      assert.deepStrictEqual(inspect(parser('\\*')), [['\\*'], '']);
      assert.deepStrictEqual(inspect(parser('\\`')), [['\\', '`'], '']);
      assert.deepStrictEqual(inspect(parser('\\<')), [['\\&lt;'], '']);
      assert.deepStrictEqual(inspect(parser('\\\\!')), [['\\\\!'], '']);
    });

    it('tag', () => {
      assert.deepStrictEqual(inspect(parser('<')), [['&lt;'], '']);
      assert.deepStrictEqual(inspect(parser('<<')), [['&lt;&lt;'], '']);
      assert.deepStrictEqual(inspect(parser('<a')), [['&lt;a'], '']);
      assert.deepStrictEqual(inspect(parser('<a>')), [['&lt;a&gt;'], '']);
      assert.deepStrictEqual(inspect(parser('<a></a>')), [['&lt;a&gt;&lt;/a&gt;'], '']);
      assert.deepStrictEqual(inspect(parser('<a>a')), [['&lt;a&gt;a'], '']);
      assert.deepStrictEqual(inspect(parser('<a>a</a>')), [['&lt;a&gt;a&lt;/a&gt;'], '']);
    });

  });

});
