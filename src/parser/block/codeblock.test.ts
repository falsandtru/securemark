import { codeblock } from './codeblock';
import { some } from '../../combinator';
import { input } from '../context';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/codeblock', () => {
  describe('codeblock', () => {
    const parser = some(codeblock);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('')), undefined);
      assert.deepStrictEqual(inspect(parser, input('\n')), undefined);
      assert.deepStrictEqual(inspect(parser, input('```')), undefined);
      assert.deepStrictEqual(inspect(parser, input('```\n')), undefined);
      assert.deepStrictEqual(inspect(parser, input('```\na')), [['<pre class="invalid" translate="no">```\na</pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('```\na```')), [['<pre class="invalid" translate="no">```\na```</pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('```\na\n```b')), [['<pre class="invalid" translate="no">```\na\n```b</pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('```\na\n```\nb')), [['<pre class="invalid" translate="no">```\na\n```\nb</pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('```\n\n\n```')), undefined);
      assert.deepStrictEqual(inspect(parser, input('```a ```\n```')), undefined);
      assert.deepStrictEqual(inspect(parser, input('```\n```\n```')), [['<pre class="invalid" translate="no">```\n```\n```</pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('```\n````')), [['<pre class="invalid" translate="no">```\n````</pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('````\n```')), [['<pre class="invalid" translate="no">````\n```</pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input(' ```\n```')), undefined);
      assert.deepStrictEqual(inspect(parser, input(`\`\`\`\n0${'\n'.repeat(301)}\`\`\``), '>'), [['<pre class="invalid" translate="no">'], '']);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser, input('```\n```')), [['<pre class="text"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('```\n\n```')), [['<pre class="text"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('```\na\n```')), [['<pre class="text">a</pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('```\na\nb\n```')), [['<pre class="text">a<br>b</pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('```\n\\\n```')), [['<pre class="text">\\</pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('```\n`\n```')), [['<pre class="text">`</pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('```\n```\n\n```')), [['<pre class="text"></pre>'], '\n```']);
      assert.deepStrictEqual(inspect(parser, input('```\n````\n```')), [['<pre class="text">````</pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('```\n````\n\n```')), [['<pre class="text">````<br></pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('````\n```\n````')), [['<pre class="text">```</pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('````\n```\n\n````')), [['<pre class="text">```<br></pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('```\n\n```\n')), [['<pre class="text"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('```\nhttp://host\n```')), [['<pre class="text"><a class="url" href="http://host" target="_blank">http://host</a></pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('```\nhttp://host)\n```')), [['<pre class="text"><a class="url" href="http://host)" target="_blank">http://host)</a></pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('```\n!http://host\n```')), [['<pre class="text">!<a class="url" href="http://host" target="_blank">http://host</a></pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('```\n!http://host)\n```')), [['<pre class="text">!<a class="url" href="http://host)" target="_blank">http://host)</a></pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('```\n#a\n```')), [['<pre class="text"><a class="hashtag" href="/hashtags/a">#a</a></pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('```\n@a#b\n```')), [['<pre class="text"><a class="channel" href="/@a?ch=b">@a#b</a></pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input(`\`\`\`\n0${'\n'.repeat(300)}\`\`\``), '>'), [['<pre class="text">'], '']);
    });

    it('attribute', () => {
      assert.deepStrictEqual(inspect(parser, input('```0\n```')), [['<pre class="code language-0" translate="no" data-lang="0"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('```a\n```')), [['<pre class="code language-a" translate="no" data-lang="a"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('```A\n```')), [['<pre class="code language-a" translate="no" data-lang="a"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('```a-b\n```')), [['<pre class="code language-a-b" translate="no" data-lang="a-b"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('```a-b0\n```')), [['<pre class="code language-a-b0" translate="no" data-lang="a-b0"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('```a--b\n```')), [['<pre class="text" data-path="a--b"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('``` b\n```')), [['<pre class="text" data-path="b"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('``` b c\n```')), [['<pre class="invalid" translate="no">``` b c\n```</pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('``` b\\ c\n```')), [['<pre class="text" data-path="b\\ c"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('``` b.c\n```')), [['<pre class="code language-c" translate="no" data-lang="c" data-path="b.c"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('``` .b\n```')), [['<pre class="text" data-path=".b"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('```  b \n```')), [['<pre class="text" data-path="b"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('``` ~/.b\n```')), [['<pre class="text" data-path="~/.b"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('``` ~/b.c\n```')), [['<pre class="code language-c" translate="no" data-lang="c" data-path="~/b.c"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('```.b\n```')), [['<pre class="text" data-path=".b"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('```b.c\n```')), [['<pre class="code language-c" translate="no" data-lang="c" data-path="b.c"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('```a b.c\n```')), [['<pre class="code language-a" translate="no" data-lang="a" data-path="b.c"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('```a 1\n```')), [['<pre class="code language-a" translate="no" data-lang="a" data-line="1"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('``` 1\n```')), [['<pre class="text" data-line="1"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('``` 1,2-3\n```')), [['<pre class="text" data-line="1,2-3"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('``` 1 b.c\n```')), [['<pre class="code language-c" translate="no" data-lang="c" data-line="1" data-path="b.c"></pre>'], '']);
    });

  });

});
