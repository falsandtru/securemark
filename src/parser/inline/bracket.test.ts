import { bracket } from './bracket';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/bracket', () => {
  describe('bracket', () => {
    const parser = (source: string) => some(bracket)(source, {});

    it('(', () => {
      assert.deepStrictEqual(inspect(parser('(')), [['('], '']);
      assert.deepStrictEqual(inspect(parser('()')), [['<span class="paren">()</span>'], '']);
      assert.deepStrictEqual(inspect(parser('(a')), [['(', 'a'], '']);
      assert.deepStrictEqual(inspect(parser('(\\a)')), [['<span class="paren">(a)</span>'], '']);
      assert.deepStrictEqual(inspect(parser(')')), undefined);
      assert.deepStrictEqual(inspect(parser('(0)')), [['(', '0', ')'], '']);
      assert.deepStrictEqual(inspect(parser('(1)')), [['(', '1', ')'], '']);
      assert.deepStrictEqual(inspect(parser('(10)')), [['(', '10', ')'], '']);
      assert.deepStrictEqual(inspect(parser('(2000)')), [['(', '2000', ')'], '']);
      assert.deepStrictEqual(inspect(parser('(0-1)')), [['<span class="paren">(0-1)</span>'], '']);
      assert.deepStrictEqual(inspect(parser('(0)-1')), [['(', '0', ')'], '-1']);
      assert.deepStrictEqual(inspect(parser('(0.1)')), [['(', '0.1', ')'], '']);
      assert.deepStrictEqual(inspect(parser('(0.1.2)')), [['(', '0.1.2', ')'], '']);
      assert.deepStrictEqual(inspect(parser('(a)')), [['(', 'a', ')'], '']);
      assert.deepStrictEqual(inspect(parser('(A)')), [['(', 'A', ')'], '']);
      assert.deepStrictEqual(inspect(parser('（０．１）（Ａ）')), [['（', '０．１', '）', '（', 'Ａ', '）'], '']);
    });

    it('[', () => {
      assert.deepStrictEqual(inspect(parser('[')), [['['], '']);
      assert.deepStrictEqual(inspect(parser('[]')), [['[', ']'], '']);
      assert.deepStrictEqual(inspect(parser('[a')), [['[', 'a'], '']);
      assert.deepStrictEqual(inspect(parser('[a]')), [['[', 'a', ']'], '']);
      assert.deepStrictEqual(inspect(parser(']')), undefined);
    });

    it('{', () => {
      assert.deepStrictEqual(inspect(parser('{')), [['{'], '']);
      assert.deepStrictEqual(inspect(parser('{}')), [['{', '}'], '']);
      assert.deepStrictEqual(inspect(parser('{a')), [['{', 'a'], '']);
      assert.deepStrictEqual(inspect(parser('{a}')), [['{', 'a', '}'], '']);
      assert.deepStrictEqual(inspect(parser('}')), undefined);
    });

    it('"', () => {
      assert.deepStrictEqual(inspect(parser('"')), [['"'], '']);
      assert.deepStrictEqual(inspect(parser('""')), [['"', '"'], '']);
      assert.deepStrictEqual(inspect(parser('"a')), [['"', 'a'], '']);
      assert.deepStrictEqual(inspect(parser('"a"')), [['"', 'a', '"'], '']);
      assert.deepStrictEqual(inspect(parser('"(")"')), [['"', '(', '"'], ')"']);
      assert.deepStrictEqual(inspect(parser('"(\\")"')), [['"', '<span class="paren">(")</span>', '"'], '']);
      assert.deepStrictEqual(inspect(parser('"(\n)"')), [['"', '<span class="paren">(<br>)</span>', '"'], '']);
      assert.deepStrictEqual(inspect(parser('"(\\\n)"')), [['"', '<span class="paren">(<span class="linebreak"> </span>)</span>', '"'], '']);
    });

  });

});
