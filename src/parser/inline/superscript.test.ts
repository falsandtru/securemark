import { loop } from '../../combinator/loop';
import { superscript } from './superscript';
import { inspect } from '../debug.test';

describe('Unit: parser/inline/superscript', () => {
  describe('superscript', () => {
    const parser = loop(superscript);

    it('invalid', () => {
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
      assert.deepStrictEqual(inspect(parser('^a^')), [['<sup>a</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('^ab^')), [['<sup>ab</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('^a b^')), [['<sup>a b</sup>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('^*a*^')), [['<sup>*a*</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('^<wbr>^')), [['<sup>&lt;wbr&gt;</sup>'], '']);
    });

  });

});
