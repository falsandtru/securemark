import { italic } from './italic';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/italic', () => {
  describe('italic', () => {
    const parser = (source: string) => some(italic)({ source, context: {} });

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('///')), undefined);
      assert.deepStrictEqual(inspect(parser('///a')), [['///', 'a'], '']);
      assert.deepStrictEqual(inspect(parser('///a ///')), [['///', 'a'], ' ///']);
      assert.deepStrictEqual(inspect(parser('///a  ///')), [['///', 'a', ' '], ' ///']);
      assert.deepStrictEqual(inspect(parser('///a\n///')), [['///', 'a'], '\n///']);
      assert.deepStrictEqual(inspect(parser('///a\\ ///')), [['///', 'a'], '\\ ///']);
      assert.deepStrictEqual(inspect(parser('///a\\\n///')), [['///', 'a'], '\\\n///']);
      assert.deepStrictEqual(inspect(parser('///a/b')), [['///', 'a', '/', 'b'], '']);
      assert.deepStrictEqual(inspect(parser('///a//b')), [['///', 'a', '//', 'b'], '']);
      assert.deepStrictEqual(inspect(parser('///a*b///')), [['///', 'a', '*', 'b', '///'], '']);
      assert.deepStrictEqual(inspect(parser('/// ///')), undefined);
      assert.deepStrictEqual(inspect(parser('/// a///')), undefined);
      assert.deepStrictEqual(inspect(parser('/// a ///')), undefined);
      assert.deepStrictEqual(inspect(parser('///\n///')), undefined);
      assert.deepStrictEqual(inspect(parser('///\na///')), undefined);
      assert.deepStrictEqual(inspect(parser('///\\ a///')), undefined);
      assert.deepStrictEqual(inspect(parser('///\\\na///')), undefined);
      assert.deepStrictEqual(inspect(parser('///<wbr>a///')), undefined);
      assert.deepStrictEqual(inspect(parser('////a////')), undefined);
      assert.deepStrictEqual(inspect(parser('/////a/////')), undefined);
      assert.deepStrictEqual(inspect(parser(' ///a///')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('///a///')), [['<i>a</i>'], '']);
      assert.deepStrictEqual(inspect(parser('///ab///')), [['<i>ab</i>'], '']);
      assert.deepStrictEqual(inspect(parser('///a////')), [['<i>a</i>'], '/']);
      assert.deepStrictEqual(inspect(parser('///a\nb///')), [['<i>a<br>b</i>'], '']);
      assert.deepStrictEqual(inspect(parser('///a\\\nb///')), [['<i>a<br>b</i>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('///a ///b//////')), [['<i>a <i>b</i></i>'], '']);
      assert.deepStrictEqual(inspect(parser('///a\\ ///b//////')), [['<i>a <i>b</i></i>'], '']);
      assert.deepStrictEqual(inspect(parser('///a&Tab;///b//////')), [['<i>a\t<i>b</i></i>'], '']);
      assert.deepStrictEqual(inspect(parser('///a<wbr>///b//////')), [['<i>a<wbr><i>b</i></i>'], '']);
      assert.deepStrictEqual(inspect(parser('///`a`///')), [['<i><code data-src="`a`">a</code></i>'], '']);
      assert.deepStrictEqual(inspect(parser('///(///a///)///')), [['<i><span class="paren">(<i>a</i>)</span></i>'], '']);
      assert.deepStrictEqual(inspect(parser('///{http://host/}///')), [['<i><a class="url" href="http://host/" target="_blank">http://host/</a></i>'], '']);
    });

  });

});
