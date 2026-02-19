import { placeholder } from './placeholder';
import { some } from '../../../combinator';
import { input } from '../../../combinator/data/parser';
import { inspect } from '../../../debug.test';

describe('Unit: parser/inline/extension/placeholder', () => {
  describe('placeholder', () => {
    const parser = (source: string) => some(placeholder)(input(source, ctx));
    const { context: ctx } = input('', {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('[]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[a]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[ab]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[^]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[^]]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[^\\]'), ctx), [['[^', ']'], '']);
      assert.deepStrictEqual(inspect(parser('[^ ]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[^ a]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[^\\ ]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[^\\ a]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[^\n]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[^\na]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[^\\\na]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[^ !http://host]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[^a'), ctx), [['[^', 'a'], '']);
      assert.deepStrictEqual(inspect(parser('[[]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[]]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[[]]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[[ ]]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[[a]]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser(' [^a]'), ctx), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('[^a]'), ctx), [['<span class="invalid">[^a]</span>'], '']);
      assert.deepStrictEqual(inspect(parser('[^a b]'), ctx), [['<span class="invalid">[^a b]</span>'], '']);
      assert.deepStrictEqual(inspect(parser('[^a ]'), ctx), [['<span class="invalid">[^a ]</span>'], '']);
      assert.deepStrictEqual(inspect(parser('[^a  ]'), ctx), [['<span class="invalid">[^a  ]</span>'], '']);
      assert.deepStrictEqual(inspect(parser('[^a\\ ]'), ctx), [['<span class="invalid">[^a\\ ]</span>'], '']);
      assert.deepStrictEqual(inspect(parser('[^a\\ \\ ]'), ctx), [['<span class="invalid">[^a\\ \\ ]</span>'], '']);
      assert.deepStrictEqual(inspect(parser('[^a\n]'), ctx), [['<span class="invalid">[^a\n]</span>'], '']);
      assert.deepStrictEqual(inspect(parser('[^a\\\n]'), ctx), [['<span class="invalid">[^a\\\n]</span>'], '']);
      assert.deepStrictEqual(inspect(parser('[^a\nb]'), ctx), [['<span class="invalid">[^a\nb]</span>'], '']);
      assert.deepStrictEqual(inspect(parser('[^a\\\nb]'), ctx), [['<span class="invalid">[^a\\\nb]</span>'], '']);
      assert.deepStrictEqual(inspect(parser('[^a<wbr>]'), ctx), [['<span class="invalid">[^a&lt;wbr&gt;]</span>'], '']);
      assert.deepStrictEqual(inspect(parser('[^a<wbr><wbr>]'), ctx), [['<span class="invalid">[^a&lt;wbr&gt;&lt;wbr&gt;]</span>'], '']);
      assert.deepStrictEqual(inspect(parser('[^==]'), ctx), [['<span class="invalid">[^==]</span>'], '']);
      assert.deepStrictEqual(inspect(parser('[^a[% b %]]'), ctx), [['<span class="invalid">[^a[% b %]]</span>'], '']);
      assert.deepStrictEqual(inspect(parser('[^a[% b %][% c %]]'), ctx), [['<span class="invalid">[^a[% b %][% c %]]</span>'], '']);
      assert.deepStrictEqual(inspect(parser('[^\\]]'), ctx), [['<span class="invalid">[^\\]]</span>'], '']);
      assert.deepStrictEqual(inspect(parser('[^(])]'), ctx), [['<span class="invalid">[^(])]</span>'], '']);
      assert.deepStrictEqual(inspect(parser('[^!http://host]'), ctx), [['<span class="invalid">[^!http://host]</span>'], '']);
      assert.deepStrictEqual(inspect(parser('[^[% a %]]'), ctx), [['<span class="invalid">[^[% a %]]</span>'], '']);
      assert.deepStrictEqual(inspect(parser('[^[% a %]b]'), ctx), [['<span class="invalid">[^[% a %]b]</span>'], '']);
    });

  });

});
