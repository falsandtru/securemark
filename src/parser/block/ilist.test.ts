import { ilist } from './ilist';
import { some } from '../../combinator';
import { input } from '../../combinator/data/parser';
import { Context } from '../context';

describe('Unit: parser/block/ilist', () => {
  describe('ilist', () => {
    const parser = (source: string) => some(ilist)(input(source, ctx));
    const { context: ctx } = input('', new Context());

    it('single', () => {
      assert(!parser('-'));
      assert(!parser('+'));
      assert(!parser('*'));
      assert(!parser(' * '));
      assert(parser('- '));
      assert(parser('+ '));
      assert(parser('* '));
      assert(parser('- \n-'));
      assert(parser('+ \n+'));
      assert(parser('* \n*'));
    });

  });

});
