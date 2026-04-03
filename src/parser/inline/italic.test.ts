import { italic } from './italic';
import { some } from '../../combinator';
import { input } from '../context';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/italic', () => {
  describe('italic', () => {
    const parser = some(italic);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('///')), [['///'], '']);
      assert.deepStrictEqual(inspect(parser, input('///a')), [['///', 'a'], '']);
      assert.deepStrictEqual(inspect(parser, input('///a ///')), [['///', 'a ', '///'], '']);
      assert.deepStrictEqual(inspect(parser, input('///a  ///')), [['///', 'a', ' ', '///'], '']);
      assert.deepStrictEqual(inspect(parser, input('///a\n///')), [['///', 'a', '<br>', '///'], '']);
      assert.deepStrictEqual(inspect(parser, input('///a\\ ///')), [['///', 'a', ' ', '///'], '']);
      assert.deepStrictEqual(inspect(parser, input('///a\\\n///')), [['///', 'a', '<br>', '///'], '']);
      assert.deepStrictEqual(inspect(parser, input('///a/b')), [['///', 'a/b'], '']);
      assert.deepStrictEqual(inspect(parser, input('///a//b')), [['///', 'a//b'], '']);
      assert.deepStrictEqual(inspect(parser, input('///a*b///')), [['///', 'a', '*', 'b', '///'], '']);
      assert.deepStrictEqual(inspect(parser, input('/// ///')), undefined);
      assert.deepStrictEqual(inspect(parser, input('/// a///')), undefined);
      assert.deepStrictEqual(inspect(parser, input('/// a ///')), undefined);
      assert.deepStrictEqual(inspect(parser, input('///\n///')), undefined);
      assert.deepStrictEqual(inspect(parser, input('///\na///')), undefined);
      assert.deepStrictEqual(inspect(parser, input('///\\ a///')), undefined);
      assert.deepStrictEqual(inspect(parser, input('///\\\na///')), undefined);
      assert.deepStrictEqual(inspect(parser, input('///<wbr>a///')), undefined);
      assert.deepStrictEqual(inspect(parser, input(' ///a///')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser, input('///a///')), [['<i>a</i>'], '']);
      assert.deepStrictEqual(inspect(parser, input('///ab///')), [['<i>ab</i>'], '']);
      assert.deepStrictEqual(inspect(parser, input('///a////')), [['<i>a</i>'], '/']);
      assert.deepStrictEqual(inspect(parser, input('///a\nb///')), [['<i>a<br>b</i>'], '']);
      assert.deepStrictEqual(inspect(parser, input('///a\\\nb///')), [['<i>a<br>b</i>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser, input('////a///')), [['/', '<i>a</i>'], '']);
      assert.deepStrictEqual(inspect(parser, input('////a///b')), [['/', '<i>a</i>'], 'b']);
      assert.deepStrictEqual(inspect(parser, input('////a////')), [['/', '<i>a</i>', '/'], '']);
      assert.deepStrictEqual(inspect(parser, input('////a////b')), [['/', '<i>a</i>', '/'], 'b']);
      assert.deepStrictEqual(inspect(parser, input('/////a///')), [['//', '<i>a</i>'], '']);
      assert.deepStrictEqual(inspect(parser, input('/////a///b')), [['//', '<i>a</i>'], 'b']);
      assert.deepStrictEqual(inspect(parser, input('/////a////')), [['//', '<i>a</i>', '/'], '']);
      assert.deepStrictEqual(inspect(parser, input('/////a////b')), [['//', '<i>a</i>', '/'], 'b']);
      assert.deepStrictEqual(inspect(parser, input('/////a/////')), [['//', '<i>a</i>', '//'], '']);
      assert.deepStrictEqual(inspect(parser, input('/////a/////b')), [['//', '<i>a</i>', '//'], 'b']);
      assert.deepStrictEqual(inspect(parser, input('//////a///')), [['///', '<i>a</i>'], '']);
      assert.deepStrictEqual(inspect(parser, input('//////a///b')), [['///', '<i>a</i>', 'b'], '']);
      assert.deepStrictEqual(inspect(parser, input('//////a////')), [['///', '<i>a</i>', '/'], '']);
      assert.deepStrictEqual(inspect(parser, input('//////a////b')), [['///', '<i>a</i>', '/b'], '']);
      assert.deepStrictEqual(inspect(parser, input('//////a/////')), [['///', '<i>a</i>', '//'], '']);
      assert.deepStrictEqual(inspect(parser, input('//////a/////b')), [['///', '<i>a</i>', '//b'], '']);
      assert.deepStrictEqual(inspect(parser, input('//////a//////')), [['<i><i>a</i></i>'], '']);
      assert.deepStrictEqual(inspect(parser, input('//////a///b///')), [['<i><i>a</i>b</i>'], '']);
      assert.deepStrictEqual(inspect(parser, input('//////a/// b///')), [['<i><i>a</i> b</i>'], '']);
      assert.deepStrictEqual(inspect(parser, input('///a ///b//////')), [['<i>a <i>b</i></i>'], '']);
      assert.deepStrictEqual(inspect(parser, input('///- ///b//////')), [['<i>- <i>b</i></i>'], '']);
      assert.deepStrictEqual(inspect(parser, input('///a\\ ///b//////')), [['<i>a <i>b</i></i>'], '']);
      assert.deepStrictEqual(inspect(parser, input('///a //////b/////////')), [['<i>a <i><i>b</i></i></i>'], '']);
      assert.deepStrictEqual(inspect(parser, input('///a ///b///c///')), [['<i>a <i>b</i>c</i>'], '']);
      assert.deepStrictEqual(inspect(parser, input('///a ///b ///c/////////')), [['<i>a <i>b <i>c</i></i></i>'], '']);
      assert.deepStrictEqual(inspect(parser, input('///a&Tab;///b//////')), [['<i>a\t<i>b</i></i>'], '']);
      assert.deepStrictEqual(inspect(parser, input('///a<wbr>///b//////')), [['<i>a<wbr><i>b</i></i>'], '']);
      assert.deepStrictEqual(inspect(parser, input('///`a`///')), [['<i><code data-src="`a`">a</code></i>'], '']);
      assert.deepStrictEqual(inspect(parser, input('///(///a///)///')), [['<i><span class="paren">(<i>a</i>)</span></i>'], '']);
      assert.deepStrictEqual(inspect(parser, input('///{http://host/}///')), [['<i><a class="url" href="http://host/" target="_blank">http://host/</a></i>'], '']);
    });

  });

});
