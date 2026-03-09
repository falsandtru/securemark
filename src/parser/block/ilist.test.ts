import { ilist } from './ilist';
import { some } from '../../combinator';
import { input } from '../../combinator/data/parser';
import { Context } from '../context';

describe('Unit: parser/block/ilist', () => {
  describe('ilist', () => {
    const parser = some(ilist);

    it('single', () => {
      assert(!parser(input('-', new Context())));
      assert(!parser(input('+', new Context())));
      assert(!parser(input('*', new Context())));
      assert(parser(input('- ', new Context())));
      assert(parser(input('+ ', new Context())));
      assert(parser(input('* ', new Context())));
    });

  });

});
