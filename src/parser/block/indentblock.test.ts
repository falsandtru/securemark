import { indentblock } from './indentblock';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/indentblock', () => {
  describe('indentblock', () => {
    const parser = (source: string) => some(indentblock)(source, {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('\na')), undefined);
      assert.deepStrictEqual(inspect(parser('a')), undefined);
      assert.deepStrictEqual(inspect(parser('  a')), undefined);
      assert.deepStrictEqual(inspect(parser('   a')), undefined);
      assert.deepStrictEqual(inspect(parser('   \ta')), undefined);
      assert.deepStrictEqual(inspect(parser('    a\nb')), undefined);
      assert.deepStrictEqual(inspect(parser('    a\n b')), undefined);
      assert.deepStrictEqual(inspect(parser('    a\n\tb')), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('    a')), [['<pre class="text">a</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('    a ')), [['<pre class="text">a </pre>'], '']);
      assert.deepStrictEqual(inspect(parser('    a \n')), [['<pre class="text">a </pre>'], '']);
      assert.deepStrictEqual(inspect(parser('    a \n       b')), [['<pre class="text">a <br>   b</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('    a \\\n       b')), [['<pre class="text">a \\<br>   b</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('       a')), [['<pre class="text">   a</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('        a')), [['<pre class="text">a</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('    \ta')), [['<pre class="text">\ta</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('\ta')), [['<pre class="text">a</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('\t\ta')), [['<pre class="text">a</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('\t    a')), [['<pre class="text">    a</pre>'], '']);
    });

  });

});
