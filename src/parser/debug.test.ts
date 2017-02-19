import { Result } from '../parser';

export function inspect(r: Result<HTMLElement | Text, any>): [string[], string] | undefined {
  return r
    ? [r[0].map(n => {
        const el = document.createElement('div');
        void el.appendChild(n);
        //assert(el.innerHTML === (el.innerHTML = el.innerHTML, el.innerHTML));
        return el.innerHTML;
      }), r[1]]
    : r;
}
