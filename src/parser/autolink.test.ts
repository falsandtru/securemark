import { autolink } from './autolink';
import { input } from '../combinator/data/parser';
import { Context } from './context';
import { inspect } from '../debug.test';

describe('Unit: parser/autolink', () => {
  describe('autolink', () => {
    const parser = autolink;

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser, input('http://host)', new Context())), [['<a class="url" href="http://host)" target="_blank">http://host)</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('http://host\\', new Context())), [['<a class="url" href="http://host\\" target="_blank">http://host\\</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('!http://host)', new Context())), [['!', '<a class="url" href="http://host)" target="_blank">http://host)</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('!http://host\\', new Context())), [['!', '<a class="url" href="http://host\\" target="_blank">http://host\\</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('#a', new Context())), [['<a class="hashtag" href="/hashtags/a">#a</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('@a#b', new Context())), [['<a class="channel" href="/@a?ch=b">@a#b</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('\\\n', new Context())), [['\\', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('a#b', new Context())), [['a', '#b'], '']);
      assert.deepStrictEqual(inspect(parser, input('0a#b', new Context())), [['0a', '#b'], '']);
      assert.deepStrictEqual(inspect(parser, input('あ#b', new Context())), [['あ', '#b'], '']);
      assert.deepStrictEqual(inspect(parser, input('あい#b', new Context())), [['あい', '#b'], '']);
      assert.deepStrictEqual(inspect(parser, input('0aあ#b', new Context())), [['0a', 'あ', '#b'], '']);
      assert.deepStrictEqual(inspect(parser, input('0aあい#b', new Context())), [['0a', 'あい', '#b'], '']);
      assert.deepStrictEqual(inspect(parser, input('a\n#b', new Context())), [['a', '<br>', '<a class="hashtag" href="/hashtags/b">#b</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('a\\\n#b', new Context())), [['a', '\\', '<br>', '<a class="hashtag" href="/hashtags/b">#b</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('0a>>b', new Context())), [['0a', '>', '>b'], '']);
    });

  });

});
