import { Parser } from './src/combinator';

declare abstract class Markdown<T> {
  private MARKDOWN?: T;
}
export interface MarkdownParser extends
  Markdown<'markdown'>,
  Parser<HTMLElement, [
    MarkdownParser.BlockParser
  ]> {
}
export namespace MarkdownParser {
  export interface SegmentParser extends
    Markdown<'segment'>,
    Parser<HTMLElement, [
      BlockParser.PretextParser,
      BlockParser.ExtensionParser,
      SourceParser.ContentLineParser,
      SourceParser.BlankLineParser
    ]> {
  }
  export interface BlockParser extends
    Markdown<'block'>,
    Parser<HTMLElement, [
      BlockParser.NewlineParser,
      BlockParser.HorizontalRuleParser,
      BlockParser.HeadingParser,
      BlockParser.UListParser,
      BlockParser.OListParser,
      BlockParser.DListParser,
      BlockParser.TableParser,
      BlockParser.BlockquoteParser,
      BlockParser.PretextParser,
      BlockParser.MathParser,
      BlockParser.ExtensionParser,
      BlockParser.ParagraphParser
    ]> {
  }
  export namespace BlockParser {
    interface Block<T> extends Markdown<['block', T]> { }
    export interface NewlineParser extends
      Block<'newline'>,
      Parser<never, [
        SourceParser.BlankLineParser
      ]> {
    }
    export interface HorizontalRuleParser extends
      // ---
      Block<'horizontalrule'>,
      Parser<HTMLHRElement, [
        SourceParser.ContentLineParser
      ]> {
    }
    export interface HeadingParser extends
      // # Title
      Block<'header'>,
      Parser<HTMLHeadingElement, [
        IndexerParser,
        InlineParser
      ]> {
    }
    export interface UListParser extends
      // - item
      Block<'ulist'>,
      Parser<HTMLUListElement, [
        InlineParser,
        Parser<HTMLUListElement | HTMLOListElement, [
          UListParser,
          OListParser
        ]>
      ]> {
    }
    export interface OListParser extends
      // 0. item
      Block<'olist'>,
      Parser<HTMLOListElement, [
        InlineParser,
        Parser<HTMLUListElement | HTMLOListElement, [
          UListParser,
          OListParser
        ]>
      ]> {
    }
    export interface DListParser extends
      // ~ term
      // : description
      Block<'dlist'>,
      Parser<HTMLDListElement, [
        DListParser.TermParser,
        DListParser.DescriptionParser
      ]> {
    }
    export namespace DListParser {
      export interface TermParser extends
        Block<'dlist/term'>,
        Parser<HTMLElement, [
          IndexerParser,
          InlineParser
        ]> {
      }
      export interface DescriptionParser extends
        Block<'dlist/description'>,
        Parser<HTMLElement, [
          InlineParser
        ]> {
      }
    }
    export interface TableParser extends
      // |Head|
      // |:--:|
      // |data|
      Block<'table'>,
      Parser<HTMLTableElement, [
        TableParser.RowParser,
        TableParser.RowParser,
        TableParser.RowParser
      ]> {
    }
    export namespace TableParser {
      export interface RowParser extends
        Block<'table/row'>,
        Parser<HTMLTableRowElement, [
          CellParser
        ]> {
      }
      export interface CellParser extends
        Block<'table/cell'>,
        Parser<HTMLTableDataCellElement, [
          DataParser |
          AlignParser
        ]> {
      }
      export interface DataParser extends
        Block<'table/data'>,
        Parser<HTMLElement | Text, [
          InlineParser
        ]> {
      }
      export interface AlignParser extends
        Block<'table/align'>,
        Parser<Text, Parser<Text, never[]>[]> {
      }
    }
    export interface BlockquoteParser extends
      // > abc
      Block<'blockquote'>,
      Parser<HTMLQuoteElement, Parser<HTMLElement | Text, never[]>[]> {
    }
    export interface PretextParser extends
      // ```
      // abc
      // ```
      Block<'pretext'>,
      Parser<HTMLPreElement, [
        SourceParser.UnescapableSourceParser
      ]> {
    }
    export interface MathParser extends
      // $$
      // expr
      // $$
      Block<'math'>,
      Parser<HTMLDivElement, [
        SourceParser.EscapableSourceParser
      ]> {
    }
    export interface ExtensionParser extends
      // ~~~
      // ABC
      // : abc
      // ~~~
      Block<'extension'>,
      Parser<HTMLElement, [
        ExtensionParser.FigureParser,
        ExtensionParser.PlaceholderParser
      ]> {
    }
    export namespace ExtensionParser {
      export interface FigureParser extends
        // ~~~figure [:type-name]
        // !https://host/image.png
        //
        // caption
        // ~~~
        Block<'extension/figure'>,
        Parser<HTMLElement, [
          Parser<HTMLElement, [
            TableParser,
            PretextParser,
            MathParser,
            InlineParser.AutolinkParser.UrlParser
          ]>,
          Parser<HTMLElement, [
            InlineParser
          ]>
        ]> {
      }
      export interface PlaceholderParser extends
        Block<'extension/placeholder'>,
        Parser<HTMLElement, never[]> {
      }
    }
    export interface ParagraphParser extends
      // abc
      Block<'paragraph'>,
      Parser<HTMLParagraphElement, [
        ParagraphParser.ReferenceParser,
        Parser<HTMLElement | Text, [
          ParagraphParser.HashtagParser,
          InlineParser, InlineParser
        ]>
      ]> {
    }
    export namespace ParagraphParser {
      export interface ReferenceParser extends
        // >0a
        Block<'paragraph/reference'>,
        Parser<HTMLAnchorElement | HTMLBRElement, [
          SourceParser.UnescapableSourceParser
        ]> {
      }
      export interface HashtagParser extends
        // #tag
        Block<'paragraph/hashtag'>,
        Parser<HTMLAnchorElement, [
          SourceParser.UnescapableSourceParser
        ]> {
      }
    }
    export interface IndexerParser extends
      // [#index]
      Block<'indexer'>,
      Parser<HTMLAnchorElement, [
        InlineParser.ExtensionParser.IndexParser
      ]> {
    }
  }
  export interface InlineParser extends
    Markdown<'inline'>,
    Parser<HTMLElement | Text, [
      InlineParser.CommentParser,
      InlineParser.AnnotationParser,
      InlineParser.LinkParser,
      InlineParser.ExtensionParser,
      InlineParser.HTMLParser,
      InlineParser.EmphasisParser,
      InlineParser.StrongParser,
      InlineParser.CodeParser,
      InlineParser.MathParser,
      InlineParser.MediaParser,
      InlineParser.BracketParser,
      InlineParser.HTMLEntityParser,
      InlineParser.AutolinkParser,
      SourceParser.TextParser
    ]> {
  }
  export namespace InlineParser {
    interface Inline<T> extends Markdown<['inline', T]> { }
    export interface AnnotationParser extends
      // ((abc))
      Inline<'annotation'>,
      Parser<HTMLElement, [
        InlineParser
      ]> {
    }
    export interface LinkParser extends
      // [abc](url)
      Inline<'link'>,
      Parser<HTMLAnchorElement, [
        InlineParser
      ] | [
        Parser<Text, [
          LinkParser.ParenthesisParser,
          SourceParser.TextParser
        ]>,
        LinkParser.AttributeParser
      ]> {
    }
    export namespace LinkParser {
      export interface ParenthesisParser extends
        // ()
        Inline<'link/parenthesis'>,
        Parser<Text, [
          ParenthesisParser,
          SourceParser.EscapableSourceParser
        ]> {
      }
      export interface AttributeParser extends
        // nofollow
        Inline<'link/attribute'>,
        Parser<Text, never[]> {
      }
    }
    export interface ExtensionParser extends
      // [#abc]
      Inline<'extension'>,
      Parser<HTMLElement, [
        ExtensionParser.IndexParser,
        ExtensionParser.LabelParser,
        ExtensionParser.PlaceholderParser
      ]> {
    }
    export namespace ExtensionParser {
      export interface IndexParser extends
        // [#index]
        Inline<'extension/index'>,
        Parser<HTMLAnchorElement, [
          LinkParser
        ]> {
      }
      export interface LabelParser extends
        // [:type-name]
        Inline<'extension/label'>,
        Parser<HTMLAnchorElement, [
          LinkParser
        ]> {
      }
      export interface PlaceholderParser extends
        // [^abc]
        Inline<'extension/placeholder'>,
        Parser<HTMLSpanElement, [
          InlineParser
        ]> {
      }
    }
    export interface CommentParser extends
      // <# comment #>
      Inline<'comment'>,
      Parser<never, never> {
    }
    export interface HTMLParser extends
      // <small>abc</small>
      Inline<'html'>,
      Parser<HTMLElement, [
        InlineParser
      ]> {
    }
    export interface EmphasisParser extends
      // *abc*
      Inline<'emphasis'>,
      Parser<HTMLElement, [
        StrongParser,
        InlineParser
      ]> {
    }
    export interface StrongParser extends
      // **abc**
      Inline<'strong'>,
      Parser<HTMLElement, [
        InlineParser
      ]> {
    }
    export interface CodeParser extends
      // `abc`
      Inline<'code'>,
      Parser<HTMLElement, [
        SourceParser.CharParser.BackquoteParser,
        SourceParser.UnescapableSourceParser
      ]> {
    }
    export interface MathParser extends
      // $expr$
      Inline<'math'>,
      Parser<HTMLSpanElement, [
        SourceParser.EscapableSourceParser
      ]> {
    }
    export interface MediaParser extends
      // ![abc](url)
      Inline<'media'>,
      Parser<HTMLElement, [
        SourceParser.TextParser
      ] | [
        LinkParser.ParenthesisParser,
        SourceParser.TextParser
      ]> {
    }
    export interface BracketParser extends
      // [abc]
      Inline<'bracket'>,
      Parser<HTMLElement | Text, InlineParser[]> {
    }
    export interface HTMLEntityParser extends
      // &copy;
      Inline<'htmlentity'>,
      Parser<Text, never[]> {
    }
    export interface AutolinkParser extends
      Inline<'autolink'>,
      Parser<HTMLAnchorElement | HTMLImageElement | HTMLSpanElement | Text, [
        AutolinkParser.UrlParser,
        AutolinkParser.AccountParser
      ]> {
    }
    export namespace AutolinkParser {
      export interface UrlParser extends
        // https://host
        Inline<'url'>,
        Parser<HTMLAnchorElement | Text, [
          Parser<Text, never[]>,
          Parser<HTMLAnchorElement, [
            Parser<Text, never[]>,
            LinkParser.ParenthesisParser,
            SourceParser.EscapableSourceParser
          ]>
        ]> {
      }
      export interface AccountParser extends
        // @account
        Inline<'account'>,
        Parser<HTMLAnchorElement | Text, [
          Parser<Text, never[]>,
          Parser<HTMLAnchorElement, never[]>
        ]> {
      }
    }
  }
  export namespace SourceParser {
    interface Source<T> extends Markdown<['source', T]> { }
    export interface TextParser extends
      // abc
      Source<'text'>,
      Parser<HTMLBRElement | HTMLSpanElement | Text, never[]> {
    }
    export interface UnescapableSourceParser extends
      // abc
      Source<'unescsource'>,
      Parser<Text, never[]> {
    }
    export interface EscapableSourceParser extends
      // abc
      Source<'escsource'>,
      Parser<Text, never[]> {
    }
    export interface EmptyLineParser extends
      Source<'emptyline'>,
      Parser<never, never[]> {
    }
    export interface BlankLineParser extends
      Source<'blankline'>,
      Parser<never, never[]> {
    }
    export interface ContentLineParser extends
      Source<'contentline'>,
      Parser<never, never[]> {
    }
    export namespace CharParser {
      export interface BackquoteParser extends
        // `
        Source<'char/backquote'>,
        Parser<Text, never[]> {
      }
    }
  }
}
