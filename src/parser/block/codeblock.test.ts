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
      assert.deepStrictEqual(inspect(parser('```\n```\n```')), undefined);
      assert.deepStrictEqual(inspect(parser('````\n```')), undefined);
      assert.deepStrictEqual(inspect(parser(' ```\n```')), undefined);
      assert(!parser('```\n' + '\n'.repeat(301) + '```'));
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('```\n```')), [['<pre class="notranslate"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```\n\n```')), [['<pre class="notranslate"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```\na\n```')), [['<pre class="notranslate">a</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```\na\nb\n```')), [['<pre class="notranslate">a\nb</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```\n\\\n```')), [['<pre class="notranslate">\\</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```\n\n\n```')), [['<pre class="notranslate">\n</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```\n`\n```')), [['<pre class="notranslate">`</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```\n```\n\n```')), [['<pre class="notranslate"></pre>'], '\n```']);
      assert.deepStrictEqual(inspect(parser('```\n````\n```')), [['<pre class="notranslate">````</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```\n````\n\n```')), [['<pre class="notranslate">````\n</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('````\n```\n````')), [['<pre class="notranslate">```</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('````\n```\n\n````')), [['<pre class="notranslate">```\n</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```\n\n```\n')), [['<pre class="notranslate"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```\nhttp://host\n```')), [['<pre class="notranslate"><a href="http://host" rel="noopener" target="_blank">http://host</a></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```\n!http://host\n```')), [['<pre class="notranslate">!<a href="http://host" rel="noopener" target="_blank">http://host</a></pre>'], '']);
      assert(parser('```\n' + '\n'.repeat(300) + '```'));
    });

    it('attribute', () => {
      assert.deepStrictEqual(inspect(parser('```0\n```')), [['<pre class="notranslate code language-invalid" data-lang="invalid"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```a\n```')), [['<pre class="notranslate code language-a" data-lang="a"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```A\n```')), [['<pre class="notranslate code language-invalid" data-lang="invalid"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```a-b\n```')), [['<pre class="notranslate code language-a-b" data-lang="a-b"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```a-b0\n```')), [['<pre class="notranslate code language-a-b0" data-lang="a-b0"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```a--b\n```')), [['<pre class="notranslate code language-invalid" data-lang="invalid"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('``` b\n```')), [['<pre class="notranslate" data-file="b"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('``` b c \n```')), [['<pre class="notranslate" data-file="b"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('``` b.c\n```')), [['<pre class="notranslate" data-file="b.c"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```  b.c \n```')), [['<pre class="notranslate" data-file="b.c"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('``` ~/.\\ b\n```')), [['<pre class="notranslate" data-file="~/.\\ b"></pre>'], '']);
    });

  });

});
