import { emphasis } from './emphasis';
import { some } from '../../combinator';
import { input } from '../../combinator/data/parser';
import { Context } from '../context';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/emphasis', () => {
  describe('emphasis', () => {
    const parser = some(emphasis);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('*', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('*a', new Context())), [['*', 'a'], '']);
      assert.deepStrictEqual(inspect(parser, input('*a *', new Context())), [['*', 'a', ' ', '*'], '']);
      assert.deepStrictEqual(inspect(parser, input('*a  *', new Context())), [['*', 'a', ' ', '*'], '']);
      assert.deepStrictEqual(inspect(parser, input('*a\n*', new Context())), [['*', 'a', '<br>', '*'], '']);
      assert.deepStrictEqual(inspect(parser, input('*a\\ *', new Context())), [['*', 'a', ' ', '*'], '']);
      assert.deepStrictEqual(inspect(parser, input('*a\\\n*', new Context())), [['*', 'a', '<br>', '*'], '']);
      assert.deepStrictEqual(inspect(parser, input('*a**b', new Context())), [['*', 'a', '**', 'b'], '']);
      assert.deepStrictEqual(inspect(parser, input('* *', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('* a*', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('* a *', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('*\n*', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('*\na*', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('*\\ a*', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('*\\\na*', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('*<wbr>a*', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('**a**', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('***a***', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input(' *a*', new Context())), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser, input('*a*', new Context())), [['<em>a</em>'], '']);
      assert.deepStrictEqual(inspect(parser, input('*ab*', new Context())), [['<em>ab</em>'], '']);
      assert.deepStrictEqual(inspect(parser, input('*a**', new Context())), [['<em>a</em>'], '*']);
      assert.deepStrictEqual(inspect(parser, input('*a\nb*', new Context())), [['<em>a<br>b</em>'], '']);
      assert.deepStrictEqual(inspect(parser, input('*a\\\nb*', new Context())), [['<em>a<br>b</em>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser, input('*a *b**', new Context())), [['<em>a <em>b</em></em>'], '']);
      assert.deepStrictEqual(inspect(parser, input('*- *b**', new Context())), [['<em>- <em>b</em></em>'], '']);
      assert.deepStrictEqual(inspect(parser, input('*a **b***', new Context())), [['<em>a <strong>b</strong></em>'], '']);
      assert.deepStrictEqual(inspect(parser, input('*a\\ *b**', new Context())), [['<em>a <em>b</em></em>'], '']);
      assert.deepStrictEqual(inspect(parser, input('*a&Tab;*b**', new Context())), [['<em>a\t<em>b</em></em>'], '']);
      assert.deepStrictEqual(inspect(parser, input('*a<wbr>*b**', new Context())), [['<em>a<wbr><em>b</em></em>'], '']);
      assert.deepStrictEqual(inspect(parser, input('*a**b*', new Context())), [['<em>a**b</em>'], '']);
      assert.deepStrictEqual(inspect(parser, input('*a**b**', new Context())), [[ '*', 'a', '<strong>b</strong>'], '']);
      assert.deepStrictEqual(inspect(parser, input('*a**b**c', new Context())), [['*', 'a', '<strong>b</strong>', 'c'], '']);
      assert.deepStrictEqual(inspect(parser, input('*a**b**c*', new Context())), [['<em>a<strong>b</strong>c</em>'], '']);
      assert.deepStrictEqual(inspect(parser, input('*a**b**c*d', new Context())), [['<em>a<strong>b</strong>c</em>'], 'd']);
      assert.deepStrictEqual(inspect(parser, input('*`a`*', new Context())), [['<em><code data-src="`a`">a</code></em>'], '']);
      assert.deepStrictEqual(inspect(parser, input('*(*a*)*', new Context())), [['<em><span class="paren">(<em>a</em>)</span></em>'], '']);
      assert.deepStrictEqual(inspect(parser, input('*(**a**)*', new Context())), [['<em><span class="paren">(<strong>a</strong>)</span></em>'], '']);
    });

  });

});
