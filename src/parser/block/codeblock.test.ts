import { codeblock } from './codeblock';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/codeblock', () => {
  describe('codeblock', () => {
    const parser = (source: string) => some(codeblock)(source, {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('\n')), undefined);
      assert.deepStrictEqual(inspect(parser('```a```\n```')), undefined);
      assert.deepStrictEqual(inspect(parser('```')), [['<pre class="notranslate invalid">```</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```\n')), [['<pre class="notranslate invalid">```\n</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```\na')), [['<pre class="notranslate invalid">```\na</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```\na```')), [['<pre class="notranslate invalid">```\na```</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```\na\n```b')), [['<pre class="notranslate invalid">```\na\n```b</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```\na\n```\nb')), [['<pre class="notranslate invalid">```\na\n```\nb</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```\n````')), [['<pre class="notranslate invalid">```\n````</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('````\n```')), [['<pre class="notranslate invalid">````\n```</pre>'], '']);
      assert.deepStrictEqual(inspect(parser(`\`\`\`\n${'\n'.repeat(301)}\`\`\``), '>'), [['<pre class="notranslate invalid">'], '']);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('```\n```')), [['<pre class="notranslate"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```\n\n```')), [['<pre class="notranslate"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```\na\n```')), [['<pre class="notranslate">a</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```\na\nb\n```')), [['<pre class="notranslate">a<br>b</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```\n\\\n```')), [['<pre class="notranslate">\\</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```\n\n\n```')), [['<pre class="notranslate"><br></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```\n`\n```')), [['<pre class="notranslate">`</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```\n```\n\n```')), [['<pre class="notranslate"></pre>'], '\n```']);
      assert.deepStrictEqual(inspect(parser('```\n````\n```')), [['<pre class="notranslate">````</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```\n````\n\n```')), [['<pre class="notranslate">````<br></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('````\n```\n````')), [['<pre class="notranslate">```</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('````\n```\n\n````')), [['<pre class="notranslate">```<br></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```\n\n```\n')), [['<pre class="notranslate"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```\nhttp://host\n```')), [['<pre class="notranslate"><a href="http://host" rel="noopener" target="_blank">http://host</a></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```\n!http://host\n```')), [['<pre class="notranslate">!<a href="http://host" rel="noopener" target="_blank">http://host</a></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```\n#a\n```')), [['<pre class="notranslate"><a class="hashtag" rel="noopener">#a</a></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```\n@a#b\n```')), [['<pre class="notranslate"><a class="channel" rel="noopener">@a#b</a></pre>'], '']);
      assert.deepStrictEqual(inspect(parser(`\`\`\`\n${'\n'.repeat(300)}\`\`\``), '>'), [['<pre class="notranslate">'], '']);
    });

    it('attribute', () => {
      assert.deepStrictEqual(inspect(parser('```0\n```')), [['<pre class="notranslate code language-0" data-lang="0"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```a\n```')), [['<pre class="notranslate code language-a" data-lang="a"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```A\n```')), [['<pre class="notranslate" data-file="A"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```a-b\n```')), [['<pre class="notranslate code language-a-b" data-lang="a-b"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```a-b0\n```')), [['<pre class="notranslate code language-a-b0" data-lang="a-b0"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```a--b\n```')), [['<pre class="notranslate" data-file="a--b"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('``` b\n```')), [['<pre class="notranslate" data-file="b"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('``` b c \n```')), [['<pre class="notranslate invalid">``` b c \n```</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('``` b.c\n```')), [['<pre class="notranslate code language-c" data-lang="c" data-file="b.c"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```  b.c \n```')), [['<pre class="notranslate code language-c" data-lang="c" data-file="b.c"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('``` ~/.\\ b\n```')), [['<pre class="notranslate" data-file="~/.\\ b"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```a b.c\n```')), [['<pre class="notranslate code language-a" data-lang="a" data-file="b.c"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```A b.c\n```')), [['<pre class="notranslate invalid">```A b.c\n```</pre>'], '']);
    });

  });

});
