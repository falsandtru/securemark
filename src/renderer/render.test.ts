import { render as render_ } from './render';
import { RenderingOptions } from '../../';
import { parse } from '../parser/api/parse';

function render(target: HTMLElement, opts: RenderingOptions = {}): HTMLElement {
  render_(target, opts);
  return target;
}

describe('Unit: renderer/render', () => {
  describe('render', () => {
    it('code', () => {
      assert(render(parse('`${E = mc^2}$`').querySelector('p')!).querySelector('code'));
      assert(render(parse('```\n${E = mc^2}$\n```').querySelector('pre')!).matches('pre'));
    });

    it('math', async () => {
      // @ts-ignore
      MathJax.typesetPromise || await MathJax.startup.promise;
      //assert(render(parse('${E = mc^2}$').querySelector('p')!).querySelector('span.math')!.firstElementChild);
      assert(render(parse('$$\nE = mc^2\n$$').querySelector('div')!).firstElementChild);
    });

    it('media', () => {
      // image
      assert(render(parse('!https://pbs.twimg.com/media/C-RAIleV0AAO81x.jpg').querySelector('div')!).querySelector('img')!.matches('div > a > img'));
      assert(render(parse('[!{https://pbs.twimg.com/media/C-RAIleV0AAO81x.jpg}]{#}').querySelector('div')!).querySelector('img')!.matches('div > a > img'));
      // other
      assert(render(parse('!http://www.adobe.com/content/dam/Adobe/en/devnet/acrobat/pdfs/pdf_open_parameters.pdf').querySelector('div')!).querySelector('.media')!.matches('div > .media'));
      assert(render(parse('[!{http://www.adobe.com/content/dam/Adobe/en/devnet/acrobat/pdfs/pdf_open_parameters.pdf}]{#}').querySelector('div')!).querySelector('.media')!.matches('div > .media'));
      // all
      assert(render(parse([
        '!https://youtu.be/xRF7WIZV4lA',
        '!http://www.adobe.com/content/dam/Adobe/en/devnet/acrobat/pdfs/pdf_open_parameters.pdf',
        '!https://twitter.com/hourenso_u/status/856828123882676225?hide_thread=true',
        '!https://pbs.twimg.com/media/C-RAIleV0AAO81x.jpg',
      ].join('\n')).querySelector('div')!).querySelectorAll('.media').length === 4);
    });

  });

});
