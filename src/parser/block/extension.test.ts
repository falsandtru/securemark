import { extension } from './extension';
import { some } from '../../combinator';
import { input } from '../../combinator/data/parser';
import { Context } from '../context';

describe('Unit: parser/block/extension', () => {
  describe('extension', () => {
    const parser = some(extension);

    it('invalid', () => {
      assert(!parser(input('', new Context())));
      assert(!parser(input('\n', new Context())));
      assert(!parser(input('~~~', new Context())));
      assert(!parser(input('~~~\n', new Context())));
      assert(!parser(input('~~~\n\n', new Context())));
      assert(parser(input('~~~\na~~~', new Context())));
      assert(!parser(input('~~~a', new Context())));
      assert(!parser(input('~~~a ~~~\n~~~', new Context())));
      assert(!parser(input('~~~a\n', new Context())));
      assert(!parser(input('~~~a\n\n', new Context())));
      assert(parser(input('~~~a\nb~~~', new Context())));
      assert(!parser(input(' ~~~a\nb~~~', new Context())));
      assert(!parser(input('$-name', new Context())));
      assert(!parser(input('$-name-0', new Context())));
      assert(!parser(input('$group-0', new Context())));
    });

    it('valid', () => {
      assert(parser(input('~~~\n~~~', new Context())));
      assert(parser(input('~~~\na\n~~~', new Context())));
      assert(parser(input('~~~a\n~~~', new Context())));
      assert(parser(input('~~~a\nb\n~~~', new Context())));
      assert(parser(input('$-0', new Context())));
      assert(parser(input('$-0\n', new Context())));
      assert(parser(input('$-0\n\n', new Context())));
    });

  });

});
