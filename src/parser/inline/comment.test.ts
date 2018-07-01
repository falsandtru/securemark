import { comment } from './comment';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/comment', () => {
  describe('comment', () => {
    const parser = some(comment);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('<')), undefined);
      assert.deepStrictEqual(inspect(parser('<#')), undefined);
      assert.deepStrictEqual(inspect(parser('<##>')), undefined);
      assert.deepStrictEqual(inspect(parser('<#a#>')), undefined);
      assert.deepStrictEqual(inspect(parser('<#a b#>')), undefined);
      assert.deepStrictEqual(inspect(parser('<#\\ a #>')), undefined);
      assert.deepStrictEqual(inspect(parser('<# a ##>')), undefined);
      assert.deepStrictEqual(inspect(parser('<## a #>')), undefined);
      assert.deepStrictEqual(inspect(parser('<!- ->')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('<# #>')), [[], '']);
      assert.deepStrictEqual(inspect(parser('<# a #>')), [[], '']);
      assert.deepStrictEqual(inspect(parser('<# a b #>')), [[], '']);
      assert.deepStrictEqual(inspect(parser('<# a\nb #>')), [[], '']);
      assert.deepStrictEqual(inspect(parser('<# a\\ #>')), [[], '']);
      assert.deepStrictEqual(inspect(parser('<# <# #>')), [[], '']);
      assert.deepStrictEqual(inspect(parser('<## a ##>')), [[], '']);
      assert.deepStrictEqual(inspect(parser('<# #>a')), [[], 'a']);
      assert.deepStrictEqual(inspect(parser('<# a #>b')), [[], 'b']);
      assert.deepStrictEqual(inspect(parser('<!-- -->')), [[], '']);
      assert.deepStrictEqual(inspect(parser('<!--- --->')), [[], '']);
    });

  });

});
