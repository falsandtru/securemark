import { figbase } from './figbase';
import { some } from '../../../combinator';
import { input } from '../../../combinator/data/parser';
import { Context } from '../../context';
import { inspect } from '../../../debug.test';

describe('Unit: parser/block/extension/figbase', () => {
  describe('figbase', () => {
    const parser = some(figbase);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('\n$-0', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('$-0.', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('$-0.1', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('$-1', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('$-0\n 0', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('$-name', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('$-name-0', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('$group-0', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input(' [$-0]', new Context())), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser, input('$-0', new Context())), [['<figure data-label="$-0" data-group="$" hidden=""></figure>'], '']);
      assert.deepStrictEqual(inspect(parser, input('$-0.0', new Context())), [['<figure data-label="$-0.0" data-group="$" hidden=""></figure>'], '']);
      assert.deepStrictEqual(inspect(parser, input('$-1.0', new Context())), [['<figure data-label="$-1.0" data-group="$" hidden=""></figure>'], '']);
      assert.deepStrictEqual(inspect(parser, input('$-0\n \n', new Context())), [['<figure data-label="$-0" data-group="$" hidden=""></figure>'], ' \n']);
      assert.deepStrictEqual(inspect(parser, input('[$-0]', new Context())), [['<figure data-label="$-0" data-group="$" hidden=""></figure>'], '']);
    });

  });

});
