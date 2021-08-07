import { header } from './header';
import { some } from '../combinator';
import { inspect } from '../debug.test';

describe('Unit: parser/header', () => {
  describe('header', () => {
    const parser = (source: string) => some(header)(source, {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('---')), undefined);
      assert.deepStrictEqual(inspect(parser('---\n')), undefined);
      assert.deepStrictEqual(inspect(parser('---\n---')), [['<pre class="invalid" translate="no">---\n---</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('---\na: b\n')), [['<pre class="invalid" translate="no">---\na: b\n</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('---\na: b\n---c')), [['<pre class="invalid" translate="no">---\na: b\n---c</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('---\na: b\n---\nc')), undefined);
      assert.deepStrictEqual(inspect(parser('---\r \na: b\n---')), undefined);
      assert.deepStrictEqual(inspect(parser('---\na:\rb\n---')), [['<pre class="invalid" translate="no">---\na:\nb\n---</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('---\na: b\r \n---')), [['<pre class="invalid" translate="no">---\na: b\n \n---</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('---\n\n---')), undefined);
      assert.deepStrictEqual(inspect(parser('---\n \n---')), undefined);
      assert.deepStrictEqual(inspect(parser('---\n-\n---')), [['<pre class="invalid" translate="no">---\n-\n---</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('----\na: b\n----')), [['<pre class="invalid" translate="no">----\na: b\n----</pre>'], '']);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('---\na: b\n---')), [['<details class="header" open=""><summary>Header</summary>a: b</details>'], '']);
      assert.deepStrictEqual(inspect(parser('---\na: b\n---\n')), [['<details class="header" open=""><summary>Header</summary>a: b</details>'], '']);
      assert.deepStrictEqual(inspect(parser('---\na: b\nC: d e\n---\n')), [['<details class="header" open=""><summary>Header</summary>a: b\nC: d e</details>'], '']);
      assert.deepStrictEqual(inspect(parser('--- \r\na: b \r\n--- \r\n \r\n \r\na')), [['<details class="header" open=""><summary>Header</summary>a: b</details>'], ' \r\na']);
    });

  });

});
