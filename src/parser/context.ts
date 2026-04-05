import { Input as Ipt, input as ipt } from '../combinator/parser';
import { Dict } from 'spica/dict';

export function input(source: string, input: Input = new Input()): Input {
  return ipt(source, input);
}

export class Input<M extends object = object> extends Ipt<M> {
  constructor(
    options: Partial<Input> = {},
    source?: string,
  ) {
    super(options);
    const {
      segment,
      header,
      local,
      whitespace,
      host,
      url,
      id,
      notes,
      caches,
      test,
    } = options;
    this.source = source ?? options.source ?? '';
    this.resources ??= {
      clock: -1,
      interval: 200,
      recursions: [
        // DOMの垂直的追加の繰り返しが加速的に異常に重くなる。
        // ブラウザの問題でありアルゴリズムの計算量は問題ない。
        10 || Recursion.document,
        100 || Recursion.block,
        100 || Recursion.inline,
        100 || Recursion.bracket,
      ],
    };
    this.segment = segment ?? Segment.unknown;
    this.header = header ?? true;
    this.local = local ?? false;
    this.whitespace = whitespace ?? false;
    this.host = host;
    this.url = url;
    this.id = id;
    this.notes = notes;
    this.caches = caches;
    this.test = test ?? false;
  }
  public override readonly resources: {
    clock: number;
    recursions: number[];
    interval?: number;
  };
  public override segment: Segment;
  public header: boolean;
  public local: boolean;
  public whitespace: boolean;
  public recursion = new RecursionCounter(2);
  public readonly host?: URL;
  public readonly url?: URL;
  public id?: string;
  public notes?: {
    readonly references: HTMLOListElement;
  };
  public readonly caches?: {
    readonly code?: Dict<string, HTMLElement>;
    readonly math?: Dict<string, HTMLElement>;
    readonly media?: Dict<string, HTMLElement>;
  };
  public test: boolean;
}
export type Options = Partial<Input>;

class RecursionCounter {
  constructor(
    private readonly limit: number,
  ) {
  }
  private readonly stack: number[] = [];
  private index = 0;
  public add(depth: number): boolean {
    const { stack } = this
    for (; this.index > 0 && stack[this.index - 1] >= depth; --this.index);
    stack[this.index] = depth;
    ++this.index;
    // 内側から数えるので無効化処理できない。
    return this.index <= this.limit;
  }
}

export const enum Segment {
  unknown = 0,
  read = 0,
  write = 1,
  empty = 1 << 1,
  heading = 2 << 1,
  fig = 3 << 1,
  figure = 4 << 1,
}

export const enum State {
  annotation = 1 << 7,
  reference = 1 << 6,
  index = 1 << 5,
  label = 1 << 4,
  link = 1 << 3,
  media = 1 << 2,
  mark = 1 << 1,
  autolink = 1 << 0,
  linkers = 0
    | State.annotation
    | State.reference
    | State.index
    | State.label
    | State.link
    | State.mark
    | State.autolink,
}

export const enum Recursion {
  document,
  block,
  inline,
  bracket,
}

export const enum Backtrack {
  // 構文
  doublebracket = 1 << 7,
  link = 1 << 6,
  ruby = 1 << 5,
  // 特殊構造
  escapable = 1 << 4,
  unescapable = 1 << 3,
  // 共通構造
  common = 1 << 2,
}

export const enum Command {
  Cancel = '\x18',
  Escape = '\x1B',
  Separator = '\x1F',
}
