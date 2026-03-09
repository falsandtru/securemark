import { template } from './template';
import { some } from '../../combinator';
import { input } from '../../combinator/data/parser';
import { Context } from '../context';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/template', () => {
  describe('template', () => {
    const parser = some(template);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('{', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('{}', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('{{', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('{{\\}}', new Context())), [['<span class="invalid">{{\\}</span>'], '}']);
      assert.deepStrictEqual(inspect(parser, input('{{a}b}', new Context())), [['<span class="invalid">{{a</span>'], '}b}']);
      assert.deepStrictEqual(inspect(parser, input('{{{a}}', new Context())), [['<span class="invalid">{{{a}</span>'], '}']);
      assert.deepStrictEqual(inspect(parser, input(' {{}}', new Context())), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser, input('{{}}', new Context())), [['<span class="template">{{}}</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('{{}}}', new Context())), [['<span class="template">{{}}</span>'], '}']);
      assert.deepStrictEqual(inspect(parser, input('{{ }}', new Context())), [['<span class="template">{{ }}</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('{{ a }}', new Context())), [['<span class="template">{{ a }}</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('{{\n}}', new Context())), [['<span class="template">{{<br>}}</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('{{\\\n}}', new Context())), [['<span class="template">{{\\<br>}}</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('{{a}}', new Context())), [['<span class="template">{{a}}</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('{{a b}}', new Context())), [['<span class="template">{{a b}}</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('{{\\}}}', new Context())), [['<span class="template">{{\\}}}</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('{{<a>}}', new Context())), [['<span class="template">{{&lt;a&gt;}}</span>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser, input('{{`a`}}', new Context())), [['<span class="template">{{`a`}}</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('{{{a}}}', new Context())), [['<span class="template">{{{a}}}</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('{{{{a}}}}', new Context())), [['<span class="template">{{{{a}}}}</span>'], '']);
    });

  });

});
