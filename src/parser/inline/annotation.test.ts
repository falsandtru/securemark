import { annotation } from './annotation';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/annotation', () => {
  describe('annotation', () => {
    const parser = some(annotation);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('(')), undefined);
      assert.deepStrictEqual(inspect(parser('((')), undefined);
      assert.deepStrictEqual(inspect(parser('()')), undefined);
      assert.deepStrictEqual(inspect(parser('(())')), undefined);
      assert.deepStrictEqual(inspect(parser('(()))')), undefined);
      assert.deepStrictEqual(inspect(parser('(( ))')), undefined);
      assert.deepStrictEqual(inspect(parser('(( a))')), undefined);
      assert.deepStrictEqual(inspect(parser('(( a ))')), undefined);
      assert.deepStrictEqual(inspect(parser('((\n))')), undefined);
      assert.deepStrictEqual(inspect(parser('((\\))')), undefined);
      assert.deepStrictEqual(inspect(parser('((<wbr>))')), undefined);
      assert.deepStrictEqual(inspect(parser('((![]{a}))')), undefined);
      assert.deepStrictEqual(inspect(parser('((((a))))')), undefined);
      assert.deepStrictEqual(inspect(parser('a((b))')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('((a))')), [['<sup class="annotation">a</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('((ab))')), [['<sup class="annotation">ab</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('((a ))')), [['<sup class="annotation">a </sup>'], '']);
      assert.deepStrictEqual(inspect(parser('((a\nb))')), [['<sup class="annotation">a<span class="linebreak"> </span>b</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('((a\\\nb))')), [['<sup class="annotation">a<br>b</sup>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('(("))')), [['<sup class="annotation">"</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('((<a>))')), [['<sup class="annotation"><span class="invalid" data-invalid-type="html">&lt;a&gt;</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('((`a`))')), [['<sup class="annotation"><code data-src="`a`">a</code></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('(((a)))')), [['<sup class="annotation">(a)</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('((@a))')), [['<sup class="annotation"><a class="account" rel="noopener">@a</a></sup>'], '']);
    });

  });

});
