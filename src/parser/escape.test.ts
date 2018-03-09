import { escape } from './escape';
import { parse } from './parse';

describe('Unit: parser/escape', () => {
  describe('escape', () => {
    it('ab', () => {
      assert(escape('*a\\\nb*') === '\\*a\\\nb\\*');
    });

    it('autolink', () => {
      assert(parse(escape('https://a')).firstElementChild!.innerHTML === '<a href="https://a" rel="noopener" target="_blank">https://a</a>');
      assert(parse(escape('https://[::]')).firstElementChild!.innerHTML === '<a href="https://[::]" rel="noopener" target="_blank">https://[::]</a>');
      assert(parse(escape('!https://a')).firstElementChild!.innerHTML === '<a href="https://a" rel="noopener" target="_blank"><img class="media" data-src="https://a" alt=""></a>');
      assert(parse(escape('@a')).firstElementChild!.innerHTML === '<a class="account" rel="noopener">@a</a>');
      assert(parse(escape('#a')).firstElementChild!.innerHTML === '<a class="hashtag" rel="noopener">#a</a>');
    });

  });

});
