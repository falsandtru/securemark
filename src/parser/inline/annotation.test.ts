import { annotation } from './annotation';
import { some } from '../../combinator';
import { input } from '../context';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/annotation', () => {
  describe('annotation', () => {
    const parser = some(annotation);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('')), undefined);
      assert.deepStrictEqual(inspect(parser, input('(')), [['<span class="paren">(</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('()')), [ [ '<span class="paren">()</span>' ], '' ]);
      assert.deepStrictEqual(inspect(parser, input('((')), [ [ '<span class="paren">(<span class="paren">(</span></span>' ], '' ]);
      assert.deepStrictEqual(inspect(parser, input('(())')), [['<span class="paren">(<span class="paren">()</span>)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(()))')), [['<span class="paren">(<span class="paren">()</span>)</span>'], ')']);
      assert.deepStrictEqual(inspect(parser, input('(("))')), [['<span class="paren">(<span class="paren">("))</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('((a')), [['<span class="paren">(<span class="paren">(a</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('((a)')), [['<span class="paren">(<span class="paren">(a)</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('((a)b)')), [['<span class="paren">(<span class="paren">(a)</span>b)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(([))')), [['<span class="paren">(<span class="paren">([))</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(([%))')), [['<span class="paren">(<span class="paren">([%))</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(( ))')), undefined);
      assert.deepStrictEqual(inspect(parser, input('(( a))')), undefined);
      assert.deepStrictEqual(inspect(parser, input('(( a ))')), undefined);
      assert.deepStrictEqual(inspect(parser, input('((\\ a))')), undefined);
      assert.deepStrictEqual(inspect(parser, input('((<wbr>a))')), undefined);
      assert.deepStrictEqual(inspect(parser, input('((\n))')), undefined);
      assert.deepStrictEqual(inspect(parser, input('((\na))')), undefined);
      assert.deepStrictEqual(inspect(parser, input('((\\\na))')), undefined);
      assert.deepStrictEqual(inspect(parser, input('((a\n))')), [['<span class="bracket">(<span class="bracket">(a<br>)</span>)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('((a\\\n))')), [['<span class="bracket">(<span class="bracket">(a<br>)</span>)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('((a\nb))')), [['<span class="bracket">(<span class="bracket">(a<br>b)</span>)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('((a\\\nb))')), [['<span class="bracket">(<span class="bracket">(a<br>b)</span>)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('((*a\nb*))')), [['<span class="bracket">(<span class="bracket">(<em>a<br>b</em>)</span>)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('((\\))')), [['<span class="paren">(<span class="paren">())</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(((a))')), [['<span class="paren">(<sup class="annotation"><span>a</span></sup></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('((((a)))')), [['<span class="paren">(<sup class="annotation"><span><span class="paren">(a)</span></span></sup></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(((((a))))')), [['<span class="paren">(<sup class="annotation"><span><sup class="annotation"><span>a</span></sup></span></sup></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('((((((a)))b)))')), [['<sup class="annotation"><span><span class="paren">(<sup class="annotation"><span><span class="paren">(a)</span></span></sup>b)</span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(((((((a)))b)))')), [['<span class="paren">(<sup class="annotation"><span><span class="paren">(<sup class="annotation"><span><span class="paren">(a)</span></span></sup>b)</span></span></sup></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input(' ((a))')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser, input('((a))')), [['<sup class="annotation"><span>a</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('((a ))')), [['<sup class="annotation"><span>a</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('((a  ))')), [['<sup class="annotation"><span>a</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('((a &nbsp;))')), [['<sup class="annotation"><span>a</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('((a <wbr>))')), [['<sup class="annotation"><span>a</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('((ab))')), [['<sup class="annotation"><span>ab</span></sup>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser, input('((`a`))')), [['<sup class="annotation"><span><code data-src="`a`">a</code></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('((@a))')), [['<sup class="annotation"><span><a class="account" href="/@a">@a</a></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('((http://host))')), [['<sup class="annotation"><span><a class="url" href="http://host" target="_blank">http://host</a></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('((![]{a}))')), [['<sup class="annotation"><span>!<a class="url" href="a">a</a></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('((a(())))')), [['<sup class="annotation"><span>a<span class="paren">(<span class="paren">()</span>)</span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('((a[[]]))')), [['<sup class="annotation"><span>a[[]]</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(([[a] ]))')), [['<sup class="annotation"><span>[[a] ]</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(((a)))')), [['<sup class="annotation"><span><span class="paren">(a)</span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('((((a))))')), [['<sup class="annotation"><span><sup class="annotation"><span>a</span></sup></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(([[a]]))')), [['<sup class="annotation"><span><sup class="reference"><span>a</span></sup></span></sup>'], '']);
      assert.deepStrictEqual(
        inspect(parser, input(`${'(('.repeat(2)}0${'))'.repeat(2)}`)),
        [['<sup class="annotation"><span><sup class="annotation"><span>0</span></sup></span></sup>'], '']);
      assert.deepStrictEqual(
        inspect(parser, input(`${'(('.repeat(3)}0${'))'.repeat(3)}`)),
        [['<span class="invalid"><sup class="annotation"><span><sup class="annotation"><span>0</span></sup></span></sup></span>'], '']);
      assert.deepStrictEqual(
        inspect(parser, input(`(${'(('.repeat(2)}0${'))'.repeat(2)}`)),
        [['<span class="paren">(<sup class="annotation"><span><sup class="annotation"><span>0</span></sup></span></sup></span>'], '']);
      assert.deepStrictEqual(
        inspect(parser, input(`(${'(('.repeat(3)}0${'))'.repeat(3)}`)),
        [['<span class="paren">(<span class="invalid"><sup class="annotation"><span><sup class="annotation"><span>0</span></sup></span></sup></span></span>'], '']);
      assert.deepStrictEqual(
        inspect(parser, input(`${'(('.repeat(2)}0${'))'.repeat(2)}${'(('.repeat(2)}0${'))'.repeat(2)}`)),
        [['<sup class="annotation"><span><sup class="annotation"><span>0</span></sup></span></sup>', '<sup class="annotation"><span><sup class="annotation"><span>0</span></sup></span></sup>'], '']);
      assert.deepStrictEqual(
        inspect(parser, input(`${'(('.repeat(2)}0${'))'.repeat(2)}${'(('.repeat(3)}0${'))'.repeat(2)}`)),
        [['<sup class="annotation"><span><sup class="annotation"><span>0</span></sup></span></sup>', '<span class="paren">(<span class="paren">(<sup class="annotation"><span><sup class="annotation"><span>0</span></sup></span></sup></span></span>'], '']);
      assert.deepStrictEqual(
        inspect(parser, input(`${'(('.repeat(2)}0${'))'.repeat(2)}${'(('.repeat(3)}0${'))'.repeat(3)}`)),
        [['<sup class="annotation"><span><sup class="annotation"><span>0</span></sup></span></sup>', '<span class="invalid"><sup class="annotation"><span><sup class="annotation"><span>0</span></sup></span></sup></span>'], '']);
      assert.deepStrictEqual(
        inspect(parser, input(`${'(('.repeat(3)}0))((1))))))`)),
        [['<span class="invalid"><sup class="annotation"><span><sup class="annotation"><span>0</span></sup><sup class="annotation"><span>1</span></sup></span></sup></span>'], '']);
      assert.deepStrictEqual(
        inspect(parser, input(`${'(0'.repeat(4)}((0${'))'.repeat(3)}${'(('.repeat(2)}0${'))'.repeat(2)}`)),
        [['<span class="paren">(0<span class="paren">(0<span class="paren">(0<span class="paren">(0<sup class="annotation"><span>0</span></sup>)</span>)</span>)</span>)</span>', '<sup class="annotation"><span><sup class="annotation"><span>0</span></sup></span></sup>'], '']);
    });

  });

});
