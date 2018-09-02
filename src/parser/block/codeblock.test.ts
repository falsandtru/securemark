import { codeblock } from './codeblock';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/codeblock', () => {
  describe('codeblock', () => {
    const parser = some(codeblock);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('\n')), undefined);
      assert.deepStrictEqual(inspect(parser('```')), undefined);
      assert.deepStrictEqual(inspect(parser('```\n')), undefined);
      assert.deepStrictEqual(inspect(parser('```\na```')), undefined);
      assert.deepStrictEqual(inspect(parser('```\na\n```b')), undefined);
      assert.deepStrictEqual(inspect(parser('```\na\n```\nb')), undefined);
      assert.deepStrictEqual(inspect(parser(' ```\n```')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('```\n```')), [['<pre class="notranslate"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```\n\n```')), [['<pre class="notranslate"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```\na\n```')), [['<pre class="notranslate">a</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```\na\nb\n```')), [['<pre class="notranslate">a\nb</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```\n\\\n```')), [['<pre class="notranslate">\\</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```\n\n\n```')), [['<pre class="notranslate">\n</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```\n`\n```')), [['<pre class="notranslate">`</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```\n````\n```')), [['<pre class="notranslate">````</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('````\n```\n````')), [['<pre class="notranslate">```</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```\n\n```\n')), [['<pre class="notranslate"></pre>'], '']);
    });

    it('attribute', () => {
      assert.deepStrictEqual(inspect(parser('```abc\na\n```')), [['<pre class="notranslate language-abc" data-lang="abc">a</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```abc \na\n```')), [['<pre class="notranslate language-abc" data-lang="abc">a</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('``` b\n```')), [['<pre class="notranslate" data-file="b"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('``` b c \n```')), [['<pre class="notranslate" data-file="b"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('``` b.c\n```')), [['<pre class="notranslate" data-file="b.c"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```  b.c \n```')), [['<pre class="notranslate" data-file="b.c"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```"0A ~/.\\ b\n```')), [['<pre class="notranslate language-&quot;0a" data-lang="&quot;0A" data-file="~/.\\ b"></pre>'], '']);
    });

  });

});
