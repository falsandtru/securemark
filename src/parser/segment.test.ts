import { segment } from './segment';
import { Command } from './context';

describe('Unit: parser/segment', () => {
  describe('segment', () => {
    it('huge input', () => {
      const result = segment(`${'\n'.repeat(10 * 1000 ** 2)}`).next().value?.split('\n', 1)[0];
      assert(result?.startsWith(`${Command.Error}Too large input`));
    });

    it('huge segment', () => {
      const result = segment(`${'\n'.repeat(1000 ** 2 - 1)}`).next().value?.split('\n', 1)[0];
      assert(result?.startsWith(`${Command.Error}Too large segment`));
    });

    it('basic', () => {
      assert.deepStrictEqual([...segment('')], []);
      assert.deepStrictEqual([...segment('a')], ['a']);
      assert.deepStrictEqual([...segment('a\n')], ['a\n']);
      assert.deepStrictEqual([...segment('a\n\n')], ['a\n', '\n']);
      assert.deepStrictEqual([...segment('a\n\n\n')], ['a\n', '\n\n']);
      assert.deepStrictEqual([...segment('a\nb')], ['a\nb']);
      assert.deepStrictEqual([...segment('a\nb\n')], ['a\nb\n']);
      assert.deepStrictEqual([...segment('a\nb\n\n')], ['a\nb\n', '\n']);
      assert.deepStrictEqual([...segment('a\nb\n\n\n')], ['a\nb\n', '\n\n']);
      assert.deepStrictEqual([...segment('a\nb\n\nc\n\nd')], ['a\nb\n', '\n', 'c\n', '\n', 'd']);
      assert.deepStrictEqual([...segment('a\n\\\nb')], ['a\n\\\nb']);
      assert.deepStrictEqual([...segment('a ')], ['a ']);
      assert.deepStrictEqual([...segment(' a')], [' a']);
      assert.deepStrictEqual([...segment(' a ')], [' a ']);
    });

    it('linebreak', () => {
      assert.deepStrictEqual([...segment('\n')], ['\n']);
      assert.deepStrictEqual([...segment('\n\n')], ['\n\n']);
      assert.deepStrictEqual([...segment('\n\n\n')], ['\n\n\n']);
      assert.deepStrictEqual([...segment('\n\n\n\n')], ['\n\n\n\n']);
      assert.deepStrictEqual([...segment(' ')], [' ']);
      assert.deepStrictEqual([...segment(' \n')], [' \n']);
      assert.deepStrictEqual([...segment(' \n \n \n ')], [' \n \n \n ']);
      assert.deepStrictEqual([...segment('a\n')], ['a\n']);
      assert.deepStrictEqual([...segment('a\n ')], ['a\n', ' ']);
      assert.deepStrictEqual([...segment('a\n\n ')], ['a\n', '\n ']);
      assert.deepStrictEqual([...segment('a\n\n\n ')], ['a\n', '\n\n ']);
      assert.deepStrictEqual([...segment('a\n\n\n\n ')], ['a\n', '\n\n\n ']);
      assert.deepStrictEqual([...segment('a\n\n\n\n\n ')], ['a\n', '\n\n\n\n ']);
      assert.deepStrictEqual([...segment('a\n\n\n\n\n\n ')], ['a\n', '\n\n\n\n\n ']);
    });

    it('codeblock', () => {
      assert.deepStrictEqual([...segment('```')], ['```']);
      assert.deepStrictEqual([...segment('```\n```')], ['```\n```']);
      assert.deepStrictEqual([...segment('```\n\n```')], ['```\n\n```']);
      assert.deepStrictEqual([...segment('```\n\n\n```')], ['```\n', '\n\n', '```']);
      assert.deepStrictEqual([...segment('```\n\n0\n```')], ['```\n', '\n', '0\n```']);
      assert.deepStrictEqual([...segment('```\n0\n\n```')], ['```\n0\n\n```']);
      assert.deepStrictEqual([...segment('```\n````\n```')], ['```\n````\n```']);
      assert.deepStrictEqual([...segment('````\n```\n````')], ['````\n```\n````']);
      assert.deepStrictEqual([...segment('```\n\n```\n\n')], ['```\n\n```\n', '\n']);
    });

    it('mathblock', () => {
      assert.deepStrictEqual([...segment('$$')], ['$$']);
      assert.deepStrictEqual([...segment('$$\n$$')], ['$$\n$$']);
      assert.deepStrictEqual([...segment('$$\n\n$$')], ['$$\n\n$$']);
      assert.deepStrictEqual([...segment('$$\n\n\n$$')], ['$$\n', '\n\n', '$$']);
      assert.deepStrictEqual([...segment('$$\n\n0\n$$')], ['$$\n', '\n', '0\n$$']);
      assert.deepStrictEqual([...segment('$$\n0\n\n$$')], ['$$\n0\n\n$$']);
      assert.deepStrictEqual([...segment('$$\n\n$$\n\n')], ['$$\n\n$$\n', '\n']);
    });

    it('extension', () => {
      assert.deepStrictEqual([...segment('~~~')], ['~~~']);
      assert.deepStrictEqual([...segment('~~~\n~~~')], ['~~~\n~~~']);
      assert.deepStrictEqual([...segment('~~~\n\n~~~')], ['~~~\n\n~~~']);
      assert.deepStrictEqual([...segment('~~~\n\n\n~~~')], ['~~~\n', '\n\n', '~~~']);
      assert.deepStrictEqual([...segment('~~~\n\n0\n~~~')], ['~~~\n', '\n', '0\n~~~']);
      assert.deepStrictEqual([...segment('~~~\n0\n\n~~~')], ['~~~\n0\n\n~~~']);
      assert.deepStrictEqual([...segment('~~~\n~~~~\n~~~')], ['~~~\n~~~~\n~~~']);
      assert.deepStrictEqual([...segment('~~~~\n~~~\n~~~~')], ['~~~~\n~~~\n~~~~']);
      assert.deepStrictEqual([...segment('~~~\n\n~~~\n\n')], ['~~~\n\n~~~\n', '\n']);
      assert.deepStrictEqual([...segment('~~~\n```\n~~~\n```\n~~~')], ['~~~\n```\n~~~\n```\n~~~']);
      assert.deepStrictEqual([...segment('~~~\ninvalid\n~~~')], ['~~~\ninvalid\n~~~']);
      assert.deepStrictEqual([...segment('~~~\ninvalid\n\ncaption\n~~~')], ['~~~\ninvalid\n\ncaption\n~~~']);
      assert.deepStrictEqual([...segment('~~~figure [$-name]\n$$\n$$\n\n```\n~~~')], ['~~~figure [$-name]\n$$\n$$\n\n```\n~~~']);
    });

    it('mixed', () => {
      assert.deepStrictEqual([...segment('```\n\n\n')], ['```\n', '\n\n']);
      assert.deepStrictEqual([...segment('~~~\n\n\n')], ['~~~\n', '\n\n']);
      assert.deepStrictEqual([...segment('```\n~~~\n```')], ['```\n~~~\n```']);
      assert.deepStrictEqual([...segment('~~~\n```\n~~~')], ['~~~\n```\n~~~']);
      assert.deepStrictEqual([...segment('```\n```\n\n~~~\n~~~')], ['```\n```\n', '\n', '~~~\n~~~']);
      assert.deepStrictEqual([...segment('~~~\n~~~\n\n```\n```')], ['~~~\n~~~\n', '\n', '```\n```']);
      assert.deepStrictEqual([...segment(' ```\n\n```')], [' ```\n', '\n', '```']);
      assert.deepStrictEqual([...segment(' ~~~\n\n~~~')], [' ~~~\n', '\n', '~~~']);
    });

    it('blockquote', () => {
      assert.deepStrictEqual([...segment('> ```\n\n```')], ['> ```\n', '\n', '```']);
      assert.deepStrictEqual([...segment('!> ```\n\n```')], ['!> ```\n', '\n', '```']);
    });

    it('heading', () => {
      assert.deepStrictEqual([...segment('# a\n\n# b\n')], ['# a\n', '\n', '# b\n']);
      assert.deepStrictEqual([...segment('# a\n# b\n')], ['# a\n', '# b\n']);
      assert.deepStrictEqual([...segment('# a\n# b')], ['# a\n', '# b']);
      assert.deepStrictEqual([...segment('# a\n # b')], ['# a\n # b']);
    });

  });

});
