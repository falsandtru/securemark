import { template } from './template';
import { some } from '../../combinator';
import { input } from '../context';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/template', () => {
  describe('template', () => {
    const parser = some(template);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('')), undefined);
      assert.deepStrictEqual(inspect(parser, input('{')), undefined);
      assert.deepStrictEqual(inspect(parser, input('{}')), undefined);
      assert.deepStrictEqual(inspect(parser, input('{{')), undefined);
      assert.deepStrictEqual(inspect(parser, input('{{\\}}')), [['<span class="invalid">{{\\}</span>'], '}']);
      assert.deepStrictEqual(inspect(parser, input('{{a}b}')), [['<span class="invalid">{{a</span>'], '}b}']);
      assert.deepStrictEqual(inspect(parser, input('{{{a}}')), [['<span class="invalid">{{{a}</span>'], '}']);
      assert.deepStrictEqual(inspect(parser, input(' {{}}')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser, input('{{}}')), [['<span class="template">{{}}</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('{{}}}')), [['<span class="template">{{}}</span>'], '}']);
      assert.deepStrictEqual(inspect(parser, input('{{ }}')), [['<span class="template">{{ }}</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('{{ a }}')), [['<span class="template">{{ a }}</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('{{\n}}')), [['<span class="template">{{<br>}}</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('{{\\\n}}')), [['<span class="template">{{\\<br>}}</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('{{a}}')), [['<span class="template">{{a}}</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('{{a b}}')), [['<span class="template">{{a b}}</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('{{\\}}}')), [['<span class="template">{{\\}}}</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('{{<a>}}')), [['<span class="template">{{&lt;a&gt;}}</span>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser, input('{{`a`}}')), [['<span class="template">{{`a`}}</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('{{{a}}}')), [['<span class="template">{{{a}}}</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('{{{{a}}}}')), [['<span class="template">{{{{a}}}}</span>'], '']);
    });

  });

});
