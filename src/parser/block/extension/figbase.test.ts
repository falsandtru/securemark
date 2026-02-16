import { figbase } from './figbase';
import { some } from '../../../combinator';
import { input } from '../../../combinator/data/parser';
import { inspect } from '../../../debug.test';

describe('Unit: parser/block/extension/figbase', () => {
  describe('figbase', () => {
    const parser = (source: string) => some(figbase)(input(source, {}));

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('\n$-0')), undefined);
      assert.deepStrictEqual(inspect(parser('$-0.')), undefined);
      assert.deepStrictEqual(inspect(parser('$-0.1')), undefined);
      assert.deepStrictEqual(inspect(parser('$-1')), undefined);
      assert.deepStrictEqual(inspect(parser('$-0\n 0')), undefined);
      assert.deepStrictEqual(inspect(parser('$-name')), undefined);
      assert.deepStrictEqual(inspect(parser('$-name-0')), undefined);
      assert.deepStrictEqual(inspect(parser('$group-0')), undefined);
      assert.deepStrictEqual(inspect(parser(' [$-0]')), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('$-0')), [['<figure data-label="$-0" data-group="$" hidden=""></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('$-0.0')), [['<figure data-label="$-0.0" data-group="$" hidden=""></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('$-1.0')), [['<figure data-label="$-1.0" data-group="$" hidden=""></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('$-0\n \n')), [['<figure data-label="$-0" data-group="$" hidden=""></figure>'], ' \n']);
      assert.deepStrictEqual(inspect(parser('[$-0]')), [['<figure data-label="$-0" data-group="$" hidden=""></figure>'], '']);
    });

  });

});
