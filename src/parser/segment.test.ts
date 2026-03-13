import { segment } from './segment';
import { Command } from './context';

describe('Unit: parser/segment', () => {
  describe('segment', () => {
    it('huge input', () => {
      const result = segment(`${'\n'.repeat(1e6 + 1)}`).next().value?.[0].split('\n', 1)[0];
      assert(result?.startsWith(`${Command.Error}Too large input`));
    });

    it('huge segment', () => {
      const result = segment(`${'\n'.repeat(1e5 + 1)}`).next().value?.[0].split('\n', 1)[0];
      assert(result?.startsWith(`${Command.Error}Too large segment`));
    });

    it('basic', () => {
      assert.deepStrictEqual([...segment('')].map(t => t[0]), []);
      assert.deepStrictEqual([...segment('a')].map(t => t[0]), ['a']);
      assert.deepStrictEqual([...segment('a\n')].map(t => t[0]), ['a\n']);
      assert.deepStrictEqual([...segment('a\n\n')].map(t => t[0]), ['a\n', '\n']);
      assert.deepStrictEqual([...segment('a\n\n\n')].map(t => t[0]), ['a\n', '\n\n']);
      assert.deepStrictEqual([...segment('a\nb')].map(t => t[0]), ['a\nb']);
      assert.deepStrictEqual([...segment('a\nb\n')].map(t => t[0]), ['a\nb\n']);
      assert.deepStrictEqual([...segment('a\nb\n\n')].map(t => t[0]), ['a\nb\n', '\n']);
      assert.deepStrictEqual([...segment('a\nb\n\n\n')].map(t => t[0]), ['a\nb\n', '\n\n']);
      assert.deepStrictEqual([...segment('a\nb\n\nc\n\nd')].map(t => t[0]), ['a\nb\n', '\n', 'c\n', '\n', 'd']);
      assert.deepStrictEqual([...segment('a\n\\\nb')].map(t => t[0]), ['a\n\\\nb']);
      assert.deepStrictEqual([...segment('a ')].map(t => t[0]), ['a ']);
      assert.deepStrictEqual([...segment(' a')].map(t => t[0]), [' a']);
      assert.deepStrictEqual([...segment(' a ')].map(t => t[0]), [' a ']);
    });

    it('linebreak', () => {
      assert.deepStrictEqual([...segment('\n')].map(t => t[0]), ['\n']);
      assert.deepStrictEqual([...segment('\n\n')].map(t => t[0]), ['\n\n']);
      assert.deepStrictEqual([...segment('\n\n\n')].map(t => t[0]), ['\n\n\n']);
      assert.deepStrictEqual([...segment('\n\n\n\n')].map(t => t[0]), ['\n\n\n\n']);
      assert.deepStrictEqual([...segment(' ')].map(t => t[0]), [' ']);
      assert.deepStrictEqual([...segment(' \n')].map(t => t[0]), [' \n']);
      assert.deepStrictEqual([...segment(' \n \n \n ')].map(t => t[0]), [' \n \n \n ']);
      assert.deepStrictEqual([...segment('a\n')].map(t => t[0]), ['a\n']);
      assert.deepStrictEqual([...segment('a\n ')].map(t => t[0]), ['a\n', ' ']);
      assert.deepStrictEqual([...segment('a\n\n ')].map(t => t[0]), ['a\n', '\n ']);
      assert.deepStrictEqual([...segment('a\n\n\n ')].map(t => t[0]), ['a\n', '\n\n ']);
      assert.deepStrictEqual([...segment('a\n\n\n\n ')].map(t => t[0]), ['a\n', '\n\n\n ']);
      assert.deepStrictEqual([...segment('a\n\n\n\n\n ')].map(t => t[0]), ['a\n', '\n\n\n\n ']);
      assert.deepStrictEqual([...segment('a\n\n\n\n\n\n ')].map(t => t[0]), ['a\n', '\n\n\n\n\n ']);
    });

    it('codeblock', () => {
      assert.deepStrictEqual([...segment('```')].map(t => t[0]), ['```']);
      assert.deepStrictEqual([...segment('```\n```')].map(t => t[0]), ['```\n```']);
      assert.deepStrictEqual([...segment('```\n\n```')].map(t => t[0]), ['```\n\n```']);
      assert.deepStrictEqual([...segment('```\n\n\n```')].map(t => t[0]), ['```\n', '\n\n', '```']);
      assert.deepStrictEqual([...segment('```\n\n0\n```')].map(t => t[0]), ['```\n', '\n', '0\n```']);
      assert.deepStrictEqual([...segment('```\n0\n\n```')].map(t => t[0]), ['```\n0\n\n```']);
      assert.deepStrictEqual([...segment('```\n````\n```')].map(t => t[0]), ['```\n````\n```']);
      assert.deepStrictEqual([...segment('````\n```\n````')].map(t => t[0]), ['````\n```\n````']);
      assert.deepStrictEqual([...segment('```\n\n```\n\n')].map(t => t[0]), ['```\n\n```\n', '\n']);
    });

    it('mathblock', () => {
      assert.deepStrictEqual([...segment('$$')].map(t => t[0]), ['$$']);
      assert.deepStrictEqual([...segment('$$\n$$')].map(t => t[0]), ['$$\n$$']);
      assert.deepStrictEqual([...segment('$$\n\n$$')].map(t => t[0]), ['$$\n\n$$']);
      assert.deepStrictEqual([...segment('$$\n\n\n$$')].map(t => t[0]), ['$$\n', '\n\n', '$$']);
      assert.deepStrictEqual([...segment('$$\n\n0\n$$')].map(t => t[0]), ['$$\n', '\n', '0\n$$']);
      assert.deepStrictEqual([...segment('$$\n0\n\n$$')].map(t => t[0]), ['$$\n0\n\n$$']);
      assert.deepStrictEqual([...segment('$$\n\n$$\n\n')].map(t => t[0]), ['$$\n\n$$\n', '\n']);
    });

    it('extension', () => {
      assert.deepStrictEqual([...segment('~~~')].map(t => t[0]), ['~~~']);
      assert.deepStrictEqual([...segment('~~~\n~~~')].map(t => t[0]), ['~~~\n~~~']);
      assert.deepStrictEqual([...segment('~~~\n\n~~~')].map(t => t[0]), ['~~~\n\n~~~']);
      assert.deepStrictEqual([...segment('~~~\n\n\n~~~')].map(t => t[0]), ['~~~\n', '\n\n', '~~~']);
      assert.deepStrictEqual([...segment('~~~\n\n0\n~~~')].map(t => t[0]), ['~~~\n', '\n', '0\n~~~']);
      assert.deepStrictEqual([...segment('~~~\n0\n\n~~~')].map(t => t[0]), ['~~~\n0\n\n~~~']);
      assert.deepStrictEqual([...segment('~~~\n~~~~\n~~~')].map(t => t[0]), ['~~~\n~~~~\n~~~']);
      assert.deepStrictEqual([...segment('~~~~\n~~~\n~~~~')].map(t => t[0]), ['~~~~\n~~~\n~~~~']);
      assert.deepStrictEqual([...segment('~~~\n\n~~~\n\n')].map(t => t[0]), ['~~~\n\n~~~\n', '\n']);
      assert.deepStrictEqual([...segment('~~~\n```\n~~~\n```\n~~~')].map(t => t[0]), ['~~~\n```\n~~~\n```\n~~~']);
      assert.deepStrictEqual([...segment('~~~\ninvalid\n~~~')].map(t => t[0]), ['~~~\ninvalid\n~~~']);
      assert.deepStrictEqual([...segment('~~~\ninvalid\n\ncaption\n~~~')].map(t => t[0]), ['~~~\ninvalid\n\ncaption\n~~~']);
      assert.deepStrictEqual([...segment('~~~figure [$-name]\n$$\n$$\n\n```\n~~~')].map(t => t[0]), ['~~~figure [$-name]\n$$\n$$\n\n```\n~~~']);
    });

    it('mixed', () => {
      assert.deepStrictEqual([...segment('```\n\n\n')].map(t => t[0]), ['```\n', '\n\n']);
      assert.deepStrictEqual([...segment('~~~\n\n\n')].map(t => t[0]), ['~~~\n', '\n\n']);
      assert.deepStrictEqual([...segment('```\n~~~\n```')].map(t => t[0]), ['```\n~~~\n```']);
      assert.deepStrictEqual([...segment('~~~\n```\n~~~')].map(t => t[0]), ['~~~\n```\n~~~']);
      assert.deepStrictEqual([...segment('```\n```\n\n~~~\n~~~')].map(t => t[0]), ['```\n```\n', '\n', '~~~\n~~~']);
      assert.deepStrictEqual([...segment('~~~\n~~~\n\n```\n```')].map(t => t[0]), ['~~~\n~~~\n', '\n', '```\n```']);
      assert.deepStrictEqual([...segment(' ```\n\n```')].map(t => t[0]), [' ```\n', '\n', '```']);
      assert.deepStrictEqual([...segment(' ~~~\n\n~~~')].map(t => t[0]), [' ~~~\n', '\n', '~~~']);
    });

    it('blockquote', () => {
      assert.deepStrictEqual([...segment('> ```\n\n```')].map(t => t[0]), ['> ```\n', '\n', '```']);
      assert.deepStrictEqual([...segment('!> ```\n\n```')].map(t => t[0]), ['!> ```\n', '\n', '```']);
    });

    it('heading', () => {
      assert.deepStrictEqual([...segment('# a\n\n# b\n')].map(t => t[0]), ['# a\n', '\n', '# b\n']);
      assert.deepStrictEqual([...segment('# a\n# b\n')].map(t => t[0]), ['# a\n', '# b\n']);
      assert.deepStrictEqual([...segment('# a\n# b')].map(t => t[0]), ['# a\n', '# b']);
      assert.deepStrictEqual([...segment('# a\n # b')].map(t => t[0]), ['# a\n # b']);
    });

  });

});
