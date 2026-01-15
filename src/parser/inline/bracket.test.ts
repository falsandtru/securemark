import { bracket } from './bracket';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/bracket', () => {
  describe('bracket', () => {
    const parser = (source: string) => some(bracket)({ source, context: {} });

    it('(', () => {
      assert.deepStrictEqual(inspect(parser('(')), [['('], '']);
      assert.deepStrictEqual(inspect(parser('()')), [['<span class="paren">()</span>'], '']);
      assert.deepStrictEqual(inspect(parser('(a')), [['(', 'a'], '']);
      assert.deepStrictEqual(inspect(parser('(0)')), [['(', '0', ')'], '']);
      assert.deepStrictEqual(inspect(parser('(1)')), [['(', '1', ')'], '']);
      assert.deepStrictEqual(inspect(parser('(10)')), [['(', '10', ')'], '']);
      assert.deepStrictEqual(inspect(parser('(2000)')), [['(', '2000', ')'], '']);
      assert.deepStrictEqual(inspect(parser('(0-1)')), [['(', '0-1', ')'], '']);
      assert.deepStrictEqual(inspect(parser('(0)-1')), [['(', '0', ')'], '-1']);
      assert.deepStrictEqual(inspect(parser('(0.1)')), [['(', '0.1', ')'], '']);
      assert.deepStrictEqual(inspect(parser('(0.1.2)')), [['(', '0.1.2', ')'], '']);
      assert.deepStrictEqual(inspect(parser('(1.1, 1.2-1.3, 1.4)')), [['(', '1.1, 1.2-1.3, 1.4', ')'], '']);
      assert.deepStrictEqual(inspect(parser('(1 2)')), [['<span class="paren">(1 2)</span>'], '']);
      assert.deepStrictEqual(inspect(parser('(1, 2)')), [['(', '1, 2', ')'], '']);
      assert.deepStrictEqual(inspect(parser('(1a)')), [['(', '1a', ')'], '']);
      assert.deepStrictEqual(inspect(parser('(a)')), [['(', 'a', ')'], '']);
      assert.deepStrictEqual(inspect(parser('(a1)')), [['(', 'a1', ')'], '']);
      assert.deepStrictEqual(inspect(parser('(a-1)')), [['(', 'a-1', ')'], '']);
      assert.deepStrictEqual(inspect(parser('(a.1)')), [['(', 'a.1', ')'], '']);
      assert.deepStrictEqual(inspect(parser('(a b)')), [['<span class="paren">(a b)</span>'], '']);
      assert.deepStrictEqual(inspect(parser('(word)')), [['(', 'word', ')'], '']);
      assert.deepStrictEqual(inspect(parser('(word word)')), [['<span class="paren">(word word)</span>'], '']);
      assert.deepStrictEqual(inspect(parser('(word, word)')), [['(', 'word, word', ')'], '']);
      assert.deepStrictEqual(inspect(parser('(A)')), [['(', 'A', ')'], '']);
      assert.deepStrictEqual(inspect(parser('(Name)')), [['(', 'Name', ')'], '']);
      assert.deepStrictEqual(inspect(parser('(Word word)')), [['<span class="paren">(Word word)</span>'], '']);
      assert.deepStrictEqual(inspect(parser('(Word Word)')), [['<span class="paren">(Word Word)</span>'], '']);
      assert.deepStrictEqual(inspect(parser('(Name, Name)')), [['(', 'Name, Name', ')'], '']);
      assert.deepStrictEqual(inspect(parser('(ABBR)')), [['(', 'ABBR', ')'], '']);
      assert.deepStrictEqual(inspect(parser('(ABBR, ABBR)')), [['(', 'ABBR, ABBR', ')'], '']);
      assert.deepStrictEqual(inspect(parser('(\\a)')), [['<span class="paren">(a)</span>'], '']);
      assert.deepStrictEqual(inspect(parser('(==)')), [['<span class="paren">(==)</span>'], '']);
      assert.deepStrictEqual(inspect(parser('($)$')), [['(', '<span class="math" translate="no" data-src="$)$">$)$</span>'], '']);
      assert.deepStrictEqual(inspect(parser(')')), undefined);
      assert.deepStrictEqual(inspect(parser('（１，２）')), [['（', '１，２', '）'], '']);
      assert.deepStrictEqual(inspect(parser('（０－１）')), [['（', '０－１', '）'], '']);
      assert.deepStrictEqual(inspect(parser('（０．１）')), [['（', '０．１', '）'], '']);
      assert.deepStrictEqual(inspect(parser('（ａ）')), [['（', 'ａ', '）'], '']);
      assert.deepStrictEqual(inspect(parser('（Ａ）')), [['（', 'Ａ', '）'], '']);
      assert.deepStrictEqual(inspect(parser('（Ａ，Ｂ）')), [['（', 'Ａ，Ｂ', '）'], '']);
      assert.deepStrictEqual(inspect(parser('（Ａ、Ｂ）')), [['（', 'Ａ、Ｂ', '）'], '']);
      assert.deepStrictEqual(inspect(parser('(<bdi>a\\\nb</bdi>)')), [['<span class="paren">(<bdi>a<br>b</bdi>)</span>'], '']);
      assert.deepStrictEqual(inspect(parser('([% a\\\nb %])')), [['<span class="paren">(<span class="remark"><input type="checkbox"><span>[% a<br>b %]</span></span>)</span>'], '']);
      assert.deepStrictEqual(inspect(parser('({{\\\n}})')), [['<span class="paren">(<span class="template">{{\\\n}}</span>)</span>'], '']);
    });

    it('[', () => {
      assert.deepStrictEqual(inspect(parser('[')), [['['], '']);
      assert.deepStrictEqual(inspect(parser('[]')), [['[', ']'], '']);
      assert.deepStrictEqual(inspect(parser('[a')), [['[', 'a'], '']);
      assert.deepStrictEqual(inspect(parser('[a]')), [['[', 'a', ']'], '']);
      assert.deepStrictEqual(inspect(parser('[==]')), [['[', '=', '=', ']'], '']);
      assert.deepStrictEqual(inspect(parser('[$]$')), [['[', '<span class="math" translate="no" data-src="$]$">$]$</span>'], '']);
      assert.deepStrictEqual(inspect(parser(']')), undefined);
    });

    it('{', () => {
      assert.deepStrictEqual(inspect(parser('{')), [['{'], '']);
      assert.deepStrictEqual(inspect(parser('{}')), [['{', '}'], '']);
      assert.deepStrictEqual(inspect(parser('{a')), [['{', 'a'], '']);
      assert.deepStrictEqual(inspect(parser('{a}')), [['{', 'a', '}'], '']);
      assert.deepStrictEqual(inspect(parser('{==}')), [['{', '=', '=', '}'], '']);
      assert.deepStrictEqual(inspect(parser('}')), undefined);
    });

    it('"', () => {
      assert.deepStrictEqual(inspect(parser('"')), [['"'], '']);
      assert.deepStrictEqual(inspect(parser('""')), [['"', '"'], '']);
      assert.deepStrictEqual(inspect(parser('"a')), [['"', 'a'], '']);
      assert.deepStrictEqual(inspect(parser('"a"')), [['"', 'a', '"'], '']);
      assert.deepStrictEqual(inspect(parser('"(")"')), [['"', '(', '"'], ')"']);
      assert.deepStrictEqual(inspect(parser('"(("')), [['"', '(', '(', '"'], '']);
      assert.deepStrictEqual(inspect(parser('"(\\")"')), [['"', '<span class="paren">(")</span>', '"'], '']);
    });

  });

});
