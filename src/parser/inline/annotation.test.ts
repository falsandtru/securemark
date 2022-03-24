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
      assert.deepStrictEqual(inspect(parser('((\n))')), undefined);
      assert.deepStrictEqual(inspect(parser('((\na))')), undefined);
      assert.deepStrictEqual(inspect(parser('((\\ a))')), undefined);
      assert.deepStrictEqual(inspect(parser('((\\\na))')), undefined);
      assert.deepStrictEqual(inspect(parser('((<wbr>a))')), undefined);
      assert.deepStrictEqual(inspect(parser('((a\n))')), undefined);
      assert.deepStrictEqual(inspect(parser('((a\\\n))')), undefined);
      assert.deepStrictEqual(inspect(parser('((a\nb))')), undefined);
      assert.deepStrictEqual(inspect(parser('((a\\\nb))')), undefined);
      assert.deepStrictEqual(inspect(parser('((*a\nb*))')), undefined);
      assert.deepStrictEqual(inspect(parser('((\\))')), undefined);
      assert.deepStrictEqual(inspect(parser('((a)b))')), undefined);
      assert.deepStrictEqual(inspect(parser('(((a))')), undefined);
      assert.deepStrictEqual(inspect(parser(' ((a))')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('(( a))')), [['<sup class="annotation">a</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('(( a ))')), [['<sup class="annotation">a</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('((a))')), [['<sup class="annotation">a</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('((a ))')), [['<sup class="annotation">a</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('((a  ))')), [['<sup class="annotation">a</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('((a &nbsp;))')), [['<sup class="annotation">a</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('((a <wbr>))')), [['<sup class="annotation">a</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('((ab))')), [['<sup class="annotation">ab</sup>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('((`a`))')), [['<sup class="annotation"><code data-src="`a`">a</code></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('((@a))')), [['<sup class="annotation"><a href="/@a" class="account">@a</a></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('((http://host))')), [['<sup class="annotation"><a href="http://host" target="_blank">http://host</a></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('((![]{a}))')), [['<sup class="annotation">!<a href="a">a</a></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('((<a>))')), [['<sup class="annotation">&lt;a&gt;</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('(((a)))')), [['<sup class="annotation">(a)</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('((((a))))')), [['<sup class="annotation"><span class="paren">((a))</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('(([[a]]))')), [['<sup class="annotation"><sup class="reference">a</sup></sup>'], '']);
    });

  });

});
