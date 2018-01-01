import { parse } from './parse';

describe('Unit: parser/parse', () => {
  describe('parse', () => {
    it('result', () => {
      assert(parse('') instanceof DocumentFragment);
    });

  });

});
