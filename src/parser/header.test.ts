import { header } from './header';
import { input } from './context';
import { inspect } from '../debug.test';

describe('Unit: parser/header', () => {
  describe('header', () => {
    const parser = header;

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('')), undefined);
      assert.deepStrictEqual(inspect(parser, input('---')), undefined);
      assert.deepStrictEqual(inspect(parser, input('---\n')), undefined);
      assert.deepStrictEqual(inspect(parser, input('---\n---')), [['<pre class="invalid" translate="no">---\n---</pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('---\na: b\n')), [['<pre class="invalid" translate="no">---\na: b\n</pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('---\na: b\n---c')), [['<pre class="invalid" translate="no">---\na: b\n---c</pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('---\na: b\n---\nc')), undefined);
      assert.deepStrictEqual(inspect(parser, input('---\n\n---')), undefined);
      assert.deepStrictEqual(inspect(parser, input('---\n \n---')), undefined);
      assert.deepStrictEqual(inspect(parser, input('---\n-\n---')), [['<pre class="invalid" translate="no">---\n-\n---</pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('---\na: b\n----')), [['<pre class="invalid" translate="no">---\na: b\n----</pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('----\na: b\n---')), [['<pre class="invalid" translate="no">----\na: b\n---</pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input(`---\n${'a: b\n'.repeat(101)}---`)), [[`<pre class="invalid" translate="no">---\n${'a: b\n'.repeat(101)}---</pre>`], '']);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser, input('---\na: b\n---')), [['<aside class="header"><details open=""><summary>Header</summary><div class="field" data-name="a" data-value="b"><span class="field-name">a</span>: <span class="field-value">b</span></div></details></aside>'], '']);
      assert.deepStrictEqual(inspect(parser, input('---\na: b\n---\n')), [['<aside class="header"><details open=""><summary>Header</summary><div class="field" data-name="a" data-value="b"><span class="field-name">a</span>: <span class="field-value">b</span></div></details></aside>'], '']);
      assert.deepStrictEqual(inspect(parser, input('---\na: b\nC: D e\n---\n')), [['<aside class="header"><details open=""><summary>Header</summary><div class="field" data-name="a" data-value="b"><span class="field-name">a</span>: <span class="field-value">b</span></div><div class="field" data-name="c" data-value="D e"><span class="field-name">C</span>: <span class="field-value">D e</span></div></details></aside>'], '']);
      assert.deepStrictEqual(inspect(parser, input('---\r\na: b\r\nC: D e\r\n---\r\n')), [['<aside class="header"><details open=""><summary>Header</summary><div class="field" data-name="a" data-value="b"><span class="field-name">a</span>: <span class="field-value">b</span></div><div class="field" data-name="c" data-value="D e"><span class="field-name">C</span>: <span class="field-value">D e</span></div></details></aside>'], '']);
      assert.deepStrictEqual(inspect(parser, input('----\na: b\n----')), [['<aside class="header"><details open=""><summary>Header</summary><div class="field" data-name="a" data-value="b"><span class="field-name">a</span>: <span class="field-value">b</span></div></details></aside>'], '']);
    });

  });

});
