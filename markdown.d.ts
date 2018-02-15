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
      BlockParser.ExtensionBlockParser,
      SourceParser.NonemptyLineParser,
      SourceParser.EmptyLineParser
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
      BlockParser.MathBlockParser,
      BlockParser.ExtensionBlockParser,
      BlockParser.ParagraphParser
    ]> {
  }
  export namespace BlockParser {
    export interface NewlineParser extends
      Markdown<'newline'>,
      Parser<never, never[]> {
    }
    export interface HorizontalRuleParser extends
      // ---
      Markdown<'horizontalrule'>,
      Parser<HTMLHRElement, never[]> {
    }
    export interface HeadingParser extends
      // # Title
      Markdown<'header'>,
      Parser<HTMLHeadingElement, [
        IndexParser,
        InlineParser
      ]> {
    }
    export interface UListParser extends
      // - item
      Markdown<'ulist'>,
      Parser<HTMLUListElement, [
        InlineParser
      ] | [
        UListParser,
        OListParser
      ]> {
    }
    export interface OListParser extends
      // 0. item
      Markdown<'olist'>,
      Parser<HTMLOListElement, [
        InlineParser
      ] | [
        UListParser,
        OListParser
      ]> {
    }
    export interface DListParser extends
      // ~ term
      // : description
      Markdown<'dlist'>,
      Parser<HTMLDListElement, [
        IndexParser,
        InlineParser
      ]> {
    }
    export interface TableParser extends
      // |Head|
      // |:--:|
      // |data|
      Markdown<'table'>,
      Parser<HTMLTableElement, [
        InlineParser
      ]> {
    }
    export interface BlockquoteParser extends
      // > abc
      Markdown<'blockquote'>,
      Parser<HTMLQuoteElement, [
        SourceParser.UnescapableSourceParser
      ] | [
        BlockParser
      ]> {
    }
    export interface PretextParser extends
      // ```
      // abc
      // ```
      Markdown<'pretext'>,
      Parser<HTMLPreElement, [
        SourceParser.UnescapableSourceParser
      ]> {
    }
    export interface MathBlockParser extends
      // $$
      // expr
      // $$
      Markdown<'mathblock'>,
      Parser<HTMLDivElement, [
        SourceParser.EscapableSourceParser
      ]> {
    }
    export interface ExtensionBlockParser extends
      // ~~~
      // ABC
      // : abc
      // ~~~
      Markdown<'extensionblock'>,
      Parser<HTMLElement, Parser<HTMLElement, ExtensionBlockParser[]>[]> {
    }
    export interface ParagraphParser extends
      // abc
      Markdown<'paragraph'>,
      Parser<HTMLParagraphElement, [
        ParagraphParser.ReferenceParser,
        Parser<HTMLElement | Text, [
          ParagraphParser.HashtagParser,
          InlineParser
        ]>
      ]> {
    }
    export namespace ParagraphParser {
      export interface ReferenceParser extends
        // >0a
        Markdown<'reference'>,
        Parser<HTMLSpanElement, [
          SourceParser.UnescapableSourceParser
        ]> {
      }
      export interface HashtagParser extends
        // #tag
        Markdown<'hashtag'>,
        Parser<HTMLAnchorElement | Text, [
          SourceParser.UnescapableSourceParser
        ]> {
      }
    }
    export interface IndexParser extends
      // [#index]
      Markdown<'index'>,
      Parser<HTMLAnchorElement, [
        InlineParser.ExtensionParser.IndexParser
      ]> {
    }
  }
  export interface InlineParser extends
    Markdown<'inline'>,
    Parser<HTMLElement | Text, [
      InlineParser.BraceParser,
      InlineParser.AnnotationParser,
      InlineParser.ParenthesisParser,
      InlineParser.LinkParser,
      InlineParser.ExtensionParser,
      InlineParser.BracketParser,
      InlineParser.HTMLParser,
      InlineParser.AngleBracketParser,
      InlineParser.EmphasisParser,
      InlineParser.StrongParser,
      InlineParser.CodeParser,
      InlineParser.MathInlineParser,
      InlineParser.MediaParser,
      InlineParser.HTMLEntityParser,
      InlineParser.AutolinkParser,
      SourceParser.TextParser
    ]> {
  }
  export namespace InlineParser {
    export interface BraceParser extends
      // {abc}
      Markdown<'brace'>,
      Parser<HTMLElement | Text, [
        InlineParser
      ]> {
    }
    export interface AnnotationParser extends
      // ((abc))
      Markdown<'annotation'>,
      Parser<HTMLElement, [
        InlineParser
      ]> {
    }
    export interface ParenthesisParser extends
      // (abc)
      Markdown<'parenthesis'>,
      Parser<HTMLElement | Text, [
        InlineParser
      ]> {
    }
    export interface LinkParser extends
      // [abc](url)
      Markdown<'link'>,
      Parser<HTMLAnchorElement, [
        InlineParser
      ] | [
        SourceParser.ParenthesisParser,
        SourceParser.EscapableSourceParser
      ]> {
    }
    export interface ExtensionParser extends
      // [#abc]
      Markdown<'extension'>,
      Parser<HTMLElement, [
        ExtensionParser.IndexParser,
        ExtensionParser.PlaceholderParser
      ]> {
    }
    export namespace ExtensionParser {
      export interface IndexParser extends
        // [#abc]
        Markdown<'extension' & 'extension/index'>,
        Parser<HTMLAnchorElement, [
          InlineParser
        ]> {
      }
      export interface PlaceholderParser extends
        // [:abc]
        Markdown<'extension' & 'extension/placeholder'>,
        Parser<HTMLSpanElement, [
          SourceParser.TextParser
        ]> {
      }
    }
    export interface BracketParser extends
      // [abc]
      Markdown<'bracket'>,
      Parser<HTMLElement | Text, [
        InlineParser
      ]> {
    }
    export interface HTMLParser extends
      // <small>abc</small>
      Markdown<'html'>,
      Parser<HTMLElement, [
        InlineParser
      ]> {
    }
    export interface AngleBracketParser extends
      // <abc>
      Markdown<'anglebracket'>,
      Parser<HTMLElement | Text, [
        InlineParser
      ]> {
    }
    export interface EmphasisParser extends
      // *abc*
      Markdown<'emphasis'>,
      Parser<HTMLElement, [
        InlineParser,
        StrongParser
      ]> {
    }
    export interface StrongParser extends
      // **abc**
      Markdown<'strong'>,
      Parser<HTMLElement, [
        InlineParser
      ]> {
    }
    export interface CodeParser extends
      // `abc`
      Markdown<'code'>,
      Parser<HTMLElement, [
        SourceParser.CharParser.BackquoteParser,
        SourceParser.UnescapableSourceParser
      ]> {
    }
    export interface MathInlineParser extends
      // $expr$
      Markdown<'mathinline'>,
      Parser<HTMLSpanElement, [
        SourceParser.EscapableSourceParser
      ]> {
    }
    export interface MediaParser extends
      // ![abc](url)
      Markdown<'media'>,
      Parser<HTMLElement, [
        SourceParser.TextParser
      ] | [
        SourceParser.ParenthesisParser,
        SourceParser.EscapableSourceParser
      ]> {
    }
    export interface HTMLEntityParser extends
      // &copy;
      Markdown<'htmlentity'>,
      Parser<Text, never[]> {
    }
    export interface AutolinkParser extends
      Markdown<'autolink'>,
      Parser<HTMLAnchorElement | HTMLImageElement | HTMLSpanElement | Text, [
        AutolinkParser.UrlParser,
        AutolinkParser.AccountParser
      ]> {
    }
    export namespace AutolinkParser {
      export interface UrlParser extends
        // https://host
        Markdown<'url'>,
        Parser<HTMLAnchorElement | Text, [
          UrlParser.IPV6Parser,
          SourceParser.ParenthesisParser,
          SourceParser.EscapableSourceParser
        ]> {
      }
      export namespace UrlParser {
        export interface IPV6Parser extends
          // [::]
          Markdown<'url/ipv6'>,
          Parser<Text, [
            SourceParser.EscapableSourceParser
          ]> {
        }
      }
      export interface AccountParser extends
        // @account
        Markdown<'account'>,
        Parser<HTMLAnchorElement | Text, never[]> {
      }
    }
  }
  export namespace SourceParser {
    export interface TextParser extends
      // abc
      Markdown<'text'>,
      Parser<HTMLBRElement | HTMLSpanElement | Text, never[]> {
    }
    export interface UnescapableSourceParser extends
      // abc
      Markdown<'unescsource'>,
      Parser<Text, never[]> {
    }
    export interface EscapableSourceParser extends
      // abc
      Markdown<'escsource'>,
      Parser<Text, never[]> {
    }
    export interface NonemptyLineParser extends
      Markdown<'nonemptyline'>,
      Parser<Text, never[]> {
    }
    export interface EmptyLineParser extends
      Markdown<'emptyline'>,
      Parser<Text, never[]> {
    }
    export interface ParenthesisParser extends
      // ()
      Markdown<'parenthesis'>,
      Parser<Text, [
        ParenthesisParser,
        EscapableSourceParser
      ]> {
    }
    export namespace CharParser {
      export interface BackquoteParser extends
        // `
        Markdown<'char:backquote'>,
        Parser<Text, never[]> {
      }
    }
  }
}
