export const enum State {
  annotation = 1 << 7,
  reference = 1 << 6,
  index = 1 << 5,
  label = 1 << 4,
  link = 1 << 3,
  media = 1 << 2,
  mark = 1 << 1,
  autolink = 1 << 0,
  none = 0,
  all = ~0,
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
  ignore,
  block,
  blockquote,
  listitem,
  inline,
  bracket,
  terminal,
}

export const enum Backtrack {
  template = 7 << 2,
  index = 6 << 2,
  ruby = 5 << 2,
  link = 4 << 2,
  media = 3 << 2,
  url = 2 << 2,
  bracket = 1 << 2,
}
