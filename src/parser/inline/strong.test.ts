import { strong } from './strong';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/strong', () => {
  describe('strong', () => {
    const parser = (source: string) => some(strong)(source, {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('**')), undefined);
      assert.deepStrictEqual(inspect(parser('**a')), [['**', 'a'], '']);
      assert.deepStrictEqual(inspect(parser('**a*')), [['**', 'a'], '*']);
      assert.deepStrictEqual(inspect(parser('**a*b**')), [['**', 'a', '<em>b</em>'], '*']);
      assert.deepStrictEqual(inspect(parser('** **')), [['**', ' '], '**']);
      assert.deepStrictEqual(inspect(parser('** a**')), [['**', ' ', 'a'], '**']);
      assert.deepStrictEqual(inspect(parser('** a **')), [['**', ' ', 'a', ' '], '**']);
      assert.deepStrictEqual(inspect(parser('**\n**')), [['**', '<br>'], '**']);
      assert.deepStrictEqual(inspect(parser('**\na**')), [['**', '<br>', 'a'], '**']);
      assert.deepStrictEqual(inspect(parser('**\\ a**')), [['**', ' ', 'a'], '**']);
      assert.deepStrictEqual(inspect(parser('**\\\na**')), [['**', '<span class="linebreak"> </span>', 'a'], '**']);
      assert.deepStrictEqual(inspect(parser('**<wbr>a**')), [['**', '<wbr>', 'a'], '**']);
      assert.deepStrictEqual(inspect(parser('**<# a #>b**')), [['**', '<sup class="comment" title="a"></sup>', 'b'], '**']);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('**a**')), [['<strong>a</strong>'], '']);
      assert.deepStrictEqual(inspect(parser('**a **')), [['<strong>a </strong>'], '']);
      assert.deepStrictEqual(inspect(parser('**a\n**')), [['<strong>a<br></strong>'], '']);
      assert.deepStrictEqual(inspect(parser('**a\\\n**')), [['<strong>a<span class="linebreak"> </span></strong>'], '']);
      assert.deepStrictEqual(inspect(parser('**ab**')), [['<strong>ab</strong>'], '']);
      assert.deepStrictEqual(inspect(parser('**a\nb**')), [['<strong>a<br>b</strong>'], '']);
      assert.deepStrictEqual(inspect(parser('**a\\\nb**')), [['<strong>a<span class="linebreak"> </span>b</strong>'], '']);
      assert.deepStrictEqual(inspect(parser('**a*b*c**')), [['<strong>a<em>b</em>c</strong>'], '']);
      assert.deepStrictEqual(inspect(parser('**a*b*c**d')), [['<strong>a<em>b</em>c</strong>'], 'd']);
      assert.deepStrictEqual(inspect(parser('***a***')), [['<strong><em>a</em></strong>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('**`a`**')), [['<strong><code data-src="`a`">a</code></strong>'], '']);
      assert.deepStrictEqual(inspect(parser('**<small>**')), [['<strong>&lt;small&gt;</strong>'], '']);
      assert.deepStrictEqual(inspect(parser('**(*a*)**')), [['<strong>(<em>a</em>)</strong>'], '']);
      assert.deepStrictEqual(inspect(parser('**(**a**)**')), [['<strong>(<strong>a</strong>)</strong>'], '']);
    });

  });

});
