import { hashtag } from './hashtag';
import { some } from '../../../combinator';
import { inspect } from '../../../debug.test';

describe('Unit: parser/inblock/autolink/hashtag', () => {
  describe('hashtag', () => {
    const parser = some(hashtag);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('#')), undefined);
      assert.deepStrictEqual(inspect(parser('# ')), undefined);
      assert.deepStrictEqual(inspect(parser('##')), undefined);
      assert.deepStrictEqual(inspect(parser('##a')), undefined);
      assert.deepStrictEqual(inspect(parser('a#b')), undefined);
      assert.deepStrictEqual(inspect(parser('a##b')), undefined);
      assert.deepStrictEqual(inspect(parser(' #a')), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('#0')), [['<a class="hashtag" rel="noopener">#0</a>'], '']);
      assert.deepStrictEqual(inspect(parser('#a')), [['<a class="hashtag" rel="noopener">#a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('#a#')), [['<a class="hashtag" rel="noopener">#a</a>'], '#']);
      assert.deepStrictEqual(inspect(parser('#a ')), [['<a class="hashtag" rel="noopener">#a</a>'], ' ']);
      assert.deepStrictEqual(inspect(parser('#a\n')), [['<a class="hashtag" rel="noopener">#a</a>'], '\n']);
      assert.deepStrictEqual(inspect(parser('#\\')), [['<a class="hashtag" rel="noopener">#\\</a>'], '']);
      assert.deepStrictEqual(inspect(parser('#\\ ')), [['<a class="hashtag" rel="noopener">#\\</a>'], ' ']);
      assert.deepStrictEqual(inspect(parser('#\\\n')), [['<a class="hashtag" rel="noopener">#\\</a>'], '\n']);
    });

  });

});
