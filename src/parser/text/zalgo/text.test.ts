import { loop } from '../../../combinator/loop';
import { zalgo } from './text';
import { inspect } from '../../debug.test';

describe('Unit: parser/zalgo/text', () => {
  describe('zalgo', () => {
    const parser = loop(zalgo);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), void 0);
      assert.deepStrictEqual(inspect(parser('a')), void 0);
      assert.deepStrictEqual(inspect(parser('a\u0300')), void 0);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('\u0300')), [['\u0300'], '']);
      assert.deepStrictEqual(inspect(parser('\u036F')), [['\u036F'], '']);
      assert.deepStrictEqual(inspect(parser('\u0300\u036F')), [['\u0300'], '']);
      assert.deepStrictEqual(inspect(parser('\u0300a\u036F')), [['\u0300'], 'a\u036F']);
    });

    it('\\', () => {
      assert.deepStrictEqual(inspect(parser('\\')), void 0);
      assert.deepStrictEqual(inspect(parser('\\a')), void 0);
      assert.deepStrictEqual(inspect(parser('\\\u0300')), [['\u0300'], '']);
      assert.deepStrictEqual(inspect(parser('\\\u0300a')), [['\u0300'], 'a']);
      assert.deepStrictEqual(inspect(parser('\\\u0300\u036F')), [['\u0300'], '']);
      assert.deepStrictEqual(inspect(parser('\\\u0300\\')), [['\u0300'], '\\']);
      assert.deepStrictEqual(inspect(parser('\\\u0300\\a')), [['\u0300'], '\\a']);
      assert.deepStrictEqual(inspect(parser('\\\u0300\\\u036F')), [['\u0300'], '']);
      assert.deepStrictEqual(inspect(parser('\\\\\u0300')), void 0);
    });

  });

});
