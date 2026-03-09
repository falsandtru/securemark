import { codeblock } from './codeblock';
import { some } from '../../combinator';
import { input } from '../../combinator/data/parser';
import { Context } from '../context';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/codeblock', () => {
  describe('codeblock', () => {
    const parser = some(codeblock);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('\n', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('```', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('```\n', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('```\na', new Context())), [['<pre class="invalid" translate="no">```\na</pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('```\na```', new Context())), [['<pre class="invalid" translate="no">```\na```</pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('```\na\n```b', new Context())), [['<pre class="invalid" translate="no">```\na\n```b</pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('```\na\n```\nb', new Context())), [['<pre class="invalid" translate="no">```\na\n```\nb</pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('```\n\n\n```', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('```a ```\n```', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('```\n```\n```', new Context())), [['<pre class="invalid" translate="no">```\n```\n```</pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('```\n````', new Context())), [['<pre class="invalid" translate="no">```\n````</pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('````\n```', new Context())), [['<pre class="invalid" translate="no">````\n```</pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input(' ```\n```', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input(`\`\`\`\n0${'\n'.repeat(301)}\`\`\``, new Context()), '>'), [['<pre class="invalid" translate="no">'], '']);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser, input('```\n```', new Context())), [['<pre class="text"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('```\n\n```', new Context())), [['<pre class="text"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('```\na\n```', new Context())), [['<pre class="text">a</pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('```\na\nb\n```', new Context())), [['<pre class="text">a<br>b</pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('```\n\\\n```', new Context())), [['<pre class="text">\\</pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('```\n`\n```', new Context())), [['<pre class="text">`</pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('```\n```\n\n```', new Context())), [['<pre class="text"></pre>'], '\n```']);
      assert.deepStrictEqual(inspect(parser, input('```\n````\n```', new Context())), [['<pre class="text">````</pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('```\n````\n\n```', new Context())), [['<pre class="text">````<br></pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('````\n```\n````', new Context())), [['<pre class="text">```</pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('````\n```\n\n````', new Context())), [['<pre class="text">```<br></pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('```\n\n```\n', new Context())), [['<pre class="text"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('```\nhttp://host\n```', new Context())), [['<pre class="text"><a class="url" href="http://host" target="_blank">http://host</a></pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('```\nhttp://host)\n```', new Context())), [['<pre class="text"><a class="url" href="http://host)" target="_blank">http://host)</a></pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('```\n!http://host\n```', new Context())), [['<pre class="text">!<a class="url" href="http://host" target="_blank">http://host</a></pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('```\n!http://host)\n```', new Context())), [['<pre class="text">!<a class="url" href="http://host)" target="_blank">http://host)</a></pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('```\n#a\n```', new Context())), [['<pre class="text"><a class="hashtag" href="/hashtags/a">#a</a></pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('```\n@a#b\n```', new Context())), [['<pre class="text"><a class="channel" href="/@a?ch=b">@a#b</a></pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input(`\`\`\`\n0${'\n'.repeat(300)}\`\`\``, new Context()), '>'), [['<pre class="text">'], '']);
    });

    it('attribute', () => {
      assert.deepStrictEqual(inspect(parser, input('```0\n```', new Context())), [['<pre class="code language-0" translate="no" data-lang="0"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('```a\n```', new Context())), [['<pre class="code language-a" translate="no" data-lang="a"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('```A\n```', new Context())), [['<pre class="code language-a" translate="no" data-lang="a"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('```a-b\n```', new Context())), [['<pre class="code language-a-b" translate="no" data-lang="a-b"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('```a-b0\n```', new Context())), [['<pre class="code language-a-b0" translate="no" data-lang="a-b0"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('```a--b\n```', new Context())), [['<pre class="text" data-path="a--b"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('``` b\n```', new Context())), [['<pre class="text" data-path="b"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('``` b c\n```', new Context())), [['<pre class="invalid" translate="no">``` b c\n```</pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('``` b\\ c\n```', new Context())), [['<pre class="text" data-path="b\\ c"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('``` b.c\n```', new Context())), [['<pre class="code language-c" translate="no" data-lang="c" data-path="b.c"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('``` .b\n```', new Context())), [['<pre class="text" data-path=".b"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('```  b \n```', new Context())), [['<pre class="text" data-path="b"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('``` ~/.b\n```', new Context())), [['<pre class="text" data-path="~/.b"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('``` ~/b.c\n```', new Context())), [['<pre class="code language-c" translate="no" data-lang="c" data-path="~/b.c"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('```.b\n```', new Context())), [['<pre class="text" data-path=".b"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('```b.c\n```', new Context())), [['<pre class="code language-c" translate="no" data-lang="c" data-path="b.c"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('```a b.c\n```', new Context())), [['<pre class="code language-a" translate="no" data-lang="a" data-path="b.c"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('```a 1\n```', new Context())), [['<pre class="code language-a" translate="no" data-lang="a" data-line="1"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('``` 1\n```', new Context())), [['<pre class="text" data-line="1"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('``` 1,2-3\n```', new Context())), [['<pre class="text" data-line="1,2-3"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('``` 1 b.c\n```', new Context())), [['<pre class="code language-c" translate="no" data-lang="c" data-line="1" data-path="b.c"></pre>'], '']);
    });

  });

});
