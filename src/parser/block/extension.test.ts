import { extension } from './extension';
import { some } from '../../combinator';

describe('Unit: parser/block/extension', () => {
  describe('extension', () => {
    const parser = (source: string) => some(extension)({ source, context: {} });

    it('invalid', () => {
      assert(!parser(''));
      assert(!parser('\n'));
      assert(!parser('~~~'));
      assert(!parser('~~~\n'));
      assert(!parser('~~~\n\n'));
      assert(parser('~~~\na~~~'));
      assert(parser('~~~\n~~~'));
      assert(parser('~~~\na\n~~~'));
      assert(!parser('~~~a'));
      assert(!parser('~~~a ~~~\n~~~'));
      assert(!parser('~~~a\n'));
      assert(!parser('~~~a\n\n'));
      assert(parser('~~~a\nb~~~'));
      assert(!parser(' ~~~a\n~~~'));
      assert(!parser('$-name'));
      assert(!parser('$-name-0'));
      assert(!parser('$group-0'));
    });

    it('valid', () => {
      assert(parser('~~~a\n~~~'));
      assert(parser('~~~a\nb\n~~~'));
      assert(parser('$-0'));
      assert(parser('$-0\n'));
      assert(parser('$-0\n\n'));
    });

  });

});
