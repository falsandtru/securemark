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
  link = 1 << 7,
  ruby = 1 << 6,
  linedoublebracket = 1 << 5,
  linebracket = 1 << 4,
  bracket = 1 << 3,
  lineescbracket = 1 << 2,
  lineunescbracket = 0 << 2,
}
// バックトラックを削減するため括弧派生構文を改行禁止し
// 括弧派生構文内のバックトラック状態を統一する。
export const enum BacktrackState {
  nobreak = 1,
}

export const enum Command {
  Error = '\x07',
  Escape = '\x1B',
  Separator = '\x1F',
}

export const CmdRegExp = {
  Error: /\x07/g,
} as const;
