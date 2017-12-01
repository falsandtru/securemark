import { Parser } from './src/combinator';

declare abstract class Markdown<T> {
  private MARKDOWN?: T;
}
export interface MarkdownParser extends
  Markdown<'markdown'>,
  Parser<HTMLElement, MarkdownParser.InnerParsers> {
}
export namespace MarkdownParser {
  export type InnerParsers = [
    MarkdownParser.BlockParser
  ];
}
export namespace MarkdownParser {
  export interface SegmentParser extends
    Markdown<'segment'> {
  }
  export namespace SegmentParser {
    export type InnerParsers = [
      BlockParser.PretextParser,
      BlockParser.ExtensionBlockParser,
      SourceParser.NonemptyLineParser,
      SourceParser.EmptyLineParser
    ];
  }
  export interface BlockParser extends
    Markdown<'block'>,
    Parser<HTMLElement, BlockParser.InnerParsers> {
  }
  export namespace BlockParser {
    export type InnerParsers = [
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
    ];
    export interface NewlineParser extends
      Markdown<'newline'>,
      Parser<never, NewlineParser.InnerParsers> {
    }
    export namespace NewlineParser {
      export type InnerParsers = never[];
    }
    export interface HorizontalRuleParser extends
      // ---
      Markdown<'horizontalrule'>,
      Parser<HTMLHRElement, HorizontalRuleParser.InnerParsers> {
    }
    export namespace HorizontalRuleParser {
      export type InnerParsers = never[];
    }
    export interface HeadingParser extends
      // # Title
      Markdown<'header'>,
      Parser<HTMLHeadingElement, HeadingParser.InnerParsers> {
    }
    export namespace HeadingParser {
      export type InnerParsers = [
        IndexerParser,
        InlineParser
      ];
    }
    export interface UListParser extends
      // - item
      Markdown<'ulist'>,
      Parser<HTMLUListElement, UListParser.InnerParsers> {
    }
    export namespace UListParser {
      export type InnerParsers = [
        InlineParser
      ] | [
        UListParser,
        OListParser
      ];
    }
    export interface OListParser extends
      // 0. item
      Markdown<'olist'>,
      Parser<HTMLOListElement, OListParser.InnerParsers> {
    }
    export namespace OListParser {
      export type InnerParsers = [
        InlineParser
      ] | [
        UListParser,
        OListParser
      ];
    }
    export interface DListParser extends
      // ~ term
      // : description
      Markdown<'dlist'>,
      Parser<HTMLDListElement, DListParser.InnerParsers> {
    }
    export namespace DListParser {
      export type InnerParsers = [
        IndexerParser,
        InlineParser
      ];
    }
    export interface TableParser extends
      // |Head|
      // |:--:|
      // |data|
      Markdown<'table'>,
      Parser<HTMLTableElement, TableParser.InnerParsers> {
    }
    export namespace TableParser {
      export type InnerParsers = [
        InlineParser
      ];
    }
    export interface BlockquoteParser extends
      // > abc
      Markdown<'blockquote'>,
      Parser<HTMLQuoteElement, BlockquoteParser.InnerParsers> {
    }
    export namespace BlockquoteParser {
      export type InnerParsers = [
        SourceParser.UnescapableSourceParser
      ] | [
        BlockParser
      ];
    }
    export interface PretextParser extends
      // ```
      // abc
      // ```
      Markdown<'pretext'>,
      Parser<HTMLPreElement, PretextParser.InnerParsers> {
    }
    export namespace PretextParser {
      export type InnerParsers = [
        SourceParser.UnescapableSourceParser
      ];
    }
    export interface MathBlockParser extends
      // $$
      // expr
      // $$
      Markdown<'mathblock'>,
      Parser<HTMLDivElement, MathBlockParser.InnerParsers> {
    }
    export namespace MathBlockParser {
      export type InnerParsers = [
        SourceParser.EscapableSourceParser
      ];
    }
    export interface ExtensionBlockParser extends
      // ~~~
      // ABC
      // : abc
      // ~~~
      Markdown<'extensionblock'>,
      Parser<HTMLElement, ExtensionBlockParser.InnerParsers> {
    }
    export namespace ExtensionBlockParser {
      export type InnerParsers = Parser<HTMLElement, ExtensionBlockParser[]>[];
    }
    export interface ParagraphParser extends
      // abc
      Markdown<'paragraph'>,
      Parser<HTMLParagraphElement, ParagraphParser.InnerParsers> {
    }
    export namespace ParagraphParser {
      export type InnerParsers = [
        InlineParser
      ];
    }
    export interface IndexerParser extends
      // [#index]
      Markdown<'indexer'>,
      Parser<HTMLElement, IndexerParser.InnerParsers> {
    }
    export namespace IndexerParser {
      export type InnerParsers = [
        InlineParser.ExtensionParser.IndexParser
      ];
    }
  }
  export interface InlineParser extends
    Markdown<'inline'>,
    Parser<HTMLElement | Text, InlineParser.InnerParsers> {
  }
  export namespace InlineParser {
    export type InnerParsers = [
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
    ];
  }
  export namespace InlineParser {
    export interface BraceParser extends
      // {abc}
      Markdown<'brace'>,
      Parser<HTMLElement | Text, BraceParser.InnerParsers> {
    }
    export namespace BraceParser {
      export type InnerParsers = [
        InlineParser
      ];
    }
    export interface AnnotationParser extends
      // ((abc))
      Markdown<'annotation'>,
      Parser<HTMLElement, AnnotationParser.InnerParsers> {
    }
    export namespace AnnotationParser {
      export type InnerParsers = [
        InlineParser
      ];
    }
    export interface ParenthesisParser extends
      // (abc)
      Markdown<'parenthesis'>,
      Parser<HTMLElement | Text, ParenthesisParser.InnerParsers> {
    }
    export namespace ParenthesisParser {
      export type InnerParsers = [
        InlineParser
      ];
    }
    export interface LinkParser extends
      // [abc](url)
      Markdown<'link'>,
      Parser<HTMLAnchorElement, LinkParser.InnerParsers> {
    }
    export namespace LinkParser {
      export type InnerParsers = [
        InlineParser
      ];
    }
    export interface ExtensionParser extends
      // [#abc]
      Markdown<'extension'>,
      Parser<HTMLElement, ExtensionParser.InnerParsers> {
    }
    export namespace ExtensionParser {
      export type InnerParsers = [
        ExtensionParser.IndexParser,
        ExtensionParser.PlaceholderParser
      ];
      export interface IndexParser extends
        // [#abc]
        Markdown<'extension' & 'extension/index'>,
        Parser<HTMLAnchorElement, IndexerParser.InnerParsers> {
      }
      export namespace IndexerParser {
        export type InnerParsers = [
          SourceParser.TextParser
        ];
      }
      export interface PlaceholderParser extends
        // [:abc]
        Markdown<'extension' & 'extension/placeholder'>,
        Parser<HTMLSpanElement, PlaceholderParser.InnerParsers> {
      }
      export namespace PlaceholderParser {
        export type InnerParsers = [
          SourceParser.TextParser
        ];
      }
    }
    export interface BracketParser extends
      // [abc]
      Markdown<'bracket'>,
      Parser<HTMLElement | Text, BracketParser.InnerParsers> {
    }
    export namespace BracketParser {
      export type InnerParsers = [
        InlineParser
      ];
    }
    export interface HTMLParser extends
      // <small>abc</small>
      Markdown<'html'>,
      Parser<HTMLElement, HTMLParser.InnerParsers> {
    }
    export namespace HTMLParser {
      export type InnerParsers = [
        InlineParser
      ];
    }
    export interface AngleBracketParser extends
      // <abc>
      Markdown<'anglebracket'>,
      Parser<HTMLElement | Text, AngleBracketParser.InnerParsers> {
    }
    export namespace AngleBracketParser {
      export type InnerParsers = [
        InlineParser
      ];
    }
    export interface EmphasisParser extends
      // *abc*
      Markdown<'emphasis'>,
      Parser<HTMLElement, EmphasisParser.InnerParsers> {
    }
    export namespace EmphasisParser {
      export type InnerParsers = [
        InlineParser,
        StrongParser
      ];
    }
    export interface StrongParser extends
      // **abc**
      Markdown<'strong'>,
      Parser<HTMLElement, StrongParser.InnerParsers> {
    }
    export namespace StrongParser {
      export type InnerParsers = [
        InlineParser
      ];
    }
    export interface CodeParser extends
      // `abc`
      Markdown<'code'>,
      Parser<HTMLElement, CodeParser.InnerParsers> {
    }
    export namespace CodeParser {
      export type InnerParsers = [
        SourceParser.BackquoteParser,
        SourceParser.UnescapableSourceParser
      ];
    }
    export interface MathInlineParser extends
      // $expr$
      Markdown<'mathinline'>,
      Parser<HTMLSpanElement, MathInlineParser.InnerParsers> {
    }
    export namespace MathInlineParser {
      export type InnerParsers = [
        SourceParser.EscapableSourceParser
      ];
    }
    export interface MediaParser extends
      // ![abc](url)
      Markdown<'media'>,
      Parser<HTMLImageElement, MediaParser.InnerParsers> {
    }
    export namespace MediaParser {
      export type InnerParsers = [
        SourceParser.TextParser
      ];
    }
    export interface HTMLEntityParser extends
      // &copy;
      Markdown<'htmlentity'>,
      Parser<Text, HTMLEntityParser.InnerParsers> {
    }
    export namespace HTMLEntityParser {
      export type InnerParsers = never[];
    }
    export interface AutolinkParser extends
      Markdown<'autolink'>,
      Parser<HTMLAnchorElement | HTMLImageElement | HTMLSpanElement | Text, AutolinkParser.InnerParsers> {
    }
    export namespace AutolinkParser {
      export type InnerParsers = [
        AutolinkParser.UrlParser,
        AutolinkParser.AccountParser
      ];
      export interface UrlParser extends
        // https://host
        Markdown<'url'>,
        Parser<HTMLAnchorElement | Text, UrlParser.InnerParsers> {
      }
      export namespace UrlParser {
        export type InnerParsers = [
          InlineParser
        ];
      }
      export interface AccountParser extends
        // @account
        Markdown<'account'>,
        Parser<HTMLSpanElement | Text, AccountParser.InnerParsers> {
      }
      export namespace AccountParser {
        export type InnerParsers = never[];
      }
    }
  }
  export namespace SourceParser {
    export interface TextParser extends
      // abc
      Markdown<'text'>,
      Parser<HTMLBRElement | Text, TextParser.InnerParsers> {
    }
    export namespace TextParser {
      export type InnerParsers = never[];
    }
    export interface UnescapableSourceParser extends
      // abc
      Markdown<'unescsource'>,
      Parser<Text, UnescapableSourceParser.InnerParsers> {
    }
    export namespace UnescapableSourceParser {
      export type InnerParsers = never[];
    }
    export interface EscapableSourceParser extends
      // abc
      Markdown<'escsource'>,
      Parser<Text, EscapableSourceParser.InnerParsers> {
    }
    export namespace EscapableSourceParser {
      export type InnerParsers = never[];
    }
    export interface NonemptyLineParser extends
      Markdown<'nonemptyline'>,
      Parser<Text, NonemptyLineParser.InnerParsers> {
    }
    export namespace NonemptyLineParser {
      export type InnerParsers = never[];
    }
    export interface EmptyLineParser extends
      Markdown<'emptyline'>,
      Parser<Text, EmptyLineParser.InnerParsers> {
    }
    export namespace EmptyLineParser {
      export type InnerParsers = never[];
    }
    export interface BackquoteParser extends
      // `
      Markdown<'backquote'>,
      Parser<Text, BackquoteParser.InnerParsers> {
    }
    export namespace BackquoteParser {
      export type InnerParsers = never[];
    }
  }
}
