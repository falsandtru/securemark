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
      assert.deepStrictEqual(inspect(parser, input('(a', new Context())), [['(', 'a'], '']);
      assert.deepStrictEqual(inspect(parser, input('(0)', new Context())), [['(', '0', ')'], '']);
      assert.deepStrictEqual(inspect(parser, input('(1)', new Context())), [['(', '1', ')'], '']);
      assert.deepStrictEqual(inspect(parser, input('(10)', new Context())), [['(', '10', ')'], '']);
      assert.deepStrictEqual(inspect(parser, input('(2000)', new Context())), [['(', '2000', ')'], '']);
      assert.deepStrictEqual(inspect(parser, input('(0-1)', new Context())), [['(', '0-1', ')'], '']);
      assert.deepStrictEqual(inspect(parser, input('(0)-1', new Context())), [['(', '0', ')'], '-1']);
      assert.deepStrictEqual(inspect(parser, input('(0.1)', new Context())), [['(', '0.1', ')'], '']);
      assert.deepStrictEqual(inspect(parser, input('(0.1.2)', new Context())), [['(', '0.1.2', ')'], '']);
      assert.deepStrictEqual(inspect(parser, input('(1.1, 1.2-1.3, 1.4)', new Context())), [['(', '1.1, 1.2-1.3, 1.4', ')'], '']);
      assert.deepStrictEqual(inspect(parser, input('(1 2)', new Context())), [['<span class="paren">(1 2)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(1, 2)', new Context())), [['(', '1, 2', ')'], '']);
      assert.deepStrictEqual(inspect(parser, input('(1a)', new Context())), [['(', '1a', ')'], '']);
      assert.deepStrictEqual(inspect(parser, input('(a)', new Context())), [['(', 'a', ')'], '']);
      assert.deepStrictEqual(inspect(parser, input('(a1)', new Context())), [['(', 'a1', ')'], '']);
      assert.deepStrictEqual(inspect(parser, input('(a-1)', new Context())), [['(', 'a-1', ')'], '']);
      assert.deepStrictEqual(inspect(parser, input('(a.1)', new Context())), [['(', 'a.1', ')'], '']);
      assert.deepStrictEqual(inspect(parser, input('(a b)', new Context())), [['<span class="paren">(a b)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(word)', new Context())), [['(', 'word', ')'], '']);
      assert.deepStrictEqual(inspect(parser, input('(word word)', new Context())), [['<span class="paren">(word word)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(word, word)', new Context())), [['(', 'word, word', ')'], '']);
      assert.deepStrictEqual(inspect(parser, input('(A)', new Context())), [['(', 'A', ')'], '']);
      assert.deepStrictEqual(inspect(parser, input('(Name)', new Context())), [['(', 'Name', ')'], '']);
      assert.deepStrictEqual(inspect(parser, input('(Word word)', new Context())), [['<span class="paren">(Word word)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(Word Word)', new Context())), [['<span class="paren">(Word Word)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(Name, Name)', new Context())), [['(', 'Name, Name', ')'], '']);
      assert.deepStrictEqual(inspect(parser, input('(ABBR)', new Context())), [['(', 'ABBR', ')'], '']);
      assert.deepStrictEqual(inspect(parser, input('(ABBR, ABBR)', new Context())), [['(', 'ABBR, ABBR', ')'], '']);
      assert.deepStrictEqual(inspect(parser, input('(\\a)', new Context())), [['<span class="paren">(a)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(==)', new Context())), [['<span class="paren">(==)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('("(\n))"(")', new Context())), [['<span class="paren">("<span class="paren">(</span><br>)</span>'], ')"(")']);
      assert.deepStrictEqual(inspect(parser, input('($)$', new Context())), [['<span class="paren">(<span class="math" translate="no" data-src="$)$">$)$</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input(')', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('（１，２）', new Context())), [['（', '１，２', '）'], '']);
      assert.deepStrictEqual(inspect(parser, input('（０－１）', new Context())), [['（', '０－１', '）'], '']);
      assert.deepStrictEqual(inspect(parser, input('（０．１）', new Context())), [['（', '０．１', '）'], '']);
      assert.deepStrictEqual(inspect(parser, input('（ａ）', new Context())), [['（', 'ａ', '）'], '']);
      assert.deepStrictEqual(inspect(parser, input('（Ａ）', new Context())), [['（', 'Ａ', '）'], '']);
      assert.deepStrictEqual(inspect(parser, input('（Ａ，Ｂ）', new Context())), [['（', 'Ａ，Ｂ', '）'], '']);
      assert.deepStrictEqual(inspect(parser, input('（Ａ、Ｂ）', new Context())), [['（', 'Ａ、Ｂ', '）'], '']);
      assert.deepStrictEqual(inspect(parser, input('(<bdi>a\\\nb</bdi>)', new Context())), [['<span class="paren">(<bdi>a<br>b</bdi>)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('([% a\\\nb %])', new Context())), [['<span class="paren">(<span class="remark"><input type="checkbox"><span>[% a<br>b %]</span></span>)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('({{\\\n}})', new Context())), [['<span class="paren">(<span class="template">{{\\<br>}}</span>)</span>'], '']);
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
      assert.deepStrictEqual(inspect(parser, input('"(("', new Context())), [['"', '<span class="paren">(<span class="paren">(</span></span>', '"'], '']);
      assert.deepStrictEqual(inspect(parser, input('"(\\")"', new Context())), [['"', '<span class="paren">(")</span>', '"'], '']);
      assert.deepStrictEqual(inspect(parser, input('"(\n)"(")', new Context())), [['"', '<span class="paren">(</span>'], '\n)"(")']);
      assert.deepStrictEqual(inspect(parser, input('"\n"', new Context())), [['"'], '\n"']);
      assert.deepStrictEqual(inspect(parser, input('"\n"(")', new Context())), [['"'], '\n"(")']);
    });

  });

});
