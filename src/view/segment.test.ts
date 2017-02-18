import { segment } from './segment';

describe('Unit: binder/segment', () => {
  describe('segment', () => {
    it('empty', () => {
      assert.deepStrictEqual(segment(''), ['']);
    });

    it('ab', () => {
      assert.deepStrictEqual(segment('\n'), ['\n']);
      assert.deepStrictEqual(segment('\n\n'), ['\n\n']);
      assert.deepStrictEqual(segment('\n\n\n'), ['\n\n\n']);
      assert.deepStrictEqual(segment('\n\n\n\n'), ['\n\n\n\n']);
      assert.deepStrictEqual(segment(' '), [' ']);
      assert.deepStrictEqual(segment(' \n'), [' \n']);
      assert.deepStrictEqual(segment('a'), ['a']);
      assert.deepStrictEqual(segment('a\n'), ['a\n']);
      assert.deepStrictEqual(segment('a\nb'), ['a\nb']);
      assert.deepStrictEqual(segment('a\nb\n'), ['a\nb\n']);
      assert.deepStrictEqual(segment('a\nb\n\n'), ['a\nb\n\n']);
      assert.deepStrictEqual(segment('a\nb\n\n\n'), ['a\nb\n\n', '\n']);
      assert.deepStrictEqual(segment('a\nb\n\nc\n\nd'), ['a\nb\n\n', 'c\n\n', 'd']);
    });

    it('pre', () => {
      assert.deepStrictEqual(segment('```'), ['```']);
      assert.deepStrictEqual(segment('```\n```'), ['```\n```']);
      assert.deepStrictEqual(segment('```\n\n\n```'), ['```\n\n\n```']);
      assert.deepStrictEqual(segment('````\n```\n````'), ['````\n```\n````']);
      assert.deepStrictEqual(segment('a\n\n\n```\n\n\n```'), ['a\n\n', '\n', '```\n\n\n```']);
      assert.deepStrictEqual(segment('a\n\n\n\n```\n\n\n```'), ['a\n\n', '\n\n', '```\n\n\n```']);
    });

  });

});
