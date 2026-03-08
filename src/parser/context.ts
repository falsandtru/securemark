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
  //ignore,
  block = 1,
  blockquote,
  listitem,
  inline,
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
