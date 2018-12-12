import { breaklines } from './source';

describe('Unit: parser/api/source', () => {
  describe('breaklines', () => {
    it('basic', () => {
      assert(breaklines('') === '');
      assert(breaklines('a') === 'a');
      assert(breaklines('a\nb') === 'a\\\nb');
      assert(breaklines('a\nb\nc') === 'a\\\nb\\\nc');
      assert(breaklines('a\\\nb') === 'a\\\nb');
      assert(breaklines('a\\\\\nb') === 'a\\\\\\\nb');
      assert(breaklines('#a') === '#a');
      assert(breaklines('#a\nb') === '#a\\\nb');
      assert(breaklines('@0#a') === '@0#a');
      assert(breaklines('@0#a\nb') === '@0#a\\\nb');
      assert(breaklines('<# a #>b\nc') === '<# a #>b\\\nc');
      assert(breaklines('<# a\nb #>c\nd') === '<# a\nb #>c\\\nd');
      assert(breaklines('<# a\nb\nc #>d\ne') === '<# a\nb\nc #>d\\\ne');
      assert(breaklines('>a') === '>a');
      assert(breaklines('>a\nb') === '>a\nb');
      assert(breaklines('a\n\nb\n') === 'a\n\nb\n');
    });

  });

});
