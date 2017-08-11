import { Parser, Result } from './src/combinator/parser';

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
      BlockParser.PreTextParser,
      BlockParser.MathBlockParser,
      BlockParser.ExtensionParser,
      BlockParser.ParagraphParser
    ]> {
  }
  export namespace BlockParser {
    export interface NewlineParser extends
      Markdown<'newline'>,
      Parser<never, [
        never
      ]> {
    }
    export interface HorizontalRuleParser extends
      // ---
      Markdown<'horizontalrule'>,
      Parser<HTMLHRElement, [
        never
      ]> {
    }
    export interface HeadingParser extends
      // # Title
      Markdown<'header'>,
      Parser<HTMLHeadingElement, [
        IndexerParser,
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
        IndexerParser,
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
        TextParser.PlainTextParser
      ] | [
        BlockParser
      ]> {
    }
    export interface PreTextParser extends
      // ```
      // abc
      // ```
      Markdown<'pretext'>,
      Parser<HTMLPreElement, [
        TextParser.PlainTextParser
      ]> {
    }
    export interface MathBlockParser extends
      // $$
      // expr
      // $$
      Markdown<'mathblock'>,
      Parser<HTMLDivElement, [
        TextParser.MathTextParser
      ]> {
    }
    export interface ExtensionParser extends
      // ~~~
      // ABC
      // : abc
      // ~~~
      Markdown<'extension'>,
      Parser<HTMLElement, Parser<HTMLElement, any>[]> {
    }
    export interface ParagraphParser extends
      // abc
      Markdown<'paragraph'>,
      Parser<HTMLParagraphElement, [
        InlineParser
      ]> {
    }
    export interface IndexerParser extends
      // [#index]
      Markdown<'indexer'>,
      Parser<HTMLElement, [
        TextParser.TextParser
      ]> {
    }
  }
  export interface InlineParser extends
    Markdown<'inline'>,
    Parser<HTMLElement | Text, [
      InlineParser.AnnotationParser,
      InlineParser.ParenthesisParser,
      InlineParser.InsertionParser,
      InlineParser.DeletionParser,
      InlineParser.StrongParser,
      InlineParser.EmphasisParser,
      InlineParser.SuperScriptParser,
      InlineParser.SubScriptParser,
      InlineParser.CodeParser,
      InlineParser.MathInlineParser,
      InlineParser.MediaParser,
      InlineParser.LinkParser,
      InlineParser.IndexParser,
      InlineParser.HTMLParser,
      InlineParser.HTMLEntityParser,
      InlineParser.AutolinkParser,
      TextParser.TextParser
    ]> {
  }
  export namespace InlineParser {
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
    export interface InsertionParser extends
      // ++abc++
      Markdown<'insertion'>,
      Parser<HTMLElement, [
        InlineParser
      ]> {
    }
    export interface DeletionParser extends
      // ~~abc~~
      Markdown<'deletion'>,
      Parser<HTMLElement, [
        InlineParser
      ]> {
    }
    export interface StrongParser extends
      // **abc**
      Markdown<'strong'>,
      Parser<HTMLElement, [
        InlineParser
      ]> {
    }
    export interface EmphasisParser extends
      // *abc*
      Markdown<'emphasis'>,
      Parser<HTMLElement, [
        InlineParser
      ]> {
    }
    export interface SuperScriptParser extends
      // ^abc^
      Markdown<'superscript'>,
      Parser<HTMLElement, [
        TextParser.TextParser
      ]> {
    }
    export interface SubScriptParser extends
      // ~abc~
      Markdown<'subscript'>,
      Parser<HTMLElement, [
        TextParser.TextParser
      ]> {
    }
    export interface CodeParser extends
      // `abc`
      Markdown<'code'>,
      Parser<HTMLElement, [
        TextParser.PlainTextParser
      ]> {
    }
    export interface MathInlineParser extends
      // $expr$
      Markdown<'mathinline'>,
      Parser<HTMLSpanElement, [
        TextParser.MathTextParser
      ]> {
    }
    export interface MediaParser extends
      // ![abc](url)
      Markdown<'media'>,
      Parser<HTMLImageElement, [
        TextParser.TextParser
      ]> {
    }
    export interface LinkParser extends
      // [abc](url)
      Markdown<'link'>,
      Parser<HTMLAnchorElement, [
        InlineParser
      ]> {
    }
    export interface IndexParser extends
      // [#a b]
      Markdown<'index'>,
      Parser<HTMLAnchorElement, [
        TextParser.TextParser
      ]> {
    }
    export interface HTMLParser extends
      // <small>abc</small>
      Markdown<'html'>,
      Parser<HTMLElement, [
        InlineParser
      ] | [
        TextParser.PlainTextParser
      ]> {
    }
    export interface HTMLEntityParser extends
      // &copy;
      Markdown<'htmlentity'>,
      Parser<Text, [
        never
      ]> {
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
        Parser<HTMLAnchorElement | HTMLImageElement | Text, [
          InlineParser |
          TextParser.TextParser
        ]> {
      }
      export interface AccountParser extends
        // @account
        Markdown<'account'>,
        Parser<HTMLSpanElement | Text, [
          never
        ]> {
      }
    }
  }
  export namespace TextParser {
    export interface TextParser extends
      // abc
      Markdown<'text'>,
      Parser<HTMLBRElement | Text, [
        never
      ]> {
    }
    export interface PlainTextParser extends
      // abc
      Markdown<'plaintext'>,
      Parser<Text, [
        never
      ]> {
    }
    export interface MathTextParser extends
      // abc
      Markdown<'mathtext'>,
      Parser<Text, [
        never
      ]> {
    }
  }
}
