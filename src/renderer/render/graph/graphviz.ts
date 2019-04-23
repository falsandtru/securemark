import { define } from 'typed-dom';

declare const Viz: any;

let viz: any;

export function graphviz(target: HTMLElement): void {
  assert(target.children.length === 0);
  if (typeof Viz === 'undefined') return;
  void requestAnimationFrame(() => {
    viz = new Viz();
    viz.renderSVGElement(target.textContent!, { engine: target.getAttribute('data-engine') || 'dot' })
      .then((el: Element) => {
        void define(target, [el]);
        void target.querySelectorAll<HTMLAnchorElement>('svg a')
          .forEach(el =>
            void el.removeAttribute('href'));
        const svg = target.querySelector('svg')!;
        svg.style.maxHeight = `${Math.round(parseFloat(svg.getAttribute('height')!) * svg.clientWidth / parseFloat(svg.getAttribute('width')!))}pt`;
      })
      .catch((error: unknown) => {
        viz = new Viz();
        console.error(error);
      });
  });
}
