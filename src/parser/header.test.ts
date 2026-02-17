import { header } from './header';
import { input } from '../combinator/data/parser';
import { inspect } from '../debug.test';

describe('Unit: parser/header', () => {
  describe('header', () => {
    const parser = (source: string) => header(input(source, ctx));
    const { context: ctx } = input('', {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser(''), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('---'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('---\n'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('---\n---'), ctx), [['<pre class="invalid" translate="no">---\n---</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('---\na: b\n'), ctx), [['<pre class="invalid" translate="no">---\na: b\n</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('---\na: b\n---c'), ctx), [['<pre class="invalid" translate="no">---\na: b\n---c</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('---\na: b\n---\nc'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('---\r \na: b\n---'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('---\na:\rb\n---'), ctx), [['<pre class="invalid" translate="no">---\na:\nb\n---</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('---\na: b\r \n---'), ctx), [['<pre class="invalid" translate="no">---\na: b\n \n---</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('---\n\n---'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('---\n \n---'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('---\n-\n---'), ctx), [['<pre class="invalid" translate="no">---\n-\n---</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('----\na: b\n----'), ctx), [['<pre class="invalid" translate="no">----\na: b\n----</pre>'], '']);
      assert.deepStrictEqual(inspect(parser(`---\n${'a: b\n'.repeat(101)}---`), ctx), [[`<pre class="invalid" translate="no">---\n${'a: b\n'.repeat(101)}---</pre>`], '']);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('---\na: b\n---'), ctx), [['<aside class="header"><details open=""><summary>Header</summary><span class="field" data-name="a" data-value="b"><span class="field-name">a</span>: <span class="field-value">b</span>\n</span></details></aside>'], '']);
      assert.deepStrictEqual(inspect(parser('---\na: b\n---\n'), ctx), [['<aside class="header"><details open=""><summary>Header</summary><span class="field" data-name="a" data-value="b"><span class="field-name">a</span>: <span class="field-value">b</span>\n</span></details></aside>'], '']);
      assert.deepStrictEqual(inspect(parser('---\na: b\nC: D e\n---\n'), ctx), [['<aside class="header"><details open=""><summary>Header</summary><span class="field" data-name="a" data-value="b"><span class="field-name">a</span>: <span class="field-value">b</span>\n</span><span class="field" data-name="c" data-value="D e"><span class="field-name">C</span>: <span class="field-value">D e</span>\n</span></details></aside>'], '']);
      assert.deepStrictEqual(inspect(parser('--- \r\na: b \r\n--- \r\n \r\n \r\na'), ctx), [['<aside class="header"><details open=""><summary>Header</summary><span class="field" data-name="a" data-value="b"><span class="field-name">a</span>: <span class="field-value">b</span>\n</span></details></aside>'], ' \r\na']);
    });

  });

});
