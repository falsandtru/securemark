﻿import { breaklines } from './source';

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
      assert(breaklines('*\na\n*') === '*\\\na\\\n*');
      assert(breaklines('<small>\na\n</small>') === '<small>\na\n</small>');
      assert(breaklines('<# a #>b\nc') === '<# a #>b\\\nc');
      assert(breaklines('<# a\nb #>c\nd') === '<# a\nb #>c\\\nd');
      assert(breaklines('<# a\nb\nc #>d\ne') === '<# a\nb\nc #>d\\\ne');
      assert(breaklines('((a\nb))c') === '((a\nb))c');
      assert(breaklines('>a') === '>a');
      assert(breaklines('>a\nb') === '>a\nb');
      assert(breaklines('>a\n> b') === '>a\n> b');
      assert(breaklines('>a\n>b\nc\nd') === '>a\n>b\nc\\\nd');
      assert(breaklines('>a\n> b\nc\nd') === '>a\n> b\nc\\\nd');
      assert(breaklines('>a\n> b\n> c\nd\ne') === '>a\n> b\n> c\nd\\\ne');
      assert(breaklines('a\n\nb\n') === 'a\n\nb\n');
    });

  });

});
