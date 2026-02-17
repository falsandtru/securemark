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
      assert.deepStrictEqual(inspect(parser('[^a]'), ctx), [['<span class="invalid">a</span>'], '']);
      assert.deepStrictEqual(inspect(parser('[^a b]'), ctx), [['<span class="invalid">a b</span>'], '']);
      assert.deepStrictEqual(inspect(parser('[^a ]'), ctx), [['<span class="invalid">a </span>'], '']);
      assert.deepStrictEqual(inspect(parser('[^a  ]'), ctx), [['<span class="invalid">a  </span>'], '']);
      assert.deepStrictEqual(inspect(parser('[^a\\ ]'), ctx), [['<span class="invalid">a </span>'], '']);
      assert.deepStrictEqual(inspect(parser('[^a\\ \\ ]'), ctx), [['<span class="invalid">a  </span>'], '']);
      assert.deepStrictEqual(inspect(parser('[^a\n]'), ctx), [['<span class="invalid">a<br></span>'], '']);
      assert.deepStrictEqual(inspect(parser('[^a\\\n]'), ctx), [['<span class="invalid">a<br></span>'], '']);
      assert.deepStrictEqual(inspect(parser('[^a\nb]'), ctx), [['<span class="invalid">a<br>b</span>'], '']);
      assert.deepStrictEqual(inspect(parser('[^a\\\nb]'), ctx), [['<span class="invalid">a<br>b</span>'], '']);
      assert.deepStrictEqual(inspect(parser('[^a<wbr>]'), ctx), [['<span class="invalid">a<wbr></span>'], '']);
      assert.deepStrictEqual(inspect(parser('[^a<wbr><wbr>]'), ctx), [['<span class="invalid">a<wbr><wbr></span>'], '']);
      assert.deepStrictEqual(inspect(parser('[^==]'), ctx), [['<span class="invalid">==</span>'], '']);
      assert.deepStrictEqual(inspect(parser('[^a[% b %]]'), ctx), [['<span class="invalid">a<span class="remark"><input type="checkbox"><span>[% b %]</span></span></span>'], '']);
      assert.deepStrictEqual(inspect(parser('[^a[% b %][% c %]]'), ctx), [['<span class="invalid">a<span class="remark"><input type="checkbox"><span>[% b %]</span></span><span class="remark"><input type="checkbox"><span>[% c %]</span></span></span>'], '']);
      assert.deepStrictEqual(inspect(parser('[^\\]]'), ctx), [['<span class="invalid">]</span>'], '']);
      assert.deepStrictEqual(inspect(parser('[^(])]'), ctx), [['<span class="invalid"><span class="paren">(])</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser('[^!http://host]'), ctx), [['<span class="invalid">!<a class="url" href="http://host" target="_blank">http://host</a></span>'], '']);
      assert.deepStrictEqual(inspect(parser('[^[% a %]]'), ctx), [['<span class="invalid"><span class="remark"><input type="checkbox"><span>[% a %]</span></span></span>'], '']);
      assert.deepStrictEqual(inspect(parser('[^[% a %]b]'), ctx), [['<span class="invalid"><span class="remark"><input type="checkbox"><span>[% a %]</span></span>b</span>'], '']);
    });

  });

});
