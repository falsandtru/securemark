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
      BlockParser.ExtensionBlockParser,
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
        SourceParser.UnescapableSourceParser
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
      Parser<HTMLElement, [
        ExtensionBlockParser.PlaceholderParser
      ]> {
    }
    export namespace ExtensionBlockParser {
      export interface PlaceholderParser extends
        // ~~~
        // ABC
        // : abc
        // ~~~
        Markdown<'extensionblock' & 'extensionblock/placeholder'>,
        Parser<HTMLElement, [
          PreTextParser
        ]> {
      }
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
        InlineParser.ExtensionParser.IndexParser
      ]> {
    }
  }
  export interface InlineParser extends
    Markdown<'inline'>,
    Parser<HTMLElement | Text, [
      InlineParser.AnnotationParser,
      InlineParser.ParenthesisParser,
      InlineParser.StrongParser,
      InlineParser.EmphasisParser,
      InlineParser.CodeParser,
      InlineParser.MathInlineParser,
      InlineParser.MediaParser,
      InlineParser.LinkParser,
      InlineParser.ExtensionParser,
      InlineParser.HTMLParser,
      InlineParser.HTMLEntityParser,
      InlineParser.AutolinkParser,
      SourceParser.TextParser
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
    export interface CodeParser extends
      // `abc`
      Markdown<'code'>,
      Parser<HTMLElement, [
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
      Parser<HTMLImageElement, [
        SourceParser.TextParser
      ]> {
    }
    export interface LinkParser extends
      // [abc](url)
      Markdown<'link'>,
      Parser<HTMLAnchorElement, [
        InlineParser
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
          SourceParser.TextParser
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
    export interface HTMLParser extends
      // <small>abc</small>
      Markdown<'html'>,
      Parser<HTMLElement, [
        InlineParser
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
        Parser<HTMLAnchorElement | Text, [
          InlineParser
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
  export namespace SourceParser {
    export interface TextParser extends
      // abc
      Markdown<'text'>,
      Parser<HTMLBRElement | Text, [
        never
      ]> {
    }
    export interface UnescapableSourceParser extends
      // abc
      Markdown<'unescsource'>,
      Parser<Text, [
        never
      ]> {
    }
    export interface EscapableSourceParser extends
      // abc
      Markdown<'escsource'>,
      Parser<Text, [
        never
      ]> {
    }
  }
}
