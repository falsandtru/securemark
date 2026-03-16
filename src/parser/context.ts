import { List, Node, Context as Ctx } from '../../src/combinator/data/parser';
import { Dict } from 'spica/dict';

export class Context extends Ctx {
  constructor(
    options: Partial<Context> = {},
  ) {
    super(options);
    const {
      segment,
      buffer,
      sequential,
      header,
      host,
      url,
      id,
      caches,
    } = options;
    this.segment = segment ?? Segment.unknown;
    this.buffer = buffer ?? new List();
    this.sequential = sequential ?? false;
    this.header = header ?? true;
    this.host = host;
    this.url = url;
    this.id = id;
    this.caches = caches;
  }
  public override segment: Segment;
  public buffer: List<Node<(string | HTMLElement)>>;
  public sequential: boolean;
  public recursion = new RecursionCounter('annotation', 2);
  public readonly header: boolean;
  public readonly host?: URL;
  public readonly url?: URL;
  public readonly id?: string;
  public readonly caches?: {
    readonly code?: Dict<string, HTMLElement>;
    readonly math?: Dict<string, HTMLElement>;
    readonly media?: Dict<string, HTMLElement>;
  };
}
export type Options = Partial<Context>;

class RecursionCounter {
  constructor(
    private readonly syntax: string,
    private readonly limit: number,
  ) {
  }
  private readonly stack: number[] = [];
  private index = 0;
  public add(depth: number): void {
    const { stack } = this
    for (; this.index > 0 && stack[this.index - 1] <= depth; --this.index);
    // 内側から数えるので無効化処理できずエラーを投げるしかない。
    if (this.index === this.limit) throw new Error(`Too much ${this.syntax} recursion`);
    stack[this.index] = depth;
    ++this.index;
  }
}

export const enum Segment {
  unknown = 0,
  write = 1,
  nonempty = 0,
  empty = 1 << 1,
  heading = 3 << 1,
  fig = 4 << 1,
  figure = 5 << 1,
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
  block,
  blockquote,
  listitem,
  inline,
  annotation,
  bracket,
  terminal,
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
  Error = '\x07',
  Cancel = '\x18',
  Escape = '\x1B',
  Separator = '\x1F',
}

export const CmdRegExp = {
  Error: /\x07/g,
} as const;
