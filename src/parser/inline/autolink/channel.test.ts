import { autolink } from '../autolink';
import { some } from '../../../combinator';
import { input } from '../../../combinator/data/parser';
import { inspect } from '../../../debug.test';

describe('Unit: parser/inline/autolink/channel', () => {
  describe('channel', () => {
    const parser = (source: string) => some(autolink)(input(source, ctx));
    const { context: ctx } = input('', {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser(''), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('@a@'), ctx), [['@a'], '@']);
      assert.deepStrictEqual(inspect(parser('@a@b'), ctx), [['@a'], '@b']);
      assert.deepStrictEqual(inspect(parser('@a#'), ctx), [['@a'], '#']);
      assert.deepStrictEqual(inspect(parser('@a#1'), ctx), [['@a'], '#1']);
      assert.deepStrictEqual(inspect(parser('@a#b@'), ctx), [['@a'], '#b@']);
      assert.deepStrictEqual(inspect(parser('@a#1@b'), ctx), [['@a'], '#1@b']);
      assert.deepStrictEqual(inspect(parser(' @a#b'), ctx), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('@a#b'), ctx), [['<a class="channel" href="/@a?ch=b">@a#b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('@a#b#'), ctx), [['<a class="channel" href="/@a?ch=b">@a#b</a>'], '#']);
      assert.deepStrictEqual(inspect(parser('@a#b#1'), ctx), [['<a class="channel" href="/@a?ch=b">@a#b</a>'], '#1']);
      assert.deepStrictEqual(inspect(parser('@a#b#c'), ctx), [['<a class="channel" href="/@a?ch=b+c">@a#b#c</a>'], '']);
      assert.deepStrictEqual(inspect(parser('@domain/a#b'), ctx), [['<a class="channel" href="https://domain/@a?ch=b" target="_blank">@domain/a#b</a>'], '']);
    });

  });

});
