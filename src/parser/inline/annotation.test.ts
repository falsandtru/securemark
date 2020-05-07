import { annotation } from './annotation';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/annotation', () => {
  describe('annotation', () => {
    const parser = (source: string) => some(annotation)(source, {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('(')), undefined);
      assert.deepStrictEqual(inspect(parser('()')), undefined);
      assert.deepStrictEqual(inspect(parser('((')), undefined);
      assert.deepStrictEqual(inspect(parser('(())')), undefined);
      assert.deepStrictEqual(inspect(parser('(()))')), undefined);
      assert.deepStrictEqual(inspect(parser('(( ))')), undefined);
      assert.deepStrictEqual(inspect(parser('(( a))')), undefined);
      assert.deepStrictEqual(inspect(parser('(( a ))')), undefined);
      assert.deepStrictEqual(inspect(parser('((\n))')), undefined);
      assert.deepStrictEqual(inspect(parser('((\na))')), undefined);
      assert.deepStrictEqual(inspect(parser('((\\ a))')), undefined);
      assert.deepStrictEqual(inspect(parser('((\\\na))')), undefined);
      assert.deepStrictEqual(inspect(parser('((<wbr>a))')), undefined);
      assert.deepStrictEqual(inspect(parser('((<# a #>a))')), undefined);
      assert.deepStrictEqual(inspect(parser('((a)b))')), undefined);
      assert.deepStrictEqual(inspect(parser('((\\))')), undefined);
      assert.deepStrictEqual(inspect(parser('(((a))')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('((a))')), [['<sup class="annotation">a</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('((a ))')), [['<sup class="annotation">a </sup>'], '']);
      assert.deepStrictEqual(inspect(parser('((a\n))')), [['<sup class="annotation">a</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('((a\\\n))')), [['<sup class="annotation">a<span class="linebreak"> </span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('((ab))')), [['<sup class="annotation">ab</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('((a\nb))')), [['<sup class="annotation">a<br>b</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('((a\\\nb))')), [['<sup class="annotation">a<span class="linebreak"> </span>b</sup>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('((`a`))')), [['<sup class="annotation"><code data-src="`a`">a</code></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('((@a))')), [['<sup class="annotation"><a class="account" href="/@a" rel="noopener">@a</a></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('((http://host))')), [['<sup class="annotation"><a href="http://host" rel="noopener" target="_blank">http://host</a></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('((![]{a}))')), [['<sup class="annotation">!<a href="a" rel="noopener">a</a></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('((<a>))')), [['<sup class="annotation">&lt;a&gt;</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('(((a)))')), [['<sup class="annotation">(a)</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('((((a))))')), [['<sup class="annotation">((a))</sup>'], '']);
    });

  });

});
