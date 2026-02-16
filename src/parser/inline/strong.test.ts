import { strong } from './strong';
import { some } from '../../combinator';
import { input } from '../../combinator/data/parser';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/strong', () => {
  describe('strong', () => {
    const parser = (source: string) => some(strong)(input(source, {}));

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('**')), undefined);
      assert.deepStrictEqual(inspect(parser('**a')), [['**', 'a'], '']);
      assert.deepStrictEqual(inspect(parser('**a **')), [['**', 'a'], ' **']);
      assert.deepStrictEqual(inspect(parser('**a  **')), [['**', 'a', ' '], ' **']);
      assert.deepStrictEqual(inspect(parser('**a\n**')), [['**', 'a'], '\n**']);
      assert.deepStrictEqual(inspect(parser('**a\\ **')), [['**', 'a'], '\\ **']);
      assert.deepStrictEqual(inspect(parser('**a\\\n**')), [['**', 'a'], '\\\n**']);
      assert.deepStrictEqual(inspect(parser('**a*')), [['**', 'a', '*'], '']);
      assert.deepStrictEqual(inspect(parser('**a*b**')), [['**', 'a', '<em>b</em>', '*'], '']);
      assert.deepStrictEqual(inspect(parser('** **')), undefined);
      assert.deepStrictEqual(inspect(parser('** a**')), undefined);
      assert.deepStrictEqual(inspect(parser('** a **')), undefined);
      assert.deepStrictEqual(inspect(parser('**\n**')), undefined);
      assert.deepStrictEqual(inspect(parser('**\na**')), undefined);
      assert.deepStrictEqual(inspect(parser('**\\ a**')), undefined);
      assert.deepStrictEqual(inspect(parser('**\\\na**')), undefined);
      assert.deepStrictEqual(inspect(parser('**<wbr>a**')), undefined);
      assert.deepStrictEqual(inspect(parser('***a***')), undefined);
      assert.deepStrictEqual(inspect(parser(' **a**')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('**a**')), [['<strong>a</strong>'], '']);
      assert.deepStrictEqual(inspect(parser('**ab**')), [['<strong>ab</strong>'], '']);
      assert.deepStrictEqual(inspect(parser('**a\nb**')), [['<strong>a<br>b</strong>'], '']);
      assert.deepStrictEqual(inspect(parser('**a\\\nb**')), [['<strong>a<br>b</strong>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('**a *b***')), [['<strong>a <em>b</em></strong>'], '']);
      assert.deepStrictEqual(inspect(parser('**a **b****')), [['<strong>a <strong>b</strong></strong>'], '']);
      assert.deepStrictEqual(inspect(parser('**a&Tab;**b****')), [['<strong>a\t<strong>b</strong></strong>'], '']);
      assert.deepStrictEqual(inspect(parser('**a<wbr>**b****')), [['<strong>a<wbr><strong>b</strong></strong>'], '']);
      assert.deepStrictEqual(inspect(parser('**a*b*c**')), [['<strong>a<em>b</em>c</strong>'], '']);
      assert.deepStrictEqual(inspect(parser('**a*b*c**d')), [['<strong>a<em>b</em>c</strong>'], 'd']);
      assert.deepStrictEqual(inspect(parser('**`a`**')), [['<strong><code data-src="`a`">a</code></strong>'], '']);
      assert.deepStrictEqual(inspect(parser('**(*a*)**')), [['<strong><span class="paren">(<em>a</em>)</span></strong>'], '']);
      assert.deepStrictEqual(inspect(parser('**(**a**)**')), [['<strong><span class="paren">(<strong>a</strong>)</span></strong>'], '']);
    });

  });

});
