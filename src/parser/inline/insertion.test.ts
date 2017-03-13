import { loop } from '../../combinator/loop';
import { insertion } from './insertion';
import { inspect } from '../debug.test';

describe('Unit: parser/insertion', () => {
  describe('insertion', () => {
    const parser = loop(insertion);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), void 0);
      assert.deepStrictEqual(inspect(parser('+')), void 0);
      assert.deepStrictEqual(inspect(parser('++')), void 0);
      assert.deepStrictEqual(inspect(parser('+++')), void 0);
      assert.deepStrictEqual(inspect(parser('++++')), void 0);
      assert.deepStrictEqual(inspect(parser('++ ++')), void 0);
      assert.deepStrictEqual(inspect(parser('++\n++')), void 0);
      assert.deepStrictEqual(inspect(parser('++<wbr>++')), void 0);
      assert.deepStrictEqual(inspect(parser('++++a++++')), void 0);
      assert.deepStrictEqual(inspect(parser('a++a++')), void 0);
    });

    it('ab', () => {
      assert.deepStrictEqual(inspect(parser('++a++')), [['<ins>a</ins>'], '']);
      assert.deepStrictEqual(inspect(parser('++ab++')), [['<ins>ab</ins>'], '']);
      assert.deepStrictEqual(inspect(parser('++a\nb++')), [['<ins>ab</ins>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('++<a>++')), [['<ins>&lt;a&gt;</ins>'], '']);
      assert.deepStrictEqual(inspect(parser('++`<wbr>`++')), [['<ins><code>&lt;wbr&gt;</code></ins>'], '']);
      assert.deepStrictEqual(inspect(parser('++[](#)++')), [['<ins><a href="#">#</a></ins>'], '']);
    });

  });

});
