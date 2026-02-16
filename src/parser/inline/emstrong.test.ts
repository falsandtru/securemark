import { emstrong } from './emstrong';
import { some } from '../../combinator';
import { input } from '../../combinator/data/parser';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/emstrong', () => {
  describe('emstrong', () => {
    const parser = (source: string) => some(emstrong)(input(source, {}));

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('***')), undefined);
      assert.deepStrictEqual(inspect(parser('***a')), [['***', 'a'], '']);
      assert.deepStrictEqual(inspect(parser('***a ***')), [['***', 'a', ' ', '***'], '']);
      assert.deepStrictEqual(inspect(parser('***a  ***')), [['***', 'a', ' ', ' ', '***'], '']);
      assert.deepStrictEqual(inspect(parser('***a\n***')), [['***', 'a', '<br>', '***'], '']);
      assert.deepStrictEqual(inspect(parser('***a\\ ***')), [['***', 'a', ' ', '***'], '']);
      assert.deepStrictEqual(inspect(parser('***a\\\n***')), [['***', 'a', '<br>', '***'], '']);
      assert.deepStrictEqual(inspect(parser('*** ***')), undefined);
      assert.deepStrictEqual(inspect(parser('*** a***')), undefined);
      assert.deepStrictEqual(inspect(parser('*** a ***')), undefined);
      assert.deepStrictEqual(inspect(parser('***\n***')), undefined);
      assert.deepStrictEqual(inspect(parser('***\na***')), undefined);
      assert.deepStrictEqual(inspect(parser('***\\ a***')), undefined);
      assert.deepStrictEqual(inspect(parser('***\\\na***')), undefined);
      assert.deepStrictEqual(inspect(parser('***<wbr>a***')), undefined);
      assert.deepStrictEqual(inspect(parser(' ***a***')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('***a***')), [['<em><strong>a</strong></em>'], '']);
      assert.deepStrictEqual(inspect(parser('***ab***')), [['<em><strong>ab</strong></em>'], '']);
      assert.deepStrictEqual(inspect(parser('***a****')), [['<em><strong>a</strong></em>'], '*']);
      assert.deepStrictEqual(inspect(parser('***a\nb***')), [['<em><strong>a<br>b</strong></em>'], '']);
      assert.deepStrictEqual(inspect(parser('***a\\\nb***')), [['<em><strong>a<br>b</strong></em>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('***`a`***')), [['<em><strong><code data-src="`a`">a</code></strong></em>'], '']);
      assert.deepStrictEqual(inspect(parser('***(*a*)***')), [['<em><strong><span class="paren">(<em>a</em>)</span></strong></em>'], '']);
      assert.deepStrictEqual(inspect(parser('***(**a**)***')), [['<em><strong><span class="paren">(<strong>a</strong>)</span></strong></em>'], '']);
      assert.deepStrictEqual(inspect(parser('***(***a***)***')), [['<em><strong><span class="paren">(<em><strong>a</strong></em>)</span></strong></em>'], '']);
      assert.deepStrictEqual(inspect(parser('***a*')), [['**', '<em>a</em>'], '']);
      assert.deepStrictEqual(inspect(parser('***a*b')), [['**', '<em>a</em>', 'b'], '']);
      assert.deepStrictEqual(inspect(parser('***a*b*')), [['**', '<em>a</em>', 'b', '*'], '']);
      assert.deepStrictEqual(inspect(parser('***a*b*c')), [['**', '<em>a</em>', 'b', '*', 'c'], '']);
      assert.deepStrictEqual(inspect(parser('***a*b*c*')), [['**', '<em>a</em>', 'b', '<em>c</em>'], '']);
      assert.deepStrictEqual(inspect(parser('***a*b*c**')), [['**', '<em>a</em>', 'b', '<em>c</em>', '*'], '']);
      assert.deepStrictEqual(inspect(parser('***a*b*c***')), [['<strong><em>a</em>b<em>c</em></strong>'], '']);
      assert.deepStrictEqual(inspect(parser('***a*b**')), [['<strong><em>a</em>b</strong>'], '']);
      assert.deepStrictEqual(inspect(parser('***a*b**c')), [['<strong><em>a</em>b</strong>'], 'c']);
      assert.deepStrictEqual(inspect(parser('***a**')), [['*', '<strong>a</strong>'], '']);
      assert.deepStrictEqual(inspect(parser('***a**b')), [['*', '<strong>a</strong>', 'b'], '']);
      assert.deepStrictEqual(inspect(parser('***a**b*')), [['<em><strong>a</strong>b</em>'], '']);
      assert.deepStrictEqual(inspect(parser('***a**b**')), [['<em><strong>a</strong>b</em>'], '*']);
      assert.deepStrictEqual(inspect(parser('***a**b**c')), [['*', '<strong>a</strong>', 'b', '**', 'c'], '']);
      assert.deepStrictEqual(inspect(parser('***a**b**c*')), [['*', '<strong>a</strong>', 'b', '**', 'c', '*'], '']);
      assert.deepStrictEqual(inspect(parser('***a**b**c**')), [['*', '<strong>a</strong>', 'b', '<strong>c</strong>'], '']);
      assert.deepStrictEqual(inspect(parser('***a**b**c***')), [['<em><strong>a</strong>b<strong>c</strong></em>'], '']);
      assert.deepStrictEqual(inspect(parser('***a **b*')), [['***', 'a', ' ', '**', 'b', '*'], '']);
      assert.deepStrictEqual(inspect(parser('***a\\ *b****')), [['<em><strong>a <em>b</em></strong></em>'], '']);
      assert.deepStrictEqual(inspect(parser('***a\\ **b*')), [['***', 'a', ' ', '**', 'b', '*'], '']);
      assert.deepStrictEqual(inspect(parser('***a&Tab;*b****')), [['<em><strong>a\t<em>b</em></strong></em>'], '']);
      assert.deepStrictEqual(inspect(parser('***a<wbr>*b****')), [['<em><strong>a<wbr><em>b</em></strong></em>'], '']);
      assert.deepStrictEqual(inspect(parser('***a *b****')), [['<em><strong>a <em>b</em></strong></em>'], '']);
      assert.deepStrictEqual(inspect(parser('***a* **b****')), [['<strong><em>a</em> <strong>b</strong></strong>'], '']);
      assert.deepStrictEqual(inspect(parser('***a*\\ **b****')), [['<strong><em>a</em> <strong>b</strong></strong>'], '']);
      assert.deepStrictEqual(inspect(parser('***a*&Tab;**b****')), [['<strong><em>a</em>\t<strong>b</strong></strong>'], '']);
      assert.deepStrictEqual(inspect(parser('***a*<wbr>**b****')), [['<strong><em>a</em><wbr><strong>b</strong></strong>'], '']);
      assert.deepStrictEqual(inspect(parser('***a*b **')), [['**', '<em>a</em>', 'b'], ' **']);
      assert.deepStrictEqual(inspect(parser('***a*b\\ **')), [['**', '<em>a</em>', 'b'], '\\ **']);
      assert.deepStrictEqual(inspect(parser('***a**b*')), [['<em><strong>a</strong>b</em>'], '']);
      assert.deepStrictEqual(inspect(parser('***a**b*c')), [['<em><strong>a</strong>b</em>'], 'c']);
      assert.deepStrictEqual(inspect(parser('***a**b*c**')), [['<em><strong>a</strong>b</em>'], 'c**']);
      assert.deepStrictEqual(inspect(parser('***a**b**c***')), [['<em><strong>a</strong>b<strong>c</strong></em>'], '']);
      assert.deepStrictEqual(inspect(parser('***a**b**c***d')), [['<em><strong>a</strong>b<strong>c</strong></em>'], 'd']);
      assert.deepStrictEqual(inspect(parser('***a** *b**')), [['<em><strong>a</strong> <em>b</em></em>'], '']);
      assert.deepStrictEqual(inspect(parser('***a**\\ *b**')), [['<em><strong>a</strong> <em>b</em></em>'], '']);
      assert.deepStrictEqual(inspect(parser('***a**&Tab;*b**')), [['<em><strong>a</strong>\t<em>b</em></em>'], '']);
      assert.deepStrictEqual(inspect(parser('***a**<wbr>*b**')), [['<em><strong>a</strong><wbr><em>b</em></em>'], '']);
      assert.deepStrictEqual(inspect(parser('***a**b *')), [['*', '<strong>a</strong>', 'b'], ' *']);
      assert.deepStrictEqual(inspect(parser('***a**b\\ *')), [['*', '<strong>a</strong>', 'b'], '\\ *']);
      assert.deepStrictEqual(inspect(parser('***a*')), [['**', '<em>a</em>'], '']);
      assert.deepStrictEqual(inspect(parser('***a**')), [['*', '<strong>a</strong>'], '']);
      assert.deepStrictEqual(inspect(parser('***a***')), [['<em><strong>a</strong></em>'], '']);
      assert.deepStrictEqual(inspect(parser('***a***b')), [['<em><strong>a</strong></em>'], 'b']);
      assert.deepStrictEqual(inspect(parser('***a****')), [['<em><strong>a</strong></em>'], '*']);
      assert.deepStrictEqual(inspect(parser('***a*****')), [['<em><strong>a</strong></em>'], '**']);
      assert.deepStrictEqual(inspect(parser('***a******')), [['<em><strong>a</strong></em>'], '***']);
      assert.deepStrictEqual(inspect(parser('****a***')), [['*', '<em><strong>a</strong></em>'], '']);
      assert.deepStrictEqual(inspect(parser('****a***b')), [['*', '<em><strong>a</strong></em>'], 'b']);
      assert.deepStrictEqual(inspect(parser('****a****')), [['<em><em><strong>a</strong></em></em>'], '']);
      assert.deepStrictEqual(inspect(parser('****a****b')), [['<em><em><strong>a</strong></em></em>'], 'b']);
      assert.deepStrictEqual(inspect(parser('*****a***')), [['**', '<em><strong>a</strong></em>'], '']);
      assert.deepStrictEqual(inspect(parser('*****a***b')), [['**', '<em><strong>a</strong></em>'], 'b']);
      assert.deepStrictEqual(inspect(parser('*****a****')), [['*', '<em><em><strong>a</strong></em></em>'], '']);
      assert.deepStrictEqual(inspect(parser('*****a****b')), [['*', '<em><em><strong>a</strong></em></em>'], 'b']);
      assert.deepStrictEqual(inspect(parser('*****a*****')), [['<strong><em><strong>a</strong></em></strong>'], '']);
      assert.deepStrictEqual(inspect(parser('******a***')), [['***', '<em><strong>a</strong></em>'], '']);
      assert.deepStrictEqual(inspect(parser('******a***b')), [['***', '<em><strong>a</strong></em>', 'b'], '']);
      assert.deepStrictEqual(inspect(parser('******a****')), [['**', '<em><em><strong>a</strong></em></em>'], '']);
      assert.deepStrictEqual(inspect(parser('******a****b')), [['**', '<em><em><strong>a</strong></em></em>'], 'b']);
      assert.deepStrictEqual(inspect(parser('******a*****')), [['*', '<strong><em><strong>a</strong></em></strong>'], '']);
      assert.deepStrictEqual(inspect(parser('******a*****b')), [['*', '<strong><em><strong>a</strong></em></strong>'], 'b']);
      assert.deepStrictEqual(inspect(parser('******a******')), [['<em><strong><em><strong>a</strong></em></strong></em>'], '']);
      assert.deepStrictEqual(inspect(parser('******a******b')), [['<em><strong><em><strong>a</strong></em></strong></em>'], 'b']);
      assert.deepStrictEqual(inspect(parser('******a*b')), [['***', '**', '<em>a</em>', 'b'], '']);
      assert.deepStrictEqual(inspect(parser('******a*b *')), [['***', '**', '<em>a</em>', 'b', ' ', '*'], '']);
      assert.deepStrictEqual(inspect(parser('******a*b **')), [['***', '**', '<em>a</em>', 'b'], ' **']);
      assert.deepStrictEqual(inspect(parser('******a*b ***')), [['***', '**', '<em>a</em>', 'b'], ' ***']);
      assert.deepStrictEqual(inspect(parser('******a*b ****')), [['***', '**', '<em>a</em>', 'b'], ' ****']);
      assert.deepStrictEqual(inspect(parser('******a*b *****')), [['***', '**', '<em>a</em>', 'b'], ' *****']);
    });

  });

});
