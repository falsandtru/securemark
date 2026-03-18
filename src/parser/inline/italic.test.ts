import { italic } from './italic';
import { some } from '../../combinator';
import { input } from '../../combinator/data/parser';
import { Context } from '../context';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/italic', () => {
  describe('italic', () => {
    const parser = some(italic);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('///', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('///a', new Context())), [['///', 'a'], '']);
      assert.deepStrictEqual(inspect(parser, input('///a ///', new Context())), [['///', 'a ', '///'], '']);
      assert.deepStrictEqual(inspect(parser, input('///a  ///', new Context())), [['///', 'a', ' ', '///'], '']);
      assert.deepStrictEqual(inspect(parser, input('///a\n///', new Context())), [['///', 'a', '<br>', '///'], '']);
      assert.deepStrictEqual(inspect(parser, input('///a\\ ///', new Context())), [['///', 'a', ' ', '///'], '']);
      assert.deepStrictEqual(inspect(parser, input('///a\\\n///', new Context())), [['///', 'a', '<br>', '///'], '']);
      assert.deepStrictEqual(inspect(parser, input('///a/b', new Context())), [['///', 'a/b'], '']);
      assert.deepStrictEqual(inspect(parser, input('///a//b', new Context())), [['///', 'a//b'], '']);
      assert.deepStrictEqual(inspect(parser, input('///a*b///', new Context())), [['///', 'a', '*', 'b', '///'], '']);
      assert.deepStrictEqual(inspect(parser, input('/// ///', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('/// a///', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('/// a ///', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('///\n///', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('///\na///', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('///\\ a///', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('///\\\na///', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('///<wbr>a///', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input(' ///a///', new Context())), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser, input('///a///', new Context())), [['<i>a</i>'], '']);
      assert.deepStrictEqual(inspect(parser, input('///ab///', new Context())), [['<i>ab</i>'], '']);
      assert.deepStrictEqual(inspect(parser, input('///a////', new Context())), [['<i>a</i>'], '/']);
      assert.deepStrictEqual(inspect(parser, input('///a\nb///', new Context())), [['<i>a<br>b</i>'], '']);
      assert.deepStrictEqual(inspect(parser, input('///a\\\nb///', new Context())), [['<i>a<br>b</i>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser, input('////a///', new Context())), [['/', '<i>a</i>'], '']);
      assert.deepStrictEqual(inspect(parser, input('////a///b', new Context())), [['/', '<i>a</i>'], 'b']);
      assert.deepStrictEqual(inspect(parser, input('////a////', new Context())), [['/', '<i>a</i>', '/'], '']);
      assert.deepStrictEqual(inspect(parser, input('////a////b', new Context())), [['/', '<i>a</i>', '/'], 'b']);
      assert.deepStrictEqual(inspect(parser, input('/////a///', new Context())), [['//', '<i>a</i>'], '']);
      assert.deepStrictEqual(inspect(parser, input('/////a///b', new Context())), [['//', '<i>a</i>'], 'b']);
      assert.deepStrictEqual(inspect(parser, input('/////a////', new Context())), [['//', '<i>a</i>', '/'], '']);
      assert.deepStrictEqual(inspect(parser, input('/////a////b', new Context())), [['//', '<i>a</i>', '/'], 'b']);
      assert.deepStrictEqual(inspect(parser, input('/////a/////', new Context())), [['//', '<i>a</i>', '//'], '']);
      assert.deepStrictEqual(inspect(parser, input('/////a/////b', new Context())), [['//', '<i>a</i>', '//'], 'b']);
      assert.deepStrictEqual(inspect(parser, input('//////a///', new Context())), [['///', '<i>a</i>'], '']);
      assert.deepStrictEqual(inspect(parser, input('//////a///b', new Context())), [['///', '<i>a</i>', 'b'], '']);
      assert.deepStrictEqual(inspect(parser, input('//////a////', new Context())), [['///', '<i>a</i>', '/'], '']);
      assert.deepStrictEqual(inspect(parser, input('//////a////b', new Context())), [['///', '<i>a</i>', '/b'], '']);
      assert.deepStrictEqual(inspect(parser, input('//////a/////', new Context())), [['///', '<i>a</i>', '//'], '']);
      assert.deepStrictEqual(inspect(parser, input('//////a/////b', new Context())), [['///', '<i>a</i>', '//b'], '']);
      assert.deepStrictEqual(inspect(parser, input('//////a//////', new Context())), [['<i><i>a</i></i>'], '']);
      assert.deepStrictEqual(inspect(parser, input('//////a///b///', new Context())), [['<i><i>a</i>b</i>'], '']);
      assert.deepStrictEqual(inspect(parser, input('//////a/// b///', new Context())), [['<i><i>a</i> b</i>'], '']);
      assert.deepStrictEqual(inspect(parser, input('///a ///b//////', new Context())), [['<i>a <i>b</i></i>'], '']);
      assert.deepStrictEqual(inspect(parser, input('///- ///b//////', new Context())), [['<i>- <i>b</i></i>'], '']);
      assert.deepStrictEqual(inspect(parser, input('///a\\ ///b//////', new Context())), [['<i>a <i>b</i></i>'], '']);
      assert.deepStrictEqual(inspect(parser, input('///a //////b/////////', new Context())), [['<i>a <i><i>b</i></i></i>'], '']);
      assert.deepStrictEqual(inspect(parser, input('///a ///b///c///', new Context())), [['<i>a <i>b</i>c</i>'], '']);
      assert.deepStrictEqual(inspect(parser, input('///a ///b ///c/////////', new Context())), [['<i>a <i>b <i>c</i></i></i>'], '']);
      assert.deepStrictEqual(inspect(parser, input('///a&Tab;///b//////', new Context())), [['<i>a\t<i>b</i></i>'], '']);
      assert.deepStrictEqual(inspect(parser, input('///a<wbr>///b//////', new Context())), [['<i>a<wbr><i>b</i></i>'], '']);
      assert.deepStrictEqual(inspect(parser, input('///`a`///', new Context())), [['<i><code data-src="`a`">a</code></i>'], '']);
      assert.deepStrictEqual(inspect(parser, input('///(///a///)///', new Context())), [['<i><span class="paren">(<i>a</i>)</span></i>'], '']);
      assert.deepStrictEqual(inspect(parser, input('///{http://host/}///', new Context())), [['<i><a class="url" href="http://host/" target="_blank">http://host/</a></i>'], '']);
    });

  });

});
