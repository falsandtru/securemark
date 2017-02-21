import { loop } from '../../combinator/loop';
import { superscript } from './superscript';
import { inspect } from '../debug.test';

describe('Unit: parser/superscript', () => {
  describe('superscript', () => {
    it('invalid', () => {
      const parser = loop(superscript);
      assert.deepStrictEqual(inspect(parser('')), void 0);
      assert.deepStrictEqual(inspect(parser('^')), void 0);
      assert.deepStrictEqual(inspect(parser('^^')), void 0);
      assert.deepStrictEqual(inspect(parser('^ ^')), void 0);
      assert.deepStrictEqual(inspect(parser('^ a^')), void 0);
      assert.deepStrictEqual(inspect(parser('^a ^')), void 0);
      assert.deepStrictEqual(inspect(parser('^ a ^')), void 0);
      assert.deepStrictEqual(inspect(parser('^\n^')), void 0);
      assert.deepStrictEqual(inspect(parser('^a\nb^')), void 0);
      assert.deepStrictEqual(inspect(parser('^^a^^')), void 0);
      assert.deepStrictEqual(inspect(parser('a^a^')), void 0);
    });

    it('ab', () => {
      const parser = loop(superscript);
      assert.deepStrictEqual(inspect(parser('^a^')), [['<sup>a</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('^ab^')), [['<sup>ab</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('^a b^')), [['<sup>a b</sup>'], '']);
    });

    it('nest', () => {
      const parser = loop(superscript);
      assert.deepStrictEqual(inspect(parser('^*a*^')), [['<sup>*a*</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('^<u>^')), [['<sup>&lt;u&gt;</sup>'], '']);
    });

  });

});
