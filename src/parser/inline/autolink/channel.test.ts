import { autolink } from '../autolink';
import { some } from '../../../combinator';
import { input } from '../../context';
import { inspect } from '../../../debug.test';

describe('Unit: parser/inline/autolink/channel', () => {
  describe('channel', () => {
    const parser = some(autolink);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('')), undefined);
      assert.deepStrictEqual(inspect(parser, input('@a@')), undefined);
      assert.deepStrictEqual(inspect(parser, input('@a@b')), undefined);
      assert.deepStrictEqual(inspect(parser, input('@a#')), undefined);
      assert.deepStrictEqual(inspect(parser, input('@a#1')), undefined);
      assert.deepStrictEqual(inspect(parser, input('@a#b@')), undefined);
      assert.deepStrictEqual(inspect(parser, input('@a#1@b')), undefined);
      assert.deepStrictEqual(inspect(parser, input(' @a#b')), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser, input('@a#b')), [['<a class="channel" href="/@a?ch=b">@a#b</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('@a#b#')), [['<a class="channel" href="/@a?ch=b">@a#b</a>'], '#']);
      assert.deepStrictEqual(inspect(parser, input('@a#b#1')), [['<a class="channel" href="/@a?ch=b">@a#b</a>'], '#1']);
      assert.deepStrictEqual(inspect(parser, input('@a#b#c')), [['<a class="channel" href="/@a?ch=b+c">@a#b#c</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('@domain/a#b')), [['<a class="channel" href="https://domain/@a?ch=b" target="_blank">@domain/a#b</a>'], '']);
    });

  });

});
