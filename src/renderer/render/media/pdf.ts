import { parse, escape } from '../../../parser';
import DOM, { html } from 'typed-dom';

export function pdf(url: URL): HTMLElement | undefined {
  if (!['.pdf'].includes(url.pathname.split(/(?=\.)/).pop()!)) return;
  return DOM.div({
    style: 'position: relative;',
  }, [
    DOM.div({
      style: 'position: relative; resize: vertical; overflow: hidden; padding-bottom: 10px;',
    }, [
      DOM.object({
        type: 'application/pdf',
        data: url.href,
        style: 'width: 100%; height: 100%; min-height: 400px;',
      }, () => {
        const el = html('object');
        el.typeMustMatch = true;
        return el;
      }),
    ]),
    DOM.div([
      DOM.strong({
        style: 'word-wrap: break-word;',
      }, () =>
        parse(`**${escape(url.href)}**`).querySelector('strong')!),
    ]),
  ]).element;
}
