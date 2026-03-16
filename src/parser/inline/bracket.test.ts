import { bracket } from './bracket';
import { some } from '../../combinator';
import { input } from '../../combinator/data/parser';
import { Context } from '../context';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/bracket', () => {
  describe('bracket', () => {
    const parser = some(bracket);

    it('(', () => {
      assert.deepStrictEqual(inspect(parser, input('(', new Context())), [['<span class="paren">(</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('()', new Context())), [['<span class="paren">()</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(a', new Context())), [['<span class="paren">(a</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(0)', new Context())), [['<span class="paren">(0)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(1)', new Context())), [['<span class="paren">(1)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(10)', new Context())), [['<span class="paren">(10)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(2000)', new Context())), [['<span class="paren">(2000)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(0-1)', new Context())), [['<span class="paren">(0-1)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(0)-1', new Context())), [['<span class="paren">(0)</span>'], '-1']);
      assert.deepStrictEqual(inspect(parser, input('(0.1)', new Context())), [['<span class="paren">(0.1)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(0.1.2)', new Context())), [['<span class="paren">(0.1.2)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(1.1, 1.2-1.3, 1.4)', new Context())), [['<span class="paren">(1.1, 1.2-1.3, 1.4)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(1 2)', new Context())), [['<span class="bracket">(1 2)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(1, 2)', new Context())), [['<span class="paren">(1, 2)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(1a)', new Context())), [['<span class="paren">(1a)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(a)', new Context())), [['<span class="paren">(a)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(a1)', new Context())), [['<span class="paren">(a1)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(a-1)', new Context())), [['<span class="paren">(a-1)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(a.1)', new Context())), [['<span class="paren">(a.1)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(a b)', new Context())), [['<span class="bracket">(a b)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(word)', new Context())), [['<span class="paren">(word)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(word word)', new Context())), [['<span class="bracket">(word word)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(word, word)', new Context())), [['<span class="paren">(word, word)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(A)', new Context())), [['<span class="paren">(A)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(Name)', new Context())), [['<span class="paren">(Name)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(Word word)', new Context())), [['<span class="bracket">(Word word)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(Word Word)', new Context())), [['<span class="bracket">(Word Word)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(Name, Name)', new Context())), [['<span class="paren">(Name, Name)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(ABBR)', new Context())), [['<span class="paren">(ABBR)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(ABBR, ABBR)', new Context())), [['<span class="paren">(ABBR, ABBR)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(\\a)', new Context())), [['<span class="bracket">(a)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(==)', new Context())), [['<span class="bracket">(==)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(()', new Context())), [['<span class="bracket">(<span class="paren">()</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('("(\n))"(")', new Context())), [['<span class="bracket">("<span class="paren">(</span><br>)</span>'], ')"(")']);
      assert.deepStrictEqual(inspect(parser, input('($)$', new Context())), [['<span class="bracket">(<span class="math" translate="no" data-src="$)$">$)$</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input(')', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('（１，２）', new Context())), [['<span class="paren">（１，２）</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('（０－１）', new Context())), [['<span class="paren">（０－１）</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('（０．１）', new Context())), [['<span class="paren">（０．１）</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('（ａ）', new Context())), [['<span class="paren">（ａ）</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('（Ａ）', new Context())), [['<span class="paren">（Ａ）</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('（Ａ，Ｂ）', new Context())), [['<span class="paren">（Ａ，Ｂ）</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('（Ａ、Ｂ）', new Context())), [['<span class="paren">（Ａ、Ｂ）</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(<bdi>a\\\nb</bdi>)', new Context())), [['<span class="bracket">(<bdi>a<br>b</bdi>)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('([% a\\\nb %])', new Context())), [['<span class="bracket">(<span class="remark"><input type="checkbox"><span>[% a<br>b %]</span></span>)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('({{\\\n}})', new Context())), [['<span class="bracket">(<span class="template">{{\\<br>}}</span>)</span>'], '']);
    });

    it('[', () => {
      assert.deepStrictEqual(inspect(parser, input('[', new Context())), [['['], '']);
      assert.deepStrictEqual(inspect(parser, input('[]', new Context())), [['[', ']'], '']);
      assert.deepStrictEqual(inspect(parser, input('[a', new Context())), [['[', 'a'], '']);
      assert.deepStrictEqual(inspect(parser, input('[a]', new Context())), [['[', 'a', ']'], '']);
      assert.deepStrictEqual(inspect(parser, input('[==]', new Context())), [['[', '==', ']'], '']);
      assert.deepStrictEqual(inspect(parser, input('[$]$', new Context())), [['[', '<span class="math" translate="no" data-src="$]$">$]$</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input(']', new Context())), undefined);
    });

    it('{', () => {
      assert.deepStrictEqual(inspect(parser, input('{', new Context())), [['{'], '']);
      assert.deepStrictEqual(inspect(parser, input('{}', new Context())), [['{', '}'], '']);
      assert.deepStrictEqual(inspect(parser, input('{a', new Context())), [['{', 'a'], '']);
      assert.deepStrictEqual(inspect(parser, input('{a}', new Context())), [['{', 'a', '}'], '']);
      assert.deepStrictEqual(inspect(parser, input('{==}', new Context())), [['{', '==', '}'], '']);
      assert.deepStrictEqual(inspect(parser, input('}', new Context())), undefined);
    });

    it('"', () => {
      assert.deepStrictEqual(inspect(parser, input('"', new Context())), [['"'], '']);
      assert.deepStrictEqual(inspect(parser, input('""', new Context())), [['"', '"'], '']);
      assert.deepStrictEqual(inspect(parser, input('"a', new Context())), [['"', 'a'], '']);
      assert.deepStrictEqual(inspect(parser, input('"a"', new Context())), [['"', 'a', '"'], '']);
      assert.deepStrictEqual(inspect(parser, input('"(")"', new Context())), [['"', '<span class="paren">(</span>', '"'], ')"']);
      assert.deepStrictEqual(inspect(parser, input('"(("', new Context())), [['"', '<span class="bracket">(<span class="paren">(</span></span>', '"'], '']);
      assert.deepStrictEqual(inspect(parser, input('"(\\")"', new Context())), [['"', '<span class="bracket">(")</span>', '"'], '']);
      assert.deepStrictEqual(inspect(parser, input('"(\n)"(")', new Context())), [['"', '<span class="paren">(</span>'], '\n)"(")']);
      assert.deepStrictEqual(inspect(parser, input('"\n"', new Context())), [['"'], '\n"']);
      assert.deepStrictEqual(inspect(parser, input('"\n"(")', new Context())), [['"'], '\n"(")']);
    });

  });

});
