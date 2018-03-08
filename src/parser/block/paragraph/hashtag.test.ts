import { hashtag } from './hashtag';
import { some } from '../../../combinator';
import { inspect } from '../../../debug.test';

describe('Unit: parser/block/paragraph/hashtag', () => {
  describe('hashtag', () => {
    const parser = some(hashtag);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('#')), undefined);
      assert.deepStrictEqual(inspect(parser('# ')), undefined);
      assert.deepStrictEqual(inspect(parser(' #b')), undefined);
      assert.deepStrictEqual(inspect(parser('a#b')), undefined);
      assert.deepStrictEqual(inspect(parser('a##b')), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('#0')), [['<a class="hashtag" rel="noopener">#0</a>'], '']);
      assert.deepStrictEqual(inspect(parser('#a')), [['<a class="hashtag" rel="noopener">#a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('#A')), [['<a class="hashtag" rel="noopener">#A</a>'], '']);
      assert.deepStrictEqual(inspect(parser('#a ')), [['<a class="hashtag" rel="noopener">#a</a>'], ' ']);
      assert.deepStrictEqual(inspect(parser('#a\n')), [['<a class="hashtag" rel="noopener">#a</a>'], '\n']);
      assert.deepStrictEqual(inspect(parser('#\\')), [['<a class="hashtag" rel="noopener">#\\</a>'], '']);
      assert.deepStrictEqual(inspect(parser('#\\ ')), [['<a class="hashtag" rel="noopener">#\\</a>'], ' ']);
      assert.deepStrictEqual(inspect(parser('#\\\n')), [['<a class="hashtag" rel="noopener">#\\</a>'], '\n']);
    });

  });

});
