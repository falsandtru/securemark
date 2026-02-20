import { italic } from './italic';
import { some } from '../../combinator';
import { input } from '../../combinator/data/parser';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/italic', () => {
  describe('italic', () => {
    const parser = (source: string) => some(italic)(input(source, ctx));
    const { context: ctx } = input('', {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('///'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('///a'), ctx), [['///', 'a'], '']);
      assert.deepStrictEqual(inspect(parser('///a ///'), ctx), [['///', 'a', ' ', '/', '/', '/'], '']);
      assert.deepStrictEqual(inspect(parser('///a  ///'), ctx), [['///', 'a', ' ', ' ', '/', '/', '/'], '']);
      assert.deepStrictEqual(inspect(parser('///a\n///'), ctx), [['///', 'a', '<br>', '/', '/', '/'], '']);
      assert.deepStrictEqual(inspect(parser('///a\\ ///'), ctx), [['///', 'a', ' ', '/', '/', '/'], '']);
      assert.deepStrictEqual(inspect(parser('///a\\\n///'), ctx), [['///', 'a', '<br>', '/', '/', '/'], '']);
      assert.deepStrictEqual(inspect(parser('///a/b'), ctx), [['///', 'a', '/', 'b'], '']);
      assert.deepStrictEqual(inspect(parser('///a//b'), ctx), [['///', 'a', '/', '/', 'b'], '']);
      assert.deepStrictEqual(inspect(parser('///a*b///'), ctx), [['///', 'a', '*', 'b', '/', '/', '/'], '']);
      assert.deepStrictEqual(inspect(parser('/// ///'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('/// a///'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('/// a ///'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('///\n///'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('///\na///'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('///\\ a///'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('///\\\na///'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('///<wbr>a///'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser(' ///a///'), ctx), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('///a///'), ctx), [['<i>a</i>'], '']);
      assert.deepStrictEqual(inspect(parser('///ab///'), ctx), [['<i>ab</i>'], '']);
      assert.deepStrictEqual(inspect(parser('///a////'), ctx), [['<i>a</i>'], '/']);
      assert.deepStrictEqual(inspect(parser('///a\nb///'), ctx), [['<i>a<br>b</i>'], '']);
      assert.deepStrictEqual(inspect(parser('///a\\\nb///'), ctx), [['<i>a<br>b</i>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('////a///'), ctx), [['/', '<i>a</i>'], '']);
      assert.deepStrictEqual(inspect(parser('////a///b'), ctx), [['/', '<i>a</i>'], 'b']);
      assert.deepStrictEqual(inspect(parser('////a////'), ctx), [['/', '<i>a</i>', '/'], '']);
      assert.deepStrictEqual(inspect(parser('////a////b'), ctx), [['/', '<i>a</i>', '/'], 'b']);
      assert.deepStrictEqual(inspect(parser('/////a///'), ctx), [['//', '<i>a</i>'], '']);
      assert.deepStrictEqual(inspect(parser('/////a///b'), ctx), [['//', '<i>a</i>'], 'b']);
      assert.deepStrictEqual(inspect(parser('/////a////'), ctx), [['//', '<i>a</i>', '/'], '']);
      assert.deepStrictEqual(inspect(parser('/////a////b'), ctx), [['//', '<i>a</i>', '/'], 'b']);
      assert.deepStrictEqual(inspect(parser('/////a/////'), ctx), [['//', '<i>a</i>', '//'], '']);
      assert.deepStrictEqual(inspect(parser('/////a/////b'), ctx), [['//', '<i>a</i>', '//'], 'b']);
      assert.deepStrictEqual(inspect(parser('//////a///'), ctx), [['///', '<i>a</i>'], '']);
      assert.deepStrictEqual(inspect(parser('//////a///b'), ctx), [['///', '<i>a</i>', 'b'], '']);
      assert.deepStrictEqual(inspect(parser('//////a////'), ctx), [['///', '<i>a</i>', '/'], '']);
      assert.deepStrictEqual(inspect(parser('//////a////b'), ctx), [['///', '<i>a</i>', '/', 'b'], '']);
      assert.deepStrictEqual(inspect(parser('//////a/////'), ctx), [['///', '<i>a</i>', '/', '/'], '']);
      assert.deepStrictEqual(inspect(parser('//////a/////b'), ctx), [['///', '<i>a</i>', '/', '/', 'b'], '']);
      assert.deepStrictEqual(inspect(parser('//////a//////'), ctx), [['<i><i>a</i></i>'], '']);
      assert.deepStrictEqual(inspect(parser('//////a///b///'), ctx), [['<i><i>a</i>b</i>'], '']);
      assert.deepStrictEqual(inspect(parser('///a ///b//////'), ctx), [['<i>a <i>b</i></i>'], '']);
      assert.deepStrictEqual(inspect(parser('///a\\ ///b//////'), ctx), [['<i>a <i>b</i></i>'], '']);
      assert.deepStrictEqual(inspect(parser('///a //////b/////////'), ctx), [['<i>a <i><i>b</i></i></i>'], '']);
      assert.deepStrictEqual(inspect(parser('///a ///b///c///'), ctx), [['<i>a <i>b</i>c</i>'], '']);
      assert.deepStrictEqual(inspect(parser('///a ///b ///c/////////'), ctx), [['<i>a <i>b <i>c</i></i></i>'], '']);
      assert.deepStrictEqual(inspect(parser('///a&Tab;///b//////'), ctx), [['<i>a\t<i>b</i></i>'], '']);
      assert.deepStrictEqual(inspect(parser('///a<wbr>///b//////'), ctx), [['<i>a<wbr><i>b</i></i>'], '']);
      assert.deepStrictEqual(inspect(parser('///`a`///'), ctx), [['<i><code data-src="`a`">a</code></i>'], '']);
      assert.deepStrictEqual(inspect(parser('///(///a///)///'), ctx), [['<i><span class="paren">(<i>a</i>)</span></i>'], '']);
      assert.deepStrictEqual(inspect(parser('///{http://host/}///'), ctx), [['<i><a class="url" href="http://host/" target="_blank">http://host/</a></i>'], '']);
    });

  });

});
