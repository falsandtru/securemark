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
      assert.deepStrictEqual(inspect(parser('   \t\ta')), undefined);
      assert.deepStrictEqual(inspect(parser('    a\nb')), undefined);
      assert.deepStrictEqual(inspect(parser('    a\n b')), undefined);
      assert.deepStrictEqual(inspect(parser('    a\n\t\tb')), undefined);
      assert.deepStrictEqual(inspect(parser('\ta')), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('    a')), [['<pre class="text">a</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('    a ')), [['<pre class="text">a </pre>'], '']);
      assert.deepStrictEqual(inspect(parser('    a \n')), [['<pre class="text">a </pre>'], '']);
      assert.deepStrictEqual(inspect(parser('    a \n       b')), [['<pre class="text">a <br>   b</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('    a \\\n       b')), [['<pre class="text">a \\<br>   b</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('       a')), [['<pre class="text">   a</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('        a')), [['<pre class="text">a</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('    \t\ta')), [['<pre class="text">\t\ta</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('\t\ta')), [['<pre class="text">a</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('\t\t\ta')), [['<pre class="text">a</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('\t\t    a')), [['<pre class="text">    a</pre>'], '']);
    });

  });

});
