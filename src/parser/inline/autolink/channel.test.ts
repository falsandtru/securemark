import { autolink } from '../autolink';
import { some } from '../../../combinator';
import { input } from '../../../combinator/data/parser';
import { Context } from '../../context';
import { inspect } from '../../../debug.test';

describe('Unit: parser/inline/autolink/channel', () => {
  describe('channel', () => {
    const parser = some(autolink);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('@a@', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('@a@b', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('@a#', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('@a#1', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('@a#b@', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('@a#1@b', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input(' @a#b', new Context())), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser, input('@a#b', new Context())), [['<a class="channel" href="/@a?ch=b">@a#b</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('@a#b#', new Context())), [['<a class="channel" href="/@a?ch=b">@a#b</a>'], '#']);
      assert.deepStrictEqual(inspect(parser, input('@a#b#1', new Context())), [['<a class="channel" href="/@a?ch=b">@a#b</a>'], '#1']);
      assert.deepStrictEqual(inspect(parser, input('@a#b#c', new Context())), [['<a class="channel" href="/@a?ch=b+c">@a#b#c</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('@domain/a#b', new Context())), [['<a class="channel" href="https://domain/@a?ch=b" target="_blank">@domain/a#b</a>'], '']);
    });

  });

});
