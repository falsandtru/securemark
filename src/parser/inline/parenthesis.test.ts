import { parenthesis } from './parenthesis';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/parenthesis', () => {
  describe('parenthesis', () => {
    const parser = some(parenthesis);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('(')), undefined);
      assert.deepStrictEqual(inspect(parser('(\\)')), undefined);
      assert.deepStrictEqual(inspect(parser('a(a)')), undefined);
    });

    it('empty', () => {
      assert.deepStrictEqual(inspect(parser('()')), [['()'], '']);
      assert.deepStrictEqual(inspect(parser('( )')), [['( )'], '']);
      assert.deepStrictEqual(inspect(parser('(\n)')), [['(', '<span class="newline"> </span>', ')'], '']);
      assert.deepStrictEqual(inspect(parser('(<wbr>)')), [['(', '<wbr>', ')'], '']);
    });

    it('ab', () => {
      assert.deepStrictEqual(inspect(parser('(a)')), [['(a)'], '']);
      assert.deepStrictEqual(inspect(parser('(ab)')), [['(ab)'], '']);
      assert.deepStrictEqual(inspect(parser('(a\nb)')), [['(a', '<span class="newline"> </span>', 'b)'], '']);
      assert.deepStrictEqual(inspect(parser('(a\\\nb)')), [['(a', '<br>', 'b)'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('(")')), [['(")'], '']);
      assert.deepStrictEqual(inspect(parser('(<a>)')), [['(<a>)'], '']);
      assert.deepStrictEqual(inspect(parser('(`a`)')), [['(', '<code data-src="`a`">a</code>', ')'], '']);
      assert.deepStrictEqual(inspect(parser('((a))')), [['((a))'], '']);
    });

  });

});
