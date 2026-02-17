import { bracket } from './bracket';
import { some } from '../../combinator';
import { input } from '../../combinator/data/parser';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/bracket', () => {
  describe('bracket', () => {
    const parser = (source: string) => some(bracket)(input(source, ctx));
    const { context: ctx } = input('', {});

    it('(', () => {
      assert.deepStrictEqual(inspect(parser('('), ctx), [['('], '']);
      assert.deepStrictEqual(inspect(parser('()'), ctx), [['<span class="paren">()</span>'], '']);
      assert.deepStrictEqual(inspect(parser('(a'), ctx), [['(', 'a'], '']);
      assert.deepStrictEqual(inspect(parser('(0)'), ctx), [['(', '0', ')'], '']);
      assert.deepStrictEqual(inspect(parser('(1)'), ctx), [['(', '1', ')'], '']);
      assert.deepStrictEqual(inspect(parser('(10)'), ctx), [['(', '10', ')'], '']);
      assert.deepStrictEqual(inspect(parser('(2000)'), ctx), [['(', '2000', ')'], '']);
      assert.deepStrictEqual(inspect(parser('(0-1)'), ctx), [['(', '0-1', ')'], '']);
      assert.deepStrictEqual(inspect(parser('(0)-1'), ctx), [['(', '0', ')'], '-1']);
      assert.deepStrictEqual(inspect(parser('(0.1)'), ctx), [['(', '0.1', ')'], '']);
      assert.deepStrictEqual(inspect(parser('(0.1.2)'), ctx), [['(', '0.1.2', ')'], '']);
      assert.deepStrictEqual(inspect(parser('(1.1, 1.2-1.3, 1.4)'), ctx), [['(', '1.1, 1.2-1.3, 1.4', ')'], '']);
      assert.deepStrictEqual(inspect(parser('(1 2)'), ctx), [['<span class="paren">(1 2)</span>'], '']);
      assert.deepStrictEqual(inspect(parser('(1, 2)'), ctx), [['(', '1, 2', ')'], '']);
      assert.deepStrictEqual(inspect(parser('(1a)'), ctx), [['(', '1a', ')'], '']);
      assert.deepStrictEqual(inspect(parser('(a)'), ctx), [['(', 'a', ')'], '']);
      assert.deepStrictEqual(inspect(parser('(a1)'), ctx), [['(', 'a1', ')'], '']);
      assert.deepStrictEqual(inspect(parser('(a-1)'), ctx), [['(', 'a-1', ')'], '']);
      assert.deepStrictEqual(inspect(parser('(a.1)'), ctx), [['(', 'a.1', ')'], '']);
      assert.deepStrictEqual(inspect(parser('(a b)'), ctx), [['<span class="paren">(a b)</span>'], '']);
      assert.deepStrictEqual(inspect(parser('(word)'), ctx), [['(', 'word', ')'], '']);
      assert.deepStrictEqual(inspect(parser('(word word)'), ctx), [['<span class="paren">(word word)</span>'], '']);
      assert.deepStrictEqual(inspect(parser('(word, word)'), ctx), [['(', 'word, word', ')'], '']);
      assert.deepStrictEqual(inspect(parser('(A)'), ctx), [['(', 'A', ')'], '']);
      assert.deepStrictEqual(inspect(parser('(Name)'), ctx), [['(', 'Name', ')'], '']);
      assert.deepStrictEqual(inspect(parser('(Word word)'), ctx), [['<span class="paren">(Word word)</span>'], '']);
      assert.deepStrictEqual(inspect(parser('(Word Word)'), ctx), [['<span class="paren">(Word Word)</span>'], '']);
      assert.deepStrictEqual(inspect(parser('(Name, Name)'), ctx), [['(', 'Name, Name', ')'], '']);
      assert.deepStrictEqual(inspect(parser('(ABBR)'), ctx), [['(', 'ABBR', ')'], '']);
      assert.deepStrictEqual(inspect(parser('(ABBR, ABBR)'), ctx), [['(', 'ABBR, ABBR', ')'], '']);
      assert.deepStrictEqual(inspect(parser('(\\a)'), ctx), [['<span class="paren">(a)</span>'], '']);
      assert.deepStrictEqual(inspect(parser('(==)'), ctx), [['<span class="paren">(==)</span>'], '']);
      assert.deepStrictEqual(inspect(parser('($)$'), ctx), [['(', '<span class="math" translate="no" data-src="$)$">$)$</span>'], '']);
      assert.deepStrictEqual(inspect(parser(')'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('（１，２）'), ctx), [['（', '１，２', '）'], '']);
      assert.deepStrictEqual(inspect(parser('（０－１）'), ctx), [['（', '０－１', '）'], '']);
      assert.deepStrictEqual(inspect(parser('（０．１）'), ctx), [['（', '０．１', '）'], '']);
      assert.deepStrictEqual(inspect(parser('（ａ）'), ctx), [['（', 'ａ', '）'], '']);
      assert.deepStrictEqual(inspect(parser('（Ａ）'), ctx), [['（', 'Ａ', '）'], '']);
      assert.deepStrictEqual(inspect(parser('（Ａ，Ｂ）'), ctx), [['（', 'Ａ，Ｂ', '）'], '']);
      assert.deepStrictEqual(inspect(parser('（Ａ、Ｂ）'), ctx), [['（', 'Ａ、Ｂ', '）'], '']);
      assert.deepStrictEqual(inspect(parser('(<bdi>a\\\nb</bdi>)'), ctx), [['<span class="paren">(<bdi>a<br>b</bdi>)</span>'], '']);
      assert.deepStrictEqual(inspect(parser('([% a\\\nb %])'), ctx), [['<span class="paren">(<span class="remark"><input type="checkbox"><span>[% a<br>b %]</span></span>)</span>'], '']);
      assert.deepStrictEqual(inspect(parser('({{\\\n}})'), ctx), [['<span class="paren">(<span class="template">{{\\<br>}}</span>)</span>'], '']);
    });

    it('[', () => {
      assert.deepStrictEqual(inspect(parser('['), ctx), [['['], '']);
      assert.deepStrictEqual(inspect(parser('[]'), ctx), [['[', ']'], '']);
      assert.deepStrictEqual(inspect(parser('[a'), ctx), [['[', 'a'], '']);
      assert.deepStrictEqual(inspect(parser('[a]'), ctx), [['[', 'a', ']'], '']);
      assert.deepStrictEqual(inspect(parser('[==]'), ctx), [['[', '=', '=', ']'], '']);
      assert.deepStrictEqual(inspect(parser('[$]$'), ctx), [['[', '<span class="math" translate="no" data-src="$]$">$]$</span>'], '']);
      assert.deepStrictEqual(inspect(parser(']'), ctx), undefined);
    });

    it('{', () => {
      assert.deepStrictEqual(inspect(parser('{'), ctx), [['{'], '']);
      assert.deepStrictEqual(inspect(parser('{}'), ctx), [['{', '}'], '']);
      assert.deepStrictEqual(inspect(parser('{a'), ctx), [['{', 'a'], '']);
      assert.deepStrictEqual(inspect(parser('{a}'), ctx), [['{', 'a', '}'], '']);
      assert.deepStrictEqual(inspect(parser('{==}'), ctx), [['{', '=', '=', '}'], '']);
      assert.deepStrictEqual(inspect(parser('}'), ctx), undefined);
    });

    it('"', () => {
      assert.deepStrictEqual(inspect(parser('"'), ctx), [['"'], '']);
      assert.deepStrictEqual(inspect(parser('""'), ctx), [['"', '"'], '']);
      assert.deepStrictEqual(inspect(parser('"a'), ctx), [['"', 'a'], '']);
      assert.deepStrictEqual(inspect(parser('"a"'), ctx), [['"', 'a', '"'], '']);
      assert.deepStrictEqual(inspect(parser('"(")"'), ctx), [['"', '(', '"'], ')"']);
      assert.deepStrictEqual(inspect(parser('"(("'), ctx), [['"', '(', '(', '"'], '']);
      assert.deepStrictEqual(inspect(parser('"(\\")"'), ctx), [['"', '<span class="paren">(")</span>', '"'], '']);
      assert.deepStrictEqual(inspect(parser('"\n"'), ctx), [['"', '<br>', '"'], '']);
      assert.deepStrictEqual(inspect(parser('"\n"(")'), ctx), [['"', '<br>', '"', '(', '"'], ')']);
    });

  });

});
