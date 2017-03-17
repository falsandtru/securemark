import { loop } from '../../combinator/loop';
import { parenthesis } from './parenthesis';
import { inspect } from '../debug.test';

describe('Unit: parser/parenthesis', () => {
  describe('parenthesis', () => {
    const parser = loop(parenthesis);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), void 0);
      assert.deepStrictEqual(inspect(parser('(')), void 0);
      assert.deepStrictEqual(inspect(parser('(\\)')), void 0);
      assert.deepStrictEqual(inspect(parser('a(a)')), void 0);
    });

    it('empty', () => {
      assert.deepStrictEqual(inspect(parser('()')), [['()'], '']);
      assert.deepStrictEqual(inspect(parser('( )')), [['( )'], '']);
      assert.deepStrictEqual(inspect(parser('(\n)')), [['()'], '']);
      assert.deepStrictEqual(inspect(parser('(<wbr>)')), [['(', '<wbr>', ')'], '']);
    });

    it('ab', () => {
      assert.deepStrictEqual(inspect(parser('(a)')), [['(a)'], '']);
      assert.deepStrictEqual(inspect(parser('(ab)')), [['(ab)'], '']);
      assert.deepStrictEqual(inspect(parser('(a\nb)')), [['(ab)'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('(")')), [['(")'], '']);
      assert.deepStrictEqual(inspect(parser('(<a>)')), [['(&lt;a&gt;)'], '']);
      assert.deepStrictEqual(inspect(parser('(`<wbr>`)')), [['(', '<code>&lt;wbr&gt;</code>', ')'], '']);
      assert.deepStrictEqual(inspect(parser('([](#))')), [['(', '<a href="#">#</a>', ')'], '']);
      assert.deepStrictEqual(inspect(parser('((a))')), [['((a))'], '']);
    });

  });

});
