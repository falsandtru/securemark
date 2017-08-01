import DOM from 'typed-dom';

export function youtube(url: string): HTMLElement | void {
  const query = void 0
    || url.startsWith('https://youtu.be/') && url.split('//youtu.be/', 2).pop()
    || url.startsWith('https://www.youtube.com/watch?v=') && url.split('=', 2).pop()!.replace(/&/, '?')
    || '';
  if (!query) return;
  return DOM.div({
    class: 'media',
    style: 'position: relative;',
  }, [
    DOM.div({
      style: 'position: relative; padding-top: 56.25%;',
    }, [
      DOM.iframe({
        src: `https://www.youtube.com/embed/${query}`,
        sandbox: 'allow-scripts allow-same-origin allow-presentation',
        allowfullscreen: '',
        frameborder: '0',
        style: 'position: absolute; top: 0; right: 0; width: 100%; height: 100%;',
      }, []),
    ]),
  ]).element;
}
