import { RenderingOptions } from '../../..';
import { sequence } from './graph/sequence';
import { flowchart } from './graph/flowchart';
import { graphviz } from './graph/graphviz';

export function graph(target: HTMLElement, opts: NonNullable<RenderingOptions['graph']>): undefined {
  opts = { sequence, flowchart, graphviz, ...opts };
  try {
    switch (true) {
      case !!opts.sequence
        && target.matches('.sequence')
        && target.children.length === 0:
        return void opts.sequence!(target);
      case !!opts.flowchart
        && target.matches('.flowchart')
        && target.children.length === 0:
        return void opts.flowchart!(target);
      case !!opts.graphviz
        && target.matches('.graphviz')
        && target.children.length === 0:
        return void opts.graphviz!(target);
      default:
        return;
    }
  }
  catch (reason) {
    console.error(reason);
  }
}
