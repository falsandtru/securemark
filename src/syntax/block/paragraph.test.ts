import { loop } from '../../parser/loop';
import { paragraph } from './paragraph';
import { inspect } from '../debug.test';

describe('Unit: syntax/paragraph', () => {
  describe('paragraph', () => {
    it('invalid', () => {
      const parser = loop(paragraph);
      assert.deepStrictEqual(inspect(parser('')), void 0);
    });

    it('ab', () => {
      const parser = loop(paragraph);
      assert.deepStrictEqual(inspect(parser('a')), [['<p>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser('ab')), [['<p>ab</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\n')), [['<p>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\nb')), [['<p>ab</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\n\n')), [['<p>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\n\nb')), [['<p>a</p>', '<p>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\n\n\nb')), [['<p>a</p>'], '\nb']);
    });

  });

});
