import { japanese } from './ja';

describe('Unit: parser/locale/ja', () => {
  describe('japanese', () => {
    it('ja', () => {
      assert(japanese('、'));
      assert(japanese('。'));
      assert(japanese('！'));
      assert(japanese('？'));
    });

  });

});
