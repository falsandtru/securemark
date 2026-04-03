import { bracket } from './bracket';
import { some } from '../../combinator';
import { input } from '../context';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/bracket', () => {
  describe('bracket', () => {
    const parser = some(bracket);

    it('(', () => {
      assert.deepStrictEqual(inspect(parser, input('(')), [['<span class="paren">(</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('()')), [['<span class="paren">()</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(a')), [['<span class="paren">(a</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(0)')), [['<span class="paren">(0)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(1)')), [['<span class="paren">(1)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(10)')), [['<span class="paren">(10)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(2000)')), [['<span class="paren">(2000)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(0-1)')), [['<span class="paren">(0-1)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(0)-1')), [['<span class="paren">(0)</span>'], '-1']);
      assert.deepStrictEqual(inspect(parser, input('(0.1)')), [['<span class="paren">(0.1)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(0.1.2)')), [['<span class="paren">(0.1.2)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(1, 2)')), [['<span class="paren">(1, 2)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(1.1-1.2)')), [['<span class="paren">(1.1-1.2)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(1.1, 1.2)')), [['<span class="paren">(1.1, 1.2)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(1 2)')), [['<span class="paren">(1 2)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(1a)')), [['<span class="paren">(1a)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(a)')), [['<span class="paren">(a)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(a1)')), [['<span class="paren">(a1)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(a-1)')), [['<span class="paren">(a-1)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(a.1)')), [['<span class="paren">(a.1)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(a b)')), [['<span class="paren">(a b)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(word)')), [['<span class="paren">(word)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(word word)')), [['<span class="paren">(word word)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(word, word)')), [['<span class="paren">(word, word)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(A)')), [['<span class="paren">(A)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(Name)')), [['<span class="paren">(Name)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(Word word)')), [['<span class="paren">(Word word)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(Word Word)')), [['<span class="paren">(Word Word)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(Name, Name)')), [['<span class="paren">(Name, Name)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(ABBR)')), [['<span class="paren">(ABBR)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(ABBR, ABBR)')), [['<span class="paren">(ABBR, ABBR)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input(`(${'0'.repeat(16)})`)), [[`<span class="paren">(${'0'.repeat(16)})</span>`], '']);
      assert.deepStrictEqual(inspect(parser, input(`(${'0'.repeat(17)})`)), [[`<span class="bracket">(${'0'.repeat(17)})</span>`], '']);
      assert.deepStrictEqual(inspect(parser, input('(\\a)')), [['<span class="paren">(a)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(==)')), [['<span class="paren">(==)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(()')), [['<span class="paren">(<span class="paren">()</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('("(\n))"(")')), [['<span class="bracket">("<span class="paren">(</span><br>)</span>'], ')"(")']);
      assert.deepStrictEqual(inspect(parser, input('($)$')), [['<span class="paren">(<span class="math" translate="no" data-src="$)$">$)$</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input(')')), undefined);
      assert.deepStrictEqual(inspect(parser, input('（１，２）')), [['<span class="paren">（１，２）</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('（０－１）')), [['<span class="paren">（０－１）</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('（０．１）')), [['<span class="paren">（０．１）</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('（ａ）')), [['<span class="paren">（ａ）</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('（Ａ）')), [['<span class="paren">（Ａ）</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('（Ａ，Ｂ）')), [['<span class="paren">（Ａ，Ｂ）</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('（Ａ、Ｂ）')), [['<span class="paren">（Ａ、Ｂ）</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(<bdi>a\\\nb</bdi>)')), [['<span class="bracket">(<bdi>a<br>b</bdi>)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('([% a\\\nb %])')), [['<span class="bracket">(<span class="remark"><input type="checkbox"><span>[% a<br>b %]</span></span>)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('({{\\\n}})')), [['<span class="bracket">(<span class="template">{{\\<br>}}</span>)</span>'], '']);
    });

    it('[', () => {
      assert.deepStrictEqual(inspect(parser, input('[')), [['['], '']);
      assert.deepStrictEqual(inspect(parser, input('[]')), [['[', ']'], '']);
      assert.deepStrictEqual(inspect(parser, input('[a')), [['[', 'a'], '']);
      assert.deepStrictEqual(inspect(parser, input('[a]')), [['[', 'a', ']'], '']);
      assert.deepStrictEqual(inspect(parser, input('[==]')), [['[', '==', ']'], '']);
      assert.deepStrictEqual(inspect(parser, input('[$]$')), [['[', '<span class="math" translate="no" data-src="$]$">$]$</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input(']')), undefined);
    });

    it('{', () => {
      assert.deepStrictEqual(inspect(parser, input('{')), [['{'], '']);
      assert.deepStrictEqual(inspect(parser, input('{}')), [['{', '}'], '']);
      assert.deepStrictEqual(inspect(parser, input('{a')), [['{', 'a'], '']);
      assert.deepStrictEqual(inspect(parser, input('{a}')), [['{', 'a', '}'], '']);
      assert.deepStrictEqual(inspect(parser, input('{==}')), [['{', '==', '}'], '']);
      assert.deepStrictEqual(inspect(parser, input('}')), undefined);
    });

    it('"', () => {
      assert.deepStrictEqual(inspect(parser, input('"')), [['"'], '']);
      assert.deepStrictEqual(inspect(parser, input('""')), [['"', '"'], '']);
      assert.deepStrictEqual(inspect(parser, input('"a')), [['"', 'a'], '']);
      assert.deepStrictEqual(inspect(parser, input('"a"')), [['"', 'a', '"'], '']);
      assert.deepStrictEqual(inspect(parser, input('"(")"')), [['"', '<span class="paren">(</span>', '"'], ')"']);
      assert.deepStrictEqual(inspect(parser, input('"(("')), [['"', '<span class="paren">(<span class="paren">(</span></span>', '"'], '']);
      assert.deepStrictEqual(inspect(parser, input('"(\\")"')), [['"', '<span class="paren">(")</span>', '"'], '']);
      assert.deepStrictEqual(inspect(parser, input('"(\n)"(")')), [['"', '<span class="paren">(</span>'], '\n)"(")']);
      assert.deepStrictEqual(inspect(parser, input('"\n"')), [['"'], '\n"']);
      assert.deepStrictEqual(inspect(parser, input('"\n"(")')), [['"'], '\n"(")']);
    });

  });

});
