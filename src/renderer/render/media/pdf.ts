import DOM from 'typed-dom';
import { parse } from '../../parser';

export function pdf(url: string): HTMLElement {
  return DOM.div({
    class: 'media',
    style: 'position: relative;',
  }, [
    DOM.div({
      style: 'position: relative; resize: vertical; overflow: hidden; padding-bottom: 10px;',
    }, [
      DOM.object({
        type: 'application/pdf',
        data: url,
        style: 'width: 100%; height: 100%; min-height: 400px;',
      }, () => {
        const el = document.createElement('object');
        el.typeMustMatch = true;
        return el;
      }),
    ]),
    DOM.div([
      DOM.strong({
        style: 'word-wrap: break-word;',
      }, () =>
        parse(`**${url}**`).querySelector('strong')!),
    ]),
  ]).element;
}
