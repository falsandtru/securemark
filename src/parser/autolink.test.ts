import { autolink } from './autolink';
import { input } from '../combinator/data/parser';
import { inspect } from '../debug.test';

describe('Unit: parser/autolink', () => {
  describe('autolink', () => {
    const parser = (source: string) => autolink(input(source, ctx));
    const { context: ctx } = input('', {});

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('http://host)'), ctx), [['<a class="url" href="http://host)" target="_blank">http://host)</a>'], '']);
      assert.deepStrictEqual(inspect(parser('http://host\\'), ctx), [['<a class="url" href="http://host\\" target="_blank">http://host\\</a>'], '']);
      assert.deepStrictEqual(inspect(parser('!http://host)'), ctx), [['!', '<a class="url" href="http://host)" target="_blank">http://host)</a>'], '']);
      assert.deepStrictEqual(inspect(parser('!http://host\\'), ctx), [['!', '<a class="url" href="http://host\\" target="_blank">http://host\\</a>'], '']);
      assert.deepStrictEqual(inspect(parser('#a'), ctx), [['<a class="hashtag" href="/hashtags/a">#a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('@a#b'), ctx), [['<a class="channel" href="/@a?ch=b">@a#b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('\\\n'), ctx), [['\\', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('a#b'), ctx), [['a#b'], '']);
      assert.deepStrictEqual(inspect(parser('0a#b'), ctx), [['0a#b'], '']);
      assert.deepStrictEqual(inspect(parser('あ#b'), ctx), [['あ#b'], '']);
      assert.deepStrictEqual(inspect(parser('あい#b'), ctx), [['あ', 'い#b'], '']);
      assert.deepStrictEqual(inspect(parser('0aあ#b'), ctx), [['0aあ#b'], '']);
      assert.deepStrictEqual(inspect(parser('0aあい#b'), ctx), [['0a', 'あ', 'い#b'], '']);
      assert.deepStrictEqual(inspect(parser('a\n#b'), ctx), [['a', '<br>', '<a class="hashtag" href="/hashtags/b">#b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('a\\\n#b'), ctx), [['a', '\\', '<br>', '<a class="hashtag" href="/hashtags/b">#b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('0a>>b'), ctx), [['0a>>b'], '']);
    });

  });

});
