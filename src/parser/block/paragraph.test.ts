import { paragraph } from './paragraph';
import { loop } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/paragraph', () => {
  describe('paragraph', () => {
    const parser = loop(paragraph);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('\n')), undefined);
    });

    it('ab', () => {
      assert.deepStrictEqual(inspect(parser('a')), [['<p>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser('ab')), [['<p>ab</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a ')), [['<p>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a \n')), [['<p>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\n')), [['<p>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\nb')), [['<p>a b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\n\n')), [['<p>a</p>'], '\n']);
      assert.deepStrictEqual(inspect(parser(' a')), [['<p>a</p>'], '']);
    });

    it('break', () => {
      assert.deepStrictEqual(inspect(parser('a\\\n')), [['<p>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\\\nb')), [['<p>a<br>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\n\nb')), [['<p>a</p>'], '\nb']);
      assert.deepStrictEqual(inspect(parser('a\n\\\nb')), [['<p>a b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('\\\na\n')), [['<p>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser('\\\na\\\n')), [['<p>a</p>'], '']);
    });

    it('hashtag', () => {
      assert.deepStrictEqual(inspect(parser('#a')), [['<p><a class="hashtag" rel="noopener">#a</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser('#a\nb\n#c')), [['<p><a class="hashtag" rel="noopener">#a</a> b <a class="hashtag" rel="noopener">#c</a></p>'], '']);
    });

  });

});
